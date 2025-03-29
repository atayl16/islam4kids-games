// Renders the tray where unsolved pieces are initially placed

interface PieceTrayProps {
  containerWidth: number;
  containerHeight: number;
}

export const PieceTray = ({
  containerWidth,
  containerHeight
}: PieceTrayProps) => {
  return (
    <div
      className="piece-tray"
      style={{
        width: containerWidth,
        height: containerHeight,
        position: "relative",
        marginLeft: "20px",
        border: "1px dashed #ccc",
        borderRadius: "4px",
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
