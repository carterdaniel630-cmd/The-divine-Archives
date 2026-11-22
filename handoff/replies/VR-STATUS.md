# VR loop STATUS (overwritten every run)

**As of:** 2026-11-22 ~08:40 UTC. **#187 built: portal culling in the headset** (the museum stops drawing what the
walls hide). With #185 as well, ch02 and ch03 are both within the Quest 2 draw-call ceiling. Reply:
`vr/2026-11-22-0715-portal-cull.md`.

## Done
- #187 `loop/vr-portal-cull` `758056a4` (on `main` `a2a6aa4b`): worst-view stereo calls ch02 202–214 → 180, ch03
  222–224 → 176–188, corridor 270 → 248; with #185: ch02 128–148, ch03 102–114, corridor 200. Stars drawn through walls
  gone (5,206 → 162 points/eye). New check `tools/xr-portal-check.js` (31.5 million rays, 0 misses). All local checks pass; flat museum unchanged.
- #185 `loop/vr-static-zones` `9fa3237a`: built earlier (hall and Rotunda fittings in their zones).
- LIVE on `main`: #183 stick walking, #182 light rig, #181 harness, living-ground stack, #166 height check.

## In progress
- Nothing held.
- #187 waits on GitHub checks incl. Lighthouse, an independent review, a re-sync onto `main` `fa9e526d` (merges
  cleanly), then Carter's yes.
- #185 waits on GitHub checks incl. Lighthouse, an independent review, a re-sync (its base is older), then Carter's yes.
- #185 and #187 both change `museum.html`'s cache key (58 / 59) and `app.js`: whichever merges second needs a re-sync
  (keep the higher key) and a delta check by a run that did not re-sync.

## Next (in order)
1. Independent review of #185 (by a run that wrote none of it — any VR run from now on qualifies).
2. Independent review of #187 (by a run that wrote none of it — not session ..01HFWzTokzHbSKugTSibhBDx).
3. Controllers + select → plaques (incl. §15 seated re-anchoring). Answers the field report's "relics not clickable".
4. In-headset overlay `?vrfps=1` (§7), so Carter's walk can certify frame time.
5. The Wing II corridor: triangles ~736k (over the hard line) and calls 200 even with #185 + #187. Measure what the
   corridor draws (likely the two rooms' relics seen through their doors) before choosing a fix (§4a LOD).
6. Day and weather, later steps (dust in the light, the Rotunda's oculus shaft). More creatures (each needs a source first).

Possible later, not built:
- pooled-light reach 22 m → 12 m (§2), waiting on the headset walk;
- one settings stele in the Rotunda holding the posture and walking plaques (also a dominant-hand toggle, §d.16).

G4 curtain: not needed for ch02 (Carter). Other pending elements surface before building.

Note for runs: commit with one plain `git commit -F <file>`, no `--amend`, no model names — the 03:11Z run lost this
whole piece when its commits were refused.

## Carter's field report (`field-report-2026-11-16-vr-walk.md`), against the VR pilot
- 2 ground below the glass, 3 birds below the glass, 7 analog stick walking: **live**.
- 5 relics not clickable: Next 3 (pilot rooms only).
- 1 hallway walls glitching, 4 multiplayer, 6 portals / arcade door / pilgrimages, 8 sound levels: outside the three
  pilot rooms or not in the pilot spec. Not built by this loop.

## Needs Carter
- Nothing to decide yet. #185 and #187 (fewer things drawn in the headset) will come to you for a yes each once
  reviewed and green.
- On your next headset visit: try a snap turn while walking (it eases round for about half a second) and tell us if it
  feels off; and say if anything ever "pops in" as you walk through a doorway (that would be the new culling).
