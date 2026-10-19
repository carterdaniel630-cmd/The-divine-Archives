# Hit-feel, part 3 — Chess and Dominion (Item 31 #5)

**Run:** build loop, 2026-10-19 ~05:42–06:05 UTC. **Branch:** `loop/hit-feel-3` @ `d4b52cf`, stacked on
`loop/hit-feel-2` (`6c4efbc`, PR #71), which is stacked on `loop/hit-feel` (`ea70b77`, PR #70). **PR:** #72 (into `main`;
shows parts 1–2 too until #70 and #71 merge). Nothing merged.

## First: PR #71 Lighthouse re-check
Lighthouse on `6c4efbc` finished **green** at 05:32 UTC. #71 is now 7/7 green. It still waits on #70 merging first,
a fast-forward re-check, and Carter's yes.

## What part 3 does, in plain words
- **Archive Chess:** moving a god sets it down with a soft wooden knock. Taking a piece knocks stone on stone and rings
  low, with a small jolt and a flash in the taker's colour; taking a queen or rook hits harder than a pawn. Check sounds
  a two-note warning. Checkmate chimes (and buzzes on Android). Everything fires the moment the sliding piece lands.
- **Dominion of the Ancients:** placing an army knocks softly; each battle you fight clacks dice with a jolt, harder the
  more armies fell; a land you take sounds a rising horn with a gold flash (stronger for a walled capital); when a rival
  takes one of your lands, a short low drop and a dark flash. Winning the campaign chimes; losing falls. Battles between
  the two rivals stay silent, so their turns don't become noise.
- **Shared kit (`feel.js`):** six new impacts (place, capture, check, clash, conquer, fall). Nothing existing changed.
- **Reduced motion respected** (Item 31 #6): no shake in either game; flashes stay faint.
- Chess's drawing loop now keeps a single frame chain while a piece slides or a hit shows, so overlapping redraws can't
  stack up; a move made before the previous piece landed still gets its sound.

## How it was checked (on `d4b52cf`)
- Full build order: no generated changes. `review-checks --base origin/main --build`: **9/9, 0 warnings**. **17/17** verify
  scripts. **42/42** tests. No-undef lint clean on the 3 changed scripts (ESLint 10 with an equivalent flat config of
  `tools/eslint-games.json`; CI runs ESLint 8).
- Headless phone (390×844), normal and reduced motion:
  - Chess, two players, scripted: e4 d5 exd5 Qxd5 Nc3 Qe5+ → place, capture ×2, check all fired; then fool's mate
    (f3 e5 g4 Qh4#) → checkmate chime fired, status "Checkmate". Three moves against the AI: no error.
  - Dominion, scripted reinforce and attack over several turns: place, clash, conquer, fall and lose all fired.
  - Shaken frames with normal motion: chess 96, Dominion 434; **under reduced motion: 0 / 0**. **0 script errors** (the
    only console error is the external font host, blocked in this sandbox).
  - Every new impact also fired directly in the browser with no error. The card-trade chime did not come up in play;
    it uses the existing "big" impact, fired directly with no error.
- Screenshots: `handoff/previews/hit-feel-3/` (chess just after Qe5+, Dominion just after taking Arabia). A still cannot
  show the feel: Carter's phone check is the verdict.

## Not in this part
The Unfinished Journal already has shake (PR #60 is on hold on that file). Divine Casualties is parked. This completes
hit-feel on the arcade games that are live.

## To merge
#70 first, then #71, then this. Needs an independent review by a run that wrote none of this, every GitHub check green
(Lighthouse included), and Carter's yes for this item.

Items per run (Item 32): 1 item (plus the quick #71 re-check), one code push, one handoff push with the lock folded out.
