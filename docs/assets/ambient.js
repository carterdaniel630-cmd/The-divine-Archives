/* ==========================================================================
   THE DIVINE ARCHIVES — site-wide ambient "archive room tone"

   A NEW, distinct soundscape from the Reading Room (which keeps its bowed
   strings, choir, piano, and bell on its own page). This one is deliberately
   minimal and nearly subliminal — a focus aid for long reading sessions, not
   music:
     - a very quiet low drone (body/warmth only, no melodic interval)
     - a heavily low-passed noise "air/room" bed (the sound of a still room)
     - sparse, faint paper-rustle and wood-creak textures, randomized
   No melody, no percussion, no swells. Muted by default; a small corner
   toggle enables/mutes it, and the choice persists across page navigation
   (localStorage). Because each page is a fresh load and browsers block
   autoplay until interaction, when "on" it resumes on load where allowed and
   otherwise on the first click/scroll/keypress on the new page.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "da-ambient";               // "on" | "off"
  var ctx = null, master = null, running = false, built = false, armed = false;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timers = [];

  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ---- noise buffers (generated once) ---- */
  function brownBuffer(seconds) {
    var len = (ctx.sampleRate * seconds) | 0, buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) {
      var white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      d[i] = last * 3.2;
    }
    return buf;
  }
  function whiteBuffer(seconds) {
    var len = (ctx.sampleRate * seconds) | 0, buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.0001;          // silent until enabled
    master.connect(ctx.destination);

    // --- room "air" bed: looping brown noise, heavily low-passed, very quiet
    var bed = ctx.createBufferSource();
    bed.buffer = brownBuffer(8); bed.loop = true;
    var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 330; lp.Q.value = 0.3;
    var bedGain = ctx.createGain(); bedGain.gain.value = 0.11;
    bed.connect(lp); lp.connect(bedGain); bedGain.connect(master); bed.start();

    // --- a faint, still higher "air" hiss, extremely low (texture, not hiss-y)
    var air = ctx.createBufferSource();
    air.buffer = whiteBuffer(6); air.loop = true;
    var bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1200; bp.Q.value = 0.4;
    var airGain = ctx.createGain(); airGain.gain.value = 0.006;
    air.connect(bp); bp.connect(airGain); airGain.connect(master); air.start();

    // --- low drone body: a single sub-oscillator, no harmonic interval (not music)
    var osc = ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = 58;
    var oscLp = ctx.createBiquadFilter(); oscLp.type = "lowpass"; oscLp.frequency.value = 160;
    var oscGain = ctx.createGain(); oscGain.gain.value = 0.05;
    osc.connect(oscLp); oscLp.connect(oscGain); oscGain.connect(master); osc.start();

    // shared noise buffer for textures
    var texBuf = whiteBuffer(2);

    // --- wood/settling "creak": slow band-passed noise swell, rare & quiet
    function creak() {
      var t = ctx.currentTime, dur = rnd(0.8, 1.8);
      var s = ctx.createBufferSource(); s.buffer = texBuf; s.loop = true;
      var f = ctx.createBiquadFilter(); f.type = "bandpass";
      f.frequency.value = rnd(180, 560); f.Q.value = rnd(3, 7);
      var g = ctx.createGain(); g.gain.value = 0.0001;
      s.connect(f); f.connect(g); g.connect(master);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(rnd(0.012, 0.024), t + rnd(0.3, 0.7));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.start(t); s.stop(t + dur + 0.1);
    }

    // --- paper rustle / page turn: a tiny cluster of brief high-passed crackles
    function paper() {
      var n = 2 + (Math.random() * 3 | 0), t0 = ctx.currentTime;
      for (var i = 0; i < n; i++) {
        var t = t0 + i * rnd(0.04, 0.12), dur = rnd(0.03, 0.09);
        var s = ctx.createBufferSource(); s.buffer = texBuf; s.loop = true;
        var f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = rnd(2200, 3800);
        var g = ctx.createGain(); g.gain.value = 0.0001;
        s.connect(f); f.connect(g); g.connect(master);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(rnd(0.008, 0.018), t + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        s.start(t); s.stop(t + dur + 0.05);
      }
    }

    // sparse, non-repeating scheduler — long gaps, frequent rests
    function tick() {
      if (running) {
        var r = Math.random();
        if (r < 0.42) creak();
        else if (r < 0.72) paper();
        // else: rest (silence) — keeps it subliminal
      }
      timers.push(setTimeout(tick, rnd(14, 42) * 1000));
    }
    timers.push(setTimeout(tick, rnd(6, 14) * 1000));

    built = true;
  }

  function setGain(on) {
    if (!master) return;
    master.gain.setTargetAtTime(on ? 0.06 : 0.0001, ctx.currentTime, 0.6);
  }

  function start() {
    if (!built) build();
    if (ctx.state === "suspended") ctx.resume();
    running = true; setGain(true);
  }
  function stop() {
    running = false; setGain(false);
    if (ctx) setTimeout(function () { if (!running && ctx) ctx.suspend(); }, 800);
  }

  /* ---- resume-on-first-gesture (for navigation while "on") ---- */
  function armGesture() {
    if (armed) return; armed = true;
    var go = function () {
      window.removeEventListener("pointerdown", go);
      window.removeEventListener("keydown", go);
      window.removeEventListener("scroll", go);
      if (localStorage.getItem(KEY) === "on") start();
    };
    window.addEventListener("pointerdown", go, { once: true });
    window.addEventListener("keydown", go, { once: true });
    window.addEventListener("scroll", go, { once: true, passive: true });
  }

  /* ---- the corner toggle ---- */
  function makeButton() {
    var b = document.createElement("button");
    b.className = "ambient-toggle";
    b.type = "button";
    b.setAttribute("aria-label", "Ambient archive room tone");
    b.setAttribute("aria-pressed", "false");
    b.title = "Ambient room tone";
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
      b.title = running ? "Ambient room tone: on" : "Ambient room tone: off (click for a quiet reading ambience)";
    }
    b.addEventListener("click", function () {
      if (!running) { start(); localStorage.setItem(KEY, "on"); }
      else { stop(); localStorage.setItem(KEY, "off"); }
      render();
    });
    document.body.appendChild(b);

    // restore persisted preference
    if (localStorage.getItem(KEY) === "on") {
      try {
        build(); ctx.resume().then(function () {
          if (ctx.state === "running") { running = true; setGain(true); render(); }
          else { armGesture(); }
        }).catch(function () { armGesture(); });
      } catch (e) { armGesture(); }
      // reflect intended state immediately even if audio is waiting for a gesture
      b.classList.add("is-on"); b.setAttribute("aria-pressed", "true");
      // once it actually starts, keep the icon accurate
      setTimeout(render, 400);
    } else {
      render();
    }
  }

  if (document.body) makeButton();
  else document.addEventListener("DOMContentLoaded", makeButton);
})();
