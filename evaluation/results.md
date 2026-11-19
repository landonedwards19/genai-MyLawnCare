# Test case results

- Run: 2026-11-19T02:56:24.411Z
- Plan date ("today"): 2026-11-19
- API: http://localhost:80/api
- Result: **27/27 checks passed**

| Case | Analysis source | Plan source | Checks |
|---|---|---|---|
| 1. Typical | ai | ai | 7/7 |
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

**Detected issues** (source: `ai`, 2357 ms)

| Issue | Status | Evidence | Severity |
|---|---|---|---|
| bare | present | "a couple bare patches near the driveway" | medium |
| weeds | present | "some dandelions and clover" | medium |
| dry | absent |  | low |
| thin | present | "thin in spots" | medium |
| shade | absent |  | low |

- Goals: "Thick, even lawn", "Dark green color", "No weeds", "No bare spots"
- Other concerns: (none)

**Confirmed issues** (the pre-checked "present" ones)

- bare: "a couple bare patches near the driveway"
- weeds: "some dandelions and clover"
- thin: "thin in spots"

**Plan** (source: `ai`, 10316 ms)

> Late fall and early winter is not the right time to seed Tall Fescue in your region—that happens in spring (March–April) or late summer (August–September). For now, we'll prepare those bare and thin spots, tackle weeds, and keep your grass healthy through the cold months ahead.

### Week 1: Late Fall: Prepare and Tackle Weeds

_Why: Late fall is your last chance to feed before dormancy, and weeds are easiest to pull when soil is moist._

- **Mow:** Mow at 3–4 inches, about once a week as the grass slows down.
- **Water:** Water about 1 inch per week in early morning with 1–2 deep soakings if rainfall is light.
- **Fertilize:** Apply slow-release nitrogen at about 0.5–1 lb N per 1,000 sq ft. This is a good final feeding before growth stops for winter.
- **Also:** Rake bare spots near the driveway to loosen the soil; mark them so you remember to seed in spring.
- **Also:** Hand-pull dandelions and clover after rain when roots come out easily, or spot-treat with a selective weed killer—follow the product label.

### Week 2: Late Fall: Mow and Manage Weeds

_Why: Your grass is entering dormancy, so feeding stops; focus on weed control and prep work for spring seeding._

- **Mow:** Mow at 3–4 inches as needed. Mowing slows as temperatures drop.
- **Water:** Water about 1 inch per week in early morning with 1–2 deep soakings if rainfall is light.
- **Fertilize:** No fertilizer this week.
- **Also:** Keep pulling or spot-treating weeds to weaken them before winter.
- **Also:** Mow marked bare spots close so you can easily reseed them in spring.

### Week 3: Early Winter: Minimal Mowing

_Why: Cool-season grass goes dormant in early winter; your lawn needs little care._

- **Mow:** Mow only if grass is still growing; most weeks you will skip this.
- **Water:** Water about 1 inch per week in early morning with 1–2 deep soakings if rainfall is light. Reduce if snow or heavy rain provides moisture.
- **Fertilize:** No fertilizer this week.
- **Also:** Continue to hand-pull any visible weeds if conditions allow.

### Week 4: Early Winter: Rest and Monitor

_Why: Your lawn is dormant and requires almost no maintenance during deep winter._

- **Mow:** No mowing needed; grass is dormant.
- **Water:** Water about 1 inch per week in early morning with 1–2 deep soakings if rainfall is light. Skip if snow or ice is present.
- **Fertilize:** No fertilizer this week.
- **Also:** Review your bare and thin spots and plan to seed them in spring (March or April).

### Week 5: Early Winter: Dormant Care

_Why: Your lawn is resting; focus on staying off it to avoid compaction._

- **Mow:** No mowing needed; grass is dormant.
- **Water:** Water about 1 inch per week in early morning with 1–2 deep soakings if rainfall is light. Skip if snow or ice is present.
- **Fertilize:** No fertilizer this week.

### Week 6: Early Winter: Holiday Rest

_Why: Dormant season continues; use this time to plan your spring lawn refresh._

- **Mow:** No mowing needed; grass is dormant.
- **Water:** Water about 1 inch per week in early morning with 1–2 deep soakings if rainfall is light. Skip if snow or ice is present.
- **Fertilize:** No fertilizer this week.
- **Also:** Plan your seeding strategy for spring: overseed thin areas and seed bare spots in March or April.

**Checks**

- PASS: bare is present (got: present)
- PASS: weeds is present (got: present)
- PASS: thin is present (got: present)
- PASS: shade is absent (got: absent)
- PASS: no fertilizer in weeks the guide rules out for this grass and region (restricted weeks: none; got feeding in: none)
- PASS: week titles match their dates' season (got: all match)
- PASS: every amount with a unit comes from the guide (got invented: none)

## 2. Challenge (vague)

**Inputs**

| Field | Value |
|---|---|
| ZIP | 33101 |
| Grass type | not-sure |
| Now | it's ok i guess. |
| Goal | better. |

