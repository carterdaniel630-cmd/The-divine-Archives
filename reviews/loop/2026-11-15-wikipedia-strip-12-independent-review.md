# Independent review — PR #160, Wikipedia strip part 11 (Pilgrimage ×3 + the museum's English panel)

**Candidate:** `loop/wikipedia-strip-12` **`c01026a4`**, one commit directly on `main` `63cd573e` (reviewed diff `63cd573e..c01026a4`).
**Reviewer session:** ..01HFWzTk4njtEVKPDV8jARpC. Wrote none of #160 (builder ..01HFWzTkatVCCzKhrPwCz79t) and none of the site files it touches.
**Standard:** `reviews/REVIEWER.md` §3–§4; `handoff/order-2026-11-11-wikipedia-strip.md`; CLAUDE.md sourcing rules.
**Reviewed:** 2026-11-15 ~23:55 UTC.

## Verdict
**PASS — 0 open findings on the site diff.** Two report-level findings (F1, F2: sole-source claims the build report did not flag) are resolved in `handoff/` by adding **flags 166–167** to the re-sourcing list in STATUS. Neither needs a site change, so the candidate is unchanged.

## What was checked
1. **Scope.** 7 files, 47+/54−: `docs/museum/english.js`, three Pilgrimage `site.js` files and their three rebuilt `.html` pages. Every changed line is a `sources:`/`src:` list or a `REF` definition of a Wikipedia entry. No panel text, flags, links, positions or models changed.
2. **Every removed citation.** Chichen Itza: `tzo`, `cen`, `car` REFs deleted with all their uses; `cas` (El Castillo) removed from the `castillo`, `serpent` and `about` lists and **kept** on `inner`, its only source. Delphi: `wikiTemples`, `wikiStadium`, `wikiOmph` deleted with their uses (incl. the omphalos quotation). Newgrange: `wiki` ("a pointer only") deleted with its 6 uses (order item 3 by analogy). Museum: 5 Wikipedia links (v05, v43, v46, v47, v73), each keeping its Vault-entry link. Script check: all 88 English-panel entries still have a non-empty `src`, none contains wikipedia.
3. **No empty source list.** Every Pilgrimage panel still ends with at least one source. The one Wikipedia mention left on those pages is the kept El Castillo entry.
4. **Judgements asked of the reviewer.**
   - **Kept El Castillo on "The pyramid inside": accepted.** Removing it would leave the panel with no source at all; order item 4 says flag rather than strip bare. Flag 158 stands.
   - **`dims.js` comments ("via Wikipedia", 5): accepted as left.** Code comments, not shown to visitors, not a source list.
   - **ch01 / V90 Ark Tablet prose, ch19 source-note: accepted as left** under order item 2 (prose, not list entries). Note: ch19's line sits in the chapter's Sources area ("Researched from … Wikipedia's sourced overviews …"); it is a sentence, not an entry, so it is out of a list removal's scope, but it is the last visitor-visible "Wikipedia as a source" wording on a chapter. Recorded for Carter in STATUS (one-word wording question, not urgent).
5. **Religious-sensitivity.** Sacred Cenote panels (incl. the `SENS`-flagged one) and the Holy Lance / Piprahwa museum labels: only citations removed; nothing new shown, no text, image or model touched. Not a NEEDS CARTER item, same as earlier strip parts.

## Findings
**F1 (report-level, resolved in handoff). Chichen Itza "The pyramid of Kukulkan" panel sizes not flagged.** The panel states a 55.3 m base, nine bodies rising 24 m, a temple adding about 6 m, about 91 steps a side and the 365 count. Its list was El Castillo (Wikipedia, "sizes; the substructure …") + Šprajc & Sánchez Nava, *Arqueología Mexicana* 149. Šprajc's piece is about the equinox light and the orientation (it covers the 20° turn and 20 May / 24 July line-up); nothing shows it carries the dimensions. The "About this model" panel's "From published figures: the base, height, stepped bodies and stairways of the pyramid" also lost El Castillo and now cites only Guinness and the Met (both ball-court sources). **Resolution:** added as **flag 166** (confirm Šprajc carries the figures or re-source them; same source family as 158).

**F2 (report-level, resolved in handoff). Museum v05 Holy Lance, second line not covered by the Vault entry.** The report says v05's text is in its Vault entry. The gold-sleeve reading (LANCEA ET CLAVVS DOMINI) is; the second line, "The silver sleeve beneath, from Henry IV's time, calls it the nail of the Lord and names St Maurice", is not: the Vault entry dates the silver sleeve only "Ottonian/Salian" and gives no inscription. Not wrong (Henry IV was Salian), but now unsourced. **Resolution:** added as **flag 167** (source the silver-sleeve inscription directly; the Kunstkammer Wien object page is the obvious first stop).

Flags 158–165 from the build report are confirmed as described. This review did not open the remaining external sources for each of them, and STATUS says so.

## Local checks on `c01026a4` (reviewer's own run, separate worktree)
- Full build order (stamp-dates, og, vault, chapters, pages, museum, sky): **no diff**.
- `review-checks.js --base origin/main --build`: **9 passed, 0 failed, 0 warnings**.
- `tools/verify-*.js`: **18/18**. `node --test framework/test/*.test.js`: **51 pass, 0 fail**.
- Headless at 360 and 390 px: `pilgrimage/chichen-itza.html`, `delphi.html`, `newgrange.html`, `museum.html` all 200, no horizontal overflow (scroll width = viewport), no script errors; the only console error is the external font blocked by this sandbox's proxy (also on `main`).

## GitHub on `c01026a4`
9/9 completed and green: test, **lighthouse** (23:21 → 23:40 UTC), verify ×2, runtime ×2, checks, guard, links.

## Merge conditions (LOOP.md "Merging")
0. Per item: Carter's strip yes, `decisions-2026-11-15-carter-a-prs-yes-wikipedia.md` 2 (list removal only — confirmed above). ✔
1. Independent review, 0 open findings. ✔
2. GitHub green incl. Lighthouse. ✔
3. Local checks. ✔
4. Nothing needing separate approval (list removal; no new page, no cleared tag, nothing new shown). ✔
5. No commits after the candidate; `main` is still `63cd573e`, so a fast-forward. ✔
