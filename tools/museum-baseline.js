// usage: DPR=1 THR=1 node tools/museum-baseline.js docs audits/museum-visual-pass/<name>.json  (needs Playwright)
// museum baseline on a phone-sized viewport: bytes, load times, draw calls, frame time (SwiftShader: relative only)
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = process.argv[2] || "docs", PORT = 8765 + (process.argv[3] ? 1 : 0), OUT = process.argv[3] || "baseline.json";
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0].split("#")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); }).listen(PORT);
(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: +(process.env.DPR||2), isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36" });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page); await cdp.send("Emulation.setCPUThrottlingRate", { rate: +(process.env.THR||4) });
  let bytes = 0, byType = {}; page.on("response", async (r) => { try { const buf = await r.body(); bytes += buf.length; const ext = (r.url().split("?")[0].match(/\.(\w+)$/) || [, "other"])[1]; byType[ext] = (byType[ext] || 0) + buf.length; } catch (e) {} });
  const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
  const t0 = Date.now();
  await page.goto(`http://localhost:${PORT}/museum.html`, { waitUntil: "load" });
  const tLoad = Date.now() - t0;
  await page.waitForFunction(() => window.__MU && window.__MU.state().built.length > 0, null, { timeout: 120000 });
  const tReady = Date.now() - t0;
  await page.evaluate(() => { const e = document.getElementById("mu-enter"); if (e) e.click(); });
  const res = { viewport: `412x915 @${process.env.DPR||2}x, ${process.env.THR||4}x CPU throttle, SwiftShader`, tLoadMs: tLoad, tFirstZoneMs: tReady, bytesAtReady: bytes, byType: { ...byType }, spots: {} };
  const measure = async (name, target, yaw) => {
    await page.evaluate((t) => window.__MU.teleport(t), target);
    await page.waitForTimeout(6000);
    if (yaw != null) await page.evaluate((y) => window.__MU.look(y, 0), yaw);
    const r = await page.evaluate(() => new Promise((ok) => { let n = 0; const t = performance.now(); const f = () => { n++; window.__MU.look(window.__MU.state().yaw + 0.002, 0); if (performance.now() - t < 5000) requestAnimationFrame(f); else ok({ fps: n / ((performance.now() - t) / 1000), ...window.__MU.state() }); }; requestAnimationFrame(f); }));
    res.spots[name] = { fps: +r.fps.toFixed(1), calls: r.calls, tris: r.tris, textures: r.textures, geometries: r.geometries, where: r.where };
  };
  // SPOTS='[["name","target"],...]' measures other places (targets as for museum.html#: a room id or @<era>)
  const spots = process.env.SPOTS ? JSON.parse(process.env.SPOTS) : [["hall", "@hall"], ["bronze-age corridor", "@02-bronze-age"], ["Egypt room (ch02)", "ch02"]];
  for (const [n, t] of spots) await measure(n, t);
  res.bytesTotal = bytes; res.byTypeTotal = byType; res.errors = errors;
  const hsz = await page.evaluate(() => performance.memory ? performance.memory.usedJSHeapSize : null); res.jsHeap = hsz;
  fs.writeFileSync(OUT, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res, null, 1));
  await b.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
