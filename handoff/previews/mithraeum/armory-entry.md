# ARMORY ENTRY — The Mithraeum (walkthrough space)

**What it is:** A first-person walkthrough of a Mithraic cave-temple: descend stairs into a
barrel-vaulted underground hall, walk the central aisle between the raised dining benches
(podia), and approach the tauroctony relief in its arched cult niche at the far end.
Torchlight with flicker, drifting dust, braziers flanking the niche.

**What it's based on:** The standard mithraeum plan repeated across the empire — San Clemente
in Rome (subterranean hall, central aisle, raised benches, tauroctony at the far end),
Carrawburgh on Hadrian's Wall (nave, side benches, sanctuary + narthex), and the Ostia
Mithraeum of Felicissimus (seven-grade emblem mosaic). Seven-grade list from St. Jerome;
grade symbols from the Felicissimus mosaic via the standard scholarly table (Clauss).

**The seven grades (observational progression, not initiation):**
I. Corax (Raven) — Mercury · raven, beaker, caduceus
II. Nymphus (Bridegroom) — Venus · lamp, bell, veil, diadem
III. Miles (Soldier) — Mars · helmet, lance, pouch, breastplate, drum, belt
IV. Leo (Lion) — Jupiter · fire shovel, sistrum, laurel wreath, thunderbolt
V. Perses (Persian) — Luna · Phrygian cap, curved sword, sickle, crescent, stars, sling
VI. Heliodromus (Sun-Runner) — Sol · torch, radiate crown, whip
VII. Pater (Father) — Saturn · libation bowl, staff, mitre, ring, jewelled robes

**Interactions:** WASD/arrows + mouse look (pointer-lock), touch pad + drag-to-look on phones.
Click the seven grade stones for detail panels; click benches to sit facing the niche; click
the tauroctony for its panel. Left rail jumps between grades.

**Honesty labels (binding):** No Mithraic scripture survives — stated on the entry screen and
in every grade panel. All rite content is marked "Reconstruction" (floating plaques in-scene
+ per-grade honesty notes); sources named (St. Jerome's list, Ostia emblems, archaeology).
The tauroctony is presented as iconography, not doctrine. Observational mode: the visitor
witnesses, never performs.

**Tech:** Self-contained `mithraeum.html` + vendored `three.min.js` (zero CDN). Procedural
canvas textures (cave stone, slab floor, painted + depth-mapped tauroctony relief, grade
medallions). DPR capped 1.5 desktop / 1.0 mobile; dispose lifecycle on unload.
