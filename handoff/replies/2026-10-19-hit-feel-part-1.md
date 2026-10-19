# Hit-feel, part 1 — The Firmament and Antithesis (Item 31 #5)

**Run:** build loop, 2026-10-19 ~04:45–05:10 UTC. **Branch:** `loop/hit-feel` @ `ea70b77` (from `main` `77f6444`).
**PR:** #70. Nothing merged.

## What it does, in plain words
Hits now feel like hits in two games. When the ball strikes something, the game freezes for a split second,
the screen jolts, there is a soft flash and a sound, and on Android phones a tiny buzz.
- **The Firmament (pinball):** each heavenly bumper rings its own note and swells, slings snap, flippers thunk,
  lighting a heaven chimes with a gold flash, losing a ball drops a falling tone, and "+100" / "+500" float up.
  Scoring is unchanged.
- **Antithesis:** a paddle strike freezes, jolts and rings, harder as the rally speeds up; the paddle recoils;
  walls tick; winning a point chimes, losing one drops a tone.
- **Reduced motion respected** (Item 31 #6): if the phone asks for reduced motion there is no jolt, no swell or
  recoil, the numbers don't rise, and the flash is faint. Sound follows the games' existing sound setting.

The kit is shared (`docs/assets/games/feel.js`), so later parts can add it to the other games quickly.

## How it was checked
- Full build order: reproduces with no generated changes. `review-checks --base origin/main --build`: 9/9, 0 warnings.
  17/17 verify scripts. 42/42 tests. No-undef lint clean on the changed files (sandbox has ESLint 10; run with an
  equivalent flat config; CI runs ESLint 8 with `tools/eslint-games.json`).
- Headless phone size (390×844), normal and reduced motion, both games played automatically:
  pinball fired bumper, sling, thunk, tick and "heaven lit"; Antithesis fired paddle, tick and point-lost.
  Shake frames: ~500 / ~120 with normal motion, **0 under reduced motion**. No script errors (only console error:
  the external font host, blocked in this sandbox).
- Screenshots: `handoff/previews/hit-feel/firmament-phone.png`, `antithesis-phone.png`. A still cannot show
  the feel itself: Carter's phone check is the verdict.

## Not in this part
Ouroboros, Labyrinth, Ziggurat, Chess and the rest: later parts. The Unfinished Journal already has shake
(and PR #60 is on hold on the same file). Divine Casualties is parked.

## To merge
Needs an independent review by a run that wrote none of it, all GitHub checks green, then Carter's yes for this item.
