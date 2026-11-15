# Independent review — PR #158, review-checks: Vault gets the chapters' sources-only rule

**Candidate:** `loop/review-checks-vault-sources` **`089441d5`** on `main` `fa81753b` (one commit, fast-forwards).
**Reviewer session:** ..01HFWzTpTaZS132Vycb42g63. Wrote none of #158 (builder ..01HFWzToHofH6REksVyk3KJC) and none of the site files it touches.
**Standard:** `reviews/REVIEWER.md` §3–§4; CLAUDE.md quality bar.
**Reviewed:** 2026-11-15 ~23:05 UTC.

## Verdict
**PASS — 0 findings.** Merge is **per item** (it changes a review gate): Carter's yes is still needed.

## What was checked
1. **Scope.** `git diff fa81753b..089441d5`: `tools/review-checks.js` only, +7/−2. No site, content, workflow or pending-field change.
2. **The Vault rule mirrors the chapter rule.** A published Vault entry that is not pending and not newly cleared now WARNs (instead of FAILs) only if (a) it existed at the merge-base, (b) its registry entry is `stable()`-identical, and (c) its markdown is identical outside `## Sources` (same `noSourcesMd` used for chapters). Anything else still FAILs. Chapters additionally compare rendered bodies; the Vault has no separate body store (pages are built from the markdown, and the `build` check confirms the output is current), so leaving that test out is correct.
3. **The regex.** `noSourcesMd` strips from `\n## Sources` to the next `\n## ` (an H2) or the end. Vault subsections are `###`/italic lines, so they stay inside the stripped block; a new H2 added after Sources is still compared. Same behaviour chapters have had since 2026-10-05.
4. **Pantheon footnote:** now printed only when a warning starts with `pantheon `. Correct; before, any warning (including the new Vault ones) printed a misleading Pantheon note.
5. **Own test on scratch commits (not pushed):** removing one Wikipedia bullet from cleared V09 → **WARN** "sources only, so it stays cleared"; adding one word of prose to cleared V04 on top → **FAIL** "not pending and not newly cleared", overall FAILED 1. The gate still catches prose changes.
6. **Risk.** The gate is loosened only for Sources-only edits, and each one is listed by name as a WARN that tells the reviewer to re-check the new sources. Same trade-off Carter already accepted for chapters.

## Local checks on `089441d5`
- `review-checks --base origin/main`: pass (no content touched). Verify 18/18 and tests 51/51 were run on the stacked head `63cd573e`, which contains this commit (see the #159 review).

## GitHub on `089441d5` (23:00 UTC)
4/4 completed green: guard, checks, runtime ×2. No Lighthouse run was triggered (tools-only change, no `docs/` diff). **Whoever merges: confirm against `main`'s branch rules that Lighthouse is not expected for a tools-only head; if it is, trigger it and wait.**

## Merge
Not merged. Missing: **Carter's per-item yes** (in STATUS → Needs Carter since 2026-11-15 ~23:20 UTC).
