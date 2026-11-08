# PR #120 — independent review (Qumran share-image alt)

**Reviewed:** `origin/main` `d062ef37` ... `loop/qumran-share-alt` `ce1d44b8` (fast-forward, one commit)
**Reviewer session:** ..01HFWzTnvHbqkD8otVFfKqHc — wrote none of the candidate (builder ..01HFWzTmXUNshhP9ovz17r1o)
**Against:** `reviews/REVIEWER.md` §3–§4
**Verdict:** PASS, 0 open findings. Class (c) honesty-wording fix.

## What changed
- `docs/pilgrimage/qumran-caves.html` line 25, `og:image:alt`: prefixed "A 3D model, not a photograph:".
- `tools/seo.js` `PAGE_SHARE["qumran-caves"].alt`: the same text, so the build source and the committed page agree.

## Checks
1. **Claim is true.** Opened `docs/assets/share/qumran-caves.jpg` (900×1440): a rendered model (smooth procedural
   throwing rings, synthetic lighting, dark void background), not a photograph. Provenance per
   `handoff/share-images-2026-10-25.md` §6: a crop of the Carter-approved Dead Sea Scroll Jar armory build capture.
2. **Wording matches siblings.** Same "X, not a photograph:" pattern as the Great Pyramid and Library of Alexandria
   alts in `tools/seo.js`.
3. **No other copy of the old text.** `git grep` over `docs tools content framework` on the head: none left.
4. **Scope.** Two lines, metadata only; no visible page text, no chapter, no pending tag touched, nothing
   religiously sensitive (a storage jar form, not a sacred object), no new build.
5. **Local checks (this session, on `ce1d44b8`):** `review-checks.js --base origin/main --build` 9/9 PASS;
   every `tools/verify-*.js` pass; `node --test framework/test/*.test.js` 42/42; headless iPhone 13 (390 px)
   load of `/pilgrimage/qumran-caves.html`: no script errors, no horizontal scroll, new alt present.
6. **GitHub:** 8/9 green. Lighthouse failed on **Era: High Medieval 89 → 82**, a page this PR does not touch;
   base itself scored 81 on 5 of 9 runs of that page. Judged noise; failed job re-run 2026-11-08 ~01:56 UTC per the
   quality bar (never assumed green). Merge waits on that re-run.

## Findings
None.
