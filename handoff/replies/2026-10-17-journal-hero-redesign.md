# Reply — The Unfinished Journal: hero redesign + set pieces (Carter: "your discretion … use your artistic abilities")

**Date:** 2026-10-17. **Branch:** `loop/journal-hero-redesign` (commit `6862dee`), stacked on batch A. **PR:** #60 (base
`main`; shows batch A too until #59 merges). Nothing merged. Nothing live.

## Done (all in `docs/assets/games/treasure.js`)
- **Original hero:** a field surveyor drawn from geometry: teal coat, saffron head-wrap with streaming tails, satchel
  with the journal. Legs by two-bone inverse kinematics, head-wrap tails as a Verlet chain, coat hem on a damped spring.
  The painted fedora and leather-jacket explorer is gone.
- **Whip → surveyor's plumb-line** (braided cord, brass bob). Same reach, hit test and ring swing; new chime; every
  player-facing mention updated (hints, controls, button "Line").
- **Boulder → sand torrent** pouring from the tomb ceiling (Egypt) and a **scree slide** (Persian pass). Same speed,
  terrain-following and wall stop, so the run's timing is unchanged.
- **Hero too small (fix package):** camera zoom 1.25–1.6× with vertical follow; sky keeps its wide composition.
- **No impossible jumps (fix package):** Egyptian spike pit 7 → 5 tiles. Gap audit of all 13 gaps in the 4 sites from
  the level data: each is clearable by a running leap or has a ring, raft or crumbling bridge.
- **Brightness:** tomb darkness 0.9 → 0.8 and a wider glow around the hero.
- **Portrait** for the story cards drawn from curves at runtime.
- Old explorer art moved to `_to_delete/2026-10-17-film-explorer-lookalike/` (not deleted), no longer served by the site.

## Checked
- review-checks `--base origin/main --build` 9/9; every verify script; framework tests 42/42.
- No-undef: eslint could not be installed here (no registry access); `tsc --checkJs` stand-in found no undefined names.
  The game-runtime CI job runs the real eslint on the PR.
- Headless 390×844 and 844×390: all 4 sites play to the exit, no page errors; Egyptian ring swing lands at col 111 (same
  as before). FPS at 4× CPU slowdown: old 46.5/45.3, new 46.3/43.0 (noise).

## Next for this item
- Independent review by a run that wrote none of it (REVIEWER.md §3–§4), then GitHub checks green, then merge after #59
  under Carter's per-item rule (`decisions-2026-10-17-hero-redesign-and-merge-as-we-go.md`).
