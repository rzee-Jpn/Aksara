export let pool = [];
export let questionQueue = [];
export let current = null;

export let hp = 3;
export let combo = 0;
export let bestCombo = 0;
export let survival = false;
export let revived = false;
export let lastWorld = "hangeul_basic";

export let total = 0;
export let correct = 0;
export let locked = false;

export const STORAGE_KEY = "kss_pro";
export const synth = "speechSynthesis" in window ? window.speechSynthesis : null;

export function resetStats(isSurvival) {
  hp = isSurvival ? Infinity : 3;
  combo = 0;
  bestCombo = 0;
  total = 0;
  correct = 0;
  locked = false;
}
