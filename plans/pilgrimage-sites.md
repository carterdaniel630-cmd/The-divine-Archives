# The Pilgrimage: walkable sacred sites (plan, not built)

**Status (2026-10-04):** the **Great Pyramid is LIVE** (approved by Carter 2026-10-04 and merged; it carries the pending-review tag until he clears it). Its portal stands in the museum's entrance hall, and Pilgrimage is in the site's top menu. Every other site is **QUEUED**; sites are added one or two at a time later, each as one entry in `docs/assets/pilgrimage-data.js` plus its module folder. The Qumran caves stay the recommended next site.
**Track rule:** one or two sites at a time, alongside other work. This track never blocks existing work.

## What it is

The Pilgrimage is separate from the museum halls. Visitors reach real sacred sites through portals and walk
inside them. Each site holds copies of its relics, each linked to its Vault entry and chapter pages.
The relic museum (the Rotunda and nine wings) stays as it is.

**Fidelity target:** as faithful to the real place as a phone browser allows. That means high detail where
visitors look, simplified distance, and loading section by section.

**Ground rules:**
- We model every site ourselves.
- We never use other people's photos or 3D scans directly. Published plans and measurements are
  *references* for our own modelling. They are not copied.
- Any writing or painting on a wall is our own rendering in the manner of the original, never a traced
  copy. This follows the museum's rule for relic renditions (`docs/museum/relics.js`).
- Every on-site label follows the evidence-honesty standard. What the tradition holds and what the
  evidence shows are kept apart.

## Labels

| Label | Meaning | What the visitor sees |
|---|---|---|
| **(R)** | Lost or destroyed | A labelled **reconstruction**: what it rests on (texts, excavation, comparison) and what is guesswork |
| **(C)** | Claimed or traditional site | The **authenticity dispute** shown on site: the tradition's claim, the evidence, and who disputes it |
| **(S)** | Religiously restricted or sensitive | **Exterior only**, unless Carter approves otherwise |
| (©) | Modern-era building | The architect's copyright must be checked before modelling |

Labels in the "Suggested" column are my proposals. They aren't in force until Carter approves them.

---

## Master list

Chapter ids are the archive's own (`docs/assets/data.js`). Vault ids are the Vault's own (`docs/assets/vault-data.js`).

- **Direct** means the object was found at, or is kept at, the site.
- **Related** means the object belongs to the same tradition but not to the site. A related object is shown only as a clearly labelled comparison, never as if it belonged there.

### Rotunda

| Site | Chapters | Vault | Label | Suggested / notes |
|---|---|---|---|---|
| Mount Ararat & the Ark tradition | ch01 The Flood | none | **(C)** | Genesis 8:4 says "the mountains of Ararat" (a region), not the peak now called Ararat. No Ark remains are verified. Model the mountain and the tradition; no "ark site". |

### I · Prehistory

| Site | Chapters | Vault | Label | Suggested / notes |
|---|---|---|---|---|
| Göbekli Tepe | ch42, ch41 | **V60** Göbekli Tepe's Pillars (direct, in place) | — | Strong first-wave candidate after the pilot pair. |
| Lascaux | ch41 | none | — | The cave is closed to the public. Model the painted halls from published surveys. The paintings are our own renderings. |
| Chauvet | ch41 | none | — | Closed. As Lascaux. |
| Çatalhöyük | ch42, ch48 | none (V59 Venus of Willendorf related, ch48) | — | — |
| Stonehenge | ch42 | none (V45 Nebra Sky Disc related: Bronze Age sky-watching) | — | — |
| Newgrange | ch42 | none | — | The winter-solstice light box is a natural set-piece. |
| Drakensberg rock art | ch66 | none | — | Many panels are on San heritage land. Check with heritage bodies on image use. |
| Uluru | ch61 | none (**V68 Tjurunga: never placed**, secret-sacred) | **(S)** | Anangu restrict photography of sensitive sites, and climbing closed in 2019. Exterior from a distance only. No sensitive sites modelled. |

### II · The Bronze Age

