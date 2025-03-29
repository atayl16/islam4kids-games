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

// Minimum size constraints for better visibility
export const MIN_PIECE_WIDTH = 80;
export const MAX_CONTAINER_WIDTH = 900;

// Audio files
export const AUDIO_FILES = {
  SNAP: "/audio/snap.mp3",
  COMPLETE: "/audio/takbir.mp3"
};

// Visual configuration
export const VISUAL_CONFIG = {
  VIEWPORT_HEIGHT_RATIO: 0.7,
  SNAP_THRESHOLD_RATIO: 1/3,
  PILE_WIDTH_RATIO: 0.8,
  PILE_HEIGHT_RATIO: 0.8
};

// Game settings
export const GAME_SETTINGS = {
  PIECE_TRAY_GAP: 20,
  AUDIO_VOLUME: 0.5
};

// Z-index values for layering
export const Z_INDEX = {
  BOARD_BACKGROUND: 1,
  BOARD_GRID: 2,
  SOLVED_PIECES: 5,
  UNSOLVED_PIECES: 10,
  CONTROLS: 20,
  COMPLETION_OVERLAY: 50
};
