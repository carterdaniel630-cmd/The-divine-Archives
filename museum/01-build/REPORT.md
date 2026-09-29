# Virtual Museum — Phases 1–4 build report (single batch)

**Branch:** `claude/virtual-museum` → fast-forwarded to `main`. **Date:** 2026-09-28.
Carter asked for the whole plan (`museum/00-scoping/PLAN.md`) to be completed as one batch. Each
gate that PLAN §12 put between phases was therefore passed on the recommendations in PLAN §13. Every
one of those choices is listed below and can be reversed; none needed new infrastructure.

## What shipped

- **`/museum.html`** (beta):
  - **walls, floors and props:** built procedurally from the site's data;
  - **structure:** an entrance hall, the Rotunda of comparative themes (7 bays plus 1 reserved) and
    the Spine gallery with **9 wings, one per Age, holding all 65 chapters** (58 rooms, 7 bays);
  - **exhibits:** all **87 Vault objects** and **199 Pantheon figures** are placed, each once in its
    home room;
  - **links:** every exhibit opens the archive's own page.
- **`tools/build-museum.js`:**
  - **inputs:** `data.js`, `plates.js`, `emblems.js`, `vault-data.js`, `pantheon-data.js`,
    `pantheon-art.js`, and the chapter→game map read out of `symbols.html`;
  - **outputs:** `docs/museum/manifest.json` (32 KB) and ten per-wing detail files in
    `docs/museum/wings/` (14–173 KB raw, 5–22 KB gzipped), and it prerenders the fallback directory
    into `museum.html`;
  - **no duplicated text:** nothing is typed twice. The only curated inputs are the living-tradition
    list, the no-image list, the floor-vitrine override and the six tradition trails.
- **`docs/museum/app.js`** (75 KB, 23 KB gzipped): the engine.
- **`docs/assets/vendor/three/`:** three.js r186 core and module, minified once with esbuild. The
  exact command is in its `README.txt`, and the MIT licence is included.
- **Site hooks:**
  - a "VII · The Museum (beta)" card on the home page (the Arcade becomes VIII);
  - a "Walk this chapter's room in the Museum (beta)" link at the foot of every chapter page;
  - `X-Robots-Tag` headers for `/museum.html` and `/museum/*`.

## Decisions taken on the recommendations (PLAN §13)

| # | Decision | Taken as |
|---|---|---|
| 1 | Layout | **A**: one wing per Age off a chronological Spine, themes in a central Rotunda. Tradition trails (Christianity, Judaism, Buddhism, Islam, Gnosis & dualism, Western esotericism) are offered from the entrance-hall board and the Room guide, not as floor inlays |
| 2 | Engine | **Three.js**, vendored, no bundler |
| 3 | Art style | "Cathedral archive": stone, dark wood, bronze, candlelight, all procedural. **Carter to review live** |
| 4 | Figures | The Pantheon's **emblem medallions** in wall niches; `glyph:` figures (Muhammad, Fatima, Ali) as **calligraphy panels** |
| 5 | Objects | **Generic stand-in props** chosen by object type, each label saying "Stand-in, not a replica". The Hinton St Mary mosaic lies in a floor vitrine with a **generic tesserae pattern**, so labelled. V17 carries a **"Proven forgery"** band |
| 6 | Home room | The **first chapter** in an item's list. Other rooms list it on their "See also" board, which links to it and offers "go there" |
| 7 | Living traditions | Kept in the repo's wings (ch33, ch61, ch62, ch63), each with **"A living tradition"** plaque text. **V68 (tjurunga) and V76 (the Báb's tablet) get plaques, no case or prop** |
| 8 | Unclear placements | Kept as `data.js` files them: ch21 in VI; ch45 its own room; ch56 one room; ch60 a standard room (its 5 cases fit) |
| 9 | Thin rooms | Built as they are (ch64 now has its new illustration, so no room is empty) |
| 10 | Symbology carvings | **Plate only**. Structured symbology extraction stays a content task for later |
| 11 | Out-of-scope fixes | **Done** in this batch (see below) |
| 12 | Tools and money | Nothing paid. No Blender (see "Deviations"). esbuild ran once, outside the repo |
| 13 | Hardware | No physical phone was available. Measured with Chromium's device emulation and network/CPU throttling instead. **A real-device check is still owed** |
| 14 | Preview deploys | Not used. The museum is additive, `noindex`, and changes no existing URL, so it went straight to production as "beta" |
| 15 | Entry point | `/museum.html`, labelled beta, linked from the home page and every chapter |

## Deviations from the plan, and why

