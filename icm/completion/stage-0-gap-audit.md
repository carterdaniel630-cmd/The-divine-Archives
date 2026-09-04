# Completion ICM — Stage 0: Inventory & Gap Audit

**STATUS: 🟡 READY FOR REVIEW — STOP at human review gate.**
No expansion work has started. This document is the Stage 0 deliverable per the
Full Completion Prompt. Nothing proceeds to Stage 1 without Carter's sign-off.

- **Date:** 2026-09-04
- **Auditor:** Claude (audited from repo files, not from prior-session claims, per the ground-truth rule)
- **Branch:** `claude/divine-archives-completion-2bplik`
- **Method:** full section-header + word-count extraction of all 42 chapter files;
  full reads of the template (ch01) and two representative thin chapters (ch29, ch39)
  as calibration; cross-check of the documented deepening pass (`icm/stage-4-expansions/CONTEXT.md`)
  against the actual files.

---

## 1. Ground truth — what is actually in the repo

**42 chapter files confirmed on disk** (41 under `eras/`, plus `themes/ch01-the-flood.md`):

| Era folder | Chapters present | Count |
|---|---|---|
| (theme, cross-era) | ch01 Flood | 1 |
| 01-prehistory | ch41 Paleolithic, ch42 Neolithic | 2 |
| 02-bronze-age | ch02 Egypt, ch03 Mesopotamia, ch04 Indus Valley, ch05 Early Vedic | 4 |
| 03-early-iron-age | ch06 Zoroaster, ch07 Pre-exilic Israel, ch08 Early Greece, ch09 Early China | 4 |
| 04-axial-age | ch10 2nd-Temple Judaism, ch11 Buddhism, ch12 Confucianism/Daoism, ch13 Rome, ch14 Celtic/Germanic, ch15 Classical Greece | 6 |
| 05-late-antiquity | ch16 Early Christianity, ch17 Gnosticism, ch18 Roman Mystery Cults, ch19 Rabbinic Judaism, ch20 Mahayana | 5 |
| 06-early-medieval | ch21 Islam, ch22 Patristic, ch23 Norse, ch24 Tantra, ch25 Shinto | 5 |
| 07-high-medieval | ch26 Kabbalah, ch27 Sufism, ch28 Scholasticism, ch29 Aztec/Maya/Inca, ch30 Bhakti | 5 |
| 08-early-modern | ch31 Reformation, ch32 Witch Trials, ch33 African Traditional, ch34 Sikhism | 4 |
| 09-modern | ch35 NRMs, ch36 Spiritualism, ch37 Theosophy, ch38 Wicca/Paganism, ch39 Satanism, ch40 Diaspora | 6 |

**Template compliance is universal.** Every one of the 42 files has: a titled
opening scene (narrative), body sections, a `## Symbology and sacred encoding`
section, a `## The evidence, honestly` triad (supported / not-supported / open),
a `## Connections` section, and a `## Sources` bullet list. **No chapter is
structurally missing a section.** The gap is *depth*, not *presence*.

