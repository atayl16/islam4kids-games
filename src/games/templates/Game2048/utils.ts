import { Grid, Tile, Direction } from './types';

/**
 * Create an empty grid
 */
export const createEmptyGrid = (size: number): Grid => {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
};

/**
 * Generate unique ID for tiles
 */
let tileIdCounter = 0;
export const generateTileId = (): string => {
  return `tile-${Date.now()}-${tileIdCounter++}`;
};

/**
 * Add a random tile (2 or 4) to the grid
 */
export const addRandomTile = (grid: Grid): Grid => {
  const emptyCells: { row: number; col: number }[] = [];

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === null) {
        emptyCells.push({ row: rowIndex, col: colIndex });
      }
    });
  });

  if (emptyCells.length === 0) return grid;

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map(r => [...r]);
  const value = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4

  newGrid[row][col] = {
    value,
    id: generateTileId(),
    isNew: true,
  };

  return newGrid;
};

/**
 * Initialize grid with two random tiles
 */
export const initializeGrid = (size: number): Grid => {
  let grid = createEmptyGrid(size);
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return grid;
};

/**
 * Move and merge tiles in a specific direction
 */
export const move = (
  grid: Grid,
  direction: Direction
): { grid: Grid; score: number; moved: boolean } => {
  const size = grid.length;
  let newGrid = grid.map(row => [...row]);
  let score = 0;
  let moved = false;

  // Rotate grid for easier processing (always slide left)
  newGrid = rotateGridForDirection(newGrid, direction);

  // Process each row
  for (let row = 0; row < size; row++) {
    const { tiles, rowScore, rowMoved } = processRow(newGrid[row]);
    newGrid[row] = tiles;
    score += rowScore;
    if (rowMoved) moved = true;
  }

  // Rotate back
  newGrid = rotateGridBack(newGrid, direction);

  return { grid: newGrid, score, moved };
};

/**
 * Process a single row (slide and merge left)
 */
const processRow = (row: (Tile | null)[]): {
  tiles: (Tile | null)[];
  rowScore: number;
  rowMoved: boolean;
} => {
  // Extract non-null tiles
  const tiles = row.filter(tile => tile !== null) as Tile[];
  const newRow: (Tile | null)[] = Array(row.length).fill(null);
  let rowScore = 0;
  let rowMoved = false;
  let newIndex = 0;

  for (let i = 0; i < tiles.length; i++) {
    const current = tiles[i];

    if (i < tiles.length - 1 && current.value === tiles[i + 1].value) {
      // Merge tiles
      newRow[newIndex] = {
        value: current.value * 2,
        id: generateTileId(),
        isMerged: true,
      };
      rowScore += current.value * 2;
      i++; // Skip next tile
      rowMoved = true;
    } else {
      // Just move tile
      newRow[newIndex] = { ...current, isNew: false, isMerged: false };
      if (newIndex !== row.indexOf(current)) {
        rowMoved = true;
      }
    }
    newIndex++;
  }

  // Check if anything moved
  if (!rowMoved) {
    for (let i = 0; i < row.length; i++) {
      if (row[i] !== newRow[i]) {
        rowMoved = true;
        break;
      }
    }
  }

  return { tiles: newRow, rowScore, rowMoved };
};

/**
 * Rotate grid based on direction (for easier processing)
 */
const rotateGridForDirection = (grid: Grid, direction: Direction): Grid => {
  const size = grid.length;
  let rotated = grid.map(row => [...row]);

  switch (direction) {
    case 'up':
      // Transpose
      rotated = Array(size)
        .fill(null)
        .map((_, col) => grid.map(row => row[col]));
      break;
    case 'down':
      // Transpose and reverse
      rotated = Array(size)
        .fill(null)
        .map((_, col) => grid.map(row => row[col]).reverse());
      break;
    case 'right':
      // Reverse each row
      rotated = grid.map(row => [...row].reverse());
      break;
    case 'left':
      // No rotation needed
      break;
  }

  return rotated;
};

/**
 * Rotate grid back after processing
 */
const rotateGridBack = (grid: Grid, direction: Direction): Grid => {
  const size = grid.length;
  let rotated = grid.map(row => [...row]);

  switch (direction) {
    case 'up':
      // Transpose back
      rotated = Array(size)
        .fill(null)
        .map((_, col) => grid.map(row => row[col]));
      break;
    case 'down':
      // Reverse and transpose back
      rotated = Array(size)
        .fill(null)
        .map((_, col) =>
          grid
            .map(row => row[col])
            .reverse()
        );
      break;
    case 'right':
      // Reverse each row back
      rotated = grid.map(row => [...row].reverse());
      break;
    case 'left':
      // No rotation needed
      break;
  }

  return rotated;
};

/**
 * Check if any moves are available
 */
export const canMove = (grid: Grid): boolean => {
  const size = grid.length;

  // Check for empty cells
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === null) return true;
    }
  }

  // Check for adjacent tiles with same value
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const current = grid[row][col];
      if (current === null) continue;

      // Check right
      if (col < size - 1 && grid[row][col + 1]?.value === current.value) return true;
      // Check down
      if (row < size - 1 && grid[row + 1][col]?.value === current.value) return true;
    }
  }

  return false;
};

/**
 * Check if the player has won (reached 2048 or higher)
 */
export const hasWon = (grid: Grid, winTile: number = 2048): boolean => {
  return grid.some(row => row.some(tile => tile !== null && tile.value >= winTile));
};

/**
 * Get tile color based on value
 */
export const getTileColor = (value: number): string => {
  const colors: Record<number, string> = {
    2: 'bg-slate-100 text-slate-700',
    4: 'bg-slate-200 text-slate-700',
    8: 'bg-amber-400 text-white',
    16: 'bg-amber-500 text-white',
    32: 'bg-amber-600 text-white',
    64: 'bg-emerald-500 text-white',
    128: 'bg-emerald-600 text-white',
    256: 'bg-emerald-700 text-white',
    512: 'bg-violet-500 text-white',
    1024: 'bg-violet-600 text-white',
    2048: 'bg-violet-700 text-white',
    4096: 'bg-slate-900 text-white',
  };

  return colors[value] || 'bg-slate-900 text-white';
};

/**
 * Calculate final score with difficulty multiplier
 */
export const calculateFinalScore = (
  score: number,
  difficulty: 'easy' | 'medium' | 'hard'
): number => {
  const multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
  return Math.floor(score * multiplier);
};
