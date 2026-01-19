const Select = {
  quiz() {
    UI.screen.innerHTML = `
      <div class="menu">
        <div class="card" onclick="Quiz.start(hiragana,'r')">Hiragana</div>
        <div class="card" onclick="Quiz.start(katakana,'r')">Katakana</div>
        <div class="card" onclick="Select.kanji()">Kanji</div>
      </div>
    `;
  },

  kanji() {
    UI.screen.innerHTML = `
      <div class="menu">
        <div class="card" onclick="Quiz.start(N5,'a')">N5</div>
        <div class="card" onclick="Quiz.start(N4,'a')">N4</div>
        <div class="card" onclick="Quiz.start(N3,'a')">N3</div>
        <div class="card" onclick="Quiz.start(N2,'a')">N2</div>
        <div class="card" onclick="Quiz.start(N1,'a')">N1</div>
      </div>
    `;
  }
};
