Batch: Wikipedia strip part 8, era 09 Modern (PR #156, loop/wikipedia-strip-09)
Reviewed: 2026-11-15
Auto-pass: n/a (merge is per item on Carter's strip yes, decisions-2026-11-15-carter-a-prs-yes-wikipedia.md 2)
Covers: loop/wikipedia-strip-09@e7a8a8d1 (one content commit on main 2d3450cb)
Reviewer session: ..01HFWzTobZzjy1EQTT5EvQ6d (wrote none of #156; builder was ..01HFWzTmZbrzmNaW5ejP7GWV)
Summary: 9 passed, 0 fixed, 0 need you. Verdict: PASS, 0 open findings.

In plain words
Eight Modern chapters lose their Wikipedia sources and nothing else. No chapter text changed.
Satanism (ch39) is left with 3 sources and the African diaspora chapter (ch40) with 4. Some
debunking claims in them (the Satanic Panic, Baphomet's origin, the Hodgson report, Bois Caïman,
the zombie) now have no source in the list; the builder already put them at the front of the
re-sourcing queue.

Automatic checks (run on e7a8a8d1, in a clean worktree)
  - Full build order (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry, sky): no files changed.
  - review-checks --base origin/main --build: 9 pass / 0 fail / 1 warn (expected "sources only, stays cleared").
  - verify-*.js 18/18; node --test framework/test/*.test.js 51/51.
  - Headless Chromium, all 10 era 09 pages x 360 and 390 px (20 loads): standards mode, 0 script errors, no sideways overflow, 0 Wikipedia links, 0 "wikipedia" in page text, 0 empty list items.
  - Crawl: grep -ci wikipedia = 0 on all 10 era 09 markdown files.
  - GitHub: #156 checks not yet complete at review time. A merge condition, not a finding.

Diff checks (scripted)
  - Markdown: 42 lines removed, 22 added → 20 bullets removed whole, 22 trimmed. 39 en.wikipedia.org URLs removed. Matches the builder (39 links, 20 whole, 22 trimmed).
  - Every removed line contains "wikipedia"; no added line does.
  - Every added line keeps its claim text (everything before the first " — ") identical to the line it replaces; only the citation part changed.
  - Every hunk is below "## Sources" (checked per file against the line of the heading).
  - content/chapters.js: 42 removed / 22 added, all <li> lines, mirroring the markdown. Other changed files: the 8 built chapter pages, content/dates.json, docs/sitemap.xml (generated).

PASSED (9)
  - ch35/1 NRMs: 2 links out, 0 whole; Great Disappointment keeps Christian History Institute and Barker/DIMPAC keeps CESNUR (named, unlinked); cargo cults keep Britannica. 12 left.
  - ch36/1 Spiritualism: 5 links out, 2 whole (Piper; Kardec/Spiritism); Home, Mumler, Margery keep their named second sources; ideomotor line keeps Smithsonian. 8 left.
  - ch37/1 Theosophy: 4 links out, 3 whole (Secret Doctrine/root races, Golden Dawn, Hodgson report); Thelema keeps Britannica; Order of the Star keeps Krishnamurti Foundation. 7 left.
  - ch38/1 Wicca: 8 links out, 5 whole; Valiente keeps Learn Religions, origins keeps Hutton (1999). 5 left.
  - ch39/1 Satanism: 6 links out, 4 whole (Satanic Panic "reference overviews" entry that linked only to Wikipedia, La Voisin, Temple of Set, Baphomet). 3 left.
  - ch40/1 Diaspora: 8 links out, 6 whole (Bois Caïman, zombie, Santería, Lukumi, Candomblé/Palo, voodoo doll "reference overviews"); Vodou keeps Britannica, Laveau keeps EBSCO, Rastafari keeps Britannica. 4 left.
  - ch64/1 Pentecostalism: 2 trailing Wikipedia links out; both bullets keep EBSCO / Christian History Institute.
  - ch65/1 Bahá'í: 4 trailing Wikipedia links out; each bullet keeps its second source (Iranica, bahai.us, The Conversation, EBSCO).
  - site:pr156: only Sources lists changed; ch74 and ch83 untouched (no Wikipedia on main either).

FIXED (0)

NEEDS CARTER (0)

Notes (not findings)
  - Whole-bullet removals follow the rule used and passed in parts 5–7: the text before the dash is the topic, not a source, so a bullet whose only citation was Wikipedia goes whole. Removed topics that name a primary work (Kardec, The Secret Doctrine, The Spiral Dance, Aquino, Davis) are listed in the builder's flags 96–115.
  - Two kept sources checked today (below) cover less than their bullets list. ch39 Satanic Temple: The Conversation supports the 2013 start, the Seven Tenets, the abortion ritual / RFRA and IRS recognition as a religion, but not the Baphomet statue, After School Satan or the 2019 date. ch39 Church of Satan: its own page supports LaVey, the Satanic Bible (1969) and the Nine Statements, not the 1966 founding, and it is the group's own page. Both were already thin on main beside Wikipedia; adding sources is re-sourcing (order item 5), not this list removal. Added to the re-sourcing priorities.
  - Unchanged on main, noted for a later honesty-wording pass: ch40 "Haile Selassie in Jamaica, reference overviews" is labelled "reference overviews" but links to Africa Is a Country.
  - Checklist items 2–6: no body text changed, so balance, tiers, contested-claim flags, tone and sensitivity rules are as on main. Item 7 (games/3D): not touched.

Accuracy spot-checks
  - ch39 | Church of Satan, LaVey, Satanic Bible (1969), Nine Statements | https://churchofsatan.com/nine-satanic-statements/ | supports LaVey, 1969 and the Statements; not the 1966 founding
  - ch39 | Satanic Temple (2013), Seven Tenets, abortion ritual/RFRA, IRS | https://theconversation.com/how-the-satanic-temple-is-using-abortion-rituals-to-claim-religious-liberty-against-the-texas-heartbeat-bill-167755 | supports 2013, tenets, ritual/RFRA, IRS recognition (no date); not Baphomet statue or After School Satan
  - No claim text changed and no source was added, so there was no new claim to check.

Needs your decision
  - Nothing needed. Merge is covered by your strip yes once GitHub incl. Lighthouse is green and the generated files are re-synced after #154 and #155 (or stacked on #155).
