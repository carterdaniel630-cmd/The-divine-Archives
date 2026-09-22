#!/usr/bin/env node
/* Verify every Divine Casualties fighter's epithet/weapon grounding is real chapter text:
   its `basis` must appear in the source chapter's rendered body. */
"use strict";
const fs=require("fs"),vm=require("vm"),path=require("path");
const ROOT=path.resolve(__dirname,"..");
const noop={textContent:"",appendChild(){},setAttribute(){},style:{}};
const doc={createElement(){return noop;},querySelectorAll(){return[];},addEventListener(){},head:noop,documentElement:noop,body:noop};
const ctx={window:{},document:doc,console};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT,"docs/assets/chapters.js"),"utf8"),ctx);
const C=ctx.window.CHAPTERS;
function strip(h){return h.replace(/<[^>]+>/g," ").replace(/&mdash;/g,"—").replace(/&rsquo;/g,"’").replace(/&ldquo;/g,"“").replace(/&rdquo;/g,"”").replace(/&amp;/g,"&").replace(/&[a-z]+;/g," ").replace(/&#\d+;/g," ").replace(/\s+/g," ").trim().toLowerCase();}
const bank=JSON.parse(fs.readFileSync(path.join(ROOT,"docs/assets/games/data/fighters.json"),"utf8"));
const text=strip((C[bank.chapter]||{}).html||"");
let fails=0,ok=0;
if(!C[bank.chapter]){console.log("  FAIL unknown chapter "+bank.chapter);process.exit(1);}
bank.fighters.forEach(f=>{
  if(!f.fact||!String(f.fact).trim()){console.log("  FAIL ["+f.name+"] missing surfaced fact");fails++;return;}
  if(!f.basis||text.indexOf(String(f.basis).toLowerCase())===-1){console.log("  FAIL ["+f.name+"] basis not in "+bank.chapter+': "'+f.basis+'"');fails++;return;}
  ok++;
});
console.log("Divine Casualties fighters: "+bank.fighters.length+" | grounded in "+bank.chapter+": "+ok+" | failures: "+fails);

// F3.2: also check each per-god character's factRef basis appears in its chapter.
let cok=0,cn=0;
try{
  const cctx={window:{},console};vm.createContext(cctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT,"docs/assets/games/fighter-moves.js"),"utf8"),cctx);
  const chars=cctx.window.FIGHTER_CHARACTERS||{};
  Object.keys(chars).forEach(g=>{
    const fr=chars[g].factRef; cn++;
    if(!fr||!fr.chapter||!fr.basis){console.log("  FAIL [char "+g+"] missing factRef");fails++;return;}
    const t=strip((C[fr.chapter]||{}).html||"");
    if(t.indexOf(String(fr.basis).toLowerCase())===-1){console.log("  FAIL [char "+g+"] factRef basis not in "+fr.chapter+': "'+fr.basis+'"');fails++;return;}
    cok++;
  });
  console.log("Per-god characters: "+cn+" | factRef grounded: "+cok+" | failures so far: "+fails);
}catch(e){console.log("  FAIL reading FIGHTER_CHARACTERS: "+e.message);fails++;}

if(fails){process.exit(1);}
console.log("VERIFY OK — fighters + per-god factRefs are grounded in real chapter text.");
