#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — automatic review checks (the reviewer's step 1)

   The code half of the review in plans/reviewer-agent.md §1a: checks that give
   the same answer every time, so the AI reviewer never has to judge them. It
   reports; it never edits content (except that --build leaves the rebuilt
   output in the working tree, which is exactly what should have been committed).

   Checks
     internal-links   every href/src in docs/<every>.html resolves to a file in docs/
                      (external, mailto:, data:, javascript: and #anchor-only links are
                      skipped; links to the site's own domain are resolved locally)
     garbled-links    no href="<…" and no <a> nested inside another <a> (finding B, 2026-09-29)
     file-size        no file in docs/ over 2 MB (the largest 10 are always printed)
     sitemap          every indexable docs/<every>.html is in sitemap.xml, nothing in the
                      sitemap is noindex or missing; the base URL comes from the sitemap
     pending-banner   every published chapter / Vault entry marked `pending: true` shows the
                      visible pending banner on its built page, and no cleared one still does
     pending-diff     every chapter, Vault entry or Pantheon figure ADDED or CHANGED since
                      --base is `pending: true`, unless the same change adds a clearance
                      for it to reviews/cleared.json (Carter's append-only log)
     wikipedia-share  share of unique URLs that are Wikipedia, per changed sources/*.md;
                      over 20% is a warning, never a failure
     build            (--build only; slow) runs the CLAUDE.md build steps in order, then
                      fails if anything differs from what is committed

   Usage
     node tools/review-checks.js                    all checks except build
     node tools/review-checks.js --build            ...plus the build-matches-committed check
     node tools/review-checks.js --base origin/main diff base for pending-diff and
                                                    wikipedia-share (default origin/main;
                                                    compared from the merge-base, like a PR)
     node tools/review-checks.js --changed-only     links, garbled links and file size look
                                                    only at docs/ files changed since --base
     node tools/review-checks.js --json out.json    also write a machine-readable result
     node tools/review-checks.js --only build       run just the named checks (comma-separated
                                                    ids from the list above; naming build runs it)

   Exit code: 1 if any check FAILS. WARN never fails the run.

   Planted-error marker: the review-test batches (reviews/AUDITOR.md) tag every planted
   error with the string in PLANTED_MARKER below. The `guard` job in
   .github/workflows/review.yml fails any PR to main that adds it.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");
const { execFileSync, spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const PLANTED_MARKER = "REVIEW-TEST-PLANTED";
const SIZE_LIMIT = 2 * 1024 * 1024;
const WIKI_WARN = 0.20;
const CLEARED_FILE = "reviews/cleared.json";

// The build order from CLAUDE.md "Build & deploy". Keep in step with it.
const BUILD_STEPS = [
  "tools/stamp-dates.js",
  "tools/build-og.js",
  "tools/build-vault.js",
  "tools/build-chapters.js",
  "tools/build-pages.js",
  "tools/build-museum.js",
  "tools/build-sky.js"
];

// ---------------------------------------------------------------- options
const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : dflt; };
const BASE = opt("--base", "origin/main");
const CHANGED_ONLY = args.includes("--changed-only");
const DO_BUILD = args.includes("--build");
const JSON_OUT = opt("--json", null);
const ONLY = opt("--only", null) ? new Set(opt("--only").split(",").map((s) => s.trim()).filter(Boolean)) : null;
if (args.includes("--help") || args.includes("-h")) {
  console.log(fs.readFileSync(__filename, "utf8").split("*/")[0]);
  process.exit(0);
}

// ---------------------------------------------------------------- helpers
function git(argv, opts = {}) {
  return execFileSync("git", argv, { cwd: ROOT, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"], ...opts });
}
function tryGit(argv) { try { return git(argv); } catch { return null; } }
function rel(p) { return path.relative(ROOT, p).split(path.sep).join("/"); }
function walk(dir, out = [], filter = () => true) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out, filter);
    else if (filter(p)) out.push(p);
  }
  return out;
}
function htmlFiles() { return walk(DOCS, [], (p) => p.endsWith(".html")); }
function lineOf(text, index) { let n = 1; for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) n++; return n; }
// Blank out script bodies and comments (keeping offsets, so line numbers stay right):
// links built by inline JavaScript are not links in the page.
function stripScripts(html) {
  const blank = (s) => s.replace(/[^\n]/g, " ");
  return html
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi, (m, a, b, c) => a + blank(b) + c)
    .replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (m, a, b, c) => a + blank(b) + c);
}
// Evaluate one of the site's data files (window.X = …) and return its window.
function loadData(source) {
  const noop = { textContent: "", appendChild() {}, setAttribute() {}, style: {} };
  const ctx = { window: {}, document: { createElement: () => noop, querySelectorAll: () => [], addEventListener() {}, head: noop, documentElement: noop, body: noop }, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx);
  vm.runInContext(source, ctx, { timeout: 10000 });
  return ctx.window;
}
function readHead(p) { const f = path.join(ROOT, p); return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null; }
function readAt(ref, p) { return tryGit(["show", ref + ":" + p]); }
function sha(s) { return crypto.createHash("sha1").update(s).digest("hex"); }
const stable = (o) => JSON.stringify(o, Object.keys(o).sort());

