# VR Pilot Spec — The Divine Archives VR Museum
**Presence Designer + Lorekeeper · 2026-10-12 · Spec only — Claude Code implements.**
**AMENDED 2026-11-01 — council amendment pass (Carter-approved, one pass). Every change
is recorded in `../files/vr-pilot-amendment-log-2026-11-01.md`; amended passages carry
their log reference (AM-…). Where any older sentence survives in a companion doc and
conflicts with this spec's amended text, this spec and the Warden's numbers govern.**

Source data (read-only, `ref: main`, repo `carterdaniel630-cmd/the-divine-archives`):
`docs/museum/manifest.json`, `docs/museum/wings/rotunda.json`,
`docs/museum/wings/02-bronze-age.json` (full); `04-axial-age.json`,
`01-prehistory.json` (manifest-level survey). Companion docs:
`~/workspace/your_files/claude-integration/museum-wing-design.md`,
`~/workspace/build-standards/artistry-standard.md`.

---

## 1. THE PICK

**Pilot = the Rotunda entry atrium + Wing II · The Bronze Age, rooms ch02 Egypt and ch03 Mesopotamia.**
Four spaces (the Wing II atrium is scoped as its own space, §2). Nothing else is built; everything else is specified as contract.

### Reasoning across the four axes

**Content richness.** Egypt (ch02): 4 vault relics — the Pyramid Texts of
Unas (v34), the Papyrus of Ani (v20), the Merneptah Stele (v43), the Rosetta
Stone (v53) — and 9 deity figs (Ra, Osiris, Isis, Horus, Anubis, Thoth,
Ma'at, Hathor, Set). Mesopotamia (ch03): the Ishtar Gate (v52) and the Cyrus
Cylinder (v35), 8 figs (Inanna/Ishtar, Enki/Ea, Marduk, Tiamat, Gilgamesh,
Shamash/Utu, Ereshkigal, Pazuzu). Both rooms carry plate art with original
renderings and plate captions. This is the densest object-per-room cluster
outside the Axial Age, and unlike the Axial Age it is *spatially* dense —
tombs, courts, gates, stelae are architecture, not just vitrines.

**Representativeness.** The pilot must exercise portals, relics, plaques, and
verticality — and it does, in both directions:
- *Portals:* the Rotunda proves the hub-spoke portal grammar (9 wing
  portals, 1 live); the Wing II atrium proves wing-to-room portals; each
  room proves its threshold (pylon, gate).
- *Relics:* prop types exercised — `slab` (stelae, Rosetta), `codex`
  (Papyrus of Ani), architectural-scale prop (Ishtar Gate — the only
  building-scale vault item in the pilot set, proving large-prop handling).
- *Plaques:* room summaries, plate captions, vault labels (title / dated /
  held / summary) — the full label stack.
- *Verticality:* Egypt descends (tomb axis into the burial chamber);
  Mesopotamia ascends (staged ziggurat climb). No other candidate pair
  proves up *and* down. Vertical locomotion is the highest-risk VR
  mechanic; the pilot retires that risk first.
- *Figs:* 17 fig plinths populate the plinth data system (name / epithet /
  desc / contested) at pilot scale. What this proves is the *data system*;
  the fig *form* is settled in §2/§4.6 (honest emblem-relief by default) and
  no claim about all 199 Pantheon figures is made until one figure in its
  final form has held at arm's reach on the floor device (§5, criterion 15).
  *(AM-PIL-03 — SKP-3, ART-1.)*

**Wow factor.** Highest in the museum, and earned by the content rather
than invented: a torch-lit hypostyle hall giving way to a burial chamber
under a ceiling of stars (the Pyramid Texts' star ceiling is *in the
vault data*), then a dusk ascent past glazed-brick reliefs to a summit
shrine. A visitor's first sixty seconds must feel like stepping inside
the archive — this is the only cluster that delivers that on arrival.

**Risk.** Two risks, both managed, both specified below:
1. *ch02 Egypt is `pending: true`* ("recently added · pending review" per
   `app.js` lines 1038/1075). Under Carter's ruling (2026-10-31) a
   pending-review room is a first draft approved — it stands live BY DESIGN
   under constant review; pending is a standing state, not a defect and not
   a warning-off. The pilot therefore **embodies the pending room under
   plaque**: the threshold plaque (§4) carries that meaning in the house
   voice, and every element derived from the pending chapter text carries
   the AWAITING REVIEW marker on or beside it (§4.1 schedule) — embodiment
   never upgrades a claim, and pending-derived material never carries the
   blue attested marker. *(AM-PIL-02 — SRC-1, LOR-1, PA-1.)*
2. *The generic-Egypt trap.* This is the most clichéd VR subject on
   earth. Mitigation is the Lorekeeper's hardest job in this spec: every
   surface traces to a wing-JSON id; no invented hieroglyphs (Artistry
   Standard clause 2 — true signs from primary texts or nothing);
   the room's own honest-evidence voice ("what the archaeology will and
   won't support" is already the site's register).

### Runners-up and why they lost

- **Wing IV · Axial Age (ch10 Second Temple Judaism + ch15 Classical
  Greece).** The richest *cleared* content in the museum (ch10: 10 vault
  items including the Dead Sea Scrolls, Great Isaiah Scroll, Copper
  Scroll; ch15: 13+ figs). Loses on three counts: wow factor (a study
  room and a stoa cannot open a VR program), verticality (no natural
  up/down axis — the pilot would leave vertical locomotion unproven), and
  living-room priority (only the late, scholarship-sensitive exhibits dock
  here; Wing II hosts the Royal Game of Ur, which pilots the *entire*
  living-room class — §7). Reserve as wave 2; its aniconic sacred-space
  constraint (a Second Temple room must hold presence through absence,
  not statuary) is a superb second-wave design problem.
- **The Rotunda alone.** The true entry and the perfect portal exercise,
  but it cannot stand alone: no verticality, thin relics (its vault is
  three *seeVault* codices homed to ch29), and 3 of its 7 theme rooms are
  pending review. It is *part* of the pilot (as the atrium) but not the
  pilot.
- **Wing I · Prehistory (ch41 Paleolithic + ch42 Neolithic).** All
  cleared; cave-painting chiaroscuro is the Artistry Standard's dream
  subject. Loses on representativeness: figs = 0, no living rooms dock
  here, weakest portal/relic exercise. Beautiful second wave, wrong
  first proof.

### Deliberately deferred: the theme-room archetype

The 7 Rotunda theme rooms (ch01, ch46–ch51) use the same component
system as tradition rooms (plaques, plates, relic vitrines, fig plinths)
with multi-tradition content. The pilot proves the component system in
tradition rooms; the theme-room *composition rule* (comparative layout:
parallel traditions, no flattening, shared motifs grouped honestly) is
specified in §2 as a layout variant and validated by Craft Council lens
review of this spec — not by building ch01 now. Rationale: scope
discipline on phone-class budgets; the variant adds no new mechanics.

---

## 2. EXACT SCOPE

Four spaces. Room ids and content cite the wing JSONs verbatim. (The Wing II
atrium is a real fourth space — it holds the room portals, the return portal,
and the threshold steles; it carries its own content and render allowance in
the performance budget. Earlier drafts ran transit through it without scoping
it; that gap is closed here. *(AM-PIL-04 — CON-C1, SKP-5, MEC-6, FT-4.)*)

### Space 0 — The Rotunda (entry atrium, onboarding)

