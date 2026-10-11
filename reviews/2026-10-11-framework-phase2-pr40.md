Summary: 10 passed, 0 fixed, 4 need you. PR #40 now has Phase 2 (which you confirmed) and the builder's fixes for my earlier findings. It works: the games, page views and the museum's breath walkthrough all record correctly, in the visitor's browser only. The phone-speed check (Lighthouse) passed under the strict rule for ready PRs: no page got slower by more than 5 points. Two small bugs are left for the builder.

NEEDS CARTER (4)
  - site:fw-merge: PR #40 is now marked ready for review, so merging it is your call. Lighthouse passed under the hard gate (no page dropped more than 5 points). Everything else on the current head passes.
  - ritual:meditation-breath-cycle: this walkthrough would go live in the museum's Buddhism room with the "pending full review" tag, as you approved. Its content matches MN 118. The exact wording against the Thanissaro translation is still unchecked, because the page is blocked for me as well as for the builder. The tag stays until you clear it.
  - site:fw-retry: the fix for pages that asked us to slow down only half works. Pages that had already failed twice before the fix are still skipped forever. 62 such pages are still unchecked, and the latest run fetched none of them. The builder's fix is one line: decide from the stored failure reason, not a new flag. (tools/build-originality-baseline.js line 91)
  - site:fw2-import: a small counting bug. For a visitor whose first game score comes after this update, that score is copied a second time as an "imported old score" on their next page load (once per game, then never again). Best scores are not affected; only the count of scoring events is off by one. The builder can fix it.

Needs your decision
  - Merge PR #40 into main once the builder fixes the two small bugs? (yes/no)
  - Or merge now and fix the two bugs in a follow-up? (yes/no)

------------------------------------------------------------------------------------------------

