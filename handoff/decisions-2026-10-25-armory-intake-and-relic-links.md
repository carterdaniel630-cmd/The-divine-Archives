# Carter's rulings — 2026-10-25 ~02:45 UTC: Armory intake, and live links to the real relics

Recorded by a chat session. Carter's words, verbatim:
- Live relic links: "yes add all three as long as free, protected along with our guideliness."
- Armory batches: "10s a good place to start yea"
- Volumes (his message before): "roughly 100 … 200 characters from the pantheon, and eventually 100 plus pilgrimages to
  build out. it will come in second though."

## 1. Live links to the real relics: APPROVED as a feature (all three kinds)
Each Vault/museum relic may carry up to three outside links, shown in the inspector:
1. **3D scan**: the published scan, in its maker's own viewer (extends today's `docs/museum/scans.js`, 11 objects).
2. **The museum's own page or zoomable image viewer** for that object (its collection page, or its IIIF viewer where
   it has one).
3. **Live camera**: only where the holding museum or site really runs one. Most relics will have none; never invent one.

Conditions (Carter: "as long as free, protected along with our guidelines"):
- **Free:** no paid service, API key, subscription or account, for us or for the visitor. If a source charges or needs
  a key, it is left out.
- **Protected:** link or official embed only. Nothing is copied, downloaded or rehosted. An embed is used only where the
  source offers one for public use; otherwise a plain link out. Nothing loads from the outside site until the visitor
  taps, as `scans.js` already does.
- **Our guidelines:** every link is opened and checked once, labelled with whose it is
  (museum, maker, independent), and logged in the object's source log. A link checker catches dead links. Sacred
  restrictions win: no link for a withheld or restricted object (e.g. V68 Tjurunga stays withdrawn), and no link where
  the community or holder asks that it not be shown.
- Build it on its own `loop/*` branch with full checks and independent review. **Going live still needs Carter's yes
  for that PR** (this ruling approves building the feature, not merging it).

## 2. Armory intake: batches of 10 (approved)
- **Order:** the three already-approved merges first (#76 → #75 → #77), then **the Armory (~100 pieces)**, then
  **the Pantheon characters (~200)**, then **the Pilgrimage sites (100+), second in line behind the Armory per Carter**.
  (Carter's word order was Armory, Pantheon, Pilgrimage; if Muse or Carter says otherwise later, the newest word wins.)
- **Batch size 10.** Muse sends the next batch only once the loop has worked the previous one (STATUS says so).
- **For Muse, per piece:** its own folder under `handoff/armory/batch-NN/<piece>/` on `staging/ready-line`; one manifest
  Item per batch listing its pieces; the approved build file, a saved picture or screen recording of it as approved
  (the floor), real files, not base64 text; any three.js written to use the site's own copy
  (`docs/assets/vendor/three/three.module.min.js`); an `armory-entry.md` like the six already in `handoff/previews/`.
- **Pantheon characters:** each attaches to its existing Pantheon entry (199 figures today) and its sources; a figure
  not yet in the Pantheon is new content and needs Carter's yes.
- **Loop handling:** one piece per run under the Rework Standard (floor in hand, side-by-side proof, no-backwards
  checklist, auditor signs, Carter merges) and the Council constitution (no new room without a full chapter; games
  live in rooms). A piece that fails its checks is kept, never deleted (game preservation). Nothing goes live without
  Carter's yes for that piece or batch.
