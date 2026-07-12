# Repository Audit — 2026-07-12

Full audit of LibreToybox: every file was reviewed and cross-checked against
`CLAUDE.md`, `plan.md`, and `design_principles.txt`.

> **Status (2026-07-12):** A1–A5, A8, A9 (Google Fonts removed), A10, A13,
> A14, and A15 are **fixed**. File paths below reference the pre-fix state —
> in particular, `soduko-for-minis/` is now `sudoku-for-minis/`, and line
> numbers have shifted. Still open: A6, A7 (tracked in plan.md), A11, A12,
> A16–A18.

**Severity scale**
| Level | Meaning |
|---|---|
| 5 | Critical — data loss, security, or the product is fundamentally broken |
| 4 | High — a shipped feature or documented guarantee does not work |
| 3 | Medium — docs contradict code/each other, or a "non-negotiable" design rule is violated |
| 2 | Low — quality, consistency, or foundation issue; fix before scaling |
| 1 | Informational — dead code, typos, trivia |

No level-5 findings. Findings are numbered A1–A18, ordered by severity.

---

## Severity 4 — High

### A1. The PWA/offline mechanism does not work in either game
`soduko-for-minis/index.html:807`, `exquisite-corpse/index.html:871-873`

Both games register their service worker from a Blob URL:

```js
navigator.serviceWorker.register(URL.createObjectURL(swBlob)).catch(() => {});
```

The Service Worker spec requires the script URL scheme to be `http:` or
`https:`; `blob:` URLs are rejected by Chrome, Firefox, and Safari. The
rejection is silently swallowed by `.catch(() => {})`, so the SW **never
installs** and no offline caching ever happens. (At `file://` service workers
are unavailable anyway, so the code is dead in both deployment modes.)

This contradicts three pieces of documentation:
- `design_principles.txt` §7: "Use data URIs / Blob URLs for the manifest and service worker so the game works offline after first load"
- `CLAUDE.md` Tech Stack: "PWA via Blob-URL service worker + runtime manifest (both games)"
- `CLAUDE.md` "Adding a New Game" step 1 instructs copying this broken boilerplate into every future game — which is why this is a foundation-level issue.

**Action:** either ship a real `sw.js` file per game (accepting a second file
per directory), or drop the SW claim from the docs and rely on
single-file-at-`file://` as the offline story. Update principle 7 and the
CLAUDE.md boilerplate instructions to match whichever is chosen. The runtime
*manifest* Blob URL (line 794 / 859) does work in Chromium and can stay.

### A2. Sudoku celebrates a win on an incorrect board (Keep mode)
`soduko-for-minis/index.html:601-604` (`checkWin`), `:503` (keep-mode early return)

`checkWin()` only verifies that no cell is empty:

```js
checkWin() {
  for (...) if (this.playGrid[r][c] === 0) return false;
  return true;
}
```

In **Keep mode** (`keepIllegal = true`) conflicting numbers stay on the board.
If the child fills the last empty cell with a locally-legal number while a
conflict exists elsewhere, `checkWin()` returns true and the full win
celebration fires on a wrong solution. Reproduce: enable Keep mode, place two
identical numbers in one row, fill the rest of the board.

