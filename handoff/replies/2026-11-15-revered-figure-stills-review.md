# Review: loop/revered-figure-stills @ f92ab8d7 (on origin/main dfe4d272)

- List: only V57, V25, V13 removed from `tools/data/relic-stills.json`; nine D2 holds and others untouched.
- Labels: `verify-relic-stills.js` OK (174 stills, all captioned "Museum rendition · not a photograph"; alt text says the same).
- Images: three stylised low-poly renders in the museum's own look (dark ground, framed cloth, simple faces/mantle); nothing photo-like or misleading.
- Checks: `review-checks.js --base origin/main --build` 9/9 pass; all 18 `tools/verify-*.js` pass.
- ch22 at 390 px (headless Chromium): no script or console errors, no failed requests, no sideways scroll; still loads with label.
- Tree left clean; nothing edited or committed.

NEEDS CARTER
1. Reversal: 2026-11-08 he ruled "b, keep them off"; 2026-11-15 he answered "a, show them". Treated "a" as current; confirm, since these are revered-figure images (sensitivity rule). Merging still needs his go-ahead.

PASS
