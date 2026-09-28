# Virtual Museum — Stage 0 PLAN

Scoping only. Every statement about the repo below was checked by opening the file, on
`claude/virtual-museum` cut from `origin/main` at `ba6781e` (2026-09-28). Where the brief and the
repo disagree, the repo wins; the disagreements are collected in §0.

---

## 0. Where the brief proved false or out of date

| Brief said | Repo shows |
|---|---|
| "~60 chapters at /chapters/chNN.html (ch01–ch65, with gaps)" | **65 chapters, ch01–ch65, no gaps**; all `status: "published"`. |
| "~20 chapters display 'Recently added · pending review'" | That was true until today: **20** (ch21, ch26–ch44). Carter cleared them in `ba6781e` (2026-09-28), along with all 87 Vault entries and the Pantheon banner. **Now zero chapters are pending**, so every chapter is eligible for the pilot. |
| "Every chapter page has an interpretive illustration" | **ch47–ch65 (19 chapters) have no plate.** `plates.js` covers 46 chapters. Listing tiles fall back to the era emblem; theme chapters have no era, so ch47–ch51 have no art at all. |
| "…believer's lens, skeptical lens…" on every chapter | Present as headings on ch01–ch44 only. **ch45–ch65 have no "believer's lens / skeptical lens" headings.** |
| "…cross-link blocks: In the Pantheon, In the Vault…" on every chapter | These blocks render only when data exists. **No Pantheon block:** ch04, ch28, ch31, ch32, ch34, ch35, ch36, ch41, ch42, ch55, ch64, ch65. **No Vault block:** ch04, ch05, ch24, ch36, ch57, ch59, ch62, ch64. Theme chapters have no "Other traditions of this age". |
| "…evidence box (supported / not supported / open)" | Present on every chapter, but **broken on ch01–ch20**: headings are shifted by one (an empty `<h4>`, the "supported" list under a blank heading) and bullet lists are flattened into one paragraph of "- " items. The defect has been in the committed HTML since at least `1c14aee` (2026-09-11). It is **not** caused by recent work, and it is outside this track's allowed edits. It matters here because the museum's label cards should link to a clean evidence box. It needs a separate fix, which Carter has to approve. |
| "…the page/anchor it opens" (chapter sections) | **Chapter section headings have no `id`s.** The only in-page anchors are `#figures` (Pantheon block) and `#in-the-vault`. Vault pages have `#study` and `#vault-mount`, but none on their evidence section. Deep links to "Symbology" or "The evidence, honestly" do not exist yet (see §6). |
| "Symbol artwork is the trigger system for 12 games" | True, but the chapter-to-game map is **not a data file**: it is an inline `GAMES` object in `docs/symbols.html` (around line 97). ch16 has **no** game. |
| "Listing pages render as static HTML now → site-overhaul looks merged" | Confirmed: `claude/site-overhaul` is an ancestor of `main`, and so are `mini-games-layer` and `games-build`. **`claude/games-audit` is not merged**: 6 audit-document commits, 79 behind main. It was not touched. |
| Pantheon "anchored figure entries (#slug), each with an interpretive emblem" | Confirmed: 199 figures in 30 traditions. Muhammad, Fatima and Ali use a **calligraphic `glyph:` emblem**, not a face. |

---

## 1. Repo audit

### Build system and deploy
- **No bundler, no `package.json`, no npm.** The site is plain HTML, CSS and classic `<script>`
  files in `docs/`, deployed as-is. Third-party code is vendored under `docs/assets/vendor/`
  (`openseadragon/`, `fonts/`).
- **Prerender step (Node, run locally, output committed):**
  1. `node tools/build-vault.js`: `docs/vault/*.html` and `vault.html`.
  2. `node tools/build-chapters.js`: `docs/chapters/chNN.html`.
  3. `node tools/build-pages.js`: `index.html`, `eras.html`, `themes.html`, `traditions.html`,
     `docs/eras/*.html`, `search-index.json`, `sitemap.xml`.
  - The builders load the browser data files in a `vm` sandbox with a `window` shim; a museum
    manifest builder would do the same.
- **Deploy:** `.github/workflows/deploy.yml` runs `wrangler pages deploy docs` on every push to
  `main`. A manual `workflow_dispatch` run deploys to a **`preview`** alias
  (`preview.the-divine-archives.pages.dev`), which is the natural lane for museum testing.
- **CI:** `verify.yml` runs `tools/verify-*.js` (game facts against chapter text); `game-runtime.yml`
  also exists. `functions/api/subscribe.js` is the only server code (the newsletter form).
- **Headers:** `docs/_headers` sets `/assets/*` to a 1-day cache and `/assets/games/*` to
  revalidate. A museum needs its own rule for immutable hashed assets (see §11).

### Routing
- **File-based static routing, no router, no `_redirects`.** Every URL is a real file:
  - `/chapters/chNN.html`, `/eras/NN-slug.html`, `/vault/<slug>.html`;
  - `/pantheon.html#<id>`, `/symbols.html#play=<id>`.
- `chapter.html`, `era.html`, `search.html` and `random.html` are legacy or utility pages;
  `chapter.html`, `era.html`, `search.html` carry `noindex`.
- Canonicals are absolute (`https://getconexto.com/chapters/ch16.html`).

### Where the data lives (all JS modules that assign to `window`, no JSON)

