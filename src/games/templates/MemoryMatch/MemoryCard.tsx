import React from "react";
import clsx from "clsx";
import { MemoryCard as MemoryCardType } from "./types";
import styles from "./styles.module.css";

type Props = {
  card: MemoryCardType;
  onClick: () => void;
  disabled?: boolean;
};

export const MemoryCard = React.memo(({ card, onClick, disabled = false }: Props) => (
  <button
    className={clsx(styles.card, {
      [styles.flipped]: card.isFlipped,
      [styles.matched]: card.isMatched,
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
  >
    <div className={styles.inner}>
      {/* Front of the card (hidden side) */}
      <div className={styles.front}>
        <span className={styles.symbol}>❓</span> {/* Generic symbol for hidden cards */}
      </div>

      {/* Back of the card (revealed side) */}
      <div className={styles.back}>
        <h3 className={styles.term}>{card.word.term}</h3>
        <p className={styles.translation}>{card.word.translation}</p>
        <span className={styles.arabic}>{card.word.arabic}</span>
      </div>
    </div>
  </button>
));
