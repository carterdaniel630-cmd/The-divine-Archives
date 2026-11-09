# 2026-11-09 ~12:55 UTC — PR #137 delta review (L1d2): PASS, 0 findings

Reviewer: build loop, session ..01HFWzTktGFKynXwUDPUW3RQ. Wrote none of #137 (its code is by
..01HFWzTpHMemZWkGLqPkBWkZ and the F1 fix by ..01HFWzTmrS9NH55Htj5zsEYb).

**Covers:** `loop/lighthouse-gate-noise@b2b45e52`, reviewed as the delta `559194c5..b2b45e52` (the F1 fix
`db81e343` and the rank-test rewrite `b2b45e52`) and as the whole PR `origin/main 42d2263a...b2b45e52`.
This also stands in for the F1 delta review that was never done on `db81e343` (the head moved first).

**Diff:** 3 files, no `docs/`: `tools/lighthouse-pages.js`, `framework/test/lighthouse-judge.test.js`,
`.github/workflows/lighthouse.yml` (comment only). No page, chapter, game or pending tag touched.

## What I checked
1. **judge() and the rank test, read line by line.** Run lists passed to `judge()` are plain scores
   (`runs: runs[t.key].map((x) => x.score)`), so `quantile()` sorts numbers, not objects. A page fails when the
   median drops more than `--max-drop` AND (with 6+ runs a side) the exact one-sided Mann–Whitney p < 0.05;
   with fewer runs, the plain median rule, as before. `p` is only computed when the median already drops.
   `if (require.main !== module) return;` is legal at module top level in CommonJS and keeps `require()` free
   of side effects (the tests rely on that).
2. **rankTestP against a hand count:** base [2,3] v head [1,4] → 4/6 = 0.667 (by hand: head rank sum 5; of the
   6 two-of-four splits, sums 3,4,5,5 are ≤ 5). Tie case base [5,5] v head [5,4] → 0.5 (by hand: midranks
   3,3,3,1; head sum 4; 3 of 6 splits ≤ 4). Both match.
3. **rankTestP against an independent implementation** (Python, scipy midranks + itertools over every split):
   40 random cases, 3–8 runs a side, heavy ties drawn from the runner's real score values: **0 mismatches**.
4. **The reply's claimed numbers re-run:** ch45 drop 9, p 0.355, pass; ch80 drop 6, p 0.328, pass; uniform −10
   p 2e-5 fail; 8-of-9 slow p 0.0003 fail; 5-of-9 slow p 0.021 fail. All as stated. 9 v 9 enumeration: 3 ms.
5. **Report wording (F1):** footer now reads "No page failed the gate (median down more than 5 points and
   slower beyond chance)." and adds the noise sentence only when a noise row exists; rows say
   "(noise: p = …)". Consistent with the rule. Header comment names the three exports. Workflow comment matches.
6. **Local checks on `b2b45e52`:** `node --test framework/test/*.test.js` 51/51; every `tools/verify-*.js`
   18/18; `node tools/review-checks.js --base origin/main --build` PASSED 9 / 0 failed / 0 warnings.
   No visual change, so no headless page check is needed (no `docs/` in the diff).
7. **GitHub on `b2b45e52`:** 6/6 completed and green (guard, checks, test, runtime ×2, lighthouse). Read the
   Lighthouse job log (run 42614147719): hard gate, the confirm round fired on ch80 (94 → 75 on 3 runs) and
   came out 75 v 75 over 9; every other page within noise; `ok`.

## Findings
None.

## Observations (not findings, no action required)
- **O1.** `median()` (used for the shown scores) takes the upper middle of an even list, `quantile(…, 0.5)`
  (used by `judge()`) the lower middle. With the workflow's `--runs 3 --confirm 6` every list is 3 or 9 long,
  so they always agree. Only a hand run with an even count could show a row whose "Change" differs by a point
  or two from the drop judged. Cosmetic, unreachable in CI.
- **O2.** The exact test enumerates every split: fine at 9 v 9 (48,620 splits, 3 ms); it would get slow only if
  someone raised `--confirm` to ~12+.
- **O3 (worth knowing, by design).** The gate is now deliberately harder to fail. The #135-shaped example (median
  down 17, p 0.09) passes as noise; a real regression that only nudges a bimodal page toward its slow mode could
  pass too. That is the trade the PR makes to stop failing unchanged pages (ch45 and ch80 today, the treasure
  game on #135). Real slowdowns that move most runs still fail (tests above).

## Verdict
**PASS, 0 findings.** #137 is per item (a CI gate change, not a flip, audit fix or wording fix). Every merge
condition is now met except **Carter's per-item yes**.
