/* ==========================================================================
   Göbekli Tepe — the site: sections, walkable regions, route, info points.
   Geometry lives in the section modules (s0-vestibule.js … s4-quarry.js),
   measurements in dims.js, the place of each pillar in layout.js, the
   T-pillar builder and the carved reliefs in pillars.js.

   Status: "preview" in docs/assets/pilgrimage-data.js. The page exists
   (noindex) but the site is off the menu until Carter approves it going live.
   Plan: plans/pilgrimage-sites.md (I · Prehistory). Sources:
   sources/pilgrimage-gobekli-tepe.md.

   Frame: metres; x east, y up, z south. The floor of the main excavation
   area is y = 0. The four enclosures, their distances apart and the place
   of each pillar are APPROX (dims.js). The modern shelter roof over the
   excavation is left out so the sky shows.
   ========================================================================== */
import { region } from "../../kit.js?v=1";
import { D } from "./dims.js?v=1";
import { pillarsD, pillarsC, hole } from "./layout.js?v=1";

const PI = Math.PI, S_ = PI;                   // yaw PI faces south (+z), 0 faces north
export const V0 = { x: -300, z: 0 };          // the archive's own vestibule
export const Q = D.quarry;
export const EXIT_HREF = "../museum.html#ch42";
const Y = D.surfY;

// ---------------------------------------------------------------- short references (full list: sources/pilgrimage-gobekli-tepe.md)
const REF = {
  tt: "German Archaeological Institute (DAI), Göbekli Tepe project, <em>The Tepe Telegrams</em> (dainst.blog)",
  ttMove: "O. Dietrich, &ldquo;How did they do it? Making and moving monoliths at Göbekli Tepe&rdquo;, <em>The Tepe Telegrams</em> (3 May 2016)",
  ttFind: "&ldquo;Part 1: A (Re-) Discovery (1994&ndash;1996)&rdquo;, <em>The Tepe Telegrams</em> (dainst.blog/the-tepe-telegrams/?p=861)",
  ttHouse: "J. Notroff, &ldquo;A Sanctuary &hellip; or so fair a House?&rdquo;, <em>The Tepe Telegrams</em> (24 January 2017)",
  ttFox: "J. Notroff, &ldquo;Archaeoastronomy, meteor showers, mass extinction: What does the fox say?&rdquo;, <em>The Tepe Telegrams</em> (21 April 2017)",
  notroff: "J. Notroff, O. Dietrich, L. Clare and others, &ldquo;More than a vulture: a response to Sweatman and Tsikritsis&rdquo;, <em>Mediterranean Archaeology and Archaeometry</em> 17.2 (2017), 57&ndash;63",
  sweatman: "M. B. Sweatman and D. Tsikritsis, &ldquo;Decoding Göbekli Tepe with archaeoastronomy&rdquo;, <em>Mediterranean Archaeology and Archaeometry</em> 17.1 (2017)",
  magli: "G. Magli, &ldquo;Sirius and the project of the megalithic enclosures at Gobekli Tepe&rdquo;, <em>Nexus Network Journal</em> 18 (2016), doi:10.1007/s00004-015-0277-1 (preprint arXiv:1307.8397)",
  haklay: "G. Haklay and A. Gopher, &ldquo;Geometry and Architectural Planning at Göbekli Tepe, Turkey&rdquo;, <em>Cambridge Archaeological Journal</em> 30.2 (2020), 343&ndash;357",
  banning: "E. B. Banning, &ldquo;So Fair a House: Göbekli Tepe and the Identification of Temples in the Pre-Pottery Neolithic of the Near East&rdquo;, <em>Current Anthropology</em> 52.5 (2011), 619&ndash;660",
  kinzel: "M. Kinzel and L. Clare, &ldquo;Monumental &ndash; compared to what? A perspective from Göbekli Tepe&rdquo;, in A. B. Gebauer and others (eds), <em>Monumentalising Life in the Neolithic</em> (Oxford: Oxbow, 2020)",
  clare: "L. Clare, &ldquo;Göbekli Tepe, Turkey: a brief summary of research at a new World Heritage Site (2015&ndash;2019)&rdquo;, <em>e-Forschungsberichte des DAI</em> 2020.2, 81&ndash;88",
  cwa: "<em>Current World Archaeology</em> 53 (2012), &ldquo;Turkey: Göbekli Tepe&rdquo;",
  unesco: "UNESCO World Heritage Centre, &ldquo;Göbekli Tepe&rdquo; (site 1572, inscribed 2018)",
  ch42: "the archive&rsquo;s Neolithic chapter (ch42)"
};
const L = {
  ch42: { href: "../chapters/ch42.html", label: "Read the Neolithic chapter" },
  ch41: { href: "../chapters/ch41.html", label: "The Paleolithic" },
  v60: { href: "../vault/gobekli-tepe.html", label: "Göbekli Tepe's Pillars (Vault)" }
};
const APPROX = { t: "Layout after published plans · positions approximate", soft: true };
const RENDER = { t: "Carvings: our own rendering, simplified", soft: true };
const CONTESTED = { t: "Contested", soft: false };
const NOTSUP = { t: "Not supported by the evidence", soft: false };

