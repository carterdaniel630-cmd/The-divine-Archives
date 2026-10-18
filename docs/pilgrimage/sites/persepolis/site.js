/* ==========================================================================
   Persepolis — the site: sections, walkable regions, route, info points.
   Geometry lives in the section modules (s0-vestibule.js … s3-hall.js),
   measurements in dims.js, the place of each column in layout.js, the
   reliefs in art.js.

   Status: "preview" in docs/assets/pilgrimage-data.js. The page exists
   (noindex) but the site is off the menu until Carter approves it going live.
   Plan: plans/pilgrimage-sites.md. Sources: sources/pilgrimage-persepolis.md.

   Frame (see dims.js): metres; x east, y up, z south; the plain is y = 0,
   the terrace y = 12, the Apadana's podium y = 15. The ruins are shown as
   they stand today, simplified; where each building stands is APPROX.
   ========================================================================== */
import { region } from "../../kit.js?v=1";
import { D } from "./dims.js?v=1";
import { apadanaCols, gateCols, gateJambs, jambBox, hole } from "./layout.js?v=1";

const PI = Math.PI, E_ = -PI / 2, W_ = PI / 2;   // yaw 0 faces north (-z); -PI/2 faces east; PI/2 faces west
export const V0 = { x: -420, z: 0 };           // the archive's own vestibule (beyond the plain, out of the terrace's box)
export const EXIT_HREF = "../museum.html#ch49";
const T = D.T, S = D.st, A = D.ap, G = D.gate, AY = A.y;

// ---------------------------------------------------------------- short references (full list: sources/pilgrimage-persepolis.md)
const REF = {
  ir: "A. Sh. Shahbazi, &ldquo;Persepolis&rdquo;, <em>Encyclopaedia Iranica</em> (online, 2009, updated 2016)",
  unesco: "UNESCO World Heritage Centre, &ldquo;Persepolis&rdquo; (site 114, inscribed 1979)",
  whe: "J. J. Mark, &ldquo;Persepolis&rdquo;, <em>World History Encyclopedia</em> (2019, updated 2022)",
  livG: "J. Lendering, Livius.org, &ldquo;Persepolis, Gate of All Nations&rdquo;",
  livX: "Livius.org, &ldquo;XPa&rdquo; (the inscription of Xerxes on the Gate of All Nations), translation",
  isac: "Institute for the Study of Ancient Cultures, University of Chicago, &ldquo;Persepolis Fortification Archive&rdquo;",
  henk: "W. F. M. Henkelman, <em>The Other Gods Who Are: Studies in Elamite-Iranian Acculturation Based on the Persepolis Fortification Texts</em>, Achaemenid History 14 (Leuven: Peeters, 2008)",
  tan: "M. Lufkin, &ldquo;Terror victims cannot seize Iranian antiquities, US Supreme Court rules&rdquo;, <em>The Art Newspaper</em> (22 February 2018)",
  si: "Smithsonian Freer|Sackler Archives blog, &ldquo;A Colorful Past&rdquo; (10 July 2012), on A. Nagel&rsquo;s work at Persepolis",
  nagel: "A. Nagel, <em>Color and Meaning in the Art of Achaemenid Persia</em> (Cambridge University Press)",
  ch06: "the archive&rsquo;s chapter on Zoroastrianism (ch06)",
  ch49: "the archive&rsquo;s Axial Age chapter (ch49)"
};
const L = {
  ch06: { href: "../chapters/ch06.html", label: "Read the Zoroastrianism chapter" },
  ch49: { href: "../chapters/ch49.html", label: "The Axial Age" },
  v35: { href: "../vault/cyrus-cylinder.html", label: "The Cyrus Cylinder (Vault)" },
  v54: { href: "../vault/behistun-inscription.html", label: "The Behistun Inscription (Vault)" }
};
const APPROX = { t: "Layout after published descriptions · positions approximate", soft: true };
const RUIN = { t: "Shown as it stands today, simplified", soft: true };
const RENDER = { t: "Reliefs: our own rendering, simplified", soft: true };
const CONTESTED = { t: "Contested", soft: false };
const BELIEF = { t: "A royal claim, in the king's words", soft: true };
const DIFFER = { t: "Sources differ", soft: false };

