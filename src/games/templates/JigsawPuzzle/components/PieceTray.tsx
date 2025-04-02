// Renders the tray where unsolved pieces are initially placed
interface PieceTrayProps {
  containerWidth: number;
  containerHeight: number;
  actualPuzzleWidth?: number; // Add this prop to match puzzle dimensions
  actualPuzzleHeight?: number; // Add this prop to match puzzle dimensions
}

export const PieceTray = ({
  containerWidth,
  containerHeight,
  actualPuzzleWidth,
  actualPuzzleHeight
}: PieceTrayProps) => {
  // Use actualPuzzleWidth/Height if provided, otherwise fall back to containerWidth/Height
  const trayWidth = actualPuzzleWidth || containerWidth;
  const trayHeight = actualPuzzleHeight || containerHeight;
  
  return (
    <div
      className="piece-tray"
      style={{
        width: trayWidth,
        height: trayHeight,
        position: "relative",
        marginLeft: "20px",
        flex: "0 0 auto",
      }}
    >
      <div
        style={{
          padding: "8px",
          textAlign: "center",
          color: "#666",
          borderBottom: "1px solid #eee",
        }}
      >
        Drag pieces to the puzzle board
      </div>
    </div>
  );
};
