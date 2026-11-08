Batch: games full screen on a sideways phone (PR #95)
Reviewed: 2026-11-08
Auto-pass: on
Covers: claude/games-fullscreen@d584900
Summary: 1 passed, 0 fixed, 1 needs you.

Not an independent review: this session built #95. It covers the reviewer's checks; an independent
review by another session can still be run before the merge if you want one.

Automatic checks: pass. review-checks.js --base origin/main --build 9/9; all 18 verify-*.js pass;
framework tests 42/42. GitHub checks on d584900 were still running when this was written.

PASSED   (1)
  - site:games-fullscreen-95: layout and code change only, no text, facts or images changed.
    - Checklist 1-5 (accuracy, lenses, evidence tiers, contested claims, tone): nothing to check.
      No chapter, Vault entry, Pantheon figure or game fact is touched.
    - Checklist 6 (sensitivity): nothing sensitive. No new image, model or page. The two games
      show the same pictures as before, only larger.
    - Checklist 7 (games): opened headless on a phone held sideways (844x390 and 915x412, touch,
      2x pixels).
      - The Journal fills the screen edge to edge (canvas 844x390). Divine Casualties fills the
        screen height in a live match (780x390).
      - Every floating button can be tapped: D-pad, A/B/X/Y, L/R, Pause/Sound, full-screen,
        close, and "Choose fighters" (it returns to the fighter select screen).
      - Turning the phone upright and back keeps the picture sharp.
      - Upright phone and desktop measure the same as current main.
      - No script errors in any run.

FIXED    (0)

NEEDS CARTER (1)
  - site:games-fullscreen-95/merge: every merge to main is yours.
    - The earlier Lighthouse run (on f608798, 2026-11-01) was red on Archive Chess only (94 to 88).
      #95 does not touch chess, and other untouched games moved by similar amounts both ways in
      the same run.
    - The re-run on the merged head must be green before any merge.

Notes
  - Main moved on by 52 commits since #95 opened. The branch now includes main (d062ef3).
  - The one conflict was docs/symbols.html, where main now loads each game on first open. Main's
    loader was kept, with the Journal's new version inside it.
  - #60 (the other Journal PR) was closed unmerged on 2026-11-07, so the overlap noted when #95
    opened no longer applies.
  - Small thing seen while testing, not a defect: at the very start of each Journal level the
    explorer stands under the see-through D-pad. The view follows them once they move right.

Accuracy spot-checks
  - none: no factual claims changed.

Needs your decision
  - Merge #95 once every GitHub check is green on its latest version? (yes / no)
