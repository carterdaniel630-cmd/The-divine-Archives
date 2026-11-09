const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = process.argv[2], PORT = +(process.argv[3] || 8792);
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0].split("#")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); }).listen(PORT);
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(1) + "s", ...a);
(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await ctx.newPage(); page.on("pageerror", (e) => log("ERR", String(e))); page.on("console", (m) => { if (m.type() === "warning" || m.type() === "error") log("console", m.text().slice(0, 200)); });
  await page.goto(`http://localhost:${PORT}/museum.html`, { waitUntil: "load" }); log("loaded");
  await page.waitForFunction(() => window.__MU && window.__MU.state().built.length > 0, null, { timeout: 120000 }); log("built");
  await page.evaluate(() => { const e = document.getElementById("mu-enter"); if (e) e.click(); }); log("entered");
  await page.evaluate(() => window.__MU.teleport("@rotunda")); log("teleported");
  for (let i = 0; i < 60; i++) { const s = await page.evaluate(() => window.__MU.statues()); if (s.every((q) => q.state === "ready" || q.state === "failed")) { log("statues", JSON.stringify(s)); break; } await page.waitForTimeout(1000); }
  const views = process.env.VIEWSFILE ? JSON.parse(fs.readFileSync(process.env.VIEWSFILE, "utf8")) : JSON.parse(process.env.VIEWS || "[]");
  const out = [];
  for (const v of views) {
    const r = await page.evaluate(async ([x, z, yaw, pitch]) => { window.__MU.place(x, z, yaw, pitch || 0); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))); const s = window.__MU.state(); return { x, z, yaw: +yaw.toFixed(2), pitch: pitch || 0, tris: s.tris, calls: s.calls, levels: window.__MU.statues().map((q) => q.level) }; }, v);
    out.push(r); if (out.length % 100 === 0) { log('progress', out.length); if (process.env.OUT) fs.writeFileSync(process.env.OUT, JSON.stringify(out)); }
  }
  const door = await page.evaluate(async () => { window.__MU.teleport("@rotunda"); await new Promise((r) => setTimeout(r, 1500)); const s = window.__MU.state(); return { door: true, x: +s.x.toFixed(2), z: +s.z.toFixed(2), yaw: +s.yaw.toFixed(2), tris: s.tris, calls: s.calls, levels: window.__MU.statues().map((q) => q.level) }; });
  out.push(door);
  if (process.env.SHOT) { await page.evaluate(([x, z, y]) => window.__MU.place(x, z, y, 0), JSON.parse(process.env.SHOTPOS)); await page.waitForTimeout(1500); await page.screenshot({ path: process.env.SHOT }); }
  if (process.env.OUT) fs.writeFileSync(process.env.OUT, JSON.stringify(out, null, 1));
  out.forEach((o) => log(JSON.stringify(o)));
  await b.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
