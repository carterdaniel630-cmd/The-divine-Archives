# Reviewer agent and auditor (plan, built)

**Status:** BUILT 2026-10-04 (option B/C). Opened 2026-10-04 at Carter's request and approved the same day with
these decisions: (1) option B/C, the AI review and the audit run as separate scheduled Claude Code sessions, with no
API key and no Anthropic API calls in CI; (2) accuracy threshold 90%, and any missed planted fake source or
sensitivity error suspends auto-PASS; (3) planted-error test batches monthly; (4) the self-fix list in §1c stands as
written. Built: `tools/review-checks.js` and `.github/workflows/review.yml` (automatic checks and the `review-test/`
guard), `reviews/REVIEWER.md`, `reviews/AUDITOR.md`, `reviews/scorecard.md`, `reviews/status.json` (auto-PASS off
until the baseline test batch), `reviews/cleared.json` and `reviews/README.md`. The scheduled sessions themselves are
set up separately. Not yet built from §1a: the headless run of every game and 3D page, and the per-section page-weight
budget.

## The goal

Every batch Claude Code produces is checked before Carter sees it. The checker (the **reviewer**) is itself checked by
a second, independent checker (the **auditor**), so a "passed" can be trusted. Carter sees only what needs his
judgement.

A "batch" is any pull request (PR) or set of PRs from one task: a chapter batch, a fix batch, a site change or a game
change.

---

## 1. The reviewer

### 1a. Automatic checks (code, no AI, on every PR)

These are scripts. They give the same answer every time, so the reviewer's AI never has to judge them.

| Check | How | Exists today? |
|---|---|---|
| Build passes, and the output matches what is committed | run the build steps in CLAUDE.md order, then `git diff --exit-code` | the steps exist; the check is new |
| Game facts match chapter text | `tools/verify-*.js` | yes (`verify.yml`) |
| Broken links (internal) | crawl `docs/` and resolve every `href`/`src` | new script, reusing `tools/check-links.js` |
| Broken links (external) | `tools/check-links.js` on the pages the PR changed | yes (weekly); runs per PR once GitHub's default branch is `main` |
| Wikipedia share per chapter, flag over 20% | count unique URLs in each changed `sources/*.md` | new, small (the 2026-10-04 audit already measured it) |
| Garbled source links (the 2026-09-29 "finding B") | fail on `href="<` or an anchor nested in an anchor | new, one line |
| Page speed | `tools/lighthouse-pages.js`, more than a 5-point drop fails | yes (`lighthouse.yml`) |
| File size limits | fail on any deployed file over a set limit (say 2 MB), and on a page-weight budget per section | new |
| Sitemap coverage | every indexable page is in `sitemap.xml`; nothing noindex is in it | new |
| Pending-review status | every new or changed chapter, Vault entry or Pantheon figure carries `pending: true` and the visible banner, unless Carter has cleared it | new |
| Games and 3D actually run | `game-runtime.yml` plays the fighter to a knockout; extend it to open every game and the museum (or a Pilgrimage site) headless and fail on any script error or a black canvas | partly (fighter only) |

### 1b. AI review (judgement, against CLAUDE.md)

The reviewer reads the PR's diff and the changed chapters with their source logs. It answers a fixed checklist,
each item as **pass / fixable / needs Carter**, with a one-line reason and the place in the text:

1. **Accuracy against the cited sources.**
   - Pick the specific claims in the changed text: dates, numbers, names, "first", "oldest".
   - Fetch the cited source for each one and check that it says so.
   - Flag a claim with no source, or a source that doesn't support it.
   - This is the expensive part, so it samples: all contested claims, plus up to 10 others per chapter.
2. **Believer's and skeptical lens balance.** Both sections are present, of comparable weight, and neither straw-mans the other.
3. **Evidence-honesty tiers.** "Well supported / not supported / genuinely open" are kept apart, and no "proof" language is used for anything disputed.
4. **Contested claims are flagged, not resolved.**
5. **Tone.** Descriptive, not sensational. Satanism, witchcraft and NRMs get the same register as everything else.
6. **Religious-sensitivity rules.**
   - No images of the Báb.
   - Secret-sacred objects (the tjurunga) are not shown.
   - Restricted sites stay exterior-only.
   - The Kaaba courtyard is shown without figures.
   - Any new item of this kind is **always routed to Carter**, never auto-passed.
