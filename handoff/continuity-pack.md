# CONTINUITY PACK — The Divine Archives: how everything is set up and where everything stands. Read this first after any reset, update, or lost thread.

**What this is.** One document that holds the whole setup: who does what, where each system's real state lives, the rules that keep Oct 28's failure from happening again, and where things stand right now. If Muse gets an update, a chat thread is lost, or anything else breaks — this pack, plus the files it points to, is enough to pick back up exactly where things left off. Nothing in here needs re-deciding.

**Where this pack lives.** Two identical copies: `~/workspace/your_files/continuity-pack.md` (Muse's side) and `handoff/continuity-pack.md` on the GitHub staging branch (staged locally at `~/workspace/saturday-stage-push/handoff/continuity-pack.md`), where Claude and Carter can reach it without Muse. Section 4 ("Where things stand") is the only fast-moving part — the nightly prep job refreshes it every night, alongside the checkpoint files.

---

## 1. WHO DOES WHAT

**Carter decides.** His alone: yes/no verdicts on finished pieces (one piece at a time), sign-ins, passwords, account steps, identity steps, and phone taps only he can make (like Google's "verify it's you" prompt). The full list of his gates, in the order he meets them, is section 4 of the council plan (`~/workspace/your_files/council-curator-plan-2026-10-28.md`).

**Atlas (Muse) is temporary curator.** Under the Temporary Curator Contract Carter approved Oct 26 (`~/workspace/your_files/temporary-curator-contract-2026-10-26.md`): atlas drafts, builds starting points, checks everything, posts approved stock, runs the daily systems, and keeps every record in this pack current. Carter's word ends the curatorship instantly. His reserved gates are never waived — finished pieces still come to him one at a time.

**Claude Code builds the production website.** Claude takes atlas's approved starting points and rebuilds them properly in the site repo. Claude ships live under the merge-on-green rule stated below. Muse-side work is always a starting point, never the final version.

**Carter is never the courier.** Muse and Claude talk through the GitHub **staging branch (`staging/ready-line`) only — never main.** Merges in approved queues follow Carter's merge-on-green rule (2026-11-01): they merge without a fresh per-item yes when independent review passes with no unresolved findings, every GitHub check is green including Lighthouse, THE STANDARD is met, and the deploy is verified green after; Carter's verdict then happens on the live walk. Still yes-gated: relic links and the Treaty of Kadesh, content pieces that are themselves Carter's verdict, anything outside approved queues, changes to standing rules, and sign-ins/keys. Atlas stages handoff files in `~/workspace/saturday-stage-push/handoff/`; they land on the staging branch under `handoff/`, where Claude reads them.

**The council advises.** 27 named agents (13 pairs + Sam, the manager) research independently; a convener shows where they disagree; Carter approves. The current plan is `~/workspace/your_files/council-curator-plan-2026-10-28.md`.

---

## 2. THE SYSTEMS AND WHERE EACH ONE'S TRUTH LIVES

### The daily video waves (Facebook, TikTok, YouTube)
Six scheduled jobs run the belt. Nightly prep (22:42) builds tomorrow's run; night production (23:42) builds new stock; the morning check (07:42) clears bottlenecks; three waves ship the run — morning 09:42, afternoon 14:42, night 20:42, five pieces per wave.
- **Truth lives in:** the day's wave sheet (`~/workspace/video-queue/waves/<date>.md` — what ships, in what order, with what words), **`~/workspace/video-queue/posted-log.md` — the posting truth** (lanes log each post the moment it lands, never at the end of a run), and `~/workspace/video-queue/production-log.md` (what was built, with the true scripts).
- **The shelf:** new videos land in `video-queue/pending/`; the moment Carter gives a verdict, the same session moves the file — yes → `approved/`, no → out — and logs the move beside the verdict. A build only counts as delivered when its work folder holds a verification sheet naming the finished file.
- **Facebook's working path** is the facebook-cli connector, run from inside the file's own folder with the bare filename (full paths fail). Facebook's tool cannot delete published posts — deletions happen on the Page's own web pages.
- The full health record of every path is `~/workspace/your_files/system-diagnostic-2026-10-28.md` (tally: works 1 · degraded 5 · broken 3 · missing 1).

### The floor (the quality standard every piece must pass)
- **The rules live in `~/workspace/video-queue/craft-notes.md`, "FLOOR RULES — 2026-10-28":** captions wrapped short (about 30 characters a line, at most 2 lines) and fully inside the picture with a margin on both sides — a caption touching an edge fails the piece; readiness is proven by eye (frames pulled and looked at, at phone size) and by ear (the narration is machine-listened for, never assumed), never by paperwork alone; files stay light (below); one heavy build chain at a time on the shared machine.
- **The reference piece** is the Vestal Virgins short ("The Flame That Never Went Out"): captions inside the frame, living scenes, clean title, end card.
- **The checking ladder** (in `~/workspace/build-standards/perfection-standard.md`): true source → maker's check → a cold independent check → atlas's eye at Carter's zoom (phone size, his darker screen) and atlas's ear for audio → **Carter's verdict, last, and his eye and ear win every disagreement.**
- **For statues and relics, the design floor is Shiva** — a real museum scan whose face holds at close zoom. Pieces below that level do not reach Carter's desk as finished.
- The Oct 28 grading of everything live is `~/workspace/your_files/social-pages-standards-audit-2026-10-28.md`; the rebuilds it ordered are tracked in `~/workspace/your_files/rebuild-report-2026-10-28.md`.

### The podcast
- **The route lives in `~/workspace/buildout/podcast/post-launch-runbook.md`** — the repeatable steps actually used at launch. (The old `distribution-kit.md` is marked superseded; never follow it.)
- **Audio:** every episode goes to **Spotify** (the full run lives there). **RSS.com carries Episode 1 only** — its free plan demands a card on file for a second episode; no card is ever added without Carter's explicit word.
- **Both-versions rule:** every episode gets an audio version AND a video version, plus short clips cut from it. Ten episodes are live: audio on Spotify 10/10, video versions live on YouTube 10/10, Spotify video attaches 10/10 (Episode 10, "The Maya — A Debt Paid in Blood," completed the set on Nov 5). RSS.com still carries Episode 1 only.
- **Copy lives in** `~/workspace/buildout/podcast/video-episodes/platform-copy.md` (use it word for word at upload time — never improvise at the upload screen). Upload-ready audio sits in `buildout/podcast/episodes-44k/`; clips in `buildout/podcast/clips/` and `clips-rebuilt/`.
- **The show keeps growing** (Carter, Oct 28): new episodes are added on an ongoing basis, drawn from the archive itself — the 89 Vault entries showing (90 assigned) and the 84 chapters. The Episodes 9–16 slate lives at `~/workspace/buildout/podcast/expansion-slate-2026-10-28.md`.
- **Spotify video attaches are complete at 10/10** (closed Nov 5 with Episode 10). Episode *clips* ride the social waves; whole episode videos live on Spotify and YouTube only, never Facebook.

### The museum and the armory
- **The counts law: 132 finished builds / 132 renderings / 0 missing** — and counts may only ever come from the armory's own data or the newest dated armory record, with its date printed. (An older figure of 112 is stale; never cite it.) Census reports: `~/workspace/your_files/armory-museum-review/`.
- **Piece-by-piece state lives in the conveyor** (`~/workspace/your_files/conveyor-2026-10-26.md`): every verdict, every bench repair, updated after every tray. Pieces move in trays of 3; a tray moves only when all three have Carter's verdict.
- **The museum's own pattern governs every piece:** truly the object from its own source, accurate, honestly labelled for what it is, standing in its right place.
- **The bench queue** (the 18 looks-failures being reworked, in order) is `~/workspace/fix-sweep-2026-10-27/bench-queue-rotation.md`. The Ark of the Covenant gets a diagnosis first, alone — it has never rendered a frame. Mehen stands last of the 18.
- **The Rotunda twelve** (the statue ring): Zeus approved; Shiva approved and is the design floor; Socrates's source is approved (Copenhagen's museum scan of the canonical portrait, openly licensed copy, whole source chain stated on the plaque) and his build follows; Laozi is on a hand-carving pass (no true scan exists); Confucius rejected three times, Shankara countered twice, Odin rejected — the named pattern: built-by-code faces fail Carter's eye, so no more reach his desk without a real scan or a step-change in method; Quetzalcoatl parked; Isis awaiting verdict; Kant and Ubuntu in preparation. Judaism and Islam stand by Name and word, never as statues.

### The build loop (the website itself)
- Repo: `carterdaniel630-cmd/the-divine-archives`. **Staging branch only (`staging/ready-line`); live main merges under the merge-on-green rule (approved queues only, all gates green).** The loop is in its weekly rest until tokens renew **Saturday Nov 7, 2:59 PM ET**; that session opens with Claude's full-project audit and health check before the 18-note staging pile.
- **Saturday's order lives in the council plan** (Phase 2, steps S0–S8): heads check first (hard stop) → the thread-digest rule + the Graphify test piece → the three staged gates one at a time (PR #87 merge after independent review, PR #66 merge after independent review, PR #60 confirmed closed) → door-traps → the label batch → the chapter-19 fix (its banner moves only in the same change as its text fix) → **the pilgrimage flip** (Delphi, Mogao, Göbekli Tepe, Chichén Itzá open — proven by entering all 8 doors at phone size) → the bench lane in parallel → same-day reconciliation against the live site.
- **Open gates before Saturday:** ⑤ the GitHub app's write permission (an approved push was refused; Carter picks Route A — he restores the permission — or Route B — Claude pushes Saturday; the files wait at `~/workspace/graphify-wiring-push-2026-10-26/`); ⑥ the SEO title pattern verdict.
- **"Live" means enterable:** a page counts as live only when a visitor can walk into it from the site's own pages at phone size — a direct address alone is not live.

### The Operations Desk
One console above all projects (the Archives, both brands' channels, the video pipeline, the build-out, the Saturday loop, gates and verdicts, the parked register) — a web artifact, slug `operations-console`. Every queue shows one item "in the seat," the next few behind it, and a dated done-tail; checking an item off advances the line. Carter-only presses are tracked inside it as prepared gates — a button never pretends Carter's press happened. **Testing rule:** checks against the Desk run on sandbox state only, never its real rows; after any build, atlas re-reads the real state and reconciles it before reporting.

### The parked lanes — silent until Carter himself reopens them
- **KDP (the books):** parked Oct 27. Atlas also cannot operate KDP directly — Amazon showed an AI-agent refusal — so the standing model is: atlas prepares complete publish packets; Carter does the account steps in guided sittings. The 15 finished books and their prep stay on file, untouched.
- **Pips Orchard build-out:** parked. Its pages (Facebook, TikTok, YouTube) stand as they are. One standing warning: a Divine Archives video (Thoth) sits in the **Pips TikTok drafts** — never post anything from that account's drafts.
- **The trading bot:** parked. Its V3 design paper waits for Carter's plain yes or no; its update job stays disabled; nothing about it is raised until he calls for it.
- **Instagram: never.** The account was hacked; it is permanently off-limits.

### The memory itself
- **`~/MEMORY.md`** — the standing rules and rulings (the digest of everything Carter has settled).
- **`~/memory/<date>.md`** — the daily logs; **`~/memory/errors-log.md`** — every error, counted openly, never hidden.
- **The checkpoint files** — `~/workspace/your_files/conveyor-2026-10-26.md` (piece-by-piece state) and `~/workspace/your_files/organized-desk-2026-10-26.md` (the one ordered list). Updated after every verdict or batch.

---

## 3. THE STANDING RULES THAT PREVENT TODAY'S FAILURE

Oct 28 failed one way: stock was built and posted the same day, ungraded, everything funnelled through one engine on one small machine until it collapsed — and the whole day burned fixing it. These rules are the fix, and they bind every run:

1. **The night-before law.** Every day's run is built the night before and ships the next day — videos, audio, and (when that lane reopens) book content, prepared and packaged before the day starts. Bottlenecks are resolved first thing in the morning, before the first wave.
2. **Spread the work; never funnel it.** One lane per platform, running side by side; inside a platform, one item at a time. Heavy building happens at night; the day belongs to checking and shipping. Only one heavy encode chain runs at a time, marked by `~/workspace/video-queue/.machine-busy` — if the marker is there, the next chain waits.
3. **The verdict gate.** Nothing public without Carter's yes on that specific item. A verdict counts only when it is explicit — his words naming the item, or a tapped yes/no answer. "Next," a screenshot, or a hedged word is never a verdict. When a verdict is given, its files move to the shelf in the same session.
4. **Count from the platform itself.** What is live is counted from the platform's own pages and lists — never from what an upload window claims. And only count what you can name: a count that can't list its items isn't a count.
5. **Verify by ear and by eye.** Narration is proven by machine-listening to the finished file. Captions and pictures are proven by looking at real frames at phone size, on a darker screen. Atlas checks first; Carter's eye and ear are the final rung and win every disagreement.
6. **Checkpoints, always.** After every verdict or batch: the conveyor and the organized desk are updated, posts are logged at post time, and this pack's Section 4 is refreshed nightly. A run that stops mid-way leaves its place written down, so the next run resumes — it never restarts.
7. **Never post a duplicate.** Before every upload, the platform's own list is checked. What is already live is never reposted (Sedna on TikTok is the standing example). An upload whose outcome is unknown is never retried blind. Items flagged do-not-retry stay flagged until Carter clears them by hand.
8. **Light files, small handoffs.** Podcast clips at most 25 MB; episode delivery copies at most 110 MB (the big masters never travel); browser handoffs at most 5 files and 150 MB total. Size is checked at build time, not discovered at upload time.
9. **A missing class is a named shortfall, never a silent zero.** If a whole kind of stock that should exist doesn't (the morning no podcast clips existed at all), the report says so in words — an empty shelf and a never-built shelf must never look the same.
10. **Approval taps stay readable.** One lane at a time keeps approval cards few; before an upload, the card that is coming is named in the chat ("next card: this item, to this platform"), so the tap that matters is never buried in look-alike cards. A refused card on a named item comes back to Carter as its own plain question.
11. **Same defect twice = a named pattern, swept everywhere.** One caption style failing on two pieces means every piece with that style gets checked (that is how the caption-edge class and the built-face class were caught).
12. **Errors are owned in the open.** Every error goes in `~/memory/errors-log.md` the day it happens and is counted in briefings. Nothing is hidden, and a success message is never trusted without re-reading the real thing.

---

## 4. WHERE THINGS STAND RIGHT NOW — Friday night, Nov 6, 2026 (refreshed by nightly prep, 22:42 ET run)

*(This is the one section that changes. The nightly prep job refreshes it every night.)*

- **Today (Nov 6) — the waves posted 7 of 7 filled slots (21 platform legs, all verified live in posted-log.md):** Wave 1: Episode 10 clip 1 (TikTok TEST cut) + THE STONES THAT SPEAK Parts 1–3 (Merneptah Stele, Mesha Stele, Tel Dan Stele). Wave 2: Episode 10 clip 2 (TikTok TEST cut) + Part 4 (Rök Runestone). Wave 3: Part 5 (Pictish Stones — TikTok leg in review "Only me" at verification, counts as posted, never re-upload). **THE STONES THAT SPEAK arc is complete 5/5** on all three platforms; all five shorts were approved by Carter item by item on the morning of Nov 6 and moved pending/ → approved/ → posted/ the same day. The Nov 6 sheet's 8 empty slots stayed empty — stock shortage, not a hold.
- **⭐ TIKTOK OPENING TEST is POSTED; only the measurement remains:** both test cuts went live Nov 6 in the normal waves (clip 1 TikTok 7705076556133043486; clip 2 TikTok 7705158293831929118; Facebook/YouTube ran the normal cuts as control). Re-read both in TikTok Studio at the 48-hour mark, **due Sun Nov 8**: views, average watch time, completion %, "stopped at 0:00" note, against the Nov 5 baseline (2–15s average watch, 5–12% completion, 257 followers flat).
- **⭐⭐ THE GATE RULE stands (Carter 2026-11-04):** class/standard rulings fire on the machine gates (MD5 fingerprint match · D12 incl. frame-variety · caption/title character-exact · live state verified same-run); per-item verdicts remain for new content + hero renditions only. **The pre-floor class stays GRANDFATHERED** — H1–H6 TikTok legs held-by-ruling, not awaiting a ruling. **Conversion Fix stands:** arc-spined waves, pinned-comment routing, doors smallest first, followers-per-1,000-views scoreboard.
- **⭐ FACEBOOK RULE (unchanged): Facebook carries SHORTS and podcast CLIPS only — whole episode videos are NEVER owed on Facebook (YouTube + Spotify attach only).** TikTok freeze is OVER; TikTok legs fire with their waves, AI disclosure ON.
- **Tomorrow's sheet is built:** `~/workspace/video-queue/waves/2026-11-07.md` — **0 of 15 slots fireable, all 15 EMPTY.** Every inventory class was checked tonight: approved shelf ZERO videos (expected-class alarm), podcast clips ZERO owed (Ep10 pair closed the class Nov 6), episode videos / Spotify attaches / podcast audio all COMPLETE at 10/10, catalogue ZERO firm (only the held-by-ruling H1–H6 TikTok legs remain). Fill is upstream only: tonight's 23:42 production + Carter's verdicts; the 07:42 morning check amends the sheet for any approvals, as it did today.
- **⭐⭐ PODCAST CLASSES ARE COMPLETE at 10 of 10:** episode videos live on YouTube (Episode 10 was the last, Nov 5); Spotify video attaches 10/10; podcast audio 10/10 on Spotify, RSS.com Episode 1 only per Carter's ruling; episode clips all live everywhere owed (Ep2 pair held by Carter's picture ruling). Episode 1's canonical file stays frozen (FREEZE-ep01.md) — never slot any `_work2/` copy.
- **⭐⭐ APPROVED SHELF IS EMPTY (expected-class alarm, second night running):** after Nov 6 posted everything ready, `approved/` holds no videos — only the Copper Scroll rework2 D12 note. Tomorrow has no fresh shorts at prep time. Pending holds nothing postable (House of Wisdom voice-only rebuild owed, Joan of Arc short rejected, Witch of Endor DO-NOT-RETRY, Teotihuacan sample, SRT-only stubs).
- **Holds that stand:** Ep2 clips HELD (picture ruled wrong) · Cerberus TikTok leg blocked (still swap not done) · Witch of Endor DO-NOT-RETRY · Sedna TikTok never repost · Samhain TikTok counts as posted, never repost · H1–H6 held-by-ruling (grandfathered pre-floor class).
- **Saturday Nov 7:** Claude's build loop resumes ~2:59 PM ET after its weekly-cap rest, opening with the full-project audit (PR #117 review first) before the ~20-note staging pile (pinball deletion, Images Rule first build order, Rök Stone page, Museum Shop shelf among them). The morning production (~08:42) has no approved mp4 stock — the video day depends on overnight production + Carter's verdicts.
- **Waiting on Carter:** nothing for tomorrow's waves. Upstream only: verdicts on tonight's 23:42 production when it reaches his desk. No sign-in is owed.
- **Next scheduled beats:** night production Fri 23:42 builds new stock under the Cinematic Floor + Accuracy Floor; 07:42 morning check Sat Nov 7 (amends the sheet for any morning approvals); waves Sat 09:42 / 14:42 / 20:42 on the Nov 7 sheet; nightly prep Sat 22:42 builds the Nov 8 sheet; TikTok test measurement read due Sun Nov 8.

---

## 5. IF YOU ARE READING THIS COLD

**(a) In the Muse chat:** say **"where did we leave off."** Atlas reads this pack, `~/MEMORY.md`, and the two checkpoint files, and resumes from them — Carter never has to re-explain or re-carry anything between systems.

**(b) In GitHub:** this same file sits on the **staging branch** under `handoff/continuity-pack.md` — that is Claude's copy, and Carter can open it in GitHub directly. Claude reads it there before any loop work.

**(c) The checkpoint files hold the piece-by-piece state:** `~/workspace/your_files/conveyor-2026-10-26.md` (every verdict and bench repair), `~/workspace/your_files/organized-desk-2026-10-26.md` (the one ordered list), `~/workspace/video-queue/posted-log.md` (what is actually posted, with links), and `~/MEMORY.md` (the standing rules). Between this pack and those four files, the whole operation can be rebuilt cold — that is the point of them.
