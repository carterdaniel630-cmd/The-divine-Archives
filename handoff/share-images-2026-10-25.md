# Share images — six pages, picked by atlas (Carter's order 2026-10-25 ~22:11)

Carter authorized atlas to pick the six share images himself (2026-10-25 ~22:11).
This supersedes the old rule that Carter picks the images himself. Nothing here
goes live without Carter's usual merge approval for the loop's PR.

## The six picks

### 1. museum.html — the Museum main page
- **Image:** `share-museum.jpg` (1200×630) — carrier `share-museum.jpg.b64.txt`
- **What it shows:** the museum's own parchment floorplan map, "Section VII – The Museum,"
  with its nine wings, the Path of the Nine Ages, and the Grand Entryway.
- **Source:** existing workspace art — the museum section map already made for the
  project (cropped to 1200×630). No new generation, no outside image.
- **og:description (new — page has none):**
  `Walk nine wings of rooms, from Prehistory to the Modern Age, holding the figures and relics of the world's traditions.`

### 2. random.html — the random page
- **Image:** `share-random.jpg` (1200×630) — carrier `share-random.jpg.b64.txt`
- **What it shows:** a candlelit archive hall — shelves of scrolls, books, and
  relics under a round window. General archive imagery; it depicts no specific
  page, which is right for a page that serves a random archive page.
- **Source:** existing project art — the Divine Archives brand cover image
  already made for the project (cropped to 1200×630).
- **og:description (new — page has none):**
  `A random page from the archives — one tradition, figure, relic, or story, drawn from the whole collection.`

### 3. pilgrimage.html — the Pilgrimage main page
- **Image:** `share-pilgrimage.jpg` (1200×630) — carrier `share-pilgrimage.jpg.b64.txt`
- **What it shows:** a winding stone pilgrim's path through hills at dusk under a
  full moon, a lantern on a stone cairn beside the path. No building, no
  monument, no identifiable site, no person, no text — deliberately general,
  because this is the main page for all pilgrimages, not one site.
- **Source:** newly generated for this job in the house look (moonlight blue +
  warm gold), verified by viewing. Not a photo of any real place.
- **og:description:** page ALREADY HAS one — image only, no new line.

### 4. pilgrimage/great-pyramid.html
- **Image:** `share-great-pyramid.jpg` (1200×630) — carrier `share-great-pyramid.jpg.b64.txt`
- **What it shows:** the pyramids at Giza in warm light — the Great Pyramid and
  its neighbour, stone courses visible. No caption text baked in (the source
  frame's caption band was cropped out).
- **Source:** existing project material — a frame from the Archives' own Great
  Pyramid video, cropped to landscape.
- **og:description (new — page has none):**
  `The Great Pyramid at Giza, raised for Pharaoh Khufu around 2560 BCE — the last survivor of the ancient world's seven wonders.`

### 5. pilgrimage/library-of-alexandria.html
- **Image:** `share-library-of-alexandria.jpg` (1200×630) — carrier `share-library-of-alexandria.jpg.b64.txt`
- **What it shows:** a great ancient hall of scroll shelves under arches, light
  falling through the roof. An evocation of the Library, not a claim to be a
  photograph of it (no such photograph exists).
- **Source:** existing project material — a frame from the Archives' own Library
  of Alexandria video, cropped to landscape. No caption text in the frame.
- **og:description (new — page has none):**
  `The Great Library of Alexandria, and the scholars and scrolls it gathered.`

### 6. pilgrimage/qumran-caves.html
- **Image:** `share-qumran-caves.jpg` (900×1440, portrait) — carrier `share-qumran-caves.jpg.b64.txt`
- **What it shows:** the earthenware scroll jar with bowl lid and a rolled scroll
  — the Qumran Cave 1 jar form. Portrait because the jar is tall; the other
  five are 1200×630 landscape. Facebook accepts portrait share images.
- **Source:** existing project material — a crop of the object only from the
  Carter-approved Dead Sea Scroll Jar armory build capture. All viewer UI text
  (title, drag/zoom instructions, plaque) was cropped out; only the jar and
  scroll remain.
- **og:description (new — page has none):**
  `The caves at Qumran, where the Dead Sea Scrolls were found — among the earliest known Hebrew Bible manuscripts.`

## For the loop (implementation)

- Decode each `.b64.txt` carrier back to its `.jpg` (plain base64, no wrapping
  surprises — verify byte count after decode). Place the images where the
  site's conventions put share art, and add `og:image` to each page's head.
- Add the five `og:description` lines above to their pages' heads, verbatim.
  Do NOT add a description line to pilgrimage.html — it already has one.
- All six images were viewed at phone size before staging: each reads clearly
  at small size (map shape, hall, moon + path + lantern, pyramids, scroll
  hall, jar).
- Content-truth notes: no image shows a different site, a wrong artifact, or a
  misleading scene. The Library image is an evocation, labelled as such above,
  never presented as a photograph. The pilgrimage main image is deliberately
  site-free. No trademarked or copyrighted material, no real person's likeness.
- No page was left without an honest image. Nothing here is staged to main and
  nothing is merged by this handoff — the loop's PR still needs Carter's merge
  approval, as always.
