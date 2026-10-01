/* The Divine Archives — hidden frame-rate overlay for the games.
   Does nothing unless the page URL carries ?fps=1 (e.g. symbols.html?fps=1#play=pong).
   Counts the browser's animation frames, which is the rate at which the games can draw, and
   shows: the current rate, the average since the last reset, the worst one-second window, and
   the longest single frame. window.__fps holds the same numbers and window.__fpsReset() starts
   a new measurement; tools/perf-baseline.js reads them. Not linked anywhere on the site. */
(function () {
  if (!/[?&]fps=1\b/.test(location.search)) return;
  var box = document.createElement("div");
  box.setAttribute("aria-hidden", "true");
  box.style.cssText = "position:fixed;right:6px;top:6px;z-index:2147483647;padding:4px 7px;border-radius:4px;" +
    "background:rgba(0,0,0,.72);color:#9f9;font:12px/1.35 ui-monospace,Menlo,monospace;pointer-events:none;white-space:pre";
  var S;
  function reset() {
    S = { start: performance.now(), frames: 0, secStart: performance.now(), secFrames: 0,
          cur: 0, min: Infinity, worstFrameMs: 0, last: performance.now() };
  }
  reset();
  window.__fpsReset = reset;
  function tick(now) {
    var dt = now - S.last; S.last = now;
    S.frames++; S.secFrames++;
    if (S.frames > 1 && dt > S.worstFrameMs) S.worstFrameMs = dt;
    if (now - S.secStart >= 1000) {
      S.cur = S.secFrames * 1000 / (now - S.secStart);
      if (S.cur < S.min) S.min = S.cur;
      S.secStart = now; S.secFrames = 0;
    }
    var secs = (now - S.start) / 1000;
    var avg = secs > 0 ? S.frames / secs : 0;
    window.__fps = { avg: avg, min: S.min === Infinity ? null : S.min, cur: S.cur, worstFrameMs: S.worstFrameMs, seconds: secs };
    box.textContent = "fps " + S.cur.toFixed(0) + "  avg " + avg.toFixed(1) + "\nmin " +
      (S.min === Infinity ? "–" : S.min.toFixed(0)) + "  worst frame " + S.worstFrameMs.toFixed(0) + " ms";
    requestAnimationFrame(tick);
  }
  function start() { document.body.appendChild(box); requestAnimationFrame(tick); }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
