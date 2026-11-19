/*
 * detectIssues - the simple keyword matcher.
 *
 * Shared by the web page (generatePlan.js) and the API server (as the
 * fallback when the AI analysis is unavailable). Returns every issue from
 * lawnGuide.issues whose keywords appear in either description.
 */
import { lawnGuide } from "./lawnGuide.js";

export function detectIssues(currentDescription, desiredDescription) {
  const text = `${currentDescription} ${desiredDescription}`.toLowerCase();
  return Object.entries(lawnGuide.issues)
    .filter(([, issue]) => issue.keywords.some((k) => text.includes(k)))
    .map(([key, issue]) => ({ key, ...issue }));
}
