# Independent final review — PR #53, Pilgrimage batch 1

**Date:** 2026-10-25 evening EDT (2026-10-26 UTC)
**Reviewer:** an independent run that made none of the fixes under review
**Subject:** PR #53, branch `claude/project-thread-s3qxre`, head `aa7081d`
**Base for comparison:** live `main` `3785b2b`
**Verdict: PASS — 0 site findings**

PASS here means the site content passes: all 27 findings of the prior
independent review are verified fixed, and no new site defect was found.
It does NOT mean "merge now". Three gates still stand before any merge
(see "What still remains" below): a Lighthouse run green on this head,
Carter's yes for this exact head (`aa7081d`), and reconciliation of the
handoff files the PR branch carries (see note N3).

## Independence and scope

- This review was made by a run that wrote no commit on
  `claude/project-thread-s3qxre` and made none of the fixes in `373efff`.
- `aa7081d` (the current PR head) changes exactly one file against
  `373efff`: `handoff/replies/MERGEABLE.md`. No site file changed between
  `373efff` and `aa7081d`, so reviewing the head reviews the fix commit's
  site content.
- The fix commit itself (`373efff`) touches exactly the 17 files its
  report claims: the four `site.js` files, `greek.js`, `pillars.js`,
  `s2-enclosure-d.js`, the Göbekli and Mogao `dims.js` files, the rebuilt
  `pilgrimage-data.js` and Mogao page, the framework registry files, and
  the four source logs in `sources/pilgrimage-*.md`.
- Scope: the four new pilgrimage pages (Göbekli Tepe, Delphi, Mogao
  Caves, Chichén Itzá) — card text, renderings, source logs, registry
  and built pages — checked against the prior review's 27 findings and
  scanned for new unsourced claims, wrong figures, and broken links.
- No GitHub writes, no merge, no post, and no contact with the build
  loop were made in this review. Inspection only, plus local check runs
  on a read-only local copy.

## The 27 findings — all verified fixed

### Göbekli Tepe (`docs/pilgrimage/sites/gobekli-tepe/`)

1. **Fox pelt / necklace — FIXED.** `site.js` now says the hands meet
   above a belt "with a loincloth below it" and "Pillar 18 also appears
   to carry a fox under its arm". No pelt or necklace in the card text.
   `pillars.js` draws a plain loincloth and its comment states an
   earlier version drew a fox pelt and necklace symbols and "no checked
   source gives them". `s2-enclosure-d.js` was changed the same way.
2. **Pillar 27 — FIXED.** "On Pillar 27 a predator in high relief …
   crouches beside a boar in flat relief." ("beside", not "above".)
3. **Enclosure D superlative — FIXED.** "D is in an excellent state of
   preservation, and a 2012 report in Current World Archaeology calls
   it the largest." The superlative is attributed, not asserted; the
   `dims.js` comment was corrected to the same wording.
4. **Stonehenge comparison — FIXED.** The card now cites the DAI FAQ
   ("the 6000 year younger Stonehenge") alongside Clare and UNESCO.
5. **"Only a small part dug" — FIXED.** The card now cites the DAI FAQ
   ("only a small part of the site has been excavated").
6. **Vulture Stone — FIXED.** The Pillar 43 card's sources now include
   `REF.cwa` "(the vulture, its lifted wing and the disc)".
7. **ttFox author — FIXED.** The reference now gives only the post
   title and outlet (The Tepe Telegrams, 21 April 2017); no author
   ("J. Notroff") is claimed.
8. **Triangle — FIXED.** The card now says "the centres of the three
   enclosures form a nearly equilateral triangle, with each central
   pair set on its enclosure's centre point", flagged as one study's
   argument, not an agreed result.
