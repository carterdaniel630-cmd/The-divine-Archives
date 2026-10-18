# Modular Framework Standard — The Divine Archives (parallel build track)

Ratified by the user October 12, 2026. Every generation in the parallel
modular track MUST adhere. This complements (does not replace) the existing
Claude Code site architecture.

## 1. Architecture
Native, vanilla ES6+ JavaScript modules or standard Web Components only.
Absolutely zero external npm packages, wrappers, or CDNs. All custom styles
and rendering logic encapsulated inline.

## 2. Rendering security — strict asset decoupling
Component logic must accept absolute path pointers (e.g. `/assets/...`)
passed as a config block at construction. No hardcoded relative paths.
Components must mount cleanly at any site path.

## 3. Memory sanitization
Deterministic destructor (`destroy()` or `disconnectedCallback()`).
Explicitly release/dispose ALL scene geometries, textures, materials, and
active event listeners. Zero-leak footprint. One shared GL context per
experience — never spin up throwaway contexts.

## 4. Hardware throttling
Every system actively checks the user-agent. On mobile viewports: rigid cap
on devicePixelRatio at 1.0, bypass expensive processing (post-processing,
shadows), immediately switch to optimized low-poly counts or 2D asset
fallbacks. Render loop must survive failed frames; handle
webglcontextlost/webglcontextrestored with a clear in-game message.
Never a silent white canvas. Never a dead loop.

## 5. Output discipline
No introductory chat text, setup meta-commentary, or installation logs.
Deliver strictly: Target File Path, Asset Registry List, Raw Implementation
Block.

## 6. Ledger & compliance
Every state update or event sequence must map directly to our canonical
schema models. Implement strict append-only localized ledger state caching
within the component instance before flushing logs.

## 7. Neutrality & integrity
All dynamic data mapping logic must run through an algorithmic neutrality
validator module. If structural originality checks fail or a data payload
violates formatting schema contracts, reject the state change immediately
and trigger the rate-limit retry fail-safe.

## 8. Reversibility contracts
Every state change, animation vector, or layout structural translation must
register an explicit inversion pathway. A state mutate transition `forward()`
must possess a structurally identical `reverse()` mathematical inverse
contract to preserve atomic modular integrity.

## Applicability notes
- The Divine Casualties renderer rebuild (Oct 2026) was commissioned under
  an earlier four-point spec; clauses 1, 3, 4 match. Clauses 2, 6, 7, 8 are
  to be audited and retrofitted by the Craft Council.
- All new generations from this date forward are specified against all
  eight clauses.
