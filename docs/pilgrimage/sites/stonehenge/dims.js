/* ==========================================================================
   Stonehenge — sizes and placings

   Each value names its source (full list: sources/pilgrimage-stonehenge.md).
   SURVEY means the figure is published (English Heritage, or the 1995 report
   of the twentieth-century excavations as quoted in search results); APPROX
   means our estimate of a published plan's proportions, to be checked against
   the plan at review. The excavation report itself (Cleal, Walker and
   Montague 1995) could not be opened from the build environment.

   Frame: metres; y up. The model is turned so that the monument's solstice
   axis runs along -z: "model north" is the direction of midsummer sunrise,
   which on the ground is north-east (azimuth about 50°). So x and z are NOT
   compass east and south here, and the signs on site say so.
   ========================================================================== */
export const D = {};

// ---- the henge: the circular ditch with its bank inside it (an unusual order for a henge)
D.ditchR = 55;          // radius to the ditch centre: enclosure about 110 m across. SURVEY (Cleal et al. 1995, as quoted)
D.ditchW = 6;           // ditch width about 6 m (20 ft). SURVEY (PBS summary of the phasing)
D.ditchDepth = 1.6;     // 1.4–2.1 m deep when dug; shallower now. APPROX
D.bankR = 50;           // the low bank, inside the ditch. APPROX
D.bankW = 5; D.bankH = 0.5;   // now much eroded. APPROX
D.entranceW = 12;       // the north-east entrance causeway across the ditch. APPROX

// ---- the Aubrey Holes: 56 pits, about 1 m across, on a circle about 87 m in diameter
D.aubreyN = 56;         // SURVEY (several sources agree)
D.aubreyR = 43.5;       // 284 ft ≈ 86.6 m diameter. SURVEY (as quoted)
D.aubreyD = 1.0;        // SURVEY

// ---- the sarsen circle: 30 uprights capped by a continuous ring of lintels, about 30 m across, about 4 m up
D.sarsenN = 30;         // SURVEY (English Heritage)
D.sarsenR = 15.0;       // centreline radius, giving a lintel ring about 30 m across. SURVEY (English Heritage: "30 m in diameter")
D.upW = 2.1;            // upright width 2.1–2.2 m. SURVEY (English Heritage teachers' kit: 2.2 m; other sources 2.1 m)
D.upD = 1.15;           // upright depth 1.1–1.2 m. SURVEY (as above)
D.upH = 4.05;           // about 4 m above ground. SURVEY (English Heritage)
D.linH = 0.8;           // lintel height about 0.8 m. SURVEY (English Heritage teachers' kit)
D.linD = 1.05;          // lintel depth (the kit gives 1.3 m for the largest). APPROX

// ---- the five trilithons: a horseshoe opening north-east, rising to the Great Trilithon (about 7.3 m with its lintel)
// each: centre radius, bearing of its centre from the axis (degrees, clockwise), height of the uprights above ground
// (the lintel sits on top)
D.trilithons = [
  { n: "51–52", r: 8.4, b: 108, h: 5.2, standing: true },     // APPROX (heights rise towards the far end)
  { n: "53–54", r: 8.8, b: 142, h: 5.7, standing: true },     // APPROX
  { n: "55–56", r: 8.2, b: 180, h: 6.6, standing: false },    // the Great Trilithon: about 7.3 m with its lintel (secondary summaries); Stone 56 about 6.6 m above ground (English Heritage: 8.71 m long, 2.13 m buried). 56 stands, 55 lies broken
  { n: "57–58", r: 8.8, b: 218, h: 5.7, standing: true },     // fell 1797, re-erected 1958. SURVEY (English Heritage); height APPROX
  { n: "59–60", r: 8.4, b: 252, h: 5.2, standing: false }     // partly fallen. SURVEY (English Heritage: two partly fallen); height APPROX
];
D.triW = 2.2; D.triD = 1.3; D.triGap = 0.35; D.triLinH = 1.0;   // APPROX

// ---- bluestones: an outer circle (perhaps 60 stones once; many now stumps or missing) and an inner horseshoe of 19
D.bluR = 11.6;          // bluestone circle radius. APPROX
D.bluN = 60;            // APPROX: about 80 bluestones in all are usually counted (estimates vary); most of the circle is now stumps
D.bluH = 1.9; D.bluW = 0.7; D.bluD = 0.5;   // APPROX
D.bhN = 19;             // the bluestone horseshoe: 19 originally, six still upright. SURVEY (as quoted)
D.bhR = 5.6;            // APPROX

// ---- the Altar Stone: about 5 × 1 m, some 6 tonnes, lying under the fallen stones of the Great Trilithon
D.altar = { x: 0, z: 4.2, l: 4.9, w: 1.0, t: 0.5 };   // length and width SURVEY (Clarke et al. 2024, and press reports of it: "five-by-one-metre", "6 tonne"); thickness and position APPROX

// ---- outliers on the axis
D.heel = { x: 1.6, z: -77, h: 4.7, w: 2.4, d: 2.1, lean: 0.12 };   // the Heel Stone: about 4.5–4.7 m above ground, leaning towards the circle. Height as quoted (see the source log); distance APPROX
D.slaughter = { x: -1.2, z: -57, l: 6.4, w: 2.1, d: 0.8 };          // the fallen Slaughter Stone at the entrance. APPROX
D.station = [{ b: 117, standing: true }, { b: 297, standing: true }];   // Stations 91 and 93 survive (two of four), on the Aubrey circle. APPROX bearings

// ---- the Avenue: two banks with ditches outside them, about 22 m apart, running out along the axis
D.avW = 22;             // SURVEY (Allen et al. / Parker Pearson team: about 22 m apart)
D.avLen = 140;          // the stretch modelled. The whole Avenue runs some 2.5–3 km to the River Avon (sources give 1.5 miles or 3 km)
