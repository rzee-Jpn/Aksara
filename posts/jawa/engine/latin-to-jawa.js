import {  
  AKSARA, SANDHANGAN, SWARA,  
  PANYIGEG, PANGKON, MURDA, VOWELS  
} from './constants.js';  
  
import { latinNumberToJawa } from './numbers.js';  
  
const DIGRAF = ['ny','dh','th'];  
  
/* === DAFTAR JEBakan NG (WAJIB) === */  
const NG_CECAK_BEFORE = ['g','k','c','j','d','t','s','b','p'];  
  
export function latinToJawa(text, useMurda = true){  
  return text  
    .split(/(\s+|[.,!?;:])/)  
    .map(part=>{  
      if (/^\d+$/.test(part)) return latinNumberToJawa(part);  
      if (/^[\s.,!?;:]+$/.test(part)) return part;  
      return wordToJawa(part, useMurda);  
    })  
    .join('');  
}  
  
function wordToJawa(word, useMurda){
  const rawWord = word;               // simpan bentuk asli
  word = word.toLowerCase();

  const isCapitalized =
    rawWord[0] === rawWord[0].toUpperCase();

  let out = '';
  let i = 0;
  let prevConsonant = false;

  while (i < word.length){
    const two = word.slice(i,i+2);
    const one = word[i];
    const next = word[i+1];

    /* ================= NG ================= */
    if (two === 'ng'){
      const after = word[i+2];

      if (NG_CECAK_BEFORE.includes(after)){
        out += PANYIGEG.ng;
        i += 2;
        prevConsonant = false;
        continue;
      }

      if (VOWELS.includes(after)){
        out += AKSARA.ng;
        if (after !== 'a') out += SANDHANGAN[after];
        i += 3;
        prevConsonant = false;
        continue;
      }

      out += PANYIGEG.ng;
      i += 2;
      prevConsonant = false;
      continue;
    }

    /* ================= DIGRAF ================= */
    if (DIGRAF.includes(two)){
      if (prevConsonant) out += PANGKON;

      out += AKSARA[two];

      if (VOWELS.includes(word[i+2])){
        if (word[i+2] !== 'a')
          out += SANDHANGAN[word[i+2]];
        i += 3;
        prevConsonant = false;
      } else {
        i += 2;
        prevConsonant = true;
      }
      continue;
    }

    /* ================= KONSONAN ================= */
    if (AKSARA[one]){
      if (prevConsonant) out += PANGKON;

      out += (
        useMurda &&
        i === 0 &&
        isCapitalized &&
        MURDA[one]
      )
        ? MURDA[one]
        : AKSARA[one];

      if (VOWELS.includes(next)){
        if (next !== 'a')
          out += SANDHANGAN[next];
        i += 2;
        prevConsonant = false;
      } else {
        i++;
        prevConsonant = true;
      }
      continue;
    }

    /* ================= VOKAL LEPAS ================= */
    if (VOWELS.includes(one)){
      out += SWARA[one];
      i++;
      prevConsonant = false;
      continue;
    }

    /* ================= KARAKTER LAIN ================= */
    out += one;
    i++;
    prevConsonant = false;
  }

  if (prevConsonant) out += PANGKON;
  return out;
}