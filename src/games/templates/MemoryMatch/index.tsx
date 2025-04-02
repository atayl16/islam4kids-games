import { useState, useEffect } from "react";
import { WordBankEntry } from "../../../types/WordBank";
import { MemoryCard as MemoryCardComponent } from "./MemoryCard";
import { initializeCards } from "./utils";
import { MemoryCard } from "./types";
import { PuzzleControls } from "../../../components/game-common/PuzzleControls";
import CompletionOverlay from "../../../components/game-common/CompletionOverlay";

type Props = {
  words: WordBankEntry[];
};

export const MemoryMatch = ({ words }: Props) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false); // State for overlay visibility

  // Initialize the cards when the game starts or difficulty changes
  useEffect(() => {
    try {
      const initialCards = initializeCards(words, difficulty);
      setCards(initialCards);
      setMoves(0);
      setFlippedIds([]);
      setError(null);
      setIsOverlayVisible(false); // Reset overlay visibility
    } catch (err) {
      setError(`Couldn't create a game. You need at least 3 words to play.`);
      setCards([]);
    }
  }, [difficulty, words]);

  // Handle card click
  const handleCardClick = (cardId: string) => {
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
              if (flippedIds.includes(card.id)) {
                if (isMatch) {
                  return { ...card, isFlipped: true, isMatched: true };
                }
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
      setIsOverlayVisible(false); // Reset overlay visibility
    } catch (err) {
      setError(`Couldn't create a game. You need at least 3 words to play.`);
      setCards([]);
    }
  };

  const matchedCards = cards.filter((c) => c.isMatched).length;
  const totalPairs = cards.length / 2;
  const isGameComplete = matchedCards === cards.length && cards.length > 0;

  // Show overlay when the game is complete
  useEffect(() => {
    if (isGameComplete) {
      setIsOverlayVisible(true);
    }
  }, [isGameComplete]);

  return (
    <div className="memoryMatch">
      <h2 className="title">Memory Match</h2>
      <p className="instructions">
        Match all the cards to complete the game. Select a difficulty to start.
      </p>

      {error && (
        <div className="errorBox">
          <p>{error}</p>
        </div>
      )}

      <PuzzleControls
        currentDifficulty={difficulty}
        onDifficultyChange={(difficulty: string) => {
          setDifficulty(difficulty as "easy" | "medium" | "hard");
        }}
        onScramble={resetGame}
        solvedCount={matchedCards / 2}
        totalPieces={totalPairs}
        difficultyOptions={[
          { value: "easy", label: "Easy" },
          { value: "medium", label: "Medium" },
          { value: "hard", label: "Hard" },
        ]}
        scrambleLabel="Reset Game"
        progressLabel={(solved, total) => `Matches: ${solved}/${total}`}
        hintButton={
          <button
            onClick={() => setShowHint(!showHint)}
            className="hint-toggle-button"
          >
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
        }
      />

      {showHint && (
        <div className="hintBox">
          <h3>Hint:</h3>
          <p>Try to remember the positions of the cards!</p>
        </div>
      )}

      <div className={`grid ${difficulty} cards-${cards.length}`}>
        {cards.map((card) => (
          <MemoryCardComponent
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card.id)}
            disabled={
              card.isMatched || flippedIds.length === 2 || card.isFlipped
            }
            data-testid="memory-card"
            data-word-id={card.word.id}
          />
        ))}
      </div>

      <div className="status">
        <p>Moves: {moves}</p>
        <p>
          Matches: {matchedCards} / {totalPairs}
        </p>
      </div>
      {/* Completion Overlay */}
      <CompletionOverlay
        isVisible={isOverlayVisible}
        setIsVisible={setIsOverlayVisible} // Pass setIsVisible to allow closing
        title="Mashallah! Great Memory!"
        message={`You found all ${totalPairs} matches in ${moves} moves!`}
        onPlayAgain={resetGame}
        soundEffect="/audio/success.mp3"
      />
    </div>
  );
};
