/* III · The great Buddha: inside the nine-storey building and Cave 96 behind it. The ground floor of the
   building, the floors of its upper storeys over the front bay only, so that from the ground you look up the
   whole height of the statue, and the seated Maitreya with both legs hanging down, at the published height of
   35.5 m (our own simplified figure, not a copy). Every other size APPROX (dims.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { box, oquad, pendant, plasterMat } from "./paint.js?v=1";
import { Bucket, V, room } from "../../kit.js?v=1";
import { markers, sign, lamp, finish } from "../../parts.js?v=1";

const C96 = D.c96, P96 = D.pav, PI = Math.PI;

export function build(ctx) {
  const floorM = ctx.mat("floor", { color: new THREE.Color("#8a7a65") });
  const caveM = plasterMat("#b7a07c"), ceilM = plasterMat("#9d8865");
  const woodM = ctx.mat("wood", { color: new THREE.Color("#6a3a26") });
  const B = new Bucket(), F = new Bucket(), S = new Bucket();

  // ---- the floor of the building and the cave
  oquad(F, "f", V(C96.x0, 0, C96.z0), V(P96.x1, 0, C96.z0), V(P96.x1, 0, C96.z1), V(C96.x0, 0, C96.z1), V(0, 1, 0));
  oquad(F, "f", V(P96.x0, 0, P96.z0), V(P96.x1, 0, P96.z0), V(P96.x1, 0, C96.z0), V(P96.x0, 0, C96.z0), V(0, 1, 0));
  oquad(F, "f", V(P96.x0, 0, C96.z1), V(P96.x1, 0, C96.z1), V(P96.x1, 0, P96.z1), V(P96.x0, 0, P96.z1), V(0, 1, 0));
  // ---- the cave: three walls and a flat ceiling cut in the rock, open to the building on the east
  room(B, { floor: "cw", wall: "cw", ceil: "ce" }, C96.x0, C96.x1, C96.z0, C96.z1, 0, C96.h,
    { e: [{ u0: 0, u1: C96.z1 - C96.z0, v0: 0, v1: C96.h }] }, { noFloor: true });
  // the cliff's thickness between the building and the cave, either side of the opening
  for (const z of [C96.z0, C96.z1]) oquad(B, "cw", V(C96.x1, 0, z), V(P96.x0 + 0.01, 0, z), V(P96.x0 + 0.01, C96.h, z), V(C96.x1, C96.h, z), V(0, 0, z < 0 ? 1 : -1));
  // the back of the building against the cliff, either side of the cave mouth, and the cliff above it
  oquad(B, "cw", V(0.02, 0, P96.z0), V(0.02, 0, C96.z0), V(0.02, P96.h, C96.z0), V(0.02, P96.h, P96.z0), V(1, 0, 0));
  oquad(B, "cw", V(0.02, 0, C96.z1), V(0.02, 0, P96.z1), V(0.02, P96.h, P96.z1), V(0.02, P96.h, C96.z1), V(1, 0, 0));
  oquad(B, "cw", V(0.02, C96.h, C96.z0), V(0.02, C96.h, C96.z1), V(0.02, P96.h, C96.z1), V(0.02, P96.h, C96.z0), V(1, 0, 0));
  // ---- the upper floors of the building: wooden floors over the front bay, a rail at each edge
  const sh = P96.h / P96.storeys, xe = 7.5;
  for (let k = 1; k < P96.storeys; k++) {
    const y = k * sh, xf = P96.x1 - (k - 1) * 0.35 - 0.1, zi = (k - 1) * 0.25;
    box(B, "w", xe, xf, y - 0.3, y, P96.z0 + zi + 0.1, P96.z1 - zi - 0.1);
    box(B, "w", xe, xe + 0.12, y, y + 1.0, P96.z0 + zi + 0.1, P96.z1 - zi - 0.1);
  }
  // the lit ceiling of the building over the statue's head
  oquad(B, "ce", V(P96.x0, P96.h - 0.3, P96.z0), V(P96.x1, P96.h - 0.3, P96.z0), V(P96.x1, P96.h - 0.3, P96.z1), V(P96.x0, P96.h - 0.3, P96.z1), V(0, -1, 0));
  // red posts holding up the floors, along the line of their edge
  for (const z of [-9, -3, 3, 9]) box(B, "w", xe - 0.25, xe + 0.25, 0, P96.h - 0.3, z - 0.25, z + 0.25);

  // ---- the statue: Maitreya seated with both legs down, facing east, painted
  pendant(S, { robe: "ro", skin: "sk", robe2: "th", hair: "hr" }, C96.statueX, 0, 0, C96.buddhaH, PI / 2);
  // a large halo painted on the cave wall behind the head, and a mandorla behind the body
  const halo = new THREE.Mesh(new THREE.CircleGeometry(6.5, 40), new THREE.MeshStandardMaterial({ color: "#4f6f62", roughness: 0.9 }));
  halo.position.set(C96.x0 + 0.05, C96.buddhaH * 0.89, 0); halo.rotation.y = PI / 2; ctx.group.add(halo);
  const ring = new THREE.Mesh(new THREE.RingGeometry(6.5, 7.6, 40), new THREE.MeshStandardMaterial({ color: "#a2562f", roughness: 0.9 }));
  ring.position.set(C96.x0 + 0.06, C96.buddhaH * 0.89, 0); ring.rotation.y = PI / 2; ctx.group.add(ring);

  finish(ctx, F, { f: floorM }, ["f"]);
  finish(ctx, B, { cw: caveM, ce: ceilM, w: woodM }, []);
  finish(ctx, S, {
    ro: new THREE.MeshStandardMaterial({ color: "#a8442e", roughness: 0.8 }),
    sk: new THREE.MeshStandardMaterial({ color: "#d4ad78", roughness: 0.75 }),
    th: ctx.mat("rock", { color: new THREE.Color("#8d7a5e") }),
    hr: new THREE.MeshStandardMaterial({ color: "#2f3f5a", roughness: 0.8 })
  }, []);
  sign(ctx, ["The Northern Great Image", "Maitreya · begun 695 · 35.5 m"], xe + 0.3, 3.1, -6.2, PI / 2, 2.4, 0.56, { size: 56 });
  lamp(ctx, 3.0, 4.2, -4.6, 1.0);
  lamp(ctx, xe + 0.3, sh * 4, -6, 1.0);
  lamp(ctx, xe + 0.3, sh * 7, 6, 1.0);
  markers(ctx, site, "s3");
}
