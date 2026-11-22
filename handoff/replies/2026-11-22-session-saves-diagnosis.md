# Why sessions sometimes refuse to save, and the fix (2026-11-22)

## The cause (two parts, checked from the repo and the GitHub settings)
1. **Sessions start on an old branch.** GitHub's default branch for this repo is `claude/session-start-ikztvo`
   (last changed 17 Aug 2026), not `main`. Every new cloud session clones that branch, which has **no
   `.claude/settings.json` at all**. So no session ever loads the project's settings: no save rules, and not even
   the start-up hook that installs the code-map tool (which is why runs keep reporting "graphify CLI missing").
2. **No standing save rules exist anyway.** `.claude/settings.json` on `main` has hooks only, no `permissions`.
   With no rules, each session's built-in safety check judges every commit and push on its own. It usually
   allows them, sometimes refuses (the VR loop lost a finished piece on 11-22 this way), and always refuses a
   push to the live site unless you have said go in that same thread. That last part is intended.

It is not GitHub branch protection and not the files themselves.

## The fix
- **Step A, only Carter can do it (GitHub blocks sessions from changing repo settings):** on the phone, GitHub app
  or github.com → the repo → Settings → General → Default branch → switch to `main` → confirm.
- **Step B, a session does it once Carter says go in its thread** (the safety check refuses a session writing its
  own permission rules without that): add the block below to `.claude/settings.json` on `main`, hooks unchanged,
  via a PR, then merge.

The rules let sessions save, commit and push to working branches without asking, but **still stop and ask** for
anything that touches the live site or can't be undone: any push naming `main`, force pushes, branch deletions,
and merges through the GitHub API. These rules stop direct pushes to `main`; the merge gate in LOOP.md and the
run's own hard limits remain the real guard (a script run through `node` is not checked by them).
**Changed 2026-11-22 after review (PR #186 F1):** `gh api` is allowed for reads only (`"Bash(gh api -X GET *)"`),
because a plain `gh api` write could move `main` or change repo settings without asking.

```json
"permissions": {
  "allow": [
    "Bash(git status*)", "Bash(git log*)", "Bash(git diff*)", "Bash(git show*)", "Bash(git fetch*)",
    "Bash(git pull*)", "Bash(git add*)", "Bash(git commit*)", "Bash(git checkout*)", "Bash(git switch*)",
    "Bash(git branch*)", "Bash(git merge*)", "Bash(git worktree*)", "Bash(git restore*)", "Bash(git stash*)",
    "Bash(git rev-parse*)", "Bash(git merge-base*)", "Bash(git ls-remote*)", "Bash(git ls-tree*)",
    "Bash(git cat-file*)", "Bash(git rm*)", "Bash(git push*)", "Bash(node *)", "Bash(npm *)", "Bash(gh api -X GET *)"
  ],
  "ask": [
    "Bash(git push*main*)", "Bash(git push*--force*)", "Bash(git push*-f*)", "Bash(git push*+*)",
    "Bash(git push*--delete*)", "Bash(git push* :*)", "Bash(git push*--mirror*)", "Bash(git push*--all*)",
    "Bash(gh api*/merge*)", "Bash(gh api*DELETE*)", "Bash(gh api*default_branch*)",
    "Bash(git branch*-D*)", "Bash(git branch*--delete*)"
  ]
}
```

Compared with atlas's order (fix-2026-11-21-session-save-permissions.md): same idea, but atlas's version
auto-allowed every `git push`, including to `main`, and `gh pr` merges, which would let an unattended run push to
the live site with nobody asked. This version keeps those behind a question. It also skips `settings.local.json`:
cloud sessions are thrown away after each run, so that file would never reach the next one.
