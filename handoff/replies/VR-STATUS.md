# VR loop STATUS (overwritten every run)

**As of:** 2026-11-28 ~21:30 UTC. Picked up after a 5-day gap (VR-LOCK and the build loop's LOCK both stale since
2026-11-23 ~02:45 UTC). **PR #191 built** from Carter's 2026-11-22 headset walk, item 2 (stick walking would not turn on).
Reply: `vr/2026-11-28-2015-plaque-press.md`. Carter's walk (`handoff/vr-fix-order-2026-11-22-carters-walk.md`) now orders
this list: it is newer than the old Next, which drops below it.

## Done
- #191 `loop/vr-stick-findable` `37154f55` on `main` `f12dc09d`: a press that starts on a plaque (walking, posture) or an
  open reading stays a press however long it is held; before, any press over 0.2 s became a teleport arc, so the walking
  plaque never heard an unhurried press (reproduced on `main`'s code). Local checks all pass (xr-entry-check 137/137).
  **Needs:** independent review by a run that wrote none of it, GitHub green incl. Lighthouse, Carter's per-item yes.
- #189 `loop/vr-perf-overlay` `f206d61a`: **GitHub 7/7 green incl. Lighthouse** (finished 2026-11-22 22:39). Review PASS 0,
  delta check PASS 0, Carter's yes on file: **mergeable now, per item, by the build loop.**
- #190 `loop/vr-corridor-measure` `4436c5d0`: review PASS 0, GitHub 4/4, Carter's yes on file; goes after #189 (rebase onto
  the then-`main`, re-run checks 2–3).
- LIVE on `main`: #188 tap-to-read labels; #187 portal culling; #185 static zones; #183 stick walking; #182 light rig;
  #181 harness; the living-ground stack; #166 height check.

## In progress
- Nothing held.

## Next (in order; Carter's walk first)
1. **Independent review of #191** (any VR run that wrote none of it; file on `review-log` per LOOP.md step 7).
2. **Portals in the pilot (walk item 1), buildable now:** the pilot spec's wing and room archways
   (`vr-pilot-spec.md` §Rotunda/atrium, `vr-interaction-spec.md` §1 row 8 and §4.4): walking through, or teleporting at,
   an archway fires the transition with the standard fade; the rotunda door returns. First find, in code, what a pilot
   archway does today in the headset (Rotunda → Wing II, atrium → ch02 / ch03, and back), reproduce the fault with the
   stand-in headset, then fix. Branch `loop/vr-portals` from `origin/main`. The golden Pilgrimage arch is NOT this item
   (see Needs Carter).
3. **Hallway walls glitch (walk item 3):** the Wing II corridor between the pilot rooms. Reproduce first (stand-in
   headset, walking and teleporting in and out of the corridor; look for walls popping with portal culling #187 and the
   static zones #185), then fix the cause.
4. **Ground culling bounds** (old Next 2): real bounding spheres for the living ground's plant scatters (`world.js`
   ~781) and the creatures (`fauna.js` 165, 288, 330, 423); nothing on screen changes; before/after shots; re-measure
   with `vr-draw-ledger.js` and `vr-frame-budget.js`. Branch `loop/vr-ground-cull`.
5. Cut the Spine's ground into ~10 m pieces (fix 2); re-measure.
6. Identify scene children "109" (92 instanced spheres) and "108" (instanced shader quad, probably flames) by content.
7. Readings, later steps: near-field poke and magnification; the A button as a select; the pilot spec's verbatim era
   plaques (§4.3); the shaft-of-light beam (artistry pass).
8. Day and weather, later steps. More creatures (each needs a source first).
- Small tidy for whoever next touches `portals.js`: its comment on the order rooms are checked in is wrong (harmless).
- GPU headroom is tight: the worst view in Egypt is about 158 of 160 calls with a reading open.
- #191 and #189 both bump `museum.html`'s app.js key (#189 v=61, #191 v=62): whichever goes second re-syncs.

Possible later, not built: pooled-light reach 22 m → 12 m; one settings stele in the Rotunda; a distant tier for the
living ground (an artistry call for Carter, only if fixes 1–2 leave the corridor over the line).

G4 curtain: not needed for ch02 (Carter). Pending elements outside Egypt are veiled under OQ-4.

Note for runs: commit with one plain `git commit -F <file>`, no `--amend`, no model names. `xr-entry-check.js` binds port
8791: never run two at once. The graphify CLI installs with `bash tools/graphify-session.sh` if missing.

## Carter's 2026-11-22 walk, item by item
1. Portals don't transport: pilot archways → Next 2. The golden Pilgrimage arch → Needs Carter.
2. Stick walking: **PR #191** (the likely cause; your next walk is the test).
3. Hallway walls glitch → Next 3.
4. Floors not raised → Needs Carter (what you saw).
5. Run the sky from inside VR (the Rotunda dome) → Needs Carter (a new control).
6. Pilgrimages in VR, 7. picking up relics, 8. characters: outside the three pilot rooms or new features. Not built.

## Needs Carter
- **#191 (stick walking fix):** your yes to merge, once it is reviewed and green. Then, in the headset: point at the
  STICK WALKING plaque beside you on entering VR, press the trigger at your own pace three times (it warns twice), and
  push the left stick.
- **#189 and #190:** nothing more needed; your yes is on file. The build loop puts them live (it has not run since 11-23).
- **Golden Pilgrimage arch in VR:** the Pilgrimage sites are not in VR. (a) walking into the arch leaves VR and opens the
  site page flat; (b) leave it as it is until Pilgrimages come to VR. Recommend (a).
- **Floors (walk item 4):** the ground-below-the-glass fix is live. Do you mean the floor feels too low under you (eye
  height), or the floor surface itself should sit higher? A photo helps.
- **Sky control in VR (walk item 5):** add a RUN THE SKY plaque under the Rotunda dome in the headset? (a) yes, as a plaque
  like the walking one; (b) later. Recommend (a).
