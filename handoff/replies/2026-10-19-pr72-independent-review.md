# PR #72 (hit-feel part 3: Chess + Dominion) — independent review

**Run:** build loop, 2026-10-19 ~05:59–06:20 UTC. **Candidate:** `loop/hit-feel-3` @ `d4b52cf` (one commit on top of #71's
`6c4efbc`, on #70's `ea70b77`, on `main` `77f6444`). **Reviewer independence:** this run wrote none of the candidate's site
changes. Nothing merged.

## Verdict
**0 findings** (blocking or optional). Lighthouse on `d4b52cf` was still running when this run ended (started 05:57 UTC),
so #72 is not yet "mergeable now": it needs that check green, #70 and #71 merged first, a re-check that it fast-forwards,
and Carter's yes for this item. This run did not wait holding the lock.

## Automatic checks (REVIEWER §3), run on `d4b52cf`
- Full build order (stamp-dates → build-og → build-vault → build-chapters → build-pages → build-museum → build-framework →
  build-entity-registry → build-sky): **no generated changes**.
- `review-checks.js --base origin/main --build`: **9/9 passed, 0 warnings**.
- 17/17 `tools/verify-*.js` pass. `node --test framework/test/*.test.js`: **42/42**.
- Lint (the games' `no-undef` rule, run with the ESLint available here on the three changed files): **clean**. The PR's own
  ESLint 8 runtime jobs are green on GitHub.
- GitHub checks on `d4b52cf`: checks, guard, links, runtime ×2, test **green (6/7)**; lighthouse **in progress**.

## Checklist (REVIEWER §4)
1. Accuracy: no factual text changed; code comments and sound/effect names only. **Pass.**
2–5. Lens balance, evidence tiers, contested claims, tone: no chapter, Vault or Pantheon content touched. **Pass (n/a).**
6. Religious sensitivity: no images, sacred objects or holy sites added; sounds and screen effects only. **Pass.**
7. Games: read the whole diff (`feel.js`, `chess.js`, `dominion.js`, `symbols.html`) and played both headless at phone size
   (390×844, touch, 3× screen), normal and reduced motion, hit kit instrumented from outside (no code change):

| Check | Normal motion | Reduced motion | Script errors |
|---|---|---|---|
| Chess, two-player Scholar's Mate (10 moves incl. Qxf7#), then 1.e4 f6 2.Qh5+ | place ×9, capture ×1, checkmate chime ×1, check ×1 (one cue per move, none missed); 52 shaken frames | same cues; **0 shaken** | 0 |
| Chess, idle after the last hit | **0 frames in 1.5 s**: the redraw chain stops once the hit fades | 0 frames | 0 |
| Dominion, 25 s random play | place ×7, battle ×2, land lost ×4; 101 shaken frames | place ×6, land lost ×5, campaign lost ×1; **0 shaken** | 0 |
| Dominion, 70 s random play | place ×15, battle ×7, **land taken ×3**, land lost ×2; 225 shaken frames | — | 0 |

   Board after the mate shows "Checkmate — The Olympians triumph." with the mated king marked. Only console noise: the
   external font host, blocked in this sandbox. **Pass.**
- Also checked by reading:
  - Chess: a move made before the last one lands still sounds (`land(st.anim)` first); one animation-frame chain only
    (`frame` clears the handle, `draw` re-arms only when none is pending); "New match" clears the pending frame; promotion
    and en passant use the captured piece for the capture weight.
  - Dominion: "land taken" fires only when you took it, "land lost" only when a rival took yours, read before and after
    the capture correctly; the AI's silent battles make no dice sound but your losses still register; several losses in one
    AI turn give one cue (the kit's repeat gap), not a burst.
  - Kit: all six new kinds exist with a sound; flash cap unchanged (0.3, faint under reduced motion); cache versions bumped
    for chess, dominion and the kit.

## To merge
- **#72:** Lighthouse green on `d4b52cf` (a later run re-checks); #70 then #71 merged first, then #72 re-checked as
  fast-forwarding onto the new `main`; Carter's yes for this item.

Items per run (Item 32): 1 item, one handoff push plus the lock.
