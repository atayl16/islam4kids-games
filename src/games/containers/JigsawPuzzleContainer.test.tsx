import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { JigsawPuzzleContainer } from "./JigsawPuzzleContainer";
import { jigsawPuzzles } from "../registry";

// Mock the JigsawPuzzle component to avoid react-dnd ESM issues
jest.mock("../templates/JigsawPuzzle", () => ({
  JigsawPuzzle: ({ data }: { data: any }) => (
    <div data-testid="jigsaw-puzzle">
      <span>Jigsaw Puzzle: {data.id}</span>
    </div>
  ),
}));

// Define the type for the mocked jigsawPuzzles
interface MockedJigsawPuzzles {
  "valid-puzzle": jest.Mock<() => Promise<{ id: string; pieces: number }>>;
}

// Mock the jigsawPuzzles registry
jest.mock("../registry", () => {
  const mockJigsawPuzzles: { [key: string]: jest.Mock } = {
    "valid-puzzle": jest.fn().mockResolvedValue({ id: "valid-puzzle", pieces: 100 }),
  };
  return { jigsawPuzzles: mockJigsawPuzzles };
});

const mockedJigsawPuzzles = jigsawPuzzles as unknown as { [key: string]: jest.Mock };

describe("JigsawPuzzleContainer", () => {
  it("displays a loading message while the puzzle is being loaded", () => {
    render(
      <MemoryRouter initialEntries={["/jigsaw/valid-puzzle"]}>
        <Routes>
          <Route path="/jigsaw/:puzzleSlug" element={<JigsawPuzzleContainer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading puzzle.../i)).toBeInTheDocument();
  });

  it("displays an error message if the puzzle slug is invalid", () => {
    render(
      <MemoryRouter initialEntries={["/jigsaw/invalid-puzzle"]}>
        <Routes>
          <Route path="/jigsaw/:puzzleSlug" element={<JigsawPuzzleContainer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Puzzle not found/i)).toBeInTheDocument();
  });

  it("displays an error message if loading the puzzle fails", async () => {
    // Mock the behavior of the "valid-puzzle" key to throw an error
    mockedJigsawPuzzles["valid-puzzle"].mockRejectedValueOnce(new Error("Failed to load puzzle"));

    render(
      <MemoryRouter initialEntries={["/jigsaw/valid-puzzle"]}>
        <Routes>
          <Route path="/jigsaw/:puzzleSlug" element={<JigsawPuzzleContainer />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the error message to appear
    expect(await screen.findByText(/Failed to load puzzle/i)).toBeInTheDocument();
  });

  it("renders the JigsawPuzzle component with the correct data when loading succeeds", async () => {
    render(
      <MemoryRouter initialEntries={["/jigsaw/valid-puzzle"]}>
        <Routes>
          <Route path="/jigsaw/:puzzleSlug" element={<JigsawPuzzleContainer />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the JigsawPuzzle component to render
    expect(await screen.findByText(/Jigsaw Puzzle: valid-puzzle/i)).toBeInTheDocument();
  });
});
