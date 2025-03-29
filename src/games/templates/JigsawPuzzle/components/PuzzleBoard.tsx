// Responsible for rendering the puzzle board with the grid and solved pieces
import React from 'react';
import { Piece } from '../Piece';
import { PieceState } from '../types';

interface PuzzleBoardProps {
  containerWidth: number;
  containerHeight: number;
  pieceWidth: number;
  currentConfig: any;
  pieces: PieceState[];
  onDrop: (id: number, x: number, y: number) => boolean;
  boardRef: React.RefObject<HTMLDivElement | null>;
}

export const PuzzleBoard = ({
  containerWidth,
  containerHeight,
  pieceWidth,
  currentConfig,
  pieces,
  onDrop,
  boardRef,
}: PuzzleBoardProps) => {
  // Get the board's position for accurate relative positioning
  const boardPosition = boardRef.current?.getBoundingClientRect() || { top: 0, left: 0 };

  return (
    <div
      ref={boardRef}
      className="puzzle-board"
      style={{
        width: containerWidth,
        height: containerHeight,
        position: "relative",
        flex: "0 0 auto",
        border: "1px solid #ccc",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {/* Background image guide */}
      <div
        className="puzzle-guide"
        style={{
          backgroundImage: `url(${currentConfig.imageSrc})`,
          backgroundSize: "100% 100%",
          width: "100%",
          height: "100%",
          position: "absolute",
          opacity: 0.3,
        }}
      />

      {/* Grid lines for visual guidance */}
      <div className="grid-overlay">
        {Array.from({ length: currentConfig.columns - 1 }).map((_, idx) => (
          <div
            key={`vline-${idx}`}
            className="grid-line vertical"
            style={{
              left: `${((idx + 1) * 100) / currentConfig.columns}%`,
              top: 0,
              width: "1px",
              height: "100%",
              position: "absolute",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          />
        ))}
        {Array.from({ length: currentConfig.rows - 1 }).map((_, idx) => (
          <div
            key={`hline-${idx}`}
            className="grid-line horizontal"
            style={{
              top: `${((idx + 1) * 100) / currentConfig.rows}%`,
              left: 0,
              width: "100%",
              height: "1px",
              position: "absolute",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          />
        ))}
      </div>

      {/* Solved pieces - rendered directly on the board */}
      {pieces
        .filter((piece) => piece.solved)
        .map((piece) => (
          <Piece
            key={`solved-${piece.id}`}
            id={piece.id}
            image={currentConfig.imageSrc}
            rows={currentConfig.rows}
            columns={currentConfig.columns}
            size={pieceWidth}
            initialX={piece.x}
            initialY={piece.y}
            isSolved={true}
            onDrop={onDrop}
            boardPosition={boardPosition} // Pass accurate board position
          />
        ))}
    </div>
  );
};
