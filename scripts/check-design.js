#!/usr/bin/env node
// Guards the conventions that have historically drifted across the games (see
// AUDIT.md / the 2026 review): every game must ship the PWA scaffolding and
// mark its modal overlays as dialogs. Dependency-free, in the spirit of
// check-links.js. Run over the game files (*/index.html) — NOT the hub, which
// deliberately has no PWA yet (tracked in plan.md).
'use strict';

const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node scripts/check-design.js <game/index.html> ...');
  process.exit(1);
}

let errors = 0;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  const fail = (msg) => { console.error(`${file}: ${msg}`); errors++; };

  // PWA scaffolding (design principle 7 / "Adding a New Game").
  if (!/<meta\s+name="theme-color"/i.test(html)) fail('missing <meta name="theme-color">');
  if (!/<link\s+rel="manifest"/i.test(html)) fail('missing <link rel="manifest">');
  if (!fs.existsSync(path.join(dir, 'sw.js'))) fail('missing sibling sw.js service worker');

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
