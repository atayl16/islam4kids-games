  import { useState, useEffect } from 'react';
  import { WordSearchData, WordPosition } from './types';
  
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
      <div 
        className={`word-search-cell ${isSelected ? 'selected' : ''} ${isFound ? 'found' : ''}`}
        onClick={() => onSelectCell(row, col)}
        aria-label={`${letter}, row ${row + 1}, column ${col + 1}`}
      >
        {letter}
      </div>
    );
  };
  
  // Export main WordSearch component
  export const WordSearch = ({ data }: { data: WordSearchData }) => {
    const [selectedCells, setSelectedCells] = useState<WordPosition[]>([]);
    const [startCell, setStartCell] = useState<WordPosition | null>(null);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [gameComplete, setGameComplete] = useState(false);
  
    // Check for game completion
    useEffect(() => {
      if (foundWords.length === data.words.length && data.words.length > 0) {
        setGameComplete(true);
        try {
          new Audio('/audio/completion.mp3').play().catch(e => console.log('Audio play failed', e));
        } catch (error) {
          console.log('Audio playback error:', error);
        }
      }
    }, [foundWords, data.words.length]);
  
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
        data.grid[cell.row][cell.col]
      ).join('');
      
      const reversedLetters = [...selectedLetters].reverse().join('');
      
      // Check if it matches a word
      for (const wordData of data.words) {
        if (!foundWords.includes(wordData.word) && 
            (wordData.word === selectedLetters || wordData.word === reversedLetters)) {
          
          // Word found!
          setFoundWords([...foundWords, wordData.word]);
          try {
            new Audio('/audio/success.mp3').play().catch(e => console.log('Audio play failed', e));
          } catch (error) {
            console.log('Audio playback error:', error);
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
      return data.wordPlacements.some(placement => 
        foundWords.includes(placement.word) &&
        placement.positions.some(pos => pos.row === row && pos.col === col)
      );
    };
  
    // Check if a cell is currently selected
    const isCellSelected = (row: number, col: number): boolean => {
      return selectedCells.some(cell => cell.row === row && cell.col === col);
    };
  
    return (
      <div className="word-search">
        <h2 className="word-search-title">{data.title}</h2>
        {data.meta?.instructions && (
          <p className="word-search-instructions">{data.meta.instructions}</p>
        )}
        
        <div className="word-search-container">
          <div className="word-search-grid">
            {data.grid.map((row, rowIndex) => (
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
              {data.words.map((wordData) => (
                <div 
                  key={wordData.word}
                  className={`word-item ${foundWords.includes(wordData.word) ? 'found' : ''}`}
                >
                  <span className="word">{wordData.word}</span>
                  {wordData.hint && <span className="hint"> - {wordData.hint}</span>}
                </div>
              ))}
            </div>
            <div className="progress">
              {foundWords.length} / {data.words.length} words found
            </div>
          </div>
        </div>
        
        {gameComplete && (
          <div className="completion-message">
            <h3>Mashallah! You found all the words!</h3>
            <button onClick={() => window.location.reload()}>Play Again</button>
          </div>
        )}
      </div>
    );
  };
  
  // Re-export types and utility functions
  export { generateWordSearchGrid } from './utils';
  export * from './types';
