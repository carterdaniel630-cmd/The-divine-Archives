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

// load one statue's mesh into `holder` (a group standing on the pedestal top); resolves with its triangle count
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
    tris += Math.round((o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3);
  }
  gltf.scene.position.y = st.lift;
  holder.add(gltf.scene);
  return tris;
}
