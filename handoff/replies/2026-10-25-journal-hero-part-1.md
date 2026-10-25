# The Unfinished Journal hero, part 1: The Archivist — PR #77 (2026-10-25, build loop)

**Item:** STATUS Next 4, Journal hero rebuild (PR #60, Option A), unblocked 2026-10-25 when the three images arrived in
`handoff/journal-hero-b64/`. **Branch:** `loop/journal-hero-archivist` @ `dbf5d16`, from `main` `efba79c`. **PR #77.**
Nothing merged.

## Why this item this run
The three merge candidates (#67, #75, #76) were waiting on GitHub: Lighthouse still running on #67 (`c957af5`, started
01:50) and #76 (`7100802`, started 01:54). Waiting with the lock is not allowed, so the next item by value was taken:
the live Journal hero still wears the film-explorer kit (fedora, leather jacket), which is a live trademark-look risk.

## Done
- The game's painted parts (`docs/assets/games/art/treasure/` body, thigh, shin) and both story-card portraits are now
  cut from Carter's approved hooded sheet, "The Archivist" (added as `art-source/archivist/character-sheet-archivist-hooded.webp`).
  Side view for the running figure (mirrored to face right), front view for the portraits. Hood up, long coat, scroll
  case, boots. No hat, no leather jacket.
- **Face:** every pixel comes from the sheet; nothing drawn or invented. The sheet has one expression, so the "smile"
  card shows the same face (a smile would have meant inventing one).
- `art-source/archivist/cut.py` makes all parts and the manifest from the sheet; run twice, byte-identical output.
- Raised arm (casting / on the rope) is now a coat sleeve, sizes and colours from the manifest. Pre-load fallback wears a hood.
- Parts ship at half the sheet's resolution (body 75 KB). Cache version `v=1` → `v=2`.
- Carter's selfie itself was **not** committed anywhere new; only the approved sheet.

## Checked
- Full build order: nothing else changed. review-checks `--base origin/main --build` 9/9, 0 warnings; 17/17 verify
  scripts; 42/42 framework tests.
- Headless phone 390×844 at 3×, normal and reduced motion: manifest, body, thigh, shin, portrait all load (200); hero
  stands, runs, jumps, casts the line; 0 script errors (one blocked outside font request, not a script error); page
  390 px wide. Story card shows the hooded face clearly.
- Note for review: the dark coat reads a little darker against the dusk Egypt sky than the old brown jacket did; still
  visible. Worth a look on Carter's phone.

## Not done (part 2)
Whip → other tool and boulder → other hazard (Option A set pieces). PR #60 already has one version of these (plumb-line,
sand torrent, scree) on an old base; part 2 should port them onto current `main`.

## Merge candidates this run
- #67 `c957af5`: 7/8 green, Lighthouse running. #76 `7100802`: 5/6 green, Lighthouse running. Not waited on.
- #75 `223600f`: 7/7 completed green, but **no Lighthouse run appeared** although it changes `docs/`; a later run should
  check whether it is queued. Also: #75 clears two pending tags. LOOP.md "Merging" condition 4 says a loop merge must
  carry no cleared pending tag, and this loop's standing limits forbid clearing content, so **the loop will not merge
  #75**; Carter presses Merge on it himself once it is green.

Items per run: 1.
