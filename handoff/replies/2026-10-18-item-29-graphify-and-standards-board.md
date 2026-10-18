# Item 29: Graphify brought to standard (part 1) and the standards board (first version)

**Date:** 2026-10-18. **Branch:** `ccr-35f1088e-m4hwip` (built from `staging/ready-line` `ae8091d`). This was a
separate session working alongside the loop run that held the lock at 01:13 UTC; it touched only `.graphifyignore`,
one new tool and `handoff/`, so it does not collide with the loop's item 1 (rebasing the `loop/*` branches).

## What changed
- **Graphify held to the bar.** Checked: the CLI installs at session start, and the published map matches `main`
  (`218c51b`). Defect found: about 47% of the map was third-party library code (minified three.js and
  OpenSeadragon in `docs/assets/vendor/`), including the largest area of the map. `.graphifyignore` now leaves out
  `docs/assets/vendor/` and `*.min.js`. Rebuilt locally: 6,142 symbols to 3,313, all project code.
  Still open: Graphify's areas are numbered, not named (naming needs an AI backend, which the workflow does not use).
  The board names each area by its main file instead.
- **Standards board.** `handoff/standards/board.json` lists every item (Claude side and Muse side) with one of the five
  Item 29 states. `node tools/build-standards-board.js` writes `handoff/standards/board.html`, worst first, colour-coded,
  and adds what the Graphify map knows about each item's files (code symbols, which files call into them).
  Phone view: https://claude.ai/artifact/8xFoiVPYGWFd7Xax8q5NLt

## How it was checked
- `node --check` on the new tool; the board builds; every status in `board.json` is one of the five states (the tool
  fails otherwise).
- The map facts were spot-checked against `graphify query`.
- No `docs/` file changed, so the site build order and verify scripts are unaffected.

## For the loop
- Fold Item 29 into STATUS → Next: keep `board.json` current at every checkpoint (same commit as the work), and
  rebuild `board.html`.
- Merging this branch needs Carter's go-ahead, like every merge. The `.graphifyignore` change takes effect on the
  next Graphify run from `main`.

## Needs Carter
- Merge this (Graphify fix + board) into `staging/ready-line`, then `main`? Recommended: yes.
- The board shows getconexto.com is not pointed at the site yet. That is DNS, so it is yours, or tell a session to do it.
