# 2026-10-31 ~20:18 UTC — build loop: Pilgrimage open-flip built (PR #88)

**For Carter, in one line:** the four new Pilgrimage sites (Delphi, Mogao Caves, Göbekli Tepe, Chichén Itzá) now have
"Enter the site" buttons on the Pilgrimage page and in the museum's portal, on PR #88. It goes live on your yes.

## What was done
- Order: `handoff/pilgrimage-open-four-2026-10-26.md` (Carter's build yes + his 08:26 ET correction: completes #53).
- Branch `loop/pilgrimage-open-four`, head `9fbc2ec`, PR #88 against `main` `68b7b03`.
- `docs/assets/pilgrimage-data.js`: the four entries `"preview"` → `"live"`; `pending: true` kept, so every list card,
  portal entry and site page still says "Recently added · pending review". The label question in the order does
  not arise: nothing is cleared.
- `docs/pilgrimage.html` and `framework/registry/site.json` rebuilt by the tools (not hand-edited).
- `docs/museum.html`: `pilgrimage-data.js?v=1` → `?v=2`. Assets are cached for 24 h (`docs/_headers`), so without
  this a phone that visited the museum recently would still see the old 3-site portal until tomorrow.
- The four site pages are unchanged (already `noindex`, like the three open sites).

## Checks (on `9fbc2ec`)
- Full build order (`build-og`, `-vault`, `-chapters`, `-pages`, `-museum`, `-sky`, plus entity registry and framework):
  no changes beyond the four files above.
- 17/17 `tools/verify-*.js`; `node --test framework/test/*.test.js` 42/42.
- `node tools/review-checks.js --base origin/main --build`: 9/9 passed, 0 warnings.
- Headless Chromium at 390×844 (phone): Pilgrimage page lists 7 open sites, each with the pending tag and an Enter
  button; tapping Enter on each of the 7 opens the right page, which loads with its title and Enter screen. Console
  errors: only Google Fonts blocked by the sandbox network, identical on the three already-open sites. Museum loads
  `pilgrimage-data.js?v=2` and its portal list reads 7 live sites, all marked pending.
- Screenshots: `handoff/previews/pilgrimage-open-four/list-delphi.png`, `site-mogao-caves.png`.
- GitHub checks on #88: started at push; not waited on (lock released). The next run records them.

## Observed, not changed (out of scope)
- The list's "Enter the site" button is 32 px tall on a phone (same for the three existing sites): under the 44 px
  floor. Belongs to tap targets part 2 (`prep-2026-10-28/tap-targets-part2/`), noted there via STATUS.

## Still needed before it can go live
1. Independent review of `origin/main...9fbc2ec` by a run that wrote none of it (LOOP "Merging" 1). The diff is
   4 files / 15 lines of status flags, so this is a short review, not a content re-review: the four sites' content
   already passed under #53, per Carter's correction.
2. All GitHub checks green on `9fbc2ec`, Lighthouse included.
3. Carter's yes for PR #88 at that head.

## Housekeeping
- This run's first lock commit (`c4fbef4`) carried a co-author line naming the model, against the no-model-names rule.
  Not rewritten (history on a shared branch is not rewritten); every later commit of this run leaves it out.
- Graphify wiring (PREP-INDEX "Blocked"): the files are on the Muse side (`~/workspace/…`), not in the repo, so a loop
  run cannot push them. Needs Muse/atlas to stage them under `handoff/`, or Carter to restore app write access.
