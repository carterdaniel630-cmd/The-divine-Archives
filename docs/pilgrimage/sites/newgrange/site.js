/* ==========================================================================
   Newgrange — the site: sections, walkable regions, route, info points.
   Geometry lives in the section modules (s0-vestibule.js … s3-chamber.js),
   measurements in dims.js, the place of each stone in layout.js, the
   carved panels in art.js, the stone builder in ../../megalith.js.

   Status: "preview" in docs/assets/pilgrimage-data.js. The page exists
   (noindex) but the site is off the menu until Carter approves it going live.
   Plan: plans/pilgrimage-sites.md (I · Prehistory). Sources:
   sources/pilgrimage-newgrange.md.

   Frame (see dims.js): metres; y up; the passage runs along -z from the
   entrance, so "model south" (+z) is midwinter sunrise (south-east on the
   ground). The entrance floor is y = 0; the chamber floor is y = 2.
   ========================================================================== */
import { region } from "../../kit.js?v=1";
import { D } from "./dims.js?v=1";
import { circle, hole } from "./layout.js?v=1";

const PI = Math.PI;                            // yaw 0 faces -z (towards the mound); PI faces +z (back out)
export const V0 = { x: -300, z: 0 };          // the archive's own vestibule
export const EXIT_HREF = "../museum.html#ch42";
const P_ = D.pass, C = D.ch, CY = C.y;

// ---------------------------------------------------------------- short references (full list: sources/pilgrimage-newgrange.md)
const REF = {
  whi: "World Heritage Ireland, &ldquo;Newgrange&rdquo; (worldheritageireland.ie, Brú na Bóinne: built heritage)",
  unesco: "UNESCO World Heritage Centre, &ldquo;Brú na Bóinne &ndash; Archaeological Ensemble of the Bend of the Boyne&rdquo; (site 659, inscribed 1993)",
  opw: "Heritage Ireland (Office of Public Works), &ldquo;Brú na Bóinne Visitor Centre (Newgrange and Knowth)&rdquo;",
  nmi: "S. Weadick, &ldquo;The Winter solstice at Newgrange&rdquo;, National Museum of Ireland (museum.ie)",
  whe: "WorldHistory.org, &ldquo;Newgrange&rdquo;",
  times: "E. Burke-Kennedy, &ldquo;Shedding light on winter solstice at Newgrange&rdquo;, <em>The Irish Times</em> (19 December 2013)",
  ray: "T. P. Ray, &ldquo;The winter solstice phenomenon at Newgrange, Ireland: accident or design?&rdquo;, <em>Nature</em> 337 (1989), 343&ndash;345 (read as reproduced at newgrange.com)",
  kch: "knowth.com, &ldquo;Newgrange: the chamber&rdquo;",
  kex: "A. Marshall, knowth.com, on the excavation and reconstruction of Newgrange",
  smith: "<em>Smithsonian Magazine</em>, &ldquo;Drought reveals giant 4,500-year-old Irish henge&rdquo; (16 July 2018)",
  cassidy: "L. M. Cassidy, D. G. Bradley and others, &ldquo;A dynastic elite in monumental Neolithic society&rdquo;, <em>Nature</em> 582 (2020), doi:10.1038/s41586-020-2378-6; Queen&rsquo;s University Belfast and research.ie reports (2020)",
  smyth: "J. Smyth, N. Carlin and others, &ldquo;King of Newgrange: a critical analysis of a Neolithic petrous fragment from the passage tomb chamber&rdquo;, <em>Antiquity</em> 99 (2025), 672&ndash;688, as reported by University College Dublin (24 June 2025)",
  wiki: "Wikipedia, &ldquo;Newgrange&rdquo; (a pointer only, to be checked against the excavation report)",
  ch42: "the archive&rsquo;s Neolithic chapter (ch42)"
};
const L = {
  ch42: { href: "../chapters/ch42.html", label: "Read the Neolithic chapter" },
  v86: { href: "../vault/berlin-gold-hat.html", label: "The Berlin Gold Hat (Vault)" }
};
const APPROX = { t: "Layout after published descriptions · positions approximate", soft: true };
const RENDER = { t: "Carvings: our own rendering, simplified", soft: true };
const CONTESTED = { t: "Contested", soft: false };
const NOTSUP = { t: "Not supported by the evidence", soft: false };
const BELIEF = { t: "What was believed, not a finding", soft: true };
const REMAINS = { t: "Human remains: described, not shown", soft: true };
const DIFFER = { t: "Sources differ", soft: false };

