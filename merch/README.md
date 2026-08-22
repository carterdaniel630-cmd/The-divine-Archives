# Divine Archives — Printify Merch Agent

Drafts Printify product listings for the Divine Archives symbol collection.
**Draft / dry-run only.** This agent never creates a live Printify listing and
never publishes. It does not touch getconexto.com or the site — it only assembles
and validates the product payloads that a future, human-approved live run would send.

> The commerce/dropshipping use of getconexto.com is on hold (see `CLAUDE.md`).
> This agent is unrelated to the live site — it talks to the Printify API only.

## Layout
```
merch/
  config/
    products.json     # DA-01..DA-05 product config (blueprint/variant/pricing)
    symbols.json      # locked 14-symbol library + aesthetic
  agent/
    listing-generator.js  # offline: title / description / tags / price
    printify-client.js    # API wrapper; mutating calls BLOCKED in dry-run
    build-product.js      # assembles the product payload + collects blockers
    dry-run.js            # CLI entry point
  artwork/            # drop finished symbol art here as <slug>.png|svg|jpg
  out/                # dry-run reports (JSON) land here
```

## Run a dry run
```
node merch/agent/dry-run.js "Tree of Life"     # by name
node merch/agent/dry-run.js dharmachakra        # by slug
node merch/agent/dry-run.js "Om" --json         # machine-readable
```
Exit code is 0 whether or not products pass — a dry run *completes* regardless;
blockers are reported, never thrown. A full JSON draft is written to
`merch/out/dry-run-<slug>.json`.

## The 5 products (DA config)
| SKU | Product |
|-----|---------|
| DA-01 | Art print |
| DA-02 | Tote bag |
| DA-03 | T-shirt |
| DA-04 | Journal |
| DA-05 | Pin-back button |

## What passes today, and what's blocked
The **listing-content** stage (title, description, tags, price) is fully offline
and works now. A product only reaches **creation-ready** when three things exist,
none of which are in the repo yet:

1. **Catalog identity** — real `blueprint_id`, `print_provider_id`, and
   `variant_ids` resolved from the live Printify catalog. Requires
   `PRINTIFY_API_TOKEN`. The config ships these as `null` placeholders on purpose.
2. **Artwork** — a finished art file at `merch/artwork/<slug>.png` (or `.svg`/`.jpg`).
3. **Uploaded image id** — the art POSTed to `/v1/uploads/images.json` to get an
   image id for the print areas. Blocked in dry-run mode by design.

Until those exist, every product reports `FAIL` with the exact blocker. That is
the honest state — no placeholder catalog IDs are faked as "verified."

## Safety rails
- `dryRun` defaults to `true`; `uploadImage()` and `createProduct()` throw
  `DRYRUN_BLOCKED` while it's on.
- `publishProduct()` is disabled unconditionally — there is no publish path.
- Going live requires a human to: set `PRINTIFY_API_TOKEN`, fill verified catalog
  IDs, add artwork, and explicitly flip the agent out of dry-run. That gate is
  intentional and not automated.
