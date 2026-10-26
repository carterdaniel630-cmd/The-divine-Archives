# Mergeable items — running list (Item 22)

**Rule (Carter, Item 22):** an item is listed here as mergeable ONLY when it is completed AND up to standard,
meaning Carter's bar and Claude's own. Nothing merges unless it is listed here AND Carter approves that
specific item. Approval is per item, never blanket. Updated at every checkpoint; the build loop keeps it current.

**As of:** 2026-10-25 (PR #53 row added by the Pilgrimage thread; other rows as the build loop left them on 2026-10-17). **Live site (`main`):** `c455bfe`, unchanged.

## Mergeable now
| Item | Where | Review | Carter's approval | Still to hold before merging |
|---|---|---|---|---|
| Site batch A (PR #59): over-claims fixed; trademark ids renamed with old links and scores carried over; Hades reworded; "The Unfinished Journal"; Lighthouse workflow fix | `staging/ready-line`, site content of `ac6d5fa` (everything after touches `handoff/` only) | `2026-10-17-batch-a-independent-review.md`: 0 findings | Item 24 merge order + Tomb Robber confirmation ("a") | Every GitHub check green on the merge commit, Lighthouse included (waiting for a run to finish) |

## Waiting to qualify (not mergeable, and what is still missing)
| Item | Where | Done? | What is still missing |
|---|---|---|---|
| Pilgrimage batch 1 (PR #53): Delphi, Göbekli Tepe, Mogao Caves, Chichén Itzá; preview, pending tags on; Carter said "merge" 2026-10-25 | `claude/project-thread-s3qxre` `373efff` | Yes: the loop's review of `0e74caa` (27 findings, `review-log` `reviews/loop/2026-10-25-pr53-review-0e74caa.md`) fixed in `373efff` | An independent review of `373efff` with 0 findings and 0 NEEDS CARTER, by a run that wrote none of it; then every check green on the head, Lighthouse included. (The thread's own round-4 pass of `0e74caa`, `2026-10-25-pr53-independent-review.md`, is superseded.) |

## Not ready (in progress or waiting on a ruling)
- Site batch B, small defects (hallway hiss removed; "199 figures"; V72 sources, back to pending): branch
  `loop/small-defects-2026-10-17` `ce31f9f`, built on batch A. Part 1 done and all local checks green; part 2 (Bagh-chal,
  zodiac `dispose()`, Oracle Bones, fonts, Grimoire) still to do; then it needs its own independent review, and batch A merged first.
- Protection charter: draft only, waiting on Carter D1–D4 (`handoff/protection-charter-DRAFT.md`).
- The Unfinished Journal hero redesign (original surveyor, plumb-line, sand torrent and scree, zoom, spike pit): PR #60,
  branch `loop/journal-hero-redesign` `6862dee`, stacked on batch A. Done and all local checks green; needs its own
  independent review and green GitHub checks, and batch A merged first.
- 900 Theses room: blocked on Gates A–D and the intake ruling.
