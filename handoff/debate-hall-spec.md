# The Debate Hall — Build Specification
## The Divine Archives · Museum · 2026-10-13 · For Claude Code

**Status:** DESIGN SPEC — no code. Implements Carter's 2026-10-13 order.
**Pilot scope:** SOLO mode only (visitor debates the AI philosopher). Social
phase (pilgrim-lights, multi-visitor) is designed-for, not built — see §6.

**Binding policies this spec obeys:**
- `handoff/content-truth-policy.md` — verbatim accuracy, no sanitization, no
  invented quotes. The Debate Hall is where this policy is most load-bearing:
  every line the philosopher speaks must be traceable.
- `handoff/naming-and-ip-policy.md` — generic names throughout.
- Modular Framework Standard (8 clauses) + Artistry Standard (5 parameters):
  vanilla ES6, zero external requests, scoped CSS, `destroy()` teardown,
  mobile DPR 1.0, keyboard operation, `prefers-reduced-motion`.

**Why the pilot is deterministic, not generative:** the Content Truth Policy
forbids invented quotes. A generative model cannot guarantee it will never
invent one. The pilot's "AI philosopher" is therefore a **deterministic
dialogue engine** speaking only from an authored, audited corpus (positions,
verbatim quotes with citations, labeled paraphrases, recorded
objection-handlers). This is a feature, not a limitation: every utterance is
citable. A generative backend may attach later (§6) behind the same
utterance-tier system.

---

## 1. Room concept

**The form:** a circular stone hall in the agora tradition — concentric
stepped seating rising around a central atlas table, fifteen debate stations
inscribed around the ring wall. Chiaroscuro opening per the Artistry
Standard: the visitor enters in near-dark; the ring of fifteen questions
ignites one by one, like lamps being lit for a night assembly.

**Atmosphere:** solemn, not theatrical. No sound effects of crowds; the room
is quiet enough to think in. The fifteen questions glow in carved-stone
lettering (procedural stone texture, engraved fill — no flat vector look).

**Visitor journey:**
1. **Enter** — orientation line, house voice: *"Fifteen questions have
   outlived everyone who ever asked them. Choose one — and choose who will
   answer for the other side."*
2. **Choose a debate** — the fifteen questions ring the wall; tapping one
   lights its station and loads it on the atlas table.
3. **Choose a side and an opponent** — the table shows the debate's positions;
   the visitor picks a position to defend; the hall offers the philosophers
   who held the opposing positions; the visitor picks their opponent (or the
   hall assigns the strongest defender).
4. **Debate** — the philosopher's soul-flame ignites above its station; dialogue
   begins (§2).
5. **Close** — no winner is declared, ever. The session ends when the visitor
   closes it or after a natural cadence (§2); the hall asks the closing
   question of Debate 15: *"Which of these brought you here?"* The visitor's

### 1.1 The soul-flame (Carter 2026-10-13)
The philosopher is NEVER rendered as a 3D figure or portrait. Each philosopher
is present as a **soul-flame** — a living flame hovering above its debate
station — with the dialogue **text bubble floating above the flame**.
- **The flame flickers while the philosopher "speaks"** (during its turn's
  text reveal); it settles to a steady burn while the visitor reads or types.
  Flicker intensity follows the text-reveal pacing — the flame is the voice
  made visible.
- **Each flame carries the philosopher's identity** in its color/character
  (e.g., warm gold for the Stoics, deep blue for the mystics, ember-red for
  the polemicists) — distinct per philosopher, consistent everywhere that
  philosopher appears (debate hall, plaque, pantheon entry).
- **No faces, no bodies.** The flame is the person; the words are the form.
  This is deliberate: it keeps the hall about the arguments, not avatars, and
  it sidesteps every likeness problem at once.
- Build: procedural flame shader (or layered sprite animation), cheap enough
  for phone GPUs; the bubble is a standard dialogue card anchored above the
  flame's position.
   defended position joins the living histogram (§2).

---

## 2. Solo debate mode — session flow

### 2.1 Turn structure
- **Opening:** the philosopher speaks first — an opening statement drawn from
  its corpus (verbatim-led, labeled per §2.2). 2–4 sentences. Sets its
  position plainly.
