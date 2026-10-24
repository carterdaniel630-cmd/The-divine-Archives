# Handoff — updated 2026-10-24 (22:45 UTC)

## Latest: PR #70 (hit-feel part 1) is live (2026-10-24)
- **PR #70** merged by the build loop 22:37 UTC by fast-forward `09f48b3` → `361ba21` (Carter's per-item yes,
  `merge-approval-2026-10-19.md`). Site diff identical to the independently reviewed `ea70b77`; 6/6 GitHub checks green;
  local checks re-run green. Deploy run 196 green. The Firmament and Antithesis now freeze, shake, flash and ring on a hit
  (no shake under reduced motion). Reply `replies/2026-10-24-pr70-merged.md`.
- **Open next:** #71, #72 (hit-feel 2–3, Carter's yes), #73 (Tjurunga, Carter's yes), #74 (reduced motion part 1,
  needs independent review then Carter's yes).

## Latest: PR #69 (Graphify plain-word names) is on main (2026-10-24)
- **PR #69** merged by the build loop 21:43 UTC by fast-forward to `09f48b3` (Carter's per-item yes,
  `merge-approval-2026-10-19.md`). Local checks re-run on `09f48b3`; 6/6 GitHub checks green. Deploy run 195 green,
  graphify run 28 green. No live-site page changed (tools + workflow only).
- **PR #70** (hit-feel part 1, approved): brought up to the new `main` with a merge commit (`loop/hit-feel` @ `361ba21`,
  files identical to the reviewed `ea70b77` plus #69). Waits on its GitHub checks re-running on that head, then merges.
  Reply `replies/2026-10-24-pr69-merged-pr70-updated.md`.

## Latest: hit-feel parts 1–3 open (2026-10-19); `main` unchanged at `77f6444`
- **Open PRs added since 2026-10-18 evening:** #69 (Graphify plain-word names; reviewed, mergeable on Carter's yes),
  #70 (hit-feel part 1; reviewed, all checks green, mergeable on Carter's yes), #71 (hit-feel part 2, stacked on #70;
  reviewed, 0 findings, all checks green), #72 (hit-feel part 3: Chess and Dominion, stacked on #71; independently
  reviewed, 0 findings, all 7 checks green).
  Details in `replies/STATUS.md` and `replies/MERGEABLE.md`.
- **Relics:** Treaty of Kadesh tablet rebuilt as a preview in `handoff/previews/treaty-of-kadesh/` (relic 1 of 4; not on
  the site; `replies/2026-10-19-treaty-of-kadesh-rebuilt.md`).

## Latest: PR #65 (Item 29) is on main (2026-10-18 evening)
- **PR #65 Graphify fix + standards board** merged by Carter 22:07 UTC as merge commit `77f6444` (on `b0896a6`).
  Approval `approval-2026-10-18-graphify-merge.md`; independent review 0 findings
  (`replies/2026-10-18-item-29-independent-review-and-merge.md`); 7/7 checks green. Deploy run 194 green. No live-site
  page changed (`.graphifyignore`, one tool, `handoff/` only); the published map is now project code only.
- **Open PRs now:** #64 (reviewer and auditor as project skills), #61 (superseded by #65, can be closed), #60 (Journal
  hero, on hold for the selfie), #58 (reviewer heartbeat, unmerged), #53 (Pilgrimage batch 1 preview).

## Earlier: museum phone speed and site batch B are on main (2026-10-18)
- **PR #62 museum phone speed** merged 12:35 UTC by fast-forward to `0585c80` (Carter's per-item yes,
  `decisions-2026-10-18-go-museum-and-batch-b.md`); deploy green. Then #57 (handoff-only, `58af188`), deploy green.
- **PR #63 site batch B** merged 16:51 UTC by fast-forward to `c205f4c` (same approval). Independent review of the
  updated head: `handoff/replies/2026-10-18-batch-b-update-review-and-merge.md` (0 findings; site diff identical to the
  reviewed `aeda5d4`; every check green incl. Lighthouse). Deploy run 193 green. Shipped: hallway hiss removed,
  "199 figures", V72 sources (back to pending), Pantheon "Ra-Horakhty".
- **Open PRs then:** #65 (Item 29 Graphify fix + standards board on current main; supersedes #61), #64 (reviewer and
  auditor as project skills), #61 (superseded), #60 (Journal hero, on hold for the selfie), #58 (reviewer heartbeat,
  unmerged), #53 (Pilgrimage batch 1 preview).
- **Deploy target:** the-divine-archives.pages.dev; getconexto.com not pointed.

## Earlier: 2026-10-17 (evening)

## Latest: site batch A is on main (2026-10-17)
- **PR #59 merged** by fast-forward, `c455bfe` → `218c51b`, with Carter's order (Item 24, `handoff/order-2026-10-17-merge-pr59.md`).
- **Checks:** the independent review (`handoff/replies/2026-10-17-batch-a-independent-review.md`) found 0 issues, and every GitHub
  check was green on `218c51b`, Lighthouse included. The deploy workflow finished with success.
