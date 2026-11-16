# Independent review — PR #175 Rotunda Circle reword (`loop/rotunda-reword` `0ef0c6ac`)

- **Reviewer:** build loop run, session ..01HFWzTkeZVsoQUtqStqys1k. Wrote none of #175 (builder ..01HFWzTnvXVBLaXaK97CDDKy).
- **Reviewed:** `origin/main...0ef0c6ac` (`main` = `2ceda1ec`; fast-forward). One file: `docs/rotunda/index.html`, meta description, eyebrow, lead, second paragraph.
- **Against:** `reviews/REVIEWER.md` §3–§4; Carter's yes `decisions-2026-11-16-carter-yes-rotunda-reword.md`; the placement on `main` (`docs/museum/statues.js` lines 1–11, 46–54; commit `bd9c7da8`).
- **Verdict: FIXABLE — 2 open findings.** Not mergeable yet.

## What checks out
- The page no longer says statues are being made for the Rotunda (Carter's ask met).
- Shiva → room `ch83` and Zeus → room `ch15` match `statues.js` on `main`; both links resolve; titles match the chapter `<h1>`s ("Global Hinduism & the Guru Movements", "Classical Greece").
- Zeus has no page under `docs/rotunda/` (true). Pending tag and banner unchanged.
- Local on `0ef0c6ac`: `review-checks.js --base origin/main --build` 9 passed / 0 failed / 0 warnings; headless 360 and 390: 0 script errors, no horizontal overflow, all 7 in-page links present.

## Findings

**F1 (honesty wording, over-claim + wrong rule).** "In the Virtual Museum the statues stand in the rooms of their traditions, not in the Rotunda" reads as if all statues, including the three on this page, stand in rooms. On `main`, Socrates and Isis are **not placed** in the museum (`statues.js` line 10–11; commit `bd9c7da8`). Also, the museum places each statue by **age** ("the room of the age its statue was made in", `statues.js` line 9), not by tradition.
Suggested: "In the Virtual Museum, statues stand in the rooms of the ages they were made in, not in the Rotunda: Shiva in the room for [Global Hinduism & the Guru Movements], and Zeus, which has no page of its own here, in the room for [Classical Greece]. Socrates and Isis are not in the museum."

**F2 (honesty wording, contested identity + material).** "the bronze Zeus" states the identification as settled and the object as bronze. The museum's own label says "Zeus or Poseidon" and that the hand is empty, so the question is open (`statues.js` 52–54); and the museum figure is SMK's scan of a **plaster cast** of the Artemision bronze, not the bronze. CLAUDE.md: contested claims flagged, not resolved.
Suggested: replace "the bronze Zeus" with "Zeus (or Poseidon: scholars still disagree), from a scan of a cast of the Artemision bronze," — or simply "Zeus" plus the open-question clause.

## Not checked / not yet met
- GitHub at review time (22:05 UTC): 4/6 green; `lighthouse` and one `runtime` still in progress on `0ef0c6ac`. Moot until a fixed head exists.

## Next
A run applies F1 + F2 on `loop/rotunda-reword` (any session; Carter's yes already covers the reword). Then a delta review by a session that wrote none of the fix, GitHub green incl. Lighthouse on the new head, local checks, merge by class (c) / per item as recorded.
