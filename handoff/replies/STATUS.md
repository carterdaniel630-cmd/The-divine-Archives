# Build-side STATUS — running (overwritten at every checkpoint)

**As of:** 2026-10-25 ~13:05 UTC (build loop, PR #77 bring-up run). **Answers:** manifest-v2 through Item 32, every `decisions-*.md` /
`correction-*.md` / `order-*.md` / `approval-*.md` to date, plus the unnumbered files committed 2026-10-19 → 2026-10-22:
`merge-approval-2026-10-19.md`, `fix-random-meta-description.md`, `tjurunga-takedown-order-2026-10-20.md`,
`council-rulings-2026-10-20.md` (+ Yes/No addendum), `FIRST-ORDER-claude-briefing.md`, `rework-standard-order.md`,
`site-speed-finding.md`, `journal-hero/README.md`, `sitemap.xml`, `decisions-2026-10-24-merge-71-72-73.md`,
`decisions-2026-10-24-batch-six.md`, and `journal-hero-b64/` (committed by Carter's account 2026-10-25 00:05 UTC), `decisions-2026-10-25-domain-and-kadesh.md`, and `decisions-2026-10-25-hero-show-me-and-75.md`, and `decisions-2026-10-25-hero-yes-darker-cloak.md`, and `decisions-2026-10-25-armory-intake-and-relic-links.md` (incl. §3 one loop, §4 batch of 10 is the unit). **Deployed (`main`):** `91c40fe` (PR #64 merged by Carter 2026-10-25 12:30 UTC, deploy run 210 green; before it the
eight merges to `caedabc`, deploy 209), at www.getconexto.com (the live site) and the-divine-archives.pages.dev.
**Open loop branches:** `loop/journal-hero-archivist` = #77 (`8204268`: `d038119` + `main` `91c40fe` + #84's recount; approved), `loop/journal-touch-polish` = #83 (`39eeef8`),
`loop/registry-count-after-merges` = #84 (`88f2aa8`), `loop/journal-hero-redesign` = #60 (on hold). `staging/ready-line` carries `handoff/`.
**Loop:** RUNNING. **Full briefing to Muse delivered:** `handoff/replies/claude-full-briefing.md` (First Order, 2026-10-21).

## Done
- 2026-10-25 ~12:00: Carter's yes to each recorded; #82 Lighthouse green (11:51); #76 local checks re-run green; merge to the live site refused by the safety system (see Needs Carter).
- 2026-10-25 ~11:42–12:15: **PR #83 built: Journal on touch phones** (Next 10, two pre-existing phone defects, value 3;
  everything higher waits on Carter or Muse). (1) Select/Start pills: tap height through the centre was 24–25 px; now
  44–48 px on touch screens via an invisible centred layer (pills look the same; stacked pills 1.4rem apart so areas
  never overlap; shared controller, so Fighter's Pause pill too). (2) First tip said "↑ or Space … J or X" on touch
  phones; now "◀ ▶ run · A jumps (hold for height) · B cracks the whip." there, keys on desktop. 2 files, +12 −3, off
  `main` `c957af5`. Headless phone 320–600 upright + 2 sideways, Journal and Fighter: 0 neighbour-button points taken,
  0 script errors, no sideways scroll; build 0 changes, 17/17 verify, 42/42 tests, review-checks 9/9 (0 warnings);
  trial merge with #78/#79/#80 clean and re-measured (44–48 px, 0 outside the dialog). #82 Lighthouse still running at
  11:45 (not waited on). Previews `handoff/previews/journal-touch-polish/`. Reply `2026-10-25-pr83-journal-touch-polish.md`.
  Items per run: 1.
- 2026-10-25: **Independent review of PR #82** (ch02 second death) by a run that wrote none of it: 0 open findings;
  Roberson (Penn *Expedition* 57:2) and UCL BD 44 re-opened and support the new wording; local checks green; headless
  phone/desktop clean; Lighthouse still running (reply `2026-10-25-pr82-independent-review.md`).
- 2026-10-25 ~10:56–11:30: **PR #82 built: ch02 "second death" framed as belief and sourced** (Next 10 audit note,
  live chapter wording, value 1). Opening said the condemned "simply ceases — the second death, annihilation" unhedged.
  Now: an ending, not eternal torment, in Egyptian belief; "non-existence"; BD 44 "formula for not dying again". Sources
  opened: Roberson, "A Season in Hell", *Expedition* 57:2 (Penn Museum); UCL Digital Egypt BD 44 (British Museum Hunefer
  page opened, doesn't state the fate, not cited; Wikipedia Ammit not opened). Edited md + `content/chapters.js` + source
  log; full build twice (2nd pass 0 changes), 17/17 verify, 42/42 tests, review-checks 9/9 (0 warnings); headless phone
  + desktop: new text and link present, pending banner kept, 0 errors, no sideways scroll. Preview
  `handoff/previews/ch02-second-death/phone.png`. Slip: this run's lock commit `3167e21` carried an attribution line
  naming a model; not rewritten (shared branch). Reply `2026-10-25-pr82-ch02-second-death.md`. Items per run: 1.
- 2026-10-25 ~10:43–10:56: **PR #81 independently reviewed: 0 open findings** (Next 4h, live defect, value 3; this run
  wrote none of #81 or #68). Stack is exactly #68's reviewed diff + `main` + the 2-line Qumran commit (byte-compared).
  Clean copy: review-checks 9/9 (0 warnings, build current), 17/17 verify, 42/42 tests. Own headless "Walk on" test,
  phone: `main` stops in Cave 4b in both motion modes; #81 ends at the route's last point in Cave 3 in both; other five
  sites come to rest, 0 script errors. **#81: 10/10 GitHub green incl. Lighthouse. #80: Lighthouse finished green (6/6).**
  Report `2026-10-25-pr81-independent-review.md`; filed on `review-log` @ `c33d34e`. Items per run: 1.
- 2026-10-25 ~10:25–10:40: **PR #81 built: Qumran guided walk no longer stops in Cave 4** (Next 4h, live defect,
  value 3). Three route points back through the 4b passage (2 lines). **Stacked on #68** (its engine change is needed:
  without it the walk loops back to Cave 4; tested), on `loop/qumran-walk-4b` @ `2c099a0`. Build 0 changes, 17/17
  verify, 42/42 tests, review-checks 9/9 (0 warnings); headless phone: all 6 sites reach their last stop (reduced
  motion), Qumran also in normal motion; 0 script errors. #80: runtime ×2 green, Lighthouse still running at 10:25.
  Reply `2026-10-25-pr81-qumran-walk.md`. Items per run: 1.
