# Mergeable items — running list (Item 22)

**Rule (Carter, Item 22):** an item is listed here as mergeable ONLY when it is completed AND up to standard,
meaning Carter's bar and Claude's own. Nothing merges unless it is listed here AND Carter approves that
specific item. Approval is per item, never blanket. Updated at every checkpoint; the build loop keeps it current.

**As of:** 2026-11-01 ~13:30 UTC (Carter's per-item yes recorded for #96 (five images), #99, #100, #101 (`decisions-2026-11-01-carter-yes-x4.md`); each still needs an independent review by another session + GitHub green). Earlier ~13:10 UTC (**#98 merged 13:08 UTC**, `main` `6d51ab9` → `f1c3c2a`, class (b)+(c)). Earlier ~13:07 UTC (PR #100 Ziggurat pad 44 px built `7d343e8`, per item; #98 Lighthouse still running at 13:05). Earlier (#98 Lighthouse still running at 13:08, not merged; PR #99 homepage 360 px search-box fix built `bb1a6af`, per item, waits on review + GitHub + Carter's yes). Earlier ~13:15 UTC (PR #98, audit Fix 6 homepage games wording, built `f1c3c2a`; waits on independent review + GitHub green; class (b)+(c)). Earlier ~12:55 UTC (#96 delta independently reviewed PASS, 0 findings; 9/9 green on `c5ecb5a`; waits only on Carter). Earlier ~12:05 UTC (#96 alt fixed + re-synced, head `c5ecb5a`; not mergeable yet). Earlier ~11:50 UTC (**#97 merged 11:45 UTC**, `main` `ff08cc1` → `6d51ab9`, deploy 224 green). Earlier ~10:55 UTC (PR #97 independently reviewed PASS; mergeable by class (c); merge push refused by the session guard). Earlier ~09:55 UTC (PR #97 ch08 typo built; waiting on independent review + GitHub). Earlier ~09:05 UTC (#96 independently reviewed: 1 needs Carter, 1 fixable; not mergeable). Earlier ~07:50 UTC (**#93 merged 07:43 UTC**, `main` `510885d` → `ff08cc1`, deploy 223 green). Earlier ~07:05 UTC (`main` now `510885d` after #94; #93 re-synced to `ff08cc1`, Lighthouse running; PR #96 share images built, waiting on review). Earlier ~03:05 UTC (#93 independently reviewed PASS at `e7149ed`, Carter's yes recorded; waits on Lighthouse). Earlier ~02:50 UTC (#92 merged, `main` `f923754`). Earlier ~02:15 UTC (Carter's yes for #92 recorded; #93 built). Earlier ~02:10 UTC (#92 delta independently reviewed, PASS; waits on Lighthouse + Carter's yes). Earlier 2026-10-31 22:47 UTC (#90 merged, deploy 219 green). Earlier ~23:00 UTC (#90 independently reviewed, 0 findings). Earlier ~22:45 UTC (PR #90 README refresh built, waiting on review). Earlier ~21:58 UTC (#88 and #89 merged and live, deploys 217 and 218 green). Earlier ~21:00 UTC (#88 and #89 independently reviewed, 0 findings each; #88 mergeable on Carter's yes). Earlier 2026-10-31 ~20:24 UTC (PRs #88 and #89 built). Earlier 2026-10-26 ~03:15 UTC (#53 merged by the loop). **Deployed (`main`, on www.getconexto.com and the-divine-archives.pages.dev):** `68b7b03` (PR #53, Pilgrimage batch 1 preview, fast-forwarded by the loop 03:07 UTC, deploy 215 green; before it `3785b2b`, PR #86, arcade tap targets part 1, fast-forwarded by the loop 18:45 UTC, deploy 214 green; before it `45d4a95` (PR #83, Journal touch polish, fast-forwarded by the loop 17:32 UTC, deploy 213 green; before it `3762691`, PR #77, The Archivist, fast-forwarded by the loop 16:49 UTC, deploy 212 green; before it `12e7d65`, PR #85, ch42 Newgrange correction + Armenian ark card, merged by Carter 2026-10-25 12:57 UTC; before it `91c40fe`, #64).

## Mergeable now
- **PR #99** `loop/home-search-360` `d5815c6` (homepage search box at 360 px): per-item yes `decisions-2026-11-01-carter-yes-x4.md` 1; independent review PASS 0 findings (`2026-11-01-pr96-99-100-101-independent-review.md`); 6/6 GitHub green incl. Lighthouse; local checks green. Merging now (2026-11-01 ~14:05 UTC).
- **PR #101** `bb241e5` and **PR #96** `8c18b18`: same review PASS, all GitHub green, per-item yes (same file 3, 4). Need a re-sync onto `main` after #99 and green checks on the re-synced heads.
- (PR #97 moved to Merged, 2026-11-01 11:45 UTC.)
- (PR #93 moved to Merged, 2026-11-01 07:43 UTC.)
- (none)

## Superseded note (kept for the record)
- **Pilgrimage open-flip (PR #88)**, `loop/pilgrimage-open-four` head `9fbc2ec` (completes #53; Carter's order
  `pilgrimage-open-four-2026-10-26.md`). Independent review 2026-10-31 by a run that wrote none of it: 0 findings
  (`2026-10-31-pr88-pr89-independent-review.md`, filed on `review-log` `f3924f2`); GitHub 9/9 green incl. Lighthouse;
  local checks green; headless phone 7 sites + museum clean. **Only missing: Carter's per-item yes** (now for `aad7174`, see below; also its GitHub checks).

## Waiting to qualify (not mergeable, and what is still missing)
- **Line-wrap typos ch07/15/16/45 + Carter's re-clear (PR #101)**, `loop/line-wrap-typos-cleared-2` head **`bb241e5`** (from `main` `f1c3c2a`). **Yes: per item, GIVEN** (re-clear, same file, 3). Local checks green. **Missing:** independent review, GitHub green.
- **Share images, five pages (PR #96)**, `loop/share-images-six` head **`8c18b18`** (main merged in + museum card dropped). **Yes: per item, GIVEN** for the five-image form (same file, 4). **Missing:** independent review of delta `c5ecb5a..8c18b18`, GitHub green.
- **Ziggurat pad 44 px, tap targets part 2 §1 (PR #100)**, `loop/zig-pad-44` head **`62a2124`** (re-synced onto `main` `f1c3c2a` 13:15 UTC, was `7d343e8`; `docs/assets/games/games.css`). Local checks green (`2026-11-01-pr100-zig-pad-44.md`). **Yes: per item, GIVEN** 2026-11-01 13:13 (same file, 2). **Missing:** independent review, GitHub green incl. Lighthouse. Note: Lighthouse on the superseded head `7d343e8` FAILED on treasure (88 → 78); base itself showed 4 of 9 runs at 78, and no rule in this diff applies to treasure in the Lighthouse viewport (PR comment 6558551456). The run on `62a2124` decides; if treasure fails again, investigate, don't assume noise.
- **Homepage search box at 360 px (PR #99)**, `loop/home-search-360` head **`d5815c6`** (re-synced onto `main` `f1c3c2a` 13:15 UTC, was `bb1a6af`; `docs/assets/archive.css` 1 line). Local checks green (`2026-11-01-pr99-home-search-360.md`). **Yes: per item, GIVEN** 2026-11-01 13:13 (`decisions-2026-11-01-carter-yes-x4.md` 1). **Missing:** independent review, GitHub green incl. Lighthouse.
- (PR #97 moved to Mergeable now, 2026-11-01 ~10:55 UTC.)
- **Share images for six pages (PR #96)**, `loop/share-images-six` head **`c5ecb5a`** (re-synced to `main` `6d51ab9` and Great Pyramid alt fixed 2026-11-01 ~12:00). **Independent review 2026-11-01 ~09:00: 2 findings**; the Great Pyramid alt one is fixed at `c5ecb5a` (pending delta review), the museum card lettering is with Carter. **2026-11-01 ~12:55 UTC: delta `842b51e..c5ecb5a` independently reviewed PASS, 0 findings (`2026-11-01-pr96-delta-review.md`, `review-log` `04a0ae4`); 9/9 GitHub green on `c5ecb5a` incl. Lighthouse.** Still missing: Carter's museum-card answer (and on (a) the drop-the-card delta, reviewed), **Carter's per-item yes** (new build; not by class).
- **2026-11-01 06:44 UTC: #93 re-synced** onto `main` `510885d` → head **`ff08cc1`** (merge commit adds only main's content; site diff byte-identical to `e7149ed`'s; local checks + headless re-run green). Missing only: Lighthouse green on `ff08cc1` (running from 06:45). Yes: per item (`decisions-2026-11-01-carter-b-a-a.md` 2) and class (b).
- **Era-page themes label, audit Fix 5 (PR #93)**, `loop/fix5-era-themes-label` head **`e7149ed`** (`c290cb6` + merge of `main` `f923754`; site diff identical). Independent review PASS, 0 findings (`2026-11-01-pr93-independent-review.md`, filed `review-log` `6868f26`). Carter's per-item yes recorded (`decisions-2026-11-01-carter-b-a-a.md` 2); also within class (b) approved audit fix. Local checks green. **Missing only: Lighthouse green on `e7149ed`** (6/7 green at 03:00 UTC).
- (PR #90 moved to Mergeable now, 2026-10-31 ~23:00 UTC.)
  **2026-10-31 ~21:10 UTC: `main` moved to `fcec69f` (#87 merged by its thread), so both branches were synced by merge
  commits that add only `main`'s content: #88 → `aad7174` (conflict in pilgrimage-data.js/pilgrimage.html resolved by taking
  main and re-applying the same four flips; diff vs main still the reviewed 4 files/15 lines; batch-2 sites stay preview),
  #89 → `6624c5c` (clean; diff vs main unchanged, 6 files). Local checks + headless (7 open, museum 7) green on both.
  GitHub checks re-running on the new heads; Carter's yes must name the new head.**
  **#88 `aad7174`: 9/9 GitHub checks green incl. Lighthouse (21:27 UTC).** **#89 `6624c5c`: 9/9 green incl. Lighthouse (21:28 UTC).**
- **Tjurunga absence page, official sources (PR #89)**, `loop/tjurunga-official-sources` head `08d4f51` (Carter's ruling
  `decisions-2026-10-26-absence-page-sources.md`). Built and locally checked 2026-10-31
  (`2026-10-31-pr89-tjurunga-official-sources.md`). Independent review 2026-10-31: 0 fixable findings, goes to Carter by
  rule (secret-sacred page). Missing: Lighthouse (running at ~21:00, 7/8 green); Carter's per-item yes (now for `6624c5c`). Lighthouse on `08d4f51` went green on re-run 21:04.
## Merged
- Homepage games wording, audit Fix 6 (PR #98): **merged 2026-11-01 13:08 UTC** by fast-forward `6d51ab9` → `f1c3c2a` (class (b) approved audit fix + (c) honesty wording, `decisions-2026-11-01-carter-b-a-a.md` 1; review `2026-11-01-pr98-independent-review.md`, 0 findings, by a session that wrote none of it; 6/6 checks green incl. Lighthouse (completed 13:07:29; `test`/`verify` workflows are path-filtered and do not run for `docs/index.html`); local checks re-run on `f1c3c2a` by the merging run; `2026-11-01-pr98-merged.md`).
- Line-wrap typo ch08 (PR #97): **merged 2026-11-01 11:45 UTC** by fast-forward `ff08cc1` → `6d51ab9` (Carter's yes by class (c) typo fix, `decisions-2026-11-01-carter-b-a-a.md` 1; review `2026-11-01-pr97-independent-review.md`, 0 findings; 9/9 checks green incl. Lighthouse; local checks + headless re-run green; deploy run 224 green; `2026-11-01-pr97-merged.md`).
- Era-page themes label, audit Fix 5 (PR #93): **merged 2026-11-01 07:43 UTC** by fast-forward `510885d` → `ff08cc1` (Carter's per-item yes `decisions-2026-11-01-carter-b-a-a.md` 2, also class (b) approved audit fix; review `2026-11-01-pr93-independent-review.md`, 0 findings; 7/7 checks green incl. Lighthouse; local checks + headless phone 9 era pages re-run green on `ff08cc1` this run; deploy run 223 green; `2026-11-01-pr93-merged.md`).
- ch19 audit Fixes 2+3 (PR #92): **merged 2026-11-01 02:44 UTC** by fast-forward `eb842de` → `f923754` (Carter's yes `decisions-2026-11-01-merge-92.md`; reviews `2026-11-01-pr92-independent-review.md` + `2026-11-01-pr92-delta-review.md`, 0 open findings; 10/10 checks green incl. Lighthouse; local checks green; `2026-11-01-pr92-merged.md`).
- Pilgrimage batch-2 open-flip (PR #91): merged 2026-11-01 ~01:35 UTC, `0959caf` → `eb842de`, deploy 220 green (`2026-11-01-pr91-merged.md`).
- README refresh, audit Fix 1 + Fix 8 (PR #90): **merged 2026-10-31 22:46 UTC** by fast-forward `dd35228` → `0959caf`
  (Carter's yes `decisions-2026-10-31-merge-90.md`; review `2026-10-31-pr90-independent-review.md`, 0 findings; 4/4 checks green;
  local checks green; deploy run 219 green).
- Tjurunga absence page, official sources (PR #89): **merged 2026-10-31 21:56 UTC** by fast-forward `aad7174` → `dd35228`
  (stacked on #88; Carter's yes `decisions-2026-10-31-merge-88-89.md`; review `2026-10-31-pr88-pr89-independent-review.md`, 0 findings;
  9/9 checks green incl. Lighthouse on `dd35228`; local + headless green; deploy run 218 green).
- Pilgrimage open-flip (PR #88): **merged 2026-10-31 21:36 UTC** by fast-forward `fcec69f` → `aad7174` (Carter's yes, same file;
  same review; 9/9 green on `aad7174`; deploy run 217 green).
- Pilgrimage batch 1 (PR #53): **merged by the loop 2026-10-26 03:07 UTC** by fast-forward `3785b2b` → `68b7b03`
  (Carter's per-item yes for `68b7b03`, `decisions-2026-10-26-pr53-option-a-67aabf1.md`; reviews PASS; 9/9 checks green incl.
  Lighthouse; local checks + 30 headless opens green; deploy run 215 green).
- Arcade tap targets, part 1 (PR #86): **merged by the loop 2026-10-25 18:45 UTC** by fast-forward `45d4a95` → `3785b2b`
  (Carter's per-item yes `decisions-2026-10-25-pr86-go.md`; review `2026-10-25-pr86-independent-review.md`, 0 findings; 6/6 checks
  green incl. Lighthouse; local checks + headless 96 opens re-run green on `3785b2b`; deploy run 214 green).
- Journal touch polish (PR #83): **merged by the loop 2026-10-25 17:32 UTC** by fast-forward `3762691` → `45d4a95`
  (Carter's per-item yes `decisions-2026-10-25-approve-83.md`; review `2026-10-25-pr83-independent-review.md`; 6/6 checks
  green incl. Lighthouse; local checks re-run green on `45d4a95`; deploy run 213 green).
- Journal hero part 1, The Archivist (PR #77): **merged by the loop 2026-10-25 16:49 UTC** by fast-forward `12e7d65` → `3762691`
  (Carter's per-item ruling `decisions-2026-10-25-merge-77-close-84.md` 1; reviews `2026-10-25-pr77-independent-review.md`,
  `2026-10-25-pr77-darker-cloak-re-review.md`; 8/8 checks green incl. Lighthouse; deploy run 212 green).
- Registry recount (PR #84): not merged; closed 2026-10-25 13:24 per Carter's ruling 2 (superseded by #85). Branch kept.
- ch42 Newgrange correction and the Armenian ark tradition card (PR #85, chat-session PR, its own review): merged by Carter 2026-10-25 12:57 UTC as `12e7d65`.
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
