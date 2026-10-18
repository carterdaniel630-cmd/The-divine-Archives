# Independent review — site batch A (PR #59, staging/ready-line → main)

**Run:** build loop, 2026-10-17 ~21:10–21:30 UTC. **Independence:** this run wrote none of the site changes
(`docs/`, `tools/`, `framework/`, `.github/`); its only commits on this branch are under `handoff/`.
**Carter's controlling records:** Item 23 (`decisions-2026-10-17-charter-and-pr59.md`), Item 24 merge order
(`order-2026-10-17-merge-pr59.md`), Tomb Robber confirmation (`decisions-2026-10-17-tomb-robber-confirmed.md`: keep the rename).

Batch: site batch A (over-claims, trademark ids, Hades, The Unfinished Journal, Lighthouse workflow)
Reviewed: 2026-10-17
Auto-pass: SUSPENDED (`reviews/status.json`: "no baseline test batch yet"). Every verdict below is a would-pass
verdict; Carter's Item 23/24 order ("merge PR #59 if up to standard, every check green") is his decision on them.
Covers: site content of `ac6d5fa` (the last commit touching anything outside `handoff/`). Every later commit up to
`6b7420c` and this report touches `handoff/` only (checked with `git diff --stat ac6d5fa..HEAD`).
Diff reviewed: `origin/main (c455bfe)...HEAD`, 74 site files, +492 / −319. This re-review covers the changes since
the last review (`2ab371d`): the Tomb Robber → Unfinished Journal rename (`6b419fd`) and the Lighthouse fix (`ac6d5fa`).
Summary: 11 would-pass, 0 fixed, 0 open findings, 0 NEEDS CARTER beyond the auto-pass hold Carter has answered. 2 notes.

## Automatic checks (this run, local)
- Full build order (stamp-dates → build-og → vault → chapters → pages → museum → framework → entity-registry): clean, **no drift** (working tree unchanged).
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- All 17 `tools/verify-*.js`: pass. `node --test framework/test/*.test.js`: 42/42.

## Headless phone check (390×844, touch, this run)
index, symbols, pilgrimage, museum, arcade, Library of Alexandria, Qumran, and all twelve-catalog renamed games
(`#play=labyrinth|antithesis|excavation|dominion|treasure|fighter`): no script errors, no sideways scroll, each game
dialog opens with the right title. Old links `#play=pacman|pong|minesweeper|risk` open the new games and the address
bar is rewritten to the new id. A score saved under `pacman` (777) moved to `labyrinth` and the old key was removed.

## Would-pass (11)
- site:rename-ids — no old id left in the site outside the three compatibility tables and the ledger-migration regex.
- site:compat — `RENAMED` identical in `archive-games.js`, `track.js`, arcade `site.js`, and `archive-ledger.js`; `renamed.test.js` passes.
- site:migration-safety — score and ledger migrations are wrapped in try/catch; old key removed only after the new one is written.
- site:unfinished-journal — title, catalog, homepage card, arcade, museum label, game eyebrow all renamed; homepage blurb
  ("Egypt, Sumer, the Indus and the road east … travellers who never came home") matches the game's own story text.
- site:hades — Hades is named "of the underworld", never an Olympian; fighter's "three specials each … super … finish" matches the code (`fspecial`/`bspecial`/`special`, super at full meter, finish on a weakened foe).
- site:homepage-blurbs — no commercial game names (Pac-Man, Pong, Minesweeper, Risk, Indiana Jones) remain in any page.
- site:overclaim — Pilgrimage meta/OG and lede, Alexandria and Qumran notes say what is surveyed, estimated or conjectured; the garbled Pilgrimage lede on `main` is fixed.
- site:arcade — the note says Play opens the game on the Symbols page; headless shows that is what the card does.
- site:lighthouse-workflow — `cancel-in-progress: false` is correct; see note 1 for why runs still show "cancelled".
- site:records — CLAUDE.md, README, audit, perf-baseline and plan files: names only, no meaning changed.
- site:sensitivity — no new image, model or page about a sacred object, holy site or revered person.

## Accuracy spot-checks
- Library of Alexandria: "no plan survives, no remains securely identified" | https://www.humanist.de/rome/alexandria/ ("The position of the Museum and the main Library is unknown") | supports.
- Hades not one of the Twelve Olympians | https://en.wikipedia.org/wiki/Twelve_Olympians (prior review) | supports; general reference, no chapter text changed.

## Notes (not blocking)
1. **Lighthouse "cancelled" runs are the waiting run being replaced, not a running one being killed.** One run (126,
   on an old handoff commit) has been running since 21:00 UTC; each newer push replaces the one *waiting* run behind it.
   The waiting run that is left when 126 ends will run to completion. Merge waits for that result.
2. **Still open, separate from this merge:** the Unfinished Journal hero portrait (fedora, leather jacket, whip) is
   already live on `main`; this batch neither adds nor changes it. Carter's options are in STATUS.

## Verdict
Up to standard. Merge PR #59 when every GitHub check on the head is completed and green, Lighthouse included.
