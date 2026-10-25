/* ==========================================================================
   The Mogao Caves — the site: sections, walkable regions, route, info points.
   Geometry lives in the section modules (s0-vestibule.js … s4-cave254.js),
   measurements in dims.js, shared builders and the painted walls in paint.js.

   Status: "preview" in docs/assets/pilgrimage-data.js. The page exists
   (noindex) but the site is off the menu until Carter approves it going live.
   Plan: plans/pilgrimage-sites.md (V · Late Antiquity). Sources:
   sources/pilgrimage-mogao-caves.md.

   The moment shown: today, as a visitor finds the cliff, with one exception
   the visitor can switch on: Cave 17 as it was found in 1900.
   Frame: metres; x east, y up, z south. The cliff faces east along x = 0.
   ========================================================================== */
import { region } from "../../kit.js?v=1";
import { D } from "./dims.js?v=1";

const PI = Math.PI;                           // yaw 0 faces north, PI south, PI/2 west, -PI/2 east
export const V0 = { x: 320, z: 0 };          // the archive's own vestibule
export const EXIT_HREF = "../museum.html#ch20";
const C16 = D.c16, C17 = D.c17, C96 = D.c96, P96 = D.pav, C254 = D.c254, G = D.ground;

// ---------------------------------------------------------------- short references (full list: sources/pilgrimage-mogao-caves.md)
const REF = {
  unesco: "UNESCO World Heritage Centre, &ldquo;Mogao Caves&rdquo; (site 440, inscribed 1987)",
  ed17: "Dunhuang Academy, e-Dunhuang, &ldquo;Cave 17&rdquo; (e-dunhuang.com)",
  ed254: "Dunhuang Academy, e-Dunhuang, &ldquo;Cave 254&rdquo; (e-dunhuang.com)",
  smart: "M. M. Chan, &ldquo;Mogao Cave 17&rdquo;, Smarthistory",
  idp17: "International Dunhuang Programme (British Library), &ldquo;Cave 17: the &lsquo;Library Cave&rsquo;&rdquo;",
  vs: "S. van Schaik, &ldquo;Secrets of the Cave II: The &lsquo;Library Cave&rsquo;&rdquo;, <em>early Tibet</em> (2011)",
  rsaa: "Royal Society for Asian Affairs blog, &ldquo;Looting the Silk Road: the re-discovery of Dunhuang&rdquo; (a contributor&rsquo;s opinion)",
  ahs: "Ancient History Sites, &ldquo;Mogao Caves: A Buddhist Cave Complex on the Silk Road&rdquo;",
  cd96: "<em>China Daily</em>, 29 April 2025, on the great Buddha of 695",
  tob: "Tokyo National Research Institute for Cultural Properties, symposium abstract &ldquo;Life of the Tallest Buddha at Dunhuang&rdquo; (2002)",
  ch20: "the archive&rsquo;s chapter on Mahayana Buddhism (ch20)",
  brit: "<em>Encyclop&aelig;dia Britannica</em>, &ldquo;Maitreya&rdquo;",
  smart254: "M. M. Chan, &ldquo;Prince Mahasattva, King Sivi, and Syama&rdquo;, Smarthistory",
  idpj: "International Dunhuang Programme, &ldquo;Jataka stories&rdquo; (Buddhism on the Silk Roads)",
  the04: "A. Robinson, &ldquo;The Silk Road less travelled&rdquo;, <em>Times Higher Education</em>, 4 June 2004",
  gt23: "<em>Global Times</em>, 21 November 2023, on the film <em>Great Love Dunhuang</em> (as summarised by Restitution Matters)"
};
const L = {
  ch20: { href: "../chapters/ch20.html", label: "Read the chapter on Mahayana Buddhism" },
  ch53: { href: "../chapters/ch53.html", label: "Chapter 53" },
  ch54: { href: "../chapters/ch54.html", label: "Chapter 54" },
  v30: { href: "../vault/diamond-sutra.html", label: "The Diamond Sutra (Vault)" }
};
const APPROX = { t: "Sizes and placings approximate", soft: true };
const RENDER = { t: "Paintings and statues: our own simple renderings", soft: true };
const CONTESTED = { t: "Contested", soft: false };
const BELIEF = { t: "What is believed, not a finding", soft: true };
const SENS = { t: "Still argued today", soft: false };

