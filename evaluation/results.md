# Test case results

- Run: 2026-11-19T03:16:57.362Z
- Plan date ("today"): 2026-11-19
- API: http://localhost:80/api
- Result: **37/37 checks passed**

| Case | Analysis source | Plan source | Checks |
|---|---|---|---|
| 1. Typical | ai | ai | 8/8 |
| 1b. Typical (forced fallback plan) | ai | fallback | 9/9 |
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

**Detected issues** (source: `ai`, 2523 ms)

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

**Plan** (source: `ai`, 15638 ms)

> Your tall fescue is heading into dormancy, so we'll finish fall care and prepare for winter. We'll tackle those bare and thin spots in spring when conditions are right for seeding, and handle weeds now while we can.

### Week 1: Late Fall Cleanup

_Why: Late fall is the last chance to feed cool-season grass before it sleeps, and you can still pull weeds easily._

- **Mow:** Mow at 3-4 inches, about once a week.
- **Water:** Water about 1 inch per week with 1-2 deep soakings in early morning.
- **Fertilize:** Apply slow-release nitrogen at about 0.5-1 lb N per 1,000 sq ft. This is a good time to feed before dormancy.
- **Also:** Pull weeds by hand after a rain when roots slip out easily, especially those dandelions and clover.
- **Also:** Rake the bare patches near the driveway to loosen the soil; mark them so you can seed in spring.

### Week 2: Final Fall Passes

_Why: Grass is slowing down, so you'll mow less often soon; tall blades help the lawn stay competitive against weeds._

- **Mow:** Mow at 3-4 inches, about once a week.
- **Water:** Water about 1 inch per week with 1-2 deep soakings in early morning if rainfall is light.
- **Fertilize:** No fertilizer this week.
- **Also:** Spot-treat any remaining weeds with a selective weed killer, following the product label.
- **Also:** Keep mowing at the high end of your range (closer to 4 inches) to help choke out weeds and keep thin spots competitive.

### Week 3: Early Winter Dormancy Begins

_Why: Grass is dormant now and won't grow; focus shifts to protecting the lawn through winter._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None

### Week 4: Winter Rest

_Why: Deep dormancy in early winter means minimal lawn care; the grass is fully at rest._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None

### Week 5: Deep Winter

_Why: Coldest time of year; your lawn needs no care except to protect it from heavy foot traffic on frozen grass._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None

### Week 6: Early Winter Hold

_Why: Still dormant, but spring is approaching; use this time to prepare your seeding strategy._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None
- **Also:** Plan to seed the bare and thin spots in March or April when soil warms and grass starts growing again.

**Checks**

- PASS: bare is present (got: present)
- PASS: weeds is present (got: present)
- PASS: thin is present (got: present)
- PASS: shade is absent (got: absent)
- PASS: no fertilizer in weeks the guide rules out for this grass and region (restricted weeks: 3, 4, 5, 6; got feeding in: none)
- PASS: week titles match their dates' season (got: all match)
- PASS: every amount with a unit comes from the guide (got invented: none)
- PASS: weeks 4, 5, 6 have no weekly watering (got: none)

## 1b. Typical (forced fallback plan)

**Inputs**

| Field | Value |
|---|---|
| ZIP | 46556 |
| Grass type | tall-fescue |
| Now | Mostly green but thin in spots, some dandelions and clover, a couple bare patches near the driveway. |
| Goal | Thick, even, dark green lawn with no weeds or bare spots. |
| Plan path | AI skipped (forced rule-based fallback) |

**Detected issues** (source: `ai`, 2250 ms)

| Issue | Status | Evidence | Severity |
|---|---|---|---|
| bare | present | "a couple bare patches near the driveway" | medium |
| weeds | present | "some dandelions and clover" | medium |
| dry | absent |  | low |
| thin | present | "thin in spots" | medium |
| shade | absent |  | low |

- Goals: "thick, even lawn", "dark green color", "no weeds", "no bare spots"
- Other concerns: (none)

**Confirmed issues** (the pre-checked "present" ones)

- bare: "a couple bare patches near the driveway"
- weeds: "some dandelions and clover"
- thin: "thin in spots"

**Plan** (source: `fallback`, 5 ms)

> Here's a 6-week plan for Tall Fescue in the Great Lakes / Ohio Valley, starting in late fall. Your area favors cool-season grasses, which grow best in spring and fall. You flagged bare or patchy spots, weeds, thin grass, so I've folded in a few fixes. Your grass goes dormant during this plan, so those weeks are mostly rest.

