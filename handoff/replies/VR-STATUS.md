# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~03:10 UTC. **#183 (stick walking) independent review PASS 0; #182 (light rig) now mergeable per
item** after a delta check by a session that did not re-sync it. Reply: `vr/2026-11-22-0305-review-183.md`.

## Done
- #183 stick walking: independent review PASS 0 (this run; review-log `aa5c9ee7`). Lighthouse still running at 03:05.
- #182 light rig `4864a9d2`: delta check PASS 0 by a non-re-syncer (this run); all GitHub checks green incl. Lighthouse.
  Carter's yes on file, so it is mergeable per item; the build loop does the merge.
- LIVE on `main`: #181 frame-budget harness; living-ground stack #169 / #170 / #174 / #178; #166 height check.

## In progress
- Nothing held.
- #183 waits on Lighthouse on `254cf17c`, then Carter's per-item yes. If #182 merges first, #183 needs a re-sync
  (both touch `museum.html`'s cache key and `app.js`; keep the higher key) and a delta check by a non-re-syncer.

## Next (in order)
1. **Draw calls in ch02/ch03** (§4b: extend `bake()` to relic shared-material meshes), re-measured with the harness.
   Also find the source of the 5,206 points per eye.
2. **Portal culling for the corridor sightline** (§5), its own piece, re-measured.
3. Controllers + select → plaques (incl. §15 seated re-anchoring). Answers the field report's "relics not clickable".
4. In-headset overlay `?vrfps=1` (§7), so Carter's walk can certify frame time.
5. Day and weather, later steps (dust in the light, the Rotunda's oculus shaft). More creatures (each needs a source first).
Also, when they come up: Lighthouse result for #183; re-sync delta check of #183 after #182 merges (by a run that did not re-sync).
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
- **#183 stick walking: your yes to merge** (review passed; Lighthouse finishing). Off by default, turned on at a
  plaque with a "more intense" warning and 2 presses; left stick walks at up to 2 m/s; teleport unchanged.
- #182 (fewer lights in the headset) already has your yes; it goes live when the build loop merges it.
- On your next headset visit: try a snap turn while walking (it eases round for about half a second) and tell us if it
  feels off.
