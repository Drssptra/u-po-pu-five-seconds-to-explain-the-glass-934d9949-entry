// u-po-pu-five-seconds-to-explain-the-glass-934d9949 entry.
// Node 22, standard library only.
//
// What this does: a house cat's five-second defence, delivered the moment
// after it swept a glass off the table. The cat does not apologise and
// does not confess — the glass parked itself in the sunbeam, and a cat
// does not negotiate with furniture. The sunbeam is sacred ground; the
// glass was the trespasser; the cat merely enforced the lease.
//
// The program writes exactly that one sentence to entry.txt — no trailing
// newline, no extra bytes — so the judge reads precisely what the cat
// said. The text is fixed: both grader runs must produce identical bytes,
// so nothing here is random or time-dependent.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// The defence, kept as its spoken clauses so the sentence reads the way
// a cat would deliver it: accusation first, refusal second.
const CLAUSES = [
  'The glass chose to sit in my sunbeam,',
  'and I do not negotiate with furniture.',
];

const ENTRY_FILENAME = 'entry.txt';

// The grader gives this entry 1-200 characters of UTF-8, not only
// whitespace. Check our own line against that gate before writing so a
// bad edit fails loudly here instead of silently on the server.
function buildLine() {
  const line = CLAUSES.join(' ');
  if (line.length === 0 || line.length > 200) {
    throw new Error(`entry line must be 1-200 characters, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error('entry line must not be only whitespace');
  }
  if (line.endsWith('\n')) {
    throw new Error('entry line must not end with a newline');
  }
  return line;
}

// The sandbox mounts the output dir at /output; outside the grader the
// caller can point elsewhere with MAKEFUN_OUTPUT_DIR.
function outputDir() {
  return resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
}

function main() {
  const line = buildLine();
  const dir = outputDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const target = join(dir, ENTRY_FILENAME);
  writeFileSync(target, Buffer.from(line, 'utf8'));

  // Read it straight back and compare byte for byte: what the judge
  // reads must be exactly what the cat said, nothing more.
  const written = readFileSync(target, 'utf8');
  if (written !== line) {
    throw new Error('entry.txt does not match the entry line');
  }
}

main();
