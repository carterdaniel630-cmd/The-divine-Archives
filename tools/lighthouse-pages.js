#!/usr/bin/env node
/* ==========================================================================
   lighthouse-pages.js — Lighthouse (mobile, performance only) on the pages in
   tools/perf-pages.json, against one or more locally served builds.

   Each page is run --runs times per build and the run with the median
   performance score is kept. With two builds the runs alternate between them,
   page by page, so both see the same machine conditions; the comparison then
   fails if any page's mobile score drops by more than --max-drop points.

   Usage:
     node tools/lighthouse-pages.js --target pr=http://localhost:8082 [--target base=http://localhost:8081]
          [--runs 3] [--max-drop 5] [--out lh-results.json] [--md lh-report.md] [--only <name substring>]
   Needs the `lighthouse` package (npm i lighthouse) and Chrome/Chromium (CHROME_PATH, or found
   automatically). Exit code 1 when a page drops more than --max-drop against the base build.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const all = (name) => args.flatMap((a, i) => (a === name ? [args[i + 1]] : []));
const one = (name, d) => { const v = all(name); return v.length ? v[v.length - 1] : d; };
const targets = all("--target").map((t) => { const [k, ...u] = t.split("="); return { key: k, url: u.join("=").replace(/\/$/, "") }; });
const RUNS = parseInt(one("--runs", "3"), 10);
const MAX_DROP = parseFloat(one("--max-drop", "5"));
const OUT = one("--out", "lh-results.json");
const MD = one("--md", "lh-report.md");
const ONLY = one("--only", null);
if (!targets.length) { console.error("give at least one --target name=url"); process.exit(2); }

let pages = JSON.parse(fs.readFileSync(path.join(__dirname, "perf-pages.json"), "utf8")).pages;
if (ONLY) pages = pages.filter((p) => p.name.toLowerCase().includes(ONLY.toLowerCase()));

const kb = (b) => Math.round(b / 1024);
function pick(lhr) {
  const a = lhr.audits;
  return {
    score: Math.round((lhr.categories.performance.score || 0) * 100),
    lcpMs: Math.round(a["largest-contentful-paint"].numericValue),
    cls: Math.round(a["cumulative-layout-shift"].numericValue * 1000) / 1000,
    tbtMs: Math.round(a["total-blocking-time"].numericValue),
    bytes: Math.round(a["total-byte-weight"].numericValue),
    requests: (a["network-requests"].details && a["network-requests"].details.items || []).length,
  };
}
const median = (runs) => runs.slice().sort((x, y) => x.score - y.score)[Math.floor(runs.length / 2)];

(async () => {
  const lighthouse = (await import("lighthouse")).default;
  const chromeLauncher = await import("chrome-launcher");
  const chrome = await chromeLauncher.launch({
    chromePath: process.env.CHROME_PATH || undefined,
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu", "--no-proxy-server"],
  });
  const flags = {
    port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["performance"], formFactor: "mobile",
    // Google Fonts is set by FONT_BLOCK=1 when the network cannot reach it (it would hang, not measure)
    blockedUrlPatterns: process.env.FONT_BLOCK === "1" ? ["*fonts.googleapis.com*", "*fonts.gstatic.com*"] : [],
  };
  const results = {};                                   // results[target][pageName] = { median, runs }
  targets.forEach((t) => (results[t.key] = {}));
  try {
    for (const p of pages) {
      const runs = {}; targets.forEach((t) => (runs[t.key] = []));
      for (let r = 0; r < RUNS; r++) {
        for (const t of (r % 2 ? targets.slice().reverse() : targets)) {     // alternate the order each round
          const res = await lighthouse(t.url + p.path, flags);
          runs[t.key].push(pick(res.lhr));
        }
      }
      for (const t of targets) results[t.key][p.name] = { median: median(runs[t.key]), runs: runs[t.key].map((x) => x.score) };
      console.log(p.name.padEnd(42), targets.map((t) => `${t.key} ${results[t.key][p.name].median.score} [${results[t.key][p.name].runs.join(",")}]`).join("  "));
    }
  } finally { await chrome.kill(); }

  fs.writeFileSync(OUT, JSON.stringify({ date: new Date().toISOString(), runs: RUNS, targets, results }, null, 2));

  // ---- report
  const head = targets[targets.length - 1].key, base = targets.length > 1 ? targets[0].key : null;
  let md = `## Lighthouse (mobile, performance)\n\nMedian of ${RUNS} run(s) per page. LCP = largest contentful paint, CLS = cumulative layout shift, TBT = total blocking time, weight = bytes transferred.\n\n`;
  md += base ? `| Page | ${base} | ${head} | Change | LCP | CLS | TBT | Weight |\n|---|---|---|---|---|---|---|---|\n`
             : `| Page | Score | LCP | CLS | TBT | Weight | Requests |\n|---|---|---|---|---|---|---|\n`;
  const fails = [];
  for (const p of pages) {
    const h = results[head][p.name].median;
    if (base) {
      const b = results[base][p.name].median, d = h.score - b.score;
      if (d < -MAX_DROP) fails.push(`${p.name}: ${b.score} → ${h.score}`);
      md += `| ${p.name} | ${b.score} | ${h.score} | ${d > 0 ? "+" : ""}${d}${d < -MAX_DROP ? " ❌" : ""} | ${(h.lcpMs / 1000).toFixed(1)} s | ${h.cls} | ${h.tbtMs} ms | ${kb(h.bytes)} KB |\n`;
    } else {
      md += `| ${p.name} | ${h.score} | ${(h.lcpMs / 1000).toFixed(1)} s | ${h.cls} | ${h.tbtMs} ms | ${kb(h.bytes)} KB | ${h.requests} |\n`;
    }
  }
  if (base) md += fails.length ? `\n**Failed:** mobile performance dropped more than ${MAX_DROP} points on: ${fails.join("; ")}.\n` : `\nNo page dropped more than ${MAX_DROP} points.\n`;
  fs.writeFileSync(MD, md);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
  console.log(fails.length ? "FAIL: " + fails.join("; ") : "ok");
  process.exitCode = fails.length ? 1 : 0;
})().catch((e) => { console.error(e); process.exit(2); });
