/* ==========================================================================
   The Great Pyramid of Khufu — the site: sections, walkable regions, route,
   info points and relic copies. Geometry lives in the section modules
   (s0-vestibule.js … s5-queens.js); all dimensions in dims.js.
   ========================================================================== */
import { D } from "./dims.js?v=1";
import { region } from "../../kit.js?v=1";
import { cartoucheSVG } from "./glyphs.js?v=1";

const PI = Math.PI, S_ = PI;                   // yaw PI faces south (+z), 0 faces north
export const V0 = { x: -200, z: 0 };          // the vestibule stands apart, in the archive's own space

// ---------------------------------------------------------------- short references (full list: sources/pilgrimage-great-pyramid.md)
const REF = {
  petrie: "W. M. F. Petrie, <em>The Pyramids and Temples of Gizeh</em> (1883)",
  lehner: "M. Lehner, <em>The Complete Pyramids</em> (1997)",
  vyse: "H. Vyse, <em>Operations Carried on at the Pyramids of Gizeh in 1837</em> (1840–42)",
  sp2017: "K. Morishima et al., &ldquo;Discovery of a big void in Khufu&rsquo;s Pyramid by observation of cosmic-ray muons&rdquo;, <em>Nature</em> 552 (2017)",
  sp2023: "S. Procureur et al., &ldquo;Precise characterization of a corridor-shaped structure in Khufu&rsquo;s Pyramid by observation of cosmic-ray muons&rdquo;, <em>Nature Communications</em> 14 (2023)",
  djedi: "Z. Hawass et al., first report on the video survey of the southern shaft of the Queen&rsquo;s Chamber, <em>Annales du Service des Antiquités de l&rsquo;Égypte</em> 84 (2011)",
  ch02: "the archive&rsquo;s Egypt chapter (ch02)",
  abdn: "University of Aberdeen, &ldquo;Missing 5,000-year-old piece of Great Pyramid puzzle discovered in cigar box in Aberdeen&rdquo;, news release, December 2020 (abdn.ac.uk/news/14573)",
  smyth: "C. Piazzi Smyth&rsquo;s description of the objects (1872&ndash;80), as quoted in the 2020 reports of their rediscovery",
  bm: "British Museum, London: the ball and the hook (registration numbers to be confirmed at review)",
  tallet: "P. Tallet, <em>Les papyrus de la mer Rouge I: le &laquo;journal de Merer&raquo;</em> (Cairo: IFAO, 2017); P. Tallet, <em>The Red Sea Scrolls</em> (London: Thames &amp; Hudson, 2021)",
  petrie1903: "W. M. F. Petrie, <em>Abydos</em>, part II (London: Egypt Exploration Fund, 1903)",
  hawass: "Z. Hawass, &ldquo;The Khufu statuette: is it an Old Kingdom sculpture?&rdquo;, in <em>M&eacute;langes Gamal Eddin Mokhtar</em> (Cairo: IFAO, 1985)",
  jenkins: "N. Jenkins, <em>The Boat Beneath the Pyramid: King Cheops&rsquo; Royal Ship</em> (London: Thames &amp; Hudson, 1980)",
  nms: "National Museums Scotland, collection record and story &ldquo;Pyramid casing stone&rdquo; (nms.ac.uk)",
  lepsius: "R. Lepsius, letter of 17 January 1843, in his <em>Letters from Egypt, Ethiopia, and the Peninsula of Sinai</em> (English translation, London, 1853)",
  gardiner: "A. H. Gardiner, <em>Egyptian Grammar</em>, 3rd ed. (Oxford, 1957), sign list (Aa1, G43, I9)",
  beckerath: "J. von Beckerath, <em>Handbuch der &auml;gyptischen K&ouml;nigsnamen</em>, 2nd ed. (Mainz, 1999)"
};
const L = {
  ch02: { href: "../chapters/ch02.html", label: "Read the Egypt chapter" },
  ch47: { href: "../chapters/ch47.html", label: "Journeys to the Underworld" },
  ch49: { href: "../chapters/ch49.html", label: "Sacred Kingship" },
  v34: { href: "../vault/pyramid-texts-of-unas.html", label: "The Pyramid Texts of Unas (Vault)" },
  v20: { href: "../vault/papyrus-of-ani.html", label: "The Papyrus of Ani (Vault)" }
};
const APPROX = { t: "Position approximate", soft: true };
const COPY = { t: "Modelled copy, not the object", soft: true };

// ---------------------------------------------------------------- sections (loaded as the visitor nears each one)
const pw2 = D.pw / 2;
const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: the portal back to the museum, two Vault objects for comparison, and the way in." },
  { id: "s1", name: "I · Entrance and Descending Passage", short: "the entrance", module: "s1-entrance.js", box: [-12, -4, -125, 12, 32, D.descEndZ + 2], start: { x: 0.4, z: -109.7, yaw: S_, y: D.entY }, blurb: "The original entrance on the north face, under its great gable stones, and the passage that slopes down into the rock." },
  { id: "s2", name: "II · Ascending Passage", short: "the Ascending Passage", module: "s2-ascending.js", box: [-4, 2, D.ascZ0 - 9, 4, D.ggY0 + 3, D.ggZ0 + 1], start: { x: 0, z: D.ascZ0 + D.plugRun + 1.6, yaw: S_, y: D.ascFloor(D.ascZ0 + D.plugRun + 1.6) }, blurb: "The robbers' tunnel round the granite plugs, and the steep, narrow climb to the Grand Gallery." },
  { id: "s3", name: "III · The Grand Gallery", short: "the Grand Gallery", module: "s3-gallery.js", box: [-2, D.ggY0 - 2, D.ggZ0 - 1, 2, D.ggY1 + 10, D.ggZ1 + 2], start: { x: 0, z: D.ggZ0 + 0.45, yaw: S_, y: D.ggY0 }, blurb: "Forty-six metres of corbelled limestone, rising at the passage's own slope." },
  { id: "s4", name: "IV · The King's Chamber", short: "the King's Chamber", module: "s4-kings.js", box: [D.kcX0 - 1, D.kcFloor - 2, D.stepZ0 - 1, 2, D.kcFloor + 8, D.kcZ1 + 1], start: { x: -0.3, z: D.kcZ0 + 0.9, yaw: PI / 2 - 0.15, y: D.kcFloor }, blurb: "The antechamber's portcullis slots, and the red granite chamber with its empty sarcophagus." },
  { id: "s5", name: "V · The Queen's Chamber", short: "the Queen's Chamber", module: "s5-queens.js", box: [D.qcX0 - 1, D.qcFloor - 2, D.hpZ0, D.qcX1 + 2, D.qcFloor + 8, D.qcZ1 + 1], start: { x: -1.2, z: D.qcZ0 + 1.0, yaw: S_, y: D.qcFloor }, blurb: "The long low passage, the step down, and the gabled chamber with its niche." }
];

