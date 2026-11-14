/* ==========================================================================
   Angkor Wat — sizes and placings

   Each value names its source (full list: sources/pilgrimage-angkor-wat.md).
   SURVEY means a published figure, chiefly from Maurice Glaize's guide to the
   Angkor monuments (1944, in its English translation at theangkorguide.com);
   APPROX means our estimate. No measured plan could be opened from the build
   environment, so the heights of the three levels, the libraries' and ponds'
   places and the towers' shapes are APPROX.

   Frame: metres; x east, y up, z south. The temple faces west: the visitor
   comes in from the west (-x) along the causeway. x = 0, z = 0 is the central
   tower; y = 0 is the ground inside the moat.
   ========================================================================== */
export const D = {};

// ---- the whole: about 1,500 × 1,300 m with the moats; the outer enclosure 1,025 × 800 m; moats 190 m wide,
//      their inner edge about 30 m outside the laterite enclosure wall
D.enc = { hx: 512.5, hz: 400, wallH: 4.5 };          // SURVEY (Glaize); wall height APPROX
D.moat = { w: 190, bank: 30, y: -2.2 };              // width and bank SURVEY; water level APPROX
D.moat.x0 = -D.enc.hx - D.moat.bank; D.moat.x1 = D.moat.x0 - D.moat.w;   // the western moat's inner and outer edges
D.mcw = { hw: 6, y: 0.3 };                            // the causeway across the moat: 200 m long, 12 m wide SURVEY; height APPROX
// ---- the western entrance: a colonnade 235 m long with a three-part gopura in the middle
D.gop = { hz: 117.5, d: 10, h: 6.5, towerH: 16 };    // length SURVEY; depth, heights APPROX
// ---- the processional way: about 350 m, 9.4 m wide, raised about 1.5 m, with naga balustrades
D.pw = { x0: -D.enc.hx + 12, x1: -125, hw: 4.7, y: 1.5 };   // width and height SURVEY; ends APPROX (about 375 m here)
D.lib = { x: -300, z: 46, hx: 12, hz: 8, h: 7 };    // the two "libraries", either side, towards the middle of the way (Glaize). Size, place APPROX
D.pond = { x0: -205, x1: -150, z0: 45, z1: 100 };   // the two square pools either side of the way. "square" SURVEY; size, place APPROX
// ---- the cruciform terrace before the first gallery
D.cru = { x0: -125, x1: -107.5, hz: 15 };            // the high cruciform "Grand Terrace" (Glaize); size APPROX, its two levels drawn as one
// ---- the first gallery (of the bas-reliefs): 187 × 215 m, passage about 2.45 m wide; the reliefs about 2 m high
D.g1 = { hx: 107.5, hz: 93.5, inset: 3.0, y: 1.5, h: 5.2, relH: 2.0 };   // plan and relief height SURVEY; inset (the
// passage plus the pillars) APPROX, kept a little wider than 2.45 m; floor and roof heights APPROX
// ---- the second gallery: 100 × 115 m, on a terrace; its floor height APPROX
D.g2 = { hx: 57.5, hz: 50, inset: 3.5, y: 8, h: 5 };
// ---- the third level: its base rising about 13 m to the platform of the five towers (the quincunx about 60 m wide)
D.l3 = { base: 37.5, top: 30, y: 21.5, galH: 4.5, inset: 3.2 };   // quincunx width SURVEY; heights APPROX
// ---- the towers: the central one 42 m above its platform, 62 m above the causeway; the four others lower
D.tw = { c: { r: 8, h: 42 }, k: { r: 5.2, h: 29, off: 23 } };    // central height SURVEY; the rest APPROX
// ---- the equinox: seen from the western way, the sun rises over the central tower about 21 March
D.eqView = { x: -480, y: D.pw.y + 1.62 };            // where the model's sun is aimed from. APPROX
