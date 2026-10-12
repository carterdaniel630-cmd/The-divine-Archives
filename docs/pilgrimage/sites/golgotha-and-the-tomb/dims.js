/* ==========================================================================
   Golgotha and the Tomb, c. 30 CE — sizes and placings

   The whole site is a labelled reconstruction of a place that no longer
   exists as it was: the old quarry outside Jerusalem's Second Wall, now under
   the Church of the Holy Sepulchre. Research brief: plans/pilgrimage-
   jerusalem.md (sections 2, 3, 5, 7), with its tags:
     WS  well supported (published excavation or text, broad agreement)
     TEXT from an ancient text only
     CJ  our modelling guess, labelled reconstruction on site
   No plan of the 1st-century ground surface exists; distances between the
   features are CJ throughout, chosen to keep their known order (the tomb in
   the quarry's west face, the rock to its east, the gate and road to the
   south and east). A cubit is taken as 0.5 m (CJ: estimates run 0.45–0.52 m).

   Frame: metres; x east, y up, z south.
   ========================================================================== */
export const D = {};
D.cubit = 0.5;                                     // CJ

// ---- the quarry: an old Iron Age meleke quarry, partly filled and cultivated by the 1st century (WS); depth CJ
D.rim = 5.0;                                       // the quarry floor sits about 5 m below the ground round it. CJ
D.q = { x0: -30, x1: 14, z0: -44, z1: 22 };        // the quarry floor in plan. CJ
D.ramp = { x0: 14, x1: 24, z0: -12, z1: -2 };      // a ramp up to the road on the east. CJ

// ---- the rock venerated as Golgotha: an unquarried knob of bedrock, commonly cited at about 4.8 m high and 7 × 3 m
D.knob = { x: 3, z: -4, l: 7, w: 3, h: 4.8 };       // size as commonly cited (brief: to be verified against Gibson & Taylor 1994); place CJ

// ---- the rock-cut tomb in the west face: forecourt, low entrance, one chamber with a bench on the north side
D.tomb = { x: -34, z: -20 };                        // the entrance, in the quarry's west face. CJ
D.fore = { d: 4.0, w: 5.0 };                        // forecourt cut into the face. CJ (typology: Kloner and Zissu 2007)
D.door = { w: 0.8, h: 0.85, t: 0.8 };               // a small, low, square entrance, about 0.8 m. CJ, after the typology (WS)
D.ch = { w: 3.0, d: 3.0, h: 2.1 };                  // the chamber. CJ
D.bench = { d: 0.85, h: 0.6 };                      // a bench along the north wall, as the surviving bench under the Edicule (Biddle 1999). CJ for size
D.pit = 0.35;                                       // the standing pit: the floor between the benches is cut lower. CJ
D.kokh = { w: 0.55, h: 0.6, d: 1.9 };               // a kokh (burial niche): about 1.8–2 m deep, 0.45–0.6 m wide and high. WS (typology)
D.blocker = { w: 1.1, h: 1.1, t: 0.45 };            // the square blocking stone, moved aside. Form WS (Kloner 1999: nearly all tombs); size CJ

// ---- the neighbouring tomb (the kind still seen west of the Edicule): a façade with kokhim behind, exterior only
D.tomb2 = { x: -10, z: -44 };                       // in the north face. CJ

// ---- the road, the gate, the crosses (the crosses' place is deliberately neutral: "near the gate and road")
D.road = { x0: 26, x1: 34, z0: -70, z1: 60 };       // a road along the east side, on the rim. CJ
D.crosses = [{ x: 38.5, z: 30 }, { x: 41, z: 32.5 }, { x: 43.5, z: 30 }];   // CJ: a low rise beside the road, outside the gate
D.cross = { h: 2.9, bar: 1.7, at: 2.35, s: 0.16 };  // about 2.5–3 m overall (brief: model choice, labelled reconstruction)

// ---- the Second Wall and the Gennath Gate (line contested), and Herod's three towers beyond (Josephus, War 5.161–175)
D.wall2 = { z: 64, h: 9, t: 3 };                    // CJ
D.gate = { x: 31, w: 4.5, h: 6 };                   // CJ
// Josephus' figures, in cubits: Hippicus 25 × 25 base, 80 high; Phasael 40 × 40, 90 high; Mariamne 20 × 20, 50 high (TEXT)
D.towers = [
  { n: "Hippicus", x: -120, z: 205, b: 25, h: 80 },
  { n: "Phasael", x: -80, z: 215, b: 40, h: 90 },
  { n: "Mariamne", x: -42, z: 228, b: 20, h: 50 }
];                                                  // positions CJ: by Herod's palace, on the higher western hill south-west of the quarry
D.towerBase = 12;                                   // the palace ground stands higher than the quarry's rim. CJ
// ---- the Temple, far to the east (about 550 m): its façade about 100 cubits wide and high (Josephus, War 5 and Antiquities 15.391–420; TEXT)
D.temple = { x: 560, z: 40, w: 100, h: 100, plat: 30 };
