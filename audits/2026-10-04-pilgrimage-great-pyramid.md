# The Pilgrimage, first site: the Great Pyramid of Khufu (preview report, 2026-10-04)

**Status:** built on branch `claude/pilgrimage-pyramid`; **preview only, not merged.** Nothing is live on getconexto.com.
**Preview:** https://preview.the-divine-archives.pages.dev/pilgrimage/great-pyramid.html. The way in through the museum
is https://preview.the-divine-archives.pages.dev/museum.html (the portal stands in the Rotunda), and the list of sites
is https://preview.the-divine-archives.pages.dev/pilgrimage.html.

## What you can do

- **Start in the Pilgrim's Vestibule**, the archive's own room in the museum's style. It holds the portal back to the
  museum, two Vault objects for comparison (the Pyramid Texts of Unas and the Papyrus of Ani, clearly labelled *not
  from this site*), a board with a cross-section of the pyramid, and the doorway out.
- **Walk the five spaces, in order:**
  1. **I · Entrance and Descending Passage.** You arrive on a ledge on the north face, about 17 m up. The original
     entrance sits under its two tiers of gable stones. You walk down the 26½° passage, bent over: it is 1.2 m high.
  2. **II · Ascending Passage.** The granite plugs still seal its lower end, so you go round them through the robbers'
     tunnel, then climb the 39 m passage on modern boards with hand rails.
  3. **III · The Grand Gallery.** The way splits at the foot (level ahead to the Queen's Chamber, up the wooden steps
     to the gallery). The gallery climbs 46 m between its two ramps, under seven overlapping courses, to the Great Step.
  4. **IV · The King's Chamber.** You duck under the granite leaf in the antechamber and enter the red granite chamber,
     with the empty sarcophagus by the west wall.
  5. **V · The Queen's Chamber.** The long low passage, the step down, and the gabled chamber with its tall corbelled
     niche.
- **Controls:**
  - On a phone: drag to look, **tap the floor to walk there**, or press **Walk on / Walk back** to follow the route
    from stop to stop.
  - On a computer: click to look with the mouse, **W A S D** to walk, **N / B** for the route, **E** to read the info
    point in view, **G** for the Guide.
  - The Guide lists every section and info point, and can jump to any of them.
  - Reduce motion makes every move a fade instead of a walk.
- **28 info points (gold markers):** each says what you're looking at, with its sources and links to the Egypt
  chapter (ch02), Sacred Kingship (ch49), Journeys to the Underworld (ch47) and the Vault. Uncertain things carry a
  tag such as "position approximate", "purpose debated" or "not walkable". The 2017 Big Void and the 2023 North Face
  Corridor can be switched on as outlines.
- **"How close is this to the real thing?"** is in the Guide: what is measured, what is approximate, and what is not
  shown.

## Screenshots

- Every section, desktop: `audits/pilgrimage-great-pyramid/sections-desktop.jpg`
- Every section, phone: `audits/pilgrimage-great-pyramid/sections-phone.jpg`
- The portal in the museum's Rotunda, and its card: `museum-portal.jpg`, `museum-portal-card.jpg`
- An info card on a phone (the sarcophagus): `phone-card.jpg`
- The relic inspector on a phone (the Pyramid Texts): `phone-relic.jpg`

These were taken in this sandbox's software renderer. A real phone draws the same scene with its graphics chip, so
lighting and edges will look smoother there, not worse.

## How close it is to the real thing

