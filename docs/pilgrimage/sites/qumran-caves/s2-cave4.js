/* II · Cave 4: two chambers hollowed by hand out of the marl, joined by a low way through, with rows of
   holes in the walls of the first. Sizes APPROX (dims.js).

   Presence Pass proof piece (order-2026-11-01-presence-pass.md item 4, "one varied wall in Qumran's Cave 4"):
   the marl walls and floor carry the Visual Foundation Kit's world-space breakup, so the stone no longer shows
   one tile stamped across it, and the wall facets are lit smoothly; the holes are cut INTO the wall (a socket
   with depth that darkens inward), hand-made rather than ruled: sizes, spacing and row heights wander, a few
   are broken out wider and a few are lost. Their number, spacing and wear remain our estimate, as the card says.

   Fix pass (order-2026-11-09-cave4-wall-fix.md, after atlas's live walk): the stone is now laid on the walls from
   three sides in world space, from a copy of the rock texture that repeats without a line (no seam between panels,
   no straight line where the wall turns into the vault, no mirrored V of pick marks); the shell's facets are lit
   as one surface; every hole, small or large, has a worn lip and a lit socket wall falling into shadow; and the
   mouth is cut to the width of its passage, with its jambs closed, so the dark slot beside it is gone.
   Second pass (after the independent review): each chamber's shell is wrapped round its own centre rather than
   projected flat, and its relief combed one way, so no chevron forms under the vault or round the visitor's lamp;
   and the small holes keep a lit socket wall and a lip that reads at standing distance on a phone. */
import * as THREE from "three";
import site, { C4 } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket } from "../../kit.js?v=1";
import { withBreakup } from "../../../assets/foundation/kit.js";
import { cave, rubble } from "../../cave.js?v=1";
import { markers, glassCase, finish } from "../../parts.js?v=1";
import { enochFragments } from "./relics.js?v=1";

