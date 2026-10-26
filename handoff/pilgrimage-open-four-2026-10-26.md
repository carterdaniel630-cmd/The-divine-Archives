# Pilgrimage: flip the four new sites to OPEN — Carter's build yes, 2026-10-26

## What Carter ordered (in chat, 2026-10-26 morning)
He tried to check all the newly added pilgrimage sites and found none of them live:
from the Pilgrimage main page and from the museum's Pilgrimage portal, they are
still marked "coming" with no way in. He said YES to putting this flip to the
build loop.

## Scope — one bounded item
Flip these four sites from COMING to OPEN, with working entry links, in BOTH places:
1. The Pilgrimage main page (pilgrimage.html)
2. The museum's Pilgrimage portal panel (museum.html)

Sites:
- Delphi — pilgrimage/delphi
- Mogao Caves — pilgrimage/mogao-caves
- Göbekli Tepe — pilgrimage/gobekli-tepe
- Chichén Itzá — pilgrimage/chichen-itza

The four pages themselves already exist and load (merged live via PR #53);
this item is only the entry points: main-page status + link, and museum-portal
listing + link. Do not rewrite the four pages' content in this item.

## What this yes does and does NOT do
- YES = build the flip as a PR for Carter's later review. That is all.
- It is NOT a merge approval. The PR still needs independent review with
  0 findings, all checks green, and Carter's own separate merge yes before
  anything goes live. Nothing merges on this note alone.
- Keep each page's "recently added / pending full review" honesty label as it
  stands unless a review clears it — opening the entry is not declaring the
  review complete. If opening while the label stands is a problem, say so in
  the PR note and stop for Carter's word rather than quietly dropping the label.

## Why this was needed (plain record)
Atlas's morning check found the four pages at their direct addresses and
reported them "live". Carter corrected that in chat: a page you cannot enter
from the Pilgrimage page or the museum portal is not live to a visitor.
This flip closes exactly that gap.

## Done when
- All four sites show OPEN with a working "enter the site" link on
  pilgrimage.html AND appear in the museum Pilgrimage portal with a working
  entry, verified in a real browser at phone size.
- The three already-open sites (Great Pyramid, Library of Alexandria,
  Qumran Caves) are untouched and still work.
- PR filed, review + checks run, awaiting Carter's merge yes.
