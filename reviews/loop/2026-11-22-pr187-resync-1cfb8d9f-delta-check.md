# Delta check — PR #187 re-sync `1cfb8d9f` (VR portal culling)

- **Checked:** 2026-11-22 ~12:16–12:40 UTC, VR loop session ..01HFWzTmvKJs6aEiRGrqepJk. This session wrote none of #187 and
  did not do the re-sync (that was ..01HFWzTnD5NBbs9gpVQJr8r4).
- **Candidate:** `loop/vr-portal-cull@1cfb8d9f` = merge of `main` `23d312d5` (#185 live) into the reviewed `758056a4`.
- **Reviewed before:** `758056a4`, independent review PASS 0 (`reviews/loop/2026-11-22-vr-portal-cull-187-independent-review.md`).
- **Verdict:** PASS, 0 findings.

## Delta
- Merge base of `origin/main` and the candidate is `main` itself (`23d312d5`): the candidate is current with `main`.
- `git range-diff 758056a4^..758056a4 origin/main..1cfb8d9f`: one commit, `=` (identical).
- File list and line counts of `origin/main...1cfb8d9f` are identical to the reviewed `758056a4^..758056a4`
  (9 files, +2550 / −18).
- Changed lines compared one by one (2,568 each side): the only difference is the removed base line in `docs/museum.html`,
  `app.js?v=57` (old base) vs `app.js?v=58` (main now). The added line is `app.js?v=59` in both. Expected: the cache key.
- So the site diff carries no change that was not reviewed. The semantic meeting point with #185 (its hall and Rotunda
  fittings now hang on the zone groups that #187 hides in the headset) is covered by check 3 of `xr-portal-check.js`
  below, which now measures more drawn points (154,506 vs 151,813 at review) and finds none outside their cells.

## Checks re-run on `1cfb8d9f`
- Full build order (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry, sky): no diff.
- `tools/verify-*.js` 18/18 pass. `node --test framework/test/*.test.js` 51/51.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- `xr-portal-check.js`: all pass — flat screen cull set null; 31,485,952 rays from 15,374 points, 0 misses; 154,506 points of
  485 drawn objects, 0 outside their cells; stand-in headset culls at Rotunda / ch02 / ch03 / Wing II corridor; leaving the
  headset restores everything; 0 script errors.
- `xr-entry-check.js`: all pass, 0 script errors.
- Flat museum, `museum-baseline.js` (DPR 1), candidate vs `main` `23d312d5`, same machine: hall 36 / 26,764, Wing II
  corridor 83 / 210,902, Egypt 66 / 122,011 — identical; 0 errors both; +10.4 KB at ready (portals.js).
- Phone 360 and 390 px: 0 script errors, no sideways scroll, no visible "Enter VR" control.
- GitHub on `1cfb8d9f` at 12:16 UTC: 6/7 completed green (checks, test, guard, runtime ×2, links); Lighthouse in progress.

## Notes, not findings
- Same as at review: the `portals.js` comment on checking order is wrong (harmless).