7. **Games and 3D.** Look at the screenshots the automatic step took. Does it render, and is anything obviously broken?

### 1c. What the reviewer may fix by itself

Only small, mechanical things, each one logged:

- a broken link to a page that moved;
- a missing pending tag;
- a typo;
- a formatting slip;
- a garbled source line;
- a source log out of step with the chapter.

**It never changes a claim's meaning, a lens, or anything sensitive.** Those go to Carter.

### 1d. The triage report

One file per batch: `reviews/YYYY-MM-DD-<batch>.md`. A short line also goes on the PR.

```
Batch: Wikipedia replacement, ch66–ch74 (PRs #16–#24)
Summary: 31 passed, 4 fixed, 2 need you.

PASSED   (31)  list, one line each
FIXED    (4)   what was wrong, what changed, commit
NEEDS CARTER (2)
  - ch70: a stronger source dates the Hejaz inscription 50 years later than the text says (contested claim)
  - ch73: new image of a Hasidic court; check sensitivity
```

**Always NEEDS CARTER, whatever the reviewer thinks:**
- anything religiously sensitive;
- contested claims where a source disagrees;
- every merge to `main`;
- anything involving money or accounts;
- clearing a pending tag.

---

## 2. The auditor (checks the reviewer)

### 2a. Independent re-review

For each batch, the auditor picks about **10% of PASSED and FIXED items at random** (at least one per batch) and
reviews them from scratch.

- It does not see the reviewer's verdict or notes until after it has given its own.
- **Any disagreement goes to NEEDS CARTER**, with both verdicts side by side.

**Independence means:**
- a separate run, with its own fresh context;
- its own prompt and checklist, written separately;
- never the same session grading itself.

Where cost allows, it also uses a different model from the reviewer (see the options in §3), so the two don't share
the same blind spots.

### 2b. Planted mistakes

Every so often (proposed: once every 4 batches, or monthly), the auditor builds a **test batch**: copies of real
chapters with known errors planted in them.

- **Types of planted error:**
  - a fake source (a plausible but non-existent book or URL);
  - a wrong date;
  - a number off by a factor;
  - a lens made one-sided;
  - a contested claim stated as settled;
  - a removed pending tag;
  - a "proof" word;
  - a sensitive image reference.
- **How they are kept safe:**
  - Test batches live only on branches named `review-test/*`.
  - They are never opened as PRs against `main`.
  - A CI rule fails any PR to `main` that contains a planted-error marker or comes from a `review-test/` branch.
  - The planted list is kept where the reviewer can't read it (the auditor's own run).
- The reviewer reviews the test batch like any other. The auditor records which errors it caught.

### 2c. The scorecard

`reviews/scorecard.md`, updated after each audit:

| Date | Items re-reviewed | Agreed | Planted errors | Caught | Accuracy |
|---|---|---|---|---|---|

- **Accuracy** = (agreements plus planted errors caught) ÷ (items checked plus errors planted), shown per error type too.
- **Proposed threshold:** if accuracy drops below **90%** over the last 3 audits, or the reviewer misses **any**
  planted fake source or sensitivity error, **auto-PASS is suspended**. Everything is routed to Carter until a fix
  (a better prompt, a stronger model, a new automatic check) brings it back above the threshold on a fresh test batch.

---

## 3. How to run them, and what it costs

Prices are Anthropic's current API rates per million tokens: Claude Opus 5.5 $4 in / $20 out; Claude Sonnet 5.5
$2 / $10; Claude Haiku 4.5 $1 / $5. The Batch API halves them for work that can wait. Cached repeated input (CLAUDE.md,
the checklist) costs about a twentieth.

