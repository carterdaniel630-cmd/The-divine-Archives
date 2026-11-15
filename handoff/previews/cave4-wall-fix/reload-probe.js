const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [W, H] of [[360, 780], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => { if (m.type() === 'error' && !/ERR_TUNNEL/.test(m.text())) errs.push(m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('pg-seen-qumran-caves', '1'); } catch (e) {} });
    await p.goto('http://127.0.0.1:8765/pilgrimage/qumran-caves.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.__PG && window.__PG.state, null, { timeout: 60000 });
    const out = [];
    for (const id of ['s2', 's1', 's3', 's2']) {
      await p.evaluate((id) => window.__PG.go(id), id); await p.waitForTimeout(1200); await p.evaluate(() => window.__PG.ready()); await p.waitForTimeout(800);
      const st = await p.evaluate(() => window.__PG.state()); out.push([id, st.built.join('+'), st.calls, st.tris, st.geometries, st.textures]);
    }
    await p.evaluate(() => window.__PG.place(300, -0.6, Math.PI, 0, -0.05)); await p.waitForTimeout(600);
    const st = await p.evaluate(() => window.__PG.state());
    await p.screenshot({ path: `w${W}-start.png` });
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    console.log(W, JSON.stringify({ out, standing: [st.calls, st.tris], scrollW: sw, errs }));
    await ctx.close();
  }
  await b.close();
})();
