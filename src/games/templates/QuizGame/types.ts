import { WordBankEntry } from "../../../types/WordBank";

export interface QuizQuestion {
  id: string;
  question: string; // The question text (e.g., "What is the translation for 'Allah'?")
  correctAnswer: string; // The correct answer
  options: string[]; // Multiple-choice options
  term?: string; // The Islamic term/word (e.g., "Allah")
  translation?: string; // The translation of the term (e.g., "God")
  hint?: string; // Optional hint for the question
}

export interface QuizGameData {
  title: string; // Title of the quiz (e.g., "Islamic Terms Quiz")
  questions: QuizQuestion[]; // Array of quiz questions
  timeLimit?: number; // Optional time limit for the quiz in seconds
}

export interface QuizQuestionInput {
  id: string;
  term: string;
  translation: string;
  options: string[];
  hint?: string;
}

// Helper function to transform WordBankEntries into QuizQuestionInputs
export const transformWordBankToQuizInput = (
  entries: WordBankEntry[]
): QuizQuestionInput[] => {
  return entries.map((entry) => ({
    id: entry.id,
    term: entry.term,
    translation: entry.translation,
    options: [entry.translation], // Will need to be expanded with incorrect options
    hint: entry.hints?.[0] || `A term related to Islam`,
  }));
};
