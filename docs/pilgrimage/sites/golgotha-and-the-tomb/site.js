/* ==========================================================================
   Golgotha and the Tomb, c. 30 CE — the site: sections, walkable regions,
   route, info points. Geometry in the section modules (s0-vestibule.js …
   s3-tomb.js), measurements in dims.js.

   A labelled reconstruction of the old quarry outside Jerusalem's Second
   Wall, at Passover in the years c. 30–33 CE, the place now under the Church
   of the Holy Sepulchre. Research and every rule followed here:
   plans/pilgrimage-jerusalem.md. The brief's recommended defaults are used
   throughout, pending Carter's choices (its section 9): no single date;
   the crosses in a neutral place near the gate and road, with the
   traditional rock shown separately; a square blocking stone moved aside;
   an empty bench; the Garden Tomb as a comparison in the Vestibule.

   Sensitivity (brief, section 6): no figures anywhere; empty crosses with no
   nails, blood or instruments; neutral wording on the shared church; "the
   Gospels say" and "Christians believe" for matters of faith.

   Status: "preview" in docs/assets/pilgrimage-data.js (noindex, off the
   menu) until Carter approves. Sources: sources/pilgrimage-golgotha-and-the-tomb.md.
   Conventions as in kit.js: metres; x east, y up, z south.
   ========================================================================== */
import { region } from "../../kit.js?v=1";
import { D } from "./dims.js?v=1";

const PI = Math.PI, N_ = 0, W_ = PI / 2, E_ = -PI / 2, S_ = PI;   // yaw: 0 faces north, PI/2 west
export const V0 = { x: -300, z: 0 };
export const EXIT_HREF = "../museum.html#ch16";
const R5 = D.rim;

// ---------------------------------------------------------------- short references (full list: sources/pilgrimage-golgotha-and-the-tomb.md)
const REF = {
  gibson: "S. Gibson and J. E. Taylor, <em>Beneath the Church of the Holy Sepulchre, Jerusalem</em>, PEF Monograph Series Maior 1 (London, 1994)",
  taylor: "J. E. Taylor, &ldquo;Golgotha: A Reconsideration of the Evidence for the Sites of Jesus&rsquo; Crucifixion and Burial&rdquo;, <em>New Testament Studies</em> 44 (1998), 180&ndash;203",
  gibson09: "S. Gibson, <em>The Final Days of Jesus: The Archaeological Evidence</em> (HarperOne, 2009)",
  chadwick: "J. Chadwick, &ldquo;Revisiting Golgotha and the Garden Tomb&rdquo;, <em>Religious Educator</em> 4.1 (BYU, 2003)",
  biddle: "M. Biddle, <em>The Tomb of Christ</em> (Stroud: Sutton, 1999)",
  ntua: "National Geographic&rsquo;s reports of the 2016&ndash;17 restoration of the Edicule by the National Technical University of Athens (October 2016; November 2017)",
  kloner: "A. Kloner, &ldquo;Did a Rolling Stone Close Jesus&rsquo; Tomb?&rdquo;, <em>Biblical Archaeology Review</em> 25:5 (1999), 22&ndash;25",
  kz: "A. Kloner and B. Zissu, <em>The Necropolis of Jerusalem in the Second Temple Period</em> (Leuven: Peeters, 2007)",
  stasolla: "the Sapienza University of Rome excavations under the church floor (F. R. Stasolla, from 2022), as reported in 2025 (preliminary; final report awaited)",
  josW: "Josephus, <em>Jewish War</em> 5.146&ndash;175 (the walls, the Gennath Gate and Herod&rsquo;s towers)",
  josT: "Josephus, <em>Jewish War</em> 5.222&ndash;223 and <em>Antiquities</em> 15.391&ndash;420 (the Temple)",
  josX: "Josephus, <em>Jewish War</em> 5.449&ndash;451 (crucifixions before the walls in 70 CE, to terrify the besieged)",
  zias: "J. Zias and E. Sekeles, &ldquo;The Crucified Man from Giv&lsquo;at ha-Mivtar: A Reappraisal&rdquo;, <em>Israel Exploration Journal</em> 35 (1985), 22&ndash;27",
  cook: "G. Samuelsson, <em>Crucifixion in Antiquity</em> (Mohr Siebeck, 2011); J. G. Cook, <em>Crucifixion in the Mediterranean World</em> (Mohr Siebeck, 2014; 2nd ed. 2019)",
  barkay: "G. Barkay, &ldquo;The Garden Tomb: Was Jesus Buried Here?&rdquo;, <em>Biblical Archaeology Review</em> 12:2 (1986)",
  mishnah: "Mishnah <em>Bava Batra</em> 2:9 (tombs kept outside the town)",
  gospels: "the Gospels: Mark 15&ndash;16; Matthew 27&ndash;28; Luke 23&ndash;24; John 19&ndash;20",
  eusebius: "Eusebius, <em>Life of Constantine</em> 3.25&ndash;40",
  status: "the Ottoman &lsquo;Status Quo&rsquo; of 1852&ndash;53, as summarised in <em>Christianity Today</em>, &ldquo;Divvying up the most sacred place&rdquo; (2008)",
  ch16: "the archive&rsquo;s Early Christianity chapter (ch16)",
  brief: "the archive&rsquo;s research brief, plans/pilgrimage-jerusalem.md"
};
const L = {
  ch16: { href: "../chapters/ch16.html", label: "Read the Early Christianity chapter" },
  ch10: { href: "../chapters/ch10.html", label: "Second Temple Judaism" },
  v15: { href: "../vault/true-cross.html", label: "The True Cross (Vault)" }
};
const RECON = { t: "Reconstruction: places and distances are our estimate", soft: true };
const CONTESTED = { t: "Contested", soft: false };
const TEXT = { t: "From the Gospels: a text, not an excavated fact", soft: true };
const FAITH = { t: "A matter of faith", soft: true };

