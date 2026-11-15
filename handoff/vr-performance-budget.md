# VR Performance Budget — The Divine Archives Museum (dual-mode: flat-screen + WebXR)

**Author:** Performance Sculptor (VR team) · 2026-10-12
**Status:** SPEC ONLY — for Craft Council lenses → High Council → Claude Code implementation
**Target hardware (religion):** phone-class standalone. PRIMARY: Quest 3 (Snapdragon XR2 Gen 2, ~2× XR2 Gen 1 GPU, 8 GB RAM, 2064×2208 per eye, 72/90/120 Hz). FLOOR: Quest 2 (XR2 Gen 1, 6 GB, 1832×1920 per eye, 72/90 Hz) must stay usable. **Never spec anything needing high-end PCVR.**
**Grounded in:** `docs/museum/app.js` (114 KB), `world.js`, `relics.js` (161 KB, 40+ CAT builders), `manifest.json` (83 rooms, 10 zones), `wings/*.json`, existing `docs/assets/fps-overlay.js`. Meta published guidance: Quest 2/Pro 750k–1M tris/frame, Quest 3/3S 1.3M–1.8M tris/frame (per-frame totals).
**Standards:** Artistry Standard (5 params) + Modular Framework Standard (8 clauses; clause 4 extended to XR below).

---

## 1. Frame budget table (stereo)

72 fps = **13.9 ms**/frame. 90 fps = **11.1 ms**/frame. Certification target: **locked 72 fps on both tiers**; 90 fps is a Quest 3 stretch goal only. 120 Hz is out of scope — never target it.

| Slice | 72 fps Quest 3 (13.9 ms) | 90 fps Quest 3 (11.1 ms) | 72 fps Quest 2 floor (13.9 ms) |
|---|---|---|---|
| App JS (scene update, input, controllers, LOD logic) | ≤ 2.5 ms | ≤ 2.0 ms | ≤ 2.0 ms |
| Culling / visibility traversal (portal + frustum, per eye amortized) | ≤ 1.5 ms | ≤ 1.0 ms | ≤ 1.5 ms |
| Driver / submit / compositor reserve (multiview, MSAA resolve, tracking) | ≤ 2.5 ms | ≤ 2.0 ms | ≤ 3.0 ms (slower driver) |
| **GPU render, both eyes** | **≤ 6.5 ms** | **≤ 5.0 ms** | **≤ 5.5 ms** |
| Unallocated headroom (thermal, GC, hitch absorption) | ~0.9 ms | ~1.1 ms | ~2.0 ms |

Rules:
- The budget is measured **in-headset, immersive session** (inline preview numbers do not certify).
- p95 frame time must sit inside the row above; p99 may exceed only during zone swaps (see §5, capped at 3 consecutive frames).
- The current flat-screen loop uses `requestAnimationFrame(tick)` with `renderer.render(scene, camera)`. **XR requires `renderer.setAnimationLoop()`** — rAF is throttled inside immersive sessions. Dual-mode: one loop function, `renderer.xr.enabled` toggles the path.
- WebXR ignores `renderer.setPixelRatio`. Control resolution with `renderer.xr.setFramebufferScaleFactor()`: **1.0 on Quest 3, 0.8 on Quest 2** (a ~36% pixel cut, the single biggest Quest 2 lever). Clause 4's "DPR ≤ 1.0 on mobile" maps to: XR render scale ≤ 1.0, never above.

## 2. Per-room ceilings (visible per frame, stereo)

"Per-eye draw calls" = meshes rendered in one eye pass. Stereo doubles the submitted calls (multiview amortizes some vertex cost, not fragment). Budgets are stated stereo-submitted, the number the driver actually eats.

