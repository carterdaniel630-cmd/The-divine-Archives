# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~03:00 UTC. **Stick walking built: PR #183** (`loop/vr-stick-walking` `254cf17c`). Off by
default; turned on at a walking plaque with a "more intense" warning and 2 confirmations; left stick walks at up to
2.0 m/s within the comfort limits. Teleport and snap turn are unchanged. Reply: `vr/2026-11-22-0215-stick-walking.md`.

## Done
- Stick walking: PR #183 built (this run). xr-entry-check 104/104, flat museum unchanged.
- #182 light rig: review PASS 0 (run of 2026-11-21 ~22:12, filed on `review-log` `2d08ec5b`; its staging write-back was
  refused, recorded now). Carter's yes is on file. The build loop re-synced it to `4864a9d2`.
- LIVE on `main`: #181 frame-budget harness; living-ground stack #169 / #170 / #174 / #178 (ground at your feet,
  creatures react, more creatures, day and weather); #166 height check.

## In progress
- Nothing held.
- #182 waits on a delta check of `4864a9d2` by a session other than the re-syncer, plus GitHub green incl. Lighthouse.
  Then it is merged per item (yes on file).

## Next (in order)
1. **Independent review of #183** (stick walking), by a run that wrote none of it, plus GitHub green incl. Lighthouse.
   Also, if the build loop has not yet done it: the **delta check of #182 `4864a9d2`** (this run wrote none of it).
2. **Draw calls in ch02/ch03** (§4b: extend `bake()` to relic shared-material meshes), then **portal culling for the
   corridor sightline** (§5). Each is its own piece and is re-measured with the harness. Also find the source of the
   5,206 points per eye.
3. Controllers + select → plaques (incl. §15 seated re-anchoring). This answers the field report's "relics not
   clickable" for the pilot rooms.
4. In-headset overlay `?vrfps=1` (§7), so Carter's walk can certify frame time.
5. Day and weather, later steps (dust in the light, the Rotunda's oculus shaft). More creatures (each needs a source
   first).
Possible later, not built:
- pooled-light reach 22 m → 12 m (§2), waiting on the headset walk;
- one settings stele in the Rotunda holding the posture and walking plaques.
G4 curtain: not needed for ch02 (Carter). Other pending elements surface before building.

## Carter's field report (`field-report-2026-11-16-vr-walk.md`), against the VR pilot
- 2 ground below the glass, 3 birds below the glass: **live** (stack merged 2026-11-21).
- 7 trigger instead of analog movement: **built as #183** (stick walking, opt-in). It goes to you once reviewed.
- 5 relics not clickable: Next 3 (pilot rooms only).
- 1 hallway walls glitching, 4 multiplayer, 6 portals / arcade door / pilgrimages, 8 sound levels: outside the three
  pilot rooms or not in the pilot spec. Not built by this loop.

## Needs Carter
- Nothing right now. #183 (stick walking) comes to you for a yes once its independent review passes.
- #182 (fewer lights in the headset) already has your yes; it goes live once its last checks pass.
- On your next headset visit: the plaque beside the STANDING/SEATED one turns stick walking on (3 presses), and the
  posture plaque still shows your eye height.
