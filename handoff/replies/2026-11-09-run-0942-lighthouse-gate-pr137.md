# Loop run 2026-11-09 ~09:42 UTC — (L1) Lighthouse gate noise fix built as PR #137

Session ..01HFWzTpHMemZWkGLqPkBWkZ. Item: **(L1)** from STATUS Next 0bu (value 1 on the list: it blocked #135 for an
hour and will block every PR that touches `docs/`).

## What changed (`loop/lighthouse-gate-noise` `559194c5`, PR #137 into `main`, ready for review)
- `tools/lighthouse-pages.js`: the confirm round (a page that seems to drop gets 6 more runs a side, 9 total) now fails
  the page only when **both** the median **and** the upper quartile of its runs drop more than `--max-drop` (5).
  Game pages score ~70 or ~90 at random on the same build (base too: PR #135 attempts 1–3 failed three different game
  pages once each, e.g. treasure 84 → 72 on attempt 2, pages that diff could not reach). A real regression moves the
  whole spread and still fails; a median moved only by the slow mode is printed in the report as "noise". With 3 runs
  the rule is identical to before. `judge()`/`quantile()` are exported (the CLI part only runs when called directly).
- `framework/test/lighthouse-judge.test.js`: 6 tests (illustrative scores, not measured ones).
- `.github/workflows/lighthouse.yml`: header comment only (rule described; "twelve games" corrected).
- No `docs/` change. Nothing on the live site changes.

## Checks
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings; build output matches committed.
- `tools/verify-*.js`: 18/18. `node --test framework/test/*.test.js`: 48/48 (42 + 6 new).
- Lighthouse could not be installed in this sandbox (npm registry 403 through the proxy). The script's whole path
  (rounds, confirm, report, exit code) was run against a stub Lighthouse: bimodal page → "-17 (noise: upper quartile
  −1)", 10-point regression → ❌ and exit 1, steady page → 0. PR #137's own Lighthouse run (the workflow runs because
  `tools/lighthouse-pages.js` changed) is the real end-to-end check; it uses the PR's script.
- Headless browser check: not applicable (no page changed).
- graphify CLI not installed in this session (`which graphify` empty, no `graphify-out/`); worked from the files.

## Merge
Not a flip, not from an approved audit list, not wording: **per item** (in doubt → per item). Needs an independent
review by a session other than ..01HFWzTpHMemZWkGLqPkBWkZ, GitHub green incl. Lighthouse, then Carter's yes.
Reviewer notes: check that the upper-quartile guard cannot hide a regression that makes most runs slow (test 4), that
the CLI still exits 2 with no targets, and the run summary of PR #137's Lighthouse job.

## Next
(1) **(L1r) independent review of #137**. (2) **#136 re-sync** onto `42d2263a`, re-run checks; waits on Carter's yes.
(3) **(c2) Ur part 2** or the next pack game. Weekly audit due first run on or after Wed 2026-11-11.