### Week 1: Late Fall: Get a baseline

- **Mow:** Mow at 3-4 inches, about once a week. Start by sharpening your mower blade; clean cuts keep grass healthier.
- **Water:** Give about 1 inch per week, early morning, 1-2 deep soakings (it has deep roots).
- **Fertilize:** No fertilizer this week.
- **Also:** Mark these spots and seed in spring.
- **Also:** Weeds: Pull weeds by hand after a rain when roots slip out easily, or spot-treat with a selective weed killer. Thick, tall grass is the best long-term weed control.

### Week 2: Late Fall: Feed the lawn

- **Mow:** Mow at 3-4 inches, about once a week.
- **Water:** Give about 1 inch per week, early morning, 1-2 deep soakings (it has deep roots).
- **Fertilize:** Slow-release nitrogen at about 0.5-1 lb N per 1,000 sq ft. Fescue is a light feeder; skip heavy summer feeding. Follow the product label.

### Week 3: Early Winter: Let it rest

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None. The grass is dormant, so it can't use fertilizer now.

### Week 4: Early Winter: Let it rest

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None. The grass is dormant, so it can't use fertilizer now.

### Week 5: Early Winter: Let it rest

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None. The grass is dormant, so it can't use fertilizer now.

### Week 6: Early Winter: Let it rest

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None. The grass is dormant, so it can't use fertilizer now.

**Checks**

- PASS: bare is present (got: present)
- PASS: weeds is present (got: present)
- PASS: thin is present (got: present)
- PASS: shade is absent (got: absent)
- PASS: no fertilizer in weeks the guide rules out for this grass and region (restricted weeks: 3, 4, 5, 6; got feeding in: none)
- PASS: week titles match their dates' season (got: all match)
- PASS: every amount with a unit comes from the guide (got invented: none)
- PASS: weeks 4, 5, 6 have no weekly watering (got: none)
- PASS: plan source is fallback (got: fallback)

## 2. Challenge (vague)

**Inputs**

| Field | Value |
|---|---|
| ZIP | 33101 |
| Grass type | not-sure |
| Now | it's ok i guess. |
| Goal | better. |

**Detected issues** (source: `ai`, 1581 ms)

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

**Plan** (source: `ai`, 13818 ms)

> Welcome to lawn care! Since we're heading into winter dormancy, your grass will slow down significantly over the next few weeks. This plan keeps things simple while your lawn rests, then you'll be ready to build on it next spring.

### Week 1: Late Fall Wrap-Up

_Why: Late fall means your grass is winding down for winter, so mowing and watering taper off._

- **Mow:** Mow at about 3 inches (a safe middle height), once if needed. Grass is slowing down, so you may skip this week if it hasn't grown much.
- **Water:** Water early morning with 1-2 deep soakings if there's been no rain. Aim for about 1 inch per week total.
- **Fertilize:** No fertilizer this week.
- **Also:** Rake fallen leaves so they don't smother the lawn.
- **Also:** Take a photo of a small grass sample and bring it to your garden center—they can identify your grass type, which helps with future care.

### Week 2: Preparing for Dormancy

_Why: Your grass is entering dormancy and doesn't need mowing or feeding right now._

- **Mow:** No mowing needed. Grass growth has essentially stopped.
- **Water:** Water early morning with 1-2 deep soakings only if there's been no rain. Aim for about 1 inch per week total.
- **Fertilize:** No fertilizer this week.
- **Also:** Clear any remaining debris from the lawn so it stays clean through winter.

### Week 3: Early Winter Dormancy

_Why: Your lawn is dormant during early winter and needs almost no care._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 4: Early Winter Rest

_Why: Dormant grass requires minimal attention in winter._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 5: Winter Maintenance

_Why: Still dormant—just monitor for extended dry spells._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 6: Winter Hold

_Why: Your lawn stays dormant through the end of the year and will wake up in spring._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.
- **Also:** Watch for signs of spring growth in late December or early January, depending on your Southeast location.

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

**Detected issues** (source: `ai`, 1646 ms)

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

**Plan** (source: `ai`, 7328 ms)

> Your tall fescue is heading into dormancy, so we're wrapping up fall care and then letting it rest through winter. Keep mowing through late fall, give it one final feeding, and then step back and let the cold do its thing.

