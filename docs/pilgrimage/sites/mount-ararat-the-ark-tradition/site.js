/* ==========================================================================
   Mount Ararat & the Ark tradition — the site: sections, walkable regions,
   route, info points. Geometry in the section modules, the mountain in
   massif.js (a scale model behind each place), sizes in dims.js.

   Label (C): a claimed or traditional site. The Bible names "the mountains of
   Ararat", a region, not this peak; ancient Jewish, Syriac, Armenian and
   Islamic traditions placed the landing elsewhere too; no remains of an ark
   have been verified. The site models the mountain and the tradition, and
   shows the claims and the evidence side by side. No ark is modelled as if it
   were found: the only ark is an outline of the size Genesis gives, for
   comparison, which the visitor can switch on.

   Status: "preview" in docs/assets/pilgrimage-data.js (noindex, off the
   menu) until Carter approves. Sources:
   sources/pilgrimage-mount-ararat-the-ark-tradition.md.
   ========================================================================== */
import { region } from "../../kit.js?v=1";
import { D } from "./dims.js?v=1";

const PI = Math.PI;
export const V0 = { x: -300, z: 0 };
export const P1 = { x: 0, z: 0 }, P2 = { x: 3000, z: 0 }, P3 = { x: 6000, z: 0 };   // the three places, far apart in the model
export const EXIT_HREF = "../museum.html#portal";
// facing the summit from a place (km offsets), as an engine yaw
export const yawTo = (from, to) => Math.atan2(-(to.x - from.x), -(to.z - from.z));
const Y1 = yawTo(D.viewS, D.greater), Y2 = yawTo(D.durup, D.greater);

// ---------------------------------------------------------------- short references (full list: sources/pilgrimage-mount-ararat-the-ark-tradition.md)
const REF = {
  jmaps: "R. S. Azzoni et al., &ldquo;Geomorphology of Mount Ararat/A&#287;r&#305; Da&#287;&#305;&rdquo;, <em>Journal of Maps</em> 13.2 (2017), 182&ndash;190",
  inv: "R. S. Azzoni, A. Sar&#305;kaya and D. Fugazza, &ldquo;Turkish glacier inventory and classification from high-resolution satellite data&rdquo; (2020)",
  mta: "General Directorate of Mineral Research and Exploration (MTA), Turkish volcanoes: &ldquo;A&#287;r&#305;&rdquo; (mta.gov.tr)",
  iranica: "<em>Encyclopaedia Iranica</em>, &ldquo;Ararat&rdquo;",
  livius: "Livius.org, &ldquo;A&#287;r&#305; Da&#287;&#305; (the so-called Ararat)&rdquo;",
  brit: "<em>Britannica</em>, &ldquo;Mount Ararat&rdquo; (student edition); 1911 <em>Encyclop&aelig;dia Britannica</em>, &ldquo;Ararat&rdquo;",
  genesis: "Genesis 6:15 and 8:4",
  quran: "Qur&rsquo;an, S&#363;rat H&#363;d 11:44",
  gilg: "the Standard Babylonian <em>Epic of Gilgamesh</em>, Tablet XI",
  collins: "L. G. Collins and D. F. Fasold, &ldquo;Bogus Noah&rsquo;s Ark from Turkey Exposed as a Common Geologic Structure&rdquo;, <em>Journal of Geoscience Education</em> 44.4 (1996), 439&ndash;444",
  navarra: "the radiocarbon dates of Fernand Navarra&rsquo;s 1955 wood, as summarised by the TalkOrigins Archive (claim CH504.2) and <em>Bible and Spade</em>, &ldquo;Ararat &lsquo;Ark&rsquo; Wood Dated at A.D. 700&rdquo;",
  nami: "UPI, &ldquo;Noah&rsquo;s ark claim doubted&rdquo; (28 April 2010); <em>Christian Science Monitor</em>, &ldquo;Doubt cast on Noah&rsquo;s ark found in Turkey&rdquo; (2010)",
  ahora: "R. S. Azzoni et al., &ldquo;Geomorphological effects of the 1840 Ahora Gorge catastrophe on Mount Ararat (Eastern Turkey)&rdquo;, <em>Geomorphology</em> 332 (2019), 10&ndash;21",
  etch: "Mother See of Holy Etchmiadzin, liturgical calendar: the feast of Saint Jacob of Nisibis (armenianchurch.org); Armenian Church of Sydney, calendar entry on the same feast",
  century: "<em>The Christian Century</em>, on the ark relic at Etchmiadzin (christiancentury.org)",
  whe: "WorldHistory.org, &ldquo;Mount Ararat&rdquo;",
  ascent: "<em>The Armenian Mirror-Spectator</em>, &ldquo;Ararat Redux: Abovian, Prof. Parrot and First Ascent&rdquo;",
  ch01: "the archive&rsquo;s chapter on the Flood (ch01)"
};
const L = { ch01: { href: "../chapters/ch01.html", label: "Read the Flood chapter" } };
const APPROX = { t: "The mountain is a scale model: heights published, shape our own", soft: true };
const CONTESTED = { t: "Contested", soft: false };
const CLAIM = { t: "A claim, not a verified find", soft: false };
const TEXT = { t: "From a sacred text", soft: true };
const FAITH = { t: "A tradition of faith", soft: true };

