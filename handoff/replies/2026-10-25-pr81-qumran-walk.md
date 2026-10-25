# PR #81 built: the Qumran guided walk no longer stops in Cave 4 (Next 4h)

**Run:** 2026-10-25 ~10:25–10:40 UTC, build loop (chained). **Branch:** `loop/qumran-walk-4b` @ `2c099a0`, **PR #81**.

## What was wrong (live)
On the Qumran site, "Walk on" stops for good in Cave 4's inner chamber (4b), with reduced motion on or off. The next
stop is the cave's way out, and a straight line to it from 4b goes through rock.

## The fix
Three plain route points (not stops) in `docs/pilgrimage/sites/qumran-caves/site.js`. They lead back through the low
passage, across 4a, to the mouth. That is two lines.

## Why it is stacked on #68
With the route fixed on today's `main` alone, the walk leaves Cave 4. It then loses its place on the terrace and goes
round to Cave 4 again (tested). #68's engine change, which carries the route on through portals, fixes that. So
`loop/qumran-walk-4b` is #68 `c4e5141` plus `main` `c957af5` (merge `dd98586`, clean) plus the Qumran commit. It goes
after #68. The diff to review is `dd98586..2c099a0`.

## Checks
- Full build order: no output changes. 17/17 verify scripts, 42/42 tests, review-checks 9/9 (0 warnings).
- Headless phone test (390×844, touch), pressing "Walk on" until it stops:
  - Reduced motion: all 6 Pilgrimage sites reach their last stop.
  - Normal motion: Qumran reaches the last stop in Cave 3.
  - 0 script errors. The only error was the Google Fonts request, which is blocked in the test environment.
- No wording, source or image changes. The pending-review tag stays.

## Also this run
- PR #80: both runtime runs green. Lighthouse was still running at 10:25 (started 09:57) and was not waited on.
- Correction to the previous run's reply and STATUS: the #68 review run ended at about 10:24 UTC, not "~10:50" as
  written.

## Next
An independent review of #81 by a run that wrote none of it. Going live needs Carter's yes for #68, then for #81.
