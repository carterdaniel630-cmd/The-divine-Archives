/* ==========================================================================
   The Qumran caves — sizes and placings

   The excavation reports describe the caves and give plans (Discoveries in the
   Judaean Desert I, 1955, for Cave 1; III, 1962, for Cave 3; VI, 1977, for
   Cave 4), but those plans could not be opened from the build environment.
   So every size here is APPROX: our estimate of the published proportions
   (Cave 4 two hand-cut chambers, the second smaller; Cave 1 a small natural
   chamber behind a low entrance; Cave 3 a low natural cave with a fallen
   roof), to be checked against the plans at review. Nothing here is a survey
   value.

   Frame: metres; x east, y up, z south. The caves are placed far apart in the
   model so each loads on its own; their model positions mean nothing.
   ========================================================================== */
export const D = {};
D.c4 = { x: 300, z: 0 };                 // Cave 4, model position
D.c4a = { rx: 3.4, rz: 2.5, h: 2.6 };    // chamber 4a: APPROX
D.c4b = { rx: 2.3, rz: 1.9, h: 2.2 };    // chamber 4b, the smaller inner chamber: APPROX
D.c4bOff = 5.3;                           // 4b's centre east of 4a's: APPROX
D.c1 = { x: 400, z: 0 };                 // Cave 1
D.c1r = { rx: 2.8, rz: 2.1, h: 2.3 };    // APPROX
D.crawl = 2.4;                            // the low entrance passage, length: APPROX
D.c3 = { x: 500, z: 0 };                 // Cave 3
D.c3r = { rx: 3.1, rz: 2.4, h: 1.95 };   // APPROX; partly collapsed, so low
