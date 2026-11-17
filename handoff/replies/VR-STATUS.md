# VR loop STATUS (overwritten every run)

**As of:** 2026-11-17 ~05:15 UTC. **Independent review of #178 (day and weather): PASS, 0 open.** GitHub green
incl. Lighthouse on `dc1f1f75`. #169, #170, #174 and now #178 are all qualified except Carter's yes (and a
merge-only re-sync onto `main`, which moved to `5570e888` with #177).

## Done
- **Review of #178 — PASS, 0 open** (this run; reply `vr/2026-11-17-0510-review-178.md`; filed on `review-log`
  `e8b2f187`). Local re-run green, incl. react-check for ch02 (71 ok, the corridor too) and day-check at 960/390/360.
  One wording fix: the hour drift runs on the museum's single clock, so only a first visit soon after the page loads
  is sure to start at the room's own hour; a later visit arrives wherever the 8-minute cycle has got to.
- Day and weather — PR #178 `loop/vr-daylight` `dc1f1f75`. Reviews PASS: #174, #170, #169. #166 height check LIVE.
- Spec set is staged in `handoff/vr-*.md` (atlas, 2026-11-15); Next was re-planned from it.
- The 00:51Z run (also reviewing #178) left a lock and nothing else; this run overwrote it as stale.

## In progress
- Nothing held. Stack: `main` → #169 `5067bc74` → #170 `fbc0d6f4` → #174 `aadc971c` → #178 `dc1f1f75`. At merge
  time: re-sync onto `5570e888` (merge only) and re-run `node tools/build-entity-registry.js` for the generated
  registry files.

## Next (in order)
1. **G3 Frame budget**: Quest 2 72 fps gate per pilot room (with the living ground, creatures and the drift in it),
   draw calls and triangles per view for the Rotunda, ch02, ch03; harness beside `tools/museum-baseline.js`, with a
   report. Measure, don't guess. Needs no approval to build.
2. Controllers + select → plaques (incl. §15 seated re-anchoring of every plaque). This is the pilot's answer to the
   field report's "relics still aren't clickable" (item 5) for the three pilot rooms; audio; performance scope;
   pilot spaces; living-room contract (as before).
3. Day and weather, later steps (each its own piece): air (dust in the light), the Rotunda's oculus shaft. Rain:
   not in the pilot.
4. More creatures, later candidates (each needs a source and the keep-your-distance rule first): marsh frog,
   Euphrates softshell turtle (ch03); Nile frogs, turtles (ch02).
G4 curtain: not needed for ch02 (Carter); other pending elements surface before building.

## Carter's field report (`field-report-2026-11-16-vr-walk.md`), against the VR pilot
- 2 ground below the glass, 3 birds below the glass: fixed by the waiting stack (#169 raises the ground; react-check
  confirms birds and insects fly over it, below eye height, in ch02/ch03). Live only once he says yes.
- 5 relics not clickable: Next 2 (pilot rooms only).
- 7 trigger instead of analog movement: G2 shipped teleport with smooth turn as an option; smooth (analog) walking
  is a comfort-spec choice, so it is asked below, not built.
- 1 hallway walls glitching, 4 multiplayer, 6 portals / arcade door / pilgrimages, 8 sound levels: outside the three
  pilot rooms or not in the pilot spec. Not built by this loop; for the build loop / Carter.

## Needs Carter
1. **Your yes to put the living ground live: #169 (ground at your feet), #170 (creatures and plants react to you),
   #174 (more creatures), #178 (day and weather).** All four reviewed PASS and green. They go live together, in that
   order; this is also the fix for "ground below the glass" and "birds below the glass" from your walk. Options:
   a) yes to all four (recommended); b) yes to #169 + #170 + #174 only; c) not yet.
2. **Walking with the stick (your walk, item 7):** in the pilot rooms, add smooth stick walking as an option beside
   teleport? Options: a) yes, teleport stays the default (recommended: kinder to most stomachs); b) yes, make stick
   walking the default; c) no, teleport only.
3. **Height:** #166 is live. On your next headset visit, the plaque shows STANDING/SEATED and your eye height.
