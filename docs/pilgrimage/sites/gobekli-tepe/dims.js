/* ==========================================================================
   Göbekli Tepe — sizes and placings

   Each value names its source (full list: sources/pilgrimage-gobekli-tepe.md).
   SURVEY means the figure is published by the excavators (the German
   Archaeological Institute's Göbekli Tepe project, as quoted in its blog and
   reports) or by UNESCO; APPROX means our estimate of the published plans'
   proportions, to be checked against the plans at review. No excavation plan
   could be opened from the build environment, so the layout of the four
   enclosures, their distances apart and the place of each pillar are APPROX.

   Frame: metres; x east, y up, z south. The floor of the main excavation
   area is y = 0; the surface of the mound round it is higher.
   ========================================================================== */
export const D = {};

// ---- the mound
D.surfY = 6.0;          // the hilltop round the excavated hollow, above its floor. APPROX (the tell is some 15 m high overall: SURVEY, UNESCO / DAI)

// ---- the four enclosures of the main excavation area, named A–D in the order they were found.
// Diameters: the round enclosures range from about 10 to 30 m (SURVEY, Current World Archaeology 53, 2012,
// from the excavators); which is which, and their positions, APPROX.
D.encD = { x: 0, z: 0, r: 10.0, wallT: 1.1, wallH: 2.9 };       // D, the best preserved; CWA 53 calls it the largest. Size APPROX (no measured diameter opened)
D.encC = { x: -14, z: 24, rings: [5.2, 10.0, 14.6], wallT: 0.9, wallH: 2.5 };   // C, three (perhaps four) concentric walls. SURVEY (count); radii APPROX (drawn wider than D: an estimate, see the About card)
D.encB = { x: -24, z: 4, r: 7.5, wallT: 0.9, wallH: 2.4 };     // B. APPROX
D.encA = { x: -20, z: -14, rx: 7.5, rz: 5.5, wallT: 0.8, wallH: 2.2 };   // A, the first found (1996). Shape and size APPROX

// ---- the T-pillars
D.central = { h: 5.5, L: 1.45, t: 0.38, headH: 0.95, headF: 0.55, headB: 0.15 };   // the central pair of D: about 5.5 m tall, 8–10 tonnes each. Height SURVEY (DAI, "How did they do it?", 2016); breadth and thickness APPROX
D.ring = { h: 4.0, L: 1.05, t: 0.32, headH: 0.7, headF: 0.4, headB: 0.1 };       // pillars in the enclosure walls: up to about 4 m. Height SURVEY (as above); the rest APPROX
D.dPillars = 11;        // pillars found so far in D's wall round the central pair. SURVEY (Current World Archaeology 53, 2012: "11 more in the surrounding walls")
D.dCentralGap = 3.2;    // the central pair of D stand side by side, this far apart. APPROX
D.cPillars = 9; D.bPillars = 6; D.aPillars = 5;   // pillars shown in C's inner wall, B and A. APPROX (not counts)

// ---- the quarry on the plateau, and the pillar left in it
D.quarry = { x: 420, z: 0 };   // under 100 m to about 500 m from the enclosures (SURVEY, DAI "How did they do it?", 2016); the model position means nothing
D.unfinished = { L: 7.0, t: 1.5, w: 1.6 };   // about 7 m long, 1.5 m thick, some 50 tonnes. SURVEY (DAI, "How did they do it?", 2016); width APPROX
