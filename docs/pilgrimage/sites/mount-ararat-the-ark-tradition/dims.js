/* ==========================================================================
   Mount Ararat & the Ark tradition — sizes and placings

   The mountain is far too large to walk at true size in a phone browser, so
   it is drawn as a SCALE MODEL behind each walkable place: every distance and
   every height reduced by the same factor (K), and set so that from the place
   you stand it fills the same angle of view as the real mountain does. The
   places you walk (the plain, the Durupınar formation, the summit dome) are
   at true size. Sources: sources/pilgrimage-mount-ararat-the-ark-tradition.md.

   SURVEY = a published figure; APPROX = our estimate.
   Frame: metres; x east, y up, z south. Mountain positions in kilometres,
   relative to the summit of Greater Ararat.
   ========================================================================== */
export const D = {};
D.K = 50;                          // the scale-model factor for the mountain backdrop

D.greater = { x: 0, z: 0, h: 5137 };            // Greater Ararat (Büyük Ağrı / Masis), 5,137 m. SURVEY (Journal of Maps 2017)
D.lesser = { x: 9.3, z: 6.8, h: 3896 };         // Lesser Ararat, 3,896 m, to the south-east. Height SURVEY; position APPROX (about 11–13 km apart)
D.saddle = 2700;                                 // the saddle between the two cones. APPROX
D.plainS = 1600;                                 // the Doğubayazıt plain to the south, about 1,600 m. APPROX
D.plainN = 850;                                  // the Aras plain to the north, about 850 m. APPROX
D.massifR = 17;                                  // the massif about 35 km across at its base. SURVEY (as quoted)
D.snow = 4200;                                   // permanent ice and snow above about 4,200 m in this model. APPROX
D.ice = 7.3;                                     // the ice cap and its outlet glaciers: about 7.3 km² (2014–16 mapping). SURVEY

// ---- the places you walk, and where they are on the map (km from the summit, and height)
D.viewS = { x: -6, z: 21, h: 1650 };             // a viewpoint on the plain south of the mountain, near Doğubayazıt. APPROX
D.durup = { x: 6, z: 28, h: 1950 };              // the Durupınar formation, on the lower slopes of Tendürek, south of Ararat. APPROX
D.form = { l: 164, w: 42, h: 3.2 };             // the formation: about 160–165 m long (sources give 157 m and 164 m). Length SURVEY (as quoted); width and height APPROX
D.cubit = 0.5;                                   // a cubit taken as 0.5 m (estimates run about 0.45–0.52 m)
D.arkG = { l: 300, w: 50, h: 30 };               // Genesis 6:15: 300 × 50 × 30 cubits (TEXT)
D.summit = { r: 12, drop: 4.5 };                 // the walkable summit dome, true size, falling away at its edge. APPROX