// ---------------------------------------------------------------- sections
const BIG = [-60, -5, -280, 120, 80, 280];          // the cliff and the ground in front of it; each cave loads only when you are near it
const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: the portal back to the museum, the Vault's Diamond Sutra, found in this cliff, and the way out." },
  { id: "s1", name: "I · The cliff", short: "the cliff", module: "s1-cliff.js", box: BIG, start: { x: 30, z: -62, yaw: 2.77, y: 0 }, blurb: "The face of the cliff, honeycombed with caves on as many as five levels, and the nine-storey building over the great Buddha." },
  { id: "s2", name: "II · The Library Cave", short: "Caves 16 and 17", module: "s2-cave17.js", box: [C16.x0 - 1, -1, C16.z0 - 1, 2, C16.h + 2, C16.z1 + 1], start: { x: 7, z: C16.z, yaw: PI / 2, y: 0 }, blurb: "The corridor of Cave 16, the small room off it where some 50,000 manuscripts lay sealed for nine centuries, and Cave 16 itself." },
  { id: "s3", name: "III · The great Buddha", short: "Cave 96", module: "s3-cave96.js", box: [C96.x0 - 1, -1, P96.z0 - 1, P96.x1 + 2, P96.h + 2, P96.z1 + 1], start: { x: 7, z: 0, yaw: PI / 2, y: 0 }, blurb: "Inside the nine-storey building: the seated Maitreya of 695, more than thirty metres high." },
  { id: "s4", name: "IV · Cave 254", short: "Cave 254", module: "s4-cave254.js", box: [C254.x0 - 1, C254.y - 1, C254.z0 - 1, D.walk2.x1 + 1, C254.y + C254.h + 2, C254.z1 + 1], start: { x: 1.9, z: 112, yaw: PI / 2, y: C254.y }, blurb: "A cave of the Northern Wei on the middle tier: a central pillar to walk round, and the story of the prince and the tigress." }
];

