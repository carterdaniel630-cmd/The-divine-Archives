/* ==========================================================================
   Angkor Wat — the site: sections, walkable regions, route, info points.
   Geometry lives in the section modules (s0-vestibule.js … s3-summit.js),
   measurements in dims.js, the bas-reliefs in art.js.

   Status: "preview" in docs/assets/pilgrimage-data.js. The page exists
   (noindex) but the site is off the menu until Carter approves it going live.
   Plan: plans/pilgrimage-sites.md. Sources: sources/pilgrimage-angkor-wat.md.

   Frame (see dims.js): metres; x east, y up, z south; the temple faces west
   and the central tower is at x = 0, z = 0. The ground inside the moat is
   y = 0, the raised way y = 1.5, the second level y = 8 and the platform of
   the five towers y = 21.5. The temple is shown as it stands, simplified.
   ========================================================================== */
import { region } from "../../kit.js?v=1";
import { D } from "./dims.js?v=1";

const PI = Math.PI, E_ = -PI / 2, W_ = PI / 2;   // yaw 0 faces north (-z); -PI/2 faces east; PI/2 faces west
export const V0 = { x: -900, z: 0 };           // the archive's own vestibule (beyond the moat, out of the temple's box)
export const EXIT_HREF = "../museum.html#ch30";
const G1 = D.g1, G2 = D.g2, L3 = D.l3, PW = D.pw, M = D.moat;
const g1x = -G1.hx, g1w = g1x + G1.inset, g1z = G1.hz, g1s = g1z - G1.inset;   // the first gallery's outer line and relief wall
const bandW = (g1x + 0.8 + g1w) / 2, bandS = (g1z - 0.8 + g1s) / 2;               // the middle of the walk along the reliefs

// ---------------------------------------------------------------- short references (full list: sources/pilgrimage-angkor-wat.md)
const REF = {
  glaize: "M. Glaize, <em>The Monuments of the Angkor Group</em> (1944), English translation at theangkorguide.com, &ldquo;Angkor Wat&rdquo;",
  unesco: "UNESCO World Heritage Centre, &ldquo;Angkor&rdquo; (site 668, inscribed 1992)",
  sn: "B. Bower, &ldquo;Lasers unveil secrets and mysteries of Angkor Wat&rdquo;, <em>Science News</em> (29 April 2016), on the studies in <em>Antiquity</em> 89 (December 2015)",
  ppp: "Yuth Vireak, report on the spring equinox at Angkor Wat, <em>The Phnom Penh Post</em> (23 March 2023), as republished by Asia News Network",
  the: "D. Heywood, review of E. Mannikka, <em>Angkor Wat: Time, Space and Kingship</em> (University of Hawaii Press, 1996), <em>Times Higher Education</em> (2 January 1998)",
  brit: "<em>Encyclop&aelig;dia Britannica</em>, &ldquo;Angkor Wat&rdquo; (britannica.com, consulted 31 October 2026)",
  kak: "S. Kak, &ldquo;Time, Space and Astronomy in Angkor Wat&rdquo; (Louisiana State University, 2001)",
  ch69: "the archive&rsquo;s chapter on the Upanishads and the Hindu synthesis (ch69)",
  ch30: "the archive&rsquo;s chapter on Bhakti (ch30)"
};
const L = {
  ch69: { href: "../chapters/ch69.html", label: "The Upanishads & the Hindu synthesis" },
  ch30: { href: "../chapters/ch30.html", label: "Read the Bhakti chapter" },
  ch20: { href: "../chapters/ch20.html", label: "Mahayana Buddhism" },
  v27: { href: "../vault/sacred-tooth-relic.html", label: "The Sacred Tooth Relic (Vault)" }
};
const APPROX = { t: "Layout after published descriptions · positions approximate", soft: true };
const RUIN = { t: "Shown as it stands today, simplified", soft: true };
const RENDER = { t: "Reliefs: our own rendering, simplified", soft: true };
const CONTESTED = { t: "Contested", soft: false };
const DIFFER = { t: "Sources differ", soft: false };
const UNTESTED = { t: "Proposed by single authors · not established", soft: false };
const LIVING = { t: "A Buddhist shrine for centuries", soft: true };
const LIVING_NOW = { t: "A Buddhist shrine for centuries; a pilgrimage shrine today", soft: true };

