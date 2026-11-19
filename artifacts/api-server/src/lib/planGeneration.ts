import { z } from "zod/v4";
import type { Logger } from "pino";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { lawnGuide, generatePlan as ruleBasedPlan, type IssueKey } from "@workspace/lawn-guide";

// Same model as the yard analysis.
const MODEL = "claude-haiku-4-5";
// A full plan is much longer than the yard analysis (10-20s observed), so it gets more time.
const TIMEOUT_MS = 30000;
const MAX_ATTEMPTS = 2; // first try + one retry

export const RESEED_REMINDER = "Keep the seeded spots lightly moist. Only reseed spots with no sprouts after 14 days.";
const TROUBLE_TITLE = "Fix the trouble spots";

export interface PlanInput {
  zip: string;
  grassType: string;
  confirmedIssues: Array<{ key: IssueKey; evidence: string }>;
  goals: string[];
  today: string; // YYYY-MM-DD
}

const weekSchema = z.object({
  week: z.number().int(),
  title: z.string().min(1),
  mow: z.string().min(1),
  water: z.string().min(1),
  fertilize: z.string().min(1),
  extra: z.array(z.string()),
  why: z.string().min(1),
});

/** Shape the model must return: 4-6 weeks numbered 1..n. */
const modelOutputSchema = z.object({
  summary: z.string().min(1),
  weeks: z
    .array(weekSchema)
    .min(4)
    .max(6)
    .refine((weeks) => weeks.every((w, i) => w.week === i + 1), {
      message: "weeks must be numbered 1, 2, 3... in order",
    }),
});

type ModelOutput = z.infer<typeof modelOutputSchema>;
export type PlanWeek = Omit<ModelOutput["weeks"][number], "why"> & { why?: string };
export type PlanResult = { source: "ai" | "fallback"; summary: string; weeks: PlanWeek[] };

const SYSTEM_PROMPT = `You write short lawn-care plans for first-time homeowners.

You receive JSON with today's date, the calendar dates of each plan week, the region, the grass type with its guide data (mow height and frequency, water amount and timing, fertilizer guidance), the issues the homeowner confirmed (each with a guide tip), and their goals.

Return ONLY a JSON object, with no prose and no code fences, in exactly this shape:
{
  "summary": "<2-3 friendly sentences>",
  "weeks": [
    { "week": 1, "title": "<short title>", "mow": "...", "water": "...", "fertilize": "...",
      "extra": ["<issue fix or helpful step>", ...], "why": "<one sentence on why this week looks like this>" }
  ]
}

Rules:
1. Write 4 to 6 weeks, numbered 1, 2, 3... in order. They are CONSECUTIVE calendar weeks starting today; "weekDates" gives each week's dates. The whole plan covers only those dates, so never jump ahead to a later season. Each week's title and "why" must fit the season shown next to its dates.
2. Base timing on those dates and the region. Think about what the grass is doing during those weeks. For example: in late fall, cool-season grass is slowing down (mowing can taper off and the last feeding of the year belongs before growth stops), and warm-season grass is going dormant and must NOT get nitrogen. Never schedule a step for a season it doesn't fit.
3. Only include fixes for the confirmedIssues, using their guide tips. If confirmedIssues is empty, write a routine-maintenance plan: no seeding, no weed steps, no shade steps, and no week titled "Fix the trouble spots".
4. Do not mention seeding, seed, or sprouts unless "bare" or "thin" is confirmed. Do not mention weeds or weed products unless "weeds" is confirmed. Do not mention shade unless "shade" is confirmed. These limits apply even when a confirmed issue's tip mentions them (for example, leave out the seed-blend suggestion in the shade tip unless "bare" or "thin" is also confirmed).
5. Seeding (only if seedingApplies is true): "seedingWeek" is the first week when seeding fits this grass and season.
   - If seedingWeek is a number: give the full seeding step ONCE, in that week. In every later week, say exactly: "${RESEED_REMINDER}" Do not repeat the full seeding step, and do not seed before that week.
   - If seedingWeek is null: it is the wrong season to seed. Do NOT tell them to spread seed and do not use the reminder sentence. Instead give a simple step for now (for example rake and mark the bare or thin spots) and say in plain words which season to seed ("seedingSeason").
6. Mow heights, water amounts, and fertilizer rates must come ONLY from the guide data you were given. Copy numbers exactly as written there. Do not invent numbers and do not do arithmetic to make new ones: if a tip says "about half an inch higher", write those words, not a calculated height. Any number in your plan must appear in the input JSON (a week number like "week 2" is fine).
7. Respect the timing in the fertilizer guidance. If it says something like "every 6-8 weeks", never schedule two feedings closer together than that; usually that means at most one feeding in this plan. If it names the best season for feeding, use that.
8. No brand names. Whenever you mention a fertilizer or weed product, say "follow the product label".
9. If a week has no fertilizer, say so plainly (for example "No fertilizer this week.").
10. Plain, friendly language for a first-time homeowner. Short sentences, no jargon. "extra" may be an empty array.`;

