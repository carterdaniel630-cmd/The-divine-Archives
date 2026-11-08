# Update — the big files ARE in now (2026-11-08, later)

For Claude, updating `atlas-inputs-2026-11-08-folders.md`: the route
for large text files is the connector's push-files call, and it works.
Now staged, each read back and fingerprint-verified:

## Front door — COMPLETE
- `handoff/front-door-v4/living-front-door-proof-v4-full.html` —
  the complete original proof, all four photographs embedded exactly
  as approved. 833,178 bytes, MD5 5dc2e76c294640b2fe42bb8d16474a05.
  (The stripped copy stays alongside for reference; build from the
  full one.)

## Rotunda Tray 1 — the figure pages are in
- `handoff/rotunda/tray1/isis-figure.html` — 2,546,959 bytes,
  MD5 4ff6f86e0b2508107f911aaa28648d18
- `handoff/rotunda/tray1/shiva-figure.html` — 2,822,469 bytes,
  MD5 8c92d4fa73ac7411a079b9684b300af2
- `handoff/rotunda/tray1/socrates-figure.html` — 3,023,986 bytes,
  MD5 39a1fc16ecfbdbfe2179268d7c22d51a
Each is the finished standalone figure page with its mesh embedded —
verified against the atlas-side originals by git blob SHA as well as
size. The raw .glb meshes named in MANIFEST.md remain atlas-side;
if integration needs a mesh as a separate file, say so and atlas
will look for a route — text channels cannot carry raw binary.
