#!/usr/bin/env node
// Guards the conventions that have historically drifted (see AUDIT.md / the
// 2026 review): every page must carry the shared PWA scaffolding and mark its
// modal overlays as dialogs. The whole toybox is ONE PWA — a single root
// manifest.webmanifest + one root sw.js — so this checks that every page links
// the shared manifest and sets a theme-color, and that the single root worker
// exists once (not a per-directory worker). Dependency-free, in the spirit of
// check-links.js. Run over every page (index.html plus */index.html).
'use strict';

const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node scripts/check-design.js <game/index.html> ...');
  process.exit(1);
}

let errors = 0;

// The unified service worker lives once at the repo root (scope "/"), not per
// game directory. Check it exists a single time, relative to this script.
if (!fs.existsSync(path.join(__dirname, '..', 'sw.js'))) {
  console.error('sw.js: missing root service worker (the unified PWA needs one at the repo root)');
  errors++;
}

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const fail = (msg) => { console.error(`${file}: ${msg}`); errors++; };

  // PWA scaffolding (design principle 7 / "Adding a New Game"): every page sets
  // a theme-color and links the ONE shared manifest (not a per-game blob).
  if (!/<meta\s+name="theme-color"/i.test(html)) fail('missing <meta name="theme-color">');
  if (!/<link\s+rel="manifest"[^>]*\bhref="[^"]*manifest\.webmanifest"/i.test(html)) {
    fail('missing <link rel="manifest" href="...manifest.webmanifest"> (every page must link the shared manifest)');
  }

  // Every modal overlay must expose dialog semantics (AUDIT B4). Match each
  // element carrying class="overlay" and confirm the same tag sets role="dialog".
  const TAG_RE = /<[a-z][^>]*\bclass="[^"]*\boverlay\b[^"]*"[^>]*>/gi;
  let m;
  while ((m = TAG_RE.exec(html))) {
    if (!/\brole="dialog"/.test(m[0])) {
      fail(`overlay without role="dialog": ${m[0].slice(0, 80)}...`);
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} design-convention issue(s) found.`);
  process.exit(1);
}
console.log(`Design conventions OK across ${files.length} game file(s).`);
