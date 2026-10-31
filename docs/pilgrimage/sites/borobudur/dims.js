/* ==========================================================================
   Borobudur — sizes and placings

   Each value names its source (full list: sources/pilgrimage-borobudur.md).
   SURVEY means a published figure; APPROX means our estimate. No measured
   plan or section could be opened from the build environment, so the heights
   of the levels, the widths of the galleries, the circular terraces' radii
   and the stupas' sizes are APPROX, chosen so that the whole fits the
   published base and height. The real plan is a square with many projecting
   corners (redents); the model draws plain squares.

   Frame: metres; x east, y up, z south. The monument's centre is x = 0,
   z = 0; y = 0 is the ground round its foot. The main stairs are on the
   axes; the pilgrim's way begins at the east stairs.
   ========================================================================== */
export const D = {};

// ---- the base: 123 m square (Gunarto 2007); the foot (which encases the hidden reliefs) and its open walkway
D.F = { hw: 61.5, y: 4 };                       // half-width SURVEY; height APPROX
D.B0 = 57.5;                                    // the first balustrade's line: the walkway on the foot is 4 m wide. APPROX
// ---- the five square galleries: floor heights and main-wall lines, each gallery 3.5 m deep with its walls
D.gal = { n: 5, y0: 4, rise: 3.6, depth: 3.5, balH: 1.6, wallT: 0.9 };   // APPROX
D.galY = (k) => D.gal.y0 + D.gal.rise * k;                               // floor of gallery k (0..4); k = 5 is the top plateau
D.mainW = (k) => D.B0 - D.gal.depth * (k + 1);                           // the main wall of gallery k (its back wall)
D.balW = (k) => (k === 0 ? D.B0 : D.mainW(k - 1));                       // its balustrade (outer, low) wall
D.top = { y: D.galY(5), hw: D.mainW(4) };       // the square plateau the circular terraces stand on (y 22). APPROX
// ---- the three circular terraces and their 72 stupas (32, 24 and 16), and the central stupa
D.circ = [                                      // radius and floor of each terrace; the ring of stupas on it. APPROX
  { r: 33, y: 23.5, ring: 30, n: 32 },
  { r: 26, y: 25, ring: 23, n: 24 },
  { r: 19.5, y: 26.5, ring: 16.5, n: 16 }
];
D.stupa = { r: 1.75, h: 3.2, fin: 1.1 };        // the perforated stupas. APPROX
D.cs = { r: 8, h: 8.5 };                        // the central stupa: its top 35 m above the ground (Britannica). Height SURVEY, width APPROX
D.stair = { hw: 1.6 };                          // the axial stairs' half-width. APPROX
// ---- the alignment with Pawon and Mendut (Magli 2017): the line's azimuth about 263° (from Borobudur towards the
//      west) and 83° (towards the east), about 7° off east-west; the horizon about 1°48' high
D.line = { azW: 263, azE: 83, horizon: 1.8 };   // SURVEY (Magli's measurement from satellite imagery)
