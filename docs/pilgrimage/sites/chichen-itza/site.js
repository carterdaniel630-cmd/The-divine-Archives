/* ==========================================================================
   Chichén Itzá — the site: sections, walkable regions, route, info points.
   Geometry lives in the section modules (s0-vestibule.js … s4-caracol.js),
   measurements in dims.js, shared builders and the carved textures in maya.js.

   Status: "preview" in docs/assets/pilgrimage-data.js. The page exists
   (noindex) but the site is off the menu until Carter approves it going live.
   Plan: plans/pilgrimage-sites.md (VII · High Medieval). Sources:
   sources/pilgrimage-chichen-itza.md.

   The moment shown: today, as a visitor finds the site (the pyramid can no
   longer be climbed), with two views the visitor can switch on: the pattern
   of light on the north stairway near the equinoxes, and roughly where the
   earlier pyramid lies inside the later one.
   Frame: metres; x east, y up, z south; the model is squared to the pyramid.
   ========================================================================== */
import { region } from "../../kit.js?v=1";
import { D } from "./dims.js?v=1";

const PI = Math.PI;                           // yaw 0 faces north, PI south, PI/2 west, -PI/2 east
export const V0 = { x: 400, z: 0 };          // the archive's own vestibule
export const EXIT_HREF = "../museum.html#ch29";
const CS = D.cas, BC = D.bc, TZ = D.tz, WR = D.war, SB = D.sacbe, CN = D.cenote, CR = D.car, PZ = D.plaza;

