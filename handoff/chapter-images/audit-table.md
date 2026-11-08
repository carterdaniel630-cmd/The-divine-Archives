# Chapter Images Audit — The Divine Archives (getconexto.com)
**Date:** 2026-11-06 · **Ordered by:** Carter, 2026-11-06, under the new standing Images Rule: *for every chapter, where the text discusses a sourced subject (a named object, manuscript, figure, or place) and an image of it exists or is held by us, that image must be on the website — across the board, every chapter.*
**This is a GAP REPORT only. Nothing was fixed, edited, downloaded, or changed on the site or in the repo.**

---

## How this was counted (basis for every claim)

- **Chapter list (84 live):** verified two ways that agree exactly — the repo's chapter sources (77 era chapters in `eras/` + 7 comparative-theme chapters in `themes/`, ch01 + ch46–51) and the live site's own era/theme listings. Live chapter pages are `getconexto.com/chapters/chNN.html`.
- **Page images:** read from the live pages themselves (fetched page text, in which images surface as their captions/alt text). **56 of 84 pages were read** (39 in full, 17 in part) before the page-fetch service returned a rate-limit stop (429); the remaining **28 pages are marked UNVERIFIED** below — their subject lists were taken from the repo chapter source text (the same text the pages render), and their live image status is stated as unverified, never guessed.
- **Subjects counted:** the principal named sourced subjects per chapter — named objects, manuscripts, places/sites, and figures with well-known physical depictions — as listed by the page readers (capped at ~12 most prominent per chapter) or, for unread pages, the bolded named subjects in the chapter source text. **905 is therefore a floor, not a census of every named thing in ~390,000 words.**
- **"Imaged on page" test:** an image counts as a subject's image only if it depicts that subject. Every chapter page's one hero picture is captioned on the page itself as an *"Interpretive illustration… an original rendering… not a copy of any panel/object"* — a motif artwork, not an image of any sourced subject. It therefore does **not** satisfy the rule for any subject, including when its motif is drawn from one (e.g. ch43's Sun-Stone-motif hero, ch77's Piacenza-liver hero).
- **Held images (†):** a subject is tagged **held** when we already hold an image of it: (a) it is a Vault entry V01–V88 (other than V68) — per the relic queue's own record, all of those have finished armory builds, and build captures are held on disk (armory census, Oct 26, 2026: 132 finished / 132 renderings); the builds are live 3D scenes, so a clean still can be re-rendered at any size (proven route, relic-products prep 2026-11-05); or (b) it matches a non-Vault armory build by name (e.g. Aztec Sun Stone, Moai, Mjölnir, Shaman's Drum, Spirit Board). Ten held pieces already have print-resolution renders from the wallpaper pack (Nebra Sky Disc, Aztec Sun Stone, Ishtar Gate, Gundestrup Cauldron, Emerald Tablet, Rosetta Stone, Moai, Crystal Skull, Sutton Hoo Helmet, Singing Bowl). Vault *entry pages* themselves also carry subject imagery in at least some cases (e.g. V01's entry runs live page scans from Yale's own image server) — the imagery exists inside the site's own system; it is the **chapter pages** that carry none of it.
- **Outside (no tag):** no image held; the fix needs a rights-clean outside source — in practice Wikimedia Commons / holding-museum open images (public-domain or freely licensed museum photography exists for most famous objects and sites; per-piece licence check still required at build time — not done here, nothing downloaded).
- **Excluded (‡):** exactly one subject must **not** be imaged — see §4.

---

## Summary counts

| Measure | Count | Basis |
|---|---|---|
| Live chapters | **84** | Repo sources + live listings, agreeing |
| Pages read live | 56 (39 full, 17 partial) | This audit |
| Pages UNVERIFIED (fetch rate-limit stop) | 28 | Listed in §6 |
| Chapters with **zero images of any kind** | **0 verified** | Every one of the 56 pages read carries exactly **1** image — the hero interpretive illustration. (28 pages unverified.) |
| Chapters with **at least one discussed subject imaged** ("partially imaged") | **0 verified** | All 39 fully-read chapters image **none** of their discussed subjects; same in every portion read of the 17 partials |
| Chapters with **zero subject-images** | **56 of 56 read** (39 full + 17 partial) | The gap is total, not scattered |
| Principal subjects counted (floor) | **905** | Per-chapter lists in §5 |
| …of those, imaged on their chapter page | **0** | — |
| …gap subjects where **we already hold the image** (†) | **119** | Armory/Vault stock, above |
| …gap subjects needing an **outside rights-clean source** | **785** | No held image |
| …subjects **excluded by ruling** (‡, must stay unimaged) | **1** | Tjurunga, §4 |
| Vault entries linked from chapter pages as **text-only cards** (no image) | Every linked entry on every page read | The "In the Vault" cards carry title + description text only |

**Headline:** this is not a chapter-by-chapter scatter of misses. The chapter-page template itself carries no subject imagery at all — one interpretive hero per page and text-only Vault cards — so the rule currently fails on **all 905 counted subjects across all 84 chapters**, and the single largest quick win is the **119 subjects whose images we already hold**.

---

## Worst chapters (flagged first for the build order)

Ranked by subjects discussed × held images ready to drop in. All have **zero** subject-images today.

