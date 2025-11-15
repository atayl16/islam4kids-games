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
      className={`
        w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
        flex items-center justify-center
        text-3xl sm:text-4xl md:text-5xl font-bold
        rounded-2xl shadow-lg
        cursor-move select-none
        transition-all duration-200
        ${
          isDragging
            ? "opacity-50 scale-95 bg-violet-200 text-violet-700 border-2 border-violet-400"
            : "bg-gradient-to-br from-emerald-500 to-violet-500 text-white border-4 border-white hover:scale-110 hover:shadow-2xl active:scale-95"
        }
      `}
      aria-label={`Letter ${char}, position ${index + 1}`}
    >
      {char}
    </div>
  );
};

export default Letter;
