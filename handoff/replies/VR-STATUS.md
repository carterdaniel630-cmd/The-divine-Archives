# VR loop STATUS (overwritten every run)

**As of:** 2026-11-17 ~06:30 UTC. **Light rig per tier built: PR #182** (`loop/vr-light-rig` `118abdcc`). In a headset,
lights go from 8 to **5 on Quest 2** and **6 on Quest 3**, both within §2. The flat museum is unchanged. Draw calls and
triangles are unchanged; those are Next 2. Reply: `vr/2026-11-17-0625-light-rig.md`.

## Done
- Light rig per tier — PR #182 built (this run). Measured 8 → 5 lights (stand-in Quest 2), 6 (Quest 3), 0 errors.
- Review of #181: PASS, 0 open (run of ~05:45 UTC). Reviews PASS: #178, #174, #170, #169. #166 height check is LIVE.
- G3 — PR #181 built (reply `vr/2026-11-17-0550-frame-budget.md`): harness `tools/vr-frame-budget.js`, stand-in
  headset in `tools/xr-standin.js`, report `audits/vr-frame-budget/2026-11-17-pilot.md`. Verdict of the measurement:
  the pilot rooms are not yet shown to fit Quest 2 (8 lights vs 5; ch02/ch03 ~200–226 calls vs 160; corridor
  sightline past the 500k-triangle hard-fail line).
- The spec set is staged in `handoff/vr-*.md`.

## In progress
- Nothing held. Waiting for Carter's yes: living-ground stack `main` → #169 `5067bc74` → #170 `fbc0d6f4` →
  #174 `aadc971c` → #178 `dc1f1f75` (at merge time: re-sync onto `5570e888`, merge only, and re-run
  `node tools/build-entity-registry.js`), and #181 `66d6969b` (fast-forwards on its own).

## Next (in order)
1. **Independent review of #182** (light rig), by a run that wrote none of it, plus GitHub green incl. Lighthouse
   (`docs/` changed).
2. **Draw calls in ch02/ch03** (§4b: extend `bake()` to relic shared-material meshes), then **portal culling for the
   corridor sightline** (§5). Each is its own piece and is re-measured with the harness. Also find the source of the
   5,206 points per eye. (Fix the doubled header line in `tools/xr-standin.js` if a piece touches it.)
3. Controllers + select → plaques (incl. §15 seated re-anchoring). This answers the field report's "relics not
   clickable" for the pilot rooms.
4. In-headset overlay `?vrfps=1` (§7) so Carter's walk can certify frame time.
5. Day and weather, later steps (dust in the light, the Rotunda's oculus shaft). More creatures (each needs a source
   first).
Possible later, not built: pooled-light reach 22 m → 12 m (§2). It changes the look, so it waits for the headset walk.
G4 curtain: not needed for ch02 (Carter). Other pending elements surface before building.

## Carter's field report (`field-report-2026-11-16-vr-walk.md`), against the VR pilot
- 2 ground below the glass, 3 birds below the glass: fixed by the waiting stack (#169 raises the ground; react-check
  confirms birds and insects fly over it, below eye height, in ch02/ch03). Live only once he says yes.
- 5 relics not clickable: Next 3 (pilot rooms only).
- 7 trigger instead of analog movement: G2 shipped teleport with smooth turn as an option; smooth (analog) walking
  is a comfort-spec choice, so it is asked below, not built.
- 1 hallway walls glitching, 4 multiplayer, 6 portals / arcade door / pilgrimages, 8 sound levels: outside the three
  pilot rooms or not in the pilot spec. Not built by this loop; for the build loop / Carter.

## Needs Carter
- Coming: **#182 (fewer lights in the headset)** will be put to you once its independent review passes.
0. **Your yes for #181 (frame-budget tool and report).** Reviewed PASS, checks green. Tools only, nothing on the live
   site changes. Options: a) yes (recommended); b) not yet.
1. **Your yes to put the living ground live: #169 (ground at your feet), #170 (creatures and plants react to you),
   #174 (more creatures), #178 (day and weather).** All four reviewed PASS and green. They go live together, in that
   order; this is also the fix for "ground below the glass" and "birds below the glass" from your walk. Options:
   a) yes to all four (recommended); b) yes to #169 + #170 + #174 only; c) not yet.
2. **Walking with the stick (your walk, item 7):** in the pilot rooms, add smooth stick walking as an option beside
   teleport? Options: a) yes, teleport stays the default (recommended: kinder to most stomachs); b) yes, make stick
   walking the default; c) no, teleport only.
3. **Height:** #166 is live. On your next headset visit, the plaque shows STANDING/SEATED and your eye height.
