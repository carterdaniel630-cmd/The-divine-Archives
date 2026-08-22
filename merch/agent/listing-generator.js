"use strict";
/* ==========================================================================
   THE DIVINE ARCHIVES — merch listing generator
   Pure / offline. Given one symbol + one product config, produce the
   human-facing listing content: title, description, tags, price.
   No network, no side effects — this part is fully testable without a
   Printify token and is what the dry run reports as "content: PASS".
   ========================================================================== */

const AESTHETIC = "bronze-and-copper linework on aged parchment, illuminated-manuscript style";

// House copy per product type. Keeps voice consistent with the reference work
// without over-claiming anything about the symbol's meaning.
const PRODUCT_COPY = {
  "DA-01": { noun: "art print", blurb: "A museum-weight giclee print" },
  "DA-02": { noun: "tote bag", blurb: "A sturdy everyday tote" },
  "DA-03": { noun: "t-shirt", blurb: "A soft unisex tee" },
  "DA-04": { noun: "journal", blurb: "A hardcover journal for notes, study, or ritual record" },
  "DA-05": { noun: "pin-back button", blurb: "A small enamel-look pin-back button" }
};

function titleFor(symbol, product) {
  const copy = PRODUCT_COPY[product.sku];
  return `${symbol.name} — Divine Archives ${copy.noun[0].toUpperCase()}${copy.noun.slice(1)}`;
}

function descriptionFor(symbol, product) {
  const copy = PRODUCT_COPY[product.sku];
  const tradition = symbol.tradition ? ` Rooted in the ${symbol.tradition} tradition.` : "";
  const ref = symbol.chapter_ref
    ? ` The symbol is covered in depth in The Divine Archives (${symbol.chapter_ref}).`
    : "";
  return [
    `${copy.blurb} featuring the ${symbol.name}, rendered in ${AESTHETIC}.`,
    `${tradition}${ref}`.trim(),
    `Part of the Divine Archives symbol collection — a comparative reference work on the world's spiritual traditions.`,
    `This is a draft listing pending human review; artwork, sizing, and pricing are not final.`
  ].filter(Boolean).join(" ");
}

function tagsFor(symbol, product) {
  const base = ["divine archives", "symbolism", "sacred symbol", AESTHETIC.split(",")[0]];
  const kw = Array.isArray(symbol.keywords) ? symbol.keywords : [];
  const prod = [PRODUCT_COPY[product.sku].noun];
  // De-dupe, lowercase, cap at Printify's practical tag ceiling.
  const all = [...base, symbol.name.toLowerCase(), ...kw, ...prod]
    .map((t) => String(t).toLowerCase().trim())
    .filter(Boolean);
  return [...new Set(all)].slice(0, 13);
}

function generateListing(symbol, product) {
  return {
    sku: product.sku,
    product: product.name,
    title: titleFor(symbol, product),
    description: descriptionFor(symbol, product),
    tags: tagsFor(symbol, product),
    price_cents: product.base_price_cents,
    price_is_placeholder: product.base_price_placeholder === true
  };
}

module.exports = { generateListing };
