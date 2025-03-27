import { render } from "@testing-library/react";
import { Piece } from "./Piece";

// Mock react-dnd
jest.mock('react-dnd', () => ({
  useDrag: () => [
    { isDragging: false },
    jest.fn()
  ]
}));

describe("Piece Component", () => {
  const mockProps = {
    id: 1,
    image: "test-image.jpg",
    rows: 3,
    columns: 3,
    size: 100,
    initialX: 50,
    initialY: 50,
    isSolved: false,
    onDrop: jest.fn(),
    checkPosition: jest.fn()
  };

  it("renders with correct styles when not solved", () => {
    render(<Piece {...mockProps} />);
    
    const piece = document.querySelector(".piece") as HTMLElement;
    expect(piece).toBeInTheDocument();
    expect(piece.style.left).toBe("50px");
    expect(piece.style.top).toBe("50px");
    expect(piece.style.backgroundImage).toBe("url(test-image.jpg)");
    expect(piece.style.cursor).toBe("move");
    expect(piece.className).not.toContain("solved");
  });

  it("renders with correct styles when solved", () => {
    const solvedProps = {...mockProps, isSolved: true};
    render(<Piece {...solvedProps} />);
    
    const piece = document.querySelector(".piece") as HTMLElement;
    expect(piece).toBeInTheDocument();
    expect(piece.style.left).toBe("100px"); // col * size = 1 * 100
    expect(piece.style.top).toBe("0px");    // row * size = 0 * 100
    expect(piece.style.cursor).toBe("default");
    expect(piece.className).toContain("solved");
  });

  it("calculates background position correctly", () => {
    render(<Piece {...mockProps} />);
    
    const piece = document.querySelector(".piece") as HTMLElement;
    // Background position should be -col * size and -row * size
    // For id=1, col=1, row=0 in a 3x3 grid
    expect(piece.style.backgroundPosition).toBe("-100px 0px");
    expect(piece.style.backgroundSize).toBe("300px 300px");
  });

  it("handles different piece positions in grid", () => {
    const centerPiece = {...mockProps, id: 4}; // Middle piece in 3x3 grid
    render(<Piece {...centerPiece} />);
    
    const piece = document.querySelector(".piece") as HTMLElement;
    // For id=4, col=1, row=1 in a 3x3 grid
    expect(piece.style.backgroundPosition).toBe("-100px -100px");
  });
});
