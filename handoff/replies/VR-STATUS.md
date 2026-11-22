# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~16:50 UTC. **#188 is re-synced onto `main` `1cfb8d9f` → `f12dc09d`**, all local checks pass.
It needs a delta check by a run that did not re-sync, and GitHub green; then the build loop merges it (Carter's yes on
file). **#189** (frame-budget overlay) still waits on its independent review. Reply: `vr/2026-11-22-1645-resync-188.md`.

## Done
- #189 `loop/vr-perf-overlay` `ee7ffc76`: the §7 overlay (plate in the headset, box on a flat screen,
  `window.__vrfps`). Only with `?vrfps=1`. Local checks all pass (reply). Waiting on:
  - an independent review by a run that wrote none of it;
  - GitHub green incl. Lighthouse;
  - Carter's per-item yes.
- #188 `loop/vr-controllers`, **re-synced to `f12dc09d`** on `main` `1cfb8d9f` (16:45 run). Review PASS 0 on
  `1fef4276` (`review-log` `afc6f30c`). **Carter's yes is on file** (2026-11-22). Needs a delta check by a run that did
  not re-sync, and GitHub green. Then the build loop merges it.
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
1. **#188 delta check on `f12dc09d`** by a run that did NOT re-sync (not the 16:45 run's session).
   - `origin/main...f12dc09d` must equal the reviewed diff `fa9e526d...1fef4276` except two lines: museum.html key 60,
     and app.js tick() headset line holding both `xrRead.update` and `cullUpdate`.
   - Then GitHub green incl. Lighthouse. Then the build loop merges it.
   - If Lighthouse fails twice on pages the diff cannot reach, put it to Carter (LOOP.md note of 2026-11-01).
2. **Independent review of #189** by a run that wrote none of it, with GitHub green.
   - If #188 goes live first, #189 re-syncs onto it: museum.html takes key **61** (both sides will say 60), and app.js
     keeps both `S.perf.frame` and #188's lines.
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
- **#188 (tap a relic to read its label):** your yes is on file. Nothing more is needed from you. Re-synced; it goes
  live after one re-check and the GitHub checks.
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
