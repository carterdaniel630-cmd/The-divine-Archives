4 new Pilgrimage sites checked. 0 passed, 2 small fixes, 4 need you. All four are new pages about holy sites, so each one needs you, as Qumran and Alexandria did. Each would pass after the points below.

------------------------------------------------------------------------------------------------

Batch: Pilgrimage batch 1, four walkable previews: Göbekli Tepe, Delphi, the Mogao Caves, Chichén Itzá (PR #53, claude/project-thread-s3qxre)
Reviewed: 2026-10-12
Auto-pass: on ("audit 2026-10-11: 6 of 6 re-reviewed items agreed; rolling accuracy over the last 3 counted runs 17/17 (100%) ...", reviews/status.json)
Covers: claude/project-thread-s3qxre@3e53e62
Covers: claude/project-thread-s3qxre@7fa1d27
Covers: claude/project-thread-s3qxre@1f074a3
Summary: 0 passed, 2 fixed, 4 need you.

The branch moved while I was reviewing. The builder merged main in (71f041e) and changed how the
Mogao and Chichén Itzá sections load (7fa1d27). Neither commit changed any card text or source.
After my fix, the coordinator added 1f074a3 to rebuild the entity registry. I re-ran every check
on the final head.

Automatic checks (on 1f074a3, base origin/main@db768cf)
  - review-checks.js --build: 9 of 9 checks pass, with no warnings. Build output matches what is committed.
  - Wikipedia share: Chichén Itzá 20% (4 of 20), Delphi 19% (4 of 21), Göbekli Tepe 0%, Mogao 0%.
    Chichén is exactly at the 20% line.
  - Every tools/verify-*.js passes, and verify-pilgrimage says "73 sites, 3 live, 7 preview ... OK".
  - The framework tests pass (36 of 36) after the registry rebuild in 1f074a3.
  - Merging: the PR now includes main, so it no longer conflicts. At 3e53e62 it had conflicts in
    docs/assets/pilgrimage-data.js and docs/pilgrimage/engine.js; the builder's merge 71f041e
    resolved them.
  - GitHub Actions on 1f074a3: checks, guard, originality, verify, test and runtime are green.
    **Lighthouse was still running when I wrote this.** Nothing merges until it is green.
  - Headless Chromium, every section of all four sites opened through the page's test hook:
    no script errors. Each page is noindex, shows "Recently added · pending full review" and has
    its own intro note.
  - Performance on a phone-sized screen (390 px wide):
      - Most draw calls: Göbekli 60, Delphi 54, Mogao 39, Chichén 16 (budget 80, target 60).
      - Most triangles: Delphi 51k, Mogao 30k, Chichén 27k, Göbekli 9k (budget 150k).
    On a wide desktop screen there are more calls: Göbekli Enclosure C 117 and the Delphi temple
    terrace 106. The budget is set for phones, so this is a note, not a failure. But the PR's
    "at most 54 draw calls and about 30k triangles" is true only on a phone, and only for the
    final code.
  - Note: a forced headless click on the canvas gives a "setPointerCapture" error. The live
    Qumran page does the same, so the shared engine causes it, not this batch.

FIXED    (2)
  - site:gobekli-tepe: the DAI post "How did they do it? Making and moving monoliths at Göbekli
    Tepe" (3 May 2016) was credited to "J. Notroff and others". Its byline is Oliver Dietrich.
    I corrected the author in site.js and the source log, added the post's address, and noted
    that the 7 m / 1.5 m / about 50 t figures check out. Commit a1b79de.
  - site:chichen-itza: the Met article by J. Doyle was given the title "Golden Kingdoms: the
    Sacred Cenote of Chichén Itzá". Its real title is "Into the Centipede's Jaws: Sumptuous
    Offerings from the Sacred Cenote at Chichén Itzá" (21 May 2018). I corrected it in site.js
    and the source log. Commit a1b79de.
    (No claim changed. My commit left the entity registry stale; the coordinator rebuilt it in
    1f074a3.)

NEEDS CARTER (4)
  - site:gobekli-tepe: a new page about an early ritual site (§4.6). Would pass.
      Checklist:
        1 accuracy: pass. The cited sources support every claim I checked (list below).
        2 lenses: pass.
        3 tiers: pass. The "About this model" card keeps measured, approximate and not-shown apart.
        4 contested claims: pass. Each is flagged and left open: temple or houses, backfill or
          slope slide, roofing, Haklay and Gopher's triangle, and Magli's Sirius idea. Sweatman's
          comet reading is marked "Not supported", following the excavators' reply.
        5 tone: pass.
        6 sensitivity: needs you (a new holy-site page).
      Small points:
        - The "Vulture Stone" card says the constellations were named by "Babylonians and Greeks".
          The excavators' reply says "Egyptian, Arabian, and Greek scholars". Close, but not
          their words.
        - The "hill" card cites UNESCO, Clare and Current World Archaeology. None of them names
          the 1963 Istanbul–Chicago survey or Schmidt's visit in 1994. The DAI post "A
          (Re-)Discovery (1994–1996)" does, and agrees with the card.
        - The source log asks for ch42's "deliberate backfill" line to be flagged as contested.
          That is a chapter change, so it is for you.
  - site:delphi: a new page about a holy site (§4.6). Would pass.
      Checklist: 1 accuracy, mostly pass (three slips below); 2 to 5 pass; 6 needs you.
      Contested claims are flagged and left open: the vapours, the date of the Athenian Treasury,
      the date of the first hymn, Delphinus as the sign of the god's return, and the "last oracle".
      Three wording slips against the sources:
        (a) The "When the god came back" card says that in Plutarch's day consultations were held
            on the seventh of each month. Plutarch (Greek Questions 9) says "monthly". The
            seventh day is a modern inference (Parke, Classical Quarterly 37, 1943).
        (b) The "hall" card's undying fire "fed with pine wood" is cited to Pausanias 10.24.4–5.
            Pausanias mentions the hearth but not its fuel. The fir or pine fuel is in Plutarch.
        (c) The "vapours" card says Etiope "led" the 2006 team. The University of Patras release
            names Papatheodorou as leader. Etiope is first author of the paper.
      Also:
        - The style-dating of the Athenian Treasury's sculpture to before Marathon is not in the
          Ministry page the card cites.
        - The Serpent Column's heads were broken off in 1702 (Livius). The card's "around 1700"
          is fine.
        - The source log reports a ch08 error: ch08 puts the maxims on the omphalos, but
          Pausanias 10.24.1 places them in the porch. I confirmed what Pausanias says. Fixing
          the chapter is your call.
  - site:mogao-caves: a new page about a living Buddhist holy site. It shows renderings of Buddha
    statues, the monk Hongbian's portrait in Cave 17, and the "Where the manuscripts went" card
    on the dispersal of the Cave 17 manuscripts. Would pass.
      Checklist: 1 accuracy, pass; 2 to 5 pass; 6 needs you.
      The dispersal card presents both "rescue" and "plunder", names no sum for Stein, and
      flags the question "Still argued today". The RSAA blog it cites is a contributor's
      opinion piece, and the log says so.
      Small points:
        - The card says Japanese and Russian expeditions bought items before the 1910 removal
          to Beijing. The British Library's International Dunhuang Project says they bought,
          after 1910, the bundles Wang had kept back.
        - Wang "clearing sand" and Pelliot's "three weeks" are not in the cited International
          Dunhuang Project page.
        - The source log says the posture of Cave 254's Maitreya was not confirmed. e-Dunhuang
          says it is seated cross-legged (the card does not describe it).
  - site:chichen-itza: a new page about a site sacred to the Maya, who still live in the region.
    Three cards touch human sacrifice and remains: "The platform of skulls", "The carved
    benches" and "Those given to the well". The "dredging" card calls the 1904–1914 removal
    looting. Would pass.
      Checklist: 1 accuracy, pass; 2 to 5 pass; 6 needs you.
      No remains are shown, and the cards say so. The serpent-of-light card follows Šprajc and
      Sánchez Nava, and the Toltec-conquest story is flagged contested. The dredging card
      reports the Historia Mexicana view and is flagged "Still argued today".
      Small points:
        - "Those given to the well" says Landa "does not say how often". Landa says it was done
          "in times of drought". It may be worth adding.
        - The source log reports that ch29 states the serpent was designed for the equinox. The
          log asks for a hedge. That is a chapter change, so it is for you.

Accuracy spot-checks
  - gobekli-tepe | unfinished pillar 7 m long, 1.5 m thick, about 50 t; central pair of D 5.5 m, 8–10 t; wall pillars about 4 m; flint tools; "several hundred metres" | https://www.dainst.blog/the-tepe-telegrams/?p=347 ; https://www.dainst.blog/the-tepe-telegrams/tag/quarries | supports (the author is O. Dietrich, now fixed)
  - gobekli-tepe | excavators: D's earliest date 700–1000 years after 10,950 BCE; more than 60 pillars; narrow sides of P43 ignored; roofing | https://www.dainst.blog/the-tepe-telegrams/2017/07/03/more-than-a-vulture-a-response-to-sweatman-and-tsikritsis/ | supports ("Egyptian, Arabian, and Greek", not "Babylonians")
  - gobekli-tepe | MAA 17.2 (2017) 57–63 | same page; https://test01.ku.dk/:obvius/pureproxy/3974268/en/publications/more-than-a-vulture-a-response-to-sweatman-and-tsikritsis | supports (the university record gives 57–74, probably the whole section)
  - gobekli-tepe | no convincing sky orientation; possibly roofed | https://www.dainst.blog/the-tepe-telegrams/2017/04/21/archaeoastronomy-meteor-showers-mass-extinction-what-does-the-fox-say-and-what-the-crane-the-aurochs/ | supports
  - gobekli-tepe | Clare 2020: 9500–8000 BCE; temple story revised; fill from upslope, not deliberate; dwellings, cistern, burial | https://publications.dainst.org/journals/efb/article/view/2596 ; https://publications.dainst.org/journals/efb/article/view/2596/7095 | supports (grinding tools not found in that text)
  - gobekli-tepe | D: 11 wall pillars; foxes and snakes; C: 3–4 rings, pedestals; boar; P27 predator above boar; 10–30 m | https://www.world-archaeology.com/features/turkey-gobekli-tepe/ | supports
  - gobekli-tepe | 1963 survey; Schmidt 1994; digging from 1995 | https://www.dainst.blog/the-tepe-telegrams/?p=861 | supports (not among the card's cited sources)
  - gobekli-tepe | Haklay and Gopher triangle B–C–D; criticised | https://www.livescience.com/gobeklitepe-built-with-geometry.html | supports
  - gobekli-tepe | Magli: oriented to Sirius | https://arxiv.org/abs/1307.8397 | supports
  - gobekli-tepe | UNESCO: hunter-gatherers; pillars up to 5.5 m | https://whc.unesco.org/en/list/1572 | supports (UNESCO gives 9600–8200 BCE)
  - delphi | Nero took 500 bronze statues; Phocians took the tripod's gold, the bronze remained; omphalos "centre of all the earth"; Herophile | https://www.theoi.com/Text/Pausanias10A.html | supports
  - delphi | maxims in the fore-temple; Poseidon altar; Zeus and Apollo as guides of Fate; Pindar's iron chair | https://www.theoi.com/Text/Pausanias10B.html | supports (the pine-wood fire is not in Pausanias)
  - delphi | consultations on the seventh of each month in Plutarch's day | https://www.cambridge.org/core/journals/classical-quarterly/article/abs/days-for-consulting-the-delphic-oracle/7EF7E04AF17F07FFEFF018E5358E6F0C | partly supports (Plutarch says "monthly"; the seventh is an inference)
  - delphi | Athenian Treasury 9.65 × 6.57, Parian marble, after 490 BCE, Marathon inscription | https://delphi.culture.gr/athenians-treasure/ | supports (the style-dating dispute is not on this page)
  - delphi | Siphnian Treasury c. 530–525, crepis 6.04 × 8.41, caryatids, gigantomachy on the north, mine tithe | https://delphi.culture.gr/the-treasure-of-the-sifnians/ | supports
  - delphi | Delphic Hymns found 1893, first about 138 BCE, heading damaged | https://www.delphimuseum.gr/2025/03/the-delphic-hymns-to-apollo.html | supports
  - delphi | Serpent Column: 31 cities, Constantine, heads broken, one head in Istanbul | https://www.livius.org/articles/place/constantinople-istanbul/constantinople-photos/constantinople-hippodrome/constantinople-hippodrome-serpent-column/ | supports (1702; the erasure is cited to Thucydides, not Livius)
  - delphi | 2006: methane and CO2, no ethylene | https://oceanus-lab.upatras.gr/press/50-press-releases/100-delphic-oracle-mystery | supports (the leader was Papatheodorou, not Etiope)
  - delphi | Boutsikas and Salt: Delphinus, about a month later at Delphi | https://kar.kent.ac.uk/41878 | supports
  - mogao-caves | 492 caves, 45,000 m², 2,000+ sculptures, 366, 4th–14th c. | https://whc.unesco.org/en/list/440 | supports
  - mogao-caves | Cave 17: 851–862, Hongbian, trees with bag and flask, attendant with staff and towel, nun with fan, stele of 851, 50,000+ items, 4th–11th c. | https://www.e-dunhuang.com/cave/10.0001/0001.0001.0017 | supports
  - mogao-caves | Cave 254: Northern Wei, earliest central-pillar cave, gable and flat ceilings, Maitreya, Mahasattva south, Sibi north, 1,235 Buddhas | https://e-dunhuang.com/cave/10.0001/0001.0001.0254 | supports
  - mogao-caves | 735 caves; Lezun 366 or 353; storeys 4 → 5 (874–885) → 7 (1898) → 9; 35.5 m; 695 | https://www.ancient-history-sites.com/?p=133357 | supports
  - mogao-caves | 35.5 m, begun 695 | https://www.chinadaily.com.cn/a/202504/29/WS680ff708a310a04af22bcae0.html | supports
  - mogao-caves | Rong's hidden-library theory; about 200 manuscripts tied to Sanjie; no record of the layout | https://earlytibet.com/2011/03/11/secrets-of-the-cave-ii/ | supports
  - mogao-caves | June 1900, Wang; Stein 1907; Pelliot 1908; Japanese and Russian purchases; 1910 Beijing | https://idp.bl.uk/learning/dunhuang/dunhuang-articles/cave-17-the-library-cave/discovering-cave-17/ | supports, with the order point above (sand and "three weeks" not on the page)
  - chichen-itza | base 55.3 m; 24 m plus 6 m temple; 91 steps and 365; 20 May / 24 July; chac mool 1935; jaguar 1936; 2018 scan; cenote 25 × 35 m | https://en.wikipedia.org/wiki/El_Castillo,_Chichen_Itza | supports
  - chichen-itza | serpent of light: photos 15–29 March 2017, little change, six to nine triangles, equinox idea from the 1960s–70s, north stairway towards the cenote | https://iaps.zrc-sazu.si/sites/default/files/sprajcsol_chichen_dzibilchaltun_am149.pdf | supports
  - chichen-itza | ball court 166 × 68 m; serpent rings; 3,000+ years | https://www.guinnessworldrecords.com/world-records/88083-largest-ball-court-in-ancient-mesoamerica | supports
  - chichen-itza | alley 96.5 × 30 m; solid rubber; beheaded player with serpents and plants; sun, underworld, life and death | https://www.metmuseum.org/essays/the-mesoamerican-ballgame | supports
  - chichen-itza | cenote 60 m across, 27 m to the water; Landa 1566; Thompson 1904; 1961 and 1967–68; sacbe 300 m | https://en.wikipedia.org/wiki/Sacred_Cenote | supports (Landa adds "in times of drought")
  - chichen-itza | offerings: burned jade; gold and copper from Costa Rica and Panama; copal; wood and cloth; about 700–1450 | https://www.metmuseum.org/perspectives/golden-kingdoms-sacred-cenote-chichen-itza | supports (title corrected)
  - chichen-itza | 2,500 bones from the 1960s, about 79% children aged 3–11 | https://www.world-archaeology.com/more/new-thinking-on-mayan-child-sacrifice.htm | supports
  - chichen-itza | 2024 DNA: 64 sampled, all male, related, two pairs of twins; cistern near the cenote; cenote not yet tested | https://www.nationalgeographic.com/history/article/maya-sacrifice-dna-chichen-itza-boys | supports
  - chichen-itza | Historia Mexicana 67.2: consul, Peabody and Boston money, illegal export, "looting" | https://historiamexicana.colmex.mx/index.php/RHM/en/article/view/3475 | supports (no author or year on the page, as the log says)
  - chichen-itza | El Caracol: the name; about 906; 20 of 29 events; Venus extremes; part lost | https://en.wikipedia.org/wiki/El_Caracol,_Chichen_Itza | supports (the "three openings" are cited to the Exploratorium, which I did not open)

Needs your decision
  - Do you approve the four sites as previews: Göbekli Tepe, Delphi, the Mogao Caves and Chichén Itzá? Merging PR #53 is your call, once Lighthouse is green. (yes/no)
  - Are the Mogao dispersal card and the three Chichén Itzá cards on sacrifice and remains worded as you want? (yes/no)
  - Should the builder fix the three Delphi slips ("seventh of each month", the pine-wood source, who led the 2006 team) and the Mogao order of events? (yes/no)
  - Should the chapters be corrected as the source logs propose: ch08 (the maxims belong in the porch), ch29 (hedge the equinox design) and ch42 (flag the backfill as contested)? (yes/no)
