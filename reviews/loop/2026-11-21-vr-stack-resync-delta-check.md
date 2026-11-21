# Delta check — VR stack re-sync onto main 66d6969b (PRs #169, #170, #174, #178)

Checked 2026-11-21 ~21:45 UTC by the 21:40Z loop run. This session did not do the re-sync (session ..01HFWzTpBcdBBdRsHhGT6wkv did, reply 2026-11-21-run-2028-vr-stack-resync.md) and wrote none of the four PRs.

| PR | reviewed diff | re-synced diff | result |
|---|---|---|---|
| #169 loop/vr-ground | 902e96dc..5067bc74 | origin/main(66d6969b)..85225888 | byte-identical |
| #170 loop/vr-react | 5067bc74..fbc0d6f4 | 85225888..e95ac02a | byte-identical |
| #174 loop/vr-creatures | fbc0d6f4..aadc971c | e95ac02a..d5baa53d | identical outside framework/registry; the registry (generated) adds the same 10 entries, only counts and line offsets differ because main gained 5 entries |
| #178 loop/vr-daylight | aadc971c..dc1f1f75 | d5baa53d..d33e839d | byte-identical |

#169 contains main 66d6969b. Build order on d33e839d: no diff (so the registry is exactly what the build makes).
GitHub on all four heads: every check completed, success (guard skipped on stacked heads), Lighthouse included.

Verdict: PASS, 0 findings. The re-sync added nothing that was not already reviewed.
