/* ==========================================================================
   Stonehenge — the site: sections, walkable regions, route, info points.
   Geometry lives in the section modules (s0-vestibule.js … s3-inner.js),
   measurements in dims.js, the stone builder in ../../megalith.js.

   Status: "preview" in docs/assets/pilgrimage-data.js. The page exists
   (noindex) but the site is off the menu until Carter approves it going live.
   Plan: plans/pilgrimage-sites.md (I · Prehistory). Sources:
   sources/pilgrimage-stonehenge.md.

   Frame (see dims.js): metres; y up; the solstice axis runs along -z, so
   "model north" is midsummer sunrise (north-east on the ground). The monument
   is shown as it stands today, ruined, with the pattern of standing, fallen
   and missing stones simplified.
   ========================================================================== */
import { region } from "../../kit.js?v=1";
import { D } from "./dims.js?v=1";
import { ringStones, innerStones } from "./layout.js?v=1";

const PI = Math.PI, S_ = PI;                   // yaw PI faces +z (towards the stones from the Avenue)
export const V0 = { x: -300, z: 0 };          // the archive's own vestibule
export const EXIT_HREF = "../museum.html#ch42";

// ---------------------------------------------------------------- short references (full list: sources/pilgrimage-stonehenge.md)
const REF = {
  ehStones: "English Heritage, &ldquo;Discover more about the Stones&rdquo; (english-heritage.org.uk, Stonehenge)",
  ehDesc: "English Heritage, &ldquo;Description of Stonehenge&rdquo; (english-heritage.org.uk)",
  ehSky: "English Heritage, &ldquo;Celestial Stonehenge&rdquo; (english-heritage.org.uk)",
  ehKit: "English Heritage, Stonehenge teachers&rsquo; kit (KS3), &ldquo;Small-scale Stonehenge&rdquo;",
  ehCons: "English Heritage, &ldquo;From restoration to conservation&rdquo; (english-heritage.org.uk)",
  cleal: "R. M. J. Cleal, K. E. Walker and R. Montague, <em>Stonehenge in its Landscape: Twentieth-Century Excavations</em>, English Heritage Archaeological Report 10 (1995)",
  nash: "D. J. Nash et al., &ldquo;Origins of the sarsen megaliths at Stonehenge&rdquo;, <em>Science Advances</em> 6 (2020), as reported by English Heritage, &ldquo;Research reveals origin of Stonehenge stones&rdquo;",
  clarke: "A. J. I. Clarke et al., &ldquo;A Scottish provenance for the Altar Stone of Stonehenge&rdquo;, <em>Nature</em> 632 (2024), 570&ndash;575",
  allen: "M. J. Allen et al., &ldquo;Stonehenge&rsquo;s Avenue and &lsquo;Bluestonehenge&rsquo;&rdquo;, <em>Antiquity</em> 90 (2016), 991&ndash;1008",
  mpp: "M. Parker Pearson, <em>Stonehenge: Exploring the Greatest Stone Age Mystery</em> (London: Simon &amp; Schuster, 2012)",
  banton: "S. Banton et al., &ldquo;Parchmarks at Stonehenge, July 2013&rdquo;, <em>Antiquity</em> 88 (2014)",
  waun: "M. Parker Pearson et al., &ldquo;The original Stonehenge?&rdquo;, <em>Antiquity</em> 95 (2021); T. Darvill, &ldquo;Mythical rings?&rdquo;, <em>Antiquity</em> 96 (2022), and the authors&rsquo; reply in the same issue",
  ehFeast: "English Heritage, &ldquo;Food and feasting at Stonehenge&rdquo; (the Durrington Walls pig bones)",
  dw: "T. Darvill and G. Wainwright&rsquo;s 2008 excavation and their &lsquo;healing&rsquo; reading, as reported by the Religion Media Centre, &ldquo;Stonehenge: a Neolithic cathedral, a healing place, or a memorial to ancestors?&rdquo;",
  ch42: "the archive&rsquo;s Neolithic chapter (ch42)"
};
const L = {
  ch42: { href: "../chapters/ch42.html", label: "Read the Neolithic chapter" },
  ch41: { href: "../chapters/ch41.html", label: "Prehistoric religion" },
  v45: { href: "../vault/nebra-sky-disc.html", label: "The Nebra Sky Disc (Vault)" }
};
const APPROX = { t: "Layout after published plans · sizes partly approximate", soft: true };
const RUIN = { t: "Shown as it stands today, simplified", soft: true };
const CONTESTED = { t: "Contested", soft: false };

