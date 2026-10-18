/* ==========================================================================
   Borobudur — the site: sections, walkable regions, route, info points.
   Geometry lives in the section modules (s0-vestibule.js … s3-terraces.js),
   measurements in dims.js, the drawn surfaces in art.js.

   Status: "preview" in docs/assets/pilgrimage-data.js. The page exists
   (noindex) but the site is off the menu until Carter approves it going live.
   Plan: plans/pilgrimage-sites.md. Sources: sources/pilgrimage-borobudur.md.

   Frame (see dims.js): metres; x east, y up, z south; the monument's centre
   at x = 0, z = 0, the ground y = 0, the foot's walkway y = 4, the five
   galleries y = 4 to 18.4, the plateau y = 22 and the three circular
   terraces above it. Shown as it stands today, simplified.
   ========================================================================== */
import { region } from "../../kit.js?v=1";
import { D } from "./dims.js?v=1";

const PI = Math.PI, E_ = -PI / 2, W_ = PI / 2;   // yaw 0 faces north (-z); -PI/2 faces east; PI/2 faces west
export const V0 = { x: 260, z: 0 };            // the archive's own vestibule (east of the monument, out of its box)
export const EXIT_HREF = "../museum.html#ch20";
const F = D.F, G = D.gal, sw = D.stair.hw, C = D.circ;

// ---------------------------------------------------------------- short references (full list: sources/pilgrimage-borobudur.md)
const REF = {
  brit: "Britannica Editors, &ldquo;Borobudur&rdquo;, <em>Encyclopaedia Britannica</em> (online, updated 14 October 2026)",
  unesco: "UNESCO World Heritage Centre, &ldquo;Borobudur Temple Compounds&rdquo; (site 592, inscribed 1991)",
  whe: "J. Wiener, &ldquo;Borobudur&rdquo;, <em>World History Encyclopedia</em> (2018)",
  gun: "H. Gunarto, <em>Preserving Borobudur&rsquo;s Narrative Relief Wall of UNESCO Cultural World Heritage</em>, RCAPS Occasional Paper 07-5 (Ritsumeikan Asia Pacific University, 2007), citing N. J. Krom and others",
  san: "H. Santiko, &ldquo;Identification of Karmawibhangga Reliefs at Candi Borobudur&rdquo;, <em>AMERTA</em> 34.2 (2016)",
  magli: "G. Magli, &ldquo;Archaeoastronomy of the Sun path at Borobudur&rdquo; (preprint, arXiv:1712.06486, 2017)",
  jp: "Y. Perdani, report on threats to Borobudur, <em>The Jakarta Post</em> (23 August 2014)",
  ch20: "the archive&rsquo;s chapter on Mahayana Buddhism (ch20)"
};
const L = {
  ch20: { href: "../chapters/ch20.html", label: "Read the Mahayana chapter" },
  ch53: { href: "../chapters/ch53.html", label: "Tibetan & Vajrayana Buddhism" },
  v46: { href: "../vault/piprahwa-relics.html", label: "The Piprahwa Relics (Vault)" },
  v30: { href: "../vault/diamond-sutra.html", label: "The Diamond Sutra (Vault)" }
};
const APPROX = { t: "Sizes after published figures · heights and terraces approximate", soft: true };
const RENDER = { t: "Reliefs: our own rendering, simplified", soft: true };
const STANDIN = { t: "Statues shown as plain stand-ins", soft: true };
const CONTESTED = { t: "Contested", soft: false };
const DIFFER = { t: "Sources differ", soft: false };
const UNTESTED = { t: "Proposed by a single author · not established", soft: false };
const LIVING = { t: "A living place of worship", soft: true };