1. **ch49 — Sacred Kingship** (theme): 20 subjects, **13 held** (Pyramid Texts of Unas, Merneptah Stele, Oracle Bones of Anyang, Tel Dan Stele, Cyrus Cylinder, Behistun Inscription, Piprahwa Relics, Rosetta Stone, Sacred Tooth Relic, Holy Lance, Holy Grail, Crown of Thorns, Kebra Nagast) — the single worst page on the site by this measure.
2. **ch16 — Early Christianity**: 20 subjects, **12 held** (Dead Sea Scrolls, James Ossuary, Pilate Stone, Gospel of Judas, Codex Sinaiticus, Nag Hammadi Codices, Hinton St Mary Mosaic, Holy Lance, Lindisfarne Gospels, Skull Reliquary of Saint-Maximin, Gospel of Jesus's Wife, Shroud of Turin).
3. **ch22 — Patristic Christianity**: 17 subjects, **9 held** (Codex Sinaiticus, True Cross, Holy Mandylion, Sudarium of Oviedo, Pictish Stones, Holy Lance, Lindisfarne Gospels, Book of Kells, Shroud of Turin).
4. **ch17 — Gnosticism**: 15 subjects, **6 held** (Nag Hammadi Codices, Gospel of Judas, Dead Sea Scrolls, Emerald Tablet, Stećci, Diwan Abatur).
5. **ch19 — Rabbinic Judaism**: 14 subjects, **7 held** (Ark of the Covenant, Ketef Hinnom Scrolls, Dead Sea Scrolls, Sefer Yetzirah, Incantation Bowls, Aleppo Codex, Zohar).
6. **ch31 — The Reformation**: 16 subjects, **6 held**. **ch43 — The Aztec**: 15 subjects, **6 held** (incl. the Aztec Sun Stone, for which a print-resolution render already exists). **ch46 — Creation & the First Order**: 14 subjects, **6 held**.
7. **ch07 — Pre-exilic Israel** (partial read): 13 subjects, **5 held** (Merneptah, Tel Dan, Mesha, Ketef Hinnom, Ark) — every one a headline object of the chapter.
8. **ch41 — The Paleolithic**: 14 subjects, **3 held** — but they are the Lion Man, the Venus of Willendorf and Göbekli Tepe, the chapter's three most-discussed objects; the text also discusses Chauvet, Lascaux, Altamira and the Sulawesi paintings, all unimaged.
9. **ch03 — Mesopotamia**: 14 subjects, **4 held** (Ishtar Gate, Cyrus Cylinder, Flood Tablet, Ark Tablet).
10. **ch29 — The Maya**: 12 subjects, **2 held** (Dresden Codex, Popol Vuh) — plus Pakal's sarcophagus lid and Chichén Itzá discussed at length, unimaged.

---

## Structural findings (what the build order needs to know)

1. **The gap is a template fact, not an authoring fact.** Every chapter page = 1 hero interpretive illustration + body text + text-only Vault cards. No chapter page carries a photograph, scan, or render of anything it discusses. Closing the rule means (a) putting each linked Vault entry's image onto its card and/or in-body, and (b) sourcing images for discussed subjects that have no Vault entry.
2. **119 of the gaps need no sourcing at all** — the image is already ours (armory render or Vault entry imagery). These are the cheapest closes and include most of the worst chapters' subjects.
3. **Linkage gaps sit underneath image gaps.** Several chapters discuss a Vault subject at length but do not even link its entry (no card at all): **ch21 Islam** (Black Stone V26, Birmingham Qur'an V28, Sanaa Palimpsest V29 exist; the page's Vault section lists nothing), **ch25 Shinto** (Kojiki V61), **ch26 Kabbalah** (Zohar V79, Sefer Yetzirah V80), **ch34 Sikhism** (Kartarpur Bir V33), **ch53 Tibetan Buddhism** (Bardo Thödol V82), **ch32 Witch Trials** (Malleus Maleficarum V78), **ch06 Zoroaster** (Behistun V54), **ch20 Mahayana** lists no cards though the Diamond Sutra (V30) is discussed. The build order should fix linkage and imagery together.
4. **The one exclusion — ‡ tjurunga (ch61).** Vault entry V68 is titled "The Tjurunga of Central Australia — **Not Shown**" and is withheld from the site by ruling (restricted sacred objects). ch61 discusses tjurunga; **no image of one may be added** — the Images Rule does not reach it. It is the only excluded subject found.
5. **Two held-status cautions for the build order:** (a) V89 Flood Tablet and V90 Ark Tablet are live Vault entries but sit outside the armory's 132-build census — a still render's availability from the film hero-object builds is **UNVERIFIED**; (b) the rights ledger's product HOLDs (James Ossuary, Gospel of Jesus's Wife, Kensington Runestone, Satanic Bible) concern *selling*; their builds exist and their Vault entries are live on the site — whether Carter wants their images on chapter pages is his call, flagged here, not decided.
6. **Pantheon emblems are not subject images.** Chapter pages' Pantheon sections use generic interpretive emblem drawings; they do not depict the sourced depictions of the figures and are not counted as imaging any subject.

---

## Per-chapter gap table

