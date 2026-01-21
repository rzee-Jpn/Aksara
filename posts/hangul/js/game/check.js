import * as state from "../core/state.js";
import { vibrate } from "../core/utils.js";
import { updateUI } from "./ui.js";
import { nextQuestion } from "./gameFlow.js";

export function checkAnswer(choice, btn) {
  if (state.locked) return;
  state.locked = true;

  const box = document.getElementById("questionBox");
  const fb = document.getElementById("feedback");
  const buttons = document.querySelectorAll("#choices button");

  state.total++;

  buttons.forEach(b => {
    b.classList.toggle("correct", b.textContent === state.current.answer);
    b.classList.toggle("dim", b.textContent !== state.current.answer);
  });

  if (choice === state.current.answer) {
    state.correct++;
    state.combo++;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    fb.textContent = "✅ Benar!";
    vibrate([20]);
  } else {
    if (!state.survival) state.hp--;
    state.combo = 0;
    fb.textContent = "❌ Salah";
    box.classList.add("shake");
    vibrate([40, 30, 40]);
    btn.classList.add("wrong");
  }

  updateUI();

  setTimeout(() => {
    box.classList.remove("shake");
    fb.textContent = "";
    state.locked = false;
    nextQuestion();
  }, 700);
}
