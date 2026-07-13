# LibreToybox — Planned Improvements

Completed items live in `done.md`.

## Child Sudoku (`sudoku-for-minis/index.html`)

- **Feat: add an animated tutorial**.
- **Feat: bigger difficulty levels — 1–6 and 1–8** — beyond the current 4×4 (digits 1–4), add a 6×6 board (digits 1–6, 2×3 boxes) and an 8×8 board (digits 1–8, 2×4 boxes) as selectable difficulties in settings, following the same size-toggle pattern as Memory and Shape Fit.
- **Dialog semantics for overlays** (AUDIT B4): add `role="dialog" aria-modal="true"` to the settings and win overlays, matching Exquisite Corpse's settings overlay.

## Exquisite Corpse (`exquisite-corpse/index.html`)

- **Feat: add an animated tutorial**.
- **Remove the top icon/header to make more room for the canvas** — reclaim that vertical space for drawing. Which section the current player is on should instead be shown via grey horizontal zones at the very top and bottom of the canvas viewport, marking the strips that will be visible (as the peek guide) to the next player.
- **Long-press to end turn** — the "Done" control that advances to the next section/player should require a long press instead of a single tap, to guard against an accidental tap ending a turn early.

## Hub (`index.html`)

- **Offline capability** (UI review 2026-07-13): the hub is the only page without a manifest, theme-color, or service worker — offline players can open every installed game but not the front door that links them. Add the same PWA boilerplate the games use.

## All games

- **Instructions for installing as a PWA** — add player/parent-facing guidance (hub and/or each game) on how to install the app to a home screen, since there's currently no in-app hint that this is possible.
- **Back button on every game** — a control to return to the hub landing page from within any game, not just browser back.
- **"Reset board" button (long press)** — a way to reset the current game's board/puzzle without going through settings, guarded by a long press so it can't be triggered accidentally.

## Repository / Infrastructure

- **Feat: mirror to Codeberg** — add a GitHub Action that syncs this repository to <https://codeberg.org/krash/LibreToybox> on every push to `main` (push mirror using a Codeberg access token stored as a GitHub Actions secret, e.g. `git push --mirror` from a scheduled/push-triggered workflow).
- **Lightweight CI** (AUDIT recommendation): `htmlhint`/`html-validate` over `*/index.html` + a link check; add a `.gitignore` before tooling arrives.

## Memory (`memory/index.html`)

- **Feat: add an animated tutorial**.
- **Win screen: show the full board face-up** — matched pairs fly off during play, so the celebration currently sits over an empty board. On win, put all tiles back on the board face-up under the translucent overlay, so the child sees the completed set of pairs they found.

## Shape Fit (`shape-fit/index.html`)

- **Feat: add an animated tutorial**.
- **Feat: rotation hard mode** — v1 deliberately ships without rotation (pieces arrive in their correct orientation, jigsaw-style). A later setting could deal pieces randomly rotated and let a tap on a held piece turn it 90°.

## Future Games

*(candidates discussed 2026-07-12: Four in a Row pass-and-play, pocket xylophone music toy, Simon-style Echo)*

## Later / not now

- **Android packaging (Capacitor APK)** — scoped on 2026-07-12 (one Capacitor 8 app wrapping the hub + all games, GitHub Actions build+sign+release on tag push). Deliberately shelved: focus is on the web app and PWA experience first. Revisit this scoping conversation if/when Android packaging becomes a priority again.
