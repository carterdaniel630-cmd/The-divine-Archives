# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~12:10 UTC. **#188 (tap a relic to read its label) passed its independent review, 0 findings**, and
GitHub is 7/7 green incl. Lighthouse. It now needs only Carter's per-item yes (then a re-sync after #187). #185 is live.
Reply: `vr/2026-11-22-1205-review-188.md`.

## Done
- #188 `loop/vr-controllers` `1fef4276`: independent review PASS 0 (`review-log` `afc6f30c`); GitHub 7/7 green.
  Waiting on Carter's per-item yes.
- #187 `loop/vr-portal-cull` `758056a4`: review PASS 0. Carter's yes is on file (`decisions-2026-11-22-carter-pr187-yes.md`).
  Now owes a re-sync onto `main` `23d312d5`.
- LIVE on `main`: #185 static zones (`23d312d5`, deploy 311), #183 stick walking, #182 light rig, #181 harness, the
  living-ground stack, #166 height check.

## In progress
- Nothing held.

## Next (in order)
1. **Re-sync #187 onto `main` `23d312d5`** (#185 is live; merge only, keep the higher cache keys) and re-run checks
   including `xr-portal-check.js`. A different run does the delta check; then the build loop merges it (yes on file).
2. Then #188 re-syncs after #187: conflicts in `museum.html` (keep the higher key) and the `app.js` tick() headset line
   (keep BOTH `cullUpdate` and `xrRead.update`). Delta check by a run that did not re-sync.
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
- 5 relics not clickable: **built, PR #188** (pilot rooms only), review passed; waiting on Carter's yes.
- 1 hallway walls glitching, 4 multiplayer, 6 portals / arcade door / pilgrimages, 8 sound levels: outside the three
  pilot rooms or not in the pilot spec. Not built by this loop.

## Needs Carter
- **#187 (portal culling):** your yes is on file. Nothing more is needed from you; it goes live after #185.
- **#188 (tap a relic to read its label): merge it?** a) Yes (recommended): review passed with 0 findings, every check
  green; it goes live after #187, once re-synced and re-checked. b) Not yet.
- On your next headset visit:
  - try a snap turn while walking, and say if it feels off;
  - say if anything "pops in" at a doorway;
  - once #188 is live, say if the label plaques are easy to read and to point at.
