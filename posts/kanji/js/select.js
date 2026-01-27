const Select = {
  quiz() {
    UI.screen.innerHTML = `
      <div class="os-menu">
        <div class="os-card" onclick="Select.script('hiragana')">🎴 Hiragana</div>
        <div class="os-card" onclick="Select.script('katakana')">🎴 Katakana</div>
        <div class="os-card" onclick="Select.kanji()">🎴 Kanji</div>
      </div>
    `;
  },

  script(type) {
    const src = type === "hiragana" ? "hiragana" : "katakana";

    UI.screen.innerHTML = `
      <div class="os-menu">
        <div class="os-card" onclick="Quiz.start(${src},'kl')">🧠 Tebak</div>
        <div class="os-card" onclick="Quiz.start(${src},'ak')">🔊 Dengar</div>
        <div class="os-card" onclick="Quiz.start(${src},'ka')">🎧 Audio</div>
        <div class="os-card" onclick="Quiz.start(${src},'kt')">⌨️ Ketik</div>
      </div>
    `;
  },

  kanji() {
    UI.screen.innerHTML = `
      <div class="os-menu">
        <div class="os-card" onclick="Select.kanjiLevel(N5)">N5</div>
        <div class="os-card" onclick="Select.kanjiLevel(N4)">N4</div>
        <div class="os-card" onclick="Select.kanjiLevel(N3)">N3</div>
        <div class="os-card" onclick="Select.kanjiLevel(N2)">N2</div>
        <div class="os-card" onclick="Select.kanjiLevel(N1)">N1</div>
      </div>
    `;
  },

  kanjiLevel(data) {
    UI.screen.innerHTML = `
      <div class="os-menu">
        <div class="os-card" onclick="Quiz.start(${data === N5 ? "N5" : data === N4 ? "N4" : data === N3 ? "N3" : data === N2 ? "N2" : "N1"},'kl')">🧠 Tebak</div>
        <div class="os-card" onclick="Quiz.start(${data === N5 ? "N5" : data === N4 ? "N4" : data === N3 ? "N3" : data === N2 ? "N2" : "N1"},'ak')">🔊 Dengar</div>
        <div class="os-card" onclick="Quiz.start(${data === N5 ? "N5" : data === N4 ? "N4" : data === N3 ? "N3" : data === N2 ? "N2" : "N1"},'kt')">⌨️ Ketik</div>
      </div>
    `;
  }
};