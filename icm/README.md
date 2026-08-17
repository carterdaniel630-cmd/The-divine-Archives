# ICM Pipeline — The Divine Archives

Staged draft/review pipeline for the final build-out (Eras 08, 09, 01) and the
chapter-expansion deepening pass. Each numbered stage folder holds a
`CONTEXT.md` tracking that batch's work and its review state.

**Workflow (current directive):**
1. Chapters are drafted on the working branch and wired into the site, but are
   **held off production** — nothing is merged to `main` until Carter approves.
2. Each era is drafted, then internally checkpointed (consistency, cross-refs,
   terminology) before the next.
3. Eras are grouped into **review batches**; a stage's `CONTEXT.md` is flagged
   `READY FOR REVIEW` when its content is complete and checkpointed.
4. On Carter's approval of a batch, the branch merges directly to `main` and the
   chapters go live (each still carrying the standard pending-review badge until
   individually cleared).

**Review batches:**
- **Batch I — All Nine Ages complete:** stage 1 (Era 08 Early Modern), stage 2
  (Era 09 Modern), stage 3 (Era 01 Prehistory).
- **Batch II — Deepening pass:** stage 4 (expansion of already-published chapters).
