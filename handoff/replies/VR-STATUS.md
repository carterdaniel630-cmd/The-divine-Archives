# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~22:50 UTC. **#189 delta check PASS 0** on `f206d61a` and **#190 independent review PASS 0**, both by
a run that wrote none of them. Reply: `vr/2026-11-22-2250-delta-189-review-190.md`. #189 waits only on Lighthouse (running at
write time); #190 is fully qualified and goes after #189. Both have Carter's yes on file; the build loop merges them.

## Done
- #190 `loop/vr-corridor-measure` `4436c5d0` on `main` `1cfb8d9f`: `tools/vr-draw-ledger.js` + corridor report.
  **Independent review PASS 0** (22:45; tool re-run reproduces every figure). GitHub 4/4 green (no Lighthouse: no `docs/`
  change). Carter's yes on file. **Ready; goes after #189** (build loop rebases onto the then-`main`, re-runs checks).
- #189 `loop/vr-perf-overlay` **`f206d61a`** (re-synced onto `f12dc09d`): independent review PASS 0 (on `ee7ffc76`);
  Carter's yes on file. **Delta check PASS 0** (22:45, a run that did not re-sync; all local checks re-run). GitHub 6
  green; **waiting on Lighthouse** on `f206d61a` (running at 22:50), then the build loop merges it.
- LIVE on `main`: #188 tap-to-read labels (`f12dc09d`); #187 portal culling (`1cfb8d9f`); #185 static zones; #183 stick walking; #182 light rig; #181 harness;
  the living-ground stack; #166 height check.

## In progress
- Nothing held.

## Next (in order)
1. (build loop, not this loop) merge #189 per item once Lighthouse is green on `f206d61a`; then #190 (rebase onto the
   then-`main`, re-run checks 2–3). If Lighthouse fails on `f206d61a`, the next VR run looks into it first.
2. **Ground culling bounds (fix 1 of the report), buildable now:** give the living ground's plant scatters
   (`world.js` 781) real bounding spheres, plus a margin for any sway, and turn culling back on. Give the creatures
   (`fauna.js` 165, 288, 330, 423) their pit's box as their sphere. Nothing on screen may change; prove it with
   before/after screenshots, flat and headset. Then re-measure with `vr-draw-ledger.js` and `vr-frame-budget.js`.
   Branch `loop/vr-ground-cull` from `origin/main`.
3. **Cut the Spine's ground into ~10 m pieces** (fix 2): invisible; re-measure after.
4. Identify scene child 109 (find it by content: scene-child numbers shift between runs) (92 instanced spheres across the whole building, 14.7k triangles, drawn from the corridor)
   and child 108 (instanced shader quad, not culled; probably the flames).
5. Readings, later steps:
   - near-field poke and magnification;
   - the A button as a select;
   - the pilot spec's verbatim era plaques (§4.3);
   - the shaft-of-light beam (artistry pass).
6. Day and weather, later steps. More creatures (each needs a source first).
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
- **#189 (frame-budget readout in the headset):** nothing more needed; your yes is on file. Checked; waits only on one
  slow automatic check, then the build loop puts it live.
- **#190 (draw ledger):** nothing more needed; your yes is on file. Checked; goes live right after #189.
- On your next headset visit:
  - once #189 is live, open `getconexto.com/museum.html?vrfps=1`, enter VR, and walk each pilot room for about a
    minute. The plate in the lower view says WITHIN or OVER and names what is over. Send a photo or the words;
  - try a snap turn while walking, and say if it feels off;
  - say if anything "pops in" at a doorway;
  - say if the relic label plaques (#188, live now) are easy to read and to point at.