// ---------------------------------------------------------------- sections (one big box: the terrace is open ground, all of it in view at once)
const BIG = [-320, -5, -300, 240, 70, 280];
const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: the portal back to the museum, a Vault object for comparison, and the way out onto the plain of Marvdasht." },
  { id: "s1", name: "I · The stairway and the Gate", short: "the Gate", module: "s1-gate.js", box: BIG, start: { x: -175, z: S.cz, yaw: E_, y: 0 }, blurb: "Climb the Great Stairway onto the terrace and pass between the guardian bulls of Xerxes' Gate of All Nations." },
  { id: "s2", name: "II · The Apadana stairs", short: "the Apadana stairs", module: "s2-stairs.js", box: BIG, start: { x: A.sx + A.stairD + 26, z: -13, yaw: W_, y: T }, blurb: "The east staircase of the great audience hall, carved with guards, nobles and the gift-bearers of twenty-three nations." },
  { id: "s3", name: "III · The Apadana", short: "the Apadana", module: "s3-hall.js", box: BIG, start: { x: 0, z: 22, yaw: 0, y: AY }, blurb: "Among the columns of the audience hall, nearly twenty metres tall, and the view over the terrace to the royal tombs in the hill." }
];

// ---------------------------------------------------------------- where the visitor may walk
const cz = S.cz, b = S.bay, zLow0 = cz - b - S.lowLen, zLand0 = zLow0 - S.w, zUp1 = zLow0 + S.upLen;
const aps = apadanaCols(), gc = gateCols(), gj = gateJambs();
const xs0 = A.sx, xs1 = A.sx + A.stairD, fl0 = 0.6, fl1 = fl0 + S.w;   // the Apadana stair block, and its flights' x range from xs0
const regions = [
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0, holes: [[V0.x - 3.2, V0.x - 2.0, V0.z - 1.6, V0.z - 0.4]] }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  region({ id: "v-exit", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z + 4.6, z1: V0.z + 5.6, y: 0, inset: 0.05, portal: "museum", href: EXIT_HREF }),
  // the plain before the terrace wall, and the way back to the Vestibule at its west end
  region({ id: "plain", section: "s1", x0: -270, x1: S.xLow0, z0: -250, z1: 40, y: 0, outside: true }),
  region({ id: "to-v", section: "s1", x0: -271.2, x1: -269.8, z0: cz - 0.8, z1: cz + 0.8, y: 0, inset: 0.05, portal: "v", outside: true }),
  // the Great Stairway (its northern half): the bay at the foot, the lower flight, the landing, the upper flight, the top
  region({ id: "bay", section: "s1", x0: S.xLow0, x1: S.xUp0, z0: cz - b, z1: cz + b, y: 0, open: "wn", outside: true }),
  region({ id: "low", section: "s1", x0: S.xLow0, x1: S.xUp0, z0: zLow0, z1: cz - b, y: S.yLand, y1: 0, open: "ns", outside: true }),
  region({ id: "land", section: "s1", x0: S.xLow0, x1: S.wall, z0: zLand0, z1: zLow0, y: S.yLand, open: "s", outside: true }),
  region({ id: "up", section: "s1", x0: S.xUp0, x1: S.wall, z0: zLow0, z1: zUp1, y: S.yLand, y1: T, open: "ns", outside: true }),
  region({ id: "top", section: "s1", x0: S.xUp0, x1: S.wall + 1, z0: zUp1, z1: 2 * cz - zUp1, y: T, open: "n", outside: true }),
  // the terrace, round the ruins
  region({ id: "terrace", section: "s1", x0: D.terr.x0, x1: D.terr.x1, z0: D.terr.z0, z1: D.terr.z1, y: T, outside: true,
    holes: [[-A.out - 0.3, A.out + 0.3, -A.out - 0.3, A.out + 0.3], [xs0, xs1 + 0.3, -A.stairLen / 2 + 1, A.stairLen / 2 - 1],
      [D.hc.x - D.hc.half, D.hc.x + D.hc.half, D.hc.z - D.hc.half, D.hc.z + D.hc.half], [D.ta.x - D.ta.hx, D.ta.x + D.ta.hx, D.ta.z - D.ta.hz, D.ta.z + D.ta.hz],
      [D.tr.x - D.tr.hx, D.tr.x + D.tr.hx, D.tr.z - D.tr.hz, D.tr.z + D.tr.hz]].concat(gj.map(jambBox), gc.map((c) => hole(c, 1.3))) }),
  // the Apadana's east staircase: the north flight up from the court, and the top behind the carved front
  region({ id: "ap-flight", section: "s2", x0: xs0 + fl0, x1: xs0 + fl1, z0: -A.stairLen / 2, z1: -A.stairLen / 2 + A.fl, y: T, y1: AY, open: "ns", outside: true }),
  region({ id: "ap-top", section: "s2", x0: xs0 - 0.5, x1: xs0 + fl1, z0: -A.stairLen / 2 + A.fl, z1: A.stairLen / 2 - A.fl, y: AY, open: "nw", outside: true }),
  // the podium of the Apadana, among the columns
  region({ id: "podium", section: "s3", x0: -A.out, x1: A.out, z0: -A.out, z1: A.out, y: AY, open: "e", outside: true,
    holes: aps.map((c) => hole(c, 1.35)).concat([[-A.out, -A.half, -A.out, -A.half], [A.half, A.out, -A.out, -A.half], [-A.out, -A.half, A.half, A.out], [A.half, A.out, A.half, A.out]]) })
];
for (const r of regions) r.surface = r.section === "v" ? "wood" : "stone";

