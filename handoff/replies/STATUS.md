# Build-side STATUS — running (overwritten at every checkpoint)

**As of:** 2026-11-01 ~13:15 UTC (**PR #98 built: audit Fix 6**. The homepage games blurb now says some source chapters are still pending review. The games draw on 8 pending chapters. Head `f1c3c2a`, local checks green, `2026-11-01-pr98-fix6-games-wording.md`. Needs an independent review by another run plus GitHub green, then it merges by class (b)+(c)). Earlier ~12:55 UTC (**PR #96 delta independently reviewed: PASS, 0 findings** (`2026-11-01-pr96-delta-review.md`, filed `review-log` `04a0ae4`); 9/9 GitHub green on `c5ecb5a` incl. Lighthouse; local checks re-run green. #96 now waits **only on Carter**: the museum-card answer and his per-item yes. **New Carter order folded:** the Keeper build (`order-2026-11-01-keeper-bench-v2.md`) is Next 4b; its bench v2 file and bundle 18 are not in the repo, so Muse/atlas stages them first). Earlier ~12:05 UTC (**PR #96 builder fix**: Great Pyramid alt now says "A rendering, not a photograph" and the branch is re-synced to `main` `6d51ab9`; head `c5ecb5a`, all local checks green; needs GitHub green + an independent delta review + Carter's museum-card answer and per-item yes; `2026-11-01-pr96-pyramid-alt-fix.md`; chain attempt refused again by the session permission guard, so the next run is the hourly one at 12:41 UTC). Earlier ~11:50 UTC (**PR #97 merged**: `main` `ff08cc1` → `6d51ab9` by fast-forward, class (c) typo fix; local checks re-run green, 9/9 GitHub green, deploy 224 green; `2026-11-01-pr97-merged.md`). Earlier ~10:55 UTC (**PR #97 independently reviewed: PASS, 0 findings** (`2026-11-01-pr97-independent-review.md`, filed `review-log` `e135f47`); local checks re-run green on `6d51ab9`, 9/9 GitHub green; all merge conditions met by class (c). **The fast-forward to `main` was refused by this session's permission guard**, so `main` stays `ff08cc1`; #97 is in MERGEABLE → Mergeable now. Next run retries the merge; if the guard refuses again it goes to Carter. Note: this run's lock commit `c87ce24` carried a model name in its co-author line by mistake (not rewritten; later commits fixed). Earlier ~09:57 UTC (Chain attempt refused again by the session permission guard ("run routine now"), so the next run is the hourly one at 10:41 UTC. **Line-wrap typos: PR #97 built** (ch08 "day- laborer", all local checks green, headless clean; needs independent review + GitHub green, then merge by class (c)). The other four typos sit in **cleared** chapters (7, 15, 16, 45); the pending-diff check rightly refuses a body change there without Carter's re-clear, so that fix is held on `loop/line-wrap-typos-cleared` `adfbdc9` for his answer. Reply `2026-11-01-line-wrap-typos-pr97.md`). Earlier ~09:05 UTC (Chain attempt refused again by the session permission guard ("run routine now"), so the next run is the hourly one at 09:41 UTC. **Independent review of PR #96: NOT mergeable** — 1 NEEDS CARTER (the museum share card's generated map has garbled and wrong lettering: two "Wing II"s, "Path aya beine Ages", wing names that are not the site's eras) and 1 fixable (Great Pyramid alt reads as a photo; the image is a video frame) returned to a builder run. Local checks green (build 0 changes, 18/18, 42/42, review-checks 9/9), headless phone 12/12 clean, GitHub 9/9 green; branch 3 behind `main`, merges clean. Filed on `review-log` `12e8bfb`; reply `2026-11-01-pr96-independent-review.md`). Earlier ~07:50 UTC (**PR #93 merged 07:43 UTC**: fast-forward `main` `510885d` → `ff08cc1` (era pages label the themes block "across all eras"); local checks + headless re-run green on `ff08cc1`, 7/7 GitHub checks green, deploy run 223 green; reply `2026-11-01-pr93-merged.md`. Next: independent review of PR #96. Chain attempt refused again by the session permission guard ("run routine now"), so the next run is the hourly one at 08:41 UTC). Earlier ~07:12 UTC (**#93 is fully mergeable**: 7/7 GitHub checks green on `ff08cc1` incl. Lighthouse (07:03); **the fast-forward push to `main` was refused by the session's permission guard ("Production Deploy")**, so it is not live. Carter can press Merge on PR #93, or the next run retries. **#96: 9/9 GitHub checks green** incl. Lighthouse (07:09); still needs its independent review). Earlier ~07:05 UTC (**stale 03:42 lock cleared** (session-cap stop). **`main` is now `510885d`** (#94 Newgrange, merged by its own thread). **#93 re-synced to `ff08cc1`** (site diff byte-identical, local checks green), Lighthouse running; merges next run when green. **Share images built: PR #96** (`loop/share-images-six` `842b51e`), needs independent review + checks + Carter's yes. **#95** (games full screen) is another session's; its Lighthouse is red; loop leaves it to its owner. Reply `2026-11-01-share-images-pr96-and-pr93-resync.md`. Chain attempt refused again by the session's permission guard ("run routine now"), so the next run is the hourly one at 07:41 UTC). Earlier ~03:05 UTC (**Carter answered live: b / a / a** (`decisions-2026-11-01-carter-b-a-a.md`): merge yes-by-class adopted (LOOP.md Merging 0 + the scheduled task's limits updated), #93 yes, graph wording fixed. **#93 independently reviewed: PASS, 0 findings**, synced to `main` as `e7149ed`; waits only on Lighthouse, then fast-forward). Earlier ~02:50 UTC (**PR #92 merged**: `main` `eb842de` → `f923754` (ch19 audit Fixes 2+3), 10/10 checks green incl. Lighthouse, local checks re-run green, deploy run 221 green; `2026-11-01-pr92-merged.md`. Graph refresh proven: `graphify update .` works (LOOP.md's `--update` spelling does not). Read `nudge-2026-10-31-keep-moving.md` + pulse. Chain attempt refused by the session's permission guard ("run routine now"), so the next run is the hourly one at 03:41 UTC). Earlier ~02:15 UTC (**Fix 5 built as PR #93** (era pages: themes labelled as across all eras), local checks green, needs independent review + checks + Carter's yes; **Carter said "a" = yes to merge #92** once Lighthouse is green (`decisions-2026-11-01-merge-92.md`); Lighthouse on `f923754` still pending; `2026-11-01-fix5-era-themes-pr93.md`). Earlier ~02:10 UTC (**independent review of the #92 fix delta: PASS, 0 findings** — Jewish Encyclopedia opened and it carries the clause; local checks green (build 0 changes, 17/17, 42/42, review-checks 9/9), headless phone clean; GitHub 9/9 reported green, Lighthouse not yet reported; filed on `review-log` `cec22a1`; `2026-11-01-pr92-delta-review.md`. **#92 now needs only Lighthouse green + Carter's yes**). Earlier ~02:00 UTC (**#92 review finding fixed**: Jewish Encyclopedia cited for the name "Karaite"; head now `f923754`; local checks green; needs an independent review of the delta by a run that wrote neither the fix nor the first review; `2026-11-01-pr92-review-fix.md`). Earlier (**independent review of PR #92: 1 open finding**, a sourcing gap: the clause "the name 'Karaite' is not attested before the ninth century" (honesty section, and already in the body) is not carried by its cited sources; true per Jewish Encyclopedia 1906; reviewer may not add sources, so it goes back to a builder run. Local checks green (build 0 changes, 17/17, 42/42, review-checks 9/9), headless phone clean, GitHub 9/10 green with Lighthouse running. Filed on `review-log` `5cd937b`; `2026-11-01-pr92-independent-review.md`). Earlier ~01:48 UTC (**PR #92 built**: ch19 audit Fixes 2+3, honesty section now covers the Seder and Karaite sections + typo; local checks green; needs independent review, GitHub checks, Carter's yes; `2026-11-01-pr92-ch19-fixes-2-3.md`). Earlier ~01:35 UTC (**PR #91 merged**, batch-2 Pilgrimage open-flip: Persepolis, Angkor Wat, Borobudur now Open; `main` `0959caf` → `eb842de`, deploy 220 green; Carter's yes 01:21 UTC; 9/9 checks green; live read left to atlas, sandbox cannot reach the site; lock released; `2026-11-01-pr91-merged.md`. Loop priorities item 1 done, next is item 2). Earlier 2026-10-31 22:47 UTC (**PR #90 merged** on Carter's "merge whatever is finished": `main` `dd35228` → `0959caf`, deploy 219 green; `2026-10-31-pr90-merged.md`). Earlier ~23:00 UTC (build loop, fresh run: **independent review of PR #90: 0 findings**, all numbers checked against the repo; local checks green; GitHub 4/4 green; filed on `review-log` `9548d6d`. **#90 is mergeable on Carter's yes.** Reply `2026-10-31-pr90-independent-review.md`). Earlier ~22:45 UTC (build loop: **PR #90 built**: README refresh, audit Fix 1 + Fix 8. Real pending set (18), Vault 87, Pilgrimage 7 open (not the audit's 3; #87/#88 opened more), share-image sentence corrected, default branch confirmed still the old session branch. Local checks green. Waiting on an independent review and Carter's yes. Reply `2026-10-31-pr90-readme-refresh.md`). Earlier ~22:30 UTC (build loop: **weekly audit done** — 10 of 10 blind re-reviews agree with the reviewer, rolling 97%, auto-pass stays on; auditor-proof report written for the armory gate; `reviews/2026-10-31-audit.md` on `review-log` `6456fbf`; reply `2026-10-31-weekly-audit.md`). Earlier ~21:58 UTC (**PR #89 merged** by fast-forward `aad7174` → `dd35228` at 21:56 after 9/9 checks green; deploy 218 green; **#88 and #89 both live**; `2026-10-31-pr89-merged.md`). Earlier ~21:55 UTC (build loop: **PR #88 is live** — `main` = its approved head `aad7174`, deploy 217 green; **PR #89 `dd35228`** (stacking merge, adds only #88's reviewed diff; diff vs main byte-identical to the reviewed one) local checks green on a clean copy, 8/9 GitHub green, **waiting on Lighthouse only**; lock released while waiting). Earlier ~21:36 UTC (**Carter said yes to #88 and #89; the merge push was refused by the session's permission guard, so neither is live yet**; `decisions-2026-10-31-merge-88-89.md`). Earlier ~21:10 UTC (**main moved to `fcec69f` with #87; PR #88 synced to `aad7174`, #89 to `6624c5c`, local checks green, GitHub checks re-running; Carter's yes must name the new heads**). Earlier ~21:00 UTC (build loop, fresh session: **independent review of PR #88 and #89, 0 findings each**;
#88 9/9 GitHub green, mergeable on Carter's yes; #89 waits on Lighthouse + Carter's yes; `2026-10-31-pr88-pr89-independent-review.md`).
Earlier ~20:24 UTC: PR #89 built; ~20:20 UTC: PR #88 built. **Answers:** everything listed in the 2026-10-26 STATUS, plus every file
committed since: `pilgrimage-open-four-2026-10-26.md` (+ correction), `decisions-2026-10-26-auditor-proof-gate.md`,
`decisions-2026-10-26-absence-page-sources.md`, `decisions-2026-10-26-takeover-batch.md`, `perfection-standard-2026-10-26.md`,
`decisions-2026-10-26-stream-engine.md`, `decisions-2026-10-26-operating-split.md`, and `prep-2026-10-28/` (PREP-INDEX,
11 specs, `previews/bagh-chal/bagh-chal-v2.html`). All folded into Next below.
**Deployed (`main`):** `68b7b03` (PR #53, 2026-10-26 03:07 UTC, deploy 215 green), unchanged since; www.getconexto.com and
the-divine-archives.pages.dev. Earlier merges: see Done and `MERGEABLE.md`.
**Open PRs:** #88 (reviewed, mergeable on your yes) and #89 (reviewed, Lighthouse running) (loop, 2026-10-31), #87 Pilgrimage batch 2 (owned by another thread, which is merging it: loop leaves it alone), #66 Newgrange (needs review +
Carter), #60 (to close per takeover batch 3). **Loop:** RUNNING. **Standing law since 2026-10-26:** the Perfection
Standard (`perfection-standard-2026-10-26.md`): every piece climbs all five rungs; "done" = every rung + Carter's yes.
## Done
- 2026-11-01 07:43 UTC: **PR #93 merged** (audit Fix 5, era-page themes label), `510885d` → `ff08cc1`, deploy 223 green (`2026-11-01-pr93-merged.md`).
- 2026-11-01 ~02:44: **PR #92 merged** by fast-forward `eb842de` → `f923754` (Carter's yes `decisions-2026-11-01-merge-92.md`; 10/10 GitHub checks green; clean-worktree build 0 changes, 17/17, 42/42, review-checks 9/9; headless phone 360/390 clean). Reply `2026-11-01-pr92-merged.md`.
- 2026-11-01 ~02:00: **PR #92 finding 1 fixed** (`f923754`): Jewish Encyclopedia (1906) cited for the name "Karaite" in ch19 Sources + source log; build, 17/17, 42/42, review-checks 9/9, headless clean. Reply `2026-11-01-pr92-review-fix.md`.
- 2026-11-01 ~02:10: **Independent review of PR #92** (`fc0ad1a`) by a run that wrote none of it: 1 open finding (sourcing gap on the "name 'Karaite' not attested before the ninth century" clause; fix: cite Jewish Encyclopedia, "Karaites and Karaism", in honesty item + body + source log). All other claims checked against their fetched sources: pass. Filed on `review-log` `5cd937b`. Reply `2026-11-01-pr92-independent-review.md`.
- 2026-10-31 22:46: **PR #90 merged** (fast-forward to `0959caf`, deploy 219 green) on Carter's yes.
- 2026-10-31 ~23:00: independent review of PR #90 (README refresh): 0 findings; filed on `review-log` `9548d6d`. Armory gate
  answered "a" by Carter (`decisions-2026-10-31-armory-gate-accept.md`), so it left Needs Carter.
- 2026-10-31 ~22:00–22:25: **Weekly loop audit** (Next 2) by a run that wrote none of the sampled items: 13 reviewer
  reports since 2026-10-25, sample of 10 (pr68, pr79, pr80, pr81, pr82, pr83, pr84, pr86, pr53 delta, pr88), verdicts
  committed blind (`9e6acda`) before reading the reviewer: **10/10 agreed**. Visual fixes measured before/after against
  each parent; content sources re-opened. Rolling accuracy 31/32 (97%), auto-pass stays on. Coverage gaps: #87's six
  reviews not filed on `review-log`; #64 (review tooling, Carter's merge) unreviewed. **Auditor-proof report** included
  (armory gate): blind re-review proven; the only planted test is review-test/2026-10 (9/9), not repeated, and the loop
  cannot run one. Filed on `review-log` `6456fbf`. Also this run: re-checked #89 `dd35228` locally (build 0 changes,
  17/17 verify, 42/42 tests, review-checks 9/9, headless phone clean) while its Lighthouse ran; the building session
  merged it at 21:56. Reply `2026-10-31-weekly-audit.md`. Items per run: 1.