- **What it shipped:**
  - Pilgrimage pages no longer over-claim survey measurements;
  - trademark game ids renamed (pacman, pong, minesweeper, risk → labyrinth, antithesis, excavation, dominion), with old
    links and saved scores carried over;
  - Hades no longer called an Olympian;
  - "The Tomb Robber" → "The Unfinished Journal";
  - the Lighthouse run is no longer cancelled by later pushes.
- **Go-live date for the rename: 2026-10-17.** The old-id compatibility table is due for removal on **2027-01-15**
  (Carter: delete it 90 days after go-live; `handoff/decisions-2026-10-17-carter-answers-2.md` §3).
- **Deploy target:** `main` deploys to the-divine-archives.pages.dev. getconexto.com is not yet pointed (per the loop's note in
  `ae8091d`; this conflicts with corrections-v2 C2, "the site is live", so Carter should confirm).
- **Open PRs now:** #60 (Journal hero redesign; on hold: Item 27 says the hero keeps Carter's face, and the selfie is not in
  the repo), plus the older #53, #56, #57, #58.

## Earlier state (2026-10-12)

Repo: carterdaniel630-cmd/The-divine-Archives. Site: Cloudflare Pages deploys
`docs/` on every push to `main` to **the-divine-archives.pages.dev** (branch previews: preview.the-divine-archives.pages.dev). The domain
getconexto.com is NOT pointed yet (Carter, 2026-10-17): nothing is public there until Carter points DNS. Read `CLAUDE.md` first ("Start here", "Operating rules", "Quality
bar"): Carter works from a phone, prefers large batches, and merging to main needs his go-ahead.
Every output goes through the reviewer (`reviews/REVIEWER.md`) before it reaches Carter.

## Go-live 2026-10-17 (PR #59, site batch A)
- **Merged:** PR #59 (`staging/ready-line` → `main`), fast-forward to `218c51b`, 2026-10-17 21:08 EDT (01:08Z), on Carter's
  "merge" order (`order-2026-10-17-merge-pr59.md`) and "go … both" (2026-10-17 21:07).
- **Checks on `218c51b` before merge:** all green, Lighthouse included (completed 23:02Z). Independent review:
  `replies/2026-10-17-batch-a-independent-review.md`, 0 findings.
- **Deploy:** Cloudflare Pages run on `main` completed, success. Link guard, game sourcing, graphify: success.
- **What is deployed (on the-divine-archives.pages.dev; not public, DNS not pointed):** over-claims fixed (Qumran, Alexandria, Pilgrimage list, museum portal card, 3D arcade tap = card);
  trademark game ids renamed (pacman→labyrinth, minesweeper→excavation, risk→dominion, pong renamed) with old links
  and scores carried over; homepage and symbols blurbs reworded; Hades reworded; Tomb Robber → The Unfinished Journal.
- **Deployed-page check:** this session could not open the-divine-archives.pages.dev (network allowlist). Carter's phone check on
  the-divine-archives.pages.dev is the verdict.
- **Scheduled removal (Carter batch 2 §3):** old-id table (`archive-games.js`, `framework/adapters/track.js`, arcade
  `site.js`, `framework/test/renamed.test.js`) is due for removal on staging on or after **2027-01-15** (90 days).

## State of main
- Merged 2026-10-10/11 with Carter's go-ahead: #34 (pending chapters under 20% Wikipedia; ch70 dating
  plan), #36 (Qumran and Alexandria Pilgrimage previews, noindex, off the menu), #37 (docs sync),
  #39 (ch82 British Library citation), #38 (CLAUDE.md: start-here steps, quality bar, standing
  preferences), #35 (content-gaps list `plans/content-gaps.md` and the top 20 gaps filled in 17 chapters).
