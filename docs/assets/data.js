/* ==========================================================================
   THE DIVINE ARCHIVES — content index (single source of truth)

   The review gate lives here. A chapter's content is shown on the public site
   ONLY when status === "published". Draft and in-review chapters render as an
   honest placeholder — their text never reaches the build until approved.

   status: "planned" | "draft" | "review" | "published"
   ========================================================================== */

window.ARCHIVE = {

  eras: [
    { slug: "01-prehistory", num: "I", name: "Prehistory",
      dates: "before c. 3500 BCE",
      blurb: "Before writing, belief left its mark in ochre, in bone, and in stone. The earliest evidence of ritual — deliberate burial, painted caves, and the great megaliths — and what it can and cannot tell us about the first religious imagination.",
      traditions: ["Paleolithic & Neolithic ritual", "Cave sanctuaries", "Burial & the first grave-goods", "The megalith builders"] },

    { slug: "02-bronze-age", num: "II", name: "The Bronze Age",
      dates: "c. 3300 – 1200 BCE",
      blurb: "The first civilizations learned to write, and with writing came the first scriptures. Gods of the city and the river, kings who spoke for heaven, and the earliest recorded myths of creation, order, and the flood.",
      traditions: ["Mesopotamia", "Egypt", "Indus Valley", "Early Vedic"] },

    { slug: "03-early-iron-age", num: "III", name: "The Early Iron Age",
      dates: "c. 1200 – 550 BCE",
      blurb: "Empires fell and smaller peoples found their voices. The world of pre-exilic Israel, the earliest Greece of Homer and Hesiod, the reforms of Zoroaster, and the ritual order of early China.",
      traditions: ["Pre-exilic Israel", "Early Greece", "Zoroaster", "Early China"] },

    { slug: "04-axial-age", num: "IV", name: "The Axial Age",
      dates: "c. 800 BCE – 200 CE",
      blurb: "Across a few centuries and half a world, humanity asked its deepest questions anew — and the answers still shape us. Classical Greece, Second Temple Judaism, the Buddha, Confucius and the Dao, Rome, and the Celtic and Germanic north.",
      traditions: ["Classical Greece", "Second Temple Judaism", "Buddhism", "Confucianism & Daoism", "Rome", "Celtic & Germanic"] },

    { slug: "05-late-antiquity", num: "V", name: "Late Antiquity",
      dates: "c. 200 – 800 CE",
      blurb: "The old gods gave way and new faiths spread along the roads of empire. Early Christianity and its rival Gnosticisms, the Roman mystery cults, the making of Rabbinic Judaism, and the flowering of Mahayana Buddhism.",
      traditions: ["Early Christianity", "Gnosticism", "Roman mystery cults", "Rabbinic Judaism", "Mahayana Buddhism"] },

    { slug: "06-early-medieval", num: "VI", name: "The Early Medieval",
      dates: "c. 800 – 1100 CE",
      blurb: "A new revelation reshaped three continents, while older ways endured at the edges. The rise of Islam, the patristic Christian settlement, Norse paganism before the cross, the currents of Tantra, and the kami of Shinto.",
      traditions: ["Islam", "Patristic Christianity", "Norse paganism", "Tantra", "Shinto"] },

    { slug: "07-high-medieval", num: "VII", name: "The High Medieval",
      dates: "c. 1100 – 1500 CE",
      blurb: "An age of mystics and system-builders on every continent. Kabbalah and Sufism, the great scholastic syntheses, the temple religions of the Aztec, Maya, and Inca, and the devotional fire of the Bhakti movements.",
      traditions: ["Kabbalah", "Sufism", "Scholasticism", "Aztec, Maya & Inca", "Bhakti"] },

    { slug: "08-early-modern", num: "VIII", name: "The Early Modern",
      dates: "c. 1500 – 1800 CE",
      blurb: "Reformation and rupture, encounter and conquest. The splintering of Western Christianity, the terror of the witch trials, the religions of Africa on the eve of the colonial age, and the birth of Sikhism.",
      traditions: ["The Reformation", "The witch trials", "Colonial-era African religion", "Sikhism"] },

    { slug: "09-modern", num: "IX", name: "The Modern Age",
      dates: "c. 1800 – present",
      blurb: "Faith did not fade; it multiplied and remade itself. New religious movements, Spiritualism and the séance, the revival of Paganism and Wicca, Theosophy and the occult, and the living syntheses of the diaspora.",
      traditions: ["New religious movements", "Spiritualism", "Wicca & modern Paganism", "Theosophy", "Diaspora syntheses"] }
  ],

  // Cross-cutting comparative themes (span eras)
  themes: [
    { slug: "the-flood", name: "The Flood", chapter: "ch01" },
    { slug: "creation", name: "Creation & the First Order", chapter: null },
    { slug: "the-underworld", name: "The Underworld", chapter: null },
    { slug: "the-returning-god", name: "The Dying & Returning God", chapter: null }
  ],

  chapters: [
    { id: "ch01", title: "The Flood", kind: "theme",
      era: null, eraLabel: "Comparative theme · cross-era",
      status: "published", source: "themes/ch01-the-flood.md",
      summary: "Why nearly every people who kept records remembers the world ending in water — the Mesopotamian lineage from Ziusudra to Utnapishtim, its relationship to Genesis, and what the archaeology will and won't support." },

    { id: "ch02", title: "Egypt", kind: "tradition",
      era: "02-bronze-age", eraLabel: "Bronze Age · Egypt",
      status: "published", source: "eras/02-bronze-age/ch02-egypt-bronze-age.md",
      summary: "A civilization built on an annual flood and organized around the afterlife: Ma'at and the weighing of the heart, the Osiris myth, mummification and the scribes, and the Amarna experiment in one god." }
  ]
};
