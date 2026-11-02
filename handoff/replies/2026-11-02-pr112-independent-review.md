# Independent review: PR #112 (honesty completions bundle, items 1–3)

- **Candidate:** `loop/honesty-bundle` `73958d2` (one commit on `main` `5daa7f4`; fast-forward).
- **Reviewer:** build-loop run 2026-11-02 ~02:45–03:20 UTC, session ..WzTn7RJeCwEejdQJFzkT. Wrote none of the
  candidate (builder: ..WzTpBWfUwJGGYkbAnkF4).
- **Against:** `reviews/REVIEWER.md` §3–§4; order `order-2026-11-01-honesty-completions-bundle.md`.
- **Verdict: PASS, 0 findings.** 1 advisory note (below), not blocking.

## What was checked
1. **Newgrange flip.** `pilgrimage-data.js` status preview → live; `pilgrimage.html` card shows "Open · walk it", the
   pending tag and the Enter link (headless 360: present); the site page drops `noindex` for a canonical and enters the
   sitemap (204/204); `site.json` registry rebuilt; museum data cache key v=3 → v=4. Pending tag kept on the list and
   on the page ("recently added, pending full review"). Newgrange is a public heritage site, not restricted; its
   content was reviewed in #94. Count 11 open / 62 in preparation matches the data.
2. **Great Pyramid.** Confirmed the builder's finding: all 11 open pages carry "Skip to the text version" (grep, 0
   missing), so the parity gap is not reproduced. The garbled v-back sentence is real on `main` (from `9e6d1de`) and the
   fix matches where the arch actually is: `9e6d1de` moved the golden arch to the entrance hall; `museum.html#portal`
   lands there. Class (c) wording fix.
3. **Guide stop texts in the text versions.** `tools/pilgrimage-guide-text.mjs` imports the real site modules (bare
   `three` resolved to the vendored file, nothing stubbed); `build-pages.js` renders sections → stops (flags, text,
   links, sources, relic holder/date + Vault link) → "About this model". Portal stops excluded; hidden sections
   excluded; previews unchanged. Added markup: 0 scripts, buttons or `javascript:` links; only chapter/Vault links;
   0 duplicate ids on any pilgrimage page. Read Newgrange's rendered text in full: the "Contested", "Not supported
   by the evidence", "Sources differ" labels carry through, so the honesty labelling survives into the text version.
4. **Local checks on `73958d2` (clean worktree):** `review-checks.js --base origin/main --build` 9/9 pass (all 7
   build steps, output matches committed; 9,348 internal links); every `tools/verify-*.js` OK (18/18);
   `node --test framework/test/*.test.js` 42 pass, 0 fail.
5. **Headless phone 360×740, with and without WebGL:** pilgrimage list, Newgrange, Great Pyramid, Delphi, Qumran,
   Stonehenge (preview), museum: page width 360 (no sideways scroll), 0 page errors. Without WebGL the text version
   shows (Newgrange 19 stops, Great Pyramid 35, Delphi 24, Qumran 16); with WebGL it stays hidden. Stonehenge stays
   `noindex`.
6. **GitHub:** 9/9 checks completed and green on `73958d2`, Lighthouse included (02:24 UTC).

## Advisory (not a finding)
- A few stop texts give 3D instructions ("Switch it on here: the lamps go down…" at Newgrange). In the text version
  these read as instructions for a control that is not there. Harmless and honest; a later pass could tag such
  paragraphs as 3D-only and skip them in the text version.

## Item 4
Symbols lazy-load is not in this candidate. Carter's 21:31 ET note ("pass all under reviews") names #112 items 1–3 and
says merge on green, so item 4 goes on its own `loop/*` branch under the same bundle yes.
