import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { WordSearchContainer } from "./WordSearchContainer";
import { wordSearchPuzzles } from "../registry";

// Mock the WordSearch component
jest.mock("../templates/WordSearch", () => ({
  WordSearch: ({ data }: { data: any }) => (
    <div data-testid="word-search">
      <span>Word Search: {data.id}</span>
    </div>
  ),
}));


// Mock the wordSearchPuzzles registry
jest.mock("../registry", () => {
  const mockWordSearchPuzzles: { [key: string]: jest.Mock } = {
    "valid-puzzle": jest.fn().mockResolvedValue({ 
      id: "valid-puzzle", 
      grid: [["A", "B"], ["C", "D"]], 
      words: ["ABC", "BCD"] 
    }),
  };
  return { 
    wordSearchPuzzles: mockWordSearchPuzzles,
    WordSearchData: jest.fn() 
  };
});

const mockedWordSearchPuzzles = wordSearchPuzzles as unknown as { [key: string]: jest.Mock };

describe("WordSearchContainer", () => {
  it("displays a loading message while the puzzle is being loaded", () => {
    render(
      <MemoryRouter initialEntries={["/wordsearch/valid-puzzle"]}>
        <Routes>
          <Route path="/wordsearch/:gameSlug" element={<WordSearchContainer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading puzzle.../i)).toBeInTheDocument();
  });

  it("displays an error message if the puzzle slug is invalid", () => {
    render(
      <MemoryRouter initialEntries={["/wordsearch/invalid-puzzle"]}>
        <Routes>
          <Route path="/wordsearch/:gameSlug" element={<WordSearchContainer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Puzzle not found/i)).toBeInTheDocument();
  });

  it("displays an error message if loading the puzzle fails", async () => {
    // Mock the behavior of the "valid-puzzle" key to throw an error
    mockedWordSearchPuzzles["valid-puzzle"].mockRejectedValueOnce(new Error("Failed to load puzzle"));

    render(
      <MemoryRouter initialEntries={["/wordsearch/valid-puzzle"]}>
        <Routes>
          <Route path="/wordsearch/:gameSlug" element={<WordSearchContainer />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the error message to appear
    expect(await screen.findByText(/Failed to load puzzle/i)).toBeInTheDocument();
  });

  it("renders the WordSearch component with the correct data when loading succeeds", async () => {
    render(
      <MemoryRouter initialEntries={["/wordsearch/valid-puzzle"]}>
        <Routes>
          <Route path="/wordsearch/:gameSlug" element={<WordSearchContainer />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the WordSearch component to render
    expect(await screen.findByText(/Word Search: valid-puzzle/i)).toBeInTheDocument();
  });
});
