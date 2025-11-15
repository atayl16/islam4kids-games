import { useState, useEffect } from "react";
import { QuizQuestion } from "./types";
import CompletionOverlay from "../../../components/game-common/CompletionOverlay";
import { PuzzleControls } from "../../../components/game-common/PuzzleControls";
import { shuffleArray } from "./utils";

type QuizGameProps = {
  questions: QuizQuestion[];
  onDifficultyChange?: (difficulty: string) => void;
};

type Difficulty = "easy" | "medium" | "hard";

export const QuizGame = ({ questions: initialQuestions, onDifficultyChange }: QuizGameProps) => {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Convert questions based on difficulty whenever it changes
  useEffect(() => {
    // Reset game state when difficulty changes
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setIsOverlayVisible(false);

    if (!initialQuestions || initialQuestions.length === 0) {
      return;
    }

    let formattedQuestions: QuizQuestion[] = [];
    
    if (difficulty === "hard") {
      // For hard difficulty, create a mix of both easy and medium questions
      // with a max of 10 questions total
      const easyQuestions = initialQuestions.map((q) => {
        const term = q.term || "Unknown Term";
        const translation = q.translation || "Unknown Translation";
        const hint = q.hint || "No hint available";
        const id = q.id;
        
        const allTranslations = initialQuestions
          .map(q => q.translation || "")
          .filter(t => t && t !== translation);
        
        // Ask for translation, options should be translations only
        const correctAnswer = translation;
        const question = `What is the translation for "${term}"?`;
        
        const randomIncorrectOptions = shuffleArray(allTranslations).slice(0, 3);
        const options = shuffleArray([correctAnswer, ...randomIncorrectOptions]);
        
        return {
          id: `${id}-easy`,
          question,
          correctAnswer,
          options,
          term,
          translation,
          hint
        };
      });
      
      const mediumQuestions = initialQuestions.map((q) => {
        const term = q.term || "Unknown Term";
        const translation = q.translation || "Unknown Translation";
        const hint = q.hint || "No hint available";
        const id = q.id;
        
        const allTerms = initialQuestions
          .map(q => q.term || "")
          .filter(t => t && t !== term);
        
        // Ask for term, options should be terms only
        const correctAnswer = term;
        const question = `What is the term for "${translation}"?`;
        
        const randomIncorrectOptions = shuffleArray(allTerms).slice(0, 3);
        const options = shuffleArray([correctAnswer, ...randomIncorrectOptions]);
        
        return {
          id: `${id}-medium`,
          question,
          correctAnswer,
          options,
          term,
          translation,
          hint
        };
      });
      
      // Combine and shuffle both types of questions, then limit to 10
      formattedQuestions = shuffleArray([...easyQuestions, ...mediumQuestions]).slice(0, 10);
    } else {
      // For easy and medium difficulties, use the existing logic
      formattedQuestions = initialQuestions.map((q) => {
        // Ensure these values are always strings, never undefined
        const term = q.term || "Unknown Term";
        const translation = q.translation || "Unknown Translation";
        const hint = q.hint || "No hint available";
        const id = q.id;
        
        // Get all available terms and translations from all questions for proper options
        const allTerms = initialQuestions.map(q => q.term || "").filter(t => t && t !== term);
        const allTranslations = initialQuestions.map(q => q.translation || "").filter(t => t && t !== translation);
        
        // Create appropriate question and options based on difficulty
        if (difficulty === "easy") {
          // Ask for translation, options should be translations only
          const correctAnswer = translation;
          const question = `What is the translation for "${term}"?`;
          
          // Get 3 random incorrect translations
          const randomIncorrectOptions = shuffleArray(allTranslations).slice(0, 3);
          
          // Combine with correct answer and shuffle
          const options = shuffleArray([correctAnswer, ...randomIncorrectOptions]);
          
          return {
            id,
            question,
            correctAnswer,
            options,
            term,
            translation,
            hint
          };
        } else { // medium
          // Ask for term, options should be terms only
          const correctAnswer = term;
          const question = `What is the term for "${translation}"?`;
          
          // Get 3 random incorrect terms
          const randomIncorrectOptions = shuffleArray(allTerms).slice(0, 3);
          
          // Combine with correct answer and shuffle
          const options = shuffleArray([correctAnswer, ...randomIncorrectOptions]);
          
          return {
            id,
            question,
            correctAnswer,
            options,
            term,
            translation,
            hint
          };
        }
      });
    }

    setQuestions(formattedQuestions);
  }, [difficulty, initialQuestions]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
  
    setSelectedAnswer(answer);
    setShowFeedback(true);
  
    // Strict comparison to ensure correct answer recognition
    const selectedAnswerTrimmed = answer.trim();
    const correctAnswerTrimmed = currentQuestion.correctAnswer.trim();

    const correct = selectedAnswerTrimmed === correctAnswerTrimmed;
    setIsCorrect(correct);
  
    if (correct) {
      setScore((prev) => prev + 1);
    }
  
    // Use different timing based on whether the answer was correct
    const feedbackDelay = correct ? 1000 : 3000; // 1 second for correct, 3 seconds for incorrect
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setIsOverlayVisible(true);
      }
    }, feedbackDelay);
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsOverlayVisible(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty(newDifficulty as Difficulty);
    if (onDifficultyChange) {
      onDifficultyChange(newDifficulty);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="bg-amber-50 border-2 border-amber-500 rounded-2xl p-8 text-center">
        <p className="text-amber-600 font-medium text-lg">No questions available. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent mb-3">
          Quiz Game
        </h2>
        <p className="text-lg md:text-xl text-slate-600">
          {difficulty === "easy"
            ? "Choose the translation for each term."
            : difficulty === "medium"
            ? "Choose the term for each translation."
            : "Mixed challenge! Both terms and translations will be tested."}
        </p>
      </div>

      {/* Controls */}
      <PuzzleControls
        currentDifficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        onScramble={resetGame}
        solvedCount={currentQuestionIndex}
        totalPieces={questions.length}
        difficultyOptions={[
          { value: "easy", label: "Easy" },
          { value: "medium", label: "Medium" },
          { value: "hard", label: "Hard" },
        ]}
        scrambleLabel="Restart Quiz"
        progressLabel={(solved, total) => `Question ${solved + 1} of ${total}`}
      />

      {/* Question Container */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-100 space-y-6">
        {/* Question */}
        <h3 className="text-2xl md:text-3xl font-bold text-slate-700 text-center mb-6">
          {currentQuestion.question}
        </h3>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => {
            const isAnswerCorrect = option === currentQuestion.correctAnswer;
            const isSelected = selectedAnswer === option;
            const isIncorrect = showFeedback && isSelected && !isAnswerCorrect;

            return (
              <button
                key={option}
                className={`
                  px-6 py-4 rounded-xl font-medium text-lg
                  transition-all duration-200
                  border-2
                  ${
                    showFeedback && isAnswerCorrect
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-400 text-white border-emerald-600 shadow-lg scale-105"
                      : isIncorrect
                      ? "bg-gradient-to-br from-amber-500 to-amber-400 text-white border-amber-600 shadow-lg"
                      : isSelected
                      ? "bg-violet-100 text-violet-700 border-violet-400 scale-105"
                      : "bg-white text-slate-700 border-slate-300 hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5"
                  }
                  disabled:cursor-not-allowed
                `}
                onClick={() => !showFeedback && handleAnswer(option)}
                disabled={showFeedback}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {showFeedback && (
          <div className="mt-6 animate-bounce-in">
            {isCorrect ? (
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-bold">✓</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">Correct!</p>
                </div>
              </div>
            ) : (
              <div className="bg-violet-50 border-2 border-violet-500 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-violet-700 mb-3 text-center">That's not quite right.</h3>
                <p className="text-violet-600 text-center mb-2">
                  The correct answer is:{" "}
                  <strong className="text-violet-700 text-lg">{currentQuestion.correctAnswer}</strong>
                </p>
                {currentQuestion.hint && (
                  <p className="text-sm text-violet-500 italic text-center mt-3 pt-3 border-t border-violet-300">
                    💡 {currentQuestion.hint}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Completion Overlay */}
      <CompletionOverlay
        isVisible={isOverlayVisible}
        setIsVisible={setIsOverlayVisible}
        title="Mashallah! Quiz Complete!"
        message={`You scored ${score} out of ${questions.length}!`}
        onPlayAgain={resetGame}
        soundEffect="/audio/success.mp3"
      />
    </div>
  );
};
