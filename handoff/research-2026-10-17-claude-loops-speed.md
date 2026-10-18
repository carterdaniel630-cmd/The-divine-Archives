# Item 19 — Claude Loops / Speed Research (ADD-ON, Carter 2026-10-17)

**Status:** Research findings + spec. Carter approved staging when done: "When it's done, I approve it to GitHub."
**Full breakdown page (Muse side):** artifact page slug `how-claude-stays-fast-at-scale` — "How Claude Stays Fast at Scale."
**Source report (Muse side):** research notes, Claude loops / speed video report (2026-10-17). This file is the complete repo-bound summary; the full HTML page is NOT copied into the repo.

## What was researched

Carter sent two screenshots from a TikTok by "breakpoint" (@breakpoint, "visit breakpoint.blog for more").
Caption: "Claude shipped 3,000+ changes to claude.ai in two weeks and nothing...more" (truncated in screenshot).
Frame 1: "proof: the message tree", "id map", "1 lookup per id", "CPU instructions −48%", "wall-clock time −78%".
Frame 2: "#claude-apps-perf", loop diagram: thread → benchmark → PR → flag → field → ratchet.
Question: what video is this from, what does it actually teach about how Claude loops, expands on information, and stays fast at scale?

## Finding 1 — The TikTok is an explainer of one Anthropic post

The TikTok video itself could **not** be retrieved: no TikTok URL, video ID, upload date, title, or transcript found anywhere searched (TikTok pages are not indexed for this creator/video). Its content is positively identified anyway: both screenshots + caption match, frame-for-frame and number-for-number, Anthropic's engineering post **"How we made claude.ai 3x faster in two weeks"** — https://claude.dev/blog/how-we-made-claude-ai-faster/ — published 2026-09-23. The breakpoint TikTok is a short explainer/summary of that post.

