/* ==========================================================================
   THE DIVINE ARCHIVES — the golden portal

   One archway, used wherever the archive opens a way between its spaces: the
   museum's Rotunda arch to the Pilgrimage, and the Pilgrimage's own doorways.
   Fluted gilded pillars and a round arch frame a surface of slowly turning
   golden light (a small shader), with a glowing rim, a halo and gold sparks
   drifting up through it. It is the archive's own furniture, not part of any
   site, and it is meant to read as magic, not as history.

   portal({ w, h, label, tint }) → { group, update(dt), dispose() }
     w, h   the opening's width and the height of its straight sides (metres);
            the round arch adds w / 2 on top
     tint   optional colour mixed into the light (e.g. the desert's warmth)
   update(dt) animates it; call it every frame while it is near (it returns
   true, so the caller knows to draw a new frame). Reduced motion: pass dt 0.
   ========================================================================== */
import * as THREE from "three";

const gold = new THREE.MeshStandardMaterial({ color: "#d6a650", roughness: 0.28, metalness: 0.92, emissive: "#3a2508", emissiveIntensity: 0.6 });
const goldDark = new THREE.MeshStandardMaterial({ color: "#9c7034", roughness: 0.4, metalness: 0.9 });

function glowTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d");
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(255,240,200,1)"); r.addColorStop(0.25, "rgba(255,200,110,.55)"); r.addColorStop(1, "rgba(255,170,60,0)");
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
let GLOW = null;

