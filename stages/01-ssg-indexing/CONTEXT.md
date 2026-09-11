# Stage 1 — SSG / Indexing Fix

**Track:** Site Overhaul (getconexto.com). **Branch:** `claude/site-overhaul` (based on `origin/main`).
**Status:** ✅ Complete — **STOP for human review.** Nothing deployed; nothing merged.
**Approach (approved):** extend the existing vanilla `tools/` build to generate static output from
the same `data.js` source the JS uses. No framework introduced.

---

## Goal
Every page that lists or contains real content must have that content present in the **static HTML
response** — no page renders empty to a plain HTTP fetch (no headless browser).

## What was done

### 1. New generator: `tools/build-pages.js`
Companion to `tools/build-chapters.js`, same window-shim + template pattern. Reads
`docs/assets/data.js` (+ `emblems.js`, `plates.js`) — the single source of truth — and:
- **Injects baked HTML** between `<!--build:NAME:start/end-->` markers into the four JS-mounted
  listing pages: `index.html` (`#spine`), `eras.html` (`#ages`), `themes.html` (`#themes-list`),
  `traditions.html` (`#trad-list`). The markup is a byte-for-byte mirror of what the client JS
  produced, so nothing changes visually.
- **Writes 9 per-era static pages** to `docs/eras/<slug>.html`, each with its own
  `<title>`, description, canonical, OG/Twitter, and `BreadcrumbList` JSON-LD, replicating the old
  `renderEra()` output (tradition tiles + comparative-theme tiles).
- **Regenerates `docs/sitemap.xml`** from `data.js` (home, the four listings, `about`,
  `methodology`, 9 per-era pages, all 44 published chapters) — so it can never go stale by hand
  again. It is idempotent (a second run reports no changes).

### 2. Killed the "9 eras from one empty file" problem
`era.html` served all 9 eras via `?era=` with shared meta and a query-stripped canonical (every era
page told Google it was a duplicate of one empty page). Now:
- Real per-era pages live at `/eras/<slug>.html` with **distinct** title/canonical/OG (verified: 9
  unique titles, 9 unique canonicals).
- `era.html` is now a lightweight **`noindex` redirect** (mirrors the existing `chapter.html`
  pattern): old `?era=` links and bookmarks resolve to the new static page.

### 3. Progressive-enhancement, not JS-dependency
- The inline render scripts on `index`/`eras`/`themes` now **skip if the container is already
  prerendered** (`mount.firstElementChild` guard) — they remain only as a fallback; the served
  content is static.
- `traditions.html` no longer depends on `archive.js` to render; it ships the full tile list
  statically plus a small self-contained filter over the baked tiles (the homepage search box,
  which redirects to `traditions.html?q=`, still works).

### 4. Link hygiene + structured data
- Every internal `era.html?era=` / `chapter.html?id=` reference updated to the new static URLs,
  across `archive.js`, `build-chapters.js`, and the listing pages (repo-wide sweep: none remain
  outside the redirect shims).
- All 44 chapter pages rebuilt: back-nav/breadcrumb now point to `/eras/<slug>.html`, and each
  page now carries **both `Article` and `BreadcrumbList`** JSON-LD (previously Article only).

## Files changed
- **New:** `tools/build-pages.js`; `docs/eras/` (9 pages).
- **Modified:** `docs/index.html`, `docs/eras.html`, `docs/themes.html`, `docs/traditions.html`
  (markers + guards + link updates), `docs/era.html` (→ redirect), `docs/sitemap.xml`
  (regenerated), `docs/assets/archive.js` (link updates), `tools/build-chapters.js` (per-era links
  + breadcrumb JSON-LD), and all 44 `docs/chapters/chNN.html` (rebuilt).

## Verification (plain HTTP fetch, no JS — served locally via `python3 -m http.server docs`)
Content that Stage 0 measured as **0 matches** (empty) is now present in the raw HTML:

| Page (curl, no JS) | Check | Result |
|---|---|---|
| `eras.html` | contains "Late Antiquity" / "The Aztec" | ✅ present |
| `traditions.html` | contains "Gnosticism" / "The Inca" tile | ✅ present |
| `themes.html` | contains "The Flood" | ✅ present |
| `index.html` | contains "Bronze Age" (era spine) | ✅ present |
| `eras/05-late-antiquity.html` | 200; per-era title + canonical; "Gnosticism" tiles; BreadcrumbList | ✅ |
| `eras/*` (all 9) | distinct `<title>` and canonical | ✅ 9/9 unique |
| `chapters/ch17.html` | Article **and** BreadcrumbList JSON-LD; links to `eras/05-…html` | ✅ |
| `era.html` | `noindex` redirect shim | ✅ |
| `sitemap.xml` | 59 URLs; 9 per-era; ch44 present; 0 legacy `?era=` | ✅ |
| whole site | crawl of 64 unique internal links across 62 pages | ✅ 0 broken |

Build is idempotent (second `build-pages.js` run: no changes). All JS `node --check` clean.

## Notes / deferred to later stages
- The `traditions` filter now runs over the baked tiles; a fuller **content-search** (query chapter
  bodies, not just tradition names) is **Stage 2** as scoped.
- Visible breadcrumbs (a Stage 2 IA item) are not added yet — only the invisible `BreadcrumbList`
  structured data, which is an SEO win and belongs with this indexing pass.

## Review gate
**STOP.** Awaiting review of this diff + verification. Do not merge to `main` or deploy without
explicit "approved, deploy." Suggested safe preview: a manual `workflow_dispatch` run publishes to
the `preview` alias without touching production.
