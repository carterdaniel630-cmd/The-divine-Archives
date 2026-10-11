/* II · Enclosure D: the ring wall with its bench, eleven pillars set into it facing in, the Vulture Stone
   (Pillar 43) among them, and the central pair, Pillars 18 and 31, standing on the smoothed bedrock with
   arms, hands, belts and fox pelts carved on them. Positions APPROX (layout.js); the carvings are our own
   simplified renderings (pillars.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { pillarsD } from "./layout.js?v=1";
import { tpillar, ringWall, bench, relief, facePos, arm, front, fox, snakes, boar, bird, vulture, drystone } from "./pillars.js?v=1";
import { Bucket } from "../../kit.js?v=1";
import { markers, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const E = D.encD;
  const wallM = drystone();
  const pillarM = ctx.mat("block", { color: new THREE.Color("#f1e8d5") });
  const bedrock = ctx.mat("rock", { color: new THREE.Color("#ece4d3") });
  const W = new Bucket(), Pl = new Bucket(), F = new Bucket();
  const gap = [[166, 194]];
  ringWall(W, "w", { cx: E.x, cz: E.z, r: E.r, t: E.wallT, h: E.wallH, gaps: gap, seed: 21, ragged: true, n: 72 });
  bench(W, "w", { cx: E.x, cz: E.z, r: E.r, d: 0.5, h: 0.5, gaps: gap, n: 72 });
  // the smoothed bedrock floor inside the ring
  const n = 48;
  for (let i = 0; i < n; i++) {
    const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2, r = E.r - 0.4;
    F.tri("f", new THREE.Vector3(E.x, 0.02, E.z), new THREE.Vector3(E.x + Math.sin(a1) * r, 0.02, E.z - Math.cos(a1) * r), new THREE.Vector3(E.x + Math.sin(a0) * r, 0.02, E.z - Math.cos(a0) * r));
  }
  const pd = pillarsD();
  for (const p of pd.central.concat(pd.ring)) tpillar(Pl, "p", Object.assign({ seed: 50 + Math.round((p.x + 20) * 13 + p.z * 7) }, p));
  // the central sockets: low rims cut in the bedrock round the foot of each central pillar
  for (const p of pd.central) { const g = new THREE.BoxGeometry(p.t + 0.3, 0.12, p.L + 0.3); g.translate(p.x, 0.06, p.z); Pl.geo("p", g); }
  finish(ctx, F, { f: bedrock }, ["f"]);
  finish(ctx, W, { w: wallM }, []);
  finish(ctx, Pl, { p: pillarM }, []);
  // the central pair: arms down the broad sides, hands, belt and fox pelt on the front, symbols under the head
  const top = D.central.h - D.central.headH - 0.25, ph = 2.6, cy = top - ph / 2;
  for (const p of pd.central) {
    relief(ctx, arm(true), Object.assign({ w: p.L, h: ph }, facePos(p, "right", cy)));
    relief(ctx, arm(false), Object.assign({ w: p.L, h: ph }, facePos(p, "left", cy)));
    relief(ctx, front(true), Object.assign({ w: p.t * 1.02, h: ph }, facePos(p, "front", cy)));
  }
  // the wall pillars: the Vulture Stone, and foxes, snakes, a boar and birds on others (which pillar carries
  // which animal here is illustrative)
  const motifs = [fox, snakes(2), boar, fox, bird, snakes(1), fox, boar, snakes(3), bird];
  let k = 0;
  for (const p of pd.ring) {
    const yy = D.ring.h - D.ring.headH - 0.85;
    if (p.id === "p43") {
      relief(ctx, vulture, Object.assign({ w: p.L * 0.96, h: 2.0 }, facePos(p, "right", D.ring.h - D.ring.headH - 1.05)));
      continue;
    }
    if (k % 3 !== 2) relief(ctx, motifs[k % motifs.length], Object.assign({ w: p.L * 0.9, h: 0.95 }, facePos(p, k % 2 ? "left" : "right", yy)));
    k++;
  }
  markers(ctx, site, "s2");
}
