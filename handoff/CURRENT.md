# Handoff — 2026-10-04

Repo: carterdaniel630-cmd/The-divine-Archives. Site: getconexto.com (Cloudflare Pages deploys
`docs/` on every push to `main`). Read `CLAUDE.md` first, especially "Operating rules": Carter
works from a phone; merging to main and any live-site change need his approval.

## State of main
- `main` = merge commit `5609b63` (PR #13 + Compare fix) plus this handoff update; PR #12 deploy succeeded.
- Live now (after the deploy of this push): everything from PRs #11, #12 and #13, plus the Compare fix.

## Work in this session

| Item | Status | Where |
|---|---|---|
| Full read-only audit | DONE | `00-audit/2026-09-29-full-audit.md` (on main) |
| Fix A: ch66–83 on era/traditions pages | DONE, live | main |
| Fix B: 93 garbled source links ch01–20 | DONE, live | main |
| Fix C: ch45/ch46 full text published, re-tagged pending | DONE, live | main |
| Batch III (ch66–74) cleared | DONE, live | main |
| Parenthesis-URL fix (7 links) | DONE, live | main |
| Weekly link check (`link-check.yml`, `tools/check-links.js`) | committed on main; NEVER RUN (needs default branch = main) | main |
| Founder guide + 34 screenshots | DONE | `00-audit/founder-guide.md`, `00-audit/founder-guide/` |
| Perf baseline + before/after | DONE | `00-audit/perf-baseline.md`, `00-audit/perf-baseline/` |
| Lighthouse CI on PRs (`lighthouse.yml`, `tools/lighthouse-pages.js`, confirms drops with 6 extra runs) | DONE, working | main |
| Analytics (Cloudflare Web Analytics) | built, OFF (empty token) | `docs/site-config.js` |
| README rewrite; operating rules in CLAUDE.md | DONE | main |
| Random-chapter 404 fix | DONE, live | `docs/random.html` |
| Speed fix #1 (canvases at phone resolution) | DONE, live (PR #12) | `docs/assets/games/*.js` |
| Speed fix #3 (Risk precomputed grid) | DONE, live (PR #12) | `risk.js`, `data/risk-grid.png`, `tools/build-risk-grid.js` |
| Music control, Compare swipe hint, Symbols tip fix | DONE, live (PR #12) | `ambient.js`, `compare.html`, `games.css` |
| Email sign-up hidden (code kept) | DONE, live (PR #12) | `docs/index.html` (`hidden` attribute) |
| Plans: first screen, fighter download | DONE | `00-audit/plans-2026-10.md` |
| First-screen doorway buttons (option A) | DONE, merged to main (PR #13) | `docs/index.html` |
| Fighter 6.2 MB → 0.7 MB (WebP half-size parts, only gods in play) | DONE, merged to main (PR #13) | `tools/build-fighter-art.js`; originals in `art-source/fighter/` |
| Compare: Underworld note → link to ch47 | DONE, merged to main | `docs/compare.html` |
| V76 English entry (Báb's Star Tablet) | NOT STARTED: blocked (source unreachable) | — |

Not committed anywhere: nothing. All the work above is pushed.

## Branches and PRs
- All merged: PR #11 (`claude/founder-baseline`), PR #12 (`claude/speed-ux-fixes`), PR #13
  (`claude/first-screen-fighter`, head `ac9b83d`, all checks green), and
  `claude/compare-underworld-link` (`b18eb17`), via merge commit `5609b63` on main.
- No open PRs from this session. The session's assigned branch `claude/state-audit-fzv14x-81bkof`
  is unused. Carter's rule: use the branch he names; flag any conflict before pushing.

## The very next step
1. Confirm the Cloudflare deploy of the latest main succeeded and that GitHub shows PR #13 as
   merged
   (`gh api repos/carterdaniel630-cmd/The-divine-Archives/actions/runs?branch=main&per_page=3`).
2. Then wait for Carter's next instruction. Candidates are under "Remaining work".

## Decisions still in effect
- Batch III cleared; Batch IV (ch75–83), ch45, ch46 and Vault V88 stay "pending review".
- Batch V chapters: ON HOLD until Carter reviews topics. Sourcing rule for all new chapters:
  scholarly or primary sources first, Wikipedia only as a pointer; flag any chapter where
  Wikipedia is over 20% of its sources.
- Pantheon figures and Vault objects for new chapters: hold until Batch V is scoped.
- V76: text-only English summary approved; no images of the Báb; cite the translation.
- Benin Bronzes scan: on hold.
- Email sign-up: hidden until Carter sets up a Kit account (provider = Kit).
- Analytics token and the two GitHub settings: Carter's to do; don't chase them.
- Nothing should wait: run long measurements in the background and keep working.

## Blockers (founder-only)
- **Analytics token:** paste it into `docs/site-config.js` (`cfAnalyticsToken`).
- **GitHub default branch is `claude/session-start-ikztvo`, not main.** Until Carter changes it
  (Settings → General → Default branch → main), `link-check.yml` never runs on schedule and new
  PRs default to the wrong base.
- **Repo description:** set it to "A comparative reference work on world religion and
  mythology, with evidence honesty." Not changeable from this session.
- **Kit account** for the email list (then un-hide the form and wire the provider).
- **Real-phone museum check:** Carter offered to do it. There are 83 rooms; test museum.html.
- **V76 translation:** Aqiqi & Lawson provisional translation (bahai-library.com) is blocked
  by the sandbox network. Carter must paste the passage, or allow that host in the
  environment's settings.

## Remaining work on the list (not started)
- Speed fixes #2 (fighter, done in #13), #4 (Tomb Robber filter/lighting), #5 (fighter shadows),
  #6 (load each game's code on demand), #7 (backdrop blur), #8 (Tomb Robber art), #9 (self-host
  fonts), #10 (game shadows): see `00-audit/perf-baseline.md`.
- First-screen option C (menu button on every page): planned, not approved.
- The sitemap omits `symbols.html` (where the games live).
- 31 stale remote branches (deleting needs Carter's approval).

## Useful tools
- Build order: `build-vault`, `build-chapters`, `build-pages`, `build-museum` (plus `build-sky`);
  then all `tools/verify-*.js`.
- `node tools/serve.js 8080` (local server with gzip); `tools/lighthouse-pages.js` (needs the
  `lighthouse` package); `tools/fps-games.js`, `tools/founder-shots.js` and
  `tools/build-*-grid/art.js` (need Playwright).
- Game lint, as in CI: `npx eslint@8 --no-eslintrc -c tools/eslint-games.json --ext .js docs/assets/games`.