- 2026-10-31 ~20:45–21:00: **Independent review of PR #88 and #89** by a session that wrote neither: 0 findings each.
  Clean copies: build 0 changes, 17/17 verify, 42/42 tests, review-checks 9/9 (0 warnings), on both. Own headless phone
  script: #88 all 7 Enter links open the right site, each loads with pending tag and canvas, museum reads 7 live sites
  via `?v=2`, 0 errors; #89 0 images, no Wikipedia, 5 sources + footer, 0 errors. All 5 Tjurunga source sites checked:
  no sale links (CLC essay recounts the 1992 auction as history; noted for Carter). GitHub #88 9/9 green incl.
  Lighthouse; #89 7/8, Lighthouse running. Filed on `review-log` `f3924f2`. Reply `2026-10-31-pr88-pr89-independent-review.md`.
- 2026-10-31 ~20:22: **Tjurunga absence page, PR #89** (`loop/tjurunga-official-sources` `08d4f51`): Wikipedia link
  replaced by AIATSIS "Arrernte returns" (opened); checks green; headless phone green. Reply `2026-10-31-pr89-tjurunga-official-sources.md`.
- 2026-10-31 ~20:18: **Pilgrimage open-flip, PR #88** (`loop/pilgrimage-open-four` `9fbc2ec`): four sites
  `preview` → `live`, museum data cache key bumped; full build, 17/17 verify, 42/42 tests, review-checks 9/9, headless
  phone clicks through all 7 open sites. Reply `2026-10-31-pr88-pilgrimage-open-four.md`.