// ---------------------------------------------------------------- glass cases in the Vestibule (offsets from V0), kept clear of walking
export const CASES = [[-2.6, -1.0], [-2.6, 1.6], [-2.6, 3.6], [2.6, 1.2], [2.6, 3.0], [2.6, -3.6]];

// ---------------------------------------------------------------- where the visitor may walk
const ascTop = D.ascZ0 + D.plugRun;
const stairZ0 = D.ggZ0 + 0.8, stairZ1 = D.ggZ0 + 3.4, walk = (z) => D.ggFloor(z) + 0.08;
const nicheZ = D.niche.zOff;
const regions = [
  // vestibule
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0, holes: CASES.map(([x, z]) => [V0.x + x - 0.6, V0.x + x + 0.6, V0.z + z - 0.6, V0.z + z + 0.6]) }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  // s1: the ledge outside, the mouth, the descending passage
  region({ id: "ledge", section: "s1", x0: -3.6, x1: 3.6, z0: -110.2, z1: D.entZ - 1.6, y: D.entY, outside: true }),
  region({ id: "recess", section: "s1", x0: -2.1, x1: 2.1, z0: D.entZ - 1.6, z1: D.entZ, y: D.entY, open: "n", outside: true }),
  region({ id: "ledge-back", section: "s1", x0: -3.3, x1: -2.2, z0: -110.4, z1: -109.5, y: D.entY, inset: 0.05, portal: "v", outside: true }),
  region({ id: "mouth", section: "s1", x0: -pw2, x1: pw2, z0: D.entZ - 1.6, z1: D.entZ + 0.2, y: D.entY, open: "ns", eye: 1.3, outside: true }),
  region({ id: "desc", section: "s1", x0: -pw2, x1: pw2, z0: D.entZ, z1: D.descEndZ - 0.4, y: D.entY, y1: D.descFloor(D.descEndZ - 0.4), open: "n", eye: 1.02 }),
  region({ id: "rt1", section: "s2", x0: D.rtX - 0.6, x1: -pw2, z0: D.rtZ0 - 0.8, z1: D.rtZ0 + 0.8, y: D.rtY0, open: "e", eye: 1.45 }),
  region({ id: "rt2", section: "s2", x0: D.rtX - 0.6, x1: D.rtX + 0.6, z0: D.rtZ0 - 0.8, z1: D.rtZ1 + 0.8, y: D.rtY0, y1: D.ascFloor(D.rtZ1 + 0.8), eye: 1.45 }),
  region({ id: "rt3", section: "s2", x0: D.rtX - 0.6, x1: -pw2, z0: D.rtZ1 - 0.8, z1: D.rtZ1 + 0.8, y: D.ascFloor(D.rtZ1 - 0.8), y1: D.ascFloor(D.rtZ1 + 0.8), open: "e", eye: 1.45 }),
  region({ id: "asc", section: "s2", x0: -pw2, x1: pw2, z0: ascTop, z1: D.ggZ0, y: D.ascFloor(ascTop), y1: D.ggY0, open: "s", eye: 1.02 }),
  // s3: the foot of the gallery, the steps, the walkway, the Great Step
  region({ id: "foot", section: "s3", x0: -D.ggW / 2, x1: D.ggW / 2, z0: D.ggZ0, z1: D.ggZ0 + 0.9, y: D.ggY0, open: "ns", inset: 0.22 }),
  region({ id: "stair", section: "s3", x0: -D.ggW / 2, x1: -D.ggCh / 2 + 0.05, z0: stairZ0, z1: stairZ1, y: D.ggY0, y1: walk(stairZ1), open: "n", inset: 0.12 }),
  region({ id: "stair-top", section: "s3", x0: -D.ggW / 2, x1: D.ggCh / 2, z0: stairZ1 - 0.6, z1: stairZ1 + 0.4, y: walk(stairZ1), inset: 0.12 }),
  region({ id: "gg", section: "s3", x0: -D.ggCh / 2, x1: D.ggCh / 2, z0: stairZ1 - 0.3, z1: D.ggZ1 - 1.2, y: walk(stairZ1 - 0.3), y1: walk(D.ggZ1 - 1.2), open: "s", inset: 0.16 }),
  region({ id: "gstep", section: "s4", x0: -D.ggCh / 2, x1: D.ggCh / 2, z0: D.ggZ1 - 1.2, z1: D.ggZ1 + 0.2, y: walk(D.ggZ1 - 1.2), y1: D.kcFloor, open: "ns", inset: 0.16 }),
  // s4: the step top, the low passages, the antechamber, the King's Chamber
  region({ id: "step-top", section: "s4", x0: -D.ggW / 2, x1: D.ggW / 2, z0: D.ggZ1, z1: D.stepZ1, y: D.kcFloor, open: "s", inset: 0.22 }),
  region({ id: "p1", section: "s4", x0: -pw2, x1: pw2, z0: D.p1Z0, z1: D.p1Z1, y: D.kcFloor, open: "ns", eye: 0.92 }),
  region({ id: "ac-leaf", section: "s4", x0: -pw2, x1: pw2, z0: D.acZ0, z1: D.acZ0 + 0.95, y: D.kcFloor, open: "ns", eye: 0.95 }),
  region({ id: "ac", section: "s4", x0: -D.acW / 2, x1: D.acW / 2, z0: D.acZ0 + 0.95, z1: D.acZ1, y: D.kcFloor, open: "s" }),
  region({ id: "p2", section: "s4", x0: -pw2, x1: pw2, z0: D.p2Z0, z1: D.p2Z1, y: D.kcFloor, open: "ns", eye: 0.92 }),
  region({ id: "kc", section: "s4", x0: D.kcX0, x1: D.kcX1, z0: D.kcZ0, z1: D.kcZ1, y: D.kcFloor, holes: [[D.cofferX - D.coffer.W / 2 - 0.3, D.cofferX + D.coffer.W / 2 + 0.3, D.cofferZ - D.coffer.L / 2 - 0.3, D.cofferZ + D.coffer.L / 2 + 0.3]] }),
  // s5: the horizontal passage, the step, the Queen's Chamber and its niche
  region({ id: "hp1", section: "s5", x0: -pw2, x1: pw2, z0: D.hpZ0, z1: D.hpStepZ - 0.25, y: D.hpY, open: "ns", eye: 0.98 }),
  region({ id: "hp-step", section: "s5", x0: -pw2, x1: pw2, z0: D.hpStepZ - 0.35, z1: D.hpStepZ + 0.35, y: D.hpY, y1: D.qcFloor, open: "ns", eye: 1.2 }),
  region({ id: "hp2", section: "s5", x0: -pw2, x1: pw2, z0: D.hpStepZ + 0.25, z1: D.qcZ0, y: D.qcFloor, open: "ns", eye: 1.4 }),
  region({ id: "qc", section: "s5", x0: D.qcX0, x1: D.qcX1, z0: D.qcZ0, z1: D.qcZ1, y: D.qcFloor, holes: [[-4.0, -2.8, D.qcZ0 - 1, D.qcZ0 + 1.25]] }),
  region({ id: "niche", section: "s5", x0: D.qcX1, x1: D.qcX1 + D.niche.depth, z0: nicheZ - D.niche.base / 2, z1: nicheZ + D.niche.base / 2, y: D.qcFloor, open: "w", inset: 0.2 })
];

