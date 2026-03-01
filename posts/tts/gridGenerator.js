/**
 * CrosswordEngine - Auto Grid Generator (FIXED v1.1)
 * Cleaner CSP constraint checking - no more false rejections or stuck state
 */

const CrosswordGenerator = (() => {

  const GRID_SIZE = 20;

  function createEmptyGrid() {
    return Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => null)
    );
  }

  function canPlace(grid, word, row, col, direction) {
    const len = word.length;

    if (direction === 'across') {
      if (row < 0 || row >= GRID_SIZE) return false;
      if (col < 0 || col + len > GRID_SIZE) return false;
      if (col > 0 && grid[row][col - 1] !== null) return false;
      if (col + len < GRID_SIZE && grid[row][col + len] !== null) return false;

      for (let i = 0; i < len; i++) {
        const cell = grid[row][col + i];
        if (cell !== null) {
          if (cell.letter !== word[i]) return false;
          if (cell.vertical === null) return false; // same-direction conflict
        } else {
          // No parallel neighbors on empty cell
          const hasAbove = row > 0 && grid[row - 1][col + i] !== null;
          const hasBelow = row < GRID_SIZE - 1 && grid[row + 1][col + i] !== null;
          if (hasAbove || hasBelow) return false;
        }
      }
    } else {
      if (col < 0 || col >= GRID_SIZE) return false;
      if (row < 0 || row + len > GRID_SIZE) return false;
      if (row > 0 && grid[row - 1][col] !== null) return false;
      if (row + len < GRID_SIZE && grid[row + len][col] !== null) return false;

      for (let i = 0; i < len; i++) {
        const cell = grid[row + i][col];
        if (cell !== null) {
          if (cell.letter !== word[i]) return false;
          if (cell.across === null) return false;
        } else {
          const hasLeft  = col > 0 && grid[row + i][col - 1] !== null;
          const hasRight = col < GRID_SIZE - 1 && grid[row + i][col + 1] !== null;
          if (hasLeft || hasRight) return false;
        }
      }
    }
    return true;
  }

  function placeWord(grid, word, row, col, direction, wordIndex) {
    const len = word.length;
    if (direction === 'across') {
      for (let i = 0; i < len; i++) {
        const existing = grid[row][col + i];
        if (existing) {
          existing.across = wordIndex;
        } else {
          grid[row][col + i] = { letter: word[i], userLetter: '', across: wordIndex, vertical: null, number: null };
        }
      }
    } else {
      for (let i = 0; i < len; i++) {
        const existing = grid[row + i][col];
        if (existing) {
          existing.vertical = wordIndex;
        } else {
          grid[row + i][col] = { letter: word[i], userLetter: '', across: null, vertical: wordIndex, number: null };
        }
      }
    }
  }

  function findIntersections(grid, word, direction) {
    const placements = [];
    const len = word.length;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const cell = grid[row][col];
        if (!cell) continue;
        if (direction === 'down'   && cell.across   === null) continue;
        if (direction === 'across' && cell.vertical  === null) continue;

        for (let charIdx = 0; charIdx < len; charIdx++) {
          if (word[charIdx] !== cell.letter) continue;
          const startRow = direction === 'down'   ? row - charIdx : row;
          const startCol = direction === 'across' ? col - charIdx : col;
          if (canPlace(grid, word, startRow, startCol, direction)) {
            placements.push({ row: startRow, col: startCol, direction, charIdx });
          }
        }
      }
    }
    return placements;
  }

  function assignNumbers(grid) {
    let counter = 1;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const cell = grid[row][col];
        if (!cell) continue;
        const isAcrossStart = (col === 0 || !grid[row][col - 1]) &&
                              (col + 1 < grid[row].length && grid[row][col + 1] !== null);
        const isDownStart   = (row === 0 || !grid[row - 1] || !grid[row - 1][col]) &&
                              (row + 1 < grid.length && grid[row + 1] && grid[row + 1][col] !== null);
        if (isAcrossStart || isDownStart) cell.number = counter++;
      }
    }
  }

  function cropGrid(grid) {
    let minRow = GRID_SIZE, maxRow = 0, minCol = GRID_SIZE, maxCol = 0, hasCell = false;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c]) { minRow = Math.min(minRow, r); maxRow = Math.max(maxRow, r); minCol = Math.min(minCol, c); maxCol = Math.max(maxCol, c); hasCell = true; }
      }
    }
    if (!hasCell) return { croppedGrid: [[null]], offsetRow: 0, offsetCol: 0 };
    const pad = 1;
    minRow = Math.max(0, minRow - pad); maxRow = Math.min(GRID_SIZE - 1, maxRow + pad);
    minCol = Math.max(0, minCol - pad); maxCol = Math.min(GRID_SIZE - 1, maxCol + pad);
    const croppedGrid = [];
    for (let r = minRow; r <= maxRow; r++) croppedGrid.push(grid[r].slice(minCol, maxCol + 1));
    return { croppedGrid, offsetRow: minRow, offsetCol: minCol };
  }

  function buildClueMap(grid, placed) {
    const clueMap = { across: {}, down: {} };
    for (const p of placed) {
      const cell = grid[p.row]?.[p.col];
      if (!cell || !cell.number) continue;
      const dir = p.direction === 'across' ? 'across' : 'down';
      clueMap[dir][cell.number] = {
        clue: p.word.clue,
        answer: p.word.answer.toUpperCase(),
        row: p.row, col: p.col,
        direction: p.direction,
        length: p.word.answer.length
      };
    }
    return clueMap;
  }

  function generate(words, maxRetries = 20) {
    if (!words || words.length === 0) return null;
    const sorted = [...words].sort((a, b) => b.answer.length - a.answer.length);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const grid = createEmptyGrid();
      const placed = [];

      const firstWord = sorted[0].answer.toUpperCase();
      const centerRow = Math.floor(GRID_SIZE / 2);
      const centerCol = Math.floor((GRID_SIZE - firstWord.length) / 2);
      placeWord(grid, firstWord, centerRow, centerCol, 'across', 0);
      placed.push({ wordIndex: 0, row: centerRow, col: centerCol, direction: 'across', word: sorted[0] });

      let intersected = 0;
      for (let i = 1; i < sorted.length; i++) {
        const word = sorted[i].answer.toUpperCase();
        const dirs = i % 2 === 1 ? ['down', 'across'] : ['across', 'down'];
        let bestPlacement = null;

        for (const dir of dirs) {
          const candidates = findIntersections(grid, word, dir);
          if (candidates.length > 0) {
            candidates.sort((a, b) =>
              (Math.abs(a.row - GRID_SIZE/2) + Math.abs(a.col - GRID_SIZE/2)) -
              (Math.abs(b.row - GRID_SIZE/2) + Math.abs(b.col - GRID_SIZE/2))
            );
            bestPlacement = candidates[0];
            break;
          }
        }

        if (bestPlacement) {
          placeWord(grid, word, bestPlacement.row, bestPlacement.col, bestPlacement.direction, i);
          placed.push({ wordIndex: i, row: bestPlacement.row, col: bestPlacement.col, direction: bestPlacement.direction, word: sorted[i] });
          intersected++;
        }
      }

      const ratio = intersected / Math.max(sorted.length - 1, 1);
      if (ratio >= 0.4 || attempt === maxRetries - 1) {
        if (placed.length < 2) continue;

        const { croppedGrid, offsetRow, offsetCol } = cropGrid(grid);
        assignNumbers(croppedGrid);

        const adjustedPlaced = placed.map(p => ({ ...p, row: p.row - offsetRow, col: p.col - offsetCol }));
        const clueMap = buildClueMap(croppedGrid, adjustedPlaced);

        if (Object.keys(clueMap.across).length === 0 && Object.keys(clueMap.down).length === 0) continue;

        return {
          grid: croppedGrid, clueMap,
          width: croppedGrid[0].length,
          height: croppedGrid.length,
          placed: adjustedPlaced
        };
      }
    }
    return null;
  }

  return { generate };
})();

if (typeof module !== 'undefined') module.exports = CrosswordGenerator;
