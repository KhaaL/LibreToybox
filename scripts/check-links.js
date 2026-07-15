#!/usr/bin/env node
// Verifies every local href/src in the given HTML files resolves to a real
// file on disk. Deliberately skips http(s)/mailto/tel/data/javascript links
// and in-page fragments — this repo makes zero external network requests
// (design principle 6), so there is nothing external worth checking, and
// checking it would make CI depend on network access it doesn't otherwise need.
'use strict';

const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node scripts/check-links.js <file.html> [file2.html ...]');
  process.exit(1);
}

const SKIP_PREFIXES = ['http://', 'https://', '//', 'mailto:', 'tel:', 'data:', 'javascript:'];
const ATTR_RE = /\s(?:href|src)="([^"]*)"/g;

let errors = 0;
let checked = 0;

for (const file of files) {
  const dir = path.dirname(file);
  const html = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = ATTR_RE.exec(html))) {
    const raw = match[1];
    const target = raw.split('#')[0]; // drop in-page fragment
    if (target === '' || SKIP_PREFIXES.some((p) => raw.startsWith(p))) continue;

    let resolved = path.join(dir, target);
    if (target.endsWith('/')) resolved = path.join(resolved, 'index.html');

    checked++;
    if (!fs.existsSync(resolved)) {
      console.error(`Broken link in ${file}: "${raw}" -> ${resolved} does not exist`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} broken link(s) found (${checked} checked).`);
  process.exit(1);
}
console.log(`Checked ${checked} local link(s) across ${files.length} file(s), all resolve.`);
