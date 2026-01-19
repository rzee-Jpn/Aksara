const UI = {
  screen: document.getElementById("screen"),

  showMenu() {
    this.screen.innerHTML = `
      <div class="menu">
        <div class="card" onclick="UI.grid(hiragana)">Hiragana</div>
        <div class="card" onclick="UI.grid(katakana)">Katakana</div>
        <div class="card" onclick="UI.kanjiMenu()">Kanji JLPT</div>
        <div class="card" onclick="Select.quiz()">Quiz</div>
      </div>
    `;
  },

  kanjiMenu() {
    this.screen.innerHTML = `
      <div class="menu">
        <div class="card" onclick="UI.grid(N5)">N5</div>
        <div class="card" onclick="UI.grid(N4)">N4</div>
        <div class="card" onclick="UI.grid(N3)">N3</div>
        <div class="card" onclick="UI.grid(N2)">N2</div>
        <div class="card" onclick="UI.grid(N1)">N1</div>
      </div>
    `;
  },

  grid(data) {
    this.screen.innerHTML = `
      <div class="grid">
        ${data.map(x => `
          <div class="char" onclick="App.speak('${x.c}')">
            ${x.c}
            <small>${x.a || x.r || ""}</small>
          </div>
        `).join("")}
      </div>
    `;
  }
};
