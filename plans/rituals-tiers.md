# Ritual walkthroughs: sensitivity tiers

Status: **Phase 1 (framework sandbox). Nothing here is on the site.** Written 2026-10-11 with
`framework/schema/ritual.schema.json`. Only Carter sets or changes a tier.

Every walkthrough is opt-in, guided and explanatory: it shows what a practice involves and
what its tradition says it means. It never scores, ranks, times the visitor against a clock,
or has a win or lose state (the schema's `framing` is fixed to "guided, explanatory, no scores
or win states", and the engine has no scoring surface).

## The three tiers

| Tier | What it covers | What may be done without asking |
|---|---|---|
| 1 | Widely shared practices, nothing sacramental or obligatory, explained in the descriptive voice | Drafted and tested in the sandbox; still reviewed, and shown only after Carter clears it |
| 2 | Historical, reconstructed or contested practices; living practices where the framing needs care | Listed only. Drafted after Carter approves the framing |
| 3 | Sacraments and obligatory worship, initiations, restricted or closed ceremonies | **NEEDS CARTER.** Never drafted without his explicit approval; some should never be built |

## Tier 1: drafted in Phase 1

| Ritual | File | Notes |
|---|---|---|
| Mindfulness of breathing, first four steps (Ānāpānasati Sutta, MN 118) | `data/rituals/meditation-breath-cycle.json` | Anchored to ch11's section on the Four Truths and the Path. ch11 does not yet discuss breath meditation directly (a content gap) |
| Lighting a votive candle (Catholic devotional practice) | `data/rituals/votive-candle.json` | Tier 1 as the framework brief lists it. **But `plans/games-modern.md` placed it at tier 2.** Carter to confirm. No chapter covers votive candles yet, so its anchors are empty and say so |

Both are `review.status: "draft"`. Their sources were confirmed through search results
(the pages are blocked from the build sandbox) and must be re-read at review.

## Tier 1: candidates, not drafted

Proposed for tier 1 when a chapter covers them. Carter to agree or move them.

- Walking a church labyrinth (e.g. Chartres)
- A Zen walking-meditation cycle (kinhin)
- Purification at a Shinto shrine's water basin (temizu). This may belong in tier 2 because
  it is living shrine practice

## Tier 2: listed, not drafted (framing needs Carter)

| Practice | Why tier 2 |
|---|---|
| **Séance (historical Spiritualism, 19th–early 20th century)** | Tier 2 per Carter. It must be framed as documented history, including the exposed frauds and the believers' own accounts, never as contact with the dead |
| Consulting the oracle at Delphi | Historical reconstruction from contested ancient accounts |
| Egyptian Opening of the Mouth | Reconstruction from texts and scenes; funerary |
| Mithraic initiation grades | Reconstruction; the evidence is thin and contested |
| Eleusinian Mysteries | Secret in antiquity; any walkthrough is conjecture and must say so |
| Norse blót | Reconstructed from hostile or late sources, and also living practice in modern Heathenry |
| Tarot spread / I Ching casting | Divination; must stay descriptive, never present a "reading" as meaningful output |
| Wiccan circle casting | Living new religious movement; practitioners' own framing needed |
| Praying the rosary | A devotion, not a sacrament, but a walkthrough would have the visitor recite prayers |

## Tier 3: NEEDS CARTER, not drafted

None of these will be drafted, modelled or prototyped unless Carter explicitly approves that
one practice. Several should probably never be built.

| Practice | Tradition |
|---|---|
| Mass / Divine Liturgy (the Eucharist) | Catholic, Orthodox |
| Communion / the Lord's Supper | Protestant |
| Baptism; confirmation / chrismation | Christian |
| Confession (sacrament of penance) | Catholic, Orthodox |
| Salat (the five daily prayers), and wudu (the ablution before it) | Islam |
| Hajj and ʿUmrah rites (ṭawāf, saʿy) | Islam |
| Shabbat candle-lighting with its blessing; tefillin; Passover seder | Judaism |
| Temple puja and ārtī | Hindu traditions |
| Amrit Sanchar (initiation); Ardās | Sikhism |
| Taking refuge and the precepts; ordination | Buddhism |
| Navjote / sedreh-pushi (initiation) | Zoroastrianism |
| Initiations in Vodou, Santería/Lucumí, Candomblé | African diaspora religions |
| Restricted Indigenous ceremonies (e.g. men's and women's business in Aboriginal Australia, the Sun Dance, sweat lodge) | Should never be built: closed ceremonies, consistent with the site's existing rules (tjurunga never shown; restricted sites exterior only) |
| Any rite involving the Báb's image or other images a community forbids | Bahá'í and others: the existing image rules apply |

## What a ritual file must have (enforced by `framework/test/schemas.test.js`)

- `sensitivity_tier` of 1. The test refuses tier 2 or 3 files in Phase 1.
- At least one real source per step, each with a note of how and when it was checked.
- An anchor to a chapter section that exists in the registry, or an `anchor_gap` note saying
  none does yet.
- No scoring language in the steps.
