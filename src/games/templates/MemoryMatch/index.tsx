import { useState, useEffect } from "react";
import { WordBankEntry } from "../../../types/WordBank";
import { MemoryCard as MemoryCardComponent } from "./MemoryCard";
import { initializeCards, getDifficultySettings } from "./utils";
import { MemoryCard } from "./types";
import styles from "./styles.module.css";

type Props = {
  words: WordBankEntry[];
};

export const MemoryMatch = ({ words }: Props) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate available difficulty levels based on word count
  const availableDifficulties = () => {
    // To play any difficulty, we need at least 3 words
    return {
      easy: words.length >= 3,
      medium: words.length >= 3,
      hard: words.length >= 3,
    };
  };

  const difficulties = availableDifficulties();

  // Initialize the cards when the game starts or difficulty changes
  useEffect(() => {
    try {
      const initialCards = initializeCards(words, difficulty);
      setCards(initialCards);
      setMoves(0);
      setFlippedIds([]);
      setError(null);
    } catch (err) {
      setError(`Couldn't create a game. You need at least 3 words to play.`);
      setCards([]);
    }
  }, [difficulty, words]);

  // Handle card click
  const handleCardClick = (cardId: string) => {
    // Prevent flipping more than two cards or flipping the same card twice
    if (flippedIds.length < 2 && !flippedIds.includes(cardId)) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, isFlipped: true } : card
        )
      );
      setFlippedIds((prev) => [...prev, cardId]);
    }
  };

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedIds.length === 2) {
      const [firstCard, secondCard] = flippedIds.map((id) =>
        cards.find((card) => card.id === id)
      );

      if (firstCard && secondCard) {
        const isMatch = firstCard.word.id === secondCard.word.id;

        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) => {
              // For matched cards, set both isFlipped and isMatched to true
              if (flippedIds.includes(card.id)) {
                if (isMatch) {
                  return { ...card, isFlipped: true, isMatched: true };
                }
                // For non-matched cards, flip them back
                return { ...card, isFlipped: false, isMatched: false };
              }
              return card;
            })
          );
          setFlippedIds([]);
        }, 1000);

        setMoves((prev) => prev + 1);
      }
    }
  }, [flippedIds, cards]);

  // Reset the game
  const resetGame = () => {
    try {
      const initialCards = initializeCards(words, difficulty);
      setCards(initialCards);
      setMoves(0);
      setFlippedIds([]);
      setError(null);
    } catch (err) {
      setError(`Couldn't create a game. You need at least 3 words to play.`);
      setCards([]);
    }
  };

  const matchedCards = cards.filter((c) => c.isMatched).length;
  const totalPairs = cards.length / 2;
  const isGameComplete = matchedCards === cards.length && cards.length > 0;

  return (
    <div className={styles.memoryMatch}>
      <h2 className={styles.title}>Memory Match</h2>
      <p className={styles.instructions}>
        Match all the cards to complete the game. Select a difficulty to start.
      </p>

      {error && (
        <div className={styles.errorBox}>
          <p>{error}</p>
        </div>
      )}

      <div className={styles.controls}>
        <button
          className={`${styles.button} ${
            difficulty === "easy" ? styles.active : ""
          }`}
          onClick={() => setDifficulty("easy")}
          disabled={!difficulties.easy}
        >
          Easy
        </button>
        <button
          className={`${styles.button} ${
            difficulty === "medium" ? styles.active : ""
          }`}
          onClick={() => setDifficulty("medium")}
          disabled={!difficulties.medium}
        >
          Medium
        </button>
        <button
          className={`${styles.button} ${
            difficulty === "hard" ? styles.active : ""
          }`}
          onClick={() => setDifficulty("hard")}
          disabled={!difficulties.hard}
        >
          Hard
        </button>
        <button className={styles.button} onClick={resetGame}>
          Reset
        </button>
        <button
          className={styles.button}
          onClick={() => setShowHint(!showHint)}
        >
          {showHint ? "Hide Hint" : "Show Hint"}
        </button>
      </div>

      {showHint && (
        <div className={styles.hintBox}>
          <h3>Hint:</h3>
          <p>Try to remember the positions of the cards!</p>
        </div>
      )}

      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${Math.ceil(
            Math.sqrt(cards.length)
          )}, 1fr)`,
        }}
      >
        {cards.map((card) => (
          <MemoryCardComponent
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card.id)}
            disabled={
              card.isMatched || flippedIds.length === 2 || card.isFlipped
            }
          />
        ))}
      </div>

      <div className={styles.status}>
        <p>Moves: {moves}</p>
        <p>
          Matches: {matchedCards / 2} / {totalPairs}
        </p>
        {isGameComplete && <p className={styles.success}>You Win!</p>}
      </div>
    </div>
  );
};
