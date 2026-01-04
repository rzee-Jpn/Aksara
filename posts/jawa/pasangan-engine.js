window.USE_MURDA = true;

function latinToJawaWord(word){
  if(!word) return '';
  if(/^[0-9]+$/.test(word)) return latinNumberToJawa(word);

  word = word.toLowerCase();
  let out = '';
  let i = 0;
  let prev = false;

  if(SWARA[word[0]]){ out+=SWARA[word[0]]; i++; }

  while(i < word.length){
    let two = word.slice(i,i+2);
    if(AKSARA[two]){
      out += prev ? PASANGAN[two] : AKSARA[two];
      prev = true; i+=2; continue;
    }

    let c = word[i], v = word[i+1];
    if(AKSARA[c]){
      out += prev ? PASANGAN[c] :
        (USE_MURDA && MURDA[c] ? MURDA[c] : AKSARA[c]);

      if(SANDHANGAN[v]){ out+=SANDHANGAN[v]; prev=false; i+=2; }
      else{ prev=true; i++; }
    } else i++;
  }

  if(word.endsWith('ng')) out+=PANYIGEG.ng;
  else if(word.endsWith('r')) out+=PANYIGEG.r;
  else if(word.endsWith('h')) out+=PANYIGEG.h;

  return out;
}

function latinToJawa(text){
  return text.split(/\s+/).map(latinToJawaWord).join(' ');
}

window.latinToJawa = latinToJawa;