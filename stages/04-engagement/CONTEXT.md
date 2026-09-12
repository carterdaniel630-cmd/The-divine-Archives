# Stage 4 — Engagement Features

**Track:** Site Overhaul (getconexto.com). **Branch:** `claude/site-overhaul-stage4` (off `main`).
**Status:** ✅ Built, render-checked, deployed to production.

## What shipped

### 1. Theme-comparison view — `compare.html` ("The Flood, Side by Side")
A genuine side-by-side of the deluge myth across **five traditions** (Mesopotamian, Hebrew,
Islamic, Greek, Hindu) as a comparison table: rows are *the survivor / warned by / the vessel /
landfall & sign / earliest text*; each column header links to that tradition's chapter. Includes a
"soon" switcher for the other three comparative themes (Creation, Underworld, Dying-and-Returning
God), and an **evidence-honesty box** on where the pattern breaks (China's Yu the Great tames the
flood; Egypt's Book of the Heavenly Cow) — matching the project's standard. All content is drawn from
the **already-published, already-sourced Flood chapter (ch01)**, not newly invented. Linked from the
Flood card on `themes.html` ("⇄ Compare side by side") and site nav/footers.

### 2. Random-chapter discovery — `random.html`
A `noindex` page that fetches `search-index.json`, picks a random published chapter, and redirects
(graceful fallback to `eras.html`). Surfaced as "✦ Open a chapter at random" on the homepage (beside
the timeline) and "Random Chapter" in footers.

### 3. Per-chapter PDF — print stylesheet + "Save as PDF"
Each chapter page gets a **Save as PDF** button (native `window.print()`), plus a full `@media print`
stylesheet in `archive.css`: light ink-friendly paper, chrome/nav/see-also hidden, the plate and
evidence box re-tinted for print, and a **print-only source line** ("From The Divine Archives · <url>")
so a printed/saved scroll carries its provenance. Honest "take the scroll with you" with zero new
dependencies; works in every browser's Save-as-PDF.

## Files
- **New:** `docs/compare.html`, `docs/random.html`, `stages/04-engagement/CONTEXT.md`.
- **Modified:** `docs/assets/archive.css` (print styles, `.print-btn`, `.print-only`),
  `tools/build-chapters.js` (print button + print-only line + footer links), `tools/build-pages.js`
  (Flood→compare link, `compare.html` in sitemap, footer links), `docs/index.html` (random link +
  footer), and the regenerated chapter/era/listing pages + sitemap (61 URLs).

## Verification
- Headless-Chromium render of `compare.html`: table, switcher, honesty box, dividers all correct.
- Chapter pages carry the print button + print-only line; `@media print` validated in CSS.
- Full-site crawl: **67 unique internal links across 66 pages — 0 broken.** Builds idempotent,
  `node --check` clean.

## Notes
- Comparison is currently the Flood (the one theme with a written chapter); the switcher is scaffolded
  for the other three, which light up when those chapters exist.
- "Real" pre-generated PDF files (vs. browser Save-as-PDF) remain a future option if wanted.