*Source: `rotunda.json` (7 theme rooms), `manifest.json` wings map.*
- A domed atrium, 12 m dome with oculus. Nine wing portals in a ring —
  **only the Wing II portal is live**; the other eight are veiled in dark
  stone with a small house-voice plaque each: *"This wing is still being
  built. What stands open is Wing II, the Bronze Age — its portal glows
  amber in this Rotunda. — The Divine Archives."* (The plaque tells a
  turned-away visitor where the open door is; it never claims the veiled
  wing is finished. *(AM-PIL-05 — WRD-8.)*)
- **The centre is one object.** The orientation lectern stands at the
  centre rose under the oculus shaft — the Rotunda's single focal object.
  The directory lectern stands at the ring's edge beside the Wing II
  portal, ambient, consulted when wanted; it is not a second centre.
  *(AM-PIL-05 — AD-4, PER-5.)*
- **Start Here — the arrival sequence (the pilot's first sixty seconds).**
  Nothing is gated and nothing is locked; the sequence is composed, in
  this order, and the Wing II portal stands open from the first frame —
  the live portal framing its amber glimpse is the first-seconds hook:
  ① *Look around* — spawn at the centre rose; the oculus shaft and the
  amber portal are the only focal pull. ② *Step to the brass ring* — a
  practice teleport target inside the Rotunda, nothing at stake: raise a
  hand, hold the trigger, land on the ring; the movement verbs are taught
  by doing, here, before they matter. ③ *Touch the practice plaque* —
  near-field poke teaches select; the plaque carries all five evidence
  markers on marked examples, so the grammar (§4) is learned on an
  object in view, not in the abstract. ④ *Read the orientation* at the
  centre lectern (§4 wording verbatim) and acknowledge it — **by
  controller press or near-field poke on the lectern's seal, never by
  gaze-dwell** (gaze-dwell remains the accessibility opt-in only). The
  acknowledgement is a beat inside the sequence, not a lock: a visitor
  who walks past it can still transit, and the orientation stays
  re-readable at the lectern and in every room (§4.3 of the interaction
  spec's stele "Here" page). ⑤ *The Wing II portal* — already open;
  directory and settings are presented only after ⑤, never
  before. Before first entry the comfort choices are surfaced here, at
  spawn height, not hunted for later: the seated prompt, the caption
  option, and the dominant-hand choice (Comfort §f.25 first-session
  defaults are maximum comfort and need no prompt to be safe).
  *(AM-PIL-05 — PER-1, PER-5, FT-1, FT-5, DSG-3, CON-A15.)*
- **Orientation ritual:** the central lectern delivers the pilot's
  honest-evidence orientation (§4) as step ④ of the arrival sequence.
  This is the pipeline's orientation component — every future room
  reuses it. It is presented, never imposed: the portal is never locked.
- A directory lectern: wing list from `manifest.json` eras (I–IX +
  Rotunda), pilot rooms marked "open," all else marked "building." The
  list carries the house's honesty line about its own completeness:
  some spaces are unlisted, one is withheld — the Keeper's Study, named
  here as withheld — and one is hidden; **no VR surface claims "every
  room."** The lectern also carries the date furniture, glossed at first
  use: *BCE counts the years before year one; "c." (circa) means
  "about."* *(AM-PIL-05 — PA-3, WRD-7.)*
- **The Keeper's Table ground is reserved.** The Rotunda plan leaves the
  Table its seat — a clear floor position on the plan, marked as
  reserved, with nothing built on it and no pilot geometry foreclosing
  it. Whether the Table itself is in pilot scope is Carter's open
  question (OQ-1); this spec reserves the ground and no more.
  *(AM-PIL-05 — PA-2.)*
- Interactions: portal transit (Wing II), orientation acknowledge,
  directory browse. No relics here in the pilot — the Rotunda's codices
  (v31 Dresden, v32 Popol Vuh, v41 Borgia) are *seeVault* items homed to
  ch29; they are not embodied out of context. Lorekeeper rule: **never
  embody a relic outside its home room.**

### Space 0.5 — The Wing II Atrium (threshold space)

*Source: `02-bronze-age.json` wing frame.*
- A threshold hall inside Wing II holding: the ch02 portal (pylon
  threshold), the ch03 portal (court threshold), the return portal to
  the Rotunda, and both rooms' threshold steles (§4.3 pattern — the
  steles stand here and at each room's entrance). First-room order is
  stated on the atrium's own stele: *"Two rooms stand open. Egypt
  descends; Mesopotamia climbs. Either may be entered first."*
- The atrium is a scoped space with its own line in the per-room budget
  (performance budget §5/§7): its portals' sightlines into both rooms
  are part of the worst-view test set. Exiting either room returns here
  — never to a menu; the visitor stays inside the tradition's world.
  *(AM-PIL-04 — CON-C1.)*

### Space 1 — ch02 Egypt (Wing II · The Bronze Age)

*Source: `02-bronze-age.json` rooms.ch02. `pending: true` — see §4.*
- **Composition — the tomb axis (procession → compression → reveal):**
  1. *Pylon court* (open sky): Merneptah Stele (v43, `slab`) and Rosetta
     Stone (v53, `slab`) flanking the entry axis; room summary plaque at
     the threshold (Ma'at, the weighing of the heart, the Osiris myth,
     the Amarna experiment — the summary's own four beats become four
     wall plaques). Every summary plaque is pending-derived chapter text
     and carries the AWAITING REVIEW marker on its face (§4.1 schedule).
  2. *Hypostyle hall* (8 m columns, amber torchlight): the 9 deity figs
     in processional order — Ra, Osiris, Isis, Horus, Anubis, Thoth,
     Ma'at, Hathor, Set — each as an **honest emblem-relief**: the fig's
     SVG art worked as a carved/medallion relief on its plinth, labelled
     on the plinth as an emblem, not a likeness, with name, epithet, and
     the fig `desc` verbatim, and the AWAITING REVIEW marker (the descs
     are pending chapter text). Nothing more. No invented attributes.
     A fig may graduate to a true-source sculpt only where a true source
     exists with its own tri/texture budget (§4.6). *(AM-PIL-06 —
     ART-1, LOR-5.)*
  3. *Descending corridor* (the verticality proof downward): narrow,
     the Pyramid Texts' "meant for no living reader" line carved at the
     descent head — pending-derived chapter text, AWAITING REVIEW
     marker beside it, its translation named (§4.1 schedule).
  4. *Burial chamber of Unas* (4 × 6 m, 2.6 m ceiling — deliberate
     compression after monumentality): blue-painted spell columns
     (v34 — a *rendition*, labeled as such, §4) under an emissive star
     ceiling; the Papyrus of Ani (v20) in a vitrine as an unrolled
     scroll, opened to the weighing-of-the-heart vignette — the
     vignette shown as a **true-source image** of the papyrus (British
     Museum EA 10470), budgeted as the room's one raster asset; if no
     licensable true-source image is in hand at build time, the scroll
     opens to a text column instead — a figural vignette is never drawn
     procedurally. *(AM-PIL-06 — ART-5.)*
- *Plate:* the room's SVG plate (ankh beneath the solar disk;
  plateCaption: "An original rendering of the symbols, not a copy of a
  particular relief") rendered as a wall relief at the court — the
  caption's honesty is the point; the relief carries the ORIGINAL
  RENDERING marker (§4 grammar); it is signed as original
  interpretation, not artifact.
- **Pre-build inventory (nothing silently destroyed):** the walked flat
  ch02 already contains a Weighing of the Heart scene (unlisted in the
  Directory) and the Arcade's golden arch — the Arcade's one intended
  door, with Wing II's hint *"Some signs on these walls are not like
  the others."* Both are marked **kept** in the rebuild plan: the
  Weighing scene is inventoried against the §4.1 schedule (its text
  names its translation, §4.5), and the golden arch is never walled
  over, duplicated, or moved without a stated disposition in the build
  log. *(AM-PIL-06 — SKP-5.)*
- **Living-room sockets (empty, marked):** two alcoves — `mehen` and
  `senet` — with floor inlay and a veiled plaque each:
  *"A game of the Egyptians will be playable here. The rules are still
  being weighed. — The Divine Archives."* (§7 contract. House-voice
  plaques carry the house sign-off — cleanup 2026-11-01.)
- Interactions: portal in/out, relic inspect (4 vault labels), fig
  plinth readings (9), plate relief view, orientation re-read,
  socket preview.

### Space 2 — ch03 Mesopotamia (Wing II · The Bronze Age)

*Source: `02-bronze-age.json` rooms.ch03. `pending: false` — fully cleared.*
- **Composition — the staged ascent (court → gate → summit):**
  1. *Ground court:* the Cyrus Cylinder (v35, `slab`) in a vitrine with
     its era plaque (§4.3 — dated from the vault data, its post-Bronze-Age
     placement in this room stated on the plaque); Enuma Elish / Marduk's
     ordering of chaos as the summary plaque sequence (temple-and-ziggurat
     cult, divination, Hammurabi's law-stele, the grim underworld — the
     summary's beats), each cold term glossed at first use (§4.2 gloss
     layer).
  2. *The Ishtar Gate (v52) as the threshold portal:* architectural-scale
     prop, glazed-brick blue with aurochs/dragon relief courses —
     **a partial evocation, labeled as such** (§4: the real gate is
     reconstructed in the Pergamonmuseum, Berlin; this is not that).
     The gate carries two distinct verbs: a **marked inspect position**
     (stand here to read it as a relic — plaque, relief courses, era
     plaque) and a **distinct pass-through threshold** (walk or
     teleport-target the opening to transit). Passing through it is the
     room's transit ritual. The master's aurochs and dragon are built as
     hero surfaces — instanced tiles with per-tile glaze/tone variation
     and real brick joints; no relief course tiles visibly.
     *(AM-PIL-07 — DSG-1, ART-5.)*
  3. *Staged ascent* (the verticality proof upward): three ziggurat
     stages, ~9 m total, 2.2 m ramp — the climb is the exhibit. Ascent
     is by **staged teleport landings** (one named landing per stage —
     **the landings, named, with arrival facing (cleanup 2026-11-01):
     Stage One Landing, arriving facing the second stage's ramp;
     Stage Two Landing, arriving facing the third stage's ramp;
     Summit Landing, arriving facing the summit shrine with the court
     behind**; staged pads enforce the procession — the summit landing unlocks
     only after the stage landings, in order) and by ramp traversal for
     smooth-locomotion visitors; arrival facing is specified per
     landing; the summit's edge is treated with a diegetic parapet and
     set-back landings — there is no fall, per the Comfort ban list.
     Seated visitors take the same landings: teleport arrival at the
     summit is full arrival, not a lesser one. *(AM-PIL-07 — CON-C8,
     PER-4, DSG-4, HUM-3.)*
  4. *Summit shrine* (brazier-lit): figs as honest emblem-reliefs (the
     §4.6 form) — Inanna/Ishtar, Marduk, Enki/Ea, Shamash/Utu,
     Ereshkigal, Gilgamesh, Tiamat, Pazuzu — epithets and descs
     verbatim, emblem status stated on each plinth.
- *Plate:* the room's SVG plate rendered as a relief in the ground
  court, captioned with its plate caption and carrying the ORIGINAL
  RENDERING marker — designed here because §5 criterion 3 audits both
  plates; a plate required by acceptance is designed in scope, never
  implied. *(AM-PIL-07 — SKP-7.)*
- **Living-room socket (mounted in the pilot):** one alcove — `ur` —
  the Royal Game of Ur docks here, since Ur pilots the living-room
  class repo-side. In this pilot the socket is **not left empty**: the
  Royal Game of Ur is mounted end-to-end through the §7 contract
  (mount → play → exit → clean destroy) as the contract's first proof.
  Its veiled plaque is replaced by the exhibit's own orientation at
  mount, per §7.6. **The Ur socket's own words (cleanup 2026-11-01 —
  the Egypt sockets' copy cannot be reused for a Mesopotamian game):**
  before mount, its veiled plaque reads *"A game of Ur will be
  playable here — the oldest board whose rules can still be read. —
  The Divine Archives."*; at mount, the exhibit's orientation (§7.3)
  opens with what the game is, which of its rules are attested and
  which reconstructed, in the §4 grammar. *(AM-PIL-07 — SKP-3, DSG-6.)*
- Interactions: portal in/out, relic inspect (2), fig plinth readings
  (8), ascent (locomotion proof), socket preview.
- *Era-label caution (§4):* the Ishtar Gate (c. 575 BCE, Neo-Babylonian)
  postdates the Bronze Age; its plaque dates it honestly from the vault
  data. The wing's era label must never misdate an object.

### Theme-room composition variant (specified, unbuilt)

When theme rooms are built: comparative parallel bays (one per
tradition), shared-motif groupings only where the chapter text groups
them, no syncretic blending, every claim plaque citing its tradition.
This variant is **specified, unvalidated** — it enters no "proven"
claim until one comparative bay exists as a testable artefact.
*(AM-PIL-08 — SKP-3.)*

---

## 3. PRESENCE DESIGN

### Scale decisions (meters, eye height 1.62)

| Element | Measure | Why |
|---|---|---|
| Rotunda dome / oculus | 12 m dome, 3 m oculus | Arrival awe; the oculus shaft is the orientation's spotlight |
| Portal arches | 2.4 m wide × 3.2 m high | Monumental but human; frames the "step through" moment |
| Procession width (courts, ramps) | 2.2–3 m | Two abreast; processional, never corridor-cramped |
| Relic plinth height | 1.1 m | Gaze falls naturally; slabs tilt 12° back for reading |
| Slab surfaces | differentiated per slab | **No two slabs share a generic stone finish (cleanup 2026-11-01):** each slab's material, script texture, colour, and wear are traced to its own source object — the Merneptah Stele, the Rosetta Stone (greywacke), and the Cyrus Cylinder must read as three different stones from three different worlds, never as near-identical beige slabs (the flat museum's runestone failure, which this rule exists to prevent). The Gate's relief courses carry the same rule (§2 hero-surface treatment). |
| Fig plinth height | 1.0 m, emblem-relief medallion centred at ~1.6 m | The emblem meets the eye at the visitor's own height — presence, not worship, not toy. (A 1.0 m plinth under a 1.7 m standing figure puts the face at 2.4–2.7 m, above a 1.62 m eye; the relief form removes the false arithmetic.) *(AM-PIL-09 — AD-3.)* |
| Hypostyle columns | 8 m, 3 m spacing | Forest of stone; torchlight between |
| Burial chamber | 4 × 6 m, 2.6 m ceiling | Compression after monumentality — the reveal lands harder |
| Ziggurat ascent | 3 stages, ~9 m total | A real climb; arrival by any route — ramp, staged landing, seated — is full arrival |
| Veiled (unbuilt) portals | recessed 0.5 m, dark stone | Present but closed — honest about what's missing |

