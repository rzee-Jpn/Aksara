const Quiz = {
  pool: [],
  type: "",
  locked: false,

  // ===== HEADER CONTROL (AMAN) =====
  hideHeader() {
    const h = document.querySelector("header");
    if (h) h.classList.add("hide");
  },

  showHeader() {
    const h = document.querySelector("header");
    if (h) h.classList.remove("hide");
  },

  // ===== START QUIZ =====
  start(data, type) {
    this.hideHeader(); // ⬅️ HEADER DISEMBUNYIKAN
    this.pool = data;
    this.type = type;
    this.locked = false;

    const q = data[Math.floor(Math.random() * data.length)];
    const latin = q.r || q.a;
    const kanji = q.c;

    let html = "";

    // ===== MODE 1: KANJI → LATIN (MCQ)
    if (type === "kl") {
      const options = this.makeOptions(data, q, x => x.r || x.a);

      html = `
        <div class="quiz">
          <div class="quiz-char">${kanji}</div>
          <div class="quiz-options">
            ${options.map(o =>
              `<button onclick="Quiz.answer(this,'${o}','${latin}')">${o}</button>`
            ).join("")}
          </div>
          <div id="quiz-feedback"></div>
        </div>
      `;
    }

    // ===== MODE 2: AUDIO → KANJI
    if (type === "ak") {
      const options = this.makeOptions(data, q, x => x.c);

      setTimeout(() => App.speak(kanji), 300);

      html = `
        <div class="quiz">
          <div class="quiz-audio">🔊 Dengarkan</div>
          <div class="quiz-options">
            ${options.map(o =>
              `<button onclick="Quiz.answer(this,'${o}','${kanji}')">${o}</button>`
            ).join("")}
          </div>
          <div id="quiz-feedback"></div>
        </div>
      `;
    }

    // ===== MODE 3: KANJI → AUDIO
    if (type === "ka") {
      const options = this.makeOptions(data, q, x => x.c);

      html = `
        <div class="quiz">
          <div class="quiz-char">${kanji}</div>
          <div class="quiz-options">
            ${options.map(o =>
              `<button onclick="Quiz.audioAnswer(this,'${o}','${kanji}')">🔊</button>`
            ).join("")}
          </div>
          <div id="quiz-feedback"></div>
        </div>
      `;
    }

    // ===== MODE 4: KANJI → TYPING LATIN
    if (type === "kt") {
      html = `
        <div class="quiz typing">
          <div class="typing-char">${kanji}</div>

          <div class="typing-input">
            <input
              id="quiz-input"
              placeholder="Ketik romaji"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
            />
            <span class="submit-icon" onclick="Quiz.typeAnswer('${latin}')">✓</span>
          </div>

          <div id="quiz-feedback"></div>
        </div>
      `;

      // autofocus + enter submit
      setTimeout(() => {
        const input = document.getElementById("quiz-input");
        if (input) {
          input.focus();
          input.onkeydown = e => {
            if (e.key === "Enter") {
              Quiz.typeAnswer(latin);
            }
          };
        }
      }, 50);
    }

    UI.screen.innerHTML = html;
  },

  // ===== COMMON =====

  makeOptions(data, q, mapFn) {
    return App.shuffle([
      mapFn(q),
      ...App.shuffle(data.filter(x => x !== q))
        .slice(0, 3)
        .map(mapFn)
    ]);
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

    setTimeout(() => this.start(this.pool, this.type), 900);
  },

  audioAnswer(btn, val, ans) {
    App.speak(val);
    this.answer(btn, val, ans);
  },

  typeAnswer(ans) {
  if (this.locked) return;
  this.locked = true;

  const input = document.getElementById("quiz-input");
  const fb = document.getElementById("quiz-feedback");

  const val = normalizeRomaji(input.value);
  const expected = normalizeRomaji(ans);

  if (val === expected) {
    fb.innerHTML = "✅ Benar";
  } else {
    fb.innerHTML = `❌ Salah<br><small>${ans}</small>`;
  }

  setTimeout(() => this.start(this.pool, this.type), 1200);
},

  // ===== CALL THIS WHEN EXIT QUIZ (MENU / HOME) =====
  exit() {
    this.showHeader(); // ⬅️ HEADER MUNCUL LAGI
  }
};

function normalizeRomaji(s) {
  return s
    .toLowerCase()
    .replace(/si/g,"shi")
    .replace(/ti/g,"chi")
    .replace(/tu/g,"tsu")
    .replace(/zi/g,"ji")
    .trim();
} 