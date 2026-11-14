/* ==========================================================================
   THE DIVINE ARCHIVES — the Virtual Museum: the Rotunda ring of statues

   The finished statues of the Rotunda Circle (docs/rotunda/, Tray 1: Socrates,
   Shiva, Isis) stand on pedestals in a ring under the planetarium dome. Each
   one is the same mesh as its statue page (docs/assets/rotunda/<id>.glb), shown
   with the museum's own lighting; tapping it opens a card that says plainly
   what is scanned and what was made here, and links to the page where it can be
   turned in 3D. Like those pages, the statues are recently added and pending
   full review.

   The meshes are heavy (about 3.8 MB together), so nothing is fetched until the
   visitor comes near the Rotunda, and each statue is drawn only when close.
   To keep every view of the Rotunda inside the museum's phone budget
   (plans/museum-visual-pass.md: at most 220k triangles per view), each statue
   is drawn at three levels of detail by its own distance to the visitor: the
   full mesh within NEAR metres; a middle copy of about 28k triangles from NEAR
   to FAR, where the statue still fills much of a phone screen and its face,
   hands and attributes must still read; and past FAR a far copy of about 8k.
   The copies are made in the browser from the same mesh by merging the points
   that fall in one small grid cell (vertex clustering, each merged point placed
   to keep the surfaces around it). They are the same statue seen from further
   off, not a different object; the full mesh is the one that comes back as the
   visitor walks up to it. A statue whose full mesh would push a close view past
   the budget (over NEAR_MAX triangles; in Tray 1 Shiva, 107k, and Socrates,
   132k) is drawn close up from a lightly thinned copy made the same way on a
   grid of a few millimetres, below what the eye can tell apart at arm's
   length; its statue page still turns the full mesh.
   GLTFLoader (three.js r160 example, MIT, docs/assets/rotunda/lib/) is loaded
   on demand; its one relative import is pointed at its sibling file, and its
   "three" import resolves through the museum's import map to the museum's own
   three.js, so there is one THREE in the page.
   ========================================================================== */
import * as THREE from "three";

const LIB = new URL("../assets/rotunda/lib/", import.meta.url);
const GLB = new URL("../assets/rotunda/", import.meta.url);

// the ring: slots between the theme bays (whose centres sit at 22.5° + k·45°), never on the north–south walkway
export const RING_R = 6.4;
export const STATUES = [
  { id: "shiva", name: "Shiva", angle: -Math.PI / 4,
    sub: "Dark bronze · India · the great god in meditation",
    made: "A real scan of the modern statue at Murudeshwar, Karnataka, by Boris3D Studio (CC BY 3.0). The dark bronze finish is ours.",
    lift: 0.0 },
  { id: "isis", name: "Isis", angle: -3 * Math.PI / 4,
    sub: "Black stone and gold · Egypt and Rome · the throne-bearer",
    made: "A modelled rendition built to the tradition, not a scan of an ancient statue. Her face follows a Roman bronze bust of Isis in the Mount Holyoke College Art Museum.",
    lift: 0.0 },
  { id: "socrates", name: "Socrates", angle: Math.PI,
    sub: "Marble · Athens · the philosopher",
    made: "The head is from a museum scan of the ancient portrait type. No likeness of his body survives, so the robed body was made for this statue.",
    lift: 0.0 }
];

export const PEDESTAL_H = 0.5;
// level of detail, by each statue's own distance to the visitor's eye: the near level within NEAR metres; a middle copy
// of about MID_TRIS triangles from NEAR to FAR, where the statue still fills much of a phone screen and its face, hands
// and attributes must still read; past FAR, a far copy of about FAR_TRIS triangles
export const NEAR = 3.2, FAR = 8;
const MID_TRIS = 28000, FAR_TRIS = 8000;
// the most any one statue may draw close up: the Rotunda's own walls and exhibits reach ~89k triangles in some views, and
// a neighbour can be on its middle copy at the same time, so a statue heavier than NEAR_MAX is thinned to about NEAR_THIN
// (never over NEAR_MAX)
const NEAR_MAX = 95000, NEAR_THIN = 90000;

let loaderP = null;
async function text(name) {
  const r = await fetch(new URL(name, LIB));
  if (!r.ok) throw new Error("could not load " + name);
  return r.text();
}
function moduleURL(src) { return URL.createObjectURL(new Blob([src], { type: "text/javascript" })); }
function gltfLoader() {
  if (!loaderP) loaderP = (async () => {
    const [bgu, gltf] = await Promise.all([text("BufferGeometryUtils.js"), text("GLTFLoader.js")]);
    const src = gltf.replace("'../utils/BufferGeometryUtils.js'", JSON.stringify(moduleURL(bgu)));
    const m = await import(moduleURL(src));
    return new m.GLTFLoader();
  })();
  return loaderP;
}

