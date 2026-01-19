const Quiz = {
  pool: [],
  mode: "",
  locked: false,

  start(data, mode) {
    this.pool = data;
    this.mode = mode;
    this.locked = false;

    const q = data[Math.floor(Math.random() * data.length)];
    const correct = mode === "r" ? q.r : q.a;

    const options = App.shuffle([
      correct,
      ...App.shuffle(data.filter(x => x !== q))
        .slice(0,3)
        .map(x => mode === "r" ? x.r : x.a)
    ]);

    UI.screen.innerHTML = `
      <div class="quiz">
        <div class="quiz-char">${q.c}</div>
        <div class="quiz-options">
          ${options.map(o => `
            <button onclick="Quiz.answer(this,'${o}','${correct}')">${o}</button>
          `).join("")}
        </div>
        <div id="quiz-feedback"></div>
      </div>
    `;
  },

  answer(btn, val, ans) {
    if (this.locked) return;
    this.locked = true;

    const fb = document.getElementById("quiz-feedback");

    if (val === ans) {
      btn.classList.add("correct");
      fb.innerHTML = "✅ Benar";
    } else {
      btn.classList.add("wrong");
      fb.innerHTML = `❌ Salah<br><small>${ans}</small>`;
    }

    setTimeout(() => this.start(this.pool, this.mode), 900);
  }
};
