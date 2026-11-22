# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~04:10 UTC. **#185 built: fewer headset draw calls** (hall and Rotunda fittings drawn only when
their walls are). ch03 is now within the Quest 2 draw-call ceiling. Reply: `vr/2026-11-22-0410-static-zones.md`.

## Done
- #185 `loop/vr-static-zones` `9fa3237a`: worst-view stereo calls ch02 202–210 → 176–178, ch03 222–224 → 154–156
  (within 160), corridor 270 → 224. All local checks pass; flat museum unchanged.
- Measured: extending `bake()` to relics (old Next 1) would save ~0–2 calls, because relics are already merged per
  material. Dropped from Next.
- Found: the 5,206 points per eye. 70 were the portal (now gone from ch03 and the corridor); 5,136 are the planetarium's
  stars, drawn through the walls from ch03 and the corridor.
- #183 stick walking: independent review PASS 0 (earlier run). #182 light rig: mergeable per item (Carter's yes on file).
- LIVE on `main`: #181 frame-budget harness; living-ground stack #169 / #170 / #174 / #178; #166 height check.

## In progress
- Nothing held.
- #185 waits on GitHub checks incl. Lighthouse, an independent review by a run that wrote none of it, then Carter's yes.
- #183 waits on Lighthouse on `254cf17c`, then Carter's yes.
- #182, #183 and #185 all touch `museum.html`'s cache key (56 / 57 / 58) and `app.js`. Whichever merges later needs a
  re-sync (keep the higher key) and a delta check by a non-re-syncer.

## Next (in order)
1. **Portal culling (§5)**, re-measured with the harness. Hide what walls hide:
   - the planetarium from ch03 and the corridor (5,136 points);
   - the world areas' skies and grounds seen through walls (~50 calls in ch02's worst views);
   - the neighbouring zone shells.
   ch02 is still over the ceiling (176–178) and the corridor is at 224.
2. Independent review of #185 (by a run that wrote none of it).
3. Controllers + select → plaques (incl. §15 seated re-anchoring). Answers the field report's "relics not clickable".
4. In-headset overlay `?vrfps=1` (§7), so Carter's walk can certify frame time.
5. Day and weather, later steps (dust in the light, the Rotunda's oculus shaft). More creatures (each needs a source first).

Also, when they come up: Lighthouse for #183 and #185; re-sync delta checks after merges (by a run that did not re-sync).

Possible later, not built:
- pooled-light reach 22 m → 12 m (§2), waiting on the headset walk;
- one settings stele in the Rotunda holding the posture and walking plaques (also the place for a dominant-hand toggle, §d.16).

G4 curtain: not needed for ch02 (Carter). Other pending elements surface before building.

## Carter's field report (`field-report-2026-11-16-vr-walk.md`), against the VR pilot
- 2 ground below the glass, 3 birds below the glass: **live**.
- 7 trigger instead of analog movement: **#183 reviewed, PASS**. Comes to you for a yes once Lighthouse is green.
- 5 relics not clickable: Next 3 (pilot rooms only).
- 1 hallway walls glitching, 4 multiplayer, 6 portals / arcade door / pilgrimages, 8 sound levels: outside the three
  pilot rooms or not in the pilot spec. Not built by this loop.

## Needs Carter
- **#183 stick walking: your yes to merge** (review passed; Lighthouse finishing).
- #185 (fewer draw calls) will come to you for a yes once it is reviewed and green. Nothing to decide yet.
- #182 (fewer lights in the headset) already has your yes; it goes live when the build loop merges it.
- On your next headset visit: try a snap turn while walking (it eases round for about half a second) and tell us if it
  feels off.
