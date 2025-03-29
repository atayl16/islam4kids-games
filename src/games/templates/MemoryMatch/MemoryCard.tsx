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
    className={clsx("card", {
      "flipped": card.isFlipped,
      "matched": card.isMatched,
    })}
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
    <div className="inner">
      {/* Front of the card (hidden side) */}
      <div className="front">
        {/* The front styling is handled via CSS ::after content */}
      </div>

      {/* Back of the card (revealed side) */}
      <div className="back">
        <span className="arabic">{card.word.arabic}</span>
        <h3 className="term">{card.word.term}</h3>
        <p className="translation">{card.word.translation}</p>
      </div>
    </div>
  </button>
));
