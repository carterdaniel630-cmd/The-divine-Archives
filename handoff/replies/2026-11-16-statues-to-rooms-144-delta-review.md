Batch: delta review, PR #144 (statues to their rooms), everything after the reviewed head b7a8afbd
Reviewed: 2026-11-16
Auto-pass: on
Covers: loop/statues-to-rooms@15450243 (b7a8afbd..15450243: e8807852 registry fix, e3ce23ca re-sync, 15450243 re-sync)
Summary: 1 passed, 0 fixed, 0 need you.

Independent: this review was done by a chat session that wrote none of #144 and is not ..01HFWzToripQrLZoisLfu8ny.
Carter's room choice and per-item yes: "a,yes" (decisions-2026-11-16-carter-a-yes-144.md).

Automatic checks (on 15450243): review-checks.js --base origin/main --build 9 passed, 0 failed, 0 warnings; all 18
verify-*.js pass; framework tests 51/51. GitHub checks were running on 15450243 when this was written.

PASSED   (1)
  - site:statues-to-rooms-144/delta: the commits after the reviewed head change nothing but generated files and
    merges.
    - e8807852 touches only framework/registry/index.json and source.json (the new source log's entity).
    - e3ce23ca (re-sync onto f92ab8d7): #144's own diff is byte-identical before and after it (b7a8afbd's diff plus
      the registry fix, compared hunk for hunk).
    - 15450243 merges main 1d96c8bc plus #162 (b26b19d8). There were no conflicts: none of main's 44 newer commits
      touch #144's files, and the only museum file main changed since is docs/museum/english.js (source text).
      The auto-merged registry was stale (2 framework tests failed: entity count, registry vs fresh build). It
      was rebuilt with tools/build-entity-registry.js, not by hand, giving 51/51. #144's diff against #162's head is
      the same 8 files as before.
    - The original reviewer's museum probe (handoff/previews/statues-to-rooms-review/probe.js) re-run on 15450243 at
      390x844 and 360x740 gives the same results as its first run:
      - Rotunda: no statue shown.
      - ch15 Zeus and ch83 Shiva: 72 close views each, 0 over the 220k / 100-call budget (worst 202.7k / 61 in
        Classical Greece, 166.4k / 41 in Global Hinduism). Each statue is shown from all 8 sides, its card opens
        from front and back, and it survives the wing drop/rebuild.
      - No statue through walls from ch13, ch14, ch16, ch81, ch82, ch84, ch85.
      - Script errors: 0.
    - Checklist 6 (sensitivity): Shiva and Zeus are sacred figures in a new placement. Carter's per-item yes names
      them (decisions-2026-11-16-carter-a-yes-144.md). Nothing else touched.

FIXED    (0)

NEEDS CARTER (0)

Accuracy spot-checks
  - none in the delta (no text changes after the reviewed head).

Needs your decision
  - Nothing needed: merge per item on Carter's "a,yes" once GitHub is green on 15450243 and #162 (stacked under it) is
    merged.
