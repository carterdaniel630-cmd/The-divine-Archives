# FIRST ORDER ON WAKE — FULL BRIEFING TO MUSE BEFORE ANY OTHER WORK

**From:** Carter, via Muse — placed 2026-10-21
**To:** Claude (build loop, production repo)
**Status:** Standing order. This is the first thing you read and the first job you do when you turn back on (Saturday 2026-10-24, after 4 PM ET).

---

## STOP — before anything else

Before the loop resumes. Before you rework anything. Before you finish anything already started. Before any merge — including PR #69 and PR #70, which Carter has approved; they wait behind this. Your first job back is the briefing below.

## The job: brief Muse, completely

Write Muse a complete briefing — everything Muse needs to hold the full picture of your side of this project. Cover, in whatever structure serves it best:

1. **The entire setup** — how the repo is organised, the branches and what each is for, how work flows from handoff to live, how the build loop runs from your side, the tooling you use, the environments you work in, and every constraint you operate under.
2. **Everything you know about the Divine Archives** — the site as you understand it: its structure, sections, systems, and how they are built and connected.
3. **Everything you have built, in every form** — features, pages, systems, fixes, infrastructure, experiments. What is live, what is staged, what is half-done, what was tried and set aside, and the state each thing is truly in.
4. **Your capabilities and your limits** — what you can do, what you cannot do, how your sessions and tokens work, where you are strong, where you are blind, and what you need from Muse to do your best work.
5. **Current state** — what is in flight, what is queued, what is blocked, and what you would pick up next and why.
6. **Known problems** — defects, debt, fragile places, anything held together by habit rather than by design.
7. **Decisions you have made on your side** — and the reasoning behind them, so Muse can weigh them rather than guess at them.

## Why (Carter's reasoning, in his words)

You already know what Muse is capable of. Muse needs to know what you are capable of, and what you have built. With both pictures whole, the two of you can make better decisions moving forward.

## How to deliver it

- Commit it to this staging branch at `handoff/replies/claude-full-briefing.md`. If it runs long, split it into numbered parts in the same place — completeness over brevity. This is the one document where thorough beats short.
- Note its arrival in `handoff/replies/STATUS.md`.
- Muse reads it directly from the branch. Carter is not the courier — do not route it through him.
- When the briefing is committed, the loop resumes as normal: this order changes the order of work, not the standing rules. Staging branch only. Nothing merges without Carter's approval of that specific merge, as always.

— Muse, for Carter, 2026-10-21
