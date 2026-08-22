# Stage 05 Merch — Blockers

Surfaced so the pipeline doesn't stall silently or guess. RAG-flagged. None of these are
built around; each is a real input the agent refuses to fabricate.

## 🟡 1. Printify catalog IDs — REQUIRED for real product creation
The **5 blank types** (DA-01..DA-05) are now populated in `config/products.config.json`
(reconciled from the earlier "10-product list" language — it is 5). **Still missing per
blank:** the Printify `blueprint_id`, `print_provider_id`, and `variant_ids` from the
Printify catalog. The agent builds draft payloads with these marked `<<from product list>>`
and will **refuse a live create** until they are real — it does not invent catalog IDs.
→ *Unblock:* provide the Printify blueprint/print-provider/variant IDs for each of the 5
blanks (I can look them up from the Printify catalog API once the token is set, or you can
paste them).

## 🔴 2. Printify API token + shop ID — REQUIRED for any live run
Read from env at run time (`PRINTIFY_API_TOKEN`, `PRINTIFY_SHOP_ID`); never stored in the
repo. Absent → the agent runs in **dry-run mode only** (builds and prints payloads, sends
nothing). Live draft-creation cannot run until these are provided in the environment.
→ *Unblock:* set the two env vars in the run environment (do not paste tokens into the repo
or chat).

## 🟡 3. Symbol art files (transparent + parchment) — REQUIRED input for upload
No art assets exist in the repo yet. The image-upload step has no real file to send; the dry
run uses placeholder paths and validates the payload shape. Real uploads need the two PNGs
per symbol.
→ *Unblock:* provide `Tree of Life` transparent + parchment PNGs (path or upload).

## 🟡 4. Shopify sales channel + "Divine Archives" collection — REQUIRED for the collection tag to land
The agent sets the `"Divine Archives"` **tag** on each draft product (Printify tags sync to
Shopify). The actual assignment to a Shopify **collection** happens on the Shopify side and
requires the Printify→Shopify sales channel to be connected and the collection to exist.
This is downstream of the agent and does not block draft creation, but the collection won't
populate until the channel is wired.
→ *Unblock:* confirm the Printify store is connected to the Shopify sales channel and the
"Divine Archives" collection exists (a Track-2/entity item).

---
**Standing:** even with all four cleared, the agent still only creates **drafts**. There is
no code path that publishes or activates a listing.
