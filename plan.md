# LibreToybox — Planned Improvements

## Child Sudoku (`sudoku-for-minis/index.html`)
- **Feat: add an animated tutorial**.
- **Feat: bigger difficulty levels — 1–6 and 1–8** — beyond the current 4×4 (digits 1–4), add a 6×6 board (digits 1–6, 2×3 boxes) and an 8×8 board (digits 1–8, 2×4 boxes) as selectable difficulties in settings, following the same size-toggle pattern as Memory and Shape Fit.
- ~~**Selected cell highlight**~~ ✓ (2026-07-13, UI-coherence pass) — the lime dashed outline became a solid 4 px teal (`--c2`) outline plus a tinted `#E6FAF8` fill, distinct and on-palette.
- ~~**Win screen should keep puzzle visible**~~ ✓ (2026-07-13, UI-coherence pass) — copied Memory's pattern: translucent `rgba(255,255,255,0.55)` win overlay with bottom-anchored content; settings overlay keeps the opaque white.
- **Dialog semantics for overlays** (AUDIT B4): add `role="dialog" aria-modal="true"` to the settings and win overlays, matching Exquisite Corpse's settings overlay.
- ~~**Visible feedback when Reject mode clears illegal cells**~~ ✓ (AUDIT A11) — `removeIllegalCells()` now plays the swoosh sound and the same suction animation a manual clear uses, per cell, instead of silently zeroing the board.
- ~~**Keyboard access for grid cells**~~ ✓ (AUDIT A12) — non-given cells are tabbable (`tabIndex = 0`), a shared `activateCell(r, c)` drives both pointer taps and Enter/Space, and there's a `:focus-visible` outline distinct from the tap-selected one. `design_principles.txt` §8 wording fixed to say "keyboard, mouse, and touch."
- ~~**Dead code cleanup**~~ ✓ (AUDIT A16) — removed `tryClear()`, `bonkCell()`/`audioBonk()` (plus the now-orphaned `.cell.bonk`/`@keyframes bonk` they triggered), the `--eraser` CSS variable, `@keyframes shake`, `.hidden` class, and the `.emoji-row span:nth-child(4)` rule.
- ~~**Inconsistent interaction**~~ ✓ — the active number now resets after every placement; each piece requires picking a number again (no latent selection).

## Exquisite Corpse (`exquisite-corpse/index.html`)

- **Feat: add an animated tutorial**.
- **Remove the top icon/header to make more room for the canvas** — reclaim that vertical space for drawing. Which section the current player is on should instead be shown via grey horizontal zones at the very top and bottom of the canvas viewport, marking the strips that will be visible (as the peek guide) to the next player.
- **Long-press to end turn** — the "Done" control that advances to the next section/player should require a long press instead of a single tap, to guard against an accidental tap ending a turn early.
- ~~**Bug: winning reveal covered by the last drawing section**~~ ✓ (reported & fixed 2026-07-12) — after the final ✓, the bottom part of the painting remained on screen and covered the final revealed image: `#reveal-canvas` was transparent outside the letterboxed artwork, so the main `#drawing-canvas` — still translated to the legs section — showed through around the reveal. `reveal()` now fills the reveal canvas with opaque paper white before `drawImage()`, fully covering the drawing canvas. `sw.js` cache bumped to `fold-and-pass-v2` per the release rule.
- ~~**Enlarge toolbar controls to 64×64 px**~~ ✓ (2026-07-13, AUDIT A6) — swatches and brush/undo/clear buttons are now 64×64; `#color-row`/`#tool-row` gained `flex-wrap: wrap` so six 64 px swatches (~424 px) wrap to two rows on narrow phones instead of overflowing (the tall canvas is `flex: 1` and absorbs the extra row).
- ~~**Bug: in-progress stroke lost on resize**~~ ✓ (2026-07-13, AUDIT A18) — `redrawCanvas()` now draws `currentStroke` after the committed strokes, so a stroke in progress survives a rotation-triggered redraw.
- ~~**Bug: final screen is "squished"**~~ ✓ (AUDIT A7) — `reveal()` now renders the full artwork onto an offscreen buffer at its true (undistorted) aspect ratio, then letterbox-scales that buffer into the wrap-sized overlay instead of stretching x/y independently. `downloadPainting()` exports the undistorted buffer directly (`artworkCanvas`), so the saved PNG is no longer squished either.
- ~~**Canvas-mode change destroys the current drawing**~~ ✓ (AUDIT A11) — `setCanvasMode()` no longer calls `newGame()`; it resizes the canvas for the new aspect and redraws existing strokes (normalized coordinates already survive resize, the same mechanism the window-resize handler uses), so switching Tall/Wide preserves the drawing in progress.
- ~~**Full section hiding between players**~~ ✓ — canvas slides vertically; completed sections off-screen, `PEEK_PX: 40` strip visible as connection guide.
- ~~**Tall/Wide canvas setting**~~ ✓ — Settings ⚙️ radio: Tall (`flex:1`, portrait) for phones; Wide (`aspect-ratio: 4/3`) for tablets. Changing mode starts a new game.
- ~~**Download finished painting**~~ ✓ — 💾 button on win screen saves `fold-and-pass.png` via `canvas.toDataURL`.
- ~~**Rename "Combination Man"**~~ ✓ — renamed to **Fold and Pass** (2026-07-12): title, manifest `name`/`short_name`, download filename, and the `sw.js` cache name (bumped to `fold-and-pass-v1` per the release rule in CLAUDE.md) all updated.
- ~~**Win screen redesign**~~ ✓ — No confetti. Painting stays visible (reveal-canvas overlay, never resizes main canvas). Tools hidden with `visibility:hidden` (not `display:none`) so canvas position never jumps. Download + Replay replace the toolbar area.
- ~~**Section emojis**~~ ✓ — 🙂 head / 👕 body / 👖 legs. No player number labels.
- ~~**Automatic section transitions**~~ ✓ — No handoff pause screen. Slides to next section after 460 ms animation.

