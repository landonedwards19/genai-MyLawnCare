# My Lawn Care

A one-page prototype where DIY homeowners describe their current and desired yard and get a simulated 4-6 week mow/water/fertilize plan.

## My Lawn Care app (artifacts/my-lawn-care)

- Plain HTML/CSS/vanilla JS served by Vite (user requirement: no React, backend, DB, accounts, or external APIs).
- Guidance text and the keyword matcher live in the shared plain-JS package `lib/lawn-guide` (`lawnGuide.js` = editable data, `detectIssues.js` = matcher) so both the page and the API server use them. Plan logic: `generatePlan(inputs)` in `src/generatePlan.js`, simulated and meant to be swapped for an AI/weather call later. `src/main.js` handles screens, validation, and rendering only.

## Yard analysis API (artifacts/api-server)

- `POST /api/analyze-yard` uses Replit AI Integrations (Anthropic, `claude-haiku-4-5`, no user key); AI calls stay server-side only.
- 8s timeout per attempt, one retry, then falls back to the keyword matcher (`source: "fallback"`). Descriptions truncated to 1,000 chars. In-memory rate limit 30/hour/IP (resets on restart).
- A "present" issue whose evidence isn't an exact phrase from currentDescription is downgraded to "unclear" in code.
- Logic in `src/lib/yardAnalysis.ts`; the page does not call this endpoint yet.

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
