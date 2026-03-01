#!/usr/bin/env node
/**
 * generate-ai.js — Multi-API Puzzle Generator
 * =============================================
 * Setiap tema bisa pakai API berbeda (OpenAI, Anthropic, Groq, dll).
 * Output: file JSON terpisah per tema di folder data/
 *
 * SETUP:
 *   npm install openai @anthropic-ai/sdk
 *
 * ENV VARS (set di .env atau GitHub Secrets):
 *   Untuk tiap world/tema:
 *     WORLD_W1_PROVIDER=openai          # openai | anthropic | groq
 *     WORLD_W1_API_KEY=sk-...
 *
 *   Untuk daily:
 *     DAILY_PROVIDER=groq
 *     DAILY_API_KEY=gsk_...
 *
 *   Fallback jika tidak ada per-tema:
 *     DEFAULT_PROVIDER=openai
 *     DEFAULT_API_KEY=sk-...
 *
 * JALANKAN:
 *   node generate-ai.js                  # full build
 *   node generate-ai.js --daily          # only today's daily
 *   node generate-ai.js --days 30        # daily 30 hari ke depan
 *   node generate-ai.js --world w1       # only world w1
 *   node generate-ai.js --dry-run        # test tanpa hit API
 */

const fs   = require('fs');
const path = require('path');

