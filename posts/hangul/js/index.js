import { $, UI } from "./ui.js";
import {
  startLesson,
  startGame,
  playQuestionAudio,
  State
} from "./core.js";

/* HOME */
$("btnStart").onclick = () => UI.show("world");

/* GAME */
$("btnPlayAudio").onclick = playQuestionAudio;
$("btnBackToWorld").onclick = () => UI.show("world");
$("btnGoWorld").onclick = () => UI.show("world");
$("btnRetry").onclick = () => startGame(State.lastWorld, State.survival);

/* LESSON */
$("btnLessonNext").onclick = () => {
  if (State.lessonIndex < State.lessonSteps.length - 1) {
    State.lessonIndex++;
    UI.renderLesson(State);
  } else {
    State.inLesson = false;
    startGame(State.lastWorld);
  }
};

$("btnLessonAudio").onclick = () => {
  const q = State.lessonSteps[State.lessonIndex];
  q?.tts && playQuestionAudio();
};

/* REVIVE */
$("btnRevive").onclick = () => {
  State.revived = true;
  State.hp = 1;
  UI.show("game");
};

/* SURVIVAL */
const STORAGE_KEY = "kss_pro";
$("btnSurvival").onclick = () => {
  localStorage.getItem(STORAGE_KEY) === "1"
    ? startGame(State.lastWorld, true)
    : $("subscribe").classList.add("show");
};

/* SUBSCRIBE */
$("btnFakeSubscribe").onclick = () => {
  localStorage.setItem(STORAGE_KEY, "1");
  $("subscribe").classList.remove("show");
};
$("btnCloseSubscribe").onclick = () =>
  $("subscribe").classList.remove("show");

/* WORLDS */
[
  ["btnHangeulBasic", "hangeul_basic"],
  ["btnHangeulVowel", "hangeul_vowel"],
  ["btnHangeulInitial", "hangeul_initial"],
  ["btnAssimilation", "assimilation"],
  ["btnBatchimL1", "batchim_l1"],
  ["btnBatchimL2", "batchim_l2"],
  ["btnBatchimL3", "batchim_l3"],
  ["btnBatchimL4", "batchim_l4"],
].forEach(([id, world]) =>
  $(id).onclick = () => startLesson(world)
);