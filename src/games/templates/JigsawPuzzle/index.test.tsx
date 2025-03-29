import { render, screen, fireEvent } from "@testing-library/react";
import { JigsawPuzzle, JIGSAW_DIFFICULTY_PRESETS } from "./index";

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
      difficulty: "easy" as const,
      learningObjectives: ["Test objective"],
      imageAlt: "Test image description"
    },
    jigsawConfig: {
      imageSrc: "test-image.jpg",
      rows: 3,
      columns: 3
    }
  };

  it("renders without crashing", () => {
    render(<JigsawPuzzle data={mockData} />);
    
    // Check if basic elements are rendered
    expect(screen.getByText(/Scramble Pieces/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Drag pieces to the puzzle board/i)).toBeInTheDocument();
  });

  it("displays difficulty selector with correct options", () => {
    render(<JigsawPuzzle data={mockData} />);
    
    const selector = screen.getByLabelText(/Difficulty:/i);
    expect(selector).toBeInTheDocument();
    
    // Check if all difficulty options are available
    Object.values(JIGSAW_DIFFICULTY_PRESETS).forEach(preset => {
      expect(screen.getByText(preset.label)).toBeInTheDocument();
    });
  });

  it("uses the default difficulty from the puzzle data", () => {
    render(<JigsawPuzzle data={mockData} />);
    
    const selector = screen.getByLabelText(/Difficulty:/i) as HTMLSelectElement;
    expect(selector.value).toBe("easy");
  });

  it("changes difficulty when selector is changed", () => {
    render(<JigsawPuzzle data={mockData} />);
    
    const selector = screen.getByLabelText(/Difficulty:/i) as HTMLSelectElement;
    
    // Change to hard difficulty
    fireEvent.change(selector, { target: { value: "hard" } });
    
    // Check if the value was updated
    expect(selector.value).toBe("hard");
  });
});
