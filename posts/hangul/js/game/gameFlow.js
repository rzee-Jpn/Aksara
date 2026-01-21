import { CONTENT } from "../content/index.js";
import { WORLDS } from "../worlds.js";
import * as state from "../core/state.js";
import { shuffle } from "../core/utils.js";
import { showScreen } from "../screens/screen.js";
import { renderChoices, updateUI } from "./ui.js";

export function startGame(worldId, isSurvival = false) {
  state.survival = isSurvival;
  state.revived = false;
  state.lastWorld = worldId;

  state.resetStats(isSurvival);

  state.pool = CONTENT.filter(WORLDS[worldId].filter);
  state.questionQueue = shuffle(state.pool);

  if (!state.questionQueue.length) {
    alert("Konten belum tersedia.");
    showScreen("world");
    return;
  }

  updateUI();
  showScreen("game");
  nextQuestion();
}

export function nextQuestion() {
  if (!state.survival && state.hp <= 0) {
    showScreen("gameover");
    return;
  }
  state.current = state.questionQueue.pop();
  renderChoices(state.current);
}
