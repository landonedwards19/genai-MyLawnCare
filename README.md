 # My Lawn Care

My Lawn Care is a web app where homeowners enter their ZIP code, grass type, and a description (or photos) of their current yard and the yard they want, and get back a simple week-by-week plan for when and how to mow, water, and fertilize.

## Open the Prototype

**Live app:** https://my-lawn-care.replit.app
The app is password-protected; the password is included in my Canvas submission.

The app code lives in `artifacts/my-lawn-care` (`generatePlan.js` builds the plan, `lawnGuide.js` holds the lawn-care tips, `main.js` runs the screens).

## What the First Working Slice Lets a User Do

1. Start on the welcome screen and click "Let's get started."
2. Fill in the form: ZIP code, grass type (or "Not sure"), a short description of their yard now, and a description of the yard they want. Uploading photos is optional.
3. Click "Make my plan" to get a 4–6 week plan that says when and how high to mow, how much to water, and when to fertilize, plus extra steps for problems they mentioned, like bare spots or weeds.
4. Click "Start Over" to try different inputs.

If a required field is left blank, the app shows a message explaining what's missing instead of making a plan.

## AI Role: Working vs. Simulated

- **What the future AI will do:** Read the user's yard description and photos, check live and upcoming weather for their ZIP code, and generate a personalized maintenance plan that adjusts over time.
- **What works now:** The full user flow, form validation, region detection from the ZIP code, and a plan built for the selected grass type.
- **What is simulated:** The AI. Plans are put together from prewritten lawn-care tips and keyword matching, not a live AI model or real weather data. The results page tells the user this.

## Test Cases

| Test | Input or action | What happened | Pass, partial, or fail |
| --- | --- | --- | --- |
| Typical case | ZIP 46556, Grass Type: Tall Fescue. Yard now: "Mostly green but thin in spots, some dandelions and clover, a couple bare patches near the driveway." Goal: "Thick, even, dark green lawn with no weeds or bare spots." | Generated a 6 week plan for the Great Lakes & Ohio Valley: mow at 3–4 in. weekly, about 1 in. of water per week, and fertilizer timing for a cool-season grass. It correctly picked up the bare spots, weeds, and thin grass and added steps to fix them. It also added shade advice even though shade was never mentioned. | Partial |
| Challenge case | ZIP 33101 (Miami), Grass Type: "Not sure." Yard now: "it's ok i guess." Goal: "better." | Recognized the Southeast region and gave a cautious 4 week plan with middle of the range mowing and watering advice and one light feeding. It suggested taking a sample to a garden center to identify the grass. One minor issue: Week 2 is titled "Fix the trouble spots" even though no trouble spots were described. | Pass |
| Invalid or empty case | Clicked "Make my plan" with every field left blank. | No plan was generated. Friendly messages appeared under each required field (for example, "Just need your 5-digit ZIP code so we can match your climate"), and the user stayed on the form to fix them. | Pass |

## Current Limitations

1. **The AI is fake for now.** The plan comes from prewritten lawn-care tips, not a real AI, and it doesn't check your actual weather. Next, I'd implement a real AI and live weather scanning so the plan changes based on the current and upcoming weather.
2. **It sometimes misreads what you type.** The app looks for certain words, so it can get confused. For example, it gave shade tips when no one mentioned shade. Next, I'd let the AI understand what the user means, or add simple checkboxes for common yard problems.
3. **Photos don't do anything yet, and nothing is saved.** You can upload yard photos, but the app only displays them and doesn't use them, and everything you type is lost when you close the page. Next, I'd have the AI look at the photos and let users save their yard info.
