# VR loop — 2026-11-17 ~05:45 UTC: independent review of PR #181 (G3 frame budget)

**Run:** scheduled VR loop run, chained from the 05:00Z run. No HALT/VR-HALT. Took VR-LOCK at 05:32Z (none held).
This run wrote none of #181 (built by the 05:00Z run). Built nothing new; merged nothing.

## Verdict: PASS, 0 open findings
`loop/vr-frame-budget` `66d6969b` on `main` `5570e888` (fast-forwards). Reviewed `origin/main...66d6969b` against
`reviews/REVIEWER.md` §3–§4: 6 files, 1800+/53-, all under `tools/` and `audits/`; **no `docs/` file changes**, so
the live site and the flat museum cannot change. Filed on `review-log`:
`reviews/loop/2026-11-17-vr-frame-budget-181-independent-review.md`, index
`reviews/2026-11-17-loop-vr-frame-budget-181.md`, line in `reviews/runs.md`.

### Code (read in full)
- `tools/xr-standin.js`: `fakeXR` compared mechanically with the copy removed from `main`'s `xr-entry-check.js`:
  **identical**. `xr-entry-check.js` now only `require`s it.
- `tools/vr-frame-budget.js`: the `CEIL` table matches `handoff/vr-performance-budget.md` §2 line for line (calls
  160/240/>320; tris 350k/600k/>500k on Q2; lights 5/6/>8; points 4k/8k/>15k; canvas textures 14/20/>28; per-room
  16/24/>40 MB; session 128/256 MB). Verdict logic: 8 lights reads "over Q2 and Q3", not hard fail — correct, the
  hard line is *more than* 8.
- Scene found through three.js's own devtools hook: confirmed the vendored `three.module.min.js` dispatches
  `__THREE_DEVTOOLS__` `observe` for each renderer. No site code changed for it.
- Draw-call reading: `__MU.state().calls` reads `renderer.info.render`, reset per `render()`. In XR `app.js` makes
  exactly one `renderer.render(scene, camera)` per frame (line 1590, returns before the flat-screen overlay pass),
  so the figure is the whole stereo frame, as §2 budgets it. Points halved for per-eye: right for the same reason.
- Test hooks used (`teleport`, `place`, `relicsPending`, `xr`, `xrExit`) all exist on `main`.
- The report says plainly what is not measured (frame time; per-room texture ledger) and labels the stand-in's field
  of view as an approximation, not a Meta figure. No conjecture presented as fact. Nothing religiously sensitive.

### Re-measured independently
`node tools/vr-frame-budget.js docs` on this checkout (6 m 33 s, 0 script errors). Every figure in the report's
"main" column reproduced exactly except **ch02 mid-room: 212 calls here vs 214 in the report** (the report's range
already reads 202–214; relic and creature streaming can move a view by a call or two). Lights 8 everywhere,
points 5,206 per eye in the Rotunda/ch03/corridor, corridor 268 calls and 712,460 triangles (past 500k): all as reported.

### Local checks on `66d6969b`
- Full build order (stamp-dates → build-og → vault → chapters → pages → museum → framework → entity-registry → sky):
  tree clean after.
- `verify-*.js` 18/18 pass. Framework tests 51/51. `review-checks.js --base origin/main --build`: 9 passed, 0 failed,
  0 warnings.
- `tools/xr-entry-check.js` after the refactor: all pass (74 ok, 0 FAIL), incl. flat 360/390 px with no headset,
  0 script errors, VR entry hidden without WebXR.

### GitHub on `66d6969b`
`checks`, `guard`, `runtime` ×2: all completed, success. **Lighthouse, links, verify and framework did not run, and
correctly so:** their workflows trigger only on `docs/**` (Lighthouse) or other paths this PR does not touch. So every
check that applies is green.

### Notes passed on (not findings)
- `tools/xr-standin.js` has its one-line header comment twice (lines 1 and 6). Cosmetic; fix with the next VR piece
  that touches the file.
- The "session" texture figure grows as the harness walks (Rotunda → ch02 → ch03 → corridor), so the 343 MB in the
  corridor is what a visitor holds after that walk, not the corridor alone. The report calls it the session's resident
  set, which is right; just read the larger numbers as walk-order dependent.

## Next
Light rig per tier (VR-STATUS Next 2): needs no approval to build. #181 now joins the list waiting for Carter's yes.
