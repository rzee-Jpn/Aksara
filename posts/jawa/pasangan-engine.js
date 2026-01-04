// konfigurasi global (ubah kalau perlu)
let USE_MURDA = true;

// helper
function isVowel(c){
  return 'aiueoê'.includes(c);
}

function startsWithVowel(word){
  return word && 'aiueo'.includes(word[0]);
}

/**
 * latinToJawaWord
 * transliterasi satu kata latin -> aksara jawa (mendekati PBJ)
 */
function latinToJawaWord(rawWord){
  if(!rawWord) return '';
  const word = rawWord.toLowerCase();

  // angka?
  if(/^[0-9]+$/.test(word)) return latinNumberToJawa(word);

  let out = '';
  let i = 0;
  let prevConsonant = false; // apakah huruf sebelumnya konsonan tanpa vokal (menuntut pasangan)
  let atStart = true;

  // jika kata mulai vokal: gunakan swara
  if (startsWithVowel(word)) {
    const v = word[0];
    if (SWARA[v]) {
      out += SWARA[v];
      i = 1;
      atStart = false;
    }
  }

  while(i < word.length){
    // cek serapan (2 huruf dulu)
    const two = word.slice(i, i+2);
    if (SERAPAN[two]) {
      out += SERAPAN[two];
      i += 2;
      prevConsonant = true;
      atStart = false;
      continue;
    }
    // cek serapan 1 huruf
    if (SERAPAN[word[i]]) {
      out += SERAPAN[word[i]];
      i += 1;
      prevConsonant = true;
      atStart = false;
      continue;
    }

    // digraf (ng, ny, dh, th)
    const dg = word.slice(i, i+2);
    if (AKSARA[dg]) {
      // pilih bentuk: pasangan jika sebelumnya konsonan, murda jika awal dan diizinkan
      if (prevConsonant) out += PASANGAN[dg] || (PANGKON + AKSARA[dg]);
      else if (atStart && USE_MURDA && MURDA[dg[0]]) out += MURDA[dg[0]]; // murda jarang untuk digraf -> ambil huruf pertama
      else out += AKSARA[dg];

      const next = word[i+2];
      if (SANDHANGAN[next]) {
        out += SANDHANGAN[next];
        prevConsonant = false;
        i += 3;
      } else if (!next || !isVowel(next)) {
        // konsonan beruntun atau akhir kata
        prevConsonant = true;
        // jika akhir kata: tambahkan pangkon (menandai konsonan akhir)
        if (!next) out += PANGKON;
        i += 2;
      } else {
        prevConsonant = false;
        i += 2;
      }
      atStart = false;
      continue;
    }

    const c = word[i];
    const v = word[i+1];

    if (AKSARA[c]) {
      if (prevConsonant) out += PASANGAN[c] || (PANGKON + AKSARA[c]);
      else if (atStart && USE_MURDA && MURDA[c]) out += MURDA[c];
      else out += AKSARA[c];

      if (SANDHANGAN[v]) {
        out += SANDHANGAN[v];
        prevConsonant = false;
        i += 2;
      } else if (v === 'a') {
        // vokal implisit (a)
        prevConsonant = false;
        i += 2;
      } else if (!v || !isVowel(v)) {
        // konsonan beruntun atau akhir kata
        prevConsonant = true;
        if (!v) out += PANGKON; // akhir kata -> pangkon
        i += 1;
      } else {
        prevConsonant = false;
        i += 1;
      }
      atStart = false;
    } else {
      // bukan karakter yang dikenali (mis. tanda baca) → lewati
      i += 1;
      atStart = false;
    }
  }

  // panyigeg wanda: jika explicit akhiran 'ng' / 'r' / 'h' pada kata latin,
  // ganti pangkon terakhir atau tambahkan panyigeg sesuai
  if (word.endsWith('ng')) {
    // jika ada pangkon di akhir, hapus dan tambahkan cecak; jika tidak, tambahkan cecak
    out = out.replace(/꧀$/, '');
    out = out + PANYIGEG.ng;
  } else if (word.endsWith('r')) {
    out = out.replace(/꧀$/, '');
    out = out + PANYIGEG.r;
  } else if (word.endsWith('h')) {
    out = out.replace(/꧀$/, '');
    out = out + PANYIGEG.h;
  }

  return out;
}

/**
 * latinToJawa
 * transliterasi kalimat / teks: memetakan angka dan kata
 */
function latinToJawa(text){
  if(!text) return '';
  return text
    .toLowerCase()
    .split(/\s+/)
    .map(w => {
      if(/^[0-9]+$/.test(w)) return latinNumberToJawa(w);
      return latinToJawaWord(w);
    })
    .join(' ');
}