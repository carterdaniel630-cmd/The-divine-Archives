# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~08:25 UTC. **#187 (portal culling) independently reviewed: PASS, 0 findings**, GitHub 7/7 green
incl. Lighthouse. **#185** reviewed, re-synced `23d312d5` and delta-checked by the build loop; it has Carter's yes and
waits only on Lighthouse, then the build loop merges it. Reply: `vr/2026-11-22-0825-review-187.md`.

## Done
- #187 `loop/vr-portal-cull` `758056a4`: review PASS 0 (`review-log` `cb940fe8`). Worst-view stereo calls with #185:
  ch02 128–148, ch03 102–114 (Quest 2 ceiling 160), corridor 200.
- #185 `loop/vr-static-zones` `23d312d5`: review PASS 0 + delta PASS 0 (build loop). Carter's yes on file.
- LIVE on `main`: #183 stick walking, #182 light rig, #181 harness, living-ground stack, #166 height check.

## In progress
- Nothing held.
- #185: build loop merges it per item once Lighthouse is green on `23d312d5`.
- #187: waits on Carter's per-item yes; after #185 lands it needs a re-sync onto `main` (cache-key lines conflict:
  keep the higher keys) and a delta check by a run that did not re-sync, then GitHub green again.

## Next (in order)
1. Once #185 is on `main`: re-sync #187 onto it (merge only), re-run checks incl. `xr-portal-check.js`; a different run
   does the delta check.
2. Controllers + select → plaques (incl. §15 seated re-anchoring). Answers the field report's "relics not clickable".
3. In-headset overlay `?vrfps=1` (§7), so Carter's walk can certify frame time.
4. The Wing II corridor: triangles ~736k (over the hard line) and calls 200 even with #185 + #187. Measure what the
   corridor draws (likely the two rooms' relics seen through their doors) before choosing a fix (§4a LOD).
5. Day and weather, later steps (dust in the light, the Rotunda's oculus shaft). More creatures (each needs a source first).
- Small tidy for whoever next touches `portals.js`: its comment about the order rooms are checked in is wrong (harmless).

Possible later, not built:
- pooled-light reach 22 m → 12 m (§2), waiting on the headset walk;
- one settings stele in the Rotunda holding the posture and walking plaques (also a dominant-hand toggle, §d.16).

G4 curtain: not needed for ch02 (Carter). Other pending elements surface before building.

Note for runs: commit with one plain `git commit -F <file>`, no `--amend`, no model names.

## Carter's field report (`field-report-2026-11-16-vr-walk.md`), against the VR pilot
- 2 ground below the glass, 3 birds below the glass, 7 analog stick walking: **live**.
- 5 relics not clickable: Next 2 (pilot rooms only).
- 1 hallway walls glitching, 4 multiplayer, 6 portals / arcade door / pilgrimages, 8 sound levels: outside the three
  pilot rooms or not in the pilot spec. Not built by this loop.

## Needs Carter
- **#187 — portal culling (the headset stops drawing rooms the walls hide; flat screen unchanged).** Reviewed, 0
  problems, all checks green. Yes to merge it? (a) Yes (recommended) · (b) Not yet. A yes is carried out after #185 is
  live and #187 is re-synced and re-checked.
- On your next headset visit: try a snap turn while walking (it eases round for about half a second) and tell us if it
  feels off; and say if anything ever "pops in" as you walk through a doorway (that would be the culling).