const vert = `varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const frag = `
uniform float uTime; uniform vec2 uSize; uniform vec3 uTint; varying vec2 vP;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a*noise(p); p *= 2.03; a *= 0.5; } return v; }
void main(){
  float W = uSize.x, H = uSize.y, R = W * 0.5;
  vec2 c = vec2(0.0, H * 0.62);
  vec2 d = (vP - c) / W;
  float r = length(d), a = atan(d.y, d.x);
  // a slow golden whirl, drawn inwards
  float sw = fbm(vec2(a * 1.6 + uTime * 0.22 - r * 3.4, r * 5.0 - uTime * 0.55));
  float sw2 = fbm(vec2(a * 3.0 - uTime * 0.35 + sw * 2.0, r * 9.0 + uTime * 0.3));
  float rays = 0.5 + 0.5 * sin(a * 14.0 + uTime * 0.7 + sw * 5.0);
  float core = exp(-r * 2.6);
  // distance to the opening's edge: the straight sides, the floor, the round top
  float ex = R - abs(vP.x);
  float et = vP.y > H ? R - length(vP - vec2(0.0, H)) : 1e3;
  float edge = max(0.0, min(min(ex, et), vP.y + 0.6));
  float rim = exp(-edge * 9.0);
  vec3 g1 = vec3(1.0, 0.74, 0.30), g2 = vec3(1.0, 0.93, 0.70), deep = vec3(0.45, 0.25, 0.06);
  vec3 col = mix(deep, g1, sw) * 0.92 + g2 * pow(sw2, 3.0) * 0.75 + g2 * core * 0.6 + g1 * rays * 0.14 * (1.0 - core);
  col = mix(col, col * uTint, 0.35) + g2 * rim * 1.3;
  float alpha = clamp(0.62 + 0.3 * sw + core * 0.35 + rim, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}`;

export function portal(o) {
  o = o || {};
  const w = o.w || 1.5, h = o.h || 2.4, R = w / 2, group = new THREE.Group();
  if (!GLOW) GLOW = glowTexture();
  // ---- the arch: fluted pillars on plinths, capitals, the round arch and a keystone
  const pw = 0.16, depth = 0.24;
  for (const sx of [-1, 1]) {
    const x = sx * (R + pw / 2);
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(pw + 0.12, 0.22, depth + 0.12), goldDark); plinth.position.set(x, 0.11, 0); group.add(plinth);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(pw / 2, pw / 2 + 0.01, h - 0.38, 16), gold); shaft.position.set(x, 0.22 + (h - 0.38) / 2, 0); group.add(shaft);
    for (let f = 0; f < 8; f++) {   // flutes
      const a = f / 8 * Math.PI * 2, fl = new THREE.Mesh(new THREE.BoxGeometry(0.012, h - 0.5, 0.012), goldDark);
      fl.position.set(x + Math.cos(a) * (pw / 2 + 0.002), 0.22 + (h - 0.38) / 2, Math.sin(a) * (pw / 2 + 0.002)); group.add(fl);
    }
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(pw / 2 + 0.06, pw / 2, 0.16, 16), gold); cap.position.set(x, h - 0.08, 0); group.add(cap);
  }
  const arch = new THREE.Mesh(new THREE.TorusGeometry(R + pw / 2, pw / 2 + 0.01, 10, 40, Math.PI), gold); arch.position.y = h; group.add(arch);
  const archIn = new THREE.Mesh(new THREE.TorusGeometry(R + 0.015, 0.025, 6, 40, Math.PI), goldDark); archIn.position.y = h; group.add(archIn);
  const key = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.28, depth + 0.04), gold); key.position.set(0, h + R + 0.06, 0); group.add(key);
  // a gold star on the keystone, the archive's mark
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.07, 0), new THREE.MeshBasicMaterial({ color: "#ffe2a0" })); star.position.set(0, h + R + 0.08, depth / 2 + 0.05); group.add(star);
  // ---- the light in the opening
  const shape = new THREE.Shape(); shape.moveTo(-R, 0); shape.lineTo(R, 0); shape.lineTo(R, h); shape.absarc(0, h, R, 0, Math.PI, false); shape.lineTo(-R, 0);
  const uni = { uTime: { value: Math.random() * 10 }, uSize: { value: new THREE.Vector2(w, h) }, uTint: { value: new THREE.Color(o.tint || "#ffffff") } };
  const sheet = new THREE.Mesh(new THREE.ShapeGeometry(shape, 24), new THREE.ShaderMaterial({ uniforms: uni, vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.NormalBlending }));
  group.add(sheet);
  // halo behind and in front of the opening
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(w * 2.6, (h + R) * 1.7), new THREE.MeshBasicMaterial({ map: GLOW, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55, color: "#ffd38a", side: THREE.DoubleSide }));
  halo.position.set(0, (h + R) * 0.55, -0.02); group.add(halo);
  // ---- sparks: gold motes rising and turning slowly through the opening
  const N = o.sparks || 70, pos = new Float32Array(N * 3), seed = [];
  for (let i = 0; i < N; i++) seed.push({ x: (Math.random() - 0.5) * w * 1.1, y: Math.random() * (h + R), z: (Math.random() - 0.5) * 0.5, v: 0.12 + Math.random() * 0.3, ph: Math.random() * 6.28 });
  const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const motes = new THREE.Points(pg, new THREE.PointsMaterial({ map: GLOW, size: 0.07, sizeAttenuation: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: "#ffd890" }));
  motes.frustumCulled = false; group.add(motes);
  let t = 0;
  const place = () => {
    for (let i = 0; i < N; i++) {
      const s = seed[i], y = (s.y + t * s.v) % (h + R);
      pos[i * 3] = s.x + Math.sin(t * 0.8 + s.ph) * 0.06; pos[i * 3 + 1] = y; pos[i * 3 + 2] = s.z + Math.cos(t * 0.6 + s.ph) * 0.05;
    }
    pg.attributes.position.needsUpdate = true;
  };
  place();
  return {
    group,
    update(dt) { t += dt; uni.uTime.value += dt; place(); halo.material.opacity = 0.5 + 0.08 * Math.sin(t * 1.7); star.rotation.y += dt * 0.8; return dt > 0; },
    dispose() { sheet.geometry.dispose(); sheet.material.dispose(); pg.dispose(); motes.material.dispose(); halo.geometry.dispose(); halo.material.dispose(); }
  };
}

// the golden flash on stepping through: briefly washes the screen gold (uses the .mu-fade element)
export function goldFlash(el, on) {
  if (!el) return;
  el.classList.toggle("gold", !!on);
}
