# 2026-10-25 ~19:30 UTC — build loop: PR #53 fix run, part 1 (Mogao Caves)

**Item:** STATUS Next 1e, the fix run after the independent review of `befb607` (`2026-10-25-pr53-independent-review.md`).
One site this run, as 1e allows: **Mogao Caves, every fixable finding.** Göbekli Tepe, Delphi and Chichén Itzá are
untouched and still open.

## What changed on `claude/project-thread-s3qxre` (merge commits only, no force-push)
- `b7cf376` merges `main` `3785b2b` (#86) in, so the branch is current.
- `8aab255` Mogao fixes, `docs/pilgrimage/sites/mogao-caves/site.js` + `sources/pilgrimage-mogao-caves.md` (+ the
  generated entity registry):
  - "four tiers" → "as many as five levels" (UNESCO "492 caves built on five levels"); the cliff card says the model shows four.
  - Nine-storey building "rebuilt" → "repaired at least five times" (Ancient History Sites' words).
  - Cave 16 "large cave of the late Tang": dropped (no cited page dates Cave 16; e-Dunhuang's 晚唐 is Cave 17's).
  - Cave 17 "lay woman" → "woman attendant" (e-Dunhuang 近侍女).
  - Sealing card: the early-11th-century date is now Rong Xinjiang's; "may never be settled" → "harder to settle". Still flagged Contested.
  - Dispersal card: both views now sourced — Chinese scholars casting Stein as a villain and the present call for
    return (A. Robinson, *Times Higher Education* 2004; *Global Times* 2023 via Restitution Matters) and his
    defenders' "prevented further destruction" (Robinson). Still flagged "Still argued today", no side taken; it
    stays a Carter sensitivity point.
  - Cave 96: "finished in clay and paint" → a stone core (Ancient History Sites); repairs from the Tokyo abstract.
  - Maitreya card cut to what Britannica ("Tushita Heaven") says; the Tang-devotion and "colossi at several sites"
    lines dropped. Still flagged as belief.
  - Jataka card: plots from e-Dunhuang Cave 254 (bamboo to the neck, the leap from the cliff, several moments in
    one picture, Sibi and the hawk) and Smarthistory (bones, stupa); "perfection of giving" dropped.
  - Log: Cave 254 Maitreya posture now given (交脚弥勒, cross-ankled; the stand-in does not show it).
  Every new source was opened with a web fetch this run.

## Checks on `8aab255`
- Full build order + entity registry: only the registry changed (5 new source entries). 17/17 `verify-*.js` pass;
  `node --test framework/test/*.test.js` 42/42; `review-checks.js --base origin/main --build` 9 passed, 0 failed,
  0 warnings (Mogao Wikipedia share 0%).
- Headless phone 360 and 390 px, touch: page loads, no sideways scroll, canvas drawn, pending tag present, site
  module imports with 16 info points and no `undefined` refs; only console noise is the blocked Google Fonts.

## Still open on #53
Göbekli Tepe (incl. the missing "ttHouse" source and C/D sizes), Delphi (hymn panel, Pausanias, unsourced lines),
Chichén Itzá (decline date both views, sacrifice flag, Toltec framing, equinox source). Then a fresh independent
review by a run that made none of the fixes, checks green, then one yes/no to Carter. Preview/pending tags stay.

Items per run: 1. Not merged; nothing published.
