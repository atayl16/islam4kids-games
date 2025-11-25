import { useState, useEffect, useCallback } from 'react';
import { CompletionOverlay } from '../../../components/game-common/CompletionOverlay';
import { Game2048Props, Game2048State, Direction, GRID_SIZES, WIN_TILE } from './types';
import {
  initializeGrid,
  move,
  addRandomTile,
  canMove,
  hasWon,
  getTileColor,
  calculateFinalScore,
} from './utils';

export const Game2048 = ({ difficulty, onComplete, onScoreChange }: Game2048Props) => {
  const gridSize = GRID_SIZES[difficulty];

  const [gameState, setGameState] = useState<Game2048State>({
    grid: initializeGrid(gridSize),
    score: 0,
    bestScore: parseInt(localStorage.getItem('2048-best-score') || '0'),
    gameOver: false,
    won: false,
    gridSize,
  });

  // Reset game when difficulty changes
  useEffect(() => {
    const newGridSize = GRID_SIZES[difficulty];
    setGameState({
      grid: initializeGrid(newGridSize),
      score: 0,
      bestScore: parseInt(localStorage.getItem('2048-best-score') || '0'),
      gameOver: false,
      won: false,
      gridSize: newGridSize,
    });
    if (onScoreChange) {
      onScoreChange(0);
    }
  }, [difficulty]);

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (gameState.gameOver) return;

      const keyToDirection: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        W: 'up',
        s: 'down',
        S: 'down',
        a: 'left',
        A: 'left',
        d: 'right',
        D: 'right',
      };

      const direction = keyToDirection[event.key];
      if (direction) {
        event.preventDefault();
        handleMove(direction);
      }
    },
    [gameState.gameOver, gameState.grid]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleMove = (direction: Direction) => {
    if (gameState.gameOver) return;

    const { grid: newGrid, score: moveScore, moved } = move(gameState.grid, direction);

    if (!moved) return;

    // Add random tile
    const gridWithNewTile = addRandomTile(newGrid);
    const newScore = gameState.score + moveScore;

    // Update best score
    const newBestScore = Math.max(newScore, gameState.bestScore);
    if (newBestScore > gameState.bestScore) {
      localStorage.setItem('2048-best-score', newBestScore.toString());
    }

    // Check win condition
    const won = !gameState.won && hasWon(gridWithNewTile, WIN_TILE);

    // Check game over
    const gameOver = !canMove(gridWithNewTile);

    if (onScoreChange) {
      onScoreChange(calculateFinalScore(newScore, difficulty));
    }

    setGameState({
      grid: gridWithNewTile,
      score: newScore,
      bestScore: newBestScore,
      gameOver,
      won,
      gridSize: gameState.gridSize,
    });
  };

  const handleReset = () => {
    setGameState({
      grid: initializeGrid(gridSize),
      score: 0,
      bestScore: gameState.bestScore,
      gameOver: false,
      won: false,
      gridSize,
    });
    if (onScoreChange) {
      onScoreChange(0);
    }
  };

  const cellSize = gridSize === 4 ? 'w-20 h-20 md:w-24 md:h-24' : gridSize === 5 ? 'w-16 h-16 md:w-20 md:h-20' : 'w-14 h-14 md:w-16 md:h-16';
  const fontSize = gridSize === 4 ? 'text-2xl md:text-3xl' : gridSize === 5 ? 'text-xl md:text-2xl' : 'text-lg md:text-xl';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Controls */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-6 border-2 border-emerald-100">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-xl font-medium shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              New Game
            </button>

            {/* Score Display */}
            <div className="flex gap-4">
              <div className="bg-gradient-to-r from-violet-100 to-emerald-100 rounded-xl px-6 py-3">
                <div className="text-xs font-medium text-slate-600 mb-1">SCORE</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent">
                  {gameState.score}
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl px-6 py-3">
                <div className="text-xs font-medium text-slate-600 mb-1">BEST</div>
                <div className="text-2xl font-bold text-amber-600">{gameState.bestScore}</div>
              </div>
            </div>

            {/* Difficulty Badge */}
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-violet-400 capitalize">
              {difficulty} ({gridSize}x{gridSize})
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-3xl shadow-card p-6 mb-6">
          <div
            className="relative mx-auto bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl p-2 md:p-3 shadow-inner"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              gap: '0.5rem',
            }}
          >
            {/* Grid cells */}
            {gameState.grid.map((row, rowIndex) =>
              row.map((tile, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`${cellSize} bg-slate-400/30 rounded-lg flex items-center justify-center`}
                >
                  {tile && (
                    <div
                      className={`
                        ${cellSize} ${fontSize}
                        ${getTileColor(tile.value)}
                        rounded-lg flex items-center justify-center
                        font-bold shadow-lg
                        transition-all duration-200
                        ${tile.isNew ? 'animate-bounce-in' : ''}
                        ${tile.isMerged ? 'scale-110' : ''}
                      `}
                    >
                      {tile.value}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center text-sm text-slate-600">
            <p className="mb-2">
              <span className="font-medium">Desktop:</span> Use Arrow Keys or WASD to slide tiles
            </p>
            <p className="mb-2">
              <span className="font-medium">Mobile:</span> Swipe to move tiles
            </p>
            <p className="text-xs text-slate-500">
              Join tiles with the same number to create larger ones. Reach 2048 to win!
            </p>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="bg-white rounded-3xl shadow-card p-6 mb-6 md:hidden">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleMove('up')}
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white text-2xl shadow-lg active:scale-95 transition-transform"
            >
              ↑
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => handleMove('left')}
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white text-2xl shadow-lg active:scale-95 transition-transform"
              >
                ←
              </button>
              <button
                onClick={() => handleMove('down')}
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white text-2xl shadow-lg active:scale-95 transition-transform"
              >
                ↓
              </button>
              <button
                onClick={() => handleMove('right')}
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white text-2xl shadow-lg active:scale-95 transition-transform"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Win Overlay */}
        {gameState.won && !gameState.gameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-bounce-in">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
                    You Win!
                  </span>
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                  You reached {WIN_TILE}! Final Score: {calculateFinalScore(gameState.score, difficulty)}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() =>
                      setGameState(prev => ({
                        ...prev,
                        won: false,
                      }))
                    }
                    className="px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-400 text-white rounded-xl font-medium shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                  >
                    Keep Playing
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-xl font-medium shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                  >
                    New Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        <CompletionOverlay
          isVisible={gameState.gameOver}
          title="Game Over!"
          message={`Final Score: ${calculateFinalScore(gameState.score, difficulty)}${
            gameState.won ? ` - You reached ${WIN_TILE}!` : ''
          }`}
          onPlayAgain={handleReset}
          setIsVisible={() => {
            if (onComplete) onComplete();
          }}
          soundEffect=""
        />
      </div>
    </div>
  );
};
