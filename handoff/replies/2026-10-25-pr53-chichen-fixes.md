# 2026-10-25 ~22:42–23:20 UTC — build loop: PR #53 fix run, part 4 (Chichén Itzá)

**Item:** STATUS Next 1e, the fix run after the independent review of `befb607` (`2026-10-25-pr53-independent-review.md`).
One site this run: **Chichén Itzá, every fixable finding, and review point 4 (decline date) settled by stating both
views.** With this, all four sites have had their fix run. No lock was held when this run started.

## What changed on `claude/project-thread-s3qxre` @ `e8ce493` (one commit on `6f314d4`, no force-push)
`docs/pilgrimage/sites/chichen-itza/site.js`, `dims.js` (comment only), `sources/pilgrimage-chichen-itza.md`, generated registry.
- **First card:** "at its height after about 800" → "most of its great buildings probably date from about 900 to 1200"
  (Britannica). Decline given both ways: Britannica (eclipsed by Mayapán from c. 1200) and UNESCO (rapid decline after
  c. 1440), new flag "Decline: two dates". "Six million … in the region" (from ch29, meaning all Maya lands) →
  "in the Yucatán peninsula alone, more than a million and a half people are counted as Yucatec Maya" (Wikipedia, 2020).
- **Serpent of light:** "Whether it was designed is doubtful" → widely presented as designed, debated; the doubt
  credited to Šprajc and Sánchez Nava.
- **Temple of the Warriors / Toltecs:** no longer settled for exchange. Now gives UNESCO's conquest, Britannica's
  Maya-speaking invaders perhaps directed by Toltecs, Bíró and Pérez de Heredia 2016 (arrival of "Mexican-Toltec"
  people and a refounding with part of the local nobility), *Twin Tollans* (relations, not migration), and World
  History Encyclopedia (Chichén may have influenced Tula). Ends "The question is open." "Influence running both ways" dropped.
- **Bench panels:** losing-team reading kept as one reading only; the Met's "unclear who was sacrificed and when"
  quoted; flag Contested added.
- **Victims:** de Anda's conclusion that victims were usually, though not always, killed before deposit, beside Landa's "alive".
- **Venus:** the 20-of-29 count is no longer pinned on Aveni (Wikipedia gives it without naming him); Venus and the
  equinox sunset credited to the Exploratorium page, with Šprajc's doubt on the equinoxes (no longer clashes with the serpent card).
- **Minor:** ball-court figures attributed (Guinness overall; the Met's "court" figure, used for the alley, said so);
  "ways into" → "connections to" the underworld (the Met's word); "finest" dropped from the Dresden Codex card;
  skull rack sourced at Chichén (Open Heritage 3D dataset page; Tiesler and Miller 2023 abstract: heads displayed,
  impaled skulls found at Chichén); El Caracol's "two platforms" → "a platform reached by a great stairway on two
  levels" (WHE); the cenote blurb now says the sacrifices rest on a Spanish account and the bones; Historia Mexicana
  author and year (Guillermo Palacios, 2017) from El Colegio de México's record page.
Every source above was opened with a web fetch this run (Britannica as its print view; Tiesler and Miller abstract only).
Not opened and so not used: Britannica's main page (blocked), Biblat. Preview/noindex/pending tags untouched.

## Checks on `e8ce493`
- Full build order + framework + entity registry: only the registry changed (new source entries). 17/17 `verify-*.js`;
  42/42 tests; `review-checks.js --base origin/main --build` 9 passed, 0 failed, 0 warnings (Chichén Wikipedia share 19%, 5/26).
- Headless phone 360 and 390, touch: page loads, no sideways scroll, canvas drawn, pending tag shown, 18 info points +
  about, no `undefined` in any card; only console error is a blocked outside font request.
- Visual pass skill (frontend-design) not used: text change only, no layout change.

## For the re-review
Check the Toltec card's wording against Britannica and the 2016 disc abstract; that Open Heritage 3D is acceptable for
the carved skull rows; that the Met figure is fairly described as used for the alley.

## Still open on #53
Nothing left to fix site by site. Next: a **fresh independent review** of `e8ce493` by a run that made none of the
fixes, GitHub checks green, then one yes/no to Carter (new content + §4.6 holy-site pages). Outside the PR, own pass
later: `ch29` line 47 asserts equinox design intent.

Items per run: 1. Not merged; nothing published.
