# A.T.L.E. — Parent-Company Audit & Restructure Report

**A True Legacy Entertainment (A.T.L.E.)** — parent company. All else (The Orchard, Divine
Archives, Pip's Orchard, how-to/survivability PDFs, future gaming, merch) is a brand or product
line under it.

- **Type:** read-only audit. **Nothing was renamed, changed, or executed.**
- **Date:** 2026-08-19 · **Auditor:** Claude Code (measured against the repo where possible)
- **Scope:** the `The-divine-Archives` repo (all stages/folders) + what the repo documents about
  off-repo assets (KDP books, social channels, Shopify/Printify, DNS).
- **Method:** direct file/grep inspection. External/live systems (getconexto.com, TikTok,
  Amazon, Cloudflare, Shopify) can't be reached from here — those are marked *(off-repo / needs
  Carter to confirm)*.

---

## 0 — "The Orchard" umbrella-rename flags (decide, don't auto-apply)

You asked me to flag every place "The Orchard" is used as the **top-level umbrella**, so you can
decide what becomes A.T.L.E. vs. what stays a sub-brand. **Exactly three** literal instances, all
in the merch stage:

| # | File : line | Exact text | Note |
|---|---|---|---|
| 1 | `05-merch/CLAUDE.md:4` | "running under **The Orchard's** ICM (Idea → Content → Market) workflow" | Umbrella usage |
| 2 | `05-merch/CONTEXT.md:15` | "under **The Orchard's** ICM workflow" | Umbrella usage |
| 3 | `05-merch/mockups/mockups.html:68` | "**The Orchard** · ICM merch stage 05" (page eyebrow) | Umbrella usage; internal draft only, not deployed |

**Do NOT rename these — they are not the umbrella:**
- **"Pip's Orchard"** (34+ mentions across `05-merch/`) — a **sub-brand**, stays as-is.
- **"orchard" / "pardes"** in `eras/05-late-antiquity/ch19…`, `eras/07-high-medieval/ch26…`,
  `docs/assets/chapters.js`, `docs/chapters/ch26.html` — this is **Kabbalah content** (the
  "orchard" of mystical knowledge). Nothing to do with the company. Leave untouched.
- **"ICM"** as a methodology name (Idea → Content → Market) is separate from the brand "The
  Orchard." You can keep ICM as the process name even if "The Orchard" is retired or re-slotted.

**Bigger structural finding (needs your decision):**
- **"A.T.L.E." / "A True Legacy Entertainment" appears NOWHERE in the repo** (0 matches). The
  parent company currently has no identity, folder, or governing doc anywhere.
- The **root `CLAUDE.md` and `README.md` treat "The Divine Archives" as the whole project** (repo
  is literally named `The-divine-Archives`). Under the A.T.L.E. restructure, Divine Archives is
  now *one brand*, not the top. This is the real rename/restructure question — bigger than the 3
  "Orchard" strings: **do you re-root the repo/docs under an A.T.L.E. umbrella (monorepo with
  brand sub-folders), or keep brand-per-repo and add an A.T.L.E. "home" doc that points at each?**
  Flagged for your call; I changed nothing.

---

## 1 — Founder-Only To-Do List (blocked on a human)

Grouped by project. **Blocking** = nothing downstream proceeds without it. **Non-blocking** = can
wait / a workaround exists.

### A.T.L.E. (shared / parent-level)
- 🔴 **Blocking — Business entity + EIN.** Nothing in the repo; required before real payment
  processing, Printify payouts, and clean KDP/merch tax handling. Gates all revenue collection.
- 🔴 **Blocking — Payment processor** (Shopify Payments / Stripe / PayPal). Depends on the entity
  + a business bank account. Without it, no merch or storefront can take money.
- 🟡 **Non-blocking — Parent identity decision** (see §0): whether/how A.T.L.E. becomes the
  top-level in the repo and docs. Work continues under the current structure until you decide.
- 🟡 **Non-blocking — Email platform, analytics, content scheduler** (all absent; see Flywheel
  gaps). Needed to *grow*, not to *ship the next thing*.

### Divine Archives (content + website)
- 🟡 **Non-blocking — Clear the review gate:** **17 chapters carry `pending: true`** in
  `docs/assets/data.js` (ch26–ch42). They're live with a "pending review" badge; only *you* can
  clear them. Site works meanwhile.
