#!/usr/bin/env node
/* Verify every Theomachy fighter's epithet/weapon grounding is real chapter text:
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
console.log("Theomachy fighters: "+bank.fighters.length+" | grounded in "+bank.chapter+": "+ok+" | failures: "+fails);
if(fails){process.exit(1);}
console.log("VERIFY OK — every fighter's epithet/weapon is grounded in real chapter text.");
