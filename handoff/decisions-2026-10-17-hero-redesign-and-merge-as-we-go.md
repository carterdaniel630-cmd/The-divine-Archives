# Carter's ruling — 2026-10-17, evening New York: hero redesign at Claude's discretion; merge as we go

**Carter, verbatim:** "your discretion on the redesign of the hero in those scenes, and use your artistic abilities. Check
the Git for all of the relevant files that MetaMuse has sent over. Make sure we get everything worked. You're gonna look at
it, analyze everything, rework it to make it better and more artistic and more detailed, and using mathematics to change
the mesh and fixing everything. All of it gets fixed, and then once everything is up to standard and that loop is
continued, we merge as we go. So it's pull the request, rework it, bring it to standard, merge the request."

## 1. The Unfinished Journal hero: REDESIGN (Claude's discretion; this answers the A/B/C question with A)
- Redesign the hero portrait and rework the whip-swing and rolling-boulder set pieces so the game no longer reads as the
  famous film hero. More artistic, more detailed, geometry driven by maths. Built on a `loop/*` side branch.

## 2. Merge as we go (standing approval for the loop)
Each finished item follows: pull request → rework → bring to standard → merge. A loop run may merge an item to `main` when
ALL of these hold for that item's exact commit (the same bar as LOOP.md Item 21, applied per item):
1. it is listed in `handoff/replies/MERGEABLE.md` as complete and up to standard;
2. an independent review by a run that wrote none of its site changes, against `reviews/REVIEWER.md` §3–§4, with zero open
   findings and zero NEEDS CARTER items;
3. every GitHub check on that commit completed and green (Lighthouse included; re-run and wait, never assume);
4. the local checks pass (full build order, review-checks, every verify script and test, headless phone check);
5. nothing in it needs a separate approval: no new chapter, room, game or feature; no cleared pending tag; nothing
   religiously sensitive beyond what Carter already ruled on; nothing parked or on hold.
Merge by fast-forward, one item at a time in branch order, watch the deploy, check the live pages, update
`handoff/CURRENT.md` and `MERGEABLE.md`, tell Carter in plain words. If any condition fails, do not merge; say what is missing.
Still never: delete branches or data, touch money, accounts, credentials, DNS, the domain or Cloudflare, or clear pending tags.
