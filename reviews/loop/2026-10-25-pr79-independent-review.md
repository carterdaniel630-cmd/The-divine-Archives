# 2026-10-25 ~09:42–10:00 UTC — build loop: independent review of PR #79 (Journal on narrow upright phones)

Batch: PR #79, the Journal game on narrow upright phones + a spoken name for the full-screen button
Reviewed: 2026-10-25 by a build-loop run that wrote none of #79 (it was built by the 09:19 run)
Auto-pass: not used. Merge-gate review (handoff/LOOP.md "Merging" 1); Carter's per-item yes is separate.
Covers: loop/journal-phone-320@3018cdd
Summary: 1 passed, 0 fixed, 0 need you.

**In plain words:** the fix does what it says. On today's live site the Journal's lives, "Plunder" and the A button
are cut off on small phones, and the full-screen button has no name for screen readers. With #79 nothing is cut off
at any width I tried, every button is still big enough to tap, and the full-screen button says "Full screen" /
"Exit full screen".

Automatic checks: pass.
- full build order: clean, built output already current (no file changed);
- 17/17 `tools/verify-*.js` pass; `node --test framework/test/*.test.js` 42 pass, 0 fail;
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings;
- GitHub: checks, guard, test, runtime ×2 green on `3018cdd`. **Lighthouse still running** when this run ended
  (started 09:38); not assumed green.

PASSED (1)
- site:pr79: 8 lines in `games.css` (all scoped to the Journal: `.tr-hud`, `.ap-host:has(> .tr-stage)`) and
  `archive-games.js` (`aria-label` on the full-screen button, updated on toggle). 0 open findings.

Checklist (REVIEWER.md §4)
- 1–5 (accuracy, lenses, evidence tiers, contested claims, tone): not applicable, no text or chapter changed.
- 6 (religious sensitivity): pass, nothing sensitive touched.
- 7 (games): pass. Own headless phone check (not the author's), Journal started past its intro card, PR vs `main`:

  | width (upright) | `main`: pieces outside the game box | #79 | A/B button size on #79 |
  |---|---|---|---|
  | 320 | 8 (hearts, stats) | 0 | 46 px |
  | 340, 360 | 3 each (stats) | 0 | 46 / 52 px |
  | 375–420 | 0 | 0 | 58 px |
  | 421, 430 | 4 (A button) | 0 | 58 px |
  | 440 | 2 (A button) | 0 | 58 px |
  | 470–520 | 0 | 0 | 58 px |
  | sideways 844×390, 932×430 | 0 | 0 | 64 px (unchanged) |

  No page wider than the screen at any size. Full-screen name: `main` none; #79 "Full screen" → tap → "Exit full
  screen" (`aria-pressed` true) → tap → "Full screen" (false). All 12 games opened at 320 upright and 844 sideways
  on #79: 0 script errors. The direction pad picks a direction by angle over the whole pad, so its smaller arms at
  ≤340 do not shrink the tap area.
- Older browsers without `:has()`: the controller rules are simply skipped, i.e. same as today; no harm.
- Merges cleanly with #78 (the other `games.css` change), checked by a trial merge.

Noted, not findings (pre-existing, same on `main`, not in this diff) → added to Next 10:
- the Journal's Select/Start pills are about 36 px tall, under the 44 px tap guide;
- the Journal's timed tip "← → run · ↑ or Space jumps … J or X cracks the whip" names keyboard keys on touch phones.

Needs your decision: nothing for this review. #79 itself still needs your yes to go live (asked in STATUS once
Lighthouse is green).

Note on this run: its lock commit (`ac182ff`, `handoff/loop/LOCK` only) carried an attribution line naming a model,
against "never write model names in files or commits". It is on the shared `staging/ready-line`, so it is not
rewritten (no history rewriting on a shared branch); every later commit of this run uses the plain line.
