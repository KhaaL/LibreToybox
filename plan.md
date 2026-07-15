# LibreToybox — Planned Improvements

Completed items live in `done.md`.

## Child Sudoku (`sudoku-for-minis/index.html`)

- **Feat: add an animated tutorial**.
- **Dialog semantics for overlays** (AUDIT B4): add `role="dialog" aria-modal="true"` to the settings and win overlays, matching Exquisite Corpse's settings overlay.
- **Visually segment the board into its box regions** — the board should visually group its box regions (2×2 at 4×4, 2×3 at 6×6, 2×4 at 8×8) so children can see at a glance which tiles belong together, beyond the current thin box-border lines.

## Exquisite Corpse (`exquisite-corpse/index.html`)

- **Feat: add an animated tutorial**.
- **Long-press to end turn** — the "Done" control that advances to the next section/player should require a long press instead of a single tap, to guard against an accidental tap ending a turn early.

## Hub (`index.html`)

- **Offline capability** (UI review 2026-07-13): the hub is the only page without a manifest, theme-color, or service worker — offline players can open every installed game but not the front door that links them. Add the same PWA boilerplate the games use.

## All games

- **Instructions for installing as a PWA** — add player/parent-facing guidance (hub and/or each game) on how to install the app to a home screen, since there's currently no in-app hint that this is possible.
- **Back button on every game** — a control to return to the hub landing page from within any game, not just browser back.
- **"Reset board" button (long press)** — a way to reset the current game's board/puzzle without going through settings, guarded by a long press so it can't be triggered accidentally.
- **Feat: screen timer** — a visible, parent-configurable play-time timer to help manage screen time. Needs a scoping conversation before implementation: per-game vs. hub-level, whether it interrupts play or just gently notifies, and how it squares with the no-pressure-mechanics rule already in place for in-game timers/counters (e.g. Memory's deliberate "no timer, no move counter").

## Repository / Infrastructure

- **Feat: mirror to Codeberg** — add a GitHub Action that syncs this repository to <https://codeberg.org/krash/LibreToybox> on every push to `main` (push mirror using a Codeberg access token stored as a GitHub Actions secret, e.g. `git push --mirror` from a scheduled/push-triggered workflow).

## Memory (`memory/index.html`)

- **Feat: add an animated tutorial**.

## Shape Fit (`shape-fit/index.html`)

- **Feat: add an animated tutorial**.
- **Feat: rotation hard mode** — v1 deliberately ships without rotation (pieces arrive in their correct orientation, jigsaw-style). A later setting could deal pieces randomly rotated and let a tap on a held piece turn it 90°.

## Future Games

*(candidates discussed 2026-07-12: Four in a Row pass-and-play, pocket xylophone music toy, Simon-style Echo)*

- **Plan for new game: Emoji Paint** — a drawing toy candidate; needs a scoping conversation (mechanics, canvas vs. stamp-based drawing, how it differs from Fold and Pass) before implementation.

## Later / not now

- **Android packaging (Capacitor APK)** — scoped on 2026-07-12 (one Capacitor 8 app wrapping the hub + all games, GitHub Actions build+sign+release on tag push). Deliberately shelved: focus is on the web app and PWA experience first. Revisit this scoping conversation if/when Android packaging becomes a priority again.
