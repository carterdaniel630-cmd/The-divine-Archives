

/* THE KEEPER (the Archivist) — production figure, pass 1.
   Rebuilt from the approved bench v2 (handoff/keeper/keeper-bench-v2.html,
   Carter 2026-11-01) onto the site's vendored three.js. Pass 1 adds the
   production musts 2-4 of handoff/order-2026-11-01-keeper-bench-v2.md:
   finished hands, a stronger wake in the ground itself, heavier drape.
   Must 1 (goldwork built as woven thread at close zoom) is pass 2.
   Locked from the bench: void face, bound hood edge, solid halo disc,
   RIGHT hand raised in the teaching sign, left hand open and empty,
   no flowers in the goldwork, the wake, the raven of flesh.            */
import * as THREE from "three";
import { RoomEnvironment } from "./keeper-env.js?v=1";

const canvas = document.getElementById('scene');
const stage  = document.getElementById('stage');
const frag = (location.hash || '').toLowerCase();

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  document.getElementById('hint').textContent = 'WebGL is not available on this device.';
  throw e;
}
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.14;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060503);
scene.fog = new THREE.Fog(0x060503, 9, 17);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
/* The site's three.js (r186) lights the same room environment about
   twice as strongly as the bench's r160 did; 0.3 brings the robe, floor
   and halo back to the approved bench captures (measured, front view). */
scene.environmentIntensity = 0.3;

const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 60);

const statue = new THREE.Group();   /* the FIGURE only (incl. halo + raven) — rotates */
statue.position.y = 0.24;
scene.add(statue);
const fixed = new THREE.Group();    /* pedestal + ground — never rotates */
scene.add(fixed);

const ground = new THREE.Mesh(new THREE.CircleGeometry(9, 40),
  new THREE.MeshStandardMaterial({ color: 0x0a0806, roughness: 1, metalness: 0 }));
ground.rotation.x = -Math.PI/2; ground.position.y = -0.001;
fixed.add(ground);

/* stepped round plinth, darker stone — the shared pedestal */
const baseMat = new THREE.MeshStandardMaterial({
  color: 0x35302a, metalness: 0.0, roughness: 0.92,
  envMapIntensity: 0.25, side: THREE.DoubleSide
});
function step(r, y0, h){
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r*1.03, h, 56), baseMat);
  m.position.y = y0 + h/2; fixed.add(m); return m;
}
step(0.54, 0.00, 0.09); step(0.455, 0.09, 0.08); step(0.395, 0.17, 0.07);

/* ---------- lights: chiaroscuro museum rig (Zeus pattern) ---------- */
scene.add(new THREE.HemisphereLight(0x5a4a30, 0x0a0603, 0.34));
const key = new THREE.DirectionalLight(0xffd7a0, 2.2);
key.position.set(2.6, 4.6, 2.8);
scene.add(key);
const spot = new THREE.SpotLight(0xffe0ae, 42, 0, 0.46, 0.75, 1.8);
spot.position.set(-2.4, 5.2, 3.4);
spot.target.position.set(0, 1.55, 0);
scene.add(spot, spot.target);
const rim = new THREE.DirectionalLight(0xd8c9a3, 1.3);
rim.position.set(-3.0, 3.2, -2.8);
scene.add(rim);
const rake = new THREE.DirectionalLight(0xffe2c0, 0.95);
rake.position.set(-3.2, 1.4, 1.6);
scene.add(rake);
const faceFill = new THREE.PointLight(0xffd9a8, 1.9, 6.5, 2.0);
faceFill.position.set(0.8, 1.9, 1.3);
scene.add(faceFill);
const robeLight = new THREE.DirectionalLight(0xffe6c4, 0.70);
robeLight.position.set(0.4, 1.1, 3.6);
scene.add(robeLight);

/* ================= helpers ================= */
function clamp(x,a,b){ return x<a?a:(x>b?b:x); }
function sstep(a,b,x){ const t = clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); }
function angDiff(a,b){ let d = a-b; while(d>Math.PI)d-=2*Math.PI; while(d<-Math.PI)d+=2*Math.PI; return d; }
function profFn(pts){
  return function(y){
    if (y <= pts[0][0]) return pts[0][1];
    for (let i=1;i<pts.length;i++){
      if (y <= pts[i][0]){
        const t = (y-pts[i-1][0])/(pts[i][0]-pts[i-1][0]);
        return pts[i-1][1] + t*(pts[i][1]-pts[i-1][1]);
      }
    }
    return pts[pts.length-1][1];
  };
}
function lerpPt(a,b,t){ return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]; }

/* Lathe with UVs (for the embroidered cloth): modFn(th,y) -> [radialOff, shade]. */
function latheTex(o){
  const ny=o.ny, nth=o.nth, pos=[], col=[], uv=[], idx=[];
  for (let iy=0; iy<=ny; iy++){
    const t = iy/ny, y = o.yFn(t);
    for (let it=0; it<=nth; it++){
      const th = o.thStart + (it/nth)*o.thLen;
      const mm = o.modFn(th, y);
      const r = (o.rFn(y) + mm[0]);
      const ex = o.ellipse? o.ellipse[0]:1, ez = o.ellipse? o.ellipse[1]:1;
      pos.push(Math.sin(th)*r*ex, y + (mm[2]||0), Math.cos(th)*r*ez);
      const s = clamp(mm[1], 0.3, 1.05);
      col.push(s, s*0.99, s*0.97);
      const uu = ((th % (Math.PI*2)) + Math.PI*2) % (Math.PI*2) / (Math.PI*2);
      uv.push(uu * (o.uRep||1), y * (o.vScale||1) + (o.vOff||0));
    }
  }
  for (let iy=0; iy<ny; iy++) for (let it=0; it<nth; it++){
    const a=iy*(nth+1)+it, b=a+1, c=a+nth+1, d=c+1;
    idx.push(a,c,b, b,c,d);
  }
  function fan(yTip, flip){
    const ci = pos.length/3;
    pos.push(0, yTip, 0); col.push(0.5,0.5,0.48); uv.push(0.5, yTip*(o.vScale||1) + (o.vOff||0));
    const row = flip? ny : 0;
    for (let it=0; it<nth; it++){
      const a=row*(nth+1)+it, b=a+1;
      if (flip) idx.push(ci,a,b); else idx.push(ci,b,a);
    }
  }
  if (o.capBottom!==undefined) fan(o.capBottom, false);
  if (o.capTop!==undefined) fan(o.capTop, true);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col,3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx);
  g.computeVertexNormals();
  const mesh = new THREE.Mesh(g, o.mat);
  if (o.group) o.group.add(mesh);
  return mesh;
}
/* Tube along a curve, with UVs: uvFn(t) -> [uRep, vAt]. shadeFn(t,cx,sx)->shade */
function tubeTex(pts, rFn, o){
  o = o||{};
  const curve = new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2])));
  const segs = o.segs||40, rad = o.radial||16;
  const frames = curve.computeFrenetFrames(segs, false);
  const pos=[], col=[], uv=[], idx=[];
  for (let i=0;i<=segs;i++){
    const t=i/segs, p=curve.getPointAt(t), r=rFn(t);
    const N=frames.normals[i], B=frames.binormals[i];
    for (let j=0;j<=rad;j++){
      const a=(j/rad)*Math.PI*2, cx=Math.cos(a), sx=Math.sin(a);
      pos.push(p.x+(N.x*cx+B.x*sx)*r, p.y+(N.y*cx+B.y*sx)*r, p.z+(N.z*cx+B.z*sx)*r);
      const s = o.shade? clamp(o.shade(t,cx,sx),0.3,1.05) : 1.0;
      col.push(s, s*0.99, s*0.97);
      const u = (j/rad) * (o.uRep||1);
      const v = o.vFn? o.vFn(t) : t;
      uv.push(u, v);
    }
  }
  for (let i=0;i<segs;i++) for (let j=0;j<rad;j++){
    const a=i*(rad+1)+j, b=a+1, c=a+rad+1, d=c+1;
    idx.push(a,c,b, b,c,d);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col,3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx); g.computeVertexNormals();
  const mesh=new THREE.Mesh(g, o.mat);
  if (o.group) o.group.add(mesh);
  return mesh;
}
/* Plain tube (skin, wood) — colour attribute written but materials may ignore it. */
function tubeAlong(pts, rFn, o){
  return tubeTex(pts, rFn, Object.assign({}, o, { uRep:1, vFn:()=>0 }));
}
/* Textured sheet: ptFn(u,v) -> [x,y,z,shade]; uv mapped into a texture region. */
function sheetTex(o){
  const nu=o.nu, nv=o.nv, pos=[], col=[], uv=[], idx=[];
  for (let iv=0; iv<=nv; iv++){
    const v = iv/nv;
    for (let iu=0; iu<=nu; iu++){
      const u = iu/nu;
      const q = o.ptFn(u, v);
      pos.push(q[0], q[1], q[2]);
      const s = clamp(q[3], 0.3, 1.05);
      col.push(s, s*0.99, s*0.97);
      uv.push(o.u0 + u*(o.u1-o.u0), o.v0 + v*(o.v1-o.v0));
    }
  }
  for (let iv=0; iv<nv; iv++) for (let iu=0; iu<nu; iu++){
    const a=iv*(nu+1)+iu, b=a+1, c=a+nu+1, d=c+1;
    idx.push(a,c,b, b,c,d);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col,3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx); g.computeVertexNormals();
  const mesh=new THREE.Mesh(g, o.mat);
  if (o.group) o.group.add(mesh);
  return mesh;
}
function ball(sx,sy,sz, x,y,z, mat, group){
  const m=new THREE.Mesh(new THREE.SphereGeometry(1, 26, 20), mat);
  m.scale.set(sx,sy,sz); m.position.set(x,y,z);
  if (group) group.add(m);
  return m;
}

/* ================= THE CLOTH — plain, heavy, unadorned (PASS 5) ====
   PASS 5 (Carter 2026-10-27 12:06 ET): "remove the flowery design. make
   it representative of the archivist's robe like the angel of
   death robe." ALL embroidery is gone — no flowers, roses, marigolds,
   vines, leaves, moons, stars, planets, borders or river band, at any
   scale. What remains is cloth and nothing else: a near-black warm
   brown-grey weave, matte and heavy, whose only variation is the
   woven grain itself and the broad tonal fall of hanging panels. The
   robe's interest is carried entirely by the carved drape geometry —
   deep folds, pooling hem — and by light and shadow on it. */
