/**
 * app.js v3 — Navigation, Progress, Daily, World Map
 * Loads from split data/ files (data/worlds/*.json, data/daily/*.json)
 * Fix: back button now always works
 */
(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────
  const INDEX_URL   = 'data/index.json';
  let   index       = null;   // data/index.json
  let   worldCache  = {};     // slug → world data
  let   currentWorld    = null;
  let   currentPuzzle   = null;
  let   currentLevelIdx = -1;
  let   isDaily         = false;

  const PROGRESS_KEY = 'tts-progress-v2';

  // ── Progress ───────────────────────────────────────────────────
  const Prog = {
    load() { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch { return {}; } },
    save(p) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); },
    get(id)  { return this.load()[id] || { done:false, stars:0 }; },
    set(id, stars) {
      const p = this.load();
      p[id] = { done:true, stars: Math.max(stars, p[id]?.stars || 0) };
      this.save(p);
    },
    levelUnlocked(world, idx) {
      if (idx === 0) return true;
      return this.get(world.levels[idx-1].id).done;
    },
    worldUnlocked(worlds, idx) {
      if (idx === 0) return true;
      return worlds[idx-1].levels.some(l => this.get(l.id).done);
    },
    streak() { return this.load()['streak'] || 0; },
    dailyDone(date) { return this.get('daily-'+date).done; },
    markDailyDone(date) {
      this.set('daily-'+date, 3);
      const p = this.load();
      const yest = new Date(); yest.setDate(yest.getDate()-1);
      p['streak'] = (p['streak-date'] === yest.toISOString().slice(0,10))
        ? (p['streak']||0)+1 : 1;
      p['streak-date'] = today();
      this.save(p);
    },
  };

  function today() { return new Date().toISOString().slice(0,10); }

  // ── Screen Navigation ──────────────────────────────────────────
  let _activeScreenId = 'screen-home';

  function showScreen(id, dir = 'forward') {
    const cur  = document.getElementById(_activeScreenId);
    const next = document.getElementById(id);
    if (!next || cur === next) return;

    const outCls = dir === 'forward' ? 'slide-out' : 'slide-back-out';
    const inCls  = dir === 'forward' ? 'slide-in'  : 'slide-back-in';

    cur.classList.remove('active');
    cur.classList.add(outCls);
    setTimeout(() => cur.classList.remove(outCls), 340);

    next.style.display = 'flex';
    next.classList.add('active', inCls);
    setTimeout(() => next.classList.remove(inCls), 360);

    _activeScreenId = id;
  }

  // ── Init ───────────────────────────────────────────────────────
  async function init() {
    // Theme
    UI.initTheme();
    ['home-theme-btn','game-theme-btn'].forEach(id =>
      document.getElementById(id)?.addEventListener('click', () => UI.toggleTheme())
    );

    // Zoom
    document.getElementById('btn-zoom-in') ?.addEventListener('click', () => UI.zoomIn());
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => UI.zoomOut());
    document.getElementById('btn-zoom-fit')?.addEventListener('click', () => UI.zoomFit());

    // Clue tabs
    document.querySelectorAll('.clue-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const t = tab.dataset.tab;
        document.querySelectorAll('.clue-tab').forEach(x => x.classList.remove('active'));
        document.querySelectorAll('.clue-pane').forEach(x => x.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('clues-'+t)?.classList.add('active');
      });
    });

    // ── FIX: Back button — wire ONCE here, not inside buildHome ──
    document.getElementById('btn-back-game')?.addEventListener('click', () => backFromGame());

    // PWA
    if ('serviceWorker' in navigator)
      navigator.serviceWorker.register('sw.js').catch(()=>{});

    // Load index
    try {
      const r = await fetch(INDEX_URL);
      index   = await r.json();
    } catch(e) {
      console.error('Cannot load data/index.json', e);
      _showError('data/index.json tidak ditemukan. Jalankan generate-ai.js terlebih dahulu.');
      return;
    }

    buildHome();
  }

  // ── Load world data (lazy, cached) ────────────────────────────
  async function loadWorld(meta) {
    if (worldCache[meta.slug]) return worldCache[meta.slug];
    const r    = await fetch(meta.file);
    const data = await r.json();
    worldCache[meta.slug] = data;
    return data;
  }

  // ── HOME ───────────────────────────────────────────────────────
  function buildHome() {
    buildDailyCard();
    buildWorldList();
  }

  function buildDailyCard() {
    const date     = today();
    const hasDaily = index.daily?.includes(date);
    const done     = Prog.dailyDone(date);
    const streak   = Prog.streak();

    const card     = document.getElementById('daily-card');
    const titleEl  = document.getElementById('daily-title');
    const metaEl   = document.getElementById('daily-meta');
    const statusEl = document.getElementById('daily-status');
    const btn      = document.getElementById('btn-daily');

    // Remove old streak badge
    card.querySelector('.streak-badge')?.remove();
    // Remove old listener
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    if (!hasDaily) {
      titleEl.textContent  = 'Belum tersedia';
      metaEl.textContent   = 'Jalankan: node generate-ai.js --daily';
      statusEl.textContent = '';
      newBtn.disabled = true;
      return;
    }

    titleEl.textContent = `Puzzle Hari Ini`;
    metaEl.textContent  = date;

    if (done) {
      statusEl.textContent = '✅ Sudah selesai hari ini';
      newBtn.textContent   = 'Main Lagi →';
      newBtn.classList.add('done');
    } else {
      statusEl.textContent = '';
      newBtn.textContent   = 'Main Sekarang →';
      newBtn.classList.remove('done');
    }

    if (streak >= 2) {
      const badge = document.createElement('div');
      badge.className   = 'streak-badge';
      badge.textContent = `🔥 ${streak} hari`;
      card.appendChild(badge);
    }

    newBtn.addEventListener('click', () => playDaily(date));
  }

  function buildWorldList() {
    const list = document.getElementById('world-list');
    list.innerHTML = '';

    index.worlds.forEach((meta, wi) => {
      const unlocked  = wi === 0; // World 1 selalu buka, lainnya lazy check
      const doneCount = 0; // Will be updated lazily

      const card = document.createElement('div');
      card.className = 'world-card';
      card.style.setProperty('--world-color', meta.color || '#007AFF');
      card.innerHTML = `
        <div class="world-card-inner">
          <div class="world-emoji">${meta.emoji || '🌍'}</div>
          <div class="world-info">
            <div class="world-name">${meta.title}</div>
            <div class="world-progress-row">
              <div class="world-prog-bar">
                <div class="world-prog-fill" id="wpf-${meta.id}" style="width:0%"></div>
              </div>
              <span class="world-prog-txt" id="wpt-${meta.id}">0/${meta.levelCount}</span>
            </div>
          </div>
          <span class="world-chevron">›</span>
        </div>`;

      card.addEventListener('click', () => openWorld(meta));
      list.appendChild(card);

      // Lazy-load progress for this world
      loadWorld(meta).then(data => {
        if (!data) return;
        const done = data.levels.filter(l => Prog.get(l.id).done).length;
        const pct  = data.levels.length ? (done/data.levels.length)*100 : 0;
        const fill = document.getElementById('wpf-'+meta.id);
        const txt  = document.getElementById('wpt-'+meta.id);
        if (fill) fill.style.width = pct+'%';
        if (txt)  txt.textContent  = `${done}/${data.levels.length}`;
      }).catch(()=>{});
    });
  }

  // ── WORLD → LEVEL SELECT ──────────────────────────────────────
  async function openWorld(meta) {
    document.getElementById('world-title-nav').textContent = `${meta.emoji} ${meta.title}`;

    let world;
    try {
      world = await loadWorld(meta);
    } catch(e) {
      _showError('Gagal memuat data world.'); return;
    }

    currentWorld = world;
    buildLevelGrid(world);
    showScreen('screen-levels', 'forward');
  }

  function buildLevelGrid(world) {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';

    world.levels.forEach((level, idx) => {
      const unlocked = Prog.levelUnlocked(world, idx);
      const prog     = Prog.get(level.id);
      const stars    = prog.stars || 0;

      const btn = document.createElement('div');
      btn.className = ['level-btn',
        !unlocked ? 'locked' : prog.done ? 'done' : 'active-level'
      ].join(' ');
      btn.style.setProperty('--level-color', world.color || '#007AFF');

      if (unlocked) {
        btn.innerHTML = `
          <span class="level-num">${idx+1}</span>
          <span class="level-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}</span>`;
        btn.addEventListener('click', () => playLevel(world, idx));
      } else {
        btn.innerHTML = `<span class="level-lock-icon">🔒</span>`;
      }

      grid.appendChild(btn);
    });
  }

  // ── PLAY ──────────────────────────────────────────────────────
  function playLevel(world, idx) {
    currentWorld    = world;
    currentLevelIdx = idx;
    currentPuzzle   = world.levels[idx];
    isDaily         = false;

    document.getElementById('header-puzzle-name').textContent =
      `${world.emoji} Level ${idx+1}`;
    document.getElementById('header-mode-badge').textContent = world.title;

    showScreen('screen-game', 'forward');
    window.game.loadPuzzle(currentPuzzle, 'normal');
  }

  async function playDaily(date) {
    isDaily = true;
    currentWorld    = null;
    currentLevelIdx = -1;

    document.getElementById('header-puzzle-name').textContent = `📅 Daily ${date}`;
    document.getElementById('header-mode-badge').textContent  = 'Daily Puzzle';

    // Load from data/daily/DATE.json
    let puzzle;
    try {
      const r = await fetch(`data/daily/${date}.json`);
      puzzle  = await r.json();
    } catch(e) {
      _showError('Gagal memuat daily puzzle.'); return;
    }

    currentPuzzle = puzzle;
    showScreen('screen-game', 'forward');
    window.game.loadPuzzle(puzzle, 'normal');
  }

  // ── BACK ──────────────────────────────────────────────────────
  function backFromGame() {
    // Close overlays
    document.getElementById('win-overlay').style.display      = 'none';
    document.getElementById('gameover-overlay').style.display = 'none';

    // Stop timer
    if (window.game?.timer) clearInterval(window.game.timer);

    if (isDaily || !currentWorld) {
      buildHome();
      showScreen('screen-home', 'back');
    } else {
      buildLevelGrid(currentWorld);
      showScreen('screen-levels', 'back');
    }
  }

  function nextLevel() {
    document.getElementById('win-overlay').style.display = 'none';
    if (!currentWorld) { backFromGame(); return; }
    const next = currentLevelIdx + 1;
    if (next < currentWorld.levels.length && Prog.levelUnlocked(currentWorld, next)) {
      playLevel(currentWorld, next);
    } else {
      backFromGame();
    }
  }

  function replayLevel() {
    document.getElementById('gameover-overlay').style.display = 'none';
    if (isDaily && currentPuzzle) {
      const date = currentPuzzle.id?.replace('daily-','') || today();
      playDaily(date);
    } else if (currentWorld) {
      playLevel(currentWorld, currentLevelIdx);
    }
  }

  // ── Win hook (called from game.js) ────────────────────────────
  window._onLevelComplete = function(score, elapsed, wordsTotal) {
    const stars = (() => {
      if (score >= wordsTotal*15*2 && elapsed < 120) return 3;
      if (score >= wordsTotal*12) return 2;
      return 1;
    })();

    if (isDaily) {
      Prog.markDailyDone(today());
    } else if (currentPuzzle) {
      Prog.set(currentPuzzle.id, stars);
    }

    // Star display
    document.getElementById('star-row').textContent =
      '⭐'.repeat(stars) + '☆'.repeat(3-stars);

    // Next level button logic
    const nextBtn = document.getElementById('win-btn-next');
    if (isDaily) {
      nextBtn.textContent = 'Kembali';
      nextBtn.onclick     = backFromGame;
    } else if (currentWorld && currentLevelIdx + 1 < currentWorld.levels.length) {
      nextBtn.textContent = 'Level Berikut →';
      nextBtn.onclick     = nextLevel;
    } else {
      nextBtn.textContent = 'Pilih Level';
      nextBtn.onclick     = backFromGame;
    }
  };

  // ── Error helper ──────────────────────────────────────────────
  function _showError(msg) {
    document.getElementById('loading-overlay').style.display = 'none';
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:32px;background:var(--c-bg);z-index:999;text-align:center;';
    div.innerHTML = `<div style="color:var(--c-txt-2);font-size:14px;line-height:1.6;max-width:300px;">⚠️<br><br>${msg}</div>`;
    document.body.appendChild(div);
  }

  // ── Expose globally ───────────────────────────────────────────
  window.App          = { goHome:()=>{ buildHome(); showScreen('screen-home','back'); },
                          backFromGame, nextLevel, replayLevel };
  window.returnToMenu = backFromGame;
  window.replayPuzzle = replayLevel;

  document.addEventListener('DOMContentLoaded', init);
})();
