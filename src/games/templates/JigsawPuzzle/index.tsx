import { useRef, useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { 
  JIGSAW_DIFFICULTY_PRESETS,
  GAME_SETTINGS,
  VISUAL_CONFIG,
  Z_INDEX
} from "./constants";
import { JigsawConfig } from "./types";
import '../../../styles/jigsaw.css';

// Import components
import { PuzzleBoard } from "./components/PuzzleBoard";
import { PieceTray } from "./components/PieceTray";
import { PuzzleControls } from "./components/PuzzleControls";
import { CompletionOverlay } from "./components/CompletionOverlay";
import { Piece } from "./Piece";

// Import hooks
import { useBoardPosition } from "./hooks/useBoardPosition";
import { usePuzzleDimensions } from "./hooks/usePuzzleDimensions";
import { usePuzzlePieces } from "./hooks/usePuzzlePieces";

// Import utilities
import { validateJigsawConfig } from "./utils";

export const JigsawPuzzle = ({ data }: { data: JigsawConfig }) => {
  // Validate configuration
  const validatedData = validateJigsawConfig(data);

  // Detect mobile devices
  const [isMobile] = useState(() =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );

  // Manage difficulty state
  const [currentDifficulty, setCurrentDifficulty] = useState<
    keyof typeof JIGSAW_DIFFICULTY_PRESETS
  >(
    (validatedData.meta
      ?.defaultDifficulty as keyof typeof JIGSAW_DIFFICULTY_PRESETS) || "medium"
  );

  // Get current configuration
  const difficultyConfig =
    JIGSAW_DIFFICULTY_PRESETS[currentDifficulty] ||
    JIGSAW_DIFFICULTY_PRESETS.medium;
  const currentConfig = {
    ...validatedData.jigsawConfig,
    rows: difficultyConfig.rows,
    columns: difficultyConfig.columns,
  };

  // Create refs
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Use custom hooks
  const { boardRect, updateBoardRect } = useBoardPosition(containerRef);
  const { calculateDimensions } = usePuzzleDimensions(
    containerRef,
    currentConfig.rows,
    currentConfig.columns
  );
  const {
    pieces,
    initializePieces,
    handlePieceMove,
    solvedCount,
    totalPieces,
  } = usePuzzlePieces(
    currentConfig.rows,
    currentConfig.columns,
    calculateDimensions,
    updateBoardRect
  );

  // Update board position when component mounts or resizes
  useEffect(() => {
    const updatePositions = () => {
      updateBoardRect();
    };

    // Initial update
    updatePositions();

    // Update on resize
    window.addEventListener("resize", updatePositions);

    // Additional updates to ensure correct positioning after animations/transitions
    const timers = [
      setTimeout(updatePositions, 100),
      setTimeout(updatePositions, 500),
    ];

    return () => {
      window.removeEventListener("resize", updatePositions);
      timers.forEach((t) => clearTimeout(t));
    };
  }, [updateBoardRect]);

  // Load image and initialize pieces when difficulty or image changes
  useEffect(() => {
    const img = new Image();
    img.src = currentConfig.imageSrc;

    img.onload = () => {
      // Initialize pieces after image loads
      initializePieces(currentConfig.imageSrc);

      // Update board position after pieces are initialized
      setTimeout(updateBoardRect, 50);
    };
  }, [
    currentConfig.imageSrc,
    currentDifficulty,
    initializePieces,
    updateBoardRect,
  ]);

  // Handle difficulty change
  const handleDifficultyChange = (difficulty: string) => {
    setCurrentDifficulty(difficulty as keyof typeof JIGSAW_DIFFICULTY_PRESETS);
  };

  // Calculate layout dimensions
  const { containerWidth, containerHeight, pieceWidth } = calculateDimensions();
  const fullContainerWidth = containerWidth * 2 + GAME_SETTINGS.PIECE_TRAY_GAP;
  const maxVisibleHeight = Math.max(
    containerHeight,
    window.innerHeight * VISUAL_CONFIG.VIEWPORT_HEIGHT_RATIO
  );

  // Custom piece drop handler with logging
  const handlePieceDrop = (id: number, x: number, y: number) => {
    // Log the reported relative drop coordinates from the Piece component
    console.log(`Piece ${id} raw drop position: (${x}, ${y})`);
    console.log(`Board position: (${boardRect.left}, ${boardRect.top})`);
    
    // Convert the relative coordinates into absolute coordinates
    const absX = x + boardRect.left;
    const absY = y + boardRect.top;
    
    console.log(`Using absolute drop position: (${absX}, ${absY})`);
    
    return handlePieceMove(id, absX, absY);
  };

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className="puzzle-wrapper" ref={wrapperRef}>
        <div
          className="puzzle-container"
          style={{
            maxWidth: fullContainerWidth,
            position: "relative",
          }}
        >
          {/* Controls section */}
          <PuzzleControls
            currentDifficulty={currentDifficulty}
            onDifficultyChange={handleDifficultyChange}
            onScramble={() => {
              initializePieces(currentConfig.imageSrc);
            }}
            solvedCount={solvedCount}
            totalPieces={totalPieces}
          />

          <div
            className="game-area"
            style={{
              height: maxVisibleHeight,
              display: "flex",
              position: "relative",
              alignItems: "flex-start",
            }}
          >
            {/* Puzzle Board */}
            <PuzzleBoard
              containerWidth={containerWidth}
              containerHeight={containerHeight}
              pieceWidth={pieceWidth}
              currentConfig={currentConfig}
              pieces={pieces}
              onDrop={handlePieceDrop}
              boardRef={containerRef}
            />

            {/* Piece Tray/Pile */}
            <PieceTray
              containerWidth={containerWidth}
              containerHeight={containerHeight}
            />
          </div>

          {/* Unsolved pieces floating layer */}
          <div
            className="unsolved-pieces-container"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: Z_INDEX.UNSOLVED_PIECES,
            }}
          >
            {pieces
              .filter((piece) => !piece.solved)
              .map((piece) => (
                <Piece
                  key={`unsolved-${piece.id}`}
                  id={piece.id}
                  image={currentConfig.imageSrc}
                  rows={currentConfig.rows}
                  columns={currentConfig.columns}
                  size={pieceWidth}
                  initialX={piece.x}
                  initialY={piece.y}
                  isSolved={false}
                  onDrop={handlePieceDrop}
                  boardPosition={boardRect}
                  style={{ pointerEvents: "auto" }}
                />
              ))}
          </div>

          {/* Completion Overlay */}
          <CompletionOverlay
            isVisible={solvedCount === totalPieces && totalPieces > 0}
            totalPieces={totalPieces}
          />
        </div>
      </div>
    </DndProvider>
  );
};
