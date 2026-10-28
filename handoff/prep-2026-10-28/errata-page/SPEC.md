# Handoff prep — The Errata page, in the Vault

Status: PREPPED in chat, Carter approved the prep 2026-10-28. The page itself is Carter's ruling of 2026-10-17 (evening decisions batch, item 3: "The errata page (corrections to site content) lives in the Vault"). NOT staged to GitHub yet; ships only on Carter's go.

## What it is
A public page in the Vault section listing corrections made to the site's content: what a page said, what it says now, and when it was fixed. It is the Content Truth Policy made visible — no silent fixes; corrections stand on the record. Plain, unembarrassed house voice throughout: we got this wrong, here is what it says now.

## Where it lives
- A new page in the Vault section (`docs/vault/errata.html`), styled to match the other Vault pages, linked from the Vault index (`docs/vault.html`) and wired into the sitemap/search index the same way other pages are.
- It is **not** a Vault exhibit: the Vault count stays 88, and it must NOT be added to `docs/assets/vault-data.js` as an item or given a V-number.

## The seed list — verified corrections already live
Each of these traces to a merged change in the loop's record. Entries follow one shape: **page — what it said → what it says now — date fixed.**

1. **Hades (Pantheon)** — was worded as one of the Twelve Olympians → corrected: he is not one of the Twelve. (PR #59, live 2026-10-17.)
2. **Ra-Horakhty (Pantheon)** — the figure's name was wrong → corrected name. (Batch B, PR #63, live 2026-10-18.)
3. **Pantheon figure count** — pages stated a wrong count → corrected to 199 figures. (PR #63, live 2026-10-18.)
4. **Homepage blurbs** — blurbs used trademarked names and "in the style of" phrasing → removed/rewritten. (PR #59, live 2026-10-17.)
5. **The Tjurunga (Vault v68)** — the item was removed from the Vault listing; its page now carries the absence wording explaining why, and that wording itself was softened where a claim outran its sources ("the largest collection"). (PR #73, live 2026-10-25.)
6. **Chapter 2, "the second death"** — wording stated a belief as fact → reframed as what the tradition believes. (PR #82, live 2026-10-25.)
7. **Pilgrimage pages** — wording fixes across the pilgrimage section. (PR #68, live 2026-10-25.)

## Completeness rule — the page must not invent its own contents
- Claude compiles the FULL list from the loop's own records (STATUS.md history, the merged list in MERGEABLE.md, reviewer reports, and the correction handoff files such as `handoff/corrections-v2.md`), then verifies each candidate entry against the actual merged change before it goes on the page. An entry that cannot be traced to a real merged fix does not go up — an errata page containing an error of its own is the one unforgivable outcome here.
- Corrections made before publication (caught in review, never live) do NOT belong on the page; errata is for what visitors could actually have read.
- Video corrections (e.g. the Excalibur narration fix) are off this page — it covers site content, as Carter's ruling states.

## Standing rule from the day it ships
- Every future merged correction to site content adds its errata entry in the same change. Add "errata entry included?" to the loop's merge checklist next to the existing review/checks gates. Nothing about this changes the merge gates themselves: independent review, checks green, Carter's yes per item.

## Acceptance
- Page live in the Vault section, linked from the Vault index, Vault count still 88 everywhere it is stated.
- Every seed entry fact-checked against its merged PR; full compiled list reviewed the same way.
- Fresh independent review, 0 findings; Carter's yes before merge.
