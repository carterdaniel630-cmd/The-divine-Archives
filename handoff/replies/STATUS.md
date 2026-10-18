# Build-side STATUS — running (overwritten at every checkpoint)

**As of:** 2026-10-18 ~12:30 UTC (build loop). **Answers:** manifest-v2 through Item 31, every `decisions-*.md` /
`correction-*.md` to date, and `approval-2026-10-18-graphify-merge.md`. **Deployed (`main`):** `7b281cb` = site batch A (PR #59, merged 2026-10-17 21:08 EDT,
deploy green) plus two handoff-only commits (games Phase 1 record), at the-divine-archives.pages.dev. getconexto.com is not pointed yet (`decisions-2026-10-17-domain-not-pointed.md`).
**Branches:** `loop/small-defects-2026-10-17` = batch B (`aeda5d4`; behind `main` by two handoff-only files, no site
change). `loop/museum-phone-dpr` = museum phone speed (`0585c80`, independently reviewed). `loop/journal-hero-redesign`
= PR #60 (`6862dee`, on hold for Carter's selfie). `staging/ready-line` carries `handoff/` (plus the Item 29 board tool).
**Loop:** RUNNING. One item per run, highest value first, each run starts the next.

## Done
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
- (none: the next loop run picks up the top item below that needs no Carter approval)

## Next (ranked by value per `decisions-2026-10-17-priority-by-value.md`)
1. **Merge #62 museum phone speed** (value 3; Carter approved): once Lighthouse on `0585c80` is completed and
   green, fast-forward `main`, confirm the deploy, update CURRENT and MERGEABLE, notify Carter. If red, root-cause.
2. **Batch B #63 to live** (value 1; Carter approved): after #62 lands, bring the branch up to `main`; confirm its
   site diff is identical to the reviewed one (a run that did not do the update records this); every check green on
   the new head (Lighthouse included); then merge. See reply `2026-10-18-prs-62-63-opened.md`.
3. **Graphify fix + standards board to `main`** (Item 29; Carter approved 2026-10-18,
   `approval-2026-10-18-graphify-merge.md`; newest ruling, small): the work is commit `cfb1204` on `staging/ready-line`
   (`.graphifyignore`, `tools/build-standards-board.js`, `handoff/standards/`). Put it on its own branch off `main`
   (non-`handoff/` files plus the board), have a run that wrote none of it review it against `reviews/REVIEWER.md`,
   list it in MERGEABLE, open its PR, every check green (Lighthouse included), local checks, then fast-forward after
   #62 and #63. Never hold the lock while checks run.
4. **Hit-feel on the other games now** (Carter, Item 31 #5; value 3): impact and game feel on the existing games,
   without waiting for the fighter to unpark. Most-played first; respect reduced motion.
5. **Reduced motion respected everywhere** (Item 31 #6; value 3): check every game, museum room and exhibit honours
   the phone's setting; fix any that override it. Never override.
6. **Arcade playability floor:** difficulty selector, undo where it fits, short tutorial, readable tap targets.
7. **Small defects, part 2, the rest** (handoff drafts and previews, not live; value 5–6, small and sure): zodiac
   `dispose()` clears only its own host; Oracle Bones wording; Google Fonts out of the Oracle Bones and Library Rescue
   exhibits; Grimoire "not an instruction" note, Gardnerian label and lore flags. (Bagh-chal done 2026-10-18.)
   Commit on `staging/ready-line` (handoff only), not batch B.
8. **Item 29, Graphify tie-in, rest:** wire the map into the loop (query before touching code); keep the standards
   board current at each checkpoint (the fix and board merge is item 3).
9. **Fix package (§7)**, relic by relic, most visible rooms first.
10. **Spirit Board rename** (Item 31 #4): the Ouija preview (`handoff/previews/ouija-board.html`) and every title or
   label take a generic name like "Spirit Board"; chapter text that mentions the historical Ouija board as a product
   stays factual (value 6 while a preview).
11. **Errata page in the Vault** (Item 31 #3): prepare it (draft, layout); publishing it needs Carter.
12. **Protection charter D4** check; **Debate Hall preview safety**; larger items (folded list §B rows 14–24).
- Scheduled: on or after **2027-01-15**, remove the old-id table on a side branch.

## Parked / on hold (do not build)
- Protection charter D1–D3 (Item 26). 900 Theses: ON HOLD (Item 31 #9). Email list: skipped, home-page sign-up
  stays off (Item 31 #7). Pythia gets no Pantheon entry (Item 31 #2). VR, multilingual, Divine Casualties rebuild,
  ballgame, music reopen.

## Needs Carter
- **Your selfie for the Journal hero (Item 27; option A, Item 31 #1).** Not in the repo. Send it in a chat with
  Claude and say "add it to the repo for the Journal hero"; PR #60 waits until then.
- **Batch review:** re-clear V72 (Book of Shadows, sources only) and the Pantheon's Ra-Horakhty entry (name and
  text changed) when batch B is live.
- After museum phone speed is live: open the museum on your phone and say if it feels smoother or blurrier. To see
  the frame rate, open `the-divine-archives.pages.dev/museum.html?fps=1#ch02`.
