/* ==========================================================================
   Delphi — the site: sections, walkable regions, route, info points.
   Geometry lives in the section modules (s0-vestibule.js … s4-stadium.js),
   measurements in dims.js, the column, roof, hillside and texture builders in
   greek.js.

   Status: "preview" in docs/assets/pilgrimage-data.js. The page exists
   (noindex) but the site is off the menu until Carter approves it going live.
   Plan: plans/pilgrimage-sites.md (III · Early Iron Age). Sources:
   sources/pilgrimage-delphi.md.

   The moment shown: the sanctuary as Pausanias described it, about 170 CE.
   Frame: metres; x east, y up, z south. The temple terrace is y = 0. The
   Sacred Way is straightened into square runs, and every placing is APPROX
   (dims.js).
   ========================================================================== */
import { region } from "../../kit.js?v=1";
import { D, templeCols, porchCols, naosCols } from "./dims.js?v=1";

const PI = Math.PI;                           // yaw 0 faces north, PI south, PI/2 west, -PI/2 east
export const V0 = { x: 320, z: 0 };          // the archive's own vestibule
export const ST = D.stadium;
export const EXIT_HREF = "../museum.html#ch08";
const T = D.temple, C = D.cella, TH = D.theatre, TY = T.crepis;

// ---------------------------------------------------------------- short references (full list: sources/pilgrimage-delphi.md)
const REF = {
  paus: "Pausanias, <em>Description of Greece</em> 10.5&ndash;10.32 (about 170 CE)",
  hdt: "Herodotus, <em>Histories</em>",
  plutE: "Plutarch, <em>On the E at Delphi</em>",
  plutDef: "Plutarch, <em>On the Obsolescence of Oracles</em>",
  plutPy: "Plutarch, <em>On the Pythia&rsquo;s Oracles</em>",
  moc: "Hellenic Ministry of Culture, Archaeological Site of Delphi (delphi.culture.gr)",
  mocEx: "Hellenic Ministry of Culture, &ldquo;History of the excavations at Delphi&rdquo; (delphi.culture.gr)",
  museum: "Delphi Archaeological Museum, &ldquo;The Delphic Hymns to Apollo&rdquo; (2025)",
  oxford: "Ancient Music at Oxford, programme notes on the Delphic Paean of Athenaios",
  deboer: "J. Z. de Boer, J. R. Hale and J. Chanton, &ldquo;New evidence for the geological origins of the ancient Delphic oracle (Greece)&rdquo;, <em>Geology</em> 29 (August 2001)",
  etiope: "G. Etiope, P. Favali, G. Papatheodorou, D. Christodoulou and M. Geraga, &ldquo;The geological links of the ancient Delphic Oracle (Greece): a reappraisal of natural gas occurrence and origin&rdquo;, <em>Geology</em> 34.10 (2006), 821&ndash;824",
  boutsikas: "E. Boutsikas and A. Salt, &ldquo;Knowing when to consult the oracle at Delphi&rdquo;, <em>Antiquity</em> 79 (2005), 564&ndash;572",
  livius: "Livius.org, &ldquo;Constantinople, Hippodrome, Serpent Column&rdquo;",
  manum: "the manumission inscriptions of Delphi (some 1,300, most 200 BCE&ndash;100 CE), as surveyed in the scholarship on them",
  odyssey: "Odyssey Adventures, &ldquo;The Theatre and Stadium&rdquo; (Delphi), on the rows, the seating and the repairs",
  pearse: "R. Pearse, &ldquo;The last oracle of Delphi&rdquo; (2018), on Philostorgius and Cedrenus",
  mocTemple: "Hellenic Ministry of Culture, &ldquo;The Temple of Apollo&rdquo; (delphi.culture.gr)",
  mocSphinx: "Hellenic Ministry of Culture, &ldquo;The Stele and the Sphinx of the Naxians&rdquo; (delphi.culture.gr)",
  museumSphinx: "Delphi Archaeological Museum, &ldquo;The Column of the Naxians and the Sphinx&rdquo; (2024)",
  hymnText: "the text of the first hymn as edited by W. D. Furley and J. M. Bremer (2001), reproduced in &ldquo;The Hellenistic hymns to Apollo with musical notation from Delphi&rdquo; (classics-at.chs.harvard.edu); translation after Attic Inscriptions Online, CID III 1",
  baly: "Kenyon College, Baly slide collection, &ldquo;Athenian Treasury&rdquo; (baly.kenyon.edu/slides/23064)",
  whe: "World History Encyclopedia, &ldquo;Delphi&rdquo; (worldhistory.org/delphi)",
  kastri: "Delphi Archaeological Museum archive, &ldquo;The construction of the new village Kastri at the site of the present-day Delphi&rdquo; (1892), via SearchCulture.gr",
  plutNuma: "Plutarch, <em>Life of Numa</em> 9 (the undying fire at Delphi, kept by widows)",
  wikiStadium: "Wikipedia, &ldquo;Stadium of Delphi&rdquo; (track length and capacity)",
  wikiOmph: "Wikipedia, &ldquo;Omphalos of Delphi&rdquo; (the museum stone, original or copy)",
  unesco: "UNESCO World Heritage Centre, &ldquo;Archaeological Site of Delphi&rdquo; (site 393, inscribed 1987)",
  ch08: "the archive&rsquo;s chapter on early Greece (ch08)",
  ch15: "the archive&rsquo;s chapter on classical Greece (ch15)"
};
const L = {
  ch08: { href: "../chapters/ch08.html", label: "Read the chapter on early Greece" },
  ch15: { href: "../chapters/ch15.html", label: "Classical Greece" },
  v39: { href: "../vault/derveni-papyrus.html", label: "The Derveni Papyrus (Vault)" }
};
const APPROX = { t: "Layout after published plans · positions approximate", soft: true };
const RECON = { t: "Reconstruction: the building as it may have stood", soft: true };
const CONTESTED = { t: "Contested", soft: false };
const NOTSUP = { t: "Not supported by the evidence", soft: false };
const BELIEF = { t: "What was believed, not a finding", soft: true };

