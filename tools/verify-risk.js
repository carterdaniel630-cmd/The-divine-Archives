#!/usr/bin/env node
/* Verify every Dominion of the Ancients (Risk) fact is grounded in real chapter text:
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
const text={};Object.keys(C).forEach(id=>text[id]=strip((C[id]||{}).html||""));
const bank=JSON.parse(fs.readFileSync(path.join(ROOT,"docs/assets/games/data/risk.json"),"utf8"));
let fails=0,ok=0;
bank.facts.forEach(f=>{
  if(!C[f.chapter]){console.log("  FAIL ["+f.label+"] unknown chapter "+f.chapter);fails++;return;}
  if(!f.basis||text[f.chapter].indexOf(String(f.basis).toLowerCase())===-1){console.log("  FAIL ["+f.label+"] basis not in "+f.chapter+': "'+f.basis+'"');fails++;return;}
  ok++;
});
console.log("Dominion of the Ancients (Risk) facts: "+bank.facts.length+" | verified: "+ok+" | failures: "+fails);
if(fails){process.exit(1);}
console.log("VERIFY OK — every land-fact is grounded in real chapter text.");
