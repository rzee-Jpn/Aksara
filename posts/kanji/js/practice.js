const Practice = {
  // ===== HEADER CONTROL (AMAN, TIDAK GANGGU LOGIC) =====
  hideHeader() {
    const h = document.querySelector("header");
    if (h) h.classList.add("hide");
  },

  showHeader() {
    const h = document.querySelector("header");
    if (h) h.classList.remove("hide");
  },

  draw(char) {
    this.hideHeader(); // ⬅️ HEADER DISMBUNYIKAN SAAT PRACTICE

    UI.screen.innerHTML = `
      <div class="draw-wrap">
        <div class="draw-card">
          <div class="draw-head">
            <span class="jp-char">${char}</span>
            <span class="hint">Tulis ulang karakter</span>
          </div>

          <canvas id="canvas"></canvas>

          <div class="draw-actions">
            <button onclick="Practice.clear()">🧹 Hapus</button>
            <button class="primary" onclick="Practice.exit('${char}')">
              ← Kembali
            </button>
          </div>
        </div>
      </div>
    `;

    this.initCanvas();
  },

  // ===== KELUAR PRACTICE (WAJIB PAKAI INI) =====
  exit(char) {
    this.showHeader(); // ⬅️ HEADER MUNCUL LAGI
    UI.showChar(char, "");
  },

  initCanvas() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // --- FIX scaling & blur ---
    const dpr = window.devicePixelRatio || 1;
    const size = 300;

    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111";

    let drawing = false;

    const pos = e => {
      const r = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return {
        x: t.clientX - r.left,
        y: t.clientY - r.top
      };
    };

    const start = e => {
      e.preventDefault();
      drawing = true;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    };

    const move = e => {
      if (!drawing) return;
      e.preventDefault();
      const p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    };

    const end = () => drawing = false;

    // Touch (Android / iOS)
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);

    // Mouse (Desktop)
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);
  },

  clear() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};