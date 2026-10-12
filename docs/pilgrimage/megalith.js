/* ==========================================================================
   THE DIVINE ARCHIVES — the Pilgrimage: the megalith builder

   Rough dressed stones for the prehistoric sites (Stonehenge and Newgrange
   now; Avebury, Carnac or Göbekli Tepe later). A stone is a box subdivided a
   little, tapered towards the top, with seeded noise on every vertex so no
   two stones are alike and none has a machine-straight edge. It can stand,
   lean, or lie fallen; a lintel is the same thing laid on its side.

   stone(B, key, o) adds triangles to a kit.js Bucket under material `key`:
     o  { x, z, y, w, d, h, yaw, lean, fall, taper, rough, seed }
        foot centre, ground height, width (along the stone's face), depth
        (thickness), height; yaw turns the face (radians, 0 = the face looks
        north, along -z); lean tips it about its long base edge; fall lays it
        flat (its top then points along the bearing yaw); taper (0–0.4)
        narrows the top; rough is the noise in metres.
   Returns the stone's plan footprint { x0, x1, z0, z1 }, for walkable-region
   holes.

   Conventions as in kit.js: metres; x east, y up, z south.
   ========================================================================== */
import * as THREE from "three";

function rng(seed) { let s = (seed | 0) || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }

export function stone(B, key, o) {
  const w = o.w, d = o.d, h = o.h, R = rng(o.seed || 1), rough = o.rough != null ? o.rough : Math.min(w, d) * 0.07;
  const g = new THREE.BoxGeometry(w, h, d, 3, 4, 2);
  const p = g.attributes.position, v = new THREE.Vector3();
  // the same noise for vertices that share a position, so the faces stay closed
  const jit = new Map();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const k = v.x.toFixed(3) + "," + v.y.toFixed(3) + "," + v.z.toFixed(3);
    if (!jit.has(k)) jit.set(k, [(R() - 0.5) * 2 * rough, (R() - 0.5) * rough, (R() - 0.5) * 2 * rough]);
    const j = jit.get(k), t = (v.y + h / 2) / h, tp = 1 - (o.taper || 0.12) * t;
    // the top is rounded off a little: corners drop
    const corner = t > 0.95 ? (Math.abs(v.x) / (w / 2)) * (Math.abs(v.z) / (d / 2)) * rough * 2.5 : 0;
    p.setXYZ(i, v.x * tp + j[0], v.y + h / 2 + j[1] - corner, v.z * tp + j[2]);
  }
  if (o.fall) { g.rotateX(-Math.PI / 2); g.translate(0, d / 2, 0); }   // lying on its face, top towards -z
  else if (o.lean) g.rotateX(o.lean);
  g.rotateY(-(o.yaw || 0));                                              // yaw is a bearing: 0 north, clockwise
  g.translate(o.x, o.y || 0, o.z);
  B.geo(key, g);
  g.computeBoundingBox();
  const bb = g.boundingBox;
  return { x0: bb.min.x, x1: bb.max.x, z0: bb.min.z, z1: bb.max.z };
}

// a lintel resting on two points (a, b) at height y: a long low stone between them
export function lintel(B, key, a, b, y, w, d, seed) {
  const len = Math.hypot(b.x - a.x, b.z - a.z), mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2;
  const yaw = Math.atan2(b.z - a.z, b.x - a.x);
  // a stone of width `len` (along a→b), height w (the lintel's vertical size), depth d
  return stone(B, key, { x: mx, z: mz, y, w: len, h: w, d, yaw, taper: 0.02, rough: 0.05, seed });
}

// a ring of footprints: where a set of stones stands, as [x0,x1,z0,z1] holes for a walkable region
export function holes(list, pad) {
  pad = pad || 0.15;
  return list.filter(Boolean).map((f) => [f.x0 - pad, f.x1 + pad, f.z0 - pad, f.z1 + pad]);
}
