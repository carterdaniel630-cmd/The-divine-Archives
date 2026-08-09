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
      summary: "A civilization built on an annual flood and organized around the afterlife: Ma'at and the weighing of the heart, the Osiris myth, mummification and the scribes, and the Amarna experiment in one god." },

    { id: "ch03", title: "Mesopotamia", kind: "tradition",
      era: "02-bronze-age", eraLabel: "Bronze Age · Mesopotamia",
      status: "published",
      source: "eras/02-bronze-age/ch03-mesopotamia-bronze-age.md",
      summary: "The land where writing and the city began: the Enuma Elish and Marduk's ordering of chaos, the great gods and their temple-and-ziggurat cult, divination, Hammurabi's law-stele, the grim underworld, and the divine numbers and sacred encoding of a civilization that read reality as a script." },

    { id: "ch04", title: "Indus Valley", kind: "tradition",
      era: "02-bronze-age", eraLabel: "Bronze Age · Indus Valley",
      status: "published",
      source: "eras/02-bronze-age/ch04-indus-valley-bronze-age.md",
      summary: "The largest and most silent Bronze Age civilization: a faceless, temple-less urban world whose script has never been read, so that nearly everything about its religion — the 'proto-Shiva' seal, the mother-goddess figurines, the Great Bath — remains a genuinely open question, and an honest lesson in how much we cannot know." },

    { id: "ch05", title: "Early Vedic", kind: "tradition",
      era: "02-bronze-age", eraLabel: "Bronze Age · Early Vedic",
      status: "published",
      source: "eras/02-bronze-age/ch05-early-vedic-bronze-age.md",
      summary: "A religion of fire, sound, and memory: the Rigveda and its sibling Vedas preserved orally for three millennia, the pantheon of Indra, Agni, Soma and Varuna, the cosmic order of Rta, the fire sacrifice and the unwritten sacred word — an aniconic, temple-less faith that is also the great key to Indo-European religion." },

    { id: "ch06", title: "Zoroaster", kind: "tradition",
      era: "03-early-iron-age", eraLabel: "Early Iron Age · Zoroaster",
      status: "published",
      source: "eras/03-early-iron-age/ch06-zoroaster-early-iron-age.md",
      summary: "The Iranian prophet who reduced the old pantheon to one Wise Lord, Ahura Mazda, and recast existence as a moral war of truth against the Lie: the Gathas and the Avesta, the cosmic dualism, fire and the Towers of Silence, and the fiercely debated inheritance the West may owe it — the devil, angels, heaven and hell, judgment, resurrection, and the apocalypse." },

    { id: "ch07", title: "Pre-exilic Israel", kind: "tradition",
      era: "03-early-iron-age", eraLabel: "Early Iron Age · Pre-exilic Israel",
      status: "published",
      source: "eras/03-early-iron-age/ch07-pre-exilic-israel-early-iron-age.md",
      summary: "How a people became monotheist: the historical religion of Iron Age Israel and Judah before the exile, reconstructed from archaeology and inscriptions — Israel's emergence within Canaan, Yahweh merged with El and paired with Asherah, the folk religion of high places and figurines, the reforms of Hezekiah and Josiah, and the long road from many gods to one." },

    { id: "ch08", title: "Early Greece", kind: "tradition",
      era: "03-early-iron-age", eraLabel: "Early Iron Age · Early Greece",
      status: "published",
      source: "eras/03-early-iron-age/ch08-early-greece-early-iron-age.md",
      summary: "The gods before the philosophers: Zeus and the Olympians already named on Bronze Age Linear B tablets, a religion with no scripture but with Homer and Hesiod as its canon, the succession myth borrowed from the Near East, sacrifice and oracles and the grim house of Hades — and the mystery cults of Eleusis and Orpheus that first promised the soul something better." },

    { id: "ch09", title: "Early China", kind: "tradition",
      era: "03-early-iron-age", eraLabel: "Early Iron Age · Early China",
      status: "published",
      source: "eras/03-early-iron-age/ch09-early-china-early-iron-age.md",
      summary: "Ancestors, oracle bones, and the Mandate of Heaven: the Shang kings divining by fire-cracked bone to the high god Di and the royal dead, the ritual bronzes cast to feed the ancestors, and the Zhou revolution that made Heaven a moral judge who grants and revokes the right to rule — the religion in which Chinese writing itself was born." },

    { id: "ch10", title: "Second Temple Judaism", kind: "tradition",
      era: "04-axial-age", eraLabel: "Axial Age · Second Temple Judaism",
      status: "published", pending: true,
      source: "eras/04-axial-age/ch10-second-temple-judaism-axial-age.md",
      summary: "The many Judaisms: how the Babylonian exile forged monotheism and a portable, text-centered faith, the ferment of sects (Pharisees, Sadducees, Essenes) revealed by the Dead Sea Scrolls, the explosion of scripture and apocalyptic literature, the developing Satan, angels, and resurrection — and the fiercely debated question of what all this owes to Zoroastrian Persia." }
  ]
};