| Data | File | Global | Shape (fields used by the museum) |
|---|---|---|---|
| Eras, themes, chapters | `docs/assets/data.js` | `window.ARCHIVE` | `eras[]{slug,num,name,dates,blurb,traditions[]}`; `themes[]{slug,name,chapter}`; `chapters[]{id,title,kind:"tradition"\|"theme",era,eraLabel,status,pending,source,summary}` |
| Chapter bodies | `content/chapters.js` (not deployed) | `window.CHAPTERS` | HTML per chapter; the symbology section is prose only (no structured symbol list) |
| Chapter plates (illustrations) | `docs/assets/plates.js` | `window.PLATES` (figure + caption HTML), `window.PLATE_ART` (bare SVG) | keyed by chapter id; 46 of 65 |
| Era emblems | `docs/assets/emblems.js` | `window.EMBLEMS` | SVG keyed by era slug; all 9 |
| Vault | `docs/assets/vault-data.js` | `window.VAULT` | `categories{}`; `items[]{id,slug,status,pending,era,year,chapters[],title,category,source,held,dated,summary,artifact{type,…},study{…}}`; 87 items; `queue[]` empty |
| Pantheon | `docs/assets/pantheon-data.js` (+ `pantheon-art.js` renderer) | `window.PANTHEON`, `window.PANTHEON_ART.svg(fig,color,uid)` | `traditions{key:{name,color}}`; `figures[]{id,n,t,k,e,d,p,c?,v?,ch[]}`; 199 figures |
| Game triggers | inline in `docs/symbols.html` | `GAMES` (local) | `{gameId, ch, title, subtitle}` for 12 chapters; `#play=<id>` deep link via `openFromHash()` |
| Vault/chapter cross-links | computed in `tools/build-chapters.js` | `vaultFor()`, `figuresFor()`, `seeAlso()` | Vault item belongs to a chapter if `chapters[]` includes it; figure if `ch[]` includes it; siblings = same era, non-theme; themes = every `kind:"theme"` |

**Convention the museum needs (proposed, not yet documented in the repo):** the **first** entry of
a Vault item's `chapters[]` (and of a figure's `ch[]`) is treated as its **home room**. A physical
object is displayed in one place; every other room that lists it shows a "see also" plaque that
points to the home room and opens the same page. This matches how the data is actually ordered
(e.g. the Dead Sea Scrolls list `ch10` first, Codex Sinaiticus `ch16`), but Carter should confirm
it (§13).

### How the games' symbol-trigger system is wired
- `docs/assets/games/archive-games.js` exposes `window.ArchiveGames`: `register`, `registerSymbol`,
  `open`, `isRegistered`. Each game module (`treasure.js`, `fighter.js`, …) registers itself; data
  lives in `docs/assets/games/data/*.json`.
- `symbols.html` builds a grid from `PLATES` + `EMBLEMS`. For the 12 chapters in `GAMES` it calls
  `AG.registerSymbol(artSpan, …)`, making that chapter's plate art the trigger.
- `symbols.html#play=<gameId>` opens a game directly (`openFromHash()`); the homepage menu uses it.
- The games need all 14 game scripts that `symbols.html` loads (7 MB of `docs/assets/games/` on
  disk, mostly art). A museum "kiosk" should therefore **navigate** to `symbols.html#play=<id>`
  rather than embed a game (§6).

### Branch and merge state
- `main` = `ba6781e`.
- Merged into `main`: `site-overhaul`, `mini-games-layer`, `games-build`, `state-audit-fzv14x`.
- Not merged: `games-audit` (documents only).
- About 30 older `claude/*` branches remain on origin (cleanup is a GitHub-UI task for Carter).

---

## 2. Data model: the room manifest

Generated by a future `tools/build-museum.js`, which loads the same data files in a `vm` sandbox
(exactly as `build-chapters.js` does) and writes `docs/museum/manifest.json`. Nothing in the
manifest is typed by hand except the **layout file** (which room sits where, in which wing) and
the **placement defaults**.

```text
Museum
  wings[]      { id, era|null, title, dates, emblem: "EMBLEMS[era]", rooms[] }
  rooms[]      { room, chapter, title, era, wing, kind, opens, exhibits, links }
  exhibits
    vault[]    { id, slug, title, category, home, placement, opens, label }
                 home      = chapters[0]
                 placement = case-pedestal (relics) | case-lectern (manuscripts, texts)
                           | plaque-see-also (home elsewhere)
                 label     = VAULT summary (verbatim); held and dated shown on the card
    pantheon[] { id, name, epithet, tradition, home, placement, opens, contested }
                 placement = statue-niche | glyph-panel (p starts "glyph:")
                           | portrait-see-also (home elsewhere)
                 contested = figure.c, shown as "Contested:" on the card
    symbols[]  { id, source, placement, opens, caption }
                 PLATE_ART[ch] → wall-carving, caption from PLATES figcaption
                 EMBLEMS[era] → doorway lintel
    game       { id, opens: "/symbols.html#play=<id>" } | null
  links        { siblings[] (same era, non-theme), themes[] (all theme chapters) }
```

### Generated manifest for the pilot room (ch16, Early Christianity)
Produced from the current data by a throwaway script (not committed; the builder is Phase 3 work).
Vault `label`s are clipped here for readability; the real manifest carries the full summary.

