# 2026-10-25 ~09:58–10:10 UTC — build loop: independent review of PR #80 (Reliquary dropdowns, 461–484 px phones)

**Reviewer:** a build-loop run that wrote none of #80 (its one commit `c9408a0` came from another session).
**Covers:** `loop/reliquary-phone-480@c9408a0`, reviewed as `origin/main` (`c957af5`)`...c9408a0`, against
`reviews/REVIEWER.md` §3–§4 and `LOOP.md` "Merging" 1 and 3.
**Verdict: PASSED, 0 open findings.**

## The change
One file, `docs/assets/games/games.css`, Reliquary section only (every selector touched starts `.rq-form`):
- two-column form `1fr 1fr` → `repeat(2, minmax(0,1fr))`; the one-column rule under 461 px `1fr` → `minmax(0,1fr)`;
- `.rq-form label` and `.rq-form select` may shrink to their column (`min-width:0`, select `max-width:100%`).
No other game, page, script, chapter or data touched. Nothing religiously sensitive, no new feature, no pending tag.

## Automatic checks (this run, on a clean copy of `c9408a0`)
- Full build order (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry, sky): no output changes.
- Every `tools/verify-*.js`: all pass. `node --test framework/test/*.test.js`: 42/42.
- `node tools/review-checks.js --base origin/main --build`: 9 checks passed, 0 failed, 0 warnings.

## Checklist (§4)
1–5 (accuracy, lenses, evidence tiers, contested claims, tone): not applicable, no text changed.
6 (religious sensitivity): pass, CSS layout only.
7 (games): pass. My own headless phone check, written fresh for this review, run side by side on `main` and on #80
(symbols page, `#play=reliquary`, phone emulation, touch on), start screen and first question:

| Width (upright) | `main` c957af5 | #80 c9408a0 |
|---|---|---|
| 320–460 (one column) | fits | fits |
| 461 | Era/Opponent label + dropdown 20.8 px past the dialog | fits |
| 465 / 470 / 475 / 480 | 17.2 / 12.5 / 7.8 / 3.1 px past | fits |
| 484, 485, 520 | fits | fits |
| 568, 844, 932 sideways; 1280 desktop | fits | fits |

- Defect reproduced on `main` and gone on #80 at every width. The two columns are now equal (e.g. 206/206 px at 480).
- First question screen: nothing past the dialog at any width, either branch. No sideways page scroll anywhere.
- Script errors: none. The only console line on both branches is Google Fonts failing to load in this sandbox (no
  outside network here), so the measurements use fallback fonts. The live site's fonts are about as wide; the build
  run's own check (`2026-10-25-pr80-reliquary-phone-480.md`) found the same widths fixed.
- Screenshot at 480 looked right: Set/Era/Topic/Opponent in two even columns inside the frame, Begin centred.

## Notes (not findings)
- The build run's reply put the overhang at "~3 px"; that is the 480 px figure. At 461–475 it was larger (up to ~21 px).
  The fix covers the whole band.
- Long option names inside a narrowed dropdown are cut by the phone's own control, as before; the full name shows in
  the list when tapped.

## GitHub checks on `c9408a0` at review time
checks, guard, test, runtime (first run): green. Lighthouse and a second runtime run still in progress (started 09:57).
Not waited on (LOOP.md step 3); the next run confirms them.

## What #80 still needs to be mergeable
Lighthouse (and the second runtime run) green on `c9408a0`, then Carter's yes for this item.
