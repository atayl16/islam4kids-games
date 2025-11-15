import { render, screen } from '@testing-library/react';
import { AboutPage } from './AboutPage';

describe('AboutPage', () => {
  it('renders the about page heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /About Islam4Kids Games/i })).toBeInTheDocument();
  });

  it('has correct structure with sections', () => {
    const { container } = render(<AboutPage />);
    
    // Check for main container
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toBeTruthy();
    expect(mainDiv).toHaveClass('min-h-screen');
  });

  it('displays features section', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Educational Games/i)).toBeInTheDocument();
  });

  it('has contact information', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
  });

  it('includes email link', () => {
    render(<AboutPage />);
    const emailLink = screen.getByRole('link', { name: /support@islam4kids\.org/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:support@islam4kids.org');
  });

  it('has Tailwind styling classes', () => {
    const { container } = render(<AboutPage />);
    
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen');
    expect(mainDiv).toHaveClass('bg-gradient-to-br');
  });

  it('displays beta testing notice', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Beta Testing/i)).toBeInTheDocument();
  });

  it('includes safe learning environment info', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Safe/i)).toBeInTheDocument();
  });
});
