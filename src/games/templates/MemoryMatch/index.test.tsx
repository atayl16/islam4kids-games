import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryMatch } from "./index";
import { WordBankEntry } from "../../../types/WordBank";

const mockWords: WordBankEntry[] = [
  {
    id: "1",
    term: "Shahada",
    translation: "Declaration of Faith",
    arabic: "الشهادة",
    hints: ["First pillar"],
    references: [],
    games: {},
  },
  {
    id: "2",
    term: "Salah",
    translation: "Prayer",
    arabic: "الصلاة",
    hints: ["Second pillar"],
    references: [],
    games: {},
  },
  {
    id: "3",
    term: "Zakat",
    translation: "Charity",
    arabic: "الزكاة",
    hints: ["Third pillar"],
    references: [],
    games: {},
  },
  {
    id: "4",
    term: "Sawm",
    translation: "Fasting",
    arabic: "الصوم",
    hints: ["Fourth pillar"],
    references: [],
    games: {},
  },
  {
    id: "5",
    term: "Hajj",
    translation: "Pilgrimage",
    arabic: "الحج",
    hints: ["Fifth pillar"],
    references: [],
    games: {},
  },
  {
    id: "6",
    term: "Quran",
    translation: "Recitation",
    arabic: "القرآن",
    hints: ["Holy book"],
    references: [],
    games: {},
  },
  {
    id: "7",
    term: "Hadith",
    translation: "Traditions",
    arabic: "الحديث",
    hints: ["Sayings of the Prophet"],
    references: [],
    games: {},
  },
  {
    id: "8",
    term: "Sunnah",
    translation: "Way of life",
    arabic: "السنة",
    hints: ["Actions of the Prophet"],
    references: [],
    games: {},
  },
];

const TEST_IDS = {
  memoryCard: "memory-card",
};

const TEXTS = {
  moves: (count: number) => `Moves: ${count}`,
  error: "Couldn't create a game. You need at least 3 words to play.",
};

const setup = (words = mockWords) => {
  const user = userEvent.setup();
  render(<MemoryMatch words={words} />);
  return { user };
};

const clickDifficultyButton = async (user: ReturnType<typeof userEvent.setup>, difficulty: string) => {
  const button = screen.getByRole("button", { name: new RegExp(difficulty, "i") });
  await user.click(button);
  return button;
};

const getCards = () => screen.getAllByTestId(TEST_IDS.memoryCard);

describe("MemoryMatch", () => {
  it("flips cards and checks for matches", async () => {
    const { user } = setup();

    const cards = getCards();
    await user.click(cards[0]);
    await user.click(cards[1]);

    await waitFor(() => {
      expect(screen.getByText(TEXTS.moves(1))).toBeInTheDocument();
    });
  });

  describe("Difficulty selection", () => {
    it.each([
      ["easy", "medium"],
      ["medium", "hard"],
    ])("changes difficulty from %s to %s", async (from, to) => {
      const { user } = setup();
      const fromButton = await clickDifficultyButton(user, from);
      expect(fromButton).toHaveClass("active");

      const toButton = await clickDifficultyButton(user, to);
      await waitFor(() => {
        expect(toButton).toHaveClass("active");
        expect(fromButton).not.toHaveClass("active");
      });
    });
  });

  it("shows error when insufficient words are provided", async () => {
    setup(mockWords.slice(0, 2)); // Only 2 words, less than minimum 3

    expect(screen.getByText(TEXTS.error)).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.memoryCard)).not.toBeInTheDocument();
  });

  it("resets game when reset button is clicked", async () => {
    const { user } = setup();
    const cards = getCards();
    await user.click(cards[0]);
    await user.click(cards[1]);

    await waitFor(() => {
      expect(screen.getByText(TEXTS.moves(1))).toBeInTheDocument();
    });

    const resetButton = screen.getByRole("button", { name: /reset/i });
    await user.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText(TEXTS.moves(0))).toBeInTheDocument();
    });
  });

  it("shows and hides hint when hint button is clicked", async () => {
    const { user } = setup();

    expect(screen.queryByText(/Try to remember the positions/i)).not.toBeInTheDocument();

    const hintButton = screen.getByRole("button", { name: /show hint/i });
    await user.click(hintButton);

    expect(screen.getByText(/Try to remember the positions/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /hide hint/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /hide hint/i }));
    expect(screen.queryByText(/Try to remember the positions/i)).not.toBeInTheDocument();
  });
});
