# Run 2026-11-08 07:42 UTC — (8) Pilate Stone texture fix built as PR #125

Session: ..01HFWzToLMx8pHYm56xpYrUQ (builder of #125; must NOT review it).

## Done
- **PR #125** (draft), `loop/pilate-stone-texture` `1ca6fe46`, off `main` `3025139b`. Order: `pilate-stone-texture-fix-order.md`.
- The museum model's inscription (`docs/museum/relics.js`, `CAT.v44`) had eight lines of random letter-like marks (the museum's
  general "illustrative marks, never the text" rule). It now shows the letters the stone itself shows, from the published
  diplomatic text CIIP II 1277, nothing restored: `[---]S TIBERIEVM / [----]NTIVS PILATVS / [-----]ECTVS IVDA[--]E / [-----]E[-------]`.
  Four lines, all left to right; two-letter gap in line 3; line 4 only the surviving stroke with its apex. Geometry, materials,
  placement unchanged. The file's header comment records this one exception, on Carter's ruling.
- Source log `sources/v44-pilate-stone.md` gains the CIIP record (opened 2026-11-08). The Heidelberg EDH record was access-denied; said so.
- Named-detail comparison table is in the PR body.
- Honest note: in a headless render of the OLD texture, no mirrored letterforms were visible (random marks). Either way it did
  not read as the real stone reads; now it does.

## Checks (builder)
review-checks `--base origin/main --build` 9/9 PASS (1 WARN: wikipedia-share 25% on the V44 source log, pre-existing, lowered from
33% by this PR); every verify script ok; framework tests 42/42; headless isolated V44 render 1200×900 + 390×844; `museum.html#ch13`
at 390 and 1280, 0 page errors. `docs/museum/*` revalidates (max-age=0), no cache bump needed.

## Found, not changed (for Carter)
1. CIIP: the block is **82 cm high × 65 cm wide**; the model is 0.82 wide × 0.65 high. The order forbids geometry changes.
2. Vault V44 prints line 4 as `[ . . . FE]CIT D[E . . . ]`; CIIP sees one letter (E) and restores `[ref]eci[t]`. Wording follow-up.

## To merge (per item; Carter's 2026-11-07 ruling is the yes for this fix)
Independent review by a session that wrote none of it, GitHub green incl. Lighthouse, then fast-forward.
