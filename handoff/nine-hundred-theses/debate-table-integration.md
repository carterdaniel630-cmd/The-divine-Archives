# The 900 Theses at the Debate Hall Table — Integration Specification
## The Divine Archives · Museum · 2026-10-16 · For Claude Code

**Status:** DESIGN SPEC — no code. Companion to `debate-hall-spec.md` (the base
spec). Implements Carter's order: the Theses get their own museum room AND
are offered at the philosophical Debate Hall table.

**Binding policies this spec obeys:**
- `content-truth-policy.md` — verbatim accuracy, no sanitization, no invented
  quotes. This integration is where the policy is most load-bearing after the
  base hall: Pico's theses are bare conclusions whose sense was meant to be
  fixed in live disputation. The table must never present a thesis as a flat
  assertion without its tier, its group, and its citation.
- `naming-and-ip-policy.md` — generic names throughout. No trademarked or
  "X-style" phrasing anywhere in station copy, code identifiers, or file names.
- Modular Framework Standard (8 clauses) + Artistry Standard (5 parameters):
  vanilla ES6, zero external requests, scoped CSS, `destroy()` teardown,
  mobile DPR 1.0, keyboard operation, `prefers-reduced-motion`.

**Single source of truth.** All factual claims in this spec come from
`nine-hundred-theses/research-report.md` (the verified research foundation).
Where that report says "do not display until established," this spec carries
that as a **hard build block** — the build must not ship the item, must not
work around the block with a plausible substitute, and must not silently
omit the gap. Gaps are displayed as gaps (see §1.4, §7).

**Why this integration is deterministic, not generative:** same reason as the
base spec (§ "Why the pilot is deterministic"). A generative backend cannot
guarantee it will never invent a Pico quotation, a thesis text, or a
condemned-thesis list. The Pico persona is a deterministic dialogue engine
speaking only from an authored, audited corpus. A generative backend may
attach later behind the same utterance-tier system (§6 of the base spec).

---

## 1. How the Theses are offered at the table

### 1.1 The call: a 16th station, different in kind

**Pico's Theses become a 16th station — Station 16, "The Disputation."**
They do NOT fold into the existing ring of 15, and they do NOT displace any
of the 15 debates.

Justification — the Theses station differs from the existing 15 in kind,
not just in topic:

1. **It offers a corpus, not a question.** Each of the 15 stations poses one
   question with positions to defend. The Theses station offers a browsable
   body of 900 conclusions in two blocks (§1.3) plus a curated debate set
   (§3). Folding that into a single existing station would misrepresent it
   as one question; displacing an existing debate to make room would destroy
   content Carter already approved.
2. **It stages a historical event, not a timeless question.** The station
   re-stages the January 1487 Roman disputation that never happened — a
   dated, placed, blocked event with a real opponent (the papal commission)
   and a real aftermath. None of the 15 stations carries that event shape.
3. **The opponent is fixed.** In the 15 debates the visitor chooses an
   opponent from the philosophers who held the opposing position. At the
   Theses station the opponent is Pico himself (challenger mode, §5.1) or
   the 1487 commission (defender mode, §5.2). There is no opponent menu to
   fold into the existing flow.

**Required coordinated change to the base spec.** The base spec §1 says
"Fifteen questions have outlived everyone who ever asked them" and describes
"fifteen debate stations inscribed around the ring wall." Adding Station 16
requires amending the base spec's room shell:

- The ring becomes **15 question stations + 1 disputation station**.
- Station 16 is visually distinct: a different stone treatment (a darker,
  unlit-looking stone that ignites only when chosen — the disputation that
  never happened, kindled at last) and a distinct inscription (see §1.2).
- The orientation line becomes: *"Fifteen questions have outlived everyone
  who ever asked them — and one disputation that never happened. Choose one
  — and choose who will answer for the other side."* (HALL copy, authored
  for this spec; not attributed to any historical figure.)
- The ring geometry must seat 16 stations. If the built ring geometry
  cannot take a 16th station without breaking the room, the fallback is NOT
  folding into the 15 — it is a **disputation annex marker** on the ring
  wall (same inscription, same station UI on activation) that leaves all 15
  stations untouched. Claude: record which option was built in the build
  notes; the station's behavior is identical either way.

### 1.2 Station identity

- **Station name:** The Disputation — Pico's 900 Theses.
- **Inscription (carved-stone lettering, per base spec §1):** *"Rome, 1487 —
  the disputation that never happened."* (HALL copy.)
- **Flame:** Pico's soul-flame (§2.1) ignites above Station 16 when the
  station is chosen, exactly as other philosophers' flames ignite above
  their stations in the base spec.
