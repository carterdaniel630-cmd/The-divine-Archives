# The hidden arcade, more easter eggs, and the next Pilgrimage sites (plan, not built)

**Status (2026-10-06, later):** Carter said "carry on", so §1 and §2 are being built with the recommended options, on
the preview first. The message is still a placeholder, "THE ARCHIVE REMEMBERS EVERYTHING" (one word per gold
sign), until Carter writes his own; it is one line at the top of `docs/museum/secret.js`. The Seeker's Path cabinet
gets a plain floor. §3 has been replaced by one egg per chapter (`plans/easter-eggs.md`), and the portal layout is in
`plans/pilgrimage-sites.md`.

**Carter's brief (2026-10-06):**
- Hide a message in the symbols on the hallway walls. Tapping the right symbols in sequence spells out a message
  about the Archives, then opens a hidden room.
- The hidden room is the arcade, holding all the game kiosks.
- Its scenery is "a little piece of everything" in the Archives.
- Map out more easter eggs.
- Discuss which places to build next, the way the Great Pyramid was built.

---

## 1. The secret in the symbol walls

### How it works for a visitor

1. **The clue.** Now and then, one falling sign on a hallway's symbol wall glows **gold** instead of white. It
   drifts down like the others and flips away again after a few seconds. Gold signs are rare: about one every
   20–30 seconds on each wall. They are noticeable only to someone who stops and watches.
2. **The sequence.** Tapping a gold sign before it fades makes it hold still and stay lit. It also adds one letter
   to a faint line of English writing along the bottom of the wall. The letters build up in order.
3. **A miss.** If a gold sign fades untapped, nothing is lost: the next one carries on from where you were.
   Tapping a white sign resets the line, so tapping at random won't work.
4. **The message.** After the last letter, every column on the wall stops falling. For two or three seconds the
   whole wall reads out the message in glowing white English letters. Then it falls again.
5. **The door.** The wall splits down the middle and opens into a **golden archway**, the same kind of portal as
   the Great Pyramid's. Walking through it leads to the hidden arcade.
6. **Coming back.** After the first time, the browser remembers. On that phone the archway stays faintly outlined
   on the wall, so a returning visitor can walk straight in.

### Which wall

**Recommended:** use one wall, the first one a visitor reaches: the **Bronze Age hallway**. It is close to the
entrance, so more people will find it.

The alternative is one gold letter on each era's wall, collected across the whole museum. That is a bigger hunt,
but it can't work until all nine walls are built. It could be a second, harder secret later.

### The message: Carter writes it

It is spelled in English capitals, never in the ancient scripts. That keeps the rule that we never compose text in
a sacred or ancient script. Up to about 30 letters fits the wall, and every letter is one gold tap, so shorter
means quicker to find. Some starting points:

- THE ARCHIVE REMEMBERS EVERYTHING
- EVERY TRADITION LEFT A DOOR
- WHAT IS KEPT IS NEVER LOST
- ALL THE GODS PLAY HERE (a playful lead-in to the arcade)

**One more way to tap the sequence:** a 30-letter message means 30 gold taps, which may be too many. Each gold tap
could instead give a **whole word**: about 5 taps for a short sentence. **Recommended: one word per tap.**

### How it is built

- The wall is already drawn by a shader whose motion is fixed by the clock. The page can therefore work out
  exactly which sign is under a finger at any moment. No extra 3D objects are needed.
- The gold sign is the same sign drawn in another colour, so there is no new texture.
- The English letters for the message come from a small extra strip in the existing atlas, using a plain open
  font (OFL).
- The museum's phone budget is unchanged until the door opens.

### Accessibility and fairness

- The games stay where they are today: on the Symbols page and on the kiosks in their own chapter rooms. The
  arcade is a bonus, not the only way to play.
- Keyboard players can move between gold signs with Tab while one is on screen.
- Visitors with "View motion off" get the same puzzle.
- A small hint line goes in the museum's guide panel ("Some signs on the walls are not like the others"), so the
  secret can be found without a walkthrough.

---

## 2. The hidden arcade

### Where it lives

**Recommended:** build the arcade as its **own small scene** behind the portal, like the Great Pyramid.

- It doesn't need to fit inside the museum's floor plan.
- It doesn't add to the museum's phone budget: the museum unloads when you step through.
- It has its own address, so it is never linked from menus and stays hidden.

The other option is a room carved behind the Bronze Age hallway. That is harder to fit, and it adds to an area
already near its phone budget.

### What's in it: all 12 game cabinets

Each game gets a **cabinet**: an upright arcade machine with the game's own title art on the marquee and a live
"attract screen". Each cabinet stands in a setting from the game's chapter:

| Game | Chapter | Cabinet setting |
|---|---|---|
| Archive Chess | ch02 Egypt | limestone, with a lamp |
| Ziggurat Builder | ch03 Mesopotamia | mud brick |
| The Excavation | ch04 Indus | fired brick |
| Antithesis | ch06 Zoroastrianism | a fire altar's glow |
| Divine Casualties | ch08 Early Greece | ashlar and a tripod brazier |
| Dominion of the Ancients | ch13 Rome | mosaic |
| The Reliquary | ch22 Patristic Christianity | candlelight |
| The Labyrinth | ch29 Maya | stone, with a jungle wall |
| Ouroboros | ch37 Theosophy | a brass fitting with the serpent seal |
| The Seeker's Path | ch40 African Diaspora Religions | a vèvè-patterned floor; vèvè are ritual symbols, so this needs a sensitivity check, see below |
| The Tomb Robber | ch43 Aztec | a basalt plinth |
| The Firmament | ch46 Creation & the First Order | under the planetarium dome |

