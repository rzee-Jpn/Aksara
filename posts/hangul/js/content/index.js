import { CONSONANT } from "./hangeul/hangeul_basic.js";
import { VOWEL } from "./hangeul/hangeul_vowel.js";
import { INITIAL } from "./hangeul/hangeul_initial.js";
import { ASSIMILATION } from "./hangeul/hangeul_assimilation.js";
import { BATCHIM_LEVEL_1 } from "./batchim/batchiml1.js";
import { BATCHIM_LEVEL_2 } from "./batchim/batchiml2.js";
import { BATCHIM_LEVEL_3 } from "./batchim/batchiml3.js";
import { BATCHIM_LEVEL_4 } from "./batchim/batchiml4.js";


export const CONTENT = [
  ...CONSONANT,
  ...VOWEL,
  ...INITIAL,
  ...ASSIMILATION,
  ...BATCHIM_LEVEL_1,
  ...BATCHIM_LEVEL_2,
  ...BATCHIM_LEVEL_3,
  ...BATCHIM_LEVEL_4
];