- **Station card (on tap, before debate starts):** one HALL-tier panel —
  what the station is (a re-staging of Pico's offered 1487 disputation),
  what the visitor can do (browse the theses by group; debate a curated
  thesis topic), and the honesty note (§1.4). No biography here: the 900
  Theses room carries Pico's life. The station carries only what the debate
  needs.

### 1.3 Browsing the theses from the table (by group)

The visitor browses the Theses from the table in a **two-block browser**
that mirrors the verified 402 + 498 structure. The browser shows GROUPS,
not 900 individual thesis cards — see the hard scope gate in §1.4.

**Block I — "From the authorities" (402 theses).** Conclusions Pico
attributed to earlier authorities, "according to the doctrine of…"

| Group (as displayed) | Count shown | Notes for the build |
|---|---|---|
| Latin philosophers and theologians | **115** (verified) | The first 115 theses. Six scholastic masters: Albert the Great, Thomas Aquinas, Francis of Mayronnes, John Duns Scotus, Henry of Ghent, Giles of Rome. |
| — Albert the Great | **16** (verified) | Subgroup of the 115. |
| — Thomas Aquinas | **45** (verified) | Subgroup of the 115. Pico's main source appears to have been Aquinas's commentary on Peter Lombard's *Sentences*, not the *Summa Theologiae* — display as a scholarly note (PARAPHRASE, after Edelheit via Garcia), not as Pico's claim. |
| — Mayronnes, Scotus, Henry of Ghent, Giles of Rome | **No counts shown** | Counts NOT verified. Display the four names with the label "counts pending verified edition" — never a guessed number. |
| Greek Platonists | **No count shown** | Name only. Per-group count NOT verified. |
| Arabic Aristotelians | **No count shown** | Name only. Per-group count NOT verified. |
| Greek Aristotelians | **No count shown** | Name only. Per-group count NOT verified. |
| Pythagoras | **No count shown** | Name only. Per-group count NOT verified. |
| Cabalists | **See Cabalist note below** | Do NOT assign to Block I or Block II. |
| Hermes Trismegistus | **No count shown** | Name only. Per-group count NOT verified. |
| Chaldean theologians | **No count shown** | Name only. Per-group count NOT verified. |

**Block II — "Pico's own conclusions" (498 theses).** Pico's own opinions
(*secundum propriam opinionem*), on theology, metaphysics, mathematics,
and magic.

| Group (as displayed) | Count shown | Notes for the build |
|---|---|---|
| Pico's own conclusions | **498** (verified) | Block total only. |
| Paradoxical conclusions (reconciling Aristotle and Plato, then other masters who seem to disagree most) | **17** (verified) | Subgroup of the 498. The first paradoxical conclusion — that there is no natural or divine question on which Aristotle and Plato do not agree in sense and substance, though they seem to differ in words — is PARAPHRASE only (Latin not verified verbatim). |
| Magic theses | **No count shown** | Named as a subject area of Block II. No count verified. |

**Cabalist theses — cross-cutting tag, NOT a block member.** 119 of the
900 are Cabalist in content, including the final and culminating 72
(verified, SEP/Copenhaver). The research report does NOT establish which
of the two great divisions (402 vs. 498) the 119 fall into. The table must
therefore display "Cabalist theses — 119, including the final 72" as a
**content tag spanning the corpus**, never filed under Block I or Block II,
with the label "block placement pending Farmer/Copenhaver check." The
suggestive parallel between the 72 and the traditional 72 names of God
from Exodus 14:19–21 is a scholarly note, NOT a claim by Pico — display
only with that attribution, or omit.

**What tapping a group shows.** A GROUP CARD: group name, verified count
where one exists (or the "pending" label where none does), a short
PARAPHRASE description of what the group covers, and its source citation
(Farmer 1998 via Garcia; SEP/Copenhaver; Klibansky — per the research
report). The group card links to the curated debate topics drawn from that
group (§3). It does NOT list individual thesis texts — see §1.4.

**What tapping the curated topics shows.** The curated debate set (§3) is
the table's debate entry point. Each topic card shows: topic, thesis
group, Pico's documented position (tier-labeled), the opposing position
(tier-labeled, attributed), and source citation. Tapping a topic loads it
on the table and starts the disputation (§5).

### 1.4 Hard scope gate: what the table must NOT render

- **No 900 individual thesis cards.** Until the per-authority numbering and
  the individual thesis texts are extracted from Farmer (1998) or
  Copenhaver (Harvard UP), the table renders groups + the curated topics +
  exactly two individual verified theses (§4.1). Any UI that implies "browse
  all 900 theses" is forbidden — it would be browsing invented content.
- **No per-group counts beyond the verified ones** (115 Latin, 16 Albert,
  45 Aquinas, 17 paradoxical, 119 Cabalist incl. final 72, 402/498/900
  totals). Every other number is a blank with a "pending" label, never a
  guess.
- **No "72 theses describing a complete system of physics."** This claim
  (one tertiary source) appears to confuse the 72 Cabalist theses with
  another group. It is EXCLUDED. Do not display it.
- **No printer of the 1486 edition.** Not verified. Do not name one.
- **No "first printed book universally banned" / "nearly all copies
  burned" as fact.** These are widely repeated claims (Farmer's claim /
  traditional assertion). If either appears anywhere in table copy, it must
  carry its attribution ("Farmer's widely repeated claim" / "traditional
  account, not verified") — or be omitted.
- **No thesis displayed as "Thesis N" in Latin or English** unless its text
  is verified verbatim against Farmer (1998) or Copenhaver AND its
  numbering confirmed. Paraphrases are labeled PARAPHRASE.

**Expansion path (designed-for, not built).** When the Farmer/Copenhaver
extraction lands, the group browser gains verified individual thesis cards
(Latin + fresh paraphrase + citation + checksum, §7) and the curated set
grows. The data shape must accept new verified theses without a UI
rewrite. Until then, the gate above stands.

---

## 2. Pico as a debate persona

### 2.1 Soul-flame identity

Per base spec §1.1: no faces, no bodies, no portraits. Pico is present as
a soul-flame with the dialogue text bubble floating above it.

- **Flame:** radiant pale-gold outer flame with a violet-white core.
  Distinct from the Stoic warm gold (deeper amber, no violet) and the
  mystic deep blue. The violet-white core marks concord — many traditions,
  one light — without borrowing any tradition's emblem.
- **Consistency rule:** this exact flame (pale gold + violet-white core) is
  Pico's identity EVERYWHERE he appears — Debate Hall Station 16, the 900
  Theses room, plaque, pantheon entry. If any existing philosopher already
  uses this combination, Claude must pick the nearest distinct hue, record
  the final choice in the build notes, and apply it uniformly. The rule is
  consistency, not the specific hex value.
- **Character:** the flame burns steady and bright; it quickens (flicker
  follows text reveal, per base spec) when Pico cites a source or states a
  conclusion, and settles while the visitor reads or types. It never
  flares aggressively: Pico invited his opponents and offered to pay their
  travel — courtesy is in character.
- **Epithet (label, not quotation):** *Princeps Concordiae*, "Prince of
  Harmony" — what his friends called him, a pun on Prince of Concordia.
  Display as an attributed epithet, never as Pico's self-title.

### 2.2 Persona pack — sources ONLY from the documented record

The Pico persona pack is built from these sources and no others:

| Source | What the persona may draw on | Tier |
|---|---|---|
| The Theses, as verified | The two verified individual theses (§4.1); the verified group structure and counts (§1.3); the verified closing announcement (§4.1) | VERBATIM (Latin) where text is verified; PARAPHRASE otherwise |
| The Oration (planned opening speech, 1486) | Core arguments per research-report §3.3, all as paraphrase; the title history (§2.5) | PARAPHRASE only — never verbatim modern translation |
| The Apologia (1487) | Defenses of the condemned theses — available ONLY as HALL-tier source cards (§2.4, §5.2), never as Pico's in-character speech | HALL-tier source cards |
- **Apologia dating caveat:** use 1487, with the note that some tertiary sources give 1489 — the 1489 date appears to conflate the *Apologia* with Pedro Garsia's *Determinationes magistrales contra conclusiones apologeticas* (Rome, 1489), the official rebuttal. See room-spec §3.6 Apologia dating note. Do not silently pick one date.
| Letter to Ermolao Barbaro (1485) | Defense of scholastic technical terminology against humanist critics of "barbaric" scholastic Latin | PARAPHRASE |
| Letters (as verified in the research report) | The Perugia/Fratta letter to Ficino on the Chaldean books; the travel-expenses offer in the closing announcement | PARAPHRASE (letters) / VERBATIM (announcement) |
| Later works (within his life) | *Heptaplus* (1489), *De ente et uno* (1491/1492), opposition to divinatory astrology (*Disputationes*, published posthumously) — as general positions, paraphrased | PARAPHRASE |

**Temporal stance (critical).** In-character Pico speaks as the disputer
on the eve of the disputation (late 1486 / early 1487 posture). He does
NOT know the condemnation, the *Apologia*, his arrest, the 1493
absolution, or his death. Those belong to the hall, not to Pico:

- The hall (HALL tier) may narrate the outcome at the station card, in
  closing, or in source cards: the disputation was blocked, the commission
  condemned 13 theses then the whole booklet, Pico was absolved in 1493.
- Pico-the-persona never narrates his own aftermath, never "learns" the
  outcome mid-debate, and never speaks from beyond 1494.

### 2.3 Opening statement (tier-labeled)

When a debate starts, the hall sets the scene (HALL), then Pico speaks.
The opening has three fixed parts:

1. **HALL scene-setter (italic, dimmer, per base spec §2.2):** the hall
   names the event — Rome, the winter of 1486–87, a young count who
   printed 900 conclusions and offered to defend them against all comers,
   paying his opponents' travel — and notes the disputation never took
   place. The hall also states the debate's rule: no winner will be
   declared.
2. **Pico's VERBATIM opening — the closing announcement (Latin).** The
   only verbatim Pico utterance in the opening, rendered as a pulled
   quote with citation:
   > VERBATIM · *Conclusiones*, closing announcement (1486) — *"Conclusiones
   > non disputabuntur nisi post Epiphaniam; interim publicabuntur in
   > omnibus Italiae Gymnasiis. Et si quis Philosophus aut Theologus, etiam
   > ab extrema Italia, arguendi gratia, Romam venire voluerit, pollicetur
   > ipse dominus disputaturus se viatici expensas illi soluturum de suo."*
   > (The Conclusions will not be disputed until after the Epiphany;
   > meanwhile they will be published in all Italian universities; and if
   > any philosopher or theologian, even from the ends of Italy, wishes to
   > come to Rome to argue, the disputer promises to pay his travel
   > expenses from his own funds. — paraphrase gloss, labeled as such.)
3. **Pico's PARAPHRASE opening (2–4 sentences, badge-labeled, never in
   quotation marks):** his concord program — that Plato and Aristotle use
   different words for the same concepts; that the schools can be
   reconciled; that he has set down 900 conclusions drawn from the Latin,
   Greek, Arabic, Hebrew, Chaldean, and Egyptian sages and from his own
   opinions, and invites the visitor to argue against any of them.
   Badge: `PARAPHRASE · after the Oration and the Conclusiones (see
   research-report §§1.1, 3.3)`.

