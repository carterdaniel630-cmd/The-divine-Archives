Summary: 6 passed, 1 fixed, 6 need you. Phase 1 of PR #40 (the version I reviewed) was sound and changed nothing on the site. But during my review, the builder pushed Phase 2 onto the same PR. It changes 215 files, including the live site's pages and all 12 games, and its Framework test now fails. Two Phase 1 issues also need fixing before merge: the votive-candle draft says two things its sources don't, and the copying check lets too much quoted text through without a real citation.

NEEDS CARTER (6)
  - site:fw-phase2: while I was reviewing, the builder added Phase 2 to PR #40 (commits f87f455, 15f990b, c2b06a8). It changes 215 files: docs/ (all chapter pages, the 12 games, the Pantheon, the museum's Buddhism room with a live breath walkthrough, the About page) and CLAUDE.md. The commits say "Approved by Carter 2026-10-11", and the ritual files now say the votive-candle tier was "confirmed by Carter". I can't check either claim from here. Did you approve them? Phase 2 was outside this review, so I have not reviewed it. Its Framework test now fails (1 of 34, in schemas.test.js) and Lighthouse had not finished. Phase 1 no longer meets "nothing in docs/ changes" at the PR's current head.
  - ritual:votive-candle: two details aren't in the sources it cites. Step 1 says the candles "stand in racks"; the dictionary entry only says "before a statue or shrine". Step 3 says the candle's prayer goes on "after they have gone"; neither source says that in any text I could reach. Its tier is also still open: tier 1 in your brief, tier 2 in plans/games-modern.md. (data/rituals/votive-candle.json)
  - ritual:meditation-breath-cycle: the content matches MN 118 (the setting and the first four breathing steps). I couldn't open the translation pages from here (blocked, as they were for the builder), so the exact wording is still unchecked. Would pass otherwise. Any walkthrough of a religious practice needs your OK. (data/rituals/meditation-breath-cycle.json)
  - site:fw-originality: the copying check's loophole. It counts any bold text, any italics, or a date in brackets like "(c. 500 BCE)" as a "citation". A quote or blockquote in such a sentence is then skipped, even with no source named. Across the archive, about 1,030 of the 1,643 skipped quotes are skipped only because of bold text or a bracketed number. The 20% fail rule works; the exemption is too loose. The builder should tighten it. (tools/originality-lib.js, CITATION)
  - site:fw-unfetched: on GitHub, the check could read 1,072 of the 1,793 cited pages. 721 couldn't be fetched: 390 blocked us (403), 189 asked us to slow down (429), 32 are PDFs, 31 show almost no text, 26 are gone (404), and 53 failed for other reasons. The run lists them; it does not hide them. But the tool stops retrying a page after it fails twice, so the 189 slow-down pages may never be checked unless someone reruns it with --retry-failed. A green Originality tick currently means "nothing copied among the pages we could read", not "fully checked".
  - site:fw-merge: merging Phase 1 into main and starting Phase 2 are yours to decide (both are new features). The PR is still a draft. Its description still says "20,176 unnamed stars"; the plan is now corrected (see FIXED).

Needs your decision
  - Did you approve Phase 2 and the votive-candle tier on 2026-10-11, as the new commits say? (yes/no; if no, the builder should move Phase 2 to its own branch)
  - Should I review Phase 2 as its own batch on the next run? (yes/no)
  - Should the builder remove "racks" and "after they have gone" from the votive-candle draft (or find a source for them) before merge? (yes/no)
  - Is the votive candle tier 1 or tier 2?
  - Should the builder tighten the copying check so only a real citation (link, footnote, page or verse reference, titled source) exempts a quote, before merge? (yes/no)
  - Should Originality retry the rate-limited (429) pages on its own instead of skipping them after two failures? (yes/no)
  - Merge Phase 1 into main once those are done? (yes/no)

------------------------------------------------------------------------------------------------

