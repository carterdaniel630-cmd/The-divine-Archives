# PR #76 (site speed fix A) — independent review, and brought up to main — 2026-10-25 ~01:51–01:55 UTC (build loop)

**Item:** STATUS Next 1b. Carter's yes `decisions-2026-10-24-batch-six.md` 2 (covers going live). This run wrote none
of #76's site change (`10b075c`, built by the 2026-10-24 ~23:50 run).

## Verdict: 0 findings
Reviewed `origin/main...10b075c` against `reviews/REVIEWER.md` §3–§4. No chapter, Vault text, Pantheon figure, source
log or image changes: §4 items 1–6 do not apply (nothing religiously sensitive; no pending tag touched). Item 7 (pages
with a viewer): checked headless below.

Code read (`docs/assets/vault/study.js`, start block; `tools/build-vault.js` cache tag `study.js?v=4`):
- The holding library is asked for its manifest only by `openNow()`, which runs once (guarded), on: the viewer coming
  within 600 px of the screen, the "Open the manuscript" button, or a `#study` / `#folio=` link on arrival. Browsers
  with no IntersectionObserver open at once (old behaviour, safe fallback).
- Pages with no manifest keep their old path unchanged. `go()` already ignores the toolbar while no pages are loaded.
- Observation, not a finding: pasting a custom IIIF link before the viewer is reached is not realistic (the paste box
  is inside the viewer, so reaching it opens the default first).

## Brought up to `main`
Merged `main` `efba79c` into `loop/speed-fix-a` (merge commit, no force-push): **`7100802`**. One conflict, in the
generated `docs/vault/tjurunga.html` (main made it the absence page with no viewer; #76 had bumped its script tag).
Took main's file; the build then reproduced every committed file. Site diff against `main` is now identical to the
reviewed change minus that one page.

## Checks on `7100802`
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings; tree clean after build.
- 17/17 verify scripts; 42/42 framework tests.
- Headless at iPhone 13 size, outside requests counted (fonts excluded, outside hosts blocked):

  | page | opening | scroll to viewer | tap button | `#folio=2` link | `#study` link |
  |---|---|---|---|---|---|
  | Codex Mendoza | 0 | 1 | 1 | 1 | 1 |
  | Codex Borgia | 0 | 1 | 1 | 1 | 1 |
  | Voynich Manuscript | 0 | 1 | 1 | 1 | 1 |

  The button row disappears once opened. Rosetta Stone, Shroud, Dead Sea Scrolls, the Tjurunga absence page and the
  Vault index: 0 outside requests, unchanged. 0 script errors on every page. Picture of the button row at phone size:
  `handoff/previews/speed-fix-a/gate-phone.png`.

## Not done, on purpose
- Not merged. GitHub checks (Lighthouse included) start on `7100802` now. A run that wrote none of #76 merges once all
  are green. This run wrote only the merge of `main`, not the change.
