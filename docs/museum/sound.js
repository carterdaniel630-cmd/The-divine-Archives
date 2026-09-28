/* ==========================================================================
   THE DIVINE ARCHIVES — the Virtual Museum: sound

   Every room, corridor and gallery has a soundscape made from its sky, its
   ground and its animals (world.js, fauna.js): wind, rain and thunder that
   follows the lightning; a babbling brook, a river, a lapping pond, waves on
   the shore, a fountain; drips in a cave, the crackle of embers, a low hum
   over the abyss; songbirds, doves, gulls, ravens, an owl, frogs, crickets
   and cicadas; a splash when a fish leaps. Everything is synthesised with the
   Web Audio API as it plays: no recordings are downloaded.

   Sound starts only after a click or key press (browsers require it), can be
   turned off with the Sound button, and remembers that choice.
   ========================================================================== */

const R = Math.random;
let ana = null, ctx = null, master = null, verb = null, verbIn = null, NOISE = null, BROWN = null, PINK = null;

function buffers() {
  const n = ctx.sampleRate * 3, w = ctx.createBuffer(1, n, ctx.sampleRate), b = ctx.createBuffer(1, n, ctx.sampleRate), p = ctx.createBuffer(1, n, ctx.sampleRate);
  const W = w.getChannelData(0), B = b.getChannelData(0), P = p.getChannelData(0);
  let last = 0, b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < n; i++) {
    const x = R() * 2 - 1; W[i] = x;
    last = (last + 0.02 * x) / 1.02; B[i] = last * 3.5;
    b0 = 0.99886 * b0 + x * 0.0555179; b1 = 0.99332 * b1 + x * 0.0750759; b2 = 0.969 * b2 + x * 0.153852; b3 = 0.8665 * b3 + x * 0.3104856; b4 = 0.55 * b4 + x * 0.5329522; b5 = -0.7616 * b5 - x * 0.016898;
    P[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + x * 0.5362) * 0.11; b6 = x * 0.115926;
  }
  // loop seams: fade the ends into each other
  [W, B, P].forEach((a) => { const f = 2000; for (let i = 0; i < f; i++) { const t = i / f; a[i] = a[i] * t + a[n - f + i] * (1 - t); } });
  NOISE = w; BROWN = b; PINK = p;
}
function impulse(sec, decay) {
  const n = Math.round(ctx.sampleRate * sec), ir = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (R() * 2 - 1) * Math.pow(1 - i / n, decay); }
  return ir;
}
const now = () => ctx.currentTime;
function src(buf, rate) { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.playbackRate.value = rate || 1; s.start(now(), R() * 2.5); return s; }
function filt(type, f, q) { const x = ctx.createBiquadFilter(); x.type = type; x.frequency.value = f; x.Q.value = q || 0.7; return x; }
function gain(v) { const g = ctx.createGain(); g.gain.value = v; return g; }
function lfo(freq, depth, target, offset) { const o = ctx.createOscillator(), g = gain(depth); o.frequency.value = freq; o.connect(g); g.connect(target); o.start(); if (offset != null) target.value = offset; return o; }
function pan(v) { const p = ctx.createStereoPanner ? ctx.createStereoPanner() : gain(1); if (p.pan) p.pan.value = v; return p; }

