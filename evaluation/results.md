# Test case results

- Run: 2026-11-19T03:07:54.911Z
- Plan date ("today"): 2026-11-19
- API: http://localhost:80/api
- Result: **26/28 checks passed**

| Case | Analysis source | Plan source | Checks |
|---|---|---|---|
| 1. Typical | ai | fallback | 6/8 |
| 2. Challenge (vague) | ai | ai | 5/5 |
| 3. Healthy-lawn regression | ai | ai | 9/9 |
| 4. Goal-only wording | ai | ai | 6/6 |

## 1. Typical

**Inputs**

| Field | Value |
|---|---|
| ZIP | 46556 |
| Grass type | tall-fescue |
| Now | Mostly green but thin in spots, some dandelions and clover, a couple bare patches near the driveway. |
| Goal | Thick, even, dark green lawn with no weeds or bare spots. |

**Detected issues** (source: `ai`, 2560 ms)

| Issue | Status | Evidence | Severity |
|---|---|---|---|
| bare | present | "a couple bare patches near the driveway" | medium |
| weeds | present | "some dandelions and clover" | medium |
| dry | absent |  | low |
| thin | present | "thin in spots" | medium |
| shade | absent |  | low |

- Goals: "thick, even lawn", "dark green color", "eliminate weeds", "eliminate bare spots"
- Other concerns: (none)

**Confirmed issues** (the pre-checked "present" ones)

- bare: "a couple bare patches near the driveway"
- weeds: "some dandelions and clover"
- thin: "thin in spots"

**Plan** (source: `fallback`, 17753 ms)

> Here's a 6-week plan for Tall Fescue in the Great Lakes / Ohio Valley. Your area favors cool-season grasses, which grow best in spring and fall. You flagged bare or patchy spots, weeds, thin grass, so I've folded in a few fixes.

### Week 1: Get a baseline

- **Mow:** Mow at 3-4 inches, about once a week. Start by sharpening your mower blade; clean cuts keep grass healthier. Skip mowing newly seeded spots until the new grass reaches mowing height.
- **Water:** Give about 1 inch per week, early morning, 1-2 deep soakings (it has deep roots). Also mist seeded areas lightly once or twice a day.
- **Fertilize:** Hold off this week. Just observe how the lawn responds to steady mowing and watering.
- **Also:** Bare or patchy spots: Rake bare spots to loosen the soil, spread seed matched to your grass, and keep those spots lightly moist (short daily sprinkles) until seedlings are about 2 inches tall.
- **Also:** Weeds: Pull weeds by hand after a rain when roots slip out easily, or spot-treat with a selective weed killer. Thick, tall grass is the best long-term weed control.

### Week 2: Fix the trouble spots

- **Mow:** Mow at 3-4 inches, about once a week. Skip mowing newly seeded spots until the new grass reaches mowing height.
- **Water:** Give about 1 inch per week, early morning, 1-2 deep soakings (it has deep roots). Also mist seeded areas lightly once or twice a day.
- **Fertilize:** Use a starter fertilizer on seeded areas only.
- **Also:** Bare or patchy spots: Rake bare spots to loosen the soil, spread seed matched to your grass, and keep those spots lightly moist (short daily sprinkles) until seedlings are about 2 inches tall.
- **Also:** Thin grass: Overseed thin areas and consider core aerating first if the soil feels hard. Keep the mower on the high end of your range.

### Week 3: Build the routine

- **Mow:** Mow at 3-4 inches, about once a week. Skip mowing newly seeded spots until the new grass reaches mowing height.
- **Water:** Give about 1 inch per week, early morning, 1-2 deep soakings (it has deep roots). Also mist seeded areas lightly once or twice a day.
- **Fertilize:** No fertilizer this week. Water any recent feeding in well.
- **Also:** Bare or patchy spots: Rake bare spots to loosen the soil, spread seed matched to your grass, and keep those spots lightly moist (short daily sprinkles) until seedlings are about 2 inches tall.
- **Also:** Weeds: Pull weeds by hand after a rain when roots slip out easily, or spot-treat with a selective weed killer. Thick, tall grass is the best long-term weed control.
- **Also:** Thin grass: Overseed thin areas and consider core aerating first if the soil feels hard. Keep the mower on the high end of your range.

### Week 4: Feed and thicken

- **Mow:** Mow at 3-4 inches, about once a week.
- **Water:** Give about 1 inch per week, early morning, 1-2 deep soakings (it has deep roots).
- **Fertilize:** Slow-release nitrogen at about 0.5-1 lb N per 1,000 sq ft. Fescue is a light feeder; skip heavy summer feeding.

### Week 5: Fine-tune

- **Mow:** Mow at 3-4 inches, about once a week.
- **Water:** Give about 1 inch per week, early morning, 1-2 deep soakings (it has deep roots).
- **Fertilize:** No fertilizer this week. Water any recent feeding in well.