**Rough size of one chapter review:**
- the chapter and its source log: about 25 thousand tokens;
- CLAUDE.md and the checklist: 10 thousand, mostly cached;
- fetched source pages for spot-checks: 50 to 150 thousand;
- the written review: about 8 thousand.

**Call it 150 thousand tokens in and 8 thousand out.**

### Option A: GitHub Actions with an Anthropic API key

- **How:**
  - A workflow runs on every PR: the automatic checks first, then the reviewer as a Claude Code GitHub Action
    (or a small script that calls the API).
  - It writes the report and comments on the PR.
  - The auditor is a **separate workflow** on a schedule, with its own prompt. Its only input from the reviewer is
    the list of item ids. It writes the scorecard.
- **Cost (Opus 5.5 for the reviewer):** about **$0.75 per chapter**, so about **$7 for a 9-chapter batch**.
  - The auditor's 10% re-review, on Sonnet 5.5 (different model, so more independent): under $0.50 per batch.
  - A monthly planted-error test batch: about $5.
  - **At today's pace (3–5 batches a month): roughly $25–45 a month.** The automatic checks are free (GitHub's free
    minutes cover them).
- **Pros:**
  - Fully automatic.
  - Runs on every PR without anyone starting it.
  - Independence is enforced by separate workflows and separate keys.
  - Easy to set a hard monthly spending cap on the API key.
- **Cons:**
  - Needs Carter to create an Anthropic API account, add billing, and paste the key as a GitHub secret. **That
    involves money and accounts, so it is Carter's decision.**

### Option B: separate Claude Code sessions (the subscription Carter already has)

- **How:**
  - The automatic checks run in GitHub Actions as in A (free).
  - The AI review runs as a **scheduled Claude Code routine**: a cloud session that starts by itself after a batch
    is pushed, or nightly. It reviews and writes the report.
  - The auditor is a **different routine**, a fresh session with its own instructions, run on a different day.
- **Cost:** no per-token bill; it uses Carter's plan allowance. A heavy batch week could hit usage limits and delay a
  review.
- **Pros:**
  - No new account and no new bill.
  - Can start today.
- **Cons:**
  - Less strictly automatic (routines run on a schedule, not on each PR).
  - Shares the allowance with the building work.
  - Independence rests on separate sessions and separate instructions. Both use the same model family unless the
    routine is set to another model.

### Option C: hybrid (recommended to start)

- Start with **B**: the automatic checks in Actions now, and the reviewer and auditor as two separate scheduled
  routines.
- Measure for a month: the scorecard, how often reviews were delayed, and how many items reached Carter.
- Move the reviewer to **A** if the volume grows or delays matter. The auditor can stay a routine, which also keeps
  it on a different system from the reviewer.

---

## 4. Build order (after approval)

1. **Automatic checks** (pre-approved CI work): one `review.yml` workflow, plus `tools/review-checks.js` for the new
   checks (Wikipedia share, garbled links, file sizes, sitemap coverage, pending status, headless run of every game
   and 3D page). It fails the PR or writes a short table.
2. **Reviewer:**
   - The checklist prompt, in `reviews/REVIEWER.md`.
   - The report template.
   - The routine, or the Action under option A.
   - First real run on the Wikipedia-replacement batch (step 4 of the 2026-10-04 decisions).
3. **Auditor:**
   - Its own prompt, in `reviews/AUDITOR.md`.
   - The 10% sampler.
   - The planted-error generator, and the CI rule that keeps `review-test/*` away from `main`.
   - The scorecard.
4. A first planted-error test batch, to set the baseline score before anyone relies on auto-PASS.

## Needs Carter's decision

1. **Option B/C (no new account), or A (API key and a monthly bill of roughly $25–45)?** If A, a monthly spending cap.
2. **The accuracy threshold:** 90%, with any missed fake source or sensitivity error suspending auto-PASS. Keep it or change it.
3. **Planted-error tests:** once a month, or every 4 batches.
4. **What the reviewer may fix by itself:** the list in §1c. Anything to add or remove?
