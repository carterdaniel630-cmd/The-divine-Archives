# Handoff prep — Live relic links (scans, museum pages, cameras)

Status: PREPPED in chat, Carter approved the prep 2026-10-28. The feature itself is Carter's ruling of 2026-10-25 (`handoff/decisions-2026-10-25-armory-intake-and-relic-links.md` §1: "yes add all three as long as free, protected along with our guideliness"; STATUS item 4c). That ruling approves BUILDING the feature; going live still needs Carter's yes for the PR. NOT staged to GitHub yet; ships only on Carter's go.
The verified starter register is in `./REGISTER.md` — it is part of this prep and travels with it.

## The feature (per the ruling)
Each Vault/museum relic may carry up to three outside links, shown in the museum inspector:
1. **3D scan** — the published scan, in its maker's own viewer (extends today's `docs/museum/scans.js`, 11 objects).
2. **The museum's own page** — the holding institution's collection page or its zoomable IIIF viewer for that object.
3. **Live camera** — only where the holding museum or site really runs one. Most relics will have none; never invent one.

Conditions, all binding: **free** (no paid service, key, subscription, or account, for us or the visitor); **link or official embed only** — nothing copied, downloaded, or rehosted, and nothing loads from the outside site until the visitor taps (the pattern `scans.js` already follows); every link **opened and checked once, labelled with whose it is** (museum / maker / independent), and **logged** in the object's source log; a link checker catches dead links over time.

## What this prep found (verified 2026-10-28)
- `scans.js` already carries 11 scan links (v53, v59, v58, v55, v70, v36, v71, v47, v43, v34, v35), each with maker + kind labels. They are the seed of the register, not new work.
- Kind-2 coverage partially exists already, in a different place: Vault pages carry a "Study the object — the holding institution's own viewers" section (confirmed on the live Cyrus Cylinder and Mesha Stele Vault pages). First build step is an inventory of those existing per-page links so nothing is duplicated or contradicted; the new work is the inspector-side register plus the gaps.
- The register's starter entries (British Museum pages for the Rosetta Stone and the Cyrus Cylinder) were **opened and confirmed live and correct** during this prep. The Louvre entry (Mesha Stele) was upgraded to verified later the same day, once its direct-open check landed — the register's rule stands: never upgrade a row to "verified" without the open actually happening.

## Exclusions — no links, ever, under this item
- **v68 Tjurunga** — withheld object; stays withdrawn (the ruling names it).
- **v64 Benin Bronzes** — `scans.js` already excludes them "pending the archive's decision on objects whose return is claimed". This prep mirrors that: no links of any kind for v64 until Carter rules otherwise.
- Any object where the holding community or institution asks that it not be shown linked — sacred restrictions win over completeness, always.
- Casts, replicas, imitations, and reconstructions presented as the object — the scans.js rule carries over to all three link kinds. (A museum page FOR a cast must never be registered as the object's page; this prep's research hit exactly that trap — a British Museum page for a plaster cast of the Cyrus Cylinder ranks in search results. The register row must be the original object's record, checked by its museum number.)

## How the register grows
- Work object by object in V-number order, in step with the armory intake batches where they overlap. Each row: holder, URL copied verbatim from the source (never reconstructed from a domain), kind, whose it is, date opened, what the page showed (object name + museum number where the page gives one).
- Search results alone never verify a link. A row is "verified" only when the page itself has been opened and seen to be the right object's record at the holding institution.
- Live cameras: expect almost none. "None known" is a complete and honest register entry; an empty camera slot never blocks shipping the other two kinds.

## Acceptance
- Inspector shows the links per object with their whose-it-is labels; nothing loads from an outside site before a tap.
- Every shipped row verified by an actual open; the dead-link checker runs over the register.
- No row exists for v68 or v64; no cast/replica page registered as an original.
- Fresh independent review, 0 findings; Carter's yes before merge (this prep and the 2026-10-25 ruling approve building, not merging).
