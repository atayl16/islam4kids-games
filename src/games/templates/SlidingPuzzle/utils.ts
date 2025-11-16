import { Tile, GRID_SIZES } from './types';

/**
 * Create initial solved tiles
 */
export const createSolvedTiles = (gridSize: number): Tile[] => {
  const totalTiles = gridSize * gridSize;
  return Array.from({ length: totalTiles }, (_, i) => ({
    value: i,
    correctPosition: i,
    currentPosition: i,
  }));
};

/**
 * Check if a puzzle configuration is solvable
 * A puzzle is solvable if the number of inversions is even (for odd grid sizes)
 * or if inversions + empty row is even (for even grid sizes)
 */
export const isSolvable = (tiles: Tile[], gridSize: number): boolean => {
  const values = tiles.map(t => t.value).filter(v => v !== 0);
  let inversions = 0;

  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      if (values[i] > values[j]) {
        inversions++;
      }
    }
  }

  if (gridSize % 2 === 1) {
    // Odd grid size: solvable if inversions is even
    return inversions % 2 === 0;
  } else {
    // Even grid size: solvable if (inversions + empty row from bottom) is even
    const emptyIndex = tiles.findIndex(t => t.value === 0);
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyRowFromBottom = gridSize - emptyRow;
    return (inversions + emptyRowFromBottom) % 2 === 0;
  }
};

/**
 * Shuffle tiles ensuring the result is solvable
 */
export const shuffleTiles = (gridSize: number): Tile[] => {
  let tiles: Tile[];
  let attempts = 0;
  const maxAttempts = 100;

  do {
    tiles = createSolvedTiles(gridSize);
    // Fisher-Yates shuffle
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    // Update current positions
    tiles = tiles.map((tile, index) => ({
      ...tile,
      currentPosition: index,
    }));
    attempts++;
  } while (!isSolvable(tiles, gridSize) && attempts < maxAttempts);

  // If we couldn't generate a solvable puzzle, swap two non-empty tiles
  if (!isSolvable(tiles, gridSize)) {
    const nonEmptyIndices = tiles
      .map((t, i) => (t.value !== 0 ? i : -1))
      .filter(i => i !== -1);
    if (nonEmptyIndices.length >= 2) {
      const [i, j] = nonEmptyIndices.slice(0, 2);
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
      tiles = tiles.map((tile, index) => ({
        ...tile,
        currentPosition: index,
      }));
    }
  }

  return tiles;
};

/**
 * Get indices of tiles that can move (adjacent to empty tile)
 */
export const getMovableTiles = (tiles: Tile[], gridSize: number): number[] => {
  const emptyIndex = tiles.findIndex(t => t.value === 0);
  const row = Math.floor(emptyIndex / gridSize);
  const col = emptyIndex % gridSize;
  const movable: number[] = [];

  // Check up
  if (row > 0) movable.push(emptyIndex - gridSize);
  // Check down
  if (row < gridSize - 1) movable.push(emptyIndex + gridSize);
  // Check left
  if (col > 0) movable.push(emptyIndex - 1);
  // Check right
  if (col < gridSize - 1) movable.push(emptyIndex + 1);

  return movable;
};

/**
 * Check if a tile can be moved
 */
export const canMoveTile = (tiles: Tile[], tileIndex: number, gridSize: number): boolean => {
  const movableTiles = getMovableTiles(tiles, gridSize);
  return movableTiles.includes(tileIndex);
};

/**
 * Move a tile if possible
 */
export const moveTile = (tiles: Tile[], tileIndex: number, gridSize: number): Tile[] | null => {
  if (!canMoveTile(tiles, tileIndex, gridSize)) {
    return null;
  }

  const emptyIndex = tiles.findIndex(t => t.value === 0);
  const newTiles = [...tiles];

  // Swap the tiles
  [newTiles[tileIndex], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[tileIndex]];

  // Update current positions
  return newTiles.map((tile, index) => ({
    ...tile,
    currentPosition: index,
  }));
};

/**
 * Check if the puzzle is solved
 */
export const isPuzzleSolved = (tiles: Tile[]): boolean => {
  return tiles.every(tile => tile.value === tile.correctPosition);
};

/**
 * Calculate score based on moves and difficulty
 */
export const calculateScore = (
  moves: number,
  gridSize: number,
  difficulty: 'easy' | 'medium' | 'hard'
): number => {
  const minMoves = gridSize * gridSize * 2; // Rough minimum moves estimate
  const efficiency = Math.max(0, 1 - (moves - minMoves) / (minMoves * 2));
  const baseScore = 100;
  const efficiencyBonus = Math.floor(efficiency * 100);
  const multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;

  return Math.floor((baseScore + efficiencyBonus) * multiplier);
};

/**
 * Get tile position in grid (row, col)
 */
export const getTilePosition = (index: number, gridSize: number): { row: number; col: number } => {
  return {
    row: Math.floor(index / gridSize),
    col: index % gridSize,
  };
};

/**
 * Get CSS transform for tile based on its current and correct positions
 */
export const getTileTransform = (tile: Tile, gridSize: number): string => {
  const current = getTilePosition(tile.currentPosition, gridSize);
  const correct = getTilePosition(tile.correctPosition, gridSize);

  return `translate(${(current.col - correct.col) * 100}%, ${(current.row - correct.row) * 100}%)`;
};
