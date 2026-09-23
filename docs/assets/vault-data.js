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
    },
    {
      id: "v08", slug: "nag-hammadi-codices", status: "published", pending: true,
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
      id: "v09", slug: "codex-gigas", status: "published", pending: true,
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
      id: "v10", slug: "copper-scroll", status: "published", pending: true,
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
      id: "v11", slug: "rohonc-codex", status: "published", pending: true,
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
      id: "v12", slug: "ketef-hinnom-scrolls", status: "published", pending: true,
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
      id: "v13", slug: "tilma-of-guadalupe", status: "published", pending: true,
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
      id: "v14", slug: "holy-grail", status: "published", pending: true,
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
      id: "v15", slug: "true-cross", status: "published", pending: true,
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
      id: "v16", slug: "james-ossuary", status: "published", pending: true,
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
      id: "v17", slug: "gospel-of-jesus-wife", status: "published", pending: true,
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
    }
  ],
  /* In preparation — each needs its own sourced entry before it is published. */
  queue: [
    { title: "Codex Sinaiticus", category: "manuscripts", note: "The oldest complete New Testament, divided among four libraries and reunited online." },
    { title: "The Book of Soyga", category: "manuscripts", note: "John Dee's unreadable book of letter tables, and the tables later decoded." },
    { title: "The Papyrus of Ani", category: "manuscripts", note: "The finest Book of the Dead: the weighing of the heart, spell by spell." },
    { title: "The Book of Kells", category: "manuscripts", note: "Insular Gospel book: the Chi-Rho page and the symbolism of its knots." },
    { title: "The Mesha Stele", category: "texts", note: "A Moabite king's victory inscription naming Israel and YHWH." },
    { title: "The Tel Dan Stele", category: "texts", note: "An Aramaic inscription read as 'House of David', and the debate over that reading." },
    { title: "The Sudarium of Oviedo", category: "relics", note: "The cloth said to have covered Christ's face, radiocarbon-dated to the 7th century." },
    { title: "The Veil of Veronica", category: "relics", note: "Rome's veil and the Manoppello image, and how 'true image' relics multiplied." },
    { title: "The Black Stone of the Kaaba", category: "relics", note: "The stone set in the Kaaba's corner at Mecca: tradition, history and the limits of study." },
    { title: "The Sacred Tooth Relic", category: "relics", note: "The Buddha's tooth at Kandy: kingship, procession and a relic's politics." }
  ]
};
