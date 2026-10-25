Batch: site batch B, small defects part 1 + Ra-Horakhty (branch `loop/small-defects-2026-10-17`)
Reviewed: 2026-10-18 (build loop run; this run wrote none of batch B's site changes)
Auto-pass: SUSPENDED (reviews/status.json: "no baseline test batch yet")
Covers: loop/small-defects-2026-10-17@aeda5d4 (diff `origin/main...aeda5d4`, main = 218c51b)
Summary: 5 passed, 0 fixed, 0 open findings. 2 items need Carter's re-clear (as expected), plus the merge yes.

## Why this item this run
Value 1 is getting a finished batch to mergeable. Part 2 of the small defects (Bagh-chal, Oracle Bones, zodiac
`dispose()`, Grimoire, exhibit fonts) turned out to be files under `handoff/` only (exhibit drafts, previews,
specs). None of it is on the live site, so it does not belong in batch B's site diff and does not have to wait
in front of it. This run wrote none of batch B, so it could do the independent review now. Part 2 stays next.

## Automatic checks
- Full build order (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry, sky): clean, and
  the committed build output is current (no file changed after the build).
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 1 warning. The warning: Pantheon `ra`
  changed and Pantheon figures have no pending tag yet. Known, and listed for Carter's batch review.
- All 17 `tools/verify-*.js`: pass. `node --test framework/test/*.test.js`: 42/42.
- Wikipedia share: ch02 log 10% (2/21), V72 log 0% (0/5).
- Headless phone size (390x844) of pantheon.html#ra, vault/book-of-shadows.html, chapters/ch02.html, museum.html:
  no script errors, no sideways overflow. The only console errors are outside font requests blocked by this
  sandbox's network. Ra-Horakhty card reads correctly; V72 shows the pending banner and 0 Wikipedia links.
- Museum sound, checked by running `recipe()`: brook corridor = wind 0.09 only; forest-brook = wind + leaves;
  garden = wind only (birds come from the room's animals); river still has its river layer. No code still calls
  `brook` or `fountain`.
- GitHub: push-triggered runs on `aeda5d4` are green (Link guard, Game runtime checks). There is **no PR** for
  batch B, so the PR-only checks (review, verify, originality, Lighthouse) have **not run**. Merge condition 2 is
  not met yet. See "Still missing".

## PASSED (5)
- site:hiss: brook() and fountain() removed from `docs/museum/sound.js`; recipes no longer use them. Removal, not
  a cosmetic mask. Not listen-tested (no speakers here).
- site:199-figures: Pantheon meta and OG descriptions and the founder guide say "199 figures (gods, spirits,
  prophets, heroes and primordial beings)". No "199 gods" left anywhere in `docs/`, `content/` or `00-audit/`.
- v72: four Wikipedia citations replaced; entry back to pending (pending: true, banner shown). This is the
  opposite of clearing, so allowed. Text of the entry is unchanged; only sources moved.
- pantheon:ra: renamed Ra-Horakhty; text matches Carter's approved correction (`correction-2026-10-17-ra-horakhty.md`)
  and does not contradict itself (the old "merged as ... Ra-Horakhty" line is reworded). Id and links unchanged.
  Other mentions of Ra on the site are about the god in general ("son of Ra", Amun-Ra), so stay as written.
- ch02 (figure strip and source log only): rebuilt strip label; source log entry dated and specific.

## FIXED (0)

## NEEDS CARTER (2, both expected, neither a defect)
- v72: re-clear the Book of Shadows entry in your batch pass (sources changed; text not).
- pantheon:ra: re-clear the Ra-Horakhty entry (name and text changed under your approved correction).

## Accuracy spot-checks (every page opened from this run, 2026-10-18)
- pantheon:ra | name means "Re, who is Horus of the Two Horizons"; "the actual name of the Re of Heliopolis";
  "a falcon-headed man crowned with a sun disk and a uraeus" | https://carlos.emory.edu/publications/LifeAndTheAfterlife/catalog/sacred-life/32/ | supports
- v72 | 1953 initiation; she "reduced the reliance on Crowley"; "a rewrite of 'The Charge'" (author Vivianne Crowley,
  3 Aug 2018) | https://wrldrels.org/?p=14714 | supports. Does not mention the Rede.
- v72 | "In 1953 she was initiated ... by ... Gerald Gardner"; Charge of the Goddess "incorporated into the early
  Gardnerian Books of Shadows" | https://doreenvaliente.org/about-us | supports
- v72 | §3.1 "Gardner's coven": Valiente "developed Gardner's rituals considerably", adding the Charge |
  https://www.open.edu/openlearn/history-the-arts/a-spiritual-revolution-wicca-and-religious-change-the-1960s/content-section-3.1 | supports
- v72 | 1964 public form of the Wiccan Rede (Doyle White) | https://muse.jhu.edu/article/609097 | could not load
  (Project MUSE "verification required" page). Title confirmed by search; it exists, so not a fake source. The
  1964 line is unchanged older text that also rests on Hutton 1999 (not re-opened). The source log already says
  so honestly. Note for your re-clear, not a blocker: the entry stays pending until you clear it.

## Still missing before batch B can merge (LOOP.md "Merging")
1. GitHub's PR checks (review, verify, originality, Lighthouse) on `aeda5d4`: they only run on a pull request,
   and there is none for batch B yet.
2. Your yes for this specific batch (condition 0). The Ra-Horakhty "yes" approved the correction, not a merge.
3. Condition 4: V72 sources and the Ra-Horakhty name touch religious content. You approved the Ra change itself;
   your merge yes covers this.

## Needs your decision
- OK for the loop to open a pull request for batch B so GitHub's checks run? (yes / no)
- Once the checks are green: send batch B live? (yes / wait)
