# Full audit: The Divine Archives (2026-10-04)

- **Audited commit:** `cf0566f` on `main` ("Handoff: current state for the next session"). Its Cloudflare deploy run succeeded (run 37168787900).
- **Mode:** read-only. This file is the only thing written. Nothing was merged, deployed or deleted.
- **Roadmap sources read:** `handoff/CURRENT.md`, `CLAUDE.md` (with the operating rules), `README.md`,
  `outline/master-outline.md` (status board), `00-audit/2026-09-29-full-audit.md` (its "Next moves" and Batch V),
  `00-audit/plans-2026-10.md`, `00-audit/perf-baseline.md` (its top 10 fixes), and `stages/00`–`05`.
- **Limits:** this sandbox can't reach getconexto.com or most outside sites, so the live site and external links
  weren't checked. Every finding below comes from the repository and the GitHub API.

---

## 1. Handoff vs. what's actually there

`handoff/CURRENT.md` is accurate. I confirmed almost every claim in it against the files, commits and GitHub. These four things differ:

| Handoff says | What I found |
|---|---|
| (Not mentioned.) The session's local checkout was `claude/divine-archives-audit-9j64dt` | That branch is **267 commits behind `main`**. It's a stale August snapshot with 42 chapters and no `handoff/`. Anyone who reads files without switching to `main` sees an old site. |
| "31 stale remote branches" | There are **37** non-main branches on the remote (list in §4). |
| PR #13: "lighthouse was still running at handoff" | **Still `in_progress`** as of this audit (01:43 UTC). It started 01:35:51 UTC. That's normal: the job confirms any score drop with 6 extra runs. It isn't stuck yet. |
| README: the analytics token goes in `docs/assets/site-config.js` | The file is **`docs/site-config.js`**. The handoff has the right path; **the README is wrong**. |

Nothing else in the handoff is missing from the repo.

---

## 2. Roadmap status

Key: **DONE** (with the commit) · **IN PROGRESS** (with the branch) · **NOT STARTED** · **NOT FOUND** (named in a plan, but no trace of the work in any file, commit or branch).

### 2.1 Content

