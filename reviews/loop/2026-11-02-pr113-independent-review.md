# Independent review: PR #113 (ch01 Ark build follows the documentary)

- **Candidate:** `loop/ark-pump-source` `b97a868` (one commit on `main` `73958d2`; fast-forward).
- **Reviewer:** build-loop run 2026-11-02 ~03:52–04:20 UTC, session ..WzTnXUA5kGYA7e5ui555. Wrote none of the
  candidate (builder: ..WzTn28Jqa5P9EFrsbzzU).
- **Against:** `reviews/REVIEWER.md` §3–§4; `note-2026-11-01-ark-build-correction.md`; the #111 review's follow-up.
- **Verdict: PASS, 0 findings.** 1 advisory note, not blocking. **Merge class: (c)** honesty-wording fix — agreed.

## Claims checked against the cited source (fetched this run)
Source: [PBS NOVA: Secrets of Noah's Ark](https://dipsy.pbs.org/wgbh/nova/ancient/secrets-noahs-ark.html) (programme
text). Each quote below was read on the page in this run.
1. "about 40 feet across: a fifth of the tablet's size by the documentary's own count" — page: "about 40 feet in
   diameter, just a fifth the size of the ark described in the tablet" (tablet ark "222 feet across"). **pass.**
2. "though some accounts say a third" — Wikipedia (cited) says "one-third scale". Disagreement named, not resolved
   (§4 item 4). **pass.**
3. "water came in … from the moment it was launched" — page, at launch: "we have a heck of a lot of water coming in at
   the moment". **pass.**
4. "the crew had to plug the gaps and set pumps working" — page: "They plug the gaps and put a collection of pumps to
   work." **pass.** The old "a pump running continuously" is gone from both copies (headless: absent).
5. Source log: air date "7 October 2015" — page: "PBS Airdate: October 7, 2015". Closing-line quote ("never managed
   to duplicate Babylonian bitumen, but the structure of the ark is sound") — verbatim on the page. **pass.**
6. The page gives the location as Lake Vembanad, southern India; the chapter's "Kerala" agrees (Vembanad is in Kerala).

**Advisory (not a finding):** "through its seams" — the programme says "gaps and holes" and that the waterproofing
mix "isn't working"; "seams" is a fair paraphrase for a woven, coated hull, so no change is needed. A future pass
could say "gaps" to match the source word for word.

## Checklist
- Lens balance: unchanged sentence role; still frames the build as "a test of the boat type, not proof". **pass.**
- Evidence tiers / no "proof" language: **pass.**
- Contested claim flagged (third vs fifth): **pass.**
- Tone: **pass.** Religious sensitivity: none (no sacred object, site, image or revered figure). **pass.**
- Pending: ch01 stays pending (headless: "pending full review" banner present). No tag cleared.
- Games/3D: not touched.

## Local checks on `b97a868` (clean worktree)
- Full build order (stamp-dates, build-og, vault, chapters, pages, museum, framework, entity-registry, sky): no diff
  to committed output.
- `review-checks.js --base origin/main --build`: 9 PASS, 0 FAIL, 1 WARN (Wikipedia share 22% in
  `sources/ch01-the-flood.md`, 4/18 — note only).
- `tools/verify-*.js`: 18/18. `node --test framework/test/*.test.js`: 42 pass, 0 fail.
- Headless `chapters/ch01.html` at 360 and 390: width = viewport, new text present, old text absent, pending banner
  present, 0 page errors (one external resource blocked by the sandbox proxy, not a script error).

## GitHub
At review time 9/10 green on `b97a868`; Lighthouse in progress (started 03:50 UTC). Merge waits on it.