Tapping a cabinet opens the game, just as the kiosks do now.

A **high-score board** on the back wall keeps your own best scores. They are stored only on your phone: no
accounts and nothing sent anywhere.

### The scenery: a little piece of everything

The room is a round hall, like a small Rotunda, built from parts the Archives already has:

- **Floor:** wedge-shaped segments, one for each era, in that era's period floor.
- **Ceiling:** the planetarium sky.
- **Walls:** short runs of every era's symbol wall, all falling at once, with no gold signs.
- **Light:** one of each kind of flame fitting (saucer lamp, terracotta lamp, lampstand and brazier). The game
  screens add their own light.
- **Centre:** a shallow pool with a little of the water, plants and animals from the museum's grounds.
- **Display:** a ring of small Pantheon plaques, one per era, all taken from figures you have already cleared.

**Kept out:**
- no Vault objects and no sacred objects, because an arcade is the wrong setting for them;
- none of the signs held back on sensitivity grounds.

### Phone budget

The arcade is held to the same budget as a museum room: no more than about 100 draw calls on a phone. With 12
lit screens that is tight. The cabinets will share one material, and their screens will be drawn as a single
batch.

### What needs checking for sensitivity

- The Seeker's Path cabinet: decide whether vèvè, the ritual symbols of Haitian Vodou, belong in an arcade setting.
  **Recommended: no.** That cabinet would sit on a plain floor.
- The Firmament: its sky lore is already sourced, so no change is needed.

---

## 3. Other easter eggs (a map to choose from)

Each one leads to something **true**: a real, sourced fact from a chapter, never invented lore. None needs new
chapter content.

| # | Where | What you do | What you find |
|---|---|---|---|
| 1 | The Great Pyramid, the Queen's Chamber | Kneel at the mouth of the southern shaft for a few seconds | A slow view climbing the shaft to the small blocking stone with copper pins, as the robot surveys found it. It uses only the facts and sources already on the site's info points (Gantenbrink's Upuaut 2, 1993; the Djedi survey, Hawass et al. 2011) |
| 2 | The Theosophy room (ch37) | Walk one full circle around the room's centre | The serpent swallows its own tail and opens a card on the Theosophical Society's seal, where the ouroboros sits beside other signs (from ch37) |
| 3 | The planetarium | Tap Venus | A card on Venus as the Maya, Aztec and Mesopotamian skies read it (taken from the planetarium's existing, sourced sky lore) |
| 4 | The Labyrinth room (ch29) or a later Chartres room | Walk the floor pattern to its centre | A card on labyrinths as walking prayer, and the "Theseus" confusion |
| 5 | The Archives at night | Visit when it is after midnight on your phone | The corridors' lamps burn lower and the stars come out over the Rotunda; no facts change |
| 6 | All 12 games | Finish each game once | Your cabinet in the arcade gets a gold marquee; when all 12 are gold, a thirteenth "cabinet" lights up and reads out the Archives' full era list |
| 7 | The footer's visitor counter | Tap it 7 times | A thank-you card with the site's real visitor total |
| 8 | Any chapter's last line | Tap the closing ornament | It turns into that chapter's era sign and links straight to that era's hallway in the museum |

**Recommended first wave:** 1, 2 and 6. #1 and #2 are pure fact. #6 rewards players and fits the arcade.

---

## 4. The next Pilgrimage sites

The full list of 72 is in `plans/pilgrimage-sites.md`. These are the strongest next candidates, chosen because
each holds a Vault object found or kept there and has good published surveys:

| Site | Why | Main cost or risk |
|---|---|---|
| **Qumran caves** (already queued next) | 4 direct Vault objects: the Dead Sea Scrolls, the Great Isaiah Scroll, the Copper Scroll and Enoch. It also builds a reusable cave builder | It is in the West Bank: wording must stay neutral, as the plan already says |
| **Göbekli Tepe** | Its carved pillars (V60) stand in place. It is the oldest monumental site in the Archives, and outdoors | Many pillars, so the carving detail needs care on phones |
| **Mogao Cave 17 (the "Library Cave")** | Where the Diamond Sutra (V30) was found. A small cave, so it is cheap, and it reuses the cave builder | The wall paintings are our own renderings. The story of how the manuscripts left China is sensitive and needs neutral wording |
| **Newgrange** | The winter-solstice sunrise down the passage is a ready-made moment | No Vault object |
| **Lindisfarne Priory** | Where the Lindisfarne Gospels (V42) were made | Mostly ruins: needs a labelled reconstruction |
| **Yinxu (Anyang)** | Where the oracle bones (V55) were found | Mostly pits and foundations: less to walk |

**Recommended order:** Qumran → Göbekli Tepe → Mogao Cave 17, one at a time, each sent to the preview first.

**Still open from the Pilgrimage plan:**
- the labels on sensitive sites;
- whether to show Notre-Dame as restored, as it was before the fire, or both;
- the Benin palace;
- the extra Great Pyramid objects for the Vault.

---

## Needs Carter's decision

1. Build the secret wall and the hidden arcade as described: on the Bronze Age wall, with the arcade as its own
   scene behind a golden archway?
2. Write the message, or pick one above. One word per gold tap (recommended) or one letter per tap?
3. The Seeker's Path cabinet: plain floor instead of vèvè (recommended)?
4. Which other easter eggs to build (recommended: 1, 2 and 6)?
5. Next Pilgrimage site order: Qumran, then Göbekli Tepe, then Mogao Cave 17?
