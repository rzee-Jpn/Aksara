export const BATCHIM_LEVEL_4 = [
  // =========================
  // 연음 (Liaison)
  // =========================
  {
    id:"l4_link_1",
    level:4,
    category:"batchim",
    hangul:"꽃이",
    tts:"꽃이",
    batchim:"ㅊ + ㅇ",
    phonetic:"[꼬치]",
    rule:"연음",
    options:["꽃이","꽃니","꼬시"],
    answer:"꽃이",
    weight:1,
    errorCount:0
  },
  {
    id:"l4_link_2",
    level:4,
    category:"batchim",
    hangul:"값이",
    tts:"값이",
    batchim:"ㅄ + ㅇ",
    phonetic:"[갑씨]",
    rule:"연음 + 된소리",
    options:["값이","갑시","갑씨"],
    answer:"값이",
    weight:1,
    errorCount:0
  },

  // =========================
  // 비음화 (Nasalization)
  // =========================
  {
    id:"l4_nasal_1",
    level:4,
    category:"batchim",
    hangul:"국물",
    tts:"국물",
    batchim:"ㄱ + ㅁ",
    phonetic:"[궁물]",
    rule:"비음화",
    options:["국물","국불","궁물"],
    answer:"국물",
    weight:1,
    errorCount:0
  },
  {
    id:"l4_nasal_2",
    level:4,
    category:"batchim",
    hangul:"앞문",
    tts:"앞문",
    batchim:"ㅂ + ㅁ",
    phonetic:"[암문]",
    rule:"비음화",
    options:["앞문","압문","암문"],
    answer:"앞문",
    weight:1,
    errorCount:0
  },

  // =========================
  // 유음화 (Liquid)
  // =========================
  {
    id:"l4_liquid_1",
    level:4,
    category:"batchim",
    hangul:"신라",
    tts:"신라",
    batchim:"ㄴ + ㄹ",
    phonetic:"[실라]",
    rule:"유음화",
    options:["신라","신나","실라"],
    answer:"신라",
    weight:1,
    errorCount:0
  },
  {
    id:"l4_liquid_2",
    level:4,
    category:"batchim",
    hangul:"설날",
    tts:"설날",
    batchim:"ㄹ + ㄴ",
    phonetic:"[설랄]",
    rule:"유음화",
    options:["설날","설날","설랄"],
    answer:"설날",
    weight:1,
    errorCount:0
  },

  // =========================
  // 된소리 (Tensification)
  // =========================
  {
    id:"l4_tense_1",
    level:4,
    category:"batchim",
    hangul:"읽다",
    tts:"읽다",
    batchim:"ㄺ + ㄷ",
    phonetic:"[익따]",
    rule:"된소리",
    options:["읽다","일다","익다"],
    answer:"읽다",
    weight:1,
    errorCount:0
  },
  {
    id:"l4_tense_2",
    level:4,
    category:"batchim",
    hangul:"학교",
    tts:"학교",
    batchim:"ㄱ + ㄱ",
    phonetic:"[학꾜]",
    rule:"된소리",
    options:["학교","학교","학꾜"],
    answer:"학교",
    weight:1,
    errorCount:0
  },

  // =========================
  // ㅎ 탈락 / 약화
  // =========================
  {
    id:"l4_h_1",
    level:4,
    category:"batchim",
    hangul:"좋아",
    tts:"좋아",
    batchim:"ㅎ + ㅇ",
    phonetic:"[조아]",
    rule:"ㅎ 탈락",
    options:["좋아","조하","조아"],
    answer:"좋아",
    weight:1,
    errorCount:0
  },
  {
    id:"l4_h_2",
    level:4,
    category:"batchim",
    hangul:"많이",
    tts:"많이",
    batchim:"ㄶ + ㅇ",
    phonetic:"[마니]",
    rule:"ㅎ 탈락 + 연음",
    options:["많이","만히","마니"],
    answer:"많이",
    weight:1,
    errorCount:0
  }
];