### Week 1: Final Fall Mow & Prep

_Why: Late fall is your last chance to feed before dormancy; tall fescue slows down but still benefits from one final feeding now._

- **Mow:** Cut at 3-4 inches, about once a week.
- **Water:** Water at about 1 inch per week with 1-2 deep soakings in early morning.
- **Fertilize:** Apply slow-release nitrogen at about 0.5-1 lb N per 1,000 sq ft.

### Week 2: Late Fall Finish

_Why: Growth is slowing as temperatures drop; one final mow and light watering will keep things tidy before dormancy sets in._

- **Mow:** Cut at 3-4 inches, about once a week.
- **Water:** Water at about 1 inch per week with 1-2 deep soakings in early morning if rainfall is light.
- **Fertilize:** No fertilizer this week.

### Week 3: Early Winter Dormancy Begins

_Why: Tall fescue is now dormant; the grass has gone brown and is resting underground until spring returns._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 4: Winter Rest

_Why: Deep dormancy continues through early winter; your lawn needs no active care right now._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 5: Winter Rest

_Why: Winter weather is protecting your dormant lawn; check for ice damage after any thaws, but hands-off is best._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 6: Winter Rest

_Why: Still dormant heading into the holidays; snow and cold are keeping everything on pause until spring._

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

**Detected issues** (source: `ai`, 2150 ms)

| Issue | Status | Evidence | Severity |
|---|---|---|---|
| bare | absent |  | low |
| weeds | absent |  | low |
| dry | present | "brown, crispy areas by the sidewalk" | medium |
| thin | absent |  | low |
| shade | unclear |  | low |

- Goals: "Dark green lawn", "Weed-free under the oak tree"
- Other concerns: (none)

**Confirmed issues** (the pre-checked "present" ones)

- dry: "brown, crispy areas by the sidewalk"

**Plan** (source: `ai`, 14835 ms)

> Your Bermuda grass is heading into dormancy as fall turns to winter—it'll go brown and stop growing, which is totally normal. Right now, focus on wrapping up the season and fixing those dry spots so your lawn can rest strong. Once spring warmth returns, your grass will green up beautifully.

### Week 1: Late Fall Cleanup

_Why: Late fall is your last chance to mow and address watering issues before the grass goes dormant._

- **Mow:** Mow to 1-2 inches. This is likely one of the last mows before dormancy.
- **Water:** Water the dry spots by the sidewalk deeper and less often. Place a tuna can under your sprinkler to measure how many inches it actually puts down, then adjust to reach about 1 inch per week.
- **Fertilize:** No fertilizer this week.
- **Also:** Check those brown areas with a screwdriver—if it won't push in 6 inches, the soil is too dry and needs deeper soaking.

### Week 2: Final Fall Tasks

_Why: Your warm-season grass is shutting down as temperatures drop, so maintenance is winding down too._

- **Mow:** Mow to 1-2 inches if needed, but growth is slowing.
- **Water:** Continue deep, less-frequent watering on the dry sidewalk areas. Keep checking with the tuna can to monitor coverage.
- **Fertilize:** No fertilizer this week.
- **Also:** Watch for the first hard freeze—once it arrives, your Bermuda will go fully dormant and turn brown.

### Week 3: Early Winter Dormancy

_Why: Bermuda is now fully dormant and brown—this is completely normal and healthy for winter in the Southeast._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 4: Winter Rest

_Why: Your grass needs complete rest during the coldest part of winter._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 5: Deep Winter

_Why: Keep your lawn undisturbed so it can recover its energy for spring green-up._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.

### Week 6: Dormancy Continues

_Why: The dormant season continues through the holidays; the lawn is storing energy for its spring comeback._

- **Mow:** No mowing while dormant.
- **Water:** Only water if there has been no rain or snow for 3-4 weeks and the ground isn't frozen.
- **Fertilize:** None.
- **Also:** Spring is coming soon—once temperatures warm up consistently, your Bermuda will green up fast and you'll be back to regular mowing.

**Checks**

- PASS: dry is present (got: present)
- PASS: weeds is absent (got: absent)
- PASS: shade is not present (absent or unclear) (got: unclear)
- PASS: no fertilizer in weeks the guide rules out for this grass and region (restricted weeks: 1, 2, 3, 4, 5, 6; got feeding in: none)
- PASS: week titles match their dates' season (got: all match)
- PASS: every amount with a unit comes from the guide (got invented: none)
