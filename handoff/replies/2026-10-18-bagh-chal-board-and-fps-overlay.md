# Build loop, 2026-10-18 ~12:30 UTC: Bagh-chal board fixed; museum frame-rate overlay already live

**Short version.** The museum phone speed (#62) and batch B (#63) merges are still waiting on Lighthouse, which was
still running at 12:25 UTC on both, so this run did not hold the lock for them. It did two smaller things instead:

1. **Museum `?fps=1` overlay (Next #3): already built and live, nothing to do.** It went in with the museum sample
   on 2026-10-06 (`ab2e7fc`, plan approved by Carter that day) and is on `main` in `docs/museum.html`. Checked
   headless at iPhone size: `museum.html?fps=1#ch02` shows the overlay (frame rate, average, worst second, longest
   frame); plain `museum.html` shows nothing; no script errors. Screenshot:
   `handoff/previews/museum-dpr/museum-fps-overlay-phone.jpg`. (Software graphics here, so the numbers on it mean
   nothing; Carter's phone is the real measure.) Small note: on a phone the overlay sits over the Sound and Motion
   buttons in the corner. It lets taps through (`pointer-events: none`) and only appears with `?fps=1`, so it is left
   as is.
   **For Carter:** to measure, open `the-divine-archives.pages.dev/museum.html?fps=1#ch02` on your phone.
2. **Bagh-chal board (small defects part 2, first piece; fix package §19).** The preview game drew both diagonals
   in every square, so pieces could move diagonally from any point, and its rules text called that "the standard
   board". Fixed in `handoff/exhibits/wave3/bagh-chal.html` (a preview, not on the live site):
   - Diagonals now run only through alternating points (row + column even): each of the four large squares is
     crossed corner to corner and a diamond joins the midpoints of the sides, the alquerque-pattern board.
   - Move rules follow the drawn lines: a point like B2 has 8 neighbours, C2 only 4, corners 3. Tiger jumps stay on
     a straight line (checked for every point).
   - The rules panel no longer says every square is crossed or calls the full-diagonal board "standard"; the board
     note under "Reconstructed" now says hand-drawn boards vary in small details.
   - Sources line adds the Exeter Abstract Games board notes.

## Sources (opened this run)
- Exeter Abstract Games, "Bagh Chal": https://exeterabstractgames.org.uk/node/156 : the board "is the same as is used
  for Alquerque"; "B2-C3 is allowed, but C2-D3 is not"; B2 has 8 moves, C2 only 4.
- RulesPal, Bagh-chal rulebook: https://rulespal.com/bagh-chal/rulebook : "diagonal lines crossing each of the four
  large squares", plus "further diagonals connecting the midpoints of the sides".
- Ludii, Bagh Chal (game 10): https://ludii.games/data.php?gameId=10 : tigers start on the four corners (Parlett
  1976; Hora 1933). Does not say which diagonals are drawn.
- Wikipedia "Bagh-chal" could not be opened from here (the fetch was not allowed in time), so it is not relied on.

## Checks
- Adjacency check (Node, on the file's own code): counts by row `3 3 5 3 3 / 3 8 4 8 3 / 5 4 8 4 5 / 3 8 4 8 3 /
  3 3 5 3 3`; 56 lines (40 straight, 16 diagonal); symmetric; every jump lands along a drawn line.
- Headless phone (iPhone 13 size): game loads, goats placed, tigers answered with legal diagonal moves, no script
  or console errors. Screenshot: `handoff/previews/bagh-chal/board-alquerque-pattern.jpg`.
- Full build order (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry, sky): no file
  changed. 17 verify scripts green; framework tests 42/42; `review-checks.js --base origin/main --build`: 9 passed,
  0 failed.

## Not done / next
- Rest of small defects part 2: zodiac `dispose()`, Oracle Bones wording, Google Fonts out of two exhibits, Grimoire notes.
- #62 merge: next run, once Lighthouse on `0585c80` is completed and green. Then #63 per its STATUS steps.
