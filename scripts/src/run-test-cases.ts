/**
 * Runs the cases in evaluation/test-cases.json against the two API endpoints
 * and writes evaluation/results.md.
 *
 * For each case:
 *   1. POST /api/analyze-yard with the case input.
 *   2. Confirm the issues marked "present" (what the review screen pre-checks).
 *   3. POST /api/generate-plan with those confirmed issues and the detected goals.
 *   4. Check every "expect" rule and record PASS/FAIL.
 *
 * Usage: pnpm --filter @workspace/scripts run test-cases
 * Env:   API_BASE_URL (default http://localhost:80/api)
 *        TODAY        (YYYY-MM-DD, default: this machine's local date)
 * Exits with code 1 if any rule fails.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  lawnGuide,
  planWeeks,
  seasonOf,
  feedingAllowed,
  saysNoFeeding,
  titleSeasonMismatch,
  amountsIn,
  allowedAmounts,
  TOPIC_PATTERNS,
  type PlanTopic,
} from "@workspace/lawn-guide";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CASES_FILE = path.join(ROOT, "evaluation/test-cases.json");
const RESULTS_FILE = path.join(ROOT, "evaluation/results.md");
const API = (process.env.API_BASE_URL ?? "http://localhost:80/api").replace(/\/$/, "");

type IssueKey = "bare" | "weeds" | "dry" | "thin" | "shade";
type Status = "present" | "absent" | "unclear";
type Topic = PlanTopic;

type ExpectRule =
  | { rule: "issue"; key: IssueKey; status: Status | "not-present" }
  | { rule: "noIssuePresent" }
  | { rule: "noWeekTitle"; title: string }
  | { rule: "planExcludes"; topics: Topic[] }
  | { rule: "feedingTiming" }
  | { rule: "seasonTitles" }
  | { rule: "amountsFromGuide" };

interface TestCase {
  id: string;
  name: string;
  input: { zip: string; grassType: string; currentDescription: string; desiredDescription: string };
  expect: ExpectRule[];
}

interface Analysis {
  source: "ai" | "fallback";
  issues: Array<{ key: IssueKey; status: Status; evidence: string; severity: string }>;
  goals: string[];
  otherConcerns: string[];
}

interface Plan {
  source: "ai" | "fallback";
  summary: string;
  weeks: Array<{ week: number; title: string; mow: string; water: string; fertilize: string; extra: string[]; why?: string }>;
}

interface CheckResult {
  pass: boolean;
  text: string;
}

function localToday(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function post<T>(endpoint: string, body: unknown): Promise<{ data: T; ms: number }> {
  const started = Date.now();
  const res = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const ms = Date.now() - started;
  if (!res.ok) throw new Error(`${endpoint} returned ${res.status}: ${await res.text()}`);
  return { data: (await res.json()) as T, ms };
}

function planText(plan: Plan): string {
  return [
    plan.summary,
    ...plan.weeks.flatMap((w) => [w.title, w.mow, w.water, w.fertilize, w.why ?? "", ...w.extra]),
  ].join("\n");
}

interface PlanContext {
  input: TestCase["input"];
  confirmedKeys: IssueKey[];
  today: string;
}

function check(rule: ExpectRule, analysis: Analysis, plan: Plan, ctx: PlanContext): CheckResult {
  const status = (key: IssueKey) => analysis.issues.find((i) => i.key === key)?.status ?? "missing";
  switch (rule.rule) {
    case "issue": {
      const actual = status(rule.key);
      const pass = rule.status === "not-present" ? actual !== "present" : actual === rule.status;
      const wanted = rule.status === "not-present" ? "not present (absent or unclear)" : rule.status;
      return { pass, text: `${rule.key} is ${wanted} (got: ${actual})` };
    }
    case "noIssuePresent": {
      const present = analysis.issues.filter((i) => i.status === "present").map((i) => i.key);
      return { pass: present.length === 0, text: `no issue present (got: ${present.join(", ") || "none"})` };
    }
    case "noWeekTitle": {
      const hits = plan.weeks.filter((w) => w.title.trim().toLowerCase() === rule.title.toLowerCase());
      return {
        pass: hits.length === 0,
        text: `no week titled "${rule.title}" (got: ${hits.length ? `weeks ${hits.map((w) => w.week).join(", ")}` : "none"})`,
      };
    }
    case "planExcludes": {
      const text = planText(plan);
      const found = rule.topics
        .map((t) => ({ t, hit: text.match(TOPIC_PATTERNS[t].pattern)?.[0] }))
        .filter((x) => x.hit);
      return {
        pass: found.length === 0,
        text: `plan has no ${rule.topics.join(", ")} steps (got: ${found.map((f) => `${f.t} "${f.hit}"`).join(", ") || "none"})`,
      };
    }
    case "feedingTiming": {
      const weeks = planWeeks(ctx.today);
      const restricted = plan.weeks.filter((w) => {
        const dates = weeks[w.week - 1];
        return dates && !feedingAllowed(ctx.input.grassType, ctx.input.zip, dates.start);
      });
      const fed = restricted.filter((w) => !saysNoFeeding(w.fertilize));
      return {
        pass: fed.length === 0,
        text: `no fertilizer in weeks the guide rules out for this grass and region (restricted weeks: ${
          restricted.map((w) => w.week).join(", ") || "none"
        }; got feeding in: ${fed.map((w) => `week ${w.week} "${w.fertilize.slice(0, 50)}"`).join(", ") || "none"})`,
      };
    }
    case "seasonTitles": {
      const weeks = planWeeks(ctx.today);
      const bad = plan.weeks
        .map((w) => {
          const dates = weeks[w.week - 1];
          const hit = dates ? titleSeasonMismatch(w.title, dates) : null;
          return hit && dates ? `week ${w.week} "${w.title}" (${seasonOf(dates.start)})` : null;
        })
        .filter(Boolean);
      return { pass: bad.length === 0, text: `week titles match their dates' season (got: ${bad.join(", ") || "all match"})` };
    }
    case "amountsFromGuide": {
      const allowed = allowedAmounts(ctx.input.grassType, ctx.confirmedKeys);
      const invented = [...new Set(amountsIn(planText(plan)).filter((a) => !allowed.has(a)))];
      return {
        pass: invented.length === 0,
        text: `every amount with a unit comes from the guide (got invented: ${invented.join(", ") || "none"})`,
      };
    }
  }
}

const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

function caseMarkdown(
  tc: TestCase,
  out: { analysis: Analysis; analysisMs: number; confirmed: Array<{ key: IssueKey; evidence: string }>; plan: Plan; planMs: number; checks: CheckResult[] } | { error: string },
): string {
  const lines: string[] = [`## ${tc.name}`, ""];
  lines.push("**Inputs**", "", "| Field | Value |", "|---|---|");
  lines.push(`| ZIP | ${tc.input.zip} |`, `| Grass type | ${tc.input.grassType} |`);
  lines.push(`| Now | ${esc(tc.input.currentDescription)} |`, `| Goal | ${esc(tc.input.desiredDescription)} |`, "");

  if ("error" in out) {
    lines.push(`**ERROR:** ${out.error}`, "", "**Checks**", "");
    tc.expect.forEach(() => lines.push("- FAIL: case did not run"));
    lines.push("");
    return lines.join("\n");
  }

  const { analysis, plan, confirmed, checks } = out;
  lines.push(`**Detected issues** (source: \`${analysis.source}\`, ${out.analysisMs} ms)`, "");
  lines.push("| Issue | Status | Evidence | Severity |", "|---|---|---|---|");
  for (const i of analysis.issues) {
    lines.push(`| ${i.key} | ${i.status} | ${i.evidence ? `"${esc(i.evidence)}"` : ""} | ${i.severity} |`);
  }
  lines.push("", `- Goals: ${analysis.goals.length ? analysis.goals.map((g) => `"${esc(g)}"`).join(", ") : "(none)"}`);
  lines.push(`- Other concerns: ${analysis.otherConcerns.length ? analysis.otherConcerns.map((g) => `"${esc(g)}"`).join(", ") : "(none)"}`, "");

  lines.push("**Confirmed issues** (the pre-checked \"present\" ones)", "");
  if (confirmed.length) confirmed.forEach((c) => lines.push(`- ${c.key}: "${esc(c.evidence)}"`));
  else lines.push("- (none)");
  lines.push("");

  lines.push(`**Plan** (source: \`${plan.source}\`, ${out.planMs} ms)`, "", `> ${esc(plan.summary)}`, "");
  for (const w of plan.weeks) {
    lines.push(`### Week ${w.week}: ${w.title}`, "");
    if (w.why) lines.push(`_Why: ${w.why}_`, "");
    lines.push(`- **Mow:** ${w.mow}`, `- **Water:** ${w.water}`, `- **Fertilize:** ${w.fertilize}`);
    w.extra.forEach((x) => lines.push(`- **Also:** ${x}`));
    lines.push("");
  }

  lines.push("**Checks**", "");
  checks.forEach((c) => lines.push(`- ${c.pass ? "PASS" : "FAIL"}: ${c.text}`));
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const { cases } = JSON.parse(await readFile(CASES_FILE, "utf8")) as { cases: TestCase[] };
  const today = process.env.TODAY ?? localToday();
  const sections: string[] = [];
  let passed = 0;
  let total = 0;
  const overview: string[] = [];

  for (const tc of cases) {
    process.stdout.write(`${tc.name} ... `);
    try {
      const { data: analysis, ms: analysisMs } = await post<Analysis>("/analyze-yard", tc.input);
      const confirmed = analysis.issues
        .filter((i) => i.status === "present")
        .map((i) => ({ key: i.key, evidence: i.evidence }));
      const region = lawnGuide.regions[tc.input.zip.charAt(0)];
      if (!region) throw new Error(`No lawn-guide region for ZIP ${tc.input.zip}`);
      const { data: plan, ms: planMs } = await post<Plan>("/generate-plan", {
        zip: tc.input.zip,
        region: region.name,
        grassType: tc.input.grassType,
        confirmedIssues: confirmed,
        goals: analysis.goals,
        today,
      });
      const ctx: PlanContext = { input: tc.input, confirmedKeys: confirmed.map((c) => c.key), today };
      const checks = tc.expect.map((r) => check(r, analysis, plan, ctx));
      const ok = checks.filter((c) => c.pass).length;
      passed += ok;
      total += checks.length;
      overview.push(`| ${tc.name} | ${analysis.source} | ${plan.source} | ${ok}/${checks.length} |`);
      sections.push(caseMarkdown(tc, { analysis, analysisMs, confirmed, plan, planMs, checks }));
      console.log(`${ok}/${checks.length} passed (analysis: ${analysis.source}, plan: ${plan.source})`);
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      total += tc.expect.length;
      overview.push(`| ${tc.name} | error | error | 0/${tc.expect.length} |`);
      sections.push(caseMarkdown(tc, { error }));
      console.log(`ERROR: ${error}`);
    }
  }

  const md = [
    "# Test case results",
    "",
    `- Run: ${new Date().toISOString()}`,
    `- Plan date ("today"): ${today}`,
    `- API: ${API}`,
    `- Result: **${passed}/${total} checks passed**`,
    "",
    "| Case | Analysis source | Plan source | Checks |",
    "|---|---|---|---|",
    ...overview,
    "",
    ...sections,
  ].join("\n");
  await writeFile(RESULTS_FILE, md);
  console.log(`\n${passed}/${total} checks passed. Wrote ${path.relative(ROOT, RESULTS_FILE)}`);
  if (passed < total) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
