# 2026-10-31 ~20:45–21:05 UTC: build loop, independent review of PR #88 and PR #89

**For Carter, in one line:** both PRs pass review with nothing to fix. #88 (the four Pilgrimage sites get their
Enter buttons) is ready to go live on your yes. #89 (Tjurunga page, official sources only) is clean too but its last
speed check was still running, and since it touches a secret-sacred page it comes to you by rule anyway.

Batch: Pilgrimage open-flip (PR #88) and Tjurunga absence page official sources (PR #89)
Reviewed: 2026-10-31
Auto-pass: on
Covers: loop/pilgrimage-open-four@9fbc2ec
Covers: loop/tjurunga-official-sources@08d4f51
Summary: 1 passed, 0 fixed, 1 needs you.

Independence: this run (a different session from the one that built both PRs) wrote none of either PR's site changes.

Automatic checks (clean copy of each head, against `main` `68b7b03`):
- Full build order (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry, sky): 0 changed files on both.
- `tools/verify-*.js` 17/17; `node --test framework/test/*.test.js` 42/42; on both.
- `review-checks.js --base origin/main --build`: 9/9 passed, 0 warnings, on both; tree clean afterwards. Wikipedia share
  of `sources/v68-tjurunga.md` is now 0/5.
- GitHub: **#88 9/9 green, including Lighthouse** (finished 20:37). **#89 7/8 green, Lighthouse still running** at
  ~20:50 (started 20:43); not waited on with the lock held.

PASSED   (1)
  - site:pilgrimage-open-four (#88): the diff is only the four status flags (`preview` → `live`), the rebuilt list
    page and registry, and the museum's data cache key `?v=1` → `?v=2` (the only page that loads the file). `pending: true`
    kept on all four, so every card and site page still says "Recently added · pending review". Content of the four
    sites not re-reviewed, per Carter's 2026-10-26 correction (they passed under #53).

FIXED    (0)

NEEDS CARTER (1)
  - v68 / site:tjurunga-official-sources (#89): no fixable findings. It is listed here only because REVIEWER §4.6
    sends anything touching the tjurunga (a secret-sacred object) to Carter, whatever the verdict. What it does is
    exactly his 2026-10-26 ruling: the Wikipedia link is replaced by AIATSIS "Arrernte returns"; page text and the
    absence unchanged.

Headless phone check (own script, iPhone 13 size 390×844, local server of each head):
- #88 Pilgrimage page: 7 open sites, 7 "pending review" tags, no sideways scroll, 0 script errors. Tapping each of the
  7 Enter links opens the right page; each site page loads its title, pending tag and 3D canvas, 0 script errors,
  no sideways scroll. Museum loads `pilgrimage-data.js?v=2` and reads 7 live sites, all pending; 0 script errors.
- #89 Tjurunga page: 0 images, 0 canvas/video, the one background image is the site's decorative divider line;
  "wikipedia" nowhere in the page; outside links = the five sources + the site-wide ko-fi footer; share card still
  `v68.jpg` (the neutral NOT SHOWN card, unchanged); 0 script errors; no sideways scroll.
- Screenshots (session scratch, not committed): Pilgrimage list, Delphi, Tjurunga.

Accuracy spot-checks (#89: the build run asked for every remaining link to be checked for onward sale links)
  - v68 | museums overseas are returning secret-sacred objects | https://aiatsis.gov.au/about/what-we-do/return-cultural-heritage/roch-returns/arrernte-returns | supports (restricted Arrernte objects returned from the Illinois State Museum, Manchester Museum and Kluge-Ruhe; no sale or auction links). Small note: the page says "restricted", not "secret-sacred"; same meaning here, no change needed.
  - v68 | Strehlow Research Centre, restricted access, one of the most significant collections | https://nt.gov.au/leisure/arts-culture-heritage/museums-galleries-art-centres/alice-springs/strehlow-research-centre | supports ("one of Australia's most important collections"; many items accessible only to custodians). Opened at this address; the cited address (with `organisations-and-venues/`) could not be opened from this session (permission prompt, no one to answer). Not a sale link. Next run with access should confirm the cited address still loads, or the link moves to this one (a §5 moved-link fix).
  - v68 | Strehlow collection, collecting history | https://www.clc.org.au/wp-content/uploads/2021/03/The-Strehlow-collection-of-sacred-objects.pdf | supports. No links to sales. It does *recount* the 1992 Adelaide auction of Strehlow material (and that the Central Land Council bought most secret-sacred items back for return), as history, with no catalogue and no description of the objects. Within the ruling as written ("toward a sales catalogue or auction-derived descriptions"), in this reviewer's reading; flagged so Carter knows.
  - v68 | 1896 ceremonies, 1899 publication | https://spencerandgillen.net/spencerandgillen | supports (Engwura ceremonies documented summer 1896/7; *Native Tribes* 1899). Run by Museums Victoria, SA Museum, ANU and partners; links go only to its own records, ADB biographies and partner institutions; no sale links.
  - v68 | 2018 *Museum Management and Curatorship* article | https://www.tandfonline.com/doi/full/10.1080/09647775.2018.1549506 | exists (Deakin repository record, Taylor & Francis 2018, refereed); the publisher page could not be opened from this session. No sale links seen.

Needs your decision
  - PR #88 (four Pilgrimage sites get Enter buttons, pending tags kept): put it live? Yes / No.
  - PR #89 (Tjurunga page cites official sources only): put it live once its last speed check is green? Yes / No.
