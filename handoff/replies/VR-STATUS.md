# VR loop STATUS (overwritten every run)

**As of:** 2026-11-15 ~23:55 UTC. Run ..01HFWzTkBr97DH9bJRZ5VnYJ built G1 (PR #161). Merged nothing.
Reply: `handoff/replies/vr/2026-11-15-run-2311-g1-entry.md`.

## Done
- **G1 Entry — PR #161** `loop/vr-entry` `d9dc9c8f`: "Enter VR" door, hidden unless the browser offers
  immersive-vr; flat museum unchanged (same draws/triangles in Rotunda, ch02, ch03; 0 errors; 34/34 XR checks with
  a stand-in headset). Per item, VR. Recommend it does not go live before G4 (curtain).
- Spec set found staged in `handoff/vr-*.md` (atlas, 2026-11-15 22:25 UTC; `order-2026-11-15-vr-pilot-start.md`),
  not `handoff/vr/`. Next re-planned from it.
- Earlier: loop set up 2026-11-15 (`VR-LOOP.md`, scheduled hourly at :11).

## In progress
- (none)

## Next (in order; spec wins over VR-LOOP.md Groundwork where they differ)
1. **G2 Comfort & movement** — teleport (trigger-hold arc), snap turn (smooth optional), comfort vignette,
   seated/standing switch and the seated-mode announcement; `collide()` on a vec3 incl. Y (ramps, descent).
   Sources: `vr-comfort-brief.md`, `vr-interaction-spec.md` §2 + Warden plugs, `vr-pilot-spec.md` §3 movement
   table, `vr-architecture.md` §4.2 / §8 step 8. Build on PR #161's branch (stack).
2. **G3 Frame budget** — `vr-perf-overlay.js` + headset budget report per `vr-performance-budget.md` §1, §2, §7
   (Quest 2: 72 fps, p95 ≤ 13.9 ms; per-room draws/tris/texture MB/lights) for Rotunda, Wing II atrium, ch02, ch03.
3. **G4 Curtain** — pending-review rooms/elements behind a true curtain in VR (OQ-4). **Waits on Carter's answer
   below for ch02;** the mechanism can be built either way.
4. **Controllers + select → plaque** (arch §4, §8 steps 8–9) and the plaque-class in-scene text pipeline
   (interaction §4; arch §3.4 / §2.5 scope note).
5. **Audio migration** (arch §3.5, §8 step 10; `vr-audio-brief.md`).
6. **Performance scope items** (arch §8 step 12 a–e: light cut, relic LOD/impostors, portal adjacency, atlases,
   shader warm-up).
7. **Pilot spaces** per `vr-pilot-spec.md` §2–§5 (Wing II atrium, arrival/orientation, honest-evidence markers and
   plaques verbatim, portals with masked transit), several pieces; then the §5 acceptance audit.
8. Living-room contract doc (arch §8 step 11).
Out of scope for this loop: Keeper's Study (never), Keeper's Table except the performative copy if the spec reaches
it, DG-6 radiance tiers, WebGPU tier, Pilgrimage VR, all-rooms waves.

## Needs Carter
1. **PR #161 (Enter VR door): your yes to merge, per item?** Recommend: **(b) hold** until G4 (curtain) is built,
   then merge the VR pieces together — merging the door alone would show rooms under review in a headset, against
   your "curtained till walkthrough" rule. (a) yes now / (b) hold for the pilot stack / (c) no.
2. **Egypt (ch02) is still pending review — so in VR it would be entirely curtained.** (a) curtain the whole Egypt
   room in the public VR until you clear it; you walk it on the preview link, which counts as its walkthrough
   *(recommended)* / (b) show it with "Awaiting review" markers instead, as the older pilot spec had it / (c) clear
   ch02's review first. (Also pending: the Flood and Ark tablets, V89/V90.)
3. When the first walkable pieces are ready: **a Quest 2 check by you** (the floor device; build sessions can't wear
   a headset). Steps will come with it.
