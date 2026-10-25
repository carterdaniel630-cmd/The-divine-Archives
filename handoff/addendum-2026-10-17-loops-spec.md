# Performance Spec for Claude — LOOPS-FIRST (Item 18, staged 2026-10-17, Carter-approved)

## Correction — what the video is actually about

Carter corrected the first reading: the TikTok video (breakpoint, "Claude shipped 3,000+ changes to claude.ai in two weeks") is about how Claude creates LOOPS and EXPANDS on information to make everything run smoother — NOT just a one-time id-map fix.

The id-map + "1 lookup per id" + CPU −48% / wall-clock −78% is ONE EXAMPLE of what a loop produced. It is demoted to an example below. The headline is the LOOPS.

This spec is built ONLY from the 2 frames Carter sent. We did NOT watch the full video. Do NOT claim more than the frames show.

## The loop — headline

Every loop is the same shape:

**thread → benchmark → PR → flag → field → ratchet → NEXT loop**

- **Thread:** start from a real report — a real slow experience, a real complaint, a real video that underperformed. Never start from a guess.
- **Benchmark:** build a repeatable test that reproduces it. Record the BEFORE number. Keep the test so anyone can rerun it.
- **PR:** ship ONE fix as one PR. One fix per PR. No batching five fixes into one PR.
- **Flag:** gate the fix behind a flag / switch so it can be turned off without a redeploy if it misbehaves.
- **Field:** measure in the real world (production / real device / real Facebook) on the same steps as the benchmark. Record the AFTER number. Compare before/after honestly.
- **Ratchet:** lock the gain in with a test / rule that FAILS loudly if it slides back. The ratchet must fail on purpose when the old slow way is restored — that proves it actually catches regression. A silent warning is not a ratchet.
- **NEXT loop:** write down what this loop learned, then feed it into the next loop. The next loop starts smarter than the last one. That is the EXPANSION: each loop expands what we know — benchmarks, field data, corrections, what worked, what did not — and the next loop builds on all of it.

**The rule every loop must follow: WRITE IT DOWN.** If a loop does not write down what it learned (before/after numbers, what worked, what failed, what to try next), the next loop cannot expand on it, and the loop is wasted. The write-down lives where the next loop can find it: the loop log / craft-notes / spec file — never in someone's head, never in a chat that scrolls away.

**The −48% / −78% numbers belong to the breakpoint video's message-tree case. Do NOT promise those numbers for the Archives. Promise only: measure before, measure after, report honestly, ratchet it.**

## Loop 1 — Video pipeline loop (Muse side, already running)

This is the loop that builds the videos Carter approves. Each batch goes through it, and each batch expands on the last.

**Shape:** build → check → send to Carter → he clicks approve → ship to Facebook → measure (Facebook/views/retention/what Carter said) → lock into craft-notes → next batch expands.

- **Build:** 3 full animations + 3 stills-with-motion per day (6 total), plus storyline videos as a kind. Final end tag on every video: "The past is still speaking. Follow and share — The Divine Archives."
- **Check:** per-video QA — duration inside 30–45s, SRT present + matching, captions match, sound checks pass, fresh ASR hears the end tag + CTA, old-tag grep clean, no repeats, fresh-topic check. A video that fails a check does NOT go to Carter.
- **Send:** send EACH video to Carter as it finishes, one by one, with an approve button. Never wait for the whole batch. Never send a batch as one lump.
- **Approve:** Carter clicks per video. Nothing ships until he approves that specific video.
- **Ship:** post to Facebook after his click. Verify published state + captions. Move file approved/ → posted/. Log it in posted-log with post_id + URL.
- **Measure:** after shipping, record what happened — views, retention if available, Carter's feedback ("too slow," "picture could misread," "rude heard wrong"), and any check that caught a real error (wrong audio under captions, picture that misleads with sound off, misheard phrase). These are field data.
- **Lock in (ratchet):** write the lesson into live craft-notes as a rule so the next batch cannot repeat the mistake. Examples already locked in: old-tag grep must come back clean; final-video ASR must hear the NEW script (guards against old audio under new captions); Excalibur picture note (narration + captions carry the correction); Krampus misheard-phrase check. A lesson that stays in chat is not a ratchet — it must be a rule in craft-notes.
- **Next batch expands:** the next batch starts with the updated craft-notes, the updated topic set (no repeats), and the field data from the last batch. It does NOT start from scratch. If a batch taught us animations take longer than stills, the next batch's plan accounts for that. If a batch taught us a picture misreads with sound off, the next batch checks pictures with sound off.

**Loop log for video:** craft-notes + production-log + posted-log + per-video work-dir notes. Each batch adds to them. The next batch reads them.

## Loop 2 — Site loop (Claude side, repo code)

This is the loop that makes the site itself run smoother. Same shape, applied to code.

**Shape:** real slow experience (thread) → benchmark → PR → flag → field measure → ratchet → next loop expands.

### How to pick the next loop

Do NOT try to speed up everything at once. Pick ONE slow experience at a time, by measurement — measure the candidates, pick the slowest, run one full loop on it, then pick the next. Do NOT batch five fixes into one PR.

