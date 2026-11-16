# Fix order — Pilate Stone museum model sits on its side (staged 2026-11-16 on Carter's go)

**Status:** STAGED by atlas 2026-11-16 on Carter's go. Queued for Claude's build loop on staging/ready-line.

**The defect (found by Claude's V44 check, 2026-11-14; reported, not fixed in any report through 2026-11-15 11:14 ET):** the museum 3D model of the Pilate Stone is oriented on its side against the published dimensions in CIIP II 1277 — 82 × 65 × 20 (width × height × depth). As built, the stone does not sit the way the real stone sits, so the inscription face does not present upright at its true proportions.

**This is a separate defect from the two already in hand:**
- PR #142 — the Vault V44 page's line-4 wording honesty fix ([…]E[…], only the letter E survives). That is page text, not the model. Do not touch it in this fix.
- The 2026-11-07 texture order — the model's lower inscription lines read mirror-reversed. That order stands on its own; this fix must not undo it, and the verification below re-checks reading direction as well as orientation.

**The fix:**
1. Re-orient the museum model so it matches the published proportions: the 82 side horizontal, the 65 side vertical, the 20 depth front-to-back — the stone upright as photographed in the Israel Museum, inscription lines running horizontally.
2. Change nothing else — geometry, materials, texture, placement, and the exhibit around it stay as they are, apart from the rotation itself.
3. Verify by named-detail comparison against photographs of the real stone before calling it done, and state the comparison in the PR: proportions (wider than tall, shallow depth), inscription lines horizontal and reading in the proper direction, line 4 consistent with the honesty wording in PR #142.
4. Phone check at Carter's Galaxy size, per THE STANDARD and the Every-Screen rule.

**Gate:** this is a relic — Carter's per-item yes remains the last gate before merge, same as the V44 wording fix. Build and review may proceed in queue order; the merge waits on his word.

**Atlas-side follow-up (not the loop's job):** once the model is fixed on the site, atlas re-checks the Game-Asset Pack One ("Proven Seven") listing disclosure, since the pack's Pilate Stone source will have changed — same follow-up already owed for the texture fix.
