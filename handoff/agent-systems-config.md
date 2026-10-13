# Divine Archives — Filled Configuration for the Agent Systems Pack

Companion to the friend's "Divine Archives Agent Systems" doc. He sent the
generic pack; this fills in the CONFIGURE block with the real repository
values and gives him the first work order (Ur).

## Approval status (Carter, 2026-10-13)

**All five systems approved.** The concern about process weight is handled by
the pack's own routing guide: approving all five means the full toolkit is
configured and available — each work item routes to only the systems it needs,
not all 22 agents every time.

## Rollout (per the pack's suggested rollout, with concrete scopes)

1. **Configure once** — filled block below; friend verifies each command manually.
2. **Pilot read-only** — System 1 (Codebase Cartography) on one narrow module:
   `docs/museum/` (the shipped museum). Deliverables: architecture-map.md,
   unknowns.md, council-handoff.md. No edits.
3. **Pilot one patch** — The Royal Game of Ur work order below through the full
   chain: System 2 (Change Planning) → System 4 (Quality) → System 5
   (Documentation). This is the real test of the machine.
4. **Expand gradually** — System 3 (Data Integrity) joins when a change touches
   IDs, routes, registries, or generated outputs. Parallel agents only after
   input/output contracts prove stable.

Why this saves tokens long-run: System 1's map means later agents reason from
structure instead of re-exploring the codebase every session; System 4 catches
defects before expensive rework; System 5 preserves decisions across sessions
so nothing gets re-derived. One-time setup cost, amortized over every build
after.

## Filled configuration block

```yaml
PROJECT_NAME: Divine Archives
REPOSITORY_PATH: carterdaniel630-cmd/the-divine-archives
DEFAULT_BRANCH: main
WORK_BRANCH_PREFIX: feature/
PACKAGE_MANAGER: none (static site — vanilla ES6, zero npm/CDN dependencies by build standard)
INSTALL_COMMAND: not configured (no install step exists)
BUILD_COMMAND: node tools/build-<area>.js (per-area scripts, e.g. build-museum.js — confirm exact names in tools/)
TEST_COMMAND: not configured as a single command (checks run in .github/workflows — confirm in repo)
LINT_COMMAND: not configured
TYPECHECK_COMMAND: not configured
FORMAT_CHECK_COMMAND: not configured
DEV_SERVER_COMMAND: any static server over docs/ (e.g. npx serve docs — not in repo, local only)
GRAPHIFY_INTERFACE: not configured (graphify codebase map exists in-repo but is not wired into the working branch — treat as absent)
GRAPHIFY_INDEX_COMMAND: not configured
GRAPHIFY_QUERY_COMMAND: not configured
GRAPHIFY_PATH_COMMAND: not configured
GRAPHIFY_EXPORT_COMMAND: not configured
PROTECTED_PATHS: docs/ (generated deploy output — Cloudflare Pages serves this on push to main; never hand-edit), .github/ (CI workflows)
GENERATED_PATHS: docs/
CONTENT_PATHS: sources/, vault/, eras/, themes/, content/, museum/
DATA_PATHS: framework/, plans/, audits/, reviews/
PUBLIC_ASSET_PATHS: docs/assets/ (confirm in repo)
COUNCIL_HANDOFF: via the repository owner (Carter) — no direct channel exists
HIGH_COUNCIL_HANDOFF: via the repository owner (Carter)
DESIGN_TEAM_HANDOFF: via the repository owner (Carter) — maps to Carter's Craft Council
OUTPUT_DIRECTORY: repo-local work directory outside docs/ (never inside the deployed tree)
```

## House rules the pack must respect

- Nothing merges to `main` without Carter's explicit go-ahead (repo rule, enforced by reviews/REVIEWER.md).
- Build work happens on `feature/<name>` branches; the owner reviews and enacts.
- The standing directive: anything prototyped outside the repo must be analyzed and built EVEN BETTER inside it — never a straight port.
- Read `.claude/CLAUDE.md` and `museum/00-scoping/PLAN.md` before touching museum work.

## Recommended starting chain (not all five systems)

For the first build, run only:

**System 2 (Change Planning and Implementation) → System 4 (Quality and Release Readiness) → System 5 (Documentation and Continuity)**

Skip System 1 (Cartography) for now — the repo map is already known.
Skip System 3 (Data Integrity) unless the change touches IDs, routes, or registries.

## First work order: The Royal Game of Ur (System 2 REQUEST)

```text
SYSTEM: Change Planning and Implementation
Apply the Shared Agent Contract and loaded project configuration.

REQUEST
Change request: Rebuild the Royal Game of Ur exhibit in the repo as a museum
living-room piece, analyzed and built better than the attached prototype
(the-royal-game-of-ur.html) — never a straight port. Must meet the repo build
standards: vanilla ES6, zero npm/CDN, working destroy() teardown, mobile DPR
capped at 1.0, scoped CSS.
Business outcome: first of ten exhibits integrated; establishes the true
per-exhibit build cost before committing to the rest.
Out of scope: the other nine exhibits; any change to docs/ outside the exhibit's
own files; VR or WebGPU work.
Required approvals: repository owner (Carter) before merge.

Known defects to fix (acceptance criteria from the exhibit audit):
- P0: Rosette motifs painted on wrong squares — visuals contradict the rules
  engine. Fix CELL_ROSETTES to {'0-0','1-3','0-7','2-0','2-7'}.
  Acceptance: every rosette-motif square grants an extra cast; no extra cast
  on non-motif squares; aria-labels agree.
- P0: Undo after the AI's move soft-locks the game. Only record undo for the
  human's move (this._lastCommand = isAI ? null : command).
  Acceptance: no undo/roll/restart sequence can strand the game.
- P1: 174 of 180 CSS selectors unscoped and leaking. Prefix all with `ur-game `.
  Acceptance: embedding on a page defining .board/.modal changes neither host
  nor exhibit.
- P1: Nested interactive elements (buttons inside buttons). Restructure so
  pieces are the single interactive element.
  Acceptance: no interactive nesting; full keyboard playthrough works.

Do not regress: binomial dice odds (1/16·4/16·6/16·4/16·1/16), exact bear-off,
rosette-8 sanctuary, no-legal-move auto-pass, rapid-click guards, clean restart
mid-AI-turn; scholarship labeling (Finkel credited; 2600–2400 BCE board dated
separately from the 177 BCE tablet; route labeled scholarly reconstruction);
prefers-reduced-motion honored; zero external requests.

Work on branch feature/ur-exhibit. End with the standard enactment package;
the repository owner performs the merge.
```
