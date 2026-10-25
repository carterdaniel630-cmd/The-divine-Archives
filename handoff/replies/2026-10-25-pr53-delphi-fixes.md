# 2026-10-25 ~21:42–22:40 UTC — build loop: PR #53 fix run, part 3 (Delphi)

**Item:** STATUS Next 1e, the fix run after the independent review of `befb607` (`2026-10-25-pr53-independent-review.md`).
One site this run: **Delphi, every fixable finding.** Chichén Itzá is untouched and still open. The 19:42 run's lock
(also "part 3 Delphi") was found ~2 h old with no Delphi commit on the branch: taken over as stale.

## What changed on `claude/project-thread-s3qxre` @ `6f314d4` (one commit on `2dd1158`, no force-push)
`docs/pilgrimage/sites/delphi/site.js`, `s1-way.js`, `sources/pilgrimage-delphi.md`, generated registry.
- **Hymn panel** (`s1-way.js`): the misspelled lines are replaced by the first hymn's real opening as edited by
  Furley and Bremer (2001, as reproduced on classics-at.chs.harvard.edu): ΚΕΚΛΥΘ ΕΛΙΚΩΝΑ ΒΑΘΥΔΕΝΔΡΟΝ / ΑΙ ΛΑΧΕΤΕ ΔΙΟΣ
  ΕΡΙΒΡΟΜΟΥ / ΘΥΓΑΤΡΕΣ ΕΥΩΛΕΝΟΙ ΜΟΛΕΤΕ (only lines 1–2 of the edition, which were opened; line 3 was not). The card
  now says so, gives the translation (after Attic Inscriptions Online, CID III 1), says the first word is a
  restoration and the signs above are illustrative. Flag: "Words: the editors' text; signs illustrative".
- "Among the earliest notated music with a named composer": dropped (not in the sources); the card names the
  composer, Athenaios son of Athenaios (Delphi Museum 2025).
- **Hall:** the undying fire is now credited to Plutarch, *Life of Numa* 9 (kept by widows past marriage), not Pausanias.
- **Temple:** "paid for with contributions from all over the Greek world" / "finished about 330" replaced by the
  Ministry's temple page: the Amphictyony collected the money, a board of naopoioi from many cities oversaw it,
  stopped 356, resumed c. 343, finished 334–333, pediments 327. Herodotus 2.180 now marked as the 6th-c. rebuild.
- **Athenian Treasury:** rebuilt 1906 by French archaeologists, paid for by the city of Athens, about four-fifths
  original stone (Kenyon College Baly slide collection); hymn stone in the museum, plaster copy on the building (Ministry).
- **Sphinx:** column about 10 m (Delphi Museum 2024); whole monument about 12.5 m (Ministry 12.45 m).
- **End of the oracle:** Theodosius's decree in the 390s and the Christian community to the 7th century (World History
  Encyclopedia); Kastri's people built new houses nearby (Delphi Museum archive photograph, 1892).
- **Stadium** card now credits Odyssey Adventures and Wikipedia; **omphalos** card credits Wikipedia (as the log said).
- **Greek Questions 9:** Plutarch does tie the old once-a-year day to Apollo's birth (in Bysios) and says monthly
  consultation is recent; card now says so and keeps only "the seventh" as modern inference.
- **Vapours:** follows the 2006 paper's abstract (methane, ethane, CO2 today; setting not prone to ethylene in trance
  amounts; oxygen shortage more plausible); full author list and 34(10) 821–824. Patras press page dropped.
  de Boer 2001 given as *Geology* 29 (August 2001): issue number and pages not opened, so not stated.
- **Log:** "only the two maxims are real wording" corrected (hymn panel and the Polygonal Wall's manumission formula
  are real wording; the formula's exact wording against an edited record is still not checked, said in the log).
Every source above was opened with a web fetch this run. Flags stay; preview/noindex/pending tags untouched.

## Checks on `6f314d4`
- Full build order + entity registry: only the registry changed (new source entries). 17/17 `verify-*.js`; 42/42 tests;
  `review-checks.js --base origin/main --build` 9 passed, 0 failed, 0 warnings (Delphi Wikipedia share 13%).
- Headless phone 360 and 390, touch: page loads, no sideways scroll, canvas drawn, pending tag shown, 25 info points,
  no `undefined` in any card that has sources; only console error is the blocked Google Fonts.
- Visual pass skill (frontend-design) not used: text change plus three panel lines, no layout change.

## For the re-review
Check the hymn panel letters against the edition; the manumission formula wording; that the Kenyon slide record is an
acceptable source for the 1906 rebuild (no French School source could be opened).

## Still open on #53
Chichén Itzá (decline date both views, sacrifice flag, Toltec framing, equinox source, minor lines). Then a fresh
independent review by a run that made none of the fixes, checks green, then one yes/no to Carter.

## Carter's messages during this run
OmniRoute: asked, then withdrawn ("nevermind"); nothing installed. Branch clean-up: asked whether done and to try
again; not done, not tried (the loop never deletes branches; GitHub refused it earlier); told how to do it in GitHub.

Items per run: 1. Not merged; nothing published.
