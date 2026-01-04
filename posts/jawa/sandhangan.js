/* =========================
   AKSARA LEGENA (konsonan dasar)
========================= */
const AKSARA = {
  h:'ꦲ', n:'ꦤ', c:'ꦕ', r:'ꦫ', k:'ꦏ', d:'ꦢ', t:'ꦠ', s:'ꦱ',
  w:'ꦮ', l:'ꦭ', p:'ꦥ', j:'ꦗ', y:'ꦪ', m:'ꦩ', g:'ꦒ',
  b:'ꦧ', ng:'ꦔ', ny:'ꦚ', dh:'ꦝ', th:'ꦛ'
};

/* =========================
   PASANGAN (index pasangan)
   NOTE: representasi sederhana `'꧀'+aksara` jadi bentuk pasangan
========================= */
const PASANGAN = {
  h:'꧀ꦲ', n:'꧀ꦤ', c:'꧀ꦕ', r:'꧀ꦫ', k:'꧀ꦏ', d:'꧀ꦢ', t:'꧀ꦠ',
  s:'꧀ꦱ', w:'꧀ꦮ', l:'꧀ꦭ', p:'꧀ꦥ', j:'꧀ꦗ', y:'꧀ꦪ',
  m:'꧀ꦩ', g:'꧀ꦒ', b:'꧀ꦧ',
  ng:'꧀ꦔ', ny:'꧀ꦚ', dh:'꧀ꦝ', th:'꧀ꦛ'
};

/* =========================
   SANDHANGAN (vokal)
========================= */
const SANDHANGAN = {
  i:'ꦶ',   // wulu
  u:'ꦸ',   // suku
  e:'ꦺ',   // taling
  o:'ꦺꦴ', // taling tarung
  ê:'ꦼ'    // pepet
};

const PANGKON = '꧀';

/* =========================
   PANYIGEG WANDA (akhiran khusus)
========================= */
const PANYIGEG = {
  ng:'ꦁ', // cecak
  r :'ꦂ', // layar
  h :'ꦃ'  // wignyan
};

/* =========================
   AKSARA SWARA (huruf mandiri / vokal di awal)
========================= */
const SWARA = {
  a: 'ꦄ',
  i: 'ꦆ',
  u: 'ꦈ',
  e: 'ꦌ',
  o: 'ꦎ'
};

/* =========================
   AKSARA MURDA (opsional)
   Hanya beberapa huruf (sesuai praktik)
========================= */
const MURDA = {
  n: 'ꦟ',
  k: 'ꦑ',
  t: 'ꦡ',
  s: 'ꦯ',
  p: 'ꦦ',
  b: 'ꦨ',
  g: 'ꦓ',
  c: 'ꦖ',
  j: 'ꦙ',
  d: 'ꦣ'
};

/* =========================
   AKSARA SERAPAN (digraf/karakter non-standar untuk serapan)
   Periksa paling awal saat transliterasi
========================= */
const SERAPAN = {
  f: 'ꦥ꦳',   // fa -> pa + cakra telu
  v: 'ꦮ꦳',   // va
  z: 'ꦗ꦳',   // za
  sy: 'ꦯ',    // sya (menggunakan aksara saw)
  kh: 'ꦑ꦳',   // kha
  gh: 'ꦒ꦳',   // gha
  q: 'ꦐ'      // qa
};