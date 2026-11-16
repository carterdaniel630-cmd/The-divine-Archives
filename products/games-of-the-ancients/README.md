# Games of the Ancients — the six pack games (Gumroad Pack One and Pack Two)

These are the six single-file games sold in the two Gumroad products. They are **not part of the website**
(nothing under `docs/` links to or serves them). Atlas swaps a file into the live product only after it passes.

The first commit on this folder adds the six files **byte for byte as sold** (staged by atlas on 2026-11-08 in
`handoff/pack-six/` on `staging/ready-line`), so every later change shows as a reviewable diff:

| File | Pack | As-sold MD5 |
|---|---|---|
| royal-game-of-ur.html (v2 baseline of record) | One | a4018f0927c4b79af6d58c45ef43b951 |
| hnefatafl.html | One | 887aecff6629152473952fe49f261b12 |
| mancala.html | One | 5ee3ad51f56a1fa3a1e7e029d23a6fe3 |
| bagh-chal.html | Two | 814e0015eac41f3e03d046837bf64698 |
| fanorona.html | Two | bd7a6c7e42f12e09e2c261d72fdd1ff7 |
| pachisi.html | Two | 53684047ac146bc8377fbc9d6214d4cd |

Orders: `handoff/pack-six-rebuild-swap-order.md`, `handoff/games-visual-upgrade-order-2026-11-04.md`.
Defect list: G-1 to G-5 in `handoff/replies/2026-11-07-audit-health-report.md`.
Rules, facts and honesty marks must stay exactly as sold; changes are presentation only unless an order says otherwise.

## Production rebuild (order `handoff/games-visual-upgrade-order-2026-11-04.md`)
- **Royal Game of Ur, part 1 (2026-11-09):** pieces travel the road square by square (from the waiting pile, home to
  the panel, and a captured piece is carried back); five story lines from the record rise during play and stay below the
  board, with their sources in the History panel (`sources/games-ur-production.md`). Added as a separate style and script
  block at the end of the file: the game script, rules, AI and text of record are byte-for-byte unchanged. Still a single
  file with no network requests. Not yet the full rebuild (the era's world around the board is the next part).