- 2026-10-26 ~03:07: **PR #53 merged** (fast-forward to `68b7b03`, Carter's live yes; deploy 215 green).
- 2026-10-26 ~02:40–03:10: **PR #53 not merged** (head moved to `67aabf1` after Carter's go for `aa7081d`); independent
  review of `cafa1af..67aabf1` PASS, 0 findings; checks 9/9 green; local + 30 headless opens green. Reply
  `2026-10-26-pr53-review-67aabf1.md`. Queue folded: audit fixes (1g), share images (1h), armory batch 1 received (4d).
- 2026-10-25 ~22:42–23:20: **PR #53 fix run part 4 — Chichén Itzá** (`e8ce493`): every fixable finding; review point 4
  (decline date) settled by giving both views (Britannica c. 1200 / UNESCO c. 1440). Toltec card now gives every reading
  and says the question is open; bench card Contested with the Met's "unclear"; Venus/equinox credit fixed; de Anda on
  victims killed first; ball-court, skull-rack, Caracol, Dresden, blurb and Historia Mexicana lines fixed. Build only
  registry changed, 17/17 verify, 42/42 tests, review-checks 9/9 (0 warnings), headless phone 360/390 clean.
  Reply `2026-10-25-pr53-chichen-fixes.md`. Items per run: 1.