| Site | Chapters | Vault | Label | Suggested / notes |
|---|---|---|---|---|
| **Great Pyramid interior** · **LIVE (pending review)** | ch02, ch49, ch47 | none direct; V34 Pyramid Texts of Unas related (comparison only) | — | **LIVE, pending review.** See plan below. Its Vault links are weaker than expected: no Vault object comes from Khufu's pyramid. |
| Tomb of Tutankhamun (KV62) | ch02, ch47 | none (V20 Papyrus of Ani related) | — | The wall paintings are our own renderings. |
| Tomb of Nefertari (QV66) | ch02, ch47 | none (V20 related: Book of the Dead scenes) | — | Access is restricted for conservation, so we rely on published surveys. |
| Karnak | ch02, ch49 | none (V43 Merneptah Stele related: Theban) | — | Large. Model the hypostyle hall first. |
| Ziggurat of Ur | ch03 | none (V52 Ishtar Gate related) | — | The upper stages are reconstructed. Mark them **(R)** within the site. |
| Knossos | ch67, ch08 | none (V56 Phaistos Disc related: Cretan) | — | **Suggested (C) note:** Evans's concrete restorations are themselves contested. Show what is Evans's and what is Minoan. |
| Great Bath, Mohenjo-daro | ch04 | none | — | Its ritual purpose is an interpretation. Say so on site. |
| Hattusa | ch57 | none | — | Yazılıkaya is the natural "sanctuary" section. |
| La Venta | ch76 | none | — | Many monuments were moved to the Parque-Museo La Venta, Villahermosa. Model the site as excavated and say where the monuments are now. |

### III · The Early Iron Age

| Site | Chapters | Vault | Label | Suggested / notes |
|---|---|---|---|---|
| Solomon's Temple | ch07, ch10, ch19 | V07 Ark of the Covenant (no verified object; texts only), V12 Ketef Hinnom, V23 Tel Dan Stele (related) | **(R)** | **Also (C):** no remains of the temple have been excavated, and its date and scale are debated. The reconstruction follows 1 Kings 6–7 and its contemporary parallels (for example 'Ain Dara), and says so. |
| Delphi | ch08, ch15 | none (V39 Derveni Papyrus related) | — | The vapours theory of the oracle is contested. Show it as such. |
| Mount Olympus | ch08, ch15 | none | — | A mountain, not a building. Possibly a Rotunda-style panorama rather than a walk-in site. |
| Yinxu at Anyang | ch09, ch49 | **V55 Oracle Bones of Anyang** (direct) | — | Strong Vault link. Good second-wave candidate. |
| Meroë pyramids | ch68 | none | — | — |
| Tarquinia Etruscan tombs | ch77 | none | — | Painted tombs (Tomb of the Leopards and others). Paintings are our own renderings. |

### IV · The Axial Age

| Site | Chapters | Vault | Label | Suggested / notes |
|---|---|---|---|---|
| **Library of Alexandria** · PREVIEW (built 2026-10-10 as a labelled reconstruction, noindex, off the menu, pending review) | ch15, ch17 | none (V53 Rosetta Stone related: Ptolemaic) | **(R)** | Almost nothing of its plan is known. The reconstruction is mostly conjecture and must say so loudly. The "single great fire" story is itself a myth to correct. |
| Parthenon | ch15 | none | — | Show it as it stands, with an optional colour reconstruction (traces of paint are documented), labelled (R). |
| Herod's Temple | ch10, ch16, ch19 | none (V44 Pilate Stone related) | **(R)** | Sources: Josephus, Mishnah Middot, and excavation around the Temple Mount. Where they conflict, say so. |
| **Qumran caves** · PREVIEW (built 2026-10-10, noindex, off the menu, pending review) | ch10, ch16, ch17, ch19, ch50 | **V02** Dead Sea Scrolls, **V48** Great Isaiah Scroll (Cave 1), **V10** Copper Scroll (Cave 3), **V49** Book of Enoch (Aramaic fragments, Cave 4), all direct | — | **Pilot site.** See plan below. Note: the site is in the West Bank. Wording stays neutral (see below). |
| Persepolis | ch06, ch49 | none (V35 Cyrus Cylinder, V54 Behistun related) | — | — |
| Bodh Gaya (Mahabodhi) | ch11, ch20 | none (V46 Piprahwa, V27 Tooth Relic related) | — | An active temple. **Suggested:** sanctum exterior only, pending your call. |
| Great Stupa at Sanchi | ch11, ch20 | none (V46 related) | — | — |
| Eleusis | ch18, ch15 | none (V39 related) | — | The rites were secret. The Telesterion is modelled from excavation. The rites are **not** dramatised. |
| Pantheon (Rome) | ch13 | none | — | Now a church (Santa Maria ad Martyres). |
| Temple of Confucius, Qufu | ch12 | none | — | — |

