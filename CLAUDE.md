# THE DIVINE ARCHIVES — Project Instructions for Claude Code

## What this project is
A comparative reference work covering every documented spiritual/religious tradition,
organized chronologically by era (not by region). Each chapter covers one culture/tradition
within its era, or one cross-cutting comparative theme (e.g. flood myths, creation cosmogonies).

## Operating rules (standing, set by Carter 2026-10-01)

### Roles
- **Carter**: ideas, decisions, approvals. He works only from a phone. Never assign him
  technical steps you can do yourself.
- **Claude (chat)**: turns his ideas into plans and prompts.
- **Claude Code (CC)**: builds, tests, verifies, reports.

### Pre-approved: do these without asking, but report them
- Repo settings, branches, workflows, CI and GitHub Actions setup (via the API or gh) when your
  access allows
- Bug fixes, performance fixes, link fixes, doc updates
- Running builds, verify scripts, Lighthouse and audits
- Opening branches and PRs

### Needs Carter's approval: stop and ask first
- Merging to main, or anything that changes the live site
- Publishing or clearing any chapter, Pantheon figure, Vault object, or other new content
- Deleting anything (files, branches, data)
- Anything involving money, accounts, credentials, DNS, the domain, or Cloudflare
- New features, games, or museum rooms
- Anything touching religious-sensitivity rules (e.g. images of the Báb, sacred objects)

### Reporting
- Write reports for a non-technical reader: say what changed, what it means, and what you need
  from him.
- If something only Carter can do, give phone-only steps, or ask permission to do it yourself.
- End every report with a short "Needs your decision" list, or "Nothing needed."

## File structure
```
/eras/
  01-prehistory/
  02-bronze-age/           <- Mesopotamia, Egypt, Indus Valley, early Vedic
  03-early-iron-age/       <- pre-exilic Israel, early Greece, Zoroaster, early China
  04-axial-age/             <- classical Greece, Second Temple Judaism, Buddhism, Confucius/Daoism, Rome, Celtic/Germanic
  05-late-antiquity/        <- early Christianity, Gnosticism, Roman mystery cults, Rabbinic Judaism, Mahayana
  06-early-medieval/        <- Islam, patristic Christianity, Norse paganism, Tantra, Shinto
  07-high-medieval/         <- Kabbalah, Sufism, scholasticism, Aztec/Maya/Inca, Bhakti
  08-early-modern/          <- Reformation, witch trials, colonial-era African religion, Sikhism
  09-modern/                <- NRMs, Spiritualism, Wicca/modern Paganism, Theosophy, diaspora syntheses
/themes/                    <- comparative-theme chapters (cross-era), incl. the ch01-the-flood.md template
/outline/
  master-outline.md         <- full framework + chapter status board (the chat-provided version was never pasted in; this file is maintained as the live framework)
/sources/
  (per-chapter citation logs; also per-Vault-entry logs and pantheon.md)
/vault/                     <- Vault entries (V01…), one markdown file per sacred object or text
/content/chapters.js        <- chapter bodies as HTML, built from the markdown (read by tools, not deployed)
/docs/                      <- the website, deployed as-is (see "Build & deploy" below)
/functions/                 <- Cloudflare Pages Functions (api/subscribe for the home-page form)
/tools/                     <- build-*.js (prerender), md-to-chapter.js, verify-*.js (game facts vs chapter text)
/art-source/                <- source artwork kept out of the deployed site
/museum/                    <- Virtual Museum governance, plan and phase reports (the museum is docs/museum.html + docs/museum/)
/plans/                     <- plans awaiting approval or in build (pilgrimage-sites.md, reviewer-agent.md)
```

## Build & deploy (repo mechanics)
- Production deploys from `main` only: `.github/workflows/deploy.yml` runs `wrangler pages deploy docs`
  to Cloudflare Pages on every push. Work on a feature branch and merge by fast-forward when approved.
