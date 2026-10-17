# Defect: Blurred Symbols on the Rolodex Wall
**Reported by Carter, 2026-10-13. Fix required before or during Claude's rework.**

## The problem
In the museum hall where symbols scroll down the wall like a Rolodex, some
symbols render as gray blur splotches among the real symbols. They look wrong
— blurry gray blobs scrolling with crisp symbols.

## Carter's directive
Either UNBLUR the symbol (show the real symbol) or REPLACE it with a
different real symbol. Gray blur splotches are not an acceptable third option.

## Technical findings (atlas, read-only repo inspection 2026-10-13)
- The blur is NOT applied in code. No `blur`, `censor`, `redact`, or `mask`
  logic exists in `museum.css`, `style.js`, `world.js`, `app.js`, `relics.js`,
  `ritual-views.js`, `reliquary.js`, or `scans.js` (only match: a window
  `blur` event listener for clearing keys).
- The symbol walls are sprite sheets: `docs/museum/symbols/{bronze,axial,iron,
  late,medieval}.webp` with layout JSON. The blur is BAKED INTO the sprite
  images.
- Fix = regenerate the affected sprite cells with the true symbols (or
  substitute symbols), then rebuild the affected `.webp`.

## Policy note
This defect is also a Content Truth Policy violation (handoff/
content-truth-policy.md): the archive does not blur its own exhibits.
