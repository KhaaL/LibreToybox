# Child Games — Planned Improvements

## Child Sudoku (`soduko-for-minis/index.html`)
- **Feat: add a animated tutorial**.
- **Selected cell highlight**: The current selected-cell outline is too subtle. Make it more distinct — thicker border, stronger color contrast, or a filled background — so children can clearly see which cell is active.
- **Win screen should keep puzzle visible**: The confetti/win overlay currently covers the completed puzzle. The puzzle should remain visible beneath the celebration so players can see their finished work.
- **Inconsistent interaction**: Once a number have been placed, the selected number should reset. After each placed piece, a new number needs to be selected.
## Exquisite Corpse (`exquisite-corpse/index.html`)

- **Bug: final screen is "squished" on small screens**.
- **Feat: add a animated tutorial**.
- ~~**Full section hiding between players**~~ ✓ — canvas slides vertically; completed sections off-screen, `PEEK_PX: 40` strip visible as connection guide.
- ~~**Tall/Wide canvas setting**~~ ✓ — Settings ⚙️ radio: Tall (`flex:1`, portrait) for phones; Wide (`aspect-ratio: 4/3`) for tablets. Changing mode starts a new game.
- ~~**Download finished painting**~~ ✓ — 💾 button on win screen saves `combination-man.png` via `canvas.toDataURL`.
- ~~**Win screen redesign**~~ ✓ — No confetti. Painting stays visible (reveal-canvas overlay, never resizes main canvas). Tools hidden with `visibility:hidden` (not `display:none`) so canvas position never jumps. Download + Replay replace the toolbar area.
- ~~**Section emojis**~~ ✓ — 🙂 head / 👕 body / 👖 legs. No player number labels.
- ~~**Automatic section transitions**~~ ✓ — No handoff pause screen. Slides to next section after 460 ms animation.
