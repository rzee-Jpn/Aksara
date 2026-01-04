/* =========================
   AKSARA JAWA → LATIN
   (reverse transliteration)
========================= */

// balik mapping
const REVERSE_AKSARA = Object.fromEntries(
  Object.entries(AKSARA).map(([k, v]) => [v, k])
);

const REVERSE_PASANGAN = Object.fromEntries(
  Object.entries(PASANGAN).map(([k, v]) => [v, k])
);

const REVERSE_SANDHANGAN = Object.fromEntries(
  Object.entries(SANDHANGAN).map(([k, v]) => [v, k])
);

const REVERSE_PANYIGEG = {
  'ꦁ': 'ng',
  'ꦂ': 'r',
  'ꦃ': 'h'
};

const REVERSE_SWARA = Object.fromEntries(
  Object.entries(SWARA).map(([k, v]) => [v, k])
);

const REVERSE_ANGKA = Object.fromEntries(
  Object.entries(ANGKA_JAWA).map(([k, v]) => [v, k])
);

const PADA_PANGKAT = '꧇';

/* =========================
   FUNGSI INTI
========================= */

function jawaToLatin(text){
  let out = '';
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    // spasi
    if (ch === ' ') {
      out += ' ';
      i++;
      continue;
    }

    // angka Jawa
    if (ch === PADA_PANGKAT) {
      i++;
      let num = '';
      while (text[i] && text[i] !== PADA_PANGKAT) {
        if (REVERSE_ANGKA[text[i]]) {
          num += REVERSE_ANGKA[text[i]];
        }
        i++;
      }
      out += num;
      i++; // lewati pada pangkat penutup
      continue;
    }

    // swara (vokal mandiri)
    if (REVERSE_SWARA[ch]) {
      out += REVERSE_SWARA[ch];
      i++;
      continue;
    }

    // panyigeg wanda
    if (REVERSE_PANYIGEG[ch]) {
      out += REVERSE_PANYIGEG[ch];
      i++;
      continue;
    }

    // pasangan (format: ꧀ + aksara)
    if (ch === '꧀' && REVERSE_AKSARA[text[i+1]]) {
      out += REVERSE_AKSARA[text[i+1]];
      i += 2;
      continue;
    }

    // aksara legena
    if (REVERSE_AKSARA[ch]) {
      let latin = REVERSE_AKSARA[ch];
      let next = text[i+1];

      // sandhangan vokal
      if (REVERSE_SANDHANGAN[next]) {
        out += latin + REVERSE_SANDHANGAN[next];
        i += 2;
      } else {
        // vokal implisit "a"
        out += latin + 'a';
        i += 1;
      }
      continue;
    }

    // sandhangan berdiri sendiri (fallback)
    if (REVERSE_SANDHANGAN[ch]) {
      out += REVERSE_SANDHANGAN[ch];
      i++;
      continue;
    }

    // karakter lain (abaikan)
    i++;
  }

  return out.replace(/\s+/g, ' ').trim();
}