- **Visitor turn:** free text input (primary) + a row of 2–3 suggested lines
  of argument (for phone ease and for visitors who don't know where to start;
  suggestions are genuine argumentative moves, not straw).
- **Philosopher turn:** the engine (a) classifies the visitor's move
  (agreement / objection / new argument / question / off-topic), then
  (b) responds per persona rules (§5):
  - **Steelman first:** restate the visitor's point fairly in one line. The
    philosopher never strawmans — several of these thinkers (Aquinas's
    *objections*, Nagarjuna's opponent, the Buddha's interlocutors) modeled
    steelmanning themselves; the engine follows their example.
  - **Counter from its actual positions:** draw on the persona pack —
    verbatim quotes first, labeled paraphrase second.
  - **Concede where the philosopher conceded:** if the visitor lands an
    objection the philosopher's own texts acknowledge as forceful, the
    persona says so (in character) rather than dodging. Intellectual honesty
    is the house virtue.
- **Cadence:** after 6 visitor turns the table gently offers a close
  (*"The lamps burn low — shall we rest the question?"*); the visitor may
  continue up to 12 turns, then the hall closes the session gracefully.
- **Atlas pull-up (any turn, either side):** visitor or philosopher may call
  a source to the table — the passage appears verbatim with full citation
  (§3). The philosopher "calling" a source is how verbatim quotes enter
  dialogue naturally.

### 2.2 Utterance tiers (truth policy, enforced in UI)
Every philosopher utterance carries a visible tier badge. No exceptions.

- **VERBATIM** — the philosopher's exact words, in a stated translation,
  with citation (work, section, translator). Rendered as a pulled quote.
  Example badge: `VERBATIM · Meditations II (Cottingham trans.)`
- **PARAPHRASE** — adherent-framed restatement of a documented position.
  Badge: `PARAPHRASE · after Nicomachean Ethics I`. Never rendered as a
  quote; never in quotation marks.
- **HALL** — the room's own narration (transitions, redirects, closings).
  Spoken by the hall, never attributed to the philosopher. Badge: none
  needed; typographically distinct (italic, dimmer).

**The banned-quote list** (from `research-report.md` corrections) is a
hard blocklist in the engine: these strings must NEVER appear as VERBATIM,
and the engine must never attribute them:
- "I know that I know nothing" → use the *Apology* 21d paraphrase, labeled.
- "You cannot step twice into the same river" → Plato's compression; label it.
- The famous razor sentence → John Punch, 1639, not Ockham.
- Thesis–antithesis–synthesis → never attributed to Hegel.
- Anything from *The Will to Power* → never cited as Nietzsche's doctrine.
(Claude: encode the full corrections list from `research-report.md` §
"Key corrections the Pantheon must carry" as `banned-attributions.json`.)

### 2.3 Off-topic fallback
If the visitor raises something outside the philosopher's recorded concerns:
the philosopher says so in character and redirects — HALL tier, never
invented content. Example pattern: *"That lies outside what I wrote about.
Shall we return to [topic] — or would you face a different thinker?"* The
table offers the other debates. The persona never improvises positions on
topics the philosopher never addressed.

### 2.4 The living histogram
Per `debate-topics.md` operating notes: visitor positions are tallied per
debate and shown as a living histogram — never as a verdict, never "X wins."
**Pilot honesty note:** the production site is static (no backend), so the
pilot histogram is per-device (this visitor's sessions, localStorage). The
data shape must match the future tally-service schema (§6) so the social
phase can aggregate without migration.

---

## 3. The atlas table (Carter 2026-10-13: "super interactive")

The visitor STANDS ABOVE the table and looks down at a living map. This is
the room's shared evidence surface — "the facts in the room" — and the
debate control surface. Everything below must work mid-debate, whether the
visitor is facing the AI philosopher (solo) or another visitor (social).

**The map:**
- A hand-drawn world map (same gothic/parchment direction as the grand
  directory) spread across the table surface.
- **Timeline scrub:** a timeline rail along the table's edge — drag/scroll in
  EITHER direction through time. The map's markers, belief notes, and
  philosopher flames kindle and dim as their eras enter and leave the window.
- **Tappable everything:** every location pin, belief note, and philosopher
  flame opens its fact card right there on the table — no navigation away,
  no leaving the debate. Facts surface in place.
- **Debate mode:** while a debate is live, the table shows the active
  debate's positions and figures; pulling a source from the shelf drops its
  passage onto the table as a citable card either side can invoke.

**What it shows:**
- **Debate view:** the active debate's positions, figures, and the
  visitor's question (from `debate-topics.md`). Tapping a figure opens
  their card.
- **Philosopher cards:** all 108, from `pantheon-drafts.md` — emblem note,
  badges, epithet, description paragraph. Each card links: *"Find in the
  museum"* → plaque location from `plaque-map.md`; *"Read in the Vault"* →
  pending (link targets don't exist yet — render as "forthcoming," never
  as dead links).
- **Source shelf:** the primary-source passages for the active debate,
  verbatim with citations and translation status. Public-domain translations
  preferred; anything under fair-use excerpt gets attribution + a
  "verify against the edition" note. **Legal review of translation
  licensing is required before shipping** (flagged in research handoff).
- **Honesty flags:** the era reports' flags (doubtful quotes, disputed
  dates, entanglements) appear ON the cards and stations, not in footnotes
  — per `debate-topics.md` operating notes.

