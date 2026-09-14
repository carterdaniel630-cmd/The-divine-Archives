#!/usr/bin/env node
/* Verify every Archive Chess capture-fact is grounded in real chapter text:
   its `basis` must appear in that pantheon's source chapter. */
"use strict";
const fs=require("fs"),vm=require("vm"),path=require("path");
const ROOT=path.resolve(__dirname,"..");
const noop={textContent:"",appendChild(){},setAttribute(){},style:{}};
const doc={createElement(){return noop;},querySelectorAll(){return[];},addEventListener(){},head:noop,documentElement:noop,body:noop};
const ctx={window:{},document:doc,console};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT,"docs/assets/chapters.js"),"utf8"),ctx);
const C=ctx.window.CHAPTERS;
function strip(h){return h.replace(/<[^>]+>/g," ").replace(/&mdash;/g,"—").replace(/&rsquo;/g,"’").replace(/&ldquo;/g,"“").replace(/&rdquo;/g,"”").replace(/&amp;/g,"&").replace(/&[a-z]+;/g," ").replace(/&#\d+;/g," ").replace(/\s+/g," ").trim().toLowerCase();}
const bank=JSON.parse(fs.readFileSync(path.join(ROOT,"docs/assets/games/data/chess.json"),"utf8"));
let fails=0,ok=0,total=0;
Object.keys(bank.pantheons).forEach(pk=>{
  const p=bank.pantheons[pk], txt=strip((C[p.chapter]||{}).html||"");
  if(!C[p.chapter]){console.log("  FAIL ["+pk+"] unknown chapter "+p.chapter);fails++;return;}
  Object.keys(p.roles).forEach(rk=>{
    total++; const r=p.roles[rk];
    if(!r.basis||txt.indexOf(String(r.basis).toLowerCase())===-1){console.log("  FAIL ["+pk+"/"+rk+" "+r.god+"] basis not in "+p.chapter+': "'+r.basis+'"');fails++;return;}
    ok++;
  });
});
console.log("Archive Chess capture-facts: "+total+" | verified: "+ok+" | failures: "+fails);
if(fails){process.exit(1);}
console.log("VERIFY OK — every capture-fact is grounded in real chapter text.");
