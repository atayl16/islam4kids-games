import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryMatch } from "./index"; // Fixed import - matches named export
import { WordBankEntry } from "../../../types/WordBank"; // Fixed import to match what component uses

// Mocking words with the correct structure
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

describe("MemoryMatch", () => {
  it("flips cards and checks for matches", async () => {
    const user = userEvent.setup();
    render(<MemoryMatch words={mockWords} />);

    const cards = screen.getAllByTestId("memory-card");
    await user.click(cards[0]);
    await user.click(cards[1]);

    // Wait for the card flip animation
    await waitFor(() => {}, { timeout: 1100 });

    // Check that moves counter was updated
    expect(screen.getByText(/Moves: 1/i)).toBeInTheDocument();
  });

  it("changes difficulty level when buttons are clicked", async () => {
    const user = userEvent.setup();
    
    render(<MemoryMatch words={mockWords} />);
    
    // Initially should be on easy
    const easyButton = screen.getByRole('button', { name: /easy/i });
    expect(easyButton).toHaveClass('active');
    
    // Click medium difficulty
    const mediumButton = screen.getByRole('button', { name: /medium/i });
    await user.click(mediumButton);
    
    // Should now be on medium difficulty
    await waitFor(() => {
      expect(mediumButton).toHaveClass('active');
      expect(easyButton).not.toHaveClass('active');
    });
    
    // Click hard difficulty
    const hardButton = screen.getByRole('button', { name: /hard/i });
    await user.click(hardButton);
    
    // Should now be on hard difficulty
    await waitFor(() => {
      expect(hardButton).toHaveClass('active');
      expect(mediumButton).not.toHaveClass('active');
    });
  });

  it("shows error when insufficient words are provided", async () => {
    render(<MemoryMatch words={mockWords.slice(0, 2)} />); // Only 2 words, less than minimum 3
    
    // Error message should be displayed
    expect(screen.getByText(/Couldn't create a game. You need at least 3 words to play./i)).toBeInTheDocument();
  });

  it("resets game when reset button is clicked", async () => {
    const user = userEvent.setup();
    
    render(<MemoryMatch words={mockWords} />);
    
    // Make some moves
    const cards = screen.getAllByTestId("memory-card");
    await user.click(cards[0]);
    await user.click(cards[1]);
    
    // Wait for animation
    await waitFor(() => {}, { timeout: 1100 });
    
    // Check moves counter has increased
    expect(screen.getByText(/Moves: 1/i)).toBeInTheDocument();
    
    // Click reset button
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);
    
    // Moves should be back to 0
    await waitFor(() => {
      expect(screen.getByText(/Moves: 0/i)).toBeInTheDocument();
    });
  });

  it("shows and hides hint when hint button is clicked", async () => {
    const user = userEvent.setup();
    
    render(<MemoryMatch words={mockWords} />);
    
    // Initially hint should not be visible
    expect(screen.queryByText(/Try to remember the positions/i)).not.toBeInTheDocument();
    
    // Click show hint button
    const hintButton = screen.getByRole('button', { name: /show hint/i });
    await user.click(hintButton);
    
    // Hint should be visible now
    expect(screen.getByText(/Try to remember the positions/i)).toBeInTheDocument();
    
    // Button text should change
    expect(screen.getByRole('button', { name: /hide hint/i })).toBeInTheDocument();
    
    // Click hide hint button
    await user.click(screen.getByRole('button', { name: /hide hint/i }));
    
    // Hint should be hidden again
    expect(screen.queryByText(/Try to remember the positions/i)).not.toBeInTheDocument();
  });
});