**Gizmos and gadgets (build what makes sense):**
- Timeline scrub rail (both directions) with era labels that light as you pass.
- A "compare" well: drag two figures' cards into it to see their positions
  side by side.
- A quote-catcher: tap any verbatim passage to pin it to the debate rail as
  ammunition for your current turn.
- Debate timer / turn indicator (gentle — a slowly filling ring, never a buzzer).
- The living histogram (§2.4) rendered as candle-flames on the table's far edge.
- Session bookmark: save the debate state (topic, side, pinned quotes) to
  revisit — per-device in the pilot (static site, localStorage).

**Interaction:** tap-first (Carter reviews on Galaxy S22), keyboard
navigable, works at 1.0 DPR. The table is also the debate control surface:
choose debate, choose side, choose opponent, call sources, close session.

---

## 4. AI persona rules

1. **Speak as the philosopher, from their texts.** Voice may be modernized
   for readability, but positions never are. The persona knows what the
   philosopher knew — see rule 2.
2. **No anachronism.** Knowledge cutoff = the philosopher's death. Aristotle
   does not know Darwin; Nagarjuna does not know quantum mechanics. If the
   visitor raises modern material, the philosopher may apply an explicitly
   documented principle to it ONLY as labeled PARAPHRASE
   (*"By my principle that..., I would say..."*) — and only where the
   principle is in the corpus. Otherwise: redirect per §2.3.
3. **No invented quotes.** §2.2 is absolute. When exact words aren't
   available, the persona paraphrases and the UI says so.
4. **Disputed attributions flagged.** The persona never asserts a disputed
   quote as its own; the table's honesty flags are visible mid-debate.
5. **Hold the position; don't flatter.** The philosopher does not concede
   for politeness and does not praise the visitor into agreement. It engages
   every serious objection (steelman, §2.1) and answers from its corpus —
   including with the philosopher's own recorded replies to objections.
6. **Defend the actual views, including the uncomfortable ones** (truth
   policy). Where the record demands it, the hall shows a labeled
   scholarly-criticism panel alongside — presented, not amplified, never
   hidden (§7).

---

## 5. Content safety (inside the truth policy)

- **Debates stay on philosophy.** The fifteen topics are the room's remit.
  The persona does not opine on modern politics, current events, or anything
  outside its corpus (§2.3).
- **No positions the philosopher didn't hold.** If the visitor tries to draw
  the persona into endorsing something abhorrent the philosopher never
  defended, the persona refuses in character: *"That is not a position I
  ever defended."* (HALL-tier framing may add: *"The hall does not lend
  thinkers to causes they never joined."*)
- **Views the philosopher DID hold that are now abhorrent** (e.g.,
  Aristotle on natural slavery): presented as the historical position —
  the truth policy forbids sanitizing — with the labeled
  scholarly-criticism panel visible per the Urantia-room precedent (labeled
  criticism, not amplification, never hidden). The persona states the view
  as the philosopher's; the hall states the criticism as the hall's. The
  two voices are never mixed.
- **The religion-tenets exception** (truth policy § "The one exception")
  governs room placement, not debate content; noted here for the build
  team's awareness.

---

