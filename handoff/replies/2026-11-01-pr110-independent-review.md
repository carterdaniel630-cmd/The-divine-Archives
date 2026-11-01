Batch: Sitemap coverage, museum fix batch item 4 (PR #110, `loop/sitemap-coverage` @ `3a71900`)
Reviewed: 2026-11-01
Covers: `origin/main` `8634b5e` ... `3a71900` (13 files, +41 −24)
Reviewer: loop run, session ..WzTnmq6fjp3fHYYRzbBU. Wrote none of the site changes (built by ..WzTnSRoVWhWeqdGS4iCw as `1026000`); this run only added the re-sync merge of `main`, which adds main's content and nothing else.
Summary: PASS on the code, 0 findings. 1 point to Carter before the merge: which way his sitemap ruling reads.

## What the PR does
- Museum landing + the 10 open Pilgrimage sites: `noindex` removed, canonical link added, listed in `sitemap.xml` (192 → 203).
- Still noindex and out of the map: Newgrange, Stonehenge, Golgotha and the Tomb, Mount Ararat (previews), the Keeper preview, the hidden arcade, search, random, chapter/era templates. Checked in the built output, not only the diff.

## Step one: automatic checks (on `3a71900`, clean worktree)
- `node tools/review-checks.js --base origin/main --build`: 9/9 PASS, 0 warnings; tree clean after the build.
- All 18 `tools/verify-*.js`: pass. `node --test framework/test/*.test.js`: 42/42.
- Headless phone (touch), 360 and 390 wide: museum, pilgrimage list, Delphi, Qumran, Alexandria → no robots tag, canonical = own address; Newgrange, Keeper, arcade → still noindex, no canonical. 0 page errors, no sideways scroll on all 16 opens.
- `robots.txt` allows all and names the sitemap. Canonical host `getconexto.com` matches every other page's `SITE`.

## Step two: checklist
- Accuracy / lenses / evidence tiers / contested claims: no chapter or claim text changed. N/A.
- Tone: two new HTML comments, plain. Pass.
- Religious sensitivity: none of the 10 open sites is marked (S) in `plans/pilgrimage-sites.md`; Golgotha (holy site) stays hidden. Nothing shown changes, only whether search engines list it. Pass.
- Games/3D: no game or 3D code changed (`build-pages.js` head tag and sitemap only). Pages open with 0 errors.

## Point to Carter (not a code finding)
The ruling file says both "KEEP THE HIDDEN PAGES OUT" and "the 20 genuinely public pages that are missing get added". The loop found that all 20 missing pages were hidden on purpose; 11 of them (Museum + 10 open walks) are finished public pages, the other 9 are previews/utility. This PR follows the reading "list the 11, keep the 9 hidden". Because the question Carter was asked was exactly "should the hidden Museum and walks show up in search?", the ruling can also read as "no". Merge is per item anyway, so this goes to him as a one-tap check:
- **a** — List the Museum and the 10 open walks in search (merge #110). Recommended.
- **b** — Keep them hidden; close item 4 as "by design".

## Verdict
site:pr110 · loop/sitemap-coverage@3a71900 · 0 findings · NEEDS CARTER (ruling reading, per-item merge)
