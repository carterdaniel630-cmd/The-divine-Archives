# Stage 05 — Merch: Printify Draft-Product Agent — CONTEXT

**STATUS: 🟡 PIPELINE BUILT — dry-run validated on one symbol (Tree of Life). Blocked
from live runs by three missing inputs (see `BLOCKERS.md`).**

Scoped **only** to **Divine Archives** merch. Nothing here references or builds for
Pip's Orchard — that is a separate track and is explicitly out of scope for this stage.

## What this is
An agent that automates the **mechanical** steps of turning one approved symbol design
into **draft** Printify product listings. It has **no authority to publish or activate**
anything — every path stops at DRAFT/unpublished. It is a pipeline, not a launch.

## Standing guardrails (non-negotiable)
- **Draft only.** The agent never calls Printify's publish endpoint and never activates a
  Shopify listing or checkout. Products are created `visible: false`. There is no code path
  to go live; live mode still only creates drafts.
- **No credentials in the repo.** The Printify token and shop ID are read from environment
  variables at run time (`PRINTIFY_API_TOKEN`, `PRINTIFY_SHOP_ID`). None are stored here.
- **Description is human-gated.** Because misattribution on religious content is a real
  risk, the attributed educational description is emitted **READY FOR REVIEW** and is
  **not** written onto the product automatically — a human approves and pastes it.
- **Placeholder pricing is flagged, never guessed.** Margin comes from
  `config/pricing.config.json`, explicitly marked PLACEHOLDER. The agent does not invent a
  real margin.
- **One symbol at a time.** The first run is validation of the pipeline. The agent processes
  a single symbol, prints a review summary, and stops. It does not batch the queue.

## Inputs (per symbol)
1. **Symbol name** — e.g. `"Tree of Life"`.
2. **Art files** — a transparent-background version and a parchment-background version
   (PNG). *(Currently absent — dry run uses placeholder paths; see BLOCKERS.)*
3. **Description source** — the symbol's entry in `drafts/symbols/<slug>.md` (the same
   cross-tradition, no-single-religion-claim framing validated on Tree of Life).
4. **Product list** — the locked 10 blank types, in `config/products.config.json`.
   *(Currently MISSING — see BLOCKERS; step 3 is gated on this.)*
5. **Pricing model** — `config/pricing.config.json` (placeholder margin).

## Process
1. Resolve inputs; load `products.config.json` and `pricing.config.json`.
2. **Guard:** if the product list is missing/placeholder, or (in live mode) credentials/art
   are absent, the agent refuses to proceed to product creation and reports the blocker.
3. **Upload art** to Printify (`/v1/uploads/images.json`) — dry run builds and prints the
   payload without sending.
4. For each of the 10 blanks, **build a draft product** (`/v1/shops/{shop}/products.json`):
   - Title = `"[Symbol Name] — Divine Archives"`.
   - `blueprint_id` + `print_provider_id` + `variants` from the product list.
   - Retail price = Printify blank cost × placeholder margin (flagged).
   - `print_areas` reference the uploaded image id (transparent for dark blanks, parchment
     for light — mapping declared per product in the config).
   - `tags` include `"Divine Archives"` (Printify tags sync to the Shopify product).
   - `visible: false` — draft/unpublished.
5. **Attributed description** built from the symbol draft, output as READY FOR REVIEW —
   not applied to the product automatically.
6. **Collection tag:** the `"Divine Archives"` tag is set on the product; the actual Shopify
   *collection* assignment happens on the Shopify side once the sales channel is connected
   (flagged dependency).
7. **Review gate:** write a per-symbol summary (symbol, products created, description draft,
   pricing draft, blockers) to `runs/<slug>/` and **stop**. Wait for explicit approval
   before the next symbol.

## Outputs
- `runs/<slug>/summary.md` — the human review summary (the review-gate artifact).
- `runs/<slug>/payloads.json` — the exact Printify API payloads that would be sent (draft
  create + image upload), for inspection.
- `runs/<slug>/description.review.md` — the attributed description, READY FOR REVIEW.

## Dry-run result (Tree of Life)
The pipeline ran end-to-end in dry-run mode on **Tree of Life**. It correctly:
- built the title `"Tree of Life — Divine Archives"`;
- built the attributed description from `drafts/symbols/tree-of-life.md` and flagged it
  READY FOR REVIEW (not auto-applied);
- **halted at product creation** because the locked 10-product list is not present —
  surfacing the blocker instead of guessing blanks or IDs;
- emitted the review summary and stopped (no batch).
This validates the transform/guard logic. Live runs need the three blockers cleared.

## Review batch
This stage stands alone (Track: Divine Archives merch). It is `PIPELINE BUILT / DRY-RUN
VALIDATED`, not `READY FOR LIVE` — that flips only when `BLOCKERS.md` is cleared and Carter
approves a live draft-creation run.
