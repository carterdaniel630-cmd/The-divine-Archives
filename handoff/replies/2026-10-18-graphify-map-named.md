# Graphify map: it exists, and now it reads in plain words — 2026-10-18 (build loop)

Answers `nudge-2026-10-18-graphify-map.md` (Carter, 18:35 EDT: "build the actual Graphify map").

## What was found
- The map **was already built**. When PR #65 merged (22:07 UTC), the graphify workflow ran on `main` and published all
  three outputs to the `graph` branch, not to `main` (by design: generated files stay off the live site):
  `graphify-out/graph.html` (interactive), `graph.json` (GraphRAG JSON), `GRAPH_REPORT.md`. Built from `main @ 77f6444`:
  3,329 nodes, 6,489 links, 184 groups. That is why `graphify-out/` looked missing on `main`.
- **But it was not up to standard:** every group was named "Community 0" … "Community 183", so the map could not be read.

## What this run did
1. `tools/graphify-label.js`: names each group from the files it is made of, by a fixed rule (no AI, same graph → same
   names): "Museum catalogue", "Museum · relics", "Arcade · chess", "Pilgrimage · Golgotha and the Tomb",
   "Checks · review checks", "Build · pages" … Repeats are numbered "(2)", "(3)", largest first.
2. Wired into `.github/workflows/graphify.yml` after `cluster-only`, so every rebuild is named. Branch
   `loop/graphify-labels` @ `09f48b3`, **PR #69**. No `docs/` change; the live site is untouched.
3. Named snapshot for Carter now: `handoff/previews/graphify-map/` (graph.html, GRAPH_REPORT.md, phone-legend.png).
   Open on a phone: https://raw.githack.com/carterdaniel630-cmd/the-divine-archives/9e2eaf44a18dcee9cb2dbd781e7b1d23bf3605b2/handoff/previews/graphify-map/graph.html
   (2.8 MB; drag to move, pinch to zoom, tap a dot for its file; the list on the right turns groups on and off).

## Checks
- Full build order: reproduces byte for byte. 17/17 verify scripts; 42/42 framework tests; `review-checks.js --base
  origin/main --build` 9/9, 0 warnings.
- On the published map: 184 groups named, 0 left as "Community N"; graph.json equal by value apart from the names;
  graph.html differs only in names; both inline scripts parse; KEY.md absent; running the tool twice changes nothing.
- Headless at phone size (390×844): legend shows all 184 names, no script errors.
- **Not verified here:** the drawing itself. The map's drawing library loads from unpkg.com, which this session cannot
  reach, so the legend was checked with a stand-in library. On a phone, 3,329 dots may take several seconds to
  settle; Carter's phone is the verdict.

## Still true
- The map covers **code only** (museum, games, Pilgrimage, tools, framework). Chapters and Vault prose are not in it:
  that needs an AI reading pass over the text, which the Item 29 setup left for a separate yes.

## Merge state
PR #69 is not mergeable yet: it needs an independent review by a run that wrote none of it, all GitHub checks green,
then Carter's yes for this item.
