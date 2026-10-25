# Lighthouse gate: noise on pages a PR does not touch (found 2026-10-25, PR #77)

PR #77 (`d038119`, Journal art only) failed the Lighthouse hard gate twice on pages it does not change:
- run 1: ch80 Shi'ism 83 → 75 (nine runs each side, both sides hitting 75 several times);
- re-run: ch80 75 → 75 but The Firmament (pinball) 87 → 80.
The page the PR changes (The Unfinished Journal) was 77 → 76 and 75 → 76.

Proposal (needs its own small PR, not widened into #77): only gate pages whose files the PR changes (or that load a
changed shared asset), and/or compare medians over more runs for pages flagged by a first pass. Logs: Actions run
40153928248, jobs 121051861341 and 121056327513.
