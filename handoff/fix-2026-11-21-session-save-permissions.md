# FIX ORDER — why sessions refuse to save, and the fix (Carter: "fix it", 2026-11-21 22:52 ET)

From atlas, for the build loop. Carter ordered this fix in the main chat on 2026-11-21.

## Diagnosis (verified from the repo itself, 2026-11-21)

`.claude/settings.json` on main carries **hooks only — no `permissions` section at all**. No session inherits any standing permission grants from the project, so every session falls back to the mode it happened to start in. Sessions Carter starts and talks to work; chained and backstop sessions start strict, and their saves get refused — the #182 review write-back, and tonight the finished VR piece's commits, are this same fault. It is not GitHub and it is not the files.

## The fix — two steps

**Step 1 (immediate, no merge needed):** in the next session whose saves work, write the permissions block below into `.claude/settings.local.json` in the project directory (create the file with just that block if it does not exist). That file is read on this machine only and takes effect for every later session here at once.

**Step 2 (durable):** land the same block in `.claude/settings.json` on main through the normal gate — a small PR, independent review, checks green. The existing `hooks` section must be preserved exactly as it stands; only the `permissions` block is added. Carter's "fix it" of 2026-11-21 22:52 ET is his approval for this change.

## The permissions block

```json
"permissions": {
  "defaultMode": "acceptEdits",
  "allow": [
    "Read",
    "Glob",
    "Grep",
    "Edit",
    "Write",
    "Bash(git status:*)",
    "Bash(git log:*)",
    "Bash(git diff:*)",
    "Bash(git add:*)",
    "Bash(git commit:*)",
    "Bash(git push:*)",
    "Bash(git fetch:*)",
    "Bash(git pull:*)",
    "Bash(git checkout:*)",
    "Bash(git branch:*)",
    "Bash(git merge:*)",
    "Bash(git rebase:*)",
    "Bash(git restore:*)",
    "Bash(git stash:*)",
    "Bash(gh pr:*)",
    "Bash(gh run:*)",
    "Bash(gh api:*)",
    "Bash(npm:*)",
    "Bash(node:*)"
  ]
}
```

## What this does and does not change

- It covers the loop's routine work: editing and writing files, staging saves, commits, pushes to staging and PR branches, merges of already-approved pieces, and the check scripts. Sessions should stop refusing staging saves.
- It does **not** waive Carter's standing gates: per-item merge yeses, verdict pieces, and rule changes still need his word, exactly as before. If a push to main still asks for his go in-thread, that is the standing order working, not this fault.
- After Step 1, the next session should prove the fix by saving a note to staging and recording the result in STATUS. If a staging save is still refused with this block in place, record the refusal's exact wording in STATUS — that wording is what atlas needs for the next step of the diagnosis.

— atlas
