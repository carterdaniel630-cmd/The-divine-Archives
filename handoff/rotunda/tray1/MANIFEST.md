# Rotunda Tray 1 — the three figures of record

Staged by atlas, 2026-11-08, at Claude's request
(`handoff/request-2026-11-08-atlas-inputs.md`, Carter approved).
Tray 1 = Socrates, Shiva, Isis (Carter's A6 rulings, 2026-11-07; spec at
`handoff/rotunda-tray1-spec.md`). The figures are built atlas-side;
Claude's share is site integration.

## One honest limit, up front

The figure meshes are binary 3D files (1–15 MB). This staging channel
carries plain text only — binary sent through it is stored corrupted
(that is what audit defect H-1 was), so the meshes themselves cannot
ride it. Below are the exact files of record with their fingerprints.
If integration truly needs the mesh files themselves, say so in STATUS
and atlas will route them another way; everything else about each
figure is in this note and its build notes atlas-side.

## Socrates — full standing figure, scan-first

- Rich mesh: `socrates-rich.glb` — 15,331,704 bytes —
  MD5 d2d58ab790d10fe148e31860518a63da
- Light mesh: `socrates-light.glb` — 2,792,648 bytes —
  MD5 3c03941cacc3690f981165789a85a081
- Exhibit page of record: `socrates-scan-single.html` — 3,023,986 bytes
- Source: photogrammetry of the Uffizi Socrates, assembled atlas-side
  into the full standing figure (build record: `rotunda-ring/socrates/`
  atlas-side, incl. build-meta.json and the candidate scan folders).

## Shiva — the Murudeshwar scan, dark bronze with gold

- Exhibit page of record: `shiva-single.html` — 2,822,469 bytes —
  MD5 8c92d4fa73ac7411a079b9684b300af2
- Scan mesh it carries: `shiva-scan-noload.glb` — 1,861,084 bytes —
  MD5 d0d106bb9c89f88da1614520498ea6db
- Source: photogrammetry of the seated Shiva statue at Murudeshwar,
  Karnataka (modern temple monument, inaugurated 2006), by Boris3D
  Studio, Thingiverse thing 3689465 — licensed CC BY 3.0
  (Attribution); the credit stands on the figure's plaque.
- Finish: dark statue bronze with gold, Carter's order 2026-10-27
  (the earlier blue finish is superseded and kept only as a backup).

## Isis — full statue, black stone with inlaid gold

- Mesh: `statue.glb` — 1,084,412 bytes —
  MD5 eece12759a2a95e43b0cf6089b8e5af4 (74,000 tris: black-stone mesh
  65,728, gold mesh 9,272; gold is separate geometry, never paint)
- Exhibit page of record: `isis-single.html` — 2,546,959 bytes —
  MD5 4ff6f86e0b2508107f911aaa28648d18
- Form: Carter's ruling 2026-10-27 — a full standing statue, not a
  bust. Built atlas-side to his confirmed reference (matte black
  figure, horned sun-disc crown in gold, broad gold collar, gold
  skirt, sistrum and situla).
- Face source: the Mount Holyoke Roman bronze bust of Isis, 2nd c. CE
  (MH 1965.10.C.G) — photogrammetry by Laura Shea, model by 3DWP,
  CC BY 4.0; head only, cut at the neck.
