#!/usr/bin/env node
"use strict";
/* ==========================================================================
   THE DIVINE ARCHIVES — merch agent dry run
   Given ONE symbol, generate draft Printify listings for all 5 DA products
   and report pass/fail per product. DRAFT / DRY-RUN ONLY — never creates or
   publishes a live Printify listing.

       node merch/agent/dry-run.js "Tree of Life"
       node merch/agent/dry-run.js tree-of-life --json

   Exit code is 0 even when products fail: a dry run "completes" whether or
   not the products are creation-ready. Blockers are reported, not thrown.
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const { generateListing } = require("./listing-generator");
const { buildProductDraft } = require("./build-product");
const { PrintifyClient } = require("./printify-client");

const CONFIG_DIR = path.join(__dirname, "..", "config");
const OUT_DIR = path.join(__dirname, "..", "out");

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function resolveSymbol(symbols, query) {
  const q = String(query || "").toLowerCase().trim();
  return (
    symbols.find((s) => s.slug === q) ||
    symbols.find((s) => s.name.toLowerCase() === q) ||
    symbols.find((s) => s.slug === q.replace(/\s+/g, "-")) ||
    null
  );
}

async function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const query = args.filter((a) => !a.startsWith("--")).join(" ") || "Tree of Life";

  const products = loadJSON(path.join(CONFIG_DIR, "products.json")).products;
  const symbols = loadJSON(path.join(CONFIG_DIR, "symbols.json")).symbols;

  const symbol = resolveSymbol(symbols, query);
  if (!symbol) {
    console.error(`Unknown symbol: "${query}". Known slugs: ${symbols.map((s) => s.slug).join(", ")}`);
    process.exit(2);
  }

  const client = new PrintifyClient({ dryRun: true });

  // Optional read-only catalog verification (only if a token is present).
  let catalogNote;
  if (client.hasToken) {
    catalogNote = "PRINTIFY_API_TOKEN present — live catalog verification could run.";
  } else {
    catalogNote = "PRINTIFY_API_TOKEN not set — catalog IDs cannot be verified or resolved live.";
  }

  const results = [];
  for (const product of products) {
    const listing = generateListing(symbol, product);
    // In dry-run mode we never upload, so uploadedImageId is always null.
    const built = buildProductDraft({ symbol, product, listing, uploadedImageId: null });
    results.push({
      sku: product.sku,
      product: product.name,
      status: built.status,
      blockers: built.blockers,
      warnings: built.warnings,
      listing,
      draft: built.draft
    });
  }

  const report = {
    generated_at: new Date().toISOString(),
    mode: "DRY-RUN (draft only — no live creation, no publish)",
    symbol: { slug: symbol.slug, name: symbol.name, tradition: symbol.tradition },
    catalog_note: catalogNote,
    summary: {
      total: results.length,
      pass: results.filter((r) => r.status === "PASS").length,
      fail: results.filter((r) => r.status === "FAIL").length
    },
    products: results
  };

  // Write the full draft report to merch/out/.
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `dry-run-${symbol.slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  // Human-readable console report.
  const line = "-".repeat(64);
  console.log(line);
  console.log(`DIVINE ARCHIVES MERCH AGENT — DRY RUN`);
  console.log(`Symbol : ${symbol.name}  (${symbol.slug})`);
  console.log(`Mode   : ${report.mode}`);
  console.log(`Catalog: ${catalogNote}`);
  console.log(line);
  for (const r of results) {
    console.log(`${r.sku}  ${r.product.padEnd(18)} ${r.status}`);
    for (const b of r.blockers) console.log(`      BLOCKER: ${b}`);
    for (const w of r.warnings) console.log(`      warning: ${w}`);
  }
  console.log(line);
  console.log(`RESULT: ${report.summary.pass}/${report.summary.total} pass, ${report.summary.fail}/${report.summary.total} fail`);
  console.log(`Draft report written to: ${path.relative(path.join(__dirname, "..", ".."), outPath)}`);
  console.log(line);
}

main().catch((err) => {
  console.error("dry run failed:", err);
  process.exit(1);
});
