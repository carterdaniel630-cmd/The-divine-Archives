// usage: node tools/ground-check.js [docs]   (needs Playwright; headless, SwiftShader; not a verify-*.js, so the
// facts workflow, which has no browser, does not run it)
// "Ground at your feet" (Carter 2026-11-16, handoff/decisions-2026-11-16-carter-ground-at-your-feet.md), checked in
// the flat museum, which is the same build the headset draws:
//  1. the VR pilot's grounds (ch02 Egypt, ch03 Mesopotamia, the Bronze Age corridor) have no glass; their ground is
//     at the floor (never above it, never more than a shallow bed below it); their water sits just below the floor;
//  2. their plants and creatures are still there, and every creature stands on, swims in or flies over that ground
//     (none left down where the old pit floor was, none buried);
//  3. a room outside the pilot keeps its pit under glass (the change goes no further than the pilot);
//  4. phones (360 and 390 px): 0 script errors with the pilot grounds built.
// Comfort §a.6 (no pits, no drops): the land is at most TOP_MAX below the floor and the water's bed at most BED_MAX.
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = process.argv[2] || "docs", PORT = 8793;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0].split("#")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" }); s.end(d); }); });

const PILOT = [["ch02", "ch02"], ["ch03", "ch03"], ["cor:02-bronze-age", "@02-bronze-age"]];
const OUTSIDE = [["ch05", "ch05"]];
const WATER = -0.06, TOP_MAX = 0, BED_MAX = -0.45;
const fails = [];
const check = (ok, what) => { console.log(`  ${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };

(async () => {
  await new Promise((r) => srv.listen(PORT, r));
  const b = await chromium.launch();
  for (const w of [960, 390, 360]) {
    console.log(`\nviewport ${w} px`);
    const page = await b.newPage({ viewport: { width: w, height: w > 800 ? 600 : 800 } });
    const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`http://localhost:${PORT}/museum.html`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__MU && window.__MU.state().built.length > 0, null, { timeout: 120000 });
    await page.evaluate(() => { const e = document.getElementById("mu-enter"); if (e) e.click(); });
    const visit = async (id, target) => {
      await page.evaluate((t) => window.__MU.teleport(t), target);
      await page.waitForFunction((i) => !!window.__MU.ground(i), id, { timeout: 60000 }).catch(() => {});
      await page.waitForTimeout(2500);                       // creatures settle on their ground
      return page.evaluate((i) => window.__MU.ground(i), id);
    };
    for (const [id, target] of (w > 800 ? PILOT.concat(OUTSIDE) : PILOT)) {
      const g = await visit(id, target);
      if (!g) { check(false, `${id}: its ground was built`); continue; }
      if (OUTSIDE.some(([o]) => o === id)) { check(!g.feet && g.glass && g.hi < -0.3, `${id} (outside the pilot): still a pit under glass (ground ${g.lo}..${g.hi} m)`); continue; }
      check(g.feet && !g.glass, `${id}: ground at your feet, no glass`);
      check(g.hi <= TOP_MAX && g.hi > -0.05, `${id}: the land reaches the floor and never rises above it (highest ${g.hi} m)`);
      check(g.lo >= BED_MAX, `${id}: the deepest point is a shallow bed, not a drop (lowest ${g.lo} m, limit ${BED_MAX})`);
      check(g.waterY == null || Math.abs(g.waterY - WATER) < 1e-6, `${id}: the water lies just below the floor (${g.waterY} m)`);
      check(g.plants > 0, `${id}: plants and stones still grow (${g.plants})`);
      const lost = g.fauna.filter(([, y, , gy]) => y < Math.min(gy, g.waterY == null ? gy : g.waterY) - 0.35 || y < -0.7);
      check(g.fauna.length > 0 && lost.length === 0, `${id}: ${g.fauna.length} creatures, all on or over the raised ground${lost.length ? " (left below: " + JSON.stringify(lost.slice(0, 3)) + ")" : ""}`);
    }
    check(errors.length === 0, `0 script errors${errors.length ? ": " + errors.slice(0, 2).join(" | ") : ""}`);
    await page.close();
  }
  await b.close(); srv.close();
  console.log(fails.length ? `\n${fails.length} check(s) failed` : "\nall ground checks passed");
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