// ---------------------------------------------------------------- sections
const B = (p, r) => [p.x - r, -60, p.z - r, p.x + r, 200, p.z + r];
const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: the traditions of where the ark came to rest, and the way out to the plain." },
  { id: "s1", name: "I · The plain below Ararat", short: "the plain", module: "s1-plain.js", box: B(P1, 40), start: { x: P1.x, z: P1.z + 4, yaw: Y1, y: 0 }, blurb: "On the plain to the south, looking up at the two cones of Ararat." },
  { id: "s2", name: "II · The Durupınar formation", short: "Durupınar", module: "s2-durupinar.js", box: B(P2, 120), start: { x: P2.x, z: P2.z + 80, yaw: 0, y: 9.3 }, blurb: "A boat-shaped formation in the hills south of the mountain, claimed as the Ark." },
  { id: "s3", name: "III · The summit", short: "the summit", module: "s3-summit.js", box: B(P3, 50), start: { x: P3.x, z: P3.z + 3, yaw: 0, y: 0 }, blurb: "On the ice cap of Greater Ararat, 5,137 m up." }
];

// ---------------------------------------------------------------- where the visitor may walk
const regions = [
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0 }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  region({ id: "v-exit", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z + 4.6, z1: V0.z + 5.6, y: 0, inset: 0.05, portal: "museum", href: EXIT_HREF }),
  // the plain: a stretch of steppe, with portals on to the formation and up to the summit, and back
  region({ id: "plain", section: "s1", x0: P1.x - 16, x1: P1.x + 16, z0: P1.z - 16, z1: P1.z + 16, y: 0, outside: true, holes: [[P1.x + 4.8, P1.x + 9.2, P1.z - 11.6, P1.z - 8.4]] }),
  region({ id: "to-s2", section: "s1", x0: P1.x + 15.6, x1: P1.x + 17, z0: P1.z + 2.4, z1: P1.z + 4.4, y: 0, inset: 0.05, portal: "s2", outside: true }),
  region({ id: "to-s3", section: "s1", x0: P1.x - 1, x1: P1.x + 1, z0: P1.z - 17, z1: P1.z - 15.6, y: 0, inset: 0.05, portal: "s3", outside: true }),
  region({ id: "to-v", section: "s1", x0: P1.x - 1, x1: P1.x + 1, z0: P1.z + 15.6, z1: P1.z + 17, y: 0, inset: 0.05, portal: "v", outside: true }),
  // round the Durupınar formation (which is not walked on)
  region({ id: "durup", section: "s2", x0: P2.x - 110, x1: P2.x + 110, z0: P2.z - 50, z1: P2.z + 50, y: 0, outside: true, holes: [[P2.x - D.form.l / 2 - 1, P2.x + D.form.l / 2 + 1, P2.z - D.form.w / 2 - 1, P2.z + D.form.w / 2 + 1]] }),
  region({ id: "slope", section: "s2", x0: P2.x - 40, x1: P2.x + 40, z0: P2.z + 50, z1: P2.z + 95, y: 0, y1: 14, outside: true, open: "n" }),
  region({ id: "s2-out", section: "s2", x0: P2.x - 1, x1: P2.x + 1, z0: P2.z + 94.4, z1: P2.z + 96.6, y: 14, inset: 0.05, portal: "s1", outside: true }),
  // the summit dome
  region({ id: "summit", section: "s3", x0: P3.x - 6, x1: P3.x + 6, z0: P3.z - 6, z1: P3.z + 6, y: 0, outside: true }),
  region({ id: "s3-out", section: "s3", x0: P3.x - 1, x1: P3.x + 1, z0: P3.z + 6, z1: P3.z + 7.4, y: 0, inset: 0.05, portal: "s1", outside: true })
];
for (const r of regions) r.surface = r.section === "v" ? "wood" : r.section === "s3" ? "snow" : "grass";

