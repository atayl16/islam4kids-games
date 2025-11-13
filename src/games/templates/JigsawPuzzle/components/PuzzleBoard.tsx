// Responsible for rendering the puzzle board with the grid and solved pieces
import React from 'react';
import { Piece } from '../Piece';
import { PieceState } from '../types';

interface PuzzleBoardConfig {
  rows: number;
  columns: number;
  imageSrc: string;
}

interface PuzzleBoardProps {
  containerWidth: number;
  containerHeight: number;
  pieceWidth: number;
  pieceHeight: number;
  currentConfig: PuzzleBoardConfig;
  pieces: PieceState[];
  onDrop: (id: number, x: number, y: number) => boolean;
  boardRef: React.RefObject<HTMLDivElement | null>;
  horizontalOffset: number;  // Use the offset passed from parent
  verticalOffset: number;    // Use the offset passed from parent
}

export const PuzzleBoard = ({
  containerWidth,
  containerHeight,
  pieceWidth,
  pieceHeight,
  currentConfig,
  pieces,
  onDrop,
  boardRef,
  horizontalOffset,
  verticalOffset,
}: PuzzleBoardProps) => {
  // Get the board's position for accurate relative positioning
  const boardPosition = boardRef.current?.getBoundingClientRect() || { top: 0, left: 0 };

  // Calculate the actual puzzle dimensions
  const actualPuzzleWidth = pieceWidth * currentConfig.columns;
  const actualPuzzleHeight = pieceHeight * currentConfig.rows;

  return (
    <div
      ref={boardRef}
      className="puzzle-board"
      style={{
        width: actualPuzzleWidth,  // Set to actual puzzle width
        height: actualPuzzleHeight, // Set to actual puzzle height
        position: "relative",
        marginLeft: horizontalOffset, // Use margin for centering
        marginTop: verticalOffset,
        flex: "0 0 auto",
        border: "1px solid #ccc",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {/* Background image guide - full size to fill the container */}
      <div
        className="puzzle-guide"
        style={{
          backgroundImage: `url(${currentConfig.imageSrc})`,
          backgroundSize: `${actualPuzzleWidth}px ${actualPuzzleHeight}px`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
          position: "absolute",
          opacity: 0.3,
          left: 0,
          top: 0,
        }}
      />

      {/* Grid lines for visual guidance - positioned on the actual puzzle */}
      <div 
        className="grid-overlay"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      >
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

      {/* Solved pieces - rendered directly on the board without additional offsets */}
      {pieces
        .filter((piece) => piece.solved)
        .map((piece) => {
          const col = piece.id % currentConfig.columns;
          const row = Math.floor(piece.id / currentConfig.columns);
          
          return (
            <Piece
              key={`solved-${piece.id}`}
              id={piece.id}
              image={currentConfig.imageSrc}
              rows={currentConfig.rows}
              columns={currentConfig.columns}
              width={pieceWidth}
              height={pieceHeight}
              initialX={col * pieceWidth} // No need to add offset here since container is sized and positioned
              initialY={row * pieceHeight}
              isSolved={true}
              onDrop={onDrop}
              boardPosition={boardPosition}
            />
          );
        })}
    </div>
  );
};
