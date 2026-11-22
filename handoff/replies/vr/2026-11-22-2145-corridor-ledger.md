# VR loop run 2026-11-22 ~21:30–21:50 UTC: Wing II corridor draw ledger (PR #190)

**Built:** `tools/vr-draw-ledger.js` and its first report, `audits/vr-draw-ledger/2026-11-22-corridor.md` (+ JSON).
PR #190, `loop/vr-corridor-measure` `4436c5d0`, on `main` `1cfb8d9f`. No site change.

**Why:** VR-STATUS Next 3: "measure what the corridor draws, which meshes, per view, before choosing a fix". #188 is
not on `main` yet, so Next 1 (re-sync #189) was not due.

**Finding (measured):**
- At the corridor's worst heading (736,156 triangles, 192 calls), **90% of the triangles (661,520) are the living
  ground under the glass**: ch03 203k, the Spine 200k, ch02 167k, the corridor's own 92k. Relics and shell are about 50k.
- The plants and creatures are created with `frustumCulled = false` (`world.js` 781; `fauna.js` 165, 288, 330, 423),
  so about 504k triangles are drawn at every heading, even facing away.
- The Spine's ground is one 155 m strip (culling sphere radius 77 m).
- Portal culling (#187) works as designed: every ground drawn is in a cell seen through a door.
- §4a relic LOD would not fix this; the relics are a small share.

**Estimates (not measured), for the next pieces:** (1) culling bounds for plants and creatures, invisible; (2) cut the
Spine's ground into ~10 m pieces, invisible; (3) a distant tier for the ground in the headset, which changes the look
at a distance, so it is an artistry question for Carter. Together, 1 and 2 probably still leave the worst view over 500k.

**Checks:**
- Ledger totals equal the renderer's counters at all eight headings; 0 script errors.
- Full build order: no diff.
- verify: 18/18.
- Tests: 51/51.
- review-checks `--base origin/main --build`: 9/0/0.
- `xr-entry-check.js`: all pass.
- `museum-baseline.js`: 0 errors.
- graphify: CLI installed by `tools/graphify-session.sh`; `graphify update .` run before work.

**Merged:** nothing.
