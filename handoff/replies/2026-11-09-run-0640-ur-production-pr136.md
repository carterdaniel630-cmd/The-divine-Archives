# Royal Game of Ur production pass, part 1 — built as PR #136 (six-game rebuild, item (c))

**Run:** 2026-11-09 ~06:40–07:15 UTC, session ..01HFWzTmB8Wjx82okwuFtMY8 (same session as the R1d2 review of #135,
`2026-11-09-pr135-delta-review-2.md`; this firing's payload asked for R1d2, already done, so the run took the next item).
**Branch:** `loop/ur-production` `45919408` (2 commits on `main` `43850da4`), **draft PR #136**. Products folder only;
`docs/` unchanged, so the live site does not change.

## What it is
First piece of the six-game production rebuild (`games-visual-upgrade-order-2026-11-04.md`): **Ur only, part 1.**
- Pieces travel the road square by square (from the waiting panel, home to the panel; a captured piece is carried back).
- Five story lines from the record rise during play (start, first rosette, first capture, first piece home, victory),
  each sourced (`sources/games-ur-production.md`; sources also listed in the game's History panel). The rulebook line
  says where the record runs out ("How the players at Ur itself played, the record does not say").
- Game script, rules, AI, text of record: **byte-for-byte unchanged** (the diff to the game file is additions only).
  Still one file, no network requests.
- Not yet: the era's world around the board (part 2). Acceptance per the order is Carter's phone walk.

## Checks (builder)
review-checks `--build` 9/0/1 (warn: source log >20% Wikipedia; Kochi and Tutankhamun lines rest on Wikipedia alone);
verify 18/18; tests 42/42 after rebuilding the registry for the new source log. Headless (`handoff/previews/pr136/ur-play.js`,
`ur-ai.js`): 5 full two-player games at 360/390 and one vs the keeper at 1280, 0 script errors, no sideways scroll, no
leftover animation elements; reduced-motion run clean. Screens: `handoff/previews/pr136/`.

## Next
- **(c-r) independent review of #136** by a session other than ..01HFWzTmB8Wjx82okwuFtMY8: diff is additions only
  (`git diff origin/main...loop/ur-production -- products/` shows no `-` lines in the game file); re-open every source;
  play to the end at 360/390. Then Carter's per-item yes (new build on a sold product); atlas swaps the file.
- #135 still waits only on Lighthouse on `42d2263a` (attempt 2 running at 07:01 UTC).
