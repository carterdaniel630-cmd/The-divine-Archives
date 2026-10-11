# Sandboxed framework extension: Phase 1 (schemas and tools only)

Status: **Phase 1 built on branch `claude/framework-sandbox`, draft PR, not merged. Nothing on
the live site changes.** Phase 2 (wiring the game adapters, a tier-1 ritual prototype in the
museum) waits for Carter's approval. Written 2026-10-11.

## What Phase 1 adds

All new files, plus one edit to `.github/workflows/lighthouse.yml` (Law 4). No file in `docs/`,
`mini-games/`, `museum/` or `content/chapters.js` is touched.

| Law | Files | What it is |
|---|---|---|
| 1 | `framework/schema/entity.schema.json`, `framework/schema/event.schema.json` | Every archive thing gets a stable ID `<type>:<slug>`. A visitor event is `{id, ts, entity, verb, payload}`, with verbs viewed, started, completed, unlocked and scored |
| 1 | `framework/ledger.js` | Standalone, append-only event ledger in localStorage. Pub/sub. Derived state (seen, finished, unlocked, best scores) is computed by replaying events, never stored. No edit or delete exists |
| 1 | `tools/build-entity-registry.js` → `framework/registry/*.json` | The registry, one shard per entity type, built from the repo's own data files. Sorted, no timestamp, `--check` mode for CI |
| 2 | `framework/engine/sequence-engine.js` | Content-neutral step player. It reads only `sequence_order`, `pacing_duration_ms`, `input_trigger_type`, `historical_text_anchor_id` and `source_ids`. No scores and no win or lose state |
| 2 | `framework/test/engine-neutral.test.js` | Fails if any tradition, deity or practice name appears in `framework/engine/`. The word list comes from the site's own data (Pantheon traditions, chapter titles, ritual files) plus a fixed list, so new traditions are covered automatically. It caught the project name ("Divine") in the engine's header on the first run |
| 2 | `framework/schema/ritual.schema.json`, `data/rituals/*.json`, `plans/rituals-tiers.md` | The ritual format (tier 1–3, sources, fixed framing, opt-in), two tier-1 drafts, and the tier list |
| 3 | `tools/originality-check.js`, `tools/originality-lib.js`, `tools/build-originality-baseline.js`, `sources/baseline/`, `tools/hooks/`, `.github/workflows/originality.yml`, `reviews/ORIGINALITY.md` | The copying check: word 8-gram overlap with the cited pages, failing above 20%; never a silent pass |
| 4 | `.github/workflows/lighthouse.yml` (edited) | Advisory on drafts and non-main targets; the hard >5-point gate stays for ready-for-review PRs into main |
| — | `.github/workflows/framework.yml`, `framework/test/*.test.js` | 26 tests: ledger, engine, neutrality, schemas, registry freshness, originality |

## Law 1: the entity map and the real count

**4,129 entities. The target is 10,000+, so the registry is short by 5,871.** These are counted
from the repo, not estimated.

| Type | Count | Read from | ID pattern |
|---|---:|---|---|
| source | 1,719 | every distinct URL in `sources/*.md`, linked to the chapters, Vault entries and sites that cite it | `source:<host>/<hash>` |
| section | 939 | the `<h2 id>` anchors in the prerendered chapter pages (the chapter text a ritual step can point to) | `section:ch02/<anchor>` |
| symbol | 504 | distinct signs (by Unicode code point) on the museum's five symbol walls; 528 placements | `symbol:u-<codepoint>` |
| figure | 199 | Pantheon figures | `figure:<id>` |
| star | 177 | named stars in the planetarium (not the 20,176 unnamed catalogue stars) | `star:<name>` |
| constellation | 88 | IAU constellations in the planetarium | `constellation:<abbr>` |
| relic | 88 | Vault objects | `relic:v01` |
| chapter | 83 | `docs/assets/data.js` | `chapter:ch01` |
| room | 83 | museum rooms | `room:ch01` |
| site | 72 | Pilgrimage sites (1 live, 2 noindex previews, 69 queued; the hidden arcade is not in the list) | `site:<id>` |
| waypoint | 65 | info points of the sites that have a module: Great Pyramid 36, Qumran 17, Library of Alexandria 12 (each checked against its file) | `waypoint:<site>/<id>` |
| tradition | 30 | Pantheon traditions | `tradition:<key>` |
| skylore | 18 | planetarium lore cards | `skylore:<id>` |
| symbolset | 17 | sign sets on the symbol walls | `symbolset:<wall>/<n>` |
| game | 12 | the 12 mini-games | `game:<id>` |
| wing | 10 | museum wings | `wing:<era>` |
| era | 9 | eras | `era:<slug>` |
| theme | 8 | comparative themes (one is still planned, with no chapter) | `theme:<slug>` |
| trail | 6 | museum trails | `trail:<id>` |
| ritual | 2 | `data/rituals/` (drafts) | `ritual:<slug>` |

