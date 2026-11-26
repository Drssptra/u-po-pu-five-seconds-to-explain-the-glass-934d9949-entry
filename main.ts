// Five Seconds to Explain the Glass — u-po-pu-five-seconds-to-explain-the-glass-934d9949
// Node 22, standard library only.
//
// The scene: a house cat has just swept a glass off the table and has
// five seconds to explain itself. The cat's position is that it did
// nothing wrong — the glass put itself in the sunbeam, and a cat does
// not take orders from furniture. No apology, no confession, just the
// defence, delivered in one breath.
//
// This program writes that one sentence to entry.txt: exactly the
// sentence, no trailing newline, no extra bytes. The sentence is fixed
// text, so both grader runs produce byte-identical output.

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// The defence, spoken in two beats: the accusation, then the refusal.
const FIRST_BEAT = 'The glass chose to sit in my sunbeam,';
const SECOND_BEAT = 'and I do not negotiate with furniture.';

const OUTPUT_FILE = 'entry.txt';
const MAX_CHARS = 200;

// Join the beats into the single sentence the judge will read.
function composeDefence() {
  return `${FIRST_BEAT} ${SECOND_BEAT}`;
}

// The sealed scorer only accepts UTF-8 text of 1 to 200 characters
// that is not only whitespace. Fail here, loudly, if our own sentence
// ever stops meeting that gate — better than failing on the server.
function gate(sentence: string) {
  const problems: string[] = [];
  if (sentence.length < 1 || sentence.length > MAX_CHARS) {
    problems.push(`length ${sentence.length} is outside 1-${MAX_CHARS}`);
  }
  if (sentence.trim().length === 0) {
    problems.push('sentence is only whitespace');
  }
  if (sentence.includes('\n')) {
    problems.push('sentence contains a newline');
  }
  if (problems.length > 0) {
    throw new Error(`entry sentence fails the gate: ${problems.join('; ')}`);
  }
  return sentence;
}

// The grader mounts the output directory at /output. Locally, point
// MAKEFUN_OUTPUT_DIR somewhere else to try the entry out.
function outputDirectory() {
  return resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
}

function main() {
  const sentence = gate(composeDefence());
  const dir = outputDirectory();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const target = join(dir, OUTPUT_FILE);
  const bytes = Buffer.from(sentence, 'utf8');
  writeFileSync(target, bytes);
  verifyWritten(target, sentence, bytes);
}

// Prove the file holds exactly what the cat said: same byte count,
// same bytes, and decoding those bytes gives back the sentence —
// nothing added, nothing lost, by the write.
function verifyWritten(target: string, sentence: string, bytes: Buffer) {
  const size = statSync(target).size;
  if (size !== bytes.length) {
    throw new Error(`entry.txt is ${size} bytes, expected ${bytes.length}`);
  }
  const written = readFileSync(target);
  if (!written.equals(bytes)) {
    throw new Error('entry.txt bytes do not match the entry sentence');
  }
  if (written.toString('utf8') !== sentence) {
    throw new Error('entry.txt does not decode back to the entry sentence');
  }
}

main();
