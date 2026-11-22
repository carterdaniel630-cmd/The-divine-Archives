# Delta check — #189 re-sync onto main f12dc09d (loop/vr-perf-overlay@f206d61a)

Reviewed: 2026-11-22 ~22:40 UTC, by a VR loop run that did not do the re-sync and wrote none of #189.
Scope: `ee7ffc76..f206d61a` (the merge of `main` f12dc09d into the reviewed head `ee7ffc76`) — LOOP.md Merging 1, delta only.

## What I compared
- #189 as reviewed: `1cfb8d9f..ee7ffc76` (4 files). #189 now: `f12dc09d..f206d61a` (the same 4 files, 390+/2−).
- `docs/assets/vr-perf-overlay.js` and `tools/vr-perf-overlay-check.js`: diffs byte-identical to the reviewed ones.
- `docs/museum/app.js`: the same four hunks as reviewed (two `S.perf.frame(now)` lines in `tick()`, the `?vrfps=1` lazy import
  in `start()`, the `vrfps`/`vrfpsImage` debug hooks), only shifted by #188's lines. The conflict in `window.__MU` keeps both
  sides: #189's two hooks, then #188's `xrRead`/`xrReadImage`/`xrExhibits`/`xrReading`. Nothing else in the file differs from main.
  `XRProbe` and `S.where`, which the import uses, exist on main.
- `docs/museum.html`: `app.js?v=60 → v=61`. Both sides were at 60, so the bump is needed for returning visitors. Correct.

## Checks I re-ran on f206d61a (clean worktree)
- Full build order: no diff. Every `tools/verify-*.js`: 18/18. Framework tests: 51 pass, 0 fail.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- `vr-perf-overlay-check.js`: all passed (plate on the rig in Rotunda and Egypt, hidden after exit, 0 script errors).
- `xr-entry-check.js`: all passed, including #188's reading section.
- `museum-baseline.js`: 0 errors.
- Flat museum, no headset, 360 and 390 px: no Enter VR button, overlay never fetched, no sideways scroll, 0 script errors.
- GitHub on f206d61a at check time: test, runtime ×2, checks, guard, links green; **Lighthouse still running** (not assumed green).

## Findings
0.

## Verdict
PASS. Still needed before merge: Lighthouse green on f206d61a. Carter's per-item yes is on file.
