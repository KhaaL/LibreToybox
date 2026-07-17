# LibreToybox — Planned Improvements

Completed items live in `done.md`.

## Child Sudoku (`sudoku-for-minis/index.html`)

- **Feat: add an animated tutorial**.
- **Feat: drag and drop tile placement** — a new method for placing digits: drag a digit from the number pad straight onto a cell, as an alternative to the current select-destination-then-digit flow.

## Exquisite Corpse (`exquisite-corpse/index.html`)

- **Feat: add an animated tutorial**.
- **Long-press to end turn** — the "Done" control that advances to the next section/player should require a long press instead of a single tap, to guard against an accidental tap ending a turn early.

## All games

- **Instructions for installing as a PWA** — add player/parent-facing guidance (hub and/or each game) on how to install the app to a home screen, since there's currently no in-app hint that this is possible.
- **"Reset board" button (long press)** — a way to reset the current game's board/puzzle without going through settings, guarded by a long press so it can't be triggered accidentally.
- **Feat: screen timer** — a visible, parent-configurable play-time timer to help manage screen time. Needs a scoping conversation before implementation: per-game vs. hub-level, whether it interrupts play or just gently notifies, and how it squares with the no-pressure-mechanics rule already in place for in-game timers/counters (e.g. Memory's deliberate "no timer, no move counter").

## Repository / Infrastructure

- **Feat: mirror to Codeberg** — add a GitHub Action that syncs this repository to <https://codeberg.org/krash/LibreToybox> on every push to `main` (push mirror using a Codeberg access token stored as a GitHub Actions secret, e.g. `git push --mirror` from a scheduled/push-triggered workflow).

## Memory (`memory/index.html`)

- **Feat: add an animated tutorial**.

## Shape Fit (`shape-fit/index.html`)

- **Feat: add an animated tutorial**.
- **Feat: rotation hard mode** — v1 deliberately ships without rotation (pieces arrive in their correct orientation, jigsaw-style). A later setting could deal pieces randomly rotated and let a tap on a held piece turn it 90°.

## Emoji Paint (`emoji-paint/index.html`)

- **Feat: add an animated tutorial**.
- **Bug: drag-to-trash stops at the screen edge (low)** — dragging a stamp toward `#trash-btn` "stops" the emoji once the pointer reaches the edge of the screen, instead of letting the drag continue on to the trash can.
- **Feat: save and share board state as a link (high)** — ability to save the current painting's state and share it with others via a link.

## Odd One Out (`odd-one-out/index.html`)

- **Feat: add an animated tutorial**.
- **Better error feedback for a wrong tap (high)** — the current wrong-tap cue (shake + red flash + gentle "hmm" sound) needs stronger/clearer feedback so the child more reliably notices a wrong guess.

## Future Games

*(candidates discussed 2026-07-12: Four in a Row pass-and-play, pocket xylophone music toy, Simon-style Echo)*

## Later / not now

- **Android packaging (Capacitor APK)** — scoped on 2026-07-12 (one Capacitor 8 app wrapping the hub + all games, GitHub Actions build+sign+release on tag push). Deliberately shelved: focus is on the web app and PWA experience first. Revisit this scoping conversation if/when Android packaging becomes a priority again.
