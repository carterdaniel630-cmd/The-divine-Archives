/* ==========================================================================
   THE DIVINE ARCHIVES — the Pilgrimage: geometry kit

   Small builders shared by every site: quads with world-metre UVs (so the
   stone textures come out at true size whatever the surface), boxes with
   openings, sloped passages, merging by material, and the walkable regions
   the engine moves the visitor on.

   Conventions: metres; x east, y up, z south (so -z is north, as in the museum).
   ========================================================================== */
import * as THREE from "three";

// ---------------------------------------------------------------- a bucket of triangles per material
export class Bucket {
  constructor() { this.parts = {}; }
  // 4 corners in order (a,b,c,d) around the quad, facing the side the normal n points to
  quad(mat, a, b, c, d, uvMode) {
    const P = this.parts[mat] || (this.parts[mat] = { pos: [], nrm: [], uv: [] });
    const e1 = new THREE.Vector3().subVectors(b, a), e2 = new THREE.Vector3().subVectors(d, a);
    const n = new THREE.Vector3().crossVectors(e1, e2).normalize();
    const uvOf = (p) => worldUV(p, n, uvMode);
    for (const p of [a, b, c, a, c, d]) { P.pos.push(p.x, p.y, p.z); P.nrm.push(n.x, n.y, n.z); const t = uvOf(p); P.uv.push(t[0], t[1]); }
  }
  tri(mat, a, b, c) {
    const P = this.parts[mat] || (this.parts[mat] = { pos: [], nrm: [], uv: [] });
    const n = new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(b, a), new THREE.Vector3().subVectors(c, a)).normalize();
    for (const p of [a, b, c]) { P.pos.push(p.x, p.y, p.z); P.nrm.push(n.x, n.y, n.z); const t = worldUV(p, n); P.uv.push(t[0], t[1]); }
  }
  // add an arbitrary BufferGeometry (already positioned) under a material, with world UVs
  geo(mat, g) {
    const P = this.parts[mat] || (this.parts[mat] = { pos: [], nrm: [], uv: [] });
    const gg = g.index ? g.toNonIndexed() : g; gg.computeVertexNormals();
    const p = gg.attributes.position, nn = gg.attributes.normal;
    const v = new THREE.Vector3(), n = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); n.fromBufferAttribute(nn, i); P.pos.push(v.x, v.y, v.z); P.nrm.push(n.x, n.y, n.z); const t = worldUV(v, n); P.uv.push(t[0], t[1]); }
  }
  // one Mesh per material; `mats` maps the names used above to materials
  build(mats, group) {
    const out = [];
    for (const [name, P] of Object.entries(this.parts)) {
      if (!P.pos.length) continue;
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(P.pos, 3));
      g.setAttribute("normal", new THREE.Float32BufferAttribute(P.nrm, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(P.uv, 2));
      g.computeBoundingSphere();
      const m = new THREE.Mesh(g, mats[name]); m.name = name; m.matrixAutoUpdate = false; m.updateMatrix();
      group.add(m); out.push(m);
    }
    return out;
  }
}
// planar projection by the face's dominant axis; u runs horizontally, v up (or along z on floors)
export function worldUV(p, n, mode) {
  const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z);
  if (mode === "slopeFloor") return [p.x, p.z / Math.cos(0.4636)];   // a passage floor at ~26.5°: true metres along the slope
  if (ay >= ax && ay >= az) return [p.x, p.z];
  if (ax >= az) return [p.z * Math.sign(n.x || 1), p.y];
  return [-p.x * Math.sign(n.z || 1), p.y];
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);
export { V };

// ---------------------------------------------------------------- walls with rectangular openings
// a vertical wall from (x0,z0) to (x1,z1), floor y0, height h, facing the side to its LEFT when walking a->b.
// holes: [{u0,u1,v0,v1}] in metres along the wall (u from a) and up (v from y0)
export function wall(B, mat, x0, z0, x1, z1, y0, h, holes, yTop) {
  const L = Math.hypot(x1 - x0, z1 - z0), dx = (x1 - x0) / L, dz = (z1 - z0) / L;
  const P = (u, v) => V(x0 + dx * u, y0 + v, z0 + dz * u);
  const top = yTop != null ? yTop : h;
  holes = (holes || []).slice().sort((a, b) => a.u0 - b.u0);
  let u = 0;
  for (const hl of holes) {
    if (hl.u0 > u) B.quad(mat, P(u, 0), P(hl.u0, 0), P(hl.u0, top), P(u, top));
    if (hl.v0 > 0) B.quad(mat, P(hl.u0, 0), P(hl.u1, 0), P(hl.u1, hl.v0), P(hl.u0, hl.v0));
    if (hl.v1 < top) B.quad(mat, P(hl.u0, hl.v1), P(hl.u1, hl.v1), P(hl.u1, top), P(hl.u0, top));
    u = hl.u1;
  }
  if (u < L) B.quad(mat, P(u, 0), P(L, 0), P(L, top), P(u, top));
}
// a room seen from inside: floor, ceiling, four walls (each with optional holes)
export function room(B, mats, x0, x1, z0, z1, y0, h, holes, opt) {
  holes = holes || {}; opt = opt || {};
  const f = mats.floor || mats.wall, w = mats.wall, c = mats.ceil || mats.wall;
  if (!opt.noFloor) B.quad(f, V(x0, y0, z1), V(x1, y0, z1), V(x1, y0, z0), V(x0, y0, z0));
  if (!opt.noCeil) B.quad(c, V(x0, y0 + h, z0), V(x1, y0 + h, z0), V(x1, y0 + h, z1), V(x0, y0 + h, z1));
    // (a wall's normal is direction × up: walking +x gives +z)
  wall(B, w, x0, z0, x1, z0, y0, h, holes.n);   // north wall, faces south (+z); u runs west→east
  wall(B, w, x1, z1, x0, z1, y0, h, holes.s);   // south wall, faces north; u runs east→west
  wall(B, w, x0, z1, x0, z0, y0, h, holes.w);   // west wall, faces east; u runs south→north
  wall(B, w, x1, z0, x1, z1, y0, h, holes.e);   // east wall, faces west; u runs north→south
}

