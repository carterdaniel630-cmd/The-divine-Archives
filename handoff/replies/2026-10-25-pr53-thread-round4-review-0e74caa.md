# PR #53, Pilgrimage batch 1: independent reviews before the merge (2026-10-25)

Candidate: `claude/project-thread-s3qxre` at `0e74caa` (Delphi, Göbekli Tepe, Mogao Caves, Chichén Itzá; preview,
pending tags on). Commits after it touch `handoff/` only.

| Round | Commit reviewed | Reviewer | Result |
|---|---|---|---|
| 1 | `befb607` | loop run (`review-log` `reviews/loop/2026-10-25-pr53-independent-review.md`) | returned: about 30 findings, 4 Carter points; fixed in 8aab255, 2dd1158, 6f314d4, e8ce493 by the audit run |
| 2 | `e8ce493` | separate reviewer, fresh context | returned: 10 findings (G1–G4, D1–D4, C1, M1), D1 for Carter; fixed in dc08c5c |
| 3 | `dc08c5c` | separate reviewer, fresh context | all 10 resolved; 2 source-log findings; fixed in 0e74caa |
| 4 | `0e74caa` | separate reviewer, fresh context | **PASS: 0 findings, 0 NEEDS CARTER** |

Carter's answers: point 1 of round 1 (holy-site pages) and the merge itself: "merge" (2026-10-25); round 2's D1,
the hymn composer's name: "Both readings" (2026-10-25). Points 2–4 of round 1 were settled by sources (round 2).
None of the reviewers wrote any of the candidate's changes.

Local checks at `0e74caa`: full build order with no changes; `review-checks.js --base origin/main --build` 9/9,
0 warnings; every `tools/verify-*.js` OK; framework tests 42/42; headless phone (390×844) load of all four pages,
no script errors.

The round 2–4 reports follow.

---

## review-pr53-e8ce493

VERDICT: RETURNED (10 findings, 1 NEEDS CARTER)

# Independent review of PR #53 (Pilgrimage batch 1) at e8ce493

Reviewed 2026-10-25 by a run that wrote none of #53. Checkout: /home/claude/pr53, detached at e8ce493 (fix commits
8aab255 Mogao, 2dd1158 Göbekli Tepe, 6f314d4 Delphi, e8ce493 Chichén Itzá on top of befb607). Nothing in the repo
was edited, committed or pushed. No KEY.md file was opened.

