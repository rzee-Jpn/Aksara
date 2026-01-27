const UI = {
  screen: document.getElementById("screen"),
  lastGrid: null,
  lastChar: null,

  showMenu() {
    this.screen.innerHTML = `
      <div class="os-menu">
        <div class="os-card" onclick="UI.grid(hiragana)">あ<br><small>Hiragana</small></div>
        <div class="os-card" onclick="UI.grid(katakana)">ア<br><small>Katakana</small></div>
        <div class="os-card" onclick="UI.kanjiMenu()">漢<br><small>Kanji</small></div>
        <div class="os-card" onclick="Select.quiz()">🎮<br><small>Quiz Mode</small></div>
      </div>
    `;
  },

  kanjiMenu() {
    this.screen.innerHTML = `
      <div class="os-menu">
        <div class="os-card" onclick="UI.grid(N5)">N5</div>
        <div class="os-card" onclick="UI.grid(N4)">N4</div>
        <div class="os-card" onclick="UI.grid(N3)">N3</div>
        <div class="os-card" onclick="UI.grid(N2)">N2</div>
        <div class="os-card" onclick="UI.grid(N1)">N1</div>
      </div>
    `;
  },

  grid(data) {
  // 🔥 MERGE CONTOH + IMAGE UNTUK HIRAGANA
  if (window.hiraganaExample) {
    data.forEach(h => {
      if (!h.c) return; // skip non-kana
      const ex = hiraganaExample[h.c];
      if (ex) {
        h.example = ex.word;
        h.image = ex.img;
      }
    });
  }

  this.lastGrid = data;

  const isKanji = !!data[0]?.k;
  const typeClass = isKanji ? "kanji" : "kana";
  const cols = isKanji ? 4 : 5;

  const rows = [];
  for (let i = 0; i < data.length; i += cols) {
    rows.push(data.slice(i, i + cols));
  }

  this.screen.innerHTML = `
    <div class="gojuon ${typeClass}">
      ${rows.map(row => `
        <div class="gojuon-row">
          ${row.map(x => {
            const char = x.c || x.k;
            const reading = x.r || x.a || "";
            return `
              <div class="char" onclick="UI.showChar('${char}')">
                ${char}
                <small>${reading}</small>
              </div>
            `;
          }).join("")}
        </div>
      `).join("")}
    </div>
  `;
},

  showChar(char) {
    const item = this.lastGrid?.find(x => (x.c || x.k) === char);
    this.lastChar = item;

    this.screen.innerHTML = `
      <div class="os-practice">
        <div class="os-card">
          <div class="os-char">${char}</div>

          ${item?.image ? `<img class="card-img" src="${item.image}" alt="">` : ""}

          <div class="os-hint">
            ${item?.r || item?.a || ""}
            ${item?.example ? `<div class="example">${item.example}</div>` : ""}
          </div>

          <div class="os-actions">
            <button class="os-btn" onclick="App.speak('${char}')">🔊 Suara</button>
            <button class="os-btn back" onclick="Practice.draw('${char}')">✍️ Tulis</button>
          </div>
        </div>
      </div>
    `;
  }
};