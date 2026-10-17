"use strict";
/* Renamed game ids (Naming & IP Policy, Carter 2026-10-17).
   Four games used to carry ids borrowed from commercial game names. The old ids survive only in one
   small table, copied in three files, so old links still open the right game and saved scores carry
   over. These tests keep the three copies equal, keep the old ids out of the catalog, and check that
   the migration moves scores and ledger history without losing or double-counting anything. */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..", "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const COPIES = ["docs/assets/games/archive-games.js", "framework/adapters/track.js", "docs/pilgrimage/sites/arcade/site.js"];

function tableIn(src, file) {
  const m = /RENAMED\s*=\s*(\{[^}]*\})/.exec(src);
  assert.ok(m, file + " has no RENAMED table");
  return JSON.parse(m[1].replace(/(\w+)\s*:/g, '"$1":'));
}

function browser(seed) {
  const store = new Map(Object.entries(seed || {}));
  const localStorage = {
    get length() { return store.size; },
    key: (i) => [...store.keys()][i] ?? null,
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k)
  };
  const listeners = {};
  const window = { localStorage, addEventListener: (t, f) => { (listeners[t] = listeners[t] || []).push(f); }, __archiveQ: [] };
  window.window = window; window.self = window;
  const document = { currentScript: { getAttribute: () => null } };
  const ctx = vm.createContext({ window, self: window, document, localStorage, location: { hash: "" }, Date, Math, JSON });
  return { window, ctx, store, json: (k) => JSON.parse(store.get(k) || "null") };
}

test("the three copies of the renamed-id table are identical", () => {
  const tables = COPIES.map((f) => tableIn(read(f), f));
  tables.slice(1).forEach((t, i) => assert.deepStrictEqual(t, tables[0], COPIES[i + 1] + " differs from " + COPIES[0]));
  assert.deepStrictEqual(Object.keys(tables[0]).sort(), ["minesweeper", "pacman", "pong", "risk"]);
});

test("the catalog uses only the new ids", () => {
  const ctx = vm.createContext({ window: {} });
  vm.runInContext(read("docs/assets/games/catalog.js"), ctx);
  const ids = ctx.window.ARCHIVE_GAMES.map((g) => g.id);
  const t = tableIn(read(COPIES[0]), COPIES[0]);
  Object.keys(t).forEach((old) => assert.ok(!ids.includes(old), "old id still in the catalog: " + old));
  Object.values(t).forEach((nu) => assert.ok(ids.includes(nu), "new id missing from the catalog: " + nu));
  assert.strictEqual(ids.length, 12);
});

test("the tracker moves old scores and ledger history onto the new ids, once", () => {
  const b = browser({
    "da.games.score.pong": JSON.stringify([{ score: 7, at: 1 }, { score: 2, at: 2 }]),
    "da.games.score.antithesis": JSON.stringify([{ score: 5, at: 3 }]),
    "da.ledger.v1": JSON.stringify([{ id: "a", ts: 10, entity: "game:pong", verb: "started" }, { id: "b", ts: 11, entity: "chapter:ch02", verb: "viewed" }])
  });
  vm.runInContext(read("docs/assets/framework/archive-ledger.js"), b.ctx);
  assert.strictEqual(b.store.has("da.games.score.pong"), false, "the old score list is gone");
  assert.deepStrictEqual(b.json("da.games.score.antithesis").map((s) => s.score), [7, 5, 2], "merged, best first");
  const led = b.json("da.ledger.v1");
  assert.ok(!led.some((e) => e.entity === "game:pong"), "no old id left in the ledger");
  assert.strictEqual(led.filter((e) => e.entity === "game:antithesis" && e.verb === "started").length, 1);
  assert.strictEqual(led.find((e) => e.id === "b").entity, "chapter:ch02", "other entries untouched");
  // a second page load changes nothing more
  const before = JSON.stringify([...b.store]);
  const again = browser(Object.fromEntries(b.store));
  vm.runInContext(read("docs/assets/framework/archive-ledger.js"), again.ctx);
  assert.deepStrictEqual(again.json("da.games.score.antithesis"), b.json("da.games.score.antithesis"));
  assert.strictEqual(again.json("da.ledger.v1").filter((e) => e.payload && e.payload.via === "import").length,
    b.json("da.ledger.v1").filter((e) => e.payload && e.payload.via === "import").length, "no double import");
  assert.ok(before.length > 0);
});

test("the games' shared code maps old links and merges old scores", () => {
  const b = browser({ "da.games.score.risk": JSON.stringify([{ score: 4, at: 1 }]) });
  b.ctx.document = { addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, createElement() { return { style: {}, setAttribute() {}, appendChild() {}, addEventListener() {} }; }, body: { appendChild() {} } };
  vm.runInContext(read("docs/assets/games/archive-games.js"), b.ctx);
  const AG = b.window.ArchiveGames;
  assert.strictEqual(AG.canonicalId("risk"), "dominion");
  assert.strictEqual(AG.canonicalId("chess"), "chess");
  assert.strictEqual(b.store.has("da.games.score.risk"), false);
  assert.deepStrictEqual(b.json("da.games.score.dominion").map((s) => s.score), [4]);
});
