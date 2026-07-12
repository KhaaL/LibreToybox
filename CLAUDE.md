# LibreToybox — Developer Guide

## Project Overview

LibreToybox is a collection of self-contained HTML5 games for children aged 6–8, designed for touchscreens. Each game is a single `index.html` plus a tiny `sw.js` service worker — no build step, no external runtime dependencies, and no tracking.

```
LibreToybox/
├── sudoku-for-minis/
│   ├── index.html            — Child Sudoku (4×4, beginner-friendly)
│   └── sw.js                 — offline cache worker
├── exquisite-corpse/
│   ├── index.html            — Exquisite Corpse drawing game (ships as "Fold and Pass")
│   └── sw.js                 — offline cache worker
├── memory/
│   ├── index.html            — Memory (pairs-matching, 4×4 / 6×4 board)
│   └── sw.js                 — offline cache worker
├── .github/workflows/
│   └── deploy-pages.yml      — auto-deploy to GitHub Pages on push to main
├── index.html                — game hub / landing page (links to all games)
├── design_principles.txt     — authoritative design rules (read before any change)
├── plan.md                   — pending work (single source of truth)
├── AUDIT.md                  — repository audit (2026-07-12 snapshot)
├── README.md
├── LICENSE                   — GNU GPL v3.0
└── CLAUDE.md                 — this file
```

**Naming:** the project/repository name is **LibreToybox**. The drawing game's working name in these docs is *Exquisite Corpse*; its player-facing title is **Fold and Pass** (renamed 2026-07-12 from "Combination Man" for a gender-neutral, theme-fitting title — exquisite corpse is traditionally played by folding paper and passing it along).

## Tech Stack

- Vanilla HTML5 / CSS3 / JavaScript — no frameworks, no build tools
- HTML5 Canvas API for drawing (exquisite-corpse)
- Web Audio API for procedural sound (all games)
- PWA: local `sw.js` service worker (registered only over http/https — browsers reject blob-URL workers) + runtime Blob-URL manifest (all games)
- Zero external dependencies — system font stack, procedural audio, inline SVG icons
- Hosting: GitHub Pages, deployed automatically by `.github/workflows/deploy-pages.yml` on every push to `main` — no external hosting account, no build step, the whole repo is served as-is

## Design Rules (non-negotiable)

All decisions must follow `design_principles.txt`. Key ones:

1. **Visual-first, text-light** — emoji and icons over words; minimal labels
2. **Direct manipulation** — immediate response to every touch; no latent selection
3. **Chunky targets** — ≥60×60 px cells, ≥64×64 px tool buttons
4. **Sound as feedback** — Web Audio API only; short, pleasant, non-looping
5. **Offline-first** — works at `file://` with no server; `sw.js` adds offline caching when served over http(s)
6. **No tracking, no ads, no online requirement**

## Exquisite Corpse — Architecture Notes

`exquisite-corpse/index.html` — key design decisions to preserve:

### Canvas layout
- `#canvas-wrap` is the visible viewport; `overflow: hidden`
- `#drawing-canvas` is `sections × wrapHeight` tall — all sections in one canvas
- Canvas slides via CSS `translateY` to show the current section
- `PEEK_PX: 40` — pixels of previous section visible at top as connection guide
- Two canvas modes: **Tall** (`flex:1`, fills height) and **Wide** (`aspect-ratio: 4/3`)

### Stroke storage
- All points stored as **normalized 0..1 coordinates** — resize-safe
- Scaled to canvas pixels at draw time in `redrawCanvas()`
- Section clipping via `ctx.rect(0, sectionIdx * sH, w, sH)` + `ctx.clip()`

### Section transitions
- Automatic after Done — 400 ms CSS transition (460 ms JS timeout), then `currentSection++`
- No handoff pause screen

