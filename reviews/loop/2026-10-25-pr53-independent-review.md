# 2026-10-25 ~18:20 UTC — build loop: independent review of PR #53 (Pilgrimage batch 1) at `befb607`

**Verdict: NOT PASSED — about 30 fixable findings, 4 need Carter.** Reviewed `origin/main` (`45d4a95`)`...befb607` against
`reviews/REVIEWER.md` §3–§4 by a run that wrote none of #53 (this run's session made no commit on
`claude/project-thread-s3qxre`). The 17:50 Göbekli Tepe wording fix itself checks out. Not merged, not proposed to Carter yet.

## §3 automatic checks (clean worktree at `befb607`)
- Full build order (stamp-dates, og, vault, chapters, pages, museum, sky) + entity registry: 0 changes.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings. Wikipedia share: Chichén 20%,
  Delphi 18%, Göbekli 0%, Mogao 0%.
- 17/17 `verify-*.js` pass; `node --test framework/test/*.test.js` 42/42.
- Headless phone (360 and 390 px, touch), all four pages: 0 script errors, no sideways scroll, canvas drawn, the
  "pending full review" tag present (only console noise: Google Fonts blocked by this sandbox).
- GitHub on `befb607`: Lighthouse run 195 in progress at 18:20.

## §4 checklist — every source opened with a web fetch; ~75 claims checked across the four sites
No source in any log was shown to be fake. Every page keeps belief and evidence apart, uses no "proof"/"confirmed"
language, and is calm in tone; living traditions (Maya, Buddhists) are not framed as extinct or primitive.

### Needs Carter
1. **§4.6 rule:** four new pages about holy/ritual sites (incl. rendered Maitreya statues, Hongbian portrait,
   jataka murals, the Sacred Cenote and three sacrifice cards). Always Carter's call; no specific problem found.
2. **Göbekli Tepe, possible missing source:** "J. Notroff, 'A Sanctuary … or so fair a House?' (24 Jan 2017)"
   (`site.js` REF.ttHouse, used at :146) has no URL and was not found in three searches. May be badly indexed; the
   fix run must find it or replace it before this goes to Carter.
3. **Göbekli Tepe, sizes:** cards give D ≈ 20 m, C ≈ 30 m (`site.js:153,166`); the cited *Current World Archaeology*
   piece says "Enclosure D is the largest". Needs a measured plan, or the sizes hedged.
4. **Chichén Itzá, decline date:** "declined after about 1440" (`site.js:120`) follows UNESCO; Britannica has it
   eclipsed by Mayapán from c. 1200. A stronger source disagrees: state both.

### Fixable (for the fix run)
**Göbekli Tepe (`docs/pilgrimage/sites/gobekli-tepe/site.js`)**
- :133 "collected thousands of flint tools" → the source (Tepe Telegrams ?p=861) says slopes "clustered with flint".
- :133 "at least twenty enclosures": cite DAI geophysics post 2018-07-18 ("a minimum of 20 enclosures"), add to log.
- :139 fox on "one of" B's central pillars → both (Pillars 9 and 10); "lettered in order found", "A more oval" unsourced.
- :143 "their method has been questioned": name the critic or drop.
- :146 "grinding tools for cereals": not in Clare 2020; cite Dietrich et al. 2019 (PLOS ONE).
- :156 "The pillars are beings." → attribute ("the excavators read them as stylised human-like beings").
- :162 "the excavators reply" to Magli: the cited reply answers Sweatman, not Magli.
- :179 transport "several hundred metres", "ropes, rollers": source says <100 m to ~500 m; beams, wedges, sledges, planks.
- Minor: :123 Harran plain needs CWA cited; :169 "since 2019" unsourced; :172 "likely roofed" stronger than the FAQ's
  "conceivable"; :123 "did not yet farm" passes over the pre-domestication cereal debate; log: add the "More than a
  vulture" post URL.

**Delphi (`docs/pilgrimage/sites/delphi/`)**
- `s1-way.js:166` hymn panel is the real opening of the first Delphic Hymn, misspelled (ΚΛΥΤ → ΚΛΥΘ/ΚΕΚΛΥΘ, Α → ΑΙ,
  ΛΑΧΕΤ → ΛΑΧΕΤΕ; first word is an editor's supplement) while `site.js:175` and the log say it is not the hymn's text.
  Correct and relabel, or use non-text letters. Log's "only the two maxims are real wording" is also wrong (the
  manumission formula in `greek.js:110` is real wording).
