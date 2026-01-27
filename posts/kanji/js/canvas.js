const Practice = {
  canvasAbort: null,

  // ===== HEADER CONTROL =====
  hideHeader() {
    const h = document.querySelector("header");
    if (h) h.classList.add("hide");
  },

  showHeader() {
    const h = document.querySelector("header");
    if (h) h.classList.remove("hide");
  },

  // ===== MASUK PRACTICE =====
  draw(char) {
    this.hideHeader();
    this._teardownCanvas(); // aman kalau masuk ulang

    UI.screen.innerHTML = `
      <div class="draw-wrap os-practice">
        <div class="draw-card os-card">
          <div class="draw-head">
            <span class="jp-char os-char">${char}</span>
            <span class="hint os-hint">Tulis ulang karakter</span>
          </div>

          <canvas id="canvas"></canvas>

          <div class="draw-actions os-actions">
            <button class="os-btn clear" onclick="Practice.clear()">🧹 Hapus</button>
            <button class="os-btn back" onclick="Practice.back()">← Kembali</button>
          </div>
        </div>
      </div>
    `;

    this.initCanvas();
  },

  // ===== KEMBALI KE GRID ASAL =====
  back() {
    this._teardownCanvas();
    this.showHeader();

    if (UI.lastGrid) {
      UI.grid(UI.lastGrid);
    } else {
      UI.showMenu();
    }
  },

  // ===== INIT CANVAS =====
  initCanvas() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    const size = 320; // lebih besar biar nyaman tulis

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
      return { x: t.clientX - r.left, y: t.clientY - r.top };
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

    const end = () => {
      drawing = false;
      ctx.beginPath();
    };

    // ===== EVENT LISTENER AMAN =====
    this.canvasAbort = new AbortController();
    const signal = this.canvasAbort.signal;

    canvas.addEventListener("touchstart", start, { passive: false, signal });
    canvas.addEventListener("touchmove", move, { passive: false, signal });
    canvas.addEventListener("touchend", end, { signal });

    canvas.addEventListener("mousedown", start, { signal });
    canvas.addEventListener("mousemove", move, { signal });
    canvas.addEventListener("mouseup", end, { signal });
    canvas.addEventListener("mouseleave", end, { signal });
  },

  // ===== CLEAR CANVAS =====
  clear() {
    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  // ===== BERSIHKAN EVENT LISTENER =====
  _teardownCanvas() {
    if (this.canvasAbort) {
      this.canvasAbort.abort();
      this.canvasAbort = null;
    }
  }
};