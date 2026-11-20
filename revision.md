# Revision Documentation

This page covers the prototype revision for My Lawn Care: what I changed, how I used peer feedback, how I tested the revised app, the risk I addressed, and what I would do next. Return to the [README](README.md).

## Priority Improvements

I chose three improvements, all focused on the main task of turning a yard description into a useful plan.

1. **A real AI reads the yard description.** The old version only searched for keywords, so it could not understand phrases like "no weeds." Claude Haiku now reads the description, decides which problems are present, absent, or unclear, and quotes the user's own words as evidence.
2. **A review screen before the plan.** Users now see the problems the AI found and can uncheck anything wrong, or add something it missed, before the plan is made.
3. **Clearer plans that fit the season.** The AI now writes the plan using only the measurements in the lawn-care guide. Seeding steps appear once instead of repeating, and the plan follows the time of year, so late-fall plans include winter rest and move seeding to spring. If the AI's plan breaks these rules, the app shows a basic rule-based plan instead.

## Response to Peer Feedback

Three classmates tested My Lawn Care and gave feedback. The table below shows each main point, what I decided, and what changed.

| Feedback or observed issue | Decision | What changed, or why it was deferred |
|---|---|---|
| A tester described a healthy lawn with "no weeds, no bare patches, and no shade." The app still gave advice for fixing all three. | Acted on | The old version only searched for keywords, so it could not understand the word "no." An AI model now reads the description and understands when a problem is not there. A healthy lawn now gets a normal maintenance plan, and this case is part of my test set. |
| A tester suggested letting users review and edit the problems the app found before it makes the plan. | Acted on | I added a review screen between the form and the plan. It lists each problem the AI found and the exact words from the user's description that it was based on. The user can check or uncheck problems before the plan is made. |
| A tester was confused because the bare-patch steps repeated for three weeks. It was unclear whether to seed again or keep caring for the same spots. | Adapted | Instead of adding "if you haven't already," the plan now gives the seeding step only once. Later weeks just say to keep caring for those spots. Because it is late fall, the plan now also says to mark bare spots and seed them in spring. |
| While testing, I noticed the app gave shade advice even though the user never mentioned shade. | Acted on | The goal said "dark green," and the old keyword search treated "dark" as a sign of shade. The AI now looks for problems only in the description of the yard today, not in the goal. Shade advice no longer appears unless the user describes shade. |
| A tester suggested the AI could use photos to show what the lawn might look like after improvements. | Deferred | This is a good idea, but it is a much bigger feature than I could build in this round. Users can still upload photos, but the app does not use them yet. It is listed as planned for a future version. |
| A tester felt the idea serves a niche audience and asked whether people would pay for it. | Deferred | This is a business question that a prototype change cannot answer right now. I plan to ask potential users about price and interest in future customer interviews. |

## Evaluation of the Revised Prototype

I ran five test cases on the live app. For each case, I wrote down what a successful result would look like before running the test, then recorded what actually happened. All inputs are made up.

| Case | Input or action | Expected result / success criterion | Actual result | Pass, partial, or fail | Implication or next step |
|---|---|---|---|---|---|
| Typical 1 | ZIP 46556 (South Bend, IN), Tall Fescue. Yard now: "Mostly green but thin in spots, some dandelions and clover, a couple bare patches near the driveway." Goal: "Thick, even, dark green lawn with no weeds or bare spots." | The review screen lists bare spots, weeds, and thin grass, each with the user's own words, and does not list shade. The plan fits late November in Indiana: no seeding until spring, no fertilizer once the grass goes dormant, and no weekly watering in winter. | The review screen found bare spots, weeds, and thin grass, quoting the user's own words, and did not list shade. The plan gives one last feeding and weed pulling now, then no mowing, fertilizer, or regular watering once the grass goes dormant. Seeding moves to March or April. | Pass | This is the main use case, and it now works as intended. Next, test the same input in spring, when the plan should tell the user to seed right away. |
| Typical 2 | ZIP 75201 (Dallas, TX), St. Augustine. Yard now: "Grass is a little tall and there are yellow, dry patches along the back fence. Lots of clover in the side yard." Goal: "Even green lawn the dog can play on." | The review screen lists dry areas and weeds, each with the user's own words, and nothing else. The plan uses the St. Augustine mowing height, gives no nitrogen in winter, and does not suggest weed-and-feed products, which can harm this grass. | The app found the dry patches and the clover, quoting the user's words, and used the correct St. Augustine mowing height of 3.5 to 4 inches. It gave no fertilizer and did not suggest weed-and-feed. Two small issues: it called the tall grass a problem it can't plan for, and the winter weeks mention snow, which rarely applies in Dallas. | Pass | The core result is right, but the winter advice is written for northern lawns. Next, give the AI a warm-climate version of the winter steps. |
| Challenge | ZIP 33101 (Miami, FL), grass type "Not sure." Yard now: "it's ok i guess." Goal: "better." | The app does not invent problems from a vague description. All problems show as "not sure" or absent, and the plan gives safe, general care and suggests identifying the grass type. | The AI marked all five problems as "not sure" and did not invent any. The plan gave safe, general care and told the user to identify their grass at a garden center. However, it said the lawn would go dormant and mentioned snow and frozen ground, which does not fit Miami. | Partial | Not inventing problems was the key goal, and it worked. Next, base the winter advice on the region, since Miami lawns keep growing slowly all year. |
| Invalid or empty | First, click "Continue" with every field blank. Second, enter a 4-digit ZIP ("4655") with the other fields filled in. | No plan is made and no AI request is sent. A friendly message appears under each field that needs fixing, and the user stays on the form with their other answers kept. | With every field blank, no plan was made and a friendly message appeared under each of the four fields. With the 4-digit ZIP, only the ZIP field showed a message ("A US ZIP is 5 numbers"), and the other answers stayed filled in. | Pass | The form stops bad input before it reaches the AI. No change is needed for now. |
| Risk | ZIP 46556, Kentucky Bluegrass. Yard now: "I put down fertilizer and sprayed weed killer two days ago. There are still a few dandelions and the grass looks a little thin." Goal: "Get rid of the last weeds." | The risk is that the app tells the user to fertilize or spray again right away, which could damage the lawn and wash chemicals into drains. Success means the plan does not repeat fertilizer or weed killer soon, tells the user to follow the product label, and lets the user uncheck problems on the review screen. | The review screen showed weeds and thin grass as checkboxes, so the user could uncheck them. But the AI did not notice that the user had just used fertilizer and weed killer. The plan told the user to fertilize again in week 1 and to spot-treat weeds. | Fail | This is the most important problem the tests found, because following the plan could harm the lawn. Next, add a form question about recent treatments and block extra fertilizer or weed killer for several weeks after one. |

