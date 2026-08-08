# THE DIVINE ARCHIVES — Project Instructions for Claude Code

## What this project is
A comparative reference work covering every documented spiritual/religious tradition,
organized chronologically by era (not by region). Each chapter covers one culture/tradition
within its era, or one cross-cutting comparative theme (e.g. flood myths, creation cosmogonies).

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
/outline/
  master-outline.md         <- full framework, copy from chat-provided version
/sources/
  (per-chapter citation logs)
```

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

## MANDATORY REVIEW GATE — do not skip
- A chapter is a DRAFT until Carter explicitly approves it. Never treat a written chapter as final on your own authority.
- After finishing a chapter draft: stop, do not start the next chapter automatically, and clearly flag "READY FOR REVIEW: [chapter name]"
- Do not commit a chapter to the `main` branch until it's marked approved. Draft chapters live on a `drafts` branch or in a `/drafts/` folder.
- Do not add anything to the public website build until it has cleared review.
- If Carter requests changes, revise in place — don't start a parallel new draft.

## Website (Phase 2 — do not start until Phase 1 has real approved content)
- Purpose: public-facing presentation of approved chapters only
- Recommended stack: static site (e.g. Next.js or plain static HTML/Markdown-rendered) deployable via GitHub Pages/Vercel — cheap, no backend needed for read-only reference content
- Structure: home/intro → browse by era → browse by tradition → individual chapter pages → about/methodology page (sourcing standard, disclaimers on contested claims)
- Do not build this until there are enough approved chapters to make a real site (suggest: wait until at least one full era is done)
- Every published chapter should visibly carry its sourcing/evidence-honesty section — don't strip it out for the public version
