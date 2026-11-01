# 2026-11-01 ~22:25 UTC — Loop run: fix batch item 4 (sitemap) prepared; #107 still waits on Lighthouse

## PR #107
Lighthouse on `4bb3d40` still in progress at ~22:20 UTC (started 21:51). Other 6 checks green. Not merged; lock
not held while waiting. Next run: if Lighthouse is green and `main` is still `412684a`, fast-forward (class (b)).

## Fix batch item 4: what was found
The sitemap is not broken. `review-checks.js` sitemap check PASSES on `main`: every page *not* marked noindex is in
the map. The 20 pages the walk found missing are all deliberately noindex:
- Museum landing `docs/museum.html` — comment: "The museum is an entry point, not content: the chapter, Vault and
  Pantheon pages are canonical."
- 10 open Pilgrimage sites — `tools/build-pages.js` comment: "A walkable model is an entry point, like the museum:
  the chapter and Vault pages are canonical."
- 4 preview sites (Newgrange, Stonehenge, Golgotha and the Tomb, Mount Ararat), the Keeper preview, the hidden
  arcade, search, random, and the chapter/era templates; 404 is exempt.

So the fix reverses an earlier design choice (search engines skip the museum and walks). No decisions file records
that choice (searched `handoff/decisions-*`, `council-*`, `order-*`: NOT FOUND), but it is deliberate in code, so the
remedy goes to Carter (if in doubt, per item).

## What was built (ready if Carter says a)
Branch `loop/sitemap-coverage` **`1026000`** (off `main` `412684a`; no PR yet):
- Museum landing + the 10 open sites: noindex removed, canonical link added, listed in `sitemap.xml` (192 → 203 entries).
- Previews, Keeper, arcade, search/random/templates: unchanged, still noindex, out of the map. The four preview pages
  are byte-identical.
- Checks: full build order; all 17 `tools/verify-*.js` pass; `node --test` 42/42; `review-checks --base origin/main
  --build` 9/9 PASS (sitemap: 203 indexable, all in the map); headless 390 px: museum, Delphi, Qumran, Newgrange,
  pilgrimage list: 0 page errors, no sideways scroll, robots/canonical as intended.

## Needs Carter
Item 4 — the Museum and the 10 open walks are hidden from Google on purpose. Should they show up in search?
- **a** — Yes, list them (built, ready for review). *Recommended*: they are finished, public, and the walk treated
  their absence as a defect.
- **b** — No, keep them hidden; item 4 closes as "by design".

On **a**: open the PR, independent review by a run that wrote none of it, GitHub green incl. Lighthouse, merge per item.
