Batch: README refresh, site-audit Fix 1 + Fix 8 (PR #90)
Reviewed: 2026-10-31
Auto-pass: on
Covers: loop/readme-refresh@0959caf
Summary: 1 passed, 0 fixed, 0 need you.

Reviewer: a fresh build-loop run that wrote none of PR #90 (it was built by an earlier run, reply
`2026-10-31-pr90-readme-refresh.md`). Reviewed `origin/main` `dd35228` ... `0959caf`: README.md only, +12 / -9.
Branch contains `main`.

Automatic checks: pass. `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings, no build
drift (working tree clean after build). 17/17 `tools/verify-*.js` pass. `framework/test`: 42/42 pass.
GitHub: 4/4 checks green on `0959caf` (checks, guard, runtime x2; Lighthouse doesn't run: no site files changed).

PASSED   (1)
  - site:pr90: every number and list in the new README text matches the branch's own data (checked below);
    nothing on the live site changes; no claim, source, pending tag or sensitive item touched.

FIXED    (0)

NEEDS CARTER (0)

Accuracy spot-checks (against the repo itself; the README is about the repo, so the repo is the source)
  - site:pr90 | 18 pending chapters, the listed ids | `docs/assets/data.js`: 18 `pending: true`, ids ch02 ch08
    ch11 ch12 ch19 ch20 ch21 ch42 ch44 ch47 ch50 ch51 ch52 ch53 ch60 ch61 ch69 ch74 | supports
  - site:pr90 | Vault 87 entries, V68 withdrawn | `docs/vault.html`: 87 `vault-card`s, V01–V88 without V68 | supports
  - site:pr90 | V88 pending | `docs/assets/vault-data.js` v88 `pending: true` | supports
  - site:pr90 | Pilgrimage 7 open (the seven named), 66 in preparation | `docs/assets/pilgrimage-data.js`: 7 live,
    6 preview, 60 queued; the same seven names; `docs/pilgrimage.html` says "7 open, 66 in preparation" | supports
  - site:pr90 | all seven open sites pending | each live site has `pending` set | supports
  - site:pr90 | pages without a share image: Museum, Random, Search, Pilgrimage list and site pages | scan of
    `docs/**.html` for `og:image`: those, plus 404, and the two noindex legacy redirects `chapter.html`/`era.html`
    (not real pages) | supports
  - site:pr90 | default branch still `claude/session-start-ikztvo` | `git ls-remote --symref origin HEAD` | supports

Note (not a finding): "A few pages have none yet" covers about 17 pages, mostly Pilgrimage site pages; the
categories are named, so the reader isn't misled. Share images for those pages are STATUS Next 4.

Needs your decision
  - Merge PR #90 (README only, live site unchanged)? yes / no
