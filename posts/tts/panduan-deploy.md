# 📋 Panduan Deploy ke GitHub Pages + Groq API

## Tentang Groq

**Ya, Groq bisa digunakan sepenuhnya.** Generate-ai.js sudah mendukung Groq melalui paket `openai` (Groq menggunakan API yang kompatibel dengan OpenAI). Tidak perlu SDK tambahan.

Model default Groq yang dipakai: `llama-3.1-8b-instant` (gratis, cepat).

---

## Langkah 1 — Buat Repository di GitHub

1. Buka [github.com](https://github.com) → **New repository**
2. Nama repo bebas, contoh: `tts-silang`
3. Set ke **Public** (wajib untuk GitHub Pages gratis)
4. Jangan centang "Initialize with README"
5. Klik **Create repository**

---

## Langkah 2 — Upload Kode

Di terminal lokal kamu:

```bash
cd folder-project-kamu
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

---

## Langkah 3 — Aktifkan GitHub Pages

1. Buka repository di GitHub
2. Klik tab **Settings** → sidebar kiri **Pages**
3. **Source**: pilih `Deploy from a branch`
4. **Branch**: pilih `main`, folder `/` (root)
5. Klik **Save**
6. Tunggu 1–2 menit → URL game kamu akan muncul, contoh:
   `https://USERNAME.github.io/NAMA-REPO/`

---

## Langkah 4 — Pasang API Key Groq

### 4a. Dapat API Key Groq

1. Daftar/login di [console.groq.com](https://console.groq.com)
2. Masuk ke menu **API Keys** → **Create API Key**
3. Copy key-nya (diawali dengan `gsk_...`)

### 4b. Simpan API Key sebagai GitHub Secret

> **Jangan pernah simpan API key langsung di kode!**

1. Buka repository GitHub kamu
2. Klik **Settings** → sidebar kiri **Secrets and variables** → **Actions**
3. Klik **New repository secret**

Tambahkan secret berikut:

| Name | Value | Keterangan |
|------|-------|-----------|
| `DEFAULT_API_KEY` | `gsk_xxxxxxxxxxxxx` | API key Groq kamu |

### 4c. Set Variable Provider

Masih di halaman yang sama, klik tab **Variables** → **New repository variable**:

| Name | Value |
|------|-------|
| `DEFAULT_PROVIDER` | `groq` |

### 4d. (Opsional) Per-World API Key Berbeda

Kalau ingin setiap world pakai key berbeda:

| Secret | Variable |
|--------|----------|
| `WORLD_W1_API_KEY` = `gsk_...` | `WORLD_W1_PROVIDER` = `groq` |
| `WORLD_W2_API_KEY` = `gsk_...` | `WORLD_W2_PROVIDER` = `groq` |
| `WORLD_W3_API_KEY` = `gsk_...` | `WORLD_W3_PROVIDER` = `groq` |
| `WORLD_W4_API_KEY` = `gsk_...` | `WORLD_W4_PROVIDER` = `groq` |
| `DAILY_API_KEY` = `gsk_...`    | `DAILY_PROVIDER` = `groq`    |

Kalau tidak di-set, semua world akan pakai `DEFAULT_API_KEY` dan `DEFAULT_PROVIDER`.

---

## Langkah 5 — Jalankan GitHub Actions

### Generate Daily Puzzle (otomatis tiap hari)

Workflow `daily.yml` sudah terjadwal otomatis jam **00:00 WIB** (17:00 UTC).

Untuk jalankan manual:
1. Klik tab **Actions** di repository
2. Pilih workflow **🎯 Generate Daily Puzzle**
3. Klik **Run workflow** → isi parameter jika perlu → **Run workflow**

### Generate Semua World (manual)

1. Klik tab **Actions**
2. Pilih workflow **🌍 Full Story Build**
3. Klik **Run workflow**
4. Isi:
   - **World ID**: kosongkan untuk semua, atau isi `w1`/`w2`/`w3`/`w4`
   - **Level per world**: default 5
   - **Dry run**: centang untuk test tanpa hit API
5. Klik **Run workflow**

---

## Langkah 6 — Verifikasi

Setelah workflow selesai:

1. Buka tab **Actions** → pastikan workflow berhasil (centang hijau ✅)
2. Cek folder `data/` di repo → harus ada file `.json` baru
3. Buka URL game kamu → daily puzzle dan level sudah tersedia

---

## Troubleshooting

### ❌ Workflow gagal: "Cannot find module 'openai'"
→ Pastikan step **Install dependencies** berhasil. Cek log workflow.

### ❌ Puzzle tidak muncul di game
→ Pastikan file `data/index.json` sudah terupdate setelah generate.

### ❌ API error dari Groq
→ Cek apakah `DEFAULT_API_KEY` sudah diset dengan benar di Secrets.
→ Cek apakah key Groq masih aktif di [console.groq.com](https://console.groq.com).

### ❌ Daily puzzle tidak generate otomatis
→ GitHub Actions schedule bisa delay sampai beberapa jam. Jalankan manual dulu untuk test.

### ❌ "Permission denied" saat commit
→ Pastikan workflow punya permission `contents: write` (sudah ada di kedua yml).

---

## Struktur File Setelah Deploy

```
data/
├── index.json              ← daftar worlds & tanggal daily
├── daily/
│   ├── 2026-03-02.json     ← puzzle hari ini
│   └── 2026-03-03.json     ← puzzle besok
└── worlds/
    ├── pengetahuan-umum.json
    ├── sains-teknologi.json
    ├── budaya-indonesia.json
    └── hiburan.json
```

---

## Ganti Provider ke OpenAI atau Claude

Cukup ubah variable `DEFAULT_PROVIDER`:

| Provider | Variable Value | Secret Format |
|----------|---------------|---------------|
| Groq | `groq` | `gsk_...` |
| OpenAI | `openai` | `sk-...` |
| Claude (Anthropic) | `anthropic` | `sk-ant-...` |

Tidak perlu ubah kode apapun.