- 83 chapters. **Pending review (17):** ch02, ch08, ch11, ch12, ch19, ch20, ch21, ch44, ch47, ch50,
  ch51, ch52, ch53, ch60, ch61, ch69, ch74. Cleared 2026-10-12 (#50, Carter: "clear"): ch45, ch46, ch68,
  ch70, ch73, ch75–ch83, after the source review and corrections of #42 (merged). The status board in
  `outline/master-outline.md` matches `docs/assets/data.js`.
- Pilgrimage: three live sites, all pending review: the Great Pyramid, and (listed 2026-10-11, Carter's go-ahead) the Qumran caves and the Library of Alexandria. No museum portals to the two new sites yet.

## Review desk
- Reviewer and auditor run as scheduled tasks; reports live on the `review-log` branch. Latest: the
  2026-10-10 reviewer reports and `reviews/2026-10-11-audit.md` (6 of 6 agreed; auto-pass on).
- The "say so when the previous run failed" check is on `review-log` and on branch
  `ccr-7a4d8bed-4kfyao` (not merged); the reviewer's scheduled prompt carries it in the meantime.

## Open PRs and branches in flight (updated 2026-10-12 by the framework session)
- Merged 2026-10-11 with Carter's go-ahead, all deployed:
  - #42: source review of the pending chapters
  - #40: framework Phases 1 and 2
  - #43: the Qumran and Alexandria walks are listed
  - #48: a distinct moveset for each god in Divine Casualties
  - #46: speed pass (fonts load in parallel, lighter Pantheon and home; new `fonts` review check)
  - #51: three Pilgrimage previews (Stonehenge, Golgotha and the Tomb, Mount Ararat)
  - #44: one catalog for the twelve games

  #40 brought in:
  - the visitor ledger, kept in the browser only
  - game and page events
  - the opt-in breath walkthrough in the museum's Buddhism room (pending review)
  - the originality check
  - the entity registry

  The build order in `CLAUDE.md` ends with `build-framework.js` and `build-entity-registry.js`. The
  Framework workflow fails any content PR that leaves the registry stale.
- #45 (registry rebuild) was closed; #49 carries the same rebuild.
- #49 `claude/framework-followup`: the reviewer's two small framework bugs:
  - rate-limited pages that had failed twice were never retried
  - a first new score could be copied again as an "old" score

  It also bumps the tracker script to v=2 on every page. Carter approved merging it once it is green
  and the reviewer passes it.
- #47: Weighing of the Heart walkthrough at the Book of the Dead case (another thread; tier 2,
  needs Carter).
- **Overlaps:**
  - #47 changes the ritual schema and the museum's `app.js`, which #40 also changed.

  Whichever merges later must merge main and re-run the full build order. `review-checks.js --build`
  and the Framework test catch a missed rebuild.
- #42 (source review and corrections of 14 pending chapters) merged; #50 (clearing those 14, same
  branch `claude/project-thread-evq985`) merged 2026-10-12 with Carter's "clear".
- `claude/pilgrimage-wave2`: Stonehenge as a noindex preview (another thread). No PR yet; it is
  based on an older main.
- `claude/games-modern`: games + rituals plan, approved by Carter 2026-10-11. Phase 1: movesets merged
  (#48); PR #47 (`claude/ritual-weighing`, the Weighing of the Heart walkthrough in the museum) is
  green and awaits Carter's go-ahead.
- `ccr-7a4d8bed-4kfyao`: the reviewer's previous-run check in `REVIEWER.md`. Not merged, no PR.
- **Carter's try-it list:** `handoff/CARTER-TO-TRY.md` lists what to try on his phone and the
  decisions waiting on him. Keep it current: tick items off as he answers, and add new ones.

- #52 `claude/graphify-setup` merged 2026-10-11 (Carter: "merge, A" = code map only): graphify knowledge graph
  for build sessions. `.github/workflows/graphify.yml` builds the code map from main onto the generated `graph`
  branch; `tools/graphify-session.sh` pulls it at session start; rules in `CLAUDE.md`, "Knowledge graph".
  The `graph` branch is force-replaced on each merge: never archive or build on it. Chapters stay out of the map.
- #55 `claude/graphify-offline-cli` merged 2026-10-12 (Carter: "yes"): the graphify command is packaged on the
  generated `graph-tools` branch, so sessions with the package index blocked still get `graphify query`.

## Needs Carter
- Clearing the remaining 17 pending chapters (14 of the 31 were cleared in #50).
- Wing VI and the arcade went live with no recorded approval (from the 2026-10-10 review). The clearance
  log now records chapters sent back to pending under `reopened` (Carter's yes, 2026-10-11).
- Held-back symbol-wall signs (list in `plans/museum-visual-pass.md`).
- Whether the Qumran and Alexandria sites get museum portals.
- The scheduled reviewer and auditor routines still have no repository attached, so their pushes fail.
  Carter adds the repository to both routines in the app's routine settings; until then the reviews
  run as manual sessions.

## Decisions still in effect
- Sourcing rule: scholarly or primary sources first, Wikipedia only as a labelled pointer; flag any chapter
  over 20%.
- No images of the Báb; tjurunga never shown; restricted sites exterior only; Kaaba courtyard without figures.
- Benin Bronzes scan: on hold. Email sign-up hidden until Carter sets up Kit. Analytics token is Carter's to do.

## Blockers (founder-only)
- Analytics token (`docs/site-config.js`); GitHub default branch is not `main`; repo description; Kit account;
  V76 translation (host blocked in the sandbox). Publisher, museum and archive sites are blocked from build
  sessions, so most sources are confirmed through search results and flagged for re-reading at review.

## Useful tools
- Build order (CLAUDE.md "Build & deploy"): `stamp-dates`, `build-og`, `build-vault`, `build-chapters`,
  `build-pages`, `build-museum`, `build-sky`; then all `tools/verify-*.js` and
  `node tools/review-checks.js --base origin/main --build`.
- A chapter's body goes into `content/chapters.js` via `node tools/md-to-chapter.js <id> <file.md>`. Note that
  ch22 has no comment marker before its block in `chapters.js`, so splice by the `chNN: { html:` line, not only
  by the marker.
- Pilgrimage pages: `node tools/serve.js 8080`, then `window.__PG` in the console (go, look, state).
