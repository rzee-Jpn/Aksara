/* =========================
   PBJ LANJUT – AKSARA → LATIN
========================= */

const REVERSE_AKSARA = Object.fromEntries(
  Object.entries(AKSARA).map(([k,v]) => [v,k])
);

const REVERSE_SANDHANGAN = Object.fromEntries(
  Object.entries(SANDHANGAN).map(([k,v]) => [v,k])
);

const REVERSE_ANGKA = Object.fromEntries(
  Object.entries(ANGKA_JAWA).map(([k,v]) => [v,k])
);

const REVERSE_PANYIGEG = {
  'ꦁ':'ng',
  'ꦂ':'r',
  'ꦃ':'h'
};

function jawaToLatin(text){
  let out = '';
  let i = 0;

  while (i < text.length) {
    const c = text[i];

    // ANGKA
    if (c === PADA_PANGKAT) {
      i++;
      while (text[i] !== PADA_PANGKAT && i < text.length) {
        out += REVERSE_ANGKA[text[i]] || '';
        i++;
      }
      i++;
      continue;
    }

    // PANYIGEG
    if (REVERSE_PANYIGEG[c]) {
      out += REVERSE_PANYIGEG[c];
      i++;
      continue;
    }

    // PASANGAN
    if (c === PANGKON && REVERSE_AKSARA[text[i+1]]) {
      out += REVERSE_AKSARA[text[i+1]];
      i += 2;
      continue;
    }

    // AKSARA LEGENA
    if (REVERSE_AKSARA[c]) {
      const next = text[i+1];
      out += REVERSE_AKSARA[c];
      if (REVERSE_SANDHANGAN[next]) {
        out += REVERSE_SANDHANGAN[next];
        i += 2;
      } else {
        out += 'a';
        i++;
      }
      continue;
    }

    // SPASI
    if (c === ' ') out += ' ';
    i++;
  }

  return out.replace(/\s+/g,' ').trim();
}

window.jawaToLatin = jawaToLatin;