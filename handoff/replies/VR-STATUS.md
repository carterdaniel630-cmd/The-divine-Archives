# VR loop STATUS (overwritten every run)

**As of:** 2026-11-28 ~21:05 UTC. This run: **independent review of #191, PASS, 0 findings** (reply
`vr/2026-11-28-2050-review-191.md`; `review-log` `7c6e745d`). Meanwhile the build loop **merged #189** (`main` `f12dc09d` →
`f206d61a`, deploy 314 green), and Carter answered the walk questions (`decisions-2026-11-28-carter-vr-walk-answers.md`):
golden arch (a), floors = match Egypt, sky plaque (a), and **his yes for #191**. Folded into Next below.

## Done
- #191 `loop/vr-stick-findable` `37154f55` on `main` `f12dc09d`: a press that starts on a plaque or an open reading stays a
  press however long it is held. Review PASS 0 (this run; the fault reproduces on `main`'s code, 5 FAIL, and is gone on
  the branch). Carter's yes on file. GitHub 6 green, Lighthouse running at 20:50.
  **Still needs:** re-sync onto `f206d61a` (#189 landed first; app.js key: keep v=62), a delta check by a run that did not
  re-sync, GitHub green incl. Lighthouse on the new head; then the build loop merges it per item.
- #189 MERGED (build loop, 2026-11-28). #190: review PASS 0, Carter's yes on file; the build loop rebases it onto `f206d61a`.
- LIVE on `main`: #189 frame-budget overlay; #188 tap-to-read labels; #187 portal culling; #185 static zones; #183 stick
  walking; #182 light rig; #181 harness; the living-ground stack; #166 height check.

## In progress
- Nothing held by the VR loop. The build loop held `LOCK` from 20:56Z and may re-sync #190/#191 itself: check
  `git log origin/loop/vr-stick-findable` before re-syncing, so two runs never re-sync the same PR.

## Next (in order; Carter's walk order, `vr-fix-order-2026-11-22-carters-walk.md` + his 11-28 answers)
1. **#191 re-sync onto `origin/main`** (only if the build loop has not already done it), or, if someone else re-synced it,
   the **delta check** of that re-sync (a run that did not re-sync; file on `review-log`).
2. **Portals in the pilot (walk item 1):** the pilot spec's wing and room archways (`vr-pilot-spec.md` §Rotunda/atrium,
   `vr-interaction-spec.md` §1 row 8 and §4.4): walking through, or teleporting at, an archway fires the transition with the
   standard fade; the rotunda door returns. First find in code what a pilot archway does today in the headset (Rotunda →
   Wing II, atrium → ch02 / ch03, and back), reproduce with the stand-in headset, then fix. Branch `loop/vr-portals`.
3. **Golden Pilgrimage arch in VR (walk item 1, Carter (a)):** walking into the arch in the headset leaves VR and opens the
   site page flat, as the flat museum's step-through does. That only; no Pilgrimage sites in VR. Branch `loop/vr-arch-exit`.
4. **Hallway walls glitch (walk item 3):** Wing II corridor. Reproduce first (stand-in headset, walking and teleporting in
   and out; look for walls popping with portal culling #187 and the static zones #185), then fix the cause.
5. **Floors match Egypt (walk item 4, Carter: "the way it's done in Egypt's room is perfect"):** measure, per pilot room
   (Rotunda, ch03, the Wing II corridor), how floor and ground differ from Egypt's (ground below the glass, creatures below
   it, floor height under the visitor); bring them to Egypt's treatment; nothing in Egypt changes; before/after shots flat
   and headset. If Egypt's treatment cannot carry over as is, surface it, don't invent a look.
6. **RUN THE SKY plaque (walk item 5, Carter (a)):** a world-placed plaque under the Rotunda dome in the headset, in the
   pattern of the walking and posture plaques, that starts and stops the planetarium's sky run. Control only, no new content.
7. **Ground culling bounds:** real bounding spheres for the living ground's plant scatters (`world.js` ~781) and creatures
   (`fauna.js` 165, 288, 330, 423); nothing on screen changes; re-measure with `vr-draw-ledger.js` and `vr-frame-budget.js`.
8. Cut the Spine's ground into ~10 m pieces; re-measure.
9. Identify scene children "109" (92 instanced spheres) and "108" (instanced shader quad, probably flames) by content.
10. Readings, later steps: near-field poke and magnification; the A button as a select; the pilot spec's verbatim era
    plaques (§4.3); the shaft-of-light beam (artistry pass).
11. Day and weather, later steps. More creatures (each needs a source first).
- Small tidy for whoever next touches `portals.js`: its comment on the order rooms are checked in is wrong (harmless).
- GPU headroom is tight: the worst view in Egypt is about 158 of 160 calls with a reading open. Items 3 and 6 add a plaque
  or a trigger: measure calls before and after.

Possible later, not built: pooled-light reach 22 m → 12 m; a distant tier for the living ground (an artistry call for
Carter, only if the fixes leave the corridor over the line).

G4 curtain: not needed for ch02 (Carter). Pending elements outside Egypt are veiled under OQ-4.

Note for runs: commit with one plain `git commit -F <file>`, no `--amend`, no model names. `xr-entry-check.js` binds port
8791: never run two at once. The graphify CLI installs with `bash tools/graphify-session.sh` if missing. `git rev-parse
--short` with two refs errors here; pass one ref at a time.

## Carter's 2026-11-22 walk, item by item
1. Portals don't transport: pilot archways → Next 2. Golden Pilgrimage arch → Next 3 (his (a)).
2. Stick walking: **PR #191** (reviewed PASS; his yes on file; your next walk is the test).
3. Hallway walls glitch → Next 4.
4. Floors: match Egypt → Next 5.
5. Run the sky from inside VR → Next 6 (his (a)).
6. Pilgrimages in VR, 7. picking up relics, 8. characters: outside the three pilot rooms or new features. Not built.

## Needs Carter
- Nothing new. #191 goes live through the build loop once re-synced, delta-checked and green (your yes is on file). Then,
  in the headset: point at the STICK WALKING plaque beside you on entering VR, press the trigger at your own pace three
  times (it warns twice), and push the left stick.