**Detected issues** (source: `ai`, 1597 ms)

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

**Plan** (source: `ai`, 8931 ms)

> Welcome to lawn care! Since you're not sure of your grass type yet, we'll keep things simple and safe this fall and early winter. A quick trip to your garden center with a grass sample will help us fine-tune your plan in spring.

### Week 1: Late Fall Mowing

_Why: Late fall is winding down for most grasses; keep mowing and watering as needed, but skip fertilizer now._

- **Mow:** Mow at about 3 inches (a safe middle height), about once a week. Never cut more than a third of the blade.
- **Water:** Water early morning with 1-2 deep soakings to reach about 1 inch per week, unless recent rain has done the job.
- **Fertilize:** No fertilizer this week.
- **Also:** Collect a small grass sample and bring it to your local garden center to identify your exact grass type—this will help us tailor your spring plan.

### Week 2: Late Fall Routine

_Why: Late fall continues; stick with regular mowing and watering as the season slows down._

- **Mow:** Mow at about 3 inches, about once a week. Never cut more than a third of the blade.
- **Water:** Water early morning with 1-2 deep soakings to reach about 1 inch per week, unless recent rain has done the job.
- **Fertilize:** No fertilizer this week.

### Week 3: Early Winter Care

_Why: Early winter brings dormancy for warm-season grasses and slow growth for cool-season types; mow and water only as needed._

- **Mow:** Mow at about 3 inches if needed. As growth slows, you may mow less often.
- **Water:** Water early morning with 1-2 deep soakings to reach about 1 inch per week, unless recent rain or cold weather has stopped growth.
- **Fertilize:** No fertilizer this week.

### Week 4: Early Winter Maintenance

_Why: Early winter is a rest period for most grasses in your region; minimal mowing and watering are needed._

- **Mow:** Mow at about 3 inches if needed. Most grasses need little or no mowing now.
- **Water:** Water early morning with 1-2 deep soakings to reach about 1 inch per week only if the lawn is actively growing and soil is dry.
- **Fertilize:** No fertilizer this week.

### Week 5: Early Winter Rest

_Why: Early winter dormancy means your lawn needs very little attention right now._

- **Mow:** Mow at about 3 inches only if the grass is actively growing.
- **Water:** Water early morning with 1-2 deep soakings to reach about 1 inch per week only if soil is dry and growth is visible.
- **Fertilize:** No fertilizer this week.

### Week 6: Holiday Season Care

_Why: Early winter continues; your lawn is dormant or barely growing, so maintenance is minimal during the holidays._

- **Mow:** Mow at about 3 inches only if the grass is actively growing.
- **Water:** Water early morning with 1-2 deep soakings to reach about 1 inch per week only if soil is dry and growth is visible.
- **Fertilize:** No fertilizer this week.
- **Also:** Plan ahead: once you've identified your grass type, we can schedule your first balanced feeding in early spring.

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

**Detected issues** (source: `ai`, 1601 ms)

| Issue | Status | Evidence | Severity |
|---|---|---|---|
| bare | absent |  | low |
| weeds | absent |  | low |
| dry | absent |  | low |
| thin | absent |  | low |
| shade | absent |  | low |

- Goals: "Keep lawn looking healthy and thick"
- Other concerns: (none)

**Confirmed issues** (the pre-checked "present" ones)

- (none)

**Plan** (source: `ai`, 8541 ms)

> Your tall fescue is winding down for winter, so we'll keep mowing light, water less often, and skip feeding since the grass is slowing growth. This plan keeps your lawn healthy and ready to thrive again in spring.

### Week 1: Late Fall Transition

_Why: Late fall is when cool-season grass begins dormancy, so we keep mowing light and hold off on feeding._

- **Mow:** Mow at 3-4 inches, about once a week. This may be one of the last mowings before the grass stops growing.
- **Water:** Water about 1 inch per week in one or two deep soakings in early morning if rain hasn't fallen. Tall fescue has deep roots that benefit from deep watering.
- **Fertilize:** No fertilizer this week. Your fescue is slowing down as winter approaches.

### Week 2: Late Fall, Last Mow

_Why: Late fall growth is minimal, and feeding now would waste fertilizer since the grass will not use it._

- **Mow:** Mow at 3-4 inches if the grass is still visibly growing. It may be the final mow of the season.
- **Water:** Water about 1 inch per week in one or two deep soakings in early morning, but taper off as temperatures drop and growth slows.
- **Fertilize:** No fertilizer this week. Fescue is entering dormancy and does not need feeding.

### Week 3: Early Winter Rest

_Why: Early winter means dormancy for cool-season grass, so we stop regular care and let the lawn rest._

- **Mow:** No mowing. Grass is dormant or barely growing in winter.
- **Water:** No watering needed. Winter rains and snow provide moisture; deep watering is unnecessary now.
- **Fertilize:** No fertilizer this week. Dormant grass cannot use it.

### Week 4: Early Winter Dormancy

_Why: During early winter dormancy, your lawn requires no active care—just let it rest._

