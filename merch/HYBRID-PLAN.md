# Divine Archives Merch — Hybrid Aesthetic Plan

**Status:** Style approved (Carter, 2026-08) — **hybrid / dual-track**. Tree of
Life pipeline proof complete. Everything below the Tree of Life is held pending
sign-off. Draft / dry-run only; nothing is live, and getconexto.com is untouched.

---

## 1. The decision

The style test compared two Tree of Life renders:

- **Gold linework** — `currentColor` gold on a dark ground, 120×120 era-emblem
  convention. Matches the website's nine era emblems. Tiny scalable SVG.
- **Parchment / "Gilded Vellum"** — bronze/copper on aged vellum,
  illuminated-manuscript style. A premium standalone object. 2400² raster.

**Approved outcome: keep both, on separate tracks.**

| Track | Render | Where it lives / ships | Why |
|---|---|---|---|
| **A — On-site** | Gold SVG (`<slug>.svg`) | The website symbol usage; kin to the era emblems | Visual consistency with the live site; scales to any size |
| **B — Physical merch** | Parchment PNG (`<slug>.png`) | Printify products (print, tote, tee, journal, button) | Reads as a crafted object on physical goods; matches the merch brief |

## 2. Architecture — how the two tracks stay coherent

**One slug, two files, deterministic split.** For every symbol:

```
merch/artwork/<slug>.svg   → gold, on-site (Track A)
merch/artwork/<slug>.png   → parchment, merch (Track B)
```

The merch agent's `findArtwork()` resolves extensions `.png → .svg → .jpg → …`,
so when both exist it **always** picks the `.png` (parchment) for products, and
never sends the gold `.svg` to Printify. No flag, no branch — the convention
enforces the split by construction. Documented in `merch/artwork/README.md`.

**Listing copy already matches Track B.** The generator's aesthetic string is
`"bronze-and-copper linework on aged parchment, illuminated-manuscript style"`,
which is correct for the parchment render feeding merch. **No copy rewrite is
needed** — the hybrid is the lowest-friction outcome for the agent.

## 3. What this increment did (Tree of Life proof)

Done on branch `claude/current-update-annu7g`, other 13 symbols untouched:

1. Consolidated the merch agent (`merch/agent`, `config`, `out`, README) from the
   `printify-merch-status` branch onto the working branch.
2. Placed both Tree of Life renders in `merch/artwork/`:
   - `tree-of-life.svg` (gold, from the `parallel-build-workstreams-yq09vz` test)
   - `tree-of-life.png` (parchment 2400², from `parallel-build-workstreams-te4g1k`)
   - plus `AESTHETIC.md` and `_generate-tree-of-life.py` for provenance.
3. Documented the dual-track naming convention in `merch/artwork/README.md`.
4. Ran `node merch/agent/dry-run.js "Tree of Life"`.

**Verified result:** the **artwork blocker cleared on all 5 products** — the draft
now records `"artwork_source": "merch/artwork/tree-of-life.png"`. The pipeline
resolves art → payload end-to-end for one symbol.

## 4. What is still blocked (unchanged by style approval)

Dry-run remains **0/5 pass** because the following are, by design, not in the repo.
These are the *only* things between the draft and a real (still-unpublished) listing:

1. **`PRINTIFY_API_TOKEN`** — not set. Gates catalog resolution and image upload.
   **Only Carter can supply it.**
2. **Catalog IDs** — `blueprint_id`, `print_provider_id`, `variant_ids` are `null`
   placeholders for all 5 products; resolvable only with the token, against the
   live Printify catalog. None are faked.
3. **Uploaded image id** — each art file must be POSTed to Printify to get an id;
   blocked in dry-run.
4. **Pricing** — all prices flagged as placeholders; confirm retail before creation.

The agent has no publish path and `uploadImage()`/`createProduct()` throw while
dry-run is on. Going live is a deliberate, manual, human-gated step.

## 5. The remaining 13 symbols (held — do not start without sign-off)

Locked order (from `symbols.json` / `AESTHETIC.md`): Dharmachakra, Ouroboros,
Yin Yang, Triquetra, Ankh, Hamsa, Eye of Providence, Lotus, Om, Star of David,
Valknut, Sankofa, Bagua.

Under the hybrid, **each needs both renders**: a gold SVG (Track A) and a
parchment PNG (Track B), following the same slug convention. That is 26 files for
13 symbols — the bulk of the remaining art work.

## 6. Open items / branch hygiene

- The gold and parchment Tree of Life art originated on two separate
  `parallel-build-workstreams` branches, and the agent on a third. This increment
  consolidates them for Tree of Life; the other symbols' future art should land
  directly here to avoid re-fragmenting.
- **On-site symbol library does not exist yet.** The site currently has 9 *era*
  emblems, not a 14-*symbol* library. Track A only becomes visible once we decide
  whether/where a symbol library appears on getconexto.com — a separate scope to
  confirm before building.

## 7. Recommended sequence from here (each gated)

1. **[done]** Tree of Life pipeline proof — artwork stage green.
2. Carter provides `PRINTIFY_API_TOKEN` (read-only is enough to resolve catalog
   IDs) → resolve + fill real blueprint/provider/variant IDs for DA-01..05 →
   re-run dry-run to clear the catalog blockers for Tree of Life.
3. Confirm final retail prices.
4. On approval to scale: produce both renders for the remaining 13 symbols.
5. Decide the on-site symbol-library scope (Track A surfacing) separately.
6. Live creation stays a distinct, explicit, human-flipped step — not automated.
