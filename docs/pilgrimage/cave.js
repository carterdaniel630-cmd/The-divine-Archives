/* ==========================================================================
   THE DIVINE ARCHIVES — the Pilgrimage: the irregular-cave builder

   One builder for every cave site (Qumran now; Lascaux, Chauvet and Mogao
   later, per plans/pilgrimage-sites.md). A cave is a flat walkable floor
   inside a ring of wall that leans in as it rises and closes in a rough dome,
   with seeded noise so no two caves are alike. Openings (a mouth to the
   outside, a way through to the next chamber) are angular gaps in the wall,
   up to a given height. Faces point into the cave.

   cave(B, keys, o) adds triangles to a kit.js Bucket:
     keys   { floor, wall } material names in the bucket
     o      { cx, cz, y, rx, rz, h, seed, n, rough, gaps: [{ a0, a1, h }] }
            centre, floor height, half-widths east–west (rx) and north–south
            (rz), height at the crown, seed, segments round the ring, how rough
            the wall is (0–1), and openings by bearing in radians (0 = north,
            clockwise, as in the museum) up to height h above the floor
   Returns { radiusAt(bearing), floorY } for placing things against the wall.
   ========================================================================== */
import * as THREE from "three";

function rng(seed) { let s = (seed | 0) || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// a quad whose face points toward `inside`
function quadIn(B, mat, a, b, c, d, inside) {
  const n = new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(b, a), new THREE.Vector3().subVectors(d, a));
  const toIn = new THREE.Vector3().subVectors(inside, a);
  if (n.dot(toIn) >= 0) B.quad(mat, a, b, c, d); else B.quad(mat, a, d, c, b);
}
function triIn(B, mat, a, b, c, inside) {
  const n = new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(b, a), new THREE.Vector3().subVectors(c, a));
  if (n.dot(new THREE.Vector3().subVectors(inside, a)) >= 0) B.tri(mat, a, b, c); else B.tri(mat, a, c, b);
}

export function cave(B, keys, o) {
  const n = o.n || 22, R = rng(o.seed || 7), rough = o.rough == null ? 0.35 : o.rough, y = o.y || 0;
  // the ring's profile: [height fraction, radius fraction]; the wall bulges a little, then closes
  const prof = [[0, 1], [0.32, 1.04], [0.62, 0.9], [0.86, 0.58], [1, 0.16]];
  const jit = []; for (let i = 0; i < n; i++) jit.push(1 + (R() - 0.5) * rough);
  const ringJit = prof.map(() => { const a = []; for (let i = 0; i < n; i++) a.push(1 + (R() - 0.5) * rough * 0.6); return a; });
  const bearing = (i) => (i / n) * Math.PI * 2;
  const P = (i, k) => {
    const j = ((i % n) + n) % n, b = bearing(j), [hf, rf] = prof[k], s = jit[j] * ringJit[k][j] * rf;
    return V(o.cx + Math.sin(b) * o.rx * s, y + hf * o.h * (1 + (ringJit[k][j] - 1) * 0.5), o.cz - Math.cos(b) * o.rz * s);
  };
  const inside = V(o.cx, y + o.h * 0.45, o.cz), gaps = o.gaps || [];
  const inGap = (b, hTop) => gaps.some((g) => {
    let a0 = g.a0, a1 = g.a1, bb = b; if (a1 < a0) a1 += Math.PI * 2; if (bb < a0) bb += Math.PI * 2;
    return bb >= a0 && bb <= a1 && hTop <= g.h + 1e-6;
  });
  // the floor: a fan of triangles under the first ring
  for (let i = 0; i < n; i++) triIn(B, keys.floor, V(o.cx, y, o.cz), V(P(i, 0).x, y, P(i, 0).z), V(P(i + 1, 0).x, y, P(i + 1, 0).z), V(o.cx, y + 1, o.cz));
  // the wall, ring by ring; a quad is left out where it falls inside an opening
  for (let k = 0; k < prof.length - 1; k++) {
    for (let i = 0; i < n; i++) {
      const mid = (bearing(i) + bearing(i + 1)) / 2, top = prof[k + 1][0] * o.h;
      if (inGap(mid, top)) continue;
      quadIn(B, keys.wall, P(i, k), P(i + 1, k), P(i + 1, k + 1), P(i, k + 1), inside);
    }
  }
  // the crown
  const crown = V(o.cx + (R() - 0.5) * 0.3, y + o.h, o.cz + (R() - 0.5) * 0.3), last = prof.length - 1;
  for (let i = 0; i < n; i++) triIn(B, keys.wall, P(i, last), P(i + 1, last), crown, inside);
  return {
    floorY: y,
    // distance from the centre to the wall at floor level, along a bearing (for placing cases and holes)
    radiusAt(b) { const i = Math.round((b / (Math.PI * 2)) * n); const j = ((i % n) + n) % n; return Math.hypot(o.rx * Math.sin(b), o.rz * Math.cos(b)) * jit[j]; },
    point(b, hf) { const i = Math.round((b / (Math.PI * 2)) * n); const j = ((i % n) + n) % n; const rr = jit[j] * (hf < 0.32 ? 1 + hf * 0.12 : 1.04 - (hf - 0.32) * 0.45); return V(o.cx + Math.sin(b) * o.rx * rr, y + hf * o.h, o.cz - Math.cos(b) * o.rz * rr); }
  };
}

// rubble: a scatter of rough stones (fallen roof, spoil), merged into one bucket material
export function rubble(B, mat, cx, cz, y, spread, count, seed) {
  const R = rng(seed || 11);
  for (let i = 0; i < count; i++) {
    const s = 0.12 + R() * 0.45, x = cx + (R() - 0.5) * spread * 2, z = cz + (R() - 0.5) * spread * 2;
    const g = new THREE.DodecahedronGeometry(s, 0); g.scale(1, 0.55 + R() * 0.4, 0.8 + R() * 0.5);
    g.rotateY(R() * 6.3); g.translate(x, y + s * 0.35, z);
    B.geo(mat, g);
  }
}
