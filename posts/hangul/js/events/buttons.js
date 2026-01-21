import {
  btnStart,
  btnSurvival,
  btnRevive,
  btnRetry,
  btnGoWorld,
  btnPlayAudio,
  btnBackToWorld,
  btnHangeulBasic,
  btnHangeulVowel,
  btnHangeulInitial,
  btnAssimilation,
  btnBatchimL1,
  btnBatchimL2,
  btnBatchimL3,
  btnBatchimL4,
  btnFakeSubscribe,
  btnCloseSubscribe
} from "../core/elements.js";

import { startGame } from "../game/gameFlow.js";
import { playSound } from "../game/audio.js";
import { showScreen } from "../screens/screen.js";
import { STORAGE_KEY } from "../core/state.js";

/* ================= MAIN MENU ================= */

btnStart.onclick = () => showScreen("world");

/* ================= WORLD SELECT ================= */

btnHangeulBasic.onclick = () => startGame("hangeul_basic");
btnHangeulVowel.onclick = () => startGame("hangeul_vowel");
btnHangeulInitial.onclick = () => startGame("hangeul_initial");
btnAssimilation.onclick = () => startGame("assimilation");
btnBatchimL1.onclick = () => startGame("batchim_l1");
btnBatchimL2.onclick = () => startGame("batchim_l2");
btnBatchimL3.onclick = () => startGame("batchim_l3");
btnBatchimL4.onclick = () => startGame("batchim_l4");

/* ================= GAME CONTROL ================= */

btnRetry.onclick = () => startGame(undefined, false); // akan diganti di bawah
btnGoWorld.onclick = () => showScreen("world");
btnBackToWorld.onclick = () => showScreen("world");

btnPlayAudio.onclick = playSound;

/* ================= SURVIVAL MODE ================= */

btnSurvival.onclick = () => {
  if (localStorage.getItem(STORAGE_KEY) === "1") {
    // lastWorld diambil dari state
    import("../core/state.js").then(m =>
      startGame(m.lastWorld, true)
    );
  } else {
    document.getElementById("subscribe").classList.add("show");
  }
};

/* ================= REVIVE ================= */

btnRevive.onclick = async () => {
  const state = await import("../core/state.js");
  state.revived = true;
  state.hp = 1;
  showScreen("game");
  import("../game/gameFlow.js").then(m => m.nextQuestion());
};

/* ================= SUBSCRIBE ================= */

btnFakeSubscribe.onclick = () => {
  localStorage.setItem(STORAGE_KEY, "1");
  document.getElementById("subscribe").classList.remove("show");
};

btnCloseSubscribe.onclick = () => {
  document.getElementById("subscribe").classList.remove("show");
};
