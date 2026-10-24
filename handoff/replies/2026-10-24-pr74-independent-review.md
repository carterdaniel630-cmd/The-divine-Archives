# PR #74 (reduced motion, part 1) — independent review: 0 findings

**Run:** build loop, 2026-10-24 ~22:40–22:55 UTC. **Item:** Next 1. Items per run: 1.
**Candidate:** `loop/reduced-motion` @ `7ec8244` (base `09f48b3`). This run wrote none of it.

## In plain words
I checked the fix that stops two games shaking and flashing for people whose phone asks for reduced motion. It does
exactly that, and nothing else changes for anyone else. No problems found. It can go live once GitHub's last check
(Lighthouse, still running) finishes green and you say yes.

## What was checked
- **The change** (3 files: `fighter.js`, `treasure.js`, and the two cache numbers in `symbols.html`): every place
  either game shakes the screen or flashes the whole screen was found and read. Divine Casualties: the camera shake,
  the full-screen hit flash (capped at 0.06) and the storm's lightning (off). The Unfinished Journal: the camera shake
  (both directions) and the red hurt flash (capped at 0.06). Small local sparks stay; they don't move the screen.
  Reviewer checklist §4: no chapter, Vault entry, Pantheon figure or source changes; nothing religiously sensitive;
  §4.7 games: see below.
- **Measured by playing**, phone size, 40 seconds each, my own measuring script (not the builder's):

  | Game | Reduced motion off | Reduced motion on |
  |---|---|---|
  | Divine Casualties | 441 shaken frames, flash up to 0.30 | **0 shaken frames, flash ≤ 0.06** |
  | The Unfinished Journal | 271 shaken frames, flash up to 0.17 | **0 shaken frames, flash ≤ 0.06** |

  Both games drew normally (screenshot checked), 0 script errors.
- **Local checks on `7ec8244`:** full build order clean (no generated changes); review-checks 9/9, 0 warnings;
  17/17 verify scripts; 42/42 tests; the CI fight test plays to KO with 0 page errors, frame data 40/40.
- **Fits on today's `main`:** merges onto `361ba21` with no conflict. Before it can fast-forward, it needs a merge
  commit of `main` (no history rewrite) and a re-check that the site diff stays the same.
- **GitHub checks on `7ec8244`:** 6/7 green (runtime ×2, guard, test, checks, links); **Lighthouse still running**
  at 22:50 (started 22:31). Not waited on.

## Optional note (not blocking)
Both games repeat the reduced-motion check that `feel.js` already has. Sharing `ArchiveFeel.reduced` later would
remove the copy; not worth changing in this PR.

## Same run, not duplicated
Next 1 also said to bring #71 up to `main`. A parallel session did it first (`99a3625`, and #72 → `0d16e84`) under
Carter's new per-item yes (`decisions-2026-10-24-merge-71-72-73.md`). This run's own merge was identical and was not
pushed.

## Needs your decision
- **PR #74 (reduced motion, part 1):** reviewed, 0 findings. **Yes, put it live / Not now.** (It goes live only after
  Lighthouse is green and it is brought up to `main`.)
