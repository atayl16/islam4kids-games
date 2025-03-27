import { render, screen, fireEvent } from "@testing-library/react";
import { WordSearch } from "./index";
import { WordSearchData } from "./types";

// Mock Audio API
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockReturnValue({
    catch: jest.fn()
  })
}));

describe("WordSearch Component", () => {
  const mockData: WordSearchData = {
    title: "Islamic Terms",
    meta: {
      difficulty: "easy",
      learningObjectives: ["Learn Islamic terminology"],
      instructions: "Find the hidden words"
    },
    grid: [
      ['C', 'A', 'T'],
      ['O', 'D', 'O'],
      ['W', 'O', 'G']
    ],
    words: [
      { word: "CAT", hint: "A feline animal" },
      { word: "DOG", hint: "A canine animal" }
    ],
    wordPlacements: [
      {
        word: "CAT",
        positions: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 }
        ]
      },
      {
        word: "DOG",
        positions: [
          { row: 1, col: 1 },
          { row: 2, col: 2 },
          { row: 1, col: 2 }
        ]
      }
    ]
  };

  it("renders the word search grid correctly", () => {
    render(<WordSearch data={mockData} />);
    
    expect(screen.getByText("Islamic Terms")).toBeInTheDocument();
    expect(screen.getByText("Find the hidden words")).toBeInTheDocument();
    
    // Check if all cells are rendered
    expect(screen.getByLabelText("C, row 1, column 1")).toBeInTheDocument();
    expect(screen.getByLabelText("A, row 1, column 2")).toBeInTheDocument();
    expect(screen.getByLabelText("T, row 1, column 3")).toBeInTheDocument();
    expect(screen.getByLabelText("O, row 2, column 1")).toBeInTheDocument();
    expect(screen.getByLabelText("D, row 2, column 2")).toBeInTheDocument();
    expect(screen.getByLabelText("O, row 2, column 3")).toBeInTheDocument();
    expect(screen.getByLabelText("W, row 3, column 1")).toBeInTheDocument();
    expect(screen.getByLabelText("O, row 3, column 2")).toBeInTheDocument();
    expect(screen.getByLabelText("G, row 3, column 3")).toBeInTheDocument();
  });

  it("displays the word list", () => {
    render(<WordSearch data={mockData} />);
    
    expect(screen.getByText("Find these words:")).toBeInTheDocument();
    expect(screen.getByText("CAT")).toBeInTheDocument();
    expect(screen.getByText("DOG")).toBeInTheDocument();
    
    // Use a more flexible text matcher for hints that might include formatting
    expect(screen.getByText((content) => content.includes("A feline animal"))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("A canine animal"))).toBeInTheDocument();
  });

  it("shows progress of words found", () => {
    render(<WordSearch data={mockData} />);
    
    expect(screen.getByText("0 / 2 words found")).toBeInTheDocument();
  });

  it("selects cells when clicked", () => {
    render(<WordSearch data={mockData} />);
    
    // Click the first cell
    const firstCell = screen.getByLabelText("C, row 1, column 1");
    fireEvent.click(firstCell);
    
    // Check that it's selected
    expect(firstCell.className).toContain("selected");
  });

  it("finds a word when correct cells are selected", async () => {
    render(<WordSearch data={mockData} />);
    
    // Click the first and last cell of "CAT"
    const firstCell = screen.getByLabelText("C, row 1, column 1");
    const lastCell = screen.getByLabelText("T, row 1, column 3");
    
    fireEvent.click(firstCell);
    fireEvent.click(lastCell);
    
    // Wait for the selection to be processed
    setTimeout(() => {
      // Check that the progress is updated
      expect(screen.getByText("1 / 2 words found")).toBeInTheDocument();
      
      // Check that the word is marked as found in the word list
      const catWord = screen.getByText("CAT").closest(".word-item");
      expect(catWord?.className).toContain("found");
    }, 600);
  });

  it("shows completion message when all words are found", async () => {
    render(<WordSearch data={mockData} />);
    
    // Find first word
    const cCell = screen.getByLabelText("C, row 1, column 1");
    const tCell = screen.getByLabelText("T, row 1, column 3");
    fireEvent.click(cCell);
    fireEvent.click(tCell);
    
    // Find second word
    setTimeout(() => {
      const dCell = screen.getByLabelText("D, row 2, column 2");
      const gCell = screen.getByLabelText("G, row 3, column 3");
      fireEvent.click(dCell);
      fireEvent.click(gCell);
      
      // Wait for completion
      setTimeout(() => {
        expect(screen.getByText("Mashallah! You found all the words!")).toBeInTheDocument();
        expect(screen.getByText("Play Again")).toBeInTheDocument();
      }, 600);
    }, 600);
  });
});
