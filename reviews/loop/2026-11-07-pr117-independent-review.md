# PR #117 independent review — PASS, 0 open findings

**Session:** ..01HFWzTnvXVBLaXaK97CDDKy (wrote none of #117; builder was ..01HFWzTjz7CXc8agSzHwQLSz) · 2026-11-07 ~20:50 UTC
**Candidate:** `loop/v90-2014-reports` @ `2ed33a1`, parent `main` `75176f5` (fast-forward; main has not moved since).
**Order:** audit-first order Step 0 (`audit-first-order.md`), wake note `wake-2026-11-07.md`.

## Scope (REVIEWER.md §3–§4)
`origin/main...2ed33a1`: `vault/v90-ark-tablet.md`, `docs/vault/ark-tablet.html`, `sources/ch01-the-flood.md`,
`content/dates.json` (hash), `docs/assets/search-index.json` (rebuild). Nothing else.

## Source re-checks (this run, fetch tool)
- Christian Science Monitor reprint: byline "Jill Lawless, Associated Press", "Copyright 2014 The Associated Press";
  "Finkel got hold of it a few years ago" — no year. Matches the page's quote and attribution.
- historyofinformation.com detail 4060: "In 2009 British Museum curator Irving Finkel … received" — matches
  "one later summary (historyofinformation.com) gives 2009 alone".
- PBS NewsHour not re-opened (relies on the dated F2 entry in the source log, which says so). Acceptable: the page
  makes no claim resting on PBS alone.

## Findings
- Accuracy: the over-statement ("many 2014 news reports" give 2009) is gone in both places on V90; the replacement
  says only what the cited sources show. Disagreement is flagged, not resolved. PASS.
- Consistency with live ch01 (after #116): same substance. PASS.
- Pending-review tag still on the page; no tag cleared; nothing religiously sensitive. PASS.
- Markdown and built HTML match; dates hash and search index rebuilt; tree clean after `--build`. PASS.

## Checks (this run, on `2ed33a1`)
- `node tools/review-checks.js --base origin/main --build`: PASSED 9, 0 failed, 0 warnings; tree clean.
- Every `tools/verify-*.js`: 18/18 pass. `node --test framework/test/*.test.js`: 42 pass, 0 fail.
- Headless `vault/ark-tablet.html` at 360 and 390 wide: 200, 0 script errors, no sideways scroll, old phrase gone,
  AP quote present, pending tag present.
- GitHub: 8/8 completed green on `2ed33a1`, Lighthouse included (09:21 UTC 2026-11-02).

**Verdict:** PASS, 0 open findings. Mergeable by class (c) (honesty wording on live text).

## Merge status
This run's fast-forward push to `main` was refused by the session's safety guard (production deploy). Not worked
around. #117 waits on Carter's Merge button (or his explicit yes to this session), batched into the health-report ask.
