#!/usr/bin/env node
/* Builds the originality baseline: for each URL the archive cites, fetch the page
   once and keep its hashed word 8-grams in sources/baseline/shingles/<key>.txt.
   No page text is stored. URLs already in the baseline are skipped, so CI can
   cache the folder and only fetch what is new.

   Every URL that cannot be fetched is listed in sources/baseline/_report.json
   and printed, with the reason. Nothing fails silently: the check later marks
   any piece whose sources are missing as UNVERIFIED.

   Usage:
     node tools/build-originality-baseline.js --all                 every URL in the citation logs and chapters
     node tools/build-originality-baseline.js <file.md> [...]       only the URLs these pieces cite
   Options: --concurrency 12  --timeout 15000  --retry-failed */
"use strict";
const fs = require("fs");
const path = require("path");
const L = require("./originality-lib.js");

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const CONC = +opt("--concurrency", 12);
const TIMEOUT = +opt("--timeout", 15000);
const MAX_BYTES = 5 * 1024 * 1024;
const files = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && ["--concurrency", "--timeout"].includes(args[i - 1])));

function contentFiles() {
  const out = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith(".md")) out.push(p); } };
  for (const d of ["eras", "themes", "vault"]) if (fs.existsSync(path.join(L.ROOT, d))) walk(path.join(L.ROOT, d));
  return out.sort();
}

let urls = new Set();
if (args.includes("--all")) {
  for (const f of contentFiles()) for (const u of L.citedUrls(f)) urls.add(u);
  const src = path.join(L.ROOT, "sources");
  for (const f of fs.readdirSync(src).filter((f) => f.endsWith(".md"))) for (const m of fs.readFileSync(path.join(src, f), "utf8").matchAll(/https?:\/\/[^\s)<>\]"'`]+/g)) urls.add(m[0].replace(/[.,;:]+$/, ""));
} else if (files.length) {
  for (const f of files) for (const u of L.citedUrls(path.resolve(f))) urls.add(u);
} else {
  console.error("usage: node tools/build-originality-baseline.js --all | <file.md> [...]");
  process.exit(2);
}
urls = [...urls].sort();

fs.mkdirSync(L.SHINGLES, { recursive: true });
const reportPath = path.join(L.BASE, "_report.json");
const prev = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, "utf8")) : { failed: {} };
const failed = Object.assign({}, prev.failed || {});
const retryFailed = args.includes("--retry-failed");

async function fetchOne(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { signal: ctl.signal, redirect: "follow", headers: { "user-agent": "DivineArchives-originality-check/1 (+https://getconexto.com/about.html)", accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5" } });
    if (!res.ok) return { error: "HTTP " + res.status };
    const type = res.headers.get("content-type") || "";
    if (/pdf|image|audio|video|zip|octet-stream/i.test(type)) return { error: "not a web page (" + type.split(";")[0] + ")" };
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_BYTES) return { error: "page larger than 5 MB" };
    const text = /html|xml/i.test(type) || /^\s*</.test(buf.slice(0, 200).toString()) ? L.htmlToText(buf.toString("utf8")) : buf.toString("utf8");
    const sh = L.shingles(text);
    if (sh.size < 20) return { error: "almost no text (script-rendered page, paywall or block page?)" };
    return { shingles: sh };
  } catch (e) {
    return { error: e.name === "AbortError" ? "timed out after " + TIMEOUT + " ms" : (e.cause && e.cause.code) || e.message };
  } finally { clearTimeout(t); }
}

(async () => {
  const todo = urls.filter((u) => !fs.existsSync(path.join(L.SHINGLES, L.urlKey(u) + ".txt")) && (retryFailed || !failed[u] || failed[u].tries < 2));
  let done = 0, ok = 0;
  const queue = todo.slice();
  async function worker() {
    while (queue.length) {
      const url = queue.shift();
      const r = await fetchOne(url);
      if (r.shingles) {
        fs.writeFileSync(path.join(L.SHINGLES, L.urlKey(url) + ".txt"), "# " + url + "\n" + [...r.shingles].sort().join("\n") + "\n");
        delete failed[url]; ok++;
      } else {
        failed[url] = { reason: r.error, tries: ((failed[url] && failed[url].tries) || 0) + 1 };
      }
      if (++done % 100 === 0) console.log("  " + done + " / " + todo.length);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONC, todo.length) }, worker));

  const have = urls.filter((u) => fs.existsSync(path.join(L.SHINGLES, L.urlKey(u) + ".txt")));
  const missing = urls.filter((u) => !have.includes(u));
  const report = {
    note: "Written by tools/build-originality-baseline.js. 'failed' lists every cited URL that could not be fetched, with the reason; pieces citing them are reported UNVERIFIED for those sources.",
    urls: urls.length,
    in_baseline: have.length,
    fetched_this_run: ok,
    not_fetched: missing.length,
    failed: Object.fromEntries(Object.entries(failed).filter(([u]) => missing.includes(u)).sort())
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 1) + "\n");
  console.log("baseline: " + have.length + " of " + urls.length + " cited URLs (" + ok + " fetched this run, " + missing.length + " not fetched)");
  const reasons = {};
  for (const u of missing) { const r = (failed[u] && failed[u].reason) || "skipped (failed twice before; use --retry-failed)"; reasons[r] = (reasons[r] || 0) + 1; }
  for (const [r, n] of Object.entries(reasons).sort((a, b) => b[1] - a[1])) console.log("  not fetched, " + r + ": " + n);
  if (process.env.GITHUB_ACTIONS && missing.length) console.log("::warning title=Originality baseline incomplete::" + missing.length + " of " + urls.length + " cited pages could not be fetched; see the run summary and sources/baseline/_report.json in the artifact.");
})();
