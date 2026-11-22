# Delta check — #179, #180, #182 re-syncs (2026-11-22 ~01:50 UTC)

Checker: build-loop session ..01HFWzTm13ngYU9VL43YQMyq. Wrote none of the three PRs and none of the re-syncs
(those were by ..01HFWzTkiswjZCRdX7PmTty8). `main` at check time: `d33e839d`.

## #179 ch32 re-sourcing — `loop/resourcing-ch32` `ce5a84f3` — PASS, 0 findings
- `git diff d33e839d ce5a84f3`, all changed lines outside `content/dates.json` and `docs/sitemap.xml`, are
  byte-identical to the reviewed diff `cf718704..3b1d00c3` (6 files: chapters.js, dates.json, ch32.html, sitemap,
  ch32 markdown, source log).
- Remaining differences are generated only: blob indexes, ch32 `modified` date 2026-11-17 (re-stamp), and a sitemap
  context line (09-modern lastmod already 11-17 on main).

## #180 ch33 re-sourcing — `loop/resourcing-ch33` `6871e3ca` (stacked on #179) — PASS, 0 findings
- Layer diff `ce5a84f3..6871e3ca` (excluding dates/sitemap) byte-identical to reviewed `cf718704..ac57054a`.
- Generated-only differences: the 08-early-modern sitemap line and ch32's date line now sit in the parent layer.

## #182 VR light rig — `loop/vr-light-rig` `25475e9e` — PASS, 0 findings
- `git diff d33e839d 25475e9e` == `git diff 5570e888 118abdcc` (merge-base..reviewed head) except the one expected
  line: the removed cache key is `app.js?v=55` (main's) instead of `v=51`; the branch's `v=56` stays above main.

## Local checks (this session)
- #180 head (contains #179): build order no diff; verify 18/18; tests 51/51; review-checks 9 pass / 0 fail / 2 warn
  (pending-diff: ch32/ch33 sources-only, stay cleared; wikipedia-share on the two source logs — both known, reviewed).
  #179 head: review-checks 9/0/2 warn (same), build no diff.
- #182 head: build no diff; 18/18; 51/51; review-checks 9/0/0.
- Headless (Playwright): ch32, ch33 at 360/390/1280 — 0 script errors, 0 sideways overflow; museum.html at
  360/390/1280 — 0 errors, 0 overflow.

## GitHub
- #179 `ce5a84f3`: 10/10 green incl. Lighthouse (success 23:07 UTC).
- #180 `6871e3ca`: all green incl. Lighthouse (two runs, success 23:09 and 23:28 UTC). One duplicate Originality
  run (44958692030) was cancelled; re-run by this session, completed success. Never assumed.
- #182 `25475e9e`: 6/6 green incl. Lighthouse — superseded, see below (re-synced to `4864a9d2` after #179/#180 merged).
