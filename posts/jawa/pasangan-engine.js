/* =========================
   PBJ LANJUT – LATIN → AKSARA JAWA
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

  // Swara awal
  if (SWARA[word[0]]) {
    out += SWARA[word[0]];
    i++;
    atStart = false;
  }

  while (i < word.length) {
    const two = word.slice(i, i + 2);
    const c = word[i];
    const v = word[i + 1];

    // DIGRAF
    if (AKSARA[two]) {
      out += prevConsonant ? PASANGAN[two] : AKSARA[two];
      prevConsonant = true;
      i += 2;
      atStart = false;
      continue;
    }

    // KONSONAN
    if (AKSARA[c]) {
      if (prevConsonant) {
        out += PASANGAN[c];
      } else {
        out += (USE_MURDA && atStart && MURDA[c]) ? MURDA[c] : AKSARA[c];
      }

      // VOKAL
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

    // SPASI / TANDA BACA
    out += c;
    prevConsonant = false;
    i++;
    atStart = false;
  }

  // === AKHIR KATA (PBJ) ===
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