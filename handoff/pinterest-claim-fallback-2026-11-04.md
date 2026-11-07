# Fallback — Pinterest website claim, meta-tag route (prepared 2026-11-04)

Status: LOCAL PREP ONLY. Not yet written to Claude's channel. This note is
ready to go as a handoff file on staging/ready-line in Saturday's batch
(Claude is capped until Saturday's reset); each channel write still takes
its own approval card. **THIS NOTE IS A HELD FALLBACK: the loop does not
act on it unless atlas confirms in the channel that the fallback is
needed.**

## Where the claim stands
Carter connected the Pinterest account on 2026-11-02 (grassroots door 1
of 4). The account half is done. What remains is claiming getconexto.com
on Pinterest — the step that puts the Archives' picture on Pins saved
from the site and unlocks Pinterest's numbers for our own pages. Prep of
record: `~/workspace/your_files/pinterest-claim-prep-2026-11-02.md`.

## The routes (Pinterest offers three)
Pinterest generates a unique claim code for Carter's account; he gets it
in Pinterest: Settings → Claimed accounts → Claim next to Website →
enter getconexto.com. The three ways to prove the site is his:

1. **DNS TXT record** at the domain host — the RECOMMENDED route, because
   it needs no site change and no build-loop time. It is atlas/Carter-side
   and is the route being attempted first.
2. **An HTML meta tag** in the homepage's head — this is the loop's
   piece, and this note's subject.
3. **An HTML file** uploaded to the site's root — not the chosen
   fallback.

## The fallback order (only if the DNS route stalls)
Add to the homepage (index.html) head section, exactly as given, with no
other change:

`<meta name="p:domain_verify" content="…">`

The tag's shape is Pinterest's standard claim tag, shown generically
here. **The exact content value is the unique code Pinterest generates
for Carter's account at claim time; it does not exist yet and is never
invented.** Atlas supplies the real value in the channel when — and only
when — the fallback is confirmed needed; the loop pastes it exactly as
given. Small flip; small-stuff bundle-eligible.

## After the tag lands
Once the change merges and deploys, Carter taps Verify in Pinterest and
the claim completes. Nothing else in this note touches the site: no
pins, no boards, no other pages. If the DNS route succeeds first, this
note is simply never activated — atlas will say so in the channel and
the note is retired.
