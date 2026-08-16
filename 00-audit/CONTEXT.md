# 00-audit / CONTEXT.md — Divine Archives Full-Build Audit

**STATUS: 🟡 READY FOR REVIEW** — audit pass 1 (backlog) complete; **remediation pass applied** the Do-now bucket + the missing-uploads gap on 2026-08-16.

- **Date:** 2026-08-16 (audit) · 2026-08-16 (remediation)
- **Auditor:** Claude (automated pass, measured where possible)
- **Scope:** Production (`main`) and preview branch (`claude/divine-archives-status-images-w5l0fk`)
- **Deliverable:** this file + the fixes logged directly below.

---

## Resolution log — remediation pass (2026-08-16)

Applied on approval ("move forward on everything; fill in gaps"). All changes validated: every JS file passes `node --check`, all 9 pages structurally intact, sitemap well-formed XML, internal-link crawl still clean, all skip-link targets resolve.

**Gap filled (missed uploads):**
- ✅ **21 missing `/sources/` citation logs created** (ch01–ch21). Only ch22–24 had them; the sourcing standard requires one per chapter. Each was **materialized from the chapter's own published Sources section** (no fabrication) — the repo now has complete 24/24 citation-log coverage.

**Do-now backlog cleared:**
- ✅ F2.2 Open Graph + Twitter Card tags — all 9 pages
- ✅ F2.3 `sitemap.xml` — 39 URLs (6 pages + 9 eras + 24 chapters)
- ✅ F2.5 `rel=canonical` — all 9 pages
- ✅ F2.6 `robots.txt` (+ sitemap reference)
- ✅ F2.7 `404.html` meta description
- ✅ F4.1 skip-to-content links + focus-visible CSS — all 9 pages, targets verified
- ✅ F8.3 `_headers` — `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, asset cache-control *(CSP deliberately omitted for now — the pages use inline `<style>`, so a strict CSP needs testing; tracked under Do-next)*
- ✅ F8.4 ambient audio flipped to **default-OFF (opt-in)**
- ✅ F2.4 JSON-LD — **partial**: `WebSite` + `Organization` on the home page (per-chapter `Article` schema is bundled into the prerender item below)
- ⚠️ F8.2 stale preview branch — **delete attempted but refused by the remote** (this environment's push path rejects branch deletions; retried 3×, consistent failure — not transient). **Needs a one-click manual delete** of `claude/divine-archives-status-images-w5l0fk` in the GitHub UI.

**Reclassified:**
- ⏭️ F1.2 (defer scripts) — **won't-do**: the content scripts already load at end-of-body, so `defer` adds ~zero benefit here; not worth the change.

**Deferred — needs a browser-tested pass, your input, or the dashboard (unchanged):**
- F1.1 split the 404 KB `chapters.js` monolith, and F2.1 prerender static per-chapter pages (with per-chapter OG/canonical/Article) — both are **architectural changes to the render path that I can't verify blind** (sandbox egress blocks any live browser check); they belong in a dedicated pass where the result can be loaded and confirmed.
- F5.1 import the real master outline (needs your authoritative version) · F5.2 clear the 3 pending chapters (your review gate) · F8.1 `www` resolution (Cloudflare dashboard) · F3.3 external link-rot (needs a live link-checker / CI) · F4.3 contrast + F6.1/6.2/6.3 visual items (needs-human-eyes) · F5.3 roadmap entries (parked).

---

## ⚠️ Two limitations on this pass (read first)

1. **The audit brief was not recoverable.** `/mnt/user-data/outputs/divine-archives-audit-brief.md` does not exist in this environment, nor anywhere on disk, in the repo, or in git history (containers start fresh per session, so a file saved in another session does not persist). The **8 categories below are therefore inferred**, not taken from your brief. Method is exactly as you specified (measure > assert; Impact × Confidence ÷ Effort; Do now / Do next / Park). If your brief used a different cut, findings remap cleanly — the underlying measurements are category-agnostic. **Confirm or correct the category set.**

2. **Outbound network is blocked in this sandbox.** `curl`, `WebFetch`, and direct HTTP all return `403` from the egress proxy for every external host (Wikipedia, Britannica, and `getconexto.com` itself). So three things **could not be measured here** and are tagged `needs-live-tooling`: (a) real load times / Lighthouse, (b) external citation link-rot, (c) live `www` DNS resolution. Everything else was measured directly against the code.

**Tags used:** `measured` (verified from the build), `needs-live-tooling` (requires a browser/link-checker outside this sandbox), `needs-human-eyes` (visual/UX judgment).

---

## Scoring model

`Score = Impact (1–5) × Confidence (1–5) ÷ Effort (1–5)` — higher = higher leverage. Range 0.2 – 25.0.
Effort is *implementation* effort for the fix (1 = trivial, 5 = large).

---

## Category findings

### 1 — Performance & load
| ID | Finding | Evidence | Tag |
|---|---|---|---|
| F1.1 | **`chapters.js` is a 404 KB monolith loaded whole on every chapter page.** All 24 chapter bodies ship to read one chapter; grows unbounded as the archive fills out (9 eras planned). | `assets/chapters.js` = 413,722 bytes; `chapter.html` loads it entire | measured |
| F1.2 | **Content scripts aren't deferred.** `data.js`, `chapters.js`, `plates.js`, `archive.js` load without `defer`/`async` (they're at end-of-body, so impact is modest, but parse of 404 KB still blocks interactivity). | `chapter.html:52–55` | measured |
| F1.3 ✅ | **Strength: fully self-contained, zero external requests.** No web fonts, no CDN, no binary media — all imagery is inline SVG. Excellent for privacy, resilience, and no render-blocking third parties. | 0 external `src`/`@font-face`/`@import`; 0 `<img>` | measured |
| F1.4 | Live load-time / Core Web Vitals not measurable here. | egress blocked | needs-live-tooling |

### 2 — SEO & structured data
| ID | Finding | Evidence | Tag |
|---|---|---|---|
| F2.1 | **Chapters/eras are JS-rendered from query params (`chapter.html?id=chNN`) with a generic static `<title>`/description and no `<noscript>`.** `archive.js` sets `document.title` client-side, but the crawlable HTML for all 24 chapters is identical ("A Chapter — The Divine Archives" / "A chapter of the archive."). Non-JS scrapers and social unfurlers see 24 identical, empty pages. | `chapter.html` title/desc static; `archive.js:185` sets title in JS; 0 `<noscript>` | measured |
| F2.2 | **Zero Open Graph / Twitter Card tags site-wide.** Every shared link unfurls as a bare URL with no image/title/description. | `og:`=0, `twitter:`=0 on all 9 pages | measured |
| F2.3 | **No `sitemap.xml`.** With query-param routing, crawlers can't discover individual chapters at all. | file absent | measured |
| F2.4 | **No structured data (JSON-LD).** No `Article` / `WebSite` / `BreadcrumbList` schema — no rich-result eligibility. | `application/ld+json`=0 | measured |
| F2.5 | **No `rel=canonical`.** Query-param URLs risk duplicate-content dilution. | 0 across pages | measured |
| F2.6 | **No `robots.txt`.** | file absent | measured |
| F2.7 | **`404.html` has no meta description.** | `desc`=0 on 404 only | measured |
| F2.8 ✅ | **Strength: unique, descriptive meta descriptions and titles on all 8 content pages; `<html lang>` on all 9.** | 8/8 unique descriptions | measured |

### 3 — Link & citation integrity
| ID | Finding | Evidence | Tag |
|---|---|---|---|
| F3.1 ✅ | **Strength: no broken internal links.** Every referenced `.html` target exists; no dangling `reading-room` refs after that page's deletion. | crawl of all `*.html`/`*.js` | measured |
| F3.2 ✅ | **Strength: perfect data↔render integrity.** All 24 `data.js` chapter IDs have a matching `chapters.js` body; no orphans, no blank-render IDs. | `comm` diff = empty both ways | measured |
| F3.3 | **157 external citation links (10 reputable hosts: Wikipedia 66, Britannica 27, WorldHistory 8, Stanford SEP 7, Iranica/Encyclopedia.com 4 ea, IEP 3, …). Liveness NOT verifiable here.** Link-rot would erode the evidence-honesty promise. Run a link-checker in CI. | egress blocked | needs-live-tooling |

### 4 — Accessibility
| ID | Finding | Evidence | Tag |
|---|---|---|---|
| F4.1 | **No skip-to-content link on any page.** | 0 skip links | measured |
| F4.2 | **Interpretive plates are `aria-hidden` (decorative), so AT users get nothing from the "image-forward" artwork** — mitigated by visible captions, but the imagery conveys meaning. | 33 `aria-hidden` SVGs | measured / needs-human-eyes |
| F4.3 | **Color contrast (gold on dark parchment) not verified.** Needs a contrast checker against WCAG AA. | palette in `archive.css` | needs-human-eyes |
| F4.4 ✅ | **Strength: solid a11y baseline** — viewport on all pages, `lang` set, `aria-label`/`aria-pressed` on the audio control, one `<h1>` per page. | measured | measured |

### 5 — Content integrity & placeholders
| ID | Finding | Evidence | Tag |
|---|---|---|---|
| F5.1 | **`outline/master-outline.md` is still the PLACEHOLDER stub.** Its own header says "replace with the chat-provided master outline"; the authoritative outline was never imported. Status board is hand-maintained instead. | `grep PLACEHOLDER` = 1 | measured / needs-Carter-input |
| F5.2 | **3 chapters live but unreviewed (ch22 Patristic, ch23 Norse, ch24 Tantra) carry `pending: true`** — awaiting your batch sign-off per the review gate. By design, but it's the open governance item. | `pending: true`=3 | measured / needs-Carter-input |
| F5.3 | **No "in preparation" roadmap entries on the live site** for unwritten traditions (README implied forthcoming ones would show). Browsing shows only the 24 published. | 0 real `planned`/`draft` entries in `data.js` | measured |
| F5.4 ✅ | **Strength: no lorem/TODO/placeholder text anywhere in published content.** | grep clean | measured |

### 6 — Design & visual consistency  *(inherently visual — mostly needs-human-eyes)*
| ID | Finding | Evidence | Tag |
|---|---|---|---|
| F6.1 | **Only 3 `@media` queries in 16 KB of CSS** — responsive coverage may be thin on small screens; verify chapter reading + home gallery on mobile. | `archive.css` | needs-human-eyes |
| F6.2 | **24 hand-authored SVG plates + per-era emblems** — visual quality/consistency and the new Sri Yantra/Mjölnir plates can't be judged from code. | `plates.js`, `emblems.js` | needs-human-eyes |
| F6.3 | **Image-forward overhaul (home gallery, framed plates, tradition tiles) framing/spacing** — verify it "looks right" across breakpoints. | preview merged to main | needs-human-eyes |

### 7 — Sourcing & evidence-honesty compliance *(per CLAUDE.md)*
| ID | Finding | Evidence | Tag |
|---|---|---|---|
| F7.1 ✅ | **Strength: 100% compliance with the evidence-honesty format.** All 24 chapters carry both a Sources block and the supported / not-supported / open triad. | 24/24/24/24 | measured |
| F7.2 ✅ | **Strength: citations point to reputable reference/scholarly hosts; no fabricated-looking sources detected.** (Liveness still = F3.3.) | host inventory | measured |
| F7.3 | Accuracy of the 3 pending chapters is unverified by a human — same item as F5.2. | — | needs-Carter-input |

### 8 — Technical & build health
| ID | Finding | Evidence | Tag |
|---|---|---|---|
| F8.1 | **`www.getconexto.com` unverified.** `CNAME` is apex-only (`getconexto.com`); no `_redirects` for `www→apex`. Resolution depends on out-of-repo Cloudflare config. | `docs/CNAME`; no `_redirects` | needs-live-tooling / needs-human-eyes |
| F8.2 | **Preview branch is stale.** `images-w5l0fk` (`5c7a7fe`) is now *behind* `main`; its `preview.*` deploy no longer represents anything newer than production. Prune or re-cut it. | `git log main..preview` = empty | measured |
| F8.3 | **No `_headers` file** → no security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`) and no cache-control tuning; relies on Cloudflare defaults. | file absent | measured |
| F8.4 | **Ambient audio autoplays ON by default** (absent `da-music` key = play; starts on first interaction where autoplay is blocked). Surprise audio is a common UX/a11y objection — but this was a deliberate design choice, so it's a judgment call, not a defect. Recommend default-off with a discoverable toggle. | `ambient.js:305,393` | measured / needs-human-eyes |
| F8.5 ✅ | **Strength: deploy pipeline is green and self-contained;** last 3 `main` deploys succeeded; manual `workflow_dispatch` preview target exists (`preview.the-divine-archives.pages.dev`). | Actions history | measured |

