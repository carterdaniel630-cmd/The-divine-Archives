# Handoff — 2026-10-11

Repo: carterdaniel630-cmd/The-divine-Archives. Site: getconexto.com (Cloudflare Pages deploys
`docs/` on every push to `main`). Read `CLAUDE.md` first ("Start here", "Operating rules", "Quality
bar"): Carter works from a phone, prefers large batches, and merging to main needs his go-ahead.
Every output goes through the reviewer (`reviews/REVIEWER.md`) before it reaches Carter.

## State of main
- Merged 2026-10-10/11 with Carter's go-ahead: #34 (pending chapters under 20% Wikipedia; ch70 dating
  plan), #36 (Qumran and Alexandria Pilgrimage previews, noindex, off the menu), #37 (docs sync),
  #39 (ch82 British Library citation), #38 (CLAUDE.md: start-here steps, quality bar, standing
  preferences), #35 (content-gaps list `plans/content-gaps.md` and the top 20 gaps filled in 17 chapters).
- 83 chapters. **Pending review (31):** ch02, ch08, ch11, ch12, ch19, ch20, ch21, ch44, ch45, ch46, ch47,
  ch50, ch51, ch52, ch53, ch60, ch61, ch68, ch69, ch70, ch73, ch74, ch75–ch83. The 17 from #35 went back
  to pending for their new sections. The status board in `outline/master-outline.md` matches
  `docs/assets/data.js`.
- Pilgrimage: the Great Pyramid is the one live site (pending review); Qumran and Alexandria are previews.

## Review desk
- Reviewer and auditor run as scheduled tasks; reports live on the `review-log` branch. Latest: the
  2026-10-10 reviewer reports and `reviews/2026-10-11-audit.md` (6 of 6 agreed; auto-pass on).
- The "say so when the previous run failed" check is on `review-log` and on branch
  `ccr-7a4d8bed-4kfyao` (not merged); the reviewer's scheduled prompt carries it in the meantime.

## Open PRs
- Speed pass (branch `claude/project-thread-sn268z`): fonts linked from each page instead of an @import in
  archive.css, Pantheon script fonts cut to the letters it uses, unused data files dropped from home/eras/themes,
  new `fonts` review check. Waits for Carter's batch go-ahead.
- None besides this docs sync. `claude/games-modern` (games + rituals Phase 1 plan) has no PR and waits
  for Carter's approval before any build.

## Needs Carter
- Clearing the 31 pending chapters (a separate thread, "Clear the pending chapters batch", owns this).
- The ch70 dating question (`plans/ch70-dating-decision.md`): option A or B.
- The clearance log lists ch45, ch46, ch68, ch70 and ch73 as cleared although they are pending; Wing VI
  and the arcade went live with no recorded approval (from the 2026-10-10 review).
- Held-back symbol-wall signs (list in `plans/museum-visual-pass.md`).
- Whether the two Pilgrimage previews go live (and get museum portals).
- The games plan: approve, change or reject before any build.

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
