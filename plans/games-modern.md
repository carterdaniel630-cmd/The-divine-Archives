# Games + rituals: the modern pass (Phase 1 plan)

Status: **PLAN, awaiting Carter's approval. Nothing is built.** Branch `claude/games-modern`, written 2026-10-10.
On approval: build the Divine Casualties rebuild (§2) and the ritual prototype (§5), open PRs, and pass them
through the reviewer.

**Fixed decisions (Carter):**
- In-site games stay on web technology. UE5 is for video only.
- Every Divine Casualties god gets a distinct moveset. This is required.
- The roster stays Greek-only for now.

**What exists today:**
- Twelve 2D canvas games in `docs/assets/games/`.
- Divine Casualties (`fighter.js`, 2,059 lines, with its move data in `fighter-moves.js`) runs a fixed 60 Hz logic
  step. It has an 8-tick input buffer (`BUF_TICKS = 8`, about 133 ms) and per-move hitstop. Moves are data-driven:
  timeline in ticks, joint-anchored hitboxes, poses keyed over a 2D skeleton.
- The four gods (Zeus, Poseidon, Athena, Hades) share one base kit with small number overrides. They are not yet
  distinct.
- The museum and the Pilgrimage already run Three.js r186 (`docs/assets/vendor/three/`) on WebGL2.

---

## 1. Technology

### Renderer
- **Three.js `WebGPURenderer`, with its built-in WebGL2 fallback.** It picks WebGPU where the browser has it and
  drops to its WebGL2 backend otherwise, with one code path and one material system (TSL node materials). This
  needs one new vendored file, `three.webgpu.min.js`, pinned to the same release as the files already in
  `docs/assets/vendor/three/`, so the museum's copy is shared.
- **Last-resort fallback:** today's 2D canvas game, kept as it is. It is used when neither WebGPU nor WebGL2 is
  available, or when the visitor turns on "classic mode". Nothing that works today is lost.
- **Loading:** a game's 3D code loads only when the visitor opens that game (speed fix #6 in
  `00-audit/perf-baseline.md`).

### Characters
- **Rigged glTF 2.0 (`.glb`)**, one per god:
  - skinned mesh, at most 60 bones;
  - meshes compressed with `EXT_meshopt_compression`;
  - textures in KTX2 (Basis Universal: ETC1S for colour, UASTC for normals), loaded by `GLTFLoader` +
    `KTX2Loader` + `MeshoptDecoder`, all vendored and pinned.
- **Look:** keep the current cel-shaded "heroic" style, as a toon ramp (a `MeshToonMaterial` or TSL equivalent)
  plus an inverted-hull outline. It reads at phone size and is cheap.
- **Modelling and rights:** we model and rig every god ourselves in Blender. No downloaded characters. This is
  the same rule as the museum and the Pilgrimage.

### Animation
- **Clips** are played by `AnimationMixer`, one clip per move and per locomotion state, with cross-fades.
- **The gameplay timeline stays authoritative.** Hitboxes, hitstop and cancels keep running from the move data in
  ticks, as now. Each clip is sampled at the move's tick, not free-running, so animation and combat cannot drift.
  This is the rule `fighter-moves.js` already follows with its 2D poses.
- **Sources of motion:**
  - **Hand-keyed** in Blender for every strike, special and super (the timing has to hit the frame data exactly).
  - **Motion capture** only for locomotion and idles. Candidates: our own markerless captures, or a mocap library
    whose licence allows redistribution in a web game (to check before use, never assumed). Every mocap clip is
    retargeted and cleaned by hand.
- **Hitboxes** stay anchored to named joints (`hand_R`, `foot_R`, `head` …), now 3D bones projected onto the
  fighting plane. The fight stays 2D in logic (a 2.5D presentation), so the frame data below keeps its meaning.

