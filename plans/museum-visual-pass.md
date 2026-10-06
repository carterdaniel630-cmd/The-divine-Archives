# Museum visual pass: plan

Status: **Plan approved by Carter 2026-10-06. Sample (§7) built, awaiting Carter's walk-through.** Branch `claude/museum-visuals`; nothing merged.
Requested 2026-10-06. Order of work once approved: one sample hallway and one sample room (§7). I'll send a
preview link to walk on a phone. The rest of the museum is done only after Carter approves the sample.

Everything here follows the archive's standing rules:
- The objects are **renditions, not replicas**.
- Holders' photographs, scans and measurements are used as **reference only**, never copied into a model or a texture.
- Belief and evidence stay apart on every label.
- Anything touching religious sensitivity waits for Carter.

---

## 1. Relic count (read-only survey, 2026-10-06)

The Vault has **88 objects**. In the museum:

| Kind | Count | Objects |
|---|---|---|
| Full 3D rendition, modelled in code (`relics.js`) | 85 | all except V68, V76, V88 |
| Full 3D rendition, purpose-built (`reliquary.js`) | 1 | V88, the Saint-Maximin reliquary |
| Text and photos only: a plaque, no model, by the archive's own rule | 2 | V68 the Tjurunga (sacred-secret objects; no image is shown anywhere in the archive), V76 the Báb's Star Tablet (the archive shows no image of it; the Vault links to the British Library's bicentenary and Bahá'í pages) |
| Also has a published real 3D scan, shown in Sketchfab's own viewer on request ("View the real scan") | 11 | V34, V35, V36, V43, V47, V53, V55, V58, V59, V70, V71 |
| Holder's images linked from the Vault page (IIIF viewer or links) | 51 | see the table in the appendix |

**Placement:** all 88 objects are placed in a museum room, each in its home chapter's room. All 86 models stand
in their cases. V68 and V76 stand as plaques, and V88 has its own niche. Many objects are also signposted from
other rooms on the "See also" boards. The full per-object table is in the appendix.

**Note on "scan/photo-based":** no model in the museum is built from a scan or a photograph. The 11 real scans are
other people's work. They are shown only in Sketchfab's viewer, loaded from Sketchfab when the visitor asks, and are
never copied into the site. This pass keeps that line.

---

## 2. Relic detail: upgrading the 86 models

**Goal:** each model matches the real object as closely as the published record allows: overall shape, real
dimensions, material and colour, surface wear, breaks and repairs, and the layout of any writing or decoration.

**How each object is upgraded**
1. **Reference file.** The object's source log in `/sources/` gains a "Museum rendition" note. It lists the
   published dimensions (with source), the holder's catalogue page and images used as reference, and the
   scholarly descriptions of condition, damage and repairs. Reference only, never copied.
2. **Shape.** Dimensions are set to the published figures. The outline, thickness, breaks and missing parts are
   modelled from the reference views, in code, as now.
3. **Surface.** Colour, roughness and relief maps are painted procedurally in the browser, as now. Base colour and
   wear (chips, staining, tool marks, abrasion, gilding loss, patina, worm holes, foxing) are matched by eye to the
   holder's photographs. No photo pixels are used.
4. **Writing and decoration.** These keep the current rule: illustrative marks in the manner of the script, never the
   actual text. Within that rule the layout is matched: the number of lines, columns, registers and margins, and
   where the breaks fall. For example, the Rosetta Stone's 14 surviving hieroglyphic lines, 32 Demotic and 54
   Greek. *(See decision D3 for whether some objects should carry their real public-domain text instead.)*
5. **Check.** Each upgrade gets a side-by-side check against the reference, made locally and never published. The
   object's label then states the dimensions it was modelled to and their source.

**Proposed order: most iconic first.** Visit counts per object don't exist yet: the visitor counter is waiting on
its database, and Web Analytics is not set up. So the order below is by how iconic each object is, starting with the
sample room. It can switch to most-visited once analytics exist.

