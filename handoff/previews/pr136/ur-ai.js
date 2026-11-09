const { chromium } = require("playwright");
(async()=>{for(const [w,rm] of [[1280,'no-preference'],[390,'reduce']]){
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:w,height:800},reducedMotion:rm});const page=await ctx.newPage();const errs=[];page.on('pageerror',e=>errs.push(String(e)));
 await page.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
 await page.goto('file://'+process.argv[2]);await page.waitForTimeout(300);
 await page.evaluate(()=>document.querySelector('ur-game').startMatch('ai',3));
 for(let i=0;i<400;i++){const s=await page.evaluate(()=>{const u=document.querySelector('ur-game');return {w:u.state.winner,t:u.state.turn,r:u.state.rolled}});if(s.w)break;
  if(s.t==='white'){if(s.r===null)await page.evaluate(()=>document.querySelector('ur-game').rollDice(false));else await page.evaluate(()=>{const u=document.querySelector('ur-game');const m=u.legalMoves('white');if(m.length)u.tryMove(m[0]);});}
  await page.waitForTimeout(400);}
 const r=await page.evaluate(()=>{const u=document.querySelector('ur-game');return {winner:u.state.winner,moves:u.state.moveNo,told:[...(u._told||[])]}});
 if(w===1280)await page.screenshot({path:process.argv[3]+'/ur-desktop.png'});
 console.log(w,rm,JSON.stringify(r),errs);await b.close();}})();