```json
{
  "room": "r-ch16",
  "chapter": "ch16",
  "title": "Early Christianity",
  "era": "05-late-antiquity",
  "wing": "05-late-antiquity",
  "kind": "tradition",
  "opens": "/chapters/ch16.html",
  "exhibits": {
    "vault": [
      {"id":"v02","slug":"dead-sea-scrolls","title":"The Dead Sea Scrolls","category":"manuscripts","home":"ch10","placement":"plaque-see-also","opens":"/vault/dead-sea-scrolls.html","label":"Some 900–1,000 manuscripts from eleven caves near Qumran — the oldest copies of the Hebrew Bible, lost…"},
      {"id":"v16","slug":"james-ossuary","title":"The James Ossuary","category":"relics","home":"ch16","placement":"case-pedestal","opens":"/vault/james-ossuary.html","label":"A first-century bone box inscribed 'James, son of Joseph, brother of Jesus'. It was declared a forgery by the…"},
      {"id":"v44","slug":"pilate-stone","title":"The Pilate Stone","category":"texts","home":"ch13","placement":"plaque-see-also","opens":"/vault/pilate-stone.html","label":"A broken limestone block from Caesarea, reused as a step in the Roman theatre, which names Pontius Pilate as…"},
      {"id":"v40","slug":"gospel-of-judas","title":"The Gospel of Judas (Codex Tchacos)","category":"manuscripts","home":"ch17","placement":"plaque-see-also","opens":"/vault/gospel-of-judas.html","label":"A Gnostic gospel that the church father Irenaeus denounced around 180 and that was then lost for 1,700 years.…"},
      {"id":"v18","slug":"codex-sinaiticus","title":"Codex Sinaiticus","category":"manuscripts","home":"ch16","placement":"case-lectern","opens":"/vault/codex-sinaiticus.html","label":"The oldest complete New Testament, in a fourth-century Greek Bible now split among four libraries: London,…"},
      {"id":"v08","slug":"nag-hammadi-codices","title":"The Nag Hammadi Codices","category":"manuscripts","home":"ch17","placement":"plaque-see-also","opens":"/vault/nag-hammadi-codices.html","label":"Thirteen leather-bound papyrus books found in a sealed jar in 1945: the Gospel of Thomas, Sethian and…"},
      {"id":"v84","slug":"hinton-st-mary-mosaic","title":"The Hinton St Mary Mosaic","category":"relics","home":"ch16","placement":"case-pedestal","opens":"/vault/hinton-st-mary-mosaic.html","label":"A Roman mosaic floor from Dorset whose central roundel shows a man before a Chi-Rho, flanked by pomegranates:…"},
      {"id":"v05","slug":"holy-lance","title":"The Holy Lance (“Spear of Destiny”)","category":"relics","home":"ch16","placement":"case-pedestal","opens":"/vault/holy-lance.html","label":"One Gospel sentence, four rival spearheads, and a 1970s occult myth. The Habsburg lance's gold sleeve reads…"},
      {"id":"v42","slug":"lindisfarne-gospels","title":"The Lindisfarne Gospels","category":"manuscripts","home":"ch16","placement":"case-lectern","opens":"/vault/lindisfarne-gospels.html","label":"The four Gospels made on Holy Island in honour of St Cuthbert, probably by one man, Bishop Eadfrith. Two…"},
      {"id":"v17","slug":"gospel-of-jesus-wife","title":"The “Gospel of Jesus's Wife”","category":"manuscripts","home":"ch16","placement":"case-lectern","opens":"/vault/gospel-of-jesus-wife.html","label":"A card-sized Coptic fragment in which Jesus says 'my wife', announced by a Harvard historian in 2012 and…"}
    ],
    "pantheon": [
      {"id":"michael","name":"Michael","epithet":"Who is like God?","tradition":"abrahamic","home":"ch10","placement":"portrait-see-also","opens":"/pantheon.html#michael","contested":null},
      {"id":"satan","name":"Satan","epithet":"The adversary","tradition":"abrahamic","home":"ch10","placement":"portrait-see-also","opens":"/pantheon.html#satan","contested":null},
      {"id":"gabriel","name":"Gabriel (Jibrīl)","epithet":"God is my strength","tradition":"abrahamic","home":"ch10","placement":"portrait-see-also","opens":"/pantheon.html#gabriel","contested":null},
      {"id":"jesus","name":"Jesus of Nazareth","epithet":"The Christ","tradition":"nt","home":"ch16","placement":"statue-niche","opens":"/pantheon.html#jesus","contested":"Nearly all historians accept that Jesus lived and was crucified; his divinity and resurrection are matters of faith, and many relics linked with him are of disputed authenticity."},
      {"id":"mary","name":"Mary, mother of Jesus","epithet":"Theotokos","tradition":"nt","home":"ch16","placement":"statue-niche","opens":"/pantheon.html#mary","contested":null},
      {"id":"john-baptist","name":"John the Baptist","epithet":"The forerunner","tradition":"nt","home":"ch16","placement":"statue-niche","opens":"/pantheon.html#john-baptist","contested":null},
      {"id":"peter","name":"Peter","epithet":"The rock","tradition":"nt","home":"ch16","placement":"statue-niche","opens":"/pantheon.html#peter","contested":null},
      {"id":"paul","name":"Paul","epithet":"Apostle to the Gentiles","tradition":"nt","home":"ch16","placement":"statue-niche","opens":"/pantheon.html#paul","contested":"Scholars accept seven of the letters under his name as his own and debate the authorship of the rest."},
      {"id":"mary-magdalene","name":"Mary Magdalene","epithet":"Apostle to the apostles","tradition":"nt","home":"ch16","placement":"statue-niche","opens":"/pantheon.html#mary-magdalene","contested":null},
      {"id":"john-apostle","name":"John the Apostle","epithet":"The beloved disciple","tradition":"nt","home":"ch16","placement":"statue-niche","opens":"/pantheon.html#john-apostle","contested":"Scholars debate whether the apostle wrote any of the works attributed to him."},
      {"id":"thomas","name":"Thomas","epithet":"The doubter","tradition":"nt","home":"ch16","placement":"statue-niche","opens":"/pantheon.html#thomas","contested":null},
      {"id":"judas","name":"Judas Iscariot","epithet":"The betrayer","tradition":"nt","home":"ch16","placement":"statue-niche","opens":"/pantheon.html#judas","contested":null},
      {"id":"james","name":"James, brother of Jesus","epithet":"James the Just","tradition":"nt","home":"ch16","placement":"statue-niche","opens":"/pantheon.html#james","contested":null},
      {"id":"pilate","name":"Pontius Pilate","epithet":"Prefect of Judaea","tradition":"nt","home":"ch16","placement":"statue-niche","opens":"/pantheon.html#pilate","contested":null},
      {"id":"herod","name":"Herod the Great","epithet":"King of Judaea","tradition":"nt","home":"ch10","placement":"portrait-see-also","opens":"/pantheon.html#herod","contested":"The massacre of the innocents is recorded only in Matthew."},
      {"id":"lazarus","name":"Lazarus","epithet":"Raised from the dead","tradition":"nt","home":"ch16","placement":"statue-niche","opens":"/pantheon.html#lazarus","contested":null},
      {"id":"joseph-arimathea","name":"Joseph of Arimathea","epithet":"Keeper of the tomb","tradition":"nt","home":"ch16","placement":"statue-niche","opens":"/pantheon.html#joseph-arimathea","contested":"The Grail and Glastonbury stories are medieval legends."}
    ],
    "symbols": [
      {"id":"plate-ch16","source":"PLATE_ART.ch16","placement":"wall-carving","opens":"/chapters/ch16.html","caption":"The Chi-Rho (☧), the monogram of Christ formed from the Greek letters chi and rho, within a victor’s wreath. An original rendering of the symbol, not a specific inscription."},
      {"id":"emblem-05-late-antiquity","source":"EMBLEMS['05-late-antiquity']","placement":"doorway-lintel","opens":"/eras/05-late-antiquity.html"}
    ],
    "game": null
  },
  "links": {"siblings": ["ch17", "ch18", "ch19", "ch20", "ch45", "ch55"], "themes": ["ch01", "ch46", "ch47", "ch48", "ch49", "ch50", "ch51"]}
}
```

