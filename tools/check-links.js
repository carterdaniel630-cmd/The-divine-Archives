#!/usr/bin/env node
/* ==========================================================================
   check-links.js — report on every external link a reader can click.

   Collects the external href targets in the built site (every .html page under docs/) and
   the source links in the museum's "Read it in English" panel
   (docs/museum/english.js), checks each URL once, and writes a report. It
   reports; it never edits content.

   Verdicts:
     ok       2xx, or a redirect that ends in 2xx
     broken   404 / 410, or the host does not resolve: the link is dead
     check    everything else a person should look at by hand: 401/403/429
              (many sites refuse automated requests), 5xx, timeouts, TLS errors

   Usage:
     node tools/check-links.js                 check everything, write report
     node tools/check-links.js --list          list the URLs and where they appear, no network
     node tools/check-links.js --only <file>   check just the URLs in <file> (one per line)
   Options: --out <file.md> (default link-report.md), --concurrency N (default 8)
   Exit code: 1 if any link is `broken`, else 0 (so a scheduled run turns red
   and GitHub notifies). `check` results never fail the run.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const OWN_HOSTS = new Set(["getconexto.com", "www.getconexto.com"]);
const UA = "Mozilla/5.0 (compatible; DivineArchivesLinkCheck/1.0; +https://getconexto.com/methodology.html)";
const TIMEOUT_MS = 20000;

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const LIST_ONLY = args.includes("--list");
const OUT = opt("--out", "link-report.md");
const CONCURRENCY = Math.max(1, parseInt(opt("--concurrency", "8"), 10) || 8);
const ONLY = opt("--only", null);

// ---------------------------------------------------------------- collect
function walk(dir, out) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { if (f !== "vendor") walk(p, out); }
    else if (f.endsWith(".html")) out.push(p);
  }
  return out;
}
function decode(u) {
  return u.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
}
function collect() {
  const where = new Map();                                  // url -> Set(page)
  const add = (u, page) => {
    let host;
    try { host = new URL(u).host; } catch { return; }
    if (OWN_HOSTS.has(host)) return;
    if (!where.has(u)) where.set(u, new Set());
    where.get(u).add(page);
  };
  for (const f of walk(DOCS, [])) {
    const rel = path.relative(DOCS, f);
    const html = fs.readFileSync(f, "utf8");
    for (const m of html.matchAll(/<a\b[^>]*\bhref="(https?:\/\/[^"]+)"/g)) add(decode(m[1]), rel);
  }
  const eng = path.join(DOCS, "museum", "english.js");
  if (fs.existsSync(eng)) {
    const src = fs.readFileSync(eng, "utf8");
    for (const m of src.matchAll(/"(https?:\/\/[^"]+)"/g)) add(m[1], "museum/english.js");
  }
  return where;
}

// ---------------------------------------------------------------- check
async function request(url, method) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, { method, redirect: "follow", signal: ctl.signal,
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,application/pdf,*/*;q=0.8" } });
    if (method === "GET" && r.body) r.body.cancel().catch(() => {});
    return { status: r.status, finalUrl: r.url };
  } finally { clearTimeout(t); }
}
function classify(res) {
  if (res.error) {
    return res.code === "ENOTFOUND" ? "broken" : "check";      // no such host; anything else may be transient
  }
  if (res.status >= 200 && res.status < 300) return "ok";
  if (res.status === 404 || res.status === 410) return "broken";
  return "check";
}
async function checkOne(url) {
  let res;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // HEAD first (cheap); many servers mishandle HEAD, so fall back to GET
      res = await request(url, "HEAD");
      if (res.status >= 400 || res.status === 0) res = await request(url, "GET");
    } catch (e) {
      const cause = e.cause || {};
      res = { error: e.name === "AbortError" ? "timeout" : (cause.code || e.message), code: cause.code || "" };
    }
    // retry once on a transient failure
    if (res.error || res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 3000)); continue; }
    break;
  }
  return { url, ...res, verdict: classify(res) };
}
async function pool(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k]); }
  }));
  return out;
}
// Space out requests to one host so no site is hammered: at most one in flight per host.
function byHostQueue(urls) {
  const hosts = new Map();
  for (const u of urls) { const h = new URL(u).host; if (!hosts.has(h)) hosts.set(h, []); hosts.get(h).push(u); }
  return [...hosts.values()];
}

// ---------------------------------------------------------------- report
function report(results, where) {
  const by = { broken: [], check: [], ok: [] };
  results.forEach((r) => by[r.verdict].push(r));
  const pages = (u) => [...where.get(u)].sort().slice(0, 6).join(", ") + (where.get(u).size > 6 ? `, … (${where.get(u).size} pages)` : "");
  const what = (r) => r.error ? r.error : String(r.status) + (r.finalUrl && r.finalUrl !== r.url ? ` → ${r.finalUrl}` : "");
  let md = `# External link report\n\n` +
    `Checked ${results.length} unique external links on ${new Date().toISOString().slice(0, 10)}: ` +
    `**${by.broken.length} broken**, **${by.check.length} to check by hand**, ${by.ok.length} ok.\n\n` +
    `- **broken**: 404/410 or the host no longer exists. Fix or replace these.\n` +
    `- **check**: the server refused or failed (401/403/429, 5xx, timeout). Often a site blocking automated checks, not a dead link; open it in a browser.\n\n`;
  for (const k of ["broken", "check"]) {
    if (!by[k].length) continue;
    md += `## ${k === "broken" ? "Broken" : "Check by hand"} (${by[k].length})\n\n| Link | Result | Linked from |\n|---|---|---|\n`;
    for (const r of by[k].sort((a, b) => a.url.localeCompare(b.url)))
      md += `| ${r.url.replace(/\|/g, "%7C")} | ${what(r).replace(/\|/g, "/")} | ${pages(r.url)} |\n`;
    md += "\n";
  }
  return { md, by };
}

(async () => {
  const where = collect();
  let urls = [...where.keys()].sort();
  if (ONLY) {
    const want = fs.readFileSync(ONLY, "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
    want.forEach((u) => { if (!where.has(u)) where.set(u, new Set(["(--only list)"])); });
    urls = want;
  }
  if (LIST_ONLY) {
    for (const u of urls) console.log(u + "\t" + [...where.get(u)].sort().join(" "));
    console.error(`${urls.length} unique external links`);
    return;
  }
  console.log(`checking ${urls.length} unique external links (concurrency ${CONCURRENCY}, one request at a time per host)…`);
  const queues = byHostQueue(urls);
  const nested = await pool(queues, CONCURRENCY, async (q) => { const out = []; for (const u of q) out.push(await checkOne(u)); return out; });
  const results = nested.flat();
  const { md, by } = report(results, where);
  fs.writeFileSync(OUT, md);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
  console.log(`broken ${by.broken.length} · check ${by.check.length} · ok ${by.ok.length} — report in ${OUT}`);
  process.exitCode = by.broken.length ? 1 : 0;
})();
