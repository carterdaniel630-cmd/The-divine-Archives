# Independent review — PR #151, Wikipedia strip part 3 (era 04)

**Reviewed:** 2026-11-15 ~16:30 UTC, session ..01HFWzTp4SWXd1VbqKC8njjF (wrote none of `ffa58624`; the builder was ..01HFWzTmdFQ6fNZymPZSKAiC).
**Candidate:** `loop/wikipedia-strip-04` **`ffa58624`**, diff `origin/main` `ef7e4d30`..`ffa58624` (one commit, fast-forwards; `main` unchanged at review time).
**Checklist:** `reviews/REVIEWER.md` §3–§4, against `handoff/order-2026-11-11-wikipedia-strip.md`.

## Verdict: PASS, 0 open findings

One addition to the builder's sole-source list (note N1 below). It changes no site file, so it is not a finding against the candidate.

## §3 automatic checks (run on `ffa58624` in a clean worktree)
- `node tools/review-checks.js --base origin/main --build`: **9 pass / 0 fail / 1 warn**. The warn is the expected one: ch10, ch13, ch14 and ch15 are "sources only, so it stays cleared". Working tree clean after `--build`, so the committed build output is current.
- `tools/verify-*.js`: **18/18 pass**. `node --test framework/test/*.test.js`: **51/51 pass**.
- GitHub on PR #151 (16:20 UTC): **9 of 10 green** (test, originality, checks, runtime ×2, guard, verify ×2, links). **Lighthouse still in progress** (run 43734192566).

## Diff checks
- **27 removals counted, matching the reply:** ch10 3, ch11 2, ch12 2, ch13 6, ch14 8, ch15 2, ch52 4. `grep -ci wikipedia` gives 0 for every era 04 markdown file and every built era 04 page (ch10–15, ch52, ch69, ch78).
- **Nothing outside Sources changed.** `content/chapters.js`: only Sources `<li>` lines (14 replaced, 5 removed). Built pages: those `<li>` lines plus the dateModified stamp. Also `content/dates.json` and `docs/sitemap.xml` (dates only).
- **The page matches its markdown.** `tools/md-to-chapter.js` output for all seven touched chapters: every generated `<li>` appears verbatim in `chapters.js`. The one exception is ch15's evidence-section bullet "number- mysticism", which is in the body, not Sources. It is identical on `main`, so it was there before this PR and this PR did not change it. Noted for a later tidy.
- **Pending state unchanged:** ch11, ch12 and ch52 stay pending; ch10, ch13, ch14 and ch15 stay cleared. That is correct for a sources-only change.
- **Headless Chromium at 360 and 390, all 9 era 04 pages:** standards mode, 0 script errors, no sideways overflow, 0 "wikipedia" in the HTML, and no Sources item ending on "—", ";", ",", " in" or " and".

## The rules used (the builder asked for a ruling)
- **A bullet left naming no source goes whole: agree.** This is not new. Part 1 did the same (ch03 Descent of Inanna, ch05 Gayatri) and so did part 2 (ch08 alphabet, ch58 El), and both passed review. A bullet whose only text was a label for the Wikipedia links names no source once they go. Leaving it would show an empty citation, which is worse. Every claim it covered is in the flag list.
- **Kept names (ch13 *Senatus consultum*, ch14 Coligny calendar and Brunaux, ch10 Proverbs/Ben Sira/Wisdom):** these are primary texts, objects and a scholar, kept as plain text. That matches the part 2 F1 ruling.
- **Topic labels dropped (ch15 "unmoved mover"):** consistent with part 2. The reworded line reads correctly.
- No Sources subsection or section was left empty (order item 4). No prose mentions Wikipedia (order item 2).
- `sources/` logs still hold Wikipedia lines. This matches parts 1 and 2: `sources/` is not published under `docs/`, so it is outside the order's "every page on the site".

## Sample check of the "thinner, but still sourced" claims (§4.1)
- **ch13 Lemuria → WHE "Roman Household Spirits"**: fetched. It covers the Lemuria (9, 11 and 13 May), the Lemures and the Parentalia. It does **not** mention the black beans. See N1.
- **ch14 Cernunnos and Taranis → Britannica "Celtic religion"**: fetched the "The Celtic gods" section. It names Cernunnos ("Horned One") and Taranis. Confirmed.
- **ch15 Sisyphus fragment → IEP "The Sophists"**, and **ch12 Celestial Masters → SEP "Religious Daoism"**: not checked. The fetch was refused in this unattended run, and no other route was used. The builder's classification stands unverified for these two. Neither is a site change; a sourcing pass can confirm them.
- Religious sensitivity (§4.6): no images, objects or sites are touched. ch52's Sallekhana text is unchanged; only its Wikipedia citation went, and it is flagged (flag 10). Nothing is NEEDS CARTER.

## Note N1: add flag 12 to the sole-source list
**ch13: the black beans thrown to the Lemures at the Lemuria.** The bullet still names the rite. Its remaining source (WHE) covers the festival but not the beans, so this detail now has no source of its own. Add it to the re-sourcing list from the well, next to flags 3–4. No change to the PR.

## Merge status
Not merged. **Still missing:** a green Lighthouse on `ffa58624`. Then the merging run re-runs local checks, confirms `main` is still `ef7e4d30` and fast-forwards. It merges **per item**, on Carter's strip yes (`decisions-2026-11-15-carter-a-prs-yes-wikipedia.md`: the 11-11 ruling is the yes for each strip part). This run did not wait on Lighthouse while holding the lock.
