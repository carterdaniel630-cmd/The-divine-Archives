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
    }
  ],
  /* In preparation — each needs its own sourced entry before it is published. */
  queue: [
    { title: "The Shroud of Turin", category: "relics", note: "Linen cloth bearing a faint body image; the 1988 radiocarbon tests, the objections to them, and the image-formation debate." },
    { title: "The Holy Lance (\"Spear of Destiny\")", category: "relics", note: "Several rival lance relics (Vienna, the Vatican, Etchmiadzin, Kraków) and the modern 'Spear of Destiny' mythology." },
    { title: "The Crown of Thorns", category: "relics", note: "The relic of Notre-Dame de Paris, its medieval history, and its rescue from the 2019 fire." },
    { title: "The Ark of the Covenant", category: "relics", note: "The biblical texts, the question of its fate, and the Ethiopian Orthodox tradition at Aksum." },
    { title: "The Nag Hammadi Codices", category: "manuscripts", note: "The 1945 Coptic library of Gnostic and other texts." },
    { title: "The Codex Gigas (\"Devil's Bible\")", category: "manuscripts", note: "The giant 13th-century Bohemian codex and its full-page devil." },
    { title: "The Copper Scroll", category: "texts", note: "The Qumran treasure list hammered into copper (covered briefly in V02)." },
    { title: "The Rohonc Codex", category: "manuscripts", note: "An illustrated book in an unread script, and whether it is a forgery." },
    { title: "The Ketef Hinnom Silver Scrolls", category: "texts", note: "Tiny silver amulets bearing the Priestly Blessing — among the oldest biblical text." },
    { title: "The Tilma of Guadalupe", category: "relics", note: "The image of Our Lady of Guadalupe, its history, and the studies of it." }
  ]
};
