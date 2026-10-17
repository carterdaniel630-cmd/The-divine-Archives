# Mergeable items — running list (Item 22)

**Rule (Carter, Item 22):** an item is listed here as mergeable ONLY when it is completed AND up to standard,
meaning Carter's bar and Claude's own. Nothing merges unless it is listed here AND Carter approves that
specific item. Approval is per item, never blanket. Updated at every checkpoint; the build loop keeps it current.

**As of:** 2026-10-17, evening New York (build loop). **Live site (`main`):** `c455bfe`, unchanged.

## Mergeable now
None yet.

## Waiting to qualify (not mergeable, and what is still missing)
| Item | Where | Done? | What is still missing |
|---|---|---|---|
| Site batch A: over-claiming pages fixed; trademark ids renamed with old links and scores carried over; Hades reworded; "The Tomb Robber" → "The Unfinished Journal" | `staging/ready-line`, site changes up to `6b419fd` (later commits touch `handoff/` and the Lighthouse workflow only) | Yes | 1) A fresh independent review: the last one covered `2ab371d`, before the game rename. 2) Lighthouse green: no run has finished yet, because each push cancelled it; fixed in `ac6d5fa`. 3) Carter's explicit yes, since reviewer auto-pass is off. |
| CI fix: Lighthouse runs finish instead of being cancelled | `staging/ready-line` `ac6d5fa` | Yes | Ships with site batch A (same branch). No separate merge. |

## Not ready (in progress or waiting on a ruling)
- Site batch B, small defects (hallway hiss removed; "199 figures"; V72 sources, back to pending): branch
  `loop/small-defects-2026-10-17` `ce31f9f`, built on batch A. Part 1 done and all local checks green; part 2 (Bagh-chal,
  zodiac `dispose()`, Oracle Bones, fonts, Grimoire) still to do; then it needs its own independent review, and batch A merged first.
- Protection charter: draft only, waiting on Carter D1–D4 (`handoff/protection-charter-DRAFT.md`).
- Hero portrait and the whip/boulder set pieces in The Unfinished Journal: waiting on Carter.
- 900 Theses room: blocked on Gates A–D and the intake ruling.
