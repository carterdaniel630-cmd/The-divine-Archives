# VR loop STATUS (overwritten every run)

**As of:** 2026-11-17 ~01:00 UTC. **Day and weather, first piece, built: PR #178** (the hour drifts, the wind
gusts, in ch02, ch03 and the Bronze Age corridor). It waits for an independent review and Lighthouse. #169, #170 and
#174 are qualified except Carter's yes (and a merge-only re-sync onto `main`, which moved to `cf718704` with #176).

## Done
- **Day and weather — PR #178** `loop/vr-daylight` `dc1f1f75` (on #174). Egypt and the corridor drift from golden
  afternoon to a high clear day and back, Mesopotamia from haze to dusk and back, over 8 minutes, eased; the sky,
  sun height and the light on ground, water, plants and creatures follow; plants sway in slow gusts. Nothing
  baked, no light or draw call added; rain not built. **VR, per item.** Reply `vr/2026-11-17-0100-day-and-weather.md`.
- Review of #174 — PASS, 0 open (2026-11-16 23:50 UTC). Reviews PASS: #170, #169. #166 height check LIVE.
- Spec set is staged in `handoff/vr-*.md` (atlas, 2026-11-15); Next was re-planned from it.

## In progress
- Nothing held. Stack: `main` → #169 `5067bc74` → #170 `fbc0d6f4` → #174 `aadc971c` → #178 `dc1f1f75`. At merge
  time: re-sync (merge only) and re-run `node tools/build-entity-registry.js` for the generated registry files.

## Next (in order)
1. **Independent review of #178** by a run that wrote none of it (re-run `react-check.js` for ch02: this run's log
   lost the ch02 lines; corridor crashes the headless browser in this sandbox, as on #170/#174). Wait for its
   Lighthouse. Needs no approval.
2. **G3 Frame budget**: Quest 2 72 fps gate per pilot room (with the living ground and the drift in it). Needs no
   approval to build.
3. Controllers + select → plaques (incl. §15 seated re-anchoring of every plaque); audio; performance scope;
   pilot spaces; living-room contract (as before).
4. Day and weather, later steps (each its own piece): air (dust in the light), the Rotunda's oculus shaft. Rain:
   not in the pilot.
5. More creatures, later candidates (each needs a source and the keep-your-distance rule first): marsh frog,
   Euphrates softshell turtle (ch03); Nile frogs, turtles (ch02).
G4 curtain: not needed for ch02 (Carter); other pending elements surface before building.

## Needs Carter
1. **Your yes to put the living ground live: #169 (ground at your feet), #170 (creatures and plants react to you),
   #174 (more creatures).** All three reviewed PASS and green. They go live together, in that order. Options:
   a) yes to all three; b) yes to #169 + #170 only; c) not yet.
2. **#178 (day and weather):** not ready to ask yet (review and Lighthouse pending). When it is, it goes live after
   the three above. If you'd like different hours (e.g. Egypt toward hard noon, as now, or toward evening), say so.
3. **Height:** #166 is live. On your next headset visit, the plaque shows STANDING/SEATED and your eye height.