### Post-processing
Done with the renderer's node post-processing pipeline (TSL `pass()`):
- **Bloom** for auras, bolts and hit flashes, at half resolution.
- **Ambient occlusion** (GTAO) on the high tier only.
- **Colour grading** through a small 3D look-up table per stage: night storm, sea cave, Olympus dawn, underworld.
- **Tone mapping** with ACES or AgX.
- Impact frames (a one-frame invert flash and a radial blur) are kept as short, opt-out effects. They are off
  when the visitor's "reduce motion" setting is on.

### Mobile performance budget
Target: **60 fps on a mid-range phone.** The reference devices are a 2022 mid-range Android (a Pixel 6a-class
phone) and an iPhone 12-class phone. We measure on real phones, not only on throttled desktop.

| Item | Budget |
|---|---|
| Frame time | 16.6 ms; CPU ≤ 6 ms, GPU ≤ 10 ms |
| Draw calls (fight scene) | ≤ 60 (hard limit 100) |
| Triangles in view | ≤ 100k (hard limit 150k) |
| Each god | ≤ 20k triangles, ≤ 60 bones, 1 material + outline |
| Stage | ≤ 40k triangles, baked lighting, ≤ 2 dynamic lights |
| Texture memory | ≤ 48 MB (KTX2, 1024 px maximum on phones) |
| Download to first fight | ≤ 3 MB per god, ≤ 8 MB for two gods and a stage |
| Post-processing | bloom ≤ 1.5 ms, grading ≤ 0.3 ms, AO high tier only (≤ 2 ms) |
| Logic | fixed 60 Hz step, unchanged; rendering interpolates as now |

**Quality tiers:**
- Low: no AO, bloom at quarter resolution, outline on gods only, 0.75 render scale.
- Medium: bloom at half resolution.
- High: AO, full-resolution bloom.
- The tier is chosen automatically from a short frame-time probe on load, with a manual setting.
- Dynamic resolution, from 0.7 to 1.0, holds 60 fps.

**Checks:**
- `tools/fps-games.js` is extended with the 3D fighter: frame time at CPU ×4 throttle, plus draw calls,
  triangles and texture memory from `renderer.info`.
- `game-runtime.yml` keeps the headless smoke test.
- `verify-fighters.js` keeps the fact checks (§2.3).

---

## 2. Divine Casualties: the four gods, distinct

### 2.1 What every god shares (kept from today)
- **Inputs:** move, jump, block, light, heavy, special, grab.
  - Heavy picks the close or far version by distance, as today (headbutt inside about 60 px).
- **New:** direction + special, giving three specials per god:
  - **neutral special**;
  - **forward special** (toward + special);
  - **back special** (away + special).
  - Phones get a "special" button with a swipe.
- **Input buffer:** 8 ticks (about 133 ms), unchanged. Specials also accept the direction up to 8 ticks before
  the button.
- **Hitstop:** per move, as now (in seconds, applied to both fighters). Supers add a 0.25 s freeze at the start.
- **Meter:** 0–100.
  - A special costs 40 (unchanged).
  - A super costs 100 (unchanged).
  - Command specials (the forward and back specials) cost 0 but have long whiff recovery, so they are not
    spammed.
- **Damage:** values below are before the global `DMG = 0.5` scale in `fighter.js` (unchanged).

### 2.2 Frame data sheets
Ticks at 60 Hz:
- **Startup:** ticks before the hit is live.
- **Active:** the first and last live ticks.
- **Recovery:** ticks after active.
- **Block:** frame advantage on block (+ is good for the attacker), from a blockstun we set per move.
- **Hitstop** is in seconds. **KB** is knockback in px per tick.

Existing numbers are kept where marked (=).

#### Zeus: the king (all-rounder, zoner)
Grounding (ch08): king of a new order after the Titans; thunderbolt and eagle; the sky.