What the manifest shows:
- 6 Vault objects have ch16 as their home. 4 more (Dead Sea Scrolls, Pilate Stone, Nag Hammadi,
  Gospel of Judas) belong to other rooms and appear here as see-also plaques.
- 13 Pantheon figures have ch16 as their home. 4 (Michael, Satan, Gabriel, Herod) are homed in
  ch10.
- `game` is `null`: ch16 has no game.

---

## 3. Layout decision (Carter's choice)

### Option A — one room per chapter, wings = the Nine Ages (recommended)
- A central **Spine gallery** runs chronologically I → IX, mirroring the homepage "era spine".
- Each Age is a **wing** off the spine; each tradition chapter is a **room** in its wing.
- The **seven comparative themes** (ch01, ch46–ch51) sit in a **central Rotunda** where the spine
  begins. There are seven alcoves, plus one reserved for the planned theme "The Dying & Returning
  God" (`chapter: null` in `data.js`, so it is not built).
- Pros:
  - every chapter maps to exactly one room, **deterministically from `data.js`**, with no new
    taxonomy;
  - it keeps the project's founding principle (chronological, not regional);
  - wings are natural lazy-loading units;
  - it expands wing by wing.
- Cons: related traditions are far apart (Early Christianity in V, Eastern Orthodoxy in VI,
  Reformation in VIII).

### Option B — tradition halls
- Halls by religious family, e.g. a **Christianity hall**: ch16 → ch22 → ch60 → ch28 → ch31 → ch64.
- Pros: it tells a family's story continuously.
- Cons:
  - **the data has no family taxonomy.** `eras[].traditions` are display strings, and there is
    no "Christianity" key, so a hand-maintained mapping would be required;
  - many chapters fit no single family (ch18, ch37, ch56, ch45…);
  - chronology is lost;
  - it duplicates the purpose of `traditions.html`.

### Recommendation
**Option A**, with Option B's strength added as **tradition trails**: a floor inlay or
candle-line that guides the visitor through a family's rooms in order (e.g. the Christianity trail
through V → VI → VII → VIII → IX). This needs one small hand-written file of trails, which is the
only curated input. It can be deferred to a late phase.

---

## 4. Room map (default: Option A)

Every chapter is assigned. Counts are **home + see-also**, from current data. A "Flag" marks a
placement that needs Carter's decision or a content gap.

