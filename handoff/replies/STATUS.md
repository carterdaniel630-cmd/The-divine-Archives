# Build-side STATUS — running (overwritten at every checkpoint)

**As of:** 2026-10-18 ~07:45 UTC (build loop). **Answers:** manifest-v2 through Item 31 and every `decisions-*.md` /
`correction-*.md` to date. **Deployed (`main`):** `7b281cb` = site batch A (PR #59, merged 2026-10-17 21:08 EDT,
deploy green) plus two handoff-only commits (games Phase 1 record), at the-divine-archives.pages.dev. getconexto.com is not pointed yet (`decisions-2026-10-17-domain-not-pointed.md`).
**Branches:** `loop/small-defects-2026-10-17` = batch B (`aeda5d4`; behind `main` by two handoff-only files, no site
change). `loop/museum-phone-dpr` = museum phone speed (`0585c80`, independently reviewed). `loop/journal-hero-redesign`
= PR #60 (`6862dee`, on hold for Carter's selfie). `staging/ready-line` carries `handoff/` (plus the Item 29 board tool).
**Loop:** RUNNING. One item per run, highest value first, each run starts the next.

## Done
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
1. **Batch B to live** (value 1): waits on Carter's yes to open its pull request (see Needs Carter). Once a PR exists:
   wait for every check to finish green (without holding the lock), then it is mergeable on Carter's per-item yes.
2. **Museum phone speed to live** (value 3): review passed. Waits on Carter's yes to open its pull request (see
   Needs Carter); then every check green (without holding the lock), then mergeable on his per-item yes.
3. **Museum `?fps=1` frame-rate overlay** (value 3, small): promised in `plans/museum-visual-pass.md` §6 so Carter can
   measure on his phone. Check the plan's approval covers it before building; if it counts as a new feature, prepare only.
4. **Small defects, part 2** (handoff drafts and previews, not live; value 5–6, small and sure): Bagh-chal diagonals
   and the "standard board" claim; zodiac `dispose()` clears only its own host; Oracle Bones wording; Google Fonts out
   of the Oracle Bones and Library Rescue exhibits; Grimoire "not an instruction" note, Gardnerian label and lore flags.
   Commit on `staging/ready-line` (handoff only), not batch B.
5. **Hit-feel on the other games now** (Carter, Item 31 #5; value 3): impact and game feel on the existing games,
   without waiting for the fighter to unpark. Most-played first; respect reduced motion.
6. **Reduced motion respected everywhere** (Item 31 #6; value 3): check every game, museum room and exhibit honours
   the phone's setting; fix any that override it. Never override.
7. **Item 29, Graphify tie-in, rest:** wire the map into the loop (query before touching code); keep the standards
   board current at each checkpoint. Its merge needs Carter's yes.
8. **Arcade playability floor:** difficulty selector, undo where it fits, short tutorial, readable tap targets.
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
- **Museum phone speed.** Built, checked and independently reviewed (0 findings), not live. OK for the loop to open a
  pull request and, when every check is green, send it live? A: yes. B: not yet. Recommend A. If you can,
  open the museum on your phone after it is live and say whether it feels smoother or blurrier.
- **Batch B pull request.** OK for the loop to open a pull request for batch B (hiss gone, "199 figures", V72 sources,
  Ra-Horakhty) so GitHub's checks run? A: yes. B: not yet. Recommend A. Then, once green: send it live? (yes / wait)
- **Your selfie for the Journal hero (Item 27; option A, Item 31 #1).** Not in the repo. Send it in a chat with
  Claude and say "add it to the repo for the Journal hero"; PR #60 waits until then.
- **Batch review:** re-clear V72 (Book of Shadows, sources only) and the Pantheon's Ra-Horakhty entry (name and
  text changed) when batch B comes to you.
