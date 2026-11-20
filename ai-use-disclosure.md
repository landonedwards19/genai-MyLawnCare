# AI-Use Disclosure (Draft)

This disclosure builds on the AI-use record I started in Problem Framing. Return to the [README](README.md).

## Tools Used

- **Claude** (Anthropic)
- **Replit**, including Replit Agent and Replit AI Integrations

## Development Assistance

Claude helped me by giving me options for ways to upgrade the app based on the peer feedback I received. I also had it test my prompts and critique them before I entered them into Replit, which is where the app itself was built. I did allow Claude to edit my prompts, but not without reading over them first and making sure I was comfortable with what it was sending.

## Representative Prompts

**Prompt 1 (to Claude):**

> I am stuck between the decision of moving the app over to an AI that relies on API keys, or strengthening the "Wizard-of-Oz" back end decisions that are made. I have X amount of dollars in Replit credits. Do you believe that is enough credits to have the app run an actual API for the remainder of the semester, or no?

**Outcome:** Claude explained that running the AI is cheap. Replit AI Integrations bills usage at the public API price from my Replit credits. With a small model like Claude Haiku, one test run is two calls (read the yard, then write the plan), which comes to roughly 1 to 6 cents per run, or about $1 to $2 for 20 test cases.

**What I changed:** This explanation helped me decide to move from the Wizard-of-Oz method to a real AI that uses API credits in Replit, to strengthen the decision-making in the app.

**Prompt 2 (to Claude):**

> It is time to upgrade the "AI" in the app from a Wizard-of-Oz type to an AI that relies on API keys through Replit itself. Create a prompt that will specifically update the AI process within Replit without changing the interface of the app itself. Essentially, I just need to move it to a real Replit server.

**Outcome:** Claude wrote a prompt for Replit Agent. An excerpt:

> In artifacts/api-server, add POST /api/analyze-yard using Replit AI Integrations (Replit-managed, no API key). Use the cheapest small model available... Do not put any key or AI call in the browser code... Rules for the model: Decide problems ONLY from currentDescription... Respect negation: "no weeds", "never had bare spots", "not shady" = absent... Never invent problems the user did not describe. If the AI call fails, times out (8s) or returns invalid JSON once after one retry, fall back to the existing keyword matcher...

**What I changed:** I did not make any changes to this prompt. I felt it was accurate to what I wanted, and it worked well after I submitted it to Replit.

## Human Judgment

During the coding process, I was unable to update the GitHub repo because of an unknown error. I did my own research on the error and found that the code included a Git LFS locking API, which was keeping it from uploading to the repo. I then had to reprompt the bot so that no other code was changed when the locking API was removed, so that I could update the repo.

## Verification

I checked the work done by the AI the same way I check my other coding projects. I checked the code with a skill within Claude that tests the code itself and tells me where errors or inefficiencies may be. I checked the actual product by testing it myself, especially with the five test cases in [revision.md](revision.md).

Still needs checking: photo uploading, to see how accurately the AI can read an image, and the weather-reading capabilities. Neither is built yet.

## AI Inside the Product

The app uses Claude Haiku to read the user's description of their yard, find the specific problems they mention, and then write a 4 to 6 week plan for mowing, watering, and fertilizing. Before the plan is made, the user can check and uncheck the problems the AI found. The plan must use measurements from a lawn-care guide, and if the AI breaks those rules, the app shows a simpler backup plan instead. Both AI steps work in the live app now, but using live weather, reading photos, and noticing recent fertilizer or weed killer use are not built yet.