// ---------------------------------------------------------------- sections
const BIG = [-80, -5, -80, 60, 30, 80];          // the excavated hollow is open ground: its three sections share one box
const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: the portal back to the museum, the Vault's pillar for comparison, and the way out onto the hill." },
  { id: "s1", name: "I · The hill and the hollow", short: "the hill", module: "s1-hill.js", box: BIG, start: { x: 4, z: -29.6, yaw: S_, y: Y }, blurb: "From the walkway on the rim, look down into the main excavation area: Enclosures A, B, C and D, sunk in the mound." },
  { id: "s2", name: "II · Enclosure D", short: "Enclosure D", module: "s2-enclosure-d.js", box: BIG, start: { x: 0, z: 6.6, yaw: 0, y: 0 }, blurb: "The best preserved enclosure: the two 5.5-metre central pillars with arms, hands and belts, and the Vulture Stone in the wall." },
  { id: "s3", name: "III · Enclosure C", short: "Enclosure C", module: "s3-enclosure-c.js", box: BIG, start: { x: D.encC.x, z: D.encC.z + 3.2, yaw: 0, y: 0 }, blurb: "Rings of wall inside rings of wall, and the broken central pillars on their pedestals cut from the bedrock." },
  { id: "s4", name: "IV · The quarry", short: "the quarry", module: "s4-quarry.js", box: [Q.x - 30, -3, Q.z - 30, Q.x + 30, 20, Q.z + 30], start: { x: Q.x - 6, z: Q.z + 5, yaw: -0.88, y: 0 }, blurb: "The limestone plateau where the pillars were cut, and the seven-metre pillar that was never finished." }
];

// ---------------------------------------------------------------- where the visitor may walk
const pd = pillarsD(), pc = pillarsC();
const holesOf = (list, pad) => list.map((p) => hole(p, pad));
const E = D.encC, ER = E.rings[2] + E.wallT + 0.3, DR = D.encD.r + D.encD.wallT + 0.3;
const regions = [
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0, holes: [[V0.x - 3.2, V0.x - 2.0, V0.z - 1.6, V0.z - 0.4]] }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  region({ id: "v-exit", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z + 4.6, z1: V0.z + 5.6, y: 0, inset: 0.05, portal: "museum", href: EXIT_HREF }),
  // the walkway on the north rim, and its two portals (back to the Vestibule at its west end, out to the quarry)
  region({ id: "walkway", section: "s1", x0: -40, x1: 14, z0: -31, z1: -28, y: Y, outside: true }),
  region({ id: "to-v", section: "s1", x0: -40.6, x1: -39.6, z0: -30.3, z1: -28.7, y: Y, inset: 0.05, portal: "v", outside: true }),
  region({ id: "to-quarry", section: "s1", x0: -11, x1: -9, z0: -31.6, z1: -30.6, y: Y, inset: 0.05, portal: "s4", outside: true }),
  // the ramp down into the hollow (the model's own: at the real site visitors keep to the walkways)
  region({ id: "ramp", section: "s1", x0: 10, x1: 12.4, z0: -28.6, z1: -17.6, y: Y, y1: 0, inset: 0.15, outside: true }),
  // the floor of the hollow round the enclosures
  region({ id: "hollow", section: "s1", x0: -40, x1: 16, z0: -26, z1: 44, y: 0, outside: true,
    holes: [[-DR, DR, -DR, DR], [E.x - ER, E.x + ER, E.z - ER, E.z + ER], [D.encB.x - 8.8, D.encB.x + 8.8, D.encB.z - 8.8, D.encB.z + 8.8], [D.encA.x - 8.7, D.encA.x + 8.7, D.encA.z - 6.7, D.encA.z + 6.7]] }),
  // Enclosure D: the gap in its south wall, and the floor inside
  region({ id: "d-gap", section: "s2", x0: -1.2, x1: 1.2, z0: 5.5, z1: DR + 1.6, y: 0, inset: 0.1, outside: true }),
  region({ id: "d", section: "s2", x0: -8.6, x1: 8.6, z0: -8.6, z1: 7.2, y: 0, inset: 0.2, outside: true,
    holes: holesOf(pd.central, 0.3).concat(holesOf(pd.ring, 0.25), [[-9.6, -7.2, -9.6, -7.2], [7.2, 9.6, -9.6, -7.2], [-9.6, -6.4, 6.4, 9.6], [6.4, 9.6, 6.4, 9.6]]) }),
  // Enclosure C: the way in from the south through the gaps in its rings, and the floor inside the inner ring
  region({ id: "c-way", section: "s3", x0: E.x - 1.1, x1: E.x + 1.1, z0: E.z + 2.6, z1: E.z + ER + 1.6, y: 0, inset: 0.1, outside: true }),
  region({ id: "c", section: "s3", x0: E.x - 3.9, x1: E.x + 3.9, z0: E.z - 3.9, z1: E.z + 3.6, y: 0, inset: 0.15, outside: true, holes: holesOf(pc.central, 0.3).concat(holesOf(pc.ring, 0.2)) }),
  // the quarry
  region({ id: "quarry", section: "s4", x0: Q.x - 14, x1: Q.x + 14, z0: Q.z - 12, z1: Q.z + 12, y: 0, outside: true, holes: [[Q.x - 4.6, Q.x + 4.6, Q.z - 1.9, Q.z + 1.9]] }),
  region({ id: "q-back", section: "s4", x0: Q.x - 14.6, x1: Q.x - 13.6, z0: Q.z - 0.9, z1: Q.z + 0.9, y: 0, inset: 0.05, portal: "s1", outside: true })
];
for (const r of regions) r.surface = r.section === "v" || r.id === "walkway" || r.id === "ramp" ? "wood" : "rock";

