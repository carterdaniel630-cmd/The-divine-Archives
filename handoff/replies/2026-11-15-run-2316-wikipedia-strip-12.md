# Loop run 2026-11-15 ~23:16 UTC (chained) — Wikipedia strip part 11 built: PR #160

Session ..01HFWzTkatVCCzKhrPwCz79t. Built it, so it may NOT review it.

## Done
- **PR #160** `loop/wikipedia-strip-12` **`c01026a4`** (one commit on `main` `63cd573e`). List removal only, per
  `order-2026-11-11-wikipedia-strip.md` (pilgrimages and "any other page" are in scope, item 1).
  - Chichen Itza `site.js`: 11 panel citations of 4 entries removed (El Castillo, Tzompantli, Sacred Cenote, El Caracol).
    **Kept** El Castillo on the `inner` panel ("The pyramid inside"): it is that panel's only source (order item 4: flag, don't strip bare).
  - Delphi `site.js`: 4 citations of 3 entries (List of ancient Greek temples, Stadium of Delphi, Omphalos of Delphi),
    including the quotation that annotated the Omphalos entry.
  - Newgrange `site.js`: 6 citations of the "pointer only" entry (order item 3 applies by analogy).
  - Museum `english.js`: 5 Wikipedia links (v05, v43, v46, v47, v73); each keeps its Vault-entry link.
  - Rebuilt: `docs/pilgrimage/{chichen-itza,delphi,newgrange}.html`.

## Left standing (order item 2; reviewer please judge)
- ch01 (Ark Tablet: "the Jewish Chronicle and Wikipedia say Finkel first saw it in 1985"), ch19 source-note
  ("Wikipedia's sourced overviews"), V90 ark-tablet page prose: prose mentions.
- `docs/pilgrimage/sites/chichen-itza/dims.js` (4) and `newgrange/dims.js` (1): "via Wikipedia" in code comments naming
  survey sources (not shown to visitors). Re-source with the flags below.
- Chichen Itza `inner` panel's El Castillo entry (see above).

## Sole-source flags (re-source from the well; continue numbering after 157)
- **158** Chichen Itza "The pyramid inside": whole panel carried only by Wikipedia "El Castillo" (entry kept).
- **159** Chichen Itza Sacred Cenote panels: the Wikipedia entry carried "after Cano 2002, Sabloff 1994, Landa"; cenote
  size (60 m / 27 m, Cano 2002) and sacbe length (Adams 1991) now rest on `dims.js` comments only.
- **160** Chichen Itza Tzompantli and El Caracol panels: check the remaining sources cover the panel figures.
- **161** Delphi temple "6 by 15 columns": now Anasynthesis alone; confirm or add.
- **162** Delphi stadium track length and capacity: now Ministry of Culture + Odyssey; confirm figures.
- **163** Delphi omphalos: "may have been covered with a mesh of woollen cloth" and "original or a later copy is not known"
  were carried by the removed Wikipedia entry and its quotation.
- **164** Newgrange: panels that cited only Wikipedia + one other (`whi`; `whe`) — confirm the other covers each claim; D.H 12 m.
- **165** Museum English panel: v43 Merneptah lines, v46 Barth's Piprahwa translation, v73 Book of the Law I:40 — the Vault
  entries don't carry the quoted text; source the translations directly (v05, v47 texts are in their Vault entries).

## Checks (on `c01026a4`)
Full build order → no further diff; review-checks `--base origin/main --build` 9/0/0; verify 18/18; tests 51/51;
headless 3 Pilgrimage pages + museum at 360/390: no script errors, no overflow, identical to `main` (one blocked external
font in both); Wikipedia count on those pages 23 → 1 (the kept El Castillo).

## Next
Independent review of #160 by a session other than this one; GitHub green incl. Lighthouse; then merge per item on the strip yes.
The `sources/*.md` logs are internal (not site pages) and stay out of scope, as in every earlier part.
