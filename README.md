# LibreToybox 
**Simple HTML5 games for kids aged 6–8. No tracking, registration or addictive feedback loops - just joy.**

Play now: https://toybox.khalid.se/ or https://khaal.github.io/LibreToybox/

> Authors note: these games solves an issue I have with the majority of the games for kids: they either exploit the players deopamine feedback, filled with ads and / or trackers, or require an internet connection. Inspired by GCompris, I build these no-pressure, educational games for my kids and other children to experience joy through the FOSS spirit with the help of AI. Stack is minimal on purpose.
> Enjoy!



## Games

| Game | Where | What it is |
|---|---|---|
| **Mini-Sudoku** | [`sudoku-for-minis/`](sudoku-for-minis/index.html) | A Sudoku for beginners (4×4, 6×6 or 8×8): number pad + chunky cells, playful sounds, a Reject/Keep toggle for wrong numbers, and a confetti party on winning. |
| **Fold & Draw** | [`exquisite-corpse/`](exquisite-corpse/index.html) | An [Exquisite Corpse](https://en.wikipedia.org/wiki/Exquisite_corpse) drawing game: players take turns drawing head, body, and legs without seeing each other's sections, then reveal the combined creature — and can save it as a PNG. |
| **Memory** | [`memory/`](memory/index.html) | A pairs-matching game: face-down emoji cards, tap two to flip — matches chime and fly off the board, mismatches gently flip back. 4×4 or 6×4 board, no timer, confetti on winning. |
| **Fit It!** | [`shape-fit/`](shape-fit/index.html) | Tetris shapes without the time pressure: the board is cut into colorful puzzle pieces that the child drags back to fill the whole grid. Every deal is solvable, wrong drops bounce gently back, placed pieces lift off again. 4×4 to 6×6 board, no timer, confetti on winning. |
| **Emoji Art** | [`emoji-paint/`](emoji-paint/index.html) | A free-play painting canvas: pick from hundreds of emoji stamps (with a searchable picker and a Recent row), tap to place them, drag or long-press to move and delete, and save the picture as a PNG. No win state — just play. |
| **Spot It!** | [`odd-one-out/`](odd-one-out/index.html) | Spot the item that doesn't belong: a grid of emoji where one breaks the hidden rule the others share. 4/6/9 tiles, a subtle sibling-category mode at the hardest level, and a confetti party after a set of rounds. |

## Playing & hosting

- **Locally:** open any game's `index.html` directly in a browser — everything works at `file://` with no server.
- **Hosted:** live at [khaal.github.io/LibreToybox](https://khaal.github.io/LibreToybox/), auto-deployed to GitHub Pages by [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) on every push to `main`. Each game installs as a PWA and works offline after the first load (via its `sw.js`).

## Philosophy

Humane-first software for kids: interaction is visual and transcends written language — no reading required. Chunky touch targets, direct manipulation, mistakes that are playful rather than punitive, procedural Web Audio sounds, offline-first, and zero tracking.

The games share one color system: a single pastel palette (flat fills with a darker same-hue edge), with each game's identity coming from its background hue family — warm cream for Mini-Sudoku, mint for Fit It!, ice blue for Memory, lavender for Fold & Draw, pink for Emoji Art, and sunny gold for Spot It!.

The full rules live in [`design_principles.txt`](design_principles.txt) — they are authoritative for every change.

## Contributing

- [`design_principles.txt`](design_principles.txt) — the non-negotiable design rules
- [`CLAUDE.md`](CLAUDE.md) — developer guide and per-game architecture notes
- [`plan.md`](plan.md) — open bugs and planned features (single source of truth)

## License

[GNU GPL v3.0](LICENSE)
