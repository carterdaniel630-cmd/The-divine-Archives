# The Keeper — production pass 1 built: PR #103 (2026-11-01 ~17:10 UTC)

Build-loop run (lock taken 16:05 UTC). This was the highest-value item in Next that needed no Carter approval: 4b, The Keeper. It is a new build, so merging it needs Carter's per-item yes.

## What was built
- **PR #103**, branch `loop/keeper` @ `162f1d2`, based on `main` `5299aaa`.
- `docs/museum/keeper.html` is a standalone preview page. It shows the pending banner ("pass 1 of 2, not yet part of the museum"). It is marked noindex, it is not in the sitemap, and nothing links to it. A closing plaque line says he is the Archive's own invented guide, not drawn from any one tradition.
- `docs/museum/keeper.js` is bench v2 rebuilt on the site's vendored three.js (r186). It no longer carries an embedded 0.9 MB copy of the library.
  - The newer three.js lit the environment about twice as brightly as the bench did. Setting the environment intensity to 0.3 matches the bench capture: robe 42 vs bench 40, floor 43 vs 48, halo 176 vs 176 (mean grey level, front view).
- `docs/museum/keeper-env.js` is the bench's RoomEnvironment (three.js r160, MIT). The vendored three.js has no addons.

## The four production musts (order 2026-11-01)
| Must | State after pass 1 |
|---|---|
| 1 Goldwork woven as thread at close zoom | **Not started.** Planned for pass 2. |
| 2 Hands finished | **Partial.** Each finger has a nail on its back. Each bending joint has fine creases on the palm side. The raised palm, which faces the visitor, has its three main lines. The hands are still built from joined balls and tubes, so they still read as a mannequin up close. A fused hand mesh is the real fix, planned for pass 2. |
| 3 Wake stronger in the ground | **Done for this pass.** The ground is now painted point by point: withered, bleached and cracked on his right; living green on his left; a tide line between them that feathers with noise. About 900 living blades and 650 bent dead stalks (instanced) make it read at full-figure distance. Captures: `keeper-pass1/front.png` vs `keeper-pass1/bench-front.png`. |
| 4 Heavier drape at mid-distance | **Done for this pass.** Eight broad, deep folds on the sides and back, deepening toward the hem and kept clear of the front falls. The existing fold field is slightly deeper. Capture: `keeper-pass1/mid.png`. |

The locked bench features are unchanged: void face, bound hood edge, solid halo disc, RIGHT hand raised in the teaching sign, left hand open and empty, no flowers in the goldwork, the raven.

## Checks (on `loop/keeper` `162f1d2`)
- `node tools/review-checks.js --base origin/main --build`: all 9 pass. The first run caught the missing font links on the new page; they were added before the commit.
- Every `tools/verify-*.js`: pass.
- `node --test framework/test/*.test.js`: 42/42.
- Headless at 360×740:
  - Zero script errors; the one failed request is Google Fonts, which the sandbox blocks.
  - No sideways scroll (360/360) and the banner is visible.
  - About 250k triangles. That matches the bench (240k) plus the blades.
  - Captures are in `handoff/replies/keeper-pass1/`.
- GitHub checks had not finished when this was written.

## Honest residuals
- The left hand hangs a little below the wide sleeve, and you can see the gap from the side. This is inherited from the bench.
- From a close side angle the palm creases are faint.
- The wake disc stays fixed while he turns, as it did on the bench, so "behind his right foot" holds only in the front view.
- The page heading says **THE KEEPER**, following the order and checklist. The bench heading said THE ARCHIVIST.

## Process note
This run's lock commit `03068e2` carried an attribution line that names a model. The standing rule says no model names in commits. The commit was already pushed to a shared branch and history is not rewritten, so it stays. Later commits in this run leave the line out.

## Next for this item
1. An independent review of PR #103, by a run that wrote none of it.
2. GitHub checks, Lighthouse included, all green.
3. Carter's per-item yes.

Pass 2 (goldwork as woven thread, fused hands) can go on its own branch after #103.