### Spatial composition — sightlines and reveals

- **Rotunda → Wing II:** from the oculus center, the Wing II portal
  glows warm amber; the other eight sit in shadow. The visitor is *drawn*,
  not directed. First sightline of the whole program.
- **Egypt:** the tomb axis is *hidden* on entry — the pylon court shows
  only sky, stelae, and columns. The corridor mouth is discovered at the
  hypostyle's far end (a dark slot, the carved line overhead). Descent,
  then the chamber opens low and star-lit. Sequence: exposure →
  mystery → intimacy. The reveal is the Pyramid Texts' own logic: words
  meant for no living reader, shown only to those who descend.
- **Mesopotamia:** the Ishtar Gate is visible from the court (a blue
  wall of glazed brick) but the summit is hidden behind it. The room
  ships with a **sightline table** — court entry viewpoint, gate-to-
  ascent distance, stage offsets — demonstrating that the gate occludes
  the summit shrine from the entry viewpoint; the gate's height is set
  by that table (building scale), not by a round number. Passing
  through the gate *is* the threshold; the ascent unfolds above.
  Sequence: promise → passage → ascent → arrival. *(AM-PIL-09 — AD-5; "effort" struck by cleanup 2026-11-01 with the "summit earned" framing.)*
- **Between rooms:** exiting Egypt returns to the Wing II atrium
  (never to a menu — per the wing-design doc, the visitor stays inside
  the tradition's world); the atrium holds both room portals and the
  return portal to the Rotunda.

### Atmosphere per room

- **Rotunda:** dawn clarity. Cool stone, one warm shaft from the
  oculus. Quiet. The feeling: *orientation* — "you are somewhere that
  takes this seriously."
- **Egypt — pylon court:** hard noon sun, bleached stone, long shadows.
  Exposure, eternity, indifference. The feeling: *small under the sky.*
- **Egypt — hypostyle:** amber torchlight, smoke-drift particles
  (restrained — a few dozen sprites, baked flicker), columns standing
  in graded shadow — **lifted shadow, never near-dark**: the
  processional axis, every plinth face, and every plaque stay readable
  at the §3 lighting floor below. The feeling: *being led.*
- **Egypt — burial chamber:** the dimmest room, and still floored. **The
  chamber's three foci have a stated light order (cleanup 2026-11-01 —
  in a room this small, equal focus is no focus): first, the spell wall**
  (the one cool shaft; the room's reason to exist); **second, the Ani
  vitrine** (a lower, warmer pool); **third, the emissive star ceiling**
  (ambient glow only, never competing). The emissive star ceiling and one cool shaft on the spell wall hold the
  focal regions above the darkness floor (Comfort §e.23 — no focal
  frame below 2 nits); the chamber's reveal is triggered from the
  corridor mouth, ≥ 3 m out, per Comfort §e.22 — nothing reveals within
  2 m of the visitor. Silence here is this room's own composed choice —
  **no ambient bed** (see the soundscape map below); it is an artistry
  decision about this chamber, not a rule about any room's status, and
  not any Warden's call. The feeling: *solemnity* — "meant for no
  living reader." *(AM-PIL-09 — AD-1, AD-5, PER-6, CON false
  attribution.)*