// ---------------------------------------------------------------- the walking route (Walk on / Walk back)
const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const xm = (S.xLow0 + S.xUp0) / 2, xu = (S.xUp0 + S.wall) / 2;
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),                        // out onto the plain
  P(-175, cz, 0, true, E_),                             // the terrace wall and the stairway
  P(xm, cz, 0, false), P(xm, cz - b - 1, 0, false),
  P(xm, zLow0 + 1, S.yLand, false), P(xm, zLand0 + 3, S.yLand, true, E_),   // the landing
  P(xu, zLand0 + 3, S.yLand, false), P(xu, zUp1 - 1, T, false),
  P(xu, cz, T, true, E_),                               // the top: the Gate ahead
  P(G.x - G.half - 6, G.z, T, true, E_),                // the west door and its bulls
  P(G.x, G.z, T, true, E_),                             // inside the Gate
  P(G.x + G.half + 6, G.z, T, true, W_ + PI),           // out by the east door
  P(G.x + G.half + 10, -60, T, false),
  P(A.sx + A.stairD + 26, -13, T, true, W_),            // the carved front of the Apadana's stairs
  P(A.sx + A.stairD + 26, 13, T, true, W_),
  P(A.sx + A.stairD + 6, -A.stairLen / 2 - 4, T, false),
  P(xs0 + (fl0 + fl1) / 2, -A.stairLen / 2 - 1, T, false),
  P(xs0 + (fl0 + fl1) / 2, -A.stairLen / 2 + A.fl + 2, AY, true, PI),   // up the north flight
  P(40, 0, AY, true, W_),                               // into the east portico
  P(0, 22, AY, true, 0),                                // in the hall
  P(-20, -40, AY, true, PI * 0.25),                     // towards the north portico
  P(20, 38, AY, true, PI)                               // the south side: the Tachara and the hill
];

