import { CONTENT } from "./content/index.js";
import { WORLDS } from "./worlds.js";
import { UI } from "./ui.js";
import { playTTS, vibrate } from "./audio.js";

/* ================= STATE ================= */
export const State = {
  pool: [],
  queue: [],
  current: null,

  hp: 3,
  combo: 0,
  bestCombo: 0,
  survival: false,
  revived: false,
  lastWorld: "hangeul_basic",

  total: 0,
  correct: 0,
  locked: false,

  lessonSteps: [],
  lessonIndex: 0,
  inLesson: false,
};

/* ================= UTIL ================= */
export const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ================= LESSON ================= */
export const startLesson = worldId => {
  State.lastWorld = worldId;
  State.inLesson = true;

  State.lessonSteps = CONTENT
    .filter(WORLDS[worldId].filter)
    .filter(q => q.rule || q.phonetic || q.heard)
    .slice(0, 3);

  if (!State.lessonSteps.length) {
    startGame(worldId);
    return;
  }

  State.lessonIndex = 0;
  UI.renderLesson(State);
  UI.show("lesson");
};

/* ================= GAME ================= */
const resetSession = () => {
  State.combo = 0;
  State.bestCombo = 0;
  State.total = 0;
  State.correct = 0;
  State.locked = false;
};

export const startGame = (worldId, isSurvival = false) => {
  State.survival = isSurvival;
  State.revived = false;
  State.lastWorld = worldId;
  State.hp = isSurvival ? Infinity : 3;

  resetSession();

  State.pool = CONTENT.filter(WORLDS[worldId].filter);
  State.queue = shuffle(State.pool);

  if (!State.queue.length) {
    alert("Konten belum tersedia.");
    return UI.show("world");
  }

  UI.updateHUD(State);
  UI.show("game");
  nextQuestion();
};

export const nextQuestion = () => {
  if (!State.survival && State.hp <= 0) return UI.showGameOver(State);
  if (!State.queue.length) State.queue = shuffle(State.pool);

  State.current = State.queue.pop();
  UI.renderChoices(State.current, checkAnswer);
};

export const checkAnswer = (choice, btn) => {
  if (State.locked) return;
  State.locked = true;
  State.total++;

  UI.revealAnswer(State.current.answer);

  if (choice === State.current.answer) {
    State.correct++;
    State.combo++;
    State.bestCombo = Math.max(State.bestCombo, State.combo);
    UI.feedback("✅ Benar!");
    vibrate([20]);
  } else {
    if (!State.survival) State.hp--;
    State.combo = 0;
    UI.feedback("❌ Salah", true, btn);
    vibrate([40, 30, 40]);
  }

  UI.updateHUD(State);

  setTimeout(() => {
    UI.clearFeedback();
    State.locked = false;
    nextQuestion();
  }, 700);
};

/* ================= AUDIO ================= */
export const playQuestionAudio = () => {
  if (!State.current) return;
  playTTS(State.current.tts);
};