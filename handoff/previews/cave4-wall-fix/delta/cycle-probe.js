const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [W,H] of [[360,780],[390,844]]) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error' && !/font|ERR_/.test(m.text())) errs.push(m.text()); });
  await p.addInitScript(() => { try { localStorage.setItem('pg-seen-qumran-caves', '1'); } catch (e) {} });
  await p.goto(`http://127.0.0.1:${process.argv[2]}/pilgrimage/qumran-caves.html`, { waitUntil: 'load' });
  await p.waitForFunction(() => window.__PG && window.__PG.state, null, { timeout: 60000 });
  await p.waitForTimeout(1500); const out = [];
  for (const s of ['s2','s1','s3','s2','s1','s2']) { await p.evaluate((s) => window.__PG.go(s), s); await p.waitForTimeout(1500); const st = await p.evaluate(() => window.__PG.state()); out.push(`${s}:${st.built.join('+')}/tex${st.textures}/c${st.calls}/t${st.tris}`); }
  const sw = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(W, out.join(' '), 'hscroll', sw, 'errs', JSON.stringify(errs));
  await ctx.close(); }
  await b.close();
})();
