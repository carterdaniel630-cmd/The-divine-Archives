# PR #106 delta review — `3fa0c96..412684a` (Rotunda link-row label)

**Verdict: PASS — 0 findings.**
id `site:pr106`, `loop/museum-guide-binding` reviewed at `412684a` (parent `main` `6ee2150`, fast-forwardable).
Reviewer: build loop run 2026-11-01 ~21:01–21:15 UTC (session ..WzTnB6YyEHsULDVR1drg). This run wrote neither
`3fa0c96` (session ..WzTm32bq25X2BmA9mPJZ) nor `412684a` (the 20:42–21:30 reviewing run, ..WzTnadQh7b1otSXtas67).
Carter's per-item go: `order-2026-11-01-106-review-walk-merge.md`.

## The delta (2 files, 2 lines)
- `docs/museum/app.js` `renderGuide()`: for a Directory item with no exhibit standing, `<small>` type label moved
  from after `</a>` to inside the `<a>`. Matches the button rows (`<button>name<small>label</small></button>`).
  `museum.css` 73/76 style `.mu-guide li a` exactly as `li button` (block, full width, bottom divider) and
  `li small` as a block label, so the divider now sits under the label. Both values still go through `esc()`;
  `href` still from the manifest names table. No behaviour change: links still navigate (the guide's click handler
  acts only on `button`s).
- `docs/museum.html`: `app.js?v=42` → `?v=43` cache-bust (the only importer of `app.js`).

## Hands-on check (this run)
Real Chromium (SwiftShader WebGL), 390×700, `node tools/serve.js`, `412684a`: Enter the museum → teleport → Room guide.
- **Sacred Kingship (ch49):** Holy Grail row = link with "Vault object" inside; divider under the label, same as
  the rows above (screenshot in the run).
- Proof points re-confirmed: **Mesopotamia** = Ishtar Gate, Cyrus Cylinder + Inanna, Enki, Marduk, Tiamat, Gilgamesh,
  Shamash, Ereshkigal, Pazuzu (no Agni/Saraswati); **Tantra** = Shiva, Durga, Kali (no Padmasambhava);
  **Mahayana** = Avalokiteśvara, Amitābha, Mañjuśrī. All equal the manifest's `homeVault`/`homeFigs`.
- Page errors: 0.

## Local checks on `412684a`
- `node tools/review-checks.js --base origin/main --build`: 9/9 PASS (build output matches the tree).
- every `tools/verify-*.js`: 18/18; `node --test framework/test/*.test.js`: 42/42.

## GitHub on `412684a` at 21:15 UTC
guard, test, checks, runtime ×2, links: green. **Lighthouse: queued (run 41349653437), not complete.** Merge waits on it.

## Merge class
Per item (Carter's go on file); also fits class (b). No new content, nothing sensitive, no pending tag.