## The short version
The fix run did good work. Of about 30 earlier findings and Carter points 2–4, almost all are now resolved, and
the new text matches its sources. I re-opened every source I relied on. Ten problems are left, all small. Nine are
wording or citation fixes. One is a case where two sources disagree, so it goes to Carter: the composer's name on the
first Delphic Hymn. No fake sources were found. No source is claimed as opened when it wasn't, except one weak
citation for Mogao (M1: the wording comes from Britannica's AI summary, not its article).

## Automatic checks (read-only, run from /home/claude/pr53)
- `node tools/verify-pilgrimage.js`: "73 sites, 3 live, 7 preview; 235 links, relics and info points checked: OK".
- `node tools/review-checks.js` (without --build): PASSED, 9 checks, 0 failed, 0 warnings. Wikipedia share:
  Chichén 19% (5/26), Delphi 13% (4/31), Göbekli 0%, Mogao 0%. Build check skipped (no --build, as instructed).
- The working tree is clean after the checks.

---

## Göbekli Tepe

### Open findings
**G1 (fixable). Magazine's words credited to "the excavators".**
- `docs/pilgrimage/sites/gobekli-tepe/site.js:157`: "the excavators&rsquo; 2012 summary calls it the largest"
- `site.js:170`: "the excavators call it the most impressive of the enclosures"
- `site.js:189` (About): "the excavators call D the largest"
- `dims.js:21-22`: "(SURVEY, Current World Archaeology 53, 2012, from the excavators)"

*What's wrong:* the cited *Current World Archaeology* feature (https://www.world-archaeology.com/features/turkey-gobekli-tepe/)
has no byline. It is credited to the magazine, and both judgements are the magazine's own words: "While Enclosure
C may be the most impressive, Enclosure D is the largest." The excavators are not quoted for them.

*Fix:* "a 2012 report in *Current World Archaeology* calls it the largest" / "…calls C the most impressive". Make the
same change in the About card and the dims.js comment.

**G2 (fixable). "Large" added to the count of twenty.** `site.js:137`: "Geophysical survey points to at least twenty large
enclosures, most still buried."

*What's wrong:* the cited 2018 geophysics post (https://www.dainst.blog/the-tepe-telegrams/2018/07/18/looking-beneath-the-surface-geophysical-surveys-at-gobekli-tepe/),
quoting Schmidt 2003, says: "More than ten large enclosures could be located in the geomagnetic map … a minimum of
20 enclosures seem to exist." Only the ten-plus are called large.

*Fix:* "…points to at least twenty enclosures, more than ten of them large, most still buried" (or drop "large").

**G3 (fixable, minor). Lettering order generalised from two cases.**
- `site.js:143`: "The enclosures are lettered in the order they were found"
- `dims.js:20`: "named A–D in the order they were found"

*What's wrong:* the cited posts support only that A was found first (1996, ?p=861) and B second ("the second
structure discovered", Enclosure B overview). Neither says how the letters were assigned, or anything about C
and D.

*Fix:* "A, nearest the walkway, was the first found, in 1996; B beyond it the second…". Or cite a source that states
the naming rule.

**G4 (fixable, minor). Walkways not in the cited source.** `site.js:153`: "Visitors to Göbekli Tepe stay on raised walkways
round the excavation, under a large modern shelter roof."

*What's wrong:* the card cites only Clare 2020. Its full text
(https://publications.dainst.org/journals/efb/article/view/2596/7095) mentions "the two recently constructed
protective shelters" but no walkways. (The source log also credits Clare with "the modern shelter and walkways".)
This card text is unchanged since befb607, but it is a source mismatch.

*Fix:* add a source for the visitor walkways, or reduce the claim to "under large modern shelter roofs" (Clare) and
correct the log.

### Earlier findings: status at e8ce493
- Carter point 2 (ttHouse missing): **resolved.** Found at https://www.dainst.blog/the-tepe-telegrams/2017/01/24/a-sanctuary-or-so-fair-a-house/.
  The page has no author, so the "J. Notroff" credit was rightly dropped. The page shows no date, so 24 Jan 2017
  comes from the URL, which is acceptable. It contains the "ample evidence … peculiar place" answer to Banning.
- Carter point 3 (sizes of C and D): **resolved.** The 20 m and 30 m figures are gone. The About card says C is drawn
  wider than D as an estimate. Only G1's attribution remains.
- Flint: **resolved** (?p=861: "clustered with flint"; "islamic cemeteries"; "'tombstones' … T-shaped pillars").
- Twenty enclosures: **resolved** (cited and logged). See G2 for the word "large".
- Fox on B's pillars: **resolved** (both Pillars 9 and 10). "A more oval" dropped. Lettering: see G3.
- "Method has been questioned": **resolved** (dropped; flag now "One study's argument").
- Grinding tools: **resolved.** Dietrich et al. 2019 is cited. The PLOS ONE/Würzburg record is real, with
  "standardized and efficient grinding tools". The "most of which … cereals" wording is the abstract's own,
  confirmed in search results.
- "The pillars are beings": **resolved.** Now attributed to the excavators, following "Losing your head"
  ("abstract depiction of the human body seen from the side"; "ancestors … or even of gods … hard to find").
- Magli reply: **resolved.** The card now says the excavators did not answer Magli directly. Their general statements
  are quoted correctly from the ttFox post ("no convincing proof for an actual celestial orientation"; "subterranean";
  "possibly even covered by roof constructions"). Magli is named in neither post.
- Transport: **resolved** (?p=347: "in the worst case about 500m, in the best less than 100m"; beams and wedges;
  sledges and wooden planks; Nias parallel; no ropes or rollers).
- Minor items: **all resolved.** Harran plain is cited to CWA. "Since 2019" is gone. "Significant possibility" is
  quoted from the More-than-a-vulture post. The farming wording follows Clare ("still living as hunters and
  foragers"). The More-than-a-vulture URL is logged.

### Checked and fine
- Temple card: Clare's "a revision of the popular scientific view is now unavoidable", domestic buildings,
  "sub-floor burial", water system "a distinct possibility".
- Fill card: Clare's "inundation by displaced archaeological deposits".
- Dating card: mortar AMS dates; Schmidt's tripartite sequence abandoned.
- Vulture Stone card: 700–1000 years, more than 60 pillars, narrow sides, and "Egyptian, Arabian, and Greek
  scholars" as in the More-than-a-vulture post.
- CWA details: 11 wall pillars, pedestals, Pillars 35 and 37, the 5 m laser reconstruction, Pillar 27, the animal
  lists.
- Quarry card figures: 7 m, 1.5 m, about 50 t, the crack, flint.

---

## Delphi

### Open findings
**D1 (NEEDS CARTER). Two sources disagree on the composer's name.** `docs/pilgrimage/sites/delphi/site.js:185`: "The first
names its composer, Athenaios son of Athenaios."

*What's wrong:* the card's sources disagree.
- The Delphi Archaeological Museum page (cited as REF.museum,
  https://www.delphimuseum.gr/2025/03/the-delphic-hymns-to-apollo.html) reads the damaged heading as "Athēnaios
  Athēnaiou", that is, son of Athenaios.
- The epigraphic edition the card also uses, Attic Inscriptions Online CID III 1
  (https://atticinscriptions.com/inscription/CIDIII/1), translates the heading only as "which Athenaios composed".
  The name is restored, and the poet "might be identified with Athenaios son of Athenaios", a paean singer in a
  Delphian decree.
- The CHS article (https://classics-at.chs.harvard.edu/the-hellenistic-hymns-to-apollo-with-musical-notation-from-delphi/)
  likewise prints "ὃ ἐ[πόησεν Ἀθ]ήναιος" with no patronymic. It credits Bélis with the identification.

Under the sourcing rule, a stronger source disagreeing is Carter's call.

*Suggested wording, if he agrees:* "The first names its composer, Athenaios. The name is damaged; the Delphi Museum reads
'Athenaios son of Athenaios', while other editors read only 'Athenaios' and take the father's name as a possible
identification."

**D2 (fixable). More of the hymn text is restored than the card says.**
- `site.js:185`: "The stone is broken at the start, so the first word is an editor&rsquo;s restoration."
- `s1-way.js:166` (comment): "the first word is a restoration"

*What's wrong:* in the AIO Greek text (https://atticinscriptions.com/inscription/CIDIII/1?text_type=greek), Κέκλυθ' is
restored, and so are parts of Ἑλικῶνα, λάχετε, Διὸς, ἐριβρόμου and εὐώλενοι. AIO's English has [Listen], [Zeus] and
[Helikon] in brackets. The source log (line 49) has "Κέκλυθ' Ἑλικ" restored, which is already more than one word.

*Fix:* "The stone is broken, so the first word and parts of several others are editors' restorations."

**D3 (fixable). The About card still says the lettering is never real text, apart from the hymn.**
- `site.js:245` (About): "the lettering on the walls imitates the look of inscriptions and is not their text, except the
  hymn panel"

*What's wrong:* the maxims panels in the porch (`s2-temple.js:69-70`, ΓΝΩΘΙ ΣΑΥΤΟΝ, ΜΗΔΕΝ ΑΓΑΝ) are the real words. The
Polygonal Wall line (`greek.js:110`) is the real manumission formula. The source log (lines 12–14) now correctly
lists all three exceptions, but the page does not. This is the leftover half of the earlier finding.

*Fix:* "…is not their text, except the two maxims, the hymn panel (the first hymn's opening as editors read it) and
the line on the Polygonal Wall, which repeats the freedom records' usual formula." Optionally soften the Polygonal
Wall flag (`site.js:192`, "Lettering illustrative, not the text") to "Usual formula, not one record". The card body
("not a transcription") is already right.

**D4 (fixable, minor). The two cited sources give different dates for the Sphinx.** `site.js:188`: "set up about 560 BCE".

*What's wrong:* the card cites two sources that disagree. The Ministry page (https://delphi.culture.gr/the-sphinix-of-the-naxians/)
says "ca 560 B.C."; the Delphi Museum page (https://www.delphimuseum.gr/2024/05/the-column-of-naxians-and-sphinx.html)
says about 570 BC.

*Fix:* "set up about 570–560 BCE". The heights check out: column 10 m, whole monument 12.45 m / "almost thirteen".

### Earlier findings: status at e8ce493
- Hymn panel Greek: **resolved.** The Greek now matches the edited text (ΚΕΚΛΥΘ … ΑΙ ΛΑΧΕΤΕ …) and is relabelled. See
  D1 and D2. The log's "only the two maxims" error is fixed in the log. See D3 for the page.
- Undying fire: **resolved.** Plutarch, *Numa* 9 (https://lexundria.com/plut_num/9/prr): "as at Delphi and Athens, it is
  committed to the charge … of widows past the age of marriage". Pausanias is kept for the hearth only.
- 4th-century temple funding and "finished about 330": **resolved.** Ministry "The Temple of Apollo" says the
  Amphictyony collected the money, naopoioi came from several cities, work stopped 356 and resumed 343–342, the temple
  was "finally accomplished in 334-333 B.C.", and the pediments were finished in 327. "When war came to Delphi" is a
  fair gloss of the Ministry's "attacks of Philip II … and the Thessalians".
- Athenian Treasury reassembly: **resolved.** Baly slide: 1906, French archaeologists, funded by the city of Athens,
  "about four fifths of the original stone". Ministry: hymn "replaced on the building by a moulded plaster copy".
- Christian emperors and the new village: **resolved.** WHE: "The decree by Theodosius in 393 CE …"; "A Christian
  community dwelt at the site … until its final abandonment in the 7th century CE". The SearchCulture 1892 record:
  residents built new houses nearby.
- "Earliest notated music with a named composer": **resolved** (dropped).
- Sphinx column height: **resolved.** See D4 for the date.
- Stadium and omphalos sources: **resolved.** Now credited to Odyssey Adventures and Wikipedia, labelled as such.
  Note: Wikipedia is the only source for the stadium track size and for the omphalos original-or-copy point. It is
  labelled and within the 20% share, but a stronger source would be better.
- *Greek Questions* 9: **resolved.** The Goodwin translation (https://fgh.perseids.org/…/3-21): "they call that week
  the nativity of Apollo"; "In former times Pythia gave answers only once a year, which was on this day"; monthly
  answers "but of late". The seventh is now marked as inference.
- Log, Patras/ethylene and the *Geology* issue: **resolved.** The Etiope abstract
  (https://repository.geologyscience.ru/handle/123456789/48049) gives methane, ethane and CO2 released today; "not
  prone to biogenic production of ethylene in amounts inducing neurotoxic effects"; oxygen depletion in the indoor
  temple. The card matches. De Boer is given as *Geology* 29 (August 2001), with the issue honestly marked as not
  opened.

---

## Chichén Itzá

### Open findings
**C1 (fixable). The Maya population figure rests only on Wikipedia.** `docs/pilgrimage/sites/chichen-itza/site.js:125`: "in the
Yucatán peninsula alone, more than a million and a half people are counted as Yucatec Maya today."

*What's wrong:* the only source is Wikipedia, "Yucatec Maya people" (REF.ym), which the rules allow only as a labelled
pointer. On that page, 1,646,782 is "Yucatec Mayans in Mexican territory". It is footnoted to an archived 2016 INEGI
languages page, the "2020" year appears only in the infobox, and it does not say whether the figure counts
self-identification or speakers (its speaker figure is 799,696 in 2000).

*Fix:* cite INEGI's 2020 census directly and say what the figure counts. Or hedge it as "by one count, about 1.6
million people in Mexico are counted as Yucatec Maya". Keep the point that the Maya are living people.

### Earlier findings: status at e8ce493
- Carter point 4 (decline date): **resolved.** Both views are now given and flagged "Decline: two dates". Britannica
  print view (https://britannica.com/print/article/110599): "Chichén appears to have been eclipsed by the rise of the
  city of Mayapán". UNESCO (https://whc.unesco.org/en/list/483): rapid decline "around 1440 A.D."
- "Height after about 800": **resolved.** Britannica: "Most of these buildings probably were completed in the Early
  Post-Classic Period (c. 900–1200)".
- "Six million … in the region": **resolved** as a claim (removed). See C1 for the replacement's source.
- Losing-team sacrifice: **resolved.** Flagged CONTESTED, with the Met essay's "unclear who was sacrificed".
- Serpent "doubtful": **resolved.** Now "debated", with the doubt credited to Šprajc and Sánchez Nava.
- Toltec debate: **resolved.** Conquest (UNESCO: "migration of Toltec warriors from the Mexican plateau … 10th
  century"). Invasion by Maya speakers "perhaps under the direction of the Toltec" (Britannica). Arrival and
  refounding (Bíró and Pérez de Heredia 2016 abstract: "la llegada de gentes 'Mexicanas-Toltecas'", "la refundación
  de la ciudad", newcomers and "parte de la nobleza local"). Exchange (Dumbarton Oaks page for *Twin Tollans*: "earlier
  notions of migrations and conquests" set aside). Reverse influence (WHE: "it may actually have been Chichen Itza
  which influenced the Toltec"). The card says the question is open.
- Equinox sunset credited to Aveni: **resolved.** Exploratorium: "Venus rising at its northern and southern extremes,
  as well as the equinox sunset" (no measurer named). The card now says so and adds Šprajc's caution.
- Victims killed first: **resolved.** "Sacred Cenote" (Wikipedia, after de Anda 2007): "usually (though not always)
  killed prior to being thrown into the cenote".
- Minor items: **all resolved.**
  - Ball-court figures are attributed (the Met's "court"; the model's use is stated).
  - "Finest" is dropped.
  - The skull rows are sourced at Chichén. Open Heritage 3D: "rows of skulls running in horizontal registers"; "placement
    beside the ball court". Tiesler and Miller, *Ancient Mesoamerica* 34.2 (2023), 563–585, confirmed on Cambridge Core:
    "heads of sacrificed victims would be exhibited"; "marks of bilateral or basal impalement".
  - El Caracol's stairway is now WHE's "A large flight of stairs on two levels".
  - The blurb now says whose account the sacrifices rest on.
  - *Historia Mexicana*: author Guillermo Palacios, 2017, confirmed on the Colmex record page.
- Outside this PR: ch29:47 equinox intent is still for its own pass, as the log says.

---

## Mogao Caves

### Open finding
**M1 (fixable). The citation points at Britannica's AI summary, not its article.**
- `docs/pilgrimage/sites/mogao-caves/site.js:164`: "Buddhists hold that Maitreya now lives as a bodhisattva in the Tushita
  heaven and will come down to earth, when the teaching of the present Buddha has faded, to teach it again."
- `site.js:36`, REF.brit: "Britannica, 'Tushita Heaven'"

*What's wrong:* on the cited page (https://www.britannica.com/topic/Tushita-Heaven), the article text says only that
Maitreya "awaits the time for his coming to earth". The "as a bodhisattva" and "when the teachings of Gautama Buddha
have faded" wording, which the log quotes, comes from the page's AI-generated summary, which Britannica itself says
to check against the article. The claim is right, but the citation is weak.

*Fix:* cite Britannica's "Maitreya" article (print view https://www.britannica.com/print/article/358868). Its article
text has "presently a bodhisattva residing in the Tushita heaven" and "will descend to earth to preach anew the dharma"
when "the teachings of Gautama Buddha have completely decayed". The card wording can stay. Update the log entry to
match.

### Earlier findings: status at e8ce493
- "Four tiers": **resolved.** UNESCO (https://whc.unesco.org/en/list/440): "492 caves built on five levels". The
  card says the model shows four.
- Theft vs saving: **resolved, each view now sourced.**
  - Robinson, *THE* 4 June 2004 (https://www.timeshighereducation.com/node/84541): Stein "became a key imperialist
    villain"; "he prevented further destruction of the Chinese heritage by removing it to Europe".
  - Restitution Matters (J. van Beurden, 14 Jan 2025) on *Global Times* 21 Nov 2023: the call for return.
  - Carter's "merge" covers the sensitivity point.
- Maitreya card unsourced: **resolved** (cut down to doctrine). See M1 for the citation.
- Jataka plots: **resolved.**
  - e-Dunhuang Cave 254 gives the third prince, dry bamboo, the throw from the cliff, 异时同图, the parents gathering
    the remains and building a stupa, and Sibi cutting his flesh to ransom the dove.
  - Smarthistory (Mei Mei Chan) gives the brothers, the bones and the stupa. The log correctly notes that Chan
    illustrates Cave 428.
  - IDP "Jataka stories": Sibi "gives part of himself to save another being"; north wall of Cave 254.
  - "Perfection of giving" is dropped.
- Sealing date: **resolved.** Now credited to Rong. "May never be settled" is softened to "harder to settle".
- "Cave 16 … late Tang": **resolved** (dropped).
- "Rebuilt" and "finished in clay and paint": **resolved.**
  - Ancient History Sites: "repaired at least five times"; "The giant statues have stone cores"; the storey history.
  - Tokyo 2002 abstract: "renewed many times by the local rulers in different historical periods"; "renovation of the
    building and the statue continued in the modern era".
- "Lay woman": **resolved** (attendant, 近侍女).
- Log, Cave 254 Maitreya posture: **resolved.** e-Dunhuang: "主尊为交脚弥勒佛像". The log now notes the stand-in does not
  show it.

---

## Needs your decision (Carter)
1. **Delphi hymn composer (D1).** The Delphi Museum names him "Athenaios son of Athenaios". The standard edition of the
   inscription reads only "Athenaios" and treats the father's name as a possible match. Options:
   (a) say both, which I recommend;
   (b) keep the museum's reading;
   (c) give just "Athenaios".

The other nine findings are fixable by the build side without Carter. A different run should then confirm them before
the merge proposal.

---

## review-pr53-dc08c5c

VERDICT: RETURNED (2 findings, 0 NEEDS CARTER)

# Independent review of PR #53 (Pilgrimage batch 1) at dc08c5c

Reviewed 2026-10-25 by a run that wrote none of #53. Checkout: /home/claude/pr53, head dc08c5c. I compared it with
e8ce493 (`git diff e8ce493 dc08c5c`, 11 files). I edited, committed and pushed nothing, and opened no KEY.md file.
Every source below was re-opened in this run unless I say otherwise.

## The short version
All ten earlier findings are fixed on the pages. The new page text matches its sources. D1's wording, which gives
both readings, is accurate to the sources. Two small source-log problems remain. Neither changes what a visitor reads:
- **N1:** the Göbekli Tepe log was not fully brought in line with the fixes.
- **N2:** the Chichén Itzá log describes an INEGI page that this run could not open, and the log does not say whether
  the fix run opened it.

Both can be fixed by the build side without Carter.

## Automatic checks (read-only, run from /home/claude/pr53)
- `node tools/verify-pilgrimage.js`: "73 sites, 3 live, 7 preview; 235 links, relics and info points checked: OK".
- `node tools/review-checks.js` (without --build): PASSED, 9 checks, 0 failed, 0 warnings. Wikipedia share: Chichén
  19% (5/26), Delphi 13% (4/31), Göbekli 0% (0/17), Mogao 0% (0/16). The build check was skipped (no --build).
- The working tree was clean after the checks.
- `framework/registry/source.json` changes only by swapping the Britannica Tushita URL for the Maitreya print URL.
  That is consistent with the log change.

---

## The ten earlier findings

**G1 (excavators vs magazine): resolved on the page; log leftover in N1.**
- `gobekli-tepe/site.js` encD, encC and the About card now say "a 2012 report in *Current World Archaeology*".
- The `dims.js:19-21` comment now says "the magazine's own report".
- The CWA page (https://www.world-archaeology.com/features/turkey-gobekli-tepe/) has no byline; its page metadata
  names the author as "Current World Archaeology". It reads "While Enclosure C may be the most impressive, Enclosure D
  is the largest", unattributed. Issue 53, 28 May 2012.

**G2 (twenty "large"): resolved.**
- `site.js` hill card: "at least twenty enclosures, more than ten of them large, most still buried."
- The 2018 DAI geophysics post quotes Schmidt 2003: "More than ten large enclosures could be located in the geomagnetic
  map … a minimum of 20 enclosures seem to exist inside the mound".

**G3 (lettering order): resolved on the page; log leftover in N1.**
- The card now reads "lettered A to D: A … was the first found, in 1996; B beyond it was the second".
- `dims.js:19` now reads "(A found first, in 1996, and B second)".
- Both claims are within the sources (?p=861; "Enclosure B: a short overview", "the second structure discovered").

**G4 (walkways): resolved on the page.**
- The card now reads "Today the excavation lies under large modern shelter roofs", which matches Clare 2020 ("the two
  recently constructed protective shelters").
- The log says Clare does not mention walkways.
- "Nearest the walkway" in the A–B card refers to the model's own walkway, which the walk puts the visitor on, so it is
  not a claim about the real site. A code comment, not shown to visitors, still says so (see N1).

**D1 (composer's name): resolved; the wording is accurate.**
- Card text: "The first names its composer, Athenaios. The name is damaged: the Delphi Museum reads 'Athenaios son of
  Athenaios', while other editors read only 'Athenaios' and give the father's name as a possible identification."
- The Delphi Museum page (https://www.delphimuseum.gr/2025/03/the-delphic-hymns-to-apollo.html) says the heading
  "names 'Athēnaios Athēnaiou' (Athénaios son of Athénaios) as the composer".
- AIO CID III 1 (https://atticinscriptions.com/inscription/CIDIII/1) translates "which Athenaios composed". Its notes
  say the name is restored (CID III; Pöhlmann and West), and that the poet "might be identified with Athenaios son of
  Athenaios" from F.Delphes III 2, 47.
- So "damaged", "other editors read only 'Athenaios'" and "a possible identification" all match the sources. The CHS
  article, checked in the previous round, also prints only [Ἀθ]ήναιος.
- The log (`sources/pilgrimage-delphi.md` ~line 43) matches.

**D2 (more restored than one word): resolved.**
- The card now reads "The stone is broken, so the first word and parts of several others are editors' restorations."
- The `s1-way.js:166` comment matches.
- The log names the restored parts of Ἑλικῶνα, λάχετε, Διὸς, ἐριβρόμου and εὐώλενοι. This matches the AIO Greek text
  checked in the previous round.

**D3 (About card exceptions): resolved.**
- The About card now names all three exceptions: the two maxims in the porch (`s2-temple.js:69-70`), the hymn panel,
  and the Polygonal Wall line, described as "the freedom records' usual formula" (`greek.js:110`).
- The Polygonal Wall flag is now "Usual formula, not one record". The card body's "not a transcription" stays and is
  consistent.
- The log (lines 12–15) keeps its honest caveat that the formula's exact wording is "not yet checked against an edited
  record". The page's "usual formula" is the wording the previous review proposed. I did not settle the formula
  against an edition in this run. This is a note, not a finding.

**D4 (Sphinx date): resolved.**
- The card now reads "set up about 570–560 BCE (the sources differ)".
- The Ministry page (https://delphi.culture.gr/the-sphinix-of-the-naxians/) says "ca 560 B.C." and "approximately
  12.45 meters".
- The Delphi Museum page (https://www.delphimuseum.gr/2024/05/the-column-of-naxians-and-sphinx.html) says "around
  570 B.C.", a column of 10 m, and "almost thirteen meters". The log matches.

**C1 (Maya population): resolved on the page; log issue in N2.**
- `chichen-itza/site.js:125` now reads "by one count, about 1.6 million people in Mexico are counted as Yucatec Maya
  today."
- Wikipedia "Yucatec Maya people" gives "Currently there are 1,646,782 Yucatec Mayans in Mexican territory", footnoted
  to INEGI. The archived URL is
  https://web.archive.org/web/20160303165419/http://cuentame.inegi.org.mx/hipertexto/todas_lenguas.htm.
- The hedge ("by one count", "in Mexico") matches the source. Wikipedia stays a labelled pointer, and the share is 19%,
  under 20%.

**M1 (Britannica AI summary): resolved.**
- REF.brit now cites Britannica "Maitreya".
- The print view (https://www.britannica.com/print/article/358868) has: "most recently revised and updated by Virginia
  Gorlinski"; "presently a bodhisattva residing in the Tushita heaven"; "will descend to earth to preach anew the
  dharma"; Gautama Buddha's teachings having decayed. The card wording is supported, and the log quotes it correctly.
- No live citation of the Tushita page remains. The only mention is the log's note that it was replaced.

---

## New findings

**N1 (fixable, minor). The Göbekli Tepe source log does not fully match the fixes.**
- `sources/pilgrimage-gobekli-tepe.md:55`: the CWA 2012 feature is still listed under the heading "## Excavators'
  publications" (line 13). G1 established that it is the magazine's own unsigned report, not an excavators'
  publication.
- `docs/pilgrimage/sites/gobekli-tepe/dims.js:5-7`: the header defines "SURVEY means the figure is published by the
  excavators … or by UNESCO". But line 20 tags the CWA "10 to 30 m" range as SURVEY, credited to "the magazine's own
  report".
- `sources/pilgrimage-gobekli-tepe.md:41-43`: the geophysics entry quotes only "a minimum of 20 enclosures". The card
  now also uses "More than ten large enclosures could be located in the geomagnetic map" (confirmed on that page), and
  that quote is not logged.
- `sources/pilgrimage-gobekli-tepe.md:88` still records "lettering in order found". There is no log note that the
  wording was narrowed in dc08c5c.
- Optional: the code comment at `site.js:81`, "at the real site visitors keep to the walkways", is the same unsourced
  walkway claim that was removed from the card. Visitors do not see it.

*Fix:*
- Move the CWA entry under a separate heading (for example "Other reports").
- Widen the SURVEY definition in dims.js to cover it, or tag the figure "CWA 53".
- Add the "more than ten large" quote to the geophysics entry.
- Add a one-line log note for the dc08c5c changes (G1–G4).
- Optionally reword the code comment.

**N2 (fixable, minor). The Chichén Itzá log describes an INEGI page without saying whether it was opened.**
- `sources/pilgrimage-chichen-itza.md:32-33`: "footnoted to an archived 2016 INEGI page that does not say whether it
  counts speakers or self-identification".
- This is a claim about what the INEGI page contains, yet the log does not say the page was opened.
- In this run the archived INEGI page could not be opened (web.archive.org: site blocked), and a search did not find
  the figure in INEGI material. I cannot confirm what the page counts.
- The previous review's point was that Wikipedia does not say what the figure counts. The log has moved that point onto
  the INEGI page.
- The CLAUDE.md sourcing standard asks that anything not opened be said so in the source log.

*Fix:* reword to say that Wikipedia does not say whether the figure counts speakers or self-identification, and that
the INEGI page it cites was not opened (or was opened, if the fix run did, giving what it shows). The card's "by one
count" hedge can stay as it is.

---

## Needs your decision (Carter)
Nothing new. D1's wording is accurate to the sources, and whether it reads acceptably is the question already put to
you separately. N1 and N2 are log fixes for the build side. A different run should confirm them before the merge
proposal.

---

## review-pr53-0e74caa

VERDICT: PASS (0 findings, 0 NEEDS CARTER)

# Confirming review of PR #53 (Pilgrimage batch 1) at 0e74caa

Reviewed 2026-10-25 by a run that wrote none of #53. Checkout: /home/claude/pr53, head confirmed as 0e74caa
("Pilgrimage batch 1: source-log fixes from the confirming review of dc08c5c"). Compared against dc08c5c
(`git diff dc08c5c 0e74caa`: 4 files, +17/-5). I edited, committed and pushed nothing, and opened no KEY.md file.

## The short version
Every part of N1 and N2 is fixed, and the fixes are accurate. The diff changes only source logs and code comments.
No text that visitors see has changed, and the diff adds no new problem.

## N1 (Göbekli Tepe log, dims.js, site.js comment): resolved
- **CWA under "Excavators' publications":** fixed. `sources/pilgrimage-gobekli-tepe.md:56` adds a new heading,
  "## Other publications about the excavation", and the CWA 53 entry now sits under it. The entry now ends: "The
  feature has no byline: its judgements are the magazine's own, not the excavators', and the cards say so."
  - I re-opened https://www.world-archaeology.com/features/turkey-gobekli-tepe/ in this run.
  - No author is named; the page metadata credits "Current World Archaeology".
  - It is an extract from issue 53.
  - It reads "concentric rings, ranging from 10m to 30m in diameter" and "While Enclosure C may be the most
    impressive, Enclosure D is the largest". The log entry matches.
- **dims.js SURVEY definition:** fixed. `dims.js:5-8` now says SURVEY covers figures published "by the excavators …,
  by UNESCO, or in a published report on the excavation (Current World Archaeology 53, 2012)".
  - This now covers the "10 to 30 m" tag at lines 21-23, which still credits "the magazine's own report".
  - *Note, not a finding:* the page is a magazine feature, not a formal excavation report. The comment names the
    magazine and the issue, so it is not misleading, and visitors never see it.
- **Geophysics quote:** fixed. Log lines 41-44 now quote both "More than ten large enclosures could be located in the
  geomagnetic map" and "a minimum of 20 enclosures seem to exist inside the mound".
  - The previous review re-opened the 2018 DAI post and confirmed both quotes.
  - The hill card's source line (`site.js:138`) still quotes only the "minimum of 20" phrase, but it cites the same
    post (REF.ttGeo). That is enough.
- **Lettering note:** fixed by an added note. A new section, "Second fix run, 2026-10-25" (log lines 111-116),
  records all four changes:
  - the CWA judgements are now credited to the magazine;
  - "more than ten of them large";
  - "lettered A to D", with only A first and B second;
  - no walkways on the shelter card.
  - The older line 91 ("lettering in order found") stays as history. The newer note supersedes it, which is
    acceptable for a dated log.
- **site.js:81 comment (optional):** done. It now reads "the ramp down into the hollow (the model's own, not a
  feature of the real site)". The unsourced walkway claim is gone. The comment only says what the model does.
  - The remaining "walkway" mentions in s0, s1, s4 and site.js are about the model's own walkway, which the visitor
    walks on. None of them claims anything about the real site.

## N2 (Chichén Itzá log, INEGI page): resolved
- `sources/pilgrimage-chichen-itza.md:32-34` now says the figure is footnoted to an archived 2016 INEGI page that
  "was not opened (the archive site is blocked from the build environment)". It adds that Wikipedia does not say
  whether the figure counts speakers or self-identification.
- This run checked the blocked page itself. A fetch of
  https://web.archive.org/web/20160303165419/http://cuentame.inegi.org.mx/hipertexto/todas_lenguas.htm failed
  ("site_blocked"; curl: CONNECT 403). So the log's statement is true.
- The point about Wikipedia comes from the previous review, which re-opened the Wikipedia page.
- The log no longer describes the contents of a page nobody opened, so it now meets the CLAUDE.md rule that anything
  not opened be said so in the source log.
- The card's "by one count" hedge is unchanged.

## New problems introduced by the diff
None found.
- No visitor-facing text changed. The site.js change is a code comment only.
- No citation was added or removed.
- No source's claim was reworded beyond what that source says.

## Automatic checks (read-only, from /home/claude/pr53)
- `node tools/verify-pilgrimage.js`: "73 sites, 3 live, 7 preview; 235 links, relics and info points checked: OK".
- `node tools/review-checks.js` (without --build): PASSED, 9 checks, 0 failed, 0 warnings.
  - Wikipedia share: Chichén 19% (5/26), Delphi 13% (4/31), Göbekli 0% (0/17), Mogao 0% (0/16).
  - The build-match check was not run (no --build).
- The working tree was clean after the checks (`git status --short` empty).

## Needs your decision (Carter)
Nothing new. The question about D1's wording, put to you separately, is still open.

