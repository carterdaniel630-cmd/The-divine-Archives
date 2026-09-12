# Stage 3 — Visual Design: the Candlelit Scroll

**Track:** Site Overhaul (getconexto.com). **Branch:** `claude/site-overhaul-stage3` (off `main`).
**Status:** ✅ Direction approved via preview artifact; built, render-checked, deployed to production.

## Approval path
A design-direction preview was published as an artifact
(`claude.ai/code/artifact/660ee716-8248-402f-bf9a-745d926ddd25`) showing the treatment on three
archetypes before/after; Carter approved ("deploy").

## What shipped — a single stylesheet pass (`docs/assets/archive.css`)
Every page already links `archive.css`, so the whole change is one file — no page edits, no rebuild,
no link changes. The site was *already* a committed warm-dark theme with a vignette and paper grain;
Stage 3 intensifies it into "an old scroll by candlelight":

- **Real manuscript type (the biggest upgrade).** Loads **Cinzel** (Roman inscriptional capitals —
  titles/nav), **Cormorant Garamond** (section headings, drop caps), and **EB Garamond** (body) via a
  Google Fonts `@import`. Previously `--font-display: "Trajan Pro"` fell back to Georgia for nearly
  every visitor; now the intended letterforms actually load.
- **Illuminated drop capital** on each chapter's opening paragraph (`#chapter-mount .article .lead`).
- **Inked fleuron flourish** (a small gold diamond-and-rules SVG) above every chapter section heading,
  replacing the plain top rule; section headings move to Cormorant in lit gold.
- **Scorched dividers** — the "see also" and chapter-nav bands get a burnt-ember wavy divider (drawn as
  a background SVG so flex layouts keep their shape).
- **Candle-flicker** — the existing edge vignette now breathes with a slow opacity flicker.
- **Scroll-unfurl** — a chapter's article unrolls once on load (`scaleY`), like opening a scroll.
- **Palette nudge** — warmer ground, aged-ivory `--parchment`, brighter gold, and new `--ember` tokens.
- **Motion respected** — `prefers-reduced-motion` disables the flicker and the unfurl.

## Verification (headless Chromium render of the local build)
Screenshotted home, a chapter (ch45), an era (Late Antiquity), and a listing. Confirmed: drop cap and
per-section flourishes render on chapters; candlelit ground, vignette, breadcrumbs, tiles, badges and
emblems all intact; no layout breakage. (Google Fonts don't load inside the sandbox, so the shots show
the *serif fallback*; the real site loads Cinzel/Cormorant/EB Garamond — no CSP blocks them.)

## Files
- **Modified:** `docs/assets/archive.css` (tokens + `@import` fonts + flicker + drop cap + flourish +
  scorched dividers + unfurl + reduced-motion). **New:** this CONTEXT.

## Notes
- The homepage masthead (`index.html` inline CSS, a pre-existing `92vh` hero) was left as-is; only its
  palette tokens shifted. It reads correctly in Cinzel on the live site.
- Future polish, if wanted: revisit the `92vh` masthead height, and a per-tradition landing page.
