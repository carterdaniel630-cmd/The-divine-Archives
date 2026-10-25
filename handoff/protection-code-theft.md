# Protection Addendum: Code Theft & Reverse Engineering
**Ordered by Carter, 2026-10-13. Part of the Protection Program (ready line #1).**

## The threat
Actors reverse-engineer client-side code, recompile it, and redistribute it
as open source — stealing the work. Carter: "we need to make sure they can't
fuck with us."

## Honest baseline
A static site's client-side code can NEVER be made truly unhackable — any
browser receives the source, and view-source always exists. Anyone promising
otherwise is lying. What we CAN do is make theft expensive, detectable, and
legally actionable. Deterrence + attribution, not invincibility.

## Required measures (for Claude's protection build)
1. **Obfuscation pipeline:** production JS goes through obfuscation
   (identifier mangling, control-flow flattening, string encryption) as a
   build step. Not the hand-written source — the shipped artifact. Raises
   the cost of reverse engineering from trivial to expensive.
2. **Minification + bundling:** always ship minified; never ship readable
   source maps publicly.
3. **Watermarking / fingerprinting:** embed invisible identifiers in
   builds (per-release tokens in code and assets) so stolen copies can be
   traced to the leak.
4. **Copyright headers:** every shipped file carries a copyright notice and
   license identifier. Legal groundwork for takedowns.
5. **No secrets client-side:** API keys, private endpoints, and proprietary
   algorithms live server-side or don't exist. Audit every build for leaked
   secrets (ties to the High Council security auditor).
6. **License enforcement posture:** the IP policy (handoff/naming-and-ip-policy.md)
   plus registered copyright on the original expression gives takedown
   leverage under DMCA and equivalent regimes. Legal counsel to confirm
   registration strategy.
7. **Integrity checks (tamper-evidence):** where feasible, builds verify
   their own integrity at load (subresource integrity for staged assets);
   not prevention, but early warning.

## Out of scope (do not promise)
- "Unhackable" client code. DRM for a static site. Preventing screenshots,
  screen recording, or manual reimplementation. Say what these measures do
  plainly; never oversell.