// ---------------------------------------------------------------- walkable regions
const r1 = (o) => region(Object.assign({ outside: true }, o));
const regions = [
  // the vestibule
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0, holes: [[V0.x - 3.2, V0.x - 2.0, V0.z - 1.6, V0.z - 0.4]] }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  region({ id: "v-exit", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z + 4.6, z1: V0.z + 5.6, y: 0, inset: 0.05, portal: "museum", href: EXIT_HREF }),
  // the ground in front of the cliff
  r1({ id: "ground", section: "s1", x0: G.x0, x1: G.x1, z0: G.z0, z1: G.z1, y: 0, inset: 0.3,
    holes: [[P96.x0 - 1, P96.x1, P96.z0, P96.z1], [D.stair.x0 - 0.3, D.stair.x1 + 0.3, D.stair.z0 + 4, D.stair.z1 + 1]] }),
  r1({ id: "to-v", section: "s1", x0: 39.6, x1: 40.6, z0: -41.8, z1: -40.2, y: 0, inset: 0.05, portal: "v" }),
  // Cave 16's corridor, Cave 17 off it, Cave 16's hall
  region({ id: "c16-corr", section: "s2", x0: C16.corrX0, x1: 1.2, z0: C16.z - C16.corrW / 2, z1: C16.z + C16.corrW / 2, y: 0, inset: 0.25, open: "ew" }),
  region({ id: "c17-door", section: "s2", x0: C17.door.x0, x1: C17.door.x1, z0: C17.z1 - 0.3, z1: C16.z - C16.corrW / 2 + 0.6, y: 0, inset: 0.1, open: "ns" }),
  region({ id: "c17", section: "s2", x0: C17.x0, x1: C17.x1, z0: C17.z0, z1: C17.z1, y: 0, inset: 0.22, open: "s", holes: [[C17.x0, C17.x1, C17.z0, C17.z0 + 1.15]] }),
  region({ id: "c16", section: "s2", x0: C16.x0, x1: C16.x1, z0: C16.z0, z1: C16.z1, y: 0, inset: 0.3, open: "",
    holes: [[C16.altar.x0 - 0.3, C16.altar.x1 + 0.3, C16.altar.z0 - 0.3, C16.altar.z1 + 0.3]] }),
  // the nine-storey building and Cave 96
  region({ id: "pav-door", section: "s3", outside: true, x0: P96.x1 - 1.0, x1: P96.x1 + 0.6, z0: -1.3, z1: 1.3, y: 0, inset: 0.05, open: "we" }),
  region({ id: "pav", section: "s3", outside: true, x0: C96.statueX + 7.6, x1: P96.x1 - 0.6, z0: -5.6, z1: 5.6, y: 0, inset: 0.3, open: "e" }),
  // the stair and walkway to the middle tier, and Cave 254
  r1(Object.assign({ id: "stair", section: "s4", inset: 0.2, open: "ns" }, D.stair)),
  r1(Object.assign({ id: "walk2", section: "s4", inset: 0.25, open: "n" }, D.walk2)),
  region({ id: "c254-door", section: "s4", x0: C254.x1 - 0.6, x1: D.walk2.x0 + 0.8, z0: C254.pillar.z - 0.9, z1: C254.pillar.z + 0.9, y: C254.y, inset: 0.05, open: "we" }),
  region({ id: "c254", section: "s4", x0: C254.x0, x1: C254.x1, z0: C254.z0, z1: C254.z1, y: C254.y, inset: 0.3, open: "e",
    holes: [[C254.pillar.x - C254.pillar.s / 2 - 0.35, C254.pillar.x + C254.pillar.s / 2 + 0.35, C254.pillar.z - C254.pillar.s / 2 - 0.35, C254.pillar.z + C254.pillar.s / 2 + 0.35]] })
];
for (const r of regions) r.surface = r.section === "v" ? "wood" : r.id === "stair" || r.id === "walk2" ? "stone" : "rock";

// ---------------------------------------------------------------- the walking route (Walk on / Walk back)
const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),                              // out to the cliff
  P(30, -62, 0, true, 2.77),                                 // the cliff and the nine-storey building
  P(22, 30, 0, true, PI / 2 + 0.25),                         // the tiers of caves
  P(7, C16.z, 0, true, PI / 2),                              // the door of Cave 16
  P(-2.3, C16.z, 0, true, PI / 2),                           // the corridor
  P(-3.1, C16.z - 0.6, 0, false), P(-3.1, 47.9, 0, true, 0), // Cave 17
  P(-3.1, C16.z, 0, false),
  P(-10.2, C16.z, 0, true, PI / 2),                          // Cave 16's hall
  P(7, C16.z, 0, false),
  P(16, 0, 0, false),
  P(5.0, 0, 0, true, PI / 2),                                // inside the building: the great Buddha
  P(-5.0, 0, 0, true, PI / 2),                               // at its feet
  P(16, 0, 0, false),
  P(2.2, 68, 0, false), P(2.2, D.stair.z1 + 0.5, D.walk2.y, false),
  P(1.9, C254.pillar.z, C254.y, true, PI / 2),               // the door of Cave 254
  P(-2.6, C254.pillar.z, C254.y, true, PI / 2),              // the central pillar
  P(-8.2, C254.z1 - 2.4, C254.y, true, PI)                   // the south wall: the prince and the tigress
];

