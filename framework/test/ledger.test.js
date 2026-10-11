"use strict";
const test = require("node:test");
const assert = require("node:assert");
const path = require("path");
const Ledger = require("../ledger.js");
const { validate } = require("./mini-schema.js");
const eventSchema = require("../schema/event.schema.json");

function mem() { const m = {}; return { m, getItem: (k) => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); } }; }

test("appends valid events that match the event schema", () => {
  const s = mem(); let t = 1000;
  const L = Ledger.create({ storage: s, now: () => t++ });
  const e = L.append({ entity: "chapter:ch02", verb: "viewed" });
  L.append({ entity: "game:chess", verb: "scored", payload: { value: 7 } });
  assert.deepStrictEqual(validate(eventSchema, e), []);
  for (const ev of L.events()) assert.deepStrictEqual(validate(eventSchema, ev), []);
  assert.strictEqual(JSON.parse(s.m[Ledger.KEY]).length, 2);
});

test("rejects malformed events", () => {
  const L = Ledger.create({ storage: mem() });
  assert.throws(() => L.append({ entity: "ch02", verb: "viewed" }), /entity/);
  assert.throws(() => L.append({ entity: "chapter:ch02", verb: "deleted" }), /verb/);
  assert.throws(() => L.append({ entity: "game:chess", verb: "scored" }), /scored/);
  assert.throws(() => L.append({ entity: "game:chess", verb: "scored", payload: { value: "7" } }), /scored/);
});

test("has no edit or delete, and past events are frozen", () => {
  const L = Ledger.create({ storage: mem() });
  L.append({ entity: "chapter:ch02", verb: "viewed" });
  assert.deepStrictEqual(Object.keys(L).sort(), ["append", "derive", "events", "status", "subscribe"]);
  const evs = L.events();
  assert.ok(Object.isFrozen(evs) && Object.isFrozen(evs[0]));
  assert.throws(() => { "use strict"; evs[0].verb = "completed"; });
  assert.strictEqual(L.events()[0].verb, "viewed");
});

test("derives state by replay; scored keeps the best; completed keeps the first time", () => {
  let t = 0; const L = Ledger.create({ storage: mem(), now: () => (t += 10) });
  L.append({ entity: "game:pong", verb: "started" });
  L.append({ entity: "game:pong", verb: "scored", payload: { value: 3 } });
  L.append({ entity: "game:pong", verb: "scored", payload: { value: 9 } });
  L.append({ entity: "game:pong", verb: "scored", payload: { value: 4 } });
  L.append({ entity: "ritual:votive-candle", verb: "completed" });
  L.append({ entity: "ritual:votive-candle", verb: "completed" });
  L.append({ entity: "chapter:ch02", verb: "viewed" });
  L.append({ entity: "chapter:ch02", verb: "viewed" });
  const d = L.derive();
  assert.strictEqual(d.best["game:pong"], 9);
  assert.strictEqual(d.started["game:pong"], 1);
  assert.strictEqual(d.completed["ritual:votive-candle"], 50);
  assert.strictEqual(d.viewed["chapter:ch02"], 2);
  const custom = L.derive({ chapters: (s, e) => { if (e.entity.startsWith("chapter:")) s[e.entity] = true; return s; } });
  assert.deepStrictEqual(custom.chapters, { "chapter:ch02": true });
});

test("subscribers hear appends, filters work, unsubscribe stops them", () => {
  const L = Ledger.create({ storage: mem() });
  const all = [], games = [];
  const off = L.subscribe((e) => all.push(e.entity));
  L.subscribe((e) => games.push(e.entity), { type: "game" });
  L.append({ entity: "game:risk", verb: "started" });
  L.append({ entity: "chapter:ch03", verb: "viewed" });
  off();
  L.append({ entity: "game:risk", verb: "completed" });
  assert.deepStrictEqual(all, ["game:risk", "chapter:ch03"]);
  assert.deepStrictEqual(games, ["game:risk", "game:risk"]);
});

test("a second ledger on the same storage keeps both writers' events", () => {
  const s = mem();
  const a = Ledger.create({ storage: s }), b = Ledger.create({ storage: s });
  a.append({ entity: "chapter:ch01", verb: "viewed" });
  b.append({ entity: "chapter:ch02", verb: "viewed" });
  a.append({ entity: "chapter:ch03", verb: "viewed" });
  assert.deepStrictEqual(a.events().map((e) => e.entity), ["chapter:ch01", "chapter:ch02", "chapter:ch03"]);
});

test("when storage refuses a write the event is kept in memory and reported", () => {
  const s = mem(); let full = false;
  const store = { getItem: s.getItem, setItem: (k, v) => { if (full) throw new Error("QuotaExceededError"); s.setItem(k, v); } };
  const L = Ledger.create({ storage: store });
  L.append({ entity: "chapter:ch01", verb: "viewed" });
  full = true;
  L.append({ entity: "chapter:ch02", verb: "viewed" });
  assert.strictEqual(L.events().length, 2);
  assert.strictEqual(L.status().unsaved, 1);
  full = false;
  L.append({ entity: "chapter:ch03", verb: "viewed" });
  assert.strictEqual(JSON.parse(s.m[Ledger.KEY]).length, 3);
  assert.strictEqual(L.status().unsaved, 0);
});

test("corrupt storage does not throw; it reads as empty and is reported", () => {
  const s = mem(); s.setItem(Ledger.KEY, "{not json");
  const L = Ledger.create({ storage: s });
  assert.deepStrictEqual(L.events(), []);
  assert.ok(L.status().lastError);
});
