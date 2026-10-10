PREVIOUS SCHEDULED RUNS FAILED TO PUSH: 2026-10-10 21:23 UTC and 21:32 UTC (routine had no repository access); this is a manual run with the repository attached.
0 passed, 0 fixed, 1 needs Carter.

NEEDS CARTER (1)
  - site:pilgrimage-qumran-alexandria: two new walkable site pages, one about the Dead Sea Scrolls caves and one about the Library of Alexandria. New features always need you. They are technically sound and carefully worded.

------------------------------------------------------------------------------------------------

Batch: Qumran caves and Library of Alexandria as noindex previews (PR #36, claude/pilgrimage-qumran-alexandria)
Reviewed: 2026-10-10
Auto-pass: on ("baseline test batch review-test/2026-10 scored 9 of 9 (100%) ...", reviews/status.json)
Covers: claude/pilgrimage-qumran-alexandria@13204b3
Summary: 0 passed, 0 fixed, 1 needs you.

Automatic checks (base origin/main@91abd1f; the branch is 5 commits behind main, with no conflict in its files)
  - review-checks.js --build: 8 checks pass. The build output matches what is committed, and nothing was left over.
  - All 15 tools/verify-*.js pass. verify-pilgrimage now also checks "preview" sites.
  - GitHub Actions on 13204b3: checks, guard, verify, runtime, links and Lighthouse are all green.
  - Headless Chromium (local server): pilgrimage/qumran-caves.html, pilgrimage/library-of-alexandria.html and
    pilgrimage.html load with no script errors. Each vestibule draws, with its portal, cases and signs.
  - Both pages carry "noindex", are not in the sitemap, show "Recently added · pending full review", and are
    left off the Pilgrimage list (listed as coming, with no link).

NEEDS CARTER (1)
  - site:pilgrimage-qumran-alexandria: new feature pages about a holy site and its sacred texts (REVIEWER.md §4.6
    and §6). Would pass:
      - Qumran: the Essene reading is called "the majority view, but every part of it is contested", and the
        alternatives are named. Ownership (Israel, Jordan, the Palestinian Authority) is stated "without taking a
        side". Every cave size is marked approximate. The scroll renditions are labelled renditions, and the
        Enoch fragments carry "illustrative marks, not the Aramaic text". No people are shown.
      - Alexandria: marked (R), reconstruction. Every card separates "attested" (Strabo's one sentence) from
        "conjecture". The holdings figures are called unreliable (Bagnall). The "single great fire" and the Umar
        story are corrected, not repeated.
      - Sources: both logs say the original pages could not be opened and were checked through search results.
        My checks agree on the facts I sampled.
    Note: once merged to main, both pages are reachable on getconexto.com by direct address, though they stay
    unlisted and noindex.

Accuracy spot-checks
  - qumran | Cave 4 found Aug 1952, dug 22–29 Sept 1952 by Harding, de Vaux and Milik; more than 15,000 fragments | https://library.biblicalarchaeology.org/department/in-history-52/ ; https://virtualqumran.huji.ac.il/tour/VTCaves.htm (search) | supports (Virtual Qumran says 16,000+; the card says "more than 15,000")
  - qumran | Copper Scroll cut into 23 strips, Manchester, 1955–56; in the Jordan Museum | https://library.biblicalarchaeology.org/article/the-mysterious-copper-scroll ; https://en.wikipedia.org/wiki/Copper_Scroll (search) | supports
  - qumran | Great Isaiah Scroll: 17 sheets, 54 columns, about 7.3 m | https://cojs.org/the_isaiah_scroll/ (cited; consistent with standard descriptions) | supports
  - alexandria | Strabo 17.1.8 "public walk, exedra with seats, large house ... common mess-hall" | https://websites.uta.edu/hunnicut/reading-list/readings-western-civilization/strabo-description-of-alexandria (cited; this is the standard Loeb wording) | supports

Needs your decision
  - Do you approve the Qumran caves and the Library of Alexandria as previews (and later as live sites)? Merging
    PR #36 is your call. (yes/no)
