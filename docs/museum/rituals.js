/* The Divine Archives — Virtual Museum: guided rituals ("Walk through the scene")

   One respectful, guided walk-through per rite, opened from a button on its
   object's case (plans/games-modern.md §4–§5). The rules every entry follows:
     - guided and explanatory: no score, timer, win state, choice or outcome;
     - opt-in, skippable at every step, and every step also in the Room guide;
     - each step names its source; quotations are exact, from public-domain
       translations, and are logged in sources/ritual-weighing-of-the-heart.md;
     - believer's lens wording ("Egyptians believed…"); the evidence stays on the
       chapter and Vault pages the last step links to.

   Fields
     id, title    the rite
     object       the Vault object whose case carries the button (inspector id)
     room         the museum room, chapter the archive chapter, vault the Vault slug
     tier         1 historical · 2 living and public · 3 living sacred practice
                  (tier 3 is refused by tools/verify-rituals.js unless Carter has
                  approved it in reviews/cleared.json under "rituals")
     pending      new content: shows "Recently added — pending full review"
     steps[]      title; at: where the camera turns (u: 0–1 along the painted
                  scene, left to right; yaw, pitch, dist: the view); lens: the
                  caption; quotes / quoteBy: exact quotations; source: the line
                  shown under "Source"; links (last step): where to read on

   Checked by tools/verify-rituals.js (run by verify.yml). */

export const RITUALS = [
  {
    id: "weighing-of-the-heart",
    title: "The Weighing of the Heart",
    object: "v20",
    room: "ch02",
    chapter: "ch02",
    vault: "papyrus-of-ani",
    tier: 1,
    pending: true,
    intro: "Five steps through the judgment scene of the Papyrus of Ani, as the papyrus shows it: Ani's judgment, not yours. Nothing here depends on you, and you can leave at any step.",
    steps: [
      {
        title: "The Hall of the Two Truths",
        at: { u: 0.1, yaw: 0, pitch: 0.95, dist: 0.62 },
        lens: "Egyptians believed that after death a person came before the gods to be judged, in the hall the Book of the Dead calls the Hall of the Two Truths. Here the scribe Ani and his wife Tutu enter, bowing, while twelve gods sit above on thrones as the judges.",
        source: "Book of the Dead, Spell 125, its title: \"The Chapter of Entering into the Hall of Double Right and Truth\" (E. A. Wallis Budge, The Book of the Dead: The Papyrus of Ani, 1895, Plates XXIX–XXX); the vignette on sheet 3 of the Papyrus of Ani (British Museum EA 10470/3; Budge, Plate III)."
      },
      {
        title: "The Declaration of Innocence",
        at: { u: 0.08, yaw: 0.15, pitch: 0.9, dist: 0.5 },
        lens: "Egyptians believed the dead had to declare their innocence before forty-two divine judges, naming each one and denying one wrong to each. These are seven of Ani's forty-two declarations. They are his words: you are only reading them.",
        quotes: [
          "Hail, thou who art embraced by flame, who comest forth from Kheraba, I have not robbed with violence.",
          "Hail, Fentiu, who comest forth from Khemennu, I have not stolen.",
          "Hail, Devourer of the Shade, who comest forth from Qernet, I have done no murder; I have done no harm.",
          "Hail, thou Flame, which comest and goest, I have spoken no lies.",
          "Hail, thou whose face is turned back, who comest forth from thy hiding place, I have not caused shedding of tears.",
          "Hail, Bast, who comest forth from the secret place, I have not dealt deceitfully.",
          "Hail, Sertiu, who comest forth from Annu, I have not been angry and wrathful except for a just cause."
        ],
        quoteBy: "Budge's translation (1895), declarations 2, 3, 4, 8, 12, 13 and 19, quoted exactly",
        source: "Book of the Dead, Spell 125, the \"Negative Confession\", in E. A. Wallis Budge, The Book of the Dead: The Papyrus of Ani (1895), Plates XXXI–XXXII (public domain; text at sacred-texts.com)."
      },
      {
        title: "The scales",
        at: { u: 0.21, yaw: 0, pitch: 0.95, dist: 0.5 },
        lens: "Egyptians believed the heart, the seat of thought and memory, was weighed against the feather of Ma'at: truth and right order. The jackal-headed Anubis tests the balance. The papyrus shows Ani's heart and the feather in balance, and in its text Thoth reports that the heart \"hath been found true by trial in the Great Balance.\"",
        source: "The vignette on sheet 3 of the Papyrus of Ani (British Museum EA 10470/3) and Budge's translation of its text (1895, Plate III); the heart as the seat of thought and memory: the archive's Vault entry V20."
      },
      {
        title: "Thoth records; Ammit waits",
        at: { u: 0.35, yaw: -0.1, pitch: 0.95, dist: 0.55 },
        lens: "The ibis-headed Thoth, scribe of the gods, writes down the result. Behind him sits Ammit, \"the Devourer\", with the head of a crocodile, the forepart of a lion and the hindquarters of a hippopotamus. Egyptians believed that a heart which failed the test would be consumed by her. The papyrus does not show that happening, and neither does this walk-through: in its text the gods answer, \"Let it not be given to the devourer Amemet to prevail over him.\"",
        source: "The British Museum's description of sheet 3 (EA 10470/3: the monster sits \"ready to spring forward to consume Ani's heart if he fails to pass the test\"); Budge's translation (1895, Plate III)."
      },
      {
        title: "Horus presents Ani to Osiris",
        at: { u: 0.72, yaw: 0, pitch: 0.95, dist: 0.78 },
        lens: "Found true, Ani is taken by the hand by the falcon-headed Horus, son of Isis, and led to Osiris, ruler of the dead, enthroned in a shrine with Isis and Nephthys behind him. Egyptians believed the justified dead passed on into the realm of Osiris. Horus says: \"I have come unto thee, O Unnefer, and I have brought the Osiris Ani unto thee.\"",
        source: "The vignette on sheet 4 of the Papyrus of Ani (British Museum EA 10470/4: \"the conclusion of the judgement, with Ani introduced to Osiris\"); Budge's translation and description (1895, Plate IV).",
        links: [
          ["Read the chapter: Egypt in the Bronze Age", "chapters/ch02.html"],
          ["The chapter's evidence, honestly", "chapters/ch02.html#evidence"],
          ["The Vault entry: the Papyrus of Ani", "vault/papyrus-of-ani.html"],
          ["The papyrus's evidence section", "vault/papyrus-of-ani.html#evidence"]
        ]
      }
    ]
  }
];

export const ritualFor = (objectId) => RITUALS.find((r) => r.object === objectId) || null;
export const ritualsInRoom = (roomId) => RITUALS.filter((r) => r.room === roomId);
export const PENDING_LABEL = "Recently added — pending full review";
