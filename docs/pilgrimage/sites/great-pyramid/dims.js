/* ==========================================================================
   The Great Pyramid of Khufu — dimensions, from published surveys

   Every number here is traced to its source in the comment beside it. Most
   come from W. M. Flinders Petrie, The Pyramids and Temples of Gizeh (1883),
   given in British inches and converted at 1 in = 0.0254 m. Where a figure is
   not a survey value but our own estimate (to place one part relative to
   another, or where the record is silent), it says APPROX.

   Frame: metres; x east, y up (0 = the pyramid's base), z south. The whole
   passage system lies in one north–south plane about 7.29 m east of the
   pyramid's axis (Petrie: 287 ± 0.8 in), so x = 0 here is that plane, not the
   pyramid's centre. z = 0 is the middle of the Queen's Chamber, which lies on
   the pyramid's east–west axis.

   Relative positions (where each passage begins and ends) are rebuilt from
   Petrie's lengths and angles, so they may be off by a metre or two in
   absolute terms; room and passage sizes are as surveyed.
   ========================================================================== */
const IN = 0.0254, DEG = Math.PI / 180;
export const D = {};

// ---- passages: section and slope
D.pw = 41.6 * IN;                              // passage width, 41.6 in (Petrie)
D.ph = 47.3 * IN;                              // passage height measured square to the floor, 47.3 in (Petrie)
D.descAng = (26 + 31 / 60 + 23 / 3600) * DEG;  // descending passage, 26° 31′ 23″ ± 5″ (Petrie)
D.ascAng = (26 + 2 / 60 + 30 / 3600) * DEG;    // ascending passage and Grand Gallery, about 26° 2′ 30″ (Petrie gives 26° 2′–26° 12′ for parts of it)
D.descTan = Math.tan(D.descAng); D.ascTan = Math.tan(D.ascAng);
D.descHv = D.ph / Math.cos(D.descAng);         // vertical clear height in the descending passage
D.ascHv = D.ph / Math.cos(D.ascAng);

// ---- Queen's Chamber (Petrie)
D.qcNS = 205.85 * IN;                          // 205.85 in north–south
D.qcEW = 226.47 * IN;                          // 226.47 in east–west
D.qcWall = 184.47 * IN;                        // N and S walls 184.47 in high
D.qcRidge = 245.1 * IN;                        // ridge of the gabled roof 245.1 in above the floor
D.qcFloor = 834.4 * IN;                        // floor 834.4 ± 0.3 in above the base
D.qcZ0 = -D.qcNS / 2; D.qcZ1 = D.qcNS / 2;
D.qcX1 = D.pw / 2 + 0.30;                      // APPROX: the passage enters the north wall towards its east end
D.qcX0 = D.qcX1 - D.qcEW;
// niche in the east wall (Petrie): 41 in deep, 62 in wide at the base, four overlaps of 1/4 cubit each side,
// 20 in wide at 156 in, roofed at 184 in
D.niche = { depth: 41 * IN, base: 62 * IN, top: 20 * IN, topAt: 156 * IN, roof: 184 * IN, steps: 4, zOff: 25 * IN /* APPROX direction: south of centre */ };

// ---- horizontal passage to the Queen's Chamber
D.hpStep = 21 * IN;                            // the step down near its south end, about 21 in
D.hpLen = 38.5;                                // APPROX total length: about 33 m (109 ft) to the step, then about 5.5 m
D.hpLow = 5.5;                                 // APPROX length after the step
D.hpY = D.qcFloor + D.hpStep;                  // floor of the upper part = floor at the foot of the Grand Gallery
D.hpZ0 = D.qcZ0 - D.hpLen;                     // its north end, at the foot of the Grand Gallery
D.hpStepZ = D.qcZ0 - D.hpLow;

// ---- Grand Gallery (Petrie)
D.ggLen = 1815.5 * IN;                         // floor length along the slope, 1815.5 in
D.ggH = 339 * IN;                              // height, 339 in
D.ggW = 82.0 * IN;                             // breadth over the ramps, 82.0 in
D.ggCh = 42.0 * IN;                            // width of the channel between the ramps, 42.0 in
D.rampW = (D.ggW - D.ggCh) / 2;                // each ramp about 20 in wide
D.rampH = 0.52;                                // APPROX ramp height above the channel floor
D.overlaps = 7;                                // seven overlapping courses (Petrie)
D.overlapStep = 3 * IN;                        // each course stands in about 3 in (so the roof is about as wide as the channel)
D.ggWall0 = D.ggH - 7 * 0.9;                   // APPROX: height of the vertical lower wall before the first overlap
D.ggRun = D.ggLen * Math.cos(D.ascAng); D.ggRise = D.ggLen * Math.sin(D.ascAng);
D.ggZ0 = D.hpZ0; D.ggY0 = D.hpY;               // the gallery's floor line starts at the foot, level with the passage
D.ggZ1 = D.ggZ0 + D.ggRun; D.ggY1 = D.ggY0 + D.ggRise;
D.ggFloor = (z) => D.ggY0 + (z - D.ggZ0) * D.ascTan;
D.slab = 0.35;                                 // APPROX thickness of the floor over the horizontal passage