// ---------------------------------------------------------------- sections
const BIG = [-150, -40, -160, 150, 260, 150];          // the sanctuary is open ground: its three sections share one box
const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: the portal back to the museum, a Vault book of Greek religion for comparison, and the way out to the sanctuary." },
  { id: "s1", name: "I · The Sacred Way", short: "the Sacred Way", module: "s1-way.js", box: BIG, start: { x: 61, z: 67, yaw: PI / 2, y: D.gate.y }, blurb: "From the main gate up the Sacred Way, past the offerings of the cities, the treasuries, the Rock of the Sibyl and the Stoa of the Athenians." },
  { id: "s2", name: "II · The Temple of Apollo", short: "the temple", module: "s2-temple.js", box: BIG, start: { x: 50, z: 7, yaw: 1.45, y: 0 }, blurb: "The altar, the Serpent Column, and the temple itself: the porch with its maxims, the hall, and the inner room where the Pythia sat." },
  { id: "s3", name: "III · The theatre", short: "the theatre", module: "s3-theatre.js", box: BIG, start: { x: -30, z: -43, yaw: 0, y: TH.y }, blurb: "Thirty-five rows of seats above the temple, and the view down the valley." },
  { id: "s4", name: "IV · The stadium", short: "the stadium", module: "s4-stadium.js", box: [ST.x - 110, -5, ST.z - 40, ST.x + 110, 30, ST.z + 40], start: { x: ST.x + ST.L / 2 + 10, z: ST.z, yaw: PI / 2, y: 0 }, blurb: "The running track of the Pythian Games, high above the sanctuary, in its Roman stone." }
];

