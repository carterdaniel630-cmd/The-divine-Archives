# Loop run 2026-11-15 03:01 UTC — three branches re-synced onto `main` f92ab8d7; statues-to-rooms delta review PASS

Session: ..01HFWzTknvHHNU8berbs9fUC. Wrote none of V44, the credit lines, statues-to-rooms or the reviewer's fix `e8807852`.

## What this run did
`main` moved to `f92ab8d7` (#141, revered-figure stills) at ~02:50 UTC. The three reviewed branches sat on old `main`
`dfe4d272`. Each was re-synced by a merge commit of `origin/main` (no rebase, no history rewrite):

| Branch | Was | Now | Diff vs `main` equals the reviewed diff | Fresh build drift |
|---|---|---|---|---|
| `loop/v44-line4` | `d2b2a589` | `6b93b678` | yes, byte-identical (`git diff dfe4d272 old` = `git diff main new`) | 0 files |
| `loop/figure-credit-lines` | `00d8d765` | `9cf351da` | yes, byte-identical | 0 files |
| `loop/statues-to-rooms` | `e8807852` | `e3ce23ca` | yes, byte-identical | 0 files |

No file overlaps: #141 touched only `docs/assets/vault/stills/*` (3 new), `docs/chapters/ch22/31/43/48/60.html`,
`tools/data/relic-stills.json`; none of the three branches touch those. The re-syncs are mechanical, so the
existing reviews still cover them (no delta review needed for the re-sync itself).

## Checks (each branch, after re-sync)
- Full build order (stamp-dates, build-og, build-vault, build-chapters, build-pages, build-museum, build-sky,
  build-framework, build-entity-registry): all ran, **0 files changed** (committed output matches a fresh build).
- `tools/verify-*.js`: 18/18 pass on each.
- `node --test framework/test/*.test.js`: 51/51 on each.
- `review-checks.js --base origin/main --build`: V44 9 passed / 0 failed / 1 warning (the Wikipedia-share note on
  `sources/v44-pilate-stone.md`, 1 of 4 sources, already present at review); credit lines 9/0/0; statues 9/0/0.
- Headless 390 and 360 px: `vault/pilate-stone.html`, `vault.html`, `rotunda/isis.html`, `rotunda/shiva.html`,
  `rotunda/socrates.html`, `museum.html` — **0 script errors**, no sideways scroll (scrollWidth = viewport). The
  only console errors were blocked outside fetches in the sandbox (`ERR_TUNNEL_CONNECTION_FAILED`), not page faults.
  V44 page still shows the pending tag and the new line-4 wording.
- graphify CLI installed from `graph-tools` this run; `graphify update .` ran.

## Delta review of the statues-to-rooms reviewer fix `e8807852` (independent: this session wrote none of it)
Scope: `b7a8afbd..e8807852` — `framework/registry/index.json` (+1 total, −1 shortfall, source 2020→2021) and
`framework/registry/source.json` (+1 entry `source:sketchfab-com/7aec9759f5`, the SMK Sketchfab model URL, from
`sources/museum-statues-in-rooms.md`).
- It is generated output only; a fresh `build-entity-registry.js` on the re-synced head reproduces it exactly
  (drift 0), and the registry test passes (51/51).
- The added URL matches the Sketchfab source named in the branch's own source log.
- **Verdict: PASS, 0 findings.** Statues-to-rooms now has zero open findings with every fix reviewed by a non-fixer.

## Still missing before any of the three can merge (unchanged)
- A PR from each branch (runs don't open PRs unasked; Carter or a chat session asks), so GitHub checks incl.
  Lighthouse run on the new heads.
- Carter's per-item yes: V44 (2) a + tag word; credit lines; statues-to-rooms (religious figures, plus his room choice).
- If `main` moves again, re-sync again (same mechanical check).
