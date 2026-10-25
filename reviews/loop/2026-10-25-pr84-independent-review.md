# PR #84 independent review: registry recount after #68 and #82 — 0 open findings

**When:** 2026-10-25 ~12:42–13:00 UTC, build loop. **By:** a run that wrote none of #84.
**Candidate:** `loop/registry-count-after-merges` @ `88f2aa8` (one commit off `main` `caedabc`).
**Also checked:** `88f2aa8` merged onto current `main` `91c40fe` (#64 landed after #84 was opened) — clean merge.
**Checklist:** `reviews/REVIEWER.md` §3–§4.

## In plain words
The fix is right and it is the real cause. `main` has two failing internal tests because #68 and #82 each added a source
and each raised the registry totals from the same starting number, so the totals ended up 2 short. #84 sets them to the
true count. Nothing a visitor sees changes.

## What was checked
- **Reproduced the failure on `main` `91c40fe`:** `node --test framework/test/*.test.js` → 40 pass, 2 fail
  (`every registry entity matches the entity schema`, `the committed registry matches a fresh build`).
- **Diff shape:** 2 files, 4 lines: `framework/registry/index.json` (`total` 4313 → 4315, `shortfall` 5687 → 5685,
  `counts.source` 1838 → 1840) and `framework/registry/source.json` (`count` 1838 → 1840). Nothing under `docs/`,
  `tools/`, `.github/`, no content.
- **Numbers add up:** `source.json` has 1840 entities = `count`; the sum of `counts` = 4315 = `total`;
  `target − total` = 5685 = `shortfall`.
- **Fix is the generator's own output:** on `main` + `88f2aa8`, the full build order (stamp-dates, build-og,
  build-vault, build-chapters, build-pages, build-museum, build-framework, build-entity-registry, build-sky) all exited 0
  and left the tree clean, so the committed registry equals a fresh build.
- **Automatic checks on `main` + `88f2aa8`:** `node --test` 42/42; 17/17 `tools/verify-*.js`;
  `review-checks.js --base origin/main --build` 9 passed, 0 failed, 0 warnings.
- **§4.1–4.6:** no chapter, source log, Vault entry, Pantheon figure or sensitive item touched: not applicable / pass.
- **§4.7 / headless:** no page, game or 3D file changed, so there is nothing to open; the live site is unaffected.
- **GitHub on `88f2aa8`:** 5/5 completed green (checks, guard, test, runtime ×2). No Lighthouse run: it is not
  triggered by a change with no `docs/` files, so none is owed.

## Findings
- None open.

## Notes (not findings)
- `main` has moved to `91c40fe` (#64) since #84 was opened; the merge is clean and the checks above were run on that
  merge, so #84 needs no bring-up. Carter's Merge button on GitHub produces the same tree.
- The same double-count can recur whenever two content PRs that both add sources are merged back to back. The next
  run building a content PR after another lands should re-run `node tools/build-entity-registry.js` before asking for
  the merge.

**Verdict:** PASS, 0 open findings. Missing for merge: Carter's yes for #84 (and his Merge button: loop pushes to
`main` are refused by the session safety system).