| Tier | Objects |
|---|---|
| **A**: the sample room (Egypt, ch02) | V53 Rosetta Stone, V43 Merneptah Stele, V20 Papyrus of Ani, V34 Pyramid Texts of Unas |
| **B**: world-famous | V04 Shroud of Turin, V02 Dead Sea Scrolls, V48 Great Isaiah Scroll, V21 Book of Kells, V01 Voynich Manuscript, V45 Nebra Sky Disc, V59 Venus of Willendorf, V58 Lion Man, V35 Cyrus Cylinder, V52 Ishtar Gate, V09 Codex Gigas, V37 Gundestrup Cauldron |
| **C**: major | V18 Codex Sinaiticus, V30 Diamond Sutra, V86 Berlin Gold Hat, V56 Phaistos Disc, V60 Göbekli Tepe, V13 Tilma of Guadalupe, V42 Lindisfarne Gospels, V38 Aleppo Codex, V54 Behistun, V55 Oracle Bones, V31 Dresden Codex, V41 Codex Borgia, V51 Codex Mendoza, V36 Rök Runestone, V22 Mesha Stele, V23 Tel Dan Stele, V44 Pilate Stone, V16 James Ossuary, V08 Nag Hammadi, V40 Gospel of Judas, V12 Ketef Hinnom, V10 Copper Scroll, V62 Khipu, V65 Staff God, V70 Pictish Stones, V71 Stećci, V84 Hinton St Mary |
| **D**: the rest | the remaining objects, wing by wing |
| **Held for Carter** (sensitivity, decision D2) | V26 Black Stone, V27 Sacred Tooth Relic casket, V28 Birmingham Qur'an, V29 Sana'a Palimpsest, V33 Kartarpur Bir, V46 Piprahwa relics, V64 Benin Bronzes, V77 Haitian Vèvè, V88 the skull reliquary |

**What can't be matched:** where no reliable published dimensions or images exist, as for objects whose existence
is disputed (V07 the Ark, V14 the Grail, V75 the Golden Plates), the model keeps following the texts' own
descriptions, and the label says so. No dimensions are invented.

---

## 3. Floors and skies

