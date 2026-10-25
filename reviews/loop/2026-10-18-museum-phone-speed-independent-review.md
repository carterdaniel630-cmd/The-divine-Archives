Item: museum phone speed, pixel ratio 1.5 → 1.0 on phones (branch `loop/museum-phone-dpr`)
Reviewed: 2026-10-18 ~07:20–07:45 UTC (build loop run; this run wrote none of `0585c80`)
Covers: `origin/main...0585c80` (main = `7b281cb`), against `reviews/REVIEWER.md` §3–§4
Summary: 0 open findings, 0 fixed. One optional note (a code comment). Merge still needs a pull request and Carter's yes.

## Why this item this run
Batch B (value 1) is waiting on Carter's yes to open its pull request, so it cannot move. The next item with no
Carter gate was this review (value 3: what most visitors feel on a phone).

## The change
One line in `docs/museum/app.js` (`initRenderer`): on touch devices the 3D view draws at most 1 pixel per screen
point (was 1.5); desktops stay capped at 2. Plus a one-line comment. No content, no new feature, nothing
religiously sensitive (condition 4 holds).

## Automatic checks (§3), run on a clean checkout of `0585c80`
- Full build order (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry, sky): clean; no
  tracked file changed afterwards, so the committed output is current.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- All 17 `tools/verify-*.js`: pass. `node --test framework/test/*.test.js`: 42/42.
- GitHub: the push-triggered "Game runtime checks" run on `0585c80` is green (run 39106945421). There is no pull
  request, so the PR-only checks (review, verify, originality, Lighthouse) have not run. Merge condition 2 not met yet.

## Checklist (§4)
1. Accuracy: pass. No page text changed. The comment's "about half the fill work" is right: (1/1.5)² ≈ 0.44.
2–5. Lens balance, evidence tiers, contested claims, tone: not applicable (no content).
6. Religious sensitivity: pass, nothing touched.
7. Games and 3D: pass. Headless Chromium, software graphics:
   - Phone (390×844, screen density 3, touch): canvas 390 px wide for 390 px on screen, so ratio 1.0 as intended.
     Entrance hall renders (sign, doorway, pool and fish visible), no script errors, no sideways scroll.
   - Desktop (1280×800, density 2): canvas 2560 for 1280, so ratio 2, unchanged from before. No script errors.
   - Only console errors were outside font requests blocked by this sandbox's network.
   - Also checked: the only other use of the pixel ratio is the planetarium's star size (`S.sky.setScale(renderer.getPixelRatio())`,
     line 544), which follows the new value, so stars keep their on-screen size. Nothing else resets the ratio.

## Optional note (not blocking, not fixed: a reviewer does not edit what it reviews)
- The new code comment says "Item 9"; the source is folded worklist row 9 (`handoff/audits/folded-worklist-2026-10-17.md`),
  not manifest Item 9. Visitors never see it. Can ride along with a later museum change.

## Not measured
- Real-phone smoothness. The builder's numbers (hall 3.2 → 6.1 fps) are software graphics, relative only. Carter's
  phone check after it goes live is the verdict (priority rule, value 3).

## Still missing before it can merge (LOOP.md "Merging")
1. A pull request so GitHub's PR checks run, Lighthouse included, all completed and green on `0585c80`.
2. Carter's yes for this specific item.