function makeCloth(){
  const W = 2048, H = 2048;
  let seed = 20261027;
  const rnd = ()=>{ seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  /* cloth ground — very dark warm brown-grey, heavy and matte (Pass 5) */
  const grd = c.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, '#2b251e');
  grd.addColorStop(0.55, '#241f19');
  grd.addColorStop(1, '#201b15');
  c.fillStyle = grd; c.fillRect(0,0,W,H);
  for (let x=0, k=0; x<W; x+=Math.round(W/5), k++){
    c.fillStyle = (k%2)? 'rgba(0,0,0,0.05)' : 'rgba(255,240,210,0.016)';
    c.fillRect(x, 0, Math.round(W/5), H);
  }
  c.strokeStyle = 'rgba(0,0,0,0.055)'; c.lineWidth = 1;
  for (let y=0; y<H; y+=3){ c.beginPath(); c.moveTo(0,y); c.lineTo(W,y); c.stroke(); }
  c.strokeStyle = 'rgba(255,238,205,0.020)';
  for (let y=1; y<H; y+=6){ c.beginPath(); c.moveTo(0,y); c.lineTo(W,y); c.stroke(); }
  c.strokeStyle = 'rgba(0,0,0,0.035)';
  for (let x=0; x<W; x+=3){ c.beginPath(); c.moveTo(x,0); c.lineTo(x,H); c.stroke(); }
  for (let i=0;i<2600;i++){
    c.fillStyle = rnd()<0.5 ? 'rgba(0,0,0,0.045)' : 'rgba(255,235,200,0.026)';
    c.fillRect(rnd()*W, rnd()*H, 3.0, 1.6);
  }

  /* ============ ANCIENT SYMBOLOGY — PASS 6 ==========================
     Attested ancient symbols in muted antique gold thread, worked
     into the cloth. Every symbol is drawn three times (x-W, x, x+W)
     so the pattern wraps the robe's seam without a break. Stroke
     passes: dark under-thread, antique gold, pale centre — the look
     of couched gold embroidery, never bright colour.             */
  const GOLD = '#caa14e', PALE = '#ecd9a4', UNDER = 'rgba(30,20,6,0.9)';
  const X = u => u * W;
  const Y = v => H * (1 - v);
  function strokePath(build, w){
    for (const [ww, col] of [[w*2.6, UNDER],[w*1.6, GOLD],[w*0.62, PALE]]){
      c.strokeStyle = col; c.lineWidth = ww;
      c.lineJoin = 'round'; c.lineCap = 'round';
      /* the gold pass is STITCHED — short laid segments of thread,
         not a smooth printed line (bench v2: no more decals) */
      if (col === GOLD) c.setLineDash([w*1.0, w*0.95]); else c.setLineDash([]);
      c.beginPath(); build(); c.stroke();
    }
    c.setLineDash([]);
  }
  function fillPath(build, col){
    c.fillStyle = col || GOLD;
    c.beginPath(); build(); c.fill();
  }
  function wrap(u, fn){ for (const dx of [-W,0,W]){ c.save(); c.translate(X(u)+dx, 0); fn(); c.restore(); } }

  /* ---- the symbols (each: centre at local 0,0; s = full height) ---- */
  function sAnkh(s){
    const r = s/2;
    strokePath(()=>{ c.ellipse(0, -r*0.52, r*0.34, r*0.42, 0, 0, Math.PI*2); }, s*0.075);
    strokePath(()=>{ c.moveTo(0, -r*0.12); c.lineTo(0, r); }, s*0.075);
    strokePath(()=>{ c.moveTo(-r*0.58, r*0.02); c.lineTo(r*0.58, r*0.02); }, s*0.075);
  }
  function sOm(s){
    const r = s/2;
    /* top bar */
    strokePath(()=>{ c.moveTo(-r*0.78, -r*0.86); c.lineTo(r*0.78, -r*0.86); }, s*0.07);
    /* chandrabindu: crescent + dot above the body, below the bar */
    strokePath(()=>{ c.arc(0, -r*0.60, r*0.20, Math.PI*0.15, Math.PI*0.85, false); }, s*0.06);
    fillPath(()=>{ c.arc(r*0.02, -r*0.86 + r*0.10, s*0.045, 0, Math.PI*2); });
    /* main body — the '3' curves */
    strokePath(()=>{
      c.moveTo(-r*0.72, -r*0.48);
      c.bezierCurveTo(-r*0.10, -r*0.78, r*0.52, -r*0.62, r*0.50, -r*0.30);
      c.bezierCurveTo(r*0.48, -r*0.02, -r*0.05, -r*0.02, -r*0.18, -r*0.02);
    }, s*0.085);
    strokePath(()=>{
      c.moveTo(-r*0.18, -r*0.02);
      c.bezierCurveTo(r*0.45, -r*0.02, r*0.72, r*0.28, r*0.55, r*0.55);
      c.bezierCurveTo(r*0.38, r*0.84, -r*0.30, r*0.86, -r*0.55, r*0.60);
      c.bezierCurveTo(-r*0.68, r*0.46, -r*0.55, r*0.34, -r*0.42, r*0.40);
    }, s*0.085);
    /* the trunk sweeping down on the right */
    strokePath(()=>{
      c.moveTo(r*0.74, -r*0.84);
      c.bezierCurveTo(r*0.86, -r*0.30, r*0.80, r*0.25, r*0.92, r*0.72);
    }, s*0.075);
  }
  function sFoL(s){
    const r = s*0.155;
    const ring = (cx, cy, rr)=>{ c.arc(cx, cy, rr, 0, Math.PI*2); };
    strokePath(()=>{ ring(0, 0, r); }, s*0.045);
    for (let k=0;k<6;k++){
      const a = k*Math.PI/3;
      strokePath(()=>{ ring(Math.cos(a)*r, Math.sin(a)*r, r); }, s*0.045);
    }
    strokePath(()=>{ ring(0, 0, r*2.12); }, s*0.05);
  }
  function sFeather(s){
    const r = s/2, w = r*0.42;
    const leaf = ()=>{ c.moveTo(0, -r);
      c.bezierCurveTo(w, -r*0.45, w, r*0.35, 0, r);
      c.bezierCurveTo(-w, r*0.35, -w, -r*0.45, 0, -r); };
    c.save(); c.beginPath(); leaf(); c.clip();
    for (let i=0;i<7;i++){
      const yy = -r*0.62 + i*r*0.21;
      strokePath(()=>{ c.moveTo(0, yy + r*0.15); c.lineTo(w*0.95, yy - r*0.13); }, s*0.038);
      strokePath(()=>{ c.moveTo(0, yy + r*0.15); c.lineTo(-w*0.95, yy - r*0.13); }, s*0.038);
    }
    c.restore();
    strokePath(leaf, s*0.055);
    strokePath(()=>{ c.moveTo(0, -r); c.lineTo(0, r*1.06); }, s*0.05);
  }
  function sEye(s){
    const r = s/2, w = r, h = r*0.52;
    /* brow */
    strokePath(()=>{ c.moveTo(-w*0.98, -h*0.52);
      c.quadraticCurveTo(0, -h*1.55, w*0.98, -h*0.52); }, s*0.065);
    /* the almond */
    strokePath(()=>{ c.moveTo(-w, 0);
      c.quadraticCurveTo(0, -h*1.25, w, 0);
      c.quadraticCurveTo(0, h*1.25, -w, 0); }, s*0.07);
    /* iris */
    fillPath(()=>{ c.arc(0, 0, r*0.30, 0, Math.PI*2); });
    fillPath(()=>{ c.arc(0, 0, r*0.12, 0, Math.PI*2); }, '#241f19');
    /* tear line + the curl of Memory */
    strokePath(()=>{ c.moveTo(-w*0.30, h*0.72); c.lineTo(-w*0.30, r*0.98); }, s*0.06);
    strokePath(()=>{ c.arc(w*0.40, h*0.95, r*0.20, Math.PI*1.05, Math.PI*2.35); }, s*0.06);
  }
  function sStar(s){
    const r = s/2;
    const tri = (dir)=>{ for (let k=0;k<3;k++){
      const a = dir + k*Math.PI*2/3;
      const px = Math.sin(a)*r, py = -Math.cos(a)*r;
      k? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); };
    strokePath(()=>tri(-0), s*0.06);
    strokePath(()=>tri(Math.PI), s*0.06);
  }
  function sMjolnir(s){
    const r = s/2;
    strokePath(()=>{
      c.moveTo(-r*0.82, -r*0.62); c.lineTo(r*0.82, -r*0.62);
      c.quadraticCurveTo(r*0.92, -r*0.28, r*0.66, -r*0.08);
      c.lineTo(-r*0.66, -r*0.08);
      c.quadraticCurveTo(-r*0.92, -r*0.28, -r*0.82, -r*0.62);
    }, s*0.07);
    strokePath(()=>{ c.moveTo(-r*0.13, -r*0.08); c.lineTo(-r*0.13, r*0.72);
                     c.moveTo( r*0.13, -r*0.08); c.lineTo( r*0.13, r*0.72); }, s*0.06);
    strokePath(()=>{ c.arc(0, r*0.84, r*0.13, 0, Math.PI*2); }, s*0.055);
  }
  function sCrescent(s){
    const r = s/2;
    /* crescent — two offset arcs, horns up */
    fillPath(()=>{
      c.arc(0, 0, r*0.92, Math.PI*0.32, Math.PI*1.52, false);
      c.arc(r*0.34, -r*0.26, r*0.72, Math.PI*1.42, Math.PI*0.38, true);
      c.closePath();
    });
    /* five-point star in the horns' opening */
    fillPath(()=>{
      const cx = r*0.30, cy = -r*0.52, ro = r*0.30, ri = r*0.125;
      for (let k=0;k<10;k++){
        const a = -Math.PI/2 + k*Math.PI/5, rr = (k%2)? ri : ro;
        const px = cx + Math.cos(a)*rr, py = cy + Math.sin(a)*rr;
        k? c.lineTo(px, py) : c.moveTo(px, py);
      }
      c.closePath();
    });
  }
  function sYinYang(s){
    const R = s/2;
    fillPath(()=>{
      c.arc(0, 0, R, -Math.PI/2, Math.PI/2, false);
      c.arc(0,  R/2, R/2, Math.PI/2, -Math.PI/2, true);
      c.arc(0, -R/2, R/2, Math.PI/2, -Math.PI/2, false);
      c.closePath();
    }, 'rgba(202,161,78,0.92)');
    strokePath(()=>{ c.arc(0, 0, R, 0, Math.PI*2); }, s*0.055);
    strokePath(()=>{ c.arc(0, -R/2, R/2, 0, Math.PI*2); }, s*0.035);
    strokePath(()=>{ c.arc(0,  R/2, R/2, 0, Math.PI*2); }, s*0.035);
    fillPath(()=>{ c.arc(0, -R/2, R*0.13, 0, Math.PI*2); }, '#241f19');
    fillPath(()=>{ c.arc(0,  R/2, R*0.13, 0, Math.PI*2); });
  }
  function sTriskele(s){
    const r = s/2;
    for (let k=0;k<3;k++){
      const a0 = k*Math.PI*2/3 - Math.PI/2;
      strokePath(()=>{
        for (let i=0;i<=40;i++){
          const t = i/40, ang = a0 + t*4.4, rad = r*0.10 + t*r*0.78;
          const px = Math.cos(ang)*rad, py = Math.sin(ang)*rad;
          i? c.lineTo(px, py) : c.moveTo(px, py);
        }
      }, s*0.062);
    }
    fillPath(()=>{ c.arc(0, 0, r*0.10, 0, Math.PI*2); });
  }
  function sValknut(s){
    const r = s*0.30;
    const triAt = (cx, cy)=>{ for (let k=0;k<3;k++){
      const a = -Math.PI/2 + k*Math.PI*2/3;
      const px = cx + Math.sin(a + Math.PI/2)*0 + Math.cos(a)*r, py = cy + Math.sin(a)*r;
      k? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); };
    /* triangle points computed plainly: apex up, base below */
    const tri = (cx, cy, rr)=>{ c.moveTo(cx, cy - rr);
      c.lineTo(cx + rr*0.87, cy + rr*0.5); c.lineTo(cx - rr*0.87, cy + rr*0.5); c.closePath(); };
    strokePath(()=>tri(0, -s*0.17, r), s*0.055);
    strokePath(()=>tri(-s*0.19, s*0.16, r), s*0.055);
    strokePath(()=>tri( s*0.19, s*0.16, r), s*0.055);
  }
  function sUnalome(s){
    const r = s/2;
    /* the spiral of the path at the base */
    strokePath(()=>{
      for (let i=0;i<=44;i++){
        const t = i/44, ang = Math.PI*0.6 + t*Math.PI*3.6, rad = r*0.34*(1 - t*0.78);
        const px = Math.cos(ang)*rad, py = r*0.52 + Math.sin(ang)*rad;
        i? c.lineTo(px, py) : c.moveTo(px, py);
      }
    }, s*0.06);
    /* the winding path rising */
    strokePath(()=>{
      c.moveTo(0, r*0.52);
      c.bezierCurveTo(-r*0.52, r*0.18, r*0.52, -r*0.05, 0, -r*0.34);
    }, s*0.06);
    /* the three dots of release */
    for (let k=0;k<3;k++)
      fillPath(()=>{ c.arc(-r*0.10 + k*r*0.10, -r*0.55 - k*r*0.13, s*0.038, 0, Math.PI*2); });
  }
  function sScarab(s){
    const r = s/2;
    /* sun disc carried above */
    strokePath(()=>{ c.arc(0, -r*0.78, r*0.20, 0, Math.PI*2); }, s*0.05);
    strokePath(()=>{ c.moveTo(-r*0.20, -r*0.60); c.lineTo(-r*0.07, -r*0.38);
                     c.moveTo( r*0.20, -r*0.60); c.lineTo( r*0.07, -r*0.38); }, s*0.045);
    /* body */
    fillPath(()=>{ c.ellipse(0, r*0.12, r*0.44, r*0.56, 0, 0, Math.PI*2); }, 'rgba(202,161,78,0.30)');
    strokePath(()=>{ c.ellipse(0, r*0.12, r*0.44, r*0.56, 0, 0, Math.PI*2); }, s*0.06);
    strokePath(()=>{ c.moveTo(0, -r*0.40); c.lineTo(0, r*0.64); }, s*0.045);
    strokePath(()=>{ c.arc(0, r*0.02, r*0.30, Math.PI*0.25, Math.PI*0.75); }, s*0.04);
    strokePath(()=>{ c.arc(0, r*0.30, r*0.32, Math.PI*0.25, Math.PI*0.75); }, s*0.04);
    /* head */
    fillPath(()=>{ c.arc(0, -r*0.40, r*0.17, Math.PI, Math.PI*2); });
    /* six legs, bent */
    for (const sd of [1,-1]) for (let k=0;k<3;k++){
      const yy = -r*0.12 + k*r*0.30, bend = (k-1)*r*0.30;
      strokePath(()=>{ c.moveTo(sd*r*0.42, yy);
        c.lineTo(sd*r*0.78, yy + bend*0.5); c.lineTo(sd*r*0.95, yy + bend); }, s*0.05);
    }
  }
  function sOuroboros(s){
    const r = s/2, R = r*0.80;
    /* the serpent's body — a near-closed ring, gap at the top */
    strokePath(()=>{ c.arc(0, 0, R, -Math.PI*0.42, Math.PI*1.28); }, s*0.11);
    strokePath(()=>{ c.arc(0, 0, R*0.80, 0, Math.PI*2); }, s*0.028);
    /* head at the ring's top end, jaws toward the tail */
    fillPath(()=>{ c.moveTo(Math.cos(-Math.PI*0.42)*R, Math.sin(-Math.PI*0.42)*R);
      c.lineTo(R*0.42, -R*1.22); c.lineTo(R*0.95, -R*0.62); c.closePath(); });
    fillPath(()=>{ c.arc(R*0.52, -R*0.92, s*0.035, 0, Math.PI*2); }, '#241f19');
    /* tail tip at the other end */
    fillPath(()=>{ const a = Math.PI*1.28, ex = Math.cos(a)*R, ey = Math.sin(a)*R;
      c.moveTo(ex, ey); c.lineTo(ex - R*0.30, ey + R*0.22); c.lineTo(ex - R*0.05, ey + R*0.34); c.closePath(); });
  }

  /* ---- placement: four staggered rows + two border bands --------
     (u = around the robe, texture repeats twice; v = height)      */
  /* ---- border bands at the hem ----------------------------------
     stepped fret (xicalcoliuhqui) above, Greek key (meander) below,
     held between gold pinstripes — both attested geometric forms. */
  function goldLine(vv, w){
    c.strokeStyle = GOLD; c.lineWidth = w;
    c.beginPath(); c.moveTo(0, Y(vv)); c.lineTo(W, Y(vv)); c.stroke();
  }
  goldLine(0.168, 5); goldLine(0.158, 2.5);
  /* stepped fret band, v 0.115..0.155 */
  {
    const yT = Y(0.155), yB = Y(0.117), uh = yB - yT, uw = 150;
    c.strokeStyle = GOLD; c.lineWidth = 7; c.lineJoin = 'miter'; c.lineCap = 'square';
    for (let x = -uw; x < W + uw; x += uw){
      c.beginPath();
      c.moveTo(x, yB);
      c.lineTo(x, yT);
      c.lineTo(x + uw*0.72, yT);
      c.lineTo(x + uw*0.72, yT + uh*0.62);
      c.lineTo(x + uw*0.30, yT + uh*0.62);
      c.lineTo(x + uw*0.30, yT + uh*0.30);
      c.lineTo(x + uw*0.52, yT + uh*0.30);
      c.stroke();
    }
  }
  goldLine(0.110, 2.5);
  /* Greek key band, v 0.045..0.105 */
  {
    const yT = Y(0.103), yB = Y(0.047), uh = yB - yT, uw = 150;
    c.strokeStyle = GOLD; c.lineWidth = 7; c.lineJoin = 'miter'; c.lineCap = 'square';
    for (let x = -uw; x < W + uw; x += uw){
      c.beginPath();
      c.moveTo(x, yT + uh*0.82);
      c.lineTo(x + uw*0.80, yT + uh*0.82);
      c.lineTo(x + uw*0.80, yT + uh*0.15);
      c.lineTo(x + uw*0.16, yT + uh*0.15);
      c.lineTo(x + uw*0.16, yT + uh*0.58);
      c.lineTo(x + uw*0.55, yT + uh*0.58);
      c.lineTo(x + uw*0.55, yT + uh*0.34);
      c.stroke();
    }
  }
  goldLine(0.040, 5);

  /* a breath of weave back over the gold — thread sits IN the cloth */
  c.strokeStyle = 'rgba(0,0,0,0.05)'; c.lineWidth = 1;
  for (let y=0; y<H; y+=3){ c.beginPath(); c.moveTo(0,y); c.lineTo(W,y); c.stroke(); }


  /* ============ AGE — worn, stained, mended (bench v2) ============
     The robe is ancient cloth: thin places where the gold has worn
     to a ghost, water-dark stains, and one mended patch of younger
     cloth cross-stitched at its edges.                            */
  for (let i=0;i<26;i++){
    const px = rnd()*W, py = rnd()*H, pr = 60 + rnd()*240;
    const g2 = c.createRadialGradient(px, py, 0, px, py, pr);
    g2.addColorStop(0, rnd() < 0.6 ? 'rgba(150,124,84,0.055)' : 'rgba(8,5,2,0.07)');
    g2.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g2;
    c.fillRect(px-pr, py-pr, pr*2, pr*2);
  }
  {
    const mx = W*0.63, my = H*0.80, mw = 120, mh = 150;
    c.fillStyle = 'rgba(66,54,39,0.85)'; c.fillRect(mx, my, mw, mh);
    c.strokeStyle = 'rgba(202,161,78,0.50)'; c.lineWidth = 3; c.setLineDash([9, 7]);
    c.strokeRect(mx+7, my+7, mw-14, mh-14); c.setLineDash([]);
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

/* ================= THE HALO — moon phases + sacred geometry ================= */
function makeHalo(){
  const W = 1024;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = W;
  const c = cv.getContext('2d');
  const cx = W/2, cy = W/2;
  const grd = c.createRadialGradient(cx, cy, 60, cx, cy, 512);
  grd.addColorStop(0, '#c9ac76'); grd.addColorStop(0.72, '#b28f57'); grd.addColorStop(1, '#8a6a3c');
  c.fillStyle = grd; c.fillRect(0,0,W,W);
  for (let i=0;i<2600;i++){
    c.fillStyle = Math.random()<0.5 ? 'rgba(70,50,20,0.06)' : 'rgba(255,240,200,0.05)';
    c.fillRect(Math.random()*W, Math.random()*W, 2.4, 2.4);
  }
  const line = (col, wdt)=>{ c.strokeStyle = col; c.lineWidth = wdt; };
  /* rim rings */
  line('#6d5326', 10); c.beginPath(); c.arc(cx, cy, 486, 0, Math.PI*2); c.stroke();
  line('#7a5c26', 3);  c.beginPath(); c.arc(cx, cy, 452, 0, Math.PI*2); c.stroke();
  line('#7a5c26', 2);  c.beginPath(); c.arc(cx, cy, 330, 0, Math.PI*2); c.stroke();
  /* moon phases around the rim — 12 stations, waxing then waning */
  for (let i=0;i<12;i++){
    const a = -Math.PI/2 + (i/12)*Math.PI*2;
    const mx = cx + Math.cos(a)*392, my = cy + Math.sin(a)*392;
    const t = i/6;                       /* 0 new -> 1 full (i=6) -> back */
    const illum = i<=6 ? i/6 : (12-i)/6;
    c.fillStyle = '#54401e';
    c.beginPath(); c.arc(mx, my, 24, 0, Math.PI*2); c.fill();
    if (illum > 0.02){
      c.save();
      c.beginPath(); c.arc(mx, my, 21, 0, Math.PI*2); c.clip();
      c.fillStyle = '#ecdcae';
      c.fillRect(mx-21, my-21, 42*illum, 42);
      c.restore();
      c.strokeStyle = 'rgba(84,64,30,0.65)'; c.lineWidth = 1.4;
      c.beginPath(); c.arc(mx, my, 21, 0, Math.PI*2); c.stroke();
    }
    /* radial tick */
    line('#7a5c26', 2);
    c.beginPath();
    c.moveTo(cx + Math.cos(a)*336, cy + Math.sin(a)*336);
    c.lineTo(cx + Math.cos(a)*352, cy + Math.sin(a)*352);
    c.stroke();
  }
  /* sacred geometry — flower of life, lightly drawn */
  line('rgba(110,82,34,0.80)', 2.2);
  const R = 118;
  c.beginPath(); c.arc(cx, cy, R, 0, Math.PI*2); c.stroke();
  for (let k=0;k<6;k++){
    const a = (k/6)*Math.PI*2;
    c.beginPath(); c.arc(cx + Math.cos(a)*R, cy + Math.sin(a)*R, R, 0, Math.PI*2); c.stroke();
  }
  for (const sgn of [1,-1]){
    c.beginPath();
    for (let k=0;k<3;k++){
      const a = sgn*Math.PI/2 + (k/3)*Math.PI*2 * (sgn>0?1:1) + (sgn>0? 0 : Math.PI/3);
      const px = cx + Math.cos(a)*292, py = cy + Math.sin(a)*292;
      k? c.lineTo(px,py) : c.moveTo(px,py);
    }
    c.closePath(); c.stroke();
  }
  line('rgba(110,82,34,0.9)', 2.6);
  c.beginPath(); c.arc(cx, cy, 44, 0, Math.PI*2); c.stroke();
  c.fillStyle = '#8a6a30';
  c.beginPath(); c.arc(cx, cy, 13, 0, Math.PI*2); c.fill();
  c.fillStyle = '#e8d194';
  c.beginPath(); c.arc(cx, cy, 6, 0, Math.PI*2); c.fill();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ================= materials ================= */
const embTex = makeCloth();
const clothMat = new THREE.MeshStandardMaterial({
  map: embTex, bumpMap: embTex, bumpScale: 0.10,
  vertexColors: true, metalness: 0.0, roughness: 0.97,
  envMapIntensity: 0.20, side: THREE.DoubleSide
});
const clothDarkMat = new THREE.MeshStandardMaterial({
  map: embTex, bumpMap: embTex, bumpScale: 0.08, color: 0x8a7a6c,
  vertexColors: true, metalness: 0.0, roughness: 0.97,
  envMapIntensity: 0.16, side: THREE.DoubleSide
});
const trimMat = new THREE.MeshStandardMaterial({
  color: 0xa07c3c, metalness: 0.5, roughness: 0.5, envMapIntensity: 0.65
});
const skinMat = new THREE.MeshStandardMaterial({
  color: 0x8a7458, metalness: 0.0, roughness: 0.58, envMapIntensity: 0.4
});
const voidMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
const woodMat = new THREE.MeshStandardMaterial({
  color: 0x2e2119, metalness: 0.0, roughness: 0.82, envMapIntensity: 0.25
});
const bronzeMat = new THREE.MeshStandardMaterial({
  color: 0x74562a, metalness: 0.85, roughness: 0.48, envMapIntensity: 0.8
});

/* ================= THE FIGURE =================
   Statue-local heights (feet at 0): hem 0, shoulders 1.52, hood
   crown 1.93, halo centre 1.82 (top 2.13).                        */

/* ================= THE ROBE — carved drape, not a lathe column ==========
   PASS 4 (the rebuild): the silhouette is only the start. A dense fold
   field — deep grooves with soft ridges between them, drifting as
   hanging cloth drifts — is carved into the mesh. At the floor the
   cloth PUDDLES: bunched mounds at the hem, and a pool of the robe's
   own cloth spread on the plinth around his feet, as in the references. */
const robeProf = profFn([
  [0.00,0.336],[0.04,0.350],[0.12,0.340],[0.30,0.308],[0.55,0.276],
  [0.85,0.252],[1.10,0.240],[1.30,0.240],[1.42,0.244],[1.50,0.226],
  [1.56,0.186],[1.60,0.118],[1.63,0.060]
]);
/* fold field: p = angle, w = width, a = depth, drift = how far the
   groove wanders as it falls (hanging cloth twists gently) */
const FOLDS = [
  { p:-2.90, w:0.085, a:0.62, y0:0.02, y1:1.30, drift: 0.10 },
  { p:-2.52, w:0.062, a:0.88, y0:0.00, y1:1.42, drift:-0.14 },
  { p:-2.18, w:0.098, a:0.50, y0:0.30, y1:1.20, drift: 0.06 },
  { p:-1.86, w:0.058, a:0.92, y0:0.00, y1:1.46, drift: 0.18 },
  { p:-1.50, w:0.075, a:0.66, y0:0.10, y1:1.36, drift:-0.08 },
  { p:-1.16, w:0.052, a:0.84, y0:0.00, y1:1.30, drift: 0.12 },
  { p:-0.84, w:0.090, a:0.55, y0:0.22, y1:1.24, drift:-0.16 },
  { p:-0.50, w:0.060, a:0.90, y0:0.00, y1:1.44, drift: 0.09 },
  { p:-0.16, w:0.070, a:0.70, y0:0.05, y1:1.38, drift:-0.11 },
  { p: 0.16, w:0.055, a:0.86, y0:0.00, y1:1.40, drift: 0.15 },
  { p: 0.48, w:0.088, a:0.58, y0:0.18, y1:1.26, drift:-0.07 },
  { p: 0.82, w:0.058, a:0.80, y0:0.00, y1:1.34, drift: 0.13 },
  { p: 1.14, w:0.072, a:0.64, y0:0.08, y1:1.30, drift:-0.18 },
  { p: 1.48, w:0.054, a:0.88, y0:0.00, y1:1.42, drift: 0.08 },
  { p: 1.82, w:0.082, a:0.52, y0:0.26, y1:1.22, drift:-0.10 },
  { p: 2.16, w:0.060, a:0.82, y0:0.00, y1:1.38, drift: 0.16 },
  { p: 2.50, w:0.068, a:0.68, y0:0.04, y1:1.32, drift:-0.13 },
  { p: 2.84, w:0.056, a:0.78, y0:0.00, y1:1.28, drift: 0.11 }
];
/* pooling mounds at the hem: angle, width, strength */
const POOLS = [
  { p:-2.60, w:0.34, a:1.0 }, { p:-1.55, w:0.28, a:0.7 },
  { p:-0.45, w:0.36, a:0.9 }, { p: 0.55, w:0.30, a:1.0 },
  { p: 1.60, w:0.33, a:0.75 }, { p: 2.65, w:0.29, a:0.9 }
];
/* PRODUCTION PASS 1 — heavier drape (order must 4). The bench's fold
   field is fine-grained: up close it reads, but at mid-distance the robe
   flattens into a column. Heavy wool hangs in a few broad, deep troughs
   pulled straight down by its own weight, so these macro folds are wide,
   deep and barely drift. They keep off the front opening, where the two
   long falls hang over the robe.                                      */
const MACRO = [
  { p:-2.95, w:0.26, a:1.00, y0:0.06, y1:1.30 },
  { p:-2.10, w:0.22, a:0.85, y0:0.10, y1:1.36 },
  { p:-1.30, w:0.24, a:0.95, y0:0.04, y1:1.32 },
  { p:-0.82, w:0.18, a:0.70, y0:0.14, y1:1.18 },
  { p: 0.84, w:0.19, a:0.72, y0:0.12, y1:1.20 },
  { p: 1.34, w:0.25, a:1.00, y0:0.05, y1:1.34 },
  { p: 2.14, w:0.21, a:0.85, y0:0.08, y1:1.30 },
  { p: 2.70, w:0.23, a:0.90, y0:0.10, y1:1.26 }
];
function robeMod(th, y){
  let off = 0.004*Math.sin(th*3 + 1.7)*(1 - y/1.9)
          + 0.0025*Math.sin(th*5 - 0.6)*Math.sin(y*2.2);
  let groove = 0;
  for (const f of FOLDS){
    const pc = f.p + f.drift * clamp((y - f.y0) / Math.max(0.2, f.y1 - f.y0), 0, 1);
    const d = angDiff(th, pc);
    const env = sstep(f.y0, f.y0+0.18, y) * (1 - sstep(f.y1-0.14, f.y1, y));
    const g = Math.exp(-Math.pow(d/f.w, 2));
    const ridge = Math.exp(-Math.pow((Math.abs(d) - f.w*1.9)/(f.w*1.05), 2));
    off += f.a * env * (-0.046*g + 0.016*ridge);
    groove = Math.max(groove, f.a * g * env);
  }
  let macro = 0;
  for (const m of MACRO){
    const d = angDiff(th, m.p);
    /* weight: the trough deepens toward the hem, where the most cloth hangs */
    const env = sstep(m.y0, m.y0+0.30, y) * (1 - sstep(m.y1-0.24, m.y1, y)) * (0.70 + 0.30*(1 - y/1.4));
    const g = Math.exp(-Math.pow(d/m.w, 2));
    const ridge = Math.exp(-Math.pow((Math.abs(d) - m.w*1.75)/(m.w*0.80), 2));
    off += m.a * env * (-0.034*g + 0.011*ridge);
    macro = Math.max(macro, m.a * g * env);
  }
  /* pooling: below ~15 cm the cloth bunches — mounds push outward and
     the lowest rows lift and settle in soft scallops */
  let yOff = 0;
  if (y < 0.16){
    const t = 1 - y/0.16;
    let mound = 0;
    for (const pm of POOLS){
      const d = angDiff(th, pm.p);
      mound = Math.max(mound, pm.a * Math.exp(-Math.pow(d/pm.w, 2)));
    }
    off += 0.056 * mound * t;
    yOff += 0.014 * Math.sin(th*9 + 1.3) * t * (0.4 + 0.6*mound) * sstep(0.0, 0.05, y);
  }
  if (y < 0.07) off += 0.006*Math.sin(th*7 + 0.5) * (1 - y/0.07);
  /* the hem is worn uneven — a ragged, time-eaten edge (bench v2) */
  if (y < 0.05){
    const tt = 1 - y/0.05;
    off += 0.0035*Math.sin(th*43 + Math.sin(th*9)*2.0) * tt;
    yOff -= 0.005*Math.abs(Math.sin(th*29 + 1.0)) * tt * sstep(0.005, 0.05, y);
  }
  return [off, (1 - 0.50*groove) * (1 - 0.30*macro), yOff];
}

/* ---------- the robe ---------- */
latheTex({ ny:150, nth:280, thStart:0, thLen:Math.PI*2,
  yFn:t=>t*1.63, rFn:robeProf, ellipse:[1,0.93],
  modFn:robeMod, capTop:1.635, capBottom:0.0,
  uRep:2, vScale:1/1.63, mat:clothMat, group:statue });

/* the pool of cloth on the plinth — the robe's hem cloth spread around
   the plinth, textured from the same plain cloth */
sheetTex({ nu:120, nv:16, u0:0, u1:2, v0:0.012, v1:0.115, mat:clothMat, group:statue,
  ptFn:(u,v)=>{
    const th = u * Math.PI * 2;
    const r = 0.288 + v*0.162;
    let mound = 0;
    for (const pm of POOLS){
      const d = angDiff(th, pm.p);
      mound = Math.max(mound, pm.a * Math.exp(-Math.pow(d/(pm.w*1.25), 2)));
    }
    const wave = Math.sin(th*11 + v*5.0) * 0.5 + Math.sin(th*5 - 1.2) * 0.5;
    let y = 0.0025 + (0.030*mound + 0.009*wave) * Math.pow(1-v, 1.4) + 0.004*(1-v);
    /* past the plinth's top step the pool spills over its edge and
       settles onto the step below, as cloth does */
    if (r > 0.392) y -= (r - 0.392) * 1.15;
    return [Math.sin(th)*r, y, Math.cos(th)*r*0.96, 1 - 0.18*Math.abs(wave)*(1-v)];
  }});
/* ---------- FRAY — the hem worn to threads (bench v2) ---------- */
{
  const frayMat = new THREE.MeshStandardMaterial({ color: 0x241c12, metalness: 0, roughness: 1, envMapIntensity: 0.12 });
  const fr = (i, n)=>{ const x = Math.sin(i*127.1 + n*311.7)*43758.5453; return x - Math.floor(x); };
  for (let k=0;k<52;k++){
    const a = (k/52)*Math.PI*2 + fr(k,1)*0.10;
    const r0 = robeProf(0.03) + robeMod(a, 0.03)[0] + 0.004;
    const x0 = Math.sin(a)*r0, z0 = Math.cos(a)*r0*0.93;
    const len = 0.018 + fr(k,2)*0.034, out = 0.004 + fr(k,3)*0.012;
    const dirx = Math.sin(a), dirz = Math.cos(a)*0.93;
    tubeAlong([[x0, 0.048, z0],
               [x0 + dirx*out*0.5, 0.048 - len*0.55, z0 + dirz*out*0.5],
               [x0 + dirx*out, 0.048 - len, z0 + dirz*out]],
      t=> 0.0017*(1-t) + 0.0007*t, { segs:5, radial:5, mat:frayMat, group:statue });
  }
}


/* the two long front falls — overlapping panels hanging from the chest
   to the hem, as the reference robe is worn */
for (const s of [1,-1]){
  const uA = s>0? 0.36 : 0.70, uB = s>0? 0.52 : 0.86;
  sheetTex({ nu:16, nv:44, u0:uA, u1:uB, v0:0.90, v1:0.05, mat:clothMat, group:statue,
    ptFn:(u,v)=>{
      const y = 1.475 - v*1.415;
      const rp = robeProf(clamp(y, 0, 1.63));
      const cx = s * (0.030 + 0.052*v);
      const half = 0.078 * (1 - 0.12*v);
      const x = cx + (u-0.5)*2*half;
      const ripple = 0.009*Math.sin(u*Math.PI*3 + s*1.2) * (0.35 + 0.65*v)
                   + 0.005*Math.sin(u*Math.PI*7 + v*4.0);
      const z = 0.93 * Math.sqrt(Math.max(0.004, rp*rp - x*x)) + 0.012 + ripple;
      return [x, y, z, 1 - 0.16*Math.abs(Math.sin(u*Math.PI*3 + s*1.2))];
    }});
}

/* inner robe panel — the dark V inside the opening */
latheTex({ ny:36, nth:36, thStart:-0.46, thLen:0.92,
  yFn:t=>1.10 + t*0.52,
  rFn:profFn([[1.10,0.205],[1.30,0.200],[1.50,0.185],[1.62,0.075]]),
  ellipse:[1,0.94],
  modFn:(th,y)=>[-0.006 - 0.010*(1-Math.abs(th)/0.46), 0.92],
  uRep:3, vScale:0.5, mat:clothDarkMat, group:statue });


/* ---------- sleeves + arms ---------- */
/* pleated tube: the radius breathes around the circumference, so the
   cloth hangs in pleats instead of a smooth pipe */
function tubePleat(pts, rFn, o){
  o = o||{};
  const curve = new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2])));
  const segs = o.segs||40, rad = o.radial||22;
  const frames = curve.computeFrenetFrames(segs, false);
  const pos=[], col=[], uv=[], idx=[];
  for (let i=0;i<=segs;i++){
    const t=i/segs, p=curve.getPointAt(t), rb=rFn(t);
    const N=frames.normals[i], B=frames.binormals[i];
    for (let j=0;j<=rad;j++){
      const a=(j/rad)*Math.PI*2, cx=Math.cos(a), sx=Math.sin(a);
      const pl = 1 + (o.pleatAmp? o.pleatAmp(t):0) * Math.sin(a*(o.pleatN||7) + (o.pleatPh||0));
      const r = rb * pl;
      pos.push(p.x+(N.x*cx+B.x*sx)*r, p.y+(N.y*cx+B.y*sx)*r, p.z+(N.z*cx+B.z*sx)*r);
      const s = o.shade? clamp(o.shade(t,cx,sx),0.3,1.05) : 1.0;
      col.push(s, s*0.99, s*0.97);
      uv.push((j/rad) * (o.uRep||1), o.vFn? o.vFn(t) : t);
    }
  }
  for (let i=0;i<segs;i++) for (let j=0;j<rad;j++){
    const a=i*(rad+1)+j, b=a+1, c=a+rad+1, d=c+1;
    idx.push(a,c,b, b,c,d);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col,3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx); g.computeVertexNormals();
  const mesh=new THREE.Mesh(g, o.mat);
  if (o.group) o.group.add(mesh);
  return mesh;
}
/* RIGHT (figure's right, -x): upper sleeve, opening as it falls */
tubePleat([[-0.185,1.475,0.005],[-0.248,1.340,0.020],[-0.292,1.228,0.035]],
  t=>0.080 + 0.030*t,
  { segs:26, radial:22, mat:clothMat, group:statue, uRep:2, pleatN:7,
    pleatAmp: t=> 0.05 + 0.10*t,
    vFn:t=>0.36 - 0.17*t,
    shade:(t,cx,sx)=> 1 - 0.16*(1-t)*Math.max(0,-sx) });
