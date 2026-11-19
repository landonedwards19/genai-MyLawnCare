# Test case results

- Run: 2026-11-19T02:49:48.201Z
- Plan date ("today"): 2026-11-19
- API: http://localhost:80/api
- Result: **15/15 checks passed**

| Case | Analysis source | Plan source | Checks |
|---|---|---|---|
| 1. Typical | ai | ai | 4/4 |
| 2. Challenge (vague) | ai | ai | 2/2 |
| 3. Healthy-lawn regression | ai | ai | 6/6 |
| 4. Goal-only wording | ai | ai | 3/3 |

## 1. Typical

**Inputs**

| Field | Value |
|---|---|
| ZIP | 46556 |
| Grass type | tall-fescue |
| Now | Mostly green but thin in spots, some dandelions and clover, a couple bare patches near the driveway. |
| Goal | Thick, even, dark green lawn with no weeds or bare spots. |

**Detected issues** (source: `ai`, 2453 ms)

| Issue | Status | Evidence | Severity |
|---|---|---|---|
| bare | present | "a couple bare patches near the driveway" | medium |
| weeds | present | "some dandelions and clover" | medium |
| dry | absent |  | low |
| thin | present | "thin in spots" | medium |
| shade | absent |  | low |

- Goals: "Thick, even lawn", "Dark green color", "Eliminate weeds", "Fill bare spots"
- Other concerns: (none)

**Confirmed issues** (the pre-checked "present" ones)

- bare: "a couple bare patches near the driveway"
- weeds: "some dandelions and clover"
- thin: "thin in spots"

**Plan** (source: `ai`, 19521 ms)

> Your tall fescue is heading into dormancy, so we'll focus on fall cleanup, weed management, and preparing bare and thin spots for spring seeding. Once the soil warms up in late winter or early spring, you'll overseed those problem areas to fill them in.

### Week 1: Fall cleanup and weed removal

_Why: Late fall is the time to clean up and tackle weeds while the soil is still workable; winter will slow everything down._

- **Mow:** Mow at 3-4 inches about once a week if the grass is still growing.
- **Water:** If you have dry weather, water about 1 inch per week in early morning. Otherwise, fall rain usually handles it.
- **Fertilize:** No fertilizer this week.
- **Also:** Pull dandelions and clover by hand after a rain when the soil is moist and roots come out easily.
- **Also:** Rake the bare spots near the driveway to loosen the soil and clear away dead grass and debris. Mark these spots so you remember them in spring.

### Week 2: Final mowing and thin-spot prep

_Why: Your tall fescue is slowing down as temperatures drop, so this is your last chance for easy maintenance before winter dormancy sets in._

- **Mow:** Mow at 3-4 inches if needed. This may be one of the last mows before dormancy.
- **Water:** Water about 1 inch per week in early morning if rainfall is sparse.
- **Fertilize:** No fertilizer this week.
- **Also:** Continue pulling any visible weeds before frost arrives.
- **Also:** Rake the thin spots lightly to loosen soil and prepare them for spring seeding. Avoid walking on bare areas.

### Week 3: Winter dormancy begins

_Why: Early winter means your cool-season grass has gone dormant and needs no care; just let it sleep._

- **Mow:** No mowing needed; the grass is dormant or nearly so.
- **Water:** No watering needed unless you have an unusually dry spell.
- **Fertilize:** No fertilizer this week.
- **Also:** Leave the lawn alone and let it rest. Avoid walking on frozen or very wet grass.
- **Also:** Note the locations of bare and thin spots so you can overseed them in spring.

### Week 4: Winter rest

_Why: Deep winter is a time for dormancy and rest; your grass needs nothing from you now._

- **Mow:** No mowing.
- **Water:** No watering needed.
- **Fertilize:** No fertilizer this week.

### Week 5: Winter rest continues

_Why: Still deep winter; the grass remains dormant under cold conditions._

- **Mow:** No mowing.
- **Water:** No watering needed.
- **Fertilize:** No fertilizer this week.

### Week 6: Plan for spring seeding

_Why: Late December is still winter dormancy, but spring seeding is just weeks away; use this time to plan._

- **Mow:** No mowing.
- **Water:** No watering needed.
- **Fertilize:** No fertilizer this week.
- **Also:** Start thinking about spring seeding. When temperatures warm up in March or April, you'll rake the bare and thin spots again, spread seed matched to tall fescue, and keep those areas lightly moist until seedlings reach about 2 inches tall.

**Checks**

- PASS: bare is present (got: present)
- PASS: weeds is present (got: present)
- PASS: thin is present (got: present)
- PASS: shade is absent (got: absent)

## 2. Challenge (vague)

**Inputs**

| Field | Value |
|---|---|
| ZIP | 33101 |
| Grass type | not-sure |
| Now | it's ok i guess. |
| Goal | better. |

**Detected issues** (source: `ai`, 1589 ms)

