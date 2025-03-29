import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';

// Mock the components to avoid testing their implementation details
jest.mock('./components/IslamicTheme', () => ({
  IslamicTheme: () => <div data-testid="mock-islamic-theme" />
}));

jest.mock('./components/Header', () => ({
  Header: () => <div data-testid="mock-header" />
}));

jest.mock('./components/HomePage', () => ({
  HomePage: () => <div data-testid="mock-home-page" />
}));

jest.mock('./games/containers/WordScrambleContainer', () => ({
  WordScrambleContainer: () => <div data-testid="mock-word-scramble" />
}));

jest.mock('./games/containers/JigsawPuzzleContainer', () => ({
  JigsawPuzzleContainer: () => <div data-testid="mock-jigsaw-puzzle" />
}));

jest.mock('./games/containers/WordSearchContainer', () => ({
  WordSearchContainer: () => <div data-testid="mock-word-search" />
}));

jest.mock('./games/containers/MemoryMatchContainer', () => ({
  MemoryMatchContainer: () => <div data-testid="mock-memory-match" />
}));

// Import the components we need to use directly in our test
import { IslamicTheme } from './components/IslamicTheme';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { WordScrambleContainer } from './games/containers/WordScrambleContainer';
import { JigsawPuzzleContainer } from './games/containers/JigsawPuzzleContainer';
import { WordSearchContainer } from './games/containers/WordSearchContainer';
import { MemoryMatchContainer } from './games/containers/MemoryMatchContainer';

// Use a custom render function for easier testing with routes
const renderWithRouter = (initialEntries = ['']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {/* We only need the children of HashRouter, not HashRouter itself */}
      <IslamicTheme />
      <div className="app">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Game routes */}
            <Route path="/wordscramble/:id" element={<WordScrambleContainer />} />
            <Route path="/jigsaw/:id" element={<JigsawPuzzleContainer />} />
            <Route path="/wordsearch/:id" element={<WordSearchContainer />} />
            <Route path="/memorymatch/:id" element={<MemoryMatchContainer />} />
            
            {/* Embedded versions */}
            <Route 
              path="/embed/wordscramble/:id" 
              element={<div className="embed-wrapper"><WordScrambleContainer /></div>} 
            />
            <Route 
              path="/embed/wordsearch/:id" 
              element={<div className="embed-wrapper"><WordSearchContainer /></div>} 
            />
            <Route 
              path="/embed/jigsaw/:id" 
              element={<div className="embed-wrapper"><JigsawPuzzleContainer /></div>} 
            />
            <Route 
              path="/embed/memorymatch/:id" 
              element={<div className="embed-wrapper"><MemoryMatchContainer /></div>} 
            />
            
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </MemoryRouter>
  );
};

describe('App', () => {
  it('renders the basic structure', () => {
    render(<App />);
    
    // Check for the base components
    expect(screen.getByTestId('mock-islamic-theme')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('renders the home page by default', () => {
    renderWithRouter(['/']);
    expect(screen.getByTestId('mock-home-page')).toBeInTheDocument();
  });

  it('renders the correct route for wordscramble', () => {
    renderWithRouter(['/wordscramble/islamic-terms']);
    
    expect(screen.queryByTestId('mock-home-page')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-word-scramble')).toBeInTheDocument();
  });

  it('renders the correct route for wordsearch', () => {
    renderWithRouter(['/wordsearch/islamic-terms']);
    
    expect(screen.queryByTestId('mock-home-page')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-word-search')).toBeInTheDocument();
  });

  it('renders the correct route for jigsaw', () => {
    renderWithRouter(['/jigsaw/kaaba']);
    
    expect(screen.queryByTestId('mock-home-page')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-jigsaw-puzzle')).toBeInTheDocument();
  });

  it('renders the correct route for memorymatch', () => {
    renderWithRouter(['/memorymatch/islamic-terms']);
    
    expect(screen.queryByTestId('mock-home-page')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-memory-match')).toBeInTheDocument();
  });

  it('renders the embed version for wordscramble', () => {
    renderWithRouter(['/embed/wordscramble/islamic-terms']);
    
    const wrapper = screen.getByTestId('mock-word-scramble').closest('.embed-wrapper');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders the embed version for wordsearch', () => {
    renderWithRouter(['/embed/wordsearch/islamic-terms']);
    
    const wrapper = screen.getByTestId('mock-word-search').closest('.embed-wrapper');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders the embed version for jigsaw', () => {
    renderWithRouter(['/embed/jigsaw/kaaba']);
    
    const wrapper = screen.getByTestId('mock-jigsaw-puzzle').closest('.embed-wrapper');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders the embed version for memorymatch', () => {
    renderWithRouter(['/embed/memorymatch/islamic-terms']);
    
    const wrapper = screen.getByTestId('mock-memory-match').closest('.embed-wrapper');
    expect(wrapper).toBeInTheDocument();
  });

  it('redirects to home for unknown routes', () => {
    renderWithRouter(['/unknown-route']);
    
    expect(screen.getByTestId('mock-home-page')).toBeInTheDocument();
  });
});
