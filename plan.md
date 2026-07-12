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

- ~~**Feat: free CI/CD hosting**~~ ✓ — `.github/workflows/deploy-pages.yml` deploys the repo to **GitHub Pages** on every push to `main`, live at <https://khaal.github.io/LibreToybox/>. Zero external accounts, zero build step — the static tree is served as-is via `actions/upload-pages-artifact` + `actions/deploy-pages`. Repo was made public and Pages Source set to "GitHub Actions" on 2026-07-12; first deploy verified live.
- **Feat: mirror to Codeberg** — add a GitHub Action that syncs this repository to <https://codeberg.org/krash/LibreToybox> on every push to `main` (push mirror using a Codeberg access token stored as a GitHub Actions secret, e.g. `git push --mirror` from a scheduled/push-triggered workflow).
- **Lightweight CI** (AUDIT recommendation): `htmlhint`/`html-validate` over `*/index.html` + a link check; add a `.gitignore` before tooling arrives.
- **Feat: Android APK via Capacitor, auto-built and released** (scoped 2026-07-12) — package the hub + both games as **one** Android app using Capacitor 8 (bundles the HTML locally in the APK, offline by design; WebView supports everything the games use). Scope decisions and steps:
  - **One app, not per-game APKs**: hub `index.html` is the entry point; games load via existing relative links. One keystore, one workflow, one listing.
  - **Repo layout**: root `package.json` + `capacitor.config.json` + committed `android/` native project (Capacitor's recommendation; deterministic builds) + `.gitignore` (`node_modules/`, `dist/`). A small copy script assembles `dist/` (hub + game dirs only) as Capacitor's `webDir` — the web/Pages story stays build-free; the build step exists only for the Android target.
  - **Two small game tweaks needed**: (1) skip service-worker registration when running inside Capacitor (`window.Capacitor` check) — assets are already local, and the cache-first SW would serve stale content after app updates; (2) Combination Man's 💾 download uses `<a download>` + data-URL, which does nothing in Capacitor's WebView — needs a guarded path via `@capacitor/filesystem`/`@capacitor/share` to save the PNG on Android.
  - **CI/CD** (`.github/workflows/build-android.yml`): on tag `v*` push (+ `workflow_dispatch`) — checkout → setup Java 21 (temurin) + Node 22 → `npm ci` → assemble `dist/` → `npx cap sync android` → `./gradlew assembleRelease` (Android SDK is preinstalled on `ubuntu-latest`) → sign with the release keystore from secrets → attach the APK to a GitHub Release. `versionName` from the git tag, `versionCode` from the run number.
  - **One-time manual step (owner only)**: generate a release keystore locally with `keytool` and add 4 repo secrets (`KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`). The keystore must never be committed; losing it means users must uninstall/reinstall future versions.
  - **Distribution**: GitHub Releases (free, sideload). **F-Droid** is a natural phase 2 for a GPL/no-tracking project (needs their metadata + reproducible build recipe). **Play Store is explicitly out of scope for now**: $25 fee plus the "Designed for Families" policy program (kids-targeted apps face extra review, privacy declarations, and policy overhead).
