# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~21:50 UTC. **PR #190 opened: the draw ledger.** It shows what the Wing II corridor draws in the
headset. Finding: 90% of the corridor's triangles are the living ground under the glass. Its plants and creatures are
never skipped when out of view (`frustumCulled = false`), so about 504k triangles are drawn whichever way the head
turns. No site change. Reply: `vr/2026-11-22-2145-corridor-ledger.md`; report:
`audits/vr-draw-ledger/2026-11-22-corridor.md` (on the PR branch).

## Done
- #190 `loop/vr-corridor-measure` `4436c5d0` on `main` `1cfb8d9f`: `tools/vr-draw-ledger.js` + corridor report. Local
  checks all pass (build no diff, verify 18/18, tests 51/51, review-checks 9/0/0, xr-entry-check pass, baseline 0
  errors). **Waiting on:** independent review by a run that wrote none of it; GitHub green; Carter's per-item yes.
- #189 `loop/vr-perf-overlay` `ee7ffc76`: independent review PASS 0, GitHub 7/7 green. **Waiting on:** Carter's
  per-item yes; the re-sync after #188.
- #188 `loop/vr-controllers` `f12dc09d`: **MERGEABLE, per item** (Carter's yes on file). The build loop merges it.
- LIVE on `main`: #187 portal culling (`1cfb8d9f`); #185 static zones; #183 stick walking; #182 light rig; #181 harness;
  the living-ground stack; #166 height check.

## In progress
- Nothing held.

## Next (in order)
1. **After #188 goes live:** re-sync #189 onto it (museum.html takes key **61**; app.js keeps both `S.perf.frame` and
   #188's lines), then a delta check by a run that did not re-sync, then green. Not before #188 is on `main`.
2. (build loop, not this loop) merge #188 per item; it qualifies now.
3. **Independent review of #190** (a run that wrote none of it; `tools/` + `audits/` only), filed on `review-log`.
4. **Ground culling bounds (fix 1 of the report), buildable now:** give the living ground's plant scatters
   (`world.js` 781) real bounding spheres, plus a margin for any sway, and turn culling back on. Give the creatures
   (`fauna.js` 165, 288, 330, 423) their pit's box as their sphere. Nothing on screen may change; prove it with
   before/after screenshots, flat and headset. Then re-measure with `vr-draw-ledger.js` and `vr-frame-budget.js`.
   Branch `loop/vr-ground-cull` from `origin/main`.
5. **Cut the Spine's ground into ~10 m pieces** (fix 2): invisible; re-measure after.
6. Identify scene child 109 (92 instanced spheres across the whole building, 14.7k triangles, drawn from the corridor)
   and child 108 (instanced shader quad, not culled; probably the flames).
7. Readings, later steps:
   - near-field poke and magnification;
   - the A button as a select;
   - the pilot spec's verbatim era plaques (§4.3);
   - the shaft-of-light beam (artistry pass).
8. Day and weather, later steps. More creatures (each needs a source first).
- Small tidy for whoever next touches `portals.js`: its comment on the order rooms are checked in is wrong (harmless).
- GPU headroom is tight: with #185, #187 and a reading open, the worst view in Egypt is about 158 of 160 calls.

Possible later, not built:
- pooled-light reach 22 m → 12 m (§2), waiting on the headset walk;
- one settings stele in the Rotunda holding the posture and walking plaques (also a dominant-hand toggle, §d.16);
- **a distant tier for the living ground in the headset** (fix 3): it changes how the ground looks beyond ~8 m, so it
  is an artistry call for Carter. Ask only once fixes 1 and 2 are measured and the corridor is still over the line.

G4 curtain: not needed for ch02 (Carter). The readings of pending elements outside Egypt are veiled under OQ-4. The
elements themselves still stand in the rooms. Any other pending element is surfaced before building.

Note for runs: commit with one plain `git commit -F <file>`, no `--amend`, no model names (no co-author trailer
naming a model). The graphify CLI installs with `bash tools/graphify-session.sh` if missing.

## Carter's field report (`field-report-2026-11-16-vr-walk.md`), against the VR pilot
- 2 ground below the glass, 3 birds below the glass, 7 analog stick walking: **live**.
- 5 relics not clickable: **built, PR #188** (pilot rooms only); your yes is on file; going live via the build loop.
- 1 hallway walls glitching, 4 multiplayer, 6 portals / arcade door / pilgrimages, 8 sound levels: outside the three
  pilot rooms or not in the pilot spec. Not built by this loop.

## Needs Carter
- **#188 (tap a relic to read its label):** nothing more needed; the build loop puts it live.
- **#190 (draw ledger, a measuring tool and report; no site change):** nothing yet. It is asked once its review and
  checks pass.
- **#189 (frame-budget readout in the headset): merge it?**
  - a) Yes (recommended). Its independent review passed with nothing found and every check is green. It is a hidden
    measuring tool that only appears with `?vrfps=1`; visitors never see or download it. It is how your headset walk
    can certify 72 fps. (It needs one routine re-sync after #188 lands; the loops do that.)
  - b) Not yet.
- On your next headset visit:
  - once #189 is live, open `getconexto.com/museum.html?vrfps=1`, enter VR, and walk each pilot room for about a
    minute. The plate in the lower view says WITHIN or OVER and names what is over. Send a photo or the words;
  - try a snap turn while walking, and say if it feels off;
  - say if anything "pops in" at a doorway;
  - once #188 is live, say if the label plaques are easy to read and to point at.
