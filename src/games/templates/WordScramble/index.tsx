import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { WordScrambleData } from "./types";
import CompletionOverlay from "../../../components/game-common/CompletionOverlay";
import { PuzzleControls } from "../../../components/game-common/PuzzleControls";
import Letter from "./Letter";

export const WordScramble = ({ data }: { data: WordScrambleData }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [correctSolution, setCorrectSolution] = useState(false);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [filteredWords, setFilteredWords] = useState<typeof data.words>([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false); // State for overlay visibility
  const [isMobile] = useState(() =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );

  // Define difficulty letter count boundaries
  const difficultyRanges = {
    easy: { min: 2, max: 4 },
    medium: { min: 2, max: 7 },
    hard: { min: 2, max: 100 },
  };

  // Filter words based on difficulty level
  useEffect(() => {
    if (data?.words?.length > 0) {
      const range = difficultyRanges[difficulty as keyof typeof difficultyRanges];
      const filtered = data.words.filter((word) => {
        const length = word.solution.length;
        return length >= range.min && length <= range.max;
      });

      if (filtered.length === 0) {
        setFilteredWords(data.words);
      } else {
        setFilteredWords(filtered);
      }

      setCurrentWordIndex(0);
      setIsOverlayVisible(false); // Reset overlay visibility
    }
  }, [difficulty, data]);

  // Initialize word when current index or filtered words change
  useEffect(() => {
    if (filteredWords && filteredWords.length > 0) {
      initializeWord();
    }
  }, [currentWordIndex, filteredWords]);

  const scrambleWord = (solution: string[]): string[] => {
    let scrambled = [...solution];

    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }

    if (scrambled.join("") === solution.join("")) {
      if (scrambled.length >= 2) {
        const pos1 = Math.floor(Math.random() * scrambled.length);
        let pos2 = Math.floor(Math.random() * scrambled.length);
        while (pos2 === pos1) {
          pos2 = Math.floor(Math.random() * scrambled.length);
        }
        [scrambled[pos1], scrambled[pos2]] = [scrambled[pos2], scrambled[pos1]];
      }
    }

    return scrambled;
  };

  const initializeWord = () => {
    if (!filteredWords || filteredWords.length === 0) {
      return;
    }

    if (currentWordIndex >= filteredWords.length) {
      return;
    }

    const currentWord = filteredWords[currentWordIndex];
    if (!currentWord?.solution) {
      return;
    }

    const solution = currentWord.solution.split("");
    const scrambled = scrambleWord(solution);
    setLetters(scrambled);
    setCorrectSolution(false);
  };

  const moveChar = (fromIndex: number, toIndex: number) => {
    const newLetters = [...letters];
    const [removed] = newLetters.splice(fromIndex, 1);
    newLetters.splice(toIndex, 0, removed);
    setLetters(newLetters);
  };

  const playSuccessSound = () => {
    try {
      const audio = new Audio("/audio/success.mp3");
      audio.play().catch((error) => {
        console.error("Failed to play success sound:", error);
      });
    } catch (error) {
      console.error("Error creating audio:", error);
    }
  };

  const checkSolution = () => {
    if (!filteredWords || currentWordIndex >= filteredWords.length) {
      return;
    }

    const currentWord = filteredWords[currentWordIndex];
    if (!currentWord?.solution) return;

    const attempt = letters.join("");

    if (attempt === currentWord.solution) {
      setCorrectSolution(true);
      playSuccessSound();

      setTimeout(() => {
        if (currentWordIndex < filteredWords.length - 1) {
          setCurrentWordIndex((prev) => prev + 1);
        } else {
          setIsOverlayVisible(true); // Show overlay when game is complete
        }
      }, 1500);
    }
  };

  const resetWord = () => {
    initializeWord();
  };

  const resetGame = () => {
    setCurrentWordIndex(0);
    setIsOverlayVisible(false); // Reset overlay visibility
    initializeWord();
  };

  if (!data?.words || data.words.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <p className="text-xl text-slate-600">Loading word puzzle...</p>
      </div>
    );
  }

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent mb-3">
            {data.meta?.title || "Word Scramble"}
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            {data.meta?.instructions ||
              "Rearrange the letters to form the correct word."}
          </p>
        </div>

        {/* Controls */}
        <PuzzleControls
          currentDifficulty={difficulty}
          solvedCount={currentWordIndex}
          totalPieces={filteredWords.length}
          onScramble={resetWord}
          scrambleLabel="Reset Word"
          progressLabel={(solved, total) => `Word ${solved + 1} of ${total}`}
          difficultyOptions={[
            { value: "easy", label: "Easy (2-4 letters only)" },
            { value: "medium", label: "Medium (up to 7 letters)" },
            { value: "hard", label: "Hard (all words)" },
          ]}
          onDifficultyChange={(newDifficulty) => {
            setDifficulty(newDifficulty);
          }}
          hintButton={
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-5 py-2.5 rounded-xl font-medium bg-white text-emerald-600 border-2 border-emerald-500 hover:bg-emerald-50 transition-all duration-200 hover:shadow-lg"
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
          }
        />

        {/* Letter Container */}
        <div className="relative bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-100" role="region">
          <div className="flex flex-wrap justify-center gap-3 min-h-[120px] items-center">
            {letters.map((char, i) => (
              <Letter
                key={i}
                char={char}
                index={i}
                moveChar={moveChar}
                onDrop={checkSolution}
              />
            ))}
          </div>

          {/* Correct Solution Overlay */}
          {correctSolution && (
            <div
              className="absolute inset-0 bg-emerald-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-bounce-in"
              aria-label="Correct solution"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center shadow-hero">
                <span className="text-white text-6xl font-bold">✓</span>
              </div>
            </div>
          )}
        </div>

        {/* Hint Box */}
        {showHint && filteredWords[currentWordIndex] && (
          <div className="bg-violet-50 border-2 border-violet-500 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-violet-700 mb-2">Hint:</h3>
            <p className="text-violet-600 mb-2">
              {filteredWords[currentWordIndex].hint || "No hint available"}
            </p>
            {filteredWords[currentWordIndex].reference && (
              <p className="text-sm text-violet-500 italic">
                Reference: {filteredWords[currentWordIndex].reference}
              </p>
            )}
          </div>
        )}

        {/* Word Translation/Reference */}
        {filteredWords[currentWordIndex] && filteredWords[currentWordIndex].reference && (
          <div className="text-center">
            <p className="text-lg text-slate-600 italic">
              {filteredWords[currentWordIndex].reference}
            </p>
          </div>
        )}

        {/* Completion Overlay */}
        <CompletionOverlay
          isVisible={isOverlayVisible}
          setIsVisible={setIsOverlayVisible}
          title="Mashallah! Word Master!"
          message={`You've unscrambled all ${filteredWords.length} words!`}
          onPlayAgain={resetGame}
          soundEffect="/audio/success.mp3"
        />
      </div>
    </DndProvider>
  );
};
