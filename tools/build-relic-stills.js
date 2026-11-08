#!/usr/bin/env node
/* ==========================================================================
   build-relic-stills.js — one still picture of each Vault object's museum rendition, for the chapter pages'
   "In the Vault" cards (chapter-images tranche 1, Carter's Images Rule of 2026-11-06).

   Each still is rendered from the same 3D rendition the museum shows (docs/museum/relics.js, CAT), lit with the
   Foundation Kit's gallery rig, and written to docs/assets/vault/stills/<slug>.webp. They are renditions, not
   photographs, and every page that shows one says so.

   Never rendered (EXCLUDE below): V68 (the tjurunga is Not Shown, by ruling) and the three objects held by the
   rights ledger until Carter rules (V16 James Ossuary, V17 "Gospel of Jesus's Wife", V74 Satanic Bible).

   Usage: node tools/build-relic-stills.js [vNN ...]     (no ids = every object with a rendition)
   Needs Playwright with Chromium. Deterministic: buildRelic seeds its own random numbers per object.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { spawn } = require("child_process");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "docs/assets/vault/stills");
const W = 560, H = 420;
const EXCLUDE = { v68: "Not Shown by ruling", v16: "rights-ledger hold", v17: "rights-ledger hold", v74: "rights-ledger hold" };
// per-object views where the default three-quarter view hides what the object is (yaw, pitch in radians)
const VIEW = {};

const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "docs/assets/vault-data.js"), "utf8"), sb);
const items = sb.window.VAULT.items.filter((i) => i.status === "published");
const cat = new Set([...fs.readFileSync(path.join(ROOT, "docs/museum/relics.js"), "utf8").matchAll(/CAT\.(v\d+)\s*=/g)].map((m) => m[1]));
const want = process.argv.slice(2);
const todo = items.filter((i) => cat.has(i.id) && !EXCLUDE[i.id] && (!want.length || want.includes(i.id)));

(async () => {
  const { chromium } = require("playwright");
  const port = 8090 + Math.floor(Math.random() * 300);
  const srv = spawn(process.execPath, [path.join(__dirname, "serve.js"), String(port), ROOT], { stdio: "ignore" });
  await new Promise((r) => setTimeout(r, 600));
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  let failed = 0;
  try {
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    const errs = []; page.on("pageerror", (e) => errs.push(e.message));
    await page.goto(`http://localhost:${port}/tools/relic-stills/harness.html`);
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
    fs.mkdirSync(OUT, { recursive: true });
    for (const it of todo) {
      try {
        const url = await page.evaluate(([id, w, h, v]) => window.renderStill(id, w, h, v), [it.id, W, H, VIEW[it.id] || null]);
        const buf = Buffer.from(url.split(",")[1], "base64");
        fs.writeFileSync(path.join(OUT, it.slug + ".webp"), buf);
        console.log(`${it.id} ${it.slug}.webp ${(buf.length / 1024).toFixed(0)} KB`);
      } catch (e) { failed++; console.error(`${it.id} FAILED: ${e.message}`); }
    }
    if (errs.length) { failed++; console.error("page errors:\n  " + errs.join("\n  ")); }
  } finally { await browser.close(); srv.kill(); }
  // anything excluded must never sit in the folder, even from an older run
  for (const id of Object.keys(EXCLUDE)) { const it = items.find((i) => i.id === id) || sb.window.VAULT.items.find((i) => i.id === id); if (it) { const f = path.join(OUT, it.slug + ".webp"); if (fs.existsSync(f)) { fs.unlinkSync(f); console.log(`removed ${it.slug}.webp (${EXCLUDE[id]})`); } } }
  console.log(`${todo.length - failed} of ${todo.length} stills written to docs/assets/vault/stills/`);
  process.exit(failed ? 1 : 0);
})();
