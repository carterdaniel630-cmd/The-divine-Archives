# 05-MERCH — Open Flags & Missing Information

Per stage policy (and root `CLAUDE.md`): **flag gaps, do not guess.** Updated after Carter's
2026-08-18 note (Pip reference art, Pip's Orchard channels, Printify-only, respectful sacred
symbols). ✅ = resolved · 🚩 = still open/blocking.

## ✅ RESOLVED — POD supplier is Printify
Carter: *"we will only be creating products that Printify can make available to us."* Printify
is the locked supplier. Catalog verified Aug 2026 — this drove two product changes:
- **`PIP-02` enamel pin → pin-back button.** Printify offers pin-back **buttons** (Tecre
  round pins), **not** custom hard-enamel pins. 🚩 *If Carter specifically wants hard enamel,
  that's a separate non-Printify track — flag, don't assume.*
- **`PIP-03` custom plush → throw pillow.** A custom onion-shaped Pip **plush is out of
  Printify's scope** (Printify only offers a stock teddy bear + mini-tee). Swapped to a
  Printify **throw pillow** to keep a soft/huggable Pip item in-scope. 🚩 *True custom plush
  is parked as a possible future non-Printify track if Carter wants it.*
- DA-03 mug, stickers, cards, totes, tees, posters, pillows: all confirmed on Printify.

## ✅ RESOLVED (mostly) — Pip reference art supplied
Carter supplied the canonical Pip art (two golden-hour social posts). The locked reference is
now written up in `pip-reference/REFERENCE.md` and drives every Pip brief.
- 🚩 **The actual image files still need to be committed** into `pip-reference/` (they came
  in via chat, not as repo files). Drop them in as `pip-ref-01.png` / `pip-ref-02.png`.
- 🚩 A clean **character turnaround / model sheet** would help mockup work — the supplied art
  is finished social posts, not reference sheets.

## 🚩 NEW BLOCKER-LEVEL — Pip color conflict (moss-green vs. onion-brown)
The original written brief said Pip's skin is **"moss-green."** The supplied reference art
shows a **brown/golden onion** (green only in the sprout). I followed the supplied art (Carter
said "use as reference") and flagged it in `CLAUDE.md` + `pip-reference/REFERENCE.md`.
**Carter: confirm** brown/golden onion is canonical, or was moss-green intended / is it a
separate colorway? Everything Pip currently assumes brown/golden onion.

## 🚩 STILL OPEN — the "attached list" of products was not attached
The task referenced *"5 Divine Archives + 5 Pip's Orchard items (see attached list)"* — **no
list was attached.** The 10 drafted products are **`PROPOSED`** (DA grounded in real chapters;
Pip on the locked character; all Printify-constrained). **Carter: send the real list** and I'll
swap to match. Do not treat these ten as final.

## 🚩 STILL OPEN — sacred-symbol respectful-use gate (Carter's directive)
Carter: *"we will not use sacred symbols unless it can be done respectfully."* Applied as a hard
gate in `CLAUDE.md`. Per-product standing:
- **`DA-04` Kabbalah Tree of Life — HIGH sensitivity, HELD.** Living Jewish mystical sacred
  diagram. Strong candidate to pull unless Carter is comfortable with attributed educational use.
- **`DA-05` Buddhism Dharmachakra — HIGH sensitivity, HELD.** Living Buddhist sacred symbol; a
  tote may itself be disrespectful — consider a print instead, or pull.
- **`DA-03` Norse runes — Moderate.** Keep strictly a reference alphabet chart; watch extremist
  co-option. Needs Carter's respectful-use sign-off.
- `DA-01` Flood (Low) and `DA-02` Egypt (Low–moderate) — lower risk, still framed descriptively.
- **Carter decides per symbol.** If any can't be done respectfully, it's replaced with a lower-
  sensitivity grounded design.

## 🚩 STILL OPEN — pricing / SKUs (TBD)
No SRP, margin target, or SKU scheme set. Depends on Printify base cost per product/provider.
**Need:** margin target + SKU convention (e.g. `DA-TEE-EGY-01`, `PIP-STK-01`).

## 🚩 STILL OPEN — storefront / domain structure
Two sub-brands, one Shopify store. Pip's Orchard already has **TikTok, Facebook, YouTube, and
Amazon KDP books** — so a Pip storefront would naturally link from those channels. Unresolved:
- Does Pip's Orchard sell under **getconexto.com**, a **separate Pip domain**, or Shopify's own
  storefront linked from the social channels?
- The `/shop` draft here is for the **Divine Archives** site only; **no Pip public page** is
  drafted pending this decision.
- No DNS/domain change made or planned without explicit instruction (root `CLAUDE.md`).

## 🚩 STILL OPEN — Shopify Buy Button placeholder
`/shop` draft embeds a **`TODO`** where the Buy Button goes; the real snippet needs a **live
Shopify product ID**, which won't exist until products are created in Shopify post-review.