// ---------------------------------------------------------------- continuous layers (each returns { out, stop, tick? })
const LAYER = {
  wind(level) {
    const s = src(BROWN, 1), bp = filt("bandpass", 380, 0.6), g = gain(0), out = gain(level * 0.9);
    const l1 = lfo(0.07 + R() * 0.05, 220, bp.frequency, 380), l2 = lfo(0.11 + R() * 0.05, 0.45, g.gain, 0.55);
    s.connect(bp); bp.connect(g); g.connect(out);
    return { out, stop: () => { s.stop(); l1.stop(); l2.stop(); } };
  },
  leaves(level) {
    const s = src(PINK, 1), hp = filt("highpass", 2500, 0.5), g = gain(0), out = gain(level * 0.35);
    const l1 = lfo(0.13, 0.5, g.gain, 0.5); s.connect(hp); hp.connect(g); g.connect(out);
    return { out, stop: () => { s.stop(); l1.stop(); } };
  },
  rain(level) {
    const s = src(NOISE, 1), hp = filt("highpass", 900), lp = filt("lowpass", 7000), out = gain(level * 0.28);
    s.connect(hp); hp.connect(lp); lp.connect(out);
    // single drops on the skylight's glass
    const tick = (dt) => { if (R() < dt * 18 * level) blip(out, 2200 + R() * 3000, 0.012, 0.6); };
    return { out, stop: () => s.stop(), tick };
  },
  brook(level) {
    // babble: noise through narrow band-passes whose centres jump about, over a low rush
    const s = src(NOISE, 1), out = gain(level * 0.5), bands = [];
    for (let i = 0; i < 4; i++) { const f = filt("bandpass", 500 + R() * 2000, 7 + R() * 5), g = gain(0.5); s.connect(f); f.connect(g); g.connect(out); bands.push([f, g]); }
    const rs = src(BROWN, 1), lp = filt("lowpass", 350), rg = gain(0.8); rs.connect(lp); lp.connect(rg); rg.connect(out);
    const tick = (dt) => { bands.forEach(([f, g]) => { if (R() < dt * 9) { f.frequency.setTargetAtTime(380 + R() * 2600, now(), 0.03); g.gain.setTargetAtTime(0.2 + R() * 0.9, now(), 0.05); } }); if (R() < dt * 2.5 * level) bubble(out); };
    return { out, stop: () => { s.stop(); rs.stop(); }, tick };
  },
  river(level) {
    const s = src(PINK, 0.8), lp = filt("lowpass", 900), bp = filt("bandpass", 700, 1.5), g = gain(0), out = gain(level * 0.6);
    const l = lfo(0.09, 0.3, g.gain, 0.7); s.connect(lp); lp.connect(g); s.connect(bp); bp.connect(g); g.connect(out);
    const tick = (dt) => { if (R() < dt * 1.2 * level) bubble(out); };
    return { out, stop: () => { s.stop(); l.stop(); }, tick };
  },
  lap(level) {
    const s = src(BROWN, 1.3), lp = filt("lowpass", 500), g = gain(0), out = gain(level * 0.5);
    const l = lfo(0.25, 0.4, g.gain, 0.45); s.connect(lp); lp.connect(g); g.connect(out);
    const tick = (dt) => { if (R() < dt * 0.8 * level) bubble(out, 0.5); };
    return { out, stop: () => { s.stop(); l.stop(); }, tick };
  },
  waves(level) {
    // swells that build, break and draw back over the sand, every eight seconds or so
    const s = src(BROWN, 1), lp = filt("lowpass", 300), g = gain(0.05), out = gain(level * 1.1);
    const f = src(NOISE, 1), hp = filt("bandpass", 2500, 0.4), fg = gain(0); f.connect(hp); hp.connect(fg); fg.connect(out);
    s.connect(lp); lp.connect(g); g.connect(out);
    let next = 0;
    const tick = () => {
      const t = now(); if (t < next) return; const per = 7 + R() * 4; next = t + per;
      g.gain.cancelScheduledValues(t); lp.frequency.cancelScheduledValues(t); fg.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(0.08, t); g.gain.linearRampToValueAtTime(0.9, t + per * 0.45); g.gain.linearRampToValueAtTime(0.1, t + per);
      lp.frequency.setValueAtTime(250, t); lp.frequency.linearRampToValueAtTime(1600, t + per * 0.45); lp.frequency.exponentialRampToValueAtTime(300, t + per);
      fg.gain.setValueAtTime(0, t + per * 0.4); fg.gain.linearRampToValueAtTime(0.22, t + per * 0.48); fg.gain.linearRampToValueAtTime(0, t + per * 0.9);   // the break, and the hiss of foam
    };
    return { out, stop: () => { s.stop(); f.stop(); }, tick };
  },
  fountain(level) { const x = LAYER.brook(level * 0.6); return x; },
  hum(level) {
    const out = gain(level * 0.25), o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), o3 = ctx.createOscillator();
    o1.frequency.value = 55; o2.frequency.value = 55.4; o3.frequency.value = 82.6; o3.type = "triangle";
    const g3 = gain(0.3); [o1, o2].forEach((o) => { o.connect(out); o.start(); }); o3.connect(g3); g3.connect(out); o3.start();
    const s = src(PINK, 0.5), bp = filt("bandpass", 1800, 4), sg = gain(0.12); s.connect(bp); bp.connect(sg); sg.connect(out);
    const l = lfo(0.05, 0.12, sg.gain, 0.12);
    return { out, stop: () => { o1.stop(); o2.stop(); o3.stop(); s.stop(); l.stop(); } };
  },
  cave(level) {
    const s = src(BROWN, 0.6), lp = filt("lowpass", 120), out = gain(level * 0.4); s.connect(lp); lp.connect(out);
    const tick = (dt) => { if (R() < dt * 0.6) drip(out); };
    return { out, stop: () => s.stop(), tick };
  },
  embers(level) {
    const s = src(BROWN, 0.7), lp = filt("lowpass", 180), out = gain(level * 0.5); s.connect(lp); lp.connect(out);
    const tick = (dt) => { if (R() < dt * 14 * level) blip(out, 1200 + R() * 4000, 0.004 + R() * 0.01, 0.8 + R()); };
    return { out, stop: () => s.stop(), tick };
  },
  crickets(level) {
    const out = gain(level * 0.08); const tick = (dt) => { if (R() < dt * 2.2) cricket(out); }; return { out, stop() {}, tick };
  },
  cicadas(level) {
    const s = src(NOISE, 1), bp = filt("bandpass", 5200, 6), g = gain(0), out = gain(level * 0.18);
    const am = lfo(55, 0.5, g.gain, 0.5), sw = lfo(0.08, level * 0.08, out.gain, level * 0.18);
    s.connect(bp); bp.connect(g); g.connect(out);
    return { out, stop: () => { s.stop(); am.stop(); sw.stop(); } };
  }
};