**Reading the table:** *Page image* = images verified on the live page (H = the single hero interpretive illustration; "UNVERIFIED" = page not read, §6). *Subjects* = principal subjects counted; **†** = image already held; **‡** = excluded by ruling. *Gap* = subjects with no image on the page (held / outside). Every chapter below has **0 subjects imaged** unless §6 says the page was not read at all — for those, subjects come from the chapter source text (marked ◊) and the live image state is unverified, so their gap is stated on the same template evidence but flagged.

### Era I — Prehistory
| Ch | Page image | Subjects discussed (principal) | Gap (held / outside) |
|---|---|---|---|
| ch41 The Paleolithic | H | Lion Man†, Venus of Willendorf†, Göbekli Tepe†, Chauvet, Lascaux, Altamira, Venus of Hohle Fels, Venus of Dolní Věstonice, Hohle Fels flutes, Blombos engraved ochre, Sulawesi warty-pig painting, Sungir graves, Bruniquel Cave, Shanidar | 14 (3 / 11) |
| ch42 The Neolithic ◊ | UNVERIFIED | Göbekli Tepe†, Çatalhöyük, Jericho plastered skulls, 'Ain Ghazal statues, Karahan Tepe, Stonehenge, Newgrange, bucrania, Taş Tepeler | 9 (1 / 8) |
| ch61 Aboriginal Australian Dreaming | H (partial read) | Rainbow Serpent, Wandjina, **tjurunga‡**, Gwion Gwion rock art, X-ray art (Arnhem Land), Juukan Gorge shelters, Uluṟu, bullroarer, didgeridoo, songlines | 10 (0 / 9, +1 excluded) |
| ch66 San & Southern African Rock Art ◊ | UNVERIFIED | Linton panel, Blombos Cave, Apollo 11 Cave stones, Tsodilo Hills, Maloti-Drakensberg rock art, Bleek & Lloyd collection, eland imagery, trance dance | 8 (0 / 8) |
| ch75 Siberian & Arctic Shamanism | H (partial read) | Shaman's drum† (armory build), Sami drums, Freavnantjahke gievrie drum, Sedna / Sea Woman, Mal'ta ivory figurines, Hilazon Tachtit burial, Bad Dürrenberg burial, Shamanka II, Witsen's 1692 shaman engraving, fly agaric | 10 (1 / 9) |

### Era II — Bronze Age
| Ch | Page image | Subjects | Gap (held / outside) |
|---|---|---|---|
| ch02 Egypt | H (partial read) | Papyrus of Ani†, Pyramid Texts of Unas†, Coffin Texts, Book of the Dead, Osiris, Ma'at, Tutankhamun, Great Pyramid at Giza, Valley of the Kings, Deir el-Medina, Amarna / Akhenaten, Amarna Letters | 11 (2 / 9) |
| ch03 Mesopotamia | H | Ishtar Gate†, Cyrus Cylinder†, Flood Tablet†*, Ark Tablet†*, Standard of Ur, Stele of Hammurabi, Royal Cemetery of Ur / Puabi, Ziggurat of Ur, Epic of Gilgamesh, Enheduanna, Enuma Elish, Marduk, Lamashtu, Pazuzu | 14 (4 / 10) |
| ch04 Indus Valley | H | Pashupati seal, "Priest-King" bust, Great Bath (Mohenjo-daro), Dholavira signboard, Indus seals/script, Mohenjo-daro, Harappa, terracotta figurines, "unicorn" seal, Kalibangan fire altars, Rakhigarhi | 11 (0 / 11) |
| ch05 Early Vedic | H | Rigveda, Samaveda, Yajurveda, Atharvaveda, Indra, Agni, Soma, Varuna, Purusha Sukta, Nasadiya Sukta, agnicayana fire altar, Ashvamedha | 12 (0 / 12) |
| ch57 Hittite & Anatolian | H (partial read) | Yazılıkaya, Hattusa, Hattusa royal archive (cuneiform tablets), Tarhunna/Teshub, Sun-goddess of Arinna/Hepat, Kumarbi Cycle, Song of Ullikummi, Telipinu, Kadesh treaty (Hittite–Egyptian), plague prayers of Mursili II, Kubaba/Cybele | 11 (0 / 11) |
| ch67 Minoan Crete ◊ | UNVERIFIED | Phaistos Disc†, "Snake Goddess" figurines (Knossos), Knossos palace, Linear A tablets, peak sanctuaries (Petsofas, Mt Iouktas), libation tables, Kamares cave, Psychro cave | 8 (1 / 7) |
| ch76 The Olmec | H (partial read) | Colossal heads, San Lorenzo, La Venta, Tres Zapotes, El Manatí (wooden busts, rubber balls), La Venta Altar 4, La Venta Offering 4, Las Limas figure, Chalcatzingo Monument 1, Cascajal block, were-jaguar imagery | 11 (0 / 11) |

