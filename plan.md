# LibreToybox — Planned Improvements

Completed items live in `done.md`.

## Child Sudoku (`sudoku-for-minis/index.html`)
- **Feat: add an animated tutorial**.
- **Feat? Child soduko hard mode: numbers are not marked as wrong until the end of game.**
- Feat: - Child soduko mark what existing tiles that would make for a Illegal move. NB - "wrong" placements should still be possible. 

## Exquisite Corpse (`exquisite-corpse/index.html`)
- **Feat: add an animated tutorial**.
- **Bug: top ~3px of the last (3rd) section can't be painted** — the very top strip of the final section appears to reject strokes, unlike the same strip in earlier sections. Worth checking `PEEK_PX` and the per-section `ctx.rect()`/`ctx.clip()` math in `redrawCanvas()`, since that's what carves each section's drawable band — not yet investigated further.

## All games
- **Feat: screen timer** — a visible, parent-configurable play-time timer to help manage screen time. Needs a scoping conversation before implementation: per-game vs. hub-level, whether it interrupts play or just gently notifies, and how it squares with the no-pressure-mechanics rule already in place for in-game timers/counters (e.g. Memory's deliberate "no timer, no move counter").

## Repository / Infrastructure
- **Harmonize the `.logo` representation between each game and the hub.** Every game header shows a bespoke inline-SVG `.logo` (e.g. Memory's two overlapping cards, Sudoku's numbered grid), but the hub's game cards (`index.html`) show a single plain emoji span instead (`<span class="emoji">❓</span>` for Memory, etc.) — a different, simpler representation of the same game. A player should see the same "face" for a game whether they're looking at the hub card or the game's own header. Needs a scoping conversation: reuse each game's existing SVG logo on its hub card (drop the plain-emoji spans), or go the other direction and simplify each game's header to the same plain emoji the hub already uses.

## Memory (`memory/index.html`)

- **Feat: add an animated tutorial**.

## Shape Fit (`shape-fit/index.html`)

- **Feat: add an animated tutorial**.
- **Feat: rotation hard mode** — v1 deliberately ships without rotation (pieces arrive in their correct orientation, jigsaw-style). A later setting could deal pieces randomly rotated and let a tap on a held piece turn it 90°.

## Emoji Paint (`emoji-paint/index.html`)

- **Bug (high importance): can't place a stamp while the emoji picker panel is expanded** — with the picker open (the wide-screen docked split-view panel, and/or the modal picker), neither drag-and-drop nor tap-to-place gets an emoji from the picker onto the canvas. Reported by the user 2026-07-22; not yet investigated further.
- **feat** add ability to paint in emoji paint with normal strokes. Evaluate how this would impact the link sharing feature first.
- **feat** experimental new layout: horizontal where left half is a emoji picker, and right half is the canvas. Drag and drops emojis from left to right.
- **Feat: add an animated tutorial**.

## Odd One Out (`odd-one-out/index.html`)

- **Feat: add an animated tutorial**.

## Grocery Cashier (`grocery-cashier/index.html`)

- **Feat: add an animated tutorial**.
- **Feat: horizontal layout for wide screens** — an alternate landscape layout (e.g. order/receipt on one side, register + keypad on the other) so the game uses a tablet's width instead of a single tall column. Default (portrait) layout stays as-is; the wide layout kicks in via a media query on wide/landscape viewports.
- **Feat? wrong-answer cooldown** — Odd One Out and What Comes Next? both gained an opt-out cooldown toggle (3s lock + shrinking ring after a wrong tap). Deliberately **not** extended here yet: ringing up a wrong total is numeric-keypad entry (backspace-and-retry), not tapping through a small set of discrete option tiles, so the same "spam through every option" shape doesn't directly apply. Revisit if backspace-mashing turns out to need the same deterrent.

## What Comes Next? (`guess-next-sequence/index.html`)

- **Feat: add an animated tutorial**.

## Future Games

- Simon-style Emoji Echo

## Later / not now

- **Android packaging (Capacitor APK)** — scoped on 2026-07-12 (one Capacitor 8 app wrapping the hub + all games, GitHub Actions build+sign+release on tag push). Deliberately shelved: focus is on the web app and PWA experience first. Revisit this scoping conversation if/when Android packaging becomes a priority again.
