# 2026-11-01 ~09:55 UTC — line-wrap typos: PR #97 (ch08) built; four cleared chapters held

**Item:** STATUS → Next 3b (five line-wrap typos in `content/chapters.js`, follow-up to audit Fixes 2+3).

## What was done
- Found the five artifacts (and confirmed the other nine "x- y" hits are real suspended hyphens such as
  "twentieth- and twenty-first-century", left alone): ch07 "free- standing", ch08 "day- laborer", ch15
  "number- mysticism", ch16 "relic- veneration", ch45 "ascent-and- initiation".
- Fixed all five and rebuilt. `review-checks.js` then **failed `pending-diff`** for ch07, ch15, ch16, ch45: they
  are cleared chapters, and any body change to a cleared chapter must either return it to pending (would put the
  "pending review" banner back on four live, cleared chapters for a typo) or come with a new entry in
  `reviews/cleared.json` (Carter's log; clearing is his alone). The check is doing its job, so it was not bypassed.
- Split the work:
  - **PR #97** `loop/line-wrap-typos` head `6d51ab9`: ch08 only (ch08 is still pending, so allowed). 2 files, +2/−2
    (`content/chapters.js`, `docs/chapters/ch08.html`).
  - **`loop/line-wrap-typos-cleared`** head `adfbdc9` (no PR): all five fixes, held for Carter's answer.

## Checks (PR #97, on `6d51ab9`, merge-base `ff08cc1` = main)
- Full build order (stamp-dates, build-og, build-vault, build-chapters, build-pages, build-museum, build-framework,
  build-entity-registry): no diff beyond the fix.
- `tools/verify-*.js` 17/17 pass; `node --test framework/test/*.test.js` 42 pass / 0 fail.
- `review-checks.js --base origin/main --build`: PASSED 9/0/0.
- Headless 390×844: ch08 no script errors, no horizontal overflow, fixed word present, broken form gone.
  The held branch's ch07/15/16/45 checked the same way: all clean.
- GitHub checks: started on push; not yet read by this run.

## Merge path
- PR #97: needs an independent review by a run that did not write it, then all GitHub checks green, then merge by
  class (c) typo fix (`decisions-2026-11-01-carter-b-a-a.md`). It touches no cleared chapter and no pending tag.
- Held four: need Carter (see STATUS → Needs Carter).
