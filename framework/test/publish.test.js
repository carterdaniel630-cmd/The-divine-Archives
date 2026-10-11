"use strict";
/* What reaches the site: docs/assets/framework/ matches its framework/ sources, drafts are
   never published, and every game reports its end through ArchiveGames.finish. */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");

test("docs/assets/framework is up to date with framework/", () => {
  execFileSync(process.execPath, [path.join(ROOT, "tools", "build-framework.js"), "--check"], { stdio: "pipe" });
});

test("only tier-1 rituals (or tier-2 with Carter's recorded framing approval) under review or cleared are published; drafts never are", () => {
  const idx = JSON.parse(fs.readFileSync(path.join(ROOT, "docs/assets/framework/rituals/index.json"), "utf8"));
  for (const f of fs.readdirSync(path.join(ROOT, "data/rituals"))) {
    const r = JSON.parse(fs.readFileSync(path.join(ROOT, "data/rituals", f), "utf8"));
    const slug = f.slice(0, -5);
    const published = fs.existsSync(path.join(ROOT, "docs/assets/framework/rituals", f));
    if (r.review.status === "draft") { assert.ok(!published && !idx.rituals[slug], slug + " is a draft but published"); }
    else { assert.ok(published && idx.rituals[slug], slug + " should be published"); assert.ok(r.sensitivity_tier === 1 || (r.sensitivity_tier === 2 && r.framing_approval && r.framing_approval.by === "Carter"), slug + ": tier " + r.sensitivity_tier + " published without a recorded approval"); }
  }
});

test("every one of the 12 games reports its end, and none of them talks to the ledger directly", () => {
  const dir = path.join(ROOT, "docs/assets/games");
  const games = ["chess", "fighter", "minesweeper", "ouroboros", "pacman", "pinball", "pong", "reliquary", "risk", "seeker", "treasure", "ziggurat"];
  for (const g of games) {
    const src = fs.readFileSync(path.join(dir, g + ".js"), "utf8");
    assert.match(src, new RegExp('AG\\.finish\\("' + g + '"'), g + " never calls AG.finish");
    assert.doesNotMatch(src, /ArchiveLedger|da\.ledger/, g + " must report through ArchiveGames, not the ledger");
  }
  const ag = fs.readFileSync(path.join(dir, "archive-games.js"), "utf8");
  const exported = ag.slice(ag.indexOf("window.ArchiveGames = {"));
  assert.match(exported, /record: record, finish: finish/, "finish and record must be on window.ArchiveGames");
});

test("pages that record views load the tracker with a valid entity", () => {
  const ch = fs.readFileSync(path.join(ROOT, "docs/chapters/ch02.html"), "utf8");
  assert.match(ch, /archive-ledger\.js\?v=\d+" defer data-entity="chapter:ch02"/);
  for (const p of ["docs/symbols.html", "docs/pantheon.html", "docs/museum.html"]) {
    assert.match(fs.readFileSync(path.join(ROOT, p), "utf8"), /assets\/framework\/archive-ledger\.js\?v=\d+" defer/, p);
  }
});