| Metric | Quest 3 (72 fps) | Quest 2 floor | Hard fail (either tier) |
|---|---|---|---|
| Draw calls, stereo-submitted, visible | ≤ 240 (≈120/eye) | ≤ 160 (≈80/eye) | > 320 |
| Triangles, visible per frame | ≤ 600k | ≤ 350k | > 800k (Q3) / > 500k (Q2) |
| Texture memory, resident session | ≤ 256 MB | ≤ 128 MB | — |
| Texture memory, per room | ≤ 24 MB | ≤ 16 MB | > 40 MB |
| Active forward lights (fragment-evaluated) | ≤ 6 | ≤ 5 | > 8 |
| Real-time shadow-casting lights | **0** (baked only) | **0** | ≥ 1 per frame |
| MSAA | 4× (keep; budget it, don't fight it) | mitigate via 0.8 render scale + foveation 1.0 | — |
| Particle points on screen | ≤ 8k | ≤ 4k | > 15k |
| Canvas textures per room | ≤ 20 | ≤ 14 | > 28 |

Current-state estimate (grounded): a dense room today carries ~12 baked merged meshes (the existing `bake()` merges the 12 shared MATs: wood, bronze, glass, stone, darkstone, parch, leather, gold, clay, bone, linen, verdigris) + ~14–20 unmerged textured statics (door sign, lectern page, plate, see-also/living boards, kiosk, medallions × figs) + vault cases each containing a `buildRelic()` output of ~5–25 unmerged meshes (99 `mesh()` calls across ~40 CAT builders; complex ones like `v53` Rosetta or lathes at 96 segments run to tens of thousands of tris each). **Worst-case room today ≈ 150–300 draw calls resident, 200–500k tris when fully built** — inside Quest 3 budget only because `bake()` exists, **over Quest 2 budget as drawn**. The lights are the larger problem (§8).

Material/shader rules:
- Forward renderer only. No post-processing in XR (no bloom, no SSAO, no tone-map passes — ACESFilmic on the renderer is fine, it's per-frame cheap; added render targets are not).
- **Zero real-time shadow maps.** The repo currently has `castShadow` flags set in relics/world but `renderer.shadowMap.enabled` is never turned on — i.e. shadows cost nothing today and the v88 rendition spotlight's "drawn once" shadow (`autoUpdate=false`) is dead code. Keep it that way: all shadowing becomes **baked lightmaps / painted light** (the existing glow-Points + flame flicker language already does this aesthetically).
- Light cap enforcement: the scene today always carries 1 Ambient + 2 Hemisphere + 1 flashlight + 1 lantern + 4 pooled PointLights = 9 lights, plus the v88 SpotLight. **Cut to the §2 table's per-tier caps — ≤ 5 fragment-evaluated lights on the Quest 2 floor tier, ≤ 6 on Quest 3** *(settled 2026-11-01, AM-PER-01: this narrative and §8's rule 1 formerly said "six" flatly while the §2 table said ≤ 5 for Quest 2; the tier table governs — the floor-tier rig is 1 Ambient + 1 Hemisphere + 1 lantern + **2** pooled Points; Quest 3 may carry the third pooled Point)*: 1 Ambient + 1 Hemisphere + 1 lantern + 3 pooled Points (Quest 3) / 2 pooled Points (Quest 2). Delete the second Hemisphere (merge its contribution into the first), and remove `flashLight` from the scene graph when intensity is 0 (an intensity-0 light still costs a shader uniform slot and per-fragment evaluation in three.js). Lightning flash becomes an emissive pulse on the skylight material instead.
- The v88 rendition SpotLight: **bake its shadow once at build time into a CanvasTexture lightmap on the niche back wall, then delete the light.** Never leave a shadow-casting light in the resident set.
- Point-light distance/decay: keep pooled lights' distance ≤ 12 m (today 22 m) to bound the fragment sphere; rely on the lamp glow Points for the far-field warmth.
- Materials: prefer MeshLambertMaterial for any surface that doesn't need the Artistry Standard's roughness/metalness/normal-map treatment; reserve MeshStandardMaterial/MeshPhysicalMaterial for hero surfaces. (The 2 existing MeshPhysicalMaterial uses in relics.js must be per-relic, never per-room-shared.)

## 3. Foveated rendering (three.js r186)

- API: `renderer.xr.setFoveation(0..1)` — fixed foveation on the XRWebGLLayer, supported by the Quest browser.
- **Verdict: FIXED foveation, set once per session. Dynamic foveation is rejected** — Quest 2, Quest 3, and Quest 3S have no eye tracking, so gaze-contingent foveation is impossible on the target hardware; a dynamic system with no gaze signal is just a worse fixed system with extra code.
- Recommended levels: **Quest 3: 0.75. Quest 2: 1.0 (maximum).**
- Rationale: at 2064×2208/eye, ~45% of shading cost sits outside the central 20° where pancake-lens resolution already falls off; 0.75 recovers ~2 ms GPU on Quest 3 with no perceptible center loss. On Quest 2, max foveation is required to hold 72 fps at 0.8 render scale — center fidelity is untouched, which is where the relics are inspected.
- Gate: foveation level is a per-tier constant, not a dynamic perf knob. Do not modulate it at runtime (visible swimming at the foveation boundary is worse than a dropped frame elsewhere).

## 4. LOD chains

### 4a. Per-relic LOD (relics.js CAT builders)
The existing `QS` quality hook (`buildRelic(id, env, q)` → `QS = 0.5` in cases, `1` in the inspector) becomes a real 3-tier LOD:

| Tier | Distance (visitor → case) | Geometry | Textures (QS) |
|---|---|---|---|
| L0 inspect | < 2.5 m (inspector open) | full: current builder output | 1.0 |
| L1 case | 2.5–10 m | builder with segment counts halved (lathe 96→48, sphere 24×18→16×12, torus tubular 96→48, extrude curveSegments 6→3) | 0.5 |
| L2 distant | > 10 m (room visible through door) | silhouette impostor: bounding-box extrude or single baked mesh ≤ 800 tris, shared MAT only | n/a (no canvas textures) |

- Thresholds are per-relic, evaluated in the existing per-frame `buildQueuedRelic` pass (already budgeted: one relic build per frame — keep that).
- L2 impostors must be **generated at build time from the L1 mesh** (project silhouette → Shape → ExtrudeGeometry, or worst case a textured box), never shipped as separate hand assets.

### 4b. HLOD for room shells
- Zone shells (walls, floors, ceilings from `world.js` rect/wall strips) merge per zone into **≤ 5 draw calls** (one per surface MAT: floor, wall, ceiling, trim, glass). Walls are long PlaneGeometry strips — trivially merged, near-zero tri cost.
- Room exhibit groups keep the existing `bake(room)` merge (12 shared MATs → ~12 calls), **extended to also merge each relic's shared-MAT meshes into the same buckets** where materials match, cutting the unmerged relic tail.

### 4c. Manifest-level LOD metadata (schema addition, backward compatible)
Add optional `perf` block to `wings/*.json` room entries and vault items. Absence = current defaults (safe):

```json
"perf": {
  "lodDist": [2.5, 10],
  "triCap": 40000,
  "texCap": 6,
  "impostor": true,
  "lightBudget": 0
}
```

- Room-level: `"perf": { "lodDist": [2.5, 10], "maxRelicTris": 40000, "maxCanvasTex": 14 }`.
- Vault-item-level: `"perf": { "impostor": true, "triCap": 40000 }` for the vault's `prop` items and the 40 CAT relics when they land in the 10 living exhibits. *(Count note, 2026-11-01, AM-PER-04: this section formerly read "the 86 `prop` items" against the pilot spec's "all 88" — an unreconciled pair. The governing count is the Directory's at build time: 88 vault entries, 87 showing (V68 withdrawn); `perf` blocks are written for every showing prop item. The bare "86" is struck.)*
- Loader rule: unknown keys are ignored by the current flat-screen builder — **zero breaking change**; the XR path reads them when present.

## 5. Occlusion / visibility — 83 rooms, only N resident

Current system (grounded): zones build exhibits within BUILD_NEAR=14 m of the zone box, drop beyond DROP_FAR=48 m (with geometry + non-shared material disposal — real teardown), exhibit groups toggle visibility within SHOW_FAR=36 m, room fittings within 10 m, signs within 26 m. This is distance-tiered, not portal-aware.

**Verdict: manual portal culling, NOT GPU occlusion queries.** Reasons: (1) tile-based Adreno GPUs resolve occlusion queries late — the query result arrives after the frame that needed it, causing a frame of lag or a wasted stall; (2) three.js r186 exposes no occlusion-query API; hand-rolling one is a new exfiltration-free but high-risk code path; (3) the museum's topology is a known graph — doors between rooms are explicit in the layout (ROOM_W/ROOM_D/DOOR_W constants), so portals are computable from data, deterministic, and debuggable.

Portal strategy:
- Resident set = **current room + portal-adjacent rooms (1 ring) + the corridor/hall/spine segment the visitor stands in**. Everything else: exhibit groups detached (kept in memory if < 48 m per existing DROP_FAR tier, fully dropped + disposed beyond).
- Implementation: derive the adjacency graph at build time from room bounds + door gaps (each room's doorway rect is already computed for `hole`). Store as `S.portals: Map<roomId, roomId[]>` in the manifest build step (`build-museum.js`), not hand-authored.
- Per-frame cost cap: portal traversal is a BFS over ≤ 12 nodes — negligible; it replaces nothing, it **narrows** the existing distance tiers (a room 20 m away through two walls no longer builds exhibits even though it's within BUILD_NEAR).
- Expected resident set in practice: 1 room (full) + 1–2 adjacent rooms (exhibits, L1/L2) + corridor shells ≈ **≤ 3 rooms of content resident**. **Corrected 2026-11-01 (AM-PER-02):** an earlier draft claimed resident totals of "≤ 480 draw calls Quest 3 / ≤ 320 Quest 2 — inside the §2 ceilings with margin." That sentence was arithmetically false (480 exceeds both the ≤ 240 ceiling and the > 320 hard fail; 320 sits exactly on the Quest 2 hard-fail line) and is struck. The rule that governs: **§2's ceilings bind VISIBLE per-frame counts**, and compliance is never asserted from resident totals — it is **measured per §7 through the worst portal sightlines** (including the Wing II atrium's views into both pilot rooms). Resident totals are reported with the build for information; the certificate is the measured visible count.

Wing-transition loading protocol (hitch-free swaps):
1. Trigger: visitor crosses a wing threshold (portal graph edge between wings).
2. `mu-fade` overlay on (existing DOM fade, ~250 ms to full mask) — the transition is **masked, never a hitch the visitor sees**. **Mask specification (settled 2026-11-01, AM-PER-03):** the fade reaches full mask in ~250 ms and then **holds for as long as the masked work takes, up to the 400 ms budget** — the mask is never shorter than the work it covers. If the work cannot complete inside 400 ms, the visitor waits in the labelled, lit holding state (aligned loading law, below) — the fade never lifts early onto unfinished work, and post-fade streaming (step 4) covers relics only, not building or shader compilation, which must complete inside the mask.
3. During fade: fetch next wing JSON (already cached by `loadDetail` prefetch at 30 m), `buildWingExhibits(next)`, compile all new shader programs **synchronously** (no lazy compile in XR — a mid-frame compile is a 50–200 ms stall), then `dropWing(prev)` with full disposal.
4. Post-fade: `buildQueuedRelic` streams relics one-per-frame as today; each relic appears with the existing glow fade, never a pop.
5. Budget: total masked work ≤ 400 ms; **zero frames > 20 ms after fade-off**. The perf gate (§7) measures this explicitly.

## 6. Texture discipline

Grounded: the museum ships **zero raster image assets** — every texture is a procedural `CanvasTexture` (`textTex` for signs/boards, `svgTex` for plates/medallions, canvas-generated surface/grain/normal maps in relics.js). This is a gift; protect it.

- **KTX2/Basis verdict: do not build a KTX2 pipeline.** Decoder cost (WASM transcode ~50–150 ms per texture, worker thread, extra ~300 KB WASM payload) buys nothing while the texture set is 100% procedural canvas output. **If and only if raster/photo assets arrive** (living-exhibit photography, scanned manuscripts), they ship as **KTX2 / Basis Universal ETC1S** (not PNG/JPG — memory, not download, is the constraint: ETC1S ≈ 0.5 byte/px vs 4 byte/px RGBA), transcoded once at zone build, with the transcode budgeted inside the §5 fade window.
- Atlas rules: signs/boards sharing a room **must** share one canvas atlas per room (door sign + lectern page + see-also + living board → 1 × 1024×1024 atlas, ≤ 4 MB) instead of today's 4–6 separate canvases. Medallion `svgTex` (256 px) batch per wing into a 2048² atlas (64 medallions/atlas) — the 199 Pantheon figures across 83 rooms otherwise become ~199 separate 256² textures ≈ 50 MB + 199 bind state changes.
- Mipmaps: keep (default on) — no shimmer on angled wall boards. **Anisotropy cap: 4** (today's svgTex value; correct). Never 8/16 on standalone.
- Canvas 2D generation is main-thread: cap sign canvas at 640 px wide, plate at 512 px (today's values are already right), and **generate during the §5 fade or the relicQ idle stream — never on the frame the room becomes visible**. **One named exception (cleanup 2026-11-01 — Artisan): the Unas spell wall is NOT under the 640/512 caps.** Its glyph-accurate signs are budgeted for close reading (pilot spec §5 criterion 9's worst-lit test applies to it by name); its canvas resolution is set by that legibility test, and its full texture cost is charged against Egypt's per-room texture budget (≤ 16 MB on the floor tier) — the exception buys resolution with the room's own budget, never with a bigger one.
- Per-wing texture atlas budget: ≤ 64 MB (Q3) / ≤ 32 MB (Q2), measured as `w*h*4*1.33` (mipmaps) summed over resident textures.

## 7. Measurement protocol — extending fps-overlay.js

The existing `docs/assets/fps-overlay.js` counts rAF frames behind `?fps=1` for the flat-screen games. The VR extension is a **separate module, `docs/assets/vr-perf-overlay.js`**, sharing the query-param convention (`?vrfps=1`) but stereo-aware:

Log per second (and expose on `window.__vrfps` for `tools/perf-baseline.js`):
- `frameMs`: p50/p95/worst over the window, from `renderer.xr` session `requestAnimationFrame` timestamps (XR rAF timestamps are the compositor's — the honest numbers).
- `drawCalls`: `renderer.info.render.calls` sampled after `renderer.render` in the XR loop = stereo-submitted calls (both eyes).
- `triangles`: `renderer.info.render.triangles` likewise.
- `textureMemMB`: `renderer.info.memory.textures` count × estimated bytes (track w/h/format at creation in a debug registry — three.js doesn't report bytes; the overlay keeps its own ledger, consistent with Modular Framework clause 6).
- `programs`: `renderer.info.programs.length` — must stabilize after warmup (a growing number = lazy compile leak).
- `mode`: `inline` vs `immersive`, `foveation`, `framebufferScale`, device tier (Quest 2/3 via UA + `XRSession` limits).

**VR perf gate checklist** (Claude Code runs per room, in-headset on the Quest 2 floor device — the Quest 3 passing does not certify the Quest 2):
- [ ] p95 frameMs ≤ 13.9 ms over a 60 s walkthrough (enter room, inspect nearest relic, turn 360°, exit).
- [ ] Stereo draw calls ≤ 240 (Q3) / ≤ 160 (Q2); triangles ≤ 600k / ≤ 350k.
- [ ] **Active forward lights ≤ 6 (Q3) / ≤ 5 (Q2), counted in the scene graph** *(added 2026-11-01, AM-PER-01 — the gate previously had no light-count line, so the §2 cap could be missed without failing anything)*.
- [ ] Zero frames > 20 ms after the entry fade completes (no lazy shader compiles, no texture uploads — warmup pass mandatory).
- [ ] Wing transition: zero frames > 20 ms after fade-off; masked build ≤ 400 ms.
- [ ] `webglcontextlost` → the Modular Framework clause-4 message appears (never a dead loop); `webglcontextrestored` → session re-enters cleanly or prompts re-entry.
- [ ] Texture ledger: room ≤ 24 MB (Q3) / ≤ 16 MB (Q2); no texture created per frame (steady-state `memory.textures` flat).
- [ ] Controllers: 2 controller models + 1 ray each, ≤ 6 draw calls total, no per-frame allocation in the input path.

## 8. Phone-class philosophy — the miser's rules

Constraint is not the enemy of the Artistry Standard; it is its enforcer. A 13.9 ms frame on XR2 silicon is a chisel: it removes everything that isn't the relic, the light on it, and the dark around it — which is exactly the chiaroscuro the standard demands. Beauty here is not more polygons; it is **fewer, better-chosen polygons under light that was placed, not computed**.

The miser's rules of thumb (for Claude Code, for the councils, for Carter):
1. **Every light is a tax on every pixel.** Per-tier caps (§2): **five lights maximum on the Quest 2 floor tier, six on Quest 3** *(settled 2026-11-01, AM-PER-01 — this rule formerly read "six maximum" flatly, against §2's own table)*. If you want one more, delete one — or bake it.
2. **Draw calls are rent; triangles are cheap.** 300 draw calls of 500 tris will miss the frame that 50 draw calls of 200k tris make. Merge first, decimate second.
3. **Never pay per-frame for what you can pay once.** Shadows, lightmaps, canvas text, impostors — build-time costs are free at runtime. The `bake()` function already knows this; extend its jurisdiction.
4. **The periphery is a rumor.** Foveation 1.0 on the floor tier: spend pixels where the eye is, suggestion where it isn't. Pancake lenses already blur the edge — meet them halfway.
5. **Hitches are the only unforgivable sin.** A steady 72 fps with simpler relics beats a 90 fps average with 200 ms zone-load stalls. Mask, stream, compile early — one relic per frame, forever.
6. **Measure in the headset or it didn't happen.** Desktop Chrome numbers are fiction. The Quest 2 is the truth-teller; the Quest 3 is the reward.

### The 10 living exhibits (not yet integrated)
Each living exhibit (Ur, Antikythera, Senet, Hnefatafl, Oracle Bones, Library Rescue, Astrolabe, Alchemist, Mehen, I Ching) arrives as a self-contained module and receives its **own §2 micro-budget**: ≤ 60 stereo draw calls, ≤ 150k tris, ≤ 32 MB textures, 0 real-time lights of its own (it borrows the room's pooled lights). They mount inside the resident-room budget of §5 — if a room + its living exhibit exceeds the Quest 2 ceiling, the exhibit drops to L2 impostor until the visitor approaches within 4 m. Their integration payloads must include a `perf` block per §4c or they don't ship.

---

## Appendix: biggest risks found in current code (for the councils)

1. **Fragment-shader light load (P0).** 9–10 always-on forward lights (Ambient + 2 Hemisphere + flashlight + lantern + 4 pooled Points + v88 SpotLight) evaluated per fragment per eye under MeshStandardMaterial. On Quest 2 at 1832×1920×2 with 4× MSAA this is the most likely single cause of a missed 72 fps. Fix: cap per tier — ≤ 5 on Quest 2, ≤ 6 on Quest 3 (§2).
2. **Unmerged relic draw calls.** `bake()` merges only the 12 shared MATs; the 40+ CAT relic builders emit 5–25 meshes each with unique materials (incl. 2 MeshPhysicalMaterial), none merged, none LOD'd. A 6-case room can carry 150+ relic draw calls. Fix: extend `bake()` to relic shared-MAT meshes + per-relic LOD tiers (§4a).
3. **Centimeter-scale over-tessellation.** LatheGeometry at 96 segments, Spheres at 24×18, Cylinders at 96 — on ornaments a few cm across. Invisible at 2 m, expensive at 0.5 m. Fix: L1 tier halves segments (§4a); silhouette check per builder.
4. **Resolution control doesn't exist for XR yet.** `setPixelRatio(min(dpr, 1.5 touch))` is ignored by WebXR; without `setFramebufferScaleFactor(0.8)` the Quest 2 renders full 1832×1920×2×4MSAA. Fix: explicit per-tier scale (§1).
5. **No portal culling.** Distance tiers (14/36/48 m) build exhibits through walls; the rotunda can hold many zones' exhibits simultaneously. Fix: portal adjacency graph (§5).

---

## ALIGNED 2026-11-01 — Every-Screen tiers and the loading law

*Appended on the program's reopening. Full gap map: `../files/vr-standards-alignment-2026-11-01.md` §§3, 6.*

**This budget IS the Every-Screen weight ladder, named as such** (Carter's Every-Screen rule, 2026-10-31: weight adjusts to the device; a simple backup always exists):

| Every-Screen tier | This program's form |
|---|---|
| Rich version (strong device) | Quest 3 ceilings (§2), WebGPU flat tier (Phase 2B) |
| Standard | Quest 2 floor ceilings (§2) — the certifying tier |
| Lighter version, same content | Flat museum at capped DPR with LOD tiers (§4) |
| Simple backup, always exists | The flat text Directory — flat, readable, complete; never a black screen, never a dead page |

The §7 perf gate gains one Every-Screen line per room: the room's content must be reachable from the Directory backup even if every 3D path fails.

**Loading law — no visitor stares at a black screen.** §5's masked-transition protocol (≤ 400 ms masked work, zero frames > 20 ms after fade-off) is the standard, and it now carries the fallback the flat side lacked (the 2026-11-01 walk found ~15 s of black at pilgrimage gates and nearer a minute inside the Pyramid): if a build or stream cannot complete inside the mask window, the visitor waits in a **labelled, lit holding state** — the `mu-fade` held open with a house-voice line naming what is being prepared — never in darkness. An unmasked black frame at any gate, portal, or session start is a hard fail under §7, on both tiers, flat and XR alike.