// ---------------------------------------------------------------- walkable regions
const r1 = (o) => region(Object.assign({ outside: true }, o));
const holesAt = (pts, h) => pts.map(([x, z]) => [x - h, x + h, z - h, z + h]);
const cx0 = C.x0, cx1 = C.x1, cz0 = C.z0, cz1 = C.z1, wt = C.wallT, xPN = cx1 - C.pronaos, xNA = cx0 + C.adyton;
const TR = D.terrace, ox = T.L / 2 + 1.0, oz = T.W / 2 + 1.0;
const regions = [
  // the vestibule
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0, holes: [[V0.x - 3.2, V0.x - 2.0, V0.z - 1.6, V0.z - 0.4]] }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  region({ id: "v-exit", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z + 4.6, z1: V0.z + 5.6, y: 0, inset: 0.05, portal: "museum", href: EXIT_HREF }),
  // the Sacred Way, gate to terrace
  r1(Object.assign({ id: "gate", section: "s1", inset: 0.2, open: "w" }, D.gate)),
  r1(Object.assign({ id: "to-v", section: "s1", inset: 0.05, portal: "v" }, { x0: 63.4, x1: 64.4, z0: 66.2, z1: 67.8, y: D.gate.y })),
  r1(Object.assign({ id: "way-a", section: "s1", axis: "x", inset: 0.3, open: "ew" }, D.wayA)),
  r1(Object.assign({ id: "k1", section: "s1", inset: 0.3, open: "en" }, D.k1)),
  r1(Object.assign({ id: "way-b", section: "s1", inset: 0.3, open: "ns" }, D.wayB)),
  r1(Object.assign({ id: "k2", section: "s1", inset: 0.3, open: "se" }, D.k2)),
  r1(Object.assign({ id: "way-c", section: "s1", axis: "x", inset: 0.3, open: "we" }, D.wayC)),
  r1(Object.assign({ id: "k3", section: "s1", inset: 0.3, open: "wn" }, D.k3)),
  r1(Object.assign({ id: "way-d", section: "s1", inset: 0.3, open: "sn" }, D.wayD)),
  // the temple terrace, the ramp and the temple
  r1({ id: "terrace", section: "s2", x0: TR.x0, x1: TR.x1, z0: TR.z0, z1: TR.z1, y: 0, inset: 0.3, open: "",
    holes: [[T.x - ox, T.x + ox, T.z - oz, T.z + oz], [D.altar.x - D.altar.L / 2 - 0.3, D.altar.x + D.altar.L / 2 + 0.3, D.altar.z - D.altar.W / 2 - 0.3, D.altar.z + D.altar.W / 2 + 0.3], [D.serpent.x - 1.2, D.serpent.x + 1.2, D.serpent.z - 1.2, D.serpent.z + 1.2]] }),
  r1({ id: "ramp", section: "s2", axis: "x", x0: D.ramp.x0, x1: D.ramp.x1, z0: -D.ramp.w / 2, z1: D.ramp.w / 2, y: TY, y1: 0, inset: 0.15, open: "we" }),
  r1({ id: "stylobate", section: "s2", x0: T.x - T.L / 2, x1: T.x + T.L / 2, z0: T.z - T.W / 2, z1: T.z + T.W / 2, y: TY, inset: 0.35,
    holes: holesAt(templeCols(), T.colR + 0.15).concat([[cx0, cx1, cz0, cz1]]) }),
  region({ id: "cella", section: "s2", x0: cx0 + wt, x1: cx1, z0: cz0 + wt, z1: cz1 - wt, y: TY, inset: 0.25, open: "e",
    holes: holesAt(porchCols(), 0.55).concat(holesAt(naosCols(), 0.45), [
      [xPN - wt / 2, xPN + wt / 2, cz0, -1.4], [xPN - wt / 2, xPN + wt / 2, 1.4, cz1],            // the wall between porch and hall, with its door
      [xNA - wt / 2, xNA + wt / 2, cz0, -1.1], [xNA - wt / 2, xNA + wt / 2, 1.1, cz1],            // the wall before the inner room, with its door
      [-19.4, -17.6, -0.9, 0.9], [-16.6, -15.0, 1.2, 2.8], [-16.4, -15.2, -3.4, -2.0]]) }),       // omphalos, tripod, laurel
  // up to the theatre, and the theatre
  r1(Object.assign({ id: "to-theatre", section: "s3", inset: 0.3, open: "sn" }, D.toTheatre)),
  r1(Object.assign({ id: "parodos", section: "s3", inset: 0.3, open: "sw" }, D.parodos)),
  r1({ id: "orchestra", section: "s3", x0: TH.x - 6.5, x1: TH.x + 6.5, z0: TH.z - 6.5, z1: TH.z + 6.5, y: TH.y, inset: 0.2, open: "e", holes: [[TH.x - 0.9, TH.x + 0.9, TH.z - 0.9, TH.z + 0.9]] }),
  r1({ id: "orch-n", section: "s3", x0: TH.x - 1, x1: TH.x + 1, z0: TH.z - TH.orchR, z1: TH.z - 6.0, y: TH.y, inset: 0.1, open: "ns" }),
  r1({ id: "cavea", section: "s3", x0: TH.x - 1, x1: TH.x + 1, z0: TH.z - TH.orchR, z1: TH.z - TH.orchR - TH.rows * TH.rowD, y: TH.y, y1: TH.y + TH.rows * TH.rowH, inset: 0.1, open: "ns" }),
  r1({ id: "cavea-top", section: "s3", x0: TH.x - 6, x1: TH.x + 6, z0: TH.z - TH.orchR - TH.rows * TH.rowD - 2.4, z1: TH.z - TH.orchR - TH.rows * TH.rowD, y: TH.y + TH.rows * TH.rowH, inset: 0.2, open: "s" }),
  r1({ id: "to-stadium", section: "s3", x0: TH.x - 0.9, x1: TH.x + 0.9, z0: TH.z - TH.orchR - TH.rows * TH.rowD - 2.9, z1: TH.z - TH.orchR - TH.rows * TH.rowD - 2.1, y: TH.y + TH.rows * TH.rowH, inset: 0.05, portal: "s4" }),
  // the stadium
  r1({ id: "track", section: "s4", x0: ST.x - ST.L / 2 + 1, x1: ST.x + ST.L / 2 + 12, z0: ST.z - ST.W / 2, z1: ST.z + ST.W / 2, y: 0, inset: 0.4,
    holes: [-9.6, -3.2, 3.2, 9.6].map((d) => [ST.x + ST.L / 2 + 2.6 - 1.0, ST.x + ST.L / 2 + 2.6 + 1.0, ST.z + d - 1.0, ST.z + d + 1.0]) }),
  r1({ id: "s-back", section: "s4", x0: ST.x + ST.L / 2 + 12.4, x1: ST.x + ST.L / 2 + 13.4, z0: ST.z - 0.9, z1: ST.z + 0.9, y: 0, inset: 0.05, portal: "s3" })
];
for (const r of regions) r.surface = r.section === "v" ? "wood" : "stone";