// ---------------------------------------------------------------- sections (one big box: the whole temple is in view from the way)
const BIG = [-760, -5, -640, 760, 80, 640];
const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: the portal back to the museum, a Vault object for comparison, and the way out to the western entrance." },
  { id: "s1", name: "I · The western approach", short: "the western approach", module: "s1-approach.js", box: BIG, start: { x: -495, z: 0, yaw: E_, y: PW.y }, blurb: "Through the western gate and along the raised way, with the five towers ahead: the place where the spring equinox sun rises over the central tower." },
  { id: "s2", name: "II · The gallery of bas-reliefs", short: "the bas-reliefs", module: "s2-galleries.js", box: BIG, start: { x: -123, z: 0, yaw: E_, y: G1.y }, blurb: "Walk the first gallery past the battle of Kurukshetra, the army of Suryavarman II and the judgement of the dead, then climb through the cruciform cloister to the second level." },
  { id: "s3", name: "III · The central sanctuary", short: "the summit", module: "s3-summit.js", box: BIG, start: { x: -24, z: -12, yaw: -1.75, y: L3.y }, blurb: "The platform of the five towers, the highest level of the temple, around the central tower." }
];

// ---------------------------------------------------------------- where the visitor may walk
// the pillars of the summit gallery (as drawn in s3-summit.js), kept clear of
function summitPillars() {
  const t = L3.top, p = t - L3.inset, out = [];
  for (const o of [-1, 1]) for (const half of [-1, 1]) {
    const u0 = half < 0 ? -t : 1.5, u1 = half < 0 ? -1.5 : t;
    for (let u = u0 + 1.4; u < u1 - 0.4; u += 2.8) out.push([u - 0.5, u + 0.5, o * p - 0.5, o * p + 0.5], [o * p - 0.5, o * p + 0.5, u - 0.5, u + 0.5]);
  }
  return out;
}
const cy = PW.y, y2 = G2.y, y3 = L3.y, mw = D.mcw, gp = D.gop, x2 = -G2.hx, z2 = G2.hz;
const regions = [
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0, holes: [[V0.x - 3.2, V0.x - 2.0, V0.z - 1.6, V0.z - 0.4]] }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  region({ id: "v-exit", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z + 4.6, z1: V0.z + 5.6, y: 0, inset: 0.05, portal: "museum", href: EXIT_HREF }),
  // the west bank of the moat, the causeway over it, the gate and the raised way inside
  region({ id: "bank", section: "s1", x0: -756, x1: M.x1, z0: -30, z1: 30, y: 0, open: "e", outside: true }),
  region({ id: "to-v", section: "s1", x0: -756.6, x1: -755.4, z0: -0.8, z1: 0.8, y: 0, inset: 0.05, portal: "v", outside: true }),
  region({ id: "mcw", section: "s1", x0: M.x1, x1: -gp.d / 2 - D.enc.hx, z0: -mw.hw, z1: mw.hw, y: mw.y, open: "we", outside: true }),
  region({ id: "gate", section: "s1", x0: -D.enc.hx - gp.d / 2, x1: -D.enc.hx + gp.d / 2, z0: -2.6, z1: 2.6, y: mw.y, open: "we", outside: true }),
  region({ id: "ramp", section: "s1", x0: -D.enc.hx + gp.d / 2, x1: PW.x0, z0: -PW.hw, z1: PW.hw, y: mw.y, y1: cy, axis: "x", open: "we", outside: true }),
  region({ id: "way", section: "s1", x0: PW.x0, x1: PW.x1, z0: -PW.hw, z1: PW.hw, y: cy, open: "we", outside: true }),
  // the cruciform terrace, the west door of the first gallery, and the walk along the reliefs (west and south galleries)
  region({ id: "cru", section: "s2", x0: D.cru.x0, x1: D.cru.x1, z0: -8, z1: 8, y: G1.y, open: "we", outside: true }),
  region({ id: "g1door", section: "s2", x0: g1x - 0.5, x1: g1w + 4, z0: -2.9, z1: 2.9, y: G1.y, open: "we", outside: true }),
  region({ id: "g1w", section: "s2", x0: g1x + 0.8, x1: g1w, z0: -4, z1: g1z - 0.8, y: G1.y, inset: 0.25, open: "n", outside: true }),
  region({ id: "g1s", section: "s2", x0: g1x + 0.8, x1: 80, z0: g1s, z1: g1z - 0.8, y: G1.y, inset: 0.25, open: "w", outside: true }),
  // the cruciform cloister, the stair up to the second level, and the court round the central pyramid
  region({ id: "cloister", section: "s2", x0: g1w + 3.5, x1: -72, z0: -3, z1: 3, y: G1.y, open: "we", outside: true }),
  region({ id: "stair2", section: "s2", x0: -72, x1: x2, z0: -2.5, z1: 2.5, y: G1.y, y1: y2, axis: "x", open: "we", outside: true }),
  region({ id: "g2door", section: "s2", x0: x2, x1: x2 + G2.inset + 0.5, z0: -2.5, z1: 2.5, y: y2, open: "we", outside: true }),
  region({ id: "court2", section: "s2", x0: x2 + G2.inset, x1: G2.hx - G2.inset, z0: -z2 + G2.inset, z1: z2 - G2.inset, y: y2, outside: true, holes: [[-L3.base, L3.base, -L3.base, L3.base]] }),
  region({ id: "to-s3", section: "s2", x0: -L3.base - 1.4, x1: -L3.base, z0: -1.4, z1: 1.4, y: y2, inset: 0.05, portal: "s3", outside: true }),
  // the platform of the five towers
  region({ id: "summit", section: "s3", x0: -L3.top, x1: L3.top, z0: -L3.top, z1: L3.top, y: y3, outside: true,
    holes: [[-D.tw.c.r - 0.6, D.tw.c.r + 0.6, -D.tw.c.r - 0.6, D.tw.c.r + 0.6]].concat([[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz]) => {
      const o = D.tw.k.off, r = D.tw.k.r + 0.4; return [sx * o - r, sx * o + r, sz * o - r, sz * o + r]; })).concat(summitPillars()) }),
  region({ id: "to-s2", section: "s3", x0: -L3.top + 0.2, x1: -L3.top + 1.6, z0: -1.4, z1: 1.4, y: y3, inset: 0.05, portal: "s2", outside: true })
];
for (const r of regions) r.surface = r.section === "v" ? "wood" : "stone";

