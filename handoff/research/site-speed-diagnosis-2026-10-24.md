# Site speed: diagnosis from the repo (2026-10-24)

Answers `handoff/site-speed-finding.md` (Muse's spider, 2026-10-18: 3.67 s average, 42 pages over 5 s, Codex Mendoza
slowest at 9.32 s). **Prepare only. Nothing here is built or live.** Every fix below is a site change and waits on
Carter's go for that specific fix. Cloudflare-side settings are Carter-only and are not touched.

## How it was measured
- Every page on `main` (`09f48b3`, 204 pages) loaded in a headless browser at phone size from a local copy, counting
  every file the page pulls in. Outside hosts (Google Fonts, the libraries that hold manuscripts) are blocked in this
  sandbox, so their cost is **not** in the numbers: they only add to it.
- The live site could not be reached from this sandbox (the network proxy refuses it), so **server response time
  was not measured here**. Sizes below are what the page downloads, raw and compressed (Cloudflare compresses text).

## What the numbers say
| Group | Pages | Average download (raw) |
|---|---|---|
| Chapters | 83 | 127 KB |
| Home, Vault index | — | 100–190 KB |
| Vault item pages | 88 | **750 KB** |
| Pilgrimage 3D sites, museum | ~12 | 0.9–1.5 MB (3D library; expected for 3D) |

99 of 204 pages are over 500 KB; 9 are over 1 MB. Chapters are light. The weight sits in the Vault pages.

## Causes found, biggest first

1. **Codex Mendoza (and two others) load a whole manuscript from another institution as the page opens.**
   `docs/assets/vault/study.js` line 581 calls `load(study.manifest)` immediately. For three Vault items the manifest
   is on an outside server: Codex Mendoza (Bodleian, Oxford), Codex Borgia (Vatican Library) and the Voynich Manuscript (Yale). The
   page then waits on that server for the image list and the first page's image tiles. That matches the slowest page
   in Muse's measurement. **This is not our server being slow; it is the holding institution's server, on page open.**

2. **Every Vault page downloads the manuscript viewer, though 85 of 88 never use it.** All 88 Vault pages load
   OpenSeadragon (241 KB raw, 57 KB compressed). Only the three items above have a manuscript to show; the rest show the
   viewer only if a reader pastes their own link.

3. **Every Vault page downloads the data for all 88 entries** (`vault-data.js`, 205 KB raw, 68 KB compressed) to show
   one entry.

4. **Every page waits on Google Fonts before drawing text.** 186 pages link the Google Fonts stylesheet in the head,
   which blocks drawing until a second outside host answers. Some of these fonts are already in the repo as files
   (`tools/data/fonts/`: Cinzel and Cormorant Garamond at weight 500, used for share cards); the site also uses
   weights 400 and 600 and EB Garamond, which would need adding (all are open-licence fonts). A crawler timing "page loaded" includes
   this wait on every page, which would look like a slow server, page after page.

5. **Search downloads its whole index at once** (`search-index.json`, 720 KB raw, 261 KB compressed).

6. Three Egyptian Vault pages load a 390 KB hieroglyph font. Needed for what they show; could load on demand. Small.

## Is it "server response time"?
Not shown by anything in the repo. The site is static files on Cloudflare Pages, which normally answer in well under a
second. The pattern Muse saw (slow page after page) fits causes 1 and 4 better: outside hosts the page waits on.
The `_headers` caching is sensible (assets cached a day, game code always revalidated). **To settle it**, the spider
would need to record time to first byte separately from full load; that is a Muse-side or Carter-side measurement.

## Proposed fixes (each needs Carter's go; listed by gain for effort)
- **A. Open the outside manuscript only when the reader reaches it or taps "Open the manuscript".** Fixes the
  slowest page. Small change in `study.js`. *Recommended first.*
- **B. Self-host the site's fonts** (some files already in the repo, the rest open-licence) and drop the Google Fonts link. Removes an outside
  wait from 186 pages and a third-party request on every visit. Medium change (all page templates; look must match).
- **C. Load the manuscript viewer only when it is used.** Saves 57 KB compressed on 85 Vault pages. Small.
- **D. Give each Vault page only its own entry's data.** Saves 68 KB compressed on 88 pages. Larger build change.
- **E. Load the search index on first keystroke**, or split it. Medium.

Each would go on its own `loop/*` branch with the usual checks, a before/after measurement and independent review.
