# Build-side STATUS — running (overwritten at every checkpoint)

**As of:** 2026-10-24 23:50 UTC (build loop). **Answers:** manifest-v2 through Item 32, every `decisions-*.md` /
`correction-*.md` / `order-*.md` / `approval-*.md` to date, plus the unnumbered files committed 2026-10-19 → 2026-10-22:
`merge-approval-2026-10-19.md`, `fix-random-meta-description.md`, `tjurunga-takedown-order-2026-10-20.md`,
`council-rulings-2026-10-20.md` (+ Yes/No addendum), `FIRST-ORDER-claude-briefing.md`, `rework-standard-order.md`,
`site-speed-finding.md`, `journal-hero/README.md`, `sitemap.xml`, and `decisions-2026-10-24-merge-71-72-73.md`. **Deployed (`main`):** `6c81a84` (PR #74, merged
2026-10-24 23:30 UTC, deploy run 199 green), at the-divine-archives.pages.dev and, per Muse, www.getconexto.com (Needs Carter 1).
**Branches:** `loop/hit-feel` = #70 (merged), `loop/hit-feel-2` = #71, `loop/hit-feel-3` = #72,
`loop/journal-hero-redesign` = #60, `loop/tjurunga-absence` = #73, `loop/reduced-motion` = #74. `staging/ready-line` carries `handoff/`.
**Loop:** RUNNING. **Full briefing to Muse delivered:** `handoff/replies/claude-full-briefing.md` (First Order, 2026-10-21).

## Done
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
- **Carter asks you (2026-10-24):** please commit the three Journal hero images to `handoff/journal-hero/`. Details and
  upload options are in `handoff/request-2026-10-24-muse-journal-hero-images.md`.

## Next (First Order sequence, then value per `decisions-2026-10-17-priority-by-value.md`)
0. **Carter's six answers, 2026-10-24 ~23:50** (`decisions-2026-10-24-batch-six.md`), in order:
   - **#67 (live phone fixes), approved:** brought up to `main` as `24563f9`; site diff byte-identical to the reviewed
     `1681050`; local checks green; eras page 8,084 → 5,944 px; pages wider than a phone 45 → 0 of 83. **Waiting on**
     GitHub checks, then fast-forward.
   - **#73 (Tjurunga), approved:** waiting on its Lighthouse re-run (run 166 failed on The Excavation, a page #73
     doesn't touch; re-run once) and on the **independent re-review of the softened wording** (needs a run that didn't
     make it). If #67 merges first, bring #73 up to the new `main` again.
   - **#75 (clear V72 and Ra-Horakhty), approved by Carter's "clear":** built `4409b86`. **Needs an independent review**
     by a run that didn't make it, then checks, then merge.
   - **Site speed fix A, approved through to going live:** build it on `loop/*` (load outside manuscripts only when
     reached), then independent review, checks and merge. Fixes B–E still need their own yes.
   - **Reviewer and auditor, option A:** the loop does their saving. Fold this into the loop procedure. PR #58 is not merged.
   - **PR #61:** closed (done).
   - **Journal hero images:** reminder sent to Muse (`request-2026-10-24-muse-journal-hero-images.md`). Still blocked until the images arrive.
1. **Merge PR #73** (Tjurunga takedown; Carter's yes and "soften" recorded; re-review 0 findings). **Waiting on:**
   Lighthouse on `efba79c`. Once green, a run that wrote none of #73 fast-forwards `main` `6c81a84` → `efba79c`, watches
   the deploy, updates CURRENT and MERGEABLE.
1a. **PR #67** (live phone fixes): **Carter's yes 2026-10-24** (`decisions-2026-10-24-batch-six.md` 1). Bring it up to
   `main` after #73 (merge commit), confirm the site diff unchanged from the reviewed `1681050`, checks green, merge.
1b. **Site speed fix A** (Carter's yes, batch-six 2): build on a `loop/*` branch: load the outside manuscript viewers
   (Codex Mendoza, Borgia, Voynich) only when the reader reaches them; then independent review and checks; going live
   is covered by this yes. B–E still need their own yes.
1c. **Clear V72 and the Pantheon's Ra-Horakhty** (Carter's "clear", batch-six 3): record in `reviews/cleared.json`,
   remove pending state, on a branch with checks and independent review.
1d. **Close PR #61** with a note (batch-six 5; branch kept). **Reviewer/auditor option A** (batch-six 4): the loop saves
   their reports; fold into the procedure.
4. **Journal hero rebuild** (PR #60, Option A): **blocked** until the three images named in
   `handoff/journal-hero/README.md` are committed to that folder (Needs Carter 9). Never invent a face.
5. **Arcade playability floor** (value 3). Reduced motion is otherwise covered: the hit-feel PRs handle seven games,
   #74 the other two, and every page stayed still in the audit.
6. **Relics 2–4** (Crown of the Kandake, Etruscan mirror, Crown of Thorns) under the Rework Standard's five gates
   (`rework-standard-order.md`: floor in hand, side-by-side proof, no-backwards checklist, auditor signs, Carter merges).
7. **Muse's 2026-10-18 previews** one per run (sensitivity review for Fire Temple, Langar, Awithlaknannai).
8. **Independent review of #68, #64, #66** (#67 done 2026-10-24; #68 next: live Pilgrimage wording) so they can reach MERGEABLE (#66 is new content: Carter's yes too).
9. **900 Theses** — hold LIFTED (Council 14b): spec-body patch to Carter's rulings, Gate A text extraction, licensing review.
10. Fix package; small defects part 2 (+ Journal "Sound" button sits under the close ✕ at phone width, live); Spirit Board rename; Errata page (prepare only); Debate Hall preview safety;
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
Answered 2026-10-24 (`decisions-2026-10-24-batch-six.md`, folded into Next): PR #67 yes, speed fix A yes, V72 and
Ra-Horakhty cleared, reviewer/auditor option A, PR #61 close, Journal hero images requested from Muse. Hit-feel 2–3,
reduced motion and the Tjurunga takedown/wording also answered.
1. **Domain:** Muse reports (`muse-reply-domain-and-facts-2026-10-24.md`) that www.getconexto.com has been live since
   2026-10-18; the build's "not pointed" record is older than that. Nothing to change. **That's right / No, it isn't.**
2. **Treaty of Kadesh tablet preview** (`2026-10-19-treaty-of-kadesh-rebuilt.md`): **Looks right / Change something.**
3. **Journal hero pictures:** waiting on Muse (reminder sent); nothing for Carter unless she can't.