### Era III — Early Iron Age
| Ch | Page image | Subjects | Gap (held / outside) |
|---|---|---|---|
| ch06 Zoroaster | H | Behistun Inscription†, Zarathustra, Ahura Mazda, Gathas, Avesta, Atash Behram (Yazd), Amesha Spentas, Mithra, Anahita, Angra Mainyu, Chinvat Bridge, Faravahar | 12 (1 / 11) |
| ch07 Pre-exilic Israel | H (partial read) | Merneptah Stele†, Tel Dan Stele†, Mesha Stele†, Ketef Hinnom scrolls†, Ark of the Covenant†, Kuntillet Ajrud inscriptions, Khirbet el-Qom inscription, Ugarit / Baal Cycle, Temple in Jerusalem, Arad temple, Judean pillar figurines, Nehushtan | 12 (5 / 7) |
| ch08 Early Greece ◊ | UNVERIFIED | Linear B tablets, Homer, Hesiod, Zeus, Hera, Aphrodite, Kronos, the Olympians | 8 (0 / 8) |
| ch09 Early China ◊ | UNVERIFIED | Oracle Bones of Anyang†, Anyang (Yinxu), Fu Hao tomb, Shang ritual bronzes (taotie), Di/Shangdi, Pangu, Nüwa, ancestor rites | 8 (1 / 7) |
| ch58 Canaanite & Phoenician | H (partial read) | Ugaritic tablets, Baal Cycle, El, Asherah, Baal/Hadad, Anat, Melqart of Tyre, Eshmun of Sidon, Astarte, Baal Hammon, Tanit, Carthage tophet, Phoenician alphabet | 13 (0 / 13) |
| ch68 Nubia & Kush ◊ | UNVERIFIED | Jebel Barkal, Kerma / Western Deffufa, el-Kurru, Nuri, Meroë pyramids, Piye (Piankhy), Amun of Napata, Qustul, lion god (Apedemak) | 9 (0 / 9) |
| ch77 The Etruscans | H (partial read) | Liver of Piacenza, Pyrgi tablets, Liber Linteus (Zagreb mummy), Apollo of Veii, Sarcophagus of the Spouses, Banditaccia necropolis, Monterozzi painted tombs, Tomb of Orcus, Fanum Voltumnae, Tages | 12 (0 / 12) |

### Era IV — Axial Age
| Ch | Page image | Subjects | Gap (held / outside) |
|---|---|---|---|
| ch10 Second Temple Judaism ◊ | UNVERIFIED | Dead Sea Scrolls†, Qumran, Second Temple (Jerusalem), Herod the Great, Hasmonean kingdom, synagogue, Hanukkah / Maccabean Revolt, Alexander's conquest | 8 (1 / 7) |
| ch11 Buddhism ◊ | UNVERIFIED | Bodh Gaya, Sarnath, Siddhartha Gautama (the Buddha), Mahavira, Shakya, Great Renunciation sites, śramaṇa movement | 7 (0 / 7) |
| ch12 Confucianism & Daoism ◊ | UNVERIFIED | Confucius, Laozi, Zhuangzi, Mozi, Mandate of Heaven, Zhou dynasty rites, Hundred Schools | 7 (0 / 7) |
| ch13 Rome ◊ | UNVERIFIED | Capitoline Triad (Jupiter, Juno, Minerva), Capitoline Hill, Vestal Virgins, Mars, Venus, Ceres, Pontifex Maximus, Etruscan rites | 8 (0 / 8) |
| ch14 Celtic & Germanic ◊ | UNVERIFIED | Gundestrup Cauldron†, Lindow Man, La Tène art, druids, Ulster Cycle, Mabinogi, wicker man (Caesar/Tacitus accounts) | 6 (1 / 5) |
| ch15 Classical Greece | H | Oracle at Delphi, Eleusinian Mysteries, Epidaurus / Asclepius, Orphic gold tablets, Socrates, Plato, Aristotle, Pythagoras, Xenophanes, Heraclitus, tetractys | 11 (0 / 11) |
| ch52 Jainism | H | Kalpa Sutra†, Mahāvīra, Pārśvanātha, Tattvārtha Sūtra, Āgamas, Bāhubali statue (Shravanabelagola), Dilwara temples, Ellora Jain caves, Chandragupta Maurya, Jain emblem | 10 (1 / 9) |
| ch69 Upanishads & Hindu Synthesis ◊ | UNVERIFIED | Bṛhadāraṇyaka Upaniṣad, Chāndogya Upaniṣad, Kaṭha Upaniṣad, Īśā Upaniṣad, Yājñavalkya, Gārgī, Janaka, Uddālaka Āruṇi | 8 (0 / 8) |
| ch78 Scythians & the Steppe ◊ | UNVERIFIED | Pazyryk burials, Ukok "Ice Maiden" (tattooed mummy), Arzhan kurgan, Scythian gold, Herodotus, Olbia, Nart sagas, Targitaos | 8 (0 / 8) |

