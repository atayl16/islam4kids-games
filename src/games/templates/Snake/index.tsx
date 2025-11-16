import { useState, useEffect, useCallback, useRef } from 'react';
import { CompletionOverlay } from '../../../components/game-common/CompletionOverlay';
import {
  SnakeGameProps,
  SnakeGameState,
  Direction,
  GRID_SIZE,
  CELL_SIZE,
  GAME_SPEEDS,
  INITIAL_SNAKE,
} from './types';
import {
  generateFood,
  getNextHeadPosition,
  isOutOfBounds,
  checkSelfCollision,
  positionsEqual,
  isValidDirectionChange,
  calculateScore,
} from './utils';

export const SnakeGame = ({ difficulty, onComplete, onScoreChange }: SnakeGameProps) => {
  const [gameState, setGameState] = useState<SnakeGameState>({
    snake: INITIAL_SNAKE,
    food: generateFood(INITIAL_SNAKE),
    direction: 'UP',
    nextDirection: 'UP',
    score: 0,
    isGameOver: false,
    isPaused: false,
    speed: GAME_SPEEDS[difficulty],
  });

  const gameLoopRef = useRef<number | undefined>(undefined);

  // Handle direction changes from keyboard
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState.isGameOver || gameState.isPaused) return;

    const keyToDirection: Record<string, Direction> = {
      ArrowUp: 'UP',
      w: 'UP',
      W: 'UP',
      ArrowDown: 'DOWN',
      s: 'DOWN',
      S: 'DOWN',
      ArrowLeft: 'LEFT',
      a: 'LEFT',
      A: 'LEFT',
      ArrowRight: 'RIGHT',
      d: 'RIGHT',
      D: 'RIGHT',
    };

    const newDirection = keyToDirection[event.key];
    if (newDirection && isValidDirectionChange(gameState.direction, newDirection)) {
      setGameState(prev => ({ ...prev, nextDirection: newDirection }));
      event.preventDefault();
    }

    // Handle pause with spacebar
    if (event.key === ' ') {
      setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
      event.preventDefault();
    }
  }, [gameState.direction, gameState.isGameOver, gameState.isPaused]);

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Main game loop
  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused) {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
      return;
    }

    const moveSnake = () => {
      setGameState(prev => {
        const head = prev.snake[0];
        const newDirection = prev.nextDirection;
        const newHead = getNextHeadPosition(head, newDirection);

        // Check for collisions
        if (isOutOfBounds(newHead) || checkSelfCollision(newHead, prev.snake.slice(1))) {
          return { ...prev, isGameOver: true };
        }

        // Check if food is eaten
        const ateFood = positionsEqual(newHead, prev.food);
        const newSnake = [newHead, ...prev.snake];

        if (!ateFood) {
          newSnake.pop(); // Remove tail if no food eaten
        }

        const newScore = calculateScore(newSnake.length, difficulty);
        const newFood = ateFood ? generateFood(newSnake) : prev.food;

        // Notify score change
        if (onScoreChange && newScore !== prev.score) {
          onScoreChange(newScore);
        }

        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          direction: newDirection,
          score: newScore,
        };
      });

      gameLoopRef.current = window.setTimeout(moveSnake, gameState.speed);
    };

    gameLoopRef.current = window.setTimeout(moveSnake, gameState.speed);

    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
    };
  }, [gameState.isGameOver, gameState.isPaused, gameState.speed, gameState.nextDirection, difficulty, onScoreChange]);

  // Handle reset
  const handleReset = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: 'UP',
      nextDirection: 'UP',
      score: 0,
      isGameOver: false,
      isPaused: false,
      speed: GAME_SPEEDS[difficulty],
    });
    if (onScoreChange) {
      onScoreChange(0);
    }
  };

  // Handle pause
  const handlePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  // Mobile controls
  const handleDirectionClick = (direction: Direction) => {
    if (gameState.isGameOver || gameState.isPaused) return;
    if (isValidDirectionChange(gameState.direction, direction)) {
      setGameState(prev => ({ ...prev, nextDirection: direction }));
    }
  };

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>

            {/* Pause Button */}
            <button
              onClick={handlePause}
              className="px-6 py-2 bg-gradient-to-r from-violet-500 to-violet-400 text-white rounded-xl font-medium shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              disabled={gameState.isGameOver}
            >
              {gameState.isPaused ? '▶️' : '⏸️'}
              {gameState.isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>

        {/* Score Display */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Score</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                {gameState.score}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Length</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-violet-500 bg-clip-text text-transparent">
                {gameState.snake.length}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Difficulty</div>
              <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-400 capitalize">
                {difficulty}
              </div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-3xl shadow-card p-6 mb-6">
          <div
            className="relative mx-auto bg-gradient-to-br from-emerald-50 to-violet-50 rounded-2xl shadow-inner"
            style={{
              width: GRID_SIZE * CELL_SIZE,
              height: GRID_SIZE * CELL_SIZE,
            }}
          >
            {/* Grid lines (optional) */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: GRID_SIZE }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute top-0 bottom-0 border-l border-emerald-300"
                  style={{ left: i * CELL_SIZE }}
                />
              ))}
              {Array.from({ length: GRID_SIZE }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute left-0 right-0 border-t border-emerald-300"
                  style={{ top: i * CELL_SIZE }}
                />
              ))}
            </div>

            {/* Snake */}
            {gameState.snake.map((segment, index) => (
              <div
                key={`snake-${index}`}
                className={`absolute rounded-md transition-all duration-100 ${
                  index === 0
                    ? 'bg-gradient-to-br from-emerald-600 to-emerald-500 shadow-lg z-10'
                    : 'bg-gradient-to-br from-emerald-500 to-emerald-400'
                }`}
                style={{
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                  margin: 1,
                }}
              >
                {/* Snake head eyes */}
                {index === 0 && (
                  <div className="flex gap-1 justify-center items-center h-full">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            ))}

            {/* Food */}
            <div
              className="absolute bg-gradient-to-br from-amber-500 to-amber-400 rounded-full shadow-lg animate-pulse z-10"
              style={{
                left: gameState.food.x * CELL_SIZE + 1,
                top: gameState.food.y * CELL_SIZE + 1,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-white text-xs">
                🍎
              </div>
            </div>

            {/* Pause overlay */}
            {gameState.isPaused && (
              <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center rounded-2xl z-20">
                <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
                  <div className="text-6xl mb-4">⏸️</div>
                  <div className="text-2xl font-bold text-slate-700 mb-2">Paused</div>
                  <div className="text-slate-600">Press SPACE to continue</div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center text-sm text-slate-600">
            <p className="mb-2">
              <span className="font-medium">Desktop:</span> Use Arrow Keys or WASD to move • SPACE to pause
            </p>
            <p>
              <span className="font-medium">Mobile:</span> Use the buttons below
            </p>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="bg-white rounded-3xl shadow-card p-6 mb-6 md:hidden">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleDirectionClick('UP')}
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white text-2xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
              disabled={gameState.isGameOver}
            >
              ↑
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => handleDirectionClick('LEFT')}
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white text-2xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
                disabled={gameState.isGameOver}
              >
                ←
              </button>
              <button
                onClick={() => handleDirectionClick('DOWN')}
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white text-2xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
                disabled={gameState.isGameOver}
              >
                ↓
              </button>
              <button
                onClick={() => handleDirectionClick('RIGHT')}
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white text-2xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
                disabled={gameState.isGameOver}
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Game Over Overlay */}
        <CompletionOverlay
          isVisible={gameState.isGameOver}
          title="Game Over!"
          message={`Final Score: ${gameState.score} | Length: ${gameState.snake.length}`}
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
