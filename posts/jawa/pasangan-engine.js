/* =========================
   PBJ LANJUT – LATIN → AKSARA JAWA
   FIX DIGRAF + VOKAL IMPLISIT
========================= */

window.USE_MURDA = true;

function isVowel(c){
  return 'aiueoê'.includes(c);
}

function latinToJawaWord(raw){
  if(!raw) return '';
  if(/^[0-9]+$/.test(raw)) return latinNumberToJawa(raw);

  const word = raw.toLowerCase();
  let out = '';
  let i = 0;
  let prevConsonant = false;
  let atStart = true;

  // === SWARA AWAL ===
  if (SWARA[word[0]]) {
    out += SWARA[word[0]];
    i++;
    atStart = false;
  }

  while (i < word.length) {
    const two = word.slice(i, i + 2);
    const next = word[i + 2];
    const c = word[i];
    const v = word[i + 1];

    /* =========================
       DIGRAF (ng, ny, dh, th)
    ========================= */
    if (AKSARA[two]) {
      out += prevConsonant ? PASANGAN[two] : AKSARA[two];

      // vokal setelah digraf
      if (isVowel(next)) {
        if (next !== 'a') out += SANDHANGAN[next];
        prevConsonant = false;
        i += 3; // digraf + vokal
      } else {
        prevConsonant = true;
        i += 2;
      }

      atStart = false;
      continue;
    }

    /* =========================
       KONSONAN TUNGGAL
    ========================= */
    if (AKSARA[c]) {
      if (prevConsonant) {
        out += PASANGAN[c];
      } else {
        out += (USE_MURDA && atStart && MURDA[c]) ? MURDA[c] : AKSARA[c];
      }

      // vokal
      if (isVowel(v)) {
        if (v !== 'a') out += SANDHANGAN[v];
        prevConsonant = false;
        i += 2;
      } else {
        prevConsonant = true;
        i += 1;
      }

      atStart = false;
      continue;
    }

    /* =========================
       SPASI / TANDA BACA
    ========================= */
    out += c;
    prevConsonant = false;
    atStart = true;
    i++;
  }

  /* =========================
     AKHIR KATA (PANYIGEG)
  ========================= */
  if (word.endsWith('ng')) {
    out = out.replace(/꧀$/, '') + PANYIGEG.ng;
  } else if (word.endsWith('r')) {
    out = out.replace(/꧀$/, '') + PANYIGEG.r;
  } else if (word.endsWith('h')) {
    out = out.replace(/꧀$/, '') + PANYIGEG.h;
  } else if (prevConsonant) {
    out += PANGKON;
  }

  return out;
}

function latinToJawa(text){
  return text
    .split(/\s+/)
    .map(latinToJawaWord)
    .join(' ');
}

window.latinToJawa = latinToJawa;