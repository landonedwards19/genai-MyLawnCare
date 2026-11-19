/*
 * generatePlan(inputs) - the basic RULE-BASED plan generator.
 *
 * Pure and offline: it only uses lawnGuide.js, detectIssues.js, and planRules.js.
 * It is the fallback when the AI plan (POST /api/generate-plan) is unavailable,
 * used both by the API server and by the web page if the server can't be reached.
 *
 * It follows the same calendar rules as the AI plan checks (planRules.js):
 * - dormant weeks (lawnGuide.dormantMonths) use the grass type's "dormant" entry;
 * - no fertilizer in dormant or noFeedingMonths weeks, and at most one feeding;
 * - seeding only in a seedingMonths week, given once, then the reseed reminder;
 *   in the wrong season it says once to mark the spots and seed later;
 * - week titles name the week's actual season.
 *
 * inputs: { zip, grassType, today?, currentDescription?, desiredDescription?,
 *           currentPhotoCount?, desiredPhotoCount?, issueKeys? }
 * today: YYYY-MM-DD (defaults to this device's local date).
 * issueKeys: the issues the user confirmed on the review screen (e.g. ["bare", "weeds"]).
 *            If omitted, issues are detected from the descriptions by keyword.
 * returns: { summary, region, grassLabel, issues, weeks: [{ week, title, mow, water, fertilize, extra }] }
 */
import { lawnGuide } from "./lawnGuide.js";
import { detectIssues } from "./detectIssues.js";
import {
  RESEED_REMINDER,
  planWeeks,
  seasonOf,
  seedingWeek,
  isDormant,
  feedingAllowed,
} from "./planRules.js";

const SEED_KEYS = ["bare", "thin"];

function localToday() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const capitalize = (text) => text.replace(/\b\w/g, (c) => c.toUpperCase());

/** "spring" / "summer" / "fall" / "winter" for a month number (1-12). */
function seasonWord(month) {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "fall";
  return "winter";
}

/**
 * The season to seed in when it's the wrong season now: the season of the next
 * seeding month after the plan's last week.
 */
function nextSeedingSeason(grassSeason, lastDate) {
  const months = lawnGuide.seedingMonths[grassSeason] || [];
  const after = lastDate.getUTCMonth() + 1;
  for (let i = 1; i <= 12; i++) {
    const month = ((after - 1 + i) % 12) + 1;
    if (months.includes(month)) return seasonWord(month);
  }
  return "spring";
}

/** The one feeding week: week 4 if allowed, else the closest earlier allowed week, else the first later one. */
function chooseFeedingWeek(allowed, weekCount) {
  const order = [4, 3, 2, 1, 5, 6].filter((w) => w <= weekCount);
  return order.find((w) => allowed[w - 1]) ?? null;
}

