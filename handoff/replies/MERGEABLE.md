# Mergeable items — running list (Item 22)

**Rule (Carter, Item 22):** an item is listed here as mergeable ONLY when it is completed AND up to standard,
meaning Carter's bar and Claude's own. Nothing merges unless it is listed here AND Carter approves that
specific item. Approval is per item, never blanket. Updated at every checkpoint; the build loop keeps it current.

**As of:** 2026-10-18 ~07:50 UTC (build loop). **Deployed (`main`, on the-divine-archives.pages.dev; DNS not pointed):** `7b281cb` (site as of `218c51b`; two handoff-only commits since) (site batch A merged 2026-10-17 21:08 EDT, deployed).

## Mergeable now
(none)

## Waiting to qualify (not mergeable, and what is still missing)
| Item | Where | Done? | What is still missing |
|---|---|---|---|
| Site batch B: hallway hiss removed; "199 figures"; V72 sources (back to pending); Pantheon Ra-Horakhty | `loop/small-defects-2026-10-17` @ `aeda5d4` | Yes. Independent review 2026-10-18: 0 open findings (`2026-10-18-batch-b-independent-review.md`); all local checks green | (1) a pull request so GitHub's PR checks run (review, verify, originality, Lighthouse), all green on `aeda5d4`; (2) Carter's yes for batch B itself; (3) Carter re-clears V72 and Ra-Horakhty in his batch pass (they stay pending-flagged until then, which does not block the merge) |
| Museum phone speed: pixel ratio 1.5 → 1.0 on phones | `loop/museum-phone-dpr` @ `0585c80` | Yes. Measured before/after; all local checks green (`2026-10-18-museum-phone-pixel-ratio.md`) | (1) independent review by a run that wrote none of it; (2) a pull request with every GitHub check green, Lighthouse included; (3) Carter's yes for this item |

## Merged
- Site batch A (PR #59): merged 2026-10-17 21:08 EDT as `218c51b`, deploy green.

## Not ready (in progress or waiting on a ruling)
- Small defects part 2 (Bagh-chal, zodiac `dispose()`, Oracle Bones, exhibit fonts, Grimoire): all in `handoff/`
  drafts and previews, not on the live site, so not part of batch B. Next loop item.
- Protection charter: D1–D3 PARKED by Carter (Item 26); D4 is approved only once it is up to standard (Item 23). The draft is `handoff/protection-charter-DRAFT.md`.
- The Unfinished Journal hero redesign (PR #60, `loop/journal-hero-redesign` `6862dee`): **ON HOLD, does not merge.**
  Item 27 (Carter): the hero is based on Carter's own selfie, and the face stays his. PR #60 drew a new, invented face.
  The selfie image is not in the repo, so per Item 27 the work stops until Carter supplies it. The costume and set-piece
  changes (no fedora, leather jacket, whip-swing or boulder) still stand.
- 900 Theses room: ON HOLD (Carter, Item 31).