The visitor then takes the first turn (free text + 2–3 suggested lines,
§5.3). Pico speaks first per base spec §2.1 — the three-part opening
above IS his first turn.

### 2.4 Positions the persona may defend (verified record only)

The persona may defend ONLY these positions, each tied to its source.
Anything else is off-corpus (§2.5, §5.4).

1. **Concord of Plato and Aristotle** — they agree in sense and substance
   though they seem to differ in words (first paradoxical conclusion,
   PARAPHRASE; Klibansky). Extended: concord of all schools of thought.
2. **The human being has no fixed form** — God gave every creature a fixed
   form except the human being, who was given free will and may sink to
   animals or rise to the divine; dignity lies in the capacity for
   self-transformation (Oration, PARAPHRASE; research-report §3.3).
3. **Ascent through philosophy** — philosophizing ascends the chain of
   being toward the angels and communion with God; failing to exercise the
   intellect, the human being vegetates (Oration, PARAPHRASE).
4. **Magic and Kabbalah as proof of Christ's divinity** — no science gives
   surer conviction of the divinity of Christ than *magia* and Kabbalah
   (condemned topic, PARAPHRASE; 1911 Britannica). With the standing
   caveat: Pico's Kabbalah came mediated through flawed and sometimes
   forged translations (Flavius Mithridates) — the hall shows the caveat
   panel alongside (§5.5), never hidden. Pico distinguished natural magic
   from demonic magic/necromancy (Apologia tradition, PARAPHRASE).
5. **Christ's descent *quoad effectum*** — Christ descended to the
   underworld not in His real presence but as to effect (condemned topic,
   PARAPHRASE; 1911 Britannica).
6. **No *latreia* to images or the cross** — no image or cross should
   receive the worship due to God alone, even in the sense allowed by
   Thomas Aquinas (condemned topic, PARAPHRASE; 1911 Britannica; Edelheit
   via Garcia).
7. **Origen more reasonably saved than damned** (condemned topic,
   PARAPHRASE; 1911 Britannica).
