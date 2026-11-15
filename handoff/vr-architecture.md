# WebXR Dual-Mode Architecture — Divine Archives Museum VR

**Author:** WebXR Architect (VR team) · 2026-10-12 · Status: ANALYSIS/SPEC — Claude Code implements in repo `carterdaniel630-cmd/the-divine-archives`
**Source of truth:** `docs/museum/app.js` (114 KB, r186 vendored core at `docs/assets/vendor/three/three.module.min.js`), `docs/_headers`, `docs/museum/manifest.json` + `wings/*.json` (83 rooms, Nine Wings, data-driven).

**Grounding facts (verified against repo, do not contradict):**
- Zero WebXR code exists. Single `WebGLRenderer`, custom WebGL2 context created manually at `app.js:69` (`canvas.getContext("webgl2", {antialias: !touch, powerPreference: "high-performance"})`), flat camera pose applied at `app.js:1489–1490`.
- Render loop is `requestAnimationFrame(tick)` with TWO call sites: `app.js:1467` and `app.js:1553`. `tick` early-returns when `S.paused || document.hidden`. Rendering is dirty-flag-gated at `app.js:1488–1505` (`if (!S.dirty) return` before `renderer.render`).
- The visitor's torch (lantern PointLight) is a child of the flat camera (`camera.add(lantern)`, `app.js:88`) — it follows the view today and must follow the headset in XR.
- Pixel ratio already capped at 1.5 on touch devices (`app.js:72`) — touch includes Quest's Meta Browser; tighten further in XR (see §2.3).
- Vendored three.js is **core only** (`three.module.min.js`, `three.core.min.js`) — no examples modules. No `VRButton.js`, no `XRControllerModelFactory`. Everything XR must be built from core three.js + WebXR Device API. Zero CDN, zero npm — per both Standards.
- HTTPS is real (GitHub Pages, `docs/` → getconexto.com) → secure context satisfied for WebXR. `docs/_headers` sets `Permissions-Policy: geolocation=(), microphone=(), camera=()` — none of these gate `immersive-vr`. **No header change needed.** A service worker is **NOT** needed for WebXR (state explicitly; do not add one).
- Movement today: WASD/arrows + tap-to-walk (`S.auto`); look via pointer-lock mouse or drag. Inspector/inspection card system, directory, guide, portal to Pilgrimage — all DOM HUD.

**Scope of this spec:** session lifecycle, three.js r186 integration, dual-mode architecture, input sources, fallback matrix, headset/browser support, phone preview path, HTTPS/headers/service-worker notes, ordered app.js migration checklist for Claude Code.

---

## 1. WebXR session lifecycle

### 1.1 Feature detection (cold path, zero cost when absent)

```js
// docs/museum/xr.js — new module, imported by app.js
export const XRProbe = {
  supported: false,            // navigator.xr exists
  vrSupported: false,          // isSessionSupported('immersive-vr') resolved true
  reason: 'unprobed',          // 'secure-context' | 'no-navigator-xr' | 'no-vr' | 'ok'
};

export async function probeXR() {
  if (!('xr' in navigator)) { XRProbe.reason = 'no-navigator-xr'; return XRProbe; }
  if (!window.isSecureContext) { XRProbe.reason = 'secure-context'; return XRProbe; }
  XRProbe.supported = true;
  try {
    XRProbe.vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
    XRProbe.reason = XRProbe.vrSupported ? 'ok' : 'no-vr';
  } catch { XRProbe.reason = 'no-vr'; }
  return XRProbe;
}
```

Run `probeXR()` during the existing museum `start()` boot (it is async — non-blocking; cache the promise, update the Enter VR button when it resolves).

### 1.2 "Enter VR" button placement

- **Primary:** the museum HUD bar (`mu-bar`) — a new button `mu-vr-btn` beside the Room guide button. Always present in the DOM; its state is set by `probeXR()`:
  - probed `ok` → enabled, label "Enter VR".
  - probed `no-vr` / `no-navigator-xr` / `secure-context` → **hidden entirely** (never show a dead button; flat mode is the museum today and must not look broken).
- **Secondary (optional, low priority):** in the "Room guide" overlay, under each room — label "Open in VR" — only rendered when `XRProbe.vrSupported`. Do NOT duplicate session logic; both buttons call the same `enterXR()`.
- **Fallback messaging (honest, house voice):** there is no user-visible "your device lacks WebXR" banner. The button simply does not appear. If `vrSupported` flips false after previously true (e.g., flag toggled), show once in the HUD status line: "This device does not offer a VR session; the museum remains open in 3D." House voice: no begging, no "please", no exclamation.

### 1.3 Session request

```js
export async function enterXR(renderer, onSessionEnd) {
  if (!XRProbe.vrSupported) return false;
  try {
    let session;
    try {
      session = await navigator.xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hand-tracking', 'layers'],
      });
    } catch (floorErr) {
      // Declared seated fallback (settled AM-ARC-01): local-floor unavailable
      // does NOT fail the session — retry with it optional and proceed in
      // seated mode (fixed 1.2 m eye height, announced to the visitor).
      session = await navigator.xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'hand-tracking', 'layers'],
      });
      seatedFallback = true; // §1.3 prose governs; rig uses the seated anchor
    }
    await renderer.xr.setSession(session);
    // wait for renderer to apply; then:
    session.addEventListener('end', onSessionEnd, { once: true });
    return true;
  } catch (err) {
    XRProbe.reason = 'session-failed';
    showXRStatus('The museum could not open in VR (' + shortReason(err) + '). It remains open in 3D.');
    return false; // STAY FLAT — see §5
  }
}
```

- `local-floor` is requested first as a required feature (the museum is walkable; it guarantees the floor plane the room geometry stands on is the real floor); if that request fails, the code above retries with it optional and the session proceeds in the declared seated mode. **Seated fallback (settled 2026-11-01, AM-ARC-01 — CON-A5, HUM-3):** `local-floor` is *requested* as above; if it is unavailable, the session does **not** fail — it proceeds in the **declared seated mode** (interaction spec §2 / Comfort §d.15): a seated reference space at a fixed 1.2 m eye height, all content re-anchored, announced to the visitor. What remains unacceptable is a *silent* substitution — a standing session quietly running on a `viewer` space with a wrong floor. The fallback is a named mode the visitor can see and choose, never a hidden degradation; a seated visitor refused a session outright would be refused by exactly the rule written to protect them.
- `optionalFeatures: ['hand-tracking', 'layers']` — optional so sessions still start on Quest 2 / older runtimes. Query what actually landed via `session.enabledFeatures` after start to configure input (see §4).
- Never pass `local` alone, never `bounded-floor` (rooms are larger than any guardian; see locomotion in §4).

### 1.4 Session start / end lifecycle

```
flat (today) → [probe ok] → Enter VR tapped → session starts →
  XR_ACTIVE: renderer.xr.getSession() truthy
     → input switches to inputSources; DOM HUD hidden; XR HUD (in-scene) shown
     → pause flat UI audio ducking unchanged; sound engine keeps running (spatial!)
  session ends (user exits via system UI, or app calls session.end())
     → restore: renderer camera = flat camera; S.pos/S.yaw synced FROM rig (see §2.2);
       DOM HUD unhidden; S.dirty = true; single re-render
```

- `renderer.xr.addEventListener('sessionstart', ...)` / `sessionend` are the authority — not the `await` line. All mode transitions key off these.
- **Pause on `visibilitychange`:** existing handler at `app.js:1403` already pauses sound and saves position when `document.hidden`. In XR, also call `session.end()` proactively? NO — the runtime ends sessions on its own when the tab hides; attempting manual end races it. Instead: on `visibilitychange → hidden` during XR, persist pose (same `savePos()`), and let the runtime fire `end`. On visible return, we are flat again (session ended) — the user re-enters via the button. This is standard behavior, not a bug.
- App-level `beforeunload` / `pagehide` already save position (`app.js:1402`); XR exit should write the final pose too (sync `S.pos` from the rig before unhiding HUD — §2.2).