- Pages are prerendered and the output is committed. After a content change run, in order:
  `node tools/build-vault.js`, `node tools/build-chapters.js`, `node tools/build-pages.js`,
  `node tools/build-museum.js` (the Virtual Museum's manifest, wing files and fallback directory).
  The museum's planetarium has its own step, `node tools/build-sky.js` (star catalogue in
  `tools/data/d3-celestial/`, lore in `museum/sky-lore.json`, checked by `tools/verify-sky.js`).
  The museum's skies and grounds (`docs/museum/world.js`, table `ENV`), animals (`fauna.js`), sound
  (`sound.js`) and the Vault objects' renditions (`relics.js`, one `CAT` entry per object) are code, with no build step. `english.js` gives each object's writing in English for the inspector's "Read it in English" panel: public-domain translations quoted exactly, literal renderings of short inscriptions, summaries where the translations are in copyright, and a stated reason where there is no text or it is undeciphered. `scans.js` lists published 3D scans of the real objects (Sketchfab model ids, maker, museum or independent); the inspector's "View the real scan" shows them in Sketchfab's own viewer, loaded in the visitor's browser only on request, never copied into the site.
- Generated game art: the fighter's web art comes from `art-source/fighter/` via `node tools/build-fighter-art.js` (half-size WebP; the manifests keep the original sizes, so bump `PARTS_VER` in `fighter.js` after a change). The Risk territory grid `docs/assets/games/data/risk-grid.png` comes from `node tools/build-risk-grid.js`; re-run it after changing provinces or seas.
- A chapter's body goes into `content/chapters.js` via `node tools/md-to-chapter.js <id> <file.md>`;
  its listing entry (title, era, `status`, `pending`) lives in `docs/assets/data.js`.