- **Mesopotamia — court and ascent:** dusk. Low warm sun, long blue
  shadows; the gate's glazed brick catching last light. The feeling:
  *a city at evening* — human, busy once, now quiet.
- **Mesopotamia — summit shrine:** brazier glow, night sky above
  (sky.js), the court below in graded dusk. The feeling: *awe at
  height* — the gods'-eye view the ziggurat was built to borrow.

### Lighting as emotion (Artistry Standard §4 — chiaroscuro)

Chiaroscuro is the pilot's emotional instrument, not decoration. It is a
**ratio, not an absolute level**: every room holds high-contrast drama
*above a lifted-shadow floor* — the visitor must always see the axis
(procession path, ramp, corridor) and read every plaque and face, while
the focal objects pull the eye. "Near-dark," "emerging from dark," and
"in shadow" are not targets anywhere in this program; shadow is graded,
never drowned — graded for the weakest display in the chain (the Quest 2
panel; Carter's Galaxy preview in flat mode), per the Cinematic Floor.
- **Per-zone minimum readable level:** each light zone (Rotunda, court,
  hypostyle, corridor, chamber, Mesopotamia court, ascent, summit)
  carries a stated minimum at which its axis, plaques, and fig faces are
  verified readable — on the Galaxy in flat mode and in-headset —
  before the zone certifies (§5, criterion 7). Comfort §e.23 is the
  floor's instrument: focal point ≥ 3× ambient surround; no focal frame
  below 2 nits.
- Focal spots: the Unas spell wall, the Ani vitrine, the Ishtar Gate
  relief courses, each fig plinth's emblem — lit by a placed face light
  (a plinth uplight alone is not a face light; it is the horror angle).
- All lighting baked/static where possible (phone-class budget);
  the only dynamic lights: torch flicker (cheap noise, capped at low
  contrast and never above 3 Hz — Comfort §d.19), the oculus
  shaft, brazier glow. Particles: drifting dust in light shafts only,
  capped counts — atmosphere, not weather.
- **Three different transitions, never conflated:** the *teleport
  dissolve* (150–250 ms, Comfort §a.1); the *portal/wing transit*
  (a masked swap — ~250 ms fade over ≤ 400 ms of masked work,
  performance budget §5); and the *light-and-bed cross-fade* between
  light-zones, which may ease over 2–3 s as pure atmosphere while the
  visitor stands still or walks — it is never transit time, and the
  visitor is never carried by it. No hard cuts anywhere.
  *(AM-PIL-10 — AD-1, AD-6, CON-A9, PER-3, PER-6.)*

### Movement — the one normative table (Comfort Warden's numbers)

Every locomotion, turn, and reading number in this program resolves to
this table. Where any companion doc's older text differs, this table and
the Comfort Warden's brief govern. *(AM-PIL-10 — CON settlement list 1–3,
Table B, FT-6, PER-3.)*

| Parameter | Settled value | Source |
|---|---|---|
| Default locomotion | Arc teleport; smooth locomotion opt-in only | Comfort §a.1–2 |
| Teleport arc | max range 8 m (all postures); brass-ring landing marker | Comfort §a.1 |
| Teleport fade | 150–250 ms dissolve; NO vignette on teleport | Comfort §a.1, §b.8 |
| Smooth locomotion | behind warning + 2 confirmations; max 2.0 m/s; ramp 0→2.0 m/s over 1.0 s; no run speed | Comfort §a.2, §a.4 |
| Vignette (artificial motion — smooth locomotion and snap turn; never teleport) | strength 40–60% at full effect; onset ≤ 100 ms after motion passes 1.2 m/s; clears over 300–400 ms | Comfort §b.7 (read with §b.8: teleport excluded) |
| Snap turn | 30° (15° alternate setting); completes ≤ 80 ms; cooldown 250 ms | Comfort §a.3; cooldown settled AM-PIL-10 |
| Seated mode | eye height 1.2 m; all content re-anchors; full tour completable seated | Comfort §d.15 |
| Reference space | `local-floor` requested; on unavailability the session proceeds in declared seated mode (fixed 1.2 m) — never a silent substitution | settled AM-ARC-01 |
| Reading | distance 0.8–2.5 m (ideal 1.2–1.8 m); body ≥ 1.3°, titles ≥ 1.8°, captions ≥ 1.0° visual angle; contrast ≥ 7:1 body / ≥ 10:1 captions, worst-lit plaque | Comfort §c.10–12 |
| Portal transit | masked swap ~250 ms fade, masked work ≤ 400 ms; light/bed ease 2–3 s is atmosphere only | Perf §5; Audio §a |
| Vertical travel | staged teleport landings (per ziggurat stage; corridor descent pad at the chamber threshold); ramp traversal for smooth-loco visitors; no falling, ever | Comfort §a.6; §2 above |

### Soundscape per space (Audio Weaver's map, settled)

One bed recipe per space; emitters anchored to objects in that space;
reverb per the audio brief's three generated presets. Caps are the audio
brief's: ≤ 6 positional emitters per room, ≤ 3 HRTF (nearest), ≤ 8
continuous layers, ≤ 40 live nodes, audio ≤ 5% of frame CPU. Same-wing
neighbours swap emitters and reverb only — the shared bed is never torn
down. The audio brief's reduced-stimulation rule applies under the program's one name for the setting — **reduced motion** (cleanup 2026-11-01): with it on, startle one-offs are suppressed and beds only play. *(AM-PIL-10 — SND-3.)*

