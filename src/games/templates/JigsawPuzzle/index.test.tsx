import { render, screen } from "@testing-library/react";
import { JigsawPuzzle } from "./index";

// Mock the HTML5Backend and TouchBackend
jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: {}
}));

jest.mock('react-dnd-touch-backend', () => ({
  TouchBackend: {}
}));

// Mock the DndProvider
jest.mock('react-dnd', () => ({
  DndProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock the Audio API
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  volume: 0
}));

describe("JigsawPuzzle Component", () => {
  const mockData = {
    id: "test-puzzle",
    meta: {
      title: "Test Puzzle",
      difficulty: "easy" as const, // Use const assertion for literal type
      learningObjectives: ["Test objective"],
      imageAlt: "Test image description"
    },
    jigsawConfig: {
      imageSrc: "test-image.jpg",
      rows: 2,
      columns: 2
    }
  };

  it("renders without crashing", () => {
    render(<JigsawPuzzle data={mockData} />);
    
    // Check if basic elements are rendered
    expect(screen.getByText(/Scramble Pieces/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Drag pieces to the puzzle board/i)).toBeInTheDocument();
  });
});
