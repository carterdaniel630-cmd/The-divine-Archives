# 2026-10-31 ~20:22 UTC — build loop: Tjurunga absence page, official sources only (PR #89)

**For Carter, in one line:** the Tjurunga "Not Shown" page no longer links to Wikipedia; its sources are now official
only (PR #89). It goes live on your yes.

## Why this item, not the review of #88
STATUS → Next 1 is the independent review of PR #88. This run is the same session that built #88 (Carter's manual
re-fire landed in it), so it may not review it (LOOP "Merging" 1). It took the next live-site item instead:
`decisions-2026-10-26-absence-page-sources.md`. The firing also said to leave PR #87 alone (another thread owns it);
this run did not touch it.

## What was done
- Branch `loop/tjurunga-official-sources`, head `08d4f51`, PR #89 against `main` `68b7b03`.
- Wikipedia "Tjurunga" removed from `vault/v68-tjurunga.md` and `sources/v68-tjurunga.md`. In its place: AIATSIS,
  "Arrernte returns", https://aiatsis.gov.au/about/what-we-do/return-cultural-heritage/roch-returns/arrernte-returns
  (opened 2026-10-31: restricted Arrernte objects returned from the Illinois State Museum and Manchester Museum in
  2019 and the Kluge-Ruhe collection, celebrated 2021; no sale or auction links). It supports the sentence that
  museums overseas are returning secret-sacred objects; the other claims already rest on the five remaining sources.
- Dated note added to the source log. Page text, the absence and the share card unchanged.
- Rebuilt: `docs/vault/tjurunga.html`, `framework/registry/source.json`, modified-date stamp (`content/dates.json`,
  `docs/sitemap.xml`).

## Checks (on `08d4f51`)
- Full build order; 17/17 verify; 42/42 tests; `review-checks --base origin/main --build` 9/9, 0 warnings, and the tree
  stays clean after it (the first try failed only because the date stamp had not been committed; fixed in `08d4f51`).
- Headless phone 390×844: no script errors, 0 images, "wikipedia" nowhere in the page; outside links are the five
  official sources plus the site-wide ko-fi footer. Screenshot `handoff/previews/tjurunga-official-sources/`.
- Not checked: whether pages behind the remaining links (e.g. spencerandgillen.net) link onward to sales. The ruling
  named only the Wikipedia link; the reviewer should spot-check the five.

## PR #88 check status (recorded for the next run)
- `9fbc2ec`: 8 of 9 GitHub checks green at ~20:20 UTC; Lighthouse still running. Re-confirmed this run that the build
  check leaves the tree clean on that branch.

## Correction
- The #88 reply and STATUS said "~20:30 / ~20:35 UTC". The real times were ~20:13–20:20 UTC (GitHub check runs on
  #88 started 20:18). Fixed in STATUS.
