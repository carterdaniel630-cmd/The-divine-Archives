/* ==========================================================================
   THE DIVINE ARCHIVES — the Virtual Museum: skies overhead, ground underfoot

   Every room, corridor and gallery except the planetarium has its own
   atmosphere, chosen to suit what the room is about:
   - a SKY in a skylight in the ceiling (clear, golden, hazy, misty, dawn,
     dusk, night, aurora, monsoon, storm with lightning, heavenly light...),
     drawn by a shader that treats the skylight as a window, so the clouds
     move with parallax as you walk;
   - a GROUND under a glass floor: a sunken diorama about a metre deep
     (a brook, a lotus pond, the Nile's reeds, a shore with waves, dunes,
     a forest floor, snow, red earth, a cave, lava, a starry abyss...),
     which you walk over as if it were under glass in a museum floor.
   These are atmosphere, not reconstructions. The table ENV below is the one
   place the choices are made; fauna.js puts animals in them and sound.js
   gives each its sound.

   Motion: with "reduce motion" on, water, clouds and plants hold still and
   there is no lightning. Lightning is soft and never more than two pulses
   every several seconds.
   ========================================================================== */
import * as THREE from "three";

// ---------------------------------------------------------------- the choices
// sky: a preset below; ground: a biome below; fauna: see fauna.js; sound comes from sky + ground (sound.js)
export const ENV = {
  hall: { sky: "dawn", ground: "pool", fauna: ["koi"] },
  spine: { sky: "time", ground: "river", fauna: ["trout", "swallows"] },
  // corridors, one per Age
  "cor:01-prehistory": { sky: "night", ground: "brook", fauna: ["trout"] },
  "cor:02-bronze-age": { sky: "golden", ground: "brook", fauna: ["trout"] },
  "cor:03-early-iron-age": { sky: "clear", ground: "brook", fauna: ["trout"] },
  "cor:04-axial-age": { sky: "clear", ground: "brook", fauna: ["trout"] },
  "cor:05-late-antiquity": { sky: "dusk", ground: "brook", fauna: ["trout"] },
  "cor:06-early-medieval": { sky: "overcast", ground: "brook", fauna: ["trout"] },
  "cor:07-high-medieval": { sky: "dusk", ground: "brook", fauna: ["trout"] },
  "cor:08-early-modern": { sky: "rain", ground: "brook", fauna: ["trout"] },
  "cor:09-modern": { sky: "night", ground: "brook", fauna: ["trout"] },
  // Prehistory
  ch41: { sky: "night", ground: "cave", fauna: ["bats"] },                          // the Paleolithic: painted caves
  ch42: { sky: "dawn", ground: "field", fauna: ["swallows", "mice"] },              // the Neolithic: the first fields
  ch61: { sky: "starry", ground: "redearth", fauna: ["lizards"] },                  // the Dreaming: desert country under the night sky
  // Bronze Age
  ch02: { sky: "golden", ground: "nile", fauna: ["cats", "lizards", "ibis", "tilapia"] },
  ch03: { sky: "haze", ground: "marsh", fauna: ["heron", "tilapia"] },
  ch04: { sky: "haze", ground: "river", fauna: ["tilapia", "kingfisher"] },
  ch05: { sky: "dawn", ground: "river", fauna: ["tilapia", "swallows"] },           // Ushas, the dawn
  ch57: { sky: "thunder", ground: "steppe", fauna: ["lizards"] },                   // the Storm-god of Hatti
  // Early Iron Age
  ch06: { sky: "dawn", ground: "desert", fauna: ["lizards"] },
  ch07: { sky: "clear", ground: "desert", fauna: ["scorpions", "lizards"] },
  ch08: { sky: "clear", ground: "shore", fauna: ["crabs", "gulls", "bream"] },       // the Aegean
  ch09: { sky: "mist", ground: "pond", fauna: ["turtles", "koi"] },                 // turtle plastrons, oracle bones
  ch58: { sky: "dusk", ground: "shore", fauna: ["crabs", "gulls", "bream"] },        // the sea-traders
  // Axial Age
  ch10: { sky: "clear", ground: "desert", fauna: ["scorpions", "lizards"] },         // the Judean wilderness
  ch11: { sky: "clear", ground: "forestbrook", fauna: ["trout", "songbirds", "butterflies"] },
  ch12: { sky: "mist", ground: "brook", fauna: ["trout", "crane"] },
  ch13: { sky: "clear", ground: "ruins", fauna: ["lizards", "swallows"] },
  ch14: { sky: "overcast", ground: "forest", fauna: ["ravens", "songbirds"] },
  ch15: { sky: "dusk", ground: "steppe", fauna: ["owl", "lizards"] },               // Athena's owl
  ch52: { sky: "clear", ground: "pond", fauna: ["koi", "dragonflies", "butterflies"] },
  // Late Antiquity
  ch16: { sky: "clear", ground: "lake", fauna: ["tilapia", "gulls"] },               // the Sea of Galilee, the fish sign
  ch17: { sky: "storm", ground: "void", fauna: ["bats"] },
  ch18: { sky: "night", ground: "cave", fauna: ["bats", "scorpions"] },              // Mithraic caves
  ch19: { sky: "dusk", ground: "meadow", fauna: ["songbirds", "butterflies"] },
  ch20: { sky: "clear", ground: "pond", fauna: ["koi", "dragonflies", "frogs"] },    // the lotus
  ch45: { sky: "storm", ground: "void", fauna: [] },
  ch55: { sky: "twilight", ground: "void", fauna: [] },                             // light and darkness
  // Early Medieval
  ch21: { sky: "golden", ground: "garden", fauna: ["doves", "songbirds"] },          // the four-fold garden
  ch22: { sky: "clear", ground: "desert", fauna: ["lizards", "scorpions"] },         // the Desert Fathers
  ch23: { sky: "aurora", ground: "snow", fauna: ["ravens"] },                        // Huginn and Muninn
  ch24: { sky: "monsoon", ground: "pond", fauna: ["frogs", "koi"] },
  ch25: { sky: "mist", ground: "brook", fauna: ["koi", "fireflies", "crane"] },
  ch53: { sky: "highland", ground: "snow", fauna: ["ravens"] },
  ch54: { sky: "mist", ground: "zen", fauna: ["koi", "dragonflies"] },
  ch60: { sky: "heavenly", ground: "ruins", fauna: ["doves"] },                      // gold mosaic
  // High Medieval
  ch26: { sky: "starry", ground: "void", fauna: [] },
  ch27: { sky: "dusk", ground: "garden", fauna: ["songbirds", "doves"] },            // the rose and the nightingale
  ch28: { sky: "overcast", ground: "meadow", fauna: ["doves", "butterflies"] },      // the cloister garth
  ch29: { sky: "tropical", ground: "jungle", fauna: ["frogs", "macaws", "butterflies"] },
  ch30: { sky: "dawn", ground: "river", fauna: ["tilapia", "kingfisher"] },
  ch43: { sky: "tropical", ground: "lake", fauna: ["axolotls", "eagle"] },            // the lake of Tenochtitlan
  ch44: { sky: "highland", ground: "terraces", fauna: ["condor", "lizards"] },
  ch56: { sky: "clear", ground: "river", fauna: ["tilapia", "doves"] },              // baptism in living water
  ch59: { sky: "thunder", ground: "forest", fauna: ["ravens", "songbirds"] },         // Perun
  ch62: { sky: "clear", ground: "meadow", fauna: ["hawk", "butterflies"] },
  // Early Modern
  ch31: { sky: "rain", ground: "meadow", fauna: ["ravens"] },
  ch32: { sky: "storm", ground: "heath", fauna: ["ravens", "bats", "owl"] },
  ch33: { sky: "golden", ground: "steppe", fauna: ["lizards", "songbirds"] },
  ch34: { sky: "heavenly", ground: "pool", fauna: ["koi"] },                          // the sarovar of the Golden Temple
  ch63: { sky: "tropical", ground: "shore", fauna: ["crabs", "turtles", "gulls", "bream"] },
  // Modern
  ch35: { sky: "dawn", ground: "meadow", fauna: ["songbirds", "butterflies"] },
  ch36: { sky: "fog", ground: "heath", fauna: ["owl", "bats"] },                      // the séance room
  ch37: { sky: "storm", ground: "void", fauna: ["bats"] },
  ch38: { sky: "moon", ground: "forest", fauna: ["owl", "fireflies", "hares"] },
  ch39: { sky: "tempest", ground: "ash", fauna: ["bats", "ravens"] },
  ch40: { sky: "dusk", ground: "jungle", fauna: ["frogs", "butterflies"] },
  ch64: { sky: "rays", ground: "meadow", fauna: ["doves", "songbirds"] },             // wind and fire
  ch65: { sky: "heavenly", ground: "garden", fauna: ["doves", "songbirds"] }          // the terraced gardens
};

// ---------------------------------------------------------------- sky presets
const C = (h) => new THREE.Color(h);
const SKY = {
  clear:    { lit: 0.95, zen: "#2f6fc4", hor: "#b8d8f0", cloud: "#ffffff", shade: "#a8b4c4", cover: 0.45, dens: 0.6, speed: 0.6, sun: 0.9, sunCol: "#fff2d8", birds: 1 },
  golden:   { lit: 1, zen: "#3a78c0", hor: "#f2d9a0", cloud: "#fff4dc", shade: "#d0a878", cover: 0.2, dens: 0.4, speed: 0.4, sun: 1.3, sunCol: "#ffd890", birds: 1 },
  haze:     { lit: 0.9, zen: "#7aa0c0", hor: "#e8d6b0", cloud: "#f4ead4", shade: "#c8b494", cover: 0.3, dens: 0.3, speed: 0.3, sun: 1.0, sunCol: "#ffe0a8", haze: 0.55, birds: 1 },
  mist:     { lit: 0.8, zen: "#7f9cb0", hor: "#d4dee2", cloud: "#e8ecee", shade: "#a4b0b8", cover: 0.62, dens: 0.45, speed: 0.25, sun: 0.35, sunCol: "#fffaf0", haze: 0.4, birds: 0.5 },
  dawn:     { lit: 0.8, zen: "#4b6fb0", hor: "#f6b98a", cloud: "#ffd6c0", shade: "#a8789a", cover: 0.4, dens: 0.55, speed: 0.4, sun: 1.2, sunCol: "#ffb070", birds: 1 },
  dusk:     { lit: 0.62, zen: "#2b2f6a", hor: "#f08a5a", cloud: "#ffb080", shade: "#5a3a5a", cover: 0.45, dens: 0.7, speed: 0.4, sun: 1.1, sunCol: "#ff8a4a", birds: 0.6 },
  twilight: { lit: 0.45, zen: "#121636", hor: "#b8603a", cloud: "#e08a60", shade: "#22182a", cover: 0.55, dens: 0.9, speed: 0.5, sun: 0.8, sunCol: "#ff7a3a", stars: 0.5 },
  night:    { lit: 0.42, zen: "#050a1c", hor: "#1a2644", cloud: "#3a4460", shade: "#0a0e1a", cover: 0.3, dens: 0.8, speed: 0.3, sun: 0, stars: 1, moon: 0.8 },
  starry:   { lit: 0.42, zen: "#03061a", hor: "#14203e", cloud: "#2a3450", shade: "#060a16", cover: 0.08, dens: 0.8, speed: 0.2, sun: 0, stars: 1.6, milky: 1 },
  moon:     { lit: 0.48, zen: "#0a1430", hor: "#2a3a60", cloud: "#8090b0", shade: "#1a2238", cover: 0.35, dens: 0.7, speed: 0.35, sun: 0, stars: 0.8, moon: 1.4 },
  aurora:   { lit: 0.45, zen: "#040c1c", hor: "#12283a", cloud: "#2a3a4a", shade: "#08101a", cover: 0.15, dens: 0.8, speed: 0.25, sun: 0, stars: 1.1, aurora: 1 },
  highland: { lit: 1, zen: "#1446a8", hor: "#9cc4ec", cloud: "#ffffff", shade: "#9aa8bc", cover: 0.3, dens: 0.5, speed: 1.1, sun: 1.2, sunCol: "#ffffff", birds: 0.4 },
  tropical: { lit: 1, zen: "#1f78d0", hor: "#a8e0f4", cloud: "#ffffff", shade: "#8a9ab0", cover: 0.5, dens: 0.8, speed: 0.7, sun: 1.1, sunCol: "#fff4d0", birds: 1 },
  overcast: { lit: 0.7, zen: "#6a7482", hor: "#a8afb6", cloud: "#b8bec4", shade: "#626a74", cover: 0.85, dens: 0.6, speed: 0.5, sun: 0.1, sunCol: "#ffffff" },
  rain:     { lit: 0.6, zen: "#4a525e", hor: "#7c848c", cloud: "#8a9098", shade: "#3a424c", cover: 0.95, dens: 0.8, speed: 0.8, sun: 0, rain: 0.8 },
  fog:      { lit: 0.42, zen: "#1a1e26", hor: "#4a5058", cloud: "#5a6068", shade: "#20242a", cover: 0.9, dens: 0.5, speed: 0.3, sun: 0, haze: 0.8, moon: 0.4, bolts: 0.25 },
  monsoon:  { lit: 0.55, zen: "#3a4450", hor: "#8a8a80", cloud: "#8c8e88", shade: "#2e343c", cover: 0.9, dens: 1, speed: 0.9, sun: 0, rain: 1, bolts: 0.35 },
  thunder:  { lit: 0.62, zen: "#3e4a5c", hor: "#9aa0a4", cloud: "#b0b4b8", shade: "#2a3240", cover: 0.8, dens: 1, speed: 1.0, sun: 0.2, sunCol: "#fff0d0", bolts: 0.6, rain: 0.3 },
  storm:    { lit: 0.36, zen: "#0c0e16", hor: "#2a2e3a", cloud: "#3c404c", shade: "#07080c", cover: 0.95, dens: 1.2, speed: 1.3, sun: 0, rain: 0.7, bolts: 1 },
  tempest:  { lit: 0.3, zen: "#0a0608", hor: "#3a1e1a", cloud: "#4a3432", shade: "#060304", cover: 1, dens: 1.3, speed: 1.6, sun: 0, rain: 0.9, bolts: 1.4, ember: 0.4 },
  heavenly: { lit: 1, zen: "#4a78c0", hor: "#ffe2a4", cloud: "#fff0d0", shade: "#d8a45a", cover: 0.55, dens: 0.4, speed: 0.3, sun: 1.6, sunCol: "#ffe0a0", rays: 1 },
  rays:     { lit: 0.95, zen: "#3a6ab8", hor: "#ffe0b0", cloud: "#fff0d8", shade: "#9a8a90", cover: 0.65, dens: 0.8, speed: 0.9, sun: 1.8, sunCol: "#ffd890", rays: 1.4 },
  time:     { lit: 0.8, zen: "#2f6fc4", hor: "#b8d8f0", cloud: "#ffffff", shade: "#a8b4c4", cover: 0.35, dens: 0.6, speed: 0.5, sun: 0.9, sunCol: "#fff2d8", cycle: 1 }
};
export function skyOf(key) { return SKY[key] || SKY.clear; }

