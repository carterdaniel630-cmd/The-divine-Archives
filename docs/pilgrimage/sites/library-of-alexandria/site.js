/* ==========================================================================
   The Library of Alexandria — a labelled reconstruction: sections, walkable
   regions, route, info points. Geometry lives in s0-vestibule.js,
   s1-court.js and s2-hall.js; every size in dims.js is conjecture.

   Label (R): lost or destroyed. Almost nothing of the plan is known, so this
   site says loudly, on every card, what is attested (by ancient writers) and
   what is guesswork (plans/pilgrimage-sites.md, master list).

   Status: "preview" in docs/assets/pilgrimage-data.js. The page exists
   (noindex) but the site is off the menu until Carter approves it going live.
   Sources: sources/pilgrimage-library-of-alexandria.md.
   ========================================================================== */
import { region } from "../../kit.js?v=1";
import { D } from "./dims.js?v=1";

const PI = Math.PI, S_ = PI;
export const V0 = { x: -200, z: 0 };
export const EXIT_HREF = "../museum.html#ch15";
const H = D.hall;

const REF = {
  strabo: "Strabo, <em>Geography</em> 17.1.8, trans. H. L. Jones, Loeb Classical Library (1932)",
  bagnall: "R. S. Bagnall, &ldquo;Alexandria: Library of Dreams&rdquo;, <em>Proceedings of the American Philosophical Society</em> 146, no. 4 (2002): 348&ndash;362",
  ucl: "UCL Digital Egypt, &ldquo;The Mouseion of Alexandria&rdquo; (ucl.ac.uk)",
  openlearn: "The Open University, OpenLearn, <em>The Library of Alexandria</em>, &ldquo;Assessing the evidence&rdquo;",
  whe: "World History Encyclopedia, &ldquo;Callimachus of Cyrene&rdquo;",
  aristeas: "<em>The Letter of Aristeas</em>, trans. H. St J. Thackeray (London, 1917); <em>Jewish Encyclopedia</em> (1906), &ldquo;Aristeas, Letter of&rdquo;",
  natgeo: "<em>National Geographic</em>, &ldquo;Who burned the Library of Alexandria?&rdquo;",
  bibalex: "Bibliotheca Alexandrina, on the ancient library and the modern site (bibalex.org)",
  ch15: "the archive&rsquo;s Classical Greece chapter (ch15)"
};
const L = {
  ch15: { href: "../chapters/ch15.html", label: "Read the Classical Greece chapter" },
  ch17: { href: "../chapters/ch17.html", label: "Gnosticism" },
  ch10: { href: "../chapters/ch10.html", label: "Second Temple Judaism" },
  v53: { href: "../vault/rosetta-stone.html", label: "The Rosetta Stone (Vault)" }
};
const RECON = { t: "Reconstruction: the building is conjecture", soft: false };
const ATTESTED = { t: "Attested by an ancient writer", soft: true };
const CONTESTED = { t: "Contested", soft: false };

const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: what is known and what is not, a Ptolemaic object for comparison, and the way in." },
  { id: "s1", name: "I · The walk and the exedra (reconstruction)", short: "the walk", module: "s1-court.js", box: [-22, -1, -24, 22, 12, 20], start: { x: 0, z: 7, yaw: 0, y: 0 }, blurb: "A colonnaded walk round a garden court, and a semicircular exedra with seats: Strabo's 'public walk' and 'exedra', as an ordinary Hellenistic builder might have made them." },
  { id: "s2", name: "II · The large house (reconstruction)", short: "the large house", module: "s2-hall.js", box: [H.x - 12, -1, H.z - 16, H.x + 12, 12, H.z + 16], start: { x: H.x, z: H.z - H.d / 2 + 1.2, yaw: S_, y: 0 }, blurb: "Strabo's 'large house' with the scholars' dining hall, and a book room of wall niches after later Roman libraries." }
];

