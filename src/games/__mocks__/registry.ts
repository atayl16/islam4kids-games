// Mock for registry.ts to avoid import.meta.glob issues in tests
export const wordScrambleGames: Record<string, () => Promise<{ words: string[] }>> = {
  animals: () => Promise.resolve({ words: ['cat', 'dog', 'bird'] }),
};

export const wordSearchGames: Record<string, () => Promise<{ words: string[] }>> = {
  colors: () => Promise.resolve({ words: ['red', 'blue', 'green'] }),
};

export const jigsawPuzzles: Record<string, () => Promise<any>> = {
  mosque: () => Promise.resolve({
    imageSrc: '/images/jigsaw/mosque.jpg',
    rows: 2,
    columns: 2
  }),
};

export const quizGamePuzzles: Record<string, () => Promise<any[]>> = {
  pillars: () => Promise.resolve([
    { question: 'Test question?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 }
  ]),
};

export const memoryMatchGames: Record<string, () => Promise<any>> = {
  animals: () => Promise.resolve({
    pairs: [
      { id: 1, content: 'Cat', match: 'قط' },
      { id: 2, content: 'Dog', match: 'كلب' }
    ]
  }),
};

export function getAvailableGames() {
  return {
    wordScramble: Object.keys(wordScrambleGames),
    wordSearch: Object.keys(wordSearchGames),
    jigsaw: Object.keys(jigsawPuzzles),
    quiz: Object.keys(quizGamePuzzles),
    memoryMatch: Object.keys(memoryMatchGames),
  };
}

export function getGameLoader(gameType: string, gameKey: string) {
  switch (gameType) {
    case 'word-scramble':
      return wordScrambleGames[gameKey];
    case 'word-search':
      return wordSearchGames[gameKey];
    case 'jigsaw':
      return jigsawPuzzles[gameKey];
    case 'quiz':
      return quizGamePuzzles[gameKey];
    case 'memory-match':
      return memoryMatchGames[gameKey];
    default:
      return null;
  }
}
