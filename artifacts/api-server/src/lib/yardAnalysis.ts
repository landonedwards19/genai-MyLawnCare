import { z } from "zod/v4";
import type { Logger } from "pino";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { detectIssues, type IssueKey } from "@workspace/lawn-guide";

// Smallest, cheapest model class available through Replit AI Integrations.
const MODEL = "claude-haiku-4-5";
const TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 2; // first try + one retry
export const MAX_DESCRIPTION_CHARS = 1000;

const ISSUE_KEYS: readonly IssueKey[] = ["bare", "weeds", "dry", "thin", "shade"];

export interface YardInput {
  zip: string;
  grassType: string;
  currentDescription: string;
  desiredDescription: string;
}

const issueSchema = z.object({
  key: z.enum(ISSUE_KEYS),
  status: z.enum(["present", "absent", "unclear"]),
  evidence: z.string(),
  severity: z.enum(["low", "medium", "high"]),
});

/** Shape the model must return. Exactly one entry per issue key. */
const modelOutputSchema = z.object({
  issues: z
    .array(issueSchema)
    .length(ISSUE_KEYS.length)
    .refine(
      (issues) => ISSUE_KEYS.every((k) => issues.some((i) => i.key === k)),
      { message: "issues must contain exactly one entry for each key" },
    ),
  goals: z.array(z.string()),
  otherConcerns: z.array(z.string()),
});

export type ModelOutput = z.infer<typeof modelOutputSchema>;
export type YardAnalysisResult = ModelOutput & { source: "ai" | "fallback" };

const SYSTEM_PROMPT = `You analyze a homeowner's lawn descriptions for a lawn-care planning app.

You receive:
- currentDescription: how the yard looks NOW.
- desiredDescription: how the homeowner WANTS the yard to look.

Return ONLY a JSON object, with no prose and no code fences, in exactly this shape:
{
  "issues": [
    { "key": "bare"|"weeds"|"dry"|"thin"|"shade",
      "status": "present"|"absent"|"unclear",
      "evidence": "<exact phrase copied from currentDescription, or empty string>",
      "severity": "low"|"medium"|"high" }
  ],
  "goals": ["<short phrase>", ...],
  "otherConcerns": ["<short phrase>", ...]
}

"issues" must contain exactly one entry for EACH of the 5 keys: bare, weeds, dry, thin, shade.
Key meanings: bare = bare or patchy spots; weeds = weeds; dry = brown, dry, or dead areas; thin = thin or sparse grass; shade = the lawn is shaded.

Rules:
1. Decide problems ONLY from currentDescription. desiredDescription describes goals, never current problems. For example, "dark green" in either description is a color goal, not shade.
2. Respect negation. "no weeds", "never had bare spots", and "not shady" mean that issue is "absent".
3. "present" requires an exact phrase copied word-for-word from currentDescription as "evidence". If the description is vague (for example "it's ok i guess"), use "unclear", not "present".
4. Never invent problems the user did not describe. If an issue is not mentioned at all, mark it "absent" with empty evidence and severity "low".
5. "goals" come ONLY from desiredDescription, as short phrases.
6. "otherConcerns" lists current problems from currentDescription that fall outside the 5 keys (for example grubs, moss, standing water). Use an empty array if there are none.`;

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function extractJson(raw: string): unknown {
  const unfenced = raw.replace(/```(?:json)?/gi, "").trim();
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("No JSON object in model output");
  return JSON.parse(unfenced.slice(start, end + 1));
}

/**
 * Enforces rule 3 in code: a "present" issue whose evidence is empty or not an
 * exact phrase from currentDescription is downgraded to "unclear".
 */
function enforceEvidence(output: ModelOutput, currentDescription: string, log: Logger): ModelOutput {
  const haystack = normalize(currentDescription);
  return {
    ...output,
    issues: ISSUE_KEYS.map((key) => {
      const issue = output.issues.find((i) => i.key === key)!;
      if (issue.status !== "present") return issue;
      const evidence = normalize(issue.evidence);
      if (evidence && haystack.includes(evidence)) return issue;
      log.warn({ issue }, "analyze-yard: 'present' without matching evidence, downgraded to 'unclear'");
      return { ...issue, status: "unclear" as const };
    }),
  };
}

// Words that suggest trees or shade on the lawn.
const TREE_OR_SHADE = /\b(trees?|shade|shady|shaded)\b/i;

/**
 * If trees or shade are mentioned only in desiredDescription (for example
 * "weed-free under the big oak tree"), the lawn may well be shaded, but the
 * homeowner didn't describe it as a current problem. Mark shade "unclear"
 * instead of "absent" (or instead of a keyword match that came only from the goal).
 */
function shadeFromGoalOnly(issues: ModelOutput["issues"], input: YardInput, log: Logger): ModelOutput["issues"] {
  if (!TREE_OR_SHADE.test(input.desiredDescription) || TREE_OR_SHADE.test(input.currentDescription)) return issues;
  const current = normalize(input.currentDescription);
  return issues.map((issue) => {
    if (issue.key !== "shade" || issue.status === "unclear") return issue;
    if (issue.status === "present" && issue.evidence && current.includes(normalize(issue.evidence))) return issue;
    log.info({ issue }, "analyze-yard: trees/shade only in the goal, shade marked 'unclear'");
    return { key: "shade", status: "unclear", evidence: "", severity: "low" };
  });
}

async function callModel(input: YardInput): Promise<string> {
  const message = await anthropic.messages.create(
    {
      model: MODEL,
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            currentDescription: input.currentDescription,
            desiredDescription: input.desiredDescription,
          }),
        },
      ],
    },
    { timeout: TIMEOUT_MS, maxRetries: 0 },
  );
  return message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
}

/** The existing keyword matcher, mapped onto the same response shape. */
export function fallbackAnalysis(input: YardInput, log: Logger): YardAnalysisResult {
  const matched = detectIssues(input.currentDescription, input.desiredDescription);
  const current = input.currentDescription.toLowerCase();
  const issues: ModelOutput["issues"] = ISSUE_KEYS.map((key) => {
    const hit = matched.find((i) => i.key === key);
    if (!hit) return { key, status: "absent", evidence: "", severity: "low" };
    const keyword = hit.keywords.find((k) => current.includes(k)) ?? "";
    return { key, status: "present", evidence: keyword, severity: "medium" };
  });
  return {
    source: "fallback",
    issues: shadeFromGoalOnly(issues, input, log),
    goals: [],
    otherConcerns: [],
  };
}

export async function analyzeYard(input: YardInput, log: Logger): Promise<YardAnalysisResult> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const raw = await callModel(input);
      const parsed = modelOutputSchema.safeParse(extractJson(raw));
      if (!parsed.success) {
        log.warn({ attempt, raw, error: parsed.error.message }, "analyze-yard: model output failed validation");
        continue;
      }
      const checked = enforceEvidence(parsed.data, input.currentDescription, log);
      return { source: "ai", ...checked, issues: shadeFromGoalOnly(checked.issues, input, log) };
    } catch (err) {
      log.warn({ attempt, err: err instanceof Error ? err.message : String(err) }, "analyze-yard: model call failed");
    }
  }
  return fallbackAnalysis(input, log);
}
