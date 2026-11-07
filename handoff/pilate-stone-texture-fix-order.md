# Fix order — Pilate Stone inscription texture (Carter's ruling, 2026-11-07)

**The defect (verified atlas-side, 2026-11-07, during the Game-Asset Pack One conversion):** the Pilate Stone model's inscription texture, as built in the Archives' own source, has its **lower lines mirror-reversed** — the lettering reads backwards, as if seen in a mirror. This was confirmed in the untouched source render; it is NOT a conversion error from the pack work. The pack ships the model as built, with the quirk disclosed in its manifest and listing.

**Carter's ruling (2026-11-07, widget tap):** fix the site build. Under the Accuracy Floor, a relic's inscription must read as the real stone reads.

**The fix:**
1. Correct the inscription texture so every line reads in its proper direction, matching the real Pilate Stone inscription as published (photographs and transcription of the Caesarea stone).
2. Change nothing else — geometry, materials, placement, and the exhibit around it stay as they are.
3. Verify by named-detail comparison against the real inscription before calling it done, and state the comparison in the PR.
4. Queue discipline: a small named fix; rides merge-on-green in queue order. It does not jump the Foundation Kit or the standing pile.

**Atlas-side follow-up (not the loop's job):** once the site source is fixed, atlas re-checks the Game-Asset Pack One listing disclosure, since the pack's source will have changed.
