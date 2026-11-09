# Independent review — PR #137 Lighthouse gate noise fix (L1r)

Reviewed 2026-11-09 ~10:55 UTC by the build loop, session ..01HFWzTmyeE87WdK8h2cY2jD, which wrote none of #137
(builder: ..01HFWzTpHMemZWkGLqPkBWkZ). Candidate `loop/lighthouse-gate-noise` `559194c5`, `origin/main` `42d2263a`.
Diff: `tools/lighthouse-pages.js`, `framework/test/lighthouse-judge.test.js` (new), `.github/workflows/lighthouse.yml`
(comment only). No `docs/` change; nothing on the live site changes.

**Verdict: FIXABLE, 1 open finding (F1, report wording).** The gate logic itself is correct.

## Step one: automatic checks (run on a clean worktree of `559194c5`)
- `node tools/review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings; tree clean after build.
- `tools/verify-*.js`: 18/18. `node --test framework/test/*.test.js`: 48/48 (6 new).
- `node tools/lighthouse-pages.js` with no `--target`: prints the usage error and exits 2 (unchanged).
- GitHub on `559194c5`: 6/6 completed, success (checks, guard, test, runtime ×2, lighthouse). Lighthouse job
  129088335332 (run 42595903898) ran the PR's script, `Gate: hard`, result `ok`. Note: no page's median of 3 dropped on
  the PR side (fighter base [90,71,68] vs pr [90,90,71] is a gain), so **the confirm round and `judge()` with 9 runs
  were not exercised in CI**; that path is covered by the unit tests and by reading the code (below).

## Step two: checklist (CI-tool change; §4 items 1–6 have no content to check — no chapter, Vault, Pantheon, game or page)
- **Correctness of `judge()`** — pass. `results[...].runs` is mapped to plain scores (`runs[t.key].map(x => x.score)`)
  before `judge()` sees it, so the numeric sort in `quantile()` is right (an object list would have made every drop NaN
  and the gate never fail; it does not). `quantile(…, 0.5)` picks the same index as the existing `median()` for 3 and 9
  runs, so the table's median column and the verdict agree. With 3 runs the upper quartile is the median: same rule as
  before (test 6).
- **Module split** — pass. The top-level `return` after `module.exports` is valid in CommonJS; the CLI runs only when
  called directly; `median` stays defined above the return and is used below it.
- **Report** — mark logic right (❌ only on `v.fail`; "noise: upper quartile −N" on a median-only drop; sign correct).
  But see F1.
- **Can the guard hide a real regression?** (builder's own question) Probed with illustrative 9-run lists:
  uniform −6/−7 fail; 8/9 and 7/9 runs slow fail; a change that makes a page slow on **6 of 9** runs (base 2 of 9)
  passes (median −18, upper quartile 0). That is the stated design ("a real regression moves the whole spread"), not a
  defect, and the workflow comment and report header say so accurately: advisory A1.

## Findings
- **F1 (fixable, wording)** `tools/lighthouse-pages.js`, report footer: when no page fails, the report ends
  "No page dropped more than 5 points." — but under the new rule a row can show e.g. `-17 (noise: upper quartile −1)`
  directly above it, so the footer contradicts the table. Suggested: `\nNo page failed the gate (median and upper
  quartile both down more than ${MAX_DROP} points). Rows marked "noise" had a median drop only.\n` (or print the
  second sentence only when a noise row exists). Same pass, header comment: "`require`d as a module it only exports
  judge()" → "…exports judge() and quantile()".

## Advisories (no action needed)
- **A1** The new rule lets through a change that makes a bimodal page slow on up to about two runs in three. That is the
  price of not failing on noise; Carter's per-item yes covers it. If a game's slow share rises over time, the run
  table still shows it.
- **A2** CI has not yet run the confirm path end to end; the first PR that trips it will. Worth a glance at that run's
  table.

## Next
Builder (any session) applies F1 on `loop/lighthouse-gate-noise`, re-runs local checks; then a delta review by a
session that wrote none of the fix (this session may do it only if it did not write the fix), GitHub green incl.
Lighthouse on the new head, then Carter's per-item yes.