### Era V — Late Antiquity
| Ch | Page image | Subjects | Gap (held / outside) |
|---|---|---|---|
| ch16 Early Christianity | H | Dead Sea Scrolls†, James Ossuary†, Pilate Stone†, Gospel of Judas†, Codex Sinaiticus†, Nag Hammadi Codices†, Hinton St Mary Mosaic†, Holy Lance†, Lindisfarne Gospels†, Skull Reliquary (St-Maximin)†, Gospel of Jesus's Wife†, Shroud of Turin†, Jesus of Nazareth, Paul of Tarsus, Pontius Pilate, Mary Magdalene, Dura-Europos house church, Martyrdom of Polycarp, Constantine, Council of Nicaea | 20 (12 / 8) |
| ch17 Gnosticism | H | Nag Hammadi Codices†, Gospel of Judas†, Dead Sea Scrolls†, Emerald Tablet†, Stećci†, Diwan Abatur†, Apocryphon of John, Sophia, Yaldabaoth, Valentinus, Basilides, Abraxas, Gospel of Thomas, Mani, Corpus Hermeticum | 15 (6 / 9) |
| ch18 Roman Mystery Cults | H | Mithras / tauroctony, mithraeum, Isis, Osiris, Serapis, Cybele / Magna Mater, Attis, taurobolium, Dionysus/Bacchus, Villa of the Mysteries (Pompeii), Sol Invictus | 12 (0 / 12) |
| ch19 Rabbinic Judaism | H | Ark of the Covenant†, Ketef Hinnom Scrolls†, Dead Sea Scrolls†, Sefer Yetzirah†, Incantation Bowls†, Aleppo Codex†, Zohar†, Torah scroll, Mishnah, Babylonian Talmud, Yavneh, Beth Alpha synagogue mosaic, Dura-Europos synagogue, Haggadah | 14 (7 / 7) |
| ch20 Mahayana Buddhism | H | Diamond Sutra†, Avalokiteshvara, Guanyin, Amitabha, Heart Sutra, Lotus Sutra, Nagarjuna, Manjushri, Maitreya, Mogao caves (Dunhuang), Sukhavati, Miaoshan | 12 (1 / 11) |
| ch45 Pistis Sophia ◊ | UNVERIFIED | Nag Hammadi Codices†, Askew Codex (Pistis Sophia manuscript, BL MS Add. 5114), Bruce Codex / Books of Jeu, Mary Magdalene, Sahidic Coptic, Gnostic anthology tradition | 7 (1 / 6) |
| ch55 Manichaeism | H | Mani, Āržang (Book of Pictures), Shābuhragān, Turfan texts, Kephalaia, Psalm-Book (Medinet Madi), Cologne Mani-Codex, Augustine of Hippo, Uyghur Khaganate | 9 (0 / 9) |
| ch70 Pre-Islamic Arabia ◊ | UNVERIFIED | Betyls (standing stones), Hegra (Madain Salih), Taymāʾ, Safaitic inscriptions, al-Lāt, al-ʿUzzā, Manāt, Hubal, Book of Idols (Ibn al-Kalbī) | 9 (0 / 9) — note: Black Stone V26 is adjacent but not a subject of this chapter's text as read from source |
| ch79 First Christian Kingdoms ◊ | UNVERIFIED | Etchmiadzin, Armenian alphabet (Mashtots), Aksum stelae field, Ezana (coins/inscriptions), Khor Virap, Hripsime church, Gregory the Illuminator, Tiridates III, Anahit | 9 (0 / 9) |

### Era VI — Early Medieval
| Ch | Page image | Subjects | Gap (held / outside) |
|---|---|---|---|
| ch21 Islam | H | Muhammad, Qur'an, Kaaba, Mecca, Medina, Mount Hira, Khadija, Aisha, Fatima, Ali, Husayn, Karbala | 11 (0 / 11) — plus 3 held subjects **not even linked** from this page: Black Stone† (V26), Birmingham Qur'an† (V28), Sanaa Palimpsest† (V29) |
| ch22 Patristic Christianity | H | Codex Sinaiticus†, True Cross†, Holy Mandylion†, Sudarium of Oviedo†, Pictish Stones†, Holy Lance†, Lindisfarne Gospels†, Book of Kells†, Shroud of Turin†, Ignatius of Antioch, Didache, Justin Martyr, Irenaeus, Origen / Hexapla, Perpetua, Constantine, Jerome / Vulgate | 17 (9 / 8) |
| ch23 Norse Paganism | H | Mjölnir† (armory build), Oseberg ship burial, Gokstad ship burial, Prose Edda, Poetic Edda / Codex Regius, Snorri Sturluson, Yggdrasil, Odin, Thor, temple at Uppsala, Gotland picture stones | 11 (1 / 10) |
| ch24 Tantra | H | Śrī Yantra, Chausath Yogini temple (Khajuraho), Abhinavagupta / Tantrāloka, Guhyasamāja Tantra, Cakrasaṃvara Tantra, Hevajra Tantra, Kālī, Tripurasundarī, Chinnamastā, Dhūmāvatī, Padmasambhava | 11 (0 / 11) — this page has **no Vault section at all** |
| ch25 Shinto | H | Kojiki† (V61; discussed, not linked from page), Ise Jingū, Nihon Shoki, Amaterasu, Izanagi, Izanami, Susanoo, Three Sacred Treasures, Izumo Taisha, Inari | 10 (1 / 9) |
| ch53 Tibetan & Vajrayana Buddhism | H | Bardo Thödol† (V82; discussed, not linked), Padmasambhava, Samye, sand mandala, Dalai Lama, Panchen Lama, Lhasa, Jokhang / Jowo statue, Potala, Norbulingka, Avalokiteśvara | 11 (1 / 10) |
| ch54 Zen & Pure Land Buddhism | H | Bodhidharma, Huineng / Platform Sutra, Dōgen, Amitābha, Sukhāvatīvyūha sutras, Hōnen, Shinran, Blue Cliff Record, Gateless Gate, Ten Ox-Herding Pictures, raigō | 11 (0 / 11) |
| ch60 Eastern Orthodoxy & Byzantium | H (partial read) | Hagia Sophia, Constantinople, icons / Iconoclasm, John of Damascus, Theodore the Studite, Gregory Palamas, Mount Athos, Jesus Prayer, Cyril & Methodius / Cyrillic, Christ Pantokrator (dome image), iconostasis | 11 (0 / 11) |
| ch71 Korea | H (partial read) | Seokguram, Tripitaka Koreana (Haeinsa), Bulguksa, Samguk yusa, Dangun, mudang / gut, Jongmyo, Hangul / Hunminjeongeum, Ŭisang's Diagram, jangseung and sotdae | 10 (0 / 10) |
| ch80 Shi'ism ◊ | UNVERIFIED | Karbala, Najaf, Husayn ibn Ali, Ali ibn Abi Talib, Fatima, Ghadir Khumm, Abbas, Zaynab | 8 (0 / 8) |