// the museum's own finishes for each statue (the pages light theirs with an environment map the museum does not have)
function finish(id) {
  if (id === "shiva") {
    const bronze = new THREE.MeshPhongMaterial({ color: "#4a3019", specular: "#9a7448", shininess: 34, emissive: "#0c0703" });
    return () => bronze;
  }
  if (id === "isis") {
    const stone = new THREE.MeshPhongMaterial({ color: "#1b1714", specular: "#4a4238", shininess: 22, emissive: "#050403" });
    const gold = new THREE.MeshPhongMaterial({ color: "#c9a04c", specular: "#fff0c0", shininess: 80, emissive: "#2a1a06" });
    return (o) => (o.material && o.material.name === "gold") || o.name === "gold" ? gold : stone;
  }
  // Socrates: white marble; the robed parts carry baked fold shading in their vertex colours; his own small plinth is darker stone
  const marble = new THREE.MeshLambertMaterial({ color: "#e9e2d4" });
  const marbleVC = new THREE.MeshLambertMaterial({ color: "#e9e2d4", vertexColors: true });
  const base = new THREE.MeshLambertMaterial({ color: "#35302a" });
  return (o) => o.name === "pedestal" ? base : o.name === "head" ? marble : (o.geometry.attributes.color ? marbleVC : marble);
}