/* the hanging fall — a broad cascade of embroidered cloth dropping
   from the raised forearm, folded, its hem scalloped */
sheetTex({ nu:30, nv:34, u0:0.55, u1:0.87, v0:0.34, v1:0.06, mat:clothMat, group:statue,
  ptFn:(u,v)=>{
    const top = lerpPt([-0.288,1.246,0.030], [-0.336,1.452,0.096], u);
    const len = 0.47 + 0.09*Math.sin(u*Math.PI) - 0.03*Math.abs(u-0.5);
    const fold = Math.sin(u*Math.PI*4 + 0.7);
    const x = top[0] - 0.006*v + 0.010*fold*v;
    const y = top[1] - len*v;
    const z = top[2] + 0.014*v + 0.020*Math.sin(v*Math.PI) + 0.028*fold*v;
    return [x, y, z, 1 - 0.26*v*(0.35 + 0.65*Math.abs(fold))];
  }});
/* forearm cloth up to the wrist */
tubePleat([[-0.300,1.232,0.038],[-0.322,1.360,0.066],[-0.333,1.478,0.094]],
  t=>0.062 - 0.014*t,
  { segs:22, radial:18, mat:clothMat, group:statue, uRep:2, pleatN:6,
    pleatAmp: t=> 0.05*(1-t),
    vFn:t=>0.36 - 0.08*t });