### Week 6: Keep it going

- **Mow:** Mow at 3-4 inches, about once a week. Leave clippings on the lawn; they return free nutrients.
- **Water:** Give about 1 inch per week, early morning, 1-2 deep soakings (it has deep roots).
- **Fertilize:** No fertilizer this week. Water any recent feeding in well.

**Checks**

- PASS: bare is present (got: present)
- PASS: weeds is present (got: present)
- PASS: thin is present (got: present)
- PASS: shade is absent (got: absent)
- FAIL: no fertilizer in weeks the guide rules out for this grass and region (restricted weeks: 3, 4, 5, 6; got feeding in: week 4 "Slow-release nitrogen at about 0.5-1 lb N per 1,00")
- PASS: week titles match their dates' season (got: all match)
- PASS: every amount with a unit comes from the guide (got invented: none)
- FAIL: weeks 4, 5, 6 have no weekly watering (got: week 4 "per week", week 5 "per week", week 6 "per week")

## 2. Challenge (vague)

**Inputs**

| Field | Value |
|---|---|
| ZIP | 33101 |
| Grass type | not-sure |
| Now | it's ok i guess. |
| Goal | better. |

**Detected issues** (source: `ai`, 1736 ms)

| Issue | Status | Evidence | Severity |
|---|---|---|---|
| bare | unclear |  | low |
| weeds | unclear |  | low |
| dry | unclear |  | low |
| thin | unclear |  | low |
| shade | unclear |  | low |

- Goals: "better lawn"
- Other concerns: (none)

**Confirmed issues** (the pre-checked "present" ones)

- (none)

**Plan** (source: `ai`, 7698 ms)

> Welcome to lawn care! Since we're heading into winter dormancy, your grass will slow down or stop growing soon. This plan keeps things simple while your lawn rests, then sets you up for a fresh start in spring.

### Week 1: Late Fall Cleanup

_Why: Your lawn is still growing a bit, so mowing helps it stay healthy before dormancy sets in._

- **Mow:** Mow about once a week at about 3 inches (a safe middle height). Never cut more than a third of the blade.
- **Water:** Water early morning with about 1 inch per week in 1-2 deep soakings if there's been no recent rain.
- **Fertilize:** No fertilizer this week.
- **Also:** Rake fallen leaves so they don't smother the grass.
- **Also:** Take a small sample of grass (roots and all) to your local garden center—they can identify your grass type, which helps with future care.

### Week 2: Late Fall Transition

_Why: Late fall is the transition period; your grass is slowing down as temperatures drop._

- **Mow:** Mow about once a week at about 3 inches (a safe middle height). Never cut more than a third of the blade.
- **Water:** Water early morning with about 1 inch per week in 1-2 deep soakings if there's been no recent rain.
- **Fertilize:** No fertilizer this week.
- **Also:** Continue raking leaves as they fall.
- **Also:** Watch for the first hard frost—that's when your grass will likely go dormant.

### Week 3: Early Winter Rest

_Why: Your grass is now dormant and won't grow until spring, so mowing and feeding aren't needed._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 4: Early Winter Rest

_Why: Your lawn is dormant and resting through the cold._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 5: Early Winter Rest

_Why: Your lawn is dormant and resting through the cold._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 6: Early Winter Rest

_Why: Your lawn is dormant and resting through the cold._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.
- **Also:** Plan ahead: once spring arrives and growth resumes, you'll be ready to start regular mowing and watering again.

**Checks**

- PASS: no issue present (got: none)
- PASS: no week titled "Fix the trouble spots" (got: none)
- PASS: no fertilizer in weeks the guide rules out for this grass and region (restricted weeks: 1, 2, 3, 4, 5, 6; got feeding in: none)
- PASS: week titles match their dates' season (got: all match)
- PASS: every amount with a unit comes from the guide (got invented: none)

## 3. Healthy-lawn regression

**Inputs**

| Field | Value |
|---|---|
| ZIP | 46556 |
| Grass type | tall-fescue |
| Now | Healthy, thick lawn. No weeds, no bare patches, and no shade. |
| Goal | Keep it looking this good. |

**Detected issues** (source: `ai`, 1573 ms)

| Issue | Status | Evidence | Severity |
|---|---|---|---|
| bare | absent |  | low |
| weeds | absent |  | low |
| dry | absent |  | low |
| thin | absent |  | low |
| shade | absent |  | low |

- Goals: "Keep it looking this good"
- Other concerns: (none)

**Confirmed issues** (the pre-checked "present" ones)

- (none)

**Plan** (source: `ai`, 6947 ms)

> Your Tall Fescue is heading into dormancy, so we're wrapping up fall care and then shifting to minimal maintenance through the holidays. Keep it simple—one last feeding now, then let it rest until spring.

### Week 1: Final Fall Feeding

