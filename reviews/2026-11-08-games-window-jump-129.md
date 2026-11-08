Batch: the game window no longer jumps as a game opens on a phone (PR #129)
Reviewed: 2026-11-08
Auto-pass: on
Covers: claude/games-deeplink-cls@5bf8400
Summary: 1 passed, 0 fixed, 1 needs you.

Not an independent review: this session built #129.

Automatic checks: pass. review-checks.js --base origin/main --build 9/9; all 17 verify-*.js pass; framework
tests 42/42. GitHub checks were still running when this was written.

PASSED   (1)
  - site:games-window-jump-129: one CSS rule (phone-width screens hang the game window from the top).
    - Checklist 1-5: no text, facts or images.
    - Checklist 6 (sensitivity): nothing sensitive.
    - Checklist 7 (games): Lighthouse mobile, main vs the change, 5 runs on each of the 11 game pages. The median
      layout shift is 0 on every page (main: up to 0.41). Scores go up on four pages and hold at 99 on the rest.
      Window position traced frame by frame on Divine Casualties: its top stays at 12-26px while it grows from
      122px to 799px. Before, the top moved from 368px to 12px.

FIXED    (0)

NEEDS CARTER (1)
  - site:games-window-jump-129/merge: every merge to main is yours, and this one changes how the game windows
    look on an upright phone. The shorter ones (Seeker's Path, the Reliquary) sit at the top instead of in the
    middle. Side-by-side shown to Carter.

Accuracy spot-checks
  - none: no factual claims changed.

Needs your decision
  - Merge #129 (game windows hang from the top on upright phones) once its checks are green? (yes / no)
