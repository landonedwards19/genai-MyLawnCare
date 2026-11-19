# My Lawn Care

A one-page prototype where DIY homeowners describe their current and desired yard and get a simulated 4-6 week mow/water/fertilize plan.

## My Lawn Care app (artifacts/my-lawn-care)

- Plain HTML/CSS/vanilla JS served by Vite (user requirement: no React, backend, DB, accounts, or external APIs).
- Guidance text, the keyword matcher, and the rule-based plan live in the shared plain-JS package `lib/lawn-guide` (`lawnGuide.js` = editable data incl. `seedingMonths`, `noFeedingMonths`, `dormantMonths` (by grass season × region climate) and each grass type's `dormant` entry, `detectIssues.js` = matcher, `generatePlan.js` = season-aware rule-based plan (same date/region rules as the AI checks; titles come from the week's season), `planRules.js` = plan checks shared by the server and the test runner) so both the page and the API server use them. `src/main.js` handles screens, validation, and rendering only.

## AI endpoints (artifacts/api-server)

- `POST /api/analyze-yard` uses Replit AI Integrations (Anthropic, `claude-haiku-4-5`, no user key); AI calls stay server-side only.
- 8s timeout per attempt, one retry, then falls back to the keyword matcher (`source: "fallback"`). Descriptions truncated to 1,000 chars. In-memory rate limit 30/hour/IP (resets on restart).
- A "present" issue whose evidence isn't an exact phrase from currentDescription is downgraded to "unclear" in code. If trees/shade appear only in desiredDescription, shade becomes "unclear" (not "absent"), on both the AI and fallback paths.
- Logic in `src/lib/yardAnalysis.ts`.
- `POST /api/generate-plan` (same model, logic in `src/lib/planGeneration.ts`): sends the model only the guide entries for the grass type and confirmed issues, plus each week's dates labelled with a season (and "dormant" / "no fertilizer"); the grass's dormant entry is sent only when some weeks are dormant. 30s timeout per attempt, 30/hour/IP. Each failed check has a name (logged per attempt as `failedChecks`) and a fix instruction; the ONE retry sends the model its previous answer plus those fixes, then falls back to the rule-based plan. A plan fails if it fails zod, mentions seeding/weeds/shade without the matching confirmed issue, uses "Fix the trouble spots" with no issues, uses any number not in the data it was sent, uses a number+unit amount not in the grass guide or confirmed tips, recommends weekly watering in a dormant week, feeds in a dormant or `noFeedingMonths` week ("Not sure" grass uses the cool list in cool regions, otherwise the cautious list), names an early/mid/late season in a title that doesn't match the week's dates, or schedules seeding outside `seedingMonths`. "Shade out weeds" and "weed-and-feed" don't count as shade/weed topics. The seeding week is computed in code; the reseed reminder is added to later weeks if the model drops it.
- Page flow: Form (1 of 3) -> review "Here's what I noticed" (2 of 3) -> Plan (3 of 3). `src/analyzeYard.js` and `src/requestPlan.js` call the endpoints and, if the server is unreachable or rate-limited, run the same rule-based code locally (labelled as fallback). Only issues left checked on the review screen go into the plan.

## Evaluation

- `pnpm --filter @workspace/scripts run test-cases` runs `evaluation/test-cases.json` against both endpoints (confirming the "present" issues, as the review screen does) and writes `evaluation/results.md` with PASS/FAIL per expect rule. Needs the API server running; uses ~4 requests per endpoint (rate limit 30/hour). `TODAY=YYYY-MM-DD` overrides the plan date. A case with `"skipAi": true` sends the dev-only `x-plan-skip-ai: 1` header (ignored in production) so the fallback plan is tested with the same rules.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
