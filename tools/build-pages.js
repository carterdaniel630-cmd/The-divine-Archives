#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — static listing/era/sitemap prerenderer
   (Stage 1 of the site overhaul.)

   Companion to tools/build-chapters.js. Where that tool bakes each chapter
   into a crawlable static page, THIS tool bakes the listing pages and the
   per-era pages that were previously mounted only by client-side JS (and so
   rendered empty to a plain HTTP fetch / to crawlers and social unfurlers).

   It reads the SAME single source of truth the JS uses — docs/assets/data.js
   (+ emblems.js, plates.js) — so the static output can never drift from the
   data. No framework, no bundler; same window-shim + template pattern as
   build-chapters.js.

   What it does, idempotently (safe to re-run; overwrites from source):
     1. Injects baked HTML between <!--build:NAME:start/end--> markers in
        index.html (#spine), eras.html (#ages), themes.html (#themes-list),
        and traditions.html (#trad-list).
     2. Writes one static page per era to docs/eras/<slug>.html, with per-era
        <title>/description/canonical/OG/Twitter + BreadcrumbList JSON-LD.
     3. Regenerates docs/sitemap.xml from data.js (home, listings, every era,
        every published chapter) so it can never go stale by hand again.

   Run after any data.js/emblems.js/plates.js change (and after
   build-chapters.js):
       node tools/build-pages.js
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const SITE = "https://getconexto.com";

// --- load the browser authoring files in a window-shim sandbox ------------
const noopNode = { textContent: "", appendChild() {}, setAttribute() {} };
const sandbox = {
  window: {},
  document: {
    createElement: () => Object.assign({}, noopNode),
    head: noopNode,
    documentElement: noopNode
  },
  console
};
vm.createContext(sandbox);
for (const f of ["assets/data.js", "assets/emblems.js", "assets/plates.js", "assets/chapters.js", "assets/vault-data.js"]) {
  vm.runInContext(fs.readFileSync(path.join(DOCS, f), "utf8"), sandbox, { filename: f });
}
const A = sandbox.window.ARCHIVE || { eras: [], chapters: [], themes: [] };
const EMBLEMS = sandbox.window.EMBLEMS || {};
const PLATE_ART = sandbox.window.PLATE_ART || {};
const CHAPTERS = sandbox.window.CHAPTERS || {};

// --- helpers (mirroring archive.js exactly) -------------------------------
const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
const clip = (s, n) => {
  s = String(s || "").replace(/\s+/g, " ").trim();
  if (s.length <= n) return s;
  return s.slice(0, s.lastIndexOf(" ", n)).replace(/[,;:]$/, "") + "…";
};
const eraBySlug = (slug) => A.eras.find((e) => e.slug === slug) || null;
const chapterFor = (name) =>
  A.chapters.find((c) => c.title.toLowerCase() === String(name).toLowerCase()) || null;

const STATUS = {
  published: { label: "In the archive", cls: "is-published" },
  review: { label: "Awaiting review", cls: "is-review" },
  draft: { label: "In draft", cls: "is-review" },
  planned: { label: "In preparation", cls: "is-planned" }
};
function badge(status, pending) {
  if (pending) return '<span class="badge is-pending">Recently added &middot; pending review</span>';
  const s = STATUS[status] || STATUS.planned;
  return '<span class="badge ' + s.cls + '">' + s.label + "</span>";
}
// tile thumbnail: chapter plate art, else era emblem (mirrors archive.js artFor)
function artFor(ch, era) {
  if (ch && PLATE_ART[ch.id]) return PLATE_ART[ch.id];
  if (era && EMBLEMS[era.slug]) return EMBLEMS[era.slug];
  return "";
}

// replace content between <!--build:NAME:start--> and <!--build:NAME:end-->
function injectBetween(html, name, fragment) {
  const re = new RegExp("(<!--build:" + name + ":start-->)[\\s\\S]*?(<!--build:" + name + ":end-->)");
  if (!re.test(html)) throw new Error("markers for '" + name + "' not found");
  return html.replace(re, "$1\n" + fragment + "\n      $2");
}
function writeIfChanged(file, next) {
  const prev = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  if (prev === next) return false;
  fs.writeFileSync(file, next, "utf8");
  return true;
}

// ---------- 1. fragments for the listing pages ----------------------------

// homepage "Nine Ages" — a chronological timeline (Stage 2; replaces the emblem grid)
function spineFragment() {
  const nodes = A.eras.map((e) =>
    '          <li class="tl-node"><a href="eras/' + encodeURIComponent(e.slug) + '.html">' +
      '<span class="tl-dot" aria-hidden="true"></span>' +
      '<span class="tl-emblem">' + (EMBLEMS[e.slug] || "") + "</span>" +
      '<span class="tl-roman">Era ' + esc(e.num) + "</span>" +
      '<span class="tl-name">' + esc(e.name) + "</span>" +
      '<span class="tl-dates">' + esc(e.dates) + "</span>" +
    "</a></li>"
  ).join("\n");
  return '        <ol class="timeline">\n' + nodes + "\n        </ol>";
}

// eras.html .age list (mirrors the eras.html inline script output)
function agesFragment() {
  return A.eras.map((e) => {
    const tags = e.traditions.map((t) => '<span class="tag">' + esc(t) + "</span>").join("");
    return '      <a class="age" href="eras/' + encodeURIComponent(e.slug) + '.html">' +
      '<div class="num">' + (EMBLEMS[e.slug] || "") + '<span class="numeral">' + esc(e.num) + "</span></div>" +
      "<div><h2>" + esc(e.name) + ' <span class="dates">' + esc(e.dates) + "</span></h2>" +
      '<p class="blurb">' + esc(e.blurb) + "</p>" +
      '<div class="tags">' + tags + "</div></div></a>";
  }).join("\n");
}

// themes.html cards (mirrors the themes.html inline script output)
function themesFragment() {
  return (A.themes || []).map((t) => {
    const ch = t.chapter ? A.chapters.find((c) => c.id === t.chapter) : null;
    const status = ch ? ch.status : "planned";
    const head =
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">' +
        '<span style="font-family:var(--font-display);letter-spacing:0.05em;color:var(--parchment);font-size:1.2rem">' + esc(t.name) + "</span>" +
        badge(status, ch && ch.pending) + "</div>";
    // every theme has a side-by-side comparison view (compare.html?theme=<slug>)
    const compareLink = '\n      <p style="margin:0.1rem 0 0.4rem;text-align:right"><a href="compare.html?theme=' + encodeURIComponent(t.slug) + '" style="font-family:var(--font-display);text-transform:uppercase;letter-spacing:0.16em;font-size:0.62rem">&#8646; Compare side by side &rarr;</a></p>';
    if (ch) {
      return '      <a class="card" href="chapters/' + encodeURIComponent(ch.id) + '.html">' + head +
        '<p class="muted" style="margin:0.7rem 0 0;font-size:0.95rem">' + esc(ch.summary) + "</p></a>" + compareLink;
    }
    return '      <div class="card" style="opacity:0.85;cursor:default">' + head +
      '<p class="muted" style="margin:0.7rem 0 0;font-size:0.95rem;font-style:italic">A dedicated chapter is planned &mdash; but you can already see it compared side by side.</p></div>' + compareLink;
  }).join("\n");
}

// traditions.html tiles (mirrors archive.js renderTraditions draw(), unfiltered)
function traditionsRows() {
  const rows = [];
  A.eras.forEach((era) => {
    era.traditions.forEach((name) => {
      const ch = chapterFor(name);
      rows.push({ name, era, status: ch ? ch.status : "planned", chapter: ch });
    });
  });
  rows.sort((a, b) => a.name.localeCompare(b.name));
  return rows;
}
function traditionsFragment() {
  return traditionsRows().map((r) => {
    const href = r.chapter
      ? "chapters/" + encodeURIComponent(r.chapter.id) + ".html"
      : "eras/" + encodeURIComponent(r.era.slug) + ".html";
    return '        <a class="tile" href="' + href + '" data-name="' + esc(r.name) + '" data-era="' + esc(r.era.name) + '">' +
      '<span class="tile-art">' + artFor(r.chapter, r.era) + "</span>" +
      '<span class="tile-name">' + esc(r.name) + "</span>" +
      '<span class="tile-era">Era ' + esc(r.era.num) + " &middot; " + esc(r.era.name) + "</span>" +
      badge(r.status, r.chapter && r.chapter.pending) + "</a>";
  }).join("\n");
}

// ---------- 2. per-era static pages (docs/eras/<slug>.html) ----------------
const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%93%9C%3C/text%3E%3C/svg%3E";
const HEADER = `  <header class="site-header">
    <div class="wrap bar">
      <a class="brand" href="../index.html">
        <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <circle cx="60" cy="60" r="52" stroke="currentColor" stroke-width="2" opacity="0.5"/>
          <circle cx="60" cy="60" r="40" stroke="currentColor" stroke-width="1.4" stroke-dasharray="1 5"/>
          <path d="M60 24 L64 56 L60 60 L56 56 Z" fill="currentColor"/><path d="M60 96 L56 64 L60 60 L64 64 Z" fill="currentColor"/>
          <path d="M24 60 L56 56 L60 60 L56 64 Z" fill="currentColor"/><path d="M96 60 L64 64 L60 60 L64 56 Z" fill="currentColor"/>
          <circle cx="60" cy="60" r="3" fill="currentColor"/>
        </svg>
        The Divine Archives
      </a>
      <nav>
        <a href="../eras.html" aria-current="page">Eras</a>
        <a href="../traditions.html">Traditions</a>
        <a href="../themes.html">Themes</a>
        <a href="../symbols.html">Symbols</a>
        <a href="../vault.html">Vault</a>
        <a href="../methodology.html">Methodology</a>
        <a href="../about.html">About</a>
      </nav>
    </div>
  </header>`;
const FOOTER = `  <footer class="site-footer">
    <div class="wrap">
      <p class="mark">The Divine Archives</p>
      <nav>
        <a href="../eras.html">Browse by Era</a>
        <a href="../traditions.html">Browse by Tradition</a>
        <a href="../compare.html">Compare Themes</a>
        <a href="../random.html" rel="nofollow">Random Chapter</a>
        <a href="../methodology.html">Methodology</a>
        <a href="../about.html">About</a>
        <a href="https://ko-fi.com/divinearchives" target="_blank" rel="noopener">Support the Archive</a>
      </nav>
      <p class="tiny">A comparative library of the sacred</p>
    </div>
  </footer>`;

function tradTile(name, era) {
  const ch = chapterFor(name);
  const status = ch ? ch.status : "planned";
  const head =
    '<span class="tile-art">' + artFor(ch, era) + "</span>" +
    '<span class="tile-name">' + esc(name) + "</span>" +
    badge(status, ch && ch.pending);
  if (ch) {
    return '        <a class="tile" href="../chapters/' + encodeURIComponent(ch.id) + '.html">' +
      head + '<p class="tile-sum">' + esc(ch.summary) + "</p></a>";
  }
  return '        <div class="tile is-planned">' + head +
    '<p class="tile-sum" style="font-style:italic">A chapter for this tradition is planned but not yet written.</p></div>';
}
function themeTileForEra(ch) {
  return '        <a class="tile" href="../chapters/' + encodeURIComponent(ch.id) + '.html">' +
    '<span class="tile-art">' + artFor(ch, null) + "</span>" +
    '<span class="tile-name">' + esc(ch.title) + "</span>" +
    badge(ch.status, ch.pending) +
    '<p class="tile-sum">' + esc(ch.summary) + "</p></a>";
}
function pageForEra(era) {
  const url = SITE + "/eras/" + era.slug + ".html";
  const fullTitle = era.name + " — The Divine Archives";
  const desc = clip(era.blurb, 155);
  const tiles = era.traditions.map((name) => tradTile(name, era)).join("\n");
  const themeChapters = A.chapters.filter((c) => c.kind === "theme");
  const themeBlock = themeChapters.length
    ? '\n      <p class="eyebrow center" style="margin:2.6rem 0 1.4rem">Comparative themes across this age</p>\n' +
      '      <div class="tiles">\n' + themeChapters.map(themeTileForEra).join("\n") + "\n      </div>"
    : "";
  const jsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Archive", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "The Nine Ages", item: SITE + "/eras.html" },
      { "@type": "ListItem", position: 3, name: era.name, item: url }
    ]
  });
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="icon" href="${FAVICON}" />
  <link rel="stylesheet" href="../assets/archive.css" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="The Divine Archives" />
  <meta property="og:title" content="${esc(fullTitle)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${esc(fullTitle)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <script type="application/ld+json">${jsonld}</script>
