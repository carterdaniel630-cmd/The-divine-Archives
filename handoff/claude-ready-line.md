# Claude Ready Line — ordered work queue for the Divine Archives repo

Carter's order, 2026-10-13: everything Muse-side staged in line so Claude Code
can start checking things off when tokens renew. Highest leverage first.

## 1. Protection program (NEW — gates everything below)
Charter being drafted. Security / legal / platform-compliance audit whose
constraints every build below must satisfy. Recommend this runs FIRST —
retrofitting protections into finished exhibits is expensive; building inside
known constraints is cheap.
NAMING & IP POLICY (binding, Carter 2026-10-13): generic names for everything
— no trademarked names, no "X-style" references ("Pac-Man style", "Indiana
Jones style" banned — "-style" still trades on the mark), no copyrighted
characters/plots. Public domain and original creations are the safe ground.
Full policy: handoff/naming-and-ip-policy.md. Enforced by the High Council
consistency auditor on every review.

## 2. The Royal Game of Ur — feature/ur-exhibit
- Prototype: workspace/your_files/the-royal-game-of-ur/the-royal-game-of-ur.html
- Defect list + acceptance criteria: workspace/goals/divine-archives-games-relics-and-interactives/hidden_files/detail-run-2026-10-12.md (section 1)
- Build method: the approved agent systems (all five approved 2026-10-13), work order in
  workspace/your_files/divine-archives-agent-systems-configured/agent-systems-config.md
- Status: first build, establishes true per-exhibit cost before the rest.

## 3. Remaining nine exhibits (after Ur proves the cost)
Prototypes under workspace/your_files/<slug>/; defects + acceptance criteria in
the same detail-run report. Suggested order by audit severity:
1. Senet (scrambled special-house iconography)
2. Astrolabe ('Asr sign error — one-character fix, but geometry needs expert review)
3. I Ching (hexagrams 25/26 swapped)
4. Antikythera (eclipse math mislabeled; invented inscription)
5. Hnefatafl (variant/capture/stalemate issues)
6. Oracle Bones (verdict independent of crack; pseudo-script)
7. Alchemist (innerHTML focus destruction; decorative meters)
8. Mehen (restart-during-animation turn corruption; no undo)
9. Library Rescue (hybrid verdict stands, but RENDERER DECISION STILL OPEN — Carter owns this call before anyone builds it)

## 4. Agent systems rollout (friend executing, Claude reviews)
- Friend's pack: five systems, all approved.
- Config: workspace/your_files/divine-archives-agent-systems-configured/agent-systems-config.md
- Claude's job when back: review the filled config against the actual repo
  (verify every "confirm in repo" note), then bless or amend.

## 5. Graphify wiring verification (authorized, unfinished)
Explicit-main read-only audit: is the graphify codebase map (6,122 nodes,
12,534 edges) wired into the working branch/session or not? Next step was
defined 2026-10-12; still open.

## 6. Gematria tool — IN BUILD (Muse-side)
Interactive calculator: Hebrew gematria + Greek isopsephy + Arabic abjad,
letter-by-letter breakdown, shared-numbers cross-reference. Prototype building
now at workspace/your_files/gematria/gematria.html; Claude reworks it for
production after. (Checked 2026-10-13: no standalone gematria tool found in the
shipped site — only possible chapter mentions.)

## 7. Wave 3 — fifteen new game candidates (Carter: line these up)
Long-term vision: a game for every belief structure. Candidates mapped to
traditions (prototypes to be built Muse-side, then Claude reworks):
1. Pachisi — India (Hindu)
2. Mancala — Africa / Middle East (folk)
3. Nine Men's Morris — ancient Mediterranean / Rome
4. Patolli — Mesoamerica (Aztec)
5. Game of the Goose — early modern Europe
6. Go — China (Daoist / Confucian)
7. Chaturanga — India (Hindu / Buddhist; ancestor of chess)
8. Liubo — Han China (divination board)
9. Alquerque — Egypt / Levant (ancestor of draughts)
10. Fanorona — Madagascar (Austronesian)
11. Bagh-chal — Nepal (Himalayan Hindu / Buddhist)
12. Yut — Korea (folk / shamanic)
13. Konane — Hawai'i (Polynesian)
14. Rithmomachia — medieval Europe (Christian scholastic)
15. Makruk — Siam (Theravada Buddhist)

SHIP STATUS 2026-10-13 21:25: ALL 15 BUILT, VERIFIED, AND PUSHED to
staging/ready-line under handoff/exhibits/wave3/ (pachisi, mancala,
nine-mens-morris, patolli, game-of-the-goose, go, chaturanga, liubo,
alquerque, fanorona, bagh-chal, yut, konane, rithmomachia, makruk).
Also staged: handoff/gematria.html, handoff/games-differentiation-brief.md,
handoff/urantia-room-spec.md, handoff/standards/ (5 build standards),
handoff/audits/, handoff/integration/ (8 docs), handoff/research/
(urantia report), handoff/games-handoff-brief.md, updated claude-ready-line.
Everything in PR #59. Slate clear.

## 8. Arcade placement & form — PARKED (Carter: up in the air)
The games are heading for a massive arcade hall (the hidden-room arcade
concept). Open: games presented in their own historical form vs. arcade
cabinet form. Do not lock this until Carter decides.

## 9. Games differentiation brief — READY for Claude's rework
Carter played the set: good, but too similar-looking. All 25 verified
distinct (no duplicates). Brief at
workspace/your_files/games-differentiation-brief.md gives each game a material
identity + mechanical signature, grouped by the 4 mechanical families (race,
ancient track, chess variants, jump-capture). Hard rule: if two games in one
family feel interchangeable after rework, the rework failed that pair.

## 10. VR museum program — PARKED
Carter: "we can look at the whole VR thing later." Specs complete and filed:
workspace/goals/divine-archives-vr-museum/hidden_files/ (architecture, pilot,
roadmap with Phase 2B WebGPU tier, artistry addendum, comfort/audio/benchmark
briefs). Do not start until Carter reopens.

## 11. Content Truth Policy — BINDING (Carter 2026-10-13)
handoff/content-truth-policy.md. Present what was actually said/believed/made,
accurately and completely, down to the letter. Not about political
correctness — about history. No blurring, no backing off, no silent omissions.
Philosophers' words preserved verbatim; same ethics as religions/faiths.
Creator's expression rights stand alongside respect. Only exception: content
that explicitly violates a religion's own tenets inside its own sacred space.

## 12. Blurred symbols defect — FIX REQUIRED
handoff/defects/blurred-symbols-rolodex.md. Gray blur splotches on the symbol
rolodex wall — unblur or replace with real symbols; no gray blobs. Blur is
baked into the webp sprites (not code); regenerate affected cells.

## 13. Rotunda zodiac floor — REDESIGN
handoff/rotunda-zodiac-floor-spec.md. Move the 12 sign lights from under the
planetarium to a zodiac wheel set in the Rotunda floor. Planets above, wheel
below.

## Staging rule
Nothing here merges to main without Carter's explicit go-ahead. Staging area:
the PR #58 sandbox route (protected directory outside docs/). Carter couriers
files; the friend builds on feature branches.
