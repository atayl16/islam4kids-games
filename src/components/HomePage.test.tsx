import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HomePage } from "./HomePage";

// Mock the getAvailablePuzzles function
jest.mock("../games/registry", () => ({
  getAvailablePuzzles: () => ({
    wordScramble: ["easy-scramble", "hard-scramble"],
    wordSearch: ["easy-search"],
    memoryMatch: ["easy-match", "medium-match"],
    jigsaw: ["example-jigsaw"], // Include a placeholder to render the button
    quizGame: ["basic-quiz", "advanced-quiz"],
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

    expect(screen.getByText(/Easy Scramble/i)).toBeInTheDocument();
    expect(screen.getByText(/Hard Scramble/i)).toBeInTheDocument();
    expect(screen.getByText(/Easy Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Easy Match/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium Match/i)).toBeInTheDocument();
    expect(screen.getByText(/Basic Quiz/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced Quiz/i)).toBeInTheDocument();
  });

  it("filters games correctly when a tab is clicked", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Word Scrambles/i));
    expect(screen.getByText(/Easy Scramble/i)).toBeInTheDocument();
    expect(screen.getByText(/Hard Scramble/i)).toBeInTheDocument();
    expect(screen.queryByText(/Easy Search/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Easy Match/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Basic Quiz/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/Quiz Games/i));
    expect(screen.getByText(/Basic Quiz/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced Quiz/i)).toBeInTheDocument();
    expect(screen.queryByText(/Easy Scramble/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Easy Match/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/Memory Match/i));
    expect(screen.getByText(/Easy Match/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium Match/i)).toBeInTheDocument();
    expect(screen.queryByText(/Basic Quiz/i)).not.toBeInTheDocument();
  });

  it("shows all games when 'All Games' tab is clicked", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Quiz Games/i));
    fireEvent.click(screen.getByText(/All Games/i));

    expect(screen.getByText(/Easy Scramble/i)).toBeInTheDocument();
    expect(screen.getByText(/Hard Scramble/i)).toBeInTheDocument();
    expect(screen.getByText(/Easy Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Easy Match/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium Match/i)).toBeInTheDocument();
    expect(screen.getByText(/Basic Quiz/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced Quiz/i)).toBeInTheDocument();
  });
});
