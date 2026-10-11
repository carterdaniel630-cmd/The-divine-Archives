/* ==========================================================================
   Delphi — sizes and placings

   The sanctuary of Apollo as Pausanias walked it, about 170 CE: the fourth-
   century temple, the treasuries and offerings of the Sacred Way, the theatre
   and, higher up, the stadium in its Roman form.

   Each value names its source (full list: sources/pilgrimage-delphi.md).
   SURVEY means a published measurement (the Greek Ministry of Culture's site
   pages, or a reference work quoting the French School's survey); APPROX means
   our estimate of the published plans' proportions. No measured plan of the
   sanctuary could be opened from the build environment, so where each
   building lies, the line of the Sacred Way and the height of each terrace
   are APPROX. The model also straightens the Sacred Way into square runs.

   Frame: metres; x east, y up, z south. The temple terrace is y = 0; the
   sanctuary falls away southwards down the slope of Parnassus.
   ========================================================================== */
export const D = {};

// ---- the slope: ground height away from the built terraces, falling to the south. APPROX
D.slope = 0.22;              // metres of fall per metre southwards. APPROX
D.groundAt = (x, z) => -D.slope * z + Math.max(0, -z - 70) * 0.55;    // steeper under the cliffs to the north. APPROX

// ---- the Temple of Apollo (the fourth-century temple, on the late sixth-century foundations)
// 60.32 × 23.82 m, Doric, 6 × 15 columns. SURVEY (overall size: the dimensions usually given for the Alcmaeonid
// temple of c. 510 BCE, whose foundations the fourth-century temple reused; column count: Ministry of Culture
// and every account). Column height and spacing, the cella plan and the ramp APPROX, after comparable Doric temples.
D.temple = { x: 0, z: 0, L: 60.32, W: 23.82, crepis: 1.2, cols: [6, 15], colH: 10.4, colR: 0.95, inset: 1.25, entH: 3.2 };
D.cella = { x0: -21.5, x1: 22.0, z0: -6.6, z1: 6.6, wallT: 0.9, pronaos: 6.0, adyton: 9.0, h: 11.0 };   // APPROX
D.ramp = { x0: 30.16, x1: 38.5, w: 4.2 };       // a ramp up to the east front. APPROX (a ramp is shown on the published plans)

// ---- the temple terrace, held up on the south by the Polygonal Wall
D.terrace = { x0: -42, x1: 58, z0: -24, z1: 22, y: 0 };          // APPROX
D.polygonal = { x0: -36, x1: 22, z: 22, h: 4.6 };                 // the Polygonal Wall: about 90 m of fitted limestone in reality; here its eastern part. APPROX
D.altar = { x: 46, z: 0, L: 8.6, W: 5.2, h: 2.2 };               // the Altar of the Chians, east of the temple. APPROX
D.serpent = { x: 41, z: 12.5, h: 5.6, base: 1.6 };                // the Serpent Column: bronze, three snakes; its tripod's gold already gone (Pausanias 10.13.9). Height about eighteen feet (Livius, on the column now in Istanbul); the base APPROX

// ---- the Sacred Way: in reality a zigzag; here four straight runs and the corners between them. APPROX
//  A: from the main gate west along the offerings; B: north past the Athenian Treasury; C: east below the
//  Polygonal Wall and the Stoa of the Athenians; D: north up to the temple terrace.
D.gate = { x0: 58, x1: 64, z0: 64, z1: 70, y: -16 };
D.wayA = { x0: 58, x1: -20, z0: 64, z1: 70, y: -16, y1: -10 };
D.k1 = { x0: -26, x1: -20, z0: 62, z1: 70, y: -10 };
D.wayB = { x0: -26, x1: -20, z0: 62, z1: 36, y: -10, y1: -6.2 };
D.k2 = { x0: -26, x1: -20, z0: 30, z1: 36, y: -6.2 };
D.wayC = { x0: -20, x1: 22, z0: 30, z1: 36, y: -6.2, y1: -2.6 };
D.k3 = { x0: 22, x1: 28, z0: 30, z1: 36, y: -2.6 };
D.wayD = { x0: 22, x1: 28, z0: 30, z1: 22, y: -2.6, y1: 0 };