// ---------------------------------------------------------------- info points
const aCol = (id) => aps.find((c) => c.id === id);
const hc = aCol("h-2-1"), ec = aCol("e-0-1");
const info = [
  // ---- vestibule (the archive's own room)
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you go out", title: "Persepolis",
    html: "<p>Persepolis, in Persian <em>Pārsa</em>, stands on a great stone terrace at the foot of the Kuh-e Rahmat, the &lsquo;Mountain of Mercy&rsquo;, on the plain of Marvdasht in Fars, south-western Iran. Darius I began it about 518 BCE; Xerxes I and Artaxerxes I went on building for decades after him. It was a seat of the Achaemenid kings and, above all, a place for royal receptions and festivals. Alexander burned it in 330 BCE.</p><p>This walk climbs the <strong>Great Stairway</strong>, passes through Xerxes&rsquo; <strong>Gate of All Nations</strong>, follows the carved front of the <strong>Apadana&rsquo;s</strong> staircase and ends among the columns of its hall. The ruins are shown as they stand, simplified; the reliefs are our own renderings, and the stone is drawn in code.</p>",
    links: [L.ch06, L.ch49], sources: REF.unesco + "; " + REF.ir + "; " + REF.ch06 + "." },
  { id: "v-v35", section: "v", pos: [V0.x - 2.6, 1.35, V0.z - 1.0], relic: { id: "v35", slug: "cyrus-cylinder", title: "The Cyrus Cylinder", category: "Relics & Sacred Objects", held: "British Museum, London (BM 90920)", dated: "After 539 BCE", kind: "tablet" }, title: "The Cyrus Cylinder (for comparison)",
    html: "<p><strong>Not from Persepolis.</strong> A clay cylinder written in Babylonian cuneiform for Cyrus the Great, founder of the Achaemenid empire, after he took Babylon in 539 BCE. It is shown here because the kings who built Persepolis, beginning with Darius a generation later, ruled the empire Cyrus founded, and spoke of it, as he did, in inscriptions of royal power and divine favour.</p>",
    links: [L.v35, L.v54] },
  { id: "v-door", section: "v", pos: [V0.x, 3.45, V0.z - 4.4], cat: "The way out", title: "To the terrace",
    html: "<p>Walk into the golden portal to step out onto the plain below the terrace wall.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 3.45, V0.z + 4.4], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>This portal returns you to the museum, to the room of the Axial Age.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] },
  // ---- I: the stairway and the gate
  { id: "terrace", section: "s1", pos: [-166, 1.8, cz - 6], cat: "I · The stairway and the Gate", title: "The terrace",
    html: "<p>Darius chose a spur of the hill for his citadel about 518 BCE and built it up into a platform of about 125,000 square metres, roughly 300 by 455 metres, half rock and half fill. Its western and northern walls rise about 12 metres above the plain. Under the paving ran water channels and drains, with a well 26 metres deep.</p><p>Ernst Herzfeld excavated here for the Oriental Institute of Chicago from 1931 to 1934, followed by Erich Schmidt until 1939.</p>",
    flags: [APPROX], links: [L.ch49], sources: REF.ir + "; " + REF.unesco + "." },
  { id: "stairway", section: "s1", pos: [xm + 1.5, S.yLand + 1.8, zLand0 + 2], cat: "I · The stairway and the Gate", title: "The Great Stairway",
    html: "<p>The stairway is double and reversed: two flights rise away from each other from the foot of the wall to two landings, then turn and climb back to meet at the top. They have 63 and 48 steps. Each step is 6.7 metres long but only about 10 centimetres high and 38 deep, so the climb is slow and easy. It is often said that horses could be ridden up it, and also that the shallow steps were meant to make the approach stately; neither is recorded by the builders.</p>",
    flags: [APPROX, { t: "Step count and size published; the model's risers adjusted to reach the terrace", soft: true }], sources: REF.ir + "; " + REF.whe + "." },
  { id: "gate", section: "s1", pos: [G.x - G.half - 3, T + 2.2, G.z + 4], cat: "I · The stairway and the Gate", title: "The Gate of All Nations",
    html: "<p>At the top of the stairway Xerxes built a square hall of about 612 square metres, its roof carried on four columns over 16.5 metres tall, with three doors: west to the stairway, south towards the Apadana, and east. Great bulls guard the west door; on the east door they are winged and have the heads of bearded, crowned men. They follow Assyrian guardians, but stand on four legs, not the Assyrian five.</p><p>The walls are gone; the stone door frames with their guardians survive. How many columns stand is simplified here.</p>",
    flags: [RUIN, RENDER, APPROX], links: [L.ch49], sources: REF.ir + "; " + REF.livG + "." },
  { id: "xpa", section: "s1", pos: [G.x, T + 2.4, G.z - 2.5], cat: "I · The stairway and the Gate", title: "Xerxes speaks",
    html: "<p>On the door jambs, in Old Persian, Babylonian and Elamite, Xerxes names the building. The inscription opens with Ahuramazda: the great god who created the earth, the sky above, man and happiness for man, and who made Xerxes king. Xerxes says that by Ahuramazda&rsquo;s favour he built this Gate of All Nations, and much else besides, and asks the god to protect him and his kingdom.</p><p>The kings&rsquo; inscriptions here and at Behistun are the best evidence for how they spoke of their god; how far their faith matched what later Zoroastrians taught is a question for the chapter.</p>",
    flags: [BELIEF], links: [L.ch06, L.v54], sources: REF.livX + "; " + REF.livG + "; " + REF.ir + "." },
  { id: "graffiti", section: "s1", pos: [G.x + G.half + 2.5, T + 1.8, G.z - 4], cat: "I · The stairway and the Gate", title: "Names in the stone",
    html: "<p>Later visitors carved their own names on the gate. The Dutch artist Cornelis de Bruijn, who made the first accurate drawings of the ruins in the winter of 1704, cut his here; so did the journalist Henry M. Stanley and others. The model leaves them out.</p>",
    sources: REF.livG + "." },
  // ---- II: the Apadana stairs
  { id: "reliefs", section: "s2", pos: [A.sx + A.stairD + 3, T + 2.2, 12], cat: "II · The Apadana stairs", title: "Twenty-three nations",
    html: "<p>The front of the staircase is carved in three registers. On one wing, guards and Persian and Median dignitaries file towards the centre; on the other, twenty-three delegations from the peoples of the empire bring gifts, eighteen in three rows and five more in a slanting line up the stair, each led by an official and set apart by a cypress tree. In the centre a winged disc hovers between sphinxes.</p><p>The figures here are our own simplified outlines, not copies of the carving, and the delegations are not meant to be identified.</p>",
    flags: [RENDER, APPROX], links: [L.ch49], sources: REF.ir + "." },
  { id: "lion", section: "s2", pos: [A.sx + A.stairD + 2, T + 1.8, -A.stairLen / 2 + 4], cat: "II · The Apadana stairs", title: "The lion and the bull",
    html: "<p>At the ends of the staircase a lion leaps onto a bull&rsquo;s back and bites. The scene is repeated again and again at Persepolis. What it meant is not recorded: it has been read as royal power, as the turning of the seasons, or as a sign in the sky, but none of these readings can be confirmed.</p>",
    flags: [RENDER, CONTESTED], sources: REF.ir + "." },
  { id: "colour", section: "s2", pos: [A.sx + A.stairD + 3, T + 2.2, -12], cat: "II · The Apadana stairs", title: "Once painted",
    html: "<p>The grey stone was not left bare. Small traces of paint survive at Persepolis: blue made from a copper compound and red from ochre, both to be had in Iran. Alexander Nagel and colleagues have studied them on site, and protective glass now covers some of the best-preserved patches. The model shows the stone as it is today.</p>",
    flags: [RUIN], sources: REF.si + "; " + REF.nagel + "." },
  { id: "nowruz", section: "s2", pos: [xs0 + 3, AY + 1.9, -6], cat: "II · The Apadana stairs", title: "Built for the New Year?",
    html: "<p>The processions on these stairs have suggested a festival. Ernst Herzfeld, Friedrich Krefter, Roman Ghirshman and Edith Porada argued that Persepolis was built for the spring New Year, <em>Nowruz</em>, when the peoples of the empire brought their gifts to the king. Others, among them Carl Nylander, Peter Calmeyer and Ali Mousavi, answer that there is no evidence for a Nowruz celebration in the Achaemenid period at all. The question is open.</p>",
    flags: [CONTESTED], links: [L.ch06], sources: REF.ir + "." },
  { id: "disc", section: "s2", pos: [A.sx + A.stairD + 2, T + 3.0, 0], cat: "II · The Apadana stairs", title: "The winged figure",
    html: "<p>Above royal scenes at Persepolis hovers a winged disc; in its best-known form a bearded figure rises from it. Who or what it shows is debated. It has been taken for Ahuramazda, for the king&rsquo;s guardian spirit (the <em>fravashi</em>), and for the divine glory that gave a king his right to rule (the <em>farr</em>), which is how many Persians have read it. Today it is the best-known emblem of Zoroastrianism, read by many believers as a summary of their ethics; whether the kings who carved it were Zoroastrians in the later sense is itself debated. The model shows a plain winged disc, simplified, on the stairs&rsquo; centre panel.</p>",
    flags: [CONTESTED, RENDER], links: [L.ch06], sources: REF.ir + "; " + REF.ch06 + "." },
  // ---- III: the hall
  { id: "apadana", section: "s3", pos: [hc.x + 2, AY + 2.4, hc.z + 2], cat: "III · The Apadana", title: "The audience hall",
    html: "<p>The Apadana was the largest building on the terrace, raised on its own podium about 3 metres above the court. Its hall, some 60 metres square, had 36 columns; three porticoes of twelve columns each opened to the north, west and east, with towers at the four corners. The columns stood about 19.5 metres tall, slender because the roof they carried was of timber, and the walls were more than five metres thick. Thirteen of the 72 columns were still standing in 1977.</p>",
    flags: [RUIN, APPROX], links: [L.ch49], sources: REF.ir + "; " + REF.unesco + "." },
  { id: "capitals", section: "s3", pos: [ec.x - 2, AY + 2.0, ec.z + 3], cat: "III · The Apadana", title: "Bulls on the columns",
    html: "<p>Each column ended in a capital of two animals joined back to back, bulls or other beasts, on which the roof beams rested. Few survive in place, and none is shown here: the model&rsquo;s columns stop where the standing shafts end today.</p>",
    flags: [RUIN], sources: REF.unesco + "; " + REF.whe + "." },
  { id: "foundation", section: "s3", pos: [-A.half + 4, AY + 1.8, -A.half + 4], cat: "III · The Apadana", title: "Gold and silver in the corners",
    html: "<p>Darius set stone boxes into the corners of the walls. Two were found in 1933 by Friedrich Krefter, each holding a gold and a silver plaque about 33 centimetres square, inscribed in three languages with Darius&rsquo;s description of his empire.</p>",
    sources: REF.ir + "." },
  { id: "tablets", section: "s3", pos: [-A.half + 4, AY + 1.8, 0], cat: "III · The Apadana", title: "The clay archive",
    html: "<p>In 1933 the Chicago excavators found tens of thousands of clay tablets and fragments in two small rooms of a bastion in the fortification wall. Most are in Elamite and date from around 500 BCE; they record the storage and issue of food, from workers&rsquo; rations to supplies for the king&rsquo;s family, and among them are a few in Greek, Phrygian and Old Persian. Wouter Henkelman has used them to study the gods worshipped in the Persian heartland, Elamite and Iranian side by side.</p><p>Iran lent the tablets to Chicago for study in the 1930s. Objects from Persepolis held in Chicago were later claimed in a US lawsuit against Iran; in 2018 the Supreme Court ruled that they could not be seized.</p>",
    flags: [{ t: "Sources differ on the year of the loan (1936 or 1937)", soft: true }], links: [L.ch06], sources: REF.isac + "; " + REF.henk + "; " + REF.tan + "." },
  { id: "fire", section: "s3", pos: [20, AY + 1.8, 40], cat: "III · The Apadana", title: "The burning",
    html: "<p>In 330 BCE, after the Persian treasurer surrendered the citadel, Alexander of Macedon looted Persepolis and burned it. Ancient writers disagree about why. Some tell of a drunken feast at which an Athenian woman, Thaïs, urged the fire; others present it as revenge for the Persians&rsquo; burning of the Athenian Acropolis in 480 BCE. That the fire was deliberate is generally accepted; its motive is not settled.</p>",
    flags: [CONTESTED], links: [L.ch49], sources: REF.ir + "; " + REF.whe + "." },
  { id: "tombs", section: "s3", pos: [26, AY + 2.4, 44], cat: "III · The Apadana", title: "The tombs in the hill",
    html: "<p>Cut into the face of the hill behind the terrace are two royal tombs, usually attributed to Artaxerxes II and Artaxerxes III. Darius I and his successors were buried in rock-cut tombs at Naqsh-e Rostam, a few kilometres away, whose fronts copy a palace front like Darius&rsquo;s own Tachara, the smaller palace south of this hall.</p>",
    flags: [APPROX], links: [L.ch06], sources: REF.ir + "; " + REF.whe + "." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>From published figures:</strong> the terrace about 300 by 455 m and 12 m high; the Great Stairway&rsquo;s 63 and 48 steps, each 6.7 m long; the Gate of All Nations about 612 m² with columns over 16.5 m; the Apadana&rsquo;s hall 60 m square with 36 columns, its three porticoes of 12, columns about 19.5 m high and 1.6 m thick, its podium about 3 m high and its staircases about 82 m long; the Hall of a Hundred Columns about 68.5 m square.</p>" +
    "<p><strong>Approximate:</strong> where each building stands and how far apart they are, the shapes of the stairs, which columns stand, the Tachara and the Treasury (outlines only), and the hill. The excavators&rsquo; plans could not be checked for this build. Only the northern half of the Great Stairway can be walked; the reliefs are our own simplified outlines.</p>" +
    "<p><strong>Not shown:</strong> the Palace of Xerxes, the Tripylon, the Harem and other buildings, the mud-brick walls and fortifications, the roofs, the column capitals, the colour, the modern shelters and walkways, and the people.</p>",
  links: [L.ch06, L.ch49], sources: REF.ir + "; " + REF.unesco + "." };

// the outdoor sky of Fars: high, clear and dry
const sky = { bg: "#c9d6e2", fog: "#dcd3c0", hemi: "#f0f0ec", ground: "#b49b78", sunPos: [-60, 80, 40], sun: 1.6, far: 1400, fogFar: 1300 };

export default { title: "Persepolis", version: 1, stones: ["limestone", "block", "floor", "rock", "wood"], sky, sections, regions, route, info, about, D, V0 };