### V · Late Antiquity

| Site | Chapters | Vault | Label | Suggested / notes |
|---|---|---|---|---|
| Church of the Holy Sepulchre | ch16, ch22, ch60 | V15 True Cross (tradition of its finding there), V05 Holy Lance (related) | **(C)** | Shared by six denominations under the Status Quo. Keep wording neutral. |
| Garden Tomb | ch16, ch31 | none | **(C)** | The tomb is generally dated by archaeologists to the Iron Age. Show that beside the 19th-century identification. |
| Roman catacombs | ch16, ch22 | none (V84 Hinton St Mary Mosaic related) | — | — |
| Hagia Sophia | ch60, ch22, ch21 | none (V57 Mandylion related) | — | **Suggested:** a mosque again since 2020. Respect current use: no models of prayer, mosaics as documented. |
| Mithraeum under San Clemente | ch18 | none | — | — |
| Petra | ch70 | none | — | — |
| Aksum | ch79, ch60 | V07 Ark (C), V66 Kebra Nagast | — | **Suggested (S)** for the Chapel of the Tablet, where only the guardian monk enters. Exterior only. The rest of Aksum (stelae, Maryam Tsion) is open. |
| Mogao Caves | ch20, ch53, ch54 | **V30 Diamond Sutra** (direct: found in the "Library Cave", Cave 17) | — | Strong Vault link. Cave paintings are our own renderings. |
| Dome of the Rock | ch21 | none | **(S)** | Exterior only. |
| Kaaba | ch21, ch70 | **V26 Black Stone** (direct) | **(S)** | Exterior only, and **suggested: no figures in the courtyard.** Mecca is closed to non-Muslims, and the site's sanctity calls for the most care of any site on the list. |

### VI · The Early Medieval

| Site | Chapters | Vault | Label | Suggested / notes |
|---|---|---|---|---|
| Great Mosque of Córdoba | ch21 | none | — | It is a cathedral today, and its use is disputed. Note it neutrally. |
| Borobudur | ch20, ch53 | none | — | — |
| Kailasa Temple, Ellora | ch24, ch30, ch69 | none | — | Ellora also has Jain caves (ch52) and Buddhist caves (ch11). |
| Jokhang Temple | ch53 | none | — | **Suggested:** sanctum exterior only, and neutral wording on the political context. |
| Lindisfarne | ch22, ch14 | **V42 Lindisfarne Gospels** (direct, made there) | — | Strong Vault link. Mostly ruins: show the priory as it stands, with its reconstruction labelled. |
| Uppsala temple | ch23 | none (V36 Rök Runestone related) | **(R)** | Known mainly from Adam of Bremen (c. 1070), whose account is contested. Excavation found a large hall. Keep both on site. |
| Ise Grand Shrine | ch25 | none (V61 Kojiki related) | **(S)** | Exterior only. The inner precinct is closed even to most visitors, and it is rebuilt every 20 years. |

### VII · The High Medieval

