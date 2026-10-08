/*
 * generatePlan(inputs) - SIMULATED plan generator.
 *
 * This is a pure, rule-based stand-in that only uses lawnGuide.js.
 * It is meant to be replaced later by a real AI or weather API call.
 * It is async-friendly: main.js awaits it, so swapping in a network call
 * that returns a Promise of the same shape needs no other changes.
 *
 * inputs: { zip, grassType, currentDescription, desiredDescription,
 *           currentPhotoCount, desiredPhotoCount }
 * returns: { summary, region, grassLabel, issues, weeks: [{ week, title, mow, water, fertilize, extra }] }
 */
import { lawnGuide } from "./lawnGuide.js";

export function generatePlan(inputs) {
  const grass = lawnGuide.grassTypes[inputs.grassType] || lawnGuide.grassTypes["not-sure"];
  const region = lawnGuide.regions[String(inputs.zip).charAt(0)] || { name: "Unknown region", climate: "mild" };

  const text = `${inputs.currentDescription} ${inputs.desiredDescription}`.toLowerCase();
  const issues = Object.entries(lawnGuide.issues)
    .filter(([, issue]) => issue.keywords.some((k) => text.includes(k)))
    .map(([key, issue]) => ({ key, ...issue }));

  // More issues means a slightly longer plan (4 to 6 weeks).
  const weekCount = Math.min(6, 4 + Math.min(issues.length, 2));
  const seeding = issues.some((i) => i.key === "bare" || i.key === "thin");

  const weeks = [];
  for (let w = 1; w <= weekCount; w++) {
    let mow = `Mow at ${grass.mow.height}, ${grass.mow.frequency}.`;
    if (w === 1) mow += " Start by sharpening your mower blade; clean cuts keep grass healthier.";
    if (seeding && w <= 3) mow += " Skip mowing newly seeded spots until the new grass reaches mowing height.";
    if (w === weekCount) mow += " Leave clippings on the lawn; they return free nutrients.";

    let water = `Give ${grass.water.amount}, ${grass.water.timing}.`;
    if (region.climate === "dry" || region.climate === "warm") water += " In hot spells, lean toward the higher end.";
    if (seeding && w <= 3) water += " Also mist seeded areas lightly once or twice a day.";

    let fertilize;
    if (w === 1) fertilize = "Hold off this week. Just observe how the lawn responds to steady mowing and watering.";
    else if (w === 2) fertilize = seeding ? "Use a starter fertilizer on seeded areas only." : "No feeding yet; let the routine settle in.";
    else if (w === 4) fertilize = grass.fertilize;
    else fertilize = "No fertilizer this week. Water any recent feeding in well.";

    const extra = issues
      .filter((i) => i.weeks.includes(w))
      .map((i) => `${i.label}: ${i.tip}`);

    weeks.push({ week: w, title: lawnGuide.weekTitles[w - 1], mow, water, fertilize, extra });
  }

  const photos = (inputs.currentPhotoCount || 0) + (inputs.desiredPhotoCount || 0);
  const issueText = issues.length
    ? ` I noticed you mentioned ${issues.map((i) => i.label.toLowerCase()).join(", ")}, so I've folded in a few fixes.`
    : " Your yard sounds in decent shape, so this plan focuses on a steady routine.";
  const summary =
    `Here's a ${weekCount}-week plan for ${grass.label === "Not sure" ? "your lawn" : grass.label} in the ${region.name}. ` +
    `${lawnGuide.climateNotes[region.climate] || ""}${issueText}` +
    (photos ? ` (Thanks for the ${photos} photo${photos === 1 ? "" : "s"}.)` : "");

  return { summary, region, grassLabel: grass.label, issues, weeks };
}
