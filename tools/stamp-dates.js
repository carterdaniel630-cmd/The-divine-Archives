#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — publication dates for chapters and Vault entries

   Keeps content/dates.json: for every chapter (docs/assets/data.js) and Vault
   entry (docs/assets/vault-data.js), the date it was first published, the date
   its markdown last changed, and a hash of that markdown. The page builders read
   it for the Article JSON-LD (datePublished / dateModified) and the sitemap
   (<lastmod>).

   Run it first in the build order, before the page builders:
       node tools/stamp-dates.js
   A new entry gets today's date for both; an entry whose markdown hash changed
   gets today's date as `modified`. Nothing else moves, so the output does not
   depend on git history (a shallow clone builds the same pages).

       node tools/stamp-dates.js --seed
   Rebuilds every date from git history instead (first and last commit that
   touched the markdown). Needs a full clone (`git fetch --unshallow`).
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const OUT = path.join(ROOT, "content", "dates.json");
const SEED = process.argv.includes("--seed");

const sandbox = { window: {} };
vm.createContext(sandbox);
for (const f of ["assets/data.js", "assets/vault-data.js"]) {
  vm.runInContext(fs.readFileSync(path.join(DOCS, f), "utf8"), sandbox, { filename: f });
}
const A = sandbox.window.ARCHIVE || { chapters: [] };
const VAULT = sandbox.window.VAULT || { items: [] };

const entries = [
  ...A.chapters.filter((c) => c.status === "published").map((c) => ({ key: c.id, source: c.source })),
  ...VAULT.items.filter((v) => v.status === "published").map((v) => ({ key: v.id, source: v.source }))
];

const today = new Date().toISOString().slice(0, 10);
const hashOf = (file) =>
  crypto.createHash("sha1").update(fs.readFileSync(path.join(ROOT, file))).digest("hex").slice(0, 12);
const git = (args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();

if (SEED && git(["rev-parse", "--is-shallow-repository"]) === "true") {
  console.error("stamp-dates --seed needs full history: run `git fetch --unshallow` first.");
  process.exit(1);
}

const old = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const next = {};
let added = 0, revised = 0, missing = 0;
for (const { key, source } of entries) {
  if (!source || !fs.existsSync(path.join(ROOT, source))) { missing++; continue; }
  const hash = hashOf(source);
  if (SEED) {
    const dates = git(["log", "--follow", "--format=%cs", "--", source]).split("\n").filter(Boolean);
    next[key] = { published: dates[dates.length - 1] || today, modified: dates[0] || today, hash };
    continue;
  }
  const prev = old[key];
  if (!prev) { next[key] = { published: today, modified: today, hash }; added++; }
  else if (prev.hash !== hash) { next[key] = { published: prev.published, modified: today, hash }; revised++; }
  else next[key] = prev;
}

const text = "{\n" + Object.keys(next).map((k) => " " + JSON.stringify(k) + ": " + JSON.stringify(next[k])).join(",\n") + "\n}\n";
const changed = !fs.existsSync(OUT) || fs.readFileSync(OUT, "utf8") !== text;
if (changed) fs.writeFileSync(OUT, text, "utf8");
console.log(
  `stamp-dates: ${Object.keys(next).length} entries` +
  (SEED ? " seeded from git history" : `; ${added} new, ${revised} revised`) +
  (missing ? `; ${missing} without a markdown source (skipped)` : "") +
  `; content/dates.json ${changed ? "updated" : "unchanged"}`
);
