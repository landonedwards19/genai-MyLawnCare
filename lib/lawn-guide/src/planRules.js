/*
 * planRules - calendar and content rules for lawn plans.
 *
 * Shared by the API server (to check AI plans before accepting them) and the
 * test-case runner (to report PASS/FAIL), so both apply the same rules.
 * The editable data behind them (seedingMonths, noFeedingMonths) lives in lawnGuide.js.
 */
import { lawnGuide } from "./lawnGuide.js";

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// US seasons by month (index 1-12).
const SEASON_BY_MONTH = [
  "", "mid winter", "late winter", "early spring", "mid spring", "late spring", "early summer",
  "mid summer", "late summer", "early fall", "mid fall", "late fall", "early winter",
];

/**
 * Words that count as a seeding, weed, or shade step, and which confirmed
 * issues allow them. "weed-and-feed" (a product warning in the grass guide)
 * and "shade out" (tall grass crowding out weeds) are not those topics.
 */
export const TOPIC_PATTERNS = {
  seeding: { allowedBy: ["bare", "thin"], pattern: /\b(seeds?|seeded|seeding|seedlings?|overseed\w*|reseed\w*|sprouts?)\b/i },
  weeds: { allowedBy: ["weeds"], pattern: /\b(weed(?!-and-feed)\w*|dandelions?|clover|crabgrass|herbicides?|pre-emergent)\b/i },
  shade: { allowedBy: ["shade"], pattern: /\b(shade|shady|shaded)\b(?!\s+out\b)/i },
};

export const RESEED_REMINDER = "Keep the seeded spots lightly moist. Only reseed spots with no sprouts after 14 days.";

const PLAN_WEEKS = 6;

/** "late fall" etc. for a date. */
export function seasonOf(date) {
  return SEASON_BY_MONTH[date.getUTCMonth() + 1];
}

const fmtDate = (date) => `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;

/** The 6 possible plan weeks starting on `today` (YYYY-MM-DD), with UTC dates. */
export function planWeeks(today) {
  const [y, m, d] = today.split("-").map(Number);
  return Array.from({ length: PLAN_WEEKS }, (_, i) => {
    const start = new Date(Date.UTC(y, m - 1, d + i * 7));
    const end = new Date(Date.UTC(y, m - 1, d + i * 7 + 6));
    return { week: i + 1, start, end, dates: `${fmtDate(start)} - ${fmtDate(end)}` };
  });
}

/** First plan week (1-based) that starts in a seeding month for this grass season, or null. */
export function seedingWeek(today, season) {
  const months = lawnGuide.seedingMonths[season] || [];
  const week = planWeeks(today).find((w) => months.includes(w.start.getUTCMonth() + 1));
  return week ? week.week : null;
}

/**
 * Which noFeedingMonths list applies. "Not sure" grass follows the region:
 * cool regions use the cool-season list, everywhere else the cautious "unknown" list.
 */
function feedingSeason(grassType, zip) {
  const grass = lawnGuide.grassTypes[grassType] || lawnGuide.grassTypes["not-sure"];
  if (grass.season !== "unknown") return grass.season;
  const region = lawnGuide.regions[String(zip).charAt(0)];
  return region && region.climate === "cool" ? "cool" : "unknown";
}

/** False when the guide says this grass should get no fertilizer in the week starting on `date`. */
export function feedingAllowed(grassType, zip, date) {
  const months = lawnGuide.noFeedingMonths[feedingSeason(grassType, zip)] || [];
  return !months.includes(date.getUTCMonth() + 1);
}

/** True when a week's fertilize text says not to feed (it must lead with that). */
export function saysNoFeeding(text) {
  return /^\s*(no|skip|hold off|don'?t|do not|avoid|none)\b/i.test(text);
}

/**
 * Returns the first season phrase in a week title that doesn't fit the week's
 * dates (e.g. "Late Winter" for a late-December week), or null.
 * Only qualified phrases (early/mid/late + season) are checked, so titles like
 * "Plan for spring" are fine.
 */
export function titleSeasonMismatch(title, week) {
  const allowed = new Set([seasonOf(week.start), seasonOf(week.end)]);
  const pattern = /\b(early|mid|late)[\s-]+(spring|summer|fall|autumn|winter)\b/gi;
  for (const match of title.matchAll(pattern)) {
    const phrase = `${match[1].toLowerCase()} ${match[2].toLowerCase().replace("autumn", "fall")}`;
    if (!allowed.has(phrase)) return match[0];
  }
  return null;
}

const UNIT_NAMES = [
  [/^inch(es)?$/i, "inch"],
  [/^weeks?$/i, "week"],
  [/^days?$/i, "day"],
  [/^(lbs?|pounds?)$/i, "lb"],
  [/^minutes?$/i, "minute"],
  [/^hours?$/i, "hour"],
  [/^times$/i, "times"],
];

/**
 * Number + unit amounts in text, normalized: "3-4 inches" -> ["3 inch", "4 inch"],
 * "2+ weeks" -> ["2 week"]. Week references like "week 2" are not amounts.
 */
export function amountsIn(text) {
  const pattern = /(\d+(?:\.\d+)?(?:\s*(?:-|–|—|to|or)\s*\d+(?:\.\d+)?)*)\s*\+?\s*(inches|inch|weeks?|days?|lbs?|pounds?|minutes?|hours?|times)\b/gi;
  const out = [];
  for (const match of text.matchAll(pattern)) {
    const unit = UNIT_NAMES.find(([re]) => re.test(match[2]))[1];
    for (const n of match[1].match(/\d+(?:\.\d+)?/g)) out.push(`${n} ${unit}`);
  }
  return out;
}

/** Amounts the plan may use: those in the grass guide entry, the confirmed issues' tips, and the reseed reminder. */
export function allowedAmounts(grassType, issueKeys) {
  const grass = lawnGuide.grassTypes[grassType] || lawnGuide.grassTypes["not-sure"];
  const tips = issueKeys.filter((k) => lawnGuide.issues[k]).map((k) => lawnGuide.issues[k].tip);
  return new Set(amountsIn([JSON.stringify(grass), ...tips, RESEED_REMINDER].join("\n")));
}
