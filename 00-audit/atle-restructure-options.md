# A.T.L.E. — Repo/Docs Restructure: Decision Brief (pick one — nothing executed)

> **STATUS: 🟠 DECISION BRIEF / AWAITING CARTER'S PICK. Nothing has been restructured.** This
> resolves the one open item from the audit §0: the repo is named `The-divine-Archives` and the
> root `CLAUDE.md`/`README.md` still frame Divine Archives as the top-level project, even though
> A.T.L.E. is now the parent. Three ways to fix that — choose one.

## The situation (verified fact)
- Repo name: **`The-divine-Archives`** (single repo).
- Root `CLAUDE.md` + `README.md`: written as if Divine Archives *is* the whole project.
- Everything else (merch, Pip's Orchard assets, audit, dashboard) already lives as sub-folders
  in this one repo. `ATLE-DASHBOARD.md` at root is currently the only "parent-level" doc.
- The 3 "The Orchard → A.T.L.E." umbrella strings are already renamed. This brief is only about
  the **top-level identity/structure**, not those strings.

---

## Option A — Keep one repo; add an A.T.L.E. "home" layer *(recommended now)*
Leave the folder layout as-is. Make A.T.L.E. the explicit top level via docs only:
- Add a root **`CLAUDE.md` parent section** (or a short `ATLE.md`) that says "A.T.L.E. is the
  parent; these are its brands," and points to each brand's own governing doc.
- Reframe the existing root `README.md` intro to "A.T.L.E. — repo home," with Divine Archives as
  the first brand section.
- `ATLE-DASHBOARD.md` stays the control center (already 80% of this).

**Effort:** low (docs only). **Reversible:** fully. **Keeps:** all history, the live deploy, every
path. **Downside:** the repo is still *named* `The-divine-Archives` (a cosmetic mismatch; the
GitHub repo can be renamed later in Settings without breaking clones — GitHub redirects the old name).

## Option B — Re-root in place (monorepo under A.T.L.E.)
Restructure inside the same repo: introduce top-level A.T.L.E. governance and move the Divine
Archives-specific root docs into a brand folder (e.g. `divine-archives/` or keep `docs/` + `eras/`
but demote their root docs). One monorepo, clear parent/brand tiers.

**Effort:** medium (moves files, updates internal links + the Cloudflare deploy path if `docs/`
moves). **Reversible:** yes, but touchier. **Risk:** the deploy Action publishes `docs/` — moving
it means editing `deploy.yml` and re-testing the deploy. **Do this when:** a second brand needs
its own repo-level config, or the repo name is going public and the mismatch actually matters.

## Option C — Multi-repo under an A.T.L.E. org *(not now)*
Separate repos per brand (Divine Archives, Pip's Orchard, PDFs, merch) under a GitHub org named
A.T.L.E., each deploying independently.

**Effort:** high (org setup, splitting history, N deploy pipelines, cross-repo coordination).
**Right when:** there's a team, independent release cadences, or access needs to be scoped per
brand. **Premature for a solo founder** — it multiplies overhead with no current benefit.

---

## Recommendation
**Option A now → Option B later.** A is cheap, reversible, and already most-of-the-way done via
the dashboard; it makes A.T.L.E. the visible top level today without risking the live deploy. Move
to **B** only when a concrete trigger appears (second brand needs repo-level config, or the public
repo name becomes a real problem). Skip **C** until there's a team or independent deploys.

## If you pick A, here's exactly what CC would do (on your go — not yet done)
1. Add a parent A.T.L.E. framing to root `README.md` (Divine Archives becomes brand §1).
2. Add a short parent note to root `CLAUDE.md` (or a sibling `ATLE.md`) naming the brands + their
   governing docs, without touching the Divine Archives rules themselves.
3. Cross-link the dashboard, audit, automation proposal, and each brand doc from that home.
4. (Optional, your click) rename the GitHub repo `The-divine-Archives → a-true-legacy-entertainment`
   in repo Settings — a founder action, and GitHub auto-redirects the old URL.

*No files were moved or reframed. This is the decision copy — tell me A, B, or C.*
