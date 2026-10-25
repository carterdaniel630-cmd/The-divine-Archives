# Mergeable items — running list (Item 22)

**Rule (Carter, Item 22):** an item is listed here as mergeable ONLY when it is completed AND up to standard,
meaning Carter's bar and Claude's own. Nothing merges unless it is listed here AND Carter approves that
specific item. Approval is per item, never blanket. Updated at every checkpoint; the build loop keeps it current.

**As of:** 2026-10-25 ~13:20 UTC. **Deployed (`main`, on www.getconexto.com and the-divine-archives.pages.dev):** `91c40fe` (PR #64 merged by Carter 2026-10-25 12:30 UTC, deploy run 210 green).

## Mergeable now
- (none: everything below is missing something)

## Waiting to qualify (not mergeable, and what is still missing)
- **Registry recount** (PR #84, `loop/registry-count-after-merges` @ `88f2aa8`, off `main` `caedabc`; merges cleanly with
  `main` `91c40fe`): fixes the 2 failing internal tests on `main` (registry totals 2 short after #68 and #82). Internal data
  only, no `docs/` change. **Independent review 2026-10-25 ~13:00: 0 open findings** (`2026-10-25-pr84-independent-review.md`);
  local checks green on `main` + `88f2aa8`; **5/5 GitHub checks green** (no Lighthouse owed: no `docs/` change).
  Missing only: Carter's yes for #84 (then his Merge button).
- **Journal touch polish** (PR #83, `loop/journal-touch-polish`, now head **`be2ad69`** = `39eeef8` + `main` `91c40fe` +
  #84's reviewed recount `88f2aa8`, clean merges adding only already-reviewed diffs): Select/Start tap areas reach 44 px on
  touch screens (shared controller: Journal and Fighter); the first tip names the on-screen buttons on touch phones.
  **Independent review 2026-10-25 ~13:20: 0 open findings** (`2026-10-25-pr83-independent-review.md`); local checks green
  on `be2ad69`. Missing: every GitHub check green on `be2ad69` incl. Lighthouse (started by the push); Carter's yes for #83.
- **Journal hero part 1, The Archivist** (PR #77, `loop/journal-hero-archivist`, head `d038119` with the darker cloak).
  **Independent review 0 findings on `dbf5d16`**; **re-review of `d038119` 0 findings**. **Carter's yes 2026-10-25 ~02:15,
  with a darker cloak** (`decisions-2026-10-25-hero-yes-darker-cloak.md`). **Brought up 2026-10-25 ~13:05 to `8204268`**
  (`main` `91c40fe` + #84's reviewed recount `88f2aa8`, clean merges, adding only already-reviewed diffs); local checks
  green. GitHub on `8204268` at ~12:52: 7/8 green, Lighthouse still running. Missing: Lighthouse green; then Carter's Merge button (after #84).

## Merged
- Reviewer and auditor project skills (PR #64): merged by Carter 2026-10-25 12:30 UTC as `91c40fe`, deploy run 210 green.
- #76, #75, #78, #79, #80, #82, #68, #81: merged by Carter's Merge buttons 2026-10-25 ~11:58–12:00 UTC (GitHub merge
  commits, so `main` ids differ from the loop heads); `main` then `caedabc`, deploy run 209 green. Reviews:
  `2026-10-25-pr{76,75,78,79,80,82,68,81}-independent-review.md`.
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
