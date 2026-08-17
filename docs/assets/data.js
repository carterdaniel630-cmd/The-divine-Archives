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
      status: "published",
      source: "eras/04-axial-age/ch10-second-temple-judaism-axial-age.md",
      summary: "The many Judaisms: how the Babylonian exile forged monotheism and a portable, text-centered faith, the ferment of sects (Pharisees, Sadducees, Essenes) revealed by the Dead Sea Scrolls, the explosion of scripture and apocalyptic literature, the developing Satan, angels, and resurrection — and the fiercely debated question of what all this owes to Zoroastrian Persia." },

    { id: "ch11", title: "Buddhism", kind: "tradition",
      era: "04-axial-age", eraLabel: "Axial Age · Buddhism",
      status: "published",
      source: "eras/04-axial-age/ch11-buddhism-axial-age.md",
      summary: "The religion of no-self: the historical Buddha and the renunciant ferment that rejected Vedic sacrifice, the Four Noble Truths and the Eightfold Path, the radical doctrine of anatta that denies the very Self the Upanishads sought, karma and rebirth without a soul, a path to liberation with no creator god — and the emperor Ashoka, who made it a world religion." },

    { id: "ch12", title: "Confucianism & Daoism", kind: "tradition",
      era: "04-axial-age", eraLabel: "Axial Age · Confucianism & Daoism",
      status: "published",
      source: "eras/04-axial-age/ch12-confucianism-daoism-axial-age.md",
      summary: "Two answers to the same broken world of the Warring States: Confucius and the cultivation of virtue through ren, li, and ritual, completed by Mencius and Xunzi; and the Daoism of the Daodejing and Zhuangzi — wu-wei, ziran, and the uncarved block — with the archaeology (Guodian, Mawangdui) that rewrote their dating, the crucial split between philosophical and religious Daoism, and the Yijing's cosmos of yin and yang." },

    { id: "ch13", title: "Rome", kind: "tradition",
      era: "04-axial-age", eraLabel: "Axial Age · Rome",
      status: "published",
      source: "eras/04-axial-age/ch13-rome-axial-age.md",
      summary: "The republic of ritual: a religion not of belief but of the flawless public performance of the gods' due — the pax deorum and pietas, the Capitoline Triad and the open pantheon of interpretatio romana, the priestly colleges and Vestals, augury and Etruscan liver-reading and the Sibylline Books, the household gods of every home, the state's control of foreign cults from the Bacchanalia to Magna Mater, and the imperial cult that made men into gods." },

    { id: "ch14", title: "Celtic & Germanic", kind: "tradition",
      era: "04-axial-age", eraLabel: "Axial Age · Celtic & Germanic",
      status: "published",
      source: "eras/04-axial-age/ch14-celtic-germanic-axial-age.md",
      summary: "The religions without a book: the Iron Age Celts and Germani, reconstructed from three treacherous witnesses — hostile classical writers, much-later Christian-era vernacular texts, and mute archaeology. Druids and sacred groves, the gods Lugh, Cernunnos, Wodan and Nerthus, votive swords in the water and bodies in the bog, the Coligny calendar, runes and ogham — and an unusually honest reckoning with how much about religions that kept no book we simply cannot know." },

    { id: "ch15", title: "Classical Greece", kind: "tradition",
      era: "04-axial-age", eraLabel: "Axial Age · Classical Greece",
      status: "published",
      source: "eras/04-axial-age/ch15-classical-greece-axial-age.md",
      summary: "From myth to reason: the philosophical revolution that transformed the very idea of God even as the temples kept smoking with sacrifice. Socrates tried for impiety, Xenophanes' one non-anthropomorphic god and Heraclitus' Logos, Pythagoras' immortal soul and sacred number, Plato's Forms and Demiurge and Aristotle's Unmoved Mover, the Stoic divine reason and Epicurus' uninvolved gods — with the Pythagorean tetractys, Greek isopsephy, and the Orphic gold tablets' encoded passwords for the dead." },

    { id: "ch16", title: "Early Christianity", kind: "tradition",
      era: "05-late-antiquity", eraLabel: "Late Antiquity · Early Christianity",
      status: "published",
      source: "eras/05-late-antiquity/ch16-early-christianity-late-antiquity.md",
      summary: "The faith that conquered an empire: a small, persecuted, astonishingly diverse Jewish movement that within three centuries became the official religion of Rome. The historical Jesus that scholarship can establish and the resurrection that only faith can affirm — kept carefully distinct — Paul and the parting from Judaism, the many early Christianities and the slow making of the canon, martyrdom and Constantine, and the encoded symbols of a hidden church: the ICHTHYS fish, the Chi-Rho, the staurogram, and 666 as the gematria of Nero." },

    { id: "ch17", title: "Gnosticism", kind: "tradition",
      era: "05-late-antiquity", eraLabel: "Late Antiquity · Gnosticism",
      status: "published",
      source: "eras/05-late-antiquity/ch17-gnosticism-late-antiquity.md",
      summary: "The secret knowledge and the false god: the losing side of early Christianity, silenced by the victors and recovered in 1945 when a jar of Coptic codices surfaced at Nag Hammadi. The dazzling myth of Sophia's fall and the blind creator Yaldabaoth, the divine spark trapped in matter and freed by gnosis, the inverted reading of Genesis, the schools of Valentinus and Basilides, the Gospels of Thomas and Judas — with the number-name Abraxas (365), the liberating serpent, and an honest reckoning with whether 'Gnosticism' is even one thing." },

    { id: "ch18", title: "Roman Mystery Cults", kind: "tradition",
      era: "05-late-antiquity", eraLabel: "Late Antiquity · Roman Mystery Cults",
      status: "published",
      source: "eras/05-late-antiquity/ch18-roman-mystery-cults-late-antiquity.md",
      summary: "Secret paths to salvation: the initiatory cults that swept the Roman Empire offering what civic religion did not — a personal savior and a hope beyond death. Mithras and the tauroctony known only from mute images, Isis the compassionate queen of heaven seen through Apuleius, Cybele and Attis and the blood-pit of the taurobolium, the Bacchic mysteries — and an even-handed reckoning with the overstated claim that Christianity simply copied them, the contested 'dying and rising god,' and the meaning the initiates hid so well it was lost." },

    { id: "ch19", title: "Rabbinic Judaism", kind: "tradition",
      era: "05-late-antiquity", eraLabel: "Late Antiquity · Rabbinic Judaism",
      status: "published",
      source: "eras/05-late-antiquity/ch19-rabbinic-judaism-late-antiquity.md",
      summary: "The portable homeland: how, after the Temple burned in 70 CE, the rabbis rebuilt Judaism around Torah study, prayer, and law so it could live anywhere. The Oral Torah and the chain from Sinai, the Mishnah and the two Talmuds, the culture of preserved argument (Hillel and Shammai), the Shekhinah in exile and prayer replacing sacrifice, the Babylonian academies — with the letters that made the world (Sefer Yetzirah), the scribe's crowned letters, and the chariot-and-palaces mysticism, told alongside the honest history of a legend and a slowly-rising elite." },

    { id: "ch20", title: "Mahayana Buddhism", kind: "tradition",
      era: "05-late-antiquity", eraLabel: "Late Antiquity · Mahayana Buddhism",
      status: "published",
      source: "eras/05-late-antiquity/ch20-mahayana-buddhism-late-antiquity.md",
      summary: "The Great Vehicle and the vow to save all beings: the bodhisattva who refuses nirvana until every creature is free, the radical philosophy of emptiness (Nagarjuna's Madhyamaka, the Heart Sutra), the cosmic Buddha of the three bodies, the heaven of celestial saviors and Amitabha's Pure Land of grace, and skillful means — with Indra's Net of infinite mutual reflection, the mudras and the Heart Sutra's mantra, and an honest reckoning with sutras held as the Buddha's word but composed centuries later, and origins now known to be monastic, not lay. Closes the Late Antiquity era." },

    { id: "ch21", title: "Islam", kind: "tradition",
      era: "06-early-medieval", eraLabel: "Early Medieval · Islam",
      status: "published",
      source: "eras/06-early-medieval/ch21-islam-early-medieval.md",
      summary: "The recitation and the oneness of God: from the cave of Hira and the command to 'Recite!' to a faith that spanned Spain to the Indus in a century. The historical Muhammad that scholarship can establish and the revelation only faith can affirm — kept distinct — the Qur'an and the manuscript evidence for its early codification, tawhid and the Five Pillars, the Abrahamic inheritance and the Muslim Jesus, Sharia and the schools of law, the Sunni–Shia split sealed at Karbala, and the sacred encoding of a faith that made the written word its supreme art: calligraphy, geometric infinity, the abjad, and the unexplained letters that open the suras." },
    { id: "ch22", title: "Patristic Christianity", kind: "tradition",
      era: "06-early-medieval", eraLabel: "Early Medieval · Patristic Christianity",
      status: "published",
      source: "eras/06-early-medieval/ch22-patristic-christianity-early-medieval.md",
      summary: "The age of the Fathers: how a persecuted movement of house-churches became, over five centuries, a church with a canon, a creed, and an emperor. From Ignatius carried to the beasts and the Apostolic Fathers, through Marcion and the making of the canon, Irenaeus and the rule of faith, Tertullian and Origen, the martyrs and Constantine's turn, to the four great councils — Nicaea, Constantinople, Ephesus, Chalcedon — that defined the Trinity and Christ's two natures and sealed Christianity's first lasting schisms; with Augustine, Jerome's Vulgate, the desert monastics, and the encoded signs of a hunted faith: the ichthys acrostic, the Chi-Rho, and the 666 of Nero." },
    { id: "ch23", title: "Norse Paganism", kind: "tradition",
      era: "06-early-medieval", eraLabel: "Early Medieval · Norse Paganism",
      status: "published",
      source: "eras/06-early-medieval/ch23-norse-paganism-early-medieval.md",
      summary: "The gods before the cross, reconstructed from a ship full of a dead woman's belongings, poems Christians wrote down two centuries too late, and the stones the Norse carved themselves. The Oseberg völva and the hard source-problem; Yggdrasil, the Nine Worlds, and a Ragnarök that may owe something to Christian apocalypse; the Æsir and Vanir, Odin, Thor, and Freyja; the blót and the contested temple at Uppsala; seiðr and the seeress; ship burials, honor, and the law of the þing; the runes and Mjölnir — with the ancient magical inscriptions kept firmly apart from modern rune-tile divination; and the peaceful vote at Iceland's Alþingi in the year 1000 that changed the island's gods." },
    { id: "ch24", title: "Tantra", kind: "tradition",
      era: "06-early-medieval", eraLabel: "Early Medieval · Tantra",
      status: "published",
      source: "eras/06-early-medieval/ch24-tantra-early-medieval.md",
      summary: "The esoteric revolution that reshaped Hinduism and Buddhism alike — a ritual technology of mantra, diagram, and the subtle body that made the human being a map of the cosmos. From the open-air circle of the sixty-four yoginis at Khajuraho and 'Tantrism' as a 19th-century scholarly construct, through the Agamas and the Buddhist tantras, the subtle body of nadis and chakras (a contemplative map, not anatomy), Shiva and the Goddess, Abhinavagupta and Kashmir Shaivism, the Kapalika radicals and the contested five Ms of the left-hand path, and the Vajrayana road to Tibet; with a deep symbology section on bija mantras, the Sri Yantra, mandala, and twilight language — and a firm line drawn between the medieval reality and the modern 'chakra rainbow' and 'tantric sex' overlays laid on top of it." },
    { id: "ch25", title: "Shinto", kind: "tradition",
      era: "06-early-medieval", eraLabel: "Early Medieval · Shinto",
      status: "published",
      source: "eras/06-early-medieval/ch25-shinto-early-medieval.md",
      summary: "Japan's way of the kami — a faith with no founder and, for most of its history, no separate name. From the shrine at Ise rebuilt whole every twenty years, through the Kojiki (712) and Nihon Shoki (720) as eighth-century imperial-legitimation texts, the creation myth of Izanagi and Izanami and the sun-goddess Amaterasu, and a religion organized around purity and pollution rather than sin; the era-defining fusion with Buddhism (shinbutsu-shugo and the honji suijaku theology that made the kami local traces of the buddhas); the shrines and the never-seen three regalia; and a symbology of torii, shimenawa, the mirror as god-body, and kotodama — with the Kuroda thesis that 'Shinto' is largely a modern category, and State Shinto (1868–1945) as a modern construct, kept honestly distinct from the early kami-worship." },
    { id: "ch26", title: "Kabbalah", kind: "tradition",
      era: "07-high-medieval", eraLabel: "High Medieval · Kabbalah",
      status: "published", pending: true,
      source: "eras/07-high-medieval/ch26-kabbalah-high-medieval.md",
      summary: "The great flowering of Jewish mysticism in medieval Provence and Spain — a map of the hidden God as ten emanations on a Tree of Life, and a universe spoken into being out of the letters of the Hebrew alphabet. From the widow of Ávila and the Zohar's true 13th-century authorship (Moses de León, per Scholem, not the 2nd-century sage it names), through the Sefer Yetzirah and the Bahir, Ein Sof and the ten sefirot, the four worlds, the theosophical and the ecstatic (Abulafia) streams, and PaRDeS; with a deep symbology section on the Hebrew letters as the raw material of creation, gematria, notarikon and temurah, and the divine names — keeping attested medieval technique honestly distinct from later Christian Kabbalah, Hermetic Qabalah, and the modern 'Kabbalah Centre.'" },
    { id: "ch27", title: "Sufism", kind: "tradition",
      era: "07-high-medieval", eraLabel: "High Medieval · Sufism",
      status: "published", pending: true,
      source: "eras/07-high-medieval/ch27-sufism-high-medieval.md",
      summary: "The mystical heart of Islam — a path of love, remembrance, and the annihilation of the self in God. From the whirling sema of the Mevlevi and Rabia's torch-and-bucket to burn heaven and quench hell, through the tasawwuf ascetics and al-Ghazali's great reconciliation of Sufism with orthodox Islam, the high-medieval flowering of Ibn Arabi (wahdat al-wujud) and Rumi's Mathnawi, and the founding of the tariqa orders; with a symbology section on the 99 Names, the wine-and-Beloved code of Sufi poetry, and the dance as cosmology — keeping saint-miracles as faith, the origins and Salafi–Sufi debates open, and the popular de-Islamized 'universal Rumi' flagged as a modern distortion." },
    { id: "ch28", title: "Scholasticism", kind: "tradition",
      era: "07-high-medieval", eraLabel: "High Medieval · Scholasticism",
      status: "published", pending: true,
      source: "eras/07-high-medieval/ch28-scholasticism-high-medieval.md",
      summary: "The great medieval marriage of faith and reason. From Aquinas laying down his pen on the unfinished Summa ('all I have written seems like straw'), through the recovery of Aristotle via the Muslim commentators and the birth of the universities, the disputatio method and Abelard's Sic et Non, Anselm's 'faith seeking understanding' and ontological argument, Aquinas's Five Ways, and the later nominalist turn of Scotus and Ockham; with the parallel Jewish and Islamic projects (Maimonides, Avicenna, Averroes) and a symbology section on the four senses of Scripture and the Gothic cathedral as a 'summa in stone' — recording the great arguments as arguments still contested, not settled proofs, and correcting the 'Dark Ages' myth without overclaiming the reverse." },
    { id: "ch29", title: "Aztec, Maya & Inca", kind: "tradition",
      era: "07-high-medieval", eraLabel: "High Medieval · Aztec, Maya & Inca",
      status: "published", pending: true,
      source: "eras/07-high-medieval/ch29-aztec-maya-inca-high-medieval.md",
      summary: "The great temple religions of the pre-Columbian Americas, reconstructed from ruins, deciphered glyphs, frozen mummies, and the records of the conquerors who destroyed them. From the child on the summit of Llullaillaco, through the Maya of the maize and the glyph (the Popol Vuh, the Long Count, and the 2012 non-apocalypse), the Aztec debt of the Fifth Sun (Huitzilopochtli, the Templo Mayor, and human sacrifice told honestly against the impossible Spanish numbers), and the Inca empire of the Sun (Inti, the Coricancha, the capacocha, and the quipu); with a symbology section on Maya writing, the calendars, the quipu, and temple-astronomy — keeping archaeological reality distinct from conquest propaganda and modern myth." },
    { id: "ch30", title: "Bhakti", kind: "tradition",
      era: "07-high-medieval", eraLabel: "High Medieval · Bhakti",
      source: "eras/07-high-medieval/ch30-bhakti-high-medieval.md",
      status: "published", pending: true,
      summary: "The devotional revolution of medieval India — a religion of passionate, personal love for God, sung in the mother tongue by weavers and washerwomen and untouchables, needing no priest, temple, or Sanskrit, only the heart. From the flowers under Kabir's shroud, through the Tamil Alvars and Nayanars, Ramanuja's philosophy of devotion, the saguna/nirguna divide, and the great company of saints (Basava and the Lingayats, Jnaneshwar and Namdev, Kabir and Ravidas); with a symbology section on the vernacular song, the divine name (nama-japa), Kabir's upside-down language, and the Lingayat ishtalinga — keeping the movement and its poetry distinct from the saints' hagiography, and meeting the Sufism of the same age. Closes the High Medieval era." }
  ]
};
