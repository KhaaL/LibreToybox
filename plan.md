# LibreToybox — Planned Improvements

## Child Sudoku (`sudoku-for-minis/index.html`)
- **Feat: add an animated tutorial**.
- **Selected cell highlight**: The current selected-cell outline is too subtle. Make it more distinct — thicker border, stronger color contrast, or a filled background — so children can clearly see which cell is active.
- **Win screen should keep puzzle visible**: The confetti/win overlay currently covers the completed puzzle. The puzzle should remain visible beneath the celebration so players can see their finished work.
- **Visible feedback when Reject mode clears illegal cells** (AUDIT A11): switching Keep → Reject removes conflicting numbers instantly with no animation or sound; design principle 9 says "do so visibly" (e.g. suction animation + swoosh per cleared cell).
- **Keyboard access for grid cells** (AUDIT A12): cells are `<div>`s with no `tabindex`/key handlers, so the board can't be played by keyboard. Also fix design principle 8's wording (title says keyboard, body says mouse).
- **Dialog semantics for overlays** (AUDIT B4): add `role="dialog" aria-modal="true"` to the settings and win overlays, matching Exquisite Corpse's settings overlay.
- **Dead code cleanup** (AUDIT A16): remove unused `tryClear()`, `bonkCell()`/`audioBonk()`, `--eraser` CSS variable, `@keyframes shake`, `.hidden` class, and the `.emoji-row span:nth-child(4)` rule (emoji sets have 3 entries).
- ~~**Inconsistent interaction**~~ ✓ — the active number now resets after every placement; each piece requires picking a number again (no latent selection).

## Exquisite Corpse (`exquisite-corpse/index.html`)

- **Bug: final screen is "squished"** — `reveal()` compresses the 3-section drawing into one wrap-height canvas on the Y axis only, distorting the figure on **all** screens (see AUDIT.md A7). Needs aspect-preserving (letterboxed) scaling; the downloaded PNG is affected too, and resizes while on the win screen are ignored.
- **Feat: add an animated tutorial**.
- **Enlarge toolbar controls to 64×64 px** (AUDIT A6): color swatches are 48×48 and brush/undo/clear buttons 56×48, below the non-negotiable ≥64×64 tool-button rule (design principle 4).
- **Canvas-mode change destroys the current drawing** (AUDIT A11): switching Tall/Wide calls `newGame()` with no warning, against design principle 9. Add a confirm step or preserve strokes across the mode change.
- **Bug: in-progress stroke lost on resize** (AUDIT A18): `redrawCanvas()` draws committed strokes but not `currentStroke`, so a stroke being drawn during device rotation vanishes.
- ~~**Full section hiding between players**~~ ✓ — canvas slides vertically; completed sections off-screen, `PEEK_PX: 40` strip visible as connection guide.
- ~~**Tall/Wide canvas setting**~~ ✓ — Settings ⚙️ radio: Tall (`flex:1`, portrait) for phones; Wide (`aspect-ratio: 4/3`) for tablets. Changing mode starts a new game.
- ~~**Download finished painting**~~ ✓ — 💾 button on win screen saves `combination-man.png` via `canvas.toDataURL`.
- ~~**Win screen redesign**~~ ✓ — No confetti. Painting stays visible (reveal-canvas overlay, never resizes main canvas). Tools hidden with `visibility:hidden` (not `display:none`) so canvas position never jumps. Download + Replay replace the toolbar area.
- ~~**Section emojis**~~ ✓ — 🙂 head / 👕 body / 👖 legs. No player number labels.
- ~~**Automatic section transitions**~~ ✓ — No handoff pause screen. Slides to next section after 460 ms animation.

## Both games

- **Service-worker update strategy** (AUDIT B1): the cache-first `sw.js` with a fixed cache name means returning players never receive deployed updates until the cache name is bumped. Decide: network-first for navigations (fall back to cache offline), or enforce "bump the cache name in every release" as a hard rule in CLAUDE.md.
- **Favicon** (AUDIT B3): neither game declares a `<link rel="icon">` — hosted pages 404 on `/favicon.ico` and show a generic tab icon. Add an inline SVG/emoji data-URI favicon per game (each game already builds SVG icons in `makeIcon()`).
- **Use or remove the `aria-live` status regions** (AUDIT A17): both games render a visually-hidden `#status` element that is only ever set to an empty string. Either announce placements/wins for screen readers (supports design principle 8) or delete it.

## Repository / Infrastructure

- **Feat: mirror to Codeberg** — add a GitHub Action that syncs this repository to <https://codeberg.org/krash/LibreToybox> on every push to `main` (push mirror using a Codeberg access token stored as a GitHub Actions secret, e.g. `git push --mirror` from a scheduled/push-triggered workflow).
- **Lightweight CI** (AUDIT recommendation): `htmlhint`/`html-validate` over `*/index.html` + a link check; add a `.gitignore` before tooling arrives.