// ---------------------------------------------------------------- the walking route (Walk on / Walk back)
const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const wA = (x) => D.wayA.y + (D.wayA.y1 - D.wayA.y) * (x - D.wayA.x0) / (D.wayA.x1 - D.wayA.x0);
const wB = (z) => D.wayB.y + (D.wayB.y1 - D.wayB.y) * (z - D.wayB.z0) / (D.wayB.z1 - D.wayB.z0);
const wC = (x) => D.wayC.y + (D.wayC.y1 - D.wayC.y) * (x - D.wayC.x0) / (D.wayC.x1 - D.wayC.x0);
const topY = TH.y + TH.rows * TH.rowH, topZ = TH.z - TH.orchR - TH.rows * TH.rowD;
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),                              // out to the sanctuary
  P(61, 67, D.gate.y, true, PI / 2),                         // the main gate
  P(50, 67, wA(50), true, PI * 0.15),                        // the offerings of the cities
  P(-8, 67, wA(-8), true, -2.25),                            // the Siphnian Treasury
  P(-23, 66, D.k1.y, false),
  P(-23, 56, wB(56), true, PI / 2),                          // the Athenian Treasury
  P(-23, 44, wB(44), true, -PI * 0.42),                      // the Rock of the Sibyl
  P(-23, 33, D.k2.y, false),
  P(0, 33, wC(0), true, 0),                                  // the Stoa and the Polygonal Wall
  P(25, 33, D.k3.y, false),
  P(25, 18, 0, false),
  P(50, 7, 0, true, 1.45),                                   // the temple's east front
  P(41, 8.6, 0, true, PI),                                   // the Serpent Column
  P(39, 0, 0, false),
  P(28, 0, TY, true, PI / 2),                                // the porch: the maxims
  P(14.2, 0, TY, true, PI / 2),                              // the hall
  P(-13.4, 0, TY, true, PI / 2),                             // the inner room
  P(14.2, 0, TY, false), P(28, 0, TY, false), P(39, 0, 0, false),
  P(-12, -18, 0, false),
  P(-12, -44.5, TH.y, false), P(-18, -48, TH.y, false),
  P(TH.x, TH.z + 5, TH.y, true, 0),                          // the orchestra
  P(TH.x, topZ - 1.2, topY, true, PI),                       // the top of the theatre
  P(TH.x, topZ - 2.4, topY, true, 0),                        // the way up to the stadium
];

