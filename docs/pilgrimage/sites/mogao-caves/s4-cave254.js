/* IV · Cave 254: a cave of the Northern Wei on the middle tier. The front part under a gabled ceiling painted
   as rafters, the back part under a flat ceiling with a square pillar joining floor and ceiling; a great niche
   on the pillar's east face with Maitreya, smaller niches on the other faces; walls of small seated Buddhas with
   the story of the prince and the tigress on the south wall, King Sibi on the north and a white-robed Buddha on
   the west. Form and subjects published (e-Dunhuang); sizes APPROX; figures and paintings our own (paint.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { box, oquad, panel, seated, thousandMat, plasterMat, raftersMat, storyMural } from "./paint.js?v=1";
import { Bucket, V, wall } from "../../kit.js?v=1";
import { markers, sign, lamp, finish } from "../../parts.js?v=1";

const C = D.c254, PI = Math.PI;

export function build(ctx) {
  const y = C.y, eave = C.h - 1.3, zc = C.pillar.z, PL = C.pillar;
  const floorM = ctx.mat("floor", { color: new THREE.Color("#8e7b62") });
  const B = new Bucket(), F = new Bucket(), S = new Bucket();

  // ---- floor, the passage through the rock from the walkway, and the walls
  oquad(F, "f", V(C.x0, y, C.z0), V(0.4, y, C.z0), V(0.4, y, C.z1), V(C.x0, y, C.z1), V(0, 1, 0));
  for (const z of [zc - 0.9, zc + 0.9]) oquad(S, "rk", V(C.x1, y, z), V(0, y, z), V(0, y + 2.4, z), V(C.x1, y + 2.4, z), V(0, 0, z < zc ? 1 : -1));
  oquad(S, "rk", V(C.x1, y + 2.4, zc - 0.9), V(0, y + 2.4, zc - 0.9), V(0, y + 2.4, zc + 0.9), V(C.x1, y + 2.4, zc + 0.9), V(0, -1, 0));
  wall(B, "tw", C.x0, C.z0, C.x1, C.z0, y, eave);                     // north wall
  wall(B, "tw", C.x1, C.z1, C.x0, C.z1, y, eave);                     // south wall
  wall(B, "tw", C.x0, C.z1, C.x0, C.z0, y, eave);                     // west wall
  wall(B, "tw", C.x1, C.z0, C.x1, C.z1, y, eave, [{ u0: zc - 0.9 - C.z0, u1: zc + 0.9 - C.z0, v0: 0, v1: 2.4 }]);   // east wall, the door
  // the gable over the front part: the east wall's triangle, the two slopes painted as rafters, and the
  // triangle where the gable meets the flat ceiling of the back part
  const ridge = y + C.h, ey = y + eave;
  for (const x of [C.x1, C.gableTo]) B.tri("pw", V(x, ey, C.z0), V(x, ridge, zc), V(x, ey, C.z1));
  oquad(B, "rf", V(C.gableTo, ey, C.z0), V(C.x1, ey, C.z0), V(C.x1, ridge, zc), V(C.gableTo, ridge, zc), V(0, -1, 1));
  oquad(B, "rf", V(C.gableTo, ey, C.z1), V(C.x1, ey, C.z1), V(C.x1, ridge, zc), V(C.gableTo, ridge, zc), V(0, -1, -1));
  box(B, "bm", C.gableTo, C.x1, ridge - 0.2, ridge, zc - 0.12, zc + 0.12);              // the ridge beam
  oquad(B, "pw", V(C.x0, ey, C.z0), V(C.gableTo, ey, C.z0), V(C.gableTo, ey, C.z1), V(C.x0, ey, C.z1), V(0, -1, 0));
  // a painted lattice on the flat ceiling of the back part (its panels with lotus centres are not copied)
  for (let x = C.x0 + 1.2; x < C.gableTo; x += 1.6) box(B, "bm", x - 0.05, x + 0.05, ey - 0.06, ey, C.z0, C.z1);
  for (let z = C.z0 + 1.5; z < C.z1; z += 1.5) box(B, "bm", C.x0, C.gableTo, ey - 0.06, ey, z - 0.05, z + 0.05);

  // ---- the central pillar: a great niche on the east face, smaller niches on the others
  const px0 = PL.x - PL.s / 2, px1 = PL.x + PL.s / 2, pz0 = zc - PL.s / 2, pz1 = zc + PL.s / 2, nd = 0.55;
  box(B, "pc", px0 + nd, px1 - nd, y, ey, pz0 + nd, pz1 - nd);                           // the core
  const face = (side) => {                                                               // one face with its niche
    const big = side === "e", nw = big ? 0.85 : 0.5, n0 = big ? 0.75 : 1.3, n1 = big ? 3.2 : 2.5;
    const lo = side === "e" ? [px1 - nd, px1] : side === "w" ? [px0, px0 + nd] : null;
    const la = side === "n" ? [pz0, pz0 + nd] : side === "s" ? [pz1 - nd, pz1] : null;
    if (lo) {
      box(B, "pc", lo[0], lo[1], y, ey, pz0, zc - nw); box(B, "pc", lo[0], lo[1], y, ey, zc + nw, pz1);
      box(B, "pc", lo[0], lo[1], y, y + n0, zc - nw, zc + nw); box(B, "pc", lo[0], lo[1], y + n1, ey, zc - nw, zc + nw);
    } else {
      box(B, "pc", px0 + nd, PL.x - nw, y, ey, la[0], la[1]); box(B, "pc", PL.x + nw, px1 - nd, y, ey, la[0], la[1]);
      box(B, "pc", PL.x - nw, PL.x + nw, y, y + n0, la[0], la[1]); box(B, "pc", PL.x - nw, PL.x + nw, y + n1, ey, la[0], la[1]);
    }
    return { n0, n1 };
  };
  for (const s of ["n", "s", "w"]) face(s);
  // corner posts so the core's corners are closed
  for (const [x, z] of [[px0, pz0], [px1 - nd, pz0], [px0, pz1 - nd], [px1 - nd, pz1 - nd]]) box(B, "pc", x, x + nd, y, ey, z, z + nd);
  const e = face("e");
  // Maitreya in the great niche (our simplified seated figure)
  seated(S, { robe: "ro", skin: "sk", robe2: "pd" }, px1 - nd - 0.05, y + e.n0, zc, 2.1, PI / 2);
  // seated Buddhas in the smaller niches
  seated(S, { robe: "r2", skin: "sk", robe2: "pd" }, PL.x, y + 1.3, pz0 + 0.25, 1.05, PI, { buddha: true });
  seated(S, { robe: "ro", skin: "sk", robe2: "pd" }, PL.x, y + 1.3, pz1 - 0.25, 1.05, 0, { buddha: true });
  seated(S, { robe: "r2", skin: "sk", robe2: "pd" }, px0 + 0.25, y + 1.3, zc, 1.05, -PI / 2, { buddha: true });

  // ---- the paintings: the story panels in the walls of small Buddhas
  const pw = 3.4, ph = 1.7, py = y + 1.0 + ph / 2, px = (C.x0 + C.gableTo) / 2 + 0.6;
  panel(ctx, storyMural("tigress"), pw, ph, px, py, C.z1 - 0.03, 0);
  panel(ctx, storyMural("sibi"), pw, ph, px, py, C.z0 + 0.03, PI);
  panel(ctx, storyMural("white"), 2.2, 2.4, C.x0 + 0.03, y + 0.8 + 1.2, zc, PI / 2);

  finish(ctx, F, { f: floorM }, ["f"]);
  finish(ctx, B, { tw: thousandMat(false), pw: plasterMat("#c6ae86"), rf: raftersMat(), bm: new THREE.MeshStandardMaterial({ color: "#7a3b28", roughness: 0.9 }), pc: plasterMat("#bfa47c") }, []);
  finish(ctx, S, {
    rk: ctx.mat("rock", { color: new THREE.Color("#9d8667") }),
    ro: new THREE.MeshStandardMaterial({ color: "#8a3a2a", roughness: 0.85 }), r2: new THREE.MeshStandardMaterial({ color: "#3f6b5c", roughness: 0.85 }),
    sk: new THREE.MeshStandardMaterial({ color: "#b98f68", roughness: 0.8 }), pd: ctx.mat("rock", { color: new THREE.Color("#a28d6c") })
  }, []);
  lamp(ctx, C.x1 - 0.5, y + 3.4, zc + 2.6, 0.9);
  lamp(ctx, C.x0 + 1.2, y + 3.3, C.z1 - 1.0, 0.8);
  markers(ctx, site, "s4");
}
