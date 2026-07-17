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

- **Feat: save and share the painting as a link (high) — next up**. The link must be **self-contained** — the painting's full state encoded into the URL itself (e.g. a compressed/base64 query param or fragment), no server round-trip, keeping with the project's zero-backend/offline-first/no-tracking rules — and **short if at all possible**. Note the tension: a genuinely short URL normally means a third-party shortening *service*, which conflicts with those same rules, so this needs the same kind of scoping conversation the "screen timer" bullet (under "All games" above) already calls for before implementation.
- **Feat: add an animated tutorial**.
- **Bug: drag-to-trash stops at the screen edge (low)** — dragging a stamp toward `#trash-btn` "stops" the emoji once the pointer reaches the edge of the screen, instead of letting the drag continue on to the trash can.

## Odd One Out (`odd-one-out/index.html`)

- **Feat: add an animated tutorial**.
- **Better error feedback for a wrong tap (high)** — the current wrong-tap cue (shake + red flash + gentle "hmm" sound) needs stronger/clearer feedback so the child more reliably notices a wrong guess.
- **Feat: show all "odd ones" on the win screen** — the win/party overlay at the end of a set should recap the odd-one-out emoji from each of the set's rounds, not just the usual celebration.

## Future Games

*(candidates discussed 2026-07-12: Four in a Row pass-and-play, pocket xylophone music toy, Simon-style Echo)*

## Later / not now

- **Android packaging (Capacitor APK)** — scoped on 2026-07-12 (one Capacitor 8 app wrapping the hub + all games, GitHub Actions build+sign+release on tag push). Deliberately shelved: focus is on the web app and PWA experience first. Revisit this scoping conversation if/when Android packaging becomes a priority again.
