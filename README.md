# LibreToybox

**Play now: https://khaal.github.io/LibreToybox/**

A collection of small, self-contained HTML5 games for children aged 6–8, built for touchscreens.

Every game is a single `index.html` (plus a tiny `sw.js` for offline caching) — **no build step, no frameworks, no accounts, no ads, and no tracking**. Open the file and play.

## Games

| Game | Where | What it is |
|---|---|---|
| **Child Sudoku** | [`sudoku-for-minis/`](sudoku-for-minis/index.html) | A 4×4 Sudoku for beginners: number pad + chunky cells, playful sounds, a Reject/Keep toggle for wrong numbers, and a confetti party on winning. |
| **Fold and Pass** | [`exquisite-corpse/`](exquisite-corpse/index.html) | An [Exquisite Corpse](https://en.wikipedia.org/wiki/Exquisite_corpse) drawing game: players take turns drawing head, body, and legs without seeing each other's sections, then reveal the combined creature — and can save it as a PNG. |

## Playing & hosting

- **Locally:** open any game's `index.html` directly in a browser — everything works at `file://` with no server.
- **Hosted:** live at [khaal.github.io/LibreToybox](https://khaal.github.io/LibreToybox/), auto-deployed to GitHub Pages by [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) on every push to `main`. Each game installs as a PWA and works offline after the first load (via its `sw.js`).

## Philosophy

Humane-first software for kids: interaction is visual and transcends written language — no reading required. Chunky touch targets, direct manipulation, mistakes that are playful rather than punitive, procedural Web Audio sounds, offline-first, and zero tracking.

The full rules live in [`design_principles.txt`](design_principles.txt) — they are authoritative for every change.

## Contributing

- [`design_principles.txt`](design_principles.txt) — the non-negotiable design rules
- [`CLAUDE.md`](CLAUDE.md) — developer guide and per-game architecture notes
- [`plan.md`](plan.md) — open bugs and planned features (single source of truth)

## License

[GNU GPL v3.0](LICENSE)