// ---------------------------------------------------------------- a straight sloped passage (square section)
// runs along +z (south) from z0 for horizontal run `run`, floor rising (or falling) by `rise`;
// width w centred on x=cx; height h measured perpendicular to the floor (as surveyors give it).
// gaps: { roof:[[s0,s1]], floor:[[s0,s1]], left:[[s0,s1]], right:[[s0,s1]] } in horizontal metres from z0
export function passage(B, mats, cx, z0, y0, run, rise, w, h, gaps, opt) {
  gaps = gaps || {}; opt = opt || {};
  const ang = Math.atan2(rise, run), hv = h / Math.cos(ang);    // vertical clear height
  const yF = (s) => y0 + rise * (s / run);
  const segs = (list) => {                                       // the solid intervals between gaps
    const g = (list || []).slice().sort((a, b) => a[0] - b[0]); const out = []; let s = 0;
    for (const [a, b] of g) { if (a > s) out.push([s, a]); s = Math.max(s, b); }
    if (s < run) out.push([s, run]); return out;
  };
  const xl = cx - w / 2, xr = cx + w / 2, z = (s) => z0 + s;
  for (const [a, b] of segs(gaps.floor)) B.quad(mats.floor, V(xl, yF(b), z(b)), V(xr, yF(b), z(b)), V(xr, yF(a), z(a)), V(xl, yF(a), z(a)), opt.floorUV);
  for (const [a, b] of segs(gaps.roof)) B.quad(mats.ceil || mats.wall, V(xl, yF(a) + hv, z(a)), V(xr, yF(a) + hv, z(a)), V(xr, yF(b) + hv, z(b)), V(xl, yF(b) + hv, z(b)));
  for (const [a, b] of segs(gaps.left)) B.quad(mats.wall, V(xl, yF(b), z(b)), V(xl, yF(a), z(a)), V(xl, yF(a) + hv, z(a)), V(xl, yF(b) + hv, z(b)));
  for (const [a, b] of segs(gaps.right)) B.quad(mats.wall, V(xr, yF(a), z(a)), V(xr, yF(b), z(b)), V(xr, yF(b) + hv, z(b)), V(xr, yF(a) + hv, z(a)));
  return { yF, hv, xl, xr };
}

// ---------------------------------------------------------------- walkable regions (for the engine)
// a rectangle in plan with a floor that is flat or slopes along z or x. Coordinates are where the
// visitor's centre may go, so pass the wall lines and an inset; `open` lists sides that join another
// region (no inset there, and a little overlap so the visitor passes from one to the next).
export function region(o) {
  const r = Object.assign({ eye: 1.62, inset: 0.28, open: "" }, o);
  const ins = (side) => (r.open.includes(side) ? -0.4 : r.inset);
  r.bx0 = Math.min(r.x0, r.x1) + ins("w"); r.bx1 = Math.max(r.x0, r.x1) - ins("e");
  r.bz0 = Math.min(r.z0, r.z1) + ins("n"); r.bz1 = Math.max(r.z0, r.z1) - ins("s");
  // floor height: y at z0 → y1 at z1 (or along x if r.axis === "x")
  r.floorAt = (x, z) => {
    if (r.y1 == null) return r.y;
    if (r.axis === "x") { const t = (x - r.x0) / (r.x1 - r.x0); return r.y + (r.y1 - r.y) * t; }
    const t = (z - r.z0) / (r.z1 - r.z0); return r.y + (r.y1 - r.y) * t;
  };
  // holes: [[x0,x1,z0,z1]] the visitor may not enter (a sarcophagus, a plinth)
  r.contains = (x, z) => x >= r.bx0 && x <= r.bx1 && z >= r.bz0 && z <= r.bz1 && !(r.holes || []).some((h) => x > h[0] && x < h[1] && z > h[2] && z < h[3]);
  return r;
}

// ---------------------------------------------------------------- outlines (voids known only from scans)
export function outlineBox(cx, cy, cz, sx, sy, sz, rotX, color) {
  const g = new THREE.EdgesGeometry(new THREE.BoxGeometry(sx, sy, sz));
  const m = new THREE.LineDashedMaterial({ color: color || "#e7c680", dashSize: 0.35, gapSize: 0.25, transparent: true, opacity: 0.9, depthTest: false });
  const l = new THREE.LineSegments(g, m); l.computeLineDistances();
  l.position.set(cx, cy, cz); if (rotX) l.rotation.x = rotX; l.renderOrder = 10;
  const fill = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), new THREE.MeshBasicMaterial({ color: color || "#e7c680", transparent: true, opacity: 0.08, depthTest: false, depthWrite: false }));
  fill.renderOrder = 9; l.add(fill);
  return l;
}