| Move | Input | Startup | Active | Rec. | Block | Dmg | Hitstop | KB | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Sceptre jab | light | 4 = | 4–6 = | 10 = | +1 | 6 = | 0.06 = | 2 = | chains into itself ×2, heavies, specials |
| Storm kick | heavy (far) | 12 = | 12–15 = | 13 = | −3 | 13 = | 0.12 = | 4.2 = | cancels into specials |
| King's brow | heavy (close) | 6 = | 6–8 = | 12 = | −2 | 16 = | 0.12 = | 4.2 = | |
| Eagle stoop | air light | 6 | 6–12 | 13 | — | 9 | 0.07 | 2.5 | |
| Falling sky | air heavy | 9 | 9–20 | 16 land | −6 | 12 | 0.10 | 3.5 | dive; drive as `aerialDive` = |
| **Keraunos** | special | 23 = (cast) | projectile | 31 | −8 | 20 | 0.10 | 3.0 | fast bolt, speed 7.6 =, 40 meter |
| **Eagle's dive** | fwd + special | 14 | 14–22 | 18 | −10 | 11 | 0.10 | 5.0 | travels about a third of the screen, crosses jumps; 0 meter |
| **Sky-split** | back + special | 9 | 9–15 | 20 | −12 | 12 | 0.12 | up-launch | a column of lightning at arm's length; anti-air; 0 meter |
| **Titanomachy** (super) | special at 100 | 30 | 3 bolts over 30–60 | 24 | — | 50 total | 0.25 | 4.0 | the war on the Titans: three bolts down from the sky, tracking the foe's position at cast |
| Throw | grab | 5 | 5–6 | 20 | — | 14 | 0.12 | 6.0 | lifts and hurls |

Unique animations:
- an overhead thunderbolt wind-up (the arm cocked back, the bolt drawn in the hand);
- an eagle-wing arm sweep for the dive;
- a seated, enthroned victory pose;
- a regal idle (sceptre grounded).

#### Poseidon: the sea and the earthquake (long-range spacer, heavy)
Grounding (ch08): sea and earthquakes; the trident; *po-se-da-o* in Linear B.

| Move | Input | Startup | Active | Rec. | Block | Dmg | Hitstop | KB | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Trident poke | light | 6 | 6–8 | 12 | −1 | 7 = | 0.07 | 2.5 | longest light reach in the set (hitbox ox +14, r 16) |
| Trident sweep | heavy (far) | 14 | 14–18 | 14 | −4 | 12 = | 0.12 | 6.5 = | longest reach of any normal; pushes to the wall |
| Shoulder of the deep | heavy (close) | 7 | 7–9 | 13 | −3 | 15 = | 0.13 | 5.0 | |
| Breaker | air light | 8 | 8–13 | 14 | — | 9 | 0.08 | 3.0 | trident stabbed down |
| Undertow | air heavy | 10 | 10–22 | 18 land | −7 | 13 | 0.11 | 4.0 | |
| **Seismos** | special | 26 (cast) | ground wave | 30 | −6 | 20 | 0.10 | 5.5 | travels along the floor, speed 5.4 =; must be jumped, cannot be ducked |
| **Riptide** | fwd + special | 12 | 12–20 | 22 | −12 | 13 | 0.12 | 6.0 | trident charge with armour on ticks 6–14 (absorbs one hit) |
| **Earthquake** | back + special | 16 | 16–20 | 22 | −8 | 10 | 0.10 | knock-down | a stamp: a shockwave round him that hits grounded foes only and misses airborne ones; 0 meter |
| **The sea rises** (super) | special at 100 | 28 | wall of water 28–70 | 26 | — | 50 | 0.25 | carry to wall | a full-screen wave from behind him |
| Throw | grab | 6 | 6–7 | 22 | — | 15 | 0.13 | 7.0 | heaviest throw |

Unique animations:
- a trident twirl idle;
- a two-handed lift that raises the wave;
- a ground stamp for the earthquake;
- a slow, planted walk (`walkSpeed 2.6`, `weight 1.2`, kept).

#### Athena: owl, aegis and olive (technical, rushdown, parry)
Grounding (ch08): wisdom, war-craft, the city; owl, aegis and olive.