| Site | Chapters | Vault | Label | Suggested / notes |
|---|---|---|---|---|
| Chartres Cathedral | ch28, ch48 | none | — | Glass and labyrinth are natural set-pieces. |
| Notre-Dame de Paris | ch28 | **V06 Crown of Thorns** (direct) | — | Needs a decision: show it as restored (2024), as before 2019, or both. |
| Angkor Wat | ch69, ch30, ch20 | none | — | Built as a Vishnu temple, later Buddhist. |
| Chichén Itzá | ch29 | none (V31 Dresden Codex related) | — | The equinox "serpent" shadow is real. Claims that it was designed for it are debated. |
| Templo Mayor | ch43 | none (V41 Codex Borgia, V51 Codex Mendoza, V83 Codex Boturini related) | **(R)** | The excavated stages are known; the upper temple is reconstructed. |
| Machu Picchu | ch44 | none (V62 Inca Khipu related) | — | Its function (royal estate) is now well supported. Note it. |
| Coricancha, Cusco | ch44 | none | — | **Suggested: partly (R).** Inca walls stand under the Santo Domingo convent. The gold sheathing is reconstructed from Spanish accounts. |
| Lalibela | ch79, ch60 | none (V66 Kebra Nagast related) | — | Active churches. **Suggested:** no modelled services. |
| Montségur | ch72 | none | — | **Suggested (R)/(C) note:** the standing castle is a later rebuild, not the 1244 Cathar fortress. |

### VIII · The Early Modern

| Site | Chapters | Vault | Label | Suggested / notes |
|---|---|---|---|---|
| St. Peter's Basilica | ch31, ch22 | V25 Veil of Veronica (claimed held there) and V05 Holy Lance (relic held there), both (C) as objects | — | — |
| Sistine Chapel & the Vatican | ch31, ch28 | V41 Codex Borgia and V87 Diwan Abatur (Vatican Library copies), V57 Mandylion of the Vatican | — | The frescoes would be our own simplified renderings. Michelangelo's work is public domain, but a faithful copy is out of reach, so say "rendering". |
| Golden Temple (Harmandir Sahib) | ch34 | none (V33 Kartarpur Bir related) | — | **Suggested (S)** for the sanctum, where the Guru Granth Sahib is installed. The causeway and pool are open. Ask your call. |
| Fatehpur Sikri | ch82 | none | — | The Ibadat Khana's location is debated. Say so. |
| Taj Mahal | ch82, ch27 | none | — | — |
| Wittenberg Castle Church | ch31 | none | — | Whether Luther posted the theses on the door is debated. The bronze doors date from 1858. |
| Benin royal palace | ch33 | **V64 Benin Bronzes** (direct: looted from the palace in 1897) | **(R)** | Highly sensitive: restitution under way, and the Benin scan is on hold. **Suggested:** no relic copies until you decide. |

### IX · The Modern Age

| Site | Chapters | Vault | Label | Suggested / notes |
|---|---|---|---|---|
| Hill Cumorah | ch35 | V75 Golden Plates (no physical object) | — | **Suggested (C):** the site of the plates' recovery is a faith claim. |
| Shrine of the Báb | ch65 | V76 Báb's Star Tablet (no images of the Báb) | — | **Suggested (S) and (©).** It holds the Báb's remains, and the Bahá'í World Centre restricts access. Check copyright on the terraces (built 1990–2001). |
| Lily Dale | ch36 | none | — | An active community. |
| Bois Caïman | ch40 | none (V77 Haitian Vèvè related) | — | **Suggested (C):** historians debate details, and even the date, of the 1791 ceremony. |
| Azusa Street Mission | ch64 | none | **(R)** | Demolished in 1931. Built from photographs and accounts as references only. (©) doesn't apply. |

**Count:** 72 sites (1 in the Rotunda and 71 across the nine eras). **1 LIVE** (the Great Pyramid, pending review); **71 QUEUED** (every other site, including the Qumran caves). Pilot pair: the Great Pyramid interior and the Qumran caves.

**Strongest Vault links for later waves** (an object found at, or kept at, the site): Göbekli Tepe (V60),
Yinxu (V55), Mogao (V30), Lindisfarne (V42), Notre-Dame (V06), and Qumran (V02, V10, V48, V49).

---

## Pilot pair, step 3: the Great Pyramid interior and the Qumran caves