- `verify.yml` re-checks every game's facts against chapter text (`tools/verify-*.js`); keep them passing.
- Besides chapters the site carries the Vault (`docs/vault/`, data in `docs/assets/vault-data.js`), the
  Pantheon (`docs/pantheon.html`, `docs/assets/pantheon-data.js`), the Pilgrimage of walkable sites (`docs/pilgrimage/`, list in `docs/assets/pilgrimage-data.js`, pages written by `build-pages.js`, checked by `tools/verify-pilgrimage.js`; every on-site claim follows the evidence standard and every dimension names its survey source in the site's `dims.js`) and 12 mini-games (`docs/assets/games/`),
  all held to the same sourcing standard.

## Sourcing standard (non-negotiable)
- Every specific factual/archaeological claim needs a real, checkable source (web search during drafting, not memory-only)
- Contested claims flagged explicitly as contested — do not resolve scholarly debates by picking a side
- Separate "well-supported by evidence" / "not supported" / "genuinely open" for any chapter making empirical claims (follow the pattern in ch01-the-flood.md as the template)
- No claim of "proof" for anything that is actually disputed or unfalsifiable
- One comparative theme chapter per era where useful, alongside culture-by-culture chapters

## Per-chapter workflow
1. Research: web search for primary texts, current archaeological consensus, major scholarly disputes
2. Draft in the engaging-but-accurate narrative style of ch01 (open with a concrete scene/artifact, not an abstract thesis statement)
3. Include: textual record, cosmology/deities, law/moral code, ritual & scribal practice, archaeological evidence, cross-disciplinary angle (psych/socio/bio where relevant), connections to adjacent traditions in the same era
4. End with an evidence-honesty section: what's supported, what isn't, what's still debated
5. Save to the correct era folder, log sources used in /sources/

## How to run this as background work
- Give Claude Code one chapter at a time as a task (e.g. "draft the Egypt chapter for era 02-bronze-age")
- Press Ctrl+B (or type /bg) to background it once it starts, and keep working on other things
- Review each chapter before starting the next — this is a quality-over-speed project, not a word-count race
- Do not let it fabricate sources or invent citations to fill gaps in the historical record; flag gaps instead of papering over them

## Depth Standard (expanded)
"Comprehensive" means: for every tradition covered, pull in every distinct textual source, sect,
regional variant, and ritual practice with a documented record — not just the well-known
headline version. This includes:
- Canonical scripture AND non-canonical/apocryphal/rejected texts (e.g. all forms of biblical
  material — canonical, deuterocanonical, pseudepigraphal, Nag Hammadi/Gnostic texts — not just
  the standard canon)
- Folk and vernacular religion alongside official/institutional religion (what ordinary people
  actually practiced, not just what priesthoods codified)
- Esoteric and initiatory traditions: Hermeticism, Kabbalah (Jewish mystical and Christian/Hermetic
  adaptations), Sufism, Tantra, Gnosticism, Western ceremonial magic (Golden Dawn, Thelema)
- Witchcraft and folk magic: pre-Christian European folk practice, the witch trial era (as
  documented history/persecution, not as validation of trial-era accusations), modern
  Wicca/Neopaganism as a 20th-century new religious movement in its own right
- Satanism: covered as a real, documented set of traditions — historical accusatory/inquisitorial
  "Satanism" (largely fabricated by persecutors, per modern scholarship), and actual modern
  self-identified Satanism (LaVeyan/Church of Satan as an atheistic philosophical system, The
  Satanic Temple as a political/religious-liberty movement) — treated with the same descriptive,
  non-sensationalized rigor as any other tradition, not as shock content

Depth over speed still applies — going deeper on each chapter (more source texts, more sects,
more regional variants) rather than padding language. If a topic has real documented complexity,
represent that complexity rather than summarizing it away.

## IMPORTANT: This is additive, not a restart
Everything already built (master-outline.md, ch01-the-flood.md, this file) stays as the
foundation. Do not regenerate or restructure what already exists — extend it. New chapters
should go deeper than ch01 where the source material supports it, but should follow the same
evidence-honesty format, not a different one.

## Publishing Policy (updated — replaces the old pre-publish review gate)
- Auto-publish is ON: chapters go live on the website as soon as drafted. No per-chapter approval
  is required before publishing.
- Every newly published chapter MUST carry a visible "Recently added — pending full review" tag
  on its live page until Carter clears it in a batch review pass. This tag is mandatory, not
  optional — it's what replaces the old approval gate.
- Carter reviews in batches, not chapter-by-chapter, and sends back correction notes. Revise in
  place when notes come back; remove the pending-review tag only when Carter explicitly clears
  that chapter.
- Still applies, not relaxed: real sourcing only, no fabricated citations, contested claims
  flagged not resolved. Auto-publish removes the pre-publish approval step, not the accuracy bar.
- If Carter requests changes to a chapter, revise in place — don't start a parallel new draft.

## Symbology & Sacred Encoding (new — deep dive required per tradition)
Every chapter must include a dedicated section on that tradition's symbolic/encoded systems —
this is not optional decoration, it's core content. Cover, where the tradition has them:
- Sacred/ritual scripts and their symbolic (not just linguistic) function — e.g. hieroglyphs as
  both writing system and magical/ritual object in Egyptian belief, runes as divinatory tools
  alongside their alphabetic use
- Numerology/letter-value systems — e.g. Hebrew gematria, Greek isopsephy, Arabic abjad
  numerals — including well-documented examples of how they were actually used historically,
  not invented examples
- Physical relics and artifacts claimed to carry sacred power or hidden meaning — e.g. the
  Shroud of Turin — covered with the same evidence-honesty standard as everything else
  (documented scientific testing/dating history, the actual state of scholarly consensus,
  competing claims, not asserted as proven either way)
- Claimed hidden/encoded text within scripture (e.g. Bible codes, gematria-based hidden-message
  claims, palindromes and acrostics that are genuinely present in original-language texts) —
  distinguish clearly between (a) real, well-documented literary devices intentionally used by
  ancient authors and (b) later pattern-finding claims (e.g. equidistant letter sequence "Bible
  code" claims from the 1990s) that have been statistically debunked — cover both, but be
  explicit about which is which
- Iconography and visual symbol systems — sacred geometry, divine attributes encoded in art,
  color/material symbolism, architectural symbolism (temple/church/mosque layouts as
  theological statements)

Same rule as everywhere else: document what a tradition believes and what the evidence actually
shows about a claim, and keep those two things clearly distinguishable. A claim being sacred to
believers and a claim being historically/scientifically verified are different statements —
never blur them into one.

## Website & Domain
- Domain: getconexto.com (repurposed for this project; the wellness/dropshipping use of this
  domain is on hold — do not revert or repurpose it again without being told explicitly)
- Purpose: public-facing presentation of all published chapters, including those pending review
  (clearly tagged as such)
- Structure: home/intro → browse by era → browse by tradition → individual chapter pages → about/
  methodology page (sourcing standard, disclaimers on contested claims, note on pending-review tags)
- Every chapter page must visibly carry its sourcing/evidence-honesty section — don't strip it out
  for the public version
- Do not make further domain/DNS/infrastructure changes beyond the current live setup without
  explicit instruction
