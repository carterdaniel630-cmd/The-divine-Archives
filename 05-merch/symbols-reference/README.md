# symbols-reference/ — art drop location (Divine Archives merch)

Drop the symbol art here before any live run. **No art files are in the repo yet** — this
folder documents the expected drop and the per-symbol quality flags. The agent runs in
dry-run mode with mock paths until real files land here.

## Expected files per symbol
```
symbols-reference/<slug>/<slug>-transparent.png    # transparent background
symbols-reference/<slug>/<slug>-parchment.png      # parchment background
```
e.g. `symbols-reference/tree-of-life/tree-of-life-transparent.png`

## The 14 locked symbols and their reference-quality status
Per Carter: reference art exists for all 14 but currently lives outside the repo.

| # | Symbol | slug | reference quality |
|---|--------|------|-------------------|
| 1 | Tree of Life | `tree-of-life` | **high-res individual generation** |
| 2 | Dharmachakra | `dharmachakra` | **high-res individual generation** |
| 3 | Ouroboros | `ouroboros` | low-res triptych crop — reference only |
| 4 | Yin Yang | `yin-yang` | low-res triptych crop — reference only |
| 5 | Triquetra | `triquetra` | low-res triptych crop — reference only |
| 6 | Ankh | `ankh` | low-res triptych crop — reference only |
| 7 | Hamsa | `hamsa` | low-res triptych crop — reference only |
| 8 | Eye of Providence | `eye-of-providence` | low-res triptych crop — reference only |
| 9 | Lotus | `lotus` | low-res triptych crop — reference only |
| 10 | Om | `om` | low-res triptych crop — reference only |
| 11 | Star of David | `star-of-david` | low-res triptych crop — reference only |
| 12 | Valknut | `valknut` | low-res triptych crop — reference only |
| 13 | Sankofa | `sankofa` | low-res triptych crop — reference only |
| 14 | Bagua | `bagua` | low-res triptych crop — reference only |

**Reference-quality art is NOT print-ready.** Only Tree of Life and Dharmachakra are
individual high-res generations. The other 12 are low-res triptych crops flagged as
reference only — they must be regenerated at print resolution before any live product.
The agent will (in live mode) refuse to upload a file flagged reference-only for a real
product; for dry runs it uses mock paths regardless.
