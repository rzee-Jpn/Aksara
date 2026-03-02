/**
 * CrosswordGame — Zero-loading Game Controller
 * Grid rendered from pre-built layout, no generator at runtime.
 */

class CrosswordGame {
  constructor() {
    this.grid       = null;   // 2D array of cell objects
    this.clues      = null;   // { across: {num: {...}}, down: {num: {...}} }
    this.width      = 0;
    this.height     = 0;

    this.sel        = null;   // { r, c }
    this.selDir     = 'across';
    this.selNum     = null;

    this.mode       = 'normal';
    this.score      = 0;
    this.combo      = 0;
    this.hintsLeft  = 5;
    this.timer      = null;
    this.timeLeft   = 0;
    this.startTime  = null;
    this.wordsOk    = new Set();
    this.wordsTotal = 0;
    this.done       = false;
    this.audioCtx   = null;

    document.addEventListener('keydown', this.onKey.bind(this));
  }

  /* ── Audio ─────────────────────────────────────────── */
  _initAudio() {
    if (!this.audioCtx)
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  playSound(type) {
    try {
      this._initAudio();
      const ctx = this.audioCtx;
      const presets = {
        type:     [[440], 0.05, 'sine',     0.08],
        correct:  [[523,659,784], 0.13, 'sine', 0.14],
        wrong:    [[200], 0.2,  'sawtooth', 0.07],
        complete: [[523,587,659,784,880], 0.11, 'sine', 0.18],
        hint:     [[350], 0.1,  'triangle', 0.09],
        combo:    [[659,784,880], 0.1, 'sine', 0.14],
      };
      const [freqs, dur, waveType, vol] = presets[type] || presets.type;
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f; o.type = waveType;
        const t = ctx.currentTime + i * dur;
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.start(t); o.stop(t + dur + 0.02);
      });
    } catch (_) {}
  }

  /* ── Load puzzle from pre-built data ───────────────── */
  loadPuzzle(puzzleData, mode = 'normal') {
    this.mode       = mode;
    this.score      = 0;
    this.combo      = 0;
    this.hintsLeft  = mode === 'hint' ? 3 : 5;
    this.wordsOk    = new Set();
    this.done       = false;
    this.timer      = null; // FIX: reset timer ref agar _setupMode tidak clearInterval stale ID

    const { width, height, layout, clues } = puzzleData;
    this.width  = width;
    this.height = height;
    this.clues  = clues;

    // Build 2D grid from compact layout array — instant
    this.grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => null)
    );
    for (const cell of layout) {
      this.grid[cell.r][cell.c] = {
        letter:     cell.l,
        userLetter: '',
        number:     cell.n || null,
      };
    }

    this.wordsTotal =
      Object.keys(clues.across).length +
      Object.keys(clues.down).length;

    // Render
    UI.renderGrid(this.grid, width, height);
    UI.renderClues(clues);
    UI.updateScore(0);
    UI.updateCombo(0);
    UI.updateProgress(0, this.wordsTotal);
    UI.updateHints(this.hintsLeft);

    this._setupMode();

    // Select first across clue
    const firstNum = Object.keys(clues.across).map(Number).sort((a,b)=>a-b)[0];
    if (firstNum != null) {
      const c = clues.across[firstNum];
      this.selectCell(c.r, c.c, 'across', firstNum);
    }
  }

  /* ── Mode / Timer ───────────────────────────────────── */
  _setupMode() {
    if (this.timer) clearInterval(this.timer);
    this.startTime = Date.now();

    if (this.mode === 'timeattack') {
      this.timeLeft = 300;
      UI.showTimer(true, this.timeLeft);
      this.timer = setInterval(() => {
        this.timeLeft--;
        UI.updateTimer(this.timeLeft, false);
        if (this.timeLeft <= 0) this._gameOver();
      }, 1000);
    } else {
      UI.showTimer(true, 0);
      this.timer = setInterval(() => {
        UI.updateTimer(Math.floor((Date.now() - this.startTime) / 1000), true);
      }, 1000);
    }
  }

  /* ── Cell Selection ─────────────────────────────────── */
  selectCell(r, c, dir, num) {
    this.sel    = { r, c };
    this.selDir = dir;
    this.selNum = num;
    UI.clearAllHighlights();

    const clue = this.clues[dir === 'across' ? 'across' : 'down'][num];
    if (clue) UI.highlightWord(clue, dir);
    UI.highlightCell(r, c, 'selected');
    UI.highlightClue(num, dir);
    UI.focusGrid();
  }

  handleCellClick(r, c) {
    if (!this.grid[r]?.[c]) return;

    // Same cell → toggle direction
    if (this.sel?.r === r && this.sel?.c === c) {
      const alt = this.selDir === 'across' ? 'down' : 'across';
      const clue = this._clueForCell(r, c, alt);
      if (clue) { this.selectCell(r, c, alt, clue.num); return; }
    }

    let clue = this._clueForCell(r, c, this.selDir);
    if (!clue) {
      const alt = this.selDir === 'across' ? 'down' : 'across';
      clue = this._clueForCell(r, c, alt);
      if (clue) this.selDir = alt;
    }
    if (clue) this.selectCell(r, c, this.selDir, clue.num);
  }

  _clueForCell(r, c, dir) {
    const map = this.clues[dir === 'across' ? 'across' : 'down'];
    for (const [num, clue] of Object.entries(map)) {
      if (dir === 'across') {
        if (clue.r === r && c >= clue.c && c < clue.c + clue.len)
          return { ...clue, num: +num };
      } else {
        if (clue.c === c && r >= clue.r && r < clue.r + clue.len)
          return { ...clue, num: +num };
      }
    }
    return null;
  }

  /* ── Keyboard ───────────────────────────────────────── */
  onKey(e) {
    if (!this.sel || this.done) return;
    const { r, c } = this.sel;

    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      this._clearCell(r, c);
      this._movePrev();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      this._nextWord(e.shiftKey);
      return;
    }
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
      e.preventDefault();
      const moves = { ArrowLeft:[0,-1], ArrowRight:[0,1], ArrowUp:[-1,0], ArrowDown:[1,0] };
      const [dr, dc] = moves[e.key];
      this._tryMove(r + dr, c + dc);
      return;
    }
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      e.preventDefault();
      this._inputLetter(r, c, e.key.toUpperCase());
    }
  }

  _tryMove(r, c) {
    if (r < 0 || c < 0 || r >= this.height || c >= this.width) return;
    if (!this.grid[r]?.[c]) return;
    const clue = this._clueForCell(r, c, this.selDir) ||
                 this._clueForCell(r, c, this.selDir === 'across' ? 'down' : 'across');
    if (clue) this.selectCell(r, c, clue.num === this.selNum ? this.selDir : (clue.r === r ? 'across' : 'down'), clue.num);
  }

  _moveNext() {
    if (!this.sel) return;
    const { r, c } = this.sel;
    const nr = this.selDir === 'down'   ? r + 1 : r;
    const nc = this.selDir === 'across' ? c + 1 : c;
    if (nr < this.height && nc < this.width && this.grid[nr]?.[nc])
      this._tryMove(nr, nc);
  }

  _movePrev() {
    if (!this.sel) return;
    const { r, c } = this.sel;
    const nr = this.selDir === 'down'   ? r - 1 : r;
    const nc = this.selDir === 'across' ? c - 1 : c;
    if (nr >= 0 && nc >= 0 && this.grid[nr]?.[nc])
      this._tryMove(nr, nc);
  }

  _nextWord(reverse = false) {
    const all = [];
    for (const [n, cl] of Object.entries(this.clues.across)) all.push({ num:+n, dir:'across', clue:cl });
    for (const [n, cl] of Object.entries(this.clues.down))   all.push({ num:+n, dir:'down',   clue:cl });
    all.sort((a,b) => a.num - b.num || (a.dir === 'across' ? -1 : 1));
    const idx = all.findIndex(x => x.num === this.selNum && x.dir === this.selDir);
    let next = reverse ? idx - 1 : idx + 1;
    if (next < 0) next = all.length - 1;
    if (next >= all.length) next = 0;
    const w = all[next];
    if (w) this.selectCell(w.clue.r, w.clue.c, w.dir, w.num);
  }

  /* ── Input / Validation ─────────────────────────────── */
  _inputLetter(r, c, letter) {
    if (!this.grid[r]?.[c]) return;
    this.grid[r][c].userLetter = letter;
    UI.setCellLetter(r, c, letter);
    this.playSound('type');
    this._checkWord();
    this._moveNext();
  }

  _clearCell(r, c) {
    if (!this.grid[r]?.[c]) return;
    this.grid[r][c].userLetter = '';
    UI.setCellLetter(r, c, '');
  }

  _checkWord() {
    if (this.selNum == null) return;
    const dir  = this.selDir;
    const clue = this.clues[dir === 'across' ? 'across' : 'down'][this.selNum];
    if (!clue) return;
    const key  = `${dir}-${this.selNum}`;
    if (this.wordsOk.has(key)) return;

    let filled = true, correct = true;
    for (let i = 0; i < clue.len; i++) {
      const gr = dir === 'across' ? clue.r       : clue.r + i;
      const gc = dir === 'across' ? clue.c + i   : clue.c;
      const cell = this.grid[gr]?.[gc];
      if (!cell || !cell.userLetter) { filled = false; break; }
      if (cell.userLetter !== clue.answer[i]) correct = false;
    }

    if (filled && correct) {
      this._onWordOk(dir, this.selNum, clue);
    } else if (filled && !correct) {
      UI.flashWord(clue, dir, 'error');
      this.combo = 0;
      UI.updateCombo(0);
      this.playSound('wrong');
    }
  }

  _onWordOk(dir, num, clue) {
    const key = `${dir}-${num}`;
    this.wordsOk.add(key);
    this.combo++;

    let pts = clue.len * 10;
    if (this.combo >= 3) { pts *= 2; this.playSound('combo'); }
    else this.playSound('correct');
    if (this.mode === 'timeattack') pts += Math.floor(this.timeLeft / 10);

    this.score += pts;
    UI.updateScore(this.score, pts);
    UI.updateCombo(this.combo);
    UI.updateProgress(this.wordsOk.size, this.wordsTotal);
    UI.flashWord(clue, dir, 'correct');
    UI.markClueComplete(num, dir);

    if (this.wordsOk.size >= this.wordsTotal)
      setTimeout(() => this._onComplete(), 400);
  }

  _onComplete() {
    if (this.done) return;
    this.done = true;
    if (this.timer) clearInterval(this.timer);
    const elapsed   = Math.floor((Date.now() - this.startTime) / 1000);
    const bonus     = this.mode === 'timeattack' ? this.timeLeft * 5 : 0;
    const finalScore = this.score + bonus;
    this.playSound('complete');
    // Call app hook for progress saving BEFORE showing win screen
    if (typeof window._onLevelComplete === 'function') {
      window._onLevelComplete(finalScore, elapsed, this.wordsTotal);
    }
    UI.showWinScreen(finalScore, elapsed, this.wordsTotal);
  }

  _gameOver() {
    if (this.timer) clearInterval(this.timer);
    this.playSound('wrong');
    UI.showGameOver(this.score);
  }

  /* ── Public helpers (called from HTML) ──────────────── */
  useHint() {
    if (this.hintsLeft <= 0 || !this.sel) return;
    const { r, c } = this.sel;
    const cell = this.grid[r]?.[c];
    if (!cell || cell.userLetter === cell.letter) return;
    cell.userLetter = cell.letter;
    UI.setCellLetter(r, c, cell.letter);
    UI.markCellHint(r, c);
    this.hintsLeft--;
    UI.updateHints(this.hintsLeft);
    this.playSound('hint');
    this._checkWord();
  }

  revealCurrentWord() {
    if (this.selNum == null) return;
    const dir  = this.selDir;
    const clue = this.clues[dir === 'across' ? 'across' : 'down'][this.selNum];
    if (!clue) return;
    for (let i = 0; i < clue.len; i++) {
      const gr = dir === 'across' ? clue.r     : clue.r + i;
      const gc = dir === 'across' ? clue.c + i : clue.c;
      const cell = this.grid[gr]?.[gc];
      if (cell) { cell.userLetter = cell.letter; UI.setCellLetter(gr, gc, cell.letter); UI.markCellHint(gr, gc); }
    }
    this.hintsLeft = Math.max(0, this.hintsLeft - 2);
    UI.updateHints(this.hintsLeft);
    this.playSound('hint');
    setTimeout(() => this._checkWord(), 50);
  }

  checkAll() {
    let errors = 0;
    for (let r = 0; r < this.height; r++)
      for (let c = 0; c < this.width; c++) {
        const cell = this.grid[r]?.[c];
        if (cell && cell.userLetter && cell.userLetter !== cell.letter) {
          UI.markCellError(r, c); errors++;
        }
      }
    UI.showToast(errors === 0 ? 'Semua jawaban benar! 🎉' : `${errors} sel salah ditandai merah`);
  }

  moveToNextWord() { this._nextWord(); }

  reveal() {
    for (let r = 0; r < this.height; r++)
      for (let c = 0; c < this.width; c++) {
        const cell = this.grid[r]?.[c];
        if (cell && !cell.userLetter) {
          cell.userLetter = cell.letter;
          UI.setCellLetter(r, c, cell.letter);
          UI.markCellHint(r, c);
        }
      }
    setTimeout(() => this._onComplete(), 500);
  }
}

window.game = new CrosswordGame();
