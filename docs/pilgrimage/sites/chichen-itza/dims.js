/* ==========================================================================
   Chichén Itzá — sizes and placings

   The northern part of the city as a visitor finds it today: the Great Platform
   with the pyramid of Kukulkan (El Castillo), the Tzompantli and the Temple of
   the Warriors; the Great Ball Court; the causeway (sacbe) north to the Sacred
   Cenote; and, to the south, El Caracol.

   Each value names its source (full list: sources/pilgrimage-chichen-itza.md).
   SURVEY means a published figure; APPROX means our estimate. No measured plan
   of the site could be opened from the build environment, so where each
   building stands and every size not marked SURVEY is APPROX.

   Frame: metres; x east, y up, z south, with the plaza at y = 0. The model is
   squared to the pyramid: its sides run along x and z. In reality the pyramid
   and the buildings round it are turned about twenty degrees from true north
   (SURVEY: the azimuth of its north face, 111.72°, Šprajc and Sánchez Nava 2013, via Wikipedia).
   ========================================================================== */
export const D = {};

// ---- the pyramid: square base 55.3 m, 24 m high to the top platform, a temple of about 6 m on it (SURVEY:
// "El Castillo, Chichen Itza", Wikipedia); nine stepped bodies (SURVEY: Šprajc and Sánchez Nava); four
// stairways of about 91 steps (SURVEY). The top platform, the stairs' width and the temple's plan APPROX.
D.cas = { x: 0, z: 0, base: 55.3, h: 24, terraces: 9, top: 19.6, stairW: 8.6, balW: 1.1, steps: 91, temple: { s: 13.0, h: 6.0 } };
// ---- the Great Ball Court: overall 166 × 68 m (SURVEY: Guinness World Records); the playing alley 316 × 98 ft,
// about 96 × 30 m (SURVEY: Met essay). The height of the walls, the benches and the end temples APPROX.
D.bc = { x: -160, z: -40, L: 166, W: 68, alleyL: 96, alleyW: 30, wallH: 8.5, benchD: 1.6, benchH: 1.4, ringY: 7.0 };
// ---- the Tzompantli (APPROX), the Temple of the Warriors with its colonnade (APPROX)
D.tz = { x0: -120, x1: -60, z0: -41, z1: -29, h: 1.6 };
D.war = { x0: 95, x1: 135, z0: -30, z1: 10, h: 12.0, cols: { x0: 92, x1: 140, z0: 14, z1: 34 } };
// ---- the sacbe north to the Sacred Cenote: about 300 m (SURVEY: Adams 1991, via Wikipedia); its width APPROX.
// The cenote: about 60 m across, about 27 m down to the water (SURVEY: Cano 2002, via Wikipedia)
D.sacbe = { x0: -5, x1: 5, z0: -358, z1: -128 };
D.cenote = { x: 0, z: -390, r: 30, drop: 27 };
// ---- El Caracol, to the south: two platforms and a round tower (every size APPROX)
D.car = { x: -40, z: 525, low: { w: 67, d: 52, h: 6.0 }, up: { w: 24, d: 24, h: 5.0 }, tower: { r: 5.6, h: 12.5 } };
// ---- the walkable ground: the plaza, the path south, the ground round El Caracol, the cenote's rim (APPROX)
D.plaza = { x0: -240, x1: 160, z0: -130, z1: 140 };
D.path = { x0: -50, x1: -30, z0: 138, z1: 472 };
D.carG = { x0: -100, x1: 20, z0: 470, z1: 590 };
D.rim = { x0: -45, x1: 45, z0: -440, z1: -356 };
