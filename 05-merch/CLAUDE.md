# 05-MERCH — Stage Instructions for Claude Code

## What this stage is
A merch production stage running under **The Orchard's ICM (Idea → Content → Market)
workflow**. It covers **two sub-brands sold from one Shopify store**:

- **The Divine Archives** — merch derived from the published comparative-religion
  archive (getconexto.com).
- **Pip's Orchard** — merch built around the original character **Pip**, a storybook
  orchard-spirit mascot.

This stage produces **product briefs, mockups, and draft copy**, plus a `/shop` page
draft for the Divine Archives static site. It **ends at human review**. Nothing in this
stage may be published, listed, marked "ready to list," or pushed live without Carter's
explicit sign-off (see **Review Gate** below).

## This is additive, not a restart
This stage sits alongside the existing content pipeline (`/eras`, `/themes`, `/docs`,
`/icm`). It does not modify, regenerate, or restructure any existing archive content.
The live site's chapters, data, and pages are inputs to this stage (for factual
grounding), never outputs of it.

## File structure
```
05-merch/
  CLAUDE.md                     <- this file (governs the stage)
  CONTEXT.md                    <- stage tracker + review state (ICM pattern)
  FLAGS.md                      <- open questions / missing info (READ THIS)
  product-briefs/
    divine-archives/            <- 5 Divine Archives product briefs
    pips-orchard/               <- 5 Pip's Orchard product briefs
  copy/                         <- draft title + description per product
  mockups/                      <- design mockups land here (see mockups/README.md)
  shop-page-draft/              <- /shop page draft for the static site
```

---

## NON-NEGOTIABLE #1 — CHARACTER CONSISTENCY (Pip's Orchard)