- 2026-10-25 ~10:03–10:24 (earlier written as "~10:50", corrected): **PR #68 independently reviewed: 0 open findings** (Next 8a, live Pilgrimage wording, value 1;
  this run wrote none of it). 8 changed claims checked against opened sources (Ararat 1840 study, Britannica 40 km,
  Cyril's 351 letter, English Heritage Stone 56, Stetson Heel Stone 4.5 m). Local merge with `main` clean; build 0
  changes, 17/17 verify, 42/42 tests, review-checks 9/9 (0 warnings). Own headless "Walk on" test, 6 sites, phone,
  reduced motion: Ararat and Alexandria stuck on `main`, reach the end on #68; others unchanged. **Found (pre-existing,
  live): Qumran's guided walk stops in Cave 4's Chamber 4b** on `main` and #68 (added to Next 4h). #80 Lighthouse
  still running at 10:05 (not waited on). Report `2026-10-25-pr68-independent-review.md`; filed on `review-log` @
  `e8caf4a`. Items per run: 1.
- 2026-10-25 ~10:10: PR #80 independently reviewed, 0 open findings (`2026-10-25-pr80-independent-review.md`); #79 Lighthouse confirmed green (all 6 checks).
- 2026-10-25 ~09:51–10:20: **PR #80 built: Reliquary start-screen dropdowns no longer run past the dialog on upright
  phones 461–484 px wide** (Next 10, live defect, value 3). First checked #79's Lighthouse (Next 4f): still running
  after 25 min, so not waited on. Cause: `1fr` grid columns can't shrink below the longest option text. CSS only,
  4 lines in `games.css`. Before on `main`: 4 elements past the edge at 465/475/480; after: none 320–520, sideways,
  desktop. All 12 games × 5 sizes: 0 errors, 0 overflow. Build 0 changes, 17/17 verify, 42/42 tests, review-checks
  9/9 (0 warnings). Trial merges with #78 and #79 clean. Screenshot `handoff/previews/reliquary-phone-480/`. Reply
  `2026-10-25-pr80-reliquary-phone-480.md`. Items per run: 1.
- 2026-10-25 ~09:42–10:00: **PR #79 independently reviewed: 0 open findings** (Next 4f; this run wrote none of it).
  Own headless check, Journal started: `main` clips at 320–360 and 421–440 upright; #79 clips nowhere 320–520 or
  sideways; A/B buttons ≥46 px; full-screen name toggles; 12 games 0 errors. Local checks green (build current, 17/17
  verify, 42/42 tests, review-checks 9/9). GitHub 5/6 green, Lighthouse still running. Trial merge with #78 clean.
  Report `2026-10-25-pr79-independent-review.md`, filed on `review-log` (`0d01a20`). Slip logged in the report: this
  run's lock commit `ac182ff` carried an attribution line naming a model; not rewritten (shared branch).
- 2026-10-25 ~09:19–10:00: **PR #79 built: Journal on narrow upright phones + full-screen spoken name** (Next 10,
  value 3; everything above waits on Carter or Muse). Journal upright 320: hearts/"Plunder"/A button no longer cut
  off; also found and fixed A button past the edge at 421–470. Full-screen button now has a spoken name (aria-label
  follows the label). 8 lines, 2 files. All 12 games, 9 upright widths + sideways: 0 errors, 0 overflow; 17/17
  verify, 42/42 tests, review-checks 9/9 (0 warnings). Pre-existing, noted: Reliquary at 480 upright overflows.
  Reply `2026-10-25-pr79-journal-phone-320.md`. Items per run: 1.
- 2026-10-25 ~08:42–09:35: **First weekly loop audit** (Next 0, value 6; none since 2026-10-11), by a run that wrote
  none of the sampled items. 19 reviewer reports, 16 items drawn at random and re-checked blind (verdicts committed
  first, `732a2ed`): **15 of 16 agreed**; 1 disagreement, preview only: Göbekli Tepe (PR #53) still says "the oldest
  known megaliths", unsupported by its sources. Rolling accuracy 97%, **auto-pass stays on**. Coverage gap: #43 never
  reviewed on its own. Filed on `review-log` @ `cc7c8d3`. No site file changed. Reply `2026-10-25-weekly-audit.md`.
  Items per run: 1.
- 2026-10-25 ~07:53–08:10: **PR #78 independently reviewed** (`42e0a6a`) by a run that wrote none of it: **0 open
  findings**. Clean copy: build 0 changes, review-checks 9/9 (0 warnings), 17/17 verify, 42/42 tests. Own headless
  script, phone emulation: sideways 6 widths, `main` has the Sound pill under the ✕ at all six, #78 at none; upright 6
  sizes identical to `main`; all 12 games sideways 0 script errors. GitHub 5/6 green, Lighthouse running (not waited
  on). Note (pre-existing): the full-screen button has no spoken name wherever its label is hidden; added to Next 10.
  #76 still not merged (`main` `c957af5`). Reply `2026-10-25-pr78-independent-review.md`; filed on `review-log` @ `2961595`. Items per run: 1.
- 2026-10-25 ~07:45–08:20: **PR #78 built: Journal Sound pill no longer under the ✕ with the phone sideways** (live
  defect, value 1/3; the #76 chain still waits on Carter's Merge button). Overlap was sideways-only (568–932 wide;
  hearts under "Full screen" at 568 too). CSS-only, 5 lines; build 0 changes, 17/17 verify, 42/42 tests, review-checks
  9/9 (0 warnings); headless sideways 6 widths no overlap, upright unchanged, 12 games 0 errors. New pre-existing
  defect noted: upright at 320 wide the Journal HUD and A button are clipped. Reply
  `2026-10-25-pr78-journal-sound-landscape.md`. Items per run: 1.
