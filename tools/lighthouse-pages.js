#!/usr/bin/env node
/* ==========================================================================
   lighthouse-pages.js — Lighthouse (mobile, performance only) on the pages in
   tools/perf-pages.json, against one or more locally served builds.

   Each page is run --runs times per build and the run with the median
   performance score is kept. With two builds the runs alternate between them,
   page by page, so both see the same machine conditions. A page whose median
   drops by more than --max-drop points is re-measured with --confirm more runs
   per build (default 6), and the comparison fails only if the drop holds over
   all its runs: single runs of the same page can differ by 10 points.
   "Holds" means two things together (see judge() below): the median of all its
   runs drops by more than --max-drop, AND the head's runs are lower than the
   base's beyond chance (exact one-sided Mann-Whitney rank test, p < 0.05). The
   CI runner is noisy: the same page can score 71, 81, 94 and 99 in one job, on
   base as on the pull request, so a median of 9 (or its upper quartile, tried
   first on PR #137) can still move by 7-10 points by chance alone. A real
   regression ranks the head's runs consistently below the base's.
   With fewer than 6 runs a side (no confirm round) the test cannot reach
   p < 0.05, so the plain median rule applies.

   Usage:
     node tools/lighthouse-pages.js --target pr=http://localhost:8082 [--target base=http://localhost:8081]
          [--runs 3] [--max-drop 5] [--confirm 6] [--out lh-results.json] [--md lh-report.md] [--only <name substring>]
   Needs the `lighthouse` package (npm i lighthouse) and Chrome/Chromium (CHROME_PATH, or found
   automatically). Exit code 1 when a page drops more than --max-drop against the base build
   (median drop and rank test both; see above). `require`d as a module it only exports judge(), quantile() and rankTestP().
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

const median = (runs) => runs.slice().sort((x, y) => x.score - y.score)[Math.floor(runs.length / 2)];
// Score at quantile q of a list of scores (nearest rank, lower side): q=0.5 is the median used above.
const quantile = (scores, q) => { const s = scores.slice().sort((a, b) => a - b); return s[Math.floor((s.length - 1) * q)]; };
// Exact one-sided Mann-Whitney test: the chance, if both builds scored alike, that the head's runs would
// rank at least this low against the base's. Ties share ranks; every way of splitting the pooled runs is
// counted (9 + 9 runs = 48,620 splits, a few milliseconds).
function rankTestP(baseScores, headScores) {
  const all = baseScores.concat(headScores), n = all.length, k = headScores.length;
  const order = all.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]), rank = new Array(n);
  for (let i = 0; i < n;) { let j = i; while (j + 1 < n && order[j + 1][0] === order[i][0]) j++; for (let t = i; t <= j; t++) rank[order[t][1]] = (i + j) / 2 + 1; i = j + 1; }
  const observed = rank.slice(baseScores.length).reduce((x, y) => x + y, 0);
  let atMost = 0, total = 0;
  (function pick(from, left, sum) {
    if (!left) { total++; if (sum <= observed + 1e-9) atMost++; return; }
    for (let i = from; i <= n - left; i++) pick(i + 1, left - 1, sum + rank[i]);
  })(0, k, 0);
  return atMost / total;
}
// The gate's verdict for one page, from the score lists of the two builds. With 6+ runs a side the median
// must drop more than maxDrop AND the rank test must find the head lower (p < 0.05); with fewer, the median alone.
const MIN_RUNS_FOR_TEST = 6, ALPHA = 0.05;
function judge(baseScores, headScores, maxDrop) {
  const medianDrop = quantile(baseScores, 0.5) - quantile(headScores, 0.5);
  const tested = Math.min(baseScores.length, headScores.length) >= MIN_RUNS_FOR_TEST;
  const p = tested && medianDrop > maxDrop ? rankTestP(baseScores, headScores) : null;
  return { medianDrop, p, fail: medianDrop > maxDrop && (!tested || p < ALPHA) };
}
module.exports = { judge, quantile, rankTestP };
if (require.main !== module) return;


const args = process.argv.slice(2);
const all = (name) => args.flatMap((a, i) => (a === name ? [args[i + 1]] : []));
const one = (name, d) => { const v = all(name); return v.length ? v[v.length - 1] : d; };
const targets = all("--target").map((t) => { const [k, ...u] = t.split("="); return { key: k, url: u.join("=").replace(/\/$/, "") }; });
const RUNS = parseInt(one("--runs", "3"), 10);
const MAX_DROP = parseFloat(one("--max-drop", "5"));
const CONFIRM = parseInt(one("--confirm", "6"), 10);   // extra runs per build for a page that seems to drop
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
      const round = async (n, from) => {
        for (let r = from; r < from + n; r++) {
          for (const t of (r % 2 ? targets.slice().reverse() : targets)) {   // alternate the order each round
            const res = await lighthouse(t.url + p.path, flags);
            runs[t.key].push(pick(res.lhr));
          }
        }
      };
      await round(RUNS, 0);
      // Confirm a drop before believing it: a noisy page's median of 3 can swing more than
      // --max-drop by chance, while a real regression survives more runs. Re-measure only
      // the pages that look worse, and judge on all their runs (median drop and rank test, judge()).
      if (targets.length > 1 && CONFIRM > 0) {
        const b = median(runs[targets[0].key]).score, h = median(runs[targets[targets.length - 1].key]).score;
        if (b - h > MAX_DROP) { console.log(`  ${p.name}: ${b} → ${h}, confirming with ${CONFIRM} more runs each…`); await round(CONFIRM, RUNS); }
      }
      for (const t of targets) results[t.key][p.name] = { median: median(runs[t.key]), runs: runs[t.key].map((x) => x.score) };
      console.log(p.name.padEnd(42), targets.map((t) => `${t.key} ${results[t.key][p.name].median.score} [${results[t.key][p.name].runs.join(",")}]`).join("  "));
    }
  } finally { await chrome.kill(); }

  fs.writeFileSync(OUT, JSON.stringify({ date: new Date().toISOString(), runs: RUNS, targets, results }, null, 2));

  // ---- report
  const head = targets[targets.length - 1].key, base = targets.length > 1 ? targets[0].key : null;
  let md = `## Lighthouse (mobile, performance)\n\nMedian of ${RUNS} run(s) per page (${CONFIRM} more for a page that seemed to drop). A page fails only when its median drops more than ${MAX_DROP} points AND a rank test over all its runs finds it slower beyond chance (p < 0.05); a median drop the test puts down to chance is shown as noise. LCP = largest contentful paint, CLS = cumulative layout shift, TBT = total blocking time, weight = bytes transferred.\n\n`;
  md += base ? `| Page | ${base} | ${head} | Change | LCP | CLS | TBT | Weight |\n|---|---|---|---|---|---|---|---|\n`
             : `| Page | Score | LCP | CLS | TBT | Weight | Requests |\n|---|---|---|---|---|---|---|\n`;
  const fails = [];
  let noise = 0;
  for (const p of pages) {
    const h = results[head][p.name].median;
    if (base) {
      const b = results[base][p.name].median, d = h.score - b.score;
      const v = judge(results[base][p.name].runs, results[head][p.name].runs, MAX_DROP);
      if (v.fail) fails.push(`${p.name}: ${b.score} → ${h.score}`);
      if (!v.fail && d < -MAX_DROP) noise++;
      const mark = v.fail ? " ❌" : d < -MAX_DROP ? ` (noise: p = ${v.p === null ? "n/a" : v.p.toFixed(2)})` : "";
      md += `| ${p.name} | ${b.score} | ${h.score} | ${d > 0 ? "+" : ""}${d}${mark} | ${(h.lcpMs / 1000).toFixed(1)} s | ${h.cls} | ${h.tbtMs} ms | ${kb(h.bytes)} KB |\n`;
    } else {
      md += `| ${p.name} | ${h.score} | ${(h.lcpMs / 1000).toFixed(1)} s | ${h.cls} | ${h.tbtMs} ms | ${kb(h.bytes)} KB | ${h.requests} |\n`;
    }
  }
  if (base) md += fails.length ? `\n**Failed:** mobile performance dropped more than ${MAX_DROP} points on: ${fails.join("; ")}.\n` : `\nNo page failed the gate (median down more than ${MAX_DROP} points and slower beyond chance).${noise ? ' Rows marked "noise" had a median drop that the rank test put down to chance.' : ""}\n`;
  fs.writeFileSync(MD, md);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
  console.log(fails.length ? "FAIL: " + fails.join("; ") : "ok");
  process.exitCode = fails.length ? 1 : 0;
})().catch((e) => { console.error(e); process.exit(2); });