_Why: Late fall is the perfect time for your final nitrogen boost before the grass goes dormant and stops growing._

- **Mow:** Mow at 3-4 inches, about once a week.
- **Water:** Water about 1 inch per week in early morning with 1-2 deep soakings.
- **Fertilize:** Apply slow-release nitrogen at about 0.5-1 lb N per 1,000 sq ft. This is your last feeding before dormancy.

### Week 2: Wrapping Up Fall

_Why: Growth is slowing as temperatures drop, so you're mainly tidying up before dormancy arrives._

- **Mow:** Mow at 3-4 inches if needed, about once a week.
- **Water:** Water about 1 inch per week in early morning with 1-2 deep soakings.
- **Fertilize:** No fertilizer this week.

### Week 3: Early Winter Rest

_Why: Your grass is dormant now and won't grow until spring, so it needs almost no care._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 4: Winter Dormancy

_Why: Still dormant and protected by winter; just leave it alone._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 5: Deep Winter

_Why: Peak winter means your grass is fully dormant and doesn't need any maintenance._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 6: Holiday Week

_Why: Still in deep dormancy; your lawn is resting and will wake up in spring._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

**Checks**

- PASS: bare is absent (got: absent)
- PASS: weeds is absent (got: absent)
- PASS: dry is absent (got: absent)
- PASS: thin is absent (got: absent)
- PASS: shade is absent (got: absent)
- PASS: plan has no seeding, weeds, shade steps (got: none)
- PASS: no fertilizer in weeks the guide rules out for this grass and region (restricted weeks: 3, 4, 5, 6; got feeding in: none)
- PASS: week titles match their dates' season (got: all match)
- PASS: every amount with a unit comes from the guide (got invented: none)

## 4. Goal-only wording

**Inputs**

| Field | Value |
|---|---|
| ZIP | 30301 |
| Grass type | bermuda |
| Now | Some brown, crispy areas by the sidewalk. |
| Goal | Dark green and weed-free under the big oak tree. |

**Detected issues** (source: `ai`, 2151 ms)

| Issue | Status | Evidence | Severity |
|---|---|---|---|
| bare | absent |  | low |
| weeds | absent |  | low |
| dry | present | "brown, crispy areas by the sidewalk" | medium |
| thin | absent |  | low |
| shade | unclear |  | low |

- Goals: "dark green lawn", "weed-free under the big oak tree"
- Other concerns: (none)

**Confirmed issues** (the pre-checked "present" ones)

- dry: "brown, crispy areas by the sidewalk"

**Plan** (source: `ai`, 8796 ms)

> Your Bermuda grass is heading into dormancy as temperatures drop, so it needs less attention now. Focus on watering those dry spots deeply before winter arrives, then let your lawn rest through the cold months.

### Week 1: Late Fall: Final Mow & Deep Watering

_Why: Late fall is your last chance to fix dry spots before the grass goes dormant and watering stops._

- **Mow:** Mow at 1-2 inches if the grass still looks green and is growing; otherwise skip mowing.
- **Water:** Check your dry spots with a screwdriver—if it won't push in 6 inches, water deeper and less often. Place a tuna can under your sprinkler to measure how much water is actually reaching the lawn.
- **Fertilize:** No fertilizer this week.
- **Also:** Take note of which areas stayed brown or crispy so you know where to focus watering efforts.

### Week 2: Late Fall: Finish Prep for Dormancy

_Why: Bermuda is slowing down and will soon stop growing, so this is the final window to improve soil moisture in trouble spots._

- **Mow:** Mow at 1-2 inches only if green growth is still visible.
- **Water:** Continue deep, less frequent watering on dry spots. Use your tuna can measurement to confirm your sprinkler's output.
- **Fertilize:** No fertilizer this week.
- **Also:** This is your last week to water before dormancy—make those deep soakings count on the dry areas.

### Week 3: Early Winter: Dormant Rest

_Why: Your Bermuda is now dormant and brown—this is normal and healthy. The grass needs no care until spring warmth returns._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 4: Early Winter: Monitor & Protect

_Why: Your lawn is resting through winter. Just monitor for any unusual ice damage or persistent drought._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 5: Early Winter: Minimal Care

_Why: Dormant Bermuda needs almost no attention. Avoid foot traffic on frozen or icy spots if possible._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 6: Early Winter: Winter Maintenance

_Why: The holiday week is a good time to plan spring cleanup and think about how to prevent those dry spots next year._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

**Checks**

- PASS: dry is present (got: present)
- PASS: weeds is absent (got: absent)
- PASS: shade is not present (absent or unclear) (got: unclear)
- PASS: no fertilizer in weeks the guide rules out for this grass and region (restricted weeks: 1, 2, 3, 4, 5, 6; got feeding in: none)
- PASS: week titles match their dates' season (got: all match)
- PASS: every amount with a unit comes from the guide (got invented: none)
