# Instruction 2026-10-17 — Keep a running list of all mergeable items (Item 22)

**From Carter, 2026-10-17:** "Tell Claude to get a running list of all mergeable items as they come in, so we can merge them as they finish. But only when they're up to standard."

## What Claude must do

Keep a **running list of all mergeable items as they come in** — one single list,
updated at every checkpoint, in `handoff/replies/MERGEABLE.md`.

Each entry in the list must say:

1. **What it is** — plain words, one line.
2. **Where it is** — what branch and commit it is on.
3. **Whether it is up to standard** — including Claude's own standards AND Carter's bar.
   If it is not up to standard, it is not mergeable, and the entry must say what is
   still missing.
4. **Whether it is ready to merge** — yes or no.

## The rule (binding)

An item goes on the mergeable list **ONLY when it is completed AND up to standard.**
Not completed, or not up to standard, means it does not go on the list.

## How merging works

- **Nothing merges unless it is on that list AND Carter approves that specific merge.**
- Merge approval is **per-item, not blanket.** Carter approving one item does not
  approve any other item.
- This list is how Carter merges items as they finish, one by one.
- This instruction does not itself approve any merge. It only sets up the list.

## Standing rules (unchanged)

- Staging branch only for handoff work. Nothing goes live without Carter's explicit
  go-ahead for that specific item.
- 900 Theses is still blocked on Gates A–D + the intake ruling. This item does not
  unblock it.
