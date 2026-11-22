# Decision — run the weekly audit and its fixes (Carter, 2026-11-22 ~21:57 UTC, live in the build-loop session)

Carter's words, verbatim: "run the audit and fixes. yes from start to finish a long as that's whats recommended.
nuanced things come back to me"

How the loop reads this:
- Run the weekly audit now (`reviews/AUDITOR.md` weekly steps; overdue, last 2026-11-14).
- Clear-cut fixes the audit recommends are approved start to finish: build, independent review, merge. This makes
  the audit's recommended fix list a list "Carter already approved", so such fixes may merge **by class (b)**
  (`decisions-2026-11-01-carter-b-a-a.md`) once every LOOP.md "Merging" gate holds (independent review by a run that
  wrote none of the fix, zero open findings, all GitHub checks green incl. Lighthouse, local checks).
- **Nuanced items go back to Carter, not fixed:** anything contested or a judgement call, anything religiously sensitive
  or touching a sacred object or restricted site, new builds, verdict pieces, clearing pending tags, armory rounds,
  and anything the audit itself marks NEEDS CARTER. These stay per item.
- Unchanged: KEY.md is never opened (the monthly planted-error scoring is not done by the loop); no deletions; no
  money/accounts/DNS/domain/Cloudflare.

Recorded by build loop session ..01HFWzToUsRRPaaYh4uJUUdW.