9. **Kinzel & Clare — FIXED.** The roof card ("Open to the sky, or
   roofed?") now cites only Notroff ("significant possibility") and
   ttFox. The source log keeps Kinzel & Clare, marked "Not opened
   (JSTOR did not load)" and "(likely roofing)" — transparent, not
   relied on.

### Delphi (`docs/pilgrimage/sites/delphi/`)

10. **Manumission line — FIXED.** `greek.js` now renders
    "ΑΠΕΔΟΤΟ ΤΩΙ ΑΠΟΛΛΩΝΙ ΤΩΙ ΠΥΘΙΩΙ ΣΩΜΑ ΓΥΝΑΙΚΕΙΟΝ ΕΦ ΩΙΤΕ
    ΕΛΕΥΘΕΡΑ ΕΙΜΕΝ", with a comment that it is "the formula of CID V
    534 … with the names of seller and freed woman left out", and the
    card cites CID V 534 (Attic Inscriptions Online) and flags the
    lettering as "Usual formula, not one record".
11. **Omphalos — FIXED, with the flagged check resolved (see F2 below).**
    The card now attributes the bands to Strabo ("wrapped in bands")
    and softens the mesh to "it may have been covered with a mesh of
    woollen cloth", citing Strabo 9.3.6 "as summarised by Corpus
    Nummorum" plus the Wikipedia wording ("it is possible …").
12. **Ethylene — FIXED.** The card now says the rocks "were unlikely
    to produce ethylene in amounts that would cause a trance", matching
    the 2006 abstract's scope.
13. **Log reason — FIXED.** The Delphi source log now says the
    "earliest notated music with a named composer" line was dropped
    because the Oxford page says "one of the earliest pieces" — the
    card "leaves it out rather than state it without the condition".
    (The earlier log reason was wrong; the corrected reason is the one
    now on record.)
14. **Optional (temple date / hymn reading) — NOT DONE, as permitted.**
    The prior review marked this "minor, optional". Not a finding.

### Chichén Itzá (`docs/pilgrimage/sites/chichen-itza/site.js`)

15. **Maya-speaker figure — FIXED, with the flagged check resolved
    (see F3 below).** The Wikipedia-only 1.6 million figure is gone.
    The card now says "in the state of Yucatán alone, Mexico's 2020
    census counted about 519,000 speakers", and the reference gives
    INEGI 2020 via México Desconocido (6 July 2026): "519 mil 167
    hablantes de maya en la entidad". The source log is transparent
    that "INEGI's own table [was] not opened" and that the article
    "does not give the ages counted".
16. **Šprajc — FIXED.** Both the serpent card and the Caracol card now
    say Šprajc and Sánchez Nava "find no good evidence that buildings
    were aligned to the equinoxes" and that near-equinox alignments
    "more likely marked the 'quarter days'" — the narrower claim from
    the 2023 abstract, not "equinoxes did not matter".
17. **Peabody finds — FIXED.** "Most of the gold, jade and other finds
    went to the Peabody."
18. **De Anda — FIXED.** "De Anda's study of some 2,500 bones recovered
    in the 1960s found that about four in five came from children" —
    the bones are dated to the 1960s, not de Anda's study.
19. **Optional (Chaac) — NOT DONE, as permitted.** The prior review
    marked this "missing context, optional". Not a finding.

### Mogao Caves (`docs/pilgrimage/sites/mogao-caves/`)

20. **Rafters — FIXED.** Cave 254: "a gabled ceiling with rafters
    modelled in relief".
21. **Pillar purpose — FIXED.** The unsourced "pillar let worshippers
    walk round the image" claim is gone; the card now describes the
    pillar joining ceiling and floor with niches on all four faces.
22. **Plaster / walkways — FIXED.** Neither "paintings on plaster over
    the rock" nor the modern-walkways sentence appears in the card
    text. The source log records both drops.
23. **"Large" cave / late-Tang comment — FIXED.** "Large" is dropped
    from the Cave 16 description, and the `dims.js` comment that said
    "late Tang" now reads simply "Cave 16 and its corridor".
24. **Stein / Pelliot / IDP — FIXED.** The dispersal card now says
    Stein "persuaded Wang to sell him" (no "working for the British"),
    Pelliot "examined the manuscripts there by candlelight", and the
    closing IDP-online sentence is gone. The source log records all
    three drops and cites the IDP page for the candlelight wording.
25. **River — FIXED.** The opening card says the caves stand "above
    the Dachuan River" (UNESCO); "dry river" is gone.
26. **Sealing date — FIXED.** "Sealed for some nine centuries" in the
    Cave 16/17 blurb, the card, and the rebuilt registry blurb in
    `docs/assets/pilgrimage-data.js` (status "preview", pending true).
    The source log notes the date is Rong's view.
27. **Buddha height — FIXED.** "35.5 metres high (some sources say
    34)", and the `dims.js` comment gives the same range
    (China Daily 2025; other sources 34–35.5 m).

## The three flagged checks from the fix report — resolved

