/* ==========================================================================
   The Qumran caves — the site: sections, walkable regions, route, info
   points and relic copies. Geometry lives in the section modules
   (s0-vestibule.js … s4-cave3.js), measurements in dims.js, the cave builder
   in ../../cave.js.

   Status: "preview" in docs/assets/pilgrimage-data.js. The page exists
   (noindex) but the site is off the menu until Carter approves it going live.
   Plan: plans/pilgrimage-sites.md, "Pilot B: the Qumran caves".
   Sources: sources/pilgrimage-qumran-caves.md.

   Conventions as in kit.js: metres; x east, y up, z south. The caves are
   placed far apart from one another (each is reached through a fade, as the
   real caves lie up to a couple of kilometres apart); distances between them
   in this model mean nothing.
   ========================================================================== */
import { region } from "../../kit.js?v=1";
import { D } from "./dims.js?v=1";

const PI = Math.PI, S_ = PI;                   // yaw PI faces south (+z), 0 faces north
export const V0 = { x: -200, z: 0 };          // the archive's own vestibule
export const C4 = D.c4, C1 = D.c1, C3 = D.c3;  // cave centres (model positions, not map positions)
export const EXIT_HREF = "../museum.html#ch10";

// ---------------------------------------------------------------- short references (full list: sources/pilgrimage-qumran-caves.md)
const REF = {
  magness: "J. Magness, <em>The Archaeology of Qumran and the Dead Sea Scrolls</em> (Grand Rapids: Eerdmans, 2002; 2nd ed. 2021)",
  djd6: "R. de Vaux and J. T. Milik, <em>Qumr&acirc;n grotte 4. II</em>, Discoveries in the Judaean Desert VI (Oxford, 1977), &ldquo;Arch&eacute;ologie&rdquo;",
  djd1: "D. Barthélemy and J. T. Milik, <em>Qumran Cave 1</em>, Discoveries in the Judaean Desert I (Oxford, 1955)",
  djd3: "M. Baillet, J. T. Milik and R. de Vaux, <em>Les &lsquo;Petites Grottes&rsquo; de Qumr&acirc;n</em>, Discoveries in the Judaean Desert III (Oxford, 1962)",
  iaa: "Israel Antiquities Authority, the Leon Levy Dead Sea Scrolls Digital Library (deadseascrolls.org.il)",
  bas4: "<em>Biblical Archaeology Society</em>, &ldquo;Caves and Contents (Cave 4)&rdquo; (biblicalarchaeology.org)",
  milik: "J. T. Milik with M. Black, <em>The Books of Enoch: Aramaic Fragments of Qumr&acirc;n Cave 4</em> (Oxford: Clarendon, 1976)",
  copper: "<em>Biblical Archaeology Review</em>, &ldquo;The Mysterious Copper Scroll&rdquo; (BAS Library); &Eacute;. Puech et al., <em>Le Rouleau de cuivre de la grotte 3 de Qumr&acirc;n (3Q15)</em> (Leiden: Brill, 2006)",
  isaiah: "Center for Online Judaic Studies, &ldquo;The Isaiah Scroll&rdquo; (cojs.org); the Israel Museum, Jerusalem, Shrine of the Book",
  cave12: "O. Gutfeld and A. Ovadia (Hebrew University) with R. Price (Liberty University), excavation of a looted cave, 2017, as reported by the Biblical Archaeology Society, &ldquo;New Dead Sea Scroll Cave&rdquo; (biblicalarchaeology.org)",
  ch10: "the archive&rsquo;s Second Temple Judaism chapter (ch10)"
};
const L = {
  ch10: { href: "../chapters/ch10.html", label: "Read the Second Temple Judaism chapter" },
  ch16: { href: "../chapters/ch16.html", label: "Early Christianity" },
  ch50: { href: "../chapters/ch50.html", label: "The End of Days" },
  v02: { href: "../vault/dead-sea-scrolls.html", label: "The Dead Sea Scrolls (Vault)" },
  v48: { href: "../vault/great-isaiah-scroll.html", label: "The Great Isaiah Scroll (Vault)" },
  v10: { href: "../vault/copper-scroll.html", label: "The Copper Scroll (Vault)" },
  v49: { href: "../vault/book-of-enoch.html", label: "The Book of Enoch (Vault)" }
};
const APPROX = { t: "Shape after published plans · sizes approximate", soft: true };
const COPY = { t: "Modelled copy, not the object", soft: true };
const CONTESTED = { t: "Contested", soft: false };

