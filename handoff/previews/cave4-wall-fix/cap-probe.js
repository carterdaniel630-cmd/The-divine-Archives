// usage: node cap.js <port> <outprefix> [w h]
const { chromium } = require('playwright');
const [port, out, W = 390, H = 844] = process.argv.slice(2);
const PI = Math.PI;
const views = [
  // name, x, z, yaw, pitch
  ['south-stand', 300, -0.6, PI, -0.05],        // standing in 4a facing the south wall (holes rows)
  ['south-close', 300.2, 0.9, PI, -0.05],
  ['west-stand', 301.0, 0.2, PI / 2, -0.05],     // facing the west wall
  ['sw-oblique', 301.2, -0.9, PI * 0.75, -0.05],
  ['entrance', 300, 1.6, 0, 0.0],               // facing back north to the mouth (dark wedge)
  ['entrance-in', 300, -1.2, 0, 0.05],
  ['east-through', 299.0, 0.35, -PI / 2, 0],
  ['4b-east', 304.8, 0.6, -PI / 2, 0.1],
  ['4b-north', 305.3, 1.0, 0, 0.1],
];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: +W, height: +H }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(() => { try { localStorage.setItem('pg-seen-qumran-caves', '1'); } catch (e) {} });
  await p.goto(`http://127.0.0.1:${port}/pilgrimage/qumran-caves.html${process.env.Q||""}`, { waitUntil: 'load' });
  await p.waitForFunction(() => window.__PG && window.__PG.state, null, { timeout: 60000 });
  await p.evaluate(() => window.__PG.go('s2'));
  await p.waitForTimeout(1500);
  await p.evaluate(() => window.__PG.ready());
  await p.waitForTimeout(1500);
  for (const [n, x, z, yaw, pitch] of views) {
    await p.evaluate(([x, z, yaw, pitch]) => window.__PG.place(x, z, yaw, 0, pitch), [x, z, yaw, pitch]);
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}-${n}.png` });
  }
  const st = await p.evaluate(() => window.__PG.state());
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  console.log(JSON.stringify({ st, scrollW: sw, errs }));
  await b.close();
})();