Both pilots share one pipeline. Proving it here is the point, before St Peter's.

### Shared pipeline

- **Where it lives:** one page per site, `docs/pilgrimage/<site>.html`. It is `noindex` and labelled beta, like
  the museum. It reuses the museum's engine (vendored three.js; `inspect.js` for turning and opening objects;
  `relics.js` for the relic renditions; `sound.js`). The museum's own files don't change. The only change on the
  museum side is one portal doorway per site.
- **How a site is described:** a data file, `docs/pilgrimage/sites/<site>.json`. It lists sections, rooms and
  passages as boxes, slopes and corbels in metres, *with the source of every dimension beside it*, plus the
  relic placements and the on-site labels. A builder module turns it into geometry. Textures (limestone,
  granite, marl, plaster) are drawn in code on canvases, as the museum does. No photographs.
- **Checks:**
  - `tools/verify-pilgrimage.js` checks that every factual line on a site label appears in its source chapter or
    Vault entry. This is the same rule as the games' `verify-*.js`, added to `verify.yml`.
  - Playwright runs a frame-rate and load-time check, extending `tools/fps-games.js`.
  - The Lighthouse CI gets one row per site.
- **Portals:** a doorway in the museum room of the site's home chapter. Clicking it goes to the site page. The
  site's exit portal returns to that same room (`museum.html#<room id>`, which the museum already supports).
  The Vault pages of directly linked objects get a "Walk to where it was found" link.

### Mobile performance budget (both sites)

These come from the museum's measured budgets (`museum/01-build/REPORT.md`), tightened because a site is one
building:

| Item | Budget |
|---|---|
| First section (beyond the cached engine) | ≤ 1.5 MB |
| Each further section, loaded as you approach | ≤ 1 MB, prefetched from about 20 m away |
| Whole site | ≤ 4 MB |
| Draw calls | ≤ 80 (target 60) |
| Triangles in view | ≤ 150 k (target 100 k) |
| Texture memory | ≤ 64 MB, canvases no bigger than 1024 px |
| Dynamic lights | ≤ 3 (the visitor's lamp plus two) |
| Frame rate, emulated mid-range phone, CPU ×4 | ≥ 30 fps |
| Cold start to first step, fast 4G | ≤ 5 s |

Dark interiors help: fog and lamplight hide distance, so far geometry can be very simple.

---

### Pilot A: the Great Pyramid of Khufu, interior

**Label:** none of R/C/S. The building stands and its interior is open to visitors.

**On-site notes, keeping belief and evidence apart:**
- **Well supported:** Khufu's pyramid, 4th Dynasty (about 2560 BCE). Workers' painted marks naming Khufu survive in the relieving chambers.
- **Not supported:** claims that those marks were forged in 1837, and "power plant" or lost-civilisation theories.
- **Genuinely open:** construction methods (ramps), the purpose of the shafts, and what the 2017 "Big Void" is.

**Layout: five sections, loaded in walking order**

1. **North face and entrance** (the portal arrival point). The original entrance with its chevron gables, and the
   lower tunnel visitors use today. The tunnel is traditionally attributed to the caliph al-Ma'mun (9th century),
   and the label says "traditionally". The exterior is low detail apart from the entrance.
2. **Ascending passage.** Narrow and steep (about 26°). The granite plug-blocks are shown in place where the
   tunnel bypasses them.
3. **Grand Gallery.** Corbelled walls rising about 8.6 m over about 47 m of length, with side ramps and their
   regular slots. This is the showpiece, so it gets the most detail.
4. **Antechamber and King's Chamber.**
   - The antechamber has its portcullis slots.
   - The King's Chamber is red granite, about 10.5 × 5.2 m and 5.8 m high, with the lidless granite sarcophagus
     and the two shaft openings.
   - The five relieving chambers above are shown as a **cut-away "look up" view, not walkable**. They are not
     open to the public, and their painted marks are an inspectable panel.
5. **Queen's Chamber.** Its corbelled niche and its two shafts. The small "door" found in the southern shaft by the
   Upuaut robot (1993) is shown as a labelled detail.
   - Later, as a phase 2 section: the **descending passage and the unfinished subterranean chamber**.

**Shown as outlined volumes only, never walkable:**
- The **ScanPyramids Big Void**: detected by muon imaging (2017), never entered. Its shape is uncertain and its
  purpose unknown.
- The **North Face Corridor**: detected by muon imaging, then seen through a 5 mm endoscope in February 2023.
  It is about 9 m long with a 2 × 2 m section.

Both carry their sources on the label.

All dimensions above are approximate and for planning. The build takes every dimension from Petrie's tables,
records it in `great-pyramid.json`, and cross-checks it against the later surveys.

**Reference sources for accuracy (checked to exist, 2026-10-04):**
- W. M. Flinders Petrie, *The Pyramids and Temples of Gizeh* (1883). The base survey for the interior
  measurements. Public domain. PDF at the Giza Archives:
  https://www.gizapyramids.org/static/pdf%20library/petrie_gizeh.pdf
- Harvard's Giza Project (Digital Giza): the documentation archive and its own 3D model of the Khufu complex,
  https://giza.digitalhumanities.fas.harvard.edu/. **Reference only.** We don't copy their model.
- K. Morishima et al., "Discovery of a big void in Khufu's Pyramid by observation of cosmic-ray muons",
  *Nature* (2 Nov 2017). Preprint: https://arxiv.org/abs/1711.01576
- S. Procureur et al., on the North Face Corridor, *Nature Communications* (March 2023). Record:
  https://doaj.org/article/e66f8c98ed7e459ca848a366b07c735d
- To consult when building, for cross-checking only, not copying (both in copyright):
  - V. Maragioglio and C. Rinaldi, *L'architettura delle piramidi menfite*, part IV (1965);
  - M. Lehner, *The Complete Pyramids* (1997).
  - Their exact page references go into the site file at build time.

**Relic copies to place:**
- **In situ (new renditions, part of the building, not Vault objects):**
  - the King's Chamber sarcophagus;
  - the relieving-chamber marks, as our own rendering of painted gang marks with the Khufu cartouche.
- **From the Vault:** none belongs here. **V34, the Pyramid Texts of Unas**, can stand in the exit hall as a
  labelled comparison: "About 200 years later, the first pyramid to carry texts: Unas, at Saqqara". It reuses the
  existing `relics.js` rendition. Its label must say plainly that this text is not from Khufu's pyramid.
- **Possible future Vault candidates** (new content, so they need your approval): the Khufu ivory statuette
  (Egyptian Museum, Cairo), the only certain three-dimensional image of the king; and Khufu's boat (Grand
  Egyptian Museum).

**Portal connection:**
- **In:** a doorway in the museum's ch02 Egypt room (Bronze Age wing), and a link on the ch02 chapter page.
- **Out:** back to the ch02 room.

**Asset list:**
- One site file, `great-pyramid.json`: 5 sections and about 40 dimensioned elements.
- Geometry builders: passage, corbelled gallery, granite chamber, shaft, and the volume outline (the outline
  can be reused).
- 3 canvas textures: Tura limestone, core limestone and Aswan granite, each with a normal map.
- 2 in-situ objects: the sarcophagus and the marks panel.
- 1 reused relic (V34).
- About 8 labels.
- Optional sound: room tone, and the King's Chamber resonance as a simple reverb (no claims made about it).

**Effort:** medium to large, about 2–3 sessions. The Grand Gallery and the sloped passages are the main work.

---

### Pilot B: the Qumran caves

**Built 2026-10-10 as a preview** (branch `claude/pilgrimage-qumran-alexandria`): `docs/pilgrimage/qumran-caves.html`, module `docs/pilgrimage/sites/qumran-caves/`, shared cave builder `docs/pilgrimage/cave.js`, sources `sources/pilgrimage-qumran-caves.md`. Status `preview` in `pilgrimage-data.js`: the page exists (noindex) but the Pilgrimage list shows it as coming and the museum has no portal to it until Carter approves. The DJD plans could not be opened, so every cave size is an estimate (dims.js says APPROX); the planned `qumran.json` became `dims.js` + section modules, as for the Great Pyramid.