The automated test runner (`scripts/src/run-test-cases.ts`) also checks four similar cases, plus a forced-fallback case, on every run. Its latest results are in [evaluation/results.md](evaluation/results.md).

### Before and After: Healthy Lawn

This issue came from peer review. I used the same input before and after the revision: ZIP 46556, Tall Fescue. Yard now: "Healthy, thick lawn. No weeds, no bare patches, and no shade." Goal: "Keep it looking this good."

| Version | What happened |
|---|---|
| Before (October version, keyword matching) | The app matched the words "weeds," "bare patches," and "shade" even though each came after "no." It built a 6-week plan with reseeding in weeks 1 to 3, weed pulling, and shade tips the user did not need. |
| After (revised version, live AI) | The AI marked all five problems as absent, so nothing was pre-checked on the review screen. The plan gave routine late-fall care only, with no seeding, weed, or shade steps. |

The revision helped. This was the main problem a classmate found, and the same input now gives the plan a healthy lawn should get.

### Repeat Test: Typical 1, Run Three Times

Because the app uses a live AI model, I ran the Typical 1 input three times. All three runs found the same three problems (bare spots, weeds, and thin grass) and quoted the same words from the description. All three plans also had the same structure: one last feeding in week 1, weed control in weeks 1 and 2, dormant care from week 3 on, and seeding in spring. Only the wording and week titles changed, which does not change what the user would do.

## What the Evidence Tells Us

The revised app now does its main job well. In the cases that used the AI, it read plain descriptions correctly, understood words like "no," quoted the user's own words as evidence, and gave plans that fit the season, and the repeat test showed these results stay consistent. The review screen also gives users a clear way to correct the AI before a plan is made. What remains unreliable is anything outside the five lawn problems the app knows about: it missed that the user had just applied fertilizer and weed killer and told them to apply more, and its winter advice assumes a northern climate even in Dallas and Miami. Plans also take 9 to 16 seconds to appear, and other seasons, photos, and real users are still untested. The results support the claim that the app helps a first-time homeowner turn a vague description into clear steps, but the risk case shows it should not yet be trusted when lawn chemicals are involved. Five tests are early evidence, not proof that the app is ready for real use.

## Risk Response

The risk I chose is that the AI misreads what a user writes and recommends work the lawn does not need, such as reseeding a healthy lawn or spraying weed killer on weeds that are not there. This mostly affects first-time homeowners, the app's main users, because they are the least able to tell when lawn advice is wrong, and extra chemicals can also reach kids, pets, and storm drains. To reduce this risk, I added a review screen between the form and the plan. It lists each problem the AI found, shows the exact words from the user's description it was based on, and lets the user uncheck anything wrong before the plan is made. The app also only allows mowing, watering, and fertilizer amounts from a fixed lawn-care guide, and if the AI's plan breaks those rules, the app switches to a basic rule-based plan. This safeguard is real, not simulated, and it connects to the course theme of over-reliance on AI: the user checks the AI's reading of their yard instead of following it blindly. My risk test showed what is still missing. When a user said they had just put down fertilizer and weed killer, the review screen let them uncheck problems, but the AI ignored the recent treatment and still told them to fertilize again.

## Remaining Limitations

- **Recent treatments are ignored.** The app does not notice when a user has just applied fertilizer or weed killer, and can tell them to apply more.
- **Winter advice assumes a cold climate.** Plans for Dallas and Miami mention snow and frozen ground.
- **No live weather.** Plans are based on the date and region, not real weather for the user's ZIP code.
- **Photos are not used.** Users can upload photos, but the app only displays them.
- **Slow results.** Plans take about 9 to 16 seconds to appear.
- **Nothing is saved.** Everything is lost when the page closes.
- **Small test set.** Five test cases, plus a few automated ones, are early evidence only. No real homeowners have used the revised app yet.

## Next Priorities

1. **Ask about recent treatments.** Add a form question about fertilizer or weed killer used in the last few weeks, and block repeat applications in the plan for that time. This fixes the failed risk test.
2. **Make winter advice depend on the region.** Give the AI warm-climate guidance so southern users get advice that fits their lawns.
3. **Test with real homeowners in the spring.** Spring is when seeding and feeding decisions matter most, and real users will show whether the plans are useful and easy to follow.
