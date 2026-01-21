import { CONTENT } from "./content/index.js";
import { WORLDS } from "./worlds.js";

/* ================= STATE ================= */
let pool = [];
let queue = [];
let current = null;

/* game */
let hp = 3;
let combo = 0;
let bestCombo = 0;
let survival = false;
let revived = false;
let lastWorld = "hangeul_basic";

let total = 0;
let correct = 0;
let locked = false;

/* lesson */
let lessonSteps = [];
let lessonIndex = 0;
let inLesson = false;

const STORAGE_KEY = "kss_pro";
const synth = "speechSynthesis" in window ? window.speechSynthesis : null;

/* ================= ELEMENTS ================= */
const $ = id => document.getElementById(id);

const el = {
  btnStart: $("btnStart"),
  btnSurvival: $("btnSurvival"),
  btnRevive: $("btnRevive"),
  btnRetry: $("btnRetry"),
  btnGoWorld: $("btnGoWorld"),
  btnPlayAudio: $("btnPlayAudio"),
  btnBackToWorld: $("btnBackToWorld"),

  btnLessonNext: $("btnLessonNext"),
  btnLessonAudio: $("btnLessonAudio"),

  lessonHangul: $("lessonHangul"),
  lessonPhonetic: $("lessonPhonetic"),
  lessonRule: $("lessonRule"),

  subscribe: $("subscribe"),
  statTotal: $("statTotal"),
  statCorrect: $("statCorrect"),
  statBestCombo: $("statBestCombo"),
  hp: $("hp"),
  combo: $("combo"),
  choices: $("choices"),
  feedback: $("feedback"),
  questionBox: $("questionBox"),
};

/* ================= UTIL ================= */
const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const showScreen = id => {
  document.querySelectorAll(".screen")
    .forEach(s => s.classList.remove("active"));
  $(id)?.classList.add("active");
};

/* ================= LESSON ENGINE ================= */
const startLesson = worldId => {
  lastWorld = worldId;
  inLesson = true;

  lessonSteps = CONTENT
    .filter(WORLDS[worldId].filter)
    .filter(q => q.rule || q.phonetic || q.heard)
    .slice(0, 3); // maksimal 3 step

  if (!lessonSteps.length) {
    startGame(worldId);
    return;
  }

  lessonIndex = 0;
  renderLesson();
  showScreen("lesson");
};

const renderLesson = () => {
  const q = lessonSteps[lessonIndex];

  el.lessonHangul.textContent = q.hangul || "";
  el.lessonPhonetic.textContent = q.phonetic || q.heard || "";
  el.lessonRule.textContent = q.rule || "";

  el.btnLessonNext.textContent =
    lessonIndex === lessonSteps.length - 1
      ? "Mulai Quiz"
      : "Next →";
};

/* ================= GAME CORE ================= */
const resetSession = () => {
  combo = 0;
  bestCombo = 0;
  total = 0;
  correct = 0;
  locked = false;
};

const startGame = (worldId, isSurvival = false) => {
  survival = isSurvival;
  revived = false;
  lastWorld = worldId;
  hp = survival ? Infinity : 3;

  resetSession();

  pool = CONTENT.filter(WORLDS[worldId].filter);
  queue = shuffle(pool);

  if (!queue.length) {
    alert("Konten belum tersedia.");
    return showScreen("world");
  }

  updateUI();
  showScreen("game");
  nextQuestion();
};

const nextQuestion = () => {
  if (!survival && hp <= 0) return showGameOver();
  if (!queue.length) queue = shuffle(pool);
  current = queue.pop();
  renderChoices();
};

/* ================= AUDIO ================= */
const playSound = () => {
  if (!current || !synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(current.tts);
  u.lang = "ko-KR";
  u.rate = 0.85;
  synth.speak(u);
};

/* ================= ANSWER ================= */
const checkAnswer = (choice, btn) => {
  if (locked) return;
  locked = true;
  total++;

  [...el.choices.children].forEach(b => {
    b.classList.add(
      b.textContent === current.answer ? "correct" : "dim"
    );
  });

  if (choice === current.answer) {
    correct++;
    combo++;
    bestCombo = Math.max(bestCombo, combo);
    el.feedback.textContent = "✅ Benar!";
    vibrate([20]);
  } else {
    if (!survival) hp--;
    combo = 0;
    el.feedback.textContent = "❌ Salah";
    el.questionBox.classList.add("shake");
    vibrate([40, 30, 40]);
    btn.classList.add("wrong");
  }

  updateUI();

  setTimeout(() => {
    el.feedback.textContent = "";
    el.questionBox.classList.remove("shake");
    locked = false;
    nextQuestion();
  }, 700);
};

/* ================= UI ================= */
const renderChoices = () => {
  el.choices.innerHTML = "";
  shuffle(current.options).forEach(o => {
    const b = document.createElement("button");
    b.textContent = o;
    b.onclick = () => checkAnswer(o, b);
    el.choices.appendChild(b);
  });
};

const updateUI = () => {
  el.hp.textContent = survival ? "∞" : hp;
  el.combo.textContent = combo;
};

const showGameOver = () => {
  el.statTotal.textContent = total;
  el.statCorrect.textContent = correct;
  el.statBestCombo.textContent = bestCombo;
  el.btnRevive.style.display = revived ? "none" : "block";
  showScreen("gameover");
};

/* ================= VIBRATION ================= */
const vibrate = p =>
  "vibrate" in navigator && navigator.vibrate(p);

/* ================= EVENTS ================= */
el.btnStart.onclick = () => showScreen("world");
el.btnPlayAudio.onclick = playSound;
el.btnBackToWorld.onclick = () => showScreen("world");
el.btnGoWorld.onclick = () => showScreen("world");

el.btnLessonNext.onclick = () => {
  if (lessonIndex < lessonSteps.length - 1) {
    lessonIndex++;
    renderLesson();
  } else {
    inLesson = false;
    startGame(lastWorld);
  }
};

el.btnLessonAudio.onclick = () => {
  const q = lessonSteps[lessonIndex];
  if (!synth || !q.tts) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(q.tts);
  u.lang = "ko-KR";
  u.rate = 0.85;
  synth.speak(u);
};

el.btnRevive.onclick = () => {
  revived = true;
  hp = 1;
  showScreen("game");
  nextQuestion();
};

el.btnRetry.onclick = () => startGame(lastWorld, survival);

el.btnSurvival.onclick = () => {
  localStorage.getItem(STORAGE_KEY) === "1"
    ? startGame(lastWorld, true)
    : el.subscribe.classList.add("show");
};

/* WORLD BUTTONS */
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

/* SUBSCRIBE */
$("btnFakeSubscribe").onclick = () => {
  localStorage.setItem(STORAGE_KEY, "1");
  el.subscribe.classList.remove("show");
};

$("btnCloseSubscribe").onclick = () => {
  el.subscribe.classList.remove("show");
};