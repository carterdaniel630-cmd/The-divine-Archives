# Phase 0 — Content Audit (Mini-Games Layer)

*Branch `claude/mini-games-layer`, cut from `origin/main`. Audit date 2026-09-14.*
*Purpose: measure how much real, sourceable material the existing site holds for trivia,
symbol facts, and clue chains — BEFORE building anything. No game code written yet.*

---

## 1. The base we're building on

This branch is off **`origin/main`**, which is a **different, further-along line** than the
`claude/site-information-updates-...` content branch (that one has 62 chapters on a
different numbering). Per instructions, the mini-games layer builds on **main** and touches
nothing else. Snapshot of main:

| Thing | Count / detail |
|---|---|
| Published chapters | **46** (all `status:"published"`) |
| Eras | 9 · Comparative themes | 4 (`the-flood`→ch01, `creation`→ch46, plus 2 unwritten stubs) |
| Total chapter body text | **~149,300 words** |
| Chapters with an **evidence-honesty** box | **46 / 46** |
| Chapters with a **Symbology & sacred encoding** section | **46 / 46** |
| Chapters with a **captioned SVG plate** (symbol artwork) | **46 / 46** |
| **Era emblems** (SVG) | **9** |
| Bolded key-terms (`<strong>`) across bodies | **5,199** |
| Existing pages | index, eras, era, chapter, traditions, themes, compare, random, search, methodology, about, 404 |
| Content model | `docs/assets/data.js` (index) · `chapters.js` (rendered HTML) · `plates.js` (`PLATES[chNN]` figures + `PLATE_ART`) · `emblems.js` (`EMBLEMS[eraSlug]`) · `search-index.json` |

**Design tokens to match exactly** (`docs/assets/archive.css` `:root`):
- Palette: ground `#140d07`, panel `#1e150d/#251a10`, ink `#cdbb96`, parchment `#e6dabf`,
  ink-dim `#9c8a68`, gold `#c79a54` / bright `#e7c680`, ember `#b26a34`, hairline `#3a2c1a`;
  status good `#7e9e5c`, warn `#c2954e`.
- Fonts (Google Fonts, already imported): **Cinzel** (display), **Cormorant Garamond**
  (headings), **EB Garamond** (body). Aesthetic: candlelit illuminated-manuscript; plates
  are inline SVG drawn in `currentColor`.
- Games will reuse these tokens/fonts only — no new palette.

## 2. The symbol inventory (the click targets)

Every chapter already ships a hand-drawn, **captioned** inline-SVG plate, and every era an
emblem — **55 sacred-symbol artworks** in total, each with descriptive text we can reuse.
Highlights relevant to the requested games:

| Symbol (plate) | Chapter | Game fit |
|---|---|---|
| **Ouroboros** of eternity (with interlaced triangles + ankh) | **ch37 Theosophy** | **Ouroboros / Snake** ✅ symbol already on site |
| Eight-pointed star of Ishtar above a **stepped ziggurat** | **ch03 Mesopotamia** | **Ziggurat Builder / Tetris** ✅ symbol already on site |
| Open **codex** beneath the cross, Alpha & Omega | ch22 Patristic | candidate trigger for **The Reliquary** |
| Ankh + solar disk (Egypt) · Mjölnir (Norse) · Greek lyre/key | ch02 / ch23 / ch08 | candidate triggers for **Archive Chess** (pantheon reskin) |
| Tree of Life / sefirot (Kabbalah), Śrī Yantra (Tantra), mandala (Mahayana), bagua+taiji (China), pentacle (Wicca), khanda (Sikhism), torii (Shinto), vèvè crossroads (Diaspora), Ifá odu (African), Sun Stone (Aztec), Inti (Inca), menorah (Israel)… | many | gallery items + **Seeker's Path** landmarks + Ouroboros "food" symbols |

So all three trigger locations are feasible with **existing** art: (1) a gallery of the 55
symbols, (2) the plate already at the head of each chapter page, (3) easter-egg placements
(e.g., era emblems on era pages, the ambient/index art).

## 3. Per-game material verdict

### 1. The Reliquary (trivia) — **STRONG, build**
- Source material is abundant and uniform: **46/46** chapters have an evidence-honesty
  section (great for "supported / contested / open" style questions), **46/46** have a
  symbology section, 5,199 bolded terms as ready answer keys, and **every chapter has a
  Sources list** — so "each answer links back to its source chapter" is trivially satisfied
  (chapter id → `chapter.html?id=chNN`).
- Filter axes already exist in `data.js`: **era** (9), **tradition/theme** (`kind` +
  `title`), theme tags. No new taxonomy needed.
- Realistic yield: comfortably **150–300+** quality questions without inventing anything
  (roughly 4–8 solid, sourceable questions per chapter). Every question will carry its
  `sourceChapter` and a short verbatim-anchored basis so it's checkable.

### 2. Ouroboros (snake) — **build**
- Trigger symbol **exists**: the ouroboros on the **ch37 Theosophy** plate ("ouroboros"
  appears 3× in text; the serpent-eats-tail form is drawn). Also fits the site's broader
  serpent imagery (41 "serpent" hits).
