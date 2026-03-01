/**
 * UI Controller v4
 * Fix 1: Mobile keyboard via hidden input
 * Fix 2: Combo auto-hide after 2s
 * Fix 3: Zoom controls anchored to game-body (done in HTML/CSS)
 * Fix 4: No reveal-all button (done in HTML)
 */
const UI = (() => {
  function $(id) { return document.getElementById(id); }
  function cellId(r, c) { return `cell-${r}-${c}`; }

  let _cellSize = 44;
  let _gridW = 0, _gridH = 0, _grid = null;
  let _comboTimer = null;

  /* ── THEME ─────────────────────────────────────────────────── */
  function initTheme() {
    const saved = localStorage.getItem('tts-theme') || 'dark';
    applyTheme(saved, false);
  }

  function applyTheme(theme, animate = true) {
    if (!animate) document.body.style.transition = 'none';
    document.body.classList.toggle('light', theme === 'light');
    if (!animate) requestAnimationFrame(() => document.body.style.transition = '');

    const icon = theme === 'light' ? '☀️' : '🌙';
    const mt = $('meta-theme');
    if (mt) mt.content = theme === 'light' ? '#F2F2F7' : '#09090B';

    ['menu-theme-btn', 'game-theme-btn'].forEach(id => {
      const el = $(id); if (el) el.textContent = icon;
    });
    localStorage.setItem('tts-theme', theme);
  }

  function toggleTheme() {
    applyTheme(document.body.classList.contains('light') ? 'dark' : 'light');
  }

  /* ── ZOOM ───────────────────────────────────────────────────── */
  const SIZES = [24, 28, 32, 36, 40, 44, 48, 54, 60];

  function zoomIn()  {
    const i = SIZES.indexOf(_cellSize);
    if (i < SIZES.length - 1) _setCellSize(SIZES[i + 1]);
  }
  function zoomOut() {
    const i = SIZES.indexOf(_cellSize);
    if (i > 0) _setCellSize(SIZES[i - 1]);
  }
  function zoomFit() {
    const area = $('grid-area');
    if (!area || !_gridW || !_gridH) return;
    const r   = area.getBoundingClientRect();
    const maxW = (r.width  - 32) / _gridW;
    const maxH = (r.height - 32) / _gridH;
    const raw  = Math.min(maxW, maxH);
    const best = SIZES.reduce((p, s) => Math.abs(s - raw) < Math.abs(p - raw) ? s : p);
    _setCellSize(best);
  }

  function _setCellSize(size) {
    _cellSize = size;
    const table = document.querySelector('.crossword-grid');
    if (!table) return;

    table.style.gridTemplateColumns = `repeat(${_gridW}, ${size}px)`;
    table.style.gridTemplateRows    = `repeat(${_gridH}, ${size}px)`;

    document.querySelectorAll('.grid-cell').forEach(c => {
      c.style.width = c.style.height = size + 'px';
    });
    const ns = Math.max(6,  Math.floor(size * 0.20)) + 'px';
    const ls = Math.max(13, Math.floor(size * 0.46)) + 'px';
    document.querySelectorAll('.cell-number').forEach(n => n.style.fontSize = ns);
    document.querySelectorAll('.cell-letter').forEach(l => l.style.fontSize = ls);

    // Center if fits
    const area = $('grid-area');
    if (area) {
      const gw = _gridW * size + (_gridW - 1) * 3;
      const gh = _gridH * size + (_gridH - 1) * 3;
      area.classList.toggle('centered', gw <= area.clientWidth - 32 && gh <= area.clientHeight - 32);
    }
  }

  /* ── FIX 1: MOBILE KEYBOARD ────────────────────────────────── */
  function focusGrid() {
    // Focus the hidden input to trigger mobile keyboard
    const inp = $('mobile-input');
    if (inp) {
      inp.value = '';
      inp.focus({ preventScroll: true });
    } else {
      $('grid-container')?.focus();
    }
  }

  function initMobileInput() {
    const inp = $('mobile-input');
    if (!inp) return;

    inp.addEventListener('input', (e) => {
      const val = inp.value.replace(/[^a-zA-Z]/g, '');
      if (val && window.game && !window.game.done) {
        const letter = val.slice(-1).toUpperCase();
        const { sel } = window.game;
        if (sel) window.game._inputLetter(sel.r, sel.c, letter);
      }
      inp.value = '';
    });

    inp.addEventListener('keydown', (e) => {
      if (!window.game || window.game.done) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        const { sel } = window.game;
        if (sel) {
          window.game._clearCell(sel.r, sel.c);
          window.game._movePrev();
        }
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        window.game._nextWord(e.shiftKey);
      }
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
        e.preventDefault();
        window.game.onKey(e);
      }
    });

    // Keep focus on input when tapping grid cells
    // (cell click triggers focusGrid which re-focuses input)
    inp.addEventListener('blur', () => {
      // If game is active and we're losing focus unexpectedly, don't refocus
      // (would interfere with buttons in footer)
    });
  }

  /* ── RENDER GRID ────────────────────────────────────────────── */
  function renderGrid(grid, width, height) {
    _grid = grid; _gridW = width; _gridH = height;
    const container = $('grid-container');
    if (!container) return;
    container.innerHTML = '';

    const sz = _cellSize;
    const table = document.createElement('div');
    table.className = 'crossword-grid';
    table.style.gridTemplateColumns = `repeat(${width}, ${sz}px)`;
    table.style.gridTemplateRows    = `repeat(${height}, ${sz}px)`;

    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const cell = grid[r][c];
        const div  = document.createElement('div');
        div.id = cellId(r, c);
        div.style.width = div.style.height = sz + 'px';

        if (!cell) {
          div.className = 'grid-cell blocked';
        } else {
          div.className = 'grid-cell active';
          div.dataset.r = r; div.dataset.c = c;

          if (cell.number) {
            const n = document.createElement('span');
            n.className   = 'cell-number';
            n.textContent = cell.number;
            n.style.fontSize = Math.max(6, Math.floor(sz * 0.2)) + 'px';
            div.appendChild(n);
          }

          const span = document.createElement('span');
          span.className   = 'cell-letter';
          span.style.fontSize = Math.max(13, Math.floor(sz * 0.46)) + 'px';
          div.appendChild(span);

          div.addEventListener('click', () => {
            window.game?.handleCellClick(r, c);
            // FIX 1: Focus hidden input on tap to show mobile keyboard
            focusGrid();
          });

          div.addEventListener('touchstart', e => {
            e.preventDefault();
            window.game?.handleCellClick(r, c);
            focusGrid();
          }, { passive: false });
        }
        table.appendChild(div);
      }
    }

    container.appendChild(table);
    requestAnimationFrame(() => zoomFit());
    // Init mobile input once
    initMobileInput();
  }

  /* ── RENDER CLUES ───────────────────────────────────────────── */
  function renderClues(clues) {
    ['across', 'down'].forEach(dir => {
      const el = $(`clues-${dir}`);
      el.innerHTML = '';
      Object.keys(clues[dir]).map(Number).sort((a,b) => a-b).forEach(num => {
        el.appendChild(_clueItem(num, clues[dir][num].clue, dir));
      });
    });
  }

  function _clueItem(num, text, dir) {
    const li = document.createElement('li');
    li.className = 'clue-item';
    li.id = `clue-${dir}-${num}`;
    li.innerHTML = `<span class="clue-num">${num}</span><span class="clue-text">${text}</span>`;
    li.addEventListener('click', () => {
      const clue = window.game?.clues[dir][num];
      if (clue) window.game.selectCell(clue.r, clue.c, dir, num);
    });
    return li;
  }

  /* ── HIGHLIGHTS ─────────────────────────────────────────────── */
  function highlightWord(clue, dir) {
    for (let i = 0; i < clue.len; i++) {
      const r = dir === 'across' ? clue.r     : clue.r + i;
      const c = dir === 'across' ? clue.c + i : clue.c;
      $(cellId(r, c))?.classList.add('highlighted');
    }
    // Scroll selected cell into view
    requestAnimationFrame(() => {
      $(cellId(clue.r, clue.c))?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    });
  }

  function highlightCell(r, c, cls) { $(cellId(r, c))?.classList.add(cls); }

  function clearAllHighlights() {
    document.querySelectorAll('.grid-cell.highlighted,.grid-cell.selected')
      .forEach(el => el.classList.remove('highlighted','selected'));
    document.querySelectorAll('.clue-item.active')
      .forEach(el => el.classList.remove('active'));
  }

  function highlightClue(num, dir) {
    const el = $(`clue-${dir}-${num}`);
    if (!el) return;
    el.classList.add('active');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    const tab = document.querySelector(`.clue-tab[data-tab="${dir}"]`);
    if (tab && !tab.classList.contains('active')) tab.click();
  }

  /* ── CELL LETTER ────────────────────────────────────────────── */
  function setCellLetter(r, c, letter) {
    const el = $(cellId(r, c));
    if (!el) return;
    const span = el.querySelector('.cell-letter');
    if (span) span.textContent = letter;
    if (letter) { el.classList.remove('pop-in'); void el.offsetWidth; el.classList.add('pop-in'); }
  }

  /* ── FLASH ──────────────────────────────────────────────────── */
  function flashWord(clue, dir, type) {
    const cls = type === 'correct' ? 'flash-correct' : 'flash-error';
    for (let i = 0; i < clue.len; i++) {
      const r = dir === 'across' ? clue.r     : clue.r + i;
      const c = dir === 'across' ? clue.c + i : clue.c;
      const el = $(cellId(r, c));
      if (el) { el.classList.add(cls); setTimeout(() => el.classList.remove(cls), 600); }
    }
  }

  function markClueComplete(num, dir) { $(`clue-${dir}-${num}`)?.classList.add('completed'); }
  function markCellHint(r, c)         { $(cellId(r,c))?.classList.add('hint-revealed'); }
  function markCellError(r, c) {
    const el = $(cellId(r,c));
    if (el) { el.classList.add('error-mark'); setTimeout(() => el.classList.remove('error-mark'), 2000); }
  }

  /* ── SCORE ──────────────────────────────────────────────────── */
  function updateScore(score, delta) {
    const el = $('score-value');
    if (!el) return;
    el.textContent = score.toLocaleString();
    if (delta) {
      const f = document.createElement('div');
      f.className = 'float-score'; f.textContent = `+${delta}`;
      const rect = el.getBoundingClientRect();
      f.style.cssText = `left:${rect.left}px;top:${rect.top - 8}px`;
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 950);
    }
  }

  /* ── FIX 2: COMBO AUTO-HIDE ─────────────────────────────────── */
  function updateCombo(combo) {
    const el = $('combo-display');
    if (!el) return;

    if (combo >= 2) {
      el.textContent = `🔥 ${combo}× COMBO`;
      el.style.display = 'block';
      el.classList.remove('combo-pop');
      void el.offsetWidth;
      el.classList.add('combo-pop');

      // Clear previous timer and set new one — hides after 2s
      if (_comboTimer) clearTimeout(_comboTimer);
      _comboTimer = setTimeout(() => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
          el.style.display = 'none';
          el.style.opacity = '';
          el.style.transition = '';
        }, 400);
      }, 2000);
    } else {
      if (_comboTimer) clearTimeout(_comboTimer);
      el.style.display = 'none';
      el.style.opacity = '';
    }
  }

  /* ── PROGRESS / TIMER ───────────────────────────────────────── */
  function updateProgress(done, total) {
    const fill = $('progress-bar-fill'), txt = $('progress-text');
    if (fill) fill.style.width = `${total > 0 ? (done/total)*100 : 0}%`;
    if (txt)  txt.textContent  = `${done}/${total}`;
  }

  function showTimer(show, initial) {
    const el = $('timer-wrap');
    if (el) el.classList.toggle('visible', show);
    if (initial != null) updateTimer(initial, true);
  }

  function updateTimer(secs, elapsed) {
    const el = $('timer-value');
    if (!el) return;
    const s = Math.abs(Math.floor(secs));
    el.textContent = `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
    el.classList.toggle('timer-urgent', !elapsed && secs <= 30);
  }

  function updateHints(n) {
    const b = $('hint-count'); if (b) b.textContent = n;
    const btn = $('btn-hint'); if (btn) btn.disabled = n <= 0;
  }

  /* ── WIN / LOSE ─────────────────────────────────────────────── */
  function showWinScreen(score, elapsed, words) {
    const m = Math.floor(elapsed/60), s = elapsed%60;
    $('win-score').textContent = score.toLocaleString();
    $('win-time').textContent  = `${m}m ${s}s`;
    $('win-words').textContent = words;
    $('win-overlay').style.display = 'flex';
    _confetti();
  }

  function showGameOver(score) {
    $('gameover-score').textContent = score.toLocaleString();
    $('gameover-overlay').style.display = 'flex';
  }

  /* ── TOAST ──────────────────────────────────────────────────── */
  function showToast(msg, type = 'info') {
    const t = document.createElement('div');
    t.className = `toast${type === 'error' ? ' error' : ''}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 320); }, 2600);
  }

  /* ── CONFETTI ───────────────────────────────────────────────── */
  function _confetti() {
    const canvas = $('confetti-canvas');
    if (!canvas) return;
    canvas.style.display = 'block';
    canvas.width = innerWidth; canvas.height = innerHeight;
    const ctx = canvas.getContext('2d');
    const pts = Array.from({ length: 100 }, () => ({
      x: Math.random() * innerWidth, y: -20,
      vx: (Math.random() - .5) * 5, vy: Math.random() * 4 + 2,
      s: Math.random() * 9 + 4,
      color: `hsl(${Math.random() * 360},85%,60%)`,
      rot: Math.random() * 360, rv: (Math.random() - .5) * 12
    }));
    let f = 0;
    (function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += .06; p.rot += p.rv;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s); ctx.restore();
      });
      if (++f < 160) requestAnimationFrame(tick);
      else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = 'none'; }
    })();
  }

  function showLoading() {}

  return {
    initTheme, applyTheme, toggleTheme,
    zoomIn, zoomOut, zoomFit,
    renderGrid, renderClues,
    highlightWord, highlightCell, clearAllHighlights, highlightClue,
    focusGrid,
    setCellLetter, flashWord, markClueComplete, markCellHint, markCellError,
    updateScore, updateCombo, updateProgress,
    showTimer, updateTimer, updateHints,
    showWinScreen, showGameOver, showToast, showLoading
  };
})();
