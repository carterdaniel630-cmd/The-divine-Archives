# graphify
- **graphify** (`.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

# reviewer and auditor
- **reviewer** (`.claude/skills/reviewer/SKILL.md`) - the project reviewer; its rules are `reviews/REVIEWER.md`.
  Trigger: `/reviewer`, or any review of work before it reaches Carter.
- **auditor** (`.claude/skills/auditor/SKILL.md`) - audits the reviewer; its rules are `reviews/AUDITOR.md`.
  Trigger: `/auditor`.
