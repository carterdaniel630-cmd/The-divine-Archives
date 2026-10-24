# Reduced motion, part 1 — built (PR #74); PR #70 now all green

**Run:** build loop, 2026-10-24 ~22:15–22:40 UTC. **Item:** Next 5, "reduced motion everywhere" (value 3). Items per run: 1.

## In plain words
If someone sets their phone to "reduce motion" (often because animations make them dizzy), the site has to respect it.
That's your ruling: do not override it. I checked every page. They all stay still. Two games still shook the screen
and flashed for those visitors: **Divine Casualties** and **The Unfinished Journal**. Both now stop shaking and keep
flashes faint for anyone who asked for reduced motion. Nobody else sees any change.

## What was checked
- **Whole-site audit** with reduced motion on, at phone size: 22 pages plus a chapter, a Vault entry and an era page.
  Nothing moved on its own on any of them, and no script errors. The Pilgrimage and Vault pages keep redrawing at
  about 60 times a second even while still. That costs battery, not motion, so it's noted for the speed work and
  not changed here.
- **The games:** the seven games in the hit-feel PRs (#70–#72) already respect the setting through the shared feel
  kit. The two outside them were the gap. This PR fixes those two and doesn't touch any file in #70–#72.
- **Measured by playing**, reduced motion on:

  | Game | Before (live code) | After (PR #74) |
  |---|---|---|
  | Divine Casualties | shook on 95 frames, flash up to 0.25 | 0 shaken frames, flash ≤ 0.06 |
  | The Unfinished Journal | camera shook on 85 frames, flash up to 0.157 | 0 shaken frames, flash ≤ 0.06 |

  With reduced motion off, both games are unchanged: they still shake and flash.
- Full build order: no generated changes. Review-checks passed 9/9 with 0 warnings. 17 verify scripts and 42/42
  tests pass. The CI fight test plays to a KO with 0 errors. Both games load at phone size with 0 script errors.
- Lint couldn't run locally (the installed checker can't read this config), so GitHub's lint job is the check.

Phone screenshots with reduced motion on: `handoff/previews/reduced-motion/rm-fighter-phone.png` and
`rm-treasure-phone.png`.

**Divine Casualties:** this is an accessibility fix to the live game, not the parked rebuild.

**Noticed, not fixed:** on The Unfinished Journal at phone width, the "Sound" button sits under the close ✕. This is
on the live site today, not caused by this change. Added to the small-defects list.

## PR #70
Lighthouse finished green at 22:28 UTC, so all 6/6 checks are green on `361ba21`. It qualifies for the
fast-forward merge you approved on 2026-10-19. This run already did its one item, so it didn't merge. The next run,
which wrote none of it, re-runs the local checks and merges. PR #73 is also 8/8 green now.

## Needs your decision
- **PR #74 (reduced motion, part 1):** after its independent review: **Yes, put it live / Not now.**
