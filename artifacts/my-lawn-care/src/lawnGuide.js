/*
 * LAWN GUIDE - all guidance text for My Lawn Care lives here.
 *
 * How to edit:
 * - grassTypes: one entry per grass. Change the text in mow / water / fertilize
 *   freely. "season" must be "cool", "warm", or "unknown".
 * - issues: extra tips added to the plan when any of the "keywords" appear in
 *   the user's descriptions. Add a new issue by copying an existing block.
 *   "weeks" lists which plan weeks (1-based) get the tip.
 * - regions: rough climate lookup by the FIRST digit of a US ZIP code.
 * - Plain text only. No code changes are needed elsewhere when you edit this.
 */

export const lawnGuide = {
  grassTypes: {
    "kentucky-bluegrass": {
      label: "Kentucky Bluegrass",
      season: "cool",
      mow: { height: "2.5-3.5 inches", frequency: "every 5-7 days during active growth" },
      water: { amount: "about 1 to 1.25 inches per week", timing: "early morning, 2-3 deep soakings" },
      fertilize: "Light feeding with a slow-release nitrogen fertilizer (about 0.5-1 lb N per 1,000 sq ft). Heaviest feeding belongs in early fall.",
    },
    "tall-fescue": {
      label: "Tall Fescue",
      season: "cool",
      mow: { height: "3-4 inches", frequency: "about once a week" },
      water: { amount: "about 1 inch per week", timing: "early morning, 1-2 deep soakings (it has deep roots)" },
      fertilize: "Slow-release nitrogen at about 0.5-1 lb N per 1,000 sq ft. Fescue is a light feeder; skip heavy summer feeding.",
    },
    "perennial-ryegrass": {
      label: "Perennial Ryegrass",
      season: "cool",
      mow: { height: "2-3 inches", frequency: "every 5-7 days" },
      water: { amount: "about 1 to 1.5 inches per week", timing: "early morning, 2-3 soakings; it dislikes drought" },
      fertilize: "Slow-release nitrogen at about 0.75-1 lb N per 1,000 sq ft. Spring and fall are best.",
    },
    bermuda: {
      label: "Bermuda",
      season: "warm",
      mow: { height: "1-2 inches", frequency: "every 4-6 days in summer" },
      water: { amount: "about 1 inch per week", timing: "early morning, 1-2 deep soakings" },
      fertilize: "Bermuda likes food: about 1 lb N per 1,000 sq ft every 4-6 weeks while it is green and growing.",
    },
    zoysia: {
      label: "Zoysia",
      season: "warm",
      mow: { height: "1.5-2.5 inches", frequency: "every 7-10 days" },
      water: { amount: "about 1 inch per week", timing: "early morning, 1-2 deep soakings" },
      fertilize: "Moderate feeder: about 0.5-1 lb N per 1,000 sq ft, once in late spring and once mid-summer.",
    },
    "st-augustine": {
      label: "St. Augustine",
      season: "warm",
      mow: { height: "3.5-4 inches", frequency: "every 5-7 days" },
      water: { amount: "about 1 to 1.25 inches per week", timing: "early morning, 2 soakings; watch for wilting blades" },
      fertilize: "About 0.5-1 lb N per 1,000 sq ft every 6-8 weeks in the growing season. Avoid weed-and-feed products, which can harm it.",
    },
    "not-sure": {
      label: "Not sure",
      season: "unknown",
      mow: { height: "about 3 inches (a safe middle height)", frequency: "about once a week; never cut more than a third of the blade" },
      water: { amount: "about 1 inch per week", timing: "early morning, 1-2 deep soakings" },
      fertilize: "One light feeding with a balanced slow-release fertilizer is a safe start. A garden center can identify your grass from a small sample.",
    },
  },

  // Tips shown when keywords are found in either description.
  issues: {
    bare: {
      label: "Bare or patchy spots",
      keywords: ["bare", "patch", "patchy", "dirt", "spots", "holes", "gaps"],
      tip: "Rake bare spots to loosen the soil, spread seed matched to your grass, and keep those spots lightly moist (short daily sprinkles) until seedlings are about 2 inches tall.",
      weeks: [1, 2, 3],
    },
    weeds: {
      label: "Weeds",
      keywords: ["weed", "weeds", "dandelion", "clover", "crabgrass", "thistle"],
      tip: "Pull weeds by hand after a rain when roots slip out easily, or spot-treat with a selective weed killer. Thick, tall grass is the best long-term weed control.",
      weeks: [1, 3],
    },
    dry: {
      label: "Brown or dry areas",
      keywords: ["brown", "dry", "dead", "yellow", "crispy", "burnt", "drought"],
      tip: "Check dry spots with a screwdriver: if it won't push in 6 inches, water deeper and less often. Place a tuna can out to measure how much your sprinkler actually puts down.",
      weeks: [1, 2, 4],
    },
    thin: {
      label: "Thin grass",
      keywords: ["thin", "sparse", "weak", "spotty", "not thick"],
      tip: "Overseed thin areas and consider core aerating first if the soil feels hard. Keep the mower on the high end of your range.",
      weeks: [2, 3],
    },
    shade: {
      label: "Shade",
      keywords: ["shade", "shady", "tree", "trees", "dark"],
      tip: "Shaded grass needs a little less water and less fertilizer. Mow it about half an inch higher, and consider a shade-tolerant seed blend like fine fescue.",
      weeks: [2, 4],
    },
  },

  // Rough climate regions by the first digit of a US ZIP code.
  regions: {
    0: { name: "Northeast", climate: "cool" },
    1: { name: "Northeast / Mid-Atlantic", climate: "cool" },
    2: { name: "Mid-Atlantic / Upper South", climate: "transition" },
    3: { name: "Southeast", climate: "warm" },
    4: { name: "Great Lakes / Ohio Valley", climate: "cool" },
    5: { name: "Upper Midwest / Northern Plains", climate: "cool" },
    6: { name: "Central Plains", climate: "transition" },
    7: { name: "South Central", climate: "warm" },
    8: { name: "Mountain West / Southwest", climate: "dry" },
    9: { name: "Pacific West", climate: "mild" },
  },

  // Short notes added to the summary based on the climate.
  climateNotes: {
    cool: "Your area favors cool-season grasses, which grow best in spring and fall.",
    warm: "Your area favors warm-season grasses, which grow strongest in the heat of summer.",
    transition: "You're in the transition zone, where both cool- and warm-season grasses can work but each has tough months.",
    dry: "Your area runs dry, so deep, infrequent watering and early-morning timing matter a lot.",
    mild: "Your area is fairly mild; adjust watering to your local rainfall, which can vary a lot along the coast.",
  },

  // Week titles for the plan, in order.
  weekTitles: [
    "Get a baseline",
    "Fix the trouble spots",
    "Build the routine",
    "Feed and thicken",
    "Fine-tune",
    "Keep it going",
  ],
};