| Move | Input | Startup | Active | Rec. | Block | Dmg | Hitstop | KB | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Spear jab | light | 3 = | 3–5 = | 8 = | +2 | 5 = | 0.05 | 2.0 | fastest normal in the set; chains ×3 |
| Hoplite thrust | heavy (far) | 10 | 10–12 | 12 | −1 | 12 = | 0.11 | 4.0 | |
| Aegis bash | heavy (close) | 5 | 5–7 | 11 | +1 | 13 | 0.12 | 3.5 | breaks a third of the foe's guard meter |
| Owl's stoop | air light | 5 | 5–11 | 11 | — | 8 | 0.06 | 2.5 | |
| Spear dive | air heavy | 8 | 8–18 | 14 land | −4 | 11 | 0.10 | 3.0 | can cross up |
| **Glaux** | special | 20 (cast) | projectile | 26 | −5 | 18 | 0.09 | 3.0 | owl in flight, speed 6.9 =, curves gently toward the foe's height |
| **Phalanx step** | fwd + special | 4 | — | 8 | — | — | — | — | a fast advancing step, cancellable into any normal on ticks 4–8; no hit; 0 meter |
| **Aegis** (parry) | back + special | 2 | parry 2–7 | 18 whiff | — | 10 riposte | 0.20 | 3.5 | a 6-tick parry window; a parried hit is answered with a spear riposte; long whiff recovery is the risk |
| **Owl, aegis and olive** (super) | special at 100 | 18 | 18–60 | 22 | — | 50 | 0.25 | 4.0 | the aegis flash stuns (0.5 s), then a spear flurry; the olive branch is drawn in the ending pose |
| Throw | grab | 4 | 4–5 | 18 | — | 12 | 0.10 | 5.0 | quickest throw |

Unique animations:
- a spear-and-shield stance;
- a shield raise for the parry, with a gold flash on success;
- an owl released from the hand;
- a feinting step.

#### Hades: the realm of the dead (bruiser, grappler)
Grounding (ch08): the realm of Hades, the shades, the Styx; Persephone. ch47: Cerberus, Charon.

| Move | Input | Startup | Active | Rec. | Block | Dmg | Hitstop | KB | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Grasp of the shades | light | 5 | 5–7 | 11 | 0 | 8 = | 0.09 = | 1.5 | |
| Gate strike | heavy (far) | 14 | 14–17 | 15 | −2 | 15 = | 0.16 = | 3.0 = | an overhead: must be blocked standing |
| Brow of the deep | heavy (close) | 7 | 7–9 | 13 | −1 | 20 = | 0.16 = | 2.5 | highest-damage normal |
| Falling shade | air light | 7 | 7–12 | 13 | — | 10 | 0.09 | 2.0 | |
| Katabasis | air heavy | 11 | 11–24 | 20 land | −8 | 15 | 0.14 | 3.0 | a stomp straight down |
| **Psyche** | special | 24 (cast) | projectile | 32 | −9 | 20 | 0.12 | 3.0 | a slow soul, speed 5.6 =; lingers |
| **Charon's toll** | fwd + special | 8 | 8–10 | 30 whiff | — | 18 | 0.16 | — | command grab: cannot be blocked, reach about 50 px; long whiff recovery |
| **Shade step** | back + special | 2 | invulnerable 2–12 | 14 | — | — | — | — | a short backward fade through the shadows; 0 meter |
| **The house of Hades** (super) | special at 100 | 24 | darkness 24–204 | 20 | — | 50 | 0.25 | — | the stage darkens for 3 s, the foe moves 30% slower, and his next grab within it does the super's damage; Cerberus is drawn guarding the gate |
| Throw | grab | 6 | 6–7 | 20 | — | 16 | 0.14 | 4.0 | |

Unique animations:
- a cloak sweep;
- a reach down to the ground for the command grab, with shades' hands rising;
- the fade of the shade step;
- a heavy, unhurried walk.

### 2.3 Facts and checks
- Each special and super gets a `basis` string that must appear in ch08 or ch47 text. `tools/verify-fighters.js`
  is extended to check every move's basis, not only each god's `factRef`.