// vertex clustering: snap every point to a grid of cell `c` (metres) and merge the points in one cell, dropping the
// triangles that collapse. One grid for the whole statue, so the parts still meet. Each merged point is put where it
// best keeps the surfaces around it (the point nearest to all their planes, weighted by area: Lindstrom's
// "out-of-core simplification"), not at the plain average, so edges and features stay sharp; if that point is
// ill-defined or strays from its cell, the average is used. Its normal is the average of the source normals (so the
// shading follows the scanned surface, not the coarse triangles), and a triangle that came out facing the wrong way
// is turned back, which is what left pinholes in the earlier copies.
function clusterGeometry(geo, c, o, keep) {
  const pos = geo.attributes.position, col = geo.attributes.color, nor = geo.attributes.normal, n = pos.count;
  const idx = geo.index ? geo.index.array : null, nt = (idx ? idx.length : n) / 3;
  const map = new Map(), of = new Int32Array(n), sum = [], csum = [], nsum = [], cnt = [];
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const k = Math.floor((x - o.x) / c) + 4096 * (Math.floor((y - o.y) / c) + 4096 * Math.floor((z - o.z) / c));
    let j = map.get(k);
    if (j === undefined) { j = cnt.length; map.set(k, j); cnt.push(0); sum.push(0, 0, 0); if (keep) { nsum.push(0, 0, 0); if (col) csum.push(0, 0, 0); } }
    of[i] = j; cnt[j]++; sum[3 * j] += x; sum[3 * j + 1] += y; sum[3 * j + 2] += z;
    if (keep) {
      if (nor) { nsum[3 * j] += nor.getX(i); nsum[3 * j + 1] += nor.getY(i); nsum[3 * j + 2] += nor.getZ(i); }
      if (col) { csum[3 * j] += col.getX(i); csum[3 * j + 1] += col.getY(i); csum[3 * j + 2] += col.getZ(i); }
    }
  }
  const seen = new Set(), tri = [], m = cnt.length;
  const Q = keep ? new Float64Array(9 * m) : null;          // per cell: the plane sums A (6, symmetric) and b (3)
  const vi = (t, q) => idx ? idx[3 * t + q] : 3 * t + q;
  for (let t = 0; t < nt; t++) {
    const i0 = vi(t, 0), i1 = vi(t, 1), i2 = vi(t, 2), a = of[i0], b = of[i1], d = of[i2];
    if (keep) {
      // the source triangle's plane (unit normal u, offset w) weighted by its area, added to each of its three cells
      const ax = pos.getX(i0), ay = pos.getY(i0), az = pos.getZ(i0);
      const ux0 = pos.getX(i1) - ax, uy0 = pos.getY(i1) - ay, uz0 = pos.getZ(i1) - az;
      const vx0 = pos.getX(i2) - ax, vy0 = pos.getY(i2) - ay, vz0 = pos.getZ(i2) - az;
      let nx = uy0 * vz0 - uz0 * vy0, ny = uz0 * vx0 - ux0 * vz0, nz = ux0 * vy0 - uy0 * vx0;
      const l = Math.hypot(nx, ny, nz);
      if (l > 0) {
        const wA = l / 2; nx /= l; ny /= l; nz /= l; const w = -(nx * ax + ny * ay + nz * az);
        for (const j of [a, b, d]) {
          const q = 9 * j;
          Q[q] += wA * nx * nx; Q[q + 1] += wA * nx * ny; Q[q + 2] += wA * nx * nz; Q[q + 3] += wA * ny * ny; Q[q + 4] += wA * ny * nz;
          Q[q + 5] += wA * nz * nz; Q[q + 6] += wA * nx * w; Q[q + 7] += wA * ny * w; Q[q + 8] += wA * nz * w;
        }
      }
    }
    if (a === b || b === d || a === d) continue;
    const lo = Math.min(a, b, d), hi = Math.max(a, b, d), key = (lo * m + (a + b + d - lo - hi)) * m + hi;   // exact below 2^53 for any statue
    if (seen.has(key)) continue;
    seen.add(key); tri.push(a, b, d);
  }
  if (!keep) return tri.length / 3;                       // only counting, while the cell size is chosen
  const P = new Float32Array(3 * m);
  for (let j = 0; j < m; j++) {
    const mx = sum[3 * j] / cnt[j], my = sum[3 * j + 1] / cnt[j], mz = sum[3 * j + 2] / cnt[j];
    P[3 * j] = mx; P[3 * j + 1] = my; P[3 * j + 2] = mz;
    // solve A·p = −b about the average (Cramer's rule); keep the average if A is near-singular (a flat or thin patch)
    const q = 9 * j, a00 = Q[q], a01 = Q[q + 1], a02 = Q[q + 2], a11 = Q[q + 3], a12 = Q[q + 4], a22 = Q[q + 5];
    const r0 = -(Q[q + 6] + a00 * mx + a01 * my + a02 * mz), r1 = -(Q[q + 7] + a01 * mx + a11 * my + a12 * mz), r2 = -(Q[q + 8] + a02 * mx + a12 * my + a22 * mz);
    const c00 = a11 * a22 - a12 * a12, c01 = a02 * a12 - a01 * a22, c02 = a01 * a12 - a02 * a11;
    const det = a00 * c00 + a01 * c01 + a02 * c02, tr = a00 + a11 + a22;
    if (!(tr > 0) || Math.abs(det) < 1e-3 * tr * tr * tr) continue;
    const dx = (r0 * c00 + r1 * c01 + r2 * c02) / det;
    const dy = (r0 * c01 + r1 * (a00 * a22 - a02 * a02) + r2 * (a01 * a02 - a00 * a12)) / det;
    const dz = (r0 * c02 + r1 * (a01 * a02 - a00 * a12) + r2 * (a00 * a11 - a01 * a01)) / det;
    if (Math.abs(dx) > c || Math.abs(dy) > c || Math.abs(dz) > c) continue;   // strayed from its cell: keep the average
    P[3 * j] = mx + dx; P[3 * j + 1] = my + dy; P[3 * j + 2] = mz + dz;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.BufferAttribute(P, 3));
  if (col) { const C = new Float32Array(3 * m); for (let j = 0; j < m; j++) for (let q = 0; q < 3; q++) C[3 * j + q] = csum[3 * j + q] / cnt[j]; out.setAttribute("color", new THREE.BufferAttribute(C, 3)); }
  if (nor) {
    // turn back any triangle whose winding now disagrees with the surface it stands for
    for (let t = 0; t < tri.length; t += 3) {
      const a = tri[t], b = tri[t + 1], d = tri[t + 2];
      const ux = P[3 * b] - P[3 * a], uy = P[3 * b + 1] - P[3 * a + 1], uz = P[3 * b + 2] - P[3 * a + 2];
      const vx = P[3 * d] - P[3 * a], vy = P[3 * d + 1] - P[3 * a + 1], vz = P[3 * d + 2] - P[3 * a + 2];
      const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx;
      const sx = nsum[3 * a] + nsum[3 * b] + nsum[3 * d], sy = nsum[3 * a + 1] + nsum[3 * b + 1] + nsum[3 * d + 1], sz = nsum[3 * a + 2] + nsum[3 * b + 2] + nsum[3 * d + 2];
      if (fx * sx + fy * sy + fz * sz < 0) { tri[t + 1] = d; tri[t + 2] = b; }
    }
  }
  out.setIndex(m > 65535 ? new THREE.Uint32BufferAttribute(tri, 1) : new THREE.Uint16BufferAttribute(tri, 1));
  out.computeVertexNormals();
  if (nor) {
    // shade by the source normals where they agree (a thin part folded into one cell can cancel out: keep the computed one there)
    const N = out.attributes.normal;
    for (let j = 0; j < m; j++) {
      const x = nsum[3 * j], y = nsum[3 * j + 1], z = nsum[3 * j + 2], l = Math.hypot(x, y, z);
      if (l > 0.35 * cnt[j]) N.setXYZ(j, x / l, y / l, z / l);
    }
  }
  return out;
}
function triCount(geo) { return Math.round((geo.index ? geo.index.count : geo.attributes.position.count) / 3); }

