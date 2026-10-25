# PR #77 re-review: the darker cloak (`d038119`) — 2026-10-25, build loop

**Reviewed:** `dbf5d16` ... `d038119` (the only change since the independent review), and the whole of
`origin/main` `c957af5` ... `d038119` through the automatic checks, against `reviews/REVIEWER.md` §3–§4.
**Reviewer:** a scheduled build-loop run that wrote none of #77 (the darker cloak was made by a chat session).
**Result: 0 findings.** Nothing merged, nothing pushed to the PR branch.

## Why this item this run
Next 1b (merge #76) is waiting: Lighthouse on `be51670` still running at 02:24 (started 02:12). Not waited on with the
lock. #75 waits on #76. The next item with no wait was this re-review, which #77 needs before it can go live.

## What was checked
- **Only the cloak changed.** 7 files: `cut.py` (a new `darken_cloak` step: dull, unsaturated olive/charcoal pixels
  inside the coat and hood areas ×0.62, soft-edged mask, eye boxes kept out), the regenerated art PNGs, two manifest
  sleeve colours and the two pre-load fallback colours in `treasure.js` (`#2b2b23` → `#1b1b16`). No other file.
- **The approved sheet is untouched** (`character-sheet-archivist-hooded.webp` identical to `dbf5d16`).
- **The face is not redrawn.** Comparing old and new art pixel by pixel: in the portrait, of 10,760 skin/beard-coloured
  pixels, 7 changed, by at most 4 of 255 (invisible); in the body art, 92 of 1,712 changed by at most 13, all at the
  soft edge where hood meets beard. Side-by-side pictures: face, eyes, beard, brass and scroll case look the same;
  only the coat and hood are darker. `portrait.png` and `portrait-smile.png` are still the same file (no invented smile).
- **Repeatable:** re-ran `cut.py` on a clean copy: every image and the manifest come out byte-identical to the committed ones.
- **Full build order** on a clean copy of `d038119`: 0 files changed. `review-checks.js --base origin/main --build`:
  9 passed, 0 failed, 0 warnings. 17/17 `verify-*.js`. 42/42 framework tests.
- **Headless phone** (390×844 at 3×, normal and reduced motion), own script: game opens, all art loads (manifest, body,
  thigh, shin, portrait, all `v=2`, HTTP 200); hero runs (60 → 160 px), jumps (rises ~73 px), casts the line; page
  390 px wide; 0 script errors (only the blocked outside font request). The darker hooded figure is visible against
  the dusk sky, with the scroll case showing.
- **§4 item 6:** no sacred object, holy site or revered person; the likeness is Carter's own approved sheet.
- **GitHub on `d038119`:** 5/6 green (guard, checks, test, runtime ×2); Lighthouse running (started 02:22).

## What #77 still needs to go live
1. #76 and #75 on `main` first (merge order), then #77 brought up to that `main` (merge commit; site diff must stay
   the one reviewed here).
2. Every check green on that head, Lighthouse included; local checks re-run by a run that wrote none of it.
Carter's per-item yes is recorded (`decisions-2026-10-25-hero-yes-darker-cloak.md`).

Items per run: 1.
