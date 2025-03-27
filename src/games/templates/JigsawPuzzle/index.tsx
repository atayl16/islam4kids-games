import { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Piece } from "./Piece";
import { JigsawConfig } from "./types";
import '../../../styles/jigsaw.css';

// Minimum size constraints for better visibility
const MIN_PIECE_WIDTH = 80; // Reduced minimum size
const MAX_CONTAINER_WIDTH = 900; // Reduced maximum width

export const JigsawPuzzle = ({ data }: { data: JigsawConfig }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pieces, setPieces] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      solved: boolean;
    }>
  >([]);
  const [boardRect, setBoardRect] = useState({ top: 0, left: 0 });
  const [isMobile] = useState(() =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );

  // Calculate dimensions based on container and image
  const calculateDimensions = () => {
    // Calculate available viewport height to ensure puzzle fits
    const viewportHeight = window.innerHeight * 0.7; // Use 70% of viewport height
    
    // Get base container width - limit to 50% of the total width for the split view
    const baseWidth = Math.min(
      MAX_CONTAINER_WIDTH / 2,
      (containerRef.current?.clientWidth || MAX_CONTAINER_WIDTH) / 2
    );
    const columns = data.jigsawConfig.columns;
    const rows = data.jigsawConfig.rows;

    // Initial calculations
    let pieceWidth = baseWidth / columns;
    if (pieceWidth < MIN_PIECE_WIDTH) {
      pieceWidth = MIN_PIECE_WIDTH;
    }
    
    let pieceHeight = pieceWidth;
    
    // Calculate total dimensions preserving aspect ratio
    const containerHeight = pieceHeight * rows;
    
    // If container is too tall, scale down proportionally
    if (containerHeight > viewportHeight) {
      const scale = viewportHeight / containerHeight;
      pieceWidth = pieceWidth * scale;
      pieceHeight = pieceHeight * scale;
    }

    return {
      containerWidth: pieceWidth * columns,
      containerHeight: pieceHeight * rows,
      pieceWidth,
      pieceHeight,
    };
  };

  // Fisher-Yates shuffle algorithm for randomizing array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize or reset piece positions with randomization
  const initializePieces = () => {
    const { containerWidth, containerHeight, pieceWidth, pieceHeight } =
      calculateDimensions();
      
    // Create a piece pile on the right side
    const pileWidth = containerWidth * 0.8; // Pile takes 80% of puzzle board width
    const pileHeight = containerHeight * 0.8; // And 80% of height
    
    // Starting position for the pile (right side of puzzle board)
    const pileLeft = containerWidth + 20; // 20px gap from puzzle board
    const pileTop = 20; // Start 20px from the top
    
    // Calculate how many pieces we need to place
    const totalPieces = data.jigsawConfig.rows * data.jigsawConfig.columns;
    
    // Create an array of sequential IDs and shuffle them
    const shuffledIds = shuffleArray(
      Array.from({ length: totalPieces }, (_, i) => i)
    );
    
    // Generate random positions for pieces within the pile area
    // Allow overlap by using a concentrated area
    const initialPieces = shuffledIds.map((id) => {
      // Random position within the pile area
      const randomX = pileLeft + Math.random() * (pileWidth - pieceWidth);
      const randomY = pileTop + Math.random() * (pileHeight - pieceHeight);
      
      return {
        id,
        x: randomX,
        y: randomY,
        solved: false,
      };
    });
    
    setPieces(initialPieces);
  };

  // Load image and calculate aspect ratio
  useEffect(() => {
    const img = new Image();
    img.src = data.jigsawConfig.imageSrc;
    img.onload = () => {
      // We no longer use the image aspect ratio directly since our pieces are square
      // But we still load the image first to make sure it's available
      initializePieces();
    };
  }, [data.jigsawConfig.imageSrc]);

  // Update board rect on mount and when resizing
  useEffect(() => {
    const updateBoardRect = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setBoardRect({ top: rect.top, left: rect.left });
      }
    };
    
    updateBoardRect();
    window.addEventListener('resize', updateBoardRect);
    return () => window.removeEventListener('resize', updateBoardRect);
  }, []);

  // Play sound effect when a piece snaps into place
  const playSnapSound = () => {
    const audio = new Audio("/audio/snap.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Silent catch - audio might fail on some browsers without user interaction
    });
  };

  // Handle piece position updates
  const handlePieceMove = (id: number, x: number, y: number) => {
    const { pieceWidth, pieceHeight } = calculateDimensions();
    const col = id % data.jigsawConfig.columns;
    const row = Math.floor(id / data.jigsawConfig.columns);
    
    // Calculate the absolute position within the puzzle board
    const targetX = col * pieceWidth;
    const targetY = row * pieceHeight;

    // More generous snapping distance
    const snapDistance = Math.min(pieceWidth, pieceHeight) / 3;
    const isSolved = Math.abs(x - targetX) < snapDistance && 
                    Math.abs(y - targetY) < snapDistance;

    // If it just got solved, play the snap sound
    const wasAlreadySolved = pieces.find(p => p.id === id)?.solved;
    if (isSolved && !wasAlreadySolved) {
      playSnapSound();
    }

    setPieces((prev) =>
      prev.map((piece) =>
        piece.id === id
          ? { 
              ...piece, 
              x: isSolved ? targetX : x,
              y: isSolved ? targetY : y,
              solved: isSolved || piece.solved 
            }
          : piece
      )
    );
    return isSolved;
  };

  // Get current dimensions
  const { containerWidth, containerHeight, pieceWidth } =
    calculateDimensions();
  const solvedCount = pieces.filter((p) => p.solved).length;
  const totalPieces = data.jigsawConfig.rows * data.jigsawConfig.columns;

  // Calculate full container width for split view (board + piece tray)
  const fullContainerWidth = containerWidth * 2 + 40; // board + tray + gap
  const maxVisibleHeight = Math.max(containerHeight, window.innerHeight * 0.7);

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className="puzzle-wrapper">
        <div className="puzzle-container" style={{ maxWidth: fullContainerWidth }}>
          <div className="puzzle-controls">
            <button 
              onClick={initializePieces}
              style={{
                padding: "8px 16px",
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              ⟳ Scramble Pieces
            </button>
            <div className="progress">
              {solvedCount}/{totalPieces} Completed
            </div>
          </div>

          <div className="game-area" style={{ height: maxVisibleHeight }}>
            {/* Puzzle Board (Left Side) */}
            <div
              ref={containerRef}
              className="puzzle-board"
              style={{
                width: containerWidth,
                height: containerHeight
              }}
            >
              {/* Background guide - fixed to match exact dimensions */}
              <div 
                className="puzzle-guide"
                style={{
                  backgroundImage: `url(${data.jigsawConfig.imageSrc})`,
                  backgroundSize: "100% 100%" // This will stretch to fit exactly
                }}
              />
              
              {/* Grid for more visual guidance */}
              <div>
                {Array.from({ length: data.jigsawConfig.columns - 1 }).map((_, idx) => (
                  <div
                    key={`vline-${idx}`}
                    className="piece-placeholder"
                    style={{
                      left: `${((idx + 1) * 100) / data.jigsawConfig.columns}%`,
                      top: 0,
                      width: "1px",
                      height: "100%"
                    }}
                  />
                ))}
                {Array.from({ length: data.jigsawConfig.rows - 1 }).map((_, idx) => (
                  <div
                    key={`hline-${idx}`}
                    className="piece-placeholder"
                    style={{
                      top: `${((idx + 1) * 100) / data.jigsawConfig.rows}%`,
                      left: 0,
                      width: "100%",
                      height: "1px"
                    }}
                  />
                ))}
              </div>
              
              {/* Solved pieces are rendered directly on the board for better positioning */}
              {pieces.filter(piece => piece.solved).map((piece) => (
                <Piece
                  key={`solved-${piece.id}`}
                  id={piece.id}
                  image={data.jigsawConfig.imageSrc}
                  rows={data.jigsawConfig.rows}
                  columns={data.jigsawConfig.columns}
                  size={pieceWidth}
                  initialX={piece.x}
                  initialY={piece.y}
                  isSolved={true}
                  onDrop={handlePieceMove}
                  boardPosition={{ top: 0, left: 0 }}
                />
              ))}
            </div>

            {/* Piece Tray/Pile (Right Side) */}
            <div 
              className="piece-tray"
              style={{
                width: containerWidth,
                height: containerHeight
              }}
            >
              <div 
                style={{ 
                  padding: "8px", 
                  textAlign: "center", 
                  color: "#666",
                  borderBottom: "1px solid #eee" 
                }}
              >
                Drag pieces to the puzzle board
              </div>
            </div>

            {/* Only unsolved pieces are rendered outside the board */}
            {pieces.filter(piece => !piece.solved).map((piece) => (
              <Piece
                key={`unsolved-${piece.id}`}
                id={piece.id}
                image={data.jigsawConfig.imageSrc}
                rows={data.jigsawConfig.rows}
                columns={data.jigsawConfig.columns}
                size={pieceWidth}
                initialX={piece.x}
                initialY={piece.y}
                isSolved={false}
                onDrop={handlePieceMove}
                boardPosition={boardRect}
              />
            ))}

            {/* Completion Overlay */}
            {solvedCount === totalPieces && totalPieces > 0 && (
              <div className="completion-message">
                <h3>Mashallah! Puzzle Complete!</h3>
                <audio src="/audio/takbir.mp3" autoPlay />
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
