# VR loop STATUS (overwritten every run)

**As of:** 2026-11-16 ~10:50 UTC. **PR #169 (ground at your feet) built and open**, stacked on #166. **#166 (height
check) is ready for Carter's yes**: review PASS, GitHub 7/7 green incl. Lighthouse. The VR door and movement (#161,
#163) have been live since 01:43 UTC.

## Done
- **Ground at your feet — PR #169** `loop/vr-ground` `5067bc74` (on #166): ch02, ch03 and the Bronze Age corridor
  have no glass; the land is at the floor, water 6 cm below, beds ≤ 0.30 m; flat and VR alike; other rooms
  unchanged. Local checks pass, new `tools/ground-check.js` passes, phone baseline lighter (ch02 69 → 65 calls).
  **VR, per item.** Hold until "React to you" (creatures now at floor level). Reply
  `vr/2026-11-16-1002-ground-at-your-feet.md`.
- **#166 qualified except Carter's yes:** independent review PASS, 0 open (`vr/2026-11-16-1000-review-166.md`;
  review-log `reviews/loop/2026-11-16-vr-height-166-independent-review.md`); GitHub 7/7 green incl. Lighthouse
  (10:03 UTC); local checks re-run green; baseline on `main` and #166 identical; 360/390 px clean.
- **Height check — PR #166** `loop/vr-height` `902e96dc` (on `main` `56d7c9d6`): a posture plaque in the headset
  (STANDING/SEATED, eye height measured or set, a hint if a standing eye height measures under 1.4 m, point-and-tap
  switch inside a dip to dark, choice kept on this device). Leaving VR, the page says the posture and eye height the
  visitor had. Local checks: 9/0/0, 18/18, 51/51, `xr-entry-check` 74/74, baseline identical to `main`. **VR, per
  item.** Reply `vr/2026-11-16-0911-height-check.md`.
- **LIVE 2026-11-16 01:43 UTC:** #161 + #163 merged (Carter: "just merge it", no curtain).
- **G1 Entry — PR #161** `loop/vr-entry` `d9dc9c8f`: "Enter VR" door, hidden unless the browser offers
  immersive-vr; flat museum unchanged (same draws/triangles in Rotunda, ch02, ch03; 0 errors; 34/34 XR checks with
  a stand-in headset). Per item, VR. Recommend it does not go live before G4 (curtain).
- Spec set found staged in `handoff/vr-*.md` (atlas, 2026-11-15 22:25 UTC; `order-2026-11-15-vr-pilot-start.md`),
  not `handoff/vr/`. Next re-planned from it.
- Earlier: loop set up 2026-11-15 (`VR-LOOP.md`, scheduled hourly at :11).

- **G2 Movement — PR #163** `loop/vr-comfort` `fdf3451e` (base `loop/vr-entry`): teleport (gold arc ≤ 8 m, brass
  ring, NO WAY through walls), snap turn 30°, comfort vignette; flat museum unchanged; 48/48 XR checks. Per item, VR.

## In progress
- #169: GitHub checks running (next run reads them; Lighthouse included).

## Next (in order; Carter's live rulings 2026-11-16 first)
1. **React to you** (on #169's branch, stacked): creatures move away from the visitor and never toward them
   (§e.22: nothing startles within 2 m; no fish leap within 2 m); plants part; the water ripples where the visitor
   walks. Flat and VR alike.
   - Alongside: read #169's GitHub checks.
2. **More creatures**: era- and place-true, sourced, for ch02 and ch03 (ch03's marsh has only the heron; its
   tilapia never find deep enough water, as before #169).
3. **Day and weather**: wind, light and weather over time, from what `world.js`/`style.js` already carry.
4. **G3 Frame budget**: Quest 2 72 fps gate per pilot room (with the living ground in it).
5. Controllers + select → plaques (incl. §15 seated re-anchoring of every plaque); audio; performance scope;
   pilot spaces; living-room contract (as before).
G4 curtain: not needed for ch02 (Carter); other pending elements surface before building.
- Independent review of #169 by a run that wrote none of it (this run wrote it).

## Needs Carter
1. Curtain: ANSWERED 2026-11-16 — Egypt stays open in VR (`decisions-2026-11-16-carter-egypt-vr-open.md`).
2. **Height felt too low** (standing). Cause still unknown. **#166 now shows it:** once #166 is live, his next headset
   visit shows STANDING/SEATED and his eye height on a plaque in front of him, and the page repeats it after he leaves.
   **Ready: #166 passed review and every GitHub check.** **Needs Carter: his yes to merge #166, then one headset
   visit to read the number.**
3. **Floor feedback (Carter, live, 2026-11-16 ~02:20 UTC):** "the floor ecosystems are not alive and operating
   autonomously and it should feel as your walking on the ground not just above it. the floor feels like it sits
   above the scenery in the ground." Facts: each room's floor is glass over a living pit (`world.js` BIOME: ground
   0.7–1.0 m below the glass, water ~0.9 m below; plants sway, water ripples, fauna move). In a headset the depth is
   real, so the visitor stands on a glass deck above a diorama. Checked with the stand-in headset: the pits keep
   animating in VR (world clock advances; ch02 pit built and shown), so "not alive" is about how much life there is
   and how it reads, not a frozen loop. **ANSWERED:** ground at your feet, flat and VR alike; more creatures, react
   to you, day and weather (`decisions-2026-11-16-carter-ground-at-your-feet.md`). Each piece still merges per item.
