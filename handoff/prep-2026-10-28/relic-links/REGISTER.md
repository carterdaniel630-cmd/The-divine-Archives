# Live relic links — verified register (starter)

Started 2026-10-28 as part of the relic-links prep. Rules: a row is **verified** only when the page itself was opened and seen to be the right object's record at the holding institution; URLs are copied verbatim from sources, never reconstructed. "None known" is a complete entry. Excluded entirely: v68 (withheld), v64 (pending Carter's decision — see SPEC.md).

## Kind 1 — 3D scans (already live in `docs/museum/scans.js`; carried over, not new)
v53 Rosetta Stone — British Museum (museum) · v59 Venus of Willendorf — Natural History Museum Vienna (museum) · v58 Lion Man — State Office for Monument Preservation, Baden-Württemberg, CT scan (museum) · v55 Oracle Bones — British Library (museum) · v70 Pictish Stones — Historic Environment Scotland (museum) · v36 Rök Runestone — Arkeologerna, Sweden (museum) · v71 Stećci — Global Digital Heritage (independent) · v47 Kensington Runestone — Artec 3D (independent) · v43 Merneptah Stele — independent photographer, at the Egyptian Museum, Cairo · v34 Pyramid Texts — independent photographer, inside the pyramid of Unas · v35 Cyrus Cylinder — independent photographer (artfletch), at the British Museum.

## Kind 2 — the holding museum's own page
| Object | Holder | URL | Status |
|---|---|---|---|
| v53 Rosetta Stone | British Museum (EA24) | https://www.britishmuseum.org/collection/object/Y_EA24 | **Verified** — opened 2026-10-28; page title "stela \| British Museum"; EA24 is the stone's museum number. (A Vault-page viewer link for this object may already exist — inventory at build time.) |
| v35 Cyrus Cylinder | British Museum (BM 90920; reg. 1880,0617.1941) | https://www.britishmuseum.org/collection/object/W_1880-0617-1941 | **Verified** — opened 2026-10-28; page title "cylinder \| British Museum". ⚠ Search also returns a BM page for a 1971 plaster CAST (C.209) — that page must never be registered for this object. |
| v22 Mesha Stele | Musée du Louvre (AO 5066) | https://collections.louvre.fr/en/ark:/53355/cl010120339 | **Verified** — opened 2026-10-28 (live check): page title "Stèle de Mesha — Louvre site des collections"; record gives AO 5066, found at Diban, currently on display in Salle 303. |
| v52 Ishtar Gate | Staatliche Museen zu Berlin (Pergamonmuseum / Vorderasiatisches Museum) | — | **None recorded.** No official collection record surfaced in this pass (the Pergamonmuseum is closed for renovation). Do not invent one; research again at build time via the SMB online collection. |

## Kind 3 — live cameras
No verified live camera for any object in this pass. Default entry for every object: **none known** — never invent one.

## To do as the register grows
- Inventory the "holding institution's own viewers" links already on Vault pages (confirmed present on at least v35 and v22) before adding kind-2 rows, so the inspector register and the Vault pages agree.
- Continue in V-number order; log each open with its date in this file's format.