</head>
<body>
<a class="skip-link" href="#era-mount">Skip to content</a>
<div class="page">
${HEADER}

  <main id="era-mount">
    <div class="page-head">
      <p class="crumb" style="justify-content:center">
        <a href="../index.html">Archive</a><span class="sep">/</span>
        <a href="../eras.html">The Nine Ages</a>
        <span class="sep">/</span><span>${esc(era.name)}</span>
      </p>
      ${EMBLEMS[era.slug] || ""}
      <p class="eyebrow">Era ${esc(era.num)} &middot; ${esc(era.dates)}</p>
      <h1>${esc(era.name)}</h1>
      <p class="lede">${esc(era.blurb)}</p>
    </div>
    <section class="wrap" style="max-width:52rem;padding-block:2rem 1rem">
      <div class="ornament" style="margin-bottom:2rem"><span>&#10022;</span></div>
      <p class="eyebrow center" style="margin-bottom:1.4rem">Traditions of this age</p>
      <div class="tiles">
${tiles}
      </div>${themeBlock}
    </section>
  </main>

${FOOTER}
</div>
<script src="../assets/ambient.js" defer></script>
</body>
</html>
`;
}

// ---------- 2b. content search: index + search page -----------------------
function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
    .replace(/&ldquo;|&rdquo;/g, '"').replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&hellip;/g, "…").replace(/&middot;/g, "·")
    .replace(/&amp;/g, "&").replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ").trim();
}
function buildSearchIndex() {
  const docs = A.chapters.filter((c) => c.status === "published").map((c) => ({
    id: c.id,
    title: c.title,
    era: c.eraLabel || "",
    summary: c.summary || "",
    text: clip(stripHtml((CHAPTERS[c.id] && CHAPTERS[c.id].html) || ""), 3200)
  }));
  return JSON.stringify(docs);
}
// root-level header/footer (root-relative links) for search.html
const HEADER_ROOT = HEADER.replace(/\.\.\//g, "").replace('aria-current="page"', "");
const FOOTER_ROOT = FOOTER.replace(/\.\.\//g, "");
function searchPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Search — The Divine Archives</title>
  <meta name="description" content="Search the full text of every chapter in The Divine Archives." />
  <link rel="icon" href="${FAVICON}" />
  <link rel="stylesheet" href="assets/archive.css" />
</head>
<body>
<a class="skip-link" href="#search-mount">Skip to content</a>
<div class="page">
${HEADER_ROOT}

  <div class="page-head">
    <p class="crumb" style="justify-content:center"><a href="index.html">Archive</a><span class="sep">/</span><span>Search</span></p>
    <p class="eyebrow">Seek and find</p>
    <h1>Search the Archive</h1>
    <p class="lede">Every chapter, searched by title and full text.</p>
  </div>

  <main id="search-mount" class="wrap" style="max-width:52rem;padding-top:1rem">
    <div class="search center" style="margin:0 auto 2rem"><form onsubmit="return false" role="search">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      <input id="q" type="search" placeholder="Search the archives&hellip;" aria-label="Search the archives" autofocus /></form></div>
    <p id="search-status" class="eyebrow center" style="margin-bottom:1.4rem"></p>
    <div id="results" style="display:flex;flex-direction:column;gap:0.9rem"></div>
  </main>

${FOOTER_ROOT}
</div>
<script>
  (function () {
    var input = document.getElementById("q");
    var results = document.getElementById("results");
    var statusEl = document.getElementById("search-status");
    var INDEX = [];
    function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
    function snippet(d, term) {
      var body = d.text || d.summary || "";
      var i = term ? body.toLowerCase().indexOf(term) : -1;
      var s = i < 0 ? (d.summary || body).slice(0, 180) : body.slice(Math.max(0, i - 70), i + 110);
      s = esc(s.trim());
      if (term) s = s.replace(new RegExp("(" + term.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&") + ")", "ig"), "<mark>$1</mark>");
      return (i > 70 ? "&hellip;" : "") + s + "&hellip;";
    }
    function draw(q) {
      q = (q || "").trim();
      results.innerHTML = "";
      if (!q) { statusEl.textContent = ""; return; }
      var terms = q.toLowerCase().split(/\\s+/);
      var hits = INDEX.map(function (d) {
        var t = d.title.toLowerCase(), sm = d.summary.toLowerCase(), tx = d.text.toLowerCase();
        var score = 0;
        terms.forEach(function (w) {
          if (t.indexOf(w) !== -1) score += 10;
          if (sm.indexOf(w) !== -1) score += 4;
          if (tx.indexOf(w) !== -1) score += 1;
        });
        return { d: d, score: score };
      }).filter(function (x) { return x.score > 0; }).sort(function (a, b) { return b.score - a.score; });
      statusEl.textContent = hits.length + (hits.length === 1 ? " chapter" : " chapters") + " found";
      hits.forEach(function (x) {
        var d = x.d, a = document.createElement("a");
        a.className = "card"; a.href = "chapters/" + encodeURIComponent(d.id) + ".html";
        a.innerHTML = '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:1rem;flex-wrap:wrap">' +
          '<span style="font-family:var(--font-display);letter-spacing:0.05em;color:var(--parchment);font-size:1.15rem">' + esc(d.title) + "</span>" +
          '<span class="eyebrow" style="margin:0">' + esc(d.era) + "</span></div>" +
          '<p class="muted" style="margin:0.6rem 0 0;font-size:0.92rem;line-height:1.6">' + snippet(d, terms[0]) + "</p>";
        results.appendChild(a);
      });
      if (!hits.length) results.innerHTML = '<p class="notice">No chapter matches &ldquo;' + esc(q) + '&rdquo;.</p>';
    }
    fetch("assets/search-index.json").then(function (r) { return r.json(); }).then(function (data) {
      INDEX = data;
      var pre = new URLSearchParams(location.search).get("q") || "";
      if (pre) { input.value = pre; draw(pre); }
    }).catch(function () { statusEl.textContent = "Search index could not be loaded."; });
    input.addEventListener("input", function () { draw(input.value); });
  })();
</script>
<script src="assets/ambient.js" defer></script>
</body>
</html>
`;
}

