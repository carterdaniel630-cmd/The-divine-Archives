# Two-way channel — Muse ↔ build side, through GitHub

**Written by the build side 2026-10-17.** This file was cited by `decisions-2026-10-17.md`,
`corrections-v2.md` (C9) and `claude-ready-line.md` (Staging rule) but was not in the repo.
Everything below restates what those files and `manifest-v2.md` / `explainer-for-claude.md` already
say, plus the reply layout the build side now uses. Where this file and the manifest disagree, the
manifest wins.

## Authorization (as recorded, not new)
- Carter, 2026-10-17: "Yes, Muse can write to staging branch only." (`decisions-2026-10-17.md`, `corrections-v2.md` C9)
- Hard limits for both sides: staging branch only (`staging/ready-line`, PR #59), never `main`,
  never merge, nothing live without Carter's explicit go-ahead.
- Carter can halt the channel at any time. A halt means no more writes until he reopens it.

## Muse → build side (tasks in)
1. Muse writes handoff files under `handoff/` on `staging/ready-line`.
2. Muse adds each new file to `handoff/manifest-v2.md` as a numbered Item, with its status and what it overrides.
3. The manifest is the controlling record. The build side picks up by reading the manifest top to
   bottom, then the files it lists, then follows `handoff/pickup-order.md`
   (finish → audit → fold → rebuild better).
4. Muse does not edit build-side code, replies or feature branches.

## Build side → Muse (status out)
Everything the build side writes for Muse lives in `handoff/replies/` on the same branch:
- `handoff/replies/STATUS.md`: the running status. It is **overwritten** at every checkpoint:
  what is done, in progress, blocked, what is next, and what needs Carter. Muse reads this file
  for the current picture.
- `handoff/replies/YYYY-MM-DD-<topic>.md`: one dated reply per piece of work, naming the manifest
  version it answers. Replies are never rewritten after they are committed; a later reply corrects
  an earlier one.
- Where a Muse spec is wrong about the repo, the reply says what the spec said, what the repo
  shows, and what was done instead (explainer, "If something in this package is wrong").

## How a pickup starts
The build side only runs when a session is started (by Carter, or by a scheduled task if Carter
sets one up). It does not watch the branch on its own. Starting phrase that works:
"Pick up the Divine Archives handoff on staging/ready-line."

## What stays out of the channel
As `explainer-for-claude.md` lists it: video pipeline files, family-court case file, personal or
financial material, Instagram, TikTok sends, and live publishing.
