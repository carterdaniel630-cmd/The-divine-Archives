const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = process.argv[2];
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const srv = http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]); if(p.endsWith('/'))p+='index.html'; const f=path.join(root,p); fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end();} r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'}); r.end(d);});}).listen(8765, async()=>{
  const b = await chromium.launch(); let bad=0;
  for (const w of [390,360]) {
    const pg = await b.newPage({viewport:{width:w,height:800}});
    const errs=[]; pg.on('pageerror',e=>errs.push(e.message));
    await pg.goto('http://localhost:8765/vault/rok-runestone.html',{waitUntil:'networkidle'}).catch(e=>errs.push('nav '+e.message));
    const info = await pg.evaluate(()=>{const a=[...document.querySelectorAll('#connections + p a')].find(x=>x.getAttribute('href').includes('rok-runestone-decoded')); const r=a&&a.getBoundingClientRect(); return {link:!!a, text:a&&a.textContent, sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth, banner:!!document.querySelector('.pending-banner,[class*=pending]')};});
    await pg.locator('#connections').scrollIntoViewIfNeeded();
    await pg.screenshot({path:`/tmp/claude-0/sp/v36-${w}.png`});
    const a = pg.locator('#connections + p a[href*="rok-runestone-decoded"]');
    await a.click(); await pg.waitForLoadState('networkidle');
    const dest = await pg.title();
    console.log(w, JSON.stringify(info), 'errors', errs.length, errs.slice(0,3), 'dest', dest);
    if (!info.link || info.sw>info.cw || errs.length || !dest.startsWith('The Rök Stone, Decoded')) bad++;
  }
  await b.close(); srv.close(); process.exit(bad?1:0);
});
