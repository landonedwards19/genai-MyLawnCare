/*
 * analyzeYard(values) - asks the server to read the yard descriptions.
 *
 * Calls POST /api/analyze-yard (the AI runs on the server, never in the browser).
 * If the server can't be reached or refuses (for example the hourly limit),
 * the same keyword matcher the server falls back to is used here instead, so
 * the review screen always gets the same shape:
 *   { source: "ai" | "fallback", issues: [{ key, status, evidence, severity }],
 *     goals: [...], otherConcerns: [...] }
 */
import { lawnGuide, detectIssues } from "@workspace/lawn-guide";

const ENDPOINT = `${import.meta.env.BASE_URL}api/analyze-yard`;

function localFallback(values) {
  const matched = detectIssues(values.currentDescription, values.desiredDescription);
  const current = values.currentDescription.toLowerCase();
  return {
    source: "fallback",
    issues: Object.keys(lawnGuide.issues).map((key) => {
      const hit = matched.find((i) => i.key === key);
      if (!hit) return { key, status: "absent", evidence: "", severity: "low" };
      const evidence = hit.keywords.find((k) => current.includes(k)) || "";
      return { key, status: "present", evidence, severity: "medium" };
    }),
    goals: [],
    otherConcerns: [],
  };
}

export async function analyzeYard(values) {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zip: values.zip,
        grassType: values.grassType,
        currentDescription: values.currentDescription,
        desiredDescription: values.desiredDescription,
      }),
    });
    if (!res.ok) throw new Error(`analyze-yard returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Yard analysis unavailable, using keyword matching.", err);
    return localFallback(values);
  }
}
