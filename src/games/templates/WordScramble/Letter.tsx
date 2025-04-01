import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface LetterProps {
  char: string;
  index: number;
  moveChar: (from: number, to: number) => void;
  onDrop: () => void;
}

const Letter = ({
  char,
  index,
  moveChar,
  onDrop,
}: LetterProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "letter",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_, monitor) => {
      // When drag ends and was dropped on a target
      if (monitor.didDrop()) {
        onDrop(); // Check solution only when letter is actually dropped
      }
    },
  });

  const [, drop] = useDrop({
    accept: "letter",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveChar(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`letter-tile ${isDragging ? "dragging" : ""}`}
      aria-label={`Letter ${char}, position ${index + 1}`}
    >
      {char}
    </div>
  );
};

export default Letter;
