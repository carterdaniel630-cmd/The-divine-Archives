Batch: independent review, PR #162 (ch19 source note: drop "Wikipedia's sourced overviews", Carter's "a")
Reviewed: 2026-11-16
Auto-pass: on
Covers: loop/ch19-source-note-wording@3bfb95b9 (re-synced onto main 1d96c8bc as b26b19d8, merge only, same diff)
Summary: 1 passed, 0 fixed, 0 need you.

Independent: this review was done by a chat session that wrote none of #162
(builder: ..01HFWzTk4njtEVKPDV8jARpC).

Automatic checks (on b26b19d8): review-checks.js --base origin/main --build 9 passed, 0 failed, 0 warnings; all 18
verify-*.js pass; framework tests 51/51. GitHub checks were running on b26b19d8 when this was written.

PASSED   (1)
  - ch19: the change is exactly Carter's "a" (decisions-2026-11-16-carter-a-ch19-wording.md) and nothing else.
    - "Wikipedia's sourced overviews," is removed from the source note in the markdown, content/chapters.js and
      docs/chapters/ch19.html. content/dates.json changes only ch19's hash, a generated file.
    - ch19/1 (accuracy): the note still names Britannica and My Jewish Learning, and both are in ch19's source list.
      No Wikipedia mention or link is left in the chapter.
    - ch19/2-5 (lenses, evidence tiers, contested claims, tone): untouched; the edit is in the source note only.
    - ch19/6 (sensitivity): nothing sensitive.
    - Page check: ch19 opened headless at 390x844 (touch) and 1280x800. The note reads correctly, "Wikipedia" is not
      on the page, there is no sideways scroll, no script errors, and the pending banner is still shown.

FIXED    (0)

NEEDS CARTER (0)

Observation (not a finding for this PR, text unchanged here)
  - The same note says the chapter draws on "the mainstream scholarship of Neusner, Schwartz, and the
    'rabbinization' studies they summarize". Neusner and Schwartz are not in the source list themselves. They are
    reached through the cited "Diversity and Rabbinization" volume (Open Book Publishers). Left as it is; a later
    sourcing pass can decide whether to cite them directly.

Accuracy spot-checks
  - ch19 | the note names Britannica and My Jewish Learning | ch19 source list (3 Britannica, 3 My Jewish Learning
    entries) | supports

Needs your decision
  - Nothing needed: Carter's "a" is the per-item yes; the merge follows LOOP.md "Merging" once GitHub is green.