| Wing | Room | Vault (home + see-also) | Pantheon (home + see-also) | Plate | Game | Flag |
|---|---|---|---|---|---|---|
| Wing I · Prehistory | ch41 The Paleolithic | 2 + 1 | 0 + 0 | yes | — |  |
| Wing I · Prehistory | ch42 The Neolithic | 3 + 0 | 0 + 0 | yes | — |  |
| Wing I · Prehistory | ch61 Aboriginal Australian Dreaming | 1 + 0 | 1 + 0 | — | — | Living tradition placed in the Prehistory wing by data.js; signage must not imply it is extinct. Its Vault object (V68 tjurunga) is secret-sacred: no model, no image. |
| Wing II · The Bronze Age | ch02 Egypt | 4 + 0 | 9 + 0 | yes | chess |  |
| Wing II · The Bronze Age | ch03 Mesopotamia | 2 + 0 | 8 + 0 | yes | ziggurat |  |
| Wing II · The Bronze Age | ch04 Indus Valley | 0 + 0 | 0 + 0 | yes | minesweeper | No Vault, no Pantheon: the room holds only its plate and a game kiosk. |
| Wing II · The Bronze Age | ch05 Early Vedic | 0 + 0 | 4 + 0 | yes | — | No Vault objects. |
| Wing II · The Bronze Age | ch57 Hittite & Anatolian | 0 + 0 | 3 + 1 | — | — | No plate, no Vault. |
| Wing III · The Early Iron Age | ch06 Zoroaster | 1 + 1 | 4 + 0 | yes | pong |  |
| Wing III · The Early Iron Age | ch07 Pre-exilic Israel | 4 + 2 | 24 + 7 | yes | — |  |
| Wing III · The Early Iron Age | ch08 Early Greece | 2 + 0 | 3 + 0 | yes | fighter |  |
| Wing III · The Early Iron Age | ch09 Early China | 1 + 1 | 1 + 0 | yes | — |  |
| Wing III · The Early Iron Age | ch58 Canaanite & Phoenician | 0 + 3 | 4 + 1 | — | — |  |
| Wing IV · The Axial Age | ch10 Second Temple Judaism | 5 + 5 | 13 + 5 | yes | — |  |
| Wing IV · The Axial Age | ch11 Buddhism | 3 + 1 | 2 + 0 | yes | — |  |
| Wing IV · The Axial Age | ch12 Confucianism & Daoism | 1 + 0 | 5 + 0 | yes | — |  |
| Wing IV · The Axial Age | ch13 Rome | 1 + 0 | 4 + 2 | yes | risk |  |
| Wing IV · The Axial Age | ch14 Celtic & Germanic | 3 + 4 | 4 + 0 | yes | — |  |
| Wing IV · The Axial Age | ch15 Classical Greece | 0 + 1 | 13 + 3 | yes | — |  |
| Wing IV · The Axial Age | ch52 Jainism | 1 + 0 | 2 + 0 | — | — |  |
| Wing V · Late Antiquity | ch16 Early Christianity | 6 + 4 | 13 + 4 | yes | — |  |
| Wing V · Late Antiquity | ch17 Gnosticism | 2 + 4 | 3 + 3 | yes | — |  |
| Wing V · Late Antiquity | ch18 Roman Mystery Cults | 1 + 2 | 2 + 7 | yes | — |  |
| Wing V · Late Antiquity | ch19 Rabbinic Judaism | 1 + 6 | 1 + 4 | yes | — |  |
| Wing V · Late Antiquity | ch20 Mahayana Buddhism | 0 + 3 | 3 + 1 | yes | — |  |
| Wing V · Late Antiquity | ch45 Pistis Sophia | 0 + 3 | 0 + 1 | yes | — | A single text (Pistis Sophia). Own room, or an alcove off Gnosticism (ch17)? No home exhibits. |
| Wing V · Late Antiquity | ch55 Manichaeism | 0 + 1 | 0 + 0 | — | — | No plate, no Pantheon; one see-also Vault object. |
| Wing VI · The Early Medieval | ch21 Islam | 4 + 1 | 7 + 12 | yes | — | Islam begins in the 7th century; data.js files it under Early Medieval (c. 800–1100). Follow the repo, or move it? |
| Wing VI · The Early Medieval | ch22 Patristic Christianity | 3 + 6 | 0 + 3 | yes | reliquary |  |
| Wing VI · The Early Medieval | ch23 Norse Paganism | 2 + 0 | 9 + 0 | yes | — |  |
| Wing VI · The Early Medieval | ch24 Tantra | 0 + 0 | 3 + 0 | yes | — | No Vault objects. |
| Wing VI · The Early Medieval | ch25 Shinto | 1 + 0 | 5 + 0 | yes | — |  |
| Wing VI · The Early Medieval | ch53 Tibetan & Vajrayana Buddhism | 1 + 2 | 2 + 2 | — | — | Spans far beyond the Early Medieval era it is filed under. |
| Wing VI · The Early Medieval | ch54 Zen & Pure Land Buddhism | 0 + 1 | 0 + 2 | — | — | Spans far beyond the Early Medieval era it is filed under; no home exhibits. |
| Wing VI · The Early Medieval | ch60 Eastern Orthodoxy & Byzantium | 5 + 6 | 0 + 2 | — | — | Heavy Vault load (5 home + 6 see-also relics): needs a larger room or a treasury annex. |
| Wing VII · The High Medieval | ch26 Kabbalah | 3 + 0 | 1 + 2 | yes | — |  |
| Wing VII · The High Medieval | ch27 Sufism | 0 + 1 | 0 + 2 | yes | — |  |
| Wing VII · The High Medieval | ch28 Scholasticism | 3 + 2 | 0 + 0 | yes | — |  |
| Wing VII · The High Medieval | ch29 The Maya | 2 + 2 | 4 + 1 | yes | pacman |  |
| Wing VII · The High Medieval | ch30 Bhakti | 0 + 1 | 6 + 2 | yes | — |  |
| Wing VII · The High Medieval | ch43 The Aztec | 4 + 1 | 5 + 0 | yes | treasure | The Aztec and the Inca (ch44) belong to the High Medieval wing by data.js but run to 1521 / 1532. |
| Wing VII · The High Medieval | ch44 The Inca | 2 + 0 | 4 + 0 | yes | — | See ch43. |
| Wing VII · The High Medieval | ch56 Mandaeans, Yazidis & Druze | 1 + 1 | 1 + 1 | — | — | Three traditions in one chapter: one room partitioned three ways? |
| Wing VII · The High Medieval | ch59 Slavic & Baltic Paganism | 0 + 0 | 4 + 0 | — | — | No plate, no Vault. |
| Wing VII · The High Medieval | ch62 Native North American | 0 + 0 | 3 + 0 | — | — | Living traditions, filed under High Medieval: same framing concern as ch61. |
| Wing VIII · The Early Modern | ch31 The Reformation | 1 + 4 | 0 + 0 | yes | — |  |
| Wing VIII · The Early Modern | ch32 The Witch Trials | 1 + 0 | 0 + 0 | yes | — |  |
| Wing VIII · The Early Modern | ch33 African Traditional Religion | 1 + 1 | 7 + 0 | yes | — | Living traditions, filed under Early Modern: same framing concern as ch61. |
| Wing VIII · The Early Modern | ch34 Sikhism | 1 + 0 | 0 + 0 | yes | — |  |
| Wing VIII · The Early Modern | ch63 Oceania | 1 + 0 | 3 + 0 | — | — | Living traditions, filed under Early Modern: same framing concern as ch61. |
| Wing IX · The Modern Age | ch35 New Religious Movements | 1 + 0 | 0 + 0 | yes | — |  |
| Wing IX · The Modern Age | ch36 Spiritualism | 0 + 0 | 0 + 0 | yes | — | No Vault, no Pantheon: the room holds only its plate. |
| Wing IX · The Modern Age | ch37 Theosophy & the Occult Revival | 1 + 4 | 1 + 0 | yes | ouroboros |  |
| Wing IX · The Modern Age | ch38 Wicca & Modern Paganism | 1 + 0 | 2 + 0 | yes | — |  |
| Wing IX · The Modern Age | ch39 Satanism | 1 + 0 | 0 + 2 | yes | — |  |
| Wing IX · The Modern Age | ch40 African Diaspora Religions | 1 + 1 | 3 + 6 | yes | seeker |  |
| Wing IX · The Modern Age | ch64 Pentecostalism & Global Christianity | 0 + 0 | 0 + 0 | — | — | No Vault, no Pantheon, no plate: an empty room until content exists. |
| Wing IX · The Modern Age | ch65 Bahá'í & New Faiths | 1 + 0 | 0 + 0 | — | — | No Pantheon, no plate: one Vault object only. |
| Rotunda (themes) | ch01 The Flood | 0 + 1 | 1 + 2 | yes | — |  |
| Rotunda (themes) | ch46 Creation & the First Order | 0 + 6 | 2 + 11 | yes | pinball |  |
| Rotunda (themes) | ch47 Journeys to the Underworld | 0 + 5 | 0 + 15 | — | — | No home exhibits: alcove shows see-also items only. |
| Rotunda (themes) | ch48 The Great Goddess | 0 + 2 | 0 + 21 | — | — | No home exhibits: alcove shows see-also items only. |
| Rotunda (themes) | ch49 Sacred Kingship | 1 + 12 | 0 + 10 | — | — |  |
| Rotunda (themes) | ch50 The End of Days | 0 + 5 | 0 + 5 | — | — | No home exhibits: alcove shows see-also items only. |
| Rotunda (themes) | ch51 Sacrifice & the Scapegoat | 0 + 2 | 0 + 3 | — | — | No home exhibits: alcove shows see-also items only. |

