const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = process.argv[2], OUT = process.argv[3], PORT = +(process.argv[4] || 8795);
const W = (process.env.WIDTHS || "390").split(",").map(Number);
const DISTS = (process.env.DISTS || "3.0,3.3,5,7.9,8.3").split(",").map(Number);
const ONLY = process.env.ONLY ? process.env.ONLY.split(",") : null;
fs.mkdirSync(OUT, { recursive: true });
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0].split("#")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); }).listen(PORT);
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(1) + "s", ...a);
const ANG = { shiva: -Math.PI / 4, isis: -3 * Math.PI / 4, socrates: Math.PI }, R = 6.4, CX = 0, CZ = -14, DY = 1.62 - 0.5;
(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  for (const w of W) {
    const ctx = await b.newContext({ viewport: { width: w, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const page = await ctx.newPage(); page.on("pageerror", (e) => log("ERR", String(e)));
    await page.goto(`http://localhost:${PORT}/museum.html`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__MU && window.__MU.state().built.length > 0, null, { timeout: 120000 });
    await page.evaluate(() => { const e = document.getElementById("mu-enter"); if (e) e.click(); });
    await page.evaluate(() => window.__MU.teleport("@rotunda"));
    for (let i = 0; i < 90; i++) { const s = await page.evaluate(() => window.__MU.statues()); if (s.every((q) => q.state === "ready" || q.state === "failed")) { log(w, "statues", JSON.stringify(s)); break; } await page.waitForTimeout(1000); }
    for (const id of Object.keys(ANG)) { if (ONLY && !ONLY.includes(id)) continue;
      const a = ANG[id], sx = CX + R * Math.cos(a), sz = CZ + R * Math.sin(a);
      for (const d3 of DISTS) {
        const d = Math.sqrt(Math.max(0.01, d3 * d3 - DY * DY)), b2 = a + (+(process.env.OFF || 1.0)), px = sx - Math.cos(b2) * d, pz = sz - Math.sin(b2) * d;
        const yaw = Math.atan2(-(sx - px), -(sz - pz)), pitch = -Math.atan2(0.6, d) * 0.5;
        const r = await page.evaluate(async ([x, z, yaw, pitch]) => { window.__MU.place(x, z, yaw, pitch); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))); const s = window.__MU.state(); return { tris: s.tris, calls: s.calls, levels: window.__MU.statues().map((q) => q.level) }; }, [px, pz, yaw, pitch]);
        const f = `${id}-${d3}m-${w}.png`; await page.screenshot({ path: path.join(OUT, f) }); log(f, JSON.stringify(r));
      }
    }
    await ctx.close();
  }
  await b.close(); srv.close();
})();
