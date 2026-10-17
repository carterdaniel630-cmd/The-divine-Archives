# Teardown & Disposal — Confirmation Status (2026-10-12)

Per-exhibit status of explicit, isolated memory disposal patterns.
Basis is stated for each — attested means the builder's handoff claims
it; unverified means no independent confirmation exists. Nothing here
is blanket-confirmed beyond its evidence.

## Confirmed pattern present (builder-attested, not independently verified)
- **oracle-bones-of-anyang** — handoff states explicit teardown.
- **the-library-rescue** — handoff states cleanup via pagehide, listener/
  timer removal, WebGL buffer/program deletion, context release. Unified
  lifecycle spec (library-rescue-lifecycle.md) defines the required
  deterministic destroy order for integration.
- **mehen** — handoff states explicit teardown.
- **the-i-ching** — handoff states explicit teardown.

## Likely present (source scan found disposal-shaped code; not verified)
- **senet**, **hnefatafl** — not flagged in the missing-dispose scan;
  independent confirmation outstanding.

## UNVERIFIED — deferred to integration audit
- **the-royal-game-of-ur** — no explicit `.dispose()` in source scan;
  repair-check inspection was inconclusive (fixed an unrelated flow bug).
- **the-antikythera-mechanism** — same: scan negative, inspection fixed
  an unrelated calendar bug instead.
- **the-astrolabe** — same: scan negative, inspection fixed an unrelated
  pointer-reachability bug instead.
- **the-alchemist-s-magnum-opus** — teardown was listed as "to check";
  never confirmed.

## Batch-emitted datasets
- Zodiac glyphs (`glyphs.js`) and the museum expansion manifest carry
  `dispose()` / `disposeAll()` hooks by construction (batch protocol).
- The 5 Vault manuscripts will carry the same hooks when emitted.

## Mobile performance posture (verified where stated)
- DPR hard cap 1.0 on mobile: verified in device audits across exhibits.
- Guarded render loops, context-loss handling: verified present.
- What disposal verification adds: proof that repeated mount/unmount
  returns listener, timer, and GPU-resource counts to baseline — this is
  CI gate #2 in library-rescue-lifecycle.md and item 6 of the shared
  audit contract. It has NOT been executed against these builds.

## Bottom line for CI
Do not gate integration on a blanket teardown claim — gate it on the
per-exhibit checks above. The four UNVERIFIED exhibits must pass the
mount/unmount ×20 residue test before they ship.