// ---------------------------------------------------------------- sections (one big box each: the monument is open ground, all of it in view at once)
const BIG = [-220, -6, -260, 220, 40, 220];
const sections = [
  { id: "v", name: "The Pilgrim's Vestibule", short: "the Vestibule", module: "s0-vestibule.js", box: [V0.x - 6, -1, V0.z - 7, V0.x + 6, 6, V0.z + 7], start: { x: V0.x, z: V0.z + 3.2, yaw: 0, y: 0 }, blurb: "The archive's own room: the portal back to the museum, a Vault object for comparison, and the way out onto Salisbury Plain." },
  { id: "s1", name: "I · The Avenue", short: "the Avenue", module: "s1-avenue.js", box: BIG, start: { x: 0, z: -136, yaw: S_, y: 0 }, blurb: "Walk up the last stretch of the Avenue past the Heel Stone, across the ditch and bank of the henge." },
  { id: "s2", name: "II · Within the henge", short: "the henge", module: "s2-circle.js", box: BIG, start: { x: 0, z: -30, yaw: S_, y: 0 }, blurb: "The grass inside the bank: the Aubrey Holes, the Station Stones, and the sarsen circle with its lintels." },
  { id: "s3", name: "III · Inside the stones", short: "inside the stones", module: "s3-inner.js", box: BIG, start: { x: 0, z: -6, yaw: S_, y: 0 }, blurb: "The horseshoe of trilithons, the bluestones, and the Altar Stone under the fallen Great Trilithon." }
];

// ---------------------------------------------------------------- where the visitor may walk
// stone footprints come from the shared layout, so the regions are ready before any module loads
const ring = ringStones(), inner = innerStones();
const pad = (f, p) => [f.x0 - p, f.x1 + p, f.z0 - p, f.z1 + p];
const regions = [
  region({ id: "v", section: "v", x0: V0.x - 4, x1: V0.x + 4, z0: V0.z - 5, z1: V0.z + 5, y: 0, holes: [[V0.x - 3.2, V0.x - 2.0, V0.z - 1.6, V0.z - 0.4]] }),
  region({ id: "v-door", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z - 5.6, z1: V0.z - 4.6, y: 0, inset: 0.05, portal: "s1" }),
  region({ id: "v-exit", section: "v", x0: V0.x - 0.8, x1: V0.x + 0.8, z0: V0.z + 4.6, z1: V0.z + 5.6, y: 0, inset: 0.05, portal: "museum", href: EXIT_HREF }),
  // the Avenue, between its banks, and the way back to the Vestibule at its far end
  region({ id: "avenue", section: "s1", x0: -D.avW / 2 + 1, x1: D.avW / 2 - 1, z0: -D.avLen - 6, z1: -D.ditchR - 3, y: 0, outside: true, holes: [pad(ring.heel, 0.3)] }),
  region({ id: "to-v", section: "s1", x0: -0.8, x1: 0.8, z0: -D.avLen - 7.2, z1: -D.avLen - 5.8, y: 0, inset: 0.05, portal: "v", outside: true }),
  // the causeway across the ditch at the north-east entrance
  region({ id: "causeway", section: "s1", x0: -D.entranceW / 2, x1: D.entranceW / 2, z0: -D.ditchR - 5, z1: -D.bankR + 3, y: 0, outside: true, holes: [pad(ring.slaughter, 0.2)] }),
  // the grass within the henge, round the outside of the sarsen circle
  region({ id: "henge", section: "s2", x0: -33, x1: 33, z0: -D.bankR + 2, z1: 33, y: 0, outside: true,
    holes: [[-D.sarsenR - 1.2, D.sarsenR + 1.2, -D.sarsenR - 1.2, D.sarsenR + 1.2]].concat(ring.station.map((f) => pad(f, 0.2))) }),
  // the gap on the axis between stones 30 and 1, through the bluestone circle
  region({ id: "gap", section: "s3", x0: -0.5, x1: 0.5, z0: -D.sarsenR - 1.6, z1: -D.bluR + 3.8, y: 0, inset: 0.05, outside: true }),
  // inside the stones
  region({ id: "inner", section: "s3", x0: -7.8, x1: 7.8, z0: -8.2, z1: 7.8, y: 0, outside: true, holes: inner.map((f) => pad(f, 0.25)) })
];
for (const r of regions) r.surface = r.section === "v" ? "wood" : "grass";

