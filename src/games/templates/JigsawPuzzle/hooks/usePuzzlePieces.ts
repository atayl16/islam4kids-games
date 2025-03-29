// Custom hook for managing puzzle pieces
import { useState, useCallback, useEffect } from 'react';
import { PieceState } from '../types';
import { VISUAL_CONFIG } from '../constants';

// Utility function for shuffling arrays
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Play snap sound when a piece is correctly placed
const playSnapSound = () => {
  const audio = new Audio("/audio/snap.mp3");
  audio.volume = 0.5;
  audio.play().catch(() => {
    // Silent catch for browsers that block autoplay
  });
};

export const usePuzzlePieces = (
  rows: number,
  columns: number,
  calculateDimensions: () => any,
  updateBoardRect: () => void
) => {
  const [pieces, setPieces] = useState<PieceState[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const totalPieces = rows * columns;
  
  // Update solvedCount whenever pieces change
  useEffect(() => {
    const newSolvedCount = pieces.filter((p) => p.solved).length;
    setSolvedCount(newSolvedCount);
  
    // Log for debugging
    console.log(`Solved pieces: ${newSolvedCount}/${totalPieces}`);
  
    // Check for completion
    if (newSolvedCount === totalPieces && totalPieces > 0) {
      console.log('🎉 Puzzle completed!');
    }
  }, [pieces, totalPieces]);
  
  // Initialize pieces
  const initializePieces = useCallback(() => {
    // Clear existing pieces
    setPieces([]);
    setSolvedCount(0);
    
    // Update board position before creating pieces
    updateBoardRect();
    
    const { containerWidth, containerHeight, pieceWidth, pieceHeight } = calculateDimensions();
    
    // Create piece pile on the right side
    const pileWidth = containerWidth * VISUAL_CONFIG.PILE_WIDTH_RATIO; 
    const pileHeight = containerHeight * VISUAL_CONFIG.PILE_HEIGHT_RATIO;
    
    // Starting position for the pile (right side of puzzle board)
    const pileLeft = containerWidth + 40; // 40px gap from puzzle board
    const pileTop = 150; // Better vertical positioning
    
    // Create and shuffle pieces
    const shuffledIds = shuffleArray(Array.from({ length: totalPieces }, (_, i) => i));
    
    const initialPieces = shuffledIds.map(id => {
      // Generate random position within the pile area
      const randomX = pileLeft + Math.random() * (pileWidth - pieceWidth);
      const randomY = pileTop + Math.random() * (pileHeight - pieceHeight);
      
      return {
        id,
        x: randomX,
        y: randomY,
        solved: false
      };
    });
    
    console.log(`Created ${initialPieces.length} puzzle pieces`);
    setPieces(initialPieces);
  }, [calculateDimensions, rows, columns, updateBoardRect, totalPieces]);
  
  // Handle piece movement and snapping
  const handlePieceMove = useCallback((id: number, x: number, y: number) => {
    const { pieceWidth, pieceHeight } = calculateDimensions();
  
    // Calculate correct grid position for this piece
    const col = id % columns;
    const row = Math.floor(id / columns);
  
    // Calculate target position on the board grid
    const targetX = col * pieceWidth;
    const targetY = row * pieceHeight;
  
    // Define a more forgiving snapping threshold (e.g., 120% of the larger dimension)
    const snapThreshold = Math.max(pieceWidth, pieceHeight) * 1.2;
  
    // Calculate the differences
    const diffX = Math.abs(x - targetX);
    const diffY = Math.abs(y - targetY);
  
    // Check if the piece is close enough to snap into place
    const isSolved = diffX <= snapThreshold && diffY <= snapThreshold;
  
    console.log(
      `Piece ${id}: position=(${x}, ${y}), target=(${targetX}, ${targetY}), diffX=${diffX}, diffY=${diffY}, snapThreshold=${snapThreshold}, isSolved=${isSolved}`
    );
  
    // Update piece position
    setPieces((prevPieces) =>
      prevPieces.map((piece) => {
        if (piece.id !== id) return piece;
  
        // Snap to correct position if solved
        if (isSolved) {
          console.log(`Piece ${id} snapped to position (${targetX}, ${targetY})`);
          playSnapSound();
          return { ...piece, x: targetX, y: targetY, solved: true };
        }
  
        // Otherwise, update position without snapping
        return { ...piece, x, y, solved: false };
      })
    );
  
    return isSolved;
  }, [calculateDimensions, columns]);
  
  return {
    pieces,
    setPieces,
    initializePieces,
    handlePieceMove,
    solvedCount,
    totalPieces
  };
};