// ---------------------------------------------------------------- info points
const info = [
  // ---- vestibule (the archive's own room)
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you go out", title: "The Mogao Caves",
    html: "<p>South-east of the oasis town of Dunhuang, where the Silk Road left China for the desert, nearly five hundred caves cut into a cliff above a dry river hold Buddhist paintings and statues made over a thousand years, from the fourth century to the fourteenth.</p><p>This walk goes along the foot of the cliff, into the corridor of Cave 16 and the small room off it where the manuscripts were found, up into the building that houses the great Buddha of 695, and into Cave 254 on the middle tier. The cliff is shown much as a visitor sees it today. The paintings and statues are our own simple renderings, not copies, and every size is approximate.</p>",
    flags: [APPROX, RENDER], links: [L.ch20, L.v30], sources: REF.unesco + "; " + REF.ahs + "; " + REF.ch20 + "." },
  { id: "v-v30", section: "v", pos: [V0.x - 2.6, 1.35, V0.z - 1.0], relic: { id: "v30", slug: "diamond-sutra", title: "The Diamond Sutra of Dunhuang", category: "Manuscripts & Codices", held: "British Library, London (Or.8210/P.2)", dated: "Printed 11 May 868 CE (dated colophon)", kind: "scroll", note: "A modelled rendition, after the description in its Vault entry; not a replica. Its writing is illustrative marks. The real scroll was found in Cave 17 of this cliff and is now in the British Library." }, title: "The Diamond Sutra (the Vault's rendition)",
    html: "<p><strong>From this site.</strong> The printed scroll of the Diamond Sutra, dated 868 and the oldest complete printed book that carries a date, was one of the tens of thousands of items in Cave 17. It is now in the British Library. The cave it came from is outside.</p>",
    links: [L.v30] },
  { id: "v-door", section: "v", pos: [V0.x, 3.45, V0.z - 4.4], cat: "The way out", title: "To the cliff",
    html: "<p>Walk into the golden portal to step out at the foot of the cliff.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 3.45, V0.z + 4.4], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>This portal returns you to the museum, to the room of Mahayana Buddhism.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] },

  // ---- I: the cliff
  { id: "mogao", section: "s1", pos: [27, 2.0, -57], cat: "I · The cliff", title: "A thousand years of caves",
    html: "<p>A Chinese record of later date, the <em>Fokan ji</em>, says a monk called Lezun had a vision of a thousand Buddhas here in 366 and cut the first cave; another document gives 353. The oldest cave that survives dates from the early fifth century. For a thousand years after that, monks, local rulers, merchants and families paid for new caves and repainted old ones.</p><p>About 735 caves survive along the cliff, some 492 of them with paintings or statues, holding about 45,000 square metres of murals and more than 2,000 painted clay statues.</p>",
    flags: [{ t: "Founding date from a later record", soft: true }], links: [L.ch20], sources: REF.unesco + "; " + REF.ahs + "." },
  { id: "cliff", section: "s1", pos: [16, 2.4, 26], cat: "I · The cliff", title: "The face of the cliff",
    html: "<p>The statues in the caves are of painted clay, and the paintings are on plaster laid over the rock. The walkways, stairs and doors along the cliff today are modern, built to hold up the face and let people reach the caves. The real cliff has caves on five levels; the model shows four, with the tiers and the doorways evenly spaced, where in reality they crowd and overlap.</p>",
    flags: [APPROX], sources: REF.unesco + "; " + REF.ahs + "." },
  { id: "pavilion", section: "s1", pos: [15.6, 4.0, -14.0], cat: "I · The cliff", title: "The nine-storey building",
    html: "<p>The tall red building shelters the cave of the largest statue at Mogao. It was first built under the Tang dynasty with four storeys; a fifth was added in 874&ndash;885 and two more in a restoration of 1898, and two twentieth-century restorations gave it the nine storeys it has now. It has been repaired at least five times. The model&rsquo;s building is a simplified version of today&rsquo;s.</p>",
    flags: [APPROX], sources: REF.ahs + "." },

  // ---- II: the Library Cave
  { id: "c16", section: "s2", pos: [-0.6, 2.6, C16.z + 1.0], cat: "II · The Library Cave", title: "The corridor of Cave 16",
    html: "<p>Cave 16 is entered by a corridor. In June 1900 Wang Yuanlu, a Daoist who had made himself the caretaker of the caves, found a walled-up door in the north wall of this corridor. Behind it was a small room filled from floor to ceiling with bundles of manuscripts, paintings and printed texts.</p>",
    flags: [APPROX], links: [L.ch20], sources: REF.idp17 + "; " + REF.ed17 + "." },
  { id: "c17", section: "s2", pos: [-2.4, 2.0, 46.8], cat: "II · The Library Cave", title: "Cave 17: the Library Cave",
    toggle: { id: "found", on: "Show the cave as found in 1900", off: "Show the cave today" },
    html: "<p>The room was made between 851 and 862 as a memorial chapel for the monk <strong>Hongbian</strong>, head of the Buddhist clergy of the Hexi region. His clay portrait sits on a low platform against the north wall. Behind him are painted two trees, a cloth bag hanging in one and a water flask in the other, with a woman attendant holding a staff and towel on the left and a nun with a round fan on the right. A stone tablet of 851 on the west wall records his appointment.</p><p>The statue stood in another cave higher up the cliff and was brought back here after the room was emptied. The room held more than 50,000 items written between the fourth and the eleventh centuries, in Chinese, Tibetan and other languages of the Silk Road, among them the printed <strong>Diamond Sutra</strong> of 868. The bundles shown when you switch the view are a simple stand-in.</p>",
    flags: [APPROX, RENDER], links: [L.v30, L.ch20], sources: REF.ed17 + "; " + REF.smart + "; " + REF.idp17 + "." },
  { id: "seal", section: "s2", pos: [-1.7, 2.6, C16.z - 1.0], cat: "II · The Library Cave", title: "Why was it sealed?",
    html: "<p>No one recorded when or why the room was filled and walled up. The historian Rong Xinjiang dates it to early in the eleventh century and argues that the library of a Dunhuang monastery was hidden here in the face of armies threatening the oasis cities to the west. Others think the cave held worn-out sacred texts that could not be thrown away, or a mix of libraries and private collections put there at different times; only some two hundred manuscripts can be tied to the monastery Rong names. The bundles were moved without any record of how they lay, which makes the question harder to settle.</p>",
    flags: [CONTESTED], sources: REF.vs + "; " + REF.idp17 + "." },
  { id: "dispersal", section: "s2", pos: [-3.4, 2.6, C16.z + 1.0], cat: "II · The Library Cave", title: "Where the manuscripts went",
    html: "<p>In 1907 the explorer Aurel Stein, working for the British, persuaded Wang to sell him thousands of manuscripts and paintings; accounts of the sum differ. In 1908 the French scholar Paul Pelliot sorted through the cave and bought thousands more. In 1910 the Chinese government had what remained taken to Beijing, though Wang kept some back; Japanese and Russian expeditions later bought from what he had kept. The items are now in London, Paris, Beijing, St Petersburg, Japan and elsewhere.</p><p>Whether this was rescue or plunder is still argued. Chinese scholars have long cast Stein as a villain and the removal as the theft of a national heritage, and Chinese writers still call for the items to be returned; his defenders argue that taking the material to Europe kept it from being lost or destroyed. Today the holding libraries share the collection online through the International Dunhuang Programme.</p>",
    flags: [SENS], links: [L.v30], sources: REF.idp17 + "; " + REF.the04 + "; " + REF.gt23 + "; " + REF.rsaa + "." },
  { id: "c16hall", section: "s2", pos: [-12.0, 2.6, C16.z + 3.6], cat: "II · The Library Cave", title: "The hall of Cave 16",
    html: "<p>Beyond the corridor is the main hall of Cave 16, the large cave off whose corridor the Library Cave opens. The model gives it a platform with simple stand-in figures and walls of small seated Buddhas in the manner of the caves; neither is a copy of what is in Cave 16, and the size of the hall is approximate.</p>",
    flags: [APPROX, RENDER], sources: REF.ed17 + "." },

  // ---- III: the great Buddha
  { id: "c96", section: "s3", pos: [3.4, 2.4, -2.6], cat: "III · The great Buddha", title: "The Northern Great Image",
    html: "<p>The statue was begun in 695, in the reign of the empress Wu Zetian, and is 35.5 metres high by the figure most often given (some sources say 34). It is <strong>Maitreya</strong>, the Buddha of the future, seated; like the other giant statues here it has a core of stone. Its building was renewed many times by the local rulers of different periods, and work on the building and the statue has gone on in modern times.</p><p>Visitors stand at its feet and look up through the building&rsquo;s storeys. The figure here is our own simplified rendering of a seated Buddha at the published height, not a copy of the statue.</p>",
    flags: [RENDER, { t: "Height published; the rest approximate", soft: true }], links: [L.ch20], sources: REF.cd96 + "; " + REF.ahs + "; " + REF.tob + "." },
  { id: "maitreya", section: "s3", pos: [-4.4, 3.0, 2.8], cat: "III · The great Buddha", title: "The Buddha who is to come",
    html: "<p>Buddhists hold that Maitreya now lives as a bodhisattva in the Tushita heaven and will come down to earth, when the teaching of the present Buddha has faded, to teach it again. That he will come is a belief of the tradition, not something history can test.</p>",
    flags: [BELIEF], links: [L.ch20, L.ch53], sources: REF.brit + "; " + REF.ch20 + "." },

  // ---- IV: Cave 254
  { id: "c254", section: "s4", pos: [-2.8, C254.y + 2.4, C254.pillar.z - 2.2], cat: "IV · Cave 254", title: "Cave 254",
    html: "<p>A cave of the Northern Wei dynasty, and the earliest at Mogao built round a central pillar. The front part has a gabled ceiling painted to look like wooden rafters; the back has a flat ceiling and a square pillar joining ceiling and floor, with niches for statues on all four faces. The pillar let worshippers walk round the image in devotion. In the great niche facing the door sits Maitreya. The walls carry rows of small seated Buddhas, some 1,235 of them.</p>",
    flags: [APPROX, RENDER], links: [L.ch20], sources: REF.ed254 + "." },
  { id: "tigress", section: "s4", pos: [-6.4, C254.y + 2.4, C254.z1 - 0.6], cat: "IV · Cave 254", title: "The prince and the tigress",
    html: "<p>The south wall tells a <em>jataka</em>, a story of the Buddha in an earlier life. Prince Mahasattva, the third of three brothers, finds a starving tigress with her cubs; he pierces his neck with a dry bamboo to draw blood and throws himself from the cliff so that she can feed on him. His family find his bones and build a stupa over them. On the north wall King Sibi cuts his own flesh to ransom a dove from a hawk. In both the Buddha-to-be gives his own body to save others, and the painters showed several moments of each story in one crowded scene.</p><p>The panels here are our own simple renderings of the subjects, not copies of the paintings.</p>",
    flags: [RENDER, BELIEF], links: [L.ch20], sources: REF.ed254 + "; " + REF.smart254 + "; " + REF.idpj + "." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>From published figures:</strong> the number of caves and the area of their paintings; the height of the great Buddha; the storeys of the building in front of it; what is in Cave 17 and where it opens; the form of Cave 254 and what is painted in it.</p>" +
    "<p><strong>Approximate:</strong> the height of the cliff, the size of every cave and room, their places along the cliff, the shape of the nine-storey building, the stair and walkway. The statues and paintings are our own simple renderings in the manner of the caves, not copies of any of them.</p>" +
    "<p><strong>Not shown:</strong> the other caves and statues, the second great Buddha, the many wooden doors and locks, the visitor centre and the river.</p>",
  links: [L.ch20, L.v30], sources: REF.unesco + "; " + REF.ed17 + "; " + REF.ed254 + "; " + REF.ahs + "." };

// a dry desert sky
const sky = { bg: "#c9d6e0", fog: "#ddd4c2", hemi: "#f3efe6", ground: "#b29b78", sunPos: [70, 70, 30], sun: 1.6 };

export default { title: "The Mogao Caves", version: 1, stones: ["rock", "floor", "limestone", "wood"], sky, sections, regions, route, info, about, D, V0 };
