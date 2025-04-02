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
  boardWidth: number | undefined,
  boardHeight: number | undefined,
  updateBoardRect: () => void
) => {
  const [pieces, setPieces] = useState<PieceState[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const totalPieces = rows * columns;

  // Ensure we have valid values for board dimensions with multiple fallbacks
  const validBoardWidth = typeof boardWidth === 'number' ? boardWidth : 
                         (typeof VISUAL_CONFIG.MIN_BOARD_WIDTH === 'number' ? 
                          VISUAL_CONFIG.MIN_BOARD_WIDTH : 400);
                         
  const validBoardHeight = typeof boardHeight === 'number' ? boardHeight : 
                          (typeof VISUAL_CONFIG.MIN_BOARD_HEIGHT === 'number' ? 
                           VISUAL_CONFIG.MIN_BOARD_HEIGHT : 300);

  console.log("Board dimension check:", {
    originalBoardWidth: boardWidth,
    originalBoardHeight: boardHeight,
    validBoardWidth,
    validBoardHeight,
    visualConfigMinWidth: VISUAL_CONFIG.MIN_BOARD_WIDTH,
    visualConfigMinHeight: VISUAL_CONFIG.MIN_BOARD_HEIGHT
  });

  // Update solvedCount whenever pieces change
  useEffect(() => {
    const newSolvedCount = pieces.filter((p) => p.solved).length;
    setSolvedCount(newSolvedCount);

    console.log(`Solved pieces: ${newSolvedCount}/${totalPieces}`);

    if (newSolvedCount === totalPieces && totalPieces > 0) {
      console.log('🎉 Puzzle completed!');
    }
  }, [pieces, totalPieces]);

  // Initialize pieces
  const initializePieces = useCallback(() => {
    setPieces([]);
    setSolvedCount(0);

    updateBoardRect();

    // We're using the pre-calculated boardWidth and boardHeight which already preserve aspect ratio
    // from the parent component, so we can directly calculate piece dimensions
    const pieceWidth = validBoardWidth / columns;
    const pieceHeight = validBoardHeight / rows;
    
    console.log("Piece dimensions from aspect-ratio preserved board:", {
      pieceWidth,
      pieceHeight,
      aspectRatio: pieceWidth / pieceHeight,
      boardWidth: validBoardWidth,
      boardHeight: validBoardHeight
    });
    
    // Use fixed positioning for the pile to ensure it appears in the tray area
    const pileLeft = validBoardWidth + 20; // Fixed offset from the board
    const pileWidth = Math.min(validBoardWidth * 0.8, 300); // Limit max width
    const pileHeight = validBoardHeight * 0.8;
    const pileTop = 180; // Increased to position pieces lower, below the text

    console.log("Pile positioning:", {
      pileLeft,
      pileWidth,
      totalSpace: pileLeft + pileWidth,
      viewportWidth: window.innerWidth
    });

    const shuffledIds = shuffleArray(Array.from({ length: totalPieces }, (_, i) => i));

    const initialPieces = shuffledIds.map((id) => {
      const randomX = pileLeft + Math.random() * Math.max(0, pileWidth - pieceWidth);
      const randomY = pileTop + Math.random() * Math.max(0, pileHeight - pieceHeight);

      return {
        id,
        x: randomX,
        y: randomY,
        solved: false,
      };
    });

    console.log(`Created ${initialPieces.length} puzzle pieces`);
    setPieces(initialPieces);
  }, [columns, rows, validBoardWidth, validBoardHeight, updateBoardRect, totalPieces]);
  
  // Handle piece movement and snapping
  const handlePieceMove = useCallback((id: number, x: number, y: number) => {
    // Use the pre-calculated boardWidth and boardHeight which already preserve aspect ratio
    const pieceWidth = validBoardWidth / columns;
    const pieceHeight = validBoardHeight / rows;
    
    // Calculate position within the grid
    const col = id % columns;
    const row = Math.floor(id / columns);
  
    // Target should be calculated using the same logic as in index.tsx
    const targetX = col * pieceWidth;
    const targetY = row * pieceHeight;
  
    // Use much more generous thresholds for snapping
    const snapThresholdX = pieceWidth * 1.5; // 150% of piece width
    const snapThresholdY = pieceHeight * 1.5; // 150% of piece height
  
    const diffX = Math.abs(x - targetX);
    const diffY = Math.abs(y - targetY);
  
    console.log("Piece movement details:", {
      id,
      dropPosition: { x, y },
      targetPosition: { x: targetX, y: targetY },
      diffX,
      diffY,
      snapThresholdX,
      snapThresholdY
    });
  
    // A piece is solved if it's close enough to its target position
    const isSolved = diffX <= snapThresholdX && diffY <= snapThresholdY;
  
    setPieces((prevPieces) =>
      prevPieces.map((piece) => {
        if (piece.id !== id) return piece;
  
        if (isSolved) {
          console.log(`✅ Piece ${id} snapped to position (${targetX}, ${targetY})`);
          playSnapSound();
          return { ...piece, x: targetX, y: targetY, solved: true };
        }
  
        console.log(`❌ Piece ${id} did not snap - too far from target`);
        return { ...piece, x, y, solved: false };
      })
    );
  
    return isSolved;
  }, [columns, rows, validBoardWidth, validBoardHeight]);

  return {
    pieces,
    setPieces,
    initializePieces,
    handlePieceMove,
    solvedCount,
    totalPieces,
  };
};
