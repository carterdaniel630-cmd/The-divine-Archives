# Build-side STATUS — running (overwritten at every checkpoint)

**As of:** 2026-10-18 ~17:00 UTC (build loop). **Answers:** manifest-v2 through Item 32, every `decisions-*.md` /
`correction-*.md` / `order-*.md` to date, `nudge-2026-10-18-0832.md`. **Deployed (`main`):** `c205f4c` = batch A + museum
phone speed (#62) + batch B (#63), deploy green, at the-divine-archives.pages.dev. getconexto.com not pointed.
**Branches:** `loop/graphify-board` = PR #65 (Item 29, `b0896a6`). `loop/journal-hero-redesign` = PR #60 (on hold for
Carter's selfie). `staging/ready-line` carries `handoff/`.
**Loop:** RUNNING. **Items per run (Item 32):** this run finished 3 — batch B reviewed and merged, Item 29 put on its own
branch with PR #65, auditor/verifier health check reported — in one run, with the lock folded into the work commit.

## Done
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

## Next (ranked by value per `decisions-2026-10-17-priority-by-value.md`)
1. **Merge PR #65, Item 29** (Carter approved): a run that did not make the branch (not the ~17:00 run) reviews
   `origin/main...b0896a6` against `reviews/REVIEWER.md` and confirms it matches `cfb1204`; waits (without the lock) for every
   GitHub check incl. Lighthouse; local checks; fast-forward; confirm deploy; update CURRENT and MERGEABLE.
2. **Hit-feel on the other games now** (Carter, Item 31 #5; value 3): impact and game feel on the existing games, most
   played first; respect reduced motion.
3. **Reduced motion respected everywhere** (Item 31 #6; value 3): every game, museum room and exhibit honours the phone's
   setting; fix any that override it.
4. **Arcade playability floor:** difficulty selector, undo where it fits, short tutorial, readable tap targets.
5. **Small defects, part 2, the rest** (handoff previews, not live): zodiac `dispose()` clears only its own host; Oracle Bones
   wording; Google Fonts out of the Oracle Bones and Library Rescue exhibits; Grimoire note, Gardnerian label, lore flags.
   Commit on `staging/ready-line` (handoff only).
6. **Item 29, Graphify tie-in, rest:** query the map before touching code; keep the standards board current.
7. **Fix package (§7)**, relic by relic, most visible rooms first.
8. **Spirit Board rename** (Item 31 #4) of the Ouija preview; chapter text about the historical product stays factual.
9. **Errata page in the Vault** (Item 31 #3): prepare only; publishing needs Carter.
10. **Protection charter D4** check; **Debate Hall preview safety**; larger items (folded list §B rows 14–24).
- Scheduled: on or after **2027-01-15**, remove the old-id table on a side branch.

## Parked / on hold (do not build)
- Protection charter D1–D3 (Item 26). 900 Theses: ON HOLD (Item 31 #9). Email list: skipped (Item 31 #7). Pythia gets no
  Pantheon entry (Item 31 #2). VR, multilingual, Divine Casualties rebuild, ballgame, music reopen.

## Needs Carter
1. **Scheduled reviewer and auditor save nothing** (since 2026-10-12; details in `2026-10-18-auditor-verifier-health.md`).
   Options: **A** (recommended) the loop also saves each independent review to the review log and runs the weekly audit
   steps; **B** you attach the repository to the two scheduled tasks in the Claude app; **C** also merge PR #58, the alarm
   that emails you when a review run saves nothing (after review and green checks).
2. **Your selfie for the Journal hero** (Item 27). Send it in a chat with Claude: "add it to the repo for the Journal hero".
3. **Batch review, now live:** re-clear V72 (Book of Shadows, sources only) and the Pantheon's Ra-Horakhty entry.
4. Museum speed is live: open the museum on your phone and say if it feels smoother or blurrier
   (`the-divine-archives.pages.dev/museum.html?fps=1#ch02` shows the frame rate).
