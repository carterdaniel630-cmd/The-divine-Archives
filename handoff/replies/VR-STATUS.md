# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~21:25 UTC. **#188 is mergeable now**: delta check on `f12dc09d` PASS 0 (done twice, by runs that
did not re-sync), GitHub 7/7 green incl. Lighthouse, Carter's yes on file. The build loop merges it. **#189** still waits
on its independent review. Reply: `vr/2026-11-22-2125-delta-188-confirm.md`. (The 16:48 run filed its delta check on
`review-log` but stopped before writing back; its VR-LOCK sat 4h27m, which is why the pulse watch nudged.)

## Done
- #189 `loop/vr-perf-overlay` `ee7ffc76`: the §7 overlay (plate in the headset, box on a flat screen,
  `window.__vrfps`). Only with `?vrfps=1`. Local checks all pass (reply). Waiting on:
  - an independent review by a run that wrote none of it;
  - GitHub green incl. Lighthouse;
  - Carter's per-item yes.
- #188 `loop/vr-controllers` `f12dc09d` on `main` `1cfb8d9f`: **MERGEABLE, per item.** Review PASS 0 on `1fef4276`
  (`afc6f30c`); delta check PASS 0 (`review-log` `55e1de8b`, confirmed 21:25); GitHub 7/7 green incl. Lighthouse;
  Carter's yes on file. **The build loop merges it** (the VR loop never merges).
- LIVE on `main`:
  - #187 portal culling (`1cfb8d9f`, deploy 312);
  - #185 static zones;
  - #183 stick walking;
  - #182 light rig;
  - #181 harness;
  - the living-ground stack;
  - #166 height check.

## In progress
- Nothing held.

## Next (in order)
1. **Independent review of #189** (`loop/vr-perf-overlay` `ee7ffc76`) by a run that wrote none of it, with GitHub green.
   - If #188 goes live first (expected), #189 re-syncs onto it: museum.html takes key **61** (both sides say 60), and
     app.js keeps both `S.perf.frame` and #188's lines; then a delta check by a run that did not re-sync.
2. (build loop, not this loop) merge #188 per item; it qualifies now.
3. Wing II corridor: about 736k triangles (over the hard line) and 198 calls, even with #185 and #187. Measure what the
   corridor draws before choosing a fix (§4a LOD).
4. Readings, later steps:
   - near-field poke and magnification;
   - the A button as a select;
   - the pilot spec's verbatim era plaques (Ishtar Gate and others, §4.3);
   - the shaft-of-light beam (artistry pass).
5. Day and weather, later steps. More creatures (each needs a source first).
- Small tidy for whoever next touches `portals.js`: its comment on the order rooms are checked in is wrong (harmless).
- GPU headroom is tight: with #185, #187 and a reading open, the worst view in Egypt is about 158 of 160 calls.

Possible later, not built:
- pooled-light reach 22 m → 12 m (§2), waiting on the headset walk;
- one settings stele in the Rotunda holding the posture and walking plaques (also a dominant-hand toggle, §d.16).

G4 curtain: not needed for ch02 (Carter). The readings of pending elements outside Egypt are veiled under OQ-4. The
elements themselves still stand in the rooms; any other pending element is surfaced before building.

Note for runs: commit with one plain `git commit -F <file>`, no `--amend`, no model names. The graphify CLI was missing
in the 12:30 and 12:40 runs; read `graphify-out/GRAPH_REPORT.md` or the code directly if it is missing again.

## Carter's field report (`field-report-2026-11-16-vr-walk.md`), against the VR pilot
- 2 ground below the glass, 3 birds below the glass, 7 analog stick walking: **live**.
- 5 relics not clickable: **built, PR #188** (pilot rooms only), review passed; waiting on Carter's yes.
- 1 hallway walls glitching, 4 multiplayer, 6 portals / arcade door / pilgrimages, 8 sound levels: outside the three
  pilot rooms or not in the pilot spec. Not built by this loop.

## Needs Carter
- **#188 (tap a relic to read its label):** your yes is on file and every check has passed. Nothing more is needed from
  you; the build loop puts it live.
- **#189 (frame-budget readout in the headset): merge it?**
  - a) Yes, once its independent review passes and every check is green (recommended). It is a hidden measuring tool
    that only appears with `?vrfps=1`. Visitors never see or download it. It is how your headset walk can certify
    72 fps.
  - b) Not yet.
- On your next headset visit:
  - once #189 is live, open `getconexto.com/museum.html?vrfps=1`, enter VR, and walk each pilot room for about a
    minute. The plate in the lower view says WITHIN or OVER and names what is over. Send a photo or the words;
  - try a snap turn while walking, and say if it feels off;
  - say if anything "pops in" at a doorway;
  - once #188 is live, say if the label plaques are easy to read and to point at.
