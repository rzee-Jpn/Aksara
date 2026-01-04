/* =========================
   PASANGAN ENGINE
========================= */

// SATU SUMBER KEBENARAN
window.USE_MURDA = true;

// helper
function isVowel(c){
  return 'aiueoê'.includes(c);
}

function startsWithVowel(word){
  return word && 'aiueo'.includes(word[0]);
}

function latinToJawaWord(rawWord){
  if(!rawWord) return '';
  const word = rawWord.toLowerCase();

  if (/^[0-9]+$/.test(word)) {
    return typeof latinNumberToJawa === 'function'
      ? latinNumberToJawa(word)
      : word;
  }

  let out = '';
  let i = 0;
  let prevConsonant = false;
  let atStart = true;

  if (startsWithVowel(word) && SWARA[word[0]]) {
    out += SWARA[word[0]];
    i = 1;
    atStart = false;
  }

  while (i < word.length) {
    const two = word.slice(i, i+2);

    if (SERAPAN[two]) {
      out += SERAPAN[two];
      i += 2;
      prevConsonant = true;
      atStart = false;
      continue;
    }

    if (SERAPAN[word[i]]) {
      out += SERAPAN[word[i]];
      i++;
      prevConsonant = true;
      atStart = false;
      continue;
    }

    if (AKSARA[two]) {
      if (prevConsonant) out += PASANGAN[two];
      else if (atStart && USE_MURDA && MURDA[two[0]]) out += MURDA[two[0]];
      else out += AKSARA[two];

      const next = word[i+2];
      if (SANDHANGAN[next]) {
        out += SANDHANGAN[next];
        prevConsonant = false;
        i += 3;
      } else {
        prevConsonant = true;
        if (!next) out += PANGKON;
        i += 2;
      }
      atStart = false;
      continue;
    }

    const c = word[i];
    const v = word[i+1];

    if (AKSARA[c]) {
      if (prevConsonant) out += PASANGAN[c];
      else if (atStart && USE_MURDA && MURDA[c]) out += MURDA[c];
      else out += AKSARA[c];

      if (SANDHANGAN[v]) {
        out += SANDHANGAN[v];
        prevConsonant = false;
        i += 2;
      } else {
        prevConsonant = true;
        if (!v) out += PANGKON;
        i += 1;
      }
      atStart = false;
    } else {
      i++;
      atStart = false;
    }
  }

  if (word.endsWith('ng')) out = out.replace(/꧀$/, '') + PANYIGEG.ng;
  else if (word.endsWith('r')) out = out.replace(/꧀$/, '') + PANYIGEG.r;
  else if (word.endsWith('h')) out = out.replace(/꧀$/, '') + PANYIGEG.h;

  return out;
}

function latinToJawa(text){
  return (text || '')
    .split(/\s+/)
    .map(latinToJawaWord)
    .join(' ');
}

// EXPORT WAJIB
window.latinToJawa = latinToJawa;