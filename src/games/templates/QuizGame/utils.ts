import { QuizGameData, QuizQuestion, QuizQuestionInput } from "./types";

/**
 * Validates the structure of the quiz game data.
 * Throws an error if the data is invalid.
 */
export const validateQuizGameData = (data: unknown): QuizGameData => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid quiz game data");
  }
  const quizData = data as QuizGameData;
  if (!quizData.title || !Array.isArray(quizData.questions)) {
    throw new Error("Quiz game data must include a title and questions");
  }
  quizData.questions.forEach((q, index) => {
    if (!q.question || !q.correctAnswer || !Array.isArray(q.options)) {
      throw new Error(`Invalid question at index ${index}`);
    }
  });
  return quizData;
};

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * Returns a new shuffled array.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Formats a time value in seconds into a "MM:SS" string.
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

/**
 * Calculates the final score based on the user's answers and the correct answers.
 */
export const calculateScore = (answers: string[], correctAnswers: string[]): number => {
  return answers.reduce((score, answer, index) => {
    return score + (answer === correctAnswers[index] ? 1 : 0);
  }, 0);
};

/**
 * Generates a set of multiple-choice options for a question.
 * Ensures the correct answer is included and shuffles the options.
 * @param correctAnswer The correct answer for the question
 * @param allAnswers Array of all possible answers to choose from
 * @param numOptions The total number of options to return (default: 4)
 */
export const generateOptions = (
  correctAnswer: string, 
  allAnswers: string[],
  numOptions: number = 4
): string[] => {
  // Filter out the correct answer and make sure we have enough options
  const incorrectOptions = allAnswers.filter(answer => answer !== correctAnswer);

  // Get up to (numOptions-1) incorrect options
  const selectedIncorrectOptions = shuffleArray(incorrectOptions).slice(0, numOptions - 1);
  
  // Combine with correct answer and shuffle again
  return shuffleArray([correctAnswer, ...selectedIncorrectOptions]);
};

/**
 * Creates quiz questions with different formats based on difficulty level
 * @param input The source quiz question input 
 * @param difficulty The difficulty level to create questions for
 */
export const createQuestionByDifficulty = (
  input: QuizQuestionInput,
  difficulty: "easy" | "medium" | "hard"
): QuizQuestion => {
  const { id, term, translation, options, hint } = input;
  
  switch (difficulty) {
    case "easy":
      return {
        id,
        question: `What is the translation for "${term}"?`,
        correctAnswer: translation,
        options,
        term,
        translation,
        hint
      };
    
    case "medium":
      return {
        id,
        question: `What is the term for "${translation}"?`,
        correctAnswer: term,
        options,
        term,
        translation,
        hint
      };
      
    case "hard":
      return {
        id,
        question: `Which term matches this hint: "${hint || 'This is an Islamic term'}"?`,
        correctAnswer: term,
        options,
        term,
        translation,
        hint: `Translation: ${translation}`
      };
      
    default:
      return {
        id,
        question: `What is the translation for "${term}"?`,
        correctAnswer: translation,
        options,
        term,
        translation,
        hint
      };
  }
};