- 2026-10-25 ~06:42–06:58: **PR #76 fast-forward retried once, refused again** by this session's safety check (not
  tried another way; `main` still `c957af5`). Found the 02:48 lock stale (~4 h, the run before ended without removing it)
  and overwrote it. Re-checked #76 on `be51670` by a run that wrote none of it: 9/9 GitHub checks green incl. Lighthouse;
  clean copy: full build 0 changes, 17/17 verify, 42/42 tests, review-checks 9/9 (0 warnings); headless phone, all 88
  Vault pages: 0 script errors, 0 wider than the phone; Mendoza/Borgia/Voynich 0 outside-library requests on open.
  Then **Next 4b done (handoff only):** `main`'s README and site pages already name getconexto.com, so no PR needed;
  `CURRENT.md` now opens with the live site; the 2026-10-17 "not pointed" ruling marked superseded; a wording note on
  the value ranking. Dated records keep their wording. Folded Carter's batch-of-10 ruling (§4) into Next 4d.
  Reply `2026-10-25-pr76-retry-refused-live-site-docs.md`. Items per run: 1 (+ the planned merge retry).
- 2026-10-25 ~02:42–02:55: **PR #76 fully qualified, merge refused** by this session's safety check on the push to
  `main` (not retried another way). By a run that wrote none of #76: 9/9 GitHub checks green on `be51670` incl. Lighthouse
  (02:32); clean copy: build 0 changes, 17 verify, 42/42 tests, review-checks 9/9 (0 warnings); headless phone on all 87
  changed Vault pages: 0 script errors, 0 too wide; Mendoza/Borgia/Voynich 0 outside requests on open, 1 on scroll.
  `main` still `c957af5`. Reply `2026-10-25-pr76-qualified-merge-refused.md`. Items per run: 1.
- 2026-10-25 ~02:20–02:30: **PR #77 darker cloak re-reviewed** (`d038119`) by a run that wrote none of it: **0 findings**.
  Only the coat and hood are darker (skin/beard pixels: 7 of 10,760 changed by ≤4/255 in the portrait); sheet untouched;
  `cut.py` repeatable; build 0 changes, review-checks 9/9 (0 warnings), 17 verify, 42/42 tests; headless phone both
  motion modes: all art loads, run/jump/cast, 0 script errors. GitHub 5/6, Lighthouse running. #76 Lighthouse still
  running on `be51670` (not waited on). Reply `2026-10-25-pr77-darker-cloak-re-review.md`; filed on `review-log` @ `1fa5464`. Items per run: 1.
- 2026-10-25 ~02:13–02:25: **PR #67 merged** (live phone fixes, Carter's yes batch-six 1) by fast-forward `efba79c` →
  `c957af5`, **deploy run 201 green**, by a run that wrote none of #67. 8/8 GitHub checks green incl. Lighthouse; local
  re-check on a clean copy: build twice (0 changes), 17 verify, 42/42 tests, review-checks 9/9 (0 warnings); headless
  phone: 88 pages incl. all 83 chapters + the Pilgrimage arcade site, 0 script errors, 0 wider than the phone, eras
  5,944 px. Folded Carter's ~02:15 yes for #77 with a darker cloak (now `d038119`). Reply `2026-10-25-pr67-merged.md`.
  Items per run: 1.
- 2026-10-25 ~02:07–02:18: **Reviewer and auditor, option A** (Next 0). A chat session folded the rule into `LOOP.md`
  step 7 at the same time; this run merged the two texts into one (review copies in `reviews/loop/` plus a dated index
  the auditor's sampler reads; weekly audit on/after Wednesday or when none in 7 days; the planted-error test is not
  done by the loop, since scoring it means opening `KEY.md`). **Back-filled `review-log` @ `eaf6436`:** 16 loop reviews
  2026-10-17 → 2026-10-25 copied unchanged, indexed in `reviews/2026-10-25-loop-reviews-catchup.md` (15 passed, 0 fixed,
  2 need Carter, both answered), one `runs.md` line. No site file changed; 42/42 tests. **PR #67: 8/8 green on
  `c957af5`** (Lighthouse done 02:10). Folded Carter's 02:08 answers (#77 show me first; loop may merge #75).
  Reply `2026-10-25-reviewer-auditor-option-a.md`. Items per run: 1.
- 2026-10-25 ~02:05–02:20: **PR #77 independently reviewed** (Journal hero part 1, `dbf5d16`) by a run that wrote none
  of it: **0 findings**. Sheet in the PR byte-identical to Carter's approved sheet; `cut.py` re-run gives identical files;
  no face drawn, no smile invented (the two portraits are the same file); no fedora or jacket. Build current, review-checks
  9/9 (0 warnings), 17 verify, 42/42 tests; headless phone in both motion modes: all art loads, stand/run/jump/cast,
  0 script errors. GitHub 5/6 green, Lighthouse running. #67 Lighthouse still running; #75/#76 restacked by the chat
  session's claim (checks restart). Not waited on. Reply `2026-10-25-pr77-independent-review.md`. Items per run: 1.
