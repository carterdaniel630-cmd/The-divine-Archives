#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — static chapter prerenderer
   Reads the authoring sources (docs/assets/data.js, chapters.js, plates.js)
   and writes one fully-baked, crawlable static page per published chapter to
   docs/chapters/<id>.html — so a chapter page no longer ships the 404 KB
   chapters.js monolith, and its content/title/description are visible to
   crawlers and social unfurlers without running JavaScript.

   Re-run whenever a chapter's content, data.js entry, or plate changes:
       node tools/build-chapters.js
   It is idempotent and overwrites docs/chapters/*.html from source each run.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const OUTDIR = path.join(DOCS, "chapters");
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
for (const f of ["assets/data.js", "assets/chapters.js", "assets/plates.js"]) {
  vm.runInContext(fs.readFileSync(path.join(DOCS, f), "utf8"), sandbox, { filename: f });
}
const A = sandbox.window.ARCHIVE || { eras: [], chapters: [] };
const CHAPTERS = sandbox.window.CHAPTERS || {};
const PLATES = sandbox.window.PLATES || {};

// --- helpers (mirroring archive.js) ---------------------------------------
const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
const eraBySlug = (slug) => A.eras.find((e) => e.slug === slug) || null;
const clip = (s, n) => {
  s = String(s || "").replace(/\s+/g, " ").trim();
  if (s.length <= n) return s;
  return s.slice(0, s.lastIndexOf(" ", n)).replace(/[,;:]$/, "") + "…";
};

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
        <a href="../eras.html">Eras</a>
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

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%93%9C%3C/text%3E%3C/svg%3E";

function pageFor(ch) {
  const era = ch.era ? eraBySlug(ch.era) : null;
  const eraName = era ? era.name : "Themes";
  const url = `${SITE}/chapters/${ch.id}.html`;
  const fullTitle = `${ch.title} — The Divine Archives`;
  const desc = clip(ch.summary, 155);
  const rendered = (CHAPTERS[ch.id] && CHAPTERS[ch.id].html) || "";
  const plate = PLATES[ch.id] || "";

  const crumbMid = ch.era
    ? `<a href="../era.html?era=${encodeURIComponent(ch.era)}">${esc(eraName)}</a>`
    : `<a href="../eras.html">Themes</a>`;
  const backNav = ch.era
    ? `<a href="../era.html?era=${encodeURIComponent(ch.era)}">&larr; ${esc(eraName)}</a>`
    : `<a href="../themes.html">&larr; All themes</a>`;

  const jsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ch.title,
    description: desc,
    url: url,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "The Divine Archives", url: SITE + "/" },
    publisher: { "@type": "Organization", name: "The Divine Archives", url: SITE + "/" }
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
  <meta property="og:type" content="article" />
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
<a class="skip-link" href="#chapter-mount">Skip to content</a>
<div class="page">
${HEADER}

  <main id="chapter-mount">
    <div class="page-head">
      <p class="crumb" style="justify-content:center">
        <a href="../index.html">Archive</a><span class="sep">/</span>
        ${crumbMid}
        <span class="sep">/</span><span>${esc(ch.title)}</span>
      </p>
      ${plate}
      <p class="eyebrow">${esc(ch.eraLabel)}</p>
      <h1>${esc(ch.title)}</h1>
      <p style="margin-top:0.6rem"><span class="badge is-published">In the archive</span></p>
    </div>
    <section class="wrap article">
${rendered}
      <div class="chapter-nav">${backNav}<a href="../eras.html">Browse the ages &rarr;</a></div>
    </section>
  </main>

${FOOTER}
</div>
<script src="../assets/ambient.js" defer></script>
</body>
</html>
`;
}

// --- write ----------------------------------------------------------------
if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });
let n = 0;
for (const ch of A.chapters) {
  if (ch.status !== "published") continue; // only baked, live chapters
  fs.writeFileSync(path.join(OUTDIR, `${ch.id}.html`), pageFor(ch), "utf8");
  n++;
}
console.log(`prerendered ${n} chapter pages -> docs/chapters/`);