- 2026-10-25 ~21:42–21:52: **PR #53 fix run part 3 — Delphi** (`6f314d4`): every fixable finding (hymn panel now the
  edited opening of the first hymn, undying fire → Plutarch *Numa* 9, temple dates/funding from the Ministry, Athenian
  Treasury 1906 rebuild, Sphinx height, end of the oracle, Greek Questions 9, vapours from the 2006 abstract, log).
  Build only registry changed, 17/17 verify, 42/42 tests, review-checks 9/9 (0 warnings), headless phone 360/390 clean.
  Reply `2026-10-25-pr53-delphi-fixes.md`. Items per run: 1.
- 2026-10-25 ~18:58–19:10: **PR #53 fix run part 2 — Göbekli Tepe** (`2dd1158`): every fixable finding; review points
  2 (missing "So fair a House" source: found) and 3 (C/D sizes: figures removed, *CWA* "D is the largest") settled by
  sources. Build 0 changes besides registry, 17/17 verify, 42/42 tests, review-checks 9/9 (0 warnings), headless phone
  360/390 clean. Reply `2026-10-25-pr53-gobekli-fixes.md`. Items per run: 1.
- 2026-10-25 19:30: PR #53 fix run part 1 — Mogao Caves review fixes (`8aab255`).
- 2026-10-25 ~17:48–18:25: **PR #53 independently reviewed at `befb607`: NOT passed** (Next 1e) by a run that wrote none
  of it. Automatic checks green on a clean copy (build 0 changes, review-checks 9/9 0 warnings, 17/17 verify, 42/42 tests,
  headless phone 4 pages × 360/390: 0 errors, no sideways scroll, pending tag shown). Claim check with sources opened,
  ~75 claims: no fake source shown, tone and belief/evidence separation good, but **about 30 fixable findings** (unsourced
  or mis-cited lines, a misspelled real Delphic Hymn panel labelled as not-the-hymn, Mogao "four tiers" vs UNESCO five,
  Chichén sacrifice and serpent cards resolving debates) and **3 source points for Carter** if the fix run cannot settle
  them. The Göbekli wording fix itself checks out. #86: Lighthouse run 194 started ~17:48, not waited on. Filed on
  `review-log` (`f7d0b09`). Reply `2026-10-25-pr53-independent-review.md`. Items per run: 1.