// ---------- 3. sitemap ----------------------------------------------------
function buildSitemap() {
  const urls = [
    SITE + "/",
    SITE + "/eras.html",
    SITE + "/themes.html",
    SITE + "/traditions.html",
    SITE + "/about.html",
    SITE + "/methodology.html",
    SITE + "/compare.html"
  ];
  A.eras.forEach((e) => urls.push(SITE + "/eras/" + e.slug + ".html"));
  A.chapters.filter((c) => c.status === "published").forEach((c) => urls.push(SITE + "/chapters/" + c.id + ".html"));
  // The Vault (manuscripts, relics & contested objects) — see tools/build-vault.js
  const VAULT = sandbox.window.VAULT || { items: [] };
  urls.push(SITE + "/vault.html");
  VAULT.items.filter((v) => v.status === "published").forEach((v) => urls.push(SITE + "/vault/" + v.slug + ".html"));
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => "  <url><loc>" + u + "</loc></url>").join("\n") +
    "\n</urlset>\n";
}

// ============================ run =========================================
const changed = [];

// listing pages
const injections = [
  ["index.html", "spine", spineFragment()],
  ["eras.html", "ages", agesFragment()],
  ["themes.html", "themes", themesFragment()],
  ["traditions.html", "traditions", traditionsFragment()]
];
for (const [file, name, frag] of injections) {
  const p = path.join(DOCS, file);
  const out = injectBetween(fs.readFileSync(p, "utf8"), name, frag);
  if (writeIfChanged(p, out)) changed.push(file);
}

// per-era pages
const eraDir = path.join(DOCS, "eras");
if (!fs.existsSync(eraDir)) fs.mkdirSync(eraDir, { recursive: true });
let eraN = 0;
for (const era of A.eras) {
  if (writeIfChanged(path.join(eraDir, era.slug + ".html"), pageForEra(era))) eraN++;
}

// content search: index + page
const siChanged = writeIfChanged(path.join(DOCS, "assets", "search-index.json"), buildSearchIndex());
const spChanged = writeIfChanged(path.join(DOCS, "search.html"), searchPage());

// sitemap
const sm = writeIfChanged(path.join(DOCS, "sitemap.xml"), buildSitemap());

console.log(
  "build-pages: listing pages updated [" + (changed.join(", ") || "none") + "]; " +
  "era pages written " + eraN + "/" + A.eras.length + "; " +
  "search-index " + (siChanged ? "updated" : "unchanged") + ", search.html " + (spChanged ? "updated" : "unchanged") + "; " +
  "sitemap " + (sm ? "updated" : "unchanged") +
  " (" + A.eras.length + " eras + " + A.chapters.filter((c) => c.status === "published").length + " chapters)"
);
