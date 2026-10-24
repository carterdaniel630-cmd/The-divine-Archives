# Site speed fix A built — PR #76 (2026-10-24, build loop)

**Carter's yes:** `handoff/decisions-2026-10-24-batch-six.md` item 2 ("Yes, build A"; going live after review and checks is covered).
**Diagnosis it fixes:** `handoff/research/site-speed-diagnosis-2026-10-24.md`, cause 1 (the slowest page waited on another library's server as it opened).

## What changed
- Branch `loop/speed-fix-a` @ `10b075c`, PR #76, based on `main` `6c81a84`.
- `docs/assets/vault/study.js`: for the three Vault items whose scans live on an outside server (Codex Mendoza: Bodleian;
  Codex Borgia: Vatican Library; Voynich Manuscript: Yale), the image list is now requested only when:
  - the viewer comes within 600 px of the screen (it sits about 2–2.6 phone screens down the page), or
  - the reader taps the new **Open the manuscript** button, or
  - the link goes straight to a page (`#folio=…`) or the viewer (`#study`): opens at once.
  Old browsers without the needed feature open at once, as before.
- `tools/build-vault.js`: `study.js?v=3` → `v=4` so phones holding the old copy refresh; the 88 Vault pages rebuilt (that one line each).
- Fixes B–E are not in this PR.

## How it was checked (headless, phone 390×844, outside hosts blocked and counted)
| Page | Outside requests as page opens (before → after) | Scroll to viewer | Button | `#folio=5` | `#study`, reduced motion |
|---|---|---|---|---|---|
| Codex Mendoza | 1 → 0 | 1 | 1 | 1 | 1 |
| Codex Borgia | 1 → 0 | 1 | 1 | 1 | 1 |
| Voynich Manuscript | 1 → 0 | 1 | 1 | 1 | 1 |
- Rosetta Stone, Holy Lance, Shroud of Turin (no outside scans): unchanged, no button, 0 requests.
- 0 script errors; page width 390 px (not wider than the phone). Screenshot of the button taken and looked at: it sits
  above the viewer controls in the existing button style.
- Full build order: output matches committed. `review-checks.js --base origin/main --build`: 9/9, 0 warnings.
  17/17 `tools/verify-*.js`; 42/42 framework tests.
- Not measured here: real load-time gain on the live site (the live site and the libraries' servers can't be reached
  from this sandbox). The gain is inferred from removing the outside wait on page open.

## Next
Independent review by a run that wrote none of this, every GitHub check green (Lighthouse included), then fast-forward.
