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
      id: "v01", slug: "voynich-manuscript", status: "published", pending: true,
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
      id: "v02", slug: "dead-sea-scrolls", status: "published", pending: true,
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
      id: "v03", slug: "emerald-tablet", status: "published", pending: true,
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
      id: "v04", slug: "shroud-of-turin", status: "published", pending: true,
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
      id: "v05", slug: "holy-lance", status: "published", pending: true,
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
      id: "v06", slug: "crown-of-thorns", status: "published", pending: true,
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
      id: "v07", slug: "ark-of-the-covenant", status: "published", pending: true,
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
    }
  ],
  /* In preparation — each needs its own sourced entry before it is published. */
  queue: [
    { title: "The Nag Hammadi Codices", category: "manuscripts", note: "The 1945 Coptic library of Gnostic and other texts." },
    { title: "The Codex Gigas (\"Devil's Bible\")", category: "manuscripts", note: "The giant 13th-century Bohemian codex and its full-page devil." },
    { title: "The Copper Scroll", category: "texts", note: "The Qumran treasure list hammered into copper (covered briefly in V02)." },
    { title: "The Rohonc Codex", category: "manuscripts", note: "An illustrated book in an unread script, and whether it is a forgery." },
    { title: "The Ketef Hinnom Silver Scrolls", category: "texts", note: "Tiny silver amulets bearing the Priestly Blessing — among the oldest biblical text." },
    { title: "The Tilma of Guadalupe", category: "relics", note: "The image of Our Lady of Guadalupe, its history, and the studies of it." }
  ]
};