// ---------------------------------------------------------------- diff base
let mergeBase = null, baseNote = "";
let changed = null;                        // Set of repo-relative paths changed since the merge-base
(function resolveBase() {
  if (!tryGit(["rev-parse", "--verify", "--quiet", BASE + "^{commit}"])) {
    baseNote = `base ref "${BASE}" not found (fetch it, or pass --base <ref>)`;
    return;
  }
  mergeBase = (tryGit(["merge-base", BASE, "HEAD"]) || "").trim() || null;
  if (!mergeBase) { baseNote = `no merge-base between ${BASE} and HEAD`; return; }
  const files = new Set();
  // committed + uncommitted changes against the merge-base, plus untracked files
  for (const l of (tryGit(["diff", "--name-only", "--no-renames", mergeBase]) || "").split("\n")) if (l) files.add(l);
  for (const l of (tryGit(["ls-files", "--others", "--exclude-standard"]) || "").split("\n")) if (l) files.add(l);
  changed = files;
})();
if (CHANGED_ONLY && !changed) { console.error("review-checks: --changed-only needs a diff base: " + baseNote); process.exit(2); }
const changedDocs = changed ? [...changed].filter((f) => f.startsWith("docs/") && fs.existsSync(path.join(ROOT, f))) : [];

// ---------------------------------------------------------------- sitemap base
function sitemapLocs() {
  const sm = readHead("docs/sitemap.xml");
  if (!sm) return { base: null, locs: [] };
  const locs = [...sm.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
  let base = null;
  if (locs.length) { try { const u = new URL(locs[0]); base = u.origin + "/"; } catch {} }
  return { base, locs };
}
const SM = sitemapLocs();
const OWN_ORIGINS = new Set();
if (SM.base) {
  const u = new URL(SM.base);
  OWN_ORIGINS.add(u.origin);
  OWN_ORIGINS.add(u.protocol + "//" + (u.host.startsWith("www.") ? u.host.slice(4) : "www." + u.host));
}

// ================================================================ checks
const results = [];
function record(id, name, status, summary, details = [], extra = {}) {
  results.push({ id, name, status, summary, details, ...extra });
}

// ---- internal links --------------------------------------------------------
function resolveTarget(fromFile, raw) {
  let v = raw.trim().replace(/&amp;/g, "&");
  if (!v || v.startsWith("#")) return { skip: true };
  if (/[${}]|'\s*\+|\+\s*'/.test(v)) return { skip: true };           // template fragments
  let fromRoot = false;
  if (/^https?:\/\//i.test(v)) {
    let u; try { u = new URL(v); } catch { return { skip: true }; }
    if (!OWN_ORIGINS.has(u.origin)) return { skip: true };               // external
    v = u.pathname; fromRoot = true;
  } else if (/^\/\//.test(v) || /^[a-z][a-z0-9+.-]*:/i.test(v)) {
    return { skip: true };                                               // mailto:, data:, tel:, javascript: …
  }
  v = v.replace(/[?#].*$/, "");
  if (!v) return { skip: true };
  try { v = decodeURI(v); } catch {}
  let target;
  if (fromRoot || v.startsWith("/")) target = path.join(DOCS, v.replace(/^\/+/, ""));
  else target = path.resolve(path.dirname(fromFile), v);
  if (!target.startsWith(DOCS)) return { ok: false, target, why: "points outside docs/" };
  const tries = [target];
  if (v.endsWith("/")) tries.push(path.join(target, "index.html"));
  else { tries.push(path.join(target, "index.html")); if (!path.extname(target)) tries.push(target + ".html"); }
  for (const t of tries) { if (fs.existsSync(t) && fs.statSync(t).isFile()) return { ok: true }; }
  return { ok: false, target };
}
function checkInternalLinks() {
  const files = CHANGED_ONLY ? changedDocs.filter((f) => f.endsWith(".html")).map((f) => path.join(ROOT, f)) : htmlFiles();
  const broken = [];
  let count = 0;
  for (const f of files) {
    const html = stripScripts(fs.readFileSync(f, "utf8"));
    const re = /<[a-z][a-z0-9-]*\b[^>]*?>/gi;
    let tag;
    while ((tag = re.exec(html))) {
      for (const m of tag[0].matchAll(/\s(href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
        const raw = m[2] !== undefined ? m[2] : m[3];
        const r = resolveTarget(f, raw);
        if (r.skip) continue;
        count++;
        if (!r.ok) broken.push(`${rel(f)}:${lineOf(html, tag.index)}  ${m[1]}="${raw}"` + (r.why ? `  (${r.why})` : ""));
      }
    }
  }
  record("internal-links", "Internal links resolve", broken.length ? "fail" : "pass",
    broken.length ? `${broken.length} broken of ${count} internal links in ${files.length} pages` : `${count} internal links in ${files.length} pages, all resolve`,
    broken);
}

// ---- garbled links ---------------------------------------------------------
function checkGarbled() {
  const files = CHANGED_ONLY ? changedDocs.filter((f) => f.endsWith(".html")).map((f) => path.join(ROOT, f)) : htmlFiles();
  const bad = [];
  for (const f of files) {
    const raw = fs.readFileSync(f, "utf8");
    const html = stripScripts(raw);
    for (const m of html.matchAll(/href\s*=\s*["']\s*</gi)) bad.push(`${rel(f)}:${lineOf(html, m.index)}  href="<…" (markup inside a link target)`);
    let depth = 0;
    for (const m of html.matchAll(/<a\b[^>]*>|<\/a\s*>/gi)) {
      if (m[0][1] === "/") { depth = Math.max(0, depth - 1); continue; }
      depth++;
      if (depth > 1) bad.push(`${rel(f)}:${lineOf(html, m.index)}  <a> nested inside another <a>`);
    }
  }
  record("garbled-links", "No garbled source links", bad.length ? "fail" : "pass",
    bad.length ? `${bad.length} garbled link(s) in ${files.length} pages` : `${files.length} pages clean`, bad);
}

// ---- file sizes ------------------------------------------------------------
function checkSizes() {
  const all = walk(DOCS).map((p) => ({ p: rel(p), size: fs.statSync(p).size }));
  const scope = CHANGED_ONLY ? all.filter((x) => changed.has(x.p)) : all;
  const over = scope.filter((x) => x.size > SIZE_LIMIT);
  const largest = all.slice().sort((a, b) => b.size - a.size).slice(0, 10);
  const mb = (n) => (n / 1048576).toFixed(2) + " MB";
  const details = over.map((x) => `OVER LIMIT  ${x.p}  ${mb(x.size)}`)
    .concat(["Largest 10 files in docs/:"], largest.map((x) => `  ${mb(x.size).padStart(9)}  ${x.p}`));
  record("file-size", "Deployed files under 2 MB", over.length ? "fail" : "pass",
    over.length ? `${over.length} file(s) over 2 MB` : `${scope.length} files checked, largest ${mb(largest[0] ? largest[0].size : 0)}`,
    details, { largest });
}

// ---- sitemap ---------------------------------------------------------------
const NOINDEX_RE = /<meta\b(?=[^>]*\bname\s*=\s*["']robots["'])(?=[^>]*\bcontent\s*=\s*["'][^"']*noindex)[^>]*>/i;
// Pages that are deliberately neither in the sitemap nor marked noindex.
const SITEMAP_EXEMPT = new Set(["docs/404.html"]);
function checkSitemap() {
  if (!SM.base) { record("sitemap", "Sitemap coverage", "fail", "docs/sitemap.xml missing or has no <loc> entries"); return; }
  const inMap = new Map();                      // repo path -> loc
  const problems = [];
  for (const loc of SM.locs) {
    if (!loc.startsWith(SM.base)) { problems.push(`sitemap entry outside ${SM.base}: ${loc}`); continue; }
    let p = loc.slice(SM.base.length).replace(/[?#].*$/, "");
    if (p === "" || p.endsWith("/")) p += "index.html";
    else if (!path.extname(p)) p += ".html";
    const repoPath = "docs/" + decodeURI(p);
    inMap.set(repoPath, loc);
    if (!fs.existsSync(path.join(ROOT, repoPath))) problems.push(`in sitemap but no such page: ${loc}`);
  }
  let indexable = 0;
  for (const f of htmlFiles()) {
    const r = rel(f);
    if (SITEMAP_EXEMPT.has(r)) continue;
    const noindex = NOINDEX_RE.test(fs.readFileSync(f, "utf8"));
    if (noindex && inMap.has(r)) problems.push(`noindex page is in the sitemap: ${r}`);
    if (!noindex) { indexable++; if (!inMap.has(r)) problems.push(`indexable page missing from the sitemap: ${r}`); }
  }
  record("sitemap", "Sitemap coverage", problems.length ? "fail" : "pass",
    problems.length ? `${problems.length} problem(s); base ${SM.base}` : `${indexable} indexable pages, all in the sitemap (${SM.locs.length} entries, base ${SM.base}; 404.html exempt)`,
    problems);
}

// ---- content registries ----------------------------------------------------
function registries(read) {
  const out = { chapters: null, vault: null, pantheon: null, bodies: null };
  const d = read("docs/assets/data.js"); if (d) out.chapters = loadData(d).ARCHIVE.chapters;
  const v = read("docs/assets/vault-data.js"); if (v) out.vault = loadData(v).VAULT.items;
  const p = read("docs/assets/pantheon-data.js"); if (p) out.pantheon = loadData(p).PANTHEON.figures;
  const c = read("content/chapters.js"); if (c) out.bodies = loadData(c).CHAPTERS;
  return out;
}
let HEAD_REG = null;
function headReg() { return HEAD_REG || (HEAD_REG = registries(readHead)); }
const BANNER_RE = /class\s*=\s*["'][^"']*\bpending-banner\b/;

function checkPendingBanner() {
  const R = headReg();
  const bad = [];
  let pending = 0;
  const look = (label, id, isPending, page) => {
    const f = path.join(ROOT, page);
    if (!fs.existsSync(f)) { bad.push(`${label} ${id}: built page ${page} is missing`); return; }
    const has = BANNER_RE.test(fs.readFileSync(f, "utf8"));
    if (isPending) { pending++; if (!has) bad.push(`${label} ${id} is pending but ${page} has no pending banner`); }
    else if (has) bad.push(`${label} ${id} is not pending but ${page} still shows the pending banner (rebuild?)`);
  };
  for (const ch of R.chapters || []) if (ch.status === "published") look("chapter", ch.id, !!ch.pending, `docs/chapters/${ch.id}.html`);
  for (const it of R.vault || []) if (it.status === "published") look("vault", it.id, !!it.pending, `docs/vault/${it.slug}.html`);
  record("pending-banner", "Pending items show the banner", bad.length ? "fail" : "pass",
    bad.length ? `${bad.length} mismatch(es)` : `${pending} pending chapter/Vault pages all show the banner; no cleared page shows it`,
    bad.concat(["(The Pantheon has no pending field or banner yet, so Pantheon figures are not checked here.)"]));
}

// reviews/cleared.json is an append-only log of Carter's clearances. An entry is a
// string id ("ch66") or an object ({ "id": "ch66", "date": "2026-10-05", "note": "…" }).
// An entry clears an item only in the change that ADDS it (it is in the file now but
// not at the merge-base), so one clearance never waves through later edits.
function loadCleared(baseRaw) {
  const raw = readHead(CLEARED_FILE);
  const empty = { chapters: new Set(), vault: new Set(), pantheon: new Set() };
  if (!raw) return { cleared: empty, error: `${CLEARED_FILE} not found` };
  const parse = (txt) => { const j = JSON.parse(txt); return { chapters: j.chapters || [], vault: j.vault || [], pantheon: j.pantheon || [] }; };
  let head, base = { chapters: [], vault: [], pantheon: [] };
  try { head = parse(raw); } catch (e) { return { cleared: empty, error: `${CLEARED_FILE} is not valid JSON: ${e.message}` }; }
  try { if (baseRaw) base = parse(baseRaw); } catch {}
  const fresh = (now, before) => {
    const old = new Set((Array.isArray(before) ? before : []).map((x) => JSON.stringify(x)));
    return new Set((Array.isArray(now) ? now : []).filter((x) => !old.has(JSON.stringify(x)))
      .map((x) => (typeof x === "string" ? x : x && x.id)).filter(Boolean));
  };
  return { cleared: { chapters: fresh(head.chapters, base.chapters), vault: fresh(head.vault, base.vault), pantheon: fresh(head.pantheon, base.pantheon) } };
}

// a change confined to an item's source list (citations replaced, claims untouched) does not send a cleared
// chapter back to "pending"; it is reported as a warning instead. Anything else still does.
const noSourcesMd = (t) => String(t || "").replace(/\n## Sources\b[\s\S]*?(?=\n## |$)/, "\n");
const noSourcesHtml = (h) => String(h || "").replace(/<div class="sources">[\s\S]*$/, "");
function checkPendingDiff() {
  if (!changed) { record("pending-diff", "New/changed content is pending", "warn", "skipped: " + baseNote); return; }
  const H = headReg();
  const B = registries((p) => readAt(mergeBase, p));
  const { cleared, error } = loadCleared(readAt(mergeBase, CLEARED_FILE));
  const fails = [], warns = [], seen = [];
  const byId = (list, key = "id") => new Map((list || []).map((x) => [x[key], x]));

  // chapters: record, markdown source, or rendered body changed
  const bc = byId(B.chapters);
  for (const ch of H.chapters || []) {
    if (ch.status !== "published") continue;
    const old = bc.get(ch.id);
    const why = [];
    if (!old) why.push("added");
    else if (stable(old) !== stable(ch)) why.push("listing entry changed");
    if (ch.source && changed.has(ch.source)) why.push("markdown changed");
    const hb = H.bodies && H.bodies[ch.id], ob = B.bodies && B.bodies[ch.id];
    if (hb && (!ob || sha(hb.html || "") !== sha(ob.html || ""))) why.push("body in content/chapters.js changed");
    if (!why.length) continue;
    const line = `chapter ${ch.id} "${ch.title}" (${[...new Set(why)].join(", ")})`;
    seen.push(line);
    if (!ch.pending && !cleared.chapters.has(ch.id)) {
      // sources-only: the listing entry is unchanged, and outside the Sources section neither the markdown nor the body changed
      const mdSame = !ch.source || !changed.has(ch.source) || noSourcesMd(readHead(ch.source)) === noSourcesMd(readAt(mergeBase, ch.source));
      const bodySame = !hb || !ob || noSourcesHtml(hb.html) === noSourcesHtml(ob.html);
      if (old && stable(old) === stable(ch) && mdSame && bodySame) warns.push(line + ": sources only, so it stays cleared (re-check the new sources at review)");
      else fails.push(line + ": not pending and not newly cleared in " + CLEARED_FILE);
    }
  }
  // Vault
  const bv = byId(B.vault);
  for (const it of H.vault || []) {
    if (it.status !== "published") continue;
    const old = bv.get(it.id);
    const why = [];
    if (!old) why.push("added");
    else if (stable(old) !== stable(it)) why.push("registry entry changed");
    if (it.source && changed.has(it.source)) why.push("markdown changed");
    if (!why.length) continue;
    const line = `vault ${it.id} "${it.title}" (${[...new Set(why)].join(", ")})`;
    seen.push(line);
    if (!it.pending && !cleared.vault.has(it.id) && !cleared.vault.has(it.slug)) fails.push(line + ": not pending and not newly cleared in " + CLEARED_FILE);
  }
  // Pantheon: no pending field exists yet, so this half only warns (see the note in the details)
  const bp = byId(B.pantheon);
  for (const fg of H.pantheon || []) {
    const old = bp.get(fg.id);
    if (old && stable(old) === stable(fg)) continue;
    const line = `pantheon ${fg.id} "${fg.n}" (${old ? "changed" : "added"})`;
    seen.push(line);
    if (!fg.pending && !cleared.pantheon.has(fg.id)) warns.push(line + ": not pending and not newly cleared in " + CLEARED_FILE);
  }
  const details = [];
  if (error) details.push("NOTE: " + error);
  details.push(...fails.map((x) => "FAIL " + x), ...warns.map((x) => "WARN " + x));
  if (warns.length) details.push("Pantheon figures have no `pending` field or banner yet, so a changed figure is a warning, not a failure, until Carter decides how Pantheon review is shown.");
  details.push(`Compared with merge-base ${mergeBase.slice(0, 10)} of ${BASE}. Touched items: ${seen.length}`, ...seen.map((s) => "  " + s));
  const status = fails.length || error ? "fail" : warns.length ? "warn" : "pass";
  record("pending-diff", "New/changed content is pending", status,
    fails.length ? `${fails.length} new/changed item(s) not pending` : error ? error
      : warns.length ? `${warns.length} Pantheon figure(s) changed without a pending marker` : `${seen.length} new/changed item(s), all pending or cleared`,
    details);
}

// ---- Wikipedia share -------------------------------------------------------
function checkWikipedia() {
  let files;
  if (changed) files = [...changed].filter((f) => /^sources\/[^/]+\.md$/.test(f) && fs.existsSync(path.join(ROOT, f)));
  else files = fs.readdirSync(path.join(ROOT, "sources")).filter((f) => f.endsWith(".md")).map((f) => "sources/" + f);
  const rows = [], high = [];
  for (const f of files.sort()) {
    const text = fs.readFileSync(path.join(ROOT, f), "utf8");
    const urls = new Set([...text.matchAll(/https?:\/\/[^\s<>"')\]]+/g)].map((m) => m[0].replace(/[.,;:*_]+$/, "")));
    const wiki = [...urls].filter((u) => { try { return /(^|\.)wikipedia\.org$/i.test(new URL(u).hostname); } catch { return false; } });
    const share = urls.size ? wiki.length / urls.size : 0;
    const row = `${(share * 100).toFixed(0).padStart(3)}%  ${String(wiki.length).padStart(3)}/${String(urls.size).padEnd(3)}  ${f}`;
    rows.push(row);
    if (share > WIKI_WARN) high.push(f);
  }
  record("wikipedia-share", "Wikipedia share of sources", high.length ? "warn" : "pass",
    !files.length ? "no source logs changed" : high.length ? `${high.length} of ${files.length} source log(s) over 20% Wikipedia` : `${files.length} source log(s), none over 20% Wikipedia`,
    (changed ? [] : ["(no diff base: " + baseNote + "; measured every source log)"]).concat(rows.length ? ["share  wiki/unique  file"] : [], rows));
}

// ---- build matches committed ----------------------------------------------
function dirtyMap() {
  const out = new Map();
  for (const l of git(["status", "--porcelain", "--untracked-files=all"]).split("\n")) {
    if (!l.trim()) continue;
    const p = l.slice(3).replace(/^"|"$/g, "").split(" -> ").pop();
    const f = path.join(ROOT, p);
    out.set(p, fs.existsSync(f) && fs.statSync(f).isFile() ? sha(fs.readFileSync(f)) : "deleted");
  }
  return out;
}
function checkBuild() {
  const before = dirtyMap();
  const log = [];
  if (before.size) log.push(`NOTE: the working tree already had ${before.size} uncommitted change(s); only files the build changed further are counted.`);
  for (const step of BUILD_STEPS) {
    const r = spawnSync(process.execPath, [step], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    const out = ((r.stdout || "") + (r.stderr || "")).trim().split("\n").slice(-3).join(" | ");
    log.push(`${r.status === 0 ? "ok  " : "FAIL"}  node ${step}  ${out}`);
    if (r.status !== 0) {
      const hint = step.endsWith("build-og.js") ? " (build-og only needs Playwright when a share card is out of date, so this usually means a card was not rebuilt and committed)" : "";
      record("build", "Build output matches committed", "fail", `node ${step} failed${hint}`, log);
      return;
    }
  }
  const after = dirtyMap();
  const diff = [...after].filter(([p, h]) => before.get(p) !== h).map(([p]) => p);
  for (const p of before.keys()) if (!after.has(p)) diff.push(p + " (build reverted an uncommitted change)");
  record("build", "Build output matches committed", diff.length ? "fail" : "pass",
    diff.length ? `the build changed ${diff.length} file(s): run the build steps and commit the output` : `all ${BUILD_STEPS.length} build steps ran; output matches what is committed`,
    log.concat(diff.length ? ["Files changed by the build:"] : [], diff.slice(0, 200).map((p) => "  " + p)));
}

// ================================================================ run
const CHECKS = [
  ["internal-links", checkInternalLinks], ["garbled-links", checkGarbled], ["file-size", checkSizes],
  ["sitemap", checkSitemap], ["pending-banner", checkPendingBanner], ["pending-diff", checkPendingDiff],
  ["wikipedia-share", checkWikipedia]
];
const wanted = (id) => !ONLY || ONLY.has(id);
for (const [id, c] of CHECKS) {
  if (!wanted(id)) continue;
  try { c(); }
  catch (e) { record(id, id, "fail", "check crashed: " + e.message, [String(e.stack || e)]); }
}
if (wanted("build")) {
  if (DO_BUILD || (ONLY && ONLY.has("build"))) { try { checkBuild(); } catch (e) { record("build", "Build output matches committed", "fail", "check crashed: " + e.message); } }
  else record("build", "Build output matches committed", "skip", "not run (pass --build)");
}

// ---------------------------------------------------------------- report
if (!results.length) { console.error("review-checks: no checks matched --only " + [...ONLY].join(",")); process.exit(2); }
const W1 = Math.max(...results.map((r) => r.id.length));
console.log(`Review checks — base ${BASE}${mergeBase ? " (merge-base " + mergeBase.slice(0, 10) + ")" : " (" + baseNote + ")"}${CHANGED_ONLY ? ", changed files only" : ""}`);
console.log("");
console.log("CHECK".padEnd(W1) + "  RESULT  SUMMARY");
console.log("-".repeat(W1) + "  ------  " + "-".repeat(60));
for (const r of results) console.log(r.id.padEnd(W1) + "  " + r.status.toUpperCase().padEnd(6) + "  " + r.summary);
const MAX = 40;
for (const r of results) {
  const show = r.status === "fail" || r.status === "warn" || r.id === "file-size" || r.id === "wikipedia-share";
  if (!show || !r.details.length) continue;
  console.log(`\n[${r.id}] ${r.status.toUpperCase()}`);
  r.details.slice(0, MAX).forEach((d) => console.log("  " + d));
  if (r.details.length > MAX) console.log(`  … and ${r.details.length - MAX} more (see --json)`);
}
const failed = results.filter((r) => r.status === "fail");
const warned = results.filter((r) => r.status === "warn");
console.log(`\n${failed.length ? "FAILED" : "PASSED"}: ${results.length} check(s), ${failed.length} failed, ${warned.length} warning(s).`);
if (JSON_OUT) {
  const out = { base: BASE, mergeBase, baseNote: baseNote || null, changedOnly: CHANGED_ONLY, build: DO_BUILD,
    plantedMarker: PLANTED_MARKER, ok: !failed.length, generated: new Date().toISOString(), checks: results };
  fs.mkdirSync(path.dirname(path.resolve(JSON_OUT)), { recursive: true });
  fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 2) + "\n");
}
process.exit(failed.length ? 1 : 0);