function extractJson(raw: string): unknown {
  const unfenced = raw.replace(/```(?:json)?/gi, "").trim();
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("No JSON object in model output");
  return JSON.parse(unfenced.slice(start, end + 1));
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const PLAN_WEEKS = 6;

/** Start and end date of each of the 6 possible plan weeks. */
function planWeeks(today: string): Array<{ start: Date; end: Date }> {
  const [y, m, d] = today.split("-").map(Number) as [number, number, number];
  return Array.from({ length: PLAN_WEEKS }, (_, i) => ({
    start: new Date(Date.UTC(y, m - 1, d + i * 7)),
    end: new Date(Date.UTC(y, m - 1, d + i * 7 + 6)),
  }));
}

// US seasons by month (1-12), used to label each plan week so titles and
// "why" lines stay in the right season.
const SEASON_BY_MONTH = [
  "", "mid winter", "late winter", "early spring", "mid spring", "late spring", "early summer",
  "mid summer", "late summer", "early fall", "mid fall", "late fall", "early winter",
];

const fmtDate = (date: Date) => `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;

/** First plan week (1-based) that starts in a seeding month for this grass, or null. */
export function seedingWeek(today: string, season: keyof typeof lawnGuide.seedingMonths): number | null {
  const months = lawnGuide.seedingMonths[season] ?? [];
  const index = planWeeks(today).findIndex((w) => months.includes(w.start.getUTCMonth() + 1));
  return index === -1 ? null : index + 1;
}

function guideContext(input: PlanInput) {
  const grass = lawnGuide.grassTypes[input.grassType]!;
  const region = lawnGuide.regions[input.zip.charAt(0)]!;
  const confirmed = new Set(input.confirmedIssues.map((i) => i.key));
  const seedingApplies = confirmed.has("bare") || confirmed.has("thin");
  return {
    today: input.today,
    weekDates: planWeeks(input.today).map(
      (w, i) => `Week ${i + 1}: ${fmtDate(w.start)} - ${fmtDate(w.end)} (${SEASON_BY_MONTH[w.start.getUTCMonth() + 1]})`,
    ),
    region: { name: region.name, climate: region.climate, note: lawnGuide.climateNotes[region.climate] ?? "" },
    grass: {
      name: grass.label,
      season: grass.season,
      mow: grass.mow,
      water: grass.water,
      fertilize: grass.fertilize,
    },
    confirmedIssues: input.confirmedIssues.map((i) => ({
      key: i.key,
      label: lawnGuide.issues[i.key].label,
      homeownerSaid: i.evidence,
      tip: lawnGuide.issues[i.key].tip,
    })),
    goals: input.goals,
    seedingApplies,
    ...(seedingApplies && {
      seedingWeek: seedingWeek(input.today, grass.season),
      seedingSeason: (lawnGuide.seedingMonths[grass.season] ?? []).map((m) => MONTHS[m - 1]).join(", "),
    }),
  };
}

const TOPIC_PATTERNS: Array<{ topic: string; allowedBy: IssueKey[]; pattern: RegExp }> = [
  {
    topic: "seeding",
    allowedBy: ["bare", "thin"],
    pattern: /\b(seeds?|seeded|seeding|seedlings?|overseed\w*|reseed\w*|sprouts?)\b/i,
  },
  {
    topic: "weeds",
    allowedBy: ["weeds"],
    // "weed-and-feed" can appear in the grass guide's own fertilizer warning.
    pattern: /\b(weed(?!-and-feed)\w*|dandelions?|crabgrass|herbicides?|pre-emergent)\b/i,
  },
  { topic: "shade", allowedBy: ["shade"], pattern: /\b(shade|shady|shaded)\b/i },
];

const numbersIn = (text: string) => text.match(/\d+(?:\.\d+)?/g) ?? [];

/**
 * Content rules checked in code. Returns the reasons the plan must be rejected
 * (empty when it passes).
 */
function ruleViolations(plan: ModelOutput, input: PlanInput, context: object): string[] {
  const confirmed = new Set(input.confirmedIssues.map((i) => i.key));
  const allText = [
    plan.summary,
    ...plan.weeks.flatMap((w) => [w.title, w.mow, w.water, w.fertilize, w.why, ...w.extra]),
  ].join("\n");
  const problems: string[] = [];

  for (const { topic, allowedBy, pattern } of TOPIC_PATTERNS) {
    if (allowedBy.some((k) => confirmed.has(k))) continue;
    const hit = allText.match(pattern);
    if (hit) problems.push(`mentions ${topic} ("${hit[0]}") but no matching issue was confirmed`);
  }

  const seedWeek = (confirmed.has("bare") || confirmed.has("thin"))
    ? seedingWeek(input.today, lawnGuide.grassTypes[input.grassType]!.season)
    : null;
  if (seedWeek === null && allText.includes(RESEED_REMINDER)) {
    problems.push("schedules seeding in a season when this grass should not be seeded");
  }

  if (confirmed.size === 0 && plan.weeks.some((w) => w.title.trim().toLowerCase() === TROUBLE_TITLE.toLowerCase())) {
    problems.push(`uses the title "${TROUBLE_TITLE}" with no confirmed issues`);
  }

  // Every number must come from the data we sent (guide values, tips, dates),
  // apart from week references like "week 2".
  const allowed = new Set([...numbersIn(JSON.stringify(context)), ...numbersIn(RESEED_REMINDER)]);
  const withoutWeekRefs = allText.replace(/\bweeks?\s+\d+(?:\s*(?:-|–|and|to)\s*\d+)?/gi, "");
  const invented = [...new Set(numbersIn(withoutWeekRefs).filter((n) => !allowed.has(n)))];
  if (invented.length) problems.push(`uses numbers not in the guide data: ${invented.join(", ")}`);

  return problems;
}

/**
 * After the seeding week, every week should carry the reseed reminder. The model
 * sometimes drops it, so add it to "extra" where it's missing.
 */
function addReseedReminders(plan: ModelOutput, input: PlanInput): ModelOutput {
  const keys = new Set(input.confirmedIssues.map((i) => i.key));
  if (!keys.has("bare") && !keys.has("thin")) return plan;
  const seedWeek = seedingWeek(input.today, lawnGuide.grassTypes[input.grassType]!.season);
  if (seedWeek === null) return plan;
  return {
    ...plan,
    weeks: plan.weeks.map((w) => {
      if (w.week <= seedWeek) return w;
      const text = [w.mow, w.water, w.fertilize, ...w.extra].join(" ");
      return text.includes(RESEED_REMINDER) ? w : { ...w, extra: [...w.extra, RESEED_REMINDER] };
    }),
  };
}

async function callModel(context: object): Promise<string> {
  const message = await anthropic.messages.create(
    {
      model: MODEL,
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(context) }],
    },
    { timeout: TIMEOUT_MS, maxRetries: 0 },
  );
  return message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
}

/** The existing rule-based generatePlan, limited to the confirmed issues. */
export function fallbackPlan(input: PlanInput): PlanResult {
  const plan = ruleBasedPlan({
    zip: input.zip,
    grassType: input.grassType,
    issueKeys: input.confirmedIssues.map((i) => i.key),
  });
  return { source: "fallback", summary: plan.summary, weeks: plan.weeks };
}

export async function generateLawnPlan(input: PlanInput, log: Logger): Promise<PlanResult> {
  const context = guideContext(input);
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const raw = await callModel(context);
      const parsed = modelOutputSchema.safeParse(extractJson(raw));
      if (!parsed.success) {
        log.warn({ attempt, raw, error: parsed.error.message }, "generate-plan: model output failed validation");
        continue;
      }
      const problems = ruleViolations(parsed.data, input, context);
      if (problems.length) {
        log.warn({ attempt, problems, plan: parsed.data }, "generate-plan: plan broke the rules, rejected");
        continue;
      }
      return { source: "ai", ...addReseedReminders(parsed.data, input) };
    } catch (err) {
      log.warn({ attempt, err: err instanceof Error ? err.message : String(err) }, "generate-plan: model call failed");
    }
  }
  return fallbackPlan(input);
}