---

## Master ranked backlog (by leverage score)

| Rank | ID | Finding (short) | Impact | Conf | Effort | Score | Bucket |
|---|---|---|---|---|---|---|---|
| 1 | F5.2 | Clear/return the 3 pending chapters (review gate) | 3 | 5 | 1 | **15.0** | Do now* |
| 2 | F8.4 | Default ambient audio to OFF | 3 | 4 | 1 | **12.0** | Do now† |
| 3 | F2.2 | Add Open Graph / Twitter Card tags | 4 | 5 | 2 | **10.0** | Do now |
| 4 | F2.6 | Add `robots.txt` | 2 | 5 | 1 | **10.0** | Do now |
| 5 | F4.1 | Add skip-to-content link | 2 | 5 | 1 | **10.0** | Do now |
| 6 | F8.2 | Prune/re-cut stale preview branch | 2 | 5 | 1 | **10.0** | Do now |
| 7 | F1.2 | Add `defer` to content scripts | 2 | 4 | 1 | **8.0** | Do now |
| 8 | F2.3 | Generate `sitemap.xml` | 3 | 5 | 2 | **7.5** | Do now |
| 9 | F5.1 | Import the real master outline | 3 | 5 | 2 | **7.5** | Do next* |
| 10 | F1.1 | Split `chapters.js` monolith (per-chapter/era fetch) | 4 | 5 | 3 | **6.7** | Do next |
| 11 | F8.1 | Verify/fix `www` resolution | 4 | 3 | 2 | **6.0** | Do next† |
| 12 | F2.1 | Prerender/static per-chapter pages (crawlability) | 5 | 4 | 4 | **5.0** | Do next |
| 13 | F2.4 | Add JSON-LD (Article/WebSite/Breadcrumb) | 3 | 5 | 3 | **5.0** | Do next |
| 14 | F2.7 | Add meta description to `404.html` | 1 | 5 | 1 | **5.0** | Do now |
| 15 | F3.3 | Add CI external-link checker (link-rot) | 3 | 3 | 2 | **4.5** | Do next‡ |
| 16 | F2.5 | Add `rel=canonical` | 2 | 4 | 2 | **4.0** | Do next |
| 17 | F8.3 | Add `_headers` (security + cache) | 2 | 4 | 2 | **4.0** | Do next |
| 18 | F4.3 | Verify color contrast vs WCAG AA | 3 | 2 | 2 | **3.0** | Do next† |
| 19 | F4.2 | Plate a11y (meaningful imagery hidden) | 2 | 3 | 2 | **3.0** | Park† |
| 20 | F5.3 | Add "in preparation" roadmap entries | 2 | 4 | 3 | **2.7** | Park |
| 21 | F6.1 | Verify responsive/mobile coverage | 3 | 2 | 3 | **2.0** | Do next† |
| 22 | F6.2 | Review plate/emblem visual consistency | 3 | 2 | 3 | **2.0** | Park† |

