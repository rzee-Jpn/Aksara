const aksara = {
  h:'ꦲ', n:'ꦤ', c:'ꦕ', r:'ꦫ', k:'ꦏ', d:'ꦢ', t:'ꦠ', s:'ꦱ',
  w:'ꦮ', l:'ꦭ', p:'ꦥ', j:'ꦗ', y:'ꦪ', m:'ꦩ', g:'ꦒ',
  b:'ꦧ', ng:'ꦔ', ny:'ꦚ', dh:'ꦝ', th:'ꦛ'
};

const sandhangan = {
  i:'ꦶ', u:'ꦸ', e:'ꦺ', o:'ꦺꦴ', ê:'ꦼ'
};

const pangkon = '꧀';
const cecak = 'ꦁ';

function transliterateWord(word) {
  let out = '';
  let i = 0;

  while (i < word.length) {

    // digraf (ng, ny, dh, th)
    let dg = word.slice(i, i + 2);
    if (aksara[dg]) {
      let next = word[i + 2];
      out += aksara[dg];

      if (sandhangan[next]) {
        out += sandhangan[next];
        i += 3;
      } else if (!next || !'aiueoê'.includes(next)) {
        out += pangkon;
        i += 2;
      } else {
        i += 2;
      }
      continue;
    }

    let c = word[i];
    let v = word[i + 1];

    if (aksara[c]) {
      out += aksara[c];

      if (sandhangan[v]) {
        out += sandhangan[v];
        i += 2;
      } else if (v === 'a') {
        i += 2;
      } else if (!v || !'aiueoê'.includes(v)) {
        out += pangkon;
        i += 1;
      } else {
        i += 1;
      }
    } else {
      i++;
    }
  }

  // akhiran -ng → cecak
  if (word.endsWith('ng')) {
    out = out.slice(0, -1) + cecak;
  }

  return out;
}

function convert(text) {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map(transliterateWord)
    .join(' ');
}

document.getElementById('input').addEventListener('input', e => {
  document.getElementById('output').textContent = convert(e.target.value);
});

document.getElementById('copyBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('output').textContent);
  alert('Aksara Jawa berhasil disalin!');
});