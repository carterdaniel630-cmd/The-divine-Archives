# Build brief: Jerusalem c. 30–33 CE — (1) the Tomb and Golgotha, (2) the Mount of Olives

Research brief for two proposed Pilgrimage sites. Prepared 2026-10-06. **Not built, not approved.** Both are new sites, so
they need Carter's approval before any work starts (CLAUDE.md: new content and religious-sensitivity questions).

## How to read this brief

- Every claim is followed by its source in square brackets.
- Each item carries one of three tags:
  - **[WS] well-supported:** solid archaeology or text, with broad scholarly agreement.
  - **[CT] contested:** serious scholars disagree. Show it as disputed on site.
  - **[CJ] conjecture:** our modelling guess, or a weakly sourced claim. Label it as reconstruction on site.
- **TEXT** marks something that comes from a Gospel or another ancient text only. The site must say "the Gospel of
  Mark says…", not "it happened".
- **Research limits.** These findings came from web searches done on 2026-10-06. This session's network blocked direct
  fetching of most source pages (Wikipedia, BAR, National Geographic, BYU, Cambridge). Many claims therefore rest on
  search-result summaries of the named publications. Every one is flagged **(verify)** where the exact figure or wording
  must be checked against the primary publication before it goes on a label. No citation here is invented: each
  author, title and year below came back from a search. Page numbers are not given, because they were not seen.
- The sun and moon figures in section 1 are **our own calculation**, made with PyEphem 4.2.1 for Jerusalem (31.778 N,
  35.230 E). They are reproducible and are not quoted from a publication.

---

## 0. The headline decision: "the day of the crucifixion" is not one documented day

The owner wants "the way it looked the day of the crucifixion".

- **The date.** The year (30 or 33 CE are the two leading candidates) and the day (Nisan 14 or 15) are both
  **contested** (section 1).
- **The place.** The traditional site is the Church of the Holy Sepulchre. It is the best-supported candidate, but it
  is not proven. One respected scholar places the crucifixion some 200 m south of the tomb (section 2).
- **The Mount of Olives.** No ancient source places the crucifixion there (section 4).

**Recommendation.** Frame both sites as **"Jerusalem in the spring of c. 30–33 CE, at Passover"**. Model the moment as
the reconstruction it is, and put a visible "What we know / what is debated" panel at each portal. Concretely:

- Show the crosses empty, on a bare quarry knoll near the road and the gate.
- Show the tomb with its blocking stone moved aside.
- Do not stage the morning, noon darkness or evening of one specific Gospel account as fact.

---

## 1. Dating, season, sky and weather

### 1.1 Year and day

