# Loop run 2026-11-15 01:51 UTC — figure-page credit lines C1–C2 built

Session: ..01HFWzTnopuejYUZ9kbhaxYn (scheduled build loop). Lock taken 01:51 UTC, released at end of run.

## Why this item
Queue top two items cannot move without someone else: V44 needs a PR opened (this environment opens PRs only when
asked) and then Carter's (2) a + a1/a2; PR #141 waits on Carter's explicit confirm. Next highest-value item that needs
no Carter approval to build: the figure-page credit lines (0ca (7), `credit-lines-2026-11-10-figure-pages.md`).
It is live attribution on three CC BY scans (value 1–2: live text and licence compliance), small and sure.

## What was built
Branch `loop/figure-credit-lines` **`00d8d765`**, from `main` `dfe4d272`. No PR (see Not done).
- `docs/rotunda/isis.html`, `shiva.html`, `socrates.html`: each plaque now ends with atlas's credit line, verbatim,
  plus one short clause repeating what the plaque already says (what is scan, what is ours):
  - Isis: "Credit: Roman bust of Isis, 2nd c. CE, Mount Holyoke College Art Museum (MH 1965.10.C.G). Photogrammetry
    by Laura Shea; model by 3DWP, CC BY 4.0. Only the face follows this scan; the rest of the figure is our modelling."
  - Socrates: "Credit: SMK / Scan the World scan, print preparation by Kvant_64ru, CC BY. The head is the scan; the
    body was made for this statue."
  - Shiva: "Credit: Seated Shiva of Murudeshwar — photogrammetry by Boris3D Studio (boris3dstudio), CC BY 3.0. The
    dark bronze finish is ours."
  - One small `.credit` style per page (smaller, dimmer text). Nothing else on the pages changed; pending tags stay.
- Already true before this run, checked: no Uffizi credit anywhere on the site; no Socrates inventory number.
- `sources/rotunda-tray1.md`: gap 1 (Uffizi vs SMK) marked settled with atlas's evidence and the still-open
  inv. 635 / 1040 question; new item 5 records the three lines and what this run did and did not re-open.
- `framework/registry/*`: regenerated (one new source URL).

## Source check (this run)
- Shiva: opened the 3dgo.app mirror of Thingiverse 3689465 — title "Statue of Shiva in the lotus position at
  Murudeshwar", creator boris3dstudio, licence "Creative Commons - Attribution" (version not shown; 3.0 per atlas's
  licence file). The listing's own title stays in the plaque as the attribution title.
- Socrates: MyMiniFactory object 50341 "Portrait of Socrates" found through search; the page refused to open here,
  so the inventory question was not re-checked. Said so in the source log.
- Isis: 3DWP evidence is atlas's (archive.org mirror, re-user credit); not re-opened in this run. Said so.

## Checks (on `00d8d765`)
- Full build order (stamp-dates, og, vault, chapters, pages, museum, sky) + entity registry: outputs committed.
- `review-checks --base origin/main --build`: 9 pass, 0 fail, 0 warnings.
- verify 18/18; tests 51/51.
- Headless 360×740, 390×844, 1280×800 on all three pages: 0 page errors, no sideways scroll, credit line visible,
  pending banner present, no "Uffizi" text. Screenshot at 390 of Shiva looked right.

## Not done
- **No PR opened** (same as runs 2138 and 2346). Carter or a chat session can ask for one; then GitHub checks incl.
  Lighthouse run.
- **No independent review.** Reviewer must not be this session.
- Noted, not changed (outside the order's scope): the Isis plaque says "the museum's photogrammetry by Laura Shea"
  (Mount Holyoke) and two sentences later "Everything below the neck is the museum's own carving" (the Archives).
  The new credit line makes the split clear; the reviewer may suggest a wording fix.

## Merge path
Per item. The credit lines alone would be class (c) (label/attribution wording), but the Shiva page shows a scan of
a worshipped temple statue, and the class rule says anything touching a sacred object is per item. So: PR, an
independent review with zero findings, GitHub green incl. Lighthouse, then Carter's yes for this item.