Every Pip asset **must** match the **locked character reference**. No drift, no
reinterpretation, no "artistic take." **The canonical reference is the art Carter supplied**
(the two golden-hour Pip social posts — "BE PROUD OF HOW FAR YOU'VE COME" and "BE THE
REASON SOMEONE SMILES"); see `pip-reference/REFERENCE.md`. Where this spec and those images
ever disagree, **the images win.**

**Locked Pip reference (canonical — from Carter's supplied art):**
- **Body:** a rounded **onion/bulb** silhouette (slightly taller than wide, soft-tapering
  toward the crown, wider rounded base), **chibi proportions** (oversized head-to-body
  ratio, small stubby limbs)
- **Skin/body:** warm **golden-brown / tan onion** color with subtle **papery onion-skin
  layering** (faint vertical striations, soft translucent highlights). This is **final**
  (Carter, 2026-08-18); the earlier "moss-green" brief is superseded — not moss-green.
- **Sprout:** a small **green leafy sprout/tuft** at the crown (2–3 tiny leaves) — the only
  green on the character
- **Eyes:** very **large, round, glossy**, dark with **warm amber-gold reflections** and
  bright catchlights; highly expressive
- **Face:** rosy **blushed cheeks**, tiny gentle mouth, no prominent nose
- **Limbs:** short stubby arms and legs, small rounded hands and **bare feet**
- **Style:** **painterly storybook** illustration, soft edges, warm palette, gentle rim light
- **Lighting/setting:** **golden-hour** warmth in natural outdoor scenes (rolling hills, a
  path, grassy meadows, butterflies)
- **Brand voice** (from the supplied posts): wholesome, gentle, **encouraging / kindness-
  and-positivity** themed

> ✅ **Color: FINAL — brown/golden onion** (Carter confirmed 2026-08-18). The earlier
> "moss-green" description is retired. No longer an open question.

**RETIRED / FORBIDDEN concept — reject on sight:**
- The old **seed-being / root-system** Pip (a sprouting seed, trailing roots, a
  root-network body, seedling/sapling forms). This concept is **retired**. Any design
  that drifts toward it — roots, seed-pod body, tendrils instead of the small green
  sprout, a germinating-seed silhouette — is **rejected**, not revised into shape.

**Hard rule:** **Every Pip asset is flagged for human review BEFORE it is used on any
product mockup.** Order of operations is: draft Pip art → flag for human review →
(on approval) use on a mockup → mockup goes to the stage Review Gate. A Pip design may
never skip straight to a mockup. If any of the six locked traits above is absent,
ambiguous, or contradicted, do not use the asset — flag it in `FLAGS.md` and hold.

---

## NON-NEGOTIABLE #2 — FACTUAL GROUNDING (Divine Archives)

Any product **copy, symbol, or imagery** that references Divine Archives content — a
deity name, an era name, a mythological detail, a script/symbol, a doctrine — **must
trace back to an existing published chapter** on the live site.

- **Source of truth:** `docs/assets/data.js` (chapter index) and the chapter markdown
  under `/eras` and `/themes`. Only chapters with `status: "published"` count.
- **No invented lore.** No composite deities, no "sounds-plausible" mythological
  details, no symbols the tradition didn't actually use, no dates/claims not in a
  chapter.
- **Every Divine Archives brief must cite its source chapter** by id and title (e.g.
  "ch23 — Norse Paganism"), and the specific claim/symbol must be verifiable in that
  chapter's text.
- **If a product idea needs a fact not yet in the archive, FLAG IT** in `FLAGS.md` and
  hold the product — do **not** invent the fact, and do **not** quietly drop the
  product. (A missing fact is a signal to either pick a different, grounded design or
  to commission the chapter content first — Carter decides, not this stage.)
- **Keep belief and evidence distinct** (the archive's core rule). Product copy states
  what a tradition *held/used*, not that a sacred claim is *literally true*. No
  "authentic magic," "real power," or proof-claims for contested/unfalsifiable material.

### Sacred-symbol gate (Carter's directive — mandatory)
> **We will NOT use a sacred symbol on a product unless it can be done respectfully.**

This is a hard gate on top of factual grounding. A symbol being *grounded in a chapter* is
necessary but **not sufficient** — it must also clear the respectful-use bar.
- **Living-tradition sacred symbols** (e.g. the Kabbalistic Tree of Life / sefirot, the
  Buddhist Dharmachakra, runic material with modern religious use) are **high-sensitivity**.
  Each must be justified as respectful *educational/reference* use — attributed to its
  chapter, presented as documentation of what the tradition holds, never as a decontextual
  novelty or "mystical power" claim — **or it is pulled** and replaced with a lower-
  sensitivity grounded design. Carter makes the final call per symbol.
- **Historical / museum-context motifs** from traditions with no living practitioner
  community (e.g. Egyptian Ma'at iconography) and **comparative/textual** pieces (e.g. a
  flood-lineage diagram) are lower-sensitivity, but still get the same descriptive framing.
- If a symbol can't be done respectfully, **don't do it.** Swap in a grounded, lower-
  sensitivity design rather than forcing the sacred one.

---

## REVIEW GATE (mandatory — this stage does not self-publish)

There is **one hard gate** between this stage and anything going live. It mirrors the
archive's ICM review gate (`icm/README.md`) and the pending-review discipline in the
root `CLAUDE.md`.

**Nothing is "ready to list" until Carter explicitly clears it.** Until then, every
brief, mockup, and copy block carries a status of `DRAFT` or `PENDING REVIEW` — never
`READY`.

**Status ladder (the only allowed values):**
`DRAFT` → `PENDING REVIEW` → `READY TO LIST` *(Carter only)* → `LISTED` *(Carter only)*

- Claude Code may move items to `DRAFT` and `PENDING REVIEW`.
- Only **Carter** may set `READY TO LIST` or `LISTED`.
- **Two review checkpoints, both required before `READY TO LIST`:**
  1. **Pip character-consistency check** (every Pip asset, per Non-Negotiable #1).
  2. **Divine Archives factual-grounding check** (every DA asset traces to a published
     chapter, per Non-Negotiable #2).
- `CONTEXT.md` tracks the review state of the whole batch and is flagged
  `READY FOR REVIEW` only when the batch is complete and self-checked — that flag is a
  request for Carter's review, **not** an approval.

**Do NOT, at this stage:**
- publish, list, or push anything live (Shopify, Cloudflare Pages, or anywhere)
- create real Shopify products or paste a live Buy Button snippet (the snippet stays a
  `TODO` until a live product ID exists)
- guess at missing info (pricing, supplier, domain) — **flag it in `FLAGS.md`**

---

## POD / production notes — Printify only (Carter's directive)
> **We will only create products that Printify can make available to us.**

- **Locked supplier: Printify.** If Printify's catalog does not offer a product type, that
  product is **out of scope** — do not source it elsewhere for this stage; replace it with
  a Printify-available product (or park it and flag).
- **Confirmed in Printify's catalog** (verified Aug 2026): stickers (die-cut / kiss-cut /
  sheets), greeting cards (folded, matte/glossy, with envelopes), mugs (ceramic + enamel
  camp), tote bags, apparel/tees, posters/prints, throw pillows, and pin-back **buttons**
  (Tecre round pins).
- **NOT a standard Printify product — do not assume it:**
  - **Custom-shaped plush** — Printify only offers a stock teddy bear with a customizable
    mini-tee, *not* a custom onion-shaped Pip plush. A true Pip plush is out of scope here.
  - **Hard-enamel pins** — Printify offers pin-back *buttons*, not custom hard enamel.
- **No pricing is set in this stage.** SRP/margins depend on Printify base cost — leave as
  `TBD` and flag.

## Per-product workflow
1. Write the brief: product type, design direction, source chapter/reference (DA) or
   locked-character note (Pip), POD supplier notes. Set status `DRAFT`.
2. Draft copy (title + description) in `copy/`.
3. For Pip: draft art → **flag for human review** → only then reference it in a mockup.
4. Move to `PENDING REVIEW` and record in `CONTEXT.md`.
5. **Stop.** Carter reviews. Do not advance to `READY TO LIST`.

## Pip's Orchard — existing brand presence
Pip's Orchard is an **established brand**, not a new one. It already has:
- **TikTok, Facebook, and YouTube** channels (the supplied art is in that wholesome,
  encouraging social-post style).
- **Books on Amazon KDP** built around the Pip character.

Implications for this stage: merch **complements** the existing books and social presence —
match the established Pip look and voice, and treat the social channels as the natural place
a Pip storefront would be linked from. Do not contradict or restyle the existing brand.

## Domain / infrastructure
- The `/shop` page draft targets the **Divine Archives static site** (Cloudflare Pages,
  same repo/deploy pattern as `docs/*.html`, domain `getconexto.com`).
- **Where Pip's Orchard sells publicly is still unresolved** (a section of getconexto.com?
  a separate Pip domain? Shopify's own storefront linked from the TikTok/YouTube/Facebook
  channels?) — see `FLAGS.md`. Do not make any domain/DNS change; the root `CLAUDE.md`
  domain policy still applies.
