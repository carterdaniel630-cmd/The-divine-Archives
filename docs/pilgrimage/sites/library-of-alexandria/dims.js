/* ==========================================================================
   The Library of Alexandria — sizes (all conjectural)

   No plan of the Museum or its Library survives, and no remains of either
   have been securely identified. The only ancient description of the Museum's
   buildings is Strabo's (Geography 17.1.8): "a public walk (peripatos), an
   exedra with seats, and a large house, in which is the common mess-hall of
   the men of learning". Everything below is CONJECTURE: a court with a
   colonnaded walk, an exedra, and a large hall, sized after ordinary
   Hellenistic buildings of the kind, not after any evidence from Alexandria.
   The book room with its wall niches is a further conjecture, after the
   later Roman libraries whose plans do survive.

   Frame: metres; x east, y up, z south.
   ========================================================================== */
export const D = {};
D.court = { x0: -12, x1: 12, z0: -9, z1: 9 };   // the open court inside the colonnade: CONJECTURE
D.walk = 3.2;                                   // the colonnaded walk's depth: CONJECTURE
D.colH = 5.2;                                   // column height: CONJECTURE
D.colR = 0.32;                                  // column radius: CONJECTURE
D.colStep = 2.8;                                // column spacing: CONJECTURE
D.exedra = { r: 4.2, h: 6.0 };                  // the exedra on the north side: CONJECTURE
D.hall = { x: 0, z: 90, w: 14, d: 24, h: 8 };  // the large house: book room and dining hall, model position: CONJECTURE
