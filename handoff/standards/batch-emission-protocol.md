# Batch Emission Protocol — "Hard Batch Engine"

Ratified by the user October 12, 2026. Standing protocol for generating
large-batch asset datasets that mesh directly with the production codebase
(Claude Code) and pass automated testing suites.

## Execution framework (binding on every batch)
1. **Component schema integrity:** every entry is output as a fully unrolled,
   production-ready structural object. Truncation, partial entries, or
   placeholder comments (e.g. `// ... rest of data here`) are strictly
   forbidden — they break the static parsing engine.
2. **Native memory hooks:** every asset entry includes the explicit properties
   required for manual object allocation and teardown lifecycles —
   structural configs compatible with raw vanilla JS instantiation and
   explicit memory release pipelines (`.dispose()`).
3. **Zero-elongation chat output:** suppress all conversational prefixes,
   introductions, formatting guides, and closing dialogue. The entire output
   is raw code inside a single clean markdown block, copy-pasteable into
   the Claude Code environment with zero refactoring.

## Usage
A batch request names the target items (e.g., "all 72 Goetic seals with
geometry," "the 199 Pantheon entities with attributes," "fighter move-data
tables"). The emitter processes every item under this framework, no
exceptions.
