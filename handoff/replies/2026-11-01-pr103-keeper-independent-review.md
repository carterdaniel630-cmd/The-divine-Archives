Batch: The Keeper production pass 1 (PR #103)
Reviewed: 2026-11-01
Auto-pass: SUSPENDED (new build; always per item)
Covers: loop/keeper@162f1d2
Reviewer: loop session ..WzTjwno7uRrX2YNgxC81 (wrote none of PR #103; builder was ..WzToHsPDR8sHGfdHDecE)
Filed: review-log `5ba7df4` (reviews/2026-11-01-loop-pr103-keeper.md)
Summary: 0 failed checks, 0 fixed, 1 point needs you (the sacred signs on his robe). No code problems found.

Automatic checks: review-checks --base origin/main --build 9/9 PASS, 0 warnings, committed build output matches a fresh build; every tools/verify-*.js pass; tests 42/42.
GitHub at ~16:50 UTC: guard, checks, links, runtime x2 all green; Lighthouse still running (started 16:33 UTC).
Headless (360x740, phone): page renders the figure (not a black canvas); no script errors (the only failed request is Google Fonts, blocked in the sandbox); no sideways scroll (360/360); pending banner visible; drag-to-turn works. Captures: handoff/replies/keeper-pass1-review/page-360.png, turned.png.

PASSED
  - site:keeper/banner: pending banner shown ("pass 1 of 2, not yet part of the museum").
  - site:keeper/unlinked: noindex,nofollow; not in sitemap; no page on the site links to keeper.html (searched docs/).
  - site:keeper/code: no network calls, no eval, no storage, no innerHTML; WebGL failure is caught; pixel ratio capped at 1 on phones; three.js is the site's vendored copy (no 0.9 MB embedded library).
  - site:keeper/licence: keeper-env.js is three.js r160 RoomEnvironment, MIT, licence file present in docs/assets/vendor/three/.
  - site:keeper/locked: void face, bound hood edge, solid halo disc, RIGHT hand raised (viewer's left in front view), left hand open and empty, no flowers in the goldwork, raven — all as the order locks them.
  - site:keeper/wake: withered ground on his right, green on his left, as ordered; reads at full-figure distance.
  - site:keeper/plaque: plaque text is the bench v2 text unchanged (approved with the bench), plus a closing line saying he is an invented guide not drawn from any one tradition. Good honesty line.
  - site:keeper/honesty: the build reply states plainly that must 1 (woven goldwork) is not started and must 2 (hands) is partial. Nothing is claimed that is not on screen.

FIXED (0)

NEEDS CARTER (1)
  - site:keeper/6 sensitivity: his robe carries signs of living religions: Om, Star of David, crescent and star, unalome, yin-yang, ankh, Mjölnir, valknut and others (list in handoff/keeper/bundle-18/guide-build-note.md "The symbols"). You approved these on the bench, so this is not a new problem; but the review rules send every sacred sign on a new figure to you, and two points are worth a conscious yes before he goes live:
      (a) the Om and unalome sit on the front falls of a garment; some Hindus and Buddhists object to sacred signs worn on clothing;
      (b) the valknut is listed by anti-hate groups as a sign some white-supremacist groups use (the repo's own plans/easter-eggs.json notes this for Heathenry). Shown here among many traditions on a scholar's robe it reads as Norse religion, not that; still your call.
    Where: docs/museum/keeper.js, the bodyPatch / fallPatch lines after "THE SYMBOL ATLAS — PASS 6".

Notes (not findings)
  - Residuals the builder already named stand: left hand gap under the sleeve from the side; faint palm creases close up; the wake disc stays fixed while he turns (true only in the front view).
  - Plaque says "goldwork stitched into the weave itself"; this is the figure's in-world description, and pass 2 (must 1) is what makes it look so at close zoom.

Accuracy spot-checks
  - None needed: the page makes no factual or historical claim beyond naming him an invented figure.

Needs your decision
  - Keep the robe's signs as approved on the bench? a) yes, all as they are (recommended: approved design, shown as a scholar of all traditions); b) take the valknut off; c) take off the valknut, Om and unalome.
  - Then your per-item yes to put the Keeper preview page live (new build), once Lighthouse is green.