8. **Belief is not a free-will choice** — it is not in a man's free will to
   believe or disbelieve an article of faith as he pleases (condemned
   topic, PARAPHRASE; 1911 Britannica; cf. Apology Q8, "Is heresy
   willful?").
9. **Dionysian negative theology** — claims in "the mode of speaking of
   Dionysius" (e.g., of the form "God is not intellect") are legitimate
   negative theology, not heresy (Apologia defense tradition, PARAPHRASE;
   exact thesis text/number NOT verified — the persona may defend the
   *mode*, never a specific numbered thesis).
   **Cross-note (table vs. room — no contradiction):** the room spec
   (§3.6) lists the Dionysian topic as an attested condemned-topic
   paraphrase. The table carries the Dionysian *mode* as a defensible
   position but EXCLUDES the Dionysian topic as a standalone debate
   topic until verified. The room records the topic; the table excludes
   it as a topic. Both are correct for their function.
10. **Thesis 39 (Aquinas group)** — the phantasm is the secondary and
    instrumental agent in the production of an intelligible species
    (VERBATIM Latin available, §4.1). With the scholarly note: Edelheit
    finds this formulation is not found in Thomas as such but is implied
    in Thomas's discussion — Pico reworks his authorities rather than
    merely copying them. The persona may concede this point when pressed
    (it is in the record).
11. **Friendship is a virtue** — *amicitia est virtus* (Henry of Ghent
    group, VERBATIM Latin available, §4.1). Carried as a table pull-up
    card, not a debate topic (§3).
12. **Defense of scholastic language** — scholastic technical terminology
    is a legitimate instrument of philosophy, not "barbaric" Latin (letter
    to Barbaro, 1485, PARAPHRASE).
13. **Kabbalah as Pico understood it** — an angelic revelation / oral Torah
    confided to Moses and passed in secret through Esdras (Ezra); the
    mysteries of the Christian faith corroborated by Kabbalistic teaching
    (Pico's claims, presented AS his claims, PARAPHRASE). The hall's
    caveat panel (§5.5) always accompanies Kabbalistic claims.
14. **Opposition to divinatory astrology** (later work, PARAPHRASE) — the
    persona may hold this position; it is within his life and record.

### 2.5 What the persona must NEVER claim (hard blocks)

- **Never present a "13 condemned theses" list.** The papal bull does not
  enumerate the 13, and no accessible source gives a complete numbered
  list with verified texts. The persona may discuss the ~6 attested
  condemned *topics* (§3) as topics — never as a numbered list, never with
  invented thesis numbers or texts. If the visitor asks "what were the
  13?", the persona answers in PARAPHRASE that the bull does not list
  them, names the attested topics, and states the rest are not
  established. This is a HALL-supported answer (the hall shows the
  "unverified" flag on the card).
- **Never quote modern translations verbatim.** No verbatim Oration
  passages from Wallis (1965), Borghesi/Papio/Riva (2012), Copenhaver
  (2022), or any modern translation. No verbatim Farmer (1998) or
  Copenhaver translation of any thesis. The "maker and moulder" / chameleon
  language is PARAPHRASE only, never in quotation marks.
- **Never attribute positions Pico never held.** In particular: never
  present forged "pro-Christian" Kabbalistic texts as genuine Jewish
  sources; never present the 72-physics-theses claim; never present
  Copenhaver's contested reading ("never wrote a speech about the dignity
  of man") as Pico's own view — it is a scholarly position, shown as such.
- **Never present "On the Dignity of Man" as Pico's title.** The 1496
  heading was *Oratio quaedam elegantissima* ("A Very Elegant Oration");
  "On the Dignity of Man" is the later, conventional title (first used
  1557). The table's copy must say so wherever the title appears.
- **Never claim the disputation happened.** Never claim the Oration was
  delivered. Never claim Pico knew the condemnation outcome in character
  (§2.2).
- **Never speak past the 1494 cutoff.** Pico dies 17 November 1494. He
  knows nothing after that — no later scholarship, no modern readings, no
  2007 exhumation, no arsenic finding. The hall (HALL tier) may supply
  aftermath and scholarship; the persona may not.
- **Never claim the printer** of the 1486 edition, the "first banned book"
  claim as fact, or "nearly all copies burned" as fact (§1.4).
- **Never claim Pico repented or renounced his views** as settled fact.
  Sources disagree (Morello: he never formally or explicitly renounced
  them; the hagiographic tradition says he turned wholly to piety). If
  raised, present both, attributed, HALL tier.
- **Never claim the poisoning as a settled murder verdict.** The 2007
  exhumation / 2018 forensic finding (acute arsenic poisoning, intentional
  or otherwise) is HALL-tier material with its caveats; the persona never
  speaks of it.
- **Never invent disputation dialogue.** No fabricated exchanges between
  Pico and historical figures ("As I told Ficino…"), no invented letters,
  no invented thesis texts. If it is not in §2.2's sources, it does not
  exist for the persona.

---

## 3. Curated debate set

**NOT all 900.** Eight topics, chosen for debatability + verifiability.
Each entry states: topic, thesis group, Pico's documented position
(tier-labeled), the opposing position (documented historical opponent or
the 1487 commission's objections — never invented), and source citation.

**UI rule for all eight:** the table shows a TOPIC CARD for each topic.
Only Topic 8 has a verified individual thesis text and may show a THESIS
CARD (Latin + paraphrase + citation). Topics 1–7 show NO thesis number
and NO Latin thesis text — their thesis texts/numberings are not
verified. The card must visually distinguish TOPIC CARD (paraphrased
topic, no number) from THESIS CARD (verified text, numbered). This
distinction is a build requirement, not a nicety.

### Topic 1 — Does the human being have a fixed place in creation?
- **Group:** The Oration (opening speech for the disputation) — NOT a
  numbered thesis. Card labeled "Oration-anchored, not a numbered thesis."
- **Pico's position (PARAPHRASE, after Oration per research-report §3.3):**
  God gave every creature a fixed and immutable form — except the human
  being, who was created with no definite abode or form and given free
  will. The human being may sink to the level of animals or rise to the
  divine. Dignity lies in the capacity for self-transformation, not in a
  fixed station.
- **Opposing position (PARAPHRASE, documented):** the traditional
  microcosm view Pico rejects — that human beings hold a unique central
  place in creation as microcosms, and that dignity follows from that
  fixed station. (The Oration itself frames this as the view Pico argues
  against; SEP/Copenhaver.)
- **Sources:** Research-report §3.3 (Oration arguments); SEP (Copenhaver);
  EBSCO Research Starters (two-part form; "no definite abode or form").

### Topic 2 — Can Plato and Aristotle be reconciled?
- **Group:** Pico's own conclusions (498) — the 17 paradoxical conclusions.
- **Pico's position (PARAPHRASE, after Klibansky):** there is no natural or
  divine question on which Aristotle and Plato do not agree in sense and
  substance, even though they seem to differ in words. The schools use
  different words for the same concepts; concord, not disputation, is the
  path to saving wisdom.
- **Opposing position (PARAPHRASE, documented):** the schools as Pico
  found them — Platonists and Aristotelians (notably the Paduan
  Aristotelians of his own training) treating the two as opposed systems,
  and the scholastic habit of defending one master against the other.
  The hall frames this as "the state of the schools," not as a single
  invented opponent.
- **Sources:** Research-report §1.3 (17 paradoxical conclusions; Klibansky);
  §5.2 (Padua, Aristotelian centre); §6.1 (Farmer; Copenhaver).

### Topic 3 — Do magic and Kabbalah give the surest proof of Christ's divinity?
- **Group:** Condemned topic — among the theses condemned in 1487.
  Group/numbering NOT verified: card shows NO thesis number, NO Latin
  text. Card labeled "condemned topic — exact thesis text/number not
  established."
- **Pico's position (PARAPHRASE, after 1911 Britannica):** no science
  gives surer conviction of the divinity of Christ than *magia*
  (knowledge of the secrets of the heavenly bodies) and Kabbalah. Magic
  here is natural magic, not demonic invocation (Apologia tradition,
  PARAPHRASE).
- **Opposing position (PARAPHRASE, documented):** the 1487 papal
  commission condemned this thesis; the bull's categories include theses
  reviving pagan errors, fostering "the perfidy of the Jews," and lending
  respectability under natural philosophy to arts hostile to the Catholic
  faith (paraphrase of the bull's categories).
- **Sources:** Research-report §4.2 (topic 1); §4.3 (bull's categories);
  Grafton (Curia's reaction); §5.4 (Kabbalah caveat).
- **Standing caveat panel (§5.5)** accompanies this topic always.

### Topic 4 — Did Christ descend to the underworld in real presence, or as to effect?
- **Group:** Condemned topic — group/numbering NOT verified. Same card
  labels as Topic 3.
- **Pico's position (PARAPHRASE, after 1911 Britannica):** Christ descended
  *ad inferos* not in His real presence but *quoad effectum* (as to
  effect / in a virtual manner).
- **Opposing position (PARAPHRASE, documented):** the 1487 commission's
  condemnation; the traditional reading of real presence in the descent.
  (Framed as the commission's objection, not as a named individual's
  words.)
- **Sources:** Research-report §4.2 (topic 2).

### Topic 5 — Should images and the cross receive *latreia*?
- **Group:** Condemned topic — group/numbering NOT verified. Same card
  labels as Topic 3.
- **Pico's position (PARAPHRASE, after 1911 Britannica; Edelheit via
  Garcia):** no image or cross should receive *latreia* (the worship due
  to God alone), even in the sense allowed by Thomas Aquinas. This was
  tied to the question *de adoratione crucis et imaginum* discussed in
  the *Apology*.
- **Opposing position (PARAPHRASE, documented):** Thomas Aquinas's
  allowance of *latreia* in the qualified sense — Pico's position is
  explicitly framed against Aquinas's sense, so Aquinas is the documented
  intellectual opponent — plus the 1487 commission's condemnation.
- **Sources:** Research-report §4.2 (topic 3); §4.4 (Apology's treatment
  of *de adoratione crucis et imaginum*).

### Topic 6 — Is Origen saved or damned?
- **Group:** Condemned topic — group/numbering NOT verified. Same card
  labels as Topic 3.
- **Pico's position (PARAPHRASE, after 1911 Britannica):** it is more
  reasonable to regard Origen as saved than as damned.
- **Opposing position (PARAPHRASE, documented):** the 1487 commission's
  condemnation; the traditional view of Origen as damned.
- **Sources:** Research-report §4.2 (topic 4).

### Topic 7 — Is belief a matter of free will?
- **Group:** Condemned topic — group/numbering NOT verified. Same card
  labels as Topic 3.
- **Pico's position (PARAPHRASE, after 1911 Britannica):** it is not in a
  man's free will to believe or disbelieve an article of faith as he
  pleases.
- **Opposing position (PARAPHRASE, documented):** the 1487 commission's
  condemnation. The hall may also call up the *Apology*'s Question 8,
  "Is heresy willful?" (Copenhaver, *Pico on Trial*), as a HALL-tier
  source card — the question, not a verbatim answer, since Copenhaver's
  translation is in copyright.
- **Sources:** Research-report §4.2 (topic 5); §4.4 (Apology Q8 per
  Copenhaver).

### Topic 8 — What does the phantasm do in forming an intelligible species? (the scholar's debate)
- **Group:** Block I, Latin philosophers and theologians (115) — Thomas
  Aquinas subgroup (45). **Thesis 39.** This is the only curated topic
  with a verified numbered thesis text.
- **Pico's position (VERBATIM Latin + labeled gloss):** *"Phantasma est
  agens secundarium et instrumentale in productione speciei
  intelligibilis"* — the phantasm is the secondary and instrumental agent
  in the production of an intelligible species. Citation: Garcia, quoting
  Edelheit, p. 263 n. 184.
- **Opposing position (PARAPHRASE, documented):** the strict-Thomist
  reading — Edelheit finds this formulation is not found in Thomas as
  such but is implied in Thomas's discussion. The debate is Pico-as-
  interpreter vs. Thomas-as-written: does Pico faithfully render Aquinas,
  or rework him? The persona may concede the reworking point when
  pressed (it is in the record, §2.4 item 10).
- **Sources:** Research-report §1.4 (Thesis 39); §1.3 (Aquinas 45);
  Garcia reviewing Edelheit.

### Excluded candidates (and why)
- **Dionysian negative theology as a standalone topic** ("God is not
  intellect" / "an angel is not a man") — the *mode* is attested, but the
  exact thesis text and number are NOT verified. EXCLUDED as a topic
  until verified against Farmer/Copenhaver or the *Apology*. First
  candidate for expansion when the extraction lands. (The persona may
  still defend the Dionysian *mode*, §2.4 item 9.)
- **"Friendship is a virtue"** (*amicitia est virtus*, Henry of Ghent
  group) — verified verbatim, but thin as a standalone debate. Carried
  as a VERBATIM table pull-up card, not a debate topic.
- **The 72 culminating Cabalist theses as a topic** — too broad; no
  individual thesis texts verified. EXCLUDED as a debate topic. The
  Cabalist block is browsable as a group (§1.3) and Topic 3 covers the
  Kabbalah ground that is actually debatable from the verified record.
- **"72 theses describing a complete system of physics"** — unverified,
  apparently a confusion (§1.4). EXCLUDED absolutely.
- **Any other numbered thesis** — text and numbering not verified.
  EXCLUDED. The set grows only via the Farmer/Copenhaver extraction.

---

## 4. Utterance tiers applied to Pico

Every Pico-utterance carries a visible tier badge. No exceptions. This
extends base spec §2.2; the Pico additions are additive, not replacements.

### 4.1 VERBATIM for Pico — exactly three fragments, nothing else

Only the following are cleared for VERBATIM use at the table. All are
Latin (public domain). Each renders as a pulled quote with full citation.
No English rendering of any of these is VERBATIM — English glosses are
labeled paraphrase.

1. **Thesis 39 (Aquinas group):** *"Phantasma est agens secundarium et
   instrumentale in productione speciei intelligibilis"* — gloss: the
   phantasm is the secondary and instrumental agent in the production of
   an intelligible species. Citation: Garcia, quoting Edelheit, p. 263
   n. 184. (Topic 8.)
2. **Henry of Ghent-group thesis:** *"amicitia est virtus"* — gloss:
   friendship is a virtue. Citation: Garcia, quoting Edelheit, p. 329, on
   Henry's *Quodlibet* X, q. 12. (Table pull-up card, not a debate topic.)
3. **The closing announcement (subscription) of the 1486 booklet:**
   *"Conclusiones non disputabuntur nisi post Epiphaniam; interim
   publicabuntur in omnibus Italiae Gymnasiis. Et si quis Philosophus aut
   Theologus, etiam ab extrema Italia, arguendi gratia, Romam venire
   voluerit, pollicetur ipse dominus disputaturus se viatici expensas illi
   soluturum de suo."* — gloss: paraphrase per §2.3. Citation: Klibansky,
   citing *Opera* I, 56. (Opening statement.)

**Explicitly NOT VERBATIM:**
- The title-page scope description (disciplines + peoples): its Latin is
  verified as *existing* (Gazziero, citing Farmer 1998, pp. 210–211) but
  its text is NOT reproduced in the research report. Do NOT quote it
  until transcribed from Gazziero/Farmer and verified. Until then it is
  PARAPHRASE.
- Any Oration passage in any language. Any thesis beyond the two above.
  Any modern-translation wording of anything (§7).

**Future VERBATIM path (gated):** Waite's 1929 translation of the
*Conclusiones Cabalisticae* may be used verbatim ONLY after (a) the
licensing review confirms US public-domain status of the 1929 edition,
and (b) a scholarly check against Farmer/Copenhaver confirms accuracy —
labeled "Waite (1929), public-domain translation, checked against
Farmer/Copenhaver." Until both checks pass, Waite is NOT VERBATIM.

### 4.2 PARAPHRASE for Pico

Fresh paraphrase of documented positions, never in quotation marks,
badge-labeled with source. Badge form:
`PARAPHRASE · after [work], per research-report §[n]`
(e.g., `PARAPHRASE · after the Oration, per research-report §3.3`).

PARAPHRASE covers: all Oration arguments; all condemned-topic positions;
the concord program; the paradoxical conclusions; the Apologia defenses
as *spoken* content (note §2.2: in-character Pico does not speak Apologia
material — Apologia substance reaches the table as HALL-tier source cards
or in defender mode, §5.2); the letter to Barbaro; the Kabbalah claims;
the "maker and moulder" / chameleon language; the bull's provisions as
summarized by the hall.

### 4.3 HALL for Pico

The room's own narration, never attributed to Pico. HALL covers:

- Scene-setting (Rome, 1486–87; the blocked disputation).
- The historical outcome (commission, bull of 4 August 1487, Apologia,
  arrest, 1493 absolution) — in closing, on the station card, or on source
  cards. Never spoken by Pico.
- Scholarly-caveat panels (§5.5): the Mithridates flawed-translation
  caveat; the Copenhaver-vs-traditional-reading note; the "bare
  conclusions" note (theses are loaded with ambiguities Pico meant to
  resolve in debate — Farmer).
- Redirects (§5.4) and closings (§5.3).
- The "unverified" flags on cards (missing thesis numbers, missing
  counts, missing 13-list).

### 4.4 Pico banned-attribution additions

Append to the base spec's `banned-attributions.json` (base spec §2.2).
These strings/claims must NEVER appear as VERBATIM and must never be
attributed to Pico:

- Any enumerated list presented as "the 13 condemned theses" (any
  numbering, any texts).
- Any verbatim modern-translation Oration passage (Wallis, Borghesi/
  Papio/Riva, Copenhaver, Farmer translations).
- "Maker and moulder of thyself" / "thou shalt be maker and moulder" or
  any English rendering of the Adam address, presented as Pico's words.
- "On the Dignity of Man" presented as Pico's own title.
- "The first printed book universally banned" / "first book banned for
  printing" presented as fact (attributed Farmer claim only, or omitted).
- "Nearly all copies were burned" presented as fact.
- "72 theses describing a complete system of physics."
- Any named printer of the 1486 edition.
- Any invented disputation dialogue, invented letter, or invented thesis
  text.
- Forged "pro-Christian" Kabbalistic texts presented as genuine Jewish
  sources.
- "Pico repented / renounced his views" presented as settled fact.
- "Pico was murdered" / poisoning presented as a settled murder verdict.

---

## 5. The disputation mode

### 5.1 Two roles: Challenger (default) and Defender

The historical posture is: Pico defends all 900 theses against all
comers. The table offers two roles, both true to that posture:

**CHALLENGER (default).** The visitor challenges the thesis/topic; Pico
defends it from the corpus (§2.4). This is the historical disputation
shape and the mode every visitor meets first.

**DEFENDER.** The visitor defends the thesis/topic. The opposing voice
is the **1487 commission** — voiced by the HALL (never by Pico; Pico
does not argue against himself). The commission's objections are
PARAPHRASE from the documented record (the bull's categories; the
condemnation of the specific topic where attested; the 6-suspect + 7-
condemned finding). The visitor's ammunition is the table's source shelf:
Pico's documented defenses as HALL-tier source cards labeled "Pico's
later defense — *Apologia* (1487)," callable to the table per base spec
§2.1 (atlas pull-up). The hall never declares the visitor's defense
successful — no winner, ever (§5.3).

Role selection happens on the topic card, before the debate starts, in
one tap each: *"Challenge this thesis"* / *"Defend this thesis."*
Default: Challenger.

### 5.2 The facts in the room (table surface)

While a debate is live, the table surface shows (per base spec §3,
"Debate view"):

- The active topic card: TOPIC CARD or THESIS CARD (§3), with thesis
  group, tier badge, and source citation — visible throughout, not
  buried in a submenu.
- The thesis text where verified (VERBATIM Latin + labeled gloss), or
  the paraphrased topic where not (with the "exact thesis text/number
  not established" flag).
- The source shelf: the three VERBATIM fragments (§4.1) as callable
  cards; the *amicitia* card; the Apologia source cards (HALL-tier,
  labeled, in defender mode); the bull's provisions as a HALL-tier card
  (paraphrase; the WM Review English translation is modern and must NOT
  be quoted verbatim — paraphrase it, as the research report does).
- The caveat panels (§5.5) pinned alongside, not in footnotes.
- Standard table gizmos apply (base spec §3): compare well, quote-catcher,
  turn indicator, timeline scrub, histogram candles, session bookmark.
  The timeline scrub shows the disputation's own dates (Dec 1486
  publication → Jan 1487 planned disputation → Feb 1487 commission →
  4 Aug 1487 bull → 1487 Apologia → 1488 arrest → 18 Jun 1493
  absolution → 17 Nov 1494 death) as era markers; scrubbing is HALL-tier
  narration, and the persona's temporal stance (§2.2) does not move with
  it. (Timeline dates: 1487 *Apologia* — 1489 dating caveat, §2.2.)

### 5.3 Turn structure (mirrors base spec §2.1)

- **Opening:** Pico speaks first — the three-part opening (§2.3), 2–4
  sentences of Pico voice plus the VERBATIM announcement.
- **Visitor turn:** free text input (primary) + a row of 2–3 suggested
  lines of argument. Suggested lines must be genuine argumentative moves
  drawn from the documented record — the commission's objections,
  Aquinas's position (Topic 5), the traditional microcosm view (Topic 1),
  the strict-Thomist reading (Topic 8) — never straw. Each suggested
  line is labeled with its source ("after the commission's objection,"
  "after Aquinas," etc.).
- **Pico turn:** (a) **steelman first** — restate the visitor's point
  fairly in one line, per base spec §2.1. The disputation form itself
  demands this: Pico's whole project was stating opponents fairly in
  order to reconcile them. (b) Counter from the corpus — VERBATIM first
  where available, labeled PARAPHRASE second. (c) Concede where the
  record concedes — e.g., Topic 8's reworking point (§2.4 item 10);
  Pico never concedes for politeness (base spec §4 rule 5).
- **Cadence:** after 6 visitor turns the table gently offers a close
  (*"The lamps burn low — shall we rest the question?"* — base spec
  wording, HALL tier). The visitor may continue up to 12 turns, then the
  hall closes the session gracefully.
- **Closing (Pico-station-specific, HALL tier):** the hall notes the
  historical poignancy in one line — the real disputation never took
  place; here, at least, the debate happened — then asks the base spec's
  closing question of Debate 15 (*"Which of these brought you here?"*).
  The visitor's defended position joins the living histogram (§2.4 of
  the base spec; per-device in the pilot). **No winner is ever declared.**
- **Atlas pull-up (any turn, either side):** per base spec §2.1 — the
  passage appears verbatim with full citation. For Pico, pull-ups are
  the three VERBATIM fragments, the source-shelf cards, and the caveat
  panels.

### 5.4 Off-topic fallback (Pico-specific)

If the visitor raises something outside Pico's recorded concerns, Pico
says so in character and redirects — HALL-tier framing, never invented
content. Pattern (PARAPHRASE, not quotation):
*That lies outside what I set down in 1486. Shall we return to [active
topic] — or would you face a different thinker?* The table offers the
other debates and the 900 Theses room. The persona never improvises
positions on topics Pico never addressed.

**Modern-topic handling (anachronism rule, base spec §4 rule 2):**
- A documented Pico principle may be applied to modern material ONLY as
  labeled PARAPHRASE (*"By my principle that…, I would say…"*) and only
  where the principle is in the corpus (e.g., the concord principle, the
  self-shaping principle). Otherwise: redirect per above.
- Topics Pico never addressed (modern politics, current events, post-1494
  scholarship, the 2007 exhumation, modern science as such): redirect.
  The persona never opines on them.
- **Pico's own later life** (Heptaplus, De ente, the Apologia, arrest,
  absolution, death) is NOT off-topic for the *hall* — it is HALL-tier
  narration. It IS off-limits for Pico-the-persona (§2.2). If the visitor
  asks Pico about his arrest, the hall answers (HALL tier) and Pico
  redirects to the disputation.

### 5.5 Scholarly-caveat panels (always alongside, never footnotes)

Per the truth policy and base spec §4 rule 6, the following panels are
visible mid-debate wherever their topic is live:

- **Kabbalah caveat (Topics 3, and any Kabbalistic claim):** Pico's
  Kabbalah was mediated through flawed and sometimes forged translations
  (Flavius Mithridates); his grasp of the material was partial
  (Wirszubski; Copenhaver; Busi; Idel). The table presents Pico's
  Kabbalah as Pico understood it, and never presents forged
  "pro-Christian" Kabbalistic texts as genuine Jewish sources.
- **Bare-conclusions note (all topics):** the theses are bare conclusions
  with no supporting argumentation, "loaded with ambiguities that Pico
  meant to resolve in the course of his debate" (Farmer). A topic card
  is not Pico's last word — it is his opening move.
- **Reading note (Topics 1–2, station card):** the "Manifesto of the
  Renaissance" reading (Burckhardtian / textbook humanism) vs. the
  esoteric/Kabbalistic reading (Yates; Wirszubski; Copenhaver) vs.
  Copenhaver's revisionism (Pico "in no way progressive — or
  'humanist'"). Presented as three attributed scholarly positions, not
  resolved by the hall. One line each; the full positions live in the
  900 Theses room.
- **Title note (wherever the Oration is named):** "On the Dignity of
  Man" is the later, conventional title (first used 1557); Pico's 1496
  heading was *Oratio quaedam elegantissima*.

---

## 6. Relation to the 900 Theses room

**The boundary:** the room is the encounter with the text and the event;
the table is the back-and-forth debate. Neither duplicates the other.

| | The 900 Theses room | The Debate Hall table (Station 16) |
|---|---|---|
| **Job** | Encounter the text and the event: the booklet, the 900, the Oration, the blocked disputation, the bull, the Apologia, the aftermath | Argue a thesis live, against Pico or against the commission |
| **Content** | Full structure (§1.3 groups), biography, publication history, reception, further-reading shelf, errata | Curated debate set (§3), persona pack (§2), turn engine (§5.3) |
| **Interaction** | Browse groups; read verified texts; follow the event timeline | Choose a topic, pick a role, debate 6–12 turns, pin quotes, bookmark |
| **Voice** | The hall narrates; Pico is quoted (VERBATIM) or paraphrased (PARAPHRASE) | Pico speaks (persona); the hall narrates; the commission objects (defender mode) |

**No-duplication rules:**
- The table does NOT retell Pico's biography, the publication history,
  or the reception debate. One-line HALL bridges at most ("Pico, 23,
  count of Concordia, offered this debate in Rome — the room tells the
  rest").
- The room does NOT stage debates. Its interactive is browsing + the
  event timeline. If the room team wants a "try arguing this" affordance,
  it is a link to the table, not a second debate engine.
- The Oration's arguments appear in the room as panels and at the table
  as PARAPHRASE debate content — same sourced substance, different
  function. The room owns the full Oration account; the table owns the
  debate moves drawn from it.

**Cross-links (both directions, required):**
- Table → room: Station 16's card and every topic card carry *"Enter the
  900 Theses room"* (deep link to the room). The closing screen carries
  it too.
- Room → table: every curated-topic group in the room carries *"Take
  this to the Debate Hall table"* (deep link to Station 16 with the
  topic pre-loaded). Group-level links where no verified text exists;
  topic-level links for the curated eight.
- **Shared assets, single ownership:** the flame identity (§2.1), the
  tier system (§4), and the citation format are shared. The thesis corpus
  data file is OWNED BY THE ROOM BUILD — the table reads it, never forks
  it. A correction lands once (as labeled errata, §7) and both surfaces
  update. If the two builds ship at different times, the table ships
  with a snapshot + the errata feed address, and reconciles on the room's
  ship.

**Plaque / pantheon consistency:** Pico's museum plaque and pantheon
entry use the same flame identity and the same tier discipline. The
plaque states the room/table cross-link. (Plaque room numbers are
verified against the museum build before Claude builds — per the
Philosophers program caveat, carried here as a standing check.)

---

## 7. Licensing + accuracy gates

### 7.1 Translation licensing — hard gate

**NO verbatim modern-translation text ships without a licensing review.**
This is a build-blocking gate, not a TODO:

| Text | Status | Table use |
|---|---|---|
| Latin text of the *Conclusiones* (1486), the *Oration* (1496+ early editions) | Public domain | May be quoted verbatim — but every Latin quotation must still be verified verbatim against a critical edition (Farmer / Copenhaver / Bausi) before display. Do not transcribe from memory. |
| Farmer's English translation of the 900 Theses (1998/2008) | In copyright | NO verbatim use without licensing review / permission. PARAPHRASE only, labeled. |
| Copenhaver's English translations (Oration 2022; *Nine Hundred Conclusions*; *Pico on Trial* 2022) | In copyright | NO verbatim use without licensing review / permission. PARAPHRASE only. |
| Borghesi / Papio / Riva, *Oration* (Cambridge UP, 2012) | In copyright | NO verbatim use without licensing review / permission. |
| Wallis translation of the *Oration* (1965; first version 1944) | Treat as in copyright pending review | NO verbatim use without licensing review. |
| Waite's translation of the *Conclusiones Cabalisticae* (1929) | US public domain from 1 Jan 2025 — TO BE CONFIRMED in licensing review | Verbatim ONLY after (a) licensing review confirms PD status, AND (b) scholarly check against Farmer/Copenhaver confirms accuracy. Labeled "Waite (1929), public-domain translation, checked against Farmer/Copenhaver." |
| Innocent VIII's bull (1487) | Latin original: public domain. WM Review English translation: modern | Latin: free to quote (verify against the Vatican Register text). WM Review English: do NOT quote verbatim (publisher describes it as AI-assisted with human line-checking) — paraphrase it. |
| Modern scholarly paraphrases/summaries (SEP, journal articles) | In copyright | Summarized/paraphrased; do not copy sentences into table text. |

**Default display rule:** verified Latin + labeled fresh paraphrase. This
is the table's normal state. Modern-translation verbatim is the
exception that requires a passed gate, never the default.

### 7.1b Placement + verification gates (C and D) — hard gates

Restated here because the table inherits them from the room spec (§10).
Both are build-blocking for the table, not TODOs:

- **Gate C — Manifest + Directory + Atlas confirmation (REQUIRED before
  placement ships).** Claude confirms the threshold slot against the
  in-repo museum manifest; the Directory count update (83 → 84); the
  Directory legend/marker additions; the Atlas pins. Capture-verified by
  a named verifier.
- **Gate D — Capture-verified build check (REQUIRED before delivery).**
  Per the see-first rule: the built table is inspected in a real browser
  (living site, actual artifact), with captures, by a named verifier,
  before it is presented as done. The verification covers: Station 16
  renders in its distinct stone treatment; the 7 TOPIC CARDs / 1 THESIS
  CARD distinction holds; no enumerated "13" list appears; the persona
  never speaks Apologia material in character; teardown disposes
  cleanly.

### 7.2 Protection: citations + checksums + errata

- **Every thesis/topic card carries:** source citation (work, section,
  and the research-report section it was verified from), tier badge,
  and a content checksum (hash of the card's canonical text). The
  checksum lets any later build verify the card has not drifted.
- **Corrections are labeled errata, never silent edits.** If a thesis
  text, count, or attribution is corrected, the old card is retained
  with an ERRATA label (what changed, when, on what evidence) and the
  new card supersedes it. Both surfaces (room + table) show the same
  errata. This is the corrections mechanism (cf. the standing
  corrections-as-footnotes rule): the single errata location is chosen
  per D10 (exact location TBD) — until then, errata live on the card
  itself and in the corpus data file's `errata` array.
- **No silent omissions.** Where the record is thin (the 13-list, the
  missing counts), the card says so (§1.4). An omitted item with no
  label is a defect.

### 7.3 Build checklist for Claude (mirrors base spec §7)

**Components**
- [ ] Station 16 shell: distinct stone treatment, inscription, flame
  anchor, station card (amends base spec §1; record 16th-station vs.
  annex-marker choice in build notes).
- [ ] Theses group browser: two blocks (402 / 498) + Cabalist cross-cutting
  tag; verified counts only; "pending" labels elsewhere (§1.3).
- [ ] Curated debate set: 8 topic cards (7 TOPIC CARDs + 1 THESIS CARD),
  role selection (Challenger / Defender), per-topic source shelf (§3, §5).
- [ ] Pico persona pack: opening (§2.3), positions (§2.4), never-claims
  (§2.5), off-topic fallback (§5.4), temporal stance (§2.2).
- [ ] Disputation engine: extends the base turn loop — two roles (§5.1),
  steelman-first, 6-turn close offer, 12-turn max, no winner ever.
- [ ] Caveat panels (§5.5) pinned alongside live topics.
- [ ] Cross-links: table → room, room → table, deep link with topic
  pre-loaded (§6).
- [ ] Teardown: `destroy()` per Modular Framework; scoped CSS; keyboard
  operation; reduced-motion; 1.0 DPR mobile.

**Data files (build from research — do not re-research)**
| UI needs | Source file | Output |
|---|---|---|
| 8 topics, positions, opponents, citations | `nine-hundred-theses/research-report.md` §§1–4 + this spec §3 | `data/pico-debates.json` |
| Pico persona pack (opening, positions, redirects, never-claims) | `research-report.md` + this spec §2 | `data/pico-persona-pack.json` |
| Banned attributions (base + Pico additions) | Base spec §2.2 + this spec §4.4 | `data/banned-attributions.json` (extended) |
| Thesis corpus (groups, counts, verified texts, errata) | `research-report.md` — OWNED BY THE ROOM BUILD; table reads it | `data/pico-corpus.json` (shared) |
| Commission objections (defender mode) | `research-report.md` §§4.2–4.3 | `data/pico-commission.json` |
| Room/table cross-links | This spec §6 | link config, not hard-coded URLs |

**Quote sourcing rule:** verified Latin + fresh labeled paraphrase is
the default. Every VERBATIM carries translator/status (for Latin:
"Latin original, public domain, verified against [edition]"). **The
licensing review (§7.1) must pass before ANY modern-translation verbatim
ships.**

### 7.4 Acceptance criteria (mirrors base spec §7 + Pico-specific tests)
- [ ] Tier-badge audit: spot-audit 20 Pico utterances — all traceable to
  the corpus, zero invented quotes. All VERBATIM utterances are among
  the three fragments in §4.1.
- [ ] Banned-attribution test: none of the blocklisted strings (§4.4 +
  base spec §2.2) appear as VERBATIM anywhere. No enumerated "13
  condemned theses" list appears anywhere in any form.
- [ ] Translation test: no verbatim modern-translation text appears
  without a passed licensing review on file. Grep the build for
  Wallis / Borghesi-Papio-Riva / Copenhaver / Farmer English wording —
  zero unlicensed hits.
- [ ] Anachronism test: 10 modern-topic probes — all handled by
  documented-principle paraphrase or redirect, never invented positions.
  5 aftermath probes (condemnation, arrest, absolution, death) — all
  answered by the HALL, never by Pico-the-persona.
- [ ] Steelman check: 10 adversarial visitor inputs — no strawman
  responses; the visitor's point is restated fairly before countering.
- [ ] Off-topic: 5 probes — all redirect in character, offer another
  thinker or the room, invent nothing.
- [ ] No winner is ever declared; histogram renders without verdict
  language. Closing notes the real disputation never happened (HALL).
- [ ] Title test: "On the Dignity of Man" never appears as Pico's title;
  the title note (§5.5) appears wherever the Oration is named.
- [ ] Count test: every displayed count is one of the verified counts
  (§1.3); every unverified count renders as "pending," never a number.
- [ ] Topic/thesis card distinction: 7 TOPIC CARDs show no thesis number
  and no Latin thesis text; 1 THESIS CARD (Thesis 39) shows both.
- [ ] Cross-links: table → room and room → table resolve or render
  "forthcoming" (never dead links) until the room ships.
- [ ] Gate C on file: manifest/Directory/Atlas confirmation (threshold
  slot, count 83 → 84, legend/marker additions, Atlas pins) before
  placement ships.
- [ ] Gate D: built table inspected in a real browser with captures by a
  named verifier before delivery (Station 16 renders distinctly;
  card distinction holds; no "13" list; no in-character Apologia
  speech; clean teardown).
- [ ] Phone: Galaxy S22-class — table tappable, text readable, 1.0 DPR,
  no horizontal overflow. Group browser usable one-handed; topic cards
  readable without zoom.
- [ ] Teardown: mount/unmount leaves no listeners, geometries, or timers.
- [ ] Social-hook review: Station 16 uses the base spec §6 slots
  (speaker, round-robin turns, shared table state) — a second speaker
  slot can be added by config, not code changes.

---

## Appendix A — Research-report section map (for the build team)

| Spec section | Research-report source |
|---|---|
| §1.3 groups/counts | §1.2 (402/498), §1.3 (115 Latin, 16 Albert, 45 Aquinas, 17 paradoxical, 119 Cabalist incl. final 72) |
| §2.3–2.4 opening/positions | §1.1 (concord), §1.4 (three fragments), §3.3 (Oration arguments), §4.2 (condemned topics), §5.4 (Kabbalah), §5.2 (letter to Barbaro) |
| §2.5 never-claims | §8 (unknown/not verified, items 1–13), §7 (licensing), §3.1 (title), §4.3 (bull notes) |
| §3 topics | §4.2 (Topics 3–7), §3.3 (Topic 1), §1.3 (Topic 2), §1.4 (Topic 8) |
| §4 tiers | §1.4 (VERBATIM set), §7 (licensing table) |
| §5.2 timeline markers | §2 (Dec 1486), §4.1–4.5 (1487–1494), §5.1 (death 17 Nov 1494) |
| §7.1 licensing | §7 (full table) |

*End of spec. No code. No thesis text beyond the three verified Latin
fragments in §4.1 was used in writing this spec.*
