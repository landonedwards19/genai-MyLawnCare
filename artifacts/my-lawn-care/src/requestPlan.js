/*
 * requestPlan(...) - asks the server to write the lawn plan.
 *
 * Calls POST /api/generate-plan (the AI runs on the server, never in the browser).
 * The server already falls back to the rule-based plan when the AI fails. If the
 * server itself can't be reached or refuses (for example the hourly limit), the
 * same rule-based generatePlan runs here instead. Either way the result is:
 *   { source: "ai" | "fallback", summary, weeks: [{ week, title, mow, water, fertilize, extra, why? }] }
 */
import { lawnGuide, generatePlan } from "@workspace/lawn-guide";

const ENDPOINT = `${import.meta.env.BASE_URL}api/generate-plan`;

/** The user's local date as YYYY-MM-DD. */
function localToday() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * values: the form values { zip, grassType, ... }
 * issueKeys: the issues left checked on the review screen
 * analysis: the yard analysis (for each issue's evidence and the goals)
 */
export async function requestPlan(values, issueKeys, analysis) {
  const region = lawnGuide.regions[values.zip.charAt(0)];
  const evidenceFor = (key) => analysis.issues.find((i) => i.key === key && i.status === "present")?.evidence || "";
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zip: values.zip,
        region: region.name,
        grassType: values.grassType,
        confirmedIssues: issueKeys.map((key) => ({ key, evidence: evidenceFor(key) })),
        goals: analysis.goals,
        today: localToday(),
      }),
    });
    if (!res.ok) throw new Error(`generate-plan returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("AI plan unavailable, using the rule-based plan.", err);
    const plan = generatePlan({ zip: values.zip, grassType: values.grassType, today: localToday(), issueKeys });
    return { source: "fallback", summary: plan.summary, weeks: plan.weeks };
  }
}
