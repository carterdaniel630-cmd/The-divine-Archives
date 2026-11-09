Batch: Royal Game of Ur production pass, part 1 (PR #136)
Reviewed: 2026-11-09
Auto-pass: per reviews/status.json (not used; this is a loop review, merge is per item)
Covers: loop/ur-production@45919408
Summary: 0 passed, 0 fixed, 1 fixable (builder applies), 0 need you.
Reviewer: loop run, session ..01HFWzTmZp1oBFxxmRj6WVgy (wrote none of #136; builder was ..01HFWzTmB8Wjx82okwuFtMY8)

Verdict: FIXABLE, 1 finding (F1). Not mergeable until F1 is applied and a delta review passes.

Automatic checks (run on 45919408 in a separate worktree):
  - review-checks --base origin/main --build: 9 passed, 0 failed, 1 warning (Wikipedia share 33% in sources/games-ur-production.md; note, not a failure). Build left the tree clean.
  - verify-*.js: 18/18 pass. node --test framework/test: 42 pass, 0 fail.
  - GitHub on 45919408: test, checks, guard, originality, runtime x2 all green (no Lighthouse run: products/ only, docs/ untouched).
  - Diff is additions only in the game file (no "-" lines): rules, AI, text of record and the History panel's honesty marks untouched. Single file, no network requests (headless runs abort every non-file request; 0 errors).

Headless play (Playwright, phone emulation):
  - 360 px: 2 full two-player games to victory (166 and 198 moves), all five story lines told in order of event, victory overlay + victory record line shown, 0 script errors, 0 leftover ghost pieces, no sideways scroll.
  - 390 px: 60 moves, pieces visibly travelling (piece.travelling / ghost seen during moves), chronicle shown, History panel lists the 3 sources, 0 errors, no sideways scroll.
  - 390 px, reduced motion: 60 moves, no travel animation at all (correct), story still told, 0 errors.
  - The builder's 1280 vs-keeper run was not repeated.

FINDINGS
  - site:pr136/F1 (FIXABLE, honesty wording; checklist 1, 3, 4). The rulebook story line says: "The rules you are playing come from a clay tablet written about 177 BCE ... read by Irving Finkel". That states a reconstruction as fact. Finkel's own paper (the source cited) calls the route of play a proposal for which there is "no evidence" and the dice scheme a postulate, notes the tablet's game uses five differing pieces against Ur's seven identical ones, and suggests the tablet may record a later, specific version. Wikipedia (also cited) says Finkel "reconstructed" the rules and that some of his interpretations "are disputed". The game's own History panel already says this honestly ("scholarly reconstruction"; "Irving Finkel's reading made a playable reconstruction possible"), so the new line flattens an honesty mark the sold game carries.
    Place: products/games-of-the-ancients/royal-game-of-ur.html, STORY.rosette; and the matching row of sources/games-ur-production.md.
    Suggested wording (keeps every sourced fact, adds nothing new): "No rules were found beside those boards. The rules you are playing are a modern reconstruction: Irving Finkel of the British Museum worked them out from a clay tablet written in 177 BCE by the Babylonian scribe Itti-Marduk-balāṭu, more than two thousand years after these boards. Parts of his reading are disputed. How the players at Ur itself played, the record does not say."
    Why not NEEDS CARTER: no source disagrees with the corrected line; the fix brings the new text into line with the game's existing, already-sold honesty wording. Not a §5 self-fix (it changes what a claim says), so the builder applies it.

ADVISORIES (no action required)
  - The story toast is aria-hidden yet holds a pointer-clickable close button (tabindex -1). Screen readers get the line from the aria-live chronicle, so nothing is lost; fine as is.
  - Khorsabad line: the British Museum record (118809,b; 1850,1228.4) confirms the gateway in the citadel wall and the incised gameboard but does not name Sargon II or say "twenty squares"; both rest on the Wikipedia line ("graffito version ... gate sentinels from the palace of Sargon II"). Khorsabad as Sargon II's citadel is uncontested. Acceptable.
  - Kochi/"Asha" and the Crete/Sri Lanka line rest on Wikipedia alone (the warning above). Acceptable for a game story line; a stronger source would be better if atlas finds one.

Accuracy spot-checks
  - site:pr136 | Woolley found five boards in the Royal Cemetery, 1922–1934 | https://en.wikipedia.org/wiki/Royal_Game_of_Ur | supports
  - site:pr136 | boards date c. 2600–2400 BCE | same | supports
  - site:pr136 | tablet c. 177 BCE by Itti-Marduk-balāṭu; Finkel, early 1980s | same; https://csclub.uwaterloo.ca/~pbarfuss/On_the_Rules_for_the_Royal_Game_of_Ur.pdf (3 Nov 177–176 BC, BM 33333B) | supports
  - site:pr136 | "the rules you are playing come from" the tablet | Finkel PDF (route "no evidence", dice a postulate, 5 vs 7 pieces); Wikipedia ("reconstructed", "disputed") | does not support as worded -> F1
  - site:pr136 | gameboard incised between the hooves of a winged bull from a gateway in the citadel wall at Khorsabad | https://www.britishmuseum.org/collection/object/W_1850-1228-4_1 | supports
  - site:pr136 | Sargon II's palace, Khorsabad | Wikipedia article | supports
  - site:pr136 | four boards very like it in Tutankhamun's tomb | Wikipedia | supports
  - site:pr136 | boards as far as Crete and Sri Lanka | Wikipedia | supports
  - site:pr136 | popular until late antiquity; Kochi Jewish community played "Asha" until the 1950s | Wikipedia | supports

Religious sensitivity: none touched (no sacred object, restricted site or revered person shown).

Needs your decision: nothing from this review. (Merge stays per item: new build on a sold product.)