## 6. Social hooks (Living Archive phase — design now, build later)

The solo engine must be built so the social phase attaches without a rewrite:

1. **Addressable speaker slots.** Every session has slots: `visitor`,
   `philosopher`. Dialogue functions take a `speaker` parameter; a second
   human participant is a new slot value, not new code.
2. **Turn protocol generalizes.** The current two-party turn loop is
   implemented as a round-robin over the slot list — N participants later.
3. **Shared table state.** The atlas table's called-up sources are session
   state visible to all slots (evidence-anchored debate: everyone sees the
   same passage). No per-user hidden state in the pilot except the input
   box.
4. **Presence stubs.** The ring architecture reserves pilgrim-light positions
   (seating slots in the 3D/scene graph, named and addressable) — unlit in
   the pilot, ready to light when presence arrives.
5. **Histogram schema = future tally schema.** §2.4: per-device now,
   aggregate later, no migration.
6. **Moderation hook.** A `moderation` function stub sits in the turn
   pipeline (pass-through in solo); the social phase implements
   evidence-anchoring checks there ("cite the table or withdraw the claim").

---

## 7. Build checklist for Claude

### Components
- [ ] Room shell: circular hall, 15 inscribed debate stations, stepped
  seating, central atlas table (Artistry Standard materials; chiaroscuro
  entry per §1).
- [ ] Debate engine: deterministic, client-side; turn loop (§2.1);
  move classifier (agreement/objection/argument/question/off-topic);
  utterance-tier renderer (§2.2); banned-attribution blocklist.
- [ ] Atlas table UI: debate view, 108 philosopher cards, source shelf,
  honesty flags, museum-plaque links (§3).
- [ ] Persona packs: one per debate-participating philosopher (see data).
- [ ] Histogram: per-device, future-compatible schema (§2.4).
- [ ] Social stubs: speaker slots, round-robin turns, shared table state,
  pilgrim-light seat reservations, moderation pass-through (§6).
- [ ] Teardown: `destroy()` per Modular Framework; scoped CSS; keyboard
  operation; reduced-motion; 1.0 DPR mobile.

### Data files (build from research — do not re-research)
| UI needs | Source file | Output |
|---|---|---|
| 15 debates, positions, figures, sources, visitor questions | `philosophers/debate-topics.md` | `data/debates.json` |
| 108 philosopher cards | `philosophers/pantheon-drafts.md` | `data/philosophers.json` |
| Positions, verbatim quotes + citations, objection-handlers, redirect lines, per philosopher | `philosophers/era-*.md` (5 files) | `data/persona-packs/*.json` |
| Banned attributions | `philosophers/research-report.md` § Key corrections | `data/banned-attributions.json` |
| Museum plaque links | `philosophers/plaque-map.md` | `data/plaque-links.json` |
| Cross-era threads (bonus atlas view) | `philosophers/research-report.md` § Cross-era threads | optional `data/threads.json` |

**Quote sourcing rule:** prefer public-domain translations; mark
translation + translator on every VERBATIM. Fair-use excerpts get
attribution. **Translation licensing needs legal review before shipping.**

### Acceptance criteria
- [ ] Every philosopher utterance is tier-badged; spot-audit 20 utterances —
  all traceable to the corpus, zero invented quotes.
- [ ] Banned-attribution list test: none of the blocklisted strings appear
  as VERBATIM anywhere.
- [ ] Anachronism test: 10 modern-topic probes per persona — all handled by
  documented-principle paraphrase or redirect, never invented positions.
- [ ] Steelman check: 10 adversarial visitor inputs — no strawman
  responses; the visitor's point is restated fairly before countering.
- [ ] Off-topic: 5 probes — all redirect in character, offer another
  thinker, invent nothing.
- [ ] No winner is ever declared; histogram renders without verdict language.
- [ ] Atlas table: all 108 cards load; plaque links resolve or render
  "forthcoming" (never dead); source shelf shows citations + translation
  status.
- [ ] Phone: Galaxy S22-class — table tappable, text readable, 1.0 DPR,
  no horizontal overflow.
- [ ] Teardown: mount/unmount leaves no listeners, geometries, or timers.
- [ ] Social-hook review: a second speaker slot can be added by config,
  not code changes (Claude: demonstrate with one test slot).
