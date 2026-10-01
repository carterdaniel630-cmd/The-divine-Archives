# Performance baseline — 2026-10-01

*The speed of the site on a phone today, measured before any fix, so later changes can be
compared against it. Nothing in this report has been fixed yet.*

**The short version:** the reading side of the site is fast. The home page, era pages and
chapters score 99–100 out of 100. The museum and most game pages score 90–96. Two games stand
out as slow to *open*: **Dominion of the Ancients (71)** and **the Tomb Robber (82)**. Once
running, four games are **slow to *play*** on a mid-range phone: the Tomb Robber, the fighter,
the Labyrinth and the Firmament. The biggest cause is cheap to fix: on phones, the games draw
more pixels than the screen shows.

## How it was measured, and the limits

- **Lighthouse 13.5** (Google's standard page-speed test), mobile setting: a simulated
  mid-range phone on a slow 4G connection, with the CPU slowed 4×. Each page was run 3 times
  and the middle score kept. Raw data: [`perf-baseline/lighthouse.json`](perf-baseline/lighthouse.json).
- The site was served from this repository by `tools/serve.js`, with compression like
  Cloudflare's, not from the live getconexto.com, which this computer can't reach.
- **Google Fonts were blocked** (unreachable from here), so **page weights below leave out the
  site's fonts** and are a little better than real. The real-world first paint will be slightly
  slower too.
- **Noise:** the same page varied by up to 7 points between runs (worst: pong at 90–97, the
  museum at 92–99). Keep that in mind for the 5-point rule in the new Lighthouse check.
- **Frame rate (FPS)** came from the hidden `?fps=1` overlay (`docs/assets/fps-overlay.js`).
  `tools/fps-games.js` opened each game on a 390-pixel phone screen, started it, played it with
  simple inputs for 10 seconds, and read the overlay. A screenshot taken mid-play proves each
  game was really running ([`perf-baseline/`](perf-baseline/)). The test browser draws in
  software, not on a phone's graphics chip, so **read the FPS numbers as a ranking between
  games, not as exact phone speeds.** For reference, an idle page holds a steady 60 FPS even
  with the CPU slowed 4×.

## Lighthouse (mobile)

Score out of 100 (90+ is "good"). LCP = when the main content appears (under 2.5 s is good).
CLS = how much the layout jumps (under 0.1 is good). TBT = how long the page is frozen to
taps while loading (under 200 ms is good). Weight = data downloaded, without fonts.

| Page | Score | LCP | CLS | TBT | Weight | Files |
|---|---|---|---|---|---|---|
| Home | **100** | 1.5 s | 0 | 0 ms | 55 KB | 8 |
| Era: High Medieval | **99** | 1.7 s | 0 | 0 ms | 29 KB | 5 |
| Chapter ch07 Pre-exilic Israel (the largest chapter) | **99** | 1.7 s | 0 | 0 ms | 39 KB | 7 |
| Chapter ch45 Pistis Sophia | **99** | 1.7 s | 0 | 0 ms | 33 KB | 7 |
| Chapter ch80 Shi'ism | **99** | 1.7 s | 0 | 0 ms | 29 KB | 7 |
| Museum (welcome screen) | **94** | 2.8 s | 0.041 | 0 ms | 393 KB | 18 |
| Game: Divine Casualties (fighter) | **90** | 2.8 s | 0 | 159 ms | **6,231 KB** | 80 |
| Game: Archive Chess | **94** | 2.5 s | 0 | 0 ms | 283 KB | 33 |
| Game: Ouroboros | **94** | 2.5 s | 0 | 67 ms | 282 KB | 33 |
| Game: Ziggurat Builder | **94** | 2.5 s | 0 | 68 ms | 282 KB | 33 |
| Game: The Reliquary | **96** | 2.2 s | 0 | 104 ms | 286 KB | 33 |
| Game: The Seeker's Path | **92** | 2.7 s | 0 | 5 ms | 282 KB | 33 |
| Game: Antithesis (pong) | **95** | 2.4 s | 0 | 68 ms | 282 KB | 33 |
| Game: The Excavation (minesweeper) | **92** | 2.7 s | 0 | 2 ms | 282 KB | 34 |
| Game: The Labyrinth (pac-man) | **95** | 2.2 s | 0 | 154 ms | 282 KB | 33 |
| Game: The Firmament (pinball) | **94** | 2.2 s | 0 | 160 ms | 282 KB | 33 |
| Game: Dominion of the Ancients (risk) | **71** | 2.1 s | 0 | **1,585 ms** | 282 KB | 33 |
| Game: The Tomb Robber (treasure) | **82** | **4.1 s** | 0 | 56 ms | 543 KB | 38 |

What stands out:

- **Every game page downloads every game.** All twelve games live on one page
  (`symbols.html`), which loads all twelve games' code (about 280 KB) even to play one.
  That is why the game pages start at about 2.2–2.8 s where a chapter takes 1.7 s.
- **The fighter downloads 6.2 MB:** the cut-out body parts for all four gods (47 image files),
  even though a match uses only two.
- **Dominion of the Ancients freezes the page for about 1.6 s on open.** It draws its map pixel
  by pixel from random noise every time (`risk.js`, around lines 277–390). Lighthouse's
  breakdown puts 3.8 s of script time (on the slowed CPU) in `risk.js`, including one unbroken
  1-second block.
- **The Tomb Robber's main content appears late (4.1 s).** It loads about 260 KB of character
  art up front (body.png 106 KB, portrait.png 87 KB, and others).

## Frame rate while playing (mid-range phone: CPU slowed 4×)

60 FPS is perfectly smooth. Below 30 looks choppy. Below 15 is hard to play. "Min" is the
worst one-second stretch.

| Game | Avg FPS (CPU 4× slower) | Min FPS | Avg FPS (full speed) | Verdict |
|---|---|---|---|---|
| The Excavation (minesweeper) | 40.1 | 36.1 | 38.7 | fine |
| The Seeker's Path | 37.8 | 35.0 | 36.4 | fine |
| The Reliquary | 36.8 | 34.0 | 37.2 | fine |
| Ouroboros | 33.5 | 30.5 | 35.5 | fine |
| Archive Chess | 33.2 | 31.0 | 33.5 | fine |
| Ziggurat Builder | 32.7 | 29.0 | 36.5 | fine |
| Dominion of the Ancients (risk) | 25.2 | 22.9 | 32.7 | a little choppy |
| Antithesis (pong) | 22.7 | 20.9 | 32.9 | choppy for a fast ball game |
| The Firmament (pinball) | 16.1 | 15.0 | 33.2 | **slow** |
| The Labyrinth (pac-man) | 15.6 | 14.3 | 34.7 | **slow** |
| Divine Casualties (fighter) | 8.8 | 5.8 | 32.8 | **very slow** |
| The Tomb Robber (treasure) | 5.8 | 5.2 | 28.3 | **very slow** |

Raw data: [`fps-cpu4x.json`](perf-baseline/fps-cpu4x.json), [`fps-cpu1x.json`](perf-baseline/fps-cpu1x.json).

Why the games are slow (the diagnosis behind the fixes below):

1. **The games draw far more pixels than a phone shows.** The shared sizing helper
   (`docs/assets/games/archive-games.js`, `scaleFor`, line 321, and the same formula repeated
   in each game) never lets a canvas drop below the game's full internal size. Measured on the
   phone screen, compared with what a typical 2×-density phone needs:
   - the fighter draws 1320×660 pixels for a 323×162 display, about **4× too many**;
   - the Tomb Robber draws 960×576 for 323×194, about **2×**;
   - the Labyrinth about **1.4×**;
   - pinball is sized correctly.

   A CPU profile backs this up: 60–77% of the time goes to the browser's drawing work and under
   1% to the games' own code.
2. **Costly drawing effects every frame:**
   - the fighter uses 21 soft-shadow effects (`shadowBlur`);
   - the Tomb Robber applies a brightness filter while drawing its character, and redraws a
     full-size lighting layer every frame;
   - pac-man, pinball and ouroboros use soft shadows too.
3. **The blurred glass behind the game window** (`games.css`, line 90: `backdrop-filter: blur(2px)`)
   holds even still games to about 37–40 FPS in this test. With it switched off, the Seeker's
   Path went from 39.6 to 60.3 FPS. On the heavy games it is a small part of the cost: 1–2 FPS.
   On real phones the graphics chip does this blur more cheaply, so its real effect is
   uncertain.

## Top 10 fixes, ranked by impact against effort (not applied)

| # | Fix | What it helps | Impact | Effort |
|---|---|---|---|---|
| 1 | **Let game canvases match the screen**: in `scaleFor` and the per-game copies, drop the `Math.max(1, …)` floor so a canvas shrinks to its on-screen size × the phone's pixel density | frame rate of the fighter, the Tomb Robber, the Labyrinth and others; battery | **High** | **Low**: one helper plus about 10 matching lines |
| 2 | **Fighter: load only the two chosen gods' art**, and convert the PNG parts to WebP | the 6.2 MB download, so the fighter page's score and first load | **High** | Medium |
| 3 | **Dominion of the Ancients: stop drawing the map from noise on every open.** Ship the finished map as an image (or build it once and keep it) | the 1.6 s freeze; score 71, likely to the 90s | **High** for that game | Medium |
| 4 | **Tomb Robber: remove the per-frame brightness filter** (use a pre-darkened leg image) and **draw the lighting layer at half size** | the slowest game's frame rate | **High** for that game | Low–Medium |
| 5 | **Fighter: replace the 21 per-frame soft shadows** with glows drawn once and reused | the fighter's frame rate | Medium–High | Medium |
| 6 | **Load each game's code only when that game opens**, instead of all twelve on the Symbols page | start time of every game page (about 2.5 s → closer to 1.7 s) and the Symbols page | Medium | Medium |
| 7 | **Drop the blur behind the game window on phones** (a darker see-through tint instead) | frame rate of every game, especially the calmer ones | Medium (uncertain on real phones) | **Very low**: one CSS line |
| 8 | **Tomb Robber: load the character art after the first screen**, and compress it (WebP) | its 4.1 s main-content time and score 82 | Medium | Low |
| 9 | **Fonts: host the site's fonts on the site** instead of Google Fonts, and preload the two main ones | first paint on every page. Not measurable here, so the CI should confirm it | Medium (unmeasured) | Low–Medium |
| 10 | **Fewer soft shadows in Pac-Man, pinball and ouroboros** (pre-drawn glows) | the frame rate of those three | Low–Medium | Low |

Not on the list, because it isn't a speed problem: the random-chapter bug, now fixed on this
branch (see the founder guide).

## Re-running this

```sh
node tools/serve.js 8080 &
npm install --no-save lighthouse                # once; also needs Chrome or Chromium
node tools/lighthouse-pages.js --target main=http://localhost:8080 --runs 3
node tools/fps-games.js --base http://localhost:8080 --cpu 4 --shots fps-shots   # needs Playwright
```

The **Lighthouse check** (`.github/workflows/lighthouse.yml`) now runs the same page list on
every pull request that changes the site. It compares the pull request with the branch it targets
on the same machine, and fails if any page's mobile score drops by more than 5 points.