**Today:**
- One shared floor texture (dark square tiles) runs through the whole museum.
- Every room and corridor has a sunken "diorama under glass" in its floor (a brook, the Nile's reeds, dunes...).
- Every room and corridor has a skylight with its own sky (`world.js`, table `ENV`).

**Proposal:**
- **Keep the glass dioramas and skylights.** They're the museum's signature.
- **Replace the shared floor around them with a period floor per wing,** as below.
  - All floors are procedural canvases, like the current one, so they add no download.
  - Each has a matching relief (normal) map so torchlight picks up joints and wear.
  - Rooms may vary within their wing where the culture calls for it, for example Egypt's limestone against
    Mesopotamia's baked brick.

| Wing | Floor (period-appropriate) | Room variations (examples) |
|---|---|---|
| Rotunda and entrance hall | polished marble opus sectile, the archive's own | none |
| I Prehistory | packed earth and rough flagstones, cave floor | ch41 cave floor, ch61 red earth |
| II Bronze Age | limestone paving; baked brick with bitumen joints | ch02 Egypt: dressed limestone with a painted border; ch03 Mesopotamia: baked brick; ch67 Crete: gypsum slabs with red plaster bands |
| III Early Iron Age | dressed ashlar stone, cedar boards | ch08 Greece: early pebble mosaic; ch09 China: rammed earth and stone |
| IV Axial Age | Greek pebble mosaic, Roman tessellated mosaic, marble | ch11 India: stone and brick; ch12 China: grey tile |
| V Late Antiquity | Roman and Byzantine mosaic, opus sectile | ch16 early Christianity: a simple house-church mosaic (no figures of Christ) |
| VI Early Medieval | Byzantine opus sectile; wooden planks for the northern rooms | ch23 Norse: oak planks; ch25 Shinto: hinoki boards; ch21 Islam: geometric stone (no calligraphy) |
| VII High Medieval | Cosmati work; lead-glazed encaustic tiles | ch27 Sufism: geometric tile (no calligraphy); ch29 Maya: plastered stone |
| VIII Early Modern | black-and-white marble chequer, parquet, tin-glazed tiles | none |
| IX Modern | Victorian encaustic tile, oak parquet | none |

**Skies, where visible:** keep each room's sky choice and improve the detail:
- a two-layer cloud deck with softer edges;
- a real sun disc and halo on clear and golden skies;
- a moon and a denser star field on night skies;
- slow-moving high cirrus.

This happens within the same shader, with no new textures. The SwiftShader measurement (§6) suggests the sky and
diorama shaders are already the heaviest part of a frame, so each sky change is checked against the budget, and
phones get a lighter version if needed.

---

## 4. Lighting: flame instead of bulbs

**Today:**
- Every lamp is a glowing bulb hanging from the ceiling.
- Lighting comes from a hemisphere and an ambient light, plus a "lantern" that follows the visitor.
- A pool of 4 real point lights moves to the nearest lamps.

**Proposal, by wing:**

| Wing | Fittings |
|---|---|
| I Prehistory | pitch torches, a hearth in the corridor |
| II Bronze Age | clay saucer lamps in wall niches, bronze tripod braziers |
| III Early Iron Age | bronze braziers, Phoenician-style saucer lamps on stands |
| IV Axial Age | terracotta oil lamps on bronze lampstands, braziers |
| V Late Antiquity | hanging bronze polycandela with glass lamps, oil lamps |
| VI Early Medieval | hanging glass lamps (Byzantine and Islamic forms), torches in iron sconces in the northern rooms |
| VII High Medieval | iron pricket candelabra, torches in iron sconces, hanging glass mosque lamps *without* inscriptions |
| VIII Early Modern | brass candle chandeliers, wall candles, lanterns |
| IX Modern | Argand oil lamps and kerosene lanterns (the 19th century's own light) |

**How it stays fast on a phone:**
- **A few real lights.** At most **3 real point lights per room or hallway**, the nearest 3 fittings. Each
  flickers with a slow, slightly random intensity change. Everything else is faked.
- **Flames.** Each flame is a small animated shader quad (one shared material, instanced), with no light of its own.
- **Halos.** A soft additive glow sprite around each flame. The museum already uses one glow sprite for all lamps,
  and the new halos join it.
- **Baked light.** Warm pools of light under and around each fitting are painted once into the floor and wall
  textures when the room is built, so they cost nothing per frame.
- **The visitor's lantern.** It is dimmed and warmed so it reads as your own hand-held flame rather than a modern
  light. It can be removed instead *(decision D5)*.
- **Reduced motion.** With "reduce motion" on, flames hold still and nothing flickers.

---

## 5. Symbol walls in the hallways

**What it looks like:**
- Columns of symbols drift slowly down the hallway walls, like the "Matrix" code but calm and readable.
- The glow is soft and white: always dimmer than the torchlight, low contrast, slow (about one symbol-height per
  second or slower).
- Columns pause now and then, so a sign can be read.
- The glow fades out near the torches so it never competes with the flame.

**What streams:** each wing streams the writing systems and signs of its own era. To avoid ever spelling a word by
accident (a name, a sacred word, an insult), alphabets stream as **abecedaries**: the letters in their traditional
order. These are themselves a documented ancient form (school tablets and inscribed abecedaries survive for Ugaritic,
Phoenician, Greek and others). Non-alphabetic sign systems stream as sign lists.

| Hallway | Proposed signs (included by default) |
|---|---|
| I Prehistory | the abstract signs of Paleolithic cave art (dots, lines, grids, claviforms), drawn by us |
| II Bronze Age | Egyptian hieroglyphs from Gardiner's sign list (*no* cartouches or divine names spelled out), cuneiform signs, Linear B syllabary, Ugaritic abecedary |
| III Early Iron Age | Phoenician abecedary, archaic Greek abecedary, Chinese oracle-bone numerals, Ogham |
| IV Axial Age | Greek abecedary, Brahmi, Imperial Aramaic letters (abecedary), Chinese seal-script numerals |
| V Late Antiquity | Coptic, Gothic and Syriac abecedaries, Greek numerals |
| VI Early Medieval | Elder and Younger Futhark runes (abecedary only), Ogham, Glagolitic, Japanese kana |
| VII High Medieval | Latin abecedary in Gothic hand, Devanagari vowels and numerals, alchemical and astronomical signs |
| VIII Early Modern | alchemical and planetary signs, printers' marks and numerals |
| IX Modern | planetary and zodiac signs, I Ching trigrams |

**Excluded until Carter decides (decision D1).** Each of these is a name of God, sacred calligraphy, or a sign a
living community may object to seeing used as decoration:

| Sign | Why it is held back |
|---|---|
| Hebrew letters (any stream) | random or even ordered Hebrew can form יהוה or other divine names. Many observant Jews treat written divine names as sacred, and some object to Hebrew used as ornament. |
| Arabic script and calligraphy: *Allah*, the Shahada, the Basmala, any Qur'anic text | sacred calligraphy; Arabic used as decoration in a non-Muslim setting is widely objected to |
| Om ॐ | the sacred syllable of Hinduism; its decorative use is objected to by many Hindus |
| Ik Onkar ੴ and the Khanda | the central signs of Sikhism. Gurmukhi script itself is tied to the Guru Granth Sahib. |
| Tibetan script and mantras (*Om mani padme hum*) | sacred text, often treated as a holy object |
| The Bahá'í "Greatest Name" calligraphy and ringstone symbol | sacred calligraphy, a living community (the archive already takes care over Bahá'í images, e.g. V76) |
| Chi-Rho, IHS and other *nomina sacra* | abbreviations of the name of Christ |
| The swastika in any form (Hindu, Buddhist, Jain) | sacred in living traditions, but read by most Western visitors as a Nazi sign; needs context a wall cannot give |
| Runes with hate-symbol use: Othala with serifs ("wings"), the double Sowilo, the Wolfsangel, the Black Sun | listed by anti-hate organisations; the plain Elder Futhark abecedary is used instead, and checked so these forms never appear |
| Vodou vèvè | ritual drawings that call specific lwa; sacred to living practitioners |
| Aboriginal Australian designs; Navajo and other sandpainting designs | sacred and often restricted; the archive already shows none |
| The Star of David | the emblem of a living people and faith; fine in a chapter, but questionable as wall decoration |
| The pentacle | a living religious emblem (Wicca and modern Paganism) |
| The Sigil of Baphomet | the Church of Satan's emblem and registered mark; some visitors may find it offensive as decoration |
| Maya hieroglyphs | Maya communities today are reclaiming the script; no font exists anyway |

**How it's built:**
- The signs are drawn once into a small texture atlas (one WebP, about 60–120 KB) at build time, from open-licence
  Noto fonts (SIL OFL). The fonts are not shipped to visitors.
- One shader animates the columns: one draw call per wall, no lights, nothing to download per frame.
- A `verify-symbols.js` check confirms that no excluded sign or form is in the atlas.

---

## 6. Performance budget

**Baseline, measured 2026-10-06** (raw numbers: `audits/museum-visual-pass/`, script: `tools/museum-baseline.js`) on the current museum (`main` @ 3004790). The browser emulated a 412 × 915 phone
screen in headless Chromium. Graphics were software-rendered (SwiftShader) because this environment has no GPU, so
frame rates here are **relative only, not phone numbers**.

| Measure | Entrance hall | Bronze Age corridor | Egypt room (ch02) |
|---|---|---|---|
| Draw calls per frame | 38 | 79 | 65 |
| Triangles per frame | 31,178 | 191,170 | 104,459 |
| GPU textures | 14 | 31 | 43 |
| Frame rate, SwiftShader, no throttle, 1× pixel ratio *(relative)* | 5.8 | 0.2 | 0.1 |

| Load | Value |
|---|---|
| Page loaded | 0.7 s (no throttle); 3.0 s (4× CPU throttle) |
| First zone built and ready to walk | 11.6 s (no throttle); 19.2 s (4× throttle), software graphics |
| Downloaded to first walk | 1.78 MB (JS 1.39 MB, data 0.31 MB, CSS 49 KB, HTML 35 KB) |
| Downloaded after visiting the hall, a corridor and a room | 2.23 MB |
| JS heap | 31 MB |

**Two things the baseline shows:**
- The corridor has the most triangles (191k, from its diorama and fauna).
- The sky and diorama shaders make software rendering very slow, so they are the first thing to watch on a phone.

**Real phone numbers.** I'll add the archive's hidden frame-rate overlay (already used for the games) to the museum,
switched on only by `?fps=1` in the address. Carter opens the same spots on his phone before and after, and the overlay
shows the frame rate, the worst second and the longest frame.

**Budget for the pass.** Each number is measured before and after the sample and again after the rollout. A change
that breaks the budget does not ship.

| Measure | Budget |
|---|---|
| Frame rate on Carter's phone | sustained ≥ 30 fps walking a hallway and a room; worst 1-second window ≥ 24 fps; no worse than before |
| Draw calls per view | ≤ 100 (today 38–79) |
| Triangles per view | ≤ 220k (today up to 191k); relic upgrades use level-of-detail so a case seen from the corridor stays cheap |
| Real lights | ≤ 3 point lights per area, plus the hemisphere and ambient light (today: 4 pool lights + the lantern) |
| GPU textures per view | ≤ 60 (today up to 43); floors at most 1024 px, relic maps at most 1024 px on phones |
| Extra download, whole pass | ≤ 300 KB (atlases + code). Floors, flames and skies are code. If relic detail pushes `relics.js` (153 KB) over budget, it is split per wing and loaded on demand, so the first visit doesn't grow. |
| Time to first walk | no more than 10% slower than baseline |

---

## 7. The sample: one hallway and one room

**Sample: the Bronze Age corridor and the Egypt room (ch02).**
- It is the most iconic room: it holds V53 Rosetta, V43 Merneptah, V20 Papyrus of Ani and V34 Pyramid Texts.
- It is close to the entrance.
- It has the heaviest baseline numbers, so it is the hardest test of the budget.

The sample shows all five parts of the pass:
1. **Relic detail:** tier A, four models upgraded to published dimensions and matched surfaces, each with its
   reference note in the source log.
2. **Floors:** dressed limestone with a painted border in the room, baked brick and limestone in the corridor.
3. **Skies:** the golden corridor sky and the Egypt room's sky upgraded.
4. **Lighting:** clay lamps in niches and bronze tripod braziers, at most 3 real lights each.
5. **Symbol walls:** the Bronze Age signs in the corridor, with the exclusions above.

Plus the `?fps=1` overlay. The rest of the museum stays as it is.

**How Carter sees it:**
- I deploy the branch to the preview site (`preview.the-divine-archives.pages.dev`), not the live site.
- I send two links: one that opens straight into the corridor, one into the Egypt room. Each also has a `?fps=1`
  version.
- I also send before-and-after screenshots and the budget table refilled with the new numbers.

**Rollout after approval,** each step on its own preview first:
- floors, lighting and symbol walls, wing by wing;
- relic tiers B to D in batches of about 10, each through the reviewer like any other content.

Nothing merges to the live site without Carter's word.

---

## Decisions for Carter (before or with the sample)

- **D1 Symbol exclusions.** Keep the excluded list in §5 out of the walls entirely, or allow any of them? Recommended:
  keep them all out.
- **D2 Sensitive objects.** For the nine objects held in §2:
  - V26 Black Stone: the frame is photographed, the Stone itself rarely.
  - V27 Tooth Relic: the casket only, never the tooth.
  - V28/V29: the two Qur'an manuscripts. They currently show made-up Arabic-looking marks, which some may find worse
    than real text or a blank page.
  - V33 Kartarpur Bir: treated by Sikhs as a living Guru.
  - V46 Piprahwa: bone relics, offered for sale in 2025.
  - V64 Benin Bronzes: return claimed.
  - V77 Vèvè.
  - V88 the skull reliquary.

  Upgrade them like the others, upgrade them with a lighter touch, or leave them as they are? Recommended: leave
  them as they are for now and decide one by one later. For V28/V29, also decide whether to replace the made-up
  marks with a plain unwritten page.
- **D3 Real text on non-scriptural objects.** Some objects carry public-domain, non-scriptural text, such as the
  Rosetta Stone's Greek decree and the Behistun inscription. Should they show that real text, or keep illustrative
  marks? Recommended: keep the marks and match the line layout, which keeps the archive's line between rendition and
  replica.
- **D4 The sample.** Is the Bronze Age corridor and Egypt room the right sample?
- **D5 The visitor's lantern.** Keep it as a dim hand-held flame, or remove it?

---

## Appendix: every Vault object in the museum

"Holder's images": IIIF = a live image viewer from the holding institution; links = the holder's pages linked from
the Vault entry. "Placed in room" is the room whose case holds the object.

| # | Object | Type | 3D scan published | Holder's images | Placed in room | Also signposted from |
|---|---|---|---|---|---|---|
| V01 | The Voynich Manuscript | Full 3D |  | IIIF | ch28 | ch37 |
| V02 | The Dead Sea Scrolls | Full 3D |  | links | ch10 | ch16 ch17 ch19 ch45 ch50 |
| V03 | The Emerald Tablet | Full 3D |  | links | ch18 | ch17 ch21 ch28 ch37 |
| V04 | The Shroud of Turin | Full 3D |  | links | ch22 | ch31 ch60 |
| V05 | The Holy Lance (“Spear of Destiny”) | Full 3D |  | links | ch16 | ch22 ch49 ch60 |
| V06 | The Crown of Thorns | Full 3D |  | links | ch28 | ch49 ch60 |
| V07 | The Ark of the Covenant | Full 3D |  |  | ch07 | ch10 ch19 ch60 |
| V08 | The Nag Hammadi Codices | Full 3D |  |  | ch17 | ch16 ch45 ch55 |
| V09 | The Codex Gigas (“Devil's Bible”) | Full 3D |  | links | ch28 |  |
| V10 | The Copper Scroll | Full 3D |  |  | ch10 |  |
| V11 | The Rohonc Codex | Full 3D |  |  | ch31 |  |
| V12 | The Ketef Hinnom Silver Scrolls | Full 3D |  |  | ch07 | ch19 |
| V13 | The Tilma of Guadalupe | Full 3D |  |  | ch43 | ch48 |
| V14 | The Holy Grail | Full 3D |  |  | ch49 | ch14 |
| V15 | The True Cross | Full 3D |  |  | ch22 | ch31 ch60 |
| V16 | The James Ossuary | Full 3D |  |  | ch16 | ch10 |
| V17 | The “Gospel of Jesus's Wife” | Full 3D |  |  | ch16 |  |
| V18 | Codex Sinaiticus | Full 3D |  | links | ch16 | ch22 |
| V19 | The Book of Soyga | Full 3D |  |  | ch26 | ch37 |
| V20 | The Papyrus of Ani | Full 3D |  | links | ch02 | ch47 |
| V21 | The Book of Kells | Full 3D |  | links | ch14 | ch22 |
| V22 | The Mesha Stele | Full 3D |  | links | ch07 | ch58 |
| V23 | The Tel Dan Stele | Full 3D |  |  | ch07 | ch49 ch58 |
| V24 | The Sudarium of Oviedo | Full 3D |  |  | ch22 | ch28 |
| V25 | The Veil of Veronica | Full 3D |  |  | ch60 | ch31 |
| V26 | The Black Stone of the Kaaba | Full 3D |  |  | ch21 |  |
| V27 | The Sacred Tooth Relic | Full 3D |  | links | ch11 | ch20 ch49 ch53 |
| V28 | The Birmingham Qur'an Manuscript | Full 3D |  | links | ch21 |  |
| V29 | The Sana'a Palimpsest | Full 3D |  |  | ch21 |  |
| V30 | The Diamond Sutra of Dunhuang | Full 3D |  | links | ch11 | ch20 ch53 ch54 |
| V31 | The Dresden Codex | Full 3D |  | links | ch29 | ch43 ch46 ch50 |
| V32 | The Popol Vuh Manuscript | Full 3D |  | links | ch29 | ch01 ch46 ch47 |
| V33 | The Kartarpur Bir | Full 3D |  |  | ch34 | ch27 ch30 |
| V34 | The Pyramid Texts of Unas | Full 3D | yes |  | ch02 | ch47 ch49 ch50 |
| V35 | The Cyrus Cylinder | Full 3D | yes | links | ch03 | ch06 ch10 ch49 |
| V36 | The Rök Runestone | Full 3D | yes | links | ch23 | ch14 ch50 |
| V37 | The Gundestrup Cauldron | Full 3D |  | links | ch14 | ch47 ch51 |
| V38 | The Aleppo Codex | Full 3D |  | links | ch10 | ch19 |
| V39 | The Derveni Papyrus | Full 3D |  | links | ch08 | ch15 ch18 ch47 |
| V40 | The Gospel of Judas (Codex Tchacos) | Full 3D |  |  | ch17 | ch16 ch45 |
| V41 | The Codex Borgia | Full 3D |  | IIIF | ch43 | ch29 ch46 ch51 |
| V42 | The Lindisfarne Gospels | Full 3D |  | links | ch16 | ch14 ch22 |
| V43 | The Merneptah Stele | Full 3D | yes |  | ch02 | ch07 ch49 ch58 |
| V44 | The Pilate Stone | Full 3D |  |  | ch13 | ch10 ch16 |
| V45 | The Nebra Sky Disc | Full 3D |  | links | ch42 | ch46 |
| V46 | The Piprahwa Relics | Full 3D |  |  | ch11 | ch20 ch49 |
| V47 | The Kensington Runestone | Full 3D | yes | links | ch23 |  |
| V48 | The Great Isaiah Scroll | Full 3D |  | links | ch10 | ch07 |
| V49 | The Book of Enoch | Full 3D |  |  | ch10 | ch50 ch60 |
| V50 | The Vienna Dioscurides | Full 3D |  | links | ch60 |  |
| V51 | The Codex Mendoza | Full 3D |  | IIIF | ch43 |  |
| V52 | The Ishtar Gate | Full 3D |  | links | ch03 | ch10 |
| V53 | The Rosetta Stone | Full 3D | yes | links | ch02 | ch49 |
| V54 | The Behistun Inscription | Full 3D |  | links | ch06 | ch49 |
| V55 | The Oracle Bones of Anyang | Full 3D | yes |  | ch09 | ch49 |
| V56 | The Phaistos Disc | Full 3D |  |  | ch08 |  |
| V57 | The Holy Mandylion | Full 3D |  |  | ch60 | ch22 |
| V58 | The Lion Man of Hohlenstein-Stadel | Full 3D | yes | links | ch41 |  |
| V59 | The Venus of Willendorf | Full 3D | yes | links | ch41 | ch48 |
| V60 | Göbekli Tepe's Pillars | Full 3D |  | links | ch42 | ch41 |
| V61 | The Kojiki: the Shinpukuji Manuscript | Full 3D |  |  | ch25 | ch46 |
| V62 | The Inca Khipu | Full 3D |  | links | ch44 |  |
| V63 | The Kalpa Sutra Manuscripts | Full 3D |  | links | ch52 |  |
| V64 | The Benin Bronzes | Full 3D |  | links | ch33 |  |
| V65 | The Staff God of Tiwanaku | Full 3D |  |  | ch44 |  |
| V66 | The Kebra Nagast | Full 3D |  |  | ch60 | ch40 ch49 |
| V67 | The Aramaic Incantation Bowls | Full 3D |  | links | ch19 | ch56 |
| V68 | The Tjurunga of Central Australia | Text and photos only (no model, by rule) |  | links | ch61 |  |
| V69 | The Kumulipo | Full 3D |  | links | ch63 | ch46 |
| V70 | The Pictish Stones | Full 3D | yes | links | ch14 | ch22 |
| V71 | The Stećci: Medieval Tombstones of Bosnia | Full 3D | yes | links | ch60 | ch17 |
| V72 | The Book of Shadows | Full 3D |  | links | ch38 |  |
| V73 | The Book of the Law | Full 3D |  | links | ch37 |  |
| V74 | The Satanic Bible | Full 3D |  | links | ch39 |  |
| V75 | The Golden Plates | Full 3D |  | links | ch35 |  |
| V76 | The Báb's Star Tablet | Text and photos only (no model, by rule) |  | links | ch65 |  |
| V77 | The Haitian Vèvè | Full 3D |  | links | ch40 | ch33 |
| V78 | The Malleus Maleficarum | Full 3D |  |  | ch32 | ch31 |
| V79 | The Zohar, First Printings | Full 3D |  |  | ch26 | ch19 |
| V80 | The Sefer Yetzirah | Full 3D |  | links | ch26 | ch19 |
| V81 | The Mawangdui Silk Texts | Full 3D |  |  | ch12 | ch09 |
| V82 | The Bardo Thödol | Full 3D |  |  | ch53 | ch11 |
| V83 | The Codex Boturini | Full 3D |  | links | ch43 | ch29 |
| V84 | The Hinton St Mary Mosaic | Full 3D |  | links | ch16 | ch18 |
| V85 | The Picatrix | Full 3D |  |  | ch21 | ch37 |
| V86 | The Berlin Gold Hat | Full 3D |  |  | ch42 | ch14 |
| V87 | The Diwan Abatur | Full 3D |  |  | ch56 | ch17 |
| V88 | The Skull of “Mary Magdalene” at Saint-Maximin *(pending)* | Full 3D (purpose-built) |  |  | ch16 | ch45 ch31 |

---

## Sample built (2026-10-06)

Carter's decisions of 2026-10-06: plan approved; all held-back symbols stay off the walls; the nine sensitive objects
left as they are; V28/V29 shown with plain pages; real public-domain text only where a reliable transcription exists
(cited), never written or reconstructed; sample = Bronze Age corridor + Egypt room; the follow light becomes a dim
hand-held torch.

**What the sample has:**
- **Floors.** Baked brick with bitumen joints in the corridor; dressed limestone in the Egypt room. Kerbs at the
  glass: limestone in the corridor, and in the room the painted "block border" of New Kingdom palace floors.
- **Light.** Saucer lamps in wall niches and bronze tripod braziers:
  - corridor: 8 niches and 4 braziers;
  - room: 8 niches and 4 corner braziers.

  Only the nearest 3 flames are real lights, and they flicker. All flames are one draw call, and their light on
  floor and wall is painted on. The visitor's light is a dim, flickering hand-held torch everywhere.
- **The symbol wall.** In the corridor. Four sign lists, each in its traditional order:
  - the 25 one-consonant hieroglyphs (Gardiner numbers);
  - the cuneiform number signs 1–9 and 10–50;
  - the Linear B syllabary (Bennett numbers);
  - the 30-letter Ugaritic alphabet.

  129 signs in a 76 KB atlas. `tools/verify-symbols.js` passes, with nothing held back.
- **Sky.** More detailed over both areas: clouds lit on the sun's side, high cirrus, a halo round the sun.
- **Relics.**
  - V53 Rosetta Stone: modelled to 112.3 × 75.7 × 28.4 cm, with 14, 32 and 54 lines of marks, a rough back, and its
    dark grey and pink stone.
  - V43 Merneptah Stele: modelled to 3.18 × 1.63 m (some sources give 3.10 × 1.60), 28 lines, black granite, and the
    Amenhotep III inscription on the back.
  - V20 Papyrus of Ani: the 42 cm sheet height, with the register of seated gods above the weighing.
  - V34 Pyramid Texts of Unas: a gabled ceiling of five-pointed stars.
  - V28 and V29: plain pages.
  - Each object's source log has a "Museum rendition" note.
- **Tools.** `museum.html?fps=1` shows the frame-rate overlay. `museum.html#@02-bronze-age` and `museum.html#ch02`
  open straight into the corridor and the room.

**Limits of this environment, stated plainly:**
- The holders' photographs could not be opened here (British Museum, Wikisource, archive.org and Perseus are
  blocked), so the relics are matched to published measurements and descriptions, not to photographs. Carter's
  eye is the photo check.
- No public-domain transcription could be reached, so all writing is still marks:
  - The Rosetta Greek has a public-domain edition, Dittenberger, *OGIS* 90 (1903), but no copy of it could be reached.
  - The hieroglyphic and Demotic texts, and those of V43, V20 and V34, have no reliable public-domain Unicode
    transcription to copy.
- The Rosetta Stone's painted edges are left off, because the published wordings differ.

**Numbers, before → after** (same headless phone, same spots; software graphics, so frame rates are relative only;
raw files in `audits/museum-visual-pass/`):

| Measure | Budget | Hall | Bronze Age corridor | Egypt room |
|---|---|---|---|---|
| Draw calls | ≤ 100 | 38 → 40 | 79 → 93 | 65 → 86 |
| Triangles | ≤ 220k | 31k → 31k | 191k → 166k | 104k → 117k |
| GPU textures | ≤ 60 | 14 → 14 | 31 → 38 | 43 → 53 |
| Real lights | ≤ 3 per area | 4 + lantern | 4 + lantern → 3 + torch | 4 + lantern → 3 + torch |

| Load | Budget | Before | After |
|---|---|---|---|
| Downloaded to first walk | +300 KB for the whole pass | 1.78 MB | 1.90 MB (+119 KB) |
| Downloaded after hall, corridor and room | | 2.23 MB | 2.35 MB (+119 KB) |
| First zone ready, no throttle | ≤ +10% | 11.6 s | 12.5 s (+8%) |
| First zone ready, 4× CPU throttle | ≤ +10% | 19.2 s | 19.4 s (+1%) |

Real phone frame rates: Carter's walk, with `?fps=1`.

**Revision after Carter's walk-through (2026-10-06).**
- **The symbol wall now behaves like his reference video.** Signs fall from the ceiling toward the floor in drips:
  - each column releases drips at uneven intervals, each at its own speed and length, falling a little faster as it goes;
  - every sign keeps flipping to another, fastest at the head of the drip;
  - the glow is white with a soft halo, and faint ghost signs stay between drips.

  The panels now run from just above the dado to the ceiling. Because signs now change at random, the scripts
  alternate row by row (hieroglyph, cuneiform number, Linear B, Ugaritic), so no two signs of one script ever stand
  together and nothing can be spelled. The held-back list and `verify-symbols` are unchanged.
- **The flames are raised.** The Egypt room's niche lamps now sit at 3.45 m, well clear of the Pantheon medallions
  (whose tops are at 2.66 m). The corridor's sit at 2.3 m.
