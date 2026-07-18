# LibreToybox — Planned Improvements

Completed items live in `done.md`.

## Child Sudoku (`sudoku-for-minis/index.html`)
- **Feat: add an animated tutorial**.
- **Feat: drag and drop tile placement** — a new method for placing digits: drag a digit from the number pad straight onto a cell, as an alternative to the current select-destination-then-digit flow.

## Exquisite Corpse (`exquisite-corpse/index.html`)
- **Feat: add an animated tutorial**.
- **Long-press to end turn** — the "Done" control that advances to the next section/player should require a long press instead of a single tap, to guard against an accidental tap ending a turn early.
- **Bug: top ~3px of the last (3rd) section can't be painted** — the very top strip of the final section appears to reject strokes, unlike the same strip in earlier sections. Worth checking `PEEK_PX` and the per-section `ctx.rect()`/`ctx.clip()` math in `redrawCanvas()`, since that's what carves each section's drawable band — not yet investigated further.

## All games
- **Feat: screen timer** — a visible, parent-configurable play-time timer to help manage screen time. Needs a scoping conversation before implementation: per-game vs. hub-level, whether it interrupts play or just gently notifies, and how it squares with the no-pressure-mechanics rule already in place for in-game timers/counters (e.g. Memory's deliberate "no timer, no move counter").

## Repository / Infrastructure
- None

## Memory (`memory/index.html`)

- **Feat: add an animated tutorial**.

## Shape Fit (`shape-fit/index.html`)

- **Feat: add an animated tutorial**.
- **Feat: rotation hard mode** — v1 deliberately ships without rotation (pieces arrive in their correct orientation, jigsaw-style). A later setting could deal pieces randomly rotated and let a tap on a held piece turn it 90°.

## Emoji Paint (`emoji-paint/index.html`)

- **feat** sharing link should preservea screen size of the original painting. A painting made on a tablet gets squished on a mobile phone screen right now (high)
- **feat** add ability to paint in emoji paint with normal strokes. Evaluate how this would impact the link sharing feature first.
- **feat** compress links, currently they look like: https://toybox.khalid.se/emoji-paint/#AQKymyugLDrSkALk3iSQLV6iewL3ESagMIOSbwM5YCEwDquiFxKSf1VhKjwE1RK0s1WxLGBU1RLW8FdBLoCEgQrpYk3Qrq4U7grsFE_wrtvkhQrr6R7QrtiRwwrvKUeQrvDibwrNHHBQq-aXLxA613LxA5oIGRA625rhA8bo8hA8GG9BA4t7ERA6CcEBA5yZ9RA7Yb1RA8arAACIXITwCoXGQAE3GX3hFl1XUAdnTq6waWU5xwaVWpkQaUr3DQaUUpWgaTjongaT82kAaS8G-AaSwI6gaR8n7waRP1FAaQ-YmgaRYGhwaRKRngaQpTxQaSBTxQaRBLEQaRXt6AaQiNGwaQlveQaSIrzQaR6JwwaSsOagaR8veQaTFbwQaSVdawaTmZ7QaUKb7waT5e0gaTttQQaUgt8QaU0vIgaVFLegaVz80AaV7uMwaVBciQaWC7CQaWsOvQaW8tKAaWn77waYMcyAaX6_bQaYs-LwaXpd4AaZVeXQaZJvvAaadN9QaanfwAaaCfPwabb-2wacWOrQab59RQadUdbwadAfaQacrs1Aad_sLQaeCPPwadgOkwaeobDQafDudgaehtRQad3dmQafK8EAaegubgaer_ggafjNoQafpPIgafg6TQaf4L4gafgYfQafr3Jgaf5F2AaegIgQafAJgAaeMJxwadvrEQadg5Sg
- **feat** experimental new layout: horizontal where left half is a emoji picker, and right half is the canvas. Drag and drops emojis from left to right.
- **Feat: add an animated tutorial**.
- **Bug: drag-to-trash stops at the screen edge (low)** — dragging a stamp toward `#trash-btn` "stops" the emoji once the pointer reaches the edge of the screen, instead of letting the drag continue on to the trash can.

## Odd One Out (`odd-one-out/index.html`)

- **Feat: add an animated tutorial**.

## Future Games

- Simon-style Emoji Echo

## Later / not now

- **Android packaging (Capacitor APK)** — scoped on 2026-07-12 (one Capacitor 8 app wrapping the hub + all games, GitHub Actions build+sign+release on tag push). Deliberately shelved: focus is on the web app and PWA experience first. Revisit this scoping conversation if/when Android packaging becomes a priority again.
