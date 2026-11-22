# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~12:10 UTC. **PR #188 opened: point at a relic in a pilot room and tap to read its label**
(answers "relics not clickable"). All local checks pass (xr-entry-check 135 ok / 0 fail). It now needs an independent
review by a run that wrote none of it. Reply: `vr/2026-11-22-1130-select-plaques.md`.

## Done
- #188 `loop/vr-controllers` `1fef4276`: built and verified this run (details in the reply and the PR).
- #187 `loop/vr-portal-cull` `758056a4`: review PASS 0. Carter's yes is on file (`decisions-2026-11-22-carter-pr187-yes.md`).
- #185 `loop/vr-static-zones` `23d312d5`: review PASS 0 and delta check PASS 0. Carter's yes is on file. It waits on
  Lighthouse, then the build loop merges it.
- LIVE on `main`: #183 stick walking, #182 light rig, #181 harness, the living-ground stack, #166 height check.

## In progress
- Nothing held. The 08:10Z lock was left by a run that stopped mid-way with no branch; this run overwrote it as stale.

## Next (in order)
1. **Independent review of #188** by a VR run that wrote none of it (LOOP.md Merging 1). State the GPU numbers (#181
   harness, and xr-entry-check §9's call counts). File it on `review-log`.
2. Once #185 is on `main`: re-sync #187 onto it (merge only) and re-run checks, including `xr-portal-check.js`. A
   different run does the delta check. Then #188 re-syncs after #187 (cache keys conflict: keep the higher).
3. In-headset overlay `?vrfps=1` (§7), so Carter's walk can certify frame time.
4. Wing II corridor: about 736k triangles (over the hard line) and 200 calls, even with #185 and #187. Measure what the
   corridor draws before choosing a fix (§4a LOD).
5. Readings, later steps:
   - near-field poke and magnification;
   - the A button as a select;
   - the pilot spec's verbatim era plaques (Ishtar Gate and others, §4.3);
   - the shaft-of-light beam (artistry pass).
6. Day and weather, later steps. More creatures (each needs a source first).
- Small tidy for whoever next touches `portals.js`: its comment on the order rooms are checked in is wrong (harmless).
- GPU headroom is tight: with #185, #187 and a reading open, the worst view in Egypt is about 158 of 160 calls.

Possible later, not built:
- pooled-light reach 22 m → 12 m (§2), waiting on the headset walk;
- one settings stele in the Rotunda holding the posture and walking plaques (also a dominant-hand toggle, §d.16).

G4 curtain: not needed for ch02 (Carter). The readings of pending elements outside Egypt are veiled under OQ-4. The
elements themselves still stand in the rooms; any other pending element is surfaced before building.

Note for runs: commit with one plain `git commit -F <file>`, no `--amend`, no model names.

## Carter's field report (`field-report-2026-11-16-vr-walk.md`), against the VR pilot
- 2 ground below the glass, 3 birds below the glass, 7 analog stick walking: **live**.
- 5 relics not clickable: **built, PR #188** (pilot rooms only), waiting on review and Carter's yes.
- 1 hallway walls glitching, 4 multiplayer, 6 portals / arcade door / pilgrimages, 8 sound levels: outside the three
  pilot rooms or not in the pilot spec. Not built by this loop.

## Needs Carter
- **#187 (portal culling):** your yes is on file. Nothing more is needed from you; it goes live after #185.
- **#188 (tap a relic to read its label):** no question yet. You will be asked for a yes once it has passed review and
  every check is green.
- On your next headset visit:
  - try a snap turn while walking, and say if it feels off;
  - say if anything "pops in" at a doorway;
  - once #188 is live, say if the label plaques are easy to read and to point at.
