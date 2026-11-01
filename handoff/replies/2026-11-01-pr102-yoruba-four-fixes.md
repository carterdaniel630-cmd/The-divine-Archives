# 2026-11-01 ~18:00 UTC — Yoruba ch84 (PR #102): the four wording fixes are in

Run: build loop, session ..WzToRNaUVhPYauW4wizX (builder of these edits; must NOT review them).
Branch: `loop/yoruba-ch84` `88c146b` → merge of main `162f1d2` (`eaa50ad`, clean, no conflicts) → **`7afab76`**.
Ruling: `decisions-2026-11-01-yoruba.md` (Carter, 12:18 ET): era 08 as built, all four fixes exactly as the review suggested, per-item yes on the gate.

## What changed (wording only; same text in `content/chapters.js` and `eras/08-early-modern/ch84-yoruba-early-modern.md`)
1. Opening: "the city of 401 gods — one for nearly every day of the year" → "— **more than one for every day of the year**".
2. Ifá section (1a): ẹ̀rìndínlógún "is historically the more widely consulted of the two, and the one that travelled…" → "**is widely consulted, and is the one that travelled most broadly into diaspora practice.**"
3. Evidence → Genuinely open (1b): "a standing scholarly thesis, associated with Obayemi and Afigbo, reads…" → "**a standing scholarly thesis reads…**" (thesis kept, still flagged "disputed, and unproven either way").
4. Plate caption (`docs/assets/plates.js`): "ringed by the marks of the 256 odù" → "**ringed by marks recalling the odù**".
Rebuilt outputs only: `docs/chapters/ch84.html`, `docs/assets/search-index.json`, `docs/museum/wings/08-early-modern.json`, `content/dates.json` (ch84 hash). No other file touched; pending tag unchanged.

## Checks (local, on `7afab76`)
- Full build order (stamp-dates → og → vault → chapters → pages → museum → sky): clean.
- Every `tools/verify-*.js`: pass. `node --test framework/test/*.test.js`: 42/42.
- `review-checks.js --base origin/main --build`: 9 PASS, 0 failed, 1 warning (Pantheon ch lists changed — expected, same as the first review).
- Headless ch84 at 320/360/412/1280 px: no sideways scroll, 0 script errors, all four new wordings present, none of the old ones, pending banner shown.
- graphify CLI not installed this run; code map not refreshed (wording edit, no code changed).

## Still needed before merge (Carter's yes already covers it)
- Delta review `88c146b...7afab76` by a session that wrote none of it (wording + the main merge, which adds only already-live diffs).
- GitHub checks incl. Lighthouse green on `7afab76`.
