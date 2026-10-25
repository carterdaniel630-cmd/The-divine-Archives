# Mergeable items — running list (Item 22)

**Rule (Carter, Item 22):** an item is listed here as mergeable ONLY when it is completed AND up to standard,
meaning Carter's bar and Claude's own. Nothing merges unless it is listed here AND Carter approves that
specific item. Approval is per item, never blanket. Updated at every checkpoint; the build loop keeps it current.

**As of:** 2026-10-25 02:20 UTC. **Deployed (`main`, on the-divine-archives.pages.dev):** `efba79c` (PR #73 merged 2026-10-25 01:43 UTC, deploy run 200 green).

## Mergeable now
- (none: everything below is missing something)

## Waiting to qualify (not mergeable, and what is still missing)
- **Site fixes 2026-10-18** (PR #67, `claude/site-fixes-2026-10-18`, head now `c957af5`): **independent review done
  2026-10-24, 0 findings** (`2026-10-24-pr67-independent-review.md`) on `1681050`. Carter's yes 2026-10-24
  (`decisions-2026-10-24-batch-six.md` 1). **Brought up to `main` `efba79c` on 2026-10-25 ~01:50** with a merge commit
  (no conflict); site diff byte-identical to the reviewed `1681050`; local checks green (`2026-10-25-pr67-brought-up.md`).
  Missing: every GitHub check green on `c957af5` (incl. Lighthouse), then a run that wrote none of #67 fast-forwards.

- **Clear V72 and Ra-Horakhty** (PR #75, `loop/clear-v72-ra`, head now `71206ee`, stacked on #76; Carter's "clear", batch-six 3).
  **Independent review 2026-10-25: 0 findings** by a chat session that wrote none of it
  (`2026-10-25-pr75-independent-review.md`); brought up to `main` `efba79c`; local checks green. Missing: every GitHub
  check green on `71206ee` incl. Lighthouse (checks restarted after stacking; site diff = reviewed `223600f` + #67 + #76). **Not a loop merge:** it
  clears two pending tags (LOOP.md Merging 4), so Carter presses Merge himself or says the loop may.

- **Site speed fix A** (PR #76, `loop/speed-fix-a`, head now `be51670`, stacked on #67; Carter's yes `decisions-2026-10-24-batch-six.md`
  2, covers going live). **Independent review 2026-10-25: 0 findings** (`2026-10-25-pr76-independent-review.md`).
  **Brought up to `main` `efba79c`** (merge commit; the one conflict, generated `docs/vault/tjurunga.html`, took main's
  absence page); local checks green. Missing: every GitHub check green on `be51670` incl. Lighthouse (site diff = reviewed `7100802` + #67); #67 on `main`; then a run that
  wrote none of #76 fast-forwards.

- **Journal hero part 1, The Archivist** (PR #77, `loop/journal-hero-archivist` @ `dbf5d16`, 2026-10-25). Built by the
  loop; local checks green (`2026-10-25-journal-hero-part-1.md`). **Independent review 2026-10-25: 0 findings**
  (`2026-10-25-pr77-independent-review.md`). Missing: Lighthouse green on `dbf5d16` (5/6 green); Carter's yes for #77
  (his PR #60 approval named #60).

## Merged
- Tjurunga takedown (PR #73): merged 2026-10-25 01:43 UTC by fast-forward `6c81a84` → `efba79c`, deploy run 200 green (Carter's yes `decisions-2026-10-24-merge-71-72-73.md`; reviews `2026-10-24-pr73-independent-review.md`, `2026-10-24-pr73-re-review.md`; 8/8 checks incl. Lighthouse; `2026-10-25-pr73-merged.md`).
- Reduced motion, part 1 (PR #74): merged 2026-10-24 23:30 UTC by fast-forward to `6c81a84`, deploy run 199 green (Carter's yes `decisions-2026-10-24-merge-71-72-73.md`; review `2026-10-24-pr74-independent-review.md`; 7/7 checks incl. Lighthouse on `6c81a84`).
- Hit-feel part 3 (PR #72): merged 2026-10-24 23:12 UTC by fast-forward to `0d16e84`, deploy run 198 green (Carter's yes `decisions-2026-10-24-merge-71-72-73.md`; review `2026-10-19-pr72-independent-review.md`; `2026-10-24-pr71-72-merged.md`).
- Hit-feel part 2 (PR #71): merged 2026-10-24 23:09 UTC by fast-forward to `99a3625`, deploy run 197 green (Carter's yes `decisions-2026-10-24-merge-71-72-73.md`; review `2026-10-19-pr71-independent-review.md`).
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