// ---------------------------------------------------------------- info points
const info = [
  // ---- vestibule (the archive's own room)
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you go out", title: "Delphi",
    html: "<p>Delphi lies on a shelf of the southern slope of Mount Parnassus, under two great cliffs, above the valley of the Pleistos. For more than a thousand years Greeks came here to put questions to Apollo through his priestess, the <strong>Pythia</strong>, and believed the spot to be the centre of the earth.</p><p>This walk climbs the <strong>Sacred Way</strong> from the main gate past the offerings of the cities, enters the <strong>Temple of Apollo</strong>, and goes up to the <strong>theatre</strong> and the <strong>stadium</strong>. It shows the sanctuary as the travel writer Pausanias described it, about 170 CE. The buildings are rebuilt from their ruins at approximate size; the Sacred Way is straightened; the stone is drawn in code.</p>",
    flags: [APPROX, RECON], links: [L.ch08, L.ch15], sources: REF.paus + "; " + REF.unesco + "; " + REF.ch08 + "." },
  { id: "v-v39", section: "v", pos: [V0.x - 2.6, 1.35, V0.z - 1.0], relic: { id: "v39", slug: "derveni-papyrus", title: "The Derveni Papyrus", category: "Manuscripts & Codices", held: "Archaeological Museum of Thessaloniki", dated: "Roll c. 340–320 BCE; the text composed c. 400 BCE", kind: "scroll" }, title: "The Derveni Papyrus (for comparison)",
    html: "<p><strong>Not from Delphi.</strong> The Vault&rsquo;s charred roll, found in a tomb near Thessaloniki, is the oldest surviving book in Europe: a commentary on a secret Orphic poem about the birth of the gods. It is here because it was written in the same centuries that Delphi was at its height, and shows a side of Greek religion, private and initiatory, that the great public sanctuary does not.</p>" },
  { id: "v-door", section: "v", pos: [V0.x, 3.45, V0.z - 4.4], cat: "The way out", title: "To the sanctuary",
    html: "<p>Walk into the golden portal to step out at the main gate of the sanctuary of Apollo.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 3.45, V0.z + 4.4], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>This portal returns you to the museum, to the room of early Greece.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] },

  // ---- I: the Sacred Way
  { id: "gate", section: "s1", pos: [58.5, D.gate.y + 1.7, 64.6], cat: "I · The Sacred Way", title: "The sanctuary of Apollo",
    html: "<p>The sanctuary is a walled precinct climbing the hillside in terraces. A single path, the Sacred Way, zigzags up from the main gate in the south-east corner to the temple, lined on both sides with the treasuries and statues the Greek cities set up to thank the god and to outdo each other. In the model the zigzag is straightened into four runs.</p><p>Pilgrims came to ask Apollo&rsquo;s advice through the Pythia: cities about wars, colonies and laws, private people about marriage, children, debts and journeys. Delphi was also the seat of the Pythian Games, held every four years, and a common ground where rival states met.</p>",
    flags: [APPROX], links: [L.ch08], sources: REF.paus + "; " + REF.moc + "; " + REF.ch08 + "." },
  { id: "offerings", section: "s1", pos: [47, wA(47) + 1.9, 62.6], cat: "I · The Sacred Way", title: "The offerings of the cities",
    html: "<p>Just inside the gate Pausanias saw a bronze bull sent by the people of Corcyra, statues set up by the Arcadians, the admirals of Sparta who won the last battle of the Peloponnesian War, and a half-round of Argive kings and heroes. Each was a statement in stone, set up where every visitor had to pass it.</p><p>By his day many bases were empty. Pausanias says that Nero carried off five hundred bronze statues, &ldquo;some of gods, some of men&rdquo;. Here the bases carry a few simple figures and stand partly bare.</p>",
    flags: [APPROX, { t: "Figures: our own simple renderings", soft: true }], sources: REF.paus + " (10.7.1 on Nero; 10.9&ndash;10.10 on the offerings)." },
  { id: "siphnian", section: "s1", pos: [6.2, wA(6) + 2.6, 71.0], cat: "I · The Sacred Way", title: "The Treasury of the Siphnians",
    html: "<p>The treasuries were small temple-like buildings that held a city&rsquo;s gifts to the god. The people of Siphnos built theirs around 530&ndash;525 BCE with a tithe of the profits of their island&rsquo;s gold and silver mines, as Herodotus and Pausanias both record. It was one of the richest buildings of its day: instead of columns its porch had two statues of women, caryatids, and a carved frieze ran round all four sides, with the battle of the gods and giants on the north.</p>",
    flags: [APPROX, RECON], sources: REF.moc + " (&ldquo;The Siphnian Treasury&rdquo;); " + REF.hdt + " 3.57; " + REF.paus + " 10.11.2." },
  { id: "athenian", section: "s1", pos: [-27.4, wB(55.6) + 2.4, 55.6], cat: "I · The Sacred Way", title: "The Treasury of the Athenians",
    html: "<p>A small Doric building of island marble from Paros, with two columns between the ends of its side walls. Pausanias says the Athenians built it from the spoils of Marathon, 490 BCE, and the inscription on the base along its south side says the same; scholars have debated the date, placing it anywhere between about 510 and 480 BCE. The question is open.</p><p>Its walls became a notice board: honours for Athenians, and the two <strong>Delphic Hymns</strong> to Apollo. The building you see in Delphi today was put back together by French archaeologists in 1906, paid for by the city of Athens, from about four-fifths of its original stone; the hymn panel on it is now a plaster copy, the stone itself in the museum.</p>",
    flags: [CONTESTED, { t: "Size published; the rest approximate", soft: true }], links: [L.ch15], sources: REF.paus + " 10.11.5; " + REF.moc + " (&ldquo;The Athenian Treasury&rdquo;); Museum of Classical Archaeology, Cambridge, &ldquo;Treasury of the Athenians&rdquo; (museum.classics.cam.ac.uk/node/3539); " + REF.baly + "." },
  { id: "hymns", section: "s1", pos: [-33.6, wB(59.6) + 1.5, 59.4], cat: "I · The Sacred Way", title: "Music written on the wall",
    html: "<p>On the south wall of the Athenian treasury were carved two hymns to Apollo with their music: small letter-signs written above the words give the pitch of each syllable. The French excavators found the fragments in 1893. The first names its composer, Athenaios son of Athenaios. They date from the Athenian processions to Delphi in the late second century BCE; the first has been dated about 138 BCE, though the reading of its heading is damaged and other scholars date it about 128 BCE.</p><p>The panel here carries the opening words of the first hymn as editors read them: &ldquo;Listen, fair-armed daughters of far-thundering Zeus, who received as your share densely wooded Helikon&rdquo;, calling the Muses to come. The stone is broken at the start, so the first word is an editor&rsquo;s restoration. The small signs drawn above the words are illustrative, not the hymn&rsquo;s notes.</p>",
    flags: [{ t: "Words: the editors&rsquo; text; signs illustrative", soft: true }, CONTESTED], links: [L.ch15], sources: REF.museum + "; " + REF.oxford + "; " + REF.hymnText + "; " + REF.mocEx + "." },
  { id: "sibyl", section: "s1", pos: [-17.2, wB(41) + 2.9, 41.2], cat: "I · The Sacred Way", title: "The Rock of the Sibyl",
    html: "<p>A bare outcrop beside the way. The Delphians told Pausanias that a woman called Herophile, the Sibyl, stood on it and sang her prophecies, older than Apollo&rsquo;s oracle. Beside it stood the Sphinx of the Naxians, a winged lion-woman on an Ionic column about ten metres high, set up about 560 BCE; with its base and the sphinx the monument stood about twelve and a half metres.</p>",
    flags: [BELIEF, APPROX], sources: REF.paus + " 10.12.1; " + REF.mocSphinx + "; " + REF.museumSphinx + "." },
  { id: "stoa", section: "s1", pos: [-3.0, wC(-3) + 2.4, 28.4], cat: "I · The Sacred Way", title: "The Polygonal Wall and the Stoa of the Athenians",
    html: "<p>The temple terrace is held up by a wall of hard limestone blocks cut to many-sided shapes and fitted without mortar, built in the sixth century BCE. Its face is covered with inscriptions. Most are records of slaves being freed: by a legal fiction the owner sold the slave to Pythian Apollo, who then guaranteed the freedom. Some 1,300 such records survive at Delphi, most from 200 BCE to 100 CE, many on this wall behind the stoa.</p><p>The Athenians built the slender colonnade, the stoa, against the wall to show trophies of their sea victories. The letters on the wall here imitate the look of these records; they are not a transcription.</p>",
    flags: [APPROX, { t: "Lettering illustrative, not the text", soft: true }], sources: REF.manum + "; " + REF.paus + " 10.11.6; " + REF.mocEx + "." },

  // ---- II: the Temple of Apollo
  { id: "altar", section: "s2", pos: [D.altar.x - 1, D.altar.h + 0.9, D.altar.z - 3.8], cat: "II · The temple", title: "The Altar of the Chians",
    html: "<p>The great altar in front of the temple was given by the people of Chios. Here animals were sacrificed before a consultation; according to Plutarch a goat was first sprinkled with cold water, and only if it trembled was the god held to be willing to answer that day. The altar was restored in 1920 with the help of people from Chios.</p>",
    flags: [BELIEF, APPROX], sources: REF.plutDef + " (on the goat); " + REF.moc + "." },
  { id: "serpent", section: "s2", pos: [D.serpent.x - 1.6, D.serpent.h + 0.6, D.serpent.z - 1.2], cat: "II · The temple", title: "The Serpent Column",
    html: "<p>After the Greeks defeated the Persians at Plataea in 479 BCE they dedicated a golden tripod here, standing on a bronze column of three twisted snakes. The coils bear the names of the thirty-one city-states that fought. Herodotus describes it; Thucydides tells how the Spartan general Pausanias had his own name carved on it and the Spartans had it erased.</p><p>The gold was taken by the Phocians in the fourth century BCE, but the bronze was still standing when the writer Pausanias saw it. The emperor Constantine moved the column to Constantinople, where it still stands in the old Hippodrome of Istanbul; its heads were broken off around 1700, and one survives in the Istanbul Archaeological Museum.</p>",
    flags: [APPROX], sources: REF.hdt + " 9.81; Thucydides 1.132; " + REF.paus + " 10.13.9; " + REF.livius + "." },
  { id: "temple", section: "s2", pos: [33.6, 4.0, 6.6], cat: "II · The temple", title: "Six temples, one place",
    html: "<p>Legend told of a first temple of laurel boughs, then one of beeswax and feathers, then one of bronze. The first stone temple burned in 548 BCE. The Alcmaeonid family of Athens rebuilt it in the late sixth century, with a marble front; an earthquake wrecked that temple in 373 BCE, and the one in the model replaced it on the same foundations, a Doric temple of 6 by 15 columns. The Amphictyony, the league of states that ran the sanctuary, collected the money, and a board of temple-builders drawn from many cities oversaw it; work stopped in 356 BCE when war came to Delphi and resumed about 343, the temple was finished in 334&ndash;333 BCE and its pediment sculpture in 327. It stood, repaired, until late antiquity. What survives is its foundations and a few re-erected columns.</p>",
    flags: [RECON, { t: "Overall size published; the rest approximate", soft: true }], links: [L.ch08, L.ch15], sources: REF.paus + " 10.5.9&ndash;13; " + REF.hdt + " 2.180, 5.62 (the sixth-century rebuilding); " + REF.mocTemple + " (the fourth-century temple); " + REF.moc + "." },
  { id: "maxims", section: "s2", pos: [C.x1 - C.pronaos + 1.2, TY + 4.3, 2.4], cat: "II · The temple", title: "Know thyself",
    html: "<p>Pausanias saw maxims &ldquo;useful for the life of men&rdquo; written in the porch of the temple: <strong>Know thyself</strong> and <strong>Nothing in excess</strong>. Plato says the Seven Sages dedicated them, and in another dialogue quotes a third: &ldquo;Give a pledge, and ruin is near&rdquo;. Exactly where in the porch they were cut is not known, so their place on the wall here is our own.</p><p>The archive&rsquo;s chapter on early Greece says the maxims were inscribed on the omphalos stone. The ancient writers put them in the porch instead.</p>",
    flags: [{ t: "Wording ancient; placing illustrative", soft: true }], links: [L.ch08], sources: REF.paus + " 10.24.1; Plato, <em>Protagoras</em> 343a&ndash;b and <em>Charmides</em> 165a; " + REF.ch08 + "." },
  { id: "e", section: "s2", pos: [C.x1 - C.pronaos + 1.2, TY + 8.6, -0.9], cat: "II · The temple", title: "The E at Delphi",
    html: "<p>Among the dedications in the porch was a large letter <strong>E</strong>, first of wood, then bronze, then, Plutarch says, gold. Nobody in antiquity knew for sure what it meant. Plutarch, who was himself a priest at Delphi, wrote a whole dialogue weighing the answers: the number five, the word &ldquo;if&rdquo; with which questions to the oracle began, or <em>ei</em>, &ldquo;you are&rdquo;, a greeting to the god. He did not settle the question, and neither has anyone since.</p>",
    flags: [{ t: "Its meaning unknown", soft: false }, { t: "Placing illustrative", soft: true }], sources: REF.plutE + "." },
  { id: "hall", section: "s2", pos: [12.0, TY + 2.4, -2.2], cat: "II · The temple", title: "The hall",
    html: "<p>Inside the porch was the long hall of the temple, its roof carried on two rows of columns. Pausanias saw in the temple an altar of Poseidon, statues of two Fates with Zeus and Apollo as their guides, and the hearth; Plutarch says an undying fire was kept at Delphi, tended by widows past the age of marriage. Pausanias saw the iron chair of the poet Pindar too. How these were arranged is not known; this hall is left nearly empty.</p>",
    flags: [RECON], sources: REF.paus + " 10.24.4&ndash;5; " + REF.plutNuma + "." },
  { id: "adyton", section: "s2", pos: [-14.6, TY + 2.6, -3.4], cat: "II · The temple", title: "The inner room",
    html: "<p>At the back of the temple was the <em>adyton</em>, the room where no one else might go, and the Pythia sat on a tripod and spoke as the god. Before a consultation she purified herself with the water of the Castalian spring; the questioner, having paid and sacrificed, put the question, and priests gave out her answer, at times in verse.</p><p>The room&rsquo;s plan is not known. The foundations here were rebuilt so often, and later robbed, that the excavators could not recover it. The layout in the model, with the stone, the tripod and a laurel tree, follows the ancient writers, not a plan.</p>",
    flags: [RECON, BELIEF], links: [L.ch08], sources: REF.plutPy + "; " + REF.plutDef + "; " + REF.paus + " 10.24." },
  { id: "omphalos", section: "s2", pos: [-18.5, TY + 2.9, -1.0], cat: "II · The temple", title: "The navel of the earth",
    html: "<p>The Delphians said that Zeus released two eagles from the two ends of the world and they met here; a stone, the <em>omphalos</em> or navel, marked the spot. Pausanias saw it as a white stone, said to be the centre of all the earth. The ancient writers describe it wrapped in a net of woollen bands, with two golden eagles.</p><p>A carved marble omphalos found at Delphi is in the museum there; whether it is the temple&rsquo;s own stone or a later copy is not known.</p>",
    flags: [BELIEF, { t: "Our own rendering", soft: true }], links: [L.ch08], sources: REF.paus + " 10.16.3; " + REF.wikiOmph + "." },
  { id: "vapours", section: "s2", pos: [-15.8, TY + 2.7, 3.6], cat: "II · The temple", title: "Vapours from the earth?",
    html: "<p>Ancient writers say the Pythia&rsquo;s inspiration rose from the ground, and Plutarch speaks of a sweet-smelling vapour. For a century scholars doubted it, because the French excavators found no chasm under the temple. In 2001 the geologist Jelle de Boer and the archaeologist John Hale reported two faults crossing beneath the temple and traces of light gases, including <strong>ethylene</strong>, which can cause a trance, in a nearby spring.</p><p>In 2006 a team of geologists (Giuseppe Etiope, Giorgos Papatheodorou and others) measured gas round the temple again. They found methane, ethane and carbon dioxide seeping today, and argued that the rocks here could not make ethylene in amounts that would cause a trance; if gas played a part, they suggest, it was more likely a shortage of oxygen in the closed temple. Whether gas played any part is open. That the oracle&rsquo;s answers came from Apollo is a belief, not something evidence can test.</p>",
    flags: [CONTESTED, BELIEF], sources: REF.plutDef + "; " + REF.deboer + "; " + REF.etiope + "." },
  { id: "sky", section: "s2", pos: [44.0, 2.4, -8.0], cat: "II · The temple", title: "When the god came back",
    html: "<p>The oracle did not answer all year. Plutarch says that in the three winter months Apollo was held to be away and Dionysus ruled at Delphi. He also says that the Pythia once answered on one day a year only, in the month Bysios, which the Delphians kept as the birth of Apollo, and that in his day consultations were held once a month. That the monthly day was the seventh is a modern inference.</p><p>In 2005 Efrosyni Boutsikas and Alun Salt proposed a sky sign for the god&rsquo;s return: the first dawn rising of the constellation <strong>Delphinus</strong>, the Dolphin, linked to Apollo in myth. Because the mountains round Delphi hide the eastern horizon, they argue, the rising was seen here about a month later than elsewhere in Greece, which gave pilgrims time to travel. It is a proposal, argued from the sky and the landscape; no ancient text says so.</p>",
    flags: [CONTESTED], links: [L.ch15], sources: REF.plutE + " 389c (on Dionysus in winter); Plutarch, <em>Greek Questions</em> 9 (Bysios, the god&rsquo;s birth, the yearly and monthly consultations); " + REF.boutsikas + "." },

  // ---- III: the theatre
  { id: "theatre", section: "s3", pos: [TH.x + 3.4, TH.y + 1.6, TH.z + 4.2], cat: "III · The theatre", title: "The theatre",
    html: "<p>Thirty-five rows of stone seats, room for about five thousand people, built in stone in the fourth century BCE and repaired more than once, with money from King Eumenes II of Pergamon in the 150s BCE and again under Rome. The Pythian Games began as contests of music in honour of Apollo, the god of the lyre, and singing and playing were held here. The stage building is our own simple rendering.</p>",
    flags: [APPROX, RECON], sources: REF.moc + "; " + REF.odyssey + "; " + REF.paus + " 10.32.1." },
  { id: "decline", section: "s3", pos: [TH.x + 2.0, topY + 1.8, topZ - 1.0], cat: "III · The theatre", title: "The end of the oracle",
    html: "<p>A decree of the emperor Theodosius in the 390s CE closing the pagan sanctuaries brought a slow decline; a Christian community lived on at the site until it was abandoned in the seventh century, and later a village called Kastri grew over the ruins. Christian historians report a last oracle, given to an envoy of the emperor Julian about 362: &ldquo;Go tell the king the wondrous hall is fallen to the ground&rdquo;, Apollo has no house left, and the speaking water is silenced. It survives only in church historians writing decades or centuries later, and may not be genuine.</p><p>In 1892 the French School at Athens began the &lsquo;Great Excavation&rsquo;, after the houses of Kastri were bought and pulled down; its people built new houses nearby, which is modern Delphi.</p>",
    flags: [CONTESTED], sources: REF.pearse + "; " + REF.whe + " (Theodosius; the Christian community); " + REF.mocEx + "; " + REF.kastri + "; " + REF.unesco + "." },

  // ---- IV: the stadium
  { id: "stadium", section: "s4", pos: [ST.x + 78, 1.8, ST.z - 4.0], cat: "IV · The stadium", title: "The stadium",
    html: "<p>The highest point of the sanctuary. The track is 177.55 metres long, and the athletic contests of the Pythian Games were run here. The seats were cut in stone in the Roman period: twelve rows on the north side, six on the south and round the curved west end, for some 6,500 to 7,000 people (accounts differ). At the east entrance stood a Roman arch, of which four piers remain.</p>",
    flags: [{ t: "Size published; the rest approximate", soft: true }, RECON], sources: REF.odyssey + " (rows and seating); " + REF.wikiStadium + "; " + REF.paus + " 10.32.1." },
  { id: "games", section: "s4", pos: [ST.x, 1.8, ST.z + 6.0], cat: "IV · The stadium", title: "The Pythian Games",
    html: "<p>The Games were held every four years in honour of Apollo&rsquo;s victory over the serpent Python, which myth said had guarded the place before him. They began with music and poetry, and athletic and chariot contests were added in the early sixth century BCE. The prize was a wreath of laurel.</p>",
    flags: [BELIEF], links: [L.ch08], sources: REF.paus + " 10.7.2&ndash;8." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>From published figures:</strong> the temple at about 60 by 24 metres with 6 by 15 columns; the Athenian Treasury at 9.65 by 6.57 metres; the Siphnian Treasury&rsquo;s base at 8.41 by 6.04 metres; the theatre&rsquo;s 35 rows; the stadium&rsquo;s 177.55-metre track and its rows of seats.</p>" +
    "<p><strong>Approximate:</strong> where each building stands, the height of each terrace, the line of the Sacred Way (straightened here), the columns&rsquo; height and spacing, the plans of the hall and the inner room, the stage building, and the shape of the hillside. The statues are simple stand-ins; the lettering on the walls imitates the look of inscriptions and is not their text, except the hymn panel, which carries the first hymn&rsquo;s opening words as editors read them.</p>" +
    "<p><strong>Not shown:</strong> most of the more than a hundred monuments and twenty-odd treasuries Pausanias passed, the meeting hall of the Cnidians and its paintings, the Castalian spring, the sanctuary of Athena below the road, the crowds and the smoke of sacrifice.</p>",
  links: [L.ch08, L.ch15], sources: REF.moc + "; " + REF.paus + "." };

// a clear Greek sky over Parnassus
const sky = { bg: "#bcd3e6", fog: "#d6dde2", hemi: "#f2f2ee", ground: "#9a8d6e", sunPos: [60, 80, 50], sun: 1.6 };

export default { title: "Delphi", version: 1, stones: ["gallery", "block", "floor", "rock", "limestone"], sky, sections, regions, route, info, about, D, V0 };
