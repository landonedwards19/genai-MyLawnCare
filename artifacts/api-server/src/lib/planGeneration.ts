import { z } from "zod/v4";
import type { Logger } from "pino";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import {
  lawnGuide,
  generatePlan as ruleBasedPlan,
  MONTHS,
  RESEED_REMINDER,
  TOPIC_PATTERNS,
  seasonOf,
  planWeeks,
  seedingWeek,
  isDormant,
  weeklyWateringIn,
  feedingAllowed,
  saysNoFeeding,
  titleSeasonMismatch,
  amountsIn,
  allowedAmounts,
  type IssueKey,
} from "@workspace/lawn-guide";

// Same model as the yard analysis.
const MODEL = "claude-haiku-4-5";
// A full plan is much longer than the yard analysis (10-20s observed), so it gets more time.
const TIMEOUT_MS = 30000;
const MAX_ATTEMPTS = 2; // first try + one retry

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

You receive JSON with today's date, the calendar dates of each plan week, the region, the grass type with its guide data (mow height and frequency, water amount and timing, fertilizer guidance, and a dormant-season entry when some weeks are dormant), the issues the homeowner confirmed (each with a guide tip), and their goals.

Return ONLY a JSON object, with no prose and no code fences, in exactly this shape:
{
  "summary": "<2-3 friendly sentences>",
  "weeks": [
    { "week": 1, "title": "<short title>", "mow": "...", "water": "...", "fertilize": "...",
      "extra": ["<issue fix or helpful step>", ...], "why": "<one sentence on why this week looks like this>" }
  ]
}

Rules:
1. Write 4 to 6 weeks, numbered 1, 2, 3... in order. They are CONSECUTIVE calendar weeks starting today; "weekDates" gives each week's dates. The whole plan covers only those dates, so never jump ahead to a later season. Each week's title and "why" must fit the season shown next to its dates; if a title names a season, use that week's season (for example "Early Winter", not "Late Winter", in December).
2. Base timing on those dates and the region. Think about what the grass is doing during those weeks. For example: in late fall, cool-season grass is slowing down (mowing can taper off and the last feeding of the year belongs before growth stops), and warm-season grass is going dormant and must NOT get nitrogen. Never schedule a step for a season it doesn't fit.
3. Only include fixes for the confirmedIssues, using their guide tips. If confirmedIssues is empty, write a routine-maintenance plan: no seeding, no weed steps, no shade steps, and no week titled "Fix the trouble spots".
4. Do not mention seeding, seed, or sprouts unless "bare" or "thin" is confirmed. Do not mention weeds or weed products unless "weeds" is confirmed. Do not mention shade unless "shade" is confirmed. These limits apply even when a confirmed issue's tip mentions them (for example, leave out the seed-blend suggestion in the shade tip unless "bare" or "thin" is also confirmed).
5. Seeding (only if seedingApplies is true): "seedingWeek" is the first week when seeding fits this grass and season.
   - If seedingWeek is a number: give the full seeding step ONCE, in that week. In every later week, say exactly: "${RESEED_REMINDER}" Do not repeat the full seeding step, and do not seed before that week.
   - If seedingWeek is null: it is the wrong season to seed. Do NOT tell them to spread seed and do not use the reminder sentence. Instead give a simple step for now (for example rake and mark the bare or thin spots) and say in plain words which season to seed ("seedingSeason").
6. Mow heights, water amounts, and fertilizer rates must come ONLY from the guide data you were given. Copy numbers exactly as written there. Do not invent numbers and do not do arithmetic to make new ones: if a tip says "about half an inch higher", write those words, not a calculated height. Any amount with a unit (inches, days, weeks, lb) must appear with that same unit in the grass guide data, a confirmed issue's tip, or the reseed sentence; a week number like "week 2" is fine. Avoid other durations such as "for 2 weeks".
7. Dormant weeks: a week whose weekDates entry says "dormant" (also listed in "dormantWeeks") uses grass.dormantSeason for its mow, water, and fertilize text instead of the regular entries. Never recommend weekly watering in a dormant week (no "per week", "weekly", "once a week", or "this week" watering); only say to water if there has been no rain or snow for the time given in dormantSeason.
8. A week whose weekDates entry says "no fertilizer" must get NO fertilizer of any kind, even if the guide's fertilizer text suggests a feeding. Respect the timing in the fertilizer guidance. If it says something like "every 6-8 weeks", never schedule two feedings closer together than that; usually that means at most one feeding in this plan. If it names the best season for feeding, use that.
9. No brand names. Whenever you mention a fertilizer or weed product, say "follow the product label".
10. If a week has no fertilizer, START its "fertilize" text with "No fertilizer this week." (in a dormant week, the dormantSeason fertilize text is fine) and never suggest feeding anywhere else in that week.
11. Plain, friendly language for a first-time homeowner. Short sentences, no jargon. "extra" may be an empty array.`;

function extractJson(raw: string): unknown {
  const unfenced = raw.replace(/```(?:json)?/gi, "").trim();
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("No JSON object in model output");
  return JSON.parse(unfenced.slice(start, end + 1));
}

