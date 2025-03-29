import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HomePage } from "./HomePage";

// Mock the getAvailablePuzzles function
jest.mock("../games/registry", () => ({
  getAvailablePuzzles: () => ({
    wordScramble: ["easy-scramble", "hard-scramble"],
    wordSearch: ["easy-search"],
    memoryMatch: ["easy-match", "medium-match"],
    jigsaw: [],
  }),
}));

describe("HomePage Component", () => {
  it("renders the header and description", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Islamic Games Hub/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Fun educational games to learn about Islam/i)
    ).toBeInTheDocument();
  });

  it("displays all games by default", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Match game titles based on their rendered content
    expect(screen.getByText(/Easy Scramble/i)).toBeInTheDocument();
    expect(screen.getByText(/Hard Scramble/i)).toBeInTheDocument();
    expect(screen.getByText(/Easy Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Easy Match/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium Match/i)).toBeInTheDocument();
  });

  it("filters games correctly when a tab is clicked", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Click on the "Word Scrambles" tab
    fireEvent.click(screen.getByText(/Word Scrambles/i));
    expect(screen.getByText(/Easy Scramble/i)).toBeInTheDocument();
    expect(screen.getByText(/Hard Scramble/i)).toBeInTheDocument();
    expect(screen.queryByText(/Easy Search/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Easy Match/i)).not.toBeInTheDocument();

    // Click on the "Word Searches" tab
    fireEvent.click(screen.getByText(/Word Searches/i));
    expect(screen.getByText(/Easy Search/i)).toBeInTheDocument();
    expect(screen.queryByText(/Easy Scramble/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Easy Match/i)).not.toBeInTheDocument();
    
    // Click on the "Memory Match" tab
    fireEvent.click(screen.getByText(/Memory Match/i));
    expect(screen.getByText(/Easy Match/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium Match/i)).toBeInTheDocument();
    expect(screen.queryByText(/Easy Search/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Easy Scramble/i)).not.toBeInTheDocument();
  });
  
  it("shows all games when 'All Games' tab is clicked", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // First click on a specific category
    fireEvent.click(screen.getByText(/Word Scrambles/i));
    
    // Then click back on "All Games"
    fireEvent.click(screen.getByText(/All Games/i));
    
    // Verify all games are shown
    expect(screen.getByText(/Easy Scramble/i)).toBeInTheDocument();
    expect(screen.getByText(/Hard Scramble/i)).toBeInTheDocument();
    expect(screen.getByText(/Easy Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Easy Match/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium Match/i)).toBeInTheDocument();
  });
});
