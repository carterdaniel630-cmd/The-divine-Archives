# Run 2026-11-02 ~02:45 UTC: honesty completions bundle, items 1-3 built (PR #112, draft)

Order: `handoff/order-2026-11-01-honesty-completions-bundle.md` (Carter's yes 2026-11-01 20:27 ET = per-item yes for the bundle).
Branch `loop/honesty-bundle` **`73958d2`** (parent `main` `5daa7f4`). Built by session_01HFWzTpBWfUwJGGYkbAnkF4, so that
session must not do the independent review.

## What was built
1. **Newgrange flip.** Why "#94's flip did not take": there never was one. #94's merge gate says "Newgrange stays a noindex
   preview with the pending-review tag" (`2026-11-01-pr94-merge-gate.md`). Now `status: "live"` in
   `docs/assets/pilgrimage-data.js`: Open · walk it + Enter link + pending tag on `pilgrimage.html`; its page becomes
   canonical and enters the sitemap (#110 logic); the museum's portal lists it (cache key `pilgrimage-data.js?v=4`);
   `framework/registry/site.json` rebuilt. **Count: 11 open sites, not the order's 10** (10 were already live without Newgrange).
2. **Great Pyramid parity: NOT REPRODUCED on `main`.** `docs/pilgrimage/great-pyramid.html` has the same "Skip to the text
   version" link (line 30) and the same h1/h2/h3 as Borobudur: all eleven pages come from one template in `build-pages.js`.
   atlas's fetch most likely missed the link because the Great Pyramid's share-image tags push it further down the page
   (inferred). The one real difference: it has no site-specific "note" on what is approximate; the default text is used.
   Writing one is new sourced content, so it is not in this PR. **Found instead and fixed (class c honesty/typo):** its
   Back-to-the-museum stop read "step back into the museumstep back into the museum's Rotunda, beside its own golden
   archrsquo;s entrance hall" (a botched replace in `9e6d1de`); now "the museum's entrance hall, beside its own golden arch".
3. **The Guide's stop texts in the text version (all open sites).** New `tools/pilgrimage-guide-text.mjs` loads each open
   site's module in Node (bare `three` resolved to the vendored file, nothing stubbed) and prints the Guide's data;
   `build-pages.js` calls it once and renders, in the text version, the sections with their blurbs, each stop with labels
   (contested / approximate etc.), text, links and sources, relics with holder/date and Vault link, then "About this model".
   Golden-portal stops (`v-door`, `v-back`) are left out: they describe 3D navigation only. Previews (Stonehenge, Ararat,
   Golgotha) are unchanged apart from the CSS cache key. Headings now h1 > h2 > h3. CSS added in `pilgrimage.css` (v=3).
   Making the text version reachable while 3D runs is fix batch item 7, NOT this PR.
4. **Symbols lazy-load: NOT BUILT this run.** It touches all twelve games and the game-runtime CI; a later run adds it to this
   same branch (one bundle, one review), with before/after weights.

## Checks (on `73958d2`)
- Full build order (stamp-dates → build-sky) + `build-entity-registry.js`: output committed.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings (9,348 internal links resolve; sitemap 204/204).
- Every `tools/verify-*.js`: OK. `node --test framework/test/*.test.js`: 42 pass, 0 fail.
- Headless 360 px, with and without WebGL, all 11 open sites + Stonehenge: no sideways scroll, 0 page errors (the only console
  error is the sandbox's blocked font host). No-WebGL stop counts: Newgrange 19, Great Pyramid 35, Göbekli 18, Delphi 24,
  Alexandria 11, Qumran 16, Persepolis 19, Mogao 15, Borobudur 15, Angkor 21, Chichén Itzá 17. With WebGL the text version
  stays hidden as before. The Newgrange card on `pilgrimage.html` at 360 px shows Open + pending + Enter.
- graphify CLI not installed in this run; not used (the code touched was read directly).

## Needs, in order
1. A later run builds item 4 on `loop/honesty-bundle`, then marks PR #112 ready.
2. Independent review by a run that wrote none of it (not session ..WzTpAhoVEY9mHq6DBzuy... nor this one, ..WzTpBWfUwJGGYkbAnkF4).
3. GitHub green incl. Lighthouse on the final head; then fast-forward per item on Carter's bundle yes.