- 2026-10-25 ~17:10–17:40: **PR #83 merged** (Next 1c): Lighthouse on `45d4a95` green 17:18 (6/6); every Merging
  condition held; local checks re-run green; `main` fast-forwarded `3762691` → `45d4a95` 17:32; deploy 213 green.
  **PR #86 independently reviewed, 0 open findings** (Next 1d; own headless script: 12 games × 4 phone sizes × 2
  motion, Close/Full-screen short tap areas 96 → 0, short buttons 126 → 0, 0 errors) and brought up to `45d4a95` →
  `3785b2b` (no conflict, reviewed diff unchanged, local checks green). Review filed on `review-log` (`a717687`). Folded
  `decisions-2026-10-25-cleanup.md`. Reply `2026-10-25-pr83-merged-pr86-reviewed.md`.
- 2026-10-25 ~16:57–17:10: **PR #86 built: arcade tap targets, part 1** (Next 5, value 3). #83 checked first: 5/6
  green, Lighthouse running since 16:56, not waited on. On `main`, every game's Close/Full-screen buttons took touches
  over 31–34 px and the shared text buttons were 33–35 px tall (Reliquary menus 37). `games.css` +8 lines, touch only:
  text buttons and menus ≥ 44 px tall; Close/Full-screen keep their look with an invisible 44 px tap layer. 12 games ×
  8 sizes: short Close/Full-screen tap areas 192 → 0; 0 stolen taps, 0 outside the dialog, 0 sideways scroll, 0 errors.
  Build 0 changes, 17/17 verify, 42/42 tests, review-checks 9/9 (0 warnings); trial merge with #83 clean. Part 2 left:
  Excavation cells, Ziggurat keypad. Reply `2026-10-25-pr86-arcade-tap-targets.md`. Items per run: 1.