/* LEFT (+x): the long hanging bell sleeve, pleated, flaring wide */
tubePleat([[0.185,1.475,0.005],[0.232,1.345,0.016],[0.258,1.200,0.030],[0.290,1.070,0.046],[0.312,0.995,0.058]],
  t=>0.078 + 0.042*t,
  { segs:34, radial:22, mat:clothMat, group:statue, uRep:2, pleatN:8,
    pleatAmp: t=> 0.05 + 0.13*t,
    vFn:t=>0.36 - 0.19*t,
    shade:(t,cx,sx)=> 1 - 0.14*(1-t)*Math.max(0,-sx) });
/* the left cuff band — the border diamonds worked around the cuff */
tubePleat([[0.312,0.998,0.058],[0.320,0.945,0.064]],
  t=>0.138 + 0.013*t,
  { segs:8, radial:22, mat:clothMat, group:statue, uRep:3, pleatN:8,
    pleatAmp: t=> 0.08,
    vFn:t=>0.970 - 0.048*t });

/* ================= THE SYMBOL ATLAS — PASS 6 ========================
   Fourteen attested symbols drawn once, in bold antique gold, on a
   transparent atlas (4x4 cells of 512). Patches sample whole cells,
   so every symbol keeps its true proportions on the cloth.       */
const ATLAS_CELLS = {
  ankh:[0,0], om:[1,0], fol:[2,0], feather:[3,0],
  eye:[0,1], star:[1,1], mjolnir:[2,1], triskele:[3,1],
  yinyang:[0,2], valknut:[1,2], unalome:[2,2], scarab:[3,2],
  ouroboros:[0,3], crescent:[1,3],
  seed:[0,4], triquetra:[1,4], moon:[2,4], starp:[3,4]
};
function makeAtlas(){
  const W = 2048, H = 2560;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  c.clearRect(0, 0, W, H);
  const GOLD = '#caa14e', PALE = '#ecd9a4', UNDER = 'rgba(30,20,6,0.9)';
  const X = u => u * W;
  const Y = v => H * (1 - v);
  function strokePath(build, w){
    for (const [ww, col] of [[w*2.6, UNDER],[w*1.6, GOLD],[w*0.62, PALE]]){
      c.strokeStyle = col; c.lineWidth = ww;
      c.lineJoin = 'round'; c.lineCap = 'round';
      /* the gold pass is STITCHED — short laid segments of thread,
         not a smooth printed line (bench v2: no more decals) */
      if (col === GOLD) c.setLineDash([w*1.0, w*0.95]); else c.setLineDash([]);
      c.beginPath(); build(); c.stroke();
    }
    c.setLineDash([]);
  }
  function fillPath(build, col){
    c.fillStyle = col || GOLD;
    c.beginPath(); build(); c.fill();
  }
  function wrap(u, fn){ for (const dx of [-W,0,W]){ c.save(); c.translate(X(u)+dx, 0); fn(); c.restore(); } }

  /* ---- the symbols (each: centre at local 0,0; s = full height) ---- */
  function sAnkh(s){
    const r = s/2;
    strokePath(()=>{ c.ellipse(0, -r*0.52, r*0.34, r*0.42, 0, 0, Math.PI*2); }, s*0.075);
    strokePath(()=>{ c.moveTo(0, -r*0.12); c.lineTo(0, r); }, s*0.075);
    strokePath(()=>{ c.moveTo(-r*0.58, r*0.02); c.lineTo(r*0.58, r*0.02); }, s*0.075);
  }
  function sOm(s){
    const r = s/2;
    /* top bar */
    strokePath(()=>{ c.moveTo(-r*0.78, -r*0.86); c.lineTo(r*0.78, -r*0.86); }, s*0.07);
    /* chandrabindu: crescent + dot above the body, below the bar */
    strokePath(()=>{ c.arc(0, -r*0.60, r*0.20, Math.PI*0.15, Math.PI*0.85, false); }, s*0.06);
    fillPath(()=>{ c.arc(r*0.02, -r*0.86 + r*0.10, s*0.045, 0, Math.PI*2); });
    /* main body — the '3' curves */
    strokePath(()=>{
      c.moveTo(-r*0.72, -r*0.48);
      c.bezierCurveTo(-r*0.10, -r*0.78, r*0.52, -r*0.62, r*0.50, -r*0.30);
      c.bezierCurveTo(r*0.48, -r*0.02, -r*0.05, -r*0.02, -r*0.18, -r*0.02);
    }, s*0.085);
    strokePath(()=>{
      c.moveTo(-r*0.18, -r*0.02);
      c.bezierCurveTo(r*0.45, -r*0.02, r*0.72, r*0.28, r*0.55, r*0.55);
      c.bezierCurveTo(r*0.38, r*0.84, -r*0.30, r*0.86, -r*0.55, r*0.60);
      c.bezierCurveTo(-r*0.68, r*0.46, -r*0.55, r*0.34, -r*0.42, r*0.40);
    }, s*0.085);
    /* the trunk sweeping down on the right */
    strokePath(()=>{
      c.moveTo(r*0.74, -r*0.84);
      c.bezierCurveTo(r*0.86, -r*0.30, r*0.80, r*0.25, r*0.92, r*0.72);
    }, s*0.075);
  }
  function sFoL(s){
    const r = s*0.155;
    const ring = (cx, cy, rr)=>{ c.arc(cx, cy, rr, 0, Math.PI*2); };
    strokePath(()=>{ ring(0, 0, r); }, s*0.045);
    for (let k=0;k<6;k++){
      const a = k*Math.PI/3;
      strokePath(()=>{ ring(Math.cos(a)*r, Math.sin(a)*r, r); }, s*0.045);
    }
    strokePath(()=>{ ring(0, 0, r*2.12); }, s*0.05);
  }
  function sFeather(s){
    const r = s/2, w = r*0.42;
    const leaf = ()=>{ c.moveTo(0, -r);
      c.bezierCurveTo(w, -r*0.45, w, r*0.35, 0, r);
      c.bezierCurveTo(-w, r*0.35, -w, -r*0.45, 0, -r); };
    c.save(); c.beginPath(); leaf(); c.clip();
    for (let i=0;i<7;i++){
      const yy = -r*0.62 + i*r*0.21;
      strokePath(()=>{ c.moveTo(0, yy + r*0.15); c.lineTo(w*0.95, yy - r*0.13); }, s*0.038);
      strokePath(()=>{ c.moveTo(0, yy + r*0.15); c.lineTo(-w*0.95, yy - r*0.13); }, s*0.038);
    }
    c.restore();
    strokePath(leaf, s*0.055);
    strokePath(()=>{ c.moveTo(0, -r); c.lineTo(0, r*1.06); }, s*0.05);
  }
  function sEye(s){
    const r = s/2, w = r, h = r*0.52;
    /* brow */
    strokePath(()=>{ c.moveTo(-w*0.98, -h*0.52);
      c.quadraticCurveTo(0, -h*1.55, w*0.98, -h*0.52); }, s*0.065);
    /* the almond */
    strokePath(()=>{ c.moveTo(-w, 0);
      c.quadraticCurveTo(0, -h*1.25, w, 0);
      c.quadraticCurveTo(0, h*1.25, -w, 0); }, s*0.07);
    /* iris */
    fillPath(()=>{ c.arc(0, 0, r*0.30, 0, Math.PI*2); });
    fillPath(()=>{ c.arc(0, 0, r*0.12, 0, Math.PI*2); }, '#241f19');
    /* tear line + the curl of Memory */
    strokePath(()=>{ c.moveTo(-w*0.30, h*0.72); c.lineTo(-w*0.30, r*0.98); }, s*0.06);
    strokePath(()=>{ c.arc(w*0.40, h*0.95, r*0.20, Math.PI*1.05, Math.PI*2.35); }, s*0.06);
  }
  function sStar(s){
    const r = s/2;
    const tri = (dir)=>{ for (let k=0;k<3;k++){
      const a = dir + k*Math.PI*2/3;
      const px = Math.sin(a)*r, py = -Math.cos(a)*r;
      k? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); };
    strokePath(()=>tri(-0), s*0.06);
    strokePath(()=>tri(Math.PI), s*0.06);
  }
  function sMjolnir(s){
    const r = s/2;
    strokePath(()=>{
      c.moveTo(-r*0.82, -r*0.62); c.lineTo(r*0.82, -r*0.62);
      c.quadraticCurveTo(r*0.92, -r*0.28, r*0.66, -r*0.08);
      c.lineTo(-r*0.66, -r*0.08);
      c.quadraticCurveTo(-r*0.92, -r*0.28, -r*0.82, -r*0.62);
    }, s*0.07);
    strokePath(()=>{ c.moveTo(-r*0.13, -r*0.08); c.lineTo(-r*0.13, r*0.72);
                     c.moveTo( r*0.13, -r*0.08); c.lineTo( r*0.13, r*0.72); }, s*0.06);
    strokePath(()=>{ c.arc(0, r*0.84, r*0.13, 0, Math.PI*2); }, s*0.055);
  }
  function sCrescent(s){
    const r = s/2;
    /* crescent — two offset arcs, horns up */
    fillPath(()=>{
      c.arc(0, 0, r*0.92, Math.PI*0.32, Math.PI*1.52, false);
      c.arc(r*0.34, -r*0.26, r*0.72, Math.PI*1.42, Math.PI*0.38, true);
      c.closePath();
    });
    /* five-point star in the horns' opening */
    fillPath(()=>{
      const cx = r*0.30, cy = -r*0.52, ro = r*0.30, ri = r*0.125;
      for (let k=0;k<10;k++){
        const a = -Math.PI/2 + k*Math.PI/5, rr = (k%2)? ri : ro;
        const px = cx + Math.cos(a)*rr, py = cy + Math.sin(a)*rr;
        k? c.lineTo(px, py) : c.moveTo(px, py);
      }
      c.closePath();
    });
  }
  function sYinYang(s){
    const R = s/2;
    fillPath(()=>{
      c.arc(0, 0, R, -Math.PI/2, Math.PI/2, false);
      c.arc(0,  R/2, R/2, Math.PI/2, -Math.PI/2, true);
      c.arc(0, -R/2, R/2, Math.PI/2, -Math.PI/2, false);
      c.closePath();
    }, 'rgba(202,161,78,0.92)');
    strokePath(()=>{ c.arc(0, 0, R, 0, Math.PI*2); }, s*0.055);
    strokePath(()=>{ c.arc(0, -R/2, R/2, 0, Math.PI*2); }, s*0.035);
    strokePath(()=>{ c.arc(0,  R/2, R/2, 0, Math.PI*2); }, s*0.035);
    fillPath(()=>{ c.arc(0, -R/2, R*0.13, 0, Math.PI*2); }, '#241f19');
    fillPath(()=>{ c.arc(0,  R/2, R*0.13, 0, Math.PI*2); });
  }
  function sTriskele(s){
    const r = s/2;
    for (let k=0;k<3;k++){
      const a0 = k*Math.PI*2/3 - Math.PI/2;
      strokePath(()=>{
        for (let i=0;i<=40;i++){
          const t = i/40, ang = a0 + t*4.4, rad = r*0.10 + t*r*0.78;
          const px = Math.cos(ang)*rad, py = Math.sin(ang)*rad;
          i? c.lineTo(px, py) : c.moveTo(px, py);
        }
      }, s*0.062);
    }
    fillPath(()=>{ c.arc(0, 0, r*0.10, 0, Math.PI*2); });
  }
  function sValknut(s){
    const r = s*0.30;
    const triAt = (cx, cy)=>{ for (let k=0;k<3;k++){
      const a = -Math.PI/2 + k*Math.PI*2/3;
      const px = cx + Math.sin(a + Math.PI/2)*0 + Math.cos(a)*r, py = cy + Math.sin(a)*r;
      k? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); };
    /* triangle points computed plainly: apex up, base below */
    const tri = (cx, cy, rr)=>{ c.moveTo(cx, cy - rr);
      c.lineTo(cx + rr*0.87, cy + rr*0.5); c.lineTo(cx - rr*0.87, cy + rr*0.5); c.closePath(); };
    strokePath(()=>tri(0, -s*0.17, r), s*0.055);
    strokePath(()=>tri(-s*0.19, s*0.16, r), s*0.055);
    strokePath(()=>tri( s*0.19, s*0.16, r), s*0.055);
  }
  function sUnalome(s){
    const r = s/2;
    /* the spiral of the path at the base */
    strokePath(()=>{
      for (let i=0;i<=44;i++){
        const t = i/44, ang = Math.PI*0.6 + t*Math.PI*3.6, rad = r*0.34*(1 - t*0.78);
        const px = Math.cos(ang)*rad, py = r*0.52 + Math.sin(ang)*rad;
        i? c.lineTo(px, py) : c.moveTo(px, py);
      }
    }, s*0.06);
    /* the winding path rising */
    strokePath(()=>{
      c.moveTo(0, r*0.52);
      c.bezierCurveTo(-r*0.52, r*0.18, r*0.52, -r*0.05, 0, -r*0.34);
    }, s*0.06);
    /* the three dots of release */
    for (let k=0;k<3;k++)
      fillPath(()=>{ c.arc(-r*0.10 + k*r*0.10, -r*0.55 - k*r*0.13, s*0.038, 0, Math.PI*2); });
  }
  function sScarab(s){
    const r = s/2;
    /* sun disc carried above */
    strokePath(()=>{ c.arc(0, -r*0.78, r*0.20, 0, Math.PI*2); }, s*0.05);
    strokePath(()=>{ c.moveTo(-r*0.20, -r*0.60); c.lineTo(-r*0.07, -r*0.38);
                     c.moveTo( r*0.20, -r*0.60); c.lineTo( r*0.07, -r*0.38); }, s*0.045);
    /* body */
    fillPath(()=>{ c.ellipse(0, r*0.12, r*0.44, r*0.56, 0, 0, Math.PI*2); }, 'rgba(202,161,78,0.30)');
    strokePath(()=>{ c.ellipse(0, r*0.12, r*0.44, r*0.56, 0, 0, Math.PI*2); }, s*0.06);
    strokePath(()=>{ c.moveTo(0, -r*0.40); c.lineTo(0, r*0.64); }, s*0.045);
    strokePath(()=>{ c.arc(0, r*0.02, r*0.30, Math.PI*0.25, Math.PI*0.75); }, s*0.04);
    strokePath(()=>{ c.arc(0, r*0.30, r*0.32, Math.PI*0.25, Math.PI*0.75); }, s*0.04);
    /* head */
    fillPath(()=>{ c.arc(0, -r*0.40, r*0.17, Math.PI, Math.PI*2); });
    /* six legs, bent */
    for (const sd of [1,-1]) for (let k=0;k<3;k++){
      const yy = -r*0.12 + k*r*0.30, bend = (k-1)*r*0.30;
      strokePath(()=>{ c.moveTo(sd*r*0.42, yy);
        c.lineTo(sd*r*0.78, yy + bend*0.5); c.lineTo(sd*r*0.95, yy + bend); }, s*0.05);
    }
  }
  function sOuroboros(s){
    const r = s/2, R = r*0.80;
    /* the serpent's body — a near-closed ring, gap at the top */
    strokePath(()=>{ c.arc(0, 0, R, -Math.PI*0.42, Math.PI*1.28); }, s*0.11);
    strokePath(()=>{ c.arc(0, 0, R*0.80, 0, Math.PI*2); }, s*0.028);
    /* head at the ring's top end, jaws toward the tail */
    fillPath(()=>{ c.moveTo(Math.cos(-Math.PI*0.42)*R, Math.sin(-Math.PI*0.42)*R);
      c.lineTo(R*0.42, -R*1.22); c.lineTo(R*0.95, -R*0.62); c.closePath(); });
    fillPath(()=>{ c.arc(R*0.52, -R*0.92, s*0.035, 0, Math.PI*2); }, '#241f19');
    /* tail tip at the other end */
    fillPath(()=>{ const a = Math.PI*1.28, ex = Math.cos(a)*R, ey = Math.sin(a)*R;
      c.moveTo(ex, ey); c.lineTo(ex - R*0.30, ey + R*0.22); c.lineTo(ex - R*0.05, ey + R*0.34); c.closePath(); });
  }

  /* ---- row 5: sacred geometry linework, the moon, the stars ---- */
  function sSeed(s){
    /* the Seed of Life — seven equal circles, pure linework */
    const r = s*0.148;
    const ring = (cx, cy, rr)=>{ c.arc(cx, cy, rr, 0, Math.PI*2); };
    strokePath(()=>{ ring(0, 0, r); }, s*0.042);
    for (let k=0;k<6;k++){
      const a = k*Math.PI/3 - Math.PI/2;
      strokePath(()=>{ ring(Math.cos(a)*r, Math.sin(a)*r, r); }, s*0.042);
    }
    strokePath(()=>{ ring(0, 0, r*2); }, s*0.05);
    strokePath(()=>{ ring(0, 0, r*2.22); }, s*0.032);
  }
  function sTriquetra(s){
    /* three interlaced vesica arcs — Celtic geometry */
    const r = s*0.30;
    for (let k=0;k<3;k++){
      const a = -Math.PI/2 + k*Math.PI*2/3;
      const cx = Math.cos(a)*r*0.62, cy = Math.sin(a)*r*0.62;
      strokePath(()=>{ c.arc(cx, cy, r, a + Math.PI*0.72, a + Math.PI*1.95); }, s*0.055);
    }
    strokePath(()=>{ c.arc(0, 0, r*0.30, 0, Math.PI*2); }, s*0.04);
  }
  function sMoon(s){
    /* a plain crescent, horns up, with a small orb beneath */
    const r = s/2;
    fillPath(()=>{
      c.arc(0, -r*0.08, r*0.80, Math.PI*0.30, Math.PI*1.55, false);
      c.arc(r*0.30, -r*0.30, r*0.62, Math.PI*1.45, Math.PI*0.35, true);
      c.closePath();
    });
    strokePath(()=>{ c.arc(0, r*0.78, r*0.10, 0, Math.PI*2); }, s*0.045);
  }
  function sStarp(s){
    /* eight-point star — two squares turned against each other */
    const r = s/2;
    const sq = (rot)=>{ for (let k=0;k<4;k++){
      const a = rot + k*Math.PI/2;
      const px = Math.cos(a)*r*0.92, py = Math.sin(a)*r*0.92;
      k? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); };
    strokePath(()=>sq(Math.PI/4), s*0.052);
    strokePath(()=>sq(0), s*0.052);
    fillPath(()=>{ c.arc(0, 0, r*0.13, 0, Math.PI*2); });
  }

  const FNS = { ankh:sAnkh, om:sOm, fol:sFoL, feather:sFeather,
    eye:sEye, star:sStar, mjolnir:sMjolnir, triskele:sTriskele,
    yinyang:sYinYang, valknut:sValknut, unalome:sUnalome,
    scarab:sScarab, ouroboros:sOuroboros, crescent:sCrescent,
    seed:sSeed, triquetra:sTriquetra, moon:sMoon, starp:sStarp };
  for (const name of Object.keys(ATLAS_CELLS)){
    const [col, row] = ATLAS_CELLS[name];
    c.save();
    c.translate(col*512 + 256, row*512 + 256);
    FNS[name](400);
    c.restore();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}


/* ================= SYMBOL PATCHES — PASS 6 ==========================
   The fourteen symbols are NOT in the robe's weave texture (its UV
   scales differ per surface and sliced them). Each symbol is a gold
   patch with its own square UV, laid on the real surface: curved
   patches follow the robe's fold field; panel patches reuse the
   front falls' and the cascade's own surface maths.              */
const atlasTex = makeAtlas();
const atlasMat = new THREE.MeshStandardMaterial({
  map: atlasTex, bumpMap: atlasTex, bumpScale: 0.85,
  transparent: true, color: 0xa8915c, metalness: 0.08,
  roughness: 0.78, envMapIntensity: 0.30, side: THREE.DoubleSide,
  depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2
});
function cellUV(name){
  const [col, row] = ATLAS_CELLS[name];
  return [col/4, 1 - (row+1)/5, (col+1)/4, 1 - row/5];   /* u0,v0,u1,v1 */
}
function bodyPatch(th0, y0, name, Wm, Hm){
  const [u0, v0, u1, v1] = cellUV(name);
  const arc = (Wm || 0.165) / (robeProf(y0) + 0.02);
  const H = Hm || 0.185;
  sheetTex({ nu:16, nv:16, u0, v0, u1, v1, mat:atlasMat, group:statue,
    ptFn:(u,v)=>{
      const th = th0 + (u - 0.5) * arc;
      const y = y0 + (v - 0.5) * H;
      const mm = robeMod(th, y);
      const r = robeProf(clamp(y, 0, 1.63)) + mm[0] + 0.007;
      return [Math.sin(th)*r, y + (mm[2]||0), Math.cos(th)*r*0.93, mm[1]];
    }});
  const m = statue.children[statue.children.length-1];
  m.renderOrder = 2;
}
/* the front falls' own surface (duplicated from their sheet build) */
function fallPoint(s, u, v){
  const y = 1.475 - v*1.415;
  const rp = robeProf(clamp(y, 0, 1.63));
  const cx = s * (0.030 + 0.052*v);
  const half = 0.078 * (1 - 0.12*v);
  const x = cx + (u-0.5)*2*half;
  const ripple = 0.009*Math.sin(u*Math.PI*3 + s*1.2) * (0.35 + 0.65*v)
               + 0.005*Math.sin(u*Math.PI*7 + v*4.0);
  const z = 0.93 * Math.sqrt(Math.max(0.004, rp*rp - x*x)) + 0.012 + ripple;
  return [x, y, z];
}
function fallPatch(s, va, vb, name){
  const [u0, v0, u1, v1] = cellUV(name);
  /* fall v runs top-down; swap the cell's v so the symbol stands upright */
  sheetTex({ nu:14, nv:14, u0, v0:v1, u1, v1:v0, mat:atlasMat, group:statue,
    ptFn:(u,v)=>{
      const q = fallPoint(s, 0.20 + u*0.60, va + v*(vb-va));
      return [q[0], q[1], q[2] + 0.010, 1];
    }});
  statue.children[statue.children.length-1].renderOrder = 2;
}
/* the cascade sleeve fall's own surface (duplicated from its build) */
function cascadePoint(u, v){
  const top = lerpPt([-0.288,1.246,0.030], [-0.336,1.452,0.096], u);
  const len = 0.47 + 0.09*Math.sin(u*Math.PI) - 0.03*Math.abs(u-0.5);
  const fold = Math.sin(u*Math.PI*4 + 0.7);
  return [top[0] - 0.006*v + 0.010*fold*v,
          top[1] - len*v,
          top[2] + 0.014*v + 0.020*Math.sin(v*Math.PI) + 0.028*fold*v];
}
function cascadePatch(name){
  const [u0, v0, u1, v1] = cellUV(name);
  sheetTex({ nu:14, nv:14, u0, v0:v1, u1, v1:v0, mat:atlasMat, group:statue,
    ptFn:(u,v)=>{
      const q = cascadePoint(0.22 + u*0.56, 0.10 + v*0.40);
      return [q[0], q[1], q[2] + 0.010, 1];
    }});
  statue.children[statue.children.length-1].renderOrder = 2;
}
/* — on the robe body: chest, waist, skirt, low sides — */
bodyPatch( 0.62, 1.47, 'ankh');
bodyPatch(-0.62, 1.47, 'feather', 0.145, 0.205);
bodyPatch( 0.66, 1.12, 'eye');
bodyPatch(-0.66, 1.12, 'ouroboros');
bodyPatch( 0.60, 0.78, 'yinyang');
bodyPatch(-0.60, 0.78, 'scarab');
bodyPatch( 0.97, 0.45, 'crescent', 0.155, 0.175);
/* — sacred geometry linework + the moon, on the robe's flanks — */
bodyPatch( 0.99, 1.03, 'seed');
bodyPatch(-0.99, 1.03, 'triquetra');
bodyPatch(-0.97, 0.45, 'moon', 0.150, 0.172);
/* — down the two front falls — */
fallPatch( 1, 0.006, 0.150, 'om');
fallPatch( 1, 0.253, 0.397, 'star');
fallPatch( 1, 0.500, 0.644, 'valknut');
fallPatch( 1, 0.720, 0.864, 'starp');
fallPatch(-1, 0.006, 0.150, 'fol');
fallPatch(-1, 0.253, 0.397, 'mjolnir');
fallPatch(-1, 0.500, 0.644, 'unalome');
fallPatch(-1, 0.720, 0.864, 'moon');
/* — on the cascade sleeve fall — */
cascadePatch('triskele');

/* — bench v2: the goldwork DENSIFIES. The back carries the great
   medallion and the moon-phase row of the turnaround; the flanks
   gain signs; the falls gain the small signs between the great
   ones, so no stretch of cloth is left unworked — */
bodyPatch( Math.PI, 1.00, 'fol', 0.37, 0.37);
bodyPatch( Math.PI - 0.44, 1.44, 'moon', 0.125, 0.145);
bodyPatch( Math.PI, 1.465, 'crescent', 0.135, 0.155);
bodyPatch( Math.PI + 0.44, 1.44, 'moon', 0.125, 0.145);
bodyPatch( 1.50, 0.60, 'starp', 0.15, 0.17);
bodyPatch(-1.50, 0.60, 'seed', 0.15, 0.17);
bodyPatch( 2.35, 0.95, 'eye', 0.15, 0.17);
bodyPatch(-2.35, 0.95, 'ankh', 0.14, 0.18);
bodyPatch( 1.32, 1.30, 'feather', 0.13, 0.19);
bodyPatch(-1.32, 1.30, 'eye', 0.15, 0.17);
fallPatch( 1, 0.155, 0.248, 'moon');
fallPatch( 1, 0.648, 0.718, 'star');
fallPatch(-1, 0.155, 0.248, 'crescent');
fallPatch(-1, 0.648, 0.718, 'moon');

/* ---------- hands — articulated, bone by bone (bench v2) ----------
   Carter countered v1's hands as crude at close zoom: tubes with
   ball palms. These are built joint by joint — every finger a chain
   of three segments with a knuckle sphere a shade proud at each
   joint, the palm a body with heel and two mounds, the fingers long
   and gaunt as the turnaround draws them.                        */
function segBone(a, b, r0, r1, group){
  tubeAlong([a, lerpPt(a, b, 0.5), b], t=> r0 + (r1 - r0)*t,
    { segs:6, radial:10, mat:skinMat, group:group });
}
/* PRODUCTION PASS 1 — finished hands (order must 2). The bench hands
   were jointed but mannequin-smooth. Each finger now carries a nail on
   its back (the side away from the palm, `dorsal`), and every bending
   joint a crease ring a shade darker than the skin; the raised right
   palm, which faces the visitor, carries its three main lines.       */
const nailMat = new THREE.MeshStandardMaterial({
  color: 0xa89078, metalness: 0.0, roughness: 0.34, envMapIntensity: 0.55
});
const creaseMat = new THREE.MeshStandardMaterial({
  color: 0x5a4632, metalness: 0.0, roughness: 0.8, envMapIntensity: 0.2
});
const _fwd = new THREE.Vector3(), _up = new THREE.Vector3(), _side = new THREE.Vector3(), _m4 = new THREE.Matrix4();
function frameAt(a, b, dorsal){
  _fwd.set(b[0]-a[0], b[1]-a[1], b[2]-a[2]).normalize();
  _up.set(dorsal[0], dorsal[1], dorsal[2]).addScaledVector(_fwd, -_fwd.dot(_up));
  if (_up.lengthSq() < 1e-6) _up.set(0, 0, 1).cross(_fwd);
  _up.normalize();
  _side.crossVectors(_up, _fwd).normalize();
  return _m4.makeBasis(_side, _fwd, _up);
}
/* a flexion crease: a fine half-ring pressed into the PALM side of a
   finger (the side away from `dorsal`), where skin folds as it bends */
function crease(at, a, b, r, dorsal, group){
  const arc = new THREE.Mesh(new THREE.TorusGeometry(r*0.985, r*0.06, 5, 14, Math.PI*0.8), creaseMat);
  arc.quaternion.setFromRotationMatrix(frameAt(a, b, dorsal));
  arc.rotateX(Math.PI/2);             /* torus axis along the finger; arc's middle on the back */
  arc.rotateZ(Math.PI*1.1);           /* ...turned round to the palm side */
  arc.position.set(at[0], at[1], at[2]);
  group.add(arc);
}
function fingerChain(pts, r0, r1, group, dorsal){
  r0 *= 1.15; r1 *= 1.15;
  const n = pts.length - 1;
  for (let i=0;i<n;i++){
    const ta = i/n, tb = (i+1)/n;
    const ra = r0 + (r1-r0)*ta, rb = r0 + (r1-r0)*tb;
    ball(ra*1.05, ra*1.0, ra*1.05, pts[i][0], pts[i][1], pts[i][2], skinMat, group);
    segBone(pts[i], pts[i+1], ra, rb, group);
    /* a crease just either side of each bending joint, where skin folds */
    if (dorsal && i > 0){
      crease(lerpPt(pts[i], pts[i-1], 0.20), pts[i-1], pts[i], ra*1.0, dorsal, group);
      crease(lerpPt(pts[i], pts[i+1], 0.20), pts[i], pts[i+1], ra*0.99, dorsal, group);
    }
  }
  const tip = pts[n];
  ball(r1*1.0, r1*0.92, r1*1.02, tip[0], tip[1], tip[2], skinMat, group);
  if (dorsal){
    /* the nail: a thin shell on the back of the last segment, its free
       edge reaching just short of the tip */
    const a = pts[n-1], b = tip;
    const nail = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), nailMat);
    nail.quaternion.setFromRotationMatrix(frameAt(a, b, dorsal));
    nail.scale.set(r1*0.78, r1*1.25, r1*0.30);
    const L = Math.hypot(b[0]-a[0], b[1]-a[1], b[2]-a[2]);
    const at = lerpPt(a, b, Math.max(0.35, 1 - (r1*1.05)/L));
    nail.position.set(at[0] + _up.x*r1*0.80, at[1] + _up.y*r1*0.80, at[2] + _up.z*r1*0.80);
    group.add(nail);
  }
}
/* a line pressed into a palm ellipsoid's front (+z) face */
function palmLine(pts2, c, R, group){
  const pts = pts2.map(([x, y])=>{
    const q = 1 - Math.pow((x-c[0])/R[0], 2) - Math.pow((y-c[1])/R[1], 2);
    return [x, y, c[2] + R[2]*Math.sqrt(Math.max(0.02, q)) + 0.0005];
  });
  tubeAlong(pts, t=> 0.00048*(0.55 + 0.45*Math.sin(Math.PI*t)), { segs:16, radial:5, mat:creaseMat, group:group });
}
/* RIGHT HAND — raised, open, thumb tip on index tip (the teaching
   sign) — his RIGHT hand, in every view */
{
  const hand = new THREE.Group();
  hand.position.set(-0.334, 1.508, 0.118);
  hand.rotation.set(-0.12, 0.22, -0.18);
  hand.scale.setScalar(1.36);
  statue.add(hand);
  /* the palm — body, heel, thenar and hypothenar mounds */
  ball(0.031, 0.040, 0.0145, 0, 0.016, 0, skinMat, hand);
  ball(0.027, 0.020, 0.0125, 0, -0.014, 0.001, skinMat, hand);
  ball(0.0165, 0.025, 0.011, 0.020, 0.002, 0.004, skinMat, hand);
  ball(0.013, 0.023, 0.010, -0.019, 0.006, 0.003, skinMat, hand);
  const RD = [0, 0, -1];   /* back of the raised hand faces away from the visitor */
  /* index — rises, then bends down-in so its tip meets the thumb */
  fingerChain([[0.0175,0.046,0.002],[0.0210,0.072,0.005],[0.0165,0.092,0.012],[0.0070,0.0995,0.0185]], 0.0064, 0.0040, hand, RD);
  /* middle — the longest, near straight, the tip easing back */
  fingerChain([[0.0060,0.049,0.000],[0.0068,0.080,0.002],[0.0060,0.102,0.004],[0.0050,0.1115,0.0025]], 0.0064, 0.0039, hand, RD);
  /* ring */
  fingerChain([[-0.0058,0.048,-0.001],[-0.0072,0.077,0.001],[-0.0084,0.0955,0.003],[-0.0092,0.1015,0.0018]], 0.0061, 0.0038, hand, RD);
  /* little finger */
  fingerChain([[-0.0168,0.044,-0.001],[-0.0202,0.0665,0.001],[-0.0218,0.0805,0.0025],[-0.0226,0.0860,0.0012]], 0.0056, 0.0035, hand, RD);
  /* thumb — sweeps up and in, its tip resting on the index tip */
  fingerChain([[0.0268,0.004,0.003],[0.0335,0.031,0.010],[0.0240,0.061,0.0165],[0.0076,0.0988,0.0188]], 0.0074, 0.0048, hand, RD);
  /* the palm's three lines, on the face the visitor sees */
  const PC = [0, 0.016, 0], PR = [0.031, 0.040, 0.0145];
  palmLine([[-0.027,0.034],[-0.012,0.036],[0.004,0.039],[0.016,0.043]], PC, PR, hand);   /* heart */
  palmLine([[-0.026,0.022],[-0.010,0.025],[0.006,0.027],[0.019,0.032]], PC, PR, hand);   /* head */
  palmLine([[0.020,0.036],[0.011,0.022],[0.008,0.006],[0.011,-0.010]], PC, PR, hand);    /* life, round the thumb's mound */
}
/* LEFT HAND — resting open at his side, fingers relaxed, curling a
   little toward the robe (nothing carried — the pole stays struck) */
{
  const hand = new THREE.Group();
  hand.position.set(0.346, 0.884, 0.078);
  hand.rotation.set(0.06, -0.15, 0.10);
  hand.scale.setScalar(1.22);
  statue.add(hand);
  const LD = [1, 0, 0];   /* palm turned to the robe; the back of the hand faces out */
  ball(0.0125, 0.036, 0.030, 0, 0, 0, skinMat, hand);
  ball(0.0115, 0.019, 0.025, 0.002, 0.033, 0, skinMat, hand);
  ball(0.0095, 0.020, 0.020, 0.004, -0.006, 0.020, skinMat, hand);
  const fLen = [0.050, 0.058, 0.053, 0.043];
  for (let f=0; f<4; f++){
    const zB = -0.0165 + f*0.011, L = fLen[f];
    fingerChain([[0, -0.028, zB],
                 [-0.0015, -0.028 - L*0.38, zB + 0.0008],
                 [-0.0052, -0.028 - L*0.74, zB + 0.0018],
                 [-0.0108, -0.028 - L*0.99, zB + 0.0026]], 0.0059, 0.0039, hand, LD);
  }
  /* thumb resting along the palm's front edge */
  fingerChain([[0.005,-0.002,0.025],[0.002,-0.020,0.0245],[-0.003,-0.034,0.021],[-0.0075,-0.0435,0.0165]], 0.0068, 0.0046, hand, LD);
}