### Era VII — High Medieval
| Ch | Page image | Subjects | Gap (held / outside) |
|---|---|---|---|
| ch26 Kabbalah | H | Zohar† (V79; discussed, not linked), Sefer Yetzirah† (V80; discussed, not linked), Sefer ha-Bahir, Tree of Life, Moses de León, Shimon bar Yochai, Abraham Abulafia, Isaac Luria, Sabbatai Zevi, Baal Shem Tov, golem | 12 (2 / 10) |
| ch27 Sufism | H | Rumi / Mathnawi, al-Hallaj, Rabia al-Adawiyya, Hasan al-Basri, al-Ghazali / Ihya, Ibn Arabi / Fusus al-Hikam, Attar / Conference of the Birds, Amir Khusrow | 8 (0 / 8) |
| ch28 Scholasticism | H | Sudarium of Oviedo†, Emerald Tablet†, Codex Gigas†, Crown of Thorns†, Voynich Manuscript†, Thomas Aquinas / Summa, Aristotle, Avicenna, Averroes, Anselm, Abelard / Sic et Non, Peter Lombard, Bonaventure, Maimonides | 14 (5 / 9) |
| ch29 The Maya | H | Dresden Codex†, Popol Vuh†, Yaxchilán lintel (Lady Kʼabʼal Xook), Madrid Codex, Paris Codex, Maya Codex of Mexico, Hunahpu and Xbalanque, Pakal's sarcophagus lid (Palenque), Chichén Itzá, Sacred Cenote, El Castillo, Itzamna | 12 (2 / 10) |
| ch30 Bhakti | H | Kabir, Krishna, Rama, Andal, Ramanuja, Chaitanya Mahaprabhu, Mirabai, Bhagavad Gita, Bhagavata Purana, Gita Govinda, Ramcharitmanas, ishtalinga | 12 (0 / 12) |
| ch43 The Aztec | H | Aztec Sun Stone† (armory; print-res render exists), Dresden Codex†, Codex Borgia†, Codex Boturini†, Tilma of Guadalupe†, Codex Mendoza†, Huitzilopochtli, Tlaloc, Coyolxauhqui Stone, Tenochtitlan, Templo Mayor, Huei Tzompantli, Florentine Codex, Teotihuacan, Quetzalcoatl | 15 (6 / 9) |
| ch44 The Inca | H (partial read) | Inca Khipu† (V62), Llullaillaco capacocha children, Cusco, Coricancha, Lake Titicaca, Inti, Viracocha, ceque system, huacas, Pachacamac, Huarochirí Manuscript, Sapa Inca | 12 (1 / 11) |
| ch56 Mandaeans, Yazidis & Druze | H | Ginza Rabbā, Qolastā, Book of John, John the Baptist, Tawûsî Melek, Lalish, Sheikh Adī, Mount Sinjar, al-Ḥākim, Epistles of Wisdom, darfash | 11 (0 / 11) — Diwan Abatur† (V87) belongs to this tradition and is linked from ch17, not evidenced as linked here |
| ch59 Slavic & Baltic Paganism | H (partial read) | Perun, Veles, Mokosh, Svetovid (Arkona), Perkūnas, Dievas, Saulė, Žemyna, Romuva sanctuary, dainos, Primary Chronicle, Book of Veles | 12 (0 / 12) |
| ch62 Native North American | H (partial read) | Cahokia / Monks Mound, Woodhenge (Cahokia), Serpent Mound, Chaco Canyon, Southeastern Ceremonial Complex, Sacred Pipe / calumet, White Buffalo Calf Woman, Wakan Tanka, Sky Woman / Turtle Island, Wovoka / Ghost Dance, Wounded Knee, Handsome Lake | 12 (0 / 12) |
| ch72 Cathars & Medieval Heresy | H (partial read) | Montségur, Gospel of John (consolamentum book), Interrogatio Iohannis, Ritual of Lyon, Book of the Two Principles, Bertrand Marty, Marguerite Porete / Mirror of Simple Souls, Jacques Fournier register, Valdès / Waldensians, Jan Hus, John Wyclif | 11 (0 / 11) |
| ch81 Tengri & the Mongols ◊ | UNVERIFIED | Orkhon inscriptions (Kül Tegin / Bilge Qaghan stelae), Burkhan Khaldun, Karakorum, Tengri, Umay, Chinggis Khan, William of Rubruck, Xiongnu | 8 (0 / 8) |

