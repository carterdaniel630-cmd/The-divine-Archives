/* ==========================================================================
   Cloudflare Pages Function — /api/visits (the visitor counter in the footer)

   GET  /api/visits  → { ok: true, total, today }
   POST /api/visits  → counts one visit, then returns the same

   A "visit" is one browser on one day: docs/site-config.js remembers in the
   browser that it has already counted today, so reloading a page or reading
   ten chapters counts once. Only two running numbers are stored (the total and
   today's count): no IP address, no cookie, nothing about the visitor.

   Storage: a Cloudflare D1 database bound to this Pages project as VISITS_DB
   (Cloudflare dashboard → Workers & Pages → D1 → Create database, then the
   Pages project → Settings → Bindings → Add → D1 database, variable name
   VISITS_DB). The table is created on first use. Until that binding exists the
   endpoint answers { ok: false, reason: "not_configured" } and the footer shows
   nothing: it never displays a made-up number.
   ========================================================================== */

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}
const today = () => new Date().toISOString().slice(0, 10);   // UTC day

async function ready(db) {
  await db.prepare("CREATE TABLE IF NOT EXISTS counts (k TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0)").run();
}
async function read(db) {
  const d = "day:" + today();
  const rows = (await db.prepare("SELECT k, n FROM counts WHERE k IN ('total', ?1)").bind(d).all()).results || [];
  const get = (k) => (rows.find((r) => r.k === k) || { n: 0 }).n;
  return { ok: true, total: get("total"), today: get(d) };
}

export async function onRequestGet({ env }) {
  if (!env || !env.VISITS_DB) return json({ ok: false, reason: "not_configured" });
  try { await ready(env.VISITS_DB); return json(await read(env.VISITS_DB)); }
  catch (e) { return json({ ok: false, reason: "error" }, 500); }
}

export async function onRequestPost({ request, env }) {
  if (!env || !env.VISITS_DB) return json({ ok: false, reason: "not_configured" });
  // crawlers and link previews do not count
  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  const bot = /bot|crawl|spider|preview|headless|lighthouse|pingdom|monitor/.test(ua);
  try {
    const db = env.VISITS_DB; await ready(db);
    if (!bot) {
      const up = "INSERT INTO counts (k, n) VALUES (?1, 1) ON CONFLICT(k) DO UPDATE SET n = n + 1";
      await db.batch([db.prepare(up).bind("total"), db.prepare(up).bind("day:" + today())]);
    }
    return json(await read(db));
  } catch (e) { return json({ ok: false, reason: "error" }, 500); }
}