const cx0 = D.court.x0 - D.walk, cx1 = D.court.x1 + D.walk, cz0 = D.court.z0 - D.walk, cz1 = D.court.z1 + D.walk;
const regions = [
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0, holes: [[V0.x - 3.2, V0.x - 2.0, V0.z - 1.6, V0.z - 0.4]] }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  region({ id: "v-exit", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z + 4.6, z1: V0.z + 5.6, y: 0, inset: 0.05, portal: "museum", href: EXIT_HREF }),
  // the whole court and walk are one floor; the exedra opens off its north side
  region({ id: "court", section: "s1", x0: cx0, x1: cx1, z0: cz0, z1: cz1, y: 0, outside: true, inset: 0.5, holes: [[D.court.x0 + 2, D.court.x1 - 2, D.court.z0 + 2, D.court.z1 - 2]] }),
  region({ id: "exedra", section: "s1", x0: -2.4, x1: 2.4, z0: cz0 - 2.6, z1: cz0 + 0.6, y: 0, outside: true, inset: 0.1, open: "s" }),
  region({ id: "to-hall", section: "s1", x0: -0.9, x1: 0.9, z0: cz1 - 0.7, z1: cz1 + 0.2, y: 0, inset: 0.05, portal: "s2", outside: true }),
  region({ id: "to-v", section: "s1", x0: cx1 - 0.7, x1: cx1 + 0.2, z0: -0.9, z1: 0.9, y: 0, inset: 0.05, portal: "v", outside: true }),
  region({ id: "hall", section: "s2", x0: H.x - H.w / 2, x1: H.x + H.w / 2, z0: H.z - H.d / 2, z1: H.z + H.d / 2, y: 0, inset: 0.9,
    holes: [[H.x - 3.6, H.x + 3.6, H.z + 3.4, H.z + 6.6], [H.x - 1.8, H.x - 0.6, H.z - 6.1, H.z - 4.9]] }),
  region({ id: "hall-out", section: "s2", x0: H.x - 0.8, x1: H.x + 0.8, z0: H.z - H.d / 2 - 0.2, z1: H.z - H.d / 2 + 1.2, y: 0, inset: 0.05, portal: "s1" })
];
for (const r of regions) r.surface = r.section === "v" ? "wood" : "stone";

const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),
  P(0, 7, 0, true, 0),
  P(-9, -5, 0, true, -PI / 2),
  P(0, cz0 - 1.6, 0, true, 0),
  P(9, 6, 0, true, PI / 2),
  P(0, cz1 - 0.3, 0, true),
  P(H.x, H.z - H.d / 2 + 1.2, 0, true, S_),
  P(H.x - 4, H.z - 5, 0, true, -PI / 2),
  P(H.x, H.z + 1.5, 0, true, S_),
  P(H.x + 4, H.z - 2, 0, true, PI / 2)
];

