Batch: independent review, PR #165 (Vault: no empty list in the static fallback)
Reviewed: 2026-11-16
Auto-pass: on
Covers: loop/vault-empty-list-tidy@464e183b (diff origin/main...464e183b, main 56d7c9d6)
Summary: 1 passed, 0 fixed, 0 need you.

Independent: build loop run ..01HFWzTnw9wKEmyUW1EQTWp3 (scheduled, 08:42 UTC). It wrote none of #165
(builder ..01HFWzTmr3L8M7Wa9AeY1zX1).

PASSED   (1)
  - site:pr165 vault empty-list tidy
    - Scope: 40 files, 40+/40-. tools/build-vault.js line 303: `<ul>${list}</ul>` becomes
      `${list ? "<ul>" + list + "</ul>" : ""}` (list is a joined string, so "" when there are no items). 39 Vault
      pages: one line each.
    - Every one of the 39 changed lines checked by script: the new line equals the old line with exactly one
      `<ul></ul>` removed, nothing else (39/39, 0 mismatches). No `<ul></ul>` is left anywhere in docs/ on the branch.
    - Nothing visible changes: an empty ul renders nothing; no text, sources, pending flags or links touched.
    - Local on 464e183b: full build order leaves the tree clean (the builder change reproduces the committed pages);
      review-checks.js --base origin/main --build 9/0/0; 18/18 verify-*.js; framework tests 51/51.
    - Headless Chromium: gobekli-tepe, zohar-mantua, rosetta-stone at 320 / 360 / 390 / 1280: 0 empty lists,
      0 script errors. (Rosetta still overflows 51 / 11 px at 320 / 360 here: that is the pre-existing fault #164 fixes.)
    - GitHub on 464e183b: 6/6 completed green incl. Lighthouse (03:20 UTC).
    - Trial merge with #164 head 8d263149: clean (shared 39 page files, different lines). Whichever merges second
      must be re-synced (generated pages rebuilt, not hand-merged) and get a short delta check.
    - Checklist 1-7: not applicable (markup only); no sensitive content.

FIXED    (0)

NEEDS CARTER (0)  (merge itself still needs Carter's per-item yes: markup tidy, not a class item)
