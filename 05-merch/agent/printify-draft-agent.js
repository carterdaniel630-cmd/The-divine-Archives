#!/usr/bin/env node
/*
 * Divine Archives — Merch Product/Idea Agent (Printify draft-product builder)
 * ---------------------------------------------------------------------------
 * Scope: Divine Archives merch ONLY. Nothing here touches Pip's Orchard.
 *
 * What it does: turns ONE approved symbol design into DRAFT Printify products.
 * What it will NEVER do: publish, activate, or make a listing live. There is no
 * publish endpoint call in this file. Products are created visible:false. Live
 * mode still only creates drafts.
 *
 * Modes:
 *   (default) DRY RUN  — builds and prints every API payload, sends nothing.
 *   --live             — actually calls Printify (draft create only). Requires
 *                        env PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID, and a
 *                        populated product list. Still draft-only.
 *
 * Usage:
 *   node printify-draft-agent.js --symbol "Tree of Life" \
 *        --art-transparent path/to/tol-transparent.png \
 *        --art-parchment  path/to/tol-parchment.png \
 *        [--live]
 *
 * Review gate: processes exactly ONE symbol, writes a summary, and stops.
 * It does not batch the queue.
 */

'use strict';
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const STAGE_ROOT = path.resolve(__dirname, '..');
const PRINTIFY_BASE = 'https://api.printify.com/v1';
const TITLE_PATTERN = (name) => `${name} — Divine Archives`;
const COLLECTION_TAG = 'Divine Archives';

