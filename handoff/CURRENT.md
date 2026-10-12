# Handoff — 2026-10-12

Repo: carterdaniel630-cmd/The-divine-Archives. Site: getconexto.com (Cloudflare Pages deploys
`docs/` on every push to `main`). Read `CLAUDE.md` first ("Start here", "Operating rules", "Quality
bar"): Carter works from a phone, prefers large batches, and merging to main needs his go-ahead.
Every output goes through the reviewer (`reviews/REVIEWER.md`) before it reaches Carter.

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
- `claude/games-modern`: games + rituals plan, approved by Carter 2026-10-11. Phase 1 in build on
  `claude/games-movesets` (distinct movesets, 2D) and `claude/ritual-weighing` (Weighing of the Heart).
- `ccr-7a4d8bed-4kfyao`: the reviewer's previous-run check in `REVIEWER.md`. Not merged, no PR.
- **Carter's try-it list:** `handoff/CARTER-TO-TRY.md` lists what to try on his phone and the
  decisions waiting on him. Keep it current: tick items off as he answers, and add new ones.

- #52 `claude/graphify-setup` merged 2026-10-11 (Carter: "merge, A" = code map only): graphify knowledge graph
  for build sessions. `.github/workflows/graphify.yml` builds the code map from main onto the generated `graph`
  branch; `tools/graphify-session.sh` pulls it at session start; rules in `CLAUDE.md`, "Knowledge graph".
  The `graph` branch is force-replaced on each merge: never archive or build on it. Chapters stay out of the map.

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
