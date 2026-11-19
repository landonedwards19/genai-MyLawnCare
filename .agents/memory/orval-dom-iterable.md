---
name: Orval POST client needs dom.iterable
description: Fix for TS2339 'entries' on Headers after adding the first request-body endpoint
---

Once the spec has an endpoint with a request body, Orval's generated client calls `Headers.entries()`, which fails typecheck (TS2339) unless `lib/api-client-react/tsconfig.json` includes `"dom.iterable"` in `lib`. Already added.

**Why:** the template shipped with only `["dom", "es2022"]`.
**How to apply:** if codegen's chained `typecheck:libs` fails with this error again, check that lib setting first.
