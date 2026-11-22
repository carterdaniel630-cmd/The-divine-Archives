# PR #184 independent review — games placement step 1 (2026-11-22 ~07:05 UTC)

- **Reviewer:** build loop run, session ..01HFWzTnpxcdoXt2auPEmBmk. Wrote none of #184 (built by ..01HFWzTknbShcVs1863TNtiD).
  This session also applied #186's F1/F2 earlier; unrelated to #184.
- **Candidate reviewed:** `loop/games-placement` @ `62862601` (base `main` `6871e3ca`), against `reviews/REVIEWER.md` §3–§4
  and the order (resumption pack Item A; `decisions-2026-11-21-games-placement.md`).
- **Verdict: PASS, 0 findings.**

## What the PR does
`tools/build-museum.js` no longer derives a game for each chapter room from the catalog's `hiddenIn`; `GAME = {}`, with a
comment saying a room game is only ever placed by its own approved change. Everything else is generated output:
`docs/museum.html` (directory loses its "Game:" lines), `docs/museum/manifest.json`, six wing JSONs, and
`framework/registry/room.json` (11 `game:*` links dropped from room nodes). 10 files, +14 / −26.

## Checked
- All `GAME[...]` / `d.game` / `R.game` uses in `build-museum.js` and `docs/museum/app.js` are guarded, so an empty map
  means no kiosk and no "Play" button — no dead code paths, no errors.
- Every one of the 11 catalog games (antithesis, chess, dominion, excavation, fighter, labyrinth, ouroboros, reliquary,
  seeker, treasure, ziggurat) is still linked from `docs/pilgrimage/arcade.html`. Nothing becomes unreachable.
- No page text elsewhere promises a game in a museum room. The catalog's `hiddenIn` is untouched (it still names each
  game's source chapter); the symbols-page "Playable" tags and Tomb Robber / chess / cabinet questions are outside step 1
  and stay with Carter (Needs Carter 2026-11-22 03:05).
- Local on `62862601`: review-checks `--build` 9/0/0 with no diff after the build; tests 51/51; verify 18/18.
- Headless 360 and 390 px: museum.html 0 "Game:" lines, Arcade 11 distinct play links, no horizontal overflow, 0 script
  errors (only blocked external font requests in the sandbox).
- No pending tag cleared, nothing religiously sensitive, no new page/room/game.

## Re-sync done by this run (so this session may NOT delta-check it)
`main` had moved to `a2a6aa4b` (#182, #183). Merged `origin/main` into `loop/games-placement` → **`62b93b99`**; the build
order rebuilt generated files with no further change (museum.html keeps `app.js?v=57`). `git diff origin/main 62b93b99`
changed lines are byte-identical to `git diff 6871e3ca 62862601`. Local on `62b93b99`: review-checks 9/0/0, tests 51/51,
verify 18/18.

## Next
Delta check of `62b93b99` by a session other than ..01HFWzTnpxcdoXt2auPEmBmk (and ideally not ..01HFWzTknbShcVs1863TNtiD);
GitHub green incl. Lighthouse on `62b93b99`; then merge per item — Carter's yes is on file
(`decisions-2026-11-21-pr184-pr185-yes.md`).