- 2026-10-25 ~16:52–17:10: **#83 brought up to `main` `3762691`** (after #77) → **`45d4a95`**, merge commit, no conflict.
  Site diff = the reviewed 2-file diff (only the blob-hash line differs). Local: build order 0 changes, 17/17 verify,
  42/42 tests, review-checks 9/9 (0 warnings); headless touch phone 3 sizes × 2 motion modes: game runs, 0 errors, tap
  areas 44 px, touch tip shown, The Archivist still the hero. Not merged: GitHub checks just started (lock released).
  Reply `2026-10-25-pr83-up-to-3762691.md`. Items per run: 1.
- 2026-10-25 ~13:01–13:15: **#77 and #83 brought up to `main` `12e7d65`** after Carter merged #85 (12:57). #77 → `3762691`,
  #83 → `cfc1298`; only the generated registry files conflicted (took `main`'s, rebuilt: 0 changes). Site diffs vs `main`
  byte-for-byte the reviewed ones. Local: build order 0 changes, 17/17 verify, 42/42 tests, review-checks 9/9; headless
  touch phone 3 sizes × 2 motion modes: game runs, 0 errors. **#84 superseded** (`main` tests green, build clean). Reply
  `2026-10-25-pr77-pr83-up-to-12e7d65.md`. Items per run: 1.
- 2026-10-25 ~12:50–13:20: **PR #83 independently reviewed, 0 open findings**, and brought up to `be2ad69` (`main` +
  #84's recount); local checks and headless phone checks green; review filed on `review-log` (`a4637ef`). #77: 7/8 GitHub
  checks green on `8204268`, Lighthouse still running at 12:52.
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
- **PR #98** audit Fix 6, `loop/games-sourcing-wording` `f1c3c2a`: waits on an independent review (by a run that did not write it) + GitHub green; then merge by class (b)+(c).
- (PR #97 merged 2026-11-01 ~11:45 UTC, live `6d51ab9`.)
- **`loop/line-wrap-typos-cleared`** `adfbdc9` (no PR): the four cleared-chapter typo fixes, held for Carter (Needs Carter).
- **PR #96** share images (six pages), `loop/share-images-six` **`c5ecb5a`**: 9/9 GitHub green incl. Lighthouse; delta `842b51e..c5ecb5a` independently reviewed PASS, 0 findings (`2026-11-01-pr96-delta-review.md`). **Waits only on Carter:** the museum card (a: drop it, ship five; b: hold for a new image) and his per-item yes. On (a) a builder run drops the museum card, then that delta is reviewed by a run that did not write it.
- **PR #95** (games full screen, another session's, 2026-11-01 03:42): Lighthouse **failed** 04:28 UTC; owner's to fix; new feature, Carter's per-item yes. Loop does not touch it. `#95` and `#60` both edit `treasure.js`.

## For Muse (read this first)
- **Keeper inputs needed:** please stage `keeper-bench-v2.html`, its five captures and the bundle 18 Archivist design
  under `handoff/keeper/` on `staging/ready-line`; the loop cannot reach the bench folder.
- **Pilgrimage open-flip is PR #88.** Please don't push to `loop/pilgrimage-open-four`; send changes as a follow-up.
- **Graphify wiring:** the files are on your side (`~/workspace/graphify-wiring-push-2026-10-26/`), not in the repo, so
  the loop cannot push them. Stage them under `handoff/graphify-wiring/` on `staging/ready-line` and the loop will land
  them through a `loop/*` PR.
- **Selfie carriers: deleted** 2026-10-31 ~22:45 UTC from `staging/ready-line` (`3dbd974`) on Carter's live go in the
  loop's session (`decisions-2026-10-31-selfie-carriers-and-87.md`); on no branch any more. Git history still holds them; Carter ruled 2026-10-31: no history rewrite (`decisions-2026-10-31-scrub-selfie-history.md`).
- **PR #87** is merged (by its own thread); its review record is now filed on `review-log` (`40371d3`).

## Next (value order, `decisions-2026-10-17-priority-by-value.md`; Perfection Standard on every piece)
1. ~~Merge #88 and #89~~: **done**, both live (`dd35228`, deploy 218).
2. ~~Weekly loop audit~~: **done 2026-10-31** (`reviews/2026-10-31-audit.md`); next due on or after Wed 2026-11-04.
   Follow-up done: #87's review record filed on `review-log` (`reviews/2026-10-31-loop-pr87.md`, `40371d3`; the six
   full reports are not in the repo, so the merge-gate summary is filed and labelled as such).
