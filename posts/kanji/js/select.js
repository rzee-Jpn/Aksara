const Select = {

  quiz() {
    UI.screen.innerHTML = `
      <div class="menu">
        <div class="card" onclick="Select.script('hiragana')">Hiragana</div>
        <div class="card" onclick="Select.script('katakana')">Katakana</div>
        <div class="card" onclick="Select.kanji()">Kanji (JLPT)</div>
      </div>
    `;
  },

  // ======================
  // Hiragana / Katakana
  // ======================
  script(type) {
    const data = type === "hiragana" ? hiragana : katakana;

    UI.screen.innerHTML = `
      <div class="menu">
        <div class="card" onclick="Quiz.start(${type === "hiragana" ? "hiragana" : "katakana"},'kl')">Kanji → Latin</div>
        <div class="card" onclick="Quiz.start(${type === "hiragana" ? "hiragana" : "katakana"},'ak')">Suara → Kanji</div>
        <div class="card" onclick="Quiz.start(${type === "hiragana" ? "hiragana" : "katakana"},'ka')">Kanji → Suara</div>
        <div class="card" onclick="Quiz.start(${type === "hiragana" ? "hiragana" : "katakana"},'kt')">Ketik Latin</div>
      </div>
    `;
  },

  // ======================
  // Kanji JLPT
  // ======================
  kanji() {
    UI.screen.innerHTML = `
      <div class="menu">
        <div class="card" onclick="Select.kanjiLevel(N5)">N5</div>
        <div class="card" onclick="Select.kanjiLevel(N4)">N4</div>
        <div class="card" onclick="Select.kanjiLevel(N3)">N3</div>
        <div class="card" onclick="Select.kanjiLevel(N2)">N2</div>
        <div class="card" onclick="Select.kanjiLevel(N1)">N1</div>
      </div>
    `;
  },

  kanjiLevel(data) {
    UI.screen.innerHTML = `
      <div class="menu">
        <div class="card" onclick="Quiz.start(${data === N5 ? "N5" : data === N4 ? "N4" : data === N3 ? "N3" : data === N2 ? "N2" : "N1"},'kl')">Kanji → Arti</div>
        <div class="card" onclick="Quiz.start(${data === N5 ? "N5" : data === N4 ? "N4" : data === N3 ? "N3" : data === N2 ? "N2" : "N1"},'ak')">Suara → Kanji</div>
        <div class="card" onclick="Quiz.start(${data === N5 ? "N5" : data === N4 ? "N4" : data === N3 ? "N3" : data === N2 ? "N2" : "N1"},'kt')">Ketik Arti</div>
      </div>
    `;
  }
};