- 2026-10-25 ~01:57–02:05: **Journal hero part 1 built: The Archivist** (Next 4) on `loop/journal-hero-archivist` @
  `dbf5d16`, **PR #77**. The live fedora/leather-jacket explorer is replaced by parts cut from Carter's approved hooded
  sheet (face = the sheet's own pixels, never redrawn; no smile invented); portraits from the front view; coat-sleeve
  arm; `art-source/archivist/cut.py` repeatable. Build unchanged elsewhere, review-checks 9/9 (0 warnings), 17 verify,
  42/42 tests; headless phone in both motion modes: all art loads, stand/run/jump/cast, 0 script errors. Set pieces
  (whip, boulder) are part 2. #67 and #76 Lighthouse still running (not waited on). Reply `2026-10-25-journal-hero-part-1.md`.
  Items per run: 1.
- 2026-10-25 ~01:53–02:05 (chat session, parallel): **PR #75 independently reviewed: 0 findings**, brought up to `main`
  → `223600f`; local checks green. Reply `2026-10-25-pr75-independent-review.md`.
- 2026-10-25 ~01:51–01:56: **PR #76 (speed fix A) independently reviewed: 0 findings**, by a run that wrote none of it,
  and **brought up to `main` `efba79c`** → `7100802` (one conflict in the generated Tjurunga page; took main's absence
  page). review-checks 9/9 (0 warnings), 17 verify, 42/42 tests; headless phone: Mendoza, Borgia, Voynich ask the
  outside library 0 times as the page opens and once on scroll / button / `#folio=` / `#study`; other Vault pages 0;
  0 script errors. PR #67 checks: 7/8 green on `c957af5`, Lighthouse running. Reply `2026-10-25-pr76-independent-review.md`.
  Items per run: 1.
- 2026-10-25 ~01:47–01:51: **PR #67 brought up to `main` `efba79c`** (merge commit, no conflict) → head **`c957af5`**.
  Site diff byte-identical to the reviewed `1681050`. review-checks 9/9 (0 warnings, build matches committed), 17 verify,
  42/42 tests; headless phone check of seven pages plus all 83 chapters: 0 script errors, 0 pages wider than the phone,
  eras page 5,944 px as reviewed. Not merged: GitHub checks just started, not waited on with the lock.
  Reply `2026-10-25-pr67-brought-up.md`. Items per run: 1.
- 2026-10-25 ~01:42–01:50: **PR #73 merged** (Tjurunga takedown, Carter's yes) by fast-forward `6c81a84` → `efba79c`,
  **deploy run 200 green**, by a run that wrote none of #73. Lighthouse had finished green at 00:02 (8/8). Local checks
  re-run on a clean copy: build repeatable, 17 verify, 42/42 tests, review-checks 9/9 (0 warnings); headless phone check
  of seven pages, 0 script errors, 0 images on the absence page. Live page not opened (address blocked from this
  session). Found: the three Journal hero images arrived (`handoff/journal-hero-b64/`), so Next 4 is unblocked.
  Reply `2026-10-25-pr73-merged.md`. Items per run: 1.
- 2026-10-24 ~23:50–00:05: **Site speed fix A built** (Carter's yes, batch-six 2) on `loop/speed-fix-a` @ `10b075c`,
  **PR #76**. Codex Mendoza, Codex Borgia and the Voynich Manuscript now ask the holding library for their scans only
  when the reader nears the viewer, taps "Open the manuscript", or arrives by a `#folio=`/`#study` link. Measured
  headless at phone size: outside requests as the page opens 1 → 0 on all three; scroll / button / deep link each give
  exactly 1; other Vault pages unchanged; 0 script errors. Build matches committed, review-checks 9/9 (0 warnings),
  17 verify, 42/42 tests. PR #73 Lighthouse still running (not waited on). A parallel session worked at the same time
  (#67 brought up, #75 opened, #61 closed); no overlap with this item. Reply `2026-10-24-speed-fix-a-built.md`.
  Items per run: 1.
- 2026-10-24 ~23:43–23:50: **PR #73 independently re-reviewed** (Tjurunga takedown, `efba79c`, softened wording) by a
  run that wrote none of it: **0 findings**. Only change since the reviewed `529b1eb` is the softened sentence; it is
  supported by the NT Government Strehlow Research Centre page ("one of Australia's most important collections").
  Build clean and repeatable, review-checks 9/9 (0 warnings), 17 verify, 42/42 tests; headless phone check of six pages,
  0 script errors, 0 images on the absence page. GitHub 7/8 green, Lighthouse running (started 23:42), not waited on
  with the lock held. Reply `2026-10-24-pr73-re-review.md`. Items per run: 1.
- 2026-10-24 ~23:30: **PR #74 merged** (reduced motion part 1, Carter's yes) by fast-forward to `6c81a84`, deploy 199
  green; 7/7 checks on `6c81a84` (Lighthouse: fighter 87→86, treasure 78→77, inside the 5-point gate). The lock commit
  for this merge failed to write (its folder was gone), so the merge ran with no lock file; no other run held the lock
  at the time (checked just before). Reply `2026-10-24-pr74-merged.md`.
- 2026-10-24 23:09–23:13: **PRs #71 and #72 merged** (hit-feel parts 2 and 3, Carter's yes): fast-forward to `99a3625`
  (deploy 197 green), then `0d16e84` (deploy 198 green). Reply `2026-10-24-pr71-72-merged.md`.
- 2026-10-24 ~22:55–23:10: **PR #67 independently reviewed** (site fixes, `1681050`) by a run that wrote none of it:
  **0 findings**. Measured at phone size, live vs #67 on `361ba21`: eras page 8,084 → 5,944 px (emblem 282 → 46 px);
  chapter pages wider than the phone 45/83 → 0/83; arcade line names the four gods (Carter's Hades ruling). Build clean,
  review-checks 9/9 (0 warnings), 17 verify, 42/42 tests, 0 script errors; 9/9 GitHub checks green on `1681050`.
  #71/#72 Lighthouse still running (started 22:44), not waited on. Reply `2026-10-24-pr67-independent-review.md`.
  Items per run: 1.
- 2026-10-24 ~22:40–22:55: **PR #74 independently reviewed** (reduced motion part 1, `7ec8244`) by a run that wrote
  none of it: **0 findings**. Measured by playing at phone size with its own script: reduced motion on gives 0 shaken
  frames and flash ≤ 0.06 in both games (off: 441 / 271 shaken frames). Build clean, review-checks 9/9 (0 warnings),
  17 verify, 42/42 tests, fight test to KO, 0 script errors; merges onto `361ba21` with no conflict. GitHub 6/7 green,
  Lighthouse running (not waited on). Found a parallel session had already brought #71 → `99a3625` and #72 → `0d16e84`
  up to `main` under Carter's new yes; this run's identical #71 merge was not pushed. Reply
  `2026-10-24-pr74-independent-review.md`. Items per run: 1.
- 2026-10-24 ~22:33–22:45: **PR #70 merged** (hit-feel part 1, Carter's per-item yes `merge-approval-2026-10-19.md`) by
  fast-forward `09f48b3` → `361ba21`; **deploy run 196 green**. Every LOOP.md condition checked by a run that wrote none
  of #70: site diff byte-identical to the independently reviewed `ea70b77`; 6/6 GitHub checks green incl. Lighthouse;
  build clean and repeatable, review-checks 9/9 (0 warnings), 17 verify, 42/42 tests; headless phone play of The
  Firmament and Antithesis in both motion modes, 0 script errors, shake under normal motion and **none under reduced
  motion**. PR #74 still merges cleanly onto the new `main`. Reply `2026-10-24-pr70-merged.md`. Items per run: 1.
- 2026-10-24 ~22:15–22:40: **Reduced motion, part 1** (Next 5) on `loop/reduced-motion` @ `7ec8244`, **PR #74**:
  site-wide audit with reduced motion on (25 pages, nothing moves on its own). Divine Casualties and The Unfinished
  Journal still shook and flashed for those visitors. Now 0 shaken frames and flashes ≤ 0.06 (was 95 / 0.25 and
  85 / 0.157, measured by playing). Build clean, review-checks 9/9 (0 warnings), 17 verify, 42/42 tests, CI fight test
  to KO, phone load 0 errors. **PR #70: Lighthouse green 22:28, now 6/6 green**; **PR #73: 8/8 green**.
  Reply `2026-10-24-reduced-motion-part-1.md`. Items per run: 1.
- 2026-10-24 ~22:10–22:30: **Site speed diagnosed** (Next 4, prepare only): `handoff/research/site-speed-diagnosis-2026-10-24.md`.
  The slowest page waits on an outside library's server as it opens (Codex Mendoza, also Borgia and Voynich); Vault
  pages carry the viewer and all-88 data; most pages wait on Google Fonts. Fixes A–E proposed, nothing built.
  **Journal hero: blocked** — the three reference images in the README were never committed. **PR #70:** Lighthouse
  still running at 22:11, not merged. Reply `2026-10-24-pr70-wait-hero-blocked-speed-diagnosis.md`. Items per run: 1.
- 2026-10-24 ~21:55–22:12: **PR #73 independently reviewed** (Tjurunga takedown, `529b1eb`) by a run that wrote none
  of it: every point of the order met; build repeatable, review-checks 9/9 (0 warnings), 17 verify, 42/42 tests;
  headless phone check of seven pages, 0 script errors, 0 images on the absence page; share card shows no object.
  One wording point for Carter ("the largest collection" not supported by the sources opened). GitHub: 7/8 green,
  Lighthouse running. **PR #70:** Lighthouse still running at 22:08 (started 21:45), so not merged; not waited on.
  Reply `2026-10-24-pr73-independent-review.md`. Items per run: 1.
- 2026-10-24 ~21:47–22:35: **Tjurunga takedown built** (Next 2) on `loop/tjurunga-absence` @ `529b1eb`, **PR #73**:
  V68 withdrawn from the Vault index (87 shown), era page, museum and search; absence page at the same URL with the
  verbatim wording; museum room note; ch61 link relabelled, prose untouched; sitemap URL kept; `random.html`
  description added. Nothing deleted. Full build (idempotent), review-checks 9/9 (0 warnings), 17 verify, 42/42 tests,
  headless phone check of six pages, 0 errors. PR #70 Lighthouse still running at 22:30, not waited on.
  Reply `2026-10-24-tjurunga-takedown-built.md`. Items per run: 1.
- 2026-10-24 ~21:42–22:10: **PR #69 merged** (Graphify plain-word names) by fast-forward to `09f48b3`, Carter's per-item
  yes; local checks re-run green, 6/6 GitHub checks green; deploy run 195 green. **PR #70 brought up to `main`** with a
  merge commit (`361ba21`, change identical to the reviewed one; the rebase force-push was refused by the session's
  safety check, not retried). Local checks green; waits on GitHub checks. Reply `2026-10-24-pr69-merged-pr70-updated.md`.
  Items per run: 1.
- 2026-10-24 ~20:43–21:30: **Full briefing to Muse** (`FIRST-ORDER-claude-briefing.md`), committed at
  `handoff/replies/claude-full-briefing.md`: setup, site, everything built and its state, capabilities and limits,
  current state, known problems, decisions. Done first and alone, as ordered; nothing else built or merged this run.
  Found: the 2026-10-19 06:25 lock was never removed and no run worked from then until now (usage limits on the
  scheduled tasks this week, inferred); overwritten as stale. Reply `2026-10-24-briefing-delivered.md`. Items per run: 1.
- 2026-10-19 ~06:15–06:35: **Treaty of Kadesh tablet rebuilt** (relic 1 of 4, Next 2), preview only in
  `handoff/previews/treaty-of-kadesh/` (Muse's file left in place). Now loads the repo's three.js (the Muse file could not
  show anything), pressed-wedge cuneiform with raking light and dust in the grooves, cushion-shaped clay, flips top over
  bottom, tap a section for its clause; invented quotations removed; two unsourced facts removed; evidence-honesty
  section and sources added (2026 Hattusa fragment confirmed). Headless phone check in both motion modes: 0 errors.
  Clean build, review-checks 9/9 (0 warnings), 17 verify, 42/42 tests (reply `2026-10-19-treaty-of-kadesh-rebuilt.md`).
  Same run: **PR #72 Lighthouse finished green** (06:19): #72 now 7/7. Items per run (Item 32): 1 item.
- 2026-10-19 ~05:59–06:20: **PR #72 independently reviewed** (hit-feel part 3, `d4b52cf`) by a run that wrote none of it:
  **0 findings**. Clean build, review-checks 9/9 (0 warnings), 17 verify, 42/42 tests, lint clean; headless phone play in both
  motion modes: Chess (Scholar's Mate + a check game) gave one cue per move incl. capture, check and mate; Dominion gave
  place / battle / land taken / land lost / campaign end; **0 shaken frames under reduced motion**, 0 script errors; Chess
  stops redrawing once a hit fades. 6/7 GitHub checks green, Lighthouse still running at 06:15 (reply
  `2026-10-19-pr72-independent-review.md`). Items per run (Item 32): 1 item.
- 2026-10-19 ~05:42–06:05: **Hit-feel, part 3** (Item 31 #5) on `loop/hit-feel-3` @ `d4b52cf`, **PR #72** (stacked on #71):
  Chess (move knock, capture knock-and-ring scaled by the god taken, check warning, checkmate chime) and Dominion
  (army placed, battle dice, land taken, land lost, campaign end); six new impacts in `feel.js`. Clean build,
  review-checks 9/9 (0 warnings), 17 verify, 42/42 tests, lint clean; headless phone play in both motion modes: every
  new impact fired, **0 shaken frames under reduced motion**, 0 script errors (reply `2026-10-19-hit-feel-part-3.md`).
  Same run: **PR #71 Lighthouse finished green** (05:32): #71 now 7/7 green, waits on #70 then Carter's yes.
  Items per run (Item 32): 1 item.
- 2026-10-19 05:16–05:25: **PR #71 independently reviewed** (hit-feel part 2, `6c4efbc`) by a run that wrote none of it:
  **0 findings**. Clean build, review-checks 9/9 (0 warnings), 17 verify, 42/42 tests; headless phone play of all three
  games in both motion modes, 0 script errors, **0 shaken frames under reduced motion**; Ziggurat's new redraw rule draws
  while a hit shows and then stops; the iPhone sound fix reproduced independently (0 → 1). 6/7 GitHub checks green,
  Lighthouse still running at 05:23 (reply `2026-10-19-pr71-independent-review.md`). Same run: **PR #70 Lighthouse
  finished green** (05:16): #70 now 7/7 green and listed **mergeable now**. Items per run (Item 32): 1 item.
- 2026-10-19 ~05:30: **Hit-feel, part 2** (Item 31 #5) on `loop/hit-feel-2` @ `6c4efbc`, **PR #71** (stacked on #70):
  Ouroboros, Labyrinth, Ziggurat get swallow / offering / lamp / shade-caught / landing / course / lose impacts; the #70
  review's audio note fixed (audio resumes on every tap; reproduced 0 → fixed 1). Clean build, review-checks 9/9
  (0 warnings), 17 verify, 42/42 tests, lint clean; headless phone play in both motion modes, 0 script errors, 0 shaken
  frames under reduced motion (reply `2026-10-19-hit-feel-part-2.md`). Same run: **#70 Lighthouse still running** at
  05:25 UTC (started 04:55), not waited on. Items per run (Item 32): 1 item.
- 2026-10-19 ~05:15: **PR #70 independently reviewed** (hit-feel part 1, `ea70b77`) by a run that wrote none of it:
  0 blocking findings, 1 optional note (iPhone sound stays off after re-enabling it mid-visit; fix can ride part 2).
  Clean build, review-checks 9/9 (0 warnings), 17 verify, 42/42 tests; headless phone play of both games in both motion
  modes, 0 script errors, 0 shaken frames under reduced motion. 6/7 GitHub checks green, Lighthouse still running, so not
  yet "mergeable now" (reply `2026-10-19-pr70-independent-review.md`). Items per run (Item 32): 1 item. Note: this run's
  lock commit `19d006b` carries a model name in its trailer; history not rewritten.
- 2026-10-19 ~05:10: **Hit-feel, part 1** (Item 31 #5) on `loop/hit-feel` @ `ea70b77`, **PR #70**: shared kit
  `docs/assets/games/feel.js` (freeze on impact, shake, soft flash, synthesized sound, phone buzz) on The Firmament and
  Antithesis; reduced motion respected (no shake/swell/recoil). Clean build, review-checks 9/9 (0 warnings), 17 verify,
  42/42 tests, lint clean; headless phone check in both motion modes, 0 shake under reduced motion, no script errors
  (reply `2026-10-19-hit-feel-part-1.md`). Items per run (Item 32): 1 whole item, one work commit with the lock folded in.
- 2026-10-19 ~04:00: **PR #69 independently reviewed** (Graphify names) by a run that wrote none of it: 0 findings; clean
  build, review-checks 9/9 (0 warnings), 17 verify, 42/42 tests; namer run on the real map names all 184 groups and is
  repeatable; 6/6 GitHub checks green. Listed **mergeable now**, waiting on Carter's yes (reply
  `2026-10-19-pr69-independent-review.md`). Same run: standards board statuses brought current (Item 29 rest) and five
  of Muse's new previews, pushed as base64 text, decoded so they open. Items per run (Item 32): 2 items, one work commit
  plus the lock.
- 2026-10-18 ~23:05: **Graphify map** (Carter nudge 18:35): the map already existed on the `graph` branch (built when #65
  merged; all three outputs) but every group was "Community N". Added plain-word names (`tools/graphify-label.js`, wired
  into the workflow) as **PR #69**; named snapshot to open now in `handoff/previews/graphify-map/` (link in reply
  `2026-10-18-graphify-map-named.md`). All local checks green; drawing itself not testable here (library host blocked).
  Items per run (Item 32): 1 whole item this run, in one work push with the lock folded in.
- 2026-10-18 22:07: **PR #65 (Item 29) merged by Carter** (`77f6444`), deploy run 194 green. CURRENT and MERGEABLE updated.
- 2026-10-18 ~21:55: **PR #65 (Item 29) independently reviewed**: 0 findings; same files as the approved `cfb1204`; clean
  build, review-checks 9/9 (0 warnings), 17 verify, 42/42 tests, board page headless at phone size clean; 7/7 GitHub
  checks green (Lighthouse not triggered by design). **Merge refused** by this session's safety check on the push to
  `main`; not retried another way. `main` unchanged. Carter can press Merge on PR #65 (reply
  `2026-10-18-item-29-independent-review-and-merge.md`).
- 2026-10-18 ~17:00: **Batch B merged** (PR #63, fast-forward to `c205f4c`, deploy run 193 green). Independent review
  of the updated head by a run that made neither the site changes nor the update: site diff identical to the reviewed
  `aeda5d4`; build reproduces byte for byte; review-checks 9/9 (1 known warning: Pantheon `ra` not pending, for Carter's
  re-clear); 17 verify; 42/42 tests; headless phone check clean; every GitHub check green incl. Lighthouse
  (reply `2026-10-18-batch-b-update-review-and-merge.md`). Found #62 already merged 12:35 UTC, deploy green.
- 2026-10-18 ~17:00: **Item 29 on its own branch**: `loop/graphify-board` @ `b0896a6`, PR #65 (supersedes #61, which can
  no longer fast-forward). Same files as `cfb1204`, local checks green.
- 2026-10-18 ~17:00: **Auditor and verifier health check** (Carter's order + nudge): loop independent review is running on
  every item; the scheduled reviewer and auditor fire but have saved nothing since 2026-10-12; PR #58 heartbeat not
  merged (reply `2026-10-18-auditor-verifier-health.md`).
- Note: two commits carry a model name in their trailer (`15ef746` lock on `staging/ready-line`; `c205f4c` on `main`, from
  the earlier run). History is not rewritten; later runs leave trailers out.
- 2026-10-18: **Bagh-chal board fixed** (preview, `handoff/` only): diagonals only through alternating points (the
  alquerque-pattern board), move rules follow the lines, "standard board" claim and rules text corrected, sources
  opened (Exeter Abstract Games, RulesPal). **Museum `?fps=1` overlay found already live** since 2026-10-06; checked
  at phone size, works. All checks green (reply `2026-10-18-bagh-chal-board-and-fps-overlay.md`).
- 2026-10-18: **Carter's go on both items; PRs opened**: #62 museum phone speed (`0585c80`) and #63 batch B
  (`aeda5d4`). All checks green except Lighthouse, still running on both. Local checks green on both; headless
  phone check clean (reply `2026-10-18-prs-62-63-opened.md`). Nothing merged yet.
- 2026-10-18: **Museum phone speed, independent review** (`0585c80`) by a run that wrote none of it: 0 open
  findings; full build, review-checks (9/9), 17 verify scripts, 42/42 tests green; headless phone draws at 1.0, desktop
  at 2, no script errors (reply `2026-10-18-museum-phone-speed-independent-review.md`). MERGEABLE and board updated.
- 2026-10-18: **Museum phone speed** built on `loop/museum-phone-dpr` @ `0585c80`: phones draw at pixel ratio 1.0
  (was 1.5). Measured: hall 3.2 → 6.1 fps (software graphics, relative only); corridor and Egypt room unchanged in
  software graphics (shape-bound there; a real-phone gain is inferred, not measured). All local checks green;
  screenshots in `handoff/previews/museum-dpr/` (reply `2026-10-18-museum-phone-pixel-ratio.md`). Board updated.
- 2026-10-18: **Independent review of batch B** (`aeda5d4`) by a run that wrote none of it: 0 open findings, all
  local checks green, sources re-opened (reply `2026-10-18-batch-b-independent-review.md`). Listed in MERGEABLE as
  waiting to qualify: it needs a pull request so GitHub's PR checks (Lighthouse included) run, then Carter's yes.
  Found: small defects part 2 is all `handoff/` drafts and previews, not live, so it is not part of batch B.
- 2026-10-18: **Ra-Horakhty correction** (Item 30) on batch B: the Pantheon's falcon-headed sun god is now named
  Ra-Horakhty, sourced (Emory Carlos Museum), all checks green (reply `2026-10-18-ra-horakhty-correction.md`).
  Evening batch (Item 31) folded below. Standards board updated.
- 2026-10-18: batch B brought up to `main`; Items 26–29 folded; Item 29 Graphify fix + standards board, first version.
- 2026-10-17: PR #59 (batch A) merged and deployed; small defects part 1; Tomb Robber → The Unfinished Journal;
  mergeable list; audit + fold; Protection charter drafted; over-claims fixed; trademark ids removed.

## In progress
- (none)

## For Muse (read this first)
- **Armory batch 1 welcome** (10 pieces, real files under `handoff/armory/batch-01/<piece>/`, per
  `decisions-2026-10-25-armory-intake-and-relic-links.md` 2). Not yet received.
- **Journal hero images received** (2026-10-25, `handoff/journal-hero-b64/`, as base64 text). Thank you; nothing more
  needed unless the rebuild finds a problem with them.

## Next (First Order sequence, then value per `decisions-2026-10-17-priority-by-value.md`)
0. Weekly loop audit done 2026-10-25 (`reviews/2026-10-25-audit.md`); next due on/after Wed 2026-10-28.
1. ~~#76, #75, #78, #79, #80, #82, #68, #81~~ **all merged by Carter 2026-10-25 ~12:00** (`caedabc`, deploy 209 green);
   ~~#64~~ merged 12:30 (`91c40fe`, deploy 210 green).
1a. ~~**PR #84 independent review**~~ **done 2026-10-25 ~13:00: 0 open findings** (`2026-10-25-pr84-independent-review.md`;
   failure reproduced on `main`, fixed on `main` + `88f2aa8`, 5/5 GitHub green). Waits only on Carter's yes + Merge button.
   Value 1 by effect: while `main`'s framework tests are red, every PR brought up to `main` inherits 2 failures.
1b. **PR #77 (Journal hero, approved; value 1): brought up 2026-10-25 ~13:05** to `8204268` (merge of `main` `91c40fe`,
   then merge of #84's already-reviewed recount `88f2aa8`, so its framework tests are green; both merges clean, no
   conflicts). Local: full build order produced no changes, 17/17 verify, 42/42 tests, review-checks 9/9 (0 warnings),
   headless phone both motion modes: art loads, run/jump work, 0 script errors. **Waiting on:** every GitHub check on
   `8204268` incl. Lighthouse (next run confirms, no lock held). Then Carter's Merge button. Stack order: #84 then #77
   (if #77 goes first, #84 becomes a no-op).
1c. **PR #83 independent review** (a run that wrote none of it), then bring up to `main`; then Carter's yes. **Next run picks this up** (and confirms #77's GitHub checks).
4b. ~~**Name the live site in docs**~~ **done 2026-10-25 06:55 (handoff only; `main` already correct).** (Carter, `decisions-2026-10-25-domain-and-kadesh.md` 1, small): docs that say the
   site is "not public" or "deploys only to the-divine-archives.pages.dev" should name www.getconexto.com as the live
   site (pages.dev the deploy target behind it). Dated historical records keep their wording. Never touch DNS, the
   domain or Cloudflare. Any wording change under `docs/` goes through a PR.
4c. **Live relic links** (Carter's yes to build, `decisions-2026-10-25-armory-intake-and-relic-links.md` 1): up to three
   outside links per relic (3D scan, the museum's own page/viewer, a live camera only where one really exists); free,
   link/official embed only, nothing loads until tapped, each link opened and logged, none for withheld objects (V68).
   Own `loop/*` branch, full checks, independent review; **going live needs Carter's yes for that PR**.
4d. **Armory intake** (same file 2): after #76 → #75 → #77, Armory (~100) then Pantheon (~200) then Pilgrimage (100+), in
   batches of 10 from Muse under `handoff/armory/batch-NN/`; **the batch of 10 is the unit** (§4): as many pieces per run as the
   quality bar allows, each checked on its own, then one yes/no batch to Carter; waits on batch 1.
   **One loop only** (same file 3): no second loop or lane.
5. **Arcade playability floor** (value 3). Reduced motion is otherwise covered: the hit-feel PRs handle seven games,
   #74 the other two, and every page stayed still in the audit.
6. **Relics 2–4** (Crown of the Kandake, Etruscan mirror, Crown of Thorns) under the Rework Standard's five gates
   (`rework-standard-order.md`: floor in hand, side-by-side proof, no-backwards checklist, auditor signs, Carter merges).
7. **Muse's 2026-10-18 previews** one per run (sensitivity review for Fire Temple, Langar, Awithlaknannai).
8. **Göbekli Tepe preview (PR #53):** change "the oldest known megaliths" (site.js line 123) to wording its sources support (audit 2026-10-25); rides #53, preview only. **PR #43** has no review of its own (audit coverage gap): review it.
8a. **Independent review of #66** (#64, #67, #68 merged) so it can reach MERGEABLE (#66 is new content: Carter's yes too).
9. **900 Theses** — hold LIFTED (Council 14b): spec-body patch to Carter's rulings, Gate A text extraction, licensing review.
10. Fix package; small defects part 2 (Journal Sound/✕ now PR #78; Journal 320 clipping + full-screen name now PR #79; ~~Journal Select/Start tap size; Journal tip naming keys on touch~~ now PR #83); ~~ch02 "second death"~~ now PR #82; Spirit Board rename; Errata page (prepare only); Debate Hall preview safety;
    standards board current with each item.
- **Council constitution 2026-10-20 is build law** for every room, game and video from now on (games live in rooms,
  played in the arcade; witness moment per room, never a game; Rotunda = rotating showcase + 12-statue circle;
  philosophers never in religious rooms; Perform/Witness/Learn with Withheld Lists, watch-only default; no scores or
  streaks on practices; no new room without a full chapter; directory scorecard + "Not Yet Housed" register).
  What reaches Carter: finished pieces, yes/no only.
- Scheduled: on or after **2027-01-15**, remove the old-id table on a side branch.

## Parked / on hold (do not build)
- Protection charter D1–D3. Email list. Pythia Pantheon entry. VR, multilingual, Divine Casualties rebuild, ballgame,
  music (Council 7a). Room eggs (Council 3). Early China pilot (Yes/No addendum: parked until the training approach is
  set). Background sound in videos: closed (Council 7b). ~~900 Theses~~ (lifted 2026-10-20).

## Needs Carter
- **PR #84 (registry recount): yes / no?** Reviewed 2026-10-25 by a run that wrote none of it: 0 findings, all checks
  green. It fixes 2 internal tests that have been failing on `main` since the eight merges; nothing on the site changes.
  If yes, press Merge on PR #84 (the loop's pushes to `main` are refused by the session safety system).
- **#77** (Journal hero, already approved): brought up to the live code 2026-10-25 ~13:05; once its online checks finish green it needs your Merge button (best after #84).
Answered 2026-10-24 and 2026-10-25 decisions files, all folded into Next.