**Faithful (from published surveys, chiefly Petrie's 1880–82 survey):**
- the width, height and slope of the descending and ascending passages;
- the length, height, ramps and seven-course corbelling of the Grand Gallery;
- the size of the antechamber, the King's Chamber and the Queen's Chamber, including the Queen's Chamber's gabled roof;
- the sarcophagus to Petrie's outside and inside measures;
- the niche's depth, base width, four overlaps and height;
- the order of the spaces and how they join: the junction under the plugs, the split at the foot of the gallery, the
  Great Step and the low passages at the top.

**Approximate, and flagged on site:**
- **Absolute positions.** Where each passage starts and ends was rebuilt from Petrie's lengths and angles, so it may
  be off by a metre or two. Sizes are not affected.
- **The gable stones** over the entrance.
- **The robbers' tunnel.** The real one is longer and rougher.
- **The granite leaf** and the portcullis slots.
- **Smaller heights:** the ramps and the gallery's lower wall.
- **The shaft openings.**
- **Two Queen's Chamber details I couldn't confirm:** which side of centre the niche lies, and where the passage
  enters the north wall.
- **The Great Step.** It comes out about 1.0 m high; published descriptions usually say about 0.9 m.

**What code alone couldn't achieve:**
- **Every crack, repair, stain and worn edge of the real stone.** The stone is drawn from the materials' known make-up
  (fine white limestone; red Aswan granite with pink feldspar, grey quartz and black mica). It reads as the right stone
  but is not a record of these walls, and only photographs or scans could give that. Your rules exclude using other
  people's, which is right.
- **Writing and marks.** The builders' marks in the relieving chambers would have to be our own renderings.
  Those chambers are closed to visitors and aren't modelled.
- **The real lighting.** The electric lighting inside is simplified to warm lamps. Crowds, guards and the heat are
  absent.
- **Hidden parts.** The descending passage stops at a grille. The subterranean chamber, the relieving chambers and the
  inside of the shafts are not modelled, and are queued as later additions.

**What I'd rate it:** the shapes and proportions are close; you would recognise every space. The surfaces are
convincing at walking distance but generic up close. The weakest part is the outside: only the area round the
entrance is modelled, not the whole pyramid seen from the plateau.

## Phone performance (measured on an emulated mid-range phone: 390×844 screen, CPU slowed 4×, 4G at 9 Mbps)

| Measure | Result | Budget (from the plan) |
|---|---|---|
| Whole site, downloaded | **259 KB** compressed (three.js 194 KB, which the museum shares; the site's own code 65 KB) | ≤ 4 MB |
| Ready for the first step | **2.1 s** | ≤ 5 s |
| Drawing the stone (once, in the Vestibule, after you press Enter) | about **4 s** at idle moments | not in the plan; chosen so later sections open instantly |
| Each section built as you approach it | about **0.1 s** (0.8 s for section II) | ≤ 1 s, prefetched |
| Draw calls in view | **11–60** | ≤ 80 |
| Triangles in view | **about 280–3,200** | ≤ 150 k |
| Textures in memory | 36 (512 px each on phones) | ≤ 64 MB |

**Frame rate: not measurable here.** This sandbox has no graphics chip, so it draws with software. That gave 22–56
frames per second, which says nothing about a phone. The scene is very light by every measure that predicts
frame rate on a phone: draw calls, triangles and lights (at most 4 pooled lamps, plus your own lamp and daylight
outside). The museum's heavier rooms run smoothly on phones by the same measures. **Your walk on a real phone is the
test that counts:** please note anywhere it stutters.

## Effort per future site

- **Done once, reused by every site:**
  - the engine (walking, regions, route, cards, the inspector, the Guide);
  - the stone generator;
  - the page generator and the listing;
  - the museum portal;
  - the check script.
- **A site like the Great Pyramid (passages and rooms of dressed stone): about 1–2 sessions.**
  - measurements and their sources: half a session;
  - the section modules: about one session;
  - the info texts with sources and the evidence flags;
  - checks, screenshots, a preview.
- **Cave sites (Qumran, Lascaux, Chauvet, Mogao): about 1–2 sessions each.** The first one needs a new rough-cave
  builder; the rest reuse it.
- **Large or ornate buildings (Karnak, Chartres, St Peter's, Angkor Wat): 3–6 sessions each.** They have far more
  surface, carved and painted detail that must be our own rendering, and need level-of-detail work to stay fast on
  phones.
- **Lost buildings (R) need extra time** for the reconstruction research and its labelling.

## Checks run

- Every section loads with no script errors.
- The full route, from the Vestibule through the doorway to the ledge and every section to the Queen's Chamber, and
  back to the ledge, walks without getting stuck at any join.
- Tap-to-walk works on a touch screen.
- Info cards, outline toggles and the relic inspector open.
- The museum's Rotunda portal appears and its card links to the site.
- `tools/verify-pilgrimage.js` passes: 72 sites, 34 links, relic ids and info points checked. It is now part of
  `verify.yml`.
- All 13 game verifiers still pass.
- The full build chain is unchanged on a second run.

## Needs Carter's decision

1. **Walk the preview on your phone and approve or send changes.** This is the gate before merging.
2. **Navigation:** should "Pilgrimage" join the site's top menu, or stay reached through the museum (as now) and its
   own page?
3. **Next site:** the Qumran caves, as planned?
