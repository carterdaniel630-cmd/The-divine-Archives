# shop-page-draft/

`shop.html` — the DRAFT `/shop` page for The Divine Archives static site.

- **Not deployed.** It lives here (not in `docs/`) on purpose, so the Cloudflare Pages
  build — which serves `docs/` — does **not** pick it up. This stage ends at human review.
- **Same deploy pattern as existing pages:** matches the `docs/*.html` structure (shared
  header/nav/footer, `assets/archive.css`, `assets/ambient.js`, the pending-review
  `notice` badge). On approval it becomes `docs/shop.html`; the relative asset paths inside
  already assume the `docs/` root, so it's drop-in.
- **Shopify Buy Button = TODO.** Each product card holds a `buy-button-placeholder`, not a
  live snippet. A real Buy Button needs a live Shopify product ID, which won't exist until
  products are created in Shopify post-review (see `../FLAGS.md`). Inline comments in
  `shop.html` mark exactly where the loader script and per-product target go.

## To promote after approval (checklist for later — do not do now)
1. Move `shop.html` → `docs/shop.html`.
2. Add a `Shop` link to the nav in the other `docs/*.html` pages.
3. Move the scoped `<style>` block into `assets/archive.css`.
4. Add mockup images to the `shop-thumb` slots (from `../mockups/`).
5. Replace each `buy-button-placeholder` with the Shopify Buy Button embed + live IDs.
6. Consider adding `shop.html` to `docs/sitemap.xml`.
