/* ==========================================================================
   Cloudflare Pages Function — POST /api/subscribe
   Backs the homepage email-capture form. Deploys automatically with the site
   (it lives under the deployed /docs root as docs/functions/api/subscribe.js).

   To actually STORE addresses, bind a KV namespace named SUBSCRIBERS to this
   Pages project (Cloudflare dashboard → the Pages project → Settings →
   Functions → KV namespace bindings → add binding "SUBSCRIBERS"). Until that
   binding exists the endpoint responds { ok:false, reason:"not_configured" }
   and the form honestly tells visitors the list isn't open yet — it never
   pretends to subscribe someone it did not store.

   Optional: set an env var SUBSCRIBE_WEBHOOK to also POST {email} onward to a
   newsletter provider (Buttondown, ConvertKit, a Zapier/Make hook, etc.).
   ========================================================================== */

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function onRequestPost({ request, env }) {
  let body = {};
  try { body = await request.json(); } catch (e) { /* fall through */ }

  const email = (body && typeof body.email === "string" ? body.email : "").trim().toLowerCase();
  const honeypot = body && typeof body.website === "string" ? body.website.trim() : "";

  // A bot filled the hidden field — accept silently so it thinks it worked.
  if (honeypot) return json({ ok: true });

  if (!EMAIL_RE.test(email) || email.length > 254) return json({ ok: false, reason: "invalid" }, 400);

  // No store bound yet: be honest rather than dropping the address on the floor.
  if (!env || !env.SUBSCRIBERS) return json({ ok: false, reason: "not_configured" }, 200);

  try {
    const record = { email, at: new Date().toISOString(), ua: request.headers.get("user-agent") || "" };
    await env.SUBSCRIBERS.put("sub:" + email, JSON.stringify(record));

    // Optional passthrough to a provider, if configured.
    if (env.SUBSCRIBE_WEBHOOK) {
      try {
        await fetch(env.SUBSCRIBE_WEBHOOK, {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ email })
        });
      } catch (e) { /* storage already succeeded; ignore forwarding errors */ }
    }
    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, reason: "error" }, 500);
  }
}
