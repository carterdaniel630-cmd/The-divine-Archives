# A.T.L.E. — Control Dashboard

**A True Legacy Entertainment** · the parent company. This is the **single page you check.**
Your review is the only manual step; everything else is (being) automated. Updated 2026-08-19.

> New here? 5-minute catch-up: `00-audit/atle-restructure-audit.md` §4 (CEO Map).
> Automation plan awaiting your approval: `00-audit/atle-automation-proposal.md`.

---

## 🔴 Founder-only to-do (nothing else needs you)
The confirmed list — these unblock everything downstream:
- [ ] **1. Business entity + EIN** (+ business bank) — also unblocks KDP verification
- [ ] **2. Payment processor** (needs #1) — **Stripe:** confirm a fresh account (old one is on Polsia);
      **PayPal:** gather + clear its specific blocker
- [x] **3. Shopify store + Printify** — ✅ stack confirmed (storefront + fulfilment, per-brand
      collections). *Remaining:* pricing/SKUs + list the 10 products (no products live yet)
- [ ] **4. PDF library topic list** (hand to CC — Gumroad is the confirmed home)

*30-second check (not urgent):* **ICM Batch I** — those Divine Archives chapters show as
`published` on the live site, but the batch doc (`icm/BATCH-I-READY-FOR-REVIEW.md`) still reads
"awaiting approval." Confirm the gate was cleared (doc is stale) vs. something skipped review.
I left the doc unchanged pending your word.

---

## 🔎 Verified vs. Unverified (ground truth)

Rebuilt on **what the repo actually proves**, not assumptions. Outbound network is blocked here,
so even the live site can only be verified as *built + deploy-green*, not confirmed by loading it.

**✅ VERIFIED from the repo (fact):**
- **Cloudflare deploy** is the **only** wired automation — `.github/workflows/deploy.yml`, and prior
  audit shows deploys green ⇒ its two secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) are set.
- **Domain** `getconexto.com` (`docs/CNAME`) — Divine Archives only.
- **Ko-fi** page `ko-fi.com/divinearchives` — linked site-wide (the one live monetization link).
- **Divine Archives content**: 42 chapters built, 42 static pages, 17 flagged `pending: true`.
- **Merch**: `05-merch/` is drafted through review; **no store, no product IDs, Buy Button = TODO**.
- **No agents/automation** beyond the deploy Action. No API keys/handles for any other service
  are committed anywhere.

