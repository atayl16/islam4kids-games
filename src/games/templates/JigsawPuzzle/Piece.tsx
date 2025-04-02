import { useDrag } from "react-dnd";
import { useRef, useEffect } from "react";

type PieceProps = {
  id: number;
  image: string;
  rows: number;
  columns: number;
  size: number;
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
  size,
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
    console.log(`Piece ${id} size: ${size}px`);
  }, [id, size]);

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

          // Adjust position relative to board
          const relativeX = x - boardPosition.left;
          const relativeY = y - boardPosition.top;

          console.log(
            `Piece ${id} dropped at: abs(${x}, ${y}) rel(${relativeX}, ${relativeY})`
          );

          // Pass to onDrop which will handle snapping and solving
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
  const backgroundPositionX = -col * size;
  const backgroundPositionY = -row * size;

  // Position on board or at initialX/Y
  const positionLeft = isSolved ? col * size : initialX;
  const positionTop = isSolved ? row * size : initialY;

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
        width: size,
        height: size,
        opacity: isDragging ? 0.5 : 1,
        cursor: isSolved ? "default" : "move",
        transition: isSolved ? "all 0.3s ease" : "opacity 0.1s ease",
        backgroundImage: `url(${image})`,
        backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
        backgroundSize: `${columns * size}px ${rows * size}px`,
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
