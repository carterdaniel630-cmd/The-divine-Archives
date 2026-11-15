# Loop run 2026-11-15 ~03:45 UTC — Rök V36 back-link built

Session ..01HFWzTnDon8rNdU8ohn6CfH. Item: 0cq (4) **Rök V36 back-link** (`order-2026-11-11-rok-v36-backlink-cleared.md`;
Carter's clearance is the per-item yes). Items (1)–(3) of 0cq all wait only on a PR + Carter, so this was the
highest-value item a run can build.

## What was built
Branch **`loop/rok-v36-backlink` `7f61608e`** (two commits on `main` `f92ab8d7`; no PR opened — runs don't open PRs unasked).
- `vault/v36-rok-runestone.md`, Connections: one sentence added at the end —
  "The stone read face by face, with the standard translation in reading order and the ciphers worked step by
  step, is in [The Rök Stone, Decoded](../vault/rok-runestone-decoded.html)." The wording only names what the
  live page's own headings and description say it contains (sections 3 and 4). Nothing else in V36 changed; the
  Rök page is untouched (it already links back to V36 three times).
- Rebuilt output: `docs/vault/rok-runestone.html`, `content/dates.json` (v36 modified → 2026-11-15),
  `docs/sitemap.xml` (lastmod).
- `reviews/cleared.json`: one appended vault entry recording Carter's re-clear of V36 for this link-only change
  (same shape as the ch07/ch15 typo re-clears of 2026-11-01). Without it the pending-diff check fails, because
  V36 is a cleared entry. This records Carter's 2026-11-11 clearance; it clears nothing new. V36 has no pending tag
  before or after.

## Checks (on `7f61608e`)
- Full build order (stamp-dates, build-og, build-vault, build-chapters, build-pages, build-museum, build-sky,
  build-framework, build-entity-registry): second pass 0 drift.
- `tools/verify-*.js` 18/18; `node --test framework/test/*.test.js` 51/51.
- `review-checks.js --base origin/main --build`: 9/0/0 (pending-diff PASS with the re-clear entry).
- Headless 390 and 360: link present in Connections, tap lands on "The Rök Stone, Decoded", 0 script errors,
  no sideways scroll. Shots + probe in `handoff/previews/rok-v36-backlink/`.
- graphify CLI not installed this run (no `graphify-out/`); the change is content only, code read directly.

## Merge path
Per item, covered by Carter's 2026-11-11 clearance (it names this exact link). Still missing: an independent review
by a session other than ..01HFWzTnDon8rNdU8ohn6CfH (check the sentence against the Rök page, that nothing else in
V36 changed, and the cleared.json note), a PR so GitHub checks incl. Lighthouse run, all green.
