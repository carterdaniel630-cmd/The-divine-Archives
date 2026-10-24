# Carter's rulings — 2026-10-24 ~23:50 UTC: six answers

**Verbatim (chat with the build side):** "1. yes,2. yes,3. clear,4.a,5. close it,6. send a redder through github to muse asking for it"
(asked as numbered items 1–6; "redder" read as "reminder").

1. **PR #67 (live phone fixes): YES, put it live.** This is Carter's per-item yes. Bring it up to `main` (merge commit),
   confirm the site diff is unchanged from the reviewed `1681050`, get all checks green, then fast-forward. Its independent
   review found 0 findings (`replies/2026-10-24-pr67-independent-review.md`).
2. **Site speed fix A: YES, build it.** Load the outside manuscript viewers (Codex Mendoza, Borgia, Voynich) only when
   the reader reaches them (`research/site-speed-diagnosis-2026-10-24.md`). Build it on a `loop/*` branch, then
   independent review and checks. Going live after that is covered by this yes (Carter: "yes" to "Yes, build A").
   **Not covered:** fixes B–E, each of which needs its own yes.
3. **Batch review: CLEAR** V72 (Book of Shadows) and the Pantheon's Ra-Horakhty entry. Record both in
   `reviews/cleared.json` and remove their pending state, on a branch with checks and independent review. This is
   Carter's explicit clearance for these two items only (CLAUDE.md Publishing Policy).
4. **Reviewer and auditor: option A.** The build loop does their saving, so they save nothing themselves. The loop
   folds this into its procedure. PR #58 is not merged (option C not chosen).
5. **PR #61: CLOSE IT.** It's superseded by #65, which is live. Close it with a note; the branch is kept (closing
   deletes nothing).
6. **Journal hero pictures:** send Muse a reminder through GitHub asking her to commit the three images to
   `handoff/journal-hero/`. Done as `handoff/request-2026-10-24-muse-journal-hero-images.md` plus a manifest note.
