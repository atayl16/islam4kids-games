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

// Import components
import { PuzzleBoard } from "./components/PuzzleBoard";
import { PieceTray } from "./components/PieceTray";
import { Piece } from "./Piece";
import CompletionOverlay from "../../../components/game-common/CompletionOverlay";
import { PuzzleControls } from "../../../components/game-common/PuzzleControls";
import { useProgressContext } from "../../../contexts/ProgressContext";

// Import hooks
import { useBoardPosition } from "./hooks/useBoardPosition";
import { usePuzzlePieces } from "./hooks/usePuzzlePieces";

// Import utilities
import { validateJigsawConfig } from "./utils";

// Calculate responsive board dimensions preserving aspect ratio
const calculateResponsiveBoardDimensions = () => {
  const viewportWidth = window.innerWidth || 800;
  const viewportHeight = window.innerHeight || 600;

  // Type assertion to silence TypeScript errors without changing behavior
  const visualConfig = VISUAL_CONFIG as any;
  
  // Calculate max width considering both board and piece tray need to fit side by side
  const totalAvailableWidth = viewportWidth * 0.9; // Use 90% of viewport width
  const singleBoardMaxWidth = (totalAvailableWidth - GAME_SETTINGS.PIECE_TRAY_GAP) / 2;
  
  // Use fallback values if VISUAL_CONFIG properties are undefined
  const heightRatio = visualConfig.VIEWPORT_HEIGHT_RATIO ?? 0.6; // Reduced to 60%

  // Calculate dimensions with constraints
  const maxAllowedWidth = Math.min(
    singleBoardMaxWidth,
    visualConfig.MAX_BOARD_WIDTH || 800
  );
  
  const maxAllowedHeight = Math.min(
    viewportHeight * heightRatio, 
    visualConfig.MAX_BOARD_HEIGHT || 600
  );

  const boardWidth = Math.max(maxAllowedWidth, visualConfig.MIN_BOARD_WIDTH);
  const boardHeight = Math.max(maxAllowedHeight, visualConfig.MIN_BOARD_HEIGHT);

  return { boardWidth, boardHeight };
};

