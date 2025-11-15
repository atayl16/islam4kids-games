  import { useState, useEffect } from 'react';
  import { WordSearchData, WordPosition } from './types';
  import CompletionOverlay from "../../../components/game-common/CompletionOverlay";
  import { PuzzleControls } from "../../../components/game-common/PuzzleControls";
  import { generateWordSearchGrid } from './utils';
  
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
        className={`word-search-cell ${isSelected ? 'selected' : ''} ${isFound ? 'found' : ''}`}
        onClick={() => onSelectCell(row, col)}
        aria-label={`${letter}, row ${row + 1}, column ${col + 1}`}
      >
        {letter}
      </button>
    );
  };
  
  // Export main WordSearch component
  export const WordSearch = ({ data, category }: { data: WordSearchData; category: string }) => {
    const [selectedCells, setSelectedCells] = useState<WordPosition[]>([]);
    const [startCell, setStartCell] = useState<WordPosition | null>(null);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [difficulty, setDifficulty] = useState<string>("medium");
    const [gameData, setGameData] = useState<WordSearchData>(data);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false); // State for overlay visibility
  
    useEffect(() => {
      // Regenerate the grid with the new difficulty
      const newData = generateWordSearchGrid(category, difficulty);
      setGameData(newData);

      // Reset game state
      setFoundWords([]);
      setSelectedCells([]);
      setStartCell(null);
      setIsOverlayVisible(false); // Reset overlay visibility
    }, [difficulty, category]);
  
    // Check for game completion
    useEffect(() => {
      if (foundWords.length === gameData.words.length && gameData.words.length > 0) {
        setIsOverlayVisible(true); // Show overlay when game is complete
      }
    }, [foundWords, gameData.words.length]);
  
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
      setIsOverlayVisible(false); // Reset overlay visibility
    };
  
    return (
      <div className="word-search">
        <h2 className="word-search-title">{gameData.title || "Word Search"}</h2>
        {gameData.meta?.instructions && (
          <p className="word-search-instructions">
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
  
        <div className="word-search-container">
          <div className="word-search-grid">
            {gameData.grid.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="word-search-row">
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
  
          <div className="word-search-words">
            <h3>Find these words:</h3>
            <div className="word-list">
              {gameData.words.map((wordData) => (
                <div
                  key={wordData.word}
                  className={`word-item ${
                    foundWords.includes(wordData.word) ? "found" : ""
                  }`}
                >
                  <span className="word">{wordData.word}</span>
                  {wordData.hint && (
                    <span className="translation"> <i>({wordData.hint})</i></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Completion Overlay */}
        <CompletionOverlay
          isVisible={isOverlayVisible}
          setIsVisible={setIsOverlayVisible} // Pass setIsVisible to allow closing
          title="Mashallah! Word Finder!"
          message={`You've found all ${gameData.words.length} words!`}
          onPlayAgain={resetGame}
          soundEffect="/audio/success.mp3"
        />
      </div>
    );
  };