| Issue | Status | Evidence | Severity |
|---|---|---|---|
| bare | unclear |  | low |
| weeds | unclear |  | low |
| dry | unclear |  | low |
| thin | unclear |  | low |
| shade | unclear |  | low |

- Goals: "better"
- Other concerns: (none)

**Confirmed issues** (the pre-checked "present" ones)

- (none)

**Plan** (source: `ai`, 9313 ms)

> Welcome to lawn care! Since we're heading into winter in the Southeast, your grass is slowing down. This plan keeps things simple and steady while your lawn rests, and we'll help you identify your grass type so you can care for it even better next season.

### Week 1: Late Fall: Identify & Maintain

_Why: Late fall is winding down for warm-season grass, so a light feeding now gives it a gentle boost without pushing new growth into cold weather._

- **Mow:** Mow once this week at about 3 inches. Never cut more than a third of the blade.
- **Water:** Water early morning with about 1 inch per week in 1-2 deep soakings, unless rain covers it.
- **Fertilize:** One light feeding with a balanced slow-release fertilizer is a safe start. Follow the product label. A garden center can identify your grass from a small sample.
- **Also:** Collect a small sample of your grass (a pinch of blades with roots) and bring it to a local garden center to identify your type. This will help us plan better next season.

### Week 2: Late Fall: Ease Back

_Why: Your lawn is shifting into dormancy as temperatures drop, so mowing slows and you're just keeping up with what's left._

- **Mow:** Mow once at about 3 inches if the grass is still growing noticeably.
- **Water:** Water early morning with about 1 inch per week in 1-2 deep soakings if there's no rain.
- **Fertilize:** No fertilizer this week.

### Week 3: Early Winter: Rest & Observe

_Why: Early winter is dormant season for warm-season grass. It's not actively growing, so your main job is to avoid stressing it with extra work._

- **Mow:** Mow only if grass is growing visibly; growth usually stops by early winter in the Southeast.
- **Water:** Water early morning with about 1 inch per week in 1-2 deep soakings only if there's no rain and the ground feels dry.
- **Fertilize:** No fertilizer this week.

### Week 4: Early Winter: Minimal Care

_Why: Deep winter calls for the least intervention. Dormant grass needs almost no care—just ensure it's not bone dry._

- **Mow:** No mowing. The grass is dormant.
- **Water:** Water only if the ground is very dry and there's been no rain; about 1 inch per week in 1-2 deep soakings.
- **Fertilize:** No fertilizer this week.

### Week 5: Early Winter: Monitor & Wait

_Why: Still dormant. Warm-season grass won't green up or grow until spring warmth returns, so your job is just light maintenance._

- **Mow:** No mowing.
- **Water:** Water only if needed; about 1 inch per week in 1-2 deep soakings if no rain falls and soil is very dry.
- **Fertilize:** No fertilizer this week.

### Week 6: Early Winter: Holiday Rest

_Why: The grass is fully dormant and your lawn is in its deepest rest. Continue minimal care and plan your spring awakening._

- **Mow:** No mowing.
- **Water:** Water only if the ground is very dry; about 1 inch per week in 1-2 deep soakings.
- **Fertilize:** No fertilizer this week.

**Checks**

- PASS: no issue present (got: none)
- PASS: no week titled "Fix the trouble spots" (got: none)

## 3. Healthy-lawn regression

**Inputs**

| Field | Value |
|---|---|
| ZIP | 46556 |
| Grass type | tall-fescue |
| Now | Healthy, thick lawn. No weeds, no bare patches, and no shade. |
| Goal | Keep it looking this good. |

**Detected issues** (source: `ai`, 1577 ms)

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

**Plan** (source: `ai`, 7978 ms)

> Your tall fescue is heading into dormancy, so we'll ease off mowing and watering while keeping the lawn tidy. A light fall feeding now will help it spring back strong in spring.

### Week 1: Final Fall Mow & Feed

_Why: Late fall is the perfect window for a final feeding before your grass shuts down for winter._

- **Mow:** Mow at 3-4 inches about once a week. This is likely your last full mow before winter.
- **Water:** Water with about 1 inch per week in early morning if no rain falls. One or two deep soakings work well for tall fescue's deep roots.
- **Fertilize:** Apply slow-release nitrogen at about 0.5-1 lb N per 1,000 sq ft. This is an ideal time—feeding now gives cool-season grass a boost before it goes dormant.

### Week 2: Taper Off Mowing

_Why: As temperatures drop in late fall, tall fescue growth slows dramatically, so mowing needs drop off._

- **Mow:** Mow at 3-4 inches if the grass has grown noticeably. You may skip this week if growth has slowed.
- **Water:** Water with about 1 inch per week in early morning if conditions are dry. Fall rains often handle this.
- **Fertilize:** No fertilizer this week.

### Week 3: Winter Dormancy Begins

_Why: Early winter means your grass is fully dormant and resting. It needs almost no care now._

