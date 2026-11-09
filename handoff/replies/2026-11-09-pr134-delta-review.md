# PR #134 delta review — `489105ed..43850da4` (F1–F3 fixes)

**Verdict: PASS, 0 open findings.** Reviewer: session ..01HFWzToHt8256shdsp7mQn1 (wrote the original review, none of
the fixes; fixer was ..01HFWzTnBjFhWeM7UrkHCWVw). Diff: `docs/rotunda/isis.html` (2 lines), `sources/rotunda-tray1.md`,
`framework/registry/{index,source}.json` (regenerated).

- **F1 closed.** Philae sentence is now the suggested flag-not-resolve wording. Procopius *Persian Wars* 1.19.36–37
  (Justinian orders the Philae sanctuaries torn down; Narses does it) re-checked at
  https://hemed.univ-lemans.fr/cours2012/en/co/doc05.html; the debate (Dijkstra 2008) at BMCR 2009.06.43,
  https://bmcr.brynmawr.edu/?p=26464 (opened by this reviewer in the first review).
- **F2 closed.** "from Britain to the eastern provinces of Rome". National Geographic (opened this run) quotes the London
  jug "Londini ad fanum Isidis" and says the worship reached "as far north as Britain and as far east as Asia", which supports
  the new wording. The London Museum object page could not be opened from this session (permission timed out); the
  National Geographic quote carries the same inscription.
- **F3 closed.** Headless 390 px: the whole figure, crown included, shows at first load; 1280 also clean.
- Registry regeneration matches a fresh build (`review-checks --build`: tree clean).

Local checks on `43850da4`: review-checks 9 pass / 0 fail / 1 expected warn; verify all pass; tests 42/42; headless
360/390/1280 all four pages, 0 errors, pending tags shown. GitHub 8/8 green incl. Lighthouse (01:12 UTC).
Still open (not blockers under Carter's yes, `decisions-2026-11-09-carter-yes-merge-134.md`): C1 Isis face credit, C2
Socrates scan source — atlas/Muse to answer; fixed in place when they do.
