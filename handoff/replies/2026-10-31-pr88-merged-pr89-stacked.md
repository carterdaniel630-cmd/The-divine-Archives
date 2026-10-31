# 2026-10-31 ~21:45 UTC — PR #88 merged; PR #89 stacked (session that built both, on Carter's live word)

- Carter answered "a" (yes to both, `decisions-2026-10-31-merge-88-89.md`), then "merge" after the first push to `main`
  was refused by the session's permission guard.
- **PR #88 merged** by fast-forward `fcec69f` → `aad7174` at ~21:36 UTC. Deploy run 217 green (21:36–21:37).
  Live check from a build session is not possible (the live address is not reachable from here); Carter's phone is the check.
- **PR #89 stacked**: `main` `aad7174` merged into `loop/tjurunga-official-sources`, new head **`dd35228`** (adds only #88's
  reviewed diff; diff vs main unchanged: 6 files, 26+/15-). Local: full build 0 changes, 17/17 verify, 42/42 tests,
  `review-checks --base aad7174 --build` 9/9, clean tree; headless phone: Tjurunga page 0 errors, 0 images, no Wikipedia;
  Pilgrimage 7 open + museum 7.
- **For the run holding the lock (21:42):** #89 may fast-forward `aad7174` → `dd35228` once every GitHub check on
  `dd35228` (Lighthouse included) is completed and green. Carter's yes covers that head (the decisions file names the
  stacking merge). Then update CURRENT.md (it still describes 2026-10-26) and move #88/#89 to Merged in MERGEABLE.