export function build(ctx) {
  // the shared marl materials, cloned so the kit's breakup (and, on the walls, the three-sided projection) applies
  // to this cave only
  const marlOf = (wrap) => triplanar(withBreakup(ctx.mat("rock", { color: new THREE.Color("#e8dcc2") }).clone(), 0.2, 2.3), wrap);
  const marl = marlOf(null);
  const floorM = withBreakup(ctx.mat("rock", { color: new THREE.Color("#cdbd9c") }).clone(), 0.16, 1.7);
  // each chamber's shell takes its stone wrapped round the chamber's own centre (see triplanar): the seam of the
  // wrap sits in the chamber's own opening (4a's mouth to the north, 4b's way through to the west)
  const bx = C4.x + D.c4bOff, PI = Math.PI;
  const marlA = marlOf({ x: C4.x, z: C4.z, rx: D.c4a.rx, rz: D.c4a.rz, r: (D.c4a.rx + D.c4a.rz) / 2, seam: 0 });
  const marlB = marlOf({ x: bx, z: C4.z + 0.3, rx: D.c4b.rx, rz: D.c4b.rz, r: (D.c4b.rx + D.c4b.rz) / 2, seam: 1.5 * PI });
  // the shared rock texture's pick marks do not repeat cleanly at its 3 m tile, which drew a hairline every 3 m
  // across the walls and floor (the "panel seams" of atlas's walk); this cave gets a copy cross-faded across its
  // edges so it tiles without a line (the shared texture, used elsewhere, is left as it is)
  const seamless = { map: seamlessCopy(marl.map), normalMap: seamlessCopy(marl.normalMap) };
  for (const m of [marl, marlA, marlB, floorM]) { m.map = seamless.map; m.normalMap = seamless.normalMap; }
  const B = new Bucket(), F = new Bucket();
  // 4a: the mouth to the north, the way through to the east
  const a = cave(B, { floor: "f", wall: "wa" }, { cx: C4.x, cz: C4.z, y: 0, rx: D.c4a.rx, rz: D.c4a.rz, h: D.c4a.h, seed: 41, rough: 0.18,
    // the mouth's opening straddles north (bearings run 0..2PI, so it is written from just west of north round to
    // just east of it); before the fix it was written from -0.33, which only opened the eastern half of the wall
    gaps: [{ a0: 2 * PI - 0.33, a1: 0.33, h: 1.7 }, { a0: PI / 2 - 0.2, a1: PI / 2 + 0.28, h: 1.6 }] });
  cave(B, { floor: "f", wall: "wb" }, { cx: bx, cz: C4.z + 0.3, y: 0, rx: D.c4b.rx, rz: D.c4b.rz, h: D.c4b.h, seed: 42, rough: 0.2,
    gaps: [{ a0: 1.5 * PI - 0.3, a1: 1.5 * PI + 0.25, h: 1.6 }] });
  // the way through between the chambers: a short low tunnel
  const tx0 = C4.x + D.c4a.rx - 0.4, tx1 = bx - D.c4b.rx + 0.4, tz0 = C4.z - 0.25, tz1 = C4.z + 0.95, th = 1.55;
  const T = (x, y, z) => new THREE.Vector3(x, y, z);
  F.quad("f", T(tx0, 0, tz1), T(tx1, 0, tz1), T(tx1, 0, tz0), T(tx0, 0, tz0));
  B.quad("w", T(tx0, th, tz0), T(tx1, th, tz0), T(tx1, th, tz1), T(tx0, th, tz1));
  B.quad("w", T(tx0, 0, tz0), T(tx1, 0, tz0), T(tx1, th, tz0), T(tx0, th, tz0));
  B.quad("w", T(tx1, 0, tz1), T(tx0, 0, tz1), T(tx0, th, tz1), T(tx1, th, tz1));
  // the mouth: a short passage out to the north, open to the light at its end
  const mz0 = C4.z - D.c4a.rz - 1.9, mz1 = C4.z - D.c4a.rz + 0.3, mh = 1.7;
  F.quad("f", T(C4.x - 0.75, 0, mz1), T(C4.x + 0.75, 0, mz1), T(C4.x + 0.75, 0, mz0), T(C4.x - 0.75, 0, mz0));
  B.quad("w", T(C4.x - 0.75, mh, mz0), T(C4.x + 0.75, mh, mz0), T(C4.x + 0.75, mh, mz1), T(C4.x - 0.75, mh, mz1));
  B.quad("w", T(C4.x - 0.75, 0, mz1), T(C4.x - 0.75, 0, mz0), T(C4.x - 0.75, mh, mz0), T(C4.x - 0.75, mh, mz1));
  B.quad("w", T(C4.x + 0.75, 0, mz0), T(C4.x + 0.75, 0, mz1), T(C4.x + 0.75, mh, mz1), T(C4.x + 0.75, mh, mz0));
  const day = new THREE.Mesh(new THREE.PlaneGeometry(1.5, mh), new THREE.MeshBasicMaterial({ color: "#f2e3c4" }));
  day.position.set(C4.x, mh / 2, mz0 - 0.02); ctx.group.add(day);
  ctx.portal({ w: 1.0, h: 1.4, tint: "#fff0d0" }, C4.x, 0, mz0 + 0.25, 0);
  rubble(B, "f", C4.x - 2.2, C4.z + 1.2, 0, 0.6, 7, 43);
  const walls = finish(ctx, B, { w: marl, wa: marlA, wb: marlB, f: floorM }, ["f"]);
  finish(ctx, F, { f: floorM }, ["f"]);
  // each chamber's hewn shell: the stone is wrapped round the chamber in world space by its material (triplanar,
  // below), so the shell needs no UVs of its own; its facets are lit as one surface
  const wa = walls.find((m) => m.name === "wa"), wb = walls.find((m) => m.name === "wb");
  smoothNormals(wa.geometry, 0.2); smoothNormals(wb.geometry, 0.2);
  const jambs = mouthJambs(ctx, wa, marl, floorM, { x: C4.x, z: C4.z, half: 0.75, z1: mz1, h: mh });
  const sockets = holeRows(ctx, wa, { x: C4.x, z: C4.z, h: D.c4a.h });
  // the case: Aramaic fragments of Enoch
  glassCase(ctx, C4.x + 1.6, C4.z + 1.2, enochFragments().root, ctx.infoById("c4-enoch"));
  // daylight from the mouth and a little spill inside (no fittings: the caves are unlit)
  ctx.light(C4.x, 1.4, mz0 + 0.6, 0.9); ctx.light(C4.x - 0.5, 1.8, C4.z, 0.45); ctx.light(bx, 1.6, C4.z + 0.3, 0.35);
  markers(ctx, site, "s2");
  return { dispose() { marl.dispose(); marlA.dispose(); marlB.dispose(); floorM.dispose(); seamless.map.dispose(); seamless.normalMap.dispose(); sockets.dispose(); jambs.dispose(); } };
}