**Note on the five-section template.** The completion prompt names five sections
(narrative / believer's lens / skeptical lens / evidence / symbology). The chapters
— following the ch01 template — do not use literal "believer's lens"/"skeptical lens"
headers; they weave the believer's self-understanding through the narrative body and
consolidate the skeptical/critical assessment into `The evidence, honestly`. This is
consistent across all 42 and matches the locked template, so scoring below treats
"believer's lens" = how faithfully the tradition's self-understanding is rendered in
the body, and "skeptical lens" = the critical/historical/scholarly analysis and the
evidence triad. **Flag for Carter:** if you want explicit lens sub-headers added, that
is a template change affecting all 42 and should be decided at this gate, not mid-stream.

---

## 2. The central finding — three depth tiers

Word count tracks the deepening pass exactly. There are three clean tiers:

- **TIER A — Deep (ch01–ch20), ~3,150–4,460 words.** Went through the Batch II
  deepening pass (documented in `icm/stage-4-expansions/CONTEXT.md`, verified against
  file headers — the added sections are present: e.g. ch02 "The religion of ordinary
  people", ch11 Jainism, ch16 "The women of the movement", ch20 Guanyin). These are at
  or near the project's mature standard. Remaining gaps are *targeted enrichment*, not rebuilds.
- **TIER B — Partial (ch21–ch25), ~2,170–3,350 words.** Early Medieval. Never received
  the full deepening pass (Batch II stopped after ch20). ch21 Islam and ch22 Patristic
  are the strongest; ch23 Norse, ch24 Tantra, ch25 Shinto thin out markedly.
- **TIER C — Thin (ch26–ch42), ~1,150–1,990 words.** High Medieval, Early Modern,
  Modern, and Prehistory. Roughly one-third to one-half the depth of Tier A. All are
  competent, accurate summaries — but summaries, not the exhaustive public record the
  completion prompt requires.

**The completion task is, in essence: bring Tiers B and C up to Tier A depth, and add
targeted enrichment to Tier A — while holding the evidence-honesty bar on every line.**

---

## 3. Content surface area (matters for Stage 2 execution)

Each chapter's content exists in **three** places that must stay in sync:
1. **Markdown source** — `eras/…/chNN-*.md` or `themes/ch01-the-flood.md` (authoring source of truth)
2. **`docs/assets/chapters.js`** (~700 KB) — the rendered `chNN: { html }` body the site serves
3. **`docs/chapters/chNN.html`** — static prerendered page (crawlable), built from the above

Regeneration path is scripted: `node tools/md-to-chapter.js <id> <md>` produces the
chapters.js block; `node tools/build-chapters.js` rebuilds the static HTML. **Every
Stage 2 expansion edit must update the markdown and regenerate 2 and 3.** There is also
a per-chapter citation log in `/sources/chNN-*.md` (40 present) to update. None of this
touches design/aesthetic/deployment — it is the content pipeline only, in scope.

---

## 4. Scoring legend

Per section: **thin** (summary/stub, well below standard) · **partial** (solid but
missing major documented material) · **complete** (at Tier-A mature standard).
Confidence: chapters read in full are marked ✔; others scored from section-header
map + word count + documented deepening + domain knowledge (marked ~).

---

## 5. Master scoring table

| Ch | Topic | Words | Narrative | Believer | Skeptical | Evidence | Symbology | Tier | Conf |
|---|---|---|---|---|---|---|---|---|---|
| 01 | The Flood | 4199 | complete | complete | complete | complete | complete | A | ✔ |
| 02 | Egypt | 4174 | complete | complete | complete | complete | partial | A | ~ |
| 03 | Mesopotamia | 4013 | complete | complete | complete | complete | partial | A | ~ |
| 04 | Indus Valley | 2876 | complete | partial | complete | complete | partial | A/B | ~ |
| 05 | Early Vedic | 4235 | complete | complete | complete | complete | partial | A | ~ |
| 06 | Zoroaster | 3578 | complete | complete | complete | complete | partial | A | ~ |
| 07 | Pre-exilic Israel | 4462 | complete | complete | complete | complete | partial | A | ~ |
| 08 | Early Greece | 3359 | complete | complete | complete | complete | partial | A | ~ |
| 09 | Early China | 3207 | complete | complete | complete | complete | partial | A | ~ |
| 10 | 2nd-Temple Judaism | 3561 | complete | complete | complete | complete | partial | A | ~ |
| 11 | Buddhism | 3342 | complete | complete | complete | complete | partial | A | ~ |
| 12 | Confucianism/Daoism | 4208 | complete | complete | complete | complete | partial | A | ~ |
| 13 | Rome | 3548 | complete | complete | complete | complete | partial | A | ~ |
| 14 | Celtic/Germanic | 3186 | complete | complete | complete | complete | partial | A | ~ |
| 15 | Classical Greece | 3229 | complete | complete | complete | complete | partial | A | ~ |
| 16 | Early Christianity | 3479 | complete | complete | complete | complete | partial | A | ~ |
| 17 | Gnosticism | 3151 | complete | complete | complete | complete | partial | A | ~ |
| 18 | Roman Mystery Cults | 3437 | complete | complete | complete | complete | partial | A | ~ |
| 19 | Rabbinic Judaism | 3227 | complete | complete | complete | complete | partial | A | ~ |
| 20 | Mahayana | 3190 | complete | complete | complete | complete | partial | A | ~ |
| 21 | Islam | 3049 | complete | partial | partial | partial | partial | B | ~ |
| 22 | Patristic Christianity | 3347 | complete | partial | partial | partial | thin | B | ~ |
| 23 | Norse Paganism | 2948 | partial | partial | partial | partial | thin | B | ~ |
| 24 | Tantra | 2566 | partial | partial | partial | partial | thin | B | ~ |
| 25 | Shinto | 2174 | partial | partial | thin | partial | thin | B/C | ~ |
| 26 | Kabbalah | 1986 | partial | partial | thin | partial | thin | C | ~ |
| 27 | Sufism | 1929 | partial | partial | thin | partial | thin | C | ~ |
| 28 | Scholasticism | 1909 | partial | partial | thin | partial | thin | C | ~ |
| 29 | Aztec/Maya/Inca | 1928 | partial | thin | partial | partial | thin | C | ✔ |
| 30 | Bhakti | 1690 | partial | partial | thin | thin | thin | C | ~ |
| 31 | Reformation | 1554 | partial | partial | thin | thin | thin | C | ~ |
| 32 | Witch Trials | 1484 | partial | partial | partial | partial | thin | C | ~ |
| 33 | African Traditional | 1430 | partial | thin | thin | thin | thin | C | ~ |
| 34 | Sikhism | 1436 | partial | partial | thin | thin | thin | C | ~ |
| 35 | New Religious Movements | 1148 | partial | thin | partial | partial | thin | C | ~ |
| 36 | Spiritualism | 1213 | partial | partial | partial | partial | thin | C | ~ |
| 37 | Theosophy/Occult | 1277 | partial | partial | thin | thin | thin | C | ~ |
| 38 | Wicca/Paganism | 1316 | partial | partial | partial | partial | thin | C | ~ |
| 39 | Satanism | 1299 | complete | partial | complete | complete | partial | C | ✔ |
| 40 | Diaspora Religions | 1309 | partial | thin | thin | thin | thin | C | ~ |
| 41 | Paleolithic | 1407 | partial | n/a | partial | partial | thin | C | ~ |
| 42 | Neolithic | 1340 | partial | n/a | partial | partial | thin | C | ~ |

**Tally:** Tier A ≈ 20 · Tier B ≈ 5 · Tier C ≈ 17. Symbology is the single weakest
section archive-wide — "partial" even across the deepened Tier A (see §7).

---

## 6. Per-chapter gap map (what's missing)

Only material with a real, checkable public record is listed. "Sparse" flags where
the public record genuinely runs thin and padding would violate the standard.

### Tier A (ch01–ch20) — targeted enrichment only
Broadly at standard. Highest-value additions, per the expanded CLAUDE.md symbology mandate:
- **ch02 Egypt** — symbology: hieroglyphs as ritual/magical objects (not just script), execration texts, the *ankh*/*djed*/*was* as encoded theology, temple architecture as cosmogram. Also: Book of the Dead spell corpus breadth, the Coffin Texts / Pyramid Texts distinction.
- **ch03 Mesopotamia** — symbology: cuneiform numerology, the sexagesimal system's sacred dimension, *šumma* omen encoding, ziggurat symbolism; the god-lists.
- **ch07 Pre-exilic Israel** / **ch10 2nd-Temple** / **ch19 Rabbinic** — symbology: **gematria** with real historical worked examples (the mandate names this explicitly); acrostics/atbash genuinely present in the Hebrew text (Jeremiah's Sheshach); temple/menorah symbolism. **ch07 or ch10** is the natural home for the **Bible-codes** treatment (real literary devices vs. the statistically-debunked 1990s ELS "Bible code").
- **ch16 Early Christianity** or **ch22 Patristic** — the mandate names the **Shroud of Turin** explicitly: documented radiocarbon-dating history (1988), competing claims, current state of consensus, handled with the evidence triad. Also *ichthys*/chi-rho/staurogram encoding; isopsephy (888 for Jesus).
- **ch06 Zoroaster** — symbology: the *faravahar*, fire-grades, the sacred cord (*kusti*).
- **ch11/ch20 Buddhism** — symbology: mantra/*bija* syllables, the eight auspicious symbols, mandala structure, mudra iconography.
- **ch12 Confucianism/Daoism** — symbology: the *Yijing* hexagram system as a divinatory/numerological encoding; *taiji*/*bagua*; talismanic *fu* script.
- **ch04 Indus Valley** — believer's lens is necessarily thin (undeciphered), correctly flagged; leave sparse. Symbology could add the swastika's Indus attestation and the seal iconography debate.

### Tier B (ch21–ch25) — needs the deepening pass
- **ch21 Islam** (3049w) — missing: the ***tafsir*** tradition and major schools; the full **hadith** sciences (isnad, the six canonical collections, Bukhari/Muslim); **fiqh** and the four Sunni *madhhabs* + Ja'fari; **Sufism cross-link**; **Isma'ili/Zaydi** branches beyond the Sunni/Shia headline; **kalam** (Mu'tazila vs Ash'ari); the **Qur'anic sciences** (variant readings, *asbab al-nuzul*); folk/popular Islam (saint veneration, *ziyara*). Symbology: **abjad** numerals (mandate names this), Arabic calligraphy as sacred art, the aniconism doctrine, the *basmala*, mosque architecture as theology, *muqarnas*/geometric tiling (sacred geometry mandate).
- **ch22 Patristic** (3347w, symbology thin) — the body is dense but the symbology section is a stub. Add: the Christological councils' content (Nicaea/Chalcedon actually engaged), the *Cappadocians* on the Trinity, apophatic theology, early creeds. Symbology: chi-rho/labarum, catacomb iconography, the fish acrostic (ΙΧΘΥΣ), Good-Shepherd/orant imagery.
- **ch23 Norse** (2948w) — missing: the full **Poetic Edda** poem inventory and **Snorri's Prose Edda** structure; the **skaldic kennings** system (a major encoded-language tradition — belongs in symbology); **runic** magic vs. alphabet (mandate names runes); the *dísir*/*landvættir*/elves/dwarves; **Ragnarök** in detail; blót and Uppsala (Adam of Bremen); regional variation; the sagas as sources. Symbology is currently thin and runes deserve a real treatment.
- **ch24 Tantra** (2566w) — missing: **Kashmir Shaivism** (Abhinavagupta, the *spanda*/*pratyabhijna*); the **Sri Vidya**/Sri Yantra tradition; **chakra**/*kundalini*/subtle-body system in detail; the *mahavidyas*; distinction of Hindu vs. Buddhist tantra; the *Nath* siddhas; **left-hand vs right-hand** paths; **mantra/yantra/mandala** (core symbology — currently thin). Alchemy (*rasayana*).
- **ch25 Shinto** (2174w, skeptical + symbology thin) — missing: **State Shinto** (Meiji to 1945) as a documented and contested modern construction; the *Engishiki*/*norito* liturgy; *matsuri* cycle; the *Grand Shrine of Ise* rebuilding (*shikinen sengu*) theology; **kokugaku** (Motoori Norinaga); Shugendō; the *torii*/*shimenawa*/*gohei* symbol system; honji suijaku theory in depth.

### Tier C (ch26–ch42) — full expansion needed

**ch26 Kabbalah** (1986w) — the **gematria** deep-dive the mandate explicitly demands is
underdeveloped here of all places. Missing: the **Zohar** in detail (Moses de León authorship
question); **Isaac Luria** and Lurianic Kabbalah (*tzimtzum*, *shevirat ha-kelim*, *tikkun*) —
a major omission; **Abraham Abulafia's** ecstatic letter-permutation; the *sefirot* individually
and the Tree of Life diagram; **Christian Kabbalah** (Pico, Reuchlin) and the Hermetic/Golden-Dawn
adaptation (mandate names this); *Merkabah*/*Hekhalot* precursors; the four-world system; *notarikon*
and *temurah* alongside gematria.

**ch27 Sufism** (1929w) — missing: **Ibn Arabi** (*wahdat al-wujud*, the Perfect Man) and **Rumi**/the
Mevlevi in depth; **al-Hallaj** ("ana al-Haqq") and the martyr tradition; the *silsila*/*tariqa* system
and the major orders individually (Qadiri, Naqshbandi, Chishti, Shadhili); *dhikr*, *sama*, the *maqamat*/*ahwal*
stations; **women in Sufism** (Rabia al-Adawiyya); Sufi poetry (Attar's *Conference of the Birds*, Hafiz);
symbology: the whirling dance encoding, Sufi metaphor-systems (wine/the Beloved).

**ch28 Scholasticism** (1909w) — missing: the **universals** controversy (realism/nominalism, Abelard);
Anselm's ontological argument; the condemnations of 1277 in context; **Bonaventure** and the Franciscan
school; **Jewish** (Maimonides' *Guide*) and **Islamic** (Averroes, the Latin Averroists) parallel projects
in depth; the disputation *quaestio* method; the *Sentences* of Peter Lombard. (Symbology is genuinely
thinner for this tradition — flag as partly-sparse, but sacred architecture/Gothic-as-theology and
Lull's combinatorial *Ars* belong here.)

**ch29 Aztec/Maya/Inca** (1928w) — **STRUCTURAL under-scaling.** Three of the world's most complex
religious civilizations share one 1,900-word chapter. Read in full; each is a chapter's worth on its own:
- *Maya:* the full pantheon; the four surviving codices individually (Dresden/Madrid/Paris/Grolier);
  the ballgame's cosmology; cenote sacrifice; the *Books of Chilam Balam*; *wayob*; Landa's *Relación*.
- *Aztec:* the full *teotl* pantheon (Tezcatlipoca, Quetzalcoatl, Xipe Totec, Coatlicue, Mictlantecuhtli);
  the *tonalpohualli* day-signs; the Florentine Codex/Sahagún; flower wars; Nezahualcoyotl and the
  "unknown god"; afterlife destinations (Mictlan/Tlalocan); the *calmecac*.
- *Inca:* the Viracocha cycle; the *ceque* system of Cusco; the *panaca* ancestor-mummy cult; Pachacamac
  oracle; the extirpation-of-idolatries campaigns; *mit'a* and state cult vs. local *huacas*.
- **Recommendation for Carter (structural):** split into up to three chapters, or keep as one but expand
  to ~3× length. This is a framework decision and belongs at the gate.

**ch30 Bhakti** (1690w, evidence + symbology thin) — missing: the **Alvars and Nayanars** (Tamil corpus)
in depth; **Ramanuja/Madhva/Vallabha** *vedanta* schools; the North-Indian *sants* (Kabir, Ravidas, Mirabai,
Surdas, Tulsidas, Chaitanya and Gaudiya Vaishnavism); *saguna*/*nirguna* worked out; the *bhajan*/*kirtan*
practice; connection to Sikhism (ch34) and Sufism (ch27).

**ch31 Reformation** (1554w) — missing: **Zwingli** and the Marburg Colloquy; the **Radical Reformation**/
Anabaptists in depth; **Calvin** and Geneva, predestination; the **English Reformation** (Henry VIII →
Elizabethan settlement); the **Catholic/Counter-Reformation** and Trent; the **wars of religion** (Thirty
Years' War, Huguenots, St. Bartholomew's); print culture; symbology: iconoclasm as a symbol-war, Protestant
vs Catholic visual theology, the *solae* as encoding.

**ch32 Witch Trials** (1484w) — CLAUDE.md gives this specific weight. Missing: the ***Malleus Maleficarum***
in detail; the demonological theory (the pact, the sabbath, the *maleficium*); named major hunts (Trier,
Würzburg, Bamberg, North Berwick/James VI, Salem); the **gender** dimension and its scholarship; the
role of **torture** and legal procedure; the **decline** and the rise of skepticism (Weyer, Spee, the
end); the distinction from **real folk-magic/cunning-folk** practice (mandate). Symbology thin: the
witches'-mark, the sabbath imagery's iconographic history.

**ch33 African Traditional Religion** (1430w, believer/skeptical/evidence/symbology all thin) — missing:
named traditions in depth — **Yoruba** (*Orisha*, *Ifá* divination — a major encoded system for symbology),
**Akan** (*Nyame*, *Abosom*), **Dogon** cosmology (and the Griaule-controversy honesty note), **San**,
**Vodun** (Dahomey, feeding ch40); ancestor veneration; divination systems; the oral/initiatory transmission;
the colonial-distortion methodological caveat. Note: partly-sparse for some traditions — flag honestly.

**ch34 Sikhism** (1436w) — missing: the **Guru Granth Sahib** structure (*ragas*, *Mul Mantar*, *Japji Sahib*,
the *bhagat bani* of Kabir/Ravidas); the **ten Gurus** individually; **Khalsa** founding (1699) in detail;
*miri-piri*; the *gurdwara*/*langar*; **Guru Nanak's** theology (*Ik Onkar*, *naam simran*); relations to
Bhakti (ch30) and Islam (ch21); symbology: the *Ik Onkar* glyph, the *Khanda*, the Five Ks decoded.

**ch35 New Religious Movements** (1148w, thinnest) — missing: named movements in depth beyond the Mormon
opener — **Adventism/Jehovah's Witnesses**, **Scientology**, the **Nation of Islam**, **Peoples Temple/
Branch Davidians/Heaven's Gate/Aum Shinrikyo** (the violence cases, honestly), **UFO religions**, the
**New Age**; the sociology of NRMs (Stark-Bainbridge, cult/sect typology, the "cult" definitional debate,
brainwashing controversy and its rejection by scholars); the *anti-cult* vs *counter-cult* movements.

**ch36 Spiritualism** (1213w) — missing: the **Fox sisters** confession detail; major **mediums** (Home,
Palladino, the Davenports); the **Society for Psychical Research** and named investigators (Crookes, Lodge,
Doyle vs Houdini); **spirit photography**; the WWI grief surge; connection to Theosophy; symbology of the
séance apparatus.

**ch37 Theosophy/Occult Revival** (1277w, skeptical + evidence + symbology thin) — missing: **Blavatsky's**
*Isis Unveiled*/*Secret Doctrine* content and the **root-races** doctrine (with the honest note on its later
misuse); the **Mahatma Letters** controversy and the Hodgson/SPR verdict; **Annie Besant/Leadbeater/Krishnamurti**;
the **Hermetic Order of the Golden Dawn** (mandate names this — Mathers, Westcott, the cipher manuscripts,
the grade system); **Aleister Crowley/Thelema** (mandate names this — *The Book of the Law*, "Do what thou
wilt", the A∴A∴/OTO); **Rudolf Steiner/Anthroposophy**; the Tarot/Kabbalah synthesis (symbology).

**ch38 Wicca/Modern Paganism** (1316w) — missing: **Gardner** and the *Book of Shadows*, the Murray-thesis
debunking in detail; **Doreen Valiente** and the *Charge of the Goddess*; **Alexandrian/Gardnerian/Dianic/
eclectic** lineages; **Reclaiming/Starhawk**; **Druidry** (OBOD), **Heathenry/Ásatrú**; the *Wheel of the Year*
sabbats decoded; the **Wiccan Rede** and threefold law; symbology: the pentacle, athame, the Great Rite,
the four elements/quarters.

**ch39 Satanism** (1299w) — read in full; accurate and on-mandate but summary-level. Missing: the fuller
Church-of-Satan history (the Magic Circle, the Nine Satanic Statements, the Eleven Rules, Blanche Barton
succession); **Michael Aquino's Temple of Set** (an actual *theistic*/initiatory schism — significant, currently
absent); **Luciferianism** as distinct; the **Process Church**; the **historical "romantic Satanism"** literary
lineage (Milton, Blake, Shelley, Baudelaire, Carducci's *Inno a Satana*); the **Left-Hand Path** concept;
the one semi-documented historical episode (the **Affair of the Poisons**/La Voisin, 1670s); the Satanic
Temple's specific campaigns (After School Satan, the abortion-ritual/*TST v.* cases, Baphomet statue). The
CLAUDE.md rigor bar is met on tone; depth is not.

**ch40 Diaspora Religions** (1309w, believer/skeptical/evidence/symbology thin) — missing: **Vodou** in depth
(the *lwa* nations Rada/Petwo, *vèvè* — a core symbology system, the Bois Caïman history, *Ginen*); **Santería/
Lucumí** (*orisha*-*santo* syncretism, the *Regla de Ocha*, *patakí*, Ifá/*diloggún* divination); **Candomblé**
(the *nações*, *terreiro*, *axé*); **Palo**, **Umbanda**; **Rastafari** (Haile Selassie, the *Nyahbinghi*,
*I-and-I*, *Babylon*, ganja sacrament, the *Kebra Nagast*); the middle-passage retention/creolization scholarship;
the persecution-and-secrecy methodological note.

**ch41 Paleolithic** (1407w) — missing: **cave-art corpus** breadth (Lascaux/Chauvet/Altamira, the "sorcerer",
therianthropes); the **shamanism/entoptic** (Lewis-Williams) hypothesis *and its critics* (skeptical lens);
**burial** evidence (Sungir, Shanidar, red ochre); the **Venus figurines** distribution and interpretive
debates; bird/bone flutes; the honest "we cannot know" frame kept central. Some genuinely sparse — flag.

**ch42 Neolithic** (1340w) — missing: **Göbekli Tepe** (and now Karahan Tepe) in depth; **Çatalhöyük** (the
Hodder excavations, the bull/*bucrania*, the "history houses", the Mother-Goddess debate with Meskell's
critique); **megalith** culture breadth (Stonehenge, Avebury, Newgrange/passage-tomb alignments, Malta's
temples); **plastered skulls**/ancestor cult (Jericho, 'Ain Ghazal); the **secondary-products/burial** shift;
symbology: megalithic alignment as encoded astronomy. Some sparse — flag.

---

## 7. Cross-cutting gaps (apply across many chapters)

1. **Symbology is the weakest section archive-wide** — "partial" even across deepened Tier A, "thin"
   across most of Tiers B/C. The expanded CLAUDE.md symbology mandate is only partially met. Named
   mandate items not yet given a proper home: **gematria worked examples** (ch07/10/19/26),
   **abjad numerals** (ch21), **Greek isopsephy** (ch15/16), **Bible-codes real-vs-debunked** treatment
   (ch07 or ch10), **Shroud of Turin** with dating history (ch16 or ch22), **runes** as divination
   (ch23), **sacred geometry / temple-as-cosmogram** across (ch02/21/28/42), the **14 locked sacred
   symbols** cross-referencing (see Q4 below).
2. **ch29 structural under-scaling** — three civilizations in one thin chapter (see §6; needs a framework call).
3. **Named-source specificity** — Tier C chapters lean on Britannica/Wikipedia overviews; deepening should
   name primary texts, specific scholars, and named findings (as Tier A does), per the Stage 1 sourcing standard.
4. **Contested-claim flagging is good where present** (ch29's sacrifice-number honesty, ch39's panic debunk,
   ch04's undeciphered caveat) — this quality must be preserved, not diluted, as chapters grow.

---

## 8. Proposed path through Stages 1–3 (for approval — not yet started)

Following the prompt's "batch by Age, max ~5 chapters" rule, thinnest-first:

- **Batch 1:** Era 09 Modern (ch35–ch40) — thinnest tier, 6 chapters.
- **Batch 2:** Era 08 Early Modern (ch31–ch34) + Era 01 Prehistory (ch41–ch42).
- **Batch 3:** Era 07 High Medieval (ch26–ch30) — includes the ch29 structural decision.
- **Batch 4:** Era 06 Early Medieval (ch21–ch25) — the Tier-B deepening.
- **Batch 5:** Tier-A targeted symbology/enrichment pass (ch01–ch20) — lightest touch, mandate items.

Each batch: Stage 1 sourcing plan → gate → Stage 2 write + regenerate pipeline + source logs → gate.

---

## 9. STOP — human review gate (questions for Carter)

No expansion begins until you approve. Decisions I need from you:

1. **Audit format:** this single master doc, or do you want one `CONTEXT.md` per chapter generated as well before Stage 1?
2. **ch29 structural call:** split Aztec/Maya/Inca into up to three chapters, or keep as one expanded chapter? (Affects the chapter count / outline.)
3. **Batch order:** thinnest-first as proposed in §8, or a different priority?
4. **The "14 locked sacred symbols" list** referenced in the completion prompt is not in the repo (I searched). Please point me to it so symbology deep-dives can cross-reference it as instructed.
5. **Lens sub-headers:** keep the current woven believer/skeptical approach (matches the ch01 template), or add explicit "Believer's lens"/"Skeptical lens" headers to all 42?
6. **Scope confirm:** content-layer only, updating markdown + regenerating `chapters.js`/static pages + `/sources` logs, aesthetic/deploy untouched — correct?
