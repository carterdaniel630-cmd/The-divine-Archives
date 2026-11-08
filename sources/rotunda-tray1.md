# Source log — The Rotunda Circle, Tray 1 (Socrates · Shiva · Isis)

Pages: `docs/rotunda/index.html`, `docs/rotunda/socrates.html`, `docs/rotunda/shiva.html`,
`docs/rotunda/isis.html`. Built 2026-11-08 by the build loop from the finished figure pages that
atlas staged on `staging/ready-line` (`handoff/rotunda/tray1/`, see its `MANIFEST.md` and
`handoff/atlas-inputs-2026-11-08-full-files.md`). Spec: `handoff/rotunda-tray1-spec.md`.

## What the loop did, and did not do
- The figures, their finishes and their plaque texts are atlas's work. The loop checked each staged
  page against atlas's MD5 fingerprint (all three match: isis `4ff6f86e…`, shiva `8c92d4fa…`,
  socrates `39a1fc16…`), then split the embedded payloads out unchanged (three.js r160 and three
  example modules into `docs/assets/rotunda/lib/`, each mesh into `docs/assets/rotunda/<name>.glb`)
  so that no file passes the site's 2 MB budget. The viewer code is atlas's, except that it now
  fetches those files instead of decoding base64.
- Added to every statue page: a site bar (home, the Rotunda Circle, the Pantheon), the mandatory
  "Recently added · pending full review" tag, a description and canonical link.
- Socrates only: the page let no one zoom it (`user-scalable=no`); that is removed for accessibility.
  Its two headline labels said "From a Real Scan" although only the head is scanned; they now say
  "Head From a Real Scan" (and "…, Body Made for It" on the plaque tag). The plaque text itself,
  which already said so, is unchanged.
- No plaque fact was added or researched by the loop. The licence and source statements below are
  as the plaques and MANIFEST give them; they were not re-opened on the web in this run.

## Sources and licences as stated on the plaques
- **Socrates.** Head: scan of the Socrates portrait held by SMK (Statens Museum for Kunst, the
  National Gallery of Denmark, Copenhagen), made with Scan the World, shared openly; print-ready file
  prepared by Kvant_64ru, CC BY. Body: made for this statue (no image of Socrates' body survives).
- **Shiva.** "Statue of Shiva in the lotus position at Murudeshwar" by Boris3D Studio, CC BY 3.0, via
  Thingiverse (thing 3689465 per MANIFEST). The statue is a modern temple monument at Murudeshwar,
  Karnataka (inaugurated 2006 per MANIFEST). Finish (dark bronze) is the Archives' own.
- **Isis.** A modelled rendition, not a scan. Face: Roman bronze bust of Isis, 2nd c. CE, Mount
  Holyoke College Art Museum, MH 1965.10.C.G; photogrammetry by Laura Shea; model by 3DWP, CC BY 4.0.
  Everything below the neck is the Archives' own modelling.
- three.js and its example modules: MIT (`docs/assets/rotunda/lib/LICENSE.txt`).

## Gaps and discrepancies, flagged rather than papered over
1. **Socrates source name.** MANIFEST says the head is "photogrammetry of the Uffizi Socrates"; the
   plaque (and atlas's continuity pack: "Copenhagen's museum scan of the canonical portrait") say SMK,
   Copenhagen. The page follows the plaque. Atlas to confirm which is right.
2. **Meshes differ from the MANIFEST's named files.** Isis's embedded mesh matches `statue.glb`
   (MD5 `eece1275…`). Shiva's embedded mesh is 1,290,736 bytes (MD5 `46915b7c…`), not the
   1,861,084-byte `shiva-scan-noload.glb` MANIFEST names; Socrates' is 1,443,660 bytes
   (MD5 `9c46a04b…`), neither the rich (15.3 MB) nor light (2.8 MB) file named. The pages themselves
   are the fingerprinted files of record, so their meshes are used. Atlas to confirm these are the
   intended finished meshes.
3. **Isis plaque, two lines for the reviewer to check against the record:** "of all the old gods she
   was the last still worshipped, at Philae, into the sixth century" (the end of active cult at Philae
   before Justinian's closure is debated in the scholarship), and "her temples stood from Britain to
   Mesopotamia" (the Mesopotamian end is not sourced on the page). Not changed by the loop.
4. **Tray verdicts.** The conveyor rule is that a tray moves when all three figures have Carter's
   verdict. Shiva is recorded as approved; Socrates' source was approved and Isis was "awaiting
   verdict" in the 2026-10-28 records. These pages go live only on Carter's per-item yes.