// ---------------------------------------------------------------- the stone laid from three sides
// The kit's UVs project each face on its own dominant axis (and flip u by which way a face points, so two facing
// walls mirror each other); a wrap round the chamber still has to change scheme where the wall turns into the
// vault, which drew a straight line round the room. Here the material ignores UVs: colour and relief are sampled
// in world space from the three axis planes and blended by the surface's own normal (the relief by the "whiteout"
// blend), so there is no seam and no boundary anywhere on the shell. Each side plane reads its u along the wall in
// the same turning sense all the way round, and the texture is turned about 34 degrees on every plane.
// A chamber's own shell (`wrap`: its centre, its radii and the bearing of its opening) takes its stone differently
// (second fix pass, after the independent review's F1: a chevron still read down the middle of 4b's east wall from
// head height up). It had two causes, found by taking each away in turn:
//  - three flat projections cannot follow a vault. Where the wall leans in overhead, the top-down plane drapes its
//    straight pick marks over the curve as arches, and the side plane across the wall reads the slope into the rock
//    as its u, flipped either side of the wall's middle. So the shell is wrapped instead: u runs round the chamber
//    (bearing x a radius sized to a whole number of tiles, so the wrap closes on itself) and v runs up the wall and
//    over the vault (height plus how far the wall has come in), worked out per pixel in world space, so there is
//    still no vault boundary and no UV seam. The wrap's one join sits in the chamber's own opening; only the crown,
//    where the wrap would pinch, takes the top-down plane, faded in as the rock turns flat overhead, its relief
//    combed to run up towards the crown as the wrap's strokes nearly do there (so it draws no arches either).
//  - the visitor's own lamp, carried at the eye. On relief whose strokes run every way, a light at the eye picks out
//    the strokes that lie across its beam, which form rings round whatever point of the wall you face: a V or an
//    arch always centred in the view, wherever you stand (moving the chamber's lamps does not move it). So the
//    relief on the shell is combed one way, as pick marks struck by one hand run one way: the relief across the
//    stroke (about 70 degrees from level, wandering a little with the kit's breakup) is kept whole and the rest
//    kept at a fifth (the stroke relief itself a little deeper, so the wall does not go flat), so the lamp has no second set of strokes to draw a mirror image with.
// Chained after the kit's breakup, whose world position it reuses (and whose second noise field steers the comb).
function triplanar(mat, wrap) {
  const prev = mat.onBeforeCompile, tile = 1 / 3;   // the rock texture's tile: 3 m (stone.js, KINDS.rock)
  // the wrap's circumference rounded to whole tiles, so the texture meets itself at the join
  const wrapR = wrap ? Math.max(1, Math.round((2 * Math.PI * wrap.r) / 3)) * 3 / (2 * Math.PI) : 0;
  mat.onBeforeCompile = (sh, r) => {
    prev(sh, r);
    sh.uniforms.triTile = { value: tile };
    if (wrap) { sh.uniforms.triC = { value: new THREE.Vector2(wrap.x, wrap.z) }; sh.uniforms.triE = { value: new THREE.Vector2(wrap.rx, wrap.rz) }; sh.uniforms.triR = { value: wrapR }; sh.uniforms.triSeam = { value: wrap.seam }; }
    // the wrap: u, v in tiles, and their screen derivatives taken from whichever side of the join is continuous
    const wrapFns = !wrap ? "" : `
uniform vec2 triC; uniform vec2 triE; uniform float triR; uniform float triSeam;
float triUp(vec3 p) { vec2 d = p.xz - triC; float b = atan(d.x, -d.y); return p.y + max(0.0, length(vec2(triE.x * sin(b), triE.y * cos(b))) * 1.04 - length(d)); }
vec2 triWrapUv(vec3 p) { vec2 d = p.xz - triC; float b = mod(atan(d.x, -d.y) - triSeam, 6.2831853); return vec2(b * triR, triUp(p)) * triTile; }
vec4 triWrapGrad(vec3 p) {
  vec2 d = p.xz - triC; float b = atan(d.x, -d.y) - triSeam, b0 = mod(b, 6.2831853), b1 = mod(b + 3.1415927, 6.2831853);
  float gx = abs(dFdx(b0)) < abs(dFdx(b1)) ? dFdx(b0) : dFdx(b1), gy = abs(dFdy(b0)) < abs(dFdy(b1)) ? dFdy(b0) : dFdy(b1);
  float up = triUp(p); return vec4(gx * triR, dFdx(up), gy * triR, dFdy(up)) * triTile;
}
float triCrown(vec3 n) { return smoothstep(0.93, 0.985, abs(n.y)); }`;
    sh.fragmentShader = sh.fragmentShader
      .replace("uniform float kitScale;", "uniform float kitScale;\nuniform float triTile;\nvec3 triW(vec3 n) { vec3 w = pow(abs(n), vec3(4.0)); return w / (w.x + w.y + w.z); }\nconst mat2 triRot = mat2(0.8253, 0.5646, -0.5646, 0.8253);" + wrapFns)
      .replace("#include <map_fragment>", `{
        vec3 tn = normalize((vec4(vNormal * (gl_FrontFacing ? 1.0 : -1.0), 0.0) * viewMatrix).xyz), tw = triW(tn), tp = vKitWorld * triTile;
        float sx = tn.x < 0.0 ? -1.0 : 1.0, sz = tn.z < 0.0 ? -1.0 : 1.0;
        vec4 tc = texture2D(map, triRot * vec2(-sx * tp.z, tp.y)) * tw.x + texture2D(map, triRot * tp.xz) * tw.y + texture2D(map, triRot * vec2(sz * tp.x, tp.y)) * tw.z;
        ${wrap ? "vec4 g = triWrapGrad(vKitWorld); tc = mix(textureGrad(map, triWrapUv(vKitWorld), g.xy, g.zw), texture2D(map, triRot * tp.xz), triCrown(tn));" : ""}
        diffuseColor *= tc;
      }`)
      .replace("#include <normal_fragment_maps>", `{
        vec3 gn = normalize((vec4(normal, 0.0) * viewMatrix).xyz), tw = triW(gn), tp = vKitWorld * triTile;
        float sx = gn.x < 0.0 ? -1.0 : 1.0, sz = gn.z < 0.0 ? -1.0 : 1.0;
        vec3 nx = texture2D(normalMap, triRot * vec2(-sx * tp.z, tp.y)).xyz * 2.0 - 1.0, ny = texture2D(normalMap, triRot * tp.xz).xyz * 2.0 - 1.0, nz = texture2D(normalMap, triRot * vec2(sz * tp.x, tp.y)).xyz * 2.0 - 1.0;
        nx.xy *= normalScale; ny.xy *= normalScale; nz.xy *= normalScale;
        nx.xy = nx.xy * triRot; ny.xy = ny.xy * triRot; nz.xy = nz.xy * triRot;   // back from the turned texture
        nx.x *= -sx; nz.x *= sz;   // and the sideways axis follows the u it was read along
        nx = vec3(nx.xy + gn.zy, abs(nx.z) * gn.x); ny = vec3(ny.xy + gn.xz, abs(ny.z) * gn.y); nz = vec3(nz.xy + gn.xy, abs(nz.z) * gn.z);
        vec3 wn = normalize(nx.zyx * tw.x + ny.xzy * tw.y + nz.xyz * tw.z);
        ${wrap ? `{
          // the wrap's own frame: u round the chamber (the way the bearing grows), v up the wall and over the vault
          vec2 d = vKitWorld.xz - triC; float b = atan(d.x, -d.y);
          vec3 tu = vec3(cos(b), 0.0, sin(b)); tu = normalize(tu - gn * dot(gn, tu)); vec3 tv = normalize(cross(gn, tu)); if (tv.y < 0.0) tv = -tv;
          vec4 g = triWrapGrad(vKitWorld); vec3 nw = textureGrad(normalMap, triWrapUv(vKitWorld), g.xy, g.zw).xyz * 2.0 - 1.0; nw.xy *= normalScale;
          float st = 1.2 + (kitB.g - 0.5) * 0.6; vec2 sk = vec2(-sin(st), cos(st)); float sa = dot(nw.xy, sk);
          nw.xy = sk * sa * 1.5 + (nw.xy - sk * sa) * 0.2;
          // the crown: the top-down plane alone, its relief combed to run up the vault towards the crown, as the
          // wrap's strokes nearly do there
          vec2 hz = gn.xz; float hl = length(hz); hz = hl > 1e-4 ? hz / hl : vec2(1.0, 0.0); vec2 tz = vec2(-hz.y, hz.x);
          vec3 ncr = texture2D(normalMap, triRot * tp.xz).xyz * 2.0 - 1.0; ncr.xy *= normalScale; ncr.xy = ncr.xy * triRot;
          float ca = dot(ncr.xy, tz); ncr.xy = tz * ca * 1.5 + (ncr.xy - tz * ca) * 0.2;
          ncr = normalize(vec3(ncr.x + gn.x, abs(ncr.z) * gn.y, ncr.y + gn.z));
          wn = normalize(mix(normalize(tu * nw.x + tv * nw.y + gn * nw.z), ncr, triCrown(gn)));
        }` : ""}
        normal = normalize((viewMatrix * vec4(wn, 0.0)).xyz);
      }`);
  };
  mat.customProgramCacheKey = () => (wrap ? "kit-breakup-triplanar-wrap" : "kit-breakup-triplanar");
  return mat;
}