Batch: framework Phase 2 and the fixes after my first report (PR #40, ready for review)
Reviewed: 2026-10-11
Auto-pass: on ("audit 2026-10-11: 6 of 6 re-reviewed items agreed; ...", reviews/status.json)
Covers: claude/framework-sandbox@1ac8e9f   (Phase 2 f87f455..4aaf77a, fixes 0828543, housekeeping 4f8271a, punctuation 1ac8e9f)
Carter's go-ahead: Carter confirmed Phase 2 in this session ("yes"), after the commits said "Approved by Carter".
Summary: 10 passed, 0 fixed, 4 need you.

Automatic checks (on 4aaf77a and again on 4f8271a)
  - node --test framework/test/*.test.js: 36 of 36 pass (34 on 4aaf77a).
  - build-entity-registry --check: up to date, 4,223 entities (short 5,777 of 10,000; the plan matches).
  - build-framework --check: docs/assets/framework/ matches framework/ (5 files).
  - review-checks.js --base origin/main --build: 8 pass, build output current, nothing left over.
    32 pending chapter/Vault pages all show the banner.
  - All tools/verify-*.js pass.
  - CI on 4f8271a: Framework, Review checks, Originality pass. Game runtime and Link guard pass. Lighthouse passed (run 38116595185, hard gate).

PASSED   (10)
  - site:fw2-games (a): all 12 games call ArchiveGames.finish exactly at their end screen. Chess: checkmate,
    stalemate, resign. Fighter: showResult, guarded once per match. Minesweeper: win and loss. Risk: campaign end.
    Seeker: final stage, plus "unlocked" per stage. The other seven: their game-over or end screen, next to
    addHighScore. The games' own saves (da.games.*) are unchanged. symbols.html bumps archive-games.js
    and all 12 game scripts. Note: chess has one branch where the computer has no move and the game ends
    without recording. It cannot happen in practice, because the move before already ends the game.
  - site:fw2-framework-copy (b): the build check passes. Only meditation-breath-cycle is published (status
    "pending"); the votive candle stays "draft" and is not in docs/. The published file is identical to the
    source.
  - site:fw2-walkthrough (c): tested in a headless browser. The intro shows "Recently added · pending full
    review" with "Begin" and "Not now". Each of the 5 steps has Leave. "Continue" stays disabled until the
    step's minimum time has passed. Nothing is scored. The end screen has Close. On the museum page it records
    "started" and "completed" for ritual:meditation-breath-cycle. The museum boots with no script errors on a
    phone-size screen. The Buddhism room (ch11) card adds the button only when the index lists a walkthrough for
    that room. The player and engine load only when the visitor asks.
  - site:fw2-views (d): all 83 chapter pages and 88 Vault pages carry the tracker with their own label
    (chapter:chNN, relic:vNN), checked page by page against vault-data.js and the registry. Pantheon records
    figure:<id> for each figure opened; all 199 figure ids are in the registry. Tested: opening ch11 and the
    Shroud page records "viewed chapter:ch11" and "viewed relic:v04".
  - site:fw2-about (e): accurate. The ledger has no network code; everything is in localStorage key
    da.ledger.v1, which clearing site data removes. It lists what is recorded. Not mentioned: Seeker stage
    unlocks (part of a game) and the hidden arcade door, probably on purpose so the secret stays secret.
  - site:fw2-claudemd (f): build-framework.js and build-entity-registry.js come after build-museum.js, and
    the description matches what the tools do.
  - site:fw2-reviewer-line: the REVIEWER.md line (Originality catches copying only; UNVERIFIED or PARTIAL
    means "not checked"; FAIL is a finding) matches the draft you approved in reviews/ORIGINALITY.md.
  - site:fw-originality (fix 0828543): the loophole is closed. Bold, italics, "(c. 500 BCE)" and "(1872)" no
    longer exempt a quote; "(trans. Faulkner, p. 12)" and "(Smith 1872)" still do. Across the archive, exempt
    quotes fall from 1,643 to 127. Small leftover: a label like "(Room 12)" still counts as a citation (any
    capitalised word + number).
  - ritual:votive-candle (fix 0828543, still a draft): step 1 now says what Hardon's dictionary says. Step 3 now
    credits the Catholic Encyclopedia, and a search result quotes that article: the candle before a statue is
    seen "in a loosely defined way as symbolical of prayer and sacrifice". Supported. Tier 1, as you confirmed.
  - site:fw2-workflow (4f8271a): the Framework workflow now also runs on PRs that change the files the registry
    is built from, so a stale registry fails CI instead of going unnoticed.

FIXED    (0)

NEEDS CARTER (4)
  - see the top of this report.

Accuracy spot-checks
  - ritual:votive-candle | candle before a statue symbolises prayer and sacrifice | https://www.newadvent.org/cathen/03246a.htm | supports (seen through a search result quoting it; the page is blocked here)
  - ritual:votive-candle | burned before a statue or shrine to honour Christ, Mary or a saint | https://www.catholicculture.org/culture/library/dictionary/index.cfm?id=37142 | supports
  - ritual:meditation-breath-cycle | setting and steps 1–4 | http://www.buddha-vacana.org/sutta/majjhima/mn118.html (via search) | supports the content; Thanissaro wording could not load

Originality run on 4f8271a (run 38116261759)
  - 171 checked: 20 pass, 150 partial, 1 unverified (v68 tjurunga, 0 of 5 pages), 0 fail.
  - Baseline: 1,251 of 1,867 cited pages. Not fetched, 616: HTTP 403 398, HTTP 429 62, PDF 37, HTTP 404 36,
    almost no text 34, DNS 12, timeouts 12, certificate 6, HTTP 405 6, HTTP 402 5, other 8.
  - "0 fetched this run" in 16 seconds: the 62 rate-limited pages were not retried (see site:fw-retry).
  - The per-page list is in the run's artifact; this session cannot download artifacts.

Lighthouse
  - Run 38116595185 on 1ac8e9f, "Gate: hard" (PR ready for review into main): success. Median mobile score,
    main vs PR: Home 87/87, Era 79/79, ch07 76/75, ch45 70/70, ch80 74/73, Museum 36/36, Pantheon 72/73,
    fighter 81/82, chess 87/83, ouroboros 87/86, ziggurat 83/85, reliquary 86/86, seeker 86/82, pong 86/86,
    minesweeper 82/86, pac-man 86/82, pinball 86/81, risk 82/82, treasure 77/76.
  - No page dropped more than 5. Largest drops: pinball 5 (exactly at the limit), chess, seeker and pac-man 4
    each. All four have run-to-run spreads of 5 to 6 points (e.g. pinball PR runs 81, 81, 86), so these
    are within noise but worth watching on the next game change.
  - Every earlier Lighthouse run on this PR was cancelled by a newer push.

Head history during this review: 4aaf77a → 0828543 (my findings) → 33f37ca (main, #41) → 4f8271a → 1ac8e9f
(walkthrough source line punctuation only; checked). Two earlier
Lighthouse runs (on 0828543) were cancelled by these pushes.
