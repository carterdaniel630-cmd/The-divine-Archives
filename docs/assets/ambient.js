/* ==========================================================================
   THE DIVINE ARCHIVES — site-wide instrumental score

   A single continuous instrumental piece that plays across the whole site as
   you read — structured like an actual song (a steady groove, a chord bed, a
   singing melody), not a drone. Voices, all synthesized in the Web Audio API
   (no audio files, no network):

     - shamanic FRAME DRUM groove + light shaker percussion (the pulse)
     - a soft PIANO chord bed and a low BASS root
     - a SINGING-BOWL shimmer struck at each section
     - a FLUTE melody carrying the tune
     - a faint wordless "chant" formant pad for the monastic air (no lyrics,
       no lead vocal — texture only)

   Key: D minor, 16-bar progression (Dm–Bb–Gm–A · Dm–F–C–A), ~68 BPM.

   PLAYBACK
     - Autoplays by default. Browsers block audible autoplay until the visitor
       interacts, so it starts on the first tap / click / key press (there is
       no "play" button to find); where autoplay is allowed it starts on load.
     - A corner control lets you MUTE (the round button) and change VOLUME (the
       slider). Both persist across pages (localStorage).
     - The piece is phase-locked to a shared session clock (sessionStorage), so
       moving between pages continues the song rather than restarting it.
   ========================================================================== */
