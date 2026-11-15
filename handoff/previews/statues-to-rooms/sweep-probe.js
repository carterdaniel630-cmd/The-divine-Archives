const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = process.argv[2], OUT = process.argv[3];
const types = { '.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.glb':'model/gltf-binary','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.jpg':'image/jpeg' };
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = path.join(ROOT, p); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); }).listen(8766);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader'] });
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', (e) => errs.push(String(e)));
  await pg.addInitScript(() => { try { localStorage.setItem('mu-seen', '1'); } catch (e) {} });
  await pg.goto('http://localhost:8766/museum.html', { waitUntil: 'load' });
  await pg.waitForFunction(() => window.__MU && __MU.state, null, { timeout: 60000 });
  const out = {};
  for (const room of ['ch15', 'ch83']) {
    await pg.evaluate((r) => __MU.teleport(r), room);
    await pg.waitForFunction((r) => __MU.statues().some((s) => s.room === r && s.state === 'ready'), room, { timeout: 120000 });
    await pg.waitForTimeout(2000);
    const s0 = await pg.evaluate(() => __MU.state());
    const dz = s0.z; const doorZ = dz - 1.6, cx = s0.x;
    const res = await pg.evaluate(async ({ cx, doorZ, yaw0 }) => {
      const raf = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      let worst = { tris: 0 }, worstC = { calls: 0 }, n = 0, over = 0;
      for (const u of [-3, -1.5, 0, 1.5, 3]) for (const v of [1.6, 6.6, 8.3, 11.3, 12.6]) {
        if (Math.hypot(u, v - 9.7) < 1.1) continue;
        for (let k = 0; k < 8; k++) for (const p of [0]) {
          __MU.place(cx + u, doorZ + v, yaw0 + k * Math.PI / 4, p); await raf();
          const s = __MU.state(); n++;
          const lv = __MU.statues().find((x) => x.shown);
          const rec = { u, v, k, p, tris: s.tris, calls: s.calls, level: lv && lv.level };
          if (s.tris > 220000 || s.calls > 100) over++;
          if (s.tris > worst.tris) worst = rec; if (s.calls > worstC.calls) worstC = rec;
        }
      }
      return { n, over, worst, worstC };
    }, { cx, doorZ, yaw0: s0.yaw });
    out[room] = res;
    // close view screenshot: 2.6 m in front of the statue, looking at it
    await pg.evaluate(({ cx, doorZ, yaw0 }) => __MU.place(cx, doorZ + 7.1, yaw0, 0.05), { cx, doorZ, yaw0: s0.yaw });
    await pg.waitForTimeout(800); await pg.screenshot({ path: `${OUT}/${room}-near-390.png` });
    out[room].nearView = await pg.evaluate(() => ({ s: __MU.state(), st: __MU.statues() }));
    // the guide lists the statue
    out[room].guide = await pg.evaluate(() => { const b = document.getElementById('mu-guide-body'); return b ? b.textContent.slice(0, 400) : null; });
  }
  out.errs = errs;
  fs.writeFileSync(`${OUT}/sweep.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1).slice(0, 5000));
  await b.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
