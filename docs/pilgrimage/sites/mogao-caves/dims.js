/* ==========================================================================
   The Mogao Caves — sizes and placings

   The cliff of the Mogao Caves near Dunhuang as a visitor sees it today, with
   three caves to enter: Cave 16 and the Library Cave (Cave 17) that opens off
   its corridor; the great seated Buddha of Cave 96 inside the nine-storey
   building; and Cave 254 of the Northern Wei on the middle tier.

   Each value names its source (full list: sources/pilgrimage-mogao-caves.md).
   SURVEY means a published figure (UNESCO, the Dunhuang Academy's e-Dunhuang
   pages, or a reference quoting them); APPROX means our estimate. No measured
   plan of any cave could be opened from the build environment, so every room
   size and every placing along the cliff is APPROX.

   Frame: metres; x east, y up, z south. The cliff faces east: its foot is the
   line x = 0 and the caves are cut into it westwards (x < 0). The ground in
   front of the cliff is y = 0.
   ========================================================================== */
export const D = {};

// ---- the cliff: about 1.6–2 km long (SURVEY: UNESCO; other sources say almost 2 km); its height here APPROX
D.cliff = { z0: -600, z1: 600, h: 40 };
D.tiers = [1.0, 9.0, 17.0, 25.0];   // floor heights of the tiers of caves. APPROX

// ---- the nine-storey building in front of Cave 96. Storeys: Tang four, one added 874–885, two in 1898, nine
// after two twentieth-century restorations (SURVEY, as reported); its size APPROX
D.pav = { x0: 0, x1: 12.0, z0: -12.6, z1: 12.6, storeys: 9, h: 44 };
// ---- Cave 96: the seated Maitreya, 35.5 m (SURVEY: China Daily 2025; other sources give 34–35.5 m), begun 695
D.c96 = { x0: -25, x1: 0, z0: -8.5, z1: 8.5, h: 38, buddhaH: 35.5, statueX: -14 };

// ---- Cave 16 and its corridor; Cave 17 opens off the corridor's north wall (SURVEY: e-Dunhuang).
// Every size APPROX.
D.c16 = { z: 50, corrX0: -8, corrW: 2.6, corrH: 4.2, x0: -22, x1: -8, z0: 43, z1: 57, h: 8.5, altar: { x0: -18, x1: -12, z0: 46.5, z1: 53.5, h: 0.9 } };
D.c17 = { x0: -4.6, x1: -1.6, z0: 45.4, z1: 48.4, h: 3.0, door: { x0: -3.6, x1: -2.6, h: 1.9 }, stele: { h: 1.5, w: 0.7 } };   // a small square room (size APPROX); the stele about 1.5 × 0.7 m (SURVEY: e-Dunhuang)

// ---- the modern stair and walkway up to the middle tier, and Cave 254 (Northern Wei; the earliest central-
// pillar cave at Mogao: SURVEY, e-Dunhuang). Sizes APPROX.
D.stair = { x0: 1.0, x1: 3.4, z0: 72, z1: 92, y: 0, y1: 9.0 };
D.walk2 = { x0: 0.4, x1: 3.4, z0: 90, z1: 124, y: 9.0 };
D.c254 = { x0: -12.5, x1: -1.0, z0: 107.5, z1: 116.5, y: 9.0, h: 5.4, pillar: { x: -8.6, z: 112, s: 3.0 }, gableTo: -5.0 };

// ---- the ground in front, the poplars along the river, and the dunes above the cliff. APPROX, a backdrop
D.ground = { x0: 0.4, x1: 44, z0: -90, z1: 140 };