- **F1 — New pillar rendering (loincloth) on Enclosure D: PASS.**
  `pillars.js` draws a plain cloth hanging from the belt, outlined,
  with a comment citing the DAI FAQ ("hands resting on a belt with a
  loin cloth"); `s2-enclosure-d.js` was updated to match. No fox pelt
  or necklace remains in the rendering code or its comments except the
  explicit note that the earlier version was withdrawn for lack of a
  source.
- **F2 — Corpus Nummorum summary for Strabo 9.3.6: PASS, and
  independently confirmed against the primary text.** The card is
  transparent that Strabo is cited "as summarised by Corpus Nummorum"
  and softens the wool mesh to "may have been". I checked Strabo
  directly (Perseus, Geography 9.3.6, Hamilton translation): "In the
  temple is seen a sort of navel wrapped in bands, and surmounted by
  figures representing the birds of the fable." The card's Strabo
  claim is accurate; the summary attribution is honest. A future
  tidy-up could cite Perseus directly instead of the summary, but
  that is an improvement, not a defect.
- **F3 — Magazine article quoting INEGI for the census figure: PASS,
  independently corroborated.** The figure 519,167 for Yucatán in the
  2020 census is confirmed by a second, independent report of the
  same INEGI data (Riviera Maya News: "In 2010, Yucatán had 537,618
  Maya speakers. By 2020, that number had fallen to 519,167"). The
  card rounds it honestly to "about 519,000" and limits it to the
  state of Yucatán. The log's caveats (INEGI table not opened; ages
  not given in the article) remain on record and are accurate.

## New-issue scan

- No fake source found. No new unsourced claim found in the four
  `site.js` files: an overclaim scan for "proof / confirmed / settled /
  definitely" returned nothing asserted as fact (the only "proof"
  wording is the negated "no convincing proof of a celestial
  orientation had been put forward").
- Both lenses are present as the prior review found; contested points
  (sealing date, dispersal, Toltec, serpent, decline date, sacrifice,
  vapours, roofs) are flagged and left open; the Maya and Buddhists
  are treated as living traditions.
- All four built pages carry `noindex` and "pending full review"
  text, as a preview should.
- The commit-message slip noted in the fix report (a model name in
  `373efff`'s attribution line, against the loop's rule) is real but
  is a process slip, not a site defect, and was correctly not
  rewritten (no force-push on a shared branch). Not a finding.

## Checks run — exact results

All run locally, on a read-only blobless clone checked out at
`aa7081d`, with `origin/main` at `3785b2b`. Nothing was pushed.

- `node tools/review-checks.js --base origin/main --build`:
  **PASSED: 9 checks, 0 failed, 0 warnings.** internal-links PASS
  (9,020 internal links in 208 pages, all resolve); garbled-links
  PASS (208 pages clean); file-size PASS (largest 0.70 MB);
  fonts PASS; sitemap PASS (191 indexable pages, all in the
  sitemap); pending-banner PASS (19 pending pages show the banner;
  no cleared page shows it); pending-diff PASS (0 new/changed items
  unaccounted for); wikipedia-share PASS (Chichén 15%, Delphi 12%,
  Göbekli 0%, Mogao 0% — all under the 20% warning line); build PASS
  (working tree clean after the build — build output matches what
  is committed).
- `tools/verify-*.js` (all 17): **all exit 0, 0 failures**, including
  `verify-pilgrimage` (73 sites, 3 live, 7 preview; 235 links, relics
  and info points checked: OK).
- `node --test framework/test/*.test.js`: **42 pass, 0 fail.**
- `node --check` on the six edited site/rendering modules
  (Göbekli `site.js`, `pillars.js`; Delphi `site.js`, `greek.js`;
  Chichén `site.js`; Mogao `site.js`): **all OK.**
- Diff audit: `373efff` = 17 files as claimed; `aa7081d` = 1 file
  (`handoff/replies/MERGEABLE.md`) on top of it; PR-branch diff
  against `main` = 48 files (the four new sites, registry, source
  logs, plus the two handoff files in note N3).

## Checks NOT run — stated plainly, not claimed

- **Lighthouse: NOT RUN, NOT GREEN.** This environment has no
  Lighthouse package and no Chrome/Chromium, and the repo's
  `tools/lighthouse-pages.js` is a comparative local-performance
  tool, not the GitHub Lighthouse check. I do not claim any
  Lighthouse result for this head. The loop's Lighthouse gate must
  still be satisfied on `aa7081d` before a merge.
- **Headless phone opens: NOT REPEATED.** The prior review ran
  headless phone opens (390×844, 0 script errors) on the earlier
  head; I could not repeat them here (no browser available to this
  reviewer). Mitigating: all six edited modules parse, review-checks
  internal-links/garbled-links pass across all 208 pages, and
  `verify-pilgrimage` passes. This is a gap in repetition, not a
  finding — the loop's own headless re-run on the merge head would
  close it.

## Non-blocking notes (not findings)

- **N1 — Optional items 14 and 19** (Delphi temple-date/hymn detail;
  Chaac as cenote recipient) remain undone, as the prior review
  allowed. Neither blocks a pass.
- **N2 — Commit-message slip** in `373efff` (model name in the
  attribution line). Process note only; see above.
- **N3 — Handoff files on the PR branch need reconciliation before
  any merge.** The PR branch carries
  `handoff/replies/2026-10-25-pr53-independent-review.md` (the
  Pilgrimage thread's round-4 PASS of `0e74caa`, 549 lines) and a
  `handoff/replies/MERGEABLE.md` edit whose base text is the
  2026-10-17 snapshot. Staging's MERGEABLE already flags this: the
  PR-branch review file has the same name as a staging file with
  different content, and it must be reconciled before any handoff
  merge. Merging the PR as-is would also carry these handoff files
  into `main`. This is merge hygiene for the loop to resolve (e.g.
  drop the handoff files from the PR branch before fast-forward),
  not a defect in the pilgrimage pages themselves — but it must be
  resolved, not silently merged.

## What still remains before a merge

1. A Lighthouse run green on head `aa7081d` (not run here — see above).
2. Carter's yes for that exact head (`aa7081d`). His earlier "merge"
   does not cover the new head, per the option-A decision record.
3. Reconciliation of the PR branch's handoff files (note N3).
4. (For completeness) The loop's usual headless re-run on the merge
   head, since the headless opens were not repeated in this review.

## Findings list

**0 findings.** Every one of the prior review's 27 findings is
verified fixed in the current head, the three flagged checks pass
(two of them independently corroborated against primary or
second-source material), and the new-issue scan found nothing.
