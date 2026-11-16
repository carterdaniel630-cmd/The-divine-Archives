# VR loop STATUS (overwritten every run)

**As of:** 2026-11-16 ~01:50 UTC. **#163 and #161 MERGED to `main`** (`28852e84`, `4cb77979`, 01:43 UTC) by Carter's
account, merge message: Carter's yes 2026-11-16 "just merge it", **no curtain**. Deploy run 286 started 01:43 UTC.
The VR door and movement are on the live site; nothing in VR is curtained yet.
**First real-headset report — Carter, live, 2026-11-16 ~02:00 UTC: "it worked in the headset"** (live site, his
Quest 2). Owner-witness of entry + movement; not yet the pilot §5 per-room certification (fps gate, plaques, etc.).

## Done
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
- (none)

## Next (in order; Carter's live rulings 2026-11-16 first)
1. **Height check** — show the mode (standing/seated) and eye height in the headset and on exit; the
   standing/seated switch (Comfort §d.15). Fixes or explains "too low".
2. **Ground at your feet, pilot rooms** (`decisions-2026-11-16-carter-ground-at-your-feet.md`): ch02 + ch03 (+ their
   corridor) landscape raised to floor level, glass removed, water shallow underfoot; flat and VR alike; phone
   budget held.
3. **React to you** — plants part, water ripples, creatures move away as the visitor walks (never toward: §e.22).
4. **More creatures** — era- and place-true, sourced, for ch02 and ch03.
5. **Day and weather** — wind, light and weather over time, from what `world.js`/`style.js` already carry.
6. **G3 Frame budget** — Quest 2 72 fps gate per pilot room (now with the living ground in it).
7. Controllers + select → plaques; audio; performance scope; pilot spaces; living-room contract (as before).
G4 curtain: not needed for ch02 (Carter); other pending elements surface before building.

## Needs Carter
1. Curtain: ANSWERED 2026-11-16 — Egypt stays open in VR (`decisions-2026-11-16-carter-egypt-vr-open.md`).
2. **Height felt too low** (standing). Asked whether another VR app also feels low: Carter "c" (hasn't tried).
   Cause still unknown (Quest floor setting vs. seated fallback). Next piece shows the mode + eye height and adds
   the standing/seated switch (Comfort §d.15).
3. **Floor feedback (Carter, live, 2026-11-16 ~02:20 UTC):** "the floor ecosystems are not alive and operating
   autonomously and it should feel as your walking on the ground not just above it. the floor feels like it sits
   above the scenery in the ground." Facts: each room's floor is glass over a living pit (`world.js` BIOME: ground
   0.7–1.0 m below the glass, water ~0.9 m below; plants sway, water ripples, fauna move). In a headset the depth is
   real, so the visitor stands on a glass deck above a diorama. Checked with the stand-in headset: the pits keep
   animating in VR (world clock advances; ch02 pit built and shown), so "not alive" is about how much life there is
   and how it reads, not a frozen loop. **ANSWERED:** ground at your feet, flat and VR alike; more creatures, react
   to you, day and weather (`decisions-2026-11-16-carter-ground-at-your-feet.md`). Each piece still merges per item.
