import { useDrag } from "react-dnd";
import { useRef, useEffect } from "react";

type PieceProps = {
  id: number;
  image: string;
  rows: number;
  columns: number;
  width: number;
  height: number;
  initialX: number;
  initialY: number;
  isSolved: boolean;
  onDrop: (id: number, x: number, y: number) => boolean;
  boardPosition?: { top: number; left: number };
  style?: React.CSSProperties;
};

export const Piece = ({
  id,
  image,
  rows,
  columns,
  width,
  height,
  initialX,
  initialY,
  isSolved,
  onDrop,
  boardPosition = { top: 0, left: 0 },
  style = {},
}: PieceProps) => {
  const pieceRef = useRef<HTMLDivElement>(null);
  const initialPosition = useRef({ x: initialX, y: initialY });

  // Update initial position when props change
  useEffect(() => {
    initialPosition.current = { x: initialX, y: initialY };
  }, [initialX, initialY]);

  // Log size changes to debug scaling issues
  useEffect(() => {
    console.log(`Piece ${id} dimensions: ${width}px × ${height}px`);
  }, [id, width, height]);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "puzzle-piece",
      item: { id, initialX, initialY },
      canDrag: !isSolved, // Prevent dragging solved pieces
      end: (_, monitor) => {
        const offset = monitor.getDifferenceFromInitialOffset();
        
        if (offset) {
          // Calculate new position
          const x = initialPosition.current.x + offset.x;
          const y = initialPosition.current.y + offset.y;
          
          // Get position relative to board
          const relativeX = x;
          const relativeY = y;
          
          console.log(`Piece ${id} dropped at: abs(${x + boardPosition.left}, ${y + boardPosition.top}) rel(${relativeX}, ${relativeY})`);
          
          // Use the relative position with the board
          const result = onDrop(id, relativeX, relativeY);
          console.log(`Piece ${id} snapping result: ${result}`);
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id, initialX, initialY, isSolved, onDrop, boardPosition]
  );

  // Background position calculations
  const col = id % columns;
  const row = Math.floor(id / columns);
  const backgroundPositionX = -col * width;
  const backgroundPositionY = -row * height;

  // Position on board or at initialX/Y
  const positionLeft = isSolved ? col * width : initialX;
  const positionTop = isSolved ? row * height : initialY;

  return (
    <div
      ref={(node) => {
        drag(node);
        pieceRef.current = node;
      }}
      className={`piece ${isSolved ? "solved" : ""}`}
      style={{
        position: "absolute",
        left: positionLeft,
        top: positionTop,
        width,
        height,
        opacity: isDragging ? 0.5 : 1,
        cursor: isSolved ? "default" : "move",
        transition: isSolved ? "all 0.3s ease" : "opacity 0.1s ease",
        backgroundImage: `url(${image})`,
        backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
        backgroundSize: `${columns * width}px ${rows * height}px`,
        zIndex: isSolved ? 10 : 20,
        boxShadow: isSolved
          ? "0 2px 4px rgba(0,0,0,0.2)"
          : isDragging
          ? "0 5px 10px rgba(0,0,0,0.3)"
          : "none",
        ...style,
      }}
    />
  );
};
