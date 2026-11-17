# VR loop — 2026-11-17 ~05:10 UTC: independent review of PR #178 (day and weather)

**Run:** scheduled VR loop run. No HALT/VR-HALT. Took VR-LOCK at 04:13Z: the 00:51Z lock was stale (over 3 h; that
run, also reviewing #178, pushed nothing after taking it and left no note). Built nothing new; merged nothing. This
run wrote none of #178 (built by the 23:49Z run) and none of #174, #170 or #169 beneath it.

## Verdict: PASS, 0 open findings
`loop/vr-daylight` `dc1f1f75`. #178's own delta is `loop/vr-creatures@aadc971c..dc1f1f75`: 5 files, 147+/14-
(`docs/museum.html`, `docs/museum/app.js`, `fauna.js`, `world.js`, new `tools/day-check.js`). Reviewed against
`reviews/REVIEWER.md` §3–§4. Filed on `review-log`: `reviews/loop/2026-11-17-vr-daylight-178-independent-review.md`,
index `reviews/2026-11-17-loop-vr-daylight-178.md`, line in `reviews/runs.md`.

### Code (read in full)
- `world.js`: ENV `day` only on ch02 (→ clear, 72°), ch03 (→ dusk, 20°) and `cor:02-bronze-age` (→ clear, 68°). No
  other area changed. `DAY` (480 s period, gust 0.55), `dayW` (eased cosine, 0 at t = 0), `dayGust`, `dayMix`,
  `sunAt`. `lightOf` was split into `skyLight` + `lightOf` with the same arithmetic; `uGust` (1 by default) added.
- **Continuity at the start, checked by hand:** at w = 0 the mixed sky equals the room's own preset; `EL0` and
  `SUN_AZ` rebuild exactly the old sun direction (0.35, 0.8, −0.45 normalised); `M.lit` equals `A.lit`; the water's
  `uSky` falls back to the preset horizon in all three (brook, nile, marsh carry no `sky` override). So nothing jumps
  on the first frame.
- **No leak to other rooms:** each area builds its own sky material (`skyMaterial` per `buildSky`) and its own `LU`
  (`lightOf(A)`), so ch03's haze drifting toward dusk cannot touch ch04 (also haze). Confirmed: ch05 shows no drift.
- `uGust` reaches every `pitMat` (all take `A.LU`) and `creatureMat` (also `A.LU`; it ignores it). No material is
  left with an unset gust, so no plant stops swaying.
- Reduced motion: world time does not advance, so the hour and gust hold still. Correct for comfort.
- `app.js`/`fauna.js`/`museum.html`: cache bumps agree (world v9 in both importers; app v55); `__MU.day`/`daySkip`
  test hooks only.
- Nothing religiously sensitive; no sacred object, site or person; no source added (atmosphere only).

### Local checks on `dc1f1f75`
- Full build order (stamp-dates → … → build-sky): tree clean after. `verify-*.js` 18/18. Framework tests 51/51.
  `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- `tools/day-check.js`: all pass at 960, 390 and 360 px; 0 script errors. Steepest second: light 0.78 %, sun 0.249°
  (ch03), both inside the PR's own bounds (1 %, 0.25°).
- `tools/react-check.js`: **all pass, 71 ok / 0 fail**, at 960 px (ch02, ch03, the Bronze Age corridor, ch05) and
  390/360 px (ch02); 0 script errors. **ch02 re-confirmed** (the builder's log had lost it). The corridor ran to the
  end this time, no crash.
- `tools/xr-entry-check.js`: all pass (74 ok); no VR button without WebXR.
- Phone baseline (`museum-baseline.js`, 412 px, 4x throttle): hall 39 / corridor 85 / ch02 68 calls (budget 100),
  0 errors; identical to #174's reviewed head.
- GitHub on `dc1f1f75`: checks, test, runtime ×2, links, **Lighthouse** green (completed 00:52 UTC); `guard` skipped
  as on every PR.

### Notes passed on (not findings)
- **Wording fix for the reply/status:** "each visit starts at the room's own hour" holds only for a first visit soon
  after the page loads. The drift runs on the museum's one clock, so a later visit arrives wherever the 8-minute
  cycle has got to. The code comment does not claim otherwise; this is only how it was described. VR-STATUS now says
  it plainly.
- ch03's sun moves 0.249°/s at its fastest against a 0.25° bound: inside, but at the edge. If Carter ever asks for a
  shorter cycle in ch03, the bound will fail first; lengthen the period rather than loosen the bound.
- **Merge-time re-sync** as before: the stack conflicts with `main` only in generated `framework/registry/*.json`;
  re-run `node tools/build-entity-registry.js` rather than hand-merge.
- graphify CLI installed from `graph-tools` and updated at run start.

## Carter's field report (2026-11-16 headset walk), as it touches the VR pilot
Folded into VR-STATUS. In short: ground below the glass (2) and birds below the glass (3) are what the waiting
stack fixes (#169 raises the ground; this run's react-check confirms in ch02/ch03 that birds and insects fly over the
raised ground, below eye height). Relics not clickable (5) is the next VR piece's subject (controllers + select). Trigger
vs analog movement (7) is a comfort-spec question for Carter. Portals, arcade, pilgrimages, multiplayer, hallway walls
and sound levels (1, 4, 6, 8) are outside the three pilot rooms or need his say; listed for him, not built here.

## Next
G3 frame budget (Quest 2, 72 fps, per pilot room). #178 now joins the stack as ready for Carter's yes.
