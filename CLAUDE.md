# LibreToybox — Developer Guide

## Project Overview

LibreToybox is a collection of self-contained HTML5 games for children aged 6–8, designed for touchscreens. Each game is a single `index.html` plus a tiny `sw.js` service worker — no build step, no external runtime dependencies, and no tracking.

```
LibreToybox/
├── sudoku-for-minis/
│   ├── index.html            — Child Sudoku (4×4 / 6×6 / 8×8, beginner-friendly)
│   └── sw.js                 — offline cache worker
├── exquisite-corpse/
│   ├── index.html            — Exquisite Corpse drawing game (ships as "Fold and Pass")
│   └── sw.js                 — offline cache worker
├── memory/
│   ├── index.html            — Memory (pairs-matching, 4×4 / 6×4 board)
│   └── sw.js                 — offline cache worker
├── shape-fit/
│   ├── index.html            — Shape Fit (grid-packing puzzle, 4×4 / 5×5 / 6×6 / 7×7 board)
│   └── sw.js                 — offline cache worker
├── .github/workflows/
│   └── deploy-pages.yml      — auto-deploy to GitHub Pages on push to main
├── index.html                — game hub / landing page (links to all games)
├── design_principles.txt     — authoritative design rules (read before any change)
├── plan.md                   — pending work (single source of truth)
├── done.md                   — completed items, moved out of plan.md
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
- PWA: local `sw.js` service worker (registered only over http/https — browsers reject blob-URL workers; **stale-while-revalidate**, so deployed updates reach players one visit later with no cache-name bump) + runtime Blob-URL manifest (all games)
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
7. **One color system** — Shape Fit's `CONFIG.palette` is the canonical pastel set; per-game identity comes from the background hue family only; interactive elements are flat fill + darker same-hue edge, never gradients (principle 11)

## Exquisite Corpse — Architecture Notes

`exquisite-corpse/index.html` — key design decisions to preserve:

### Canvas layout
- `#canvas-wrap` is the visible viewport; `overflow: hidden`
- `#drawing-canvas` is `sections × wrapHeight` tall — all sections in one canvas
- Canvas slides via CSS `translateY` to show the current section
- `PEEK_PX: 40` — pixels of previous section visible at top as connection guide
- Two canvas modes: **Tall** (`flex:1`, fills height) and **Wide** (`aspect-ratio: 4/3`)

### Toolbar
- All controls are ≥64×64 px (design principle 4); `#color-row` and `#tool-row` are `flex-wrap: wrap`, so the six swatches (~424 px in one line) wrap to two rows on narrow phones and the Tall canvas (`flex: 1`) absorbs the extra row — never shrink the controls below 64 px to avoid the wrap
- The six `COLORS` are deliberately bold, saturated inks — they are paint, not UI chrome, and are exempt from the pastel rule (principle 11 covers interactive elements)

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
- **Board sizes** (settings radio, same pattern as Memory/Shape Fit): 🐣 4×4 (digits 1–4, 2×2 boxes, the default) / 🐥 6×6 (1–6, 2×3 boxes) / 🦁 8×8 (1–8, 2×4 boxes). All geometry lives in the `SIZES` table at the top of the script (`n`, `boxR`×`boxC`, givens target — ~50% of cells at every size — and per-size number font). Thick box borders are per-cell classes (`box-l`/`box-t`) set from the box geometry, **not** static CSS. The number pad is built dynamically; digits 5–8 continue the canonical pastel palette with darker same-hue text (principle 11), and the pad width is capped so rows wrap evenly (3+3, 4+4)
- Number pad → cell placement flow (select destination, then digit)
- The active digit resets after **every** placement — no latent selection (design principle 2)
- Reject mode / Keep mode toggle for **wrong numbers** — since every puzzle has a unique solution, "wrong" is simply "not the solution digit" (`isWrong()`), which covers rule-breaking (illegal) placements and quietly-wrong-but-legal ones alike; reject mode flies both back to the pad, keep mode leaves both red until fixed
- `checkWin()` requires the board to be full **and** conflict-free (Keep mode can fill the board with wrong numbers still present)
- Pointer Events only (`pointerdown`/`move`/`up`/`cancel`) — never touch/mouse pairs, which double-fire via synthetic mouse events
- Web Audio feedback on placement, error, win
- Confetti win overlay

## Memory — Architecture Notes

`memory/index.html` — pairs-matching game:
- All tuning lives in the `CONFIG` object at the top of the script: board sizes (`small` 8 pairs / `large` 12 pairs, both 4 columns wide for portrait phones), flip duration, mismatch hold time, deal stagger, and the emoji face pool
- Card backs are the canonical palette's sky blue — flat `#8ED3F4` fill with a darker same-hue `#54A6D2` edge (design principle 11), never a gradient; the accent/theme-color is the same `#54A6D2` so the whole game stays in its ice-blue background family
- Cards are real `<button>`s — one `click` stream covers mouse, touch, pen **and** Enter/Space keyboard activation; no pointer/touch pairing needed (no long-press gesture in this game)
- 3D flip via CSS: `.card-inner` rotates `rotateY(180deg)`, both faces use `backface-visibility: hidden`
- A mismatched pair never blocks play (design principle 10): it flips back after `mismatchHoldMs`, **or** immediately when a third card is tapped (`resolveMismatch()` runs before the new flip)
- A matched pair shows for `matchGoneMs`, then flies away (suction animation) — the `.gone` card keeps its grid slot as an invisible spacer so remaining cards never shift position; the board empties toward the win. Removal timers carry a `gameId` generation check so a 🔄 mid-animation can't touch the new board
- Mismatch sound is a gentle low sine ("hmm"), not a buzz — mistakes are expected gameplay here, not errors (design principle 3)
- **No timer, no move counter** — deliberate: no pressure mechanics (humane-first)
- Win overlay is translucent (`rgba(255,255,255,0.55)`, content bottom-anchored) so the completed board stays visible under the confetti
- Settings ⚙️ has exactly one control: board size (🐣 4×4 / 🦁 6×4). Choosing a size closes the overlay first, then re-deals **visibly** (suction-out + staggered pop-in + swoosh) — never a silent reset (design principle 9)