Totals: 9 wings, 58 tradition rooms, 7 rotunda alcoves (65 chapters), 87 Vault objects (each with
one home), 199 Pantheon figures (each with one home). Wing sizes: I 3, II 5, III 5, IV 7, V 7,
VI 8, VII 10, VIII 5, IX 8.

---

## 5. Pilot scope: Entrance, one hallway and the Early Christianity room (ch16)

- **Entrance hall:** the title and the compass-rose brand mark (the header SVG, reused) with an
  orientation plaque (what the museum is, the evidence standard, a link to `methodology.html`).
  It carries the "Skip the 3D" link to the fallback and a lintel with a room directory. The
  Rotunda doorway is shown **closed** in the pilot.
- **Hallway:** one spine segment with nine era doorways. **Only Wing V is open**; the others are
  closed doors with the era name and dates, linking to `/eras/NN-slug.html`. Wing V's door carries
  `EMBLEMS['05-late-antiquity']`.
- **Room ch16:**

| # | Exhibit | Source | Placement | Opens |
|---|---|---|---|---|
| 1 | Chi-Rho in a victor's wreath (chapter plate) | `PLATE_ART.ch16` | Wall carving, back wall centre | `/chapters/ch16.html` |
| 2 | Late Antiquity emblem | `EMBLEMS['05-late-antiquity']` | Doorway lintel | `/eras/05-late-antiquity.html` |
| 3 | The James Ossuary (V16) | Vault | Case (pedestal); a **disputed** inscription | `/vault/james-ossuary.html` |
| 4 | Codex Sinaiticus (V18) | Vault | Case (lectern) | `/vault/codex-sinaiticus.html` |
| 5 | The Hinton St Mary Mosaic (V84) | Vault | Floor inset under glass (a mosaic belongs on the floor) | `/vault/hinton-st-mary-mosaic.html` |
| 6 | The Holy Lance (V05) | Vault | Case (pedestal) | `/vault/holy-lance.html` |
| 7 | The Lindisfarne Gospels (V42) | Vault | Case (lectern) | `/vault/lindisfarne-gospels.html` |
| 8 | The "Gospel of Jesus's Wife" (V17) | Vault | Case (lectern), with a **"Proven forgery"** band on the case | `/vault/gospel-of-jesus-wife.html` |
| 9 | The Dead Sea Scrolls (V02) | Vault, home ch10 | See-also plaque | `/vault/dead-sea-scrolls.html` |
| 10 | The Pilate Stone (V44) | Vault, home ch13 | See-also plaque | `/vault/pilate-stone.html` |
| 11 | The Nag Hammadi Codices (V08) | Vault, home ch17 | See-also plaque (next to the ch17 doorway) | `/vault/nag-hammadi-codices.html` |
| 12 | The Gospel of Judas (V40) | Vault, home ch17 | See-also plaque | `/vault/gospel-of-judas.html` |
| 13–25 | Jesus\*, Mary, John the Baptist, Peter, Paul\*, Mary Magdalene, John the Apostle\*, Thomas, Judas, James, Pilate, Lazarus, Joseph of Arimathea\* | Pantheon, home ch16 | Niche (13 niches); \* = has a "Contested" line | `/pantheon.html#<id>` |
| 26–29 | Michael, Satan, Gabriel, Herod\* | Pantheon, home ch10 | See-also portrait plaques | `/pantheon.html#<id>` |
| 30 | Chapter lectern | `data.js` summary | Lectern at the entrance of the room | `/chapters/ch16.html` |
| 31 | Doorways onward | `links.siblings` | Doors to ch17, ch18, ch19, ch20, ch45, ch55 (closed in pilot) | `/chapters/chNN.html` |

Symbology motifs in the chapter prose (the ichthys, staurogram, Alpha–Omega, Good Shepherd,
orant, anchor, dove, 666/616, the Shroud) are **not in any data file**. The pilot shows only the
plate. Turning the symbology prose into structured carvings is a content decision (§13).

---

## 6. Exhibit interaction

1. **Approach** (within about 2 m, or looking at it): a soft rim glow and a small floating name
   tag. Nothing opens by itself.
2. **Select** (click, tap, E/Enter, or Tab-focus + Enter): a **label card** opens as a **DOM
   overlay**, not text drawn in WebGL. That keeps it selectable, zoomable, translatable and
   readable by screen readers. The card shows:
   - **Vault:** title · category · dated · held · the Vault summary verbatim. The button is
     "Open the Vault entry →"; the category band reads *Manuscript*, *Relic*, etc., and V17 also
     carries *Proven forgery*.
   - **Pantheon:** name · epithet · tradition · description; the `c` note as a separate
     **"Contested:"** line; the button is "Open in the Pantheon →".
   - **Symbol / plate:** the plate caption verbatim, which already says "An original rendering…
     not a specific inscription"; the button is "Read the chapter →".
   - Every card ends with a fixed footer: *"Interpretive display. The linked page carries the
     sources and the evidence verdict."*
3. **Open:** same tab by default, with `?from=museum&room=ch16` so the page can later show a "Back
   to the museum" link. Returning restores position from `sessionStorage`.
4. **Games (optional):** a chapter with a game (12 rooms; not ch16) gets a **kiosk** exhibit whose
   button goes to `/symbols.html#play=<id>`. This uses the existing mechanism unchanged.
5. **Deep links into chapter sections** need `id`s on chapter `<h2>`s (e.g. `#symbology`,
   `#evidence`), plus one on the Vault evidence section. That is a small change to
   `build-chapters.js` / `md-to-chapter.js`, **outside `museum/`**, proposed for Phase 3 with
   approval. Until then, cards link to the page top, `#figures` or `#in-the-vault`.

---

## 7. Tech choice: **Three.js (recommended)** vs Babylon.js