// ---------------------------------------------------------------- a copy of a texture that tiles without a line
// Two passes, one per axis: each pixel is blended with the pixel half a tile away, weighted so that near the
// tile's edge the far pixel (from the middle of the tile, where the source is continuous) takes over, and in the
// middle the pixel itself is kept (so the far copy's own join, which lies there, never shows). Done once per load.
function seamlessCopy(tex) {
  const src = tex.image, W = src.width, H = src.height, c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d"); g.drawImage(src, 0, 0);
  const img = g.getImageData(0, 0, W, H), d = img.data, tmp = new Uint8ClampedArray(d.length), band = 0.08;
  const wt = (f) => { const e = Math.min(f, 1 - f) / band; return e >= 1 ? 1 : e * e * (3 - 2 * e); };  // 0 at the edge, 1 inside
  for (const axis of [0, 1]) {
    tmp.set(d);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const w = axis ? wt((y + 0.5) / H) : wt((x + 0.5) / W);
      if (w >= 1) continue;
      const o = (y * W + x) * 4, q = axis ? ((((y + H / 2) | 0) % H) * W + x) * 4 : (y * W + (((x + W / 2) | 0) % W)) * 4;
      for (let k = 0; k < 3; k++) d[o + k] = tmp[o + k] * w + tmp[q + k] * (1 - w);
    }
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = tex.anisotropy; t.colorSpace = tex.colorSpace; t.repeat.copy(tex.repeat);
  return t;
}