// ---------------------------------------------------------------- shared GLSL
const GLSL_NOISE = `
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), f.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < OCT; i++){ s += a * vnoise(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + vec2(3.1, 7.7); a *= .5; } return s; }
`;

// ---------------------------------------------------------------- the sky in a skylight
function skyMaterial(key, q) {
  const P = skyOf(key);
  const u = {
    uTime: { value: 0 }, uFlash: { value: 0 }, uBolt: { value: new THREE.Vector4(0, 0, 0, 0) },
    uZen: { value: C(P.zen) }, uHor: { value: C(P.hor) }, uCloud: { value: C(P.cloud) }, uShade: { value: C(P.shade) },
    uSunCol: { value: C(P.sunCol || "#ffffff") }, uSunDir: { value: new THREE.Vector3(0.35, 0.8, -0.45).normalize() },
    uCover: { value: P.cover }, uDens: { value: P.dens }, uSpeed: { value: P.speed }, uSun: { value: P.sun || 0 },
    uStars: { value: P.stars || 0 }, uMoon: { value: P.moon || 0 }, uAurora: { value: P.aurora || 0 }, uRain: { value: P.rain || 0 },
    uHaze: { value: P.haze || 0 }, uRays: { value: P.rays || 0 }, uBirds: { value: P.birds || 0 }, uMilky: { value: P.milky || 0 },
    uEmber: { value: P.ember || 0 }, uRaptor: { value: 0 }, uGulls: { value: 0 }, uCycle: { value: P.cycle || 0 }, uSeed: { value: Math.random() * 50 }
  };
  const m = new THREE.ShaderMaterial({
    uniforms: u, depthWrite: true,
    defines: { OCT: q > 1 ? 5 : 3 },
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `
uniform float uTime, uFlash, uCover, uDens, uSpeed, uSun, uStars, uMoon, uAurora, uRain, uHaze, uRays, uBirds, uMilky, uEmber, uCycle, uSeed, uRaptor, uGulls;
uniform vec3 uZen, uHor, uCloud, uShade, uSunCol, uSunDir; uniform vec4 uBolt;
varying vec3 vW;
${GLSL_NOISE}
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.); return length(pa - ba * h); }
void main(){
  vec3 d = normalize(vW - cameraPosition);
  float up = max(d.y, 0.03);
  vec3 zen = uZen, hor = uHor, cl = uCloud, sh = uShade; float sun = uSun, stars = uStars;
  if (uCycle > 0.) {                                   // the Spine: the day passes along its length
    float k = clamp((-vW.z - 30.) / 150., 0., 1.);
    vec3 z2 = mix(vec3(.18,.43,.77), vec3(.17,.18,.42), smoothstep(.35,.7,k)); z2 = mix(z2, vec3(.02,.04,.11), smoothstep(.7,1.,k));
    vec3 h2 = mix(vec3(.72,.85,.94), vec3(.94,.54,.35), smoothstep(.35,.7,k)); h2 = mix(h2, vec3(.1,.15,.27), smoothstep(.75,1.,k));
    zen = z2; hor = h2; cl = mix(vec3(1.), vec3(1.,.69,.5), smoothstep(.4,.75,k)); cl = mix(cl, vec3(.22,.27,.38), smoothstep(.8,1.,k));
    sh = mix(vec3(.66,.7,.77), vec3(.35,.23,.35), smoothstep(.4,.8,k)); sun = mix(.9, 0., smoothstep(.7,.9,k)); stars = smoothstep(.8,1.,k);
  }
  vec3 col = mix(hor, zen, pow(up, .5));
  float sd = max(dot(d, uSunDir), 0.);
  col += uSunCol * sun * (pow(sd, 900.) * 3. + pow(sd, 12.) * .35);
  // clouds on a layer 60 m up, seen through the skylight: they move with parallax as you walk
  vec2 p = (cameraPosition.xz + d.xz * (60. / up)) * .018 + uSeed;
  vec2 wv = vec2(uTime * uSpeed * .02, uTime * uSpeed * .008);
  float n = fbm(p + wv), n2 = fbm(p * 2.7 - wv * 1.7 + 11.);
  float cov = smoothstep(1. - uCover, 1. - uCover + .32, n * .78 + n2 * .32);
  float thick = smoothstep(.35, 1., n + n2 * .2) * uDens;
  vec3 cc = mix(cl, sh, clamp(thick, 0., 1.));
  cc *= mix(1., .7 + .6 * smoothstep(.35, .75, n2), step(1., uDens));               // heavy cloud: lighter and darker masses
  cc += uSunCol * sun * .25 * pow(sd, 6.) * (1. - thick);                // silver lining toward the sun
  float fade = smoothstep(.04, .25, up);
  col = mix(col, cc, cov * fade);
  col = mix(col, hor, uHaze * (1. - up) * .8);
  // stars, the moon, the Milky Way
  if (stars > 0.) {
    vec2 sp = d.xz / (up + .3) * 90.;
    float h = hash12(floor(sp)), tw = .6 + .4 * sin(uTime * (1.5 + h * 3.) + h * 40.);
    float st = smoothstep(.9965, 1., h) * tw * (1. - cov) * stars;
    vec2 fp = fract(sp) - .5; st *= smoothstep(.35, .0, length(fp));
    col += vec3(st) * vec3(.9, .95, 1.1);
    if (uMilky > 0.) { float band = exp(-pow((d.x * .8 + d.z * .6) * 3.2, 2.)); float mw = fbm(sp * .08) * band; col += vec3(.18, .17, .22) * mw * uMilky * (1. - cov); col += vec3(.9) * smoothstep(.99, 1., h) * smoothstep(.3, .0, length(fp)) * band * .6 * uMilky; }
  }
  if (uMoon > 0.) { vec3 md = normalize(vec3(-.4, .85, .3)); float mm = max(dot(d, md), 0.); col += vec3(.9, .92, 1.) * uMoon * (smoothstep(.9994, .9996, mm) * 1.4 + pow(mm, 60.) * .25); }
  // the aurora: slow green curtains
  if (uAurora > 0.) {
    vec2 ap = d.xz / (up + .15);
    float curtain = 0.;
    for (int i = 0; i < 3; i++) { float fi = float(i); float x = ap.x * (1.2 + fi * .4) + sin(ap.y * 1.3 + uTime * .12 + fi * 2.) * .8 + fbm(ap * .7 + uTime * .03 + fi) * 1.5; curtain += smoothstep(.12, 0., abs(fract(x * .25) - .5) - .05) * (.6 - fi * .15) * (.55 + .45 * vnoise(vec2(x * 38., uTime * .4 + fi))); }
    float h2 = smoothstep(.1, .5, up) * (1. - smoothstep(.8, 1., up));
    col += mix(vec3(.1, .9, .5), vec3(.5, .3, .9), smoothstep(.3, .9, up)) * curtain * h2 * uAurora * .55 * (1. - cov * .7);
  }
  // shafts of light through broken cloud
  if (uRays > 0.) { float ang = atan(d.z - uSunDir.z, d.x - uSunDir.x); float r = pow(vnoise(vec2(ang * 9., uTime * .05)), 3.); col += uSunCol * r * uRays * .25 * (1. - cov * .5) * smoothstep(.2, .9, sd); }
  // birds crossing, far off
  if (uBirds > 0.) {
    for (int i = 0; i < 3; i++) {
      float fi = float(i), ph = fract(uTime * (.012 + fi * .004) + fi * .37);
      vec2 bc = vec2(mix(-1.4, 1.4, ph), sin(fi * 3.1 + ph * 2.) * .5 + (fi - 1.) * .35);
      vec2 q = d.xz / (up + .2) - bc; float fl = sin(uTime * 7. + fi * 2.) * .012;
      float b = min(seg(q, vec2(-.014, .006 + fl * .5), vec2(0., 0.)), seg(q, vec2(.014, .006 + fl * .5), vec2(0., 0.)));
      col = mix(col, vec3(.08, .07, .07), smoothstep(.0022, .0008, b) * uBirds);
    }
  }
  // a bird of prey circling high up (eagle, condor, hawk), and gulls gliding
  if (uRaptor > 0.) {
    vec2 sp = d.xz / (up + .2); float a = uTime * .12 + uSeed; vec2 c = vec2(.15, -.1) + vec2(cos(a), sin(a)) * .5;
    float hd = a + 1.5708, cs = cos(hd), sn = sin(hd); vec2 lp = mat2(cs, -sn, sn, cs) * (sp - c) / uRaptor;
    float span = .11, ax = abs(lp.x) / span, wing = step(ax, 1.) * smoothstep(.003, .0, abs(lp.y + .01 * ax) - .016 * (1. - ax * ax * .6));
    float fingers = step(.8, ax) * step(ax, 1.) * step(.5, fract(lp.y * 160.)); wing *= 1. - fingers * .7;
    float bod = smoothstep(.003, .0, length(lp * vec2(4., 1.)) - .028), tail = step(abs(lp.x), .012 + (-lp.y - .02) * .3) * step(-.055, lp.y) * step(lp.y, -.02);
    col = mix(col, vec3(.06, .05, .05), clamp(max(max(wing, bod), tail), 0., 1.) * .92);
  }
  if (uGulls > 0.) {
    for (int i = 0; i < 3; i++) { float fi = float(i), ph = fract(uTime * (.01 + fi * .003) + fi * .41);
      vec2 q2 = d.xz / (up + .2) - vec2(mix(-1.3, 1.3, ph), (fi - 1.) * .45 + sin(ph * 5. + fi) * .1); float x = abs(q2.x);
      float yb = -abs(x - .02) * .5 + .012 + sin(uTime * 2. + fi) * .002 * step(.5, fract(uTime * .2 + fi * .3));
      float g2 = step(x, .045) * smoothstep(.0025, .0, abs(q2.y - yb) - .0025 * (1. - x / .045));
      col = mix(col, vec3(.95, .95, .95) * .9, g2);
    }
  }
  // lightning: the whole cloud deck lights from inside, and a bolt forks across
  vec2 q = (d.xz / up) * 1.2 - uBolt.xy;
  float near = exp(-dot(q, q) * 1.2);
  col += uFlash * (cov * (.35 + .65 * smoothstep(.3, .9, n)) * (.25 + .75 * near) + .05) * vec3(.72, .78, 1.) * .8;   // the clouds light from inside, most near the bolt
  if (uBolt.w > 0.) {
    float bx = q.x;
    float zig = (fbm(vec2(bx * 2.2, uBolt.z)) - .5) * .9 + (vnoise(vec2(bx * 9., uBolt.z * 3.)) - .5) * .25;
    float dd = abs(q.y - zig), along = smoothstep(-1.4, -1.2, bx) * (1. - smoothstep(1.2, 1.4, bx));
    col += vec3(.85, .9, 1.) * (exp(-dd * 110.) * 1.8 + exp(-dd * 14.) * .3) * along * uBolt.w;
  }
  // rain beading on the skylight's glass
  if (uRain > 0.) {
    vec2 g = vW.xz * vec2(9., 2.5); vec2 id = floor(g); float h = hash12(id + 3.1);
    float t = fract(uTime * (.25 + h * .4) + h); vec2 f = fract(g) - vec2(.5, 1. - t);
    float drop = smoothstep(.08, .02, abs(f.x)) * smoothstep(.12, .0, abs(f.y)) * step(1. - uRain * .35, h);
    float trail = smoothstep(.04, .0, abs(f.x)) * step(0., f.y) * smoothstep(.5, 0., f.y) * step(1. - uRain * .35, h) * .35;
    col = mix(col, col * 1.5 + .04, drop + trail);
  }
  if (uEmber > 0.) col += vec3(.9, .25, .05) * uEmber * .35 * (1. - up) * (.6 + .4 * sin(uTime * .7));
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
  });
  m.userData.preset = P;
  return m;
}

// ---------------------------------------------------------------- water
function waterMaterial(o) {
  const u = {
    uTime: { value: 0 }, uFlow: { value: new THREE.Vector2(o.flow ? o.flow[0] : 0, o.flow ? o.flow[1] : 0) }, uCalm: { value: o.calm || 0 },
    uDeep: { value: C(o.deep || "#0e3a3a") }, uShallow: { value: C(o.shallow || "#3a8a80") }, uSky: { value: C(o.sky || "#9cc0d8") },
    uLamp: { value: new THREE.Vector3() }, uSplash: { value: [0, 1, 2, 3].map(() => new THREE.Vector4(0, 0, 0, 99)) },
    uShore: { value: new THREE.Vector4(0, 0, 0, 0) }, uAlpha: { value: o.alpha || 0.62 }, uMurk: { value: o.murk || 0 }
  };
  return new THREE.ShaderMaterial({
    uniforms: u, transparent: true, depthWrite: false,
    defines: { OCT: 3 },
    vertexShader: `
uniform float uTime; uniform vec4 uShore; varying vec3 vW;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  if (uShore.w > 0.) { float s = dot(w.xz, uShore.xy); w.y += uShore.w * (.5 + .5 * sin(uTime * .8 - s * 1.6)) * .09 + sin(uTime * .21) * .025 * uShore.w; }
  vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `
uniform float uTime, uCalm, uAlpha, uMurk; uniform vec2 uFlow; uniform vec3 uDeep, uShallow, uSky, uLamp; uniform vec4 uSplash[4]; uniform vec4 uShore;
varying vec3 vW;
${GLSL_NOISE}
float hgt(vec2 p){
  vec2 f = uFlow * uTime;
  float h = fbm(p * 1.6 - f * 1.3) * .6 + fbm(p * 3.1 - f * 2.1 + 4.) * .25;
  h *= (1. - uCalm * .8);
  for (int i = 0; i < 4; i++) { float age = uSplash[i].w; if (age < 4.) { float r = length(p - uSplash[i].xy); h += sin(r * 38. - age * 9.) * exp(-age * 1.3) * exp(-r * 2.5) * .35 * uSplash[i].z; } }
  return h;
}
void main(){
  vec2 p = vW.xz; float e = .03;
  float h0 = hgt(p); vec3 n = normalize(vec3((h0 - hgt(p + vec2(e, 0.))) * .3, e, (h0 - hgt(p + vec2(0., e))) * .3));
  vec3 v = normalize(cameraPosition - vW);
  float fr = pow(1. - max(dot(n, v), 0.), 3.) * .85 + .1;
  vec3 col = mix(uShallow, uDeep, .45 + .3 * h0);
  col = mix(col, uSky, fr);
  vec3 l = normalize(uLamp - vW); vec3 hv = normalize(l + v);
  col += vec3(1., .95, .88) * pow(max(dot(n, hv), 0.), 400.) * .6;
  float a = uAlpha + fr * .3;
  if (uShore.w > 0.) {                                                   // foam where the waves break on the sand
    float s = dot(vW.xz, uShore.xy) - uShore.z;
    float wave = .5 + .5 * sin(uTime * .8 - dot(vW.xz, uShore.xy) * 1.6);
    float foam = smoothstep(.55, 0., abs(s + .25 - wave * .5)) * smoothstep(-2.2, -.3, s) * (.55 + .45 * vnoise(vW.xz * 14. + uTime));
    foam += smoothstep(.18, 0., abs(s)) * .8 * vnoise(vW.xz * 20. - uTime * .6);
    col = mix(col, vec3(.95), clamp(foam, 0., 1.)); a = max(a, foam);
  }
  col = mix(col, uDeep, uMurk);
  gl_FragColor = vec4(col, clamp(a, 0., .95));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
  });
}

// ---------------------------------------------------------------- the abyss (a starry depth under the glass)
function voidMaterial(q) {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } }, defines: { OCT: q > 1 ? 5 : 3 },
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `
uniform float uTime; varying vec3 vW;
${GLSL_NOISE}
void main(){
  vec3 d = normalize(vW - cameraPosition); float dn = max(-d.y, .05);
  vec3 col = vec3(.005, .004, .015);
  for (int k = 0; k < 3; k++) {                                         // three layers of stars at different depths
    float depth = 3. + float(k) * 9.; vec2 p = cameraPosition.xz + d.xz * (depth / dn);
    vec2 g = p * (4. - float(k)); float h = hash12(floor(g) + float(k) * 17.);
    float s = smoothstep(.985, 1., h) * smoothstep(.4, .0, length(fract(g) - .5)) * (.5 + .5 * sin(uTime * 1.3 + h * 60.));
    col += vec3(.8, .85, 1.) * s * (1. - float(k) * .25);
  }
  vec2 np = cameraPosition.xz + d.xz * (14. / dn);
  float neb = fbm(np * .12 + vec2(uTime * .01, 0.)); float neb2 = fbm(np * .3 - uTime * .015 + 5.);
  col += mix(vec3(.25, .05, .35), vec3(.05, .2, .45), neb2) * pow(neb, 2.2) * .9;
  col += vec3(.9, .7, 1.) * pow(max(0., 1. - length(fract(np * .05) - .5) * 2.4), 12.) * .5;
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
  });
}

// ---------------------------------------------------------------- JS noise (for heightfields and textures)
function h2(i, j, s) { let n = (i * 374761393 + j * 668265263 + (s | 0) * 1442695041) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); n ^= n >>> 16; return (n >>> 0) / 4294967296; }
function vn(x, y, s) { const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v); const n00 = h2(i, j, s), n10 = h2(i + 1, j, s), n01 = h2(i, j + 1, s), n11 = h2(i + 1, j + 1, s); return n00 + (n10 - n00) * a + (n01 - n00) * b + (n00 - n10 - n01 + n11) * a * b; }
export function fbm2(x, y, s, oct) { let f = 0, a = 0.5; for (let o = 0; o < (oct || 4); o++) { f += a * vn(x, y, s + o * 13); x = x * 2.03 + 1.7; y = y * 2.03 + 9.2; a *= 0.5; } return f / (1 - Math.pow(0.5, oct || 4)); }
export function rng(seed) { let s = (seed | 0) || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export { smooth };

// ---------------------------------------------------------------- ground textures (tileable, cached)
const TEXC = new Map();
function groundTex(kind) {
  if (TEXC.has(kind)) return TEXC.get(kind);
  const N = 256, c = document.createElement("canvas"); c.width = c.height = N;
  const g = c.getContext("2d"), img = g.createImageData(N, N), d = img.data;
  const P = N / 16, wrap = (x, y, s, per) => { let f = 0, a = 0.5, p = per; for (let o = 0; o < 4; o++) { const X = x * p, Y = y * p, i = Math.floor(X), j = Math.floor(Y), u = X - i, v = Y - j, aa = u * u * (3 - 2 * u), bb = v * v * (3 - 2 * v), w = (k) => ((k % p) + p) % p; const n00 = h2(w(i), w(j), s + o), n10 = h2(w(i + 1), w(j), s + o), n01 = h2(w(i), w(j + 1), s + o), n11 = h2(w(i + 1), w(j + 1), s + o); f += a * (n00 + (n10 - n00) * aa + (n01 - n00) * bb + (n00 - n10 - n01 + n11) * aa * bb); a *= 0.5; p *= 2; } return f / 0.9375; };
  const pal = {
    sand: [[0.86, 0.72, 0.5], [0.74, 0.58, 0.38]], dune: [[0.86, 0.66, 0.4], [0.74, 0.52, 0.3]], red: [[0.66, 0.3, 0.16], [0.52, 0.22, 0.12]],
    mud: [[0.36, 0.28, 0.18], [0.24, 0.18, 0.11]], soil: [[0.3, 0.22, 0.14], [0.18, 0.13, 0.08]], grass: [[0.24, 0.34, 0.12], [0.13, 0.21, 0.07]],
    dry: [[0.62, 0.54, 0.3], [0.48, 0.4, 0.22]], snow: [[0.92, 0.94, 0.98], [0.78, 0.82, 0.9]], rock: [[0.42, 0.4, 0.37], [0.28, 0.27, 0.25]],
    lime: [[0.66, 0.6, 0.5], [0.48, 0.43, 0.36]], ash: [[0.12, 0.1, 0.1], [0.05, 0.04, 0.04]], gravel: [[0.74, 0.72, 0.67], [0.6, 0.58, 0.54]],
    moss: [[0.22, 0.34, 0.12], [0.12, 0.2, 0.08]], leaf: [[0.34, 0.25, 0.15], [0.2, 0.15, 0.09]], pebble: [[0.5, 0.46, 0.4], [0.3, 0.28, 0.25]]
  }[kind] || [[0.5, 0.5, 0.5], [0.3, 0.3, 0.3]];
  const R = rng(kind.length * 31 + kind.charCodeAt(0));
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const u = x / N, v = y / N, n = wrap(u, v, 3, 4), f = wrap(u, v, 9, 32);
    let t = n * 0.7 + f * 0.3;
    if (kind === "sand") t = t * 0.8 + 0.2 * (0.5 + 0.5 * Math.sin((v * 10 + n * 1.2) * Math.PI * 2));
    if (kind === "dune") t = t * 0.5 + 0.5 * (0.5 + 0.5 * Math.sin((v * 6 + n * 0.8) * Math.PI * 2 * 2));   // wind ripples
    if (kind === "gravel") t = 0.15 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin(v * Math.PI * 2 * 10), 2) + f * 0.25;   // raked lines
    const k = Math.max(0, Math.min(1, t));
    const col = pal[0].map((c0, i) => c0 * k + pal[1][i] * (1 - k));
    const o = (y * N + x) * 4;
    for (let i = 0; i < 3; i++) d[o + i] = Math.round(Math.pow(Math.min(1, col[i] * (0.9 + 0.2 * f)), 1 / 2.2) * 255);
    d[o + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  // speckle: grains, pebbles, leaves
  const spots = { pebble: 450, gravel: 300, leaf: 260, soil: 400, mud: 200, sand: 500, red: 400, rock: 200, lime: 150, ash: 300, moss: 250, grass: 350, dry: 300, snow: 120, dune: 200 }[kind] || 200;
  for (let i = 0; i < spots; i++) {
    const x = R() * N, y = R() * N, r = kind === "pebble" ? 2 + R() * 5 : kind === "leaf" ? 2 + R() * 4 : 0.6 + R() * 1.4;
    const l = kind === "pebble" ? 0.8 + R() * 0.5 : 0.5 + R() * 0.8;
    g.fillStyle = kind === "leaf" ? `rgba(${(90 + R() * 50) * l | 0},${(58 + R() * 30) * l | 0},${(30 + R() * 10) * l | 0},.55)` : kind === "ash" && R() < 0.3 ? "rgba(160,50,20,.5)" : `rgba(${255 * l * 0.6 | 0},${255 * l * 0.57 | 0},${255 * l * 0.52 | 0},${kind === "pebble" ? 0.85 : 0.35})`;
    g.beginPath(); g.ellipse(x, y, r, r * (0.6 + R() * 0.4), R() * 3, 0, Math.PI * 2); g.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
  TEXC.set(kind, t);
  return t;
}

// Pit materials are lit by their own sky, not the museum's lamps: unlit base, then an ambient from the sky,
// a sun (or moon) from the sky's direction and a touch of warm lamplight from above. Normals come from
// screen derivatives (faceted, cheap). Ground adds caustics below the water line and, for ash, glowing cracks.
function pitMat(o, LU) {
  const m = new THREE.MeshBasicMaterial({ map: o.map || null, vertexColors: true, side: o.side || THREE.FrontSide });
  const amp = o.sway || 0;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, LU, { uTime: PLANT_U.uTime }, o.uniforms || {});
    sh.vertexShader = "uniform float uTime; varying vec3 vWp;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
      #ifdef USE_INSTANCING
      vec3 io = (instanceMatrix * vec4(0., 0., 0., 1.)).xyz;
      #else
      vec3 io = vec3(0.);
      #endif
      float sw = sin(uTime * 1.6 + io.x * 1.3 + io.z * .9) + .5 * sin(uTime * 2.7 + io.x * 3.1);
      transformed.x += sw * ${amp.toFixed(3)} * transformed.y * transformed.y * 2.; transformed.z += sw * ${(amp * 0.5).toFixed(3)} * transformed.y * transformed.y;
      ${o.vert || ""}`).replace("#include <skinning_vertex>", `#include <skinning_vertex>
      vec4 wpp = vec4(transformed, 1.);
      #ifdef USE_INSTANCING
      wpp = instanceMatrix * wpp;
      #endif
      vWp = (modelMatrix * wpp).xyz;`);
    if (o.head) sh.vertexShader = o.head + "\n" + sh.vertexShader;
    sh.fragmentShader = "uniform float uTime, uWater, uLava; uniform vec3 uAmb, uSun, uSunDir, uLamp; varying vec3 vWp;\n#define OCT 3\n" + GLSL_NOISE +
      sh.fragmentShader.replace("#include <envmap_fragment>", `
      vec3 nW = normalize(cross(dFdx(vWp), dFdy(vWp))); if (dot(nW, cameraPosition - vWp) < 0.) nW = -nW;
      vec3 lit = uAmb * (.55 + .45 * max(nW.y, 0.)) + uSun * max(dot(nW, uSunDir), 0.) + uLamp * max(nW.y, 0.);
      vec3 base = diffuseColor.rgb;
      if (vWp.y < uWater) {
        vec2 cp = vWp.xz * 3.1; float c1 = abs(sin(vnoise(cp + uTime * .35) * 6.283)), c2 = abs(sin(vnoise(cp * 1.3 - uTime * .28 + 7.) * 6.283));
        float ca = pow(1. - min(c1, c2), 14.) * smoothstep(uWater - 1.2, uWater - .05, vWp.y);
        base *= mix(vec3(.5, .74, .7), vec3(1.), smoothstep(uWater - .5, uWater, vWp.y)); lit += (uSun + uAmb) * ca * .5;
      }
      outgoingLight = base * lit;
      if (uLava > 0.) { float cr = fbm(vWp.xz * 1.7); float crack = smoothstep(.018, .0, abs(cr - .5)) + .35 * smoothstep(.05, .0, abs(cr - .5)); float pulse = .7 + .3 * sin(uTime * 1.1 + vWp.x * 2.);
        outgoingLight = mix(outgoingLight, vec3(.95, .22, .04) * 1.4 * pulse, clamp(crack, 0., 1.) * uLava); }`);
  };
  m.customProgramCacheKey = () => "pit" + amp + (o.key || "");
  return m;
}
export { pitMat, colorize, mergeG, blade, rot, rockGeo, PLANT_U };
function lightOf(A) {
  const P = skyOf(A.env.sky), lit = P.lit || 0.8;
  const amb = C(P.hor).lerp(C(P.zen), 0.5).multiplyScalar(0.35 + 0.75 * lit);
  const sun = C(P.sunCol || "#ffffff").multiplyScalar((P.sun || 0) * 0.55 * lit);
  if (P.moon) sun.add(C("#9ab0e0").multiplyScalar(P.moon * 0.18));
  return { uAmb: { value: amb }, uSun: { value: sun }, uSunDir: { value: new THREE.Vector3(0.35, 0.8, -0.45).normalize() }, uLamp: { value: new THREE.Color(0.2, 0.14, 0.08) },
    uWater: { value: A.waterY == null ? -99 : A.waterY }, uLava: { value: A.biome.lava || 0 } };
}

// ---------------------------------------------------------------- plants, stones and other scattered things
// each returns a BufferGeometry with vertex colours; instances are tinted and swayed
function colorize(g, fn) {
  const P = g.attributes.position, col = new Float32Array(P.count * 3);
  for (let i = 0; i < P.count; i++) { const c = fn(P.getX(i), P.getY(i), P.getZ(i)); col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3)); return g;
}
function mergeG(list) {
  let n = 0; const parts = list.map((g) => { const q = g.index ? g.toNonIndexed() : g; if (!q.attributes.normal) q.computeVertexNormals(); n += q.attributes.position.count; return q; });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3).fill(1); let o = 0;
  parts.forEach((q) => { pos.set(q.attributes.position.array, o * 3); nor.set(q.attributes.normal.array, o * 3); if (q.attributes.color) col.set(q.attributes.color.array, o * 3); o += q.attributes.position.count; });
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.BufferAttribute(nor, 3)); g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return g;
}
// a tapered, bending blade (grass, reed, leaf of a fern)
function blade(h, w, bend, segs, c0, c1, twist) {
  const pts = [], idx = [], col = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, y = t * h, x = bend * t * t, ww = w * (1 - t * 0.92) / 2, tw = (twist || 0) * t;
    pts.push(x - ww * Math.cos(tw), y, -ww * Math.sin(tw), x + ww * Math.cos(tw), y, ww * Math.sin(tw));
    const c = c0.map((a, k) => a + (c1[k] - a) * t); col.push(...c, ...c);
    if (i < segs) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
function rot(g, rx, ry, rz, x, y, z) { g.rotateX(rx || 0); g.rotateY(ry || 0); g.rotateZ(rz || 0); g.translate(x || 0, y || 0, z || 0); return g; }
function rockGeo(r, seed, c0, c1) {
  const g = new THREE.IcosahedronGeometry(r, 2), P = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i); const k = 0.75 + 0.45 * fbm2(v.x * 5 + seed, v.z * 5 + v.y * 3, seed, 3); v.multiplyScalar(k); v.y *= 0.62; P.setXYZ(i, v.x, v.y, v.z); }
  g.computeVertexNormals();
  return colorize(g, (x, y) => { const t = smooth(-r * 0.5, r * 0.6, y); return c0.map((a, k) => a + (c1[k] - a) * t); });
}
const G = {
  tuft(dry) { const R = rng(dry ? 5 : 3), L = []; const c0 = dry ? [0.45, 0.38, 0.18] : [0.12, 0.24, 0.06], c1 = dry ? [0.82, 0.72, 0.42] : [0.42, 0.62, 0.2];
    for (let i = 0; i < 9; i++) L.push(rot(blade(0.14 + R() * 0.16, 0.018, (R() - 0.5) * 0.08, 4, c0, c1, R()), 0, R() * 6.28, 0, (R() - 0.5) * 0.05, 0, (R() - 0.5) * 0.05)); return mergeG(L); },
  reed() { const R = rng(7), L = []; for (let i = 0; i < 5; i++) L.push(rot(blade(0.55 + R() * 0.35, 0.022, (R() - 0.5) * 0.18, 6, [0.2, 0.28, 0.1], [0.62, 0.64, 0.34], R() * 2), 0, R() * 6.28, 0, (R() - 0.5) * 0.06, 0, (R() - 0.5) * 0.06));
    L.push(rot(new THREE.CapsuleGeometry(0.012, 0.07, 3, 6), 0, 0, 0.05, 0.02, 0.78, 0)); colorize(L[L.length - 1], () => [0.35, 0.22, 0.1]); return mergeG(L); },   // a cat-tail head
  papyrus() { const R = rng(9), L = []; const st = new THREE.CylinderGeometry(0.006, 0.01, 0.75, 3); st.translate(0, 0.375, 0); L.push(colorize(st, () => [0.3, 0.46, 0.16]));
    for (let i = 0; i < 26; i++) { const a = i / 26 * 6.28, b = blade(0.16, 0.006, 0.05, 3, [0.35, 0.5, 0.18], [0.55, 0.66, 0.26], 0); b.rotateZ(-0.9 - R() * 0.4); b.rotateY(a); b.translate(0, 0.75, 0); L.push(b); } return mergeG(L); },
  lotusPad() { const g = new THREE.CircleGeometry(0.13, 20, 0.25, 6.0); g.rotateX(-Math.PI / 2); return colorize(g, (x, y, z) => { const r = Math.hypot(x, z) / 0.13; return [0.18 + 0.1 * r, 0.38 + 0.1 * r, 0.14]; }); },
  lotus() { const L = [], R = rng(12); for (let ring = 0; ring < 2; ring++) for (let i = 0; i < 8; i++) { const p = new THREE.SphereGeometry(0.04, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2); p.scale(0.45, 1.2 - ring * 0.2, 0.25); p.rotateX(0.6 - ring * 0.35); p.translate(0, 0.01, 0.02); p.rotateY(i / 8 * 6.28 + ring * 0.4); L.push(colorize(p, (x, y) => [0.95, 0.62 + y * 2, 0.72 + y * 2])); }
    const c = new THREE.CylinderGeometry(0.018, 0.012, 0.025, 10); c.translate(0, 0.02, 0); L.push(colorize(c, () => [0.95, 0.82, 0.3])); return mergeG(L); },
  fern() { const L = [], R = rng(21); for (let f = 0; f < 6; f++) { const len = 0.28 + R() * 0.14, a = f / 7 * 6.28; const st = blade(len, 0.012, len * 0.6, 6, [0.16, 0.3, 0.08], [0.3, 0.5, 0.14], 0); st.rotateZ(-0.5); L.push(rot(st, 0, a));
      for (let k = 1; k < 7; k++) { const t = k / 7, lf = blade(0.07 * (1 - t * 0.7), 0.024, 0.02, 1, [0.18, 0.36, 0.1], [0.34, 0.56, 0.16], 0); lf.rotateZ(-1.4); const bx = len * 0.6 * t * t, by = len * t; const m = new THREE.Matrix4().makeRotationZ(-0.5); const p = new THREE.Vector3(bx, by, 0).applyMatrix4(m);
        L.push(rot(lf.clone(), 0, 0, 0, p.x, p.y, 0.01).rotateY(a)); lf.rotateY(Math.PI); L.push(rot(lf, 0, 0, 0, p.x, p.y, -0.01).rotateY(a)); } } return mergeG(L); },
  mushroom() { const c = new THREE.SphereGeometry(0.035, 12, 8, 0, 6.28, 0, 1.4); c.scale(1, 0.6, 1); c.translate(0, 0.05, 0); const s = new THREE.CylinderGeometry(0.008, 0.011, 0.05, 8); s.translate(0, 0.025, 0);
    return mergeG([colorize(c, (x, y) => [0.72, 0.28 + y, 0.16]), colorize(s, () => [0.9, 0.86, 0.76])]); },
  rock() { return rockGeo(0.12, 3, [0.3, 0.28, 0.25], [0.55, 0.52, 0.47]); },
  pebble() { return rockGeo(0.03, 5, [0.35, 0.33, 0.3], [0.62, 0.6, 0.55]); },
  redrock() { return rockGeo(0.14, 7, [0.35, 0.14, 0.08], [0.68, 0.32, 0.18]); },
  snowrock() { return rockGeo(0.13, 9, [0.3, 0.3, 0.32], [0.95, 0.96, 1]); },
  mossrock() { return rockGeo(0.14, 11, [0.25, 0.24, 0.22], [0.26, 0.42, 0.14]); },
  spinifex() { const R = rng(31), L = []; for (let i = 0; i < 26; i++) { const b = blade(0.12 + R() * 0.1, 0.008, 0.02, 3, [0.5, 0.5, 0.25], [0.78, 0.72, 0.45], 0); b.rotateZ(-(0.3 + R() * 1.0)); L.push(rot(b, 0, R() * 6.28)); } return mergeG(L); },
  heather() { const R = rng(33), L = []; for (let i = 0; i < 22; i++) { const b = blade(0.1 + R() * 0.1, 0.02, (R() - 0.5) * 0.05, 4, [0.1, 0.14, 0.07], R() < 0.7 ? [0.46, 0.2, 0.44] : [0.22, 0.3, 0.12], R()); b.rotateZ((R() - 0.5) * 0.9); L.push(rot(b, 0, R() * 6.28, 0, (R() - 0.5) * 0.08, 0, (R() - 0.5) * 0.08)); } return mergeG(L); },
  rose() { const R = rng(35), L = []; for (let i = 0; i < 16; i++) { const s = new THREE.IcosahedronGeometry(0.04 + R() * 0.03, 0); s.translate((R() - 0.5) * 0.2, 0.05 + R() * 0.15, (R() - 0.5) * 0.2); L.push(colorize(s, () => [0.12, 0.28 + R() * 0.1, 0.08])); }
    for (let i = 0; i < 7; i++) { const f = new THREE.DodecahedronGeometry(0.022, 0); f.translate((R() - 0.5) * 0.2, 0.12 + R() * 0.12, (R() - 0.5) * 0.2); L.push(colorize(f, () => [0.75, 0.08, 0.14])); } return mergeG(L); },
  flower() { const L = [], s = blade(0.2, 0.006, 0.02, 3, [0.2, 0.36, 0.1], [0.3, 0.5, 0.15], 0); L.push(s); for (let i = 0; i < 5; i++) { const p = new THREE.CircleGeometry(0.014, 6); p.scale(1, 0.55, 1); p.translate(0.016, 0, 0); p.rotateX(-Math.PI / 2); p.rotateY(i / 5 * 6.28); p.translate(0.02, 0.2, 0); L.push(colorize(p, () => [1, 1, 1])); } return mergeG(L); },
  wheat() { const L = [], s = blade(0.55, 0.008, 0.06, 5, [0.55, 0.48, 0.2], [0.85, 0.72, 0.36], 0); L.push(s); const e = new THREE.CapsuleGeometry(0.012, 0.07, 1, 5); e.translate(0.06, 0.6, 0); L.push(colorize(e, () => [0.88, 0.72, 0.36]));
    for (let k = 0; k < 6; k++) { const aw = blade(0.06, 0.002, 0.01, 1, [0.9, 0.8, 0.5], [0.95, 0.88, 0.6], 0); aw.rotateZ(0.3); L.push(rot(aw, 0, k, 0, 0.06, 0.6 + k * 0.012, 0)); } return mergeG(L); },
  leafBig() { const g = new THREE.PlaneGeometry(0.3, 0.5, 4, 6), P = g.attributes.position; for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i) + 0.25; P.setXYZ(i, x * Math.sin(y / 0.5 * Math.PI) * 1.1, y * 0.8, -Math.abs(x) * 0.4 + y * y * 0.6); } g.rotateX(-0.6); g.computeVertexNormals();
    return colorize(g, (x, y) => [0.08, 0.26 + y * 0.3, 0.08]); },
  stalagmite() { const pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(new THREE.Vector2((0.1 * Math.pow(1 - t, 1.2) + 0.006) * (1 + 0.04 * Math.sin(t * 11)), t * 0.62)); } const g = new THREE.LatheGeometry(pts, 12); return colorize(g, (x, y) => [0.45 + y * 0.6, 0.42 + y * 0.55, 0.36 + y * 0.5]); },
  shell() { const g = new THREE.ConeGeometry(0.03, 0.02, 10, 1, true); g.rotateX(Math.PI / 2); return colorize(g, () => [0.95, 0.9, 0.82]); },
  branch() { return colorize(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-0.3, 0.02, 0), new THREE.Vector3(0, 0.06, 0.05), new THREE.Vector3(0.3, 0.02, -0.04)]), 10, 0.018, 5), () => [0.16, 0.11, 0.07]); },
  nopal() { const L = [], R = rng(41); const pad = (x, y, a, s) => { const p = new THREE.SphereGeometry(0.09 * s, 10, 8); p.scale(1, 1.3, 0.25); p.rotateZ(a); p.translate(x, y, 0); L.push(colorize(p, () => [0.22, 0.42, 0.18])); };
    pad(0, 0.11, 0, 1); pad(-0.08, 0.28, 0.5, 0.8); pad(0.08, 0.3, -0.4, 0.8); pad(0.02, 0.45, 0.1, 0.6); return mergeG(L); }
};
const GEO = new Map();
function geoOf(k) { if (!GEO.has(k)) GEO.set(k, k === "drytuft" ? G.tuft(true) : G[k]()); return GEO.get(k); }
const SWAY = { tuft: 0.18, drytuft: 0.2, reed: 0.06, papyrus: 0.05, fern: 0.08, flower: 0.4, wheat: 0.12, leafBig: 0.1, spinifex: 0.05 };

// ---------------------------------------------------------------- biomes
// heights are metres relative to the glass; s runs along the pit's long axis (0..L), t across it (-W/2..W/2)
const BIOME = {
  brook: { tex: "pebble", h: (s, t, A) => -0.78 + 0.1 * fbm2(s * 0.5, t * 0.5, 1) - 0.34 * chan(s, t, A, 0.28), wet: -0.9, water: { y: -0.94, flow: [1, 0], deep: "#0d3a38", shallow: "#4a9a8a" },
    tint: (h, w) => h < w ? [0.7, 0.68, 0.62] : [0.46, 0.6, 0.32], scatter: [["mossrock", 0.12, "bank"], ["pebble", 1.2, "any"], ["tuft", 1.6, "bank"], ["fern", 0.16, "bank"]] },
  forestbrook: { like: "brook", tex: "leaf", tint: (h, w) => h < w ? [0.7, 0.68, 0.62] : [0.5, 0.42, 0.3], scatter: [["mossrock", 0.14, "bank"], ["pebble", 1.2, "any"], ["fern", 0.5, "bank"], ["mushroom", 0.4, "bank"], ["tuft", 0.8, "bank"], ["branch", 0.08, "bank"]] },
  river: { tex: "mud", h: (s, t, A) => -0.72 + 0.08 * fbm2(s * 0.4, t * 0.4, 2) - 0.42 * chan(s, t, A, 0.42), wet: -0.88, water: { y: -0.9, flow: [0.7, 0], deep: "#1a3a2c", shallow: "#5a8a60", murk: 0.15 },
    tint: (h, w) => h < w ? [0.7, 0.62, 0.5] : [0.62, 0.66, 0.4], scatter: [["reed", 0.9, "shore"], ["tuft", 1.2, "bank"], ["pebble", 0.5, "any"], ["rock", 0.05, "bank"]] },
  nile: { tex: "mud", h: (s, t, A) => -0.7 + 0.08 * fbm2(s * 0.4, t * 0.4, 4) - 0.45 * chan(s, t, A, 0.4), wet: -0.88, water: { y: -0.9, flow: [0.6, 0], deep: "#233a22", shallow: "#6a8a54", murk: 0.2 },
    tint: (h, w) => h < w ? [0.66, 0.58, 0.44] : [0.82, 0.72, 0.52], scatter: [["papyrus", 1.3, "shore"], ["reed", 0.6, "shore"], ["drytuft", 0.6, "bank"], ["lotusPad", 0.4, "water"]] },
  marsh: { tex: "mud", h: (s, t) => -1.0 + 0.3 * smooth(0.5, 0.8, fbm2(s * 0.45, t * 0.45, 6)), wet: -0.88, water: { y: -0.9, flow: [0.15, 0.1], calm: 0.6, deep: "#1e3228", shallow: "#627a58", murk: 0.25 },
    tint: () => [0.62, 0.62, 0.46], scatter: [["reed", 3.5, "shore"], ["papyrus", 0.4, "shore"]] },
  lake: { tex: "pebble", h: (s, t, A) => -1.1 + 0.55 * smooth(A.L * 0.62, A.L * 0.95, s) + 0.05 * fbm2(s, t, 8), wet: -0.88, water: { y: -0.88, flow: [0.1, 0.05], calm: 0.5, deep: "#0f3446", shallow: "#4a8aa0" },
    tint: (h, w) => h < w ? [0.72, 0.7, 0.62] : [0.86, 0.8, 0.64], scatter: [["reed", 1.2, "shore"], ["pebble", 1.4, "any"], ["tuft", 0.6, "bank"]] },
  pond: { tex: "mud", h: (s, t, A) => -1.08 + 0.4 * edge(s, t, A, 0.7), wet: -0.88, water: { y: -0.88, flow: [0.05, 0.03], calm: 0.85, deep: "#16302a", shallow: "#4a7a64", murk: 0.1 },
    tint: (h, w) => h < w ? [0.6, 0.56, 0.46] : [0.46, 0.58, 0.3], scatter: [["lotusPad", 3.2, "water"], ["lotus", 0.5, "water"], ["reed", 0.5, "shore"], ["tuft", 1, "bank"]] },
  pool: { tex: "lime", h: (s, t, A) => -1.12 + 0.45 * edge(s, t, A, 0.35), wet: -0.9, water: { y: -0.86, flow: [0.04, 0.02], calm: 0.9, deep: "#0c3444", shallow: "#2e7c92", alpha: 0.55 },
    tint: (h) => h < -0.9 ? [0.62, 0.78, 0.82] : [0.86, 0.82, 0.74], scatter: [["lotusPad", 0.3, "water"]] },
  shore: { tex: "sand", h: (s, t, A) => -1.2 + 0.62 * smooth(0, A.L, s) + 0.04 * fbm2(s * 0.6, t * 0.6, 10), wet: -0.82, water: { y: -0.86, flow: [0.2, 0], deep: "#0b4a6a", shallow: "#48b0c0", shore: true },
    tint: (h, w) => h < w + 0.03 ? [0.7, 0.62, 0.48] : [1, 0.95, 0.85], scatter: [["shell", 1.4, "dry"], ["rock", 0.1, "any"], ["pebble", 0.8, "wet"]] },
  desert: { tex: "dune", h: (s, t) => -0.95 + 0.26 * Math.pow(fbm2(s * 0.22 + t * 0.1, t * 0.18, 12, 3), 1.6) + 0.05 * Math.sin(s * 1.3 + t * 0.4), tint: () => [1, 1, 1], scatter: [["rock", 0.08, "any"], ["drytuft", 0.25, "any"], ["pebble", 0.6, "any"]] },
  redearth: { tex: "red", h: (s, t) => -0.9 + 0.12 * fbm2(s * 0.3, t * 0.3, 14), tint: () => [1, 1, 1], scatter: [["spinifex", 2.4, "any"], ["redrock", 0.15, "any"], ["pebble", 0.8, "any"]] },
  steppe: { tex: "dry", h: (s, t) => -0.88 + 0.14 * fbm2(s * 0.3, t * 0.3, 16), tint: () => [1, 1, 1], scatter: [["drytuft", 3.2, "any"], ["rock", 0.14, "any"], ["pebble", 0.5, "any"], ["flower", 0.2, "any"]] },
  meadow: { tex: "grass", h: (s, t) => -0.85 + 0.12 * fbm2(s * 0.3, t * 0.3, 18), tint: () => [1, 1, 1], scatter: [["tuft", 6, "any"], ["flower", 1.4, "any"], ["rock", 0.04, "any"]] },
  field: { tex: "soil", h: (s, t) => -0.86 + 0.05 * Math.sin(t * 9) + 0.04 * fbm2(s * 0.4, t * 0.4, 20), tint: () => [0.85, 0.8, 0.75], scatter: [["wheat", 22, "rows"], ["flower", 0.6, "any"], ["tuft", 1, "any"]] },
  forest: { tex: "leaf", h: (s, t) => -0.84 + 0.16 * fbm2(s * 0.35, t * 0.35, 22), tint: () => [1, 1, 1], scatter: [["fern", 0.9, "any"], ["mushroom", 0.8, "any"], ["mossrock", 0.12, "any"], ["branch", 0.14, "any"], ["tuft", 0.6, "any"]] },
  heath: { tex: "moss", h: (s, t) => -0.86 + 0.16 * fbm2(s * 0.3, t * 0.3, 24), tint: () => [0.6, 0.6, 0.6], scatter: [["heather", 5, "any"], ["drytuft", 3, "any"], ["rock", 0.1, "any"], ["branch", 0.2, "any"]] },
  snow: { tex: "snow", h: (s, t, A) => -0.8 + 0.14 * fbm2(s * 0.3, t * 0.3, 26) - 0.22 * chan(s, t, A, 0.2), ice: -0.92, tint: () => [1, 1, 1], scatter: [["snowrock", 0.18, "bank"], ["drytuft", 0.5, "bank"]] },
  cave: { tex: "lime", h: (s, t) => -0.9 + 0.2 * fbm2(s * 0.4, t * 0.4, 28) - 0.12 * smooth(0.55, 0.3, fbm2(s * 0.25, t * 0.25, 29)), wet: -0.96, water: { y: -0.97, flow: [0.02, 0.02], calm: 0.95, deep: "#1a2224", shallow: "#4a5a58", alpha: 0.5, drips: true },
    tint: () => [0.9, 0.86, 0.8], scatter: [["stalagmite", 0.55, "bank"], ["rock", 0.3, "bank"], ["pebble", 0.8, "any"]] },
  ruins: { tex: "soil", h: (s, t) => -0.86 + 0.08 * fbm2(s * 0.3, t * 0.3, 30), tint: () => [0.9, 0.84, 0.74], extras: "ruins", scatter: [["drytuft", 1.2, "any"], ["rock", 0.12, "any"], ["pebble", 0.6, "any"]] },
  garden: { tex: "grass", h: (s, t, A) => -0.84 - 0.2 * (Math.abs(t) < 0.35 || Math.abs(s - A.L / 2) < 0.35 ? 1 : 0), wet: -0.95, water: { y: -0.96, flow: [0.3, 0], calm: 0.5, deep: "#1a4a5a", shallow: "#5aa8b8", alpha: 0.5 },
    tint: (h) => h < -0.95 ? [0.86, 0.82, 0.74] : [1, 1, 1], extras: "garden", scatter: [["rose", 0.7, "bank"], ["flower", 3, "bank"], ["tuft", 6, "bank"]] },
  zen: { tex: "gravel", h: (s, t, A) => -0.86 - 0.12 * smooth(1.2, 0.6, Math.hypot(s - A.L * 0.78, t - A.W * 0.2)), wet: -0.93, water: { y: -0.94, flow: [0.05, 0.03], calm: 0.85, deep: "#1c3a36", shallow: "#5a8a78" },
    tint: () => [1, 1, 1], extras: "zen", scatter: [["tuft", 0.4, "bank"]] },
  jungle: { tex: "leaf", h: (s, t, A) => -0.8 + 0.18 * fbm2(s * 0.35, t * 0.35, 32) - 0.35 * smooth(1.3, 0.7, Math.hypot(s - A.L / 2, t)), wet: -0.95, water: { y: -0.97, flow: [0.04, 0.02], calm: 0.8, deep: "#0c3a34", shallow: "#2a8a78" },
    tint: (h, w) => h < w + 0.02 ? [0.55, 0.55, 0.45] : [0.62, 0.6, 0.46], scatter: [["leafBig", 3, "bank"], ["fern", 2.6, "bank"], ["mossrock", 0.2, "bank"], ["mushroom", 0.6, "bank"], ["branch", 0.25, "bank"], ["flower", 0.5, "bank"], ["tuft", 2, "bank"]] },
  terraces: { tex: "grass", h: (s, t, A) => -1.15 + Math.floor(smooth(0, A.L, s) * 4.999) * 0.14 + 0.02 * fbm2(s, t, 34), tint: () => [0.62, 0.72, 0.5], extras: "terraces", scatter: [["tuft", 7, "any"], ["flower", 0.8, "any"], ["rock", 0.08, "any"]] },
  ash: { tex: "ash", h: (s, t) => -0.9 + 0.16 * fbm2(s * 0.35, t * 0.35, 36), lava: 1, tint: () => [1, 1, 1], scatter: [["rock", 0.2, "any"], ["pebble", 0.8, "any"]], embers: true },
  void: { tex: "ash", void: true }
};
function chan(s, t, A, frac) {             // 1 in the bed of a meandering channel down the long axis, 0 on the banks
  const hw = Math.max(0.28, A.W * frac * 0.5), amp = Math.max(0, A.W / 2 - hw - 0.35) * 0.8;
  const c = amp * Math.sin(s * 0.55 + A.seed) * Math.cos(s * 0.21 + A.seed * 0.5);
  return smooth(hw, hw * 0.45, Math.abs(t - c));
}
function edge(s, t, A, m) {                // 0 in the middle of the pit, 1 within m of its walls
  const d = Math.min(s, A.L - s, t + A.W / 2, A.W / 2 - t);
  return smooth(m, 0, d) + 0.25 * smooth(0.55, 0.8, fbm2(s * 0.5, t * 0.5, 40)) * smooth(0, m * 2, d);
}
export function biomeOf(k) { const b = BIOME[k] || BIOME.meadow; return b.like ? Object.assign({}, BIOME[b.like], b) : b; }

// ---------------------------------------------------------------- shared materials
const PLANT_U = { uTime: { value: 0 } };
function plantMat(kind, A) { return pitMat({ side: THREE.DoubleSide, sway: SWAY[kind] || 0 }, A.LU); }
let STONE = null, BRONZE = null, GLASS = null, ICE = null;
function sharedMats() {
  if (STONE) return;
  const rt = groundTex("rock");
  STONE = new THREE.MeshStandardMaterial({ map: rt, color: "#8a7a68", roughness: 0.95 });
  BRONZE = new THREE.MeshStandardMaterial({ color: "#3a2814", metalness: 0.5, roughness: 0.5 });
  GLASS = new THREE.MeshPhongMaterial({ color: "#d8eef2", specular: "#ffffff", shininess: 140, transparent: true, opacity: 0.1, depthWrite: false });
  ICE = new THREE.MeshStandardMaterial({ color: "#cfe6f2", roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.72 });
  [STONE, BRONZE, GLASS, ICE].forEach((m) => { m.userData.shared = true; });
}

// ---------------------------------------------------------------- one area: its skylight and its pit
function localFrame(A) {
  const h = A.hole;
  if (A.axis === "x") { A.L = h.x1 - h.x0; A.W = h.z1 - h.z0; A.toW = (s, t) => [h.x0 + s, (h.z0 + h.z1) / 2 + t]; A.toL = (x, z) => [x - h.x0, z - (h.z0 + h.z1) / 2]; }
  else { A.L = h.z1 - h.z0; A.W = h.x1 - h.x0; A.toW = (s, t) => [(h.x0 + h.x1) / 2 + t, h.z0 + s]; A.toL = (x, z) => [z - h.z0, x - (h.x0 + h.x1) / 2]; }
}
function buildSky(A, q) {
  const r = A.sky, g = new THREE.Group();
  const mat = skyMaterial(A.env.sky, q); A.skyMat = mat;
  const fa = A.env.fauna || []; mat.uniforms.uRaptor.value = fa.includes("condor") ? 1.4 : fa.includes("eagle") ? 1.1 : fa.includes("hawk") ? 0.8 : 0; mat.uniforms.uGulls.value = fa.includes("gulls") ? 1 : 0;
  const p = new THREE.Mesh(new THREE.PlaneGeometry(r.x1 - r.x0, r.z1 - r.z0), mat);
  p.rotation.x = Math.PI / 2; p.position.set((r.x0 + r.x1) / 2, r.y - 0.02, (r.z0 + r.z1) / 2); g.add(p);
  // a bronze frame round the skylight, with glazing bars
  sharedMats();
  const L = [], bar = (x0, z0, x1, z1, w) => { const b = new THREE.BoxGeometry(Math.max(w, Math.abs(x1 - x0)), 0.08, Math.max(w, Math.abs(z1 - z0))); b.translate((x0 + x1) / 2, r.y - 0.05, (z0 + z1) / 2); L.push(b); };
  bar(r.x0, r.z0, r.x1, r.z0, 0.14); bar(r.x0, r.z1, r.x1, r.z1, 0.14); bar(r.x0, r.z0, r.x0, r.z1, 0.14); bar(r.x1, r.z0, r.x1, r.z1, 0.14);
  const nx = Math.max(1, Math.round((r.x1 - r.x0) / 2.4)), nz = Math.max(1, Math.round((r.z1 - r.z0) / 2.4));
  for (let i = 1; i < nx; i++) { const x = r.x0 + (r.x1 - r.x0) * i / nx; bar(x, r.z0, x, r.z1, 0.05); }
  for (let i = 1; i < nz; i++) { const z = r.z0 + (r.z1 - r.z0) * i / nz; bar(r.x0, z, r.x1, z, 0.05); }
  g.add(new THREE.Mesh(mergeG(L), BRONZE));
  g.matrixAutoUpdate = true;
  return g;
}
function buildPit(A, q, faunaFn) {
  sharedMats();
  const B = biomeOf(A.env.ground), h = A.hole, g = new THREE.Group(), R = rng(A.seedN), D = 1.35, z0 = A.seed;
  A.lit = skyOf(A.env.sky).lit || 0.8; A.biome = B; A.waterY = B.water ? B.water.y : (B.ice != null ? B.ice : null); A.anim = []; A.LU = lightOf(A);
  // walls of the pit
  const W = [], wq = (ax, az, bx, bz) => { const len = Math.hypot(bx - ax, bz - az), gq = new THREE.PlaneGeometry(len, D); gq.translate(0, -D / 2, 0); gq.rotateY(Math.atan2(-(bz - az), bx - ax)); gq.translate((ax + bx) / 2, 0, (az + bz) / 2); W.push(gq); };
  wq(h.x1, h.z0, h.x0, h.z0); wq(h.x0, h.z1, h.x1, h.z1); wq(h.x0, h.z0, h.x0, h.z1); wq(h.x1, h.z1, h.x1, h.z0);
  const walls = new THREE.Mesh(colorize(mergeG(W), (x, y) => { const k = 0.18 + 0.1 * smooth(-1.3, 0, y) + 0.05 * fbm2(x * 3, y * 3 + z0, 5, 2); return [k * 1.1, k, k * 0.88]; }), pitMat({}, A.LU)); g.add(walls);
  // ground
  const HF = (x, z) => { const [s, t] = A.toL(x, z); return B.h ? B.h(s, t, A) + (B.flat ? 0 : 0.03 * (fbm2(s * 2.6, t * 2.6, 91, 3) - 0.5)) : -1.2; };
  A.groundH = HF;
  if (B.void) {
    const vm = voidMaterial(q); A.anim.push(vm);
    const vp = new THREE.Mesh(new THREE.PlaneGeometry(h.x1 - h.x0, h.z1 - h.z0), vm); vp.rotation.x = -Math.PI / 2; vp.position.set((h.x0 + h.x1) / 2, -D + 0.02, (h.z0 + h.z1) / 2); g.add(vp);
    walls.material = new THREE.MeshBasicMaterial({ color: "#050308" });
  } else {
    const step = q > 1 ? 0.14 : 0.22, nx = Math.max(2, Math.round((h.x1 - h.x0) / step)), nz = Math.max(2, Math.round((h.z1 - h.z0) / step));
    const gg = new THREE.PlaneGeometry(h.x1 - h.x0, h.z1 - h.z0, nx, nz); gg.rotateX(-Math.PI / 2); gg.translate((h.x0 + h.x1) / 2, 0, (h.z0 + h.z1) / 2);
    const P = gg.attributes.position, uv = gg.attributes.uv, col = new Float32Array(P.count * 3), wy = B.wet != null ? B.wet : -9;
    for (let i = 0; i < P.count; i++) {
      const x = P.getX(i), z = P.getZ(i), y = HF(x, z); P.setY(i, y); uv.setXY(i, x / 1.6, z / 1.6);
      const [ls, lt] = A.toL(x, z), wd = Math.min(ls, A.L - ls, lt + A.W / 2, A.W / 2 - lt), ao = 0.45 + 0.55 * smooth(0, 0.9, wd);
      const c = B.tint(y, wy), n = (0.85 + 0.3 * fbm2(x * 1.3, z * 1.3, 77, 3)) * ao;
      col.set([c[0] * n, c[1] * n, c[2] * n], i * 3);
    }
    gg.setAttribute("color", new THREE.BufferAttribute(col, 3)); gg.computeVertexNormals();
    const gm = pitMat({ map: groundTex(B.tex) }, A.LU); A.groundMat = gm;
    const ground = new THREE.Mesh(gg, gm); ground.receiveShadow = false; g.add(ground);
  }
  // water
  if (B.water) {
    const wm = waterMaterial(Object.assign({ sky: skyOf(A.env.sky).hor }, B.water)); A.waterMat = wm;
    ["uDeep", "uShallow", "uSky"].forEach((k) => wm.uniforms[k].value.multiplyScalar(A.lit));
    wm.uniforms.uLamp.value.set(A.lamp[0], A.lamp[1], A.lamp[2]);
    const flow = B.water.flow || [0, 0], fw = A.axis === "x" ? flow : [flow[1], flow[0]]; wm.uniforms.uFlow.value.set(fw[0], fw[1]);
    const seg = B.water.shore ? 48 : 1;
    const wp = new THREE.Mesh(new THREE.PlaneGeometry(h.x1 - h.x0 - 0.02, h.z1 - h.z0 - 0.02, seg, seg), wm); wp.rotation.x = -Math.PI / 2; wp.position.set((h.x0 + h.x1) / 2, B.water.y, (h.z0 + h.z1) / 2); wp.renderOrder = 1; g.add(wp);
    if (B.water.shore) { const dir = A.axis === "x" ? [1, 0] : [0, 1]; const [sx, sz] = A.toW(0, 0); wm.uniforms.uShore.value.set(dir[0], dir[1], 0, 1); A.shore = { dir, o: dir[0] * sx + dir[1] * sz };
      // the shoreline: where the sand meets the still water level
      let s0 = 0; for (let s = 0; s < A.L; s += 0.02) { if (B.h(s, 0, A) > B.water.y) { s0 = s; break; } } wm.uniforms.uShore.value.z = A.shore.o + s0; }
  }
  if (B.ice != null) { const ice = new THREE.MeshBasicMaterial({ color: A.LU.uAmb.value.clone().multiplyScalar(1.5).lerp(C("#dff0ff"), 0.35), transparent: true, opacity: 0.8, map: iceTex() }); const ip = new THREE.Mesh(new THREE.PlaneGeometry(h.x1 - h.x0 - 0.02, h.z1 - h.z0 - 0.02), ice); ip.rotation.x = -Math.PI / 2; ip.position.set((h.x0 + h.x1) / 2, B.ice, (h.z0 + h.z1) / 2); g.add(ip); A.waterY = B.ice; }
  // scattered plants and stones
  const area = A.L * A.W, wy = A.waterY != null ? A.waterY : -99, M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), Sc = new THREE.Vector3(), E = new THREE.Euler(), cc = new THREE.Color();
  const want = (B.scatter || []).map(([kind, dens]) => dens * area * (q > 1 ? 1 : 0.55) * geoOf(kind).attributes.position.count / 3);
  const budget = (q > 1 ? 70000 : 28000) * (A.kind === "room" ? 1 : 0.6), total = want.reduce((a, b) => a + b, 0), scale = Math.min(1, budget / Math.max(1, total));
  (B.scatter || []).forEach(([kind, dens, where]) => {
    const n = Math.round(dens * area * (q > 1 ? 1 : 0.55) * scale); if (!n) return;
    const im = new THREE.InstancedMesh(geoOf(kind), plantMat(kind, A), n); let k = 0;
    for (let tries = 0; tries < n * 12 && k < n; tries++) {
      const s = 0.12 + R() * (A.L - 0.24), t = (R() - 0.5) * (A.W - 0.24), [x, z] = A.toW(s, t), y = HF(x, z);
      let ok = true, yy = y;
      if (where === "bank") ok = y > wy + 0.02;
      else if (where === "water") { ok = y < wy - 0.06; yy = wy + 0.003; }
      else if (where === "shore") ok = Math.abs(y - wy) < 0.07 || (y > wy && y < wy + 0.12 && R() < 0.4);
      else if (where === "wet") ok = y > wy - 0.08 && y < wy + 0.04;
      else if (where === "dry") ok = y > wy + 0.05;
      else if (where === "rows") ok = Math.sin(t * 9) > 0.55;
      else ok = y > wy - 0.01 || kind === "pebble";
      if (!ok) continue;
      const sc = 0.7 + R() * 0.6;
      E.set(kind === "lotusPad" ? 0 : (R() - 0.5) * 0.15, R() * 6.28, kind === "lotusPad" ? 0 : (R() - 0.5) * 0.15); Q.setFromEuler(E);
      M4.compose(V.set(x, yy - (kind.includes("rock") ? 0.03 : 0), z), Q, Sc.set(sc, sc * (kind === "reed" || kind === "papyrus" ? 0.8 + R() * 0.5 : 1), sc)); im.setMatrixAt(k, M4);
      const [ls, lt] = A.toL(x, z), wd = Math.min(ls, A.L - ls, lt + A.W / 2, A.W / 2 - lt), ao = 0.5 + 0.5 * smooth(0, 0.9, wd);
      const f = (0.8 + R() * 0.4) * ao; if (kind === "flower") cc.setHSL([0.0, 0.13, 0.75, 0.83, 0.15][Math.floor(R() * 5)], 0.75, 0.6 * ao); else cc.setRGB(f, f, f); im.setColorAt(k, cc); k++;
    }
    im.count = k; im.frustumCulled = false; if (k) g.add(im); else im.dispose();
  });
  if (B.extras) EXTRAS[B.extras](A, g, R);
  if (B.embers) { const e = embers(A, R); g.add(e); A.embers = e; }
  if (B.water && B.water.drips) A.drips = true;
  // the glass over it all, on a bronze grid
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(h.x1 - h.x0, h.z1 - h.z0), GLASS); glass.rotation.x = -Math.PI / 2; glass.position.set((h.x0 + h.x1) / 2, 0.002, (h.z0 + h.z1) / 2); glass.renderOrder = 3; g.add(glass);
  const L = [], strip = (x0, z0, x1, z1, w, y) => { const b = new THREE.BoxGeometry(Math.max(w, Math.abs(x1 - x0)), 0.014, Math.max(w, Math.abs(z1 - z0))); b.translate((x0 + x1) / 2, y || 0.004, (z0 + z1) / 2); L.push(b); };
  strip(h.x0, h.z0, h.x1, h.z0, 0.1); strip(h.x0, h.z1, h.x1, h.z1, 0.1); strip(h.x0, h.z0, h.x0, h.z1, 0.1); strip(h.x1, h.z0, h.x1, h.z1, 0.1);
  const gx = Math.max(1, Math.round((h.x1 - h.x0) / 1.8)), gz = Math.max(1, Math.round((h.z1 - h.z0) / 1.8));
  for (let i = 1; i < gx; i++) { const x = h.x0 + (h.x1 - h.x0) * i / gx; strip(x, h.z0, x, h.z1, 0.02); }
  for (let i = 1; i < gz; i++) { const z = h.z0 + (h.z1 - h.z0) * i / gz; strip(h.x0, z, h.x1, z, 0.02); }
  g.add(new THREE.Mesh(mergeG(L), BRONZE));
  if (faunaFn) { const F = faunaFn(A, q); if (F) { g.add(F.group); A.fauna = F; } }
  return g;
}

// special furniture for a few grounds
const EXTRAS = {
  ruins(A, g, R) {
    const mos = mosaicTex(), mm = pitMat({ map: mos }, A.LU);
    for (let i = 0; i < 5; i++) { const w = 1.8 + R() * 1.6, d = 1.4 + R() * 1.2, s = 1 + R() * (A.L - 2), t = (R() - 0.5) * (A.W - 1.6), [x, z] = A.toW(s, t);
      const sh = new THREE.Shape(); const pts = 9; for (let k = 0; k < pts; k++) { const a = k / pts * 6.28, r = 0.75 + R() * 0.25; sh[k ? "lineTo" : "moveTo"](Math.cos(a) * w / 2 * r, Math.sin(a) * d / 2 * r); }
      const pg = colorize(new THREE.ShapeGeometry(sh), () => [1, 1, 1]); pg.rotateX(-Math.PI / 2); const uv = pg.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * 0.5 + 0.5, uv.getY(k) * 0.5 + 0.5);
      const p = new THREE.Mesh(pg, mm); p.position.set(x, A.groundH(x, z) + 0.015, z); p.rotation.y = R() * 3; g.add(p); }
    const L = [];
    for (let i = 0; i < 9; i++) { const s = 0.6 + R() * (A.L - 1.2), t = (R() - 0.5) * (A.W - 1.2), [x, z] = A.toW(s, t), y = A.groundH(x, z);
      if (R() < 0.6) { const c = new THREE.CylinderGeometry(0.2, 0.21, 0.36, 40, 1); const cp = c.attributes.position; for (let v = 0; v < cp.count; v++) { const a = Math.atan2(cp.getZ(v), cp.getX(v)), k = 1 - 0.05 * Math.pow(Math.abs(Math.sin(a * 10)), 0.5); if (Math.hypot(cp.getX(v), cp.getZ(v)) > 0.15) { cp.setX(v, cp.getX(v) * k); cp.setZ(v, cp.getZ(v) * k); } } c.computeVertexNormals(); c.rotateZ(Math.PI / 2 * (R() < 0.5 ? 1 : 0)); c.rotateY(R() * 3); c.translate(x, y + 0.14, z); const cv = 0.6 + R() * 0.2; L.push(colorize(c, (x, y) => [cv, cv * 0.95, cv * 0.86])); }
      else { const b = new THREE.BoxGeometry(0.5, 0.26, 0.3); b.rotateY(R() * 3); b.translate(x, y + 0.1, z); const bv = 0.5 + R() * 0.2; L.push(colorize(b, () => [bv, bv * 0.92, bv * 0.8])); } }
    g.add(new THREE.Mesh(mergeG(L), pitMat({}, A.LU)));
  },
  garden(A, g) {
    const L = [], y0 = -0.86, [cx, cz] = A.toW(A.L / 2, 0);
    // stone kerbs along the two crossing channels, and a fountain basin at the crossing
    const kerb = (s0, t0, s1, t1) => { const [x0, z0] = A.toW(s0, t0), [x1, z1] = A.toW(s1, t1); const b = new THREE.BoxGeometry(Math.max(0.08, Math.abs(x1 - x0)), 0.06, Math.max(0.08, Math.abs(z1 - z0))); b.translate((x0 + x1) / 2, y0 + 0.01, (z0 + z1) / 2); L.push(colorize(b, () => [0.88, 0.84, 0.76])); };
    [-0.39, 0.39].forEach((t) => { kerb(0.1, t, A.L / 2 - 0.39, t); kerb(A.L / 2 + 0.39, t, A.L - 0.1, t); });
    [-0.39, 0.39].forEach((d) => { kerb(A.L / 2 + d, -A.W / 2 + 0.1, A.L / 2 + d, -0.39); kerb(A.L / 2 + d, 0.39, A.L / 2 + d, A.W / 2 - 0.1); });
    const basin = new THREE.CylinderGeometry(0.55, 0.6, 0.18, 32, 1, true); basin.translate(cx, y0 - 0.02, cz); L.push(colorize(basin, () => [0.9, 0.86, 0.78]));
    const rim = new THREE.TorusGeometry(0.575, 0.04, 8, 40); rim.rotateX(Math.PI / 2); rim.translate(cx, y0 + 0.07, cz); L.push(colorize(rim, () => [0.92, 0.88, 0.8]));
    const col = new THREE.CylinderGeometry(0.05, 0.08, 0.35, 12); col.translate(cx, y0 + 0.05, cz); L.push(colorize(col, () => [0.88, 0.84, 0.76]));
    const bowl = new THREE.SphereGeometry(0.16, 16, 8, 0, 6.28, Math.PI / 2, Math.PI / 2); bowl.translate(cx, y0 + 0.28, cz); L.push(colorize(bowl, () => [0.88, 0.84, 0.76]));
    g.add(new THREE.Mesh(mergeG(L), pitMat({}, A.LU)));
    // the fountain's jet: a column of falling droplets
    A.fountain = [cx, y0 + 0.3, cz];
  },
  zen(A, g, R) {                      // three groups of standing stones on islands of moss
    const L = [];
    [[0.25, -0.2], [0.5, 0.25], [0.2, 0.3]].forEach(([fs, ft], gi) => {
      const [cx, cz] = A.toW(A.L * fs, A.W * ft), n = 3 - (gi % 2);
      const moss = new THREE.CircleGeometry(0.55, 24); moss.rotateX(-Math.PI / 2); moss.translate(cx, A.groundH(cx, cz) + 0.012, cz); L.push(colorize(moss, () => [0.2, 0.34, 0.12]));
      for (let k = 0; k < n; k++) { const r = rockGeo(0.16 + R() * 0.12, gi * 5 + k, [0.22, 0.21, 0.2], [0.48, 0.46, 0.42]); r.scale(1, 1.6 + R(), 1); r.translate(cx + (R() - 0.5) * 0.5, A.groundH(cx, cz) + 0.08, cz + (R() - 0.5) * 0.5); L.push(r); }
    });
    g.add(new THREE.Mesh(mergeG(L), pitMat({}, A.LU)));
  },
  terraces(A, g, R) {
    const L = [];
    for (let k = 1; k < 5; k++) { const s = A.L * k / 5, y = -1.15 + (k - 1) * 0.14; for (let t = -A.W / 2; t < A.W / 2 - 0.01; t += 0.2) { const [x, z] = A.toW(s + 0.03, t + 0.1); const b = new THREE.BoxGeometry(0.19, 0.15, 0.1); b.translate(0, 0, 0); if (A.axis === "z") b.rotateY(Math.PI / 2); b.translate(x, y + 0.05 + (R() - 0.5) * 0.01, z); const c = 0.5 + R() * 0.15; L.push(colorize(b, () => [c, c * 0.95, c * 0.86])); } }
    g.add(new THREE.Mesh(mergeG(L), pitMat({}, A.LU)));
  }
};
let ICET = null;
function iceTex() {                                   // cracks and trapped bubbles in the ice
  if (ICET) return ICET;
  const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d"), R = rng(71);
  g.fillStyle = "#e8f2f8"; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 1;
  for (let i = 0; i < 18; i++) { let x = R() * 256, y = R() * 256; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (R() - 0.5) * 60; y += (R() - 0.5) * 60; g.lineTo(x, y); } g.stroke(); }
  for (let i = 0; i < 90; i++) { g.fillStyle = "rgba(255,255,255,.7)"; g.beginPath(); g.arc(R() * 256, R() * 256, 0.6 + R() * 1.6, 0, 6.28); g.fill(); }
  ICET = new THREE.CanvasTexture(c); ICET.colorSpace = THREE.SRGBColorSpace; ICET.wrapS = ICET.wrapT = THREE.RepeatWrapping; ICET.repeat.set(3, 3); return ICET;
}
let MOS = null;
function mosaicTex() {
  if (MOS) return MOS;
  const c = document.createElement("canvas"); c.width = c.height = 512; const g = c.getContext("2d"), R = rng(61);
  g.fillStyle = "#d8c8a4"; g.fillRect(0, 0, 512, 512);
  const cols = ["#8c3b24", "#e0d4b4", "#2e2a24", "#a8743e", "#4a6a5a", "#c89a3a"];
  for (let y = 0; y < 512; y += 9) for (let x = 0; x < 512; x += 9) {
    const dx = x - 256, dy = y - 256, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
    let k = Math.floor(d / 30) % 3 === 0 ? 2 : (Math.floor(d / 30) % 3 === 1 ? 3 : 1);
    if (d < 70) k = (Math.floor((a + 3.2) * 8 / 6.28) % 2) ? 0 : 5;
    if (Math.abs(dx) > 225 || Math.abs(dy) > 225) k = (Math.floor(x / 27) + Math.floor(y / 27)) % 2 ? 2 : 1;
    if (R() < 0.04) continue;                                               // lost tesserae
    g.fillStyle = cols[k]; g.fillRect(x + (R() - 0.5) * 1.5, y + (R() - 0.5) * 1.5, 8, 8);
  }
  MOS = new THREE.CanvasTexture(c); MOS.colorSpace = THREE.SRGBColorSpace; return MOS;
}
function embers(A, R) {
  const n = 160, pos = new Float32Array(n * 3), seed = new Float32Array(n);
  for (let i = 0; i < n; i++) { const [x, z] = A.toW(R() * A.L, (R() - 0.5) * A.W); pos.set([x, -0.9, z], i * 3); seed[i] = R(); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("seed", new THREE.BufferAttribute(seed, 1));
  const m = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `uniform float uTime; attribute float seed; varying float vA; void main(){ vec3 p = position; float t = fract(uTime * (.08 + seed * .1) + seed); p.y += t * .85; p.x += sin(uTime * .9 + seed * 20.) * .08 * t; vA = sin(t * 3.14) * (.5 + seed * .5);
      vec4 mv = modelViewMatrix * vec4(p, 1.); gl_PointSize = (18. + seed * 18.) / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - .5); gl_FragColor = vec4(1., .45, .12, vA * smoothstep(.5, 0., d)); }` });
  const p = new THREE.Points(g, m); p.frustumCulled = false; return p;
}

// ---------------------------------------------------------------- the manager
// opt: { scene, quality (1 phone, 2 desktop), fauna(area, q) -> { group, update(dt, t, area) } }
export function createWorld(opt) {
  const q = opt.quality || 2, areas = [], events = [];
  let time = 0, flashNow = 0, builtThisFrame = 0;
  function addArea(a) {
    const A = Object.assign({ seed: areas.length * 1.7 + 0.3, seedN: areas.length * 97 + 11 }, a);
    A.env = ENV[A.id] || ENV["cor:04-axial-age"];
    localFrame(A);
    A.skyG = buildSky(A, q); A.skyG.visible = false; opt.scene.add(A.skyG);
    A.pit = null; A.flash = 0; A.boltT = 0; A.nextBolt = 4 + Math.random() * 8; A.splash = [0, 1, 2, 3].map(() => [0, 0, 0, 99]); A.si = 0;
    areas.push(A);
    return A;
  }
  const dist = (r, p) => Math.hypot(Math.max(r.x0 - p.x, 0, p.x - r.x1), Math.max(r.z0 - p.z, 0, p.z - r.z1));
  function dropPit(A) {
    A.pit.traverse((o) => { if (o.geometry && !isShared(o.geometry)) o.geometry.dispose(); [].concat(o.material || []).forEach((m) => { if (!m.userData.shared) m.dispose(); }); });
    opt.scene.remove(A.pit); A.pit = null; A.fauna = null;
  }
  const isShared = (geo) => { for (const g2 of GEO.values()) if (g2 === geo) return true; return false; };
  function splash(A, x, z, strength) { const s = A.splash[A.si++ % 4]; s[0] = x; s[1] = z; s[2] = strength || 1; s[3] = 0; events.push({ type: "splash", area: A, x, z, strength: strength || 1 }); }
  function update(dt, pos, inRoom, reduce) {
    if (!reduce) time += dt;
    builtThisFrame = 0; flashNow = 0;
    let animating = false;
    PLANT_U.uTime.value = time;
    for (const A of areas) {
      const d = dist(A.bounds, pos), inside = d === 0;
      const near = A.kind === "room" ? d < 7 : A.kind === "corridor" ? d < 14 : d < 30;
      if (near && !A.pit && !A.failed && builtThisFrame === 0) { builtThisFrame++; try { A.pit = buildPit(A, q, opt.fauna); opt.scene.add(A.pit); } catch (e) { A.failed = true; console.error("world: " + A.id + ": " + (e && e.stack || e)); } }
      else if (!near && A.pit && d > (A.kind === "room" ? 18 : 36)) dropPit(A);
      // what can be seen: inside a room only that room (and the corridor through its door)
      const see = inRoom ? (A.id === inRoom || (A.kind === "corridor" && d < 6)) : (A.kind === "room" ? d < 9 : d < 30);
      A.skyG.visible = see; if (A.pit) A.pit.visible = see;
      if (!see) continue;
      animating = animating || !reduce;
      const P = A.skyMat.uniforms; P.uTime.value = time;
      // lightning
      const bolts = A.skyMat.userData.preset.bolts || 0;
      if (bolts && !reduce) {
        A.nextBolt -= dt;
        if (A.nextBolt <= 0) { A.boltT = 0.001; A.nextBolt = (7 + Math.random() * 9) / Math.max(0.4, bolts); P.uBolt.value.set((Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2, Math.random() * 40, 0); events.push({ type: "thunder", area: A, power: 0.6 + Math.random() * 0.4, delay: 0.5 + Math.random() * 2.2, inside }); }
        if (A.boltT > 0) {
          A.boltT += dt; const t = A.boltT;
          // two soft pulses and a fade: never more than two flashes in a second
          const f = (t < 0.09 ? t / 0.09 : t < 0.2 ? 1 - (t - 0.09) / 0.11 * 0.7 : t < 0.3 ? 0.3 + (t - 0.2) / 0.1 * 0.45 : Math.max(0, 0.75 - (t - 0.3) * 1.2));
          A.flash = f * 0.55 * Math.min(1, bolts); P.uBolt.value.w = t < 0.5 ? f : 0;
          if (t > 1) { A.boltT = 0; A.flash = 0; P.uBolt.value.w = 0; }
        }
      } else { A.flash = 0; P.uBolt.value.w = 0; }
      P.uFlash.value = A.flash;
      if (inside) flashNow = Math.max(flashNow, A.flash);
      if (!A.pit) continue;
      for (const U of A.anim) (U.uniforms || U).uTime.value = time;
      if (A.embers) A.embers.material.uniforms.uTime.value = time;
      if (A.waterMat) {
        const W = A.waterMat.uniforms; W.uTime.value = time;
        A.splash.forEach((s, i) => { if (!reduce) s[3] += dt; W.uSplash.value[i].set(s[0], s[1], s[2], s[3]); });
        if (A.drips && !reduce && Math.random() < dt * 0.9) { const [x, z] = A.toW(Math.random() * A.L, (Math.random() - 0.5) * A.W); if (A.groundH(x, z) < A.waterY) { splash(A, x, z, 0.35); events.push({ type: "drip", area: A }); } }
      }
      if (A.fauna && !reduce) A.fauna.update(dt, time, A);
    }
    return animating;
  }
  function areaAt(p) {
    let best = null;
    for (const A of areas) { const b = A.bounds; if (p.x >= b.x0 && p.x <= b.x1 && p.z >= b.z0 && p.z <= b.z1) { if (!best || A.kind === "room") best = A; } }
    return best;
  }
  function forceBolt(id) { const A = areas.find((x) => x.id === id); if (A) A.nextBolt = 0; }
  return { addArea, update, areaAt, splash, events, areas, forceBolt, get flash() { return flashNow; }, get time() { return time; } };
}
