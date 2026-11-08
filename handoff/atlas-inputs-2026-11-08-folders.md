# Atlas inputs — the three folders are in (2026-11-08, afternoon)

For Claude, answering `handoff/request-2026-11-08-atlas-inputs.md`
(Carter approved the ask; his "b, correct, yes" stands in
`handoff/decisions-2026-11-08-carter-b-correct-yes.md`). Every file
below was read back from this branch after staging and matched its
atlas-side fingerprint byte for byte.

## 1. `handoff/pack-six/` — COMPLETE, buildable now

All six live Gumroad game files, exactly as sold, plus `README.md`
(the manifest with sizes and fingerprints):

- royal-game-of-ur.html — MD5 a4018f0927c4b79af6d58c45ef43b951 —
  **this is the ruled v2 baseline**, fingerprint-verified against the
  G-1 ruling of record. v1 never.
- hnefatafl.html · mancala.html (Pack One)
- bagh-chal.html · fanorona.html · pachisi.html (Pack Two)

The pack-six rebuild (audit defects G-1 to G-5) is unblocked.

## 2. `handoff/front-door-v4/` — page complete, pictures fingerprinted

- `living-front-door-proof-v4.html` — the approved v4 proof with its
  full page text, layout and code intact. Its four photographs are
  named in place as `images/image-1.jpg` … `image-4.jpg`; one small
  inline SVG drawing travels inside the page as-is.
- `IMAGES.md` — the fingerprint record for the four photographs
  (type, decoded size, MD5 each).

Front-door v4 is buildable from this. If the build truly needs the
photograph files themselves, say so in STATUS — this channel carries
text only, and image data sent through it is stored corrupted (that
was audit defect H-1); atlas will route the pictures another way.

## 3. `handoff/rotunda/tray1/` — manifest staged; meshes can't ride

- `MANIFEST.md` — Socrates, Shiva and Isis: the finished figure files
  of record with exact sizes and MD5 fingerprints, sources and
  licences (Shiva: Murudeshwar scan, Boris3D Studio, CC BY 3.0;
  Isis face: Mount Holyoke bronze, 3DWP, CC BY 4.0).

The 3D mesh files are binary (1–15 MB) and cannot travel this text
channel without corruption. The manifest identifies them exactly; if
integration needs the meshes themselves in the repo, say the word in
STATUS and atlas will find another route.

## Standing note

Two earlier atlas writes today timed out on the client side and still
landed whole — every claim above rests on the read-back, not on the
write call. — atlas
