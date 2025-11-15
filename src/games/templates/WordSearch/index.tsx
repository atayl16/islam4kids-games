import { useState, useEffect, useRef } from 'react';
import { WordSearchData, WordPosition } from './types';
import CompletionOverlay from "../../../components/game-common/CompletionOverlay";
import { PuzzleControls } from "../../../components/game-common/PuzzleControls";
import { generateWordSearchGrid } from './utils';
import { useProgressContext } from "../../../contexts/ProgressContext";

export { generateWordSearchGrid } from "./utils";
export type { WordSearchData } from "./types";

// Component for individual grid cells
const Cell = ({
  letter,
  row,
  col,
  isSelected,
  isFound,
  onSelectCell
}: {
  letter: string;
  row: number;
  col: number;
  isSelected: boolean;
  isFound: boolean;
  onSelectCell: (row: number, col: number) => void;
}) => {
  return (
    <button
      type="button"
      className={`
        flex items-center justify-center
        w-10 h-10 sm:w-12 sm:h-12
        font-bold text-lg sm:text-xl
        border-2 rounded-lg
        cursor-pointer select-none
        transition-all duration-200
        ${isFound
          ? 'bg-gradient-to-br from-emerald-500 to-emerald-400 text-white border-emerald-600 shadow-lg'
          : isSelected
          ? 'bg-gradient-to-br from-violet-200 to-violet-100 text-violet-900 border-violet-400 scale-105'
          : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400 hover:shadow-md'
        }
      `}
      onClick={() => onSelectCell(row, col)}
      aria-label={`${letter}, row ${row + 1}, column ${col + 1}`}
    >
      {letter}
    </button>
  );
};

