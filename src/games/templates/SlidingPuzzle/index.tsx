import { useState, useEffect } from 'react';
import { CompletionOverlay } from '../../../components/game-common/CompletionOverlay';
import {
  SlidingPuzzleGameProps,
  SlidingPuzzleGameState,
  GRID_SIZES,
} from './types';
import {
  shuffleTiles,
  moveTile,
  isPuzzleSolved,
  canMoveTile,
  calculateScore,
} from './utils';

export const SlidingPuzzleGame = ({
  difficulty,
  imageSlug,
  onComplete,
  onScoreChange,
}: SlidingPuzzleGameProps) => {
  const gridSize = GRID_SIZES[difficulty];

  const [gameState, setGameState] = useState<SlidingPuzzleGameState>({
    tiles: shuffleTiles(gridSize),
    emptyIndex: 0,
    moves: 0,
    isComplete: false,
    gridSize,
  });

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  // Update image source based on slug
  useEffect(() => {
    const img = new Image();
    const tryJpg = `/images/jigsaw/${imageSlug}.jpg`;
    const tryPng = `/images/jigsaw/${imageSlug}.png`;

    img.onload = () => {
      setImageSrc(img.src);
      setImageLoaded(true);
    };

    img.onerror = () => {
      // Try PNG if JPG fails
      const img2 = new Image();
      img2.onload = () => {
        setImageSrc(img2.src);
        setImageLoaded(true);
      };
      img2.onerror = () => {
        console.error(`Could not load image: ${imageSlug}`);
        setImageLoaded(false);
      };
      img2.src = tryPng;
    };

    img.src = tryJpg;
  }, [imageSlug]);

  // Reset puzzle when difficulty changes
  useEffect(() => {
    const newGridSize = GRID_SIZES[difficulty];
    setGameState({
      tiles: shuffleTiles(newGridSize),
      emptyIndex: 0,
      moves: 0,
      isComplete: false,
      gridSize: newGridSize,
    });
    if (onScoreChange) {
      onScoreChange(0);
    }
  }, [difficulty]);

  const handleTileClick = (index: number) => {
    if (gameState.isComplete) return;

    const newTiles = moveTile(gameState.tiles, index, gameState.gridSize);
    if (!newTiles) return;

    const newMoves = gameState.moves + 1;
    const solved = isPuzzleSolved(newTiles);

    if (solved) {
      const score = calculateScore(newMoves, gameState.gridSize, difficulty);
      if (onScoreChange) {
        onScoreChange(score);
      }
    }

    setGameState({
      tiles: newTiles,
      emptyIndex: newTiles.findIndex(t => t.value === 0),
      moves: newMoves,
      isComplete: solved,
      gridSize: gameState.gridSize,
    });
  };

  const handleReset = () => {
    setGameState({
      tiles: shuffleTiles(gridSize),
      emptyIndex: 0,
      moves: 0,
      isComplete: false,
      gridSize,
    });
    if (onScoreChange) {
      onScoreChange(0);
    }
  };

  const tileSize = 100 / gridSize;

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
              Shuffle
            </button>

            {/* Moves Counter */}
            <div className="flex items-center gap-3">
              <span className="text-slate-600 font-medium">Moves:</span>
              <div className="px-6 py-2 bg-gradient-to-r from-violet-100 to-emerald-100 rounded-xl">
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent">
                  {gameState.moves}
                </span>
              </div>
            </div>

            {/* Difficulty Badge */}
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-400 capitalize">
              {difficulty} ({gridSize}x{gridSize})
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-3xl shadow-card p-6 mb-6">
          {!imageLoaded ? (
            <div className="aspect-square flex items-center justify-center bg-slate-100 rounded-2xl">
              <div className="text-center">
                <div className="text-4xl mb-2">⏳</div>
                <div className="text-slate-600">Loading image...</div>
              </div>
            </div>
          ) : (
            <div className="aspect-square max-w-2xl mx-auto">
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-200 shadow-lg"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                  gap: '2px',
                }}
              >
                {gameState.tiles.map((tile, index) => {
                  const row = Math.floor(tile.correctPosition / gridSize);
                  const col = tile.correctPosition % gridSize;
                  const isMovable = canMoveTile(gameState.tiles, index, gridSize);

                  if (tile.value === 0) {
                    // Empty tile
                    return (
                      <div
                        key={tile.value}
                        className="bg-slate-300 rounded-sm"
                        style={{
                          gridColumn: col + 1,
                          gridRow: row + 1,
                        }}
                      />
                    );
                  }

                  return (
                    <button
                      key={tile.value}
                      onClick={() => handleTileClick(index)}
                      disabled={!isMovable || gameState.isComplete}
                      className={`
                        relative overflow-hidden rounded-sm
                        transition-all duration-200
                        ${isMovable && !gameState.isComplete ? 'hover:brightness-110 hover:scale-105 cursor-pointer shadow-lg' : 'cursor-not-allowed'}
                        ${tile.currentPosition === tile.correctPosition ? 'ring-2 ring-emerald-400 ring-inset' : ''}
                      `}
                      style={{
                        gridColumn: col + 1,
                        gridRow: row + 1,
                        backgroundImage: `url(${imageSrc})`,
                        backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                        backgroundPosition: `${col * tileSize}% ${row * tileSize}%`,
                      }}
                    >
                      {/* Tile number overlay (optional, for debugging) */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                          {tile.value}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 text-center text-sm text-slate-600">
            <p>Click on tiles adjacent to the empty space to slide them. Recreate the image!</p>
            <p className="mt-1 text-xs text-slate-500">
              Tiles with a green border are in the correct position
            </p>
          </div>
        </div>

        {/* Completion Overlay */}
        <CompletionOverlay
          isVisible={gameState.isComplete}
          title="Mashallah! Puzzle Solved!"
          message={`Completed in ${gameState.moves} moves! Score: ${calculateScore(gameState.moves, gameState.gridSize, difficulty)}`}
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
