# Awithlaknannai — "Fighting Serpents" (Zuni board game)

**Carter-approved 2026-10-18.** Playable 3D reconstruction of the Zuni (A:shiwi) board
game documented by Stewart Culin in 1907. Two lines of stones ("serpents") fight
across a long, narrow board.

## Files

- **awithlaknannai.html** (45 KB) — the complete game. References `three.min.js`
  via `<script src="three.min.js">`.
- **armory-entry.md** — full rundown: sources, board layout, rules, interaction
  details, and rebuild notes.

## three.min.js — NOT INCLUDED (669 KB, exceeds staging size limits)

Source **three.js UMD r150+** and place it alongside as `three.min.js` before
opening the file. The deprecation console warning in the vendored copy is cosmetic
only — the game runs clean on r150.

## What Claude should know

- The rules engine at the top of the inline script is **pure, DOM-free logic** —
  reusable as-is for the repo build. 20/20 unit tests pass (topology, both setups,
  forced opening capture, compulsory captures, multi-leap chains, termination).
- Board verified against Culin 1907 + Bell + the Cyningstan correction (25 points,
  leaning diagonals, 54 edges). Respect framing: living people's game, sources named
  on the page, gaps labelled as gaps.
- **Open question for the rebuild:** the end curves are decorative here (end points
  already joined by diagonals); confirm against Culin's diagram whether they should
  be traversable lines.
- Scene conventions follow the Tabula build (candlelit palette, orbit/zoom,
  gold-ringed legal-move highlights).