- 🟡 **Non-blocking — Import the real master outline.** `outline/master-outline.md` is still the
  **PLACEHOLDER stub** (says so in its own header); needs your authoritative version. A
  hand-maintained board is standing in.
- 🟡 **Non-blocking — ICM Batch I approval.** `icm/BATCH-I-READY-FOR-REVIEW.md` presents Eras
  08/09/01 for your sign-off to merge to `main`. (Note: those chapters already appear
  `published` in `data.js`, so this may already be done — **confirm** whether Batch I is still an
  open gate or a stale doc.)
- 🟡 **Non-blocking — Delete stale preview branch** `claude/divine-archives-status-images-w5l0fk`
  (prior audit F8.2; the remote refused an automated delete — needs a one-click delete in the
  GitHub UI).
- 🟢 **Confirmed done (no action):** Cloudflare deploy secrets (`CLOUDFLARE_API_TOKEN`,
  `CLOUDFLARE_ACCOUNT_ID`) — deploys are green, so these are set.
- 🟡 **Non-blocking — `www` DNS** (prior audit F8.1): apex `getconexto.com` works; `www→apex`
  redirect unverified. Cloudflare-dashboard task.

### Merch (05-merch stage)
- 🔴 **Blocking — Printify account** + connect it to a Shopify store. No product can be fulfilled
  without it.
- 🔴 **Blocking — Shopify store + create the 10 products** → this is what produces the **live
  product IDs** the `/shop` Buy Button needs (currently a `TODO` placeholder).
- 🔴 **Blocking — Pricing / SKUs.** All 10 briefs list price/SKU as `TBD`; can't list without margins.
- 🟡 **Non-blocking — Upload the real Pip raster art** into `05-merch/pip-reference/` (the sheets
  came as chat images; I committed a *schematic* `pip-spec-card.svg` as a stand-in). Mockups are
  placement drafts; final art attaches at Printify time.
- 🟡 **Non-blocking — Sacred-symbol respectful-use sign-off** on DA-03 (runes) and DA-05 (Tree of
  Life / Dharmachakra). Only you can clear these SKUs.
- 🟡 **Non-blocking — Storefront/domain decision** for where Pip's Orchard sells (getconexto
  section? separate domain? Shopify storefront linked from socials?).
- 🟡 **Non-blocking — Human review gate for the whole stage** (nothing is "ready to list" until you clear it).

### Pip's Orchard (books + social)
- 🟡 **Non-blocking — Add a Shopify/store link** to the TikTok/YouTube/Facebook bios once a store
  exists (currently no funnel from audience → product; see Flywheel).
- 🟢 **Owned by you already:** the TikTok / Facebook / YouTube channels and the Amazon KDP books
  exist (off-repo — I can't see them, taken from your notes).

### How-to / survivability PDF library
- 🔴 **Blocking (to start the pillar) — the content itself doesn't exist yet.** No files, folder,
  or outline in the repo. This pillar is *decided but not started*; it needs your topic list /
  first title to begin.

### Future gaming content
- 🟡 **Non-blocking — parked.** Named as a future pillar; nothing to action yet.

---

## 2 — Full Flywheel Map (A.T.L.E.)

**Legend:** 🟢 Live · 🟡 Partial · 🔵 Planned · ⛔ Gap (cross-cutting infra missing)

### Pillars & nodes

| Pillar | Node | Status | Evidence / note |
|---|---|---|---|
| **Divine Archives** | Content (42 chapters) | 🟢 Live | 42 chapters in `data.js`; 42 static pages built |
| | Review gate | 🟡 Partial | 17 `pending: true` awaiting your sign-off |
| | Website (getconexto.com) | 🟢 Live | Cloudflare Pages auto-deploy; self-contained static site |
| | Master outline | 🟡 Partial | `outline/master-outline.md` still a PLACEHOLDER stub |
| | Monetization | 🔵 Planned | only a Ko-fi tip-jar link today; merch is the plan |
| **Pip's Orchard** | Books (Amazon KDP) | 🟢 Live | off-repo (your notes) |
| | TikTok / Facebook | 🟢 Live | off-repo; the quote-card content engine |
| | YouTube / Instagram | 🟡 Partial→🔵 | "future" per brief; presence not confirmed |
| | Merch (Pip line) | 🟡 Partial | 5 briefs + copy + mockups drafted; not listed |
| | Storefront | 🔵 Planned | no store; domain/placement undecided |
| **How-to / survivability PDFs** | Whole pillar | 🔵 Planned | nothing in repo yet |
| **Merch (shared)** | Product briefs + copy + mockups | 🟡 Partial | `05-merch/` complete through review; Printify-only |
| | Shopify store / product IDs | 🔵 Planned | needed for Buy Button (`TODO`) |
| | Printify fulfilment | 🔵 Planned | account not connected |
| | `/shop` page | 🟡 Partial | drafted in `05-merch/shop-page-draft/`, **not** deployed to `docs/` |
| **Future gaming** | Whole pillar | 🔵 Planned | named only |
| **Shared infra** | Business entity / EIN | ⛔ Gap | absent; gates revenue |
| | Payment processor | ⛔ Gap | absent; depends on entity |
| | Email platform / list | ⛔ Gap | no capture anywhere |
| | Analytics | ⛔ Gap | site is zero-external-request; no measurement |
| | Content scheduler | ⛔ Gap | social posting is manual |
| | CI/CD deploy | 🟢 Live | `/.github/workflows/deploy.yml` (Cloudflare Pages) |
| | Domain / DNS | 🟡 Partial | apex live; `www` redirect unverified; one domain, DA-only |

### Connection points (the flywheel edges — where the loop is broken)
- ⛔ **Pip's Orchard social → store:** no Shopify link in any TikTok/YouTube/Facebook bio (no
  store exists yet). The audience has nowhere to buy. **This is the single most broken edge.**
