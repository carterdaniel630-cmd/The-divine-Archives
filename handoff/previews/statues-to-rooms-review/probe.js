const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = process.argv[2], OUT = process.argv[3], W = +(process.argv[4]||390), H = +(process.argv[5]||844);
const types = { '.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.glb':'model/gltf-binary','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.jpg':'image/jpeg' };
const PORT = 8800 + (W % 50);
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = path.join(ROOT, p); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); }).listen(PORT);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader'] });
  const pg = await b.newPage({ viewport: { width: W, height: H } });
  const errs = []; pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await pg.addInitScript(() => { try { localStorage.setItem('mu-seen', '1'); } catch (e) {} });
  await pg.goto(`http://localhost:${PORT}/museum.html`, { waitUntil: 'load' });
  await pg.waitForFunction(() => window.__MU && __MU.state, null, { timeout: 60000 });
  const out = { viewport: `${W}x${H}` };
  // Rotunda: no statue shown
  await pg.evaluate(() => __MU.teleport('@rotunda')).catch(()=>{});
  await pg.waitForTimeout(3000);
  out.rotunda = await pg.evaluate(() => ({ s: __MU.state(), shown: __MU.statues().filter((x) => x.shown).map((x) => x.id) }));
  await pg.screenshot({ path: `${OUT}/rotunda-${W}.png` });
  for (const room of ['ch15', 'ch83']) { console.error('room', room, Date.now());
    await pg.evaluate((r) => __MU.teleport(r), room);
    await pg.waitForFunction((r) => __MU.statues().some((s) => s.room === r && s.state === 'ready'), room, { timeout: 120000 });
    await pg.waitForTimeout(1500);
    const ex = await pg.evaluate((r) => __MU.exhibits().find((e) => e.type === 'statue' && e.room === r), room);
    const res = await pg.evaluate(async ({ sx, sz }) => {
      const raf = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      let worst = { tris: 0 }, worstC = { calls: 0 }, n = 0, over = 0;
      for (const d of [1.2, 2.0, 3.0]) for (let k = 0; k < 8; k++) for (const p of [-0.2, -0.5, 0.2]) {
        const a = k * Math.PI / 4, x = sx + Math.sin(a) * d, z = sz + Math.cos(a) * d;
        const yaw = Math.atan2(x - sx, z - sz); // camera looks along -z rotated: face statue
        __MU.place(x, z, yaw, p); await raf();
        const s = __MU.state(); n++;
        const rec = { d, k, p, tris: s.tris, calls: s.calls, level: (__MU.statues().find((q) => q.shown) || {}).level };
        if (s.tris > 220000 || s.calls > 100) over++;
        if (s.tris > worst.tris) worst = rec; if (s.calls > worstC.calls) worstC = rec;
      }
      return { n, over, worst, worstC };
    }, { sx: ex.x, sz: ex.z });
    out[room] = { statueAt: [ex.x, ex.z], close: res };
    // look-down close screenshot
    await pg.evaluate(({ sx, sz }) => __MU.place(sx, sz + 1.6, 0, -0.45), { sx: ex.x, sz: ex.z });
    await pg.waitForTimeout(800); await pg.screenshot({ path: `${OUT}/${room}-lookdown-${W}.png` });
    // which way is "facing": check pick via a center tap from 3 m along the yaw that looks at statue
    // wing drop/rebuild: go far away, come back, tap
    const before = await pg.evaluate(() => __MU.state().built);
    await pg.evaluate(() => __MU.teleport('@hall')); await pg.waitForTimeout(4000);
    await pg.evaluate(() => __MU.teleport('@09-modern')).catch(()=>{}); await pg.waitForTimeout(4000);
    const mid = await pg.evaluate(() => ({ built: __MU.state().built, statueEx: __MU.exhibits().filter((e) => e.type === 'statue').length }));
    await pg.evaluate((r) => __MU.teleport(r), room); await pg.waitForTimeout(5000);
    // stand 3 m in front of the statue (toward the door side) and tap screen centre
    const tap = await pg.evaluate(async ({ sx, sz }) => {
      const raf = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const res = [];
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, x = sx + Math.sin(a) * 3, z = sz + Math.cos(a) * 3; __MU.place(x, z, Math.atan2(x - sx, z - sz), -0.1); await raf(); res.push({ k, shown: __MU.statues().filter((q) => q.shown).map((q) => q.id), inRoom: __MU.debug().inRoom }); }
      return res;
    }, { sx: ex.x, sz: ex.z });
    // put camera at the first position and click centre
    await pg.evaluate(({ sx, sz }) => { const x = sx, z = sz + 3; __MU.place(x, z, 0, -0.1); }, { sx: ex.x, sz: ex.z });
    await pg.waitForTimeout(600);
    let cardTry = [];
    for (const yaw of [0, Math.PI]) {
      await pg.evaluate(({ sx, sz, yaw }) => { const z = sz + (yaw === 0 ? 3 : -3); __MU.place(sx, z, yaw, -0.1); }, { sx: ex.x, sz: ex.z, yaw });
      await pg.waitForTimeout(500);
      await pg.mouse.click(W / 2, H / 2); await pg.waitForTimeout(800);
      const card = await pg.evaluate(() => { const h = document.getElementById('mu-card-h'); const c = h && h.closest('[role=dialog], .mu-card, #mu-card'); return h ? { h: h.textContent, vis: !!(h.offsetParent), text: (c || h.parentElement).textContent.slice(0, 900), links: [...(c || h.parentElement).querySelectorAll('a')].map((a) => a.getAttribute('href')) } : null; });
      cardTry.push({ yaw, card });
      if (card && card.vis) { await pg.screenshot({ path: `${OUT}/${room}-card-${W}.png` }); await pg.keyboard.press('Escape'); await pg.waitForTimeout(300); }
    }
    out[room].wing = { before, mid, tapPositions: tap, cardTry };
    out[room].guide = await pg.evaluate((r) => __MU.guide(r), room);
  }
  // neighbours: from inside each neighbouring room, is a statue shown?
  out.leak = await pg.evaluate(async () => {
    const raf = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const rooms = ['ch14','ch16','ch13','ch82','ch84','ch81','ch85'];
    const res = {};
    for (const r of rooms) { try { __MU.teleport(r); } catch (e) { res[r] = 'n/a'; continue; } await new Promise((ok) => setTimeout(ok, 1500)); await raf(); res[r] = { inRoom: __MU.debug().inRoom, shown: __MU.statues().filter((q) => q.shown).map((q) => q.id) }; }
    return res;
  });
  out.errs = errs;
  fs.writeFileSync(`${OUT}/probe-${W}.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1).slice(0, 7000));
  await b.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