// ---------------------------------------------------------------- sections
const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: the portal back to the museum, a Vault object for comparison, and the way out to the terrace." },
  { id: "s1", name: "I · The marl terrace", short: "the terrace", module: "s1-terrace.js", box: [-80, -70, -90, 200, 90, 60], start: { x: 0, z: 4, yaw: S_, y: 0 }, blurb: "Above the wadi, looking across to the hand-cut openings of Cave 4, with the ruins of Khirbet Qumran behind and the Dead Sea below." },
  { id: "s2", name: "II · Cave 4", short: "Cave 4", module: "s2-cave4.js", box: [C4.x - 6, -1, C4.z - 6, C4.x + 10, 5, C4.z + 6], start: { x: C4.x, z: C4.z - 1.0, yaw: S_, y: 0 }, blurb: "Two chambers cut by hand into the soft marl, where more than 15,000 fragments were found." },
  { id: "s3", name: "III · Cave 1", short: "Cave 1", module: "s3-cave1.js", box: [C1.x - 6, -1, C1.z - 7, C1.x + 6, 5, C1.z + 6], start: { x: C1.x, z: C1.z - 0.6, yaw: S_, y: 0 }, blurb: "A natural cave in the limestone cliffs, where a Bedouin shepherd found the first scrolls in jars." },
  { id: "s4", name: "IV · Cave 3", short: "Cave 3", module: "s4-cave3.js", box: [C3.x - 6, -1, C3.z - 7, C3.x + 6, 5, C3.z + 6], start: { x: C3.x, z: C3.z - 0.6, yaw: S_, y: 0 }, blurb: "A partly collapsed natural cave, where the 1952 expedition found the Copper Scroll." }
];

// ---------------------------------------------------------------- where the visitor may walk
const regions = [
  // vestibule: one room, a doorway north (to the terrace) and the way back south (to the museum)
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0, holes: [[V0.x - 3.2, V0.x - 2.0, V0.z - 1.6, V0.z - 0.4]] }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  region({ id: "v-exit", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z + 4.6, z1: V0.z + 5.6, y: 0, inset: 0.05, portal: "museum", href: EXIT_HREF }),
  // the terrace, and its three ways on: down to Cave 4 (south), and the paths to Caves 1 and 3 (west)
  region({ id: "terrace", section: "s1", x0: -10, x1: 10, z0: -12, z1: 8, y: 0, outside: true }),
  region({ id: "to-c4", section: "s1", x0: -0.9, x1: 0.9, z0: 7.4, z1: 8.6, y: 0, inset: 0.05, portal: "s2", outside: true }),
  region({ id: "to-c1", section: "s1", x0: -10.6, x1: -9.4, z0: -8.9, z1: -7.1, y: 0, inset: 0.05, portal: "s3", outside: true }),
  region({ id: "to-c3", section: "s1", x0: -10.6, x1: -9.4, z0: -4.9, z1: -3.1, y: 0, inset: 0.05, portal: "s4", outside: true }),
  region({ id: "to-v", section: "s1", x0: 9.4, x1: 10.6, z0: -0.9, z1: 0.9, y: 0, inset: 0.05, portal: "v", outside: true }),
  // Cave 4: chamber 4a, the way through, chamber 4b, and the mouth back out
  region({ id: "c4a", section: "s2", x0: C4.x - D.c4a.rx + 0.5, x1: C4.x + D.c4a.rx - 0.5, z0: C4.z - D.c4a.rz + 0.5, z1: C4.z + D.c4a.rz - 0.5, y: 0, inset: 0.1, holes: [[C4.x + 1.0, C4.x + 2.2, C4.z + 0.6, C4.z + 1.8]] }),
  region({ id: "c4-through", section: "s2", x0: C4.x + D.c4a.rx - 1.0, x1: C4.x + D.c4bOff - D.c4b.rx + 1.0, z0: C4.z - 0.2, z1: C4.z + 0.9, y: 0, inset: 0.05, eye: 1.35 }),
  region({ id: "c4b", section: "s2", x0: C4.x + D.c4bOff - D.c4b.rx + 0.5, x1: C4.x + D.c4bOff + D.c4b.rx - 0.5, z0: C4.z - D.c4b.rz + 0.6, z1: C4.z + D.c4b.rz - 0.4, y: 0, inset: 0.1 }),
  region({ id: "c4-mouth", section: "s2", x0: C4.x - 0.7, x1: C4.x + 0.7, z0: C4.z - D.c4a.rz - 1.6, z1: C4.z - D.c4a.rz + 1.2, y: 0, inset: 0.05, eye: 1.3 }),
  region({ id: "c4-out", section: "s2", x0: C4.x - 0.6, x1: C4.x + 0.6, z0: C4.z - D.c4a.rz - 2.0, z1: C4.z - D.c4a.rz - 1.3, y: 0, inset: 0.05, portal: "s1" }),
  // Cave 1: the low crawl in, the chamber, and the way back out
  region({ id: "c1", section: "s3", x0: C1.x - D.c1r.rx + 0.5, x1: C1.x + D.c1r.rx - 0.5, z0: C1.z - D.c1r.rz + 0.5, z1: C1.z + D.c1r.rz - 0.5, y: 0, inset: 0.1, holes: [[C1.x - 1.7, C1.x - 0.5, C1.z + 0.2, C1.z + 1.4], [C1.x + 0.6, C1.x + 1.8, C1.z + 0.2, C1.z + 1.4]] }),
  region({ id: "c1-crawl", section: "s3", x0: C1.x - 0.45, x1: C1.x + 0.45, z0: C1.z - D.c1r.rz - D.crawl, z1: C1.z - D.c1r.rz + 1.2, y: 0, inset: 0.05, eye: 0.82 }),
  region({ id: "c1-out", section: "s3", x0: C1.x - 0.45, x1: C1.x + 0.45, z0: C1.z - D.c1r.rz - D.crawl - 0.5, z1: C1.z - D.c1r.rz - D.crawl + 0.3, y: 0, inset: 0.05, portal: "s1" }),
  // Cave 3: the chamber among the fallen rock, and the way out
  region({ id: "c3", section: "s4", x0: C3.x - D.c3r.rx + 0.7, x1: C3.x + D.c3r.rx - 0.7, z0: C3.z - D.c3r.rz + 0.5, z1: C3.z + D.c3r.rz - 0.9, y: 0, inset: 0.1, eye: 1.45, holes: [[C3.x + 0.4, C3.x + 1.6, C3.z + 0.1, C3.z + 1.3]] }),
  region({ id: "c3-mouth", section: "s4", x0: C3.x - 0.6, x1: C3.x + 0.6, z0: C3.z - D.c3r.rz - 1.2, z1: C3.z - D.c3r.rz + 1.2, y: 0, inset: 0.05, eye: 1.25 }),
  region({ id: "c3-out", section: "s4", x0: C3.x - 0.5, x1: C3.x + 0.5, z0: C3.z - D.c3r.rz - 1.6, z1: C3.z - D.c3r.rz - 0.9, y: 0, inset: 0.05, portal: "s1" })
];
for (const r of regions) r.surface = r.section === "v" ? "wood" : "rock";

