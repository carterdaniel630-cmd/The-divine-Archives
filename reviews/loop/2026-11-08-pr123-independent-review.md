# PR #123 — independent review (verdict headings unified site-wide)

**Reviewed:** `origin/main` `141c8271` ... `loop/verdict-headings` `42e02ef4` (3 commits: `11fcbd51` headings, `bffa2aa2` re-clear, `42e02ef4` merge of `main` after #122)
**Reviewer session:** ..01HFWzTmenAzjHrT7GDkHUVi — wrote none of the candidate (builder ..01HFWzTovazLUaNgT45KnyVv)
**Against:** `reviews/REVIEWER.md` §3–§4, and the order `handoff/verdict-headings-unify-order.md`
**Verdict:** PASS, 0 open findings.
**Merge route:** class (c) label/honesty-wording fix on Carter's ruling (books FLAG 4, the order), plus Carter's **per-item** re-clear of the 49 cleared chapters for this change only (`decisions-2026-11-08-carter-reclear-verdict-headings.md`). No pending tag is cleared by the PR: the 13 pending chapters stay pending.

## What I checked, by script (not by eye)
- **Markdown sources** (62 files in `eras/` and `themes/`): same line count before and after; every changed line, with the order's four mappings applied to the old line, equals the new line exactly; every changed line is a bold lead/heading line. **149 replacements in 62 chapters**, matching the PR body (W 62, N 34, N/contested 3, G 50). No body, bullet or source line changed.
- **`content/chapters.js`**: 149 changed lines, every one an `<h4>` and every one exactly the mapped old line. Nothing else.
- **Built pages** (`docs/chapters/*.html`, 62 files): per file, only `<h4>` lines (149 total, all exact mappings) and the JSON-LD `dateModified` (62). Nothing else.
- **`content/dates.json` / `docs/sitemap.xml`**: modified dates for the 62 chapters (stamp-dates) and the lastmod lines that follow from them. Build output, matches a fresh build.
- **`reviews/cleared.json`**: append-only — the old `chapters` list is an unchanged prefix, `vault`, `pantheon`, `reopened` untouched; **49 new entries, 49 distinct ids**, each citing the order and Carter's re-clear file. The 49 ids are **exactly** the changed chapters that show no pending banner; the other 13 (ch21, ch42, ch44, ch47, ch50, ch51, ch52, ch53, ch60, ch61, ch69, ch74, ch84) still show it. Pending/cleared split is identical to `main`.
- **Left alone, correctly:** every remaining old-wording heading in the markdown is one of the variants the order does not list (e.g. "Genuinely open — and contested", "Not supported (as established fact) / to be rejected"); these are the 26 listed in the PR body for Carter's ruling, not misses.

## Checklist (§4)
1. Accuracy: no claim changed (headings only). Pass.
2. Lens balance: unchanged. Pass.
3. Evidence-honesty tiers: still three separate tiers; the new wording is Carter's canonical one. Pass.
4. Contested claims: unchanged. Pass.
5. Tone: unchanged. Pass.
6. Religious sensitivity: no image, object, site or figure touched; wording-only. Pass.
7. Games/3D: none touched. n/a.

## Local checks (this session, on `42e02ef4`)
- `node tools/review-checks.js --base origin/main --build`: **9/9 PASS** (pending-diff: 62 changed, all pending or cleared); tree clean after build.
- Every `tools/verify-*.js` (18): pass. `node --test framework/test/*.test.js`: **42/42**.
- Headless Chromium 360 and 390 on ch21, ch22, ch27, ch39, ch49, ch57, ch61, ch84: no page errors (only external fonts blocked by the sandbox proxy, same on `main`), no sideways scroll, the new headings render in the "Evidence, honestly" box; pending banner present exactly on the pending ones.

## Notes (not findings)
- ch84 already reads "Not supported by the evidence" (no "What's") and ch03 uses a curly apostrophe; both are in the PR's variant list for Carter, not changed here.

## GitHub (at ~04:05 UTC on `42e02ef4`)
9/10 green (originality, test, verify ×2, runtime ×2, checks, guard, links). **Lighthouse in progress.** Merge waits on it.