This also breaks the pedagogical premise of Keep mode ("highlighted red until
the child fixes them" — principle 3).

**Action:** make `checkWin()` require a conflict-free board, e.g. compare
`playGrid` against `this.solution` (already stored) or scan `hasConflict` for
every cell.

---

## Severity 3 — Medium

### A3. CLAUDE.md's pending-work summary contradicts plan.md
`CLAUDE.md` ("Pending Work", dated 2026-07-11) vs `plan.md`

- CLAUDE.md: "**Exquisite Corpse**: all features complete" — plan.md lists an **open bug** ("final screen is squished on small screens") and an open feature (animated tutorial).
- CLAUDE.md lists 2 Sudoku items — plan.md lists 4 (missing: animated tutorial; number-selection reset / "inconsistent interaction").

The summary drifted within a day of being written. **Action:** remove the
duplicated summary from CLAUDE.md and keep plan.md as the single source of
truth (CLAUDE.md already links to it), or clearly mark the summary as
non-authoritative.

### A4. Three conflicting project identities; documented tree doesn't match the repo
`CLAUDE.md` structure diagram vs actual layout

CLAUDE.md's directory diagram shows a root folder named `child-games/`; the
repo is `LibreToybox` with the game folders at the repository root. The
project is called "LibreToybox" (repo), "Child Games" (CLAUDE.md, plan.md),
and the drawing game is "Exquisite Corpse" in docs but ships as
"Combination Man" (`exquisite-corpse/index.html:6`, manifest name). Also,
CLAUDE.md's diagram omits `README.md`, `LICENSE`, and `AUDIT.md`.

**Action:** pick one project name, fix the tree diagram, and note the
docs-name ↔ product-name mapping for the drawing game. Do this before more
apps are added.

### A5. README.md is empty
`README.md` (0 bytes)

For a repo that "will scale up with more applications" this is the front
door: no description, no how-to-run, no license statement, no contribution
pointer. **Action:** write a README covering: what the project is, the
single-file/no-build philosophy, how to play (open `*/index.html`), the game
list, license (GPL-3.0 — currently mentioned nowhere outside the LICENSE
file itself), and a pointer to `design_principles.txt` + `plan.md`.

### A6. Exquisite Corpse tool buttons violate the "non-negotiable" 64×64 px rule
`exquisite-corpse/index.html:164-215`

CLAUDE.md design rule 3 and principle 4 mandate ≥64×64 px tool buttons.
Actual sizes: color swatches **48×48**, brush buttons **56×48**, undo/clear
**56×48**, header buttons 48×48 (both games). Sudoku's number pad (64×64) is
the only compliant toolset. **Action:** enlarge EC toolbar controls to 64×64
(or amend the principle if 48 px is the intended floor for secondary
controls — but then the docs must say so).

### A7. Reveal screen and downloaded PNG are vertically squished 3× (all screens, not just small)
`exquisite-corpse/index.html:779-807` (`reveal`), `:817-822` (`downloadPainting`), `:496-509` (resize)

`reveal()` redraws all strokes onto a canvas one wrap-height tall, but stroke
Y coordinates are normalized against the full 3-section canvas. X scale stays
the same while Y compresses to ⅓ → the figure is distorted, and
`downloadPainting()` exports the distorted version. plan.md tracks this as
"squished on small screens", but it happens on **every** screen in both
modes; the fix needs uniform scaling (letterbox: scale both axes by ⅓,
center horizontally). Related: the resize handler ignores resizes while
`won === true`, so rotating the device on the win screen stretches the
reveal further. **Action:** update the plan.md bug description and fix with
aspect-preserving scaling.

---

## Severity 2 — Low

### A8. Sudoku manifest icons declare `image/png` but are SVG data URIs
`soduko-for-minis/index.html:789-790` vs `makeIcon()` returning `data:image/svg+xml`.
Exquisite Corpse declares `image/svg+xml` correctly. Some platforms will
reject the mistyped icon. **Action:** change type to `image/svg+xml`.

### A9. Google Fonts CDN vs "no tracking" / offline-first
`*/index.html:7`; `design_principles.txt` preamble ("no tracking, spyware …
no requirement of being online")

Every page load sends the user's IP to Google's font CDN, and with the
service worker dead (A1) fonts silently fail offline. The docs call fonts
"strictly optional", and there is a fallback stack, so this is a tension
rather than a breakage — but for a "humane first" project it's worth
resolving. **Action:** use a system font stack or embed a subsetted WOFF2 as
a data URI (keeps the single-file rule and removes the only external
dependency). Note: "Fredoka One" was renamed "Fredoka" upstream; the legacy
name still resolves but is deprecated.

### A10. Latent tool selection violates design principle 2 (tracked, confirming root cause)
`soduko-for-minis/index.html:351-359, 414-421`

Principle 2: "After an action completes, no tile or tool should remain
pre-selected." After any placement, `activeTool` stays active, so the next
cell tap places immediately instead of selecting. This is plan.md's
"Inconsistent interaction" item — the fix is to clear `activeTool` (and the
`.active` class) after a successful placement.

### A11. Settings behavior contradicts design principle 9 in both games
- EC: changing canvas mode calls `newGame()` and silently destroys the current drawing (`exquisite-corpse/index.html:827-833`). CLAUDE.md documents this as intended, but principle 9 says "Changing a setting should not break the current game state unexpectedly." One of the two documents must yield; a confirm step or preserving strokes would satisfy both.
- Sudoku: switching back to Reject mode clears illegal cells instantly with no animation or sound (`soduko-for-minis/index.html:769-778`); principle 9 requires "do so visibly."

### A12. Grid cells are not keyboard-accessible
`soduko-for-minis/index.html:729-738`; `design_principles.txt` §8

Cells are `<div>`s with no `tabindex`/key handlers, so the board can't be
operated by keyboard. Principle 8's own wording is also internally
inconsistent ("Maintain **keyboard**/touch parity: support both **mouse**
and touch"). **Action:** decide whether keyboard support is in scope, fix
the principle's wording, and if in scope add `tabindex`/Enter handling to
cells (EC's pointer events already cover mouse+touch).

### A13. Possible double-input from synthetic mouse events (Sudoku)
`soduko-for-minis/index.html:423-428`

The grid binds both touch **and** mouse handlers, and `touchend` doesn't
`preventDefault()`, so browsers may fire synthetic `mousedown`/`mouseup`
~300 ms after a tap — outside the 150 ms debounce window (`:408`) — causing
a double placement. EC avoids this by using pointer events. **Action:**
migrate Sudoku to pointer events (consistent with EC), or call
`e.preventDefault()` in `touchend`.

### A14. License is invisible
GPL-3.0 sits in `LICENSE` but is referenced nowhere — empty README, no
CLAUDE.md mention, no file headers. Contributors and forks can't see the
intent without opening the file. **Action:** state the license in the README
(and optionally a one-line header comment per game file).

### A15. Directory typo: `soduko-for-minis`
"Soduko" is a misspelling of "Sudoku", replicated in CLAUDE.md and plan.md.
Renaming later breaks bookmarks/links, so fix it **before** the repo scales
(the games are not yet published widely per the docs). **Action:** `git mv
soduko-for-minis sudoku-for-minis` and update both docs.

---

## Severity 1 — Informational

### A16. Dead code in Sudoku
- `tryClear()` (`:517-521`) — never called.
- `bonkCell()` / `audioBonk()` (`:531-539`, `:850`) — never called.
- `--eraser` CSS variable (`:18`) — unused (remnant of a removed eraser tool).
- `@keyframes shake` (`:150`) — unused (`flashShake` is the live one).
- `.hidden` class (`:246`) — unused.
- `.emoji-row span:nth-child(4)` delay (`:243`) — emoji sets contain only 3 entries.

### A17. Minor doc inaccuracies and typos
- CLAUDE.md: "460 ms CSS transition" — the CSS transition is **400 ms** (`transform 0.4s`, `exquisite-corpse/index.html:764`); 460 ms is the JS `setTimeout` that follows it.
- plan.md typos: "a animated tutorial" (×2), "Once a number have been placed".
- Both games render an `aria-live` status region that is only ever set to an empty string (`#status`) — either use it (announce placements/wins for screen readers, reinforcing principle 8) or remove it.

### A18. In-progress stroke lost on window resize (EC)
`exquisite-corpse/index.html:698-702` — `redrawCanvas()` draws `allStrokes` +
`strokes` but not `currentStroke`, so a stroke being drawn during a resize
(e.g. device rotation) vanishes. Edge case; noting for completeness.

---

## Foundation recommendations (pre-scaling)

1. **Fix the shared boilerplate first (A1, A8, A13).** CLAUDE.md tells every new game to copy `setupPWA()` and the audio helpers; today that copies a broken service worker and a mistyped icon. Fix once now, or every future app inherits the defects.
2. **One source of truth for status** (A3): plan.md owns pending work; CLAUDE.md links, never summarizes.
3. **Name the project once** (A4, A15) and align repo name, docs, and folder names while renames are still cheap.
4. **Write the README and surface the license** (A5, A14).
5. **Add lightweight CI** — even just `htmlhint`/`html-validate` on `*/index.html` plus a link check would catch structural regressions with zero build-step impact. Add a `.gitignore` (currently absent) before tooling arrives.
6. **Decide the extraction threshold now**: `playTone`, `ensureAudio`, `audioSwoosh`, `audioWin`, and `setupPWA` are already duplicated verbatim between the two games. Duplication is the documented philosophy (single self-contained files) — that's fine, but write it down as an explicit rule ("shared code is copied, never imported; canonical version lives in game X") so drift between copies is a conscious choice.