// ---- along the way
D.athenian = { x0: -38.4, x1: -28.75, z0: 52.4, z1: 58.97, y: -9.0, colH: 5.0, colR: 0.36 };   // 9.65 × 6.57 m at the foot of the walls. SURVEY (Ministry of Culture); the rest APPROX. Faces east, onto the way
D.marathon = { x0: -40, x1: -27.5, z0: 60.0, z1: 62.2, h: 1.0 };   // the base for the Marathon offerings along the treasury's south side. APPROX
D.siphnian = { x0: 2.0, x1: 10.41, z0: 72.0, z1: 78.04, y: -12.4, h: 6.4 };   // crepis 6.04 × 8.41 m. SURVEY (Ministry of Culture); faces west; two caryatids for columns
D.sibyl = { x: -16.8, z: 39.5, r: 2.4 };                      // the Rock of the Sibyl. APPROX
D.sphinx = { x: -31.5, z: 27.5, colH: 10.0 };                  // the Naxian Sphinx on its Ionic column, about 10 m. SURVEY (height as usually given); place APPROX
D.stoa = { x0: -14, x1: 16, z0: 22, z1: 27.2, y: -4.6, colH: 3.6, n: 8 };   // the Stoa of the Athenians against the Polygonal Wall. APPROX
D.offerings = [   // bases of offerings along the lower way (Pausanias 10.9–10.10). Places APPROX; what stood on them our own simple renderings
  { id: "bull", x: 52, z: 60.6, w: 3.4, d: 1.6, h: 1.4, kind: "bull" },        // the bronze bull of the Corcyreans
  { id: "arcad", x: 44, z: 60.6, w: 9.0, d: 1.8, h: 1.2, kind: "row", n: 5 },    // the Arcadians' statues
  { id: "navarch", x: 40, z: 73.6, w: 14, d: 3.4, h: 1.0, kind: "row", n: 9 },   // the Spartans' admirals, after Aegospotami
  { id: "argive", x: 22, z: 75.5, r: 6.5, h: 1.0, kind: "arc", n: 7 }            // the Argive kings, a half-round base
];

// ---- the theatre, above the temple to the north-west
// 35 rows, about 5,000 seats. SURVEY (rows and seats, as published); orchestra diameter about 18.5 m APPROX after
// the plans; row height, depth and the shape of the cavea APPROX.
D.theatre = { x: -30, z: -48, y: 7, orchR: 9.3, rows: 35, rowH: 0.4, rowD: 0.66, span: 78 };   // span: degrees each side of north
D.toTheatre = { x0: -14, x1: -10, z0: -22, z1: -44, y: 0, y1: 7 };
D.parodos = { x0: -21, x1: -10, z0: -44, z1: -50, y: 7 };
D.skene = { x0: -42, x1: -18, z0: -38.4, z1: -34.4, h: 5.0 };     // the stage building. APPROX

// ---- the stadium (its own section: in reality further up the hill to the north-west)
// Track 177.55 × 25.5 m. SURVEY. Seats: 12 rows on the north side, 6 on the south and round the west end, some
// 6,500–7,000 spectators (sources differ). Four piers of a Roman arch at the east entrance. Row sizes APPROX.
D.stadium = { x: 0, z: -900, y: 0, L: 177.55, W: 25.5, rowsN: 12, rowsS: 6, rowH: 0.42, rowD: 0.72, arch: 4 };

// ---- the cliffs: the Phaedriades rise behind the sanctuary. APPROX, a backdrop only
D.cliffs = { z: -150, h: 210 };

// ---- the place of each column (centres), from the counts and sizes above
export function templeCols() {
  const T = D.temple, x0 = T.x - T.L / 2 + T.inset, x1 = T.x + T.L / 2 - T.inset, z0 = T.z - T.W / 2 + T.inset, z1 = T.z + T.W / 2 - T.inset;
  const out = [], nf = T.cols[0], ns = T.cols[1];
  for (let i = 0; i < ns; i++) { const x = x0 + (x1 - x0) * i / (ns - 1); out.push([x, z0], [x, z1]); }
  for (let i = 1; i < nf - 1; i++) { const z = z0 + (z1 - z0) * i / (nf - 1); out.push([x0, z], [x1, z]); }
  return out;
}
// the two columns of the porch between the cella's side walls, and the two rows of the interior colonnade. APPROX
export function porchCols() { const C = D.cella; return [[C.x1 - 0.6, -2.4], [C.x1 - 0.6, 2.4]]; }
export function naosCols() { const out = []; for (let x = -9.5; x <= 13.6; x += 3.3) out.push([x, -3.5], [x, 3.5]); return out; }