export const JigsawPuzzle = ({ data, gameSlug }: { data: JigsawConfig; gameSlug: string }) => {
  // Progress tracking
  const { recordGameSession } = useProgressContext();
  const startTimeRef = useRef<number>(Date.now());

  // Validate configuration
  const validatedData = validateJigsawConfig(data);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState(1); // Default to square
  const [imageError, setImageError] = useState<string | null>(null);

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
    rows: difficultyConfig.rows || 1,
    columns: difficultyConfig.columns || 1,
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

  // Load image and get its aspect ratio
  useEffect(() => {
    const img = new Image();
    img.src = currentConfig.imageSrc;

    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      setImageAspectRatio(aspectRatio);
      setImageError(null);

      // Initialize pieces after image loads
      initializePieces();

      // Update board position after pieces are initialized
      setTimeout(updateBoardRect, 50);
    };

    img.onerror = () => {
      console.error('Failed to load image:', currentConfig.imageSrc);
      setImageError('Failed to load puzzle image. Please try again or select a different puzzle.');
    };
  }, [currentConfig.imageSrc, currentDifficulty]);

  // Calculate actual puzzle dimensions that preserve the image aspect ratio
  const puzzleWidth = Math.min(validBoardWidth, validBoardHeight * imageAspectRatio);
  const puzzleHeight = puzzleWidth / imageAspectRatio;

  // Calculate piece size based on the aspect ratio-preserved puzzle dimensions
  const pieceWidth = puzzleWidth / currentConfig.columns;
  const pieceHeight = puzzleHeight / currentConfig.rows;
  
  // Calculate horizontal offset to center the puzzle horizontally, but top align vertically
  const horizontalOffset = Math.max(0, (validBoardWidth - puzzleWidth) / 2);
  const verticalOffset = 0; // Top align the puzzle instead of centering vertically

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
    puzzleWidth,
    puzzleHeight,
    updateBoardRect
  );

  // Update board position when component mounts or resizes
  useEffect(() => {
    const updatePositions = () => {
      updateBoardRect();
    };

    window.addEventListener("resize", updatePositions);
    updatePositions(); // Initial update

    return () => {
      window.removeEventListener("resize", updatePositions);
    };
  }, [updateBoardRect]);

  // Update overlay visibility when the puzzle is solved
  useEffect(() => {
    if (solvedCount === totalPieces && totalPieces > 0) {
      // Record game session before showing overlay
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      recordGameSession({
        gameType: 'jigsawPuzzle',
        gameSlug,
        score: totalPieces, // Score is number of pieces completed
        completed: true,
        timeSpent,
        difficulty: currentDifficulty,
        timestamp: new Date().toISOString(),
      });
      setIsOverlayVisible(true);
    }
  }, [solvedCount, totalPieces, currentDifficulty, gameSlug, recordGameSession]);

  // Handle difficulty change
  const handleDifficultyChange = (difficulty: string) => {
    setCurrentDifficulty(difficulty as keyof typeof JIGSAW_DIFFICULTY_PRESETS);
    startTimeRef.current = Date.now(); // Reset timer when difficulty changes
  };
  
  const fullContainerWidth = validBoardWidth * 2 + GAME_SETTINGS.PIECE_TRAY_GAP;

  const maxVisibleHeight = Math.min(
    validBoardHeight || VISUAL_CONFIG.MIN_BOARD_HEIGHT,
    (window.innerHeight || 600) * 0.9 // 90% of viewport height
  );
  
  // Custom piece drop handler
  const handlePieceDrop = (id: number, x: number, y: number) => {
    // Calculate target positions within the grid using piece dimensions
    const col = id % currentConfig.columns;
    const row = Math.floor(id / currentConfig.columns);

    // Target position calculation
    const targetX = col * pieceWidth;
    const targetY = row * pieceHeight;

    // Calculate the distance between drop position and target position
    const diffX = Math.abs(x - targetX);
    const diffY = Math.abs(y - targetY);
    
    // Use VERY generous thresholds for snapping
    const snapThresholdX = pieceWidth * 2.5; // 250% of piece width
    const snapThresholdY = pieceHeight * 2.5; // 250% of piece height
    
    // Determine if the piece should snap
    const shouldSnap = diffX <= snapThresholdX && diffY <= snapThresholdY;
    
    if (shouldSnap) {
      // If it should snap, use the exact target position
      return handlePieceMove(id, targetX, targetY);
    } else {
      // Otherwise use the actual drop position
      return handlePieceMove(id, x, y);
    }
  };

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className="w-full max-w-7xl mx-auto space-y-6" ref={wrapperRef}>
        {imageError ? (
          <div className="bg-amber-50 border-2 border-amber-500 rounded-2xl p-8 text-center m-8">
            <h3 className="text-2xl font-bold text-amber-600 mb-3">Image Loading Error</h3>
            <p className="text-amber-700">{imageError}</p>
          </div>
        ) : (
          <div
            className="relative"
            style={{
              maxWidth: fullContainerWidth,
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
            className="flex relative items-start"
            style={{
              height: maxVisibleHeight,
            }}
          >
            {/* Puzzle Board */}
            <PuzzleBoard
              pieceWidth={pieceWidth}
              pieceHeight={pieceHeight}
              currentConfig={currentConfig}
              pieces={pieces}
              onDrop={handlePieceDrop}
              boardRef={containerRef}
              horizontalOffset={horizontalOffset}
              verticalOffset={verticalOffset}
            />

            {/* Piece Tray/Pile */}
            <PieceTray
              containerWidth={validBoardWidth}
              containerHeight={validBoardHeight}
            />
          </div>

          {/* Unsolved pieces floating layer */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
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
                  width={pieceWidth}
                  height={pieceHeight}
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
            isVisible={isOverlayVisible}
            setIsVisible={setIsOverlayVisible}
            title="Mashallah! Puzzle Complete!"
            message={`You've completed all ${totalPieces} pieces of the puzzle!`}
            onPlayAgain={() => {
              initializePieces();
              setIsOverlayVisible(false); // Close overlay after restarting
              startTimeRef.current = Date.now(); // Reset timer
            }}
            soundEffect="/audio/success.mp3"
          />
          </div>
        )}
      </div>
    </DndProvider>
  );
};
