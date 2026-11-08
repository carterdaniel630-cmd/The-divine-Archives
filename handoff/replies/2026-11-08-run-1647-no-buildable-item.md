# Loop run 2026-11-08 16:47 UTC — no buildable item; waiting on atlas files and Carter

Session 01HFWzToYt1pCPS6MMS2SbvY. Halt: none. Lock: none found; taken 16:47, released at the end of this run.

## Checked
- **PR #130 (chapter images tranche 1)**, head `593d7d17`: reviews done (FINDINGS 6 fixed, delta PASS x2, by the builder
  session's reviewers). GitHub at 16:45 UTC: 8/8 checks completed green (checks, guard, verify x2, test, runtime x2,
  links). **No Lighthouse check has reported on this head yet**; a later run must see it green before any merge.
  Merge is per item (new build): Carter was asked at 16:50 UTC (merge yes; revered-figure stills a/b). Not merged.
- **(5) Pack-six rebuild** (`pack-six-rebuild-swap-order.md`, `games-visual-upgrade-order-2026-11-04.md`): not
  buildable from the repo. The order names its starting builds as Muse-side bench files
  (`~/workspace/goals/divine-archives-games-relics-and-interactives/files/` — `the-royal-game-of-ur/`, `hnefatafl/`,
  `mancala/`, `bagh-chal/`, `fanorona/`, `pachisi/`) and Ur's build of record as "Baseline B-v2". The repo holds two
  different copies each of Ur, Hnefatafl and Bagh-Chal (`handoff/exhibits/…` vs `handoff/armory/batch-01/builds/…-v2`
  / `handoff/previews/bagh-chal/bagh-chal-v2.html`) and nothing marked B-v2, so the loop cannot tell which file is the
  live pack file. Building on the wrong one would fork the game (the order forbids two divergent builds).
- **(6) Front-door v4:** the approved proof file is atlas-side (833 KB); the order alone does not carry the design.
- **Rotunda Tray 1** (`rotunda-tray1-spec.md`): the loop's share is placing **finished** figures. No Socrates, Shiva
  or Isis figure (no 3D model file of any kind) is in the repo; the spec says the figures are built atlas-side.
- Weekly audit: not due until the first run on or after Wed 2026-11-11.

## Files atlas/Muse needs to stage (named, per atlas-inputs-2026-11-08.md)
1. `handoff/pack-six/` — the six current live Gumroad pack files exactly as sold (Ur = Baseline B-v2), one per game.
2. `handoff/front-door-v4/` — the approved proof (or, if too large, its HTML without embedded images plus the images separately).
3. `handoff/rotunda/tray1/` — the finished Socrates, Shiva and Isis figure files (and their source/licence notes).

## Result
Nothing built, nothing merged. Not chaining: everything left waits on Carter (#130) or on atlas files.
