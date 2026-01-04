const REVERSE_AKSARA = Object.fromEntries(
  Object.entries(AKSARA).map(([k,v])=>[v,k])
);
const REVERSE_SANDHANGAN = Object.fromEntries(
  Object.entries(SANDHANGAN).map(([k,v])=>[v,k])
);
const REVERSE_ANGKA = Object.fromEntries(
  Object.entries(ANGKA_JAWA).map(([k,v])=>[v,k])
);

function jawaToLatin(text){
  let out='', i=0;
  while(i<text.length){
    let c=text[i];
    if(c===PADA_PANGKAT){
      i++; while(text[i]!==PADA_PANGKAT){
        out+=REVERSE_ANGKA[text[i]]||''; i++;
      } i++; continue;
    }
    if(REVERSE_AKSARA[c]){
      out+=REVERSE_AKSARA[c];
      if(REVERSE_SANDHANGAN[text[i+1]]){
        out+=REVERSE_SANDHANGAN[text[i+1]]; i+=2;
      } else{ out+='a'; i++; }
      continue;
    }
    if(c===' ') out+=' ';
    i++;
  }
  return out.trim();
}

window.jawaToLatin = jawaToLatin;