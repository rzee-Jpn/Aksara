export const $ = id => document.getElementById(id);

export const UI = {
  el: {
    hp: $("hp"),
    combo: $("combo"),
    choices: $("choices"),
    feedback: $("feedback"),
    questionBox: $("questionBox"),

    lessonHangul: $("lessonHangul"),
    lessonPhonetic: $("lessonPhonetic"),
    lessonRule: $("lessonRule"),
    btnLessonNext: $("btnLessonNext"),

    statTotal: $("statTotal"),
    statCorrect: $("statCorrect"),
    statBestCombo: $("statBestCombo"),
    btnRevive: $("btnRevive"),
  },

  show(id) {
    document.querySelectorAll(".screen")
      .forEach(s => s.classList.remove("active"));
    $(id)?.classList.add("active");
  },

  updateHUD(state) {
    this.el.hp.textContent = state.survival ? "∞" : state.hp;
    this.el.combo.textContent = state.combo;
  },

  renderChoices(current, onAnswer) {
    this.el.choices.innerHTML = "";
    current.options
      .sort(() => Math.random() - 0.5)
      .forEach(o => {
        const b = document.createElement("button");
        b.textContent = o;
        b.onclick = () => onAnswer(o, b);
        this.el.choices.appendChild(b);
      });
  },

  revealAnswer(answer) {
    [...this.el.choices.children].forEach(b => {
      b.classList.add(
        b.textContent === answer ? "correct" : "dim"
      );
    });
  },

  feedback(text, shake = false, btn) {
    this.el.feedback.textContent = text;
    if (shake) {
      this.el.questionBox.classList.add("shake");
      btn?.classList.add("wrong");
    }
  },

  clearFeedback() {
    this.el.feedback.textContent = "";
    this.el.questionBox.classList.remove("shake");
  },

  renderLesson(state) {
    const q = state.lessonSteps[state.lessonIndex];
    this.el.lessonHangul.textContent = q.hangul || "";
    this.el.lessonPhonetic.textContent = q.phonetic || q.heard || "";
    this.el.lessonRule.textContent = q.rule || "";
    this.el.btnLessonNext.textContent =
      state.lessonIndex === state.lessonSteps.length - 1
        ? "Mulai Quiz"
        : "Next →";
  },

  showGameOver(state) {
    this.el.statTotal.textContent = state.total;
    this.el.statCorrect.textContent = state.correct;
    this.el.statBestCombo.textContent = state.bestCombo;
    this.el.btnRevive.style.display = state.revived ? "none" : "block";
    this.show("gameover");
  }
};