| Item | Status | Evidence |
|---|---|---|
| Chapters ch01–ch83 (76 traditions + 7 themes) | DONE | 83 markdown files; 83 pages in `docs/chapters/`; `fb3e43b` (Batch IV complete) |
| Batch III ch66–ch74 cleared | DONE | `c7d8de4` |
| Batch IV ch75–ch83 cleared | NOT STARTED (waiting on Carter's review) | still `pending` in `data.js`; banners on the live pages |
| ch45 / ch46 full text republished, tagged pending again | DONE | `4d82b63`. Both still need Carter to clear them. |
| 11 pending banners on live pages | DONE, correct | exactly 11 chapter pages carry "pending full review" (ch45, ch46, ch75–ch83) |
| Vault V01–V88 | DONE | 88 `vault/*.md` files, 88 pages. V88 is still pending. |
| V76 English entry (Báb's Star Tablet) | NOT STARTED, blocked | `docs/museum/english.js` has no V76 entry. The source host is blocked from the sandbox. |
| V68 English entry (Tjurunga, a short "none" note) | NOT STARTED | no V68 entry in `english.js` (2026-09-29 audit, move 10) |
| Batch V chapters (one per era) | NOT STARTED (on hold for Carter's topic review) | no ch84+ files; no commits |
| Pantheon figures for ch66–ch83 | NOT STARTED (on hold until Batch V is scoped) | 0 figures in `pantheon-data.js` reference any of ch66–ch83 |
| Vault objects for the 26 chapters with none | NOT STARTED (on hold) | 0 Vault entries list any of ch66–ch83 as a home chapter |
| Risk: Nubia and Arabia facts | NOT STARTED | `risk.json` still says "the `nubia` tile is intentionally left uncovered… no dedicated Nubia/Kush chapter", even though ch68 exists |
| Source-quality pass (swap Wikipedia for primary/peer-reviewed sources; ResearchGate IDs → DOIs) | NOT STARTED | ch81 still has 2 bare ResearchGate links; see §3.3 for the Wikipedia share |
| Date-sensitive rechecks (ch80 Aga Khan V, ch83 Kumbh/BAPS, ch74 surveys) | NOT STARTED | no commits touch them since Batch IV |

### 2.2 Fixes from the 2026-09-29 audit

| Item | Status | Evidence |
|---|---|---|
| Fix A: ch66–ch83 on the era and traditions pages | DONE | `5966031` |
| Fix B: 93 garbled source links | DONE | `be4df28` |
| Fix C: ch45/ch46 from markdown | DONE | `4d82b63` |
| Parenthesis URLs (7 links) | DONE | `97d459a` |
| Outline doc sync (Vault V78–V87, status values) | DONE | `5868ee3`; the outline now lists V78–V87 as CLEARED |
| Weekly link-check workflow | DONE but **never run** | `b9401da`. GitHub returns **404** for `link-check.yml` because the workflow isn't on the default branch. |
| `href="<` guard in CI (to stop finding B coming back) | NOT FOUND | no such check in `verify.yml` |
| Museum: re-measure performance at 83 rooms | NOT STARTED | `museum/01-build/REPORT.md` still has the 65-room numbers |
| Museum: real-phone check | NOT STARTED (Carter offered to do it) | — |
| Benin Bronzes scan | NOT STARTED (on hold by decision) | — |

### 2.3 Site, speed and tooling

| Item | Status | Evidence |
|---|---|---|
| Founder guide + 34 screenshots | DONE | `647c485`, `76dbb7c` |
| Perf baseline + before/after | DONE | `24af9ba`, `9d514b2`, `420c4ba` |
| Lighthouse CI on PRs | DONE | `1039b2a`, `a255200` |
| Analytics (Cloudflare Web Analytics) | DONE in code, **OFF** | `324f393`; `cfAnalyticsToken: ""` in `docs/site-config.js` |
| Random-chapter 404 fix | DONE | `46b8127` |
| Speed fix #1: canvases at phone resolution | DONE | `e047b5d` |
| Speed fix #2: fighter 6.2 MB → ~0.4–0.7 MB | IN PROGRESS | `claude/first-screen-fighter` (`071ef4f`), PR #13 (draft, approved by Carter, lighthouse running) |
| Speed fix #3: Risk precomputed grid | DONE | `537e2ee` (+ `7954896`) |
| Speed fixes #4–#10 (Tomb Robber filter/lighting, fighter shadows, load game code on demand, backdrop blur, Tomb Robber art, self-host fonts, game shadows) | NOT STARTED | `perf-baseline.md` top-10 table; no commits |
| Music control / Compare swipe hint / Symbols tip box | DONE | `228f455`, `ca0c146`, `fae15f1` |
| Email sign-up hidden (code kept) | DONE | `71c6c6b`; `invite-card hidden` in `index.html` |
| First screen option A (doorway buttons) | IN PROGRESS | `claude/first-screen-fighter` (`b1b8a59`), PR #13 |
| First screen option C (menu on every page) | NOT STARTED (planned, not approved) | `plans-2026-10.md` |
| First screen options B, D | NOT STARTED (kept for later) | `plans-2026-10.md` |
| Compare: Underworld panel → link to ch47 | IN PROGRESS | `claude/compare-underworld-link` (`b18eb17`) = PR #13 + 1 commit. Approved by Carter, no PR. |
| Sitemap includes `symbols.html` | NOT STARTED | `sitemap.xml` has 189 URLs and none is `symbols.html` |
| Stale branch clean-up | NOT STARTED (deletion needs Carter) | 37 branches, §4 |

### 2.4 Site-overhaul stages 0–5 (`stages/`)

| Stage | Status | Evidence |
|---|---|---|
| 0 Ground-truth audit | DONE | `stages/00-audit/CONTEXT.md` |
| 1 Prerendering / indexing | DONE | per-era static pages, generated sitemap (`tools/build-pages.js`) |
| 2 Navigation | DONE | breadcrumbs, see-also, `search.html` |
| 3 Visual design | DONE | `archive.css` |
| 4 Engagement (compare, random, PDF) | DONE | `compare.html`, `random.html` |
| 5 Trust / conversion | DONE in code. **Email is OFF** (no KV binding, no Kit account; the form is hidden). | `functions/api/subscribe.js` |
| Founder item: submit the sitemap in Google Search Console | NOT FOUND | no verification meta tag or file in `docs/`; no record it was ever done |

---

## 3. What's missing, ranked

Ranked by how much each gap affects (1) first-time visitors, (2) search indexing, and (3) sourcing credibility.
Effort: **S** < 1 hour · **M** about a session · **L** several sessions.

### 3.1 First-time visitors

| Rank | Gap | Why it matters | Effort |
|---|---|---|---|
| V1 | **The first screen shows no way in.** The fix (doorway buttons) is built but sits in PR #13, not live. | A newcomer on a phone sees a title and a search box, and the Vault, Museum and games are 5–8 screens down | S (merge, once lighthouse is green) |
| V2 | **No share image (`og:image`) on any page.** Every page has `og:title`/`og:description` but no image. | Links shared to social media, iMessage or Discord show as plain text cards, the main way a new person first meets the site | S–M (one image per era or section, injected by the build) |
| V3 | **No site menu on phones** (option C). The inner-page header takes about a fifth of the screen. | Readers who land on a chapter from search can't easily get anywhere else | M |
| V4 | Tomb Robber is still the slowest game (about 20 FPS on a throttled phone); speed fixes #4 and #8 | The games are a big draw | S–M |
| V5 | Game code for all twelve games loads on the Symbols page (fix #6); Google Fonts load from a third party (fix #9) | Slower first load on every page | M |

### 3.2 Search indexing

| Rank | Gap | Why it matters | Effort |
|---|---|---|---|
| S1 | **Google Search Console never set up** (no record of the sitemap being submitted, no verification) | Google may not have discovered most of the 189 URLs; there's also no visibility into how the site is indexed | S (needs Carter: account + DNS or meta tag) |
| S2 | **The Pantheon's 199 figures are invisible to search engines.** `pantheon.html` is 7 KB of shell; every figure is drawn by JavaScript (0 static mentions of "Osiris"). No per-figure pages. | 199 potential landing pages ("who is Ereshkigal") don't exist for Google | M (prerender into `pantheon.html` first; per-figure pages later) |
| S3 | **`symbols.html` is missing from the sitemap**, and its symbol list is also JS-rendered | The games and symbol pages aren't indexed | S |
| S4 | **Article JSON-LD has no `datePublished`, `dateModified` or `author`**, and the sitemap has no `<lastmod>` | Weaker rich results and crawl freshness signals. This matters for the "pending review / revised" story too. | S |
| S5 | GitHub default branch is `claude/session-start-ikztvo` | Doesn't affect Google directly. It stops the weekly link check running (dead links hurt quality signals) and makes new PRs target the wrong base. | S (Carter, 4 taps) |
| S6 | Analytics off | You can't see what search sends you, or where visitors drop off | S (Carter pastes the token) |

### 3.3 Sourcing credibility

| Rank | Gap | Why it matters | Effort |
|---|---|---|---|
| C1 | **Heavy Wikipedia reliance.** Across the 83 chapter source logs, **521 of 1,255 unique URLs (≈42%) are Wikipedia.** **69 of 83 logs are over the 20% flag line** Carter set for new chapters. Highest: ch05 (5/6), ch33 (10/12), ch40 (8/10), ch69 (26/34), ch14 (6/8). Caveat: older logs also cite print books without URLs, so the URL share overstates their real reliance. The newer, URL-heavy chapters (ch66–ch83) are a fair measure, and most sit at 50–76%. | It's the most obvious weakness a skeptical reader or academic will spot, and it cuts against the project's core promise | L (best done chapter by chapter, starting with contested claims) |
| C2 | **Weekly link check has never run.** No external link has been checked since the chapters were written. | Dead source links on a "real sources only" site | S once Carter changes the default branch |
| C3 | 11 chapters and V88 have been "pending review" since 2026-09-29/30 | Visible on the live pages. It's honest, but a long-lived pending tag reads as unfinished. | Carter's review time |
| C4 | Date-sensitive claims (ch80 Aga Khan succession, ch83 Kumbh 2025 and BAPS allegations, ch74 survey figures) not rechecked | These go stale fastest | S |
| C5 | ch81's 2 bare ResearchGate links; no CI guard against the finding-B link garbling coming back | Fragile links; regression risk | S |
| C6 | Depth gaps from the 2026-09-29 audit (Renaissance esotericism, canon formation/deuterocanon, Christian mysticism, Southeast Asia, pre-Inca Andes, folk magic) | CLAUDE.md names several of these explicitly. Batch V would close them. | L (on hold for Carter) |

### 3.4 Founder-only blockers (only Carter can do these)

1. **Change the GitHub default branch to `main`** (Settings → General → Default branch). This unblocks the weekly link check and the right PR base.
2. **Paste the Cloudflare Web Analytics token**, or tell Claude to read it out of a message, to turn on analytics.
3. **Google Search Console:** create the property for getconexto.com, verify it, and submit `sitemap.xml`. Claude can add a verification meta tag if Carter sends the code.
4. **Repo description:** it still reads "a friendship encyclopedia of spiritual doctrine and it's proofs" (confirmed via the API). Change it to the agreed line.
5. **Kit account** for the email list, if the list is still wanted.
6. **Review Batch IV (ch75–ch83), ch45, ch46 and V88**, then clear them or send notes.
7. **Batch V topics:** approve or swap the 9 proposed in the 2026-09-29 audit §5.1.
8. **V76 source:** paste the Aqiqi & Lawson passage, or allow `bahai-library.com` in the environment's network settings.
9. **Real-phone museum check.**
10. **Approve deleting the stale branches** (§4).

---

## 4. Branches

**In progress, not on `main`:**
- `claude/first-screen-fighter`: 5 commits ahead, 1 behind (the handoff commit). PR #13, draft. runtime ✅ ×2, lighthouse running. Carter approved the merge.
- `claude/compare-underworld-link`: PR #13 + 1 commit (`b18eb17`). Carter approved it. No PR.

**Merged or superseded (0 unique commits per `git cherry`, or plainly old):** `audit-fixes`, `founder-baseline`, `speed-ux-fixes`,
`state-audit-fzv14x`, `virtual-museum`, `ch45-pistis-sophia`, `content-port-new-chapters`, `divine-archives-completion-2bplik`,
`divine-archives-update-xg83tz`, `divine-archives-status-images-w5l0fk`, `divine-archives-audit-9j64dt`, `games-build`,
`games-fighter-cutout`, `games-fighter-f3`, `games-fighter-rig`, `locate-current-task-cmjnz3`, `mini-games-layer`,
`session-start-ikztvo` (the current GitHub default), `site-information-updates-0ycl4c`, `site-overhaul`, `stage-3-ycbpej`.

**Have commits that aren't on `main`, all old (August to 23 September), none on the current roadmap:**
- Unrelated to this project (merch / other ventures): `clipyield-ugc-init-h52c0c`, `orchard-merch-stage-setup-7kcebk` (15 commits),
  `printify-merch-status-mmly9k`, `parallel-build-workstreams-te4g1k`, `parallel-build-workstreams-yq09vz`,
  `current-update-annu7g`, `divine-archives-status-lq6zz4` (merch/Tree of Life drafts).
- Old planning or audit notes, overtaken by later work: `games-audit` (6 audit docs), `divine-archives-audit-nr3mln`,
  `state-audit`, `pistis-sophia-research-8ytkke`, `pending-reviews-approval-bhb8n4`, `next-ptzs6g` (ch21 deepening, already on main in a later form).
- Abandoned fighter pilot: `pose-based-fighter-sprites-ot2nig`.

Recommendation: the merch branches may be worth keeping if that work restarts. Everything else can go once Carter approves.

---

## 5. Next actions, in order

1. **Finish the approved merge.** When PR #13's lighthouse is green, bring `claude/compare-underworld-link` up to date with `main`,
   run the 5 builds and 13 verifiers, fast-forward `main`, and confirm the deploy. Approved by Carter in the last session; not done here (this audit is read-only).
2. **SEO quick wins on one branch (pre-approved fixes):** add `symbols.html` to the sitemap, add `<lastmod>` and
   Article `datePublished`/`dateModified`, add `og:image` (an existing plate or emblem per page), and fix the README's analytics path.
3. **Prerender the Pantheon** into static HTML so its 199 figures can be indexed. This is a site change, so it needs approval.
4. **Source-quality pass, starting with ch66–ch83** (the measured 50–76% Wikipedia band): swap in primary or peer-reviewed sources for contested claims, replace the ResearchGate IDs with DOIs, recheck the date-sensitive claims. Changes go in place; the chapters are already pending.
5. **Small regressions and cleanups:** CI guard against `href="<`, the Risk Nubia (ch68) and Arabia (ch70) facts, the V68 "none" English entry, and the remaining speed fixes #4 and #7 (both low effort).
