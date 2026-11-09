const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = process.argv[2], PORT = +process.argv[3];
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css" };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); }).listen(PORT);
(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/museum.html`);
  await page.waitForFunction(() => window.__MU && window.__MU.state().built.length > 0, null, { timeout: 120000 });
  await page.evaluate(() => { const e = document.getElementById("mu-enter"); if (e) e.click(); });
  const cdp = await ctx.newCDPSession(page); await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.evaluate(() => { window.__lt = []; new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push(e.duration))).observe({ type: "longtask" }); window.__MU.teleport("@rotunda"); });
  const t0 = Date.now();
  for (let i = 0; i < 240; i++) { const s = await page.evaluate(() => window.__MU.statues()); if (s.every((q) => q.state === "ready" || q.state === "failed")) break; await page.waitForTimeout(500); }
  const lt = await page.evaluate(() => window.__lt);
  console.log(ROOT, "ready after", ((Date.now() - t0) / 1000).toFixed(1), "s; longest task", Math.max(...lt).toFixed(0), "ms; tasks>1s", lt.filter((d) => d > 1000).map((d) => d.toFixed(0)).join(","));
  await b.close(); srv.close();
})();
