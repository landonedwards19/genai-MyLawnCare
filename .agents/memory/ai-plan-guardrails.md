---
name: AI plan guardrails (Haiku)
description: What the small model gets wrong when writing lawn plans and which rules had to move into code
---

claude-haiku-4-5 ignores calendar/season rules stated only in the prompt: it seeded Bermuda in November, jumped from November to "spring" within 6 weeks, and fed St. Augustine twice in 3 weeks despite "every 6-8 weeks". It also does arithmetic on guide text ("half an inch higher" -> "4.5 inches").

**Why:** prompt-only rules were tested on 2026-11-19 and failed repeatedly; deterministic hints fixed them.
**How to apply:** compute timing facts in code (week dates with season labels, seeding week from `seedingMonths`) and pass them as data; keep the numbers-must-appear-in-input check; prefer patching small omissions (reseed reminder) over rejecting, since every rejection costs ~10s and risks the fallback.

Topic word checks need exceptions for normal lawn phrases: "shade out weeds" (mowing advice) caused a false shade violation and pushed a valid plan to fallback. Keep topic patterns in the shared lawn-guide planRules so the server and the test runner never disagree.
A fallback plan can pass every content check, so read the plan source in evaluation results, not just PASS/FAIL.
Rejecting for a cosmetic slip (e.g. a "Late Winter" title in late December) can push an otherwise correct AI plan to the rule-based fallback, which ignores seasons entirely and then fails the seasonal checks. Weigh repair-in-code vs reject for cosmetic rules.
Retrying with the exact failed-check instructions (previous answer as an assistant turn + a numbered fix list) fixed every first-attempt failure in the 2026-11-19 test run; Haiku's most common slip is season words in late-December titles ("Late Winter", "Mid-Winter").