- Bases planned, all already in the chapters:
  - Zeus: "thunderbolt and eagle" and "Titans" (ch08).
  - Poseidon: "sea, earthquakes" and "trident" (ch08).
  - Athena: "owl, aegis, and olive" (ch08).
  - Hades: "realm of Hades" and "Styx" (ch08); "Cerberus" and "Charon" (ch47).
- Names not found in the chapters (for example a helmet of invisibility for Hades) are left out until a chapter
  covers them with a source.
- A frame-data test (`tools/ci-play-fighter.js` extended) asserts every move's startup, active and total against
  this table. The balance can change later, but only on purpose.

### 2.4 Roster expansion: NEEDS CARTER
**Question for Carter:** after the Greek four, should the roster grow beyond Greece?

**Recommendation:** only traditions with no living worshipping community, at first: Egypt, Mesopotamia, Norse,
Aztec, Maya, the Hittites.

**Then a separate decision:** gods still worshipped today (Hindu deities, Shinto kami, Yoruba orishas, the
African diaspora lwa) are tier-3 material under §4. Making a living deity a fighter who is beaten and "KO'd"
could give offence that a museum label would not. They need your explicit approval, god by god, and probably
not at all.

---

## 3. Upgrade order for the other eleven games

| Order | Game | What changes | Effort |
|---|---|---|---|
| 0 | Shared runtime (all games) | renderer bootstrap with WebGPU → WebGL2 → 2D fallback, quality tiers, glTF/KTX2/meshopt loading, post-processing presets, `fps-games.js` 3D probes | medium: 1–2 sessions |
| 1 | Divine Casualties | §2 | large: 4–6 sessions (four rigged gods is most of it) |
| 2 | The Tomb Robber | 3D levels from the existing four sites, lit by torch; fixes speed items #4, #8 and #10 | large: 3–4 |
| 3 | Archive Chess | 3D board and modelled pieces for the three pantheons, a camera that orbits; same rules engine | medium: 2 |
| 4 | Ziggurat Builder | 3D course-stacking with real mud-brick materials; the same facts | medium: 1–2 |
| 5 | The Labyrinth | 3D maze, top-down tilted camera, shades with soft glow; the same AI | medium: 2 |
| 6 | The Firmament | 3D pinball table with real physics (a small rigid-body step), bloom on the bumpers | large: 3 |
| 7 | Dominion of the Ancients | 3D relief map from `risk-grid.png` heights, pieces as small models | large: 3 |
| 8 | The Excavation | 3D dig grid, a trowel animation, finds modelled | small–medium: 1 |
| 9 | Ouroboros | 3D serpent on a plane, scales shader | small: 1 |
| 10 | Antithesis | 3D paddles and orb, bloom; little else needed | small: 0.5–1 |
| 11 | The Reliquary | stays a trivia UI; relics shown with the museum's inspector | small: 0.5 |
| 12 | The Seeker's Path | stays 2D: a text journey; typography and transitions only | small: 0.5 |

Each game keeps its 2D version as the fallback, and its `verify-*.js` fact checks, unchanged.

---

## 4. Rituals: one respectful interactive ritual per tradition and room

**Rules for every ritual:**
- guided and explanatory;
- no scores, timers or win states;
- every step cites its source (a primary text, or the ethnography or scholarship behind it);
- framed in the believer's lens ("this is what the act means to those who do it"), with the evidence panel
  beside it as everywhere else;
- opt-in: a button on the room's case or plinth, never a pop-up;
- skippable at every step;
- no sacred object handled as a toy;
- no images the room rules forbid.

**Tiers:**
- **Tier 1, historical.** A rite of a tradition with no continuous living community, or a rite no longer
  practised. Shown as history. Built after normal review.
- **Tier 2, living and public.** A gesture a living tradition itself invites visitors to make or to watch:
  lighting a candle, writing a prayer tablet, turning a prayer wheel, sharing a meal. Built only with
  believer-lens framing checked by the reviewer, and in Carter's batch review.
- **Tier 3, living sacred practice.** Obligatory worship, sacraments, initiation and life-cycle rites, ceremonies
  of Indigenous peoples, anything a community restricts. **NEEDS CARTER by default.** Some are marked **do not
  build**: secret-sacred material, closed initiations, and rites the community asks outsiders not to imitate.

