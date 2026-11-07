# PR #118 (README counts) and agent-systems config — independent reviews

**Reviewer:** a fresh review pass inside session ..01HFWzTnvXVBLaXaK97CDDKy that wrote neither change (read-only), 2026-11-07 ~21:45 UTC.

## PR #118 `loop/readme-counts-2026-11-07` @ `0acdc4f3` — PASS, 0 findings
Every changed number checked against the branch's own data (data.js, vault-data.js, pilgrimage-data.js,
museum/manifest.json, pilgrimage.html, vault/, functions/api): 84 chapters (77 + 7 themes; Early Modern 8), 20 pending
listed exactly, 89 Vault shown of 90 (V68 withdrawn), V88–V90 pending, 11 open sites (62 in preparation = 3 preview + 59
queued), 84 rooms in 10 wings, visits.js = footer counter. No other README count is false. GitHub 4/4 green.

## agent-systems-config.md (staging) — first pass 4 findings, delta PASS 0 findings
First pass on `e0856032`: (1) BUILD_COMMAND overstated what review-checks --build runs; (2) TEST_COMMAND loop hid earlier
verifier failures; (3) docs/assets/data.js wrongly listed as generated; (4) LOOP.md wrongly cited for the loop/ prefix.
All fixed in `013886e8`; delta review: PASS, 0 open findings; every named command and path exists on main.
