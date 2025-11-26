import { Board, Player, Position, ROWS, COLS, CONNECT } from './types';

/**
 * Create an empty board
 */
export const createEmptyBoard = (): Board => {
  return Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));
};

/**
 * Check if a column is full
 */
export const isColumnFull = (board: Board, col: number): boolean => {
  return board[0][col] !== null;
};

/**
 * Get the next available row in a column
 */
export const getNextAvailableRow = (board: Board, col: number): number | null => {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      return row;
    }
  }
  return null;
};

/**
 * Make a move on the board
 */
export const makeMove = (board: Board, col: number, player: Player): Board | null => {
  if (isColumnFull(board, col)) {
    return null;
  }

  const row = getNextAvailableRow(board, col);
  if (row === null) {
    return null;
  }

  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = player;
  return newBoard;
};

/**
 * Check for a winner and return winning cells
 */
export const checkWinner = (board: Board): { winner: Player; winningCells: Position[] } => {
  // Check horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - CONNECT; col++) {
      const player = board[row][col];
      if (player && checkLine(board, row, col, 0, 1, player)) {
        return {
          winner: player,
          winningCells: Array.from({ length: CONNECT }, (_, i) => ({
            row,
            col: col + i,
          })),
        };
      }
    }
  }

  // Check vertical
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row <= ROWS - CONNECT; row++) {
      const player = board[row][col];
      if (player && checkLine(board, row, col, 1, 0, player)) {
        return {
          winner: player,
          winningCells: Array.from({ length: CONNECT }, (_, i) => ({
            row: row + i,
            col,
          })),
        };
      }
    }
  }

  // Check diagonal (down-right)
  for (let row = 0; row <= ROWS - CONNECT; row++) {
    for (let col = 0; col <= COLS - CONNECT; col++) {
      const player = board[row][col];
      if (player && checkLine(board, row, col, 1, 1, player)) {
        return {
          winner: player,
          winningCells: Array.from({ length: CONNECT }, (_, i) => ({
            row: row + i,
            col: col + i,
          })),
        };
      }
    }
  }

  // Check diagonal (down-left)
  for (let row = 0; row <= ROWS - CONNECT; row++) {
    for (let col = CONNECT - 1; col < COLS; col++) {
      const player = board[row][col];
      if (player && checkLine(board, row, col, 1, -1, player)) {
        return {
          winner: player,
          winningCells: Array.from({ length: CONNECT }, (_, i) => ({
            row: row + i,
            col: col - i,
          })),
        };
      }
    }
  }

  return { winner: null, winningCells: [] };
};

/**
 * Helper function to check a line of cells
 */
const checkLine = (
  board: Board,
  row: number,
  col: number,
  rowDir: number,
  colDir: number,
  player: Player
): boolean => {
  for (let i = 0; i < CONNECT; i++) {
    if (board[row + i * rowDir][col + i * colDir] !== player) {
      return false;
    }
  }
  return true;
};

/**
 * Check if the board is full (draw)
 */
export const isBoardFull = (board: Board): boolean => {
  return board[0].every(cell => cell !== null);
};

/**
 * Get all valid columns for the current board
 */
export const getValidColumns = (board: Board): number[] => {
  return Array.from({ length: COLS }, (_, i) => i).filter(col => !isColumnFull(board, col));
};

/**
 * Evaluate board position for AI (simple heuristic)
 */
const evaluateBoard = (board: Board, player: Player): number => {
  const opponent = player === 1 ? 2 : 1;
  let score = 0;

  // Check all possible windows of 4 cells
  const evaluateWindow = (window: Player[]): number => {
    let windowScore = 0;
    const playerCount = window.filter(cell => cell === player).length;
    const opponentCount = window.filter(cell => cell === opponent).length;
    const emptyCount = window.filter(cell => cell === null).length;

    if (playerCount === 4) windowScore += 100;
    else if (playerCount === 3 && emptyCount === 1) windowScore += 5;
    else if (playerCount === 2 && emptyCount === 2) windowScore += 2;

    if (opponentCount === 3 && emptyCount === 1) windowScore -= 4;

    return windowScore;
  };

  // Horizontal windows
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - CONNECT; col++) {
      const window = board[row].slice(col, col + CONNECT);
      score += evaluateWindow(window);
    }
  }

  // Vertical windows
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row <= ROWS - CONNECT; row++) {
      const window = Array.from({ length: CONNECT }, (_, i) => board[row + i][col]);
      score += evaluateWindow(window);
    }
  }

  // Diagonal windows (down-right)
  for (let row = 0; row <= ROWS - CONNECT; row++) {
    for (let col = 0; col <= COLS - CONNECT; col++) {
      const window = Array.from({ length: CONNECT }, (_, i) => board[row + i][col + i]);
      score += evaluateWindow(window);
    }
  }

  // Diagonal windows (down-left)
  for (let row = 0; row <= ROWS - CONNECT; row++) {
    for (let col = CONNECT - 1; col < COLS; col++) {
      const window = Array.from({ length: CONNECT }, (_, i) => board[row + i][col - i]);
      score += evaluateWindow(window);
    }
  }

  return score;
};

/**
 * Minimax algorithm with alpha-beta pruning for AI
 */
const minimax = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  aiPlayer: Player
): number => {
  const { winner } = checkWinner(board);
  const validCols = getValidColumns(board);

  // Terminal conditions
  if (winner === aiPlayer) return 1000000;
  if (winner !== null) return -1000000;
  if (validCols.length === 0 || depth === 0) {
    return evaluateBoard(board, aiPlayer);
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const col of validCols) {
      const newBoard = makeMove(board, col, aiPlayer);
      if (newBoard) {
        const eval_ = minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer);
        maxEval = Math.max(maxEval, eval_);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    const opponent = aiPlayer === 1 ? 2 : 1;
    for (const col of validCols) {
      const newBoard = makeMove(board, col, opponent as Player);
      if (newBoard) {
        const eval_ = minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer);
        minEval = Math.min(minEval, eval_);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
};

/**
 * Get the best move for the AI player
 */
export const getBestMove = (board: Board, aiPlayer: Player, depth: number): number => {
  const validCols = getValidColumns(board);

  // For easy difficulty, sometimes make random moves
  if (depth === 1 && Math.random() < 0.5) {
    return validCols[Math.floor(Math.random() * validCols.length)];
  }

  let bestCol = validCols[0];
  let bestScore = -Infinity;

  for (const col of validCols) {
    const newBoard = makeMove(board, col, aiPlayer);
    if (newBoard) {
      const score = minimax(newBoard, depth, -Infinity, Infinity, false, aiPlayer);
      if (score > bestScore) {
        bestScore = score;
        bestCol = col;
      }
    }
  }

  return bestCol;
};

/**
 * Calculate score based on win condition and difficulty
 */
export const calculateScore = (
  winner: Player,
  moveCount: number,
  difficulty: 'easy' | 'medium' | 'hard'
): number => {
  if (winner === 1) {
    const baseScore = 100;
    const speedBonus = Math.max(0, 42 - moveCount) * 5; // Bonus for faster wins
    const multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
    return Math.floor((baseScore + speedBonus) * multiplier);
  }
  return 0;
};
