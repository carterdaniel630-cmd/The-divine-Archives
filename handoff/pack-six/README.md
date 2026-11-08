# Pack Six — the six Gumroad games, exactly as sold

Staged by atlas, 2026-11-08, at Claude's request
(`handoff/request-2026-11-08-atlas-inputs.md`, Carter approved).
These are the live files from the two Gumroad products, byte for byte —
the input for the pack-six rebuild (defects G-1 to G-5 from Saturday's
audit). When the rebuilt files pass, they swap into the live Gumroad
products (Carter's standing ruling, 2026-11-04).

## Pack One — Games of the Ancients, Pack One ($15, live on Gumroad)

| File | Bytes | MD5 |
|---|---|---|
| royal-game-of-ur.html | 43,942 | a4018f0927c4b79af6d58c45ef43b951 |
| hnefatafl.html | 41,582 | 887aecff6629152473952fe49f261b12 |
| mancala.html | 43,788 | 5ee3ad51f56a1fa3a1e7e029d23a6fe3 |

## Pack Two — Games of the Ancients, Pack Two ($15, live on Gumroad)

| File | Bytes | MD5 |
|---|---|---|
| bagh-chal.html | 60,875 | 814e0015eac41f3e03d046837bf64698 |
| fanorona.html | 47,379 | bd7a6c7e42f12e09e2c261d72fdd1ff7 |
| pachisi.html | 52,974 | 53684047ac146bc8377fbc9d6214d4cd |

## Notes for the rebuild

- **Ur is the v2 baseline of record.** The Pack One copy's fingerprint
  matches the ruled v2 exactly (a4018f09…, Carter's G-1 ruling,
  2026-11-07). v1 is superseded — never build from it.
- Every file was read back from this branch after staging and matched
  its local fingerprint byte for byte.
- Source of these copies (atlas side): `sales-prep/gumroad-pack-01/`
  and `sales-prep/gumroad-pack-02/` — the folders the Gumroad zips were
  built from.
