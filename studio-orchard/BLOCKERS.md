# STUDIO ORCHARD — Track-1 items blocked on Track-2 (or on an asset)

Per Carter's rule: flag anything in Track 1 that turns out silently blocked on a Track-2 (money /
account) item or a missing asset, so it never stalls the pipeline without warning. 🔴 = hard blocked ·
🟡 = partial / workaround in place.

## 🟡 Pip card IMAGES — blocked on the real Pip raw art (asset, Carter)
The generate→queue→schedule pipeline is built and the **text/captions/schedule are ready** (Batch 01,
21 posts). But each post's **card image** needs the **real Pip raw art**, which still isn't committed
(the schematic `../05-merch/pip-reference/pip-spec-card.svg` is a stand-in, not final art).
**Effect:** posts can be reviewed/approved now, but can't be *posted with the real visual* until the
art lands and cards are rendered. **Unblock:** Carter uploads the Pip sheets → `../05-merch/pip-reference/`.

## 🔴 Auto-post to Metricool — blocked on the Metricool API key + account access
Autonomy A still needs a way to push approved posts into Metricool. The engine outputs a
**Metricool-import CSV** (manual bulk import works today) but the *automated* push needs the
**Metricool API key**. **Unblock:** Carter connects Metricool + provides the API key (Track 2-ish).
Until then: Carter imports the CSV by hand after approving a batch.

## 🔴 `/shop` go-live — blocked on live Shopify product IDs (Track 2)
The `/shop` page draft (`../05-merch/shop-page-draft/shop.html`) is campaign-ready but the Buy Button
is a TODO that needs **live Shopify product IDs**, which need products listed, which needs the
**entity/EIN → payments** chain (Track 2). **Effect:** we can deploy a "coming soon" shop, but a
*converting* shop waits on Track 2. **Recommendation:** hold `/shop` deploy until product IDs exist so
campaign traffic never hits a dead checkout. (Also still behind the merch review gate.)

## 🔴 Email capture — blocked on an ESP choice (Carter)
The site can host a signup form, but collecting/storing emails needs an **email platform** (none
chosen; `studioorchard94@gmail.com` / `clipyield26@gmail.com` are send addresses, not an ESP).
**Unblock:** pick an ESP (e.g. MailerLite/ConvertKit/Beehiiv). Then CC adds the capture block.

## ✅ Not blocked (proceeding now)
- Generating Pip batches (text/captions/schedule) · building more content lines' generators ·
  the queue/review workflow · the Metricool CSV builder · campaign copy/assets that don't need live art.