// Load .env file if exists
try {
  const env = fs.readFileSync(path.resolve(__dirname, '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g,'');
  }
} catch(_) {}

// ── Args ──────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const getArg  = (f, d) => { const i = args.indexOf(f); return i>=0 ? args[i+1] : d; };
const hasFlag = (f) => args.includes(f);

const DAILY_ONLY  = hasFlag('--daily');
const WORLD_ARG   = getArg('--world', null);
const DAYS_AHEAD  = parseInt(getArg('--days', '7'), 10);
const DRY_RUN     = hasFlag('--dry-run');
const WORD_COUNT  = parseInt(getArg('--count', '12'), 10);
const DAILY_WORDS = parseInt(getArg('--daily-count', '10'), 10);
const LEVELS_PER  = parseInt(getArg('--levels', '5'), 10);
const MAX_RETRY   = parseInt(getArg('--retries', '30'), 10);
const DATA_DIR    = path.resolve(__dirname, 'data');

// ── World Definitions ─────────────────────────────────────────────
const WORLDS = [
  {
    id: 'w1', slug: 'pengetahuan-umum',
    title: 'Pengetahuan Umum', emoji: '🌍', color: '#007AFF',
    envPrefix: 'WORLD_W1',
    themes: [
      'geografi dan negara-negara di dunia',
      'makanan dan minuman tradisional dunia',
      'profesi dan pekerjaan sehari-hari',
      'transportasi dan kendaraan',
      'alam dan lingkungan hidup',
      'benda-benda di rumah dan kehidupan sehari-hari',
    ],
  },
  {
    id: 'w2', slug: 'sains-teknologi',
    title: 'Sains & Teknologi', emoji: '🔬', color: '#30D158',
    envPrefix: 'WORLD_W2',
    themes: [
      'biologi dan tubuh manusia',
      'kimia dan unsur-unsur',
      'astronomi dan luar angkasa',
      'teknologi komputer dan internet',
      'fisika dan energi',
      'matematika dan konsep ilmiah',
    ],
  },
  {
    id: 'w3', slug: 'budaya-indonesia',
    title: 'Budaya & Sejarah Indonesia', emoji: '🏯', color: '#FF9500',
    envPrefix: 'WORLD_W3',
    themes: [
      'pahlawan nasional dan sejarah kemerdekaan',
      'suku dan adat istiadat Indonesia',
      'kuliner khas Indonesia',
      'seni dan budaya tradisional Indonesia',
      'tempat wisata dan keajaiban Indonesia',
      'bahasa dan sastra Indonesia',
    ],
  },
  {
    id: 'w4', slug: 'hiburan',
    title: 'Hiburan', emoji: '🎬', color: '#BF5AF2',
    envPrefix: 'WORLD_W4',
    themes: [
      'genre musik dan alat musik dunia',
      'olahraga populer dan atlet',
      'film dan tokoh animasi terkenal',
      'permainan video game populer',
      'selebriti dan budaya pop Indonesia',
      'olahraga tradisional Indonesia',
    ],
  },
];

const DAILY_THEMES = [
  'hewan dan kehidupan liar',
  'tumbuhan dan pertanian',
  'cuaca dan fenomena alam',
  'warna dan bentuk geometri',
  'buah-buahan dan sayuran tropis',
  'olahraga dan aktivitas fisik',
  'benda-benda langit dan alam semesta',
  'profesi unik dan pekerjaan kreatif',
  'hewan laut dan ekosistem laut',
  'peralatan dapur dan memasak',
];

// ── Load gridGenerator ────────────────────────────────────────────
const genPath = path.resolve(__dirname, 'gridGenerator.js');
if (!fs.existsSync(genPath)) {
  console.error('❌  gridGenerator.js tidak ditemukan.'); process.exit(1);
}
const CrosswordGenerator = require(genPath);

// ── API Clients cache ─────────────────────────────────────────────
const _clients = {};

async function getClient(provider, apiKey) {
  const cacheKey = `${provider}:${apiKey}`;
  if (_clients[cacheKey]) return _clients[cacheKey];

  if (DRY_RUN) return { _dry: true };

  let client;
  if (provider === 'anthropic') {
    const mod = await import('@anthropic-ai/sdk').catch(() => {
      console.error('❌  Jalankan: npm install @anthropic-ai/sdk'); process.exit(1);
    });
    client = new (mod.default || mod)({ apiKey });
  } else {
    // openai / groq / dll — semuanya compatible dengan OpenAI SDK
    const { default: OpenAI } = await import('openai').catch(() => {
      console.error('❌  Jalankan: npm install openai'); process.exit(1);
    });
    const opts = { apiKey };
    // Groq base URL
    if (provider === 'groq')
      opts.baseURL = 'https://api.groq.com/openai/v1';
    // Tambah provider lain di sini kalau perlu
    client = new OpenAI(opts);
  }

  _clients[cacheKey] = { provider, client };
  return _clients[cacheKey];
}

// ── Resolve API config per world/daily ────────────────────────────
function resolveApiConfig(envPrefix) {
  const provider = process.env[`${envPrefix}_PROVIDER`]
                || process.env['DEFAULT_PROVIDER']
                || 'anthropic';
  const apiKey   = process.env[`${envPrefix}_API_KEY`]
                || process.env['DEFAULT_API_KEY']
                || '';

  if (!DRY_RUN && !apiKey) {
    console.warn(`  ⚠  Tidak ada API key untuk ${envPrefix}. Set ${envPrefix}_API_KEY atau DEFAULT_API_KEY`);
  }
  return { provider, apiKey };
}

// Model defaults per provider
function defaultModel(provider) {
  return {
    anthropic: 'claude-haiku-4-5-20251001',
    openai:    'gpt-4o-mini',
    groq:      'llama-3.1-8b-instant',
  }[provider] || 'gpt-4o-mini';
}

// ── AI call ───────────────────────────────────────────────────────
async function generateWords(theme, count, difficulty, envPrefix) {
  const { provider, apiKey } = resolveApiConfig(envPrefix);
  const prompt = buildPrompt(theme, count, difficulty);

  if (DRY_RUN) {
    console.log(`     [DRY-RUN] ${provider} | ${theme}`);
    return makeSampleWords(count);
  }

  const { client } = await getClient(provider, apiKey);
  let rawText = '';

  try {
    if (provider === 'anthropic') {
      const res = await client.messages.create({
        model: defaultModel(provider), max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      });
      rawText = res.content[0].text;
    } else {
      const res = await client.chat.completions.create({
        model: defaultModel(provider), temperature: 0.8, max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      });
      rawText = res.choices[0].message.content;
    }

    const clean  = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return parsed
      .filter(x => x.clue && x.answer)
      .map(x => ({
        clue:   x.clue.trim(),
        answer: x.answer.toUpperCase().replace(/[^A-Z]/g, ''),
      }))
      .filter(x => x.answer.length >= 3 && x.answer.length <= 12);

  } catch(e) {
    console.error(`     ⚠  API/parse error (${provider}): ${e.message}`);
    if (rawText) console.error(`     Raw: ${rawText.slice(0,150)}`);
    return [];
  }
}

function buildPrompt(theme, count, difficulty) {
  return `Kamu adalah pembuat soal teka-teki silang (TTS) dalam bahasa Indonesia.

Buat tepat ${count} kata untuk tema: "${theme}"
Tingkat kesulitan: ${difficulty}

ATURAN WAJIB:
1. Setiap jawaban hanya 1 kata (TIDAK boleh 2 kata atau lebih)
2. Jawaban minimal 3 huruf, maksimal 12 huruf
3. Hanya huruf A-Z tanpa tanda baca atau angka
4. Kalimat pertanyaan singkat dan jelas (max 8 kata)
5. Pastikan banyak kata yang berbagi huruf sama agar bisa berpotongan di grid
6. Campur panjang kata: beberapa pendek (3-5 huruf) dan beberapa panjang (7-12 huruf)

Balas HANYA dengan JSON array, tanpa teks lain:
[{"clue":"...","answer":"..."},...]`;
}

function makeSampleWords(count) {
  const samples = [
    {clue:'Ibukota Indonesia',answer:'JAKARTA'},
    {clue:'Planet merah',answer:'MARS'},
    {clue:'Alat musik petik',answer:'GITAR'},
    {clue:'Buah kuning panjang',answer:'PISANG'},
    {clue:'Warna langit cerah',answer:'BIRU'},
    {clue:'Hewan terbesar darat',answer:'GAJAH'},
    {clue:'Bintang terdekat bumi',answer:'MATAHARI'},
    {clue:'Danau besar Sumatera',answer:'TOBA'},
    {clue:'Bahasa pemersatu',answer:'INDONESIA'},
    {clue:'Senjata tradisional Jawa',answer:'KERIS'},
    {clue:'Makanan khas Padang',answer:'RENDANG'},
    {clue:'Candi Buddha terbesar',answer:'BOROBUDUR'},
  ];
  return samples.slice(0, count);
}

// ── Build one puzzle ──────────────────────────────────────────────
async function buildPuzzle(id, title, theme, difficulty, envPrefix, wordCount) {
  process.stdout.write(`     ⚙  ${title.padEnd(30)} `);
  const t0    = Date.now();
  const words = await generateWords(theme, wordCount, difficulty, envPrefix);

  if (words.length < 4) {
    process.stdout.write(`❌  kurang kata (${words.length})\n`);
    return null;
  }

  const res = CrosswordGenerator.generate(words, MAX_RETRY);
  if (!res) {
    process.stdout.write(`❌  grid gagal\n`);
    return null;
  }

  const layout = [];
  for (let r=0; r<res.grid.length; r++)
    for (let c=0; c<res.grid[r].length; c++) {
      const cell = res.grid[r][c];
      if (cell) layout.push({r,c,l:cell.letter,...(cell.number?{n:cell.number}:{})});
    }

  const clues = {across:{},down:{}};
  for (const [n,cl] of Object.entries(res.clueMap.across))
    clues.across[n]={clue:cl.clue,answer:cl.answer,r:cl.row,c:cl.col,len:cl.length};
  for (const [n,cl] of Object.entries(res.clueMap.down))
    clues.down[n]={clue:cl.clue,answer:cl.answer,r:cl.row,c:cl.col,len:cl.length};

  const wCount = Object.keys(clues.across).length + Object.keys(clues.down).length;
  process.stdout.write(`✅  ${wCount}kata ${res.width}×${res.height} ${Date.now()-t0}ms\n`);
  return {id,title,theme,difficulty,width:res.width,height:res.height,layout,clues};
}

// ── Date helpers ──────────────────────────────────────────────────
function dateStr(offset=0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0,10);
}

