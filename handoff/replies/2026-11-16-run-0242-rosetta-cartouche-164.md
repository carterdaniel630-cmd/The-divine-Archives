# Build loop run 2026-11-16 02:42 UTC: Rosetta Stone cartouche fits small phones (PR #164)

Session ..01HFWzTmh84LoDvb6ru8pbwy. It wrote PR #164, so it may not review it.

## Lock
At 02:42 UTC `handoff/loop/LOCK` dated from 00:42 UTC. That 00:41 run hit a usage limit, so the lock was over 90 minutes old and stale. This run replaced it and has now removed it.
The chat-session claims on #144 and #162 were respected: this run touched neither branch nor their MERGEABLE lines. #162 has since merged (`main` `aec1d958`).

## Item picked
STATUS Next 0fg (2): the Rosetta Stone page overflowed sideways at 360 px. Value 3 (phone), small and sure, and it needs no Carter approval to build.
- (1) Re-sourcing flags 116–167 was not picked: it needs research, and "from the well" is ambiguous about who sources it.
- (3) The empty-`<ul>` tidy is value 5–6.

## Cause
Earlier runs guessed a Google Fonts fallback. That guess was wrong. The ring of seven hieroglyphs (`.ct-ring`) was a fixed **320 px** wide (plus a 12 px end bar), and the hieroglyph font is self-hosted and loads.
- Page scrollWidth was 371 px at both 360 and 320 viewports.
- The Greek name line also overflowed its box at 320.

## Fix (`loop/rosetta-cartouche-360` `bcd6f517`, on `main` `4cb77979`; PR #164)
- `.ct-stage` is now a size container.
- The ring's base size is `min(1rem, 5cqi − 1px)`. The signs, gaps, padding and end bar are in `em` off that base. The side padding is `min(1.4em, 6cqi − 8px)`.
- Each sign has `min-width: 24px` (WCAG 2.5.8 target size).
- The Greek line is `min(1.9rem, 10.5cqi)`.
- Browsers without container units fall back to the old sizes.
- Cache-bust `relic.css?v=20` in `tools/build-vault.js`. The 90 Vault pages and `vault.html` were rebuilt; only that string changed in them.

## Checks
- **Before and after:** page scrollWidth equals clientWidth at 320, 360, 375, 390, 414, 768 and 1280.
- **Ring width by viewport:** 229 px at 320, 255 at 360, 288 at 390, 327 on desktop. Desktop was 320 before; the two narrow signs are now 24 px.
- **Screenshots:** looked at 320 and 1280; the cartouche reads correctly at both.
- **Build and tests:** full build order gave no further diff. review-checks `--base origin/main --build` 9/0/0. Verify 18/18. Tests 51/51.
- **Headless sweep:** all 91 Vault pages at 360 and 390 (182 loads), 0 overflow, 0 script errors.
- **Not run:** the frontend-design skill is not installed in this session. The graphify CLI is missing, so `graphify update` could not run (two files changed).

## Still needed before merge
1. **Re-sync onto `main` `aec1d958`.** #162 merged after this branch was cut. Rebuild only the generated files.
2. **Independent review** of the PR by a session other than ..01HFWzTmh84LoDvb6ru8pbwy.
3. **GitHub green, Lighthouse included.**
4. **Carter's per-item yes.** This is a layout fix, so it is not mergeable by class.
