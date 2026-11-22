# Source log — museum statues in their rooms (Shiva · Zeus)

Change: `docs/museum/statues.js`, `docs/museum/app.js`, `tools/build-museum.js` (Directory line),
new mesh `docs/assets/rotunda/zeus.glb`. Built 2026-11-15 by the build loop on `loop/statues-to-rooms`,
from Carter's change of plans `handoff/order-2026-11-09-rotunda-statue-change.md` and
`handoff/correction-2026-11-09-zeus-figure-exists.md`. Merge is per item (sacred figures, new placement).

## What the loop did, and did not do
- Removed the three pedestals from the 3D Rotunda (order item 1). Socrates and Isis are not placed
  anywhere (item 4); their pages (`docs/rotunda/`) are not changed.
- Shiva: the same mesh, level-of-detail treatment and card as before (item 2), now in the room
  **Global Hinduism & the Guru Movements** (ch83). Zeus (item 3) in **Classical Greece** (ch15).
  The order names "the Hinduism room" and "the Greek room"; the museum has no rooms with those titles.
  The loop chose by date, because the museum is arranged by time: the Artemision bronze (c. 460–450 BCE)
  belongs to the Axial Age's Classical Greece; the Murudeshwar statue is modern. The other candidates
  (the rooms where the Pantheon hangs each figure: Early Greece ch08 for Zeus, Tantra ch24 for Shiva;
  or The Upanishads & the Hindu Synthesis ch69) are a one-line change in `STATUES` if Carter prefers.
- Zeus mesh: the glb embedded in atlas's staged figure page, extracted byte for byte (1,957,432 bytes,
  three meshes: the scan, the drape, the perizoma; 140,697 triangles). The staged page matched atlas's
  fingerprint (MD5 `598d6edabc0bf9e368535d18b9a6fc87`). The museum dresses it in the same single dark
  bronze it gives Shiva, as atlas's page says it wears "the approved Shiva recipe".
- No new fact was added beyond the figure's own plaque. The Zeus card text is condensed from it.

## Sources
- **Zeus.** "Zeus or Poseidon from the Artemision", SMK – National Gallery of Denmark (@smkmuseum),
  Sketchfab, https://sketchfab.com/models/d4876aa609304682945145debedfc77e — **opened 2026-11-15**:
  publisher SMK, licence CC0 1.0, inventory KAS2100 (plaster cast in the Royal Cast Collection),
  original dated c. 460–450 BCE, a scan of the plaster cast, not of the bronze. Original in the National
  Archaeological Museum, Athens, as atlas's plaque states (not re-opened in this run). The Zeus/Poseidon
  identification is flagged as open on the card, as on the plaque.
- **Shiva.** Unchanged from `sources/rotunda-tray1.md` (Boris3D Studio, CC BY 3.0).