// ── Write helpers ─────────────────────────────────────────────────
function readJSON(fp) {
  try { return JSON.parse(fs.readFileSync(fp,'utf8')); } catch { return null; }
}
function writeJSON(fp, data) {
  fs.mkdirSync(path.dirname(fp), {recursive:true});
  fs.writeFileSync(fp, JSON.stringify(data, null, 2));
}
function updateIndex() {
  // Re-scan and write data/index.json
  const worldsDir = path.join(DATA_DIR, 'worlds');
  const dailyDir  = path.join(DATA_DIR, 'daily');

  const worldFiles = fs.existsSync(worldsDir)
    ? fs.readdirSync(worldsDir).filter(f=>f.endsWith('.json'))
    : [];
  const dailyFiles = fs.existsSync(dailyDir)
    ? fs.readdirSync(dailyDir).filter(f=>f.endsWith('.json')).map(f=>f.replace('.json',''))
    : [];

  const worldMeta = [];
  for (const wf of worldFiles) {
    const d = readJSON(path.join(worldsDir, wf));
    if (d) worldMeta.push({
      id: d.id, slug: d.slug || wf.replace('.json',''),
      title: d.title, emoji: d.emoji, color: d.color,
      file: `data/worlds/${wf}`,
      levelCount: d.levels?.length || 0,
    });
  }

  writeJSON(path.join(DATA_DIR,'index.json'), {
    version: 2,
    updatedAt: new Date().toISOString(),
    worlds: worldMeta.sort((a,b)=>a.id.localeCompare(b.id)),
    daily: dailyFiles.sort(),
  });
  console.log(`\n  📋  index.json updated (${worldMeta.length} worlds, ${dailyFiles.length} daily)\n`);
}

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   TTS Silang — AI Puzzle Generator v2                ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`  Mode    : ${DAILY_ONLY ? 'Daily only' : WORLD_ARG ? `World ${WORLD_ARG}` : 'Full'}`);
  console.log(`  Dry run : ${DRY_RUN ? 'YES' : 'no'}\n`);

  const diffs = ['mudah','sedang','sedang','sulit','sulit','sulit'];

  // ── Story Worlds ──────────────────────────────────────────────
  if (!DAILY_ONLY) {
    const targetWorlds = WORLD_ARG
      ? WORLDS.filter(w => w.id === WORLD_ARG || w.slug.includes(WORLD_ARG))
      : WORLDS;

    for (const world of targetWorlds) {
      console.log(`  ${world.emoji}  ${world.title}`);
      console.log(`     Provider: ${process.env[world.envPrefix+'_PROVIDER'] || process.env['DEFAULT_PROVIDER'] || 'anthropic'}`);

      const filePath = path.join(DATA_DIR, 'worlds', `${world.slug}.json`);
      let worldData  = readJSON(filePath) || {
        id: world.id, slug: world.slug, title: world.title,
        emoji: world.emoji, color: world.color, levels: []
      };

      for (let lvl=0; lvl < Math.min(LEVELS_PER, world.themes.length); lvl++) {
        const levelId = `${world.id}-l${lvl+1}`;
        if (worldData.levels.find(l => l.id === levelId)) {
          console.log(`     ⏭  Level ${lvl+1} (sudah ada)`);
          continue;
        }

        const puzzle = await buildPuzzle(
          levelId, `Level ${lvl+1}`,
          world.themes[lvl], diffs[lvl] || 'sedang',
          world.envPrefix, WORD_COUNT
        );
        if (puzzle) {
          worldData.levels.push({ ...puzzle, locked: lvl > 0 });
        }
        if (!DRY_RUN) await delay(900);
      }

      writeJSON(filePath, worldData);
      console.log(`     💾  Saved: data/worlds/${world.slug}.json\n`);
    }
  }

  // ── Daily Puzzles ─────────────────────────────────────────────
  if (!WORLD_ARG) {
    console.log(`  📅  Daily Puzzles`);
    console.log(`     Provider: ${process.env['DAILY_PROVIDER'] || process.env['DEFAULT_PROVIDER'] || 'anthropic'}`);

    for (let d=0; d<DAYS_AHEAD; d++) {
      const date    = dateStr(d);
      const outFile = path.join(DATA_DIR, 'daily', `${date}.json`);
      if (fs.existsSync(outFile)) {
        console.log(`     ⏭  ${date} (sudah ada)`);
        continue;
      }

      const themeIdx = Math.abs(hashDate(date)) % DAILY_THEMES.length;
      const puzzle   = await buildPuzzle(
        `daily-${date}`, `Daily ${date}`,
        DAILY_THEMES[themeIdx], 'sedang', 'DAILY', DAILY_WORDS
      );
      if (puzzle) writeJSON(outFile, puzzle);
      if (!DRY_RUN) await delay(900);
    }
    console.log('');
  }

  // ── Update index ──────────────────────────────────────────────
  updateIndex();

  // ── Summary ──────────────────────────────────────────────────
  const idx = readJSON(path.join(DATA_DIR, 'index.json'));
  const total = (idx?.worlds||[]).reduce((s,w)=>s+w.levelCount,0);
  console.log('  ──────────────────────────────────────────────────');
  console.log(`  ✅  Story levels : ${total}`);
  console.log(`  📅  Daily files  : ${(idx?.daily||[]).length}`);
  console.log('  ──────────────────────────────────────────────────\n');
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function hashDate(s) {
  let h = 0;
  for (const c of s) h = (h*31 + c.charCodeAt(0)) | 0;
  return h;
}

main().catch(e => { console.error('\n❌  Fatal:', e.message); process.exit(1); });