// ---------------------------------------------------------------- sections
const BIG = [-80, -5, -70, 80, 20, 110];      // the mound and the ground before it: open, all in view at once
const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: the portal back to the museum, a Vault object for comparison, and the way out into the Boyne valley." },
  { id: "s1", name: "I · Before the mound", short: "the mound", module: "s1-mound.js", box: BIG, start: { x: 0, z: 78, yaw: 0, y: 0 }, blurb: "The lawn before the great mound: the stones of the Great Circle, the kerb and the Entrance Stone, the white quartz wall and the roof-box over the door." },
  { id: "s2", name: "II · The passage", short: "the passage", module: "s2-passage.js", box: [-2, -1, P_.z0 - 0.7, 2, 5, D.R + 1.5], start: { x: 0, z: P_.z1 - 0.4, yaw: 0, y: 0.05 }, blurb: "Nearly nineteen metres of passage between upright slabs, its floor climbing two metres towards the chamber." },
  { id: "s3", name: "III · The chamber", short: "the chamber", module: "s3-chamber.js", box: [-4.5, 1, C.z0 - 2.5, 4.5, 9, C.z1 + 0.8], start: { x: 0, z: C.z1 - 0.6, yaw: 0, y: CY }, blurb: "The cross-shaped chamber under its corbelled roof: three recesses, their stone basins, and the carved stones, among them the triple spiral." }
];

// ---------------------------------------------------------------- where the visitor may walk
const gc = circle();
const regions = [
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0, holes: [[V0.x - 3.2, V0.x - 2.0, V0.z - 1.6, V0.z - 0.4]] }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  region({ id: "v-exit", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z + 4.6, z1: V0.z + 5.6, y: 0, inset: 0.05, portal: "museum", href: EXIT_HREF }),
  // the lawn before the mound (the visitor keeps to the front: the real site's paths do not ring the mound either)
  region({ id: "lawn", section: "s1", x0: D.lawn.x0, x1: D.lawn.x1, z0: D.lawn.z0, z1: D.lawn.z1, y: 0, outside: true, holes: gc.map((s) => hole(s, 0.35)) }),
  region({ id: "to-v", section: "s1", x0: -0.8, x1: 0.8, z0: D.lawn.z1 - 0.3, z1: D.lawn.z1 + 0.9, y: 0, inset: 0.05, portal: "v", outside: true }),
  // the model's gap in the kerb beside the Entrance Stone, and the strip of ground between kerb and wall to the door
  region({ id: "kerb-gap", section: "s1", x0: D.gapX[0], x1: D.gapX[1], z0: D.R - 0.8, z1: D.lawn.z0 + 0.3, y: 0, open: "s", outside: true }),
  region({ id: "porch", section: "s1", x0: -P_.w / 2 - 0.1, x1: D.gapX[1], z0: D.face + 0.05, z1: D.R - 0.2, y: 0, inset: 0.15, outside: true }),
  // the passage: its floor climbs from the door to the chamber
  region({ id: "passage", section: "s2", x0: -P_.w / 2, x1: P_.w / 2, z0: P_.z0, z1: P_.z1 + 0.2, y: P_.rise, y1: 0, inset: 0.22, open: "ns" }),
  // the chamber's central space (the recesses are seen, not entered: each holds its basin)
  region({ id: "chamber", section: "s3", x0: -C.x, x1: C.x, z0: C.z0, z1: C.z1, y: CY, inset: 0.3, open: "s" })
];
for (const r of regions) r.surface = r.section === "v" ? "wood" : r.outside ? "grass" : "rock";