const info = [
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you go in", title: "A library we cannot see",
    html: "<p>The Library of Alexandria was founded under the first Ptolemies, the Macedonian kings of Egypt, around 300 BCE, as part of the <strong>Museum</strong> (<em>Mouseion</em>), a shrine of the Muses where scholars lived and worked at royal expense. It became the ancient world&rsquo;s most famous collection of books.</p><p>Almost nothing of its buildings is known. Its site in the old royal quarter has never been securely identified; no plan survives; no ancient writer describes its book rooms. <strong>What you will walk through is a reconstruction</strong>: the few buildings an ancient writer names, put together as an ordinary builder of the time might have made them. Every card says what is attested and what is guesswork.</p>",
    flags: [RECON], links: [L.ch15], sources: REF.bagnall + "; " + REF.strabo + "; " + REF.openlearn + "." },
  { id: "v-v53", section: "v", pos: [V0.x - 2.6, 1.35, V0.z - 1.0], relic: { id: "v53", slug: "rosetta-stone", title: "The Rosetta Stone", category: "Texts & Tablets", held: "British Museum, London (EA 24)", dated: "196 BCE", kind: "slab" }, title: "The Rosetta Stone (for comparison)",
    html: "<p><strong>Not from the Library.</strong> A decree of Egyptian priests honouring Ptolemy V, set up in 196 BCE, in three scripts: hieroglyphic, Demotic and Greek. It shows the world the Library served: a Greek-speaking court ruling an Egyptian kingdom, with the Egyptian temples as partners.</p>" },
  { id: "v-door", section: "v", pos: [V0.x, 3.45, V0.z - 4.4], cat: "The way in", title: "To the Museum (reconstruction)",
    html: "<p>Walk into the golden portal to enter the reconstruction.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 3.45, V0.z + 4.4], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>This portal returns you to the museum, to the room of Classical Greece.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] },
  // ---- I: the walk and the exedra
  { id: "strabo", section: "s1", pos: [0, 2.0, 5.4], cat: "I · The walk", title: "The one description: Strabo",
    html: "<p>The geographer Strabo spent several years in Alexandria in the 20s BCE. He is the only ancient writer to describe the Museum&rsquo;s buildings, in one sentence: &ldquo;The Museum is also a part of the royal palaces; it has a public walk, an exedra with seats, and a large house, in which is the common mess-hall of the men of learning who share the Museum. This group of men not only hold property in common, but also have a priest in charge of the Museum, who formerly was appointed by the kings, but is now appointed by Caesar.&rdquo;</p><p>That is all. He does not mention the books. This court, its colonnade and the exedra are built from those words.</p>",
    flags: [ATTESTED, RECON], links: [L.ch15], sources: REF.strabo + "; " + REF.ucl + "." },
  { id: "exedra", section: "s1", pos: [0, 2.4, D.court.z0 - D.walk - 2.4], cat: "I · The walk", title: "The exedra with seats",
    html: "<p>An exedra was a recess, often semicircular, with a stone bench round it: a place to sit and talk in the open air. Strabo names one. Its shape, size and place here are our guess; the semicircle is the commonest form in Greek buildings of the time.</p>",
    flags: [ATTESTED, RECON], sources: REF.strabo + "." },
  { id: "muses", section: "s1", pos: [-9.5, 2.0, -5.0], cat: "I · The walk", title: "A shrine of the Muses, with a priest",
    html: "<p>The Museum was a religious foundation as well as a learned one: a shrine of the Muses, the goddesses of the arts, with a priest at its head, appointed first by the Ptolemies and then by the Roman emperors. Its scholars, poets and scientists were paid by the king and ate together. Among them were the poet and bibliographer <strong>Callimachus</strong>, whose <em>Pinakes</em> (&ldquo;Tables&rdquo;), in 120 books, listed Greek authors and their works, and the scholar-librarians Zenodotus, Apollonius of Rhodes, Eratosthenes and Aristophanes of Byzantium.</p><p>Callimachus is often called head of the Library; the ancient list of librarians does not name him.</p>",
    flags: [ATTESTED], links: [L.ch15], sources: REF.strabo + "; " + REF.whe + "; " + REF.bagnall + "." },
  { id: "where", section: "s1", pos: [9.5, 2.0, 5.0], cat: "I · The walk", title: "Where was it?",
    html: "<p>In the royal quarter of the city, the Brucheion, near the harbour; that much the ancient writers agree on. Its exact site is unknown, and no remains of it have been securely identified; much of the ancient royal quarter is now under the modern city or the sea. The Bibliotheca Alexandrina, opened in 2002, stands near where the ancient palaces are thought to have been.</p>",
    flags: [{ t: "Site unknown", soft: false }], sources: REF.bibalex + "; " + REF.bagnall + "." },
  // ---- II: the large house
  { id: "house", section: "s2", pos: [H.x - 2.0, 2.2, H.z - H.d / 2 + 1.6], cat: "II · The large house", title: "The large house and the common table",
    html: "<p>Strabo&rsquo;s &ldquo;large house&rdquo; held the common dining hall of the scholars. Its plan is unknown. Here it is a plain columned hall with a long table, as Hellenistic dining halls often were.</p>",
    flags: [ATTESTED, RECON], sources: REF.strabo + "." },
  { id: "books", section: "s2", pos: [H.x - H.w / 2 + 1.2, 2.2, H.z - 5.0], cat: "II · The book room (conjecture)", title: "What a book was, and how many there were",
    html: "<p>The books were rolls of papyrus, written in columns and read by unrolling, not codices with pages. No source describes how they were kept here. This room&rsquo;s wall niches of pigeonholes follow later Roman libraries, whose plans survive.</p><p>Ancient writers give the collection anywhere from 40,000 to 700,000 rolls. Roger Bagnall has shown that none of these figures rests on reliable evidence, and that they are hard to square with how much Greek literature there ever was: on his estimate the whole of it might have filled some tens of thousands of rolls at most. The real size of the Library is unknown.</p>",
    flags: [CONTESTED, RECON], links: [L.ch15], sources: REF.bagnall + "; " + REF.openlearn + "." },
  { id: "aristeas", section: "s2", pos: [H.x - 1.2, 1.9, H.z - 5.5], cat: "II · The book room (conjecture)", title: "The legend of the Seventy-Two",
    html: "<p>The <em>Letter of Aristeas</em> tells how the king&rsquo;s librarian, Demetrius of Phalerum, urged Ptolemy II to add the Jewish law to the Library, and how seventy-two elders from Jerusalem, six from each tribe, translated it into Greek: the origin of the name Septuagint. Most scholars date the letter to the mid-second century BCE or later and treat its story as legend. Demetrius was an adviser of Ptolemy I and is said to have been banished by Ptolemy II. The Greek translation of the Torah itself is real, and was made in Alexandria in the third century BCE.</p>",
    flags: [{ t: "Legend", soft: false }], links: [L.ch10], sources: REF.aristeas + "." },
  { id: "end", section: "s2", pos: [H.x + H.w / 2 - 1.2, 2.2, H.z - 2.0], cat: "II · The large house", title: "How it ended: four stories",
    html: "<p>There was no single great fire. <strong>Julius Caesar</strong>, besieged in Alexandria in 48 BCE, set ships alight; Plutarch says the fire destroyed the great library, but other writers say it burned the fleet and houses by the sea, and scholars later worked in Alexandria as before. The royal quarter was largely destroyed in the fighting under the emperor <strong>Aurelian</strong> in the 270s CE, and after that the Library itself is not heard of. The temple of Sarapis, which had a library of its own, was destroyed in <strong>391 CE</strong>, but no source of the time mentions books there. The story that the caliph <strong>Umar</strong> had the books burned to heat the baths after the Arab conquest of 642 is first told some six centuries later, and most historians reject it.</p><p>The Library most likely faded through neglect and the loss of royal money as much as through fire.</p>",
    flags: [CONTESTED], links: [L.ch15, L.ch17], sources: REF.natgeo + "; " + REF.bagnall + "." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>Attested:</strong> that the Museum had a public walk, an exedra with seats, and a large house with a common dining hall (Strabo), and that it was a shrine of the Muses with a priest. That the Library existed, was famous, and kept papyrus rolls.</p>" +
    "<p><strong>Conjecture, all of it:</strong> the plan, the sizes, the columns, the garden, the arrangement of the rooms, the book room and its niches, the materials and the colours. They follow ordinary Hellenistic and Roman buildings of the kinds Strabo names, not any evidence from Alexandria, because there is none.</p>" +
    "<p><strong>Not shown:</strong> the rest of the palace quarter, the harbour and the Pharos, the temple of Sarapis and its library, and the scholars themselves.</p>",
  links: [L.ch15], sources: REF.strabo + "; " + REF.bagnall + "." };

export default { title: "The Library of Alexandria (reconstruction)", version: 1, stones: ["gallery", "block", "floor", "wood"], sections, regions, route, info, about, D, V0 };
