# Vault Manuscripts — Batch Emission Layout

For the 5 Vault manuscripts present on the live site but missing from
production. Batch-engine format, ready for Claude Code integration.

## Diff status — RESOLVED 2026-10-12 (read-only GitHub check, zero Claude tokens)
- Live-site Vault: **88 manuscripts** (surveyed 2026-10-11/12; V01–V88 consecutive, no gaps).
- Production repo `vault/` on `main` (carterdaniel630-cmd/the-divine-archives):
  **88 files** (`v01-voynich-manuscript.md` … `v88-skull-reliquary-saint-maximin.md`).
- `vault-diff.py` run against the repo file list: **88/88 matched, 0 missing.**
- The earlier "83" count (Claude Code repo audit) was stale — the repo already
  holds all 88, with substantive content (spot-checked V88: 8,786 chars).
- **No batch emission needed.** This layout is retained only as the template
  in case a future live-vs-repo drift is ever detected.

## Batch layout (Hard Batch Engine rules apply)
- Every entry fully unrolled — no truncation, no placeholders.
- Native memory hooks on every entry (`mount` / `dispose`).
- Output: raw code, single markdown block, zero conversational filler.

```js
// TARGET FILE: /assets/vault/manuscripts.batch.js
// ASSET REGISTRY (5): <slugs of the 5 missing manuscripts>
// SCHEMA: VaultManuscript {
//   id, slug, title,
//   vaultFacts: { held, dateEvidence, era, archiveRefs[] },
//   lead,
//   sections: [{ heading, paragraphs[] }],   // bold-lead paragraphs per site convention
//   evidence: { supported[], unsupported[], open[] },  // the three honest verdicts
//   sources: [{ title, url }],
//   connections: [{ label, href }],
//   mount(host), dispose()
// }
// SITE MAPPING (per site-structure.md): header crumb + eyebrow "The Vault ·
// Texts & Tablets" + h1 + badge + dl.vault-facts (Held / Date evidence /
// Era / In the archive) + p.lead + h2 essay sections + evidence block +
// Sources + Connections list. Images hot-linked from holding institutions
// only — never rehosted.

function mountManuscript(host) {
  if (host && this.html) { host.innerHTML = this.html; this._host = host; }
  return this;
}
function disposeManuscript() {
  if (this._host) { try { this._host.innerHTML = ""; } catch (e) {} this._host = null; }
  this.html = null;
  return null;
}

const VAULT_MANUSCRIPTS_BATCH = [
  // ENTRY 1..5 — one fully unrolled object per missing manuscript,
  // following the schema above. Evidence honesty is binding: separate
  // attested / reconstructed / disputed in the evidence block, per the
  // archive's standards. No invented sources — every claim cited or
  // marked UNVERIFIED.
];

VAULT_MANUSCRIPTS_BATCH.disposeAll = function () {
  for (var i = 0; i < VAULT_MANUSCRIPTS_BATCH.length; i++) {
    VAULT_MANUSCRIPTS_BATCH[i].dispose();
  }
  return null;
};

if (typeof module !== "undefined" && module.exports) { module.exports = VAULT_MANUSCRIPTS_BATCH; }
```

## Field notes for the author (whoever fills the 5)
- `vaultFacts.held`: holding institution, exactly as the live Vault states it.
- `dateEvidence`: what dates the manuscript and how certain that is.
- `evidence.supported/unsupported/open`: the three verdicts, in the
  archive's honest voice — never present tradition as verified history.
- `sources`: title + link per claim; UNVERIFIED where unsourcable.
- `connections`: "In the Vault / In the Pantheon" cross-links per live entry.
