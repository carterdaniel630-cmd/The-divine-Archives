/* ==========================================================================
   THE DIVINE ARCHIVES — site-wide background score

   A single, continuous instrumental soundtrack that plays across the WHOLE
   site as you read and scroll — not a page you visit, not a click-to-listen
   room. Think "elevator music," but tuned to the archive: a slow, warm,
   contemplative loop that stays out of the way.

     - a soft four-chord pad progression (Dm – B flat – F – C), 32-second loop
     - a gentle sub-bass root under each chord
     - a sparse, bell-like melody in a minor-pentatonic voice
     - everything through a hall reverb, a soft low-pass, and a limiter so it
       never spikes or fatigues on a long read

   Everything is synthesized in the Web Audio API — no audio files, no network,
   nothing to license — matching the rest of the site's sound work.

   PLAYBACK MODEL
     - On by default. The corner control is a MUTE toggle, and the choice
       persists across pages (localStorage "da-music").
     - Browsers block audible autoplay until the visitor interacts with the
       page, so on a fresh load the score starts the instant they do anything
       (scroll / click / tap / key) — which, on a site you scroll through, is
       immediately. Where a browser does allow autoplay, it starts on load.
     - Each page is a fresh document, but the loop is phase-locked to a shared
       session clock (sessionStorage "da-music-epoch"), so navigating between
       pages continues the piece roughly where it was rather than restarting.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "da-music";                 // "on" | "off"  (absent = on)
  var EPOCH = "da-music-epoch";         // session-wide conceptual start (ms)
  var LOOP = 32;                        // seconds per full progression
  var SEG = LOOP / 4;                   // seconds per chord

  var ctx = null, master = null, voiceBus = null, wetBus = null;
  var running = false, built = false, armed = false, pumping = false;
  var anchorC = 0, anchorCtx = 0, anchorSet = false;
  var scheduledLoopC = null;
  var timers = [];

  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  /* ------- the piece: four chords, a bass root each, a sparse melody ------- */
  // pad voicings (MIDI) and bass root per 8-second segment
  var CHORDS = [
    { pad: [62, 65, 69], bass: 38 },    // Dm  (D F A)  / D2
    { pad: [58, 62, 65], bass: 34 },    // Bb  (Bb D F) / Bb1
    { pad: [60, 65, 69], bass: 41 },    // F   (C F A)  / F2
    { pad: [60, 64, 67], bass: 36 }     // C   (C E G)  / C2
  ];
  // bell melody: [seconds-into-loop, MIDI] — chord tones, gentle and spread out
  var MELODY = [
    [1.0, 69], [5.0, 74],               // over Dm
    [9.0, 74], [13.0, 77],              // over Bb
    [17.0, 72], [21.0, 69],             // over F
    [25.0, 67], [29.0, 76]              // over C
  ];

  /* ---- a short generated impulse response for the hall reverb ---- */
  function makeImpulse(seconds, decay) {
    var len = (ctx.sampleRate * seconds) | 0;
    var buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch);
      for (var i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    master = ctx.createGain();
    master.gain.value = 0.0001;         // silent until faded in

    // gentle limiter/compressor so overlapping voices never spike
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 24;
    comp.ratio.value = 4; comp.attack.value = 0.01; comp.release.value = 0.28;

    // soften the top so it reads as background, not foreground
    var soft = ctx.createBiquadFilter();
    soft.type = "lowpass"; soft.frequency.value = 4200; soft.Q.value = 0.4;

    master.connect(soft); soft.connect(comp); comp.connect(ctx.destination);

    // dry + reverb sends
    voiceBus = ctx.createGain(); voiceBus.gain.value = 1;
    var dry = ctx.createGain(); dry.gain.value = 0.82;
    var conv = ctx.createConvolver(); conv.buffer = makeImpulse(2.6, 2.4);
    wetBus = ctx.createGain(); wetBus.gain.value = 0.5;
    voiceBus.connect(dry); dry.connect(master);
    voiceBus.connect(conv); conv.connect(wetBus); wetBus.connect(master);

    built = true;
  }

  /* ---- conceptual (session) clock <-> AudioContext clock ---- */
  function conceptualNow() {
    var e = +sessionStorage.getItem(EPOCH);
    if (!e) { e = Date.now(); try { sessionStorage.setItem(EPOCH, e); } catch (x) {} }
    return (Date.now() - e) / 1000;
  }
  function ctxTimeFor(C) { return anchorCtx + (C - anchorC); }

  /* ---- voices ---- */
  function pad(freq, tc, dur) {
    var o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    o1.type = "sine"; o2.type = "triangle";
    o1.frequency.value = freq; o2.frequency.value = freq * 1.004;   // slight detune
    var lp = ctx.createBiquadFilter(); lp.type = "lowpass";
    lp.frequency.value = 1500; lp.Q.value = 0.5;
    var g = ctx.createGain(); g.gain.value = 0.0001;
    o1.connect(lp); o2.connect(lp); lp.connect(g); g.connect(voiceBus);
    g.gain.setValueAtTime(0.0001, tc);
    g.gain.exponentialRampToValueAtTime(0.05, tc + 1.7);            // slow swell in
    g.gain.setValueAtTime(0.05, tc + dur - 2.0);
    g.gain.exponentialRampToValueAtTime(0.0001, tc + dur);          // slow fade out
    o1.start(tc); o2.start(tc); o1.stop(tc + dur + 0.05); o2.stop(tc + dur + 0.05);
  }

  function bass(freq, tc, dur) {
    var o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = freq;
    var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 220;
    var g = ctx.createGain(); g.gain.value = 0.0001;
    o.connect(lp); lp.connect(g); g.connect(voiceBus);
    g.gain.setValueAtTime(0.0001, tc);
    g.gain.exponentialRampToValueAtTime(0.085, tc + 0.5);
    g.gain.setValueAtTime(0.085, tc + dur - 1.6);
    g.gain.exponentialRampToValueAtTime(0.0001, tc + dur);
    o.start(tc); o.stop(tc + dur + 0.05);
  }

  function bell(freq, tc) {
    // struck, decaying tone — sine fundamental plus a soft octave partial
    var o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    o1.type = "sine"; o2.type = "sine";
    o1.frequency.value = freq; o2.frequency.value = freq * 2;
    var g1 = ctx.createGain(), g2 = ctx.createGain();
    g1.gain.value = 0.0001; g2.gain.value = 0.0001;
    o1.connect(g1); o2.connect(g2); g1.connect(voiceBus); g2.connect(voiceBus);
    var peak = 0.05;
    g1.gain.setValueAtTime(0.0001, tc);
    g1.gain.exponentialRampToValueAtTime(peak, tc + 0.015);
    g1.gain.exponentialRampToValueAtTime(0.0001, tc + 2.6);
    g2.gain.setValueAtTime(0.0001, tc);
    g2.gain.exponentialRampToValueAtTime(peak * 0.28, tc + 0.012);
    g2.gain.exponentialRampToValueAtTime(0.0001, tc + 1.4);
    o1.start(tc); o2.start(tc); o1.stop(tc + 2.7); o2.stop(tc + 1.5);
  }

  /* ---- schedule one full 32s loop starting at conceptual time loopC ---- */
  function scheduleLoop(loopC) {
    var guard = ctx.currentTime + 0.03;
    var i, tc;
    for (i = 0; i < CHORDS.length; i++) {
      var segC = loopC + i * SEG;
      tc = ctxTimeFor(segC);
      // overlap segments slightly so pads cross-fade rather than gap
      if (tc >= guard) {
        var padDur = SEG + 1.2;
        for (var j = 0; j < CHORDS[i].pad.length; j++) pad(mtof(CHORDS[i].pad[j]), tc, padDur);
        bass(mtof(CHORDS[i].bass), tc, SEG + 0.6);
      }
    }
    for (i = 0; i < MELODY.length; i++) {
      tc = ctxTimeFor(loopC + MELODY[i][0]);
      if (tc >= guard) bell(mtof(MELODY[i][1]), tc);
    }
  }

  /* ---- keep the schedule a few seconds ahead of the playhead ---- */
  function pump() {
    if (!running) { pumping = false; return; }
    pumping = true;
    var horizonC = conceptualNow() + 5;
    var startC = (scheduledLoopC === null)
      ? Math.floor(conceptualNow() / LOOP) * LOOP
      : scheduledLoopC + LOOP;
    while (startC <= horizonC) {
      scheduleLoop(startC);
      scheduledLoopC = startC;
      startC += LOOP;
    }
    timers.push(setTimeout(pump, 1500));
  }

  function setGain(on) {
    if (!master) return;
    master.gain.setTargetAtTime(on ? 0.9 : 0.0001, ctx.currentTime, 0.7);
  }

  function start() {
    if (!built) build();
    if (ctx.state === "suspended") ctx.resume();
    if (!anchorSet) { anchorC = conceptualNow(); anchorCtx = ctx.currentTime + 0.15; anchorSet = true; }
    running = true;
    setGain(true);
    if (!pumping) pump();
  }

  function stop() {
    running = false;
    setGain(false);
    while (timers.length) clearTimeout(timers.pop());
    pumping = false; scheduledLoopC = null;
    if (ctx) setTimeout(function () { if (!running && ctx) ctx.suspend(); }, 900);
  }

  /* ---- start on the visitor's first interaction (autoplay fallback) ---- */
  function armGesture() {
    if (armed) return; armed = true;
    var go = function () {
      window.removeEventListener("pointerdown", go);
      window.removeEventListener("touchstart", go);
      window.removeEventListener("keydown", go);
      window.removeEventListener("scroll", go);
      if (localStorage.getItem(KEY) !== "off") start();
    };
    window.addEventListener("pointerdown", go, { once: true });
    window.addEventListener("touchstart", go, { once: true, passive: true });
    window.addEventListener("keydown", go, { once: true });
    window.addEventListener("scroll", go, { once: true, passive: true });
  }

  /* ---- the corner mute toggle ---- */
  function makeButton() {
    var b = document.createElement("button");
    b.className = "ambient-toggle";
    b.type = "button";
    b.setAttribute("aria-label", "Background music");
    b.setAttribute("aria-pressed", "false");
    b.title = "Background music";
    b.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<circle class="dot" cx="7" cy="12" r="2.1" fill="currentColor"/>' +
        '<path class="wave w1" d="M11 8.5 A 5 5 0 0 1 11 15.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
        '<path class="wave w2" d="M14.5 5.5 A 9 9 0 0 1 14.5 18.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
        '<line class="slash" x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '</svg>';

    function render() {
      b.classList.toggle("is-on", running);
      b.setAttribute("aria-pressed", running ? "true" : "false");
      b.title = running ? "Background music: on (click to mute)"
                        : "Background music: muted (click to play)";
    }

    b.addEventListener("click", function () {
      if (!running) { start(); localStorage.setItem(KEY, "on"); }
      else { stop(); localStorage.setItem(KEY, "off"); }
      render();
    });

    document.body.appendChild(b);

    // On by default: play unless the visitor has muted it.
    if (localStorage.getItem(KEY) !== "off") {
      try {
        build();
        ctx.resume().then(function () {
          if (ctx.state === "running") { start(); render(); }
          else { armGesture(); }
        }).catch(function () { armGesture(); });
      } catch (e) { armGesture(); }
      // reflect intended (playing) state right away, even while waiting for a gesture
      b.classList.add("is-on"); b.setAttribute("aria-pressed", "true");
      setTimeout(render, 500);
    } else {
      render();
    }
  }

  if (document.body) makeButton();
  else document.addEventListener("DOMContentLoaded", makeButton);
})();