// Export main WordSearch component
export const WordSearch = ({ data, category, gameSlug }: { data: WordSearchData; category: string; gameSlug: string }) => {
  const { recordGameSession } = useProgressContext();
  const startTimeRef = useRef<number>(Date.now());
  const [selectedCells, setSelectedCells] = useState<WordPosition[]>([]);
  const [startCell, setStartCell] = useState<WordPosition | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [gameData, setGameData] = useState<WordSearchData>(data);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    // Regenerate the grid with the new difficulty
    const newData = generateWordSearchGrid(category, difficulty);
    setGameData(newData);

    // Reset game state
    setFoundWords([]);
    setSelectedCells([]);
    setStartCell(null);
    setIsOverlayVisible(false);
    startTimeRef.current = Date.now(); // Reset timer
  }, [difficulty, category]);

  // Check for game completion
  useEffect(() => {
    if (foundWords.length === gameData.words.length && gameData.words.length > 0) {
      // Record game session before showing overlay
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      recordGameSession({
        gameType: 'wordSearch',
        gameSlug,
        score: foundWords.length, // Score is number of words found
        completed: true,
        timeSpent,
        difficulty,
        timestamp: new Date().toISOString(),
      });
      setIsOverlayVisible(true);
    }
  }, [foundWords, gameData.words.length, difficulty, gameSlug, recordGameSession]);

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (!startCell) {
      // First cell selected
      setStartCell({ row, col });
      setSelectedCells([{ row, col }]);
    } else {
      // Second cell selected - check if it forms a straight line
      const endCell = { row, col };

      // Determine if selection is a valid line
      const rowDiff = endCell.row - startCell.row;
      const colDiff = endCell.col - startCell.col;

      if (
        (rowDiff === 0 && colDiff !== 0) || // horizontal
        (colDiff === 0 && rowDiff !== 0) || // vertical
        (Math.abs(rowDiff) === Math.abs(colDiff)) // diagonal
      ) {
        const cells = getCellsInLine(startCell, endCell);
        setSelectedCells(cells);

        // Check if selection matches a word
        checkSelection(cells);
      }

      setStartCell(null);
    }
  };

  // Get all cells in a straight line
  const getCellsInLine = (start: WordPosition, end: WordPosition): WordPosition[] => {
    const cells: WordPosition[] = [];
    const dx = Math.sign(end.col - start.col);
    const dy = Math.sign(end.row - start.row);
    const steps = Math.max(
      Math.abs(end.row - start.row),
      Math.abs(end.col - start.col)
    );

    for (let i = 0; i <= steps; i++) {
      cells.push({
        row: start.row + i * dy,
        col: start.col + i * dx
      });
    }

    return cells;
  };

  // Check if the current selection matches a word
  const checkSelection = (cells: WordPosition[]) => {
    // Get the selected letters
    const selectedLetters = cells.map(cell =>
      gameData.grid[cell.row][cell.col]
    ).join('');

    const reversedLetters = [...selectedLetters].reverse().join('');

    // Check if it matches a word
    for (const wordData of gameData.words) {
      if (!foundWords.includes(wordData.word) &&
          (wordData.word === selectedLetters || wordData.word === reversedLetters)) {

        // Word found!
        setFoundWords([...foundWords, wordData.word]);
        try {
          new Audio('/audio/success.mp3').play().catch(() => {});
        } catch (error) {
          // Silent catch for audio errors
        }

        // Clear selection after a short delay
        setTimeout(() => {
          setSelectedCells([]);
        }, 500);
        return;
      }
    }

    // If no match, clear selection after a short delay
    setTimeout(() => {
      setSelectedCells([]);
    }, 300);
  };

  // Check if a cell is in the found words
  const isCellInFoundWord = (row: number, col: number): boolean => {
    return gameData.wordPlacements.some(placement =>
      foundWords.includes(placement.word) &&
      placement.positions.some(pos => pos.row === row && pos.col === col)
    );
  };

  // Check if a cell is currently selected
  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  // Reset the game
  const resetGame = () => {
    setFoundWords([]);
    setSelectedCells([]);
    setStartCell(null);
    setIsOverlayVisible(false);
    startTimeRef.current = Date.now(); // Reset timer
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
          {gameData.title || "Word Search"}
        </span>
      </h2>
      {gameData.meta?.instructions && (
        <p className="text-lg text-slate-600 text-center mb-6 max-w-2xl mx-auto">
          {gameData.meta.instructions}
        </p>
      )}

      <PuzzleControls
        currentDifficulty={difficulty}
        solvedCount={foundWords.length}
        totalPieces={gameData.words.length}
        onScramble={resetGame}
        scrambleLabel="Reset Game"
        progressLabel={(solved, total) => `${solved} / ${total} words found`}
        difficultyOptions={[
          { value: "easy", label: "Easy (8×8 grid, no diagonals)" },
          { value: "medium", label: "Medium (10×10 grid)" },
          { value: "hard", label: "Hard (12×12 grid, more diagonals)" },
        ]}
        onDifficultyChange={(newDifficulty) => {
          setDifficulty(newDifficulty);
        }}
      />

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Word Search Grid */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100">
          <div className="inline-grid gap-1">
            {gameData.grid.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex gap-1">
                {row.map((letter, colIndex) => (
                  <Cell
                    key={`cell-${rowIndex}-${colIndex}`}
                    letter={letter}
                    row={rowIndex}
                    col={colIndex}
                    isSelected={isCellSelected(rowIndex, colIndex)}
                    isFound={isCellInFoundWord(rowIndex, colIndex)}
                    onSelectCell={handleCellClick}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Word List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-violet-100 min-w-[250px]">
          <h3 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Find these words:
          </h3>
          <div className="space-y-2">
            {gameData.words.map((wordData) => (
              <div
                key={wordData.word}
                className={`
                  p-3 rounded-xl border-2 transition-all duration-300
                  ${foundWords.includes(wordData.word)
                    ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 border-emerald-300 line-through opacity-75'
                    : 'bg-slate-50 border-slate-200 hover:border-violet-300'
                  }
                `}
              >
                <span className="font-bold text-slate-700">{wordData.word}</span>
                {wordData.hint && (
                  <span className="text-sm text-slate-500 italic block mt-1">
                    ({wordData.hint})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Completion Overlay */}
      <CompletionOverlay
        isVisible={isOverlayVisible}
        setIsVisible={setIsOverlayVisible}
        title="Mashallah! Word Finder!"
        message={`You've found all ${gameData.words.length} words!`}
        onPlayAgain={resetGame}
        soundEffect="/audio/success.mp3"
      />
    </div>
  );
};