**[WS] The outer limits.** All the ancient sources place the death under Pontius Pilate, prefect of Judaea in about
26–36 CE. The Gospels, Josephus and Tacitus agree on this, and the high priest Caiaphas fits the same window.
[J. P. Meier, *A Marginal Jew*, vol. 1 (Doubleday, 1991), as summarised in secondary discussion; see also the Pilate
dates in C. J. Humphreys and W. G. Waddington, "Dating the Crucifixion", *Nature* 306 (1983) 743–746,
https://link.springer.com/article/10.1038/306743a0]

**[WS] The day of the week.** All four Gospels put the death on a Friday, the "Preparation" day before a Sabbath
(**TEXT**: Mark 15:42; John 19:31).

**[CT] Nisan 14 or Nisan 15.**
- The Synoptic Gospels make the Last Supper a Passover meal, which puts the crucifixion on Nisan 15.
- John puts the death on Nisan 14, the day the Passover lambs were slaughtered (John 18:28, 19:14).
- Proposed harmonisations (different calendars and so on) are not agreed.

[Overview: Catholic Education Resource Center, "The dating of the Last Supper",
https://catholiceducation.org/en/culture/the-dating-of-the-last-supper.html; Biola, "Chronology of Easter in John and
the Synoptic Gospels" (2015), https://www.biola.edu/blogs/good-book-blog/2015/chronology-of-easter-in-john-and-the-synoptic-gospels]

**[CT] Friday, 7 April 30 or Friday, 3 April 33** (Julian calendar). These are the two leading candidates.
- Astronomically reconstructed calendars allow a Friday Nisan 14 in both years. [Humphreys & Waddington, *Nature*
  1983, above; C. J. Humphreys, "The Jewish Calendar, a Lunar Eclipse and the Date of Christ's Crucifixion",
  *Tyndale Bulletin* 43.2 (1992), https://doaj.org/article/b905692479344a219dae678a3989ac8b]
- Meier favours 7 April 30. [Meier 1991, as summarised; **verify** in vol. 1, ch. 11]
- Humphreys and Waddington favour 3 April 33.

Both of those works depend on assumptions about how the month began, by first sighting of the new crescent, and when a
leap month was added. Neither year is proven.

### 1.2 The sky (our calculation, valid for both candidate dates) [WS for astronomy, CJ for which date]

| | 7 April 30 CE | 3 April 33 CE |
|---|---|---|
| Sunrise / sunset (local solar time) | 05:44 / 18:21 | 05:49 / 18:19 |
| Sun at midday | 64° high, due south | 63° high, due south |
| Moon | Full the night before (6 April, about 22:00); rises about 19:15 on Friday evening | Full at about 17:15 on Friday; rises at about sunset, 18:18 |
| Thursday night (arrest night), local midnight | Moon about 55° high in the south, 99.9% lit | Moon about 56° high, south-southwest, 99.5% lit |

Method: PyEphem 4.2.1, observer at 760 m, standard refraction. The "Delta-T" correction (Earth's slowing rotation) is
uncertain by some minutes for the 1st century, so treat the times as ±10–15 min.

**What this means for the build:**
- The midday sun is high in the south. Crosses and walls cast short shadows to the north.
- **Gethsemane on the arrest night should be lit by a near-full moon high in the southern sky.** This holds for either
  year, because Passover always falls at the full moon of spring. That much is certain. Whether that night was cloudy
  is not known.
- There were no time zones then. Show "hours" as daylight-hours, the way the Gospels count them ("the sixth hour" is
  about noon).

**[CT] The 33 CE lunar eclipse.**
- Humphreys and Waddington argue that a partial lunar eclipse was in progress as the moon rose over the Mount of Olives
  on 3 April 33. They link it to Acts 2:20 ("the moon into blood"). [Humphreys & Waddington 1983; Humphreys 1992]
- Schaefer argues that the eclipse would have been barely visible at moonrise. [B. E. Schaefer, "Lunar visibility and
  the crucifixion", *Quarterly Journal of the Royal Astronomical Society* 31 (1990) 53–67]
- Our own run puts the moon about 1.6° from the centre of Earth's shadow at moonrise, which is consistent with only the
  shadow's faint outer fringe still touching it.
- Do not render a "blood moon" as fact. At most, offer an optional, labelled "33 CE eclipse hypothesis" view.

### 1.3 Darkness and earthquake: text, not evidence

**[TEXT] The darkness.** Mark 15:33 has darkness "over the whole land" from the sixth to the ninth hour. Luke 23:45 has
"the sun's light failed", and some manuscripts use the verb "was eclipsed".

**[WS] A solar eclipse was impossible.** Passover falls at the full moon, when the moon is on the far side of the
Earth from the sun. Julius Africanus already made this point in the 3rd century.

**[CT] The pagan "witnesses".** The claims that the 1st- to 2nd-century writers Thallus and Phlegon recorded the
darkness reach us only through later Christian quotations (Africanus, Origen, Eusebius). They may refer to an unrelated
eclipse. [Summary of the debate in e.g. W. L. Craig, "Thallus on the darkness at noon", reasonablefaith.org; use the
primary references to Africanus' *Chronographiae* fragment in Syncellus when writing the label (**verify**)]

**[CT] The earthquake (Matthew 27:51).** A Dead Sea sediment layer shows an earthquake in the early 1st century CE. It
has been proposed to match. Its date range is far too wide to tie it to one day.
[J. B. Williams, M. J. Schwab and A. Brauer, "An early first-century earthquake in the Dead Sea", *International
Geology Review* 54.10 (2012) 1219–1228]

**Build rule.** Default sky: a clear or partly cloudy spring day. A "Gospel accounts" toggle may dim the sky, labelled
"Mark 15:33 describes…; there is no independent evidence of this darkness."

### 1.4 Weather and season [WS for climate; CJ for any given day]

- **Climate.** Jerusalem in April averages roughly 10–13 °C at night and 17–23 °C by day. It is the tail of the rainy
  season, with a few rain days. [Israel Meteorological Service monthly summaries, e.g.
  https://ims.gov.il/sites/default/files/2025-07/2025%20April%20Summary%20-%20EN.pdf (modern climate, used as a
  proxy)]
- **Desert-wind heat waves** (*sharav* or *khamsin*: hot, dusty, hazy days) do occur in April. [same IMS summary]
- **[TEXT] A cold night.** John 18:18 has servants warming themselves at a charcoal fire on the night of the arrest.
  This fits a cold April night.
- **Vegetation in early April:**
  - **Green:** winter grass and spring flowers, barley ripening.
  - **Silvery:** the olive trees, which do not flower until about May.
  - **[CJ]** This general picture follows modern climate. Ancient-climate studies suggest the Roman period was broadly
    similar.

---

## 2. Golgotha and the tomb

### 2.1 Candidate A: the Church of the Holy Sepulchre site — the best-supported candidate, but contested

**[WS] A quarry.** The site was an old quarry for *meleke* limestone, worked during the period of the Judean kings
(the Iron Age). It lay outside the city at the time of Jesus.
- **Church of the Redeemer, 1970–74:** the German Protestant Institute reached quarried bedrock about 14 m below the
  present floor. [German Protestant Institute of Archaeology, Church of the Redeemer excavations, 1970–74, summarised
  at https://bibleinterp.arizona.edu/node/2383 and in D. Vieweger's museum "Durch die Zeiten" (**verify** depth)]
- **Restoration work inside the church, 1973–78** (V. Corbo and others) confirmed the quarry.
  [S. Gibson and J. E. Taylor, *Beneath the Church of the Holy Sepulchre, Jerusalem: The Archaeology and Early History
  of Traditional Golgotha*, PEF Monograph Series Maior 1 (London, 1994),
  https://dig.corps-cmhl.huji.ac.il/node/8782]
- **Kathleen Kenyon, 1960s, in the Muristan:** she found quarry and fill under the area just south of the church, and
  concluded it lay outside the city in the early 1st century. [Kenyon's Muristan sounding, summarised at
  worldcrunch.com, "X marks the spot…" (**verify** in K. Kenyon, *Digging Up Jerusalem*, 1974)]

**[WS] A burial ground.** The quarry was in use for burials by the 1st century. Typical 1st-century *kokhim* tombs
survive just west of the Edicule (the shrine over the tomb), in the so-called "Tomb of Joseph of Arimathea", off the
Syriac Orthodox chapel. Kokhim are long, narrow burial niches cut into the rock.
[Gibson & Taylor 1994; summary in J. Chadwick, "Revisiting Golgotha and the Garden Tomb", *Religious Educator* 4.1
(BYU, 2003), https://rsc.byu.edu/vol-4-no-1-2003/revisiting-golgotha-garden-tomb]

This matters for authenticity. Jewish law kept tombs outside the town, at least 50 cubits away (Mishnah *Bava Batra*
2:9). So 1st-century tombs here are good evidence that the area lay outside the walls.

**[WS] A garden.** Excavations under the church floor since 2022 (Sapienza University of Rome, directed by
F. R. Stasolla) have recovered pollen and seeds of olive and grapevine from soil between the quarry and the
1st-century levels. The quarry had been partly filled and cultivated.
[Reports of 2025: https://archaeologymag.com/2025/04/ancient-garden-found-at-jesus-burial-site;
https://www.mecc.org/news-en/2025/7/14/the-stones-speak-excavations-reshaping-the-history-of-the-holy-sepulchre
(**verify** final publication)]
- **[CT]** Exactly how these layers are dated is not yet in a full peer-reviewed report. The press coverage linking
  them to John 19:41 ("in the place… there was a garden") is interpretation.

**[CT] The Second Wall.** Josephus says the Second Wall began at the Gennath ("Garden") Gate in the First Wall and ran
to the Antonia fortress (*Jewish War* 5.146). Its line has never been fully traced on the ground, and it has been
argued over for more than 150 years.
- The traditional site is authentic only if the wall ran east and south of the quarry. Most excavators (Kenyon,
  the Redeemer dig, Gibson and Taylor) think it did.
- That is a strong inference, not a traced wall.

[Josephus, *Jewish War* 5.146 (Whiston translation at https://lexundria.com/j_bj/5.136-5.183/wst); German Protestant
Institute summary as above; Israel Antiquities Authority, "Jerusalem walls" history pages,
https://antiquities.org.il/jerusalemwalls/hstry_05_eng.asp]

**[WS] The Third Wall did not exist yet.** Agrippa I began the Third Wall in about 41–44 CE. It is what later brought
this area inside the city. [Josephus, *Jewish War* 5.147–155; BAR news item "Third wall of Jerusalem",
https://www.biblicalarchaeology.org/daily/news/third-wall-of-jerusalem/]
- **Build rule:** model no Third Wall. The area north and west of the Second Wall was open quarry, gardens and tombs.

**[CT] Where exactly were the crosses?**
- **The Rock of Calvary** inside the church is an unquarried knob of bedrock, about 4.8 m high and 7 × 3 m. It is
  reported as cracked, which would explain why the quarrymen left it. [Dimensions as commonly cited, e.g.
  newworldencyclopedia.org "Calvary" (**verify** against Gibson & Taylor 1994 or Corbo's *Il Santo Sepolcro di
  Gerusalemme*, 1981–82)]
- **[CJ]** A circular socket about 11.5 cm across, found in the rock in 1986, is sometimes said to have held an upright
  post. This claim is weakly sourced: it was found only on encyclopedia pages, with no excavation report seen. Do not
  label it as evidence.
- **[CT] Taylor's view.** J. E. Taylor argues that "Golgotha" named the wider disused quarry. In her reading the
  execution place was further south, near the Gennath Gate and two roads, and the tomb was about 200 m to the north.
  She now thinks the tomb may well be authentic. [J. E. Taylor, "Golgotha: A Reconsideration of the Evidence for the
  Sites of Jesus' Crucifixion and Burial", *New Testament Studies* 44 (1998) 180–203]
- **[CT] Gibson's view.** S. Gibson supports the general area of the church for both the execution and the burial.
  [S. Gibson, *The Final Days of Jesus: The Archaeological Evidence* (HarperOne, 2009)]

**Decision for Carter:** put the empty crosses on the traditional Calvary knob, or in a neutral "somewhere in this
quarry, near the gate and road" position with both views shown. The brief recommends the second.

**[WS] The tomb under the Edicule today.**
- **What survives.** Most of the rock tomb was cut away: by Constantine's builders (about 326 CE) to free it as a block,
  and again in the destruction ordered by the caliph al-Hakim in 1009. What survives is the north wall with the burial
  bench, and parts of the south wall.
  [M. Biddle, *The Tomb of Christ* (Stroud: Sutton, 1999), based on his photogrammetric survey of the Edicule from
  1986 on; review, *Journal of Roman Archaeology*,
  https://www.cambridge.org/core/journals/journal-of-roman-archaeology/article/7E5FC29153F52B752E6E63B2B313C8BC]
- **The 2016 opening.** The National Technical University of Athens (NTUA) restored the Edicule in 2016–17, led by
  Antonia Moropoulou. On 26 October 2016 the team lifted the marble cladding, which dates from 1555 at the latest. They
  found:
  - an earlier marble slab incised with a cross;
  - beneath it, the original limestone burial bed;
  - limestone walls of the cave still standing within the Edicule.
  [National Geographic, "Jesus' tomb opened…" (Oct 2016) and "Jesus tomb archaeology…" (Nov 2017),
  https://www.nationalgeographic.com/history/article/jesus-tomb-archaeology-jerusalem-christianity-rome;
  CS Monitor, 1 Nov 2016, https://www.csmonitor.com/Science/2016/1101/Jesus-Tomb-opened-What-did-we-learn-so-far]
- **[WS] Mortar dating.** Mortar between the burial bed and that slab was dated by optically stimulated luminescence
  (OSL, which dates when grains last saw light) to about 345 CE, in two laboratories. Mortar from the south wall gave
  about 335 CE and about 1570 CE.
  - This shows the bed was enshrined in Constantine's time, as Eusebius reports.
  - **It does not and cannot date the tomb's use in 30 CE.** [same National Geographic 2017 report; Catholic News
    Agency, 30 Nov 2017]
- **[CT] Whether this is Jesus' tomb.** It is a 1st-century-type Jewish tomb, venerated from at least the 320s and
  identified for Constantine under a Roman temple built by Hadrian.
  [Eusebius, *Life of Constantine* 3.25–40; Hadrian's temple: e.g. https://worldcrunch.com/culture-society/x-marks-the-spot-archaeologists-dig-for-exact-place-where-jesus-died]
  The tradition is old and the setting fits. Identity cannot be proven.
- **[CT] The form of the burial place.** It is not settled whether it was a flat bench, an arcosolium (an arched niche
  over a bench) or a trough. Biddle discusses the options. [Biddle 1999 (**verify**)]

### 2.2 Candidate B: the Garden Tomb

**[WS] Its origin.** The Garden Tomb lies north of the Damascus Gate. It was identified in 1883 by General Charles
Gordon, who saw a "skull" in the nearby escarpment, "Skull Hill". It is run by the Garden Tomb Association.
[Madain Project, https://madainproject.com/the_garden_tomb; Bible Places, "Gordon's Calvary, Then and Now"]

**[WS / CT] Its date.** Gabriel Barkay dates the tomb to the Iron Age (8th–7th century BCE). It belongs to a complex of
First Temple–period tombs, with Iron Age bench types and pottery. On that reading it was not a "new tomb" in 30 CE.
[G. Barkay, "The Garden Tomb: Was Jesus Buried Here?", *Biblical Archaeology Review* 12:2 (March/April 1986),
https://old.biblicalarchaeology.org/node/120663]
- Most archaeologists accept this dating.
- The Garden Tomb Association itself does not insist it is the tomb. It presents the garden as a place to remember the
  events. (**Verify** its current wording before quoting.)

**[WS] The "rolling stone" channel.** The channel in front of the Garden Tomb has a sloping outer edge, so it could not
have held a rolling disk. Known rolling-stone tombs have vertical walls on either side of the entrance.
[michaelminn.net summary of the site, https://michaelminn.net/countries/israel/garden_tomb/index.html (**verify** in
Barkay 1986)]

**Build rule:** this is the owner's choice, but the brief recommends **modelling the tomb at the Holy Sepulchre
quarry**, with the Garden Tomb shown as a labelled "the other site visitors are shown" panel or a separate (C) site, as
the master list already proposes.

### 2.3 What a well-to-do Jewish rock-cut tomb of c. 30 CE looked like [WS, from typology]

**Scale.** About 900 family tombs and 60 single graves of the late Second Temple period ring Jerusalem within about
4 km. [A. Kloner and B. Zissu, *The Necropolis of Jerusalem in the Second Temple Period* (Leuven: Peeters, 2007), as
summarised at https://4enoch.org/wiki5/index.php/The_Necropolis_of_Jerusalem_in_the_Second_Temple_Period_(2007_Kloner,_Zissu),_book]

**Typical layout:**
- a rock-cut forecourt;
- a small, low, square entrance that you stoop to enter;
- a burial chamber, often with a **standing pit** cut into the floor so a person can stand, leaving raised
  **benches** on three sides;
- **kokhim** (singular *kokh*: long niches cut into the walls), about 1.8–2 m deep and about 0.45–0.6 m wide and high,
  each for one body or for ossuaries (bone boxes for the bones after decay);
- **arcosolia** (arched niches over a bench or trough), mostly in later and richer tombs.

[Kloner & Zissu 2007; Israel Antiquities Authority site record for the Arnona cave: standing pit, three benches and six
kokhim, late 1st century BCE–70 CE, https://antiquities.org.il/site_Item_eng.aspx?id=168 (**verify** dimensions)]

**[WS] The blocking stone.** Of more than 900 tombs Kloner examined, only **four** had round, rolling disk-stones. All
four belong to very wealthy, even royal, families, for example the "Tomb of the Kings" of Queen Helena of Adiabene,
which is later than 30 CE. Nearly all others were closed with a **square, plug-like stone**.
[A. Kloner, "Did a Rolling Stone Close Jesus' Tomb?", *Biblical Archaeology Review* 25:5 (Sept/Oct 1999) 22–25;
summary at https://www.biblicalarchaeology.org/daily/biblical-sites-places/jerusalem/how-was-jesus-tomb-sealed/]

**[CT] Which stone to model.**
- **TEXT:** the Gospels use verbs of rolling for the stone (Mark 15:46, 16:3–4).
- Kloner argued that these verbs could describe rolling a square stone aside.
- Others read them as a round disk.

The owner should choose. The recommendation is a square blocking stone moved aside, with a label giving both readings.
It is the commoner form, and "rich man's tomb" (Matthew 27:57–60) does not require a disk.

**[CJ] Our modelling defaults, labelled reconstruction:**
- a pale *meleke* rock face with tool marks;
- a small forecourt;
- an entrance about 0.8 m square;
- a single chamber with a bench on the right-hand (north) side, matching the surviving bench under the Edicule;
- a few unfinished kokhim, since the tomb is "new" (**TEXT**: Matthew 27:60; John 19:41);
- quarry faces and steps around it;
- olive and vine plots on the quarry fill;
- other family tombs nearby, as at the "Joseph of Arimathea" tomb.

---

## 3. Crucifixion practice (sober; empty crosses only)

**[WS] Yehohanan.** The only crucifixion victim found in the Jerusalem area is Yehohanan, from Givat HaMivtar. His
ossuary was found in 1968 in a tomb excavated under V. Tzaferis. His right heel bone is pierced by an iron nail about
11.5 cm long, bent at the tip, with a small wooden plaque under the nail head.
- **N. Haas (1970)** reconstructed the two heels as nailed together.
- **Zias and Sekeles (1985)** showed that each heel was nailed separately, to either side of the upright. They found no
  evidence that the forearms were nailed: the arms were probably tied.

[V. Tzaferis, "Jewish Tombs at and near Giv'at ha-Mivtar", *Israel Exploration Journal* 20 (1970); N. Haas,
"Anthropological Observations…", *IEJ* 20 (1970); J. Zias and E. Sekeles, "The Crucified Man from Giv'at ha-Mivtar:
A Reappraisal", *IEJ* 35 (1985) 22–27; overview at
https://www.biblicalarchaeology.org/daily/biblical-topics/crucifixion/a-tomb-in-jerusalem-reveals-the-history-of-crucifixion-and-roman-crucifixion-methods/]

**[WS] Other skeletal finds.**
- **Gavello, Rovigo, Italy:** a heel lesion, published in 2018 in *Archaeological and Anthropological Sciences*
  (Gualdi-Russo et al.).
- **Fenstanton, Cambridgeshire, England:** a 5 cm nail through a right heel, published in 2021 in *British
  Archaeology* (Albion Archaeology / Cambridge Archaeological Unit).

[https://www.livescience.com/62727-jesus-roman-crucifixion-found.html;
https://www.cam.ac.uk/stories/romancrucifixion]
- **What they establish:** feet were nailed through the heel from the side. **Nothing in them shows the shape of the
  cross.**

**[CT] The shape of the cross.** The Greek *stauros* and Latin *crux* covered upright stakes, T-shapes and †-shapes.
Gunnar Samuelsson argues that the ancient texts cannot settle the shape of Jesus' cross. Others (e.g. D. W. Chapman)
argue that cross-shaped devices were normal.
[G. Samuelsson, *Crucifixion in Antiquity* (Mohr Siebeck, 2011; thesis, Gothenburg); J. G. Cook, *Crucifixion in the
Mediterranean World* (Mohr Siebeck, 2014; 2nd ed. 2019),
https://mohrsiebeck.com/en/book/crucifixion-in-the-mediterranean-world-9783161531255]

- **[CT] The parts of a cross.** A fixed upright (*stipes*) and a crossbar (*patibulum*) carried by the condemned is the
  usual reconstruction. It rests on Roman texts (e.g. Plautus) more than on archaeology.
  - **TEXT:** John 19:17 ("carrying his own cross"); the Synoptics have Simon of Cyrene carry it (Mark 15:21).
- **[CJ] Height.** Figures of about 1.8–2.4 m for a "low cross", with the feet near the ground, come from medical and
  popular literature, notably W. D. Edwards et al., *JAMA* 255 (1986). That article is not archaeology and has been
  criticised.
  - **TEXT:** Mark 15:36 (a sponge on a reed) implies a height a little above arm's reach.
  - **Model choice:** about 2.5–3 m overall.
  - Mark it as reconstruction.
- **[TEXT / CJ] The notice (*titulus*).** John 19:19–20 describes a notice in Hebrew/Aramaic, Latin and Greek.
  - **Recommendation:** omit any modelled text, or show a blank board. Reconstructing the wording invites a sensitivity
    debate and adds no evidence.
- **[WS] Placed by roads, as a deterrent.**
  - A Roman declamation attributed to Quintilian (*Declamationes minores* 274) says crosses were set on the busiest
    roads so that many would see them (**verify** wording in Cook 2014).
  - **TEXT:** Mark 15:29 and John 19:20 have passers-by, and the place "near the city".
  - Josephus describes mass crucifixions before the walls in 70 CE (*Jewish War* 5.449–451,
    https://lexundria.com/j_bj/5.446-5.490/wst).
- **What is NOT known:**
  - the exact place and orientation of Jesus' cross;
  - whether a seat-peg or foot-rest was used;
  - whether the uprights were permanent posts;
  - how many crosses stood there that day beyond the three in the Gospels (**TEXT**).

**Build rule (owner's instruction plus sensitivity):**
- Three bare wooden crosses: weathered timber with rope, and **no figures, no blood, no nails shown, no instruments**.
- They stand on rock-cut sockets or stones packed round the base.
- The ground is plain. Nothing gruesome.
- The label is factual and short, and links to the archive's chapter on early Christianity.

---

## 4. The Mount of Olives, c. 30 CE

### 4.1 Topography [WS]

- **The ridge.** The Mount of Olives is a ridge about 3.5 km long east of the city. Its summits are at roughly
  800–826 m. Its crest stands about 70–80 m above the Temple platform and more than 100 m above the floor of the
  Kidron Valley.
  [Encyclopedia.com "Mount of Olives"; Britannica "Mount of Olives" (**verify** heights against the elevation data
  below; the search results gave muddled summit names)]
- **The Kidron Valley** separates the ridge from the Temple Mount. It was deeper in the 1st century than today because
  of later fill. [same]
- **Elevation data.** For our own terrain:
  - Copernicus DEM GLO-30 (30 m grid; free licence with a required attribution line,
    https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/DEM/resources/license/License-COPDEM-30.pdf);
  - or SRTM (public domain, 30 m or 90 m).
  - Modern buildings and the Kidron fill must be hand-corrected. **[CJ]** for the 1st-century ground surface.

### 4.2 What was on the slopes in 30 CE

**[WS] A Jewish necropolis.** Burial caves of the 2nd century BCE to the 1st century CE were already cut into the
western slope.
- **Dominus Flevit:** Bagatti and Milik's excavations of 1953–55 found Second Temple caves with dozens of ossuaries,
  inscribed in Hebrew, Aramaic and Greek. [B. Bagatti and J. T. Milik, *Gli scavi del "Dominus Flevit"* I (Jerusalem,
  1958); Terra Sancta Museum, https://terrasanctamuseum.org/en/ossuaries-archaeological-witnesses-of-the-first-christian-community]
- **The Kidron Valley monuments, standing in 30 CE:**
  - the Tomb of Benei Hezir (2nd century BCE, with a priestly family's inscription);
  - the "Tomb of Zechariah", a monolith with a pyramid top;
  - the "Tomb of Absalom", dated to the 1st century CE.
  [Jewish Virtual Library, "Burial Sites & Tombs of the Second Temple Period",
  https://www.jewishvirtuallibrary.org/burial-sites-and-tombs-in-jerusalem-of-the-second-temple-period]
- **[CT]** Whether "Absalom" was finished by 30 CE is not settled. Its dating is only "1st century CE".

**[WS] Olives and oil presses.**
- **The name.** "Gethsemane" comes from Hebrew/Aramaic *gat shemanim*, "oil press".
- **The cave.** The "Grotto of Gethsemane" held an olive-oil installation of the late Second Temple period.
  [V. Corbo, *Ricerche archeologiche al Monte degli Ulivi* (Jerusalem, 1965) (**verify**); etymology: e.g. Britannica,
  "Gethsemane"]
- **The 2020 finds.** The Israel Antiquities Authority and the Studium Biblicum Franciscanum, under A. Re'em, found a
  Second Temple *mikveh* (ritual bath) beneath the Church of All Nations area. It was the first Second Temple find on
  the spot. The excavators suggest it served pure oil or wine production. [Smithsonian, Dec 2020,
  https://www.smithsonianmag.com/smart-news/archaeologists-have-unearthed-2000-year-old-ritual-bath-site-may-have-hosted-last-supper-180976624/;
  https://www.sci.news/archaeology/gethsemane-church-mikveh-09216.html]
- **[WS] Today's trees are not the 1st-century trees.** The oldest olive trees in today's Gethsemane garden were
  radiocarbon-dated to about 1092–1198 CE. DNA shows they come from one parent plant.
  [M. Bernabei, "The age of the olive trees in the Garden of Gethsemane", *Journal of Archaeological Science* 53 (2015),
  https://agris.fao.org/search/en/records/65de2b6c4c5aef494fda8a7d]
  - **Build rule:** do not model "the same trees".
- **[WS] There were many trees round the city before 70 CE.** Josephus says Titus' army cut down every tree for about
  90 furlongs (stadia) around the city, and that the gardens and beautiful suburbs became a desert.
  [Josephus, *Jewish War* 6.5–8 (book 6, ch. 1), https://penelope.uchicago.edu/Josephus/war-6.html]
- **[CJ] Our landscape mix:** terraced olive groves with field walls and cave presses, lower slopes with tomb façades,
  scattered vines and fig trees, and paths.

**[WS] Roads.**
- The Roman road to Jericho crossed the ridge between Mount Scopus and the Mount of Olives. A branch turned south to
  Bethphage and to Bethany on the eastern slope.
  [J. Wilkinson, "The Way from Jerusalem to Jericho", *Biblical Archaeologist* 38 (1975), as summarised at
  https://ferrelljenkins.blog/2015/10/23/jesus-rides-a-donkey-from-bethphage-to-jerusalem/]
- **[CT]** The exact 1st-century line of the paths over the crest is uncertain.

**[WS] The view to the Temple, and the Red Heifer rite.** The Mishnah says the Temple Mount's eastern wall was built
low. A priest standing on the Mount of Olives could then look through the eastern (Shushan) gate to the doorway of the
sanctuary while sprinkling the red heifer's blood.
[Mishnah *Middot* 1:3, 2:4, e.g. https://avande1.sites.luc.edu/jerusalem/sources/middot.htm]
- This is the best textual authority for the classic Mount of Olives view, looking straight into the Temple's façade.
- **[CT]** The Mishnah was edited about 200 CE and is idealising in places.

### 4.3 Events tradition places there — and what it does not

**[TEXT] The arrest.** The Gospels place the night prayer and the arrest at Gethsemane, "on the Mount of Olives",
across the Kidron (Mark 14:26, 32; John 18:1). The site was venerated by Christians by the 4th century: Eusebius'
*Onomasticon*; the Bordeaux Pilgrim (333); Egeria, who describes a church built there by the late 4th century.
[Custody of the Holy Land, "Gethsemane in the historical sources", https://custodia.org/en/sanctuaries/gethsemane]

**[TEXT] Other events placed there:**
- the Ascension (Acts 1:9–12; compare Luke 24:50, "as far as Bethany");
- the entry into Jerusalem from Bethphage (Mark 11:1);
- the lament over the city (Luke 19:41);
- the "Olivet discourse" (Mark 13:3).

Constantine's Eleona church marked a teaching cave on the summit.
[Church of the Pater Noster / Eleona summaries, e.g. https://www.catholicweekly.com.au/?p=269580]

**[WS] The crucifixion was not on the Mount of Olives.** All four Gospels put Golgotha by the city, outside a gate
(John 19:17–20; also Hebrews 13:12). Every ancient tradition places it on the west side, at the quarry. Ernest
L. Martin's 1988 theory, *Secrets of Golgotha*, placed it on the Mount of Olives. It has no support among
archaeologists.
[E. L. Martin, *Secrets of Golgotha* (1988); review, *Journal of Ecclesiastical History*,
https://www.cambridge.org/core/journals/journal-of-ecclesiastical-history/article/2CEE893A5FF81B7799784E0F5C4E1F26]

**Gentle on-site wording (proposed):**
> "The crucifixion did not happen here. The Gospels place it at a spot called Golgotha, just outside the city's
> western side, across the valley and beyond the Temple. From this hill you look toward the city where those events
> took place. The Gospels remember this hillside for the night before: Jesus' prayer among the olive presses of
> Gethsemane, and his arrest."

**Recommended Mount of Olives site content:**
- **No crosses at all.**
- The moonlit olive grove and oil-press cave, as the arrest-night scene, **without figures**.
- A western overlook across the Kidron to the Temple, the walls and, far beyond, the area of the western quarry.
- **[CJ]** Whether the Golgotha quarry could actually be seen from the ridge, past the Temple and the Upper City, needs
  a line-of-sight test on our terrain. Do not claim it until tested.

---

## 5. Jerusalem's appearance from these viewpoints

**[WS] The Temple Mount platform.** Herod extended the older platform north, west and south.
- Leen Ritmeyer identifies the earlier square, 500 cubits a side, inside it, using the Mishnah's figure and a line of
  pre-Herodian masonry (a "step") near the northwest of the raised platform. [L. Ritmeyer, *The Quest: Revealing the
  Temple Mount in Jerusalem* (Jerusalem: Carta, 2006); L. Ritmeyer, "Locating the Original Temple Mount", *BAR*
  (1992), summary at https://www.biblicalarchaeology.org/daily/biblical-sites-places/temple-at-jerusalem/the-temple-mount-in-the-herodian-period/]
- **[WS]** The outer retaining walls survive in large part. They give the platform's footprint as an irregular
  trapezoid. **[CJ]** The commonly quoted size is roughly 480 × 280–315 m. No source for this was seen in this
  session (**verify**), so take the exact figures from survey data or Ritmeyer 2006.
- **[WS] Not finished by 30 CE?** Coins of the prefect Valerius Gratus (struck about 17/18 CE) were found in a ritual
  bath filled in under the Western Wall's foundations near Robinson's Arch. Parts of the western wall and its street
  were therefore built after Herod's death (4 BCE).
  [R. Reich and E. Shukron, IAA announcement 2011,
  https://embassies.gov.il/MFA/IsraelExperience/Pages/Building-Western-Wall.aspx]
- **[CT] Robinson's Arch and the southwest corner may still have been under construction in 30–33 CE.**
- **[WS] The Pilgrimage Road.** The stepped street from the Pool of Siloam to the Temple Mount is reported as more than a third of a mile long (other
  reports give up to about 800 m), and about 8 m (26 ft) wide. Coins under its paving run to about 31 CE, so it was built under Pilate.
  [N. Szanton, M. Hagbi, J. Uziel and D. Ariel, *Tel Aviv* 46 (2019); National Geographic report, Oct 2019,
  https://www.nationalgeographic.com/history/article/road-built-biblical-villain-uncovered-jerusalem]
- **[CT] It may have been newly finished, or still partly a building site, at the crucifixion.** This is a nice,
  honest detail to show.

**[CT] Where the Temple stood on the platform.** All scholars place it on the Temple Mount. The southern "City of
David" theory of Martin and Cornuke is rejected. Its exact spot is debated:
- **Ritmeyer:** the Holy of Holies over the bedrock now under the Dome of the Rock (*es-Sakhra*). This is the majority
  view.
- **Kaufman:** further north.

[BAR sidebar "Where Was the Temple?", https://library.biblicalarchaeology.org/sidebar/where-was-the-temple/;
Bible Places on Cornuke, https://www.bibleplaces.com/?p=11735]

**Recommendation:** follow Ritmeyer, labelled as the majority reconstruction.

**[WS text / CT detail] The sanctuary building.**
- **Josephus:** the front was about 100 cubits wide and 100 high. It was plated with gold, which flashed at sunrise.
  From a distance it looked "like a mountain covered with snow", because the ungilded parts were very white. [Josephus,
  *Jewish War* 5.222–223, https://lexundria.com/j_bj/5.222-226/wst; *Antiquities* 15.391–420]
- **Mishnah *Middot*** gives somewhat different interior dimensions. The Holy of Holies was 20 × 20 cubits. [Mishnah
  *Middot* 4; Jewish Encyclopedia, "Middot", https://www.jewishencyclopedia.com/articles/10800-middot.html]
- Josephus and the Mishnah conflict on some figures. Where they do, say so on site (the plan already requires this for
  Herod's Temple).
- **Build note:** from the Mount of Olives at **sunrise** the east-facing gilded façade is the dramatic set-piece. In
  the afternoon it is backlit. Both are consistent with the sky table.

**[WS / CT] The Royal Stoa.**
- **Josephus:** a basilica of four rows of columns along the southern edge (*Antiquities* 15.411–416).
- **[CT]** The fragments are real; the elevation is reconstruction.

**[CT] The Antonia fortress.**
- **Josephus:** it stood at the northwest corner of the porticoes, on a rock 50 cubits high, with four corner towers,
  the southeast one taller (*Jewish War* 5.238–246).
- Its size and footprint are disputed. Minority views (e.g. Martin, Cornuke) inflate it to cover the whole platform;
  that view is rejected.

[Josephus, *Jewish War* 5.238–246; summary at https://madainproject.com/antonia_fortress]

**[WS text / CT location] Herod's palace and towers.**
- **Josephus' three towers:**
  - Hippicus: 25 × 25 cubits at the base, 80 cubits high;
  - Phasael: 40 × 40 cubits, 90 cubits high;
  - Mariamne: 20 × 20 cubits, 50 cubits high.
  [Josephus, *Jewish War* 5.161–175; https://lexundria.com/j_bj/5.136-5.183/wst]
- **What survives:** the base of one tower, Phasael or Hippicus (this is debated), inside today's Citadel (the "Tower
  of David"). [https://approachingjerusalem.substack.com/p/what-was-the-tower-of-davids-ancient]
- **The palace podium:** excavated in the Kishle, beside the Citadel.
- **[CT] Where Pilate held the trial: Herod's palace or the Antonia.**
  [National Geographic, "How did Jesus' final days unfold…", https://www.nationalgeographic.com/history/history-magazine/article/how-did-jesus-final-days-unfold-scholars-are-still-debating]
- **This matters for Golgotha.** Herod's palace stands right beside the Gennath Gate area, close to the Golgotha
  quarry, so a viewer at the quarry would see the three towers looming to the south.

**[WS] Anachronisms to avoid:**
- the Ecce Homo arch and the Lithostrotos pavement over the Struthion pool are **Hadrianic, 2nd century**;
- the Via Dolorosa route is medieval to modern;
- there was no Third Wall in 30 CE;
- today's Old City walls are Ottoman (1530s).

[Madain Project, Ecce Homo arch, https://madainproject.com/ecce_homo_arch; Jewish Virtual Library, "The Northern Gate
of Aelia Capitolina"]

**[WS / CT] The walls.**
- **[WS] The First Wall** ran around the Upper City and Lower City. Its line is largely known from excavation.
- **[CT] The Second Wall's line** is the open question (section 2.1).

[IAA "Jerusalem walls", https://antiquities.org.il/jerusalemwalls/hstry_05_eng.asp; H. Geva (ed.), *Jewish Quarter
Excavations*, vols. (IES) for the Upper City (**verify** which volume for the wall)]

**[WS] The Pool of Siloam.** The Second Temple pool was found in 2004 by R. Reich and E. Shukron. It has three
flights of five steps with landings, and one exposed side about 225 ft (69 m) long. It was probably trapezoidal,
roughly 50–60 m. [Madain Project, https://madainproject.com/pool_of_siloam; Ferrell Jenkins summary (**verify** in
Reich & Shukron's publications)]
- **Visibility:** seen from the Mount of Olives at the far south end of the city. Low detail.

**[WS] The Upper City.** This was the wealthy priestly quarter on the western hill. N. Avigad's excavations found
mansions (the "Palatial Mansion", the "Burnt House"). [N. Avigad, *Discovering Jerusalem* (1983) (**verify** edition)]
- **[CJ] Its skyline:** a dense grid of flat-roofed stone houses climbing west to Herod's palace.

**[CJ] Colour palette.**
- **Stone:** pale *meleke* and *mizzi* limestone, cream to honey.
- **Temple:** white with gilded parts (**TEXT**: Josephus).
- **Roofs:** packed earth or plaster, flat.
- **Tombs:** possibly whitewashed. **TEXT:** Matthew 23:27 speaks of "whitewashed tombs"; the custom of marking tombs
  white before Passover is in rabbinic texts (**verify** source before use).

---

## 6. Sensitivity rules

1. **No depiction of Jesus or of anyone crucified.** No figures on the crosses or near them, no blood, no instruments
   of torture, no body on the tomb bench (an empty bench with folded linen only if Carter approves; **TEXT** John
   20:6–7). No crowds at Gethsemane. The museum's "no figures" approach (as for the Kaaba courtyard) applies. Show
   places, not people.
2. **The Church of the Holy Sepulchre is shared** by six communities under the Ottoman "Status Quo" of 1852–53: the
   Greek Orthodox, Roman Catholic (Latin, through the Franciscan Custody), Armenian Apostolic, Coptic, Ethiopian and
   Syriac Orthodox churches. The first three hold possession rights.
   [Status Quo summaries, e.g. https://christianitytoday.com/2008/08/divvying-up-most-sacred-place]
   - Use neutral wording: "the site venerated as Golgotha and the tomb of Jesus".
   - Don't favour one community's chapels or names.
   - Our site models the **1st-century quarry**, not the church interior. That sidesteps most of the Status Quo issue.
   - A modern "today" overlay, if any, would be exterior only, under (C).
3. **The Garden Tomb** is a place of prayer for many Protestants. Present Barkay's dating respectfully, beside the
   19th-century identification, never mocking it.
4. **The Mount of Olives Jewish cemetery today** is the largest and most sacred Jewish cemetery. It has tens of
   thousands of graves (estimates run from about 70,000 to 150,000), and Jews have buried there since antiquity.
   [Wikipedia, "Mount of Olives Jewish Cemetery"; Jewish Virtual Library, "The Mount of Olives"]
   - Our model is **c. 30 CE**, so the modern cemetery is not shown, and no graves are walkable.
   - Any "today" note: "The slope is now covered by the Jewish cemetery, still in use; it is a place of great sanctity."
4b. **Tombs in 30 CE.** We show 1st-century tomb façades (Dominus Flevit, Benei Hezir and others) as exteriors. No
   ossuaries are opened and no human remains are shown, and Yehohanan's bones are not modelled. Kloner and Zissu's data
   are used only for architecture.
5. **Modern politics.** Name places without political modifiers. Use "East Jerusalem" only if a modern location note is
   needed, with no comment on sovereignty. Mention the Temple Mount / Haram al-Sharif by both names if the modern
   platform is ever referenced. The Dome of the Rock and al-Aqsa are not part of a 30 CE model, so leave them out
   entirely; a label can say "the platform is today the Haram al-Sharif / Temple Mount".
6. **The Gospel passion narratives and Jews.** Label wording must avoid collective blame. Keep labels to place,
   architecture and the evidence. Recommend a one-line methodology note pointing to the archive's chapter on early
   Christianity and Second Temple Judaism.
7. **The empty tomb.** Its resurrection meaning is a faith claim. Labels say "Christians believe…" and "the Gospels
   say…", per CLAUDE.md, and never "proved".

---

## 7. Published plans and data, as REFERENCES ONLY

The ground rule stands: never copy another party's 3D model, photograph, drawing or reconstruction image. Take
dimensions from these works, cite them in the site's `dims.js`, and draw our own. All are in copyright unless noted.

| Use | Reference | Status |
|---|---|---|
| Edicule and tomb remnant: plan, sections, the bench | M. Biddle, *The Tomb of Christ* (Sutton, 1999), from the 1986–93 photogrammetric survey | Book; check its figures for dimensions |
| 2016–17 survey of the Edicule (NTUA laser scans, geo-radar) | A. Moropoulou et al., NTUA project publications (e.g. *Holy Aedicule* conference volumes; papers in *Applied Sciences* and *Sustainability*, 2017–19, **verify** exact titles) | Measurements only |
| The quarry under the church, the Calvary rock, early phases | S. Gibson and J. E. Taylor, *Beneath the Church of the Holy Sepulchre* (PEF, 1994); V. C. Corbo, *Il Santo Sepolcro di Gerusalemme*, 3 vols. (Jerusalem: Franciscan Printing Press, 1981–82) | Plans and sections |
| The execution site versus the tomb | J. E. Taylor, *NTS* 44 (1998) 180–203 | Argument and topography |
| 2022– excavations under the church floor | F. R. Stasolla (Sapienza): preliminary reports; final publication awaited | Watch for the final report |
| Redeemer and Muristan quarry depths | German Protestant Institute (D. Vieweger, "Durch die Zeiten" archaeological park); K. Kenyon, *Digging Up Jerusalem* (1974) | Depths and levels |
| Typical tomb forms, blocking stones | A. Kloner and B. Zissu, *The Necropolis of Jerusalem in the Second Temple Period* (Peeters, 2007); A. Kloner, *BAR* 25:5 (1999) | Typology and dimensions |
| Garden Tomb | G. Barkay, *BAR* 12:2 (1986) | Dating and plan |
| Temple Mount, Temple, gates, Royal Stoa | L. Ritmeyer, *The Quest* (Carta, 2006); ritmeyer.com (his drawings are copyright: reference only); Josephus, *War* 5.184–247 and *Antiquities* 15.380–425 (public-domain Whiston translation); Mishnah *Middot* | The primary texts are free to quote |
| Southern and western walls, Robinson's Arch | B. Mazar's excavations (1968–77); R. Reich and E. Shukron (1994–96, 2011) | Levels and coin dating |
| Pilgrimage Road | N. Szanton et al., *Tel Aviv* 46 (2019) | Width, length, date |
| Pool of Siloam | R. Reich and E. Shukron, reports from 2004 on | Steps, size |
| Herod's palace and towers | Josephus, *War* 5.156–183; the Citadel (Tower of David) museum excavation reports (R. Amiran, A. Eitan, and later work); Kishle (A. Re'em) | Towers' base sizes |
| The Mount of Olives necropolis | B. Bagatti and J. T. Milik, *Gli scavi del Dominus Flevit* (1958); Jewish Virtual Library summary | Tomb façades |
| Gethsemane | V. Corbo (1965); A. Re'em (IAA 2020); M. Bernabei (*JAS*, 2015) on the trees | The oil-press cave, the mikveh |
| Roads | J. Wilkinson, *Biblical Archaeologist* 38 (1975) | Route |
| Terrain | Copernicus DEM GLO-30 (free; attribution required) or SRTM (public domain); OpenStreetMap (ODbL) for modern positions only | Must be corrected to the 1st-century surface |
| Sun and moon | Our own PyEphem calculation (section 1.2); can be re-run in `tools/` | Reproducible |

Rough modern positions, from OpenStreetMap (**verify**):
- the Holy Sepulchre Edicule: about 31.7785 N, 35.2296 E;
- the Garden Tomb: about 31.7839 N, 35.2299 E;
- Gethsemane (Church of All Nations): about 31.7794 N, 35.2398 E;
- the Dome of the Rock: about 31.7780 N, 35.2354 E.

The Edicule is roughly 550 m west of the Dome of the Rock. Gethsemane is roughly 420 m east of it, across the Kidron.

---

## 8. Proposed site shape (for the owner's decision; not built)

### Site 1: "Golgotha and the Tomb, c. 30 CE"

**Label:** (R) and (C).

**Sections:**
1. **Arrival:** the road outside the Gennath Gate, with the Second Wall and Herod's three towers to the south (R).
2. **The quarry knoll** with three empty crosses (C: the exact spot is debated).
3. **Garden plots** of olive and vine on the quarry fill. This is the newest evidence and still preliminary.
4. **The rock-cut tomb:** forecourt, blocking stone moved aside, a low entrance, a chamber with a bench and unfinished
   kokhim. It is walkable. The bench is empty.
5. **Neighbouring 1st-century tombs** (the "Joseph of Arimathea" type).
6. **An exit vestibule** with a panel: "Today: the Church of the Holy Sepulchre, shared by six churches", plus the
   Garden Tomb comparison and the 2016 NTUA findings.

### Site 2: "The Mount of Olives, c. 30 CE"

**Label:** (R).

**Sections:**
1. **The Bethany–Jerusalem road over the crest** (arrival).
2. **The western overlook:** the city panorama, with the gilded Temple façade at sunrise or moonlit at night, the
   Royal Stoa, the Antonia, the walls, the Upper City, and Herod's towers on the far skyline.
3. **The slope necropolis:** tomb façades; the Kidron monuments below.
4. **The Gethsemane terraces:** olive groves, the oil-press cave (walkable), the mikveh.
5. **Kidron Valley floor:** the way across to the city.

**Time options:**
- **Day:** Passover spring sun.
- **Night:** the full Passover moon, about 55° up in the south at midnight. This fits either candidate year.

---

## 9. Owner decisions needed

1. **Approval in principle** for two new sites (new content, religious-sensitivity rules).
2. **The time frame.** Framing as "Passover, c. 30–33 CE", with no single date asserted (recommended), or picking 30
   or 33.
3. **Placing the crosses.** On the traditional Calvary rock, or in a neutral quarry-and-road position with Taylor's
   alternative shown (recommended).
4. **The blocking stone.** Square, the commoner form (recommended), or a round rolling stone, both with labels.
5. **The Garden Tomb.** A labelled comparison panel only (recommended), or its own (C) site later.
6. **The "darkness" toggle.** Offer an optional dimmed-sky view labelled as the Gospel account, or none.
7. **Anything at all on the tomb bench** (e.g. folded linen, **TEXT** John 20:6–7), or leave it empty (recommended).
8. **The Mount of Olives wording** explaining that the crucifixion was elsewhere (draft in section 4.3).
9. **Unfinished building works.** Show Robinson's Arch and the Pilgrimage Road as possibly unfinished, as the evidence
   suggests, or as complete, as most popular reconstructions do.
