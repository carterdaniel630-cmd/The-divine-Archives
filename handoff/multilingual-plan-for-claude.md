# Multilingual Plan for The Divine Archives — for Claude Code

**Status:** PINNED / DEFERRED (Carter, 2026-10-14). Keep everything in English for now. Prepared for staging. Claude to analyze when tokens renew and work resumes.
**Direction:** Learn from — never steal or copy — MrBeast's multilingual approach. Adapt what fits a solo operation; skip what needs his budget and team.

## Goal

Make the Archives readable in other languages — videos first, website second.

## What we learned (research, 2026-10-14)

- MrBeast Phase 1 (2021–2022): separate dubbed channels per language (Spanish first, July 2021; then Russian, Portuguese, French, Japanese, Hindi, Arabic).
- MrBeast Phase 2 (Dec 2022 →): one channel + multi-language audio tracks on the main channel; the separate channels stopped uploading. His reasoning: one channel beats twelve, because twelve channels need twelve thumbnails, replies, and uploads.
- **Verdict for us: SKIP Phase 1. ADAPT Phase 2** — one channel + multi-language audio tracks.
- Dubbing quality: human native voice actors beat AI on retention (vendor claim from a 2023 A/B test: ~51% vs ~19% — vendor claim, dated, not current fact). A robotic dub kills the hook.
- YouTube auto-dubbing is now free in 27 languages (YouTube Blog, Feb 2026). Use it with manual review ON, never blind.
- YouTube multi-language audio rolled out to millions (Sep 2025). Pair audio tracks with localized titles and descriptions.
- Sacred terms: transliteration + gloss, never equated with generic equivalents. Native-speaker review required.

## Scope

- **Videos:** daily 30-second shorts (current pipeline) + back catalog.
- **Website:** 80+ chapters, 88 Vault manuscripts, 199 Pantheon entries, 76 museum rooms, pilgrimage, games, UI strings.
- **NOT in Phase 1:** museum 3D text rebuild per language, games rebuild per language (note as Phase 3+).

## Plan

- **Phase 0 — Glossary + framework.** Locked glossary of sacred names/terms (transliteration + gloss, per language). i18n framework for the static site: language switcher, `/<lang>/` URLs, reciprocal hreflang, fonts including RTL (Arabic, Hebrew, Urdu) and CJK/Devanagari. The site is not yet public (DNS not pointed) — build i18n in BEFORE launch. Retrofitting costs more.
- **Phase 1 — Pilot (1 language first).** Pick the pilot language from the channel's own analytics (Spanish is the likely first candidate — confirm from data, do not assume). Videos: YouTube is the channel (Carter 2026-10-14) — multi-language audio tracks + localized titles/descriptions; share to Facebook somehow (mechanism TBD — Facebook has no dubbing/audio-track feature). Website: translate a small slice (homepage + 2–3 chapters) via AI draft + glossary + native reviewer. Prove the pipeline before expanding.
- **Phase 2 — Expand.** Add languages one at a time, each with a native reviewer. Do NOT do separate channels per language. Do NOT do a celebrity voice cast or studio pipeline.
- **Maintenance rule.** Every new chapter/video must be translated or the languages go stale. Every edit must be re-dubbed / re-translated everywhere. Budget for this forever — the site is ongoing, and so is this.

## Quality bar

- Machine/AI draft + glossary + native reviewer per language. No blind auto-publish.
- Sacred terms per the glossary. Scripture quotes: translations of scripture carry their own copyrights — legal review before any verbatim translated display ships (same rule as the existing translation-licensing caveat for primary sources).
- House voice carries across languages: respectful, wonder-first, stoic; no personal name, no URL. Whether the spoken sign-off ("The Divine Archives") stays in English or is localized is an open decision — do not assume.

## Open questions for Claude

- Exact word count of the site (measure from the repo) → firm cost/time.
- i18n framework choice for the static site (no CMS/backend).
- Museum 3D text + games: per-language approach (Phase 3).
- Shorts audio-track eligibility for the channel; auto-dubbing review workflow.
- Pilot-language confirmation from analytics.

## Sources

- Research briefs delivered 2026-10-14: "Short-Form Video Formats" and "Learning From MrBeast's Multilingual Approach."
- Research notes: `research_notes/viral-short-form-formats-2026-20261015-0136/` and `research_notes/mrbeast-multilingual-strategy-20261015-0149/`.
