# 2026-10-25 ~19:00–19:35 UTC — build loop: PR #53 fix run, part 2 (Göbekli Tepe)

**Item:** STATUS Next 1e, the fix run after the independent review of `befb607` (`2026-10-25-pr53-independent-review.md`).
One site this run: **Göbekli Tepe, every fixable finding, and review points 2 and 3 settled by sources.** Delphi and
Chichén Itzá are untouched and still open.

## What changed on `claude/project-thread-s3qxre` @ `2dd1158` (one commit on `8aab255`, no force-push)
`docs/pilgrimage/sites/gobekli-tepe/site.js`, `dims.js` (comments only), `sources/pilgrimage-gobekli-tepe.md`, generated registry.
- Hill: "collected thousands of flint tools" → slopes "clustered with flint"; stones taken for an Islamic cemetery,
  Schmidt's "tombstones" → T-pillars (DAI ?p=861); "at least twenty enclosures" cites the DAI geophysics post of
  18 July 2018 ("a minimum of 20").
- A and B: lettering in order found now sourced (A first 1996, B second); fox on **both** Pillars 9 and 10; "A more
  oval" dropped.
- Geometry: "their method has been questioned" dropped (no named critic found); flag now "One study's argument".
- Temple: **the missing "So fair a House" post found** (dainst.blog, 24 Jan 2017; no author named on the page, so the
  "J. Notroff" credit is dropped). Card re-worded to it, Clare 2020 (team's own "first temples" image; revision
  "unavoidable") and Dietrich et al. 2019, *PLOS ONE* (grinding tools mostly for cereals).
- **Sizes of C and D:** no measured plan found; *CWA* 53 says D is the largest, C the most impressive. "About twenty"
  and "about thirty metres" removed; the About card now says the model draws C wider than D (an estimate). Model
  geometry not changed.
- Central pair: "The pillars are beings" → the excavators read the T-shape as an abstract human body ("Losing your
  head", 2016); "spirits" dropped (they name ancestors or gods).
- Sky card: the cited reply answers Sweatman, not Magli; the card now says the excavators have not answered Magli
  directly and gives their general 2017 statements.
- Roof: "likely roofed" → a "significant possibility" (More than a vulture). Fill: "since 2019" → "in its summary of
  the 2015–2019 work". Opening: "did not yet farm" → no domesticated plants or animals (Clare 2020); Harran plain cites *CWA*.
- Moving: under 100 m to about 500 m; beams and wedges, sledges and planks (Dietrich 2016); "ropes, rollers" dropped.
Every source above was opened with a web fetch this run. Flags stay; preview/noindex/pending tags untouched.

## Checks on `2dd1158`
- Full build order + entity registry: only the registry changed (new source entries). 17/17 `verify-*.js`; 42/42 tests;
  `review-checks.js --base origin/main --build` 9 passed, 0 failed, 0 warnings (Göbekli Wikipedia share 0%).
- Headless phone 360 and 390, touch: page loads, no sideways scroll, canvas drawn, pending tag shown, site module has
  19 info points and no `undefined`; only console error is the blocked Google Fonts.
- Visual pass skill (frontend-design) not used: text-only change, no visual change.

## Still open on #53
Delphi (hymn panel, Pausanias, unsourced lines) and Chichén Itzá (decline date both views, sacrifice flag, Toltec
framing, equinox source). Then a fresh independent review by a run that made none of the fixes, checks green, then one
yes/no to Carter. Noted for the re-review: the model still draws C wider than D (said on the About card).

Items per run: 1. Not merged; nothing published.