### 1.5 Reference-space handling

- `renderer.xr.setReferenceSpaceType('local-floor')` at init (before any session).
- Per-frame: **never read the XR camera's transform to drive logic** — three.js owns `renderer.xr` camera poses. Read head pose only via a `THREE.Object3D` parented under the rig (`headProxy.getWorldPosition()`), or use `frame.getViewerPose()` inside the loop if needed for audio.
- The rig (`xrRig`, a `THREE.Group`) is the ONLY object locomotion writes to. On session start, snap `xrRig.position` to the flat pose (`S.pos`, `S.yaw`) so the guest starts in VR exactly where they stood flat. On session end, write rig offset back into `S.pos`/`S.yaw`.

---

## 2. Three.js r186 integration

### 2.1 The two critical refactors

**A. Loop migration — `requestAnimationFrame(tick)` → `renderer.setAnimationLoop(tick)`**

Call sites to change (`app.js`): line 1467 and line 1553.

```js
// BEFORE (both sites):
requestAnimationFrame(tick);
// AFTER (call ONCE — the two sites are both "start the loop"; unify to a single startLoop()):
renderer.setAnimationLoop(tick);
```

Details:
- `tick(now)` signature is compatible: `setAnimationLoop` passes a timestamp. Keep the signature.
- `S.paused || document.hidden` early-return at the top of `tick` must REMAIN — in flat mode it preserves today's behavior (no wasted frames when the museum overlay is up or tab hidden). In XR, the runtime drives the loop at headset rate; `document.hidden` is false during immersion, so the guard is harmless.
- The dirty-flag render gate (`if (!S.dirty) return` at ~1488, `renderer.render(scene, camera)` at ~1505) may REMAIN, but the **input-source polling must NOT be gated by it** (see §2.4). Acceptable: render stays dirty-gated in flat mode (today's perf win); in XR mode force `S.dirty = true` every frame (headset always needs a fresh stereo frame — the renderer handles submit; do not gate VR frames on dirty, it reads as frozen/stuttering on Quest).
- `renderer.setAnimationLoop` is **required** for WebXR sessions — `requestAnimationFrame` stops firing correctly inside an immersive session on most runtimes. This is the single highest-risk change; verify explicitly (see §8, step 9).

**B. The `renderer` / context — the xrCompatible trap**

`app.js:69–71` creates the GL context **manually**:

```js
const ctx = canvas.getContext("webgl2", { antialias: !touch, powerPreference: "high-performance" });
renderer = new THREE.WebGLRenderer({ canvas, context: ctx, ... });
```

A manually-created context must be made XR-compatible **before** the first session:

```js
if (XRProbe.supported) {
  try { await ctx.makeXRCompatible(); } catch (e) { /* leave XRProbe.reason='ctx' */ }
}
```

- Call `makeXRCompatible()` lazily — only when the user first taps Enter VR (it can force a context reset on some drivers; doing it at boot risks destabilizing flat mode). Add `xrCompatible: true` to the context attributes as well (Chrome/Edge honor it; harmless elsewhere):
  `canvas.getContext("webgl2", { ..., xrCompatible: true })`.
- **Do NOT create a second renderer/context for XR.** One GL context per experience (Modular Framework Standard §3). `renderer.xr.enabled = true` must be set at `initRenderer()` time (before first render); enabling XR late is legal but `setAnimationLoop` + session binding is cleanest when `xr.enabled` is set from birth.
- `renderer.setPixelRatio` (app.js:72) caps at 1.5 on touch. In XR mode, three.js ignores `setPixelRatio` for the XR framebuffer and uses the session's recommended resolution — BUT the flat-mode pixel ratio still applies to the compositor fallback canvas. Additionally call `renderer.xr.setFoveation(...)` at the **per-tier constant** on session start (see §2.3 as amended — 0.75 Quest 3 / 1.0 Quest 2; the former blanket 1.0 here is superseded). After session end, restore `renderer.xr.setFoveation(0)` (foveation is per-session state; leaving it set is harmless in flat mode since no XR pass runs, but reset for cleanliness).

### 2.2 Camera rig — never move the XR camera directly

Current flat pose application (`app.js:1489–1490`):

```js
camera.position.copy(S.pos);
camera.rotation.set(S.pitch, S.yaw, 0, "YXZ");
```

**Refactor to a rig:**

```js
// in initRenderer(), after camera creation:
const xrRig = new THREE.Group();          // the ONLY thing locomotion writes in XR
const xrCamera = new THREE.PerspectiveCamera(64, 1, 0.05, 140); // flat-mode fallback? NO.
```

Correct structure (three.js convention):

- Keep the existing `camera` as the **flat-mode camera**, unchanged.
- `xrRig` (Group) holds the lantern torch + a `headProxy` Object3D at head height:
  ```js
  xrRig.add(headProxy);              // headProxy.position.y = EYE (1.62)
  headProxy.add(lanternXR);          // a second torch? NO — see below
  scene.add(xrRig); xrRig.visible = false; // hidden until sessionstart
  ```
- **Lantern:** the existing `lantern` is a child of the flat `camera` (`camera.add(lantern)`). In XR, reparent `lantern` from `camera` to the rig's `headProxy` on `sessionstart`, reparent back on `sessionend`. Do NOT duplicate the light — one visitor torch, one light, two possible parents. House rule: the torch stays the torch.
- **Head-pose feed (cleanup 2026-11-01 — Soundscape item):** `headProxy` starts as a static object at EYE height under the rig; it becomes the visitor's head only because it is **fed, every frame while presenting, before any consumer reads it**: in `tick`, copy the presenting camera's world position and quaternion into `headProxy` (`renderer.xr.getCamera().getWorldPosition(headProxy.position)` / `.getWorldQuaternion(headProxy.quaternion)` — reading the XR camera is allowed; writing it never is, §1.5). The lantern (its child) and the audio listener (§3.5, driven from `headProxy`) both ride this feed. Without this sentence's step, a literal build leaves `headProxy` at its rig-local pose and the head-turn acceptance test (pilot spec §5.11) cannot pass.
- On `sessionstart`: `xrRig.visible = true`; copy `S.pos` → `xrRig.position`, `S.yaw` → `xrRig.rotation.y`; flat `camera` is no longer used for rendering — three.js's internal `renderer.xr` camera takes over when `renderer.render(scene, camera)` is called during a session (the passed `camera` argument is ignored in favor of the XR camera array; **still pass the same `camera` variable** to keep the call site unchanged).
- On `sessionend`: read rig back → `S.pos.set(rig.x, EYE, rig.z)`, `S.yaw = rig.rotation.y` (pitch resets to 0 — head pitch is runtime-owned; do not attempt to read it back); `xrRig.visible = false`; reparent lantern to flat camera; `S.dirty = true`.
- **Never** write to `renderer.xr.getCamera()` or any XR camera transform. three.js computes them from the session's viewer pose + the rig's world matrix. Moving the rig moves the guest.

Guard in the flat pose application: wrap lines 1489–1490:

```js
if (!renderer.xr.isPresenting) {
  camera.position.copy(S.pos);
  camera.rotation.set(S.pitch, S.yaw, 0, "YXZ");
}
```

### 2.3 Foveation + resolution hooks

- **Foveation is a per-tier constant, set once per session** *(settled 2026-11-01, AM-ARC-02 — CON-A4)*: `renderer.xr.setFoveation(0.75)` on Quest 3, `renderer.xr.setFoveation(1.0)` on Quest 2 (performance budget §3; artistry addendum §1). The former instruction here — 1.0 at session start for all Quest-class hardware, dropping to 0.75 only if audits flag — is struck: it contradicted the budget's fixed per-tier constants, and foveation is **never modulated at runtime**.
- On `sessionend`: `renderer.xr.setFoveation(0);`
- Do not spec dynamic foveation — three.js r186 exposes only the static level; the per-tier constants are the phone-class answer.
- **Framebuffer scale — the Quest 2 lever** *(added 2026-11-01, AM-ARC-02 — CON-C5, MEC-2)*: on session start, call `renderer.xr.setFramebufferScaleFactor(1.0)` on Quest 3 and `renderer.xr.setFramebufferScaleFactor(0.8)` on Quest 2 (a ~36% pixel cut — the single biggest Quest 2 lever; performance budget §1). WebXR ignores `setPixelRatio`; without this call the Quest 2 renders at full native resolution. Verification of the applied scale is a §8 checklist step, not an assumption.
- Antialias, by layer *(clarified 2026-11-01 — CON-C9)*: the canvas context flag `antialias: !touch` (app.js:71) governs **flat mode only**; the XR framebuffer's own MSAA resolve is a separate layer, budgeted in performance budget §1's driver reserve and §2's "4× keep" row. The two statements were never about the same surface; build verification confirms the actual sample behaviour on the floor device (§8).

### 2.4 Input-source polling — inside the animation loop, ungated

New function `pollXRInput(dt)`, called from `tick(now)` **before** the dirty check, only when `renderer.xr.isPresenting`:

```js
function pollXRInput(dt) {
  const session = renderer.xr.getSession();
  if (!session) return;
  for (const source of session.inputSources) {
    switch (source.targetRayMode) {
      case 'tracked-pointer': pollController(source, dt); break;
      case 'screen':          /* transient — treat as select-only */ pollTransient(source, dt); break;
      case 'gaze':            /* visionOS fallback */ pollGaze(source, dt); break;
    }
  }
  if (handTrackingActive(session)) pollHands(session, dt);
}
```

Uses `renderer.xr.getController(i)` / `getHand(i)` groups — core three.js, no examples imports (see §4).

### 2.5 WebXRLayers assessment — NO (for this phase)

**Verdict: do not spec WebXRLayers now.** Reasons:
1. The museum's text (relic labels, inspector cards, the Room guide, directory) is **DOM-based** today. Layers would require a parallel text rasterizer for quad layers — out of scope for the architecture pass, and the Performance Sculptor would flag the added complexity. **Scope note (2026-11-01, AM-ARC-04 — CON-C7):** this verdict is about *Layers*, not about in-scene text. The **plaque-class text pipeline** the interaction spec §4 specifies (plaques, steles, the lectern book, magnified plaque panels, all CanvasTexture-based) **is pilot scope and is built**; what remains out of scope is rendering full chapter-length inspector cards as in-scene text (see §3.4 as amended).
2. `optionalFeatures: ['layers']` is requested (§1.3) so the runtime *may* promote the projection layer, but three.js r186 does not implement quad/ cylinder layers from core — using them would need custom WebGL code against the XRWebGLBinding, which violates the "core three.js only" constraint.
3. Text legibility in VR is achieved instead by: foveation off for the central view is automatic (foveation degrades periphery, not center), large high-contrast in-scene panels (§3.4) rendered as CanvasTextures (the museum already builds textures via `canvasTex`, app.js:99) — sufficient at Quest 3 resolution.
Revisit only if the Performance Sculptor demonstrates a measured frame-time win after the first integration.

---

## 3. Dual-mode architecture

### 3.1 Principles

1. **Single scene graph.** No parallel scene for VR. XR is a different camera path + different input path through the same scene, same rooms, same exhibits.
2. **Mode-agnostic update.** `tick()` branches only at three points: (a) loop driver (same), (b) input (flat keys/pointer vs `pollXRInput`), (c) pose application (flat camera write vs rig write). All world logic — `step(dt)`, `manageZones()`, `locate()`, relic queueing, fauna, sky, sound, portal — is mode-agnostic and untouched.
3. **Data-driven loading, extended by named fields.** `manifest.json`, `wings/*.json`, the room/exhibit pipeline: the loading *pattern* is unchanged, but XR adds the fields its own systems require, through the same loader: the audio brief's `verb:` reverb key, the performance budget's §4c `perf:` blocks, and the build-time portal adjacency graph (performance budget §5). *(Amended 2026-11-01, AM-ARC-03 — the former principle "XR adds no data fields" contradicted three companion specs and is struck; what is protected is the pattern, not the field list.)*
4. **Input abstraction (see diagram):** flat pointer events and XR input sources both resolve to the same *intent* vocabulary: `LOOK`, `MOVE`, `SELECT` (trigger tap / pinch — activate/inspect), `GRAB` (squeeze — take up a relic facsimile), `SECONDARY` (B button / palm — back/close), `TELEPORT-HINT` (trigger hold). *(Intent mapping settled 2026-11-01, AM-ARC-05 — CON-A7: squeeze means GRAB everywhere in this program; the former §4.2 text assigned squeeze to SECONDARY and, in the same breath, to teleport — both assignments are struck.)* Implement as `Input.intent(source, payload)` dispatched to the existing handlers (`openCard`, `teleport`, `S.keys` equivalents). Flat code paths remain byte-identical; XR maps onto them.

### 3.2 Mode state machine

```
S.mode: 'flat' | 'xr'   (new field on the existing state object S)

flat:  today's code path exactly. renderer.xr.isPresenting === false.
xr:    sessionstart → S.mode='xr'; DOM HUD hidden (body class 'is-xr');
       sessionend   → S.mode='flat'; DOM HUD restored.
```

Single source of truth for "are we presenting" is `renderer.xr.isPresenting`; `S.mode` is a convenience mirror for UI branching.

### 3.3 What changes per mode

| System | Flat (today, untouched) | XR |
|---|---|---|
| Loop driver | `setAnimationLoop(tick)` (migrated) | same |
| Camera | `camera` posed from `S.pos/yaw/pitch` | rig-owned; `renderer.xr` camera; flat pose write skipped |
| Look | pointer-lock mouse / drag / arrows | headset (runtime); right stick snap-turn (see §4) |
| Move | WASD / tap-to-walk (`S.auto`) | left stick smooth loco + teleport arc (see §4); tap-to-walk disabled |
| Select | click / `E` / tap (`pick(0,0)` center) | controller ray + `select` → same `pick()` with XR NDC |
| Torch | lantern child of flat camera | lantern reparented to rig head |
| HUD | full DOM (`mu-bar`, intro, cards) | DOM hidden; in-scene panels (§3.4) |
| Audio | `S.snd` stereo | two-tier model, one shared context, listener driven from `headProxy` (§3.5 as amended) |
| Portal | click / walk-through | walk-through **or teleport-target the archway** *(settled 2026-11-01, AM-ARC-05 — CON-A18: a teleport-first visitor must be able to enter a portal without walking to it; the interaction spec's row 8 governs)* |

### 3.4 XR text surfaces — in-scene, diegetic, nothing head-locked

- On `sessionstart`: `document.body.classList.add('is-xr')`; CSS rule `.is-xr #mu-bar, .is-xr #mu-intro, ... { display:none }` hides all DOM HUD (do not `hidden`-attribute them; keep state, restore on end). Exception: none. DOM in front of a headset is invisible anyway; hiding saves compositing cost.
- **All in-XR text is anchored to the world** *(settled 2026-11-01, AM-ARC-05 — CON-A19)*: the interaction spec's diegetic surfaces (plaques, steles, the lectern book, the vade-mecum) are the text system. The former design here — a **head-locked-lazy label panel** and a **persistent comfort/exit footer chip** — is **struck**: it contradicts the interaction spec's soul rule (diegetic UI only) and Benchmark Bar Rule 5 ("no floating HUD text, ever"), and a persistent chip is exactly the floating flat menu the soul rule exists to prevent. In their place:
  - **Label/plaque surface:** an XR `select` opens the object's own plaque, magnified in place (interaction spec §3/§4.2) — the text lives on the object, at the Warden's reading numbers.
  - **Room plaque:** on `locate()` room change, the room's name is read from its threshold stele; no floating announcement panel.
  - **Comfort/exit hint:** lives on the settings stele and the palm menu ("Menu button — leave VR" is a platform truth taught at Start Here, not a persistent chip).
  - **Caption surface:** captions render on the visitor's vade-mecum slate (a diegetic hand-held surface) fed by the audio brief's `sound.caption(text, ms)` bus, and every functional sound also carries its visual/haptic equivalent at its source (audio brief §d) — captions are never the only carrier, and meaning never waits on opening the slate.
- Reading scope *(settled 2026-11-01, AM-ARC-05 — CON-A17)*: plaque-level reading **is** in VR — title, summary, label fields, and the magnified plaque (interaction spec §§1, 3, 4.2). Full chapter-length text stays flat-mode, and that limit is stated at the Rotunda before entry (interaction spec §8 as amended). The former line here — "reading full inspector cards in XR: out of scope for v1; full text stays a flat-mode activity" — survives only for chapter-length text, not for plaques.

### 3.5 Spatial audio — the two-tier model, one context, one pose source

*(Replaced 2026-11-01, AM-ARC-06 — CON-A11, SND-1. The former text kept
`sound.js`'s private-context engine and added a manually-fed
`setListener(pos, quat)`, forbidding an engine rewrite; the audio brief
specified a `THREE.AudioListener` parented to the flat camera — which is
not the presenting camera in XR. Both halves are settled into one model:)*

- **One shared AudioContext**, owned by a `THREE.AudioListener`. `sound.js`'s
  private context is retired into it (the brief's migration: KEEP
  `buffers()/LAYER/CALL/recipe()/impulse()/createSound`; MERGE the context;
  ADD the emitter registry with `dispose()`, per-wing reverb presets via the
  `verb:` wing-JSON key, the four mute buses persisted under `mu-snd`, and
  the `sound.caption(text, ms)` bus; DO NOT add sampled assets or CDN audio —
  0 bytes; any future sampled loop: mono 44.1 kHz, ≤ 200 KB, ≤ 2 MB total).
- **One pose source:** the listener is **not** parented to the flat camera.
  Its transform is driven each frame from `headProxy` — which is itself fed the presenting camera's world pose every frame (§2.2 head-pose feed, cleanup 2026-11-01) (this doc's §2.2 pose
  authority — the same object the lantern hangs from). The acceptance test
  is behavioural, in-headset: a head-turn pans the ambience bed and the
  positional emitters (pilot spec §5.11).
- **Two tiers:** the stereo ambience bed (head-referenced, `recipe(env,
  kind)` from wing data) + per-room **positional emitters** (1–3 per room,
  anchored to objects, registered to the room group so they dispose with
  it). HRTF only for the ≤ 3 nearest emitters, `distanceModel =
  'exponential'`, `equalpower` beyond. Caps: ≤ 6 emitters / room, ≤ 8
  continuous layers, ≤ 40 live nodes, ≤ 5% of frame CPU.
- **Transitions:** wing-key crossfade — same-wing neighbours swap emitters
  and reverb only, the shared bed is never torn down; bed changes ease with
  τ ≥ 1.0 (3.5 s fades). `ctx.resume()` is bound to the Enter VR gesture,
  to `sessionstart`, and to `visibilitychange` return — all three paths
  specced, none assumed.
- Ducking behavior (`S.snd.duck`, 60% on inspect) unchanged. `visibilitychange` pause already handled.

### 3.6 Living-room module insertion contract (the 10 future exhibits)

The 10 interactive exhibits (Royal Game of Ur, Antikythera, Senet, Hnefatafl, Oracle Bones, Library Rescue, Astrolabe, Alchemist, + wave-2 Mehen/I Ching) are **not yet integrated**. The contract their future room modules must satisfy so they work in **both** modes:

```js
// docs/museum/living/<slug>.js — future module shape (contract, not implementation)
export function createExhibit({ scene, assets /* absolute /assets/... config per Standard §2 */ }) {
  return {
    group: THREE.Group,          // added to the room group by the loader
    update(dt, ctx) {},          // ctx = { mode: 'flat'|'xr', input: InputAPI, camera: THREE.Camera }
    destroy() {},                // dispose ALL geometries/textures/materials/listeners (Standard §3)
    xrTargets: [Object3D...],    // optional: meshes the XR select-ray may hit; defaults to group children
    xrScaleHint: 1.0,            // optional: multiplier for comfortable XR interaction distance
  };
}
```

Rules:
- Modules receive `ctx.mode` and `ctx.input` — they branch input internally; they never touch `renderer.xr`, the rig, or session state.
- `update(dt, ctx)` is called from the mode-agnostic part of `tick`; in XR it still runs (the exhibit animates in the headset).
- `destroy()` must run on room unload in both modes (the existing zone manager `manageZones()` is the call site — XR changes nothing about room lifecycle).
- No exhibit may assume a DOM overlay for core interaction; DOM extras degrade to hidden in XR (`is-xr` class) and the module must remain operable via `ctx.input` intents.
- Absolute asset paths only (Standard §2); no exhibit creates its own renderer (Standard §3).

---

## 4. Input sources

### 4.1 Capability detection & fallback order

On `sessionstart`, inspect `session.inputSources` and `session.enabledFeatures`:

```
1. tracked-pointer controllers present (the normal case: Quest Touch, Pico, SteamVR wands)
     → primary: controllers drive the action table
2. hand-tracking (session.enabledFeatures includes 'hand-tracking' AND an inputSource with hand != null appears)
     → hands join for grab when controllers are set down (proximity + 2 s stillness,
       interaction spec §6 mixed mode); hands alone (no controllers) → hand profile primary
3. transient-pointer / screen (phone-based viewers in "immersive" shells)
     → select-only (no squeeze, no sticks)
4. gaze (visionOS Safari if no controllers; some desktop shells)
     → dwell-select (1.2 s gaze = SELECT), no locomotion sticks → teleport-only
```

*(Priority settled 2026-11-01, AM-ARC-07 — CON-A6: the former order put hands first
with controllers "secondary," against the interaction spec's action table, in which
controllers drive and hands serve grab in mixed mode. The device in the visitor's hand
drives; that is also the grab-safety answer.)*

Fallback *within* a session: if the user puts controllers down and raises hands (Quest 3 auto-switches), `inputsourceschange` fires — re-run detection, swap the active profile live. Implement `session.addEventListener('inputsourceschange', configureInput)`.

Three.js access: `renderer.xr.getController(0/1)` and `renderer.xr.getHand(0/1)` — core groups whose transforms the renderer updates automatically. **No controller model factory exists in the vendored bundle** — render controllers as house-styled wands: a short dark-bronze grip + small emissive amber tip (CanvasTexture rune band optional), built from core primitives. This satisfies the Artistry Standard better than a generic factory model and costs ~200 triangles.

### 4.2 Controllers — `select` / `squeeze` / sticks

Wire via three.js event interface on the controller groups:

```js
const c0 = renderer.xr.getController(0), c1 = renderer.xr.getController(1);
c0.addEventListener('selectstart', () => Input.intent('SELECT', { hand: 0 }));
c0.addEventListener('squeezestart', () => Input.intent('GRAB', { hand: 0 }));
// sticks/buttons via gamepad:
function pollController(source, dt) {
  const gp = source.gamepad;
  if (gp && gp.axes.length >= 4) {
    const [lx, , rx] = [gp.axes[2] ?? gp.axes[0], 0, gp.axes[3] ?? gp.axes[1]];
    // left stick (index 0/1 by convention: axes[2],axes[3] on Touch; guard per-profile)
    smoothLocomotion(lx, lz, dt);      // opt-in only; Comfort §a.4 envelope (below)
    snapTurn(rx, dt);                  // 30° snap on deflection, 250 ms cooldown
  }
  raycastSelectRay(source);            // update the visible ray + hover highlight
}
```

- **Locomotion — the Warden's envelope, and teleport is the default** *(rewritten 2026-11-01, AM-ARC-07 — CON-A1, A2, A3, A7)*: **Teleport is the default and the pilot's primary locomotion**: hold the **right trigger** (not squeeze) → arc (max 8 m) → release to land; fade 150–250 ms. **Smooth locomotion is opt-in only** — behind the settings warning and 2 deliberate confirmations (Comfort §a.2); when enabled, the left stick glides inside the Warden's envelope: **max 2.0 m/s, velocity ramp 0→2.0 m/s over 1.0 s, linear accel ≤ 4 m/s²** (the former "2.2 m/s walk, no run" and "smooth stick default ON" are struck — 2.2 exceeded the Warden's maximum, and a default-on smooth stick contradicts Comfort §a.1–2 and the interaction spec alike). Right stick X = **30° snap-turn, 250 ms cooldown** (the former 250 ms here was right; the interaction spec's 150 ms plug is the one that moved — AM-INT-02). No smooth turning by default. Both write to `xrRig.position` / `xrRig.rotation.y`, then `collide()`-equivalent: reuse the existing `collide(S.pos)`? It operates on `S.pos` — refactor `collide` to take a Vector3 (`collide(vec3)`), call with a temp synced from the rig. **`collide(vec3)` handles Y**: on ramps, stairs, the corridor descent, and the ziggurat stages it returns the floor height at (x, z) so smooth locomotion performs the vertical travel; teleport landings on stages are named pads (pilot spec §2), and the session-end pose write-back (§2.2) always writes the constant EYE height, never a stage height.
- **SELECT:** maps to the existing `pick()` pipeline: compute NDC from the controller's ray against the flat `camera`'s projection? No — use a raycaster from the controller's world transform directly (`ray.setFromXRController(controller)`), intersect `S.exhibits` meshes (same candidate filter as `pick`), then call the same `openCard`-path with the hit. The hover tag (`mu-tag`) is DOM — in XR the object's own plaque serves (§3.4 as amended).
- **GRAB (squeeze):** takes up the relic facsimile (interaction spec §1 row 11 / §3). **Back/close is the B button** (palm-facing-head hold for hands) — squeeze never means back/close, and never exits the session (session exit belongs to the system UI only).

### 4.3 Hand tracking — 25-joint data

- `const h0 = renderer.xr.getHand(0)` — three.js updates joint transforms automatically when `hand-tracking` is an enabled feature and the runtime provides hands. Joint access: `h0.joints['index-finger-tip']` etc. (25 joints per hand per the WebXR Hand Input spec).
- **Pinch = SELECT:** compute distance between `index-finger-tip` and `thumb-tip`; < 18 mm sustained 120 ms → `SELECT` at the pinch midpoint (ray from head through midpoint for target resolution, or direct-touch if within 0.35 m of a mesh — direct touch first, it's the natural museum gesture).
- **Palm-facing-head + hold = SECONDARY** (back/close) — simple, discoverable.
- Hand meshes: three.js has no hand model in core. Render joints as small dark-ivory spheres + connecting lines (a "manuscript illumination" aesthetic — bone-colored joints, fine gold links; ~50 spheres + 24 line segments per hand, one shared geometry/material, instanced or merged). This is attested-by-design, not a generic robot hand.
- If `hand-tracking` was requested but no `hand` object ever appears on input sources (Quest 2 without the toggle, Pico), silently stay on controllers — no user message.

### 4.4 Transient-pointer & gaze

- `targetRayMode: 'screen'` (magic-window/cardboard shells exposing a session): SELECT on tap only; locomotion falls back to **teleport-to-gaze-point** (center-ray cast, move rig). No sticks exist.
- `targetRayMode: 'gaze'`: dwell 1.2 s → SELECT (progress ring on the vade-mecum slate); locomotion teleport-only. *(Scope note, 2026-11-01 — CON-A15: gaze-dwell in this program is the accessibility path and the platform fallback for gaze-driven shells like visionOS — it is never the routine mandatory-path verb on controller/hand devices; the pilot's orientation acknowledgement is a press or a poke, pilot spec §2.)*
- Both are graceful-degradation paths, not primary targets. They exist so §7's phone preview can, where a runtime allows, exercise the real session path.

---

## 5. Fallback matrix

| Condition | Behavior |
|---|---|
| No `navigator.xr`, or not a secure context | Button hidden. Museum runs flat **exactly as today** — zero code-path changes in flat mode beyond the loop migration (§2.1A) and the pose guard (§2.2). |
| `navigator.xr` present, `isSessionSupported('immersive-vr')` false | Button hidden. Same as above. |
| `isSessionSupported` true, `requestSession` throws / `setSession` rejects | Honest one-line HUD status: "The museum could not open in VR (reason). It remains open in 3D." Stay flat. Do not retry automatically. Button remains for a later manual attempt. |
| Session starts, then errors mid-session | `sessionend` fires → §1.4 restore path. If restore throws, reload-free recovery: force `S.mode='flat'`, unhide DOM, `S.dirty=true`. Never trap the user in a black headset view — the restore path must not itself depend on XR state. |
| Context creation fails (`makeXRCompatible` rejects) | Mark `XRProbe.reason='ctx'`, keep button hidden, stay flat. Flat rendering is unaffected (the context already exists and renders). |
| `local-floor` unavailable | **Declared seated mode** (fixed 1.2 m eye height, content re-anchored, announced — §1.3 as amended). Never silently substitute `viewer` into a standing session. |

**House rule:** every failure degrades to the current flat museum, which is the complete product — VR is an additional door, never a gate.

---

## 6. Browser / headset support matrix

| Platform | Session | Controllers | Hand tracking | Foveation | Layers note |
|---|---|---|---|---|---|
| **Quest 2 / 3 / 3S / Pro** — Meta Browser (Horizon OS) | ✅ `immersive-vr` + `local-floor` | ✅ Touch / Touch Pro, `select`+`squeeze`+sticks | ✅ 2/3/Pro (2 needs the hand-tracking toggle on); request optional, degrade silently | ✅ per-tier constants honored (§2.3 as amended: 0.75 Q3 / 1.0 Q2) | projection layer promoted automatically if `layers` enabled; no app code needed |
| **Pico 4 / 4 Ultra** — Pico Browser | ✅ | ✅ (sticks layout differs — guard `gamepad.axes` indices, do not hardcode) | ✅ 4 Ultra; 4 partial — optional/degrade | ✅ | same as Quest |
| **visionOS Safari** (Vision Pro) | ✅ `immersive-vr` | ⚠️ no physical controllers — `gaze` + transient pinch; our gaze/dwell path (§4.4) is the primary input here | ✅ native hand input arrives as transient-pointer+hand — pinch maps to `select` | ❌ `setFoveation` no-op (eye-tracked foveation is system-owned) | system compositor; nothing to do |
| **Desktop Chrome / Edge + SteamVR headset** (Index, Vive, Quest Link) | ✅ via SteamVR's WebXR | ✅ | depends on headset (Index ❌, Quest-via-Link ✅) | ❌ desktop GPUs don't need it; call is harmless no-op | n/a |
| **Wolvic** (Firefox Reality successor) | ✅ | ✅ | device-dependent | ✅ where exposed | n/a |
| **Galaxy S22 Chrome (no headset)** | ❌ no `immersive-vr` | n/a | n/a | n/a | — magic-window preview instead (§7) |

Notes:
- **Meta Browser on the Quest 2 floor device is the certifying target** — acceptance tests (§8) certify there; the Quest 3 is the development reference only, and a Quest 3 pass certifies nothing about the floor.
- **SteamVR path** requires the user to have SteamVR running and Chrome's `#enable-webxr` default-on (it is, current Chrome) — document in the Room guide, not in code.
- **visionOS**: `local-floor` is emulated; our rig math holds. Dwell-select timing may need lengthening (comfort pass owns it).
- No platform in this matrix needs camera/mic — `docs/_headers` `Permissions-Policy` already denies them and **WebXR needs neither**. State this in the High Council security review so it isn't flagged.

---

## 7. Phone preview path — Galaxy S22 (Carter's device)

Goal: Carter checks build progress from his phone's browser without a headset, through two tiers.

### Tier 1 — Magic-window flat preview (works today, zero new code)
1. On the S22, open Chrome → `https://www.getconexto.com/museum.html`.
2. Walk the museum with touch exactly as today (drag look, tap-to-walk, tap exhibit). This is the dual-mode build's flat path — it IS the preview of everything except head tracking and stereo.
3. Optional cardboard-style magic window: hold the phone and rotate — with `deviceorientation` the flat camera can already look around (this needs no WebXR; if Claude Code hasn't wired deviceorientation to the flat camera, file it as a preview-nice-to-have, not architecture).

### Tier 2 — Actual WebXR session on the phone (real session path, limited)
1. **Hardware:** any Cardboard-compatible viewer (or none — "magic window" mode works viewer-less in some shells).
2. **Chrome flags:** open `chrome://flags` on the S22 → search `WebXR` → enable **#webxr** and **#webxr-incubations** (names drift; if absent, the shipping default is fine on current Chrome). Relaunch.
3. Open `https://www.getconexto.com/museum.html` (HTTPS ✓ — WebXR hard-requires it; GitHub Pages provides it).
4. If a runtime (e.g., Cardboard viewer paired via the viewer's QR, or Chrome's built-in viewer selector) exposes `immersive-vr`, the **Enter VR** button appears in the HUD. Tap it → the real session lifecycle (§1) runs: `local-floor` (emulated), `getController` returns nothing, `targetRayMode: 'screen'`/transient path (§4.4) handles tap-to-select, teleport-to-gaze locomotion.
5. **What Carter will see vs a real headset:**
   - ✅ Same: session lifecycle, rig math, label panels, torch, room plaques, dirty-flag behavior, stereo rendering path (split-screen in a Cardboard viewer).
   - ⚠️ Different: no 6-DoF head tracking (3-DoF rotation only), no controllers (tap = select), no hand tracking, emulated floor height (may sit ~10 cm off — acceptable for preview), lower resolution.
   - ❌ Not testable on phone: snap-turn comfort, the teleport arc (trigger-hold), hand pinch, foveation artifacts, real guardian interplay.

**Acceptance for the preview path:** Carter can tap Enter VR on the S22 (with flags + viewer) and stand in the Rotunda, look around by moving the phone, tap a relic to see its label panel, and exit back to flat without a reload. If `immersive-vr` is not exposed on his Chrome build, Tier 1 remains the valid preview and the button correctly hides itself — that is the honest outcome for the *preview*, not a failure. **It is not a pilot pass** *(qualified 2026-11-01, AM-ARC-09 — SKP-2)*: pilot acceptance additionally requires the owner-witness criterion (pilot spec §5.7) — a session that never appears on the owner's route leaves the pilot *unverified*, however honest the preview outcome is.

---

## 8. Ordered migration checklist for Claude Code (app.js)

Execute in order. Each step is independently committable; stop and verify after steps 4, 7, 9.

1. **Add `xr.js` module** (`docs/museum/xr.js`): `XRProbe`, `probeXR()`, `enterXR()`, `exitXR()`, `configureInput()`, `pollXRInput(dt)`, rig helpers. Import into `app.js`. No changes to existing modules.
2. **`initRenderer()` — XR enable + context attrs:** set `renderer.xr.enabled = true` immediately after `new THREE.WebGLRenderer(...)`; add `xrCompatible: true` to the `getContext("webgl2", {...})` attributes (app.js:69). Set `renderer.xr.setReferenceSpaceType('local-floor')`.
3. **Rig construction** in `initRenderer()`: create `xrRig` Group + `headProxy` (at `EYE`), add to scene, `visible=false`. Do not touch flat camera setup.
4. **Loop migration:** replace BOTH `requestAnimationFrame(tick)` call sites (app.js:1467, 1553) with a single `startLoop()` that calls `renderer.setAnimationLoop(tick)` exactly once. **Verify:** flat museum still runs, dirty-flag gating intact, pause behavior unchanged.
5. **Pose guard:** wrap the flat pose application (app.js:1489–1490) in `if (!renderer.xr.isPresenting)`. In `tick`, when presenting: force `S.dirty = true` every frame; call `pollXRInput(dt)` before the dirty check.
6. **HUD button + styles:** add `mu-vr-btn` to `mu-bar`; wire `probeXR()` at boot to show/hide it; both the button and the optional Room-guide entry call `enterXR()`. Add `.is-xr` CSS to hide DOM HUD during sessions.
7. **Session lifecycle wiring:** `sessionstart` → S.mode='xr', show rig, snap rig to `S.pos`/`S.yaw`, reparent lantern to `headProxy`, **set the per-tier constants — foveation (0.75 Q3 / 1.0 Q2) and `setFramebufferScaleFactor` (1.0 Q3 / 0.8 Q2) — and verify both took effect**, hide DOM HUD, build the in-scene text surfaces. `sessionend` → restore all, sync rig→`S.pos`/`S.yaw`, reparent lantern back, `setFoveation(0)`, `S.dirty=true`. **Verify:** enter/exit 10× on desktop Chrome (no headset — use the WebXR emulator extension or flags) with no reload, no leaked listeners, no stranded rig visibility. *(Amended 2026-11-01, AM-ARC-09 — CON-A4, CON-C5, MEC-2.)*
8. **Input profiles:** controllers (`getController`, select/squeeze/sticks → intents **as settled in §3.1/§4.2 as amended**), hands (`getHand`, pinch=SELECT, palm=SECONDARY, bone-ivory joint rendering), transient/gaze fallbacks, `inputsourceschange` re-detection. Refactor `collide(S.pos)` → `collide(vec3)` for rig use, **including Y** (ramps, stairs, descent — §4.2 as amended), and verify an on-device ascent + descent before this step closes.
9. **XR select → existing pick path:** controller ray raycast against the same `S.exhibits` candidate filter; route hits to the existing label/inspect flow (the object's plaque, not DOM cards). **Verify on the Quest 2 floor device — it is the certifying device** (the Quest 3 is the development reference; a Quest 3 pass certifies nothing about the floor): the performance budget §7 gate per room (72 fps sustained, p95 ≤ 13.9 ms), no dropped frames on room transition, torch follows head, plaques legible per Comfort §c. *(Amended 2026-11-01, AM-ARC-09 — CON-A8, MEC-1.)*
10. **Audio — the full migration (§3.5 as amended):** single shared AudioContext via the AudioListener, listener driven from `headProxy`; emitter registry with `dispose()` on room unload; `verb:` reverb presets; wing-key crossfade rule; four mute buses under `mu-snd`; caption bus live. **Verify:** head-turn pans bed + emitters in-headset; `ctx.resume()` fires from the Enter VR gesture, `sessionstart`, and `visibilitychange` return; 10× enter/exit leaves mute state and the sound toggle untouched. *(Expanded 2026-11-01, AM-ARC-09 — SND-1, SND-2.)*
11. **Living-room contract:** publish the `createExhibit` contract (§3.6) as `docs/museum/living/CONTRACT.md` so the 10 exhibit integrations build against it.
12. **Performance scope items (pilot deliverables, added 2026-11-01, AM-ARC-09 — MEC-4…MEC-7):** (a) the **light cut** — delete the second Hemisphere, remove the intensity-0 flashlight from the graph, bake the v88 SpotLight into a CanvasTexture lightmap and delete the light, pooled Points to the per-tier count at ≤ 12 m distance; (b) extend `bake()` to relic shared-MAT meshes and ship L0/L1/L2 LOD with build-time impostors; (c) build the portal adjacency graph at build time and count the Wing II atrium as a scoped space in every budget; (d) per-room texture atlases per budget §6; (e) shader pre-compile/warmup inside the masked transition; (f) build `vr-perf-overlay.js` **with** the pilot and run the §7 gate per pilot space, publishing per-room numbers (draws, tris, resident texture MB, light count).
13. **Cleanup:** confirm no second GL context, no examples imports, no CDN URLs, pixel-ratio caps intact, `webglcontextlost` handler shows the existing clear message (Standard §4 — never a silent white canvas), INBOX/OUTBOX untouched (relay discontinued — no agent-addressed messages in code comments).

**Explicit non-goals for this migration:** service worker (not needed), WebXRLayers app code (§2.5 — no), VR text-reader for full inspector cards (§3.4 — v2), `bounded-floor`, any change to wing JSON schema, any change to flat-mode UX.

---

## Appendix A — Security posture (for the High Council)

- WebXR exposes **no camera, no microphone, no geolocation**. `navigator.xr` provides poses of the headset/controllers/hands relative to the local play space only. The existing `Permissions-Policy: geolocation=(), microphone=(), camera=()` in `docs/_headers` remains correct and needs no XR carve-out.
- `requestSession('immersive-vr')` requires **user activation** (the Enter VR tap) — no background session can start. This is enforced by the browser, not by our code.
- No new network surfaces: no CDN, no telemetry, no model downloads (controller/hand visuals are procedural from core three.js). Hand joint data never leaves the device (it is consumed per-frame in the render loop).
- The session is same-origin, same-page; exiting returns to the exact flat museum. No redirects, no popups, no OAuth.

## Appendix B — Standards compliance notes

- **Modular Framework Standard:** vanilla ES6 module (`xr.js`), zero npm/CDN (§1); absolute `/assets/...` paths in the living-room contract (§2); `destroy()`/teardown on session end — rig hidden, lantern reparented, listeners removed via `{ once: true }` and explicit `removeEventListener` in `exitXR` (§3); DPR capped 1.5 touch today, per-tier foveation constants in XR (0.75 Q3 / 1.0 Q2, §2.3 as amended) (§4); context-loss shows the clear message (§4); single GL context (§3). Clauses 6–8 (ledger/neutrality/reversibility) are site-architecture concerns — the XR layer adds no state that bypasses them; note the reversibility contract explicitly: `sessionstart` owns a structurally identical `sessionend` inverse (rig shown↔hidden, lantern parent A↔B, foveation per-tier↔0, DOM hidden↔shown).
- **Artistry Standard:** controller wands and hand-joint rendering are bespoke bronze/bone/gold, not factory generics (§1, §2); XR panels reuse `canvasTex` parchment styling with chiaroscuro spot emphasis (§3, §4); label plaque uses eased fade, never popping (§3); all within Quest-class frame budgets (§5).

---

## Appendix C — Multiplayer Feasibility Appendix (Presence, not surveillance)

Social tone: **pilgrims, not players.** Fellow travelers visible as quiet presences — solemn, wonder-first, house voice. No voice chat, no scoreboards, no names-over-heads by default.

### C.1 Presence layer design

Synced per visitor: head pose (position + yaw/pitch — full quaternion unnecessary for ambient presence), hand/controller positions (tips only, not all 25 joints), room ID (which of the 83 rooms), join/leave events, one gesture channel (bow emote, max). That is the entire state — no chat, no text.

**Rate:** 10–15 Hz pose updates, delta-throttled (don't send when still); room changes and join/leave as immediate events. Ambient presence doesn't need 60 Hz — it needs smoothness, which client-side interpolation provides between sparse updates.

**Transport — recommend WebSocket for v1.** One persistent WS connection per visitor to a tiny presence server; server fans out state at 10–15 Hz. WebRTC data channels give lower latency peer-to-peer but require STUN/TURN (another service, another cost, NAT headaches on mobile) and per-peer mesh complexity that scales as n² — wrong for a first backend. Upgrade route (noted, not specced): keep the `PresenceProvider` interface (§C.3); a future WebRTC transport implements the same interface. Nothing else changes.

### C.2 Honest architectural implications — this is the first backend, ever

The Divine Archives is today a **free static site with no backend and no accounts**. Multiplayer is the first server this project would ever run. Spell it out:

- **Signaling/state-sync server:** GitHub Pages cannot do it — static hosting serves files, it cannot hold a socket or fan out live state. Minimum viable: a small always-on process (a single Node/Deno/Bun file, ~200 lines) that accepts WebSocket connections, keeps an in-memory map of visitor → {room, pose, shade}, broadcasts diffs at 10–15 Hz, and drops entries on disconnect. No database. No auth service. Hosted on a $5–6/mo VPS (Hetzner, Fly.io, Railway) or a serverless-WS service — either way it is a **new deploy pipeline, new uptime responsibility, new thing to watch**.
- **Identity model — recommend ephemeral pilgrims, no accounts, and NO displayed names** *(settled 2026-11-01, AM-ARC-08 — CON-A13)*: a visitor's presence is a light and a self-chosen shade; **no name is generated, assigned, or displayed** — the former recommendation here (generated names like "Pilgrim of the Second Wing" shown on proximity) is struck in favour of the interaction spec §9.4's rule, because a displayed pseudonym plus a persisted profile is the linkability the privacy posture exists to prevent. No registration, no email, no password — consistent with the site's no-accounts privacy posture. Cost of accounts instead: a user table, password/OAuth handling, GDPR deletion duties, a login UI, and a security surface the High Council would rightly flag. Whatever session state exists is **session-scoped and discarded on disconnect**. The synced-state list in §C.1 is the complete list of transmitted fields; any future field joins it only by amending §C.1 in the open (SEC-4).
- **Moderation — a solemn space needs protection.** Public shared rooms will attract griefers (blocking doorways, offensive names if free-text, gesture spam). Honest minimum: invite/private parties need almost none (§C.7). Public rooms need: no names at all and no free text (presence is name-free, §C.2 as settled), rate-limited gestures, a per-client block/mute (hide a presence locally), server-side kick via admin token, and — Carter's real cost — **someone watching**. At small scale that's Carter himself with a kick button; at larger scale it is a moderation burden no volunteer wants. Do not ship public rooms without answering "who moderates" first.
- **Server cost vs Ko-fi-only funding:** a presence-only WS server is $5–20/mo at small scale (one small VPS handles ~10 concurrent visitors trivially; ~100 concurrent needs a $10–20 box and some care). At ~1000 concurrent you'd need horizontal presence sharding or a managed realtime service (Ably/Pusher-style: ~$50–200+/mo at that volume) — but 1000 concurrent visitors is a success problem far beyond current traffic. Frame it: **the server costs less than a coffee per month until the museum is famous; fame is when the bill arrives.**

### C.3 Presence-ready pilot (single-user, presence-ready — not multiplayer)

The pilot ships **single-user only**. But architect the seam now so multiplayer is a swap, not a rewrite:

```js
// docs/museum/presence.js — interface, ships with the pilot
export class PresenceProvider {
  async join(session) {}                 // returns { pilgrimName }
  leave() {}                             // disconnect; discard all remote state
  broadcastPose(pose) {}                 // { roomId, headPos, headYaw, handTips[] } @10-15Hz
  onPresence(fn) {}                      // fn({type:'join'|'leave'|'pose'|'gesture', ...})
  destroy() {}                           // dispose listeners, per Standard §3
}
export class LocalPresenceProvider extends PresenceProvider {
  // pilot implementation: no-op. Zero network. Zero cost.
  // Renders nothing remote; the museum behaves exactly as today.
}
```

Visitor code (`tick`, rig updates, the pilgrim-lights layer §C.4) talks **only** to the provider. A future multiplayer build adds `NetworkPresenceProvider extends PresenceProvider` (WebSocket fan-out, same methods) — the swap is one import line. Presence representation and the lights layer are built once, against the interface, and light up the day a backend exists.

### C.4 The cheap evocative version — pilgrim lights

The highest magic-per-cost move: render other visitors as **glowing pilgrim-lantern lights** — a warm point sprite drifting at head height, its shade deepening as it nears (no names — §C.2 as amended). Feed points:

- **Map table / lectern directory:** tiny lights on the room map — "the museum is alive right now."
- **Heavens / God's-eye overview:** the Nine Wings as a constellation of lantern-lights.
- **Inside the museum:** distant presences as soft glows with the existing fog — presence without collision, without uncanny avatars.

Render cost is negligible (a handful of sprites + one shared material). **Honesty rule:** show REAL presence only once the backend exists. Before that, the pilot shows **nothing of other visitors** — never fake visitors. (The visitor's *own* light is theirs alone and is not "presence" in this appendix's sense.) If pre-backend atmosphere is desired, it must be labeled as ambient animation ("the archive breathes"), never as people.

### C.5 Presence representation — start minimal

Recommended ladder, ship rung 1 only:

1. **Pilgrim-lantern lights** (rung 1): warm glow on proximity — no name, ever (name-free presence, §C.2 as settled). No bodies, no voice.
2. Restrained robed-figure silhouettes (rung 2, later): simple dark forms with the lantern glow — attested-by-design, never realistic avatars.
3. **Never:** voice chat (moderation load + breaks solemnity), free-text chat, realistic faces, persistent identities.

Gestures: a single **bow emote** (head-proxy dip + lantern lower), rate-limited, the only social signal. Constrained by design — reverence is the feature.

### C.6 Privacy — "not surveillance" as architecture

- Positions are shared **only while an immersive VR session is active**; leaving the session (or closing the tab) stops broadcast and the server drops the entry immediately.
- **Ephemeral by construction:** no persistence, no history, no analytics in the presence server application; its visitor map lives in memory and dies with the process.
- No accounts, no device fingerprints. *(Narrowed 2026-11-01, AM-ARC-08 — SEC-5: the former absolutes — "no IP retention beyond the socket's lifetime," "nothing to subpoena" — claimed more than the application controls: the host's own logs are outside the app. The narrowed rule: the **application** retains nothing; **host log configuration** (what the VPS/platform logs, for how long, and how it is purged) is an explicit spec item for any future presence phase, answered before that phase builds, not asserted here.)*

### C.8 Future-phase security conditions (binding — Security Auditor, 2026-11-01)

*Recorded 2026-11-01 (AM-ARC-08 — SEC-3…SEC-8). These bind every phase after the
pilot; the pilot itself ships `LocalPresenceProvider` only (SEC-1, verified at pilot
spec §5.8).*

1. **A fresh security audit with an UPHELD ruling is required per future phase** that
   changes the network or social surface (network provider, WebSocket, invite codes,
   debate halls). The `PresenceProvider` swap being "one import line" is a capability,
   never an authorisation; turning presence broadcast on must be a distinct, visible
   visitor choice, not a silent default.
2. **WebSocket minimums:** `wss:` only; Origin checking; server-side validation and
   range-checking of every client-supplied field; connection and per-socket rate
   limits; any admin/kick token is a real credential — never in client code or the
   repo, with its storage and rotation answered in that phase's spec.
3. **Invite codes are bearer credentials:** scope, lifetime, revocation, and
   guess-resistance are specified before private parties are built, and the UX states
   plainly that anyone holding the link holds the key.
4. **Debate halls are re-specified, not inherited** (interaction spec §9.5 as amended):
   Permissions-Policy microphone change, per-hall opt-in, relay/retention rules, text
   handling, block/report for ordinary pilgrims, hall-keeper authentication, and a
   rejoin-evasion answer — all in that proposal, all audited before build.

### C.7 Scoping decision tree for Carter (no recommendation — pilot doesn't depend on it)

**A. Private pilgrim parties** (invite codes/links): one room-instance per code, cap ~8–12 visitors, server is tiny, moderation burden near zero (the inviter owns the room), cost stays $5–10/mo. Commits him to: code generation + share links, per-room instancing on the server.

**B. Public open rooms**: anyone walks in, rooms fill organically, the "alive museum" vision in full — but commits him to: name-free presence (no names, no free text), rate limits, kick tooling, someone watching, higher server headroom, and the moderation answer from §C.2. Cost scales with concurrency.

Both ride the same `PresenceProvider` seam. The pilot ships `LocalPresenceProvider` either way; the decision can wait until there is a backend budget and a moderation answer.

---

## ALIGNED 2026-11-01 — the backup, the black-screen law, and the resident this architecture doesn't know yet

*Appended on the program's reopening. Full gap map: `../files/vr-standards-alignment-2026-11-01.md` §§3, 6, 9.*

- **The §5 fallback matrix is the Every-Screen rule's third part, and it has one rung the matrix doesn't name.** Carter's Every-Screen rule (2026-10-31): a simple backup always exists. This architecture degrades XR → flat museum; the chain continues one step further — flat museum → **the flat text Directory**, the readable version of the same content that the 2026-11-01 walk verified working end-to-end. The full ladder (device-weight tiers above it) is tabulated in the performance budget's aligned section. Every failure path in §5 must terminate in content, never in a dead end.
- **Black-screen law.** §5's "never trap the user in a black headset view" now stands as a program-wide rule, flat included: no unmasked black frame at any gate, portal, or session start; a build that overruns its mask window holds a labelled, lit state (performance budget, aligned §). The flat walk's ~15-second black gate entries are the failure this law exists to prevent in both modes.
- **The resident seam (flagged, not specced).** This architecture was written (2026-10-12) for a museum of rooms and visitors. The museum now also has a RESIDENT — the Keeper — plus the Raven and the Grader (Archivist design settled 2026-10-29 → 2026-11-01). Nothing here provides for them: the Keeper is not a pilgrim light under Appendix C, not an exhibit module under §3.6, and not a `PresenceProvider` client. He will need his own architectural seam — a resident system with rounds, a study heartbeat, and the mirror passage — designed with the Keeper's production build, not bolted onto the presence layer. The absorption map and the open questions (including whether his Table stands inside pilot scope) are in the alignment doc §9 and §11. Until Carter rules, this note is the whole of the change: the gap is named here so no later phase designs around a Keeper-shaped hole by accident.
