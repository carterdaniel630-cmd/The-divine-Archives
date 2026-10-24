# Mergeable items — running list (Item 22)

**Rule (Carter, Item 22):** an item is listed here as mergeable ONLY when it is completed AND up to standard,
meaning Carter's bar and Claude's own. Nothing merges unless it is listed here AND Carter approves that
specific item. Approval is per item, never blanket. Updated at every checkpoint; the build loop keeps it current.

**As of:** 2026-10-24 22:55 UTC. **Deployed (`main`, on the-divine-archives.pages.dev):** `361ba21` (PR #70 merged 2026-10-24 22:37 UTC, deploy run 196 green).

## Mergeable now
- (none: everything below is missing something)

## Waiting to qualify (not mergeable, and what is still missing)
- **Reduced motion, part 1** (PR #74, `loop/reduced-motion` @ `7ec8244`; games only): built 2026-10-24, local checks
  green (`2026-10-24-reduced-motion-part-1.md`). Missing: independent review; every GitHub check green; Carter's yes.
- **Tjurunga takedown** (PR #73, `loop/tjurunga-absence` @ `529b1eb`; Carter's ruling 2026-10-20): built 2026-10-24,
  local checks green (`2026-10-24-tjurunga-takedown-built.md`). **Independent review done 2026-10-24, 0 defects**
  (`2026-10-24-pr73-independent-review.md`); one wording question for Carter ("the largest collection").
  **8/8 GitHub checks green** (Lighthouse finished 22:12). Missing: Carter's answer on the wording;
  Carter's yes for this PR (sensitivity item: never merged without it).
- **Hit-feel part 2** (PR #71, `loop/hit-feel-2` @ `6c4efbc`, stacked on #70; games only): local checks green
  (`2026-10-19-hit-feel-part-2.md`); **independent review passed 2026-10-19, 0 findings**
  (`2026-10-19-pr71-independent-review.md`); **7/7 GitHub checks green, Lighthouse included** (finished 05:32 UTC).
  **Carter's yes recorded** (`decisions-2026-10-24-merge-71-72-73.md`); brought up to `main` as `99a3625` (site diff
  identical). Missing: every GitHub check green on `99a3625`, then the merge by a run that wrote none of it.
- **Hit-feel part 3** (PR #72, `loop/hit-feel-3` @ `d4b52cf`, stacked on #71; games only): local checks green
  (`2026-10-19-hit-feel-part-3.md`); **independent review passed 2026-10-19, 0 findings**
  (`2026-10-19-pr72-independent-review.md`); **7/7 GitHub checks green, Lighthouse included** (finished 06:19 UTC).
  **Carter's yes recorded**; brought up as `0d16e84` on top of #71. Missing: every GitHub check green on `0d16e84`;
  #71 merged first.

## Merged
- Hit-feel part 1 (PR #70): merged 2026-10-24 22:37 UTC by fast-forward to `361ba21`, deploy run 196 green (`2026-10-24-pr70-merged.md`).
- Graphify plain-word names (PR #69): merged 2026-10-24 21:43 UTC by fast-forward to `09f48b3`, deploy run 195 green (`2026-10-24-pr69-merged-pr70-updated.md`).
- Graphify fix + standards board (Item 29, PR #65): merged by Carter 2026-10-18 22:07 UTC as `77f6444`, deploy run 194 green (`2026-10-18-item-29-independent-review-and-merge.md`).
- Site batch B (PR #63): merged 2026-10-18 16:51 UTC by fast-forward to `c205f4c`, deploy green (`2026-10-18-batch-b-update-review-and-merge.md`).
- Museum phone speed (PR #62): merged 2026-10-18 12:35 UTC by fast-forward to `0585c80`, deploy green.
- Site batch A (PR #59): merged 2026-10-17 21:08 EDT as `218c51b`, deploy green.

## Not ready (in progress or waiting on a ruling)
- Treaty of Kadesh tablet (relic 1 of 4): rebuilt 2026-10-19 as a preview in `handoff/previews/treaty-of-kadesh/`
  (`2026-10-19-treaty-of-kadesh-rebuilt.md`). Not a site change yet; a museum placement is a new exhibit and needs
  Carter's yes, then a `loop/*` branch, independent review and checks.
- Small defects part 2 (Bagh-chal board fixed 2026-10-18; zodiac `dispose()`, Oracle Bones, exhibit fonts, Grimoire remain): all in `handoff/`
  drafts and previews, not on the live site, so not part of batch B. Next loop item.
- Protection charter: D1–D3 PARKED by Carter (Item 26); D4 is approved only once it is up to standard (Item 23). The draft is `handoff/protection-charter-DRAFT.md`.
- The Unfinished Journal hero redesign (PR #60, `loop/journal-hero-redesign` `6862dee`): **ON HOLD, does not merge.**
  Item 27 (Carter): the hero is based on Carter's own selfie, and the face stays his. PR #60 drew a new, invented face.
  **Unblocked 2026-10-21:** Muse staged the selfie and the approved hooded Archivist sheet in `handoff/journal-hero/`; rebuild queued. The costume and set-piece
  changes (no fedora, leather jacket, whip-swing or boulder) still stand.
- 900 Theses room: hold LIFTED (Council 14b, 2026-10-20); spec work queued, nothing built yet.
