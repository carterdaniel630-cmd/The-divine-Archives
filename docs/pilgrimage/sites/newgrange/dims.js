/* ==========================================================================
   Newgrange — sizes and placings

   Each value names its source (full list: sources/pilgrimage-newgrange.md).
   SURVEY means the figure is published (World Heritage Ireland / the Office
   of Public Works, the National Museum of Ireland, or the excavation figures
   as quoted); APPROX means our estimate, to be checked against the published
   plans at review. O'Kelly's excavation report (1982) and its plans could not
   be opened from the build environment, so the shape of the chamber, the
   course of the passage and the place of every stone are APPROX.

   Frame: metres; y up. The model is turned so that the passage runs along -z
   from the entrance: "model south" (+z) is the direction of midwinter
   sunrise, which on the ground is south-east. So x and z are NOT compass east
   and south here, and the signs on site say so.
   ========================================================================== */
export const D = {};

// ---- the mound: about 80 m across (sources give 76–85 m), about 12 m high, over about an acre
D.R = 40;               // kerb radius. SURVEY (World Heritage Ireland: "approximately 80m in diameter")
D.H = 12;               // SURVEY (12 m as quoted; heights of 11–13.5 m are also given)
D.wallH = 3.0;          // the reconstructed revetment wall above the kerb. APPROX
D.facadeArc = 42;       // degrees either side of the entrance faced with white quartz (the reconstruction). APPROX
D.face = D.R - 1.0;     // the revetment wall stands a little behind the kerb. APPROX

// ---- the kerb: 97 long stones laid end to end round the foot of the mound, none under a tonne
D.kerbN = 97;           // SURVEY (World Heritage Ireland; O'Kelly's count)
D.kerbH = 1.2; D.kerbD = 0.8;   // APPROX (the Entrance Stone is about 1.2 m high)

// ---- the Entrance Stone (K1): about 3 m long, 1.2 m high, about five tonnes, lying across the entrance
D.k1 = { z: D.R + 0.3, l: 3.2, h: 1.2, d: 0.9 };   // length and height SURVEY (as quoted); its exact place APPROX

// ---- the passage: just under 19 m from the entrance to the chamber, lined with upright slabs (43: 22 W, 21 E),
//      its floor rising about 2 m to the chamber
D.pass = { z1: D.face, z0: D.face - 18.8, w: 1.0, h: 2.05, rise: 2.0, westN: 22, eastN: 21 };
// length and rise SURVEY (World Heritage Ireland; the Irish Times, 2013); width APPROX; height APPROX and kept a little
// higher than the real passage so the visitor can walk it upright (the real one is "low and narrow": Heritage Ireland)
D.roofBox = { w: 0.9, h: 0.3, y: 2.35 };   // the opening above the doorway (the Irish Times puts it about 2.5 m from the entrance). Size and height APPROX

// ---- the chamber: cross-shaped, three recesses, a corbelled roof whose capstone is about 6 m above the floor
D.ch = { z1: D.pass.z0, y: D.pass.rise, x: 1.8, z0: D.pass.z0 - 5.6, top: 6.0 };   // roof height SURVEY (World Heritage Ireland); plan APPROX
D.rec = {
  east: { x0: 1.8, x1: 3.6, z0: D.pass.z0 - 4.0, z1: D.pass.z0 - 1.6 },
  west: { x0: -3.6, x1: -1.8, z0: D.pass.z0 - 4.0, z1: D.pass.z0 - 1.6 },
  back: { x0: -1.1, x1: 1.1, z0: D.pass.z0 - 7.4, z1: D.pass.z0 - 5.6 }
};   // APPROX
D.recH = 2.3;           // the recesses' lintel height. APPROX

// ---- the Great Circle: twelve stones survive of perhaps 38, ringing the mound at a distance
D.gcR = 52;             // APPROX
D.gc = [               // bearing (degrees, clockwise from the entrance axis, +z) and height of each surviving stone. APPROX
  { b: -34, h: 2.4 }, { b: -22, h: 2.2 }, { b: -12, h: 2.0 }, { b: 8, h: 2.5 }, { b: 18, h: 2.1 }, { b: 30, h: 1.6 },
  { b: 41, h: 1.9 }, { b: -48, h: 1.4 }, { b: 64, h: 1.2 }, { b: -70, h: 1.5 }, { b: 128, h: 1.3 }, { b: -150, h: 1.1 }
];

// ---- the lawn in front of the entrance, and the far ground
D.lawn = { x0: -60, x1: 60, z0: D.R + 0.9, z1: 96 };   // APPROX
D.gapX = [1.85, 3.75];  // the way past the Entrance Stone: the model's own gap in the kerb, standing in for the modern steps