Every link and parent in the registry points to an entity that exists (0 dangling). The tests
check every entry against the schema.

**Not counted, on purpose:**
- The 20,176 unnamed stars in the planetarium catalogue. They would put the count over 10,000,
  but they are catalogue rows, not things a visitor meets or the archive writes about.
- The 74 URLs that appear only in a chapter's own Sources section and not in its log in
  `sources/`. The originality baseline uses them (1,793 URLs in all); the registry reads the
  logs only. Easy to add if Carter wants them counted.

**What would honestly close the gap** (none of it is built; each needs a change to the site's
build, so Phase 2 or later, with approval):
1. **Evidence claims.** Each "supported / not supported / open" item in the chapters' evidence
   sections as its own entity. From the evidence section to the end of each chapter page there
   are 7,831 list items, which include the source lists, so the claims alone are fewer, likely
   in the low thousands. They need stable claim anchors written by `build-chapters.js` first.
2. **Waypoints for the 69 queued Pilgrimage sites**, as each is built (the three built so far have 12–36 each).
3. **Vault study pages** (IIIF canvases) and **museum objects** (`relics.js` renditions,
   symbol-wall placements).
4. **Named people, places and texts** mentioned in chapters. This needs an index the archive
   does not have yet.

Even with all four, 10,000 is not certain. The registry will report the real number each time.

## Law 1: the adapter plan for the 12 games (planned, not built)

Today every game saves on its own: high scores under `da.games.score.<game>`, via
`window.ArchiveGames.addHighScore`; the Seeker's progress under `da.games.seeker`; the museum's
arcade door under `mu-arcade`. Nothing records "started" or "completed".

**One adapter file, no game code changes.** `framework/adapters/games.js` loads after
`archive-games.js` on `symbols.html` (a one-line `docs/` change, so it is Phase 2) and wraps
the shared API:

| Hook | Ledger event |
|---|---|
| `ArchiveGames.open(id)` | `started` `game:<id>` |
| `ArchiveGames.addHighScore(id, {score})` | `scored` `game:<id>` `{value: score}` |
| a game's end-of-match result (needs a small `ArchiveGames.finish(id, result)` call in each game) | `completed` `game:<id>` `{result}` |

| Game | started | scored | completed | unlocked | Notes |
|---|---|---|---|---|---|
| Archive Chess (`chess`) | open | none (no score) | checkmate / stalemate / resign | none | needs a `finish` call |
| Divine Casualties (`fighter`) | open | none | KO, payload: the two gods and the winner | none | needs a `finish` call; the CI play-to-KO test covers the path |
| Ouroboros | open | high score | game over | none | |
| Ziggurat Builder | open | high score (+ lines) | game over | none | |
| The Reliquary | open | high score (+ correct) | end of round | none | |
| The Seeker's Path | open | none | the last stage | each stage, from `da.games.seeker` | stages become `unlocked` events |
| Antithesis (pong) | open | tally | match end | none | |
| The Excavation (minesweeper) | open | score | cleared / struck | none | |
| The Labyrinth (pac-man) | open | score | game over | none | |
| The Firmament (pinball) | open | score | game over | none | |
| Dominion of the Ancients (risk) | open | none | conquest / defeat | none | needs a `finish` call |
| The Tomb Robber (treasure) | open | run score | run end | none | |
| (museum) the arcade door | none | none | none | `unlocked` on an arcade entity when `mu-arcade` is set | in `docs/museum/secret.js`. The hidden arcade is not in the registry yet (it is not in the Pilgrimage list); adding it is part of Phase 2 |

