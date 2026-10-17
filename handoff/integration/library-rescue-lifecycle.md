# Library Rescue — Unified Lifecycle & Disposal Architecture

Resolves the automated critic's P0 (dual-renderer lifecycle risk) with an
explicit, CI-enforceable specification. The hybrid architecture is retained
per recommendation; this document makes it safe.

## 1. Current state (verified)
- Environment: WebGL — beveled cedar shelves, fluted marble columns with
  capitals, cylindrical papyrus rolls, Greek-key ornament, dynamic
  firelight with moving shadows.
- Gameplay actors (scholar, carried scrolls, fire, smoke, ash, feedback):
  2D canvas composited above the WebGL scene.
- Mobile: DPR hard-capped at 1.0; guarded render loop; cleanup on pagehide
  (listener/timer removal, WebGL buffer/program deletion, context release).
- Gap (honest): no independently confirmed single teardown path covering
  BOTH renderers in one deterministic order. This spec closes it.

## 2. Unified architecture (required at integration)
One `LifecycleManager` owns both renderers. No renderer manages its own
lifetime.

- `mount(root, config)` — creates the GL context and the 2D canvas,
  registers EVERY resource at creation time in a central registry:
  geometries, textures, programs, buffers, framebuffers, RAF ids, timers,
  listeners, observers, audio nodes, pointer captures.
- `pause()` / `resume()` — tab hide/show; stops both RAF loops, suspends
  audio; resume re-syncs clocks (no time-jump).
- `destroy()` — deterministic order, no exceptions:
  1. Cancel all RAF loops (WebGL + 2D).
  2. Clear all timers and intervals.
  3. Remove all listeners (registry-driven, named).
  4. Disconnect all audio nodes; close AudioContext.
  5. Release the 2D canvas (reset width/height to 0, null the context).
  6. Delete GL buffers, textures, programs, framebuffers (registry order).
  7. Explicitly lose the GL context (`WEBGL_lose_context`).
  8. Null all references; assert registry is empty.
- Reversibility contract: `mount()` ⇄ `destroy()` must be symmetric.
  Repeated mount/unmount cycles leave zero residue — this is CI-testable.

## 3. Mobile GPU safety bounds (explicit)
- **DPR:** hard cap 1.0 on mobile viewports. Non-negotiable.
- **Texture budget:** max 2048px per texture on mobile tier; total GPU
  texture memory ≤ 128 MB mobile / ≤ 512 MB desktop.
- **Particle budgets:** ember storm ≤ 400 desktop / ≤ 150 mobile;
  ash ≤ 200 / ≤ 80; smoke sprites ≤ 60 / ≤ 25.
- **Frame governor:** rolling 60-frame average > 24 ms for 3 s → shed in
  order: particle counts → canvas resolution (0.85× steps, floor 0.6×) →
  shadow map off. Never a silent stall: show a small "simplified mode"
  badge when shedding.
- **Context loss:** on `webglcontextlost` → pause both loops, show
  "Graphics paused — tap to resume." On `webglcontextrestored` →
  rebuild all GL resources from the registry, resume. Never a white
  canvas, never a dead loop.
- **Thermal (where API available):** critical thermal state → drop to
  the 2D-only fallback scene rather than fighting the GPU.

## 4. CI gates (main repo)
1. Zero external requests (scripts, fonts, fetches, images) — fail on any.
2. Mount/unmount × 20: listener count, timer count, and GPU resource
   count return to baseline every cycle.
3. Mobile DPR assertion: renderer-clamped DPR ≤ 1.0 under mobile
   viewport emulation.
4. Context-loss simulation mid-game: pause message appears; restore
   resumes gameplay without state corruption.
5. Frame budget: 60 s gameplay capture — p95 frame time ≤ 24 ms
   desktop reference, ≤ 33 ms mobile reference.
6. Heap: growth ≤ 5 MB across 10 mount/unmount cycles.

## 5. P0 resolution statement
The P0 is addressed by: unified manager (§2) + deterministic destroy
order (§2) + explicit GPU bounds (§3) + CI gates 2, 4, 5, 6 (§4). The
hybrid renderer architecture itself is retained — it is the correct
engineering call (gameplay actors are small fast-moving tokens;
full-WebGL actors would cost mobile GPU budget for no visible gain).