## Shape Fit — Architecture Notes

`shape-fit/index.html` — no-timer grid-packing puzzle ("reverse Tetris"): the board is cut into polyomino pieces (box, L, S, T…) that the child drags back to fill the whole grid. All tuning lives in the `CONFIG` object at the top of the script.

- **Generate the solution first**: randomized region-growing partitions the N×N board into connected pieces (3–6 cell targets; undersized leftovers are merged into an adjacent piece), so a solution exists by construction. Greedy coloring over the piece-adjacency graph (palette order shuffled per game) guarantees touching pieces never share a color.
- **Board sizes** (the one settings toggle): 🐣 4×4 (~4 pieces, for the youngest) / 🐤 5×5 (~6 pieces, **the default**) / 🐥 6×6 (~8 pieces) / 🦁 7×7 (~10 pieces); the settings size row wraps to a 2×2 grid so four 72 px buttons fit narrow phones. The hard board has been walked down twice for the age band — scoped 9×9, shipped 8×8, reduced to 7×7 on 2026-07-13 (still too hard) — each step meaning bigger cells and fewer pieces. Cells below the 60 px rule are acceptable here because cells are *drop* targets; the pieces (multi-cell, 80–240 px) are what fingers touch, and snapping is forgiving.
- **Pieces read as one solid shape with a perimeter outline**: `buildPieceEl()` computes borders, corner radii, insets and bevels per block *side* — edges shared with a sibling block get none (blocks merge), only the polyomino's outer perimeter gets the inset gap + darker `edge` color from the palette. This matters because placement is free: the player can put two same-colored pieces next to each other (the generator's no-adjacent-colors guarantee only covers the generated layout), and without the outline they'd blend into one blob.
- **One `--cell` CSS variable** (board width ÷ N, set from JS) sizes everything — board cells, piece divs, `.blk` squares, tray slots — via `calc()`, so a resize only updates the variable.
- **Drag**: Pointer Events + `setPointerCapture` on the piece element. While dragging, the piece switches to `position: fixed` **without reparenting** (reparenting mid-gesture can drop pointer capture). The piece is carried by its **grabbed point** (normalized 0..1 within the piece, so the tray's 0.5 scale maps to the same spot at full size), riding `CONFIG.liftPx` above the finger so the hand never hides it — mouse pointers get no lift. Pickup **eases** into the lifted pose over `CONFIG.liftMs` (`.lifting` class) instead of teleporting. The snap target is the nearest *fitting* cell within `CONFIG.snapRange` (in cells, searched over the 3×3 neighborhood of the rounded position, computed from the logical drag pose `drag.x/y`, not `getBoundingClientRect`), previewed by highlighting board cells (`.ghost`) — a near-miss beside an occupied region still lands.
- **Free placement**: a piece may land anywhere it fits (in-bounds, no overlap); win = board completely full, so alternative tilings count. A tap (or drag) on a placed piece lifts it back to the tray — dead ends are always recoverable. Invalid drops fly back to the tray with a gentle "hmm" (principles 3 & 10).
- **Tray slots never resize or disappear** — an empty slot is an invisible spacer, so the tray never reflows under the child's fingers (same idea as Memory's `.gone` cards). Fly-back animates fixed `left/top/transform` to the slot's rect (`.flying`), then reparents.
- **Keyboard parity** (principle 8): Enter/Space on a tray piece picks it up at the first fitting spot, arrows move it cell by cell, Enter places (shake + "hmm" if it doesn't fit), Escape cancels; Enter on a placed piece lifts it off.
- **No rotation in v1** — pieces arrive in their correct orientation, jigsaw-style (rotation is a possible later hard mode, see plan.md). No timer, no move counter (humane-first).
- Async timers (fly-back, celebrate) carry a `gameId` generation check so a 🔄 mid-animation can't touch the new board, same as Memory.

## Pending Work

See `plan.md` — it is the **single source of truth** for open bugs and features. This file intentionally does not duplicate its contents.

## Adding a New Game

1. Copy the PWA boilerplate from either existing game: `setupPWA()` **and** the sibling `sw.js`. Register the worker with a relative path (`navigator.serviceWorker.register('sw.js')`) — blob-/data-URL worker scripts are rejected by browsers. Give each game its own cache name. The workers are **stale-while-revalidate**: the cached version is served instantly (offline-first), the cache refreshes in the background, and the next visit gets the new version — so routine releases need **no** cache-name bump. Bump the name only as an emergency "everyone must get this immediately" lever.
2. Copy `playTone()` and audio helpers — don't use external audio files
3. No external fonts or CDNs — use the system font stack from the existing games
4. Follow all 10 design principles in `design_principles.txt`
5. Game lives in its own subdirectory as `index.html` (+ `sw.js`)
6. Add pending features to `plan.md`
