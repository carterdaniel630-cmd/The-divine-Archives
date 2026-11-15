# Independent review — PR #159, Wikipedia strip part 10 (the Vault + Rök Stone, Decoded)

**Candidate:** `loop/wikipedia-strip-11` **`63cd573e`**, stacked on #158 `089441d5` (reviewed diff `089441d5..63cd573e`, two commits).
**Reviewer session:** ..01HFWzTpTaZS132Vycb42g63. Wrote none of #159 (builder ..01HFWzToHofH6REksVyk3KJC) and none of the site files it touches.
**Standard:** `reviews/REVIEWER.md` §3–§4; `handoff/order-2026-11-11-wikipedia-strip.md`; CLAUDE.md sourcing rules.
**Reviewed:** 2026-11-15 ~23:10 UTC.

## Verdict
**PASS — 0 open findings on the site diff.** Two report-level findings (F1 flag-number clash, F2 a missed sole-source claim and prose mention on V90) are resolved in `handoff/` (STATUS re-sourcing list). Neither needs a site change, so the candidate is unchanged.

## What was checked
1. **Scope.** 174 files: 85 `vault/*.md` (1 insertion, 183 deletions), 86 built `docs/vault/*.html`, `content/dates.json`, `docs/sitemap.xml`, `docs/assets/search-index.json`. Every changed markdown line is inside `## Sources`. No prose, headings, registry or pending fields touched.
2. **Every removed line, by script.** 169 removed lines carry a wikipedia.org link; each was a Wikipedia-only bullet (some with two Wikipedia links: V05, V13, V24, V26). The only removed lines without Wikipedia are blank lines and the five emptied subsection labels (V03 *Doreal*, V34 *The pyramid and its texts*, V37 *Comparisons*, V66 *Ark and tradition*, V73 *The stele*), per order item 4. No Sources section emptied.
3. **The one mixed bullet (V08).** "Gospel of Thomas" Wikipedia + NASSCAL → "- NASSCAL e-Clavis, https://www.nasscal.com/e-clavis-christian-apocrypha/gospel-of-thomas/". **Accepted as is.** The label was the Wikipedia article's title; the NASSCAL URL names the Gospel of Thomas, and the next bullet is Lambdin's translation of it, so the reader loses nothing. Adding `"Gospel of Thomas"` back would be optional polish, not a fix.
4. **Rök Stone, Decoded:** only the "(a pointer only)" Wikipedia `<li>` removed (order item 3).
5. **Generated files.** `dates.json` / sitemap: modified-date stamps for the 85 entries (expected for any markdown change). Search index: V52, V59 text windows only.
6. **Pending/cleared.** `review-checks` treats every cleared entry as "sources only, stays cleared" (needs #158). Nothing cleared or uncleared.
7. **Religious-sensitivity.** V26 Black Stone, V27 Sacred Tooth Relic, V66 Kebra Nagast, V77/V87 living traditions: only source-list bullets removed, no images, models or prose touched. The builder marked them "re-source with care". Not a NEEDS CARTER item: nothing new is shown, and this is the same list removal Carter's strip yes covers.

## Findings
**F1 (report-level, resolved in handoff). Flag-number clash.** The build report numbers its sole-source flags 121–155, but **flag 121 already exists** (ch01 "though some accounts say a third", added by the #157 review). **Resolution:** the Vault flags are renumbered **122–156** in STATUS (same order, same text: old N → N+1).

**F2 (report-level, resolved in handoff). V90 Ark Tablet: one sole-source claim and one prose mention not flagged.** The report says "Prose mentions left standing: none", but V90 is the one Vault entry whose prose names Wikipedia:
- "How the two dates fit": "*Historia* and the *Jewish Chronicle* (and the Wikipedia article on the 2014 replica) put a first viewing in 1985". The 1985 date is still carried by *Historia* and the *Jewish Chronicle* in the list, so it is not unsourced; the parenthesis now points at a removed source. Left standing per order item 2 (V90 prose is Carter's say, as for the ch01 line).
- Replica paragraph and "genuinely open" line 59: "a fifth … **though some accounts say a third**" / "other accounts a third". Same claim as ch01 flag 121: no remaining V90 source gives one-third (NOVA says a fifth; the Channel 4 press release, fetched 23:05 UTC, gives no scale at all). Order item 5 says it must not go silently unsourced.
**Resolution:** added as **flag 157** in STATUS (re-source "a third" together with flag 121, or soften both on Carter's say; the parenthesis is the same one-word fix as ch01's). V90 is still pending, so no cleared content is affected.

The other flags (122–156) are the builder's heuristic (subject of a removed article named by no remaining source); this review did not open each remaining source, and STATUS says so.

## Local checks on `63cd573e` (reviewer's own run)
- Full build order (stamp-dates, build-og, build-vault, build-chapters, build-pages, build-museum, build-framework, build-entity-registry): **no diff**.
- Every `tools/verify-*.js`: **18/18**. `node --test framework/test/*.test.js`: **51/51**.
- `review-checks --base origin/main --build`: **9 pass / 0 fail / 1 warn** (sources only, stays cleared).
- Crawl: 0 `wikipedia.org` on all built Vault pages and `vault.html`; the only text mention is V90's prose line above.
- Headless Chromium, 86 pages × 360/390 px, run on both `089441d5` and `63cd573e`: identical results apart from the removed Wikipedia anchors. 0 script errors, standards mode, Sources present, 0 empty list items. Two pre-existing items, identical on the base and **not introduced here**: rosetta-stone 11 px overflow at 360 (cartouche, already in Next); and an empty `<ul></ul>` after the opening quotation on 37 pages (e.g. aleppo-codex), invisible, worth a later tidy in `build-vault.js`.

## GitHub on `63cd573e` (23:00 UTC)
6 of 7 completed green (guard, checks, originality, runtime ×2, links). **Lighthouse in progress.** Not merged.

## Merge
Per item on Carter's strip yes (`decisions-2026-11-15-carter-a-prs-yes-wikipedia.md`), **after #158 is merged** (needs Carter's per-item yes). Then: Lighthouse green on `63cd573e`, re-run local checks, confirm `main` still `fa81753b` + #158, fast-forward.