- "Food = symbols that unlock facts": drawn from the 55-symbol inventory + their captions,
  each fact tagged to its source chapter. Plenty of material.

### 3. Ziggurat Builder (tetris) — **build**
- Trigger symbol **exists**: the **stepped ziggurat** on the **ch03 Mesopotamia** plate;
  ch03 body has real ziggurat mythology ("ziggurat" 10× — the temple-mountain, the
  god's house, Etemenanki/Babel resonance, the divine numbers). Row-clear "facts about
  ziggurat mythology" all sourceable to ch03 (+ ch29/43/44 temple-pyramids for variety).

### 4. Archive Chess — **build (pantheon TBD — needs your pick)**
- No chess content on the site (expected — it's a reskin), so the *game* is generic; the
  *facts* must be real. Pantheon figure density (named gods with facts already in-text):
  - **Egypt (ch02): 14** — Ra, Osiris, Isis, Horus, Set, Thoth, Anubis, Amun, Ptah,
    Hathor, Ma'at, Nut, Geb, Atum
  - **Greek (ch08/ch15): 12** — Zeus, Hera, Poseidon, Athena, Apollo, Artemis, Hades,
    Hermes, Aphrodite, Ares, Demeter, Dionysus
  - **Norse (ch23): 11** — Odin, Thor, Freyja, Loki, Frigg, Baldr, Freyr, Hel, Fenrir (+
    Yggdrasil, Valhalla)
  - **Mesopotamia (ch03): 11** — Marduk, Tiamat, Enlil, Enki, Anu, Ishtar, Ea, Nergal…
- Any of these has more than enough figures + facts for a 6-piece-type reskin with
  "fact on capture." **Recommendation: Egyptian** (richest roster, iconic pieces) or
  **Greek** (clean, widely legible). Suggest **avoiding Mesopotamia here** since its
  ziggurat is already the Tetris trigger (keep one symbol → one game).

### 5. The Seeker's Path (research/exploration) — **STRONG, build last (highest value)**
- The site is dense with **specific, checkable, sourceable facts** ideal for
  "read-the-chapter-to-answer" clues: datable events, named figures, places, and objects
  (e.g., the town that buried its dead beneath the floor → Çatalhöyük/ch42; the law-stele
  king → Hammurabi/ch03; the weighing of the heart → ch02; "Yahweh and his Asherah" → ch07;
  the whirling sema → ch27). Each clue can be built to require actually opening a chapter to
  find the answer, then unlock the next — exactly the traffic-into-content goal.
- Enough material for **multiple multi-step paths** (e.g., one per era, plus themed trails).

## 4. Constraints check
- **Static / localStorage:** fine — all five games are client-side; progress (trivia
  scores, unlocked facts, seeker progress, first-visit hint dismissal) → `localStorage`,
  wrapped in try/catch.
- **Style match:** tokens + fonts captured above; games inherit `archive.css`.
- **Never invent facts:** every question/fact/clue will carry a `sourceChapter` id and be
  drawn from committed chapter text; a build script can later verify each answer's basis
  string still exists in that chapter. Slots without real material are skipped.
- **Accessibility of the hidden trigger:** the dormant symbol becomes a real activator —
  `role="button"` (or a `<button>` wrapper), `tabindex="0"`, an accessible name
  ("Play the Ouroboros game hidden in this symbol"), Enter/Space activation, visible focus
  ring, and `aria-expanded`; the activated game is a focus-trapped dialog with a labelled
  close and Esc; `prefers-reduced-motion` disables the shimmer. Screen-reader users get the
  same discovery as the hover-shimmer gives sighted users.
- **Mobile-first:** Snake = swipe + on-screen d-pad; Tetris = tap-rotate / swipe-move /
  swipe-down; Chess = tap-select then tap-destination; all games responsive to ~360px.

## 5. Open questions for Carter (before Phase 1)
1. **Archive Chess pantheon** — Egyptian (recommended) or Greek/Norse?
2. **Easter-egg locations** — which non-gallery, non-chapter spots (e.g., era emblems on
   `era.html`, the `index.html` hero art, the `random.html` page)? I can propose 3.
3. **Trivia scope** — target size for launch (e.g., ~120 curated vs ~250+)? All will be
   sourced regardless; this is just how many to seat in Phase 2.
4. **File home** — plan is `docs/symbols.html` (gallery) + `docs/assets/games/*.js|css` +
   `docs/assets/games/data/*.json` (fact/clue banks), all shipping with the static site;
   planning docs stay in `mini-games/` (not shipped). OK?

## 6. Verdict
All five games are supported by **real, already-sourced** site content, and the two most
symbol-specific games (Ouroboros, Ziggurat) map onto artwork that is **already on the
site**. Recommend proceeding to **Phase 1** (Symbols gallery page + the shared, accessible
click-to-expand component) once the four questions above are settled — pending your sign-off.
