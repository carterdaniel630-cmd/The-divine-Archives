/* ==========================================================================
   THE DIVINE ARCHIVES — The Vault (manuscripts, relics & contested objects)
   Registry for the Vault section. tools/build-vault.js reads this file and the
   markdown in /vault/ to bake docs/vault.html and docs/vault/<slug>.html.

   Each published item may carry a `study` block for the image study viewer:
     manifest   — a IIIF Presentation (v2 or v3) manifest URL, loaded live in the
                  reader's browser from the holding institution (never copied here)
     rights     — plain statement of who owns the images and on what terms
     external   — official viewers to link out to when images can't be embedded
     transcription — optional machine-readable text source for the text panel
   Queued items are listed on the Vault index as "in preparation" and get no
   page until their entry is written to the sourcing standard.
   ========================================================================== */
window.VAULT = {
  categories: {
    manuscripts: "Manuscripts & Codices",
    texts: "Texts & Tablets",
    relics: "Relics & Sacred Objects"
  },
  items: [
    {
      id: "v01", slug: "voynich-manuscript", status: "published", pending: false,
      era: "07-high-medieval", year: 1420, chapters: ["ch28", "ch37"],
      title: "The Voynich Manuscript", category: "manuscripts",
      source: "vault/v01-voynich-manuscript.md",
      held: "Beinecke Rare Book & Manuscript Library, Yale University — MS 408",
      dated: "Vellum radiocarbon-dated 1404–1438",
      summary: "A fifteenth-century vellum book in an unknown script that no one has been able to read — radiocarbon-dated, its owners traced from Rudolf II's Prague, and every proposed 'solution' tested and found wanting. Study all of Yale's page scans at full resolution, load the standard transliteration, and test a decipherment of your own.",
      study: {
        manifest: "https://collections.library.yale.edu/manifests/2002046",
        start: "f1r",
        rights: "Page images are served live by Yale University Library's IIIF image service from Beinecke MS 408. See Yale's catalogue record for its rights statement before reusing them.",
        external: [
          { label: "Yale Digital Collections record", href: "https://collections.library.yale.edu/catalog/2002046" }
        ],
        transcription: {
          kind: "ivtff",
          label: "Zandbergen–Landini (ZL) transliteration, EVA alphabet, IVTFF format",
          urls: ["https://www.voynich.nu/data/ZL_ivtff_2b.txt"],
          about: "https://www.voynich.nu/transcr.html"
        }
      }
    },
    {
      id: "v02", slug: "dead-sea-scrolls", status: "published", pending: false,
      era: "04-axial-age", year: -100, chapters: ["ch10", "ch16", "ch19", "ch50", "ch17", "ch45"],
      title: "The Dead Sea Scrolls", category: "manuscripts",
      source: "vault/v02-dead-sea-scrolls.md",
      artifact: {
        type: "scroll",
        title: "Unroll the scroll",
        sub: "The words the entry discusses, set out as a scroll carries them: consonants only, hanging from ruled lines, sheets sewn edge to edge, read from the right.",
        columns: [
          { kind: "hebrew", heading: "Isaiah 40:3",
            lines: [
              [["קול", "a voice"], ["קורא", "calling, crying out"], ["במדבר", "in the wilderness"], ["פנו", "clear, prepare"], ["דרך", "the way of"], ["יהוה", "YHWH, the divine name (read aloud as Adonai, 'the Lord')"]],
              [["ישרו", "make straight"], ["בערבה", "in the desert (the Arabah)"], ["מסלה", "a highway"], ["לאלהינו", "for our God"]]
            ],
            translation: "A voice calls out: \u201cIn the wilderness clear the way of the LORD; make straight in the desert a highway for our God.\u201d",
            note: "The verse as in the Masoretic Text, in consonants only. The Great Isaiah Scroll (1QIsa\u1d43) preserves the whole chapter. Where the pause falls (\u2018a voice calls: in the wilderness\u2026\u2019 or \u2018a voice calling in the wilderness\u2019) differs between the Hebrew accents and the Greek, and the Gospels follow the Greek." },
          { kind: "rule", heading: "Community Rule \u00b7 1QS VIII 13\u201314",
            lines: [
              ["\u2026they shall separate themselves from the dwelling of the men of injustice,"],
              ["to go into the wilderness, to prepare there the way of", ["הואהא", "HIM: an unusual extended writing, used here in place of God's name"]],
              ["as it is written:"],
              ["\u201cIn the wilderness prepare the way of", ["\u2022\u2022\u2022\u2022", "four dots, standing where the divine name would be written"]],
              ["make straight in the desert a highway for our God.\u201d"]
            ],
            note: "This archive's working translation. The community read Isaiah 40:3 as its own command to withdraw into the desert, and would not write the Name even when quoting it." },
          { kind: "name", heading: "The Name, set apart", square: "יהוה", paleo: "\ud802\udd09\ud802\udd04\ud802\udd05\ud802\udd04",
            translation: "In several scrolls written in the square script, the scribe switches to the old palaeo-Hebrew letters for this one word." },
          { kind: "text", heading: "4Q521 \u00b7 the one who is to come",
            lines: [["\u2026he will heal the wounded, give life to the dead,"], ["and bring good news to the poor\u2026"]],
            note: "Compare Luke 7:22 and Matthew 11:5." }
        ]
      },
      held: "Israel Antiquities Authority & The Israel Museum, Jerusalem",
      dated: "c. 3rd century BCE – 1st century CE",
      summary: "Some 900–1,000 manuscripts from eleven caves near Qumran — the oldest copies of the Hebrew Bible, lost scriptures like Enoch and Jubilees, a sect's rules and war-liturgy, cryptic alphabets, a treasure list on copper — and the forgeries that followed them onto the market.",
      study: {
        manifest: "",
        rights: "The Israel Antiquities Authority and the Israel Museum hold copyright in their scroll photography and do not permit republication, so this archive links to their own high-resolution viewers rather than copying the images. Any IIIF-published scans from other collections can be opened in the viewer below.",
        external: [
          { label: "Leon Levy Dead Sea Scrolls Digital Library (IAA) — all fragments, incl. infrared", href: "https://www.deadseascrolls.org.il/" },
          { label: "The Digital Dead Sea Scrolls (Israel Museum) — the Great Isaiah Scroll", href: "http://dss.collections.imj.org.il/isaiah" }
        ]
      }
    },
    {
      id: "v03", slug: "emerald-tablet", status: "published", pending: false,
      era: "06-early-medieval", year: 800, chapters: ["ch18", "ch17", "ch21", "ch28", "ch37"],
      title: "The Emerald Tablet", category: "texts",
      source: "vault/v03-emerald-tablet.md",
      artifact: { type: "tablet", title: "The Tablet", sub: "The standard Latin text, cut into green stone as the legend describes it. Touch any line to raise its meaning." },
      held: "No physical tablet is known — the text survives in Arabic & Latin sources",
      dated: "Earliest datable text c. 750–850 CE (Arabic)",
      summary: "Fourteen lines that became the scripture of European alchemy — 'that which is below is like that which is above.' Traced from the Arabic Book of the Secret of Creation to Newton's own translation, with the Latin and a line-by-line working translation, and kept apart from Doreal's 20th-century 'Tablets of Thoth.'",
      study: {
        manifest: "",
        rights: "There is no tablet to photograph. The best-known image — Heinrich Khunrath's 1609 engraving of the text carved on a rock — is public domain and digitized by the institutions linked here; open any IIIF manifest of it in the viewer below.",
        external: [
          { label: "Khunrath, Amphitheatrum Sapientiae Aeternae (1609) — Science History Institute", href: "https://digital.sciencehistory.org/works/dodh36q" },
          { label: "Khunrath, Amphitheatrum (1609) — Princeton University Library", href: "https://dpul.princeton.edu/alchemy/catalog/wm117v989" }
        ]
      }
    },
    {
      id: "v04", slug: "shroud-of-turin", status: "published", pending: false,
      era: "07-high-medieval", year: 1354, chapters: ["ch22", "ch60", "ch31"],
      title: "The Shroud of Turin", category: "relics",
      source: "vault/v04-shroud-of-turin.md",
      held: "Chapel of the Shroud, Turin Cathedral — owned by the Holy See since 1983",
      dated: "Radiocarbon 1260–1390 CE (1988; contested); documented from c. 1354",
      summary: "A 4.4-metre linen bearing the faint negative-like image of a crucified man — documented from the 1350s, radiocarbon-dated to 1260–1390, its image still unexplained. Every test and every challenge, set side by side, with the Church's own distinction between icon and relic.",
      artifact: {
        type: "linen", title: "The Linen through time",
        sub: "A to-scale schematic of the cloth (not a photograph; the figure is deliberately not drawn). Move through its documented history and watch its scars accumulate.",
        events: [
          { y: 1354, t: "First documented at Lirey", d: "Shown in the church founded by Geoffroi de Charny; a pilgrim's badge from the showings survives in the Musée de Cluny." },
          { y: 1389, t: "The d'Arcis memorandum", d: "The bishop of Troyes tells Clement VII an artist confessed to painting it; Clement permits showings only as a 'representation'." },
          { y: 1453, t: "To the House of Savoy", d: "Margaret de Charny passes the cloth to Duke Louis I of Savoy." },
          { y: 1532, t: "Fire at Chambéry", d: "Molten silver from the reliquary scorches through the folded cloth, leaving two long lines of burns and holes, and water stains." },
          { y: 1534, t: "The Poor Clares' patches", d: "Nuns of Chambéry sew about thirty patches over the holes and a backing cloth beneath." },
          { y: 1578, t: "To Turin", d: "Moved to the new Savoy capital." },
          { y: 1898, t: "Secondo Pia's photograph", d: "The glass negative shows a more natural, positive-looking face: the image on the cloth behaves like a negative. Try the negative switch." },
          { y: 1978, t: "STURP examines the cloth", d: "Five days of direct study: no paint forms the image; the colour lies in the topmost fibrils. (McCrone disagreed about pigment.)" },
          { y: 1983, t: "Bequeathed to the pope", d: "Umberto II leaves it to the Holy See, to remain in Turin." },
          { y: 1988, t: "Radiocarbon sample cut", d: "A strip from one corner is divided among Arizona, Oxford and Zurich: 1260–1390 CE at 95% (Nature, 1989). Its representativeness is still argued." },
          { y: 1997, t: "Fire in the Guarini Chapel", d: "The cloth, in its case, is carried out of the burning chapel." },
          { y: 2002, t: "Patches removed", d: "Conservation removes the 1534 patches and backing; the reverse is photographed for the first time." }
        ]
      },
      study: {
        manifest: "",
        rights: "Photographs of the Shroud are controlled by the Archdiocese of Turin and are not republished here. Secondo Pia's 1898 photographs are in the public domain; any IIIF-published copy can be opened in the viewer below.",
        external: [
          { label: "Santa Sindone — the Archdiocese of Turin's official Shroud site", href: "https://sindone.org/en/" }
        ]
      }
    },
    {
      id: "v05", slug: "holy-lance", status: "published", pending: false,
      era: "05-late-antiquity", year: 700, chapters: ["ch16", "ch22", "ch60", "ch49"],
      title: "The Holy Lance (“Spear of Destiny”)", category: "relics",
      source: "vault/v05-holy-lance.md",
      held: "Vienna (Imperial Treasury), Rome (St Peter's), Etchmiadzin (Armenia); copy in Kraków",
      dated: "Vienna lance: early medieval (c. 7th–8th century)",
      summary: "One Gospel sentence, four rival spearheads, and a 1970s occult myth. The Habsburg lance's gold sleeve reads LANCEA ET CLAVVS DOMINI, but metallurgy dates the blade centuries after the Crucifixion, and the 'Spear of Destiny' Hitler legend traces to a single 1972 book.",
      artifact: {
        type: "lance", title: "The Lance and the Word",
        sub: "The Vienna spearhead, drawn schematically with its nail-pin and sleeves. The gold band turns to show its fourteenth-century inscription. Below it is the only Gospel sentence behind every lance.",
        inscription: "+ LANCEA ET CLAVVS DOMINI +",
        parts: [
          { id: "blade", t: "The blade", d: "A winged spearhead of Carolingian type, broken and rejoined. Metallurgical study (Feather, 2003) dated it to about the 7th century; imaging reported in 2025 points to the 8th." },
          { id: "nail", t: "The nail-pin", d: "An iron pin set into an opening in the blade, venerated as a nail of the Cross, which makes the lance a double relic." },
          { id: "silver", t: "The silver sleeve", d: "An earlier binding over the break, from the Ottonian/Salian period." },
          { id: "gold", t: "The gold sleeve", d: "Added for Charles IV in the mid-14th century, inscribed LANCEA ET CLAVVS DOMINI, 'the lance and nail of the Lord'. It records a medieval belief; it is not a date." }
        ],
        greek: [["ἀλλ᾽", "but"], ["εἷς", "one"], ["τῶν", "of the"], ["στρατιωτῶν", "soldiers"], ["λόγχῃ", "with a lance (lonchē, the word behind the later name 'Longinus')"], ["αὐτοῦ", "his"], ["τὴν", "the"], ["πλευρὰν", "side"], ["ἔνυξεν", "pierced"], ["καὶ", "and"], ["ἐξῆλθεν", "came out"], ["εὐθὺς", "at once"], ["αἷμα", "blood"], ["καὶ", "and"], ["ὕδωρ", "water"]],
        translation: "But one of the soldiers pierced his side with a lance, and at once blood and water came out. (John 19:34)",
        cards: [
          { t: "Vienna", s: "Imperial Treasury, Hofburg", d: "Imperial regalia from the 10th century; moved to Nuremberg in 1938 and returned to Vienna on 6 January 1946. Dated early medieval." },
          { t: "Rome", s: "St Peter's Basilica", d: "Venerated in Constantinople for centuries; sent by Sultan Bayezid II to Pope Innocent VIII in 1492. Never scientifically dated." },
          { t: "Etchmiadzin", s: "Armenian Apostolic Church", d: "Tradition says the apostle Thaddeus brought it; first attested in the 13th century; long kept at Geghard ('lance') monastery." },
          { t: "Antioch (lost)", s: "First Crusade, 1098", d: "Dug up after Peter Bartholomew's visions of St Andrew; doubted at once; Peter died after an ordeal by fire in 1099." }
        ]
      },
      study: {
        manifest: "",
        rights: "The Imperial Treasury (Kunsthistorisches Museum Wien) publishes its own photographs of the Holy Lance; they are not copied here.",
        external: [
          { label: "Kunsthistorisches Museum Wien — Imperial Treasury", href: "https://www.khm.at/en/visit/locations/imperial-treasury-vienna" }
        ]
      }
    },
    {
      id: "v06", slug: "crown-of-thorns", status: "published", pending: false,
      era: "07-high-medieval", year: 1238, chapters: ["ch28", "ch60", "ch49"],
      title: "The Crown of Thorns", category: "relics",
      source: "vault/v06-crown-of-thorns.md",
      held: "Notre-Dame de Paris (axial chapel, reliquary of 2024)",
      dated: "Documented from 1238 (Paris); earlier history by tradition; never dated",
      summary: "A ring of bundled rushes bound with gold thread, with no thorns left on it, for which Saint Louis paid almost half his annual revenue and built the Sainte-Chapelle. Traced from the Gospel mockery through Constantinople, Venice and the Revolution to the night Notre-Dame burned.",
      artifact: {
        type: "crown", title: "The Ring of Rushes",
        sub: "The Gospel line circles the crown. Each gold binding holds one stop in the relic's documented journey.",
        greek: "Καὶ οἱ στρατιῶται πλέξαντες στέφανον ἐξ ἀκανθῶν ἐπέθηκαν αὐτοῦ τῇ κεφαλῇ ·",
        translation: "And the soldiers wove a crown of thorns and put it on his head. (John 19:2)",
        stops: [
          { t: "Jerusalem", s: "tradition", d: "Late-antique pilgrims describe a crown of thorns venerated in Jerusalem. The link to the Paris relic is tradition, not a chain of documents." },
          { t: "Constantinople", s: "Byzantine era", d: "A crown kept among the Passion relics of the Byzantine emperors." },
          { t: "Venice", s: "1238", d: "Baldwin II's barons pledge it to Venetian lenders; Louis IX pays the debt: about 135,000 livres tournois." },
          { t: "Paris", s: "1239", d: "Carried to France by two Dominican friars; Louis receives it, by the accounts barefoot." },
          { t: "Sainte-Chapelle", s: "1242–1248", d: "A chapel of stained glass is built around it as a walk-in reliquary." },
          { t: "Notre-Dame", s: "1806", d: "After surviving the Revolution in the Bibliothèque nationale, it is given to the cathedral." },
          { t: "The fire", s: "15 April 2019", d: "Rescued from the burning cathedral by the fire brigade's chaplain, Father Jean-Marc Fournier, and kept at the Louvre." },
          { t: "Return", s: "December 2024", d: "Re-enshrined in Sylvain Dubuisson's new reliquary in the axial chapel." }
        ]
      },
      study: {
        manifest: "",
        rights: "Photographs of the relic belong to the cathedral and to their photographers and are not republished here.",
        external: [
          { label: "Notre-Dame de Paris — official site", href: "https://www.notredamedeparis.fr/en/" }
        ]
      }
    },
    {
      id: "v07", slug: "ark-of-the-covenant", status: "published", pending: false,
      era: "03-early-iron-age", year: -1000, chapters: ["ch07", "ch10", "ch19", "ch60"],
      title: "The Ark of the Covenant", category: "relics",
      source: "vault/v07-ark-of-the-covenant.md",
      held: "No verified object; the Ethiopian Orthodox Church holds it is kept at Aksum",
      dated: "Last mentioned before 586 BCE (2 Chronicles 35:3)",
      summary: "The most precisely described object in the Bible, measured to the half-cubit, and one found nowhere. What the texts say it was and did, the four traditions of its fate (Babylon, Mount Nebo, beneath the Temple, Aksum), and what archaeology can and cannot add.",
      artifact: {
        type: "ark", title: "The Ark as Exodus measures it",
        sub: "Drawn to scale from Exodus 25:10–22 beside a person 1.70 m tall. Switch the cubit to see how much the ancient unit matters; touch any part for its verse.",
        hebrew: [["ועשו", "they shall make"], ["ארון", "an ark (a chest)"], ["עצי", "of wood of"], ["שטים", "acacia"], ["אמתים", "two cubits"], ["וחצי", "and a half"], ["ארכו", "its length"], ["ואמה", "and a cubit"], ["וחצי", "and a half"], ["רחבו", "its width"], ["ואמה", "and a cubit"], ["וחצי", "and a half"], ["קמתו", "its height"]],
        translation: "They shall make an ark of acacia wood: two cubits and a half its length, a cubit and a half its width, and a cubit and a half its height. (Exodus 25:10)",
        parts: [
          { id: "chest", t: "The chest", v: "Exodus 25:10–11", d: "Acacia wood overlaid with pure gold inside and out, with a gold moulding around it. The 'testimony' (the tablets) goes inside (25:16)." },
          { id: "rings", t: "The four rings", v: "Exodus 25:12", d: "Cast gold rings at its four feet or corners, two on each side." },
          { id: "poles", t: "The poles", v: "Exodus 25:13–15", d: "Acacia overlaid with gold, run through the rings: 'the poles shall remain in the rings; they shall not be removed from it.'" },
          { id: "kapporet", t: "The kapporet (‘mercy seat’)", v: "Exodus 25:17", d: "A lid of pure gold, the same length and width as the chest. Its name shares a root with kipper, 'to atone' (Leviticus 16)." },
          { id: "cherubim", t: "The cherubim", v: "Exodus 25:18–22", d: "Two cherubim of hammered gold, one at each end, facing each other, wings spread above the lid. 'There I will meet with you… from between the two cherubim.' Drawn here only as wing-forms." }
        ]
      },
      study: {
        manifest: "",
        rights: "There is no verified object to photograph. Manuscript and early printed depictions of the Ark published in IIIF can be opened in the viewer below.",
        external: []
      }
    },
    {
      id: "v08", slug: "nag-hammadi-codices", status: "published", pending: false,
      era: "05-late-antiquity", year: 350, chapters: ["ch17", "ch45", "ch16", "ch55"],
      title: "The Nag Hammadi Codices", category: "manuscripts",
      source: "vault/v08-nag-hammadi-codices.md",
      held: "Coptic Museum, Cairo",
      dated: "Bound after the 340s CE (dated cartonnage); texts older",
      summary: "Thirteen leather-bound papyrus books found in a sealed jar in 1945: the Gospel of Thomas, Sethian and Valentinian scriptures, Hermetic tractates, even a scrap of Plato. What the library is, what it isn't, and who may have buried it.",
      artifact: {
        type: "codex", theme: "papyrus", title: "Open the codex",
        sub: "A leather-bound papyrus book like those in the jar. Turn its pages for the lines that made the find famous, in this archive's working renderings from the Coptic.",
        pages: [
          { h: "Codex II · Gospel of Thomas", t: "These are the hidden sayings that the living Jesus spoke, and Didymos Judas Thomas wrote them down.", n: "The opening lines" },
          { h: "Gospel of Thomas · saying 77", t: "Split a piece of wood: I am there. Lift up the stone, and you will find me there.", big: true },
          { h: "Codex VI · The Thunder, Perfect Mind", t: "I am the first and the last. I am the honoured one and the scorned one. I am the whore and the holy one.", big: true },
          { h: "The library", t: "Thirteen codices. Some fifty-two texts. Coptic, translated from Greek. Bound after the 340s CE.", n: "Dated letters recycled as stiffening in the covers fix the binding date." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the codices belong to the Coptic Museum and to the facsimile edition's publishers and are not republished here.", external: [] }
    },
    {
      id: "v09", slug: "codex-gigas", status: "published", pending: false,
      era: "07-high-medieval", year: 1220, chapters: ["ch28"],
      title: "The Codex Gigas (“Devil's Bible”)", category: "manuscripts",
      source: "vault/v09-codex-gigas.md",
      held: "National Library of Sweden, Stockholm",
      dated: "Early 13th century, Bohemia",
      summary: "The largest surviving medieval manuscript (92 cm tall, about 75 kg), with a Bible, Josephus, Isidore, medicine, exorcisms, and a full-page devil facing the Heavenly City. Plundered from Prague in 1648 and thrown from a burning castle in 1697. The legend of the walled-up monk, and what the script says instead.",
      artifact: {
        type: "codex", theme: "giant", title: "Turn the giant's pages",
        sub: "A walk through what the one enormous volume holds, in its own order of wonders. The devil and the city are described, not drawn.",
        pages: [
          { h: "The size of it", t: "92 × 50 × 22 cm. About 75 kg. 310 vellum leaves.", big: true, n: "The largest surviving medieval manuscript." },
          { h: "Scripture", t: "The Old Testament and the New, in the Latin Vulgate." },
          { h: "History and knowledge", t: "Josephus's Antiquities and Jewish War; Isidore of Seville's Etymologies; the Chronicle of Cosmas of Prague." },
          { h: "Body and soul", t: "Medical works; confessions and penitential texts; formulae against demons, illness and theft." },
          { h: "The devil", t: "A full-page devil, horned and clawed, crouches in an ermine loincloth, almost a metre high.", n: "Page 290." },
          { h: "The Heavenly City", t: "On the facing page, the City of God. Sin and salvation are set face to face across the opening." },
          { h: "The legend", t: "A monk walled up alive promises a book in a single night and sells his soul to finish it.", n: "Late folklore. The uniform script points to one scribe working for years." },
          { h: "Its journey", t: "Podlažice. Prague, under Rudolf II. Taken by the Swedish army in 1648. Thrown from the burning castle in Stockholm in 1697." }
        ]
      },
      study: { manifest: "", rights: "The National Library of Sweden publishes the complete Codex Gigas online.", external: [ { label: "National Library of Sweden — the Codex Gigas", href: "https://www.kb.se/in-english/the-codex-gigas.html" } ] }
    },
    {
      id: "v10", slug: "copper-scroll", status: "published", pending: false,
      era: "04-axial-age", year: 50, chapters: ["ch10"],
      title: "The Copper Scroll", category: "texts",
      source: "vault/v10-copper-scroll.md",
      held: "The Jordan Museum, Amman",
      dated: "1st century CE (debated); found 1952, Qumran Cave 3",
      summary: "A Dead Sea Scroll punched into copper: 64 hiding places of silver and gold, sawn into 23 strips to be read, tagged with seven unexplained Greek letter-groups, and never once found.",
      artifact: {
        type: "scroll", theme: "copper", title: "Unroll the copper",
        sub: "The first entry of the treasure list and the seven Greek letter-groups, set out on a copper sheet. Touch a letter-group to see what has been proposed.",
        columns: [
          { kind: "rule", heading: "3Q15 · column 1, the first entry", lines: [["In the ruin in the Valley of Achor,"], ["under the steps that go eastward,"], ["forty cubits:"], ["a chest of silver and its vessels,"], ["a weight of seventeen talents."]], note: "A working rendering after the published translations. About 64 entries follow in the same terse style." },
          { kind: "rule", heading: "The seven Greek letter-groups", lines: [[["ΚΕΝ", "Greek letters after an entry; perhaps an abbreviated name. The meaning is unknown."]], [["ΧΑΓ", "Greek letters after an entry; perhaps an abbreviated name. The meaning is unknown."]], [["ΗΝ", "Greek letters after an entry; perhaps an abbreviated name. The meaning is unknown."]], [["ΘΕ", "Greek letters after an entry; perhaps an abbreviated name. The meaning is unknown."]], [["ΔΙ", "Greek letters after an entry; proposed as the start of a name such as Didymos. The meaning is unknown."]], [["ΤΡ", "Greek letters after an entry; perhaps an abbreviated name. The meaning is unknown."]], [["ΣΚ", "Greek letters after an entry; perhaps an abbreviated name. The meaning is unknown."]]], note: "Proposals include abbreviated names of the people who kept each cache, numerals, and cues to a companion document. The claim that they spell 'Akhenaten' has no scholarly support." },
          { kind: "text", heading: "“Another writing”", lines: [["The list says a duplicate,"], ["with further explanation,"], ["was hidden elsewhere."]], note: "No such second document has been found." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the scroll belong to the Jordan Museum and to their photographers.", external: [] }
    },
    {
      id: "v11", slug: "rohonc-codex", status: "published", pending: false,
      era: "08-early-modern", year: 1550, chapters: ["ch31"],
      title: "The Rohonc Codex", category: "manuscripts",
      source: "vault/v11-rohonc-codex.md",
      held: "Library of the Hungarian Academy of Sciences, Budapest",
      dated: "Paper watermarked 16th century; writing undated",
      summary: "448 small pages in an unknown script of about 200 signs, with crucifixions beside crescents. Given to the Hungarian Academy in 1838, it is suspected as a forger's hoax and proposed as a coded prayer book. Every reading so far, and why none has held.",
      artifact: {
        type: "cards", title: "Six readings of an unread book",
        sub: "Each card is one attempt to explain the Rohonc Codex. Turn it to see how it fared.",
        cardsTitle: "Turn each card",
        cards: [
          { t: "Old Hungarian runes", s: "Székely script", d: "Proposed by several readers. The sign inventory and structure do not match; no consistent reading results." },
          { t: "Dacian", s: "an ancient language", d: "A 2000s claim of a Dacian text. Rejected by linguists: it rests on an invented language model." },
          { t: "Brahmi / Indic", s: "script comparison", d: "A proposed Indic-script reading produced no connected text accepted by other specialists." },
          { t: "Sumerian and others", s: "various", d: "Numerous claims with no independent confirmation." },
          { t: "A 19th-century hoax", s: "Sámuel Literáti Nemes", d: "Proposed by Károly Szabó. Nemes did forge documents in the 1830s, but the book's length and consistency make a hoax hard to prove." },
          { t: "A coded prayer book", s: "Király & Tokai, 2018", d: "Proposed in Cryptologia: a cipher-script paraphrasing New Testament texts, like a breviary. Serious and partial; no full reading yet." }
        ]
      },
      study: { manifest: "", rights: "The Hungarian Academy of Sciences holds the manuscript and its images.", external: [] }
    },
    {
      id: "v12", slug: "ketef-hinnom-scrolls", status: "published", pending: false,
      era: "03-early-iron-age", year: -600, chapters: ["ch07", "ch19"],
      title: "The Ketef Hinnom Silver Scrolls", category: "texts",
      source: "vault/v12-ketef-hinnom-scrolls.md",
      held: "The Israel Museum, Jerusalem",
      dated: "Late 7th – early 6th century BCE (most scholars)",
      summary: "Two tiny silver amulets from a Jerusalem tomb, excavated in 1979 and unrolled over three years, carrying the Priestly Blessing (‘May YHWH bless you and keep you’). They are about four centuries older than the Dead Sea Scrolls and the oldest known artefacts bearing words also found in the Bible.",
      artifact: {
        type: "scroll", theme: "silver", paleo: true, title: "Unroll the amulet",
        sub: "The Priestly Blessing on a strip of silver. Switch to palaeo-Hebrew to see the letters the amulets use; touch a word for its meaning.",
        columns: [
          { kind: "hebrew", heading: "Numbers 6:24–26",
            lines: [
              [["יברכך", "may he bless you"], ["יהוה", "YHWH, the divine name"], ["וישמרך", "and keep you"]],
              [["יאר", "may he make shine"], ["יהוה", "YHWH"], ["פניו", "his face"], ["אליך", "upon you"], ["ויחנך", "and be gracious to you"]],
              [["ישא", "may he lift up"], ["יהוה", "YHWH"], ["פניו", "his face"], ["אליך", "to you"], ["וישם", "and set, give"], ["לך", "to you"], ["שלום", "peace"]]
            ],
            translation: "May YHWH bless you and keep you; may YHWH make his face shine upon you and be gracious to you; may YHWH lift up his face to you and give you peace.",
            note: "The biblical (Masoretic) text. The amulets carry a shorter form and are damaged in places; parts of their readings are reconstructed." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the amulets belong to the Israel Museum and the excavators.", external: [] }
    },
    {
      id: "v13", slug: "tilma-of-guadalupe", status: "published", pending: false,
      era: "08-early-modern", year: 1531, chapters: ["ch43", "ch48"],
      title: "The Tilma of Guadalupe", category: "relics",
      source: "vault/v13-tilma-of-guadalupe.md",
      held: "Basilica of Our Lady of Guadalupe, Mexico City",
      dated: "Devotion attested by 1556; tradition dates the image to 1531",
      summary: "The cloak venerated as Juan Diego's, bearing the image of Our Lady of Guadalupe. It was attacked in 1556 as 'painted by an Indian, Marcos', survived a bomb in 1921, and was studied in infrared in 1979. The Nahuatl account, the documents, the science and the myths, kept apart.",
      artifact: {
        type: "timeline", theme: "tilma", title: "The cloak through time",
        sub: "The Virgin's most famous words in Nahuatl, then the documented history. Touch a Nahuatl word for its meaning.",
        lineHead: "Nican Mopohua", lineLang: "nah",
        line: [["Cuix", "is it not so? (question particle)"], ["amo", "not"], ["nican", "here"], ["nica", "I am (present)"], ["nimonantzin?", "I, your revered mother"]],
        lineTr: "“Am I not here, I who am your mother?”",
        events: [
          { y: 1531, t: "The apparitions (tradition)", d: "Four appearances to Juan Diego at Tepeyac; roses in December; the image on his cloak before the bishop." },
          { y: 1556, t: "“Painted by an Indian, Marcos”", d: "Fray Francisco de Bustamante preaches against the devotion; Archbishop Montúfar's inquiry records it. The image and its cult exist, and are already disputed." },
          { y: 1648, t: "First printed account", d: "Miguel Sánchez publishes the story in Spanish." },
          { y: 1649, t: "The Nican Mopohua in print", d: "Luis Lasso de la Vega prints the Nahuatl account, widely attributed to Antonio Valeriano." },
          { y: 1810, t: "A national banner", d: "Hidalgo's insurgents march under the Guadalupe image in the war of independence." },
          { y: 1921, t: "The bomb", d: "A bomb hidden in flowers explodes beneath the image. The image is unharmed; a bronze altar crucifix is bent." },
          { y: 1979, t: "Infrared study", d: "Philip Callahan finds no underdrawing in face, hands and robe, and later additions (moon, angel, rays, stars)." },
          { y: 2002, t: "Juan Diego canonised", d: "After a Vatican commission defends his historicity against doubts raised in 1996." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the image belong to the Basilica and are not republished here.", external: [] }
    },
    {
      id: "v14", slug: "holy-grail", status: "published", pending: false,
      era: "07-high-medieval", year: 1190, chapters: ["ch49", "ch14"],
      title: "The Holy Grail", category: "relics",
      source: "vault/v14-holy-grail.md",
      held: "Claimants in Valencia, Genoa, León and elsewhere",
      dated: "Legend from c. 1190 (Chrétien de Troyes)",
      summary: "The Gospels mention a cup and say nothing of its fate. The Grail was born in French romance around 1190. Valencia's agate cup, Genoa's glass dish and León's onyx chalice, set against the literature that made them sacred, and the modern 'bloodline' hoax.",
      artifact: {
        type: "timeline", theme: "grail", title: "How a cup became the Grail",
        sub: "Move through the texts and objects in order. The claimants are on the cards below.",
        events: [
          { y: "c. 30", t: "“A cup” at the Last Supper", d: "Mark 14:23; Matthew 26:27; Luke 22; 1 Corinthians 11:25. Nothing is said of its fate." },
          { y: 1101, t: "The Sacro Catino taken", d: "Crusaders carry a green dish from Caesarea to Genoa. It is later identified with the Grail, and later still shown to be medieval Islamic glass." },
          { y: "c. 1190", t: "Chrétien's graal", d: "Perceval, or the Story of the Grail: a mysterious dish in a procession, not yet the Last Supper cup. Unfinished." },
          { y: "c. 1200", t: "Robert de Boron", d: "Joseph d'Arimathie makes the Grail the Last Supper vessel that caught Christ's blood." },
          { y: 1399, t: "Valencia's cup documented", d: "The agate cup is recorded at San Juan de la Peña; the cup itself may be ancient, the mounting medieval." },
          { y: 1982, t: "Papal Masses", d: "John Paul II (1982) and Benedict XVI (2006) celebrate with the Valencia chalice." },
          { y: 2014, t: "León's claim", d: "Two historians propose the Chalice of Doña Urraca. Most specialists reject the argument." }
        ],
        cardsTitle: "Three claimants: turn each card",
        cards: [
          { t: "Valencia", s: "Santo Cáliz", d: "An agate cup perhaps of the 2nd century BCE to 1st century CE, in a medieval mounting; documented from 1399." },
          { t: "Genoa", s: "Sacro Catino", d: "A hexagonal dish once thought to be emerald: 9th–10th-century Islamic glass, broken after being taken to Paris under Napoleon." },
          { t: "León", s: "Chalice of Doña Urraca", d: "Onyx cups in an 11th-century royal mounting; its 2014 Grail claim was widely rejected." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the chalices belong to their cathedrals and are not republished here.", external: [] }
    },
    {
      id: "v15", slug: "true-cross", status: "published", pending: false,
      era: "05-late-antiquity", year: 380, chapters: ["ch22", "ch60", "ch31"],
      title: "The True Cross", category: "relics",
      source: "vault/v15-true-cross.md",
      held: "Fragments worldwide: Rome, Jerusalem, Mount Athos, Paris and others",
      dated: "Venerated in Jerusalem by the 380s (Egeria)",
      summary: "Wood venerated as the Cross in fourth-century Jerusalem, where deacons guarded it because a pilgrim once bit off a piece. Helena's discovery legend and Eusebius's silence, Calvin's 'shipload' and the 1870 attempt to measure every fragment.",
      artifact: {
        type: "timeline", theme: "reliquary", title: "The wood through time",
        sub: "From the discovery legend to the tape measure.",
        events: [
          { y: "326–328", t: "Helena in Jerusalem (legend)", d: "Later writers say the empress found the Cross beneath a temple over Golgotha. Eusebius, who describes her journey, does not mention it." },
          { y: "380s", t: "Egeria's Good Friday", d: "Pilgrims kiss wood laid on a table on Golgotha while deacons watch, because someone once bit off a piece." },
          { y: 395, t: "Ambrose tells the story", d: "The first surviving telling of Helena's discovery, in the funeral oration for Theodosius." },
          { y: 614, t: "Taken by Persia", d: "Khosrow II captures Jerusalem and its relic." },
          { y: 630, t: "Restored by Heraclius", d: "The emperor returns the relic to Jerusalem." },
          { y: 1543, t: "Calvin's “shipload”", d: "The Treatise on Relics mocks the number of fragments: enough to fill a ship." },
          { y: 1870, t: "Rohault de Fleury's count", d: "Measuring the known fragments, he finds they make up only a small fraction of a cross, which answers Calvin's sum but proves nothing about authenticity." }
        ]
      },
      study: { manifest: "", rights: "Photographs of reliquaries belong to their churches and museums.", external: [] }
    },
    {
      id: "v16", slug: "james-ossuary", status: "published", pending: false,
      era: "04-axial-age", year: 30, chapters: ["ch16", "ch10"],
      title: "The James Ossuary", category: "relics",
      source: "vault/v16-james-ossuary.md",
      held: "Returned to its private owner after a criminal trial",
      dated: "Box: 1st century BCE – 1st century CE type; inscription disputed",
      summary: "A first-century bone box inscribed 'James, son of Joseph, brother of Jesus'. It was declared a forgery by the Israel Antiquities Authority, and its owner was acquitted after an eight-year trial that proved nothing either way. One disputed phrase, and the odds behind common names.",
      artifact: {
        type: "inscription", theme: "limestone", title: "The inscription",
        sub: "Cut into the side of the limestone box, right to left. Touch a word for its meaning, and see which words are disputed.",
        lang: "arc", dir: "rtl",
        words: [["יעקוב", "Ya'akov: James"], ["בר", "son of (Aramaic)"], ["יוסף", "Yosef: Joseph"], ["אחוי", "his brother"], ["דישוע", "of Yeshua: Jesus"]],
        translation: "James, son of Joseph, brother of Jesus",
        disputed: [3, 4], disputedLabel: "Show the disputed words",
        disputedNote: "Critics argue that ‘brother of Jesus’ was added in modern times; defenders say the whole line is ancient. The 2012 verdict settled neither."
      },
      study: { manifest: "", rights: "Photographs of the ossuary belong to its owner and to the publications that printed them.", external: [] }
    },
    {
      id: "v17", slug: "gospel-of-jesus-wife", status: "published", pending: false,
      era: "09-modern", year: 2012, chapters: ["ch16"],
      title: "The “Gospel of Jesus's Wife”", category: "manuscripts",
      source: "vault/v17-gospel-of-jesus-wife.md",
      held: "A papyrus fragment now recognised as a modern forgery",
      dated: "Papyrus old; writing modern (forgery)",
      summary: "A card-sized Coptic fragment in which Jesus says 'my wife', announced by a Harvard historian in 2012 and exposed by 2016: a text patched together from an online Gospel of Thomas, down to its typo. How a forgery is caught, step by step.",
      artifact: {
        type: "timeline", theme: "forgery", title: "How a forgery was caught",
        sub: "The fragment's two famous phrases, then the evidence as it arrived.",
        lineHead: "The fragment (translated)",
        line: [["“Jesus said to them, ‘My wife…’”", "The line that made headlines. Its wording is assembled from phrases in the Coptic Gospel of Thomas."], ["“…she will be able to be my disciple…”", "Also patched from Thomas: compare sayings 55 and 101."]],
        events: [
          { y: 2012, t: "Announced in Rome", d: "Karen King presents the fragment at the International Congress of Coptic Studies, cautiously." },
          { y: 2012, t: "A patchwork text", d: "Francis Watson shows nearly every phrase comes from the Coptic Gospel of Thomas, cut up and reassembled." },
          { y: 2014, t: "Old papyrus", d: "Tests date the papyrus to antiquity, but old blank papyrus is available to forgers, so the date does not fix the writing." },
          { y: 2014, t: "The companion fake", d: "A Coptic John fragment from the same owner is shown to be copied line by line from a 1924 edition." },
          { y: 2015, t: "The modern typo", d: "The fragment repeats an error from Michael Grondin's 2002 online edition of Thomas." },
          { y: 2016, t: "The owner found", d: "Ariel Sabar traces the fragment to Walter Fritz. The provenance documents collapse." },
          { y: 2016, t: "King concedes", d: "“The evidence now presses in the direction of forgery.”" }
        ]
      },
      study: { manifest: "", rights: "Photographs of the fragment were published by Harvard Divinity School and are not republished here.", external: [] }
    },
    {
      id: "v18", slug: "codex-sinaiticus", status: "published", pending: false,
      era: "05-late-antiquity", year: 345, chapters: ["ch16", "ch22"],
      title: "Codex Sinaiticus", category: "manuscripts",
      source: "vault/v18-codex-sinaiticus.md",
      held: "British Library, Leipzig University Library, St Catherine's Monastery, National Library of Russia",
      dated: "c. 330–360 CE",
      summary: "The oldest complete New Testament, in a fourth-century Greek Bible now split among four libraries: London, Leipzig, Sinai and St Petersburg. It ends Mark at 16:8, includes Barnabas and Hermas, and still carries the dispute over how it left Mount Sinai.",
      artifact: {
        type: "codex", theme: "vellum", title: "Turn the fourth-century pages",
        sub: "How the codex writes: capitals without spaces, sacred names contracted. The first page is in the style of the codex, not a facsimile of its line breaks.",
        pages: [
          { h: "John 1:1, as its scribes wrote", t: "ΕΝΑΡΧΗΗΝΟΛΟΓΟΣΚΑΙΟΛΟΓΟΣΗΝΠΡΟΣΤΟΝΘ̅Ν̅ΚΑΙΘ̅Σ̅ΗΝΟΛΟΓΟΣ", u: true, n: "Scriptio continua: no spaces between words. Θ̅Ν̅ and Θ̅Σ̅ are contracted sacred names." },
          { h: "The same words, separated", t: "En archē ēn ho logos, kai ho logos ēn pros ton theon, kai theos ēn ho logos. In the beginning was the Word, and the Word was with God, and the Word was God." },
          { h: "The sacred names", t: "Θ̅Σ̅ God · Κ̅Σ̅ Lord · Ι̅Σ̅ Jesus · Χ̅Σ̅ Christ", big: true, n: "Nomina sacra: holiness marked in the spelling itself." },
          { h: "Mark 16:8, where Mark ends here", t: "…for they were afraid.", big: true, n: "The longer ending, Mark 16:9–20, is absent." },
          { h: "Books later left out", t: "After Revelation: the Epistle of Barnabas and part of the Shepherd of Hermas." },
          { h: "One book, four libraries", t: "London, 347 leaves · Leipzig, 43 · Sinai, 12 and fragments · St Petersburg, fragments of 3.", n: "Reunited online by the Codex Sinaiticus Project in 2009." }
        ]
      },
      study: { manifest: "", rights: "The four holding libraries publish the complete manuscript through the Codex Sinaiticus Project.", external: [ { label: "Codex Sinaiticus Project — the whole manuscript online", href: "https://www.codexsinaiticus.org/" } ] }
    },
    {
      id: "v19", slug: "book-of-soyga", status: "published", pending: false,
      era: "08-early-modern", year: 1560, chapters: ["ch26", "ch37"],
      title: "The Book of Soyga", category: "manuscripts",
      source: "vault/v19-book-of-soyga.md",
      held: "Bodleian Library, Oxford (MS Bodley 908); British Library (Sloane MS 8)",
      dated: "16th century; owned by John Dee",
      summary: "John Dee's book of magic, ending in 36 grids of letters he could never read. An angel told him only Michael could explain it. Rediscovered in 1994; in 2006 a cryptographer showed the grids are generated from seed words by a fixed rule, not hidden messages.",
      artifact: {
        type: "timeline", theme: "grimoire", title: "Words turned backwards",
        sub: "The book hides words by reversing them. Touch each one, then follow the book's history.",
        lineHead: "Reversals in the manuscript",
        line: [["Soyga", "read backwards: Agyos, from the Greek hagios, 'holy'"], ["Sipal", "read backwards: Lapis, Latin 'stone'"], ["Munob", "read backwards: Bonum, Latin 'good'"]],
        events: [
          { y: "16th c.", t: "The book is written", d: "A Latin compilation of angel names, astrology and spells, ending in 36 tables of 36 × 36 letters. Author and date unknown." },
          { y: 1583, t: "Dee asks an angel", d: "In a crystal-gazing session with Edward Kelley, Dee asks the angel Uriel about the book, and is told only the archangel Michael can interpret it." },
          { y: 1609, t: "Dee dies; the book vanishes", d: "It is thought lost for nearly four centuries." },
          { y: 1994, t: "Found twice over", d: "Two copies are identified in the Bodleian (MS Bodley 908) and the British Library (Sloane MS 8) under the title Aldaraia sive Soyga vocor." },
          { y: 2006, t: "The tables explained", d: "Jim Reeds shows each table is generated from a seed word by a fixed rule, and reconstructs the method: a real decipherment of how they were made, with no hidden message inside." }
        ]
      },
      study: { manifest: "", rights: "Images of both manuscripts belong to the Bodleian and British Libraries.", external: [] }
    },
    {
      id: "v20", slug: "papyrus-of-ani", status: "published", pending: false,
      era: "02-bronze-age", year: -1250, chapters: ["ch02", "ch47"],
      title: "The Papyrus of Ani", category: "manuscripts",
      source: "vault/v20-papyrus-of-ani.md",
      held: "British Museum, London (EA 10470)",
      dated: "c. 1250 BCE (19th Dynasty)",
      summary: "A 24-metre Book of the Dead made for the scribe Ani at Thebes. Its judgment scene, the heart weighed against the feather of Ma'at before the Devourer, is the most famous image of the afterlife from the ancient world. Spell 125 and the 42 denials of the Negative Confession.",
      artifact: {
        type: "scales", title: "The weighing of the heart",
        sub: "Spell 125 made interactive. Speak each denial of the Negative Confession and watch the balance, as Egyptian belief held it would. The glyphs are the Egyptian signs for heart and feather.",
        declarations: ["I have not robbed with violence.", "I have not killed man or woman.", "I have not stolen the offerings of the gods.", "I have not told lies.", "I have not caused anyone to weep."],
        prompt: "The heart outweighs the feather. Speak the denials.",
        verdict: "Balanced against Ma'at: maa-kheru, “true of voice”.",
        hint: "Five of the 42 denials, in this archive's working renderings. The painted vignette shows the balance level; this interaction illustrates the belief, it is not a claim about what happened to Ani."
      },
      study: { manifest: "", rights: "The British Museum publishes photographs of the Papyrus of Ani in its collection database, under its own licence terms.", external: [ { label: "British Museum — Papyrus of Ani (EA 10470)", href: "https://www.britishmuseum.org/collection/object/Y_EA10470-3" } ] }
    },
    {
      id: "v21", slug: "book-of-kells", status: "published", pending: false,
      era: "06-early-medieval", year: 800, chapters: ["ch14", "ch22"],
      title: "The Book of Kells", category: "manuscripts",
      source: "vault/v21-book-of-kells.md",
      held: "Trinity College Dublin (MS 58)",
      dated: "c. 800 CE",
      summary: "The high point of Insular art: the four Gospels in Latin, with a Chi-Rho page where cats watch mice steal a wafer and an otter holds a fish. It was stolen for its jewelled cover in 1007 and found under a sod. The symbols it certainly uses, and the ones still argued over.",
      artifact: {
        type: "codex", theme: "insular", title: "Open the Gospel book",
        sub: "The book's most famous opening and the symbols it uses, page by page.",
        pages: [
          { h: "The Chi-Rho page", t: "XPI autem generatio", big: true, n: "Matthew 1:18: ‘Now the birth of Christ…’ The Greek letters Chi-Rho-Iota fill almost the whole page." },
          { h: "In the margins", t: "Cats watching mice nibble a wafer; an otter holding a fish; moths.", n: "Read as Eucharistic and resurrection symbols, or as observation and humour. The meanings are debated." },
          { h: "The four living creatures", t: "A man for Matthew · a lion for Mark · an ox for Luke · an eagle for John.", n: "From Ezekiel and Revelation, assigned to the evangelists in a system set out by Jerome." },
          { h: "Ornament as meditation", t: "Spirals within spirals, knots too small to see without a lens.", n: "Often read as visual prayer; that reading is widely held, not recorded by the makers." },
          { h: "1007", t: "The great Gospel of Colum Cille is stolen from Kells for its jewelled cover, and found months later under a sod, the cover gone.", n: "Annals of Ulster." },
          { h: "Today", t: "At Trinity College Dublin since the 1660s. Digitised in full.", n: "340 folios survive." }
        ]
      },
      study: { manifest: "", rights: "Trinity College Dublin publishes the complete Book of Kells in its Digital Collections.", external: [ { label: "Trinity College Dublin — the Book of Kells", href: "https://www.tcd.ie/library/research-collections/book-of-kells.php" } ] }
    },
    {
      id: "v22", slug: "mesha-stele", status: "published", pending: false,
      era: "03-early-iron-age", year: -840, chapters: ["ch07", "ch58"],
      title: "The Mesha Stele", category: "texts",
      source: "vault/v22-mesha-stele.md",
      held: "Musée du Louvre, Paris (AO 5066)",
      dated: "c. 840 BCE",
      summary: "A Moabite king's victory stone, smashed by fire and cold water in 1869 and rebuilt from a paper squeeze. It tells the story of 2 Kings 3 from the other side and carries the earliest certain mention of YHWH outside the Bible.",
      artifact: {
        type: "inscription", theme: "basalt", paleo: true, title: "The first line of the stone",
        sub: "In the script the stone uses, closely related to early Hebrew. Touch a word; switch to square Hebrew letters to compare.",
        lang: "he", dir: "rtl",
        words: [["אנך", "I (am)"], ["משע", "Mesha"], ["בן", "son of"], ["כמש[…]", "Chemosh[…]: the end of the father's name is lost"], ["מלך", "king of"], ["מאב", "Moab"], ["הדיבני", "the Dibonite"]],
        translation: "I am Mesha, son of Chemosh[…], king of Moab, the Dibonite."
      },
      study: { manifest: "", rights: "The Louvre publishes photographs of the stele and the squeeze in its collections database.", external: [ { label: "Musée du Louvre — Stèle de Mésha", href: "https://collections.louvre.fr/en/ark:/53355/cl010120339" } ] }
    },
    {
      id: "v23", slug: "tel-dan-stele", status: "published", pending: false,
      era: "03-early-iron-age", year: -830, chapters: ["ch07", "ch58", "ch49"],
      title: "The Tel Dan Stele", category: "texts",
      source: "vault/v23-tel-dan-stele.md",
      held: "The Israel Museum, Jerusalem",
      dated: "Late 9th century BCE",
      summary: "Three basalt fragments of an Aramaean king's boast, dug up in 1993–94, naming a king of Israel and bytdwd, the 'House of David'. The first mention of David outside the Bible, what it proves and what it doesn't.",
      artifact: {
        type: "inscription", theme: "basalt", paleo: true, title: "The words that made headlines",
        sub: "Two phrases from the broken stone, in its Old Aramaic letters. Touch a word; see which one is debated.",
        lang: "arc", dir: "rtl",
        words: [["מלך", "king of"], ["ישראל", "Israel"], ["…", "a gap: the stone is broken between the phrases"], ["ביתדוד", "bytdwd: 'House of David', the majority reading; minority readings include a place name or 'house of Dod'"]],
        translation: "…king of Israel … House of David…",
        disputed: [3], disputedLabel: "Show the debated word",
        disputedNote: "Most scholars read bytdwd as ‘House of David’, the dynasty of Judah; a minority proposed other readings. It names a dynasty; it does not prove the biblical stories of David."
      },
      study: { manifest: "", rights: "Photographs of the fragments belong to the Israel Museum and the excavators.", external: [] }
    },
    {
      id: "v24", slug: "sudarium-of-oviedo", status: "published", pending: false,
      era: "05-late-antiquity", year: 650, chapters: ["ch22", "ch28"],
      title: "The Sudarium of Oviedo", category: "relics",
      source: "vault/v24-sudarium-of-oviedo.md",
      held: "Cámara Santa, Oviedo Cathedral, Spain",
      dated: "Documented 1075; radiocarbon c. 7th century CE",
      summary: "A stained linen face-cloth, venerated as the sudarium of John 20:7 and shown three times a year. Documented from the opening of the Arca Santa in 1075, radiocarbon-dated to around the seventh century, and claimed to match the Shroud.",
      artifact: {
        type: "timeline", theme: "veil", title: "The face-cloth through time",
        sub: "The Gospel line behind the relic, then its documented history.",
        lineHead: "John 20:7", lineLang: "grc",
        line: [["καὶ", "and"], ["τὸ", "the"], ["σουδάριον", "sudarium, face-cloth (a Latin loanword in the Greek)"], ["ὃ", "which"], ["ἦν", "was"], ["ἐπὶ", "upon"], ["τῆς", "the"], ["κεφαλῆς", "head"], ["αὐτοῦ", "his"], ["οὐ", "not"], ["μετὰ", "with"], ["τῶν", "the"], ["ὀθονίων", "linen cloths"], ["κείμενον", "lying"], ["ἀλλὰ", "but"], ["χωρὶς", "apart"], ["ἐντετυλιγμένον", "rolled up, folded"], ["εἰς", "in"], ["ἕνα", "one"], ["τόπον", "place"]],
        lineTr: "…and the face-cloth that had been on his head, not lying with the linen cloths but rolled up in a place by itself.",
        events: [
          { y: "c. 570", t: "A possible early mention", d: "An anonymous pilgrim from Piacenza mentions a sudarium in Jerusalem. The link to this cloth cannot be demonstrated." },
          { y: 614, t: "Flight from Jerusalem (tradition)", d: "Tradition says the cloth left ahead of the Persian conquest and travelled through North Africa to Spain." },
          { y: "9th c.", t: "The Holy Chamber", d: "Alfonso II of Asturias builds the Cámara Santa in Oviedo to house relics." },
          { y: 1075, t: "The Arca Santa opened", d: "Alfonso VI, with El Cid among the witnesses, opens the relic chest and has its contents listed: the cloth's firm documentary anchor." },
          { y: 1990, t: "Radiocarbon: Arizona", d: "The linen dates to around the seventh century CE." },
          { y: 1992, t: "Radiocarbon: Toronto", d: "A second test agrees. Defenders argue contamination skews the date; no retest has overturned it." },
          { y: 2007, t: "A later test", d: "Again, a date around the seventh century." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the cloth belong to the Cathedral of Oviedo and the researchers who made them.", external: [] }
    },
    {
      id: "v25", slug: "veil-of-veronica", status: "published", pending: false,
      era: "07-high-medieval", year: 1150, chapters: ["ch60", "ch31"],
      title: "The Veil of Veronica", category: "relics",
      source: "vault/v25-veil-of-veronica.md",
      held: "St Peter's Basilica, Rome; rival image at Manoppello",
      dated: "Venerated at St Peter's from the 12th century",
      summary: "The 'true image' of Christ's face that drew the crowds of the 1300 Jubilee. A legend not in the Gospels, a name with a false etymology, a relic reported lost in the Sack of Rome yet still shown each year, and a transparent veil at Manoppello claimed to be the original.",
      artifact: {
        type: "timeline", theme: "veil", title: "The true image through time",
        sub: "The name first (touch each word), then the history.",
        lineHead: "The name",
        line: [["Veronica", "a Latin form of the Greek name Berenike; the medieval etymology 'vera icon' is a folk etymology"], ["vera", "Latin: true"], ["icon", "from Greek eikōn: image"]],
        events: [
          { y: "12th c.", t: "At St Peter's", d: "A cloth venerated as the Veronica is kept at Old St Peter's." },
          { y: 1300, t: "The first Jubilee", d: "Displayed to the crowds of pilgrims; Dante later writes of those who come far 'to see our Veronica'." },
          { y: 1527, t: "The Sack of Rome", d: "Contemporary letters report the relic stolen or destroyed; others say it survived. The Vatican never declared it lost." },
          { y: "c. 1616–1629", t: "Copies restricted", d: "The papacy restricts reproductions of the Veronica, which some read as a sign the image was no longer visible. That reading is debated." },
          { y: 1999, t: "The Manoppello claim", d: "Heinrich Pfeiffer argues the veil at Manoppello is the original. Claims of sea-silk and an unpainted image lack independent study." },
          { y: 2006, t: "A papal visit", d: "Benedict XVI prays before the Manoppello image, without ruling on its authenticity." },
          { y: "Each year", t: "Passion Sunday", d: "A Veronica relic is shown briefly, from a gallery high in St Peter's; observers report no visible image." }
        ]
      },
      study: { manifest: "", rights: "No openly licensed photographs of the relic are available; it is shown only at a distance.", external: [] }
    },
    {
      id: "v26", slug: "black-stone", status: "published", pending: false,
      era: "06-early-medieval", year: 630, chapters: ["ch21"],
      title: "The Black Stone of the Kaaba", category: "relics",
      source: "vault/v26-black-stone.md",
      held: "Eastern corner of the Kaaba, the Sacred Mosque, Mecca",
      dated: "Venerated in Islam since its beginning; never scientifically examined",
      summary: "The fragments of dark stone in a silver frame that pilgrims salute on every circuit of the Kaaba. Carried off by the Qarmatians in 930 and returned broken in 952. Its place in Islamic practice, and why no one can say what it is made of.",
      artifact: {
        type: "timeline", theme: "kaaba", title: "The stone and its story",
        sub: "The words of the caliph ʿUmar, then the documented history. Touch each phrase.",
        lineHead: "Sahih al-Bukhari, Book of Hajj",
        line: [["“I know that you are a stone", "ʿUmar ibn al-Khaṭṭāb, the second caliph, addressing the Black Stone"], ["that can neither harm nor benefit.", "In Islamic teaching the stone has no power of its own and is not worshipped"], ["Had I not seen the Messenger of God kiss you,", "The Prophet's example is the reason for the rite"], ["I would not have kissed you.”", "Reported in the hadith collection of al-Bukhari"]],
        events: [
          { y: "c. 605", t: "The rebuilding of the Kaaba", d: "Tradition: Muhammad, before his prophetic mission, settles a dispute between clans by placing the stone on a cloak that each clan lifts together." },
          { y: 930, t: "Taken by the Qarmatians", d: "Raiders from eastern Arabia sack Mecca during the pilgrimage and carry the stone away." },
          { y: 952, t: "Returned in pieces", d: "After more than twenty years the stone comes back, broken; later damage breaks it further." },
          { y: "Today", t: "Fragments in silver", d: "The fragments are held in a silver casing, renewed over the centuries. The stone has never been scientifically analysed." }
        ]
      },
      study: { manifest: "", rights: "This entry reproduces no images of the Black Stone.", external: [] }
    },
    {
      id: "v27", slug: "sacred-tooth-relic", status: "published", pending: false,
      era: "05-late-antiquity", year: 350, chapters: ["ch11", "ch20", "ch53", "ch49"],
      title: "The Sacred Tooth Relic", category: "relics",
      source: "vault/v27-sacred-tooth-relic.md",
      held: "Sri Dalada Maligawa (Temple of the Sacred Tooth Relic), Kandy",
      dated: "In Sri Lanka since the 4th century CE (tradition)",
      summary: "The Buddha's tooth, smuggled to Sri Lanka in a princess's hair according to the chronicle, carried in procession by elephants each year. For a thousand years it was the proof of a king's right to rule. The Portuguese claimed to have burned it in 1561.",
      artifact: {
        type: "timeline", theme: "perahera", title: "The relic through time",
        sub: "From Kalinga to Kandy, and the procession that honours it each year.",
        events: [
          { y: "4th c.", t: "Arrival from Kalinga", d: "The chronicle Dāṭhāvaṃsa: Princess Hemamala hides the tooth in her hair and, with Prince Danta, brings it to Anuradhapura." },
          { y: "Centuries", t: "Relic and crown", d: "The tooth moves with the royal capital; possessing it legitimates a king." },
          { y: 1560, t: "Captured at Jaffna?", d: "Portuguese chroniclers say forces of Viceroy Constantino de Bragança seized the tooth." },
          { y: 1561, t: "Destroyed at Goa?", d: "The Portuguese say they ground and burned it, refusing a vast ransom. Sinhalese tradition holds the captured tooth was a replica." },
          { y: "1590s", t: "The Kandy temple", d: "The relic comes to rest with the last Sinhalese kingdom at Kandy." },
          { y: 1998, t: "The bombing", d: "An LTTE truck bomb kills sixteen or seventeen people and damages the temple; the relic chamber is not reached." },
          { y: "Every year", t: "The Esala Perahera", d: "Elephants, drummers and fire-dancers process through Kandy by night; the great elephant carries the relic's casket." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the temple and procession belong to their photographers; the relic itself is rarely shown.", external: [ { label: "Sri Dalada Maligawa — official site", href: "https://sridaladamaligawa.lk/" } ] }
    },
    {
      id: "v28", slug: "birmingham-quran", status: "published", pending: false,
      era: "05-late-antiquity", year: 600, chapters: ["ch21"],
      title: "The Birmingham Qur'an Manuscript", category: "manuscripts",
      source: "vault/v28-birmingham-quran.md",
      held: "Cadbury Research Library, University of Birmingham (Mingana Islamic Arabic 1572a)",
      dated: "Parchment radiocarbon-dated 568–645 CE (95.4% probability)",
      summary: "Two parchment leaves in Hijazi script, recognised in 2015 inside a later manuscript and radiocarbon-dated to 568–645 CE. They belong with sixteen leaves in Paris. What a date for the animal's death can and cannot say about when the words were written.",
      artifact: {
        type: "inscription", theme: "hijazi", title: "The opening of Sura Ṭā Hā",
        sub: "Qurʾan 20:1–2, which begins on one of the Birmingham leaves. Touch a word; then strip the text back to the bare letter-shapes the early scribes wrote.",
        lang: "ar", dir: "rtl", fonts: ["Noto+Naskh+Arabic"],
        words: [["طه", "Ṭā Hā: two separate letters, one of the 'disconnected letters' that open some suras; their meaning is not known"], ["مَا", "not"], ["أَنزَلْنَا", "We sent down"], ["عَلَيْكَ", "to you"], ["الْقُرْآنَ", "the Qurʾan"], ["لِتَشْقَىٰ", "that you should be distressed"]],
        translation: "Ṭā Hā. We did not send down the Qurʾan to you to cause you distress.",
        alt: "rasm", altLabel: "Show the bare consonant skeleton",
        hint: "The skeleton view removes vowel signs and letter-dots, the stripped-down form (rasm) of the writing system. Hijazi scribes wrote no vowel signs and only some of the dots, so this shows the principle, not a copy of the leaf."
      },
      study: { manifest: "", rights: "The Cadbury Research Library publishes images of the leaves; the Bibliothèque nationale de France publishes the Paris leaves in Gallica.", external: [ { label: "University of Birmingham — the Birmingham Qur'an", href: "https://www.birmingham.ac.uk/facilities/cadbury/birmingham-quran-mingana-collection/birmingham-quran" }, { label: "BnF — Arabe 328", href: "https://archivesetmanuscrits.bnf.fr/ark:/12148/cc386200" } ] }
    },
    {
      id: "v29", slug: "sanaa-palimpsest", status: "published", pending: false,
      era: "05-late-antiquity", year: 620, chapters: ["ch21"],
      title: "The Sana'a Palimpsest", category: "manuscripts",
      source: "vault/v29-sanaa-palimpsest.md",
      held: "Dar al-Makhtutat, Sana'a (DAM 01-27.1); four detached leaves in private and institutional hands",
      dated: "Lower text: one detached leaf radiocarbon-dated 578–669 CE (95%)",
      summary: "A Qur'an codex written over an erased older Qur'an. Found in 1972 in the roof of the Great Mosque of Sana'a. The upper text follows the standard text; the lower text has different readings and a different order of suras. It is the only known witness to a non-ʿUthmānic Qur'an text, and scholars disagree about what that means.",
      artifact: {
        type: "palimpsest", title: "Two texts on one leaf",
        sub: "A schematic leaf. Raise the ultraviolet, as imaging did, and the erased writing underneath comes back.",
        seed: 29,
        layers: [
          { t: "The upper text", s: "the writing you see", button: "Upper text", d: "A later Qur'an copy written over the scraped leaf. It follows the standard ʿUthmānic text and sura order, with some unfinished decoration." },
          { t: "The lower text", s: "erased, recovered by imaging", button: "Lower text", d: "The first writing on the leaf. Its readings often differ from the standard text in wording, and its suras run in an order that matches no known tradition. The erasure was deliberate, and the reason is unknown." }
        ],
        hint: "Schematic only: the strokes stand for lines of writing; no letters are reproduced. Photographs of the real leaves belong to their holders."
      },
      study: { manifest: "", rights: "Images of Ṣanʿāʾ 1 were published by the researchers with their editions; the leaves belong to the Yemeni authorities and to the holders of the detached leaves.", external: [] }
    },
    {
      id: "v30", slug: "diamond-sutra", status: "published", pending: false,
      era: "06-early-medieval", year: 868, chapters: ["ch11", "ch20", "ch54", "ch53"],
      title: "The Diamond Sutra of Dunhuang", category: "manuscripts",
      source: "vault/v30-diamond-sutra.md",
      held: "British Library, London (Or.8210/P.2)",
      dated: "Printed 11 May 868 CE (dated colophon)",
      summary: "A five-metre scroll printed from woodblocks, found in a sealed cave library on the Silk Road and dated by its maker to 868. It is the oldest complete printed book that carries a date. Its text teaches that all conditioned things are like a dream.",
      artifact: {
        type: "scroll", theme: "paper", title: "Unroll the sutra",
        sub: "Read from the right, top to bottom, as the scroll is read: its title, its closing verse and the printer's dedication.",
        fonts: ["Noto+Serif+TC:wght@400;600"],
        hint: "Chinese scrolls, like Hebrew ones, open from the right. Drag the paper to travel along it and touch a character-group to read its meaning.",
        columns: [
          { kind: "cjk", heading: "The title", lines: [[["金剛", "Diamond (Sanskrit vajra: 'diamond' or 'thunderbolt')"], ["般若", "wisdom (prajñā)"], ["波羅蜜", "perfection (pāramitā)"], ["經", "sutra, scripture"]]],
            translation: "The Diamond Perfection of Wisdom Sutra (Vajracchedikā Prajñāpāramitā).", note: "The Chinese translation printed here is Kumārajīva's, of around 402 CE." },
          { kind: "cjk", heading: "The closing verse", lines: [[["一切", "all"], ["有為法", "conditioned things (dharmas made by causes)"]], [["如夢", "are like a dream"], ["幻", "an illusion"], ["泡", "a bubble"], ["影", "a shadow"]], [["如露", "like dew"], ["亦如電", "and like lightning"]], [["應作", "one should"], ["如是觀", "view them in this way"]]],
            translation: "All conditioned things are like a dream, an illusion, a bubble, a shadow, like dew and like lightning: view them in this way." },
          { kind: "cjk", heading: "The printer's dedication", lines: [[["咸通九年", "in the ninth year of Xiantong"], ["四月十五日", "on the fifteenth day of the fourth month"]], [["王玠", "Wang Jie"], ["為二親", "on behalf of his two parents"]], [["敬造", "reverently made"], ["普施", "for free distribution to all"]]],
            translation: "On the fifteenth day of the fourth month of the ninth year of Xiantong [11 May 868], Wang Jie reverently made this for free distribution, on behalf of his two parents.", note: "The colophon is why the scroll is famous: it dates the printing to the day." }
        ]
      },
      study: { manifest: "", rights: "The British Library publishes the scroll in its digitised manuscripts and through the International Dunhuang Programme.", external: [ { label: "International Dunhuang Programme — the Diamond Sutra", href: "https://idp.bl.uk/discover/learning/buddhism-on-the-silk-roads/articles/buddhism-on-the-ground/buddhist-texts-the-diamond-sutra/" } ] }
    },
    {
      id: "v31", slug: "dresden-codex", status: "published", pending: false,
      era: "07-high-medieval", year: 1200, chapters: ["ch29", "ch43", "ch46", "ch50"],
      title: "The Dresden Codex", category: "manuscripts",
      source: "vault/v31-dresden-codex.md",
      held: "SLUB Dresden (Saxon State and University Library), Mscr.Dresd.R.310",
      dated: "Usually dated 11th–14th century; the date is debated",
      summary: "The finest of the four Maya books that survived the Spanish conquest: a folding screen of bark paper, bought in Vienna in 1739 and damaged by water in 1945. Its tables track Venus, predict eclipse seasons, and bind both to the sacred 260-day count.",
      artifact: {
        type: "venus", title: "The Venus table",
        sub: "The 584-day cycle of Venus, divided as the codex divides it, with the numbers in Maya bar-and-dot notation. A dot is one, a bar is five, and a shell is zero.",
        phases: [
          { name: "Morning star", kind: "morning", days: 236, d: "Venus rises before the sun. The codex's pages treat its first appearance, the heliacal rising, as a moment of danger, with the god of the planet spearing victims." },
          { name: "Hidden (superior conjunction)", kind: "hidden", days: 90, d: "Venus passes behind the sun. The real disappearance is shorter and varies; 90 is a canonical figure chosen to make the table's cycles fit." },
          { name: "Evening star", kind: "evening", days: 250, d: "Venus shines after sunset." },
          { name: "Hidden (inferior conjunction)", kind: "hidden", days: 8, d: "Venus passes between the earth and the sun, and vanishes for about eight days." }
        ],
        multiples: [
          { label: "One cycle: 584", n: 584, sub: "written 1.11.4 in the day count", d: "The table's Venus year. The true mean is 583.92 days; the Maya kept the table in step with corrections." },
          { label: "Five cycles: 2,920", n: 2920, sub: "= 8 solar years of 365 days", d: "Five Venus cycles end almost exactly where eight years of 365 days end, so the pattern repeats against the seasons." },
          { label: "The great cycle: 37,960", n: 37960, sub: "= 65 × 584 = 146 × 260 = 104 × 365", d: "After 104 years the Venus cycle, the sacred 260-day count and the 365-day year all meet again. The table covers this span." }
        ],
        hint: "Large numbers are written in the Maya day count, in which the third place counts 360 days, not 400."
      },
      study: { manifest: "", rights: "SLUB Dresden publishes the complete codex in its digital collections.", external: [ { label: "SLUB Dresden — the Dresden Maya Codex", href: "https://www.slub-dresden.de/en/explore/manuscripts/the-dresden-maya-codex/content" } ] }
    },
    {
      id: "v32", slug: "popol-vuh-manuscript", status: "published", pending: false,
      era: "08-early-modern", year: 1701, chapters: ["ch29", "ch46", "ch47", "ch01"],
      title: "The Popol Vuh Manuscript", category: "manuscripts",
      source: "vault/v32-popol-vuh-manuscript.md",
      held: "The Newberry Library, Chicago (Ayer MS 1515)",
      dated: "Copied c. 1700–1715 by Francisco Ximénez; the lost K'iche' original c. 1550s",
      summary: "The K'iche' Maya book of creation, the Hero Twins and the lords of Xibalba, which survives only because a Dominican friar in Chichicastenango copied it around 1701, K'iche' beside Spanish. The alphabetic original, written by K'iche' nobles after the conquest, is lost.",
      artifact: {
        type: "inscription", theme: "folio", title: "The first words",
        sub: "The opening of the K'iche' text, in modern spelling. Touch each word.",
        lang: "quc", dir: "ltr",
        words: [["Are", "this is"], ["u xe'", "its root, its beginning"], ["ojer", "ancient"], ["tzij", "word"], ["waral", "here"], ["K'iche'", "K'iche' (Quiché)"], ["u b'i'", "its name"]],
        translation: "This is the beginning of the ancient word, here in this place called K'iche'."
      },
      study: { manifest: "", rights: "The Newberry Library publishes the manuscript digitally; a facsimile is also in the Library of Congress's World Digital Library collection.", external: [ { label: "The Newberry — Popol Vuh research guide", href: "https://www.newberry.org/collection/research-guide/popol-vuh" }, { label: "Library of Congress — Popol Vuh (digital facsimile)", href: "https://www.loc.gov/item/2021668226" } ] }
    },
    {
      id: "v33", slug: "kartarpur-bir", status: "published", pending: false,
      era: "08-early-modern", year: 1604, chapters: ["ch34", "ch30", "ch27"],
      title: "The Kartarpur Bir", category: "manuscripts",
      source: "vault/v33-kartarpur-bir.md",
      held: "The Sodhi family, Kartarpur (Jalandhar district), Punjab",
      dated: "Completed 1604 (tradition and colophon evidence)",
      summary: "The volume that Sikh tradition holds is the first Adi Granth, compiled by Guru Arjan in 1604 with Bhai Gurdas as scribe. It was kept by a rival claimant to the Guruship, and scholars have seldom been allowed to see it. Its authority is revered, and its text history is debated.",
      artifact: {
        type: "inscription", theme: "folio", title: "The Mul Mantar",
        sub: "The opening statement of the Sikh scripture, in Gurmukhi letters. Touch each phrase.",
        lang: "pa", dir: "ltr", fonts: ["Noto+Sans+Gurmukhi"],
        words: [["ੴ", "Ik Oankar: One, the Creator (the numeral one joined to the sign for Oankar)"], ["ਸਤਿ ਨਾਮੁ", "Sat Nam: Truth is the Name"], ["ਕਰਤਾ ਪੁਰਖੁ", "Karta Purakh: the Creator Being"], ["ਨਿਰਭਉ", "Nirbhau: without fear"], ["ਨਿਰਵੈਰੁ", "Nirvair: without enmity"], ["ਅਕਾਲ ਮੂਰਤਿ", "Akal Murat: timeless form"], ["ਅਜੂਨੀ", "Ajuni: not born"], ["ਸੈਭੰ", "Saibhang: self-existent"], ["ਗੁਰ ਪ੍ਰਸਾਦਿ", "Gur Prasad: known by the Guru's grace"]],
        translation: "One Creator. Truth is the Name. The Creator Being, without fear, without enmity, timeless in form, unborn, self-existent, known by the Guru's grace.",
        hint: "Renderings of the Mul Mantar vary; this archive's working rendering follows common English versions."
      },
      study: { manifest: "", rights: "No photographic record of the manuscript has been published with its owners' permission; this entry reproduces none.", external: [] }
    },
    {
      id: "v34", slug: "pyramid-texts-of-unas", status: "published", pending: false,
      era: "02-bronze-age", year: -2350, chapters: ["ch02", "ch49", "ch47", "ch50"],
      title: "The Pyramid Texts of Unas", category: "texts",
      source: "vault/v34-pyramid-texts-of-unas.md",
      held: "In place: the Pyramid of Unas, Saqqara, Egypt",
      dated: "Carved c. 2350 BCE (end of the 5th Dynasty)",
      summary: "The oldest large body of religious writing in the world: 283 spells carved and painted blue on the walls of a king's burial chambers under a ceiling of stars. They were meant for no living reader, and were found in 1881. They include the notorious 'Cannibal Hymn'.",
      artifact: {
        type: "chamber", title: "The walls of the burial chamber",
        sub: "A schematic of Unas's burial chamber: a gabled ceiling of stars over walls of spells. The cartouche carries the king's name in hieroglyphs.",
        cartouche: "𓃹𓈖𓇋𓋴",
        spells: [
          { k: "I", t: "Unas has not died", s: "Utterance 213", d: "“Unas, you have not gone away dead: you have gone away alive.” The spell denies death outright and sends the king to sit on the throne of Osiris." },
          { k: "II", t: "The offering ritual", s: "the offering spells", d: "The words of the priests' offering service, listing bread, beer, cloth and ointments with a spoken formula for each, so the offerings would never end." },
          { k: "III", t: "Against serpents", s: "Utterances 226–243", d: "Short, very old spells to repel snakes and dangerous creatures from the tomb, some in language that was already archaic." },
          { k: "IV", t: "The 'Cannibal Hymn'", s: "Utterances 273–274", d: "“The sky is overcast, the stars are darkened…” The king hunts the gods, cooks and eats them, and takes in their power. It is ritual language of royal supremacy, not a record of real cannibalism." },
          { k: "V", t: "Ascent to the sky", s: "several utterances", d: "The king climbs to the sky by ladder, smoke, wings or a leap, to join the sun-god's boat and the undying circumpolar stars." }
        ],
        hint: "Schematic: the blue marks stand for columns of hieroglyphs. The quotations are this archive's working renderings, guided by the translations of Faulkner and Allen."
      },
      study: { manifest: "", rights: "Photographs of the chambers belong to their photographers and the Egyptian antiquities authorities.", external: [] }
    },
    {
      id: "v35", slug: "cyrus-cylinder", status: "published", pending: false,
      era: "04-axial-age", year: -539, chapters: ["ch03", "ch06", "ch10", "ch49"],
      title: "The Cyrus Cylinder", category: "texts",
      source: "vault/v35-cyrus-cylinder.md",
      held: "British Museum, London (BM 90920)",
      dated: "After 539 BCE",
      summary: "A clay barrel inscribed in Babylonian cuneiform after Cyrus of Persia took Babylon. It praises Cyrus as Marduk's chosen king and records the return of gods and peoples to their homes. It is often called the first charter of human rights, which it is not, and it is read beside the Bible's decree of Cyrus.",
      artifact: {
        type: "inscription", theme: "clay", title: "“I am Cyrus”",
        sub: "The opening of line 20, in transliterated Akkadian. Touch a word.",
        lang: "akk", dir: "ltr",
        words: [["anāku", "I (am)"], ["Kuraš", "Cyrus"], ["šar kiššati", "king of the universe"], ["šarru rabû", "the great king"], ["šarru dannu", "the mighty king"], ["šar Bābili", "king of Babylon"], ["šar māt Šumeri u Akkadî", "king of the land of Sumer and Akkad"], ["šar kibrāt erbetti", "king of the four quarters (of the world)"]],
        translation: "I am Cyrus, king of the universe, the great king, the mighty king, king of Babylon, king of Sumer and Akkad, king of the four quarters.",
        hint: "Transliteration normalised by this archive from the standard editions; the cylinder itself is written in cuneiform signs."
      },
      study: { manifest: "", rights: "The British Museum publishes photographs and a translation of the cylinder in its collection database.", external: [ { label: "British Museum — the Cyrus Cylinder", href: "https://www.britishmuseum.org/collection/object/W_1880-0617-1941" } ] }
    },
    {
      id: "v36", slug: "rok-runestone", status: "published", pending: false,
      era: "06-early-medieval", year: 810, chapters: ["ch23", "ch14", "ch50"],
      title: "The Rök Runestone", category: "texts",
      source: "vault/v36-rok-runestone.md",
      held: "Beside Rök church, Östergötland, Sweden (Ög 136)",
      dated: "Early 9th century CE",
      summary: "A granite slab carrying the longest runic inscription in the world, some 760 runes, raised by a father for his dead son. It is full of riddles and written partly in cipher, and it names Theodoric the Great. No two scholars read it quite the same way.",
      artifact: {
        type: "inscription", theme: "granite", title: "The first line",
        sub: "The stone's opening words in short-twig runes. Touch a word; switch to the letter-for-letter transliteration.",
        lang: "non", dir: "ltr", fonts: ["Noto+Sans+Runic"],
        words: [["aft", "after, in memory of"], ["uamuþ", "Vámóðr (Vämod), the dead son"], ["stąnta", "stand"], ["runaʀ", "runes"], ["þaʀ", "these"], ["n", "and (the first word of the next clause)"], ["uarin", "Varinn (Varin), the father"], ["faþi", "coloured, wrote"], ["faþiʀ", "the father"], ["aft", "in memory of"], ["faikiąn", "doomed, dead"], ["sunu", "son"]],
        translation: "In memory of Vámóðr stand these runes. And Varinn coloured them, the father, in memory of his dead son.",
        alt: "runes", altStart: true, altLabel: "Show the transliteration",
        hint: "The runes are generated letter for letter from the standard transliteration, using the short-twig forms of the younger futhark the stone uses. Cipher passages elsewhere on the stone are not shown."
      },
      study: { manifest: "", rights: "Photographs of the stone are widely published; the Swedish National Heritage Board maintains the runic record.", external: [ { label: "Uppsala University — the Rök Stone", href: "https://www.uu.se/en/news/2022/2022-01-27-new-book-gives-insight-into-rok-stones-runes" } ] }
    },
    {
      id: "v37", slug: "gundestrup-cauldron", status: "published", pending: false,
      era: "04-axial-age", year: -100, chapters: ["ch14", "ch51", "ch47"],
      title: "The Gundestrup Cauldron", category: "relics",
      source: "vault/v37-gundestrup-cauldron.md",
      held: "National Museum of Denmark, Copenhagen",
      dated: "Made c. 150 BCE–1st century CE; found 1891",
      summary: "Nine kilograms of gilded silver, taken apart and laid in a Danish bog. Its plates show an antlered figure holding a torc and a serpent, a giant dipping a man into a vat, and a bull sacrifice. Probably made far to the south-east. Celtic gods, Thracian silversmiths, or both?",
      artifact: {
        type: "cauldron", title: "The plates, seen from above",
        sub: "The cauldron was found dismantled, its plates stacked inside the bowl. Here they are set back in rings. Touch a plate.",
        base: { k: "Base", t: "The base medallion", s: "round plate in the bottom of the bowl", d: "A great collapsed bull, with a sword-wielding figure above it and a dog. Read as a sacrifice or a hunt. The medallion may have been fitted later, perhaps to repair damage." },
        inner: [
          { k: "A", t: "The antlered figure", s: "inner plate", d: "A cross-legged figure with antlers, holding a torc in one hand and a ram-horned serpent in the other, among stags and other animals. Usually called Cernunnos, a god named on a Gaulish monument; the cauldron itself names no one." },
          { k: "B", t: "The wheel", s: "inner plate", d: "A bearded bust holds a broken wheel, with a figure in a horned helmet. The wheel suggests a sky god, often called Taranis; that identification is an inference." },
          { k: "C", t: "The procession and the vat", s: "inner plate", d: "Foot soldiers march under a tree-like band while riders go the other way above; a giant figure holds a man head-down over a vat. Read as sacrifice, as initiation, or as a return from death." },
          { k: "D", t: "The bulls", s: "inner plate", d: "Three bulls, each with a man about to strike them with a sword." },
          { k: "E", t: "The goddess with wheels", s: "inner plate", d: "A female bust between two wheels, flanked by elephants and griffins: creatures no northern European smith would have seen." }
        ],
        outer: [
          { k: "1", t: "Outer plate 1", s: "a great face", d: "A large bust of a god or goddess grasping smaller figures or animals, a show of superhuman power. The eyes once held inlaid glass." },
          { k: "2", t: "Outer plate 2", s: "a great face", d: "Another divine bust holding smaller beings. Stags, birds, boars, sea-creatures and small human figures appear across the outer plates." },
          { k: "3", t: "Outer plate 3", s: "a great face", d: "Some busts are bearded men and some are women; one woman's hair is being dressed by a small attendant." },
          { k: "4", t: "Outer plate 4", s: "a great face", d: "The busts are usually read as deities, but none is labelled, and names given to them are modern proposals." },
          { k: "5", t: "Outer plate 5", s: "a great face", d: "The hair, torcs and poses echo Celtic art; the animals and some techniques point to the Thracian silverwork of the lower Danube." },
          { k: "6", t: "Outer plate 6", s: "a great face", d: "The plates were made by different hands: metallurgical and stylistic study suggests several silversmiths." },
          { k: "7", t: "Outer plate 7", s: "a great face", d: "Like the rest, it was taken off the bowl and laid inside before the cauldron was deposited in the bog." },
          { missing: true, t: "The missing plate", s: "an eighth outer plate", d: "The layout implies an eighth outer plate that was never found. It may have been removed before the cauldron went into the bog." }
        ],
        hint: "The descriptions summarise the imagery; the arrangement here is schematic, and the plates’ original order is itself debated."
      },
      study: { manifest: "", rights: "The National Museum of Denmark publishes photographs of the cauldron.", external: [ { label: "National Museum of Denmark — the Gundestrup Cauldron", href: "https://en.natmus.dk/historical-knowledge/denmark/prehistoric-period-until-1050-ad/the-early-iron-age/the-gundestrup-cauldron/" } ] }
    },
    {
      id: "v38", slug: "aleppo-codex", status: "published", pending: false,
      era: "06-early-medieval", year: 930, chapters: ["ch10", "ch19"],
      title: "The Aleppo Codex", category: "manuscripts",
      source: "vault/v38-aleppo-codex.md",
      held: "The Israel Museum, Jerusalem (Shrine of the Book); Ben-Zvi Institute",
      dated: "c. 930 CE, Tiberias",
      summary: "The 'Crown of Aleppo': the model Hebrew Bible whose vowels and accents were added by the master Masorete Aaron ben Asher, and which Maimonides called the text everyone relied on. Kept for six centuries in Aleppo's great synagogue, damaged in the riots of 1947, and brought to Israel with about 40% of its leaves missing, most of the Torah among them.",
      artifact: {
        type: "inscription", theme: "folio", title: "The Masoretes' signs",
        sub: "Isaiah 40:1, which survives in the codex, with the vowel signs the Masoretes added. Touch a word; then take the signs away to see the consonantal text they were fitted around.",
        lang: "he", dir: "rtl",
        words: [["נַחֲמוּ", "comfort"], ["נַחֲמוּ", "comfort"], ["עַמִּי", "my people"], ["יֹאמַר", "says"], ["אֱלֹהֵיכֶם", "your God"]],
        translation: "Comfort, comfort my people, says your God.",
        alt: "consonants", altLabel: "Remove the vowel signs",
        hint: "The codex also carries cantillation accents and marginal Masoretic notes; this view shows the vowels only, printed in a modern typeface."
      },
      study: { manifest: "", rights: "Images of the codex are published by the Ben-Zvi Institute and the Israel Museum.", external: [ { label: "Israel Museum — the Aleppo Codex", href: "https://www.imj.org.il/en/collections/226966-0" } ] }
    },
    {
      id: "v39", slug: "derveni-papyrus", status: "published", pending: false,
      era: "04-axial-age", year: -340, chapters: ["ch08", "ch15", "ch18", "ch47"],
      title: "The Derveni Papyrus", category: "manuscripts",
      source: "vault/v39-derveni-papyrus.md",
      held: "Archaeological Museum of Thessaloniki",
      dated: "Roll c. 340–320 BCE; the text composed c. 400 BCE",
      summary: "A papyrus roll half-burned on a funeral pyre near Thessaloniki, the oldest surviving book in Europe. It is a philosopher's allegorical commentary on a secret Orphic poem about the birth of the gods, which opens by telling the uninitiated to shut the doors.",
      artifact: {
        type: "scroll", theme: "charred", dir: "ltr", title: "Unroll the charred papyrus",
        sub: "Three lines the roll preserves or quotes, in the Greek. Greek rolls read from the left.",
        fonts: ["Noto+Serif:ital@0;1"],
        hint: "This papyrus survived because the pyre carbonised it. Drag it to travel along the roll and touch a word to read its meaning.",
        columns: [
          { kind: "greek", lang: "grc", heading: "Column VII · the poem's warning", lines: [[["φθέγξομαι", "I shall speak"], ["οἷς", "to those for whom"], ["θέμις", "it is lawful"], ["ἐστί·", "it is"]], [["θύρας", "the doors"], ["δ᾽", "and"], ["ἐπίθεσθε", "shut"], ["βέβηλοι", "you uninitiated"]]],
            translation: "I shall speak to those for whom it is lawful: shut the doors, you uninitiated.", note: "The line is known from later writers; the papyrus preserves parts of it, and the full verse is a reconstruction." },
          { kind: "greek", lang: "grc", heading: "Column XVII · Zeus", lines: [[["Ζεὺς", "Zeus"], ["κεφαλή,", "the head"]], [["Ζεὺς", "Zeus"], ["μέσσα,", "the middle"]], [["Διὸς", "from Zeus"], ["δ᾽", "and"], ["ἐκ", "out of"], ["πάντα", "all things"], ["τέτυκται", "are made"]]],
            translation: "Zeus the head, Zeus the middle, and from Zeus all things are made.", note: "A verse of the Orphic poem quoted by the commentator; its end is partly restored." },
          { kind: "greek", lang: "grc", heading: "Column IV · Heraclitus", lines: [[["ἥλιος", "the sun"]], [["εὖρος", "in breadth"], ["ποδὸς", "of a foot"], ["ἀνθρωπείου", "human"]]],
            translation: "The sun: the breadth of a human foot.", note: "The commentator quotes Heraclitus; this is the oldest surviving copy of any of his words." }
        ]
      },
      study: { manifest: "", rights: "The Archaeological Museum of Thessaloniki holds the papyrus; multispectral images were published with the scholarly editions.", external: [ { label: "UNESCO Memory of the World — the Derveni Papyrus", href: "https://www.unesco.org/en/memory-world/derveni-papyrus-oldest-book-europe" } ] }
    },
    {
      id: "v40", slug: "gospel-of-judas", status: "published", pending: false,
      era: "05-late-antiquity", year: 280, chapters: ["ch17", "ch16", "ch45"],
      title: "The Gospel of Judas (Codex Tchacos)", category: "manuscripts",
      source: "vault/v40-gospel-of-judas.md",
      held: "Coptic Museum, Cairo",
      dated: "Codex radiocarbon-dated 220–340 CE; the Greek original before c. 180 CE",
      summary: "A Gnostic gospel that the church father Irenaeus denounced around 180 and that was then lost for 1,700 years. It surfaced in a Coptic papyrus codex dug up in Middle Egypt, which rotted for years in a New York bank vault. Unveiled in 2006 as the story of a heroic Judas, a reading many specialists quickly disputed.",
      artifact: {
        type: "codex", theme: "papyrus", title: "Open the codex",
        sub: "The gospel's own words at key points, in this archive's working renderings from published translations, and its title in Coptic.",
        fonts: ["Noto+Sans+Coptic"],
        pages: [
          { h: "The opening", t: "The secret account of the revelation that Jesus spoke in conversation with Judas Iscariot, during a week, three days before he celebrated Passover.", n: "The first words of the gospel." },
          { h: "Jesus laughs", t: "Jesus laughs at the disciples' prayers and sacrifice, saying they serve a lesser god.", n: "Laughter at the disciples is a recurring feature of the text." },
          { h: "“You thirteenth daimon”", t: "Jesus calls Judas the thirteenth daimon and says he will be cursed by the other generations.", n: "The 2006 translation rendered daimōn as 'spirit'; critics argued it means 'demon', and that Judas is not a hero here." },
          { h: "“You will exceed them all”", t: "“You will sacrifice the man who bears me.”", n: "Read in 2006 as praise of Judas; read by others as the darkest line in the text." },
          { h: "The end", t: "Judas received some money and handed him over to them.", n: "The gospel ends here, before the crucifixion." },
          { h: "The title", t: "ⲡⲉⲩⲁⲅⲅⲉⲗⲓⲟⲛ ⲛ̄ⲓⲟⲩⲇⲁⲥ", lang: "cop", big: true, n: "“The Gospel of Judas”, written at the end in Coptic." }
        ]
      },
      study: { manifest: "", rights: "The codex belongs to Egypt; photographs were published by the National Geographic Society with the critical edition.", external: [] }
    },
    {
      id: "v41", slug: "codex-borgia", status: "published", pending: false,
      era: "07-high-medieval", year: 1500, chapters: ["ch43", "ch29", "ch46", "ch51"],
      title: "The Codex Borgia", category: "manuscripts",
      source: "vault/v41-codex-borgia.md",
      held: "Vatican Apostolic Library (Borg.mess.1)",
      dated: "Late 15th or early 16th century, central Mexico",
      summary: "A painted screenfold of deerskin from the Puebla–Tlaxcala region of Mexico, among the very few divinatory books to survive the conquest. It is a manual of the 260-day count, with gods, omens, a Venus almanac and a mysterious central section that may describe a journey through the night.",
      artifact: {
        type: "daycount", title: "The 260-day count",
        sub: "The count the Borgia is built on: thirteen numbers turning against twenty day-signs, so that every day has its own name and no name repeats for 260 days.",
        signs: [["Cipactli", "crocodile"], ["Ehecatl", "wind"], ["Calli", "house"], ["Cuetzpalin", "lizard"], ["Coatl", "serpent"], ["Miquiztli", "death"], ["Mazatl", "deer"], ["Tochtli", "rabbit"], ["Atl", "water"], ["Itzcuintli", "dog"], ["Ozomatli", "monkey"], ["Malinalli", "grass"], ["Acatl", "reed"], ["Ocelotl", "jaguar"], ["Cuauhtli", "eagle"], ["Cozcacuauhtli", "vulture"], ["Ollin", "movement"], ["Tecpatl", "flint"], ["Quiahuitl", "rain"], ["Xochitl", "flower"]],
        startNote: "The count begins with 1 Crocodile. Each day, both wheels move on one place.",
        dayNote: "Number and sign advance together; after 13 days the numbers start again at 1, while the signs carry on.",
        trecenaNote: "A new 'thirteen' (trecena) begins. The Borgia assigns each of the twenty trecenas its own patron deities.",
        loopNote: "260 days: the wheels are back where they began. 260 is the smallest number that both 13 and 20 divide.",
        hint: "Day-sign names are in Nahuatl, the Aztec language; the Borgia's painters shared this calendar with the Aztecs."
      },
      study: { manifest: "https://digi.vatlib.it/iiif/MSS_Borg.mess.1/manifest.json", rights: "The Vatican Apostolic Library publishes the codex through its DigiVatLib service.", external: [ { label: "DigiVatLib — Borg.mess.1", href: "https://digi.vatlib.it/view/MSS_Borg.mess.1" } ] }
    },
    {
      id: "v42", slug: "lindisfarne-gospels", status: "published", pending: false,
      era: "05-late-antiquity", year: 715, chapters: ["ch16", "ch22", "ch14"],
      title: "The Lindisfarne Gospels", category: "manuscripts",
      source: "vault/v42-lindisfarne-gospels.md",
      held: "British Library, London (Cotton MS Nero D IV)",
      dated: "c. 715–720 CE; Old English gloss added c. 950–970",
      summary: "The four Gospels made on Holy Island in honour of St Cuthbert, probably by one man, Bishop Eadfrith. Two centuries later the priest Aldred wrote a word-by-word Old English translation between the lines, the oldest surviving English version of the Gospels, and a colophon naming the book's makers.",
      artifact: {
        type: "codex", theme: "insular", title: "Open the Gospel book",
        sub: "Aldred's colophon, which names the four men behind the book, then its great pages.",
        pages: [
          { h: "The scribe", t: "Eadfrith, bishop of the church of Lindisfarne, first wrote this book for God and for Saint Cuthbert and for all the saints whose relics are on the island.", n: "Aldred's colophon, 10th century, in translation." },
          { h: "The binder", t: "Æthelwald, bishop of the Lindisfarne islanders, pressed it on the outside and covered it, as he well knew how.", n: "The colophon, continued." },
          { h: "The metalworker", t: "Billfrith the anchorite forged the ornaments on the outside and adorned it with gold and gems and gilded silver.", n: "The jewelled cover is lost." },
          { h: "The glossator", t: "Aldred, an unworthy and most miserable priest, glossed it in English between the lines, with the help of God and Saint Cuthbert.", n: "The gloss is the oldest surviving English translation of the Gospels." },
          { h: "The Chi-Rho page", t: "Christi autem generatio", big: true, n: "Matthew 1:18, the birth of Christ, as in the Book of Kells (V21)." },
          { h: "Carpet pages", t: "Pages of pure ornament built on the cross, interlaced birds and beasts filling every space.", n: "Before each Gospel." }
        ]
      },
      study: { manifest: "", rights: "The British Library publishes the complete manuscript in its digitised manuscripts.", external: [ { label: "British Library — the Lindisfarne Gospels", href: "https://www.bl.uk/collection-items/lindisfarne-gospels" } ] }
    },
    {
      id: "v43", slug: "merneptah-stele", status: "published", pending: false,
      era: "02-bronze-age", year: -1208, chapters: ["ch02", "ch07", "ch58", "ch49"],
      title: "The Merneptah Stele", category: "texts",
      source: "vault/v43-merneptah-stele.md",
      held: "Egyptian Museum, Cairo (JE 31408)",
      dated: "c. 1208 BCE",
      summary: "A pharaoh's granite hymn of victory, found by Flinders Petrie in 1896. Of its 28 lines, one names Israel, about 3,200 years ago, the earliest certain mention of Israel anywhere. The hieroglyphs say something precise about what Israel was.",
      artifact: {
        type: "inscription", theme: "granite", title: "The Canaan lines",
        sub: "The closing lines (27–28), in English. Touch each name to see how the scribe classified it.",
        lang: "en", dir: "ltr",
        words: [["Canaan is plundered with every evil;", "Canaan: written with the sign for a foreign land (𓈉)"], ["Ashkelon is carried off;", "Ashkelon: a city, with the foreign-land sign"], ["Gezer is seized;", "Gezer: a city, with the foreign-land sign"], ["Yenoam is made as though it never was;", "Yenoam: a city, with the foreign-land sign"], ["Israel is laid waste, his seed is not;", "Israel: written with the signs for a people (𓌙𓀀𓁐𓏥): throw-stick, man, woman and plural strokes, not the foreign-land sign"], ["Kharu has become a widow for Egypt.", "Kharu (Hurru): Syria-Palestine as a whole"]],
        translation: "The only name in the list classed as a people rather than a land is Israel.",
        hint: "Determinatives are silent signs that tell the reader what kind of thing a word is. Renderings follow standard translations."
      },
      study: { manifest: "", rights: "Photographs of the stele belong to the Egyptian Museum and their photographers.", external: [] }
    },
    {
      id: "v44", slug: "pilate-stone", status: "published", pending: false,
      era: "04-axial-age", year: 30, chapters: ["ch13", "ch16", "ch10"],
      title: "The Pilate Stone", category: "texts",
      source: "vault/v44-pilate-stone.md",
      held: "The Israel Museum, Jerusalem (a replica stands at Caesarea)",
      dated: "c. 26–36 CE",
      summary: "A broken limestone block from Caesarea, reused as a step in the Roman theatre, which names Pontius Pilate as prefect of Judaea. Found in 1961, it is the only inscription from Pilate's lifetime that names him, and it corrected the title later Roman writers gave him.",
      artifact: {
        type: "inscription", theme: "limestone", title: "The inscription",
        sub: "The four surviving lines in Latin. Letters in brackets are restorations; show them to see how much is reconstructed.",
        lang: "la", dir: "ltr",
        words: [["[…]S TIBERIEVM", "a building named for the emperor Tiberius, a 'Tiberieum'; the first word is lost"], ["[…PO]NTIVS PILATVS", "Pontius Pilate"], ["[…PRAEF]ECTVS IVDA[EA]E", "prefect of Judaea: his title in his own time"], ["[…FE]CIT D[E…]", "made, dedicated… (the end is uncertain)"]],
        translation: "…Tiberieum … Pontius Pilate … prefect of Judaea … made/dedicated…",
        disputed: [0, 3], disputedLabel: "Show the uncertain restorations",
        disputedNote: "The first and last lines are the least certain. One proposal restores the first as 'Nautis Tiberieum', a structure for sailors such as a lighthouse; others suggest a temple for the emperor cult."
      },
      study: { manifest: "", rights: "Photographs of the stone belong to the Israel Museum.", external: [] }
    },
    {
      id: "v45", slug: "nebra-sky-disc", status: "published", pending: false,
      era: "02-bronze-age", year: -1600, chapters: ["ch42", "ch46"],
      title: "The Nebra Sky Disc", category: "relics",
      source: "vault/v45-nebra-sky-disc.md",
      held: "State Museum of Prehistory, Halle (Saale), Germany",
      dated: "Buried c. 1600 BCE (Early Bronze Age); a later date was proposed in 2020 and rejected by most specialists",
      summary: "A bronze disc 30 cm across with a gold sun or full moon, a crescent and 32 stars, among them a cluster read as the Pleiades. It was dug up by looters in 1999, recovered in a Swiss police sting in 2002, and altered at least four times in antiquity. It may be the oldest known concrete depiction of the sky.",
      artifact: {
        type: "skydisc", title: "The disc, stage by stage",
        sub: "The disc was changed several times before it was buried. Step through the stages archaeologists have reconstructed.",
        stages: [
          { short: "Sky", t: "Stage 1: sun, moon and stars", s: "the first design", d: "A large gold disc (sun or full moon), a crescent moon and 32 gold stars. Seven stars form a tight group usually identified as the Pleiades." },
          { short: "Horizons", t: "Stage 2: the horizon arcs", s: "added later", d: "Two gold arcs are added at the edges; one star is covered and two are moved. Each arc spans about 82°, close to the angle between the midsummer and midwinter sunsets on the horizon at this latitude." },
          { short: "Boat", t: "Stage 3: the boat", s: "added later", d: "A curved gold band with fine strokes is added at the bottom, often read as a sun-boat, a motif known from Egypt and later Nordic art. The reading is an interpretation." },
          { short: "Holes", t: "Stage 4: the rim pierced", s: "a change of use?", d: "About 39 small holes are punched around the edge, perhaps to fix the disc to something, such as a standard or a textile." },
          { short: "Buried", t: "Stage 5: loss and burial", s: "c. 1600 BCE", d: "One horizon arc has gone. The disc is buried on the Mittelberg hilltop with two swords, two axes, a chisel and spiral bracelets." }
        ],
        hint: "Schematic: the numbers of stars, arcs and holes follow published descriptions, but the star positions here are not traced from the disc."
      },
      study: { manifest: "", rights: "The State Museum of Prehistory in Halle holds the disc and the rights to its photographs.", external: [ { label: "Austrian Academy of Sciences — The Nebra Sky Disc dates from the Early Bronze Age", href: "https://www.oeaw.ac.at/en/news/the-nebra-sky-disc-dates-from-the-early-bronze-age" } ] }
    },
    {
      id: "v46", slug: "piprahwa-relics", status: "published", pending: false,
      era: "04-axial-age", year: -200, chapters: ["ch11", "ch20", "ch49"],
      title: "The Piprahwa Relics", category: "relics",
      source: "vault/v46-piprahwa-relics.md",
      held: "Indian Museum, Kolkata; National Museum, New Delhi; gems returned to India in 2025",
      dated: "Stupa deposit c. 3rd–2nd century BCE or earlier (debated)",
      summary: "Bone fragments, a soapstone urn and some 1,800 gems dug from a stupa in 1898 by a British estate manager. The urn's inscription says the shrine holds relics of the Buddha, or of the Buddha's kinsmen, depending on how it is read. In 2025 India halted a Sotheby's sale of the gems.",
      artifact: {
        type: "inscription", theme: "soapstone", title: "The words around the lid",
        sub: "The urn's inscription in Brahmi letters, given here in transliteration. Touch a word; the key word is the one scholars dispute.",
        lang: "pra", dir: "ltr",
        words: [["sukiti-bhatinaṃ", "of the Sukiti brothers (or 'of the brothers of the well-famed one')"], ["sa-bhaginikanaṃ", "with their sisters"], ["sa-puta-dalanaṃ", "with their sons and wives"], ["iyaṃ", "this"], ["salila-nidhane", "deposit of relics (literally 'bodily-remains deposit')"], ["budhasa", "of the Buddha"], ["bhagavate", "the Blessed One"], ["sakiyanaṃ", "of the Sakyas (the Buddha's clan)"]],
        translation: "This deposit of relics of the Blessed One, the Buddha, is (the pious gift) of the Sakyas, the brothers of Sukiti, with their sisters, sons and wives.",
        disputed: [5, 7], disputedLabel: "Show the disputed reading",
        hint: "Transliteration follows the standard readings published since 1898.",
        disputedNote: "Most read it as relics of the Buddha given by his Sakya kin. Others read 'of the Sakyas, kinsmen of the Buddha': relics of his relatives, not of the Buddha himself."
      },
      study: { manifest: "", rights: "The relics are held by Indian national museums; images belong to them.", external: [] }
    },
    {
      id: "v47", slug: "kensington-runestone", status: "published", pending: false,
      era: "09-modern", year: 1898, chapters: ["ch23"],
      title: "The Kensington Runestone", category: "texts",
      source: "vault/v47-kensington-runestone.md",
      held: "Runestone Museum, Alexandria, Minnesota",
      dated: "Claims 1362; found 1898; judged a modern creation by runologists",
      summary: "A greywacke slab a Swedish immigrant farmer said he found under the roots of a tree in Minnesota in 1898, telling of Norse explorers killed in 1362. Scholars rejected it within months, and its runes and language point to the nineteenth century. It remains a beloved local symbol and a case study in how claims are tested.",
      artifact: {
        type: "timeline", theme: "forgery", title: "How the stone has been tested",
        sub: "The stone's own words in translation (touch each phrase), then its history.",
        lineHead: "The inscription, in the usual translation",
        line: [["8 Goths and 22 Norwegians", "'Goths' for Swedes (Götar) and the mixed party are among the features critics found odd for 1362"], ["on an exploration journey from Vinland to the west.", "Vinland is known from the sagas, which were widely published by the 1800s"], ["We had camp by 2 skerries one day's journey north from this stone.", "The language mixes forms closer to 19th-century Swedish than to 14th-century Norse, runologists say"], ["We were out fishing one day. After we came home we found 10 men red with blood and dead.", ""], ["AVM, save from evil!", "AVM: Ave Maria, 'Hail Mary'"], ["Year 1362", "Written with pentadic number-signs; whether they fit a 14th-century date is argued over"]],
        events: [
          { y: 1898, t: "The find", d: "Olof Öhman reports finding the slab in the roots of an aspen on his farm near Kensington, Minnesota." },
          { y: 1899, t: "First verdict", d: "Scholars in Minnesota and at the university in Christiania (Oslo) pronounce it a modern forgery." },
          { y: 1907, t: "Holand's campaign", d: "Hjalmar Holand buys the stone and spends decades arguing for its authenticity." },
          { y: "1948–49", t: "At the Smithsonian", d: "The stone is exhibited in Washington; scholarly opinion does not change." },
          { y: 1967, t: "The Gran tape", d: "In a recorded interview, the children of Öhman's neighbour John Gran say their father made the stone with Öhman as a hoax. It is hearsay, and supporters dispute it." },
          { y: "2000s", t: "The debate revived", d: "Supporters cite geology and a dotted rune form found in a medieval Gotland text; runologists maintain the language and runes are modern." }
        ]
      },
      study: { manifest: "", rights: "The Runestone Museum in Alexandria displays the stone.", external: [ { label: "MNopedia — Kensington Runestone", href: "https://www.mnhs.org/mnopedia/search/index/thing/kensington-runestone" } ] }
    },
    {
      id: "v48", slug: "great-isaiah-scroll", status: "published", pending: false,
      era: "04-axial-age", year: -125, chapters: ["ch10", "ch07"],
      title: "The Great Isaiah Scroll", category: "manuscripts",
      source: "vault/v48-great-isaiah-scroll.md",
      held: "The Israel Museum, Jerusalem (Shrine of the Book), 1QIsaᵃ",
      dated: "c. 150–100 BCE (palaeography); radiocarbon ranges into the 4th–2nd centuries BCE",
      summary: "The only complete book of the Hebrew Bible among the Dead Sea Scrolls: all 66 chapters of Isaiah in 54 columns on a scroll 7.34 metres long, copied about a thousand years before the oldest complete medieval Hebrew Bibles, and remarkably close to them.",
      artifact: {
        type: "scroll", theme: "parchment", title: "Unroll the Isaiah scroll",
        sub: "Two of its verses in the consonantal Hebrew of the standard text, as a scroll carries them: no vowel signs, read from the right.",
        columns: [
          { kind: "hebrew", heading: "Isaiah 2:4", lines: [[["וכתתו", "they shall beat"], ["חרבותם", "their swords"], ["לאתים", "into ploughshares"]], [["וחניתותיהם", "and their spears"], ["למזמרות", "into pruning hooks"]], [["לא", "not"], ["ישא", "shall lift up"], ["גוי", "nation"], ["אל", "against"], ["גוי", "nation"], ["חרב", "sword"]], [["ולא", "and not"], ["ילמדו", "shall they learn"], ["עוד", "any more"], ["מלחמה", "war"]]],
            translation: "They shall beat their swords into ploughshares and their spears into pruning hooks; nation shall not lift up sword against nation, neither shall they learn war any more.",
            note: "The scroll itself often spells words more fully, adding vowel letters: it writes לוא for לא, for example." },
          { kind: "hebrew", heading: "Isaiah 40:8", lines: [[["יבש", "withers"], ["חציר", "the grass"]], [["נבל", "fades"], ["ציץ", "the flower"]], [["ודבר", "but the word of"], ["אלהינו", "our God"]], [["יקום", "will stand"], ["לעולם", "for ever"]]],
            translation: "The grass withers, the flower fades, but the word of our God will stand for ever.",
            note: "The scroll leaves three blank lines after chapter 33, dividing the book into two halves, a feature scholars have linked to how Isaiah was copied and arranged." }
        ]
      },
      study: { manifest: "", rights: "The Israel Museum publishes high-resolution images of the scroll in its Digital Dead Sea Scrolls project.", external: [ { label: "Israel Museum — the Great Isaiah Scroll", href: "http://dss.collections.imj.org.il/isaiah" } ] }
    },
    {
      id: "v49", slug: "book-of-enoch", status: "published", pending: false,
      era: "04-axial-age", year: -200, chapters: ["ch10", "ch50", "ch60"],
      title: "The Book of Enoch", category: "manuscripts",
      source: "vault/v49-book-of-enoch.md",
      held: "Complete text in Ge'ez manuscripts (Ethiopia and European libraries); Aramaic fragments from Qumran (Israel Antiquities Authority)",
      dated: "Written 3rd century BCE–1st century CE; Qumran fragments c. 200 BCE onwards; Ge'ez manuscripts from the 14th–15th century",
      summary: "The book of the Watchers, the fallen angels who taught forbidden arts, and of Enoch's journeys through the heavens. Quoted in the New Testament's Letter of Jude, dropped by most churches, and preserved whole only in Ethiopia, where it is Scripture.",
      artifact: {
        type: "codex", theme: "vellum", title: "Open the book",
        sub: "Its title in Ge'ez, then the five books it contains.",
        fonts: ["Noto+Sans+Ethiopic"],
        pages: [
          { h: "The title", t: "መጽሐፈ ሄኖክ", lang: "gez", big: true, n: "Mäṣḥafä Henok, 'the Book of Enoch', in the Ge'ez script of Ethiopia." },
          { h: "I · The Book of the Watchers", t: "Chapters 1–36. Angels called Watchers descend, take human wives, father giants and teach metallurgy, sorcery and astrology. Enoch intercedes, and tours the ends of the earth.", n: "The oldest part, 3rd century BCE." },
          { h: "II · The Parables (Similitudes)", t: "Chapters 37–71. Visions of a heavenly figure called the Son of Man, the Chosen One, who judges the kings of the earth.", n: "The only part not found at Qumran; its date is debated." },
          { h: "III · The Astronomical Book", t: "Chapters 72–82. The angel Uriel shows Enoch the courses of sun and moon in a 364-day year.", n: "Perhaps the earliest part of all, and important for the Qumran calendar." },
          { h: "IV · The Dream Visions", t: "Chapters 83–90. The history of Israel told as an allegory of animals: sheep, wolves and a white bull.", n: "The 'Animal Apocalypse', 2nd century BCE." },
          { h: "V · The Epistle of Enoch", t: "Chapters 91–108. Woes on the wicked, blessings on the righteous, and the 'Apocalypse of Weeks', history in ten weeks.", n: "Ends with the birth of Noah." },
          { h: "Quoted in the New Testament", t: "“Behold, the Lord came with ten thousands of his holy ones, to execute judgment on all…”", n: "Jude 14–15, quoting 1 Enoch 1:9." }
        ]
      },
      study: { manifest: "", rights: "Manuscripts are held in Ethiopian churches and monasteries and in European libraries; images belong to their holders.", external: [] }
    },
    {
      id: "v50", slug: "vienna-dioscurides", status: "published", pending: false,
      era: "05-late-antiquity", year: 512, chapters: ["ch60"],
      title: "The Vienna Dioscurides", category: "manuscripts",
      source: "vault/v50-vienna-dioscurides.md",
      held: "Austrian National Library, Vienna (Cod. med. gr. 1)",
      dated: "c. 512 CE, Constantinople",
      summary: "A great illustrated herbal made in Constantinople around 512 for the princess Anicia Juliana, with hundreds of full-page paintings of plants. It passed through Byzantine, Arab, Jewish and Ottoman hands before an emperor's envoy bought it in 1569. In it the mandrake is shown as medicine and as legend.",
      artifact: {
        type: "codex", theme: "vellum", title: "Turn the herbal's pages",
        sub: "The book's famous openings, page by page.",
        pages: [
          { h: "The patron", t: "Anicia Juliana enthroned between Magnanimity and Prudence, with a kneeling figure of the Gratitude of the Arts.", n: "A dedication portrait, among the earliest surviving in any manuscript." },
          { h: "Seven physicians", t: "Two pages of famous physicians of antiquity gathered as in a learned assembly, with Galen at the head.", n: "Medicine as a lineage of authorities." },
          { h: "The mandrake", t: "Discovery (Heuresis) hands Dioscorides a mandrake root; beside it lies a dog, dead.", n: "The legend: the root shrieks when pulled, killing whoever pulls it, so a dog must do it." },
          { h: "The herbal", t: "Plant after plant in full-page paintings, with the Greek text of Dioscorides' De materia medica.", n: "About 383 of some 435 plant pictures survive." },
          { h: "Many hands", t: "Plant names added in Arabic, Hebrew, Turkish and Latin by later readers.", n: "A book used for a thousand years." },
          { h: "1569", t: "Bought in Constantinople for the Habsburg emperor, on the advice of the envoy Ogier Ghiselin de Busbecq.", n: "In Vienna ever since." }
        ]
      },
      study: { manifest: "", rights: "The Austrian National Library publishes the manuscript in its digital collections.", external: [ { label: "UNESCO Memory of the World — Vienna Dioscurides (nomination)", href: "https://media.unesco.org/sites/default/files/webform/mow001/austria_vienna_dioscurides.pdf" } ] }
    },
    {
      id: "v51", slug: "codex-mendoza", status: "published", pending: false,
      era: "08-early-modern", year: 1541, chapters: ["ch43"],
      title: "The Codex Mendoza", category: "manuscripts",
      source: "vault/v51-codex-mendoza.md",
      held: "Bodleian Library, Oxford (MS. Arch. Selden. A. 1)",
      dated: "c. 1541–1553, Mexico City",
      summary: "Painted by Nahua artists for the first viceroy of New Spain, with Spanish notes: the founding of Tenochtitlan, the tribute of the empire, and an Aztec life from birth to old age. Bound for the emperor Charles V, it was seized by French privateers and ended up in Oxford.",
      artifact: {
        type: "codex", theme: "papyrus", title: "Open the codex",
        sub: "Its three parts, page by page.",
        pages: [
          { h: "The founding", t: "An eagle alights on a cactus growing from a stone in a lake divided by canals: the sign of Tenochtitlan.", n: "The frontispiece. The same emblem is on the flag of Mexico today." },
          { h: "Part I · History", t: "The founding in the year 2 House (1325) and the conquests of each ruler down to the Spanish arrival, shown as burning temples of defeated towns.", n: "A burning temple is the Aztec sign for conquest." },
          { h: "Part II · Tribute", t: "Town by town: cloaks, warriors' suits, feathers, jade, cacao, maize, sent to the ruler Motecuhzoma.", n: "Probably copied from an older tribute record." },
          { h: "Part III · A life", t: "A child's naming and education, training for war or for the priesthood, marriage, punishments and old age.", n: "Young men could enter the calmecac, the priests' school." },
          { h: "Seized at sea", t: "The ship carrying it to Spain was taken by French privateers; by 1553 it belonged to the royal cosmographer André Thevet.", n: "His name is written on its pages." },
          { h: "Oxford", t: "It passed through Richard Hakluyt and Samuel Purchas to John Selden, and reached the Bodleian in 1659.", n: "In Oxford ever since." }
        ]
      },
      study: { manifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/2fea788e-2aa2-4f08-b6d9-648c00486220.json", rights: "The Bodleian Libraries publish the complete codex in Digital Bodleian.", external: [ { label: "Digital Bodleian — MS. Arch. Selden. A. 1", href: "https://digital.bodleian.ox.ac.uk/objects/2fea788e-2aa2-4f08-b6d9-648c00486220/" } ] }
    },
    {
      id: "v52", slug: "ishtar-gate", status: "published", pending: false,
      era: "04-axial-age", year: -575, chapters: ["ch03", "ch10"],
      title: "The Ishtar Gate", category: "relics",
      source: "vault/v52-ishtar-gate.md",
      held: "Reconstructed in the Pergamonmuseum, Berlin; panels in other museums; foundations in place at Babylon",
      dated: "c. 575 BCE (reign of Nebuchadnezzar II)",
      summary: "Babylon's northern gate, faced with glazed blue bricks and rows of bulls and dragons, the beasts of the storm god and of Marduk. Through it ran the Processional Way of the New Year festival. Excavated by Robert Koldewey's German expedition in the early 1900s and rebuilt in Berlin.",
      artifact: {
        type: "gate", title: "The gate and its beasts",
        sub: "A schematic of the gate's front. Touch a beast, or the inscription plaque.",
        beasts: {
          bull: { t: "The aurochs (wild bull)", s: "beast of Adad", d: "The storm god Adad's animal. The bulls are shown in relief and in flat glaze, in alternating rows." },
          dragon: { t: "The mušḫuššu (dragon)", s: "beast of Marduk", d: "Scaly, horned, with a serpent's tongue, a lion's forelegs and an eagle's hind claws: the dragon of Marduk, Babylon's god, and of his son Nabu." },
          lion: { t: "The lions of the Processional Way", s: "beast of Ishtar", d: "Along the walls of the road leading to the gate strode about 120 glazed lions, the animal of Ishtar, the goddess the gate was named for." }
        },
        plaque: { t: "The dedication", s: "Nebuchadnezzar's inscription", d: "“I placed wild bulls and ferocious dragons in the gateways and thus adorned them with luxurious splendour so that people might gaze on them in wonder.” (from the standard translation of the plaque)" },
        hint: "Schematic: the numbers and placement of beasts here are illustrative, not a count of the real rows."
      },
      study: { manifest: "", rights: "Photographs of the reconstruction belong to the Staatliche Museen zu Berlin and their photographers.", external: [ { label: "Staatliche Museen zu Berlin — From Fragment to Monument: The Ishtar Gate", href: "https://www.smb.museum/en/exhibitions/detail/from-fragment-to-monument/" } ] }
    },
    {
      id: "v53", slug: "rosetta-stone", status: "published", pending: false,
      era: "04-axial-age", year: -196, chapters: ["ch02", "ch49"],
      title: "The Rosetta Stone", category: "texts",
      source: "vault/v53-rosetta-stone.md",
      held: "British Museum, London (EA 24)",
      dated: "196 BCE",
      summary: "A priestly decree honouring the boy-king Ptolemy V, carved in hieroglyphs, Demotic and Greek. Found by French soldiers in 1799, taken by the British in 1801, and used by Thomas Young and Jean-François Champollion to crack the Egyptian script. Egypt asks for its return.",
      artifact: {
        type: "cartouche", title: "How the name was read",
        sub: "The king's name in the Greek text above, and inside the oval cartouche below. Touch each sign to see how it was matched to a Greek letter.",
        greek: ["Π", "Τ", "Ο", "Λ", "Ε", "Μ", "Α", "Ι", "Ο", "Σ"],
        intro: { t: "The key", s: "a foreign name, spelled out", d: "Egyptian script mostly writes meaning and sound together, but a foreign king's name had to be spelled by sound. That made the cartouches of Ptolemy, and later of Cleopatra, the way in." },
        signs: [
          { glyph: "𓊪", sound: "p", name: "stool", greek: [0], d: "A stool (or mat): p, matching Greek Π." },
          { glyph: "𓏏", sound: "t", name: "loaf of bread", greek: [1], d: "A loaf: t, matching Τ." },
          { glyph: "𓍯", sound: "o / w", name: "lasso", greek: [2], d: "A looped cord, read by Champollion as o, matching Ο." },
          { glyph: "𓃭", sound: "l", name: "lion", greek: [3], d: "A recumbent lion: used for l in foreign names, matching Λ." },
          { glyph: "𓐝", sound: "m", name: "sign for m", greek: [5], d: "m, matching Μ. Egyptian writing leaves most vowels unwritten, so Ε and Α have no sign here." },
          { glyph: "𓇌", sound: "i / y", name: "two reeds", greek: [7], d: "Two reed leaves: i or y, matching Ι." },
          { glyph: "𓋴", sound: "s", name: "folded cloth", greek: [9], d: "A folded cloth: s, matching Σ. Thomas Young had already guessed several of these values; Champollion confirmed them with the name Cleopatra, which shares p, t, o and l." }
        ],
        hint: "The full royal cartouche on the stone adds titles after the name ('living for ever, beloved of Ptah'); only the name is shown here."
      },
      study: { manifest: "", rights: "The British Museum publishes photographs of the stone in its collection database.", external: [ { label: "British Museum — the Rosetta Stone: everything you need to know", href: "https://www.britishmuseum.org/blog/everything-you-ever-wanted-know-about-rosetta-stone" } ] }
    },
    {
      id: "v54", slug: "behistun-inscription", status: "published", pending: false,
      era: "04-axial-age", year: -520, chapters: ["ch06", "ch49"],
      title: "The Behistun Inscription", category: "texts",
      source: "vault/v54-behistun-inscription.md",
      held: "In place: Mount Bisotun, Kermanshah Province, Iran (UNESCO World Heritage Site)",
      dated: "c. 520 BCE",
      summary: "Darius the Great's account of how he seized the Persian throne, carved about 60 metres up a cliff in Old Persian, Elamite and Babylonian, beneath a relief of the king and the winged symbol of Ahuramazda. Copied at great risk by Henry Rawlinson, it opened cuneiform to modern reading.",
      artifact: {
        type: "inscription", theme: "granite", title: "“I am Darius”",
        sub: "The first line of the Old Persian text, in transliteration. Touch a word.",
        lang: "peo", dir: "ltr",
        words: [["adam", "I (am)"], ["Dārayavauš", "Darius"], ["xšāyaθiya vazraka", "the great king"], ["xšāyaθiya xšāyaθiyānām", "king of kings"], ["xšāyaθiya Pārsaiy", "king in Persia"], ["xšāyaθiya dahyūnām", "king of the lands"], ["Vištāspahyā puça", "son of Hystaspes"], ["Aršāmahyā napā", "grandson of Arsames"], ["Haxāmanišiya", "an Achaemenid"]],
        translation: "I am Darius, the great king, king of kings, king in Persia, king of the lands, son of Hystaspes, grandson of Arsames, an Achaemenid.",
        hint: "Transliteration after the standard editions; on the rock it is written in Old Persian cuneiform."
      },
      study: { manifest: "", rights: "Photographs of the monument belong to their photographers.", external: [ { label: "Livius — the Behistun inscription, Persian text", href: "https://www.livius.org/sources/content/behistun-persian-text/behistun-t-01/" } ] }
    },
    {
      id: "v55", slug: "oracle-bones-of-anyang", status: "published", pending: false,
      era: "03-early-iron-age", year: -1200, chapters: ["ch09", "ch49"],
      title: "The Oracle Bones of Anyang", category: "texts",
      source: "vault/v55-oracle-bones-of-anyang.md",
      held: "Institute of History and Philology, Academia Sinica (Taipei); Institute of Archaeology and museums in China; collections worldwide",
      dated: "c. 1250–1050 BCE (late Shang)",
      summary: "Turtle shells and cattle shoulder-blades that Shang kings had cracked in fire to put questions to their ancestors, then had the questions and answers carved beside the cracks. Sold as 'dragon bones' for medicine until 1899, they are the oldest body of Chinese writing.",
      artifact: {
        type: "oracle", title: "Crack the shell",
        sub: "Follow a Shang divination step by step, then read the record carved beside the crack.",
        fonts: ["Noto+Serif+TC:wght@400;600"],
        steps: [
          { button: "Prepare the shell", t: "A prepared plastron", s: "the underside of a turtle shell", d: "The shell is cleaned, polished and cut with rows of hollows on the back, so that heat will crack it in a controlled way." },
          { button: "Apply heat", t: "Heat", s: "a glowing stick in a hollow", d: "The diviner speaks the charge, the question put to the ancestors, and presses a hot brand into a hollow." },
          { button: "Read the crack", t: "The crack", s: "卜 · bu", d: "A crack appears on the front in a shape like 卜, the character that still means 'to divine'. The king reads it as auspicious or not." },
          { button: "Read the record", t: "The record is carved", s: "preface and charge", d: "Engravers cut the date, the diviner's name and the charge beside the crack.", show: 2 },
          { button: "See the outcome", t: "The prognostication", s: "the king's reading", d: "The king's interpretation is added.", show: 3 },
          { button: "Begin again", t: "The verification", s: "what happened", d: "Sometimes the outcome was recorded too. Here the king had said a birth on certain days would be good; the record notes that the child was born later, and that it 'was not good: a girl'. The words show Shang values, not a judgement of this archive.", show: 4 }
        ],
        record: [
          { zh: "甲申卜，㱿貞", en: "Crack-making on day jiashen, Que divined:", note: "the preface: date and diviner" },
          { zh: "婦好娩，嘉", en: "Lady Hao's childbirth will be good.", note: "the charge put to the ancestors" },
          { zh: "王占曰", en: "The king read the cracks and said: if it is on a ding day, it will be good…", note: "the prognostication" },
          { zh: "三旬又一日甲寅娩，不嘉，惟女", en: "Thirty-one days later, on jiayin, she gave birth. It was not good: it was a girl.", note: "the verification" }
        ],
        hint: "A widely cited inscription about Fu Hao, a consort of king Wu Ding; the English follows standard translations. The shell drawing is schematic."
      },
      study: { manifest: "", rights: "Images of oracle bones belong to their holding institutions.", external: [] }
    },
    {
      id: "v56", slug: "phaistos-disc", status: "published", pending: false,
      era: "02-bronze-age", year: -1700, chapters: ["ch08"],
      title: "The Phaistos Disc", category: "relics",
      source: "vault/v56-phaistos-disc.md",
      held: "Heraklion Archaeological Museum, Crete",
      dated: "Usually c. 1850–1600 BCE (Middle Minoan); the dating and even its authenticity have been questioned",
      summary: "A fired clay disc about 16 cm across, found in the Minoan palace of Phaistos in 1908, with 45 different signs pressed into it by stamps in a spiral on both sides: printing, in a sense, three thousand years early. It is unread, and probably unreadable unless more text turns up.",
      artifact: {
        type: "cards", title: "Every attempt to read it",
        sub: "The disc has 241 or 242 stamped signs in 61 groups. Each card is one kind of claimed decipherment; turn it to see how it fares.",
        cardsTitle: "Turn each card",
        cards: [
          { t: "Greek", s: "an early Greek text", d: "Readings as Greek appear regularly. None is accepted, and the disc appears older than the earliest written Greek (Linear B)." },
          { t: "Luwian or Anatolian", s: "a neighbouring language", d: "Proposed from similarities to Anatolian hieroglyphs. Unconfirmed." },
          { t: "A Minoan hymn or prayer", s: "religious text", d: "Some read repeated sign-groups as a refrain. Possible, but the meaning cannot be tested." },
          { t: "A calendar", s: "astronomical", d: "Readings as a calendar or star-list rest on counting signs. Numerology can fit almost any count." },
          { t: "Linear A values", s: "sign comparison", d: "Some signs resemble Linear A, itself undeciphered; borrowing its sound values gives partial words but no proof." },
          { t: "A forgery", s: "Eisenberg, 2008", d: "Argued that the excavator made it. Most scholars reject this; the find is documented and a sealing found in 1955 has a matching sign. A thermoluminescence test, which could settle its age, has not been allowed." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the disc belong to the Heraklion Archaeological Museum.", external: [] }
    },
    {
      id: "v57", slug: "holy-mandylion", status: "published", pending: false,
      era: "05-late-antiquity", year: 544, chapters: ["ch60", "ch22"],
      title: "The Holy Mandylion", category: "relics",
      source: "vault/v57-holy-mandylion.md",
      held: "Claimed by the Holy Face of Genoa (San Bartolomeo degli Armeni) and the Mandylion of the Vatican; the original's fate is unknown",
      dated: "Legend from the 4th century; image attested at Edessa from the 6th; in Constantinople 944–1204",
      summary: "The Image of Edessa: a cloth said to bear Christ's face, not made by human hands, sent to King Abgar of Edessa. The first of the 'true images', carried in triumph to Constantinople in 944 and lost from view after 1204. Two cloths claim to be it, and one theory says it was the Shroud.",
      artifact: {
        type: "timeline", theme: "veil", title: "The image through time",
        sub: "The legend's letter first (touch each phrase), then the documented history.",
        lineHead: "The legend: King Abgar writes to Jesus",
        line: [["Abgar, ruler of Edessa,", "Abgar V, king of Osroene in northern Mesopotamia, in the time of Jesus"], ["to Jesus the good physician…", "The king is ill and asks for healing"], ["come to me and heal my suffering.", "In the earliest version, told by Eusebius c. 325, Jesus replies by letter; no image is mentioned"]],
        events: [
          { y: "c. 325", t: "The letters", d: "Eusebius records an exchange of letters between Abgar and Jesus, from the Edessa archives. No image." },
          { y: "c. 400", t: "A portrait", d: "The Syriac Doctrine of Addai adds a portrait of Jesus painted by the king's envoy." },
          { y: 544, t: "The siege", d: "Writing c. 593, Evagrius says an image 'made by God' saved Edessa from the Persians in 544: the first record of the cloth as miraculous." },
          { y: 944, t: "To Constantinople", d: "The Byzantine army takes the image from Edessa to Constantinople, where it is received with great ceremony on 16 August." },
          { y: 1204, t: "Lost from view", d: "The Fourth Crusade sacks Constantinople; the image's later fate is not documented." },
          { y: "Today", t: "Two claimants", d: "The Holy Face of Genoa and the Mandylion of Rome (Vatican) are each said to be the original. Neither has been scientifically dated." },
          { y: 1978, t: "The Shroud theory", d: "Ian Wilson proposes that the Mandylion was the Shroud of Turin folded to show only the face. Most historians find the case unproven." }
        ]
      },
      study: { manifest: "", rights: "No openly licensed images of the claimants are embedded here.", external: [] }
    },
    {
      id: "v58", slug: "lion-man", status: "published", pending: false,
      era: "01-prehistory", year: -38000, chapters: ["ch41"],
      title: "The Lion Man of Hohlenstein-Stadel", category: "relics",
      source: "vault/v58-lion-man.md",
      held: "Museum Ulm, Germany",
      dated: "c. 41,000–35,000 years old (radiocarbon on the find layer)",
      summary: "A figure 31 cm tall, carved from mammoth ivory, with a cave lion's head on an upright body. Found smashed in a German cave a week before the Second World War and pieced together over seventy years, it is among the oldest known figurative sculptures, and among the oldest images of a being that does not exist in nature.",
      artifact: {
        type: "timeline", theme: "reliquary", title: "Pieced together over seventy years",
        sub: "The figure was found in hundreds of fragments. Follow how it was rebuilt.",
        events: [
          { y: "c. 40,000 BP", t: "Carved", d: "A carver shapes a tusk of mammoth ivory into a lion-headed figure, a task experiments suggest took hundreds of hours. It is laid at the back of the Stadel cave." },
          { y: 1939, t: "Found", d: "On 25 August, the last days of a dig led by Robert Wetzel, geologist Otto Völzing recovers ivory fragments. A week later the war begins; the fragments go to storage in Ulm." },
          { y: 1969, t: "A figure emerges", d: "Archaeologist Joachim Hahn, inventorying the finds, assembles more than 200 fragments into a standing figure with an animal head." },
          { y: "1987–88", t: "More pieces", d: "Further fragments from the old collection are added by Elisabeth Schmid and the head is recognised as a lion's." },
          { y: "2009–12", t: "Back to the cave", d: "New excavations sift the 1939 spoil heaps and recover hundreds more fragments." },
          { y: 2013, t: "Restored", d: "After a full restoration the figure is shown in its most complete form, now 31 cm tall." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the figure belong to Museum Ulm.", external: [ { label: "Museum Ulm — archaeology collection", href: "https://museumulm.de/en/collections/archaeology/" } ] }
    },
    {
      id: "v59", slug: "venus-of-willendorf", status: "published", pending: false,
      era: "01-prehistory", year: -28000, chapters: ["ch41", "ch48"],
      title: "The Venus of Willendorf", category: "relics",
      source: "vault/v59-venus-of-willendorf.md",
      held: "Natural History Museum, Vienna",
      dated: "c. 30,000–25,000 years old (Gravettian)",
      summary: "An 11-centimetre limestone figure of a woman with no face, found beside the Danube in 1908. She is perhaps the most famous image of the Ice Age. The name 'Venus' is a modern joke, and her meaning is unknown. A 2022 scan traced her stone to northern Italy.",
      artifact: {
        type: "cards", title: "What was she?",
        sub: "Each card is one reading of the figure. Turn it to see the evidence for and against.",
        cardsTitle: "Turn each card",
        cards: [
          { t: "A fertility goddess", s: "the classic reading", d: "Widely proposed. The figure stresses breasts, belly and vulva. But no evidence tells us she was a goddess, or worshipped at all." },
          { t: "A 'Mother Goddess' cult", s: "20th-century theory", d: "Linked to a supposed universal prehistoric goddess religion. Most archaeologists now reject a single Ice Age goddess cult (see The Great Goddess, ch48)." },
          { t: "A self-portrait", s: "LeRoy McDermott, 1996", d: "Proposed that women carved their own bodies seen from above, explaining the foreshortening. Suggestive; untestable." },
          { t: "An amulet or charm", s: "for pregnancy or health", d: "Small enough to carry. Possible, and consistent with its wear, but not provable." },
          { t: "An ideal of plenty", s: "survival in the Ice Age", d: "Read as celebrating body fat and abundance in a hard climate. An interpretation, not evidence." },
          { t: "The name 'Venus'", s: "a modern label", d: "Early archaeologists nicknamed such figures after the Roman goddess of love, partly in jest. The name says nothing about their meaning." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the figure belong to the Natural History Museum, Vienna.", external: [ { label: "Scientific Reports (2022) — The microstructure and the origin of the Venus from Willendorf", href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8885675/" } ] }
    },
    {
      id: "v60", slug: "gobekli-tepe", status: "published", pending: false,
      era: "01-prehistory", year: -9500, chapters: ["ch42", "ch41"],
      title: "Göbekli Tepe's Pillars", category: "relics",
      source: "vault/v60-gobekli-tepe.md",
      held: "In place: Göbekli Tepe, Şanlıurfa Province, Turkey (UNESCO World Heritage Site)",
      dated: "c. 9500–8000 BCE (Pre-Pottery Neolithic)",
      summary: "Round enclosures of carved T-shaped pillars, some 5 metres tall, raised by people who had not yet begun to farm. Their foxes, snakes, vultures and belted human figures were hailed as the world's first temple. New work shows people also lived there, and claims about comets and lost civilisations are not supported.",
      artifact: {
        type: "enclosure", title: "An enclosure, seen from above",
        sub: "A schematic plan of Enclosure D: a ring of pillars set in a wall, around two great central pillars. Touch a pillar.",
        ringCount: 11,
        centre: [
          { k: "P18", t: "Pillar 18", s: "central pillar", d: "About 5.5 m tall. The T-shaped top is a head: carved arms reach round the sides, the hands meet above a belt, and a fox pelt hangs from the belt. The pillars are stylised human or superhuman beings." },
          { k: "P31", t: "Pillar 31", s: "central pillar", d: "The twin of Pillar 18, also with arms, hands and belt. The paired central figures have been read as ancestors, spirits or gods; the builders left no text." }
        ],
        named: [
          { at: 2, k: "P43", t: "Pillar 43, 'the Vulture Stone'", s: "in the ring", d: "Carved with a vulture holding a disc, a scorpion, birds and other animals. A 2017 paper read it as a star map recording a comet strike; the excavators and most archaeologists reject that reading." }
        ],
        ring: { t: "A pillar of the ring", s: "set into the enclosure wall", d: "Ring pillars carry reliefs of foxes, boars, snakes, cranes, bulls and other wild animals, many of them dangerous. Why these animals were chosen is unknown." },
        hint: "Schematic: the plan follows published descriptions of Enclosure D, but pillar positions and numbers here are approximate."
      },
      study: { manifest: "", rights: "Photographs of the site belong to the German Archaeological Institute and their photographers.", external: [ { label: "German Archaeological Institute — The Tepe Telegrams blog", href: "https://www.dainst.blog/the-tepe-telegrams/2016/06/02/gobekli-tepe-the-first-20-years-of-research/" } ] }
    },
    {
      id: "v61", slug: "kojiki", status: "published", pending: false,
      era: "07-high-medieval", year: 1371, chapters: ["ch25", "ch46"],
      title: "The Kojiki: the Shinpukuji Manuscript", category: "manuscripts",
      source: "vault/v61-kojiki.md",
      held: "Ōsu Kannon (Shinpukuji), Nagoya, Japan",
      dated: "Text completed 712 CE; oldest manuscript copied 1371–1372",
      summary: "The 'Record of Ancient Matters', presented to the Japanese court in 712: the birth of the gods, Izanagi and Izanami, the sun goddess Amaterasu, and the descent of the emperors. Its oldest surviving copy was made by a monk of Shinpukuji in 1371–72 and is a National Treasure of Japan.",
      artifact: {
        type: "scroll", theme: "paper", title: "Unroll the record",
        sub: "The Kojiki's first words, in the classical Chinese characters it was written in. Read from the right, top to bottom.",
        fonts: ["Noto+Serif+TC:wght@400;600"],
        hint: "Japanese scrolls open from the right. Drag the paper to travel along it, and touch a character-group to read its meaning.",
        columns: [
          { kind: "cjk", heading: "The beginning", lines: [[["天地", "heaven and earth"], ["初發", "first opened"], ["之時", "at the time when"]], [["於", "in"], ["高天原", "Takamanohara, the Plain of High Heaven"], ["成神名", "the deity who came into being was named"]], [["天之御中主神", "Ame-no-minakanushi, Lord of the Centre of Heaven"]]],
            translation: "At the time when heaven and earth first opened, in the Plain of High Heaven there came into being a deity named Ame-no-minakanushi." },
          { kind: "cjk", heading: "The first three", lines: [[["次", "next"], ["高御產巢日神", "Takamimusuhi, the High Generative deity"]], [["次", "next"], ["神產巢日神", "Kamimusuhi, the Divine Generative deity"]], [["此三柱神者", "these three deities"], ["並獨神成坐而", "all came into being alone"], ["隱身也", "and hid their bodies"]]],
            translation: "Next, Takamimusuhi; next, Kamimusuhi. These three deities all came into being alone, and hid their bodies.", note: "Written in Chinese characters, partly used for their sounds to spell Japanese names." }
        ]
      },
      study: { manifest: "", rights: "Images of the Shinpukuji manuscript belong to the temple; facsimiles are published in Japan.", external: [] }
    },
    {
      id: "v62", slug: "inca-khipu", status: "published", pending: false,
      era: "07-high-medieval", year: 1450, chapters: ["ch44"],
      title: "The Inca Khipu", category: "texts",
      source: "vault/v62-inca-khipu.md",
      held: "About 1,000 or more in museums worldwide (Lima, Berlin, New York, Harvard and elsewhere)",
      dated: "Mostly c. 1400–1600 CE; earlier Wari examples c. 600–1000 CE",
      summary: "Bundles of knotted cords that ran the largest empire of the Americas without an alphabet: census counts, tribute, calendars, and, the Spanish said, histories. The numbers were cracked in 1912. Whether some khipus also recorded words remains one of the great open questions of decipherment.",
      artifact: {
        type: "khipu", title: "Read a khipu",
        sub: "An illustrative khipu built on the rules Leland Locke worked out in 1912. Touch or hover over a cord to read its number, then the top cord.",
        intro: { t: "How to read it", s: "knots in decimal places", d: "Each pendant cord holds a number. Knots nearest the main cord are the largest place value. Single knots mark hundreds and tens; the units use a long knot of 2 to 9 turns, or a figure-eight knot for 1. An empty place is zero." },
        cords: [
          { label: "Cord 1", v: 23, col: "#c9b48a" },
          { label: "Cord 2", v: 141, col: "#8a5a34" },
          { label: "Cord 3", v: 8, col: "#b8452a" },
          { label: "Cord 4", v: 1, col: "#e8dcc2" },
          { label: "Cord 5", v: 60, col: "#6b4a2a" },
          { label: "Cord 6", v: 205, col: "#c9b48a" }
        ],
        sumNote: "The top cord rises above the main cord and records the total of the pendants: 438. Locke found exactly this kind of sum cord, which proved that the knots were numbers.",
        hint: "Illustrative: the knot rules are real, but this khipu is not a transcription of any single surviving khipu."
      },
      study: { manifest: "", rights: "Images of khipus belong to their holding museums; the Open Khipu Repository publishes data on many of them.", external: [ { label: "Khipu Field Guide — What's a khipu?", href: "https://khipufieldguide.com/guidebook/Introduction.html" } ] }
    },
    {
      id: "v63", slug: "kalpa-sutra-manuscripts", status: "published", pending: false,
      era: "07-high-medieval", year: 1450, chapters: ["ch52"],
      title: "The Kalpa Sutra Manuscripts", category: "manuscripts",
      source: "vault/v63-kalpa-sutra-manuscripts.md",
      held: "Jain temple libraries (bhandars) in India; museums worldwide (V&A, British Library, others)",
      dated: "Text attributed to Bhadrabahu; illustrated copies mostly 14th–16th century, western India",
      summary: "The Shvetambara Jain scripture of the lives of the Jinas, read aloud each year at Paryushana. From the 14th century it was copied on paper in western India with brilliant miniatures in red, blue and gold, above all the fourteen dreams of Queen Trishala before the birth of Mahavira.",
      artifact: {
        type: "cards", title: "The fourteen dreams",
        sub: "Before Mahavira's birth, Queen Trishala dreamed fourteen auspicious dreams, painted again and again in these manuscripts. Turn each card.",
        cardsTitle: "Turn each dream",
        cards: [
          { t: "1 · An elephant", s: "white, four-tusked", d: "A great white elephant: majesty and strength." },
          { t: "2 · A bull", s: "white", d: "A magnificent white bull." },
          { t: "3 · A lion", s: "", d: "A lion, playful and powerful." },
          { t: "4 · Shri", s: "the goddess of fortune", d: "The goddess Shri (Lakshmi) anointed by elephants." },
          { t: "5 · A garland", s: "of flowers", d: "A garland of fragrant flowers." },
          { t: "6 · The moon", s: "full", d: "The full moon." },
          { t: "7 · The sun", s: "rising", d: "The rising sun." },
          { t: "8 · A banner", s: "on a golden staff", d: "A great banner." },
          { t: "9 · A vase", s: "full and golden", d: "A full vessel of gold." },
          { t: "10 · A lotus lake", s: "", d: "A lake filled with lotuses." },
          { t: "11 · The ocean", s: "of milk", d: "The milky ocean." },
          { t: "12 · A celestial palace", s: "vimana", d: "A palace of the gods." },
          { t: "13 · A heap of jewels", s: "", d: "A heap of precious stones." },
          { t: "14 · A smokeless fire", s: "", d: "A blazing fire without smoke." }
        ]
      },
      study: { manifest: "", rights: "Images belong to the holding libraries and museums; many leaves are published by the V&A and the British Library.", external: [ { label: "V&A — Kalpasutra manuscript page", href: "https://collections.vam.ac.uk/item/O1271072/kalpasutra-manuscript-page-unknown/" } ] }
    },
    {
      id: "v64", slug: "benin-bronzes", status: "published", pending: false,
      era: "08-early-modern", year: 1550, chapters: ["ch33"],
      title: "The Benin Bronzes", category: "relics",
      source: "vault/v64-benin-bronzes.md",
      held: "Dispersed since 1897: British Museum, Berlin, and more than 130 other institutions; returns to Nigeria under way since 2022",
      dated: "Cast c. 13th–19th century; the palace plaques mostly 16th–17th century",
      summary: "Thousands of cast brass plaques, heads and ivory carvings from the royal court of Benin, made for the altars of the Oba's ancestors and for the palace. The British army looted them in 1897 and sold them to museums around the world. Their return is one of the defining restitution cases of our time.",
      artifact: {
        type: "timeline", theme: "reliquary", title: "The bronzes through time",
        sub: "From the royal guild of casters to the return.",
        events: [
          { y: "13th–15th c.", t: "The casting guild", d: "The Igun Eronmwon, the Oba's guild of brass casters, works by the lost-wax method; tradition traces the craft to the reign of Oba Oguola." },
          { y: "16th–17th c.", t: "The palace plaques", d: "Hundreds of brass plaques clad the palace pillars, showing the Oba, chiefs, warriors, rituals and Portuguese traders, whose brass manillas supplied much of the metal." },
          { y: "Each reign", t: "Ancestral altars", d: "Commemorative heads of past Obas are set on royal altars with carved ivory tusks, the centre of the kingdom's ancestor rites." },
          { y: 1897, t: "The punitive expedition", d: "After a British party is killed, a force of about 1,200 takes Benin City, burns it, exiles Oba Ovonramwen and carries off thousands of objects." },
          { y: "1897 on", t: "Sold and scattered", d: "The objects are auctioned to cover costs and enter museums across Europe and America." },
          { y: 2022, t: "Returns begin", d: "Germany signs a joint declaration with Nigeria and hands over the first bronzes; London's Horniman Museum transfers ownership of 72 objects." },
          { y: 2023, t: "The Oba's ownership", d: "A Nigerian presidential declaration recognises the Oba of Benin as owner of returned objects, prompting debate over where they will be kept." }
        ]
      },
      study: { manifest: "", rights: "Images belong to the many holding institutions; the Digital Benin project gathers records of the dispersed collection.", external: [ { label: "British Museum — the Benin Bronzes (contested objects)", href: "https://www.britishmuseum.org/about-us/british-museum-story/contested-objects-collection/benin-bronzes" } ] }
    },
    {
      id: "v65", slug: "gateway-of-the-sun", status: "published", pending: false,
      era: "05-late-antiquity", year: 700, chapters: ["ch44"],
      title: "The Staff God of Tiwanaku", category: "relics",
      source: "vault/v65-gateway-of-the-sun.md",
      held: "In place: Tiwanaku, near Lake Titicaca, Bolivia (UNESCO World Heritage Site)",
      dated: "Tiwanaku flourished c. 500–1000 CE; the gateway's exact date is uncertain",
      summary: "A monolithic gateway of andesite at Tiwanaku, carved with a frontal figure holding two staffs, its head ringed with rays, flanked by rows of winged attendants. The figure belongs to a 'Staff God' tradition running through Andean art for two thousand years. Later writers linked it to the Inca creator Viracocha.",
      artifact: {
        type: "cards", title: "Reading the gateway",
        sub: "What the carving shows, and what has been claimed about it. Turn each card.",
        cardsTitle: "Turn each card",
        cards: [
          { t: "The central figure", s: "the Staff God", d: "A frontal being standing on a stepped platform, holding a staff in each hand, with a rayed head-dress. The pose is documented across the Andes." },
          { t: "The attendants", s: "48 winged figures", d: "Three rows of winged figures, some bird-headed, run or kneel toward the centre, holding staffs." },
          { t: "An older tradition", s: "from Chavín", d: "Staff-holding deities appear much earlier, as on the Raimondi Stela of the Chavín culture of Peru, over a thousand years before Tiwanaku." },
          { t: "Viracocha?", s: "a later identification", d: "Often called Viracocha, the Inca creator, whose myths begin at Lake Titicaca. But Tiwanaku is centuries older than the Inca, and its people's own name for the figure is unknown." },
          { t: "A calendar?", s: "Arthur Posnansky and others", d: "The frieze has been read as a calendar. The counting depends on how the figures are grouped; it is not accepted by most archaeologists." },
          { t: "Moved and broken", s: "the stone's history", d: "The gateway was found cracked and not certainly in its original position; it has been moved and re-erected, which complicates astronomical readings." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the site belong to their photographers.", external: [] }
    },
    {
      id: "v66", slug: "kebra-nagast", status: "published", pending: false,
      era: "07-high-medieval", year: 1320, chapters: ["ch60", "ch40", "ch49"],
      title: "The Kebra Nagast", category: "manuscripts",
      source: "vault/v66-kebra-nagast.md",
      held: "Many Ge'ez manuscripts in Ethiopia and in European libraries (British Library's Magdala collection among them)",
      dated: "Compiled c. 1314–1322 CE; surviving manuscripts mostly later",
      summary: "Ethiopia's 'Glory of the Kings': how the Queen of Sheba visited Solomon, bore his son Menelik, and how Menelik brought the Ark of the Covenant to Aksum. It gave the Solomonic dynasty its legitimacy for 650 years, and it is revered by Rastafari. A copy looted from Magdala was returned to Ethiopia in 1872.",
      artifact: {
        type: "codex", theme: "vellum", title: "Open the book",
        sub: "The story the book tells, and the book's own story.",
        fonts: ["Noto+Sans+Ethiopic"],
        pages: [
          { h: "The title", t: "ክብረ ነገሥት", lang: "gez", big: true, n: "Kəbrä Nägäśt, 'the Glory of the Kings', in Ge'ez." },
          { h: "Makeda", t: "The Queen of Sheba, Makeda, travels to Jerusalem to learn Solomon's wisdom, and turns to the God of Israel.", n: "Expanding 1 Kings 10." },
          { h: "Menelik", t: "She bears Solomon's son, Menelik, who grows up in Ethiopia and returns to Jerusalem to meet his father.", n: "The founder of the dynasty." },
          { h: "The Ark", t: "Menelik returns home with the firstborn sons of Israel's nobles, who bring the Ark of the Covenant with them. The glory of Zion passes to Ethiopia.", n: "Ethiopian tradition holds that the Ark is at Aksum today (see V07)." },
          { h: "c. 1314–1322", t: "Compiled in Ge'ez by Yeshaq, a churchman of Aksum, soon after the Solomonic dynasty took power in 1270.", n: "The colophon says it was translated from Arabic, itself from Coptic; that claim is debated." },
          { h: "1868 · 1872", t: "British troops take manuscripts from the fortress of Magdala. Emperor Yohannes IV asks for this book back, and one copy is returned in 1872.", n: "A rare early restitution." }
        ]
      },
      study: { manifest: "", rights: "Ethiopian manuscripts belong to their churches and libraries; British Library copies are catalogued in its Magdala collection.", external: [] }
    },
    {
      id: "v67", slug: "incantation-bowls", status: "published", pending: false,
      era: "05-late-antiquity", year: 600, chapters: ["ch19", "ch56"],
      title: "The Aramaic Incantation Bowls", category: "texts",
      source: "vault/v67-incantation-bowls.md",
      held: "About 2,000 or more in museums and private collections (Penn Museum, British Museum, Schøyen Collection and others)",
      dated: "c. 5th–7th century CE, Sasanian Mesopotamia",
      summary: "Clay bowls written with spells in a spiral, sometimes around a drawing of a chained demon, and buried upside down under houses to trap evil. Made for Jewish, Christian, Mandaean and pagan clients in Babylonia, they are the everyday magic of the world that produced the Babylonian Talmud.",
      artifact: {
        type: "bowl", title: "A bowl against demons",
        sub: "The opening formula of many Jewish Aramaic bowls, spiralling inward. Touch a word below; then turn the bowl over, as it was buried.",
        lang: "arc",
        spiral: "אסותא מן שמיא לפלוני בר פלונית",
        repeat: 9,
        words: [["אסותא", "healing"], ["מן", "from"], ["שמיא", "heaven"], ["לפלוני", "for N (the client)"], ["בר", "son of"], ["פלונית", "N (his mother)"]],
        translation: "Healing from heaven for N son of N.",
        buried: "Turned face down and buried at a threshold or in a corner of the house: the demons trapped beneath.",
        hint: "Clients were named by their mothers' names, as in many Jewish prayers for the sick. N stands for the names written on real bowls. The drawing is schematic."
      },
      study: { manifest: "", rights: "Images of bowls belong to their holding museums; the origins of many privately held bowls are disputed.", external: [ { label: "British Museum — incantation bowl", href: "https://www.britishmuseum.org/collection/object/W_1851-0903-3" } ] }
    },
    {
      id: "v68", slug: "tjurunga", status: "published", pending: false,
      era: "09-modern", year: 1899, chapters: ["ch61"],
      title: "The Tjurunga of Central Australia", category: "relics",
      source: "vault/v68-tjurunga.md",
      held: "Held by their Arrernte and neighbouring custodians; many collected examples in museums (Strehlow Research Centre, Alice Springs, and elsewhere), with restricted access and returns under way",
      dated: "Kept over many generations; most museum examples collected c. 1890s–1960s",
      summary: "Sacred boards and stones of the Arrernte and their neighbours, which embody ancestral beings of the Dreaming and are seen only by those entitled to see them. Collectors took thousands into museums, and European thinkers built theories of religion on them. This entry tells their history but shows none of them.",
      artifact: {
        type: "timeline", theme: "reliquary", title: "A history without pictures",
        sub: "Tjurunga may be seen only by those with the right to see them, so this archive shows none. Follow instead how they left their Country, and how they are going back.",
        events: [
          { y: "Ancestral time", t: "Held on Country", d: "In Arrernte belief, tjurunga carry the power of ancestral beings of the Altyerre, the Dreaming, and are bound to particular places, songs and people. They are kept hidden and shown only in ceremony, to those entitled." },
          { y: 1896, t: "The ceremonies watched", d: "At the Alice Springs telegraph station, Arrernte men perform a long cycle of ceremonies before the biologist Baldwin Spencer and the telegraph master Francis Gillen." },
          { y: 1899, t: "Published", d: "Spencer and Gillen's The Native Tribes of Central Australia describes tjurunga ('churinga') in detail, with photographs. Many such images are now regarded as restricted." },
          { y: 1912, t: "Into theory", d: "Émile Durkheim builds his account of the sacred and of totemism in The Elementary Forms of Religious Life largely on the Arrernte evidence of Spencer, Gillen and the missionary Carl Strehlow." },
          { y: "1930s–1970s", t: "The Strehlow collection", d: "Carl Strehlow's son, the linguist T. G. H. Strehlow, records songs and ceremonies and receives many tjurunga from senior men, a collection that became the subject of long and bitter dispute." },
          { y: "Today", t: "Going home", d: "The collection is held by the Strehlow Research Centre in Alice Springs under restricted access, and Australian and overseas museums are returning secret-sacred objects to their communities." }
        ]
      },
      study: { manifest: "", rights: "Tjurunga are secret-sacred. By the wishes of their custodians this archive reproduces no image of them.", external: [ { label: "Strehlow Research Centre (Northern Territory Government)", href: "https://nt.gov.au/leisure/arts-culture-heritage/organisations-and-venues/museums-galleries-art-centres/alice-springs/strehlow-research-centre" } ] }
    },
    {
      id: "v69", slug: "kumulipo", status: "published", pending: false,
      era: "09-modern", year: 1889, chapters: ["ch63", "ch46"],
      title: "The Kumulipo", category: "texts",
      source: "vault/v69-kumulipo.md",
      held: "Printed for King Kalākaua in 1889; Queen Liliʻuokalani's English translation published in 1897",
      dated: "Composed in the 18th century for the chief Kalaninuiamamao; first printed 1889",
      summary: "A Hawaiian creation chant of 2,102 lines in sixteen ages, from the first night and the birth of the coral polyp to the gods and the chiefs. Composed in honour of an 18th-century chief, printed by King Kalākaua in 1889, and translated by the deposed Queen Liliʻuokalani while she was held prisoner.",
      artifact: {
        type: "scroll", theme: "paper", dir: "ltr", title: "The first night",
        sub: "The opening lines of the Kumulipo in Hawaiian, with Queen Liliʻuokalani's 1897 translation. Touch a line to read it.",
        hint: "Drag the paper to travel along it, and touch a line to read its meaning. The spelling follows the printed text, without modern diacritics.",
        columns: [
          { kind: "latin", lang: "haw", heading: "The earth becomes hot", lines: [
            [["O ke au i kahuli wela ka honua", "At the time when the earth became hot"]],
            [["O ke au i kahuli lole ka lani", "At the time when the heavens turned about"]],
            [["O ke au i kukaiaka ka la", "At the time when the sun was darkened"]],
            [["E hoomalamalama i ka malama", "To cause the moon to shine"]],
            [["O ke au o Makalii ka po", "The time of the rise of the Pleiades"]],
            [["O ka walewale hookumu honua ia", "The slime, this was the source of the earth"]]
          ], translation: "At the time when the earth became hot, when the heavens turned about, when the sun was darkened to cause the moon to shine, the time of the rise of the Pleiades: the slime, this was the source of the earth." },
          { kind: "latin", lang: "haw", heading: "Darkness", lines: [
            [["O ke kumu o ka lipo, i lipo ai", "The source of the darkness that made darkness"]],
            [["O ke kumu o ka Po, i po ai", "The source of the night that made night"]],
            [["O ka lipolipo, o ka lipolipo", "The intense darkness, the deep darkness"]],
            [["O ka lipo o ka la, o ka lipo o ka po", "Darkness of the sun, darkness of the night"]],
            [["Po wale hoi", "Nothing but night"]]
          ], translation: "The source of the darkness that made darkness, the source of the night that made night; the intense darkness, the deep darkness; darkness of the sun, darkness of the night: nothing but night." },
          { kind: "latin", lang: "haw", heading: "The night gives birth", lines: [
            [["Hanau ka po", "The night gave birth"]],
            [["Hanau Kumulipo i ka po, he kane", "Born was Kumulipo in the night, a male"]],
            [["Hanau Poele i ka po, he wahine", "Born was Poʻele in the night, a female"]],
            [["Hanau ka Uku-koakoa, hanau kana, he Akoakoa, puka", "Born was the coral polyp, born was the coral, came forth"]]
          ], translation: "The night gave birth: born was Kumulipo ('source of deep darkness') in the night, a male; born was Poʻele ('dark night') in the night, a female. Born was the coral polyp; born was the coral; it came forth.",
            note: "The first living thing born in the chant is the coral polyp. The first age goes on to the creatures of the sea and the plants of the land." }
        ]
      },
      study: { manifest: "", rights: "The 1889 Hawaiian text and Liliʻuokalani's 1897 translation are in the public domain.", external: [ { label: "Liliʻuokalani's translation (Internet Sacred Text Archive)", href: "https://sacred-texts.com/pac/lku/index.htm" }, { label: "Kumulipo, Hawaiian text and translation (Kamehameha Schools)", href: "https://blogs.ksbe.edu/adakina/files/2008/02/kumulipo-text.pdf" } ] }
    },
    {
      id: "v70", slug: "pictish-stones", status: "published", pending: false,
      era: "06-early-medieval", year: 650, chapters: ["ch14", "ch22"],
      title: "The Pictish Stones", category: "relics",
      source: "vault/v70-pictish-stones.md",
      held: "About 350 carved stones and objects, mostly in north-east Scotland (Aberlemno in place; Meigle Museum; the Museum of Scotland and others)",
      dated: "c. 6th–9th century CE",
      summary: "Standing stones of the Picts of early medieval Scotland, carved with a small set of symbols repeated across the country: crescents crossed by broken rods, double discs, combs and mirrors, and a strange beast no one can identify. Later stones add the Christian cross. What the symbols mean, and whether they are writing, is unknown.",
      artifact: {
        type: "cards", title: "Reading the symbols",
        sub: "The same few symbols recur on stones across Pictland. Turn each card to see what is known, and what has been claimed.",
        cardsTitle: "Turn each card",
        cards: [
          { t: "Crescent and V-rod", s: "the most common symbol", d: "A crescent crossed by a rod bent in a V, often with floral ends. It appears on stones and on silver objects. Its meaning is unknown." },
          { t: "Double disc and Z-rod", s: "two circles joined", d: "Two discs joined by a bar and crossed by a rod bent like a Z. Common, often paired with the crescent. Unexplained." },
          { t: "The Pictish Beast", s: "an unknown animal", d: "A creature with a long snout, a curling crest and scrolled feet, drawn with great consistency. It has been read as a dolphin, a water-horse or a mythical beast; none is proven." },
          { t: "Mirror and comb", s: "often at the bottom", d: "Often added below other symbols. It has been read as marking a woman, or a status. The reading is debated." },
          { t: "Class I, II and III", s: "Allen and Anderson, 1903", d: "Class I: symbols on undressed stones. Class II: symbols with a carved Christian cross on dressed slabs. Class III: crosses without the symbols. The classes roughly follow the conversion of the Picts." },
          { t: "A written language?", s: "Lee, Jonathan and Ziman, 2010", d: "A statistical study argued that the symbols behave like a writing system. The linguist Richard Sproat and others argued that such tests cannot tell writing from other symbol systems. It remains open." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the stones belong to their holders and photographers.", external: [ { label: "Lee, Jonathan and Ziman, 'Pictish symbols revealed as a written language' (2010)", href: "https://royalsocietypublishing.org/doi/10.1098/rspa.2010.0041" } ] }
    },
    {
      id: "v71", slug: "stecci", status: "published", pending: false,
      era: "07-high-medieval", year: 1400, chapters: ["ch60", "ch17"],
      title: "The Stećci: Medieval Tombstones of Bosnia", category: "relics",
      source: "vault/v71-stecci.md",
      held: "In place: about 70,000 at some 3,300 sites in Bosnia and Herzegovina, Croatia, Montenegro and Serbia (28 sites a UNESCO World Heritage Site)",
      dated: "12th–16th century CE, most from the 14th–15th",
      summary: "Great carved gravestones of medieval Bosnia and its neighbours, shaped as slabs, chests and gabled houses, carved with spirals, crescents, hunts, circle dances and a man with a raised hand. Long called the tombstones of the dualist Bogomil heretics, they were in fact raised by Catholic, Orthodox and Bosnian Church Christians alike.",
      artifact: {
        type: "cards", title: "What the stones show",
        sub: "The main motifs carved on the stećci, and the myth that grew around them. Turn each card.",
        cardsTitle: "Turn each card",
        cards: [
          { t: "The raised hand", s: "the best-known figure", d: "A man with an oversized open right hand, famously at Radimlja near Stolac. Read as a greeting, an oath or a mark of rank. Its meaning is not recorded." },
          { t: "Spirals, rosettes and vines", s: "ornament", d: "Running spirals, rosettes and vine scrolls, shared with the wider art of the medieval Balkans." },
          { t: "Crescent and star", s: "sky signs", d: "Crescents, stars and discs. Sometimes read as heavenly or even Islamic symbols, but they appear on stones from before the Ottoman conquest." },
          { t: "The hunt and the kolo", s: "scenes of life", d: "Hunters with dogs and deer, tournaments, and the kolo, the circle dance still danced in the region. Perhaps scenes of life, perhaps of funeral rites." },
          { t: "Inscriptions", s: "in Bosnian Cyrillic", d: "A minority carry epitaphs in bosančica, the Bosnian Cyrillic script, naming the dead, their families and the stone-carvers." },
          { t: "'Bogomil tombstones'", s: "a 19th-century idea", d: "Once attributed to the dualist Bogomils. Modern scholarship and UNESCO describe them as used across the region's Christian communities: Catholic, Orthodox and the Bosnian Church." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the stones belong to their photographers.", external: [ { label: "UNESCO — Stećci Medieval Tombstone Graveyards", href: "https://whc.unesco.org/en/list/1504/" } ] }
    },
    {
      id: "v72", slug: "book-of-shadows", status: "published", pending: false,
      era: "09-modern", year: 1949, chapters: ["ch38"],
      title: "The Book of Shadows", category: "manuscripts",
      source: "vault/v72-book-of-shadows.md",
      held: "Gerald Gardner's own manuscripts in private hands; copied by hand by generations of initiates",
      dated: "Begun c. 1946–1949 as 'Ye Bok of ye Art Magical'; revised through the 1950s",
      summary: "The handwritten ritual book of Gerald Gardner's witchcraft, copied by each new initiate, and the founding scripture of Wicca. Gardner presented its rites as those of a surviving ancient witch cult; historians have traced them to twentieth-century sources, from Crowley to folklore, and to Doreen Valiente's poetry.",
      artifact: {
        type: "timeline", theme: "reliquary", title: "The making of a book",
        sub: "How a private notebook became the scripture of a new religion.",
        events: [
          { y: 1939, t: "The claimed initiation", d: "Gardner later said he was initiated this year into a coven in the New Forest. Whether such a coven existed, and what it practised, is debated." },
          { y: "c. 1946–49", t: "Ye Bok of ye Art Magical", d: "Gardner writes rituals, charms and notes in a leather-bound notebook in mock-archaic spelling, drawing on Crowley, ceremonial magic and folklore." },
          { y: 1951, t: "The law repealed", d: "England's Witchcraft Act of 1735 is replaced by the Fraudulent Mediums Act. Gardner begins to publicise his witchcraft." },
          { y: 1953, t: "Doreen Valiente", d: "Valiente is initiated. She persuades Gardner to cut much of the Crowley material and rewrites key texts, including the Charge of the Goddess, in her own words." },
          { y: 1954, t: "Witchcraft Today", d: "Gardner's book presents the witch cult to the public. The Book of Shadows itself remains secret, copied by hand by each initiate." },
          { y: 1964, t: "The Rede", d: "Valiente speaks the couplet 'Eight words the Wiccan Rede fulfil: an it harm none, do what ye will', the best-known form of Wicca's ethic." },
          { y: 1999, t: "The historians' verdict", d: "Ronald Hutton's The Triumph of the Moon traces Wicca's sources and treats it as a new religion of the twentieth century." }
        ]
      },
      study: { manifest: "", rights: "Gardnerian Books of Shadows are oath-bound; published versions differ and are not reproduced here.", external: [ { label: "The Doreen Valiente Foundation", href: "https://www.doreenvaliente.org/" } ] }
    },
    {
      id: "v73", slug: "book-of-the-law", status: "published", pending: false,
      era: "09-modern", year: 1904, chapters: ["ch37"],
      title: "The Book of the Law", category: "manuscripts",
      source: "vault/v73-book-of-the-law.md",
      held: "The handwritten manuscript survives in private hands; facsimiles have been published since 1938",
      dated: "Written in Cairo on 8, 9 and 10 April 1904",
      summary: "Sixty-five handwritten pages that Aleister Crowley said were dictated to him in a Cairo hotel in April 1904 by a being called Aiwass, and the scripture of his religion, Thelema: 'Do what thou wilt shall be the whole of the Law.' The manuscript was lost and found again five years later in his attic, behind a pair of skis.",
      artifact: {
        type: "codex", theme: "vellum", title: "Open the book",
        sub: "Three days, three voices, and the objects around them.",
        pages: [
          { h: "Liber AL vel Legis", t: "The Book of the Law, sub figura CCXX", big: true, n: "Its Latin title; 'AL' is also read as a Hebrew word for God, and CCXX (220) is the number of its verses." },
          { h: "The stele", t: "In March 1904 Crowley's wife Rose led him to a painted funerary stele of the Egyptian priest Ankh-ef-en-Khonsu in the Cairo museum. Its inventory number was 666.", n: "Crowley called it the Stele of Revealing." },
          { h: "8 April · Nuit", t: "\"Every man and every woman is a star.\"", n: "Chapter I, spoken by Nuit, goddess of the night sky (I:3)." },
          { h: "9 April · Hadit", t: "The second chapter speaks as Hadit, the point at the centre of Nuit's infinite circle.", n: "Chapter II." },
          { h: "10 April · Ra-Hoor-Khuit", t: "The third chapter speaks as Ra-Hoor-Khuit, a warlike form of Horus, announcing a new age, the Aeon of Horus.", n: "Chapter III." },
          { h: "The Law", t: "\"Do what thou wilt shall be the whole of the Law.\" · \"Love is the law, love under will.\"", n: "I:40 and I:57." },
          { h: "1909", t: "The lost manuscript is found in the attic of Boleskine House in Scotland while Crowley is looking for his skis. It is printed that year.", n: "The book's own story of its survival." }
        ]
      },
      study: { manifest: "", rights: "The manuscript belongs to its holders; the 1904 text is widely published.", external: [ { label: "Liber Legis (Hermetic Library)", href: "https://hermetic.com/legis/index" } ] }
    },
    {
      id: "v74", slug: "satanic-bible", status: "published", pending: false,
      era: "09-modern", year: 1969, chapters: ["ch39"],
      title: "The Satanic Bible", category: "texts",
      source: "vault/v74-satanic-bible.md",
      held: "Published by Avon Books, New York, 1969; in print ever since",
      dated: "Published December 1969",
      summary: "Anton LaVey's book of 1969, the founding text of the Church of Satan: an atheist philosophy of self-interest, indulgence and personal responsibility, in which Satan is a symbol, not a being. It borrows heavily from an 1896 tract and from John Dee's Enochian calls, and it remains in print.",
      artifact: {
        type: "cards", title: "Inside the book",
        sub: "Its four books, its principles, and its sources. Turn each card.",
        cardsTitle: "Turn each card",
        cards: [
          { t: "The Book of Satan", s: "Fire", d: "A fierce prose poem attacking conventional morality. Most of it is adapted from Might Is Right (1896), by the pseudonymous 'Ragnar Redbeard'." },
          { t: "The Book of Lucifer", s: "Air", d: "LaVey's essays: Satan as a symbol of human nature, indulgence instead of abstinence, and a critique of Christianity." },
          { t: "The Book of Belial", s: "Earth", d: "LaVey's account of ritual and 'greater magic', treated as a psychological tool." },
          { t: "The Book of Leviathan", s: "Water", d: "Invocations and the Enochian calls of the Elizabethan magus John Dee, taken from Crowley's printing and rewritten with Satanic wording." },
          { t: "The Nine Satanic Statements", s: "the opening creed", d: "Nine short statements beginning 'Satan represents indulgence instead of abstinence', the most-quoted part of the book." },
          { t: "Satan as symbol", s: "an atheist religion", d: "LaVey did not worship a literal devil. The Church of Satan describes itself as atheistic; Satan stands for pride, carnality and rebellion." }
        ]
      },
      study: { manifest: "", rights: "The Satanic Bible is in copyright; only brief phrases are quoted.", external: [ { label: "Church of Satan — 'Anton LaVey and the Right of Might'", href: "https://churchofsatan.com/anton-lavey-and-the-right-of-might/" } ] }
    },
    {
      id: "v75", slug: "golden-plates", status: "published", pending: false,
      era: "09-modern", year: 1827, chapters: ["ch35"],
      title: "The Golden Plates", category: "relics",
      source: "vault/v75-golden-plates.md",
      held: "Not held: Joseph Smith said he returned them to the angel Moroni. The manuscripts of the Book of Mormon are held by the Church of Jesus Christ of Latter-day Saints",
      dated: "Obtained, by Joseph Smith's account, on 22 September 1827",
      summary: "Metal plates engraved in 'reformed Egyptian' that Joseph Smith said an angel led him to in a hill in western New York, and from which he dictated the Book of Mormon, published in 1830. Eleven witnesses signed statements that they had seen them. No one else has, and their existence and nature are matters of faith and debate.",
      artifact: {
        type: "timeline", theme: "reliquary", title: "From the hill to the book",
        sub: "The plates' story as the historical record tells it: what Smith and the witnesses said, and what survives.",
        events: [
          { y: 1823, t: "The angel", d: "Smith said the angel Moroni appeared to him on the night of 21–22 September and told him of a record buried in a nearby hill." },
          { y: 1827, t: "The plates", d: "On 22 September, by his account, Smith received the plates, with instruments for translating them. He said he was forbidden to show them." },
          { y: 1828, t: "The characters", d: "Martin Harris takes a sheet of characters copied from the plates to the classicist Charles Anthon in New York. Harris said Anthon confirmed them; Anthon later wrote that he had called them a hoax." },
          { y: 1828, t: "The lost pages", d: "The first 116 manuscript pages of the translation, lent to Harris, are lost and never found." },
          { y: 1829, t: "The witnesses", d: "Three witnesses state that an angel showed them the plates; eight more state that Smith showed them and they handled them. Their statements are printed in the book." },
          { y: 1830, t: "The Book of Mormon", d: "Printed in March by E. B. Grandin at Palmyra, New York. Smith said the plates were then returned to the angel." },
          { y: 2017, t: "The manuscript", d: "The Church of Jesus Christ of Latter-day Saints buys the printer's manuscript from the Community of Christ for $35 million." }
        ]
      },
      study: { manifest: "", rights: "No plates exist to photograph. Book of Mormon manuscripts are published by the Joseph Smith Papers project.", external: [ { label: "The Church of Jesus Christ of Latter-day Saints — Gold Plates", href: "https://www.churchofjesuschrist.org/study/history/topics/gold-plates?lang=eng" }, { label: "The Joseph Smith Papers", href: "https://www.josephsmithpapers.org/" } ] }
    },
    {
      id: "v76", slug: "bab-star-tablet", status: "published", pending: false,
      era: "09-modern", year: 1848, chapters: ["ch65"],
      title: "The Báb's Star Tablet", category: "manuscripts",
      source: "vault/v76-bab-star-tablet.md",
      held: "British Library, London (Or. 6887), among other star tablets of the Báb",
      dated: "Written between 1844 and 1850, the years of the Báb's mission",
      summary: "A tablet in the Báb's own hand, its lines of Arabic writing laid out as a five-pointed star, the haykal or 'temple', whose points stand for the head, hands and feet of the human body. The Báb, the forerunner of the Bahá'í Faith, wrote such stars as talismans, full of letter-numbers and derivatives of the word Bahá, 'glory'.",
      artifact: {
        type: "haykal", title: "A star of writing",
        sub: "A schematic star tablet. Show the human form it stands for, then read its numbers.",
        phrase: "بسم الله الأبهى · بهاء · أبهى · بهيّ ·", repeat: 5,
        words: [["بسم", "in the name of"], ["الله", "God"], ["الأبهى", "the Most Glorious"], ["بهاء", "Bahá: glory"], ["أبهى", "abhá: most glorious"], ["بهيّ", "bahí: glorious"]],
        body: ["head", "hand", "foot", "foot", "hand"],
        intro: { t: "The haykal", s: "'temple'", d: "The Báb wrote some tablets in the shape of a five-pointed star, which he called the haykal, 'temple'. Its lines are made of writing, not ink rules." },
        form: { t: "The human form", s: "head, hands and feet", d: "The five points stand for the head, the two hands and the two feet: the star is a body, a temple of the spirit. The Báb said such stars should be carried by men; for women he gave a design of circles." },
        numbers: { t: "Huwa: 'He'", s: "5 and 6", d: "In the abjad system each Arabic letter has a number. Five lines make the star, and five is the letter hā' (ه). Together they enclose six chambers, and six is wāw (و). Hā' and wāw spell huwa (هو), 'He': God.",
          lines: "Five lines make the frame of the star. Five is the value of the letter hā' (ه).", chambers: "The five lines enclose six chambers: five points and the pentagon at the centre. Six is the value of the letter wāw (و)." },
        hint: "Schematic: the lines repeat an invocation and derivatives of the word Bahá, in the manner of the star tablets. It is not a transcription of the British Library tablet. No image of the Báb is shown, in keeping with Bahá'í practice."
      },
      study: { manifest: "", rights: "The tablet belongs to the British Library.", external: [ { label: "Bahá'í World News Service — British Library marks the bicentenary", href: "https://news.bahai.org/story/1358/" }, { label: "The significance of the Báb's Star Tablet", href: "https://bicentenary.bahai.org/the-bab/cards/article-significance-of-the-babs-star-tablet/" } ] }
    },
    {
      id: "v77", slug: "haitian-veve", status: "published", pending: false,
      era: "09-modern", year: 1900, chapters: ["ch40", "ch33"],
      title: "The Haitian Vèvè", category: "texts",
      source: "vault/v77-haitian-veve.md",
      held: "Drawn anew for each ceremony and effaced during it; recorded in published collections such as Milo Rigaud's Vè-Vè (1974)",
      dated: "A living practice; documented from the 19th and 20th centuries",
      summary: "Designs traced on the temple floor in cornmeal, flour or ash by a Vodou priest or priestess to call a particular lwa, or spirit: a cross and cane for Legba, serpents for Damballa, a heart for Ezili. Each is made to be danced over and erased. Their origins in Kongo and Fon sign-traditions are still being traced.",
      artifact: {
        type: "veve", title: "Traced in cornmeal",
        sub: "Choose a lwa and watch its vèvè drawn on the earthen floor.",
        lwa: [
          { k: "legba", name: "Legba", s: "keeper of the gate", d: "Legba's vèvè is drawn first, to open the way between the living and the lwa. Its cross marks the crossroads; the cane is the old man's crutch." },
          { k: "damballa", name: "Damballa", s: "the serpent", d: "Damballa, the great serpent of the sky and waters, often paired with his wife Ayida-Wedo, the rainbow. His vèvè shows serpents rising around a pole or an egg." },
          { k: "ezili", name: "Ezili Freda", s: "love and luxury", d: "Ezili Freda's vèvè is a heart, often filled with a lattice. The fierce Ezili Dantor's heart is pierced by a knife." },
          { k: "baron", name: "Baron Samedi", s: "lord of the cemetery", d: "The Baron's vèvè raises a cross on a stepped tomb: he is the first man buried in every cemetery and head of the Gede spirits of the dead." }
        ],
        hint: "Schematic: vèvè differ from house to house and priest to priest. These follow common published forms and are not copies of any one drawing."
      },
      study: { manifest: "", rights: "Vèvè are sacred designs of a living religion; photographs of ceremonies belong to their participants.", external: [ { label: "Visit Haiti — a visual guide to vèvè", href: "https://visithaiti.com/art-culture/veve-vodou-symbols-cosmograms/" } ] }
    },
    {
      id: "v78", slug: "malleus-maleficarum", status: "published", pending: false,
      era: "08-early-modern", year: 1486, chapters: ["ch32", "ch31"],
      title: "The Malleus Maleficarum", category: "texts",
      source: "vault/v78-malleus-maleficarum.md",
      held: "Printed at Speyer in 1486 and reprinted many times; copies in many libraries",
      dated: "Written by the Dominican Heinrich Kramer (Institoris), first printed 1486",
      summary: "The 'Hammer of Witches', a Latin handbook on identifying, trying and punishing witches, written by the inquisitor Heinrich Kramer after a failed witch trial at Innsbruck. How much it was actually used in the trials, and how far Jacob Sprenger contributed, are both debated.",
      artifact: {
        type: "timeline", theme: "grimoire", title: "The hammer through time",
        sub: "From a failed trial to a book reprinted for two centuries. Move through the documented history.",
        events: [
          { y: 1484, t: "The papal bull", d: "Innocent VIII's Summis desiderantes affectibus backs Kramer's inquisitions in Germany. It was later printed at the front of the Malleus." },
          { y: 1485, t: "Innsbruck", d: "Kramer's witch trial at Innsbruck collapses; the local bishop orders him out. He writes the Malleus soon afterwards." },
          { y: 1486, t: "First printing", d: "Printed at Speyer. Its three parts argue that witchcraft is real, describe the witches' deeds and set out how to try them." },
          { y: 1487, t: "The approbations", d: "Printed with the bull at the front and a Cologne theology faculty approval that most historians think Kramer manipulated or partly forged." },
          { y: 1519, t: "Sprenger named", d: "Jacob Sprenger appears as co-author. How much, if anything, he contributed is contested." },
          { y: 1520, t: "First wave", d: "Some thirteen or fourteen editions have been printed." },
          { y: 1538, t: "A warning from Spain", d: "The Spanish Inquisition tells its judges not to believe everything the book says." },
          { y: 1669, t: "Second wave", d: "A new burst of editions runs from 1574 to 1669, during the great trial waves. How far the book caused trials is debated." }
        ]
      },
      study: { manifest: "", rights: "Early printed copies belong to their holding libraries.", external: [] }
    },
    {
      id: "v79", slug: "zohar-mantua", status: "published", pending: false,
      era: "08-early-modern", year: 1558, chapters: ["ch26", "ch19"],
      title: "The Zohar, First Printings", category: "texts",
      source: "vault/v79-zohar-mantua.md",
      held: "Copies of the Mantua and Cremona editions in Jewish and national libraries",
      dated: "Printed at Mantua and Cremona, 1558–1560; the Zohar itself first circulated in Castile in the 1280s",
      summary: "Kabbalah's great book was printed for the first time in two rival Italian editions, Mantua in three volumes and Cremona in one folio, over the protests of rabbis who thought secret lore should stay in manuscript. The Mantua pagination is still used to cite the Zohar today.",
      artifact: {
        type: "codex", theme: "vellum", title: "Open the Mantua Zohar",
        sub: "Turn the pages for the opening homily, the fight over printing it and the question of who wrote it.",
        pages: [
          { h: "Zohar 1:1a · the opening", t: "Rabbi Ḥizkiyah opened: 'Like a rose among thorns.'", big: true, n: "Song of Songs 2:2. The Mantua folio numbers (here 1a) remain the standard way to cite the book." },
          { h: "The rose", t: "Thirteen petals, read as the thirteen attributes of mercy; red and white, judgment and mercy.", n: "This archive's summary of the homily." },
          { h: "1558 · the objection", t: "Kabbalah should pass from master to disciple, not be sold to anyone who can read.", n: "The case made by opponents of the printing." },
          { h: "1558 · the reply", t: "Isaac de Lattes's responsum, printed in the Mantua edition, defends publication.", n: "Mantua: Meir ben Ephraim and Jacob ben Naphtali. Cremona: Vincenzo Conti." },
          { h: "Who wrote it?", t: "Tradition: Shimon bar Yoḥai, second century. Scholem: Moses de León, Castile, 1280s. Recent work: a circle of authors.", n: "The question is treated in the entry below." }
        ]
      },
      study: { manifest: "", rights: "Printed copies belong to their holding libraries.", external: [] }
    },
    {
      id: "v80", slug: "sefer-yetzirah", status: "published", pending: false,
      era: "05-late-antiquity", year: 400, chapters: ["ch26", "ch19"],
      title: "The Sefer Yetzirah", category: "texts",
      source: "vault/v80-sefer-yetzirah.md",
      held: "Known from medieval manuscripts in three recensions",
      dated: "Date disputed: late antiquity to the early Islamic period; commented on by the 10th century",
      summary: "A very short Hebrew book describing creation through 'thirty-two wondrous paths': ten sefirot and the twenty-two letters, divided into three mothers, seven doubles and twelve simples and combined in 231 gates. Its date and setting are among the most disputed questions in Jewish studies.",
      artifact: {
        type: "scroll", title: "Unroll the thirty-two paths",
        sub: "The opening words and the three mother letters. Touch a word for its meaning; the scroll reads from the right.",
        columns: [
          { kind: "hebrew", heading: "Sefer Yetzirah 1:1",
            lines: [
              [["בשלשים", "with thirty"], ["ושתים", "and two"], ["נתיבות", "paths"], ["פליאות", "wondrous"], ["חכמה", "of wisdom"]],
              [["חקק", "he engraved"], ["יה", "Yah (a divine name)"]]
            ],
            translation: "With thirty-two wondrous paths of wisdom Yah engraved (and created his world).", note: "The verse continues with a list of divine names; the text varies between recensions." },
          { kind: "hebrew", heading: "The three mothers",
            lines: [[["א", "aleph: air"], ["מ", "mem: water"], ["ש", "shin: fire"]]],
            translation: "Aleph, mem, shin: air, water and fire.", note: "Then seven doubles (planets, days) and twelve simples (zodiac signs, months)." }
        ]
      },
      study: { manifest: "", rights: "", external: [ { label: "Sefaria: Sefer Yetzirah, Hebrew and English", href: "https://www.sefaria.org/Sefer_Yetzirah" } ] }
    },
    {
      id: "v81", slug: "mawangdui-silk-texts", status: "published", pending: false,
      era: "04-axial-age", year: -168, chapters: ["ch12", "ch09"],
      title: "The Mawangdui Silk Texts", category: "manuscripts",
      source: "vault/v81-mawangdui-silk-texts.md",
      held: "Hunan Museum, Changsha",
      dated: "Buried in Tomb 3, Mawangdui, in 168 BCE; excavated 1973",
      summary: "Silk manuscripts from a Han tomb, including two copies of the Laozi (Daodejing), then the oldest known. They put the De section before the Dao section and write heng, 'constant', where later editions avoid an emperor's name with chang.",
      artifact: {
        type: "scroll", theme: "paper", title: "Unroll the silk",
        sub: "The famous opening line as the silk copies write it. Read from the right, top to bottom; touch a group for its meaning.",
        fonts: ["Noto+Serif+TC:wght@400;600"],
        hint: "Chinese texts open from the right and read top to bottom. Drag the silk to travel along it and touch a character-group to read its meaning.",
        columns: [
          { kind: "cjk", heading: "Laozi, the Dao section, first line", lines: [[["道", "the way (dao)"], ["可道也", "can be spoken of"]], [["非", "is not"], ["恒", "heng: constant (later editions: 常 chang)"], ["道也", "the way"]]],
            translation: "The way that can be spoken of is not the constant way.", note: "In the silk copies this line opens the second half of the book, not the first." }
        ]
      },
      study: { manifest: "", rights: "The manuscripts belong to the Hunan Museum.", external: [] }
    },
    {
      id: "v82", slug: "bardo-thodol", status: "published", pending: false,
      era: "07-high-medieval", year: 1350, chapters: ["ch53", "ch11"],
      title: "The Bardo Thödol", category: "texts",
      source: "vault/v82-bardo-thodol.md",
      held: "A treasure text of the Nyingma school, in many Tibetan xylograph and manuscript copies",
      dated: "Revealed by Karma Lingpa (1326–1386); attributed by tradition to Padmasambhava, 8th century",
      summary: "'Liberation through Hearing in the Intermediate State', read aloud to the dying and the dead to guide them through the bardos of dying, of reality and of becoming. Its English title, 'The Tibetan Book of the Dead', dates from Evans-Wentz's edition of 1927.",
      artifact: {
        type: "cards", title: "The three bardos",
        sub: "Each card is one stage of the passage as the text describes it. Turn it to read what the dead are told.",
        cardsTitle: "Turn each card",
        cards: [
          { t: "Chikhai", s: "the bardo of dying", d: "The elements dissolve and the Clear Light dawns. To recognise it is liberation at once." },
          { t: "Chönyi", s: "the bardo of reality", d: "Forty-two peaceful and fifty-eight wrathful deities appear. They are the mind's own projections; recognising them frees the dead." },
          { t: "Sidpa", s: "the bardo of becoming", d: "Without recognition, karma drives the mind toward rebirth; the text teaches how to choose a womb or close the womb door." },
          { t: "Bright and dull lights", s: "the choice", d: "Each buddha's dazzling light shines beside a soft light leading to a realm of rebirth. Go toward the dazzling one." }
        ]
      },
      study: { manifest: "", rights: "", external: [] }
    },
    {
      id: "v83", slug: "codex-boturini", status: "published", pending: false,
      era: "08-early-modern", year: 1530, chapters: ["ch43", "ch29"],
      title: "The Codex Boturini", category: "manuscripts",
      source: "vault/v83-codex-boturini.md",
      held: "Biblioteca Nacional de Antropología e Historia, Mexico City",
      dated: "Shortly before or after the Spanish conquest; c. 1520s–1540s",
      summary: "The 'Strip of the Pilgrimage', a 5.5-metre amate screenfold drawn in black and never coloured, telling the Mexica migration from Aztlan in footprints, place glyphs and year counts. It breaks off mid-story, during the war of Colhuacan against Xochimilco.",
      artifact: {
        type: "timeline", title: "Follow the footprints",
        sub: "The episodes of the strip in order. Its year counts are the Mexica's own; the dates are not converted to our calendar.",
        events: [
          { y: "1 Flint", t: "Aztlan", d: "A couple on an island; a man paddles to the shore. The footprints set out." },
          { y: "Colhuacan", t: "The curved hill", d: "Huitzilopochtli speaks from a cave in the curved hill." },
          { y: "Eight tribes", t: "Fellow travellers", d: "Eight other peoples, each marked by a name glyph, walk with the Mexica." },
          { y: "The tree", t: "The broken tree", d: "A tree splits: the Mexica must separate from the others." },
          { y: "Year counts", t: "The long walk", d: "Place after place, with strings of year signs showing how long they stayed." },
          { y: "The end", t: "War for Colhuacan", d: "The Mexica fight Xochimilco for the lord of Colhuacan. The strip stops here." }
        ]
      },
      study: { manifest: "", rights: "The codex belongs to INAH, Mexico.", external: [ { label: "INAH: Códice Boturini, digital edition", href: "https://www.codiceboturini.inah.gob.mx/" } ] }
    },
    {
      id: "v84", slug: "hinton-st-mary-mosaic", status: "published", pending: false,
      era: "05-late-antiquity", year: 350, chapters: ["ch16", "ch18"],
      title: "The Hinton St Mary Mosaic", category: "relics",
      source: "vault/v84-hinton-st-mary-mosaic.md",
      held: "British Museum, London (central medallion on display)",
      dated: "4th century CE; found 1963",
      summary: "A Roman mosaic floor from Dorset whose central roundel shows a man before a Chi-Rho, flanked by pomegranates: probably one of the earliest pictures of Christ, though some read it as Constantine. Another room shows Bellerophon killing the Chimera.",
      artifact: {
        type: "cards", title: "Reading the floor",
        sub: "Each card is one element of the mosaic. Turn it for what it may mean and how sure we can be.",
        cardsTitle: "Turn each card",
        cards: [
          { t: "The bust", s: "Christ or emperor?", d: "Most scholars read it as Christ; some as Constantine. It follows fourth-century portrait conventions, not a likeness." },
          { t: "☧ the Chi-Rho", s: "Χ + Ρ", d: "The first letters of Christos, a sign Constantine made famous after 312." },
          { t: "Pomegranates", s: "life after death", d: "Persephone's fruit in myth; for Christians a possible sign of resurrection and eternal life." },
          { t: "Bellerophon", s: "hero and monster", d: "A pagan hero killing the Chimera, perhaps read here as good overcoming evil." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the mosaic belong to the British Museum.", external: [ { label: "British Museum: fieldwork at Hinton St Mary", href: "https://www.britishmuseum.org/research/projects/archaeological-fieldwork-hinton-st-mary-dorset" } ] }
    },
    {
      id: "v85", slug: "picatrix", status: "published", pending: false,
      era: "06-early-medieval", year: 1000, chapters: ["ch21", "ch37"],
      title: "The Picatrix", category: "texts",
      source: "vault/v85-picatrix.md",
      held: "Arabic, Castilian-derived Latin and vernacular manuscripts in many libraries",
      dated: "Arabic original, al-Andalus, 10th–11th century; Castilian translation 1256–1258",
      summary: "The Ghāyat al-Ḥakīm, 'The Goal of the Sage', an Arabic handbook of astral magic from Muslim Spain, translated for Alfonso X and known in Latin as Picatrix. It teaches how to make talismans at the right celestial moment. Its authorship is disputed.",
      artifact: {
        type: "codex", theme: "grimoire", title: "Open the Goal of the Sage",
        sub: "Turn the pages for the book's four parts and its central idea, summarised in this archive's words.",
        pages: [
          { h: "Book I", t: "On the heavens and the nature of magic: the lower world receives the influence of the higher.", n: "Summary." },
          { h: "Book II", t: "On the figures of the heavens, and the 28 mansions of the Moon in which talismans are made.", n: "Summary." },
          { h: "Book III", t: "On the properties of the planets: their metals, stones, colours, incenses, and the prayers addressed to them.", n: "Summary." },
          { h: "Book IV", t: "On spirits, the rites of the Sabians of Harran, and potions and fumigations.", n: "Summary." },
          { h: "Who wrote it?", t: "Not Maslama al-Majrīṭī, as the manuscripts say. Perhaps Maslama ibn Qāsim al-Qurṭubī (d. 964), as Maribel Fierro argued in 1996.", n: "Still debated." }
        ]
      },
      study: { manifest: "", rights: "", external: [] }
    },
    {
      id: "v86", slug: "berlin-gold-hat", status: "published", pending: false,
      era: "03-early-iron-age", year: -900, chapters: ["ch42", "ch14"],
      title: "The Berlin Gold Hat", category: "relics",
      source: "vault/v86-berlin-gold-hat.md",
      held: "Neues Museum (Museum für Vor- und Frühgeschichte), Berlin",
      dated: "Late Bronze Age, c. 1000–800 BCE; bought 1996, find-spot unknown",
      summary: "A 74.5 cm cone of paper-thin gold, covered with stamped circles and crescents, one of four 'Schifferstadt-type' gold hats. Wilfried Menghin read its ornament as a lunisolar calendar; the reading is contested, and the hat's find-spot is unknown.",
      artifact: {
        type: "cards", title: "The four gold hats",
        sub: "Each card is one of the four known cones. Turn it for where and when it was found.",
        cardsTitle: "Turn each card",
        cards: [
          { t: "Schifferstadt", s: "found 1835", d: "Near Speyer, Germany. The short cone that names the type. Historisches Museum der Pfalz, Speyer." },
          { t: "Avanton", s: "found 1844", d: "Near Poitiers, France; incomplete. Musée d'Archéologie nationale, Saint-Germain-en-Laye." },
          { t: "Ezelsdorf-Buch", s: "found 1953", d: "Near Nuremberg; crushed and restored to about 88 cm. Germanisches Nationalmuseum." },
          { t: "Berlin", s: "bought 1996", d: "The best preserved, 74.5 cm. Find-spot unknown: it surfaced on the art market." },
          { t: "The calendar reading", s: "contested", d: "Menghin counted the circles as days of lunar and solar years. Critics say such counts depend on which motifs are chosen." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the hat belong to the Staatliche Museen zu Berlin.", external: [] }
    },
    {
      id: "v87", slug: "diwan-abatur", status: "published", pending: false,
      era: "08-early-modern", year: 1750, chapters: ["ch56", "ch17"],
      title: "The Diwan Abatur", category: "manuscripts",
      source: "vault/v87-diwan-abatur.md",
      held: "Bodleian Library, Oxford (Drower Collection, DC 8); Vatican Library (Borgiani Siriaci 175)",
      dated: "The published copy DC 8 is 18th-century; the text is older, date uncertain",
      summary: "A Mandaean illustrated scroll over six metres long that maps the soul's road after death through the maṭarātā, or watch-houses, across the river Hitpun in the ship Shahrat, to Abatur, who weighs it. Published in English by E. S. Drower in 1950.",
      artifact: {
        type: "timeline", title: "The soul's road",
        sub: "Move along the scroll as the soul travels it. These are stages of the journey, not dates.",
        events: [
          { y: "Death", t: "Leaving the body", d: "The soul departs, and the rites of the living help it on its way." },
          { y: "Maṭarātā", t: "The watch-houses", d: "Stations guarded by beings of the lower worlds, among them the sons of Ptahil and the seven planets. The soul is held and purified." },
          { y: "Hitpun", t: "The river", d: "The ship Shahrat, 'she kept watch', carries souls across the river that divides the lower world from the World of Light." },
          { y: "The scales", t: "Abatur", d: "Abatur of the Scales weighs the soul. If it balances, it passes on." },
          { y: "Light", t: "The World of Light", d: "The soul rejoins the light from which it came." }
        ]
      },
      study: { manifest: "", rights: "Manuscripts belong to the Bodleian and Vatican libraries.", external: [] }
    },
    {
      id: "v88", slug: "skull-reliquary-saint-maximin", status: "published", pending: true,
      era: "07-high-medieval", year: 1279, chapters: ["ch16", "ch45", "ch31"],
      title: "The Skull of \u201cMary Magdalene\u201d at Saint-Maximin", category: "relics",
      source: "vault/v88-skull-reliquary-saint-maximin.md",
      held: "Crypt of the Basilica of Saint-Maximin-la-Sainte-Baume, Provence, France",
      dated: "Venerated there since the \u201cdiscovery\u201d of 1279; the present gilded reliquary is dated MDCCCLX (1860)",
      summary: "A darkened skull in a gilded reliquary of flowing golden hair carried by four angels, venerated as Mary Magdalene's since Charles of Salerno announced her tomb in 1279. The Provence legend has no trace before the eleventh century, Vézelay claimed her first, and a 2017 study reconstructed the face of a woman of about fifty without identifying her.",
      artifact: {
        type: "timeline", theme: "reliquary", title: "A skull and its story",
        sub: "From the Gospels to the golden reliquary: tradition and testing, kept apart.",
        events: [
          { y: "1st c.", t: "The Gospels", d: "Mary Magdalene is named as a witness of the crucifixion and the first to find the tomb empty. Nothing is said of her later life or burial." },
          { y: "6th–7th c.", t: "Other traditions", d: "Gregory of Tours places her at Ephesus; Modestus of Jerusalem says she returned to Jerusalem." },
          { y: 591, t: "The composite Magdalene", d: "Gregory the Great identifies her with the sinful woman of Luke 7 and with Mary of Bethany. The Eastern churches never do." },
          { y: "11th c.", t: "Vézelay and the voyage", d: "The first traces of the story that she sailed to Provence appear in documents connected with Vézelay, which claims her body." },
          { y: 1279, t: "Saint-Maximin", d: "Charles of Salerno has the crypt excavated and announces her tomb. In 1295 Boniface VIII recognizes the relics, and Vézelay declines." },
          { y: 1794, t: "The Revolution", d: "The relics are despoiled; the sacristan Joseph Bastide saves the skull." },
          { y: 1860, t: "The golden reliquary", d: "The present reliquary, gilded hair carried by four angels, bears the date MDCCCLX." },
          { y: 2017, t: "A study without a verdict", d: "Photogrammetry and hair analysis support a facial reconstruction of a woman of about fifty. The identification still rests on tradition." }
        ]
      },
      study: { manifest: "", rights: "Photographs of the relic belong to the basilica; none is reproduced here. The museum shows a modelled rendition, not a replica.", external: [] }
    }
  ],
  /* In preparation — each needs its own sourced entry before it is published. */
  queue: []
};
