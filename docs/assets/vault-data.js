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
    },
    {
      id: "v18", slug: "codex-sinaiticus", status: "published", pending: true,
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
      id: "v19", slug: "book-of-soyga", status: "published", pending: true,
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
      id: "v20", slug: "papyrus-of-ani", status: "published", pending: true,
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
      id: "v21", slug: "book-of-kells", status: "published", pending: true,
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
      id: "v22", slug: "mesha-stele", status: "published", pending: true,
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
      id: "v23", slug: "tel-dan-stele", status: "published", pending: true,
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
      id: "v24", slug: "sudarium-of-oviedo", status: "published", pending: true,
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
      id: "v25", slug: "veil-of-veronica", status: "published", pending: true,
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
      id: "v26", slug: "black-stone", status: "published", pending: true,
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
      id: "v27", slug: "sacred-tooth-relic", status: "published", pending: true,
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
    }
  ],
  /* In preparation — each needs its own sourced entry before it is published. */
  queue: [
    { title: "The Birmingham Qur'an Manuscript", category: "manuscripts", note: "Leaves radiocarbon-dated to 568–645 CE, and what that date can and cannot mean." },
    { title: "The Sana'a Palimpsest", category: "manuscripts", note: "An early Qur'an with an older text erased beneath it." },
    { title: "The Diamond Sutra of Dunhuang", category: "manuscripts", note: "The oldest dated printed book (868 CE), from a sealed cave library." },
    { title: "The Dresden Codex", category: "manuscripts", note: "The finest Maya book: Venus tables, eclipse cycles and the gods of the calendar." },
    { title: "The Popol Vuh Manuscript", category: "manuscripts", note: "The K'iche' Maya creation epic, preserved in one 18th-century copy." },
    { title: "The Kartarpur Bir", category: "manuscripts", note: "The early Sikh scripture volume and its contested history." },
    { title: "The Pyramid Texts of Unas", category: "texts", note: "The oldest religious texts carved inside a tomb, c. 2350 BCE." },
    { title: "The Cyrus Cylinder", category: "texts", note: "A Persian king's clay proclamation, and its modern 'human rights' myth." },
    { title: "The Rök Runestone", category: "texts", note: "The longest runic inscription, its ciphers, and a father's grief." },
    { title: "The Gundestrup Cauldron", category: "relics", note: "A silver cauldron of gods from a Danish bog: Celtic, Thracian, or both?" }
  ]
};
