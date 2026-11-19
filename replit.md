# My Lawn Care

A one-page prototype where DIY homeowners describe their current and desired yard and get a simulated 4-6 week mow/water/fertilize plan.

## My Lawn Care app (artifacts/my-lawn-care)

- Plain HTML/CSS/vanilla JS served by Vite (user requirement: no React, backend, DB, accounts, or external APIs).
- Guidance text, the keyword matcher, and the rule-based plan live in the shared plain-JS package `lib/lawn-guide` (`lawnGuide.js` = editable data incl. `seedingMonths`, `detectIssues.js` = matcher, `generatePlan.js` = rule-based plan) so both the page and the API server use them. `src/main.js` handles screens, validation, and rendering only.

## AI endpoints (artifacts/api-server)

- `POST /api/analyze-yard` uses Replit AI Integrations (Anthropic, `claude-haiku-4-5`, no user key); AI calls stay server-side only.
- 8s timeout per attempt, one retry, then falls back to the keyword matcher (`source: "fallback"`). Descriptions truncated to 1,000 chars. In-memory rate limit 30/hour/IP (resets on restart).
- A "present" issue whose evidence isn't an exact phrase from currentDescription is downgraded to "unclear" in code.
- Logic in `src/lib/yardAnalysis.ts`.
- `POST /api/generate-plan` (same model, logic in `src/lib/planGeneration.ts`): sends the model only the guide entries for the grass type and confirmed issues, plus each week's dates labelled with a season. 30s timeout per attempt, one retry, 30/hour/IP. A plan is rejected (retry, then rule-based fallback) if it fails zod, mentions seeding/weeds/shade without the matching confirmed issue, uses "Fix the trouble spots" with no issues, uses any number not in the data it was sent, or schedules seeding outside `seedingMonths`. The seeding week is computed in code; the reseed reminder is added to later weeks if the model drops it.
- Page flow: Form (1 of 3) -> review "Here's what I noticed" (2 of 3) -> Plan (3 of 3). `src/analyzeYard.js` and `src/requestPlan.js` call the endpoints and, if the server is unreachable or rate-limited, run the same rule-based code locally (labelled as fallback). Only issues left checked on the review screen go into the plan.

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