- **Mow:** No mowing. Grass remains dormant.
- **Water:** No watering needed. Winter moisture from snow and rain is sufficient.
- **Fertilize:** No fertilizer this week. The lawn is dormant and does not need feeding.

### Week 5: Early Winter Maintenance

_Why: Early winter dormancy continues; the lawn needs no feeding or mowing._

- **Mow:** No mowing. Grass is dormant.
- **Water:** No watering needed. Natural winter moisture is adequate.
- **Fertilize:** No fertilizer this week. Dormant grass cannot absorb nutrients.

### Week 6: Early Winter Rest

_Why: Early winter is dormancy time for cool-season grass; resume care in spring when growth resumes._

- **Mow:** No mowing. Grass is dormant.
- **Water:** No watering needed. Winter precipitation provides all necessary moisture.
- **Fertilize:** No fertilizer this week. Wait until spring growth begins to resume feeding.

**Checks**

- PASS: bare is absent (got: absent)
- PASS: weeds is absent (got: absent)
- PASS: dry is absent (got: absent)
- PASS: thin is absent (got: absent)
- PASS: shade is absent (got: absent)
- PASS: plan has no seeding, weeds, shade steps (got: none)
- PASS: no fertilizer in weeks the guide rules out for this grass and region (restricted weeks: none; got feeding in: none)
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

**Detected issues** (source: `ai`, 2076 ms)

| Issue | Status | Evidence | Severity |
|---|---|---|---|
| bare | absent |  | low |
| weeds | absent |  | low |
| dry | present | "Some brown, crispy areas by the sidewalk." | medium |
| thin | absent |  | low |
| shade | absent |  | low |

- Goals: "Dark green lawn", "Weed-free under oak tree"
- Other concerns: (none)

**Confirmed issues** (the pre-checked "present" ones)

- dry: "Some brown, crispy areas by the sidewalk."

**Plan** (source: `ai`, 8964 ms)

> Your Bermuda grass is heading into dormancy as temperatures drop, so mowing and watering will taper off. We'll focus on keeping those dry spots by the sidewalk hydrated through the winter so your lawn stays healthy when it greens up in spring.

### Week 1: Late Fall: Check Dry Spots

_Why: Late fall is when Bermuda starts to slow down and brown naturally, so this is the time to fix irrigation issues before dormancy._

- **Mow:** Mow at 1-2 inches. As growth slows, you may only need to mow once this week or skip it if the grass isn't growing much.
- **Water:** Water the dry areas by the sidewalk deeply: use a screwdriver to check if water soaks in 6 inches. If not, water less often but longer. Place a tuna can under your sprinkler to measure how much water is actually falling.
- **Fertilize:** No fertilizer this week.
- **Also:** Mark the dry spots so you can monitor them through winter.

### Week 2: Late Fall: Adjust Watering

_Why: Bermuda is nearly dormant now, so it needs less water overall, but those dry spots still need attention before the grass goes completely brown._

- **Mow:** Mow only if the grass is still growing noticeably; otherwise, skip this week.
- **Water:** Continue watering dry spots deeply once or twice this week, based on how much rain falls. Your tuna-can test will show if your sprinkler is putting down enough.
- **Fertilize:** No fertilizer this week.

### Week 3: Early Winter: Minimal Mowing

_Why: Early winter means dormancy for warm-season grass—it's naturally brown and doesn't need feeding or frequent care._

- **Mow:** Skip mowing. Bermuda is dormant or nearly dormant and won't grow much.
- **Water:** Water dry spots lightly only if there's no rain and the soil is very hard. Dormant grass needs far less water.
- **Fertilize:** No fertilizer this week.

### Week 4: Early Winter: Rest Period

_Why: Your Bermuda is dormant and doesn't require maintenance now. Focus on keeping those dry-spot areas in mind for spring recovery._

- **Mow:** No mowing needed.
- **Water:** No watering needed unless it's unusually dry. Let winter rain do the work.
- **Fertilize:** No fertilizer this week.

### Week 5: Early Winter: Dormancy

_Why: Deep winter is a rest period for warm-season grass. Your lawn will stay brown until spring warmth returns._

- **Mow:** No mowing.
- **Water:** No watering needed.
- **Fertilize:** No fertilizer this week.

### Week 6: Early Winter: Holiday Break

_Why: Your Bermuda will remain dormant through the holiday season. Enjoy the break—spring feeding and growth will return in a few months._

- **Mow:** No mowing.
- **Water:** No watering needed.
- **Fertilize:** No fertilizer this week.

**Checks**

- PASS: dry is present (got: present)
- PASS: weeds is absent (got: absent)
- PASS: shade is not present (absent or unclear) (got: absent)
- PASS: no fertilizer in weeks the guide rules out for this grass and region (restricted weeks: 1, 2, 3, 4, 5, 6; got feeding in: none)
- PASS: week titles match their dates' season (got: all match)
- PASS: every amount with a unit comes from the guide (got invented: none)
