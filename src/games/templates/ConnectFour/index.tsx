import { useState, useEffect } from 'react';
import { CompletionOverlay } from '../../../components/game-common/CompletionOverlay';
import {
  ConnectFourGameProps,
  ConnectFourGameState,
  ROWS,
  COLS,
  AI_DEPTH,
} from './types';
import {
  createEmptyBoard,
  makeMove,
  checkWinner,
  isBoardFull,
  getBestMove,
  calculateScore,
  isColumnFull,
} from './utils';

export const ConnectFourGame = ({ difficulty, onComplete, onScoreChange }: ConnectFourGameProps) => {
  const [gameState, setGameState] = useState<ConnectFourGameState>({
    board: createEmptyBoard(),
    currentPlayer: 1, // Player 1 is human (green), Player 2 is AI (gold)
    winner: null,
    winningCells: [],
    isGameOver: false,
    moveCount: 0,
  });

  const [isAiThinking, setIsAiThinking] = useState(false);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  // AI move
  useEffect(() => {
    if (gameState.currentPlayer === 2 && !gameState.isGameOver && !isAiThinking) {
      setIsAiThinking(true);

      // Add a small delay to make it feel more natural
      const timeout = setTimeout(() => {
        const aiCol = getBestMove(gameState.board, 2, AI_DEPTH[difficulty]);
        handleColumnClick(aiCol);
        setIsAiThinking(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [gameState.currentPlayer, gameState.isGameOver, difficulty]);

  const handleColumnClick = (col: number) => {
    if (gameState.isGameOver || isAiThinking || isColumnFull(gameState.board, col)) {
      return;
    }

    const newBoard = makeMove(gameState.board, col, gameState.currentPlayer);
    if (!newBoard) return;

    const { winner, winningCells } = checkWinner(newBoard);
    const isDraw = !winner && isBoardFull(newBoard);
    const newMoveCount = gameState.moveCount + 1;

    if (winner || isDraw) {
      const score = calculateScore(winner, newMoveCount, difficulty);
      if (onScoreChange) {
        onScoreChange(score);
      }
      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer,
        winner,
        winningCells,
        isGameOver: true,
        moveCount: newMoveCount,
      });
    } else {
      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer === 1 ? 2 : 1,
        winner: null,
        winningCells: [],
        isGameOver: false,
        moveCount: newMoveCount,
      });
    }
  };

  const handleReset = () => {
    setGameState({
      board: createEmptyBoard(),
      currentPlayer: 1,
      winner: null,
      winningCells: [],
      isGameOver: false,
      moveCount: 0,
    });
    if (onScoreChange) {
      onScoreChange(0);
    }
  };

  const isCellWinning = (row: number, col: number): boolean => {
    return gameState.winningCells.some(cell => cell.row === row && cell.col === col);
  };

  const getCompletionMessage = (): string => {
    if (gameState.winner === 1) {
      const score = calculateScore(gameState.winner, gameState.moveCount, difficulty);
      return `You won in ${gameState.moveCount} moves! Score: ${score}`;
    } else if (gameState.winner === 2) {
      return "AI wins! Better luck next time!";
    } else {
      return "It's a draw! The board is full.";
    }
  };

  const getCompletionTitle = (): string => {
    if (gameState.winner === 1) {
      return "Mashallah! You Won!";
    } else if (gameState.winner === 2) {
      return "Game Over";
    } else {
      return "It's a Draw!";
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
              New Game
            </button>

            {/* Current Player Indicator */}
            <div className="flex items-center gap-3">
              <span className="text-slate-600 font-medium">Current Turn:</span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full transition-all duration-300 ${
                    gameState.currentPlayer === 1
                      ? 'bg-gradient-to-br from-emerald-600 to-emerald-500 shadow-lg scale-110'
                      : 'bg-gradient-to-br from-emerald-500 to-emerald-400 opacity-50'
                  }`}
                />
                <span className={`font-bold ${gameState.currentPlayer === 1 ? 'text-emerald-600' : 'text-slate-400'}`}>
                  You
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full transition-all duration-300 ${
                    gameState.currentPlayer === 2
                      ? 'bg-gradient-to-br from-amber-600 to-amber-500 shadow-lg scale-110'
                      : 'bg-gradient-to-br from-amber-500 to-amber-400 opacity-50'
                  }`}
                />
                <span className={`font-bold ${gameState.currentPlayer === 2 ? 'text-amber-600' : 'text-slate-400'}`}>
                  AI {isAiThinking && '🤔'}
                </span>
              </div>
            </div>

            {/* Difficulty Badge */}
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-violet-400 capitalize">
              {difficulty}
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Moves</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-violet-500 bg-clip-text text-transparent">
                {gameState.moveCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-slate-600 mb-2">Connect 4 to Win!</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-md"
                  />
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-600 mb-1">Players</div>
              <div className="flex gap-2">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 shadow-md mb-1" />
                  <span className="text-xs text-slate-600">You</span>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-500 shadow-md mb-1" />
                  <span className="text-xs text-slate-600">AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-3xl shadow-card p-6">
          <div className="bg-gradient-to-br from-violet-600 to-violet-500 rounded-2xl p-4 shadow-lg">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
              {/* Column hover indicators */}
              {Array.from({ length: COLS }, (_, col) => (
                <div
                  key={`indicator-${col}`}
                  className="flex justify-center mb-2 h-8"
                  onMouseEnter={() => setHoveredCol(col)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  {hoveredCol === col && !gameState.isGameOver && !isAiThinking && !isColumnFull(gameState.board, col) && gameState.currentPlayer === 1 && (
                    <div className="w-12 h-8 rounded-t-full bg-gradient-to-br from-emerald-600 to-emerald-500 opacity-50 animate-bounce" />
                  )}
                </div>
              ))}

              {/* Board cells */}
              {Array.from({ length: ROWS }, (_, row) =>
                Array.from({ length: COLS }, (_, col) => {
                  const cell = gameState.board[row][col];
                  const isWinning = isCellWinning(row, col);

                  return (
                    <button
                      key={`${row}-${col}`}
                      onClick={() => handleColumnClick(col)}
                      disabled={gameState.isGameOver || isAiThinking || gameState.currentPlayer === 2}
                      className={`
                        aspect-square rounded-full bg-slate-50 shadow-inner
                        transition-all duration-200
                        ${!gameState.isGameOver && !isAiThinking && gameState.currentPlayer === 1 && !isColumnFull(gameState.board, col) ? 'hover:bg-emerald-100 cursor-pointer' : ''}
                        ${isWinning ? 'ring-4 ring-white animate-pulse' : ''}
                      `}
                    >
                      {cell && (
                        <div
                          className={`
                            w-full h-full rounded-full shadow-lg
                            transition-all duration-300 animate-bounce-in
                            ${cell === 1 ? 'bg-gradient-to-br from-emerald-600 to-emerald-500' : 'bg-gradient-to-br from-amber-600 to-amber-500'}
                            ${isWinning ? 'scale-110' : ''}
                          `}
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center text-sm text-slate-600">
            <p>Click on a column to drop your piece (green). Connect 4 in a row to win!</p>
            {isAiThinking && <p className="mt-2 text-amber-600 font-medium">AI is thinking... 🤔</p>}
          </div>
        </div>

        {/* Game Over Overlay */}
        <CompletionOverlay
          isVisible={gameState.isGameOver}
          title={getCompletionTitle()}
          message={getCompletionMessage()}
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
