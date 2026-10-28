# Handoff prep — Treaty of Kadesh: place it in the Egypt room

Status: PREPPED in chat. Carter approved the relic 2026-10-17 (relic catch-up four) and approved this placement — the Egypt room — 2026-10-28. NOT staged to GitHub yet; ships only on Carter's go.
Museum state measured from live main @ 68b7b03 (2026-10-28). Source copies in `./research/`.

## The decision
The Treaty of Kadesh stands in the **Egypt room** (room id `ch02`, Bronze Age wing `02-bronze-age`) as a standing exhibit, with examine mode, alongside the room's current exhibits.

## What already exists
- The approved preview, on staging: `handoff/previews/treaty-of-kadesh.html` and `handoff/previews/treaty-of-kadesh/index.html`. Rebuilt to the Relic Standard as a preview (real cuneiform, raking light, sources verified at that time, reported 2026-10-19). Per the standing rule it is a starting point — Claude rebuilds it better in the museum's own format.
- The preview's interaction design is worth keeping: drag to turn the tablet in your hand, front/back, zoom, and tap a line of script to read what that part of the treaty says, in plain words.

## Verified facts about the museum today (so the build starts from truth)
- The Treaty is **not a Vault item**: it has no V-number and appears nowhere in `docs/assets/vault-data.js`, the museum catalogue `docs/museum/relics.js`, or `docs/museum/manifest.json`. It is a standalone relic; this item gives it its museum registration for the first time.
- Egypt room today: homeVault exhibits **v20** Papyrus of Ani, **v34** Pyramid Texts of Unas, **v43** Merneptah Stele, **v53** Rosetta Stone; homeFigs ra, osiris, isis, horus, anubis, thoth, maat, hathor, set. Room exhibits are built by `CAT.<key>` builder functions in `docs/museum/relics.js`.
- `docs/museum/manifest.json` is **generated** ("Generated from the archive's data files; do not edit by hand", build-museum.js). Register the Treaty through the generator's source data — never hand-edit the manifest.

## The work
1. **Rebuild in the museum's catalogue format.** A `CAT` builder in `docs/museum/relics.js`, to the Relic Standard (the Ring/Shiva floor applies: it must look like the thing, hold up at close zoom, and read true on a phone). True 3D, holdable and freely rotatable in examine mode. Keep the preview's interactions: turn front/back, zoom, tap-a-line clause readings.
2. **Register it in the Egypt room** through the manifest generator's data path, so it stands in the room with v20/v34/v43/v53 and appears wherever room exhibits are listed.
3. **The label — honest, per the Content Truth Policy.** Substance: a clay record of the peace between Egypt and Hatti, about 1259 BCE (Ramesses II and Hattusili III) — the oldest surviving peace treaty. The original was written on a **silver tablet, which is lost**; the text survives in Akkadian cuneiform copies from Hattusa and in Egyptian hieroglyphic carvings on temple walls. Treaty clauses are given **in plain words, never presented as verbatim**. The inscription on the model is representative cuneiform, not a verbatim copy of the real text — the label must say so plainly, in the museum's honest-rendition manner.
4. **Re-verify every claim on the label against sources during the rebuild.** Do not inherit the preview's claims unchecked (it mentions, among other things, surviving-copy locations, a fragment found at Hattusa in 2026, and a replica at the United Nations — each must check out or come off).
5. **Rotation check at multiple angles** (standing rule): tablet and stand stay true while the visitor turns it — no drift, tilt, or stand movement.
6. **Phone check** on a Galaxy-class screen: label readable, examine mode smooth, existing DPR/performance bounds respected.

## Out of scope
- The Egypt room's game label ("Archive Chess" vs Senet) — a separate loop fix already staged elsewhere. Do not touch it in this item.
- The room's pending/review state and the Egypt chapter text — not this item.

## Acceptance
- The Treaty stands in the Egypt room and opens in examine mode: rotate, zoom, front/back, and clause taps all work, on desktop and in headless phone runs.
- Label truthful and source-verified; the representative-inscription honesty note present.
- Fresh independent review, 0 findings; then the finished piece comes to Carter for his yes before any merge (per-item rule stands).
