# Handoff prep — Arcade tap targets, part 2 (Excavation cells + Ziggurat pad)

Status: PREPPED in chat, Carter approved the prep 2026-10-28. NOT staged to GitHub yet — ships only on Carter's go.
Measured from live main @ 68b7b03 (2026-10-28). Source copies measured: `docs/assets/games/excavation.js`, `docs/assets/games/ziggurat.js`, `docs/assets/games/games.css` (copies in `./research/`).

## Background
Part 1 (PR #86, live) brought the shared game chrome to the 44px tap guide: text buttons grow to 44px tall on touch screens, and small square buttons (Close, Full-screen) keep their look and take the touch through an invisible 44px layer centred on each (games.css ~line 263). Part 1's audit left exactly two spots over: the Excavation grid cells and the Ziggurat on-screen pad. This item is those two, nothing else.

The requirement is the outcome, not a mechanism: on a phone, a player must be able to tap the exact cell/key they mean, every time, with no wrong-cell digs — verified in headless phone tests at 320 / 360 / 412 px widths, the same way part 1 was verified. Keep both games' current look and art. Respect reduced-motion (already the house rule). Claude may pick a better mechanism than the ones proposed below; the measured facts and the outcome are what must hold.

## 1. Ziggurat on-screen pad — straightforward size floor
Facts (games.css):
- `.zig-pad` is a 4×2 grid; its buttons reuse the `.ouro-key` style. The 8 keys: rotate, counter-rotate, hold, left, pause, right, soft drop, hard drop (ziggurat.js ~line 215).
- Desktop: tracks are 3rem = 48px — fine.
- `@media (max-width:520px)`: tracks shrink to 2.5rem = **40px** — under the guide.
- `@media (max-width:520px) and (max-height:680px)`: tracks shrink to 2.2rem = **35.2px** — well under.

Fix: the pad keys never go below 2.75rem (44px) on touch screens — change the two shrink values (2.5rem, 2.2rem) to a 2.75rem floor instead. At 320px wide the pad is then ~190px across, which fits easily. The risk is vertical fit on short screens (that 2.2rem shrink exists so board + pad fit without scrolling): growing the pad adds ~35px of height. If board + pad no longer fit on a 360×640 phone, take the space from the well/monument sizing (`.zig-well` / `.zig-mon` in the same media queries), NOT from the keys. Verify: whole game, pad included, on screen without scrolling at 320×568, 360×640, 412×915.
Note: Ziggurat also has swipe controls and keyboard; the pad is still the control most phone players will find and use, so it gets the full standard.

## 2. Excavation grid cells — the honest hard one
Facts (excavation.js ~line 34; games.css lines 432–433 and the visual pass at 581–591):
- Levels: Novice 9×9 (the default), Adept 12×12, Master 14×14. Cells are real buttons (`.ms-cell`) in a CSS grid; grid width is min(100%, 34rem) with 10px padding and 2px gaps in the current visual pass.
- Measured cell size on phones today: at 360px wide — Novice ≈36px, Adept ≈26.5px, Master ≈22.4px. At 320px wide — Novice ≈31.6px, Adept ≈23px, Master ≈19.6px. (`.ms-cell` also carries `min-width:1.4rem` = 22.4px, which is where Master sits.)
- The part-1 invisible-layer trick must NOT be used here: in a packed grid the 44px layers would overlap neighbouring cells and taps would land on the wrong square — a wrong dig is the worst outcome this game has.
- Cells also serve mouse players on desktop (Master ≈35.6px at the 34rem cap); the 44px guide is a touch standard — scope this fix to touch/phone.

Proposed route (Claude may improve it):
- Novice is the default and most-played level: trim grid padding/gaps on small screens (padding 10px→4px, gap 2px) so Novice cells reach the practical full-width maximum (~37–38px at 360px), and accept that a 9-across board cannot physically reach 44px full-width on a phone — the guarantee that matters is no overlapping hit areas and a forgiving, accurate tap.
- Adept and Master: give the board a zoom. A zoom control (and/or double-tap on the board) scales the grid so cells reach ≥44px, with drag-to-pan on the board to move around; the existing `.ms-grid-wrap { overflow:auto }` is a starting point. Long-press flagging must keep working — pan needs a small movement threshold so a press is never read as a pan, and flag mode (the toggle button, already 44px via part 1) stays as the no-long-press alternative.
- Whichever mechanism ships, the acceptance test is behavioural: scripted taps at cell centres AND near cell edges/corners on all three levels at 320/360/412px widths must dig/flag the intended cell only.

## Already covered — do not redo
- Excavation's Flag-mode and Level buttons are `.rq-btn` and already get the 44px touch height from part 1. Same for both games' Close / Full-screen / menu buttons.

## Acceptance
- Headless phone runs at 320 / 360 / 412 px: Ziggurat pad keys measure ≥44px and the full game fits without scrolling; Excavation tap-accuracy test passes on all three levels (centres and edges).
- Desktop play of both games unchanged in look and feel.
- Fresh independent review, 0 findings, before it is offered to Carter for merge — same as every loop item.
