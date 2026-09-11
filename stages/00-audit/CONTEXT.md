# Stage 0 — Ground-Truth Audit

**Track:** Site Overhaul (getconexto.com) — a *technical/site* ICM track, kept separate from the
existing *content* ICM under `/icm/` and the prior content audit at `/00-audit/`.
**Status:** ✅ Audit complete — **STOP for human review before any Stage 1 code.**
**Branch:** `claude/pistis-sophia-research-8ytkke` (a feature branch; does **not** trigger the
production deploy — see "Deploy topology" below). *Branch-naming decision flagged for Carter below.*
**Method:** Direct inspection of the committed repo + raw-HTML content tests (no headless browser).

---

## 1. How the site is actually built and served

| Aspect | Finding |
|---|---|
| Stack | **Plain static HTML + vanilla JS.** No framework, no bundler, no CSS preprocessor. |
| Served directory | **`/docs`** (Cloudflare Pages output dir). Custom domain **getconexto.com** (`docs/CNAME`). |
| CI build step | **None.** CI does not run any generator — it deploys the committed `/docs` as-is. |
| Data layer | `docs/assets/data.js` → `window.ARCHIVE` (`eras[]`, comparative `themes[]`, `chapters[]`). Plus `chapters.js` (`CHAPTERS[id].html`, the rendered chapter bodies), `plates.js` (per-chapter SVG plates), `emblems.js` (per-era emblems). |
| Rendering engine | `docs/assets/archive.js` (renderEra / renderTraditions / renderChapter) + **per-page inline `<script>`** (homepage era spine; eras `#ages`; themes `#themes-list`). `ambient.js` is decorative (deferred). |
| Local build tools (run by hand, output committed) | `tools/build-chapters.js` — prerenders `docs/chapters/chNN.html` from data.js + chapters.js + plates.js (this is why chapter pages *are* static). `tools/md-to-chapter.js` — converts a chapter `.md` into a `chapters.js` block (but the committed blocks are hand-curated, not raw tool output). |
| Source of record | Long-form chapter prose lives in `/eras/**.md` and `/sources/**.md`; the website shows a curated, condensed HTML version in `chapters.js`. |

### Deploy topology (important for the "never deploy without approval" rule)
- `.github/workflows/deploy.yml`: **`on: push: branches: [main]`** → `wrangler pages deploy docs`
  to Cloudflare Pages project `the-divine-archives` (production-branch = `main`).
- `workflow_dispatch` (manual) deploys to a **`preview`** alias
  (`preview.the-divine-archives.pages.dev`) — a safe lane to test branch work without touching prod.
- **The branch that triggers production = `main`.** Our working branch does **not**. Safe.
- ⚠️ **`main` does not currently exist on the remote.** The only remote branches are
  `claude/session-start-ikztvo` (remote default HEAD) and `claude/pistis-sophia-research-8ytkke`.
  So the auto-deploy-to-prod path may be dormant/unverified. **Founder-lane item** — see §5.

---

## 2. Full page inventory & rendering method

**Test applied:** grep the *raw committed HTML* for known content strings (e.g. era names, tradition
names, chapter body text). "Present" = a plain HTTP fetch / curl would return the content. "JS-mounted"
= the raw HTML ships an empty container that only fills after JavaScript runs.

### ✅ Static — content present in raw HTML (indexable as-is)
| Page(s) | Method | Per-page meta | Structured data |
|---|---|---|---|
| `docs/chapters/ch01–ch43.html` (43 pages) | Prerendered by `build-chapters.js` | ✅ title/desc/OG/Twitter/canonical | ✅ `Article` JSON-LD |
| `about.html` | Hand-written static `<main class="article">` | ✅ | — |
| `methodology.html` | Hand-written static `<main class="article">` | ✅ | — |
| `404.html` | Static | n/a | — |
| `chapter.html` | **`noindex` legacy redirect** → `/chapters/<id>.html` (intentional; not a problem) | n/a | — |

*Verification samples:* `chapters/ch43.html` contains "Askew" ×8; `methodology.html` contains body
text. Both return content on a plain fetch.

### ❌ JS-mounted — empty to a plain fetch (indexing risk; Stage 1 targets)
| Page | Empty container | Filled by | Raw-HTML content test |
|---|---|---|---|
| `index.html` | `#spine` (era listing) | inline `<script>` from `window.ARCHIVE` | "Bronze Age" → **0 matches** (masthead/title *are* baked; the era grid is not) |
| `eras.html` | `#ages` | inline `<script>` | "Late Antiquity" / "Bronze Age" → **0 / 0** |
| `themes.html` | `#themes-list` | inline `<script>` | "The Flood" → **0** |
| `traditions.html` | `#traditions-mount` | `archive.js` `renderTraditions()` | "Gnosticism" → **0** |
| `era.html?era=<slug>` | `#era-mount` | `archive.js` `renderEra()` | any era name → **0** |

---

