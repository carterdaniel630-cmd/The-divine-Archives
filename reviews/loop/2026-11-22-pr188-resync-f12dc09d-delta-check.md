# VR loop — #188 delta check on `f12dc09d` (2026-11-22 ~17:00 UTC)

Run: VR loop session ..01HFWzTk3xd9CViyaBCBywZt. VR-STATUS → Next 1. This session did **not** do the re-sync (that was
..01HFWzTm2e2xjGcGM6MvV6xr, 16:45) and wrote none of #188's site changes.

## Verdict: PASS, 0 findings

## Delta check (LOOP.md Merging 1, against the reviewed head `1fef4276`)
- `origin/main` = `1cfb8d9f` is an ancestor of `f12dc09d` (merge of main in, no history rewrite).
- `git diff origin/main...f12dc09d` and the reviewed `git diff fa9e526d...1fef4276`: same five files, same stat
  (536+ / 20-). Comparing every added/removed line (hunk positions ignored), the **only** differences are the two
  expected conflict lines:
  1. `docs/museum.html`: app.js key `v=59 → v=60` (was `v=57 → v=58`): main moved to 59 under #187.
  2. `docs/museum/app.js` tick() headset line: main's side now ends with `if (cullUpdate()) { zoneT = 0; manageZones(); }`
     (#187); the branch adds `if (S.xrRead) S.xrRead.update(dt, S.xrMove.inputs);` before `xrFollow()`, exactly as in
     the reviewed diff. Order: move, height, walk, read, follow, cull.
- No other line differs. `xr-read.js`, `xr-move.js` and `tools/xr-entry-check.js` are byte-for-byte the reviewed changes.
- Interaction with #187 looked at: `xrPick` only takes exhibits whose parent groups are visible and refuses a hit when a
  visible wall is nearer, so a relic in a culled room cannot be read through a wall; the reading plaque's own panel is not
  in any culled cell. `xr-entry-check` and `xr-portal-check` below exercise both together.

## Local checks, run by this session on `f12dc09d`
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings (committed output = fresh build).
- Verify scripts 18/18. Framework tests 51/51.
- `xr-entry-check.js`: all pass, 0 script errors (reading: open, close by tap / B / walking away; ch04 not readable;
  flat ch03 card unchanged).
- `xr-portal-check.js`: all pass, 0 script errors (Rotunda, ch02/ch03 doorways, Wing II corridor; leaving the headset
  restores everything).
- `museum-baseline.js` (flat, 1×): hall 38 / 26,768, corridor 84 / 215,888, Egypt 65 / 121,687, 0 errors — identical
  to the 16:45 run's numbers.
- Phone 360 and 390 px (headless, no headset): 0 script errors, no sideways scroll, no visible "Enter VR" control.

## GitHub on `f12dc09d` at check time (~16:58 UTC)
- guard, checks, links, test, runtime ×2: **green** (6/7).
- **lighthouse: still running.** Not assumed green. The build loop confirms it before merging.

## What is left for #188
- Lighthouse green on `f12dc09d`. Then the build loop merges it per item (Carter's yes on file,
  `decisions-2026-11-22-pr188-yes.md`). If Lighthouse fails twice on pages this diff cannot reach, put it to Carter.

Merged nothing. Pushed `staging/ready-line` and `review-log` only.