3. **Site-audit fixes** (`audit-fixes-2026-10-25.md`): ~~Fix 1 README~~ **built: PR #90** (Fix 8 checked in the same PR;
   **merged 2026-10-31, live `0959caf`**); ~~Fixes 2+3 ch19~~ **PR #92 merged 2026-11-01, live `f923754`**; ~~Fix 5 era label~~ **PR #93 merged 2026-11-01 07:43 UTC, live `ff08cc1`**; ~~Fix 6 games wording~~ **built: PR #98** (`f1c3c2a`); **next run: independently review #98** (a run that did not write it), then merge by class once GitHub is green; next after it: the five line-wrap typos follow-up; 4, 6 at
   judgment; Fix 7 Graphify data refresh; Fix 8 default-branch note. **Plus** the Tjurunga absence page
   (`decisions-2026-10-26-absence-page-sources.md`): replace the Wikipedia source link on `vault/tjurunga.html` with
   official museum/academic sources only, none leading toward sales or auction descriptions (**built: PR #89**). Each its own `loop/*`
   branch (or one small batch PR), full checks, independent review, Carter's per-item yes.
   **Follow-up (small, found 2026-11-01):** five more line-wrap artifacts like ch19's in `content/chapters.js` ("free- standing", "day- laborer", "number- mysticism", "relic- veneration", "ascent-and- initiation"); one typo PR after Fix 5.
4. **Share images for six pages**: PR #96 alt fix + re-sync **done** (`c5ecb5a`); delta review **PASS** 12:55 UTC; 9/9 green. Waits on Carter only (museum card a/b + per-item yes). If Carter answers (a), a builder run drops the museum card, then that delta is reviewed. If `main` moves first, re-sync and re-check.
4b. **The Keeper** (`order-2026-11-01-keeper-bench-v2.md`, Carter's explicit go 2026-11-01): build him in production from
   bundle 18 with bench v2 as the visual start, plus the four production musts (woven goldwork at close zoom, finished
   hands, stronger wake in the ground, heavier mid-distance drape). Parallel lane, does not displace the Casualties
   upgrade; new build, so its merge is per item. **Blocked on inputs:** `keeper-bench-v2.html`, its captures and
   bundle 18 are atlas-side, not in this repo (searched `handoff/` 2026-11-01 12:50: NOT FOUND). Muse/atlas: stage
   them under `handoff/keeper/` on `staging/ready-line` and the loop builds on a `loop/keeper` branch.
3b. **Line-wrap typos**: ch08 ~~PR #97~~ **merged 2026-11-01 ~11:45 UTC, live `6d51ab9`**. Ch07/15/16/45 held on `loop/line-wrap-typos-cleared` for Carter's re-clear answer; on (a) a run appends his re-clear to `reviews/cleared.json` citing his decision, opens the PR, review, merge. Value 5 (live text).
5. **Takeover batch** (`decisions-2026-10-26-takeover-batch.md`): (2) `.gitignore` tripwire for secret-type files, small
   `loop/*` PR; (3) close PR #60 with a one-line note pointing at #77 (closing, not deleting); (6) stale texts: only
   if those job files are in this repo, else say NOT FOUND. (1) selfie-carrier deletion: not the loop's (never deletes).
   (4) Cloudflare Web Analytics: not the loop's (accounts/Cloudflare).
5b. **Homepage at 360 px is 373 px wide** (found 2026-11-01, already on `main`): a button and `li.tl-node` timeline items reach past the edge. Check whether the timeline is a deliberate sideways scroller. Fix only the unintended part (value 3, small).
6. **Arcade tap targets part 2** (value 3, `prep-2026-10-28/tap-targets-part2/SPEC.md`): Ziggurat pad keys, Excavation
   cells; add the Pilgrimage list's 32 px "Enter the site" button (seen 2026-10-31).
7. **Arcade playability floor** (value 3, `prep-2026-10-28/playability-floor/SPEC.md`), in parts.
8. **Small defects part 2** (`prep-2026-10-28/small-defects-part2/SPEC.md`): #53 follow-ups (ch08 omphalos maxims, ch29
   equinox intent, ch42 contested backfill), Debate Hall preview safety, review debts **PR #43** and **PR #66**.
9. **Spirit Board rename** (`prep-2026-10-28/spirit-board-rename/SPEC.md`): `<title>` leftover + preview file rename.
10. **Errata page in the Vault** (`prep-2026-10-28/errata-page/SPEC.md`): new page (not an exhibit); merge needs Carter.
11. **Live relic links** (`prep-2026-10-28/relic-links/SPEC.md` + `REGISTER.md`); going live needs Carter's yes.
12. **Treaty of Kadesh → Egypt room** (`prep-2026-10-28/treaty-kadesh-placement/SPEC.md`): new exhibit, Carter's yes to merge.
13. **Armory batch 1 intake** (`handoff/armory/batch-01/`, proof pack `prep-2026-10-28/batch1-proof-pack/`): rebuild under
    the Rework Standard; **Antikythera v2 and Senet v2 are under truth quarantine: fix first**; merge waits on the
    auditor-proof report (item 2) and Carter's per-round yes. Batch 2 (`armory-batch-2/`) is not sent until batch 1 is worked.
14. **Relics 2–4** (`prep-2026-10-28/relics-2-to-4/SPEC.md`), one per run, five gates.
15. **2026-10-18 previews sweep** (`prep-2026-10-28/previews-sweep/SPEC.md`), one per run, sensitivity three first.
16. ~~PR #87~~: owned by another thread, which is merging it (Carter's note 2026-10-31). The loop leaves it alone.
17. **900 Theses** spec work (hold lifted, Council 14b).
17b. **Divine Casualties live-game upgrade** (`order-2026-10-31-divine-casualties-upgrade.md`, Carter 2026-10-31 23:48 ET): 12 steps in order, each its own PR, look unchanged; queued after share images → takeover batch → armory batch 1. Replaces the parked "Divine Casualties rebuild" only in this in-place form.
18. **Stream-engine paper inputs**: LAST in line (`decisions-2026-10-26-stream-engine.md`), only after 1–5 and armory
    batch 1 clear; one item at a time; preconditions (Phaistos, Aleppo, wing date bands, 83/76 count) first.
- **Council constitution 2026-10-20 is build law** for every room, game and video.
- Scheduled: on or after **2027-01-15**, remove the old-id table on a side branch.

## Parked / on hold (do not build)
- Protection charter D1–D3. Email list. Pythia Pantheon entry. VR, multilingual, Divine Casualties rebuild, ballgame,
  music (Council 7a). Room eggs (Council 3). Early China pilot. Background sound in videos: closed (Council 7b).
- **Gallery docent** (parked 2026-10-26, operating split 4). **Relic builds originate on the Muse side** (operating split 1):
  the loop only takes in finished armory rounds.
- Stream-engine CUT list (`decisions-2026-10-26-stream-engine.md`): never built.

## Needs Carter
- (PR #97 merge: no longer needed, merged by the loop 2026-11-01 ~11:45 UTC.)
- **Typo fixes in four cleared chapters** (new, 2026-11-01 ~09:55): ch07, ch15, ch16, ch45 each have one stray space from line wrapping (e.g. "relic- veneration"). Fixing them changes a cleared chapter, which the site's safety check only allows if you re-clear it. **a)** yes, re-clear those four for this typo-only change (recommended; the diff is five characters); **b)** put them back to "pending review" with the fix; **c)** leave the typos.
- **PR #96 museum share card** (new, 2026-11-01 ~09:00): the picked museum map shows garbled and wrong lettering (two "Wing II"s, "Path aya beine Ages", "Renaissance"/"Enlightenment" wings that are not the site's eras). **a)** ship the other five share images now, museum page stays without one (recommended); **b)** hold all six until atlas sends a clean museum image.
- (Speed Order yes-by-class: answered "b" 2026-11-01 ~02:51 UTC, adopted.)
- (PR #93: answered "a" = yes, 2026-11-01 ~02:51 UTC.)
- (PR #92: answered "a" = yes, 2026-11-01 ~02:10 UTC; merged 02:44 UTC.)
- (Graph wording: answered "a", fixed.)
Answered: every decisions file to date, incl. the 2026-10-26 batch and `prep-2026-10-28/`.
