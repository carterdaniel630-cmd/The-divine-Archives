"use strict";
/* ==========================================================================
   THE DIVINE ARCHIVES — Printify product draft builder + validator
   Assembles the product-creation payload that WOULD be POSTed to Printify,
   validates it, and collects every blocker that stands between the draft and
   a real (still-unpublished) Printify product. Never sends anything.
   ========================================================================== */

const fs = require("fs");
const path = require("path");

const ARTWORK_DIR = path.join(__dirname, "..", "artwork");
const ARTWORK_EXTS = [".png", ".svg", ".jpg", ".jpeg", ".webp"];

function findArtwork(symbolSlug) {
  for (const ext of ARTWORK_EXTS) {
    const p = path.join(ARTWORK_DIR, symbolSlug + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Assemble the draft + collect blockers for one product/symbol pair.
 * @returns {{ draft: object, blockers: string[], warnings: string[], status: "PASS"|"FAIL" }}
 */
function buildProductDraft({ symbol, product, listing, uploadedImageId = null }) {
  const blockers = [];
  const warnings = [];

  // 1. Listing content (from the offline generator) ------------------------
  if (!listing || !listing.title || !listing.description || !listing.tags || !listing.tags.length) {
    blockers.push("listing content incomplete (title/description/tags missing)");
  }
  if (listing && listing.price_is_placeholder) {
    warnings.push("base price is a placeholder — confirm final retail price before creation");
  }

  // 2. Catalog identity (blueprint / provider / variants) ------------------
  if (product.printify_blueprint_id == null) {
    blockers.push(
      "printify_blueprint_id is null — resolve against live catalog (needs PRINTIFY_API_TOKEN)"
    );
  }
  if (product.print_provider_id == null) {
    blockers.push(
      "print_provider_id is null — resolve against live catalog (needs PRINTIFY_API_TOKEN)"
    );
  }
  if (!Array.isArray(product.variant_ids) || product.variant_ids.length === 0) {
    blockers.push("variant_ids empty — select variants from the live catalog");
  }
  if (product.verified_against_catalog !== true) {
    warnings.push("catalog IDs not yet verified_against_catalog");
  }

  // 3. Artwork asset + upload ----------------------------------------------
  const artworkPath = findArtwork(symbol.slug);
  if (!artworkPath) {
    blockers.push(
      `artwork asset not found — expected merch/artwork/${symbol.slug}.{png|svg|jpg} (drop finished art here)`
    );
  }
  if (!uploadedImageId) {
    blockers.push(
      "no uploaded Printify image id — art must be POSTed to /v1/uploads/images.json first (blocked in dry-run; needs PRINTIFY_API_TOKEN)"
    );
  }

  // Assemble the payload skeleton that a live run WOULD send ----------------
  const printAreas = (product.print_areas || ["front"]).map((placeholder) => ({
    variant_ids: product.variant_ids || [],
    placeholders: [
      {
        position: placeholder,
        images: uploadedImageId
          ? [{ id: uploadedImageId, x: 0.5, y: 0.5, scale: 1, angle: 0 }]
          : []
      }
    ]
  }));

  const draft = {
    _draft: true,
    _would_POST_to: "/v1/shops/{shop_id}/products.json",
    sku: product.sku,
    symbol: symbol.name,
    title: listing ? listing.title : null,
    description: listing ? listing.description : null,
    tags: listing ? listing.tags : [],
    blueprint_id: product.printify_blueprint_id,
    print_provider_id: product.print_provider_id,
    variants: (product.variant_ids || []).map((id) => ({
      id,
      price: listing ? listing.price_cents : null,
      is_enabled: true
    })),
    print_areas: printAreas,
    artwork_source: artworkPath ? path.relative(path.join(__dirname, "..", ".."), artworkPath) : null
  };

  return {
    draft,
    blockers,
    warnings,
    status: blockers.length === 0 ? "PASS" : "FAIL"
  };
}

module.exports = { buildProductDraft, findArtwork };
