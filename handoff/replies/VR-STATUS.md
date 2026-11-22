# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~21:40 UTC. **#189 independent review PASS, 0 findings** (this run wrote none of it), GitHub
7/7 green on `ee7ffc76` incl. Lighthouse. It now waits only on Carter's per-item yes, and on a re-sync once #188 is
live. **#188 is still mergeable now** (build loop merges it; `main` was still `1cfb8d9f` at 21:30). Reply:
`vr/2026-11-22-2140-review-189.md`; review filed on `review-log` `30fd2af9`; PR comment posted.

## Done
- #189 `loop/vr-perf-overlay` `ee7ffc76` on `main` `1cfb8d9f`: the §7 overlay (plate in the headset, box on a flat
  screen, `window.__vrfps`), only with `?vrfps=1`. Independent review PASS 0 (21:40), GitHub 7/7 green. This run re-ran:
  review-checks 9/0/0 with `--build` (no diff), verify 18/18, tests 51/51, `vr-perf-overlay-check.js` all pass,
  `xr-entry-check.js` all pass, flat baseline 0 errors. **Waiting on:** Carter's per-item yes; the re-sync after #188.
- #188 `loop/vr-controllers` `f12dc09d` on `main` `1cfb8d9f`: **MERGEABLE, per item.** Review PASS 0, delta check PASS 0
  (twice), GitHub 7/7 green, Carter's yes on file. **The build loop merges it** (the VR loop never merges).
- LIVE on `main`: #187 portal culling (`1cfb8d9f`, deploy 312); #185 static zones; #183 stick walking; #182 light rig;
  #181 harness; the living-ground stack; #166 height check.

## In progress
- Nothing held.

## Next (in order)
1. **After #188 goes live:** re-sync #189 onto it (museum.html takes key **61**; app.js keeps both `S.perf.frame` and
   #188's lines), then a delta check by a run that did not re-sync, then green. Not before #188 is on `main`.
2. (build loop, not this loop) merge #188 per item; it qualifies now.
3. **Wing II corridor:** about 736k triangles (over the hard line) and 196 calls, even with #185 and #187. Measure what
   the corridor draws (which meshes, per view) before choosing a fix (§4a LOD). Buildable now; no Carter approval to
   measure. Branch `loop/vr-corridor-measure` from `origin/main`.
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

Note for runs: commit with one plain `git commit -F <file>`, no `--amend`, no model names (no co-author trailer
naming a model). The graphify CLI was not needed this run (review only, no code changed).

## Carter's field report (`field-report-2026-11-16-vr-walk.md`), against the VR pilot
- 2 ground below the glass, 3 birds below the glass, 7 analog stick walking: **live**.
- 5 relics not clickable: **built, PR #188** (pilot rooms only); your yes is on file; going live via the build loop.
- 1 hallway walls glitching, 4 multiplayer, 6 portals / arcade door / pilgrimages, 8 sound levels: outside the three
  pilot rooms or not in the pilot spec. Not built by this loop.

## Needs Carter
- **#188 (tap a relic to read its label):** nothing more needed; the build loop puts it live.
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
