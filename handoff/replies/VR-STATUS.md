# VR loop STATUS (overwritten every run)

**As of:** 2026-11-16 ~01:50 UTC. **#163 and #161 MERGED to `main`** (`28852e84`, `4cb77979`, 01:43 UTC) by Carter's
account, merge message: Carter's yes 2026-11-16 "just merge it", **no curtain**. Deploy run 286 started 01:43 UTC.
The VR door and movement are on the live site; nothing in VR is curtained yet.

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

## Next (in order; spec wins over VR-LOOP.md Groundwork where they differ)
1. **G3 Frame budget** — `vr-perf-overlay.js` + headset budget report per `vr-performance-budget.md` §1, §2, §7
   (Quest 2: 72 fps, p95 ≤ 13.9 ms; per-room draws/tris/texture MB/lights) for Rotunda, Wing II atrium, ch02, ch03.
2. **G4 Curtain** — answered for ch02 (`decisions-2026-11-15-carter-ch02-vr-curtain.md`: whole room curtained until
   his preview walk) but Carter then merged G1+G2 with "no curtain" (2026-11-16). Build only after he says which stands.
3. **Controllers + select → plaque** (arch §4, §8 steps 8–9) and the plaque-class in-scene text pipeline
   (interaction §4; arch §3.4 / §2.5 scope note).
4. **Audio migration** (arch §3.5, §8 step 10; `vr-audio-brief.md`).
5. **Performance scope items** (arch §8 step 12 a–e: light cut, relic LOD/impostors, portal adjacency, atlases,
   shader warm-up).
6. **Pilot spaces** per `vr-pilot-spec.md` §2–§5 (Wing II atrium, arrival/orientation, honest-evidence markers and
   plaques verbatim, portals with masked transit), several pieces; then the §5 acceptance audit.
   Movement leftovers (fold into 3 and 6): settings stele with smooth movement/turn opt-in and seated/standing
   switch, landing chime, incense-smoke fade, hand pinch, room-scale walking through walls.
7. Living-room contract doc (arch §8 step 11).
Out of scope for this loop: Keeper's Study (never), Keeper's Table except the performative copy if the spec reaches
it, DG-6 radiance tiers, WebGPU tier, Pilgrimage VR, all-rooms waves.

## Needs Carter
1. **Curtain:** your 20:15 ET ruling curtains Egypt in VR until you walk it; at 01:43 UTC you merged the VR door
   live with "no curtain". (a) Egypt stays open in VR — your headset walk now counts as its walkthrough / (b) build
   the curtain next, as ruled. Until answered the loop builds G3 (frame budget), which doesn't depend on it.
2. **Your Quest 2 walk** of the live museum: tell the session what felt wrong (arc, turning, the dip, anything).
