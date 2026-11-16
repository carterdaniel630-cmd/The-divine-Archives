# Build loop run 2026-11-16 02:53 UTC: PR #164 re-synced onto `main` `aec1d958`

Session ..01HFWzTmZwU2Z7EysnayYiMx. It re-synced #164, so it may **not** do the delta review of the merge commit.
It wrote none of #164's site changes (builder ..01HFWzTmh84LoDvb6ru8pbwy; independent reviewer ..01HFWzTjwFohEu93vmfkepVG).

## Lock and claims
- No `handoff/loop/LOCK` at start; wrote one (02:53 UTC), now removed.
- `CLAIM-merge-144.md` (01:32 UTC, under 3 h) respected: `loop/statues-to-rooms` and the #144 lines in MERGEABLE untouched.
- `VR-LOCK` is the VR loop's; VR work left to it.
- No `handoff/HALT`. Newest rulings read (`decisions-2026-11-16-carter-egypt-vr-open.md`, `...-ground-at-your-feet.md`): both VR-side, no change to this item.

## Item picked
STATUS Next 0fi (1): re-sync #164 onto `main` `aec1d958`. Highest-value item needing no Carter approval to do (#144 is claimed).

## What was done
- `loop/rosetta-cartouche-360`: merged `origin/main` `aec1d958` into `bcd6f517` → **`ce2fd948`** (merge commit only). Git merged cleanly; the only incoming changes are #162's four files (`content/chapters.js`, `content/dates.json`, `docs/chapters/ch19.html`, the ch19 source `.md`). No file is shared with #164's diff.
- Full build order (`stamp-dates`, `build-og`, `build-vault`, `build-chapters`, `build-pages`, `build-museum`, `build-sky`) run on the merge before committing: **no further diff**, so no generated file needed hand-merging or rebuilding.
- Pushed; PR #164 head is now `ce2fd948`, not a draft, GitHub checks started.

## Checks (on `ce2fd948`)
- `review-checks.js --base origin/main --build`: 9 pass, 0 fail, 0 warn.
- `tools/verify-*.js`: 18/18 pass. `node --test framework/test/*.test.js`: 51/51.
- Headless (Playwright, Chromium) at 320 / 360 / 390 / 1280:
  - `vault/rosetta-stone.html`: scrollWidth = clientWidth at every width; ring 229 / 255 / 280 / 327 px; smallest sign 24 px; 0 script errors. Screenshot at 360 looked at.
  - `chapters/ch19.html` (the incoming change): no overflow, 0 script errors.
- Not run: `graphify` CLI is not installed in this session, so `graphify update` could not run (this run changed no code beyond a merge of already-merged code).

## Still needed before merge
1. **Delta review** of merge commit `ce2fd948` by a session that is NOT ..01HFWzTmZwU2Z7EysnayYiMx (re-syncer). ..01HFWzTjwFohEu93vmfkepVG may do it.
2. **GitHub green incl. Lighthouse** on `ce2fd948` (running at 02:58 UTC; not waited for, lock not held).
3. **Carter's per-item yes** (layout fix, not mergeable by class).