breakpoint.blog itself (https://breakpoint.blog/) is a daily engineering-questions / blogs aggregator ("Blogs collects every post from 68 company engineering blogs"). No matching Claude article was found on breakpoint.blog itself.

Confidence: HIGH that the source material is the Anthropic post (exact matches: 3,000+ changes / two weeks, `#claude-apps-perf`, −48% / −78% pair, loop steps). MEDIUM/LOW on anything specific to the TikTok beyond the two frames — its narration, length, title, and date remain unverified.

## CORRECTION — 30,000 is WRONG. Do not use it.

**No source says ~30,000 updates.** Anthropic says **>3,000 changes in two weeks** (plus >150 concurrent threads, >200 changes on the busiest days, 50–100 PRs per thread). "30,000" is unsupported — likely a 10x misremembering of 3,000.

**Where this research and Item 18 disagree, THIS RESEARCH WINS.** Item 18's scale line ("~30,000 updates shipped without bogging down") is STRUCK. The correct figure is >3,000 changes in two weeks. Item 18's loop framing stands; only its scale number is corrected.

## CORRECTION — "id map / 1 lookup per id" is the creator's gloss, NOT Anthropic's wording

Anthropic's text does **not** say "id map" or "1 lookup per id". What it actually says: a quarter of the message-tree path's instructions were megamorphic dictionary lookups **resolving the same message ID three separate times**. In about an hour: instructions −48% and −31% (two hot paths), wall-clock −78% and −44%. Two new ratchets were checked in.

"Build one id→message index once and look each id up once" is a plausible description of the fix, but it is the TikTok creator's explanation — treat it as a gloss, not a quoted Anthropic claim. The underlying mechanism (dictionary lookups are slow in V8) is standard JS-engine knowledge, but the exact fix code is not published in the post.

## What the post teaches (plain words)

**One sentence:** Give an agent a *deterministic number to beat* for each slow user journey, run a tight loop (thread → benchmark → PR → flag → field data → ratchet) in parallel across many threads, let each new measurement spawn more work, and lock every win in with a CI ratchet + flags + human approval — so thousands of small fixes compound to ~3x faster without slowing down or breaking anything.

### Pick the journeys that matter, not everything
Users said claude.ai was slow. Anthropic focused on **4 journeys = 95% of user activity**: launching the app, starting a conversation, loading an existing conversation, sending a message — split into **13 distinct measurements**. Each measurement starts with a user interaction, ends once the result is rendered, separates client vs server work. Kickoff: ~20 hand-picked projects, Claude estimated each in milliseconds, targets aggregated. **Hit 12 of 13 targets by day 3.** Early wins: static composer baked into HTML (type while React initialises), precompiled V8 code cache, composer kept mounted between conversations, sessions prefetched on hover, sidebar re-renders cut 90%.

### The core trick: measure deterministically, then hill-climb
Wall-clock time is what users feel, but it is too noisy/flaky to gate code on. Solution: **deterministic counts** — for pure-JS hot paths, literal CPU instruction counts (Valgrind + `node --predictable`, one run, no statistics); for browser paths, a ladder: React commits per interaction, V8 function-call counts, layout/style-recalc counts, DOM mutations.

Every new benchmark had **two jobs**: (1) a metric Claude could move in the lab, (2) a CI guardrail whose number could **only ratchet down**. Flaky benchmarks, or ones that didn't correlate with user latency, were thrown out rather than letting Claude "climb the wrong hill."

**Central lesson (Anthropic's words): "With Claude, measuring something makes it tractable."** Measurement used to be step zero (add metric, wait for data, then understand). With Claude it is step one of the climb: as soon as Claude has a number to beat, it can start optimising. So the highest-leverage work is **finding more things to measure**.

### The loop — thread → benchmark → PR → flag → field → ratchet
Anthropic's 6-step loop, run in the single Slack channel `#claude-apps-perf`:
1. **Thread** — someone opens a thread about a slow stretch of a journey, often with a screenshot/recording.
2. **Benchmark** — Claude traces the flow, then finds or builds a benchmark that demonstrates the problem.
3. **PR** — once it has a promising lab result, Claude comes back with PR(s) — often several, sized for risk and review, with anything user-visible behind a **flag**.
4. **Field** — after it ships, Claude watches the deploy and reads the field (real-user) data.
5. **Ratchet** — if performance improved, Claude locks the win in by **ratcheting the benchmark down**; if not, it turns the flag off and iterates.
6. **Next** — then it goes looking for the next slow spot in the same journey.

Worked example — sidebar jank: a recording showed sidebar rows popping in after load; existing monitors missed it because each Cumulative Layout Shift scored only ~0.008 (good threshold 0.1). Fix: use the Layout Instability API directly; Claude built telemetry mapping each `layout-shift` entry's sources to a named region (sidebar, transcript) and phase, plus an integration test (populated sidebar, hold data past first paint, fail on any shift in any named region) — red 20/20 on main, green 20/20 on the PR. Field data then showed **31% of web page loads moved something after the page was usable, with no user interaction**. Claude fixed the top offenders by name, then found the next batch.

### How it "expands" and stays fast at scale
- **Threads don't close; they keep going.** Instead of closing a thread once its request was fulfilled, Claude kept going. One thread put up **50, sometimes 100 optimisation PRs**.
- **Claude opens its own threads.** Increasingly it was Claude, not a human, opening new threads to chase opportunities it found on its own (separate investigations, nightly jobs).
- **Every measurement finds something.** Examples: React hook census — **6,900 hooks + 900 store subscriptions** in the composer's typing path, re-rendering on every keystroke. One `:root:has()` CSS selector adding **24 ms to every DOM change**. A leftover `location.reload()` causing **500,000 hidden reloads/day** that no load metric could see. Identical cache snapshots cloned into IndexedDB **twice a minute on the main thread**.
- **Each new instrument breeds more work.** ~**1/3 of PRs included additional telemetry or guardrails**, and each new instrument generated more threads with more opportunities. That is the self-expanding loop: measure → fix → add guardrail/telemetry → new measurement → new threads.
- **Parallelism is just opening more threads.** "Once the loop worked on one thread, running it on more was just a matter of opening them." Peak: **>150 threads at a time**. Busiest days: **>200 changes landed**. Total: **>3,000 changes in two weeks**, zero customer-facing incidents, zero rollbacks (Anthropic's claim — see verification).
- **Steering keeps it from bogging down / sprawling:** (a) **Ambition** — humans pushed Claude to be bolder ("be braver", "targets are not the stopping point, what's next?"); (b) **Taste** — every thread had a named human owner; Claude surfaced user-perceptible changes with before/after screenshots/recordings for humans to rule on; (c) **Direction** — each thread deliberately narrow (one benchmark/journey); humans sequenced, merged colliding threads, and closed threads at diminishing returns — e.g. a 900-line PR got a one-line rejection: "going to gavel that 2ms per send is not worth the complexity of maintaining this build plugin."
- **Why it doesn't slow down:** work is split into small, independently measurable, independently shippable PRs; deterministic lab benchmarks let Claude validate without waiting for field reads / deploy cadence ("iterate faster than our deploy cadence", async overnight); and the ratchet means old wins don't silently decay while new work lands.

### Guardrails — how 3,000 changes shipped safely
- Every PR: automated review + **at least one human approval**; unit tests before optimisations; anything user-visible behind a **short-lived feature flag**.
- Flags: **~200 introduced, >half cleaned up by end**; Claude classified each as kill-switch or ramp and retired it as soon as safe. A dedicated thread coordinated rollouts/cleanup.
- Incremental rollouts: high-risk changes → employees first → 1% of users → everyone.
- Static-composer guardrails (the brittle "show HTML immediately, let React paint on top" trick): markup generated by rendering the real React component in jsdom with a no-drift test; integration suite across **14 viewport sizes**, alignment within **1 px**; keystroke test types through the handoff, fails on lost/reordered keys; in the field, every handoff reports shifts to **0.1 px** and Claude opens a thread for any nonzero movement.
- Real-world catch: a teammate's recording showed a 15–20 px composer drop on new-tab opens. Claude traced it to Chrome, not the handoff: managed-browser new-tab footer (56 px) disappearing ~100 ms after first paint; greeting/composer at 18% height → 0.18 × 56 ≈ 10 px drop. Fix: pin layout across the resize + test simulating the prerender flow.

### The 8-millisecond budget — hill-climbing frame times
Sidequest: streaming long replies. Claude built deterministic **120 Hz stepping in headless Chrome via DevTools begin-frame control** — exactly 240 frames for 240 begin-frames at **8.33 ms**, so "did this frame fit the budget" became an exact read. Then frame-by-frame: eliminated **O(message length) work per chunk by memoising finished blocks**, moved tokenisation for growing code fences to a worker, revealed tables cell by cell. One thread: **~60 PRs**. Long replies: main-thread blocking **~750 ms → ~200 ms total**, ~1/3 the CPU, held **120 fps** start-to-finish on a 120 Hz MacBook. The rig became a nightly job with Claude watching for regressions.

Em-dash fix: highlighting a finished code block could freeze the page ~1 s. Cause: any non-Latin-1 character (em dash, curly quote) made V8 store the entire string as UTF-16, putting every syntax-highlighting regex on its slower two-byte path. **20-line fix**: copy each code block into a one-byte string before highlighting.

### Results (Anthropic's numbers)
- Overall: **~3x faster** core UX; **3.1x geometric mean across the 13 measurements** (RUM Aug 13 vs Aug 27).
- p75 highlights: fresh claude.ai load to typeable **3.1 s → 0.55 s (5.6x)**; new Claude Code session **0.8 s → 0.3 s**; Cowork cloud session load **2.6 s → 0.73 s**; desktop cold start 6,310 → 3,328 ms; load existing web chat 1,557 → 646 ms; send Cowork message (client-side portion only) 928 → 48 ms (19x — client-side only, not model generation time).
- Claimed aggregate saving: tens of thousands of user-hours of waiting per day (estimate, depends on traffic).
- Still to do (Anthropic's own caveat): p95, other journeys, very long conversations; upstream sidequests to Electron, Chromium, Node.js.

## Claim verification

| Claim | Status | Basis |
|---|---|---|
| 3,000+ changes in two weeks, zero customer-facing incidents / rollbacks | Anthropic claim; NOT independently verified | Anthropic post states it; all secondary coverage repeats it as Anthropic's report. No independent measurement found. |
| −48% CPU instructions / −78% wall-clock on message-tree path (and −31% / −44% on status-line scanner) | Anthropic claim; internally consistent | Anthropic post text; secondary coverage repeats the −48%/−78% pair. No independent reproduction of this specific path found. |
| "id map / 1 lookup per id" | Creator gloss — NOT Anthropic wording | Anthropic says only: 1/4 of instructions were megamorphic dictionary lookups resolving the same message ID 3 times. The "build one map, look up once" phrasing is a plausible inference, not a verified quote. |
| Loop: thread → benchmark → PR → flag → field → ratchet | Verified against Anthropic post | Matches the post's 6-step loop. |
| >150 concurrent threads; 50–100 PRs per thread; >200 changes on busiest days; ~200 flags, >half removed; ~1/3 PRs added telemetry/guardrails | Anthropic claim; NOT independently verified | Post text; repeated by secondary coverage as Anthropic's account. |
| Em-dash / UTF-16 / 20-line fix | Mechanism partially independently reproduced | A Medium author (Oct 2026) reports reproducing the em-dash regex slowdown (4.2x in Chrome 154) and the `:has()` cost on their own Mac. Supports the *mechanism*, not Anthropic's aggregate numbers. Partial, single-author check. |
| ~3x / 3.1x faster overall | Anthropic self-reported telemetry | Post's own RUM (Aug 13 vs 27), p75. No independent measurement found. "Typeable" ≠ fully initialised; Cowork send figure is client-side only. |
| ~30,000 updates/prompts | NOT SUPPORTED — do not use | No source found. Documented figure is >3,000 changes. Likely a 10x misremembering of 3,000. |
| "Claude expands on information" | Supported as a pattern, not a literal feature | Post shows expansion via: Claude opening its own threads, new telemetry generating new threads, benchmarks spawning benchmarks, targets being reset higher after early wins. There is no separate "expansion" mechanism beyond this loop + new measurements. |

## Still missing / could not access
- **The TikTok video itself**: no URL, video ID, upload date, title, caption beyond the truncated screenshot text, narration/transcript, length, or view/like counts.
- **Anything the TikTok says beyond the two frames**: e.g. whether it mentions the em-dash fix, the 120 Hz rig, the flag count, or the steering/ambition material — unknown. This file covers the *full source post*, which is the superset the video draws on, but the video's own selection/emphasis cannot be confirmed.
- **The exact code fix** for the message-tree path (whether it literally is an id-map) — not published in the Anthropic post.
- **Independent verification** of Anthropic's aggregate numbers (3x, 3,000 changes, zero incidents) — none found; all coverage is Anthropic self-report.
- **breakpoint.blog article**: no matching Claude article found on breakpoint.blog.

## How to apply this to The Divine Archives

Headline: **loops, not one fix.** Run the loop, write down what each loop learned, let the next loop expand on it.

Three loops, each feeding the others:
1. **Video pipeline loop** — build → check (QA/ASR) → send to Carter → he clicks → ship → measure (Facebook views/retention) → lock the lesson into craft-notes → next batch expands. Acceptance: the next batch must reference the prior batch's lessons by name.
2. **Site loop** — real slow experience → benchmark → one-fix PR → flag → field measure → ratchet test → next loop expands. First three by measurement: museum load on phone, Atlas search/filter, one heaviest game load. One fix per PR, not batched.
3. **Council loop** — review → audit → fix → verify → lock in rule update → next review expands.

**Scale lesson (why nothing has to slow down as work piles up):** constant-time lookups (build an index once, look up once per id — do NOT re-scan whole lists on every render/interaction); ratchets (each loop locks in its gain so slowdowns cannot pile up); flags (a bad change switches off fast); benchmarks (slowdowns caught BEFORE they ship, not after).

Concrete first places for the site loop (examples, not the headline): Museum (83 rooms + 900 Theses = 84), Pantheon (199 figures), Vault (88 manuscripts), Atlas (73 sites + 83 rooms), games/interactives, directory — replace repeated array scans (find by id/name on every render/interaction) with a Map built once, lookup once per id. Cache lookups. Video topic dedup (currently scans production-log + posted-log + pending/ + approved/ every time) → use a Set/Map for topics. Measure before AND after on the same device/steps; do NOT promise Anthropic's percentages for the Archives.

**Guardrails:** No behavior or visual changes in a performance PR. Measure before AND after on the same device/steps. Phone-class budgets stay (Galaxy S22 is the verdict). No public source maps, no client-side secrets. Staging only, nothing live without Carter's go-ahead. This file does NOT by itself authorize repo code edits — code edits still need the loop process + Carter's go-ahead.

## Sources
- Primary (read in full 2026-10-17): Anthropic, "How we made claude.ai 3x faster in two weeks", https://claude.dev/blog/how-we-made-claude-ai-faster/ (published 2026-09-23)
- Creator homepage: https://breakpoint.blog/
- Secondary / verification: FourWeekMBA (AI Anthropic Claude AI 3x faster, two weeks, 3000 changes, zero rollbacks); VarOps (Anthropic ran an agent through 3,000 production changes with zero rollbacks); Help Net Security (2026-09-24); Zeniteq; ExplainX
- Partial independent mechanism check: Medium @reactbd, "Anthropic made Claude AI 3x faster with Claude — one em dash made my regex 4.2x slower in Chrome"
