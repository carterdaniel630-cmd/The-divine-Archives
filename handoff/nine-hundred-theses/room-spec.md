# The 900 Theses Room — Room Spec for Claude Code

**Subject:** Giovanni Pico della Mirandola, *Conclusiones nongentae* (900 Theses, 1486) + the Oration + the blocked 1487 disputation and condemnation.
**Status:** SPEC ONLY. Not a build. No code in this document. Do not ship any room content from this spec alone — see §10 (Build Gates).
**Research foundation:** `workspace/your_files/nine-hundred-theses/research-report.md`. That report is the ONLY factual authority for this room. Where this spec says "verified," it means verified in that report. Where the report says "do not display until established," this spec carries that as a hard build block, not a suggestion.
**Policies applied:** Content Truth Policy (`workspace/your_files/content-truth-policy.md`) — present what was actually said/believed, no silent omissions or sanitization. Naming & IP Policy (`workspace/your_files/naming-and-ip-policy.md`) — generic names only, no trademarked or "-style" phrasing.
**Priority:** Top priority, per Carter. Utmost care. Protected and accurate through and through.

---

## 1. Placement

### 1.1 The call

**Place the room as a THRESHOLD / BRIDGE room on the boundary between the High Medieval (c. 1100–1500) and Early Modern (c. 1500–1800) wings.**

