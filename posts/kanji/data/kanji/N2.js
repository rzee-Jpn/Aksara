const N2 = [
  {
    c: "論",
    on: ["ロン"],
    kun: [],
    a: "teori, argumen",
    jlpt: "N2"
  },
  {
    c: "議",
    on: ["ギ"],
    kun: [],
    a: "diskusi, pembahasan",
    jlpt: "N2"
  },
  {
    c: "識",
    on: ["シキ"],
    kun: [],
    a: "pengetahuan, kesadaran",
    jlpt: "N2"
  },
  {
    c: "認",
    on: ["ニン"],
    kun: ["みと"],
    a: "mengakui",
    jlpt: "N2"
  },
  {
    c: "解",
    on: ["カイ", "ゲ"],
    kun: ["と"],
    a: "memahami, penjelasan",
    jlpt: "N2"
  },
  {
    c: "釈",
    on: ["シャク"],
    kun: [],
    a: "penafsiran, penjelasan",
    jlpt: "N2"
  },
  {
    c: "察",
    on: ["サツ"],
    kun: [],
    a: "menyimpulkan, menilai situasi",
    jlpt: "N2"
  },
  {
    c: "測",
    on: ["ソク"],
    kun: ["はか"],
    a: "mengukur, memperkirakan",
    jlpt: "N2"
  },
  {
    c: "推",
    on: ["スイ"],
    kun: ["お"],
    a: "menyimpulkan, mendorong",
    jlpt: "N2"
  },
  {
    c: "証",
    on: ["ショウ"],
    kun: ["あかし"],
    a: "bukti, membuktikan",
    jlpt: "N2"
  },

  {
    c: "因",
    on: ["イン"],
    kun: ["よ"],
    a: "penyebab",
    jlpt: "N2"
  },
  {
    c: "果",
    on: ["カ"],
    kun: ["は"],
    a: "hasil",
    jlpt: "N2"
  },
  {
    c: "関",
    on: ["カン"],
    kun: ["かか"],
    a: "hubungan",
    jlpt: "N2"
  },
  {
    c: "係",
    on: ["ケイ"],
    kun: ["かかり"],
    a: "terkait, petugas",
    jlpt: "N2"
  },
  {
    c: "影",
    on: ["エイ"],
    kun: ["かげ"],
    a: "pengaruh, bayangan",
    jlpt: "N2"
  },
  {
    c: "響",
    on: ["キョウ"],
    kun: ["ひび"],
    a: "dampak, bergema",
    jlpt: "N2"
  },
  {
    c: "及",
    on: ["キュウ"],
    kun: ["およ"],
    a: "mencapai, meluas",
    jlpt: "N2"
  },
  {
    c: "至",
    on: ["シ"],
    kun: ["いた"],
    a: "hingga, mencapai",
    jlpt: "N2"
  },
  {
    c: "基",
    on: ["キ"],
    kun: ["もと"],
    a: "dasar, fondasi",
    jlpt: "N2"
  },
  {
    c: "準",
    on: ["ジュン"],
    kun: [],
    a: "standar, kriteria",
    jlpt: "N2"
  },

  {
    c: "決",
    on: ["ケツ"],
    kun: ["き"],
    a: "memutuskan",
    jlpt: "N2"
  },
  {
    c: "断",
    on: ["ダン"],
    kun: ["ことわ"],
    a: "memutuskan, menolak",
    jlpt: "N2"
  },
  {
    c: "判",
    on: ["ハン"],
    kun: [],
    a: "menilai, keputusan",
    jlpt: "N2"
  },
  {
    c: "択",
    on: ["タク"],
    kun: [],
    a: "memilih",
    jlpt: "N2"
  },
  {
    c: "迷",
    on: ["メイ"],
    kun: ["まよ"],
    a: "ragu, tersesat",
    jlpt: "N2"
  },
  {
    c: "拒",
    on: ["キョ"],
    kun: ["こば"],
    a: "menolak",
    jlpt: "N2"
  },
  {
    c: "承",
    on: ["ショウ"],
    kun: ["うけたまわ"],
    a: "menerima, menyetujui",
    jlpt: "N2"
  },
  {
    c: "許",
    on: ["キョ"],
    kun: ["ゆる"],
    a: "mengizinkan",
    jlpt: "N2"
  },
  {
    c: "従",
    on: ["ジュウ"],
    kun: ["したが"],
    a: "mengikuti, mematuhi",
    jlpt: "N2"
  },
  {
    c: "逆",
    on: ["ギャク"],
    kun: ["さか"],
    a: "berlawanan",
    jlpt: "N2"
  },
  
  // Alam & lingkungan
  {c:"環", on:["カン"], kun:["わ"], a:"lingkungan, cincin", jlpt:"N2"},
  {c:"境", on:["キョウ"], kun:["さかい"], a:"batas, lingkungan", jlpt:"N2"},
  {c:"護", on:["ゴ"], kun:["まも"], a:"melindungi, menjaga", jlpt:"N2"},
  {c:"汚", on:["オ"], kun:["けが"], a:"kotor, mencemari", jlpt:"N2"},
  {c:"染", on:["セン"], kun:["そ"], a:"mewarnai, tercemar", jlpt:"N2"},
  {c:"清", on:["セイ"], kun:["きよ"], a:"bersih", jlpt:"N2"},
  {c:"害", on:["ガイ"], kun:[], a:"bahaya, kerugian", jlpt:"N2"},

  // Sains & teknologi ringan
  {c:"技", on:["ギ"], kun:["わざ"], a:"teknik, keterampilan", jlpt:"N2"},
  {c:"術", on:["ジュツ"], kun:[], a:"teknologi, seni", jlpt:"N2"},
  {c:"科", on:["カ"], kun:[], a:"ilmu, departemen", jlpt:"N2"},
  {c:"研", on:["ケン"], kun:["と"], a:"meneliti", jlpt:"N2"},
  {c:"究", on:["キュウ"], kun:[], a:"penelitian", jlpt:"N2"},
  {c:"機", on:["キ"], kun:["はた"], a:"mesin, kesempatan", jlpt:"N2"},
  {c:"能", on:["ノウ"], kun:[], a:"kemampuan", jlpt:"N2"},
  {c:"効", on:["コウ"], kun:["き"], a:"efektivitas, pengaruh", jlpt:"N2"},
  {c:"率", on:["リツ"], kun:["ひき"], a:"tingkat, rasio", jlpt:"N2"},
  {c:"測", on:["ソク"], kun:["はか"], a:"mengukur, memperkirakan", jlpt:"N2"},

  // Perubahan & proses kompleks
  {c:"変", on:["ヘン"], kun:["か"], a:"berubah", jlpt:"N2"},
  {c:"化", on:["カ"], kun:[], a:"perubahan, transformasi", jlpt:"N2"},
  {c:"改", on:["カイ"], kun:["あらた"], a:"memperbaiki", jlpt:"N2"},
  {c:"更", on:["コウ"], kun:["さら"], a:"memperbarui", jlpt:"N2"},
  {c:"進", on:["シン"], kun:["すす"], a:"maju, melanjutkan", jlpt:"N2"},
  {c:"退", on:["タイ"], kun:["しりぞ"], a:"mundur, pensiun", jlpt:"N2"},
  {c:"維", on:["イ"], kun:["たも"], a:"mempertahankan", jlpt:"N2"},
  {c:"持", on:["ジ"], kun:["も"], a:"memiliki, membawa", jlpt:"N2"},
  {c:"続", on:["ゾク"], kun:["つづ"], a:"melanjutkan", jlpt:"N2"},
  {c:"止", on:["シ"], kun:["と"], a:"berhenti", jlpt:"N2"},

  // Gerakan & tindakan abstrak
  {c:"超", on:["チョウ"], kun:["こ"], a:"melampaui", jlpt:"N2"},
  {c:"避", on:["ヒ"], kun:["さ"], a:"menghindari", jlpt:"N2"},
  {c:"防", on:["ボウ"], kun:["ふせ"], a:"mencegah", jlpt:"N2"},
  {c:"守", on:["シュ"], kun:["まも"], a:"melindungi", jlpt:"N2"},
  {c:"攻", on:["コウ"], kun:["せ"], a:"menyerang", jlpt:"N2"},
  {c:"破", on:["ハ"], kun:["やぶ"], a:"merusak", jlpt:"N2"},
  {c:"損", on:["ソン"], kun:["そこな"], a:"kerugian, merusak", jlpt:"N2"},
  {c:"救", on:["キュウ"], kun:["すく"], a:"menyelamatkan", jlpt:"N2"},

  // Kondisi & keadaan
  {c:"状", on:["ジョウ"], kun:[], a:"kondisi, situasi", jlpt:"N2"},
  {c:"態", on:["タイ"], kun:[], a:"keadaan, sikap", jlpt:"N2"},
  {c:"安", on:["アン"], kun:["やす"], a:"aman, stabil", jlpt:"N2"},
  {c:"危", on:["キ"], kun:["あぶ"], a:"berbahaya", jlpt:"N2"},
  {c:"困", on:["コン"], kun:["こま"], a:"sulit, kesulitan", jlpt:"N2"},
  {c:"難", on:["ナン"], kun:[], a:"sulit, berbahaya", jlpt:"N2"},
  {c:"余", on:["ヨ"], kun:["あま"], a:"tersisa, berlebih", jlpt:"N2"},
  {c:"限", on:["ゲン"], kun:["かぎ"], a:"batas, maksimum", jlpt:"N2"},
  {c:"欠", on:["ケツ"], kun:["か"], a:"kekurangan", jlpt:"N2"},
  {c:"充", on:["ジュウ"], kun:["あつ"], a:"cukup, memadai", jlpt:"N2"},

  // Masyarakat & kehidupan
  {c:"齢", on:["レイ"], kun:["よわい"], a:"usia", jlpt:"N2"},
  {c:"福", on:["フク"], kun:[], a:"kesejahteraan, beruntung", jlpt:"N2"},
  {c:"祉", on:["シ"], kun:[], a:"kesejahteraan sosial", jlpt:"N2"},
  {c:"医", on:["イ"], kun:[], a:"medis, dokter", jlpt:"N2"},
  {c:"療", on:["リョウ"], kun:[], a:"perawatan, terapi", jlpt:"N2"},
  {c:"険", on:["ケン"], kun:[], a:"risiko, berbahaya", jlpt:"N2"},
  {c:"健", on:["ケン"], kun:[], a:"sehat", jlpt:"N2"},
  {c:"康", on:["コウ"], kun:[], a:"kesehatan", jlpt:"N2"},
  {c:"労", on:["ロウ"], kun:[], a:"tenaga kerja", jlpt:"N2"},
  {c:"働", on:["ドウ"], kun:["はたら"], a:"bekerja", jlpt:"N2"},

  // Informasi & media
  {c:"報", on:["ホウ"], kun:[], a:"laporan, informasi", jlpt:"N2"},
  {c:"告", on:["コク"], kun:[], a:"pengumuman, memberitahu", jlpt:"N2"},
  {c:"信", on:["シン"], kun:[], a:"percaya, kepercayaan", jlpt:"N2"},
  {c:"疑", on:["ギ"], kun:["うたが"], a:"meragukan", jlpt:"N2"},
  {c:"噂", on:["ソワ"], kun:["うわさ"], a:"rumor", jlpt:"N2"},
  {c:"伝", on:["デン"], kun:["つた"], a:"menyampaikan", jlpt:"N2"},
  {c:"載", on:["サイ"], kun:["の"], a:"memuat, mempublikasikan", jlpt:"N2"},
  {c:"放", on:["ホウ"], kun:["はな"], a:"menyiarkan", jlpt:"N2"},
  {c:"編", on:["ヘン"], kun:[], a:"menyusun, mengedit", jlpt:"N2"},
  {c:"集", on:["シュウ"], kun:["あつ"], a:"mengumpulkan", jlpt:"N2"},

  // Waktu & urutan lanjutan
  {c:"期", on:["キ"], kun:[], a:"periode, jangka waktu", jlpt:"N2"},
  {c:"段", on:["ダン"], kun:[], a:"tahap, level", jlpt:"N2"},
  {c:"程", on:["テイ"], kun:["ほど"], a:"tingkat, sejauh", jlpt:"N2"},
  {c:"次", on:["ジ"], kun:[], a:"berikutnya, selanjutnya", jlpt:"N2"},
  {c:"以", on:["イ"], kun:[], a:"sejak, karena", jlpt:"N2"},
  {c:"際", on:["サイ"], kun:[], a:"saat, ketika", jlpt:"N2"},
  {c:"既", on:["キ"], kun:[], a:"sudah", jlpt:"N2"},
  {c:"未", on:["ミ"], kun:[], a:"belum", jlpt:"N2"},
  {c:"将", on:["ショウ"], kun:[], a:"akan, masa depan", jlpt:"N2"},
  {c:"常", on:["ジョウ"], kun:[], a:"selalu, umum", jlpt:"N2"},
  
  // Alam & lingkungan
  {c:"環", on:["カン"], kun:["わ"], a:"lingkungan, ekologi", jlpt:"N2"},
  {c:"境", on:["キョウ"], kun:["さかい"], a:"batas, lingkungan", jlpt:"N2"},
  {c:"護", on:["ゴ"], kun:[], a:"melindungi, menjaga", jlpt:"N2"},
  {c:"汚", on:["オ"], kun:["けが"], a:"mencemari, kotor", jlpt:"N2"},
  {c:"染", on:["セン"], kun:["そ"], a:"mewarnai, tercemar", jlpt:"N2"},
  {c:"清", on:["セイ"], kun:["きよ"], a:"bersih, murni", jlpt:"N2"},
  {c:"害", on:["ガイ"], kun:[], a:"bahaya, kerusakan", jlpt:"N2"},
  {c:"植", on:["ショク"], kun:["う"], a:"menanam, tanaman", jlpt:"N2"},
  {c:"材", on:["ザイ"], kun:[], a:"bahan, material", jlpt:"N2"},
  {c:"保", on:["ホ"], kun:["たも"], a:"menjaga, memelihara", jlpt:"N2"},

  // Sains & teknologi ringan
  {c:"技", on:["ギ"], kun:[], a:"teknik, keterampilan", jlpt:"N2"},
  {c:"術", on:["ジュツ"], kun:[], a:"teknologi, metode", jlpt:"N2"},
  {c:"科", on:["カ"], kun:[], a:"ilmu pengetahuan, cabang ilmu", jlpt:"N2"},
  {c:"研", on:["ケン"], kun:["と"], a:"meneliti", jlpt:"N2"},
  {c:"究", on:["キュウ"], kun:[], a:"penelitian, menyelidiki", jlpt:"N2"},
  {c:"機", on:["キ"], kun:["はた"], a:"mesin, kesempatan", jlpt:"N2"},
  {c:"能", on:["ノウ"], kun:[], a:"kemampuan, potensi", jlpt:"N2"},
  {c:"効", on:["コウ"], kun:[], a:"efektivitas, hasil", jlpt:"N2"},
  {c:"率", on:["リツ"], kun:[], a:"tingkat, rasio", jlpt:"N2"},
  {c:"測", on:["ソク"], kun:["はか"], a:"mengukur, perkiraan", jlpt:"N2"},

  // Perubahan & proses
  {c:"進", on:["シン"], kun:["すす"], a:"maju, bergerak ke depan", jlpt:"N2"},
  {c:"退", on:["タイ"], kun:["しりぞ"], a:"mundur, pensiun", jlpt:"N2"},
  {c:"維", on:["イ"], kun:[], a:"mempertahankan, menjaga", jlpt:"N2"},
  {c:"持", on:["ジ"], kun:["も"], a:"memiliki, membawa", jlpt:"N2"},
  {c:"続", on:["ゾク"], kun:["つづ"], a:"melanjutkan, berlanjut", jlpt:"N2"},
  {c:"止", on:["シ"], kun:["と"], a:"berhenti", jlpt:"N2"},
  {c:"変", on:["ヘン"], kun:["か"], a:"berubah, transformasi", jlpt:"N2"},
  {c:"化", on:["カ"], kun:["ば"], a:"perubahan, transformasi", jlpt:"N2"},
  {c:"改", on:["カイ"], kun:["あらた"], a:"memperbaiki, reformasi", jlpt:"N2"},
  {c:"更", on:["コウ"], kun:["さら"], a:"memperbarui, mengganti", jlpt:"N2"},

  // Gerakan & tindakan abstrak
  {c:"達", on:["タツ"], kun:["たち"], a:"mencapai, sampai", jlpt:"N2"},
  {c:"及", on:["キュウ"], kun:["およ"], a:"mencapai, meliputi", jlpt:"N2"},
  {c:"超", on:["チョウ"], kun:[], a:"melampaui, super", jlpt:"N2"},
  {c:"避", on:["ヒ"], kun:["さ"], a:"menghindari", jlpt:"N2"},
  {c:"防", on:["ボウ"], kun:["ふせ"], a:"mencegah, melindungi", jlpt:"N2"},
  {c:"守", on:["シュ"], kun:["まも"], a:"melindungi, menjaga", jlpt:"N2"},
  {c:"攻", on:["コウ"], kun:["せ"], a:"menyerang", jlpt:"N2"},
  {c:"破", on:["ハ"], kun:["やぶ"], a:"merusak, menghancurkan", jlpt:"N2"},
  {c:"損", on:["ソン"], kun:["そこ"], a:"kerugian, merugikan", jlpt:"N2"},
  {c:"救", on:["キュウ"], kun:["すく"], a:"menyelamatkan, pertolongan", jlpt:"N2"},

  // Kondisi & keadaan
  {c:"状", on:["ジョウ"], kun:[], a:"kondisi, keadaan", jlpt:"N2"},
  {c:"態", on:["タイ"], kun:[], a:"sikap, keadaan", jlpt:"N2"},
  {c:"安", on:["アン"], kun:["やす"], a:"stabil, aman", jlpt:"N2"},
  {c:"危", on:["キ"], kun:["あぶ"], a:"berbahaya", jlpt:"N2"},
  {c:"困", on:["コン"], kun:["こま"], a:"sulit, kesulitan", jlpt:"N2"},
  {c:"難", on:["ナン"], kun:["かた"], a:"sulit, susah", jlpt:"N2"},
  {c:"余", on:["ヨ"], kun:["あま"], a:"tersisa, lebih", jlpt:"N2"},
  {c:"限", on:["ゲン"], kun:["かぎ"], a:"batas, maksimal", jlpt:"N2"},
  {c:"欠", on:["ケツ"], kun:["か"], a:"kekurangan, hilang", jlpt:"N2"},
  {c:"充", on:["ジュウ"], kun:["あ"], a:"cukup, memenuhi", jlpt:"N2"},

  // Masyarakat & kehidupan
  {c:"齢", on:["レイ"], kun:["よわい"], a:"usia, umur", jlpt:"N2"},
  {c:"福", on:["フク"], kun:[], a:"kesejahteraan, berkah", jlpt:"N2"},
  {c:"祉", on:["シ"], kun:[], a:"kesejahteraan sosial", jlpt:"N2"},
  {c:"医", on:["イ"], kun:[], a:"medis, dokter", jlpt:"N2"},
  {c:"療", on:["リョウ"], kun:[], a:"perawatan, terapi", jlpt:"N2"},
  {c:"険", on:["ケン"], kun:[], a:"risiko, bahaya", jlpt:"N2"},
  {c:"健", on:["ケン"], kun:[], a:"sehat, kuat", jlpt:"N2"},
  {c:"康", on:["コウ"], kun:[], a:"kesehatan, selamat", jlpt:"N2"},
  {c:"労", on:["ロウ"], kun:["つか"], a:"tenaga kerja, bekerja keras", jlpt:"N2"},
  {c:"働", on:["ドウ"], kun:["はたら"], a:"bekerja, beraktivitas", jlpt:"N2"},

  // Informasi & media
  {c:"報", on:["ホウ"], kun:[], a:"laporan, berita", jlpt:"N2"},
  {c:"告", on:["コク"], kun:[], a:"pengumuman, memberitahukan", jlpt:"N2"},
  {c:"信", on:["シン"], kun:[], a:"percaya, kepercayaan", jlpt:"N2"},
  {c:"疑", on:["ギ"], kun:["うたが"], a:"meragukan, curiga", jlpt:"N2"},
  {c:"噂", on:["ソワ"], kun:["うわさ"], a:"rumor, gosip", jlpt:"N2"},
  {c:"伝", on:["デン"], kun:["つた"], a:"menyampaikan, mewariskan", jlpt:"N2"},
  {c:"載", on:["サイ"], kun:["の"], a:"memuat, mempublikasikan", jlpt:"N2"},
  {c:"放", on:["ホウ"], kun:["はな"], a:"menyiarkan, melepaskan", jlpt:"N2"},
  {c:"編", on:["ヘン"], kun:[], a:"menyusun, mengedit", jlpt:"N2"},
  {c:"集", on:["シュウ"], kun:["あつ"], a:"mengumpulkan, mengorganisir", jlpt:"N2"},

  // Waktu & urutan lanjutan
  {c:"期", on:["キ"], kun:[], a:"periode, jangka waktu", jlpt:"N2"},
  {c:"段", on:["ダン"], kun:[], a:"tahap, level", jlpt:"N2"},
  {c:"程", on:["テイ"], kun:[], a:"tingkat, prosedur", jlpt:"N2"},
  {c:"次", on:["ジ"], kun:["つぎ"], a:"berikutnya, selanjutnya", jlpt:"N2"},
  {c:"以", on:["イ"], kun:[], a:"sejak, menggunakan", jlpt:"N2"},
  {c:"際", on:["サイ"], kun:[], a:"saat, kesempatan", jlpt:"N2"},
  {c:"既", on:["キ"], kun:[], a:"sudah, sebelumnya", jlpt:"N2"},
  {c:"未", on:["ミ"], kun:[], a:"belum, masa depan", jlpt:"N2"},
  {c:"将", on:["ショウ"], kun:[], a:"akan, masa depan", jlpt:"N2"},
  {c:"常", on:["ジョウ"], kun:[], a:"selalu, normal", jlpt:"N2"},
  
  // Alam & lingkungan lanjutan
  {c:"災", on:["サイ"], kun:[], a:"bencana, malapetaka", jlpt:"N2"},
  {c:"害", on:["ガイ"], kun:[], a:"bahaya, kerusakan", jlpt:"N2"},
  {c:"氷", on:["ヒョウ"], kun:["こおり"], a:"es, beku", jlpt:"N2"},
  {c:"霧", on:["ム"], kun:["きり"], a:"kabut, embun", jlpt:"N2"},
  {c:"洪", on:["コウ"], kun:[], a:"banjir, luapan", jlpt:"N2"},

  // Sains & teknologi lanjutan
  {c:"磁", on:["ジ"], kun:["じ"], a:"magnetik", jlpt:"N2"},
  {c:"波", on:["ハ"], kun:["なみ"], a:"gelombang", jlpt:"N2"},
  {c:"熱", on:["ネツ"], kun:["あつ"], a:"panas, energi", jlpt:"N2"},
  {c:"光", on:["コウ"], kun:["ひかり"], a:"cahaya, sinar", jlpt:"N2"},
  {c:"電", on:["デン"], kun:[], a:"listrik, arus", jlpt:"N2"},

  // Perubahan & proses lanjutan
  {c:"融", on:["ユウ"], kun:["と"], a:"meleleh, mencair", jlpt:"N2"},
  {c:"沈", on:["チン"], kun:["しず"], a:"tenggelam, terendam", jlpt:"N2"},
  {c:"拡", on:["カク"], kun:["ひろ"], a:"memperluas, mengembang", jlpt:"N2"},
  {c:"縮", on:["シュク"], kun:["ちぢ"], a:"memperpendek, mengecil", jlpt:"N2"},
  {c:"変", on:["ヘン"], kun:["か"], a:"berubah, transformasi", jlpt:"N2"},

  // Gerakan & tindakan lanjutan
  {c:"跳", on:["チョウ"], kun:["は"], a:"melompat, melangkah", jlpt:"N2"},
  {c:"躍", on:["ヤク"], kun:[], a:"melompat, melonjak", jlpt:"N2"},
  {c:"舞", on:["ブ"], kun:["ま"], a:"menari, bergerak", jlpt:"N2"},
  {c:"振", on:["シン"], kun:["ふ"], a:"menggoyang, mengayunkan", jlpt:"N2"},
  {c:"投", on:["トウ"], kun:["な"], a:"melempar, menyerahkan", jlpt:"N2"},

  // Kondisi & keadaan lanjutan
  {c:"疲", on:["ヒ"], kun:["つか"], a:"lelah, capai", jlpt:"N2"},
  {c:"眠", on:["ミン"], kun:["ねむ"], a:"tidur, mengantuk", jlpt:"N2"},
  {c:"健", on:["ケン"], kun:[], a:"sehat, kuat", jlpt:"N2"},
  {c:"弱", on:["ジャク"], kun:["よわ"], a:"lemah, kurang", jlpt:"N2"},
  {c:"強", on:["キョウ"], kun:["つよ"], a:"kuat, perkasa", jlpt:"N2"},

  // Masyarakat & kehidupan lanjutan
  {c:"議", on:["ギ"], kun:["はか"], a:"diskusi, perundingan", jlpt:"N2"},
  {c:"論", on:["ロン"], kun:[], a:"teori, argumen", jlpt:"N2"},
  {c:"法", on:["ホウ"], kun:[], a:"hukum, metode", jlpt:"N2"},
  {c:"規", on:["キ"], kun:[], a:"aturan, norma", jlpt:"N2"},
  {c:"則", on:["ソク"], kun:[], a:"peraturan, prinsip", jlpt:"N2"},

  // Informasi & media lanjutan
  {c:"掲", on:["ケイ"], kun:["かか"], a:"menampilkan, memajang", jlpt:"N2"},
  {c:"載", on:["サイ"], kun:["の"], a:"memuat, menulis", jlpt:"N2"},
  {c:"放", on:["ホウ"], kun:["はな"], a:"menyiarkan, membebaskan", jlpt:"N2"},
  {c:"編", on:["ヘン"], kun:[], a:"menyusun, mengedit", jlpt:"N2"},
  {c:"集", on:["シュウ"], kun:["あつ"], a:"mengumpulkan, mengorganisir", jlpt:"N2"},

  // Waktu & urutan lanjutan
  {c:"期", on:["キ"], kun:[], a:"periode, jangka waktu", jlpt:"N2"},
  {c:"段", on:["ダン"], kun:[], a:"tahap, level", jlpt:"N2"},
  {c:"程", on:["テイ"], kun:[], a:"tingkat, prosedur", jlpt:"N2"},
  {c:"次", on:["ジ"], kun:["つぎ"], a:"selanjutnya, berikutnya", jlpt:"N2"},
  {c:"以", on:["イ"], kun:[], a:"sejak, menggunakan", jlpt:"N2"},
  {c:"際", on:["サイ"], kun:[], a:"saat, kesempatan", jlpt:"N2"},
  {c:"既", on:["キ"], kun:[], a:"sudah, sebelumnya", jlpt:"N2"},
  {c:"未", on:["ミ"], kun:[], a:"belum, masa depan", jlpt:"N2"},
  {c:"将", on:["ショウ"], kun:[], a:"akan, masa depan", jlpt:"N2"},
  {c:"常", on:["ジョウ"], kun:[], a:"selalu, normal", jlpt:"N2"},
  
  // Abstrak & logika lanjutan
  {c:"概", on:["ガイ"], kun:[], a:"garis besar, ringkasan", jlpt:"N2"},
  {c:"傾", on:["ケイ"], kun:["かたむ"], a:"kecenderungan, miring", jlpt:"N2"},
  {c:"象", on:["ショウ"], kun:[], a:"fenomena, citra", jlpt:"N2"},
  {c:"抽", on:["チュウ"], kun:[], a:"abstrak, menarik", jlpt:"N2"},
  {c:"具", on:["グ"], kun:[], a:"konkret, alat", jlpt:"N2"},

  // Penilaian & analisis lanjutan
  {c:"評", on:["ヒョウ"], kun:[], a:"menilai, ulasan", jlpt:"N2"},
  {c:"批", on:["ヒ"], kun:[], a:"mengkritik, evaluasi", jlpt:"N2"},
  {c:"較", on:["カク"], kun:[], a:"membandingkan", jlpt:"N2"},
  {c:"検", on:["ケン"], kun:[], a:"memeriksa, meneliti", jlpt:"N2"},
  {c:"証", on:["ショウ"], kun:[], a:"membuktikan, sertifikat", jlpt:"N2"},

  // Hubungan sosial & sikap lanjutan
  {c:"協", on:["キョウ"], kun:[], a:"kerja sama", jlpt:"N2"},
  {c:"争", on:["ソウ"], kun:["あらそ"], a:"konflik, bertikai", jlpt:"N2"},
  {c:"抗", on:["コウ"], kun:["あらが"], a:"melawan, menentang", jlpt:"N2"},
  {c:"抵", on:["テイ"], kun:["た"], a:"menentang, menahan", jlpt:"N2"},
  {c:"譲", on:["ジョウ"], kun:["ゆず"], a:"mengalah, menyerahkan", jlpt:"N2"},

  // Sistem & struktur lanjutan
  {c:"構", on:["コウ"], kun:["かま"], a:"struktur, membangun", jlpt:"N2"},
  {c:"築", on:["チク"], kun:["きず"], a:"membangun, konstruksi", jlpt:"N2"},
  {c:"編", on:["ヘン"], kun:[], a:"menyusun, menyunting", jlpt:"N2"},
  {c:"属", on:["ゾク"], kun:[], a:"termasuk, bagian", jlpt:"N2"},
  {c:"配", on:["ハイ"], kun:["くば"], a:"mendistribusikan, membagikan", jlpt:"N2"},

  // Bahasa formal & tulisan lanjutan
  {c:"述", on:["ジュツ"], kun:["の"], a:"menguraikan, menyatakan", jlpt:"N2"},
  {c:"記", on:["キ"], kun:[], a:"mencatat, catatan", jlpt:"N2"},
  {c:"掲", on:["ケイ"], kun:["かか"], a:"menampilkan, memajang", jlpt:"N2"},
  {c:"訳", on:["ヤク"], kun:[], a:"terjemahan", jlpt:"N2"},
  {c:"釈", on:["シャク"], kun:[], a:"penjelasan, interpretasi", jlpt:"N2"},

  // Keadaan & kualitas lanjutan
  {c:"適", on:["テキ"], kun:[], a:"sesuai, cocok", jlpt:"N2"},
  {c:"均", on:["キン"], kun:[], a:"seimbang, rata", jlpt:"N2"},
  {c:"豊", on:["ホウ"], kun:[], a:"melimpah, kaya", jlpt:"N2"},
  {c:"貧", on:["ヒン"], kun:[], a:"miskin, kurang", jlpt:"N2"},
  {c:"純", on:["ジュン"], kun:[], a:"murni, bersih", jlpt:"N2"},

  // Arah pemikiran & keputusan lanjutan
  {c:"企", on:["キ"], kun:[], a:"merencanakan, memulai", jlpt:"N2"},
  {c:"志", on:["シ"], kun:[], a:"niat, tujuan", jlpt:"N2"},
  {c:"望", on:["ボウ"], kun:["のぞ"], a:"harapan, keinginan", jlpt:"N2"},
  {c:"覚", on:["カク"], kun:["おぼ"], a:"menyadari, mengingat", jlpt:"N2"},
  {c:"悟", on:["ゴ"], kun:["さと"], a:"memahami, pencerahan", jlpt:"N2"},

  // Waktu, perubahan & hasil lanjutan
  {c:"遅", on:["チ"], kun:["おく"], a:"terlambat", jlpt:"N2"},
  {c:"速", on:["ソク"], kun:["はや"], a:"cepat", jlpt:"N2"},
  {c:"延", on:["エン"], kun:["の"], a:"menunda, memperpanjang", jlpt:"N2"},
  {c:"縮", on:["シュク"], kun:["ちぢ"], a:"memendekkan, mengecilkan", jlpt:"N2"},
  {c:"拡", on:["カク"], kun:["ひろ"], a:"memperluas", jlpt:"N2"},
  {c:"果", on:["カ"], kun:[], a:"hasil, buah", jlpt:"N2"},
  
  // Alam & lingkungan lanjut
  {c:"環境", on:["カンキョウ"], kun:[], a:"lingkungan", jlpt:"N2"},
  {c:"保護", on:["ホゴ"], kun:[], a:"perlindungan", jlpt:"N2"},
  {c:"汚染", on:["オセン"], kun:[], a:"pencemaran", jlpt:"N2"},
  {c:"清掃", on:["セイソウ"], kun:[], a:"pembersihan", jlpt:"N2"},
  {c:"害悪", on:["ガイアク"], kun:[], a:"kerugian, bahaya", jlpt:"N2"},

  // Sains & teknologi lanjut
  {c:"技術", on:["ギジュツ"], kun:[], a:"teknologi, teknik", jlpt:"N2"},
  {c:"研究", on:["ケンキュウ"], kun:[], a:"penelitian", jlpt:"N2"},
  {c:"実験", on:["ジッケン"], kun:[], a:"eksperimen", jlpt:"N2"},
  {c:"機能", on:["キノウ"], kun:[], a:"fungsi, kemampuan", jlpt:"N2"},
  {c:"効率", on:["コウリツ"], kun:[], a:"efisiensi, tingkat", jlpt:"N2"},

  // Perubahan & proses lanjutan
  {c:"改善", on:["カイゼン"], kun:[], a:"perbaikan, peningkatan", jlpt:"N2"},
  {c:"更新", on:["コウシン"], kun:[], a:"pembaruan", jlpt:"N2"},
  {c:"進行", on:["シンコウ"], kun:[], a:"proses, kemajuan", jlpt:"N2"},
  {c:"維持", on:["イジ"], kun:[], a:"pemeliharaan", jlpt:"N2"},
  {c:"移行", on:["イコウ"], kun:[], a:"perpindahan, transisi", jlpt:"N2"},

  // Gerakan & tindakan abstrak lanjut
  {c:"達成", on:["タッセイ"], kun:[], a:"pencapaian", jlpt:"N2"},
  {c:"超過", on:["チョウカ"], kun:[], a:"melewati, berlebihan", jlpt:"N2"},
  {c:"回避", on:["カイヒ"], kun:[], a:"menghindari", jlpt:"N2"},
  {c:"防止", on:["ボウシ"], kun:[], a:"pencegahan", jlpt:"N2"},
  {c:"救済", on:["キュウサイ"], kun:[], a:"pertolongan, bantuan", jlpt:"N2"},

  // Kondisi & keadaan lanjut
  {c:"状態", on:["ジョウタイ"], kun:[], a:"keadaan, kondisi", jlpt:"N2"},
  {c:"安定", on:["アンテイ"], kun:[], a:"stabil, aman", jlpt:"N2"},
  {c:"危険", on:["キケン"], kun:[], a:"bahaya", jlpt:"N2"},
  {c:"困難", on:["コンナン"], kun:[], a:"kesulitan, sulit", jlpt:"N2"},
  {c:"限度", on:["ゲンド"], kun:[], a:"batas maksimum", jlpt:"N2"},

  // Masyarakat & kehidupan lanjut
  {c:"福祉", on:["フクシ"], kun:[], a:"kesejahteraan sosial", jlpt:"N2"},
  {c:"医療", on:["イリョウ"], kun:[], a:"perawatan medis", jlpt:"N2"},
  {c:"健康", on:["ケンコウ"], kun:[], a:"kesehatan", jlpt:"N2"},
  {c:"労働", on:["ロウドウ"], kun:[], a:"tenaga kerja", jlpt:"N2"},
  {c:"就業", on:["シュウギョウ"], kun:[], a:"pekerjaan, bekerja", jlpt:"N2"},

  // Informasi & media lanjut
  {c:"報告", on:["ホウコク"], kun:[], a:"laporan, pemberitahuan", jlpt:"N2"},
  {c:"伝達", on:["デンタツ"], kun:[], a:"penyampaian, menyampaikan", jlpt:"N2"},
  {c:"放送", on:["ホウソウ"], kun:[], a:"penyiaran", jlpt:"N2"},
  {c:"編集", on:["ヘンシュウ"], kun:[], a:"menyusun, mengedit", jlpt:"N2"},
  {c:"収集", on:["シュウシュウ"], kun:[], a:"pengumpulan", jlpt:"N2"},

  // Waktu & urutan lanjutan
  {c:"期間", on:["キカン"], kun:[], a:"periode, jangka waktu", jlpt:"N2"},
  {c:"段階", on:["ダンカイ"], kun:[], a:"tahap, level", jlpt:"N2"},
  {c:"程度", on:["テイド"], kun:[], a:"tingkat, derajat", jlpt:"N2"},
  {c:"次第", on:["シダイ"], kun:[], a:"urutan, bergantung pada", jlpt:"N2"},
  {c:"既存", on:["キソン"], kun:[], a:"yang sudah ada", jlpt:"N2"}
];
