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

## 🟢🟡🔵 Brand & pillar status
| Pillar | Status | One-liner |
|---|---|---|
| **Divine Archives** (site) | 🟢 Live | 42 chapters live at getconexto.com; 17 pending your sign-off |
| **Pip's Orchard** (books + social) | 🟢 Live | KDP books + TikTok/FB/YouTube; ~125-quote bank ready |
| **Merch** (Pip + DA, Printify→Shopify) | 🟡 Partial | 10 products designed; **no store yet** (Phase 1) |
| **How-to / survivability PDFs** | 🔵 Planned | starts when you send the topic list |
| **Future gaming** | 🔵 Planned | parked |
| **Shared infra** (entity, payments, email, analytics) | ⛔ Gaps | see founder list + automation Phase 1/4 |

**Most broken flywheel edge:** Pip has an audience but no store link → **no way to buy.** Phase 1
fixes it.

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
