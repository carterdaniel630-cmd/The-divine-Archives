const { chromium } = require("playwright");
const FILE=process.argv[2], OUT=process.argv[3], W=+(process.argv[4]||390), GAMES=+(process.argv[5]||3);
(async()=>{
  const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const page=await ctx.newPage();const errs=[];page.on('pageerror',e=>errs.push(String(e)));page.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await page.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
  await page.goto('file://'+FILE);await page.waitForTimeout(400);
  const res=[];let shot=0;
  for(let g=0;g<GAMES;g++){
    await page.evaluate(()=>{const u=document.querySelector('ur-game');u.startMatch('local',2);});
    if(g===0){await page.waitForTimeout(800);await page.screenshot({path:OUT+'/ur-start-'+W+'.png',fullPage:false});}
    let n=0;const told=new Set();
    while(n<2000){
      const st=await page.evaluate(()=>{const u=document.querySelector('ur-game');return {w:u.state.winner,r:u.state.rolled,turn:u.state.turn};});
      if(st.w)break;
      if(st.r===null){await page.evaluate(()=>document.querySelector('ur-game').rollDice(false));await page.waitForTimeout(820);continue;}
      const ok=await page.evaluate(()=>{const u=document.querySelector('ur-game');const m=u.legalMoves(u.state.turn);if(!m.length)return false;u.tryMove(m[Math.floor(Math.random()*m.length)]);return true;});
      n++;
      const c=await page.evaluate(()=>{const c=document.querySelector('.chronicle');return c&&!c.hidden?c.querySelector('.eyebrow').textContent:null;});
      if(c&&!told.has(c)&&g===0&&shot<5){told.add(c);await page.waitForTimeout(120);await page.screenshot({path:OUT+`/ur-mid-${shot++}-${W}.png`});}
      if(!ok)await page.waitForTimeout(900);
      await page.waitForTimeout(g===0?250:20);
    }
    await page.waitForTimeout(900);
    const end=await page.evaluate(()=>{const u=document.querySelector('ur-game');return {winner:u.state.winner,white:u.state.white,black:u.state.black,moves:u.state.moveNo,victoryOpen:document.querySelector('.victoryOverlay').classList.contains('open'),record:document.querySelector('.victoryRecord').textContent.slice(0,40),told:[...u._told]};});
    if(g===0)await page.screenshot({path:OUT+'/ur-victory-'+W+'.png'});
    await page.evaluate(()=>document.querySelector('.victoryOverlay').classList.remove('open'));
    res.push(end);
  }
  const ghosts=await page.evaluate(()=>document.querySelectorAll('.ghost').length);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  console.log(JSON.stringify({W,res,errs,ghosts,overflow},null,1));await b.close();
})();
