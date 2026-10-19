# Hit-feel, part 2 — Ouroboros, Labyrinth, Ziggurat (Item 31 #5)

**Run:** build loop, 2026-10-19 ~05:05–05:30 UTC. **Branch:** `loop/hit-feel-2` @ `6c4efbc`, stacked on
`loop/hit-feel` (`ea70b77`, PR #70). **PR:** #71 (into `main`; shows part 1 too until #70 merges). Nothing merged.

## First: PR #70 Lighthouse re-check
Lighthouse on `ea70b77` was still running at 05:05 and again at 05:25 UTC (started 04:55). The other 6 checks are green.
Not waited on (lock rule). #70 stays in "Waiting to qualify"; the next run re-checks.

## What part 2 does, in plain words
- **Ouroboros:** swallowing a symbol gives a soft swallow (higher as the coil grows), a small jolt and a gold flash; a new
  level chimes; biting your own tail drops a tone and buzzes (Android). No freeze: the serpent moves in steps, so a
  freeze would read as a stutter.
- **The Labyrinth:** each offering clinks quietly; lighting a lamp freezes an instant, flashes amber and chimes; catching a
  fleeing shade rings like a bell in that shade's colour; being caught drops a tone and jolts; a cleared level chimes.
- **Ziggurat Builder:** a tablet lands with a clay thud (harder after a long drop); laying a course freezes an instant,
  knocks, flashes gold and rings, more for several courses at once; overflowing the well drops a tone.
- **Shared kit (`feel.js`):** four new impacts (swallow, offering, landing, course); an `active` flag so Ziggurat, which
  only redraws on change, keeps drawing while a shake shows; audio now opens or resumes on **every** tap. That is the #70
  review's optional note: on iPhone, turning sound back on mid-visit now works without a reload.
- **Reduced motion respected** (Item 31 #6): no shake in any of the three; flashes stay faint.

## How it was checked (on `6c4efbc`)
- Full build order: no generated changes. `review-checks --base origin/main --build`: **9/9, 0 warnings**. **17/17** verify
  scripts. **42/42** tests. No-undef lint clean on the 4 changed files (ESLint 10 with an equivalent flat config of
  `tools/eslint-games.json`; CI runs ESLint 8).
- Headless phone (390×844), normal and reduced motion, ~25 s automated play per game:
  - Ouroboros: swallow fired; Labyrinth: 25–30 offerings, lamp, caught ×2; Ziggurat: 200+ landings, overflow ×17+.
  - Shaken frames with normal motion: 13 / 108 / 515; **under reduced motion: 0 / 0 / 0**. **0 script errors** (only
    console error: the external font host, blocked in this sandbox).
  - Rarer events (course laid, shade caught, level-up, tail bitten) did not come up in random play: every impact kind
    was fired directly in the browser with no error, and a static check confirms every kind the games call exists and
    has a sound.
- Audio fix, reproduced then fixed: sound "off" at the first tap, then turned on: old kit opened **0** audio contexts on
  later taps, new kit opens **1**.
- Part 1 games re-run (The Firmament, Antithesis): no script errors; Antithesis still 0 shake under reduced motion.
- Screenshots: `handoff/previews/hit-feel-2/` (ouroboros, labyrinth, ziggurat at phone size). A still cannot show the
  feel: Carter's phone check is the verdict.

## Not in this part
Chess and Dominion captures (part 3). The Unfinished Journal already has shake (and PR #60 is on hold on that file).

## To merge
#70 first. Then an independent review by a run that wrote none of this, every GitHub check green (Lighthouse included),
and Carter's yes for this item.

Items per run (Item 32): 1 item (plus the quick #70 re-check), one code push, one handoff push with the lock folded out.
