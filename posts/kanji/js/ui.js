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
        <div class="char" onclick="UI.showChar('${x.c}','${x.r || x.a || ""}')">
          ${x.c}
          <small>${x.r || x.a || ""}</small>
        </div>
      `).join("")}
    </div>
  `;
},


showChar(char, reading) {
  this.screen.innerHTML = `
    <div class="card detail">
      <div class="big-char">${char}</div>
      <div class="reading">${reading}</div>

      <div class="actions">
        <button onclick="App.speak('${char}')">🔊 Dengarkan</button>
        <button onclick="Practice.draw('${char}')">✍️ Latihan Tulis</button>
      </div>

      <button class="back" onclick="UI.showMenu()">← Kembali</button>
    </div>
  `;
}
};

