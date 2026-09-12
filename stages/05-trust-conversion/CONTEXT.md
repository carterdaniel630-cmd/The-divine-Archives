# Stage 5 — Trust / Conversion (final stage)

**Track:** Site Overhaul (getconexto.com). **Branch:** `claude/site-overhaul-stage5` (off `main`).
**Status:** ✅ Built, verified, deployed to production. Completes the overhaul.

## What shipped (all on the home page + one serverless function)

### 1. Trust section — the methodology promise, made prominent
The home page's method block gains three explicit **trust pillars** with icons — **Real sources,
always** (primary texts + current scholarship, never memory or invented citations), **Disputes
named, not settled** (debates laid out, not quietly resolved), **Gaps admitted** (each chapter
closes with what is supported, what is not, and what is unknown) — plus the sharpened line that a
claim being *sacred to believers* and a claim being *historically verified* are different
statements. Links through to the full Methodology page.

### 2. Email capture — visible, honest, serverless
A new **"New chapters, as the ink dries"** invite band with an email form. It POSTs to a **Cloudflare
Pages Function** (`docs/functions/api/subscribe.js` → `/api/subscribe`) that ships with the site — no
third-party account required. Features: email validation (client + server), a hidden **honeypot**
against bots, and — crucially — it **never fakes a subscription**: until a KV store is bound it
returns `not_configured` and the form tells visitors "the list isn't open just yet." An optional
`SUBSCRIBE_WEBHOOK` env var forwards addresses to a provider if set.

### 3. Ko-fi support — real weight
A dedicated support callout beside the email form ("free to read and independent… help keep the candle
lit") with a proper **Support the Archive** button (the archive's `.support` button style), and Ko-fi
added to the primary footer nav across the site — no longer a lone link.

## Files
- **New:** `docs/functions/api/subscribe.js` (Pages Function), `stages/05-trust-conversion/CONTEXT.md`.
- **Modified:** `docs/index.html` (trust pillars, invite/support band, CSS, subscribe script).
  (Footer Compare/Random/Ko-fi links landed in Stage 4's shared footers.)

## Verification
- Function parses as an ES module (`node --check --input-type=module`).
- Home page: trust-pillars ×1 with 3 pillars, invite band, form (email + honeypot), two Ko-fi
  references; `<section>` tags balanced; full-site crawl **67 links / 0 broken**.
- Form UX states exercised in code: valid → "You're on the list"; unconfigured → "isn't open yet";
  invalid/error → clear retry message. Reuses the already-render-verified search-input and card styles.

## ⚠️ Founder-lane — one step to turn email capture ON
The form and function are live, but addresses are only **stored** once you bind a KV namespace:
1. Cloudflare dashboard → the **the-divine-archives** Pages project → **Settings → Functions →
   KV namespace bindings**.
2. Create a KV namespace (e.g. `divine-archives-subscribers`) and bind it with the variable name
   **`SUBSCRIBERS`**. Redeploy (any push, or "Retry deployment").
3. (Optional) add a `SUBSCRIBE_WEBHOOK` env var to also forward sign-ups to Buttondown/ConvertKit/etc.

Until then the form is honest ("the list isn't open just yet"), so nothing is lost or faked.

Also still open from earlier stages: submit `getconexto.com/sitemap.xml` in **Google Search Console**.

## Overhaul complete
Stages 0–5 are all in production, plus the ch45 Pistis Sophia chapter. See each `stages/*/CONTEXT.md`.