// ---------------------------------------------------------------- short references (full list: sources/pilgrimage-chichen-itza.md)
const REF = {
  unesco: "UNESCO World Heritage Centre, &ldquo;Pre-Hispanic City of Chichen-Itza&rdquo; (site 483, inscribed 1988)",
  brit: "<em>Encyclop&aelig;dia Britannica</em>, &ldquo;Chich&eacute;n Itz&aacute;&rdquo;",
  cas: "&ldquo;El Castillo, Chichen Itza&rdquo;, Wikipedia (sizes; the substructure; the cenote beneath)",
  sp: "I. &Scaron;prajc and P. F. S&aacute;nchez Nava, &ldquo;El Sol en Chich&eacute;n Itz&aacute; y Dzibilchalt&uacute;n: la supuesta importancia de los equinoccios en Mesoam&eacute;rica&rdquo;, <em>Arqueolog&iacute;a Mexicana</em> 149",
  sp21: "I. &Scaron;prajc, &ldquo;Equinoctial Sun and Astronomical Alignments in Mesoamerican Architecture: Fiction and Fact&rdquo;, <em>Ancient Mesoamerica</em> 34.2 (2023), 281&ndash;297",
  gwr: "Guinness World Records, &ldquo;Largest ball court in ancient Mesoamerica&rdquo;",
  met: "C. C. Earley, &ldquo;The Mesoamerican Ballgame&rdquo;, The Metropolitan Museum of Art (2017)",
  famsf: "Fine Arts Museums of San Francisco, &ldquo;Rubbing from the Great Ballcourt at Chichen Itza&rdquo; (Merle Greene Robertson)",
  tzo: "&ldquo;Tzompantli&rdquo;, Wikipedia",
  tt: "J. K. Kowalski and C. Kristan-Graham (eds.), <em>Twin Tollans: Chich&eacute;n Itz&aacute;, Tula, and the Epiclassic to Early Postclassic Mesoamerican World</em> (Dumbarton Oaks, 2007)",
  cen: "&ldquo;Sacred Cenote&rdquo;, Wikipedia (after Cano 2002, Sabloff 1994, Landa)",
  doyle: "J. Doyle, &ldquo;Into the Centipede&rsquo;s Jaws: Sumptuous Offerings from the Sacred Cenote at Chich&eacute;n Itz&aacute;&rdquo;, The Metropolitan Museum of Art (2018)",
  wa: "&ldquo;New thinking on Mayan child sacrifice&rdquo;, <em>World Archaeology</em> 28 (2008), on G. de Anda&rsquo;s study",
  ng: "<em>National Geographic</em>, 12 June 2024, on R. Barquera and others, <em>Nature</em> (2024)",
  hm: "G. Palacios, &ldquo;El dragado del cenote sagrado de Chich&eacute;n Itz&aacute;, 1904&ndash;c.1914&rdquo;, <em>Historia Mexicana</em> 67.2 (2017)",
  car: "&ldquo;El Caracol, Chichen Itza&rdquo;, Wikipedia",
  aveni: "A. F. Aveni, S. L. Gibbs and H. Hartung, &ldquo;The Caracol Tower at Chichen Itza: an ancient astronomical observatory?&rdquo;, <em>Science</em> 188 (1975), 977&ndash;985",
  disc: "P. B&iacute;r&oacute; and E. P&eacute;rez de Heredia, &ldquo;El disco de El Caracol de Chich&eacute;n Itz&aacute; (929&ndash;932 d.n.e.)&rdquo;, <em>Estudios de Cultura Maya</em> 48 (2016)",
  expl: "Exploratorium, &ldquo;Ancient Observatories: Chichen Itza &mdash; El Caracol&rdquo;",
  ch29: "the archive&rsquo;s chapter on the Maya (ch29)",
  brit2: "<em>Encyclop&aelig;dia Britannica</em>, &ldquo;Chich&eacute;n Itz&aacute;&rdquo; (most buildings c. 900&ndash;1200; eclipsed by May&aacute;pan from c. 1200)",
  whe: "M. Cartwright, &ldquo;Chichen Itza&rdquo;, <em>World History Encyclopedia</em>",
  ym: "Mexico&rsquo;s 2020 census (INEGI), as reported in &ldquo;Yucat&aacute;n pierde hablantes de maya&rdquo;, <em>M&eacute;xico Desconocido</em> (6 July 2026): &ldquo;519 mil 167 hablantes de maya en la entidad&rdquo;",
  tm: "V. Tiesler and V. E. Miller, &ldquo;Heads, Skulls, and Sacred Scaffolds: New Studies on Ritual Body Processing and Display in Chichen Itza and Beyond&rdquo;, <em>Ancient Mesoamerica</em> 34.2 (2023), 563&ndash;585",
  oh3d: "Open Heritage 3D, &ldquo;Tzompantli &ndash; Chichen Itza&rdquo; (dataset description)"
};
const L = {
  ch29: { href: "../chapters/ch29.html", label: "Read the chapter on the Maya" },
  v31: { href: "../vault/dresden-codex.html", label: "The Dresden Codex (Vault)" }
};
const APPROX = { t: "Sizes and placings approximate", soft: true };
const RENDER = { t: "Carvings and figures: our own simple renderings", soft: true };
const CONTESTED = { t: "Contested", soft: false };
const BELIEF = { t: "What was believed, not a finding", soft: true };
const SENS = { t: "Still argued today", soft: false };
const REMAINS = { t: "Human remains: described, not shown", soft: true };

// ---------------------------------------------------------------- sections
const BIG = [-260, -40, -460, 180, 60, 600];          // the plaza and everything seen across it; the cenote and El Caracol load only as you near them
const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: the portal back to the museum, a Maya book from the Vault for comparison, and the way out." },
  { id: "s1", name: "I · The Great Platform", short: "the pyramid", module: "s1-platform.js", box: BIG, start: { x: -45, z: -75, yaw: -2.45, y: 0 }, blurb: "The pyramid of Kukulkan on its plaza, the platform of skulls and the Temple of the Warriors." },
  { id: "s2", name: "II · The Great Ball Court", short: "the ball court", module: "s2-ballcourt.js", box: BIG, start: { x: BC.x, z: BC.z + BC.alleyL / 2 - 3, yaw: 0, y: 0 }, blurb: "The largest known ball court of ancient Mesoamerica, with its stone rings and carved benches." },
  { id: "s3", name: "III · The Sacred Cenote", short: "the Sacred Cenote", module: "s3-cenote.js", box: [D.rim.x0, -30, D.rim.z0, D.rim.x1, 20, SB.z1], start: { x: 0, z: -200, yaw: 0, y: 0 }, blurb: "The causeway north to the great natural well of offerings, where, by a Spanish account and the bones found there, people too were sacrificed." },
  { id: "s4", name: "IV · El Caracol", short: "El Caracol", module: "s4-caracol.js", box: [D.carG.x0, -1, D.path.z0, D.carG.x1, 30, D.carG.z1], start: { x: CR.x, z: D.carG.z0 + 6, yaw: PI, y: 0 }, blurb: "The round tower on its platforms whose windows may have followed Venus." }
];