/* ---------- hood + the shadow that is his face ---------- */
{
  /* the void — unlit black, so the shadow never lifts */
  ball(0.098, 0.118, 0.100, 0, 1.735, -0.004, voidMat, statue);
  ball(0.072, 0.098, 0.068, 0, 1.728, 0.048, voidMat, statue);
  ball(0.075, 0.100, 0.075, 0, 1.800, 0.005, voidMat, statue);
  /* the hood shell — open at the front (th=0 is +z; the covered arc
     runs 0.72..2PI-0.72, leaving the face wedge open), flaring out
     over the shoulders at its hem */
  const hoodProf = profFn([[1.545,0.200],[1.62,0.172],[1.70,0.150],[1.78,0.133],[1.86,0.100],[1.92,0.046]]);
  latheTex({ ny:44, nth:72, thStart:0.72, thLen:Math.PI*2 - 1.44,
    yFn:t=>1.545 + t*0.375,
    rFn:hoodProf,
    ellipse:[1,1.04],
    modFn:(th,y)=>{
      let off = 0.0042*Math.sin(th*22 + y*8)
        - 0.010*Math.exp(-Math.pow(angDiff(th, 2.75)/0.16, 2)) * sstep(1.60, 1.70, y)
        - 0.010*Math.exp(-Math.pow(angDiff(th, -2.75)/0.16, 2)) * sstep(1.60, 1.70, y);
      const dEdge = Math.min(Math.abs(angDiff(th, 0.72)), Math.abs(angDiff(th, -0.72)));
      const edge = 1 - sstep(0.0, 0.30, dEdge);
      off += 0.006*edge;
      return [off, 1 - 0.30*edge - 0.10*sstep(1.80,1.92,y)];
    },
    capTop:1.925, uRep:2, vScale:0.35, vOff:0.18, mat:clothMat, group:statue });
  /* the hood's BOUND EDGE — a worn gold cord sewn along each side of
     the opening, a dark cord inside it: the hood is finished, not
     cut (v1 counter: unfinished hood edge) */
  for (const sdE of [0.72, -0.72]){
    const cPts = [], cPts2 = [];
    for (let iE=0;iE<=10;iE++){
      const yE = 1.545 + (1.912 - 1.545)*(iE/10);
      const rE = hoodProf(yE) + 0.0135;
      cPts.push([Math.sin(sdE)*rE, yE, Math.cos(sdE)*rE*1.04]);
      cPts2.push([Math.sin(sdE)*(rE - 0.006), yE, Math.cos(sdE)*(rE - 0.006)*1.04]);
    }
    tubeAlong(cPts, t=>0.0072 - 0.0012*t, { segs:24, radial:8, mat:trimMat, group:statue });
    tubeAlong(cPts2, t=>0.0042, { segs:24, radial:8, mat:clothDarkMat, group:statue });
  }
}

