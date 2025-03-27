import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./Header";

describe("Header Component", () => {
  it("renders the logo and navigation links", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Check if the logo is rendered
    const logo = screen.getByText(/Islam4Kids Games/i);
    expect(logo).toBeInTheDocument();

    // Check if navigation links are rendered
    const homeLink = screen.getByText(/Home/i);
    const aboutLink = screen.getByText(/About/i);
    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
  });
});