// ---------------------------------------------------------------- the walking route (Walk on / Walk back)
const P = (x, z, y, stop, yaw) => ({ x, z, y, stop: !!stop, yaw });
const route = [
  P(V0.x, V0.z + 2.0, 0, true),
  P(V0.x, V0.z - 5.2, 0, true),                      // out onto the plain
  P(0, -136, 0, true, S_),
  P(-3, -84, 0, true, S_),                             // the Heel Stone
  P(-3, -60, 0, true, S_),                             // the entrance and the Slaughter Stone
  P(-8, -40, 0, true, S_ + 0.4),                       // the Aubrey Holes
  P(-20, -10, 0, true, PI / 2),                        // the sarsen circle from outside
  P(0, -30, 0, true, S_),
  P(0, -16, 0, true, S_),                              // the gap on the axis
  P(0, -6, 0, true, S_),                               // inside: the trilithons
  P(-2.4, 1.5, 0, true, S_),                           // the Great Trilithon and the Altar Stone
  P(0, -2, 0, true, 0)                                 // look back along the axis to the Heel Stone
];

// ---------------------------------------------------------------- info points
const info = [
  // ---- vestibule (the archive's own room)
  { id: "v-board", section: "v", pos: [V0.x + 3.9, 1.7, V0.z - 1.5], cat: "Before you go out", title: "Stonehenge",
    html: "<p>Stonehenge stands on Salisbury Plain in Wiltshire. It was built and rebuilt over some fifteen hundred years: a circular ditch and bank about 3000 BCE, the great sarsen stones about 2500 BCE, and the bluestones moved into new settings for centuries afterwards. Its builders left no writing, so what it was <em>for</em> is a matter of interpretation.</p><p>This walk comes up the last stretch of the <strong>Avenue</strong>, crosses into the <strong>henge</strong>, and goes inside the <strong>stone circle</strong>, which today&rsquo;s visitors can enter only by special arrangement. The monument is shown ruined, as it stands; the layout follows published plans, and the stone is drawn in code.</p>",
    links: [L.ch42], sources: REF.ehDesc + "; " + REF.cleal + "; " + REF.ch42 + "." },
  { id: "v-v45", section: "v", pos: [V0.x - 2.6, 1.35, V0.z - 1.0], relic: { id: "v45", slug: "nebra-sky-disc", title: "The Nebra Sky Disc", category: "Relics & Sacred Objects", held: "State Museum of Prehistory, Halle (Saale), Germany", dated: "Buried c. 1600 BCE (Early Bronze Age)", kind: "disc" }, title: "The Nebra Sky Disc (for comparison)",
    html: "<p><strong>Not from Stonehenge.</strong> A bronze disc with gold sun, moon and stars, buried in Germany some centuries after the sarsens were raised. It is shown here because it is another Bronze Age attempt to fix the sky in a made thing, as Stonehenge&rsquo;s solstice axis does in stone.</p>" },
  { id: "v-door", section: "v", pos: [V0.x, 3.45, V0.z - 4.4], cat: "The way out", title: "To the Avenue",
    html: "<p>Walk into the golden portal to step out onto the Avenue, some way below the stones.</p>" },
  { id: "v-back", section: "v", pos: [V0.x, 3.45, V0.z + 4.4], cat: "The Pilgrimage", title: "Back to the museum",
    html: "<p>This portal returns you to the museum, to the room of the Neolithic.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] },
  // ---- I: the Avenue
  { id: "avenue", section: "s1", pos: [6.5, 1.6, -128], cat: "I · The Avenue", title: "The Avenue",
    html: "<p>You are standing between two low banks, each with a ditch on its outer side, about 22 metres apart. The Avenue runs straight up to the stones along their solstice axis, and further back it bends away down to the River Avon, some two and a half to three kilometres in all. At the river end, excavation in 2009 found a small circle that had once held stones, since nicknamed &lsquo;Bluestonehenge&rsquo;.</p><p>Here, close to the monument, the excavators found natural grooves in the chalk running exactly along the solstice line. One reading is that the builders noticed them and laid out Stonehenge&rsquo;s axis on them. Others think the match is a coincidence.</p>",
    flags: [APPROX, CONTESTED], links: [L.ch42], sources: REF.allen + "; " + REF.ehDesc + "." },
  { id: "heel", section: "s1", pos: [D.heel.x - 2.4, 1.8, D.heel.z + 1.5], cat: "I · The Avenue", title: "The Heel Stone",
    html: "<p>An unshaped sarsen about 4.5 to 4.7 metres high above the ground, leaning towards the circle, standing alone outside the entrance. Seen from the centre of the stones on Midsummer&rsquo;s Day, the sun rises just to the left of it. A large hole found beside it may once have held a partner, so that the two stones framed the sunrise.</p><p>The alignment works in both directions: looking the other way down the axis, from here through the stones, is the midwinter sunset.</p>",
    flags: [{ t: "Height published; distance approximate", soft: true }], links: [L.ch42], sources: REF.ehSky + "; " + REF.ehStones + "." },
  { id: "entrance", section: "s1", pos: [3.2, 1.5, -58], cat: "I · The Avenue", title: "The ditch, the bank and the Slaughter Stone",
    html: "<p>The first Stonehenge, about 3000 BCE, was this: a circular ditch about 110 metres across, with the chalk thrown up into a bank on its <em>inner</em> side, the reverse of most henges. Both are worn low now. The wide gap you are crossing was the main entrance.</p><p>The stone lying flat beside the way in is the <strong>Slaughter Stone</strong>, a fallen sarsen. Its name is a modern one, prompted by the reddish colour that rainwater takes on in its hollows, from iron in the stone; there is no evidence it was used for killing anything.</p>",
    flags: [APPROX], links: [L.ch42], sources: REF.cleal + "; " + REF.ehDesc + "." },
  // ---- II: within the henge
  { id: "aubrey", section: "s2", pos: [-10, 1.3, -38], cat: "II · Within the henge", title: "The Aubrey Holes",
    html: "<p>The white discs in the grass mark the <strong>Aubrey Holes</strong>: a ring of 56 pits, each about a metre across, just inside the bank. They are named after John Aubrey, the seventeenth-century antiquary who first noticed them. Cremated human remains were later placed in many of them, which makes Stonehenge the oldest known cremation cemetery in Britain. Mike Parker Pearson&rsquo;s team holds that the holes first held bluestones; Timothy Darvill has argued for timber posts. What stood in them is debated.</p>",
    flags: [CONTESTED], links: [L.ch42], sources: REF.cleal + "; " + REF.mpp + "; " + REF.waun + "." },
  { id: "station", section: "s2", pos: [ring.stationPos[0].x + 1.5, 1.4, ring.stationPos[0].z], cat: "II · Within the henge", title: "The Station Stones",
    html: "<p>Four Station Stones probably once stood near the line of the Aubrey Holes, at the corners of a rough rectangle; only two of them survive, both small. Why they were set there is not known, and readings of them as markers for the sun or moon are speculative.</p>",
    flags: [APPROX], sources: REF.ehStones + "." },
  { id: "sarsens", section: "s2", pos: [-D.sarsenR - 3, 2.0, 0], cat: "II · Within the henge", title: "The sarsen circle",
    html: "<p>Thirty upright sarsens, each about 4 metres tall and weighing in the order of 25 tonnes, were capped by a continuous ring of lintels, a circle of stone some 30 metres across held 4 metres off the ground. The lintels are curved to follow the circle, locked to the uprights by mortise and tenon joints and to each other by tongue and groove: carpentry joints, cut in stone.</p><p>Many stones have fallen or are missing, and most of the lintels are gone. Whether the circle was ever finished on its south-west side was long debated. In the dry summer of 2013, patches of parched grass appeared where some of the missing uprights should have stood, which suggests that it was; the archaeologists who recorded them urged caution.</p>",
    flags: [RUIN, APPROX], links: [L.ch42], sources: REF.ehStones + "; " + REF.ehKit + "; " + REF.cleal + "; " + REF.banton + "." },
  { id: "sarsen-source", section: "s2", pos: [D.sarsenR + 3, 2.0, -6], cat: "II · Within the henge", title: "Where the sarsens came from",
    html: "<p>In 2020 a geochemical study matched 50 of the 52 surviving sarsens to <strong>West Woods</strong>, on the edge of the Marlborough Downs, about 25 kilometres to the north. The key evidence was a core drilled out of Stone 58 during repairs in the 1950s, kept for decades by a man who had worked for the firm doing the repairs, and returned in 2019. How the stones were moved, and how they were raised, is not recorded; sledges, rollers and timber levers are the usual reconstructions.</p>",
    links: [L.ch42], sources: REF.nash + "." },
  // ---- III: inside the stones
  { id: "trilithons", section: "s3", pos: [-4.0, 2.0, -3.0], cat: "III · Inside the stones", title: "The trilithon horseshoe",
    html: "<p>Inside the circle stand five <strong>trilithons</strong>, each two uprights and a lintel, set in a horseshoe that opens towards the midsummer sunrise. They rise in height towards the far end, where the <strong>Great Trilithon</strong> stood about 7.3 metres high with its lintel; its surviving upright, Stone 56, is the tallest stone at Stonehenge. Three are complete; two are partly fallen. One fell in 1797 and was put back up in 1958, one of several twentieth-century repairs, so the monument you see is partly a restoration.</p>",
    flags: [RUIN, APPROX], links: [L.ch42], sources: REF.ehStones + "; " + REF.ehCons + "." },
  { id: "bluestones", section: "s3", pos: [4.6, 1.4, -5.0], cat: "III · Inside the stones", title: "The bluestones",
    html: "<p>The smaller stones are the <strong>bluestones</strong>, about eighty in all once, of dolerite, rhyolite and other rocks from the Preseli Hills in west Wales, more than 200 kilometres away. Geologists have traced several to particular outcrops. They stand in a circle inside the sarsens and a horseshoe inside the trilithons, of which only a few are still upright.</p><p>Most archaeologists hold that people moved them. A minority argue that glaciers carried them most of the way. Mike Parker Pearson&rsquo;s team has proposed that some came from an older circle in Wales, at Waun Mawn; that too is disputed.</p>",
    flags: [CONTESTED, APPROX], links: [L.ch42], sources: REF.mpp + "; " + REF.ehStones + "; " + REF.waun + "." },
  { id: "altar", section: "s3", pos: [-1.8, 1.0, D.altar.z + 1.0], cat: "III · Inside the stones", title: "The Altar Stone",
    html: "<p>Under the broken stones of the fallen Great Trilithon lies the <strong>Altar Stone</strong>, about five metres long and some six tonnes, a greenish sandstone unlike any other stone here. Its name is a modern guess at its use. In 2024 a study of the mineral grains in fragments of it traced it not to Wales, as had long been thought, but to the Orcadian Basin of north-east Scotland, at least 750 kilometres away. How it was brought, by sea or overland, is not known.</p>",
    links: [L.ch42], sources: REF.clarke + "." },
  { id: "axis", section: "s3", pos: [1.6, 1.8, -7.6], cat: "III · Inside the stones", title: "The solstice axis",
    html: "<p>Stand at the centre and look back the way you came: the opening of the horseshoe, the gap between the outer stones, the Avenue and the Heel Stone all line up on the midsummer sunrise, and, the other way, on the midwinter sunset. That the builders meant this is not in doubt. What it meant to them is. Mike Parker Pearson reads Stonehenge as a monument to the ancestors, the stone counterpart of the timber circles at Durrington Walls, where pig bones show great midwinter feasts. Timothy Darvill and Geoffrey Wainwright have argued that people came here to be healed, and that the bluestones were valued for it. The two readings are not the only ones, and they need not exclude each other.</p>",
    flags: [CONTESTED], links: [L.ch42, L.ch41], sources: REF.ehSky + "; " + REF.mpp + "; " + REF.ehFeast + "; " + REF.dw + "; " + REF.ch42 + "." }
];

const about = { id: "about", cat: "About this model", title: "How close is this to the real thing?",
  html: "<p><strong>From published figures:</strong> the henge about 110 m across with its bank inside the ditch; the 56 Aubrey Holes on a circle about 87 m across; thirty sarsen uprights about 4 m tall on a ring about 30 m across; the Great Trilithon about 7.3 m with its lintel; the Heel Stone about 4.5–4.7 m; the Avenue banks about 22 m apart; the Altar Stone about 5 by 1 m.</p>" +
    "<p><strong>Approximate:</strong> the exact place of each stone, the heights of the smaller trilithons, the number and size of the bluestones, the shapes of the fallen stones, and the depth of the ditch. Which stones stand, lean, lie or are missing follows the present ruin only in outline.</p>" +
    "<p><strong>Not shown:</strong> the barrows and the rest of the landscape (only a low horizon), the modern road, fences and visitor path, the Bronze Age carvings of daggers and axes on some sarsens, and the people. The model is turned so the solstice axis runs straight ahead of you; the signs say which way is north on the ground.</p>",
  links: [L.ch42], sources: REF.cleal + "; " + REF.ehStones + "; " + REF.ehDesc + "." };

// the outdoor sky of Salisbury Plain (the engine's default is a desert one)
const sky = { bg: "#bcc9d3", fog: "#c9d2d6", hemi: "#e4ebf2", ground: "#6f7f4c", sunPos: [60, 55, -70], sun: 1.45 };

export default { title: "Stonehenge", version: 1, stones: ["sarsen", "turf", "core", "wood"], sky, sections, regions, route, info, about, D, V0 };
