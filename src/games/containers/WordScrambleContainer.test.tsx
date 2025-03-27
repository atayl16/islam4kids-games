import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { WordScrambleContainer } from "./WordScrambleContainer";
import { wordScramblePuzzles } from "../registry";

// Mock the WordScramble component to avoid react-dnd ESM issues
jest.mock("../templates/WordScramble", () => ({
  WordScramble: ({ data }: { data: any }) => (
    <div data-testid="word-scramble">
      <span>Word Scramble: {data.id}</span>
    </div>
  ),
}));

// Mock the wordScramblePuzzles registry
jest.mock("../registry", () => {
  const mockWordScramblePuzzles: { [key: string]: jest.Mock } = {
    "valid-puzzle": jest.fn().mockResolvedValue({ id: "valid-puzzle", words: ["apple", "banana"] }),
  };
  return { 
    wordScramblePuzzles: mockWordScramblePuzzles,
    WordScrambleData: jest.fn() 
  };
});

const mockedWordScramblePuzzles = wordScramblePuzzles as unknown as { [key: string]: jest.Mock };

describe("WordScrambleContainer", () => {
  it("displays a loading message while the puzzle is being loaded", () => {
    render(
      <MemoryRouter initialEntries={["/wordscramble/valid-puzzle"]}>
        <Routes>
          <Route path="/wordscramble/:gameSlug" element={<WordScrambleContainer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading puzzle.../i)).toBeInTheDocument();
  });

  it("displays an error message if the puzzle slug is invalid", () => {
    render(
      <MemoryRouter initialEntries={["/wordscramble/invalid-puzzle"]}>
        <Routes>
          <Route path="/wordscramble/:gameSlug" element={<WordScrambleContainer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Puzzle not found/i)).toBeInTheDocument();
  });

  it("displays an error message if loading the puzzle fails", async () => {
    // Mock the behavior of the "valid-puzzle" key to throw an error
    mockedWordScramblePuzzles["valid-puzzle"].mockRejectedValueOnce(new Error("Failed to load puzzle"));

    render(
      <MemoryRouter initialEntries={["/wordscramble/valid-puzzle"]}>
        <Routes>
          <Route path="/wordscramble/:gameSlug" element={<WordScrambleContainer />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the error message to appear
    expect(await screen.findByText(/Failed to load puzzle/i)).toBeInTheDocument();
  });

  it("renders the WordScramble component with the correct data when loading succeeds", async () => {
    render(
      <MemoryRouter initialEntries={["/wordscramble/valid-puzzle"]}>
        <Routes>
          <Route path="/wordscramble/:gameSlug" element={<WordScrambleContainer />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the WordScramble component to render
    expect(await screen.findByText(/Word Scramble: valid-puzzle/i)).toBeInTheDocument();
  });
});
