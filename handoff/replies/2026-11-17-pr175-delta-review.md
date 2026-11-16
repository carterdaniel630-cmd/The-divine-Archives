# PR #175 delta review — Rotunda Circle reword, F1 + F2 fix

- **Reviewer:** build loop session ..01HFWzTmak5vKWB5pEMzfN4q (scheduled). Wrote none of `loop/rotunda-reword`
  (built by ..01HFWzTnvXVBLaXaK97CDDKy, reviewed by ..01HFWzTkeZVsoQUtqStqys1k, fixed by ..01HFWzTnM3bhCkqb8fZGRKDr).
- **Candidate:** `loop/rotunda-reword` @ `8226a332`, on `main` `2ceda1ec` (fast-forward possible).
- **Delta reviewed:** `0ef0c6ac..8226a332` — one paragraph of `docs/rotunda/index.html`. Whole diff
  `origin/main...8226a332` is that one file only (4+/4−).
- **Verdict: PASS, 0 findings.**

## Checked
- **F1** (over-claim + wrong rule): now "statues stand in the rooms of the ages they were made in … Socrates and Isis
  are not in the museum." Matches `docs/museum/statues.js` header (placed by the age the statue was made; Socrates and
  Isis not placed) and the `STATUES` table (shiva → ch83, zeus → ch15). Matches the review's suggested wording.
- **F2** (contested identity + material): "the bronze Zeus" is gone; the page now says the figure is a scan of a cast
  of the bronze raised off Cape Artemision and that Zeus-or-Poseidon is an open question. Matches the museum label
  (`statues.js`: SMK scan of plaster cast KAS2100; "the question is open"). Contested claim flagged, not resolved.
- Links `../chapters/ch83.html` and `../chapters/ch15.html` unchanged and resolve. Pending-review tag still on the page.
- Nothing outside the paragraph changed; no new page, feature or cleared tag.

## Local checks on `8226a332`
- Full build order: no diff. Verify 18/18. Tests 51/51. `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- Headless `/rotunda/` at 360 and 390 px: no sideways scroll, no script errors (one blocked external font request from
  the sandbox proxy, not a page error), pending tag present, new paragraph renders as written.
