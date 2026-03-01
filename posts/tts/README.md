# TTS Silang — Crossword Engine

## Struktur File

```
crossword-engine/
├── data/
│   ├── index.json              ← manifest (daftar semua file)
│   ├── worlds/
│   │   ├── pengetahuan-umum.json
│   │   ├── sains-teknologi.json
│   │   ├── budaya-indonesia.json
│   │   └── hiburan.json
│   └── daily/
│       ├── 2025-03-01.json
│       ├── 2025-03-02.json
│       └── ...
├── .github/
│   └── workflows/
│       ├── daily.yml           ← auto-generate tiap hari (jam 00:00 WIB)
│       └── full-build.yml      ← generate semua level (manual)
├── generate-ai.js              ← AI generator (multi-provider)
├── build-puzzles.js            ← generator manual dari questions.json
├── gridGenerator.js            ← engine grid (jangan diedit)
├── .env.example                ← template API keys
└── ...
```

---

## Quick Start

### 1. Setup API Key
```bash
cp .env.example .env
# Edit .env, isi API key kamu
```

### 2. Install dependencies
```bash
npm install openai @anthropic-ai/sdk
# Kalau pakai Groq, pakai package openai juga (compatible)
```

### 3. Generate puzzle
```bash
# Daily saja (hari ini + 7 hari ke depan):
node generate-ai.js --daily

# Semua world + daily:
node generate-ai.js

# Test tanpa hit API:
node generate-ai.js --dry-run
```

---

## Multi-API Per Tema

Setiap world dan daily bisa pakai API berbeda. Konfigurasi di `.env`:

| Variable | Contoh nilai |
|----------|-------------|
| `DEFAULT_PROVIDER` | `anthropic` / `openai` / `groq` |
| `WORLD_W1_API_KEY` | API key untuk Pengetahuan Umum |
| `WORLD_W2_API_KEY` | API key untuk Sains & Teknologi |
| `WORLD_W3_API_KEY` | API key untuk Budaya Indonesia |
| `WORLD_W4_API_KEY` | API key untuk Hiburan |
| `DAILY_API_KEY`    | API key untuk Daily Puzzle |

> **Groq gratis** dan cepat: https://console.groq.com

---

## GitHub Actions — Auto Daily

### Setup Secrets di GitHub
```
Repository → Settings → Secrets and variables → Actions
```

Tambahkan secrets:
- `DEFAULT_API_KEY` — API key utama (wajib)
- `DAILY_API_KEY` — khusus daily (opsional, fallback ke DEFAULT)
- `WORLD_W1_API_KEY`, `WORLD_W2_API_KEY`, dst (opsional)

Tambahkan variables:
- `DEFAULT_PROVIDER` = `anthropic` / `openai` / `groq`
- `DAILY_PROVIDER` = provider untuk daily

### Setelah deploy, workflow jalan otomatis:
- **Tiap hari 00:00 WIB** → generate daily puzzle baru → auto commit
- **Manual trigger** → bisa generate world tertentu atau semua

---

## Deploy ke GitHub Pages
```bash
git init
git add .
git commit -m "TTS Silang v3"
git remote add origin https://github.com/USERNAME/tts-silang.git
git push -u origin main
# Settings → Pages → Deploy from main / root
```

---

## Tambah Puzzle Manual

Edit `questions.json` lalu:
```bash
node build-puzzles.js
```

Tapi setelah ini harus update `data/index.json` juga:
```bash
node generate-ai.js --dry-run  # ini rebuild index tanpa hit API
```
