# Independent review — PR #157, Wikipedia strip part 9 (theme chapters ch01, ch47–ch51)

**Candidate:** `loop/wikipedia-strip-10` **`77a3d2ad`** on `main` `78a50014` (one commit, fast-forwards).
**Reviewer session:** ..01HFWzTp6Y1ujBLuKKHC5mS9. Wrote none of #157 (builder ..01HFWzTnC46rbNLPpRHGbWk9) and none of the site files it touches.
**Standard:** `reviews/REVIEWER.md` §3–§4; `handoff/order-2026-11-11-wikipedia-strip.md`; CLAUDE.md sourcing rules.
**Reviewed:** 2026-11-15 ~18:50 UTC.

## Verdict
**PASS — 0 open findings on the site diff.** One report-level finding (F1, a sole-source claim the build report did not flag) is resolved in `handoff/` by adding flag 121 to the re-sourcing list; it needs no site change, so the candidate is unchanged.

## What was checked
1. **Scope.** `git diff 78a50014..77a3d2ad`: 15 files — 6 theme markdowns, `content/chapters.js`, the 6 built chapter pages, and the generated `content/dates.json` / `docs/sitemap.xml`. In every markdown and in `chapters.js`, every changed line is inside the Sources list. No prose, headings, pending fields or other sections touched.
2. **The 19 removals.** Each Wikipedia link in the build report's table is gone from markdown, `chapters.js` and the built page; counts match (ch01 5, ch47 2, ch48 2, ch49 2, ch50 3, ch51 5). `chapters.js` changes mirror the markdown line-for-line (13 replaced, 5 removed).
3. **The 5 whole-bullet removals** (ch47 Inanna/Ereshkigal, ch49 Sapa Inca, ch50 Frashokereti, ch50 Mahdi, ch51 pharmakos): each bullet's only citation was Wikipedia; removal whole follows the parts 5–8 rule. All five are flagged (116–120). No Sources subsection or section is left empty (fewest left: 5, ch48/ch49).
4. **ch01 Ovid/Plato keep:** correct. The primary texts are themselves the cited sources, matching "Genesis 6–9" in the same list and the part 2 precedent.
5. **ch01 Telegraph (India) wording** ("is cited via the Wikipedia page" dropped, leaving "the text was read from a copy;"): accepted. The clause pointed only at the removed link; keeping it would leave a dangling Wikipedia reference in the list. It stays honest (the paper's URL could not be opened; the text was read from a copy). It is thinner as a pointer — noted for the re-sourcing pass, not a finding.
6. **ch01 Finkel replica note** (removed with its link): the 1985 and 2009 dates still rest on the *Jewish Chronicle* quotes in the same list; the "fifth" and "pumps" details rest on PBS NOVA. See F1 for the one detail that does not.
7. **ch01 prose mention** ("the *Jewish Chronicle* and Wikipedia say Finkel first saw it in 1985") left standing per order item 2 and flagged in the build report. Correct handling.
8. **Remaining bullets** that lost a Wikipedia co-citation (ch01 Eridu, Berossus, Black Sea; ch48 Gimbutas, thealogy; ch49 Frazer; ch50 comparative apocalyptic; ch51 korban, Azazel, Aztec, Girard) still have at least one non-Wikipedia source each. The build report's "thinner" list names them accurately.
9. **Pending tags:** unchanged from `main` (ch01, ch47, ch50, ch51 show the tag; ch48, ch49 were already cleared and `review-checks` confirms "sources only, stays cleared"). Nothing cleared by this PR.

## Findings
**F1 (report-level, resolved in handoff).** ch01 body, "The ark builder's manual": "a fifth of the tablet's size by the documentary's own count, **though some accounts say a third**." The removed Wikipedia note ("gives 'one-third scale'") was the only listed source for "a third": NOVA says a fifth, the Telegraph (India) says "bigger than one-fifth", and no other ch01 source in the list is quoted for a third. Order item 5 says such a claim must not be left silently unsourced. **Resolution:** added as **flag 121** in STATUS's re-sourcing list (find a non-Wikipedia account giving one-third, or soften the clause on Carter's say — ch01 prose changes need him). No site change needed; the order forbids prose edits here.

## Local checks on `77a3d2ad` (reviewer's own run)
- Full build order (stamp-dates, build-og, build-vault, build-chapters, build-pages, build-museum, build-framework, build-entity-registry): **no diff** in the tree.
- Every `tools/verify-*.js`: **18/18 pass**. `node --test framework/test/*.test.js`: **51/51**.
- `review-checks --base origin/main --build`: **9 pass / 0 fail / 1 warn** (pending-diff: sources only, stays cleared).
- Crawl: 0 `wikipedia.org` anchors on all 6 built pages; only text mention is the ch01 prose line above.
- Headless Chromium, 360 and 390 px × 6 pages: standards mode, 0 script errors, no sideways overflow, 0 empty list items.

## GitHub on `77a3d2ad` (18:47 UTC)
9 of 10 checks completed green (guard, checks, originality, runtime ×2, test, verify ×2, links). **Lighthouse in progress** (started 18:41 UTC). Not merged.

## Merge
Per item, on Carter's strip yes (`decisions-2026-11-15-carter-a-prs-yes-wikipedia.md`). Still missing: Lighthouse green on `77a3d2ad`. Then any run may fast-forward after re-running local checks and confirming `main` is still `78a50014`.