// ---------------------------------------------------------------- sections (one big box: the monument is in view from all round)
const BIG = [-180, -5, -180, 180, 60, 180];
const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: the portal back to the museum, a Vault object for comparison, and the way out to the east stairs." },
  { id: "s1", name: "I · The foot", short: "the foot", module: "s1-foot.js", box: BIG, start: { x: 120, z: -14, yaw: 1.68, y: 0 }, blurb: "Approach from the east, where the pilgrim's way begins, and climb onto the broad foot that covers the hidden reliefs." },
  { id: "s2", name: "II · The galleries", short: "the galleries", module: "s2-galleries.js", box: BIG, start: { x: 55.6, z: 8, yaw: 2.55, y: G.y0 }, blurb: "Walk the first gallery clockwise, between walls of carved panels and the balustrade's niches, then climb the east stairs through the four galleries above." },
  { id: "s3", name: "III · The circular terraces", short: "the terraces", module: "s3-terraces.js", box: BIG, start: { x: 37, z: 4, yaw: W_, y: D.top.y }, blurb: "Above the galleries the walls fall away: three round terraces of perforated stupas around the great central stupa." }
];

// ---------------------------------------------------------------- where the visitor may walk
// a round terrace as three rectangles inside the circle of radius r: two crossed along the axes and a square
// between them, so the ring round the central stupa joins up
const octa = (r) => { const a = 0.96 * r, b = 0.26 * r, c = 0.7 * r; return [[-a, a, -b, b], [-b, b, -a, a], [-c, c, -c, c]]; };
const ringHoles = (c) => { const out = []; for (let i = 0; i < c.n; i++) { const t = (i + 0.5) * 2 * PI / c.n, x = c.ring * Math.cos(t), z = c.ring * Math.sin(t), h = D.stupa.r + 0.35; out.push([x - h, x + h, z - h, z + h]); } return out; };
// the four sides of the band between an inner line (a) and an outer line (b), at floor y
const band = (id, section, a, b, y) => [
  region({ id: id + "-e", section, x0: a, x1: b, z0: -b, z1: b, y, outside: true }),
  region({ id: id + "-w", section, x0: -b, x1: -a, z0: -b, z1: b, y, outside: true }),
  region({ id: id + "-n", section, x0: -b, x1: b, z0: -b, z1: -a, y, outside: true }),
  region({ id: id + "-s", section, x0: -b, x1: b, z0: a, z1: b, y, outside: true })
];
const regions = [
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0, holes: [[V0.x - 3.2, V0.x - 2.0, V0.z - 1.6, V0.z - 0.4]] }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  region({ id: "v-exit", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z + 4.6, z1: V0.z + 5.6, y: 0, inset: 0.05, portal: "museum", href: EXIT_HREF }),
  // the ground round the monument, the way back to the Vestibule, the east stairs onto the foot and the foot's walkway
  region({ id: "ground", section: "s1", x0: -150, x1: 150, z0: -150, z1: 150, y: 0, outside: true, holes: [[-F.hw, F.hw, -F.hw, F.hw]] }),
  region({ id: "to-v", section: "s1", x0: 128.8, x1: 130.2, z0: -0.8, z1: 0.8, y: 0, inset: 0.05, portal: "v", outside: true }),
  region({ id: "stair0", section: "s1", x0: F.hw + 4.5, x1: F.hw, z0: -sw, z1: sw, y: 0, y1: F.y, axis: "x", open: "we", outside: true }),
  ...band("walk", "s1", D.B0, F.hw, F.y),
  region({ id: "gate0", section: "s1", x0: D.B0 - G.wallT - 0.6, x1: D.B0 + 0.6, z0: -sw, z1: sw, y: F.y, open: "we", outside: true }),
  // the five galleries and the stairs between them (the east stairs)
  ...[0, 1, 2, 3, 4].flatMap((k) => band("g" + k, "s2", D.mainW(k), D.balW(k) - G.wallT, D.galY(k))),
  ...[0, 1, 2, 3, 4].map((k) => region({ id: "st" + k, section: "s2", x0: D.mainW(k) + 1.5, x1: D.mainW(k) - 2, z0: -sw, z1: sw, y: D.galY(k), y1: D.galY(k + 1), axis: "x", open: "we", outside: true })),
  // the plateau, the circular terraces and the stairs up them
  region({ id: "plateau", section: "s3", x0: -D.top.hw + G.wallT, x1: D.top.hw - G.wallT, z0: -D.top.hw + G.wallT, z1: D.top.hw - G.wallT, y: D.top.y, outside: true, holes: octa(C[0].r + 0.3) }),
  ...C.flatMap((c, j) => {
    const inner = j < 2 ? octa(C[j + 1].r + 0.3) : [[-D.cs.r - 1.1, D.cs.r + 1.1, -D.cs.r - 1.1, D.cs.r + 1.1]];
    return octa(c.r - 0.3).map((q, i) => region({ id: "c" + j + "-" + i, section: "s3", x0: q[0], x1: q[1], z0: q[2], z1: q[3], y: c.y, outside: true, holes: inner.concat(ringHoles(c)) }));
  }),
  region({ id: "to-s1", section: "s3", x0: -0.8, x1: 0.8, z0: -17.6, z1: -16.4, y: C[2].y, inset: 0.05, portal: "s1", outside: true }),
  ...C.map((c, j) => region({ id: "cst" + j, section: "s3", x0: c.r + 1.5, x1: c.r - 2.5, z0: -sw, z1: sw, y: j ? C[j - 1].y : D.top.y, y1: c.y, axis: "x", open: "we", outside: true }))
];
for (const r of regions) r.surface = r.section === "v" ? "wood" : "stone";