// a lighter copy of a loaded statue (the middle or far copy, or a thinned near copy): the same nodes and materials, each mesh's geometry clustered on one shared grid whose
// cell is chosen (a few counting passes; triangles fall roughly as 1/cell²) to come near `target` for the whole statue
function farCopy(scene, target, max) {
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(scene), size = box.getSize(new THREE.Vector3());
  const meshes = []; scene.traverse((o) => { if (o.isMesh) meshes.push(o); });
  // each mesh is clustered in its own coordinates; its grid is the statue's grid carried into them (uniform scale assumed)
  const local = meshes.map((o) => {
    const inv = o.matrixWorld.clone().invert(), s = new THREE.Vector3().setFromMatrixScale(o.matrixWorld).x || 1;
    return { o, origin: box.min.clone().applyMatrix4(inv), s };
  });
  let c = Math.max(size.x, size.y, size.z) / 60;
  for (let k = 0; k < 4; k++) {
    const t = local.reduce((a, L) => a + clusterGeometry(L.o.geometry, c / L.s, L.origin, false), 0);
    if (Math.abs(t - target) < target * 0.15 || t === 0) break;
    c *= Math.sqrt(t / target);
  }
  const count = (cc) => local.reduce((a, L) => a + clusterGeometry(L.o.geometry, cc / L.s, L.origin, false), 0);
  if (max) {
    // a near copy has a hard ceiling: halve the interval between a cell that is too fine and one that is fine enough
    // (counts are not smooth this close to the full mesh, so the 1/cell² guess alone can land far under the target)
    let fine = c / 4, coarse = c * 1.5;
    if (count(coarse) > max) coarse *= 4;
    for (let k = 0; k < 5; k++) { const mid = Math.sqrt(fine * coarse); if (count(mid) > max) fine = mid; else coarse = mid; }
    c = coarse;
  } else {
    // a middle or far copy: a few more passes only if it still came out more than 15% over the target
    for (let k = 0; k < 4; k++) { const t = count(c); if (t <= target * 1.15) break; c *= 1.05 * Math.sqrt(t / target); }
  }
  const far = scene.clone(true), farMeshes = []; far.traverse((o) => { if (o.isMesh) farMeshes.push(o); });
  farMeshes.forEach((o, i) => { o.geometry = clusterGeometry(local[i].o.geometry, c / local[i].s, local[i].origin, true); });
  return far;
}

// load one statue's mesh into `holder` (a group standing on the pedestal top) at three levels of detail (near, middle,
// far); resolves with the triangle counts of the mesh and of each level
export async function loadStatue(st, holder) {
  const loader = await gltfLoader();
  const r = await fetch(new URL(st.id + ".glb", GLB));
  if (!r.ok) throw new Error("could not load the " + st.name + " statue");
  const buf = await r.arrayBuffer();
  const gltf = await new Promise((res, rej) => loader.parse(buf, "", res, rej));
  const pick = finish(st.id), meshes = [];
  gltf.scene.traverse((o) => { if (o.isMesh) meshes.push(o); });
  let tris = 0;
  for (const o of meshes) {
    if (st.id === "socrates") o.geometry.computeVertexNormals();
    o.material = pick(o);
    tris += triCount(o.geometry);
  }
  gltf.scene.position.y = st.lift;
  // each copy is made in its own task, so the page can draw frames between them while the visitor walks in
  const pause = () => new Promise((r) => setTimeout(r, 0));
  await pause();
  const near = tris > NEAR_MAX ? farCopy(gltf.scene, NEAR_THIN, NEAR_MAX) : gltf.scene;
  let nearTris = tris; if (near !== gltf.scene) { nearTris = 0; near.traverse((o) => { if (o.isMesh) nearTris += triCount(o.geometry); }); }
  await pause(); const mid = farCopy(gltf.scene, MID_TRIS);
  await pause(); const far = farCopy(gltf.scene, FAR_TRIS);
  const count = (g) => { let t = 0; g.traverse((o) => { if (o.isMesh) t += triCount(o.geometry); }); return t; };
  // THREE.LOD picks the level by this statue's own distance to the camera, every frame the renderer draws it
  const lod = new THREE.LOD();
  lod.addLevel(near, 0);
  lod.addLevel(mid, NEAR);
  lod.addLevel(far, FAR);
  holder.add(lod);
  return { tris, nearTris, midTris: count(mid), farTris: count(far) };
}
