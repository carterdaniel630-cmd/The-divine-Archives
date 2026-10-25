# Mergeable items — running list (Item 22)

**Rule (Carter, Item 22):** an item is listed here as mergeable ONLY when it is completed AND up to standard,
meaning Carter's bar and Claude's own. Nothing merges unless it is listed here AND Carter approves that
specific item. Approval is per item, never blanket. Updated at every checkpoint; the build loop keeps it current.

**As of:** 2026-10-25 10:40 UTC. **Deployed (`main`, on the-divine-archives.pages.dev and www.getconexto.com):** `c957af5` (PR #67 merged 2026-10-25 02:17 UTC, deploy run 201 green).

## Mergeable now
- (none: everything below is missing something)

## Waiting to qualify (not mergeable, and what is still missing)
- **ch02 "second death" wording** (PR #82, `loop/ch02-second-death` @ `82441ce`, off `main` `c957af5`): live chapter
  wording now framed as Egyptian belief and sourced (Roberson, *Expedition* 57:2; UCL BD 44). Local checks green.
  Missing: independent review by a run that wrote none of it; all GitHub checks green incl. Lighthouse; Carter's yes.
- **Qumran guided walk leaves Cave 4** (PR #81, `loop/qumran-walk-4b` @ `2c099a0`, **stacked on #68**: #68 + `main`
  `c957af5` + one Qumran commit). Built 2026-10-25; local checks green. **Independent review 2026-10-25 ~10:55: 0 open
  findings** (`2026-10-25-pr81-independent-review.md`); **10/10 GitHub checks green incl. Lighthouse (10:51).** Missing:
  #68 on `main` first, then Carter's yes for #81.

- **Pilgrimage wording fixes and guided walks** (PR #68, `claude/pilgrimage-51-fixes` @ `c4e5141`, base an older `main`).
  **Independent review 2026-10-25: 0 open findings** (`2026-10-25-pr68-independent-review.md`, by a loop run that wrote
  none of it); merges cleanly with `main` `c957af5`, local checks green on that merge; 9/9 GitHub green on the old base.
  Missing: Carter's yes for #68 (asked); then bring up to `main`, every check green on the new head incl. Lighthouse,
  local checks again.

- **Clear V72 and Ra-Horakhty** (PR #75, `loop/clear-v72-ra`, head now `71206ee`, stacked on #76; Carter's "clear", batch-six 3).
  **Independent review 2026-10-25: 0 findings** by a chat session that wrote none of it
  (`2026-10-25-pr75-independent-review.md`); brought up to `main` `efba79c`; local checks green. Missing: every GitHub
  check green on `71206ee` incl. Lighthouse (checks restarted after stacking; site diff = reviewed `223600f` + #67 + #76). **Carter 2026-10-25: "loop may merge"** (`decisions-2026-10-25-hero-show-me-and-75.md` 2): per-item approval,
  clearances included. Goes after #67 and #76.

- **Site speed fix A** (PR #76, `loop/speed-fix-a`, head now `be51670`, stacked on #67; Carter's yes `decisions-2026-10-24-batch-six.md`
  2, covers going live). **Independent review 2026-10-25: 0 findings** (`2026-10-25-pr76-independent-review.md`).
  **Brought up to `main` `efba79c`** (merge commit; the one conflict, generated `docs/vault/tjurunga.html`, took main's
  absence page); local checks green. #67 is on `main` (`c957af5`), so `be51670` fast-forwards directly. **2026-10-25 ~02:50: every condition met** (9/9 checks incl. Lighthouse; local checks green on a clean copy by a run that
  wrote none of it; `2026-10-25-pr76-qualified-merge-refused.md`). The fast-forward push was **refused by that session's
  safety check**; not retried another way. Missing only: the merge itself. **Retried 2026-10-25 06:55 after a fresh re-check (all green): refused again.** Now waits on Carter's Merge button on PR #76.

- **Journal hero part 1, The Archivist** (PR #77, `loop/journal-hero-archivist`, head now `d038119` with the darker cloak).
  Built by the loop; **independent review 0 findings on `dbf5d16`** (`2026-10-25-pr77-independent-review.md`).
  **Carter's yes 2026-10-25 ~02:15, with a darker cloak** (`decisions-2026-10-25-hero-yes-darker-cloak.md`).
  **Re-review of `d038119` (darker cloak) 2026-10-25: 0 findings** (`2026-10-25-pr77-darker-cloak-re-review.md`).
  Missing: bring up to `main` after #76 and #75; every check green on that head incl. Lighthouse; local checks.

- **Journal Sound pill under the ✕, phone sideways** (PR #78, `loop/journal-sound-landscape` @ `42e0a6a`, off `main`
  `c957af5`; built by the loop 2026-10-25, `2026-10-25-pr78-journal-sound-landscape.md`). Local checks green.
  **Independent review 2026-10-25 08:10: 0 open findings** (`2026-10-25-pr78-independent-review.md`; GitHub 5/6 green then).
  **All 6 GitHub checks green on `42e0a6a` incl. Lighthouse (08:10).** Missing only: Carter's yes for this item.

- **Journal on narrow upright phones + full-screen button name** (PR #79, `loop/journal-phone-320` @ `3018cdd`, off `main`
  `c957af5`; built by the loop 2026-10-25, `2026-10-25-pr79-journal-phone-320.md`). Local checks green.
  **Independent review 2026-10-25 ~10:00: 0 open findings** (`2026-10-25-pr79-independent-review.md`).
  **All 6 GitHub checks green on `3018cdd` incl. Lighthouse (09:58).** Missing only: Carter's yes for this item.
  Merges cleanly with #78 (trial merge).

- **Reliquary dropdowns inside the dialog on 461–484 px phones** (PR #80, `loop/reliquary-phone-480` @ `c9408a0`, off
  `main` `c957af5`; built by the loop 2026-10-25, `2026-10-25-pr80-reliquary-phone-480.md`). Local checks green.
  **Independent review 2026-10-25 ~10:10: 0 open findings** (`2026-10-25-pr80-independent-review.md`). GitHub 4/6 green
  at review; **all 6 GitHub checks green incl. Lighthouse (10:45).** Missing only: Carter's yes for this item.

## Merged
- Site fixes 2026-10-18 (PR #67): merged 2026-10-25 02:17 UTC by fast-forward `efba79c` → `c957af5`, deploy run 201 green (Carter's yes `decisions-2026-10-24-batch-six.md` 1; review `2026-10-24-pr67-independent-review.md`; 8/8 checks incl. Lighthouse; `2026-10-25-pr67-merged.md`).
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
