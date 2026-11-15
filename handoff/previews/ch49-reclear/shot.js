const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/chapters/ch49.html',{waitUntil:'networkidle'});
await p.$eval('#in-the-vault',e=>e.scrollIntoView());await p.waitForTimeout(800);
const r=await p.$$eval('#in-the-vault img',a=>a.map(i=>[i.getAttribute('src').split('/').pop(),i.complete&&i.naturalWidth>0]));
console.log(JSON.stringify(r));console.log('errors',errs.length, 'scrollW',await p.evaluate(()=>document.documentElement.scrollWidth));
await p.screenshot({path:'/tmp/claude-0/ch49-vault-390.png'});await b.close();})();
