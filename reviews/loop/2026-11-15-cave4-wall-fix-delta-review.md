Batch: Qumran Cave 4 wall fix, delta review of the F1/F2 fix (loop/cave4-wall-fix, no PR yet; order-2026-11-09-cave4-wall-fix.md)
Reviewed: 2026-11-15
Auto-pass: on
Covers: loop/cave4-wall-fix@93425766 (delta f106f484..93425766; whole branch two commits on main f92ab8d7)
Summary: 1 passed, 0 fixed, 0 need you. 0 open findings. Review side complete; still needs a PR (GitHub incl. Lighthouse) and Carter's per-item yes.

Reviewer: scheduled loop run, session ..01HFWzTobs6u7QMzRj4gsRWK. It wrote none of the branch
(builder ..01HFWzTkGPNpy8ZAhmb97Ms6; fixer ..01HFWzToC29Z8sEX72saF5Gr; first reviewer ..01HFWzTpYzjR34RgUjscvB4D).

Verdict: site:cave4-wall-fix PASS (delta), loop/cave4-wall-fix@93425766, 0 open findings.
Earlier findings: F1 (chevron in 4b east wall) CLOSED; F2 (small holes flat) CLOSED.

Automatic checks (on 93425766, own worktree):
  - review-checks --base origin/main --build (full build order): 9 passed, 0 failed, 0 warnings; tree clean after build (0 drift).
  - tools/verify-*.js 18/18. node --test framework/test/*.test.js 51/51.
  - Headless phone 360x780 and 390x844 (touch), main served side by side: 0 script errors, 0 shader errors, no sideways scroll.
  - Drop and rebuild s2 > s1 > s3 > s2 > s1 > s2 at 360 and 390: rebuilds every time; Cave 4 11 calls / 4,646 triangles
    (main 10 / 3,786). Texture counts in s1 match main exactly after each round trip (19), so the cave frees what it adds;
    the one-texture-per-round-trip growth is on main too (pre-existing, noted by the first review).
    Probe: handoff/previews/cave4-wall-fix/delta/cycle-probe.js.

Code read (the whole delta, one file, s2-cave4.js): pass.
  - The wrap's bearing atan(d.x, -d.z) matches cave.js (x = cx + sin b * rx, z = cz - cos b * rz). Seams: 4a at 0 (north,
    the mouth), 4b at 1.5 PI (west, the way through, same bearing as 4b's gap). Both joins sit in openings.
  - triUp's "how far the wall has come in" uses the ellipse radius x 1.04, matching cave.js's ring scale at the springing.
  - Wrap circumference rounded to whole 3 m tiles, so u meets itself at the join; screen derivatives taken from whichever
    of b / b+PI is continuous, with textureGrad, so no mip line at the join (WebGL2 only; the vendored three is WebGL2-only).
  - Combed relief and the crown blend are consistent in colour and normal paths; separate program cache key for the wrap.
  - marlA / marlB disposed; jambs keep the plain triplanar material. Socket shade [0.5, 0.17, 0.03], lip 0.7 / 0.58.
  - No wording, hole positions, lights or cases changed.

Visual, judged against main (and f106f484 where useful):
  - F1, 4b east wall from 2.3, 2.8, 3.6 m, level and looking up, 390: main shows a hard mirrored chevron down the middle
    of the wall; this fix shows none at any distance (delta/4b-east-main-top-fix-bottom.jpg). CLOSED.
  - 4a south and west walls: no panel seams, no line at the vault springing. Over the mouth looking up (the 4a wrap join):
    no join visible; main's vertical hairline is gone. 4b looking west over the way through (the 4b join): no join visible
    (delta/4a-mouth-crowns-main-top-fix-bottom.jpg).
  - F2, small holes at 390x844 x3, south and west walls of 4a: every hole shows a lit far-side socket wall falling into
    shadow and a worn lip; on main they are flat-sided dark ovals (delta/holes-dpr3-main-top-fix-bottom.jpg). CLOSED.
  - Crowns, looking straight up: 4a's crown shows strokes fanning in towards the top (the wrap closing); reads as tool
    marks run up the vault, not a line or a mirror. 4b's crown is clean. Main's vertical seam lines across 4a's crown are gone.

Advisories (not findings; nothing to block on)
  - The soft lit Λ / X at the top of 4b's east wall from 3.6 m (the builder asked the reviewer to judge): it is where the
    vault's facets meet and is on main too, in the same place (top row, columns 3-4). Geometry, outside the order's five
    faults. If Carter or atlas want it gone, a later pass could smooth that part of the shell.
  - At x3 and close range the lips read a shade paler than the wall, so each hole has a faint light ring. It reads as worn
    stone; atlas may judge on a real phone.
  - Code comment nit: "half as bright again as the live wall's (0.5 against 0.34)" means the live site's socket mouth
    (0.34), not its wall. Harmless; could read "the live socket's" in a later wording pass.
  - Frontend-design skill: not installed in this session. graphify CLI: not installed this run; the diff (one file) was read directly.

NEEDS CARTER: none new. The merge stays per item (visual work on an exhibit).

Accuracy spot-checks: none. The delta changes no words, claims or sources.

Needs your decision
  - Nothing needed for the review. To go live it needs a PR opened (so GitHub checks incl. Lighthouse run), then Carter's per-item yes.
