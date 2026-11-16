# Run 2026-11-16 21:50 UTC — Pilate Stone museum model stood upright, PR #176

Builder of #176; must NOT review it. Lock taken 21:51 UTC, released at the end of this run.

## Why this item
STATUS 0gi (1), top of Next after #173 merged: `order-2026-11-15-pilate-stone-orientation-fix.md` (staged on Carter's go;
his 2026-11-14 answer (1) **a**, "turn it upright (letters re-fitted)").

## Done
- **PR #176** `loop/pilate-stone-upright` `2562211d`, off `main` `2ceda1ec`, marked ready for review so every check runs.
- `docs/museum/relics.js` `CAT.v44`: block 0.82 wide × 0.65 high → **0.65 wide × 0.82 high**, depth 0.20 unchanged. Letters
  sized in metres (6 cm, per CIIP); baselines and right margin keep their old distances from the top and right edges, so
  the inscription (letters, gap, line-4 stroke, reading direction from the 2026-11-08 fix) is unchanged. Nothing else changed.
- Vault still `docs/assets/vault/stills/pilate-stone.webp` re-rendered from the corrected model (it is a render of the model).
- `sources/v44-pilate-stone.md`: one line recording the change and its source.
- Previews: `handoff/previews/pilate-upright/` (before/after still, inspector at 360, in-room from four sides).

## Conflict in the order (flagged, not followed)
The order calls 82 × 65 × 20 "width × height × depth" and asks for "wider than tall". CIIP II 1277 (Judaism and Rome
record, re-opened this run: Height 82 cm, Width 65 cm, Depth 20 cm) and Wikipedia's infobox say 82 is the **height**.
The model was already 82 wide, so the order's wording would have been a no-op. Built to the source, which matches
Carter's (1a). Put to Carter in STATUS → Needs Carter as a confirm-only item.

## Not possible from this session
No photograph of the real stone could be opened (Wikipedia's media API is blocked by the session's network; museum
sites are not reachable). The named-detail comparison in the PR is against the CIIP record's measurements, description
and diplomatic text. The reviewer should add a photograph comparison if it can open one.

## Checks (builder)
Full build order: no diff beyond the commit. 18/18 `tools/verify-*.js`; `node --test framework/test/*.test.js` 51/51;
`review-checks --base origin/main --build` 9 PASS / 1 WARN (wikipedia-share on V44's source log, pre-existing). Headless
`museum.html#ch13` at 360×780 and 390×844: 0 page errors, no sideways scroll; V44 inspector upright and readable; in-room
from four sides it stands inside its case. graphify CLI present; `graphify update .` run.

## Next
#176: independent review by any other session (diff `origin/main...2562211d`: one CAT entry, the still, one source-log
line; re-open CIIP; check nothing but the w/h swap and the letter-fit maths changed); GitHub green incl. Lighthouse;
then **Carter's per-item yes** (relic). Then STATUS 0gi (2) re-sourcing, (3) #169 → #170 VR re-sync.
