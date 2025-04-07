import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { QuizGame } from "./index";
import { QuizQuestion } from "./types";

const mockQuestions: QuizQuestion[] = [
  {
    id: "1",
    term: "Ramadan",
    translation: "Month of fasting",
    hint: "The ninth month of the Islamic calendar",
    correctAnswer: "Month of fasting",
    options: ["Month of fasting", "Daily prayer", "Pilgrimage", "Charity"],
    question: "What is the translation for 'Ramadan'?",
  },
  {
    id: "2",
    term: "Eid",
    translation: "Festival",
    hint: "Celebrated after Ramadan",
    correctAnswer: "Festival",
    options: ["Festival", "Prayer", "Greeting", "Book"],
    question: "What is the translation for 'Eid'?",
  },
];

describe("QuizGame Component Tests", () => {
  it("renders the QuizGame component with initial state", () => {
    render(<QuizGame questions={mockQuestions} />);
    expect(screen.getByText("Quiz Game")).toBeInTheDocument();
    expect(screen.getByText("Choose the term for each translation.")).toBeInTheDocument();
    expect(screen.getByText(/What is the term for "Month of fasting"/i)).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
  });

  it("changes difficulty and updates instructions", () => {
    render(<QuizGame questions={mockQuestions} />);
    const difficultySelect = screen.getByRole("combobox");

    fireEvent.change(difficultySelect, { target: { value: "easy" } });
    expect(screen.getByText("Choose the translation for each term.")).toBeInTheDocument();

    fireEvent.change(difficultySelect, { target: { value: "hard" } });
    expect(screen.getByText("Mixed challenge! Both terms and translations will be tested.")).toBeInTheDocument();
  });
  
  it("provides feedback for correct answers", async () => {
    render(<QuizGame questions={mockQuestions} />);
    
    // Find and click the correct answer button (Ramadan is the term for Month of fasting)
    const correctAnswer = screen.getByText("Ramadan");
    fireEvent.click(correctAnswer);
    
    // Verify correct feedback is shown
    await waitFor(() => {
      expect(screen.getByText("Correct!")).toBeInTheDocument();
    });
  });
  
  it("provides feedback for incorrect answers", async () => {
    render(<QuizGame questions={mockQuestions} />);
    
    // We need to ensure we click the WRONG answer
    // From the DOM, we can see the question is asking for the term for "Month of fasting"
    // The correct answer is "Ramadan", so we click "Eid" which is incorrect
    const incorrectAnswer = screen.getByText("Eid");
    fireEvent.click(incorrectAnswer);
    
    // Verify incorrect feedback is shown
    await waitFor(() => {
      const feedbackContainer = document.querySelector(".feedback-box");
      expect(feedbackContainer).not.toBeNull();
      expect(feedbackContainer?.textContent).toContain("That's not quite right");
      expect(feedbackContainer?.textContent).toContain("The correct answer is");
    });
  });

  it("advances to the next question after answering", async () => {
    jest.useFakeTimers();
    render(<QuizGame questions={mockQuestions} />);

    fireEvent.click(screen.getByText("Ramadan"));
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByText(/What is the term for "Festival"/i)).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("displays the completion overlay after all questions are answered", async () => {
    jest.useFakeTimers();
    render(<QuizGame questions={mockQuestions} />);

    fireEvent.click(screen.getByText("Ramadan"));
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    fireEvent.click(screen.getByText("Eid"));
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByText("Mashallah! Quiz Complete!")).toBeInTheDocument();
    expect(screen.getByText("You scored 2 out of 2!")).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("resets the game state when the restart button is clicked", () => {
    render(<QuizGame questions={mockQuestions} />);

    fireEvent.click(screen.getByText("Restart Quiz"));
    expect(screen.getByText(/What is the term for "Month of fasting"/i)).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
  });
});
