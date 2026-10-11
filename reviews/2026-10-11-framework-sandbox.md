PREVIOUS SCHEDULED RUN FAILED TO PUSH: 2026-10-10 21:32 UTC (routine had no repository access; already reported in the 2026-10-10 reports). This is a manual run.
0 passed, 0 fixed, 1 needs Carter.

NEEDS CARTER (1)
  - site:framework-sandbox (PR #40, draft, "do not merge"): new framework code, two ritual walkthrough drafts and a change to when Lighthouse can block a PR. New features always need you. It's technically sound, nothing on the live site changes, and the PR lists its own questions for you.

------------------------------------------------------------------------------------------------

Batch: framework sandbox, Phase 1 (PR #40, claude/framework-sandbox, draft)
Reviewed: 2026-10-11
Auto-pass: on ("audit 2026-10-11: 6 of 6 re-reviewed items agreed; rolling accuracy ... 17/17 (100%) ...", reviews/status.json)
Covers: claude/framework-sandbox@fce899e
Summary: 0 passed, 0 fixed, 1 needs you.

Automatic checks
  - review-checks.js --build: 8 checks pass, the build output is current, and nothing was left over. Nothing in
    docs/ changes, so the live site is untouched.
  - All 15 tools/verify-*.js pass. node --test framework/test/*.test.js: 26 of 26 pass.
    build-entity-registry --check: up to date (4,129 entities).
  - CI: on the first head (29a3081), the framework "test" job FAILED. CI tests the branch merged with main, and
    main had gained the Qumran and Alexandria sites, so the committed registry was stale (site, source,
    waypoint, index). I reproduced it and rebuilt the registry. Before I could push, the build session pushed
    the same fix (8374d1c, fce899e), with output byte-identical to mine, so I pushed nothing. On fce899e: test,
    checks, guard, links and verify are green. Lighthouse, runtime and originality were still running.
  - Largest new files: framework/registry/*.json (source.json about 15,000 lines). All are under the 2 MB limit.

NEEDS CARTER (1)
  - site:framework-sandbox: new features (REVIEWER.md §6). Would pass on the technical and sourcing side:
      - Ritual drafts (data/rituals/), both "draft", opt-in, unscored and explanatory:
          - Ānāpānasati (MN 118), first four steps: the wording matches the standard sutta text (long, short,
            whole body, calming).
          - Votive candle: the definition and the "votum, a private vow" origin match Hardon's *Modern
            Catholic Dictionary*.
          - Both say their pages were only seen through search.
      - Tiers (plans/rituals-tiers.md): tier 3 (sacraments, obligatory worship, initiations, closed rites) is
        "NEEDS CARTER, not drafted". Séance stays tier 2 and is framed as history, frauds included.
        The votive candle's tier conflict (1 here, 2 in plans/games-modern.md) is left for you.
      - Lighthouse (.github/workflows/lighthouse.yml): a drop of more than 5 points now only warns on draft
        PRs and on PRs not into main. It stays a hard gate for ready-for-review PRs into main, and marking a
        PR ready re-runs it. This fits the quality bar ("nothing merges with a red check") and doesn't weaken
        any gate on main.
      - reviews/ORIGINALITY.md proposes a line for REVIEWER.md and holds it for your approval. It does not
        change my rules. The originality check only catches copying, and says so.
    Note: the PR description still says 4,084 entities; the current head has 4,129.

Needs your decision
  - Approve Phase 1 of the framework sandbox (and say whether Phase 2 goes ahead)? (yes/no)
  - The votive candle: tier 1 or tier 2?
