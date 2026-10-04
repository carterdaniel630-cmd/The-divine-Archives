/* ==========================================================================
   THE DIVINE ARCHIVES — the Pilgrimage: sound

   A quiet soundscape made in the browser with the Web Audio API (nothing is
   downloaded): the hush of a stone interior, desert wind outside, the hum of
   modern ventilation fans where a site has them, and footsteps that sound of
   wood on the visitors' boards and of stone elsewhere. Like the museum's, it
   starts only after a tap or key press, has a Sound button, and remembers the
   choice. Atmosphere only: it is not a recording of the real place.

   createSound() → { on, wake(), set(on), update(dt, where), step(surface) }
     where: { outside: bool, fan: 0..1 }   surface: "wood" | "stone" | "rock"
   ========================================================================== */
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* blocked */ } } };

export function createSound() {
  let ctx = null, master = null, noise = null, brown = null, room = null, wind = null, windF = null, fan = null, t = 0;
  const api = { on: store.get("pg-snd") !== "0" };
  function buffers() {
    const n = ctx.sampleRate * 3, w = ctx.createBuffer(1, n, ctx.sampleRate), b = ctx.createBuffer(1, n, ctx.sampleRate);
    const W = w.getChannelData(0), B = b.getChannelData(0); let last = 0;
    for (let i = 0; i < n; i++) { const x = Math.random() * 2 - 1; W[i] = x; last = (last + 0.02 * x) / 1.02; B[i] = last * 3.5; }
    for (const a of [W, B]) { const f = 2000; for (let i = 0; i < f; i++) { const k = i / f; a[i] = a[i] * k + a[n - f + i] * (1 - k); } }
    noise = w; brown = b;
  }
  function loop(buf) { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.start(); return s; }
  function build() {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    ctx = new AC(); buffers();
    master = ctx.createGain(); master.gain.value = api.on ? 0.9 : 0; master.connect(ctx.destination);
    // the stone hush: deep, soft, a little uneven
    room = ctx.createGain(); room.gain.value = 0; const rf = ctx.createBiquadFilter(); rf.type = "lowpass"; rf.frequency.value = 220;
    loop(brown).connect(rf); rf.connect(room); room.connect(master);
    // desert wind: band-passed noise that swells and falls
    wind = ctx.createGain(); wind.gain.value = 0; windF = ctx.createBiquadFilter(); windF.type = "bandpass"; windF.frequency.value = 500; windF.Q.value = 0.7;
    loop(noise).connect(windF); windF.connect(wind); wind.connect(master);
    // ventilation fans: a low electrical hum with a breath of air
    fan = ctx.createGain(); fan.gain.value = 0;
    for (const [f, g] of [[100, 0.5], [200, 0.25], [300, 0.1]]) { const o = ctx.createOscillator(); o.frequency.value = f; const og = ctx.createGain(); og.gain.value = g * 0.05; o.connect(og); og.connect(fan); o.start(); }
    const ff = ctx.createBiquadFilter(); ff.type = "bandpass"; ff.frequency.value = 900; ff.Q.value = 0.5; const fg = ctx.createGain(); fg.gain.value = 0.25;
    loop(noise).connect(ff); ff.connect(fg); fg.connect(fan); fan.connect(master);
    return true;
  }
  // the browsers' rule: sound may start only from a user gesture
  api.wake = () => { if (!ctx) { if (!build()) return; } if (ctx.state === "suspended") ctx.resume(); };
  api.set = (on) => { api.on = on; store.set("pg-snd", on ? "1" : "0"); if (ctx) master.gain.setTargetAtTime(on ? 0.9 : 0, ctx.currentTime, 0.1); };
  const ramp = (g, v) => g.gain.setTargetAtTime(v, ctx.currentTime, 0.6);
  api.update = (dt, where) => {
    if (!ctx || !api.on) return; t += dt;
    const out = where && where.outside;
    ramp(room, out ? 0.0 : 0.22);
    ramp(wind, out ? 0.05 + 0.035 * Math.sin(t * 0.37) + 0.02 * Math.sin(t * 1.3) : 0.0);
    windF.frequency.setTargetAtTime(450 + 180 * Math.sin(t * 0.23), ctx.currentTime, 0.8);
    ramp(fan, where && where.fan ? 0.5 * where.fan : 0);
  };
  // one footstep: a short filtered burst, different for boards, stone and rough rock
  api.step = (surface) => {
    if (!ctx || !api.on || ctx.state !== "running") return;
    const s = ctx.createBufferSource(); s.buffer = noise; const f = ctx.createBiquadFilter(), g = ctx.createGain(), now = ctx.currentTime;
    const wood = surface === "wood";
    f.type = wood ? "lowpass" : "bandpass"; f.frequency.value = (wood ? 380 : surface === "rock" ? 900 : 1500) * (0.9 + Math.random() * 0.2); f.Q.value = wood ? 0.8 : 1.2;
    g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(wood ? 0.32 : 0.16, now + 0.006); g.gain.exponentialRampToValueAtTime(0.001, now + (wood ? 0.13 : 0.07));
    s.connect(f); f.connect(g); g.connect(master); s.start(now, Math.random() * 2, 0.16);
  };
  return api;
}
