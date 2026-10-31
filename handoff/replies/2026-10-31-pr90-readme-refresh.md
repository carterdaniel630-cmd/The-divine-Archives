# 2026-10-31 ~22:45 UTC: PR #90, README refresh (site-audit Fix 1 + Fix 8)

**Item:** STATUS Next 3, Fix 1 (`audit-fixes-2026-10-25.md`), Carter's go `decisions-2026-10-25-audit-fixes-go.md`.
**Branch / PR:** `loop/readme-refresh` head `0959caf`, PR #90 to `main` (`dd35228`). Changes `README.md` only.

## What changed (each checked against `main` `dd35228`, not just taken from the audit)
- **Pending chapters:** 11 → **18**: ch02, ch08, ch11, ch12, ch19, ch20, ch21, ch42, ch44, ch47, ch50, ch51, ch52, ch53, ch60,
  ch61, ch69, ch74. Taken from the `pending` flags in `docs/assets/data.js`; the audit's list matches exactly.
- **Vault:** 88 → **87**. The 87 V-cards on `docs/vault.html` are the count; V68 Tjurunga is withdrawn and has its absence page.
  The layout line now notes V68 is withdrawn.
- **Pilgrimage:** "1 open, 71 queued" → **7 open, 66 in preparation**, with the seven listed. **Different from the audit's 3**
  because #87 and #88 have gone live since. Source: `docs/assets/pilgrimage-data.js` (7 live, 6 preview, 60 queued), matching
  the line on `docs/pilgrimage.html`. The README also says V88 and the seven open sites are pending.
- **Share images:** "every page has one" now says a few pages have none yet (Museum, Random, Search, the Pilgrimage list and
  site pages) and that their images are still being picked. A scan of `docs/` found more Pilgrimage pages without an
  og:image than the audit's six, because of the new sites. No image was added or chosen.
- **Fix 8 (checked):** `git remote show origin` says HEAD branch is still `claude/session-start-ikztvo`. The README note was
  accurate, and is now marked "checked 2026-10-31". Changing the default branch is Carter's setting; the loop doesn't touch it.
- **Left alone:** Pantheon 199 and Museum 83 recounts are browser-walk items outside this package.

## Checks (on `0959caf`)
- Full build order (stamp-dates, build-og, build-vault, build-chapters, build-pages, build-museum): no changes to generated files.
- 17/17 `tools/verify-*.js` pass.
- `node --test framework/test/*.test.js`: 42/42 pass.
- `node tools/review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- No browser check: nothing visual changed (README isn't deployed).

## Before it can merge
1. An independent review by a run that wrote none of it (`reviews/REVIEWER.md` §3–§4).
2. GitHub checks green.
3. Carter's yes for #90. Low risk: paperwork only, and the live site doesn't change.
