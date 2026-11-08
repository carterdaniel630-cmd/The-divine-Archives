# PR #132 — independent review (pack-six G-1..G-5 fixes)

Reviewer: loop session ..01HFWzTkzFRRyNHhEw5KZKcz, 2026-11-08 ~21:05 UTC. Wrote none of #132 (builder ..01HFWzTnBjWYHocgJKmWS943).
Candidate: `loop/pack-six-g-fixes` @ `68e48e2e` (parent `70b91549` as-sold baseline, off `main` `593d7d17`).
Checked against `reviews/REVIEWER.md` §3–§4.

**Verdict: PASS, 0 open findings.**

## §3 automatic checks (on `68e48e2e`)
- `node tools/review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings; tree clean after build (`docs/` unchanged).
- `tools/verify-*.js`: 18/18 ok. `node --test framework/test/*.test.js`: 42/42.
- GitHub on the PR: 4/4 green (checks, guard, runtime ×2). Lighthouse does not run: no `docs/` or Lighthouse-tool path changes.

## Baseline is truly as sold
- All six files in `70b91549` are byte-identical (`cmp`) to `handoff/pack-six/*.html`, and those MD5s match atlas's manifest
  (`handoff/pack-six/README.md`) and the folder README table. Ur is the v2 baseline of record (a4018f09…).

## The fix diff (`70b91549..68e48e2e`, 47+/2−)
- Every change is CSS appended in a `<style id="g-fixes-2026-11-08">` block, except:
  - Hnefatafl: one existing line, wood-grain stripe `#fff` → `#ffffff0d` (G-3);
  - Mancala: two `aria-hidden` row labels ("Keeper's row", "▲ Your row — tap a pit to sow") (G-4);
  - Ur: one status string, "Choose a glowing piece." → "Choose a glowing piece or square." (G-5). A word-level diff confirms
    this is the only change inside the script; no game logic, rules text, history text or honesty mark changed.
- Ur G-2: the light-scheme override sets exactly the 20 variables of the file's own default (dark) `:root`, value for value
  (script-compared), and `color-scheme:dark`. No shadow DOM, so the document-level rules reach the component.

## §4 checklist
1. Accuracy: no factual text added or changed (labels and one status line only). Pass.
2–5. Lens balance / tiers / contested / tone: no content changed. Pass.
6. Religious sensitivity: board games only; no sacred object, site or revered person touched. Pass.
7. Games, headless (Chromium, 390 × 844, touch), both commits, light and dark, all six games:
   - 0 script errors, 0 network requests, no sideways scroll, including after 150 random taps per game.
   - Controls under 44 px tall: baseline 28 (Ur) / 133 (Hnefatafl) / 2 / 3 / 3 / 3; after the fix **0 in five games**. Hnefatafl's
     remaining 121 are exactly the 11 × 11 board squares at 28 × 28. This is disclosed in the commit and the CSS comment: 44 px would
     need 484 px of width. 28 px is above the WCAG 2.2 (2.5.8, AA) 24 px minimum. The audit's G-1 had listed "board cells"
     for Hnefatafl, so this part of G-1 is a reasoned partial fix, not a miss. Carter can see it when he gives his yes.
   - G-5 by hand: two-player match, cast 4, one glowing square shown, tapping it entered a piece (`white` [0…,4]); status
     read "Shell cast 4. Choose a glowing piece or square."
   - By eye (screenshots, before | after): Ur in light mode is now the night palette, with readable eyebrow, subtitle,
     legend and the Sound / How-to-play buttons. Hnefatafl's status card stripes are gone and the text is clear. Mancala
     shows both row labels with nothing overlapping.

## Notes (not findings)
- Pre-existing, outside G-1..G-5, already noted by the builder: Ur ledge covers "THE TURN"; Mancala edge strips.
  Also seen: Hnefatafl's gold "11 × 11 tournament version" link text is dim on the dark card in both commits (unchanged by this PR).
  These belong to the later full rebuild (item (c)).
- **Re-synced by this run:** `main` had moved to `2c350132` (#131). This run merged `main` into the branch. The new head is
  **`77d006e6`**: `68e48e2e..77d006e6` adds only #131's reviewed 3-line `tools/data/relic-stills.json` diff, so the head now
  fast-forwards from `main`. On `77d006e6`: review-checks 9/0/0 with build (tree clean), verify 18/18, tests 42/42.
  GitHub checks must be green on `77d006e6` before merge.
- Class: **per item** (new build work on a sold product). Merge needs Carter's yes for #132.
