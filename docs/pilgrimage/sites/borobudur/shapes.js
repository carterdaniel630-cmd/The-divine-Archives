/* Borobudur: small geometry helpers shared by the section modules. */
import * as THREE from "three";

// a box between two corners, added to bucket B under key k
export const box = (B, k, x0, x1, y0, y1, z0, z1) => { const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); B.geo(k, g); };
// the four axial directions as rotations: east, north, west, south (rotateY(a) turns +x to (cos a, 0, -sin a))
export const SIDES = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
// a flight of n steps on the east axis, climbing from (xa, ya) to (xb, yb) westward, half-width hw, repeated on all
// four sides (or only the east when `eastOnly`)
export function steps(B, k, xa, xb, ya, yb, hw, n, eastOnly) {
  for (const a of eastOnly ? [0] : SIDES) for (let i = 0; i < n; i++) {
    const x0 = xa + (xb - xa) * i / n, x1 = xa + (xb - xa) * (i + 1) / n, top = ya + (yb - ya) * (i + 1) / n;
    const g = new THREE.BoxGeometry(Math.abs(x1 - x0) + 0.02, top - ya + 0.01, 2 * hw);
    g.translate((x0 + x1) / 2, (ya + top) / 2, 0); g.rotateY(a); B.geo(k, g);
  }
}
// a square outline of half-width m with a notch of depth d and half-width s at the middle of each side, as a list
// of [x0, z0, x1, z1] edges going round (for walls)
export function notchedEdges(m, d, s) {
  const out = [];
  for (const a of SIDES) {
    const c = Math.cos(a), n = -Math.sin(a);                    // the side's outward direction (x, z)
    const P = (r, u) => [c * r - n * u, n * r + c * u];          // r outward, u along the side
    const pts = [P(m, -m), P(m, -s), P(m - d, -s), P(m - d, s), P(m, s), P(m, m)];
    for (let i = 0; i < pts.length - 1; i++) out.push([...pts[i], ...pts[i + 1]]);
  }
  return out;
}
// several geometries merged into one mesh keeping their own UVs and smooth normals (Bucket.geo would replace the
// UVs with world-metre ones, which a stupa's lattice cannot use)
export function merged(geos, mat) {
  const pos = [], nrm = [], uv = [];
  for (const g0 of geos) {
    const g = g0.index ? g0.toNonIndexed() : g0;
    if (!g.attributes.normal) g.computeVertexNormals();
    pos.push(...g.attributes.position.array); nrm.push(...g.attributes.normal.array); uv.push(...g.attributes.uv.array);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.computeBoundingSphere(); const m = new THREE.Mesh(g, mat); m.matrixAutoUpdate = false; m.updateMatrix(); return m;
}
