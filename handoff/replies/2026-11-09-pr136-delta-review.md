# PR #136 delta review — Royal Game of Ur production pass part 1, F1 fix (2026-11-09 ~07:55 UTC)

Reviewer session: ..01HFWzTk...5c5bXfc (scheduled loop run). Wrote none of #136 (builder ..01HFWzTmB8Wjx82okwuFtMY8)
and none of the F1 fix (..01HFWzTmZp1oBFxxmRj6WVgy). Reviewed `45919408..e0bbc8c8` on `loop/ur-production`
against `reviews/REVIEWER.md` §3–§4 and the F1 finding in `2026-11-09-pr136-independent-review.md`.

Verdict: **PASS, 0 open findings.** site:pr136 F1 → FIXED.

## Delta
Two lines, two files: `products/games-of-the-ancients/royal-game-of-ur.html` STORY.rosette, and the matching row of
`sources/games-ur-production.md`. The new line is the review's suggested wording verbatim. No other text, rule, AI or
honesty mark changed.

## Accuracy spot-checks (re-read today)
- site:pr136 | rules are Finkel's reconstruction | Wikipedia "Royal Game of Ur": "reconstructed the basic rules of how the game might have been played" | supports
- site:pr136 | tablet written 177 BCE by Itti-Marduk-balāṭu | same: "a clay tablet written c. 177 BC by the Babylonian scribe Itti-Marduk-balāṭu" (Finkel 2007, cited: 177–176 BC) | supports
- site:pr136 | "Parts of his reading are disputed" | same: "Finkel's interpretation of certain rules are disputed, particularly the pathway around the board" | supports
- site:pr136 | "more than two thousand years after these boards" | boards "around 2,600–2,400 BC" → 177 BCE is ~2,220–2,420 years later | supports
- Contested claim now flagged, not resolved; matches the game's existing History-panel wording ("scholarly reconstruction").

## Checks (worktree at `e0bbc8c8`)
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 1 warning (Wikipedia share 33%, unchanged note). Tree clean after build.
- `tools/verify-*.js`: 18/18 pass. `node --test framework/test/*.test.js`: 42 pass, 0 fail.
- Headless 360 and 390: page loads with network blocked, `tell('rosette')` shows the new line in the chronicle, 0 script errors, scrollWidth = viewport (no sideways scroll).
- GitHub on `e0bbc8c8`: test, checks, guard, originality, runtime ×2 all green (products/ only; no Lighthouse run, docs/ untouched).
- Religious sensitivity: none touched.
- graphify CLI missing in this session; not needed for a two-line wording delta.

## Needs your decision
Merge stays **per item** (new build on a sold product): Carter's yes for #136.