// ---------------------------------------------------------------- walkable regions
const r1 = (o) => region(Object.assign({ outside: true }, o));
const hb = CS.base / 2 + 0.5, sp = CS.top / 2 + CS.h + 0.5, sw = CS.stairW / 2 + CS.balW + 0.4;
const ax0 = BC.x - BC.alleyW / 2, ax1 = BC.x + BC.alleyW / 2, az0 = BC.z - BC.alleyL / 2, az1 = BC.z + BC.alleyL / 2;
const regions = [
  // the vestibule
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0, holes: [[V0.x - 3.2, V0.x - 2.0, V0.z - 1.6, V0.z - 0.4]] }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  region({ id: "v-exit", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z + 4.6, z1: V0.z + 5.6, y: 0, inset: 0.05, portal: "museum", href: EXIT_HREF }),
  // the plaza of the Great Platform, with the ball court's alley open within it
  r1({ id: "plaza", section: "s1", x0: PZ.x0, x1: PZ.x1, z0: PZ.z0, z1: PZ.z1, y: 0, inset: 0.3, holes: [
    [-hb, hb, -hb, hb], [-sw, sw, -sp, -hb + 1], [-sw, sw, hb - 1, sp], [-sp, -hb + 1, -sw, sw], [hb - 1, sp, -sw, sw],
    [BC.x - BC.W / 2, ax0 + BC.benchD, az0, az1], [ax1 - BC.benchD, BC.x + BC.W / 2, az0, az1],
    [ax0 - 3, ax1 + 3, BC.z - BC.L / 2, BC.z - BC.L / 2 + 14], [ax0 - 3, ax1 + 3, BC.z + BC.L / 2 - 14, BC.z + BC.L / 2],
    [TZ.x0, TZ.x1, TZ.z0, TZ.z1], [WR.x0, WR.x1, WR.z0, WR.z1], [ax0 + BC.benchD, ax1 - BC.benchD, az0 + 0.5, az1 - 0.5]] }),
  // the playing alley of the ball court, open to the plaza at both ends
  r1({ id: "alley", section: "s2", x0: ax0 + BC.benchD, x1: ax1 - BC.benchD, z0: az0, z1: az1, y: 0, inset: 0.3, open: "ns" }),
  r1({ id: "to-v", section: "s1", x0: 59.2, x1: 60.8, z0: -75.5, z1: -74.5, y: 0, inset: 0.05, portal: "v" }),
  // the sacbe and the rim of the cenote
  r1({ id: "sacbe", section: "s3", x0: SB.x0, x1: SB.x1, z0: SB.z0, z1: SB.z1, y: 0, inset: 0.2, open: "ns" }),
  r1({ id: "rim", section: "s3", x0: D.rim.x0, x1: D.rim.x1, z0: D.rim.z0, z1: D.rim.z1, y: 0, inset: 0.3, open: "s",
    holes: [[CN.x - CN.r - 1, CN.x + CN.r + 1, CN.z - CN.r - 1, CN.z + CN.r + 0.45]] }),
  // the path south and the ground round El Caracol
  r1({ id: "path", section: "s4", x0: D.path.x0, x1: D.path.x1, z0: D.path.z0, z1: D.path.z1, y: 0, inset: 0.2, open: "ns" }),
  r1({ id: "carG", section: "s4", x0: D.carG.x0, x1: D.carG.x1, z0: D.carG.z0, z1: D.carG.z1, y: 0, inset: 0.3, open: "n",
    holes: [[CR.x - CR.low.w / 2 - 0.5, CR.x + CR.low.w / 2 + 0.5, CR.z - CR.low.d / 2 - 0.5, CR.z + CR.low.d / 2 + 0.5]] })
];
for (const r of regions) r.surface = r.section === "v" ? "wood" : r.id === "sacbe" ? "stone" : "rock";

