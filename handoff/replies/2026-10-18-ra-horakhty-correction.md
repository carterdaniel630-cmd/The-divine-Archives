# Ra-Horakhty correction applied (Item 30) and the evening batch folded (Item 31)

**Date:** 2026-10-18 (build loop). **Branch:** `loop/small-defects-2026-10-17` (batch B), commit `aeda5d4`.

## Why this item
The lock from the 01:17 UTC run was 5 hours old with no branch or commit for its museum item, so it was stale and
was taken over. Ranked by value: Carter's Ra-Horakhty correction (Item 30, approved "yes") fixes a wrong name on the
live site (value 1), is small and sure, and newer than the museum item (value 3). It went onto batch B, which is the
batch already heading for review and live.

## What changed
- The Pantheon figure whose emblem shows the falcon head, the sun disk and cobra, and the ankh was named "Ra". It is
  now **Ra-Horakhty**. Its text says what Carter's correction says: Ra who is Horus of the Two Horizons, two gods
  joined in one form, the sun at its rising and its setting; Ra is the shorthand everyone uses. The old line "merged
  … as Amun-Ra or Ra-Horakhty" became "also merged with Amun, as Amun-Ra" so the entry does not contradict itself.
- The entry id `ra` and every link to `pantheon.html#ra` are unchanged.
- Rebuilt: Pantheon page, the Egypt chapter's figure strip, museum Bronze Age wing, museum manifest and directory,
  search index, entity registry.
- Source logged in `sources/ch02-egypt.md`: Michael C. Carlos Museum (Emory), *Life and the Afterlife* no. 32,
  "Re-Horakhty Inlay Plaque" (name meaning; "the actual name of the Re of Heliopolis"; falcon-headed, sun disk and
  uraeus). Opened from this session.
- Checked the rest of the site: other mentions of Ra ("son of Ra", "Ra's barque", Atum-Ra, Amun-Ra, the chess piece
  Ra drawn as a pylon with a sun disk) are about the god in general, not the falcon-headed figure, so they stay as
  written per the correction ("correct the name only").

## How it was checked
- Full build order (stamp-dates through build-entity-registry): only the expected files changed.
- All 17 `tools/verify-*.js`: OK. `node --test framework/test/*.test.js`: 42 pass, 0 fail.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 1 warning. The warning is the known one: a
  changed Pantheon figure has no pending tag yet, so it should go into Carter's next batch review (like V72).
- Headless phone check (390 px) of `pantheon.html#ra` and `chapters/ch02.html`: the entry reads correctly, no page
  overflow, no script errors (only outside fonts blocked by the sandbox network).

## Evening batch (Item 31) folded into STATUS
Pythia: no entry (nothing to build). Errata: goes in the Vault (prep only; publishing it needs Carter). Ouija preview:
rename to "Spirit Board". Hit-feel on the other games: now. Reduced motion: respected, never overridden. Email list:
skipped, sign-up stays off. V72: the loop's review handles it. 900 Theses: on hold. Journal hero: option A, face stays
Carter's, still waits for his selfie.

## Note
The lock commit `c7db6d5` on `staging/ready-line` carries an attribution trailer with a model name; CLAUDE.md forbids
that. It was already pushed and history is not rewritten on a shared branch; later commits in this run leave it out.

## Standards board
`board.json` updated (batch B, Ra-Horakhty, email list and 900 Theses now parked); `board.html` rebuilt.
