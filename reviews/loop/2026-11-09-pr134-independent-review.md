# PR #134 Rotunda Tray 1 — independent review

**Verdict: NOT MERGEABLE YET — 3 fixable findings, 3 points that need Carter (or atlas, then Carter).**
Reviewer: session ..01HFWzToHt8256shdsp7mQn1 (wrote none of #134; builder ..01HFWzTnz4oXN3aWiNtmmYkJ).
Candidate `loop/rotunda-tray1` `489105ed`, fast-forward from `main` `a5256e38`. Reviewed `origin/main...489105ed`
against `reviews/REVIEWER.md` §3–§4. Class: per item (new pages, revered figures).

## §3 automatic checks (on `489105ed`)
- `review-checks.js --base origin/main --build`: 9 pass, 0 fail, 1 warn (Isis and Shiva Pantheon entries changed
  without a pending marker; the only change is the new `s` statue-link field, so the note is expected). Tree clean.
- `tools/verify-*.js`: all pass. Tests 42/42.
- Headless (390 iPhone 13, 1280): all four pages standards mode, no sideways scroll, no script errors (only blocked
  Google Fonts), pending tag visible on every page, all three statues render on a WebGL canvas. Screenshot
  `handoff/previews/pr134-review/statues-390.png`. Page weight served uncompressed here: Socrates ~3.0 MB, Shiva ~2.9 MB,
  Isis ~2.7 MB (the index says "about 2 MB"; with the host's compression of the JS it should be near that, not checked live).

## Findings

**F1 — fixable (contested claim stated as settled).** `docs/rotunda/isis.html`, "About this figure": "of all the old
gods she was the last still worshipped, at Philae, into the sixth century." When Isis worship at Philae ended is
debated: Procopius has Justinian close the temple (c. 535–537); J. H. F. Dijkstra (*Philae and the End of Ancient
Egyptian Religion*, 2008) finds the Isis festival attested only to the early 5th century and gone by the mid-6th, with no
clean break in 537 (checked: BMCR 2009.06.43, https://bmcr.brynmawr.edu/?p=26464). "Of all the old gods … the last" is also
an unsourced superlative. Suggested: "Her temple at Philae was among the last places the old gods were worshipped:
one ancient account has the emperor Justinian close it in the 530s, though historians still debate how long worship
there had really lasted."

**F2 — fixable (unsourced).** Same paragraph: "her temples stood from Britain to Mesopotamia." The Britain end is
well attested (e.g. the Isis temple of Roman London; National Geographic, 2020, "Worship of this Egyptian goddess spread
from Egypt to England"); the Mesopotamian end has no source on the page or in `sources/rotunda-tray1.md`. Suggested:
"from Britain to the eastern provinces of Rome", or add a source for Mesopotamia. Log whichever source is used.

**F3 — fixable (phone framing).** At 390 px the Isis viewer opens with the top of her horned sun-disc crown cut off by
the top edge of the frame (screenshot). Pull the camera back or lower the target a little so the whole figure shows at
first load on a phone (Every-Screen rule).

**C1 — needs Carter / atlas (credit cannot be confirmed).** Isis face credit: page and log say "the digital model
prepared by 3DWP … CC BY 4.0". The CC BY 4.0 model I could open is by Laura Shea / Mount Holyoke College Art Museum
on Sketchfab (accession MH 1965.10.C.G, 2nd c. CE Hadrianic, 4 1/2 in: all other details on the page match):
https://sketchfab.com/3d-models/roman-bust-of-isis-71f65b096069402393a51c6bc455f3dc. I found no "3DWP" release. Under
CC BY the credit must be right. Atlas to give the exact file page used; if it was Laura Shea's, drop or correct "3DWP".

**C2 — needs Carter / atlas (source conflict).** Socrates' head: MANIFEST says "the Uffizi Socrates"; the plaque says SMK
(National Gallery of Denmark) via Scan the World, print file by Kvant_64ru, CC BY; a Scan the World listing I opened
says "National museum (Copenhagen)". I could not open the MyMiniFactory page or find the Kvant_64ru file. Three
accounts, none confirmed. Atlas to give the exact file page and licence; the plaque then follows it.

**C3 — needs Carter (sensitivity rule, REVIEWER §4.6).** New 3D models of revered figures of living traditions: Shiva
(a scan of the worshipped monument at Murudeshwar, finished by us in bronze) and Isis (venerated today in revived
Kemetic practice). The rule sends any new model of a revered figure to Carter even if it looks right. The tone of both
pages is respectful and the Shiva page says what is scan and what is ours. Shiva is recorded as approved by Carter
(2026-10-27 finish order); Isis was "awaiting verdict" in the 2026-10-28 records. Carter's per-item yes on #134 must
cover both figures being shown.

## Passed
- Pending tag on all four pages; canonical links; sitemap entries; Pantheon links only for Isis and Shiva.
- Shiva licence and title match Thingiverse 3689465 ("Statue of Shiva in the lotus position at Murudeshwar",
  boris3dstudio, CC BY), checked via https://3dgo.app/models/thingiverse/3689465.
- Isis bust details (accession, date, Hadrianic, 4 1/2 in, photogrammetry by Laura Shea) match the Sketchfab record.
- Socrates: "Head from a real scan, body made for it" is honest and consistent; zoom unlocked.
- Mesh sizes differ from MANIFEST's named files (builder's note 2): the meshes are those inside the fingerprinted pages
  of record, so the chain is intact; atlas to confirm they are the intended finals (not a blocker).

## What happens next
Builder (any run other than this session for the delta review) applies F1–F3; atlas answers C1–C2; then a delta review
by a session that wrote none of the fixes; GitHub green incl. Lighthouse; then Carter's per-item yes covering C3.
