# Health report — the Saturday audit (2026-11-07)

**For Carter, through atlas.** This is the audit-first order (`audit-first-order.md`), Steps 0–5, run by session
..01HFWzTnvXVBLaXaK97CDDKy from 20:40 UTC. Everything here was checked on `main` as deployed (`2ed33a1` after #117),
served locally. This session cannot open the live address (the network blocks it), so the live check is your phone
or atlas's crawler, which is running in parallel and is not duplicated here.

## Headline
**The site is healthy. No critical or major errors were found on the live site.** Every page loads at phone size, no
link inside the site is dead, every count the site states is true, every keeper game plays to its end with no
script errors, the museum is walkable into all 84 rooms, and all 11 open Pilgrimage sites load and can be walked.
What was wrong was paperwork (the README's numbers, the agent-systems config), two minor walking snags in the
Pilgrimage, and a handful of named items listed below.

## Step 0 — PR #117: PASS, merged
Independent review, 0 findings (`2026-11-07-pr117-independent-review.md`). Merged on your yes at 20:51 UTC:
`main` `75176f5` → `2ed33a1`, deploy run 245. V90's "many 2014 news reports" over-statement is gone.
The V88/V89 flags are not touched by #117; both entries stay pending, as before.

## Step 1 — The sweep
| Check | Result |
|---|---|
| Pages reachable from the site's links, at phone size (390 px, touch) | **231 pages, all load, 0 script errors** |
| Internal links (incl. Vault↔chapter and V89/V90) | **0 dead.** (The crawler flagged 15 `chNN.html` addresses from the Random page; that was the crawler, which read the page before its redirect. The page itself is fine.) |
| Chapters | 84 on the site; 20 pending — true |
| Vault | "Everything (89)"; eras and categories each add up to 89 (90 entries, V68 withdrawn) — true |
| Pantheon | "199 figures from 30 traditions" — true |
| Pilgrimage | "11 open, 62 in preparation" — true (73 sites: 11 open, 3 preview, 59 queued) |
| Arcade | "twelve games" — true today (it becomes eleven when The Firmament is deleted under its own order) |
| Sitemap | 206 addresses; ch84, V89, V90, Newgrange, the museum all present |
| Checks on `main` | Deploy, game runtime, links, originality, sourcing, graph: all green on `75176f5` and running green on `2ed33a1` |

## Step 2 — The deep areas
- **Museum:** enters and walks; all **84 rooms** reached by the room guide with **0 errors**; keyboard walking works
  after one click on the view (the first-click focus item passes in headless Chrome; a real phone is still the final word).
- **Pilgrimage:** all **11 open sites** load every section and walk, with **0 errors** and a text version on each.
  Two minor snags (named defects P-1, P-2 below).
- **Yoruba registry:** the room **exists and is registered** (`room:ch84` in `framework/registry/room.json`, wing 08).
  The repo has **no "R-number" system at all**, so "R-67 to R-73" is NOT FOUND in the repo: it is the books' numbering,
  not the site's. Era 08 has **8 rooms**: ch31, ch32, ch33, ch34, ch63, ch73, ch82, ch84. The real gap is that the
  Yoruba room has **no home figures or Vault objects**: all seven orisha are homed in ch33 (African Traditional Religion)
  and only listed as "see also" in ch84. Re-homing them is a content call, so it is written up (Y-1), not changed.
- **PR #60:** closed with a note, per your ruling (`decisions-2026-10-26-takeover-batch.md` item 3). Branch kept.
- **PR #95** (games true full screen sideways): **left open**. It was built but never reviewed, and it is now 48 commits
  behind `main`. It adds a new full-screen mode, so it needs your per-item yes and is not a fix. It belongs with the
  games-upgrade lane, which comes later in the queue (`order-2026-10-31-divine-casualties-upgrade.md`).
- **Handoff pile:** all 182 top-level notes are indexed in `audits/pile-index-2026-11-07.md`. 91 are cited from
  STATUS, CURRENT or the orders. The uncited 91 are mostly folded rulings (15) and nudges (18). Nothing is missing. Four notes are
  stored base64-encoded and read as gibberish on GitHub (H-1).

## Step 3 — The games pass (live site; played, not just opened)
All 11 keepers were played to their end state on a phone-size touch screen (desktop for the two strategy games), with
**0 script errors** in every one:

| Game | Reached | Score kept |
|---|---|---|
| Divine Casualties | KO, "Zeus is victorious" (CI play-to-KO + 40-move frame check) | — (no high-score table by design) |
| Ziggurat Builder | game over | yes |
| Archive Chess | resigned (the finish path) | — (no table) |
| Antithesis | match lost | yes |
| The Excavation | struck a hazard | (score only on a win) |
| The Labyrinth | caught | yes |
| The Reliquary | quiz finished | yes |
| Ouroboros | coil closed | yes |
| The Seeker's Path | all 10 gates | — (no table) |
| Dominion | campaign ended | — (no table) |
| The Unfinished Journal | all 4 sites cleared, "Run it again" | yes |

On-screen pads take taps (Journal: 155 taps on the pad, no errors). Divine Casualties' stiffness is a feel item already in
the standing fix specs (`fix-package/game-fix-specs.md`). This pass does not re-judge it.

**The 25 program builds** are atlas's side and are not in this pass (Liubo and Makruk head atlas's list, as handed in).

**The Gumroad six**: verified defect list, input to the games-visual-upgrade order. Each one was opened at 390 and 1280 px and
played with 150 s of real clicks. All six load offline, make no network calls, never scroll sideways and threw **0 script
errors**. None reached a win or loss by random play, which is expected for board games and is not a defect.
- **G-1 (all six): tap targets under 44 px on phones.** Ur: mode buttons, "Begin a new match", "Cast the tetrahedra";
  Hnefatafl: board cells, mode and skill buttons; Mancala: Undo, Restart; Bagh-Chal: Undo, Restart, Switch sides;
  Fanorona: New game, Undo, End turn; Pachisi: Undo, Restart, Rules.
- **G-2 Ur: faint text.** The eyebrow line ("Ur · Early Dynastic III …", contrast about 1.7:1), the subtitle and the legend
  under the board are hard to read. The two bottom-right buttons almost vanish (screenshot check).
- **G-3 Hnefatafl: low-contrast labels.** "Raiders move · AI", the status line and the counters measure about 1.2–1.5:1.
  This is an automated reading against a textured background, so it needs one look by eye before the fix.
- **G-4 Mancala: the board answers only taps on a pit or the keyboard**, which is fine, but nothing on the board shows
  which row is yours until you read the hint line.
- **G-5 Ur: after 150 s of clicks on the board, neither side had entered a piece** ("7 waiting"). The way to enter a
  piece (tap the stack beside the board after casting) is not obvious. Needs a person to confirm whether it is a
  defect or just the harness.

## Step 4 — Fixes, worst first, each double-checked
No critical or major errors were found, so the fixes are the paperwork ones your Q5 ruling sends through merge-on-green:
1. **README counts** — PR #118 (`loop/readme-counts-2026-11-07` `0acdc4f3`): 84 chapters, 89 Vault entries, 11 open sites,
   84 rooms, 20 pending chapters, V88–V90 pending, plus the visitor counter. A fresh reviewer checked every number against
   the data: **PASS, 0 findings**. GitHub 4/4 green (a README-only change runs no Lighthouse). **Merge push refused by this
   session's safety guard**, so it waits on your yes or your Merge button.
2. **Agent-systems config** (`agent-systems-config.md`, staging only): the build, test, lint, dev-server and graphify
   commands and the generated paths now name what is really in the repo. First review: 4 findings, all fixed (`013886e8`).
   Delta review: **PASS, 0 findings**.

Named defects left open (small; each sits in a queue lane that already exists):
- **P-1 Library of Alexandria, section I:** you start facing a column, so the first step forward does not move. This is the
  same item as the artist walk's "WALK ON step 2 walks into a column" (inspection pass).
- **P-2 Qumran, Cave 1:** you start about 0.2 m short of a blocker, so W/A/S barely move. Tapping to walk reaches every
  part of the cave. Belongs with the same inspection pass.
- **Y-1 Yoruba room has no home figures or Vault objects** (content call: re-home some orisha from ch33?).
- **H-1 Four handoff notes are base64-encoded:** `nudge-2026-10-18-1330.md`, `nudge-2026-11-07-1520.md`,
  `order-2026-10-31-keep-moving-night.md`, `wake-2026-11-07.md`. They are atlas's files, so they were left as written. Atlas
  should write plain text.
- **PR #95**, as above.
- **G-1 to G-5**, which go to the games-upgrade order.

## Still open and why
- **#118 merge:** only the refused push stands in the way.
- **P-1, P-2:** waiting on the inspection pass that is already queued, so the fix follows the composed-view rule.
- **Y-1:** a content call for you.
- **Live-site check:** a build session cannot reach the live address. Atlas's crawler covers it.

## Step 6 — The queue
Next, per the wake note: the **Visual Foundation Kit** first, then the standing pile in order.