| Ch | Room | Ritual | Tier | Cite each step from |
|---|---|---|---|---|
| ch01 | The Flood (theme) | none; the comparative panel only | — | — |
| ch02 | Egypt | **The Weighing of the Heart** (the prototype, §5) | 1 | Book of the Dead, Spell 125; the Papyrus of Ani vignette (V20) |
| ch03 | Mesopotamia | Reading a sheep's liver from a clay model (extispicy), no animal | 1 | Old Babylonian clay liver models; omen series *Bārûtu* |
| ch04 | Indus Valley | none: the religion is unreadable; a panel on what the seals might mean | — | — |
| ch05 | Early Vedic | The household fire offering (*agnihotra*) explained, watched not performed | 3 | it is still practised by some Brahmin households; *Śatapatha Brāhmaṇa* |
| ch06 | Zoroaster | Tending a fire temple's fire, watched from outside | 3 | living Zoroastrian practice; access to fire temples is restricted |
| ch07 | Pre-exilic Israel | A household offering at a four-horned altar, as history | 1 | the archaeology of household cult (Arad, Tel Dan altars) |
| ch08 | Early Greece | Pouring a libation at a household altar | 1 | Homer; the vase-painting record |
| ch09 | Early China | Shang oracle-bone divination: heating the bone, reading the crack | 1 | the oracle-bone inscriptions |
| ch10 | Second Temple Judaism | A Temple pilgrimage-festival offering, as history | 1 | Mishnah, *Bikkurim* 3 (first fruits) |
| ch11 | Buddhism | Circling a stupa clockwise (*pradakṣiṇā*) | 2 | living practice, open to visitors at many stupas |
| ch12 | Confucianism & Daoism | Offering incense to ancestors at a family altar | 3 | living family practice; ask before simulating |
| ch13 | Rome | A household offering at the lararium | 1 | Cato, *De agricultura* 143; the Pompeii lararia (alternate prototype) |
| ch14 | Celtic & Germanic | Casting a votive offering into water, as history | 1 | votive deposits (bog finds); Tacitus |
| ch15 | Classical Greece | A sleep in the temple of Asclepius, as history | 1 | the Epidaurus healing inscriptions |
| ch16 | Early Christianity | Baptism in the early church | 3 | a living sacrament: **NEEDS CARTER** |
| ch17 | Gnosticism | none: reading a passage, not a rite | — | — |
| ch18 | Roman Mystery Cults | The Mithraic banquet in the cave | 1 | Mithraea reliefs; the cult is secret, so steps are reconstruction and labelled so |
| ch19 | Rabbinic Judaism | The Passover Seder's order | 3 | a living observance: **NEEDS CARTER** |
| ch20 | Mahayana Buddhism | Copying a sūtra line as merit (the Dunhuang practice) | 2 | the Diamond Sūtra colophon; living practice |
| ch21 | Islam | Prayer rug and the *salat* walkthrough | 3 | obligatory worship: **NEEDS CARTER**; no imitation of the prayer by default |
| ch22 | Patristic Christianity | Lighting a votive candle | 2 | a living public devotion, open to visitors in most churches |
| ch23 | Norse Paganism | A *blót* feast as described in the sagas | 1 (with a Heathenry note) | sagas; modern Heathens are noted |
| ch24 | Tantra | none: initiatory | do not build | — |
| ch25 | Shinto | Writing an *ema* prayer tablet | 2 | shrines invite visitors to do this |
| ch26 | Kabbalah | none: study tradition | — | — |
| ch27 | Sufism | Watching the Mevlevi *sema* | 3 | a living ceremony; watch only, if approved |
| ch28 | Scholasticism | none | — | — |
| ch29 | The Maya | A Classic Maya bloodletting rite: explained only, never enacted | 1 | stelae and lintels (Yaxchilan) |
| ch43 | The Aztec | Leaving flowers and incense at the Templo Mayor | 1 | Sahagún; no sacrifice enacted |
| ch44 | The Inca | A *capacocha* explained only | 1 (explain only) | ethnohistory; child sacrifice is never enacted |
| ch45 | Pistis Sophia | none | — | — |
| ch46 | Creation (theme) | none | — | — |
| ch30 | Bhakti | Singing *kirtan* (listening) | 3 | a living devotional practice |
| ch31 | The Reformation | Reading the Ninety-five Theses at the door | 1 | the text of 1517 |
| ch32 | The Witch Trials | none: persecution history, no ritual | do not build | — |
| ch33 | African Traditional Religion | Ifá divination | 3 | a living initiatory practice: **NEEDS CARTER** |
| ch34 | Sikhism | Sitting for *langar*, the free kitchen | 2 | gurdwaras serve everyone; the meal is explained |
| ch35 | New Religious Movements | none | — | — |
| ch36 | Spiritualism | A Victorian séance as history (table, the rapping code) | 2 | living Spiritualist churches exist; the history panel includes the Fox sisters' 1888 confession |
| ch37 | Theosophy | none | — | — |
| ch38 | Wicca & Modern Paganism | Casting a circle | 3 | a living religion's rite |
| ch39 | Satanism | none | do not build | (sensationalising risk) |
| ch40 | African Diaspora Religions | none: Vodou and Candomblé ceremonies are initiatory | do not build | — |
| ch41 | The Paleolithic | Painting by lamplight in a cave, as history | 1 | cave art; interpretation flagged as open |
| ch42 | The Neolithic | Plastering a skull (Jericho), explained only | 1 (explain only) | excavation reports |
| ch47–51 | the theme rooms | none; the comparative panels only | — | — |
| ch52 | Jainism | Asking forgiveness at Saṃvatsarī (*micchāmi dukkaḍaṃ*) | 3 | a living observance |
| ch53 | Tibetan & Vajrayana | Turning a prayer wheel | 2 | open to visitors; the mantra explained, not chanted for the visitor |
| ch54 | Zen & Pure Land | Raking a dry garden (*karesansui*) | 2 | temples' own visitor practice |
| ch55 | Manichaeism | none | — | — |
| ch56 | Mandaeans, Yazidis & Druze | none: closed communities | do not build | — |
| ch57 | Hittite & Anatolian | The ritual for the vanished god Telipinu, as history | 1 | the Telipinu myth texts |
| ch58 | Canaanite & Phoenician | none (the tophet is never enacted) | do not build | — |
| ch59 | Slavic & Baltic | Midsummer wreaths on water (Kupala), as folk history | 1 (with a Rodnovery note) | ethnography |
| ch60 | Eastern Orthodoxy | Venerating an icon (watched) | 3 | a living devotion |
| ch61 | Aboriginal Australian | none | **do not build** | secret-sacred and ceremony rules |
| ch62 | Native North American | none | **do not build** | living ceremonies (Sun Dance, sweat lodge) are not simulated |
| ch63 | Oceania | none | do not build | — |
| ch64 | Pentecostalism | none | — | — |
| ch65 | Bahá'í & New Faiths | none | — | — |
| ch66 | The San | none | do not build | the trance dance is living heritage |
| ch67 | Minoan Crete | Offerings at a peak sanctuary, as history | 1 | votive finds; interpretation flagged |
| ch68 | Nubia & Kush | none | — | — |
| ch69 | Upanishads & Hindu Synthesis | Floating a lamp on the Ganges (*ārtī*), watched | 3 | a living puja: **NEEDS CARTER** |
| ch70 | Pre-Islamic Arabia | none: next to Islam, sensitive | do not build | — |
| ch71 | Korea | none (the *gut* is living shamanic practice) | do not build | — |
| ch72 | The Cathars | The *consolamentum*, as history | 1 | inquisition records and the Lyon ritual, flagged as hostile and fragmentary sources |
| ch73 | Sabbateans & Hasidim | none | — | — |
| ch74 | Secularism | A humanist naming ceremony, explained | 2 | humanist organisations' published forms |
| ch75 | Siberian & Arctic | none | do not build | living shamanic practice |
| ch76 | The Olmec | none | — | — |
| ch77 | The Etruscans | Reading a bronze liver (the Piacenza model) | 1 | the Piacenza liver |
| ch78 | The Scythians | none | — | — |
| ch79 | First Christian Kingdoms | Timkat procession (watched) | 3 | a living festival |
| ch80 | Shi'ism | none (Muharram mourning is living) | do not build | — |
| ch81 | Tengri & the Mongols | Circling an *ovoo* cairn, adding a stone | 2 | living, open roadside practice |
| ch82 | Akbar | A debate in the House of Worship, as history | 1 | Abu'l-Fazl, *Akbarnama* |
| ch83 | Global Hinduism | none beyond ch69 | — | — |

