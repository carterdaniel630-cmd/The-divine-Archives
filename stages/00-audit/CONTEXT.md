# Stage 0 — Ground-Truth Audit (validated against production `main`)

**Track:** Site Overhaul (getconexto.com). **Branch:** `claude/site-overhaul` (based on `origin/main`).
**Status:** ✅ Complete and reviewed. Findings below are the versions **re-validated against
production `main`** (44 chapters), not the earlier snapshot.

## Deploy topology (determined, not assumed)
- **Production deploys from `main`.** Confirmed by GitHub Actions history: 42 "Deploy to Cloudflare
  Pages" runs, every one `head_branch: main`, `--production-branch=main`, all succeeded; the only
  deploy config in the repo is `.github/workflows/deploy.yml` (there is no `wrangler.toml`).
- **Cloudflare secrets are configured and working** (`CLOUDFLARE_API_TOKEN`,
  `CLOUDFLARE_ACCOUNT_ID`) — the deploy step uses them and 42 runs succeeded. Values not read.
- Output dir `/docs`; no CI build step (prerendered files are committed and served as-is).
- A manual `workflow_dispatch` run deploys to a **`preview`** alias, a safe branch-test lane.

## Rendering method per page (raw-HTML content test)
- **Static, content-in-HTML (fine):** all `chapters/chNN.html` (44), `about.html`,
  `methodology.html`, `404.html`. `chapter.html` is a `noindex` legacy redirect.
- **JS-mounted, empty to a plain fetch (the indexing problem — Stage 1 targets):** `index.html`
  (era spine), `eras.html`, `themes.html`, `traditions.html`, and `era.html?era=` (9 eras from one
  file, shared meta, canonical stripped of the query string). Re-checked on `main`: still empty.

## Founder-lane items (open for Carter)
- Google Search Console indexing status/access (no credentials in repo).
- Confirm getconexto.com is the live Pages custom domain (CNAME present; behavior confirmed only
  from repo/CI, not the CF dashboard).

*(The original, fuller audit was written on the parked `claude/pistis-sophia-research-8ytkke`
branch against a stale 43-chapter snapshot; this file is the corrected, main-accurate version.)*
