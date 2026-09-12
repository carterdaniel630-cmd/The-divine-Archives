# Stage 2 — Navigation / Information Architecture

**Track:** Site Overhaul (getconexto.com). **Branch:** `claude/site-overhaul-stage2` (off `main`).
**Status:** ✅ Built, verified, deployed to production (Carter: "auto. confirm. build and deploy").

## What shipped

### 1. Breadcrumbs
Added the `Archive / <section>` crumb (the same one chapter and era pages already carry) to the
three listing pages — `eras.html`, `themes.html`, `traditions.html`. Chapter and era pages also
carry `BreadcrumbList` JSON-LD from Stage 1.

### 2. "See also" cross-links inside chapters — **auto logic** (Carter chose auto-only)
`tools/build-chapters.js` now appends, below every chapter body, up to two data-driven bands:
- **"Other traditions of this age"** — the sibling tradition chapters in the same era.
- **"Comparative themes"** — the cross-era theme chapters (currently *The Flood*).
Fully derived from `data.js`; zero maintenance, no curation, no dead links. Theme chapters (no era)
show only the themes band. Styled with the existing `.tiles`/`.tile` system + a new `.see-also`
rule in `archive.css`.

### 3. Homepage search → real full-text content search
- `tools/build-pages.js` now emits `docs/assets/search-index.json` — every published chapter's
  title, era label, summary, **and plain-text body** (HTML stripped, capped ~3.2k chars).
- New `docs/search.html` (noindex) fetches that index and ranks matches (title ≫ summary ≫ body),
  showing each hit with its era and a highlighted snippet; reads `?q=` for deep links.
- The homepage search box now points to `search.html?q=` (was `traditions.html?q=`, which only
  filtered tradition *names*). `traditions.html` keeps its own name filter.

### 4. "Nine Ages" → visual timeline
Replaced the emblem grid on the homepage with a horizontal, scrollable chronological **timeline**:
nine era nodes on a connecting axis, each with a dot, emblem, era numeral, name, and dates, linking
to the per-era page. CSS-only (no heavy JS), data-driven from `data.js` via the `spine` build marker.

## Files
- **New:** `docs/search.html`, `docs/assets/search-index.json`, `stages/02-navigation-ia/CONTEXT.md`.
- **Modified:** `tools/build-chapters.js` (see-also generation; loads emblems.js), `tools/build-pages.js`
  (search index + search page + timeline fragment), `docs/assets/archive.js` (search box target),
  `docs/assets/archive.css` (`.see-also`), `docs/index.html` (timeline markup + CSS),
  `docs/eras.html` / `docs/themes.html` / `docs/traditions.html` (breadcrumbs), all 45 chapter pages
  rebuilt (see-also), listing pages/sitemap regenerated.

## Verification (plain HTTP fetch, no JS, served locally)
- Homepage timeline: 9 nodes, all linking to `eras/<slug>.html`. ✅
- Breadcrumbs present on eras/themes/traditions. ✅
- ch17 shows 2 see-also bands, linking to sibling ch45 (Pistis Sophia) and theme ch01. ✅
- `search-index.json`: 45 docs, includes body text (e.g. "Askew" from ch45). ✅
- `search.html` inline JS compiles clean; page returns 200. ✅
- Full-site crawl: 65 unique internal links across 64 pages — 0 broken. ✅
- All build tools `node --check` clean; builds idempotent.

## Notes / follow-ups
- `search.html` is `noindex` (a tool page, not content) and intentionally not in the sitemap.
- "See also" is auto-only by decision; a curated `related:` field could be layered on later without
  changing the auto fallback.
