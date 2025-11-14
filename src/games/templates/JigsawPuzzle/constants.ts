// Jigsaw difficulty presets
export const JIGSAW_DIFFICULTY_PRESETS = {
  beginner: {
    rows: 2,
    columns: 3,
    totalPieces: 6,
    label: "Beginner (6 pieces)"
  },
  easy: {
    rows: 3,
    columns: 4,
    totalPieces: 12,
    label: "Easy (12 pieces)"
  },
  medium: {
    rows: 4,
    columns: 5,
    totalPieces: 20,
    label: "Medium (20 pieces)"
  },
  hard: {
    rows: 5,
    columns: 6,
    totalPieces: 30,
    label: "Hard (30 pieces)"
  },
  expert: {
    rows: 6,
    columns: 8,
    totalPieces: 48,
    label: "Expert (48 pieces)"
  }
};

// Maximum and minimum board dimensions
export const MAX_BOARD_WIDTH = 1200; // Maximum width in pixels
export const MAX_BOARD_HEIGHT = 800; // Maximum height in pixels
export const MIN_BOARD_WIDTH = 400; // Minimum width in pixels
export const MIN_BOARD_HEIGHT = 300; // Minimum height in pixels

// Minimum size constraints for better visibility
export const MIN_PIECE_WIDTH = 80; // Minimum width of a puzzle piece
export const MAX_CONTAINER_WIDTH = 900; // Maximum width of the container

// Audio files
export const AUDIO_FILES = {
  SNAP: "/audio/snap.mp3", // Sound for snapping a piece into place
  COMPLETE: "/audio/success.mp3" // Sound for completing the puzzle
};

// Visual configuration
export const VISUAL_CONFIG = {
  VIEWPORT_WIDTH_RATIO: 1.0,
  VIEWPORT_HEIGHT_RATIO: 0.9,
  SNAP_THRESHOLD_RATIO: 1.5,
  SNAP_THRESHOLD_PIXELS: 25, // Fixed pixel snap radius (industry standard: 8-24px)
  MIN_BOARD_WIDTH: 400, // Ensure this is defined
  MIN_BOARD_HEIGHT: 300, // Ensure this is defined
  PILE_WIDTH_RATIO: 0.8,
  PILE_HEIGHT_RATIO: 0.8
};

// Game settings
export const GAME_SETTINGS = {
  PIECE_TRAY_GAP: 20, // Gap between the board and the piece tray
  AUDIO_VOLUME: 0.5 // Default audio volume
};

// Z-index values for layering
export const Z_INDEX = {
  BOARD_BACKGROUND: 1, // Background layer of the board
  BOARD_GRID: 2, // Grid layer of the board
  SOLVED_PIECES: 5, // Layer for solved pieces
  UNSOLVED_PIECES: 10, // Layer for unsolved pieces
  CONTROLS: 20, // Layer for controls
  COMPLETION_OVERLAY: 50 // Layer for the completion overlay
};