- ⛔ **Divine Archives site → merch:** `/shop` is drafted but **not deployed** and **not linked**
  in the site nav; Buy Button is a `TODO` pending live product IDs.
- ⛔ **Any audience → email list:** no newsletter/opt-in anywhere → no owned-audience retention
  loop; every view is one-and-done.
- ⛔ **Everything → analytics:** nothing is measured, so you can't see which loop works.
- 🟡 **Pip books ↔ social ↔ merch:** all exist as content but there's no funnel wiring them
  (book readers aren't routed to social; social isn't routed to books or merch).
- 🟡 **Divine Archives ↔ Pip's Orchard:** effectively two separate audiences; no cross-promotion
  and (per policy) different tones — fine, but note there's no shared "A.T.L.E." top that presents
  them as one company.

---

## 3 — Working Agents Inventory

**Finding: there are no autonomous agents in this repo.** The "orchestrator / product-idea agent"
framing is conceptual — none of it exists as code, config, or a scheduled job.

| Thing | What it does | Where | Actually running? |
|---|---|---|---|
| **Cloudflare deploy** (`.github/workflows/deploy.yml`) | Auto-deploys `/docs` to Cloudflare Pages on push to `main`; manual `workflow_dispatch` → preview alias | repo root CI | ✅ **Running** (deploys green) |
| `tools/build-chapters.js` | Prerenders each published chapter to a static crawlable page | `tools/` | ⚙️ Manual CLI — run by hand, not scheduled |
| `tools/md-to-chapter.js` | Converts chapter markdown → `chapters.js` block | `tools/` | ⚙️ Manual CLI |
| **ICM "pipeline"** (`icm/`) | A **documentation/process** convention (stage folders + CONTEXT trackers) | `icm/` | 📄 Docs only — not an agent |
| **Claude Code** (this session) | Interactive build/audit work | whole repo | 👤 On-demand only; nothing scheduled/autonomous |

**No config for agents exists:** no `.claude/settings.json`, no hooks, no orchestrator, no
product/idea agent, no cron/scheduled automation beyond the deploy Action.

**Recommendation — lean is still right.** Don't build an orchestrator or a product-idea agent
yet; there's no throughput to justify one, and premature automation would add maintenance for
near-zero gain. The genuinely useful automations, in order, are:
1. **A content scheduler** for Pip's Orchard social — but that's a **SaaS tool** (Buffer/Metricool/
   Later), not a repo agent. Highest real leverage once posting cadence matters.
2. **A CI link-checker** for Divine Archives external citations (prior audit F3.3) — a small
   scheduled Action, worth it to protect the evidence-honesty promise as chapters grow.
3. Revisit a lightweight "new-PDF / new-chapter" scaffolding agent **only when** the PDF library
   is actually producing volume. Not now.