- The visitor enters the room from the High Medieval side and exits into the Early Modern side (or vice versa, per the museum's circulation — Claude to confirm against the in-repo geometry).
- The room is the hinge between the two eras, not a room fully inside either one.

### 1.2 Why the boundary is the honest placement

- The event dates straddle the boundary: the theses were printed at Rome in **December 1486**; the planned disputation was set for after Epiphany (**6 January 1487**); the condemnation bull is dated **4 August 1487**.
- The content straddles the boundary just as much as the dates do. The theses draw on medieval scholastic authorities (Albert the Great, Thomas Aquinas, Francis of Mayronnes, John Duns Scotus, Henry of Ghent, Giles of Rome — the verified 115 Latin theses) AND on Greek, Arabic, Hebrew/Kabbalistic, Hermetic, and Chaldean sources, in a syncretic programme that points forward to the early modern world. Forcing the room wholly into one era would misrepresent it.
- Pico himself (24 February 1463 – 17 November 1494) is a boundary figure: formed in medieval scholasticism (Bologna, Ferrara, Padua, Paris), working in Renaissance Florence under Lorenzo de' Medici and alongside Marsilio Ficino, and condemned by a papal bull before being absolved in 1493.
- The threshold treatment also serves the room's central question (§2): the visitor crosses from a world where disputation was the normal engine of knowledge into a world where a printed book could be condemned as a body — and then stands in the room where that crossing happened.

### 1.3 What Claude must confirm — do not invent

- **Wing names/numbers:** This spec does NOT assign the room a wing number or wing name, because the research report does not define the museum's wing layout. Claude must confirm the actual High Medieval and Early Modern wing identities, the room slot on their shared boundary, and the circulation direction against the in-repo museum manifest. Do not invent a wing name or renumber existing rooms to make this fit.
- **Adjacency:** The room's neighbours must be the last High Medieval room and the first Early Modern room in the manifest. If no boundary slot exists, Claude must flag that to Carter rather than squeezing the room into an unrelated wing.

### 1.4 Grand Directory room-count implication — FLAG

- The Grand Directory spec currently counts **83 museum rooms**.
- **This room is an addition. The count becomes 84** (83 + the 900 Theses room), unless Claude's manifest check shows the count has already moved.
- Claude must update every place the count appears: the Directory map data, the Directory legend/copy, the Atlas directory count if it repeats the number, and any "83 rooms" string elsewhere. Do NOT silently leave "83" standing next to an 84-room museum. The count change is a labeled update, not a quiet edit (see §8.2).

---

## 2. Room Concept

### 2.1 Atmosphere — house style

- **Dark candlelit archive.** Chiaroscuro entry: the visitor enters near-darkness; targeted spot illumination falls on the central relic (§3.1) and on the disputation table. Light grows as the visitor engages, never floods.
- **Typography:** Cinzel for display headings, Cormorant for subheadings and pull-quotes, EB Garamond for body text. Latin quotations set in Cormorant or EB Garamond italic, visually distinct from paraphrase.
- **True 3D depth everywhere.** The relic, the lectern/table, the candlelight, and the wall panels are modelled three-dimensional objects with advanced materials (roughness, metalness, subtle normal mapping) — no flat 2D where true 3D is the standard. See §9.
- **Sound (if the room carries sound):** low room tone only — candle, vellum, distant stone. No music, no chant, no invented period soundscape presented as authentic. Any sound must be labeled as atmosphere, not as a historical recording.

### 2.2 The central question

**How does a visitor encounter 900 propositions without drowning?**

The answer is the room's structure, and it must be visible in the first ten seconds:

1. **One object** — the booklet (§3.1). Everything starts from the physical thing Pico had printed.
2. **Two blocks** — 402 attributed + 498 Pico's own (§3.2). The visitor always knows which block they are in.
3. **One text** — the Oration (§3.5), paraphrased, as the opening address that was never delivered.
4. **One event** — the disputation that never happened and the condemnation that did (§3.6).
5. **One act** — the visitor stages a disputation (§4). The visitor does something with a thesis, rather than reading 900 of them.

The room must NEVER present the 900 as a scrolling wall of undifferentiated text. No "Thesis N" may appear unless its text is verified (see §3.2, §10).

### 2.3 What the room is NOT

- Not a biography room. Pico's life appears only where it explains the theses, the Oration, the blocked disputation, or the condemnation (§3.7).
- Not a Kabbalah room. Pico's Kabbalah appears as Pico understood it, with the scholarly caveat attached (§3.4) — it is one strand of the 900, not the room's subject.
- Not a Debate Hall annex. See §4.4 for the hard distinction.

---

## 3. Relics + Interactions

### 3.1 Central relic: THE BOOKLET (libellus) on a disputation lectern

**Form chosen: a small printed booklet resting on a wooden disputation lectern/table in a Rome hall setting.**

**Justification from the record:**

- The 1486 work was a **printed booklet** (*libellus* in the papal bull), printed at Rome in December 1486 — not a bound codex volume, not a broadsheet, not a scroll.
- It was **publicly posted** (*publice affigi*) in Rome and published in diverse public places in Rome and in other parts of the world, with the closing announcement stating it would meanwhile be published in all Italian universities.
- Pico offered to **defend** the theses in public disputation — so the booklet belongs on a disputation lectern, in a hall set for a debate that never took place, with an empty opponent's seat. The empty seat is the room's central image: the debate was blocked.

**What the visitor sees:**

- A true-3D small printed booklet: plain period binding/wrapping, visible title page carrying the verified 1486 title *Conclusiones philosophicae, cabalasticae et theologicae* (also rendered *Conclusiones nongentae* / *Conclusiones DCCCC*). The title-page description of contents (dialectic, morals, physics, mathematics, metaphysics, theology, magic, and Kabbalah; drawn from Pico's own views together with the views of the Chaldean, Arab, Hebrew, Greek, Egyptian, and Latin sages) may appear as a panel beside the booklet — this description is verified via the scholarly quotation in the research report.
- The booklet sits open to the closing announcement, showing the ONE verified long Latin fragment cleared for verbatim display (see §3.3): *"Conclusiones non disputabuntur nisi post Epiphaniam…"* with a fresh labeled paraphrase beside it.
- **Do NOT show:** a printer's name (not verified — see §10); a guessed page count; a facsimile of a specific surviving copy (no specific copy was verified); any thesis text beyond the three verified fragments (§3.3) until the Farmer/Copenhaver extraction gate (§10) is passed.

**Interaction:** the visitor turns the booklet's pages (touch / click / keyboard). The booklet has exactly three kinds of pages, and the type is always labeled:

1. **Group divider pages** — the verified grouping structure (§3.2).
2. **Verified-text pages** — the three verified Latin fragments (§3.3), each with paraphrase + source citation + evidence badge (§3.8).
3. **Gate pages** — where further theses would sit, the booklet shows a labeled gate card: "Thesis texts beyond the three verified fragments are held until verified against Farmer (1998) or Copenhaver (Harvard UP). See the build gate." The gate is honest, not a blank page and not invented text.

### 3.2 Browsing by thesis group — ONLY the verified grouping structure

The room's browsing tree must reproduce EXACTLY the following structure. No other group, subgroup, or count may appear.

**Level 1 — the two great divisions (verified counts):**

| Block | Count | Character |
|---|---|---|
| Theses attributed to earlier authorities ("according to the doctrine of…") | **402** | Conclusions drawn from ancient and medieval authorities — Latin scholastics, Greek Platonists, Arabic Aristotelians, Greek Aristotelians, Pythagoras, Cabalists, Hermes Trismegistus, Chaldean theologians |
| Pico's "own opinions" (*secundum propriam opinionem* / his own conclusions) | **498** | Pico's own conclusions, taking up matters of theology, metaphysics, mathematics, and magic |

402 + 498 = 900. These are the only block-level counts verified.

**Level 2 — within the 402 (only what is verified):**

- **Latin philosophers and theologians — 115 theses.** The first 115 theses are "according to the doctrine of the Latin philosophers and theologians," covering six scholastic masters: Albert the Great, Thomas Aquinas, Francis of Mayronnes (Franciscus de Mayronis), John Duns Scotus, Henry of Ghent, and Giles of Rome.
  - **Albert the Great: 16 theses** (verified).
  - **Thomas Aquinas: 45 theses** (verified). Note for the Aquinas panel: Pico's main source for the Aquinas theses appears to have been Aquinas's commentary on Peter Lombard's *Sentences* rather than the *Summa Theologiae*.
  - **Mayronnes, Scotus, Henry of Ghent, Giles of Rome: counts NOT verified.** Display these four as named groups with the label "count to be confirmed from Farmer (1998) or Copenhaver." NEVER display a number for them until the gate (§10) is passed. Do not derive them by subtraction (115 − 16 − 45 = 54 does not license any per-author split).
- **Other authority groups — order verified, counts NOT verified.** Display in this order, with no counts: Latin scholastics, Greek Platonists, Arabic Aristotelians, Greek Aristotelians, Pythagoras, Cabalists, Hermes Trismegistus, Chaldean theologians. Each carries the label "per-group count not yet verified — see build gate." The order itself is verified (descending quantitative order per the scholarly summary); the numbers are not.
- **Cabalist theses — 119 total, including the final and culminating 72.** Display exactly this. **Do NOT assert which of the two great divisions (402 vs. 498) the 119 fall into** — the sources consulted do not pin that down. The room must not place the 119 inside either block until Farmer/Copenhaver numbering is checked. The parallel between the 72 and the traditional 72 names of God derivable from Exodus 14:19–21 is a suggestive parallel noted in the literature, NOT a verified claim by Pico — if shown at all, label it as such.
- **HARD BLOCK — the "72 physics theses" claim:** One tertiary source claims 72 theses describe a complete system of physics. The research report identifies this as an apparent confusion with the 72 Cabalist theses. **Do NOT use it in the room in any form** until checked against Farmer/Copenhaver.

**Level 2 — within the 498 (only what is verified):**

- **Seventeen "paradoxical conclusions"** reconciling the sayings first of Aristotle and Plato, then of other masters who seem to disagree most. Display the first as paraphrase only: there is no natural or divine question on which Aristotle and Plato do not agree in sense and substance, even though they seem to differ in words. The Latin was not verified verbatim — label PARAPHRASE.
- No other subgroup of the 498 may be displayed with a count until the Farmer/Copenhaver gate is passed.

**Standing display rule for every group panel:**

- Every group panel carries the standing scholarly caution, in the room's voice: the theses are bare conclusions with no supporting argumentation, "loaded with ambiguities that Pico meant to resolve in the course of his debate." A thesis shown without this note misrepresents what the theses are. The theses were meant to be argued live, not read as a self-standing treatise.

### 3.3 Per-thesis display — the three verified fragments ONLY (until the gate passes)

Until the build gate in §10 is passed, the room may display verbatim thesis text for exactly these three items. No other individual thesis may be displayed in Latin or in English translation as "Thesis N."

1. **Thesis 39 (Aquinas group).** Latin: *"Phantasma est agens secundarium et instrumentale in productione speciei intelligibilis"* — paraphrase: "the phantasm is the secondary and instrumental agent in the production of an intelligible species." Panel note: Pico reworks his authorities rather than merely copying them — this formulation is not found in Thomas as such but is implied in Thomas's discussion.
2. **A thesis from the Henry of Ghent group.** Latin: *"amicitia est virtus"* — paraphrase: "friendship is a virtue." (Henry's *Quodlibet* X, q. 12.)
3. **The closing announcement (subscription) of the 1486 booklet.** Latin: *"Conclusiones non disputabuntur nisi post Epiphaniam; interim publicabuntur in omnibus Italiae Gymnasiis. Et si quis Philosophus aut Theologus, etiam ab extrema Italia, arguendi gratia, Romam venire voluerit, pollicetur ipse dominus disputaturus se viatici expensas illi soluturum de suo."* — paraphrase: the Conclusions will not be disputed until after the Epiphany; meanwhile they will be published in all Italian universities; and if any philosopher or theologian, even from the ends of Italy, wishes to come to Rome to argue, the disputer promises to pay his travel expenses from his own funds.

**Per-thesis display template (every thesis panel, without exception):**

- Thesis number + group (only if both verified).
- Latin text (only if verified verbatim against Farmer / Copenhaver / Bausi) OR a labeled PARAPHRASE where no verified Latin exists.
- Fresh in-house paraphrase, labeled PARAPHRASE — never wording lifted from a modern translation (see §8.4).
- Source citation: the edition + page/number the text was verified against.
- Evidence badge (§3.8).
- The standing ambiguity note (§3.2).

### 3.4 Pico's Kabbalah — present as Pico's claims, with the caveat

- Pico is presented as the founder of the tradition of Christian Kabbalah. His Hebrew teachers/informants: Elia del Medigo; Yohanan Alemanno (Johanan Aleman); and above all Flavius Mithridates, who translated thousands of pages of Kabbalistic material into Latin for Pico.
- Pico's claims (label: "Pico held / Pico claimed — not the archive's assertion"): Kabbalah was an angelic revelation / oral Torah confided to Moses and passed on in secret through Esdras (Ezra) and other sages; it was holier than the pagan wisdom Ficino traced to Zoroaster and Hermes; the primary doctrines of Christology and Trinitarian theology could be grounded in Kabbalah. The 72 culminating Cabalist theses turn this into Christology and Trinitarian theology.
- **Mandatory caveat on the same panel:** modern scholarship stresses that Pico's Kabbalah was mediated through flawed and sometimes forged translations (Mithridates mistranslated and in places doctored/forged material, including seemingly pro-Christian texts), and that his grasp of the material was partial. **Do NOT present forged "pro-Christian" Kabbalistic texts as genuine Jewish sources.** Do not present Pico's Kabbalistic claims as facts about Judaism.
- Per the Content Truth Policy, this caveat is not sanitization — it is the truth of the record, shown in full. The room shows both what Pico believed and what scholarship has established about his sources.

### 3.5 The Oration — the room's opening text (PARAPHRASE ONLY, TEXT-ONLY)

- **What it was:** a public discourse composed in Latin in 1486 as the planned opening speech for the Rome disputation. **It was never delivered** — the disputation was blocked, so the speech was never given. Gianfrancesco Pico says Giovanni thought little of the speech, regarding it as juvenilia.
- **Title warning — HARD RULE:** The title *Oratio de hominis dignitate* ("Oration on the Dignity of Man") was **NOT Pico's**. The room must NOT present "On the Dignity of Man" as Pico's own title. Display the title history on the Oration panel:
  - 1496 first publication (Bologna, Gianfrancesco Pico's edition of the works, printer Benedetto Faelli): plain heading *Oratio quaedam elegantissima* ("A Very Elegant Oration").
  - Front matter of the five collected editions/reprints between 1498 and 1521 kept the 1496 formulation.
  - 1557: a Basel collection first used *On the Dignity of Man*; a Venice edition of the same year used *A Very Elegant Oration on the High Nobility and Dignity of Man*.
  - The Oration was not published in Pico's lifetime. The only separately published Latin text of the pre-modern era: 1530. Except as part of the collected works, the Latin text was printed only once before the 1940s. The first English translation appeared in the 1940s, just after the first Italian version (1936).
- **Contested reading — show both sides, attributed:** Copenhaver argues Pico "never wrote a speech about the dignity of man" in the modern textbook sense — the speech announced different projects (persuading Christians to become Kabbalists in order to annihilate themselves in God; convincing philosophers that their path to saving wisdom was concord rather than disputation). Present this as Copenhaver's contested scholarly position, balanced against the traditional reading (the Oration as a charter of human freedom and dignity, shaped by 19th-century idealist historians and mid-20th-century anthologies). Do not let the room silently adopt either side.
- **Core arguments (ALL paraphrase — no verbatim quotation of any famous passage):**
  - Two-part form: (1) the philosophical basis — praise of human beings and an account of human nature; (2) announcement and justification of the topics to be disputed (the 900 theses).
  - The human being without a fixed place: God gave every creature a fixed and immutable form — except the human being, created with no definite abode or form, given free will and the use of all God's creatures. Neither heaven nor earth, mortal nor immortal, free to choose: to sink to the level of animals or to rise to the divine. The "chameleon" / self-shaping argument. In Copenhaver's and Grafton's readings, the human being as created has no special dignity of its own — only the dignity of potential.
  - Ascent through philosophy: philosophizing ascends the chain of being toward the angels and communion with God; failing to exercise the intellect, one vegetates. Dignity lies in the capacity for self-transformation through free will.
  - Three-stage mystical vocation (attribute to Bori): moral transformation, intellectual research, final perfection in identity with the absolute reality — a paradigm Bori takes to be universal.
  - Angelic hierarchy: Seraphim (charity; "burn with love for the Creator"), Cherubim (intelligence; through contemplation and meditation), Thrones (justice; being just in ruling over "inferior things"). The philosopher can attain these states; Cherubim as preparation for "the fire of the Seraphim and the judgement of the Thrones." (Paraphrase of the tertiary summary — verify against a scholarly edition before display; if not verified, the panel carries "summary to be verified" rather than asserting detail.)
  - Defense of philosophy and the liberal arts; Pico's youth should not discredit the theses.
  - Esoteric intent (per SEP/Copenhaver): large portions draw on Kabbalistic texts in ways no contemporary Christian could have detected without the clues in the *Conclusions*; the highest and most sacred wisdom must not be divulged in plain language.
  - Introduction to the theses: the second half justifies the disputation project and the 900 theses as, in Pico's view, a complete and sufficient basis for the discovery of all knowledge.
- **Famous passages — HARD RULE:** No famous passage (God's address to Adam about having no fixed form; the "maker and moulder of thyself" idea) is quoted verbatim anywhere in the room. These exist in many modern English translations, all in copyright or of unverified status. The room uses EITHER (a) Pico's Latin from a verified critical edition (Bausi 2003 / Copenhaver / Farmer) with a fresh labeled paraphrase, OR (b) a newly translated in-house passage with licensing review. **Do NOT lift wording from Wallis (1965), Borghesi/Papio/Riva (2012), or any other modern translation.** See §8.4.
- **How the Oration appears in the room (TEXT-ONLY, decided §10):** The Oration is presented as TEXT ONLY — no voice, no spoken paraphrase. A spoken paraphrase would be heard as Pico's own words, and no verbatim modern-translation text is cleared for use. The visitor reads the full paraphrase on a wall panel, clearly labeled "Paraphrase of the Oration (never delivered, 1486)." It must read like an address to a hall, not a textbook summary. The visitor must be able to re-read the full paraphrase on a wall panel at any time.

### 3.6 The disputation that never happened + the condemnation — the room's second moment

This is a room moment, not a footnote. The visitor walks from the booklet (what Pico planned) into the blocked hall (what happened).

**What the visitor sees/hears (in order):**

1. **The plan (December 1486 – January 1487).** Pico, then 23, planned and offered to finance a grand public disputation in Rome, in the presence of the papal Curia, defending all 900 theses against any opponent. He invited scholars from across Europe, offering to pay the travel expenses of those who came from far away. The debate was to begin on 6 January 1487, the feast of Epiphany — Farmer reads this as a symbolic date (the submission of the pagan peoples to Christ in the persons of the Magi). Label Farmer's reading as Farmer's. He had composed the Oration as the planned opening speech.
2. **The block (February 1487).** Conservative theologians suspected the theses of heresy and persuaded Pope Innocent VIII to act. In February 1487 Innocent VIII halted the proposed debate and appointed a commission to examine the theses for orthodoxy. The commission was headed by John, Bishop of Tournai, master of the papal household, together with bishops, professors of sacred theology, and doctors of both laws (canon and civil law) specially appointed by the pope and residing in the Curia, with Pico himself present for part of the examination.
3. **The commission's finding.** The commission first declared **six** theses suspect and condemned **seven** others, then rejected Pico's clarifications and repudiated **all thirteen**. Pico agreed in writing to retract them, though he did not change his mind about their validity. Subsequently **all 900 theses** were condemned as a body.
4. **The bull (4 August 1487).** Pope Innocent VIII's bull, dated 4 August 1487 (the day before the Nones of August, in the third year of his pontificate), given at Rome at St Peter's. Its provisions, paraphrased on the panel (the English wording is paraphrase, not quotation):
   - It condemns and reprobates the booklet of the 900 conclusions — "notwithstanding that it may contain some which are Catholic and true" — because of the admixture of damnable assertions.
   - It forbids all the faithful, under penalty of excommunication incurred *ipso facto*, to read, write, print, or listen to the work; those possessing it in written or printed form must burn it within three days of receiving notice.
   - It declares that Pico himself — who published the conclusions solely for scholastic disputation and under the correction of the Apostolic See, who professed that they are to be held as judged by the pope and the commission, and who swore never to defend such things — has incurred no mark of unfavourable estimation on account of the foregoing. **The bull condemns the book, not Pico personally.** This distinction must be stated plainly and given its own panel emphasis: Pico personally cleared; the book condemned.
   - It orders publication of the bull in churches during solemn Masses and directs ordinaries and inquisitors to restrain the disobedient.
5. **The aftermath (1487–1493).** Pico's *Apologia* (1487 — see dating note below), hurriedly composed within about three weeks, an elaborate and learned defense that also incorporated about half of the still-unpublished Oration. When the pope learned of the *Apology*'s circulation, he set up an inquisitorial tribunal, forcing Pico to renounce the *Apology* in addition to the condemned theses, which Pico agreed to do. In 1488 Pico left for France, was detained by French authorities at the pope's request — arrested by Philip II, Duke of Savoy, at the demand of the papal nuncios — and briefly jailed at Vincennes. Through the intercession of several Italian princes, instigated by Lorenzo de' Medici, King Charles VIII of France had him released, and the pope was persuaded to allow Pico to live in Florence under Lorenzo's protection. By summer 1488 Pico was back in Fiesole as Lorenzo's guest. In 1493, after the accession of Alexander VI (Rodrigo Borgia), Pico was pardoned/cleared: a brief of Alexander VI dated **18 June 1493** absolved him from all heresy.

**HARD BLOCK — "the 13" condemned theses:**

- **The room MUST NOT display a list of "the 13 condemned theses."** The bull does not enumerate the 13 individually — it expressly declines to do so, on the ground that it would be lengthy and burdensome to insert each condemned conclusion with the reasons for its condemnation. No source in the research establishes a complete, numbered list with verified texts.
- **What the room MAY show** (and only in this form): a panel titled **"Topics attested among the suspected / condemned theses — paraphrase of topics, NOT the texts of the theses."** Each entry is a paraphrase of a topic, with its source, and carries the label "exact thesis text and number not verified." The attested topics:
  1. Magic and Kabbalah as proof of Christ's divinity — that no science gives surer conviction of the divinity of Christ than *magia* (knowledge of the secrets of the heavenly bodies) and Kabbalah. (1911 *Encyclopaedia Britannica*, paraphrase.)
  2. Christ's descent to the underworld — that Christ descended *ad inferos* not in His real presence but *quoad effectum* (as to effect / in a virtual manner). (Britannica 1911, paraphrase.)
  3. Adoration of images and the cross — that no image or cross should receive *latreia* (the worship due to God alone) even in the sense allowed by Thomas Aquinas. (Britannica 1911; Edelheit.)
  4. Origen's fate — that it is more reasonable to regard Origen as saved than as damned. (Britannica 1911, paraphrase.)
  5. Faith and free will — that it is not in a man's free will to believe or disbelieve an article of faith as he pleases. (Britannica 1911, paraphrase.) Copenhaver's *Pico on Trial* treats the will/heresy question through the *Apology*'s Questions (notably Q8, "Is heresy willful?").
  6. A thesis "in the mode of speaking of Dionysius" (negative theology) — one of the 13 accused theses concerned angels/God and was defended by Pico as Dionysian negative theology, not heresy (e.g., claims of the form "God is not intellect" / "an angel is not a man" in the Dionysian mode). Secondary summary of the *Apology* defence; exact thesis text and number not verified.
- **Cross-note (room vs. table — no contradiction):** this panel records the Dionysian topic as an attested condemned-topic paraphrase. The debate-table integration (§2.4 item 9) carries the Dionysian *mode* as a defensible position but EXCLUDES the Dionysian topic as a standalone debate topic until verified. The room records the topic; the table excludes it as a topic. Both are correct for their function.
- **The panel must close with:** "The remaining condemned topics beyond these are NOT established in the research. The full list is held until established from Farmer (1998), Copenhaver (2022, *Pico on Trial*), or the *Apology* itself."
- The commission's judgment also covered categories paraphrased from the bull: theses "scandalous and offensive to devout ears," theses reviving "the errors of pagan philosophers," theses said to foster "the perfidy of the Jews," and theses that under a disguise of natural philosophy lent respectability to arts hostile to the Catholic faith. Per the Content Truth Policy, these categories are shown as the bull's words (paraphrased), not softened or omitted — they are the historical record of the condemnation. Label them as the bull's categories.

**Claims the room must NOT present as verified fact:**

- That the condemnation was "written on 5 August 1487, but not issued until the following December" — conflicts with the bull's own 4 August 1487 dating; unverified; do not repeat.
- That the *Conclusions* was "the first printed book to be universally banned by the Church" / "the first book banned for printing" — Farmer's widely repeated claim; if mentioned at all, attribute to Farmer as a claim, not as independently verified fact.
- That "nearly all copies were burned" — widely repeated assertion; if mentioned, label as traditional, not verified.

**Apologia dating note (display on the *Apologia* panel):** Use **1487** for the *Apologia*, with the note: "Some tertiary sources give 1489; the 1489 date appears to conflate the *Apologia* with Pedro Garsia's *Determinationes magistrales contra conclusiones apologeticas* (Rome, 1489), the official rebuttal. Pending confirmation against Fornaciari's edition (2010) or Copenhaver (2022)." Do not silently pick one date.

### 3.7 Pico's life — only what explains the room

A single biographical wall, kept short, using only verified dates/facts:

- Born **24 February 1463** at Mirandola (Duchy of Mirandola, near Modena). Youngest son of Gianfrancesco I Pico, Lord of Mirandola and Count of Concordia, and Giulia Boiardo. The family claimed descent from Constantine — present as a family claim, not fact.
- Died **17 November 1494** at Florence, aged 31, on the same day Charles VIII of France entered Florence. Buried with Girolamo Benivieni at San Marco, Florence; Savonarola delivered the funeral oration.
- Education/circle (one line each): Bologna (1477, age 14, canon law, soon renounced); Ferrara (from 1479, philosophy and theology; met Poliziano, Benivieni, probably the young Savonarola); Padua (1480–1482, Hebrew and Arabic with Elia del Medigo); Florence (November 1484, met Lorenzo de' Medici and Marsilio Ficino); Paris (1485, citadel of Aristotelian scholasticism; probably there began the 900 Theses); Perugia/Fratta (1486, introduced to mystical Hebrew Kabbalah; the "Chaldean books … of Esdras, of Zoroaster and of Melchior, oracles of the magi" letter to Ficino — paraphrase).
- Later works (one line): *Heptaplus* (1489); *De ente et uno* (1491/1492); unfinished *Disputationes adversus astrologiam divinatricem* (12 books against divinatory astrology, published posthumously, Bologna 1495/1496). After Lorenzo's death (1492) he moved to Ferrara but continued to visit Florence; grew close to Savonarola, destroyed his own poetry, gave away his fortune, resolved to become a monk/friar (Dominican) — prevented by his early death.
- **Final views:** whether Pico "repented" or "renounced" his views at the end is disputed — present both, attributed, if the room covers his final years (one source: he never formally or explicitly renounced them; the hagiographic tradition says he turned wholly to piety). Do not pick a side silently.
- **Death — poisoning question:** 2007 exhumation of Poliziano and Pico from San Marco; forensic tests (Gallello et al., 2018) found Pico likely died of acute arsenic poisoning (intentional or otherwise), while evidence was insufficient to conclude the same for Poliziano. Present as a forensic finding with its caveats, NOT as a settled murder verdict. Whether the poisoning was deliberate, and by whom, is **unknown**.
- **Arezzo scandal (1486):** the attempt to run off with Margherita, wife of Giuliano Mariotto de' Medici; caught, wounded, imprisoned, released only through Lorenzo's intervention. INCLUDE — one factual paragraph, no sensationalizing (decided §10). It is part of the historical record (SEP + biographical tradition), not salacious invention, and it explains the Perugia/Fratta turning point where Pico encountered the Chaldean books and Kabbalah. Content Truth Policy forbids a silent omission.
- **Do NOT use:** the 1911 Britannica's physical description of Pico (tall, fair, grey eyes, yellow hair) or similar colour without a second source. No portrait may be labeled as a verified likeness unless its provenance is established.

### 3.8 Search

- **Search indexes:** the verified group structure (§3.2), the three verified thesis texts (§3.3), the Oration paraphrase (§3.5), the condemnation/aftermath panels (§3.6), the biography wall (§3.7), and the further-reading shelf (§3.9). Nothing else.
- **Search must NEVER synthesize a thesis.** A search for "Thesis 400" or any number without a verified text returns the gate card ("text held until verified against Farmer/Copenhaver"), not a generated or guessed thesis. A search for a topic (e.g., "friendship," "phantasm") returns the verified thesis if one matches, otherwise the relevant group panel.
- **Search results always carry evidence badges** (§3.8 below) and show whether the hit is Latin (verbatim), paraphrase, or a group description.
- Keyboard-accessible search; results navigable by keyboard; no search result may be displayed without its badge.

### 3.9 Evidence badges — every claim carries one

| Badge | Meaning | When used |
|---|---|---|
| **ATTESTED** | Verified verbatim Latin against a cited critical edition, or a verified count/date from the research report | The three Latin fragments; counts 900 / 402 / 498 / 115 / 16 / 45 / 119 / 72 / 17; dates 24 Feb 1463, Dec 1486, 6 Jan 1487, Feb 1487, 4 Aug 1487, 18 Jun 1493, 17 Nov 1494 |
| **PARAPHRASE** | Substance from a cited source, wording is the room's own | All Oration summaries; bull provisions; condemned-topic entries; Pico's Kabbalah claims; scholarly positions |
| **MODERN CONVENTION** | A later name, title, or framing — not Pico's own | "On the Dignity of Man" as title; "Prince of Harmony" nickname (with the Concordia pun explained); "Manifesto of the Renaissance" reading (attributed to the Burckhardtian tradition) |
| **SCHOLARLY READING** | A named scholar's interpretation, contested or not | Farmer on the Epiphany date / Second Coming hints / "first banned book"; Copenhaver on the Oration title / "never wrote a speech about dignity"; Bori on the three-stage vocation; Yates / Wirszubski / Edelheit positions |
| **TRADITIONAL — NOT VERIFIED** | Widely repeated, not established in the research | "Nearly all copies burned" (if shown); any hagiographic claim shown as tradition |
| **GATE — HELD** | Withheld until a named source is checked | Per-authority counts beyond the verified ones; the full list of the 13; any further thesis text |

- Badge placement: on the panel itself, adjacent to the claim, legible at phone size. No badge hidden in a tooltip as the only location.
- No panel may carry a claim without a badge. No badge may be faked to upgrade a paraphrase into an attested quotation.

### 3.10 Further-reading shelf

A wall shelf (true-3D books, spines only, no invented cover art) listing the key editions and scholars from the research report, with a one-line role for each:

- **Editions the room team must work from:** Farmer, *Syncretism in the West* (MRTS, 1998; rev. 2008) — corrected Latin text, first English translation, commentary. Copenhaver, *Nine Hundred Conclusions* (Harvard UP) — new critical Latin edition + contemporary English translation + commentary on each of the 900 theses.
- **Oration editions:** Bausi (2003, critical Latin text); Borghesi/Papio/Riva (Cambridge UP, 2012, in copyright); Copenhaver, *Life* + *Oration* (I Tatti, 2022, in copyright).
- **Apology editions:** Fornaciari (2010); Copenhaver, *Pico on Trial* (Oxford UP, 2022, in copyright).
- **Other editions:** Biondi (Olschki, 1995, Italian); Schefer (Allia, 1999, French); Droz (2008, Latin from Erlangen manuscript + *editio princeps*, collated with Vienna and Munich manuscripts).
- **Key scholars:** Garin; Cassirer; Dulles; Kibre; Yates; Wirszubski; Kristeller; Schmitt; Farmer; Bori; Bausi; Busi; Idel; Edelheit; Copenhaver.
- **Best public-domain sources:** 1911 *Encyclopaedia Britannica* entry; 1901 *Jewish Encyclopedia* entry; McClintock–Strong *Cyclopedia* entry; the Latin texts themselves (1486/1496 and all early editions).
- The shelf must NOT present any of these as if the room had quoted them verbatim where it has not. The shelf is a reading list, not a source claim.

---

## 4. Lived Practice — Stage the Disputation

### 4.1 The standing vision, applied honestly

Every museum room lets visitors act out that tradition's practices. Here the practice is **public disputation** — the formal, public, adversarial defence of stated conclusions before opponents, judges, and an audience. That is what Pico proposed: he offered to defend all 900 theses in public disputation against all comers, in the presence of the papal Curia.

### 4.2 The interaction — step by step

1. **Take the seat.** The visitor sits (virtually) at the disputation table, opposite the empty opponent's seat. The room states the form: "Pico offered to defend 900 conclusions in public disputation. The debate was blocked. Here you take his seat."
2. **Pick a thesis.** The visitor picks from the ONLY theses available for disputation:
   - The two verified thesis texts (Thesis 39; *amicitia est virtus*) — each playable in full.
   - OR a verified group (e.g., "the Aquinas theses," "the paradoxical conclusions") — played at group level, where the visitor defends/challenges the group's stated position as paraphrased on its panel.
   - The visitor may NOT pick an unverified thesis number. The picker shows only playable items; everything else shows the gate card.
3. **State a position.** The visitor chooses DEFEND or CHALLENGE, then states a position by picking from a short list of structured positions. Each position in the list must be traceable to the documented record:
   - For Thesis 39: positions drawn from the verified panel (Pico's formulation; Thomas's discussion as implied; Edelheit's finding that the formulation is not found in Thomas as such).
   - For *amicitia est virtus*: positions drawn from the Henry of Ghent / *Quodlibet* X, q. 12 panel.
   - For group-level play: positions drawn from the group's verified panel text (e.g., the paradoxical conclusions' concord claim; the Kabbalah panels' Pico-claims + caveat).
   - **No free-text position is answered as if Pico replied.** If the room accepts free text at all, it must be stored as the visitor's own note (see §4.3) and NOT answered by a simulated Pico.
4. **The room responds — from the documented record ONLY.** The room's response is assembled from three and only three sources:
   - (a) The thesis/group panel text itself (verified Latin + paraphrase + citations).
   - (b) The documented counter-position of the authority the thesis is attributed to, as stated on the panel (e.g., what Thomas's discussion implies; what Henry's *Quodlibet* holds).
   - (c) The documented historical outcome: the disputation was blocked; the commission repudiated the 13; the bull condemned the book. The room NEVER invents a verdict on the visitor's argument.
   - The response ends, every time, with the historical outcome: "This disputation never took place. In February 1487 the debate was halted; on 4 August 1487 the book was condemned." The visitor's exchange is framed as the debate that should have happened, not as a rewriting of history.
5. **The record.** The visitor's exchange is saved as a session note (local, per-device) with the thesis, the position taken, and the room's documented response — labeled as the visitor's own exercise, not as a historical event.

### 4.3 Hard limits — what the room must NEVER do

- **No invented Pico replies.** The room must NEVER generate dialogue in Pico's voice, put words in Pico's mouth, or simulate Pico defending a thesis. Pico's only words in the room are the verified Latin fragments and the paraphrases labeled as such.
- **No invented opponent replies.** No simulated Aquinas, Scotus, commission member, or pope speaking lines no source records.
- **No verdict on the visitor.** The room never declares the visitor "right," "wrong," "orthodox," or "heretical." It presents the documented positions and the historical outcome.
- **No free-text oracle.** The room is not a question-answering oracle. A visitor question that goes beyond the documented panels gets the honest answer: "The record does not contain an answer to that. Here is what the record does contain…" with a link to the relevant panel.
- **No gamified scoring.** No points, no ranks, no "you win the disputation." The exercise is scholarly, not competitive. (This is a deliberate difference from arcade games.)

### 4.4 Distinction from the Debate Hall — HARD BOUNDARY

| | 900 Theses room (this spec) | Debate Hall |
|---|---|---|
| **What it is** | An encounter with a TEXT and an EVENT | A back-and-forth DEBATE |
| **Interlocutor** | None. The room presents documented positions; no one "talks back" | A sustained back-and-forth exchange with a debate partner |
| **Scope** | One thesis (or one group) per exchange, anchored to its panel | Open-ended debate across topics, with sources in the room |
| **Ending** | Always ends at the historical outcome: blocked, condemned | Ends when the visitor ends it; no fixed historical outcome |
| **Voice** | No simulated voice of Pico or any historical figure | Its own debate format (per the Debate Hall spec — this spec does not define it) |

- The room must NOT duplicate Debate Hall mechanics (no turn-taking debate engine, no debate-partner persona, no debate scoring).
- Cross-link, don't merge: the room's exit panel points to the Debate Hall with the line: "To debate philosophy back-and-forth, go to the Debate Hall. Here you met the text and the event."
- If the Debate Hall spec changes, this room does not change with it. The boundary is structural, not cosmetic.

### 4.5 A second, quieter practice — the Oration reading (optional, low-cost)

- A candlelit reading niche where the visitor reads the full Oration paraphrase (§3.5) at their own pace, with the title-history panel beside it. No interaction required. This serves visitors who want contemplation rather than disputation, and it costs the build almost nothing beyond the panel.
- Label: "The speech that was never delivered — read it here."

---

## 5. Room Plaque

The plaque outside the room describing what takes place in it. Title + contents/activities text, in the house voice (respectful, wonder-first, stoic). Exact text for Claude to set:

**Title:** The 900 Theses — Pico della Mirandola, 1486

**Plaque text:**

> In December 1486, a twenty-three-year-old philosopher had 900 conclusions printed at Rome and offered to defend them all in public disputation, against any opponent, before the papal Curia. He promised to pay the travel expenses of scholars who came from far away. The debate was to open after Epiphany, 6 January 1487.
>
> It never took place. The debate was halted, thirteen theses were repudiated, and on 4 August 1487 a papal bull condemned the whole book — forbidding it to be read, written, printed, or heard, and ordering copies burned. Pico himself was personally cleared.
>
> Inside: the booklet itself, the two great blocks of theses — 402 drawn from earlier authorities and 498 Pico's own — the Oration that was composed as the opening speech and never delivered, the blocked disputation and the condemnation shown honestly, and a table where you may take Pico's seat and stage the disputation that never happened, from the documented record only.
>
> The theses are bare conclusions, written to be argued live. Here you argue one.

**Plaque notes for the build:**

- The plaque must NOT name "the 13" (see §3.6 hard block).
- The plaque must NOT call the Oration "On the Dignity of Man" as if that were Pico's title. If a short title is needed on the plaque's header, use "The 900 Theses" and refer to the speech as "the Oration."
- The plaque carries the same evidence discipline as the room: counts and dates on the plaque are all verified (see §3.9).

---

## 6. Grand Directory + Atlas Entries

### 6.1 Grand Directory entry

**Marker:** The room appears on the Directory floor plan at its threshold position between the High Medieval and Early Modern wings — drawn straddling the boundary line, not inside either wing. The boundary line itself is drawn through the room's floor.

**Directory card (exact text for the tap-to-open parchment card):**

- **Name:** The 900 Theses — Pico della Mirandola, 1486
- **One line:** "Nine hundred conclusions, a disputation that never happened, and the book that was condemned. Take Pico's seat."
- **Wing:** Threshold — High Medieval / Early Modern boundary
- **Markers on this room:** Disputation table (scholarly practice — see §7); booklet relic; Oration text (reading niche, §4.5); condemnation moment.
- **Count note:** This room is number 84 in the updated Directory count (see §1.4).

**Legend text (exact text for the Directory legend panel):**

Add to the legend, under a new or existing "Rooms" heading:

> **Threshold room** — a room that stands on the boundary between two eras, entered from one and exited into the other. The 900 Theses room is the museum's first threshold room.
>
> **Disputation table** — a scholarly practice marker (see §7). This room's practice is public disputation: the formal defence of stated conclusions. It is a scholarly exercise, not a religious rite.

**Directory build notes:**

- The Directory's "whispers" (Easter-egg) system: this room carries NO Easter egg at launch. Do not invent one. If an egg is later approved for this room under the standing one-egg-per-chapter programme, it is added as a labeled update, never silently.
- The Directory must update its room count from 83 to 84 everywhere (§1.4). The Directory's data source is the museum manifest — the room must be added to the manifest, not hard-coded into the map.
- Journey plotting must route through the threshold room in both directions (High Medieval → Theses → Early Modern, and reverse).

### 6.2 Atlas entry

**What the Atlas carries for this room:**

The Atlas is the world map (where traditions come from); the Directory is the museum map (where things are). A museum room does not get a room-shaped entry on the world map. It gets **geographic anchor points** — the real places where the room's story happened — plotted on the world map with the room as their destination.

**Anchor points (all verified):**

| Atlas pin | Place | Why it is pinned | Date |
|---|---|---|---|
| **Mirandola** | Mirandola, near Modena (Duchy of Mirandola) | Pico's birthplace; origin of the story | Born 24 Feb 1463 |
| **Rome** | Rome | The booklet printed here (Dec 1486); the planned disputation site; the condemnation bull given here (4 Aug 1487) | 1486–1487 |
| **Florence / Fiesole** | Florence; Fiesole | Pico's base under Lorenzo's protection; return summer 1488; death 17 Nov 1494; burial at San Marco | 1488–1494 |

**Atlas card (exact text for the tap-to-open card on the Rome pin — the primary pin):**

- **Name:** Rome, 1486–1487 — The 900 Theses
- **One line:** "Printed here in December 1486. The disputation was to open here after Epiphany 1487. It was halted; the book was condemned here on 4 August 1487."
- **Museum link:** "Walk the room: The 900 Theses — threshold between the High Medieval and Early Modern wings."

**Atlas build notes:**

- The Florence pin carries the Florence/Fiesole dates (1488 return, 1494 death); the Mirandola pin carries the birth date. The Rome pin is the primary pin for this room (1486–1487), per the room's subject.
- **World-map logic, stated for the build:** the Atlas pins are places, not rooms. Tapping a pin shows what happened there and links into the museum room. The Atlas does not duplicate the room's panels.
- Optional secondary pins (only if the Atlas already plots this kind of journey detail — do not add a new pin system for this room): Paris (1485, where Pico probably began the theses); Vincennes (1488 detention). If added, each carries its verified date and one line, with the same evidence badges. If the Atlas does not support journey pins, omit them — do not build a new feature for one room.
- The Atlas must NOT plot a pin for a place whose role is unverified (no printer's workshop, no guessed disputation hall address).

---

## 7. Practice-Room Marker

**YES — this room carries a practice marker. It is a SCHOLARLY practice marker, NOT a religious-practice marker.**

- **Marker type:** `scholarly-practice — disputation`
- **Marker label (exact):** "Scholarly practice — public disputation"
- **Why it is distinct:** The disputation is a scholarly practice (the formal public defence of conclusions in a university/curial setting), not a religious rite. It involves no prayer, no sacrament, no worship, no ritual observance. Labeling it as a religious practice would misrepresent both the disputation and the rooms whose practices ARE religious rites.
- **Directory legend handling:** The legend must show the scholarly-practice marker as a SEPARATE marker type from the religious-practice markers, with the §6.1 legend text. Do not fold disputation into the religious-practice marker family.
- **Atlas handling:** The Atlas does not carry practice markers for museum rooms; practice markers live on the Directory and on the room plaque only.
- **Room plaque handling:** The plaque (§5) states the practice in plain words ("a table where you may take Pico's seat and stage the disputation") without using a religious-practice term.

---

## 8. Protection + Accuracy

### 8.1 Checksums / source citation per thesis group

- **Every thesis group panel carries a source citation** naming the edition and page/section the grouping and counts were verified against (Farmer 1998 / Garcia's review of Edelheit / SEP-Copenhaver, as specified in the research report). No group panel ships without its citation.
- **Checksum rule for the thesis dataset:** The room's thesis data file (whatever form Claude gives it) must carry a per-group checksum or version stamp that covers: group name, count, each thesis text, each paraphrase, each citation, each badge. On load, the room verifies the checksum; a mismatch renders the affected group as GATED (with the gate card), never as silently altered or silently missing text. Claude to implement per the house build standard — this spec does not dictate the checksum algorithm, only the behaviour: mismatch = gated, never silent.
- **Total-count invariant:** 402 + 498 = 900 must hold in the data file. If it does not hold, the room renders the browsing tree as gated and flags the error. The room must never display a total other than 900.

### 8.2 No silent edits — errata only

- **Any correction to room content is a labeled erratum, never a quiet change.** The room carries a visible Errata panel (wall panel + a line in the room's data file) listing: date of correction, what changed, why, and the source that justified the change.
- Examples of changes that REQUIRE an erratum entry: a newly verified thesis text; a corrected count after the Farmer/Copenhaver gate passes; a corrected date; a replaced paraphrase.
- The Errata panel is itself evidence-badged. Corrections that merely fix typos in the room's own prose (not in quoted/paraphrased source material) are logged as typo fixes, not as errata — but the log still exists.
- **Never:** silently swapping a paraphrase, silently dropping a panel, silently changing a count, silently "improving" a Latin quotation. Per the Content Truth Policy, silent omission is banned.

### 8.3 Code-theft deterrence (Protection Program)

Per the Protection Program (ready line item 1) and the standing code-protection file:

- **Obfuscation pipeline** for shipped room code (same pipeline as the rest of the museum — Claude to confirm the in-repo pipeline; this spec does not prescribe a tool).
- **No public source maps.** Shipped code ships without source maps.
- **Watermarking:** a copyright header on shipped files; a discreet in-room watermark (e.g., in the room's credit line: "The Divine Archives — The 900 Theses Room").
- **No client-side secrets.** The room contains no keys, tokens, credentials, or private endpoints. The thesis data file contains only public historical content + citations.
- **Honest baseline (stated in the spec so no one over-promises):** client-side code can never be truly unhackable. The measures above deter and evidence theft; they do not prevent a determined reader. Do not claim otherwise in room copy or build notes.

### 8.4 Translation-licensing gate — HARD RULE

- **NO verbatim modern-translation text ships without legal/licensing review.** This covers: Farmer's English translation of the 900 Theses (1998/2008, in copyright); Copenhaver's English translations (2022, in copyright); Borghesi/Papio/Riva Oration translation (Cambridge UP, 2012, in copyright); Wallis Oration translation (1965; treat as in copyright pending review); the WM Review English translation of the bull (modern translation — do not quote verbatim; paraphrase).
- **Default display mode (what ships): verified Latin + fresh labeled paraphrase.**
  - Latin original (1486 *Conclusiones*; 1496 Oration; 1487 bull) is **public domain** — may be quoted verbatim, BUT every Latin quotation must still be verified verbatim against a critical edition (Farmer / Copenhaver / Bausi) before display. Do not transcribe from memory.
  - Paraphrases are written fresh in-house, labeled PARAPHRASE, and never copied from a modern translation or from a modern scholarly summary's sentences (summaries in copyright — paraphrase the substance, do not copy sentences).
- **Waite (1929) exception — conditional:** Waite's translation of the *Conclusiones Cabalisticae* in *The Holy Kabbalah* (1929) is public domain in the United States (1929 publications entered US public domain 1 January 2025). It may be used verbatim ONLY after BOTH: (a) the licensing review confirms PD status, and (b) a scholarly check against Farmer/Copenhaver confirms accuracy. If used, label as "Waite (1929), public-domain translation, checked against Farmer/Copenhaver." Waite is a 1929 occultist translator, not a modern critical scholar — his commentary must NOT be presented as scholarship.
- **Licensing review is a named gate** (§10). The room does not ship with any modern-translation verbatim text on the assumption that review "will happen later."

---

## 9. House Standards

- **Stack:** Vanilla ES6+ modules or Web Components. Zero npm/CDN dependencies. Inline styles per the standing build standard. No framework, no external font loading from a CDN (fonts must be served from the site's own assets per the asset-decoupling rule, or from a verified in-repo source — Claude to confirm against the in-repo standard).
- **Performance:** Mobile DPR capped at **1.0**. Guarded render loop. Expensive processing bypassed on low-power devices. Low-poly/2D fallback ONLY where the standard permits it — the relic, lectern, and room shell must remain true 3D; a fallback that flattens the relic to 2D does not meet the standard. Context-loss handling: never a silent white canvas — show a labeled recovery state.
- **Deterministic teardown:** Every component implements a deterministic destructor (`destroy()` / `disconnectedCallback()`) disposing geometries, textures, materials, listeners, and animation frames. No leaks on room exit.
- **Keyboard / touch parity:** Every interaction (booklet page-turn, group browsing, search, disputation picker, Oration reading) works by touch AND by keyboard AND (where the site supports it) by pointer. No touch-only gesture. Focus order follows the room's reading order. Reduced-motion respected (no forced camera motion; candle flicker and page-turn animation reduce to crossfade under reduced-motion).
- **Evidence labeling on every claim:** See §3.9. No unbadged claim ships.
- **No flat 2D where true 3D is the standard:** The booklet, lectern/table, candles, wall panels, and room shell are true 3D. Text panels are 3D-mounted objects (modeled frames on walls), not flat overlays pasted on the screen — except where the site's accessibility layer requires a readable text alternative, in which case the alternative is labeled as an accessibility rendering of the same panel, with identical text and badges.
- **Neutrality / integrity:** Dynamic data mapping through a neutrality validator per the standing build standard; failed checks reject the change. Rate-limit retry fail-safe.
- **Reversibility:** Every state change / animation / layout translation registers an explicit inversion (forward owns a structurally identical reverse) per the standing build standard.
- **Asset decoupling:** Absolute `/assets/...` pointers passed as construction config. No hard-coded asset paths inside room logic.
- **Ledger:** Append-only per-instance ledger state caching, mapped to canonical schemas, per the standing build standard.
- **Naming:** All room strings, code identifiers, and file names follow the Naming & IP Policy — generic names only. The room's own title uses the historical name (*Conclusiones nongentae* / "The 900 Theses") — a public-domain historical title, not a trademark.

---

## 10. Build Gates — What Must Happen Before This Room Ships

These are HARD gates. The room does not ship until each gate it depends on is passed. A gate is passed by a named verifier with a capture (see-first rule) — not by assertion in a brief.

### Gate A — Farmer / Copenhaver extraction (REQUIRED before any per-thesis display beyond the three fragments)

- Obtain Farmer (1998) and/or Copenhaver (*Nine Hundred Conclusions*, Harvard UP).
- Extract and verify: (1) the full per-authority numbering for the 402 (per-group counts for Greek Platonists, Arabic Aristotelians, Greek Aristotelians, Pythagoras, Cabalists, Hermes, Chaldeans); (2) which division the 119 Cabalist theses fall into; (3) the verified Latin text + numbering for every additional thesis the room will display; (4) the full list of the 13 condemned theses from the *Apology* (if the room is ever to display it — until then the §3.6 hard block stands).
- Each extracted item carries its edition + page/number citation into the room's data file (§8.1).

### Gate B — Licensing review (REQUIRED before any modern-translation verbatim text ships)

- Confirm: Farmer / Copenhaver / Borghesi-Papio-Riva / Wallis copyright status and whether any permission is sought; Waite (1929) US public-domain status; bull Latin text checked against the Vatican Register text (the WM Review translation is AI-assisted with human line-checking — do not quote it).
- Until Gate B passes, the room ships in default mode: verified Latin + fresh labeled paraphrase (§8.4). The gate passing does NOT retroactively license text that was already written from a modern translation — any paraphrase suspected of copying a modern translation's wording must be re-written fresh.

### Gate C — Manifest + Directory + Atlas confirmation (REQUIRED before placement ships)

- Claude confirms the threshold slot against the in-repo museum manifest; the Directory count update (83 → 84); the Directory legend/marker additions; the Atlas pins. Capture-verified by a named verifier.

### Gate D — Capture-verified build check (REQUIRED before delivery)

- Per the see-first rule: the built room is inspected in a real browser (living site, actual artifact), with captures, by a named verifier, before it is presented as done. The verification covers: the booklet renders in true 3D; the three Latin fragments display with correct badges; the gate cards render where text is held; the "13" list is absent; the bull panel states "book condemned, Pico personally cleared"; the disputation interaction produces no invented Pico/opponent dialogue; keyboard/touch parity works; teardown disposes cleanly.

### Decided by Carter (2026-10-16 — "Do what makes sense," calls made on the evidence)

1. **Arezzo scandal: INCLUDE — one factual paragraph (§3.7), no sensationalizing.** It is part of the historical record (SEP + biographical tradition), not salacious invention, and it explains the Perugia/Fratta period where Pico encountered the Chaldean books and Kabbalah — the turning point toward the 900 Theses' syncretism. Content Truth Policy forbids a silent omission; the paragraph is attributed and factual.
2. **Oration audio: TEXT-ONLY, no voice.** A spoken paraphrase would be heard as Pico's own words, and no verbatim modern-translation text is cleared for use. Text-only with labeled paraphrase + the title-history warning keeps the VERBATIM/PARAPHRASE line intact. The room's lived practice is the disputation, not listening to the Oration.
3. **Waite (1929): YES, USE IF Gates A + B pass — labeled.** Waite's *Conclusiones Cabalisticae* translation is the only public-domain English translation of the Cabalist theses and unlocks the 119 (including the culminating 72), the heart of Pico's Kabbalah program. Conditions: licensing review + scholarly accuracy check must pass first; every Waite rendering labeled "Waite 1929, public domain" with the caveat that it is a Theosophist-era translation with known idiosyncrasies. If the gates fail, the room stays with verified Latin + fresh paraphrase.

---

## Appendix — Quick Reference: Verified Numbers and Dates (for Claude's data file)

| Item | Value | Evidence |
|---|---|---|
| Total theses | 900 | Attested |
| Attributed to authorities | 402 | Attested |
| Pico's own | 498 | Attested |
| Latin philosophers/theologians | 115 (first 115) | Attested |
| — Albert the Great | 16 | Attested |
| — Thomas Aquinas | 45 | Attested |
| — Mayronnes / Scotus / Henry of Ghent / Giles of Rome | counts NOT verified | Gate — held |
| Cabalist theses | 119 total, incl. final 72 | Attested (division NOT pinned — do not place in either block) |
| Paradoxical conclusions (own block) | 17 | Attested |
| Commission finding | 6 suspect + 7 condemned = 13, then all 13 repudiated | Attested |
| Pico born | 24 Feb 1463, Mirandola | Attested |
| Theses printed | Dec 1486, Rome | Attested |
| Planned disputation | After Epiphany, 6 Jan 1487 | Attested |
| Debate halted / commission | Feb 1487 | Attested |
| Bull of condemnation | 4 Aug 1487, Rome, St Peter's | Attested |
| Flight / arrest / Vincennes | 1488 | Attested |
| Return to Fiesole | Summer 1488 | Attested |
| Absolution (Alexander VI brief) | 18 Jun 1493 | Attested |
| Pico died | 17 Nov 1494, Florence, aged 31 | Attested |
| Oration composed | 1486, never delivered | Attested |
| Oration first published | 1496, Bologna, as *Oratio quaedam elegantissima* | Attested |
| *Apologia* | 1487 (tertiary sources give 1489 — see dating note) | Attested with note |
| Directory room count | 83 → 84 with this room | Flag (§1.4) |

**Hard blocks restated (for the build checklist):** no list of "the 13" · no per-authority counts beyond the verified ones · no thesis text beyond the three fragments until Gate A · no verbatim modern-translation text until Gate B · no "On the Dignity of Man" as Pico's title · no printer name · no "72 physics theses" · no "first banned book" / "nearly all copies burned" as verified fact · no invented Pico/opponent dialogue · no silent edits (errata only) · no Directory count left at 83.