// ---------------------------------------------------------------- the walking route (Walk on / Walk back)
const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),                        // out to the western entrance
  P(-495, 0, cy, true, E_),                             // inside the gate: the way and the towers ahead
  P(D.eqView.x, 0, cy, true, E_),                       // the equinox view
  P(D.lib.x, 0, cy, true, PI),                          // between the libraries
  P((D.pond.x0 + D.pond.x1) / 2, 0, cy, true, PI),      // between the pools
  P(-123, 0, G1.y, true, E_),                           // the cruciform terrace and the first gallery
  P(bandW, 0, G1.y, false),
  P(bandW, 30, G1.y, true, E_),                         // the battle of Kurukshetra
  P(bandW, bandS, G1.y, false),
  P(-60, bandS, G1.y, true, 0),                         // the army of Suryavarman II
  P(40, bandS, G1.y, true, 0),                          // heavens and hells
  P(bandW, bandS, G1.y, false),
  P(bandW, 0, G1.y, false),
  P(-88, 0, G1.y, true, E_),                            // the cruciform cloister
  P(-72, 0, G1.y, false), P(x2, 0, y2, false),
  P(-48, 0, y2, true, E_),                              // the second level: the central pyramid ahead
  P(-L3.base - 0.7, 0, y2, false),                      // the stair to the summit
  P(-24, -12, y3, true, -1.75),                          // the platform of the five towers
  P(-12, -20, y3, true, PI * 0.75),                     // the north-west corner tower
  P(-27, 0, y3, true, W_)                               // looking back west along the way
];