- **Mow:** No mowing needed. Your lawn is entering dormancy and won't need cutting until spring.
- **Water:** Water only if the region has had no rain for 2+ weeks and the soil is very dry. Early morning is best.
- **Fertilize:** No fertilizer this week.

### Week 4: Winter Rest

_Why: Deep winter is a dormant period. Focus on keeping the lawn free of debris and protecting it from foot traffic._

- **Mow:** No mowing.
- **Water:** Water only if unusually dry conditions persist without rainfall.
- **Fertilize:** No fertilizer this week.

### Week 5: Winter Maintenance

_Why: Still in dormancy. Your lawn is resting and storing energy for spring growth._

- **Mow:** No mowing.
- **Water:** Water only if needed during an unusually dry spell.
- **Fertilize:** No fertilizer this week.

### Week 6: Late Winter Prep

_Why: As winter winds down, your tall fescue is still dormant but will soon sense lengthening days and warming soil._

- **Mow:** No mowing.
- **Water:** Water only if the region remains very dry.
- **Fertilize:** No fertilizer this week.

**Checks**

- PASS: bare is absent (got: absent)
- PASS: weeds is absent (got: absent)
- PASS: dry is absent (got: absent)
- PASS: thin is absent (got: absent)
- PASS: shade is absent (got: absent)
- PASS: plan has no seeding, weeds, shade steps (got: none)

## 4. Goal-only wording

**Inputs**

| Field | Value |
|---|---|
| ZIP | 30301 |
| Grass type | bermuda |
| Now | Some brown, crispy areas by the sidewalk. |
| Goal | Dark green and weed-free under the big oak tree. |

**Detected issues** (source: `ai`, 2117 ms)

| Issue | Status | Evidence | Severity |
|---|---|---|---|
| bare | absent |  | low |
| weeds | absent |  | low |
| dry | present | "brown, crispy areas by the sidewalk" | medium |
| thin | absent |  | low |
| shade | absent |  | low |

- Goals: "Dark green lawn", "Weed-free under the oak tree"
- Other concerns: (none)

**Confirmed issues** (the pre-checked "present" ones)

- dry: "brown, crispy areas by the sidewalk"

**Plan** (source: `ai`, 9791 ms)

> Your Bermuda grass is heading into dormancy as we move into winter, so watering and mowing will drop off sharply. We'll focus on fixing those dry, brown spots by the sidewalk with deeper watering, and your lawn will rest until spring warmth brings it back to life.

### Week 1: Address dry spots before dormancy

_Why: Late fall is when Bermuda starts to fade, so this is your last chance to fix dry patches before the grass goes dormant._

- **Mow:** Mow to 1-2 inches if grass still looks green; this may be one of the last mowings before winter.
- **Water:** Water the dry areas by the sidewalk deeply: aim for about 1 inch per week in early morning. Use a tuna can to measure how much your sprinkler actually puts down so you know if you're hitting that target.
- **Fertilize:** No fertilizer this week. Bermuda is slowing down as temperatures drop and will not need feeding until spring.
- **Also:** Check the brown spots with a screwdriver: push it into the soil. If it won't go in 6 inches, the soil is too dry and hard. Water those spots more deeply and less often to let moisture soak in.
- **Also:** Make sure you're watering in early morning to give the grass time to dry before evening.

### Week 2: Reduce watering as grass goes dormant

_Why: Bermuda goes dormant in late fall and early winter in the Southeast, so it needs less care now._

- **Mow:** Mow only if grass is still actively growing; most likely you won't need to mow this week.
- **Water:** If rain is scarce, give the dry spots by the sidewalk a light watering. By late November, Bermuda needs very little water.
- **Fertilize:** No fertilizer this week.

### Week 3: Winter dormancy begins

_Why: Early winter means Bermuda is fully dormant and requires almost no maintenance._

- **Mow:** No mowing. Bermuda is dormant and not growing.
- **Water:** No watering needed unless there is an unusual warm spell and the soil dries out completely.
- **Fertilize:** No fertilizer this week.
- **Also:** Your lawn will likely turn brown or tan. This is normal for Bermuda in winter—it will green up again when warm weather returns in spring.

### Week 4: Winter rest

_Why: The grass is sleeping through the cold, so there is nothing to do._

- **Mow:** No mowing.
- **Water:** No watering needed.
- **Fertilize:** No fertilizer this week.

### Week 5: Winter rest continues

_Why: Still dormant and waiting for spring warmth._

- **Mow:** No mowing.
- **Water:** No watering needed.
- **Fertilize:** No fertilizer this week.

### Week 6: End of year rest

_Why: Bermuda is still dormant through the end of December and into the new year._

- **Mow:** No mowing.
- **Water:** No watering needed.
- **Fertilize:** No fertilizer this week.
- **Also:** Come spring (March or April), watch for green growth to return. That's when you'll start mowing and watering again, and you can apply the first feeding of the year.

**Checks**

- PASS: dry is present (got: present)
- PASS: weeds is absent (got: absent)
- PASS: shade is not present (absent or unclear) (got: absent)