| Space | Bed | Emitters (anchored) | Reverb | Notes |
|---|---|---|---|---|
| Rotunda | none on first arrival — composed silence; a low stone-room tone only after the first room is visited | none | large hall (4 s) | §2 ①–⑤ happens in quiet |
| Wing II atrium | Bronze Age bed, low | none | stone room (2.6 s) | threshold space |
| Egypt — pylon court | desert wind + slow Nile water | none | open sky (0.9 s) | |
| Egypt — hypostyle | Egypt bed continues | ember crackle at torch stands (≤ 2) | stone room | bed never torn down mid-wing |
| Egypt — corridor | bed eases down (τ ≥ 1.0) | none | stone room | the hush approaches |
| Egypt — burial chamber | **no bed — designed silence** | none | stone room, dry | this room's own artistry choice; carries no status meaning |
| Mesopotamia — court | dusk wind, a city gone quiet | distant bronze-hammer strikes near metalwork (≤ 1) | open sky | |
| Ishtar Gate threshold | court bed continues | none | open sky → stone room | no chime — the chime is for wing changes |
| Ziggurat ascent | bed thins, wind rises with height | none | open sky | |
| Summit shrine | night wind, very low | brazier crackle (1) | open sky | sacred cap: ≤ 2 layers |

**Pending rooms keep their designed beds.** The audio brief's former
blanket rule ("rooms marked `pending: true` play silence") is struck:
ch02 carries the Egypt bed above because the room stands live by design
under Carter's pending ruling, and silence must never carry a status
meaning. Room-specific silence (the burial chamber) is artistry, and
stands. *(AM-PIL-10 — SND-3, alignment §5; the general pending-silence
question beyond embodied rooms remains Carter's — OQ-4.)*

---

## 4. LOREKEEPER VERDICT

### Embodiment risks — must be fixed or caveated before 3D

1. **`pending: true` on ch02.** The room stands live by design under
   constant review (Carter's ruling, §1). The pilot embodies the pending
   room **under plaque**: the threshold carries the pending-review
   plaque in the house voice, and every element derived from the pending
   chapter text carries the AWAITING REVIEW marker on or beside it —
   never only at the threshold, and never the blue attested marker. The
   plaque's words (revised — the earlier text asserted "what the
   evidence holds" over telling that is itself unreviewed; it no longer
   does):
   *"Some of this room's telling is newly added. It stands here by design,
   and it is still being reviewed — where the telling is new, its
   marker says AWAITING REVIEW, so you always know which words those
   are. Nothing in this room claims more than the evidence holds.
   — The Divine Archives."*
   *(AM-PIL-11 — SRC-1, LOR-1, PA-1, PA-9: "the house review" replaces
   "the keeper's review" throughout this spec — the lowercase keeper is
   the review function, not the Keeper the resident.)*

   **§4.1 Per-element clearance & marker schedule — ch02 Egypt.**
   Every embodied element, its source, its status, its marker. This
   table is the §5 criterion-3 audit list. *(AM-PIL-11 — SRC-1, LOR-4.)*

   | Element | Source | Status | Marker |
   |---|---|---|---|
   | Pyramid Texts of Unas (v34), spell columns | vault v34 | cleared (`pending: false`) | Chamber = RENDITION; the spells themselves = ATTESTED, in translation, translation named on the spell wall (§4.2) |
   | Papyrus of Ani (v20), scroll + weighing vignette | vault v20; vignette image: British Museum EA 10470 | cleared | ATTESTED; any embodied Weighing text names its translation on the plaque (§4.5) |
   | Merneptah Stele (v43) | vault v43 | cleared | ATTESTED |
   | Rosetta Stone (v53) | vault v53 | cleared | ATTESTED + date note (§4.3) |
   | Threshold summary plaque + 4 beat plaques | ch02 chapter text (`summary`) | **pending-derived** | AWAITING REVIEW, on each plaque's face |
   | 9 fig plinths (desc verbatim) | ch02 `figs` | **pending-derived** | AWAITING REVIEW, on each plinth + emblem-status line (§4.6) |
   | Plate relief + caption | ch02 `plate` / `plateCaption` | original artwork | ORIGINAL RENDERING |
   | Corridor carved line | ch02 chapter text, translated utterance | **pending-derived** | AWAITING REVIEW beside the carving; translation named (§4.2) |
   | Socket plaques (`mehen`, `senet`) | house voice (§2) | house text | no evidence marker — house-voice surfaces carry the sign-off instead |

   **Mesopotamia (ch03, `pending: false`)** carries the same discipline
   in cleared form: v52 ATTESTED with the gate structure marked
   RENDITION (evocation); v35 ATTESTED + era plaque (§4.3); summary
   plaques and fig plinths ATTESTED (cleared chapter text) with the
   emblem-status line; plate ORIGINAL RENDERING. §5 criterion 3
   certifies the Mesopotamia fig list contains no strays (§4.7).
2. **The Unas burial chamber is a rendition.** The vault data is
   explicit: the Pyramid Texts are *in place* at Saqqara; `rendition:
   false` here means no image rendition exists, not that our chamber is
   the original. FIX: the chamber's entry plaque states it is an
   evocation — **verbatim:**
   *"This chamber is an evocation — built after the burial chamber of
   Unas at Saqqara, where the Pyramid Texts still stand in place. The
   painted columns are a selection of those spells, in translation,
   not a copy of the king's walls. — The Divine Archives."*
   The spell wall names its translation (§4.2). The chamber's historic
   blue paint is the original's polychromy, not the evidence grammar —
   the grammar lives in the marker devices (§4, orientation), never in
   a room's own colours. The "Cannibal Hymn" stays on the plaque as
   text (it is in the vault summary); it is not illustrated or
   dramatized. *(AM-PIL-12 — WRD-1, LOR-3, LOR-4.)*
3. **Era plaques — Ishtar Gate, Rosetta Stone, Cyrus Cylinder.** Held:
   "Reconstructed in the Pergamonmuseum, Berlin" — our gate is a
   partial evocation and must say so. Dated c. 575 BCE
   (Nebuchadnezzar II): it is Neo-Babylonian, six centuries after the
   Bronze Age. FIX: its plaque carries the vault's own date
   prominently; the room's era label is the *wing's* context, never the
   object's date. **Verbatim, the Gate plaque:**
   *"The Ishtar Gate of Babylon, raised under Nebuchadnezzar II about
   575 BCE — long after the Bronze Age this wing is named for. It
   stands in this room by its chapter's home, not by its date. The
   gate you pass through is a partial evocation; the true gate,
   rebuilt from its excavated bricks, stands in the Pergamonmuseum,
   Berlin. — The Divine Archives."*
   Same caution for the Rosetta Stone (196 BCE, Ptolemaic) standing in
   a Bronze Age room — **its label carries this sentence verbatim:**
   *"Carved in 196 BCE, in the Ptolemaic age — far younger than the
   Bronze Age room it stands in; it is here by its chapter's home, not
   by its date."*
   **The Cyrus Cylinder (v35) takes the same treatment** — it is this
   room's relic, not its decoration: its vitrine plaque dates it from
   the vault data (v35) and states its placement in the room's terms.
   **Verbatim:**
   *"The Cyrus Cylinder, made about 539 BCE, after Cyrus of Persia
   took Babylon — centuries after the Bronze Age this wing is named
   for. It stands in this room by its chapter's home, not by its date.
   — The Divine Archives."* (The date is read from the v35 vault
   record at build time; if the record's date differs, the record
   governs and this text is corrected to it.) All three dates join the
   mandatory list in §5 criterion 5. *(AM-PIL-12 — SRC-2, LOR-2,
   WRD-1, WRD-7.)*