// ---------------------------------------------------------------- the walking route (Walk on / Walk back); stops pause it
const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),            // the doorway (a portal to the ledge)
  P(0.4, -109.7, D.entY, true, S_),
  P(0, D.entZ - 0.6, D.entY),
  P(0, -94, D.descFloor(-94), true),
  P(0, D.rtZ0, D.rtY0, true),
  P(D.rtX, D.rtZ0, D.rtY0),
  P(D.rtX, D.rtZ1, D.rtY1),
  P(0, D.rtZ1, D.rtY1, true),
  P(0, -57, D.ascFloor(-57), true),
  P(0, D.ggZ0 + 0.45, D.ggY0, true),
  P(-0.78, stairZ0 + 0.2, D.ggY0 + 0.1),
  P(-0.78, stairZ1, walk(stairZ1)),
  P(0, stairZ1 + 0.2, walk(stairZ1 + 0.2)),
  P(0, -21, walk(-21), true),
  P(0, D.ggZ1 - 1.4, walk(D.ggZ1 - 1.4)),
  P(0, D.ggZ1 + 0.9, D.kcFloor, true),
  P(0, D.p1Z0 + 0.6, D.kcFloor),
  P(0, D.acZ0 + 1.8, D.kcFloor, true),
  P(0, D.p2Z0 + 1.2, D.kcFloor),
  P(0, D.kcZ0 + 0.8, D.kcFloor),
  P(-3.8, D.cofferZ, D.kcFloor, true),
  P(-7.1, D.cofferZ - 1.6, D.kcFloor, true),
  // back down to the foot of the gallery and on to the Queen's Chamber
  P(-3.8, D.cofferZ, D.kcFloor),
  P(0, D.kcZ0 + 0.8, D.kcFloor),
  P(0, D.p2Z0 + 1.2, D.kcFloor),
  P(0, D.acZ0 + 1.8, D.kcFloor),
  P(0, D.p1Z0 + 0.6, D.kcFloor),
  P(0, D.ggZ1 + 0.4, D.kcFloor),
  P(0, D.ggZ1 - 1.4, walk(D.ggZ1 - 1.4)),
  P(0, stairZ1 + 0.2, walk(stairZ1 + 0.2)),
  P(-0.78, stairZ1, walk(stairZ1)),
  P(-0.78, stairZ0 + 0.2, D.ggY0 + 0.1),
  P(0, D.ggZ0 + 0.45, D.ggY0, true),
  P(0, -20, D.hpY, true),
  P(0, D.hpStepZ - 0.5, D.hpY),
  P(0, D.hpStepZ + 0.6, D.qcFloor),
  P(0, D.qcZ0 + 0.7, D.qcFloor),
  P(-1.9, -0.4, D.qcFloor, true),
  P(-0.6, nicheZ, D.qcFloor, true)
];

// ---------------------------------------------------------------- a cross-section of the pyramid (our own drawing, to scale)
function sectionSVG() {
  const W = 320, H = 230, base = 230.33, peak = 146.6, sx = W / (base + 20), sy = sx, ox = W / 2, oy = H - 40;
  const X = (z) => (ox + z * sx).toFixed(1), Y = (y) => (oy - y * sy).toFixed(1);
  const L = (pts, cls) => `<polyline class="${cls}" points="${pts.map(([z, y]) => X(z) + "," + Y(y)).join(" ")}"/>`;
  const subZ = D.entZ + (D.entY + 30) / D.descTan;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Cross-section of the Great Pyramid from north (left) to south (right), showing the passages and chambers">` +
    `<style>.o{fill:none;stroke:#9c8a68;stroke-width:1}.p{fill:none;stroke:#e7c680;stroke-width:1.6}.d{fill:none;stroke:#c79a54;stroke-width:1;stroke-dasharray:3 3}.t{fill:#cdbb96;font:9px Georgia,serif}.r{fill:#e7c680}</style>` +
    `<polygon class="o" points="${X(-base / 2)},${Y(0)} ${X(0)},${Y(peak)} ${X(base / 2)},${Y(0)}"/>` +
    `<line class="o" x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}"/>` +
    L([[D.entZ, D.entY], [D.ascZ0, D.junY]], "p") + L([[D.ascZ0, D.junY], [subZ, -30], [subZ + 9, -30]], "d") +
    L([[D.ascZ0, D.ascY0], [D.ggZ0, D.ggY0]], "p") + L([[D.ggZ0, D.ggY0], [D.ggZ1, D.ggY1]], "p") + L([[D.ggZ0, D.ggY0 + D.ggH * 0.6], [D.ggZ1, D.ggY1 + D.ggH * 0.6]], "o") +
    L([[D.ggZ0, D.hpY], [D.qcZ0, D.hpY]], "p") +
    `<rect class="r" x="${X(D.qcZ0)}" y="${Y(D.qcFloor + D.qcRidge)}" width="${(D.qcNS * sx).toFixed(1)}" height="${(D.qcRidge * sy).toFixed(1)}"/>` +
    L([[D.ggZ1, D.kcFloor], [D.kcZ0, D.kcFloor]], "p") +
    `<rect class="r" x="${X(D.kcZ0)}" y="${Y(D.kcFloor + D.kcH)}" width="${(D.kcNS * sx).toFixed(1)}" height="${(D.kcH * sy).toFixed(1)}"/>` +
    `<rect class="d" x="${X(-30)}" y="${Y(D.ggY1 + 14)}" width="${(30 * sx).toFixed(1)}" height="${(7 * sy).toFixed(1)}"/>` +
    `<text class="t" x="${X(-112)}" y="${Y(28)}">entrance</text><text class="t" x="${X(4)}" y="${Y(D.kcFloor + 9)}">King's Ch.</text>` +
    `<text class="t" x="${X(4)}" y="${Y(D.qcFloor - 6)}">Queen's Ch.</text><text class="t" x="${X(-60)}" y="${Y(D.ggY1 + 26)}">Big Void (approx.)</text>` +
    `<text class="t" x="${X(-40)}" y="${Y(-38)}">to the unfinished chamber in the rock</text><text class="t" x="4" y="12">North</text><text class="t" x="${W - 30}" y="12">South</text></svg>`;
}

