/* ==========================================================================
   The Archive Arcade — the site: one round hall, its walkable floor, the
   walking route, the cabinets' cards and the high-score board.

   A hidden room (plans/hidden-arcade-and-easter-eggs.md §2): reached only
   through the golden portal in the museum's Bronze Age hallway, never linked
   from a menu, not in the sitemap and not in the Pilgrimage list. It runs on
   the Pilgrimage walking engine like any site; its page is the hand-written
   docs/pilgrimage/arcade.html.

   The room is the archive's own furniture, not a reconstruction of anything:
   a small rotunda built of parts the archive already has (the museum's
   period floors, its symbol walls and flame fittings, a planetarium sky).
   Geometry lives in hall.js.

   Conventions as in kit.js: metres; x east, y up, z south. The hall is centred
   on the origin; a cabinet's bearing (deg) is measured clockwise from north.
   ========================================================================== */
import { region } from "../../kit.js?v=1";

export const R_HALL = 8;          // the wall's radius (the hall is 16 m across)
export const R_CAB = 6.2;         // the cabinets' centres
export const R_WALK = 5.2;        // how far out from the centre the visitor may walk
export const R_POOL = 1.95;       // the pool's outer kerb
export const EXIT_HREF = "../museum.html#@02-bronze-age";

// the twelve games, in chapter order, with the setting at each cabinet's base. The list (id, chapter, title)
// is the one on the Symbols page (docs/symbols.html); scores are the games' own (docs/assets/games/archive-games.js)
export const GAMES = [
  { id: "chess", ch: "ch02", chName: "Egypt", title: "Archive Chess", sub: "A board of gods: Egyptian, Greek, or Norse.", deg: 145, setting: "limestone", prop: "saucer", note: "Limestone paving and a clay saucer lamp, after the Egypt room." },
  { id: "ziggurat", ch: "ch03", chName: "Mesopotamia", title: "Ziggurat Builder", sub: "Raise the temple-mountain, course by course.", deg: 123, setting: "mudbrick", prop: "bricks", note: "Mud brick, the building stuff of Mesopotamia." },
  { id: "minesweeper", ch: "ch04", chName: "Indus Valley", title: "The Excavation", sub: "Clear the buried dig without striking a hazard.", deg: 101, setting: "brick", note: "Fired brick, as in the Indus cities." },
  { id: "pong", ch: "ch06", chName: "Zoroaster", title: "Antithesis", sub: "Two cosmic principles volley the sacred orb.", deg: 79, setting: "ashlar", prop: "glow", note: "Dressed stone and a warm glow on the floor: a fire's light, without the altar." },
  { id: "fighter", ch: "ch08", chName: "Early Greece", title: "Divine Casualties", sub: "A duel of the Olympians, drawn from myth.", deg: 57, setting: "ashlar", prop: "brazier", note: "Dressed ashlar and a bronze tripod brazier." },
  { id: "risk", ch: "ch13", chName: "Rome", title: "Dominion of the Ancients", sub: "A conquest campaign of the ancient world.", deg: 35, setting: "tessellated", note: "A Roman tessellated pavement." },
  { id: "reliquary", ch: "ch22", chName: "Patristic Christianity", title: "The Reliquary", sub: "A trivia game drawn from the archive's own chapters.", deg: 325, setting: "marble", prop: "terracotta", note: "Marble and a terracotta oil lamp, candlelight of late antiquity." },
  { id: "pacman", ch: "ch29", chName: "The Maya", title: "The Labyrinth", sub: "Thread the maze of the dead; outrun the shades.", deg: 303, setting: "limestone", prop: "jungle", note: "Pale limestone with a screen of green behind it." },
  { id: "ouroboros", ch: "ch37", chName: "Theosophy & the Occult Revival", title: "Ouroboros", sub: "The serpent that devours its own tail: a game of Snake.", deg: 281, setting: "oak", prop: "brass", note: "Oak boards and a plain brass ring on a post." },
  { id: "seeker", ch: "ch40", chName: "African Diaspora Religions", title: "The Seeker's Path", sub: "Follow the clues into the chapters.", deg: 259, setting: "plain", note: "A plain floor: the ritual drawings of this tradition are not arcade decoration." },
  { id: "treasure", ch: "ch43", chName: "The Aztec", title: "The Tomb Robber", sub: "Four ancient sites; carry out the relics.", deg: 237, setting: "basalt", note: "A low plinth of dark basalt." },
  { id: "pinball", ch: "ch46", chName: "Creation & the First Order", title: "The Firmament", sub: "Launch the spark through the ordered heavens.", deg: 215, setting: "night", note: "Night-blue tiles under the dome's stars." }
];
const RAD = Math.PI / 180;
export const cabPos = (g, r) => { const a = g.deg * RAD, rr = r == null ? R_CAB : r; return { x: Math.sin(a) * rr, z: -Math.cos(a) * rr }; };

// ---------------------------------------------------------------- best scores, read from this browser only (no network)
// The games keep a top-ten list per game under "da.games.score.<id>"; the Seeker keeps how many clues are reached.
export function bestOf(id) {
  try {
    if (id === "seeker") { const n = parseInt(window.localStorage.getItem("da.games.seeker") || "0", 10) || 0; return n > 0 ? n + (n === 1 ? " clue" : " clues") : null; }
    const a = JSON.parse(window.localStorage.getItem("da.games.score." + id) || "[]");
    return Array.isArray(a) && a.length && a[0] && a[0].score != null ? String(a[0].score) : null;
  } catch (e) { return null; }
}

