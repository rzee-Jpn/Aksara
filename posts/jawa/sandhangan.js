const AKSARA = {
  h:'ꦲ', n:'ꦤ', c:'ꦕ', r:'ꦫ', k:'ꦏ', d:'ꦢ', t:'ꦠ', s:'ꦱ',
  w:'ꦮ', l:'ꦭ', p:'ꦥ', j:'ꦗ', y:'ꦪ', m:'ꦩ', g:'ꦒ',
  b:'ꦧ', ng:'ꦔ', ny:'ꦚ', dh:'ꦝ', th:'ꦛ'
};

const PASANGAN = Object.fromEntries(
  Object.entries(AKSARA).map(([k,v]) => [k,'꧀'+v])
);

const SANDHANGAN = {
  i:'ꦶ', u:'ꦸ', e:'ꦺ', o:'ꦺꦴ', ê:'ꦼ'
};

const PANGKON = '꧀';

const PANYIGEG = {
  ng:'ꦁ', r:'ꦂ', h:'ꦃ'
};

const SWARA = {
  a:'ꦄ', i:'ꦆ', u:'ꦈ', e:'ꦌ', o:'ꦎ'
};

const MURDA = {
  n:'ꦟ', k:'ꦑ', t:'ꦡ', s:'ꦯ', p:'ꦦ',
  b:'ꦨ', g:'ꦓ', c:'ꦖ', j:'ꦙ', d:'ꦣ'
};

const SERAPAN = {
  f:'ꦥ꦳', v:'ꦮ꦳', z:'ꦗ꦳', sy:'ꦯ',
  kh:'ꦑ꦳', gh:'ꦒ꦳', q:'ꦐ'
};