### Era VIII — Early Modern
| Ch | Page image | Subjects | Gap (held / outside) |
|---|---|---|---|
| ch31 The Reformation | H | True Cross†, Veil of Veronica†, Skull Reliquary (St-Maximin)†, Shroud of Turin†, Malleus Maleficarum†, Rohonc Codex†, Martin Luther, Ninety-Five Theses, Wittenberg Castle Church, Wartburg, John Wycliffe, Jan Hus, Council of Constance, John Calvin / Institutes, Geneva, Book of Common Prayer, King James Bible | 17 (6 / 11) |
| ch32 The Witch Trials | H | Malleus Maleficarum† (V78; discussed, not linked), Heinrich Kramer, Canon Episcopi, Johannes Junius (letter), King James VI / Daemonologie, Salem, Trier trials, Würzburg trials, Bamberg trials, benandanti, Cautio Criminalis | 11 (1 / 10) |
| ch33 African Traditional Religion | H | Ifá divination, Golden Stool (Sika Dwa Kofi), Okomfo Anokye, Kongo cosmogram, nkisi nkondi, Ile-Ife, Oduduwa, Adinkra symbols, Nsibidi ideograms, Egungun masquerade, San rock art, Nommo | 12 (0 / 12) — armory holds a Benin Bronze Head build (census #67) for this tradition's wider world; Benin Bronzes† V64 is linked from ch84's tradition family, not evidenced in ch33's text |
| ch34 Sikhism | H | Kartarpur Bir† (V33; discussed as Kartarpur/Adi Granth, not linked), Guru Nanak, Guru Granth Sahib, Harmandir Sahib, Amritsar, Akal Takht, Dasam Granth, Khanda, Ik Onkar, Guru Gobind Singh, Ranjit Singh | 11 (1 / 10) |
| ch63 Oceania | H (partial read) | Moai† (armory; print-res render exists), ahu, Makemake / birdman cult, Rangi and Papa, Tangaroa, Tāne, Tū, Rongo, Māui, Pele, marae / heiau, tiki, John Frum movement | 13 (1 / 12) |
| ch73 Sabbateans, Frankists & Hasidim | H (partial read) | Sabbatai Zevi, Nathan of Gaza, Isaac Luria / Safed, Glückel of Hameln (memoirs), Dönme, Jacob Frank, Baal Shem Tov, Holy Epistle, Shivhei ha-Besht, Tanya, Nachman of Bratslav / Uman, Vilna Gaon | 12 (0 / 12) |
| ch82 Akbar & the Mughal Synthesis ◊ | UNVERIFIED | Fatehpur Sikri, Ibadat Khana, Diwan-i Khas, Akbar, Abu'l-Fazl, Dara Shikoh, Din-i Ilahi, Salim Chishti | 8 (0 / 8) |
| ch84 Yoruba ◊ | UNVERIFIED | Ifá, Ile-Ife (Ọọ̀ni, Ọbalùfòn II), Odùduwà, Ọbàtálá, Èṣù, Ògún, Ṣàngó, Ọya, Ọ̀ṣun, Yemọja, Òrúnmìlà, Ìbejì | 10 (0 / 10) |

### Era IX — Modern
| Ch | Page image | Subjects | Gap (held / outside) |
|---|---|---|---|
| ch35 New Religious Movements | H | Golden Plates† (V75; "golden plates" discussed), Joseph Smith, Book of Mormon, Moroni, Ellen G. White, Bahá'u'lláh, Kitáb-i-Aqdas, L. Ron Hubbard / Dianetics, E-Meter, Divine Principle, John Frum | 11 (1 / 10) |
| ch36 Spiritualism ◊ | UNVERIFIED | Spirit Board / talking board† (armory build), Hydesville / Fox sisters, spirit photography, ectoplasm, Daniel Dunglas Home, Lily Dale, séance apparatus, Andrew Jackson Davis, Emanuel Swedenborg | 9 (1 / 8) |
| ch37 Theosophy & Occult Revival ◊ | UNVERIFIED | Helena Blavatsky, Secret Doctrine, Adyar, Annie Besant, Henry Steel Olcott, Mahatmas, Hodgson Report | 7 (0 / 7) |
| ch38 Wicca & Modern Paganism ◊ | UNVERIFIED | Book of Shadows† (V72), Gerald Gardner, Margaret Murray, Doreen Valiente / Charge of the Goddess, Aleister Crowley, Triple Goddess, Horned God, Wiccan Rede | 6 (1 / 5) |
| ch39 Satanism ◊ | UNVERIFIED | Satanic Bible† (V74; build exists — product-HOLD in the rights ledger, entry live), Anton LaVey / Church of Satan, Affair of the Poisons, Black Mass, Kenneth Lanning, Milton / Blake literary Satan | 8 (1 / 7) |
| ch40 Diaspora Religions ◊ | UNVERIFIED | Haitian Vèvè† (V77), Vodou (Bois Caïman), Santería, Candomblé, Palo, Umbanda, Rastafari, Papa Legba, Baron Samedi, Damballa | 10 (1 / 9) |
| ch64 Pentecostalism & Global Christianity ◊ | UNVERIFIED | Azusa Street Revival, William J. Seymour, Charles Fox Parham, Assemblies of God, Church of God in Christ, glossolalia, Charismatic movement | 7 (0 / 7) |
| ch65 Bahá'í & New Faiths ◊ | UNVERIFIED | Báb's Star Tablet† (V76; the Báb's writings discussed), Shrine of the Báb (Haifa), Bahá'u'lláh, Kitáb-i-Aqdas, Kitáb-i-Íqán, Hidden Words, Universal House of Justice, Mount Carmel | 8 (1 / 7) |
| ch74 Secularism & the Nones | H (partial read) | Notre-Dame / Festival of Reason, Temple of Philosophy, Happy Human emblem, Humanist Manifesto (1933), Sunday Assembly, Lucretius, Spinoza, Hume / Dialogues, d'Holbach / System of Nature, Darwin / Origin of Species, Nietzsche | 11 (0 / 11) |
| ch83 Global Hinduism & Guru Movements ◊ | UNVERIFIED | Swami Vivekananda (1893 Chicago), Vedanta Society, Rammohan Roy / Brahmo Samaj, Dayananda Saraswati / Arya Samaj, Ramakrishna, Paramahansa Yogananda, Maha Kumbh, Hanuman Chalisa | 8 (0 / 8) |

### Comparative themes (cross-era)
| Ch | Page image | Subjects | Gap (held / outside) |
|---|---|---|---|
| ch01 The Flood | H | Flood Tablet†*, Ark Tablet†*, Popol Vuh Manuscript†, Atrahasis, Eridu Genesis, Ziusudra, Utnapishtim, Noah, Berossus, Deucalion, Manu, Yu the Great | 12 (3 / 9) |
| ch46 Creation & the First Order | H | Nebra Sky Disc†, Dresden Codex†, Kojiki†, Codex Borgia†, Popol Vuh Manuscript†, Kumulipo†, Enuma Elish, Tiamat, Marduk, Nun / Ptah (Memphite Theology), Purusha / Purusha Sukta, Ymir, Pangu, Nasadiya Sukta | 14 (6 / 8) |
| ch47 Journeys to the Underworld | H | Bardo Thödol†, Papyrus of Ani† (Book of the Dead / Weighing of the Heart), Inanna, Ereshkigal, Chinvat bridge, Diyu, Popol Vuh / Xibalba, Hero Twins, Mictlan, feather of Maat | 12 (2 / 10) |
| ch48 The Great Goddess | H | Venus of Willendorf† (linked to this chapter in the site's own era listings), Çatalhöyük seated figurine, Inanna/Ishtar, Isis, Asherah / Kuntillet ʿAjrud inscriptions, Cybele, Demeter & Persephone, Mahādevī, Guanyin, Amaterasu, Mary, Black Madonnas | 12 (1 / 11) |
| ch49 Sacred Kingship | H | Pyramid Texts of Unas†, Merneptah Stele†, Oracle Bones of Anyang†, Tel Dan Stele†, Cyrus Cylinder†, Behistun Inscription†, Piprahwa Relics†, Rosetta Stone†, Sacred Tooth Relic†, Holy Lance†, Holy Grail†, Crown of Thorns†, Kebra Nagast†, Lake Nemi / Rex Nemorensis, Frazer / The Golden Bough, Pharaoh as Horus, Sapa Inca, Mandate of Heaven, Shilluk reth, Hammurabi | 20 (13 / 7) |
| ch50 The End of Days | H | Book of Enoch†, War Scroll (1QM) / Qumran, Saoshyant, Frashokereti, Book of Daniel, Book of Revelation, Armageddon, Mahdi, Dajjal, Ragnarök, Wounded Knee Creek | 11 (1 / 10) |
| ch51 Sacrifice & the Scapegoat | H | Oracle Bones of Anyang† (Shang sacrifice), scapegoat for Azazel / Leviticus 16, Aqedah, Passover lamb, Tenochtitlan tzompantli, Carthaginian tophet, Purusha, Ymir, Eid al-Adha / Mina, pharmakos | 12 (1 / 11) |

\* †* = Vault entry exists and is live; armory render availability UNVERIFIED (V89/V90 sit outside the 132-build census — §3, finding 5).

---

## UNVERIFIED pages (§6)

28 chapter pages could not be read live because the page-fetch service hit its rate limit (429) mid-audit — a hard stop, not retried: **ch08, ch09, ch10, ch11, ch12, ch13, ch14, ch36, ch37, ch38, ch39, ch40, ch42, ch45, ch64, ch65, ch66, ch67, ch68, ch69, ch70, ch78, ch79, ch80, ch81, ch82, ch83, ch84** (marked ◊ in the table). For these, subjects were extracted from the repo chapter source text (the text the pages render) and held-status cross-checked against the armory/Vault stock the same way; their **live image state is unverified** — the table's gap figures for them rest on the template pattern verified on all 56 read pages (exactly one interpretive hero, zero subject images, text-only Vault cards) and must be confirmed page-by-page in the build run. A further 17 pages were read in part (hero + body + subjects captured; some Vault-card tails unread): ch02, ch07, ch44, ch57–ch63, ch71–ch77 — their Vault lists are marked unverified in the readers' notes and no Vault names were invented for them.

## What this report does not claim

- It does not count every named thing in the chapters — principal subjects only (cap ~12/chapter in the live reads), so **905 is a floor**; a full named-entity pass would raise the outside-source count substantially.
- It does not verify licences for any outside image — per-piece rights checks belong to the build run.
- It does not verify that Vault cards lack images by inspecting page code — the finding rests on the fetched page text of 56 pages, in which cards consistently appear as title + description with no image captions, while the one real image per page (the hero) consistently does appear with its caption.
