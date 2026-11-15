Batch: Figure-page credit lines C1–C2 (branch loop/figure-credit-lines, no PR yet)
Reviewed: 2026-11-15
Auto-pass: on (review-log reviews/status.json, audit 2026-11-14)
Covers: loop/figure-credit-lines@00d8d765
Reviewer: scheduled build loop, session ..01HFWzTmWKBAgsEAkBTdWggP (wrote none of the candidate; builder was ..01HFWzTnopuejYUZ9kbhaxYn)
Summary: 1 passed, 0 fixed, 0 need you. Zero open findings.

Automatic checks: full build order left the tree clean (committed output current); review-checks --base origin/main --build 9 pass / 0 fail / 0 warn (Wikipedia share of sources/rotunda-tray1.md 0%); verify 18/18; node --test 51/51.

PASSED   (1)
  - site:figure-credit-lines: the three plaque credit lines match atlas's note (handoff/credit-lines-2026-11-10-figure-pages.md) word for word; the added clause on each (what is scan, what is ours) repeats what the plaque and the tray MANIFEST already say; no Uffizi text anywhere in docs/; no Socrates inventory number; pending banners kept on all three; nothing else on the pages changed (diff: one <p class="credit"> + one CSS line per page, registry regenerated for one new source URL, source log items 1 and 5).

FIXED    (0)

NEEDS CARTER (0)

Checklist (site:figure-credit-lines)
  1 Accuracy: pass (spot-checks below).
  2 Lenses: n/a (attribution only).
  3 Evidence tiers: pass; the source log names what was not re-checked (3DWP release, Socrates inventory).
  4 Contested claims: pass; the 635 / 1040 inventory question stays open and off the page.
  5 Tone: pass.
  6 Sensitivity: Shiva is a worshipped temple statue, but this diff only adds attribution to a page already live; no new image, model or page. Merge stays per item (sacred object), as MERGEABLE says.
  7 3D: pass. Headless 360x740, 390x844, 1280x800 on isis/shiva/socrates: 0 page errors, no sideways scroll, credit line visible, pending banner present. Looked at Isis and Socrates at 390: credit reads as a small dim footnote under the plaque.

Accuracy spot-checks
  - site:figure-credit-lines | Isis: Mount Holyoke, MH 1965.10.C.G, Roman, Hadrianic, 2nd c. CE, hollow-cast bronze | https://antiquity.mtholyoke.edu/node/83/index.html | supports
  - site:figure-credit-lines | Isis: photogrammetry by Laura Shea, CC BY 4.0 | https://sketchfab.com/3d-models/roman-bust-of-isis-71f65b096069402393a51c6bc455f3dc (uploader laurashea, Mount Holyoke, MH 1965.10.C.G, CC BY 4.0) | supports
  - site:figure-credit-lines | Isis: model by 3DWP (557837) | https://3dgo.app/models/printables/557837 and MyMiniFactory 84847 | could not load (site errors); atlas's evidence stands, not re-checked, as the source log already says. Note: search lists 557837 under Printables, while atlas's note calls it the Thingiverse listing; atlas may want to confirm which site, no page change needed (the page names no site).
  - site:figure-credit-lines | Shiva: title, creator boris3dstudio, CC Attribution | https://3dgo.app/models/thingiverse/3689465 | supports (version not shown; 3.0 per atlas's licence file and MANIFEST, unchanged from the live page)
  - site:figure-credit-lines | Socrates: MyMiniFactory 50341 "Portrait of Socrates" | https://www.myminifactory.com/object/3d-print-portrait-of-socrates-50341 | could not load (site error); exists in search results under that title

Notes (not findings)
  - Isis scan extent: atlas's credit note says "head and shoulders are the scan"; the tray MANIFEST says "Face source" and the live plaque says the face follows the bronze and everything below the neck is ours. The new clause ("Only the face follows this scan") agrees with the plaque and MANIFEST. If atlas means more than the face, that is a plaque wording change for atlas/Carter, not this diff.
  - Isis plaque (pre-existing, outside the diff): "the museum's photogrammetry" means Mount Holyoke, and "the museum's own carving" two sentences later means the Archives. Suggested later wording fix (class (c)): "the college museum's photogrammetry by Laura Shea".

Needs your decision
  - Merge the credit lines (Isis, Socrates, Shiva) once a PR is open and GitHub is green? a) yes  b) not yet. (Per item because the Shiva page shows a sacred statue.)