// ---------------------------------------------------------------- the walking route (Walk on / Walk back)
const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),                      // the doorway, out to the terrace
  P(0, 4, 0, true, S_),
  P(4, -6, 0, true, PI * 0.25),
  P(-3, -9, 0, true, -PI * 0.75),
  P(0, 8.0, 0, true),                                 // down to Cave 4
  P(C4.x, C4.z - 1.0, 0, true, S_),
  P(C4.x - 1.0, C4.z + 0.6, 0, true, S_),
  P(C4.x + D.c4bOff, C4.z + 0.6, 0, true, PI / 2),
  P(C4.x, C4.z - D.c4a.rz - 1.6, 0, true),            // out again
  P(-10, -8, 0, true),                                // the path to Cave 1
  P(C1.x, C1.z - 0.6, 0, true, S_),
  P(C1.x, C1.z + 0.1, 0, true, S_),
  P(C1.x, C1.z - D.c1r.rz - D.crawl - 0.1, 0, true),
  P(-10, -4, 0, true),                                // the path to Cave 3
  P(C3.x, C3.z - 0.6, 0, true, S_),
  P(C3.x - 0.6, C3.z + 0.3, 0, true, S_)
];

// ---------------------------------------------------------------- info points
const info = [
  // ---- vestibule (the archive's own room)
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you go out", title: "The Qumran caves",
    html: "<p>Between 1947 and 1956, Bedouin and archaeologists found the remains of some nine hundred manuscripts in eleven caves around Khirbet Qumran, on the north-western shore of the Dead Sea. They are the Dead Sea Scrolls: the oldest surviving manuscripts of the Hebrew Bible, alongside texts of a sect and many other Jewish writings of the last centuries BCE and the first century CE.</p><p>This walk takes you to three of the caves: <strong>Cave 4</strong>, cut by hand into the marl terrace close to the ruins; <strong>Cave 1</strong>, where the first scrolls were found; and <strong>Cave 3</strong>, where the Copper Scroll lay. The caves are modelled from published descriptions and plans, at approximate size; the rock is drawn in code, not photographed.</p>",
    links: [L.ch10, L.v02], sources: REF.magness + "; " + REF.iaa + "; " + REF.ch10 + "." },
  { id: "v-v49", section: "v", pos: [V0.x - 2.6, 1.35, V0.z - 1.0], relic: { id: "v49", slug: "book-of-enoch", title: "The Book of Enoch", category: "Manuscripts & Codices", held: "Complete in Ge'ez manuscripts; Aramaic fragments from Qumran Cave 4", dated: "Written 3rd century BCE – 1st century CE", kind: "codex" }, title: "The Book of Enoch, in Ge'ez (for comparison)",
    html: "<p><strong>Not from Qumran.</strong> The only complete text of the Book of Enoch is in Ge&rsquo;ez, the old church language of Ethiopia, where it is part of the Bible of the Ethiopian Orthodox Church. At Qumran it survives only as Aramaic fragments; in Cave 4 you will see what those look like.</p>" },
  { id: "v-door", section: "v", pos: [V0.x, 3.45, V0.z - 4.4], cat: "The way out", title: "To the terrace above Wadi Qumran",
    html: "<p>Walk into the golden portal to step out onto the marl terrace beside the ruins.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 3.45, V0.z + 4.4], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>This portal returns you to the museum, to the room of Second Temple Judaism.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] },
  // ---- I: the terrace
  { id: "terrace", section: "s1", pos: [2.0, 1.6, 6.4], cat: "I · The terrace", title: "The caves in the marl",
    html: "<p>Below the cliffs, the ruins stand on a terrace of soft, pale marl, laid down by an ancient lake and cut through by the Wadi Qumran. Across the gully, in the end of the terrace, are the man-made openings of <strong>Cave 4</strong>. Caves 5 and 10 are cut into the same marl nearby; Caves 7, 8 and 9 into the terrace&rsquo;s edge. Caves 1, 2, 3 and 11 are natural caves higher in the limestone cliffs to the north.</p><p>The caves are numbered in the order they were found. Cave 4 was found by Bedouin in August 1952 and excavated by Roland de Vaux, Gerald Lankester Harding and J&oacute;zef Milik from 22 to 29 September 1952.</p>",
    flags: [APPROX], links: [L.ch10], sources: REF.magness + "; " + REF.bas4 + "; " + REF.djd6 + "." },
  { id: "khirbet", section: "s1", pos: [7.0, 1.6, -9.0], cat: "I · The terrace", title: "Khirbet Qumran: who lived here?",
    html: "<p>The ruins behind you were excavated by Roland de Vaux between 1951 and 1956. He read them as the centre of a Jewish sect, identified with the <strong>Essenes</strong> described by Josephus, Philo and Pliny the Elder, who wrote or copied many of the scrolls and hid them in the caves when the Romans came in 68 CE.</p><p>That reading is still the majority view, but every part of it is contested. Other archaeologists have read the site as a villa, a fort, a pottery workshop or a trading post, and some scholars hold that the scrolls were brought from Jerusalem and hidden here, with no link to the people who lived on the terrace. Whether the caves were a library, a store for worn-out texts (a <em>genizah</em>), or emergency hiding places is debated too.</p>",
    flags: [CONTESTED, { t: "Ruins shown in outline only", soft: true }], links: [L.ch10, L.ch16], sources: REF.magness + "; " + REF.ch10 + "." },
  { id: "where", section: "s1", pos: [-4.0, 1.6, -11.2], cat: "I · The terrace", title: "Where the scrolls are now",
    html: "<p>Qumran lies in the West Bank. Most of the scrolls are held in Jerusalem, by the Israel Antiquities Authority and the Israel Museum (the Shrine of the Book). The Copper Scroll and other fragments are in the Jordan Museum in Amman. Their ownership is disputed between Israel, Jordan and the Palestinian Authority. This note says where each object is held and takes no side on who owns it.</p>",
    flags: [CONTESTED], links: [L.v02], sources: REF.iaa + "; " + REF.copper + "; " + REF.magness + "." },
  { id: "looted", section: "s1", pos: [-9.4, 1.6, -6.0], cat: "I · The terrace", title: "The paths to Caves 1 and 3, and a twelfth cave",
    html: "<p>Caves 1 and 3 lie in the cliffs to the north, a walk of a kilometre or more; here the two paths are portals. Treasure-hunting did not stop in the 1950s. In 2017 a Hebrew University team found a cave in the cliffs whose jars had been broken and emptied by looters, with a 1950s pickaxe head left in the tunnel. It was announced as a twelfth scroll cave, but no inscribed scroll was found, only a blank piece of parchment, so it is catalogued as &ldquo;Q12&rdquo;, and some scholars call the claim informed speculation.</p>",
    flags: [{ t: "Distances not to scale", soft: true }], sources: REF.cave12 + "; " + REF.magness + "." },
  // ---- II: Cave 4
  { id: "cave4", section: "s2", pos: [C4.x - 1.8, 1.6, C4.z - 1.2], cat: "II · Cave 4", title: "Cave 4",
    html: "<p>Cave 4 is not a natural cave. It was hollowed out by hand from the marl, in two chambers known as 4a and 4b. It held the largest find of all: more than 15,000 fragments from some five hundred manuscripts, almost all reduced to scraps. Much of the cave had already been dug out by Bedouin before the archaeologists arrived, and the fragments they took were bought back through an antiquities dealer in Bethlehem.</p><p>Sorting and publishing the Cave 4 fragments took a team of scholars more than forty years.</p>",
    flags: [APPROX], links: [L.ch10, L.v02], sources: REF.djd6 + "; " + REF.bas4 + "; " + REF.magness + "." },
  { id: "holes", section: "s2", pos: [C4.x + 0.2, 1.4, C4.z + D.c4a.rz - 0.5], cat: "II · Cave 4", title: "The holes in the walls",
    html: "<p>Rows of holes run along the walls of chamber 4a. One reading is that they held the pegs of wooden shelves, which would make the cave a storeroom or library for scrolls. Others think they belong to a different use of the cave altogether. Nothing of any shelf survives.</p>",
    flags: [CONTESTED, { t: "Number and spacing of holes approximate", soft: true }], sources: REF.djd6 + "; " + REF.magness + "." },
  { id: "c4-enoch", section: "s2", pos: [C4.x + 1.6, 1.35, C4.z + 1.2], relic: { id: "qm-enoch", build: "enochFragments", title: "Aramaic fragments of the Book of Enoch", category: "Manuscript fragments", held: "Israel Antiquities Authority, Jerusalem (4Q201–4Q212)", dated: "Copies from about 200 BCE onward (palaeography)", kind: "tablet", note: "A modelled rendition of a scatter of parchment fragments; the writing is illustrative marks, not the Aramaic text." }, title: "Enoch in Aramaic (Cave 4)",
    html: "<p>Among the Cave 4 fragments are pieces of at least eleven copies of the books of Enoch in their original Aramaic (numbered 4Q201&ndash;4Q212), with fragments of the related Book of Giants. J&oacute;zef Milik published them in 1976. They are the earliest surviving witnesses to these writings, centuries older than the complete Ge&rsquo;ez text in the vestibule.</p>",
    flags: [COPY], links: [L.v49, L.ch50], sources: REF.milik + "; " + REF.iaa + "." },
  { id: "c4b", section: "s2", pos: [C4.x + D.c4bOff + 0.6, 1.5, C4.z - 0.8], cat: "II · Cave 4", title: "Chamber 4b",
    html: "<p>The smaller inner chamber. Fragments from the two chambers were mixed when they were bought back from the Bedouin, so it is usually impossible to say which manuscript lay in which room.</p>",
    flags: [APPROX], sources: REF.djd6 + "; " + REF.magness + "." },
  // ---- III: Cave 1
  { id: "cave1", section: "s3", pos: [C1.x - 1.4, 1.5, C1.z - 1.2], cat: "III · Cave 1", title: "Cave 1: where it began",
    html: "<p>In the winter of 1946&ndash;47 a young Ta&rsquo;amireh Bedouin, Muhammed edh-Dhib, threw a stone into this cave while looking for a stray goat and heard pottery break. Inside were tall jars, some holding scrolls wrapped in linen. Seven scrolls came out of the cave, among them the Great Isaiah Scroll, the Community Rule and the War Scroll. The cave was excavated in 1949, when hundreds more fragments were found.</p><p>Accounts of the discovery differ in their details; the version here is the one most often told.</p>",
    flags: [APPROX, { t: "Accounts differ", soft: true }], links: [L.ch10, L.v02], sources: REF.djd1 + "; " + REF.magness + "; " + REF.iaa + "." },
  { id: "c1-jar", section: "s3", pos: [C1.x - 1.1, 1.35, C1.z + 0.8], relic: { id: "v02", slug: "dead-sea-scrolls", title: "The Dead Sea Scrolls", category: "Manuscripts & Codices", held: "Israel Antiquities Authority & The Israel Museum, Jerusalem", dated: "c. 3rd century BCE – 1st century CE", kind: "jar" }, title: "A scroll jar, and a scroll",
    html: "<p>Tall cylindrical jars with bowl-shaped lids are the pottery most typical of Qumran; jars like these held some of the Cave 1 scrolls. The same type was made in the settlement&rsquo;s own workshop, one of the links between the caves and the ruins.</p>",
    links: [L.v02, L.ch10], sources: REF.magness + "; " + REF.djd1 + "." },
  { id: "c1-isaiah", section: "s3", pos: [C1.x + 1.2, 1.35, C1.z + 0.8], relic: { id: "v48", slug: "great-isaiah-scroll", title: "The Great Isaiah Scroll", category: "Manuscripts & Codices", held: "The Israel Museum, Jerusalem (Shrine of the Book), 1QIsaᵃ", dated: "c. 150–100 BCE (palaeography)", kind: "scroll" }, title: "The Great Isaiah Scroll (Cave 1)",
    html: "<p>Found in this cave: the whole book of Isaiah on seventeen sheets of parchment sewn together, 54 columns and about 7.3 metres long. It is the only complete biblical book among the scrolls, about a thousand years older than the medieval manuscripts on which printed Hebrew Bibles were based, and its text is close to theirs, with many small differences of spelling and wording.</p>",
    links: [L.v48, L.ch10], sources: REF.isaiah + "; " + REF.djd1 + "." },
  // ---- IV: Cave 3
  { id: "cave3", section: "s4", pos: [C3.x - 1.3, 1.4, C3.z - 1.0], cat: "IV · Cave 3", title: "Cave 3",
    html: "<p>Part of the roof of this natural cave had fallen in. Archaeologists surveying the cliffs found it in March 1952, the first scroll cave found by the expedition rather than by the Bedouin. Under the fallen rock, at the back, lay two rolls of copper, set apart from the leather fragments and the broken jars.</p>",
    flags: [APPROX], links: [L.v10], sources: REF.djd3 + "; " + REF.copper + "." },
  { id: "c3-copper", section: "s4", pos: [C3.x + 1.0, 1.35, C3.z + 0.7], relic: { id: "v10", slug: "copper-scroll", title: "The Copper Scroll", category: "Texts & Tablets", held: "The Jordan Museum, Amman", dated: "1st century CE (debated); found 1952, Qumran Cave 3", kind: "scroll" }, title: "The Copper Scroll (Cave 3)",
    html: "<p>The metal was too brittle to unroll, so in 1955&ndash;56 it was sawn into 23 curved strips at the Manchester College of Technology. Its text is a list of some sixty hiding places of gold, silver and sacred vessels. Whether the treasure was real, and whose it was (the Jerusalem Temple&rsquo;s is one suggestion), is debated; none of it has been found.</p>",
    flags: [CONTESTED], links: [L.v10, L.ch10], sources: REF.copper + "." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>From published descriptions:</strong> which caves are natural and which are cut into the marl, the two chambers of Cave 4 and the rows of holes in its walls, the low entrance of Cave 1, and the fallen roof of Cave 3, after the excavation reports (Discoveries in the Judaean Desert I, III and VI) and Magness&rsquo;s synthesis.</p>" +
    "<p><strong>Approximate:</strong> every size. The caves are modelled at roughly their published proportions, but their exact outlines, the number and spacing of the holes, and the shape of the fallen rock are our estimates. The terrace, the cliffs, the ruins and the sea are a low-detail backdrop, and the distances between the caves are not to scale.</p>" +
    "<p><strong>Not shown:</strong> Caves 2 and 5 to 11, the inside of the settlement, the modern paths and fences, and the people. The objects in the caves are renditions, placed where their kind was found; the real objects are in Jerusalem and Amman.</p>",
  links: [L.ch10, L.v02], sources: REF.djd1 + "; " + REF.djd3 + "; " + REF.djd6 + "; " + REF.magness + "." };

export default { title: "The Qumran caves", version: 1, stones: ["rock", "core", "block", "wood"], sections, regions, route, info, about, D, V0 };