**Label:** none of R/C/S. The caves are real and are seen from visitor paths. Two notes go on site:

- **Contested, shown on site:**
  - whether the community at Khirbet Qumran wrote or kept the scrolls;
  - whether they were Essenes;
  - whether the caves were a library, a genizah, or emergency hiding places;
  - what the rows of holes in Cave 4's walls were for (shelf supports is one reading).
- **Neutral note on place and ownership:** the site is in the West Bank. Some scrolls are in the Israel Museum,
  and the Copper Scroll is in the Jordan Museum in Amman. Their ownership is disputed. The label states where each
  object is held and that ownership is disputed, and takes no side.

**Layout: three caves plus the terrace, each its own section**

1. **The marl terrace** (the portal arrival point). It looks across to the openings of Caves 4, 5 and 10 cut into
   the terrace, with the ruins of Khirbet Qumran as a low-detail backdrop. The terrace is the hub: each cave is a
   short walk or a fade.
2. **Cave 4 (4Q)**, carved by hand into the soft marl. Two chambers (4a and 4b), with the rows of holes in the
   walls. Excavated in September 1952 by de Vaux, Harding and Milik after Bedouin finds. More than 15,000
   fragments came from here. This is the biggest section.
3. **Cave 1 (1Q)**, a natural limestone cave in the cliffs north of the site. The first scrolls were found here
   in 1946–47, in jars. A small space with a crawl-in entrance.
4. **Cave 3 (3Q)**, a natural cave, partly collapsed, where the 1952 expedition found the Copper Scroll. A small
   space, mostly rubble.

**Relic copies to place:**
- **Cave 1:** **V02** (the existing rendition: a Qumran jar with its lid, and a scroll) and **V48**, the Great
  Isaiah Scroll (1QIsaᵃ), the existing scroll rendition.
- **Cave 3:** **V10**, the Copper Scroll. The existing rendition shows the oxidised copper cut into segments.
- **Cave 4:** **V49**, the Book of Enoch. Here the honest object is a scatter of Aramaic fragments
  (4Q201–212), not the complete Ge'ez book. The existing rendition is the Ethiopic book, so Cave 4 needs a new
  "fragments" rendition, labelled as illustrative script (as all relic writing is).
- Each object links to its Vault page and to ch10 Second Temple Judaism, plus ch16 / ch17 / ch19 / ch50 as its
  Vault entry lists.

**Portal connection:**
- **In:** a doorway in the museum's ch10 Second Temple Judaism room (Axial Age wing). Each of the four Vault
  pages also gets a "Walk to where it was found" link to its cave.
- **Out:** back to the ch10 room.

**Reference sources for accuracy (checked to exist, 2026-10-04):**
- R. de Vaux and J. T. Milik, *Qumrân grotte 4. II* (Discoveries in the Judaean Desert VI, Oxford, 1977). Its
  "Archéologie" section by de Vaux covers Cave 4.
  Record: https://orion-bibliography.huji.ac.il/orion_editor/node/104819
- J. Magness, *The Archaeology of Qumran and the Dead Sea Scrolls* (Eerdmans, 2002). The standard archaeological
  synthesis, and the source for the debate over the site and the caves.
- Leon Levy Dead Sea Scrolls Digital Library (Israel Antiquities Authority), https://www.deadseascrolls.org.il/.
  A reference for the fragments' appearance only. Its images are not copied.
- The Hebrew University excavation that identified a looted "Cave 12" (Gutfeld and Ovadia, 2017), as context for
  how the caves were found and robbed. Report: https://www.sci.news/archaeology/qumran-cave-12-dead-sea-scrolls-04607.html.
  Its primary publication is to be cited at build time.
- To consult when building:
  - DJD I (*Qumran Cave 1*, 1955) and DJD III (*Les 'Petites Grottes' de Qumrân*, 1962) for the plans of
    Caves 1 and 3;
  - de Vaux, *Archaeology and the Dead Sea Scrolls* (Schweich Lectures, 1959; English edition 1973).
  - Their exact page references go into the site file at build time.

