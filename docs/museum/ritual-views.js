/* The Divine Archives — Virtual Museum: where the camera looks during a walkthrough

   A walkthrough tied to a museum object (data/rituals/<slug>.json with a
   `museum_object`, played by the framework's ritual player in the inspector's
   label panel) turns the inspector's camera, step by step, to the part of the
   object's rendition that the step describes. This file holds only those views;
   the text, sources and review status live in the ritual file.

   views[sequence_order]: u — where along the painted scene (0 = left end, 1 = right end);
   yaw, pitch, dist — the view (dist in the inspector's display units; the inspector stands
   further back on narrow screens). Reduced motion: the inspector cuts instead of moving.
   endLinks: offered on the walkthrough's closing screen.
   Checked by tools/verify-rituals.js: every step of the ritual has a view here. */

export const RITUAL_VIEWS = {
  "weighing-of-the-heart": {
    object: "v20",
    views: {
      1: { u: 0.1, yaw: 0, pitch: 0.95, dist: 0.62 },     // Ani and Tutu entering; the twelve gods above
      2: { u: 0.08, yaw: 0.15, pitch: 0.9, dist: 0.5 },   // Ani, who speaks the declarations
      3: { u: 0.21, yaw: 0, pitch: 0.95, dist: 0.5 },     // the balance: the heart against the feather, Anubis
      4: { u: 0.35, yaw: -0.1, pitch: 0.95, dist: 0.55 }, // Thoth writing; the Devourer behind him
      5: { u: 0.72, yaw: 0, pitch: 0.95, dist: 0.78 }     // sheet 4: Horus leads Ani to Osiris in his shrine
    },
    endLinks: [
      ["The chapter's evidence, honestly", "chapters/ch02.html#evidence"],
      ["The Vault entry: the Papyrus of Ani", "vault/papyrus-of-ani.html"],
      ["The papyrus's evidence section", "vault/papyrus-of-ani.html#evidence"]
    ]
  }
};