/* ---------- THE HALO DISC — moon phases, geometry, gold rim ---------- */
{
  const haloTex = makeHalo();
  const faceMatH = new THREE.MeshStandardMaterial({
    map: haloTex, metalness: 0.22, roughness: 0.55, envMapIntensity: 0.35
  });
  const backMatH = new THREE.MeshStandardMaterial({
    map: haloTex, color: 0x8f7648, metalness: 0.4, roughness: 0.7, envMapIntensity: 0.3
  });
  const sideMatH = new THREE.MeshStandardMaterial({
    color: 0x6d5326, metalness: 0.6, roughness: 0.45, envMapIntensity: 0.5
  });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.40, 0.030, 72),
    [sideMatH, faceMatH, backMatH]);
  disc.rotation.x = Math.PI/2;
  disc.position.set(0, 1.82, -0.200);
  statue.add(disc);
  /* the rim — antique gold carrying the FAINTEST muted spectrum: an
     iridescent echo of the reference's rainbow edge, desaturated deep
     into the Archives palette (saturation 0.32, pulled 80% toward pale
     gold) so it reads as coloured metal, never as colour. FLAGGED for
     Carter's eye in the build note — his palette order governs. */
  const ringGeo = new THREE.TorusGeometry(0.40, 0.017, 12, 160);
  const ring = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({
    color: 0x9a7b38, metalness: 0.55, roughness: 0.42, envMapIntensity: 0.6
  }));
  ring.position.copy(disc.position);
  statue.add(ring);
  /* a fine gold ring just inside the rim */
  const gring = new THREE.Mesh(new THREE.TorusGeometry(0.378, 0.0035, 8, 96), trimMat);
  gring.position.copy(disc.position);
  statue.add(gring);
  /* a raised ring standing proud of the face — cast metal relief,
     so the disc reads as a solid object with weight (bench v2) */
  const bead2 = new THREE.Mesh(new THREE.TorusGeometry(0.295, 0.006, 8, 96), trimMat);
  bead2.position.set(0, 1.82, -0.200 + 0.018);
  statue.add(bead2);
}