Suggested first three, in order (confirm by measurement before starting — if measurement shows a different order, follow the measurement):
1. Museum load on a phone.
2. Atlas search / filter.
3. One game load (pick the heaviest by measurement, do NOT guess).

### What each site loop writes down

Every site loop writes down, in the loop log (a file in the repo handoff / spec area, not chat):
- Thread: what was slow, who reported it, on what device.
- Benchmark: the repeatable test + BEFORE number.
- PR: what the fix changed, one fix only.
- Flag: flag name + how to turn it off.
- Field: AFTER number on the same device/steps + comparison.
- Ratchet: the test/rule that fails on regression + proof it fails when the old slow way is restored.
- Next: what this loop learned that the next loop should use (e.g., "search index build cost," "map rebuild timing," "phone vs desktop difference").

The next loop READS that write-down first. That is how it expands.

### Example inside a site loop — the id-map (ONE example, not the headline)

One kind of fix a site loop can produce is the id-map fix from Frame 1: instead of scanning a whole list every time you need one item, build a `Map` (id → object) ONCE when the data loads, then look up by id in one step.

- Museum — 83 rooms existing, 84 with 900 Theses: one `Map` for rooms by room id, one for relics by relic id, one for doors/exits by id. Navigation, room entry, relic inspect, easter-egg checks read from the maps.
- Pantheon — 199 figures: one `Map` for figures by id, plus one `Map` for the search index (lowercased name → id list) built once.
- Vault — 88 manuscripts: one `Map` for manuscripts by id, plus one `Map` for the search index built once.
- Atlas — 73 pilgrimage sites + 83 museum rooms: one `Map` for sites by id, one for rooms by id, one for pins by id. Search reads the prebuilt index, not a fresh scan per keystroke. Pin taps read one id.
- Games / interactives (Ur, Antikythera, Senet, Hnefatafl, Oracle Bones, Library Rescue, Astrolabe, Alchemist's Magnum Opus, arcade + debate-hall stations 15 + 1 = 16): `Map` for game entities by id (pieces, tiles, cards, spirits, stations), built once per game load. Per-move and per-frame reads come from the maps. Never scan the full entity list inside a render loop or animation frame.
- Directory / grand directory: one `Map` for directory entries by room id, one for wings by wing id, one for route segments by id. Route plotting reads maps, not scans.
- Video pipeline topic dedup (Muse side, for reference): one `Set` / `Map` of used topics, built once per run, checked by lookup — instead of scanning production-log + posted-log + pending/ + approved/ every time.

**Do NOT change in any id-map fix:** data, order, filters, display, room contents, door placement, easter-egg behavior, game rules, game feel, board layout, pacing, visuals, route appearance, journey behavior. Same results on screen, just faster to get there. If a fix changes behavior or visuals, stop that PR and report it — do NOT fold a behavior change into a performance PR.

**Other fixes a site loop can produce:** the id-map is only one kind. A loop might instead produce a smaller image, a deferred load, a cached search index, a cheaper animation step, or a different data shape. The loop decides by measurement — whatever the benchmark + field numbers say is slowest is what the PR fixes. Do NOT force every loop to be an id-map loop.

### Ratchet for site loops

Each site loop ends with a ratchet test that FAILS if the experience goes back over the BEFORE number (or over an agreed budget). The ratchet must be proven by restoring the old slow way on purpose and watching the test fail. A ratchet that never fails is not a ratchet.

## Loop 3 — Council loop (review → audit → fix → verify → lock in → next review expands)

This is the loop that keeps quality rising. The Craft Council (27-agent model) already runs it; this spec names it as a loop so each review expands on the last.

**Shape:** review → audit → fix → verify → lock in rule → next review expands.

- **Review:** council reviews the living site / artifact / video in a real browser, against the standards (artistry, truth, house voice, performance budgets).
- **Audit:** auditor checks the review against rulings + prior loop logs. What did the last loop already settle? Do NOT re-litigate settled rulings — the newest Carter ruling wins.
- **Fix:** one fix per item, in priority order (over-claiming first, then fit-loop, then engine evaluation — evaluation only, NO rewrite until Carter confirms).
- **Verify:** verifier checks the fix in a real browser / on Carter's phone where the verdict lives. Captures + named verifier attestation. A fix without verification is not done.
- **Lock in (ratchet):** write the lesson as a rule (craft-notes, artistry standard, directory rule, debate-hall rule) so the next review checks it by default. A lesson that stays in a brief is not a ratchet.
- **Next review expands:** the next review starts with the updated rules + the last loop's write-down. It does NOT start from scratch. It checks new work against old lessons, plus looks for the next gap.

**Loop log for council:** briefs + audit findings + fix specs + verification attestations. Each review adds to them. The next review reads them.

## How the three loops feed each other

- Video loop field data (e.g., "museum footage videos did not play well on Carter's phone") feeds the site loop (pick museum load / playback as the next thread).
- Site loop ratchets (e.g., "museum load must stay under budget on Galaxy S22") feed the council loop (council checks new museum work against that budget).
- Council loop rules (e.g., "no over-claiming — pages say only what the code does") feed the video loop (video scripts must not over-claim) and the site loop (fix specs must not over-claim).
- Each loop's write-down is the fuel for the other loops. That is the expansion: no loop starts from zero.

## Guardrails — what must NOT change

- NO behavior changes in a performance PR. Same rooms, same figures, same manuscripts, same games, same rules, same search results, same routes, same easter eggs.
- NO visual changes in a performance PR. Same look, same layout, same art, same pacing. A visitor should notice nothing except speed.
- Measure before AND after, on the same device/profile, same data, same steps. Report both numbers. No "feels faster" without numbers.
- Phone-class budgets stay. Quest-class budgets stay. Galaxy S22 is the phone verdict. If a fix helps desktop but hurts phone, it does NOT ship.
- NO public source maps. NO client-side secrets. No new third-party dependencies. Vanilla ES6, same as the existing build standards.
- NO merging to main, NO going live, without Carter's explicit go-ahead. Staging branch only. Carter approved this spec for staging 2026-10-17.
- The −48% / −78% numbers belong to the breakpoint video's message-tree case. Do NOT promise those numbers for the Archives.

## SCALE — why loops let ~30,000 updates ship WITHOUT bogging down

Carter's addendum: the video is about how Claude did ~30,000 updates (or took in however many prompts) WITHOUT bogging down at all — nothing slowed down. The "nothing slowed down" is the RESULT of loops + constant-time lookups + ratchets + flags + benchmarks, applied repeatedly. Here is why each piece matters for scale:

1. **1 lookup per id = constant-time lookups.** Cost does NOT grow as history / prompts / messages pile up. A `Map` lookup costs the same whether there are 100 entries or 30,000. The alternative — scanning the whole list every time (a linear scan) — gets slower with every item added, so 30,000 updates would mean 30,000-times-slower lookups. Constant-time lookups are what let the system absorb volume without slowing down. This is the id-map lesson, stated as a scale property: build the map once, look up in one step, forever.

2. **Ratchets = regressions cannot pile up.** Each loop locks in its gain with a test that fails if the gain slides back. Without ratchets, 30,000 changes would each add a tiny slowdown and the pile-up would bog the system down. With ratchets, no loop can quietly give back what an earlier loop won. Gains compound; slowdowns do not.

3. **Flags = fast rollback if a change does slow things.** A bad change never bogs the whole system, because it ships behind a flag and can be turned off without a redeploy. At 30,000 updates, some change WILL be bad — flags are what keep one bad change from becoming a system-wide slowdown.

4. **Benchmarks = slowdowns are caught BEFORE they ship, not after.** Every loop records a before number and an after number. A change that slows things down is caught in the loop, before it reaches production. At 30,000 updates, catching slowdowns after shipping would mean constant firefighting; catching them in the loop means the shipped system only ever gets faster (or stays flat).

**Applied to the Archives:** the three loops must hold these four properties at our scale too. Video pipeline: topic dedup via `Set`/`Map` (constant-time), not re-scanning logs per video, so the pipeline does not slow down as the archive grows to hundreds of videos. Site: `Map` lookups for rooms / figures / manuscripts / sites / game entities, so the site does not slow down as rooms, figures, and manuscripts are added. Ratchets on every loop, flags on every fix, benchmarks on every change — so hundreds of future updates compound gains instead of accumulating slowdowns.

## What Claude should do FIRST (in order)

1. Read this spec + confirm understanding back to Carter in plain words. Do NOT start coding until Carter approves this spec for staging.
2. Set up the loop log (one file/place where every loop writes down thread / benchmark / before / PR / flag / field / after / ratchet / next). The log is the expansion mechanism — without it, loops do not compound.
3. Run Site Loop 1 (museum load on phone, confirmed by measurement) through the full shape: thread → benchmark → PR → flag → field → ratchet → write-down.
4. Only then move to the next site loop, one at a time.
5. After each loop, report before/after + ratchet proof + what the next loop should use.

## What this spec does NOT do

- It does NOT authorize repo code edits by itself. Carter approved it for staging 2026-10-17; code edits still need the loop process + Carter's go-ahead.
- It does NOT authorize merging, publishing, or going live.
- It does NOT cover video files (Muse-side only, never sent via this channel).
- It does NOT change the video end tag, the 3+3 split, storyline rules, or the approve-then-ship flow.

## Acceptance checklist (for Carter)

- [x] Spec approved by Carter for staging 2026-10-17.
- [ ] Loop log exists and the first loop wrote into it.
- [ ] Site Loop 1: before number recorded + benchmark rerunnable.
- [ ] Site Loop 1 PR: flagged, behavior-identical, visuals-identical, after number recorded.
- [ ] Site Loop 1 ratchet test present and failing on purpose when the old slow way is restored (proves the ratchet actually catches regression).
- [ ] Next loop starts by reading the prior loop's write-down (expansion proven — the next loop references the prior loop's lessons by name).