// ---------------------------------------------------------------- one-off sounds
function env(g, t, a, peak, d) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0005, t + a + d); }
function blip(dest, f, d, lvl) { const s = ctx.createBufferSource(); s.buffer = NOISE; const bp = filt("bandpass", f, 3), g = gain(0); s.connect(bp); bp.connect(g); g.connect(dest); const t = now(); env(g, t, 0.001, (lvl || 1) * 0.5, d); s.start(t, R() * 2); s.stop(t + d + 0.05); }
function bubble(dest, lvl) { const o = ctx.createOscillator(), g = gain(0), t = now(), f = 500 + R() * 900; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 2.2, t + 0.05); o.connect(g); g.connect(dest); env(g, t, 0.004, 0.07 * (lvl || 1), 0.06); o.start(t); o.stop(t + 0.1); }
function drip(dest) { const o = ctx.createOscillator(), g = gain(0), t = now(), f = 1200 + R() * 1800; o.frequency.setValueAtTime(f * 0.7, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.02); o.connect(g); g.connect(dest); g.connect(verbIn); env(g, t, 0.002, 0.25, 0.25); o.start(t); o.stop(t + 0.35); }
function cricket(dest) { const t0 = now(), p = pan(R() * 1.6 - 0.8), f = 4200 + R() * 900; p.connect(dest); for (let k = 0; k < 3 + (R() * 3 | 0); k++) { const o = ctx.createOscillator(), g = gain(0), t = t0 + k * 0.045; o.frequency.value = f; o.connect(g); g.connect(p); env(g, t, 0.004, 1, 0.025); o.start(t); o.stop(t + 0.05); } }
function splash(dest, s) { const n = ctx.createBufferSource(); n.buffer = NOISE; const bp = filt("bandpass", 1400 + R() * 800, 0.8), g = gain(0), t = now(); n.connect(bp); bp.connect(g); g.connect(dest); env(g, t, 0.005, 0.35 * s, 0.35); n.start(t, R() * 2); n.stop(t + 0.5); bubble(dest, s); }
function thunder(dest, power, close) {
  const t = now(), n = ctx.createBufferSource(); n.buffer = BROWN; const lp = filt("lowpass", 400), g = gain(0); n.connect(lp); lp.connect(g); g.connect(dest); g.connect(verbIn);
  const len = 3 + power * 4; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.9 * power, t + 0.15); for (let k = 1; k < 6; k++) g.gain.linearRampToValueAtTime((0.4 + R() * 0.6) * power * (1 - k / 7), t + k * len / 7); g.gain.linearRampToValueAtTime(0, t + len);
  lp.frequency.setValueAtTime(close ? 900 : 400, t); lp.frequency.exponentialRampToValueAtTime(90, t + len); n.start(t, R() * 2); n.stop(t + len + 0.1);
  if (close) { const c = ctx.createBufferSource(); c.buffer = NOISE; const hp = filt("highpass", 1500), cg = gain(0); c.connect(hp); hp.connect(cg); cg.connect(dest); env(cg, t, 0.003, 0.35 * power, 0.5); c.start(t); c.stop(t + 0.6); }
}
// bird calls, made from oscillators with pitch and volume envelopes
const CALL = {
  songbirds(dest) { const t0 = now(), p = pan(R() * 1.8 - 0.9); p.connect(dest); p.connect(verbIn); const kind = R() * 3 | 0, base = 2600 + R() * 1800;
    const notes = kind === 0 ? 8 + (R() * 8 | 0) : kind === 1 ? 3 : 5;
    for (let k = 0; k < notes; k++) { const o = ctx.createOscillator(), g = gain(0), t = t0 + k * (kind === 0 ? 0.055 : 0.16); const f = base * (kind === 0 ? 1 + (k % 2) * 0.12 : 1 + Math.sin(k * 1.7) * 0.25);
      o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * (kind === 1 ? 1.5 : 0.8), t + (kind === 0 ? 0.04 : 0.12)); o.connect(g); g.connect(p); env(g, t, 0.006, 0.12, kind === 0 ? 0.04 : 0.11); o.start(t); o.stop(t + 0.2); } },
  swallows(dest) { const t0 = now(), p = pan(R() * 1.8 - 0.9); p.connect(dest); for (let k = 0; k < 4; k++) { const o = ctx.createOscillator(), g = gain(0), t = t0 + k * 0.07, f = 3500 + R() * 1500; o.frequency.setValueAtTime(f, t); o.frequency.linearRampToValueAtTime(f * 0.7, t + 0.05); o.connect(g); g.connect(p); env(g, t, 0.004, 0.08, 0.05); o.start(t); o.stop(t + 0.1); } },
  doves(dest) { const t0 = now(), p = pan(R() * 1.4 - 0.7); p.connect(dest); p.connect(verbIn); const f = 420 + R() * 60; [[0, 0.5, 0.6], [0.65, 0.9, 1], [1.7, 0.4, 0.7], [2.2, 0.4, 0.7]].forEach(([dt, d, a]) => { const o = ctx.createOscillator(), g = gain(0), lp = filt("lowpass", 900), t = t0 + dt; o.type = "triangle"; o.frequency.setValueAtTime(f * 0.9, t); o.frequency.linearRampToValueAtTime(f, t + d * 0.3); o.frequency.linearRampToValueAtTime(f * 0.92, t + d); o.connect(lp); lp.connect(g); g.connect(p); env(g, t, 0.08, 0.14 * a, d); o.start(t); o.stop(t + d + 0.2); }); },
  gulls(dest) { const t0 = now(), p = pan(R() * 1.8 - 0.9); p.connect(dest); p.connect(verbIn); for (let k = 0; k < 2 + (R() * 3 | 0); k++) { const o = ctx.createOscillator(), bp = filt("bandpass", 1300, 2), g = gain(0), t = t0 + k * 0.32, f = 900 + R() * 200; o.type = "sawtooth"; o.frequency.setValueAtTime(f * 1.3, t); o.frequency.exponentialRampToValueAtTime(f * 0.8, t + 0.25); o.connect(bp); bp.connect(g); g.connect(p); env(g, t, 0.02, 0.1, 0.25); o.start(t); o.stop(t + 0.35); } },
  ravens(dest) { const t0 = now(), p = pan(R() * 1.6 - 0.8); p.connect(dest); p.connect(verbIn); for (let k = 0; k < 1 + (R() * 3 | 0); k++) { const o = ctx.createOscillator(), bp = filt("bandpass", 800, 1.5), g = gain(0), t = t0 + k * 0.45, f = 300 + R() * 60; o.type = "sawtooth"; o.frequency.setValueAtTime(f, t); o.frequency.linearRampToValueAtTime(f * 0.85, t + 0.28); const nz = ctx.createBufferSource(); nz.buffer = NOISE; const nb = filt("bandpass", 900, 1), ng = gain(0.3); nz.connect(nb); nb.connect(ng); ng.connect(g); o.connect(bp); bp.connect(g); g.connect(p); env(g, t, 0.02, 0.16, 0.3); o.start(t); o.stop(t + 0.4); nz.start(t, R()); nz.stop(t + 0.4); } },
  owl(dest) { const t0 = now(), p = pan(R() * 1.2 - 0.6); p.connect(dest); p.connect(verbIn); [[0, 0.5], [1.2, 0.25], [1.5, 0.25], [1.8, 0.7]].forEach(([dt, d]) => { const o = ctx.createOscillator(), g = gain(0), t = t0 + dt; o.frequency.setValueAtTime(390, t); o.frequency.linearRampToValueAtTime(370, t + d); o.connect(g); g.connect(p); env(g, t, 0.05, 0.13, d); o.start(t); o.stop(t + d + 0.2); }); },
  frogs(dest) { const t0 = now(), p = pan(R() * 1.6 - 0.8); p.connect(dest); const f = 90 + R() * 60; for (let k = 0; k < 2 + (R() * 3 | 0); k++) { const o = ctx.createOscillator(), bp = filt("bandpass", 550, 2), g = gain(0), am = ctx.createOscillator(), amg = gain(0.5), t = t0 + k * 0.35; o.type = "square"; o.frequency.value = f; am.frequency.value = 28; am.connect(amg); amg.connect(g.gain); o.connect(bp); bp.connect(g); g.connect(p); env(g, t, 0.02, 0.1, 0.22); o.start(t); am.start(t); o.stop(t + 0.3); am.stop(t + 0.3); } },
  macaws(dest) { const t0 = now(), p = pan(R() * 1.6 - 0.8); p.connect(dest); p.connect(verbIn); const o = ctx.createOscillator(), bp = filt("bandpass", 1600, 1.2), g = gain(0), f = 700 + R() * 200; o.type = "sawtooth"; o.frequency.setValueAtTime(f, t0); o.frequency.linearRampToValueAtTime(f * 1.4, t0 + 0.12); o.frequency.linearRampToValueAtTime(f * 0.9, t0 + 0.4); o.connect(bp); bp.connect(g); g.connect(p); env(g, t0, 0.02, 0.12, 0.4); o.start(t0); o.stop(t0 + 0.5); },
  kingfisher(dest) { CALL.swallows(dest); },
  eagle(dest) { const t0 = now(), p = pan(R() * 1.6 - 0.8); p.connect(dest); p.connect(verbIn); for (let k = 0; k < 4; k++) { const o = ctx.createOscillator(), g = gain(0), t = t0 + k * 0.12, f = 2200 - k * 150; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.75, t + 0.1); o.connect(g); g.connect(p); env(g, t, 0.01, 0.06, 0.1); o.start(t); o.stop(t + 0.15); } },
  crane(dest) { const t0 = now(), p = pan(R() * 1.4 - 0.7); p.connect(dest); p.connect(verbIn); for (let k = 0; k < 2; k++) { const o = ctx.createOscillator(), bp = filt("bandpass", 1100, 1.5), g = gain(0), t = t0 + k * 0.5; o.type = "sawtooth"; o.frequency.setValueAtTime(700, t); o.frequency.linearRampToValueAtTime(820, t + 0.3); o.connect(bp); bp.connect(g); g.connect(p); env(g, t, 0.03, 0.1, 0.35); o.start(t); o.stop(t + 0.45); } }
};
CALL.condor = CALL.eagle; CALL.hawk = CALL.eagle; CALL.heron = CALL.ravens; CALL.ibis = CALL.ravens;
const RATE = { songbirds: 0.35, swallows: 0.25, doves: 0.07, gulls: 0.1, ravens: 0.08, owl: 0.05, frogs: 0.3, macaws: 0.08, kingfisher: 0.05, eagle: 0.03, condor: 0.02, hawk: 0.03, crane: 0.04, heron: 0.02, ibis: 0.02 };

