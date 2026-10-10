# Handoff — 2026-10-10

Repo: carterdaniel630-cmd/The-divine-Archives. Site: getconexto.com (Cloudflare Pages deploys
`docs/` on every push to `main`). Read `CLAUDE.md` first, especially "Operating rules": Carter
works from a phone; merging to main and any live-site change need his approval. Every output goes
through the reviewer (`reviews/REVIEWER.md`) before it reaches Carter.

## State of main
- `main` = `b13fc2a` (2026-10-06, "Arcade secret: the message is EVERY TRADITION LEFT A DOOR").
- Live since the last handoff: Carter's 2026-10-05/06 decisions on the Wikipedia-replacement batch
  (ch66–ch83 sources merged; ch71 cleared again; ch83 Arya Samaj date), the clearance log backfill
  (`reviews/cleared.json`), the museum visual pass (sample and Wings II–VI), and the hidden Archive Arcade.
- 83 chapters. **Pending review (14):** ch45, ch46, ch68, ch70, ch73, ch75–ch83. Everything else cleared.
  The status board in `outline/master-outline.md` matches `docs/assets/data.js`.
- Pilgrimage: the Great Pyramid is the one live site (pending review).

## Review desk
- Reviewer and auditor run as scheduled tasks: reviewer daily at 4:47 AM ET, auditor Wednesdays at
  5:47 AM ET; push notifications on. Reports live on the `review-log` branch.
- Last reviewer report: `reviews/2026-10-10-catchup-oct5-10.md` (5 passed, 0 fixed, 3 need Carter).
  The runs of 2026-10-07 (auditor) and 2026-10-10 (reviewer) failed on the usage limit.
- The "say so when the previous run failed" check is on `review-log` and on branch
  `ccr-7a4d8bed-4kfyao` (not merged); the reviewer's scheduled prompt carries it in the meantime.
- Auto-pass: on (`reviews/status.json` on `review-log`).

## Open PRs (all for Carter's approval; none merged)
| PR | Branch | What |
|---|---|---|
| #34 | `claude/sourcing-pending` | All 14 pending chapters under 20% Wikipedia (ch45 33%→0%, ch46 50%→0%; two more pointers replaced); `plans/ch70-dating-decision.md` (options A/B for the Taymāʾ stele) |
| #35 | `claude/content-depth` | `plans/content-gaps.md` (gaps for all 83 chapters) and the top 20 gaps filled in 17 chapters, which go back to pending |
| #36 | `claude/pilgrimage-qumran-alexandria` | Qumran caves and the Library of Alexandria (reconstruction) as noindex previews, off the menu; new `preview` status; cave builder |
| #37 | `claude/docs-sync` | This handoff, the status board (ch68, ch70, ch73 pending; ch71 re-cleared), museum and pyramid plan status lines |
| — | `claude/games-modern` | Games + rituals Phase 1 plan (`plans/games-modern.md`), no PR: waiting for Carter's approval before any build |

## Needs Carter
- The ch70 dating question (`plans/ch70-dating-decision.md`): option A or B.
- From the 2026-10-10 review: the clearance log lists ch45, ch46, ch68, ch70 and ch73 as cleared although they
  are pending; Wing VI and the arcade went live with no recorded approval.
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
