// usage: node tools/day-check.js [docs] [shots-dir]   (needs Playwright; headless, SwiftShader; not a verify-*.js,
// so the facts workflow, which has no browser, does not run it)
// "Day and weather" (Carter 2026-11-16, handoff/decisions-2026-11-16-carter-ground-at-your-feet.md 2), first piece:
// the hour drifts and the wind gusts in the VR pilot's three open-sky areas (world.js ENV `day`, DAY). Checked in the
// flat museum, which is the same build the headset draws:
//  1. at load each pilot area shows its own hour, the sun where it always was;
//  2. half a drift later (DAY.PERIOD / 2 of world time) it shows its second hour: the sun at day.el, the sky's
//     horizon and the light on its ground changed, the ground lit from the same sun the skylight shows;
//  3. never seen to move (Comfort: no flash, no pulse): over any one second the light changes by under 1 %, the sun
//     by under a quarter of a degree, the wind's strength by under a quarter of its calm sway;
//  4. a room outside the pilot has no drift (the change goes no further than the pilot);
//  5. 0 script errors at 960, 390 and 360 px; no draw call added (the same calls before and after the drift).
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = process.argv[2] || "docs", SHOTS = process.argv[3] || null, PORT = 8794;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0].split("#")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" }); s.end(d); }); });

// [area id, teleport target, its second hour's sun height (world.js ENV day.el)]
const PILOT = [["ch02", "ch02", 72], ["ch03", "ch03", 20], ["cor:02-bronze-age", "@02-bronze-age", 68]];
const OUTSIDE = [["ch05", "ch05"]];
const PERIOD = 480, GUST = 0.55, EL0 = Math.atan2(0.8, Math.hypot(0.35, 0.45)) * 180 / Math.PI;
const fails = [];
const check = (ok, what) => { console.log(`  ${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };
const near = (a, b, e) => a.every((v, i) => Math.abs(v - b[i]) < e);
const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
const elOf = (d) => Math.asin(d[1] / Math.hypot(d[0], d[1], d[2])) * 180 / Math.PI;

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
    const areas = w > 800 ? PILOT.concat(OUTSIDE) : PILOT.slice(0, 2);
    for (const [id, target, el1] of areas) {
      await page.evaluate((t) => window.__MU.teleport(t), target);
      await page.waitForFunction((i) => !!window.__MU.ground(i), id, { timeout: 60000 }).catch(() => {});
      await page.waitForTimeout(1500);
      if (OUTSIDE.some(([o]) => o === id)) { check((await page.evaluate((i) => window.__MU.day(i), id)) === null, `${id} (outside the pilot): no drift`); continue; }
      // bring the drift back to its start: world time to a whole number of drifts
      const t0 = await page.evaluate(() => +window.__MU.world()[0]);
      await page.evaluate((s) => window.__MU.daySkip(s), (PERIOD - (t0 % PERIOD)) % PERIOD);
      const a = await page.evaluate((i) => window.__MU.day(i), id);
      if (!a || !a.pit) { check(false, `${id}: its drift and ground are there`); continue; }
      const calls0 = await page.evaluate(() => window.__MU.state().calls);
      check(a.w < 0.001 && Math.abs(elOf(a.sunDir) - EL0) < 0.1, `${id}: at the start, its own hour (w ${a.w.toFixed(4)}, sun ${elOf(a.sunDir).toFixed(1)}°, as before ${EL0.toFixed(1)}°)`);
      if (SHOTS && w > 800 && id !== "cor:02-bronze-age") { await page.evaluate(() => window.__MU.look(0.6, 0.55)); await page.waitForTimeout(1200); await page.screenshot({ path: path.join(SHOTS, `day-${id}-start.png`), timeout: 240000 }); }
      // comfort: one second at the steepest point of the drift (a quarter of the way)
      await page.evaluate((s) => window.__MU.daySkip(s), PERIOD / 4);
      const q1 = await page.evaluate((i) => window.__MU.day(i), id);
      await page.evaluate(() => window.__MU.daySkip(1));
      const q2 = await page.evaluate((i) => window.__MU.day(i), id);
      const dl = Math.abs(lum(q2.amb) - lum(q1.amb)) / lum(q1.amb), de = Math.abs(elOf(q2.sunDir) - elOf(q1.sunDir));
      check(dl < 0.01 && de < 0.25, `${id}: never seen to move — in one second the light changes ${(dl * 100).toFixed(2)} % (< 1 %), the sun ${de.toFixed(3)}° (< 0.25°)`);
      // the wind over two minutes, a second at a time (sampled in the page: no frame is drawn between samples)
      const gs = await page.evaluate((i) => { const out = [window.__MU.day(i).gustU]; for (let k = 0; k < 120; k++) { window.__MU.daySkip(1); out.push(window.__MU.day(i).gustU); } return out; }, id);
      const gMin = Math.min(...gs), gMax = Math.max(...gs), gStep = Math.max(...gs.slice(1).map((g, k) => Math.abs(g - gs[k])));
      check(gMin >= 1 - GUST - 1e-6 && gMax <= 1 + GUST + 1e-6 && gMax - gMin > 0.2 && gStep < 0.25, `${id}: the wind gusts (plants' sway ${gMin.toFixed(2)}..${gMax.toFixed(2)} of calm, at most ${gStep.toFixed(3)} change in a second)`);
      // half a drift from the start: the second hour
      const tNow = await page.evaluate(() => +window.__MU.world()[0]);
      await page.evaluate((s) => window.__MU.daySkip(s), ((PERIOD / 2 - (tNow % PERIOD)) % PERIOD + PERIOD) % PERIOD);
      const z = await page.evaluate((i) => window.__MU.day(i), id);
      check(z.w > 0.999 && Math.abs(elOf(z.sunDir) - el1) < 0.1, `${id}: half a drift later, its second hour (w ${z.w.toFixed(4)}, sun ${elOf(z.sunDir).toFixed(1)}°, wanted ${el1}°)`);
      check(z.hor !== a.hor && !near(z.amb, a.amb, 0.01), `${id}: the sky and the light on the ground changed (horizon ${a.hor} → ${z.hor}; ground light ${lum(a.amb).toFixed(3)} → ${lum(z.amb).toFixed(3)})`);
      check(near(z.groundSunDir, z.sunDir, 1e-6) && (z.water == null || !near(z.water, a.water, 0.005)), `${id}: the ground${z.water ? " and the water" : ""} lit from the sun the skylight shows`);
      await page.waitForTimeout(600);
      const calls1 = await page.evaluate(() => window.__MU.state().calls);
      check(calls1 <= calls0 + 2, `${id}: no draw call added (${calls0} → ${calls1})`);
      if (SHOTS && w > 800 && id !== "cor:02-bronze-age") { await page.evaluate(() => window.__MU.look(0.6, 0.55)); await page.waitForTimeout(1200); await page.screenshot({ path: path.join(SHOTS, `day-${id}-later.png`), timeout: 240000 }); }
    }
    check(errors.length === 0, `0 script errors${errors.length ? ": " + errors.slice(0, 2).join(" | ") : ""}`);
    await page.close();
  }
  await b.close(); srv.close();
  console.log(fails.length ? `\n${fails.length} check(s) failed` : "\nall day checks passed");
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
