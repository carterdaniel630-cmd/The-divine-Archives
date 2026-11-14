/* III · Enclosure C: three concentric ring walls (a possible fourth is not shown), pillars set in the inner
   ring, and the two central pillars, found broken, on pedestals cut from the bedrock floor. Boars dominate the
   carving here. Positions APPROX (layout.js); carvings our own renderings (pillars.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { pillarsC } from "./layout.js?v=1";
import { tpillar, ringWall, bench, relief, facePos, boar, fox, snakes, drystone } from "./pillars.js?v=1";
import { Bucket } from "../../kit.js?v=1";
import { markers, finish } from "../../parts.js?v=1";
import { rubble } from "../../cave.js?v=1";

export function build(ctx) {
  const E = D.encC;
  const wallM = drystone();
  const pillarM = ctx.mat("block", { color: new THREE.Color("#ece2cd") });
  const bedrock = ctx.mat("rock", { color: new THREE.Color("#e8dfcc") });
  const W = new Bucket(), Pl = new Bucket(), F = new Bucket(), Rb = new Bucket();
  E.rings.forEach((r, i) => ringWall(W, "w", { cx: E.x, cz: E.z, r, t: E.wallT, h: E.wallH - i * 0.35, gaps: [[168, 192]], seed: 31 + i, ragged: true, n: 48 + i * 16 }));
  bench(W, "w", { cx: E.x, cz: E.z, r: E.rings[0], d: 0.45, h: 0.45, gaps: [[168, 192]], n: 48 });
  // the bedrock floor of the inner ring, smoothed, with the two pedestals left standing for the central pillars
  const n = 40;
  for (let i = 0; i < n; i++) {
    const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2, r = E.rings[0] - 0.3;
    F.tri("f", new THREE.Vector3(E.x, 0.02, E.z), new THREE.Vector3(E.x + Math.sin(a1) * r, 0.02, E.z - Math.cos(a1) * r), new THREE.Vector3(E.x + Math.sin(a0) * r, 0.02, E.z - Math.cos(a0) * r));
  }
  const pc = pillarsC();
  for (const p of pc.central) {
    const ped = new THREE.BoxGeometry(p.t + 0.7, 0.35, p.L + 0.8); ped.translate(p.x, 0.175, p.z); F.geo("f", ped);
    tpillar(Pl, "p", Object.assign({}, p, { y: 0.35, seed: 70 + Math.round(p.x) }));
    rubble(Rb, "r", p.x + 0.4, p.z + 1.6, 0, 0.7, 6, 71 + Math.round(p.x));   // broken pieces at the foot
  }
  for (const p of pc.ring) tpillar(Pl, "p", Object.assign({ seed: 90 + Math.round((p.x + 30) * 11 + p.z * 5) }, p));
  // rubble between the rings, where the walls have slumped
  rubble(Rb, "r", E.x - 8, E.z - 6, 0, 1.6, 10, 72); rubble(Rb, "r", E.x + 9, E.z + 3, 0, 1.4, 9, 73); rubble(Rb, "r", E.x - 3, E.z + 11, 0, 1.2, 8, 74);
  finish(ctx, F, { f: bedrock }, ["f"]);
  finish(ctx, W, { w: wallM }, []);
  finish(ctx, Pl, { p: pillarM }, []);
  finish(ctx, Rb, { r: wallM }, []);
  // boars on most of the inner-ring pillars, a fox and snakes on two (illustrative)
  const motifs = [boar, boar, fox, boar, snakes(2), boar, boar, boar, fox];
  pc.ring.forEach((p, i) => { if (i % 4 !== 3) relief(ctx, motifs[i % motifs.length], Object.assign({ w: p.L * 0.9, h: 0.9 }, facePos(p, i % 2 ? "left" : "right", D.ring.h - D.ring.headH - 0.8))); });
  markers(ctx, site, "s3");
}