- `site.js:201` "undying fire" credited to Pausanias 10.24.4–5, who names only the hearth: cite Plutarch or drop.
- `site.js:192` 4th-c. temple "paid for with contributions from all over the Greek world" unsupported as cited
  (Herodotus 2.180 is the 6th-c. rebuild); "finished about 330" rests on a Wikipedia list note.
- Unsourced: `:172` French reassembly of the Athenian Treasury; `:221` Christian emperors closing the cults, new
  village built; `:175` "among the earliest notated music with a named composer"; `:178` sphinx column "some ten
  metres" (Ministry gives ~12.45 m for the whole monument).
- Wrong source on card: stadium (`:227`) and omphalos (`:208`) figures come from Wikipedia/Odyssey, not the Ministry.
- `:213` *Greek Questions* 9: Plutarch ties the old yearly day to Apollo's birthday; only the monthly seventh is inference.
- Log: Patras press page contradicts itself on ethylene (use the paper abstract); *Geology* vol/issue not yet opened.

**Chichén Itzá (`docs/pilgrimage/sites/chichen-itza/site.js`)**
- :120 "at its height after about 800" unsourced (Britannica: most buildings 900–1200).
- :120 "six million … live in the region" sourced only to ch29, which means all Maya lands: reword, add outside source.
- :157 losing-team sacrifice given as the reading under a BELIEF flag; the Met: "it is unclear who was sacrificed".
  Flag Contested, give both readings.
- :136 "whether it was designed is doubtful" sides with Šprajc: say it is debated and credit the doubt to him.
- :146 Toltec debate framed as settled for exchange; Bíró & Pérez de Heredia 2016 (already cited) argue arrival.
  "Influence running both ways" unsourced.
- :179 equinox sunset credited to Aveni but comes from the Exploratorium page; clashes with the serpent card.
- :168 add that many victims were probably killed before deposit (Landa's "alive" is not the only account).
- Minor: :151 96 × 30 m is the Met's court figure, not "the playing alley"; :123 "finest of the four Maya books"
  unsourced; :143 carved skull rows sourced for Tula, not Chichén; :176 "two platforms" unsourced; :65 blurb
  "offerings, and people" unflagged; log lacks the Historia Mexicana author/year.
- Outside this PR: `eras/07-high-medieval/ch29-maya-high-medieval.md:47` asserts equinox design intent (own pass).

**Mogao Caves (`docs/pilgrimage/sites/mogao-caves/site.js`)**
- :53 "four tiers" → UNESCO says five levels.
- :148 "Many in China see it as theft … collectors long saw it as saving": neither cited source documents either
  view; source both or soften (and it stays a Carter sensitivity point, as the log says).
- :159 Maitreya card (Tushita, teaching forgotten, Tang devotion, colossi at several sites) unsourced.
- :167 jataka plots and "perfection of giving" unsourced (e-dunhuang gives titles and walls only).
- :145 "early in the eleventh century" is Rong's dating given as fact; "may never be settled" goes past the source.
- :138 "Cave 16 is a large cave of the late Tang" not on the cited page.
- :133 "rebuilt" → "repaired" at least five times; :156 "finished in clay and paint" unsourced.
- :142 "lay woman" → attendant (近侍女).
- Log: Cave 254 Maitreya posture is given by e-dunhuang (交脚弥勒), so "not confirmed" is out of date.

## Where this leaves #53
Back to the build side: one run fixes the fixable findings on `claude/project-thread-s3qxre` (merge commits only, no
force-push) and resolves Needs-Carter 2–4 by sources where it can; then a *different* run re-reviews; then one yes/no
to Carter carrying item 1. Preview, noindex and pending tags stay throughout.

## #86
Lighthouse run 194 on the approved head `3785b2b` started running ~17:48 (old run 193 on `cbf6f1e` finished green).
Not waited on with the lock. Next run: if green, re-run local checks and fast-forward `main`.

Filed on `review-log`: `reviews/loop/2026-10-25-pr53-independent-review.md`, index `reviews/2026-10-25-loop-pr53.md`.
Items per run: 1.