// ---------------------------------------------------------------- the walking route (Walk on / Walk back): up the east stairs, once round the
// first gallery clockwise (the monument on the right), then straight up
const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const g0 = (D.mainW(0) + D.balW(0) - G.wallT) / 2, y0 = G.y0, wk = (D.B0 + F.hw) / 2;
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),                        // out to the east
  P(92, 0, 0, true, W_),                                // the monument from the east
  P(F.hw + 5, 0, 0, false), P(wk, 0, F.y, true, W_),    // up onto the foot
  P(wk, 30, F.y, true, W_),                             // the foot and its hidden reliefs
  P(wk, 0, F.y, false), P(D.B0 - 1, 0, y0, false),
  P(g0, 6, y0, true, 2.55),                             // the first gallery, turning south (clockwise)
  P(g0, g0, y0, false), P(0, g0, y0, true, 0.9),        // the south side
  P(-g0, g0, y0, false), P(-g0, 0, y0, true, -0.65),     // the west side
  P(-g0, -g0, y0, false), P(0, -g0, y0, true, -2.2),      // the north side
  P(g0, -g0, y0, false), P(g0, 0, y0, false),
  ...[0, 1, 2, 3, 4].flatMap((k) => [P(D.mainW(k) + 1.4, 0, D.galY(k), false), P(D.mainW(k) - 1.9, 0, D.galY(k + 1), k === 4, W_)]),   // straight up the east stairs
  P(C[0].r + 1.4, 0, D.top.y, false), P(C[0].r - 2.4, 0, C[0].y, false),
  P(C[0].r - 3.7, 6, C[0].y, true, W_ + 0.5),           // among the stupas
  P(C[1].r + 1.4, 0, C[0].y, false), P(C[1].r - 2.4, 0, C[1].y, false),
  P(C[2].r + 1.4, 0, C[1].y, false), P(C[2].r - 2.4, 0, C[2].y, false),
  P(D.cs.r + 1.8, 3, C[2].y, true, W_),                 // the central stupa
  P(C[2].r - 2.4, 0, C[2].y, true, E_)                  // looking back east, down the line to Pawon and Mendut
];

