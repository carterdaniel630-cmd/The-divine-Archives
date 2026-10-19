# Armory entry — Awithlaknannai ("Fighting Serpents")

## What it is
A fully playable 3D reconstruction of the Zuni (A:shiwi) board game documented by
Stewart Culin in 1907 — two lines of stones ("serpents") fighting across a long,
narrow board. Self-contained single HTML file: Three.js vendored locally, zero CDN.
Playable against a simple computer opponent or pass-and-play, with legal-move
highlighting, compulsory-capture enforcement, multi-leap chains, undo, a move log,
and a built-in tutorial.

## What it's based on
- **Archive:** the *Native North American* chapter of The Divine Archives
  (getconexto.com/chapters/ch62.html).
- **Ethnography:** Stewart Culin, *Games of the North American Indians*, vol. 2:
  *Games of Skill* (1907) — the short board drawn for Culin by Zuni consultant
  Nick Graham; R. C. Bell, *Board and Table Games from Many Civilizations* (1969)
  and *The Boardgame Book* (1983) — Bell coined the English name "fighting serpents";
  board-shape correction after Culin's diagram via the Cyningstan reconstruction
  notes (2014): the outer rows are joined by lines so three lines meet at each point
  (Murray's widely-copied diagram omits these lines and plays wrong).
- **Respect framing:** presented as a living people's *game* from 1907 sources, not
  a sacred object; sources named on the page; gaps in the record labelled as gaps.

## Board layout (verified against sources)
- 25 intersection points: three rows of 8 / 9 / 8 points, joined by leaning
  diagonals; outer rows joined end-to-end; a curve closes each end of the board.
  Stones sit on the points and travel along the lines (54 playable edges).
- Pieces: Culin's pottery discs — turquoise with a pierced top vs plain clay red,
  matching his "plain or hole in the centre" description.

## Rules (as documented; conjectural points labelled on the page)
- Move one stone along a line to a free neighbouring point, **or** leap over an
  adjacent enemy stone to the free point just beyond it, following the board's lines.
- **Captures are compulsory**; a stone that can keep leaping **must** keep leaping
  (player chooses the path). Leaps may change direction between jumps.
- The only empty point at setup is the centre, so the first move walks into a
  capture — the documented first-player disadvantage emerges naturally.
- Win by taking every enemy stone, or by leaving the opponent with no legal move
  (a player who cannot move loses). Culin never fully recorded the win condition;
  this follows the standard reconstruction. 80 capture-less half-moves ends the
  game on stone count (draw if equal).
- Two setups offered: **6 stones each** (modern teaching set, the default) and
  **12 each** (Culin's documented count: home row + right half of the middle row).

## Key details
- Desert palette: sandstone slab with the board engraved as carved grooves,
  turquoise vs clay-red pottery discs, wooden table, warm lamp spotlight plus a
  flickering candle — the archive's candlelit look.
- Interaction: tap a stone to see gold-ringed legal moves; leaps arc through the
  air; captured stones slide off to side trays; drag to orbit, wheel to zoom;
  subtle synthesized wood-knock sounds (mutable); status line, captured counts,
  move log; New game / Undo / Opponent toggle / Pieces toggle / How-to-play overlay.
- Computer opponent: 3-ply alpha-beta with capture ordering and centre control —
  competent, not brutal.
- Engine verified: 20/20 node unit tests pass (topology, both setups, the forced
  opening capture, compulsory captures, multi-leap chains, termination); full file
  executes error-free under headless DOM/THREE stubs.

## For Claude (rebuild notes)
- File: `~/workspace/your_files/awithlaknannai/awithlaknannai.html` (~716 KB,
  three.min.js inlined). NOT staged to GitHub per instructions — awaiting handoff.
- The rules engine at the top of the script is pure, DOM-free logic — reusable
  as-is for the repo build. Scene code follows the tabula conventions.
- Open question for Claude's rebuild: the end curves are decorative here (the end
  points are already joined by diagonals); confirm against Culin's diagram whether
  they should be traversable lines.
