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
for (const f of ["assets/data.js", "assets/emblems.js", "assets/plates.js"]) {
  vm.runInContext(fs.readFileSync(path.join(DOCS, f), "utf8"), sandbox, { filename: f });
}
const A = sandbox.window.ARCHIVE || { eras: [], chapters: [], themes: [] };
const EMBLEMS = sandbox.window.EMBLEMS || {};
const PLATE_ART = sandbox.window.PLATE_ART || {};

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

// homepage era spine (mirrors the index.html inline script output)
function spineFragment() {
  return A.eras.map((e) =>
    '        <a class="era" href="eras/' + encodeURIComponent(e.slug) + '.html">' +
      (EMBLEMS[e.slug] || "") +
      '<span class="roman">Era ' + esc(e.num) + "</span>" +
      "<h3>" + esc(e.name) + '<span class="dates">' + esc(e.dates) + "</span></h3>" +
      '<p class="traditions">' + e.traditions.map(esc).join(" &middot; ") + "</p>" +
    "</a>"
  ).join("\n");
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
    if (ch) {
      return '      <a class="card" href="chapters/' + encodeURIComponent(ch.id) + '.html">' + head +
        '<p class="muted" style="margin:0.7rem 0 0;font-size:0.95rem">' + esc(ch.summary) + "</p></a>";
    }
    return '      <div class="card" style="opacity:0.75;cursor:default">' + head +
      '<p class="muted" style="margin:0.7rem 0 0;font-size:0.95rem;font-style:italic">This comparative chapter is planned but not yet written.</p></div>';
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

// ---------- 3. sitemap ----------------------------------------------------
function buildSitemap() {
  const urls = [
    SITE + "/",
    SITE + "/eras.html",
    SITE + "/themes.html",
    SITE + "/traditions.html",
    SITE + "/about.html",
    SITE + "/methodology.html"
  ];
  A.eras.forEach((e) => urls.push(SITE + "/eras/" + e.slug + ".html"));
  A.chapters.filter((c) => c.status === "published").forEach((c) => urls.push(SITE + "/chapters/" + c.id + ".html"));
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

// sitemap
const sm = writeIfChanged(path.join(DOCS, "sitemap.xml"), buildSitemap());

console.log(
  "build-pages: listing pages updated [" + (changed.join(", ") || "none") + "]; " +
  "era pages written " + eraN + "/" + A.eras.length + "; " +
  "sitemap " + (sm ? "updated" : "unchanged") +
  " (" + A.eras.length + " eras + " + A.chapters.filter((c) => c.status === "published").length + " chapters)"
);