## Hub (`index.html`)

- **Offline capability** (UI review 2026-07-13): the hub is the only page without a manifest, theme-color, or service worker — offline players can open every installed game but not the front door that links them. Add the same PWA boilerplate the games use.

## All games

- **Instructions for installing as a PWA** — add player/parent-facing guidance (hub and/or each game) on how to install the app to a home screen, since there's currently no in-app hint that this is possible.
- **Back button on every game** — a control to return to the hub landing page from within any game, not just browser back.
- **"Reset board" button (long press)** — a way to reset the current game's board/puzzle without going through settings, guarded by a long press so it can't be triggered accidentally.
- ~~**UI / color coherence pass**~~ ✓ (2026-07-13) — one color system across the toybox (now design principle 11): Memory's saturated card-back gradient replaced with the shared purple pastel + darker edge (`#C3B4F7`/`#9480DC`); Sudoku's stray hot pink (`#FF69B4`) unified to its coral `--c1`; Fold and Pass's vivid `#7C4DFF` accent and Material greens softened to `#9480DC`/`#66BB6A`, and its dark settings overlay switched to the translucent white every other game uses; confetti everywhere draws from the shared palette; hub cards shrunk to a 2×2 grid with hover/focus states. Cache names bumped: `memory-v2`, `child-sudoku-v3`, `fold-and-pass-v3`.
- ~~**Service-worker update strategy**~~ ✓ (2026-07-13, AUDIT B1) — all four `sw.js` workers switched from cache-first to **stale-while-revalidate**: cached version served instantly (offline-first load unchanged), cache refreshed in the background, next visit gets the new version automatically. Routine releases no longer require a cache-name bump; the bump remains only as an emergency "everyone must get this now" lever (CLAUDE.md updated). Verified end-to-end with a persistent browser profile: change deployed → next load stale, following load current, offline load still works. No cache names were bumped — browsers byte-diff `sw.js` itself on navigation, so deployed players pick up the new worker automatically.
- ~~**Favicon**~~ ✓ (AUDIT B3) — all three pages (hub + both games) declare `<link rel="icon">` using an inline 🧸 emoji SVG data URI, matching the teddy bear already used as the hub's logo.
- ~~**Use or remove the `aria-live` status regions**~~ ✓ (AUDIT A17) — both games now announce meaningful state: Sudoku announces cell selection, placements, conflicts, and the win; Fold and Pass announces the current section (head/body/legs) and the final reveal.

## Repository / Infrastructure

- ~~**Feat: free CI/CD hosting**~~ ✓ — `.github/workflows/deploy-pages.yml` deploys the repo to **GitHub Pages** on every push to `main`, live at <https://khaal.github.io/LibreToybox/>. Zero external accounts, zero build step — the static tree is served as-is via `actions/upload-pages-artifact` + `actions/deploy-pages`. Repo was made public and Pages Source set to "GitHub Actions" on 2026-07-12; first deploy verified live.
- **Feat: mirror to Codeberg** — add a GitHub Action that syncs this repository to <https://codeberg.org/krash/LibreToybox> on every push to `main` (push mirror using a Codeberg access token stored as a GitHub Actions secret, e.g. `git push --mirror` from a scheduled/push-triggered workflow).
- **Lightweight CI** (AUDIT recommendation): `htmlhint`/`html-validate` over `*/index.html` + a link check; add a `.gitignore` before tooling arrives.

