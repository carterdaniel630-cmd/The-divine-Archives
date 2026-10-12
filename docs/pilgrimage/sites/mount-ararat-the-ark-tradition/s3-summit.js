/* III · The summit of Greater Ararat: a true-size dome of snow and ice to stand on, with the rest of the
   mountain, Lesser Ararat and the plains below as a scale model (massif.js). */
import * as THREE from "three";
import site, { P3 } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { markers, sign } from "../../parts.js?v=1";
import { massif } from "./massif.js?v=1";

export function build(ctx) {
  // the backdrop: the mountain below you, sunk a little so the true-size dome sits on it
  massif(ctx, D.greater, { x: P3.x, y: -0.6, z: P3.z }, { cx: 2, cz: 4, drop: 0.08 });
  // the summit dome: a low cap of snow, wind-rippled
  const g = new THREE.CircleGeometry(D.summit.r, 48, 0, Math.PI * 2); g.rotateX(-Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), d = Math.hypot(x, z) / D.summit.r; p.setY(i, -D.summit.drop * Math.pow(d, 2.4) + 0.06 * Math.sin(x * 1.3 + z * 0.7) * Math.sin(z * 1.9)); }
  g.computeVertexNormals(); g.translate(P3.x, 0, P3.z);
  const snow = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: "#f6f8fc", roughness: 0.8 }));
  snow.userData.floor = true; ctx.group.add(snow);
  sign(ctx, ["Greater Ararat", "5,137 m"], P3.x - 2, 1.4, P3.z - 4, 0, 1.8, 0.5, { size: 60 });
  ctx.portal({ w: 1.6, h: 2.4, tint: "#ffe2b0" }, P3.x, -0.3, P3.z + 7, Math.PI);
  sign(ctx, ["Back to the plain", "below Ararat"], P3.x, 2.7, P3.z + 7.1, Math.PI, 2.0, 0.48, { size: 54 });
  markers(ctx, site, "s3");
}