(function () {
  "use strict";

  var KEY_ON = "da-music";              // "on" | "off"  (absent = on)
  var KEY_VOL = "da-music-vol";         // "0".."100"    (absent = 60)
  var EPOCH = "da-music-epoch";         // session-wide conceptual start (ms)

  // --- tempo / form ---
  var BPM = 68;
  var SPB = 60 / BPM;                   // seconds per beat
  var BAR = SPB * 4;                    // seconds per 4/4 bar
  var BARS = 16;                        // bars per loop

  var ctx = null, out = null, voiceBus = null;
  var noise = null;
  var enabled = true, built = false, armed = false, ticking = false;
  var vol = 0.6;
  var anchorC = 0, anchorCtx = 0, anchorSet = false, nextBar = null;
  var timers = [];

  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  /* -------------------- the composition -------------------- */
  // one entry per 2-bar block (8 blocks = 16 bars): bass/pad root + piano triad
  var CHORDS = [
    { root: 50, pad: [50, 57], tri: [62, 65, 69] }, // Dm
    { root: 46, pad: [46, 53], tri: [58, 62, 65] }, // Bb
    { root: 43, pad: [43, 50], tri: [55, 58, 62] }, // Gm
    { root: 45, pad: [45, 52], tri: [57, 61, 64] }, // A (dom, C#)
    { root: 50, pad: [50, 57], tri: [62, 65, 69] }, // Dm
    { root: 41, pad: [41, 48], tri: [53, 57, 60] }, // F
    { root: 48, pad: [48, 55], tri: [60, 64, 67] }, // C
    { root: 45, pad: [45, 52], tri: [57, 61, 64] }  // A (dom)
  ];
  // flute melody: [beat-within-loop (0..63), MIDI, duration in beats]
  var MELODY = [
    [0,69,1.5],[2,72,1],[3,74,1],[4,72,1.5],[6,69,1.5],
    [8,65,1.5],[10,69,1],[11,70,1],[12,69,1.5],[14,65,1.5],
    [16,62,1.5],[18,65,1],[19,67,1],[20,65,1.5],[22,62,1.5],
    [24,64,1.5],[26,61,1],[27,64,1],[28,69,2],[30,64,1.5],
    [32,74,1.5],[34,77,1],[35,76,1],[36,74,1.5],[38,69,1.5],
    [40,72,1.5],[42,69,1],[43,72,1],[44,65,1.5],[46,69,1.5],
    [48,67,1.5],[50,72,1],[51,71,1],[52,67,1.5],[54,64,1.5],
    [56,64,1.5],[58,69,1],[59,68,1],[60,69,3]
  ];

  function whiteBuffer(sec) {
    var len = (ctx.sampleRate * sec) | 0, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function impulse(sec, decay) {
    var len = (ctx.sampleRate * sec) | 0, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = b.getChannelData(ch);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return b;
  }

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    noise = whiteBuffer(2);

    out = ctx.createGain(); out.gain.value = 0.0001;   // faded in by applyVolume()

    // gentle limiter so overlapping voices never spike on a long listen
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 22; comp.ratio.value = 4;
    comp.attack.value = 0.008; comp.release.value = 0.25;
    comp.connect(out); out.connect(ctx.destination);

    // dry + hall reverb
    voiceBus = ctx.createGain();
    var dry = ctx.createGain(); dry.gain.value = 0.85;
    var conv = ctx.createConvolver(); conv.buffer = impulse(3.2, 2.6);
    var wet = ctx.createGain(); wet.gain.value = 0.42;
    voiceBus.connect(dry); dry.connect(comp);
    voiceBus.connect(conv); conv.connect(wet); wet.connect(comp);

    built = true;
  }

  /* -------------------- voices -------------------- */
  function frameDrum(tc, accent) {
    var o = ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(168, tc);
    o.frequency.exponentialRampToValueAtTime(58, tc + 0.13);
    var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420;
    var g = ctx.createGain(); g.gain.value = 0.0001;
    o.connect(lp); lp.connect(g); g.connect(voiceBus);
    g.gain.setValueAtTime(0.0001, tc);
    g.gain.exponentialRampToValueAtTime(0.85 * accent, tc + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, tc + 0.42);
    o.start(tc); o.stop(tc + 0.5);
    // skin transient
    var s = ctx.createBufferSource(); s.buffer = noise;
    var hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1100;
    var sg = ctx.createGain(); sg.gain.value = 0.0001;
    s.connect(hp); hp.connect(sg); sg.connect(voiceBus);
    sg.gain.setValueAtTime(0.06 * accent, tc);
    sg.gain.exponentialRampToValueAtTime(0.0001, tc + 0.05);
    s.start(tc); s.stop(tc + 0.06);
  }

  function shaker(tc) {
    var s = ctx.createBufferSource(); s.buffer = noise;
    var bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 6200; bp.Q.value = 1.2;
    var g = ctx.createGain(); g.gain.value = 0.0001;
    s.connect(bp); bp.connect(g); g.connect(voiceBus);
    g.gain.setValueAtTime(0.018, tc);
    g.gain.exponentialRampToValueAtTime(0.0001, tc + 0.035);
    s.start(tc); s.stop(tc + 0.05);
  }

  function bass(freq, tc, dur) {
    var o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = freq / 2;
    var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 240;
    var g = ctx.createGain(); g.gain.value = 0.0001;
    o.connect(lp); lp.connect(g); g.connect(voiceBus);
    g.gain.setValueAtTime(0.0001, tc);
    g.gain.exponentialRampToValueAtTime(0.08, tc + 0.03);
    g.gain.setValueAtTime(0.08, tc + dur - 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, tc + dur);
    o.start(tc); o.stop(tc + dur + 0.05);
  }

  function piano(freq, tc, dur, level) {
    var parts = [[1, 0.06], [2, 0.028], [3, 0.014]];
    for (var i = 0; i < parts.length; i++) {
      var o = ctx.createOscillator(); o.type = "sine";
      o.frequency.value = freq * parts[i][0] * (1 + (Math.random() - 0.5) * 0.001);
      var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3200;
      var g = ctx.createGain(); g.gain.value = 0.0001;
      o.connect(lp); lp.connect(g); g.connect(voiceBus);
      g.gain.setValueAtTime(0.0001, tc);
      g.gain.exponentialRampToValueAtTime(parts[i][1] * level, tc + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, tc + dur);
      o.start(tc); o.stop(tc + dur + 0.05);
    }
  }

  function bowl(freq, tc) {
    var parts = [[1, 0.05], [2.71, 0.02], [4.18, 0.011]];
    for (var i = 0; i < parts.length; i++) {
      var o = ctx.createOscillator(); o.type = "sine";
      o.frequency.value = freq * parts[i][0];
      // slow beating for the shimmer
      var lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.8 + i * 0.3;
      var lg = ctx.createGain(); lg.gain.value = freq * parts[i][0] * 0.0015;
      lfo.connect(lg); lg.connect(o.frequency); lfo.start(tc); lfo.stop(tc + 6);
      var g = ctx.createGain(); g.gain.value = 0.0001;
      o.connect(g); g.connect(voiceBus);
      g.gain.setValueAtTime(0.0001, tc);
      g.gain.exponentialRampToValueAtTime(parts[i][1], tc + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, tc + 5.5);
      o.start(tc); o.stop(tc + 5.6);
    }
  }

  function flute(freq, tc, dur) {
    var o1 = ctx.createOscillator(); o1.type = "triangle"; o1.frequency.value = freq;
    var o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = freq * 2;
    // vibrato
    var vib = ctx.createOscillator(); vib.type = "sine"; vib.frequency.value = 5;
    var vg = ctx.createGain(); vg.gain.value = freq * 0.004;
    vib.connect(vg); vg.connect(o1.frequency); vib.start(tc); vib.stop(tc + dur + 0.3);
    var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2600;
    var g = ctx.createGain(), g2 = ctx.createGain();
    g.gain.value = 0.0001; g2.gain.value = 0.0001;
    o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(voiceBus);
    g.gain.setValueAtTime(0.0001, tc);
    g.gain.exponentialRampToValueAtTime(0.07, tc + 0.06);
    g.gain.setValueAtTime(0.07, tc + dur - 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, tc + dur);
    g2.gain.setValueAtTime(0.0001, tc);
    g2.gain.exponentialRampToValueAtTime(0.02, tc + 0.06);   // soft octave breath
    g2.gain.exponentialRampToValueAtTime(0.0001, tc + dur);
    // breath noise
    var s = ctx.createBufferSource(); s.buffer = noise;
    var bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = freq * 2; bp.Q.value = 0.8;
    var sg = ctx.createGain(); sg.gain.value = 0.0001;
    s.connect(bp); bp.connect(sg); sg.connect(voiceBus);
    sg.gain.setValueAtTime(0.0001, tc);
    sg.gain.exponentialRampToValueAtTime(0.008, tc + 0.08);
    sg.gain.exponentialRampToValueAtTime(0.0001, tc + dur);
    o1.start(tc); o2.start(tc); s.start(tc);
    o1.stop(tc + dur + 0.2); o2.stop(tc + dur + 0.2); s.stop(tc + dur + 0.2);
  }

  // wordless "chant" formant pad — no lyrics, texture only
  function chant(freq, tc, dur) {
    var o1 = ctx.createOscillator(); o1.type = "sawtooth"; o1.frequency.value = freq;
    var o2 = ctx.createOscillator(); o2.type = "sawtooth"; o2.frequency.value = freq * 1.004;
    var f1 = ctx.createBiquadFilter(); f1.type = "bandpass"; f1.frequency.value = 440; f1.Q.value = 6;
    var f2 = ctx.createBiquadFilter(); f2.type = "bandpass"; f2.frequency.value = 1000; f2.Q.value = 8;
    var g = ctx.createGain(); g.gain.value = 0.0001;
    o1.connect(f1); o2.connect(f1); o1.connect(f2); o2.connect(f2);
    f1.connect(g); f2.connect(g); g.connect(voiceBus);
    g.gain.setValueAtTime(0.0001, tc);
    g.gain.exponentialRampToValueAtTime(0.03, tc + 1.2);
    g.gain.setValueAtTime(0.03, tc + dur - 1.3);
    g.gain.exponentialRampToValueAtTime(0.0001, tc + dur);
    o1.start(tc); o2.start(tc); o1.stop(tc + dur + 0.1); o2.stop(tc + dur + 0.1);
  }

  /* -------------------- scheduling -------------------- */
  function conceptualNow() {
    var e = +sessionStorage.getItem(EPOCH);
    if (!e) { e = Date.now(); try { sessionStorage.setItem(EPOCH, e); } catch (x) {} }
    return (Date.now() - e) / 1000;
  }
  function ctxTimeFor(C) { return anchorCtx + (C - anchorC); }

  function scheduleBar(barIndex) {
    var barC = barIndex * BAR;
    var guard = ctx.currentTime + 0.02;
    var section = ((barIndex % BARS) + BARS) % BARS;        // 0..15
    var chord = CHORDS[Math.floor(section / 2)];
    function T(beatInBar) { return ctxTimeFor(barC + beatInBar * SPB); }

    // frame-drum groove: accents on 1 & 3, light taps on the "ands"
    var hits = [[0, 1.0], [1, 0.45], [1.5, 0.3], [2, 0.8], [3, 0.5], [3.5, 0.3]];
    for (var h = 0; h < hits.length; h++) if (T(hits[h][0]) >= guard) frameDrum(T(hits[h][0]), hits[h][1]);
    // shaker on eighths
    for (var e = 0; e < 8; e++) if (T(e * 0.5) >= guard) shaker(T(e * 0.5));

    // bass on the downbeat, piano chord on 1 and (softer) on 3
    if (T(0) >= guard) {
      bass(mtof(chord.root), T(0), BAR * 0.95);
      for (var p = 0; p < chord.tri.length; p++) piano(mtof(chord.tri[p]), T(0), 2.2, 1.0);
    }
    if (T(2) >= guard) for (var q = 0; q < chord.tri.length; q++) piano(mtof(chord.tri[q]), T(2), 1.8, 0.55);

    // chant pad + bowl at the head of each 2-bar block
    if (section % 2 === 0 && T(0) >= guard) {
      for (var c = 0; c < chord.pad.length; c++) chant(mtof(chord.pad[c] + 12), T(0), BAR * 2 + 0.4);
    }
    if ((section === 0 || section === 4 || section === 8 || section === 12) && T(0) >= guard) {
      bowl(mtof(chord.root + 24), T(0));
    }

    // flute melody notes that fall inside this bar
    for (var m = 0; m < MELODY.length; m++) {
      if (Math.floor(MELODY[m][0] / 4) !== section) continue;
      var local = MELODY[m][0] - section * 4;
      var tc = T(local);
      if (tc >= guard) flute(mtof(MELODY[m][1]), tc, MELODY[m][2] * SPB);
    }
  }

  function tick() {
    if (!enabled) { ticking = false; return; }
    ticking = true;
    var horizonC = conceptualNow() + 1.4;
    if (nextBar === null) nextBar = Math.floor(conceptualNow() / BAR);
    while (nextBar * BAR <= horizonC) { scheduleBar(nextBar); nextBar++; }
    timers.push(setTimeout(tick, 250));
  }

  function applyVolume() {
    if (!out) return;
    // perceptual curve, with headroom
    var level = enabled ? Math.pow(vol, 1.6) * 0.95 : 0.0001;
    out.gain.setTargetAtTime(Math.max(level, 0.0001), ctx.currentTime, 0.15);
  }

  function play() {
    if (!built) build();
    if (ctx.state === "suspended") ctx.resume();
    if (!anchorSet) { anchorC = conceptualNow(); anchorCtx = ctx.currentTime + 0.15; anchorSet = true; }
    enabled = true;
    applyVolume();
    if (!ticking) tick();
  }

  function mute() {
    enabled = false;
    applyVolume();
    while (timers.length) clearTimeout(timers.pop());
    ticking = false; nextBar = null;
    if (ctx) setTimeout(function () { if (!enabled && ctx) ctx.suspend(); }, 700);
  }

  /* start on the visitor's first interaction (autoplay fallback) */
  function armGesture() {
    if (armed) return; armed = true;
    var go = function () {
      ["pointerdown", "touchstart", "keydown", "click"].forEach(function (ev) {
        window.removeEventListener(ev, go);
      });
      if (localStorage.getItem(KEY_ON) !== "off") play();
    };
    ["pointerdown", "touchstart", "keydown", "click"].forEach(function (ev) {
      window.addEventListener(ev, go, { once: true, passive: true });
    });
  }

  /* -------------------- corner control (mute + volume) -------------------- */
  function injectCSS() {
    var s = document.createElement("style");
    s.textContent =
      ".da-audio{position:fixed;right:1.1rem;bottom:1.1rem;z-index:60;display:flex;align-items:center;gap:.55rem;" +
        "font-family:inherit}" +
      ".da-audio .vol{-webkit-appearance:none;appearance:none;width:72px;height:4px;border-radius:3px;cursor:pointer;" +
        "background:rgba(201,162,75,.35);outline:none;transition:width .2s ease,opacity .2s ease}" +
      ".da-audio .vol:hover{background:rgba(201,162,75,.5)}" +
      ".da-audio .vol::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;" +
        "background:var(--gold-bright,#e6c27a);border:1px solid var(--gold,#c9a24b);cursor:pointer}" +
      ".da-audio .vol::-moz-range-thumb{width:13px;height:13px;border-radius:50%;" +
        "background:var(--gold-bright,#e6c27a);border:1px solid var(--gold,#c9a24b);cursor:pointer}" +
      ".da-audio .mute{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;" +
        "cursor:pointer;color:var(--gold,#c9a24b);background:rgba(22,17,11,.62);border:1px solid var(--gold,#c9a24b);" +
        "-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);transition:color .3s,border-color .3s,transform .1s}" +
      ".da-audio .mute:hover{color:var(--gold-bright,#e6c27a)}" +
      ".da-audio .mute:active{transform:translateY(1px)}" +
      ".da-audio .mute:focus-visible{outline:2px solid var(--gold-bright,#e6c27a);outline-offset:3px}" +
      ".da-audio .mute svg{width:21px;height:21px;display:block}" +
      ".da-audio .wave{opacity:0;transition:opacity .4s ease}" +
      ".da-audio .slash{opacity:.9;transition:opacity .3s ease}" +
      ".da-audio.is-on .wave{opacity:1}.da-audio.is-on .w2{opacity:.7}.da-audio.is-on .slash{opacity:0}" +
      ".da-audio.is-on .dot{animation:da-pulse 3.4s ease-in-out infinite}" +
      ".da-audio.is-on .mute{color:var(--gold-bright,#e6c27a)}" +
      "@keyframes da-pulse{0%,100%{opacity:1}50%{opacity:.45}}" +
      "@media (prefers-reduced-motion:reduce){.da-audio.is-on .dot{animation:none}}" +
      "@media (max-width:640px){.da-audio .vol{width:56px}}" +
      "@media print{.da-audio{display:none}}";
    document.head.appendChild(s);
  }

  function makeControl() {
    injectCSS();

    // restore saved volume
    var sv = localStorage.getItem(KEY_VOL);
    if (sv !== null && !isNaN(+sv)) vol = Math.min(1, Math.max(0, +sv / 100));

    var wrap = document.createElement("div");
    wrap.className = "da-audio";

    var slider = document.createElement("input");
    slider.type = "range"; slider.min = "0"; slider.max = "100"; slider.step = "1";
    slider.className = "vol"; slider.value = String(Math.round(vol * 100));
    slider.setAttribute("aria-label", "Music volume");

    var btn = document.createElement("button");
    btn.className = "mute"; btn.type = "button";
    btn.setAttribute("aria-label", "Music"); btn.setAttribute("aria-pressed", "false");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<circle class="dot" cx="7" cy="12" r="2.1" fill="currentColor"/>' +
        '<path class="wave w1" d="M11 8.5 A 5 5 0 0 1 11 15.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
        '<path class="wave w2" d="M14.5 5.5 A 9 9 0 0 1 14.5 18.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
        '<line class="slash" x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '</svg>';

    function render() {
      wrap.classList.toggle("is-on", enabled);
      btn.setAttribute("aria-pressed", enabled ? "true" : "false");
      btn.title = enabled ? "Music: on (click to mute)" : "Music: muted (click to play)";
    }

    slider.addEventListener("input", function () {
      vol = Math.min(1, Math.max(0, +slider.value / 100));
      localStorage.setItem(KEY_VOL, String(Math.round(vol * 100)));
      if (!enabled && vol > 0) { play(); localStorage.setItem(KEY_ON, "on"); }
      applyVolume(); render();
    });

    btn.addEventListener("click", function () {
      if (enabled) { mute(); localStorage.setItem(KEY_ON, "off"); }
      else { play(); localStorage.setItem(KEY_ON, "on"); }
      render();
    });

    wrap.appendChild(slider); wrap.appendChild(btn);
    document.body.appendChild(wrap);

    // autoplay by default (unless muted last time)
    if (localStorage.getItem(KEY_ON) !== "off") {
      enabled = true;
      try {
        build();
        ctx.resume().then(function () {
          if (ctx.state === "running") { play(); render(); }
          else { armGesture(); }
        }).catch(function () { armGesture(); });
      } catch (e2) { armGesture(); }
      wrap.classList.add("is-on"); btn.setAttribute("aria-pressed", "true");
      setTimeout(render, 500);
    } else {
      enabled = false; render();
    }
  }

  if (document.body) makeControl();
  else document.addEventListener("DOMContentLoaded", makeControl);
})();
