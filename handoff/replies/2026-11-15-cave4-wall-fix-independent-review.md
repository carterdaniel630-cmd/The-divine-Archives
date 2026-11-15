Batch: Qumran Cave 4 wall fix (loop/cave4-wall-fix, no PR yet; order-2026-11-09-cave4-wall-fix.md)
Reviewed: 2026-11-15
Auto-pass: on
Covers: loop/cave4-wall-fix@f106f484 (one commit on main f92ab8d7)
Summary: 0 passed, 0 fixed, 0 need you. 2 fixable findings open (for the builder). Not mergeable yet.

Reviewer: scheduled loop run, session ..01HFWzTpYzjR34RgUjscvB4D. It wrote none of the diff
(the builder was ..01HFWzTkGPNpy8ZAhmb97Ms6).

Automatic checks (on f106f484): pass.
  - Full build order: every step exit 0, 0 drift (tree clean).
  - tools/verify-*.js 18/18. node --test framework/test 51/51.
  - review-checks --base origin/main --build: 9 passed, 0 failed, 0 warnings.
  - Headless phone 360x780 and 390x844 (touch), live main served side by side for comparison:
    0 script errors, 0 shader errors (only the sandbox's blocked font request), no sideways scroll.
    Cave 4 standing view 11 calls / 4,646 triangles (main 10 / 3,786): inside budget.
  - Drop and rebuild (s2 > s1 > s3 > s2 > s1 > s2, and 4 more s1/s2 cycles): rebuilds cleanly every time;
    the cave's two extra textures are freed when it is dropped (counts in s1 match main exactly).

Code read (the whole diff, two files): pass apart from F2's comment.
  - The mouth gap 2PI-0.33 > 0.33: cave.js's inGap already wraps when a1 < a0, so both halves now open.
    The builder's diagnosis is right (the old -0.33 only opened 0..+0.33).
  - The triplanar shader chains correctly after the kit's breakup (it replaces the bare map include,
    which the breakup code follows); world normals, the turned texture and its undo, and the whiteout
    relief blend are consistent; its own program cache key. Seamless copy blends with the half-tile pixel
    near the edges only, so neither join shows. Masks draw after the lips, so lips stay visible.
  - Only s2-cave4.js and the site version changed. No wording, no hole positions, no lights, no case.

The order's five faults, judged at 360 and 390 (and 390 at phone pixel density, x3):
  - Fault 2 panel seams: FIXED. The 3 m hairlines on main (e.g. the vertical one over the mouth,
    the horizontal one across the south wall) are gone.
  - Fault 3 horizontal boundary in 4a: FIXED. No line round the room at the vault springing.
  - Fault 5 entrance wedge: it was a defect, as the builder found; FIXED. The mouth now opens on both
    sides of the passage, centred; the black slot is gone (pass-mouth-and-seam-*.jpg).
  - Fault 4 mirrored V: PARTLY fixed. See F1.
  - Fault 1 small holes flat: NOT fixed. See F2.

FIXABLE (open, for the builder; visual work, not on the reviewer's self-fix list)
  - site:cave4-wall-fix/F1 (fault 4): in chamber 4b's east wall the lower V is gone, but a mirrored
    chevron still reads clearly down the centre of the wall from about head height up: strokes on the
    left slant up to the middle, strokes on the right slant down from it, meeting in a peak. Seen at
    standing distance from 2.3, 2.8 and 3.6 m, at 360 and 390, level and looking slightly up.
    Not faint. Evidence: review/f1-4b-east-main-fix390-fix360.jpg, review/4b-views-main-top-fix-bottom.jpg
    (columns 1-3). Atlas asked that "the two sides no longer match"; in that band they still do.
    Where: s2-cave4.js triplanar() (the turn alone does not break it under 4b's central lamp).
  - site:cave4-wall-fix/F2 (fault 1): the small holes still read as flat dark discs at standing distance,
    and at phone pixel density they read flatter than on live main. The socket shading was made darker,
    not lighter (shade [0.34, 0.09, 0.025] became [0.2, 0.05, 0.012]), so the first part of the socket
    wall, which on main showed as a lit crescent, now goes nearly black; the new lip is too faint to
    see at 1.5-2 m. The code comment "the socket's own wall stays lit for its first part" does not match
    what the values do. Evidence: review/f2-holes-dpr3-main-top-fix-bottom.jpg (top main, bottom fix).
    Where: s2-cave4.js holeRows(), the shade array and the lip colours.

Advisories (not findings; nothing to block on)
  - A straight diagonal light line crosses the upper left of 4b's east wall (visible in every 4b view,
    on main too): the builder's "light through rock" note. It reads as the kind of straight line fault 3
    was about. Outside the order; Carter/atlas may want it in a later pass.
  - The way-through slit beside the 4a-4b tunnel (builder's note) is real; outside the order.
  - Every s1/s2 round trip leaves one more texture alive on main as well as on this branch. Pre-existing,
    not from this diff.
  - Frontend-design skill: not installed in this session (CLAUDE.md quality bar asks reports to say so).

NEEDS CARTER: none new. The merge stays per item (visual work on an exhibit).

Accuracy spot-checks: none. The diff changes no words, claims or sources.

Needs your decision
  - Nothing needed now. The builder fixes F1 and F2, then a delta review by a session that wrote none
    of the fix, then a PR so GitHub (incl. Lighthouse) runs, then your per-item yes.