| | Three.js | Babylon.js |
|---|---|---|
| Size (min+gzip, published figures to re-measure in Phase 1) | core about 170–185 kB | about 1.4–1.8 MB for `@babylonjs/core` (tree-shakes with a bundler) |
| Fit with this repo (no bundler) | ES modules loaded by `<script type="module">` + an import map, vendored under `docs/assets/vendor/three/` (like OpenSeadragon); only the addons used are copied | Tree-shaking needs a bundler, which the repo does not have; without one you ship the full UMD build |
| glTF / Draco / KTX2 | `GLTFLoader`, `DRACOLoader`, `KTX2Loader` addons; decoders are WASM, vendored and lazy-loaded | Built in (loaders package), same codecs |
| Mobile performance | Lean renderer, full control; we add only what we need | Excellent, but a heavier runtime to parse on low-end phones |
| Batteries | We write collision, navigation and controls (small: a walkable floor mesh + wall boxes) | Collisions, cameras and an inspector included |

**Recommendation: Three.js**, pinned to one version and self-hosted:
- it is roughly a tenth of Babylon's download;
- it needs no build tooling, keeping the repo's "plain files, no npm" character;
- the museum's needs (static rooms, baked light, click-to-inspect) are simple.

Note: since r160 Three.js ships **ES modules only** (the `build/three.min.js` script build was
removed), so the museum page is the site's first `type="module"` page. That is fine on every
browser that also supports WebGL2.

Sources for the figures: Three.js PR #25435 (removal of `build/three.min.js`); Bundlephobia
listings for `three` and `@babylonjs/core`; the LogRocket and Utsubo comparisons (2025–2026). All
are to be re-measured on the vendored files in the Phase 1 spike.

---

## 8. Asset list for the pilot

Modelled in **Blender** as a modular kit with **baked lighting** (lightmaps).

**Export spec:**
- glTF 2.0 binary (`.glb`), metres, Y-up; no cameras or lights in files.
- Lightmap in `TEXCOORD_1`.
- Geometry compression: **Draco**, or meshopt (smaller decoder); decide in Phase 1.
- Textures: **KTX2**, ETC1S for albedo and UASTC for normals.
- Extensions: `KHR_materials_emissive_strength` for candle flames; `KHR_texture_transform`
  allowed.

**Texture sizes:** 512² for the kit, 1024² for hero props, one 2048² lightmap atlas per room
(1024² on mobile).

S = needs Carter's **style approval**; R = **reuses existing 2D art**.

| Asset | Notes | S | R |
|---|---|---|---|
| Entrance hall shell (floor, walls, vaulted ceiling, doors) | Cathedral-archive look: stone, bronze trim, candle sconces | S | |
| Spine hallway segment + 9 era doorways | Door lintels carry the era emblem | S | R: `EMBLEMS` SVG → texture |
| Room shell, ch16 (about 12 × 16 m, apse at back) | Late-antique basilica feel | S | |
| Wall-carving panel | Bronze relief look | S | R: `PLATE_ART.ch16` SVG → normal/albedo |
| Display case, pedestal (glass + bronze) | Reused in every room | S | |
| Display case, lectern (angled) | Reused in every room | S | |
| Floor-inset vitrine (for V84 mosaic) | | S | |
| Stand-in props: ossuary box, closed codex, open codex, spear, papyrus leaf | **Generic stand-ins, labelled "stand-in, not a replica"**; no photographic textures of the real objects | S | |
| Statue niche + **emblem medallion** (13) | Recommended: niches hold the Pantheon's own **interpretive emblems** as bronze medallions, not sculpted human likenesses (consistent with the Pantheon's note that emblems "do not reproduce any historical image") | S | R: `PANTHEON_ART.svg()` → texture |
| Calligraphy panel variant | For `glyph:` figures (none in ch16; needed for ch21) | S | R |
| See-also plaque (bronze frame, parchment) | Text is DOM, not baked | S | |
| Chapter lectern, bench, candle sconce (emissive), rope barrier | Kit | S | |
| Orientation plaque | | | |
| Fonts | Existing web fonts; no new licences | | R |

Tooling, not an asset: **SVG → texture** baking of plates, emblems and Pantheon art (headless
Chromium is already available) plus KTX2 encoding (`toktx` / `basisu`). Installing those is a
Phase 1 action that needs approval.

---

## 9. Performance budget (gate for G1 and G3)

| Item | Mid-range mobile (e.g. a 2023 mid-range Android on "Fast 4G") | Desktop (broadband) |
|---|---|---|
| JS (three + addons + museum app) | ≤ 250 kB gz, decoders lazy | same |
| Entrance + hallway download | ≤ 4 MB | ≤ 6 MB (higher-res lightmaps) |
| Per room download | ≤ 3 MB (glb + KTX2) | ≤ 5 MB |
| First interactive frame | ≤ 5 s | ≤ 2.5 s |
| Room-to-room load, prefetched | ≤ 1 s | instant |
| Triangles rendered | ≤ 150 k | ≤ 400 k |
| Draw calls | ≤ 80 | ≤ 200 |
| GPU texture memory | ≤ 128 MB | ≤ 384 MB |
| Frame rate | ≥ 30 fps sustained | 60 fps |
| Pixel ratio cap | 1.5 | 2 |

- **Lazy loading:** the manifest loads first (small JSON). The entrance loads at start; entering a
  hallway prefetches the rooms behind its open doors. Rooms two or more steps away are disposed.
- **Instancing:** cases, niches and plaques are instanced.
- **Stand-ins:** props share one atlas per room.

---

## 10. Controls and accessibility

- **Desktop:**
  - WASD / arrow keys to walk; click the view to look (pointer lock); Esc releases it.
  - E / Enter selects the exhibit in view.
  - Q / Shift+Tab steps through exhibits.
- **Mobile:**
  - tap the floor to walk there (smooth glide);
  - drag to look;
  - tap an exhibit to open its card;
  - two-finger drag or on-screen arrows as an alternative.
- **Keyboard and screen reader:** a DOM mirror lists the current room's exhibits in order
  (visually a collapsible side panel). Tab moves focus there, and focusing an item turns the
  camera to it. Every exhibit is reachable without the 3D view.
