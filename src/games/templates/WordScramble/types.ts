export interface WordScrambleData {
  meta: {
    title: string;
    difficulty: "easy" | "medium" | "hard";
    learningObjectives: string[];
    instructions: string;
  };
  words: {
    solution: string;
    hint: string;
    reference: string;
  }[];
}