// ---------------------------------------------------------------- the walking route
const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),
  P(P1.x, P1.z + 4, 0, true, Y1),
  P(P1.x - 4, P1.z - 4, 0, true, Y1),
  P(P1.x + 15.9, P1.z + 3.4, 0, true, -PI / 2),        // the way to Durupınar (the stop is in its portal)
  P(P2.x, P2.z + 80, 9.3, true, 0),                       // the hillside above the formation
  P(P2.x, P2.z + 46, 0, true, 0),
  P(P2.x - 70, P2.z + 30, 0, true, -PI * 0.25),
  P(P2.x, P2.z + 27, 0, false), P(P2.x + 45, P2.z + 27, 0, false), P(P2.x + 90, P2.z + 27, 0, false),   // along the north side (legs under 80 m, so a reduced-motion jump completes)
  P(P2.x + 95, P2.z, 0, true, PI / 2),
  P(P2.x + 60, P2.z + 40, 0, false), P(P2.x + 35, P2.z + 48, 0, false), P(P2.x + 20, P2.z + 75, 7.8, false),
  P(P2.x, P2.z + 95.8, 14, true),                         // back up, and to the plain
  P(P1.x, P1.z - 16.0, 0, true, 0),                       // the way up (the stop is in its portal)
  P(P3.x, P3.z + 3, 0, true, 0),
  P(P3.x + 3, P3.z + 2, 0, true, yawTo(D.greater, D.lesser))   // looking south-east to Lesser Ararat
];

