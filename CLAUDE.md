# Child Games — Developer Guide

## Project Overview

A collection of self-contained HTML5 games for children aged 6–8, designed for touchscreens. Each game is a **single `.html` file** with no build step, no external runtime dependencies, and no tracking.

```
child-games/
├── soduko-for-minis/index.html   — child-friendly Sudoku
├── exquisite-corpse/index.html   — Exquisite Corpse drawing game
├── design_principles.txt         — authoritative design rules (read before any change)
└── plan.md                       — pending improvements per game
```

## Tech Stack

- Vanilla HTML5 / CSS3 / JavaScript — no frameworks, no build tools
- HTML5 Canvas API for drawing (exquisite-corpse)
- Web Audio API for procedural sound (both games)
- PWA via Blob-URL service worker + runtime manifest (both games)
- Google Fonts CDN is the only optional external dependency

## Design Rules (non-negotiable)

All decisions must follow `design_principles.txt`. Key ones:

1. **Visual-first, text-light** — emoji and icons over words; minimal labels
2. **Direct manipulation** — immediate response to every touch
3. **Chunky targets** — ≥60×60 px cells, ≥64×64 px tool buttons
4. **Sound as feedback** — Web Audio API only; short, pleasant, non-looping
5. **Offline-first** — single HTML file, works at `file://` with no server
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
- Automatic after Done — 460 ms CSS transition, then `currentSection++`
- No handoff pause screen

### Win/reveal screen
- `#reveal-canvas` is a separate `<canvas>` overlay (same size as `#canvas-wrap`)
- `reveal()` temporarily swaps `this.canvas`/`this.ctx` to draw onto it using `redrawCanvas()`
- Main canvas never moves or resizes → no layout jump
- Toolbar rows hidden with `visibility: hidden` (NOT `display: none`) — they stay in layout as invisible spacers, preserving canvas position

### Settings
- Changing canvas mode calls `newGame()` — always resets the game

## Child Sudoku — Architecture Notes

`soduko-for-minis/index.html` — standard single-file Sudoku with:
- Number pad → cell placement flow (select destination, then digit)
- Reject mode / Keep mode toggle for illegal numbers
- Web Audio feedback on placement, error, win
- Confetti win overlay (pending: should keep puzzle visible beneath)

## Pending Work

See `plan.md` for current task list. Summary as of 2026-07-11:
- **Sudoku**: selected-cell highlight too subtle; win overlay hides puzzle
- **Exquisite Corpse**: all features complete

## Adding a New Game

1. Copy the PWA boilerplate (`setupPWA()`) from either existing game
2. Copy `playTone()` and audio helpers — don't use external audio files
3. Follow all 10 design principles in `design_principles.txt`
4. Single `.html` file in its own subdirectory
5. Add pending features to `plan.md`
