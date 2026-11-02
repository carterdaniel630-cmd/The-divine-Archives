# 2026-11-02 run ~04:01 UTC — (i1b) Symbols lazy-load built as draft PR #114

**Session:** ..WzTpDKp4yBFafKNBEAyr (wrote PR #114; wrote none of #113).

## Picked up
- Halt: none. Lock: none. Took the lock (`4f25b08`).
- (i2c) merge #113: **not possible yet.** Lighthouse on `b97a868` still `in_progress` (started 03:50:51 UTC, still running at ~04:10 and again at ~04:25). Every other check green, `main` still `73958d2`. Per LOOP step 3, I didn't hold the lock waiting. I went to the next item.
- (i1b) **Symbols page lazy-load** (honesty bundle item 4, Carter's bundle yes = per item). Built.

## What was built — PR #114, `loop/symbols-lazy-load` `f5c54a9` (parent `main` `73958d2`, fast-forward)
- `docs/assets/games/archive-games.js`: `lazy(map)` / `load(id)` / `isAvailable(id)`. When a game isn't loaded yet, `open()` shows "Opening the game…" (`role=status`) and mounts the game when its scripts arrive. A late load after the dialog was closed is ignored. A failed load says so, and a later open tries again. Symbol labels take the title from the catalog, so none read "Play a game". Loading starts on `pointerdown`.
- `docs/symbols.html`: the 14 game script tags become one `ArchiveGames.lazy({...})` map (same files, same `?v=`). `fighter-moves.js` goes before `fighter.js`, and `chess-art.js` before `chess.js`. The egg and `#play=` checks use `isAvailable`. Shell `?v=8→9`. Pad and feel helpers stay on the page.

## Measured (headless 390 px, before = `main` `73958d2`)
- First load JS: **933.7 KB / 25 files → 305.9 KB / 11 files** (−628 KB, ~0.61 MB).
- `#play=fighter` 933.7 → 515.1 KB; `#play=chess` 933.7 → 361.2 KB.
- The order estimated ~0.9 MB. The rest is `data.js` + `plates.js` (~210 KB), which the page itself needs to draw the symbols. I'm not claiming the 0.9 MB figure.

## Verified
- All 12 games open by `#play=<id>` at 360 and 390 px: registered, real game (no placeholder), 0 page errors, no sideways scroll.
- Tap path: tapping the Ouroboros symbol opens the game (canvas), focus moves into the dialog, and Esc closes it.
- Slow network: the "Opening" line shows. Closing while it loads leaves no stray overlay.
- Offline: the failure line shows. After reconnecting, a reopen loads the game.
- 0 of 20 trigger labels say "a game".
- `ci-play-fighter.js`: frame data OK, played to KO, 0 page errors.
- verify 18/18, tests 42/42, `review-checks --base origin/main --build` 9 PASS / 0 fail / 0 warn (build matches committed).
- **Not run locally:** eslint no-undef (npm blocked in this session). CI `runtime` runs it.
- graphify CLI missing, so the map wasn't used. I read the code directly (only `symbols.html` loads the game modules; checked by grep).

## Needs
- A non-builder review of #114, and GitHub green incl. Lighthouse. Then merge per item on the bundle yes.
- #113 should merge first. #114 then re-syncs onto the new `main` (no file overlap: #113 is ch01 text) and re-runs its checks.