Batch: framework sandbox, Phase 1: schemas and tools only (PR #40, draft)
Reviewed: 2026-10-11
Auto-pass: on ("audit 2026-10-11: 6 of 6 re-reviewed items agreed; ...", reviews/status.json)
Covers: claude/framework-sandbox@fce899e   (head when reviewed; base main@7541b7c, merged in)
Covers: claude/framework-sandbox@f0c04d4   (after my review fix)
Not covered: claude/framework-sandbox@c2b06a8   (Phase 2, pushed during the review; not reviewed)
Summary: 6 passed, 1 fixed, 6 need you.

Automatic checks (on fce899e and again on f0c04d4)
  - node --test framework/test/*.test.js: 26 pass, 0 fail.
  - node tools/build-entity-registry.js --check: up to date (4,129 entities).
  - node tools/review-checks.js --base origin/main: 8 pass, 0 fail, 0 warnings (no content changed).
  - All tools/verify-*.js pass.
  - CI on f0c04d4: Framework, Review checks (checks, guard) and Verify game sourcing pass; Originality passes (details below).
    Lighthouse: no finished run on a Phase 1 head. The fce899e run was cancelled by my fix push, and the f0c04d4
    run was cancelled by the Phase 2 push. The gate logic is checked by reading the code (site:fw-lighthouse).
  - CI on the Phase 2 head c2b06a8: Framework fails (test job: 33 of 34 pass; the failure is in
    framework/test/schemas.test.js line 48). Review checks and Link guard pass; the rest were still running.

PASSED   (6)
  - site:fw-scope: only one existing file changed: .github/workflows/lighthouse.yml. Nothing in docs/, mini-games/,
    museum/ or content/chapters.js changed (git diff --name-status origin/main...HEAD: all other 47 files added).
  - site:fw-checks: the three commands asked for all pass, locally and in CI (above).
  - site:fw-engine: framework/engine/sequence-engine.js reads only the five step fields and names no tradition,
    deity or practice. It has no score or win/lose state. engine-neutral.test.js builds its word list from
    data.js and pantheon-data.js plus a fixed list, and it passes.
  - site:fw-tiers: data/rituals/ has only the two tier-1 drafts, both "draft" status. schemas.test.js refuses any
    tier other than 1. plans/rituals-tiers.md lists tier 3 (Eucharist, salat, Hajj rites, Shabbat blessing, puja,
    Amrit Sanchar, refuge/ordination, navjote, diaspora initiations, restricted Indigenous ceremonies) as
    NEEDS CARTER, not drafted. Séance is tier 2, listed only.
  - site:fw-lighthouse: the hard gate stays. GATE is "hard" only when the event is pull_request, the PR is not a
    draft and the base is main. Then it exits with the tool's own code (a drop of more than 5 points fails).
    Otherwise it warns and exits 0. ready_for_review was added to the triggers, so marking a draft ready re-runs
    the gate. Manual runs are advisory, as documented.
  - site:fw-originality-rule: the 20% rule works. pct > 20 gives FAIL and exit code 1; the test "copied prose
    fails above 20%" passes. It never passes silently: missing pages give PARTIAL or UNVERIFIED, each with
    a warning, a list of the missing pages and a run summary. Note: Sources/References sections are also
    exempt, which goes beyond "quoted text with a citation"; all 171 such headings are plain "## Sources".

FIXED    (1)
  - site:fw-registry: the plan gave the wrong number of unnamed stars. It said the planetarium has 20,176 and
    that counting them "would put the count over 10,000". sky.json stores 4 numbers per star, so 20,176 numbers
    is 5,044 stars: 177 named and 4,867 unnamed. With them the count is 8,996, still under 10,000. I corrected
    both lines in plans/framework-sandbox.md; commit f0c04d4. The rest checks: the plan's table adds up to
    4,129, the same as framework/registry/index.json (target 10,000, short 5,871), counted shard by shard.
    Not changed: the PR description, and a code comment in tools/build-entity-registry.js ("20,000 unnamed").

NEEDS CARTER (6)
  - see the top of this report.

Accuracy spot-checks
  (the sources' sites are blocked from this session as well, so checks are by search results)
  - ritual:meditation-breath-cycle | MN 118 translated by Thanissaro Bhikkhu, Access to Insight | https://accesstoinsight.org/tipitaka/mn/mn.118.than.html | exists, title and translator correct; page could not load here
  - ritual:meditation-breath-cycle | the setting (forest / root of a tree / empty building, legs crossed, body upright, mindfulness to the fore) and steps 1–4 (long, short, whole body, calming the bodily processes) | http://www.buddha-vacana.org/sutta/majjhima/mn118.html (Pali with a gloss, found by search) | supports the content; the Thanissaro wording is unchecked
  - ritual:meditation-breath-cycle | Abhayagiri retreat text | https://www.abhayagiri.org/media/discs/APasannoRetreats/2005%20Anapanasati/sutta.html | exists ("Majjhima Nikaya 118"); page could not load here
  - ritual:meditation-breath-cycle | step 5: the Buddhism chapter places this practice within the path's meditation training | eras/04-axial-age/ch11-buddhism-axial-age.md lines 111–112 (Eightfold Path grouped into wisdom, ethical conduct and meditation) | supports; the anchor section:ch11/the-teaching-four-truths-and-a exists
  - ritual:votive-candle | votive candles burned before a statue or shrine to honour Christ, Mary or a saint; "votive" from lighting candles to fulfil a private vow (votum) | https://www.catholicculture.org/culture/library/dictionary/index.cfm?id=37142 (Hardon, Modern Catholic Dictionary) | supports; author confirmed as Hardon
  - ritual:votive-candle | step 1 "stand in racks" | same Hardon entry | does not support (no racks)
  - ritual:votive-candle | step 3: a candle before a statue is a symbol of prayer and sacrifice | https://www.newadvent.org/cathen/03246a.htm (Catholic Encyclopedia, "Candles", 1908) | could not load; search snippets did not show this passage, so the builder's excerpt is unconfirmed
  - ritual:votive-candle | step 3 "continuing after they have gone" | both cited sources | does not support in any text I could reach

Originality run on f0c04d4 (run 38114585722, success, all pieces checked because the PR changes the check's own files)
  - 171 checked: 12 pass, 157 partial, 2 unverified (v62 Inca khipu 0/4 pages, v68 tjurunga 0/5), 0 fail.
  - Highest overlap: v52 Ishtar Gate 2.02% (worldhistory.org); everything else under 1%.
  - Baseline: 1,072 of 1,793 cited pages fetched; 721 not. Reasons: HTTP 403 390, HTTP 429 189, PDF 32,
    almost no text 31, HTTP 404 26, DNS failure 9, connect timeout 8, certificate 6, HTTP 405 5, header
    overflow 5, HTTP 402 5, other 15.
  - The per-page list is in the run summary and the `originality` artifact. This session could not download the
    artifact (the storage link is blocked here), so the list is not copied into this report.
  - The ritual files in data/rituals/ are not covered by the check (it reads eras/, themes/ and vault/ only).

Loophole test (tools/originality-lib.js prose())
  - A blockquote with no source but one **bold** word: exempt. An inline quote in a sentence containing
    **bold** or "(c. 500 BCE)": exempt. A stricter rule (no bold, no bare numbers in brackets) still
    exempts 613 of the archive's 1,643 quotes, against 1,643 under the current rule.
