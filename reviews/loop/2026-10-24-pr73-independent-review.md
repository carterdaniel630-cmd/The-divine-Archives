# PR #73 (Tjurunga takedown) — independent review

**Run:** build loop, 2026-10-24 ~21:55–22:10 UTC. **Candidate:** `loop/tjurunga-absence` @ `529b1eb` against
`origin/main` `09f48b3`. This run wrote none of the candidate (it was built by the previous run). Reviewed against
`reviews/REVIEWER.md` §3–§4 and `handoff/tjurunga-takedown-order-2026-10-20.md` §2–§3.

## Verdict in plain words
The takedown does what Carter ruled. No build or code defects. One wording point in the absence text is for
Carter (below), and because the whole item is a religious-sensitivity change it needs Carter's yes in any case
(REVIEWER §4.6). Not merged.

## Automatic checks (§3)
- Full build order on the candidate: no changes (the committed output is current and the build is repeatable).
- `review-checks.js --base origin/main --build`: **9/9 pass, 0 warnings** (Wikipedia share of the V68 log 1/5 = 20%, pass).
- 17/17 `verify-*.js` pass; `node --test framework/test/*.test.js`: **42/42**.
- GitHub checks on `529b1eb` at 22:05 UTC: checks, guard, test, runtime ×2, links, originality **green**;
  **Lighthouse still running** (started 21:54). Not waited on.

## The order, point by point (§2–§3)
| Order | Result |
|---|---|
| 2.1 Vault index: V68 card gone, no renumbering, counts true | **pass** — card removed; "Everything (87)", Relics 29, Era IX count down by one; V69+ unchanged. No other "88" count found in page copy. |
| 2.2 Absence page at the same URL, no image/viewer/IIIF/"Study" | **pass** — title "The Tjurunga of Central Australia — Not Shown"; body verbatim §3; 0 images, 0 canvas, 0 viewers at phone size. |
| 2.3 Museum room note in place of the Vault link; Rainbow Serpent kept | **pass** — note verbatim, as a room note (`dir-note`), not a link; Pantheon line kept. No V68 in the museum's 3D data (`manifest.json`, `wings/*.json`). |
| 2.4 Era IX link removed, no replacement | **pass** |
| 2.5 ch61 prose untouched; link relabelled to the same URL | **pass** — only the Vault-list link changed, to "Why the archive does not show the tjurunga". |
| 2.6 Sitemap | **pass** — URL kept (house call: indexed), lastmod 2026-10-24. |
| Sources kept, honesty section trimmed | **pass** — online sources kept; Durkheim dropped with the text that used him (logged in `sources/v68-tjurunga.md`). |
| Share card | **pass** — viewed: title "— Not Shown", "An absence, kept on purpose", standard Era IX emblem (the same on every Modern-age card), no object. |
| Search index | **pass** — the old full-entry text is gone from `search-index.json`. |
| Other pages that read the Vault data | **pass** — Pantheon lists only published Vault items; the relic viewer is only on item pages. |

Extra in the diff: `random.html` gains a meta description (Carter's `fix-random-meta-description.md`). Harmless; noted.

## Headless phone check (390 px)
Absence page, ch61, museum directory, Vault, Era IX, random, Pantheon: **0 script errors** (only blocked external
font loads in this sandbox), no sideways scroll. Screenshot: `handoff/previews/tjurunga-absence-review-phone.png`.

## Sources opened (§4.1)
- spencerandgillen.net (Museums Victoria article 14493): Spencer "the biologist", Gillen "appointed Alice Springs
  telegraph station master in 1892", *Native Tribes of Central Australia* (1899). It dates the recorded ceremonies to
  **summer 1896–97**; the text's "In 1896 … held ceremonies" is fair (they began in late 1896). Note only.
- NT Government, Strehlow Research Centre (cited URL loads): men's-only sacred material; "many elements … can only be
  accessed by the appropriate traditional Aboriginal custodians". Supports "restricted access".
- Central Land Council PDF: about 700 objects, "largely secret–sacred"; CLC bought objects in 1992 "for repatriation".
  Supports collection and returns.
- Wikipedia "Tjurunga": could not be opened from this run (fetch permission not granted). Not checked.

**For Carter (wording):** the text says Strehlow's is "**the largest** collection". None of the three sources I
could open says "largest" (they say "one of the world's most significant", "extraordinarily comprehensive"). The
same claim was already live in the old entry, and the absence text is Carter's verbatim wording, so this run did not
change it. Options: **Keep as is** / **Soften to "one of the most significant collections"**.

## §4 checklist
1 Accuracy: pass except the "largest" wording above (needs Carter). 2 Lenses: n/a (absence page). 3 Evidence tiers:
pass, kept apart, no proof language. 4 Contested claims: none resolved. 5 Tone: descriptive, respectful.
6 Sensitivity: **needs Carter** by rule (the change is the sensitivity ruling itself; nothing shown).
7 Games/3D: museum directory and data checked; no exhibit or model of V68.

## What is still missing before it can merge
Lighthouse green on `529b1eb`; Carter's answer on the wording; Carter's yes for PR #73.
