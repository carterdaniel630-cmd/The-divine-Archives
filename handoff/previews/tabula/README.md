# Tabula — for Claude

Carter playtest-approved 2026-10-18. Rebuild these into Archive format.

Files:
- tabula.html — 3D relic preview (Roman board, 24 points, bone vs horn pieces)
- tabula-game.html — playable game vs AI, same visual standard as relic

Both reference ./three.min.js (UMD, r150+) relatively. The library wasn't pushed
(size limits) — source it from the repo vendor or fetch UMD build. The standalone
versions (three.js inlined) are with atlas on the Muse side if needed.

Visual standard: relic is the floor. See build-program-approved.md item #5.
