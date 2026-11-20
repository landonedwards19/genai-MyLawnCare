# My Lawn Care

My Lawn Care is a web app that turns a plain description of your yard into a simple week-by-week lawn plan. You enter your ZIP code, your grass type, a few sentences about how your yard looks now, and how you want it to look. An AI model reads what you wrote, shows you the problems it found so you can correct them, and then writes a 4 to 6 week plan for mowing, watering, and fertilizing.

**Intended user:** first-time homeowners who mow their own lawn and want it to look good, but don't know what to do or when to do it.

## Open the Prototype

**Live app:** https://my-lawn-care.replit.app

The app is password-protected. The password is included in my Canvas submission.

How to use it:

1. Click **Let's get started**.
2. Enter a 5-digit ZIP code, pick your grass type (or "Not sure"), and describe your yard now and the yard you want. Photos are optional and are not used yet.
3. Click **Continue**. The review screen shows the problems the AI found, with the exact words from your description that each one is based on. Uncheck anything that is wrong, or add something it missed.
4. Click **Looks right. Make my plan.** to get your plan. It takes about 10 to 15 seconds.
5. Click **Start Over** to try different inputs.

## Demo Video

**Draft demo (Google Drive):** https://drive.google.com/file/d/1SAYOh2GiqVY1CL48pXkx8nbxbvywwUfd/view?usp=drivesdk

Access has been granted to Emelia Hughes and Samuel Huang.

## Code and Assets

The prototype is built and hosted in Replit. All of its code is stored in this repository.

| Folder | What it holds |
|---|---|
| `artifacts/my-lawn-care` | The web app the user sees: `index.html`, `src/main.js` (screens), `src/analyzeYard.js` and `src/requestPlan.js` (calls to the server), `src/styles.css` |
| `artifacts/api-server` | The server where the AI runs: `src/lib/yardAnalysis.ts` (reads the yard description), `src/lib/planGeneration.ts` (writes and checks the plan), `src/routes/`, and `src/middlewares/rateLimit.ts` |
| `lib/lawn-guide` | The lawn-care guide the plan must follow (`lawnGuide.js`) and the rule-based backup plan (`generatePlan.js`) |
| `evaluation` | Automated test cases (`test-cases.json`) and their latest results (`results.md`) |
| `scripts/src/run-test-cases.ts` | Script that runs the automated test cases |

## How the AI Works

The app uses Claude Haiku to read the user's description of their yard, find the problems they mention, and then write a 4 to 6 week plan for mowing, watering, and fertilizing. Before the plan is made, the user can check and uncheck the problems the AI found. The plan must use measurements from a lawn-care guide, and if the AI breaks those rules, the app shows a simpler backup plan instead.

| Part | Status |
|---|---|
| AI reads the yard description | Working |
| AI writes the plan | Working |
| Review screen and automatic plan checks | Working |
| Live weather for your ZIP code | Planned |
| AI reading uploaded photos | Planned |
| Noticing recent fertilizer or weed killer use | Not built yet (next priority) |

## Revision Documentation

See **[revision.md](revision.md)** for:

- Priority improvements made in this revision
- Response to peer feedback
- Five test cases, a before-and-after comparison, and a repeat test of the live AI
- What the evidence tells us
- Risk response
- Remaining limitations and next priorities

## AI-Use Disclosure

See **[ai-use-disclosure.md](ai-use-disclosure.md)** for the tools I used, how AI helped build the app, representative prompts, where I used my own judgment, how I checked the work, and how AI works inside the product.
