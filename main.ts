// u-po-pu-five-seconds-to-explain-the-glass-934d9949 entry (Node 22, standard library only).
// Writes exactly one sentence to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR/entry.txt outside the grader).
// No trailing newline: the judge reads exactly the bytes written.
// Gate: the file must be UTF-8, 1-200 characters, not only whitespace,
// and both grader runs must write the same bytes — so the line is a fixed
// string, never random, never generated at runtime.
//
// The line: a house cat's defence, five seconds after sweeping a glass off
// the table. No apology, no confession — the cat blames the glass for
// occupying its sunbeam and refuses to negotiate with furniture. Cat logic
// through and through: the sunbeam is sacred territory, the glass was the
// trespasser, and the cat's only crime was enforcing the lease.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  'The glass chose to sit in my sunbeam, and I do not negotiate with furniture.';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'entry.txt'), LINE, 'utf8');