// ---------------------------------------------------------------- info points
const info = [
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you go out", title: "Mount Ararat & the Ark tradition",
    html: "<p>Genesis says that after the Flood the ark came to rest &lsquo;on the mountains of Ararat&rsquo;. Ararat is the Hebrew form of <strong>Urartu</strong>, the name of a kingdom and a region in the highlands north of Assyria; the text names a region, not a single peak. The great volcano now called Mount Ararat, in eastern Turkey, came to be identified as the landing place comparatively late, and it is that identification, and the searches it has inspired, that this site is about.</p><p>The mountain is too large to walk at true size, so it is shown as a <strong>scale model</strong> behind each place you stand, reduced so that it fills the same part of the sky as the real one. Its heights are published; its shape is ours.</p>",
    links: [L.ch01], sources: REF.genesis + "; " + REF.brit + "; " + REF.iranica + "; " + REF.ch01 + "." },
  { id: "v-judi", section: "v", pos: [V0.x - 3.9, 1.7, V0.z + 1.6], cat: "Before you go out", title: "Other mountains of the ark",
    html: "<p>The landing place has more than one tradition. The Qur&rsquo;an says the ark came to rest on <strong>al-J&#363;d&#299;</strong>, and early Syriac, Armenian and Islamic tradition placed it on Mount Judi (Cudi Da&#287;&#305;), in the mountains south of Lake Van, in the land Greek and Roman writers called Gordyene. The older Babylonian flood story in the <em>Epic of Gilgamesh</em> has its boat ground on Mount Nimush, further south-east. According to the <em>Encyclopaedia Iranica</em>, Armenian tradition too placed the landing on Judi until about the 10th century; the identification with this mountain, called Masis in Armenian, is comparatively recent.</p>",
    flags: [CONTESTED, TEXT], links: [L.ch01], sources: REF.quran + "; " + REF.gilg + "; " + REF.iranica + "; " + REF.ch01 + "." },
  { id: "v-door", section: "v", pos: [V0.x, 3.45, V0.z - 4.4], cat: "The way out", title: "To the plain below Ararat",
    html: "<p>Walk into the golden portal to step out onto the plain south of the mountain.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 3.45, V0.z + 4.4], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>This portal returns you to the museum&rsquo;s Rotunda, where the Flood is the first of its themes.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] },
  // ---- I: the plain
  { id: "ararat", section: "s1", pos: [P1.x - 2.5, 1.7, P1.z - 2.5], cat: "I · The plain", title: "Two volcanoes",
    html: "<p>Ararat is a dormant volcano with two cones. <strong>Greater Ararat</strong>, 5,137 m, is the highest mountain in Turkey and in the Armenian highlands; <strong>Lesser Ararat</strong>, 3,896 m, rises to the south-east. The massif is about 35 to 40 km across at its base (sources differ). An ice cap of about 7.3 km&sup2; covers the summit, with glaciers running down its flanks. The great earthquake of 1840 brought down a landslide and mudflows in the Ahora Gorge on the north-east side and destroyed the village of Akori below. Whether the volcano erupted too is disputed: the old accounts are, in the words of a 2019 study, obscure and ambiguous. That study argues that the earthquake set off a sudden eruption, whose meltwater poured down as a mudflow; others read the gorge&rsquo;s deposits as a landslide alone.</p>",
    flags: [APPROX, CONTESTED], sources: REF.jmaps + "; " + REF.mta + "; " + REF.ahora + "." },
  { id: "armenian-ark", section: "s1", pos: [P1.x - 7, 1.7, P1.z - 4], cat: "I · The plain", title: "The ark in Armenian tradition",
    html: "<p>For many Armenians the ark&rsquo;s mountain belongs to the nation&rsquo;s own story. The historian Movses Khorenatsi traced the Armenians to Noah through his son Japheth and the patriarch Haik, who founded the nation near the mountain. The mountain, with the ark resting on its summit, stands on Armenia&rsquo;s coat of arms.</p><p>At Holy Etchmiadzin, the mother church of the Armenian Apostolic Church, a piece of wood kept in a reliquary is venerated as a fragment of the ark. The church tells how Saint Jacob of Nisibis, a 4th-century bishop, set out up the mountain to find the ark, fell asleep at its foot, and woke to find the wood beside him, placed there by an angel; another telling has the promise come in a dream. The church keeps a feast in his memory. For believers the relic and the mountain are holy as a matter of faith; the story is a tradition of the church, not a historical record.</p>",
    flags: [FAITH], links: [L.ch01], sources: REF.etch + "; " + REF.century + "; " + REF.whe + "." },
  { id: "masis", section: "s1", pos: [P1.x + 3, 1.7, P1.z - 6], cat: "I · The plain", title: "Masis",
    html: "<p>For Armenians the mountain is <strong>Masis</strong>, a sacred mountain and a national symbol. Since the early 1920s it has lain inside Turkey, where it is Ağrı Dağı, and it is seen from Armenia across the border.</p><p>For many Jews and Christians the Genesis account is sacred history, and for many believers the mountain is a place where it can be felt; for others the story is one telling of the widespread flood stories of the ancient Near East. Both readings are set out in the Flood chapter.</p>",
    flags: [TEXT], links: [L.ch01], sources: REF.brit + "; " + REF.ch01 + "." },
  // ---- II: Durupınar
  { id: "durupinar", section: "s2", pos: [P2.x - 4, 11.2, P2.z + 78], cat: "II · Durupınar", title: "The Durupınar formation",
    html: "<p>About 30 km south of the summit, on the slopes of another volcano, Tend&uuml;rek, lies a boat-shaped formation about 160 m long. It is usually said to have been exposed by rain and earthquakes in 1948 and was noticed on aerial photographs in 1959 by a Turkish army captain, &#304;lhan Durup&#305;nar, after whom it is named. From the 1980s it was promoted as the remains of Noah&rsquo;s ark.</p><p>Geologists explain it as a natural structure. In 1996 the geologist Lorence Collins and David Fasold, who had earlier championed the site, showed that its &lsquo;walls&rsquo; are tilted rock layers folded into a doubly plunging syncline, its &lsquo;iron brackets&rsquo; weathered volcanic minerals, and its &lsquo;petrified wood&rsquo; altered rock; an excavation in 1960 had found only soil and rock. Claims that new scans show a built structure have not been published in a peer-reviewed form.</p>",
    flags: [CLAIM, { t: "Its shape here follows descriptions, not a survey", soft: true }], links: [L.ch01], sources: REF.collins + "." },
  { id: "arkG", section: "s2", pos: [P2.x + 20, 2.0, P2.z - 30], cat: "II · Durupınar", title: "The size Genesis gives",
    toggle: { id: "genesis-ark", on: "Show the size Genesis gives", off: "Hide the outline" },
    html: "<p>Genesis gives the ark&rsquo;s size as 300 cubits long, 50 wide and 30 high. With a cubit of about half a metre (estimates run from about 0.45 to 0.52 m), that is roughly 150 &times; 25 &times; 15 m. Switch on the outline to compare it with the formation. Supporters of the site point to the similar length; geologists note that a similar length does not make a natural fold into a boat.</p>",
    flags: [TEXT, CONTESTED], links: [L.ch01], sources: REF.genesis + "; " + REF.collins + "." },
  { id: "claims", section: "s2", pos: [P2.x + 95, 2.0, P2.z - 8], cat: "II · Durupınar", title: "Searches and claims",
    html: "<p>Since the 19th century many expeditions have climbed Ararat itself looking for the ark, and many sightings and finds have been announced. None has been verified. Wood brought down by the French explorer Fernand Navarra in 1955 was dated by radiocarbon at several laboratories to the centuries around 700 CE, far too young. In 2010 a Hong Kong-based group announced wooden remains high on the mountain; a former member of its team said he believed the find had been staged, and the group has not opened its site or its evidence to independent archaeologists.</p>",
    flags: [CLAIM], links: [L.ch01], sources: REF.navarra + "; " + REF.nami + "." },
  // ---- III: the summit
  { id: "summit", section: "s3", pos: [P3.x - 3, 1.5, P3.z - 3], cat: "III · The summit", title: "On the ice cap",
    html: "<p>The summit of Greater Ararat is a dome of ice and snow, 5,137 m up. The ice cap and its four small outlet glaciers cover more than 60% of the glacier area in Turkey, and they are shrinking: between 1990 and 2016 they lost about 29% of their area.</p><p>The first recorded ascent was made in October 1829 by the scientist Friedrich Parrot and the Armenian writer Khachatur Abovian, with two soldiers and two Armenian villagers.</p>",
    flags: [APPROX], sources: REF.inv + "; " + REF.jmaps + "; " + REF.ascent + "." },
  { id: "view", section: "s3", pos: [P3.x + 4, 1.3, P3.z + 3], cat: "III · The summit", title: "What you see from here",
    html: "<p>To the south-east the cone of Lesser Ararat; to the north the wide valley of the Aras river and, beyond it, Armenia; to the south the plain of Doğubayazıt. No find on the mountain has been verified as ancient. Genesis names &lsquo;the mountains of Ararat&rsquo;, a region, not this peak; the tradition that placed the landing here grew later, and for centuries Armenian tradition itself placed it elsewhere (see the card &lsquo;Other mountains of the ark&rsquo; in the Vestibule).</p>",
    flags: [APPROX], sources: REF.livius + "; " + REF.iranica + "; " + REF.navarra + "; " + REF.nami + "." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>Published:</strong> the heights of Greater (5,137 m) and Lesser (3,896 m) Ararat, the size of the massif and of its ice cover, the length of the Durupınar formation (sources give 157 m and 164 m), and the size Genesis gives the ark.</p>" +
    "<p><strong>Our own:</strong> the shape of the mountain (a height field drawn to those figures, not a copy of a survey), its gullies, its snowline, where exactly you stand, and the formation&rsquo;s width and height. The mountain is reduced 50 times in every direction, so it looks right from where you stand but cannot be walked.</p>" +
    "<p><strong>Not shown:</strong> any ark (except the outline of Genesis&rsquo;s figures, on request), the villages, the roads, the buildings at Durupınar, and the climbers&rsquo; camps.</p>",
  links: [L.ch01], sources: REF.jmaps + "; " + REF.collins + "; " + REF.genesis + "." };

// a high, clear sky; the sun from the south-east
const sky = { bg: "#9fbbd6", fog: "#c2d1df", hemi: "#e8eef6", ground: "#9a8f6a", sunPos: [70, 85, 60], sun: 1.55, fogNear: 200, fogFar: 1500, far: 1700 };

export default { title: "Mount Ararat & the Ark tradition", version: 1, stones: ["turf", "rock", "wood"], sky, sections, regions, route, info, about, D, V0 };
