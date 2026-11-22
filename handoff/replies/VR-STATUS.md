# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~22:35 UTC. **#189 re-synced onto `main` after #188** → `loop/vr-perf-overlay` `f206d61a`. One
conflict (the debug hooks in `app.js`): both sides kept; `museum.html` takes `app.js?v=61`. Local checks all pass.
Reply: `vr/2026-11-22-2235-resync-189.md`. Carter's yes for #190 is now on file too (`decisions-2026-11-22-pr190-yes.md`).

## Done
- #190 `loop/vr-corridor-measure` `4436c5d0` on `main` `1cfb8d9f`: `tools/vr-draw-ledger.js` + corridor report. Local
  checks all pass (build no diff, verify 18/18, tests 51/51, review-checks 9/0/0, xr-entry-check pass, baseline 0
  errors). GitHub 4/4 green (Lighthouse does not run: no `docs/` change). Carter's yes on file. **Waiting on:**
  independent review by a run that wrote none of it.
- #189 `loop/vr-perf-overlay` **`f206d61a`** (re-synced onto `f12dc09d`): independent review PASS 0 (on `ee7ffc76`);
  Carter's yes on file. Local on `f206d61a`: build no diff, verify 18/18, tests 51/51, review-checks 9/0/0,
  vr-perf-overlay-check and xr-entry-check all pass, flat 360/390 0 script errors. **Waiting on:** delta check by a run
  that did not re-sync; GitHub green on `f206d61a` incl. Lighthouse.
- LIVE on `main`: #188 tap-to-read labels (`f12dc09d`); #187 portal culling (`1cfb8d9f`); #185 static zones; #183 stick walking; #182 light rig; #181 harness;
  the living-ground stack; #166 height check.

## In progress
- Nothing held.

## Next (in order)
1. **Delta check of #189's re-sync** (`ee7ffc76..f206d61a`, the merge resolution only) by a run that did not re-sync
   (the 22:35 run did; any later run qualifies). Then GitHub green on `f206d61a` incl. Lighthouse; then the build loop
   merges #189 per item.
2. (build loop, not this loop) merge #189 per item once 1 holds; then #190 (after its review) — #190 touches only
   `tools/` + `audits/`, so it needs no re-sync unless `main` changes those files.
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
- **#189 (frame-budget readout in the headset):** nothing more needed; your yes is on file. Re-synced; waits on a delta
  check by another run and green checks, then the build loop puts it live.
- **#190 (draw ledger):** your yes is on file. It waits on its independent review, then goes live after #189.
- On your next headset visit:
  - once #189 is live, open `getconexto.com/museum.html?vrfps=1`, enter VR, and walk each pilot room for about a
    minute. The plate in the lower view says WITHIN or OVER and names what is over. Send a photo or the words;
  - try a snap turn while walking, and say if it feels off;
  - say if anything "pops in" at a doorway;
  - say if the relic label plaques (#188, live now) are easy to read and to point at.
