# VR loop STATUS (overwritten every run)

**As of:** 2026-11-16 ~15:50 UTC. **PR #170 (the ground reacts to you) built and open**, stacked on #169 (ground at
your feet), stacked on #166 (height check). **#166 is ready for Carter's yes** (review PASS, GitHub 7/7 green incl.
Lighthouse). #169 is GitHub-green and needs an independent review. The VR door and movement (#161, #163) have been live
since 01:43 UTC.

## Done
- **React to you — PR #170** `loop/vr-react` `fbc0d6f4` (on #169): in ch02, ch03 and the Bronze Age corridor the
  creatures keep their distance (turn away and walk off inside 2.5 m, never toward you; no fish leap within 3 m),
  plants within 0.85 m lean away (fading in after a teleport), and walking through the water leaves rings. Flat and
  VR alike; other rooms unchanged. Local checks pass; new `tools/react-check.js` all pass; phone baseline within
  noise. **VR, per item.** Reply `vr/2026-11-16-1550-react-to-you.md`.
- **#169 GitHub 7/7 green incl. Lighthouse** on `5067bc74` (11:05 UTC).
- **Ground at your feet — PR #169** `loop/vr-ground` `5067bc74` (on #166): no glass in ch02, ch03 and the corridor;
  land at the floor, water 6 cm below, beds ≤ 0.30 m. **VR, per item.** Should go live together with #170.
  Reply `vr/2026-11-16-1002-ground-at-your-feet.md`.
- **#166 qualified except Carter's yes:** review PASS 0 open; GitHub 7/7 green incl. Lighthouse; local checks green.
  Height check: STANDING/SEATED and eye height on a plaque in the headset. Replies `vr/2026-11-16-0911-height-check.md`,
  `vr/2026-11-16-1000-review-166.md`.
- **LIVE 2026-11-16 01:43 UTC:** #161 (Enter VR door) + #163 (teleport, snap turn, vignette) merged (Carter: "just
  merge it", no curtain).
- Spec set is staged in `handoff/vr-*.md` (atlas, 2026-11-15), not `handoff/vr/`; Next was re-planned from it.

## In progress
- #170: GitHub checks running (next run reads them, Lighthouse included).
- Stack base: #166/#169/#170 were cut from `main` before #164/#165/#167 merged (`main` now `39a947b8`); #170 merges
  clean onto it. Re-sync (merge only) at merge time.

## Next (in order; Carter's live rulings 2026-11-16 first)
1. **Independent reviews of #169 and #170** (any VR run that wrote none of them; the 15:50 run wrote #170, the 10:02
   run wrote #169), filed on `review-log`; and read #170's GitHub checks.
2. **More creatures**: era- and place-true, sourced, for ch02 and ch03 (ch03's marsh has only the heron; its tilapia
   never find deep enough water). Each species with a logged source, as `fauna.js` already is; they inherit "React to
   you" (`SHY`). Stacked on #170.
3. **Day and weather**: wind, light and weather over time, from what `world.js`/`style.js` already carry (light and
   shafts first, rain last if ever, per `order-2026-11-15-vr-buildout.md` 5).
4. **G3 Frame budget**: Quest 2 72 fps gate per pilot room (with the living ground in it).
5. Controllers + select → plaques (incl. §15 seated re-anchoring of every plaque); audio; performance scope;
   pilot spaces; living-room contract (as before).
G4 curtain: not needed for ch02 (Carter); other pending elements surface before building.

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
   to you, day and weather (`decisions-2026-11-16-carter-ground-at-your-feet.md`). Each piece still merges per item. Built so far: ground at your feet (#169), react to you (#170).
