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
      console.error("No initial questions provided!");
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
  
    console.log("Formatted questions:", formattedQuestions);
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
  
    console.log("Selected:", selectedAnswerTrimmed);
    console.log("Correct:", correctAnswerTrimmed);
  
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
      <div className="error">No questions available. Please try again.</div>
    );
  }

  return (
    <div className="quiz-game">
      <h2 className="title">Quiz Game</h2>
      <p className="instructions">
        {difficulty === "easy"
          ? "Choose the translation for each term."
          : difficulty === "medium"
          ? "Choose the term for each translation."
          : "Mixed challenge! Both terms and translations will be tested."}
      </p>

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

      <div className="question-container">
        <h3 className="question">{currentQuestion.question}</h3>
        <div className="answers">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              className={`answer ${
                showFeedback
                  ? option === currentQuestion.correctAnswer
                    ? "correct"
                    : selectedAnswer === option &&
                      option !== currentQuestion.correctAnswer
                    ? "incorrect"
                    : ""
                  : selectedAnswer === option
                  ? "selected"
                  : ""
              }`}
              onClick={() => !showFeedback && handleAnswer(option)}
              disabled={showFeedback}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Feedback section with visual cues */}
        <div className="feedback-container">
          {showFeedback && isCorrect && (
            <div
              className="solution-correct-overlay"
              aria-label="Correct answer"
            >
              <div className="checkmark">✓</div>
              <p className="feedback-text">Correct!</p>
            </div>
          )}

          {showFeedback && !isCorrect && (
            <div className="feedback-box">
              <h3>That's not quite right.</h3>
              <p>
                The correct answer is:{" "}
                <strong>{currentQuestion.correctAnswer}</strong>
              </p>
              {currentQuestion.hint && (
                <p className="hint">{currentQuestion.hint}</p>
              )}
            </div>
          )}
        </div>
      </div>

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
