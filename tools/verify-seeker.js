#!/usr/bin/env node
/* Verify every Seeker's Path answer is actually findable in the chapter it
   points to: the clue's `basis` must appear in that chapter's rendered body.
   Also checks each basis normalises to one of the accepted answers. */
"use strict";
const fs=require("fs"),vm=require("vm"),path=require("path");
const ROOT=path.resolve(__dirname,"..");
const noop={textContent:"",appendChild(){},setAttribute(){},style:{}};
const doc={createElement(){return noop;},querySelectorAll(){return[];},addEventListener(){},head:noop,documentElement:noop,body:noop};
const ctx={window:{},document:doc,console};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT,"docs/assets/chapters.js"),"utf8"),ctx);
const C=ctx.window.CHAPTERS;
function norm(s){return String(s==null?"":s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();}
function strip(h){return norm(h.replace(/<[^>]+>/g," ").replace(/&mdash;/g," ").replace(/&[a-z]+;/g," ").replace(/&#\d+;/g," "));}
const bank=JSON.parse(fs.readFileSync(path.join(ROOT,"docs/assets/games/data/seeker.json"),"utf8"));
let fails=0,ok=0;
bank.clues.forEach(cl=>{
  if(!C[cl.chapter]){console.log("  FAIL ["+cl.id+"] unknown chapter "+cl.chapter);fails++;return;}
  const txt=strip((C[cl.chapter]||{}).html||"");
  if(txt.indexOf(norm(cl.basis))===-1){console.log("  FAIL ["+cl.id+"] basis not in "+cl.chapter+': "'+cl.basis+'"');fails++;return;}
  if((cl.answers||[]).map(norm).indexOf(norm(cl.basis))===-1){console.log("  FAIL ["+cl.id+"] basis not among accepted answers");fails++;return;}
  ok++;
});
console.log("Seeker clues: "+bank.clues.length+" | grounded + answerable: "+ok+" | failures: "+fails);
if(fails){process.exit(1);}
console.log("VERIFY OK — every answer is findable in the chapter it points to.");
