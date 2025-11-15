import React from "react";
import clsx from "clsx";
import { MemoryCard as MemoryCardType } from "./types";

type Props = {
  card: MemoryCardType;
  onClick: () => void;
  disabled?: boolean;
};

export const MemoryCard = React.memo(({ card, onClick, disabled = false, ...rest }: Props) => (
  <button
    className={clsx(
      // Base card styling
      "relative w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40",
      "transition-all duration-500 cursor-pointer",
      "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-2xl",
      // Perspective for 3D flip
      "[perspective:1000px]",
      // Hover effect when not matched
      !card.isMatched && "hover:scale-105"
    )}
    onClick={onClick}
    disabled={disabled || card.isMatched}
    aria-label={
      card.isMatched
        ? `Matched card showing ${card.word.translation}`
        : card.isFlipped
        ? `Card showing ${card.word.translation}`
        : "Hidden card"
    }
    {...rest}
  >
    <div
      className={clsx(
        // Inner container with flip transform
        "relative w-full h-full transition-transform duration-500",
        "[transform-style:preserve-3d]",
        card.isFlipped && "[transform:rotateY(180deg)]"
      )}
    >
      {/* Front of the card (hidden side) */}
      <div
        className={clsx(
          "absolute w-full h-full rounded-2xl",
          "[backface-visibility:hidden]",
          "bg-gradient-to-br from-emerald-500 to-violet-500",
          "flex items-center justify-center",
          "shadow-lg border-4 border-white",
          card.isMatched && "opacity-50"
        )}
      >
        {/* Decorative pattern on front */}
        <div className="text-white text-5xl opacity-80">🌙</div>
      </div>

      {/* Back of the card (revealed side) */}
      <div
        className={clsx(
          "absolute w-full h-full rounded-2xl",
          "[backface-visibility:hidden] [transform:rotateY(180deg)]",
          "bg-white shadow-lg border-4",
          "flex flex-col items-center justify-center p-3 gap-1",
          card.isMatched
            ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-violet-50"
            : "border-violet-400"
        )}
      >
        {/* Arabic text */}
        <span className="text-2xl sm:text-3xl font-bold text-emerald-600">
          {card.word.arabic}
        </span>

        {/* Term */}
        <h3 className="text-sm sm:text-base font-bold text-slate-700 text-center leading-tight">
          {card.word.term}
        </h3>

        {/* Translation */}
        <p className="text-xs sm:text-sm text-slate-600 text-center leading-tight">
          {card.word.translation}
        </p>
      </div>
    </div>
  </button>
));