// ---------------------------------------------------------------- the mouth's jambs
// The opening in the chamber wall is a little wider than the passage cut out to the north (the ring is drawn in
// whole segments), so beside each passage wall a narrow slot looked out into nothing: the dark wedge at the
// entrance. Each slot is closed by a jamb: a short return of the same stone from the passage wall out to the
// chamber wall, set just behind the chamber wall's own surface (found by casting onto it) so only the slot shows it.
function mouthJambs(ctx, wallMesh, mat, floorMat, o) {
  const ray = new THREE.Raycaster(), B = new Bucket(), T = (x, y, z) => new THREE.Vector3(x, y, z);
  for (const side of [-1, 1]) {
    // the chamber wall just beyond the opening's edge on this side, low and high
    let zWall = Infinity;
    for (const y of [0.05, 0.8, 1.6]) for (const b of [0.33, 0.36, 0.42]) {
      const bb = side > 0 ? b : 2 * Math.PI - b;
      ray.set(T(o.x, y, o.z), T(Math.sin(bb), 0, -Math.cos(bb))); ray.far = 8;
      const hit = ray.intersectObject(wallMesh, false)[0];
      if (hit) zWall = Math.min(zWall, hit.point.z);
    }
    if (!isFinite(zWall)) continue;
    const z = Math.min(zWall - 0.04, o.z1 - 0.05), x0 = o.x + side * o.half, x1 = o.x + side * (o.half + 0.9);
    // faces south, into the chamber
    if (side > 0) B.quad("j", T(x0, 0, z), T(x1, 0, z), T(x1, o.h, z), T(x0, o.h, z));
    else B.quad("j", T(x1, 0, z), T(x0, 0, z), T(x0, o.h, z), T(x1, o.h, z));
    // and a strip of floor in the slot, a hair below the chamber floor so the two never fight where they overlap
    const xa = Math.min(x0, x1), xb = Math.max(x0, x1);
    B.quad("g", T(xa, -0.003, o.z1), T(xb, -0.003, o.z1), T(xb, -0.003, z), T(xa, -0.003, z));
  }
  const meshes = finish(ctx, B, { j: mat, g: floorMat }, ["g"]);
  return { dispose() { for (const m of meshes) m.geometry.dispose(); } };
}