- **Reduced motion:** honours `prefers-reduced-motion` plus an in-museum toggle, stored in
  `localStorage` with try/catch. Movement becomes a fade-teleport instead of a glide, with no
  camera easing and no head-bob.
- **Non-3D fallback:**
  - Shown when WebGL2 is missing, device memory is low, or the context is lost, or the visitor
    chooses "Skip the 3D".
  - It is a plain HTML **museum directory**, generated from the same manifest: wings → rooms →
    exhibits, every one a normal link.
  - `<noscript>` shows the same directory.
- Minimum contrast and card font sizes follow `archive.css` tokens.

---

## 11. SEO: zero impact on the indexable site

- **Route:** `/museum.html` (entry point) + `/museum/` (manifest, `.glb`, `.ktx2`, JS). The directory
  URL `/museum/` would also resolve on Pages; a single `.html` keeps it like the rest of the site.
- **`<meta name="robots" content="noindex, follow">`** on `museum.html`. Crawlers skip it but
  still follow its links to the canonical pages. No `rel=canonical` pointing elsewhere: the page is
  not a duplicate of any one page, so noindex is the honest signal.
- **`_headers`:** `X-Robots-Tag: noindex` on `/museum/*`, which covers the JSON and binaries. Add
  `Cache-Control: public, max-age=31536000, immutable` for hashed asset files.
- **Sitemap:** `buildSitemap()` in `tools/build-pages.js` is an **explicit allowlist** (home,
  listings, eras, published chapters, `vault.html`, `pantheon.html`, Vault items). The museum is
  excluded unless someone adds it; confirmed by reading the function.
- **Static pages:** unchanged, apart from two optional changes that each need approval:
  - one nav or footer link to the museum;
  - `id`s on chapter `<h2>`s (§6), which changes no content.
- **Duplicate content:** label text is verbatim excerpts, but it lives in noindexed JSON/DOM, so
  it cannot compete with the source pages.

---

## 12. Phased build plan (approval gate between every phase)

| Phase | Scope | Output | Gate |
|---|---|---|---|
| **0 Scoping** (this) | Audit + plan | `museum/00-scoping/` | G0: Carter picks the layout and tech and answers §13 |
| **1 Tech spike** | Vendor a pinned Three.js + loaders. `tools/build-museum.js` writes `manifest.json`. A **grey-box** entrance, hallway and ch16 room from primitives (no art); controls, label cards, fallback directory, `noindex`. Measure on a real phone. | `museum/01-spike/` report + code on branch; **preview alias only** | G1: §9 budget met or a revised budget approved |
| **2 Style / look-dev** | Blender kit prototypes and 2–3 rendered frames of the ch16 room (materials, candlelight, bronze, parchment); SVG→texture tests of plate, emblem and Pantheon medallion | Frames + material sheet | G2: Carter style sign-off |
| **3 Pilot build** | Final kit + ch16 room with baked lighting; all 31 pilot exhibits; a11y pass; headers; optional chapter `<h2>` ids | Working pilot on **preview** | G3: Carter reviews on preview |
| **4 Pilot launch** | Merge to `main`; `/museum.html` live, marked "Beta"; optional nav link | Production | G4: Carter approves going live |
| **5 Wing V complete** | Remaining 6 Late Antiquity rooms | Production | G5 |
| **6…13 Wings** | One Age per phase (VII last: 10 rooms) | Production | one gate each |
| **14 Rotunda** | 7 theme alcoves | Production | gate |
| **15 Extras** | Tradition trails, game kiosks, "Back to museum" links on pages | Production | gate |

---

## 13. Founder-lane decisions and blockers (for Carter)

1. **Layout: A (Ages) or B (tradition halls)?** Recommended: A with tradition trails later.
2. **Tech: Three.js** (recommended) or Babylon.js?
3. **Art style sign-off:** the "cathedral archive" direction (stone, bronze, parchment, candlelight)
   is confirmed at Gate 2 from rendered frames, before any room is finished.
4. **Figures:** emblem medallions in niches (recommended), or sculpted statues? Statues mean far
   more modelling and imply a likeness no source supports. Glyph figures (Muhammad, Fatima, Ali)
   are calligraphy panels under either option.
5. **Objects:** generic, labelled stand-in props (recommended), or modelled replicas of specific
   artifacts (much more work, and it raises image-rights questions for some objects)?
6. **Home-room rule:** is the first chapter in a Vault item's or figure's list its home room?
7. **Living traditions** filed in early wings by `data.js` (ch61, ch62, ch63, ch33): keep the
   repo's placement with explicit signage, or move them to a "Living traditions" annex? Secret-sacred
   objects (V68) get no model either way.
8. **Unclear placements:**
   - ch21 (Islam in Wing VI);
   - ch45 (own room, or an alcove of ch17?);
   - ch56 (one room, three partitions?);
   - ch60 (needs a treasury annex for 11 relics?).
9. **Empty or thin rooms:** ch64 has nothing to show yet, and ch04, ch36 and ch65 are nearly empty.
   Build them sparse, or hold them until content exists?
10. **Symbology as carvings:** extract each chapter's symbology motifs into structured data (a new
    content task under the sourcing standard), or show only the plate?
11. **Out-of-scope fixes this audit surfaced**, to approve separately:
    - the broken evidence box on ch01–ch20;
    - plates for ch47–ch65;
    - lens headings on ch45–ch65.
12. **Tools and money:**
    - Blender and KTX2 tools are free, but installing them needs approval (Phase 1–2);
    - any **paid** 3D assets, texture libraries or a commissioned artist are Carter's call; none
      are assumed;
    - Blender source files are large: keep them in git, in Git LFS (may cost money), or outside
      the repo?
13. **Hardware:** a real mid-range Android phone (and ideally an older iPhone) for the G1 and G3
    measurements. Emulated throttling is not a substitute.
14. **Preview deploys** run through the manual `workflow_dispatch` in GitHub Actions. Carter may
    need to trigger them, or grant Claude permission to.
15. **Entry point:** URL `/museum.html` and the "Beta" label as proposed? Add it to the site nav at
    launch, or keep it unlinked at first?
