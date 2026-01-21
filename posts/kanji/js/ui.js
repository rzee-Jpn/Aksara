const UI = {
  screen: document.getElementById("screen"),
  lastGrid: null, // ⬅️ SIMPAN ASAL
  
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
  this.lastGrid = data;

  const isKanji = data[0]?.a; // kanji punya arti (a)
  const typeClass = isKanji ? "kanji" : "kana";

  const rows = [];
  for (let i = 0; i < data.length; i += (isKanji ? 4 : 5)) {
    rows.push(data.slice(i, i + (isKanji ? 4 : 5)));
  }

  this.screen.innerHTML = `
    <div class="gojuon ${typeClass}">
      ${rows.map(row => `
        <div class="gojuon-row">
          ${row.map(x => `
            <div class="char" onclick="UI.showChar('${x.c}','${x.r || x.a || ""}')">
              ${x.c}
              <small>${x.r || x.a || ""}</small>
            </div>
          `).join("")}
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