// ---- ascending passage (Petrie: 1546.8 in long)
D.ascLen = 1546.8 * IN;
D.ascRun = D.ascLen * Math.cos(D.ascAng); D.ascRise = D.ascLen * Math.sin(D.ascAng);
D.ascZ1 = D.ggZ0; D.ascY1 = D.ggY0;
D.ascZ0 = D.ascZ1 - D.ascRun; D.ascY0 = D.ascY1 - D.ascRise;
D.ascFloor = (z) => D.ascY0 + (z - D.ascZ0) * D.ascTan;
D.plugLen = 4.6;                               // APPROX: three granite plugs, together about 4.6 m along the slope
D.plugRun = D.plugLen * Math.cos(D.ascAng);

// ---- descending passage (Petrie: entrance floor 668.2 in above the base)
D.entY = 668.2 * IN;
// its roof meets the floor of the ascending passage at the junction
D.junY = D.ascY0 - D.descHv;                    // descending floor under the junction
D.entZ = D.ascZ0 - (D.entY - D.junY) / D.descTan;
D.descFloor = (z) => D.entY - (z - D.entZ) * D.descTan;
D.descEndZ = D.ascZ0 + 9;                       // where we stop modelling it (it runs on far down into the rock)

// ---- the robbers' tunnel round the plugs (APPROX layout; the real tunnel is irregular)
D.rtY0 = 5.0;                                    // where it leaves the descending passage
D.rtZ0 = D.entZ + (D.entY - D.rtY0) / D.descTan;
D.rtZ1 = D.ascZ0 + D.plugRun + 1.2;              // where it enters the ascending passage, just above the plugs
D.rtY1 = D.ascFloor(D.rtZ1);
D.rtX = -1.95;                                   // its centre line, west of the passages

// ---- the upper end: Great Step, antechamber, King's Chamber
D.kcFloor = 1692 * IN;                           // King's Chamber floor about 1692 in above the base (Petrie)
D.stepZ0 = D.ggZ1; D.stepZ1 = D.stepZ0 + 1.6;    // APPROX depth of the Great Step's top
D.p1Z0 = D.stepZ1; D.p1Z1 = D.p1Z0 + 1.3;         // APPROX low passage to the antechamber
D.lowH = 1.11;                                   // APPROX height of the low passages at the top
D.acLen = 116.3 * IN;                             // antechamber length 116.3 in (Petrie)
D.acW = 65.2 * IN;                                // width 65.2 in (Petrie)
D.acH = 149.6 * IN;                               // mean height about 149.6 in (Petrie)
D.acZ0 = D.p1Z1; D.acZ1 = D.acZ0 + D.acLen;
D.p2Z0 = D.acZ1; D.p2Z1 = D.p2Z0 + 2.55;          // APPROX passage into the King's Chamber
D.kcNS = 206.13 * IN;                             // King's Chamber 412.25 × 206.13 in, 230.05 in high (Petrie)
D.kcEW = 412.25 * IN;
D.kcH = 230.05 * IN;
D.kcZ0 = D.p2Z1; D.kcZ1 = D.kcZ0 + D.kcNS;
D.kcX1 = D.pw / 2;                                // the doorway is at the east end of the north wall
D.kcX0 = D.kcX1 - D.kcEW;
// the coffer (Petrie, mean of some 681 measures): outside 89.62 × 38.50 × 41.31 in, inside 78.06 × 26.81 × 34.42 in
D.coffer = { L: 89.62 * IN, W: 38.50 * IN, H: 41.31 * IN, iL: 78.06 * IN, iW: 26.81 * IN, iH: 34.42 * IN };
D.cofferX = D.kcX0 + 0.62 + D.coffer.W / 2;      // APPROX: near the west wall, lying north–south
D.cofferZ = (D.kcZ0 + D.kcZ1) / 2;

// ---- the outside
D.faceAng = (51 + 50 / 60 + 40 / 3600) * DEG;    // slope of the faces, about 51° 50′ 40″ (Petrie)
D.mouthTop = D.entY + D.descHv;                  // top of the passage mouth
