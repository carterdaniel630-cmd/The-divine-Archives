# Protection Charter — DRAFT for Carter's approval
**Ready-line §1. Drafted 2026-10-17 by the build loop. Status: DRAFT — not binding until Carter approves.**
Once approved, every build (site, museum, arcade, Vault, Pantheon, videos, future rooms) must meet it before it is
proposed for merge. It folds together `naming-and-ip-policy.md`, `content-truth-policy.md` and
`protection-code-theft.md`; it does not replace them. Where they say more, they win.

Not legal advice. Anything that depends on law (copyright registration, takedowns, privacy notices) is marked for a
lawyer to confirm.

---

## 0. The honest baseline
A public website's code reaches every visitor's browser. It can never be made unhackable, uncopyable or
unscreenshottable. What this charter does: make theft **expensive**, **traceable** and **legally actionable**, and
make sure nothing we ship leaks secrets or borrows someone else's property. Pages and reports never promise more.

## 1. What the repo looks like today (checked 2026-10-17 on `staging/ready-line`)
| Area | Finding | Meaning |
|---|---|---|
| **Repository visibility** | **The GitHub repository is public.** All readable source, drafts, handoff notes and history can be viewed and forked by anyone. | This outweighs every other code-theft measure: obfuscating the shipped site does nothing while the clean source sits in a public repo. **Decision for Carter (D1).** |
| Source maps | 0 `.map` files under `docs/`. One vendored file (`openseadragon.min.js`) names a map that is not shipped (harmless 404). | Rule already met. |
| Client-side secrets | Pattern scan of `docs/` and `functions/` for cloud keys, API tokens, payment keys: none. Server code reads its database / webhook through Cloudflare bindings (`env.*`), not hard-coded values. The analytics token slot in `site-config.js` is a public token by design (empty today). | Rule met; needs an automatic check so it stays met. |
| Copyright notices | No `LICENSE` file. No copyright line in the site footer. Of 104 shipped JS files, only the 2 vendored three.js files carry a notice. | Gap. |
| Third-party licences | three.js (MIT), OpenSeadragon (BSD) and Noto fonts (OFL) each ship with their licence file. | Rule met; keep it that way. |
| Image/art provenance | 235 images under `docs/`. No ledger records where non-generated art came from or under what licence. | Gap. |
| Minify / obfuscate | Deploy uploads `docs/` exactly as written; nothing is minified except vendored libraries. | Gap (and moot until D1). |
| Watermark / fingerprint | None. | Gap. |
| Security headers | `_headers` sets nosniff, frame-deny, referrer policy, permissions policy. No Content-Security-Policy. No subresource integrity (the only external script is the optional analytics beacon; fonts load from Google Fonts). | Partial. |
| Naming & IP | Trademark game ids already removed (2026-10-17). A spot scan of shipped pages for common game/film marks found none. No automatic naming check exists. "The Tomb Robber" card is awaiting Carter. | Rule met by hand; needs a check. |
| Personal data | `functions/api/subscribe.js` stores subscriber emails when its database is connected (not connected today). Visitor counter stores counts only. Analytics is cookieless and off. | A privacy note is needed before subscribe is switched on. |

## 2. The rules (each build must pass all of them)
**P1 — Names (Naming & IP Policy).** Generic names in every title, id, file name, code identifier, alt text, share
image, caption and blurb. No trademarked names, no "-style"/"-like" comparisons, no lookalike characters or
plots. A factual Vault reference to a commercial work may name it once, factually. Checked by a denylist sweep (P1
tool below) plus the reviewer. When in doubt, go plainer.

**P2 — Truth (Content Truth Policy).** Unchanged: verbatim quotes, no silent omissions, no blur artifacts; the one
sacred-space exception only.

**P3 — No secrets in the browser.** No keys, tokens, private endpoints or passwords in anything under `docs/`.
Server-only values live in Cloudflare bindings and are never committed. Every build is scanned.

**P4 — No readable source maps in production.** No `.map` files and no map links to our own code in `docs/`.

**P5 — Every original file says whose it is.** Each shipped HTML/JS/CSS file we wrote carries a one-line copyright
notice; the footer carries the same line; the repo carries a `LICENSE` stating all rights reserved (wording per D2).
Third-party files keep their own licence and notice, untouched.

**P6 — Every asset has a paper trail.** Every image, font, model, sound and video frame we ship is listed in an
asset ledger: origin (generated / own photo / public domain / licensed), licence, and link. No ledger entry, no ship.

**P7 — Shipped code is harder to lift (after D1).** At deploy, our own JS is minified and identifiers mangled into a
build copy; the repo keeps the readable source. Heavier obfuscation (string encryption, control-flow flattening)
only where a speed check proves it does not slow phones, because the phone check is the verdict.

**P8 — Copies can be traced.** Each release stamps an invisible per-release id into shipped code and the share
images, recorded in the release log, so a copied build can be dated to the release it came from.

**P9 — Tamper-evident loading.** A Content-Security-Policy that allows only our own origin plus the named outside
services in use (Google Fonts, the optional analytics beacon); integrity hashes on any outside script that has a
fixed version.

**P10 — Visitor data.** Collect the least possible. Before any feature that stores personal data goes live (e.g.
subscribe), a plain privacy page says what is kept, why and how to remove it. No tracking cookies.

**Never promised:** unhackable code, DRM, blocking screenshots or recordings, stopping someone re-building a game by
hand. Pages and reports say what the measures actually do.

## 3. How it is enforced
- A new `tools/check-protection.js` (one PR) checks P1 denylist, P3 secrets, P4 maps, P5 notices, P6 ledger coverage,
  and runs inside `review-checks.js` so CI fails red on a breach.
- The reviewer (`reviews/REVIEWER.md`) adds a Protection line to every review.
- Changes to `_headers` (P9) and the deploy step (P7, P8) are site-behaviour changes: each goes through a preview
  check before any merge, under the normal merge approval.

## 4. Build order once approved (one PR each, smallest first)
1. `check-protection.js` with P3, P4 and P1 (denylist file `tools/data/ip-denylist.json`) — report-only first run.
2. P5 notices + `LICENSE` (needs D2 wording).
3. P6 asset ledger, filled for all current assets; unknown origins listed for Carter, never guessed.
4. P9 Content-Security-Policy, tested on every page and game in a headless phone-size browser.
5. P7 minify step in deploy + P8 release stamp (only after D1).
6. P10 privacy page before subscribe goes live.

## 5. Decisions for Carter
- **D1 — Make the GitHub repository private?** Today anyone can read and fork all the source. A) Make it private
  (you do it on GitHub, or tell a session to; private repos still deploy, with a monthly limit on free automation
  minutes). B) Keep it public and accept that code protection is notices + tracing only. *Recommendation: A.*
- **D2 — Name on the copyright line.** A) "© 2026 Carter Daniel. All rights reserved." B) A business or trade name
  you give. C) "© 2026 The Divine Archives".
- **D3 — Register copyright** on the original text and art (strengthens takedowns, especially in the US)? A) Ask a
  lawyer. B) Not now.
- **D4 — Approve this charter** as binding? A) Yes. B) Yes with changes. C) Not yet.
