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
│   ├── index.html            — Shape Fit (grid-packing puzzle, 4×4 / 5×5 / 6×6 board)
│   └── sw.js                 — offline cache worker
├── emoji-paint/
│   ├── index.html            — Emoji Paint (free-play canvas, stamp with any emoji from a full browsable set)
│   └── sw.js                 — offline cache worker
├── odd-one-out/
│   ├── index.html            — Odd One Out (tap the item that doesn't belong; hidden-rule spotting, 4/6/9 tiles)
│   └── sw.js                 — offline cache worker
├── .github/workflows/
│   ├── deploy-pages.yml      — auto-deploy to GitHub Pages on push to main
│   └── ci.yml                — lint (html-validate) + local link check on push/PR
├── scripts/
│   └── check-links.js        — dependency-free checker: local href/src targets must exist on disk
├── index.html                — game hub / landing page (links to all games)
├── design_principles.txt     — authoritative design rules (read before any change)
├── plan.md                   — pending work (single source of truth)
├── done.md                   — completed items, moved out of plan.md
├── AUDIT.md                  — repository audit (2026-07-12 snapshot)
├── package.json               — dev-only CI tooling (html-validate); the games ship with zero dependencies
├── .htmlvalidate.json        — html-validate config, tuned to this codebase's conventions
├── README.md
├── LICENSE                   — GNU GPL v3.0
└── CLAUDE.md                 — this file
```

**Naming:** the project/repository name is **LibreToybox**. The drawing game's working name in these docs is *Exquisite Corpse*; its player-facing title is **Fold and Pass** (renamed 2026-07-12 from "Combination Man" for a gender-neutral, theme-fitting title — exquisite corpse is traditionally played by folding paper and passing it along).

## Tech Stack

- Vanilla HTML5 / CSS3 / JavaScript — no frameworks, no build tools
- HTML5 Canvas API for drawing (exquisite-corpse)
- Web Audio API for procedural sound (all games)
- PWA: the **whole toybox is one installable app** — a single shared `manifest.webmanifest` at the repo root (linked by every page) and **one** root-scoped `sw.js` (registered only over http/https — browsers reject blob-URL workers; **stale-while-revalidate**, so deployed updates reach players one visit later with no cache-name bump). Installing "LibreToybox" from any page installs the one app; its `sw.js` precaches the hub **and every game** (each game is a single self-contained `index.html`) so the whole site is available offline after one visit. The web platform installs one app per gesture — there is no way to spawn a separate icon per game, so games are pages inside the one app, not separately-installable apps.
- Zero external dependencies — system font stack, procedural audio, inline SVG icons
- Hosting: GitHub Pages, deployed automatically by `.github/workflows/deploy-pages.yml` on every push to `main` — no external hosting account, no build step, the whole repo is served as-is
- CI (dev-only, not shipped): `.github/workflows/ci.yml` runs on every push/PR — `npm run lint:html` (html-validate over `index.html` + `*/index.html`, config in `.htmlvalidate.json`) and `npm run check:links` (`scripts/check-links.js`, a dependency-free script that verifies every local `href`/`src` resolves to a real file; external/`data:`/fragment links are deliberately skipped — see the script's header comment). `package.json` exists purely for this tooling; the games themselves still ship with zero runtime dependencies. Adding a new game as `<dir>/index.html` picks up both checks automatically via the glob.

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
- `#canvas-wrap` is the visible viewport (the "paper"); `overflow: hidden`. It's wrapped in `#canvas-area` (`flex:1`, centres the paper) which fills the leftover vertical space; `main`'s old `max-width: 480px` cap is gone (toolbar/`#done-btn`/`#win-actions` are capped at 560 px instead so the six swatches stay grouped on wide screens)
- `#drawing-canvas` is `sections × wrapHeight` tall — all sections in one canvas
- Canvas slides via CSS `translateY` to show the current section
- `PEEK_PX: 40` — pixels of previous section visible at top as connection guide
- Two canvas modes, both sized to the largest **A4** rectangle that fits `#canvas-area` so the paper grows to use a tablet's screen without distorting: **Tall** (A4 portrait, the default) and **Wide** (A4 landscape). `computeCanvasSize()` does the fit (fit width, else fall back to height); `syncCanvasSize()` applies it to `#canvas-wrap` (explicit px) and the backing canvas (`h × sections`). The mode only changes the ratio — no `mode-*` CSS classes, no `applyCanvasMode()`. The resize handler skips work unless `computeCanvasSize().w` changed, since re-assigning `canvas.width` clears the canvas
- No `<header>` — the top row was reclaimed for the canvas. `#phase-banner` (the row above `#canvas-wrap`) holds the 🏠 Back link (flush-left, no logo alongside it here) plus a `.top-btns` cluster with New Game and Settings (flush-right); which section is active is no longer shown as an emoji there — it's conveyed by the grey peek zones on the canvas itself (see below) plus the `#status` `aria-live` announcement for screen readers
- Grey peek zones mark both ends of `#canvas-wrap`: `#peek-overlay` (top) tints the previous section's tail, not drawable; `#next-peek-overlay` (bottom, new) tints this section's own tail — the sliver that becomes the *next* player's top peek once Done is tapped. `updateNextPeek()` shows/hides it based on whether a next section exists (hidden on the last section — no next player to peek for)

### Toolbar
- All controls are ≥64×64 px (design principle 4); `#color-row` and `#tool-row` are `flex-wrap: wrap`, so the six swatches (~424 px in one line) wrap to two rows on narrow phones and the `#canvas-area` (`flex: 1`) absorbs the extra row — never shrink the controls below 64 px to avoid the wrap
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
- **Box regions read at a glance via a wider gutter + a bolder line**, not just a thin border — `.cell.box-l`/`.cell.box-t` (the same per-cell classes already used for the box-boundary border, set once in `buildGrid()` since geometry never changes mid-game) add `margin-left`/`margin-top: 7px` alongside a thicker, darker `5px` border. Spacing/border only — no cell's fill color ever changes to convey grouping (unlike a checkerboard tint, which was tried and rejected for touching the cells themselves)
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
- `revealBoard()` brings every flown-away `.gone` card back face-up (staggered like the initial deal) right before the overlay shows, so the win screen displays the completed set of pairs instead of an empty board. The bounce (`.matched-pop`) animates the outer `.card`, not `.card-inner` — `.card-inner` already owns the `rotateY` flip transform, and animating `transform` on the same element via a second rule would override the flip for the animation's duration (this was a latent bug in the brief in-game match bounce too, just imperceptible until the reveal made it obvious)
- Settings ⚙️ has exactly one control: board size (🐣 4×4 / 🦁 6×4). Choosing a size closes the overlay first, then re-deals **visibly** (suction-out + staggered pop-in + swoosh) — never a silent reset (design principle 9)

## Shape Fit — Architecture Notes

`shape-fit/index.html` — no-timer grid-packing puzzle ("reverse Tetris"): the board is cut into polyomino pieces (box, L, S, T…) that the child drags back to fill the whole grid. All tuning lives in the `CONFIG` object at the top of the script.

- **Generate the solution first**: randomized region-growing partitions the N×N board into connected pieces (3–6 cell targets; undersized leftovers are merged into an adjacent piece), so a solution exists by construction. Greedy coloring over the piece-adjacency graph (palette order shuffled per game) guarantees touching pieces never share a color.
- **Board sizes** (the one settings toggle): 🐣 4×4 (~4 pieces, for the youngest) / 🐤 5×5 (~6 pieces, **the default**) / 🐥 6×6 (~8 pieces); the settings size row is a single row of three 72 px buttons. The hardest tier (🦁 7×7) was walked down twice for the age band — scoped 9×9, shipped 8×8, reduced to 7×7 on 2026-07-13 — and was still found too hard, so it was removed outright on 2026-07-17 rather than eased again. Cells below the 60 px rule are acceptable here because cells are *drop* targets; the pieces (multi-cell, 80–240 px) are what fingers touch, and snapping is forgiving.
- **Pieces read as one solid shape with a perimeter outline**: `buildPieceEl()` computes borders, corner radii, insets and bevels per block *side* — edges shared with a sibling block get none (blocks merge), only the polyomino's outer perimeter gets the inset gap + darker `edge` color from the palette. This matters because placement is free: the player can put two same-colored pieces next to each other (the generator's no-adjacent-colors guarantee only covers the generated layout), and without the outline they'd blend into one blob.
- **One `--cell` CSS variable** (board width ÷ N, set from JS) sizes everything — board cells, piece divs, `.blk` squares, tray slots — via `calc()`, so a resize only updates the variable.
- **Drag**: Pointer Events + `setPointerCapture` on the piece element. While dragging, the piece switches to `position: fixed` **without reparenting** (reparenting mid-gesture can drop pointer capture). The piece is carried by its **grabbed point** (normalized 0..1 within the piece, so the tray's 0.5 scale maps to the same spot at full size), riding `CONFIG.liftPx` above the finger so the hand never hides it — mouse pointers get no lift. Pickup **eases** into the lifted pose over `CONFIG.liftMs` (`.lifting` class) instead of teleporting. The snap target is the nearest *fitting* cell within `CONFIG.snapRange` (in cells, searched over the 3×3 neighborhood of the rounded position, computed from the logical drag pose `drag.x/y`, not `getBoundingClientRect`), previewed by highlighting board cells (`.ghost`) — a near-miss beside an occupied region still lands.
- **Free placement**: a piece may land anywhere it fits (in-bounds, no overlap); win = board completely full, so alternative tilings count. A tap (or drag) on a placed piece lifts it back to the tray — dead ends are always recoverable. Invalid drops fly back to the tray with a gentle "hmm" (principles 3 & 10).
- **Tray slots never resize or disappear** — an empty slot is an invisible spacer, so the tray never reflows under the child's fingers (same idea as Memory's `.gone` cards). Fly-back animates fixed `left/top/transform` to the slot's rect (`.flying`), then reparents.
- **Keyboard parity** (principle 8): Enter/Space on a tray piece picks it up at the first fitting spot, arrows move it cell by cell, Enter places (shake + "hmm" if it doesn't fit), Escape cancels; Enter on a placed piece lifts it off.
- **No rotation in v1** — pieces arrive in their correct orientation, jigsaw-style (rotation is a possible later hard mode, see plan.md). No timer, no move counter (humane-first).
- Async timers (fly-back, celebrate) carry a `gameId` generation check so a 🔄 mid-animation can't touch the new board, same as Memory.

## Emoji Paint — Architecture Notes

`emoji-paint/index.html` — a free-play painting canvas with no win state; shares its canvas/stroke architecture with Exquisite Corpse but strips out everything about sections and passing the device between players.

- **Shares with Exquisite Corpse**: normalized 0..1 stroke/stamp coordinates (resize-safe), the PWA `setupPWA()` boilerplate, and `playTone()`/`audioSwoosh()` audio helpers. **Does not share**: sections, `currentSection`, peek overlays, fold guides, the automatic section-advance flow, the reveal/letterbox win screen, or the Tall/Wide canvas-mode toggle — there's only one canvas, always fully visible, and no "done."
- **The canvas always fills the viewport edge-to-edge**, in any rotation, on phone or tablet: `header`/`main` have no `max-width` cap and `#canvas-wrap` is unconditionally `flex:1; width:100%`. There is **no Tall/Wide toggle** here (it's meaningless when the canvas always fills) — and since that toggle was the settings overlay's only control, Emoji Paint has **no settings overlay and no ⚙️ button** at all; the header is just 🏠 + logo (left) and 🔄 New Painting (right). `syncCanvasSize()` reads `#canvas-wrap`'s client size and matches the backing canvas to it.
- **Color + brush size are replaced by an emoji stamp picker** (design ask: "replace colors and pen size with a menu of different emoji"). `#stamp-btn` shows the currently selected emoji at 64×64 px and opens `#picker-overlay`, a scrollable grid (`EMOJI_CATEGORIES`, ~320 emoji across 8 categories — faces, animals, food, nature, activities, travel, objects, hearts/symbols) the child can sift through; tapping one selects it, marks it `.active` next time the picker reopens, and auto-closes the overlay. Stamp size is fixed (`STAMP_SIZE: 56`) — there is no separate brush-size control.
- **Picker navigation aids** (added after the ~320-emoji list proved overwhelming to scroll through cold): a horizontally-scrolling `#picker-nav` row of jump chips — one per category plus a 🕒 Recent chip — sits above the grid. Tapping a chip `scrollIntoView`s straight to that section; an `IntersectionObserver` (`sectionObserver`) runs the reverse direction, highlighting whichever chip's section currently sits at the top of the scroll area as the child scrolls by hand. Because a short section (e.g. Recent with just one or two stamps) can intersect the observer's trigger zone at the same time as the section right after it, the observer doesn't trust whichever entry fires last in a batch — it tracks every currently-intersecting `navKey` in `visibleSections` and always highlights the one earliest in DOM order, the same "topmost visible section" rule `openPicker()` uses to set the initial chip on open. The Recent chip and section both start hidden (`.hidden`/`.empty`) — an empty "Recent" is just confusing — and reveal themselves the first time `addToRecents()` runs.
- **Recent stamps** (`recents`, capped at `RECENTS_MAX: 8`, newest first, deduped): every `selectStamp()` call re-files the picked emoji to the front of the list via `addToRecents()`, which also rebuilds the Recent section's buttons and toggles its section/chip visibility. Recents are in-memory only (like the rest of the game's state) — no `localStorage`, so they reset on reload along with everything else. The Recent row is intentionally a single scrollable line (`.recent-grid`: `flex-wrap: nowrap; overflow-x: auto`), not a wrapping grid like the categories — it's a quick-access strip, not something to browse.
- **Picker always opens scrolled to the top** (`openPicker()` resets `pickerScroll.scrollTop`, but only *after* adding the `.show` class — a `display:none` element has no scrollbox, so setting `scrollTop` first is a silent no-op). With jump chips available for fast travel to any section, a predictable starting point beats trying to remember the child's last scroll position.
- **Category sections have no text label** — just a discreet `.picker-divider` line above each grid. The nav chips already carry each category's identity (via its leading emoji), and the stamps themselves are self-evident without needing to be read, so a text heading was redundant chrome (principle 1, visual-first).
- **Removal is long-press-to-lift-and-drag, plus a tap-to-arm trash shortcut** — two paths to the same `deleteStamp()`. (1) Press and hold an existing stamp past `LIFT_MS` (350 ms) and it lifts — riding slightly enlarged with a soft drop shadow (`redrawLifted()`), following the finger. Drop it on `#trash-btn` to delete it (`hoverTrash`, detected via real `getBoundingClientRect()`/`clientX`/`clientY` comparison in `updateTrashHover()`, since the button lives outside the canvas); drop it anywhere else on the canvas and it's simply repositioned there (`stamp.x/y` updated in place) — no separate "move" mode, lifting always can end in either outcome. (2) Tap `#trash-btn` to arm `trashArmed` (reddish highlight, `border-color: #E53935`, distinct from the game's normal pink `.active` accent); every subsequent tap on an existing stamp deletes it — the mode is a persistent toggle, not one-shot, so it stays armed (and red) across any number of deletions. A tap on empty canvas while armed is a no-op (stays armed) rather than placing a stamp, so the tool reads as "only deletes" while active. Delete mode turns off only when the child taps `#trash-btn` again or taps the emoji-selector button to open the picker (`openPicker()` disarms it).
- **One gesture recognizer covers both tap-when-armed and lift-to-drag** — `onPointerDown` hit-testing an existing stamp always starts `lifting` (tracking elapsed hold time and live pointer position, never cancelling on movement — a stamp can drift before the hold completes without aborting it). `onPointerUp` then branches on whether `lifting.lifted` ever became true: if not, it was a quick tap (delete-if-armed, else no-op); if so, it was a genuine lift (delete-if-over-trash, else reposition). This is a deliberate departure from the earlier design (Sudoku's exact `.press-progress` conic-gradient hold-to-delete, and a separate eraser tool) — user feedback wanted repositioning as a capability and a persistent removal mode that couldn't stay silently armed, so the hold now means "pick this up," never "start deleting," and the reddish pre-removal countdown was dropped in favor of a neutral accent-colored "picking up" halo (`tickLiftTimer()`) since holding no longer risks destroying anything by itself.
- **`erasingStamps`** (a `Set`) tracks stamps mid-removal-animation so `findStampAt()` treats them as already gone — without it, a finger lingering during the 220 ms shrink-and-fade could re-trigger removal on the same stamp mid-flight. `deleteStamp()` adds to this set before calling the shared `animateRemoval()`, which removes the entry once the stamp is actually spliced out of `stamps`.
- **Placement is tap-to-place, not a continuous brush trail**: `onPointerDown` starts carrying a stamp (`this.placing`) at the pointer location without committing it; `onPointerMove` lets the child drag it to adjust the spot (drawn translucent via `drawStamp(..., 0.55)` so it reads as "not landed yet"); `onPointerUp`/`pointercancel` commits it into the permanent `stamps` array at its final position and plays `audioStamp()`. A quick tap and a drag-then-release both go through the same path — the only difference is how far `placing` moves before commit.
- **Stamps render via `ctx.fillText`**, not `ctx.strokeStyle` — `drawStamp()` sets `ctx.font` to the stamp size with an emoji-font fallback stack (`"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`) and centers on the point (`textAlign`/`textBaseline: middle`). This is the one place in the codebase that draws emoji onto a `<canvas>` rather than as DOM text.
- **No sections means no reveal step**: `downloadPainting()` exports the live drawing canvas directly (`canvas.toDataURL`), unlike Exquisite Corpse's separate undistorted `artworkCanvas` buffer — there's nothing to letterbox or stitch here.
- **Header follows the standard convention** (logo + 🏠 back link left, 🔄 New Painting right — no ⚙️ Settings, since the canvas always fills and there's nothing left to configure) rather than Exquisite Corpse's headerless `#phase-banner` — Emoji Paint has no per-section state to convey, so it doesn't need the reclaimed banner row.
- **No separate Clear button** — New Painting (header 🔄) already resets the whole board, so a toolbar Clear button was redundant and was removed; the toolbar is just Stamp, Trash (🗑️), Save.
- **Share links (wire v2) — compressed + aspect-ratio-preserving.** `encodeBoard()`/`decodeBoard()` bit-pack the board into the URL **hash** (never networked — see the format comment). A version byte leads; `decodeBoard()` branches on it and still reads **v1** links (flat 12-bit index + 12-bit x/y per stamp, no header), so nothing already shared breaks. **v2 compression**: coordinates are 10-bit (`COORD_MAX` 1023 — ≤~1px on the largest child canvas, invisible for a 56px emoji), and each stamp carries a leading 1-bit "same emoji as previous" flag that omits the 12-bit index across a repeated run (children stamp the same emoji a lot). Decode stops when fewer than one repeat-stamp's worth of bits remain, so the trailing byte-padding zeros never fabricate a phantom stamp. **v2 aspect ratio**: a header after the version byte stores the source canvas's aspect ratio (`AR_SCALE` fixed-point w/h) and the stamp size as a fraction of the shorter canvas side (`FRAC_MAX`). On open these set `this.artworkAR`/`this.artworkStampFrac`; while non-null, `frameRect()` returns a contain-fit letterbox of that aspect ratio inside the current canvas (drawn as a soft-tinted margin + white "paper" via `drawPaperFrame()`), `stampPx()` scales stamps to that frame, and `toCanvasX/Y`/`getCanvasPoint()` map through it (a tap in the margin clamps onto the paper). So a tablet painting shows small-and-centered on a phone, undistorted — the recipient pinch-zooms (the viewport permits user scaling) or taps Edit, which **keeps** the frame so what they see is what they edit and a re-share preserves the AR. A fresh painting leaves `artworkAR` null → `frameRect()` is the full canvas and everything behaves exactly as before. `newGame()` resets both frame fields; `shareBoard()` re-uses a loaded board's frame when re-sharing, else measures this canvas. Decoding is fully defensive — malformed/truncated/tampered payloads return a blank board.

## Odd One Out — Architecture Notes

`odd-one-out/index.html` — a spot-the-difference puzzle: a grid of items where one doesn't belong, and the child taps it. The "rule" is what the *other* items share (all animals, all fruit, …); figuring that out is the puzzle. All tuning lives in the `CONFIG` object at the top of the script.

- **Uniform tiles on purpose**: every tile has the same neutral white background — the emoji's *category* must be the only variable the child compares. If tiles were different pastel colors, a child could reasonably think color is the rule; keeping them identical means the answer is always about what the emoji *is*.
- **Self-verifying round generator**: `generateRound()` picks a majority group and draws `tiles-1` distinct emoji from it, then draws exactly one "odd" emoji from a **disjoint** other group. Because the groups never share members, there's always exactly one out-of-group tile → one unambiguous answer, by construction (no post-hoc validation needed). `this.oddIndex` records its shuffled position.
- **Two data tiers**: `GROUPS` are mutually-disjoint super-categories (animals, food, vehicles, nature, faces, sports), each ≥8 members so any can be the majority even on the 9-tile board. `SUBGROUPS` are sibling sub-categories under a shared parent (animals→land/sea/birds/bugs, food→fruit/veg/sweets, vehicles→road/air/water) for the subtle tier — the odd one shares the parent but breaks the finer rule (a land animal among sea animals), so the rule is genuinely "hidden."
- **Difficulty is the one setting** (size radio, 🐣/🐤/🐥/🦁, same pattern as Memory/Shape Fit/Sudoku): 🐣 4 tiles (2×2) / 🐤 6 tiles (2×3, **the default**) / 🐥 9 tiles (3×3) / 🦁 9 tiles (3×3) **with `subtle: true`** — sibling sub-categories. Subtle mode is bound to the hardest tier rather than a separate toggle, keeping settings simple (principle 9). All four tiers live in `CONFIG.sizes` keyed by the `data-size` strings.
- **Progression = sets of rounds → a party**: `CONFIG.roundsPerSet` (5) correct rounds fill a row of `#pips` (visual dots, no numbers — principle 1); a full set triggers the shared `celebrate()` (confetti + poke-to-wiggle emoji row + `audioWin`), then 🔄 (header or win overlay) starts a fresh set. This gives the same completion-party arc the other games have, for a game that would otherwise be endless.
- **Feedback** (principle 3, humane-first): a correct tap pops the tile, fades the rest (`#board.resolved`), fills a pip, and advances after `CONFIG.advanceMs`; a wrong tap plays the gentle `audioOops()` "hmm" (240 Hz sine — **never** Sudoku's harsh buzz, since guessing is expected gameplay here, not a rule violation) and gives the tapped tile the suite's shared "wrong" cue — a shake plus a red flash (`wrongFlash`: border/background briefly go `#E53935`/`#FFCDD2`, matching Sudoku's `.conflict`, then settle straight back to neutral) plus a short `navigator.vibrate(60)` — with no penalty and no advance, so the child just tries again. The two `.tile.wrong` animations (`shake`, `wrongFlash`) are re-triggered on each wrong tap via the `remove`/reflow/`add` trick.
- **`.deal`, `.correct` and `.wrong` all share the same CSS specificity** (two classes each), so a two-part fix keeps the shake/flash (and celebrate `pop`) reliably playing on a tile that's still mid-deal when tapped: (1) source order — `.tile.deal` is declared *before* `.tile.correct`/`.tile.wrong` in the stylesheet, so whichever of those gets added always wins the property tie immediately, even mid pop-in, instead of `.deal`'s `animation` shorthand silently winning by being later; (2) belt-and-braces, `renderBoard()` also strips `.deal` via a one-shot `animationend` listener once the pop-in actually finishes, so it doesn't linger on the tile for the rest of the round. Getting the source order wrong here (e.g. re-adding `.deal` after `.correct`/`.wrong` for some future tweak) would silently reintroduce the bug where wrong/correct taps stop animating.
- **`rejecting` locks input for `CONFIG.wrongHoldMs`** (500ms, matching `wrongFlash`'s duration) after a wrong tap — mirrors `resolving`'s pause-and-block pattern for a correct pick, but for the reject cue: `pickTile()` bails early while either flag is set, so rapid repeat-tapping can't interrupt the shake/flash or sneak a pick (right or wrong) in while it's still playing. Cleared via the same `gameId`-guarded `setTimeout` pattern as the correct-pick advance, and reset in `newGame()`.
- **Win-screen "odd ones" recap** (`oddsFound`, `revealOddsOnBoard()`): every correct pick appends `this.tiles[this.oddIndex]` to `oddsFound` (reset in `newGame()` alongside `solved`); `celebrate()` repopulates the real `#board` with those emoji — same `.tile` look, same per-difficulty column count already set by the last `renderBoard()` call — rather than a separate recap strip below the celebration, so the "answers" land where the game was actually played. Tiles pop in staggered, mirroring the initial deal (same `.deal`/`animationend` mechanics `renderBoard()` uses) and mirroring how Memory's `revealBoard()` restages its own board for its win screen. They're plain non-interactive `<div>`s (a `.recap` modifier just drops the pointer cursor) — the board's delegated click handler still matches `.tile`, but `pickTile()`'s `this.won` guard makes any stray tap a no-op. `#board`'s `aria-label` swaps to "The odd ones you found" for the reveal and back to the game prompt at the top of every `renderBoard()` call.
- **Tiles are real `<button>`s** with a single delegated `click` handler (covers mouse/touch/pen **and** Enter/Space — keyboard parity, principle 8; `:focus-visible` outline), same approach as Memory's cards.
- **`gameId` generation guard**: incremented in `newGame()`; the post-correct advance `setTimeout` and the `rejecting`-clearing `setTimeout` both capture `gen` and bail if it changed, so a mid-pause 🔄 or size switch can't advance/celebrate onto a freshly dealt board or leave input stuck locked (same pattern as Memory/Shape Fit).
- Shares the standard scaffolding with the other games: header (🏠 back + logo / 🔄 + ⚙️), settings/win overlays, `playTone()`/`audioSwoosh()`/`audioWin()`/`audioEmoji()` audio kit, and the shared-PWA `setupPWA()` snippet (links the root `manifest.webmanifest`, registers the root `sw.js` — no per-game worker). Color identity is the sunny yellow/gold background family.

## Hub — Architecture Notes

`index.html` — the game hub/landing page. Plain static markup, no game object and no `init()` (unlike every other page in the repo).

- **The whole toybox is one PWA, anchored here.** The single shared `manifest.webmanifest` at the repo root defines the one installable app (`name: "LibreToybox"`, `id`/`start_url`/`scope` all `/`, 🪁-on-cream icons); every page — hub and games — links it (`href="manifest.webmanifest"` from the hub, `../manifest.webmanifest` from games, both resolving to the same file so all installs are the same app). The single root `sw.js` (scope `/`) precaches the hub plus every game's `index.html`, so installing/visiting the hub makes the entire site offline. Installing from any page installs the one app; there is no per-game manifest or per-game worker.
- **The hub has no game object/`init()`**, so its worker registration is a small inline `<script>` before `</body>` (register `sw.js` + the same old-worker cleanup every game runs), not a `setupPWA()` method. Its `<meta name="theme-color" content="#9480DC">` reuses the hub's own hover/focus accent.
- **Returning-user migration**: every page's registration snippet, after registering the root worker, unregisters any registration strictly under the root scope — this drops the old per-directory workers from before unification (a returning player who had `memory/sw.js` registered) so the one root worker cleanly takes over (it derives the root scope from the registration, so it's deploy-path-agnostic).
- `scripts/check-design.js` enforces this: every page must link `...manifest.webmanifest` and set a theme-color, and the root `sw.js` must exist (checked once, not per directory).

## Pending Work

See `plan.md` — it is the **single source of truth** for open bugs and features. This file intentionally does not duplicate its contents.

## Adding a New Game

1. Join the single unified PWA — **do not** add a per-game `sw.js` or a per-game manifest. In `<head>`, link the shared manifest and set the game's own theme-color: `<link rel="manifest" href="../manifest.webmanifest" />` + `<meta name="theme-color" content="#yourhue" />` (the meta tints browser chrome per page; the installed app's color comes from the shared manifest). Copy the standard `setupPWA()` snippet from any game (registers the root worker via `navigator.serviceWorker.register('../sw.js')` over http/https only — blob-/data-URL worker scripts are rejected — plus the one-time cleanup that unregisters any older narrower-scoped worker) and call it from `init()`. Then add the new game's two paths (`'yourgame/', 'yourgame/index.html'`) to the precache array in the **root `sw.js`** — that array is the single source of truth for the offline bundle. The worker is **stale-while-revalidate**: cached version served instantly, refreshed in the background, next visit gets the new version — routine releases need **no** cache-name bump; bump `CACHE` in the root `sw.js` only as an emergency "everyone must get this immediately" lever.
2. Copy `playTone()` and audio helpers — don't use external audio files
3. No external fonts or CDNs — use the system font stack from the existing games
4. Follow all 11 design principles in `design_principles.txt`
5. Game lives in its own subdirectory as `index.html` (no per-game `sw.js`)
6. Every game's header carries a 🏠 **Back** link to the hub as the first, flush-left element — `<a class="top-btn" id="back-btn" href="../index.html" aria-label="Back to LibreToybox home">🏠</a>`, grouped with the logo inside a `.header-left` wrapper (`header { justify-content: space-between }` then has exactly two flex children: `.header-left` on the left, `.top-btns` — New Game + Settings — on the right). Exquisite Corpse has no logo (see its architecture notes below), so its `#phase-banner` puts the Back link alone on the left instead. Keep this placement identical across every game — same corner, same icon, same target.
7. Add pending features to `plan.md`
