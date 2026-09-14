# The Divine Archives — Mini-Games Layer (CONTEXT / spec of record)

> **Provenance note.** Carter referred to a file `CONTEXT-mini-games-layer.md` "shared
> earlier." It was not present anywhere in this session's repo, scratchpad, or remote
> (searched). This document therefore transcribes the specification **as Carter gave it
> directly in-chat** on 2026-09-14, and stands as the spec of record for the
> `claude/mini-games-layer` branch. If the original doc surfaces, reconcile against it.

## Branch & isolation
- Branch: **`claude/mini-games-layer`**, cut from **`origin/main`**.
- Isolated track. **Do not touch** the site-overhaul or content-layer work on other
  branches. No merge to `main`, no deploy, until Carter approves the final result.
- No step is done without a **verifiable committed file**. Stop and report after each
  build step for approval before continuing.

## Concept — games hidden in the symbol artwork
Games are **not** a separate games page/menu. They live **inside the site's existing
sacred-symbol artwork** (the per-chapter SVG "plates" and era emblems). A visitor
clicks/taps a symbol image; it **expands in place** into a game themed to that symbol;
closing the game returns it to normal artwork.

**Discoverability:**
- Subtle **glow/shimmer on hover** so people notice a symbol is interactive.
- A **one-time, dismissible hint** on first visit: some symbols respond to a touch.
  (Dismissal stored in `localStorage`.)

**Trigger locations (three):**
1. A dedicated **Symbols gallery page** showing all the site's sacred symbols.
2. **Embedded on the relevant chapter pages** (the plate at the head of a chapter).
3. A few **hidden easter eggs** scattered elsewhere on the site.

## The games (each themed to its symbol)
1. **The Reliquary** — trivia. Questions pulled from **real content in the chapters**,
   filterable by **era / tradition / theme**. Each answer **links back to its source
   chapter**.
2. **Ouroboros** — Snake, reskinned. The snake is a serpent forming the ouroboros as it
   grows; food items are symbols that **unlock facts**.
3. **Ziggurat Builder** — Tetris, reskinned. Blocks are stone/mudbrick courses; clearing
   rows builds up a ziggurat and **unlocks facts about ziggurat mythology**.
4. **Archive Chess** — Chess, reskinned. Pieces reskinned to a **pantheon/tradition from
   the site**; facts about captured pieces' figures shown as you play.
5. **The Seeker's Path** — research/exploration. A chain of **riddle-style clues built
   from real facts in specific chapters**; the player must actually **go read the chapter**
   to find the answer before the next clue unlocks. **This one matters most** — it should
   drive real traffic into the actual content.

## Hard requirements
- **No backend, no login.** Static site only, same deploy pipeline. Saved progress →
  `localStorage` only.
- **Visual style must match the existing site exactly** — same colors, fonts, aesthetic.
  Do not invent a new style. (Tokens captured in the Phase 0 audit.)
- **Every fact, trivia answer, or clue must come from real, sourceable content already on
  the site. Never invent facts.** If a chapter lacks enough real material for a slot,
  **skip it**.
- The **hidden-symbol interaction must be fully keyboard-accessible and screen-reader
  friendly**, even though it doesn't look like a normal button.
- **Mobile-first.** Touch controls for Snake/Tetris; tap-to-move for Chess.

## Build order (stop for approval after each)
0. **Content audit** across all chapters — report before building anything.
   → `mini-games/PHASE-0-CONTENT-AUDIT.md`
1. **Symbols gallery page + shared "click-to-expand" component** (the accessible
   dormant→activated mechanism) — built first.
2. **The Reliquary** (trivia).
3. **Ouroboros** (snake).
4. **Ziggurat Builder** (tetris).
5. **Archive Chess** (chess).
6. **The Seeker's Path** (last).

## Governance
- Real sourcing only; contested claims flagged, not resolved (mirrors the archive's own
  standard). Trivia answers and clues cite the chapter they come from.
- Accessibility and mobile are acceptance criteria for every step, not afterthoughts.
- Nothing merges to `main` or deploys without Carter's explicit sign-off.