// ---------------------------------------------------------------- info points
const info = [
  // ---- vestibule (the archive's own room)
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you go out", title: "Angkor Wat",
    html: "<p>Angkor Wat, near Siem Reap in Cambodia, is the largest monument of Angkor, the region of the capitals of the Khmer empire from the 9th to the 15th century. King Suryavarman II, who reigned from 1113 until his death about 1149, built it in the first half of the 12th century as a temple of Vishnu. It became a Buddhist shrine, and for centuries Buddhist pagodas stood within it. Today it is, in Britannica&rsquo;s words, &lsquo;one of the most important pilgrimage shrines in Southeast Asia&rsquo;.</p><p>This walk crosses the moat and the western gate, follows the raised way to the temple, walks the gallery of bas-reliefs, climbs through the cruciform cloister to the second level and ends on the platform of the five towers. The temple is shown as it stands, simplified; the reliefs are our own renderings, and the stone is drawn in code.</p>",
    flags: [LIVING_NOW], links: [L.ch69, L.ch30], sources: REF.glaize + "; " + REF.sn + "; " + REF.unesco + "; " + REF.brit + "." },
  { id: "v-v27", section: "v", pos: [V0.x - 2.6, 1.35, V0.z - 1.0], relic: { id: "v27", slug: "sacred-tooth-relic", title: "The Sacred Tooth Relic", category: "Relics & Sacred Objects", held: "Sri Dalada Maligawa, Kandy", dated: "In Sri Lanka since the 4th century CE (tradition)", kind: "reliquary" }, title: "The Sacred Tooth Relic (for comparison)",
    html: "<p><strong>Not from Angkor.</strong> The casket of the Buddha&rsquo;s tooth in Kandy, Sri Lanka, shown as a rendition; the relic itself is shown only rarely and is not shown here. For a thousand years whoever held it held the right to rule. It is here for two comparisons: Angkor Wat, too, joined a king to the sacred, built by Suryavarman II for Vishnu and perhaps as his mausoleum; and, like the tooth&rsquo;s temple, it became a place of Buddhist worship.</p>",
    links: [L.v27, L.ch20] },
  { id: "v-door", section: "v", pos: [V0.x, 3.45, V0.z - 4.4], cat: "The way out", title: "To the western entrance",
    html: "<p>Walk into the golden portal to step out inside the western gate, on the raised way to the temple.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 3.45, V0.z + 4.4], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>This portal returns you to the museum, to the room of the Bhakti chapter.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] },
  // ---- I: the western approach
  { id: "temple", section: "s1", pos: [-490, cy + 1.9, -3.6], cat: "I · The western approach", title: "A temple for Vishnu",
    html: "<p>Angkor Wat was built for Suryavarman II, in the first half of the 12th century, as a temple of Vishnu; after his death the king was known by the name Paramavishnuloka. The five towers ahead stand on a stepped pyramid of three levels. The central tower is 42 metres high and rises 62 metres above the way you stand on.</p><p>Commaille cleared the temple of vegetation from 1908 to 1911. Glaize notes that the temple had always sheltered Buddhist pagodas and been a place of pilgrimage for the Khmer.</p>",
    flags: [APPROX, RUIN], links: [L.ch69, L.ch30], sources: REF.glaize + "; " + REF.sn + "." },
  { id: "west", section: "s1", pos: [-497, cy + 1.9, 3.6], cat: "I · The western approach", title: "Why west?",
    html: "<p>Most temples of Angkor face east, to the sunrise. Angkor Wat faces west, and why is debated. Louis Finot, George C&oelig;d&egrave;s, Jean Przyluski and F. D. K. Bosch took it for a funerary temple, built in the king&rsquo;s lifetime and perhaps meant for his ashes: Bosch found the westward orientation typical of Indo-Javanese funerary monuments, and in funerary rites the ritual walk round the shrine was reversed. C&oelig;d&egrave;s also pointed out that Vishnu, to whom the temple was dedicated, is usually associated with the west. Others point to a practical cause, the stone brought by water from the Kulen hills; Glaize found that last reason not enough on its own; he himself wrote that the funerary reading &lsquo;seems proven&rsquo;, but others disagree, and none of these is settled.</p>",
    flags: [CONTESTED], links: [L.ch69], sources: REF.glaize + "." },
  { id: "equinox", section: "s1", pos: [D.eqView.x, cy + 2.0, 3.2], cat: "I · The western approach", title: "The equinox sunrise",
    toggle: { id: "equinox", on: "Show the equinox sun", off: "Hide the sun" },
    html: "<p>Around the spring equinox, from about 20 to 23 March and most exactly on the 21st, the sun seen from the western way rises over the top of the central tower. It is a public event: in 2023 the tourism authorities counted 8,726 people at dawn on 21 March. It happens again at the autumn equinox in September.</p><p>The archaeologist Im Sokrithy of the APSARA National Authority, which manages Angkor, calls the alignment deliberate, a sign of the builders&rsquo; skill in astronomy. That is a widely held reading, but the builders left no inscription saying so. The model&rsquo;s sun is aimed from this point over the tower top; its place in the sky is our estimate.</p>",
    flags: [{ t: "The alignment is observed; its intent is not recorded", soft: true }], links: [L.ch69], sources: REF.ppp + "; " + REF.the + "." },
  { id: "numbers", section: "s1", pos: [D.eqView.x + 8, cy + 1.9, -3.4], cat: "I · The western approach", title: "A calendar in stone?",
    html: "<p>Eleanor Mannikka argued, in <em>Angkor Wat: Time, Space and Kingship</em> (1996), that the temple is laid out as a solar and lunar calendar: converted into an old unit of length, the cubit, the temple&rsquo;s distances give numbers she reads as solar, lunar and calendrical, with recurring figures such as 54 and 108. Subhash Kak (2001) took the same approach with a Khmer cubit of about 0.435 m and read distances along the axis as the lengths of the Hindu ages of the world, the <em>yugas</em>, while disputing some of her numbers.</p><p>The alignments appear only after the survey&rsquo;s metres are converted into cubits, and small mismatches are put down to error or settling. No independent test of these readings was found for this build; they are best taken as individual scholars&rsquo; proposals, not an established result.</p>",
    flags: [UNTESTED], sources: REF.the + "; " + REF.kak + "." },
  { id: "moat", section: "s1", pos: [-640, mw.y + 1.9, mw.hw - 1], cat: "I · The western approach", title: "The moat",
    html: "<p>With its moat the temple fills a rectangle of about 1,500 by 1,300 metres, nearly 200 hectares. The moat is 190 metres wide and about 5.5 kilometres round; on the west it is crossed by this causeway, 200 metres long and 12 metres wide, and on the east by a bank of earth. Inside, about 30 metres from the water, runs a laterite wall enclosing 1,025 by 800 metres.</p>",
    flags: [APPROX], sources: REF.glaize + "." },
  { id: "gate", section: "s1", pos: [-D.enc.hx - 2, mw.y + 2.2, 3.2], cat: "I · The western approach", title: "The western gate",
    html: "<p>The western entrance is a colonnade 235 metres long, its middle a gate in three parts, each crowned by a tower whose upper tiers have fallen. At each end a pavilion let elephants pass at ground level.</p><p>Ground-penetrating radar found the foundations of eight towers buried at the western entrance; excavations in 2010 and 2012 confirmed them, and radiocarbon dates suggest they were raised as building began. The excavator thinks they were deliberately torn down once the outer wall and gate were finished. Their purpose is unknown; one suggestion is a temporary shrine to Vishnu.</p>",
    flags: [RUIN, APPROX], sources: REF.glaize + "; " + REF.sn + "." },
  { id: "way", section: "s1", pos: [-400, cy + 1.6, PW.hw - 0.8], cat: "I · The western approach", title: "The raised way",
    html: "<p>From the gate to the temple runs a way 350 metres long and 9.4 metres wide overall, raised 1.5 metres above the ground, its edge a balustrade in the form of a <em>naga</em>, a serpent; six stairs go down from each side. Towards its middle stand two buildings known as the &lsquo;libraries&rsquo;, and nearer the temple it passes between two square pools; the northern one keeps its stone steps and holds water.</p>",
    flags: [APPROX], sources: REF.glaize + "." },
  { id: "city", section: "s1", pos: [D.lib.x + 6, cy + 1.6, -PW.hw + 0.8], cat: "I · The western approach", title: "A town under the grass",
    html: "<p>In April 2012 Damian Evans and colleagues flew lidar, a laser survey from the air, over about 370 square kilometres around Angkor. Inside the moat it showed a grid of roads in four blocks, with mounds and an estimated 250 to 300 small ponds; digs led by Miriam Stark in 2010 and 2013 found modest wooden houses, apparently of the temple&rsquo;s workers. Just beyond the moat to the south lie six great spiral mounds of earth, each about a kilometre long, whose purpose is unknown. None of this is shown.</p>",
    sources: REF.sn + "." },
  // ---- II: the gallery of bas-reliefs
  { id: "gallery", section: "s2", pos: [-117, G1.y + 2.0, 6], cat: "II · The gallery of bas-reliefs", title: "The first gallery",
    html: "<p>The lowest level is ringed by a gallery 187 by 215 metres, its outer side open between pillars. On its inner wall, 2 metres high and more than 1,000 square metres in all, runs a series of reliefs, followed from the west door heading south, anticlockwise round the temple. That is the reverse of the usual walk, which keeps a shrine on one&rsquo;s right; Glaize connects it with funerary rites.</p><p>The reliefs drawn here are our own simple renderings, not copies, and only three of the eight great panels are drawn.</p>",
    flags: [RENDER, APPROX], links: [L.ch69], sources: REF.glaize + "." },
  { id: "kuru", section: "s2", pos: [bandW, G1.y + 2.2, 40], cat: "II · The gallery of bas-reliefs", title: "The battle of Kurukshetra",
    html: "<p>The southern half of the west gallery shows the great battle of the <em>Mahabharata</em> at Kurukshetra: the Kauravas advance from the left, the Pandavas from the right, and they meet in the middle. Among them Bhishma, the Kauravas&rsquo; commander, lies dying, pierced with arrows, and the hero Arjuna rides with his four-armed charioteer, Krishna. Before this battle, in the epic, Krishna teaches Arjuna the <em>Bhagavad Gita</em>.</p>",
    flags: [RENDER], links: [L.ch69, L.ch30], sources: REF.glaize + "; " + REF.ch69 + "." },
  { id: "army", section: "s2", pos: [-55, G1.y + 2.2, bandS], cat: "II · The gallery of bas-reliefs", title: "The army of Suryavarman II",
    html: "<p>The western part of the south gallery, about 90 metres, is the only great panel with a historical subject. Above, the king holds audience on his throne; below, his army marches with its chiefs standing on elephants, and the king himself, taller than the rest, under his fifteen parasols. A procession of royal priests and allied troops from Siam follows. Twenty-eight short inscriptions name the chiefs.</p>",
    flags: [RENDER], sources: REF.glaize + "." },
  { id: "judgement", section: "s2", pos: [35, G1.y + 2.2, bandS], cat: "II · The gallery of bas-reliefs", title: "Heavens and hells",
    html: "<p>The eastern part of the south gallery, about 60 metres, shows the judgement of the dead. Yama, the many-armed judge, mounted on a buffalo, sends them up to the heavens, rows of palaces with their dwellers, or down to the hells, where they are punished; Glaize counts 37 heavens and 32 hells, and 36 short inscriptions name them. The model draws the hells only as falling figures.</p>",
    flags: [RENDER], links: [L.ch69], sources: REF.glaize + "." },
  { id: "churning", section: "s2", pos: [70, G1.y + 2.0, bandS], cat: "II · The gallery of bas-reliefs", title: "The churning of the sea of milk",
    html: "<p>Round the corner, in the southern half of the east gallery (not drawn here), is the most famous panel, nearly 50 metres long: gods and demons pull on the serpent Vasuki wound round Mount Mandara, which rests on a tortoise, one of Vishnu&rsquo;s forms, to churn the ocean of milk for the nectar of immortality. Vishnu presides over the work, and a frieze of <em>apsaras</em> runs along the panel.</p><p>The figures are counted differently. Glaize counts 92 demons and 88 gods; Im Sokrithy of the APSARA National Authority counts 91 demons and reads both numbers as days of the solar year between equinoxes and solstices. That calendar reading is his interpretation.</p>",
    flags: [DIFFER], links: [L.ch69], sources: REF.glaize + "; " + REF.ppp + "." },
  { id: "cloister", section: "s2", pos: [-90, G1.y + 2.0, -2.6], cat: "II · The gallery of bas-reliefs", title: "The cruciform cloister",
    html: "<p>Between the first and second levels lies a cloister in the form of a cross, with four sunken tanks with stepped sides, which may have been pools or courtyards. Its southern part is known as Prah Pean (Preah Poan), &lsquo;the thousand Buddhas&rsquo;: when the temple became Buddhist, monks set Buddha images here, and many have been put back. The model leaves the images out and draws the cloister as a single passage.</p>",
    flags: [LIVING, APPROX], links: [L.ch20], sources: REF.glaize + "." },
  { id: "buddhist", section: "s2", pos: [-48, y2 + 2.0, 3], cat: "II · The gallery of bas-reliefs", title: "From Vishnu to the Buddha",
    html: "<p>Hindu ceremonies went on here into the 13th century; by the 14th or 15th the temple was Buddhist. Monks took away the Brahmanic image from the central sanctuary, walled up its doorways and carved standing Buddhas on them, and replaced missing pillars and lintels with columns taken from other parts of the temple. A long inscription of the early 18th century on the east gate records a funerary monument. Glaize, writing in 1944, says it had always sheltered Buddhist pagodas; the model shows no images of the Buddha or of Vishnu.</p>",
    flags: [LIVING], links: [L.ch20, L.ch30], sources: REF.glaize + "; " + REF.sn + "." },
  // ---- III: the summit
  { id: "summit", section: "s3", pos: [-16, y3 + 2.2, 8], cat: "III · The central sanctuary", title: "The five towers", look: [-1.75, 0.45],
    html: "<p>The highest level, a square of towers 60 metres wide at its base, stands on a substructure about 30 metres high, reached by stairs as steep as 70 degrees. Four towers stand at the corners and the fifth, the central one, over the sanctuary. As early as 1866 the Englishman Thomson saw in Angkor Wat the symbol of Mount Meru, the mountain at the centre of the universe, and matched the seven circles of the central tower to the seven mountain chains round Meru (as Glaize reports, after Madame de Coral-Remusat). The towers&rsquo; tiered outline, ribbed with recesses and crowned with rows of lotus petals, is simplified here.</p>",
    flags: [APPROX], links: [L.ch69], sources: REF.glaize + "." },
  { id: "deposit", section: "s3", pos: [-10, y3 + 1.8, -2], cat: "III · The central sanctuary", title: "Gold under the tower",
    html: "<p>At the bottom of a well under the central sanctuary, 23 metres down, excavators found the temple&rsquo;s sacred foundation deposit: two leaves of gold, each about 18 centimetres across, set in laterite. The sanctuary room itself is only about 5 metres wide.</p>",
    sources: REF.glaize + "." },
  { id: "heritage", section: "s3", pos: [-26, y3 + 1.8, -6], cat: "III · The central sanctuary", title: "World Heritage",
    html: "<p>Angkor was listed as a World Heritage Site in 1992 and at once placed on the list of sites in danger, until 2004. The protected area covers about 400 square kilometres.</p>",
    sources: REF.unesco + "." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>From published figures:</strong> the moat 190 m wide and the rectangle it encloses about 1,500 by 1,300 m; the enclosure 1,025 by 800 m; the moat causeway 200 by 12 m; the western colonnade 235 m; the raised way 350 m long, 9.4 m wide and 1.5 m high; the first gallery 187 by 215 m with reliefs 2 m high; the second gallery 100 by 115 m; the quincunx of towers 60 m at its base; the central tower 42 m above its platform and 62 m above the way.</p>" +
    "<p><strong>Approximate:</strong> the heights of the three levels, the places and sizes of the libraries, pools and cruciform terrace, the shapes of the towers and gates, the steepness of the stairs and the sun&rsquo;s place in the sky. No measured plan could be opened for this build. The reliefs are our own renderings, and only three panels are drawn.</p>" +
    "<p><strong>Not shown:</strong> the inner galleries of the second and third levels and the cross-shaped galleries of the summit, the cloister&rsquo;s tanks, the carved <em>apsaras</em> and other carving, the statues and Buddha images, the town and spiral mounds found by lidar, the trees inside the enclosure, the modern stairs and walkways, and the people.</p>",
  links: [L.ch69, L.ch30], sources: REF.glaize + "; " + REF.sn + "." };

// the outdoor sky of Siem Reap in the dry season: hazy, warm; the far setting is raised so the equinox sun shows
const sky = { bg: "#c8d3d8", fog: "#d6d2c2", hemi: "#f2efe4", ground: "#8a8a5a", sunPos: [80, 70, -30], sun: 1.5, far: 2000, fogNear: 120, fogFar: 1500 };

export default { title: "Angkor Wat", version: 1, stones: ["limestone", "block", "floor", "rock", "wood", "turf"], sky, sections, regions, route, info, about, D, V0 };