// ---------------------------------------------------------------- the walking route (Walk on / Walk back)
const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),                        // out onto the hill
  P(4, -29.6, Y, true, S_),                             // the walkway: Enclosure D below
  P(-18, -29.6, Y, true, S_ + 0.3),                     // Enclosures A and B
  P(10.8, -29.2, Y, false),
  P(11.2, -18.2, 0, true, S_),                          // down the ramp
  P(13.6, -12, 0, false), P(13.6, 13.2, 0, false),
  P(0, 13.2, 0, true, 0),                               // the gap in D's wall
  P(0, 6.4, 0, true, 0),                                // inside D: the central pair
  P(-7.0, -4.6, 0, true, -0.5),                         // the Vulture Stone
  P(4.4, -2.4, 0, true, PI * 0.1),
  P(0, 13.2, 0, false), P(3.2, 14.2, 0, false), P(3.2, 42, 0, false),
  P(E.x, 42, 0, true, 0),                               // the way into C
  P(E.x, E.z + 3.0, 0, true, 0),                        // inside C
  P(E.x, 42, 0, false), P(13.6, 42, 0, false), P(13.6, -12, 0, false),
  P(11.2, -18.2, 0, false), P(10.8, -29.2, Y, false),
  P(-10, -29.8, Y, true, 0)                             // the portal to the quarry
];

