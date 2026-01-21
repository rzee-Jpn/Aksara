const N5 = [
  // ===== Angka =====
  { c:"一", on:["イチ"], kun:["ひと"], a:"satu", jlpt:"N5" },
  { c:"二", on:["ニ"], kun:["ふた"], a:"dua", jlpt:"N5" },
  { c:"三", on:["サン"], kun:["み"], a:"tiga", jlpt:"N5" },
  { c:"四", on:["ヨン"], kun:["よ"], a:"empat", jlpt:"N5" },
  { c:"五", on:["ゴ"], kun:["いつ"], a:"lima", jlpt:"N5" },
  { c:"六", on:["ロク"], kun:["む"], a:"enam", jlpt:"N5" },
  { c:"七", on:["ナナ"], kun:["なな"], a:"tujuh", jlpt:"N5" },
  { c:"八", on:["ハチ"], kun:["や"], a:"delapan", jlpt:"N5" },
  { c:"九", on:["キュウ"], kun:["ここの"], a:"sembilan", jlpt:"N5" },
  { c:"十", on:["ジュウ"], kun:["とお"], a:"sepuluh", jlpt:"N5" },

  // ===== Waktu =====
  { c:"日", on:["ニチ","ジツ"], kun:["ひ","か"], a:"hari / matahari", jlpt:"N5" },
  { c:"月", on:["ゲツ","ガツ"], kun:["つき"], a:"bulan", jlpt:"N5" },
  { c:"年", on:["ネン"], kun:["とし"], a:"tahun", jlpt:"N5" },
  { c:"時", on:["ジ"], kun:["とき"], a:"jam / waktu", jlpt:"N5" },
  { c:"分", on:["フン","ブン"], kun:["わ"], a:"menit / bagian", jlpt:"N5" },
  { c:"半", on:["ハン"], kun:[], a:"setengah", jlpt:"N5" },
  { c:"今", on:["コン"], kun:["いま"], a:"sekarang", jlpt:"N5" },
  { c:"前", on:["ゼン"], kun:["まえ"], a:"sebelum / depan", jlpt:"N5" },
  { c:"後", on:["ゴ","コウ"], kun:["あと","うし"], a:"sesudah / belakang", jlpt:"N5" },
  { c:"午", on:["ゴ"], kun:[], a:"siang", jlpt:"N5" },

  // ===== Orang =====
  { c:"人", on:["ジン","ニン"], kun:["ひと"], a:"orang", jlpt:"N5" },
  { c:"男", on:["ダン"], kun:["おとこ"], a:"laki-laki", jlpt:"N5" },
  { c:"女", on:["ジョ"], kun:["おんな"], a:"perempuan", jlpt:"N5" },
  { c:"子", on:["シ"], kun:["こ"], a:"anak", jlpt:"N5" },
  { c:"友", on:["ユウ"], kun:["とも"], a:"teman", jlpt:"N5" },
  { c:"私", on:["シ"], kun:["わたし"], a:"saya", jlpt:"N5" },
  { c:"名", on:["メイ"], kun:["な"], a:"nama", jlpt:"N5" },
  { c:"方", on:["ホウ"], kun:["かた"], a:"orang / cara", jlpt:"N5" },

  // ===== Arah & Posisi =====
  { c:"上", on:["ジョウ"], kun:["うえ"], a:"atas", jlpt:"N5" },
  { c:"下", on:["カ"], kun:["した"], a:"bawah", jlpt:"N5" },
  { c:"左", on:["サ"], kun:["ひだり"], a:"kiri", jlpt:"N5" },
  { c:"右", on:["ウ","ユウ"], kun:["みぎ"], a:"kanan", jlpt:"N5" },
  { c:"中", on:["チュウ"], kun:["なか"], a:"tengah / dalam", jlpt:"N5" },
  { c:"外", on:["ガイ"], kun:["そと"], a:"luar", jlpt:"N5" },

// ===== Alam & Elemen =====
{ c:"天", on:["テン"], kun:[], a:"langit", jlpt:"N5" },
{ c:"気", on:["キ"], kun:[], a:"energi / perasaan", jlpt:"N5" },
{ c:"山", on:["サン"], kun:["やま"], a:"gunung", jlpt:"N5" },
{ c:"川", on:["セン"], kun:["かわ"], a:"sungai", jlpt:"N5" },
{ c:"田", on:["デン"], kun:["た"], a:"sawah", jlpt:"N5" },
{ c:"雨", on:["ウ"], kun:["あめ"], a:"hujan", jlpt:"N5" },

// ===== Warna =====
{ c:"白", on:["ハク"], kun:["しろ"], a:"putih", jlpt:"N5" },
{ c:"黒", on:["コク"], kun:["くろ"], a:"hitam", jlpt:"N5" },
{ c:"赤", on:["セキ"], kun:["あか"], a:"merah", jlpt:"N5" },
{ c:"青", on:["セイ"], kun:["あお"], a:"biru", jlpt:"N5" },

// ===== Benda & Tempat =====
{ c:"本", on:["ホン"], kun:["もと"], a:"buku / asal", jlpt:"N5" },
{ c:"車", on:["シャ"], kun:["くるま"], a:"mobil / kendaraan", jlpt:"N5" },
{ c:"電", on:["デン"], kun:[], a:"listrik", jlpt:"N5" },
{ c:"駅", on:["エキ"], kun:[], a:"stasiun", jlpt:"N5" },
{ c:"国", on:["コク"], kun:["くに"], a:"negara", jlpt:"N5" },
{ c:"家", on:["カ"], kun:["いえ"], a:"rumah", jlpt:"N5" },
{ c:"店", on:["テン"], kun:["みせ"], a:"toko", jlpt:"N5" },

// ===== Sekolah =====
{ c:"学", on:["ガク"], kun:["まな"], a:"belajar", jlpt:"N5" },
{ c:"生", on:["セイ"], kun:["い"], a:"hidup / siswa", jlpt:"N5" },
{ c:"先", on:["セン"], kun:["さき"], a:"sebelum / guru", jlpt:"N5" },
{ c:"校", on:["コウ"], kun:[], a:"sekolah", jlpt:"N5" },

// ===== Kata Sifat =====
{ c:"大", on:["ダイ"], kun:["おお"], a:"besar", jlpt:"N5" },
{ c:"小", on:["ショウ"], kun:["ちい"], a:"kecil", jlpt:"N5" },
{ c:"高", on:["コウ"], kun:["たか"], a:"tinggi / mahal", jlpt:"N5" },
{ c:"安", on:["アン"], kun:["やす"], a:"murah / aman", jlpt:"N5" },
{ c:"長", on:["チョウ"], kun:["なが"], a:"panjang", jlpt:"N5" },
{ c:"短", on:["タン"], kun:["みじか"], a:"pendek", jlpt:"N5" },
{ c:"新", on:["シン"], kun:["あたら"], a:"baru", jlpt:"N5" },
{ c:"古", on:["コ"], kun:["ふる"], a:"lama", jlpt:"N5" },
{ c:"多", on:["タ"], kun:["おお"], a:"banyak", jlpt:"N5" },
{ c:"少", on:["ショウ"], kun:["すく"], a:"sedikit", jlpt:"N5" },

// ===== Kata Kerja Dasar =====
{ c:"見", on:["ケン"], kun:["み"], a:"melihat", jlpt:"N5" },
{ c:"行", on:["コウ"], kun:["い","ゆ"], a:"pergi", jlpt:"N5" },
{ c:"来", on:["ライ"], kun:["く"], a:"datang", jlpt:"N5" },
{ c:"食", on:["ショク"], kun:["た"], a:"makan", jlpt:"N5" },
{ c:"飲", on:["イン"], kun:["の"], a:"minum", jlpt:"N5" },
{ c:"話", on:["ワ"], kun:["はな"], a:"berbicara", jlpt:"N5" },
{ c:"聞", on:["ブン","モン"], kun:["き"], a:"mendengar", jlpt:"N5" },
{ c:"買", on:["バイ"], kun:["か"], a:"membeli", jlpt:"N5" },
{ c:"書", on:["ショ"], kun:["か"], a:"menulis", jlpt:"N5" },
{ c:"読", on:["ドク"], kun:["よ"], a:"membaca", jlpt:"N5" },
{ c:"出", on:["シュツ"], kun:["で"], a:"keluar", jlpt:"N5" },
{ c:"入", on:["ニュウ"], kun:["はい","い"], a:"masuk", jlpt:"N5" },
{ c:"休", on:["キュウ"], kun:["やす"], a:"istirahat", jlpt:"N5" },
{ c:"立", on:["リツ"], kun:["た"], a:"berdiri", jlpt:"N5" },
{ c:"会", on:["カイ"], kun:["あ"], a:"bertemu", jlpt:"N5" },
{ c:"話", on:["ワ"], kun:["はな"], a:"bicara", jlpt:"N5" },

// ===== Tambahan Resmi JLPT N5 =====
{ c:"毎", on:["マイ"], kun:["ごと"], a:"setiap", jlpt:"N5" },
{ c:"金", on:["キン"], kun:["かね"], a:"emas / uang", jlpt:"N5" },
{ c:"木", on:["モク","ボク"], kun:["き"], a:"pohon", jlpt:"N5" },
{ c:"水", on:["スイ"], kun:["みず"], a:"air", jlpt:"N5" },
{ c:"火", on:["カ"], kun:["ひ"], a:"api", jlpt:"N5" },
{ c:"土", on:["ド"], kun:["つち"], a:"tanah", jlpt:"N5" }
];
