# A.T.L.E. — Control Dashboard

**A True Legacy Entertainment** · the parent company. This is the **single page you check.**
Your review is the only manual step; everything else is (being) automated. Updated 2026-08-19.

> New here? 5-minute catch-up: `00-audit/atle-restructure-audit.md` §4 (CEO Map).
> Automation plan awaiting your approval: `00-audit/atle-automation-proposal.md`.

---

## 🔴 Founder-only to-do (nothing else needs you)
The confirmed list — these unblock everything downstream:
- [ ] **1. Business entity + EIN**
- [ ] **2. Payment processor** (needs #1)
- [ ] **3. Printify + Shopify accounts** (+ pricing/SKUs for the 10 merch products)
- [ ] **4. PDF library topic list** (hand to CC to start that pillar)

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

**❓ UNVERIFIED — Carter-reported or assumed, NOT provable from the repo:**
- getconexto.com actually serving live (network blocked); Divine Archives books, and the Pip's
  Orchard **books, TikTok, Facebook, YouTube** — none appear in the repo. Taken from your word.
- **The whole account/payment/POD stack below.** ⚠️ **Discrepancy to reconcile:** the merch stage is
  locked to **"Printify only,"** but the account list names **"Shopify (POD)" + Gumroad + PayPal +
  Stripe.** Which is the real fulfilment path (Printify app inside Shopify? Gumroad for the PDFs?)
  is **unconfirmed** — see the checklist.

## 📋 Account status checklist (Carter answers inline — status + non-sensitive IDs only)

No passwords/keys — just **is it set up, the public URL/handle, and any blocker.**

**Shopify (POD)** — [ ] set up / registered only / not started · store URL: ____ · which POD app
(Printify? other)? ____ · does this replace or sit alongside "Printify only"? ____
**Gumroad** — [ ] set up / registered / not started · profile URL: ____ · selling what (PDFs? merch?): ____
**Amazon KDP** — [ ] live / registered · author or book URL(s): ____ · how many titles live: ____
**PayPal** — [ ] working / **blocked** · if blocked, what exact error/message shows? ____ · business or personal: ____
**Stripe** — [ ] active / registered / not started · connected to (Shopify? Gumroad? nothing yet): ____
**Ko-fi** — repo shows `ko-fi.com/divinearchives`. [ ] correct & live? · any second Ko-fi (Pip's Orchard)? URL: ____
**TikTok (page 1)** — brand: ____ · @handle/URL: ____ · [ ] live · followers ballpark: ____
**TikTok (page 2)** — brand: ____ · @handle/URL: ____ · [ ] live / **still pending repurposing**: ____
**Facebook (page 1)** — brand: ____ · page URL: ____ · [ ] live
**Facebook (page 2)** — brand: ____ · page URL: ____ · [ ] live / pending: ____
**YouTube (channel 1)** — brand: ____ · channel URL: ____ · [ ] live
**YouTube (channel 2)** — brand: ____ · channel URL: ____ · [ ] live / pending: ____
**Email platform** — [ ] chosen (which?) ____ / none yet · list exists? [ ] yes / no · signup live anywhere? ____

---

## 🟢🟡🔵 Brand & pillar status
*(✅ = repo-verified · 📣 = Carter-reported, not repo-verified)*

| Pillar | Status | One-liner |
|---|---|---|
| **Divine Archives** (site) | 🟢 Live ✅ | 42 chapters built, deploy green; 17 pending your sign-off |
| **Pip's Orchard** (books + social) | 🟢 Live 📣 | KDP + TikTok/FB/YouTube per your word; ~125-quote bank ✅. Handles unconfirmed → checklist |
| **Merch** (Pip + DA) | 🟡 Partial ✅ | 10 products designed; **no store yet**; POD path unconfirmed (Printify vs Shopify-POD) |
| **How-to / survivability PDFs** | 🔵 Planned ✅ | starts when you send the topic list (Gumroad likely home?) |
| **Future gaming** | 🔵 Planned | parked |
| **Shared infra** (entity, payments, email, analytics) | ⛔ Gaps | see founder list + checklist |

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
  Archives as top-level. Say the word and I'll draft the A.T.L.E. top-level docs / restructure.