// ---- tiny arg parser --------------------------------------------------------
function parseArgs(argv) {
  const args = { live: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--live') args.live = true;
    else if (a === '--symbol') args.symbol = argv[++i];
    else if (a === '--art-transparent') args.artTransparent = argv[++i];
    else if (a === '--art-parchment') args.artParchment = argv[++i];
    else if (a === '--slug') args.slug = argv[++i];
    else throw new Error(`Unknown argument: ${a}`);
  }
  if (!args.symbol) throw new Error('Missing required --symbol "<Symbol Name>"');
  args.slug = args.slug || slugify(args.symbol);
  return args;
}
function slugify(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
const log = (...m) => console.log(...m);
const flag = (m) => console.log(`  ⚑ ${m}`);

// ---- description builder ----------------------------------------------------
// Pulls the cross-tradition framing from the symbol's drafts/symbols/<slug>.md
// entry and shapes it into an attributed product description. Output is flagged
// READY FOR REVIEW and is NOT applied to the product automatically.
function buildDescription(slug, symbolName) {
  const draftPath = path.join(REPO_ROOT, 'drafts', 'symbols', `${slug}.md`);
  if (!fs.existsSync(draftPath)) {
    return {
      ok: false,
      reason: `No symbol draft at drafts/symbols/${slug}.md — cannot build an attributed description. (Draft the symbol entry first.)`,
      text: null,
    };
  }
  const md = fs.readFileSync(draftPath, 'utf8');
  const grab = (heading) => {
    // Capture from this H2 up to the next H2 or end-of-file. No `m` flag, so `$`
    // means end-of-string, making the final section in a file safe to grab too.
    const re = new RegExp(`\\n##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`);
    const m = md.match(re);
    return m ? m[1].trim() : null;
  };
  const whatIs = grab('What the symbol is') || grab('What Wicca is') || '';
  const connections = grab('Connections') || '';
  const firstPara = (s) => (s ? s.split('\n\n')[0].replace(/\s+/g, ' ').trim() : '');

  // Strip markdown emphasis/links for a clean storefront paragraph.
  const clean = (s) => s
    .replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1').replace(/`/g, '').trim();

  const lead = clean(firstPara(whatIs));
  const cross = clean(firstPara(connections));

  const text = [
    `${symbolName} — from The Divine Archives.`,
    '',
    lead,
    '',
    cross,
    '',
    'Part of a comparative reference project on the world\'s symbolic traditions. ' +
    'This design is presented in an educational, cross-tradition spirit — it is not a ' +
    'claim of endorsement by, or exclusive ownership of, any single religion.',
  ].filter((l) => l !== null).join('\n');

  return {
    ok: true,
    reason: 'Built from the symbol draft; cross-tradition framing, no single-religion claim.',
    text,
  };
}

// ---- pricing ----------------------------------------------------------------
function loadPricing() {
  const p = path.join(STAGE_ROOT, 'config', 'pricing.config.json');
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
  return cfg;
}
function draftRetail(costCents, pricing) {
  if (costCents == null) return { retail: null, display: 'COST UNKNOWN (dry-run — no live Printify cost)', placeholder: true };
  const raw = (costCents / 100) * pricing.placeholder_margin_multiplier;
  const rounded = Math.floor(raw) + (pricing.round_to || 0.99);
  return { retail: rounded, display: `$${rounded.toFixed(2)} (PLACEHOLDER margin x${pricing.placeholder_margin_multiplier})`, placeholder: true };
}

// ---- product list guard -----------------------------------------------------
function loadProducts() {
  const p = path.join(STAGE_ROOT, 'config', 'products.config.json');
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
  const missing = !Array.isArray(cfg.products) || cfg.products.length === 0;
  return { cfg, missing };
}

// ---- Printify client (only used with --live; draft-only endpoints) ----------
function requireLiveEnv() {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shop = process.env.PRINTIFY_SHOP_ID;
  const missing = [];
  if (!token) missing.push('PRINTIFY_API_TOKEN');
  if (!shop) missing.push('PRINTIFY_SHOP_ID');
  return { token, shop, missing };
}

// ---- payload builders -------------------------------------------------------
function imageUploadPayload(fileName, artPath) {
  // Printify accepts either a public URL or base64 `contents`. In a real live run
  // we'd base64 the local PNG. Here we only DESCRIBE the payload.
  return { endpoint: `POST ${PRINTIFY_BASE}/uploads/images.json`, body: { file_name: fileName, contents: `<base64 of ${artPath}>` } };
}
function productCreatePayload(shopId, symbolName, product, imageId, pricing) {
  const price = draftRetail(product._costCents ?? null, pricing);
  return {
    endpoint: `POST ${PRINTIFY_BASE}/shops/${shopId || '{shop}'}/products.json`,
    body: {
      title: TITLE_PATTERN(symbolName),
      description: '<<HELD — attributed description is READY FOR REVIEW, applied by a human after approval>>',
      blueprint_id: product.blueprint_id ?? '<<from product list>>',
      print_provider_id: product.print_provider_id ?? '<<from product list>>',
      tags: [COLLECTION_TAG],
      visible: false, // DRAFT / unpublished — never flipped by this agent
      variants: (product.variant_ids || ['<<from product list>>']).map((id) => ({
        id, price: price.retail != null ? Math.round(price.retail * 100) : null, is_enabled: true,
      })),
      print_areas: [{
        variant_ids: product.variant_ids || ['<<from product list>>'],
        placeholders: [{ position: product.placement || 'front', images: [{ id: imageId, x: 0.5, y: 0.5, scale: 1, angle: 0 }] }],
      }],
    },
    _pricingDisplay: price.display,
    _artVersion: product.art_version || '<<from product list>>',
  };
}

// ---- main -------------------------------------------------------------------
async function main() {
  const args = parseArgs(process.argv);
  const mode = args.live ? 'LIVE (draft-create only)' : 'DRY RUN (no API calls)';
  log(`\n=== Divine Archives merch agent — ${TITLE_PATTERN(args.symbol)} ===`);
  log(`Mode: ${mode}`);
  log('Guarantee: this agent never publishes or activates. Draft only.\n');

  const outDir = path.join(STAGE_ROOT, 'runs', args.slug);
  fs.mkdirSync(outDir, { recursive: true });

  const blockers = [];
  const pricing = loadPricing();
  const { cfg: products, missing: productsMissing } = loadProducts();

  // Step 1: art inputs
  log('1. Art inputs');
  for (const [label, p] of [['transparent', args.artTransparent], ['parchment', args.artParchment]]) {
    if (!p) { flag(`${label} art not provided — placeholder used (dry run only)`); blockers.push(`art:${label} missing`); }
    else if (!fs.existsSync(p)) { flag(`${label} art path does not exist: ${p}`); blockers.push(`art:${label} not found`); }
    else log(`   ${label}: ${p}`);
  }

  // Step 2: attributed description (human-gated)
  log('\n2. Attributed description (READY FOR REVIEW — not auto-applied)');
  const desc = buildDescription(args.slug, args.symbol);
  if (desc.ok) {
    fs.writeFileSync(path.join(outDir, 'description.review.md'),
      `# ${args.symbol} — product description (READY FOR REVIEW)\n\n> Do NOT apply to any listing until a human approves. Misattribution risk on religious content.\n\n${desc.text}\n`);
    log(`   built → runs/${args.slug}/description.review.md  (${desc.reason})`);
  } else {
    flag(desc.reason); blockers.push('description: no symbol draft');
  }

  // Step 3: product-creation guard
  log('\n3. Draft product creation');
  const payloads = { image_uploads: [], product_creates: [] };
  if (productsMissing) {
    flag('LOCKED 10-PRODUCT LIST IS MISSING (config/products.config.json is empty).');
    flag('Halting before product creation — the agent will not invent blanks or catalog IDs.');
    blockers.push('products: locked 10-product list missing');
  } else {
    // Build (dry) or send (live) the image upload + one draft product per blank.
    const imgTransparent = imageUploadPayload(`${args.slug}-transparent.png`, args.artTransparent || '<transparent art>');
    const imgParchment = imageUploadPayload(`${args.slug}-parchment.png`, args.artParchment || '<parchment art>');
    payloads.image_uploads.push(imgTransparent, imgParchment);
    const imageIdFor = (v) => (v === 'parchment' ? '<parchment image id>' : '<transparent image id>');
    for (const prod of products.products) {
      payloads.product_creates.push(productCreatePayload(args.live ? requireLiveEnv().shop : null, args.symbol, prod, imageIdFor(prod.art_version), pricing));
    }
    log(`   built ${payloads.product_creates.length} draft product payload(s) across the locked blanks.`);
    if (args.live) {
      const env = requireLiveEnv();
      if (env.missing.length) { flag(`LIVE requested but env missing: ${env.missing.join(', ')} — NOT sending.`); blockers.push(`env: ${env.missing.join('+')} missing`); }
      else { flag('LIVE send path is intentionally left as an explicit TODO pending Carter approval of a live draft run.'); }
    }
  }
  fs.writeFileSync(path.join(outDir, 'payloads.json'), JSON.stringify(payloads, null, 2));

  // Step 4: review summary + STOP
  const summary = [
    `# Merch dry-run summary — ${args.symbol}`,
    '',
    `- **Mode:** ${mode}`,
    `- **Product title:** \`${TITLE_PATTERN(args.symbol)}\``,
    `- **Collection tag:** \`${COLLECTION_TAG}\` (set on each draft; Shopify collection assignment is downstream)`,
    `- **Products built:** ${payloads.product_creates.length}${productsMissing ? '  ⟵ blocked (no product list)' : ''}`,
    `- **Pricing:** placeholder margin ×${pricing.placeholder_margin_multiplier} (flagged; no real margin set)`,
    `- **Description:** ${desc.ok ? 'built, READY FOR REVIEW (not auto-applied)' : 'NOT built — ' + desc.reason}`,
    `- **Publish/activate:** never — draft only, no code path to go live`,
    '',
    `## Blockers (${blockers.length})`,
    ...(blockers.length ? blockers.map((b) => `- ${b}`) : ['- none']),
    '',
    `## Outputs`,
    `- runs/${args.slug}/payloads.json`,
    desc.ok ? `- runs/${args.slug}/description.review.md` : null,
    '',
    `**Gate:** review this summary and approve before the next symbol. The agent has stopped.`,
  ].filter((l) => l !== null).join('\n');
  fs.writeFileSync(path.join(outDir, 'summary.md'), summary + '\n');

  log(`\n=== STOP (review gate) ===`);
  log(`Summary → runs/${args.slug}/summary.md`);
  log(`Blockers: ${blockers.length ? blockers.join('; ') : 'none'}`);
  log('One symbol processed. Not proceeding to any next symbol without approval.\n');
}

main().catch((e) => { console.error('AGENT ERROR:', e.message); process.exit(1); });