function guideContext(input: PlanInput) {
  const grass = lawnGuide.grassTypes[input.grassType]!;
  const region = lawnGuide.regions[input.zip.charAt(0)]!;
  const confirmed = new Set(input.confirmedIssues.map((i) => i.key));
  const seedingApplies = confirmed.has("bare") || confirmed.has("thin");
  const dormantWeeks = planWeeks(input.today)
    .filter((w) => isDormant(input.grassType, input.zip, w.start))
    .map((w) => w.week);
  return {
    today: input.today,
    weekDates: planWeeks(input.today).map(
      (w) =>
        `Week ${w.week}: ${w.dates} (${seasonOf(w.start)}` +
        `${isDormant(input.grassType, input.zip, w.start) ? "; dormant" : ""}` +
        `${feedingAllowed(input.grassType, input.zip, w.start) ? "" : "; no fertilizer"})`,
    ),
    region: { name: region.name, climate: region.climate, note: lawnGuide.climateNotes[region.climate] ?? "" },
    grass: {
      name: grass.label,
      season: grass.season,
      mow: grass.mow,
      water: grass.water,
      fertilize: grass.fertilize,
      // Only sent when the date and region put some plan weeks in dormancy.
      ...(dormantWeeks.length && { dormantSeason: grass.dormant }),
    },
    ...(dormantWeeks.length && { dormantWeeks }),
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

const numbersIn = (text: string) => text.match(/\d+(?:\.\d+)?/g) ?? [];

/** One failed check: a short name for the logs and an instruction for the model's retry. */
export interface Violation {
  check: string;
  fix: string;
}

/** "Week 3", "Weeks 4-6", "Weeks 2, 4-5" */
function weekList(weeks: number[]): string {
  const sorted = [...new Set(weeks)].sort((a, b) => a - b);
  const runs: string[] = [];
  for (let i = 0; i < sorted.length; ) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j]! + 1) j++;
    runs.push(i === j ? `${sorted[i]}` : `${sorted[i]}-${sorted[j]}`);
    i = j + 1;
  }
  return `${sorted.length === 1 ? "Week" : "Weeks"} ${runs.join(", ")}`;
}

/**
 * Content rules checked in code. Returns every failed check (empty when the
 * plan passes), each with an instruction the model can act on in a retry.
 */
