/* =========================
   PBJ LANJUT – AKSARA JAWA → LATIN
   FIXED & RELEASE READY
========================= */

const REVERSE_AKSARA = Object.fromEntries(
  Object.entries(AKSARA).map(([k, v]) => [v, k])
);

const REVERSE_SANDHANGAN = Object.fromEntries(
  Object.entries(SANDHANGAN).map(([k, v]) => [v, k])
);

const REVERSE_ANGKA = Object.fromEntries(
  Object.entries(ANGKA_JAWA).map(([k, v]) => [v, k])
);

const REVERSE_PANYIGEG = {
  'ꦁ': 'ng',
  'ꦂ': 'r',
  'ꦃ': 'h'
};

// sandhangan bisa multi-char (contoh: ꦺꦴ)
const SANDHANGAN_KEYS = Object.keys(REVERSE_SANDHANGAN)
  .sort((a, b) => b.length - a.length);

function jawaToLatin(text) {
  let out = '';
  let i = 0;

  while (i < text.length) {
    const c = text[i];

    /* =========================
       ANGKA JAWA
    ========================= */
    if (c === PADA_PANGKAT) {
      i++;
      while (i < text.length && text[i] !== PADA_PANGKAT) {
        out += REVERSE_ANGKA[text[i]] ?? '';
        i++;
      }
      i++; // skip penutup
      continue;
    }

    /* =========================
       PANYIGEG
    ========================= */
    if (REVERSE_PANYIGEG[c]) {
      out += REVERSE_PANYIGEG[c];
      i++;
      continue;
    }

    /* =========================
       PASANGAN (pangkon + aksara)
    ========================= */
    if (c === PANGKON && REVERSE_AKSARA[text[i + 1]]) {
      out += REVERSE_AKSARA[text[i + 1]];
      i += 2;
      continue;
    }

    /* =========================
       AKSARA LEGENA
    ========================= */
    if (REVERSE_AKSARA[c]) {
      const next = text[i + 1];

      // jika diikuti pangkon → konsonan mati (jangan tambah 'a')
      if (next === PANGKON) {
        out += REVERSE_AKSARA[c];
        i++;
        continue;
      }

      // cek sandhangan (multi-char dulu)
      let foundSandhangan = null;
      for (const key of SANDHANGAN_KEYS) {
        if (text.slice(i + 1, i + 1 + key.length) === key) {
          foundSandhangan = key;
          break;
        }
      }

      out += REVERSE_AKSARA[c];

      if (foundSandhangan) {
        out += REVERSE_SANDHANGAN[foundSandhangan];
        i += 1 + foundSandhangan.length;
      } else {
        // vokal implisit
        out += 'a';
        i++;
      }
      continue;
    }

    /* =========================
       SPASI & TANDA BACA
    ========================= */
    if (/\s/.test(c)) {
      out += ' ';
    } else {
      out += c; // tanda baca / simbol
    }

    i++;
  }

  return out.replace(/\s+/g, ' ').trim();
}

window.jawaToLatin = jawaToLatin;