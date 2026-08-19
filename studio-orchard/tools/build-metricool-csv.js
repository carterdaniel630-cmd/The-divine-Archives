#!/usr/bin/env node
/* ==========================================================================
   STUDIO ORCHARD — Metricool CSV builder
   Turns a queued content batch (pipeline/<line>/batch-NN.json) into a
   Metricool bulk-import CSV, assigning a daily schedule from a start date.

   Usage:
     node tools/build-metricool-csv.js --batch pipeline/pips-orchard/batch-01.json \
          --start 2026-09-01 --time 17:00 --out out/pips-orchard-batch-01.csv

   Autonomy A: an item is only marked ready to schedule once its status is
   "approved" in the batch JSON (Carter flips it during review). This script
   emits ALL items with an APPROVED (Y/N) column + a summary, so you can see the
   batch, but you should import only the approved rows into Metricool.

   NOTE: Metricool's importer column names should be verified against the current
   template — adjust HEADERS below if their format differs. No live posting here;
   this only produces a file a human imports.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

function arg(name, def) {
  const i = process.argv.indexOf("--" + name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
function addDays(iso, n) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function csvCell(s) {
  s = String(s == null ? "" : s);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

const batchPath = arg("batch", "pipeline/pips-orchard/batch-01.json");
const start = arg("start", "SET_START_DATE"); // caller sets the real launch date
const time = arg("time", "17:00");
const outPath = arg("out", "out/" + path.basename(batchPath).replace(/\.json$/, "") + ".csv");

const batch = JSON.parse(fs.readFileSync(batchPath, "utf8"));
const platforms = (batch.platforms || []).join(",");

const HEADERS = ["date", "time", "text", "networks", "media_status", "approved", "id"];
const rows = [HEADERS.join(",")];

let approved = 0;
batch.posts.forEach((p, i) => {
  const date = start === "SET_START_DATE" ? "SET_START_DATE" : addDays(start, i);
  const isApproved = p.status === "approved";
  if (isApproved) approved++;
  rows.push([
    csvCell(date), csvCell(time), csvCell(p.caption),
    csvCell(p.networks || platforms), csvCell(p.media_status),
    csvCell(isApproved ? "Y" : "N"), csvCell(p.id),
  ].join(","));
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, rows.join("\n") + "\n");

console.log(`Wrote ${batch.posts.length} rows → ${outPath}`);
console.log(`Approved & ready to import: ${approved}/${batch.posts.length}` +
  (approved === 0 ? "  (approve items in the review sheet first — autonomy A)" : ""));
if (start === "SET_START_DATE") console.log("⚠  Pass --start YYYY-MM-DD to fill the schedule dates.");
if (batch.posts.some((p) => p.media_status && p.media_status !== "ready"))
  console.log("⚠  Some posts need their card image rendered (needs real Pip art — see BLOCKERS.md).");