4. **Papyrus of Ani prop mismatch.** Vault data says `prop: "codex"`;
   the object is a papyrus scroll. FIX: render as an unrolled scroll in
   a vitrine (truth to the object over truth to the field); leave the
   data untouched and note the mismatch in the build log for the
   the house review. Do not "correct" repo data from the VR side.
5. **The weighing of the heart.** Attested — the vignette is in the
   Papyrus of Ani (British Museum EA 10470). May be shown. **Any
   embodied Weighing text names its translation source on the plaque;
   the chapter's source is Budge (1895), and its age is stated** —
   the Ani vitrine plaque carries, verbatim: *"The weighing of the
   heart, from the Papyrus of Ani. The English beside it is Ernest
   Budge's, from 1895 — a translation from another century, kept
   because it is the chapter's own, and named so you can weigh it too.
   — The Divine Archives."* The Amarna
   period stays worded as the summary words it: "the Amarna experiment
   in one god" — *experiment*, never a monotheism claim.
   *(AM-PIL-12 — SRC-4, LOR-3.)*
6. **Fig embodiment.** The 17 figs become plinth **emblem-reliefs**
   (§2): the fig's SVG art worked as a carved/medallion relief, with
   `desc`/`epithet` verbatim — never a free-standing body claiming to
   be a likeness. The plinth states the emblem status in plain words:
   *"An emblem, not a likeness — the archive holds no face for her."*
   (wording per fig; a fig with no face in the record gets no face
   here — Isis's emblem carries no invented face, throne, or wings
   without the label saying what is emblem and what is record).
   FIX REQUIRED: no invented attributes, no moral staging (Set gets no
   villain lighting; Tiamat no monster framing — the Enuma Elish is
   Marduk's telling, and the plaque says so). Where a fig's `contested`
   field is set, the plinth carries the contest note. **For the pilot
   set the build states explicitly whether any of the 17 carries
   `contested`** (§5 criterion 3); if none does, the contested branch
   is listed as untested in §6, not silently assumed.
   *(AM-PIL-12 — LOR-5, LOR-6, ART-1, SKP-4.)*
7. **No relic outside its home room.** The Rotunda's three codices are
   `home: ch29` — they are not embodied in the pilot. This rule is
   structural for all 83 rooms.

### §4.2 The translation layer and the gloss layer

**Translations are named.** Every rendered or quoted ancient text in
the pilot carries its translation on the surface that shows it: the
Unas spell wall names its translator, edition, and year (bound from
the chapter record at build time — the room does not certify until the
citation is carved); the Ani vitrine plaque names Budge (1895) (§4.5);
the corridor's carved line names its translation beside the carving.
A text whose translation cannot be named is not embodied.
*(AM-PIL-13 — LOR-3, SRC-4.)*

**The gloss layer.** Verbatim bound text (fig descs, summaries) cannot
be edited — so beneath it, in the house voice, runs a **gloss line**:
plain words for the cold term, fed from the chapter/vault record. A
cold term is glossed at its first use on every surface (Comfort
§g.27). The pilot's gloss list, verbatim:
- **Ma'at** — *"the Egyptians' word for truth, balance, and the right
  order of things."*
- **stele** — *"an upright stone slab, carved with words or
  pictures."*
- **Enuma Elish** — *"Babylon's creation epic — 'when on high,' from
  its first words."*
- **ziggurat** — *"a staged temple tower, climbed in steps."*
- **divination** — *"reading signs for the gods' intent."*
- **Hammurabi's law-stele** — *"the stone pillar carved with King
  Hammurabi's laws."*
- **Demotic** — *"the everyday Egyptian script of the Rosetta Stone's
  own time."*
- **Ptolemaic** — *"the age of the Greek-speaking royal house that
  ruled Egypt after Alexander — the Rosetta Stone's own time, long
  after the Bronze Age."*
- **greywacke** — *"a hard, dark grey stone."*
Truncation rule (§5, interaction spec §4.2): text is cut at a sentence
boundary, never inside a gloss; if a summary cannot fit whole on a
plaque, the whole text shows on magnification instead.
*(AM-PIL-13 — WRD-2, WRD-5, WRD-7, PA-7, PER-7.)*

**Threshold steles — the welcomes, verbatim.** The stele carries the
short glossed welcome; the room's full summary lives on its plaques
and book page (the 2–3 line stele cap stands for glossed text).
Egypt: *"Egypt. Here the heart is weighed against Ma'at — the
Egyptians' word for truth, balance, and the right order of things.
The dead are judged before Osiris, who rises; and Isis, who gathers him, is named in
this room's telling. — The Divine Archives."*
Mesopotamia: *"Mesopotamia. Between two rivers the first cities rose
— temples climbed in stages, kings set under written law. What is
oldest here is already looking up. — The Divine Archives."*
*(AM-PIL-13 — WRD-1, WRD-5, PER-7.)*

### Honest-evidence orientation — carved wording (house voice)

Mounted on the Rotunda lectern; presented in the arrival sequence
(§2 ④) and acknowledged by controller press or near-field poke —
never by gaze-dwell, and the portal is never locked behind it:

> *"This museum is built from the archive's chapters, and the chapters
> are built from evidence. On every object and wall you will find a
> small carved marker, and the marker tells you how far to trust what
> you see. A ring, stamped ATTESTED: the record holds it — these
> words, this object, are what the evidence keeps. A square, stamped
> RECONSTRUCTED: our honest imagining of what the evidence suggests,
> no more. An arch, stamped RENDITION: an evocation of a true thing
> that stands elsewhere. A leaf, stamped ORIGINAL RENDERING: the
> archive's own artwork, signed as its own. And a veiled tablet,
> stamped AWAITING REVIEW: the telling is new, standing here by
> design, still being read with care. Trust the ring. Question the
> square. Give the veiled tablet its time. — The Divine Archives."*

(Implementation — **the marker device, not the object's own colours:**
every marker is a small inlaid tablet at a fixed position on the
object's plaque or plinth edge, carrying **carved shape + inscribed
word + colour together** — ring/blue for ATTESTED, square/sandstone
for RECONSTRUCTED, arch/bronze for RENDITION, leaf/greenstone for
ORIGINAL RENDERING, veiled tablet/dark for AWAITING REVIEW. Colour is
never the only channel (Comfort §d.17): the word is legible at plaque
reading size and the shape reads by silhouette. The grammar is never
applied *as* an object's own historic material — the Unas chamber's
blue paint, the Gate's glazed brick, plain sandstone masonry carry no
grammar meaning. Handling facsimiles (interaction spec §3) carry a
hollow-ring stamp, FACSIMILE — a handling class, not an evidence
class. The legend is republished in the directory lectern and the
vade-mecum, not only here. §5 criterion 2 tests the grammar cold: a
first-timer shown the Gate and the spell wall sorts the categories
correctly. *(AM-PIL-14 — AD-2, DSG-2, HUM-2, WRD-3, LOR-4; replaces
the former blue-inlay/sandstone/veil colour-only grammar and the
former orientation wording, which §5.2 previously locked verbatim —
the lock now holds THIS text.)*)

---

## 5. ACCEPTANCE CRITERIA — "pilot done," measurably

1. **Four spaces navigable** in one WebXR-optional build (headset or
   flat-screen, same code path): Rotunda atrium, Wing II atrium,
   ch02 Egypt, ch03 Mesopotamia. Portal transit Rotunda → Wing II
   atrium → each room → back, as a masked swap (~250 ms fade, ≤ 400 ms
   masked work) with the light/bed cross-fade easing separately — no
   hard cuts, no unmasked black frame at any gate (§5 loading law,
   criterion 12).
2. **Orientation presented** in the arrival sequence (§2 ①–⑤); the
   honest-evidence wording (§4) mounted verbatim; the portal never
   locked; acknowledgement by controller press or poke, recorded, with
   the re-read path working from the lectern and every room stele; a
   visitor who never acknowledges still transits and can recover
   orientation in one action from anywhere. The marker device (§4)
   is applied to every embodied element per the §4.1 schedule; a
   first-timer shown the Ishtar Gate and the Unas spell wall cold
   sorts ATTESTED / RENDITION / AWAITING REVIEW correctly.
3. **Content completeness audit:** every vault item (6), every fig
   (17), both plates, both summaries, and all plate captions from the
   two wing JSONs is present and labeled; **zero invented content** —
   each 3D element traces to a JSON id, and the trace list ships with
   the build. **Directory reconciliation (added):** the fig and vault
   lists for both rooms are additionally reconciled **by name and
   count against the flat Directory** — the walk-verified true layer —
   and the audit certifies: Mesopotamia's 8 figs are exactly the
   Directory's 8 (no guide strays of the walk's Pattern 1 kind —
   Agni, Saraswati, or any foreign figure present = fail), Egypt's 9
   reconcile, and the build's statement of whether any pilot fig
   carries `contested` (§4.6). *(AM-PIL-15 — SRC-3, LOR-6, PA-4,
   SKP-4.)*
