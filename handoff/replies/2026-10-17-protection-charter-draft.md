# Reply 2026-10-17 (evening run) — Ready-line §1: Protection charter drafted

**Item:** STATUS → Next #1. **Result:** draft written, `handoff/protection-charter-DRAFT.md`. Not binding until Carter approves.

## What was done
- Checked the repo against the code-theft addendum, Naming & IP Policy and Content Truth Policy, then wrote one charter
  with ten rules (P1–P10), how each is enforced, and a six-PR build order.
- Findings from the check (all on `staging/ready-line`, 2026-10-17):
  - **The GitHub repository is public.** Readable source and history are open to anyone. This is the biggest protection
    gap and makes obfuscating the shipped site pointless until it changes (decision D1).
  - No source maps shipped; no secrets found in `docs/` or `functions/`; third-party licences ship with their files.
  - No `LICENSE`, no footer copyright line, no notices in our own JS; no asset ledger for 235 images; no
    Content-Security-Policy; no minify/fingerprint step; no automatic naming check.

## Verification
- Only `handoff/` files changed; no site file touched.
- `node --test framework/test/*.test.js`: 42 pass, 0 fail. All 17 `tools/verify-*.js`: pass.
- `node tools/review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- No headless check needed (nothing visual changed).

## Needs Carter
D1 repo private? · D2 copyright name · D3 copyright registration (lawyer) · D4 approve charter. Details in §5 of the draft.
