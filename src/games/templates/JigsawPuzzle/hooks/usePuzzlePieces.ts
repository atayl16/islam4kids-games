// Custom hook for managing puzzle pieces
import { useState, useCallback, useEffect } from 'react';
import { PieceState } from '../types';
import { VISUAL_CONFIG, MIN_BOARD_WIDTH, MIN_BOARD_HEIGHT } from '../constants';

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

    // Make sure we have valid values for all dimensions
    const pieceWidth = columns > 0 ? validBoardWidth / columns : 80;
    const pieceHeight = rows > 0 ? validBoardHeight / rows : 80;

    const pileWidth = validBoardWidth * 0.8; // Fallback if VISUAL_CONFIG.PILE_WIDTH_RATIO is undefined
    const pileHeight = validBoardHeight * 0.8; // Fallback if VISUAL_CONFIG.PILE_HEIGHT_RATIO is undefined

    const pileLeft = validBoardWidth + 40;
    const pileTop = 150;

    console.log("Debugging initializePieces:");
    console.log("validBoardWidth:", validBoardWidth);
    console.log("validBoardHeight:", validBoardHeight);
    console.log("columns:", columns);
    console.log("rows:", rows);
    console.log("pieceWidth:", pieceWidth);
    console.log("pieceHeight:", pieceHeight);
    console.log("pileWidth:", pileWidth);
    console.log("pileHeight:", pileHeight);

    const shuffledIds = shuffleArray(Array.from({ length: totalPieces }, (_, i) => i));

    const initialPieces = shuffledIds.map((id) => {
      const randomX = pileLeft + Math.random() * Math.max(0, pileWidth - pieceWidth);
      const randomY = pileTop + Math.random() * Math.max(0, pileHeight - pieceHeight);

      console.log(`Piece ${id}: randomX=${randomX}, randomY=${randomY}`);

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
    const pieceWidth = columns > 0 ? validBoardWidth / columns : 80;
    const pieceHeight = rows > 0 ? validBoardHeight / rows : 80;

    const col = id % columns;
    const row = Math.floor(id / columns);

    const targetX = col * pieceWidth;
    const targetY = row * pieceHeight;

    // Use a safe value for snapThreshold
    const snapThreshold = Math.max(pieceWidth, pieceHeight, 80) * 
                          (typeof VISUAL_CONFIG.SNAP_THRESHOLD_RATIO === 'number' ? 
                           VISUAL_CONFIG.SNAP_THRESHOLD_RATIO : 1.5);

    const diffX = Math.abs(x - targetX);
    const diffY = Math.abs(y - targetY);

    console.log("Debugging handlePieceMove:");
    console.log("id:", id);
    console.log("x:", x, "y:", y);
    console.log("pieceWidth:", pieceWidth, "pieceHeight:", pieceHeight);
    console.log("targetX:", targetX, "targetY:", targetY);
    console.log("diffX:", diffX, "diffY:", diffY);
    console.log("snapThreshold:", snapThreshold);

    const isSolved = diffX <= snapThreshold && diffY <= snapThreshold;

    setPieces((prevPieces) =>
      prevPieces.map((piece) => {
        if (piece.id !== id) return piece;

        if (isSolved) {
          console.log(`Piece ${id} snapped to position (${targetX}, ${targetY})`);
          playSnapSound();
          return { ...piece, x: targetX, y: targetY, solved: true };
        }

        return { ...piece, x, y, solved: false };
      })
    );

    return isSolved;
  }, [columns, validBoardWidth, validBoardHeight]);

  return {
    pieces,
    setPieces,
    initializePieces,
    handlePieceMove,
    solvedCount,
    totalPieces,
  };
};