function ruleViolations(plan: ModelOutput, input: PlanInput, context: object): Violation[] {
  const weeks = planWeeks(input.today);
  const grass = lawnGuide.grassTypes[input.grassType]!;
  const confirmed = new Set(input.confirmedIssues.map((i) => i.key));
  const allText = [
    plan.summary,
    ...plan.weeks.flatMap((w) => [w.title, w.mow, w.water, w.fertilize, w.why, ...w.extra]),
  ].join("\n");
  const problems: Violation[] = [];

  for (const [topic, { allowedBy, pattern }] of Object.entries(TOPIC_PATTERNS)) {
    if (allowedBy.some((k) => confirmed.has(k))) continue;
    const hit = allText.match(pattern);
    if (hit) {
      problems.push({
        check: `topic-${topic}`,
        fix: `The plan mentions ${topic} ("${hit[0]}"), but the homeowner did not confirm that issue: remove every ${topic} step and mention.`,
      });
    }
  }

  const seedWeek = (confirmed.has("bare") || confirmed.has("thin")) ? seedingWeek(input.today, grass.season) : null;
  if (seedWeek === null && allText.includes(RESEED_REMINDER)) {
    problems.push({
      check: "seeding-season",
      fix: "It is the wrong season to seed this grass: remove the reseed reminder and any seeding step, and say which season to seed instead (seedingSeason).",
    });
  }

  if (confirmed.size === 0 && plan.weeks.some((w) => w.title.trim().toLowerCase() === TROUBLE_TITLE.toLowerCase())) {
    problems.push({
      check: "trouble-title",
      fix: `No issues were confirmed: do not title any week "${TROUBLE_TITLE}".`,
    });
  }

  const fedWeeks: number[] = [];
  const wateredDormantWeeks: number[] = [];
  for (const w of plan.weeks) {
    const dates = weeks[w.week - 1]!;
    if (!feedingAllowed(input.grassType, input.zip, dates.start) && !saysNoFeeding(w.fertilize)) fedWeeks.push(w.week);
    if (isDormant(input.grassType, input.zip, dates.start) && weeklyWateringIn(w)) wateredDormantWeeks.push(w.week);
    const mismatch = titleSeasonMismatch(w.title, dates);
    if (mismatch) {
      problems.push({
        check: "season-title",
        fix: `Week ${w.week} (${dates.dates}) is ${seasonOf(dates.start)}, but its title says "${mismatch}": name ${seasonOf(dates.start)} or leave the season out of the title.`,
      });
    }
  }
  if (fedWeeks.length) {
    problems.push({
      check: "fertilizer-timing",
      fix: `${weekList(fedWeeks)} must get no fertilizer (dormant or the wrong time of year for this grass): start their "fertilize" text with "No fertilizer this week." and suggest no feeding.`,
    });
  }
  if (wateredDormantWeeks.length) {
    problems.push({
      check: "dormant-watering",
      fix: `${weekList(wateredDormantWeeks)} ${wateredDormantWeeks.length === 1 ? "is" : "are"} dormant season: do not recommend weekly watering; use the dormant-season guidance instead ("${grass.dormant.water}").`,
    });
  }

  // Amounts with units must appear with the same unit in the guide data.
  const allowedUnits = allowedAmounts(input.grassType, [...confirmed]);
  const inventedAmounts = [...new Set(amountsIn(allText).filter((a) => !allowedUnits.has(a)))];
  if (inventedAmounts.length) {
    problems.push({
      check: "invented-amounts",
      fix: `These amounts are not in the guide data: ${inventedAmounts.map((a) => `"${a}"`).join(", ")}. Use only amounts written in the guide data, or say it in words without a number.`,
    });
  }

  // Every number must come from the data we sent (guide values, tips, dates),
  // apart from week references like "week 2".
  const allowed = new Set([...numbersIn(JSON.stringify(context)), ...numbersIn(RESEED_REMINDER)]);
  const withoutWeekRefs = allText.replace(/\bweeks?\s+\d+(?:\s*(?:-|–|and|to)\s*\d+)?/gi, "");
  const invented = [...new Set(numbersIn(withoutWeekRefs).filter((n) => !allowed.has(n)))];
  if (invented.length) {
    problems.push({
      check: "invented-numbers",
      fix: `These numbers are not in the data you were given: ${invented.join(", ")}. Remove them or copy numbers exactly from the guide data.`,
    });
  }

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

type ChatMessage = { role: "user" | "assistant"; content: string };

async function callModel(messages: ChatMessage[]): Promise<string> {
  const message = await anthropic.messages.create(
    {
      model: MODEL,
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages,
    },
    { timeout: TIMEOUT_MS, maxRetries: 0 },
  );
  return message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
}

/** The message sent with the retry: exactly which checks failed and how to fix them. */
function retryInstructions(fixes: string[]): string {
  return [
    "Your plan failed these checks:",
    ...fixes.map((fix, i) => `${i + 1}. ${fix}`),
    "",
    "Return the full corrected plan as ONLY a JSON object in the same shape. Keep everything else that was correct, and follow all the original rules.",
  ].join("\n");
}

/** The rule-based generatePlan (season-aware), limited to the confirmed issues. */
export function fallbackPlan(input: PlanInput): PlanResult {
  const plan = ruleBasedPlan({
    zip: input.zip,
    grassType: input.grassType,
    today: input.today,
    issueKeys: input.confirmedIssues.map((i) => i.key),
  });
  return { source: "fallback", summary: plan.summary, weeks: plan.weeks };
}

/**
 * Writes the plan with the AI. A plan that fails a check gets ONE retry in which
 * the model sees its previous answer and exactly what failed; if that also
 * fails (or the call errors), the rule-based plan is returned.
 * options.skipAi: go straight to the rule-based plan (used to test the fallback).
 */
export async function generateLawnPlan(
  input: PlanInput,
  log: Logger,
  options: { skipAi?: boolean } = {},
): Promise<PlanResult> {
  if (options.skipAi) {
    log.info("generate-plan: AI skipped on request, using the rule-based plan");
    return fallbackPlan(input);
  }
  const context = guideContext(input);
  const messages: ChatMessage[] = [{ role: "user", content: JSON.stringify(context) }];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let raw: string;
    try {
      raw = await callModel(messages);
    } catch (err) {
      log.warn({ attempt, err: err instanceof Error ? err.message : String(err) }, "generate-plan: model call failed");
      continue; // nothing to correct, so the retry resends the same request
    }

    let failed: Violation[];
    let plan: ModelOutput | null = null;
    try {
      const parsed = modelOutputSchema.safeParse(extractJson(raw));
      if (parsed.success) {
        plan = parsed.data;
        failed = ruleViolations(plan, input, context);
      } else {
        failed = [{ check: "json-shape", fix: `The JSON did not match the required shape: ${parsed.error.message}` }];
      }
    } catch (err) {
      failed = [{ check: "json-parse", fix: "The reply was not a valid JSON object. Return only the JSON object." }];
    }

    if (!failed.length && plan) {
      log.info({ attempt, failedChecks: [] }, "generate-plan: plan passed all checks");
      return { source: "ai", ...addReseedReminders(plan, input) };
    }

    log.warn(
      { attempt, failedChecks: failed.map((f) => f.check), problems: failed.map((f) => f.fix), raw },
      "generate-plan: plan failed checks",
    );
    // Retry with the previous answer and what to fix.
    messages.push({ role: "assistant", content: raw }, { role: "user", content: retryInstructions(failed.map((f) => f.fix)) });
  }
  log.warn("generate-plan: no valid AI plan after the retry, using the rule-based plan");
  return fallbackPlan(input);
}