/* ---------- BARE FEET — stepping out from under the pooling hem,
   toes forward on the plinth (restored for v1, per tonight's spec) -- */
for (const sd of [1, -1]){
  const foot = new THREE.Group();
  foot.position.set(sd * 0.088, 0, 0.300);
  foot.rotation.y = -sd * 0.07;
  statue.add(foot);
  const fb = ball(0.037, 0.021, 0.088, 0, 0.020, 0.028, skinMat, foot);
  fb.rotation.x = 0.05;
  ball(0.030, 0.026, 0.034, 0, 0.040, -0.038, skinMat, foot);   /* ankle rising into the hem */
  /* five toes along the front edge, largest toward the centreline */
  const toeR = [0.0115, 0.0102, 0.0092, 0.0082, 0.0072];
  for (let tI = 0; tI < 5; tI++){
    const tx = -sd * (0.0245 - tI * 0.0122);
    ball(toeR[tI], toeR[tI] * 0.78, toeR[tI] * 1.25,
         tx, 0.0115, 0.108 - Math.abs(tI - 0.6) * 0.0035, skinMat, foot);
  }
}

/* ================= THE RAVEN — his companion (design §9) ============
   A raven, perched on a rough stone at his left side on the plinth's
   top step. Dark plumage with a muted bronze sheen — Archives palette
   only. It stands turned toward the keeper and the visitor, as if it
   has just come back with something to tell him.                  */
{
  const perch = new THREE.Group();
  perch.position.set(0.358, 0, 0.190);
  statue.add(perch);
  /* the stone — rough, low, dark museum stone */
  const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.108, 0), baseMat);
  stone.scale.set(1.15, 0.78, 1.00);
  stone.position.y = 0.055;
  stone.rotation.set(0.15, 0.7, 0.06);
  perch.add(stone);

  const raven = new THREE.Group();
  raven.position.set(0, 0.128, 0);
  raven.rotation.y = -0.38;
  raven.scale.setScalar(1.60);
  perch.add(raven);
  const plumMat  = new THREE.MeshStandardMaterial({ color: 0x231a0e, metalness: 0.35, roughness: 0.48, envMapIntensity: 0.95 });
  const plumDark = new THREE.MeshStandardMaterial({ color: 0x110d07, metalness: 0.20, roughness: 0.60, envMapIntensity: 0.65 });
  const sheenMat = new THREE.MeshStandardMaterial({ color: 0x35260f, metalness: 0.65, roughness: 0.32, envMapIntensity: 1.45 });
  const hornMat  = new THREE.MeshStandardMaterial({ color: 0x0d0b08, metalness: 0.10, roughness: 0.36, envMapIntensity: 0.7 });
  const eyeMat   = new THREE.MeshStandardMaterial({ color: 0x070505, metalness: 0.30, roughness: 0.12, envMapIntensity: 1.7 });
  const legMat   = new THREE.MeshStandardMaterial({ color: 0x241a10, metalness: 0.05, roughness: 0.8, envMapIntensity: 0.3 });
  /* legs + gripping feet */
  for (const sd of [1, -1]){
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.0052, 0.0046, 0.062, 8), legMat);
    leg.position.set(sd * 0.019, 0.030, 0.004);
    raven.add(leg);
    ball(0.013, 0.0055, 0.019, sd * 0.019, 0.004, 0.008, legMat, raven);
    for (let tI = 0; tI < 3; tI++){
      const ta = (tI - 1) * 0.5;
      ball(0.0042, 0.0038, 0.0095, sd * 0.019 + Math.sin(ta) * 0.010, 0.003, 0.020 + Math.cos(ta) * 0.004, legMat, raven);
    }
    ball(0.0042, 0.0038, 0.008, sd * 0.019, 0.003, -0.008, legMat, raven);  /* back toe */
  }
  /* body — breast high, sloping back to the tail */
  const body = ball(0.052, 0.058, 0.084, 0, 0.098, -0.006, plumMat, raven);
  body.rotation.x = -0.38;
  /* throat hackles with the sheen */
  const breast = ball(0.044, 0.050, 0.046, 0, 0.104, 0.034, sheenMat, raven);
  breast.rotation.x = -0.30;
  /* throat hackles — the shaggy neck feathers of an old, weathered
     bird (bench v2: ancient, but strong and cunning) */
  for (let hI=0; hI<5; hI++){
    const hk = new THREE.Mesh(new THREE.ConeGeometry(0.006, 0.030, 6), plumDark);
    hk.position.set((hI-2)*0.009, 0.082 - Math.abs(hI-2)*0.004, 0.062);
    hk.rotation.x = Math.PI + 0.5;
    raven.add(hk);
  }
  /* folded wings hugging the flanks */
  for (const sd of [1, -1]){
    const w = ball(0.016, 0.054, 0.088, sd * 0.047, 0.096, -0.014, plumDark, raven);
    w.rotation.x = -0.30; w.rotation.z = sd * 0.10;
    const w2 = ball(0.008, 0.034, 0.058, sd * 0.056, 0.100, -0.020, sheenMat, raven);
    w2.rotation.x = -0.30; w2.rotation.z = sd * 0.10;
  }
  /* tail — two fanned, flattened feathers angled down behind */
  for (const [wd, ln, fa] of [[0.052, 0.150, -0.07], [0.060, 0.135, 0.07]]){
    const tail = new THREE.Mesh(new THREE.BoxGeometry(wd, 0.0075, ln), plumDark);
    tail.position.set(Math.sin(fa) * 0.03, 0.046, -0.112);
    tail.rotation.set(0.46, fa, 0);
    raven.add(tail);
  }
  /* neck — lifts the head clear of the body so the profile reads */
  const neck = ball(0.027, 0.036, 0.028, 0, 0.140, 0.046, plumMat, raven);
  neck.rotation.x = -0.25;
  /* head + the great beak */
  ball(0.036, 0.038, 0.040, 0, 0.180, 0.060, plumMat, raven);
  ball(0.026, 0.024, 0.026, 0, 0.168, 0.046, sheenMat, raven);   /* crown sheen */
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.0145, 0.100, 12), hornMat);
  beak.position.set(0, 0.176, 0.128);
  beak.rotation.x = Math.PI/2 + 0.22;
  raven.add(beak);
  const beakLow = new THREE.Mesh(new THREE.ConeGeometry(0.0115, 0.068, 12), hornMat);
  beakLow.position.set(0, 0.164, 0.118);
  beakLow.rotation.x = Math.PI/2 + 0.40;
  raven.add(beakLow);
  /* eyes — dark, with a glint from the room light */
  ball(0.0072, 0.0072, 0.0072,  0.0215, 0.187, 0.082, eyeMat, raven);
  ball(0.0072, 0.0072, 0.0072, -0.0215, 0.187, 0.082, eyeMat, raven);
}

