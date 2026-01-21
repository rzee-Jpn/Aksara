export const ASSIMILATION = [
  // ======================
  // 동일 자음 동화
  // ======================
  {
    id:"han-guk",
    category:"assimilation",
    hangul:"한국",
    tts:"한국",
    heard:"한국",
    rule:"ㄱ + ㄱ → [k]",
    options:["한국","한굳","한궁"],
    answer:"한국",
    weight:1,
    errorCount:0
  },

  // ======================
  // 비음화 (Nasal)
  // ======================
  {
    id:"ham-ni-da",
    category:"assimilation",
    hangul:"합니다",
    tts:"합니다",
    heard:"함니다",
    rule:"ㅂ + ㄴ → ㅁㄴ",
    options:["합니다","함니다","합니다"],
    answer:"합니다",
    weight:1,
    errorCount:0
  },
  {
    id:"guk-mul",
    category:"assimilation",
    hangul:"국물",
    tts:"국물",
    heard:"궁물",
    rule:"ㄱ + ㅁ → ㅇㅁ",
    options:["국물","궁물","국불"],
    answer:"국물",
    weight:1,
    errorCount:0
  },
  {
    id:"ap-mun",
    category:"assimilation",
    hangul:"앞문",
    tts:"앞문",
    heard:"암문",
    rule:"ㅂ + ㅁ → ㅁㅁ",
    options:["앞문","압문","암문"],
    answer:"앞문",
    weight:1,
    errorCount:0
  },

  // ======================
  // 유음화 (Liquid)
  // ======================
  {
    id:"sin-ra",
    category:"assimilation",
    hangul:"신라",
    tts:"신라",
    heard:"실라",
    rule:"ㄴ + ㄹ → ㄹㄹ",
    options:["신라","신나","실라"],
    answer:"신라",
    weight:1,
    errorCount:0
  },
  {
    id:"seol-nal",
    category:"assimilation",
    hangul:"설날",
    tts:"설날",
    heard:"설랄",
    rule:"ㄹ + ㄴ → ㄹㄹ",
    options:["설날","설날","설랄"],
    answer:"설날",
    weight:1,
    errorCount:0
  },

  // ======================
  // 경음화 (Tensification)
  // ======================
  {
    id:"hak-gyo",
    category:"assimilation",
    hangul:"학교",
    tts:"학교",
    heard:"학꾜",
    rule:"ㄱ + ㄱ → ㄲ",
    options:["학교","학교","학꾜"],
    answer:"학교",
    weight:1,
    errorCount:0
  },
  {
    id:"ip-da",
    category:"assimilation",
    hangul:"입다",
    tts:"입다",
    heard:"입따",
    rule:"ㅂ + ㄷ → ㄸ",
    options:["입다","입다","입따"],
    answer:"입다",
    weight:1,
    errorCount:0
  },

  // ======================
  // 구개음화 (Palatalization)
  // ======================
  {
    id:"hae-ji",
    category:"assimilation",
    hangul:"해지다",
    tts:"해지다",
    heard:"해지다",
    rule:"ㄷ + ㅣ → ㅈ",
    options:["해지다","해디다","해기다"],
    answer:"해지다",
    weight:1,
    errorCount:0
  },
  {
    id:"gachi",
    category:"assimilation",
    hangul:"같이",
    tts:"같이",
    heard:"가치",
    rule:"ㅌ + ㅣ → ㅊ",
    options:["같이","가티","가치"],
    answer:"같이",
    weight:1,
    errorCount:0
  },

  // ======================
  // ㅎ 약화 / 탈락
  // ======================
  {
    id:"jo-a",
    category:"assimilation",
    hangul:"좋아",
    tts:"좋아",
    heard:"조아",
    rule:"ㅎ 탈락",
    options:["좋아","조하","조아"],
    answer:"좋아",
    weight:1,
    errorCount:0
  },
  {
    id:"ma-ni",
    category:"assimilation",
    hangul:"많이",
    tts:"많이",
    heard:"마니",
    rule:"ㄶ + ㅇ → ㄴ",
    options:["많이","만히","마니"],
    answer:"많이",
    weight:1,
    errorCount:0
  }
];
