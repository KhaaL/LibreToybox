#!/usr/bin/env node
// Syntax-checks the inline <script> blocks in the given HTML files. The games
// are single-file HTML with ~500-950 lines of inline JS that html-validate does
// not parse, so a syntax error (a stray brace, a bad edit) would otherwise ship
// unnoticed. Each script's source is compiled with vm.Script, which throws on a
// syntax error without executing anything (no DOM/network needed).
'use strict';

const fs = require('fs');
const vm = require('vm');

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node scripts/check-js.js <file.html> [file2.html ...]');
  process.exit(1);
}

// Grab the body of every <script> that has no src attribute (skip external refs;
// the games have none, but this keeps the check honest if one is ever added).
const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;

let errors = 0;
let checked = 0;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  let match;
  let idx = 0;
  while ((match = SCRIPT_RE.exec(html))) {
    const attrs = match[1] || '';
    if (/\bsrc\s*=/.test(attrs)) continue; // external script, nothing inline to check
    const code = match[2];
    if (!code.trim()) continue;
    idx++;
    checked++;
    try {
      // Compiling is enough to surface syntax errors; we never run it.
      new vm.Script(code, { filename: `${file}#script${idx}` });
    } catch (e) {
      console.error(`Syntax error in ${file} (inline script #${idx}): ${e.message}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} script(s) failed to parse (${checked} checked).`);
  process.exit(1);
}
console.log(`Checked ${checked} inline script(s) across ${files.length} file(s), all parse.`);
