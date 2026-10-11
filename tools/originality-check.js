#!/usr/bin/env node
/* Originality check: how much of a piece's own prose repeats, word for word, the
   pages it cites. It counts word 8-grams (runs of eight words) in the piece that
   also occur in the baseline of its cited pages (tools/build-originality-baseline.js).
   A piece fails when more than 20% of its 8-grams are found there.

   Exempt: the Sources / References section, blockquotes that carry a citation, and
   inline quotations whose sentence carries a citation (see prose() in
   tools/originality-lib.js). Quoting with a citation is the right way to use a source.

   It never passes silently: a piece whose cited pages are missing from the baseline
   is reported UNVERIFIED (all missing) or PARTIAL (some missing), with the list.
   This catches copying only. It says nothing about accuracy; that stays with the
   reviewer (reviews/ORIGINALITY.md).

   Usage:
     node tools/originality-check.js <file.md> [...]
     node tools/originality-check.js --changed [--base origin/main]   content files changed on this branch
     node tools/originality-check.js --all                            every chapter, theme and Vault entry
   Options: --max 20 (percent)  --strict (UNVERIFIED also fails)  --json out.json */
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const L = require("./originality-lib.js");

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const MAX = +opt("--max", 20);
const STRICT = args.includes("--strict");
const CONTENT = /^(eras|themes|vault)\/.+\.md$/;

function listAll() {
  const out = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith(".md")) out.push(p); } };
  for (const d of ["eras", "themes", "vault"]) if (fs.existsSync(path.join(L.ROOT, d))) walk(path.join(L.ROOT, d));
  return out.sort();
}

let files;
if (args.includes("--all")) files = listAll();
else if (args.includes("--changed")) {
  const base = opt("--base", "origin/main");
  const out = execFileSync("git", ["diff", "--name-only", "--diff-filter=AMR", base + "...HEAD"], { cwd: L.ROOT, encoding: "utf8" });
  files = out.split("\n").filter((f) => CONTENT.test(f)).map((f) => path.join(L.ROOT, f));
} else {
  const skip = new Set(["--max", "--json", "--base"]);
  files = args.filter((a, i) => !a.startsWith("--") && !skip.has(args[i - 1])).map((f) => path.resolve(f));
}
files = files.filter((f) => fs.existsSync(f));

const results = [];
for (const file of files) {
  const md = fs.readFileSync(file, "utf8");
  const { text, exempt } = L.prose(md);
  const mine = L.shingles(text);
  const urls = L.citedUrls(file);
  const checked = [], missing = [];
  const union = new Set();
  let worst = { url: null, pct: 0 };
  for (const u of urls) {
    const s = L.loadShingles(u);
    if (!s) { missing.push(u); continue; }
    checked.push(u);
    let hit = 0;
    for (const h of mine) if (s.has(h)) { hit++; union.add(h); }
    const pct = mine.size ? (100 * hit) / mine.size : 0;
    if (pct > worst.pct) worst = { url: u, pct };
  }
  const pct = mine.size ? (100 * union.size) / mine.size : 0;
  let status;
  if (pct > MAX) status = "FAIL";
  else if (!urls.length) status = "UNVERIFIED";        // cites nothing the check can compare against
  else if (!checked.length) status = "UNVERIFIED";
  else if (missing.length) status = "PARTIAL";
  else status = "PASS";
  results.push({ file: path.relative(L.ROOT, file), status, overlap_pct: +pct.toFixed(2), ngrams: mine.size, cited: urls.length, checked: checked.length, missing, worst: worst.url ? { url: worst.url, pct: +worst.pct.toFixed(2) } : null, exempt });
}

const fails = results.filter((r) => r.status === "FAIL");
const unverified = results.filter((r) => r.status === "UNVERIFIED");
const partial = results.filter((r) => r.status === "PARTIAL");
const gh = !!process.env.GITHUB_ACTIONS;

for (const r of results) {
  const line = r.status.padEnd(10) + " " + r.file + "  overlap " + r.overlap_pct + "% of " + r.ngrams + " 8-grams; sources checked " + r.checked + "/" + r.cited +
    (r.worst ? "; closest " + r.worst.pct + "% " + r.worst.url : "");
  console.log(line);
  if (gh && r.status === "FAIL") console.log("::error file=" + r.file + ",title=Originality::" + r.overlap_pct + "% of this piece's 8-grams repeat its cited pages (limit " + MAX + "%). Closest: " + (r.worst && r.worst.url));
  if (gh && r.status === "UNVERIFIED") console.log("::warning file=" + r.file + ",title=Originality UNVERIFIED::None of the " + r.cited + " cited pages is in the baseline, so copying could not be checked.");
  if (gh && r.status === "PARTIAL") console.log("::warning file=" + r.file + ",title=Originality PARTIAL::" + r.missing.length + " of " + r.cited + " cited pages are not in the baseline.");
}
const summary = files.length
  ? results.length + " checked: " + (results.length - fails.length - unverified.length - partial.length) + " pass, " + partial.length + " partial, " + unverified.length + " unverified, " + fails.length + " fail (limit " + MAX + "%)"
  : "no chapter, theme or Vault markdown to check";
console.log(summary);

if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = results.map((r) => "| " + r.status + " | `" + r.file + "` | " + r.overlap_pct + "% | " + r.checked + " / " + r.cited + " | " + (r.worst ? r.worst.pct + "% " + r.worst.url : "") + " |");
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, "## Originality check\n\n" + summary + "\n\n" +
    (rows.length ? "| Result | File | Overlap | Sources checked | Closest source |\n|---|---|---|---|---|\n" + rows.join("\n") + "\n\n" : "") +
    "This check catches copying only (word-for-word runs of 8 words). It does not check accuracy.\n");
}
const jsonOut = opt("--json", null);
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ max_pct: MAX, summary, results }, null, 1) + "\n");

process.exit(fails.length || (STRICT && unverified.length) ? 1 : 0);