/* ================= THE WAKE — death and renewal (bench v2) ======
   The checklist's nature, built at last: where he has passed the
   earth is withered; where his step has left, it blooms again. A
   painted trail runs from the dead ground behind his right hand,
   feathering at its tide-mark into living green before his left —
   withered twigs stand on the dead side, living sprigs with small
   ivory buds on the renewed side, dead leaves scattered between. */
{
  const W = 1024;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = W;
  const c = cv.getContext('2d');
  let seed = 777;
  const rnd = ()=>{ seed = (seed*16807) % 2147483647; return seed/2147483647; };
  const fr2 = (a, b)=>{ const x = Math.sin(a*91.7 + b*57.3)*43758.5453; return x - Math.floor(x); };
  c.fillStyle = '#16110a'; c.fillRect(0, 0, W, W);
  for (let i=0;i<5200;i++){
    c.fillStyle = rnd() < 0.5 ? 'rgba(0,0,0,0.16)' : 'rgba(214,188,138,0.05)';
    c.fillRect(rnd()*W, rnd()*W, 2.2, 1.6);
  }
  /* canvas mapping: PX world x -> u; PZ world z -> row
     (CircleGeometry uv: u from local x, row from local -y -> world z) */
  const PX = x => (x/5.2 + 0.5) * W;
  const PZ = z => (0.5 + z/5.2) * W;
  const stamp = (x, z, r, col, al)=>{
    const g = c.createRadialGradient(PX(x), PZ(z), 0, PX(x), PZ(z), r);
    g.addColorStop(0, col.replace('A', al.toFixed(3)));
    g.addColorStop(1, col.replace('A', '0'));
    c.fillStyle = g;
    c.fillRect(PX(x)-r, PZ(z)-r, r*2, r*2);
  };
  /* PRODUCTION PASS 1 — the wake in the ground itself (order must 3).
     On the bench the sweep lived mostly in the sprigs and read quietly
     at full-figure distance. Here the earth is painted pixel by pixel
     from one field: withered, bleached and cracked on his right (-x),
     living green on his left (+x), the line between them feathered by
     noise like a tide mark, never a hard split, strongest close to him
     and dying away into the room's floor.                             */
  {
    const img = c.getImageData(0, 0, W, W), D = img.data;
    const vn = (x, z)=>{                       /* smooth value noise */
      const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
      const u = xf*xf*(3-2*xf), v = zf*zf*(3-2*zf);
      const a = fr2(xi, zi), b = fr2(xi+1, zi), cc = fr2(xi, zi+1), d = fr2(xi+1, zi+1);
      return a + (b-a)*u + (cc-a)*v + (a-b-cc+d)*u*v;
    };
    const fbm = (x, z)=> vn(x, z)*0.55 + vn(x*2.1+7.3, z*2.1-3.1)*0.28 + vn(x*4.3-2.2, z*4.3+5.4)*0.17;
    const DEAD = [74, 58, 36], DEAD2 = [112, 96, 70], LIVE = [46, 72, 30], LIVE2 = [70, 96, 40];
    for (let py=0; py<W; py++){
      const z = (py/W - 0.5)*5.2;
      for (let px=0; px<W; px++){
        const x = (px/W - 0.5)*5.2;
        const r = Math.hypot(x, z);
        const reach = 1 - sstep(0.9, 2.45, r);          /* strongest near him */
        if (reach <= 0) continue;
        const n = fbm(x*1.7, z*1.7);
        /* the tide line wanders with the noise, so it feathers */
        const life = sstep(-0.30, 0.30, x + 0.10 + (n - 0.5)*0.95 - 0.12*z);
        const grain = fbm(x*9.0, z*9.0);
        const dead = [DEAD[0] + (DEAD2[0]-DEAD[0])*grain, DEAD[1] + (DEAD2[1]-DEAD[1])*grain, DEAD[2] + (DEAD2[2]-DEAD[2])*grain];
        const live = [LIVE[0] + (LIVE2[0]-LIVE[0])*grain, LIVE[1] + (LIVE2[1]-LIVE[1])*grain, LIVE[2] + (LIVE2[2]-LIVE[2])*grain];
        const k = 0.80 * reach;
        const i = (py*W + px)*4;
        for (let ch=0; ch<3; ch++){
          const tgt = dead[ch] + (live[ch] - dead[ch])*life;
          D[i+ch] = D[i+ch] + (tgt - D[i+ch])*k;
        }
      }
    }
    c.putImageData(img, 0, 0);
    /* cracks in the dead earth: dark, branching, only on his right */
    c.lineCap = 'round';
    for (let k=0; k<46; k++){
      let x = -0.35 - rnd()*1.9, z = (rnd()-0.5)*3.6;
      if (Math.hypot(x, z) > 2.3) continue;
      let a = rnd()*Math.PI*2;
      c.strokeStyle = 'rgba(22,15,8,' + (0.45 + rnd()*0.3).toFixed(2) + ')';
      c.lineWidth = 0.9 + rnd()*1.3;
      c.beginPath(); c.moveTo(PX(x), PZ(z));
      const steps = 4 + Math.floor(rnd()*6);
      for (let st=0; st<steps; st++){
        a += (rnd()-0.5)*1.3; x += Math.cos(a)*0.07; z += Math.sin(a)*0.07;
        if (x > -0.15) break;
        c.lineTo(PX(x), PZ(z));
      }
      c.stroke();
    }
    /* grass on the living side: short strokes leaning together */
    for (let k=0; k<5200; k++){
      const x = 0.05 + rnd()*2.2, z = (rnd()-0.5)*4.0;
      const rr = Math.hypot(x, z);
      if (rr > 2.35 || rnd() > 1 - sstep(0.9, 2.35, rr)) continue;
      const g = 70 + Math.floor(rnd()*60);
      c.strokeStyle = 'rgba(' + Math.floor(g*0.62) + ',' + g + ',' + Math.floor(g*0.38) + ',' + (0.35 + rnd()*0.35).toFixed(2) + ')';
      c.lineWidth = 1 + rnd()*0.8;
      const lean = 0.5 + (rnd()-0.5)*0.6;
      c.beginPath(); c.moveTo(PX(x), PZ(z));
      c.lineTo(PX(x) + Math.cos(lean)*5, PZ(z) - Math.sin(lean)*5 - 3); c.stroke();
    }
  }
  /* the trail: dead browns behind, greening as it comes forward */
  const path = [[-2.3,-1.9],[-1.55,-1.25],[-1.02,-0.72],[-0.80,-0.10],[-0.72,0.45],[-0.30,0.86],[0.35,0.98],[0.95,0.82],[1.55,0.45]];
  const N = 300;
  for (let i=0;i<N;i++){
    const t = i/(N-1), ft = t*(path.length-1), i0 = Math.min(Math.floor(ft), path.length-2), fu = ft-i0;
    const pa = path[i0], pb = path[i0+1];
    const x = pa[0] + (pb[0]-pa[0])*fu + (rnd()-0.5)*0.36;
    const z = pa[1] + (pb[1]-pa[1])*fu + (rnd()-0.5)*0.36;
    const r = (0.20 + rnd()*0.16) * (W/5.2);
    const col = t < 0.42 ? 'rgba(96,74,40,A)' : (t < 0.62 ? 'rgba(110,102,52,A)' : 'rgba(84,102,44,A)');
    stamp(x, z, r, col, 0.20 + rnd()*0.18);
  }
  /* the withered ground pooled at his feet */
  for (let i=0;i<130;i++){
    const a = rnd()*Math.PI*2, rr = 0.55 + rnd()*0.55;
    stamp(Math.cos(a)*rr - 0.18, Math.sin(a)*rr - 0.10, (0.10 + rnd()*0.20) * (W/5.2), 'rgba(88,66,34,A)', 0.17);
  }
  /* renewal pooled before his left — green rising, flowers opening */
  for (let i=0;i<170;i++){
    const a = rnd()*Math.PI*2, rr = 0.55 + rnd()*0.8;
    const x = Math.cos(a)*rr + 0.30, z = Math.sin(a)*rr + 0.25;
    stamp(x, z, (0.08 + rnd()*0.18) * (W/5.2), 'rgba(92,112,48,A)', 0.20);
    if (rnd() < 0.38){
      c.fillStyle = 'rgba(232,213,168,0.75)';
      c.beginPath(); c.arc(PX(x), PZ(z), 2.1, 0, Math.PI*2); c.fill();
    }
  }
  /* feather the disc's rim into the room's dark floor */
  {
    const g = c.createRadialGradient(W/2, W/2, W*0.30, W/2, W/2, W*0.5);
    g.addColorStop(0, 'rgba(10,8,6,0)');
    g.addColorStop(1, 'rgba(10,8,6,0.92)');
    c.fillStyle = g; c.fillRect(0, 0, W, W);
  }
  const wakeTex = new THREE.CanvasTexture(cv);
  wakeTex.colorSpace = THREE.SRGBColorSpace;
  wakeTex.anisotropy = 8;
  const wake = new THREE.Mesh(new THREE.CircleGeometry(2.6, 56),
    new THREE.MeshStandardMaterial({ map: wakeTex, roughness: 1, metalness: 0, envMapIntensity: 0.15 }));
  wake.rotation.x = -Math.PI/2; wake.position.y = 0.004;
  fixed.add(wake);

  const twigMat = new THREE.MeshStandardMaterial({ color: 0x4c3a22, roughness: 1, metalness: 0 });
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x44512a, roughness: 0.95, metalness: 0 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x5c6c33, roughness: 0.9, metalness: 0, side: THREE.DoubleSide, envMapIntensity: 0.25 });
  const budMat  = new THREE.MeshStandardMaterial({ color: 0xe6d3a0, roughness: 0.6, metalness: 0, envMapIntensity: 0.4 });
  function deadSprig(x, z, s){
    const g = new THREE.Group(); g.position.set(x, 0.004, z); g.scale.setScalar(s); fixed.add(g);
    for (let bI=0;bI<3;bI++){
      const h = 0.10 + fr2(bI, x)*0.07;
      const tw = new THREE.Mesh(new THREE.CylinderGeometry(0.0016, 0.0035, h, 5), twigMat);
      tw.position.set((bI-1)*0.012, h/2, (bI%2)*0.010 - 0.005);
      tw.rotation.z = (bI-1)*0.35; tw.rotation.x = (bI%2 ? -0.15 : 0.12);
      g.add(tw);
      const tw2 = new THREE.Mesh(new THREE.CylinderGeometry(0.0009, 0.0016, h*0.5, 5), twigMat);
      tw2.position.set((bI-1)*0.012 + (bI-1)*0.016, h*0.78, (bI%2)*0.010 - 0.005);
      tw2.rotation.z = (bI-1)*0.8;
      g.add(tw2);
    }
  }
  function liveSprig(x, z, s, bud){
    const g = new THREE.Group(); g.position.set(x, 0.004, z); g.scale.setScalar(s); fixed.add(g);
    const h = 0.085 + fr2(z, x)*0.05;
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0030, h, 5), stemMat);
    st.position.y = h/2; st.rotation.z = (fr2(x, z)-0.5)*0.3; g.add(st);
    for (let lI=0;lI<5;lI++){
      const lf = new THREE.Mesh(new THREE.PlaneGeometry(0.027, 0.054), leafMat);
      const aa = lI/5*Math.PI*2 + x;
      lf.position.set(Math.cos(aa)*0.012, h*(0.45 + 0.11*lI), Math.sin(aa)*0.012);
      lf.rotation.set(-0.7 - fr2(lI, x)*0.4, aa, 0);
      g.add(lf);
    }
    if (bud) ball(0.0075, 0.0095, 0.0075, 0.004, h + 0.012, 0, budMat, g);
  }
  for (const d of [[-0.66,0.30,1.0],[-0.78,-0.28,1.2],[-0.58,-0.62,0.9],[-1.05,-0.85,1.3],[-1.45,-1.15,1.1],[-0.52,0.66,0.8],[-1.9,-1.6,1.4]])
    deadSprig(d[0], d[1], d[2]);
  for (const d of [[0.66,0.38,1.0,true],[0.78,-0.30,1.15,false],[0.62,0.74,0.9,true],[1.05,0.62,1.25,true],[1.5,0.42,1.1,false],[0.50,-0.70,0.95,false],[0.95,1.0,1.0,true]])
    liveSprig(d[0], d[1], d[2], d[3]);
  /* PRODUCTION PASS 1 — the ground's own growth, at the scale that reads
     from across the room: a field of living blades on his left and of
     bent, bleached stalks on his right, thinning toward the tide line
     and toward the rim. Two instanced meshes, so it stays cheap. */
  {
    const blade = new THREE.BufferGeometry();
    blade.setAttribute('position', new THREE.Float32BufferAttribute([-0.004,0,0, 0.004,0,0, 0.0005,1,0.12], 3));
    blade.setIndex([0,1,2]); blade.computeVertexNormals();
    const liveBladeMat = new THREE.MeshStandardMaterial({ color: 0x55702c, roughness: 0.9, metalness: 0, side: THREE.DoubleSide, envMapIntensity: 0.25 });
    const deadBladeMat = new THREE.MeshStandardMaterial({ color: 0x6e5a3a, roughness: 1, metalness: 0, side: THREE.DoubleSide, envMapIntensity: 0.2 });
    const NL = 900, ND = 650;
    const liveI = new THREE.InstancedMesh(blade, liveBladeMat, NL);
    const deadI = new THREE.InstancedMesh(blade, deadBladeMat, ND);
    const o = new THREE.Object3D(), tint = new THREE.Color();
    let li = 0, di = 0, guard = 0;
    while ((li < NL || di < ND) && guard++ < 40000){
      const x = (rnd()-0.5)*4.4, z = (rnd()-0.5)*4.4, r = Math.hypot(x, z);
      if (r < 0.50 || r > 2.2) continue;                 /* not under the plinth */
      const thin = 1 - sstep(1.2, 2.2, r);
      if (rnd() > thin) continue;
      const side = x + 0.10 + (fr2(x*3.1, z*3.1) - 0.5)*0.5 - 0.12*z;
      if (Math.abs(side) < 0.12 && rnd() < 0.6) continue; /* the tide line stays bare-ish */
      o.position.set(x, 0.004, z);
      o.rotation.set(0, rnd()*Math.PI*2, 0);
      if (side > 0 && li < NL){
        const h = 0.04 + rnd()*0.07;
        o.scale.set(1, h, 1);
        o.rotateX((rnd()-0.5)*0.35);
        o.updateMatrix(); liveI.setMatrixAt(li, o.matrix);
        liveI.setColorAt(li, tint.setHSL(0.24 + rnd()*0.05, 0.38, 0.55 + rnd()*0.3));
        li++;
      } else if (side <= 0 && di < ND){
        const h = 0.025 + rnd()*0.05;
        o.scale.set(1, h, 1);
        o.rotateX(0.9 + rnd()*0.6);                      /* bent over, spent */
        o.updateMatrix(); deadI.setMatrixAt(di, o.matrix);
        deadI.setColorAt(di, tint.setHSL(0.09 + rnd()*0.02, 0.30, 0.6 + rnd()*0.35));
        di++;
      }
    }
    liveI.count = li; deadI.count = di;
    fixed.add(liveI, deadI);
  }
  /* fallen dead leaves scattered on the dead side of the ground */
  const leafDeadMat = new THREE.MeshStandardMaterial({ color: 0x54401f, roughness: 1, metalness: 0, side: THREE.DoubleSide });
  for (let i2=0;i2<16;i2++){
    const lf = new THREE.Mesh(new THREE.PlaneGeometry(0.020, 0.030), leafDeadMat);
    lf.position.set(-(0.58 + fr2(i2, 3)*0.55), 0.0065, (fr2(i2, 5)-0.5)*1.15);
    lf.rotation.set(-Math.PI/2 + (fr2(i2, 7)-0.5)*0.5, 0, fr2(i2, 9)*Math.PI);
    fixed.add(lf);
  }
}

/* ---------- controls: Y-only rotation, tilt locked, no auto-rotate ---- */
let rotY = 0, dist = 3.85, targetY = 1.25, camY = null, lockTarget = false, camX = 0;
if (frag.indexOf('nails') >= 0){ rotY = Math.PI - 0.55; dist = 0.62; targetY = 1.80; camX = 0.42; camY = 1.72; lockTarget = true; }
else if (frag.indexOf('lhand') >= 0){ rotY = -1.2; dist = 0.90; targetY = 1.10; camX = 0.05; lockTarget = true; }
else if (frag.indexOf('tq') >= 0){ rotY = -0.65; }
else if (frag.indexOf('side') >= 0){ rotY = -Math.PI/2; }
else if (frag.indexOf('back') >= 0){ rotY = Math.PI; }
else if (frag.indexOf('face') >= 0){ rotY = 0.12; dist = 0.92; targetY = 1.74; lockTarget = true; }
else if (frag.indexOf('hand') >= 0){ rotY = -0.18; dist = 0.58; targetY = 1.76; camX = -0.30; lockTarget = true; }
else if (frag.indexOf('close') >= 0){ rotY = -0.30; dist = 1.05; targetY = 0.98; lockTarget = true; }
else if (frag.indexOf('mid') >= 0){ rotY = -0.40; dist = 2.55; }
else if (frag.indexOf('palm') >= 0){ rotY = 0.05; dist = 0.42; targetY = 1.79; camX = -0.33; lockTarget = true; }
else if (frag.indexOf('front') >= 0){ rotY = 0; }

let dragging = false, lastX = 0;
const pointers = new Map();
let pinchD = 0;
canvas.addEventListener('pointerdown', function(e){
  pointers.set(e.pointerId, {x: e.clientX, y: e.clientY});
  if (pointers.size === 1){ dragging = true; lastX = e.clientX; }
  if (pointers.size === 2){
    const pts = Array.from(pointers.values());
    pinchD = Math.hypot(pts[0].x-pts[1].x, pts[0].y-pts[1].y);
  }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', function(e){
  if (!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, {x: e.clientX, y: e.clientY});
  if (pointers.size === 2){
    const pts = Array.from(pointers.values());
    const d = Math.hypot(pts[0].x-pts[1].x, pts[0].y-pts[1].y);
    if (pinchD > 0) dist = clamp(dist * (pinchD/d), 0.5, 7.5);
    pinchD = d;
    return;
  }
  if (!dragging) return;
  rotY += (e.clientX - lastX) * 0.0055;
  lastX = e.clientX;
});
function endPointer(e){ pointers.delete(e.pointerId); if (pointers.size === 0) dragging = false; }
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);
canvas.addEventListener('wheel', function(e){
  e.preventDefault();
  dist = clamp(dist * (1 + e.deltaY*0.0011), 0.5, 7.5);
}, { passive: false });

function resize(){
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 600 ? 1 : 1.5));
  renderer.setSize(w, h, false);
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

let frameNo = 0;
function tick(){
  requestAnimationFrame(tick);
  frameNo++;
  statue.rotation.y = rotY;
  let effY = targetY;
  if (!lockTarget){
    const lift = clamp((2.4 - dist) / 1.7, 0, 1);
    effY = targetY + lift * 0.78;
  }
  camera.position.set(camX, (camY !== null ? camY : effY + 0.05), dist);
  camera.lookAt(camX, effY, 0);
  renderer.render(scene, camera);
  if (frameNo === 30){
    window.__triCount = renderer.info.render.triangles;
    window.__ready = true;
  }
}
tick();