// ---------------------------------------------------------------- info points
const cen = (id) => pd.central.concat(pd.ring).find((p) => p.id === id);
const p18 = cen("p18"), p43 = cen("p43");
const info = [
  // ---- vestibule (the archive's own room)
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you go out", title: "Göbekli Tepe",
    html: "<p>Göbekli Tepe, &lsquo;Potbelly Hill&rsquo;, is a mound some 15 metres high on a limestone ridge above the Harran plain in south-eastern Turkey. Inside it are round enclosures of stone walls set with T-shaped limestone pillars, among the earliest known monumental architecture, raised from about 9500 BCE by people who did not yet farm.</p><p>This walk starts on the rim of the main excavation, goes down among the pillars of <strong>Enclosures D and C</strong>, and ends at the <strong>quarry</strong> where the pillars were cut. The layout is modelled after published plans at approximate size; the carvings are our own simplified renderings, and the stone is drawn in code.</p>",
    links: [L.ch42, L.v60], sources: REF.unesco + " (&ldquo;one of the first manifestations of human-made monumental architecture&rdquo;); " + REF.tt + ", FAQ (&ldquo;the earliest yet known monumental architecture&rdquo;); " + REF.ch42 + "." },
  { id: "v-v60", section: "v", pos: [V0.x - 2.6, 1.35, V0.z - 1.0], relic: { id: "v60", slug: "gobekli-tepe", title: "Göbekli Tepe's Pillars", category: "Relics & Sacred Objects", held: "In place: Göbekli Tepe, Şanlıurfa Province, Turkey (UNESCO World Heritage Site)", dated: "c. 9500–8000 BCE (Pre-Pottery Neolithic)", kind: "pillar" }, title: "A pillar of Göbekli Tepe (the Vault's rendition)",
    html: "<p><strong>From this site.</strong> The Vault&rsquo;s small rendition of a T-pillar, with its arms, hands and belt. Outside, you will walk among full-size ones, still standing where they were set up.</p>" },
  { id: "v-door", section: "v", pos: [V0.x, 3.45, V0.z - 4.4], cat: "The way out", title: "To the hill",
    html: "<p>Walk into the golden portal to step out onto the walkway on the rim of the excavation.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 3.45, V0.z + 4.4], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>This portal returns you to the museum, to the room of the Neolithic.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] },
  // ---- I: the hill and the hollow
  { id: "hill", section: "s1", pos: [6.5, Y + 1.6, -27.6], cat: "I · The hill", title: "A hill full of stones",
    html: "<p>A survey by Istanbul and Chicago universities noted the mound in 1963 and collected thousands of flint tools, but took the tops of the pillars for grave markers. In 1994 Klaus Schmidt of the German Archaeological Institute recognised them as megaliths; excavation began in 1995 and continues under a Turkish&ndash;German team. Only a small part of the mound has been dug. Geophysical survey points to at least twenty large enclosures, most still buried.</p>",
    flags: [APPROX], links: [L.ch42], sources: REF.unesco + "; " + REF.clare + "; " + REF.cwa + "; " + REF.ttFind + "." },
  { id: "dating", section: "s1", pos: [1.0, Y + 1.6, -27.6], cat: "I · The hill", title: "How old?",
    html: "<p>Radiocarbon dates place the use of the site between about 9500 and 8000 BCE, in the Pre-Pottery Neolithic, thousands of years before writing, metal or the wheel, and some six thousand years before the first stage of Stonehenge. Dates from the mortar of the walls show the enclosures were used, rebuilt and altered for centuries; the excavators gave up the original three-layer scheme of the site in favour of this longer, overlapping story.</p>",
    links: [L.ch42], sources: REF.clare + "; " + REF.unesco + "." },
  { id: "ab", section: "s1", pos: [-18, Y + 1.6, -27.6], cat: "I · The hollow", title: "Enclosures A and B",
    html: "<p>The enclosures are lettered in the order they were found. <strong>A</strong>, nearest the walkway, is smaller and more oval than the rest; <strong>B</strong> beyond it is round, with its central pair and a fox carved on one of them. Each enclosure is a ring of dry-stone wall with pillars set into it facing inwards, round a central pair that stand taller than the rest.</p>",
    flags: [APPROX], links: [L.v60], sources: REF.cwa + "; " + REF.tt + "." },
  { id: "geometry", section: "s1", pos: [-6, Y + 1.6, -27.6], cat: "I · The hollow", title: "Planned as one?",
    toggle: { id: "triangle", on: "Show the triangle", off: "Hide the triangle" },
    html: "<p>In 2020 Gil Haklay and Avi Gopher argued that Enclosures B, C and D were laid out together, on a plan: the midpoints of their central pairs form a nearly equilateral triangle, and an axis drawn square to one side runs through the centre of D. If they are right, the builders planned with geometry before they farmed. Their method has been questioned, and the triangle here is drawn on our approximate layout, so it shows the idea, not a measurement.</p>",
    flags: [CONTESTED, APPROX], links: [L.ch42], sources: REF.haklay + "." },
  { id: "temple", section: "s1", pos: [-28, Y + 1.6, -27.6], cat: "I · The hollow", title: "Temple, or houses?",
    html: "<p>Klaus Schmidt called Göbekli Tepe the first temple: a sanctuary on a hill, built by hunter-gatherers who came together to raise it, before anyone lived there. In 2011 Edward Banning argued that the round buildings might be houses rich in ritual, since in this period sacred and everyday life were not kept apart. Since 2015 the excavators have found ordinary dwellings, tools for grinding cereals, burials under a floor and a rock-cut pit and channels that may have stored rainwater. Lee Clare has written that this forces a revision of the &lsquo;temple&rsquo; story; the excavators still treat the great enclosures as special buildings, not homes.</p>",
    flags: [CONTESTED], links: [L.ch42], sources: REF.banning + "; " + REF.ttHouse + "; " + REF.clare + "." },
  { id: "walk", section: "s1", pos: [12.6, Y + 1.4, -26.8], cat: "I · The hollow", title: "A ramp the real site does not have",
    html: "<p>Visitors to Göbekli Tepe stay on raised walkways round the excavation, under a large modern shelter roof. To let you walk among the pillars, this model adds a ramp down into the hollow and leaves the shelter out so the sky shows.</p>",
    flags: [{ t: "Model convenience, not the real site", soft: true }], sources: REF.clare + "." },
  // ---- II: Enclosure D
  { id: "encD", section: "s2", pos: [-2.6, 1.6, 4.2], cat: "II · Enclosure D", title: "Enclosure D",
    html: "<p>D is the best preserved of the enclosures: a ring of rough stone wall about twenty metres across, with a bench along its inner face, eleven pillars found so far set into the wall, and two taller pillars standing free in the middle on the smoothed bedrock. Foxes and snakes are the commonest animals carved here, with boar, aurochs, gazelle, wild ass, birds and others.</p>",
    flags: [APPROX], links: [L.v60, L.ch42], sources: REF.cwa + "; " + REF.tt + "." },
  { id: "p18", section: "s2", pos: [p18.x + 0.9, 2.4, p18.z + 1.5], cat: "II · Enclosure D", title: "The central pair: Pillars 18 and 31",
    html: "<p>Each of the two central pillars is about 5.5 metres tall and weighs some eight to ten tonnes. They are not just posts. Arms are carved down their broad sides, bent at the elbow, and the hands meet across the narrow front above a belt; from the belt hangs a fox pelt. Under the head are symbols, where a necklace would hang. The T-shaped top is the head, without a face. The pillars are beings.</p><p>Who they are is not known. Ancestors, spirits and gods have all been suggested; nothing written survives to say.</p>",
    flags: [RENDER, { t: "Height published; other sizes approximate", soft: true }], links: [L.v60, L.ch42], sources: REF.ttMove + "; " + REF.tt + "; " + REF.ch42 + "." },
  { id: "p43", section: "s2", pos: [p43.x + 1.4, 2.6, p43.z + 1.4], cat: "II · Enclosure D", title: "The Vulture Stone (Pillar 43)",
    html: "<p>Pillar 43 in the north-west of the wall is crowded with carving: a vulture with a raised wing beside a disc, birds and beasts above, and, lower down, smaller creatures and a headless man. In 2017 two engineers, Martin Sweatman and Dimitrios Tsikritsis, read the animals as constellations and the pillar as a record of a comet strike about 10,950 BCE.</p><p>The excavators answered that the earliest date for Enclosure D is some 700 to 1000 years later than that, that the reading picks a few pillars out of more than sixty, ignores the carving on the pillar&rsquo;s narrow sides, and assumes that hunters of the tenth millennium BCE saw the same constellations that Egyptian, Arabian and Greek scholars named thousands of years later.</p>",
    flags: [RENDER, NOTSUP], links: [L.v60], sources: REF.sweatman + "; " + REF.notroff + "; " + REF.ttFox + "." },
  { id: "stars", section: "s2", pos: [3.6, 1.9, -3.4], cat: "II · Enclosure D", title: "Were the enclosures aimed at the stars?",
    html: "<p>Several writers have looked for sky alignments here. In 2016 the astronomer Giulio Magli suggested that the enclosures were laid out to watch the rising of <strong>Sirius</strong>, a brilliant star that, by the slow wobble of the earth&rsquo;s axis, had just begun to appear above the southern horizon in this period.</p><p>The excavators reply that there is no convincing evidence yet that any enclosure was oriented to the sky, and that if, as they think likely, the enclosures were roofed or sunk into the ground, they would have made poor observatories. The question remains open, but no alignment has been demonstrated.</p>",
    flags: [CONTESTED], links: [L.ch42], sources: REF.magli + "; " + REF.ttFox + "." },
  // ---- III: Enclosure C
  { id: "encC", section: "s3", pos: [E.x - 2.6, 1.6, E.z + 1.6], cat: "III · Enclosure C", title: "Enclosure C",
    html: "<p>C is ringed by three, perhaps four, concentric walls, set with pillars, about thirty metres across at the outside. Its two central pillars, numbered 35 and 37, were found broken; they stood on pedestals carved out of the smoothed bedrock floor. Pillar 35, pieced together from laser scans of its fragments, was about five metres tall. Wild boar dominate the carvings here. On Pillar 27 a predator in high relief, carved from the same block, crouches above a boar in flat relief.</p>",
    flags: [APPROX, RENDER], links: [L.v60], sources: REF.cwa + "; " + REF.tt + "." },
  { id: "backfill", section: "s3", pos: [E.x + 2.4, 1.6, E.z - 1.2], cat: "III · Enclosure C", title: "Buried on purpose?",
    html: "<p>The enclosures were found full of rubble, flint and animal bone. For years the excavators read this as deliberate backfilling, a ritual burial of each building at the end of its life, and the archive&rsquo;s Neolithic chapter still says so. Since 2019 the excavation team has argued instead that the fill slid in from the slopes above, which would explain why it mixes material of different ages. The question is now contested.</p>",
    flags: [CONTESTED], links: [L.ch42], sources: REF.clare + "; " + REF.ch42 + "." },
  { id: "roof", section: "s3", pos: [E.x - 2.0, 2.0, E.z - 2.4], cat: "III · Enclosure C", title: "Open to the sky, or roofed?",
    html: "<p>No roof survives. Some reconstructions show open rings; the excavators now think the enclosures were likely roofed, with the walls and pillars carrying the load. Like everything about how these buildings were used, it is a reading of the evidence, not a finding.</p>",
    flags: [CONTESTED], sources: REF.kinzel + "; " + REF.ttFox + "." },
  // ---- IV: the quarry
  { id: "quarry", section: "s4", pos: [Q.x - 3, 1.6, Q.z + 3.4], cat: "IV · The quarry", title: "Where the pillars came from",
    html: "<p>The pillars were cut from the limestone of the plateau round the mound, part of the protected site. The workers used flint: no metal was known. On the plateau&rsquo;s western edge lies a pillar that was never finished: about seven metres long and one and a half thick, it would have weighed some fifty tonnes, larger than any found standing. It may have cracked as it was cut, and was left where it lay.</p>",
    flags: [{ t: "Size published; position approximate", soft: true }], links: [L.v60, L.ch42], sources: REF.ttMove + "." },
  { id: "moving", section: "s4", pos: [Q.x + 5, 1.6, Q.z - 3.0], cat: "IV · The quarry", title: "How were they moved?",
    html: "<p>How pillars of eight to ten tonnes were moved several hundred metres and raised into their sockets is not recorded. Levers, ropes, wooden rollers or sledges and many hands are the usual answers. Claims that the work needed a lost advanced civilisation are not supported: the tools, the debris and the unfinished pillar all point to people working stone with flint.</p>",
    flags: [NOTSUP], links: [L.v60], sources: REF.ttMove + "; " + REF.tt + "." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>From published figures:</strong> the central pillars of Enclosure D at about 5.5 m and the wall pillars at up to about 4 m; eleven pillars in D&rsquo;s wall round the central pair; the round enclosures at roughly 10 to 30 m across, with three or four rings of wall in C; and the unfinished pillar in the quarry, about 7 m long and 1.5 m thick.</p>" +
    "<p><strong>Approximate:</strong> where each enclosure lies and how far apart they are, the place of every pillar, the shapes of the walls and the depth of the hollow. The carvings are our own simplified renderings in the manner of the reliefs, not tracings of any pillar, and most pillars here are left plain.</p>" +
    "<p><strong>Not shown:</strong> the modern shelter roof and its supports, the later rectangular buildings, the excavated houses, the cisterns, the other buried enclosures, and the people. The ramp into the hollow is the model&rsquo;s own.</p>",
  links: [L.ch42, L.v60], sources: REF.cwa + "; " + REF.ttMove + "; " + REF.clare + "; " + REF.haklay + "." };

// the outdoor sky over the Harran plain: clear, dry, bright
const sky = { bg: "#c7d4de", fog: "#d9d2c0", hemi: "#eef0f2", ground: "#b8a079", sunPos: [-50, 75, 45], sun: 1.55 };

export default { title: "Göbekli Tepe", version: 1, stones: ["block", "core", "rock", "wood"], sky, sections, regions, route, info, about, D, V0 };
