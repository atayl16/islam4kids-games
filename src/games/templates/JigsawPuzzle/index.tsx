import { useRef, useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {
  JIGSAW_DIFFICULTY_PRESETS,
  GAME_SETTINGS,
  VISUAL_CONFIG,
  Z_INDEX,
} from "./constants";
import { JigsawConfig } from "./types";
import "../../../styles/jigsaw.css";

// Import components
import { PuzzleBoard } from "./components/PuzzleBoard";
import { PieceTray } from "./components/PieceTray";
import { Piece } from "./Piece";
import CompletionOverlay from "../../../components/game-common/CompletionOverlay";
import { PuzzleControls } from "../../../components/game-common/PuzzleControls";

// Import hooks
import { useBoardPosition } from "./hooks/useBoardPosition";
import { usePuzzlePieces } from "./hooks/usePuzzlePieces";

// Import utilities
import { validateJigsawConfig } from "./utils";

// Calculate responsive board dimensions
const calculateResponsiveBoardDimensions = () => {
  const viewportWidth = window.innerWidth || 800; // Default to 800px if undefined
  const viewportHeight = window.innerHeight || 600; // Default to 600px if undefined

  // Type assertion to silence TypeScript errors without changing behavior
  const visualConfig = VISUAL_CONFIG as any;

  const boardWidth = Math.min(
    viewportWidth * VISUAL_CONFIG.VIEWPORT_WIDTH_RATIO,
    visualConfig.MAX_BOARD_WIDTH
  ) || VISUAL_CONFIG.MIN_BOARD_WIDTH;

  const boardHeight = Math.min(
    viewportHeight * VISUAL_CONFIG.VIEWPORT_HEIGHT_RATIO,
    visualConfig.MAX_BOARD_HEIGHT
  ) || VISUAL_CONFIG.MIN_BOARD_HEIGHT;

  return { boardWidth, boardHeight };
};

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
    rows: difficultyConfig.rows || 1, // Ensure rows is at least 1
    columns: difficultyConfig.columns || 1, // Ensure columns is at least 1
  };

  // Calculate responsive board dimensions
  const { boardWidth, boardHeight } = calculateResponsiveBoardDimensions();

  // Ensure board dimensions are valid
  const validBoardWidth = boardWidth || VISUAL_CONFIG.MIN_BOARD_WIDTH;
  const validBoardHeight = boardHeight || VISUAL_CONFIG.MIN_BOARD_HEIGHT;

  // Create refs
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Use boardRect.width and boardRect.height instead of calculating separately
  const { boardRect, updateBoardRect } = useBoardPosition(containerRef);
  
  // When passing to usePuzzlePieces
  const {
    pieces,
    initializePieces,
    handlePieceMove,
    solvedCount,
    totalPieces,
  } = usePuzzlePieces(
    currentConfig.rows,
    currentConfig.columns,
    boardRect.width > 0 ? boardRect.width : validBoardWidth,
    boardRect.height > 0 ? boardRect.height : validBoardHeight,
    updateBoardRect
  );

  // Update board position when component mounts or resizes
  useEffect(() => {
    const updatePositions = () => {
      updateBoardRect();
      console.log("Board position updated:", boardRect);
    };

    window.addEventListener("resize", updatePositions);
    updatePositions(); // Initial update

    return () => {
      window.removeEventListener("resize", updatePositions);
    };
  }, [updateBoardRect]);

  // Load image and initialize pieces when difficulty or image changes
  useEffect(() => {
    const img = new Image();
    img.src = currentConfig.imageSrc;

    img.onload = () => {
      // Initialize pieces after image loads
      initializePieces();

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
  const visualConfig = VISUAL_CONFIG as any;
  const pieceWidth =
    validBoardWidth && currentConfig.columns
      ? validBoardWidth / currentConfig.columns
      : visualConfig.MIN_PIECE_WIDTH;

  const fullContainerWidth = validBoardWidth * 2 + GAME_SETTINGS.PIECE_TRAY_GAP;

  const maxVisibleHeight = Math.max(
    validBoardHeight || VISUAL_CONFIG.MIN_BOARD_HEIGHT,
    (window.innerHeight || 600) * VISUAL_CONFIG.VIEWPORT_HEIGHT_RATIO
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
            onScramble={initializePieces}
            solvedCount={solvedCount}
            totalPieces={totalPieces}
            difficultyOptions={Object.entries(JIGSAW_DIFFICULTY_PRESETS).map(
              ([key, preset]) => ({
                value: key,
                label: preset.label,
              })
            )}
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
              containerWidth={validBoardWidth}
              containerHeight={validBoardHeight}
              pieceWidth={pieceWidth}
              currentConfig={currentConfig}
              pieces={pieces}
              onDrop={handlePieceDrop}
              boardRef={containerRef}
            />

            {/* Piece Tray/Pile */}
            <PieceTray
              containerWidth={validBoardWidth}
              containerHeight={validBoardHeight}
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
            title="Mashallah! Puzzle Complete!"
            message={`You've completed all ${totalPieces} pieces of the puzzle!`}
            onPlayAgain={initializePieces}
            soundEffect="/audio/takbir.mp3"
          />
        </div>
      </div>
    </DndProvider>
  );
};