4. **Pending-review plaque** mounted at ch02's threshold, verbatim §4
   (amended text), and the AWAITING REVIEW marker verified **on or
   beside every pending-derived element** in the §4.1 schedule — a
   per-element marking test, not a threshold-only check. No
   pending-derived element carries the blue ATTESTED marker.
   *(AM-PIL-15 — SRC-1, LOR-1.)*
5. **Rendition & era plaques** mounted at the Unas chamber and the
   Ishtar Gate, verbatim §4; the Cyrus Cylinder's era plaque at its
   vitrine, verbatim §4; **object dates on their plaques — 575 BCE
   (Ishtar Gate), 196 BCE (Rosetta Stone), and the Cyrus Cylinder's
   date as held in the v35 vault record — never overridden by the
   wing era label.** The spell wall's translation citation (§4.2) is
   carved before the room certifies. *(AM-PIL-15 — SRC-2, LOR-2.)*
6. **Three living-room sockets** present, correctly slugged (`mehen`,
   `senet` in Egypt; `ur` in Mesopotamia), with floor inlay: `mehen`
   and `senet` veiled; **`ur` mounted** — the Royal Game of Ur live
   through the §7 contract (mount, play, exit, clean destroy verified
   in both modes). *(AM-PIL-15 — SKP-3, DSG-6.)*
7. **Performance — the Performance Sculptor's gate, in-headset:**
   the performance budget's §7 protocol, run **per pilot space**
   (all four, including through-portal sightlines from the atrium):
   in-headset on the Quest 2 floor device, p95 frame time ≤ 13.9 ms
   over a 60 s walkthrough, stereo draw calls ≤ 160, triangles
   ≤ 350k, per-room resident textures ≤ 16 MB, zero frames > 20 ms
   after fade-off, masked transition ≤ 400 ms, stable program count,
   **and a per-room light ledger proving ≤ 5 fragment-evaluated
   lights on the floor tier** (the light cut from the current 9–10
   is a named pilot deliverable — performance budget §2/§8). Quest 3
   passing does not certify Quest 2. The Galaxy S22 is a **separate,
   flat-mode check only** (magic-window preview, architecture §7): it
   certifies nothing about XR. "DPR ≤ 1.0" is struck as an XR control;
   XR resolution is governed by the framebuffer scale factor
   (1.0 Quest 3 / 0.8 Quest 2 — performance budget §1, architecture
   §2.3). Per-room numbers (draws, tris, resident texture MB, light
   count) are published with the build, Egypt costed as the densest
   case. **Per-zone Galaxy stills (cleanup 2026-11-01):** one flat-mode
   still per light zone named in §3 (Rotunda, court, hypostyle,
   corridor, chamber, Mesopotamia court, ascent, summit) is captured
   on the owner's Galaxy and checked for lifted shadows, face hold at
   plaque distance, and the first-seconds hook — a zone whose still
   reads black or flat on the Galaxy does not certify, however its
   in-headset numbers look. **Owner-witness:** the pilot is not done until Carter has
   stood in the VR mode himself on a named device, or explicitly
   rules that a named person's in-headset verification substitutes;
   until then the pilot's state is *unverified*, not passed — the
   preview path's "button correctly hides itself" is an honest
   outcome for the preview, never a pilot pass. *(AM-PIL-15 — CON-A8,
   MEC-1, SKP-1, SKP-2, ART-2, ART-6, ART-7.)*
8. **Pipeline gates:** Craft Council 11-lens review recorded;
   High Council ruling (Security / Sourcing / Consistency) issued —
   **no build ships on a DISMISSED finding from any of the three
   auditors; a dismissed security finding blocks shipment identically
   to a dismissed sourcing finding.** Build-review verification for
   the pilot's presence seam: `LocalPresenceProvider` only — no
   socket code and no endpoint strings in `presence.js`, and no
   change to `docs/_headers`. *(AM-PIL-15 — SEC-1, SEC-2.)*
9. **Readability (Comfort §c, imported):** body text ≥ 1.3°, titles
   ≥ 1.8°, captions ≥ 1.0° visual angle; contrast ≥ 7:1 body /
   ≥ 10:1 captions measured on the **worst-lit plaque** in each room;
   line length 40–60 characters; panel centre 1.35–1.55 m standing,
   re-anchored seated; reading distance 0.8–2.5 m. The veiled-portal
   plaques, the socket plaques, and the burial-chamber spell wall are
   each named as passing the worst-lit test. The magnified plaque
   panel is 0.9 m wide and states its type size and characters per
   line against these numbers. *(AM-PIL-15 — WRD-4, CON-A16.)*
