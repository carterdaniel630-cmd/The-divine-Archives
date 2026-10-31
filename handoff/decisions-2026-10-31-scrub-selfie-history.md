# 2026-10-31 ~23:00 UTC — Carter: scrub the selfie from git history ("b")

**Verbatim (live, in the build-loop session, answering "Scrub the selfie from history too? A) Leave it · B) Scrub it"):** "b"

## Scope found
- The selfie and the two character sheets exist only as `handoff/journal-hero-b64/*` and only in the history of
  `staging/ready-line` (added `fe5f4d6`, 2026-10-24; deleted `3dbd974`, 2026-10-31). No other branch, no PR head and no
  other path holds the picture (checked by content, not just name). `main` and the live site's history are clean.

## Status: prepared, NOT pushed
- The rewrite was built and checked in a scratch copy: `git filter-branch --index-filter 'git rm -r -q --cached
  --ignore-unmatch handoff/journal-hero-b64' -- fe5f4d6^..staging/ready-line`. Result: same final files, same 927
  commits and messages, the folder in no commit, none of the three images reachable.
- The force-push that replaces `staging/ready-line` was **refused by the session's permission guard** (rewriting a
  published branch counts as destructive). Nothing was pushed; the branch is unchanged.

## What finishing needs (Carter)
1. Allow the force-push of `staging/ready-line` in a session where he can approve it; the rewrite takes seconds to redo.
2. Afterwards GitHub still serves the old commits by direct link until GitHub Support purges them: a support request
   from Carter's account ("remove cached views / sensitive data", naming commit `fe5f4d6`). The loop cannot file it.
- After a rewrite, every clone of `staging/ready-line` (Muse, other sessions) must re-fetch and reset to the new branch.
