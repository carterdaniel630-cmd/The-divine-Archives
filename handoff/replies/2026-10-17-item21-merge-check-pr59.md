# Item 21 merge check — PR #59 (staging/ready-line → main)

**Run:** build loop, 2026-10-17 evening. **Result: NOT MERGED.** Two conditions in `handoff/LOOP.md` do not hold.
This run wrote none of the candidate's changes (independent review, condition 1 satisfied on that point).

Batch: PR #59 site changes (ready-line §2 over-claim fix, trademark id rename, Hades rewording)
Reviewed: 2026-10-17
Auto-pass: SUSPENDED (`reviews/status.json`: "no baseline test batch yet")
Covers: staging/ready-line@2ab371d (candidate; later commits cabaed8, e6f8c91 touch only handoff/)
Summary: 9 passed, 0 fixed, 2 need Carter, 1 note.

Automatic checks: all pass.
- Full build order (stamp-dates → build-og → vault → chapters → pages → museum → framework → entity-registry): ran clean, no drift.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- Every `tools/verify-*.js`: pass. `node --test framework/test/*.test.js`: 42/42.
- GitHub checks on the head: test, checks, guard, verify, runtime ×2 green; lighthouse was still running when this report was written (see STATUS).

PASSED (9)
- site:rename-ids — pacman/pong/minesweeper/risk → labyrinth/antithesis/excavation/dominion in code, data, registry, museum wings, tools. No old id left in the site outside the three compatibility tables.
- site:old-links — headless: `#play=pacman|pong|minesweeper|risk` land on the new games.
- site:score-carry-over — headless: a score saved under `pacman` moved to `labyrinth` and the old key was removed.
- site:compat-tables-equal — `framework/test/renamed.test.js` keeps the three tables identical; passes.
- site:hades — fighter, catalog and homepage name Zeus, Poseidon, Athena and Hades; Hades is never called an Olympian (fighter.js header says he is not one of the Twelve). Chess's "Olympian" set has no Hades.
- site:homepage-game-count — "These twelve games": catalog has exactly 12.
- site:overclaim — pilgrimage.html, arcade.html and the Qumran/Alexandria notes now say sizes are estimates or conjecture where they are; arcade says games open on the Symbols page, which is what the code does.
- site:phone-check — 390px headless: index, symbols, pilgrimage, museum, arcade, Alexandria, Qumran and all 5 changed games load with no script errors and no sideways scroll. (Only Google Fonts failed, blocked by this sandbox's network, not the site.)
- site:sensitivity — no new image, model or page about a sacred object, holy site or revered person; nothing religiously sensitive in the diff.

NEEDS CARTER (2)
- site:autopass — `reviews/status.json` says auto-pass is off, and REVIEWER.md §6 says that while it is off, *everything* the reviewer looks at needs Carter. LOOP condition 1 requires zero NEEDS CARTER items, so no run can meet it while auto-pass is off. Carter's Item 21 answer approves the merge in principle; the reviewer rule still holds the gate shut.
- site:tomb-robber — this diff rewrites the homepage "The Tomb Robber" card ("outrun a boulder and a tiger, swing on the whip"). Whether that reads as a film-franchise lookalike is already an open question in STATUS → Needs Carter. LOOP condition 4 (nothing needing a separate approval) is not met while it is open.

Note (not blocking)
- The PR #59 description is out of date: it says "all files under handoff/, no deploy impact", but the PR now changes the live site (docs/, tools/, framework/). Should be corrected before any merge.

Accuracy spot-checks
- site:hades | Hades is not one of the Twelve Olympians (he dwells in the underworld) | https://en.wikipedia.org/wiki/Twelve_Olympians | supports (general reference; no chapter text changed in this diff)

Needs your decision
- Merge PR #59 now, as reviewed here (all checks green, nothing broken)? Your "yes" covers both reviewer holds above.
- Keep "The Tomb Robber" card wording as is? (Or rename/reword.)