// ---------------------------------------------------------------- sections
const BIG = [-260, -4, -260, 640, 80, 420];
const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: what the reconstruction rests on, the site today, the Garden Tomb, and the way out to the road." },
  { id: "s1", name: "I · The road by the gate", short: "the road", module: "s1-road.js", box: BIG, start: { x: 30, z: 52, yaw: N_, y: R5 }, blurb: "Outside the Second Wall, by a gate and a road: three empty crosses on a low rise, Herod's towers to the south, the Temple far to the east." },
  { id: "s2", name: "II · The quarry", short: "the quarry", module: "s2-quarry.js", box: BIG, start: { x: 10, z: -7, yaw: W_, y: 0 }, blurb: "Down in the old quarry: the unquarried rock, the garden plots on the fill, and family tombs cut into the faces." },
  { id: "s3", name: "III · The tomb", short: "the tomb", module: "s3-tomb.js", box: [D.tomb.x - 6, -2, D.tomb.z - 5, D.tomb.x + 5, 6, D.tomb.z + 5], start: { x: D.tomb.x - 2.4, z: D.tomb.z + 0.3, yaw: N_, y: -D.pit }, blurb: "A new rock-cut family tomb: the stone rolled back, a low doorway, a chamber with an empty bench." }
];

// ---------------------------------------------------------------- where the visitor may walk
const tx = D.tomb.x, tz = D.tomb.z, F = D.fore, C = D.ch;
const crossHoles = D.crosses.map((c) => [c.x - 0.6, c.x + 0.6, c.z - 0.6, c.z + 0.6]);
const trees = [[-20, -36], [-14, -38.5], [-6, -34], [-22, -30], [2, -38], [8, -31], [-24, 12], [-16, 16], [6, 14], [-2, 17]];
export const TREES = trees;
const regions = [
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0, holes: [[V0.x - 3.2, V0.x - 2.0, V0.z - 1.6, V0.z - 0.4]] }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  region({ id: "v-exit", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z + 4.6, z1: V0.z + 5.6, y: 0, inset: 0.05, portal: "museum", href: EXIT_HREF }),
  // the ground on the rim: the road and the rise beside it; the way back through the gate
  region({ id: "rim", section: "s1", x0: D.ramp.x1 - 0.4, x1: 48, z0: D.road.z0, z1: D.road.z1, y: R5, outside: true, holes: crossHoles }),
  region({ id: "to-v", section: "s1", x0: D.gate.x - 1.2, x1: D.gate.x + 1.2, z0: D.road.z1 - 0.6, z1: D.road.z1 + 1.0, y: R5, inset: 0.05, portal: "v", outside: true }),
  // the ramp down into the quarry
  region({ id: "ramp", section: "s2", x0: D.ramp.x0, x1: D.ramp.x1, z0: D.ramp.z0, z1: D.ramp.z1, y: 0, y1: R5, axis: "x", outside: true, open: "we" }),
  // the quarry floor, with the rock and the trees as holes
  region({ id: "quarry", section: "s2", x0: D.q.x0, x1: D.q.x1 + 0.4, z0: D.q.z0, z1: D.q.z1, y: 0, outside: true, open: "e",
    holes: [[D.knob.x - D.knob.l / 2 - 0.3, D.knob.x + D.knob.l / 2 + 0.3, D.knob.z - D.knob.w / 2 - 0.3, D.knob.z + D.knob.w / 2 + 0.3]].concat(trees.map(([x, z]) => [x - 0.7, x + 0.7, z - 0.7, z + 0.7])) }),
  // the tomb's forecourt, cut back into the west face, with the blocking stone leaning to one side
  region({ id: "fore", section: "s2", x0: tx, x1: D.q.x0 + 0.4, z0: tz - F.w / 2, z1: tz + F.w / 2, y: 0, outside: true, open: "e", holes: [[tx, tx + 0.9, tz - F.w / 2, tz - F.w / 2 + 1.5]] }),
  // the low doorway, and the chamber (its standing pit, between the bench and the walls)
  region({ id: "door", section: "s3", x0: tx - D.door.t - 0.2, x1: tx + 0.4, z0: tz - D.door.w / 2, z1: tz + D.door.w / 2, y: 0, inset: 0.05, eye: 0.8 }),
  region({ id: "chamber", section: "s3", x0: tx - D.door.t - C.w, x1: tx - D.door.t + 0.2, z0: tz - C.d / 2 + D.bench.d, z1: tz + C.d / 2, y: -D.pit, inset: 0.25, eye: 1.55 })
];
for (const r of regions) r.surface = r.section === "v" ? "wood" : "rock";