**Totals** (79 rows; ch47–ch51 share one row):
- Tier 1: 23 (counting each "explain only" entry).
- Tier 2: 10.
- Tier 3: 14, all NEEDS CARTER.
- "Do not build": 14.
- "None": 18 (themes, study traditions, unreadable or closed).

Every tier-3 item waits for Carter. Every "do not build" stays unbuilt unless he reopens it.

---

## 5. The prototype: the Weighing of the Heart (tier 1), Egypt room

**Why this one:**
- The tradition has no continuous living community, and it is the archive's best-documented afterlife rite.
- The museum's Egypt room already holds the Papyrus of Ani (V20), whose judgment vignette is the scene.
- The ch02 chapter opens with it ("A heart on the scales").
- **Alternate, if Carter prefers no judgment scene at all:** the Roman lararium offering (ch13). It is a household
  act with nothing at stake.

**How it works:**
- A button on the V20 case, "Walk through the scene", opens five guided steps.
- Each step:
  - turns the camera to a part of the papyrus's own scene, our rendition, no photographs;
  - shows a short caption, with the believer's lens wording ("Egyptians believed…");
  - carries a "Source" line.

**The steps:**
1. **The Hall of the Two Truths.** The dead person is led in by Anubis. Source: Spell 125, introduction; the Ani
   vignette.