10. **Comfort acceptance (the Warden's own tests):** 10 first-time
    users, 5 minutes of room-hopping, 0 reports of dizziness; the
    full pilot completed seated, teleport-only, with zero unreachable
    elements; the full pilot completed one-handed; the full pilot
    completed gaze-only (accessibility path); plaque legibility per
    criterion 9 verified in the same passes. *(AM-PIL-15 — PER-3,
    HUM-3, HUM-6, FT-7.)*
11. **Audio acceptance:** head-turn pans the ambience bed and the
    positional emitters on Quest hardware; `ctx.resume()` verified
    from the Enter VR gesture, from `sessionstart`, and on
    `visibilitychange` return; per-room caps measured in the Rotunda
    and the hypostyle (≤ 6 emitters, ≤ 3 HRTF, ≤ 8 layers, ≤ 40
    nodes, ≤ 5% frame CPU); the burial chamber verified as **no bed**;
    enter/exit XR 10× with mute-bus state and the sound toggle
    unchanged after every exit (the walk's Pattern 2 regression:
    state — audio included — resets/persists exactly as specified on
    room change and session change). **No sound as sole witness
    (cleanup 2026-11-01):** with all sound off, a visitor completes
    the full pilot losing no fact, direction, or warning — every
    functional sound (landing cue, wing-change chime, reveal herald)
    has its visual equivalent at its source and its caption on the
    vade-mecum slate, verified room by room in the same passes.
    *(AM-PIL-15 — SND-2, SND-4.)*
12. **Every-Screen & loading (PA-5):** the flat text Directory backup
    is reachable from inside all four pilot spaces; no unmasked black
    frame at any gate, portal, or session start, on either tier; if a
    build overruns its mask the visitor waits in a labelled, lit
    holding state; maximum load/black-screen time for pilot
    transitions is the §5 mask budget, tested. **Honest limit
    (cleanup 2026-11-01):** the 400 ms cap binds the *masked work*;
    no maximum total wait is promised beyond it — an overrun holds
    in the lit, labelled state for as long as the work honestly
    takes, and the Directory/flat exit stays reachable from that
    state, so no visitor is ever trapped waiting. *(AM-PIL-15 — PA-5,
    DSG-5, SKP-7.)*
13. **Touch parity (PA-6):** the flat/magic-window pilot path is
    tested on a phone — tap-to-walk, tap-to-inspect, finger-sized
    targets — in all four spaces. **Resume at the exact room
    (cleanup 2026-11-01):** a visitor leaves the headset mid-room in
    each of Egypt and Mesopotamia, opens the flat backup on the same
    device, reaches the full telling, and resumes at the exact room
    they stood in — tested, not assumed (interaction spec §8).
    *(AM-PIL-15 — PA-6.)*
14. **State-reset & stale-title test:** on every open, each plaque,
    panel, and dialog title equals its bound `vault → title` / fig
    name; state resets on room change and re-entry — tested
    specifically on v20 (the walk's "About this sky" failure);
    veiled portals verified non-traversable and non-leaking; every
    return portal's destination asserted. *(AM-PIL-15 — WRD-6,
    SKP-7.)*
15. **The fig gate:** the emblem-relief form is proven on ONE fig
    first — held at arm's reach (L0, < 2.5 m) on the Quest 2 floor
    device against the Shiva floor — and passes a recognisability
    check (the figure identified with its label covered, from front,
    side, and close views) before the remaining 16 are authorised in
    that form. Build order inside the pilot: Rotunda + one room + one
    fig in final form, held against the floors, before multiplying.
    *(AM-PIL-15 — AD-3, ART-1, ART-8, SKP-4.)*
16. **Verticality verification:** locomotion itself performs the
    descent and the ascent in the §8 verification (not teleport-only
    by exception): `collide(vec3)` Y-handling on the corridor slope
    and ziggurat ramps exercised on-device; a teleport-only
    first-timer experiences both rooms' reveals in their designed
    order (sequence-preserving staged landings, §2); the burial-
    chamber reveal fires from the corridor mouth (≥ 3 m), and all
    torch/baked flicker stays under the 3 Hz / low-contrast caps.
    *(AM-PIL-15 — MEC-8, PER-4, PER-6, DSG-4, SKP-2.)*

---

## 6. WHAT THE PILOT PROVES — pipeline validation for the 83-room build

| Proven by pilot | Unlocks |
|---|---|
| Hub-spoke portals + veiled future portals (Rotunda) | All 9 wing portals; honest "still being built" grammar for unbuilt wings |
| Relic prop system at 3 scales: slab, scroll-vitrine, architectural (gate) | The showing vault items (87 standing; counts per the Directory at build time) embodied via the `prop`-type vocabulary — the prop-type → vault-item mapping is published with the build, **including the exception rule the Ani scroll establishes** (an object whose `prop` field mismatches its nature renders true to the object, §4.4) *(AM-PIL-16 — PA-8, DSG-6, CON-C3)* |
| Plinth data system populated × 17 (name / epithet / desc / contested), emblem-relief form gated by §5 criterion 15 | The Pantheon component — generalised to the 199 only after the fig gate passes; **the aniconic exception is carved out**: rooms that must hold presence through absence (the Second Temple pattern) are not a plinth problem and are not claimed here *(AM-PIL-16 — SKP-3, SKP-4)* |
| Verticality both directions (tomb descent + ziggurat ascent — locomotion itself performs both, §5 criterion 16) | Cave shrines, towers, crypts, minarets — any vertical room |
| Chiaroscuro lighting rig (baked zones + focal spots + séance-paced transitions) | Artistry Standard §4 compliance pattern for every room |
| Orientation ritual + the marker device (shape + word + colour, §4) | Honest-evidence system across all 83 rooms |
| Pending-review plaque + per-element marker pattern (ch02) | Safe embodiment of the pending rooms without laundering unreviewed claims — their count taken from the Directory at build time (18 pending-review tags standing 2026-11-01; the earlier "17" is corrected) *(AM-PIL-16 — PA-8)* |
| Living-room socket architecture × 3 (§7), with one module — the Royal Game of Ur — mounted, played, exited, and destroyed cleanly through the contract | The remaining exhibits dock per the same contract; "no redesign" is claimed only for what the Ur mount exercised *(AM-PIL-16 — SKP-3, DSG-6)* |
| Phone-class envelope held in-headset on the Quest 2 floor (performance budget §7 gate); the S22 serves as the separate flat preview check | The full-build performance budget model |
| Theme-room composition variant (specified §2) | The 7 Rotunda theme rooms, when their time comes |
| "No relic outside its home room" rule (codices held back) | Content-integrity rule for the whole museum |

---

## 7. LIVING-ROOM INSERTION CONTRACT

*How the 10 future exhibit modules dock into VR rooms later. The contract
is specified once, here; "no redesign" is claimed only for what the Royal
Game of Ur mount actually exercised (the §6 discipline, cleanup
2026-11-01) — the other exhibits dock per this contract, and any part of
it the Ur mount did not touch is a specification, not a proof.
Aligns with `museum-wing-design.md` §3 (living-room class).*

1. **Sockets are architecture, not placeholders.** Each socket is a
   built floor inlay (2.5 × 2.5 m standard; Ur's board table gets
   3 × 2 m), a veiled portal frame, and a data binding:
   `{ socket_id, exhibit_slug, anchor_room_id, orientation_copy }`.
   Pilot sockets: `mehen`→ch02, `senet`→ch02, `ur`→ch03.
2. **Module mount = the flat-screen lifecycle in 3D.** The exhibit's ES
   module mounts into its socket through the shared lifecycle helper:
   deterministic `destroy()`/`disconnectedCallback()`, RAF/timer/
   listener/audio disposal, DPR capped at 1.0 on mobile, context-loss
   messaging. The socket frame is the module's stage; the module never
   touches room geometry.
3. **Orientation before play.** Each living room opens with the
   30-second orientation (what it is, attested vs. reconstructed,
   honest-evidence note) — the VR version reuses the pilot's
   orientation component (§4 grammar), reskinned per exhibit.
4. **Exit returns to the anchor room**, never to a menu — the visitor
   stays inside the tradition. The socket's portal frame becomes the
   exhibit's door both ways.
5. **Routing:** VR deep-link equivalents of `museum#living-<slug>`;
   the directory lectern gains the "living room" marker per the
   wing-design doc.
6. **No invented taxonomy:** exhibit metadata (titles, rules,
   caveats) comes from the payload snapshots; repository conventions
   win on conflict. The socket's veiled plaque copy is replaced, not
   rewritten, by the exhibit's own orientation.
7. **Future sockets** (Oracle Bones / I Ching → ch09; Antikythera /
   Library Rescue → ch15; Hnefatafl → ch23; Astrolabe → ch21;
   Alchemist → ch28) are cut into their rooms during those rooms'
   builds, following this exact contract — **specified once here,
   instantiated for all ten exhibits (three in the pilot, seven
   future).** "Never redesigned" is not claimed beyond what the Ur
   mount exercised (§6). *(AM-PIL-16 — CON-C6; framing disciplined
   by cleanup 2026-11-01.)*

---

*Spec ends. Next: Craft Council lenses → High Council → Claude Code.
Nothing here is built; everything here is buildable. — The Divine Archives.*
