import { survival, hp, combo } from "../core/state.js";
import { shuffle } from "../core/utils.js";
import { checkAnswer } from "./check.js";

export function updateUI() {
  document.getElementById("hp").textContent = survival ? "∞" : hp;
  document.getElementById("combo").textContent = combo;
}

export function renderChoices(current) {
  const box = document.getElementById("choices");
  box.innerHTML = "";

  shuffle(current.options).forEach(o => {
    const b = document.createElement("button");
    b.textContent = o;
    b.onclick = () => checkAnswer(o, b);
    box.appendChild(b);
  });
}