// ---------------------------------------------------------------- the walking route (Walk on / Walk back)
const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const yAt = (z) => P_.rise * (P_.z1 - z) / (P_.z1 - P_.z0);
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),                        // out into the valley
  P(0, 78, 0, true, 0),                                 // the mound from the lawn
  P(-14, 58, 0, true, 0.5),                             // a stone of the Great Circle
  P(-1.5, 46, 0, true, 0),                              // the Entrance Stone and the quartz wall
  P(2.8, 43, 0, false), P(2.8, 39.4, 0, false),
  P(0, 39.3, 0, true, 0),                               // at the door, under the roof-box
  P(0, 30, yAt(30), true, 0),                           // in the passage
  P(0, C.z1 - 0.6, CY, true, 0),                        // into the chamber
  P(0, 16.4, CY, true, 0),                              // the back recess and the triple spiral
  P(0.8, 17.4, CY, true, -PI / 2),                      // the east recess
  P(-0.8, 17.4, CY, true, PI / 2),                      // the west recess
  P(0, 15.4, CY, true, PI)                              // look back up the passage, the way the light comes
];

// ---------------------------------------------------------------- info points
const g3 = gc[1];
const info = [
  // ---- vestibule (the archive's own room)
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you go out", title: "Newgrange",
    html: "<p>Newgrange stands on a ridge above a bend of the River Boyne in County Meath, Ireland. It is a passage tomb: a great round mound, about 80 metres across, ringed by a kerb of large stones, with a passage running in to a stone chamber. It was built about 3200 BCE. With its neighbours Knowth and Dowth it makes up Brú na Bóinne, a World Heritage Site since 1993.</p><p>This walk crosses the lawn before the mound, goes in by the passage, and ends in the <strong>chamber</strong>, where, on the mornings around the winter solstice, the rising sun shines in. Today&rsquo;s visitors enter only on guided tours from the visitor centre. The plan is modelled after published descriptions at approximate size; the carvings are our own simplified renderings, and the stone is drawn in code.</p>",
    links: [L.ch42], sources: REF.whi + "; " + REF.unesco + "; " + REF.opw + "; " + REF.ch42 + "." },
  { id: "v-v86", section: "v", pos: [V0.x - 2.6, 1.35, V0.z - 1.0], relic: { id: "v86", slug: "berlin-gold-hat", title: "The Berlin Gold Hat", category: "Relics & Sacred Objects", held: "Neues Museum (Museum für Vor- und Frühgeschichte), Berlin", dated: "Late Bronze Age, c. 1000–800 BCE; bought 1996, find-spot unknown", kind: "statue" }, title: "The Berlin Gold Hat (for comparison)",
    html: "<p><strong>Not from Newgrange.</strong> A tall cone of thin gold covered with stamped circles and crescents, made in the Late Bronze Age, some two thousand years after Newgrange was built, its find-spot unknown. It is shown here because it has been read, like Newgrange, as a way of keeping the sun&rsquo;s year: one scholar counted its ornament as a calendar of sun and moon. That reading is contested.</p>" },
  { id: "v-door", section: "v", pos: [V0.x, 3.45, V0.z - 4.4], cat: "The way out", title: "To the mound",
    html: "<p>Walk into the golden portal to step out onto the lawn before the mound.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 3.45, V0.z + 4.4], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>This portal returns you to the museum, to the room of the Neolithic.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] },
  // ---- I: before the mound
  { id: "mound", section: "s1", pos: [-6, 1.8, 74], cat: "I · Before the mound", title: "The mound",
    html: "<p>The mound is about 80 metres across (figures from 76 to 85 metres are published) and about 12 metres high, and covers some 4,500 square metres. It is built of stones and earth heaped over the passage and chamber. Radiocarbon dates put its building about 3200 BCE.</p><p>The front of the mound, with its white wall, is a modern reconstruction. Michael J. O&rsquo;Kelly excavated here from 1962 to 1975 for the Office of Public Works, and the front was rebuilt after his work.</p>",
    flags: [APPROX], links: [L.ch42], sources: REF.whi + "; " + REF.whe + "; " + REF.nmi + "." },
  { id: "kerb", section: "s1", pos: [-3.4, 1.7, 43.4], cat: "I · Before the mound", title: "The kerb and the Entrance Stone",
    html: "<p>Round the foot of the mound runs a kerb of 97 long stones laid end to end; none weighs under a tonne. Many are carved. The finest is the one lying across the entrance, <strong>Kerbstone 1</strong> or the Entrance Stone, about 3 metres long and 1.2 metres high, covered with spirals, lozenges and wavy lines. Its partner in quality, Kerbstone 52, lies on the far side of the mound, opposite the entrance.</p><p>Visitors today go over the Entrance Stone by modern steps. The model leaves out the kerbstone beside it instead, so you can walk round.</p>",
    flags: [RENDER, { t: "Model convenience, not the real site", soft: true }], links: [L.ch42], sources: REF.whi + "; " + REF.whe + "; " + REF.kch + "; " + REF.wiki + "." },
  { id: "facade", section: "s1", pos: [6.2, 2.6, 41.6], cat: "I · Before the mound", title: "The white wall",
    html: "<p>Before the entrance O&rsquo;Kelly found a spread of white quartz, which comes from the Wicklow mountains to the south, and rounded dark stones. He judged that they had fallen from a wall on the front of the mound, and the wall you see was rebuilt on that reading, held up with concrete. O&rsquo;Kelly himself called his account of how the mound and its facing were built &lsquo;a guess&rsquo;.</p><p>Other archaeologists disagree. George Eogan, who excavated nearby Knowth, has argued that such a wall would not have stood without concrete support, and that the quartz lay in some other way. The reconstruction is still argued over.</p>",
    flags: [CONTESTED], links: [L.ch42], sources: REF.whi + "; " + REF.whe + "; " + REF.kex + "." },
  { id: "roofbox", section: "s1", pos: [1.1, 3.2, 40.6], cat: "I · Before the mound", title: "The roof-box",
    html: "<p>Above the doorway is a second, smaller opening: the <strong>roof-box</strong>. It is this, not the door, that lets the midwinter sun into the tomb. The floor of the passage climbs about two metres to the chamber, and the roof-box is set higher than the door; our reading, not the sources&rsquo;, is that this is what lets the beam reach the chamber.</p><p>In 2016 a writer claimed the roof-box was invented by the restorers. Archaeologists replied with photographs that show it from the early 1900s, before the excavation.</p>",
    flags: [NOTSUP], links: [L.ch42], sources: REF.ray + "; " + REF.times + "; " + REF.wiki + "." },
  { id: "circle", section: "s1", pos: [g3.x + 2.4, 1.9, g3.z + 1.6], cat: "I · Before the mound", title: "The Great Circle",
    html: "<p>Standing stones ring the mound at a distance. Twelve survive of a circle that may once have held about 38. They are usually taken to be later than the mound, put up in the Early Bronze Age, but how much later, and whether they belong with the tomb at all, is debated.</p>",
    flags: [CONTESTED, APPROX], sources: REF.whi + "; " + REF.wiki + "." },
  { id: "valley", section: "s1", pos: [12, 1.8, 70], cat: "I · Before the mound", title: "Brú na Bóinne",
    html: "<p>Newgrange is one of three great passage tombs on this bend of the Boyne, with <strong>Knowth</strong> and <strong>Dowth</strong>, among some forty smaller ones. UNESCO calls the group the largest concentration of megalithic art in Europe.</p><p>The landscape still holds surprises. In the dry summer of 2018 Anthony Murphy and Ken Williams, flying drones, saw the outline of a large henge, a round enclosure about 150 metres across with stretches of double ditch, marked in the parched crops near Newgrange. It had not been known before.</p>",
    links: [L.ch42], sources: REF.unesco + "; " + REF.smith + "." },
  { id: "later", section: "s1", pos: [-12, 1.8, 66], cat: "I · Before the mound", title: "After the builders",
    html: "<p>The tomb was not forgotten. Roman coins of the early fourth century CE and gold jewellery were left at the mound; some are now in the National Museum of Ireland and the British Museum. In 1699 workmen digging stone for the landowner, Charles Campbell, found the entrance, and the antiquary Edward Lhwyd came to see and describe the passage and chamber. It has been open since.</p>",
    links: [L.ch42], sources: REF.wiki + "; " + REF.whe + "." },
  { id: "myth", section: "s1", pos: [4, 1.8, 74], cat: "I · Before the mound", title: "The house of the Dagda",
    html: "<p>Medieval Irish tales call this place the Brug of the Boyne and make it the home of the Tuatha Dé Danann, a mythological race of gods. It is the dwelling of the Dagda, their chief god, and of his son Aengus, child of Boann, the river&rsquo;s goddess. The tales say what later people believed of the mound; they are not a record of its builders.</p>",
    flags: [BELIEF], links: [L.ch42], sources: REF.nmi + "; " + REF.whe + "." },
  // ---- II: the passage
  { id: "passage", section: "s2", pos: [0.3, 1.9, 35], cat: "II · The passage", title: "The passage",
    html: "<p>The passage is just under 19 metres long, lined on each side with upright slabs. Its floor climbs about two metres from the door to the chamber.</p><p>The real passage is low and narrow. The model keeps it a little higher so you can walk it upright, and draws it straight.</p>",
    flags: [APPROX, { t: "Model convenience: passage height", soft: true }], links: [L.ch42], sources: REF.whi + "; " + REF.times + "; " + REF.opw + "; " + REF.wiki + "." },
  { id: "solstice", section: "s2", pos: [-0.3, 2.6, 27], cat: "II · The passage", title: "The midwinter sunrise",
    toggle: { id: "solstice", on: "Show the solstice beam", off: "Hide the solstice beam" },
    html: "<p>On the mornings around 21 December, if the sky is clear, the rising sun shines through the roof-box, along the passage and onto the chamber floor. The light comes in just before nine o&rsquo;clock and lasts about seventeen minutes, for a few days around the solstice (about 19 to 23 December).</p><p>O&rsquo;Kelly saw it on 21 December 1967, the first recorded modern sighting. Was it planned? In 1989 the astronomer Tom Ray measured the alignment and concluded that the evidence supports a deliberate orientation, though he called that evidence weak. Each year a lottery picks the few people who wait in the chamber for it.</p>",
    flags: [{ t: "Beam drawn by us · its width and fall approximate", soft: true }], links: [L.ch42], sources: REF.times + "; " + REF.nmi + "; " + REF.ray + "; " + REF.wiki + "." },
  // ---- III: the chamber
  { id: "chamber", section: "s3", pos: [1.3, 3.7, 19.6], cat: "III · The chamber", title: "The chamber and its roof",
    html: "<p>The chamber is cross-shaped: a central space with three small recesses opening off it, to the right, the left and ahead. Above you the roof is <strong>corbelled</strong>: course upon course of flat stones, each set a little further in than the one below, closing nearly six metres up under a single capstone. It has kept the chamber dry for some five thousand years.</p>",
    flags: [APPROX], links: [L.ch42], sources: REF.whi + "; " + REF.kch + "." },
  { id: "spiral", section: "s3", pos: [0.7, 3.2, C.z0 + 0.5], cat: "III · The chamber", title: "The triple spiral",
    html: "<p>On a stone of the back recess is the most famous carving at Newgrange: three spirals joined together, about 30 by 28 centimetres. Nobody knows what it meant to its makers. Modern readings (the sun, the cycle of life, death and rebirth, a triple goddess) are guesses that no evidence can test.</p>",
    flags: [RENDER, { t: "Meaning unknown", soft: true }], links: [L.ch42], sources: REF.kch + "; " + REF.whi + "." },
  { id: "recesses", section: "s3", pos: [C.x + 0.4, 3.5, 18.9], cat: "III · The chamber", title: "Basins and carvings",
    html: "<p>Each recess held a large stone basin. The stones of the east recess, to your right as you come in, are carved with spirals, lozenges and zigzags; those of the west recess with circles inside circles. The carvings in the model are our own, in the manner of the motifs, not tracings of any stone.</p>",
    flags: [RENDER, APPROX], sources: REF.kch + "." },
  { id: "dead", section: "s3", pos: [-C.x - 0.4, 3.5, 18.9], cat: "III · The chamber", title: "The dead",
    html: "<p>The excavators found the remains of at least five people in the chamber, most of them cremated, in and near the basins, with beads, pendants and small stone balls, now in the National Museum of Ireland. The chamber had stood open since 1699, so, we infer, the number once laid here cannot be known from what survived.</p>",
    flags: [REMAINS], links: [L.ch42], sources: REF.whi + "; " + REF.nmi + "; " + REF.whe + "." },
  { id: "reach", section: "s3", pos: [-0.6, 2.7, 16.0], cat: "III · The chamber", title: "Where the light falls",
    toggle: { id: "solstice", on: "Show the solstice beam", off: "Hide the solstice beam" },
    html: "<p>Tom Ray found that when the tomb was built the beam reached further than it does now, into the back recess, lighting the triple spiral there indirectly. Because the tilt of the earth&rsquo;s axis has changed since, the beam today is a metre or two shorter and barely reaches the back of the chamber; he expects the alignment to be exact again in five or six thousand years. The National Museum of Ireland describes the light as reaching the spiral today. The two accounts differ; the model, like the archive&rsquo;s own chapter, follows Ray.</p>",
    flags: [DIFFER], links: [L.ch42], sources: REF.ray + "; " + REF.times + "; " + REF.nmi + "; " + REF.ch42 + "." },
  { id: "genome", section: "s3", pos: [0.9, 2.9, 15.6], cat: "III · The chamber", title: "A king of Newgrange?",
    html: "<p>In 2020 a team of geneticists and archaeologists (Cassidy, Bradley and colleagues) read ancient DNA from Irish passage tombs. From a fragment of skull bone found in this chamber they reported a man whose parents were first-degree relatives, brother and sister or parent and child. They took this, with an eleventh-century tale of a builder-king who slept with his sister to restart the sun, as a sign of a ruling dynasty; Dowth&rsquo;s old name, <em>Fertae Chuile</em>, means &lsquo;hill of sin&rsquo;.</p><p>In 2025 Smyth, Carlin and colleagues re-examined the fragment, dated it to 3340&ndash;3020 BCE, and argued that &lsquo;a one-off example of incest is a shaky foundation on which to reconstruct an elite&rsquo;. The question is open.</p>",
    flags: [CONTESTED, REMAINS], links: [L.ch42], sources: REF.cassidy + "; " + REF.smyth + "." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>From published figures:</strong> the mound about 80 m across and 12 m high; the kerb of 97 stones; the Entrance Stone about 3 m long and 1.2 m high; the passage just under 19 m, its floor rising about 2 m to the chamber; the cross-shaped chamber with three recesses and a corbelled roof nearly 6 m high; twelve surviving stones of the Great Circle.</p>" +
    "<p><strong>Approximate:</strong> the place of every stone, the plan and size of the chamber and recesses, the width of the passage, the roof-box&rsquo;s size and height, the run of the quartz wall and the beam&rsquo;s width. O&rsquo;Kelly&rsquo;s excavation report and its plans could not be opened for this build. The carvings are our own simplified renderings, and most stones are left plain.</p>" +
    "<p><strong>Not shown:</strong> the satellite tombs, the modern steps, paths and lighting, the remains of the dead, and the people. The passage is kept a little higher than the real one and drawn straight, the recesses are seen but not entered, and one kerbstone beside the Entrance Stone is left out for the way in. The model is turned so the passage runs straight ahead of you; on the ground it faces south-east.</p>",
  links: [L.ch42], sources: REF.whi + "; " + REF.kch + "; " + REF.times + "; " + REF.ray + "." };

// the outdoor sky of the Boyne valley: soft, grey-green, low winter light
const sky = { bg: "#b9c4c8", fog: "#c3ccc9", hemi: "#e2e8e6", ground: "#5f7448", sunPos: [70, 30, 120], sun: 1.25 };

export default { title: "Newgrange", version: 1, stones: ["quartz", "sarsen", "turf", "rock", "wood"], sky, sections, regions, route, info, about, D, V0 };