// ---------------------------------------------------------------- info points
const info = [
  // ---- vestibule (the archive's own room)
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you go out", title: "Borobudur",
    html: "<p>Borobudur, in central Java, Indonesia, about 42 kilometres north-west of Yogyakarta, is a Mahayana Buddhist monument built under the Sailendra dynasty between the late 8th and the mid 9th century. It is built as a stepped pyramid of stone over a small hill: a square foot, five square galleries and three round terraces, crowned by a central stupa. It is a place of Buddhist pilgrimage again today.</p><p>This walk starts at the east stairs, where the pilgrim&rsquo;s way begins, climbs onto the foot, goes once round the first gallery and then up through the levels to the central stupa. The monument is shown as it stands, simplified; the reliefs are our own renderings and the statues plain stand-ins.</p>",
    flags: [LIVING], links: [L.ch20, L.ch53], sources: REF.brit + "; " + REF.unesco + "; " + REF.whe + "." },
  { id: "v-v46", section: "v", pos: [V0.x - 2.6, 1.35, V0.z - 1.0], relic: { id: "v46", slug: "piprahwa-relics", title: "The Piprahwa Relics", category: "Relics & Sacred Objects", held: "Indian Museum, Kolkata; National Museum, New Delhi", dated: "Stupa deposit c. 3rd–2nd century BCE or earlier (debated)", kind: "jar" }, title: "The Piprahwa Relics (for comparison)",
    html: "<p><strong>Not from Borobudur.</strong> Bone fragments, a soapstone urn and gems dug from a stupa at Piprahwa in northern India in 1898; the urn&rsquo;s inscription says the shrine holds relics of the Buddha, or of the Buddha&rsquo;s kinsmen, depending on how it is read. They are here because they were found inside a stupa, the kind of monument Borobudur is too, built a thousand years and more later.</p>",
    links: [L.v46, L.ch20] },
  { id: "v-door", section: "v", pos: [V0.x, 3.45, V0.z - 4.4], cat: "The way out", title: "To the east stairs",
    html: "<p>Walk into the golden portal to step out on the east side of the monument, where the pilgrim&rsquo;s way begins.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 3.45, V0.z + 4.4], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>This portal returns you to the museum, to the room of Mahayana Buddhism.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] },
  // ---- I: the foot
  { id: "monument", section: "s1", pos: [86, 1.9, -4], cat: "I · The foot", title: "A stupa and a mountain",
    html: "<p>The monument is 123 metres square at its base. About 56,600 cubic metres of grey volcanic stone, andesite, were laid without mortar over a natural hill. It rises in three parts: a square foot, five square terraces with galleries, and three round terraces, with a great stupa on top.</p><p>Britannica describes it as at once a stupa, a temple mountain modelled on Mount Meru, the mountain at the centre of the world, and a mandala, a diagram of the universe in which the square stands for the earth and the circle for heaven.</p>",
    flags: [APPROX], links: [L.ch20, L.ch53], sources: REF.gun + "; " + REF.brit + "; " + REF.whe + "." },
  { id: "height", section: "s1", pos: [86, 1.9, 4], cat: "I · The foot", title: "How tall?",
    html: "<p>Britannica gives the top of the central stupa as 35 metres above the base; Gunarto&rsquo;s account, after the Dutch archaeologist N. J. Krom, gives the monument a height of 42 metres. The figures may measure different things, such as the spire as it once was and as it is now, but the sources used here do not say. The model stops at 35 metres.</p>",
    flags: [DIFFER, APPROX], sources: REF.brit + "; " + REF.gun + "." },
  { id: "foot", section: "s1", pos: [D.B0 + 2, F.y + 1.7, 32], cat: "I · The foot", title: "The hidden foot",
    html: "<p>Behind the broad stone foot you stand on lies the monument&rsquo;s first base, carved with 160 panels. J. W. IJzerman uncovered them in 1885; Kassian Cephas photographed every one in 1890&ndash;91 before they were covered again. Four panels are left open for visitors.</p><p>They illustrate the <em>Karmawibhangga</em>, the teaching of the law of cause and effect, with deeds and their results set in the everyday life of 9th- and 10th-century Java. Santiko finds the scenes closest to one of the text&rsquo;s two Chinese translations. Why the foot was built over them is not explained in the sources used here.</p>",
    links: [L.ch20], sources: REF.san + "; " + REF.gun + "." },
  { id: "line", section: "s1", pos: [90, 1.9, 4.5], cat: "I · The foot", title: "The line to Mendut and Pawon",
    toggle: { id: "line", on: "Show the line and the sun", off: "Hide them" },
    html: "<p>To the east, two smaller temples, Pawon and Mendut, stand on a straight line with Borobudur; Mendut holds a great stone Buddha flanked by two bodhisattvas.</p><p>What the line means is debated. Giulio Magli measured it from satellite images, about 7 degrees off east&ndash;west, and proposed in a 2017 preprint that, looking west along it, the sun sets on the line on the two days a year when it passes overhead at noon, about 28 February and 11 October. He thinks it likely intentional, perhaps for a procession imitating the sun&rsquo;s path, an older and controversial idea of Moens (1951), but says chance cannot be ruled out. The model shows the line running east and, beyond the monument to the west, the setting sun where his figures place it.</p>",
    flags: [UNTESTED, CONTESTED], links: [L.ch20], sources: REF.unesco + "; " + REF.magli + "; " + REF.brit + "; " + REF.whe + "." },
  { id: "lost", section: "s1", pos: [wk, F.y + 1.7, -6], cat: "I · The foot", title: "Lost and found",
    html: "<p>How and when Borobudur fell out of use is not settled. UNESCO says it was abandoned at some time between the 10th and the 15th century; Britannica that it lay buried under volcanic ash from about 1000; World History Encyclopedia that it was left in the 1400s as the Javanese turned to Islam, while noting that the reasons are unknown and debated.</p><p>In 1814 Thomas Stamford Raffles, the British lieutenant governor of Java, sent Hermann Cornelius to find and clear it. A Dutch team under Van Erp restored it from 1907 to 1911; a second restoration, with UNESCO, was completed in 1983. It was inscribed as a World Heritage Site in 1991.</p>",
    flags: [DIFFER], sources: REF.unesco + "; " + REF.brit + "; " + REF.whe + "; " + REF.gun + "." },
  // ---- II: the galleries
  { id: "path", section: "s2", pos: [g0, y0 + 1.9, 3], cat: "II · The galleries", title: "The pilgrim's way",
    html: "<p>The way begins at the east stairs. Pilgrims walk clockwise, keeping the monument on their right, once round each level before climbing to the next: more than five kilometres in all. The levels are read as the three spheres of the Buddhist cosmos: the foot as the sphere of desire (<em>kamadhatu</em>), the square galleries as the sphere of form (<em>rupadhatu</em>), and the round terraces as the formless sphere (<em>arupadhatu</em>).</p>",
    links: [L.ch20, L.ch53], sources: REF.brit + "; " + REF.unesco + "; " + REF.gun + "." },
  { id: "reliefs", section: "s2", pos: [g0, y0 + 2.2, 20], cat: "II · The galleries", title: "Panels in stone",
    html: "<p>The galleries&rsquo; walls carry 1,460 narrative panels and 1,212 decorative ones, some 2,500 square metres of carving. Besides the 160 hidden on the foot, they tell the life of the Buddha (the <em>Lalitavistara</em>, 120 panels), stories of his former lives and other tales (the <em>Jatakas</em> and <em>Avadanas</em>, 720), the <em>Gandavyuha</em> (388) and the <em>Bhadracari</em> (72).</p><p>The panels drawn here are our own simple outlines, not copies, and are not meant to show any particular story.</p>",
    flags: [RENDER], links: [L.ch20], sources: REF.gun + "; " + REF.unesco + "." },
  { id: "niches", section: "s2", pos: [g0 + 0.6, y0 + 2.4, -14], cat: "II · The galleries", title: "The Buddhas in the niches",
    html: "<p>Open niches along the galleries held 432 statues of the Buddha; 368 remain in them. With the 72 in the stupas above, that makes 504 at the start. The model draws the niches with plain stand-in forms, not likenesses.</p>",
    flags: [STANDIN], links: [L.ch20], sources: REF.gun + "." },
  { id: "stairs", section: "s2", pos: [D.mainW(2) + 1.4, D.galY(2) + 2.0, 2.8], cat: "II · The galleries", title: "Up through the gates",
    html: "<p>The model lets you climb only the east stairs, where the pilgrim&rsquo;s way begins, straight up through the levels; the pilgrim walks each gallery all the way round before the next. The stairs on the other sides, the gateways, the heights of the levels and the steepness of the stairs are our estimates.</p>",
    flags: [APPROX], sources: REF.brit + "; " + REF.unesco + "." },
  // ---- III: the circular terraces
  { id: "stupas", section: "s3", pos: [C[0].r - 3.0, C[0].y + 1.9, 7.5], cat: "III · The circular terraces", title: "Seventy-two stupas",
    html: "<p>On the three round terraces there is little carving. Seventy-two bell-shaped stupas stand in rings, each holding a statue of the Buddha that can be glimpsed through its openwork stone. Here the walk leaves the world of forms for the formless.</p><p>The figures inside the model&rsquo;s stupas are plain stand-ins. How the 72 are divided among the rings, and their sizes, are our estimates.</p>",
    flags: [STANDIN, APPROX], links: [L.ch20, L.ch53], sources: REF.brit + "; " + REF.unesco + "." },
  { id: "central", section: "s3", pos: [D.cs.r + 2.4, C[2].y + 2.0, 6], cat: "III · The circular terraces", title: "The central stupa",
    html: "<p>At the summit stands the great central stupa, its top 35 metres above the base: the end of the climb.</p>",
    flags: [APPROX], links: [L.ch20], sources: REF.brit + "; " + REF.unesco + "." },
  { id: "bomb", section: "s3", pos: [C[1].r - 2.6, C[1].y + 1.9, -6], cat: "III · The circular terraces", title: "1985",
    html: "<p>In 1985 bombs set by extremists damaged nine of the stupas. The monument remains a place of pilgrimage: each year at the full moon of Waicak (Vesak), thousands of monks come in procession to mark the birth, enlightenment and death of the Buddha.</p>",
    flags: [LIVING], links: [L.ch20], sources: REF.jp + "; " + REF.brit + "." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>From published figures:</strong> the base 123 metres square; the three parts (square foot, five square galleries, three round terraces); the 72 stupas; the central stupa&rsquo;s top 35 metres above the base; the 160 hidden panels; the line to Pawon and Mendut, about 7 degrees off east&ndash;west.</p>" +
    "<p><strong>Approximate:</strong> the height of every level, the depth of the galleries, the radii of the round terraces, the sizes of the stupas and how they are shared among the rings, the stairs, and the sun&rsquo;s place in the sky. No measured plan could be opened for this build. The real plan is a square with many projecting corners; the model draws plain squares. The reliefs are our own outlines and the statues plain stand-ins.</p>" +
    "<p><strong>Not shown:</strong> the gateways&rsquo; carved arches, the small stupas along the balustrades, the reliefs on the balustrades&rsquo; inner faces, the open corner of the hidden foot, Mendut and Pawon themselves, the volcanoes round the plain, the trees, the park and the visitors.</p>",
  links: [L.ch20, L.ch53], sources: REF.gun + "; " + REF.brit + "; " + REF.unesco + "." };

// the outdoor sky of central Java: humid, bright haze
const sky = { bg: "#cfd8da", fog: "#d9dccf", hemi: "#f2f2ea", ground: "#7d8a5c", sunPos: [60, 80, 40], sun: 1.5, far: 2000, fogNear: 120, fogFar: 1500 };

export default { title: "Borobudur", version: 1, stones: ["limestone", "block", "floor", "rock", "wood", "turf"], sky, sections, regions, route, info, about, D, V0 };
