#!/usr/bin/env node
/* ==========================================================================
   serve.js — serve docs/ locally the way Cloudflare Pages roughly does:
   gzip for text files, correct content types, "/" -> index.html, and the
   extensionless "/about" -> about.html fallback. For performance checks
   (tools/perf-baseline.js, .github/workflows/lighthouse.yml) and previews.

   Usage: node tools/serve.js [port=8080] [root=docs]
   ========================================================================== */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const PORT = parseInt(process.argv[2] || "8080", 10);
const ROOT = path.resolve(process.argv[3] || path.join(__dirname, "..", "docs"));
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif",
  ".ico": "image/x-icon", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".wasm": "application/wasm", ".mp3": "audio/mpeg",
};
const COMPRESS = /^(text\/|application\/(json|xml|javascript)|image\/svg)/;

function resolve(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  let f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) return null;
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f) && !path.extname(f) && fs.existsSync(f + ".html")) f += ".html";
  return fs.existsSync(f) ? f : null;
}

http.createServer((req, res) => {
  const f = resolve(req.url);
  if (!f) {
    const nf = path.join(ROOT, "404.html");
    res.writeHead(404, { "content-type": TYPES[".html"] });
    return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : "not found");
  }
  const type = TYPES[path.extname(f).toLowerCase()] || "application/octet-stream";
  let body = fs.readFileSync(f);
  const headers = { "content-type": type, "cache-control": "no-cache" };
  if (COMPRESS.test(type) && /\bgzip\b/.test(req.headers["accept-encoding"] || "")) {
    body = zlib.gzipSync(body, { level: 6 });
    headers["content-encoding"] = "gzip";
    headers.vary = "accept-encoding";
  }
  headers["content-length"] = body.length;
  res.writeHead(200, headers);
  res.end(req.method === "HEAD" ? undefined : body);
}).listen(PORT, () => console.log(`serving ${ROOT} on http://localhost:${PORT}`));
