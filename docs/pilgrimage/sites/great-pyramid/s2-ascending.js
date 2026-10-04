/* II · The robbers' tunnel round the granite plugs, and the ascending passage. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, passage, V } from "../../kit.js?v=1";
import { markers, lamp, rail, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const M = { rock: ctx.mat("rock"), lime: ctx.mat("limestone"), floor: ctx.mat("floor"), granite: ctx.mat("granite"), wood: ctx.mat("wood") };
  const B = new Bucket(), F = new Bucket();
  const pw2 = D.pw / 2, TH = 1.9;

  // ---- the robbers' tunnel: an east–west spur off the descending passage, a north–south climb, a spur into the ascending passage
  const xa = D.rtX - 0.6, xb = D.rtX + 0.6, za = D.rtZ0 - 0.8, zb = D.rtZ0 + 0.8, zc = D.rtZ1 - 0.8, zd = D.rtZ1 + 0.8;
  const y2 = (z) => D.rtY0 + (D.ascFloor(zd) - D.rtY0) * (z - za) / (zd - za);   // the climb's floor
  const y1 = () => D.rtY0, y3 = (z) => D.ascFloor(z);
  // floors
  F.quad("rock", V(xa, y2(zd), zd), V(xb, y2(zd), zd), V(xb, y2(za), za), V(xa, y2(za), za));
  F.quad("rock", V(xb, y1(), zb), V(-pw2, y1(), zb), V(-pw2, y1(), za), V(xb, y1(), za));
  F.quad("rock", V(xb, y3(zd), zd), V(-pw2, y3(zd), zd), V(-pw2, y3(zc), zc), V(xb, y3(zc), zc));
  // ceilings (floor + TH)
  B.quad("rock", V(xa, y2(za) + TH, za), V(xb, y2(za) + TH, za), V(xb, y2(zd) + TH, zd), V(xa, y2(zd) + TH, zd));
  B.quad("rock", V(xb, y1() + TH, za), V(-pw2, y1() + TH, za), V(-pw2, y1() + TH, zb), V(xb, y1() + TH, zb));
  B.quad("rock", V(xb, y3(zc) + TH, zc), V(-pw2, y3(zc) + TH, zc), V(-pw2, y3(zd) + TH, zd), V(xb, y3(zd) + TH, zd));
  const vwall = (x0, z0, yb0, x1, z1, yb1) => B.quad("rock", V(x0, yb0, z0), V(x1, yb1, z1), V(x1, yb1 + TH, z1), V(x0, yb0 + TH, z0));
  vwall(xa, zd, y2(zd), xa, za, y2(za));                 // west wall of the climb
  vwall(xb, zb, y2(zb), xb, zc, y2(zc));                 // east wall of the climb, between the spurs
  vwall(xa, za, y2(za), -pw2, za, y1());                 // north wall of the lower spur
  vwall(-pw2, zb, y1(), xb, zb, y1());                   // south wall of the lower spur
  vwall(xb, zc, y3(zc), -pw2, zc, y3(zc));               // north wall of the upper spur
  vwall(-pw2, zd, y3(zd), xa, zd, y2(zd));               // south wall of the upper spur
  // where the tunnel breaks into each passage, fill between the passage's roof and the tunnel's taller ceiling
  const fill = (zA, zB, pFloor, hv, tFloor) => {
    B.quad("rock", V(-pw2, pFloor(zA) + hv, zA), V(-pw2, pFloor(zB) + hv, zB), V(-pw2, tFloor(zB) + TH, zB), V(-pw2, tFloor(zA) + TH, zA));
  };
  fill(zb, za, D.descFloor, D.descHv, y1);
  fill(zd, zc, D.ascFloor, D.ascHv, y3);
  // a glimmer of daylight far off, where the tunnel comes in from the face today (not modelled further)
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.4), new THREE.MeshBasicMaterial({ color: "#5a4630" }));
  glow.position.set(D.rtX, y2(za) + 0.8, za + 0.02); ctx.group.add(glow);

  // ---- the ascending passage, its lowest 4.6 m still filled by three granite plugs
  passage(F, { floor: "pfloor" }, 0, D.ascZ0, D.ascY0, D.ascRun, D.ascRise, D.pw, D.ph, { roof: [[0, D.ascRun]], left: [[0, D.ascRun]], right: [[0, D.ascRun]] }, { floorUV: "slopeFloor" });
  passage(B, { wall: "lime", ceil: "lime", floor: "x" }, 0, D.ascZ0, D.ascY0, D.ascRun, D.ascRise, D.pw, D.ph,
    { floor: [[0, D.ascRun]], left: [[zc - D.ascZ0, zd - D.ascZ0]] });
  const plug = new THREE.BoxGeometry(D.pw - 0.02, D.ph - 0.02, D.plugLen / 3 - 0.03);
  for (let i = 0; i < 3; i++) {
    const g = plug.clone(), sAlong = (i + 0.5) * D.plugLen / 3, z = D.ascZ0 + sAlong * Math.cos(D.ascAng);
    const yc = D.ascFloor(z) + (D.ph / 2) / Math.cos(D.ascAng);   // centre sits half the passage height (square to the floor) above it
    g.rotateX(-D.ascAng); g.translate(0, yc + 0.01, z);
    B.geo("granite", g);
  }
  // modern boards and rails, and lamps
  const top = D.ggZ0 - 0.2, bot = D.ascZ0 + D.plugRun + 0.2, by = (z) => D.ascFloor(z) + 0.03;
  F.quad("wood", V(-0.42, by(top), top), V(0.42, by(top), top), V(0.42, by(bot), bot), V(-0.42, by(bot), bot), "slopeFloor");
  rail(ctx, -pw2 + 0.06, bot + 0.3, top, D.ascFloor, 0.62);
  rail(ctx, pw2 - 0.06, bot + 0.3, top, D.ascFloor, 0.62);
  for (const z of [-68, -59, -50]) lamp(ctx, pw2 - 0.04, D.ascFloor(z) + 0.95, z, 0.55, -1, 0);
  lamp(ctx, xb - 0.05, D.rtY0 + 1.4, (zb + zc) / 2, 0.5, -1, 0);

  finish(ctx, F, { rock: M.rock, pfloor: M.floor, wood: M.wood }, ["rock", "pfloor", "wood"]);
  finish(ctx, B, { rock: M.rock, lime: M.lime, granite: M.granite }, []);
  markers(ctx, site, "s2");
}
