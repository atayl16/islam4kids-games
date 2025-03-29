export interface WordBank {
  meta: {
    title: string;
    description: string;
    category: string;
    difficultyLevels: string[];
    version: string;
  };
  words: WordBankEntry[];
}

export interface WordBankEntry {
  id: string;
  term: string;
  translation: string;
  arabic: string;
  hints: string[];
  references: string[];
  categories: string[];
  games: {
    wordScramble?: {
      scrambled?: string;
    };
    wordSearch?: {
      directions?: string[];
    };
    memory?: {
      image?: string;
    };
    [key: string]: any; // Future game support
  };
}
