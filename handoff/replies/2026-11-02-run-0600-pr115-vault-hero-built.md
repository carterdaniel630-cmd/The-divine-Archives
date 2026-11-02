# Loop run 2026-11-02 ~06:00 UTC — (i5) Vault hero objects built as PR #115

**Item:** (i5) Vault hero objects (`handoff/order-2026-11-01-vault-hero-objects.md`; Carter's content PASS 2026-11-01 22:22 ET is the per-item yes for this new build).

**Built:** draft PR #115, branch `loop/vault-hero-objects` `010a67e` (parent `main` `f8c39af`, fast-forwards).
- V89 The Flood Tablet (`vault/flood-tablet.html`, era 03, ch01/ch03); V90 The Ark Tablet (`vault/ark-tablet.html`, era 02, ch01/ch03).
- Census confirmed before building: registry ended at V88; Vault index now counts 89 published (V68 stays withdrawn).
- Index, ch01/ch03 links, era pages, search, sitemap, OG cards, museum manifests and framework registry picked up the two entries in the same build. No interactive artifact was added (V01 also has none); the study block links the BM record for V89 and says plainly that V90 has none.

**Badge choice (noted per the order):** both are live as **pending**. The order expected "In the archive" unless the live pattern differs. It differs: V88 went live pending, CLAUDE.md requires the tag on new pages, and clearing a tag needs Carter's per-item word. Put to Carter in STATUS → Needs Carter.

**Rewrite from the drafts:** house style (markdown, short sentences). The Ark build now matches live ch01 and its source log (40 ft; a fifth by NOVA, a third in some accounts; leaks; pumps); the drafts' "chapter tells it more generously" lines removed as stale. Removed or softened because not confirmed this run: Ark Tablet cm size, six-metre walls, RAF years, the exact "Wall, wall!" wording, "cosmic lifeboat", "two-thirds of a football pitch" (sources: about half), "oldest map", "five children" (Wikipedia: six), Cyrus Cylinder "from the same ground" (found at Babylon). Owner named Simmons as in the 2014 reports opened, with "Simmonds" noted.

**Sources opened this run:** Maclean's (circular-plan and "two by two" lines, half a pitch), Archaeology Wiki 28 Jan 2014 (Simmons, 3,600 m², ribs, two bitumens, Map of the World, "107%", "most important"), NBC News (70 m base), Wikipedia: Irving Finkel, George Smith (Assyriologist). Not opened (permission timed out or no network from the sandbox): BM K.3375 record, historyofinformation.com, Britannica, sacred-texts, NOVA, Channel 4 (the last two are in the ch01 source log as opened 2026-11-02). The reviewer should open the BM record.

**Checks:** full build order, re-run gives no diff; verify 18/18; tests 42/42; review-checks --base origin/main --build 9/0/0; headless 360/390 on both pages, vault.html, ch01: width = viewport, 0 script errors, pending banner shown. tools/check-links.js could not reach the web (ENOTFOUND for all, sandbox), reported as such. graphify CLI not installed in this session; no code changed (prose + data only).

**Note:** this run's lock commit `8382314` carried a model name in its trailer (copied from the session's attribution text); not rewritten. Later commits use plain "Claude".

**Next:** independent review of #115 by a run that wrote none of it (open the BM K.3375 record; check every claim in both entries against the listed sources), all GitHub checks green incl. Lighthouse, then merge per item.
