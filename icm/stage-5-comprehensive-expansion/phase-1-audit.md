# Phase 1 — Competitive & Structural Audit

*The Divine Archives · Comprehensive Expansion initiative · research only (no content, no code)*
*Prepared 2026-08-25 · for Carter's approval before Phase 2 begins*

> **Scope note.** This is a **content + competitive** audit. It is distinct from
> `00-audit/CONTEXT.md`, which was a technical/SEO/site-health pass (load times,
> structured data, accessibility). Nothing here re-litigates that. This pass asks
> three questions: *who else is in this space and what do they get right/wrong,
> where are our content holes, and what could make us structurally different.*

---

## 1. Competitive landscape

Six reference sites/archives surveyed, plus three narrower tools noted at the end.
Everything below is characterised from public descriptions and library-guide
write-ups; **no third-party text or design is reproduced anywhere in this project.**

### 1a. Comparison table

| Site | What it does well | What feels dated / thin / frustrating | Genuinely novel (worth adapting, not copying) |
|---|---|---|---|
| **Encyclopædia Britannica — religion** (`britannica.com/topic/religion`) | Trusted, editorially reviewed; broad (5,100+ religion entries in the companion encyclopedia); multimedia (images, video, audio). | Hard **paywall** on the deep material; house style is dry and abstract (opens with definitions, not scenes); organised as isolated A–Z topic articles with weak cross-linking between traditions; no honest treatment of *contested* claims — it states consensus, it doesn't show its epistemic work. | The **editorial-authority signal** (bylines, review dates). We can borrow the *trust posture* without the paywall — and beat it on transparency by showing our evidence reasoning openly. |
| **Theoi Project** (`theoi.com`) | The gold standard for *primary-source depth*: every deity/creature gets a page pairing an encyclopedic summary with **sourced ancient quotations** and classical-art examples; genealogy laid out over eight family-tree charts. ~1,500 pages. | **Single-tradition only** (Greek, with some Roman); visually plain/dated ("not the most sleek"); no comparative dimension at all; static — no filtering, no timeline; effectively frozen. | The **quote-with-citation-beside-the-summary** pattern (see the myth *and* the ancient text that attests it, side by side). Directly adaptable to our evidence sections. And the **visual family-tree/genealogy chart** as a navigation object. |
| **World History Encyclopedia** (`worldhistory.org`) | Readable narrative prose written for a general audience; good "mythology *was* the religion of its day" framing; strong internal linking to historical context (rulers, places, events); free; images and maps. | Coverage is **broad but uneven** and article-by-article rather than systematic; comparative themes are essay-shaped, not structured; no explicit evidence-honesty apparatus (supported vs contested is left to prose); ad-supported. | The **narrative-first tone tied to hard historical context** — our house style already does this (ch01's George Smith scene). Their **map integration** is worth adapting for "where did this tradition live." |
| **Internet Sacred Text Archive** (`sacred-texts.com`) | Enormous **public-domain primary-text** library (scripture, esoterica, folklore) in one place; the reason people still cite it 25 years on; deep on obscure/esoteric material other sites skip. | Interface is **openly antiquated** (1999-era alphabetical site map, wall-of-links navigation); texts are often **old public-domain translations** (out of date scholarship); zero editorial framing, zero evidence apparatus — it's a warehouse, not a guide; a *modern reader* front-end exists only because the original is so hard to use. | The **primary-text-first** ethos and the courage to include esoteric/rejected/apocryphal material (Gnostic, Hermetic, folk). Our CLAUDE.md depth standard already demands this — STA proves the appetite exists. We beat it by *framing* the texts instead of dumping them. |
| **Mythopedia** (`mythopedia.com`) | The closest thing to a *modern* competitor: stylish contemporary interface, expert-written, "academic rigor + enjoyable prose," growing multi-pantheon coverage (Greek, Norse, Celtic, Chinese, Japanese, Hindu, Aztec, Egyptian). | **Mythology-only** (pantheons/deities), so it stops where lived religion, doctrine, ethics, and modern traditions begin; organised by pantheon (culture silos), so **no chronological or comparative spine**; light on evidence/contestation — it retells myth, it doesn't adjudicate claims; no coverage past antiquity. | The **modern editorial UX applied to myth** is the bar for "looks current." We match the polish and add everything they omit: chronology, doctrine, the esoteric, the modern era, and epistemic honesty. |
| **Godchecker** (`godchecker.com`) | Huge deity index (~3,500+) browsable **by pantheon and searchable**; deliberately fun/irreverent tone; good for quick "who is this god" lookups. | Tone is jokey (undercuts authority); **entries are shallow** (a paragraph each); "GodRank" popularity gimmick over substance; no sources, no evidence, no comparison, no chronology. | The **browse-by-pantheon + universal search** as a fast entry path — but attached to *deep, sourced* pages rather than one-liners. |

### 1b. Narrower tools that already exist (so we don't claim false novelty)

- **World Religions Explorer — interactive timeline** (`religions.cubexic.com/timeline`): each tradition is a ribbon from birth to today, dotted lines mark schisms, symbols mark extinct faiths; click a tradition to explore. **This is the single closest prior art to our "Nine Ages timeline" idea** — proof the format works, and proof we must differentiate on *depth + evidence honesty*, not on "a timeline exists." (Could not load it directly — egress-blocked in this environment — characterised from its public description; **flagged for a live look during Phase 2.**)
- **Patheos "Side-by-Side" Lens**: pick up to three traditions from dropdowns, get a comparison chart across topics. Comparison exists, but it's **table-shaped and shallow**, and it compares *living world religions* only — no historical/esoteric depth, no evidence layer.
- **Thompson's *Motif-Index of Folk-Literature*** and academic **comparative mythology**: the scholarly backbone for cross-tradition motifs (flood, world-egg, dying-and-rising god, creative sacrifice). It's a print/academic index — **nobody has turned it into an evidence-honest, interactive public layer.** That's an opening (see §3.2).

### 1c. The pattern across all six

Every incumbent sits at one of two poles and none bridges them:

- **Warehouses** (Sacred Texts, Britannica, Godchecker): wide coverage, weak framing, no epistemics.
- **Boutiques** (Theoi, Mythopedia): beautiful/deep, but single-domain (myth only) and siloed by culture.

**Nobody does all four of:** (1) *chronological, cross-cultural* organisation, (2) *lived religion + doctrine + esoterica + modern movements*, not just antique myth, (3) an explicit, uniform **evidence-honesty apparatus** that separates belief from what's demonstrable, and (4) a **modern, non-paywalled UX**. That intersection is empty. Divine Archives is already aimed at it — the expansion is about occupying it decisively.

---

## 2. Content gap report (42 chapters vs. the documented world)

**Current coverage: 42 chapters** — 41 tradition chapters across the Nine Ages + 1
comparative theme (ch01, The Flood). The status board shows eras 02–06 CLEARED and
eras 01, 07, 08, 09 pending review. Coverage of the *headline* traditions per era
is genuinely strong. The gaps below are **not padding** — each is a tradition or
theme with a real documented record that a "comparative reference on *every*
documented tradition" (CLAUDE.md) currently omits.

Priority key: **P1** = major world/near-world tradition or CLAUDE.md-mandated topic, clearly missing · **P2** = significant tradition or regional variant · **P3** = worthwhile once the spine is filled.

### Era I — Prehistory (have: Paleolithic, Neolithic)
- **P2 — Shamanism as a cross-cultural category** (Siberian/Central Asian core; the ethnographic type-case for "earliest religion" arguments). Currently only implied.
- **P3 — Rock-art & megalith comparative theme** (Göbekli Tepe, European cave art, San rock art, Australian rock art) as a *theme* chapter rather than folded into two survey chapters.
- **Theme gap:** no "origins of ritual / why belief at all" comparative chapter (cognitive science of religion angle).

### Era II — Bronze Age (have: Egypt, Mesopotamia, Indus Valley, Early Vedic)
- **P1 — Canaanite / Ugaritic religion** (the Baal Cycle, El, Asherah). Major omission: it's the direct backdrop to Israelite religion in the next era and one of our best-attested Bronze Age corpora.
- **P2 — Hittite / Anatolian religion** (the "thousand gods," well-documented treaties/rituals).
- **P2 — Minoan & Mycenaean Aegean religion** (Linear B pantheon; the prehistory of Greek religion).
- **Theme gap:** **creation cosmogonies** comparative chapter (Enuma Elish / Memphite theology / Rigvedic hymns side by side) — a natural companion to ch01 Flood.

### Era III — Early Iron Age (have: Zoroaster, Pre-exilic Israel, Early Greece, Early China)
- **P2 — Phoenician / Punic religion** (Canaanite continuity into the 1st millennium; Carthage).
- **P2 — Neo-Assyrian / Neo-Babylonian imperial religion** (state cult, divination, the astral tradition that seeds astrology).
- **P3 — Olmec & Formative Mesoamerica** (the earliest New-World religious complex; currently the Americas don't appear until era 07).

### Era IV — Axial Age (have: Second Temple Judaism, Buddhism, Confucianism & Daoism, Rome, Celtic & Germanic, Classical Greece)
- **P1 — Jainism.** A living Axial-Age tradition of ~4–5 million adherents, entirely absent. Clear must-add.
- **P2 — Early Hinduism / the Upanishadic–Vedantic turn** (Brahmanas → Upanishads; the darshanas begin). We jump from Early Vedic (era 02) to Bhakti (era 07) with no classical-Hindu synthesis chapter.
- **P2 — Greek philosophical religion** (Orphism, Pythagoreanism, Platonic theology) as *religion*, not just philosophy — the seedbed of later Hermeticism/Neoplatonism.
- **P3 — Ājīvikas** (the "lost" third Axial-Age Indian movement) as part of the Jain/Buddhist chapter's context.

### Era V — Late Antiquity (have: Early Christianity, Gnosticism, Roman Mystery Cults, Rabbinic Judaism, Mahayana)
- **P1 — Manichaeism.** A genuine *world* religion of late antiquity (Rome to China), now extinct — a glaring omission for a comparative archive.
- **P1 — Hermeticism** (Corpus Hermeticum). **CLAUDE.md names it explicitly** as required esoteric coverage; it has no home chapter yet.
- **P2 — Neoplatonism & theurgy** (Plotinus, Iamblichus) — the bridge from classical philosophy to Western esotericism.
- **P2 — Mandaeism** (the only surviving Gnostic religion; still living in Iraq/Iran).
- **P2 — Religious Daoism** (Celestial Masters, Shangqing) as distinct from the philosophical Daoism in era 04.
- **P3 — Christian diversity**: Arianism, the Church of the East (Nestorian), Coptic/Syriac Christianity — the non-Nicene branches.

### Era VI — Early Medieval (have: Islam, Patristic Christianity, Norse Paganism, Tantra, Shinto)
- **P2 — Byzantine / Eastern Orthodox Christianity** as distinct from the patristic settlement (iconoclasm, hesychast roots, the Eastern liturgical world).
- **P2 — Early Tibetan religion: Bon & the first spread of Vajrayana Buddhism.**
- **P2 — Slavic paganism** (Perun, Veles; the pre-Christian Rus').
- **P3 — Intra-Islamic differentiation** (Sunni/Shia/Kharijite formation; the Ismaili and early Sufi currents) if not already inside ch21.

### Era VII — High Medieval (have: Kabbalah, Sufism, Scholasticism, Aztec/Maya/Inca, Bhakti)
- **P2 — Advaita Vedanta & the Hindu philosophical schools** (Shankara, Ramanuja) — the doctrinal spine behind Bhakti.
- **P2 — Zen / Chan & Pure Land Buddhism** as distinct developments; **Neo-Confucianism** (Zhu Xi) — East Asia is thin after era 04.
- **P2 — Medieval Christian heterodoxy**: Cathars, Waldensians (and the Inquisition that met them — pairs with the era-08 witch-trials chapter).
- **P3 — Mississippian / Cahokia** and **Polynesian/Pacific religion** — whole regions currently absent from the archive.

### Era VIII — Early Modern (have: Reformation, Witch Trials, African Traditional Religion, Sikhism)
- **P1 — Renaissance Hermeticism & Western ceremonial magic's roots** (Ficino, Pico, Agrippa, Bruno, John Dee; Rosicrucianism; early Freemasonry). **CLAUDE.md explicitly mandates Hermeticism and Western ceremonial magic** — this is the era they crystallise.
- **P2 — Catholic Reformation / Counter-Reformation** (Trent, the Jesuits) — currently the Reformation chapter is Protestant-weighted.
- **P2 — Radical Reformation** (Anabaptists, Mennonites) and **Hasidism** (18th-c. Jewish mystical revival).
- **P2 — Enlightenment religion**: Deism, early secular/critical approaches to scripture — the intellectual context for the whole modern era.
- **P3 — Native American religions at contact** as a documented-encounter chapter.

### Era IX — Modern (have: NRMs, Spiritualism, Theosophy & Occult Revival, Wicca & Modern Paganism, Satanism, African Diaspora Religions)
- **P1 — Bahá'í Faith.** ~5–8 million adherents worldwide, a genuine independent world religion — entirely absent. Clear must-add.
- **P1 — Golden Dawn & Thelema (Crowley) / modern Western ceremonial magic.** **CLAUDE.md explicitly names Golden Dawn and Thelema.** May be partly inside ch37 (Theosophy/Occult) but warrants its own treatment.
- **P1 — Global Pentecostal & Charismatic Christianity.** The fastest-growing religious movement of the modern era (hundreds of millions) — a striking omission.
- **P2 — Latter-day Saints (Mormonism)** and the **Adventist/Watch Tower family** (Jehovah's Witnesses) — the major home-grown American scriptural NRMs; currently only implied by the generic "NRMs" chapter.
- **P2 — Modern/Neo-Hindu reform** (Vivekananda, Ramakrishna, the global export of yoga/Vedanta) and **modern engaged Buddhism**.
- **P2 — Rastafari**; **Nation of Islam / Ahmadiyya**; **Cao Đài** — significant 20th-c. new religions.
- **P3 — New Age, Scientology, UFO religions, Chaos magick, contemporary Heathenry**, and **organised secular worldviews** (humanism/"nones") as a documented modern phenomenon.

### Cross-cutting comparative-theme gap (the biggest structural hole)
CLAUDE.md asks for **"one comparative theme chapter per era where useful,"** yet only **one exists in total** (ch01 Flood). This is the single richest expansion vein and the one that most differentiates us from every competitor in §1. Strong candidates:
**creation cosmogonies · afterlife & underworld journeys · dying-and-rising gods · divine kingship · sacrifice · apocalypse/eschatology · the world tree / axis mundi · mother-goddess figures · the trickster · messianism & the returning saviour · sacred marriage.**

### Symbology / sacred-encoding gap (CLAUDE.md-mandated, currently diffuse)
CLAUDE.md requires a **symbology deep-dive per chapter** and names specific topics that have **no dedicated home**: **gematria / isopsephy / abjad numerology**, the **"Bible code" (equidistant-letter-sequence) claims** (to be presented as *statistically debunked*, distinct from genuine ancient literary devices), **relics such as the Shroud of Turin** (with the real dating/testing history), and **sacred geometry / iconography**. These are natural **symbology-theme chapters** and also the connective tissue to the planned merch line (§3.4).

### Gap-report summary
- **Clear P1 must-adds (8):** Canaanite/Ugaritic · Jainism · Manichaeism · Hermeticism · Renaissance Hermeticism & ceremonial magic · Bahá'í · Golden Dawn/Thelema · global Pentecostalism.
- **P2 traditions/variants:** ~20, concentrated in East Asia after era 04, the non-Nicene/Eastern Christianities, the Americas/Pacific, and the modern NRM families.
- **Comparative theme chapters:** ~10 high-value themes, of which we have 1.
- **Symbology theme chapters:** ~4 mandated topics with no current home.
- **Rough magnitude:** the archive could roughly **double** (to ~80–90 chapters) while every added chapter still clears the "real documented tradition, real sources" bar. Depth-over-speed still governs — this is a menu to prioritise from in Phase 4, not a quota.

---

## 3. What would make Divine Archives structurally distinct

Not "more content." Three structural moves (plus one that also feeds merch). Each
is compatible with the cathedral-archive aesthetic and the future merch line, and
each targets the empty intersection identified in §1c.

### 3.1 — The three-lens evidence engine as the site's *spine*, not a footer
Every incumbent either asserts consensus (Britannica), retells belief uncritically
(Mythopedia, Godchecker), or dumps text without framing (Sacred Texts). **None
models how we know what we know.** We make the **Believer's lens / Skeptical lens /
What the evidence shows** triad the *organising structure of every topic* and —
critically — make those verdicts **uniform and therefore comparable across
traditions.** ch01 already proves the appetite (its supported/not-supported/open
close is the seed). The differentiator isn't "we're honest"; it's that honesty is
**structured, consistent, and machine-comparable**, which unlocks 3.2. (Phase 2
formalises the template.)

### 3.2 — The Motif Constellation: browse by *pattern across traditions*, not by pantheon
Every competitor browses by **culture** (Theoi, Mythopedia, Godchecker) or **A–Z**
(Sacred Texts, Britannica). We add an orthogonal axis: browse by **recurring
motif** — flood, creation-from-chaos, dying-and-rising god, world-egg, divine
kingship, apocalypse — rendered as an interactive **constellation/graph** where
each motif links the traditions that share it, **and each link carries an
evidence-rated verdict**: *documented borrowing* (e.g. Gilgamesh→Genesis flood),
*plausible diffusion*, or *independent convergence*. This operationalises Thompson's
Motif-Index and academic comparative mythology — which **no public site has made
interactive and evidence-honest** — and it's only possible *because* of the uniform
3.1 apparatus. This is the flagship "why us" feature.

### 3.3 — The Nine Ages as a living synchronic timeline ("what was happening *at the same time*")
Our by-era-not-region spine is already unusual; make it **visible and
interactive**. A timeline where each tradition is a ribbon across the Nine Ages,
so a reader can *see* the Axial Age light up simultaneously from Greece to China,
watch traditions branch (schisms) and end, and pivot from any point into the
chapter. **Prior art exists** (World Religions Explorer, §1b), so the
differentiation is deliberate: ours is welded to deep, evidence-honest chapters
and to the 3.2 motif layer — a timeline that *explains and adjudicates*, not just
displays. (We must review the existing tool live in Phase 2 to stay clearly
distinct.)

### 3.4 — (Compatibility move) A Symbol Lexicon that doubles as the merch backbone
CLAUDE.md mandates per-chapter symbology and names 14 sacred symbols for the future
merch line. Make that a **first-class cross-referenced Symbol Lexicon**: each
sacred symbol gets provenance, cross-cultural variants, documented meaning, and an
evidence note — cross-linked to every chapter that uses it. This is unique among
competitors (nobody treats symbology as a navigable layer), directly serves the
merch line (accurate provenance/variants are exactly what product design needs),
and keeps the design and content decisions **merch-compatible by construction**, as
the brief requires.

**How the three cohere:** 3.1 is the *epistemic substrate*; 3.2 and 3.3 are two
orthogonal *navigation axes* (pattern and time) that only work because 3.1 makes
chapters uniformly comparable; 3.4 is a third axis (symbol) that also pays for
itself commercially. Together they put us in the empty §1c intersection —
chronological + comprehensive + evidence-honest + modern — that no incumbent occupies.

---

## Verification & honesty notes (per the brief — no smoothing over gaps)
- **Repo facts are verified against the working tree**: 42 chapter files exist across the nine `eras/` folders + `themes/ch01`; `docs/assets/data.js` is the live content index; the ICM staged-review workflow and the prior `00-audit` technical pass are real and were read. Chapter *counts and titles* are exact.
- **Competitor characterisations are from public descriptions / library guides, not first-hand crawls of every feature.** Two intended live looks were **egress-blocked** in this environment and are explicitly flagged for Phase 2: `religions.cubexic.com/timeline` (World Religions Explorer) and a direct pass over Mythopedia's current UX. I did **not** invent feature details for these.
- **No competitor text, code, or design was copied or reproduced**, per the brief and CLAUDE.md.
- **The gap report is an editorial coverage analysis**, not a set of empirical claims needing citation; the *chapters* that fill these gaps will carry full sourcing under the existing standard. Where I asserted adherent numbers (Jainism, Bahá'í) they're given as rough orders of magnitude to justify priority, and will be sourced precisely if/when drafted.
- **Nothing was written, published, or merged.** This file is the sole Phase 1 deliverable. Awaiting approval before any Phase 2 design work.