- **No Blender, no baked lightmaps, no glTF.**
  - Why: Blender is not installed here and no artist was engaged.
  - Instead: the building is generated in code from the manifest. That makes all 65 rooms cost
    about the same as one, keeps the whole museum in sync with the archive on every rebuild, and
    downloads no model files at all.
  - Lighting: a pool of four point lights that follow the visitor to the nearest lamps, a lantern
    light on the camera, hemisphere fill and fog.
  - A future art pass can still replace the kit with glTF props. PLAN §8 remains the spec for that.
- **See-also items share one board per room**, which opens a list with links and "go there". PLAN
  had one plaque per item, but rooms such as ch21 (13 items) or ch49 (22) would have been
  unreadable.
- **Wall art is the archive's SVG drawn onto canvases at runtime.** No texture files are shipped,
  so there is no KTX2 step.

## Measurements (headless Chromium, SwiftShader; see "Owed")

| Budget item (PLAN §9) | Budget | Measured |
|---|---|---|
| JS, gzipped | ≤ 250 kB | **219 kB** (three core 104 + module 92 + app 23) |
| Entrance + hallway download | ≤ 4 MB mobile | about **260 kB** (HTML, CSS, JS, manifest; fonts are the site's own) |
| Per-room/wing download | ≤ 3 MB mobile | **5–22 kB** gzipped per wing file |
| Draw calls | ≤ 80 mobile | steady state across all 65 rooms: median **29**, busiest room **52** (ch16), Rotunda **46**, a wing corridor **50**, hall **18** |
| Triangles | ≤ 150 k mobile | max about **24 k** in a room |
| Cold start, emulated phone, CPU ×4 | ≤ 5 s first interactive | **2.0 s** on fast 4G (9 Mbps, 60 ms). **6.1 s** on slow 4G (1.6 Mbps, 150 ms), over budget, and that figure includes a 1.5 s font wait because Google Fonts is blocked in the test sandbox |
| Wing load after a teleport, same profiles | ≤ 1 s prefetched | **2.2 s** fast 4G, **4.3 s** slow 4G when not prefetched, with software rendering (SwiftShader). Walking prefetches wing data from 30 m away |

Software rendering (SwiftShader) and emulated devices overstate CPU cost and say nothing about real GPU frame rates. Frame rate was therefore not measured; the real-device check below is owed.

## Tests run (all passing at merge)

- **All 65 rooms:** each rendered with exactly its home Vault objects and home figures (manifest vs
  scene), and the location label names the right room.
- **Links:** 84 distinct card links from the first 60 exhibits, including `#evidence`, `#symbology`
  and `#figures` anchors, all resolve.
- **Collision:** walking into a case or wall stops.
- **Room guide and directory:** the Room guide lists the room's exhibits and trail steps. The
  directory lists 65 rooms, and "walk there" enters 3D at the room.
- **Phone:**
  - `#ch16` deep link skips the intro;
  - tap-to-walk moves;
  - a tap on an exhibit opens its card. A bug was found and fixed here: the browser's click after a
    tap could fire a card link the moment the card appeared.
- **Reduced motion:** honoured from the OS setting and the toggle.
- **Fallbacks:** without WebGL, the directory appears with an explanation; with JavaScript off, the
  directory's 365 links are all present.
- **Search visibility:** `noindex, follow` meta and header, and nothing museum-related in
  `sitemap.xml`.
- **Site checks:** all twelve game verifiers still pass.

## Also done in this batch (PLAN §0 / §13 item 11)

- **Evidence panel fixed on ch01–ch20.**
  - Cause: the converter read "verdict heading + bullet list" as a single paragraph.
  - Fix: the converter was repaired, and the 20 panels regenerated with word-for-word identical
    text.
- **Stable anchors:**
  - chapter `<h2>`s get ids (`#symbology`, `#the-skeptical-lens`, …) and the panel is
    `#evidence`;
  - Vault pages get `#evidence`, `#symbology` and `#connections`.
- **Believer's and skeptical lens sections for ch45–ch65** (21 pairs), each restating claims already
  sourced in its own chapter.
- **Interpretive plates for ch47–ch65** (19), drawn from each chapter's symbology section.
- **Pending review:** those 21 chapters carry the pending-review tag again until Carter clears the
  new material.

## Addendum, 2026-09-28: the planetarium and the star vaults

Carter asked for a night-sky or planetarium look on the ceilings, with interactive constellations.

- **The Rotunda's dome is a planetarium** (`docs/museum/sky.js`, `docs/museum/ephem.js`):
  - **what it shows:** the real sky over one of six sites the archive writes about: Babylon (ch03),
    Giza (ch02), Delphi (ch08), Stonehenge (ch42), Chichén Itzá (ch29) or Rapa Nui (ch63). It includes
    5,044 stars to magnitude 6 (XHIP), the Milky Way (Vieira's outlines), the 88 IAU constellations
    with figures and names, and the Moon and five planets at their computed positions;
  - **time:** the sky turns with the site's sidereal time. It shows "tonight, 22:00" by default, with
    "Now" and "Run the sky" (20 minutes of sky a second) as options;
  - **picking:** tapping or looking at the dome picks the constellation whose official IAU boundary
    contains that point, or a planet, the Moon, or the horizon. The boundary is outlined in gold;
  - **cards:** each card gives the astronomy, then only what the archive's chapters say. The
    curated lore (`museum/sky-lore.json`, 18 entries) has 43 `basis` quotes that
    `tools/verify-sky.js` checks against chapter text in CI, and contested or refuted claims carry
    their verdict (the Mithraic star-map theory is "Contested"; the Dogon/Sirius B claim is "Not
    supported"). A constellation the archive does not discuss says so;
  - **honesty notes on the cards:**
    - the stick figures are a convention;
    - the positions are modern (J2000), and precession means the ancient sky differed;
    - the Moon is drawn larger than life.
- **Accuracy:** checked against the astronomy-engine library for 1990–2045.
  - Planets are within 0.17°.
  - The Moon is within 0.32°.
  - Sidereal time is within 0.005°.
  - The IAU-boundary test puts 99% of 3,240 catalogued stars in their catalogue constellation. The
    remainder lie on a border, and the cards use the catalogue's own assignment for named stars.
- **The entrance hall and the Spine** have a lapis vault with gilded five-pointed stars (decoration,
  not a star map). The Rotunda's central lamp was removed so the dome is dark, and a star-projector
  prop at its centre opens "About this sky".
- **Cost:** `sky.json` is 207 KB (88 KB gzipped), loaded after the museum starts. The Rotunda
  now draws about 32 calls.

## Addendum, 2026-09-28: the object inspector and V88

- **Every Vault case opens.**
  - **Opening it:** clicking a case takes its object out of the glass into a close-up (`docs/museum/inspect.js`), with the object's label beside it.
  - **Handling it:** you can turn it by dragging and zoom with the wheel or a pinch.
  - **What each kind does:**
    - scrolls unroll;
    - books open and turn their pages;
    - caskets and chests lift their lids;
    - tablets, slabs, bones and discs turn over;
    - bowls tilt to show their inner spiral;
    - cloth unfolds and khipu cords fan out.
  - **Honesty:** every model is a generic stand-in for its kind of object, and any writing on it is illustrative marks, not the text. The inspector says so under every object.
- **V88, the skull of "Mary Magdalene" at Saint-Maximin** is a new Vault entry, added at Carter's request and pending review.
  - It stands in its home room (Early Christianity, ch16) in a niche of its own.
  - It is a modelled rendition of the 1860 reliquary, after published descriptions and a photograph Carter supplied:
    - the frieze plinth with its shields;
    - four angels lifting the bust;
    - the hooded head with the skull behind glass;
    - the little shrine holding the vial of the *noli me tangere*.
  - It is labelled a rendition, not a replica.
- **Detailed V88 (2026-09-28).** The reliquary now has a module of its own, `docs/museum/reliquary.js`.
  - Worn gilding is drawn as procedural colour, roughness and relief maps: tarnish in the recesses, patches rubbed through to bronze, scratches.
  - The model adds claw feet, a chased rosette frieze, enamelled shields, feathered double wings, pleated robes and an ashlar niche.
  - In the inspector it stands in a limestone niche. A spotlight casts soft shadows, a polished floor reflects it (a mirrored copy under a translucent floor), and two candles flicker.
  - In the museum case a single static spotlight throws its shadow on the niche. The shadow map is drawn once, because the piece never moves.
  - Touch devices get the lighter build and a 1024 shadow map.
  - The V88 entry states that the wear, shadows and reflection are rendered effects, not a record of the object's condition.

- **Skies, grounds, animals, sound and renditions (2026-09-28).** Carter asked for every relic at the V88 standard, a slightly brighter museum, skies and grounds that suit each room, sound in every room, and animals.
  - `docs/museum/world.js`: every room, corridor, the hall and the Spine have their own sky in a skylight (a shader with parallax, lightning in the storm rooms, the Spine passing from day to night). Under a glass floor on a bronze grid is a sunken ground lit by that sky: brooks, rivers, the Nile, lotus ponds, a shore with breaking waves, dunes, snow, a cave, ash with glowing cracks, a starry abyss, and more. The choices are in one table, `ENV`. The planetarium is untouched.
  - `docs/museum/fauna.js`: fish that school and leap; birds, bats and insects; and walkers on small skeletons (cats that stalk lizards and pounce, herons, ibises and cranes that wade and strike, crabs, frogs, turtles, scorpions, ravens, an owl, hares, mice).
  - `docs/museum/sound.js`: each area's sound is synthesised with Web Audio from its sky, ground and animals. Nothing is downloaded. It starts after the first click, and a Sound button turns it off.
  - `docs/museum/relics.js`: a modelled rendition of each of the 85 Vault objects the museum shows, built from the physical details in its Vault entry. Each carries illustrative marks, never the text, and can be turned, opened or unrolled. Objects whose existence is in question (the Ark, the Golden Plates) follow their texts' descriptions and say so. V68 and V76 still get no model. The cases show the same renditions at lower texture resolution.
  - Reduce motion stills the water, clouds, plants and animals and turns off the lightning. The lightning never pulses more than twice in a second, and never more often than every several seconds.
  - Exposure is 1.3, up from 1.15, and the hemisphere light 1.3, up from 1.15.

## Owed / needs Carter

1. ~~Style sign-off on the live museum (Gate 2).~~ Passed by Carter, 2026-09-28.
2. **A real mid-range phone check** (Gate 1/3 hardware). The numbers above come from emulation.
3. ~~Review of the 21 chapters with new lens sections and plates (ch45–ch65).~~ Cleared by Carter, 2026-09-28.
4. Whether to keep the museum linked from the home page and chapters while it is in beta.

## Addendum: Read it in English (2026-09-29)

Every Vault object in the museum now has a **Read it in English** button in the inspector. It opens a panel under the label with what the real object says (the rendition's own marks stay illustrative), in one of four forms, each labelled and sourced:

- **Public-domain translation, quoted exactly** (22 objects): KJV, Newton's Emerald Tablet, Budge, Charles, Chamberlain, Legge, Westcott, Macauliffe, King and Thompson, Liliʻuokalani, Barth, Evans-Wentz, Summers, Pickthall, the 1830 Book of Mormon, the Book of the Law.
- **Literal rendering** (9) of a short published reading (Pilate Stone, James Ossuary, Holy Lance sleeve, Mesha, Merneptah, Kensington, the Diamond Sutra colophon, and others).
- **Summary in our own words** (29) where the standard translations are still in copyright (Pyramid Texts, Cyrus Cylinder, Gospel of Judas, Satanic Bible, Book of Shadows and others): described, not copied.
- **No English to give** (26), with the reason: undeciphered (Voynich, Rohonc, Phaistos, Pictish symbols), pictorial (Borgia, Boturini), or no writing at all (Nebra, Lion Man, Benin, relic cloths).

Data: `docs/museum/english.js`. Every quoted line was checked against a published copy before it went in.

## Addendum: real scans (2026-09-29)

Eleven Vault objects now have a **View the real scan** button in the inspector, which shows a published 3D scan of the actual object in Sketchfab's own embedded viewer. As with the Vault's manuscript viewer, the scan is loaded in the visitor's browser straight from the publisher, only when asked for; nothing is downloaded into or hosted by the site, and the caption names the maker and links to the Sketchfab page, where its licence is given.

- **Published by the holding museum or an official heritage body (6):** Rosetta Stone (British Museum), Venus of Willendorf (Natural History Museum Vienna), Lion Man (Baden-Württemberg State Office for Monument Preservation, CT scan), an oracle bone (British Library), a Pictish cross-slab at Aberlemno (Historic Environment Scotland), Rök runestone (Arkeologerna).
- **Scans of the real object by professional or independent makers (5):** stećci at Radimlja (Global Digital Heritage), Kensington Runestone (Artec 3D), Merneptah Stele and the chambers of Unas's pyramid (photographed on site in Cairo and Saqqara), Cyrus Cylinder (photographed at the British Museum).
- **Left out:** scans whose subject or maker was unclear (Tel Dan, Behistun, Ishtar Gate bricks, Phaistos Disc, Gate of the Sun), imitations and reconstructions (Berlin Gold Hat copies, Göbekli Tepe sculptures), and the Benin Bronzes, pending a decision on objects whose return is claimed.

Data: `docs/museum/scans.js`. The session environment blocks Sketchfab, so the embeds were checked for markup, toggling and layout, not for the remote content itself.
