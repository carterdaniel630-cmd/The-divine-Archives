/* ==========================================================================
   Persepolis — sizes and placings

   Each value names its source (full list: sources/pilgrimage-persepolis.md).
   SURVEY means a published figure (chiefly A. Sh. Shahbazi, "Persepolis",
   Encyclopaedia Iranica, and UNESCO); APPROX means our estimate. The
   excavators' plans (E. F. Schmidt, Persepolis I–III, 1953–70) could not be
   opened from the build environment, so where each building stands on the
   terrace and how far apart they are is APPROX throughout.

   Frame: metres; x east, y up, z south. y = 0 is the plain below the terrace;
   x = 0, z = 0 is the centre of the Apadana's columned hall.
   ========================================================================== */
export const D = {};

// ---- the terrace: about 125,000 m², roughly 300 × 455 m; its west and north walls about 12 m above the plain
D.T = 12;                                   // SURVEY (Shahbazi: "about 12 m")
D.terr = { x0: -115, x1: 160, z0: -230, z1: 225 };   // 275 × 455 m. Length SURVEY (455 m); width APPROX (published about 300 m); placing APPROX

// ---- the Great Stairway at the north-west: double reversed, flights of 63 and 48 steps, each step 6.70 m long,
//      about 10 cm high and 38 cm deep
D.st = { w: 6.7, run: 0.38, lowN: 63, upN: 48, cz: -110, wall: D.terr.x0 };   // SURVEY (Shahbazi); place APPROX
D.st.rise = D.T / (D.st.lowN + D.st.upN);   // 0.108 m: the model's risers reach the terrace exactly (published: about 10 cm)
D.st.xUp0 = D.st.wall - D.st.w; D.st.xLow0 = D.st.wall - 2 * D.st.w;
D.st.yLand = D.st.lowN * D.st.rise;        // the landings, about 6.8 m up
D.st.lowLen = D.st.lowN * D.st.run; D.st.upLen = D.st.upN * D.st.run;
D.st.bay = 3.35;                            // half the width of the bay between the two lower flights. APPROX

// ---- the Gate of All Nations (Xerxes): a square hall of about 612 m² with four columns over 16.5 m, three doors
D.gate = { x: -80, z: -110, half: 12.37, colH: 16.6, colOff: 5.6, jambH: 10.5, jambW: 2.4, jambD: 5.4, door: 4.0 };
// hall size and column height SURVEY (Shahbazi; Livius); jamb sizes, door width and placing APPROX

// ---- the Apadana: a hall 60 × 60 m of 36 columns, porticoes of 12 columns on the north, west and east, four
//      corner towers; columns about 19.5 m; on a podium about 3 m above the court; two staircases about 81.67 m long
D.ap = { half: 30, port: 18, colH: 19.5, colD: 1.6, podH: 3, y: D.T + 3, stairLen: 81.67, stairD: 8 };
// hall, column height and diameter (UNESCO: about 1.6 m), podium height and stair length SURVEY; portico depth and
// the stair's depth APPROX
D.ap.out = D.ap.half + D.ap.port;          // the podium's half-size, 48 m. APPROX (towers and porticoes as one square)
D.ap.sx = D.ap.out;                        // the east staircase stands against the podium's east face
D.ap.fl = 18;                              // each flight's run, from the court to the podium. APPROX
// which of the 72 columns still stand (13 did in 1977: Shahbazi); which ones, here, is APPROX
D.ap.standing = ["h-0-0", "h-2-1", "h-3-3", "h-5-2", "h-4-5", "h-1-4", "e-0-1", "e-1-2", "e-0-4", "n-1-2", "n-0-3", "w-1-1", "w-0-5"];

// ---- the Hall of a Hundred Columns: about 68.5 m square, ten rows of ten columns about 14 m high (none stands)
D.hc = { x: 100, z: -60, half: 34.25, n: 10, colH: 14 };   // size SURVEY (Shahbazi); place APPROX
// ---- the Tachara, Darius's palace: about 40 × 30 m, twelve columns
D.ta = { x: -20, z: 75, hx: 15, hz: 20 };   // size SURVEY; place APPROX
// ---- the Treasury: about 120 × 60 m in Darius's plan, later enlarged
D.tr = { x: 95, z: 135, hx: 60, hz: 30 };   // size SURVEY; place APPROX
// ---- the Royal Hill (Kuh-e Rahmat) behind the terrace, with two rock-cut tombs
D.hill = { x0: D.terr.x1, top: 180 };       // APPROX
D.tombs = [{ z: -10, y: 38 }, { z: 110, y: 34 }];   // APPROX