`*` needs Carter input/decision · `†` needs-human-eyes · `‡` needs-live-tooling.
Positive/clean findings (F1.3, F2.8, F3.1, F3.2, F4.4, F5.4, F7.1, F7.2, F8.5) are recorded above and need no action.

### Buckets
- **Do now** (high leverage, low effort): F5.2, F8.4, F2.2, F2.6, F4.1, F8.2, F1.2, F2.3, F2.7.
- **Do next** (higher effort or needs input/eyes): F5.1, F1.1, F8.1, F2.1, F2.4, F3.3, F2.5, F8.3, F4.3, F6.1.
- **Park** (low leverage for now): F4.2, F5.3, F6.2.

---

## Highest-leverage moves (summary)

- **Fix discoverability — it's the biggest gap by far.** The site is invisible to social sharing (zero OG/Twitter tags) and weakly crawlable (JS-only rendering, generic per-chapter `<title>`, no sitemap, no schema). The cheap wins — OG tags, `sitemap.xml`, `robots.txt`, `404` description — are a single small pass (F2.2/F2.3/F2.6/F2.7); the durable fix is prerendering per-chapter pages (F2.1).
- **Clear the review gate (F5.2) and import the real outline (F5.1).** Three chapters are live-but-unreviewed and the master outline is still a stub — both need *you*, and both are cheap once you act.
- **Split the 404 KB `chapters.js` monolith (F1.1)** before the archive grows further; today every chapter page downloads all 24 chapters to show one.
- **Two one-line hygiene fixes:** prune the stale preview branch (F8.2) and `defer` the content scripts (F1.2).
- **One judgment call for you (F8.4):** ambient audio autoplays ON by default — the most likely first-impression UX complaint; recommend flipping to default-off. Needs your eye, not a defect.

**No changes were made. Awaiting your review of this backlog and confirmation of the (inferred) category set before any fix work begins.**