**Old saves.** On first load, the adapter would add one `scored` event per existing high score,
marked `{via: "import"}`. That is append-only, and it does not change the old keys, which the
games keep reading. Old and new can then be compared, and the old keys retired later, with
approval.

**Chapters, the Vault and the Pantheon** would emit `viewed` from their page scripts the same
way. That is also a `docs/` change, so Phase 2 or later.

## Law 2: ritual tiers (summary; full list in `plans/rituals-tiers.md`)

- **Tier 1, drafted (draft status, not shown anywhere):**
  - mindfulness of breathing, first four steps (MN 118)
  - lighting a votive candle
- **Tier 2, listed only:**
  - séance as historical Spiritualism (per Carter)
  - Delphi
  - Opening of the Mouth
  - Mithraic grades
  - Eleusis
  - blót
  - tarot / I Ching
  - Wiccan circle
  - rosary
- **Tier 3, NEEDS CARTER, not drafted:**
  - Mass / Eucharist, communion, baptism, confirmation, confession
  - salat and wudu, Hajj rites
  - Shabbat candles with the blessing, tefillin, seder
  - puja and ārtī
  - Amrit Sanchar and Ardās
  - refuge and ordination
  - navjote
  - diaspora initiations
  - restricted Indigenous ceremonies (should never be built)

The votive candle is tier 1 (Carter, 2026-10-11).

## Law 3: the originality check, and what could not be fetched

- **This sandbox could fetch none of the cited pages (1,777 at the time; 1,793 after #36 and #39 merged).** Every request was refused by the
  sandbox's network, so locally every piece reports UNVERIFIED. That is the designed behaviour,
  not a pass.
- The Originality workflow fetches the pages on GitHub's runners, where the web is open, and
  caches the hashes.
- This PR changes the check's own files, so its run checks every chapter, theme and Vault entry.
  It also lists every page that could not be fetched, with the reason, in the run summary and
  the `originality` artifact.
- The PR report gives the numbers from that run.
- Expect some pages never to be readable by a script: PDFs, paywalls, script-rendered pages,
  and sites that block automated requests. Pieces citing only those stay UNVERIFIED.

## Law 4: Lighthouse

The workflow header documents the rule:
- **Hard gate:** a drop of more than 5 points on any page fails a ready-for-review PR into
  main.
- **Advisory:** on draft PRs, PRs into other branches and manual runs, a drop shows as a
  warning and the job passes.

Marking a draft ready re-runs the workflow, so the gate always applies before main.

Lighthouse is the archive's only mobile/viewport check. `game-runtime.yml` is a crash test, not
a viewport check, and is unchanged.

## What is missing or held

- **10,000 entities:** 4,129 today; see the list above for honest ways to grow it.
- **REVIEWER.md pointer:** added to `reviews/REVIEWER.md` §3 on Carter's approval (2026-10-11).
- **Ritual sources:** confirmed through search results only, because the pages are blocked
  here. They must be re-read at review.
- **Content gaps:** the archive has no chapter text on votive candles, and none on breath
  meditation as such. Logged for `plans/content-gaps.md` when that PR lands.
- **Registry freshness:** the registry is a snapshot of the site's data. The Framework workflow
  runs only when framework files change. A PR that changes the site's data without touching the
  framework does not rebuild it, and the next framework PR will need
  `node tools/build-entity-registry.js` re-run. Phase 2 could add the rebuild to the build
  order in `CLAUDE.md`.

## Phase 2 (for approval, not started)

1. `framework/adapters/games.js` and the one-line script tag on `symbols.html`, plus the
   small `finish` calls in chess, fighter and risk. Lighthouse and the game-runtime test must
   stay green.
2. A tier-1 ritual prototype in the museum: one opt-in walkthrough, after Carter clears its
   text and tier.
3. `viewed` events from chapter, Vault and Pantheon pages.
4. The REVIEWER.md line, and the registry rebuild in the build order.