// ---------------------------------------------------------------- what each area sounds like
export function recipe(env, kind) {
  const L = {}, sky = env.sky, g = env.ground, night = ["night", "starry", "moon", "aurora", "fog", "twilight"].includes(sky);
  const set = (k, v) => { L[k] = Math.max(L[k] || 0, v); };
  if (["storm", "tempest"].includes(sky)) { set("wind", 0.75); set("rain", 0.8); }
  else if (sky === "thunder") { set("wind", 0.45); set("rain", 0.3); }
  else if (sky === "monsoon") { set("rain", 1); set("wind", 0.3); }
  else if (sky === "rain") { set("rain", 0.6); set("wind", 0.25); }
  else if (["highland", "aurora"].includes(sky)) set("wind", 0.5);
  else if (["overcast", "fog", "mist", "haze"].includes(sky)) set("wind", 0.2);
  else set("wind", 0.12);
  if (["brook", "forestbrook"].includes(g)) set("brook", 0.8);
  if (["river", "nile", "marsh"].includes(g)) set("river", 0.7);
  if (["pond", "pool", "lake", "zen", "jungle"].includes(g)) set("lap", 0.5);
  if (g === "garden") set("fountain", 0.6);
  if (g === "shore") set("waves", 0.9);
  if (g === "cave") set("cave", 0.8);
  if (g === "ash") set("embers", 0.7);
  if (g === "void") set("hum", 0.8);
  if (["forest", "heath", "forestbrook"].includes(g)) set("leaves", 0.6);
  if (["desert", "redearth", "steppe", "snow"].includes(g)) set("wind", 0.4);
  if (g === "jungle" || (sky === "tropical" && g !== "shore")) set("cicadas", 0.5);
  if (night && !["snow", "void", "cave"].includes(g)) set("crickets", 0.8);
  if (["meadow", "field", "steppe"].includes(g) && !night) set("crickets", 0.25);
  const calls = (env.fauna || []).filter((f) => CALL[f] && !(night && ["songbirds", "swallows", "doves", "macaws"].includes(f)));
  if (kind === "corridor" || kind === "spine" || kind === "hall") Object.keys(L).forEach((k) => { L[k] *= 0.75; });
  return { layers: L, calls, verb: g === "cave" ? 0.5 : kind === "room" ? 0.18 : 0.25 };
}

