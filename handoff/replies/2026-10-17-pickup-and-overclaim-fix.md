# Reply 2026-10-17 — pickup + ready-line §2 (over-claiming pages)

**Answers:** manifest-v2 LIVE, through Item 20.
**Branch:** `staging/ready-line` only. Nothing merged, nothing live.

## Pickup (Item 20)
No chief-of-staff skill exists in the build side's environment. Following Item 20's fallback:
coordinate, keep the order, track done / in progress / blocked, surface disagreements.

## 1. Finish
Nothing was mid-build. The last code commit on any branch is 2026-10-12. Staging's site code is
identical to `main` (c455bfe); staging adds only `handoff/` files.

## 2. Audit — findings checked against the repo
| Claim in the package | What the repo shows | Action |
|---|---|---|
| Qumran + Alexandria pages claim survey measurements that do not exist | True. Both pages said "Sizes, slopes and proportions come from published survey measurements." `sites/qumran-caves/dims.js` says "Nothing here is a survey value"; `sites/library-of-alexandria/dims.js` says "all conjectural". In-world signs were already honest. | Fixed |
| "Tap to play" on cabinets that open a card | True. `pilgrimage/arcade.html` said "Tap a cabinet to play its game". A tap opens a card; its Play link opens the game on the Symbols page. | Fixed |
| Finishers that do not exist | **Not true.** `fighter.js`: a god's super that lands on a foe at 34 HP or less is a FINISH (unblockable, 100 damage), wired for all four gods. The homepage implied distinct per-god finishers. | Wording tightened to what the code does |
| Trademarked / "-style" homepage blurbs | True: Pac-Man, Pong, Minesweeper, "Risk-style", "Indiana-Jones-style". | Fixed |
| "Twelve games in all" is false against 37 | **Not true of the code.** Twelve games are built. The 25 historical games are not in the repo yet. Writing 37 would itself over-claim. | Reworded to "These twelve games…", no total. Flagged. |
| Maze game rename | The visible title is already generic ("The Labyrinth"). Only the code id `pacman` (URL `#play=pacman`, file `pacman.js`) carries the mark. | Flagged, not renamed |

Also found and fixed:
- The Pilgrimage index lede was garbled (two sentences merged mid-word, with a broken `&rsquo;`).
- The museum's portal card and the Pilgrimage meta description also said every site is
  "modelled from published surveys".

Also found, not changed (needs Carter):
- The fighter calls all four gods "Olympians". Hades is traditionally not one of the Twelve
  Olympians. The homepage and catalog now name the four gods instead.
- `PROTOCOL-two-way-channel.md` was cited three times but missing. Written now, restating the recorded rules.

## What changed (files)
- `docs/assets/pilgrimage-data.js`: honest `note` for Qumran and Alexandria; documents the `note` field.
- `tools/build-pages.js` → `docs/pilgrimage.html`: lede and description.
- `docs/pilgrimage/qumran-caves.html`, `library-of-alexandria.html`: rebuilt.
- `docs/museum/app.js` (+ `museum.html` cache bump v39→v40): portal card.
- `docs/pilgrimage/arcade.html`: cabinet note.
- `docs/index.html`: six arcade blurbs and the closing line.
- `docs/assets/games/catalog.js`: fighter subtitle.

## Checks run
Full build order, all 16 `tools/verify-*.js`, 38/38 framework tests, and `review-checks.js --base origin/main --build`:
9/9 pass, and the committed output matches a fresh build. Seven changed pages opened headless at phone size:
no script errors (only the blocked web-fonts host). Self-review against `reviews/REVIEWER.md`
done; the independent reviewer pass is still owed.

## Next in the pickup order
1. Ready-line §1 Protection charter (draft for Carter). Also gates the code-id renames.
2. §3 900 Theses: blocked on Gates A–D + intake ruling; prep only.
3. Fold pass over the fix package and build program, then the rebuild-better work.
