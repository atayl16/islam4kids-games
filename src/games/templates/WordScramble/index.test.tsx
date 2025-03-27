import { render, screen, fireEvent } from "@testing-library/react";
import { WordScramble } from "./index";
import { WordScrambleData } from "./types";

// Mock react-dnd
jest.mock('react-dnd', () => ({
  DndProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDrop: () => [null, jest.fn()]
}));

// Mock react-dnd backends
jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: {}
}));

jest.mock('react-dnd-touch-backend', () => ({
  TouchBackend: {}
}));

// Mock Audio API
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn()
}));

describe("WordScramble Component", () => {
  const mockData: WordScrambleData = {
    meta: {
      title: "Islamic Terms",
      instructions: "Rearrange the letters to form the correct word.",
      difficulty: "easy",
      learningObjectives: ["Learn Islamic terminology", "Improve spelling skills"]
    },
    words: [
      {
        solution: "ISLAM",
        hint: "The religion of peace",
        reference: "Quran 3:19"
      },
      {
        solution: "QURAN",
        hint: "The holy book",
        reference: "Quran 2:2"
      }
    ]
  };

  it("renders the component with correct title and instructions", () => {
    render(<WordScramble data={mockData} />);
    
    expect(screen.getByText("Islamic Terms")).toBeInTheDocument();
    expect(screen.getByText("Rearrange the letters to form the correct word.")).toBeInTheDocument();
  });

  it("displays letter tiles for the scrambled word", () => {
    render(<WordScramble data={mockData} />);
    
    // We can't know the exact scrambled order, but we can check that all letters are present
    const letterRegex = /[ISLAM]/;
    const letterTiles = screen.getAllByLabelText(/Letter [A-Z], position \d+/);
    
    expect(letterTiles.length).toBe(5); // "ISLAM" has 5 letters
    
    letterTiles.forEach(tile => {
      expect(tile.textContent).toMatch(letterRegex);
    });
  });

  it("shows hint when the hint button is clicked", () => {
    render(<WordScramble data={mockData} />);
    
    // The hint should not be visible initially
    expect(screen.queryByText("Hint:")).not.toBeInTheDocument();
    
    // Click the hint button
    fireEvent.click(screen.getByText("Show Hint"));
    
    // Now the hint should be visible
    expect(screen.getByText("Hint:")).toBeInTheDocument();
    expect(screen.getByText("The religion of peace")).toBeInTheDocument();
    expect(screen.getByText("Reference: Quran 3:19")).toBeInTheDocument();
  });

  it("hides hint when the hint button is clicked again", () => {
    render(<WordScramble data={mockData} />);
    
    // Show the hint
    fireEvent.click(screen.getByText("Show Hint"));
    expect(screen.getByText("Hint:")).toBeInTheDocument();
    
    // Hide the hint
    fireEvent.click(screen.getByText("Hide Hint"));
    expect(screen.queryByText("Hint:")).not.toBeInTheDocument();
  });

  it("resets the word when reset button is clicked", () => {
    render(<WordScramble data={mockData} />);
    
    // Get the original letter tiles
    const originalLetterTiles = screen.getAllByLabelText(/Letter [A-Z], position \d+/);
    const originalLetters = originalLetterTiles.map(tile => tile.textContent);
    
    // Click reset
    fireEvent.click(screen.getByText("Reset"));
    
    // Get the new letter tiles
    const newLetterTiles = screen.getAllByLabelText(/Letter [A-Z], position \d+/);
    const newLetters = newLetterTiles.map(tile => tile.textContent);
    
    // The letters might be in a different order after reset, but the same letters should be present
    expect(newLetters.sort()).toEqual(originalLetters.sort());
  });
});
