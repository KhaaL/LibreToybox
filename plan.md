# LibreToybox — Planned Improvements

## Child Sudoku (`sudoku-for-minis/index.html`)
- **Feat: add an animated tutorial**.
- **Selected cell highlight**: The current selected-cell outline is too subtle. Make it more distinct — thicker border, stronger color contrast, or a filled background — so children can clearly see which cell is active.
- **Win screen should keep puzzle visible**: The confetti/win overlay currently covers the completed puzzle. The puzzle should remain visible beneath the celebration so players can see their finished work. Memory now establishes the pattern to copy: a translucent overlay (`rgba(255,255,255,0.55)`) with bottom-anchored content — see `#win-overlay` in `memory/index.html`.
- **Dialog semantics for overlays** (AUDIT B4): add `role="dialog" aria-modal="true"` to the settings and win overlays, matching Exquisite Corpse's settings overlay.
- ~~**Visible feedback when Reject mode clears illegal cells**~~ ✓ (AUDIT A11) — `removeIllegalCells()` now plays the swoosh sound and the same suction animation a manual clear uses, per cell, instead of silently zeroing the board.
- ~~**Keyboard access for grid cells**~~ ✓ (AUDIT A12) — non-given cells are tabbable (`tabIndex = 0`), a shared `activateCell(r, c)` drives both pointer taps and Enter/Space, and there's a `:focus-visible` outline distinct from the tap-selected one. `design_principles.txt` §8 wording fixed to say "keyboard, mouse, and touch."
- ~~**Dead code cleanup**~~ ✓ (AUDIT A16) — removed `tryClear()`, `bonkCell()`/`audioBonk()` (plus the now-orphaned `.cell.bonk`/`@keyframes bonk` they triggered), the `--eraser` CSS variable, `@keyframes shake`, `.hidden` class, and the `.emoji-row span:nth-child(4)` rule.
- ~~**Inconsistent interaction**~~ ✓ — the active number now resets after every placement; each piece requires picking a number again (no latent selection).

## Exquisite Corpse (`exquisite-corpse/index.html`)

- **Feat: add an animated tutorial**.
- ~~**Bug: winning reveal covered by the last drawing section**~~ ✓ (reported & fixed 2026-07-12) — after the final ✓, the bottom part of the painting remained on screen and covered the final revealed image: `#reveal-canvas` was transparent outside the letterboxed artwork, so the main `#drawing-canvas` — still translated to the legs section — showed through around the reveal. `reveal()` now fills the reveal canvas with opaque paper white before `drawImage()`, fully covering the drawing canvas. `sw.js` cache bumped to `fold-and-pass-v2` per the release rule.
- **Enlarge toolbar controls to 64×64 px** (AUDIT A6): color swatches are 48×48 and brush/undo/clear buttons 56×48, below the non-negotiable ≥64×64 tool-button rule (design principle 4).
- **Bug: in-progress stroke lost on resize** (AUDIT A18): `redrawCanvas()` draws committed strokes but not `currentStroke`, so a stroke being drawn during device rotation vanishes.
- ~~**Bug: final screen is "squished"**~~ ✓ (AUDIT A7) — `reveal()` now renders the full artwork onto an offscreen buffer at its true (undistorted) aspect ratio, then letterbox-scales that buffer into the wrap-sized overlay instead of stretching x/y independently. `downloadPainting()` exports the undistorted buffer directly (`artworkCanvas`), so the saved PNG is no longer squished either.
- ~~**Canvas-mode change destroys the current drawing**~~ ✓ (AUDIT A11) — `setCanvasMode()` no longer calls `newGame()`; it resizes the canvas for the new aspect and redraws existing strokes (normalized coordinates already survive resize, the same mechanism the window-resize handler uses), so switching Tall/Wide preserves the drawing in progress.
- ~~**Full section hiding between players**~~ ✓ — canvas slides vertically; completed sections off-screen, `PEEK_PX: 40` strip visible as connection guide.
- ~~**Tall/Wide canvas setting**~~ ✓ — Settings ⚙️ radio: Tall (`flex:1`, portrait) for phones; Wide (`aspect-ratio: 4/3`) for tablets. Changing mode starts a new game.
- ~~**Download finished painting**~~ ✓ — 💾 button on win screen saves `fold-and-pass.png` via `canvas.toDataURL`.
- ~~**Rename "Combination Man"**~~ ✓ — renamed to **Fold and Pass** (2026-07-12): title, manifest `name`/`short_name`, download filename, and the `sw.js` cache name (bumped to `fold-and-pass-v1` per the release rule in CLAUDE.md) all updated.
- ~~**Win screen redesign**~~ ✓ — No confetti. Painting stays visible (reveal-canvas overlay, never resizes main canvas). Tools hidden with `visibility:hidden` (not `display:none`) so canvas position never jumps. Download + Replay replace the toolbar area.
- ~~**Section emojis**~~ ✓ — 🙂 head / 👕 body / 👖 legs. No player number labels.
- ~~**Automatic section transitions**~~ ✓ — No handoff pause screen. Slides to next section after 460 ms animation.

