# ORDER — Strip Wikipedia from every source list on the site (Carter's ruling, 2026-11-11 21:19 ET)

**The ruling, in Carter's words as presented and answered:** Wikipedia comes "out of the source lists entirely." This supersedes the October demote-and-replace approach — the measured state (atlas crawl of all 211 sitemap pages, 2026-11-11) is 747 wikipedia.org occurrences across 149 pages, ~92% of them sitting in the pages' Sources sections, and that presence ends.

## The work

1. Remove every Wikipedia entry (any wikipedia.org link, any language edition) from the Sources / Further reading / bibliography sections of every page on the site — chapters, Vault, pilgrimages, and any other page carrying one.
2. This is a LIST removal, not a text change: no page's prose is rewritten by this order. Where a page's prose names Wikipedia in passing as a subject of discussion (rare), leave the prose; if in doubt, flag it in the report rather than editing.
3. The Rök decoded page's "(a pointer only)" Wikipedia link is NOT exempted — it goes with the rest.
4. Where removing an entry leaves a Sources subsection empty, remove the empty subsection cleanly; where a whole Sources section would be left empty, flag the page in the report instead of stripping the section bare.
5. **Sole-source flags:** where a checkable claim on a page was carried ONLY by a Wikipedia entry (no other source in its list covers it), do not leave the claim silently unsourced — list the page and the claim in the delivery report for re-sourcing from the well.

## Out of scope

- The picture machine's image-hunting (Commons/Wikipedia as a licence-verified picture source for the books programme) is a different thing and is NOT touched by this ruling.
- The books' source lists are atlas's note, not this order's scope, unless Carter extends the ruling.

## Gates on delivery

- Post-change crawl evidence: zero wikipedia.org occurrences in any page's source sections; a diff summary per page (entries removed count).
- Lighthouse + deploy verified green after merge, per merge-on-green.
- The delivery report names: total entries removed, pages touched, sole-source flags (item 5), any prose mentions left standing (item 2).
