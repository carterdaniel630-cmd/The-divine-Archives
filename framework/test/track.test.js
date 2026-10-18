"use strict";
/* The page tracker (framework/adapters/track.js) as the site runs it: the published
   bundle docs/assets/framework/archive-ledger.js, in a fake browser. */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..", "..");
const BUNDLE = fs.readFileSync(path.join(ROOT, "docs", "assets", "framework", "archive-ledger.js"), "utf8");

function browser(seed, attrs) {
  const store = new Map(Object.entries(seed || {}));
  const localStorage = {
    get length() { return store.size; },
    key: (i) => [...store.keys()][i] ?? null,
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    // like a real browser, a new key may land anywhere in key order: put it first
    setItem: (k, v) => { if (!store.has(k)) { const old = [...store]; store.clear(); store.set(k, String(v)); old.forEach(([a, b]) => store.set(a, b)); } else store.set(k, String(v)); }
  };
  const listeners = {};
  const window = {
    localStorage,
    addEventListener: (t, f) => { (listeners[t] = listeners[t] || []).push(f); },
    dispatch: (t, detail) => (listeners[t] || []).forEach((f) => f({ detail, key: null })),
    __archiveQ: []
  };
  window.window = window; window.self = window;
  const document = { currentScript: { getAttribute: (a) => (attrs || {})[a] || null } };
  const ctx = vm.createContext({ window, self: window, document, localStorage, location: { hash: "" }, Date, Math, JSON });
  return { window, ctx, store, run: () => vm.runInContext(BUNDLE, ctx), ledger: () => JSON.parse(store.get("da.ledger.v1") || "[]") };
}

test("records a page view from data-entity, drains the queue, and listens for later events", () => {
  const b = browser({}, { "data-entity": "chapter:ch02" });
  b.window.__archiveQ.push({ entity: "game:antithesis", verb: "started" });
  b.run();
  b.window.dispatch("archive:event", { entity: "game:antithesis", verb: "scored", payload: { value: 4 } });
  b.window.__archiveTrack.record({ entity: "game:antithesis", verb: "completed" });
  assert.deepStrictEqual(b.ledger().map((e) => e.verb + " " + e.entity), ["started game:antithesis", "viewed chapter:ch02", "scored game:antithesis", "completed game:antithesis"]);
});

test("old high scores are imported once, even though writing shifts the key order", () => {
  const seed = { "da.games.score.antithesis": JSON.stringify([{ score: 5, at: 1 }, { score: 3, at: 2 }]), "da.games.sfx": "on" };
  const b = browser(seed);
  b.run();
  const imported = b.ledger().filter((e) => e.payload && e.payload.via === "import");
  assert.strictEqual(imported.length, 2);
  // a second page load in the same browser
  const again = browser(Object.fromEntries(b.store));
  again.run();
  assert.strictEqual(again.ledger().filter((e) => e.payload && e.payload.via === "import").length, 2);
  assert.strictEqual(again.store.get("da.games.score.antithesis"), seed["da.games.score.antithesis"], "the old list is left as it was");
});

test("malformed events are dropped without throwing", () => {
  const b = browser();
  b.run();
  assert.doesNotThrow(() => b.window.dispatch("archive:event", { entity: "not an id", verb: "viewed" }));
  assert.doesNotThrow(() => b.window.dispatch("archive:event", null));
  assert.deepStrictEqual(b.ledger(), []);
});

test("loads once: a second copy on the page does nothing", () => {
  const b = browser({}, { "data-entity": "chapter:ch02" });
  b.run(); b.run();
  assert.strictEqual(b.ledger().length, 1);
});

test("a score set after the tracker arrived is not copied again as an old score", () => {
  const b = browser();
  b.run(); // first page load: nothing to import, the start time is stored
  const since = Number(b.store.get("da.ledger.since"));
  assert.ok(since > 0);
  // a game is played: the score is recorded live and the game saves its own list, as archive-games.js does
  b.window.__archiveTrack.record({ entity: "game:antithesis", verb: "scored", payload: { value: 9 } });
  b.store.set("da.games.score.antithesis", JSON.stringify([{ score: 9, at: since + 1000 }]));
  const again = browser(Object.fromEntries(b.store));
  again.run(); // next page load
  const antithesis = again.ledger().filter((e) => e.entity === "game:antithesis" && e.verb === "scored");
  assert.strictEqual(antithesis.length, 1, "the live score only, no imported copy");
});