// ---------------------------------------------------------------- the wall's facets, lit smoothly
// average each vertex's normal with the normals of the vertices at the same place whose faces meet at a
// shallow angle (cos above `minDot`), so the ring reads as one hewn surface, not a set of flat panels
function smoothNormals(g, minDot) {
  const p = g.attributes.position, n = g.attributes.normal, key = (i) => `${Math.round(p.getX(i) * 500)},${Math.round(p.getY(i) * 500)},${Math.round(p.getZ(i) * 500)}`;
  const at = new Map();
  for (let i = 0; i < p.count; i++) { const k = key(i); (at.get(k) || at.set(k, []).get(k)).push(i); }
  const out = new Float32Array(n.count * 3), a = new THREE.Vector3(), b = new THREE.Vector3(), s = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    a.fromBufferAttribute(n, i); s.set(0, 0, 0);
    for (const j of at.get(key(i))) { b.fromBufferAttribute(n, j); if (a.dot(b) >= minDot) s.add(b); }
    s.normalize(); out[i * 3] = s.x; out[i * 3 + 1] = s.y; out[i * 3 + 2] = s.z;
  }
  g.setAttribute("normal", new THREE.BufferAttribute(out, 3));
}

// ---------------------------------------------------------------- the holes, cut into the wall
// Each hole is a socket: a short tapering tube into the rock, closed at the back, darkening inward. The wall
// itself is one mesh, so the hole is opened in it by drawing order alone (no stencil, no shader tricks): the
// sockets are drawn first, then a mask (a disc a few millimetres in front of the wall, depth only, no colour),
// then everything else. The wall behind a mask fails the depth test, so the socket shows through the disc;
// anything nearer than the wall still draws over it, and outside the discs the wall covers the sockets.
function holeRows(ctx, wallMesh, o) {
  const PI = Math.PI, R = rng(4401), ray = new THREE.Raycaster(), up = new THREE.Vector3(0, 1, 0);
  const pos = [], nrm = [], col = [], masks = [];
  const tube = (W, N, axis, r, rBack, depth, oval, rl) => {
    let P = W;
    // a frame on the socket: w along the axis into the rock (level, as a peg hole is bored), u across, v up.
    // The hewn wall leans, so a level tube centred on the wall point would stand proud of it below the hole;
    // the tube starts that far back (lead), and the mask in the wall's own plane opens onto its inside.
    const tanT = Math.abs(N.y) / Math.max(1e-3, Math.hypot(N.x, N.z)), lead = r * tanT + 0.004;
    P = new THREE.Vector3().copy(W).addScaledVector(axis, lead);
    const w = axis, u = new THREE.Vector3().crossVectors(up, w).normalize(), v = new THREE.Vector3().crossVectors(w, u);
    const seg = 12, ring = (t) => { const rr = r + (rBack - r) * t, out = []; for (let k = 0; k <= seg; k++) { const th = (k / seg) * PI * 2; out.push(new THREE.Vector3().copy(P).addScaledVector(u, Math.cos(th) * rr * oval).addScaledVector(v, Math.sin(th) * rr).addScaledVector(w, t * depth)); } return out; };
    // the socket's own wall stays lit for its first part and only then falls into shadow, so even a small hole
    // reads as a hole with sides at standing distance, not as a flat dark dot (atlas's walk, fault 1): the socket's
    // mouth is half as bright again as the live wall's (0.5 against 0.34), so the lit crescent of its far side shows
    // on a phone, and only its back half goes dark
    const r0 = ring(0), r1 = ring(0.5), r2 = ring(1), shade = [0.5, 0.17, 0.03];
    const push = (pt, nn, c) => { pos.push(pt.x, pt.y, pt.z); nrm.push(nn.x, nn.y, nn.z); col.push(c, c * 0.97, c * 0.92); };
    const inward = (pt, t) => new THREE.Vector3().subVectors(P, pt).addScaledVector(w, t * depth).normalize();  // faces the axis
    const band = (A, Bv, ta, tb, ca, cb) => {
      for (let k = 0; k < seg; k++) {
        const q = [[A[k], ta, ca], [Bv[k], tb, cb], [Bv[k + 1], tb, cb], [A[k], ta, ca], [Bv[k + 1], tb, cb], [A[k + 1], ta, ca]];
        for (const [pt, t, c] of q) push(pt, inward(pt, t), c);
      }
    };
    band(r0, r1, 0, 0.5, shade[0], shade[1]); band(r1, r2, 0.5, 1, shade[1], shade[2]);
    // the worn lip: a narrow bevel from the wall's own face down to the mouth of the socket, catching the light on
    // its far side and shadowed on its near side, as a hole bored by hand and rubbed by use would be. It lies in the
    // wall's plane at its outer edge, just proud of the wall, so the wall meets it without a gap.
    // the lip's axes: the socket's own u, and its v laid into the wall's plane, so ring k of the lip meets ring k of
    // the socket. Its outer edge sits near the wall's own tone and its inner edge a little darker, so the lip reads
    // as worn stone turning down into the hole, not as a dark ring round it.
    const wu = u, wv = new THREE.Vector3().copy(v).addScaledVector(N, -v.dot(N)).normalize();
    const lip = r * (rl || 1.5), lipO = [];
    for (let k = 0; k <= seg; k++) { const th = (k / seg) * PI * 2; lipO.push(new THREE.Vector3().copy(W).addScaledVector(N, 0.004).addScaledVector(wu, Math.cos(th) * lip * oval).addScaledVector(wv, Math.sin(th) * lip)); }
    for (let k = 0; k < seg; k++) {
      const q = [[lipO[k], 0], [r0[k], 1], [r0[k + 1], 1], [lipO[k], 0], [r0[k + 1], 1], [lipO[k + 1], 0]];
      for (const [pt, t] of q) push(pt, t ? inward(pt, 0).lerp(N, 0.35).normalize() : N, t ? 0.58 : 0.7);
    }
    const back = new THREE.Vector3().copy(P).addScaledVector(w, depth), bn = new THREE.Vector3().copy(w).negate();
    for (let k = 0; k < seg; k++) { push(back, bn, 0.012); push(r2[k + 1], bn, shade[2]); push(r2[k], bn, shade[2]); }
    // the mask: a disc in the wall's own plane, a few millimetres in front of it, a hair narrower than the lip (so
    // the wall closes over the lip's outer edge and no sliver opens round it), on the lip's own axes
    const mp = [], c = new THREE.Vector3().copy(W).addScaledVector(N, 0.006), mr = lip * 0.96;
    for (let k = 0; k < seg; k++) for (const kk of [k + 1, k]) { const th = (kk / seg) * PI * 2; if (kk === k + 1) mp.push(c.x, c.y, c.z); const q = new THREE.Vector3().copy(c).addScaledVector(wu, Math.cos(th) * mr * oval).addScaledVector(wv, Math.sin(th) * mr); mp.push(q.x, q.y, q.z); }
    const m = new THREE.BufferGeometry(); m.setAttribute("position", new THREE.Float32BufferAttribute(mp, 3)); masks.push(m);
  };
  // two rows along the south and west walls of 4a (as described); the hand that cut them did not rule them
  for (const [hf0, seed] of [[0.34, 0], [0.56, 1]]) {
    let b = PI * 0.64 + R() * 0.03;
    const drift = R() * PI * 2;
    while (b < PI * 1.58) {
      const hf = hf0 + Math.sin(b * 2.3 + drift) * 0.018 + (R() - 0.5) * 0.022;
      const step = (PI * 0.95 / 25) * (0.72 + R() * 0.56);
      const lost = R() < 0.07, broken = !lost && R() < 0.1;
      if (!lost) {
        const y = hf * o.h, dir = new THREE.Vector3(Math.sin(b), 0, -Math.cos(b)).normalize();
        ray.set(new THREE.Vector3(o.x, y, o.z), dir); ray.far = 8;
        const hit = ray.intersectObject(wallMesh, false)[0];
        if (hit) {
          const N = hit.face.normal.clone().transformDirection(wallMesh.matrixWorld);   // into the cave
          const axis = new THREE.Vector3(-N.x, 0, -N.z).normalize();                    // level, into the rock
          const r = broken ? 0.06 + R() * 0.025 : 0.034 + R() * 0.02;
          tube(hit.point, N, axis, r, r * (broken ? 0.55 : 0.78), broken ? 0.06 + R() * 0.04 : 0.09 + R() * 0.07, broken ? 1.25 + R() * 0.3 : 0.86 + R() * 0.26, broken ? 1.25 : 1.4);
        }
      }
      b += step;
    }
  }
  // wind every triangle to face the way its normals say, so the sockets draw single-sided
  for (let t = 0; t < pos.length; t += 9) {
    const A = new THREE.Vector3(pos[t], pos[t + 1], pos[t + 2]), Bv = new THREE.Vector3(pos[t + 3], pos[t + 4], pos[t + 5]), Cv = new THREE.Vector3(pos[t + 6], pos[t + 7], pos[t + 8]);
    const gn = new THREE.Vector3().crossVectors(Bv.sub(A), Cv.sub(A)), sn = new THREE.Vector3(nrm[t] + nrm[t + 3] + nrm[t + 6], nrm[t + 1] + nrm[t + 4] + nrm[t + 7], nrm[t + 2] + nrm[t + 5] + nrm[t + 8]);
    if (gn.dot(sn) < 0) for (const arr of [pos, nrm, col]) for (let c = 0; c < 3; c++) { const x = arr[t + 3 + c]; arr[t + 3 + c] = arr[t + 6 + c]; arr[t + 6 + c] = x; }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); g.computeBoundingSphere();
  const sockM = new THREE.MeshStandardMaterial({ color: "#cbb994", vertexColors: true, roughness: 0.96 });
  const sock = new THREE.Mesh(g, sockM); sock.renderOrder = -2; sock.matrixAutoUpdate = false; sock.updateMatrix();
  // merge the masks: depth only, after the sockets and before the wall
  const mg = mergeFlat(masks);
  const maskM = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, depthTest: true });
  const mask = new THREE.Mesh(mg, maskM); mask.renderOrder = -1; mask.matrixAutoUpdate = false; mask.updateMatrix();
  ctx.group.add(mask, sock);
  return { dispose() { sockM.dispose(); maskM.dispose(); } };
}
function mergeFlat(list) {
  const pos = [];
  for (const g of list) { const n = g.index ? g.toNonIndexed() : g, p = n.attributes.position; for (let i = 0; i < p.count; i++) pos.push(p.getX(i), p.getY(i), p.getZ(i)); g.dispose(); if (n !== g) n.dispose(); }
  const out = new THREE.BufferGeometry(); out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); out.computeBoundingSphere();
  return out;
}
function rng(seed) { let s = (seed | 0) || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
