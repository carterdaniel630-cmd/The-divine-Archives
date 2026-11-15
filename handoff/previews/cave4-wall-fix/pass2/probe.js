// node probe.js port out W H dpr viewsJSON
const { chromium } = require('playwright');
const [port, out, W = 390, H = 844, dpr = 1, vj] = process.argv.slice(2);
const views = JSON.parse(vj);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: +W, height: +H }, deviceScaleFactor: +dpr, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error' && !/font|ERR_/.test(m.text())) errs.push(m.text()); });
  await p.addInitScript((d) => { Object.assign(window, d); }, JSON.parse(process.env.DBG||'{}'));
  await p.addInitScript(() => { try { localStorage.setItem('pg-seen-qumran-caves', '1'); } catch (e) {} });
  await p.goto(`http://127.0.0.1:${port}/pilgrimage/qumran-caves.html`, { waitUntil: 'load' });
  await p.waitForFunction(() => window.__PG && window.__PG.state, null, { timeout: 60000 });
  await p.waitForTimeout(2000); await p.evaluate(() => window.__PG.go('s2')); await p.waitForTimeout(1500);
  await p.evaluate(() => window.__PG.ready()); await p.waitForTimeout(1500);
  for (const [n, x, z, yaw, pitch] of views) {
    await p.evaluate(([x, z, yaw, pitch]) => window.__PG.place(x, z, yaw, 0, pitch), [x, z, yaw, pitch]);
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}-${n}.png` });
  }
  const st = await p.evaluate(() => window.__PG.state());
  console.log(JSON.stringify({ st, errs }));
  await b.close();
})();
