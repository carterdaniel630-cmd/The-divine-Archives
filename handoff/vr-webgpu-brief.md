# WebGPU Integration Brief — Divine Archives Museum (+ exhibit program)

**Status:** SPEC DRAFT — Muse-side analysis. Enters the pipeline: VR-team review → Craft Council lenses → High Council audit → Claude Code implements in `carterdaniel630-cmd/the-divine-archives`.
**Order:** Carter, 2026-10-13T02:43:03Z — "add webgpu". Unanswered ~11h; this brief is the answer.
**Support facts checked:** 2026-10-13 via web (Chrome/WebGPU implementation status pages, three.js version matrix Jul 2026, engine backend survey Sep 2026). Anything marked UNVERIFIED needs the check named in §8.

---

## 1. What "add WebGPU" means here

Not a rewrite. A **renderer tier** inside the one build: the same scene graph, the same rooms, the same data — two possible GPU paths selected at runtime by feature detection.

- **Ship path stays WebGL2.** Maximum reach: every visitor, every browser, including the Quest 2 floor device and Samsung Internet. WebGL2 is the contract the pilot certifies against.
- **WebGPU is the enhancement tier, flat-mode only for now.** Where `navigator.gpu` yields a usable adapter, flat mode renders through three.js `WebGPURenderer`; XR sessions stay on the WebGL2 context until the WebGPU↔WebXR interop is proven production-ready (see §2, caveat).
- **Why it matters to this program:** compute shaders (incense smoke, gold dust, pilgrim-lights — thousands of them, on the CPU's day off), lower per-frame CPU overhead on mobile, and TSL NodeMaterials for richer PBR without hand-written WGSL. The GL2GPU study (ACM 2025) measured **~45% average frame-time reduction** WebGL→WebGPU, with Chrome engineers noting mobile shows the most extreme difference, and particle workloads improving 5–6× on weak GPUs. That is artistry headroom *inside* the phone-class envelope — the exact currency the performance budget trades in.

This is progressive enhancement with a reversibility contract, not a flag day. Forward = adopt the tier; reverse = fall back to WebGL2. The fallback *is* the reverse path (Modular Framework Standard, reversibility clause).

---

## 2. Support matrix — the honest version (checked 2026-10-13)

| Surface | WebGPU status |
|---|---|
| Chrome / Edge desktop 113+ | Yes, on by default |
| Chrome Android 121+, Android 12+, Qualcomm/ARM GPUs | Yes — **Carter's Galaxy S22 (US Snapdragon 8 Gen 1 / Adreno 730) qualifies in Chrome** |
| Samsung Internet (any) | **No WebGPU.** If Carter browses in Samsung Internet, he sees the WebGL2 tier. Verify which browser he uses — `webgpu-check.html` (§8) settles it in one tap |
| Safari 26+ (macOS Tahoe, iOS 26, iPadOS 26) | Yes — iPhone visitors get the enhanced tier too |
| Firefox desktop | 141+ Windows, 145+ macOS ARM; Android/Linux behind flag or Nightly |
| Chrome 146+ compatibility mode | WebGPU API over GL ES 3.1 / D3D11 hardware — widens the tier to older GPUs |
| Exynos / Samsung Xclipse GPUs | Excluded from the native tier per Sep-2026 engine survey — these devices take the WebGL2 path |
| Meta Quest browser | **UNVERIFIED.** Quest browser is Chromium-based; WebGPU exposure on the Quest 2 floor device must be checked in-headset (acceptance item §7) |
| three.js WebGPURenderer + immersive-vr session | **UNVERIFIED — assumed NOT production-ready until proven.** The brief treats XR sessions as WebGL2-only. If Claude Code proves otherwise on the floor device, the tier can extend to XR later |

The pilot (Phase 0) is **unchanged and ungated by any of this** — it ships WebGL2 and certifies in-headset on the Quest 2 floor device exactly as specced.

---

## 3. Standards fit — Modular Framework Standard (8 clauses)

- **Vanilla ES6+, zero npm/CDN:** WebGPU is a native browser API — no dependency at all. three.js `WebGPURenderer` ships in the vendored three core (r167+; the architecture doc targets vendored r186). TSL compiles to WGSL at runtime — no shader CDN, no build step.
- **Strict asset decoupling:** unchanged — the tier selects a renderer, never an asset path.
- **Deterministic destructor:** `renderer.dispose()` → `device.destroy()` + `canvasContext.unconfigure()`. GPU process residue is a teardown test item (§7).
- **Hardware throttling:** WebGPU has no `setPixelRatio` — the 1.0 mobile DPR cap is enforced manually: `canvas.width = cssWidth × min(devicePixelRatio, cap)`. The miser's rules (performance budget §8) apply to the tier, not the API.
- **Output discipline / ledger & compliance:** renderer-tier selection is a state change through the same ledger and neutrality validator as any other — failed feature detection rejects the change and the WebGL2 path proceeds (integrity fail-safe, exactly as the Standard describes).
- **Reversibility:** forward = adopt WebGPU tier; reverse = the WebGL2 fallback. Every frame the page can walk it back.

Artistry Standard fit: compute-driven particles and TSL materials are how "a visitor should want to touch it" survives the phone-class budget — atmosphere from shaders, not geometry.

---

## 4. Architecture change (for `vr-architecture.md` §2 / `app.js` migration)

Single canvas, single context-at-a-time — never two renderers alive together (Standard §3: one GL context per experience).

```
initRenderer()
  → selectRendererTier():
      1. if ('gpu' in navigator):
           adapter = await navigator.gpu.requestAdapter()
           if adapter:
             features = intersect(desiredFeatures, adapter.features)   // detect, never assume
             device = await adapter.requestDevice({ requiredFeatures: features })
             → WebGPURenderer({ canvas, device })   // FLAT MODE ONLY (see §2 caveat)
      2. else / on any failure → existing WebGL2 path, byte-for-byte today's behavior
  → on XR sessionstart: the XR path binds the WebGL2 context (xrCompatible), independent of flat tier
  → on sessionend: flat tier resumes; no user-visible transition
```

- `renderer.xr.enabled = true` stays on the WebGL2 renderer object. The flat-mode tier swap must not disturb the XR binding (architecture §2.B, the xrCompatible trap).
- Dirty-flag render gating (architecture §2.A) is preserved per mode.
- The magic-window phone preview (architecture §7) is the WebGPU tier's primary proving ground — Carter's S22 in Chrome is where the tier gets its first real numbers.

---

## 5. What it buys, concretely

- **Phase 3/4 fuel:** the Living Archive's pilgrim-lights (50 concurrent in Phase 3 exit criteria, more later) are a compute-shader workload. WebGPU makes the "alive museum" phone-class feasible instead of aspirational.
- **Frame budget headroom:** ~45% frame-time reduction buys back milliseconds the artistry budget can spend on materials and light.
- **TSL NodeMaterials:** richer PBR (stone grain, patina, gold) without hand-written WGSL — but every custom node still goes through the Craft Council's iconography rules (primary texts and archaeological record; no fantasy geometry — Artistry Standard parameter 2 is non-negotiable).
- **iOS reach:** Safari 26 support means the enhanced tier isn't Android-only.

---

## 6. Roadmap placement

- **Phase 0 (pilot): UNCHANGED.** WebGL2. No WebGPU work gates the pilot, the in-headset cert, or any Phase 0 exit criterion.
- **New Phase 2B — WebGPU enhancement tier (flat-mode),** inserted between Phase 2 (all 83 rooms) and Phase 3 (first aliveness) in `vr-roadmap.md`. It is the runway Phase 3's lights take off from.
- **Exhibit program (10 exhibits): no migration** until the museum tier proves out on the Quest 2 floor device + Carter's S22. Exhibits keep their WebGL2 micro-budgets (§8 of the performance budget).

**Decision gates (Carter-owned):**
- **DG-W1:** Approve the tier + the sequencing (WebGL2 pilot first, WebGPU enhancement after) — or countermand: pilot on WebGPU (faster to the shiny; gates reach; not recommended).
- **DG-W2 (Performance Sculptor):** the tier's frame budget — p95 must improve-or-hold vs WebGL2 on the S22 before it ships to visitors.

---

## 7. Acceptance criteria (Claude Code implements + verifies)

1. Feature-detect every optional capability (`adapter.features.has`, `device.features.has`, `navigator.gpu.wgslLanguageFeatures.has`) — never assume the Chrome feature set. Safari/Firefox partial implementations must degrade, not crash.
2. Any failure at any step → WebGL2 path, **zero user-visible error**. House voice: silent. No "your device lacks WebGPU" banner — the tier is invisible infrastructure.
3. `destroy()`: `device.destroy()` verified, canvas unconfigured, no GPU-process residue (teardown test, both tiers).
4. Context loss: handled per Standard §3 — never a silent white canvas, in either tier.
5. Perf gate: flat-mode p95 frame time on S22/Chrome improves or holds vs the WebGL2 baseline on the same device. A regression fails the tier — it does not ship.
6. Quest 2 floor device: `navigator.gpu` check performed in-headset and recorded. Tier stays flat-only unless this check passes AND the WebGPU↔WebXR interop proves out.
7. Compatibility mode (Chrome 146+): treated as tier-2 — allowed, but the p95 gate still applies.
8. Craft Council lens review + High Council audit before implementation, per the pipeline. A DISMISSED sourcing finding blocks, as always.

---

## 8. Open verifications (not blockers for the pilot)

- [ ] Quest 2 floor device: does its browser expose `navigator.gpu`? (Claude Code, in-headset cert)
- [ ] Carter's S22: Chrome or Samsung Internet as the daily browser? → open `webgpu-check.html` (this folder) on the phone — one tap, plain-English verdict
- [ ] three.js r186 `WebGPURenderer` + `immersive-vr`: session support status — assumed absent until proven
- [ ] iOS 26 Safari WebGPU perf on phone-class hardware (visitor-reach question, not a Carter-device question)

---

## 9. What this brief does not do

- It does not touch the pilot spec, the architecture's XR session lifecycle, or any Phase 0–2 exit criteria.
- It does not migrate any of the 10 exhibits.
- It is analysis/spec only. Implementation and verification live repo-side with Claude Code, after the councils — per the standing rule.

---

*Drafted 2026-10-13 (Muse-side) in answer to Carter's "add webgpu". Next: VR-team review, then the Wednesday Craft Council lenses, then High Council — unless Carter countermands the sequencing at DG-W1.*

---

## ALIGNED 2026-11-01 — the tier is the Every-Screen rule, in renderer form

*Appended on the program's reopening. Full gap map: `../files/vr-standards-alignment-2026-11-01.md` §3.*

Carter's Every-Screen rule (2026-10-31) postdates this brief and names what the brief already designs: **weight adjusts to the device** — the WebGPU tier is the rich version for strong devices, WebGL2 the lighter version of the *same content*, and the flat text Directory the simple backup that always exists. The brief's reversibility contract (§1, §3) is the rule's enforcement: a device that cannot run a tier steps DOWN a tier and keeps the content; it never meets a dead page. Two carried consequences: (1) the §8 open check on Carter's phone browser (Chrome vs Samsung Internet) is now also an Every-Screen check — which tier the curator's own eye judges from matters to every later verdict; (2) nothing in the tier may become load-bearing for content — if a surface needs WebGPU to be *reachable* rather than merely richer, it violates the rule and the parity contract both.
