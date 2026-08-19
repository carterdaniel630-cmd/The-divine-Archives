# STUDIO ORCHARD — Content Engine (Instructions for Claude Code)

## What this is
Studio Orchard is both a **division under A.T.L.E.** and the **automated content engine** that
generates + (eventually) auto-uploads content for every line beneath it, and generates content for
The Divine Archives (which publishes to its own channels). One factory, many branded destinations.

- **Parent:** A.T.L.E. (A True Legacy Entertainment). See `../ATLE-DASHBOARD.md`.
- **Distributor:** **Metricool** (chosen 2026-08-19) — multi-brand scheduler + analytics; posts are
  uploaded/scheduled via Metricool (bulk CSV import now; API later).
- **Autonomy: LEVEL A (LOCKED).** The engine generates → items sit in a **review queue** → **Carter
  approves a batch** → only then are they scheduled/posted. **Nothing auto-posts.** Low-risk lines
  (ambient, maybe gaming) graduate to auto (B/C) only after several batches run clean and Carter says so.

## Content lines (under Studio Orchard)
| Line | Status | Autonomy | Notes |
|---|---|---|---|
| **Pip's Orchard** (character) | 🟢 lead — generating | **A** (permanent) | quote-cards from the bank; character-locked |
| Ambient (sleep / ocean) | 🔵 auto-parallel test | A → **C** candidate | low-risk; the graduation test case |
| Other characters | 🔵 planned | A | none defined yet |
| How-to / survivability | 🔵 planned | A | → Gumroad PDFs |
| Gaming clips | 🟡 some posted | A → B later | organize + caption existing clips |
| **The Divine Archives** (generated here, posts to its OWN channels) | 🔵 planned | **A** (permanent) | factual-grounding gate applies |

## Brand guardrails (hard-wired into generation — an item can't enter the queue without passing)
- **Pip's Orchard:** locked character (`../05-merch/pip-reference/`), quotes verbatim from
  `../05-merch/pip-reference/quote-bank.md`, the card format (accent keyword + ❤ sub-line), golden-hour scene.
- **The Divine Archives:** every claim traces to a published chapter; keep belief vs. evidence distinct;
  "The Divine Archives" title on branded pieces (the merch rule carries over).
- **Anything with a real person / sacred symbol:** stays autonomy A permanently.

## Pipeline (the queue workflow)
```
generate → pipeline/<line>/batch-NN.json      (status: queued_for_review)
        → batch-NN-review.md                   (human sheet: Carter approves/rejects per item)
        → tools/build-metricool-csv.js         (approved items → out/*.csv → import to Metricool)
        → Metricool schedules/posts            (autonomy A: only after approval)
```
Status per item: `queued_for_review → approved → scheduled → posted` (or `rejected`).

## Hard rules
- **Nothing auto-posts** (autonomy A). Generation ≠ publishing.
- **No live posting is wired yet** — needs the Metricool API key + account access (Track 2 / Carter).
  Until then the engine outputs **review sheets + Metricool-import CSVs**; Carter imports/approves.
- **Media assets:** Pip posts need the rendered card image, which needs the **real Pip raw art**
  (not yet committed). Text/caption/schedule are generated now; the image is flagged pending. See `BLOCKERS.md`.
- Build **to the seams**: money/account-dependent steps are stubbed so they plug in when Track 2 clears.
