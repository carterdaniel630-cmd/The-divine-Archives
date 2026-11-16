# Source log — the VR pilot's creatures (ch02 Egypt, ch03 Mesopotamia)

Change: `docs/museum/world.js` (ENV ch02 and ch03; the `marsh` ground), `docs/museum/fauna.js` (the bunni, the pied
kingfisher, plain-tiger colours on the Nile, birds and insects over the raised ground keeping their distance),
`docs/museum/app.js` (test hook reports flyers apart from fish), `tools/react-check.js`. Built 2026-11-16 by the VR
loop on `loop/vr-creatures`, from Carter's ruling "More creatures … true to each room's place and era"
(`handoff/decisions-2026-11-16-carter-ground-at-your-feet.md`). Merge is per item (new build).

## Standard used
The museum's creatures are atmosphere, not natural-history exhibits (`fauna.js` header). The bar for this piece:
each species added to a pilot room lives in that place today **and** is native there (so it was there in the Bronze
Age), or is shown in that culture's own art. A native-range source supports "it was there" by inference; that is
said below where it is the only support. Shapes and colours are code renderings: where a colour is not taken from a
source it is called generic. No creature here is shown in a cult or sacred role; all are living wildlife only.

## Changed: ch03's fish (accuracy fix)
- **Tilapia removed from ch03.** Tilapias are not native to Mesopotamia; Iraqi records of them in the wild are
  recent introductions. Opened 2026-11-16: Analysis of morphometric and meristic characteristics of three cichlid
  species in central Iraq: farmed and wild, *Oceanological and Hydrobiological Studies* (article page,
  https://czasopisma.bg.ug.edu.pl/index.php/oandhs/article/view/13500). Its reference list gives the first records:
  Saleh 2007 (*Tilapia zillii*, Tigris); Mutlak & Al-Faisal 2009, "A new record of two **exotic** cichlids fish
  *Oreochromis aureus* … and *Tilapia zillii* …", *Mesopotamian Journal of Marine Science* 24(2): 160–170;
  Al-Faisal & Mutlak 2015 (*O. niloticus*, first record, Shatt al-Arab), *International Journal of Marine Science* 5,
  doi:10.5376/ijms.2015.05.0038. The three primary papers were **not opened** (seen only as citations).
  ch02's tilapia stays: the Nile tilapia is native to the Nile (not re-sourced in this run; it predates this piece).
- **Bunni, *Mesopotamichthys sharpeyi*, added to ch03.** FishBase species summary, https://fishbase.se/summary/54811
  — **opened 2026-11-16**: "Asia: endemic to the Tigris-Euphrates basin"; freshwater, benthopelagic; max 42.7 cm TL;
  main reference Coad, B.W. 1996, "Zoogeography of the fishes of the Tigris-Euphrates basin", *Zoology in the Middle
  East* 13: 51–70 (not opened). Marsh habitat: "Reproductive Biology of the Bunni *Mesopotamichthys sharpeyi* …
  from Southern Missan Province Marshes, Southern Iraq", *Egyptian Journal of Aquatic Biology and Fisheries*,
  https://ejabf.journals.ekb.eg/article_241691.html — opened 2026-11-16 (page lists the study area as the southern
  Missan marshes; authors and volume not shown on the page). Bronze-Age presence is inferred from its being endemic.
  Coad & Hales, FEOW ecoregion 441 "Lower Tigris & Euphrates", https://feow.org/ecoregions/details/441 — opened
  2026-11-16: the fauna is dominated by barbels, some "keystone species in the marshes and rivers" and long a food of
  the people there. The bunni's look in the museum is a **generic cyprinid** (olive back, silvery flanks).
- **The marsh ground** gains a shallow open channel through the reeds (≤ 0.30 m deep at your feet) so its fish have
  water to swim in. This is scene-building, not a sourced landform.

## Added: the pied kingfisher, *Ceryle rudis* (ch02 and ch03)
- Range: Kuwait Birds, species page, https://kuwaitbirds.org/node/639 — **opened 2026-11-16**: the range runs "to
  north Egypt, central and southern Turkey, Israel, Syria, Iraq, and Southwest Iran". Wikipedia "Pied kingfisher"
  (https://en.wikipedia.org/wiki/Pied_kingfisher) and BirdLife's factsheet seen in search results only (pointer).
- In Egypt's own art: Stimpson, C.M. et al. 2022, "Pigeons and papyrus at Amarna: the birds of the Green Room
  revisited", *Antiquity* (Cambridge, https://www.cambridge.org/core/product/A4C4E5C0EDEF5B8C57FE1556BD75F798) —
  the North Palace's Green Room paintings (Amarna, 14th century BCE) show pied kingfishers among the species
  identified. Confirmed through Gizmodo's report of the paper, 2022-12-23 (opened 2026-11-16,
  https://gizmodo.com/ancient-egyptian-murals-show-lifelike-doves-kingfisher-1849923985); **the paper itself was not
  opened** — reviewer to re-read.
- For ch03 the support is its native range in Iraq (inference to the Bronze Age, as above).
- Colours: black and white, from the species; the barring is not drawn (generic pied).

## Added: butterflies on the Nile (ch02) — the plain tiger, *Danaus chrysippus*
- Torben B. Larsen, "Butterflies of Egypt", *Saudi Aramco World* 45(5), Sept/Oct 1994, pp. 24–27,
  https://archive.aramcoworld.com/issue/199405/butterflies.of.egypt.htm — **opened 2026-11-16**: the Theban artist of
  Nebamun's tomb (c. 3,500 years ago) painted seven Common (plain) Tigers in the fowling scene, "the earliest
  recognizable painting of a butterfly". ch02's butterflies are coloured the plain tiger's tawny orange only; its
  black and white wingtips are not drawn.

## Added: dragonflies over the marsh (ch03)
- Al-Saffar, H.H. & Augul, R.S. 2021, "Survey of insects in some southern Iraqi marshes", *Bulletin of the Iraq
  Natural History Museum* 16(4): 571–621, doi:10.26842/binhm.7.2021.16.4.0571 — abstract **opened 2026-11-16**
  (https://jnhm.uobaghdad.edu.iq/index.php/BINHM/article/view/627): 109 insect species, "Odonata with 29 species".
  The species shown is not identified; the dragonfly's look is the museum's **generic** one (`fauna.js`).
  Bronze-Age presence of the order is inference.

## Not added in this piece (next candidates, each still needs its source)
Marsh frog and Euphrates softshell turtle (ch03), Nile frogs and turtles (ch02): the museum's frogs and turtles do not
yet keep their distance from the visitor (Comfort §e.22), and turtles need deeper water than the pilot's beds.