// ---------------------------------------------------------------- the walking route
const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),
  P(30, 52, R5, true, N_),                       // inside the gate, on the road
  P(36, 36, R5, true, PI * 0.15),                // the rise with the crosses
  P(30, 14, R5, true, -PI * 0.75),               // the towers to the south-west
  P(30, -7, R5, true, E_),                       // the Temple far to the east
  P(D.ramp.x1 - 0.5, -7, R5),
  P(D.ramp.x0 + 0.5, -7, 0, true, W_),           // down the ramp: the quarry
  P(10, -14, 0, true, PI * 0.35),                // the rock
  P(9, 2, 0),
  P(-6, 8, 0, true, S_),                         // the garden plots
  P(-8, -26, 0, true, N_),                       // the neighbouring tomb
  P(tx + 2.4, tz, 0, true, W_),                  // the tomb's forecourt
  P(tx - 0.3, tz, 0),
  P(tx - D.door.t - 1.2, tz + 0.5, -D.pit, true, PI * 0.9),   // inside: the bench
  P(tx + 2.4, tz, 0, true, E_)                   // back out into the light
];

// ---------------------------------------------------------------- info points
const info = [
  // ---- the Vestibule
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you go out", title: "Golgotha and the Tomb, c. 30 CE",
    html: "<p>All four Gospels say that Jesus was crucified at a place called Golgotha, &lsquo;the place of the skull&rsquo;, just outside Jerusalem, and buried nearby in a new rock-cut tomb. The place traditionally identified is an old quarry that lay outside the city wall in his time and is now under the Church of the Holy Sepulchre.</p><p>This is a <strong>reconstruction</strong> of that quarry at Passover in the years about 30&ndash;33 CE (the exact year is debated). It shows places, not people: no figures, and the crosses empty. The layout follows excavation reports and the typology of Jerusalem&rsquo;s tombs; the distances between features are our estimate.</p>",
    links: [L.ch16], sources: REF.brief + "; " + REF.gibson + "; " + REF.ch16 + "." },
  { id: "v-today", section: "v", pos: [V0.x + 3.9, 1.7, V0.z + 1.6], cat: "Before you go out", title: "The site today",
    html: "<p>In the 320s, on Constantine&rsquo;s orders, a Roman temple built by Hadrian was removed and a tomb found beneath it was cut free and enshrined; the church built round it was later rebuilt many times. Today the <strong>Church of the Holy Sepulchre</strong> is shared by six Christian communities under an Ottoman arrangement of 1852&ndash;53, the &lsquo;Status Quo&rsquo;: the Greek Orthodox, Roman Catholic, Armenian Apostolic, Coptic, Ethiopian and Syriac Orthodox churches.</p><p>When the shrine over the tomb, the Edicule, was restored in 2016&ndash;17, its marble cladding was lifted: beneath it lay an older marble slab and the original limestone bench, with walls of the rock-cut tomb still standing. Mortar from that level was dated to about 345 CE, which confirms that the bench was enshrined in Constantine&rsquo;s time. It cannot date the tomb&rsquo;s use, or say whose tomb it was.</p>",
    flags: [CONTESTED], links: [L.ch16], sources: REF.eusebius + "; " + REF.status + "; " + REF.ntua + "; " + REF.biddle + "." },
  { id: "v-garden", section: "v", pos: [V0.x - 3.9, 1.7, V0.z + 2.4], cat: "Before you go out", title: "The other site: the Garden Tomb",
    html: "<p>North of the Damascus Gate is the <strong>Garden Tomb</strong>, identified in 1883 by General Charles Gordon, who saw the shape of a skull in a nearby cliff. It is a peaceful garden and a place of prayer for many Christians, especially Protestants. The archaeologist Gabriel Barkay dated the tomb itself to the Iron Age, the 8th to 7th centuries BCE, centuries before the time of Jesus, and most archaeologists accept that date. The Church of the Holy Sepulchre site has the older tradition and the stronger archaeological case; neither can be proven.</p>",
    flags: [CONTESTED], sources: REF.barkay + "; " + REF.chadwick + "." },
  { id: "v-v15", section: "v", pos: [V0.x - 2.6, 1.35, V0.z - 1.0], relic: { id: "v15", slug: "true-cross", title: "The True Cross", category: "Relics & Sacred Objects", held: "Fragments worldwide: Rome, Jerusalem, Mount Athos, Paris and others", dated: "Venerated in Jerusalem by the 380s (Egeria)", kind: "tablet" }, title: "The True Cross (for comparison)",
    html: "<p><strong>Not part of the reconstruction.</strong> Christian tradition from the late 4th century says the cross was found at this site in Constantine&rsquo;s time, and fragments venerated as pieces of it are kept in churches across the world. No fragment has been shown to come from 1st-century Jerusalem.</p>" },
  { id: "v-door", section: "v", pos: [V0.x, 3.45, V0.z - 4.4], cat: "The way out", title: "To the road by the gate",
    html: "<p>Walk into the golden portal to step out onto the road outside the city wall.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 3.45, V0.z + 4.4], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>This portal returns you to the museum, to the room of Early Christianity.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] },
  // ---- I: the road
  { id: "gate", section: "s1", pos: [D.gate.x + 3.5, R5 + 1.7, D.road.z1 - 4], cat: "I · The road by the gate", title: "Outside the Second Wall",
    html: "<p>Behind you is the city&rsquo;s <strong>Second Wall</strong>. Josephus says it began at a gate in the older First Wall called <em>Gennath</em>, the &lsquo;Garden Gate&rsquo;, and ran north and east to the Antonia fortress. Its line has never been fully traced on the ground and has been argued over for more than 150 years. The traditional site of Golgotha is authentic only if the wall ran east and south of this quarry, as most excavators think; that is a strong inference, not a traced wall.</p><p>A Third Wall, which later brought this area inside the city, was begun only in the 40s CE, so in Jesus&rsquo; time the ground here was outside: quarry, gardens and tombs, which Jewish law kept outside the town.</p>",
    flags: [RECON, CONTESTED], links: [L.ch10], sources: REF.josW + "; " + REF.gibson + "; " + REF.mishnah + "; " + REF.brief + "." },
  { id: "crosses", section: "s1", pos: [D.crosses[1].x - 2.8, R5 + 1.8, D.crosses[1].z - 3.2], cat: "I · The road by the gate", title: "Three empty crosses",
    html: "<p>The Gospels say Jesus was crucified between two others, at a place by the city where passers-by could see. Roman crucifixion was a public punishment, meant to be seen as a warning. <strong>Where exactly</strong> the crosses stood is not known, so they are shown here on a low rise near the gate and the road, a neutral position. Joan Taylor argues that the execution place lay south, near the gate, with the tomb some 200 m to the north; Shimon Gibson places both in the area of the church.</p><p>What the crosses looked like is reconstruction too. The only crucified man found near Jerusalem, Yehohanan, had an iron nail through his heel; his arms were probably tied. The ancient words for &lsquo;cross&rsquo; covered upright stakes as well as T- and &dagger;-shapes, and scholars disagree about the shape of Jesus&rsquo; cross. The height here, about 3 m, is a modelling choice.</p>",
    flags: [RECON, CONTESTED, TEXT], links: [L.ch16, L.v15], sources: REF.gospels + "; " + REF.josX + "; " + REF.taylor + "; " + REF.gibson09 + "; " + REF.zias + "; " + REF.cook + "." },
  { id: "towers", section: "s1", pos: [24, R5 + 1.7, 30], cat: "I · The road by the gate", title: "Herod's towers",
    html: "<p>On the skyline to the south-west rise the three towers Herod the Great built by his palace, named for his brother <strong>Phasael</strong>, his friend <strong>Hippicus</strong> and his wife <strong>Mariamne</strong>. Josephus gives their sizes in cubits: Hippicus 25 square and 80 high, Phasael 40 square and 90 high, Mariamne 20 square and 50 high. The base of one of them still stands inside Jerusalem&rsquo;s Citadel; which one is debated. Their shapes above Josephus&rsquo;s figures are reconstruction.</p>",
    flags: [RECON], sources: REF.josW + "; " + REF.brief + "." },
  { id: "temple", section: "s1", pos: [36, R5 + 1.7, -6], cat: "I · The road by the gate", title: "The Temple, to the east",
    html: "<p>Some 550 m to the east, beyond the city, stood the Temple, rebuilt on a vast scale by Herod. Josephus says its front was about a hundred cubits wide and high, plated with gold that flashed at sunrise, and so white elsewhere that from a distance it looked like a mountain covered with snow. The sanctuary faced east, so from here you would have seen its back. It is shown only as a distant white block on its platform; its exact form is reconstruction.</p>",
    flags: [RECON, TEXT], links: [L.ch10], sources: REF.josT + "." },
  // ---- II: the quarry
  { id: "quarry", section: "s2", pos: [D.q.x1 - 2, 1.7, -14], cat: "II · The quarry", title: "An old quarry",
    html: "<p>The ground under the Church of the Holy Sepulchre is an old quarry for <em>meleke</em>, a fine white limestone, worked in the time of the kings of Judah. Excavations under the church and nearby, by Kathleen Kenyon in the 1960s and in the church itself in the 1970s, found the quarry faces and fill and showed that the area lay outside the city in the early 1st century. By then the quarry was disused: partly filled, cultivated, and used for tombs.</p>",
    flags: [RECON], links: [L.ch16], sources: REF.gibson + "; " + REF.chadwick + "." },
  { id: "rock", section: "s2", pos: [D.knob.x - 1.5, 1.6, D.knob.z + 3.2], cat: "II · The quarry", title: "The rock",
    html: "<p>The quarrymen left this knob of rock standing, perhaps because it was cracked. Inside the church today it is venerated as the Rock of Calvary, the place of the crucifixion, and it rises to the chapels above; it is usually cited as about five metres high. Whether the crosses stood on it, or somewhere else in or near the quarry, cannot be shown.</p>",
    flags: [CONTESTED, { t: "Size as commonly cited; to be checked against the excavation plans", soft: true }], sources: REF.gibson + "; " + REF.taylor + "; " + REF.brief + "." },
  { id: "garden", section: "s2", pos: [-6, 1.5, 11], cat: "II · The quarry", title: "A garden",
    html: "<p>John&rsquo;s Gospel says that &lsquo;in the place where he was crucified there was a garden, and in the garden a new tomb&rsquo;. Excavations beneath the church floor since 2022 have recovered pollen and seeds of olive and grapevine from soil laid over the quarry before the 1st-century levels, so parts of it were cultivated. How exactly those layers are dated awaits the full report; linking them to John&rsquo;s garden is an interpretation.</p>",
    flags: [CONTESTED, TEXT], sources: REF.stasolla + "; " + REF.gospels + "." },
  { id: "tomb2", section: "s2", pos: [D.tomb2.x + 3, 1.6, D.tomb2.z + 4], cat: "II · The quarry", title: "A family tomb",
    html: "<p>Tombs of this time are cut into the quarry faces. One survives inside the church, just west of the Edicule, with the long burial niches called <em>kokhim</em> typical of 1st-century Jewish tombs; it is known by tradition as the tomb of Joseph of Arimathea. Tombs like it are good evidence that this ground lay outside the walls: Jewish law kept burials away from the town.</p>",
    flags: [RECON], sources: REF.gibson + "; " + REF.chadwick + "; " + REF.mishnah + "." },
  { id: "fore", section: "s2", pos: [tx + 2.4, 1.7, tz - 2.0], cat: "II · The quarry", title: "The tomb, and its stone",
    html: "<p>The Gospels say Jesus&rsquo; body was laid in a new tomb cut in the rock, belonging to Joseph of Arimathea, and that a stone was rolled across the door. Of more than 900 tombs of this period around Jerusalem studied by Amos Kloner, only four were closed with a round, rolling stone, all of them tombs of very rich families; nearly all the rest had a square stone that fitted the doorway like a plug. Kloner argued that the Gospels&rsquo; verbs could describe moving such a stone; others read them as a round disk. The square stone, moved aside, is shown here as the commoner form.</p>",
    flags: [RECON, CONTESTED, TEXT], links: [L.ch16], sources: REF.gospels + "; " + REF.kloner + "; " + REF.kz + "." },
  // ---- III: the tomb
  { id: "chamber", section: "s3", pos: [tx - D.door.t - 1.0, 1.2, tz + 1.1], cat: "III · The tomb", title: "Inside the tomb",
    html: "<p>Through the low doorway is a single chamber. Its floor is cut lower in the middle, a <em>standing pit</em>, so you can stand up, with a bench along the wall to your right, where a body was laid. In the far walls the cutting of long niches (<em>kokhim</em>) has only begun, as it might in a tomb that was new. All of this follows the common form of Jerusalem tombs of the time; the measurements are our estimate.</p><p>Under the Edicule today, what survives of the venerated tomb is mainly its north wall and its burial bench; the rest was cut away in the 4th century and destroyed in 1009.</p>",
    flags: [RECON], sources: REF.kz + "; " + REF.biddle + "." },
  { id: "bench", section: "s3", pos: [tx - D.door.t - 1.6, 1.0, tz - C.d / 2 + 0.5], cat: "III · The tomb", title: "The empty bench",
    html: "<p>The Gospels say that on the first day of the week women came to the tomb and found the stone moved and the body gone. Christians believe Jesus rose from the dead; that is the centre of their faith, and no excavation could confirm or refute it. Others, from antiquity on, have explained the empty tomb in other ways. Here the bench is shown empty, as the Gospels describe it.</p>",
    flags: [FAITH, TEXT], links: [L.ch16], sources: REF.gospels + "; " + REF.ch16 + "." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>From excavation and texts:</strong> an old limestone quarry outside the city wall in the early 1st century, partly filled and cultivated, with Jewish rock-cut tombs in its faces; an unquarried knob of rock; the Second Wall with a gate (its line contested); Herod&rsquo;s three towers, with Josephus&rsquo;s sizes; and the form of tombs of the time, with their low doors, standing pits, benches, kokhim and square blocking stones.</p>" +
    "<p><strong>Reconstruction:</strong> the quarry&rsquo;s exact shape and depth, the distances between everything, the place of the crosses, the tomb&rsquo;s size, the shape and height of the crosses, the towers above their stated sizes, the city and the Temple in the distance.</p>" +
    "<p><strong>Not shown:</strong> any person; the church and every later building; the Third Wall, the Via Dolorosa and the Ecce Homo arch, which are later; and any single day&rsquo;s weather, darkness or earthquake. The sun is a spring midday sun.</p>",
  links: [L.ch16], sources: REF.brief + "; " + REF.gibson + "; " + REF.kz + "." };

// the sky of a spring midday in Jerusalem: the sun high in the south (about 64° at noon in early April; brief, section 1.2)
const sky = { bg: "#c4d4e2", fog: "#d6dde2", hemi: "#eef2f6", ground: "#bba27c", sunPos: [0, 90, 44], sun: 1.6 };

export default { title: "Golgotha and the Tomb, c. 30 CE", version: 1, stones: ["rock", "block", "core", "wood"], sky, sections, regions, route, info, about, D, V0 };