---

## 4 — CEO Map (plain English, 5-minute catch-up)

**What A.T.L.E. is.** A True Legacy Entertainment is the holding company — the name over the door.
By itself it sells nothing; it *owns* a set of brands that each make and sell content.

**What it owns, today, in plain terms:**
- **The Divine Archives** — a finished, genuinely impressive reference website on world religion
  and mythology (42 chapters, live at getconexto.com). It's the most *built* thing you have, but
  it currently earns nothing beyond a tip jar.
- **Pip's Orchard** — a wholesome mascot brand (Pip, the little onion) that already has an
  audience: TikTok/Facebook/YouTube posting kindness quote-cards, plus children's books on Amazon.
  This is the most *commercial* thing you have — it has attention, which is the hard part.
- **A merch line** (for both brands, print-on-demand via Printify → Shopify) — fully designed on
  paper (10 products, copy, mockups) but **not yet a real store**.
- **Two pillars that are decided but empty:** a how-to/survivability PDF library, and future
  gaming content.

**How money is supposed to flow:** audience shows up for free content (Pip's quote-cards on
social, the Divine Archives site, the PDFs) → some of them buy something (a Pip mug or tee, a
Divine Archives print, a survivability PDF, a book) → that revenue funds more content → which
grows the audience. Classic content flywheel. **Right now that flywheel doesn't turn, because the
"→ buy something" arrow doesn't exist yet:** there's no store, no product IDs, no payment
processor, and no link from the audience (social bios) to anywhere they can spend money. You have
the two hardest pieces — real content and a real audience — and you're missing the cheap plumbing
in between.

**The single biggest lever right now:** **stand up the store and connect it to the audience you
already have.** Concretely — form the business entity, open Shopify + Printify, list the Pip
products, and put the store link in the Pip's Orchard TikTok bio. Pip already has eyeballs; every
day without a "buy" link is traffic you can't convert. Everything else (clearing the review gate,
the PDF library, gaming, analytics) is real but secondary to closing that one gap.

---

## 5 — Ready-for-Next-Steps Checklist (this week)

Ranked by impact ÷ effort. **This is a plan, not an action — nothing here has been executed.**

### 🧑 Carter does this (only a human can)
| # | Action | Why it's top | Effort |
|---|---|---|---|
| 1 | **Form the business entity + get an EIN** | Unblocks *all* revenue (Shopify, Printify, taxes) | Med |
| 2 | **Open Shopify + Printify, connect them** | The missing flywheel edge; enables product IDs | Med |
| 3 | **Set merch pricing + SKUs** (feed me margins and I'll fill the briefs) | Unblocks listing | Low |
| 4 | **Put a store link in the Pip's Orchard TikTok/YouTube/FB bios** (once store exists) | Converts the audience you already have | Low |
| 5 | **Decide the A.T.L.E. structure question** (§0) — umbrella in-repo or brand-home doc | Unblocks the rename/restructure | Low |
| 6 | **Sign off** the sacred-symbol SKUs (DA-03/05) + clear some of the 17 pending chapters | Unblocks merch SKUs + the review gate | Low |
| 7 | Upload the real Pip raster art into `pip-reference/`; delete the stale preview branch | Real mockups; repo hygiene | Low |

### 🤖 CC / Claude does this (on your go — not started)
| # | Action | Depends on | Effort |
|---|---|---|---|
| 1 | **Paste the live Shopify Buy Button + product IDs into `/shop`, then deploy `shop.html` → `docs/` and link it in the site nav** | Carter #2, #3 | Low |
| 2 | **Fill final pricing/SKUs into all 10 briefs + copy** | Carter #3 | Low |
| 3 | **Draft the A.T.L.E. top-level doc** (README/CLAUDE at the umbrella level) once you pick the structure | Carter #5 | Low |
| 4 | **Swap the schematic Pip for the real art** across `pip-reference/` + mockups | Carter #7 | Low |
| 5 | **Scaffold the how-to/survivability PDF pillar** (folder, template, first outline) on your topic list | your first title | Med |
| 6 | **Add a CI external-link checker** for Divine Archives citations (prior audit F3.3) | go-ahead | Low |
| 7 | **Add an email-capture block + analytics** to the site (pick tools first) | tool choice | Med |

---

*End of report. No files were renamed and no next-steps were executed — this is the review copy.*