// ---------------------------------------------------------------- the walking route (Walk on / Walk back)
const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),                                   // out to the plaza
  P(-45, -75, 0, true, -2.45),                                    // the pyramid from the north-west
  P(0, -sp - 6, 0, true, PI),                                     // the foot of the north stairway
  P(-90, -50, 0, true, PI),                                       // the platform of skulls
  P(BC.x, az1 - 3, 0, true, 0),                                   // the south end of the ball court
  P(BC.x, BC.z, 0, true, -PI / 2),                                // the middle: the rings
  P(ax0 + BC.benchD + 1.6, BC.z + 10, 0, true, PI / 2),           // the carved bench
  P(BC.x, az0 + 4, 0, false), P(-60, -126, 0, false),
  P(0, -200, 0, true, 0),                                         // on the sacbe
  P(0, -359.1, 0, true, 0),                                       // the edge of the cenote
  P(0, -126, 0, false), P(-40, 140, 0, false),
  P(-40, D.carG.z0 + 6, 0, true, PI)                             // El Caracol
];

// ---------------------------------------------------------------- info points
const info = [
  // ---- vestibule (the archive's own room)
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you go out", title: "Chichén Itzá",
    html: "<p>Chich&eacute;n Itz&aacute; was a Maya city in the north of the Yucat&aacute;n peninsula, founded around the sixth century; most of its great buildings probably date from about 900 to 1200. When it declined is read two ways: <em>Britannica</em> has it eclipsed by the rise of the city of May&aacute;pan from about 1200, while UNESCO says it declined rapidly after about 1440. The Maya did not vanish with it: Maya is still a living language here; in the state of Yucat&aacute;n alone, Mexico&rsquo;s 2020 census counted about 519,000 speakers.</p><p>This walk crosses the plaza of the Great Platform to the pyramid of Kukulkan, goes through the Great Ball Court, follows the causeway north to the Sacred Cenote, and ends at El Caracol to the south. The site is shown as a visitor finds it today; distances and most sizes are approximate, and the carvings are our own simple renderings.</p>",
    flags: [APPROX, RENDER, { t: "Decline: two dates", soft: false }], links: [L.ch29, L.v31], sources: REF.brit2 + "; " + REF.unesco + "; " + REF.ym + "; " + REF.famsf + "." },
  { id: "v-v31", section: "v", pos: [V0.x - 2.6, 1.35, V0.z - 1.0], relic: { id: "v31", slug: "dresden-codex", title: "The Dresden Codex", category: "Manuscripts & Codices", held: "SLUB Dresden (Saxon State and University Library), Mscr.Dresd.R.310", dated: "Usually dated 11th–14th century; the date is debated", kind: "codex" }, title: "The Dresden Codex (for comparison)",
    html: "<p><strong>Not from Chich&eacute;n Itz&aacute;.</strong> The Vault&rsquo;s folding book of bark paper is one of the four Maya books that survived the Spanish conquest. It is here because its tables follow the planet <strong>Venus</strong>, the planet that the windows of El Caracol, at the end of this walk, may have been built to watch.</p>",
    links: [L.v31] },
  { id: "v-door", section: "v", pos: [V0.x, 3.45, V0.z - 4.4], cat: "The way out", title: "To the plaza",
    html: "<p>Walk into the golden portal to step out onto the plaza of the Great Platform.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 3.45, V0.z + 4.4], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>This portal returns you to the museum, to the room of the Maya.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] },

  // ---- I: the Great Platform
  { id: "castillo", section: "s1", pos: [-36, 3.0, -64], cat: "I · The Great Platform", title: "The pyramid of Kukulkan",
    html: "<p>The Spanish called it <em>El Castillo</em>, the castle; it is also known as the Temple of Kukulkan, the Feathered Serpent. Its square base is 55.3 metres across, and nine stepped bodies rise 24 metres to the temple on top, which adds about 6 more. A stairway of about 91 steps climbs each side. Counting the top platform as a step gives 365, the days of the solar year; whether the builders meant this is not known.</p><p>The model is squared to the pyramid. In reality the pyramid, and the plaza with it, is turned about twenty degrees from true north: its north face lines up with sunset on 20 May and 24 July.</p>",
    flags: [APPROX, { t: "The count of 365 is a reading", soft: true }], links: [L.ch29], sources: REF.cas + "; " + REF.sp + "." },
  { id: "serpent", section: "s1", pos: [-9, 3.0, -38], cat: "I · The Great Platform", title: "The serpent of light",
    toggle: { id: "serpent", on: "Show the pattern of light", off: "Hide the pattern of light" },
    html: "<p>Late on afternoons around the spring and autumn equinoxes, the shadows of the pyramid&rsquo;s nine stepped corners fall on the side of the north stairway, leaving triangles of light that join the carved serpent heads at its foot: a serpent seems to come down the pyramid. Thousands gather to watch it each March.</p><p>It is widely presented as designed; whether it was is debated. The archaeoastronomers Ivan &Scaron;prajc and Pedro S&aacute;nchez Nava doubt it. Photographed day by day by them in 2017, the pattern looked much the same for about two weeks, and the number of triangles grew slowly over the weeks, from six towards nine, so it cannot mark one day. They trace the stress on the equinoxes to writers of the 1960s and 1970s, and find no good evidence that buildings were aligned to the equinoxes; near-equinox alignments, they argue, more likely marked the &lsquo;quarter days&rsquo;. Switch the view on to see the pattern as a simple overlay.</p>",
    flags: [CONTESTED], links: [L.ch29], sources: REF.sp + "; " + REF.sp21 + "; " + REF.cas + "." },
  { id: "inner", section: "s1", pos: [10, 3.0, -38], cat: "I · The Great Platform", title: "The pyramid inside",
    toggle: { id: "inner", on: "Show roughly where it lies", off: "Hide its outline" },
    html: "<p>The pyramid was built over an earlier one. Excavators in the 1930s found its temple: in 1935 a reclining stone figure of the kind called a <em>chac mool</em>, and in 1936 a throne in the form of a jaguar, painted red with cinnabar and set with jade. The sources disagree on dates, putting the inner pyramid at 600&ndash;800 and the outer at 900&ndash;1000 or later; scans in 2018 suggested an even earlier phase within. In 2015 a survey found that the pyramid stands over a water-filled cavity, a cenote, about 25 by 35 metres.</p><p>The outline shown is a rough guess at the inner pyramid&rsquo;s size, not a survey.</p>",
    flags: [APPROX], links: [L.ch29], sources: REF.cas + "." },
  { id: "tzompantli", section: "s1", pos: [-90, 2.4, -44], cat: "I · The Great Platform", title: "The platform of skulls",
    html: "<p>This low platform, the <em>tzompantli</em> or skull rack, has sides carved with rows of skulls in horizontal bands. Racks of this kind held the heads of sacrificed victims for public display, and skulls found at Chich&eacute;n itself carry the marks of such impalement. Because it stands beside the ball court, many connect it with the ball game, though that link is a reading of the carvings. No remains are shown in this model.</p>",
    flags: [RENDER, REMAINS], links: [L.ch29], sources: REF.oh3d + "; " + REF.tm + "; " + REF.unesco + "; " + REF.tzo + "." },
  { id: "warriors", section: "s1", pos: [88, 3.0, -4], cat: "I · The Great Platform", title: "The Temple of the Warriors",
    html: "<p>East of the plaza stand the Temple of the Warriors and the Group of the Thousand Columns, here only simple masses. Buildings like these, and the feathered serpents everywhere in this part of the city, closely resemble those of Tula, far to the west in central Mexico. How it came about is one of the great debates of Mesoamerican archaeology. Older accounts, UNESCO&rsquo;s among them, say that Toltec warriors from the Mexican plateau took the city in the tenth century; <em>Britannica</em> writes of invaders who were probably Maya speakers, perhaps directed by the Toltecs. A 2016 study of a carved disc from El Caracol reads it as recording the arrival of &lsquo;Mexican-Toltec&rsquo; people and a refounding of the city that took in both the newcomers and part of the local nobility. Others, in the volume <em>Twin Tollans</em>, set migration and conquest aside for the cities&rsquo; social, political and economic ties, and some have suggested that Chich&eacute;n influenced Tula rather than the reverse. The question is open.</p>",
    flags: [CONTESTED, APPROX], links: [L.ch29], sources: REF.unesco + "; " + REF.brit2 + "; " + REF.disc + "; " + REF.tt + "; " + REF.whe + "." },

  // ---- II: the Great Ball Court
  { id: "ballcourt", section: "s2", pos: [BC.x + 4, 2.6, az1 + 2], cat: "II · The Great Ball Court", title: "The largest ball court",
    html: "<p>The Great Ball Court is the largest known in ancient Mesoamerica: 166 by 68 metres overall, by one record; the Metropolitan Museum gives the court as about 96 by 30 metres. The model takes that second figure for the playing alley between the two long walls. Players kept a heavy ball of solid rubber in play, and in some versions of the game tried to send it through a stone ring set high on each wall; the rings here are carved with intertwined serpents. In the model, simple temples stand at its ends.</p>",
    flags: [APPROX], links: [L.ch29], sources: REF.gwr + "; " + REF.met + "." },
  { id: "rings", section: "s2", pos: [BC.x + 6, 2.6, BC.z - 1], cat: "II · The Great Ball Court", title: "The game and the gods",
    html: "<p>The ball game was played across Mesoamerica for more than three thousand years. It was a sport, and also a rite: some scholars read the ball&rsquo;s flight as the sun&rsquo;s passage between day and night, ball courts were thought of as connections to the underworld, and in Maya stories the game is the setting for battles between the forces of life and death.</p>",
    flags: [BELIEF], links: [L.ch29], sources: REF.met + "; " + REF.gwr + "." },
  { id: "relief", section: "s2", pos: [ax0 + BC.benchD + 0.8, 2.2, BC.z + 7.5], cat: "II · The Great Ball Court", title: "The carved benches",
    html: "<p>The sloping benches along the foot of the walls carry long carved panels of ball players meeting at a great ball marked with a skull. On the right a player kneels, beheaded; blood springs from his neck as serpents and growing plants. Who he was is not known. He is often read as a player of the losing team, but the Metropolitan Museum&rsquo;s essay on the game says it is unclear who was sacrificed and when, and how the sacrifice related to the game itself. The plants are read as the power of sacrificial blood to bring new life. Six panels on the court show the same scene.</p><p>The panel here is our own simple rendering of the subject, not a copy.</p>",
    flags: [RENDER, CONTESTED, BELIEF], links: [L.ch29], sources: REF.famsf + "; " + REF.met + "; " + REF.tzo + "." },

  // ---- III: the Sacred Cenote
  { id: "sacbe", section: "s3", pos: [3.6, 2.4, -196], cat: "III · The Sacred Cenote", title: "The white road",
    html: "<p>A raised causeway, a <em>sacbe</em> or &lsquo;white road&rsquo;, runs about 300 metres north from the Great Platform to the Sacred Cenote. The pyramid&rsquo;s north stairway, the one with the serpent heads, faces this way, and &Scaron;prajc and S&aacute;nchez Nava suggest that it marked the main entrance towards the cenote.</p>",
    flags: [APPROX], sources: REF.cen + "; " + REF.sp + "." },
  { id: "cenote", section: "s3", pos: [-3.6, 2.4, -357], cat: "III · The Sacred Cenote", title: "The Sacred Cenote",
    html: "<p>A cenote is a sinkhole where the roof of a cave in the limestone has fallen in, opening on the water below; such wells gave the city its water. This one is about 60 metres across, with sheer sides falling some 27 metres to the water. For centuries it was a place of pilgrimage, one of the richest places of offering in the ancient Americas: hundreds of jade ornaments, some burned so that they shattered in the water; gold and copper from as far as Costa Rica and Panama; bowls of copal incense; wood and cloth that rarely survive elsewhere. The offerings date from about 700 to the fifteenth century.</p>",
    flags: [APPROX], links: [L.ch29], sources: REF.cen + "; " + REF.doyle + "." },
  { id: "victims", section: "s3", pos: [3.6, 2.4, -357], cat: "III · The Sacred Cenote", title: "Those given to the well",
    html: "<p>In 1566 the Spanish friar Diego de Landa wrote that in times of drought it was the custom to throw people alive into this well as a sacrifice to the gods. Human bones have since been brought up from it, but his is not the only picture: from his study of them, the archaeologist Guillermo de Anda concluded that the victims were usually, though not always, killed before they were put into the well. De Anda&rsquo;s study of some 2,500 bones recovered in the 1960s found that about four in five came from children, aged roughly three to eleven.</p><p>It was long assumed that the victims were mostly young women. In 2024 a study of ancient DNA from a cistern a short walk from the cenote found that all 64 children sampled there were boys, many of them related, among them two pairs of twins. The cenote&rsquo;s own remains have not yet been studied in this way. No remains are shown in this model.</p>",
    flags: [REMAINS], links: [L.ch29], sources: REF.cen + "; " + REF.wa + "; " + REF.ng + "." },
  { id: "dredge", section: "s3", pos: [0, 2.6, -350], cat: "III · The Sacred Cenote", title: "The dredging",
    html: "<p>From 1904 the American consul Edward H. Thompson, who had bought the land, dredged the cenote and later dived in it, with money from Harvard&rsquo;s Peabody Museum and private collectors in Boston. Most of the gold, jade and other finds went to the Peabody. A study in <em>Historia Mexicana</em> describes the work as looting, the objects taken out of Mexico unlawfully through a network Thompson built. Expeditions with Mexico&rsquo;s national institute of archaeology, INAH, worked in the cenote again in 1961 and in 1967&ndash;68.</p>",
    flags: [SENS], links: [L.ch29], sources: REF.hm + "; " + REF.doyle + "; " + REF.cen + "." },

  // ---- IV: El Caracol
  { id: "caracol", section: "s4", pos: [CR.x + 3.6, 2.6, D.carG.z0 + 3], cat: "IV · El Caracol", title: "El Caracol",
    html: "<p>The Spanish named it <em>the snail</em> for the spiral stair inside its round tower. The tower stands on a platform reached by a great stairway on two levels. A dated stone on the upper platform has been read as about 906; a 2016 study dates a carved stone disc from the building to 929&ndash;932. Part of the tower has fallen.</p>",
    flags: [APPROX], links: [L.ch29], sources: REF.car + "; " + REF.disc + "; " + REF.whe + "; " + REF.expl + "." },
  { id: "venus", section: "s4", pos: [CR.x - 3.6, 2.6, D.carG.z0 + 3], cat: "IV · El Caracol", title: "Watching Venus?",
    html: "<p>Three narrow openings survive in the upper tower. In 1975 the astronomer Anthony Aveni and his colleagues measured the building; studies of it count sightlines towards twenty of twenty-nine events on the horizon that its makers might have wanted to watch. The Exploratorium&rsquo;s account names among them the furthest points north and south at which Venus rises, and the sunset at the equinoxes; &Scaron;prajc, whose doubts are on the serpent card, finds no good evidence that Mesoamerican buildings were aligned to the equinoxes. Venus mattered greatly to the Maya: the Dresden Codex in the Vault holds tables that follow its cycle.</p><p>Their paper ended its title with a question mark, and the case is still open: with part of the tower lost and many possible targets, some alignments could be chance.</p>",
    flags: [CONTESTED], links: [L.v31, L.ch29], sources: REF.aveni + "; " + REF.car + "; " + REF.expl + "; " + REF.sp21 + "." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>From published figures:</strong> the base, height, stepped bodies and stairways of the pyramid; the overall size of the ball court (Guinness) and the Metropolitan Museum&rsquo;s court figure, used for its alley; the length of the causeway; the width of the cenote and the drop to its water.</p>" +
    "<p><strong>Approximate:</strong> where each building stands and the distances between them, the shape of the temple on the pyramid, the walls and temples of the ball court, the Temple of the Warriors, El Caracol, and the inner pyramid&rsquo;s outline. The carvings are our own simple renderings, and the pattern of light is an overlay, not a calculation.</p>" +
    "<p><strong>Not shown:</strong> most of the city&rsquo;s buildings, the trees on and round the plaza, the stalls and the crowds, and the true turn of the site from north.</p>",
  links: [L.ch29, L.v31], sources: REF.cas + "; " + REF.gwr + "; " + REF.met + "; " + REF.cen + "." };

// a humid sky over the Yucatán lowlands; afternoon sun from the west
const sky = { bg: "#bcd2e2", fog: "#d4dbcf", hemi: "#eef2ea", ground: "#8e9668", sunPos: [-80, 55, 10], sun: 1.55 };

export default { title: "Chichén Itzá", version: 1, stones: ["limestone", "rock", "floor", "turf", "wood"], sky, sections, regions, route, info, about, D, V0 };
