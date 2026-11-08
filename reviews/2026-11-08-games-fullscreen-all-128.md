Batch: the other nine games fill a sideways phone in full screen (PR #128)
Reviewed: 2026-11-08
Auto-pass: on
Covers: claude/games-fullscreen-all@2ebd286
Summary: 1 passed, 2 fixed, 1 needs you.

Not an independent review: this session built #128.

Automatic checks: pass. review-checks.js --base origin/main --build 9/9; all 17 verify-*.js pass; framework
tests 42/42. GitHub checks on 2ebd286 were still running when this was written.

PASSED   (1)
  - site:games-fullscreen-all-128: layout and code only. No text, facts or images change.
    - Checklist 1-5: nothing to check; no chapter, Vault entry, Pantheon figure or game fact is touched.
    - Checklist 6 (sensitivity): nothing sensitive. No new image, model or page; the same game art, larger.
    - Checklist 7 (games): opened headless at 667x375, 844x390 and 932x430 (touch, 2x pixels), every game in
      play, every message line filled with a long fact as the worst case.
      - No scrolling; nothing over the full-screen or close buttons; no button cut off; no script errors.
      - Every key, button and board is the top element at its centre.
      - Upright phone and desktop measure the same as main.

FIXED    (2)
  - site:games-fullscreen-all-128/has: the script skipped its older board sizing on every sideways phone, but
    the new layout needs :has(). A browser without :has() would have got neither. It now skips only where
    :has() is supported. Commit 2ebd286.
  - site:games-fullscreen-all-128/pause-pill: the tilted Pause pill on the Journal and Divine Casualties (from
    #95) sat 8px too low, its corner just off the screen. Raised to 14px; every visible control now fits.
    Commit 2ebd286.

NEEDS CARTER (1)
  - site:games-fullscreen-all-128/merge: every merge to main is yours.
    - With the whole dig at screen height, an Excavation square is about 36px, under the 44px tap size. The
      game's own zoom button appears in exactly this case (46px squares, scrollable). Tested: zoom on, a tap
      digs.

Notes
  - Found while measuring: on main, a game opened by a direct link first shows a one-line window that then
    jumps as the game fills it (CLS about 0.41 when the timing catches it). This is the cause of the
    two-level Lighthouse scores on game pages. A first fix measured worse and was not opened. To be its own
    task.

Accuracy spot-checks
  - none: no factual claims changed.

Needs your decision
  - Merge #128 once every GitHub check is green on its latest version? (yes / no)
