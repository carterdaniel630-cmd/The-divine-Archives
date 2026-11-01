#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — verify the hand-picked share images (tools/seo.js PAGE_SHARE)

   For each entry: the JPEG exists in docs/assets/share/, its real pixel size matches the
   width/height the tags announce, and the page it belongs to carries og:image,
   og:image:width/height, og:image:alt and twitter:image for exactly that file.
   museum.html and random.html are hand-written, so this is what keeps them in step.
   Exit 1 on any mismatch.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const SEO = require("./seo");

const DOCS = path.join(__dirname, "..", "docs");
const PAGE = { museum: "museum.html", random: "random.html", pilgrimage: "pilgrimage.html" };
const pageFor = (key) => PAGE[key] || `pilgrimage/${key}.html`;

// Width and height from a baseline/progressive JPEG's SOF marker.
function jpegSize(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null;
    const m = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}
const escAttr = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const meta = (html, attr, name) => {
  const re = new RegExp(`<meta ${attr}="${name.replace(/:/g, ":")}" content="([^"]*)"`, "g");
  return [...html.matchAll(re)].map((m) => m[1]);
};

let bad = 0;
const fail = (msg) => { bad++; console.log("FAIL " + msg); };
for (const [key, s] of Object.entries(SEO.PAGE_SHARE)) {
  const img = path.join(DOCS, "assets", "share", key + ".jpg");
  if (!fs.existsSync(img)) { fail(`${key}: missing ${path.relative(DOCS, img)}`); continue; }
  const size = jpegSize(fs.readFileSync(img));
  if (!size) fail(`${key}: not a readable JPEG`);
  else if (size.w !== s.w || size.h !== s.h) fail(`${key}: image is ${size.w}x${size.h}, tags say ${s.w}x${s.h}`);
  const pg = path.join(DOCS, pageFor(key));
  if (!fs.existsSync(pg)) { fail(`${key}: page ${pageFor(key)} missing`); continue; }
  const html = fs.readFileSync(pg, "utf8");
  const url = SEO.pageShareUrl(key);
  const want = [
    ["property", "og:image", url], ["property", "og:image:width", String(s.w)],
    ["property", "og:image:height", String(s.h)], ["property", "og:image:alt", escAttr(s.alt)],
    ["name", "twitter:image", url], ["name", "twitter:card", "summary_large_image"],
  ];
  for (const [attr, name, val] of want) {
    const got = meta(html, attr, name);
    if (got.length !== 1 || got[0] !== val) fail(`${key}: ${pageFor(key)} ${name} = ${JSON.stringify(got)}, want ${JSON.stringify(val)}`);
  }
  if (meta(html, "property", "og:description").length !== 1) fail(`${key}: ${pageFor(key)} needs exactly one og:description`);
}
const n = Object.keys(SEO.PAGE_SHARE).length;
if (bad) { console.log(`share images: ${bad} problem(s)`); process.exit(1); }
console.log(`share images: ${n}/${n} pages carry their image, sizes match`);
