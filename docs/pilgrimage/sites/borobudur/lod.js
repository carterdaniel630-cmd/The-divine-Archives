/* Borobudur: a portal that is only drawn within 50 m. The site is one open box, so without this every golden
   portal (about a dozen meshes each) would be drawn from anywhere on the way, far beyond the phone budget. */
import * as THREE from "three";

export function nearPortal(ctx, o, x, y, z, yaw) {
  const fx = ctx.portal(o, x, y, z, yaw);
  const lod = new THREE.LOD(); ctx.group.remove(fx.group);
  lod.position.copy(fx.group.position); fx.group.position.set(0, 0, 0);
  lod.addLevel(fx.group, 0); lod.addLevel(new THREE.Object3D(), 50);
  ctx.group.add(lod); return fx;
}