// ---------------------------------------------------------------- sections: the whole hall is one
const sections = [
  { id: "a", name: "The Archive Arcade", short: "the arcade floor", module: "hall.js", box: [-9, -1, -9, 9, 9, 9], start: { x: 0, z: 4.6, yaw: 0, y: 0 },
    blurb: "A round hall of the archive's own furniture: twelve game cabinets, a board of your best scores, and the golden portal back to the museum." }
];

// ---------------------------------------------------------------- where the visitor may walk
// the engine's regions are rectangles; the hall's floor is a ring between the pool and the cabinets
const hall = region({ id: "hall", section: "a", x0: -R_WALK, x1: R_WALK, z0: -R_WALK, z1: R_WALK, y: 0, inset: 0 });
hall.contains = (x, z) => { const r = Math.hypot(x, z); return r <= R_WALK && r >= R_POOL + 0.3; };
const regions = [
  hall,
  // the way out between the two arcs of cabinets, and the portal at its end
  region({ id: "way", section: "a", x0: -0.85, x1: 0.85, z0: 4.3, z1: 7.75, y: 0, inset: 0 }),
  region({ id: "exit", section: "a", x0: -0.7, x1: 0.7, z0: 7.2, z1: 7.85, y: 0, inset: 0, portal: "museum", href: EXIT_HREF })
];
for (const r of regions) r.surface = "stone";

// ---------------------------------------------------------------- the walking route: every cabinet in turn, the board between the two arcs
const P = (x, z, stop, yaw) => ({ x, z, y: 0, stop: !!stop, yaw });
const ring = (deg, r) => { const a = deg * RAD; return [Math.sin(a) * r, -Math.cos(a) * r]; };
const route = [P(0, 4.6, true, 0)];
for (const g of GAMES) {
  route.push(P(...ring(g.deg, 4.95), true, -g.deg * RAD));
  if (g.id === "risk") route.push(P(...ring(0, 4.95), true, 0));                   // the board, between the two arcs
}
route.push(P(0, 5.4, true, Math.PI));

// ---------------------------------------------------------------- the cards
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const info = GAMES.map((g) => {
  const p = cabPos(g, R_CAB - 0.2);
  const card = { id: "cab-" + g.id, section: "a", pos: [p.x, 1.4, p.z], noMarker: true, cat: "The Archive Arcade · " + g.chName, title: g.title,
    links: [{ href: "../symbols.html#play=" + g.id, label: "Play" }, { href: "../chapters/" + g.ch + ".html", label: "Read the chapter" }],
    look: [-g.deg * RAD, -0.05] };
  // the best score is read when the card opens, so a game just played shows at once
  Object.defineProperty(card, "html", { enumerable: true, get() {
    const b = bestOf(g.id);
    return `<p>${esc(g.sub)}</p><p class="mu-meta">Your best on this device: <strong>${b ? esc(b) : "&mdash;"}</strong></p>` +
      `<p class="tiny">The cabinet stands on a piece of its chapter: ${esc(g.note)} The game opens on the Symbols page, where it lives with the rest of the archive's games.</p>`;
  } });
  return card;
});
info.push({ id: "board", section: "a", pos: [0, 2.3, -7.9], noMarker: true, cat: "The Archive Arcade", title: "Best scores", look: [0, 0.1],
  get html() {
    const rows = GAMES.map((g) => `<li>${esc(g.title)}: <strong>${esc(bestOf(g.id) || "—")}</strong></li>`).join("");
    return `<p>Your best score in each game, as kept by this browser. Nothing is sent anywhere, and there are no accounts: another phone or browser keeps its own.</p><ul>${rows}</ul><p class="tiny">Games that keep no score show a dash.</p>`;
  } });
info.push({ id: "exit", section: "a", pos: [0, 1.6, 7.7], noMarker: true, cat: "The Archive Arcade", title: "The way back", look: [Math.PI, 0],
  html: "<p>Walk into the golden portal to step back into the museum, in the Bronze Age hallway.</p>", links: [{ href: EXIT_HREF, label: "Back to the museum" }] });

const about = { id: "about", cat: "About this room", title: "What is this place?",
  html: "<p>A hidden room of the archive: its twelve games in one hall, each on a cabinet standing on a piece of its chapter. It is the archive&rsquo;s own furniture, not a model of any real building.</p>" +
    "<p><strong>Built from what the archive already has:</strong> the floor is the museum&rsquo;s period floors, one wedge per era; the falling signs are the museum&rsquo;s Bronze Age, Early Iron Age and Axial Age symbol walls; the flames are its saucer lamp, oil lamp, lampstand and brazier; the sky is a plain starfield.</p>" +
    "<p><strong>Kept out:</strong> Vault objects, sacred objects and every sign the symbol walls hold back on sensitivity grounds.</p>" +
    "<p>The games themselves, and their sources, live on the Symbols page; each card links to its chapter.</p>",
  links: [{ href: "../symbols.html", label: "All the games" }, { href: EXIT_HREF, label: "Back to the museum", ghost: true }] };

export default { title: "The Archive Arcade", version: 1, stones: ["gallery"], sections, regions, route, info, about };