## 3. Indexing / SEO problems found (flagged, ranked)

1. **[HIGH] Five page types render empty to non-JS crawlers.** `index` (listing grid), `eras`,
   `themes`, `traditions`, and all `era.html?era=` pages ship empty containers. Search engines that
   don't execute JS (and social unfurlers, which never do) see no content. *This is the core problem
   Stage 1 must fix — pre-render this content into the served HTML from the same `data.js` source.*

2. **[HIGH] `era.html` is one physical file serving 9 different eras, with shared meta and a
   query-stripped canonical.** All 9 `era.html?era=X` URLs carry the **same** static
   `<title>` ("An Age — The Divine Archives"), the **same** description, and
   `<link rel="canonical" href="https://getconexto.com/era.html">` — i.e. every era page tells Google
   it is a duplicate of a single, era-less, **empty** page. The 9 eras need real, per-era static pages
   (e.g. `/eras/<slug>.html`) with their own content, meta, and canonical.

3. **[HIGH] `sitemap.xml` is hand-maintained and already stale.** 57 URLs, but it **stops at
   `ch42` — the new `ch43` (Pistis Sophia) is missing.** It also lists the JS-empty pages and
   query-string `era.html?era=` URLs (which, per #1–#2, are empty/duplicate). It has no `<lastmod>`.
   *Needs a generator driven by `data.js` so it can never drift again, and so it points at the real
   (to-be-static) era URLs.*

4. **[MED] No per-tradition pages exist.** "Browse by Tradition" is a single JS-empty listing;
   individual traditions are only reachable as chapter pages. There is no `/traditions/<slug>.html`.
   (Partly IA/Stage 2, but it affects what the sitemap can honestly list.)

5. **[LOW] Structured data coverage is partial.** `Article` JSON-LD on chapter pages ✅; `WebSite`
   + `Organization` on the homepage ✅; listing/era pages have none. `BreadcrumbList` is absent
   everywhere (ties into Stage 2 breadcrumbs).

6. **[LOW / forward-looking, Stage 2] Homepage search is title-only.** `wireSearch()` just redirects
   to `traditions.html?q=`, which filters tradition *names* — it does **not** query chapter body text.
   Noted here because the user asked; belongs to Stage 2.

### Things that are already fine (no action needed)
- `robots.txt`: `User-agent: * / Allow: /` + `Sitemap:` reference. ✅
- `_headers`: sensible security headers (nosniff, DENY frame, referrer policy, permissions policy) +
  `Cache-Control` on `/assets/*`. ✅
- Chapter pages: fully static, per-page meta, canonical, and `Article` JSON-LD already correct. ✅
- `chapter.html` `noindex` redirect: correct handling of the legacy `?id=` route. ✅

---

## 4. What Stage 1 will do (preview only — NOT started; awaiting approval)

- Pre-render the five JS-mounted page types into static HTML at build time from `data.js`
  (smallest viable approach: extend the existing `tools/` build so `eras`, `themes`, `traditions`,
  and **per-era** pages are generated the same way chapter pages already are — no new framework).
- Replace the single `era.html` with real per-era static pages carrying per-era meta + canonical.
- Add a **sitemap generator** driven by `data.js` (covers home, eras, per-era, themes, traditions,
  all chapters incl. ch43); reference it from `robots.txt` (already referenced).
- Confirm/adjust per-page meta/OG/Twitter on the newly static pages.
- Extend `Article`/add `BreadcrumbList` structured data where feasible.
- **Verification for every "fixed" page: raw `curl`/fetch output showing the content is in the HTML.**

*The exact generation approach (extend the vanilla `tools/` scripts vs. introduce a tiny SSG) is a
decision I will bring to you at the top of Stage 1 for sign-off before implementing, per your rules.*

---

## 5. Founder-lane items (handed to Carter — not worked around)

- **Google Search Console**: no credentials in the repo. Please share current indexing status
  (coverage report, which pages are indexed/excluded) or grant access. This tells us whether the
  empty pages are already hurting us.
- **Production deploy branch (`main`) does not exist on the remote yet.** Please confirm how
  getconexto.com is currently being deployed (is the Pages project live and pointed at this repo? is
  `main` expected to be created?). This determines how we safely ship Stage 1.
- **Cloudflare secrets** (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`): confirm they're set in
  repo Actions secrets, so the deploy workflow actually runs when we're cleared to ship.
- **Branch-naming decision:** this overhaul is currently on `claude/pistis-sophia-research-8ytkke`
  (where the just-finished chapter work lives). Do you want the overhaul moved to a dedicated branch
  (e.g. `claude/site-overhaul`)? I'm constrained to a designated branch this session, so this is your
  call — I'll keep batching here unless you say otherwise.

---

## 6. Review gate

**STOP.** No Stage 1 code has been written. Awaiting your review of this audit and your decision on:
(a) the Stage 1 generation approach, (b) the founder-lane items above, and (c) the branch question.
Nothing here has been deployed.