2. **The Declaration of Innocence.** Six to eight of the forty-two "I have not…" statements, in a public-domain
   translation (Budge, 1895, quoted exactly). Each is shown as text. The visitor is never asked to "confess" or
   to choose.
3. **The scales.** Anubis weighs the heart against the feather of Ma'at. The scale shows what the papyrus shows,
   in balance. **No outcome is computed and nothing depends on the visitor.**
4. **Thoth records; Ammit waits.** A plain explanation of what the Egyptians believed happened to a heart that
   failed. Nothing is shown happening to it.
5. **Horus presents Ani to Osiris.** The end, with a link to ch02, to the V20 Vault entry and to its evidence
   section.

**No score, timer or win state.** The visitor cannot fail: the scene is narrated as the papyrus depicts Ani's
judgment, not the visitor's.

**Accessibility:**
- Every step is also plain text in the room's Guide.
- Reduced motion: cuts instead of camera moves.

**Effort:** small to medium, about one session. It reuses the inspector, `english.js` (which already gives V20's
text in English) and the room's camera.

**Checks:**
- A new `tools/verify-rituals.js` checks that every ritual step has a `source`.
- Every tier-1 ritual's `chapter` exists.
- No ritual is tier 3 unless it is listed in `reviews/cleared.json` as approved by Carter.

---

## 6. NEEDS CARTER (summary)
1. Approve this plan, or change it: the technology (§1), the four moveset sheets (§2) and the upgrade order (§3).
2. Roster expansion beyond Greece (§2.4): yes or no, and whether living traditions' gods are ever in scope.
3. The ritual tiers and the table (§4). Every tier-3 entry needs your yes before it is built.
4. The prototype: the Weighing of the Heart (recommended) or the Roman lararium.
5. Mocap: may we use a third-party mocap library, if its licence allows a web game, or hand-key and self-capture
   only?