**Asset list:**
- One site file, `qumran.json`: 4 sections, with cave outlines taken from the DJD plans.
- Geometry: an irregular-cave builder (a lofted outline with noise, reusable for Lascaux, Chauvet and Mogao) and a
  terrace heightfield.
- 3 canvas textures: marl, limestone and rubble.
- 3 reused relics (V02, V48, V10) and 1 new one (V49 fragments).
- About 8 labels.
- Sound: wind, and dripping in the caves.

**Effort:** medium, about 1–2 sessions. Simpler than the pyramid. Its main new piece is the cave builder, which
the later cave sites reuse.

### Suggested order

Qumran first (it is simpler, has four direct Vault links, and builds the reusable cave builder), then the Great
Pyramid. Each goes to you as a branch with screenshots and the performance numbers before anything is linked from
the live museum.

## The Library of Alexandria (built 2026-10-10 as a preview)

A labelled reconstruction (R) in the Great Pyramid's style: the archive's vestibule, then Strabo's "public walk" and "exedra with seats" (a colonnaded court, outdoors) and his "large house" with the scholars' common table, plus a book room of wall niches after later Roman libraries. Every card says what is attested and what is conjecture. Module `docs/pilgrimage/sites/library-of-alexandria/`, sources `sources/pilgrimage-library-of-alexandria.md`. Status `preview`, noindex, off the menu, pending review.

## Needs Carter's decision before any build

1. Approve the pilot pair plan, and the order (Qumran first).
2. Approve or change the **suggested** labels in the master list:
   - Bodh Gaya, Jokhang and Golden Temple sanctums;
   - Aksum's Chapel of the Tablet;
   - the Kaaba's empty courtyard;
   - Shrine of the Báb (S) and (©);
   - Hill Cumorah (C) and Bois Caïman (C);
   - Coricancha, Montségur and Knossos notes.
3. Benin palace: no relic copies until you decide on the Benin Bronzes.
4. Notre-Dame: show it as restored, as before the fire, or both.
5. New Vault candidates for the Great Pyramid (the Khufu statuette, Khufu's boat): yes or no. They would be new
   content and go through the normal review.

---

## Where the portals go (Carter, 2026-10-06: "one main archives portal … or simply put the portal on the corresponding rooms")

**Recommended: both, in two layers.**

1. **Each site's portal stands in its own chapter room.** It is the same golden archway as the Pyramid's, on the
   room's back wall, so visitors meet each site where they are reading about it.
2. **The entrance hall's archway becomes the main Pilgrimage gate.** It already opens a card listing every live site.
   It keeps doing that, now for every site, so the 72 sites never need 72 archways in one place.

**Rules:**
- **At most one archway per room.** When two sites belong to the same chapter, the archway opens the card with a
  choice between them.
- **Back through the archway, you return to that room.** Coming back from a site lands you in the room whose archway
  you used, or in the entrance hall if you went in through the main gate.
- **(S) sites get no archway inside a room for that tradition's sanctum.** The archway leads to the exterior site only.

| Site | Room with its archway | Also in the main gate |
|---|---|---|
| Great Pyramid (live) | ch02 Egypt (new) | yes, as now |
| Qumran caves | ch10 Second Temple Judaism | yes |
| Golgotha and the Tomb, c. 30 CE (proposed, `plans/pilgrimage-jerusalem.md`) | ch16 Early Christianity | yes |
| Mount of Olives, c. 30 CE (proposed) | ch16 Early Christianity (shares the archway with the Tomb: a choice card) | yes |
| Göbekli Tepe | ch42 The Neolithic | yes |
| Mogao Cave 17 | ch20 Mahayana Buddhism | yes |
| the rest | the first chapter listed for the site in the master list | yes |

The hidden arcade is the one exception. It has no listing in the main gate, and its only way in is the secret in the
Bronze Age wall (`plans/hidden-arcade-and-easter-eggs.md`).
