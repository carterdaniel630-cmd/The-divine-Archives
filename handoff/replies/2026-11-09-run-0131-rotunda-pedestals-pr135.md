# 2026-11-09 ~01:31–01:42 UTC — R1b museum Rotunda pedestals built as PR #135

Session ..01HFWzToHt8256shdsp7mQn1, on Carter's "yes" (`decisions-2026-11-09-carter-floor-standard-correction.md` §2).
**Built:** PR #135, `loop/rotunda-pedestals` `1eb77b03`, off `main` `43850da4`.
- Socrates, Shiva and Isis now stand on pedestals in the 3D Rotunda (ring r 6.4 m, slots between the theme bays, off the
  walkway), each with a plaque, a lamp and a tap card (what is scanned / made here, pending review, links to its page).
- New `docs/museum/statues.js`; GLTFLoader loaded on demand with the museum's own three (r186; every import checked).
- Lazy: meshes fetched within 22 m of the ring, drawn within 18 m; pedestals hidden beyond 22 m.
- About card names the statues as the exception to "no scans, no likenesses"; Directory halls list them (text version).
**Checked:** review-checks --build 9/0/0; verify all; tests 42/42; headless 390 px: all three load and render, tap card right,
no script errors. Perf (SwiftShader, `museum-baseline`): startup +9 KB; hall unchanged; Rotunda 72k → 255k tris,
7.3 → ~5.4 fps in software (not measured on a phone). Screenshot `handoff/previews/pr135/statues-in-rotunda-390.png`.
**Needs:** independent review by a session other than ..01HFWzToHt8256shdsp7mQn1; GitHub green incl. Lighthouse; Carter's per-item yes.
Note: the 01:41 hourly run may have stood down on this lock (released 01:42).