### Win/reveal screen
- `#reveal-canvas` is a separate `<canvas>` overlay (same size as `#canvas-wrap`)
- `reveal()` renders the full artwork onto an offscreen buffer at its true (undistorted) aspect ratio — same `redrawCanvas()` technique, just onto a temporary canvas — then letterbox-scales that buffer into `#reveal-canvas` via `drawImage()` so nothing stretches. Drawing straight onto a wrap-sized canvas is what used to squish the figure.
- The buffer is kept as `this.artworkCanvas`; `downloadPainting()` exports that directly (undistorted), not the letterboxed on-screen overlay
- Main canvas never moves or resizes → no layout jump
- Toolbar rows hidden with `visibility: hidden` (NOT `display: none`) — they stay in layout as invisible spacers, preserving canvas position

### Settings
- Changing canvas mode (`setCanvasMode()`) resizes the canvas for the new aspect and redraws existing strokes — it does **not** call `newGame()`, so the drawing in progress is preserved (design principle 9)

## Child Sudoku — Architecture Notes

`sudoku-for-minis/index.html` — standard single-file Sudoku with:
- Number pad → cell placement flow (select destination, then digit)
- The active digit resets after **every** placement — no latent selection (design principle 2)
- Reject mode / Keep mode toggle for illegal numbers
- `checkWin()` requires the board to be full **and** conflict-free (Keep mode can fill the board with conflicts still present)
- Pointer Events only (`pointerdown`/`move`/`up`/`cancel`) — never touch/mouse pairs, which double-fire via synthetic mouse events
- Web Audio feedback on placement, error, win
- Confetti win overlay

## Memory — Architecture Notes

`memory/index.html` — pairs-matching game:
- All tuning lives in the `CONFIG` object at the top of the script: board sizes (`small` 8 pairs / `large` 12 pairs, both 4 columns wide for portrait phones), flip duration, mismatch hold time, deal stagger, and the emoji face pool
- Cards are real `<button>`s — one `click` stream covers mouse, touch, pen **and** Enter/Space keyboard activation; no pointer/touch pairing needed (no long-press gesture in this game)
- 3D flip via CSS: `.card-inner` rotates `rotateY(180deg)`, both faces use `backface-visibility: hidden`
- A mismatched pair never blocks play (design principle 10): it flips back after `mismatchHoldMs`, **or** immediately when a third card is tapped (`resolveMismatch()` runs before the new flip)
- A matched pair shows for `matchGoneMs`, then flies away (suction animation) — the `.gone` card keeps its grid slot as an invisible spacer so remaining cards never shift position; the board empties toward the win. Removal timers carry a `gameId` generation check so a 🔄 mid-animation can't touch the new board
- Mismatch sound is a gentle low sine ("hmm"), not a buzz — mistakes are expected gameplay here, not errors (design principle 3)
- **No timer, no move counter** — deliberate: no pressure mechanics (humane-first)
- Win overlay is translucent (`rgba(255,255,255,0.55)`, content bottom-anchored) so the completed board stays visible under the confetti
- Settings ⚙️ has exactly one control: board size (🐣 4×4 / 🦁 6×4). Choosing a size closes the overlay first, then re-deals **visibly** (suction-out + staggered pop-in + swoosh) — never a silent reset (design principle 9)

## Pending Work

See `plan.md` — it is the **single source of truth** for open bugs and features. This file intentionally does not duplicate its contents.

## Adding a New Game

1. Copy the PWA boilerplate from either existing game: `setupPWA()` **and** the sibling `sw.js`. Register the worker with a relative path (`navigator.serviceWorker.register('sw.js')`) — blob-/data-URL worker scripts are rejected by browsers. Give each game its own cache name, and **bump that name in every release that changes the game** — the worker serves cache-first, so returning players keep the old version until the name changes (see plan.md "Service-worker update strategy" for the pending long-term fix).
2. Copy `playTone()` and audio helpers — don't use external audio files
3. No external fonts or CDNs — use the system font stack from the existing games
4. Follow all 10 design principles in `design_principles.txt`
5. Game lives in its own subdirectory as `index.html` (+ `sw.js`)
6. Add pending features to `plan.md`