export function generatePlan(inputs) {
  const grass = lawnGuide.grassTypes[inputs.grassType] || lawnGuide.grassTypes["not-sure"];
  const grassType = lawnGuide.grassTypes[inputs.grassType] ? inputs.grassType : "not-sure";
  const zip = String(inputs.zip);
  const region = lawnGuide.regions[zip.charAt(0)] || { name: "Unknown region", climate: "mild" };
  const today = inputs.today || localToday();

  const issues = Array.isArray(inputs.issueKeys)
    ? inputs.issueKeys
        .filter((key) => lawnGuide.issues[key])
        .map((key) => ({ key, ...lawnGuide.issues[key] }))
    : detectIssues(inputs.currentDescription || "", inputs.desiredDescription || "");

  // More issues means a slightly longer plan (4 to 6 weeks).
  const weekCount = Math.min(6, 4 + Math.min(issues.length, 2));
  const dates = planWeeks(today).slice(0, weekCount);
  const dormant = dates.map((d) => isDormant(grassType, zip, d.start));
  const canFeed = dates.map((d) => feedingAllowed(grassType, zip, d.start));

  // Seeding: once, in the first week that fits the season; otherwise a single "seed later" note.
  const seedIssues = issues.filter((i) => SEED_KEYS.includes(i.key));
  const seeding = seedIssues.length > 0;
  const firstSeedWeek = seeding ? seedingWeek(today, grass.season) : null;
  const seedWeek = firstSeedWeek !== null && firstSeedWeek <= weekCount ? firstSeedWeek : null;
  const seedLater = seeding && seedWeek === null;

  // At most one feeding; a starter fertilizer in the seeding week counts as it.
  const feedWeek = seedWeek !== null && canFeed[seedWeek - 1] ? seedWeek : chooseFeedingWeek(canFeed, weekCount);
  const starterFeed = seedWeek !== null && feedWeek === seedWeek;

  // Other issue tips go in their usual weeks, moved out of dormant weeks where possible.
  const firstActiveWeek = dormant.indexOf(false) + 1 || 1;
  const otherIssues = issues
    .filter((i) => !SEED_KEYS.includes(i.key))
    .map((i) => {
      const active = i.weeks.filter((w) => w <= weekCount && !dormant[w - 1]);
      return { ...i, planWeeks: active.length ? active : [firstActiveWeek] };
    });

  const weeks = [];
  for (let w = 1; w <= weekCount; w++) {
    const isDormantWeek = dormant[w - 1];
    const season = seasonOf(dates[w - 1].start);

    let mow;
    let water;
    if (isDormantWeek) {
      mow = `${grass.dormant.mow}.`;
      water = `${grass.dormant.water}.`;
    } else {
      mow = `Mow at ${grass.mow.height}, ${grass.mow.frequency}.`;
      if (w === 1) mow += " Start by sharpening your mower blade; clean cuts keep grass healthier.";
      if (seedWeek !== null && w >= seedWeek) mow += " Skip mowing newly seeded spots until the new grass reaches mowing height.";
      water = `Give ${grass.water.amount}, ${grass.water.timing}.`;
      if ((region.climate === "dry" || region.climate === "warm") && /summer|late spring/.test(season)) {
        water += " In hot spells, lean toward the higher end.";
      }
    }

    let fertilize;
    if (w === feedWeek) {
      fertilize = starterFeed
        ? "Use a starter fertilizer on the newly seeded spots only. Follow the product label."
        : `${grass.fertilize} Follow the product label.`;
    } else if (isDormantWeek) {
      fertilize = `${grass.dormant.fertilize}. The grass is dormant, so it can't use fertilizer now.`;
    } else if (!canFeed[w - 1]) {
      fertilize = "No fertilizer this week. This grass shouldn't be fed at this time of year.";
    } else {
      fertilize = "No fertilizer this week.";
    }

    const extra = [];
    if (w === seedWeek) {
      seedIssues.forEach((i) => extra.push(`${i.label}: ${i.tip}`));
    } else if (seedWeek !== null && w > seedWeek) {
      extra.push(RESEED_REMINDER);
    } else if (seedLater && w === 1) {
      extra.push(`Mark these spots and seed in ${nextSeedingSeason(grass.season, dates[weekCount - 1].start)}.`);
    }
    otherIssues.filter((i) => i.planWeeks.includes(w)).forEach((i) => extra.push(`${i.label}: ${i.tip}`));

    let focus;
    if (isDormantWeek) focus = "Let it rest";
    else if (w === seedWeek) focus = "Seed the trouble spots";
    else if (w === feedWeek) focus = "Feed the lawn";
    else if (w === 1) focus = "Get a baseline";
    else if (seedWeek !== null && w > seedWeek) focus = "Help the new grass";
    else focus = "Keep the routine";

    weeks.push({ week: w, title: `${capitalize(season)}: ${focus}`, mow, water, fertilize, extra });
  }

  const photos = (inputs.currentPhotoCount || 0) + (inputs.desiredPhotoCount || 0);
  const issueText = issues.length
    ? ` ${Array.isArray(inputs.issueKeys) ? "You flagged" : "I noticed you mentioned"} ${issues.map((i) => i.label.toLowerCase()).join(", ")}, so I've folded in a few fixes.`
    : " Your yard sounds in decent shape, so this plan focuses on a steady routine.";
  const dormantText = dormant.some(Boolean)
    ? " Your grass goes dormant during this plan, so those weeks are mostly rest."
    : "";
  const summary =
    `Here's a ${weekCount}-week plan for ${grass.label === "Not sure" ? "your lawn" : grass.label} in the ${region.name}, starting in ${seasonOf(dates[0].start)}. ` +
    `${lawnGuide.climateNotes[region.climate] || ""}${issueText}${dormantText}` +
    (photos ? ` (Thanks for the ${photos} photo${photos === 1 ? "" : "s"}.)` : "");

  return { summary, region, grassLabel: grass.label, issues, weeks };
}
