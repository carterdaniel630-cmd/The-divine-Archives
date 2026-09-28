# Virtual Museum — Stage 0 CONTEXT (governance)

**Track:** Virtual Museum. **Branch:** `claude/virtual-museum`, cut from `origin/main` at
`ba6781e` (2026-09-28). **Stage:** 0 closed. Phases 1–4 were built in one batch at Carter's request (2026-09-28); see `museum/01-build/REPORT.md`. **Owner / approver:** Carter.

## Goal
A walkable 3D museum at getconexto.com: halls and rooms, one room per chapter (or tradition), with
exhibits (Vault objects, Pantheon figures, chapter symbols) that open the archive's existing pages.
It is an **immersive entry point layered over the site**. The static chapter, Vault and Pantheon
pages stay the canonical, indexable content. The museum never replaces or duplicates them.

## Non-negotiable constraints
1. **Generated, not re-written.** Room contents come from the site's existing data files
   (`docs/assets/data.js`, `vault-data.js`, `pantheon-data.js`, `plates.js`, `emblems.js`) through a
   build step. There is no hand-maintained second copy of any caption, date or verdict.
2. **Evidence honesty carries into 3D.** Every label card keeps the sacred claim and the historical
   verdict distinct, exactly as the source page does. A replica or stand-in prop is labelled as
   such, never presented as the object. Contested claims are shown as contested.
3. **Sensitivity rules inherited from the data:**
   - Figures drawn with `glyph:` heads (Muhammad, Fatima, Ali) appear as calligraphy panels, never
     as statues.
   - Secret-sacred material gets no image, as the Vault already does for the tjurunga (V68).
   - Living traditions are not framed as extinct or "primitive" by their wing placement.
4. **Zero SEO impact.** The museum is `noindex`. It stays out of `sitemap.xml`, which is an explicit
   allowlist in `tools/build-pages.js`. No static page changes except, if approved, one nav link.
5. **A non-3D fallback always exists**, linking straight to the normal pages.
6. **Performance budget is a gate, not an aspiration** (see PLAN §9).
7. **Standing project rules apply:**
   - production deploys from `main` only;
   - no domain, DNS or infrastructure changes without instruction;
   - no model identifiers in files;
   - real sourcing only.

## Stage 0 rules (this stage)
- Planning only: no 3D code, no npm installs, no asset generation.
- Only `museum/` is edited on this branch.
- The repo wins over the live site; anything not found is reported as not found.
- Nothing counts as done without a committed file.
- No merge, no PR, no deploy.

## Gates
Each phase ends with a commit, a short report and **Carter's explicit approval** before the next
phase starts. Gate 0, which closes this stage, needs three things from Carter:
- a layout choice (A or B);
- a tech choice;
- a direction on the open decisions in PLAN §13.

| Gate | Passes when |
|---|---|
| G0 Scoping | Carter approves the layout, the tech choice and the answers to PLAN §13 |
| G1 Tech spike | Grey-box room meets the §9 budget on a real mid-range phone and a desktop |
| G2 Style | Carter signs off the look-development frames for the pilot room |
| G3 Pilot (preview) | Pilot works on the preview alias: interaction, fallback, a11y, noindex checks pass |
| G4 Pilot (production) | Carter approves going live at `/museum.html` |
| G5+ Expansion | One wing per phase, each approved separately |

## Status of the gates (2026-09-28)
- **G0 and G4:** passed on the PLAN §13 recommendations, as Carter asked for the whole plan in one batch.
- **G1:** budget met in emulation (see the report). The real-phone half is owed, together with G3.
- **G2 (style):** open. Carter reviews the live museum.
- **G3 (real device):** open. Emulation only so far.
- **G5+:** superseded, because every wing was generated at once.

## Files in this stage
- `CONTEXT.md`: this file.
- `PLAN.md`: the audit and the plan (sections 1–13 of the brief).
