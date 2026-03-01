#!/usr/bin/env node
/**
 * build-puzzles.js
 * Baca questions.json → generate semua puzzle → tulis puzzles.json
 * 
 * Cara pakai:
 *   node build-puzzles.js
 *   node build-puzzles.js --input soal_baru.json
 *   node build-puzzles.js --out output/puzzles.json
 */

const fs   = require('fs');
const path = require('path');

// ─── Parse argumen ─────────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(flag, def) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : def;
}
const inputFile  = getArg('--input',  'questions.json');
const outputFile = getArg('--out',    'puzzles.json');
const maxRetries = parseInt(getArg('--retries', '30'), 10);

// ─── Load gridGenerator via require ────────────────────────────────────
const genPath = path.resolve(__dirname, 'gridGenerator.js');
if (!fs.existsSync(genPath)) {
  console.error('❌  gridGenerator.js tidak ditemukan.');
  process.exit(1);
}
const CrosswordGenerator = require(genPath);

// ─── Load questions ─────────────────────────────────────────────────────
const qPath = path.resolve(__dirname, inputFile);
if (!fs.existsSync(qPath)) {
  console.error(`❌  ${inputFile} tidak ditemukan.`);
  process.exit(1);
}
const { puzzles: questions } = JSON.parse(fs.readFileSync(qPath, 'utf8'));

console.log('\n╔══════════════════════════════════════════════╗');
console.log('║       TTS Silang — Puzzle Builder            ║');
console.log('╚══════════════════════════════════════════════╝\n');
console.log(`  Input  : ${inputFile}`);
console.log(`  Output : ${outputFile}`);
console.log(`  Puzzle : ${questions.length} ditemukan`);
console.log(`  Retry  : ${maxRetries}x per puzzle\n`);

// ─── Generate ───────────────────────────────────────────────────────────
const built  = [];
const failed = [];
const tStart = Date.now();

for (const puz of questions) {
  process.stdout.write(`  ⚙  ${puz.title.padEnd(28)} `);
  const t0  = Date.now();
  let res;
  try {
    res = CrosswordGenerator.generate(puz.words, maxRetries);
  } catch (e) {
    process.stdout.write(`❌  ERROR: ${e.message}\n`);
    failed.push(puz.title);
    continue;
  }

  const ms = Date.now() - t0;
  if (!res) {
    process.stdout.write(`❌  gagal ditempatkan (${ms}ms)\n`);
    failed.push(puz.title);
    continue;
  }

  // Compact layout
  const layout = [];
  for (let r = 0; r < res.grid.length; r++) {
    for (let c = 0; c < res.grid[r].length; c++) {
      const cell = res.grid[r][c];
      if (!cell) continue;
      const entry = { r, c, l: cell.letter };
      if (cell.number) entry.n = cell.number;
      layout.push(entry);
    }
  }

  // Compact clues
  const clues = { across: {}, down: {} };
  for (const [num, cl] of Object.entries(res.clueMap.across))
    clues.across[num] = { clue: cl.clue, answer: cl.answer, r: cl.row, c: cl.col, len: cl.length };
  for (const [num, cl] of Object.entries(res.clueMap.down))
    clues.down[num]   = { clue: cl.clue, answer: cl.answer, r: cl.row, c: cl.col, len: cl.length };

  const wCount = Object.keys(clues.across).length + Object.keys(clues.down).length;
  built.push({ id: puz.id, title: puz.title, difficulty: puz.difficulty || 'easy',
               width: res.width, height: res.height, layout, clues });

  process.stdout.write(`✅  ${wCount} kata  grid ${res.width}×${res.height}  ${ms}ms\n`);
}

// ─── Tulis output ───────────────────────────────────────────────────────
const outPath = path.resolve(__dirname, outputFile);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ puzzles: built }, null, 2));
const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);

// ─── Summary ─────────────────────────────────────────────────────────
const totalMs = Date.now() - tStart;
console.log('\n  ──────────────────────────────────────────────');
console.log(`  ✅  Berhasil : ${built.length}/${questions.length} puzzle`);
console.log(`  📦  File     : ${outputFile} (${sizeKB} KB)`);
console.log(`  ⏱   Total    : ${totalMs}ms`);
if (failed.length) {
  console.log(`\n  ❌  Gagal (${failed.length}):`);
  failed.forEach(t => console.log(`     - ${t}`));
  console.log('\n  Tips: Pastikan minimal 2 kata punya huruf yang sama.');
  console.log('        Coba tambah --retries 50 untuk usaha lebih keras.');
}
console.log('  ──────────────────────────────────────────────\n');