**🟩 CONFIRMED BY CARTER (2026-08-19 — his word, not repo-checkable):**
- **✅ POD discrepancy RESOLVED — not a conflict.** **One Shopify store = storefront; Printify =
  fulfilment behind it.** Collections split per brand (Divine Archives, Pip's Orchard), scalable
  for future lines. "Printify only" and "Shopify (POD)" describe the *same* stack. *(Live product
  status still per repo: no products listed yet, Buy Button = TODO.)*
- **✅ Gumroad** — account set up as the **digital storefront for the PDF library**. Uploads
  **manual only** — no automation, **no live listings yet**. Has a public API ⇒ automation candidate.
- **✅ Ko-fi** — `ko-fi.com/divinearchives` confirmed live & correct (the one live monetization
  touchpoint). A second Ko-fi for Pip's Orchard: **unknown**.

**⛔ BLOCKED — founder-gated (confirmed blocked, not just missing):**
- **Amazon KDP** — account exists but blocked by (1) submission formatting issues + (2) bank/account
  **verification incomplete**. Gated behind the **business entity/EIN + business bank** item — treat
  as downstream of that, not a standalone fix.
- **Stripe** — existing account is tied to **Polsia** (deprioritised). Carter believes a **fresh,
  independent Stripe** is needed but **has NOT confirmed** — ⚠️ needs his final decision before treated as decided.
- **PayPal** — blocked for a **separate, unrelated** reason to Stripe. **Specific blocker not yet gathered.**

**❓ STILL OPEN (unanswered):**
- **TikTok** ×2, **Facebook** ×2, **YouTube** ×2 — brand, handle/URL, live status for each.
- **Email platform** — no ESP chosen; candidate sending addresses are `clipyield26@gmail.com` or a
  Pip's Orchard address (a Gmail is not an email platform — no Mailchimp/ConvertKit/etc. selected).
- **PayPal** specific blocker · second **Ko-fi** (Pip's Orchard) status.
- getconexto.com serving live (network blocked here); Pip's Orchard books/social presence (not in repo).

## 📋 Account status checklist (updated 2026-08-19 — Carter answering incrementally)

No passwords/keys — status + non-sensitive IDs only.

- **Shopify (POD)** — ✅ **confirmed stack:** single Shopify store (storefront) + **Printify**
  fulfilment; per-brand collections. Live products: none yet. · store URL: _still needed_
- **Gumroad** — ✅ **set up** as PDF-library storefront · manual uploads, **no live listings yet** ·
  profile URL: _still needed_
- **Amazon KDP** — ⛔ **blocked:** formatting + bank/account verification incomplete → gated behind entity/EIN
- **PayPal** — ⛔ **blocked** (reason separate from Stripe) · specific error: _still needed_
- **Stripe** — ⛔ **blocked:** old account tied to Polsia; fresh independent account likely needed ·
  ⚠️ _needs Carter's final confirmation_
- **Ko-fi** — ✅ `ko-fi.com/divinearchives` live & correct · second (Pip's Orchard) Ko-fi? _unknown_
- **TikTok (page 1)** — brand: ____ · @handle/URL: ____ · live? ____ · followers: ____
- **TikTok (page 2)** — brand: ____ · @handle/URL: ____ · live / still pending repurposing? ____
- **Facebook (page 1)** — brand: ____ · page URL: ____ · live? ____
- **Facebook (page 2)** — brand: ____ · page URL: ____ · live / pending? ____
- **YouTube (channel 1)** — brand: ____ · channel URL: ____ · live? ____
- **YouTube (channel 2)** — brand: ____ · channel URL: ____ · live / pending? ____
- **Email platform** — ❓ none chosen · candidate addresses: `clipyield26@gmail.com` / a Pip's
  Orchard address · ESP (Mailchimp/ConvertKit/…): not selected · signup live anywhere? no

---

## 🟢🟡🔵 Brand & pillar status
*(✅ = repo-verified · 📣 = Carter-reported, not repo-verified)*

| Pillar | Status | One-liner |
|---|---|---|
| **Divine Archives** (site) | 🟢 Live ✅ | 42 chapters built, deploy green; 17 pending your sign-off |
| **Pip's Orchard** (books + social) | 🟢 Live 📣 | KDP + TikTok/FB/YouTube per your word; ~125-quote bank ✅. Handles unconfirmed → checklist |
| **Merch** (Pip + DA) | 🟡 Partial ✅ | 10 products designed; stack confirmed (Shopify store + Printify fulfilment, per-brand collections); **no products listed yet** |
| **How-to / survivability PDFs** | 🔵 Planned | home confirmed = **Gumroad** (set up, manual, no listings yet); content starts on your topic list |
| **Future gaming** | 🔵 Planned | parked |
| **Shared infra** (entity, payments, email, analytics) | ⛔ Gaps | **KDP + Stripe founder-blocked** (entity/EIN + fresh-Stripe decision); PayPal blocked; no ESP chosen |

**Most broken flywheel edge:** Pip has an audience but no store link → **no way to buy** (Phase 1).
*Repo-verified as broken; the audience side is Carter-reported.*

---

## ✅ Your review queues (the only thing you approve)
| Queue | Waiting on you | Where |
|---|---|---|
| **Divine Archives chapters** | 17 `pending: true` (ch26–ch42) | `docs/assets/data.js` |
| **Merch stage** | whole `05-merch` batch: sign-off + sacred-symbol OK (DA-03/05) | `05-merch/CONTEXT.md` |
| **Automation architecture** | approve the map → I build Phase 1 | `00-audit/atle-automation-proposal.md` |
| **Pip raster art** | upload real sheets → `05-merch/pip-reference/` | (schematic stands in) |

---

## 🤖 Automation rollout (proposal — nothing wired yet)
| Phase | Wires up | Gate |
|---|---|---|
| 0 — now | Rename ✅ · Dashboard ✅ · Proposal ✅ | **Approve the map** |
| 1 — Commerce spine | Shopify+Printify, list products, `/shop` live, bio links | Founder #1–3 |
| 2 — Distribution | Social scheduler → Pip card pipeline | pick scheduler |
| 3 — Content pipeline | Scheduled drafting + publish-approved + PDF pillar | Founder #4 |
| 4 — Measurement | Analytics + sales metrics + email list | pick tools |

Full detail + agent map: `00-audit/atle-automation-proposal.md`.

---

## 🔗 Key locations
- **Live site:** getconexto.com · **Deploy:** `/.github/workflows/deploy.yml` (Cloudflare Pages, green)
- **Divine Archives content:** `eras/`, `themes/`, `docs/` · **content index/gate:** `docs/assets/data.js`
- **Merch stage:** `05-merch/` (briefs, copy, mockups, `/shop` draft, Pip reference + quote bank)
- **Audit report:** `00-audit/atle-restructure-audit.md` · **Automation proposal:** `00-audit/atle-automation-proposal.md`

---

## Notes on this rename/restructure (done vs. deliberately not done)
- **Done:** the 3 umbrella "The Orchard → A.T.L.E." references (in `05-merch/`). ICM kept as the
  workflow name. "Pip's Orchard" (sub-brand) and the Kabbalah "orchard/pardes" content untouched.
- **NOT done (needs your call, per audit §0):** re-rooting the repo/root docs under A.T.L.E. The
  repo is still named `The-divine-Archives` and root `CLAUDE.md`/`README.md` still frame Divine
  Archives as top-level. **Decision brief with 3 options + recommendation:**
  `00-audit/atle-restructure-options.md` — pick A (recommended), B, or C and I'll execute.
