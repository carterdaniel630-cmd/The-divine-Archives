# VR loop STATUS (overwritten every run)

**As of:** 2026-11-16 ~17:05 UTC. **#170 (react to you) passed independent review** (0 open, all checks green). The
three VR pieces waiting are now all qualified except Carter's yes: **#166 (height check), then #169 (ground at your
feet) and #170 (react to you) together.** The VR door and movement (#161, #163) have been live since 01:43 UTC.

## Done
- **Review of #170 — PASS, 0 open** (16:57 UTC, a run that wrote none of it): `review-log` `44eb55a2`,
  `reviews/loop/2026-11-16-vr-react-170-independent-review.md`. Local re-run green incl. react-check 57 ok; phone
  budget unchanged; merges clean onto `main` `9d35e620`. Note for the headset walk: a cat mid-pounce (0.45 s) does not
  break off if you teleport beside it. Reply `vr/2026-11-16-1657-review-170.md`.
- **Review of #169 — PASS, 0 open** (16:20 UTC, a run that wrote none of it): `review-log` `6503e9df`,
  `reviews/loop/2026-11-16-vr-ground-169-independent-review.md`. Local re-run green; phone budget lighter than #166.
  Note for "More creatures": low flyers and insects in `fauna.js` aim at pit-under-glass heights; re-base them on the
  raised ground before adding any to a pilot room. Reply `vr/2026-11-16-1620-review-169.md`.
- **#170 GitHub 7/7 green incl. Lighthouse** on `fbc0d6f4` (16:05 UTC).
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
- Stack base: #166/#169/#170 were cut from `main` before #164/#165/#167 merged (`main` now `9d35e620`); #170 merges
  clean onto it. Re-sync (merge only) at merge time.

## Next (in order; Carter's live rulings 2026-11-16 first)
1. **More creatures**: era- and place-true, sourced, for ch02 and ch03 (ch03's marsh has only the heron; its tilapia
   never find deep enough water). Each species with a logged source, as `fauna.js` already is; they inherit "React to
   you" (`SHY`). Stacked on #170. Re-base `fauna.js` low-flyer and insect heights on the raised ground first if
   any flyer or insect is added (review-169 note). Animals tied to cult or sacred use (e.g. temple ibis mummies) are
   shown only as living wildlife; anything beyond that surfaces to Carter.
2. **Day and weather**: wind, light and weather over time, from what `world.js`/`style.js` already carry (light and
   shafts first, rain last if ever, per `order-2026-11-15-vr-buildout.md` 5).
3. **G3 Frame budget**: Quest 2 72 fps gate per pilot room (with the living ground in it).
4. Controllers + select → plaques (incl. §15 seated re-anchoring of every plaque); audio; performance scope;
   pilot spaces; living-room contract (as before).
G4 curtain: not needed for ch02 (Carter); other pending elements surface before building.

## Needs Carter
1. Curtain: ANSWERED 2026-11-16 — Egypt stays open in VR (`decisions-2026-11-16-carter-egypt-vr-open.md`).
2. **Height felt too low** (standing). Cause still unknown. **#166 now shows it:** once #166 is live, his next headset
   visit shows STANDING/SEATED and his eye height on a plaque in front of him, and the page repeats it after he leaves.
   **Ready: #166 passed review and every GitHub check.** **Needs Carter: his yes to merge #166, then one headset
   visit to read the number.** #169 + #170 are also ready for his yes (they go live together, after #166).
3. **Floor feedback (Carter, live, 2026-11-16 ~02:20 UTC):** "the floor ecosystems are not alive and operating
   autonomously and it should feel as your walking on the ground not just above it. the floor feels like it sits
   above the scenery in the ground." Facts: each room's floor is glass over a living pit (`world.js` BIOME: ground
   0.7–1.0 m below the glass, water ~0.9 m below; plants sway, water ripples, fauna move). In a headset the depth is
   real, so the visitor stands on a glass deck above a diorama. Checked with the stand-in headset: the pits keep
   animating in VR (world clock advances; ch02 pit built and shown), so "not alive" is about how much life there is
   and how it reads, not a frozen loop. **ANSWERED:** ground at your feet, flat and VR alike; more creatures, react
   to you, day and weather (`decisions-2026-11-16-carter-ground-at-your-feet.md`). Each piece still merges per item. Built so far: ground at your feet (#169), react to you (#170), both reviewed PASS.
