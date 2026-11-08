Delta review: loop/chapter-images-t1@afdaa314 (answers 2026-11-08-chapter-images-t1-independent-review.md)
Reviewed 2026-11-08, independent; nothing edited or committed. Auto-pass suspended, so all goes to Carter.

Checks: review-checks --base origin/main --build 9/9 PASS; all 18 tools/verify-*.js PASS; tree clean afterwards.
Planted tests: james-ossuary.webp on disk -> FAIL (v16); black-stone still swapped into ch14 -> FAIL (v26);
caption stripped -> FAIL. All restored, git status clean. ch21 and ch14 at 390 px: no script errors, no
sideways scroll, no broken images.

Earlier findings
1. FIXED for the nine D2 objects: tools/data/relic-stills.json:8-16 (8 files deleted; V88 had none).
2. FIXED: tools/build-chapters.js:110 adds the "lost or known only from texts" sentence.
3. FIXED in code: one list read by both builders, plus tools/verify-relic-stills.js. See finding A.
4. FIXED: relic-stills.json:4 excludes V76.
5. FIXED: tools/build-relic-stills.js:14-15 now says re-renders are not repeatable.
6. Left as LOW, as agreed.

Open
A. MEDIUM-LOW. .github/workflows/verify.yml:9-41 runs the verifiers only when listed paths change.
   docs/assets/vault/stills/**, docs/chapters/** and tools/data/relic-stills.json are not on that list.
   Scenario: a PR adds only james-ossuary.webp. verify.yml never runs, and review-checks --build passes
   because the page leaves the still out. The file still goes live at its own address. Fix: add those three paths.
B. NEEDS CARTER. The faces of revered figures from finding 1 are still shown: holy-mandylion,
   veil-of-veronica and tilma-of-guadalupe. They are not on the exclusion list, and no ruling is recorded.

FINDINGS (2 open)

## Delta 2

Reviewed `git diff afdaa314..593d7d17` (895e02de, 593d7d17), 2026-11-08, independent; nothing edited or committed.

- JSON: tools/data/relic-stills.json at 593d7d17 holds all 14 earlier exclusions, text unchanged, plus v57, v25, v13 (ids match vault-data.js slugs). Other keys unchanged. The emptied file in 895e02de is fully undone.
- A. FIXED: verify.yml parses as YAML; push and pull_request both list stills/**, docs/chapters/** and relic-stills.json.
- B. Held as asked: the three .webp files are deleted; no page under docs/ references them; ch22, ch31, ch43, ch48, ch60 now link those entries without a picture. Showing them stays NEEDS CARTER.
- All 18 tools/verify-*.js PASS; review-checks --base origin/main --build 9/9 PASS; tree clean.

PASS (B awaits Carter's ruling, not a finding)