## Memory (`memory/index.html`)

- **Feat: add an animated tutorial**.
- ~~**Brighter card backs**~~ ✓ (2026-07-13) — card backs moved from the purple pastel to the canonical palette's brighter sky blue (`#8ED3F4`/`#54A6D2`), and the game's accent (theme-color, logo, manifest icon) followed into the blue family so the whole game sits in its ice-blue background hue (design principle 11). Cache bumped to `memory-v3`.
- ~~**Implement the game**~~ ✓ (2026-07-12) — pairs-matching game shipped per the Future Games scoping: face-down emoji cards, 3D flip, match chime / gentle mismatch flip-back (never blocks play — a third tap resolves the pair immediately), matched pairs fly off the board leaving their grid slot empty, 🐣 4×4 / 🦁 6×4 size setting with visible re-deal, translucent win overlay, no timer or move counter. Architecture notes in `CLAUDE.md`.

## Shape Fit (`shape-fit/index.html`)

- **Feat: add an animated tutorial**.
- ~~**5×5 intermediate board**~~ ✓ (reported & fixed 2026-07-13) — the jump from 🐣 4×4 (~4 pieces) to 🐥 6×6 (~8 pieces) was too steep and the hardest level too hard for the target age; added a 🐤 5×5 (`mini`, pieces 3–5, ~6 pieces) between them, so sizes are now 🐣 4×4 / 🐤 5×5 / 🐥 6×6 / 🦁 8×8. The size row wraps to a 2×2 grid (`max-width: 162px`) so four 72 px buttons fit narrow phones. Generator invariants re-verified for n=5 (4 000 boards: full tiling, connected pieces ≥ 3 cells, no adjacent same colors) plus a Playwright solve-to-win run.
- ~~**Bug: dragged piece lands off-screen after a size switch / re-deal**~~ ✓ (reported & fixed 2026-07-12) — the tray-slot deal animation (`animation-fill-mode: both`) left a permanent `transform: scale(1)` on every slot, and an ancestor with any transform becomes the containing block for `position: fixed`, so the dragged piece's viewport coordinates were interpreted relative to its tiny tray slot. Only animated deals were affected, which is why the initial (non-animated) 6×6 board worked and every size switch or 🔄 broke. Fixed by removing the `deal` class on `animationend` (plus on `pointerdown`, for pieces grabbed mid-pop); e2e test now drags for real after animated re-deals. `sw.js` cache bumped to `shape-fit-v3`.
- ~~**4×4 board + piece outlines**~~ ✓ (reported & fixed 2026-07-12) — added a 🐣 4×4 board (~4 pieces) for the youngest players (sizes now 🐣 4×4 / 🐥 6×6 / 🦁 8×8), and gave every piece a darker perimeter outline: blocks now merge into one solid shape inside a piece, with the outline/gap/bevel drawn only around the polyomino's outer edge. Fixes same-colored pieces blending together when placed side by side — free placement means the generator's no-adjacent-colors guarantee can't cover what the player builds.
- **Feat: rotation hard mode** — v1 deliberately ships without rotation (pieces arrive in their correct orientation, jigsaw-style). A later setting could deal pieces randomly rotated and let a tap on a held piece turn it 90°.
- ~~**Implement the game**~~ ✓ (2026-07-12) — no-timer "reverse Tetris" shipped per the scoping: randomized region-growing cuts the board into 3–6-cell polyomino pieces (solvable by construction; adjacent pieces never share a color), drag with `setPointerCapture` + lift-above-finger + ghost snap preview, free placement with tap-to-lift undo, keyboard parity (Enter/arrows/Escape), translucent win overlay + confetti, 🐣 6×6 / 🦁 8×8 size setting with visible re-deal. **The big board became 8×8 instead of the scoped 9×9** — bigger cells (~45 px vs 40 px) and ~14 rather than ~18 pieces suit the age band better. Verified with a 4 000-board generator invariant test and a Playwright end-to-end run (drag, invalid drop, lift-off, keyboard, solve-to-win, settings). Architecture notes in `CLAUDE.md`.

## Future Games

*(candidates discussed 2026-07-12: Four in a Row pass-and-play, pocket xylophone music toy, Simon-style Echo)*

## Later / not now

- **Android packaging (Capacitor APK)** — scoped on 2026-07-12 (one Capacitor 8 app wrapping the hub + all games, GitHub Actions build+sign+release on tag push). Deliberately shelved: focus is on the web app and PWA experience first. Revisit this scoping conversation if/when Android packaging becomes a priority again.