// ---------------------------------------------------------------- the player
export function createSound() {
  let on = true, cur = null, key = null, duck = 1;
  try { on = window.localStorage.getItem("mu-snd") !== "0"; } catch (e) { /* storage blocked */ }
  function init() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    try { ctx = new AC(); } catch (e) { return false; }
    buffers();
    master = gain(on ? 0.55 : 0); master.connect(ctx.destination);
    ana = ctx.createAnalyser(); ana.fftSize = 2048; master.connect(ana);
    verb = ctx.createConvolver(); verb.buffer = impulse(2.6, 3); verbIn = gain(0.25); verbIn.connect(verb); verb.connect(master);
    return true;
  }
  function start(R2) {
    const bed = { gain: gain(0), live: [], calls: R2.calls, verb: R2.verb };
    bed.gain.connect(master); bed.gain.connect(verbIn);
    for (const [k, v] of Object.entries(R2.layers)) { if (!LAYER[k] || v <= 0) continue; const x = LAYER[k](v); x.out.connect(bed.gain); bed.live.push(x); }
    bed.gain.gain.setTargetAtTime(1, now(), 0.8);
    return bed;
  }
  function stopBed(bed) { if (!bed) return; bed.gain.gain.setTargetAtTime(0, now(), 0.6); setTimeout(() => { bed.live.forEach((x) => { try { x.stop(); } catch (e) { /* stopped */ } }); bed.gain.disconnect(); }, 3500); }
  return {
    get on() { return on; },
    // for tests: the state of the audio and the loudness of what is playing
    probe() { if (!ana) return { ctx: ctx ? ctx.state : null }; const a = new Float32Array(ana.fftSize); ana.getFloatTimeDomainData(a); let e = 0; for (const v of a) e += v * v; return { ctx: ctx.state, key, layers: cur ? cur.live.length : 0, calls: cur ? cur.calls : [], rms: Math.sqrt(e / a.length) }; },
    // call from a click or key press: browsers only let audio start after one
    wake() { if (!on) return; if (init() && ctx.state === "suspended") ctx.resume(); },
    toggle(v) { on = v == null ? !on : v; try { window.localStorage.setItem("mu-snd", on ? "1" : "0"); } catch (e) { /* storage blocked */ } if (on) this.wake(); if (master) master.gain.setTargetAtTime(on ? 0.55 * duck : 0, now(), 0.2); return on; },
    duck(v) { if (v === duck) return; duck = v; if (master && on) master.gain.setTargetAtTime(0.55 * v, now(), 0.3); },
    pause(p) { if (!ctx) return; if (p) ctx.suspend(); else if (on) ctx.resume(); },
    // area: world.js area (its env and kind), or null
    update(dt, area) {
      if (!ctx || !on || ctx.state !== "running") return;
      const k = area ? area.id : "none";
      if (k !== key) { key = k; stopBed(cur); cur = area ? start(recipe(area.env, area.kind)) : null; if (cur) verbIn.gain.setTargetAtTime(cur.verb, now(), 0.5); }
      if (!cur) return;
      cur.live.forEach((x) => { if (x.tick) x.tick(dt); });
      cur.calls.forEach((c) => { if (R() < dt * (RATE[c] || 0.05)) CALL[c](cur.gain); });
    },
    event(e, area) {
      if (!ctx || !on || ctx.state !== "running" || !cur) return;
      if (e.type === "thunder") setTimeout(() => { if (cur) thunder(cur.gain, e.power * (e.inside ? 1 : 0.4), e.inside && e.delay < 1); }, e.delay * 1000);
      else if (e.type === "splash" && e.area === area) splash(cur.gain, Math.min(1, e.strength));
      else if (e.type === "drip" && e.area === area) drip(cur.gain);
    }
  };
}