// ---------------------------------------------------------------- info points (positions: x, y, z)
const info = [
  // ---- vestibule
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you enter", title: "The Great Pyramid of Khufu", diagram: sectionSVG(),
    html: "<p>Built for the king Khufu of the Fourth Dynasty, around 2560 BCE, at Giza on the edge of the Nile valley. It was the tallest building in the world for some four thousand years. This model takes you through its five main interior spaces, in the order a visitor reaches them: the original entrance and the descending passage, the ascending passage, the Grand Gallery, the King&rsquo;s Chamber and the Queen&rsquo;s Chamber.</p><p>The sizes and slopes come from published survey measurements, chiefly Flinders Petrie&rsquo;s survey of 1880&ndash;82. The stone is drawn in code, not photographed. Where the record is uncertain, an info point says so.</p>",
    links: [L.ch02, L.ch49], sources: REF.petrie + "; " + REF.lehner + "; " + REF.ch02 + "." },
  { id: "v-v34", section: "v", pos: [V0.x - 2.6, 1.35, V0.z - 1.0], relic: { id: "v34", slug: "pyramid-texts-of-unas", title: "The Pyramid Texts of Unas", category: "Texts & Tablets", held: "In place: the Pyramid of Unas, Saqqara, Egypt", dated: "Carved c. 2350 BCE (end of the 5th Dynasty)", kind: "tablet" }, title: "The Pyramid Texts of Unas (for comparison)",
    html: "<p><strong>Not from the Great Pyramid.</strong> Khufu&rsquo;s pyramid carries no religious texts inside, only builders&rsquo; marks. About two hundred years later the burial chambers of Unas, at Saqqara, were the first to be carved with spells for the king&rsquo;s afterlife. They show what Egyptians of the pyramid age believed a royal burial should do.</p>" },
  { id: "v-v20", section: "v", pos: [V0.x - 2.6, 1.35, V0.z + 1.6], relic: { id: "v20", slug: "papyrus-of-ani", title: "The Papyrus of Ani", category: "Manuscripts & Codices", held: "British Museum, London (EA 10470)", dated: "c. 1250 BCE (19th Dynasty)", kind: "scroll" }, title: "The Papyrus of Ani (for comparison)",
    html: "<p><strong>Not from the Great Pyramid.</strong> A Book of the Dead made some 1,300 years after Khufu, for a scribe at Thebes. By then the hope of a blessed afterlife, once a royal one, had spread to anyone who could pay for the spells.</p>" },
  // ---- from Khufu's world: not from inside the pyramid
  { id: "v-names", section: "v", pos: [V0.x - 2.4, 2.55, V0.z + 4.85], cat: "The writing", title: "How Khufu's name was written", diagram: cartoucheSVG(),
    html: "<p>Egyptian kings had five names. Two matter here. The name in the oval ring, the <em>cartouche</em>, is the one we call Khufu: four signs, read from top to bottom, spelling <em>Ḫwfw</em>. A fuller form, <em>Khnum-Khufu</em>, adds the ram-headed creator god Khnum; it is usually read as a prayer, &ldquo;Khnum protects me&rdquo;. His Horus name, written in a palace-front frame below a falcon, was <em>Medjedu</em>.</p><p>&ldquo;Cheops&rdquo; is the Greek form of the name, from Herodotus. The pyramid itself was called <em>Akhet-Khufu</em>, &ldquo;Horizon of Khufu&rdquo;.</p><p>The signs on the board are our own drawing, not traced from any inscription. Inside the pyramid the name appears only as builders&rsquo; marks in red paint, in the chambers above the King&rsquo;s Chamber (see section IV).</p>",
    flags: [{ t: "Our drawing of the signs", soft: true }], links: [L.ch02], sources: REF.gardiner + "; " + REF.beckerath + "; " + REF.vyse + "." },
  { id: "v-merer", section: "v", pos: [V0.x + 2.6, 1.9, V0.z + 1.2], relic: { id: "gp-merer", title: "The logbook of Merer", category: "Papyri", held: "Egypt; parts are displayed in the Egyptian Museum, Cairo", dated: "About Khufu's 27th year (26th century BCE)", kind: "scroll", note: "A generic stand-in for a papyrus roll; its writing is illustrative marks, not Merer's script. The real logbooks survive as fragments." }, title: "The logbook of Merer (from Khufu's world)",
    html: "<p><strong>Not from inside the pyramid, but about it.</strong> In 2013 a French mission led by Pierre Tallet and Gregory Marouard found bundles of papyri at Wadi al-Jarf, an ancient harbour on the Red Sea coast. They are the oldest inscribed papyri known.</p><p>The best preserved are the logbooks of an inspector named Merer. They follow his crew of boatmen for months in about Khufu&rsquo;s 27th year, carrying blocks of fine white limestone from the quarries at Tura, across the Nile, to <em>Akhet-Khufu</em>, the pyramid. About every ten days they made two or three round trips, perhaps thirty blocks of two to three tonnes each. A harbour office at the pyramid was run under the vizier Ankhhaf.</p><p>What it shows: the pyramid was being finished, with its outer casing of Tura limestone, as an organised state project in Khufu&rsquo;s reign. What it does not show: how the blocks were raised into place. The log is about transport.</p>",
    flags: [COPY], links: [L.ch02], sources: REF.tallet + "." },
  { id: "v-statuette", section: "v", pos: [V0.x + 2.6, 1.9, V0.z + 3.0], relic: { id: "gp-statuette", build: "statuette", title: "The ivory statuette of Khufu", category: "Sculpture", held: "Egyptian Museum, Cairo (JE 36143)", dated: "Probably Khufu's reign (26th century BCE); a later date has been argued", kind: "statue", note: "A modelled rendition after published descriptions (7.5 cm high, seated, the Red Crown, a pleated kilt); not a replica. The inscriptions on the throne are not reproduced." }, title: "The ivory statuette of Khufu (from Khufu's world)",
    html: "<p><strong>Not from the pyramid.</strong> The builder of the largest pyramid is known in the round from one figure only 7.5 centimetres high. Flinders Petrie found it in 1903 in the temple of Khentiamentiu (Osiris) at Abydos, far to the south. Its head had been knocked off in the dig; Petrie had the spoil sifted for three weeks until it was found.</p><p>The king sits on a low-backed throne, wearing the Red Crown of Lower Egypt and a pleated kilt. His Horus name, Medjedu, is on the throne beside his knee, with traces of the cartouche name Khnum-Khufu on the other side.</p><p>Most Egyptologists date it to Khufu&rsquo;s own reign. Zahi Hawass has argued that it was made some two thousand years later, in the 26th Dynasty, as a votive copy of a larger statue; that view has won little support but has not been disproved.</p>",
    flags: [COPY, { t: "Date debated", soft: false }], links: [L.ch02, L.ch49],
    sources: REF.petrie1903 + "; " + REF.hawass + "." },
  { id: "v-ship", section: "v", pos: [V0.x - 2.6, 1.9, V0.z + 3.6], relic: { id: "gp-ship", build: "ship", title: "Khufu's ship, at 1:60", category: "Ships", held: "Grand Egyptian Museum, Giza (moved there in 2021)", dated: "Khufu's reign (26th century BCE)", kind: "statue", note: "A modelled rendition at 1:60 after the published dimensions (43.4 by 5.9 metres); the hull's lines, deckhouse and oars are simplified." }, title: "Khufu's ship (from Khufu's world)",
    html: "<p><strong>Found beside the pyramid, not inside it.</strong> In 1954 the archaeologist Kamal el-Mallakh found a sealed pit against the pyramid&rsquo;s south side. Inside lay a full-size ship of Lebanese cedar, taken apart into 1,224 pieces. Rebuilt over many years, it is about 43.4 metres long and 5.9 metres wide. It was moved to the Grand Egyptian Museum in 2021.</p><p>What it was for is debated. It may have carried the king&rsquo;s body to Giza, served in his lifetime, or been meant for his journey with the sun god in the afterlife (hence the popular name &ldquo;solar boat&rdquo;). The evidence does not settle it.</p>",
    flags: [COPY, { t: "Purpose debated", soft: false }], links: [L.ch02, L.ch47], sources: REF.jenkins + "; " + REF.lehner + "." },
  { id: "v-casing", section: "v", pos: [V0.x + 2.6, 1.9, V0.z - 3.6], relic: { id: "gp-casing", build: "casing", title: "A casing stone from the Great Pyramid", category: "Building stone", held: "National Museum of Scotland, Edinburgh", dated: "Khufu's reign (26th century BCE); taken to Scotland in 1872", kind: "slab", note: "A modelled rendition: fine limestone with its outer face at the pyramid's slope, 25 inches long as recorded; its height and depth are estimated." }, title: "A casing stone (from the outside of the pyramid)",
    html: "<p>The pyramid was once sheathed in polished white Tura limestone, the stone Merer&rsquo;s boats carried. Almost all of it was stripped in later centuries for building in Cairo. In the 1870s Waynman Dixon and James Grant found a casing block in rubble at the base and Dixon shipped it to Charles Piazzi Smyth in Edinburgh. It is now in the National Museum of Scotland. Egypt has questioned how it left the country.</p><p>Smyth held that its length, 25 inches, was a sacred &ldquo;pyramid inch&rdquo; cubit encoded by the builders. That idea, part of nineteenth-century &ldquo;pyramidology&rdquo;, is not supported: Petrie&rsquo;s own survey, which set out to test it, found no such unit.</p>",
    flags: [COPY, { t: "Export questioned by Egypt", soft: false }], links: [L.ch02], sources: REF.nms + "; " + REF.petrie + "." },
  { id: "v-door", section: "v", pos: [V0.x, 2.9, V0.z - 4.9], cat: "The way in", title: "To the north face of the pyramid",
    html: "<p>Walk through this doorway to arrive outside the pyramid&rsquo;s original entrance, about 17 metres up its north face. The gilded frame on the ledge brings you back here.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 2.9, V0.z + 4.9], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>Return to the Rotunda of the museum, or to the list of sites.</p>", links: [{ href: "../museum.html#ch02", label: "Back to the museum" }, { href: "../pilgrimage.html", label: "All Pilgrimage sites" }] },
  // ---- I: entrance and descending passage
  { id: "entrance", section: "s1", pos: [1.25, D.entY + 1.6, D.entZ - 1.4], cat: "I · Entrance", title: "The original entrance and its gable stones",
    html: "<p>The pyramid&rsquo;s own entrance is on the north face, about 17 metres above the base (Petrie: 668.2 inches) and about 7.3 metres east of the centre line. Over it, two tiers of huge limestone beams lean together in pairs, a gable that carries the weight of the masonry above the opening.</p><p>The smooth outer casing of fine limestone that once covered this face is gone. It was stripped in the Middle Ages, and the rough, stepped core masonry is what you see now. The entrance would once have sat in a flat, sloping face.</p>",
    flags: [{ t: "Gable sizes approximate", soft: true }], links: [L.ch02], sources: REF.petrie + "; " + REF.lehner + "." },
  { id: "lepsius", section: "s1", pos: [-1.2, D.entY + 4.15, D.entZ - 1.95], cat: "I · Entrance", title: "A Prussian birthday in hieroglyphs (1842)",
    html: "<p>On 15 October 1842, the birthday of King Friedrich Wilhelm IV of Prussia, the members of Karl Richard Lepsius&rsquo;s expedition climbed the pyramid and cut a congratulatory inscription in Egyptian hieroglyphs on one of the gable stones above the entrance, in eleven columns. It is still there.</p><p>Lepsius gave his own translation in a letter of January 1843. It begins: &ldquo;Thus speak the servants of the King, whose name is The Sun and Rock of Prussia, Lepsius the scribe, Erbkam the architect, the Brothers Weidenbach the painters, Frey the painter, Franke the molder, Bonomi the sculptor, Wild the architect&hellip;&rdquo;</p><p>It is the most visible writing on the pyramid, and the youngest: some 4,400 years later than the building.</p>",
    flags: [{ t: "Signs shown are illustrative, not the text", soft: true }, APPROX], sources: REF.lepsius + "." },
  { id: "nfc", section: "s1", pos: [0, D.entY + 4.4, D.entZ - 0.9], cat: "I · Entrance", title: "The North Face Corridor",
    toggle: { id: "nfc", on: "Show where it lies", off: "Hide its outline" },
    html: "<p>Behind the gable stones lies a corridor about 9 metres long with a cross-section of about 2 by 2 metres. It was found by muon imaging, which maps density using particles from cosmic rays. In February 2023 it was seen through a 5 mm endoscope pushed through a joint.</p><p>No one has entered it. One reading is that it, like the gables, relieves the weight over the entrance; its purpose is not known.</p>",
    flags: [{ t: "Not walkable · position approximate", soft: true }], sources: REF.sp2023 + "." },
  { id: "desc", section: "s1", pos: [0.36, D.descFloor(-94) + 1.0, -94], cat: "I · Descending Passage", title: "The descending passage",
    html: "<p>The passage runs straight down into the pyramid at 26&deg;&thinsp;31&prime; (Petrie), about 1.06 metres wide and 1.20 metres high, measured square to the floor, so you walk bent over. Its line is so straight that Petrie found it varied by only a fraction of an inch over its built length.</p><p>It carries on far beyond this point, through the bedrock, to an unfinished chamber some 30 metres below the base.</p>",
    sources: REF.petrie + "." },
  { id: "grille", section: "s1", pos: [0, D.descFloor(D.descEndZ - 0.7) + 0.75, D.descEndZ - 0.7], cat: "I · Descending Passage", title: "Down into the rock",
    html: "<p>Beyond here the descending passage continues for tens of metres down into the bedrock to the unfinished Subterranean Chamber, its floor left rough and its walls only partly cut. Whether it was abandoned when the plan changed, or meant to stay unfinished, is debated. This model stops here; the chamber is a later addition to the queue.</p>",
    flags: [{ t: "Not modelled yet", soft: true }], sources: REF.petrie + "; " + REF.lehner + "." },
  { id: "tunnel", section: "s2", pos: [D.rtX + 0.45, D.rtY0 + 1.35, (D.rtZ0 + D.rtZ1) / 2], cat: "II · Ascending Passage", title: "The robbers' tunnel",
    html: "<p>The way up is blocked by granite plugs, so visitors today go round them through a rough tunnel hacked through the masonry. Arabic writers tell that it was cut for the caliph al-Ma&rsquo;mun around 820 CE. The story is told centuries later and the attribution is uncertain.</p><p>The real tunnel is longer and more irregular than shown here, and the modern visitors&rsquo; entrance reaches it from lower down the face.</p>",
    flags: [{ t: "Layout simplified", soft: true }], sources: REF.lehner + "." },
  { id: "plugs", section: "s2", pos: [0.3, D.ascFloor(ascTop + 0.4) + 0.55, ascTop + 0.4], cat: "II · Ascending Passage", title: "The granite plugs",
    html: "<p>The lower end of the ascending passage is still sealed by three blocks of granite, wedged where the passage narrows. The usual reading is that they were slid down from the Grand Gallery after the burial, but how and when they were placed is debated.</p>",
    flags: [APPROX], sources: REF.petrie + "; " + REF.lehner + "." },
  { id: "asc", section: "s2", pos: [0.36, D.ascFloor(-57) + 1.0, -57], cat: "II · Ascending Passage", title: "The ascending passage",
    html: "<p>About 39 metres long (Petrie: 1546.8 inches), rising at about 26&deg; with the same small section as the passage below: some 1.06 metres wide and 1.20 metres high. The wooden boards with cross-slats and the hand rails are modern, put in so visitors can climb it.</p>",
    sources: REF.petrie + "." },
  // ---- III: Grand Gallery
  { id: "foot", section: "s3", pos: [0.45, D.ggY0 + 1.05, D.ggZ0 + 0.35], cat: "III · Grand Gallery", title: "Where the ways divide",
    html: "<p>At the foot of the Grand Gallery the way splits. Straight ahead, level, a low passage runs south under the gallery floor to the Queen&rsquo;s Chamber. Up the wooden steps, the gallery climbs to the King&rsquo;s Chamber. The steps and walkway are modern.</p>",
    links: [L.ch02], sources: REF.petrie + "; " + REF.lehner + "." },
  { id: "gg", section: "s3", pos: [0.72, walk(-30) + 1.8, -30], cat: "III · Grand Gallery", title: "The Grand Gallery",
    html: "<p>46 metres long on the slope (Petrie: 1815.5 inches) and 8.6 metres high (339 inches). The floor channel down the middle is about 1.07 metres wide, between two stone ramps that make the gallery about 2.08 metres wide at the floor.</p><p>Above a vertical lower wall, each of seven courses of fine limestone stands in a few inches from the one below. This corbelling closes the roof to about the width of the channel. The roof slabs are each set at the slope of the gallery.</p>",
    sources: REF.petrie + "." },
  { id: "slots", section: "s3", pos: [0.86, walk(-12) + 0.62, -12], cat: "III · Grand Gallery", title: "The slots in the ramps",
    html: "<p>Regular rectangular holes are cut along the tops of both ramps. Suggestions include sockets for timber beams that held the plugs before they were let down, or for scaffolding. None is proven.</p>",
    flags: [{ t: "Purpose debated", soft: false }], sources: REF.lehner + "." },
  { id: "bigvoid", section: "s3", pos: [0, walk(-8) + 6.8, -8], cat: "III · Grand Gallery", title: "The Big Void",
    toggle: { id: "bigvoid", on: "Show roughly where it lies", off: "Hide its outline" },
    html: "<p>In 2017 three independent muon-imaging methods detected a large empty space above the Grand Gallery, at least 30 metres long, with a cross-section like the gallery&rsquo;s. No one has seen into it. Whether it is one space or several, and whether it slopes or lies level, is not known. Its purpose is unknown too.</p><p>Claims that it holds treasure or lost knowledge are not supported. The outline drawn here is only a rough guide to where the scans put it.</p>",
    flags: [{ t: "Not walkable · shape and position uncertain", soft: true }], sources: REF.sp2017 + "." },
  // ---- IV: King's Chamber
  { id: "step", section: "s4", pos: [0.62, D.kcFloor + 0.6, D.ggZ1 + 0.6], cat: "IV · King's Chamber", title: "The Great Step",
    html: "<p>At the top of the gallery a stone step about a metre high leads to a level platform. From it, a short, low passage goes on to the antechamber.</p>", flags: [{ t: "Height approximate", soft: true }], sources: REF.petrie + "." },
  { id: "ante", section: "s4", pos: [0.55, D.kcFloor + 1.6, D.acZ0 + 1.9], cat: "IV · King's Chamber", title: "The antechamber",
    html: "<p>A small room, lined partly with granite (Petrie: 116.3 inches long, 65.2 wide, about 149.6 high). Pairs of vertical slots in its side walls held portcullis slabs that could be lowered to block the way. None of those slabs survives, so how they worked is reconstructed from the slots.</p>",
    sources: REF.petrie + "; " + REF.lehner + "." },
  { id: "leaf", section: "s4", pos: [0, D.kcFloor + 1.3, D.acZ0 + 0.18], cat: "IV · King's Chamber", title: "The granite leaf",
    html: "<p>One granite slab, in two pieces, still hangs in the first pair of slots, so visitors duck under it. A small raised knob, the &ldquo;boss&rdquo;, stands out on its north face; why it is there is not known.</p>",
    flags: [{ t: "Size approximate", soft: true }], sources: REF.petrie + "." },
  { id: "kc", section: "s4", pos: [-1.6, D.kcFloor + 2.2, D.kcZ0 + 0.55], cat: "IV · King's Chamber", title: "The King's Chamber",
    html: "<p>Built entirely of red granite brought some 800 kilometres down the Nile from Aswan: 10.47 metres east to west, 5.24 north to south, 5.84 high (Petrie: 412.25 by 206.13 by 230.05 inches), almost exactly two to one in plan. Nine granite beams form the flat ceiling.</p><p>There are no inscriptions or paintings. The walls are plain, as in every pyramid before Unas.</p>",
    links: [L.ch02, L.ch49, L.v34], sources: REF.petrie + "; " + REF.lehner + "; " + REF.ch02 + "." },
  { id: "coffer", section: "s4", pos: [D.cofferX, D.kcFloor + 1.45, D.cofferZ], cat: "IV · King's Chamber", title: "The granite sarcophagus",
    html: "<p>A lidless box cut from one block of granite, lying near the west wall. Outside it measures about 2.28 by 0.98 metres and 1.05 high; inside, 1.98 by 0.68 and 0.87 deep (Petrie: 89.62 by 38.50 by 41.31 inches outside, from some 681 separate measurements). Its lid is lost and one corner is broken away.</p><p>It was empty when the first recorded explorers reached it. No body or burial goods from it have ever been recorded. That this was Khufu&rsquo;s sarcophagus is the standard view; what became of his burial is unknown.</p>",
    links: [L.ch02, L.ch47], sources: REF.petrie + "; " + REF.lehner + "." },
  { id: "shafts", section: "s4", pos: [-2.6, D.kcFloor + 1.25, D.kcZ0 + 0.12], cat: "IV · King's Chamber", title: "The two shafts",
    html: "<p>Narrow shafts about 20 centimetres square leave the north and south walls and run up to the outer faces of the pyramid. Whether they were for air, or were paths for the king&rsquo;s spirit towards the stars (an interpretation drawn from later religious texts), is debated. Fans were fitted to them in 1993 to ventilate the chamber.</p>",
    flags: [{ t: "Purpose debated", soft: false }, APPROX], sources: REF.lehner + "." },
  { id: "relieving", section: "s4", pos: [-5.2, D.kcFloor + D.kcH - 0.45, D.cofferZ - 0.4], cat: "IV · King's Chamber", title: "Look up: five chambers above",
    html: "<p>Above this ceiling are five low &ldquo;relieving chambers&rdquo;, one over another, roofed with granite beams and topped by a gable of limestone. The lowest was found by Nathaniel Davison in 1765, the four above it by Howard Vyse in 1837. They are not open to visitors. Switch them on to see them as outlines, to the heights Vyse recorded: each only about 0.4 to 1.5 metres high, Campbell&rsquo;s, the highest, up to 2.6 metres under its gable. From this floor to the top of that gable is about 21 metres (69 feet 3 inches).</p><p>Inside, the work gangs left marks in red paint: levelling lines, and the names of their gangs, which include the king&rsquo;s names. On the ceiling of Campbell&rsquo;s chamber, towards the west end, Khufu&rsquo;s cartouche is part of a gang name usually translated &ldquo;the gang, Friends of Khufu&rdquo;; in Lady Arbuthnot&rsquo;s chamber the gangs used the fuller name Khnum-Khufu. The red marks shown on the outlines are our drawing of the cartouche, placed approximately, not a copy of the paintings.</p><p>Claims that Vyse forged these marks are not supported: some run into joints and behind blocks that could not be reached once the masonry was set, and some are upside down or cut off, as marks painted at the quarry would be.</p>",
    toggle: { id: "relieving", on: "Show the chambers above", off: "Hide the chambers above" }, diagram: cartoucheSVG({ ink: "#c0503a", color: "#c0503a" }),
    flags: [{ t: "Not walkable · heights from Vyse, layout approximate", soft: true }], sources: REF.vyse + "; " + REF.lehner + "; " + REF.gardiner + "." },
  // ---- V: Queen's Chamber
  { id: "hp", section: "s5", pos: [0.34, D.hpY + 0.85, -20], cat: "V · Queen's Chamber", title: "The horizontal passage",
    html: "<p>Level, low (about 1.17 metres) and about 38 metres long, it runs south under the floor of the Grand Gallery. Near its far end the floor drops by a step of about half a metre, so the last stretch is taller.</p>",
    flags: [{ t: "Length approximate", soft: true }], sources: REF.petrie + "; " + REF.lehner + "." },
  { id: "qc", section: "s5", pos: [-2.0, D.qcFloor + 2.3, D.qcZ0 + 0.5], cat: "V · Queen's Chamber", title: "The Queen's Chamber",
    html: "<p>The name is an Arab-era guess; no queen is known to have been buried here, and its purpose is unknown. It lies exactly on the pyramid&rsquo;s east&ndash;west axis. It measures 5.75 by 5.23 metres (Petrie: 226.47 by 205.85 inches), with walls 4.69 metres high under a gabled roof whose ridge is 6.23 metres above the floor.</p><p>The floor was left rough, unfinished. Pale salt crusts on the walls are commonly reported.</p>",
    links: [L.ch02], sources: REF.petrie + "; " + REF.lehner + "." },
  { id: "niche", section: "s5", pos: [D.qcX1 + 0.2, D.qcFloor + 2.0, nicheZ], cat: "V · Queen's Chamber", title: "The niche",
    html: "<p>A tall corbelled recess in the east wall: 1.04 metres deep and 1.57 wide at the base, narrowing in four steps to about half a metre, and roofed at 4.67 metres (Petrie: 41, 62, 20 and 184 inches). It is not centred on the wall. A statue is one suggestion for what it held; nothing was found in it. The hole at its back was dug by treasure hunters.</p>",
    flags: [{ t: "Purpose unknown", soft: false }], sources: REF.petrie + "; " + REF.lehner + "." },
  { id: "dixon", section: "s5", pos: [-3.4, D.qcFloor + 1.9, D.qcZ0 + 0.75], cat: "V · Queen's Chamber", title: "The Dixon relics: three objects from the northern shaft",
    html: "<p>In 1872 the engineer Waynman Dixon, working with James Grant for the astronomer Charles Piazzi Smyth, cut through this chamber&rsquo;s walls and found the two shafts. In the northern one lay three small objects. Smyth described them as &ldquo;a little bronze grapnel hook; a portion of cedar-like wood which might have been its handle; and a grey-granite or green-stone ball&rdquo;. The University of Aberdeen calls them the only objects ever recovered from inside the pyramid.</p><p>The ball (now identified as dolerite) and the hook went to the British Museum. The wood passed to Grant, then with his collections to the University of Aberdeen, and was lost track of for over seventy years. In 2020 the curatorial assistant Abeer Eladany found it in a cigar tin in the university&rsquo;s collections. Radiocarbon dating put the wood at 3341&ndash;3094 BCE: several centuries before Khufu&rsquo;s reign. Old wood (long-lived cedar, or reused timber) is one explanation; the gap is not settled.</p><p>What the objects were for is unknown. Smyth supposed the ball and hook were dropped down the shaft by accident while it was being built.</p>",
    flags: [COPY, { t: "Purpose unknown", soft: false }, { t: "Case placed here, copies enlarged; found inside the shaft", soft: true }],
    objects: [
      { button: "Turn over: the ball", title: "The ball (copy)", relic: { id: "gp-ball", build: "ball", title: "The ball from the northern shaft", category: "The Dixon relics", held: "British Museum, London", dated: "Found 1872", kind: "disc", note: "A modelled rendition: dolerite, about 7 centimetres across. That size is our estimate from Smyth's recorded weight (8,325 grains, about 540 grams) and the density of dolerite." }, html: "<p>A small ball of hard, dark dolerite. Smyth weighed it at 8,325 grains (about 540 grams), which for this stone means a ball about 7 centimetres across. One suggestion is that it was a builders&rsquo; tool or weight; none is proven.</p>", sources: REF.smyth + "; " + REF.bm + "." },
      { button: "Turn over: the hook", title: "The hook (copy)", relic: { id: "gp-hook", build: "hook", title: "The hook from the northern shaft", category: "The Dixon relics", held: "British Museum, London", dated: "Found 1872", kind: "spear", note: "A modelled rendition of a two-pronged copper or bronze hook; its size is estimated, as the sources reached for this model do not give it." }, html: "<p>A small two-pronged hook of copper or bronze, which Smyth called a &ldquo;grapnel&rdquo;. Its use is unknown.</p>", sources: REF.smyth + "; " + REF.bm + "." },
      { button: "Turn over: the cedar", title: "The cedar (copy)", relic: { id: "gp-cedar", build: "cedar", title: "The cedar from the northern shaft", category: "The Dixon relics", held: "University of Aberdeen", dated: "Found 1872; wood radiocarbon-dated 3341–3094 BCE", kind: "bone", note: "A modelled rendition of the piece of cedar, about 13 centimetres (five inches) long; its shape is simplified." }, html: "<p>A piece of cedar about 13 centimetres long, possibly from a measuring rod or a handle; nobody knows. Its radiocarbon date, 3341&ndash;3094 BCE, is older than the pyramid.</p>", sources: REF.abdn + "." }
    ],
    links: [L.ch02], sources: REF.smyth + "; " + REF.abdn + "; " + REF.bm + "." },
  { id: "qcshafts", section: "s5", pos: [-2.0, D.qcFloor + 1.6, D.qcZ1 - 0.1], cat: "V · Queen's Chamber", title: "The shafts and the little door",
    html: "<p>Two narrow shafts lead from this chamber&rsquo;s north and south walls. They were sealed from inside the room until Waynman Dixon cut through to them in 1872. In 1993 Rudolf Gantenbrink&rsquo;s robot, Upuaut 2, climbed the southern shaft about 60 metres and found it closed by a small limestone slab with two copper pins. Later robots looked behind it and found a small space, a second slab and marks in red ochre (the Djedi project, 2010&ndash;11). What the shafts and their &ldquo;doors&rdquo; were for is not known.</p>",
    flags: [{ t: "Purpose unknown", soft: false }, APPROX], sources: REF.lehner + "; " + REF.djedi + "." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>Measured:</strong> the size and slope of every passage and chamber you can walk, the Grand Gallery&rsquo;s section, the sarcophagus and the niche come from published survey figures, mostly Petrie&rsquo;s (1880&ndash;82).</p>" +
    "<p><strong>Approximate:</strong> exactly where each passage begins and ends, which we rebuilt from Petrie&rsquo;s lengths and angles, so the absolute positions may be off by a metre or two. Also approximate: the gable stones over the entrance, the antechamber&rsquo;s granite leaf, the robbers&rsquo; tunnel (simplified), the heights of the ramps and of the Grand Gallery&rsquo;s lower wall, the shaft openings, and which side of centre the niche lies. Where the passage enters the Queen&rsquo;s Chamber is approximate too.</p>" +
    "<p><strong>Not shown:</strong> the subterranean chamber, the relieving chambers and the inside of the shafts. These are closed to visitors and queued for later. Also not shown: the voids found by muon scans (outlines only), the crowds, the electric lighting as it really is, and every crack and repair.</p>" +
    "<p><strong>The stone</strong> is drawn in code from the stones&rsquo; known make-up: fine white limestone and red Aswan granite with feldspar, quartz and mica. It is not photographed, so it is a likeness, not a record.</p>",
  diagram: sectionSVG(), links: [L.ch02], sources: REF.petrie + "; " + REF.lehner + "; " + REF.sp2017 + "; " + REF.sp2023 + "." };

export default { title: "The Great Pyramid of Khufu", version: 3, stones: ["core", "block", "limestone", "floor", "wood", "rock", "gallery", "granite", "qc"], sections, regions, route, info, about, D, V0 };