## All games

- **Service-worker update strategy** (AUDIT B1): the cache-first `sw.js` with a fixed cache name (now ×3 with `memory-v1`) means returning players never receive deployed updates until the cache name is bumped. Decide: network-first for navigations (fall back to cache offline), or enforce "bump the cache name in every release" as a hard rule in CLAUDE.md.
- ~~**Favicon**~~ ✓ (AUDIT B3) — all three pages (hub + both games) declare `<link rel="icon">` using an inline 🧸 emoji SVG data URI, matching the teddy bear already used as the hub's logo.
- ~~**Use or remove the `aria-live` status regions**~~ ✓ (AUDIT A17) — both games now announce meaningful state: Sudoku announces cell selection, placements, conflicts, and the win; Fold and Pass announces the current section (head/body/legs) and the final reveal.

## Repository / Infrastructure

- ~~**Feat: free CI/CD hosting**~~ ✓ — `.github/workflows/deploy-pages.yml` deploys the repo to **GitHub Pages** on every push to `main`, live at <https://khaal.github.io/LibreToybox/>. Zero external accounts, zero build step — the static tree is served as-is via `actions/upload-pages-artifact` + `actions/deploy-pages`. Repo was made public and Pages Source set to "GitHub Actions" on 2026-07-12; first deploy verified live.
- **Feat: mirror to Codeberg** — add a GitHub Action that syncs this repository to <https://codeberg.org/krash/LibreToybox> on every push to `main` (push mirror using a Codeberg access token stored as a GitHub Actions secret, e.g. `git push --mirror` from a scheduled/push-triggered workflow).
- **Lightweight CI** (AUDIT recommendation): `htmlhint`/`html-validate` over `*/index.html` + a link check; add a `.gitignore` before tooling arrives.

## Memory (`memory/index.html`)

- **Feat: add an animated tutorial**.
- ~~**Implement the game**~~ ✓ (2026-07-12) — pairs-matching game shipped per the Future Games scoping: face-down emoji cards, 3D flip, match chime / gentle mismatch flip-back (never blocks play — a third tap resolves the pair immediately), matched pairs fly off the board leaving their grid slot empty, 🐣 4×4 / 🦁 6×4 size setting with visible re-deal, translucent win overlay, no timer or move counter. Architecture notes in `CLAUDE.md`.

## Future Games

*(empty — next candidates discussed 2026-07-12: Shape Fit / tangram-lite, Four in a Row pass-and-play, pocket xylophone music toy, Simon-style Echo)*

## Later / not now

- **Android packaging (Capacitor APK)** — scoped on 2026-07-12 (one Capacitor 8 app wrapping the hub + all games, GitHub Actions build+sign+release on tag push). Deliberately shelved: focus is on the web app and PWA experience first. Revisit this scoping conversation if/when Android packaging becomes a priority again.
