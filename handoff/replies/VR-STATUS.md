# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~12:30 UTC. **#187 (portal culling) is re-synced onto `main` `23d312d5` → `1cfb8d9f`**, local checks
all pass, flat museum identical to `main`. It needs a delta check by another run and GitHub green; Carter's yes is on file.
#188 still waits on Carter's per-item yes. Reply: `vr/2026-11-22-1230-resync-187.md`.

## Done
- #187 `loop/vr-portal-cull` **`1cfb8d9f`** (re-sync of reviewed `758056a4`): review PASS 0 earlier; Carter's yes on file
  (`decisions-2026-11-22-carter-pr187-yes.md`). Waiting on: delta check by a run other than ..01HFWzTnD5NBbs9gpVQJr8r4,
  GitHub 7/7 green incl. Lighthouse on `1cfb8d9f`.
- #188 `loop/vr-controllers` `1fef4276`: independent review PASS 0 (`review-log` `afc6f30c`); GitHub 7/7 green.
  Waiting on Carter's per-item yes.
- LIVE on `main`: #185 static zones (`23d312d5`, deploy 311), #183 stick walking, #182 light rig, #181 harness, the
  living-ground stack, #166 height check.

## In progress
- Nothing held.

## Next (in order)
1. **Delta check of #187's re-sync** (`origin/main...1cfb8d9f` vs reviewed `758056a4`; expect only the cache-key line to
   differ from the reviewed diff) by a run that did not re-sync. File it on `review-log`. Re-run `xr-portal-check.js`.
   Then the build loop merges it once GitHub is green.
2. Then #188 re-syncs after #187 is live: conflicts in `museum.html` (keep the higher key) and the `app.js` tick()
   headset line (keep BOTH `cullUpdate` and `xrRead.update`). Delta check by a run that did not re-sync.
3. In-headset overlay `?vrfps=1` (§7), so Carter's walk can certify frame time.
4. Wing II corridor: about 736k triangles (over the hard line) and 198 calls, even with #185 and #187 (re-measured this
   run). Measure what the corridor draws before choosing a fix (§4a LOD).
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

Note for runs: commit with one plain `git commit -F <file>`, no `--amend`, no model names. The graphify CLI was missing
in the 12:30 run; read `graphify-out/GRAPH_REPORT.md` or the code directly if it is missing again.

## Carter's field report (`field-report-2026-11-16-vr-walk.md`), against the VR pilot
- 2 ground below the glass, 3 birds below the glass, 7 analog stick walking: **live**.
- 5 relics not clickable: **built, PR #188** (pilot rooms only), review passed; waiting on Carter's yes.
- 1 hallway walls glitching, 4 multiplayer, 6 portals / arcade door / pilgrimages, 8 sound levels: outside the three
  pilot rooms or not in the pilot spec. Not built by this loop.

## Needs Carter
- **#187 (portal culling):** your yes is on file. Nothing more is needed from you; it goes live after its last checks.
- **#188 (tap a relic to read its label): merge it?** a) Yes (recommended): review passed with 0 findings, every check
  green; it goes live after #187, once re-synced and re-checked. b) Not yet.
- On your next headset visit:
  - try a snap turn while walking, and say if it feels off;
  - say if anything "pops in" at a doorway;
  - once #188 is live, say if the label plaques are easy to read and to point at.
